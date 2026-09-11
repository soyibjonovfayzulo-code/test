/* =====================================================================
   ITTEST AUTH — PREMIUM FX
   • Desktop mouse parallax (transform3d, rAF throttled)
   • Binance-style robot "peek" idle animatsiyasi
   • Auth screen tema tugmasi (mavjud theme logic bilan mos)
   Auth logic, formalar, validatsiya — tegilmagan.
   ===================================================================== */

(function () {
  'use strict';

  const screen = document.getElementById('authScreen');
  if (!screen) return;

  /* Eski WebView / test muhitlari uchun xavfsiz matchMedia wrapper */
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: null });
  const prefersReduced = mq('(prefers-reduced-motion: reduce)');
  const finePointer = mq('(pointer: fine)');

  /* ---------- 1. DESKTOP MOUSE PARALLAX ---------- */
  const layers = [
    { el: screen.querySelector('.auth-bg'), depth: 3 },      // fon: 2–4px
    { el: screen.querySelector('.auth-robot'), depth: 8 },   // robot: 5–10px
    { el: screen.querySelector('.auth-chips'), depth: 5 },   // chips: 3–7px
    { el: screen.querySelector('.auth-card'), depth: 1.5 }   // card: 1–2px
  ].filter(l => l.el);

  let rafId = 0;
  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;

  function applyParallax() {
    // Yengil lerp — harakat tabiiy va "premium" his qiladi
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;

    // Mobil breakpointda robot markazlashuvi translateX(-50%) orqali — saqlansin
    const narrow = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    for (const l of layers) {
      const dx = (curX * l.depth).toFixed(2);
      const dy = (curY * l.depth).toFixed(2);
      if (l.el.classList.contains('auth-robot') && narrow) {
        l.el.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px)`;
      } else {
        l.el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }
    }

    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      rafId = requestAnimationFrame(applyParallax);
    } else {
      rafId = 0;
    }
  }

  function onPointerMove(e) {
    if (prefersReduced.matches || !finePointer.matches) return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;   // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = nx;
    targetY = ny;
    if (!rafId) rafId = requestAnimationFrame(applyParallax);
  }

  function enableParallax() {
    if (!finePointer.matches || prefersReduced.matches) return;
    window.addEventListener('mousemove', onPointerMove, { passive: true });
  }

  /* media o'zgarsa (masalan pointer/rezim almashsa) — inline transformlarni
     tozalab, CSS holatiga qaytish */
  finePointer.addEventListener?.('change', () => {
    window.removeEventListener('mousemove', onPointerMove);
    targetX = targetY = curX = curY = 0;
    layers.forEach(l => { l.el.style.transform = ''; });
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    enableParallax();
  });

  /* ---------- 2. ROBOT "PEEK" (Binance uslubi, occasional) ---------- */
  const robot = screen.querySelector('.auth-robot');
  if (robot && !prefersReduced.matches) {
    screen.classList.add('auth-robot-peek');
  }

  /* ---------- 3. AUTH SCREEN THEME TOGGLE ---------- */
  const THEMES = ['dark', 'light'];
  const toggle = document.getElementById('authThemeToggle');

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', JSON.stringify(theme)); } catch (e) { /* noop */ }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  enableParallax();
})();