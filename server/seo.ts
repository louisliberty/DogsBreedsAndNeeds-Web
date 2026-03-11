import { storage } from "./storage";

const DOMAIN = "https://dogbreedsandneeds.com";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

const staticPageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Dog Breeds & Needs: Complete Guide to All 205 AKC Dog Breeds",
    description: "Explore all 205 AKC-recognized dog breeds with detailed profiles, temperament ratings, and care guides. Take our breed quiz to find your perfect match today!",
    canonical: `${DOMAIN}`,
    ogType: "website",
  },
  "/breeds": {
    title: "All 205 AKC Dog Breeds: Browse, Search & Compare | Dog Breeds & Needs",
    description: "Browse the complete list of 205 AKC-recognized dog breeds. Filter by size, energy level, and breed group to compare traits and find your ideal companion.",
    canonical: `${DOMAIN}/breeds`,
  },
  "/dog-breed-selector": {
    title: "Dog Breed Selector Quiz: Find Your Perfect Breed | Dog Breeds & Needs",
    description: "Not sure which dog breed is right for you? Take our free 7-question breed selector quiz and get personalized matches based on your lifestyle. Start now!",
    canonical: `${DOMAIN}/dog-breed-selector`,
  },
  "/ethical-sourcing": {
    title: "Ethical Dog Sourcing Guide: Find Responsible Breeders & Rescues | Dog Breeds & Needs",
    description: "Learn how to find a reputable breeder, adopt from a rescue, and avoid puppy mills. Our ethical sourcing guide helps you bring home a healthy, happy dog.",
    canonical: `${DOMAIN}/ethical-sourcing`,
  },
  "/find-a-breeder": {
    title: "Find an Ethical Dog Breeder: AKC Breeder Directory & Guide | Dog Breeds & Needs",
    description: "Find a responsible, AKC-registered dog breeder near you. Search by breed, learn what health tests to look for, and use our red flags checklist to avoid puppy mills.",
    canonical: `${DOMAIN}/find-a-breeder`,
  },
  "/poodle-rescue": {
    title: "Poodle Rescue Organizations: Find a Poodle to Adopt Near You | Dog Breeds & Needs",
    description: "Directory of national Poodle rescue organizations across the United States. Find a Poodle rescue near you with contact information, email addresses, and websites.",
    canonical: `${DOMAIN}/poodle-rescue`,
  },
  "/products": {
    title: "Best Dog Products: Food, Toys, Grooming & Health Picks | Dog Breeds & Needs",
    description: "Discover top-rated dog products handpicked for quality and value. Browse food, toys, grooming tools, training aids, and health essentials for every breed.",
    canonical: `${DOMAIN}/products`,
  },
  "/sitemap": {
    title: "Sitemap: All Dog Breeds & Pages | Dog Breeds & Needs",
    description: "View the complete sitemap for Dog Breeds & Needs. Browse all 205 AKC breed pages organized by group, plus guides, products, and tools.",
    canonical: `${DOMAIN}/sitemap`,
  },
};

export async function getPageMeta(url: string): Promise<PageMeta | null> {
  const cleanUrl = url.split("?")[0].split("#")[0];

  if (staticPageMeta[cleanUrl]) {
    return staticPageMeta[cleanUrl];
  }

  const breedMatch = cleanUrl.match(/^\/breeds\/([a-z0-9-]+)$/);
  if (breedMatch) {
    const slug = breedMatch[1];
    try {
      const breed = await storage.getBreedBySlug(slug);
      if (breed) {
        return {
          title: `${breed.name}: Breed Info, Temperament & Care Guide | Dog Breeds & Needs`,
          description: `Learn everything about the ${breed.name}: temperament, size, exercise needs, health tips, and more. See if this ${breed.breedGroup} breed is right for you!`,
          canonical: `${DOMAIN}/breeds/${slug}`,
          ogType: "article",
        };
      }
    } catch {
      // fall through to null
    }
  }

  return null;
}

export function injectMeta(html: string, meta: PageMeta): string {
  const defaultTitle = "Dog Breeds & Needs - Your Complete Guide to 205 AKC Dog Breeds";
  const defaultDesc = "Explore all 205 AKC-recognized dog breeds. Find your perfect companion with our breed quiz, ethical sourcing guide, and product recommendations.";

  html = html.replace(
    `<title>${defaultTitle}</title>`,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  html = html.replace(
    `<meta name="description" content="${defaultDesc}" />`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  const ogTags = [
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:type" content="${meta.ogType || "website"}" />`,
    `<meta property="og:site_name" content="Dog Breeds & Needs" />`,
  ].join("\n    ");

  html = html.replace("</head>", `    ${ogTags}\n  </head>`);

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
