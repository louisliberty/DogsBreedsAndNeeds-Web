// Merge rewritten breed content into data/breeds.json.
// Usage: node tools/apply-rewrites.mjs <folder-or-file.json> [...]
// Each JSON file is { "<slug>": { field: value, ... }, ... } or a single { "slug": "...", ...fields }.
// Only the fields present are replaced. Rewritten breeds get edited: true and a fresh lastUpdated.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "data/breeds.json");
const ALLOWED = new Set([
  "history", "personalityDeepDive", "livingWith", "healthCareGuide", "trainingNotes", "dietNotes", "groomingGuide",
  "idealOwnerProfile", "notGoodFor", "commonMisconceptions", "famousQuote", "funFact", "funFacts", "faqs",
  "exerciseNeeds", "groomingFrequency", "commonHealthIssues", "temperamentSummary", "yearRecognized",
  "weightRange", "heightRange", "lifespan", "coatColors", "originCountry",
]);

const breeds = JSON.parse(readFileSync(FILE, "utf8"));
const bySlug = new Map(breeds.map((b) => [b.slug, b]));
const files = process.argv.slice(2).flatMap((p) =>
  statSync(p).isDirectory() ? readdirSync(p).filter((f) => f.endsWith(".json")).map((f) => path.join(p, f)) : [p]);
if (!files.length) { console.error("Usage: node tools/apply-rewrites.mjs <folder-or-file.json>"); process.exit(1); }

const now = new Date().toISOString().replace("T", " ").replace("Z", "").slice(0, 23);
let n = 0;
for (const f of files) {
  const json = JSON.parse(readFileSync(f, "utf8"));
  const entries = json.slug ? [[json.slug, json]] : Object.entries(json);
  for (const [slug, fields] of entries) {
    const b = bySlug.get(slug);
    if (!b) throw new Error(`${f}: unknown breed slug "${slug}"`);
    for (const [k, v] of Object.entries(fields)) {
      if (k === "slug") continue;
      if (!ALLOWED.has(k)) throw new Error(`${f}: ${slug}: field "${k}" is not editable`);
      if (k === "faqs" && !(Array.isArray(v) && v.every((q) => q.question && q.answer))) throw new Error(`${slug}: bad faqs`);
      if (k === "funFacts" && !(Array.isArray(v) && v.length >= 3)) throw new Error(`${slug}: need 3+ funFacts`);
      b[k] = v;
    }
    b.edited = true;
    b.lastUpdated = now;
    n++;
  }
}
writeFileSync(FILE, JSON.stringify(breeds, null, 1) + "\n");
console.log(`Updated ${n} breed(s). ${breeds.filter((b) => b.edited).length}/${breeds.length} rewritten in total.`);
