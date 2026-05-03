# DogBreedsAndNeeds.com

## Overview
A fully functional dog breed directory website featuring all 205 AKC-recognized breeds, a dog breed quiz, ethical sourcing guide, product recommendations, admin panel for breed management, and a sitemap page. Domain: dogbreedsandneeds.com

## Architecture
- **Frontend**: React + Vite + TypeScript with wouter routing and TanStack Query
- **Backend**: Express.js with PostgreSQL via Drizzle ORM
- **UI**: Shadcn/ui components with Tailwind CSS
- **Database**: PostgreSQL with `breeds` (205 records) and `products` (20 records) tables

## Key Files
- `shared/schema.ts` - Database schema (breeds, products tables) and Zod validation schemas
- `server/routes.ts` - API endpoints (breeds CRUD, products, admin auth, robots.txt, sitemap.xml)
- `server/storage.ts` - DatabaseStorage class implementing IStorage interface
- `server/seo.ts` - Server-side meta tag injection (title, description, canonical, Open Graph) for all pages
- `server/vite.ts` - Dev server with SEO meta injection before serving HTML
- `server/static.ts` - Production static file server with SEO meta injection
- `server/seed.ts` - Database seeding orchestrator
- `server/breedData.ts` - 205 AKC breed records with compact format and expand helper
- `server/productData.ts` - 20 product records across 5 categories
- `client/src/App.tsx` - Route configuration with Layout wrapper
- `client/src/components/Layout.tsx` - Header/footer with navigation and theme toggle
- `client/src/lib/breedImages.ts` - Breed image loader using Vite import.meta.glob
- `attached_assets/breeds/*.png` - 205 AI-generated breed portrait images (4:3 aspect ratio)

## Pages
- `/` - Home page with hero, breed groups, popular breeds, features
- `/breeds` - Full breed directory with search and filters (group, size, energy)
- `/breeds/:slug` - Breed detail page with all traits, ratings, history, and product recommendations
- `/dog-breed-selector` - 7-question breed matching quiz with scored results
- `/ethical-sourcing` - Guide on responsible breeders, adoption, and red flags
- `/find-a-breeder` - Ethical breeder finder with AKC Marketplace links, breed-specific health tests, red flags checklist, breeder visit checklist, and adoption resources
- `/poodle-rescue` - Directory of 24 national Poodle rescue organizations with contact info, emails, and websites
- `/products` - Product recommendations with category filtering
- `/sitemap` - Complete sitemap with all breeds organized by group
- `/admin` - Password-protected admin panel for breed CRUD management

## Auth
- Admin panel uses Bearer token auth with ADMIN_PASSWORD env secret
- Login validates password, stores token client-side for subsequent API calls

## Design
- Primary color: warm orange (hsl 25 85% 45%)
- Font: Open Sans
- Supports dark/light mode via ThemeProvider
- Responsive design with mobile navigation menu

## API Routes
- `GET /api/breeds` - List all breeds (supports ?search, ?group, ?limit query params)
- `GET /api/breeds/count` - Get total breed count
- `GET /api/breeds/:slug` - Get breed by slug
- `GET /api/products` - List products (supports ?category, ?sizes)
- `GET /api/products/:id` - Get product by ID
- `POST /api/admin/login` - Admin login
- `POST /api/admin/breeds` - Create breed (auth required)
- `PUT /api/admin/breeds/:id` - Update breed (auth required)
- `DELETE /api/admin/breeds/:id` - Delete breed (auth required)

## Edge Caching for Breed Lists
The `/api/breeds*` list endpoints use a versioned-URL strategy so shared/CDN caches can hold responses essentially forever while admin edits invalidate immediately.

**Version source of truth:** A `breedListVersion` token is persisted in the `meta` table (`server/storage.ts`) so all server instances agree. `getBreedListVersion()` and `bumpBreedListVersion()` live in `server/seo.ts`, with a 5-second in-process memoization layer to avoid a DB roundtrip on every request. `bumpBreedListVersion()` writes a fresh token (timestamp + random hex) to the `meta` row.

**Write path:** Every admin breed mutation (POST/PUT/DELETE `/api/admin/breeds*` in `server/routes.ts`) awaits `bumpBreedListVersion()`, returns the new value in the `X-Breeds-Version` response header, and also calls `clearSeoCache()` / clears `sitemapCache`.

**Read path:** `GET /api/breeds` and `GET /api/breeds/count` consult `getBreedListVersion()` (memoized 5s); `GET /api/breeds/version` consults it with `{ fresh: true }` to bypass the memo.
- If the request URL includes `?v=<token>` matching the current version, the response sets `Cache-Control: public, max-age=86400, s-maxage=31536000, immutable` — safe because the URL itself changes when the version changes.
- If `v` is missing or stale, the response sets `Cache-Control: public, max-age=0, s-maxage=10, stale-while-revalidate=60, must-revalidate`, so any shared cache revalidates within ~10s.
- `GET /api/breeds/version` is the authoritative invalidation channel and is therefore strongly fresh: `Cache-Control: no-store, Pragma: no-cache`. No CDN or browser ever caches it.
- All breed-list responses also send `ETag: W/"breeds-<version>-<sha1(queryKey).slice(0,16)>"` (queryKey is hashed so user-controlled `search` text can't malform the header), `X-Breeds-Version`, and `Surrogate-Key: breeds`. Conditional requests with `If-None-Match` are answered with `304 Not Modified`. CDNs with cache-tag/surrogate-key purge (Fastly, Cloudflare Enterprise) can purge the `breeds` tag for instant invalidation.

**Client integration:** SSR (`server/vite.ts`, `server/static.ts`) injects `<script>window.__BREEDS_V__="..."</script>` into every HTML response. `client/src/lib/queryClient.ts` exposes `getBreedsVersion()`, `setBreedsVersion()`, `markBreedsVersionVerified()`, `refreshBreedsVersion({ force? })`, and the async helper `withVerifiedBreedsVersion(url)`.

**Freshness guarantee — per-fetch TTL revalidation:** The default TanStack Query fetcher pipes every `/api/breeds*` URL (other than `/api/breeds/version`) through `withVerifiedBreedsVersion`, which calls `refreshBreedsVersion()` before each fetch. `refreshBreedsVersion` is a no-op if a successful verification happened within the last 10 seconds (the `BREEDS_VERIFICATION_TTL_MS` constant, matched to the unversioned response's `s-maxage`); otherwise it round-trips `/api/breeds/version` (which is `no-store`, so always authoritative). When the returned token differs from the local one, it updates `window.__BREEDS_V__` and invalidates all `/api/breeds*` queries so observers refetch with the new token. This means even a long-open SPA can never stamp a stale token onto an immutable URL more than 10s after an admin edit — the worst-case staleness window is bounded by the TTL. `SearchAutocomplete` uses the same async helper for its custom fetch. `BreedsVersionSync` (mounted in `App.tsx`) additionally forces a refresh on mount, on `focus`, and on `visibilitychange` to `visible`.

**Failure fallback:** If `/api/breeds/version` errors transiently, `refreshBreedsVersion` returns without advancing the verification timestamp (so the next call retries) and without throwing. `withVerifiedBreedsVersion` then detects no successful verification has ever occurred and falls back to the unversioned URL — short-cached and `must-revalidate`, never the immutable long-cached one — so breed-list queries never hang and never serve stale immutable data even when version discovery is broken.

**Admin updates:** After admin mutations succeed, `client/src/pages/Admin.tsx` reads `X-Breeds-Version` from the response, updates `window.__BREEDS_V__`, and calls `markBreedsVersionVerified()` so the admin's own subsequent reads immediately use the new versioned URL.
