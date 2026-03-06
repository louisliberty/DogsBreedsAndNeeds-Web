import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertBreedSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  const DOMAIN = "https://dogbreedsandneeds.com";

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`
    );
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const breeds = await storage.getAllBreeds();
      const staticPages = [
        { loc: "", priority: "1.0", changefreq: "weekly" },
        { loc: "/breeds", priority: "0.9", changefreq: "weekly" },
        { loc: "/dog-breed-selector", priority: "0.8", changefreq: "monthly" },
        { loc: "/ethical-sourcing", priority: "0.7", changefreq: "monthly" },
        { loc: "/find-a-breeder", priority: "0.8", changefreq: "monthly" },
        { loc: "/poodle-rescue", priority: "0.7", changefreq: "monthly" },
        { loc: "/products", priority: "0.7", changefreq: "weekly" },
        { loc: "/sitemap", priority: "0.3", changefreq: "monthly" },
      ];
      const today = new Date().toISOString().split("T")[0];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${DOMAIN}${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }
      for (const breed of breeds) {
        xml += `  <url>\n    <loc>${DOMAIN}/breeds/${breed.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
      xml += `</urlset>`;
      res.type("application/xml").send(xml);
    } catch (error) {
      res.status(500).send("Failed to generate sitemap");
    }
  });

  app.get("/api/breeds", async (_req, res) => {
    try {
      const { group, search, limit } = _req.query;
      let breeds;
      if (search && typeof search === "string") {
        breeds = await storage.searchBreeds(search);
      } else if (group && typeof group === "string") {
        breeds = await storage.getBreedsByGroup(group);
      } else {
        breeds = await storage.getAllBreeds();
      }
      if (limit && typeof limit === "string") {
        breeds = breeds.slice(0, parseInt(limit));
      }
      res.json(breeds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breeds" });
    }
  });

  app.get("/api/breeds/count", async (_req, res) => {
    try {
      const count = await storage.getBreedCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get breed count" });
    }
  });

  app.get("/api/breeds/:slug", async (req, res) => {
    try {
      const breed = await storage.getBreedBySlug(req.params.slug);
      if (!breed) {
        return res.status(404).json({ message: "Breed not found" });
      }
      res.json(breed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breed" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const { category, sizes } = _req.query;
      let products;
      if (category && typeof category === "string") {
        products = await storage.getProductsByCategory(category);
      } else if (sizes && typeof sizes === "string") {
        products = await storage.getProductsBySizes(sizes.split(","));
      } else {
        products = await storage.getAllProducts();
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.put("/api/admin/breeds/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      const updated = await storage.updateBreed(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Breed not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update breed" });
    }
  });

  app.delete("/api/admin/breeds/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteBreed(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete breed" });
    }
  });

  app.post("/api/admin/breeds", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const breed = await storage.upsertBreed(req.body);
      res.json(breed);
    } catch (error) {
      res.status(500).json({ message: "Failed to create breed" });
    }
  });

  return httpServer;
}
