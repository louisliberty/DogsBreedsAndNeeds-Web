import { h } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { breedImgTag, breadcrumb, breadcrumbLd } from "../lib/components.mjs";
import {
  breeds, byPopularity, rescuesBySlug, BREED_GROUPS, SIZES, ENERGY, DOMAIN,
} from "../lib/data.mjs";

const chip = (filter, value, label, active = false) =>
  h`<button type="button" class="chip${active ? " is-active" : ""}" data-filter="${filter}" data-value="${value}" aria-pressed="${active ? "true" : "false"}">${label}</button>`;

export default function breedsIndex() {
  const crumbs = [{ href: "/", label: "Home" }, { href: "/breeds", label: "Breeds" }];
  const body = h`
<div class="wrap page">
  <div class="mb-6">
    <h1 class="page-title">All ${breeds.length} AKC Dog Breeds</h1>
    <p class="muted">Browse all ${breeds.length} AKC-recognized breeds. Search by name or filter by breed group, size, and energy level, then tick up to three breeds to compare side by side.</p>
  </div>

  <div class="toolbar">
    <div class="input-icon grow">
      ${icon("search", "ic search-ic")}
      <input type="search" class="input" placeholder="Search breeds..." aria-label="Search breeds" data-breed-search>
    </div>
    <button type="button" class="btn btn-outline" aria-expanded="false" aria-controls="filters" data-filters-toggle>${icon("sliders")} Filters</button>
  </div>

  <div class="card card-pad filter-panel" id="filters" hidden>
    <div class="filter-label">Breed Group</div>
    <div class="chips">${chip("group", "", "All", true)}${BREED_GROUPS.map((g) => chip("group", g, g))}</div>
    <div class="filter-label">Size</div>
    <div class="chips">${chip("size", "", "All", true)}${SIZES.map((s) => chip("size", s, s))}</div>
    <div class="filter-label">Energy Level</div>
    <div class="chips">${chip("energy", "", "All", true)}${ENERGY.map((e) => chip("energy", e, e))}</div>
    <div class="filter-label">Adoption</div>
    <div class="chips"><button type="button" class="chip" data-toggle="rescue" aria-pressed="false">${icon("heart", "ic ic-xs")} Has Rescue Directory</button></div>
  </div>

  <p class="muted small mb-4" aria-live="polite" data-breed-count>Showing ${breeds.length} breeds</p>

  <div class="grid cards-4" data-breed-grid>
    ${breeds.map((b) => h`<article class="card breed-card" data-name="${b.name.toLowerCase()}" data-group="${b.breedGroup}" data-size="${b.sizeCategory}" data-energy="${b.energyLevel}" data-rescue="${rescuesBySlug.has(b.slug) ? "1" : "0"}" data-slug="${b.slug}">
      <label class="compare-toggle"><input type="checkbox" value="${b.slug}" data-compare> Compare</label>
      <a href="/breeds/${b.slug}" class="card-link-plain">
        <div class="media-43">${breedImgTag(b)}</div>
        <div class="card-body">
          <div class="row-between"><h2 class="breed-card-title">${b.name}</h2><span class="muted xsmall">#${b.popularity}</span></div>
          <div class="badges"><span class="badge">${b.breedGroup}</span><span class="badge">${b.sizeCategory}</span><span class="badge">${b.energyLevel}</span></div>
          <p class="muted xsmall clamp-2">${b.temperamentSummary}</p>
        </div>
      </a>
    </article>`)}
  </div>

  <div class="empty" data-breed-empty hidden>
    ${icon("paw", "ic ic-hero muted")}
    <h2>No breeds found</h2>
    <p class="muted">Try adjusting your search or filters.</p>
  </div>
</div>

<div class="compare-bar" data-compare-bar hidden>
  ${icon("scale", "ic text-primary")}
  <span class="small strong" data-compare-count>0/3 selected</span>
  <a href="/compare" class="btn btn-primary btn-sm" data-compare-go aria-disabled="true">Compare Selected</a>
  <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Clear selection" data-compare-clear>${icon("x")}</button>
</div>`;

  const top = byPopularity.slice(0, 50);
  return {
    path: "/breeds",
    title: "All 205 AKC Dog Breeds: Browse, Search & Compare | Dog Breeds & Needs",
    description: "Browse the complete list of 205 AKC-recognized dog breeds. Filter by size, energy level, and breed group to compare traits and find your ideal companion.",
    scripts: ["breeds"],
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "AKC-Recognized Dog Breeds",
        numberOfItems: breeds.length,
        itemListElement: top.map((b, i) => ({ "@type": "ListItem", position: i + 1, url: `${DOMAIN}/breeds/${b.slug}`, name: b.name })),
      },
    ],
    body,
  };
}
