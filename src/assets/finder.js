/* /find-a-breeder — pick a breed, see health tests, AKC Marketplace and rescue links. */
(function () {
  var root = document.querySelector("[data-finder]");
  if (!root) return;
  var input = root.querySelector("[data-finder-input]");
  var results = root.querySelector("[data-finder-results]");
  var detail = root.querySelector("[data-finder-detail]");
  var cfg = JSON.parse(root.querySelector("[data-finder-data]").textContent);
  var rescueSet = {};
  cfg.rescues.forEach(function (s) { rescueSet[s] = 1; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var slugify = function (n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); };
  var index = [];

  function show(b) {
    var name = b[0], slug = b[1], tests = cfg.tests[name];
    input.value = name;
    results.innerHTML = "";
    var rescue = rescueSet[slug]
      ? '<a class="btn btn-outline btn-sm" href="/rescue/' + slug + '">' + esc(name) + " Rescues</a>"
      : '<a class="btn btn-outline btn-sm" href="https://www.akc.org/dog-breeds/rescue-network/" target="_blank" rel="noopener">AKC Rescue Network</a>';
    var health = tests
      ? '<h3 class="strong small mb-2">Recommended Health Tests for ' + esc(name) + ' Breeders</h3><p class="muted xsmall mb-3">A responsible ' + esc(name) + ' breeder should have documentation for these tests on all breeding dogs:</p><ul class="checklist good">' +
        tests.map(function (t) { return '<li><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg><span>' + esc(t) + "</span></li>"; }).join("") + "</ul>"
      : '<h3 class="strong small mb-2">Health Testing for ' + esc(name) + '</h3><p class="muted small">Ask the breeder what health certifications they have for their breeding dogs. At minimum, look for OFA or PennHIP evaluations and breed-specific genetic tests. See the <a href="https://www.ofa.org/recommended-tests" target="_blank" rel="noopener">OFA recommended tests page</a> for breed-specific requirements.</p>';
    detail.innerHTML =
      '<div class="finder-detail mb-4"><img src="/breeds/thumbs/' + slug + '.webp" alt="' + esc(name) + '" width="96" height="96"><div class="grow">' +
      '<h3 class="h4 mb-2">' + esc(name) + '</h3><div class="badges mb-3"><span class="badge">' + b[2] + '</span><span class="badge">' + b[3] + "</span></div>" +
      '<div class="btn-row"><a class="btn btn-primary btn-sm" href="/breeds/' + slug + '">Full Breed Profile</a>' +
      '<a class="btn btn-outline btn-sm" href="https://marketplace.akc.org/puppies/' + slugify(name) + '" target="_blank" rel="noopener">AKC Marketplace</a>' + rescue + "</div></div></div>" +
      '<div class="tile mb-4">' + health + "</div>" +
      '<div class="center"><button type="button" class="btn btn-ghost btn-sm" data-finder-clear>Search a different breed</button></div>';
    detail.hidden = false;
  }

  function search() {
    var q = input.value.trim().toLowerCase();
    detail.hidden = true;
    if (!q) { results.innerHTML = ""; return; }
    window.DBN_loadSearchIndex().then(function (d) {
      index = d;
      var hits = d.filter(function (b) { return b[0].toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
      results.innerHTML = hits.length
        ? hits.map(function (b, i) { return '<button type="button" class="finder-result" data-i="' + d.indexOf(b) + '"><img src="/breeds/thumbs/' + b[1] + '.webp" alt="" width="48" height="48" loading="lazy"><span><span class="strong small">' + esc(b[0]) + '</span><br><span class="muted xsmall">' + b[2] + " Group</span></span></button>"; }).join("")
        : '<p class="muted small">No breeds match that name.</p>';
    });
  }

  input.addEventListener("input", search);
  results.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-i]");
    if (btn) show(index[+btn.getAttribute("data-i")]);
  });
  detail.addEventListener("click", function (e) {
    if (e.target.closest("[data-finder-clear]")) { input.value = ""; detail.hidden = true; input.focus(); }
  });
})();
