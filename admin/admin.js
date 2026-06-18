// ===== Stampzer CEO dashboard — navigation =====
(function () {
  const buttons = document.querySelectorAll('.adm-nav button');
  const sections = document.querySelectorAll('.adm-section');
  const title = document.getElementById('adm-title');

  function show(name, label) {
    buttons.forEach((b) => b.classList.toggle('is-active', b.dataset.section === name));
    sections.forEach((s) => s.classList.toggle('is-active', s.dataset.panel === name));
    if (title && label) title.textContent = label;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      show(btn.dataset.section, btn.querySelector('span') ? btn.querySelector('span').textContent : '');
      history.replaceState(null, '', '#' + btn.dataset.section);
    });
  });

  // Open the section from the URL hash, if any.
  const hash = location.hash.replace('#', '');
  if (hash) {
    const btn = [...buttons].find((b) => b.dataset.section === hash);
    if (btn) btn.click();
  }
})();
