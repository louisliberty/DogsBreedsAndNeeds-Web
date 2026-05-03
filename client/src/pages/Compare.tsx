import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import {
  Plus, X as XIcon, Share2, Trophy, ArrowLeft, Search, ChevronDown,
  Check, Minus, AlertCircle, ArrowRight, Ruler, Heart, Scissors, Activity, Stethoscope, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Breed } from "@shared/schema";
import { getBreedImage } from "@/lib/breedImages";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";

const MAX_BREEDS = 3;
const MIN_BREEDS = 2;

const POPULAR_COMPARISONS: { slugs: string[]; title: string; blurb: string }[] = [
  { slugs: ["labrador-retriever", "golden-retriever"], title: "Labrador vs Golden Retriever", blurb: "America's two favorite family dogs, head to head." },
  { slugs: ["french-bulldog", "boston-terrier"], title: "French Bulldog vs Boston Terrier", blurb: "Apartment-friendly companions with big personalities." },
  { slugs: ["siberian-husky", "alaskan-malamute"], title: "Siberian Husky vs Alaskan Malamute", blurb: "Two stunning sled dogs — which fits your lifestyle?" },
  { slugs: ["german-shepherd-dog", "belgian-malinois"], title: "German Shepherd vs Belgian Malinois", blurb: "The world's top working dogs compared." },
  { slugs: ["border-collie", "australian-shepherd"], title: "Border Collie vs Australian Shepherd", blurb: "Brilliant herders for active owners." },
  { slugs: ["rottweiler", "doberman-pinscher"], title: "Rottweiler vs Doberman", blurb: "Loyal protectors with very different temperaments." },
  { slugs: ["beagle", "basset-hound"], title: "Beagle vs Basset Hound", blurb: "Family-friendly hounds with a great nose." },
  { slugs: ["yorkshire-terrier", "maltese"], title: "Yorkshire Terrier vs Maltese", blurb: "Tiny lap dogs with luxurious coats." },
];

const TRAIT_GROUPS: { icon: typeof Ruler; label: string; traits: string[] }[] = [
  { icon: Ruler, label: "Size & build", traits: ["Size", "Weight", "Height", "Lifespan"] },
  { icon: Activity, label: "Energy & training", traits: ["Energy level", "Trainability", "Exercise needs", "Barking"] },
  { icon: Users, label: "Family fit", traits: ["Good with kids", "Good with other dogs", "Good with strangers", "Apartment friendly"] },
  { icon: Scissors, label: "Grooming & coat", traits: ["Grooming routine", "Shedding level", "Hypoallergenic"] },
  { icon: Stethoscope, label: "Health & lifestyle", traits: ["Common health issues", "Ideal owner", "Not a good fit for"] },
];

type Tone = "good" | "ok" | "warn" | "neutral";

function toneClass(tone: Tone): string {
  switch (tone) {
    case "good":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "ok":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "warn":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
    default:
      return "bg-muted/50 text-foreground border-border";
  }
}

function ToneCell({ tone, children, testId }: { tone: Tone; children: React.ReactNode; testId?: string }) {
  return (
    <td className="p-3 align-top" data-testid={testId}>
      <span className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${toneClass(tone)}`}>
        {children}
      </span>
    </td>
  );
}

const energyScore = (v: string) =>
  ({ "Very High": 5, High: 4, Moderate: 3, Low: 1 } as Record<string, number>)[v] ?? 3;
const trainScore = (v: string) =>
  ({ Easy: 5, Moderate: 3, Challenging: 2, Independent: 2 } as Record<string, number>)[v] ?? 3;
const barkScore = (v: string) =>
  ({ Rare: 1, Occasional: 2, Frequent: 4, Vocal: 5 } as Record<string, number>)[v] ?? 3;
const shedScore = (v: string) =>
  ({ Low: 1, Moderate: 2, High: 4, "Very High": 5 } as Record<string, number>)[v] ?? 3;
const sizeScore = (v: string) =>
  ({ Toy: 1, Small: 2, Medium: 3, Large: 4, "Extra Large": 5, Giant: 5 } as Record<string, number>)[v] ?? 3;

function exerciseMinutes(level: string): number {
  switch (level) {
    case "Very High": return 120;
    case "High": return 90;
    case "Moderate": return 60;
    case "Low": return 30;
    default: return 60;
  }
}

function lifespanMid(range: string): number {
  const m = range.match(/(\d+)[^\d]+(\d+)/);
  if (m) return (parseInt(m[1]) + parseInt(m[2])) / 2;
  const single = range.match(/(\d+)/);
  return single ? parseInt(single[1]) : 0;
}

function BreedSelector({
  breeds, selectedSlug, otherSlugs, onSelect, onRemove, index, canRemove,
}: {
  breeds: Breed[];
  selectedSlug: string | null;
  otherSlugs: string[];
  onSelect: (slug: string) => void;
  onRemove: () => void;
  index: number;
  canRemove: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = breeds.find((b) => b.slug === selectedSlug);
  const available = breeds.filter((b) => !otherSlugs.includes(b.slug));

  return (
    <Card className="relative" data-testid={`compare-selector-${index}`}>
      {canRemove && selected && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={onRemove}
          data-testid={`button-remove-breed-${index}`}
          aria-label="Remove breed"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
      <CardContent className="p-4">
        {selected ? (
          <div className="flex flex-col items-center text-center gap-2">
            <Link href={`/breeds/${selected.slug}`}>
              <div className="aspect-square w-32 rounded-lg overflow-hidden bg-muted hover-elevate cursor-pointer">
                {getBreedImage(selected.slug) ? (
                  <img
                    src={getBreedImage(selected.slug)}
                    alt={`${selected.name}, ${selected.sizeCategory} ${selected.breedGroup} dog breed portrait`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
            </Link>
            <Link href={`/breeds/${selected.slug}`}>
              <h3 className="font-semibold hover:text-primary cursor-pointer" data-testid={`text-selected-breed-${index}`}>
                {selected.name}
              </h3>
            </Link>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" data-testid={`button-change-breed-${index}`}>
                  Change
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="center">
                <BreedSearchCommand breeds={available} onPick={(s) => { onSelect(s); setOpen(false); }} />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                data-testid={`button-add-breed-${index}`}
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Plus className="h-4 w-4" />
                  Add a breed
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="center">
              <BreedSearchCommand breeds={available} onPick={(s) => { onSelect(s); setOpen(false); }} />
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
    </Card>
  );
}

function BreedSearchCommand({ breeds, onPick }: { breeds: Breed[]; onPick: (slug: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Search breeds…" data-testid="input-compare-breed-search" />
      <CommandList className="max-h-72">
        <CommandEmpty>No breeds found.</CommandEmpty>
        <CommandGroup>
          {breeds.map((b) => (
            <CommandItem
              key={b.slug}
              value={b.name}
              onSelect={() => onPick(b.slug)}
              data-testid={`option-breed-${b.slug}`}
            >
              <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span className="flex-1">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.breedGroup}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function rangeMid(s: string): number {
  const m = s.match(/(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/);
  if (m) return (parseFloat(m[1]) + parseFloat(m[2])) / 2;
  const single = s.match(/(\d+(?:\.\d+)?)/);
  return single ? parseFloat(single[1]) : 0;
}

function groomingScore(v: string): number {
  const s = v.toLowerCase();
  if (s.includes("daily")) return 5;
  if (s.includes("multiple") || s.includes("3-4") || s.includes("3 to 4")) return 4;
  if (s.includes("weekly") || s.includes("twice")) return 3;
  if (s.includes("biweekly") || s.includes("every other") || s.includes("bi-weekly")) return 2;
  if (s.includes("monthly") || s.includes("minimal") || s.includes("low")) return 1;
  return 3;
}

export default function Compare() {
  useCanonical("/compare");
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();

  const initialSlugs = useMemo(() => {
    const params = new URLSearchParams(searchString);
    const raw = params.get("breeds") || "";
    return Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, MAX_BREEDS);
  }, []);

  const [slots, setSlots] = useState<(string | null)[]>(() => {
    const arr: (string | null)[] = [...initialSlugs];
    while (arr.length < MAX_BREEDS) arr.push(null);
    return arr;
  });

  const { data: allBreeds, isLoading, isError, refetch } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  const selectedBreeds = useMemo(() => {
    if (!allBreeds) return [];
    return slots.map((s) => (s ? allBreeds.find((b) => b.slug === s) : undefined))
      .filter((b): b is Breed => Boolean(b));
  }, [allBreeds, slots]);

  useEffect(() => {
    if (!allBreeds) return;
    const valid = new Set(allBreeds.map((b) => b.slug));
    const cleaned = slots.map((s) => (s && valid.has(s) ? s : null));
    if (cleaned.some((v, i) => v !== slots[i])) {
      setSlots(cleaned);
    }
  }, [allBreeds]);

  useEffect(() => {
    const filled = slots.filter(Boolean) as string[];
    const params = new URLSearchParams();
    if (filled.length > 0) params.set("breeds", filled.join(","));
    const qs = params.toString();
    const nextUrl = qs ? `/compare?${qs}` : "/compare";
    if (location + (searchString ? `?${searchString}` : "") !== nextUrl) {
      setLocation(nextUrl, { replace: true });
    }
  }, [slots]);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const fromUrl = Array.from(
      new Set(
        (params.get("breeds") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ).slice(0, MAX_BREEDS);
    const filled = slots.filter(Boolean) as string[];
    if (fromUrl.join(",") === filled.join(",")) return;
    const arr: (string | null)[] = [...fromUrl];
    while (arr.length < MAX_BREEDS) arr.push(null);
    setSlots(arr);
  }, [searchString]);

  usePageMeta(
    selectedBreeds.length >= 2
      ? `${selectedBreeds.map((b) => b.name).join(" vs ")} - Side-by-Side Breed Comparison | Dog Breeds & Needs`
      : "Compare Dog Breeds Side by Side | Dog Breeds & Needs",
    selectedBreeds.length >= 2
      ? `Compare ${selectedBreeds.map((b) => b.name).join(", ")} side by side: temperament, size, energy, training, grooming, health, and more.`
      : "Compare any 2 or 3 AKC dog breeds side by side. See temperament, size, energy, training, grooming, health, and more, and find the best match for your lifestyle."
  );

  const setSlot = (idx: number, slug: string | null) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = slug;
      return next;
    });
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      while (next.length < MAX_BREEDS) next.push(null);
      return next;
    });
  };

  const otherSlugs = (i: number) => slots.filter((_, j) => j !== i).filter(Boolean) as string[];

  const filledCount = slots.filter(Boolean).length;
  const canRemove = filledCount > MIN_BREEDS;

  const shareUrl = () => {
    const filled = slots.filter(Boolean) as string[];
    const params = new URLSearchParams();
    if (filled.length > 0) params.set("breeds", filled.join(","));
    return `${window.location.origin}/compare?${params.toString()}`;
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      toast({ title: "Comparison link copied!", description: "Share this URL to show this exact comparison." });
    } catch {
      toast({ title: "Copy failed", description: "Unable to access clipboard.", variant: "destructive" });
    }
  };

  const winnerCategories = useMemo(() => {
    if (selectedBreeds.length < 2) return [];
    const cats: { label: string; winner: Breed; reason: string }[] = [];

    const family = [...selectedBreeds].sort((a, b) => b.goodWithKids - a.goodWithKids)[0];
    cats.push({ label: "Best with kids", winner: family, reason: `${family.goodWithKids}/5 rating with children` });

    const train = [...selectedBreeds].sort((a, b) => trainScore(b.trainability) - trainScore(a.trainability))[0];
    cats.push({ label: "Easiest to train", winner: train, reason: train.trainability });

    const lowEx = [...selectedBreeds].sort((a, b) => exerciseMinutes(a.energyLevel) - exerciseMinutes(b.energyLevel))[0];
    cats.push({ label: "Lowest exercise needs", winner: lowEx, reason: `~${exerciseMinutes(lowEx.energyLevel)} min/day` });

    const quiet = [...selectedBreeds].sort((a, b) => barkScore(a.barkingTendency) - barkScore(b.barkingTendency))[0];
    cats.push({ label: "Quietest", winner: quiet, reason: `${quiet.barkingTendency} barker` });

    const lowShed = [...selectedBreeds].sort((a, b) => shedScore(a.sheddingLevel) - shedScore(b.sheddingLevel))[0];
    cats.push({ label: "Lowest shedding", winner: lowShed, reason: `${lowShed.sheddingLevel} shedding` });

    const apt = selectedBreeds.find((b) => b.apartmentSuitable);
    if (apt) cats.push({ label: "Best for apartments", winner: apt, reason: "Apartment suitable" });

    const longest = [...selectedBreeds].sort((a, b) => lifespanMid(b.lifespan) - lifespanMid(a.lifespan))[0];
    cats.push({ label: "Longest lifespan", winner: longest, reason: longest.lifespan });

    return cats;
  }, [selectedBreeds]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/breeds">
          <Button variant="ghost" size="sm" className="mb-3" data-testid="button-back-breeds">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Breeds
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-compare-title">
            Compare Dog Breeds Side by Side
          </h1>
          <p className="text-muted-foreground">
            Pick {MIN_BREEDS}–{MAX_BREEDS} breeds to compare temperament, size, exercise, grooming, health, and more.
          </p>
        </div>

        {isError ? (
          <Card className="mb-6 border-rose-500/30 bg-rose-500/5" data-testid="compare-error-state">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <AlertCircle className="h-8 w-8 text-rose-600" />
              <div>
                <h3 className="font-semibold mb-1">Couldn't load breeds</h3>
                <p className="text-sm text-muted-foreground">
                  Something went wrong fetching the breed list. Check your connection and try again.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-retry-breeds">
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {slots.map((slug, i) => (
              <BreedSelector
                key={i}
                index={i}
                breeds={allBreeds || []}
                selectedSlug={slug}
                otherSlugs={otherSlugs(i)}
                onSelect={(s) => setSlot(i, s)}
                onRemove={() => removeSlot(i)}
                canRemove={canRemove}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && selectedBreeds.length === 0 && (
          <>
            <section className="mb-10" data-testid="section-popular-comparisons">
              <div className="flex items-end justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" data-testid="text-popular-title">Popular Comparisons</h2>
                  <p className="text-sm text-muted-foreground">Start with one of these head-to-heads people search most.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {POPULAR_COMPARISONS.map((c) => {
                  const href = `/compare?breeds=${c.slugs.join(",")}`;
                  return (
                    <Link key={c.slugs.join("-")} href={href}>
                      <Card
                        className="overflow-hidden h-full hover-elevate active-elevate-2 cursor-pointer transition-shadow"
                        data-testid={`card-popular-${c.slugs.join("-vs-")}`}
                      >
                        <div className="grid grid-cols-2 bg-muted/30">
                          {c.slugs.map((slug) => (
                            <img
                              key={slug}
                              src={getBreedImage(slug)}
                              alt={`${slug.replace(/-/g, " ")} portrait`}
                              className="aspect-[4/3] w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ))}
                        </div>
                        <CardContent className="p-4">
                          <div className="font-semibold leading-snug mb-1">{c.title}</div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{c.blurb}</p>
                          <div className="text-xs font-medium text-primary inline-flex items-center gap-1">
                            Compare now <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="mb-6" data-testid="section-what-we-compare">
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold" data-testid="text-traits-title">What you'll compare</h2>
                <p className="text-sm text-muted-foreground">
                  Every comparison covers 16+ traits across five categories so you can see real differences at a glance.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TRAIT_GROUPS.map((g) => {
                  const Icon = g.icon;
                  return (
                    <Card key={g.label} data-testid={`card-trait-group-${g.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="font-semibold">{g.label}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.traits.map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <Card className="bg-primary/5 border-primary/30" data-testid="card-trait-cta">
                  <CardContent className="p-4 h-full flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <div className="font-semibold">Not sure where to start?</div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Take a 2-minute quiz and we'll suggest breeds that match your lifestyle.
                      </p>
                    </div>
                    <Link href="/quiz">
                      <Button size="sm" variant="outline" className="w-full" data-testid="button-trait-quiz-cta">
                        Take the breed quiz <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}

        {selectedBreeds.length >= MIN_BREEDS && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="text-sm text-muted-foreground" data-testid="text-comparing-count">
              Comparing {selectedBreeds.length} breeds
            </div>
            <Button variant="outline" size="sm" onClick={copyShare} data-testid="button-share-comparison">
              <Share2 className="h-4 w-4 mr-2" /> Share This Comparison
            </Button>
          </div>
        )}

        {selectedBreeds.length >= MIN_BREEDS && (
          <ComparisonTable breeds={selectedBreeds} />
        )}

        {selectedBreeds.length >= MIN_BREEDS && winnerCategories.length > 0 && (
          <Card className="mt-6 border-primary/30" data-testid="card-winner-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> Winner For You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {winnerCategories.map((c, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-md border bg-card" data-testid={`winner-${i}`}>
                    <div className="text-sm">
                      <div className="text-muted-foreground text-xs">{c.label}</div>
                      <div className="font-semibold">{c.winner.name}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{c.reason}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

type RowSpec = {
  label: string;
  render: (b: Breed) => React.ReactNode;
  tone?: (b: Breed, all: Breed[]) => Tone;
  testId?: string;
};

function ComparisonTable({ breeds }: { breeds: Breed[] }) {
  const lowestIs = (vals: number[]) => Math.min(...vals);
  const highestIs = (vals: number[]) => Math.max(...vals);

  const toneByPosition = (val: number, all: number[], goodIsHigh: boolean): Tone => {
    if (all.every((v) => v === val)) return "neutral";
    const best = goodIsHigh ? highestIs(all) : lowestIs(all);
    const worst = goodIsHigh ? lowestIs(all) : highestIs(all);
    if (val === best) return "good";
    if (val === worst) return "warn";
    return "ok";
  };

  const rows: RowSpec[] = [
    {
      label: "Size",
      render: (b) => b.sizeCategory,
      tone: (b, all) => toneByPosition(sizeScore(b.sizeCategory), all.map((x) => sizeScore(x.sizeCategory)), false),
    },
    {
      label: "Weight",
      render: (b) => b.weightRange,
      tone: (b, all) => toneByPosition(rangeMid(b.weightRange), all.map((x) => rangeMid(x.weightRange)), false),
    },
    {
      label: "Height",
      render: (b) => b.heightRange,
      tone: (b, all) => toneByPosition(rangeMid(b.heightRange), all.map((x) => rangeMid(x.heightRange)), false),
    },
    {
      label: "Lifespan",
      render: (b) => b.lifespan,
      tone: (b, all) => toneByPosition(lifespanMid(b.lifespan), all.map((x) => lifespanMid(x.lifespan)), true),
    },
    {
      label: "Energy",
      render: (b) => b.energyLevel,
      tone: (b, all) => toneByPosition(energyScore(b.energyLevel), all.map((x) => energyScore(x.energyLevel)), false),
    },
    {
      label: "Trainability",
      render: (b) => b.trainability,
      tone: (b, all) => toneByPosition(trainScore(b.trainability), all.map((x) => trainScore(x.trainability)), true),
    },
    {
      label: "Barking",
      render: (b) => b.barkingTendency,
      tone: (b, all) => toneByPosition(barkScore(b.barkingTendency), all.map((x) => barkScore(x.barkingTendency)), false),
    },
    {
      label: "Friendliness",
      render: (b) => {
        const avg = (b.strangerFriendliness + b.goodWithKids + b.goodWithDogs) / 3;
        return `${avg.toFixed(1)}/5`;
      },
      tone: (b, all) => {
        const score = (x: Breed) => (x.strangerFriendliness + x.goodWithKids + x.goodWithDogs) / 3;
        return toneByPosition(score(b), all.map(score), true);
      },
    },
    {
      label: "Good with strangers",
      render: (b) => `${b.strangerFriendliness}/5`,
      tone: (b, all) => toneByPosition(b.strangerFriendliness, all.map((x) => x.strangerFriendliness), true),
    },
    {
      label: "Good with kids",
      render: (b) => `${b.goodWithKids}/5`,
      tone: (b, all) => toneByPosition(b.goodWithKids, all.map((x) => x.goodWithKids), true),
    },
    {
      label: "Good with other dogs",
      render: (b) => `${b.goodWithDogs}/5`,
      tone: (b, all) => toneByPosition(b.goodWithDogs, all.map((x) => x.goodWithDogs), true),
    },
    {
      label: "Grooming",
      render: (b) => b.groomingFrequency,
      tone: (b, all) => toneByPosition(groomingScore(b.groomingFrequency), all.map((x) => groomingScore(x.groomingFrequency)), false),
    },
    {
      label: "Shedding",
      render: (b) => b.sheddingLevel,
      tone: (b, all) => toneByPosition(shedScore(b.sheddingLevel), all.map((x) => shedScore(x.sheddingLevel)), false),
    },
    {
      label: "Exercise (min/day)",
      render: (b) => `~${exerciseMinutes(b.energyLevel)} min`,
      tone: (b, all) => toneByPosition(exerciseMinutes(b.energyLevel), all.map((x) => exerciseMinutes(x.energyLevel)), false),
    },
    { label: "Common health issues", render: (b) => b.commonHealthIssues },
    { label: "Ideal for", render: (b) => b.idealOwnerProfile || "," },
    { label: "Not good for", render: (b) => b.notGoodFor || "," },
  ];

  return (
    <Card className="overflow-hidden" data-testid="card-comparison-table">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48 bg-muted/40">Trait</TableHead>
              {breeds.map((b) => (
                <TableHead key={b.slug} className="min-w-[220px]" data-testid={`column-header-${b.slug}`}>
                  <Link href={`/breeds/${b.slug}`}>
                    <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      {getBreedImage(b.slug) && (
                        <img
                          src={getBreedImage(b.slug)}
                          alt={`${b.name}, ${b.sizeCategory} ${b.breedGroup} dog breed portrait`}
                          className="h-10 w-10 rounded object-cover"
                          loading="lazy"
                          decoding="async"
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <div className="font-semibold text-foreground">{b.name}</div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {b.breedGroup} · #{b.popularity}
                        </div>
                      </div>
                    </div>
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label} data-testid={`row-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <TableCell className="font-medium bg-muted/20 align-top">{row.label}</TableCell>
                {breeds.map((b) => {
                  const tone = row.tone ? row.tone(b, breeds) : "neutral";
                  return (
                    <ToneCell
                      key={b.slug}
                      tone={tone}
                      testId={`cell-${row.label.toLowerCase().replace(/\s+/g, "-")}-${b.slug}`}
                    >
                      {row.render(b)}
                    </ToneCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-3 border-t bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Best in this group</span>
        <span className="inline-flex items-center gap-1.5"><Minus className="h-3.5 w-3.5 text-amber-600" /> Middle</span>
        <span className="inline-flex items-center gap-1.5"><XIcon className="h-3.5 w-3.5 text-rose-600" /> Highest demand / least favorable</span>
      </div>
    </Card>
  );
}
