/* form-validate.js: inline validation for the booking and contact forms.
   Answers R3 / F9 (the live form has no inline messages, placeholders instead of labels, and a success
   message that is not announced to screen readers).
   How it works: each field id maps to a "rule" function that returns an error message, or '' when valid.
   The submit handler runs every rule, shows errors beside the fields, and moves focus to the first problem. */
(function () {
  var form = document.querySelector('form[data-validate]');
  if (!form) return;

  var summary = document.getElementById('form-summary');   // "Please fix 2 problems" box (role="alert")
  var success = document.getElementById('form-success');   // confirmation (role="status")

  // ----- Rules: each returns an error message, or '' if the value is fine -----

  function checkName(value) {
    return value.trim() === '' ? 'Enter your name.' : '';
  }

  function checkEmail(value) {
    var v = value.trim();
    if (v === '') return 'Enter your email address.';
    // Checks the SHAPE only: something@something.something with no spaces.
    // It cannot prove the mailbox exists (a server would have to do that).
    var shape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return shape.test(v) ? '' : 'Enter an email address like name@example.com.';
  }

  function checkDate(value) {
    if (value === '') return 'Choose a date.';
    var chosen = new Date(value + 'T00:00:00');            // the date input gives YYYY-MM-DD
    var today = new Date();
    today.setHours(0, 0, 0, 0);                            // compare dates only, not times
    return chosen < today ? 'Choose today or a later date.' : '';
  }

  function checkTime(value) {
    return value === '' ? 'Choose a time.' : '';
  }

  function checkGuests(value) {
    if (value.trim() === '') return 'Enter the number of guests.';
    var n = Number(value);
    return (Number.isInteger(n) && n >= 1 && n <= 12) ? '' : 'Enter a whole number from 1 to 12.';
  }

  function checkMessage(value) {
    return value.trim() === '' ? 'Enter a message.' : '';
  }

  // Map each field id to its rule. Fields not listed here (phone, notes, subject) are optional.
  var rules = {
    name: checkName,
    email: checkEmail,
    date: checkDate,
    time: checkTime,
    guests: checkGuests,
    message: checkMessage
  };

  // ----- Showing errors -----

  // Show or clear the error under one field. aria-invalid lets screen readers announce the problem.
  function showError(field, message) {
    var errorEl = document.getElementById(field.id + '-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = message === '';
    field.setAttribute('aria-invalid', message === '' ? 'false' : 'true');
  }

  // Check one field. Returns true when valid.
  function validateField(field) {
    var rule = rules[field.id];
    if (!rule) return true;
    var message = rule(field.value);
    showError(field, message);
    return message === '';
  }

  // ----- Events -----

  form.addEventListener('submit', function (event) {
    event.preventDefault();               // no server in this prototype, so nothing is sent
    success.hidden = true;

    var firstBad = null;
    var badCount = 0;
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.id || !rules[field.id]) return;
      if (!validateField(field)) {
        badCount++;
        if (!firstBad) firstBad = field;
      }
    });

    if (badCount > 0) {
      summary.textContent = 'Please fix ' + badCount + (badCount === 1 ? ' problem' : ' problems') + ' below.';
      summary.hidden = false;
      firstBad.focus();                    // keyboard and screen-reader users land on the first error
      return;
    }

    summary.hidden = true;
    success.textContent = 'Thank you. Your request was received (prototype only, nothing was sent).';
    success.hidden = false;
    form.reset();
  });

  // Re-check a field when the user leaves it, so an error clears as soon as it is fixed.
  form.addEventListener('focusout', function (event) {
    if (event.target.id && rules[event.target.id]) validateField(event.target);
  });
})();
