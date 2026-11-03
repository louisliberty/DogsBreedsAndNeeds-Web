/* /breeds — search, filters, and "pick up to 3 to compare". All 205 cards are already in the HTML. */
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-breed-grid] > article"));
  var search = document.querySelector("[data-breed-search]");
  var count = document.querySelector("[data-breed-count]");
  var empty = document.querySelector("[data-breed-empty]");
  var panel = document.getElementById("filters");
  var toggle = document.querySelector("[data-filters-toggle]");
  var state = { group: "", size: "", energy: "", rescue: false, q: "" };

  var params = new URLSearchParams(location.search);
  state.q = params.get("search") || "";
  state.group = params.get("group") || "";
  search.value = state.q;

  function setChips(filter) {
    panel.querySelectorAll('[data-filter="' + filter + '"]').forEach(function (c) {
      var on = c.getAttribute("data-value") === state[filter];
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", String(on));
    });
  }
  function openPanel(open) { panel.hidden = !open; toggle.setAttribute("aria-expanded", String(open)); }

  function apply() {
    var q = state.q.trim().toLowerCase(), shown = 0;
    cards.forEach(function (c) {
      var ok = (!q || c.dataset.name.indexOf(q) !== -1) &&
        (!state.group || c.dataset.group === state.group) &&
        (!state.size || c.dataset.size === state.size) &&
        (!state.energy || c.dataset.energy === state.energy) &&
        (!state.rescue || c.dataset.rescue === "1");
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = "Showing " + shown + " breed" + (shown === 1 ? "" : "s");
    empty.hidden = shown !== 0;
    var url = new URL(location.href);
    state.q ? url.searchParams.set("search", state.q) : url.searchParams.delete("search");
    state.group ? url.searchParams.set("group", state.group) : url.searchParams.delete("group");
    history.replaceState(null, "", url.pathname + url.search);
  }

  search.addEventListener("input", function () { state.q = search.value; apply(); });
  toggle.addEventListener("click", function () { openPanel(panel.hidden); });
  panel.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-filter]");
    if (chip) {
      var f = chip.getAttribute("data-filter"), v = chip.getAttribute("data-value");
      state[f] = state[f] === v ? "" : v;
      setChips(f);
      return apply();
    }
    var t = e.target.closest("[data-toggle]");
    if (t) {
      state.rescue = !state.rescue;
      t.classList.toggle("is-active", state.rescue);
      t.setAttribute("aria-pressed", String(state.rescue));
      apply();
    }
  });

  if (state.group) { setChips("group"); openPanel(true); }
  if (state.q || state.group) apply();

  // Compare selection
  var bar = document.querySelector("[data-compare-bar]");
  var barCount = document.querySelector("[data-compare-count]");
  var go = document.querySelector("[data-compare-go]");
  var picked = [];
  function syncCompare() {
    cards.forEach(function (c) {
      var box = c.querySelector("[data-compare]");
      var on = picked.indexOf(box.value) !== -1;
      box.checked = on;
      box.disabled = !on && picked.length >= 3;
      c.classList.toggle("is-selected", on);
      c.classList.toggle("is-disabled", box.disabled);
    });
    bar.hidden = picked.length === 0;
    barCount.textContent = picked.length + "/3 selected";
    go.href = "/compare?breeds=" + picked.join(",");
    go.setAttribute("aria-disabled", String(picked.length < 2));
  }
  document.querySelector("[data-breed-grid]").addEventListener("change", function (e) {
    if (!e.target.matches("[data-compare]")) return;
    var s = e.target.value, i = picked.indexOf(s);
    if (i === -1 && picked.length < 3) picked.push(s); else if (i !== -1) picked.splice(i, 1);
    syncCompare();
  });
  document.querySelector("[data-compare-clear]").addEventListener("click", function () { picked = []; syncCompare(); });
})();
