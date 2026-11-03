/* Breed page — show the sticky action bar once the hero scrolls away. */
(function () {
  var bar = document.querySelector("[data-sticky]");
  var hero = document.querySelector("[data-hero]");
  if (!bar || !hero || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(function (entries) {
    bar.hidden = entries[0].isIntersecting;
  }, { rootMargin: "-64px 0px 0px 0px" }).observe(hero);
})();
