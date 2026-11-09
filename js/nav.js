/* nav.js: mobile navigation toggle.
   Answers: responsive nav requirement. The nav is a normal list of links, so it still works without JS.
   JS only collapses it on small screens and updates aria-expanded so screen readers know its state. */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  var wide = window.matchMedia('(min-width: 40em)');   // matches the breakpoint in layout.css

  // Open or close the menu and keep ARIA and the label in step
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.setAttribute('data-collapsed', String(!open));
  }

  setOpen(false);                                       // start closed on phones
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes the menu and returns focus to the button (keyboard support)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && !wide.matches) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
