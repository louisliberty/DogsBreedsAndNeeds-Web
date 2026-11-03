// Sanity checks on dist/ after a build: every internal link and image resolves, every page has
// one <h1>, a unique title/description and a canonical URL, JSON-LD parses, and the sitemap
// lists exactly the indexable pages.   Usage: node tools/check.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const DOMAIN = "https://dogbreedsandneeds.com";
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)]));
const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html"));
const urlFor = (f) => { const r = path.relative(DIST, f).replace(/\.html$/, ""); return r === "index" ? "/" : "/" + r; };
const resolves = (p) => {
  if (p === "/") return true;
  const f = path.join(DIST, p);
  return (existsSync(f) && statSync(f).isFile()) || existsSync(f + ".html");
};

const problems = [];
const titles = new Map(), descs = new Map();
const indexable = new Set();
let links = 0;

for (const file of htmlFiles) {
  const url = urlFor(file);
  const html = readFileSync(file, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const noindex = html.includes('content="noindex');
  if (!title) problems.push(`${url}: no <title>`);
  if (!desc) problems.push(`${url}: no meta description`);
  if (h1s !== 1) problems.push(`${url}: ${h1s} <h1> elements`);
  if (!noindex) {
    indexable.add(url);
    const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const expect = url === "/" ? DOMAIN : DOMAIN + url;
    if (canon !== expect) problems.push(`${url}: canonical ${canon} != ${expect}`);
    if (titles.has(title)) problems.push(`${url}: duplicate title with ${titles.get(title)}`);
    if (descs.has(desc)) problems.push(`${url}: duplicate description with ${descs.get(desc)}`);
    titles.set(title, url); descs.set(desc, url);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${url}: invalid JSON-LD`); }
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    links++;
    if (!resolves(decodeURIComponent(m[1]))) problems.push(`${url}: broken link ${m[1]}`);
  }
  for (const m of html.matchAll(/srcset="([^"]*)"/g)) {
    for (const part of m[1].split(",")) {
      const src = part.trim().split(/\s+/)[0];
      if (src.startsWith("/") && !resolves(src)) problems.push(`${url}: broken srcset ${src}`);
    }
  }
}

const sitemap = readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const inSitemap = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(DOMAIN, "") || "/"));
for (const u of indexable) if (!inSitemap.has(u) && u !== "/404") problems.push(`sitemap missing ${u}`);
for (const u of inSitemap) if (!resolves(u.replace(/^\/breeds\/(.*)\.webp$/, "/breeds/$1.webp"))) problems.push(`sitemap has dead URL ${u}`);
for (const m of sitemap.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)) if (!resolves(m[1].replace(DOMAIN, ""))) problems.push(`sitemap image missing ${m[1]}`);

console.log(`${htmlFiles.length} pages, ${indexable.size} indexable, ${inSitemap.size} sitemap URLs, ${links} internal links checked`);
if (problems.length) { console.log(problems.slice(0, 60).join("\n")); console.log(`${problems.length} problem(s)`); process.exit(1); }
console.log("All checks passed");
