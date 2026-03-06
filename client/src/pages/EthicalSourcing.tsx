import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Search, AlertTriangle, CheckCircle, XCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function EthicalSourcing() {
  useCanonical("/ethical-sourcing");
  usePageMeta(
    "Ethical Dog Sourcing Guide: Find Responsible Breeders & Rescues | Dog Breeds & Needs",
    "Learn how to find a reputable breeder, adopt from a rescue, and avoid puppy mills. Our ethical sourcing guide helps you bring home a healthy, happy dog."
  );
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-ethical-title">
            Ethical Dog Sourcing Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding a dog should be a responsible decision. This guide helps you navigate finding a healthy, well-bred companion from ethical sources.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                What Makes a Responsible Breeder?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {[
                  "Health tests all breeding dogs for breed-specific genetic conditions",
                  "Welcomes visits to their facility and introduces you to the puppy's parents",
                  "Provides a health guarantee and veterinary records",
                  "Asks you questions about your lifestyle and experience to ensure a good match",
                  "Limits the number of litters per year and per female",
                  "Socializes puppies from birth with people and various environments",
                  "Takes back dogs at any point in their life if needed",
                  "Is registered with breed-specific clubs or national kennel clubs",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Red Flags to Watch For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {[
                  "Always has puppies available or breeds multiple different breeds",
                  "Won't let you visit the premises or meet the parents",
                  "Ships puppies without meeting the buyer first",
                  "No health testing documentation or veterinary references",
                  "Puppies are available at unusually low or suspiciously high prices",
                  "Uses pressure tactics or rushes you into a purchase",
                  "No contract or take-back policy",
                  "Sells puppies at pet stores or through online marketplaces without screening",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Adoption: A Wonderful Option
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Adopting from a shelter or rescue organization is a deeply rewarding choice. Millions of dogs need homes each year, and many purebred and mixed-breed dogs are available through breed-specific rescues.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Benefits of Adoption</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Save a life and open a shelter space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Dogs are often already spayed/neutered and vaccinated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Adult dogs have known temperaments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>Lower cost than purchasing from a breeder</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Where to Adopt</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Local animal shelters and humane societies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Breed-specific rescue organizations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Petfinder.com and Adopt-a-Pet.com</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>AKC Rescue Network</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Questions to Ask a Breeder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  "What health tests have the parents undergone?",
                  "Can I meet the puppy's mother and father?",
                  "How many litters does each female have per year?",
                  "What is your socialization program for puppies?",
                  "Do you provide a health guarantee? What does it cover?",
                  "Will you take the dog back if I can no longer keep it?",
                  "What breed-specific health issues should I be aware of?",
                  "Can you provide references from previous puppy buyers?",
                  "Are you affiliated with any breed clubs or kennel clubs?",
                  "At what age do you release puppies to their new homes?",
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <Badge variant="outline" className="shrink-0 mt-0.5">{i + 1}</Badge>
                    <p>{q}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before You Bring a Dog Home</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p>Getting a dog is a 10-15+ year commitment. Before making this decision, consider:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                <li>Can you afford veterinary care, food, grooming, and supplies for the lifetime of the dog?</li>
                <li>Do you have enough time for exercise, training, and socialization?</li>
                <li>Is your living situation suitable and stable for a dog?</li>
                <li>Are all household members on board with getting a dog?</li>
                <li>Do you have a plan for the dog during vacations and emergencies?</li>
                <li>Have you researched breed-specific needs and potential health issues?</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Looking for a Breeder?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
                Use our Ethical Breeder Finder to search for AKC-registered breeders by breed, view breed-specific health certifications, and access our complete red flags checklist.
              </p>
              <Link href="/find-a-breeder">
                <Button data-testid="link-find-breeder">
                  <Search className="mr-2 h-4 w-4" /> Find an Ethical Breeder
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
