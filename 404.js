// ===== Stampzer 404 — "De verloren kaarten" v2 =====
// External file on purpose: the site CSP (script-src 'self') blocks inline scripts.
// All continuous motion runs in one rAF loop with lerp smoothing and
// writes transforms directly (GPU-composited, no layout work).
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  var TOTAL = 8, on = 0, flipped = false;
  var card = document.getElementById('gcard');
  var tilt = document.getElementById('gtilt');
  var stamps = document.getElementById('gstamps');
  var prog = document.getElementById('gprog');
  var hint = document.getElementById('ghint');
  var glare = document.getElementById('gglare');
  var cur = document.getElementById('gcur');
  var spot = document.getElementById('gspot');
  var floatLayer = document.getElementById('gfloat');
  var shadow = document.querySelector('.g-shadow');
  if (!card || !stamps) return;

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  // Build stamp slots
  var dots = [];
  for (var i = 0; i < TOTAL; i++) {
    var d = document.createElement('span');
    d.className = 'g-dot';
    stamps.appendChild(d);
    dots.push(d);
  }

  // ---------- Smooth scene engine (fine pointers, motion allowed) ----------
  if (fine && !reduce) {
    var tx = window.innerWidth / 2, ty = window.innerHeight * .38; // target
    var sx = tx, sy = ty;                                          // smoothed
    var rx = 0, ry = 0, trx = 0, try_ = 0;                         // tilt
    var active = true;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      tx = window.innerWidth / 2; ty = window.innerHeight * .38;
    });

    document.addEventListener('visibilitychange', function () {
      active = !document.hidden;
      if (active) requestAnimationFrame(loop);
    });

    function loop() {
      if (!active) return;
      // lerp toward the target — the "buttery" feel
      sx += (tx - sx) * .11;
      sy += (ty - sy) * .11;

      // spotlight follows cursor (transform-only)
      spot.style.transform = 'translate3d(' + sx + 'px,' + sy + 'px,0)';

      // parallax vars scoped to the float layer only (few consumers)
      var px = (sx / window.innerWidth - .5) * -30;
      var py = (sy / window.innerHeight - .5) * -20;
      floatLayer.style.setProperty('--px', px.toFixed(2) + 'px');
      floatLayer.style.setProperty('--py', py.toFixed(2) + 'px');

      // card tilt + glare (skip when flipped)
      if (!flipped) {
        var r = card.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = (sx - cx) / (r.width / 2), dy = (sy - cy) / (r.height / 2);
        var near = Math.abs(dx) < 2.4 && Math.abs(dy) < 2.4;
        trx = near ? Math.max(-1, Math.min(1, dy)) * -8 : 0;
        try_ = near ? Math.max(-1, Math.min(1, dx)) * 10 : 0;
        rx += (trx - rx) * .14;
        ry += (try_ - ry) * .14;
        tilt.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
        if (glare) {
          glare.style.setProperty('--gx', ((sx - r.left) / r.width * 100).toFixed(1) + '%');
          glare.style.setProperty('--gy', ((sy - r.top) / r.height * 100).toFixed(1) + '%');
        }
      }

      // custom stamp cursor (raw position = responsive; scene lags behind = depth)
      if (cur) cur.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    card.addEventListener('mouseenter', function () { if (!flipped && cur) cur.classList.add('is-vis'); });
    card.addEventListener('mouseleave', function () { if (cur) cur.classList.remove('is-vis'); });
  }

  // ---------- Stamping ----------
  function spark(dot) {
    if (reduce) return;
    var r = dot.getBoundingClientRect();
    var colors = ['#29c700', '#f7f2e7', '#8ee85f'];
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('span');
      p.className = 'g-spark';
      p.style.left = (r.left + r.width / 2) + 'px';
      p.style.top = (r.top + r.height / 2) + 'px';
      p.style.background = colors[i % colors.length];
      var a = Math.random() * Math.PI * 2, dist = 26 + Math.random() * 30;
      p.style.setProperty('--sx', Math.cos(a) * dist + 'px');
      p.style.setProperty('--sy', Math.sin(a) * dist + 'px');
      document.body.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 650); })(p);
    }
  }

  function confetti() {
    if (reduce) return;
    var c = document.createElement('div');
    c.className = 'g-conf';
    var colors = ['#29c700', '#f3d8c9', '#f7f2e7', '#1f9b00', '#8ee85f'];
    for (var i = 0; i < 36; i++) {
      var p = document.createElement('i');
      p.style.left = (50 + (Math.random() * 50 - 25)) + '%';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dur', (1 + Math.random() * 1.1) + 's');
      p.style.setProperty('--del', (Math.random() * .25) + 's');
      p.style.setProperty('--dx', (Math.random() * 220 - 110) + 'px');
      p.style.setProperty('--r1', (Math.random() * 720 - 360) + 'deg');
      p.style.setProperty('--r2', (Math.random() * 540 - 270) + 'deg');
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(function () { c.remove(); }, 2800);
  }

  function press() {
    card.classList.add('is-press');
    if (shadow) shadow.style.setProperty('--sh', '.92');
    setTimeout(function () {
      card.classList.remove('is-press');
      if (shadow) shadow.style.setProperty('--sh', '1');
    }, 130);
  }

  function stamp() {
    if (flipped || on >= TOTAL) return;
    press();
    var dot = dots[on];
    dot.classList.add('is-on');
    dot.innerHTML = CHECK;
    spark(dot);
    if (cur) { cur.classList.add('is-hit'); setTimeout(function () { cur.classList.remove('is-hit'); }, 140); }
    on++;
    var left = TOTAL - on;
    if (left > 1) prog.innerHTML = 'Nog <b>' + left + '</b> stempels tot je beloning';
    else if (left === 1) prog.innerHTML = 'Nog maar <b>1</b> stempel&hellip;!';
    else {
      prog.innerHTML = 'Volle kaart! 🎉';
      if (hint) hint.textContent = 'Beloning ontgrendeld ✓';
      flipped = true;
      // settle tilt smoothly, then flip
      tilt.style.transition = 'transform .5s ease';
      tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
      if (cur) cur.classList.remove('is-vis');
      setTimeout(function () {
        card.style.setProperty('--fy', '180deg');
        card.style.cursor = 'default';
        card.setAttribute('aria-label', 'Volle kaart — beloning ontgrendeld');
        var back = card.querySelector('.g-back');
        if (back) back.removeAttribute('aria-hidden');
        confetti();
      }, reduce ? 60 : 460);
    }
  }

  card.addEventListener('click', function (e) {
    if (flipped) return; // reward links on the back must work normally
    e.preventDefault();
    stamp();
  });
  card.addEventListener('keydown', function (e) {
    if (flipped) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stamp(); }
  });
})();
