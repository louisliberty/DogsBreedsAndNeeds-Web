import { esc } from "./html.mjs";

// The small markdown subset the articles use: ## / ### headings, "- " lists,
// paragraphs, **bold**, *italic* and [links](url).
function inline(s) {
  let v = esc(s);
  v = v.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    const u = url.trim();
    const safe = /^(https?:|mailto:|\/|#)/i.test(u) ? u : "#";
    const ext = /^https?:/i.test(safe) && !safe.startsWith("https://dogbreedsandneeds.com");
    return `<a href="${safe}"${ext ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  v = v.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  v = v.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return v;
}

export function markdown(md) {
  const out = [];
  let para = [];
  let inList = false;
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const close = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of (md || "").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); close(); continue; }
    if (line.startsWith("### ")) { flush(); close(); out.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { flush(); close(); out.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (line.startsWith("- ")) { flush(); if (!inList) { out.push("<ul>"); inList = true; } out.push(`<li>${inline(line.slice(2))}</li>`); }
    else { close(); para.push(line); }
  }
  flush();
  close();
  return out.join("\n");
}
