import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function HowWeChooseProducts() {
  useCanonical("/products/how-we-choose");
  usePageMeta(
    "How We Choose Dog Products | Dog Breeds & Needs",
    "Our criteria for recommending dog products: ingredient transparency, materials, manufacturing standards, and how we handle affiliate links and editorial independence.",
  );

  const inCriteria = [
    "Verifiable ingredient or material transparency (we can read the label and find the source)",
    "Made in countries with strong manufacturing oversight (USA, Canada, EU, UK, Australia, NZ)",
    "Third-party certifications where they exist: USDA Organic, Non-GMO, B-Corp, Certified Humane, NASC",
    "Brands that publish testing data, recall history, or supply-chain information",
    "Durable goods designed to last years, not seasons",
    "Established brand with a track record (no flash-in-the-pan dropshippers)",
  ];

  const outCriteria = [
    "Mystery proteins or vague labels like \"meat meal\" or \"animal by-product\"",
    "Toys with unknown plastics, undisclosed coatings, or no safety certifications",
    "Brands that won't disclose where their products are manufactured",
    "Products with active recalls or unresolved safety complaints",
    "Anything we wouldn't use with our own dogs",
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8" data-testid="page-how-we-choose">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md mb-6"
          data-testid="link-back-to-products"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <div className="mb-8">
          <ShieldCheck className="h-10 w-10 text-primary mb-3" />
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            data-testid="text-how-we-choose-title"
          >
            How We Choose Products
          </h1>
          <p className="text-lg text-muted-foreground">
            We only recommend products we'd put in our own dogs' bowls, mouths,
            and beds. Here's exactly what that means.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Affiliate disclosure</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some links on our product pages are affiliate links, which means
              we may earn a commission if you buy something — at no extra cost
              to you. Affiliate revenue helps us keep this site running and
              keeps our breed content free.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                Affiliate status never determines what gets listed.
              </strong>{" "}
              Editorial decisions are made first; affiliate links (where they
              exist) are added after. If we can't find an affiliate program for
              a product we love, we still recommend it and link straight to the
              brand.
            </p>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">What gets in</h2>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {inCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2" data-testid={`criteria-in-${i}`}>
                    <span className="text-primary mt-1">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold">What gets cut</h2>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {outCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2" data-testid={`criteria-out-${i}`}>
                    <span className="text-destructive mt-1">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Editor's Picks</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An <strong className="text-foreground">Editor's Pick</strong> is a
              product our team has personally used or rigorously vetted, and
              would recommend without hesitation. Picks are reviewed at least
              once a year — if a brand changes formulas, materials, or
              manufacturing, the pick can be removed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">A note on diet & health</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recommendations on this site are educational, not veterinary
              advice. Always check with your vet before changing your dog's
              diet or starting a supplement, especially for puppies, seniors,
              or dogs with existing health conditions.
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Last reviewed May 2026.
        </p>
      </div>
    </div>
  );
}
