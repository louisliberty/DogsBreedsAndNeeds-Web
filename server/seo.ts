import { storage } from "./storage";
import type { Breed } from "@shared/schema";

const DOMAIN = "https://dogbreedsandneeds.com";

interface PageData {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  bodyHtml: string;
}

const staticPages: Record<string, Omit<PageData, "bodyHtml"> & { bodyHtml: string }> = {
  "/": {
    title: "Dog Breeds & Needs: Complete Guide to All 205 AKC Dog Breeds",
    description: "Explore all 205 AKC-recognized dog breeds with detailed profiles, temperament ratings, and care guides. Take our breed quiz to find your perfect match today!",
    canonical: `${DOMAIN}`,
    ogType: "website",
    bodyHtml: `
      <h1>Dog Breeds &amp; Needs: Your Complete Guide to All 205 AKC Dog Breeds</h1>
      <p>Welcome to DogBreedsAndNeeds.com — the most comprehensive guide to all 205 AKC-recognized dog breeds. Whether you're looking for a family companion, an active sporting dog, or a loyal working breed, our in-depth profiles cover temperament, size, exercise needs, grooming, health, and care for every breed recognized by the American Kennel Club.</p>
      <h2>Explore All Dog Breeds</h2>
      <p>Browse detailed profiles for all 205 AKC-recognized breeds across seven breed groups: Sporting, Hound, Working, Terrier, Toy, Non-Sporting, and Herding. Each breed profile includes temperament ratings, size and weight ranges, lifespan, energy level, trainability, shedding level, and breed history.</p>
      <h2>Find Your Perfect Dog Breed</h2>
      <p>Not sure which breed is right for you? Take our free dog breed selector quiz — answer 7 questions about your lifestyle, living situation, and activity level to get personalized breed matches.</p>
      <h2>Ethical Dog Sourcing</h2>
      <p>Learn how to find a responsible breeder, recognize red flags, and make an ethical choice when adding a dog to your family. Our ethical sourcing guide and breeder finder help you connect with AKC-registered breeders who prioritize health and temperament.</p>
    `,
  },
  "/breeds": {
    title: "All 205 AKC Dog Breeds: Browse, Search & Compare | Dog Breeds & Needs",
    description: "Browse the complete list of 205 AKC-recognized dog breeds. Filter by size, energy level, and breed group to compare traits and find your ideal companion.",
    canonical: `${DOMAIN}/breeds`,
    bodyHtml: `
      <h1>All 205 AKC-Recognized Dog Breeds</h1>
      <p>Browse the complete directory of all 205 breeds recognized by the American Kennel Club. Use our filters to search by breed group, size category, or energy level. Each breed profile includes detailed information on temperament, care requirements, health, and history.</p>
      <h2>Dog Breed Groups</h2>
      <p>AKC dog breeds are organized into seven groups: the Sporting Group (active dogs bred for hunting), the Hound Group (scent and sight hunters), the Working Group (large dogs bred for guarding and pulling), the Terrier Group (feisty, energetic diggers), the Toy Group (small companion breeds), the Non-Sporting Group (diverse breeds with varied roles), and the Herding Group (intelligent dogs bred to manage livestock).</p>
    `,
  },
  "/dog-breed-selector": {
    title: "Dog Breed Selector Quiz: Find Your Perfect Breed | Dog Breeds & Needs",
    description: "Not sure which dog breed is right for you? Take our free 7-question breed selector quiz and get personalized matches based on your lifestyle. Start now!",
    canonical: `${DOMAIN}/dog-breed-selector`,
    bodyHtml: `
      <h1>Dog Breed Selector Quiz: Find Your Perfect Breed</h1>
      <p>Answer 7 questions about your lifestyle, living situation, activity level, and preferences to get personalized dog breed recommendations. Our breed selector considers energy level, size, grooming needs, trainability, and compatibility with children and other pets to help you find the ideal companion.</p>
      <h2>How the Breed Selector Works</h2>
      <p>The quiz evaluates your answers across multiple dimensions and matches them to breed profiles from all 205 AKC-recognized breeds. You'll receive a ranked list of breeds best suited to your lifestyle, with links to full breed profiles and care guides.</p>
    `,
  },
  "/ethical-sourcing": {
    title: "Ethical Dog Sourcing Guide: Find Responsible Breeders & Rescues | Dog Breeds & Needs",
    description: "Learn how to find a reputable breeder, adopt from a rescue, and avoid puppy mills. Our ethical sourcing guide helps you bring home a healthy, happy dog.",
    canonical: `${DOMAIN}/ethical-sourcing`,
    bodyHtml: `
      <h1>Ethical Dog Sourcing Guide</h1>
      <p>Responsible dog breeding is built around care, health, and long-term breed preservation. Ethical breeders focus on improving and protecting a specific breed rather than producing large numbers of puppies for sale. They perform extensive health testing, carefully select breeding pairs, and raise puppies in environments that support proper socialization and development.</p>
      <h2>What Makes a Responsible Breeder?</h2>
      <p>A responsible breeder health-tests all breeding dogs for breed-specific genetic conditions, welcomes visits to their facility, provides health guarantees and veterinary records, carefully screens potential owners, limits the number of litters per year, and takes back dogs at any point in their life if needed. They are typically registered with breed-specific clubs or national kennel clubs.</p>
      <h2>Red Flags to Watch For</h2>
      <p>Avoid breeders who always have puppies available, won't let you visit the premises or meet the parents, ship puppies without meeting the buyer, have no health testing documentation, use pressure tactics, or sell puppies at pet stores or through unscreened online marketplaces.</p>
      <h2>Adoption: A Wonderful Option</h2>
      <p>Adopting from a shelter or rescue organization is a deeply rewarding choice. Millions of dogs need homes each year, and many purebred and mixed-breed dogs are available through breed-specific rescues, local animal shelters, and platforms like Petfinder.com and Adopt-a-Pet.com.</p>
      <h2>Questions to Ask a Breeder</h2>
      <p>Before committing to a breeder, ask about health tests for the parents, whether you can meet the puppy's mother and father, how many litters each female has per year, the socialization program for puppies, what the health guarantee covers, and whether they will take the dog back if you can no longer keep it.</p>
    `,
  },
  "/find-a-breeder": {
    title: "Find an Ethical Dog Breeder: AKC Breeder Directory & Guide | Dog Breeds & Needs",
    description: "Find a responsible, AKC-registered dog breeder near you. Search by breed, learn what health tests to look for, and use our red flags checklist to avoid puppy mills.",
    canonical: `${DOMAIN}/find-a-breeder`,
    bodyHtml: `
      <h1>Find an Ethical Dog Breeder</h1>
      <p>Search for AKC-registered, responsible breeders for your chosen breed. Unlike many industries, the responsible breeding world is intentionally decentralized — most ethical breeders participate in small, reputation-based communities centered around individual breeds. National and regional breed clubs establish breeding guidelines, health testing standards, and temperament expectations.</p>
      <h2>Breed-Specific Health Certifications</h2>
      <p>Every breed has different genetic risks. Responsible breeders perform breed-specific health tests before breeding. Common certifications include OFA hip and elbow evaluations, CAER eye exams, cardiac evaluations, and DNA tests for inherited conditions. The specific tests required vary by breed.</p>
      <h2>Signs of a Responsible Breeder</h2>
      <p>Ethical breeders typically produce only a few litters each year, maintain waiting lists, carefully screen potential owners, and are active members of breed clubs and breeder networks. Their reputation within these communities is one of the most important accountability systems in the dog world.</p>
      <h2>How to Avoid Puppy Mills</h2>
      <p>Puppy mills prioritize volume over animal welfare, producing large numbers of puppies with little regard for health or socialization. Red flags include always having puppies available, multiple breeds for sale, no health documentation, refusal to allow facility visits, and listings on anonymous online marketplaces.</p>
    `,
  },
  "/poodle-rescue": {
    title: "Poodle Rescue Organizations: Find a Poodle to Adopt Near You | Dog Breeds & Needs",
    description: "Directory of national Poodle rescue organizations across the United States. Find a Poodle rescue near you with contact information, email addresses, and websites.",
    canonical: `${DOMAIN}/poodle-rescue`,
    bodyHtml: `
      <h1>Poodle Rescue Organizations</h1>
      <p>This directory lists national Poodle rescue organizations across the United States. Whether you are looking to adopt a Standard Poodle, Miniature Poodle, or Toy Poodle, these organizations work to rehome Poodles in need of loving families. Each listing includes contact information, email addresses, and website links.</p>
      <h2>About Poodle Rescue</h2>
      <p>Poodle rescue organizations take in surrendered, abandoned, and owner-relinquished Poodles and place them in foster homes while they await adoption. Rescue dogs are typically evaluated for health and temperament, spayed or neutered, vaccinated, and microchipped before adoption.</p>
      <h2>Why Adopt a Poodle?</h2>
      <p>Poodles are highly intelligent, hypoallergenic, and come in three size varieties — Standard, Miniature, and Toy. They are known for their trainability, gentle temperament, and minimal shedding, making them excellent companions for families, singles, and seniors alike.</p>
    `,
  },
  "/products": {
    title: "Best Dog Products: Food, Toys, Grooming & Health Picks | Dog Breeds & Needs",
    description: "Discover top-rated dog products handpicked for quality and value. Browse food, toys, grooming tools, training aids, and health essentials for every breed.",
    canonical: `${DOMAIN}/products`,
    bodyHtml: `
      <h1>Best Dog Products: Food, Toys, Grooming &amp; Health Picks</h1>
      <p>Discover top-rated dog products handpicked for quality, safety, and value. Our product recommendations cover every category a dog owner needs — from nutritious food and interactive toys to grooming tools, training aids, and health essentials — with options suitable for every breed size.</p>
      <h2>Dog Product Categories</h2>
      <p>Browse dog food recommendations for every size and life stage, interactive toys for mental stimulation, grooming tools matched to coat type, training aids for puppies and adult dogs, and health supplements and essentials for long-term wellbeing.</p>
    `,
  },
  "/sitemap": {
    title: "Sitemap: All Dog Breeds & Pages | Dog Breeds & Needs",
    description: "View the complete sitemap for Dog Breeds & Needs. Browse all 205 AKC breed pages organized by group, plus guides, products, and tools.",
    canonical: `${DOMAIN}/sitemap`,
    bodyHtml: `
      <h1>Sitemap: Dog Breeds &amp; Needs</h1>
      <p>Browse the complete sitemap for DogBreedsAndNeeds.com. This page lists all 205 AKC-recognized dog breed profiles organized by breed group, plus our guides, tools, and resource pages.</p>
    `,
  },
};

function buildBreedBodyHtml(breed: Breed): string {
  const e = escapeHtml;
  return `
    <h1>${e(breed.name)}: Breed Info, Temperament &amp; Care Guide</h1>
    <p><strong>Breed Group:</strong> ${e(breed.breedGroup)} | <strong>Size:</strong> ${e(breed.sizeCategory)} | <strong>Weight:</strong> ${e(breed.weightRange)} | <strong>Height:</strong> ${e(breed.heightRange)} | <strong>Lifespan:</strong> ${e(breed.lifespan)}</p>
    <p><strong>Origin:</strong> ${e(breed.originCountry)}${breed.yearRecognized ? ` | <strong>AKC Recognized:</strong> ${breed.yearRecognized}` : ""}</p>
    <p><strong>Coat:</strong> ${e(breed.coatType)} | <strong>Colors:</strong> ${e(breed.coatColors)} | <strong>Shedding:</strong> ${e(breed.sheddingLevel)}${breed.hypoallergenic ? " | Hypoallergenic" : ""}</p>
    <p><strong>Energy Level:</strong> ${e(breed.energyLevel)} | <strong>Trainability:</strong> ${e(breed.trainability)} | <strong>Barking:</strong> ${e(breed.barkingTendency)}</p>
    <h2>${e(breed.name)} Temperament</h2>
    <p>${e(breed.temperamentSummary)}</p>
    <h2>${e(breed.name)} Personality</h2>
    <p>${e(breed.personalityDeepDive)}</p>
    <h2>History of the ${e(breed.name)}</h2>
    <p>${e(breed.history)}</p>
    <h2>Living with a ${e(breed.name)}</h2>
    <p>${e(breed.livingWith)}</p>
    <h2>Exercise &amp; Grooming</h2>
    <p><strong>Exercise needs:</strong> ${e(breed.exerciseNeeds)}</p>
    <p><strong>Grooming:</strong> ${e(breed.groomingFrequency)}</p>
    ${breed.groomingGuide ? `<p>${e(breed.groomingGuide)}</p>` : ""}
    <h2>${e(breed.name)} Health</h2>
    <p>${e(breed.healthCareGuide)}</p>
    <p><strong>Common health issues:</strong> ${e(breed.commonHealthIssues)}</p>
    <h2>Training the ${e(breed.name)}</h2>
    <p>${e(breed.trainingNotes)}</p>
    <h2>Diet &amp; Nutrition</h2>
    <p>${e(breed.dietNotes)}</p>
    ${breed.funFact ? `<p><strong>Fun fact:</strong> ${e(breed.funFact)}</p>` : ""}
  `;
}

export async function getPageData(url: string): Promise<PageData | null> {
  const cleanUrl = url.split("?")[0].split("#")[0];

  if (staticPages[cleanUrl]) {
    return staticPages[cleanUrl];
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
          bodyHtml: buildBreedBodyHtml(breed),
        };
      }
    } catch {
      // fall through to null
    }
  }

  return null;
}

export function injectPageData(html: string, data: PageData): string {
  const defaultTitle = "Dog Breeds & Needs - Your Complete Guide to 205 AKC Dog Breeds";
  const defaultDesc = "Explore all 205 AKC-recognized dog breeds. Find your perfect companion with our breed quiz, ethical sourcing guide, and product recommendations.";

  html = html.replace(
    `<title>${defaultTitle}</title>`,
    `<title>${escapeHtml(data.title)}</title>`
  );

  html = html.replace(
    `<meta name="description" content="${defaultDesc}" />`,
    `<meta name="description" content="${escapeHtml(data.description)}" />`
  );

  const headTags = [
    `<link rel="canonical" href="${escapeHtml(data.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(data.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(data.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(data.canonical)}" />`,
    `<meta property="og:type" content="${data.ogType || "website"}" />`,
    `<meta property="og:site_name" content="Dog Breeds &amp; Needs" />`,
  ].join("\n    ");

  html = html.replace("</head>", `    ${headTags}\n  </head>`);

  // Inject content in a noscript tag so crawlers (which don't run JS) see real content.
  // Browsers with JS enabled never render noscript content, so users are unaffected.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div><noscript>${data.bodyHtml}</noscript>`
  );

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
