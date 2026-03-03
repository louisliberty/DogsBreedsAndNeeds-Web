import { storage } from "./storage";
import type { InsertBreed, InsertProduct } from "@shared/schema";
import { breedSeedData } from "./breedData";
import { productSeedData } from "./productData";

export async function seedDatabase() {
  const count = await storage.getBreedCount();
  if (count >= 200) {
    console.log(`Database already seeded with ${count} breeds`);
    return;
  }
  
  console.log("Seeding breeds...");
  for (const breed of breedSeedData) {
    await storage.upsertBreed(breed);
  }
  console.log(`Seeded ${breedSeedData.length} breeds`);

  console.log("Seeding products...");
  for (const product of productSeedData) {
    await storage.upsertProduct(product);
  }
  console.log(`Seeded ${productSeedData.length} products`);
}
