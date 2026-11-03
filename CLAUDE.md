# DogBreedsAndNeeds.com

Static site generator with zero npm dependencies. Output is plain HTML for HostGator (Apache) shared hosting.

- Build: `node src/build.mjs` → `dist/`. Check: `node tools/check.mjs` (must pass before publishing). Preview: `node tools/serve.mjs`.
- Content lives in `data/*.json`. Pages are functions in `src/pages/*.mjs` returning `{ path, title, description, body, jsonLd?, scripts? }`;
  `src/lib/layout.mjs` wraps them. Templating is the `h` tagged template in `src/lib/html.mjs`, which escapes interpolations; use `raw()` only for trusted HTML.
- Icons: add paths to `src/lib/icons.mjs`; each page gets an inline sprite of only the icons it uses.
- Client JS in `src/assets/*.js` is plain ES5-ish browser code, no bundler, loaded with `defer` only on pages that list it in `scripts`.
- URLs must stay stable (they are indexed): `/breeds/<slug>`, `/rescue/<slug>`, `/blog/<slug>`, no trailing slash. A page at `/x/y` is written to `dist/x/y.html`;
  `.htaccess` maps clean URLs to those files. Add a 301 in `public/.htaccess` (and `tools/serve.mjs`) if a URL ever changes.
- Keep pages crawlable: real content must be in the HTML, never rendered only by JavaScript.
- Breed images: full size `public/breeds/<slug>.webp` (1280×896), thumbnails `public/breeds/thumbs/<slug>.webp` (480×336) from `tools/images.py`.
