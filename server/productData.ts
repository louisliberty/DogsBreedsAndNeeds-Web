import type { InsertProduct } from "@shared/schema";

export const PRODUCT_SEED_VERSION = "v3-eco-affiliate-phase1-images";

const CATEGORY_IMAGES: Record<string, string> = {
  "Food & Treats": "/attached_assets/stock_images/product_food.jpg",
  "Toys & Enrichment": "/attached_assets/stock_images/product_toys.jpg",
  "Leashes & Harnesses": "/attached_assets/stock_images/product_leashes.jpg",
  "Grooming & Coat Care": "/attached_assets/stock_images/product_grooming.jpg",
  "Beds & Crates": "/attached_assets/stock_images/product_beds.jpg",
  "Health & Supplements": "/attached_assets/stock_images/product_health.jpg",
  Cleanup: "/attached_assets/stock_images/product_cleanup.jpg",
};

const rawProductSeedData: InsertProduct[] = [
  {
    name: "Open Farm Grass-Fed Beef Recipe",
    brand: "Open Farm",
    category: "Food & Treats",
    description:
      "Pasture-raised beef recipe with humanely-sourced meat, non-GMO produce, and traceable ingredients you can look up by lot number.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "One of the few dog food brands publishing full ingredient traceability. Every protein is third-party certified humane.",
    editorsNote:
      "If you only upgrade one thing in your dog's diet, make it the protein source. Open Farm's transparency is the gold standard.",
    editorsPick: true,
    priceTier: "$$$",
    bestFor: ["Adult dogs", "Sensitive stomachs", "Owners who care about sourcing"],
    tags: ["Non-GMO", "Single-protein", "Human-grade", "Recyclable packaging"],
    retailers: [
      { retailer: "Open Farm", url: "https://openfarmpet.com/" },
      { retailer: "Chewy", url: "https://www.chewy.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "The Honest Kitchen Whole Grain Chicken Clusters",
    brand: "The Honest Kitchen",
    category: "Food & Treats",
    description:
      "Human-grade dehydrated kibble made in a human food facility with cage-free chicken and whole grains. Just add water.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large",
    whyRecommended:
      "Human-grade certification means the entire facility meets standards for human food — a much higher bar than typical pet food.",
    editorsNote:
      "Great middle ground for owners who want fresh-quality nutrition without the freezer footprint of frozen food.",
    editorsPick: true,
    priceTier: "$$$",
    bestFor: ["Picky eaters", "Adult dogs", "Travel"],
    tags: ["Human-grade", "Non-GMO", "Recyclable packaging"],
    retailers: [
      { retailer: "The Honest Kitchen", url: "https://www.thehonestkitchen.com/" },
      { retailer: "Chewy", url: "https://www.chewy.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Stella & Chewy's Freeze-Dried Dinner Patties",
    brand: "Stella & Chewy's",
    category: "Food & Treats",
    description:
      "95% raw cage-free poultry, grass-fed beef, or wild-caught fish. Freeze-dried to lock in nutrients with no synthetic preservatives.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large",
    whyRecommended:
      "Closest you can get to a true raw diet without the food-safety risk or freezer space. Excellent for transitioning off ultra-processed kibble.",
    editorsNote: null,
    editorsPick: false,
    priceTier: "$$$",
    bestFor: ["Adult dogs", "Topper for picky eaters"],
    tags: ["Single-protein", "Grain-free", "Limited ingredient"],
    retailers: [{ retailer: "Chewy", url: "https://www.chewy.com/" }],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "West Paw Hurley Tough Chew Toy",
    brand: "West Paw",
    category: "Toys & Enrichment",
    description:
      "Recyclable, BPA-free, latex-free chew toy made in Montana from West Paw's proprietary Zogoflex material. Floats and is dishwasher-safe.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "B-Corp certified, made in the USA, and one of the only toy manufacturers that takes back worn-out toys to recycle into new ones.",
    editorsNote:
      "Our test dog destroys plush toys in minutes; the Hurley has lasted 18 months and counting. The closed-loop recycling program is a real bonus.",
    editorsPick: true,
    priceTier: "$$",
    bestFor: ["Power chewers", "Fetch", "Outdoor play"],
    tags: ["Made in USA", "B-Corp", "BPA-free", "Recyclable packaging", "Recycled materials"],
    retailers: [
      { retailer: "West Paw", url: "https://www.westpaw.com/" },
      { retailer: "Amazon", url: "https://www.amazon.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Planet Dog Orbee-Tuff Snoop Treat Dispenser",
    brand: "Planet Dog",
    category: "Toys & Enrichment",
    description:
      "Flexible, treat-dispensing puzzle toy made from non-toxic, BPA-free Orbee-Tuff material. A portion of each sale funds service-dog programs.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large",
    whyRecommended:
      "Mental enrichment that's safer than hard plastic puzzles. The flexible material means it can be tossed, chewed, and slow-fed without breaking.",
    editorsNote: null,
    editorsPick: true,
    priceTier: "$$",
    bestFor: ["Bored dogs", "Slow feeding", "Anxious dogs"],
    tags: ["BPA-free", "Phthalate-free"],
    retailers: [{ retailer: "Amazon", url: "https://www.amazon.com/" }],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Wild One Harness",
    brand: "Wild One",
    category: "Leashes & Harnesses",
    description:
      "Lightweight, padded step-in harness made from recycled, water-resistant materials with a no-pull front clip and reflective trim.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large",
    whyRecommended:
      "Designed by a vet-led team, with recycled materials throughout and packaging that's plastic-free. Comfortable enough for all-day wear.",
    editorsNote:
      "The padded chest plate is genuinely better than most harnesses twice the price. Pairs beautifully with their matching leash.",
    editorsPick: true,
    priceTier: "$$",
    bestFor: ["Daily walks", "Pullers in training", "Sensitive skin"],
    tags: ["Recycled materials", "Plastic-free", "Phthalate-free"],
    retailers: [
      { retailer: "Wild One", url: "https://www.wildone.com/" },
      { retailer: "Amazon", url: "https://www.amazon.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Found My Animal Rope Leash",
    brand: "Found My Animal",
    category: "Leashes & Harnesses",
    description:
      "Hand-spliced cotton rope leash made in Brooklyn, NY. A portion of every sale funds shelter and rescue partners.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "Built to last decades, not seasons. Plant-based materials and a clear charitable model that's been running for over a decade.",
    editorsNote: null,
    editorsPick: false,
    priceTier: "$$$",
    bestFor: ["Strong pullers", "Long walks", "Owners who want one leash for life"],
    tags: ["Made in USA", "Plant-based", "Cruelty-free"],
    retailers: [{ retailer: "Found My Animal", url: "https://www.foundmyanimal.com/" }],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Earth Rated Compostable Poop Bags",
    brand: "Earth Rated",
    category: "Cleanup",
    description:
      "USDA-certified plant-based, home-compostable poop bags. Leak-proof, lavender-scented or unscented options.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "One of the only certified-compostable poop bag brands that actually breaks down at home (most 'biodegradable' bags don't).",
    editorsNote:
      "If you switch one thing for the planet this year, make it your poop bags. Earth Rated also runs a 1% for the Planet membership.",
    editorsPick: true,
    priceTier: "$",
    bestFor: ["Daily walks", "Eco-conscious owners"],
    tags: ["Plant-based", "Compostable", "Plastic-free", "B-Corp"],
    retailers: [
      { retailer: "Amazon", url: "https://www.amazon.com/" },
      { retailer: "Chewy", url: "https://www.chewy.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Bocce's Bakery Training Treats",
    brand: "Bocce's Bakery",
    category: "Food & Treats",
    description:
      "Limited-ingredient, soft training treats baked in Brooklyn with whole foods like peanut butter, banana, and oatmeal — no preservatives.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large",
    whyRecommended:
      "Most training treats are loaded with mystery ingredients. Bocce's keeps the ingredient list to under 10 recognizable items.",
    editorsNote: null,
    editorsPick: false,
    priceTier: "$",
    bestFor: ["Puppies", "Training sessions", "Sensitive stomachs"],
    tags: ["Limited ingredient", "Made in USA", "Non-GMO"],
    retailers: [{ retailer: "Amazon", url: "https://www.amazon.com/" }],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "4-Legger Organic Hypoallergenic Shampoo",
    brand: "4-Legger",
    category: "Grooming & Coat Care",
    description:
      "USDA-certified organic dog shampoo with aloe and lemongrass. Free of synthetic detergents, parabens, and artificial fragrance.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "Genuinely USDA-certified organic — most 'natural' dog shampoos still contain synthetic surfactants. Safe for sensitive skin.",
    editorsNote:
      "A go-to for owners of breeds with skin allergies. Rinses out cleanly and doesn't leave residue.",
    editorsPick: true,
    priceTier: "$$",
    bestFor: ["Sensitive skin", "Allergy-prone breeds", "Puppies"],
    tags: ["Organic", "Cruelty-free", "Made in USA", "Plant-based"],
    retailers: [
      { retailer: "Amazon", url: "https://www.amazon.com/" },
      { retailer: "4-Legger", url: "https://4-legger.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Big Barker Orthopedic Dog Bed",
    brand: "Big Barker",
    category: "Beds & Crates",
    description:
      "10-year warranty orthopedic bed engineered for large and giant breeds. Made in the USA from CertiPUR-US-certified foam that won't flatten.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Large,Giant",
    whyRecommended:
      "Independently studied by the University of Pennsylvania School of Veterinary Medicine and shown to improve joint comfort in large dogs.",
    editorsNote:
      "The 10-year warranty is unheard of in pet beds. If you have a large-breed dog with hip or joint concerns, this is the bed to buy.",
    editorsPick: true,
    priceTier: "$$$",
    bestFor: ["Senior dogs", "Large breeds", "Joint issues"],
    tags: ["Made in USA"],
    retailers: [{ retailer: "Big Barker", url: "https://bigbarker.com/" }],
    linkPlaceholder: null,
    sponsored: false,
  },
  {
    name: "Pet Honesty Multivitamin Soft Chews",
    brand: "Pet Honesty",
    category: "Health & Supplements",
    description:
      "10-in-1 daily multivitamin chew with glucosamine, omega-3s, probiotics, and antioxidants. NASC-certified facility.",
    imageUrl: null, // overridden by CATEGORY_IMAGES below
    suitableSizes: "Small,Medium,Large,Giant",
    whyRecommended:
      "Made in an NASC-quality-seal facility (the National Animal Supplement Council's gold standard) with no artificial preservatives.",
    editorsNote: null,
    editorsPick: false,
    priceTier: "$$",
    bestFor: ["Adult dogs", "Senior dogs", "Coat & joint support"],
    tags: ["Made in USA", "Vet-formulated"],
    retailers: [
      { retailer: "Amazon", url: "https://www.amazon.com/" },
      { retailer: "Pet Honesty", url: "https://pethonesty.com/" },
    ],
    linkPlaceholder: null,
    sponsored: false,
  },
];

export const productSeedData: InsertProduct[] = rawProductSeedData.map((p) => ({
  ...p,
  imageUrl: p.imageUrl ?? CATEGORY_IMAGES[p.category] ?? null,
}));
