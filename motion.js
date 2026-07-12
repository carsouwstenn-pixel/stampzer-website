// ===== Stampzer — interactions & animations =====
// Works on every page; each block is guarded so it only runs where it applies.
// Reads settings from config.js (window.STAMPZER_CONFIG), which must load first.

// ---- Cookie consent + toestemmingsgestuurde Microsoft Clarity ----
// AVG/GDPR: analytische cookies (Clarity) laden pas NA expliciete toestemming.
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
          '<strong>Cookies 🍪</strong>' +
          '<p>We gebruiken alleen analytische cookies (Microsoft Clarity) om de site te verbeteren — en die plaatsen we pas met jouw toestemming. Meer weten? Lees ons <a href="/privacy/">privacybeleid</a>.</p>' +
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

  // Laat een link/knop met data-cookie-settings de voorkeuren opnieuw openen (toestemming intrekken kan altijd).
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

// ---- Custom stamp glyphs per business ----
const STAMP_ICONS = {
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15 9h2.4a2.4 2.4 0 0 1 0 4.8H15"/><path d="M7 3.4v1.6M11 3.4v1.6"/></svg>',
  scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.4" r="2.3"/><circle cx="6" cy="17.6" r="2.3"/><path d="M8 8l11.5 8M8 16L19.5 8"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6.6" r="2.7"/><circle cx="17.4" cy="10.5" r="2.7"/><circle cx="15.3" cy="16.9" r="2.7"/><circle cx="8.7" cy="16.9" r="2.7"/><circle cx="6.6" cy="10.5" r="2.7"/></svg>',
  cutlery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M16 3c-1.2 1.2-1.8 3-1.8 5.2 0 1.7.8 3 1.8 3s1.8-1.3 1.8-3c0-2.2-.6-4-1.8-5.2z"/><path d="M16 11.2V21"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5M6.5 12h11"/></svg>',
  bread: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5C4 9.6 7.2 8 12 8s8 1.6 8 4.5c0 .8-.7 1.5-1.5 1.5h-13C4.7 14 4 13.3 4 12.5Z"/><path d="M5 14v2.5A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5V14"/><path d="m9.5 10.6-.8 1.8M12.4 10.4l-.8 1.8M15.3 10.6l-.8 1.8"/></svg>',
};

// ---- Render stamp dots from data attributes ----
document.querySelectorAll('.pass__stamps').forEach((row) => {
  const on = parseInt(row.dataset.on || '0', 10);
  const total = parseInt(row.dataset.total || '10', 10);
  const glyph = STAMP_ICONS[row.dataset.icon];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    if (i < on) {
      dot.className = 'dot is-on';
      if (glyph) dot.innerHTML = glyph;
    } else {
      dot.className = 'dot';
    }
    row.appendChild(dot);
  }
});

// ---- Sticky nav: subtle elevation once scrolled ----
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---- Reveal on scroll ----
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
}

// ---- Hero phone: mouse-tracking 3D tilt ----
if (!reduce && window.matchMedia('(pointer: fine)').matches) {
  const visual = document.querySelector('.hero__visual');
  const phone = visual && visual.querySelector('.phone');
  if (visual && phone) {
    let raf = 0;
    visual.addEventListener('mousemove', (e) => {
      const r = visual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        phone.style.transform = `rotateY(${px * 13}deg) rotateX(${-py * 13}deg) scale(1.03)`;
      });
    });
    visual.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      phone.style.transform = '';
    });
  }
}

// ---- Waitlist form ----
// The destination is set in config.js (waitlistEndpoint). While it's null the
// form just confirms success locally — handy for previewing before you connect it.
const ENDPOINT = (window.STAMPZER_CONFIG && window.STAMPZER_CONFIG.waitlistEndpoint) || null;
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

document.querySelectorAll('.waitlist-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('.waitlist-form__input');
    const note = form.querySelector('.waitlist-form__note');
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      input.focus();
      input.style.borderColor = '#e0552d';
      if (note) note.textContent = 'Vul een geldig e-mailadres in.';
      return;
    }

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, page: location.pathname }),
        });
        if (!res.ok) throw new Error('bad response');
      } catch (err) {
        if (note) note.textContent = 'Er ging iets mis. Probeer het later opnieuw.';
        return;
      }
    }

    form.classList.add('is-done');
    if (note) note.remove();
    const msg = document.createElement('p');
    msg.className = 'waitlist-form__success';
    msg.setAttribute('role', 'status');
    msg.textContent = 'Je staat op de lijst! We mailen je zodra we live gaan.';
    form.appendChild(msg);
  });
});

// ===== Pilot-aanmelding (/pilot/) =====
const PILOT_ENDPOINT = (window.STAMPZER_CONFIG && window.STAMPZER_CONFIG.pilotEndpoint) || null;
document.querySelectorAll('.pilot-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailEl = form.querySelector('[name="email"]');
    const bizEl = form.querySelector('[name="business"]');
    const brancheEl = form.querySelector('[name="branche"]');
    const note = form.querySelector('.pilot-form__note');
    const email = (emailEl && emailEl.value || '').trim();
    const business = (bizEl && bizEl.value || '').trim();
    const branche = (brancheEl && brancheEl.value || '').trim();

    if (!business) { bizEl.focus(); bizEl.style.borderColor = '#e0552d'; if (note) note.textContent = 'Vul de naam van je zaak in.'; return; }
    if (!isValidEmail(email)) { emailEl.focus(); emailEl.style.borderColor = '#e0552d'; if (note) note.textContent = 'Vul een geldig e-mailadres in.'; return; }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Bezig…'; }

    if (PILOT_ENDPOINT) {
      try {
        const res = await fetch(PILOT_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, business, branche, page: location.pathname }),
        });
        if (!res.ok) throw new Error('bad response');
      } catch (err) {
        if (note) note.textContent = 'Er ging iets mis. Probeer het later opnieuw.';
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        return;
      }
    }

    form.classList.add('is-done');
    form.innerHTML = '<div class="pilot-form__success" role="status"><span class="pilot-form__check">✓</span><strong>Je pilotplek is gereserveerd!</strong><p>We nemen persoonlijk contact met je op &mdash; meestal binnen 1 werkdag. Kijk vast in je inbox (en spam).</p></div>';
  });
});

// ===== Subtiele count-up getallen ([data-count]) =====
(function () {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const run = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1100; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * ease(p)) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); run(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
})();

// ===== Dashboard mockup animations (only runs on dashboard.html) =====
// Numbers count up, donuts draw, the line chart traces itself, bars grow and
// heatmap cells pop in — each triggered once when its container scrolls into view.
(function () {
  const animeOn = document.documentElement.classList.contains('js-anim');
  const containers = document.querySelectorAll('.appwin, .dsection__media');
  if (!containers.length) return;

  // Reduced motion (or no js-anim): show everything at its final state, no motion.
  if (!animeOn) {
    containers.forEach((c) => c.classList.add('in'));
    return;
  }

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Prepare the line chart: dash it so it can "draw" via stroke-dashoffset.
  document.querySelectorAll('.chart-line').forEach((path) => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });

  function parseCount(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d.]+/);
    if (!match) return null;
    const numStr = match[0];
    const suffix = raw.endsWith('%') ? '%' : raw.endsWith('×') ? '×' : '';
    const thousands = /^\d{1,3}(\.\d{3})+$/.test(numStr);
    const target = thousands ? parseInt(numStr.replace(/\./g, ''), 10) : parseFloat(numStr);
    return { el, target, thousands, suffix };
  }

  function format(value, info) {
    const n = Math.round(value);
    const s = info.thousands ? n.toLocaleString('nl-NL') : String(n);
    return s + info.suffix;
  }

  function runCount(info, delay) {
    const duration = 1500;
    let begin = 0;
    info.el.textContent = format(0, info);
    function frame(now) {
      if (!begin) begin = now + delay;
      if (now < begin) { requestAnimationFrame(frame); return; }
      const p = Math.min((now - begin) / duration, 1);
      info.el.textContent = format(info.target * easeOutCubic(p), info);
      if (p < 1) requestAnimationFrame(frame);
      else info.el.textContent = format(info.target, info);
    }
    requestAnimationFrame(frame);
  }

  function activate(container) {
    container.classList.add('in');

    container.querySelectorAll('.kpi').forEach((el, i) => { el.style.transitionDelay = (i * 70) + 'ms'; });
    container.querySelectorAll('.panel').forEach((el, i) => { el.style.transitionDelay = (90 + i * 90) + 'ms'; });
    container.querySelectorAll('.heat-cell').forEach((el, i) => { el.style.transitionDelay = (300 + i * 20) + 'ms'; });
    container.querySelectorAll('.toplist__bar i, .prog__track i').forEach((el, i) => { el.style.transitionDelay = (220 + i * 70) + 'ms'; });
    container.querySelectorAll('.donut-arc').forEach((el) => { el.style.transitionDelay = '200ms'; });
    container.querySelectorAll('.chart-line').forEach((el) => { el.style.strokeDashoffset = '0'; });

    container.querySelectorAll('.kpi__num, .donut__center, .reward__stat b, .toplist__val').forEach((el, i) => {
      const info = parseCount(el);
      if (info) runCount(info, 150 + i * 70);
    });
  }

  if (!('IntersectionObserver' in window)) {
    containers.forEach(activate);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });

  // Activate anything already at/above the fold on load (covers reload mid-page
  // and animates the hero dashboard immediately); observe the rest.
  containers.forEach((c) => {
    if (c.getBoundingClientRect().top < window.innerHeight) activate(c);
    else io.observe(c);
  });
})();

// ===== ROI calculator (only runs on the homepage) =====
(function () {
  const root = document.getElementById('roi');
  if (!root) return;

  const byId = (id) => document.getElementById(id);
  const customers = byId('roi-customers');
  const aov = byId('roi-aov');
  const visits = byId('roi-visits');
  const segBtns = root.querySelectorAll('.roi__seg-btn');
  const elYear = byId('roi-year');
  const elMonth = byId('roi-month');
  const elOrders = byId('roi-orders');
  const elCustVal = byId('roi-customers-val');
  const elAovVal = byId('roi-aov-val');
  const elVisitsVal = byId('roi-visits-val');
  const barZonder = byId('roi-bar-zonder');
  const barMetBase = byId('roi-bar-met-base');
  const barMetExtra = byId('roi-bar-met-extra');
  let uplift = 0.20;

  const eur = (v) => '€' + Math.round(v).toLocaleString('nl-NL');
  const num = (v) => Math.round(v).toLocaleString('nl-NL');

  function animateTo(el, to, fmt) {
    if (reduce) { el.textContent = fmt(to); el._cur = to; return; }
    const from = typeof el._cur === 'number' ? el._cur : 0;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    if (el._raf) cancelAnimationFrame(el._raf);
    function frame(now) {
      const p = Math.min((now - start) / 500, 1);
      el.textContent = fmt(from + (to - from) * ease(p));
      if (p < 1) el._raf = requestAnimationFrame(frame);
      else { el.textContent = fmt(to); el._cur = to; }
    }
    el._raf = requestAnimationFrame(frame);
  }

  function pulse(el) {
    if (reduce) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  }

  function fillTrack(el) {
    const pct = (el.value - el.min) / (el.max - el.min) * 100;
    el.style.setProperty('--pct', pct + '%');
  }

  function update(animate) {
    fillTrack(customers); fillTrack(aov); fillTrack(visits);
    const N = +customers.value, A = +aov.value, V = +visits.value;
    elCustVal.textContent = num(N);
    elAovVal.textContent = '€' + num(A);
    elVisitsVal.textContent = V + '×';

    const extraVisits = N * V * uplift;
    const extraMonth = extraVisits * A;
    const extraYear = extraMonth * 12;

    if (animate) {
      animateTo(elYear, extraYear, eur); pulse(elYear);
      animateTo(elMonth, extraMonth, eur);
      animateTo(elOrders, extraVisits, num);
    } else {
      elYear.textContent = eur(extraYear); elYear._cur = extraYear;
      elMonth.textContent = eur(extraMonth); elMonth._cur = extraMonth;
      elOrders.textContent = num(extraVisits); elOrders._cur = extraVisits;
    }

    const baseShare = (1 / (1 + uplift)) * 100;
    const extraShare = (uplift / (1 + uplift)) * 100;
    barZonder.style.width = baseShare.toFixed(1) + '%';
    barMetBase.style.width = baseShare.toFixed(1) + '%';
    barMetExtra.style.width = extraShare.toFixed(1) + '%';
  }

  [customers, aov, visits].forEach((s) => s.addEventListener('input', () => update(true)));
  segBtns.forEach((btn) => btn.addEventListener('click', () => {
    segBtns.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    uplift = parseFloat(btn.dataset.uplift);
    update(true);
  }));

  update(false);

  // Count up from zero the first time the results scroll into view (a little reward).
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elYear._cur = 0; elMonth._cur = 0; elOrders._cur = 0;
          update(true);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    io.observe(root.querySelector('.roi__results'));
  }
})();
