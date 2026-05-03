import { storage } from "./storage";
import type { Breed } from "@shared/schema";

const DOMAIN = "https://dogbreedsandneeds.com";

interface PageData {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  bodyHtml: string;
  jsonLd?: object[];
}

const staticPages: Record<string, Omit<PageData, "bodyHtml"> & { bodyHtml: string }> = {
  "/": {
    title: "Dog Breeds & Needs: Complete Guide to All 205 AKC Dog Breeds",
    description: "Explore all 205 AKC-recognized dog breeds with detailed profiles, temperament ratings, and care guides. Take our breed quiz to find your perfect match today!",
    canonical: `${DOMAIN}`,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Dog Breeds & Needs",
        url: `${DOMAIN}/`,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${DOMAIN}/breeds?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Dog Breeds & Needs",
        url: `${DOMAIN}/`,
        logo: `${DOMAIN}/favicon.svg`,
      },
    ],
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
  "/compare": {
    title: "Compare Dog Breeds Side by Side: Temperament, Size, Energy & Care | Dog Breeds & Needs",
    description: "Compare any 2 or 3 AKC dog breeds side by side. See temperament, size, energy, training, grooming, health, and exercise needs — and find the best match for your lifestyle.",
    canonical: `${DOMAIN}/compare`,
    bodyHtml: `
      <h1>Compare Dog Breeds Side by Side</h1>
      <p>Compare any two or three AKC-recognized dog breeds side by side. The breed comparison tool puts temperament, size, weight, height, lifespan, energy level, trainability, barking tendency, friendliness, grooming needs, shedding, exercise minutes per day, common health issues, and ideal-owner profiles into a single table — color-coded so you can immediately see which breed is the best fit for your lifestyle.</p>
      <h2>How to Use the Breed Comparison Tool</h2>
      <p>Pick two or three breeds using the search selectors above the comparison table. Each breed loads its complete trait profile and the table highlights which breed wins on each metric. A "Winner For You" summary calls out the best pick for kids, training, exercise, quiet households, low shedding, apartment living, and longevity.</p>
      <h2>Share Your Comparison</h2>
      <p>Every comparison generates a bookmarkable URL like <code>/compare?breeds=golden-retriever,labrador-retriever</code>. Copy the link to share an exact side-by-side breed comparison with friends, family, or your next vet visit.</p>
      <h2>Popular Breed Comparisons</h2>
      <p>Common comparisons include Golden Retriever vs Labrador Retriever, German Shepherd vs Belgian Malinois, French Bulldog vs Boston Terrier, Poodle vs Goldendoodle, and Border Collie vs Australian Shepherd. Use the selectors above to build your own comparison from any of the 205 AKC-recognized breeds.</p>
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
  "/dog-breed-selector/results": {
    title: "Your Dog Breed Quiz Results: Top 5 Personalized Matches | Dog Breeds & Needs",
    description: "See your top 5 personalized dog breed matches based on lifestyle, living situation, and preferences. Refine your answers, share results, or compare your matches.",
    canonical: `${DOMAIN}/dog-breed-selector/results`,
    bodyHtml: `
      <h1>Your Dog Breed Quiz Results</h1>
      <p>Your personalized top 5 dog breed matches are calculated from the lifestyle answers you provided in the breed selector quiz. Each match includes an explanation of which answers contributed to the recommendation, links to the full breed profile, and the option to compare your top picks side by side.</p>
      <h2>Refine Your Matches</h2>
      <p>Use the "Refine My Answers" button to revisit the quiz with your previous answers pre-filled, or click "Start Over" to reset. The "Share My Results" button copies a permanent link to this exact result set so you can revisit it later or share it with family.</p>
      <h2>Compare Your Top Matches</h2>
      <p>Click "Compare My Top Matches" to load your top three breeds into the side-by-side comparison tool, where you can see weight, height, lifespan, energy, trainability, grooming, shedding, and other traits in a single table.</p>
      <h2>Get Breed-Specific Tips by Email</h2>
      <p>Optionally enter your email to receive breed-specific tips for your top match. We never share your address and you can unsubscribe at any time.</p>
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
  "/about": {
    title: "About Dog Breeds & Needs: Our Mission, Editorial Standards & Team",
    description: "Learn about Dog Breeds & Needs — our mission, how we research breed information, our commitment to ethical sourcing, and the team behind the site.",
    canonical: `${DOMAIN}/about`,
    bodyHtml: `
      <h1>About Dog Breeds &amp; Needs</h1>
      <p>Dog Breeds &amp; Needs is the honest, in-depth resource for choosing, raising, and living with all 205 AKC-recognized dog breeds. Our mission is to help future and current dog owners make better decisions through thorough, balanced breed information that covers what's wonderful and what's hard about each breed.</p>
      <h2>How We Research Breed Information</h2>
      <p>Every breed profile starts with the official AKC standard and the relevant national breed club's published material. We then layer in peer-reviewed veterinary research on breed-specific health conditions, conversations with breed club members and breed-specific rescue volunteers, health screening guidance from the Orthopedic Foundation for Animals (OFA), and editorial review for clarity and practical usefulness. Selected breed profiles carry a Vet Reviewed badge, indicating that a licensed veterinarian has reviewed the medical and care information for accuracy.</p>
      <h2>Our Commitment to Ethical Sourcing</h2>
      <p>We give equal weight to two ethical paths: adopting from a reputable breed-specific rescue and buying from a responsible breeder. We never link to puppy mills, pet store puppies, or commercial breeders. Our breeder finder steers readers to AKC-registered breeders with verifiable health testing, and our rescue directory only lists 501(c)(3) breed-specific rescues with transparent operations.</p>
      <h2>Our Team</h2>
      <p>Our editorial team has spent more than a decade researching, writing, and reviewing breed information. Selected breed and care content is reviewed by licensed veterinarians for medical accuracy, and we work with breed club members and breed-specific rescue volunteers to capture nuance about temperament, training, and what life with each breed actually looks like.</p>
    `,
  },
  "/privacy": {
    title: "Privacy Policy | Dog Breeds & Needs",
    description: "How Dog Breeds & Needs collects, uses, and protects your information — including cookies, analytics, email signups, and your data rights.",
    canonical: `${DOMAIN}/privacy`,
    bodyHtml: `
      <h1>Privacy Policy</h1>
      <p>DogBreedsAndNeeds.com respects your privacy. This Privacy Policy explains what information we collect when you visit dogbreedsandneeds.com, how we use that information, and the choices you have.</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly (such as your email when you sign up for breed tips or quiz results) and information collected automatically (such as IP address, browser type, pages viewed, and cookies that remember your preferences and power analytics).</p>
      <h2>How We Use Information</h2>
      <p>We use information to deliver and improve site content, send breed-specific tips when you opt in, analyze how the site is used, prevent abuse, and comply with legal obligations.</p>
      <h2>Cookies, Advertising, and Affiliate Links</h2>
      <p>We use first-party cookies for essential functionality and may use third-party analytics cookies. Some pages contain affiliate links to third-party retailers; if you click an affiliate link and make a purchase we may earn a commission at no extra cost to you. We may also display advertisements served by third-party ad networks.</p>
      <h2>Your Rights and Contact</h2>
      <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or export the personal information we hold about you. Contact privacy@dogbreedsandneeds.com to exercise these rights or ask any questions.</p>
    `,
  },
  "/terms": {
    title: "Terms of Service | Dog Breeds & Needs",
    description: "The terms governing your use of dogbreedsandneeds.com — content use, disclaimers, affiliate disclosure, and limitations of liability.",
    canonical: `${DOMAIN}/terms`,
    bodyHtml: `
      <h1>Terms of Service</h1>
      <p>These Terms of Service govern your use of dogbreedsandneeds.com. By accessing or using the site you agree to these Terms. If you do not agree, please do not use the site.</p>
      <h2>Use of the Site and Intellectual Property</h2>
      <p>You may use the site for personal, non-commercial purposes. All text, images, graphics, logos, and other content on the site are owned by Dog Breeds &amp; Needs or its licensors and are protected by copyright and other intellectual property laws.</p>
      <h2>Editorial Content and Disclaimers</h2>
      <p>The site provides general information about dog breeds, training, health, nutrition, and care. The information is provided for educational purposes only and is not a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified veterinarian with any questions regarding your dog's health or behavior. Breed information reflects general tendencies; individual dogs vary.</p>
      <h2>Affiliate Disclosure and Third-Party Links</h2>
      <p>Some product links on the site are affiliate links. If you click such a link and complete a purchase, we may earn a commission at no additional cost to you. Our editorial recommendations are made independently. The site contains links to third-party websites, breeders, rescues, and products; inclusion does not constitute endorsement and you assume all risk when interacting with third-party services.</p>
      <h2>Limitation of Liability and Contact</h2>
      <p>The site is provided on an "as is" basis without warranties of any kind. To the maximum extent permitted by law, Dog Breeds &amp; Needs and its contributors will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the site. Questions? Email legal@dogbreedsandneeds.com.</p>
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
  const breedUrl = `${DOMAIN}/breeds/${breed.slug}`;

  const breadcrumb = `
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/breeds">Breeds</a></li>
        <li><a href="${DOMAIN}/breeds?group=${encodeURIComponent(breed.breedGroup)}">${e(breed.breedGroup)} Group</a></li>
        <li>${e(breed.name)}</li>
      </ol>
    </nav>
  `;

  const summary = (breed.idealOwnerProfile || breed.notGoodFor)
    ? `
    <h2>Is the ${e(breed.name)} Right for You?</h2>
    ${breed.idealOwnerProfile ? `<h3>Yes, if you are…</h3><p>${e(breed.idealOwnerProfile)}</p>` : ""}
    ${breed.notGoodFor ? `<h3>No, if you are…</h3><p>${e(breed.notGoodFor)}</p>` : ""}
    `
    : "";

  const faqHtml = (breed.faqs && breed.faqs.length > 0)
    ? `
    <h2>${e(breed.name)} Frequently Asked Questions</h2>
    <dl>
      ${breed.faqs.map((f) => `<dt>${e(f.question)}</dt><dd>${e(f.answer)}</dd>`).join("\n      ")}
    </dl>
    `
    : "";

  const facts = (breed.funFacts && breed.funFacts.length > 0)
    ? `<h2>Fun Facts about the ${e(breed.name)}</h2><ul>${breed.funFacts.map((f) => `<li>${e(f)}</li>`).join("")}</ul>`
    : "";

  const misc = breed.commonMisconceptions
    ? `<h2>Common Misconceptions about the ${e(breed.name)}</h2><p>${e(breed.commonMisconceptions)}</p>`
    : "";

  const reviewLine = breed.reviewedBy
    ? `<p><em>Reviewed by ${e(breed.reviewedBy)} · Last updated ${new Date(breed.lastUpdated).toISOString().split("T")[0]}</em></p>`
    : `<p><em>Last updated ${new Date(breed.lastUpdated).toISOString().split("T")[0]}</em></p>`;

  const imgTag = `<img src="${DOMAIN}/breeds/${e(breed.slug)}.png" alt="${e(breed.name)} — ${e(breed.sizeCategory)} ${e(breed.breedGroup)} dog breed portrait" width="1280" height="896" loading="lazy" />`;

  return `
    ${breadcrumb}
    <h1>${e(breed.name)}: Breed Info, Temperament &amp; Care Guide</h1>
    ${imgTag}
    ${reviewLine}
    <p><strong>Breed Group:</strong> ${e(breed.breedGroup)} | <strong>Size:</strong> ${e(breed.sizeCategory)} | <strong>Weight:</strong> ${e(breed.weightRange)} | <strong>Height:</strong> ${e(breed.heightRange)} | <strong>Lifespan:</strong> ${e(breed.lifespan)}</p>
    <p><strong>Origin:</strong> ${e(breed.originCountry)}${breed.yearRecognized ? ` | <strong>AKC Recognized:</strong> ${breed.yearRecognized}` : ""}</p>
    <p><strong>Coat:</strong> ${e(breed.coatType)} | <strong>Colors:</strong> ${e(breed.coatColors)} | <strong>Shedding:</strong> ${e(breed.sheddingLevel)}${breed.hypoallergenic ? " | Hypoallergenic" : ""}</p>
    <p><strong>Energy Level:</strong> ${e(breed.energyLevel)} | <strong>Trainability:</strong> ${e(breed.trainability)} | <strong>Barking:</strong> ${e(breed.barkingTendency)}</p>
    <h2>${e(breed.name)} Temperament</h2>
    <p>${e(breed.temperamentSummary)}</p>
    ${summary}
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
    ${facts}
    ${misc}
    ${faqHtml}
    <p><a href="${breedUrl}">${e(breed.name)} full breed profile</a></p>
  `;
}

function buildBreedJsonLd(breed: Breed): object[] {
  const breedUrl = `${DOMAIN}/breeds/${breed.slug}`;
  const blocks: object[] = [];

  blocks.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "Breeds", item: `${DOMAIN}/breeds` },
      { "@type": "ListItem", position: 3, name: `${breed.breedGroup} Group`, item: `${DOMAIN}/breeds?group=${encodeURIComponent(breed.breedGroup)}` },
      { "@type": "ListItem", position: 4, name: breed.name, item: breedUrl },
    ],
  });

  if (breed.faqs && breed.faqs.length > 0) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: breed.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  blocks.push({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${breed.name}: Breed Info, Temperament & Care Guide`,
    description: `Complete guide to the ${breed.name}: temperament, size, exercise needs, health, training, and care for this ${breed.breedGroup} Group breed.`,
    url: breedUrl,
    mainEntityOfPage: breedUrl,
    datePublished: new Date(breed.lastUpdated).toISOString(),
    dateModified: new Date(breed.lastUpdated).toISOString(),
    author: { "@type": "Organization", name: "Dog Breeds & Needs" },
    publisher: {
      "@type": "Organization",
      name: "Dog Breeds & Needs",
      url: DOMAIN,
    },
    about: { "@type": "Thing", name: `${breed.name} dog breed` },
  });

  return blocks;
}

export async function getPageData(url: string): Promise<PageData | null> {
  const cleanUrl = url.split("?")[0].split("#")[0];

  if (cleanUrl === "/breeds" || cleanUrl === "/breeds/") {
    try {
      const breeds = await storage.getAllBreeds();
      const top = breeds.slice().sort((a, b) => a.popularity - b.popularity).slice(0, 50);
      const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "AKC-Recognized Dog Breeds",
        numberOfItems: breeds.length,
        itemListElement: top.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${DOMAIN}/breeds/${b.slug}`,
          name: b.name,
        })),
      };
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
          { "@type": "ListItem", position: 2, name: "Breeds", item: `${DOMAIN}/breeds` },
        ],
      };
      const base = staticPages["/breeds"];
      return { ...base, jsonLd: [breadcrumb, itemList] };
    } catch {
      // fall through
    }
  }

  if (staticPages[cleanUrl]) {
    return staticPages[cleanUrl];
  }

  const cleanWithoutTrailing = cleanUrl.replace(/\/$/, "");
  if (cleanWithoutTrailing && staticPages[cleanWithoutTrailing]) {
    return staticPages[cleanWithoutTrailing];
  }

  if (cleanUrl === "/rescue" || cleanUrl === "/rescue/") {
    try {
      const slugs = await storage.getRescueBreedSlugs();
      const breeds = await storage.getAllBreeds();
      const breedBySlug = new Map(breeds.map((b) => [b.slug, b]));
      const e = escapeHtml;
      const items = slugs
        .map((s) => breedBySlug.get(s))
        .filter((b): b is typeof breeds[number] => Boolean(b))
        .sort((a, b) => a.name.localeCompare(b.name));
      const list = items
        .map((b) => `<li><a href="${DOMAIN}/rescue/${e(b.slug)}">${e(b.name)} Rescues</a> — ${e(b.breedGroup)} Group</li>`)
        .join("");
      const jsonLd: object[] = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
            { "@type": "ListItem", position: 2, name: "Rescue Directory", item: `${DOMAIN}/rescue` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Breed-Specific Rescue Directories",
          numberOfItems: items.length,
          itemListElement: items.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${DOMAIN}/rescue/${b.slug}`,
            name: `${b.name} Rescues`,
          })),
        },
      ];
      return {
        title: "Dog Breed Rescue Directory: Find Breed-Specific Rescues by Breed | Dog Breeds & Needs",
        description: `Browse rescue organizations for ${items.length}+ popular dog breeds. Adopt a Golden Retriever, Labrador, German Shepherd, Bulldog, Beagle, and more from breed-specific rescues nationwide.`,
        canonical: `${DOMAIN}/rescue`,
        bodyHtml: `
          <h1>Dog Breed Rescue Directory</h1>
          <p>Adoption is one of the most ethical ways to bring a dog into your family. Our rescue directory lists breed-specific rescue organizations for the most popular AKC breeds. Each rescue is a 501(c)(3) volunteer-run organization that takes in surrendered, abandoned, or owner-relinquished dogs and places them in carefully screened adoptive homes.</p>
          <h2>Browse Rescues by Breed</h2>
          <ul>${list}</ul>
          <h2>Why Adopt from a Breed-Specific Rescue?</h2>
          <p>Breed-specific rescues understand the temperament, exercise needs, health concerns, and grooming requirements of their breed. They evaluate dogs in foster homes, match adopters carefully, and remain a lifelong resource. Most adoptable dogs are spayed or neutered, vaccinated, microchipped, and screened for breed-specific health conditions before placement.</p>
        `,
        jsonLd,
      };
    } catch {
      // fall through to static body
    }
  }

  const rescueMatch = cleanUrl.match(/^\/rescue\/([a-z0-9-]+)$/);
  if (rescueMatch) {
    const slug = rescueMatch[1];
    try {
      const breed = await storage.getBreedBySlug(slug);
      const rescues = await storage.getRescuesByBreedSlug(slug);
      if (breed && rescues.length > 0) {
        const e = escapeHtml;
        const orgList = rescues
          .map((r) => {
            const link = r.url ? `<a href="${e(r.url)}" rel="nofollow">${e(r.name)}</a>` : e(r.name);
            const contact = [r.email ? `email: ${e(r.email)}` : null, r.phone ? `phone: ${e(r.phone)}` : null]
              .filter(Boolean)
              .join(" · ");
            return `<li>${link} (${e(r.region)})${r.description ? ` — ${e(r.description)}` : ""}${contact ? ` <em>${contact}</em>` : ""}</li>`;
          })
          .join("");
        const rescueJsonLd: object[] = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
              { "@type": "ListItem", position: 2, name: "Rescue Directory", item: `${DOMAIN}/rescue` },
              { "@type": "ListItem", position: 3, name: `${breed.name} Rescue`, item: `${DOMAIN}/rescue/${slug}` },
            ],
          },
          ...rescues
            .filter((r) => Boolean(r.url))
            .map((r) => ({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": r.url,
              name: r.name,
              url: r.url,
              areaServed: r.region,
              ...(r.email ? { email: r.email } : {}),
              ...(r.phone ? { telephone: r.phone } : {}),
              ...(r.description ? { description: r.description } : {}),
            })),
        ];
        return {
          title: `${breed.name} Rescue Organizations: Adopt a ${breed.name} Near You | Dog Breeds & Needs`,
          description: `Directory of ${rescues.length} ${breed.name} rescue organizations across the United States. Find a ${breed.name} to adopt — contact info, regions served, and websites for each rescue.`,
          canonical: `${DOMAIN}/rescue/${slug}`,
          ogType: "article",
          jsonLd: rescueJsonLd,
          bodyHtml: `
            <nav aria-label="Breadcrumb">
              <ol>
                <li><a href="${DOMAIN}/">Home</a></li>
                <li><a href="${DOMAIN}/rescue">Rescue Directory</a></li>
                <li>${e(breed.name)} Rescue</li>
              </ol>
            </nav>
            <h1>${e(breed.name)} Rescue Organizations</h1>
            <p>This directory lists ${rescues.length} ${e(breed.name)} rescue organizations across the United States. Each rescue places ${e(breed.name)} dogs in adoptive homes and is staffed primarily by volunteer fosters who understand the breed's specific needs.</p>
            <h2>${e(breed.name)} Rescues</h2>
            <ul>${orgList}</ul>
            <h2>Why Adopt a ${e(breed.name)}?</h2>
            <p>${e(breed.temperamentSummary)}</p>
            <p><a href="${DOMAIN}/breeds/${e(slug)}">Read the full ${e(breed.name)} breed profile</a> to learn about temperament, exercise needs, grooming, training, and health before adopting.</p>
          `,
        };
      }
    } catch {
      // fall through
    }
  }

  if (cleanUrl === "/blog" || cleanUrl === "/blog/") {
    try {
      const articles = await storage.getPublishedArticles();
      const e = escapeHtml;
      const list = articles
        .map(
          (a) =>
            `<li><a href="${DOMAIN}/blog/${e(a.slug)}">${e(a.title)}</a> — ${e(a.category)}<br><span>${e(a.metaDescription)}</span></li>`,
        )
        .join("");
      const blogJsonLd: object[] = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${DOMAIN}/blog` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Dog Breeds & Needs Blog",
          url: `${DOMAIN}/blog`,
          blogPost: articles.slice(0, 25).map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: `${DOMAIN}/blog/${a.slug}`,
            description: a.metaDescription,
            datePublished: a.publishedAt ? new Date(a.publishedAt).toISOString() : undefined,
            dateModified: a.updatedAt ? new Date(a.updatedAt).toISOString() : undefined,
          })),
        },
      ];
      return {
        title: "Dog Care Blog: Breed Guides, Adoption & Lifestyle Articles | Dog Breeds & Needs",
        description: "In-depth dog care articles: best apartment dogs, hypoallergenic breeds, first-time owner guides, ethical adoption, and more — written for real dog owners.",
        canonical: `${DOMAIN}/blog`,
        jsonLd: blogJsonLd,
        bodyHtml: `
          <h1>Dog Care Blog</h1>
          <p>Breed guides, lifestyle tips, adoption advice, and honest answers to the questions every dog owner asks. Browse our latest articles below.</p>
          <h2>Latest Articles</h2>
          <ul>${list}</ul>
        `,
      };
    } catch {
      // fall through
    }
  }

  const blogMatch = cleanUrl.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    try {
      const article = await storage.getArticleBySlug(slug);
      if (article && article.publishedAt) {
        const e = escapeHtml;
        const articleUrl = `${DOMAIN}/blog/${slug}`;
        const published = new Date(article.publishedAt).toISOString();
        const updated = new Date(article.updatedAt).toISOString();
        const body = `
          <nav aria-label="Breadcrumb">
            <ol>
              <li><a href="${DOMAIN}/">Home</a></li>
              <li><a href="${DOMAIN}/blog">Blog</a></li>
              <li>${e(article.title)}</li>
            </ol>
          </nav>
          <h1>${e(article.title)}</h1>
          <p><em>By ${e(article.author)} · ${published.split("T")[0]} · ${e(article.category)}</em></p>
          <p>${e(article.metaDescription)}</p>
          ${renderMarkdownToHtml(article.content)}
          <p><a href="${DOMAIN}/blog">Back to all articles</a></p>
        `;
        const jsonLd: object[] = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${DOMAIN}/blog` },
              { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.metaDescription,
            url: articleUrl,
            mainEntityOfPage: articleUrl,
            datePublished: published,
            dateModified: updated,
            author: { "@type": "Person", name: article.author },
            publisher: {
              "@type": "Organization",
              name: "Dog Breeds & Needs",
              url: DOMAIN,
            },
            articleSection: article.category,
            keywords: article.tags.join(", "),
            ...(article.featuredImage ? { image: article.featuredImage } : {}),
          },
        ];
        return {
          title: `${article.title} | Dog Breeds & Needs`,
          description: article.metaDescription,
          canonical: articleUrl,
          ogType: "article",
          bodyHtml: body,
          jsonLd,
        };
      }
    } catch {
      // fall through
    }
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
          jsonLd: buildBreedJsonLd(breed),
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

  const headTagParts = [
    `<link rel="canonical" href="${escapeHtml(data.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(data.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(data.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(data.canonical)}" />`,
    `<meta property="og:type" content="${data.ogType || "website"}" />`,
    `<meta property="og:site_name" content="Dog Breeds &amp; Needs" />`,
  ];

  if (data.jsonLd && data.jsonLd.length > 0) {
    for (const block of data.jsonLd) {
      const json = JSON.stringify(block).replace(/</g, "\\u003c");
      headTagParts.push(`<script type="application/ld+json">${json}</script>`);
    }
  }

  html = html.replace("</head>", `    ${headTagParts.join("\n    ")}\n  </head>`);

  // Inject content in a noscript tag so crawlers (which don't run JS) see real content.
  // Browsers with JS enabled never render noscript content, so users are unaffected.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div><noscript>${data.bodyHtml}</noscript>`
  );

  return html;
}

function renderMarkdownToHtml(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let para: string[] = [];
  const inline = (s: string): string => {
    let v = escapeHtml(s);
    v = v.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
      const safe = /^(https?:|mailto:|\/|#)/i.test(url.trim()) ? url.trim() : "#";
      return `<a href="${escapeHtml(safe)}">${label}</a>`;
    });
    v = v.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    v = v.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return v;
  };
  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; }
  };
  const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushPara(); closeList(); continue; }
    if (line.startsWith("### ")) { flushPara(); closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { flushPara(); closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^- /.test(line)) {
      flushPara();
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else { closeList(); para.push(line); }
  }
  flushPara();
  closeList();
  return out.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
