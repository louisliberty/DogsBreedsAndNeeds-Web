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
