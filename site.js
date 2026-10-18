// ===== Stampzer · op elke pagina (ook de homepage): mobiel menu + cookietoestemming =====
// Leest config.js (window.STAMPZER_CONFIG), dat eerder laadt.
// Menu en footer zelf komen uit tools/chrome.mjs.

// ---- Mobiel menu ----
(function () {
  var nav = document.getElementById('nav');
  var knop = nav && nav.querySelector('.nav__burger');
  if (!knop) return;

  function zet(open) {
    nav.classList.toggle('open', open);
    knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    knop.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  }

  knop.addEventListener('click', function () { zet(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('.nav__links a')) zet(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target)) zet(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { zet(false); knop.focus(); }
  });
  // Terug naar breed scherm: menu dicht, zodat het niet open blijft staan.
  var breed = window.matchMedia('(min-width: 921px)');
  var opBreed = function () { if (breed.matches) zet(false); };
  if (breed.addEventListener) breed.addEventListener('change', opBreed);
  else if (breed.addListener) breed.addListener(opBreed);
})();

// ---- Cookietoestemming + Microsoft Clarity ----
// AVG: analytische cookies (Clarity) laden pas NA expliciete toestemming.
(function () {
  var KEY = 'stampzer_consent';

  function loadClarity() {
    var id = window.STAMPZER_CONFIG && window.STAMPZER_CONFIG.clarityProjectId;
    if (!id || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function showBanner() {
    if (document.querySelector('.cookie')) return;
    var bar = document.createElement('div');
    bar.className = 'cookie';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookievoorkeuren');
    bar.innerHTML =
      '<div class="cookie__inner">' +
        '<div class="cookie__text">' +
          '<strong>Cookies</strong>' +
          '<p>We gebruiken alleen analytische cookies (Microsoft Clarity) om de site te verbeteren. Die plaatsen we pas als je daar toestemming voor geeft. Meer weten? Lees ons <a href="/privacy/">privacybeleid</a>.</p>' +
        '</div>' +
        '<div class="cookie__actions">' +
          '<button type="button" class="cookie__btn cookie__btn--deny" data-cookie="deny">Weigeren</button>' +
          '<button type="button" class="cookie__btn cookie__btn--accept" data-cookie="accept">Accepteren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('is-in'); });
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      var accept = btn.getAttribute('data-cookie') === 'accept';
      setConsent(accept ? 'granted' : 'denied');
      if (accept) loadClarity();
      bar.classList.remove('is-in');
      setTimeout(function () { bar.remove(); }, 450);
    });
  }

  // "Cookie-instellingen" in de footer (data-cookie-settings) opent de keuze opnieuw: intrekken kan altijd.
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    showBanner();
  });

  var consent = getConsent();
  if (consent === 'granted') loadClarity();
  else if (consent !== 'denied') showBanner();
})();
