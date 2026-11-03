/* /blog — filter articles by text and category. */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-article]"));
  var input = document.querySelector("[data-blog-search]");
  var chips = document.querySelectorAll("[data-blog-cat]");
  var empty = document.querySelector("[data-blog-empty]");
  var cat = "All";
  function apply() {
    var q = input.value.trim().toLowerCase(), shown = 0;
    items.forEach(function (el) {
      var ok = (cat === "All" || el.dataset.category === cat) && (!q || el.dataset.text.indexOf(q) !== -1);
      el.hidden = !ok;
      if (ok) shown++;
    });
    empty.hidden = shown > 0;
  }
  input.addEventListener("input", apply);
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      cat = c.getAttribute("data-blog-cat");
      chips.forEach(function (x) { var on = x === c; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", String(on)); });
      apply();
    });
  });
})();
