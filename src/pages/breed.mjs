import { h } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { breedImgTag, breadcrumb, breadcrumbLd } from "../lib/components.mjs";
import {
  breeds, relatedBreeds, productsForSize, rescuesBySlug, breedImg, breedThumb, breedAlt, fmtDate,
  energyScore, trainScore, barkScore, groomScore, DOMAIN, SITE_NAME,
} from "../lib/data.mjs";

function paws(label, value) {
  return h`<div class="paw-row"><span class="paw-label">${label}</span><span class="paws" role="img" aria-label="${value} out of 5">${[0, 1, 2, 3, 4].map((i) => icon("paw", i < value ? "ic paw on" : "ic paw"))}</span><span class="muted xsmall">${value}/5</span></div>`;
}

function shareButtons(b) {
  const url = `${DOMAIN}/breeds/${b.slug}`;
  const msg = `Everything you need to know about the ${b.name}, temperament, care, and whether they're right for you:`;
  return h`<div class="share-row"><span class="muted small hide-sm">Share:</span>
  <a class="btn btn-outline btn-sm" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener">Facebook</a>
  <a class="btn btn-outline btn-sm" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&amp;text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Post on X</a>
  <button type="button" class="btn btn-outline btn-sm" data-copy-link>${icon("link")} Copy Link</button>
</div>`;
}

const fact = (label, value) => h`<div><span class="muted">${label}</span><p class="strong">${value}</p></div>`;
const para = (title, text) => h`<div><h3 class="h4">${title}</h3><p class="muted pre-line">${text}</p></div>`;

function breedPage(b) {
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/breeds", label: "Breeds" },
    { href: `/breeds?group=${encodeURIComponent(b.breedGroup)}`, label: `${b.breedGroup} Group` },
    { href: `/breeds/${b.slug}`, label: b.name },
  ];
  const hasRescues = rescuesBySlug.has(b.slug);
  const related = relatedBreeds(b);
  const prods = productsForSize(b.sizeCategory).slice(0, 6);
  const updated = fmtDate(b.lastUpdated);

  const body = h`
<div class="sticky-actions" data-sticky hidden>
  <div class="wrap-md row-between">
    <span class="strong small truncate">${b.name}</span>
    <div class="btn-row">
      <a href="/find-a-breeder" class="btn btn-outline btn-sm">Find a Breeder</a>
      ${hasRescues ? h`<a href="/rescue/${b.slug}" class="btn btn-outline btn-sm">Find a Rescue</a>` : ""}
      <a href="/compare?breeds=${b.slug}" class="btn btn-outline btn-sm">${icon("scale")} Compare</a>
      <button type="button" class="btn btn-outline btn-sm" data-copy-link>${icon("share")} Share</button>
    </div>
  </div>
</div>

<article class="wrap-md page">
  <a href="/breeds" class="btn btn-ghost btn-sm back-link">${icon("arrowLeft")} All Breeds</a>
  ${breadcrumb(crumbs)}

  <header class="breed-hero" data-hero>
    <div class="breed-hero-img">
      <img src="${breedImg(b.slug)}" srcset="${breedThumb(b.slug)} 480w, ${breedImg(b.slug)} 1280w" sizes="(min-width: 768px) 320px, 100vw" alt="${breedAlt(b)}" width="640" height="448" fetchpriority="high" decoding="async">
    </div>
    <div class="grow">
      <div class="title-row">
        <h1 class="page-title">${b.name}</h1>
        <span class="badge badge-primary">#${b.popularity} Most Popular</span>
      </div>
      <p class="muted xsmall mb-3">Last updated <time datetime="${b.lastUpdated}">${updated}</time></p>
      <div class="badges mb-3">
        <a class="badge" href="/breeds?group=${encodeURIComponent(b.breedGroup)}">${b.breedGroup} Group</a>
        <span class="badge">${b.sizeCategory}</span>
        <span class="badge">${b.originCountry}</span>
        ${b.yearRecognized ? h`<span class="badge">AKC since ${b.yearRecognized}</span>` : ""}
        ${b.hypoallergenic ? h`<span class="badge badge-secondary">Hypoallergenic</span>` : ""}
      </div>
      <p class="quote">${b.famousQuote}</p>
      ${shareButtons(b)}
      <div class="btn-row mt-3">
        <a href="/compare?breeds=${b.slug}" class="btn btn-outline btn-sm">${icon("scale")} Compare with another breed</a>
        ${hasRescues ? h`<a href="/rescue/${b.slug}" class="btn btn-outline btn-sm">${icon("heart")} Adopt a ${b.name}</a>` : ""}
      </div>
    </div>
  </header>

  ${b.idealOwnerProfile || b.notGoodFor ? h`
  <section class="card card-pad mb-6 card-tint">
    <h2 class="card-title">${icon("heart", "ic text-primary")} Is the ${b.name} Right For You?</h2>
    <div class="grid cols-2">
      ${b.idealOwnerProfile ? h`<div class="verdict verdict-yes"><h3>${icon("check")} YES, if you are…</h3><p>${b.idealOwnerProfile}</p></div>` : ""}
      ${b.notGoodFor ? h`<div class="verdict verdict-no"><h3>${icon("x")} NO, if you are…</h3><p>${b.notGoodFor}</p></div>` : ""}
    </div>
  </section>` : ""}

  ${b.funFacts?.length ? h`
  <section class="card card-pad mb-6 card-primary">
    <h2 class="card-title">${icon("bulb", "ic text-primary")} Fun Facts about the ${b.name}</h2>
    <ol class="facts">${b.funFacts.map((f) => h`<li>${f}</li>`)}</ol>
  </section>` : ""}

  ${b.commonMisconceptions ? h`
  <section class="card card-pad mb-6 card-warn row-start">
    ${icon("alert", "ic ic-lg text-warn")}
    <div><h2 class="h4">Common Misconceptions about the ${b.name}</h2><p class="small">${b.commonMisconceptions}</p></div>
  </section>` : ""}

  <div class="grid cols-2">
    <section class="card card-pad">
      <h2 class="card-title">${icon("activity", "ic text-primary")} Quick Facts</h2>
      <div class="facts-grid small">
        ${fact("Weight", b.weightRange)}${fact("Height", b.heightRange)}
        ${fact("Lifespan", b.lifespan)}${fact("Coat", b.coatType)}
        ${fact("Colors", b.coatColors)}${fact("Shedding", b.sheddingLevel)}
        ${fact("Energy", b.energyLevel)}${fact("Trainability", b.trainability)}
        ${fact("Barking", b.barkingTendency)}${fact("Apartment Suitable", b.apartmentSuitable ? "Yes" : "No")}
      </div>
    </section>
    <section class="card card-pad">
      <h2 class="card-title">${icon("paw", "ic text-primary")} ${b.name} Temperament</h2>
      <p class="muted small mb-4">${b.temperamentSummary}</p>
      ${paws("Energy", energyScore(b.energyLevel))}
      ${paws("Trainability", trainScore(b.trainability))}
      ${paws("Friendliness", b.strangerFriendliness)}
      ${paws("Barking", barkScore(b.barkingTendency))}
      ${paws("Grooming Needs", groomScore(b.sheddingLevel))}
      ${paws("Good With Kids", b.goodWithKids)}
      ${paws("Good With Other Dogs", b.goodWithDogs)}
      ${paws("Good With Cats", b.goodWithCats)}
    </section>
  </div>

  <div class="grid cols-2 mt-6">
    <section class="card card-pad stack small">
      <h2 class="card-title">${icon("zap", "ic text-primary")} Exercise &amp; Grooming</h2>
      ${para("Exercise Needs", b.exerciseNeeds)}
      ${para("Grooming", b.groomingFrequency)}
      ${b.groomingGuide ? para("Grooming Guide", b.groomingGuide) : ""}
    </section>
    <section class="card card-pad stack small">
      <h2 class="card-title">${icon("health", "ic text-primary")} ${b.name} Health</h2>
      ${para("Common Health Issues", b.commonHealthIssues)}
      ${para("Diet & Nutrition", b.dietNotes)}
      ${para("Health Care", b.healthCareGuide)}
    </section>
  </div>

  <section class="card card-pad mt-6 stack">
    <h2 class="card-title">${icon("book", "ic text-primary")} About the ${b.name}</h2>
    ${para("History", b.history)}
    ${para("Personality", b.personalityDeepDive)}
    ${para(`Living With a ${b.name}`, b.livingWith)}
    ${para("Training", b.trainingNotes)}
  </section>

  ${b.faqs?.length ? h`
  <section class="card card-pad mt-6">
    <h2 class="card-title">Frequently Asked Questions about the ${b.name}</h2>
    <div class="faq">${b.faqs.map((f) => h`<details><summary>${f.question}${icon("chevronDown", "ic ic-sm")}</summary><p>${f.answer}</p></details>`)}</div>
  </section>` : ""}

  ${related.length ? h`
  <section class="mt-8">
    <h2 class="h3 mb-4">Related Breeds</h2>
    <div class="grid cards-4 tight">
      ${related.map((r) => h`<a href="/breeds/${r.slug}" class="card card-link"><div class="media-43">${breedImgTag(r)}</div><div class="card-body-sm"><h3 class="small strong truncate">${r.name}</h3><p class="muted xsmall">${r.sizeCategory} · ${r.energyLevel}</p></div></a>`)}
    </div>
  </section>` : ""}

  ${prods.length ? h`
  <section class="mt-8">
    <h2 class="h3 mb-4">Recommended Products for ${b.sizeCategory} Dogs</h2>
    <div class="grid cards-3">
      ${prods.map((p) => h`<div class="card card-body"><span class="badge mb-2">${p.category}</span><h3 class="small strong mb-1">${p.name}</h3><p class="muted xsmall clamp-2">${p.description}</p></div>`)}
    </div>
    <div class="center mt-4"><a href="/products" class="btn btn-outline">View All Products</a></div>
  </section>` : ""}

  <div class="share-footer">
    <p class="muted small">Found this guide helpful? Share it with a fellow dog lover.</p>
    ${shareButtons(b)}
  </div>
</article>`;

  const url = `${DOMAIN}/breeds/${b.slug}`;
  return {
    path: `/breeds/${b.slug}`,
    title: `${b.name}: Breed Info, Temperament & Care Guide | Dog Breeds & Needs`,
    description: `Learn everything about the ${b.name}: temperament, size, exercise needs, health tips, and more. See if this ${b.breedGroup} breed is right for you!`,
    ogType: "article",
    ogImage: breedImg(b.slug),
    ogImageW: 1280,
    ogImageH: 896,
    ogImageAlt: breedAlt(b),
    preloadImage: breedImg(b.slug),
    scripts: ["breed"],
    jsonLd: [
      breadcrumbLd(crumbs),
      ...(b.faqs?.length
        ? [{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: b.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }]
        : []),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${b.name}: Breed Info, Temperament & Care Guide`,
        description: `Complete guide to the ${b.name}: temperament, size, exercise needs, health, training, and care for this ${b.breedGroup} Group breed.`,
        image: `${DOMAIN}${breedImg(b.slug)}`,
        url,
        mainEntityOfPage: url,
        datePublished: b.lastUpdated,
        dateModified: b.lastUpdated,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME, url: DOMAIN },
        about: { "@type": "Thing", name: `${b.name} dog breed` },
      },
    ],
    body,
  };
}

export default function breedPages() {
  return breeds.map(breedPage);
}
