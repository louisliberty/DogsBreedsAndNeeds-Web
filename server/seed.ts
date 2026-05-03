import { storage } from "./storage";
import { breedSeedData } from "./breedData";
import { productSeedData } from "./productData";
import { computeCompletenessScore } from "@shared/schema";

const SEED_VERSION = "v7-content-foundation-curated-and-backfill";
const QUALITY_BACKFILL_VERSION = "v1";

export async function seedDatabase() {
  const count = await storage.getBreedCount();
  const versionRow = await storage.getMeta("seedVersion");
  const backfillRow = await storage.getMeta("qualityBackfillVersion");

  if (count >= 200 && versionRow === SEED_VERSION) {
    console.log(`Database already seeded with ${count} breeds (${SEED_VERSION})`);
    if (backfillRow !== QUALITY_BACKFILL_VERSION) {
      await runQualityBackfill();
    }
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
    // Preserve admin-edited / reviewed content. Only re-seed records that are
    // still "templated" AND have no human reviewer attached.
    if (existing.reviewedBy || existing.contentQuality !== "templated") {
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
}

// One-time backfill: classify any record whose contentQuality is the default
// "templated" using the field-length / completeness heuristic. Records with an
// explicit reviewer or already-promoted quality are left alone.
async function runQualityBackfill() {
  console.log("Running content-quality backfill...");
  const all = await storage.getAllBreeds();
  let promoted = 0;
  let demoted = 0;
  for (const b of all) {
    if (b.reviewedBy) continue;
    if (b.contentQuality === "verified" || b.contentQuality === "reviewed") continue;
    const { score } = computeCompletenessScore(b);
    const target = score >= 100 ? "draft" : "templated";
    if (target !== b.contentQuality) {
      await storage.updateBreed(b.id, { contentQuality: target });
      if (target === "draft") promoted++;
      else demoted++;
    }
  }
  console.log(`Quality backfill complete: promoted=${promoted}, demoted=${demoted}`);
  await storage.setMeta("qualityBackfillVersion", QUALITY_BACKFILL_VERSION);
}
