import { h } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { breedCard } from "../lib/components.mjs";
import { breeds, byPopularity, BREED_GROUPS, DOMAIN, SITE_NAME } from "../lib/data.mjs";

const GROUP_ICONS = { Sporting: "bird", Hound: "mountain", Working: "shield", Terrier: "shovel", Toy: "crown", "Non-Sporting": "sparkles", Herding: "compass" };

export default function home() {
  const body = h`
<section class="hero">
  <div class="wrap narrow center">
    <h1>Complete Guide to Every <span class="text-primary">Dog Breed</span></h1>
    <p class="lead">Explore all ${breeds.length} AKC-recognized breeds. Compare traits, take our breed quiz, and find your ideal companion.</p>
    <form class="hero-search" action="/breeds" method="get" role="search">
      ${icon("search", "ic search-ic")}
      <input type="search" name="search" placeholder="Search breeds..." aria-label="Search breeds">
    </form>
    <div class="btn-row center">
      <a href="/breeds" class="btn btn-primary btn-lg">${icon("paw")} Browse All Breeds</a>
      <a href="/dog-breed-selector" class="btn btn-outline btn-lg">${icon("heart")} Take the Breed Quiz</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="section-title center">Browse by Group</h2>
    <p class="muted center mb-6">All AKC breed groups</p>
    <div class="grid group-grid">
      ${BREED_GROUPS.map((g) => h`<a href="/breeds?group=${g}" class="card card-link group-card">${icon(GROUP_ICONS[g], "ic ic-group")}<span>${g}</span></a>`)}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="row-between mb-6">
      <div><h2 class="section-title">Popular Breeds</h2><p class="muted">The most popular AKC breeds</p></div>
      <a href="/breeds" class="btn btn-primary">View All ${icon("arrowRight")}</a>
    </div>
    <div class="grid cards-4">${byPopularity.slice(0, 12).map((b) => breedCard(b))}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="section-title center mb-6">Why Dog Breeds &amp; Needs?</h2>
    <div class="grid cards-3">
      <a href="/breeds" class="card card-link card-pad center">${icon("paw", "ic ic-feature")}<h3>205 AKC Breeds</h3><p class="muted small">Complete directory of every AKC-recognized breed with detailed profiles.</p></a>
      <a href="/ethical-sourcing" class="card card-link card-pad center">${icon("book", "ic ic-feature")}<h3>Ethical Sourcing</h3><p class="muted small">Learn how to find responsible breeders and ethical adoption options.</p></a>
      <a href="/products" class="card card-link card-pad center">${icon("bag", "ic ic-feature")}<h3>Product Picks</h3><p class="muted small">Curated product recommendations tailored to your breed's needs.</p></a>
    </div>
  </div>
</section>`;

  return {
    path: "/",
    title: "Dog Breeds & Needs: Complete Guide to All 205 AKC Dog Breeds",
    description: "Explore all 205 AKC-recognized dog breeds with detailed profiles, temperament ratings, and care guides. Take our breed quiz to find your perfect match today!",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${DOMAIN}/`,
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${DOMAIN}/breeds?search={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: `${DOMAIN}/`, logo: `${DOMAIN}/apple-touch-icon.png` },
    ],
    body,
  };
}
