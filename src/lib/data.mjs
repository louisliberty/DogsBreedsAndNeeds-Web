import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const load = (f) => JSON.parse(readFileSync(path.join(ROOT, "data", f), "utf8"));

export const DOMAIN = "https://dogbreedsandneeds.com";
export const SITE_NAME = "Dog Breeds & Needs";

export const BREED_GROUPS = ["Sporting", "Hound", "Working", "Terrier", "Toy", "Non-Sporting", "Herding"];
export const SIZES = ["Toy", "Small", "Medium", "Large", "Giant"];
export const ENERGY = ["Low", "Moderate", "High", "Very High"];
export const PRODUCT_CATEGORIES = [
  "Food & Treats", "Toys & Enrichment", "Leashes & Harnesses", "Grooming & Coat Care",
  "Beds & Crates", "Health & Supplements", "Cleanup",
];
export const ARTICLE_CATEGORIES = ["Lifestyle", "Breed Guides", "Adoption", "Training", "Health"];

// Postgres "2026-05-03 01:07:05.484" (UTC, no zone) -> ISO string
const iso = (s) => (s ? new Date(s.replace(" ", "T") + "Z").toISOString() : null);

export const breeds = load("breeds.json")
  .map((b) => ({ ...b, lastUpdated: iso(b.lastUpdated) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const breedBySlug = new Map(breeds.map((b) => [b.slug, b]));

export const products = load("products.json").sort((a, b) => a.name.localeCompare(b.name));

export const rescues = load("rescues.json").sort(
  (a, b) => a.breedSlug.localeCompare(b.breedSlug) || a.name.localeCompare(b.name),
);
export const rescuesBySlug = new Map();
for (const r of rescues) {
  if (!rescuesBySlug.has(r.breedSlug)) rescuesBySlug.set(r.breedSlug, []);
  rescuesBySlug.get(r.breedSlug).push(r);
}

export const articles = load("articles.json")
  .map((a) => ({ ...a, publishedAt: iso(a.publishedAt), updatedAt: iso(a.updatedAt) }))
  .filter((a) => a.publishedAt)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const byPopularity = [...breeds].sort((a, b) => a.popularity - b.popularity);

export function relatedBreeds(breed) {
  return breeds
    .filter((b) => b.breedGroup === breed.breedGroup && b.slug !== breed.slug)
    .map((b) => ({
      b,
      score: (b.sizeCategory === breed.sizeCategory ? 2 : 0) + (b.energyLevel === breed.energyLevel ? 1 : 0),
    }))
    .sort((x, y) => y.score - x.score || x.b.popularity - y.b.popularity)
    .slice(0, 4)
    .map((x) => x.b);
}

export const productsForSize = (size) => products.filter((p) => p.suitableSizes.includes(size));

export const breedImg = (slug) => `/breeds/${slug}.webp`;
export const breedThumb = (slug) => `/breeds/thumbs/${slug}.webp`;
export const breedAlt = (b) => `${b.name}, ${b.sizeCategory} ${b.breedGroup} dog breed portrait`;

export const fmtDate = (isoStr) =>
  new Date(isoStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// Trait scores shared by the breed page (and mirrored in the client scripts)
export const energyScore = (v) => ({ "Very High": 5, High: 4, Moderate: 3, Low: 1 })[v] ?? 3;
export const trainScore = (v) => ({ Easy: 5, Moderate: 3, Challenging: 2, Independent: 2 })[v] ?? 3;
export const barkScore = (v) => ({ Rare: 1, Occasional: 2, Frequent: 4, Vocal: 5 })[v] ?? 3;
export const groomScore = (v) => ({ Low: 2, Moderate: 3, High: 4, "Very High": 5 })[v] ?? 3;
