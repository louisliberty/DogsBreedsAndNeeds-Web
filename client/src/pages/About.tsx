import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen, Heart, Users } from "lucide-react";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Dog Breeds & Needs Editorial Team",
    role: "Lead Editors",
    credentials: "10+ years writing about dogs",
    bio: "Our editorial team has spent more than a decade researching, writing, and reviewing breed information for owners, breeders, and rescues across the United States.",
  },
  {
    name: "Veterinary Review Panel",
    role: "Health & Care Reviewers",
    credentials: "DVM-credentialed reviewers",
    bio: "Selected breed and care content is reviewed by licensed veterinarians for medical accuracy. Look for the Vet Reviewed badge on individual breed pages.",
  },
  {
    name: "Breed Specialists & Rescuers",
    role: "Contributors",
    credentials: "Breed club members and rescue volunteers",
    bio: "We work with breed club members and breed-specific rescue volunteers across the country to capture nuance about temperament, training, and what life with each breed actually looks like.",
  },
];

export default function About() {
  useCanonical("/about");
  usePageMeta(
    "About Dog Breeds & Needs: Our Mission, Editorial Standards & Team",
    "Learn about Dog Breeds & Needs — our mission, how we research breed information, our commitment to ethical sourcing, and the team behind the site."
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-about-title">About Dog Breeds & Needs</h1>
        <p className="text-lg text-muted-foreground mb-10" data-testid="text-about-subtitle">
          The honest, in-depth resource for choosing, raising, and living with all 205 AKC-recognized dog breeds.
        </p>

        <Card className="mb-8" data-testid="card-mission">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              Dog Breeds & Needs exists to help future and current dog owners make better decisions. Choosing a breed is one of the most consequential decisions in a person's life — the wrong fit creates years of stress for both human and dog, while the right fit shapes a decade or more of partnership.
            </p>
            <p>
              We believe every breed deserves an honest, complete profile that covers what's wonderful and what's hard. We do not write puff pieces. We do not hide the difficult traits. We treat readers as adults who can weigh tradeoffs.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-research">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> How We Research Breed Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              Every breed profile starts with the official AKC standard and the relevant national breed club's published material. We then layer in:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Peer-reviewed veterinary research on breed-specific health conditions</li>
              <li>Conversations with breed club members, working breeders, and breed-specific rescue volunteers</li>
              <li>Health screening guidance from the Orthopedic Foundation for Animals (OFA) and breed parent clubs</li>
              <li>Editorial review for clarity, accuracy, and practical usefulness for everyday owners</li>
            </ul>
            <p>
              Selected breed profiles carry a Vet Reviewed badge, indicating that a licensed veterinarian has reviewed the medical and care information for accuracy. Every breed profile shows when it was last updated.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-ethical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Our Commitment to Ethical Sourcing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              We are committed to promoting responsible dog acquisition. That means giving equal weight to two ethical paths: adopting from a reputable rescue and buying from a responsible breeder.
            </p>
            <p>
              We never link to puppy mills, pet store puppies, or commercial breeders. Our breeder finder steers readers to AKC-registered breeders with verifiable health testing. Our rescue directory only lists 501(c)(3) breed-specific rescues with transparent operations.
            </p>
            <p>
              We do not accept payment from breeders or rescues for placement on the site. Affiliate links — when present — are clearly disclosed and never influence which breeders or rescues we recommend.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-team">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Our Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {team.map((member, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0" data-testid={`team-member-${i}`}>
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center shrink-0" aria-hidden="true">
                  <Users className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" data-testid={`text-team-name-${i}`}>{member.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary">{member.role}</Badge>
                    <span className="text-xs text-muted-foreground">{member.credentials}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center">
          Have a question, correction, or want to contribute? Reach us at{" "}
          <a href="mailto:editorial@dogbreedsandneeds.com" className="underline hover:text-primary" data-testid="link-contact-email">
            editorial@dogbreedsandneeds.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
