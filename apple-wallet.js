// ===== Apple Wallet page — interactive branche-demo =====
// External file on purpose: the site CSP (script-src 'self') blocks inline scripts.
// Reuses the global STAMP_ICONS from motion.js for the stamp glyphs.
(function () {
  var chips = document.getElementById('awchips');
  var pass = document.getElementById('awpass');
  if (!chips || !pass) return;

  var DEMOS = {
    koffiebar:   { theme: 'coffee',     icon: 'coffee',   biz: 'Koffiehoek',    sub: 'Koffiebar · Utrecht',      reward: '10ᵉ koffie gratis',       on: 7, total: 10, prog: 'Nog 3 kopjes tot je gratis koffie' },
    kapper:      { theme: 'barber',     icon: 'scissors', biz: 'Barber & Zn.',  sub: 'Barbershop · Amsterdam',   reward: '6ᵉ knipbeurt −50%',        on: 4, total: 6,  prog: 'Nog 2 knipbeurten tot je korting' },
    restaurant:  { theme: 'restaurant', icon: 'cutlery',  biz: 'Bistro Nonna',  sub: 'Restaurant · Amsterdam',   reward: '10ᵉ hoofdgerecht gratis',  on: 6, total: 10, prog: 'Nog 4 diners tot je gratis gerecht' },
    bakker:      { theme: 'bakker',     icon: 'bread',    biz: 'Bakkerij Vers', sub: 'Bakker · Haarlem',         reward: '10ᵉ brood gratis',         on: 6, total: 10, prog: 'Nog 4 broden tot je gratis brood' },
    nagelstudio: { theme: 'nails',      icon: 'flower',   biz: 'Studio Bloom',  sub: 'Nagelstudio · Rotterdam',  reward: 'Gratis behandeling',       on: 5, total: 8,  prog: 'Nog 3 behandelingen tot je beloning' },
    sportschool: { theme: 'gym',        icon: 'dumbbell', biz: 'Gym Forta',     sub: 'Sportschool · Eindhoven',  reward: 'Gratis maand na 30×',      on: 6, total: 10, prog: 'Nog 4 trainingen tot je beloning' },
    lunchroom:   { theme: 'lunch',      icon: 'cutlery',  biz: 'Lunchroom Vers', sub: 'Lunchroom · Den Haag',    reward: '8ᵉ lunch gratis',          on: 5, total: 8,  prog: 'Nog 3 lunches tot je gratis lunch' }
  };

  var ava = document.getElementById('awava');
  var biz = document.getElementById('awbiz');
  var sub = document.getElementById('awsub');
  var reward = document.getElementById('awreward');
  var stamps = document.getElementById('awstamps');
  var prog = document.getElementById('awprog');

  function renderStamps(on, total, iconKey) {
    stamps.innerHTML = '';
    var glyph = (typeof STAMP_ICONS !== 'undefined' && STAMP_ICONS[iconKey]) ? STAMP_ICONS[iconKey] : null;
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('span');
      if (i < on) {
        dot.className = 'dot is-on';
        if (glyph) dot.innerHTML = glyph;
      } else {
        dot.className = 'dot';
      }
      stamps.appendChild(dot);
    }
  }

  function show(key) {
    var d = DEMOS[key];
    if (!d) return;
    pass.className = 'pass pass--' + d.theme;
    ava.textContent = d.biz.charAt(0);
    biz.textContent = d.biz;
    sub.textContent = d.sub;
    reward.textContent = d.reward;
    prog.textContent = d.prog;
    renderStamps(d.on, d.total, d.icon);
    // subtle pop
    pass.classList.remove('is-pop');
    void pass.offsetWidth;
    pass.classList.add('is-pop');
    // chip state
    chips.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-demo') === key);
    });
  }

  chips.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-demo]');
    if (btn) show(btn.getAttribute('data-demo'));
  });
})();

// ===== "Voeg toe aan Wallet" — zelfspelende animatie-timeline =====
(function () {
  var awx = document.getElementById('awx');
  var stepsWrap = document.getElementById('awxsteps');
  if (!awx || !stepsWrap) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var labels = stepsWrap.querySelectorAll('button');

  function setLabel(i) {
    labels.forEach(function (b, idx) { b.classList.toggle('is-active', idx === i); });
  }

  // reduced motion: toon meteen het eindresultaat, geen film
  if (reduce) {
    awx.setAttribute('data-phase', 'stack');
    awx.classList.add('is-done');
    setLabel(2);
    return;
  }

  var timers = [];
  var running = false;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function phaseScan() {
    awx.className = 'awx';
    awx.setAttribute('data-phase', 'scan');
    setLabel(0);
    later(function () { awx.classList.add('is-found'); }, 1700);
    later(phaseSheet, 2500);
  }
  function phaseSheet() {
    awx.className = 'awx';
    awx.setAttribute('data-phase', 'sheet');
    setLabel(1);
    later(function () { awx.classList.add('is-add'); }, 1300);
    later(phaseStack, 2050);
  }
  function phaseStack() {
    awx.className = 'awx';
    awx.setAttribute('data-phase', 'stack');
    setLabel(2);
    later(function () { awx.classList.add('is-done'); }, 700);
    later(function () { if (running) phaseScan(); }, 3400);
  }

  var phases = [phaseScan, phaseSheet, phaseStack];

  // speel alleen als de animatie in beeld is
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !running) { running = true; phaseScan(); }
        else if (!en.isIntersecting && running) { running = false; clearTimers(); }
      });
    }, { threshold: 0.35 });
    io.observe(awx);
  } else {
    running = true;
    phaseScan();
  }

  // klik op een fase-knop = spring naar die fase
  labels.forEach(function (b, i) {
    b.addEventListener('click', function () {
      clearTimers();
      running = true;
      phases[i]();
    });
  });
})();
