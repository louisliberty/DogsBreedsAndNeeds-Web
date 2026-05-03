import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ArrowLeft, Heart, Zap, Brain, DogIcon, Activity, Stethoscope, Lightbulb, Search,
  Check, X as XIcon, Share2, Link as LinkIcon, ChevronRight, Home as HomeIcon,
  ShieldCheck, Scale, AlertTriangle, PawPrint as PawPrintIcon,
} from "lucide-react";
import { SiFacebook, SiX } from "react-icons/si";
import { breederFinderStore } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import type { Breed, Product } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";

const PAW_FILLED = "text-primary";
const PAW_EMPTY = "text-muted-foreground/30";

function PawRating({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-3" data-testid={`paw-rating-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <span className="text-sm w-44 shrink-0">{label}</span>
      <div className="flex-1 flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <PawPrintIcon
            key={i}
            className={`h-4 w-4 ${i < value ? PAW_FILLED : PAW_EMPTY}`}
            fill={i < value ? "currentColor" : "none"}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground w-10 text-right">{value}/{max}</span>
    </div>
  );
}

function energyToScore(level: string): number {
  switch (level) {
    case "Very High": return 5;
    case "High": return 4;
    case "Moderate": return 3;
    case "Low": return 1;
    default: return 3;
  }
}
function trainabilityToScore(t: string): number {
  switch (t) {
    case "Easy": return 5;
    case "Moderate": return 3;
    case "Challenging": return 2;
    case "Independent": return 2;
    default: return 3;
  }
}
function barkingToScore(b: string): number {
  switch (b) {
    case "Rare": return 1;
    case "Occasional": return 2;
    case "Frequent": return 4;
    case "Vocal": return 5;
    default: return 3;
  }
}
function groomingToScore(s: string): number {
  switch (s) {
    case "Low": return 2;
    case "Moderate": return 3;
    case "High": return 4;
    case "Very High": return 5;
    default: return 3;
  }
}

function ShareButtons({ breed, variant = "default" }: { breed: Breed; variant?: "default" | "compact" }) {
  const { toast } = useToast();
  const url = typeof window !== "undefined" ? window.location.href : `https://dogbreedsandneeds.com/breeds/${breed.slug}`;
  const message = `Everything you need to know about the ${breed.name} — temperament, care, and whether they're right for you:`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Breed page URL copied to your clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Unable to access clipboard.", variant: "destructive" });
    }
  };

  const size = variant === "compact" ? "sm" : "default";
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid={`share-buttons-${variant}`}>
      <span className="text-sm text-muted-foreground mr-1 hidden sm:inline">Share:</span>
      <Button variant="outline" size={size} asChild data-testid="button-share-facebook">
        <a href={fb} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <SiFacebook className="h-4 w-4 mr-2" /> Facebook
        </a>
      </Button>
      <Button variant="outline" size={size} asChild data-testid="button-share-twitter">
        <a href={tw} target="_blank" rel="noopener noreferrer" aria-label="Share on X (Twitter)">
          <SiX className="h-4 w-4 mr-2" /> Post
        </a>
      </Button>
      <Button variant="outline" size={size} onClick={copy} data-testid="button-share-copy">
        <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
      </Button>
    </div>
  );
}

function StickyActions({ breed, visible }: { breed: Breed; visible: boolean }) {
  const { toast } = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };
  return (
    <div
      className={`hidden md:block fixed top-16 left-0 right-0 z-30 border-b bg-background/95 backdrop-blur-sm transition-transform duration-200 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      data-testid="sticky-quick-actions"
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="font-semibold text-sm truncate" data-testid="sticky-breed-name">{breed.name}</div>
        <div className="flex items-center gap-2">
          <Link href="/find-a-breeder">
            <Button variant="outline" size="sm" data-testid="sticky-button-breeder">Find a Breeder</Button>
          </Link>
          <Link href={`/rescue/${breed.slug}`}>
            <Button variant="outline" size="sm" data-testid="sticky-button-rescue">Find a Rescue</Button>
          </Link>
          <Link href={`/compare?breeds=${encodeURIComponent(breed.slug)}`}>
            <Button variant="outline" size="sm" data-testid="sticky-button-compare">
              <Scale className="h-4 w-4 mr-1" /> Compare
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={copy} data-testid="sticky-button-share">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ breed }: { breed: Breed }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3" data-testid="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover-elevate inline-flex items-center gap-1 px-2 py-1 rounded-md" data-testid="breadcrumb-home">
            <HomeIcon className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link href="/breeds" className="hover-elevate px-2 py-1 rounded-md" data-testid="breadcrumb-breeds">Breeds</Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link href={`/breeds?group=${encodeURIComponent(breed.breedGroup)}`} className="hover-elevate px-2 py-1 rounded-md" data-testid="breadcrumb-group">
            {breed.breedGroup} Group
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li className="font-medium text-foreground px-2 py-1" data-testid="breadcrumb-current">{breed.name}</li>
      </ol>
    </nav>
  );
}

export default function BreedDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [cameFromBreederFinder] = useState(() => {
    const fromFinder = breederFinderStore.selectedBreedSlug !== null;
    if (!fromFinder) breederFinderStore.breedSearch = "";
    return fromFinder;
  });
  useCanonical(`/breeds/${slug}`);

  const heroRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const bottom = heroRef.current.getBoundingClientRect().bottom;
      setStickyVisible(bottom < 64);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: breed, isLoading } = useQuery<Breed>({
    queryKey: ["/api/breeds", slug],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: [`/api/products?sizes=${breed?.sizeCategory}`],
    enabled: !!breed,
  });

  const { data: relatedBreeds } = useQuery<Breed[]>({
    queryKey: ["/api/breeds", slug, "related"],
    enabled: !!breed,
  });

  usePageMeta(
    breed ? `${breed.name}: Breed Info, Temperament & Care Guide | Dog Breeds & Needs` : "Dog Breed Details | Dog Breeds & Needs",
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

  const lastUpdatedStr = new Date(breed.lastUpdated).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <StickyActions breed={breed} visible={stickyVisible} />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 mb-2">
            <Link href="/breeds">
              <Button variant="ghost" size="sm" data-testid="button-back-breeds">
                <ArrowLeft className="mr-2 h-4 w-4" /> All Breeds
              </Button>
            </Link>
            {cameFromBreederFinder && (
              <Link href="/find-a-breeder">
                <Button variant="ghost" size="sm" data-testid="button-back-breeder-finder">
                  <Search className="mr-2 h-4 w-4" /> Back to Breeder Finder
                </Button>
              </Link>
            )}
          </div>

          <Breadcrumb breed={breed} />

          <div className="mb-8" ref={heroRef}>
            <div className="flex flex-col md:flex-row gap-6">
              {getBreedImage(breed.slug) && (
                <div className="w-full md:w-80 shrink-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <img
                      src={getBreedImage(breed.slug)}
                      alt={`${breed.name} dog breed portrait - ${breed.sizeCategory} ${breed.breedGroup} breed from ${breed.originCountry}`}
                      className="w-full h-full object-cover"
                      data-testid={`img-breed-${breed.slug}`}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold" data-testid="text-breed-name">{breed.name}</h1>
                  <Badge data-testid="badge-breed-popularity">#{breed.popularity} Most Popular</Badge>
                  {breed.reviewedBy && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white" data-testid="badge-vet-reviewed">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Vet Reviewed
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Reviewed by {breed.reviewedBy} for accuracy.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3" data-testid="text-breed-meta-line">
                  Last updated <time dateTime={new Date(breed.lastUpdated).toISOString()}>{lastUpdatedStr}</time>
                  {breed.reviewedBy && <> · Reviewed by <span className="font-medium text-foreground">{breed.reviewedBy}</span></>}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{breed.breedGroup} Group</Badge>
                  <Badge variant="outline">{breed.sizeCategory}</Badge>
                  <Badge variant="outline">{breed.originCountry}</Badge>
                  {breed.hypoallergenic && <Badge variant="secondary">Hypoallergenic</Badge>}
                </div>
                <p className="text-lg text-muted-foreground italic mb-4" data-testid="text-breed-quote">
                  {breed.famousQuote}
                </p>
                <ShareButtons breed={breed} variant="compact" />
                <div className="mt-3">
                  <Link href={`/compare?breeds=${encodeURIComponent(breed.slug)}`}>
                    <Button variant="outline" size="sm" data-testid="button-compare-with-another">
                      <Scale className="h-4 w-4 mr-2" /> Compare with another breed
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {(breed.idealOwnerProfile || breed.notGoodFor) && (
            <Card className="mb-6 border-primary/20" data-testid="card-summary-yes-no">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" /> Is the {breed.name} Right For You?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {breed.idealOwnerProfile && (
                    <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5 p-4" data-testid="summary-yes">
                      <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Check className="h-5 w-5" /> YES, if you are…
                      </div>
                      <p className="text-sm leading-relaxed">{breed.idealOwnerProfile}</p>
                    </div>
                  )}
                  {breed.notGoodFor && (
                    <div className="rounded-lg border-2 border-rose-500/30 bg-rose-500/5 p-4" data-testid="summary-no">
                      <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-semibold">
                        <XIcon className="h-5 w-5" /> NO, if you are…
                      </div>
                      <p className="text-sm leading-relaxed">{breed.notGoodFor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {breed.funFacts && breed.funFacts.length > 0 && (
            <Card className="mb-6 bg-primary/5 border-primary/20" data-testid="card-fun-facts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" /> Fun Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {breed.funFacts.map((fact, i) => (
                    <div key={i} className="flex gap-3 text-sm" data-testid={`text-fun-fact-${i}`}>
                      <span className="font-bold text-primary shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {breed.commonMisconceptions && (
            <Card className="mb-6 border-amber-500/30 bg-amber-500/5" data-testid="card-misconceptions">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base mb-1">Common Misconceptions about the {breed.name}</h3>
                  <p className="text-sm leading-relaxed">{breed.commonMisconceptions}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Weight</span><p className="font-medium" data-testid="text-breed-weight">{breed.weightRange}</p></div>
                  <div><span className="text-muted-foreground">Height</span><p className="font-medium" data-testid="text-breed-height">{breed.heightRange}</p></div>
                  <div><span className="text-muted-foreground">Lifespan</span><p className="font-medium" data-testid="text-breed-lifespan">{breed.lifespan}</p></div>
                  <div><span className="text-muted-foreground">Coat</span><p className="font-medium">{breed.coatType}</p></div>
                  <div><span className="text-muted-foreground">Colors</span><p className="font-medium">{breed.coatColors}</p></div>
                  <div><span className="text-muted-foreground">Shedding</span><p className="font-medium">{breed.sheddingLevel}</p></div>
                  <div><span className="text-muted-foreground">Energy</span><p className="font-medium">{breed.energyLevel}</p></div>
                  <div><span className="text-muted-foreground">Trainability</span><p className="font-medium">{breed.trainability}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrintIcon className="h-5 w-5 text-primary" /> Trait Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground" data-testid="text-breed-temperament">{breed.temperamentSummary}</p>
                <div className="space-y-2.5">
                  <PawRating label="Energy" value={energyToScore(breed.energyLevel)} />
                  <PawRating label="Trainability" value={trainabilityToScore(breed.trainability)} />
                  <PawRating label="Friendliness" value={breed.strangerFriendliness} />
                  <PawRating label="Barking" value={barkingToScore(breed.barkingTendency)} />
                  <PawRating label="Grooming Needs" value={groomingToScore(breed.sheddingLevel)} />
                  <PawRating label="Good With Kids" value={breed.goodWithKids} />
                  <PawRating label="Good With Other Dogs" value={breed.goodWithDogs} />
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
                <div><span className="font-medium">Exercise Needs</span><p className="text-muted-foreground">{breed.exerciseNeeds}</p></div>
                <div><span className="font-medium">Grooming</span><p className="text-muted-foreground">{breed.groomingFrequency}</p></div>
                {breed.groomingGuide && <div><span className="font-medium">Grooming Guide</span><p className="text-muted-foreground whitespace-pre-line">{breed.groomingGuide}</p></div>}
                <div><span className="font-medium">Apartment Suitable</span><p className="text-muted-foreground">{breed.apartmentSuitable ? "Yes" : "No"}</p></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" /> Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div><span className="font-medium">Common Health Issues</span><p className="text-muted-foreground">{breed.commonHealthIssues}</p></div>
                <div><span className="font-medium">Diet Notes</span><p className="text-muted-foreground whitespace-pre-line">{breed.dietNotes}</p></div>
                <div><span className="font-medium">Health Care</span><p className="text-muted-foreground whitespace-pre-line">{breed.healthCareGuide}</p></div>
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
                <p className="text-muted-foreground whitespace-pre-line">{breed.history}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-2">Personality</h3>
                <p className="text-muted-foreground whitespace-pre-line">{breed.personalityDeepDive}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-2">Living With</h3>
                <p className="text-muted-foreground whitespace-pre-line">{breed.livingWith}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-2">Training</h3>
                <p className="text-muted-foreground whitespace-pre-line">{breed.trainingNotes}</p>
              </div>
            </CardContent>
          </Card>

          {breed.faqs && breed.faqs.length > 0 && (
            <Card className="mt-6" data-testid="card-faqs">
              <CardHeader>
                <CardTitle>Frequently Asked Questions about the {breed.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {breed.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} data-testid={`faq-item-${i}`}>
                      <AccordionTrigger className="text-left text-base font-medium" data-testid={`faq-question-${i}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground" data-testid={`faq-answer-${i}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {relatedBreeds && relatedBreeds.length > 0 && (
            <div className="mt-8" data-testid="section-related-breeds">
              <h2 className="text-xl font-bold mb-4">Related Breeds</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedBreeds.map((rb) => {
                  const img = getBreedImage(rb.slug);
                  return (
                    <Link key={rb.id} href={`/breeds/${rb.slug}`}>
                      <Card className="hover-elevate active-elevate-2 cursor-pointer h-full overflow-hidden" data-testid={`card-related-${rb.slug}`}>
                        {img && (
                          <div className="aspect-[4/3] overflow-hidden bg-muted">
                            <img src={img} alt={`${rb.name} dog breed`} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        )}
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{rb.name}</h3>
                          <p className="text-xs text-muted-foreground">{rb.sizeCategory} · {rb.energyLevel}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

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

          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">Found this guide helpful? Share it with a fellow dog lover.</p>
            <ShareButtons breed={breed} />
          </div>
        </div>
      </div>
    </>
  );
}
