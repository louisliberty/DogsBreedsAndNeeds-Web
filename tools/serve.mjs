// Preview dist/ locally the same way the .htaccess serves it on HostGator.
// Usage: node tools/serve.mjs   then open http://localhost:4321
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain",
};
const isFile = (p) => stat(p).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let p = decodeURIComponent(url.pathname);
  if (p.length > 1 && p.endsWith("/")) { res.writeHead(301, { Location: p.slice(0, -1) + url.search }); return res.end(); }
  const redirects = { "/poodle-rescue": "/rescue/poodle", "/quiz": "/dog-breed-selector" };
  if (redirects[p]) { res.writeHead(301, { Location: redirects[p] }); return res.end(); }
  const base = path.join(DIST, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
  const candidates = p === "/" ? [path.join(DIST, "index.html")] : [base, base + ".html"];
  for (const f of candidates) {
    if (await isFile(f)) {
      res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
      return res.end(await readFile(f));
    }
  }
  res.writeHead(404, { "Content-Type": TYPES[".html"] });
  res.end(await readFile(path.join(DIST, "404.html")));
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
