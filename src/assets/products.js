/* /products — category filter. */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-product-grid] > [data-category]"));
  var chips = document.querySelectorAll("[data-product-cat]");
  var empty = document.querySelector("[data-product-empty]");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var cat = c.getAttribute("data-product-cat"), shown = 0;
      chips.forEach(function (x) { var on = x === c; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (el) { el.hidden = cat !== "All" && el.dataset.category !== cat; if (!el.hidden) shown++; });
      empty.hidden = shown > 0;
    });
  });
})();
