/* Prijzen — maand/jaar schakelaar met vloeiende glijdende pill + zachte prijs-overgang.
   Extern bestand i.v.m. Content Security Policy (script-src 'self'). */
(function () {
  function init() {
    var toggle = document.querySelector('.pr-toggle');
    if (!toggle) return;
    var pill = toggle.querySelector('.pr-toggle__pill');
    var btns = [].slice.call(toggle.querySelectorAll('.pr-toggle__btn'));
    if (!btns.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function placePill() {
      var on = toggle.querySelector('.pr-toggle__btn.is-on');
      if (!on || !pill) return;
      pill.style.width = on.offsetWidth + 'px';
      pill.style.height = on.offsetHeight + 'px';
      pill.style.transform = 'translate(' + on.offsetLeft + 'px,' + on.offsetTop + 'px)';
    }

    function swapAnim() {
      if (reduce) return;
      var els = document.querySelectorAll('.pr-price, .pr-annual');
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('pr-swap');
        void els[i].offsetWidth; /* reflow zodat de animatie opnieuw start */
        els[i].classList.add('pr-swap');
      }
    }

    function set(term, animate) {
      var changed = false;
      for (var i = 0; i < btns.length; i++) {
        var isOn = btns[i].getAttribute('data-term') === term;
        if (isOn && !btns[i].classList.contains('is-on')) changed = true;
        btns[i].classList.toggle('is-on', isOn);
        btns[i].setAttribute('aria-selected', isOn ? 'true' : 'false');
      }
      var amts = document.querySelectorAll('.pr-amt');
      for (var j = 0; j < amts.length; j++) amts[j].textContent = amts[j].getAttribute('data-' + term);
      var terms = document.querySelectorAll('.pr-term');
      for (var k = 0; k < terms.length; k++) terms[k].innerHTML = terms[k].getAttribute('data-' + term);
      placePill();
      if (animate && changed) swapAnim();
    }

    toggle.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.pr-toggle__btn') : null;
      if (b) set(b.getAttribute('data-term'), true);
    });
    /* toetsenbord: links/rechts wisselt van termijn */
    toggle.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var cur = toggle.querySelector('.pr-toggle__btn.is-on');
      var next = e.key === 'ArrowRight' ? 'y' : 'm';
      if (cur && cur.getAttribute('data-term') === next) return;
      set(next, true);
      var nb = toggle.querySelector('.pr-toggle__btn[data-term="' + next + '"]');
      if (nb) nb.focus();
    });

    var onBtn = toggle.querySelector('.pr-toggle__btn.is-on');
    var initial = onBtn ? onBtn.getAttribute('data-term') : 'y';
    set(initial, false);

    /* pill op z'n plek zetten, dan pas de transitie aanzetten (geen glij vanaf 0,0 bij load) */
    requestAnimationFrame(function () {
      placePill();
      requestAnimationFrame(function () { toggle.classList.add('is-ready'); });
    });

    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(placePill, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
