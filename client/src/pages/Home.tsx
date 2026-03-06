import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Search, Dog, BookOpen, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Breed } from "@shared/schema";
import { breedGroups } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";
import { useCanonical } from "@/hooks/useCanonical";

export default function Home() {
  useCanonical("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: popularBreeds, isLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds?limit=12"],
  });

  const { data: breedCount } = useQuery<{ count: number }>({
    queryKey: ["/api/breeds/count"],
  });

  return (
    <div>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Complete Guide to Every <span className="text-primary">Dog Breed</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Explore all {breedCount?.count || 205} AKC-recognized breeds. Compare traits, take our breed quiz, and find your ideal companion.
          </p>

          <div className="max-w-lg mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search breeds..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/breeds?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              data-testid="input-hero-search"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/breeds">
              <Button size="lg" data-testid="button-browse-breeds">
                <Dog className="mr-2 h-5 w-5" /> Browse All Breeds
              </Button>
            </Link>
            <Link href="/dog-breed-selector">
              <Button size="lg" variant="outline" data-testid="button-take-quiz">
                <Heart className="mr-2 h-5 w-5" /> Take the Breed Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center" data-testid="text-groups-title">Browse by Group</h2>
          <p className="text-muted-foreground text-center mb-8">All AKC breed groups</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {breedGroups.map((group) => (
              <Link key={group} href={`/breeds?group=${group}`}>
                <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                  <CardContent className="p-4 text-center">
                    <Dog className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium" data-testid={`text-group-${group.toLowerCase()}`}>{group}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold" data-testid="text-popular-title">Popular Breeds</h2>
              <p className="text-muted-foreground mt-1">Most popular AKC breeds</p>
            </div>
            <Link href="/breeds">
              <Button variant="outline" data-testid="link-view-all-breeds">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularBreeds?.slice(0, 12).map((breed) => (
                <Link key={breed.id} href={`/breeds/${breed.slug}`}>
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full overflow-hidden" data-testid={`card-breed-${breed.slug}`}>
                    {getBreedImage(breed.slug) && (
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={getBreedImage(breed.slug)}
                          alt={breed.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          data-testid={`img-breed-${breed.slug}`}
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-base">{breed.name}</h3>
                        <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                          #{breed.popularity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                        <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {breed.temperamentSummary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-features-title">Why Dog Breeds & Needs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Dog className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">205 AKC Breeds</h3>
                <p className="text-sm text-muted-foreground">
                  Complete directory of every AKC-recognized breed with detailed profiles.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Ethical Sourcing</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to find responsible breeders and ethical adoption options.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Product Picks</h3>
                <p className="text-sm text-muted-foreground">
                  Curated product recommendations tailored to your breed's needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
