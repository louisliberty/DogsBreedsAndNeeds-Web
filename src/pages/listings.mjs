import { h } from "../lib/html.mjs";
import { icon } from "../lib/icons.mjs";
import { breadcrumb, breadcrumbLd, pageHero } from "../lib/components.mjs";
import { markdown } from "../lib/markdown.mjs";
import {
  breeds, breedBySlug, rescues, rescuesBySlug, articles, products, BREED_GROUPS, PRODUCT_CATEGORIES,
  ARTICLE_CATEGORIES, breedThumb, breedAlt, fmtDate, DOMAIN, SITE_NAME,
} from "../lib/data.mjs";
import { raw } from "../lib/html.mjs";

/* ---------------- Rescue ---------------- */

export function rescueHub() {
  const items = [...rescuesBySlug.entries()]
    .map(([slug, list]) => ({ b: breedBySlug.get(slug), count: list.length }))
    .filter((x) => x.b);
  const groups = {};
  for (const it of items) (groups[it.b.breedGroup] ||= []).push(it);
  const sortedGroups = Object.entries(groups)
    .map(([g, list]) => [g, list.sort((a, b) => a.b.name.localeCompare(b.b.name))])
    .sort(([a], [b]) => a.localeCompare(b));
  const crumbs = [{ href: "/", label: "Home" }, { href: "/rescue", label: "Rescue Directory" }];

  const body = h`
<div class="wrap-md page">
  ${pageHero("heart", "Dog Breed Rescue Directory", "Browse breed-specific rescue organizations across the United States. Adopting from a breed-specific rescue means your new dog comes from foster care with people who know the breed inside and out.")}
  <div class="badges center mb-8"><span class="badge badge-secondary">${rescues.length} rescue organizations</span><span class="badge badge-secondary">${items.length} breeds</span></div>
  ${sortedGroups.map(([g, list]) => h`
  <section class="mb-8">
    <h2 class="h3 mb-4">${g} Group</h2>
    <div class="grid cards-3 tight">
      ${list.map(({ b, count }) => h`<a href="/rescue/${b.slug}" class="card card-link row-card"><img src="${breedThumb(b.slug)}" alt="${breedAlt(b)}" width="56" height="56" loading="lazy" decoding="async"><div class="min-w-0"><h3 class="small strong truncate">${b.name}</h3><p class="muted xsmall">${count} rescue${count !== 1 ? "s" : ""}</p></div></a>`)}
    </div>
  </section>`)}
  <section class="card card-pad card-primary center mt-8">
    <h2 class="h4 mb-2">Why Adopt from a Breed-Specific Rescue?</h2>
    <p class="muted small mb-4 mx-auto max-xl">Breed-specific rescues understand the temperament, exercise needs, health concerns, and grooming requirements of their breed. They evaluate dogs in foster homes, match adopters carefully, and remain a lifelong resource. Don't see a rescue for your breed? Try the AKC Rescue Network or our ethical sourcing guide.</p>
    <div class="btn-row center"><a href="/find-a-breeder" class="btn btn-outline">Find an Ethical Breeder</a><a href="/ethical-sourcing" class="btn btn-outline">Ethical Sourcing Guide</a></div>
  </section>
</div>`;

  const sortedItems = [...items].sort((a, b) => a.b.name.localeCompare(b.b.name));
  return {
    path: "/rescue",
    title: "Dog Breed Rescue Directory: Find Breed-Specific Rescues by Breed | Dog Breeds & Needs",
    description: `Browse rescue organizations for ${items.length}+ popular dog breeds. Adopt a Golden Retriever, Labrador, German Shepherd, Bulldog, Beagle, and more from breed-specific rescues nationwide.`,
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Breed-Specific Rescue Directories",
        numberOfItems: sortedItems.length,
        itemListElement: sortedItems.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${DOMAIN}/rescue/${it.b.slug}`, name: `${it.b.name} Rescues` })),
      },
    ],
    body,
  };
}

function rescueBreed(slug, list) {
  const b = breedBySlug.get(slug);
  const crumbs = [{ href: "/", label: "Home" }, { href: "/rescue", label: "Rescue Directory" }, { href: `/rescue/${slug}`, label: `${b.name} Rescue` }];
  const body = h`
<div class="wrap-md page">
  ${breadcrumb(crumbs)}
  ${pageHero("heart", `${b.name} Rescue Organizations`, `${list.length} rescue organization${list.length !== 1 ? "s" : ""} placing ${b.name}s in adoptive homes across the United States.`)}
  <div class="center mb-8"><img class="rescue-hero-img" src="${breedThumb(slug)}" alt="${breedAlt(b)}" width="192" height="144" decoding="async"></div>
  <div class="stack mb-8">
    ${list.map((org) => h`<section class="card card-pad">
      <div class="row-between mb-2 wrap-row"><h2 class="h4">${org.name}</h2><span class="badge">${org.region}</span></div>
      ${org.description ? h`<p class="muted small mb-3">${org.description}</p>` : ""}
      <div class="btn-row">
        ${org.url ? h`<a href="${org.url}" class="btn btn-primary btn-sm" target="_blank" rel="noopener nofollow">${icon("external")} Visit Website</a>` : ""}
        ${org.email ? h`<a href="mailto:${org.email}" class="btn btn-outline btn-sm break">${icon("mail")} ${org.email}</a>` : ""}
        ${org.phone ? h`<a href="tel:${org.phone.replace(/[^0-9+]/g, "")}" class="btn btn-outline btn-sm">${icon("phone")} ${org.phone}</a>` : ""}
      </div>
    </section>`)}
  </div>
  <section class="card card-pad card-primary center">
    <h2 class="h4 mb-2">Why Adopt a ${b.name}?</h2>
    <p class="muted small mb-4 mx-auto max-xl">${b.temperamentSummary} Read the full breed profile to learn about exercise needs, grooming, training, and health before adopting.</p>
    <div class="btn-row center"><a href="/breeds/${slug}" class="btn btn-outline">${icon("paw")} ${b.name} Breed Profile</a><a href="/find-a-breeder" class="btn btn-outline">Find an Ethical Breeder</a></div>
  </section>
</div>`;
  return {
    path: `/rescue/${slug}`,
    title: `${b.name} Rescue Organizations: Adopt a ${b.name} Near You | Dog Breeds & Needs`,
    description: `Directory of ${list.length} ${b.name} rescue organizations across the United States. Find a ${b.name} to adopt, contact info, regions served, and websites for each rescue.`,
    ogType: "article",
    jsonLd: [
      breadcrumbLd(crumbs),
      ...list.filter((r) => r.url).map((r) => ({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": r.url,
        name: r.name,
        url: r.url,
        areaServed: r.region,
        ...(r.email ? { email: r.email } : {}),
        ...(r.phone ? { telephone: r.phone } : {}),
        ...(r.description ? { description: r.description } : {}),
      })),
    ],
    body,
  };
}

export const rescueBreedPages = () => [...rescuesBySlug.entries()].filter(([s]) => breedBySlug.has(s)).map(([s, l]) => rescueBreed(s, l));

/* ---------------- Blog ---------------- */

export function blogIndex() {
  const crumbs = [{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }];
  const body = h`
<div class="wrap-md page">
  <h1 class="page-title">Dog Care Blog</h1>
  <p class="muted mb-6">Breed guides, lifestyle tips, adoption advice, and honest answers to the questions every dog owner asks.</p>
  <div class="input-icon mb-4">${icon("search", "ic search-ic")}<input type="search" class="input" placeholder="Search articles..." aria-label="Search articles" data-blog-search></div>
  <div class="chips mb-6">${["All", ...ARTICLE_CATEGORIES].map((c, i) => h`<button type="button" class="chip${i === 0 ? " is-active" : ""}" data-blog-cat="${c}" aria-pressed="${i === 0}">${c}</button>`)}</div>
  <div class="grid cols-2">
    ${articles.map((a) => h`<a href="/blog/${a.slug}" class="card card-link card-pad" data-article data-category="${a.category}" data-text="${(a.title + " " + a.metaDescription + " " + a.tags.join(" ")).toLowerCase()}">
      <div class="row-start mb-2 wrap-row"><span class="badge badge-secondary">${a.category}</span><span class="muted xsmall row-start">${icon("calendar", "ic ic-xs")} ${fmtDate(a.publishedAt)}</span></div>
      <h2 class="h4 mb-2">${a.title}</h2>
      <p class="muted small clamp-3">${a.metaDescription}</p>
    </a>`)}
  </div>
  <p class="muted center empty" data-blog-empty hidden>No articles match your filters.</p>
</div>`;
  return {
    path: "/blog",
    title: "Dog Care Blog: Breed Guides, Adoption & Lifestyle Articles | Dog Breeds & Needs",
    description: "In-depth dog care articles: best apartment dogs, hypoallergenic breeds, first-time owner guides, ethical adoption, and more, written for real dog owners.",
    scripts: ["blog"],
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Dog Breeds & Needs Blog",
        url: `${DOMAIN}/blog`,
        blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${DOMAIN}/blog/${a.slug}`, description: a.metaDescription, datePublished: a.publishedAt, dateModified: a.updatedAt })),
      },
    ],
    body,
  };
}

function blogPost(a) {
  const crumbs = [{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { href: `/blog/${a.slug}`, label: a.title }];
  const url = `${DOMAIN}/blog/${a.slug}`;
  const body = h`
<article class="wrap-sm page">
  <a href="/blog" class="btn btn-ghost btn-sm back-link">${icon("arrowLeft")} All Articles</a>
  ${breadcrumb(crumbs)}
  <div class="row-start wrap-row mb-3"><span class="badge badge-secondary">${a.category}</span><span class="muted xsmall row-start">${icon("calendar", "ic ic-xs")} <time datetime="${a.publishedAt}">${fmtDate(a.publishedAt)}</time></span><span class="muted xsmall row-start">${icon("user", "ic ic-xs")} ${a.author}</span></div>
  <h1 class="page-title mb-3">${a.title}</h1>
  <p class="lead mb-6">${a.metaDescription}</p>
  ${a.featuredImage ? h`<img src="${a.featuredImage}" alt="${a.title}" class="rounded mb-6">` : ""}
  <div class="prose">${raw(markdown(a.content))}</div>
  ${a.tags.length ? h`<div class="row-start wrap-row tags">${icon("tag", "ic ic-sm muted")}${a.tags.map((t) => h`<span class="badge">${t}</span>`)}</div>` : ""}
  <div class="btn-row mt-8 pt-6 border-t">
    <a href="/blog" class="btn btn-outline">${icon("arrowLeft")} More Articles</a>
    <a href="/dog-breed-selector" class="btn btn-primary">Take the Breed Quiz</a>
  </div>
</article>`;
  return {
    path: `/blog/${a.slug}`,
    title: `${a.title} | Dog Breeds & Needs`,
    description: a.metaDescription,
    ogType: "article",
    ...(a.featuredImage ? { ogImage: a.featuredImage, ogImageAlt: a.title } : {}),
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.metaDescription,
        url,
        mainEntityOfPage: url,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        author: { "@type": "Organization", name: a.author },
        publisher: { "@type": "Organization", name: SITE_NAME, url: DOMAIN },
        articleSection: a.category,
        keywords: a.tags.join(", "),
        ...(a.featuredImage ? { image: a.featuredImage } : {}),
      },
    ],
    body,
  };
}

export const blogPosts = () => articles.map(blogPost);

/* ---------------- Products ---------------- */

function productCard(p) {
  const primary = p.retailers?.[0];
  const tier = p.priceTier
    ? h`<span class="price" title="${p.priceTier === "$" ? "Budget-friendly" : p.priceTier === "$$" ? "Mid-range" : "Premium"}"><b>${p.priceTier}</b><span>${"$$$".slice(p.priceTier.length)}</span></span>`
    : "";
  return h`<article class="card product" data-category="${p.category}">
  <div class="media-43 product-img">${p.imageUrl ? h`<img src="${p.imageUrl}" alt="${p.name}" width="480" height="360" loading="lazy" decoding="async">` : icon("bag", "ic ic-hero muted")}</div>
  <div class="card-body col">
    <div class="row-between mb-2"><span class="badge">${p.category}</span><span class="row-start">${p.editorsPick ? h`<span class="badge badge-primary">${icon("sparkles", "ic ic-xs")} Editor's Pick</span>` : ""}${tier}</span></div>
    ${p.brand ? h`<p class="eyebrow">${p.brand}</p>` : ""}
    <h3 class="h4 mb-2">${p.name}</h3>
    <p class="muted small mb-3 clamp-3">${p.description}</p>
    ${p.bestFor?.length ? h`<p class="xsmall strong mb-1">Best for</p><div class="badges mb-3">${p.bestFor.slice(0, 3).map((b) => h`<span class="badge badge-secondary">${b}</span>`)}</div>` : ""}
    <div class="product-foot">
      <p class="muted xsmall"><span class="strong fg">${p.editorsPick ? "Why we picked it: " : "Why we recommend: "}</span>${p.editorsNote || p.whyRecommended}</p>
      ${p.tags?.length ? h`<div class="badges">${p.tags.slice(0, 4).map((t) => h`<span class="tag">${icon("leaf", "ic ic-xxs")} ${t}</span>`)}</div>` : ""}
      ${primary ? h`<a href="${primary.url}" class="btn btn-primary btn-sm w-full" target="_blank" rel="sponsored noopener">View on ${primary.retailer} ${icon("external")}</a>` : ""}
      ${p.retailers?.length > 1 ? h`<p class="xsmall center muted">Also at ${p.retailers.slice(1).map((r, i) => h`${i ? ", " : ""}<a href="${r.url}" target="_blank" rel="sponsored noopener">${r.retailer}</a>`)}</p>` : ""}
    </div>
  </div>
</article>`;
}

export function productsPage() {
  const picks = products.filter((p) => p.editorsPick).slice(0, 6);
  const body = h`
<div class="wrap-lg page">
  ${pageHero("bag", "Vet-reviewed picks. No mystery ingredients. No mystery materials.", "A small, opinionated list of dog products we'd actually buy, chosen for ingredient transparency, durable materials, and brands that stand behind what they sell.")}
  <section class="card card-pad card-primary mb-8 row-start">
    ${icon("shieldCheck", "ic text-primary")}
    <p class="small"><strong>Affiliate disclosure: </strong>Some links below are affiliate links and we may earn a commission if you buy, at no extra cost to you. Editorial picks come first; affiliate status never decides what's listed. <a href="/products/how-we-choose">How we choose products →</a></p>
  </section>
  ${picks.length ? h`<section class="mb-10">
    <div class="row-start wrap-row mb-4">${icon("sparkles", "ic text-primary")}<h2 class="h3">Editor's Picks</h2><span class="muted xsmall">· Things we've tested and would recommend without hesitation</span></div>
    <div class="grid cards-3">${picks.map(productCard)}</div>
  </section>` : ""}
  <h2 class="h3 mb-3">Browse by category</h2>
  <div class="chips mb-6">${["All", ...PRODUCT_CATEGORIES].map((c, i) => h`<button type="button" class="chip${i === 0 ? " is-active" : ""}" data-product-cat="${c}" aria-pressed="${i === 0}">${c}</button>`)}</div>
  <div class="grid cards-3" data-product-grid>${products.map(productCard)}</div>
  <div class="empty" data-product-empty hidden>${icon("help", "ic ic-hero muted")}<h3>Nothing in this category yet</h3><p class="muted small">We're adding picks slowly and only when we'd genuinely recommend them. Try another category for now.</p></div>
</div>`;
  return {
    path: "/products",
    title: "Eco-Friendly Dog Products: Vet-Reviewed Picks | Dog Breeds & Needs",
    description: "Clean, vet-reviewed dog product picks for food, toys, leashes, grooming, beds, and supplements. Transparent ingredients, traceable materials, and an honest affiliate disclosure.",
    scripts: ["products"],
    body,
  };
}

/* ---------------- Sitemap & 404 ---------------- */

export function sitemapPage() {
  const main = [
    ["/", "Home"], ["/breeds", "All Breeds"], ["/compare", "Compare Breeds"], ["/dog-breed-selector", "Breed Quiz"],
    ["/ethical-sourcing", "Ethical Sourcing Guide"], ["/find-a-breeder", "Find an Ethical Breeder"], ["/rescue", "Rescue Directory"],
    ["/blog", "Blog"], ["/products", "Products"], ["/products/how-we-choose", "How We Choose Products"], ["/about", "About"],
    ["/privacy", "Privacy Policy"], ["/terms", "Terms of Service"],
  ];
  const body = h`
<div class="wrap-md page">
  ${pageHero("map", "Dog Breeds & Needs Sitemap", "Complete directory of all pages on DogBreedsAndNeeds.com")}
  <section class="mb-8"><h2 class="h3 rule">Main Pages</h2><ul class="link-grid">${main.map(([href, l]) => h`<li><a href="${href}">${l}</a></li>`)}</ul></section>
  <section class="mb-8"><h2 class="h3 rule">All Breeds by Group (${breeds.length} total)</h2>
    ${BREED_GROUPS.map((g) => {
      const list = breeds.filter((b) => b.breedGroup === g);
      return h`<h3 class="h4 text-primary mt-4 mb-2">${g} Group (${list.length})</h3><ul class="link-grid four">${list.map((b) => h`<li><a href="/breeds/${b.slug}">${b.name}</a></li>`)}</ul>`;
    })}
  </section>
  <section class="mb-8"><h2 class="h3 rule">Rescue Directories (${rescuesBySlug.size})</h2><ul class="link-grid">${[...rescuesBySlug.keys()].filter((s) => breedBySlug.has(s)).map((s) => h`<li><a href="/rescue/${s}">${breedBySlug.get(s).name} Rescues</a></li>`)}</ul></section>
  <section><h2 class="h3 rule">Blog Articles (${articles.length})</h2><ul class="link-grid two">${articles.map((a) => h`<li><a href="/blog/${a.slug}">${a.title}</a></li>`)}</ul></section>
</div>`;
  return {
    path: "/sitemap",
    title: "Sitemap: All Dog Breeds & Pages | Dog Breeds & Needs",
    description: "View the complete sitemap for Dog Breeds & Needs. Browse all 205 AKC breed pages organized by group, plus guides, products, and tools.",
    body,
  };
}

export function notFound() {
  return {
    path: "/404",
    canonical: false,
    noindex: true,
    title: "Page Not Found | Dog Breeds & Needs",
    description: "The page you're looking for doesn't exist. Return home or browse all 205 AKC dog breeds.",
    body: h`<div class="wrap-sm page center not-found">
  ${icon("paw", "ic ic-404")}
  <p class="big-404">404</p>
  <h1 class="h2 mb-3">Page Not Found</h1>
  <p class="muted mb-8">Looks like this page has wandered off the trail. Don't worry, there are plenty of breeds to explore!</p>
  <div class="btn-row center"><a href="/" class="btn btn-primary btn-lg">${icon("home")} Go Home</a><a href="/breeds" class="btn btn-outline btn-lg">${icon("search")} Browse Breeds</a></div>
</div>`,
  };
}
