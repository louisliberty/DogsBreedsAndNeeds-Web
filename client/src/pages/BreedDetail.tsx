import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Heart, Zap, Brain, Volume2, Users, Dog as DogIcon, Home, Activity, Scissors, Stethoscope, Star, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { Breed, Product } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

function RatingBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-40 shrink-0">{label}</span>
      <Progress value={(value / max) * 100} className="flex-1 h-2" />
      <span className="text-sm text-muted-foreground w-8 text-right">{value}/{max}</span>
    </div>
  );
}

export default function BreedDetail() {
  const { slug } = useParams<{ slug: string }>();
  useCanonical(`/breeds/${slug}`);

  const { data: breed, isLoading } = useQuery<Breed>({
    queryKey: ["/api/breeds", slug],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: [`/api/products?sizes=${breed?.sizeCategory}`],
    enabled: !!breed,
  });

  usePageMeta(
    breed ? `${breed.name} – Breed Info, Temperament & Care Guide | Dog Breeds & Needs` : "Dog Breed Details | Dog Breeds & Needs",
    breed ? `Learn everything about the ${breed.name}: temperament, size, exercise needs, health tips, and more. See if this ${breed.breedGroup} breed is right for you!` : "Loading breed details..."
  );

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-72 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="py-16 text-center">
        <DogIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Breed not found</h2>
        <Link href="/breeds">
          <Button variant="outline">Back to Breeds</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/breeds">
          <Button variant="ghost" className="mb-4" data-testid="button-back-breeds">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Breeds
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {getBreedImage(breed.slug) && (
              <div className="w-full md:w-80 shrink-0">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <img
                    src={getBreedImage(breed.slug)}
                    alt={breed.name}
                    className="w-full h-full object-cover"
                    data-testid={`img-breed-${breed.slug}`}
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold" data-testid="text-breed-name">{breed.name}</h1>
                <Badge data-testid="badge-breed-popularity">#{breed.popularity} Most Popular</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{breed.breedGroup} Group</Badge>
                <Badge variant="outline">{breed.sizeCategory}</Badge>
                <Badge variant="outline">{breed.originCountry}</Badge>
                {breed.hypoallergenic && <Badge variant="secondary">Hypoallergenic</Badge>}
              </div>
              <p className="text-lg text-muted-foreground italic" data-testid="text-breed-quote">
                {breed.famousQuote}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Weight</span>
                  <p className="font-medium" data-testid="text-breed-weight">{breed.weightRange}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Height</span>
                  <p className="font-medium" data-testid="text-breed-height">{breed.heightRange}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lifespan</span>
                  <p className="font-medium" data-testid="text-breed-lifespan">{breed.lifespan}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Coat</span>
                  <p className="font-medium">{breed.coatType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Colors</span>
                  <p className="font-medium">{breed.coatColors}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Shedding</span>
                  <p className="font-medium">{breed.sheddingLevel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Energy</span>
                  <p className="font-medium">{breed.energyLevel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trainability</span>
                  <p className="font-medium">{breed.trainability}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Temperament
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm" data-testid="text-breed-temperament">{breed.temperamentSummary}</p>
              <div className="space-y-3">
                <RatingBar label="Good with Kids" value={breed.goodWithKids} />
                <RatingBar label="Good with Dogs" value={breed.goodWithDogs} />
                <RatingBar label="Good with Cats" value={breed.goodWithCats} />
                <RatingBar label="Stranger Friendly" value={breed.strangerFriendliness} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Exercise & Care
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Exercise Needs</span>
                <p className="text-muted-foreground">{breed.exerciseNeeds}</p>
              </div>
              <div>
                <span className="font-medium">Grooming</span>
                <p className="text-muted-foreground">{breed.groomingFrequency}</p>
              </div>
              <div>
                <span className="font-medium">Barking</span>
                <p className="text-muted-foreground">{breed.barkingTendency}</p>
              </div>
              <div>
                <span className="font-medium">Apartment Suitable</span>
                <p className="text-muted-foreground">{breed.apartmentSuitable ? "Yes" : "No"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" /> Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Common Health Issues</span>
                <p className="text-muted-foreground">{breed.commonHealthIssues}</p>
              </div>
              <div>
                <span className="font-medium">Diet Notes</span>
                <p className="text-muted-foreground">{breed.dietNotes}</p>
              </div>
              <div>
                <span className="font-medium">Health Care</span>
                <p className="text-muted-foreground">{breed.healthCareGuide}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> About the {breed.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-base mb-2">History</h3>
              <p className="text-muted-foreground">{breed.history}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">Personality</h3>
              <p className="text-muted-foreground">{breed.personalityDeepDive}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">Living With</h3>
              <p className="text-muted-foreground">{breed.livingWith}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">Training</h3>
              <p className="text-muted-foreground">{breed.trainingNotes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-start gap-4">
            <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-base mb-1">Fun Fact</h3>
              <p className="text-sm" data-testid="text-breed-fun-fact">{breed.funFact}</p>
            </div>
          </CardContent>
        </Card>

        {products && products.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recommended Products for {breed.sizeCategory} Dogs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} data-testid={`card-product-${product.id}`}>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{product.category}</Badge>
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/products">
                <Button variant="outline" data-testid="link-all-products">View All Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
