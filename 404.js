// ===== Stampzer 404 — "De verloren kaarten" =====
// External file on purpose: the site CSP (script-src 'self') blocks inline scripts.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  var TOTAL = 8, on = 0, flipped = false;
  var card = document.getElementById('gcard');
  var tilt = document.getElementById('gtilt');
  var front = document.getElementById('gfront');
  var stamps = document.getElementById('gstamps');
  var prog = document.getElementById('gprog');
  var hint = document.getElementById('ghint');
  var glare = document.getElementById('gglare');
  var cur = document.getElementById('gcur');
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

  // ---- Mouse-driven scene: spotlight, parallax papers, card tilt, glare ----
  var raf = null;
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;

  function frame() {
    raf = null;
    var root = document.documentElement;
    // spotlight + paper parallax
    root.style.setProperty('--mx', (mx / window.innerWidth * 100) + '%');
    root.style.setProperty('--my', (my / window.innerHeight * 100) + '%');
    var px = (mx / window.innerWidth - .5) * -26;
    var py = (my / window.innerHeight - .5) * -18;
    root.style.setProperty('--px', px + 'px');
    root.style.setProperty('--py', py + 'px');

    // card tilt + glare (only while not flipped)
    if (!flipped) {
      var r = card.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = (mx - cx) / (r.width / 2), dy = (my - cy) / (r.height / 2);
      var near = Math.abs(dx) < 2.2 && Math.abs(dy) < 2.2;
      var ry = Math.max(-1, Math.min(1, dx)) * 10;
      var rx = Math.max(-1, Math.min(1, dy)) * -8;
      tilt.style.setProperty('--rx', (near ? rx : 0) + 'deg');
      tilt.style.setProperty('--ry', (near ? ry : 0) + 'deg');
      if (glare) {
        glare.style.setProperty('--gx', ((mx - r.left) / r.width * 100) + '%');
        glare.style.setProperty('--gy', ((my - r.top) / r.height * 100) + '%');
      }
    }
    // custom cursor
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  }

  if (fine && !reduce) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });

    // stamp-cursor visibility over the card
    card.addEventListener('mouseenter', function () { if (!flipped && cur) cur.classList.add('is-vis'); });
    card.addEventListener('mouseleave', function () { if (cur) cur.classList.remove('is-vis'); });
  }

  // paper parallax vars live on :root; papers read them via CSS calc
  // (transform in stylesheet multiplies by per-paper depth --dp)

  // ---- Stamping ----
  function spark(dot) {
    if (reduce) return;
    var r = dot.getBoundingClientRect();
    var colors = ['#29c700', '#f7f2e7', '#8ee85f'];
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('span');
      p.className = 'g-spark';
      p.style.left = (r.left + r.width / 2) + 'px';
      p.style.top = (r.top + r.height / 2) + 'px';
      p.style.position = 'fixed';
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
    document.querySelector('.g-shadow').style.setProperty('--sh', '.92');
    setTimeout(function () {
      card.classList.remove('is-press');
      document.querySelector('.g-shadow').style.setProperty('--sh', '1');
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
      tilt.style.setProperty('--rx', '0deg');
      tilt.style.setProperty('--ry', '0deg');
      if (cur) cur.classList.remove('is-vis');
      setTimeout(function () {
        card.style.setProperty('--fy', '180deg');
        card.style.cursor = 'default';
        card.setAttribute('aria-label', 'Volle kaart — beloning ontgrendeld');
        var back = card.querySelector('.g-back');
        if (back) back.removeAttribute('aria-hidden');
        confetti();
      }, reduce ? 60 : 480);
    }
  }

  card.addEventListener('click', function (e) {
    // let the reward links on the back work normally
    if (flipped) return;
    e.preventDefault();
    stamp();
  });
  card.addEventListener('keydown', function (e) {
    if (flipped) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stamp(); }
  });
})();
