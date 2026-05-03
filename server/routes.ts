import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertBreedSchema, insertProductSchema, updateBreedSchema, insertQuizResultSchema, insertArticleSchema, updateArticleSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  const DOMAIN = "https://dogbreedsandneeds.com";

  const breedImagesDir = path.resolve(process.cwd(), "attached_assets", "breeds");
  app.get(/^\/breeds\/([a-z0-9-]+)\.(png|webp)$/, (req, res, next) => {
    const slug = req.params[0];
    const ext = req.params[1];
    const filePath = path.join(breedImagesDir, `${slug}.${ext}`);
    res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
    if (ext === "webp") res.type("image/webp");
    res.sendFile(filePath, (err) => {
      if (err) next();
    });
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`
    );
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const breeds = await storage.getAllBreeds();
      const rescueSlugs = await storage.getRescueBreedSlugs();
      const articles = await storage.getPublishedArticles();
      const staticPages = [
        { loc: "", priority: "1.0", changefreq: "weekly" },
        { loc: "/breeds", priority: "0.9", changefreq: "weekly" },
        { loc: "/compare", priority: "0.8", changefreq: "monthly" },
        { loc: "/dog-breed-selector", priority: "0.8", changefreq: "monthly" },
        { loc: "/ethical-sourcing", priority: "0.7", changefreq: "monthly" },
        { loc: "/find-a-breeder", priority: "0.8", changefreq: "monthly" },
        { loc: "/rescue", priority: "0.8", changefreq: "monthly" },
        { loc: "/blog", priority: "0.8", changefreq: "weekly" },
        { loc: "/products", priority: "0.7", changefreq: "weekly" },
        { loc: "/about", priority: "0.6", changefreq: "monthly" },
        { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
        { loc: "/terms", priority: "0.3", changefreq: "yearly" },
        { loc: "/sitemap", priority: "0.3", changefreq: "monthly" },
      ];
      const today = new Date().toISOString().split("T")[0];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${DOMAIN}${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }
      for (const breed of breeds) {
        const lastmod = new Date(breed.lastUpdated).toISOString().split("T")[0];
        const imageEntry = `    <image:image>\n      <image:loc>${DOMAIN}/breeds/${breed.slug}.webp</image:loc>\n      <image:title>${escapeXml(breed.name)} — ${escapeXml(breed.sizeCategory)} ${escapeXml(breed.breedGroup)} dog breed portrait</image:title>\n    </image:image>\n`;
        xml += `  <url>\n    <loc>${DOMAIN}/breeds/${breed.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n${imageEntry}  </url>\n`;
      }
      const breedBySlug = new Map(breeds.map((b) => [b.slug, b]));
      for (const slug of rescueSlugs) {
        const rb = breedBySlug.get(slug);
        const lastmod = rb ? new Date(rb.lastUpdated).toISOString().split("T")[0] : today;
        xml += `  <url>\n    <loc>${DOMAIN}/rescue/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
      for (const article of articles) {
        const lastmod = new Date(article.updatedAt).toISOString().split("T")[0];
        xml += `  <url>\n    <loc>${DOMAIN}/blog/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
      xml += `</urlset>`;
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.type("application/xml").send(xml);
    } catch (error) {
      res.status(500).send("Failed to generate sitemap");
    }
  });

  function escapeXml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

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

  app.get("/api/breeds/:slug/related", async (req, res) => {
    try {
      const breed = await storage.getBreedBySlug(req.params.slug);
      if (!breed) {
        return res.status(404).json({ message: "Breed not found" });
      }
      const groupBreeds = await storage.getBreedsByGroup(breed.breedGroup);
      const scored = groupBreeds
        .filter((b) => b.slug !== breed.slug)
        .map((b) => {
          let score = 0;
          if (b.sizeCategory === breed.sizeCategory) score += 2;
          if (b.energyLevel === breed.energyLevel) score += 1;
          return { breed: b, score };
        })
        .sort((a, b) => b.score - a.score || a.breed.popularity - b.breed.popularity)
        .slice(0, 4)
        .map((x) => x.breed);
      res.json(scored);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related breeds" });
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

  app.get("/poodle-rescue", (_req, res) => {
    res.redirect(301, "/rescue/poodle");
  });

  app.get("/api/rescues", async (_req, res) => {
    try {
      const rescues = await storage.getAllRescues();
      res.json(rescues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rescues" });
    }
  });

  app.get("/api/rescues/:breedSlug", async (req, res) => {
    try {
      const rescues = await storage.getRescuesByBreedSlug(req.params.breedSlug);
      res.json(rescues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rescues for breed" });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const includeDrafts = req.query.all === "1";
      if (includeDrafts) {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        return res.json(await storage.getAllArticles());
      }
      res.json(await storage.getPublishedArticles());
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_PASSWORD}`;
      if (!article.publishedAt && !isAdmin) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/admin/articles", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const parsed = insertArticleSchema.parse(req.body);
      const existing = await storage.getArticleBySlug(parsed.slug);
      if (existing) {
        return res.status(409).json({ message: "An article with this slug already exists" });
      }
      const article = await storage.createArticle(parsed);
      res.json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/admin/articles/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const parsed = updateArticleSchema.parse(req.body);
      const id = parseInt(req.params.id);
      if (parsed.slug) {
        const existing = await storage.getArticleBySlug(parsed.slug);
        if (existing && existing.id !== id) {
          return res.status(409).json({ message: "An article with this slug already exists" });
        }
      }
      const updated = await storage.updateArticle(id, parsed);
      if (!updated) return res.status(404).json({ message: "Article not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteArticle(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.post("/api/quiz-results", async (req, res) => {
    try {
      const parsed = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(parsed);
      res.json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save quiz result" });
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
      const parsed = updateBreedSchema.parse({
        ...req.body,
        lastUpdated: new Date(),
      });
      const updated = await storage.updateBreed(id, parsed);
      if (!updated) {
        return res.status(404).json({ message: "Breed not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
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
      const parsed = insertBreedSchema.parse(req.body);
      const breed = await storage.upsertBreed(parsed);
      res.json(breed);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create breed" });
    }
  });

  return httpServer;
}
