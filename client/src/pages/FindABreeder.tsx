import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { saveBreederFinderState, breederFinderStore } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Shield, AlertTriangle, CheckCircle, XCircle, Heart,
  ExternalLink, ClipboardCheck, Stethoscope, FileCheck, Eye,
  HelpCircle, Home, Dog, MessageCircle, Award, BookOpen
} from "lucide-react";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getBreedImage } from "@/lib/breedImages";
import type { Breed } from "@shared/schema";

const healthTestsByBreed: Record<string, string[]> = {
  "German Shepherd Dog": ["OFA Hip & Elbow Dysplasia", "Degenerative Myelopathy DNA Test", "Cardiac Exam"],
  "Golden Retriever": ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "NCL DNA Test"],
  "Labrador Retriever": ["OFA Hip & Elbow Dysplasia", "Ophthalmologist Evaluation", "EIC DNA Test", "D Locus DNA Test"],
  "French Bulldog": ["OFA Hip Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "Patellar Luxation"],
  "Bulldog": ["Cardiac Exam", "Patellar Luxation", "Tracheal Hypoplasia Radiograph"],
  "Poodle": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "PRA DNA Test", "Cardiac Exam"],
  "Beagle": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "MLS DNA Test", "Cardiac Exam"],
  "Rottweiler": ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "JLPP DNA Test"],
  "Boxer": ["OFA Hip Dysplasia", "Cardiac Exam (Holter Monitor)", "Thyroid Evaluation", "ARVC DNA Test"],
  "Cavalier King Charles Spaniel": ["Cardiac Exam (Annual)", "Ophthalmologist Evaluation", "Patellar Luxation", "OFA Hip Dysplasia"],
  "Siberian Husky": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation"],
  "Doberman Pinscher": ["Cardiac Exam (Holter Monitor)", "OFA Hip Dysplasia", "Ophthalmologist Evaluation", "vWD DNA Test", "Thyroid Evaluation"],
  "Great Dane": ["OFA Hip Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "Thyroid Evaluation"],
  "Bernese Mountain Dog": ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "vWD DNA Test"],
  "Australian Shepherd": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "MDR1 DNA Test", "Elbow Dysplasia"],
  "Cocker Spaniel": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "PRA DNA Test"],
  "Dachshund": ["Patellar Luxation", "Ophthalmologist Evaluation", "Cardiac Exam"],
  "Shih Tzu": ["Ophthalmologist Evaluation", "Patellar Luxation", "OFA Hip Dysplasia"],
  "Yorkshire Terrier": ["Patellar Luxation", "Ophthalmologist Evaluation", "Liver Shunt Screening"],
  "Chihuahua": ["Patellar Luxation", "Cardiac Exam", "Ophthalmologist Evaluation"],
};

export default function FindABreeder() {
  useCanonical("/find-a-breeder");
  usePageMeta(
    "Find an Ethical Dog Breeder: AKC Breeder Directory & Guide | Dog Breeds & Needs",
    "Find a responsible, AKC-registered dog breeder near you. Search by breed, learn what health tests to look for, and use our red flags checklist to avoid puppy mills."
  );

  const [breedSearch, setBreedSearch] = useState(breederFinderStore.breedSearch);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  const { data: breeds, isLoading: breedsLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  useEffect(() => {
    if (breeds && breederFinderStore.selectedBreedSlug) {
      const saved = breeds.find(b => b.slug === breederFinderStore.selectedBreedSlug);
      if (saved) {
        setSelectedBreed(saved);
      }
      breederFinderStore.selectedBreedSlug = null;
    }
  }, [breeds]);

  const filteredBreeds = breeds?.filter((b) =>
    b.name.toLowerCase().includes(breedSearch.toLowerCase())
  ).slice(0, 8) || [];

  const getAkcMarketplaceUrl = (breedName: string) => {
    const slug = breedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `https://marketplace.akc.org/puppies/${slug}`;
  };

  const { data: rescueSlugsList } = useQuery<{ breedSlug: string }[]>({
    queryKey: ["/api/rescues"],
  });
  const rescueSlugSet = new Set((rescueSlugsList || []).map((r) => r.breedSlug));

  const getBreedRescueFallbackUrl = (breedName: string) => {
    const query = encodeURIComponent(`${breedName} breed rescue organization`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-breeder-finder-title">
            Find an Ethical Dog Breeder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search by breed to find ethical breeders, view breed-specific health certifications, and connect with rescue organizations.
          </p>
        </div>

        <Card className="mb-6 border-primary/30 bg-primary/5" data-testid="card-rescue-cta">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
            <Heart className="h-10 w-10 text-primary shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-semibold text-base mb-1">Considering adoption first?</h2>
              <p className="text-sm text-muted-foreground">
                Browse breed-specific rescue organizations across the U.S. Adoption is one of the most ethical ways to bring a dog into your family.
              </p>
            </div>
            <Link href="/rescue">
              <Button data-testid="button-browse-rescues">
                <Heart className="mr-2 h-4 w-4" /> Browse Rescue Directory
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search for a Breeder by Breed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use the search below to select the breed you're interested in, then narrow your results by state to find ethical breeders and their contact information.
            </p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Type a breed name (e.g., Golden Retriever, German Shepherd)..."
                className="pl-9"
                value={breedSearch}
                onChange={(e) => {
                  setBreedSearch(e.target.value);
                  if (!e.target.value) setSelectedBreed(null);
                }}
                data-testid="input-breeder-breed-search"
              />
            </div>

            {breedsLoading && breedSearch && (
              <p className="text-sm text-muted-foreground" data-testid="text-breeds-loading">Loading breeds...</p>
            )}

            {breedSearch && !selectedBreed && filteredBreeds.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" data-testid="breeder-breed-results">
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => {
                      setSelectedBreed(breed);
                      setBreedSearch(breed.name);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border transition-colors text-left"
                    data-testid={`button-select-breed-${breed.slug}`}
                  >
                    {getBreedImage(breed.slug) && (
                      <img
                        src={getBreedImage(breed.slug)}
                        alt={`${breed.name}, ${breed.sizeCategory} ${breed.breedGroup} dog breed portrait`}
                        className="w-12 h-12 rounded-lg object-cover"
                        loading="lazy"
                        decoding="async"
                        width={48}
                        height={48}
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">{breed.name}</p>
                      <p className="text-xs text-muted-foreground">{breed.breedGroup} Group</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedBreed && (
              <div className="space-y-4" data-testid="breeder-breed-detail">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background rounded-lg border">
                  {getBreedImage(selectedBreed.slug) && (
                    <img
                      src={getBreedImage(selectedBreed.slug)}
                      alt={`${selectedBreed.name}, ${selectedBreed.sizeCategory} ${selectedBreed.breedGroup} dog breed portrait`}
                      className="w-24 h-24 rounded-xl object-cover"
                      decoding="async"
                      width={96}
                      height={96}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{selectedBreed.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="outline">{selectedBreed.breedGroup}</Badge>
                      <Badge variant="outline">{selectedBreed.sizeCategory}</Badge>
                      <Badge variant="outline">{selectedBreed.originCountry}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/breeds/${selectedBreed.slug}`} onClick={() => saveBreederFinderState(breedSearch, selectedBreed.slug)}>
                        <Button size="sm" data-testid="button-breed-profile">
                          <Dog className="mr-1.5 h-3.5 w-3.5" /> Full Breed Profile
                        </Button>
                      </Link>
                      <a href={getAkcMarketplaceUrl(selectedBreed.name)} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" data-testid="button-akc-marketplace">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> AKC Marketplace
                        </Button>
                      </a>
                      {rescueSlugSet.has(selectedBreed.slug) ? (
                        <Link href={`/rescue/${selectedBreed.slug}`}>
                          <Button size="sm" variant="outline" data-testid="button-breed-rescue">
                            <Heart className="mr-1.5 h-3.5 w-3.5" /> {selectedBreed.name} Rescues
                          </Button>
                        </Link>
                      ) : (
                        <a href={getBreedRescueFallbackUrl(selectedBreed.name)} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" data-testid="button-breed-rescue">
                            <Heart className="mr-1.5 h-3.5 w-3.5" /> {selectedBreed.name} Rescue
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {healthTestsByBreed[selectedBreed.name] && (
                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      Recommended Health Tests for {selectedBreed.name} Breeders
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      A responsible {selectedBreed.name} breeder should have documentation for these tests on all breeding dogs:
                    </p>
                    <div className="grid gap-2">
                      {healthTestsByBreed[selectedBreed.name].map((test, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                          <span className="text-sm">{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!healthTestsByBreed[selectedBreed.name] && (
                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      Health Testing for {selectedBreed.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Ask the breeder what health certifications they have for their breeding dogs. At minimum, look for OFA or PennHIP evaluations and breed-specific genetic tests. Visit the{" "}
                      <a href="https://www.ofa.org/recommended-tests" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        OFA recommended tests page
                      </a>{" "}
                      for breed-specific requirements.
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedBreed(null); setBreedSearch(""); breederFinderStore.breedSearch = ""; }}
                    data-testid="button-clear-breed"
                  >
                    Search a different breed
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card data-testid="card-akc-registration">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                What AKC Registration Actually Means
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                AKC (American Kennel Club) registration means a dog's parents are both registered as purebred dogs of the same breed. While it's an important baseline, it's crucial to understand what it does and doesn't guarantee:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> What It Means
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Both parents are registered purebreds of the same breed</li>
                    <li>The breeder maintains pedigree records</li>
                    <li>The litter is documented with the AKC</li>
                    <li>AKC Marketplace breeders agree to AKC rules and inspections</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" /> What It Doesn't Guarantee
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>It does not certify health testing was done</li>
                    <li>It does not guarantee the puppy is healthy</li>
                    <li>It does not confirm the breeder is ethical</li>
                    <li>Registration alone is not enough, always verify health certifications independently</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground">
                <strong>Bottom line:</strong> AKC registration is a starting point, not an endpoint. Always verify health testing, visit the breeder in person, and ask the tough questions outlined below.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-questions-to-ask">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Questions to Ask a Breeder Before Buying
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { q: "What health tests have the parents had?", why: "Responsible breeders test for breed-specific genetic conditions. Ask for OFA, CERF, or PennHIP documentation, not just a vet checkup." },
                  { q: "Can I visit and meet the mother (and ideally the father)?", why: "Seeing the parents tells you about temperament and living conditions. A refusal is a major red flag." },
                  { q: "How many litters does each female have per year?", why: "Ethical breeders typically breed a female no more than once per year, with lifetime limits. Over-breeding is harmful." },
                  { q: "What is your puppy socialization program?", why: "Puppies need early exposure to different people, sounds, and environments. Good breeders start this from birth." },
                  { q: "Do you provide a health guarantee and contract?", why: "A written contract should cover genetic health guarantees, spay/neuter requirements, and a take-back clause." },
                  { q: "Will you take the dog back at any point in its life?", why: "Responsible breeders feel lifetime responsibility for every puppy they produce." },
                  { q: "Can you provide references from previous buyers and your veterinarian?", why: "Happy puppy owners and a long-term vet relationship are strong indicators of a quality breeder." },
                  { q: "Are you affiliated with any breed clubs?", why: "Membership in national or regional breed clubs shows commitment to breed standards and community." },
                  { q: "At what age do you release puppies?", why: "Puppies should not leave their mother before 8 weeks. Many good breeders wait until 10-12 weeks." },
                  { q: "Why did you choose this particular breeding pair?", why: "A thoughtful answer about complementary traits, health, and temperament shows a breeder who plans carefully." },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="shrink-0 mt-0.5">{i + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm mb-1">{item.q}</p>
                        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span><strong>Why it matters:</strong> {item.why}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-health-certifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Health Certifications to Look For by Breed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Every breed has specific genetic health concerns. Responsible breeders test their dogs before breeding. Here are the recommended health screenings for popular breeds:
              </p>
              <div className="grid gap-3">
                {Object.entries(healthTestsByBreed).map(([breed, tests]) => (
                  <div key={breed} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">{breed}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tests.map((test, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{test}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                For breeds not listed above, visit the{" "}
                <a href="https://www.ofa.org/recommended-tests" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Orthopedic Foundation for Animals (OFA)
                </a>{" "}
                for a complete list of recommended tests by breed.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-responsible-breeder-signs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Signs of a Responsible Breeder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  "Health tests all breeding dogs for breed-specific genetic conditions and provides documentation",
                  "Welcomes visits to their facility and introduces you to the puppy's parents and living environment",
                  "Provides a written health guarantee, contract, and veterinary records",
                  "Asks you detailed questions about your lifestyle, experience, and home to ensure a good match",
                  "Limits the number of litters per year and per female, prioritizing the mother's health",
                  "Socializes puppies from birth with people, sounds, textures, and various environments",
                  "Commits to taking back any dog they've bred at any point in its life",
                  "Is actively involved in breed clubs, dog shows, or working/performance events",
                  "Can explain why they chose this specific breeding pair and what they hoped to achieve",
                  "Does not always have puppies available, waitlists are normal for quality breeders",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30" data-testid="card-red-flags">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Red Flags Checklist: How to Spot a Puppy Mill or Backyard Breeder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you notice any of these warning signs, walk away. Purchasing from irresponsible sources fuels the cycle of puppy mills and contributes to animal suffering.
              </p>
              <div className="grid gap-3">
                {[
                  "Always has puppies available or breeds many different breeds at once",
                  "Won't let you visit the premises or see where the dogs live",
                  "Ships puppies sight-unseen without meeting the buyer first",
                  "No health testing documentation, only claims the vet said the dogs are 'healthy'",
                  "Puppies available at unusually low prices or with aggressive 'limited time' discounts",
                  "Uses pressure tactics, urgency, or emotional manipulation to rush your decision",
                  "No written contract, health guarantee, or take-back policy",
                  "Sells through pet stores, roadside, or third-party online marketplaces",
                  "Cannot or will not provide references from past buyers",
                  "Puppies appear sickly, fearful, or poorly socialized",
                  "Breeding dogs appear to be in poor condition or are kept in cages full-time",
                  "Has no involvement in breed clubs, shows, or any breed-related community",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-puppy-mills">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Why Pet Stores and Puppy Mills Are Harmful
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Despite their clean storefronts, the vast majority of pet store puppies come from commercial breeding operations, commonly known as puppy mills. Here's why this matters:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Breeding Dogs Suffer", desc: "Puppy mill breeding dogs live in cramped cages, are bred every heat cycle, and receive minimal veterinary care. Many never walk on grass or experience normal life." },
                  { title: "Health Problems Are Common", desc: "Without genetic testing, puppies from mills are far more likely to develop serious hereditary conditions, costing owners thousands in veterinary bills." },
                  { title: "Behavioral Issues", desc: "Puppies removed too early from their mothers and raised without proper socialization are more likely to develop anxiety, fearfulness, and aggression." },
                  { title: "The Cycle Continues", desc: "Every puppy purchased from a pet store or mill funds the operation and creates demand for more breeding. The only way to end puppy mills is to stop buying from them." },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-visit-checklist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Breeder Visit Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground mb-2">
                When you visit a breeder in person, use this checklist to evaluate their operation:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Facility is clean, well-maintained, and doesn't smell of ammonia",
                  "Dogs have adequate space, clean water, and appear healthy and well-fed",
                  "Puppies are kept in a home environment, not in outdoor kennels or barns",
                  "The mother is present, calm, and comfortable around the breeder",
                  "Puppies are curious, playful, and approach people willingly",
                  "Health testing documentation is readily available for both parents",
                  "The breeder can discuss the breed's history, temperament, and needs knowledgeably",
                  "The breeder asks YOU as many questions as you ask them",
                  "There's a written contract ready for review before any deposit is taken",
                  "The breeder doesn't pressure you to take a puppy home that same day",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <ClipboardCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-adoption">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Consider Adoption: A Wonderful Alternative
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                If you're flexible on breed or age, adopting from a rescue or shelter is one of the most rewarding ways to find a dog. Many purebred and mixed-breed dogs need loving homes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Where to Adopt</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <a href="https://www.petfinder.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline" data-testid="link-petfinder">Petfinder.com</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <a href="https://www.adoptapet.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline" data-testid="link-adoptapet">Adopt-a-Pet.com</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <a href="https://www.akc.org/dog-breeds/rescue-network/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline" data-testid="link-akc-rescue-network">AKC Rescue Network</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Local shelters and humane societies</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Benefits of Adoption</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Save a life and open a shelter space for another dog</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Dogs are typically already spayed/neutered and vaccinated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Adult dogs have known temperaments and are often house-trained</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Adoption fees are significantly lower than breeder prices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Want More Guidance?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
                Read our complete ethical sourcing guide for additional information on responsible dog ownership, or take our breed quiz to find the right breed for your lifestyle.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/ethical-sourcing">
                  <Button variant="outline" data-testid="link-ethical-sourcing">
                    <BookOpen className="mr-2 h-4 w-4" /> Ethical Sourcing Guide
                  </Button>
                </Link>
                <Link href="/dog-breed-selector">
                  <Button data-testid="link-breed-quiz">
                    <Dog className="mr-2 h-4 w-4" /> Take the Breed Quiz
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
