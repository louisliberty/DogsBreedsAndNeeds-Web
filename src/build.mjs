// Builds the whole site into dist/ — plain HTML, one CSS file, a few small scripts.
// Usage: node src/build.mjs
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { toStr } from "./lib/html.mjs";
import { layout } from "./lib/layout.mjs";
import { ROOT, DOMAIN, breeds, articles, rescuesBySlug, breedBySlug } from "./lib/data.mjs";
import home from "./pages/home.mjs";
import breedsIndex from "./pages/breeds.mjs";
import breedPages from "./pages/breed.mjs";
import { compare, quiz, quizResults } from "./pages/tools.mjs";
import { ethicalSourcing, findABreeder, about, howWeChoose, privacy, terms } from "./pages/guides.mjs";
import { rescueHub, rescueBreedPages, blogIndex, blogPosts, productsPage, sitemapPage, notFound } from "./pages/listings.mjs";

const DIST = path.join(ROOT, "dist");
const started = Date.now();
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 1. Static files (images, favicon, .htaccess) copied as-is
cpSync(path.join(ROOT, "public"), DIST, { recursive: true });

// 2. CSS + JS with content hashes so browsers can cache them for a year
const assets = { css: "", js: {} };
mkdirSync(path.join(DIST, "assets"), { recursive: true });
function emitAsset(file) {
  const src = readFileSync(path.join(ROOT, "src/assets", file));
  const hash = createHash("sha1").update(src).digest("hex").slice(0, 8);
  const ext = path.extname(file);
  const out = `${path.basename(file, ext)}.${hash}${ext}`;
  writeFileSync(path.join(DIST, "assets", out), src);
  return `/assets/${out}`;
}
assets.css = emitAsset("site.css");
for (const f of readdirSync(path.join(ROOT, "src/assets")).filter((f) => f.endsWith(".js"))) {
  assets.js[path.basename(f, ".js")] = emitAsset(f);
}

// 3. JSON the interactive pages load on demand
mkdirSync(path.join(DIST, "data"), { recursive: true });
const searchIndex = breeds.map((b) => [b.name, b.slug, b.breedGroup, b.sizeCategory]);
writeFileSync(path.join(DIST, "data/search-index.json"), JSON.stringify(searchIndex));
const traitData = breeds.map((b) => ({
  n: b.name, s: b.slug, g: b.breedGroup, z: b.sizeCategory, p: b.popularity, w: b.weightRange, h: b.heightRange,
  l: b.lifespan, e: b.energyLevel, t: b.trainability, k: b.barkingTendency, sh: b.sheddingLevel, gr: b.groomingFrequency,
  ki: b.goodWithKids, d: b.goodWithDogs, st: b.strangerFriendliness, a: b.apartmentSuitable, hy: b.hypoallergenic,
  tm: b.temperamentSummary, hi: b.commonHealthIssues, io: b.idealOwnerProfile, ng: b.notGoodFor,
}));
writeFileSync(path.join(DIST, "data/breeds.json"), JSON.stringify(traitData));

// 4. Pages
const pages = [
  home(), breedsIndex(), ...breedPages(), compare(), quiz(), quizResults(),
  ethicalSourcing(), findABreeder(), rescueHub(), ...rescueBreedPages(),
  blogIndex(), ...blogPosts(), productsPage(), howWeChoose(), about(), privacy(), terms(), sitemapPage(), notFound(),
];
const seen = new Set();
for (const page of pages) {
  if (seen.has(page.path)) throw new Error(`Duplicate page path ${page.path}`);
  seen.add(page.path);
  // "/breeds/x" -> breeds/x.html ; "/" -> index.html  (served without .html by .htaccess)
  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  const out = path.join(DIST, file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, toStr(layout(page, assets)));
}

// 5. sitemap.xml + robots.txt
const today = new Date().toISOString().slice(0, 10);
const day = (iso) => iso.slice(0, 10);
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const STATIC = [
  ["", "1.0", "weekly"], ["/breeds", "0.9", "weekly"], ["/compare", "0.8", "monthly"], ["/dog-breed-selector", "0.8", "monthly"],
  ["/ethical-sourcing", "0.7", "monthly"], ["/find-a-breeder", "0.8", "monthly"], ["/rescue", "0.8", "monthly"], ["/blog", "0.8", "weekly"],
  ["/products", "0.7", "weekly"], ["/products/how-we-choose", "0.5", "yearly"], ["/about", "0.6", "monthly"], ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"], ["/sitemap", "0.3", "monthly"],
];
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
const url = (loc, lastmod, cf, pr, extra = "") =>
  `  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n${extra}  </url>\n`;
for (const [loc, pr, cf] of STATIC) xml += url(loc, today, cf, pr);
for (const b of breeds) {
  xml += url(`/breeds/${b.slug}`, day(b.lastUpdated), "monthly", "0.6",
    `    <image:image>\n      <image:loc>${DOMAIN}/breeds/${b.slug}.webp</image:loc>\n      <image:title>${xmlEsc(`${b.name}, ${b.sizeCategory} ${b.breedGroup} dog breed portrait`)}</image:title>\n    </image:image>\n`);
}
for (const slug of rescuesBySlug.keys()) {
  const b = breedBySlug.get(slug);
  if (b) xml += url(`/rescue/${slug}`, day(b.lastUpdated), "monthly", "0.6");
}
for (const a of articles) xml += url(`/blog/${a.slug}`, day(a.updatedAt), "monthly", "0.7");
xml += "</urlset>\n";
writeFileSync(path.join(DIST, "sitemap.xml"), xml);
writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);

// 6. version.txt — lets you (or a deploy check) confirm which commit is live
const commit = (process.env.GITHUB_SHA || "local").slice(0, 7);
writeFileSync(path.join(DIST, "version.txt"), `${commit} ${new Date().toISOString()}\n`);

console.log(`Built ${pages.length} pages into dist/ in ${Date.now() - started}ms`);
