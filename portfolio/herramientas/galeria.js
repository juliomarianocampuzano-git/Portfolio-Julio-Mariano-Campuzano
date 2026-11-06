/* galeria.js · visor de capturas de las fichas de herramientas. Sin código en línea (CSP del sitio).
   Cada botón .shot guarda la imagen grande en data-full y el texto en data-cap. */
(() => {
  'use strict';
  const dlg = document.getElementById('shotDlg');
  const shots = Array.from(document.querySelectorAll('.shot'));
  if (!dlg || !shots.length) return;

  const img = dlg.querySelector('.shot-dlg__img img');
  const wrap = dlg.querySelector('.shot-dlg__img');
  const cap = dlg.querySelector('.shot-dlg__cap');
  const count = dlg.querySelector('.shot-dlg__count');
  let i = 0;
  let opener = null;

  function show(n) {
    i = (n + shots.length) % shots.length;
    const b = shots[i];
    img.src = b.dataset.full;
    img.alt = b.querySelector('img').alt;
    cap.textContent = b.dataset.cap;
    count.textContent = (i + 1) + ' / ' + shots.length;
    wrap.scrollTop = 0;
    // precarga la siguiente
    const next = shots[(i + 1) % shots.length];
    if (next) new Image().src = next.dataset.full;
  }

  function open(n, from) {
    opener = from;
    show(n);
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
  }

  shots.forEach((b, k) => b.addEventListener('click', () => open(k, b)));
  dlg.querySelector('[data-prev]').addEventListener('click', () => show(i - 1));
  dlg.querySelector('[data-next]').addEventListener('click', () => show(i + 1));
  dlg.querySelector('[data-close]').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    if (opener && typeof opener.focus === 'function') opener.focus();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
  });

  // deslizar con el dedo
  let x0 = null;
  dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 60) show(i + (dx < 0 ? 1 : -1));
  });
})();
