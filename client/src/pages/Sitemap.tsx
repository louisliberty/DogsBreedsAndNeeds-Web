import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Breed, Article } from "@shared/schema";
import { breedGroups } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Sitemap() {
  useCanonical("/sitemap");
  usePageMeta(
    "Sitemap: All Dog Breeds & Pages | Dog Breeds & Needs",
    "View the complete sitemap for Dog Breeds & Needs. Browse all 205 AKC breed pages organized by group, plus guides, products, and tools."
  );
  const { data: breeds, isLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });
  const { data: articles } = useQuery<Article[]>({ queryKey: ["/api/articles"] });

  const breedsByGroup = breedGroups.reduce((acc, group) => {
    acc[group] = breeds?.filter((b) => b.breedGroup === group) || [];
    return acc;
  }, {} as Record<string, Breed[]>);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Map className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-sitemap-title">Dog Breeds & Needs Sitemap</h1>
          <p className="text-muted-foreground">Complete directory of all pages on DogBreedsAndNeeds.com</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3 border-b pb-2">Main Pages</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/breeds", label: "All Breeds" },
                { href: "/dog-breed-selector", label: "Breed Quiz" },
                { href: "/ethical-sourcing", label: "Ethical Sourcing Guide" },
                { href: "/find-a-breeder", label: "Find an Ethical Breeder" },
                { href: "/poodle-rescue", label: "Poodle Rescue Organizations" },
                { href: "/blog", label: "Blog" },
                { href: "/products", label: "Products" },
                { href: "/products/how-we-choose", label: "How We Choose Products" },
                { href: "/sitemap", label: "Sitemap" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-primary hover:underline cursor-pointer" data-testid={`link-sitemap-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2" data-testid="text-sitemap-breeds">
              All Breeds by Group ({breeds?.length || 0} total)
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {breedGroups.map((group) => (
                  <div key={group}>
                    <h3 className="text-base font-semibold mb-2 text-primary">
                      {group} Group ({breedsByGroup[group]?.length || 0})
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                      {breedsByGroup[group]?.map((breed) => (
                        <li key={breed.id}>
                          <Link href={`/breeds/${breed.slug}`}>
                            <span className="text-sm hover:text-primary hover:underline cursor-pointer" data-testid={`link-sitemap-breed-${breed.slug}`}>
                              {breed.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {articles && articles.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 border-b pb-2" data-testid="text-sitemap-articles">
                Blog Articles ({articles.length})
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {articles.map((a) => (
                  <li key={a.id}>
                    <Link href={`/blog/${a.slug}`}>
                      <span className="text-sm text-primary hover:underline cursor-pointer" data-testid={`link-sitemap-article-${a.slug}`}>
                        {a.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
