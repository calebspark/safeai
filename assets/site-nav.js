// SafeAI.sg site menu: marks the current page and runs the mobile toggle.
(function () {
  var bar = document.getElementById('snBar');
  if (!bar) return;
  var btn = document.getElementById('snToggle');
  var path = location.pathname.replace(/index\.html$/, '');
  bar.querySelectorAll('.sn-link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href.charAt(0) === '/' && href.indexOf('#') < 0 && href !== '/' && path.indexOf(href) === 0) {
      a.setAttribute('aria-current', 'page');
    }
  });
  function set(open) {
    bar.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { set(!bar.classList.contains('is-open')); });
  bar.addEventListener('click', function (e) { if (e.target.closest('.sn-link')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bar.classList.contains('is-open')) { set(false); btn.focus(); }
  });
})();
