import { storage } from "./storage";
import { breedSeedData } from "./breedData";
import { productSeedData } from "./productData";
import { computeCompletenessScore } from "@shared/schema";
import { generateFaqs } from "./contentGenerator";
import { rescueSeedData, RESCUE_SEED_VERSION } from "./rescueData";
import { articleSeedData, ARTICLE_SEED_VERSION } from "./articleData";

const SEED_VERSION = "v10-task2-faqs";
const QUALITY_BACKFILL_VERSION = "v2-legacy-only";
const FAQ_BACKFILL_VERSION = "v1-task2-faqs";

export async function seedDatabase() {
  const count = await storage.getBreedCount();
  const versionRow = await storage.getMeta("seedVersion");
  const backfillRow = await storage.getMeta("qualityBackfillVersion");

  if (count >= 200 && versionRow === SEED_VERSION) {
    console.log(`Database already seeded with ${count} breeds (${SEED_VERSION})`);
    if (backfillRow !== QUALITY_BACKFILL_VERSION) {
      await runQualityBackfill();
    }
    await runFaqBackfill();
    await seedRescues();
    await seedArticles();
    return;
  }

  console.log(`Seeding/refreshing breeds (${SEED_VERSION})...`);
  let inserted = 0;
  let skippedEdited = 0;
  let updated = 0;
  for (const breed of breedSeedData) {
    const existing = await storage.getBreedBySlug(breed.slug);
    if (!existing) {
      await storage.upsertBreed(breed);
      inserted++;
      continue;
    }
    // Preserve human-touched content: a named reviewer, or quality explicitly
    // promoted to "reviewed"/"verified" via the admin panel. Records still at
    // "templated" or auto-"draft" remain re-seedable so that content updates
    // can roll out to all breeds that no human has signed off on yet.
    if (
      existing.reviewedBy ||
      existing.contentQuality === "reviewed" ||
      existing.contentQuality === "verified"
    ) {
      skippedEdited++;
      continue;
    }
    await storage.upsertBreed(breed);
    updated++;
  }
  console.log(
    `Breeds: inserted=${inserted}, refreshed=${updated}, preserved (admin-edited)=${skippedEdited}`,
  );

  console.log("Seeding products...");
  for (const product of productSeedData) {
    await storage.upsertProduct(product);
  }
  console.log(`Seeded ${productSeedData.length} products`);

  await storage.setMeta("seedVersion", SEED_VERSION);
  await runQualityBackfill();
  await runFaqBackfill();
  await seedRescues();
  await seedArticles();
}

async function seedArticles() {
  const done = await storage.getMeta("articleSeedVersion");
  if (done === ARTICLE_SEED_VERSION) return;
  console.log(`Seeding articles (${ARTICLE_SEED_VERSION})...`);
  for (const a of articleSeedData) {
    await storage.upsertArticle(a);
  }
  console.log(`Seeded ${articleSeedData.length} articles`);
  await storage.setMeta("articleSeedVersion", ARTICLE_SEED_VERSION);
}

async function seedRescues() {
  const done = await storage.getMeta("rescueSeedVersion");
  if (done === RESCUE_SEED_VERSION) return;
  console.log(`Seeding rescue organizations (${RESCUE_SEED_VERSION})...`);
  await storage.deleteAllRescues();
  for (const rescue of rescueSeedData) {
    await storage.insertRescue(rescue);
  }
  console.log(`Seeded ${rescueSeedData.length} rescue organizations across breeds`);
  await storage.setMeta("rescueSeedVersion", RESCUE_SEED_VERSION);
}

// One-time FAQ backfill: ensures every breed has at least 5 FAQs, including
// admin-preserved (reviewed/verified) records that the main seed loop skips.
// Replaces FAQ arrays that are missing or shorter than 5 entries with the
// deterministic templated set (7 Qs). FAQ arrays already at >=5 entries are
// left untouched, so manually authored FAQs are preserved.
async function runFaqBackfill() {
  const done = await storage.getMeta("faqBackfillVersion");
  if (done === FAQ_BACKFILL_VERSION) return;
  console.log("Running FAQ backfill (fills empty FAQ arrays only)...");
  const all = await storage.getAllBreeds();
  let filled = 0;
  for (const b of all) {
    if (b.faqs && b.faqs.length >= 5) continue;
    const generated = generateFaqs({
      name: b.name, group: b.breedGroup, origin: b.originCountry,
      size: b.sizeCategory, weight: b.weightRange, height: b.heightRange,
      life: b.lifespan, coat: b.coatType, colors: b.coatColors,
      shedding: b.sheddingLevel, hypo: b.hypoallergenic,
      temperament: b.temperamentSummary, energy: b.energyLevel,
      trainability: b.trainability, barking: b.barkingTendency,
      kids: b.goodWithKids, dogs: b.goodWithDogs, cats: b.goodWithCats,
      strangers: b.strangerFriendliness, apartment: b.apartmentSuitable,
      exercise: b.exerciseNeeds, grooming: b.groomingFrequency,
      health: b.commonHealthIssues, funFact: b.funFact, popularity: b.popularity,
    });
    await storage.updateBreed(b.id, { faqs: generated });
    filled++;
  }
  console.log(`FAQ backfill complete: filled=${filled} breed(s)`);
  await storage.setMeta("faqBackfillVersion", FAQ_BACKFILL_VERSION);
}

// One-time backfill: classify legacy/imported records that lack an explicit
// content-quality tag. We preserve every explicit tier, including "templated"
// for generator-produced seed content, so this only acts on records whose
// quality is missing or set to an unexpected value (e.g. legacy imports).
const KNOWN_QUALITIES = new Set(["templated", "draft", "reviewed", "verified"]);
async function runQualityBackfill() {
  console.log("Running content-quality backfill (legacy records only)...");
  const all = await storage.getAllBreeds();
  let classified = 0;
  for (const b of all) {
    // Preserve any explicit, recognized tier. Generator output is intentionally
    // tagged "templated" at seed time and must NOT be promoted by this script.
    if (b.contentQuality && KNOWN_QUALITIES.has(b.contentQuality)) continue;
    const target = b.reviewedBy
      ? "reviewed"
      : computeCompletenessScore(b).score >= 100
      ? "draft"
      : "templated";
    await storage.updateBreed(b.id, { contentQuality: target });
    classified++;
  }
  console.log(`Quality backfill complete: classified=${classified} legacy record(s)`);
  await storage.setMeta("qualityBackfillVersion", QUALITY_BACKFILL_VERSION);
}
