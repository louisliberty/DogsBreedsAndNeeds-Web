import { h, raw } from "./html.mjs";
import { icon, spriteFor } from "./icons.mjs";
import { toStr } from "./html.mjs";
import { DOMAIN, SITE_NAME } from "./data.mjs";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/breeds", label: "Breeds" },
  { href: "/compare", label: "Compare" },
  { href: "/dog-breed-selector", label: "Quiz" },
];
const GET_A_DOG = [
  { href: "/find-a-breeder", label: "Find a Breeder" },
  { href: "/rescue", label: "Rescue" },
  { href: "/ethical-sourcing", label: "Ethical Sourcing" },
];
const TRAILING = [
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
];
const LEGAL = [
  { href: "/about", label: "About" },
  { href: "/products/how-we-choose", label: "How We Choose Products" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/sitemap", label: "Sitemap" },
];

const DEFAULT_OG = { url: `${DOMAIN}/og-default.jpg`, w: 1200, h: 630, alt: "Dog Breeds & Needs - Complete Guide to All 205 AKC Dog Breeds" };

const isActive = (href, path) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

function navLink(l, path, cls) {
  return h`<a href="${l.href}" class="${cls}${isActive(l.href, path) ? " is-active" : ""}"${isActive(l.href, path) ? raw(' aria-current="page"') : ""}>${l.label}</a>`;
}

function header(path) {
  const getADogActive = GET_A_DOG.some((l) => isActive(l.href, path));
  return h`<header class="site-header">
  <div class="wrap header-row">
    <a href="/" class="logo" aria-label="${SITE_NAME} home">${icon("paw", "ic logo-ic")}<span>Dog Breeds &amp; Needs</span></a>
    <div class="header-search" data-search>
      ${icon("search", "ic search-ic")}
      <input type="search" placeholder="Search breeds…" aria-label="Search breeds" autocomplete="off" data-search-input>
      <div class="search-results" data-search-results hidden></div>
    </div>
    <nav class="nav-desktop" aria-label="Main">
      ${PRIMARY.map((l) => navLink(l, path, "nav-link"))}
      <div class="dropdown" data-dropdown>
        <button type="button" class="nav-link${getADogActive ? " is-active" : ""}" aria-expanded="false" aria-haspopup="true" data-dropdown-btn>Get a Dog ${icon("chevronDown", "ic ic-sm")}</button>
        <div class="dropdown-menu" data-dropdown-menu hidden>
          ${GET_A_DOG.map((l) => navLink(l, path, "dropdown-item"))}
        </div>
      </div>
      ${TRAILING.map((l) => navLink(l, path, "nav-link"))}
    </nav>
    <div class="header-actions">
      <button type="button" class="btn btn-ghost btn-icon" aria-label="Toggle dark mode" data-theme-toggle>${icon("moon", "ic icon-moon")}${icon("sun", "ic icon-sun")}</button>
      <button type="button" class="btn btn-ghost btn-icon menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav" data-menu-btn>${icon("menu", "ic icon-menu")}${icon("x", "ic icon-close")}</button>
    </div>
  </div>
  <nav class="nav-mobile" id="mobile-nav" aria-label="Mobile" hidden>
    <div class="wrap">
      <div class="header-search mobile-search" data-search>
        ${icon("search", "ic search-ic")}
        <input type="search" placeholder="Search breeds…" aria-label="Search breeds" autocomplete="off" data-search-input>
        <div class="search-results" data-search-results hidden></div>
      </div>
      ${PRIMARY.map((l) => navLink(l, path, "mobile-link"))}
      <div class="mobile-heading">Get a Dog</div>
      ${GET_A_DOG.map((l) => navLink(l, path, "mobile-link"))}
      <div class="mobile-gap"></div>
      ${TRAILING.map((l) => navLink(l, path, "mobile-link"))}
    </div>
  </nav>
</header>`;
}

function footer() {
  const list = (links) => h`<ul>${links.map((l) => h`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>`;
  return h`<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo">${icon("paw", "ic logo-ic")}<span>Dog Breeds &amp; Needs</span></a>
        <p>Your complete guide to all 205 AKC-recognized dog breeds. Find the perfect companion for your lifestyle.</p>
      </div>
      <div><h2>Explore</h2>${list([...PRIMARY, ...TRAILING])}</div>
      <div><h2>Get a Dog</h2>${list(GET_A_DOG)}</div>
      <div><h2>Legal</h2>${list(LEGAL)}</div>
    </div>
    <div class="footer-bottom">DogBreedsAndNeeds.com - All 205 AKC-Recognized Dog Breeds</div>
  </div>
</footer>`;
}

/**
 * page: { path, title, description, canonical?, noindex?, ogType?, ogImage?, ogImageAlt?,
 *         jsonLd?: object[], preloadImage?, scripts?: string[], body }
 */
export function layout(page, assets) {
  const canonical = page.canonical === false ? null : page.canonical ?? (page.path === "/" ? DOMAIN : DOMAIN + page.path);
  const og = page.ogImage
    ? { url: page.ogImage.startsWith("http") ? page.ogImage : DOMAIN + page.ogImage, w: page.ogImageW, h: page.ogImageH, alt: page.ogImageAlt || page.title }
    : DEFAULT_OG;
  const jsonLd = (page.jsonLd || []).map(
    (block) => raw(`<script type="application/ld+json">${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`),
  );
  const scripts = ["site", ...(page.scripts || [])];
  const content = toStr(h`${header(page.path)}
<main id="main">
${page.body}
</main>
${footer()}`);

  return h`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow"}">
${canonical ? h`<link rel="canonical" href="${canonical}">` : ""}
<meta name="theme-color" content="#c45a11">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap">
<link rel="stylesheet" href="${assets.css}">
${page.preloadImage ? h`<link rel="preload" as="image" href="${page.preloadImage}" type="image/webp" fetchpriority="high">` : ""}
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
${canonical ? h`<meta property="og:url" content="${canonical}">` : ""}
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${og.url}">
${og.w ? h`<meta property="og:image:width" content="${og.w}">
<meta property="og:image:height" content="${og.h}">` : ""}
<meta property="og:image:alt" content="${og.alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${page.description}">
<meta name="twitter:image" content="${og.url}">
${jsonLd}
<script>try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}</script>
${scripts.map((s) => h`<script src="${assets.js[s]}" defer></script>`)}
</head>
<body>
${raw(spriteFor(content))}
<a href="#main" class="skip-link">Skip to content</a>
${raw(content)}
</body>
</html>
`;
}
