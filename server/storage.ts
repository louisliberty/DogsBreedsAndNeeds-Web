import { db } from "./db";
import { breeds, products, type Breed, type InsertBreed, type Product, type InsertProduct } from "@shared/schema";
import { eq, ilike, and, sql } from "drizzle-orm";

export interface IStorage {
  getAllBreeds(): Promise<Breed[]>;
  getBreedBySlug(slug: string): Promise<Breed | undefined>;
  getBreedById(id: number): Promise<Breed | undefined>;
  getBreedsByGroup(group: string): Promise<Breed[]>;
  searchBreeds(query: string): Promise<Breed[]>;
  upsertBreed(breed: InsertBreed): Promise<Breed>;
  updateBreed(id: number, data: Partial<InsertBreed>): Promise<Breed | undefined>;
  deleteBreed(id: number): Promise<void>;
  getBreedCount(): Promise<number>;

  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySizes(sizes: string[]): Promise<Product[]>;
  upsertProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllBreeds(): Promise<Breed[]> {
    return await db.select().from(breeds).orderBy(breeds.name);
  }

  async getBreedBySlug(slug: string): Promise<Breed | undefined> {
    const [breed] = await db.select().from(breeds).where(eq(breeds.slug, slug));
    return breed;
  }

  async getBreedById(id: number): Promise<Breed | undefined> {
    const [breed] = await db.select().from(breeds).where(eq(breeds.id, id));
    return breed;
  }

  async getBreedsByGroup(group: string): Promise<Breed[]> {
    return await db.select().from(breeds).where(eq(breeds.breedGroup, group)).orderBy(breeds.name);
  }

  async searchBreeds(query: string): Promise<Breed[]> {
    return await db.select().from(breeds).where(ilike(breeds.name, `%${query}%`)).orderBy(breeds.name);
  }

  async upsertBreed(breed: InsertBreed): Promise<Breed> {
    const [result] = await db
      .insert(breeds)
      .values(breed)
      .onConflictDoUpdate({
        target: breeds.slug,
        set: breed,
      })
      .returning();
    return result;
  }

  async updateBreed(id: number, data: Partial<InsertBreed>): Promise<Breed | undefined> {
    const [result] = await db.update(breeds).set(data).where(eq(breeds.id, id)).returning();
    return result;
  }

  async deleteBreed(id: number): Promise<void> {
    await db.delete(breeds).where(eq(breeds.id, id));
  }

  async getBreedCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(breeds);
    return Number(result.count);
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category)).orderBy(products.name);
  }

  async getProductsBySizes(sizes: string[]): Promise<Product[]> {
    const allProducts = await db.select().from(products).orderBy(products.name);
    return allProducts.filter(p => sizes.some(s => p.suitableSizes.includes(s)));
  }

  async upsertProduct(product: InsertProduct): Promise<Product> {
    const existing = await db.select().from(products).where(eq(products.name, product.name));
    if (existing.length > 0) {
      const [result] = await db.update(products).set(product).where(eq(products.name, product.name)).returning();
      return result;
    }
    const [result] = await db.insert(products).values(product).returning();
    return result;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [result] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return result;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();
