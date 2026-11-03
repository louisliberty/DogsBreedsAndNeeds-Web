/* Breed selector quiz + results. Answers live only in the URL; nothing is sent anywhere. */
(function () {
  var Q = [
    { id: "living", text: "What is your living situation?",
      label: { apartment: "live in an apartment", "small-yard": "have a small yard", "large-yard": "have a large yard", rural: "live on rural property" },
      options: [["Apartment or condo", "apartment"], ["House with small yard", "small-yard"], ["House with large yard", "large-yard"], ["Rural property", "rural"]] },
    { id: "activity", text: "How active is your lifestyle?",
      label: { low: "prefer low-energy dogs", moderate: "want a moderately active dog", high: "want a high-energy dog", "very-high": "want a workout partner" },
      options: [["Mostly sedentary, I prefer relaxing at home", "low"], ["Moderately active, daily walks and some outdoor time", "moderate"], ["Very active, I run, hike, or exercise regularly", "high"], ["Extremely active, I want a workout partner", "very-high"]] },
    { id: "size", text: "What size dog do you prefer?",
      label: { Small: "want a small dog", Medium: "want a medium dog", Large: "want a large dog", Giant: "want a giant dog", any: "have no size preference" },
      options: [["Small (under 25 lbs)", "Small"], ["Medium (25-60 lbs)", "Medium"], ["Large (60-100 lbs)", "Large"], ["Giant (100+ lbs)", "Giant"], ["No preference", "any"]] },
    { id: "kids", text: "Do you have children at home?",
      label: { young: "have young children", older: "have older children", teens: "have teenagers", none: "don't have children at home" },
      options: [["Yes, young children (under 6)", "young"], ["Yes, older children (6-12)", "older"], ["Teenagers", "teens"], ["No children", "none"]] },
    { id: "experience", text: "How experienced are you with dogs?",
      label: { beginner: "are a first-time dog owner", intermediate: "have some experience with dogs", advanced: "are a very experienced dog owner" },
      options: [["First-time dog owner", "beginner"], ["Some experience with dogs", "intermediate"], ["Very experienced dog owner", "advanced"]] },
    { id: "grooming", text: "How much time can you spend on grooming?",
      label: { low: "want a low-maintenance coat", moderate: "are fine with weekly brushing", high: "don't mind daily grooming" },
      options: [["Minimal, low-maintenance preferred", "low"], ["Weekly brushing is fine", "moderate"], ["I don't mind daily grooming", "high"]] },
    { id: "shedding", text: "How do you feel about shedding?",
      label: { low: "need a low-shedding or hypoallergenic breed", moderate: "tolerate some shedding", any: "don't mind shedding" },
      options: [["I need a low-shedding or hypoallergenic breed", "low"], ["Some shedding is okay", "moderate"], ["Shedding doesn't bother me", "any"]] },
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function readAnswers() {
    var p = new URLSearchParams(location.search), out = {};
    Q.forEach(function (q) {
      var v = p.get(q.id);
      if (v && q.options.some(function (o) { return o[1] === v; })) out[q.id] = v;
    });
    return out;
  }
  function toQuery(a) {
    var p = new URLSearchParams();
    Q.forEach(function (q) { if (a[q.id]) p.set(q.id, a[q.id]); });
    return p.toString();
  }
  var complete = function (a) { return Q.every(function (q) { return a[q.id]; }); };

  function score(b, a) {
    var s = 0, m = [];
    if (a.living === "apartment") { if (b.a) { s += 3; m.push(["living", "thrives in apartments"]); } else s -= 3; }
    if (a.living === "rural") s += 1;
    var em = { low: ["Low"], moderate: ["Low", "Moderate"], high: ["Moderate", "High"], "very-high": ["High", "Very High"] };
    if (a.activity && em[a.activity].indexOf(b.e) !== -1) { s += 3; m.push(["activity", "has a " + b.e.toLowerCase() + " energy level"]); }
    if (a.size && a.size !== "any" && b.z === a.size) { s += 3; m.push(["size", "is a " + b.z.toLowerCase() + " breed"]); }
    if (a.kids === "young") { if (b.ki >= 4) { s += 3; m.push(["kids", "is excellent with young children"]); } else if (b.ki <= 2) s -= 3; }
    if (a.kids === "older" && b.ki >= 3) { s += 2; m.push(["kids", "does well with older children"]); }
    if (a.experience === "beginner") { if (b.t === "Easy") { s += 3; m.push(["experience", "is easy to train for first-time owners"]); } else if (b.t === "Independent") s -= 3; }
    if (a.experience === "advanced") s += 1;
    if (a.grooming === "low" && (b.sh === "Low" || b.sh === "Moderate")) { s += 1; m.push(["grooming", "needs minimal grooming"]); }
    if (a.shedding === "low") { if (b.hy) { s += 3; m.push(["shedding", "is hypoallergenic"]); } if (b.sh === "High" || b.sh === "Very High") s -= 3; }
    return { score: s, matched: m };
  }

  function explain(matched, a, name) {
    if (!matched.length) return name + " is a balanced match across the rest of your answers, even though no single answer was a perfect fit.";
    var seen = {}, user = [];
    matched.forEach(function (m) {
      if (seen[m[0]]) return;
      seen[m[0]] = 1;
      var q = Q.filter(function (x) { return x.id === m[0]; })[0];
      user.push(q.label[a[m[0]]]);
    });
    var userClause = user.length === 1 ? "You said you " + user[0] : "You said you " + user.slice(0, -1).join(", ") + " and " + user[user.length - 1];
    var parts = matched.slice(0, 3).map(function (m) { return m[1]; });
    var breedClause = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
    return userClause + ", the " + name + " " + breedClause + ".";
  }

  /* ----- Quiz page ----- */
  var quizEl = document.querySelector("[data-quiz]");
  if (quizEl) {
    var answers = readAnswers();
    var refining = complete(answers);
    var cur = Math.max(0, Q.findIndex(function (q) { return !answers[q.id]; }));
    if (refining) cur = 0;
    var qEl = quizEl.querySelector("[data-quiz-question]"), opts = quizEl.querySelector("[data-quiz-options]");
    var back = quizEl.querySelector("[data-quiz-back]"), finish = quizEl.querySelector("[data-quiz-finish]");
    if (refining) quizEl.querySelector("[data-quiz-sub]").textContent = "Refine your answers, your previous picks are pre-filled.";
    var go = function () { location.href = "/dog-breed-selector/results?" + toQuery(answers); };

    var draw = function () {
      var q = Q[cur], pct = Math.round(((cur + 1) / Q.length) * 100);
      quizEl.querySelector("[data-quiz-step]").textContent = "Question " + (cur + 1) + " of " + Q.length;
      quizEl.querySelector("[data-quiz-pct]").textContent = pct + "%";
      quizEl.querySelector("[data-quiz-bar]").style.width = pct + "%";
      qEl.textContent = q.text;
      opts.innerHTML = q.options.map(function (o) {
        var on = answers[q.id] === o[1];
        return '<button type="button" class="btn quiz-option ' + (on ? "btn-primary" : "btn-outline") + '" data-value="' + o[1] + '" aria-pressed="' + on + '">' + esc(o[0]) + "</button>";
      }).join("");
      back.hidden = cur === 0;
      finish.hidden = !(refining && complete(answers));
    };
    opts.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-value]");
      if (!btn) return;
      answers[Q[cur].id] = btn.getAttribute("data-value");
      if (cur < Q.length - 1) { cur++; draw(); qEl.focus && qEl.setAttribute("tabindex", "-1"); qEl.focus(); }
      else go();
    });
    back.addEventListener("click", function () { if (cur > 0) { cur--; draw(); } });
    finish.addEventListener("click", go);
    draw();
  }

  /* ----- Results page ----- */
  var resEl = document.querySelector("[data-quiz-results]");
  if (resEl) {
    var a = readAnswers();
    if (!complete(a)) { var qs = toQuery(a); location.replace("/dog-breed-selector" + (qs ? "?" + qs : "")); return; }
    var query = toQuery(a);
    resEl.querySelector("[data-refine]").href = "/dog-breed-selector?" + query;
    var list = resEl.querySelector("[data-results-list]");
    list.innerHTML = '<p class="muted center">Finding your matches…</p>';
    fetch("/data/breeds.json").then(function (r) { return r.json(); }).then(function (data) {
      var results = data.map(function (b) { var r = score(b, a); return { b: b, score: r.score, matched: r.matched }; })
        .sort(function (x, y) { return y.score - x.score; }).slice(0, 5);
      resEl.querySelector("[data-results-title]").textContent = "Your Top " + results.length + " Breed Matches";
      resEl.querySelector("[data-compare-top]").href = "/compare?breeds=" + results.slice(0, 3).map(function (r) { return r.b.s; }).join(",");
      document.title = "Your Quiz Results: " + results.slice(0, 3).map(function (r) { return r.b.n; }).join(", ") + " & More | Dog Breeds & Needs";
      list.innerHTML = results.map(function (r, i) {
        var b = r.b;
        return '<article class="card card-pad result-card"><div class="result-rank">' + (i + 1) + '</div>' +
          '<img class="result-img" src="/breeds/thumbs/' + b.s + '.webp" alt="" width="96" height="72" loading="lazy">' +
          '<div class="grow"><h2 class="h3 mb-2"><a href="/breeds/' + b.s + '">' + esc(b.n) + "</a></h2>" +
          '<div class="badges mb-3"><span class="badge">' + b.g + '</span><span class="badge">' + b.z + '</span><span class="badge">' + b.e + " Energy</span>" + (b.hy ? '<span class="badge badge-secondary">Hypoallergenic</span>' : "") + "</div>" +
          '<p class="muted small mb-3 clamp-2">' + esc(b.tm) + "</p>" +
          '<p class="why"><strong class="text-primary">Why this match:</strong> ' + esc(explain(r.matched, a, b.n)) + "</p></div></article>";
      }).join("");
    }).catch(function () { list.innerHTML = '<p class="card card-pad">Couldn\'t load breed data. Please refresh the page.</p>'; });
  }
})();
