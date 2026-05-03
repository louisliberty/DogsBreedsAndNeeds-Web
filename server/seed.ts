import { storage } from "./storage";
import { breedSeedData } from "./breedData";
import { productSeedData } from "./productData";

const SEED_VERSION = "v6-content-foundation-grooming-guide-split";

export async function seedDatabase() {
  const count = await storage.getBreedCount();
  const versionRow = await storage.getMeta("seedVersion");

  if (count >= 200 && versionRow === SEED_VERSION) {
    console.log(`Database already seeded with ${count} breeds (${SEED_VERSION})`);
    return;
  }

  console.log(`Seeding/refreshing breeds (${SEED_VERSION})...`);
  for (const breed of breedSeedData) {
    await storage.upsertBreed(breed);
  }
  console.log(`Seeded ${breedSeedData.length} breeds`);

  console.log("Seeding products...");
  for (const product of productSeedData) {
    await storage.upsertProduct(product);
  }
  console.log(`Seeded ${productSeedData.length} products`);

  await storage.setMeta("seedVersion", SEED_VERSION);
}
