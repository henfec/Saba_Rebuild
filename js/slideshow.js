/* slideshow.js: slideshow with Previous, Next and a real Pause/Play button.
   Answers R5 / F5 (the live slideshow autoplays with no pause control, WCAG 2.2.2).
   Rules: autoplay never starts for users who prefer reduced motion, and it stops while the mouse is over
   the slideshow or a control has keyboard focus. Everything else is user-controlled. */
(function () {
  var root = document.querySelector('[data-slideshow]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
  var prev = root.querySelector('[data-prev]');
  var next = root.querySelector('[data-next]');
  var playPause = root.querySelector('[data-playpause]');
  var statusEl = root.querySelector('[data-slide-status]');
  var DELAY = 5000;                        // 5 seconds per slide
  var current = 0;                         // index of the slide being shown
  var timer = null;                        // autoplay handle, or null when paused
  var userPaused = false;                  // true once the user presses Pause

  // Show slide n (wraps around at both ends) and update the screen-reader text.
  function showSlide(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.hidden = i !== current; });
    statusEl.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length;
  }

  function startAutoplay() {
    if (timer) return;                     // never run two timers at once
    timer = setInterval(function () { showSlide(current + 1); }, DELAY);
  }

  function stopAutoplay() {
    clearInterval(timer);
    timer = null;
  }

  // Keep the button text and aria-pressed in step with whether autoplay is allowed to run.
  function updateButton() {
    playPause.textContent = userPaused ? 'Play' : 'Pause';
    playPause.setAttribute('aria-pressed', String(userPaused));
  }

  prev.addEventListener('click', function () { showSlide(current - 1); });
  next.addEventListener('click', function () { showSlide(current + 1); });

  playPause.addEventListener('click', function () {
    userPaused = !userPaused;
    if (userPaused) { stopAutoplay(); } else { startAutoplay(); }
    updateButton();
  });

  // Pause while the user is interacting (mouse over, or keyboard focus inside), resume afterwards
  // unless they pressed Pause themselves.
  function pauseTemporarily() { stopAutoplay(); }
  function resumeIfAllowed() { if (!userPaused) startAutoplay(); }
  root.addEventListener('mouseenter', pauseTemporarily);
  root.addEventListener('mouseleave', resumeIfAllowed);
  root.addEventListener('focusin', pauseTemporarily);
  root.addEventListener('focusout', resumeIfAllowed);

  // Start-up: respect "reduce motion" by starting paused.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  userPaused = reduceMotion;
  showSlide(0);
  updateButton();
  if (!userPaused) startAutoplay();
})();
