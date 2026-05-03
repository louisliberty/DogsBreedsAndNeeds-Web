import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { useMemo } from "react";
import { Heart, ArrowLeft, Mail, Phone, ExternalLink, Dog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getBreedImage } from "@/lib/breedImages";
import type { Breed, RescueOrganization } from "@shared/schema";

function RescueHub() {
  useCanonical("/rescue");
  usePageMeta(
    "Dog Breed Rescue Directory: Find Breed-Specific Rescues by Breed | Dog Breeds & Needs",
    "Browse rescue organizations for 20+ popular dog breeds. Adopt a Golden Retriever, Labrador, German Shepherd, Bulldog, Beagle, and more from breed-specific rescues nationwide.",
  );

  const { data: rescues, isLoading: rescuesLoading } = useQuery<RescueOrganization[]>({
    queryKey: ["/api/rescues"],
  });
  const { data: breeds, isLoading: breedsLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  const grouped = useMemo(() => {
    if (!rescues || !breeds) return null;
    const breedBySlug = new Map(breeds.map((b) => [b.slug, b]));
    const counts = new Map<string, number>();
    for (const r of rescues) counts.set(r.breedSlug, (counts.get(r.breedSlug) || 0) + 1);
    const items = Array.from(counts.entries())
      .map(([slug, count]) => {
        const breed = breedBySlug.get(slug);
        return breed ? { breed, count } : null;
      })
      .filter((x): x is { breed: Breed; count: number } => Boolean(x));
    type GroupItem = { breed: Breed; count: number };
    const byGroup: Record<string, GroupItem[]> = {};
    for (const item of items) {
      const g = item.breed.breedGroup;
      if (!byGroup[g]) byGroup[g] = [];
      byGroup[g].push(item);
    }
    return Object.entries(byGroup)
      .map(([g, list]) => [g, list.sort((a: GroupItem, b: GroupItem) => a.breed.name.localeCompare(b.breed.name))] as [string, GroupItem[]])
      .sort(([a], [b]) => a.localeCompare(b));
  }, [rescues, breeds]);

  if (rescuesLoading || breedsLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Skeleton className="h-12 w-2/3 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const totalOrgs = rescues?.length || 0;
  const totalBreeds = grouped?.reduce((sum, [, list]) => sum + list.length, 0) || 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-rescue-hub-title">
            Dog Breed Rescue Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            Browse breed-specific rescue organizations across the United States. Adopting from a breed-specific rescue means your new dog comes from foster care with people who know the breed inside and out.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" data-testid="badge-rescue-count">{totalOrgs} rescue organizations</Badge>
            <Badge variant="secondary" data-testid="badge-breed-count">{totalBreeds} breeds</Badge>
          </div>
        </div>

        {grouped?.map(([group, items]) => (
          <div key={group} className="mb-8" data-testid={`section-rescue-group-${group.toLowerCase().replace(/\s+/g, "-")}`}>
            <h2 className="text-xl font-semibold mb-4">{group} Group</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ breed, count }) => (
                <Link key={breed.slug} href={`/rescue/${breed.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-rescue-breed-${breed.slug}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      {getBreedImage(breed.slug) && (
                        <img
                          src={getBreedImage(breed.slug)}
                          alt={`${breed.name} dog breed`}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{breed.name}</h3>
                        <p className="text-xs text-muted-foreground">{count} rescue{count !== 1 ? "s" : ""}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <Card className="border-primary/20 bg-primary/5 mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Don't see a rescue for your breed? Browse the AKC Marketplace or read our ethical sourcing guide for more options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/find-a-breeder">
                <Button variant="outline" data-testid="link-find-breeder">
                  Find an Ethical Breeder
                </Button>
              </Link>
              <Link href="/ethical-sourcing">
                <Button variant="outline" data-testid="link-ethical-sourcing">
                  Ethical Sourcing Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RescueBreed({ breedSlug }: { breedSlug: string }) {
  useCanonical(`/rescue/${breedSlug}`);

  const { data: rescues, isLoading: rescuesLoading } = useQuery<RescueOrganization[]>({
    queryKey: ["/api/rescues", breedSlug],
  });
  const { data: breed, isLoading: breedLoading } = useQuery<Breed>({
    queryKey: ["/api/breeds", breedSlug],
  });

  usePageMeta(
    breed
      ? `${breed.name} Rescue Organizations: Adopt a ${breed.name} Near You | Dog Breeds & Needs`
      : "Breed Rescue Organizations | Dog Breeds & Needs",
    breed
      ? `Directory of ${breed.name} rescue organizations across the United States. Find a ${breed.name} to adopt — contact info, regions served, and websites for each rescue.`
      : "Browse breed-specific rescue organizations across the United States.",
  );

  if (rescuesLoading || breedLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Skeleton className="h-12 w-2/3 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!breed || !rescues || rescues.length === 0) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h1 className="text-2xl font-bold mb-3" data-testid="text-rescue-not-found">No rescues listed yet</h1>
        <p className="text-muted-foreground mb-6">
          We don't have a rescue directory for this breed yet. Browse the full directory or read the breed profile.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/rescue">
            <Button variant="outline" data-testid="button-back-rescue-hub">
              <ArrowLeft className="mr-2 h-4 w-4" /> Rescue Directory
            </Button>
          </Link>
          {breed && (
            <Link href={`/breeds/${breed.slug}`}>
              <Button variant="outline" data-testid="button-view-breed">
                <Dog className="mr-2 h-4 w-4" /> {breed.name} Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const breedImage = getBreedImage(breed.slug);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href="/rescue">
            <Button variant="ghost" data-testid="button-back-rescue-hub">
              <ArrowLeft className="mr-2 h-4 w-4" /> Rescue Directory
            </Button>
          </Link>
          <Link href={`/breeds/${breed.slug}`}>
            <Button variant="ghost" data-testid="button-back-breed">
              <Dog className="mr-2 h-4 w-4" /> {breed.name} Profile
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-rescue-breed-title">
            {breed.name} Rescue Organizations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {rescues.length} rescue organization{rescues.length !== 1 ? "s" : ""} placing {breed.name}s in adoptive homes across the United States.
          </p>
        </div>

        {breedImage && (
          <div className="flex justify-center mb-8">
            <img
              src={breedImage}
              alt={`${breed.name} dog breed portrait`}
              className="w-48 h-36 rounded-xl object-cover"
            />
          </div>
        )}

        <div className="grid gap-4 mb-8">
          {rescues.map((org) => (
            <Card key={org.id} data-testid={`card-rescue-org-${org.id}`}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3 text-base">
                  <span data-testid={`text-rescue-name-${org.id}`}>{org.name}</span>
                  <Badge variant="outline" className="shrink-0" data-testid={`badge-rescue-region-${org.id}`}>
                    {org.region}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {org.description && (
                  <p className="text-sm text-muted-foreground" data-testid={`text-rescue-description-${org.id}`}>
                    {org.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {org.url && (
                    <a href={org.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" data-testid={`link-rescue-website-${org.id}`}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Visit Website
                      </Button>
                    </a>
                  )}
                  {org.email && (
                    <a href={`mailto:${org.email}`}>
                      <Button size="sm" variant="outline" data-testid={`link-rescue-email-${org.id}`}>
                        <Mail className="mr-1.5 h-3.5 w-3.5" />
                        <span className="break-all">{org.email}</span>
                      </Button>
                    </a>
                  )}
                  {org.phone && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border" data-testid={`text-rescue-phone-${org.id}`}>
                      <Phone className="h-3.5 w-3.5" />
                      {org.phone}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want to learn more about the {breed.name} before adopting? Read the full breed profile or compare it side by side.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/breeds/${breed.slug}`}>
                <Button variant="outline" data-testid="link-breed-profile">
                  <Dog className="mr-2 h-4 w-4" /> {breed.name} Breed Profile
                </Button>
              </Link>
              <Link href="/find-a-breeder">
                <Button variant="outline" data-testid="link-find-breeder">
                  Find an Ethical Breeder
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Rescue() {
  const [matchBreed, paramsBreed] = useRoute("/rescue/:breedSlug");
  if (matchBreed && paramsBreed?.breedSlug) {
    return <RescueBreed breedSlug={paramsBreed.breedSlug} />;
  }
  return <RescueHub />;
}
