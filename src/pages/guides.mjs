import { h, raw } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { pageHero, checkList } from "../lib/components.mjs";
import { rescuesBySlug } from "../lib/data.mjs";

const section = (iconName, title, content, cls = "") =>
  h`<section class="card card-pad ${cls}"><h2 class="card-title">${iconName ? icon(iconName, "ic text-primary") : ""}${title}</h2>${content}</section>`;

export function ethicalSourcing() {
  const body = h`
<div class="wrap-md page">
  ${pageHero("heart", "Ethical Dog Sourcing Guide")}
  <div class="prose muted mb-8 mx-auto">
    <p>Responsible dog breeding is built around care, health, and long-term breed preservation. Ethical breeders focus on improving and protecting a specific breed rather than producing large numbers of puppies for sale. They perform extensive health testing, carefully select breeding pairs, and raise puppies in environments that support proper socialization and development. Choosing a responsible breeder helps ensure your dog has the best possible start in life while also supporting practices that protect canine health, temperament, and genetic diversity. It also reduces the demand for puppy mills and large commercial breeding operations that prioritize volume over animal welfare.</p>
    <p>Unlike many other industries, the responsible breeding world is intentionally decentralized. Most ethical breeders participate in small, reputation-based communities centered around individual breeds. National and regional breed clubs establish breeding guidelines, health testing standards, and temperament expectations, while breeders collaborate through shows, working trials, and shared pedigrees. Because every breed has different genetic risks, such as hip dysplasia, cardiac conditions, or inherited eye diseases, standards and testing requirements vary from breed to breed. This is why research often starts with the breed itself before narrowing down to trusted breeders.</p>
    <p>The decentralized structure also reflects how ethical breeders operate: small-scale, relationship-driven programs rather than high-volume businesses. Responsible breeders typically produce only a few litters each year, maintain waiting lists, and carefully screen potential owners to ensure puppies go to the right homes. Their reputation within breed clubs and breeder networks is one of the most important accountability systems in the dog world. By starting your search with reputable breeders connected to these communities, you greatly increase the chances of finding a healthy, well-raised puppy from someone who is committed to the long-term wellbeing of the breed.</p>
  </div>
  <div class="stack-lg">
    ${section("shield", "What Makes a Responsible Breeder?", checkList([
      "Health tests all breeding dogs for breed-specific genetic conditions",
      "Welcomes visits to their facility and introduces you to the puppy's parents",
      "Provides a health guarantee and veterinary records",
      "Asks you questions about your lifestyle and experience to ensure a good match",
      "Limits the number of litters per year and per female",
      "Socializes puppies from birth with people and various environments",
      "Takes back dogs at any point in their life if needed",
      "Is registered with breed-specific clubs or national kennel clubs",
    ]))}
    <section class="card card-pad card-danger"><h2 class="card-title text-bad">${icon("alert")} Red Flags to Watch For</h2>${checkList([
      "Always has puppies available or breeds multiple different breeds",
      "Won't let you visit the premises or meet the parents",
      "Ships puppies without meeting the buyer first",
      "No health testing documentation or veterinary references",
      "Puppies are available at unusually low or suspiciously high prices",
      "Uses pressure tactics or rushes you into a purchase",
      "No contract or take-back policy",
      "Sells puppies at pet stores or through online marketplaces without screening",
    ], "bad")}</section>
    ${section("home", "Adoption: A Wonderful Option", h`
      <p class="small mb-4">Adopting from a shelter or rescue organization is a deeply rewarding choice. Millions of dogs need homes each year, and many purebred and mixed-breed dogs are available through breed-specific rescues.</p>
      <div class="grid cols-2 small">
        <div class="tile"><h3 class="strong mb-2">Benefits of Adoption</h3>${checkList(["Save a life and open a shelter space", "Dogs are often already spayed/neutered and vaccinated", "Adult dogs have known temperaments", "Lower cost than purchasing from a breeder"])}</div>
        <div class="tile"><h3 class="strong mb-2">Where to Adopt</h3><ul class="icon-list">
          <li>${icon("search", "ic text-primary")}<span>Local animal shelters and humane societies</span></li>
          <li>${icon("search", "ic text-primary")}<span><a href="/rescue">Breed-specific rescue organizations</a></span></li>
          <li>${icon("search", "ic text-primary")}<span><a href="https://www.petfinder.com" target="_blank" rel="noopener">Petfinder.com</a> and <a href="https://www.adoptapet.com" target="_blank" rel="noopener">Adopt-a-Pet.com</a></span></li>
          <li>${icon("search", "ic text-primary")}<span><a href="https://www.akc.org/dog-breeds/rescue-network/" target="_blank" rel="noopener">AKC Rescue Network</a></span></li>
        </ul></div>
      </div>`)}
    ${section("search", "Questions to Ask a Breeder", h`<ol class="num-grid small">${[
      "What health tests have the parents undergone?",
      "Can I meet the puppy's mother and father?",
      "How many litters does each female have per year?",
      "What is your socialization program for puppies?",
      "Do you provide a health guarantee? What does it cover?",
      "Will you take the dog back if I can no longer keep it?",
      "What breed-specific health issues should I be aware of?",
      "Can you provide references from previous puppy buyers?",
      "Are you affiliated with any breed clubs or kennel clubs?",
      "At what age do you release puppies to their new homes?",
    ].map((q) => h`<li>${q}</li>`)}</ol>`)}
    ${section(null, "Before You Bring a Dog Home", h`<p class="small mb-3">Getting a dog is a 10-15+ year commitment. Before making this decision, consider:</p><ul class="bullets small muted">
      <li>Can you afford veterinary care, food, grooming, and supplies for the lifetime of the dog?</li>
      <li>Do you have enough time for exercise, training, and socialization?</li>
      <li>Is your living situation suitable and stable for a dog?</li>
      <li>Are all household members on board with getting a dog?</li>
      <li>Do you have a plan for the dog during vacations and emergencies?</li>
      <li>Have you researched breed-specific needs and potential health issues?</li>
    </ul>`)}
    <section class="card card-pad card-primary center">
      ${icon("heart", "ic ic-hero")}
      <h2 class="h2">Ready to Find Your Dog Responsibly?</h2>
      <p class="muted small mb-6 mx-auto max-xl">Whether you choose a responsible breeder or a breed-specific rescue, both are ethical paths to bringing home a happy, healthy dog.</p>
      <div class="btn-row center">
        <a href="/find-a-breeder" class="btn btn-primary">${icon("search")} Find a Responsible Breeder</a>
        <a href="/rescue" class="btn btn-outline">${icon("home")} Adopt From a Rescue</a>
      </div>
    </section>
  </div>
</div>`;
  return {
    path: "/ethical-sourcing",
    title: "Ethical Dog Sourcing Guide: Find Responsible Breeders & Rescues | Dog Breeds & Needs",
    description: "Learn how to find a reputable breeder, adopt from a rescue, and avoid puppy mills. Our ethical sourcing guide helps you bring home a healthy, happy dog.",
    body,
  };
}

export const HEALTH_TESTS = {
  "German Shepherd Dog": ["OFA Hip & Elbow Dysplasia", "Degenerative Myelopathy DNA Test", "Cardiac Exam"],
  "Golden Retriever": ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "NCL DNA Test"],
  "Labrador Retriever": ["OFA Hip & Elbow Dysplasia", "Ophthalmologist Evaluation", "EIC DNA Test", "D Locus DNA Test"],
  "French Bulldog": ["OFA Hip Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "Patellar Luxation"],
  Bulldog: ["Cardiac Exam", "Patellar Luxation", "Tracheal Hypoplasia Radiograph"],
  Poodle: ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "PRA DNA Test", "Cardiac Exam"],
  Beagle: ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "MLS DNA Test", "Cardiac Exam"],
  Rottweiler: ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "JLPP DNA Test"],
  Boxer: ["OFA Hip Dysplasia", "Cardiac Exam (Holter Monitor)", "Thyroid Evaluation", "ARVC DNA Test"],
  "Cavalier King Charles Spaniel": ["Cardiac Exam (Annual)", "Ophthalmologist Evaluation", "Patellar Luxation", "OFA Hip Dysplasia"],
  "Siberian Husky": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation"],
  "Doberman Pinscher": ["Cardiac Exam (Holter Monitor)", "OFA Hip Dysplasia", "Ophthalmologist Evaluation", "vWD DNA Test", "Thyroid Evaluation"],
  "Great Dane": ["OFA Hip Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "Thyroid Evaluation"],
  "Bernese Mountain Dog": ["OFA Hip & Elbow Dysplasia", "Cardiac Exam", "Ophthalmologist Evaluation", "vWD DNA Test"],
  "Australian Shepherd": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "MDR1 DNA Test", "Elbow Dysplasia"],
  "Cocker Spaniel": ["OFA Hip Dysplasia", "Ophthalmologist Evaluation", "PRA DNA Test"],
  Dachshund: ["Patellar Luxation", "Ophthalmologist Evaluation", "Cardiac Exam"],
  "Shih Tzu": ["Ophthalmologist Evaluation", "Patellar Luxation", "OFA Hip Dysplasia"],
  "Yorkshire Terrier": ["Patellar Luxation", "Ophthalmologist Evaluation", "Liver Shunt Screening"],
  Chihuahua: ["Patellar Luxation", "Cardiac Exam", "Ophthalmologist Evaluation"],
};

export function findABreeder() {
  const questions = [
    ["What health tests have the parents had?", "Responsible breeders test for breed-specific genetic conditions. Ask for OFA, CERF, or PennHIP documentation, not just a vet checkup."],
    ["Can I visit and meet the mother (and ideally the father)?", "Seeing the parents tells you about temperament and living conditions. A refusal is a major red flag."],
    ["How many litters does each female have per year?", "Ethical breeders typically breed a female no more than once per year, with lifetime limits. Over-breeding is harmful."],
    ["What is your puppy socialization program?", "Puppies need early exposure to different people, sounds, and environments. Good breeders start this from birth."],
    ["Do you provide a health guarantee and contract?", "A written contract should cover genetic health guarantees, spay/neuter requirements, and a take-back clause."],
    ["Will you take the dog back at any point in its life?", "Responsible breeders feel lifetime responsibility for every puppy they produce."],
    ["Can you provide references from previous buyers and your veterinarian?", "Happy puppy owners and a long-term vet relationship are strong indicators of a quality breeder."],
    ["Are you affiliated with any breed clubs?", "Membership in national or regional breed clubs shows commitment to breed standards and community."],
    ["At what age do you release puppies?", "Puppies should not leave their mother before 8 weeks. Many good breeders wait until 10-12 weeks."],
    ["Why did you choose this particular breeding pair?", "A thoughtful answer about complementary traits, health, and temperament shows a breeder who plans carefully."],
  ];
  const finderData = { tests: HEALTH_TESTS, rescues: [...rescuesBySlug.keys()] };

  const body = h`
<div class="wrap-md page">
  ${pageHero("shield", "Find an Ethical Dog Breeder", "Search by breed to find ethical breeders, view breed-specific health certifications, and connect with rescue organizations.")}

  <section class="card card-pad card-primary mb-6 cta-row">
    ${icon("heart", "ic ic-hero")}
    <div class="grow"><h2 class="h4">Considering adoption first?</h2><p class="muted small">Browse breed-specific rescue organizations across the U.S. Adoption is one of the most ethical ways to bring a dog into your family.</p></div>
    <a href="/rescue" class="btn btn-primary">${icon("heart")} Browse Rescue Directory</a>
  </section>

  <section class="card card-pad card-primary mb-8" data-finder>
    <h2 class="card-title">${icon("search", "ic text-primary")} Search for a Breeder by Breed</h2>
    <p class="muted small mb-4">Type the breed you're interested in to see its recommended health tests, the AKC Marketplace listing, and rescue options.</p>
    <div class="input-icon mb-4">${icon("search", "ic search-ic")}<input type="search" class="input" placeholder="Type a breed name (e.g., Golden Retriever, German Shepherd)..." aria-label="Breed name" autocomplete="off" data-finder-input></div>
    <div class="grid cols-2 tight" data-finder-results></div>
    <div data-finder-detail hidden></div>
    <script type="application/json" data-finder-data>${raw(JSON.stringify(finderData).replace(/</g, "\\u003c"))}</script>
  </section>

  <div class="stack-lg">
    ${section("award", "What AKC Registration Actually Means", h`
      <p class="small mb-4">AKC (American Kennel Club) registration means a dog's parents are both registered as purebred dogs of the same breed. While it's an important baseline, it's crucial to understand what it does and doesn't guarantee:</p>
      <div class="grid cols-2 small mb-4">
        <div class="tile"><h3 class="strong mb-2 row-start">${icon("checkCircle", "ic text-good")} What It Means</h3><ul class="bullets muted"><li>Both parents are registered purebreds of the same breed</li><li>The breeder maintains pedigree records</li><li>The litter is documented with the AKC</li><li>AKC Marketplace breeders agree to AKC rules and inspections</li></ul></div>
        <div class="tile"><h3 class="strong mb-2 row-start">${icon("alert", "ic text-warn")} What It Doesn't Guarantee</h3><ul class="bullets muted"><li>It does not certify health testing was done</li><li>It does not guarantee the puppy is healthy</li><li>It does not confirm the breeder is ethical</li><li>Registration alone is not enough, always verify health certifications independently</li></ul></div>
      </div>
      <p class="muted small"><strong>Bottom line:</strong> AKC registration is a starting point, not an endpoint. Always verify health testing, visit the breeder in person, and ask the tough questions outlined below.</p>`)}
    ${section("message", "Questions to Ask a Breeder Before Buying", h`<ol class="qa-list">${questions.map(([q, why]) => h`<li class="tile"><p class="strong small mb-1">${q}</p><p class="muted xsmall row-start">${icon("help", "ic ic-xs")}<span><strong>Why it matters:</strong> ${why}</span></p></li>`)}</ol>`)}
    ${section("health", "Health Certifications to Look For by Breed", h`
      <p class="muted small mb-4">Every breed has specific genetic health concerns. Responsible breeders test their dogs before breeding. Here are the recommended health screenings for popular breeds:</p>
      <div class="stack-sm">${Object.entries(HEALTH_TESTS).map(([breed, tests]) => h`<div class="tile"><h3 class="strong small mb-2">${breed}</h3><div class="badges">${tests.map((t) => h`<span class="badge">${t}</span>`)}</div></div>`)}</div>
      <p class="muted small mt-4">For breeds not listed above, visit the <a href="https://www.ofa.org/recommended-tests" target="_blank" rel="noopener">Orthopedic Foundation for Animals (OFA)</a> for a complete list of recommended tests by breed.</p>`)}
    ${section("shield", "Signs of a Responsible Breeder", checkList([
      "Health tests all breeding dogs for breed-specific genetic conditions and provides documentation",
      "Welcomes visits to their facility and introduces you to the puppy's parents and living environment",
      "Provides a written health guarantee, contract, and veterinary records",
      "Asks you detailed questions about your lifestyle, experience, and home to ensure a good match",
      "Limits the number of litters per year and per female, prioritizing the mother's health",
      "Socializes puppies from birth with people, sounds, textures, and various environments",
      "Commits to taking back any dog they've bred at any point in its life",
      "Is actively involved in breed clubs, dog shows, or working/performance events",
      "Can explain why they chose this specific breeding pair and what they hoped to achieve",
      "Does not always have puppies available, waitlists are normal for quality breeders",
    ]))}
    <section class="card card-pad card-danger"><h2 class="card-title text-bad">${icon("alert")} Red Flags Checklist: How to Spot a Puppy Mill or Backyard Breeder</h2>
      <p class="muted small mb-4">If you notice any of these warning signs, walk away. Purchasing from irresponsible sources fuels the cycle of puppy mills and contributes to animal suffering.</p>
      ${checkList([
        "Always has puppies available or breeds many different breeds at once",
        "Won't let you visit the premises or see where the dogs live",
        "Ships puppies sight-unseen without meeting the buyer first",
        "No health testing documentation, only claims the vet said the dogs are 'healthy'",
        "Puppies available at unusually low prices or with aggressive 'limited time' discounts",
        "Uses pressure tactics, urgency, or emotional manipulation to rush your decision",
        "No written contract, health guarantee, or take-back policy",
        "Sells through pet stores, roadside, or third-party online marketplaces",
        "Cannot or will not provide references from past buyers",
        "Puppies appear sickly, fearful, or poorly socialized",
        "Breeding dogs appear to be in poor condition or are kept in cages full-time",
        "Has no involvement in breed clubs, shows, or any breed-related community",
      ], "bad")}</section>
    ${section("alert", "Why Pet Stores and Puppy Mills Are Harmful", h`
      <p class="small mb-4">Despite their clean storefronts, the vast majority of pet store puppies come from commercial breeding operations, commonly known as puppy mills. Here's why this matters:</p>
      <div class="stack-sm small">${[
        ["Breeding Dogs Suffer", "Puppy mill breeding dogs live in cramped cages, are bred every heat cycle, and receive minimal veterinary care. Many never walk on grass or experience normal life."],
        ["Health Problems Are Common", "Without genetic testing, puppies from mills are far more likely to develop serious hereditary conditions, costing owners thousands in veterinary bills."],
        ["Behavioral Issues", "Puppies removed too early from their mothers and raised without proper socialization are more likely to develop anxiety, fearfulness, and aggression."],
        ["The Cycle Continues", "Every puppy purchased from a pet store or mill funds the operation and creates demand for more breeding. The only way to end puppy mills is to stop buying from them."],
      ].map(([t, d]) => h`<div class="tile"><h3 class="strong mb-1">${t}</h3><p class="muted">${d}</p></div>`)}</div>`)}
    ${section("eye", "Breeder Visit Checklist", h`
      <p class="muted small mb-4">When you visit a breeder in person, use this checklist to evaluate their operation:</p>
      <ul class="grid cols-2 tight small plain">${[
        "Facility is clean, well-maintained, and doesn't smell of ammonia",
        "Dogs have adequate space, clean water, and appear healthy and well-fed",
        "Puppies are kept in a home environment, not in outdoor kennels or barns",
        "The mother is present, calm, and comfortable around the breeder",
        "Puppies are curious, playful, and approach people willingly",
        "Health testing documentation is readily available for both parents",
        "The breeder can discuss the breed's history, temperament, and needs knowledgeably",
        "The breeder asks YOU as many questions as you ask them",
        "There's a written contract ready for review before any deposit is taken",
        "The breeder doesn't pressure you to take a puppy home that same day",
      ].map((t) => h`<li class="tile row-start">${icon("clipboard", "ic text-primary")}<span>${t}</span></li>`)}</ul>`)}
    ${section("heart", "Consider Adoption: A Wonderful Alternative", h`
      <p class="small mb-4">If you're flexible on breed or age, adopting from a rescue or shelter is one of the most rewarding ways to find a dog. Many purebred and mixed-breed dogs need loving homes.</p>
      <div class="grid cols-2 small">
        <div class="tile"><h3 class="strong mb-2">Where to Adopt</h3><ul class="icon-list">
          <li>${icon("external", "ic text-primary")}<a href="https://www.petfinder.com" target="_blank" rel="noopener">Petfinder.com</a></li>
          <li>${icon("external", "ic text-primary")}<a href="https://www.adoptapet.com" target="_blank" rel="noopener">Adopt-a-Pet.com</a></li>
          <li>${icon("external", "ic text-primary")}<a href="https://www.akc.org/dog-breeds/rescue-network/" target="_blank" rel="noopener">AKC Rescue Network</a></li>
          <li>${icon("heart", "ic text-primary")}<a href="/rescue">Our breed rescue directory</a></li>
        </ul></div>
        <div class="tile"><h3 class="strong mb-2">Benefits of Adoption</h3>${checkList(["Save a life and open a shelter space for another dog", "Dogs are typically already spayed/neutered and vaccinated", "Adult dogs have known temperaments and are often house-trained", "Adoption fees are significantly lower than breeder prices"])}</div>
      </div>`)}
    <section class="card card-pad card-primary center">
      ${icon("book", "ic ic-hero")}
      <h2 class="h3">Want More Guidance?</h2>
      <p class="muted small mb-4 mx-auto max-xl">Read our complete ethical sourcing guide for additional information on responsible dog ownership, or take our breed quiz to find the right breed for your lifestyle.</p>
      <div class="btn-row center"><a href="/ethical-sourcing" class="btn btn-outline">${icon("book")} Ethical Sourcing Guide</a><a href="/dog-breed-selector" class="btn btn-primary">${icon("paw")} Take the Breed Quiz</a></div>
    </section>
  </div>
</div>`;
  return {
    path: "/find-a-breeder",
    title: "Find an Ethical Dog Breeder: AKC Breeder Directory & Guide | Dog Breeds & Needs",
    description: "Find a responsible, AKC-registered dog breeder near you. Search by breed, learn what health tests to look for, and use our red flags checklist to avoid puppy mills.",
    scripts: ["finder"],
    body,
  };
}

export function about() {
  const team = [
    ["Dog Breeds & Needs Editorial Team", "Lead Editors", "10+ years writing about dogs", "Our editorial team has spent more than a decade researching, writing, and reviewing breed information for owners, breeders, and rescues across the United States."],
    ["Veterinary Review Panel", "Health & Care Reviewers", "DVM-credentialed reviewers", "Selected breed and care content is reviewed by licensed veterinarians for medical accuracy."],
    ["Breed Specialists & Rescuers", "Contributors", "Breed club members and rescue volunteers", "We work with breed club members and breed-specific rescue volunteers across the country to capture nuance about temperament, training, and what life with each breed actually looks like."],
  ];
  const body = h`
<div class="wrap-md page">
  <h1 class="page-title mb-4">About Dog Breeds &amp; Needs</h1>
  <p class="lead mb-8">The honest, in-depth resource for choosing, raising, and living with all 205 AKC-recognized dog breeds.</p>
  <div class="stack-lg prose-cards">
    ${section("heart", "Our Mission", h`<p>Dog Breeds &amp; Needs exists to help future and current dog owners make better decisions. Choosing a breed is one of the most consequential decisions in a person's life, the wrong fit creates years of stress for both human and dog, while the right fit shapes a decade or more of partnership.</p><p>We believe every breed deserves an honest, complete profile that covers what's wonderful and what's hard. We do not write puff pieces. We do not hide the difficult traits. We treat readers as adults who can weigh tradeoffs.</p>`)}
    ${section("book", "How We Research Breed Information", h`<p>Every breed profile starts with the official AKC standard and the relevant national breed club's published material. We then layer in:</p><ul class="bullets"><li>Peer-reviewed veterinary research on breed-specific health conditions</li><li>Conversations with breed club members, working breeders, and breed-specific rescue volunteers</li><li>Health screening guidance from the Orthopedic Foundation for Animals (OFA) and breed parent clubs</li><li>Editorial review for clarity, accuracy, and practical usefulness for everyday owners</li></ul><p>Every breed profile shows when it was last updated.</p>`)}
    ${section("shieldCheck", "Our Commitment to Ethical Sourcing", h`<p>We are committed to promoting responsible dog acquisition. That means giving equal weight to two ethical paths: adopting from a reputable rescue and buying from a responsible breeder.</p><p>We never link to puppy mills, pet store puppies, or commercial breeders. Our breeder finder steers readers to AKC-registered breeders with verifiable health testing. Our rescue directory only lists 501(c)(3) breed-specific rescues with transparent operations.</p><p>We do not accept payment from breeders or rescues for placement on the site. Affiliate links, when present, are clearly disclosed and never influence which breeders or rescues we recommend.</p>`)}
    ${section("users", "Our Team", h`<div class="team">${team.map(([name, role, cred, bio]) => h`<div class="team-member"><span class="avatar">${icon("users", "ic")}</span><div><h3 class="h4">${name}</h3><div class="row-start mb-2"><span class="badge badge-secondary">${role}</span><span class="muted xsmall">${cred}</span></div><p class="muted small">${bio}</p></div></div>`)}</div>`)}
  </div>
  <p class="muted small center mt-8">Have a question, correction, or want to contribute? Reach us at <a href="mailto:editorial@dogbreedsandneeds.com">editorial@dogbreedsandneeds.com</a>.</p>
</div>`;
  return {
    path: "/about",
    title: "About Dog Breeds & Needs: Our Mission, Editorial Standards & Team",
    description: "Learn about Dog Breeds & Needs, our mission, how we research breed information, our commitment to ethical sourcing, and the team behind the site.",
    body,
  };
}

export function howWeChoose() {
  const inC = [
    "Verifiable ingredient or material transparency (we can read the label and find the source)",
    "Made in countries with strong manufacturing oversight (USA, Canada, EU, UK, Australia, NZ)",
    "Third-party certifications where they exist: USDA Organic, Non-GMO, B-Corp, Certified Humane, NASC",
    "Brands that publish testing data, recall history, or supply-chain information",
    "Durable goods designed to last years, not seasons",
    "Established brand with a track record (no flash-in-the-pan dropshippers)",
  ];
  const outC = [
    'Mystery proteins or vague labels like "meat meal" or "animal by-product"',
    "Toys with unknown plastics, undisclosed coatings, or no safety certifications",
    "Brands that won't disclose where their products are manufactured",
    "Products with active recalls or unresolved safety complaints",
    "Anything we wouldn't use with our own dogs",
  ];
  const body = h`
<div class="wrap-sm page">
  <a href="/products" class="btn btn-ghost btn-sm back-link">${icon("arrowLeft")} Back to products</a>
  ${icon("shieldCheck", "ic ic-hero")}
  <h1 class="page-title mb-3">How We Choose Products</h1>
  <p class="lead mb-8">We only recommend products we'd put in our own dogs' bowls, mouths, and beds. Here's exactly what that means.</p>
  <div class="stack">
    <section class="card card-pad prose-cards"><h2 class="h3">Affiliate disclosure</h2><p class="muted small">Some links on our product pages are affiliate links, which means we may earn a commission if you buy something, at no extra cost to you. Affiliate revenue helps us keep this site running and keeps our breed content free.</p><p class="muted small"><strong class="fg">Affiliate status never determines what gets listed.</strong> Editorial decisions are made first; affiliate links (where they exist) are added after. If we can't find an affiliate program for a product we love, we still recommend it and link straight to the brand.</p></section>
    <div class="grid cols-2">
      <section class="card card-pad"><h2 class="card-title">${icon("checkCircle", "ic text-primary")} What gets in</h2>${checkList(inC)}</section>
      <section class="card card-pad"><h2 class="card-title">${icon("xCircle", "ic text-bad")} What gets cut</h2>${checkList(outC, "bad")}</section>
    </div>
    <section class="card card-pad"><h2 class="h3">Editor's Picks</h2><p class="muted small">An <strong class="fg">Editor's Pick</strong> is a product our team has personally used or rigorously vetted, and would recommend without hesitation. Picks are reviewed at least once a year, if a brand changes formulas, materials, or manufacturing, the pick can be removed.</p></section>
    <section class="card card-pad"><h2 class="h3">A note on diet &amp; health</h2><p class="muted small">Recommendations on this site are educational, not veterinary advice. Always check with your vet before changing your dog's diet or starting a supplement, especially for puppies, seniors, or dogs with existing health conditions.</p></section>
  </div>
  <p class="muted xsmall center mt-8">Last reviewed May 2026.</p>
</div>`;
  return {
    path: "/products/how-we-choose",
    title: "How We Choose Dog Products | Dog Breeds & Needs",
    description: "Our criteria for recommending dog products: ingredient transparency, materials, manufacturing standards, and how we handle affiliate links and editorial independence.",
    body,
  };
}

function legalPage(path, title, description, heading, html) {
  return { path, title, description, body: h`<div class="wrap-sm page"><article class="prose"><h1>${heading}</h1><p class="muted small">Last updated: May 1, 2026</p>${html}</article></div>` };
}

export function privacy() {
  return legalPage("/privacy", "Privacy Policy | Dog Breeds & Needs",
    "How Dog Breeds & Needs collects, uses, and protects your information, including cookies, analytics, email signups, and your data rights.",
    "Privacy Policy", h`
<p>DogBreedsAndNeeds.com ("we," "us," or "our") respects your privacy. This Privacy Policy explains what information we collect when you visit dogbreedsandneeds.com, how we use that information, and the choices you have.</p>
<h2>Information We Collect</h2>
<p>We collect two categories of information:</p>
<ul>
<li><strong>Information you provide.</strong> When you sign up for breed-specific tips or contact us, you may share your email address. Your breed selector quiz answers stay in your own browser and are not sent to us.</li>
<li><strong>Information collected automatically.</strong> When you visit the site our hosting provider automatically records standard log data including IP address, browser type, device type, pages viewed, referring URL, and timestamps. We use your browser's local storage to remember your preferences (e.g. light/dark theme) and may use analytics to understand site traffic.</li>
</ul>
<h2>How We Use Information</h2>
<ul>
<li>To deliver and improve site content and functionality.</li>
<li>To send you breed-specific tips when you opt in (you can unsubscribe anytime).</li>
<li>To analyze how the site is used so we can improve it.</li>
<li>To detect, prevent, and respond to abuse, fraud, or technical issues.</li>
<li>To comply with legal obligations.</li>
</ul>
<h2>Cookies &amp; Tracking</h2>
<p>We use your browser's storage for essential site functionality (e.g. remembering your theme preference) and may use third-party analytics cookies (such as Google Analytics) to understand aggregate site traffic. You can disable cookies in your browser settings; some site features may not work as expected without them.</p>
<h2>Advertising &amp; Affiliate Links</h2>
<p>Some pages contain affiliate links to third-party retailers. If you click an affiliate link and make a purchase, we may earn a commission at no extra cost to you. We may also display advertisements served by third-party ad networks; those networks may use cookies to deliver relevant ads.</p>
<h2>Email Subscriptions</h2>
<p>If you provide your email to receive breed tips, we will only use it to send you the content you requested and occasional related updates. Every email contains an unsubscribe link. We do not sell, rent, or share your email with third parties for their marketing.</p>
<h2>Data Sharing</h2>
<p>We do not sell personal information. We may share information with service providers (such as hosting, analytics, and email-delivery vendors) who process it on our behalf under contractual obligations of confidentiality, and with authorities when required by law.</p>
<h2>Children's Privacy</h2>
<p>The site is not directed to children under 13 and we do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, please contact us so we can delete it.</p>
<h2>Your Rights</h2>
<p>Depending on your jurisdiction, you may have the right to access, correct, delete, or export the personal information we hold about you, and to object to or restrict certain processing. To exercise any of these rights, email us at the address below.</p>
<h2>Data Security &amp; Retention</h2>
<p>We use reasonable technical and organizational safeguards to protect personal information. We retain personal information only as long as needed for the purposes described above or as required by law.</p>
<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects when changes were made. Material changes will be highlighted on the site.</p>
<h2>Contact Us</h2>
<p>Questions about this policy? Email <a href="mailto:privacy@dogbreedsandneeds.com">privacy@dogbreedsandneeds.com</a>.</p>`);
}

export function terms() {
  return legalPage("/terms", "Terms of Service | Dog Breeds & Needs",
    "The terms governing your use of dogbreedsandneeds.com, content use, disclaimers, affiliate disclosure, and limitations of liability.",
    "Terms of Service", h`
<p>These Terms of Service ("Terms") govern your use of dogbreedsandneeds.com (the "Site"). By accessing or using the Site you agree to these Terms. If you do not agree, please do not use the Site.</p>
<h2>Use of the Site</h2>
<p>You may use the Site for personal, non-commercial purposes. You agree not to: (a) use the Site in any way that violates applicable law; (b) attempt to gain unauthorized access to any portion of the Site or related systems; (c) use automated tools to scrape, crawl, or harvest content beyond what is permitted by our robots.txt; or (d) interfere with or disrupt the Site.</p>
<h2>Content &amp; Intellectual Property</h2>
<p>All text, images, graphics, logos, and other content on the Site are owned by Dog Breeds &amp; Needs or its licensors and are protected by copyright and other intellectual property laws. You may view and print pages for personal, non-commercial use. Reproduction, redistribution, or commercial use of content requires our prior written consent.</p>
<h2>Editorial Content &amp; Disclaimers</h2>
<p>The Site provides general information about dog breeds, training, health, nutrition, and care. The information is provided for educational purposes only and is <strong>not</strong> a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified veterinarian with any questions you may have regarding your dog's health or behavior.</p>
<p>Breed information, including temperament and care needs, reflects general tendencies. Individual dogs vary, and a breed's typical traits cannot guarantee how a specific dog will behave.</p>
<h2>Third-Party Links &amp; Recommendations</h2>
<p>The Site contains links to third-party websites, breeders, rescues, and products. These links are provided for convenience; we do not control and are not responsible for the content, policies, or practices of third parties. Inclusion does not constitute endorsement, and you assume all risk when interacting with third-party services.</p>
<h2>Affiliate Disclosure</h2>
<p>Some product links on the Site are affiliate links. If you click such a link and complete a purchase, we may earn a commission at no additional cost to you. Our editorial recommendations are made independently and are not influenced by affiliate relationships.</p>
<h2>User-Submitted Content</h2>
<p>If you submit feedback, suggestions, or corrections, you grant us a non-exclusive, royalty-free, perpetual license to use that content in connection with operating and improving the Site. You represent that you have the right to submit any content you provide.</p>
<h2>Disclaimer of Warranties</h2>
<p>The Site is provided on an "as is" and "as available" basis, without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or completely accurate.</p>
<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Dog Breeds &amp; Needs and its contributors will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Site, including any decisions you make about choosing, acquiring, or caring for a dog.</p>
<h2>Indemnification</h2>
<p>You agree to indemnify and hold harmless Dog Breeds &amp; Needs, its affiliates, and contributors from any claims, damages, or expenses (including reasonable attorneys' fees) arising out of your misuse of the Site or violation of these Terms.</p>
<h2>Modifications</h2>
<p>We may modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last updated" date. Your continued use of the Site after changes constitutes acceptance of the revised Terms.</p>
<h2>Governing Law</h2>
<p>These Terms are governed by the laws of the United States, without regard to conflict of law rules. Any disputes will be resolved in the appropriate courts within the United States.</p>
<h2>Contact</h2>
<p>Questions about these Terms? Email <a href="mailto:legal@dogbreedsandneeds.com">legal@dogbreedsandneeds.com</a>.</p>`);
}
