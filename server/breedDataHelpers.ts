import type { InsertBreed } from "@shared/schema";

export function b(d: {
  n: string; g: string; o: string; y?: number;
  sc: string; w: string; h: string; l: string;
  ct: string; cc: string; sl: string; hypo?: boolean;
  t: string; el: string; tr: string; bt: string;
  gk?: number; gd?: number; gc?: number; sf?: number; apt?: boolean;
  ex: string; gf: string; hi: string; dn: string; tn: string;
  hist: string; pd: string; lw: string; hcg: string;
  ff: string; fq: string; pop: number;
  cq?: string; rb?: string | null;
  ffacts?: string[]; cm?: string; iop?: string; ngf?: string; gg?: string;
  faqs?: { question: string; answer: string }[];
}): InsertBreed {
  const slug = d.n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    name: d.n, slug, breedGroup: d.g, originCountry: d.o, yearRecognized: d.y ?? null, imageUrl: null,
    sizeCategory: d.sc, weightRange: d.w, heightRange: d.h, lifespan: d.l,
    coatType: d.ct, coatColors: d.cc, sheddingLevel: d.sl, hypoallergenic: d.hypo ?? false,
    temperamentSummary: d.t, energyLevel: d.el, trainability: d.tr, barkingTendency: d.bt,
    goodWithKids: d.gk ?? 3, goodWithDogs: d.gd ?? 3, goodWithCats: d.gc ?? 3,
    strangerFriendliness: d.sf ?? 3, apartmentSuitable: d.apt ?? false,
    exerciseNeeds: d.ex, groomingFrequency: d.gf,
    commonHealthIssues: d.hi, dietNotes: d.dn, trainingNotes: d.tn,
    history: d.hist, personalityDeepDive: d.pd, livingWith: d.lw,
    healthCareGuide: d.hcg, funFact: d.ff, famousQuote: d.fq, popularity: d.pop,
    contentQuality: (d.cq ?? "draft") as "templated" | "draft" | "reviewed" | "verified",
    lastUpdated: new Date(),
    reviewedBy: d.rb ?? null,
    funFacts: d.ffacts ?? [d.ff],
    commonMisconceptions: d.cm ?? "",
    idealOwnerProfile: d.iop ?? "",
    notGoodFor: d.ngf ?? "",
    groomingGuide: d.gg ?? "",
    faqs: d.faqs ?? [],
  };
}
