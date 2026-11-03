/* /compare — pick 2-3 breeds, build the side-by-side table. Data: /data/breeds.json */
(function () {
  var MAX = 3, MIN = 2;
  var slotsEl = document.querySelectorAll("[data-slot]");
  var result = document.querySelector("[data-compare-result]");
  var intro = document.querySelector("[data-compare-intro]");
  var table = document.querySelector("[data-compare-table]");
  var winnersEl = document.querySelector("[data-compare-winners]");
  var countEl = document.querySelector("[data-compare-count]");
  var baseTitle = document.title;
  var GROUPS = ["Sporting", "Hound", "Working", "Terrier", "Toy", "Non-Sporting", "Herding"];

  var energy = { "Very High": 5, High: 4, Moderate: 3, Low: 1 };
  var train = { Easy: 5, Moderate: 3, Challenging: 2, Independent: 2 };
  var bark = { Rare: 1, Occasional: 2, Frequent: 4, Vocal: 5 };
  var shed = { Low: 1, Moderate: 2, High: 4, "Very High": 5 };
  var size = { Toy: 1, Small: 2, Medium: 3, Large: 4, Giant: 5 };
  var sc = function (map, v) { return map[v] == null ? 3 : map[v]; };
  var minutes = function (lvl) { return { "Very High": 120, High: 90, Moderate: 60, Low: 30 }[lvl] || 60; };
  function mid(s) {
    var m = String(s).match(/(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/);
    if (m) return (parseFloat(m[1]) + parseFloat(m[2])) / 2;
    m = String(s).match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  }
  function groomScore(v) {
    var s = String(v).toLowerCase();
    if (s.indexOf("daily") !== -1) return 5;
    if (/multiple|3-4|3 to 4/.test(s)) return 4;
    if (/biweekly|bi-weekly|every other/.test(s)) return 2;
    if (/weekly|twice/.test(s)) return 3;
    if (/monthly|minimal|low/.test(s)) return 1;
    return 3;
  }
  var friend = function (b) { return (b.st + b.ki + b.d) / 3; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var ROWS = [
    ["Size", function (b) { return b.z; }, function (b) { return sc(size, b.z); }, false],
    ["Weight", function (b) { return b.w; }, function (b) { return mid(b.w); }, false],
    ["Height", function (b) { return b.h; }, function (b) { return mid(b.h); }, false],
    ["Lifespan", function (b) { return b.l; }, function (b) { return mid(b.l); }, true],
    ["Energy", function (b) { return b.e; }, function (b) { return sc(energy, b.e); }, false],
    ["Trainability", function (b) { return b.t; }, function (b) { return sc(train, b.t); }, true],
    ["Barking", function (b) { return b.k; }, function (b) { return sc(bark, b.k); }, false],
    ["Friendliness", function (b) { return friend(b).toFixed(1) + "/5"; }, friend, true],
    ["Good with strangers", function (b) { return b.st + "/5"; }, function (b) { return b.st; }, true],
    ["Good with kids", function (b) { return b.ki + "/5"; }, function (b) { return b.ki; }, true],
    ["Good with other dogs", function (b) { return b.d + "/5"; }, function (b) { return b.d; }, true],
    ["Apartment friendly", function (b) { return b.a ? "Yes" : "No"; }, function (b) { return b.a ? 1 : 0; }, true],
    ["Grooming", function (b) { return b.gr; }, function (b) { return groomScore(b.gr); }, false],
    ["Shedding", function (b) { return b.sh; }, function (b) { return sc(shed, b.sh); }, false],
    ["Hypoallergenic", function (b) { return b.hy ? "Yes" : "No"; }, function (b) { return b.hy ? 1 : 0; }, true],
    ["Exercise (min/day)", function (b) { return "~" + minutes(b.e) + " min"; }, function (b) { return minutes(b.e); }, false],
    ["Common health issues", function (b) { return b.hi; }],
    ["Ideal for", function (b) { return b.io || "-"; }],
    ["Not good for", function (b) { return b.ng || "-"; }],
  ];

  function tone(val, all, highIsGood) {
    if (all.every(function (v) { return v === all[0]; })) return "";
    var best = highIsGood ? Math.max.apply(null, all) : Math.min.apply(null, all);
    var worst = highIsGood ? Math.min.apply(null, all) : Math.max.apply(null, all);
    return val === best ? "tone-good" : val === worst ? "tone-warn" : "tone-ok";
  }

  var data, bySlug = {}, slots = [];

  function readUrl() {
    var raw = new URLSearchParams(location.search).get("breeds") || "";
    var seen = {};
    return raw.split(",").map(function (s) { return s.trim(); })
      .filter(function (s) { if (!s || seen[s] || !bySlug[s]) return false; seen[s] = 1; return true; })
      .slice(0, MAX);
  }

  function writeUrl() {
    var filled = slots.filter(Boolean);
    history.replaceState(null, "", filled.length ? "/compare?breeds=" + filled.join(",") : "/compare");
  }

  function optionsHtml(current, taken) {
    var html = '<option value="">' + (current ? "Change breed…" : "Add a breed…") + "</option>";
    GROUPS.forEach(function (g) {
      html += '<optgroup label="' + g + '">';
      data.forEach(function (b) {
        if (b.g !== g || (taken.indexOf(b.s) !== -1 && b.s !== current)) return;
        html += '<option value="' + b.s + '"' + (b.s === current ? " selected" : "") + ">" + esc(b.n) + "</option>";
      });
      html += "</optgroup>";
    });
    return html;
  }

  function renderSlots() {
    var filled = slots.filter(Boolean);
    slotsEl.forEach(function (el, i) {
      var slug = slots[i], b = slug && bySlug[slug];
      var taken = slots.filter(function (s, j) { return s && j !== i; });
      var html = "";
      if (b) {
        if (filled.length > MIN) html += '<button type="button" class="btn btn-ghost btn-icon btn-sm slot-remove" data-remove="' + i + '" aria-label="Remove ' + esc(b.n) + '">✕</button>';
        html += '<a href="/breeds/' + b.s + '"><img src="/breeds/thumbs/' + b.s + '.webp" alt="' + esc(b.n) + '" width="128" height="128"></a>';
        html += '<a href="/breeds/' + b.s + '" class="strong">' + esc(b.n) + "</a>";
      }
      html += '<label class="sr-only" for="slot-' + i + '">Breed ' + (i + 1) + '</label><select id="slot-' + i + '" class="input" data-select="' + i + '">' + optionsHtml(slug, taken) + "</select>";
      el.innerHTML = html;
    });
  }

  function renderTable(sel) {
    var head = '<thead><tr><th scope="col">Trait</th>' + sel.map(function (b) {
      return '<th scope="col"><a class="head" href="/breeds/' + b.s + '"><img src="/breeds/thumbs/' + b.s + '.webp" alt="" width="40" height="40"><span>' + esc(b.n) + "<small>" + b.g + " · #" + b.p + "</small></span></a></th>";
    }).join("") + "</tr></thead>";
    var body = "<tbody>" + ROWS.map(function (r) {
      var vals = r[2] ? sel.map(r[2]) : null;
      return '<tr><th scope="row">' + r[0] + "</th>" + sel.map(function (b, i) {
        var t = vals ? tone(vals[i], vals, r[3]) : null;
        return "<td>" + (vals ? '<span class="tone ' + t + '">' + esc(r[1](b)) + "</span>" : '<span class="tone-text">' + esc(r[1](b)) + "</span>") + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody>";
    table.innerHTML = head + body;
  }

  function renderWinners(sel) {
    var pick = function (fn, dir) { return sel.slice().sort(function (a, b) { return dir * (fn(b) - fn(a)); })[0]; };
    var w = [];
    var kids = pick(function (b) { return b.ki; }, 1); w.push(["Best with kids", kids, kids.ki + "/5 with children"]);
    var tr = pick(function (b) { return sc(train, b.t); }, 1); w.push(["Easiest to train", tr, tr.t]);
    var ex = pick(function (b) { return minutes(b.e); }, -1); w.push(["Lowest exercise needs", ex, "~" + minutes(ex.e) + " min/day"]);
    var q = pick(function (b) { return sc(bark, b.k); }, -1); w.push(["Quietest", q, q.k + " barker"]);
    var ls = pick(function (b) { return sc(shed, b.sh); }, -1); w.push(["Lowest shedding", ls, ls.sh + " shedding"]);
    var apt = sel.filter(function (b) { return b.a; })[0]; if (apt) w.push(["Best for apartments", apt, "Apartment suitable"]);
    var lg = pick(function (b) { return mid(b.l); }, 1); w.push(["Longest lifespan", lg, lg.l]);
    winnersEl.innerHTML = w.map(function (x) {
      return '<div class="winner"><div><div class="muted xsmall">' + x[0] + '</div><a class="strong" href="/breeds/' + x[1].s + '">' + esc(x[1].n) + '</a></div><span class="badge badge-secondary">' + esc(x[2]) + "</span></div>";
    }).join("");
  }

  function render() {
    renderSlots();
    var sel = slots.filter(Boolean).map(function (s) { return bySlug[s]; });
    var ready = sel.length >= MIN;
    result.hidden = !ready;
    intro.hidden = sel.length > 0;
    if (ready) {
      countEl.textContent = "Comparing " + sel.length + " breeds";
      renderTable(sel);
      renderWinners(sel);
      document.title = sel.map(function (b) { return b.n; }).join(" vs ") + " - Side-by-Side Breed Comparison | Dog Breeds & Needs";
    } else {
      document.title = baseTitle;
    }
  }

  document.querySelector("[data-compare-slots]").addEventListener("change", function (e) {
    var i = e.target.getAttribute("data-select");
    if (i === null || !e.target.value) return;
    slots[+i] = e.target.value;
    writeUrl(); render();
  });
  document.querySelector("[data-compare-slots]").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-remove]");
    if (!btn) return;
    slots.splice(+btn.getAttribute("data-remove"), 1);
    while (slots.length < MAX) slots.push(null);
    writeUrl(); render();
  });

  fetch("/data/breeds.json").then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    d.forEach(function (b) { bySlug[b.s] = b; });
    slots = readUrl();
    while (slots.length < MAX) slots.push(null);
    render();
  }).catch(function () {
    slotsEl[0].innerHTML = '<p class="small">Couldn\'t load the breed list. Check your connection and <a href="">try again</a>.</p>';
  });
})();
