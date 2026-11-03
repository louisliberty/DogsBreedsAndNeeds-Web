import { h, raw } from "./html.mjs";
import { icon } from "./icons.mjs";
import { breedThumb, breedAlt, DOMAIN } from "./data.mjs";

export function breedImgTag(b, { w = 480, h: hh = 336, cls = "", lazy = true } = {}) {
  return h`<img src="${breedThumb(b.slug)}" alt="${breedAlt(b)}" width="${w}" height="${hh}"${lazy ? raw(' loading="lazy"') : ""} decoding="async"${cls ? raw(` class="${cls}"`) : ""}>`;
}

export function breedCard(b, { showEnergy = false, rank = true } = {}) {
  return h`<a href="/breeds/${b.slug}" class="card card-link breed-card">
  <div class="media-43">${breedImgTag(b)}</div>
  <div class="card-body">
    <div class="row-between"><h3 class="breed-card-title">${b.name}</h3>${rank ? h`<span class="badge badge-secondary">#${b.popularity}</span>` : ""}</div>
    <div class="badges"><span class="badge">${b.breedGroup}</span><span class="badge">${b.sizeCategory}</span>${showEnergy ? h`<span class="badge">${b.energyLevel}</span>` : ""}</div>
    <p class="muted small clamp-2">${b.temperamentSummary}</p>
  </div>
</a>`;
}

export function breadcrumb(items) {
  return h`<nav aria-label="Breadcrumb" class="breadcrumb"><ol>
  ${items.map((it, i) =>
    i === items.length - 1
      ? h`<li aria-current="page">${it.label}</li>`
      : h`<li><a href="${it.href}">${i === 0 ? icon("home", "ic ic-xs") : ""}${it.label}</a>${icon("chevronRight", "ic ic-xs sep")}</li>`,
  )}
</ol></nav>`;
}

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: it.href === "/" ? `${DOMAIN}/` : DOMAIN + it.href,
    })),
  };
}

export function pageHero(iconName, title, sub, { center = true } = {}) {
  return h`<div class="page-hero${center ? " center" : ""}">
  ${iconName ? icon(iconName, "ic ic-hero") : ""}
  <h1>${title}</h1>
  ${sub ? h`<p class="lead">${sub}</p>` : ""}
</div>`;
}

export const checkList = (items, kind = "good") =>
  h`<ul class="checklist ${kind}">${items.map((t) => h`<li>${icon(kind === "good" ? "checkCircle" : "xCircle", "ic")}<span>${t}</span></li>`)}</ul>`;
