# DogBreedsAndNeeds.com

A static website: every page is a plain HTML file, built by a small Node script with no dependencies.
No server, no database, no framework. It runs on any web host, including HostGator shared hosting.

## Folder layout

| Folder | What's in it |
|---|---|
| `data/` | All site content as JSON: `breeds.json` (205 breeds), `articles.json` (blog), `products.json`, `rescues.json`. Edit these to change the site. |
| `public/` | Files copied to the site as-is: breed photos (`breeds/`), card thumbnails (`breeds/thumbs/`), product images, favicon, `.htaccess`. |
| `src/` | The build script (`build.mjs`), page templates (`pages/`), shared helpers (`lib/`), and the one stylesheet plus small scripts (`assets/`). |
| `tools/` | `serve.mjs` (local preview), `check.mjs` (link/SEO checks), `images.py` (regenerates thumbnails). |
| `dist/` | The built website. Not committed; created by the build. |

## Build and preview

Needs Node.js 18 or newer. Nothing to install.

```
node src/build.mjs      # writes the whole site to dist/
node tools/check.mjs    # checks every link, image, title, canonical and the sitemap
node tools/serve.mjs    # preview at http://localhost:4321
```

## Publish to HostGator

1. Run `node src/build.mjs`.
2. In HostGator cPanel, open **File Manager** and go to the domain's folder (usually `public_html`).
3. Upload everything **inside** `dist/`, including the hidden `.htaccess` file. (In File Manager, turn on *Settings → Show Hidden Files*.)

The `.htaccess` file gives clean URLs (`/breeds/beagle` instead of `/breeds/beagle.html`), forces HTTPS without `www`,
redirects old Replit-era URLs, and sets caching and compression.

## Common edits

- **Fix or update a breed:** edit its entry in `data/breeds.json`, rebuild, upload.
- **Add a blog post:** add an object to `data/articles.json` (`slug`, `title`, `metaDescription`, `content` in simple markdown,
  `publishedAt`, `updatedAt`, `author`, `category`, `tags`), rebuild, upload. It appears on `/blog`, the sitemap, and the sitemap page automatically.
- **Replace a breed photo:** put the new `<slug>.webp` in `public/breeds/`, run `python3 tools/images.py` to refresh its thumbnail, rebuild.
- **Change styles:** `src/assets/site.css`. File names get a content hash on every build, so visitors always get the new version.

## What the pages are

- `/`, `/breeds`, `/breeds/<slug>` (205), `/compare`, `/dog-breed-selector` (+ `/results`), `/find-a-breeder`,
  `/ethical-sourcing`, `/rescue`, `/rescue/<slug>` (21), `/blog`, `/blog/<slug>` (10), `/products`, `/products/how-we-choose`,
  `/about`, `/privacy`, `/terms`, `/sitemap`, plus `sitemap.xml`, `robots.txt` and `404.html`.
- All content is in the HTML for search engines. JavaScript only powers search, filters, the quiz and the comparison table;
  those pages load their breed data from `/data/*.json` on demand.
