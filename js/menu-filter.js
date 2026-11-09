/* menu-filter.js: filters the sample menu by category, dietary tags and a search word.
   Answers R1 / F8. Dishes are plain HTML, so with JS off the whole menu is still listed.
   JS only sets the "hidden" attribute on items that do not match. */
(function () {
  var list = document.querySelector('[data-menu-list]');
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll('.dish'));
  var catButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category] button'));
  var dietBoxes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-diet] input'));
  var search = document.getElementById('menu-search');
  var status = document.getElementById('menu-status');
  var empty = document.getElementById('menu-empty');
  var category = 'all';

  // Decide whether one dish matches the current filters
  function matches(item, wantedTags, word) {
    var itemTags = (item.getAttribute('data-tags') || '').split(' ');
    var inCategory = category === 'all' || item.getAttribute('data-category') === category;
    var hasAllTags = wantedTags.every(function (t) { return itemTags.indexOf(t) !== -1; });
    var inSearch = word === '' || item.textContent.toLowerCase().indexOf(word) !== -1;
    return inCategory && hasAllTags && inSearch;
  }

  // Apply all filters, then tell screen-reader users how many dishes are showing (WCAG 4.1.3)
  function apply() {
    var wantedTags = dietBoxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
    var word = search ? search.value.trim().toLowerCase() : '';
    var shown = 0;
    items.forEach(function (item) {
      var show = matches(item, wantedTags, word);
      item.hidden = !show;
      if (show) shown++;
    });
    status.textContent = shown + ' of ' + items.length + ' dishes shown';
    empty.hidden = shown !== 0;
  }

  catButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      category = btn.getAttribute('data-cat');
      catButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      apply();
    });
  });
  dietBoxes.forEach(function (b) { b.addEventListener('change', apply); });
  if (search) search.addEventListener('input', apply);

  apply();   // set the starting count
})();
