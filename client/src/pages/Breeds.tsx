import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Search, Dog, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { breedGroups, sizeCategories, energyLevels } from "@shared/schema";
import type { Breed } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Breeds() {
  useCanonical("/breeds");
  usePageMeta(
    "All 205 AKC Dog Breeds: Browse, Search & Compare | Dog Breeds & Needs",
    "Browse the complete list of 205 AKC-recognized dog breeds. Filter by size, energy level, and breed group to compare traits and find your ideal companion."
  );
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialSearch = params.get("search") || "";
  const initialGroup = params.get("group") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedEnergy, setSelectedEnergy] = useState("");
  const [showFilters, setShowFilters] = useState(!!initialGroup);

  const { data: breeds, isLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  const filtered = useMemo(() => {
    if (!breeds) return [];
    return breeds.filter((b) => {
      if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedGroup && b.breedGroup !== selectedGroup) return false;
      if (selectedSize && b.sizeCategory !== selectedSize) return false;
      if (selectedEnergy && b.energyLevel !== selectedEnergy) return false;
      return true;
    });
  }, [breeds, searchQuery, selectedGroup, selectedSize, selectedEnergy]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-breeds-title">All 205 AKC Dog Breeds</h1>
          <p className="text-muted-foreground">
            Browse all {breeds?.length || 205} AKC-recognized breeds
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search breeds..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-breed-search"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-card rounded-lg border" data-testid="filter-panel">
            <div className="w-full text-sm font-medium mb-1">Breed Group</div>
            <div className="flex flex-wrap gap-1.5 mb-3 w-full">
              <Badge
                variant={selectedGroup === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedGroup("")}
                data-testid="filter-group-all"
              >
                All
              </Badge>
              {breedGroups.map((g) => (
                <Badge
                  key={g}
                  variant={selectedGroup === g ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedGroup(selectedGroup === g ? "" : g)}
                  data-testid={`filter-group-${g.toLowerCase()}`}
                >
                  {g}
                </Badge>
              ))}
            </div>
            <div className="w-full text-sm font-medium mb-1">Size</div>
            <div className="flex flex-wrap gap-1.5 mb-3 w-full">
              <Badge
                variant={selectedSize === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSize("")}
              >
                All
              </Badge>
              {sizeCategories.map((s) => (
                <Badge
                  key={s}
                  variant={selectedSize === s ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                  data-testid={`filter-size-${s.toLowerCase()}`}
                >
                  {s}
                </Badge>
              ))}
            </div>
            <div className="w-full text-sm font-medium mb-1">Energy Level</div>
            <div className="flex flex-wrap gap-1.5 w-full">
              <Badge
                variant={selectedEnergy === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedEnergy("")}
              >
                All
              </Badge>
              {energyLevels.map((e) => (
                <Badge
                  key={e}
                  variant={selectedEnergy === e ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedEnergy(selectedEnergy === e ? "" : e)}
                  data-testid={`filter-energy-${e.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4" data-testid="text-breed-count">
          Showing {filtered.length} breeds
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((breed) => (
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
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{breed.name}</h3>
                      <span className="text-xs text-muted-foreground">#{breed.popularity}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                      <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
                      <Badge variant="outline" className="text-xs">{breed.energyLevel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {breed.temperamentSummary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Dog className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No breeds found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
