/* Site-wide: theme toggle, mobile menu, "Get a Dog" dropdown, header breed search, copy-link buttons. */
(function () {
  var doc = document.documentElement;

  // Theme
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dark = doc.classList.toggle("dark");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    });
  });

  // Mobile menu
  var menuBtn = document.querySelector("[data-menu-btn]");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.hidden;
      mobileNav.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.classList.toggle("menu-open", open);
    });
  }

  // Dropdown
  document.querySelectorAll("[data-dropdown]").forEach(function (dd) {
    var btn = dd.querySelector("[data-dropdown-btn]");
    var menu = dd.querySelector("[data-dropdown-menu]");
    function set(open) { menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(menu.hidden); });
    document.addEventListener("click", function (e) { if (!dd.contains(e.target)) set(false); });
    dd.addEventListener("keydown", function (e) { if (e.key === "Escape") { set(false); btn.focus(); } });
  });

  // Copy link buttons
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-link]");
    if (!btn) return;
    var url = btn.getAttribute("data-url") || location.href;
    var label = btn.innerHTML;
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.innerHTML = label; }, 1800); }
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { done("Link copied!"); }, function () { done("Copy failed"); });
    } else {
      window.prompt("Copy this link:", url);
    }
  });

  // Breed search (header + mobile menu). Loads a ~15KB index the first time it's used.
  var index = null, loading = null;
  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch("/data/search-index.json").then(function (r) { return r.json(); }).then(function (d) { index = d; return d; });
    return loading;
  }
  window.DBN_loadSearchIndex = loadIndex;
  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  document.querySelectorAll("[data-search]").forEach(function (box) {
    var input = box.querySelector("[data-search-input]");
    var list = box.querySelector("[data-search-results]");
    var active = -1;
    function close() { list.hidden = true; active = -1; }
    function render() {
      var q = input.value.trim().toLowerCase();
      if (!q) return close();
      loadIndex().then(function (data) {
        var hits = data.filter(function (b) { return b[0].toLowerCase().indexOf(q) !== -1; })
          .sort(function (a, b) { return a[0].toLowerCase().indexOf(q) - b[0].toLowerCase().indexOf(q); })
          .slice(0, 8);
        var html = hits.length
          ? hits.map(function (b) {
              return '<a href="/breeds/' + b[1] + '"><img src="/breeds/thumbs/' + b[1] + '.webp" alt="" width="40" height="40" loading="lazy"><span>' + escapeHtml(b[0]) + "<small>" + b[2] + " Group · " + b[3] + "</small></span></a>";
            }).join("")
          : '<p class="muted">No breeds match "' + escapeHtml(input.value.trim()) + '".</p>';
        html += '<a class="see-all" href="/breeds?search=' + encodeURIComponent(input.value.trim()) + '">See all results for "' + escapeHtml(input.value.trim()) + '"</a>';
        list.innerHTML = html;
        list.hidden = false;
        active = -1;
      });
    }
    input.addEventListener("focus", loadIndex);
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      var links = list.querySelectorAll("a");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (list.hidden || !links.length) return;
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (active >= 0 && links[active]) location.href = links[active].href;
        else if (input.value.trim()) location.href = "/breeds?search=" + encodeURIComponent(input.value.trim());
      } else if (e.key === "Escape") { close(); }
    });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) close(); });
  });
})();
