import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { articleCategories, type Article } from "@shared/schema";

function formatDate(d: string | Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  useCanonical("/blog");
  usePageMeta(
    "Dog Care Blog: Breed Guides, Adoption & Lifestyle Articles | Dog Breeds & Needs",
    "In-depth dog care articles: best apartment dogs, hypoallergenic breeds, first-time owner guides, ethical adoption, and more, written for real dog owners."
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const { data: articles, isLoading } = useQuery<Article[]>({ queryKey: ["/api/articles"] });

  const filtered = useMemo(() => {
    if (!articles) return [];
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.metaDescription.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, search, category]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-blog-title">Dog Care Blog</h1>
          <p className="text-muted-foreground" data-testid="text-blog-subtitle">
            Breed guides, lifestyle tips, adoption advice, and honest answers to the questions every dog owner asks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" data-testid="filters-category">
          {(["All", ...articleCategories] as const).map((c) => {
            const active = category === c;
            return (
              <Button
                key={c}
                size="sm"
                variant={active ? "default" : "outline"}
                onClick={() => setCategory(c)}
                data-testid={`filter-category-${c.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {c}
              </Button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12" data-testid="text-no-articles">
            No articles match your filters.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`}>
                <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-article-${a.slug}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" data-testid={`badge-category-${a.slug}`}>{a.category}</Badge>
                      {a.publishedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(a.publishedAt)}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-snug" data-testid={`text-article-title-${a.slug}`}>
                      {a.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-article-desc-${a.slug}`}>
                      {a.metaDescription}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
