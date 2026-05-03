import { pgTable, text, varchar, integer, boolean, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  groomingGuide: text("grooming_guide").notNull().default(""),
  faqs: jsonb("faqs").$type<{ question: string; answer: string }[]>().notNull().default(sql`'[]'::jsonb`),
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

export const sizeCategories = ["Toy", "Small", "Medium", "Large", "Giant"] as const;
export const energyLevels = ["Low", "Moderate", "High", "Very High"] as const;
export const sheddingLevels = ["Low", "Moderate", "High", "Very High"] as const;
export const trainabilityLevels = ["Easy", "Moderate", "Challenging", "Independent"] as const;
export const barkingTendencies = ["Rare", "Occasional", "Frequent", "Vocal"] as const;
export const productCategories = ["Food", "Toys", "Training", "Grooming", "Health"] as const;
export const contentQualityLevels = ["templated", "draft", "reviewed", "verified"] as const;

export const breedFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type BreedFaq = z.infer<typeof breedFaqSchema>;

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  matchedBreeds: text("matched_breeds").array().notNull().default(sql`ARRAY[]::text[]`),
  answers: jsonb("answers").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults, {
  email: z.string().email(),
  matchedBreeds: z.array(z.string()).min(1).max(10),
  answers: z.record(z.string(), z.string()),
}).omit({ id: true, createdAt: true });
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

export const rescueOrganizations = pgTable("rescue_organizations", {
  id: serial("id").primaryKey(),
  breedSlug: text("breed_slug").notNull(),
  name: text("name").notNull(),
  url: text("url"),
  region: text("region").notNull(),
  description: text("description").notNull().default(""),
  phone: text("phone"),
  email: text("email"),
});

export const insertRescueOrganizationSchema = createInsertSchema(rescueOrganizations, {
  breedSlug: z.string().min(1),
  name: z.string().min(1),
  region: z.string().min(1),
  url: z.string().url().nullish(),
  email: z.string().email().nullish().or(z.literal("")),
}).omit({ id: true });
export type InsertRescueOrganization = z.infer<typeof insertRescueOrganizationSchema>;
export type RescueOrganization = typeof rescueOrganizations.$inferSelect;

export const articleCategories = [
  "Lifestyle",
  "Breed Guides",
  "Adoption",
  "Training",
  "Health",
] as const;
export type ArticleCategory = typeof articleCategories[number];

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  author: text("author").notNull().default("Dog Breeds & Needs Editorial"),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  featuredImage: text("featured_image"),
});

export const insertArticleSchema = createInsertSchema(articles, {
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  title: z.string().min(1),
  metaDescription: z.string().min(1).max(300),
  content: z.string().min(1),
  category: z.enum(articleCategories),
  tags: z.array(z.string()),
  publishedAt: z.coerce.date().nullish(),
  featuredImage: z.string().url().nullish().or(z.literal("")),
}).omit({ id: true, updatedAt: true });
export const updateArticleSchema = insertArticleSchema.partial();
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const insertBreedSchema = createInsertSchema(breeds, {
  contentQuality: z.enum(contentQualityLevels),
  faqs: z.array(breedFaqSchema),
}).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const updateBreedSchema = insertBreedSchema.partial();

export type InsertBreed = z.infer<typeof insertBreedSchema>;
export type Breed = typeof breeds.$inferSelect;

export const BREED_LITE_FIELDS = [
  "id",
  "name",
  "slug",
  "breedGroup",
  "sizeCategory",
  "weightRange",
  "heightRange",
  "lifespan",
  "energyLevel",
  "trainability",
  "sheddingLevel",
  "groomingFrequency",
  "barkingTendency",
  "goodWithKids",
  "goodWithDogs",
  "goodWithCats",
  "strangerFriendliness",
  "apartmentSuitable",
  "popularity",
  "temperamentSummary",
  "hypoallergenic",
  "imageUrl",
  "lastUpdated",
] as const;
export type BreedLite = Pick<Breed, typeof BREED_LITE_FIELDS[number]>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const breedGroups = ["Sporting", "Hound", "Working", "Terrier", "Toy", "Non-Sporting", "Herding"] as const;
export const coatTypes = ["Short", "Medium", "Long", "Wiry", "Curly", "Double", "Hairless"] as const;

type LongFormField =
  | "personalityDeepDive"
  | "history"
  | "livingWith"
  | "healthCareGuide"
  | "trainingNotes"
  | "dietNotes"
  | "groomingGuide"
  | "idealOwnerProfile"
  | "notGoodFor"
  | "commonMisconceptions";

export const CONTENT_FIELD_MINIMUMS: Record<LongFormField, number> = {
  personalityDeepDive: 150,
  history: 100,
  livingWith: 80,
  healthCareGuide: 80,
  trainingNotes: 60,
  dietNotes: 50,
  groomingGuide: 30,
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
  const fields = Object.keys(CONTENT_FIELD_MINIMUMS) as LongFormField[];
  let passed = 0;
  const missing: string[] = [];
  for (const field of fields) {
    const min = CONTENT_FIELD_MINIMUMS[field];
    const value = breed[field] as string | undefined;
    if (wordCount(value) >= min) {
      passed++;
    } else {
      missing.push(field);
    }
  }
  const facts = breed.funFacts as string[] | undefined;
  if (facts && facts.length >= 3) passed++;
  else missing.push("funFacts");
  const total = fields.length + 1;
  return { score: Math.round((passed / total) * 100), missing };
}

// Heuristic for backfilling content quality on EXISTING records that have no
// explicit quality marker yet. Note: freshly-generated/templated seed data should
// always be tagged "templated", only human-edited or human-reviewed content should
// be promoted above that tier.
export function inferContentQuality(breed: Partial<Breed>): "templated" | "draft" | "reviewed" | "verified" {
  if (breed.contentQuality === "verified") return "verified";
  if (breed.reviewedBy && breed.reviewedBy.trim().length > 0) return "reviewed";
  if (breed.contentQuality === "draft") return "draft";
  return "templated";
}
