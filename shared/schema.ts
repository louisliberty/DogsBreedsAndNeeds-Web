import { pgTable, text, varchar, integer, boolean, serial, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const breeds = pgTable("breeds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  breedGroup: text("breed_group").notNull(),
  originCountry: text("origin_country").notNull(),
  yearRecognized: integer("year_recognized"),
  imageUrl: text("image_url"),

  sizeCategory: text("size_category").notNull(),
  weightRange: text("weight_range").notNull(),
  heightRange: text("height_range").notNull(),
  lifespan: text("lifespan").notNull(),
  coatType: text("coat_type").notNull(),
  coatColors: text("coat_colors").notNull(),
  sheddingLevel: text("shedding_level").notNull(),
  hypoallergenic: boolean("hypoallergenic").notNull().default(false),

  temperamentSummary: text("temperament_summary").notNull(),
  energyLevel: text("energy_level").notNull(),
  trainability: text("trainability").notNull(),
  barkingTendency: text("barking_tendency").notNull(),
  goodWithKids: integer("good_with_kids").notNull().default(3),
  goodWithDogs: integer("good_with_dogs").notNull().default(3),
  goodWithCats: integer("good_with_cats").notNull().default(3),
  strangerFriendliness: integer("stranger_friendliness").notNull().default(3),
  apartmentSuitable: boolean("apartment_suitable").notNull().default(false),

  exerciseNeeds: text("exercise_needs").notNull(),
  groomingFrequency: text("grooming_frequency").notNull(),
  commonHealthIssues: text("common_health_issues").notNull(),
  dietNotes: text("diet_notes").notNull(),
  trainingNotes: text("training_notes").notNull(),

  history: text("history").notNull(),
  personalityDeepDive: text("personality_deep_dive").notNull(),
  livingWith: text("living_with").notNull(),
  healthCareGuide: text("health_care_guide").notNull(),
  funFact: text("fun_fact").notNull(),
  famousQuote: text("famous_quote").notNull(),
  popularity: integer("popularity").notNull().default(100),

  contentQuality: text("content_quality").notNull().default("templated"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  reviewedBy: text("reviewed_by"),
  funFacts: text("fun_facts").array().notNull().default(sql`ARRAY[]::text[]`),
  commonMisconceptions: text("common_misconceptions").notNull().default(""),
  idealOwnerProfile: text("ideal_owner_profile").notNull().default(""),
  notGoodFor: text("not_good_for").notNull().default(""),
});

export const meta = pgTable("meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  suitableSizes: text("suitable_sizes").notNull(),
  whyRecommended: text("why_recommended").notNull(),
  linkPlaceholder: text("link_placeholder"),
  sponsored: boolean("sponsored").notNull().default(false),
});

export const insertBreedSchema = createInsertSchema(breeds).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const updateBreedSchema = insertBreedSchema.partial();

export type InsertBreed = z.infer<typeof insertBreedSchema>;
export type Breed = typeof breeds.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const breedGroups = ["Sporting", "Hound", "Working", "Terrier", "Toy", "Non-Sporting", "Herding"] as const;
export const sizeCategories = ["Small", "Medium", "Large", "Giant"] as const;
export const energyLevels = ["Low", "Moderate", "High", "Very High"] as const;
export const trainabilityLevels = ["Easy", "Moderate", "Challenging", "Independent"] as const;
export const sheddingLevels = ["Low", "Moderate", "High", "Very High"] as const;
export const coatTypes = ["Short", "Medium", "Long", "Wiry", "Curly", "Double", "Hairless"] as const;
export const barkingTendencies = ["Rare", "Occasional", "Frequent", "Vocal"] as const;
export const productCategories = ["Food", "Toys", "Training", "Grooming", "Health"] as const;
export const contentQualityLevels = ["templated", "draft", "reviewed", "verified"] as const;

export const CONTENT_FIELD_MINIMUMS: Record<string, number> = {
  personalityDeepDive: 150,
  history: 100,
  livingWith: 80,
  healthCareGuide: 80,
  trainingNotes: 60,
  dietNotes: 50,
  groomingFrequency: 30,
  idealOwnerProfile: 40,
  notGoodFor: 30,
  commonMisconceptions: 40,
};

export function wordCount(text: string | null | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function computeCompletenessScore(breed: Partial<Breed>): {
  score: number;
  missing: string[];
} {
  const fields = Object.keys(CONTENT_FIELD_MINIMUMS);
  let passed = 0;
  const missing: string[] = [];
  for (const field of fields) {
    const min = CONTENT_FIELD_MINIMUMS[field];
    const value = (breed as any)[field] as string | undefined;
    if (wordCount(value) >= min) {
      passed++;
    } else {
      missing.push(field);
    }
  }
  const facts = (breed as any).funFacts as string[] | undefined;
  if (facts && facts.length >= 3) passed++;
  else missing.push("funFacts");
  const total = fields.length + 1;
  return { score: Math.round((passed / total) * 100), missing };
}
