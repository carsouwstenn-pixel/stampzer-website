// ===== Stampzer — "Voeg toe aan Wallet" animatie-engine (herbruikbaar) =====
// Extern bestand: de site-CSP (script-src 'self') blokkeert inline scripts.
// rAF-gedreven timeline met deterministische checkpoints, zodat fase-knoppen
// altijd naar een schone staat springen. Init: elk [data-wallet-anim]-element.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initWax(root) {
    var stage = root.querySelector('.wax');
    if (!stage) return;
    var stepsWrap = root.querySelector('[data-wax-steps]');
    var labels = stepsWrap ? Array.prototype.slice.call(stepsWrap.querySelectorAll('button')) : [];

    function setLabel(i) {
      labels.forEach(function (b, idx) { b.classList.toggle('is-active', idx === i); });
    }

    // klassen zetten mét lopende transities (normale playback)
    function apply(cls) { stage.className = 'wax ' + cls; }
    // klassen zetten zónder transities (harde sprong naar checkpoint)
    function jump(cls) {
      stage.className = 'wax no-anim ' + cls;
      void stage.offsetWidth; // reflow forceert de snap
      stage.classList.remove('no-anim');
    }

    if (reduce) {
      jump('s-fly is-land is-toast');
      setLabel(2);
      return;
    }

    // -------- de film: [tijd-ms, actie] --------
    var steps = [
      [0,    function () { apply('s-scan'); setLabel(0); }],
      [1900, function () { stage.classList.add('is-found'); }],
      [2750, function () { apply('s-sheet'); setLabel(1); }],
      [3150, function () { stage.classList.add('is-passin'); }],
      [4400, function () { stage.classList.add('is-tap'); }],
      [4600, function () { stage.classList.add('is-lift'); }],
      [4820, function () { apply('s-fly'); setLabel(2); }],
      [5480, function () { stage.classList.add('is-land'); }],
      [5900, function () { stage.classList.add('is-toast'); }],
      [8800, function () { stage.classList.add('is-cut'); }],
      [9200, function () { jump('s-scan is-cut'); setLabel(0); }],
      [9350, function () { stage.classList.remove('is-cut'); }]
    ];
    var TOTAL = 9500;
    var PHASE_T = [0, 2750, 4820]; // starttijden van de 3 fases

    var playing = false, raf = null, t0 = null, idx = 0;

    function tick(ts) {
      if (!playing) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      while (idx < steps.length && steps[idx][0] <= t) { steps[idx][1](); idx++; }
      if (t >= TOTAL) { t0 = ts; idx = 0; }
      raf = requestAnimationFrame(tick);
    }

    function startAt(time) {
      cancelAnimationFrame(raf);
      playing = true;
      t0 = null;
      // sla alle stappen t/m 'time' over; de checkpoint-jump zet de juiste staat
      idx = 0;
      while (idx < steps.length && steps[idx][0] <= time) idx++;
      raf = requestAnimationFrame(function (ts) { t0 = ts - time; tick(ts); });
    }

    function stop() { playing = false; cancelAnimationFrame(raf); }

    // fase-knoppen: spring naar een schone checkpoint en speel door
    var jumps = [
      function () { jump('s-scan'); setLabel(0); },
      function () { jump('s-sheet is-passin'); setLabel(1); },
      function () { jump('s-fly is-land is-toast'); setLabel(2); }
    ];
    labels.forEach(function (b, i) {
      b.addEventListener('click', function () {
        jumps[i]();
        startAt(PHASE_T[i] + (i === 1 ? 500 : i === 2 ? 1200 : 1));
      });
    });

    // alleen spelen als hij in beeld is
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !playing) { jump('s-scan'); startAt(0); }
          else if (!en.isIntersecting && playing) { stop(); }
        });
      }, { threshold: 0.3 });
      io.observe(stage);
    } else {
      jump('s-scan');
      startAt(0);
    }

    // pauzeer netjes bij tab-wissel
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); }
      else if (!playing && stage.getBoundingClientRect().top < window.innerHeight) { jump('s-scan'); startAt(0); }
    });
  }

  var roots = document.querySelectorAll('[data-wallet-anim]');
  Array.prototype.forEach.call(roots, initWax);
})();
