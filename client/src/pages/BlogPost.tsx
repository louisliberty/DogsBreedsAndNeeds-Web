import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { renderMarkdown } from "@/components/MarkdownEditor";
import type { Article } from "@shared/schema";

function formatDate(d: string | Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    enabled: !!slug,
  });

  useCanonical(slug ? `/blog/${slug}` : "/blog");
  usePageMeta(
    article ? `${article.title} | Dog Breeds & Needs` : "Article | Dog Breeds & Needs",
    article?.metaDescription || ""
  );

  if (isLoading) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-16 px-4 text-center">
        <p className="text-muted-foreground mb-4" data-testid="text-article-not-found">Article not found.</p>
        <Link href="/blog">
          <Button variant="outline" data-testid="button-back-to-blog">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Articles
          </Button>
        </Link>

        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground" data-testid="breadcrumb-current">{article.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" data-testid="badge-article-category">{article.category}</Badge>
          {!article.publishedAt && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">Draft</Badge>
          )}
          {article.publishedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid="text-article-date">
              <Calendar className="h-3 w-3" /> {formatDate(article.publishedAt)}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid="text-article-author">
            <User className="h-3 w-3" /> {article.author}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight" data-testid="text-article-title">
          {article.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6" data-testid="text-article-meta-description">
          {article.metaDescription}
        </p>

        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full rounded-lg mb-6"
            data-testid="img-article-featured"
          />
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed"
          data-testid="article-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        {article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t" data-testid="article-tags">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((t) => (
              <Badge key={t} variant="outline" data-testid={`tag-${t}`}>{t}</Badge>
            ))}
          </div>
        )}

        <div className="mt-10 pt-6 border-t flex flex-wrap gap-3">
          <Link href="/blog">
            <Button variant="outline" data-testid="button-more-articles">
              <ArrowLeft className="mr-2 h-4 w-4" /> More Articles
            </Button>
          </Link>
          <Link href="/dog-breed-selector">
            <Button data-testid="button-take-quiz">Take the Breed Quiz</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
