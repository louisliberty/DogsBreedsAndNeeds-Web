// Tiny HTML templating: h`...` escapes every interpolated value unless it is
// already safe HTML (the result of another h`` call or raw()).
class SafeHtml {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

export const raw = (s) => new SafeHtml(String(s));

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render(v) {
  if (v === null || v === undefined || v === false || v === true) return "";
  if (v instanceof SafeHtml) return v.s;
  if (Array.isArray(v)) return v.map(render).join("");
  return esc(v);
}

export function h(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) out += render(vals[i]) + strings[i + 1];
  return new SafeHtml(out);
}

export const toStr = (v) => render(v);
