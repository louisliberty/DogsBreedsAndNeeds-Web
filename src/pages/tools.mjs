import { h } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { breedThumb, breedBySlug } from "../lib/data.mjs";

const POPULAR = [
  { slugs: ["labrador-retriever", "golden-retriever"], title: "Labrador vs Golden Retriever", blurb: "America's two favorite family dogs, head to head." },
  { slugs: ["french-bulldog", "boston-terrier"], title: "French Bulldog vs Boston Terrier", blurb: "Apartment-friendly companions with big personalities." },
  { slugs: ["siberian-husky", "alaskan-malamute"], title: "Siberian Husky vs Alaskan Malamute", blurb: "Two stunning sled dogs, which fits your lifestyle?" },
  { slugs: ["german-shepherd-dog", "belgian-malinois"], title: "German Shepherd vs Belgian Malinois", blurb: "The world's top working dogs compared." },
  { slugs: ["border-collie", "australian-shepherd"], title: "Border Collie vs Australian Shepherd", blurb: "Brilliant herders for active owners." },
  { slugs: ["rottweiler", "doberman-pinscher"], title: "Rottweiler vs Doberman", blurb: "Loyal protectors with very different temperaments." },
  { slugs: ["beagle", "basset-hound"], title: "Beagle vs Basset Hound", blurb: "Family-friendly hounds with a great nose." },
  { slugs: ["yorkshire-terrier", "maltese"], title: "Yorkshire Terrier vs Maltese", blurb: "Tiny lap dogs with luxurious coats." },
];

const TRAIT_GROUPS = [
  { icon: "ruler", label: "Size & build", traits: ["Size", "Weight", "Height", "Lifespan"] },
  { icon: "activity", label: "Energy & training", traits: ["Energy level", "Trainability", "Exercise needs", "Barking"] },
  { icon: "users", label: "Family fit", traits: ["Good with kids", "Good with other dogs", "Good with strangers", "Apartment friendly"] },
  { icon: "scissors", label: "Grooming & coat", traits: ["Grooming routine", "Shedding level", "Hypoallergenic"] },
  { icon: "health", label: "Health & lifestyle", traits: ["Common health issues", "Ideal owner", "Not a good fit for"] },
];

export function compare() {
  for (const c of POPULAR) for (const s of c.slugs) if (!breedBySlug.has(s)) throw new Error(`Popular comparison breed missing: ${s}`);
  const body = h`
<div class="wrap-lg page">
  <a href="/breeds" class="btn btn-ghost btn-sm back-link">${icon("arrowLeft")} All Breeds</a>
  <div class="mb-6">
    <h1 class="page-title">Compare Dog Breeds Side by Side</h1>
    <p class="muted">Pick 2–3 breeds to compare temperament, size, exercise, grooming, health, and more. Every comparison gets a shareable link like <code>/compare?breeds=golden-retriever,labrador-retriever</code>.</p>
  </div>

  <div class="grid cols-3 mb-6" data-compare-slots>
    ${[0, 1, 2].map((i) => h`<div class="card card-pad slot" data-slot="${i}"><label class="sr-only" for="slot-${i}">Breed ${i + 1}</label><select id="slot-${i}" class="input" disabled><option>Loading breeds…</option></select></div>`)}
  </div>
  <noscript><p class="card card-pad mb-6">The comparison tool needs JavaScript. You can still browse every <a href="/breeds">breed profile</a>.</p></noscript>

  <div data-compare-result hidden>
    <div class="row-between mb-4">
      <span class="muted small" data-compare-count></span>
      <button type="button" class="btn btn-outline btn-sm" data-copy-link>${icon("share")} Share This Comparison</button>
    </div>
    <div class="card table-card"><div class="table-scroll"><table class="compare-table" data-compare-table></table></div>
      <div class="legend"><span>${icon("check", "ic ic-xs text-good")} Best in this group</span><span>${icon("minus", "ic ic-xs text-ok")} Middle</span><span>${icon("x", "ic ic-xs text-bad")} Highest demand / least favorable</span></div>
    </div>
    <section class="card card-pad mt-6 card-tint">
      <h2 class="card-title">${icon("trophy", "ic text-primary")} Winner For You</h2>
      <div class="grid cols-2 tight" data-compare-winners></div>
    </section>
  </div>

  <div data-compare-intro>
    <section class="mb-10">
      <h2 class="h2">Popular Comparisons</h2>
      <p class="muted small mb-4">Start with one of these head-to-heads people search most.</p>
      <div class="grid cards-4">
        ${POPULAR.map((c) => h`<a href="/compare?breeds=${c.slugs.join(",")}" class="card card-link">
          <div class="pair">${c.slugs.map((s) => h`<img src="${breedThumb(s)}" alt="${breedBySlug.get(s).name}" width="240" height="180" loading="lazy" decoding="async">`)}</div>
          <div class="card-body"><h3 class="strong">${c.title}</h3><p class="muted xsmall clamp-2 mb-2">${c.blurb}</p><span class="xsmall strong text-primary">Compare now ${icon("arrowRight", "ic ic-xs")}</span></div>
        </a>`)}
      </div>
    </section>
    <section>
      <h2 class="h2">What you'll compare</h2>
      <p class="muted small mb-4">Every comparison covers 16+ traits across five categories so you can see real differences at a glance.</p>
      <div class="grid cards-3">
        ${TRAIT_GROUPS.map((g) => h`<div class="card card-body"><div class="row-start mb-3"><span class="icon-tile">${icon(g.icon)}</span><h3 class="strong">${g.label}</h3></div><div class="badges">${g.traits.map((t) => h`<span class="badge badge-secondary">${t}</span>`)}</div></div>`)}
        <div class="card card-body card-primary"><div class="row-start mb-2">${icon("heart", "ic text-primary")}<h3 class="strong">Not sure where to start?</h3></div><p class="muted xsmall mb-3">Take a 2-minute quiz and we'll suggest breeds that match your lifestyle.</p><a href="/dog-breed-selector" class="btn btn-outline btn-sm w-full">Take the breed quiz ${icon("arrowRight")}</a></div>
      </div>
    </section>
  </div>
</div>`;
  return {
    path: "/compare",
    title: "Compare Dog Breeds Side by Side: Temperament, Size, Energy & Care | Dog Breeds & Needs",
    description: "Compare any 2 or 3 AKC dog breeds side by side. See temperament, size, energy, training, grooming, health, and exercise needs, and find the best match for your lifestyle.",
    scripts: ["compare"],
    body,
  };
}

export function quiz() {
  const body = h`
<div class="wrap-sm page" data-quiz>
  <div class="center mb-6">
    ${icon("paw", "ic ic-hero")}
    <h1 class="page-title">Dog Breed Selector Quiz</h1>
    <p class="muted" data-quiz-sub>Answer 7 quick questions about your lifestyle, home, and preferences to find your ideal match.</p>
  </div>
  <div class="mb-6">
    <div class="row-between muted small mb-2"><span data-quiz-step>Question 1 of 7</span><span data-quiz-pct>14%</span></div>
    <div class="progress"><div class="progress-bar" data-quiz-bar style="width:14%"></div></div>
  </div>
  <div class="card card-pad">
    <h2 class="h3 mb-4" data-quiz-question>What is your living situation?</h2>
    <div class="stack-sm" data-quiz-options>
      <noscript><p>The quiz needs JavaScript to run. You can still browse every <a href="/breeds">breed profile</a>.</p></noscript>
    </div>
  </div>
  <div class="row-between mt-4">
    <button type="button" class="btn btn-ghost" data-quiz-back hidden>${icon("arrowLeft")} Previous Question</button>
    <button type="button" class="btn btn-primary" data-quiz-finish hidden>See My Results ${icon("arrowRight")}</button>
  </div>
  <section class="prose mt-10">
    <h2>How the Breed Selector Works</h2>
    <p>The quiz scores your answers on living situation, activity level, preferred size, children at home, experience, grooming time, and shedding tolerance against the profiles of all 205 AKC-recognized breeds. You get a ranked top five with a plain-English explanation of why each breed matched, links to the full breed profiles, and a one-click side-by-side comparison of your top picks. Your answers stay in your browser; nothing is sent to us.</p>
  </section>
</div>`;
  return {
    path: "/dog-breed-selector",
    title: "Dog Breed Selector Quiz: Find Your Perfect Breed | Dog Breeds & Needs",
    description: "Not sure which dog breed is right for you? Take our free 7-question breed selector quiz and get personalized matches based on your lifestyle. Start now!",
    scripts: ["quiz"],
    body,
  };
}

export function quizResults() {
  const body = h`
<div class="wrap-md page" data-quiz-results>
  <div class="center mb-6">
    ${icon("sparkles", "ic ic-hero")}
    <h1 class="page-title" data-results-title>Your Breed Matches</h1>
    <p class="muted">Based on your lifestyle answers, here are the breeds we recommend exploring first.</p>
  </div>
  <div class="btn-row center mb-6">
    <button type="button" class="btn btn-outline btn-sm" data-copy-link>${icon("share")} Share My Results</button>
    <a href="/dog-breed-selector" class="btn btn-outline btn-sm" data-refine>${icon("pencil")} Refine My Answers</a>
    <a href="/compare" class="btn btn-outline btn-sm" data-compare-top>${icon("scale")} Compare My Top Matches</a>
    <a href="/dog-breed-selector" class="btn btn-ghost btn-sm">${icon("rotate")} Start Over</a>
  </div>
  <div class="stack" data-results-list><noscript><p class="card card-pad">Quiz results need JavaScript. <a href="/breeds">Browse all breeds</a> instead.</p></noscript></div>
</div>`;
  return {
    path: "/dog-breed-selector/results",
    title: "Your Dog Breed Quiz Results: Top 5 Personalized Matches | Dog Breeds & Needs",
    description: "See your top 5 personalized dog breed matches based on lifestyle, living situation, and preferences. Refine your answers, share results, or compare your matches.",
    noindex: true,
    scripts: ["quiz"],
    body,
  };
}
