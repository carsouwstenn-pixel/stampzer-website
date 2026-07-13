// ===== Stampzer 404 — "De verloren kaarten" v3 =====
// External file on purpose: the site CSP (script-src 'self') blocks inline scripts.
// Interaction happens on an untransformed hit layer (#ghit) so every click lands,
// whatever the 3D tilt; the engine adds directional recoil impulses on stamp.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  var TOTAL = 8, on = 0, flipped = false;
  var card = document.getElementById('gcard');
  var tilt = document.getElementById('gtilt');
  var hit = document.getElementById('ghit');
  var stamps = document.getElementById('gstamps');
  var prog = document.getElementById('gprog');
  var hint = document.getElementById('ghint');
  var glare = document.getElementById('gglare');
  var cur = document.getElementById('gcur');
  var spot = document.getElementById('gspot');
  var floatLayer = document.getElementById('gfloat');
  var shadow = document.querySelector('.g-shadow');
  if (!card || !stamps || !hit) return;

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  // Build stamp slots
  var dots = [];
  for (var i = 0; i < TOTAL; i++) {
    var d = document.createElement('span');
    d.className = 'g-dot';
    stamps.appendChild(d);
    dots.push(d);
  }

  // recoil impulses (consumed by the engine loop)
  var irx = 0, iry = 0;
  var engineOn = false;

  // ---------- Smooth scene engine (fine pointers, motion allowed) ----------
  if (fine && !reduce) {
    engineOn = true;
    document.documentElement.classList.add('g-eng'); // enables custom cursor + cursor:none

    var tx = window.innerWidth / 2, ty = window.innerHeight * .38;
    var sx = tx, sy = ty;
    var rx = 0, ry = 0;
    var active = true;

    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', function () { tx = window.innerWidth / 2; ty = window.innerHeight * .38; });
    document.addEventListener('visibilitychange', function () {
      active = !document.hidden;
      if (active) requestAnimationFrame(loop);
    });

    var loop = function () {
      if (!active) return;
      sx += (tx - sx) * .11;
      sy += (ty - sy) * .11;

      spot.style.transform = 'translate3d(' + sx + 'px,' + sy + 'px,0)';

      var px = (sx / window.innerWidth - .5) * -30;
      var py = (sy / window.innerHeight - .5) * -20;
      floatLayer.style.setProperty('--px', px.toFixed(2) + 'px');
      floatLayer.style.setProperty('--py', py.toFixed(2) + 'px');

      if (!flipped) {
        var r = card.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = (sx - cx) / (r.width / 2), dy = (sy - cy) / (r.height / 2);
        var near = Math.abs(dx) < 2.4 && Math.abs(dy) < 2.4;
        var trx = near ? Math.max(-1, Math.min(1, dy)) * -8 : 0;
        var try_ = near ? Math.max(-1, Math.min(1, dx)) * 10 : 0;
        rx += (trx - rx) * .14;
        ry += (try_ - ry) * .14;
        irx *= .84; iry *= .84; // recoil decay
        tilt.style.transform = 'rotateX(' + (rx + irx).toFixed(2) + 'deg) rotateY(' + (ry + iry).toFixed(2) + 'deg)';
        if (glare) {
          glare.style.setProperty('--gx', ((sx - r.left) / r.width * 100).toFixed(1) + '%');
          glare.style.setProperty('--gy', ((sy - r.top) / r.height * 100).toFixed(1) + '%');
        }
      }

      if (cur) cur.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // custom cursor visibility + slam (only meaningful when engine runs)
  if (engineOn && cur) {
    hit.addEventListener('mouseenter', function () { if (!flipped) cur.classList.add('is-vis'); });
    hit.addEventListener('mouseleave', function () { cur.classList.remove('is-vis'); cur.classList.remove('is-down'); });
    hit.addEventListener('mousedown', function () { if (!flipped) cur.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });
  }

  // ---------- Effects ----------
  function splat(x, y) {
    if (reduce) return;
    var s = document.createElement('span');
    s.className = 'g-splat';
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.innerHTML = '<i></i>';
    var colors = ['#29c700', '#f7f2e7', '#8ee85f'];
    for (var i = 0; i < 8; i++) {
      var p = document.createElement('span');
      p.className = 'g-spark';
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.background = colors[i % colors.length];
      var a = Math.random() * Math.PI * 2, dist = 24 + Math.random() * 34;
      p.style.setProperty('--sx', Math.cos(a) * dist + 'px');
      p.style.setProperty('--sy', Math.sin(a) * dist + 'px');
      document.body.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 650); })(p);
    }
    var plus = document.createElement('span');
    plus.className = 'g-plus';
    plus.textContent = '+1';
    plus.style.left = x + 'px'; plus.style.top = (y - 14) + 'px';
    document.body.appendChild(s);
    document.body.appendChild(plus);
    setTimeout(function () { s.remove(); plus.remove(); }, 800);
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

  // ---------- Stamping ----------
  function stamp(x, y) {
    if (flipped || on >= TOTAL) return;

    var r = card.getBoundingClientRect();
    if (!x && !y) { x = r.left + r.width / 2; y = r.top + r.height / 2; } // keyboard

    press();
    splat(x, y);
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) {} }

    // directional 3D recoil: the card gives way where you hit it
    if (engineOn) {
      var dx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (r.width / 2)));
      var dy = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (r.height / 2)));
      iry += dx * 9;
      irx += dy * -9;
    } else if (!reduce) {
      tilt.classList.remove('g-kick');
      void tilt.offsetWidth; // restart animation
      tilt.classList.add('g-kick');
    }

    var dot = dots[on];
    dot.classList.add('is-on');
    dot.innerHTML = CHECK;
    on++;

    var left = TOTAL - on;
    if (left > 1) prog.innerHTML = 'Nog <b>' + left + '</b> stempels tot je beloning';
    else if (left === 1) prog.innerHTML = 'Nog maar <b>1</b> stempel&hellip;!';
    else {
      prog.innerHTML = 'Volle kaart! 🎉';
      if (hint) hint.textContent = 'Beloning ontgrendeld ✓';
      flipped = true;
      hit.style.display = 'none'; // free the back-face links
      if (cur) { cur.classList.remove('is-vis'); cur.classList.remove('is-down'); }
      tilt.style.transition = 'transform .5s ease';
      tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
      setTimeout(function () {
        card.style.setProperty('--fy', '180deg');
        var back = card.querySelector('.g-back');
        if (back) back.removeAttribute('aria-hidden');
        confetti();
      }, reduce ? 60 : 460);
    }
  }

  hit.addEventListener('click', function (e) {
    stamp(e.clientX, e.clientY);
  });
  // belt-and-braces: if a click ever reaches the card itself, stamp anyway
  card.addEventListener('click', function (e) {
    if (flipped) return;
    e.preventDefault();
    stamp(e.clientX, e.clientY);
  });
})();
