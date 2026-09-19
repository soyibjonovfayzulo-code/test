/* Best-effort client-side DevTools deterrent. Haqiqiy xavfsizlik server tomonda bo'lishi kerak. */
(function () {
  'use strict';
  var overlay, blocked = false;
  function isDesktop() { return window.matchMedia('(min-width: 900px) and (pointer: fine)').matches; }
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div'); overlay.id = 'devtoolsGuard'; overlay.setAttribute('role', 'alertdialog'); overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = '<div class="devtools-guard__card"><div class="devtools-guard__icon">&lt;/&gt;</div><h2>Developer Tools yopilsin</h2><p>Davom etish uchun Chrome DevTools oynasini yoping.</p></div>';
    document.body.appendChild(overlay); return overlay;
  }
  function setBlocked(value) { if (blocked === value) return; blocked = value; document.documentElement.classList.toggle('devtools-open', value); if (value) ensureOverlay().hidden = false; else if (overlay) overlay.hidden = true; }
  function check() { if (!isDesktop()) { setBlocked(false); return; } setBlocked(Math.abs(window.outerWidth - window.innerWidth) > 180 || Math.abs(window.outerHeight - window.innerHeight) > 180); }
  document.addEventListener('keydown', function (e) { var k = String(e.key || '').toLowerCase(); if (isDesktop() && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i','j','c'].indexOf(k) !== -1))) { e.preventDefault(); setBlocked(true); } }, true);
  /* Console va oddiy context-menu ochiq qoladi: guard faqat DevTools UI ochilganda ishlaydi. */
  window.addEventListener('resize', check, { passive: true }); window.addEventListener('focus', check, { passive: true }); window.setInterval(check, 1500);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check, { once: true }); else check();
}());
