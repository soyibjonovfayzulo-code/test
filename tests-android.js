/* ============================================================
   ITTest — ANDROID NATIVE TESTS (tests-android.js)
   Testlar bo'limini Capacitor Android (native) muhitga
   moslashtiradi. home-android.js bilan bir xil naqshda:
     - Brauzerda HECH NARSA qilmaydi (native emas => no-op),
       shuning uchun desktop/mobil brauzer o'zgarmaydi.
     - Native muhitda testlar sahifalari (#page-tests,
       #page-testlist, #page-test, #page-result) ochilganda:
         * body.itnative-tests class qo'yiladi (tests-android.css)
         * har sahifaga native app-bar qo'shiladi (orqaga + sarlavha)
         * test o'ynashda taymer chip app-barda ko'rsatiladi
   ============================================================ */
(function () {
  'use strict';

  var TEST_PAGES = ['page-tests', 'page-testlist', 'page-test', 'page-result'];
  var DEFAULT_TITLES = {
    'page-tests': 'Testlar',
    'page-testlist': 'Testlar',
    'page-test': 'Test',
    'page-result': 'Natija'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }

  function isNative() {
    if (window.ITHome && typeof window.ITHome.enabled === 'function') {
      try { return !!window.ITHome.enabled(); } catch (e) { /* fallback */ }
    }
    try {
      return !!(window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform());
    } catch (e) { return false; }
  }

  /* ---------- Native app-bar yaratish ---------- */
  function ensureAppbar(sec) {
    if (!sec || sec.querySelector('.ta-appbar')) return;

    var bar = document.createElement('div');
    bar.className = 'ta-appbar';
    bar.setAttribute('data-ta-appbar', '1');
    bar.innerHTML =
      '<button type="button" class="ta-back" aria-label="Orqaga">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="15 18 9 12 15 6"></polyline></svg></button>' +
      '<span class="ta-title"></span>' +
      '<span class="ta-timer" aria-hidden="true"></span>';

    bar.querySelector('.ta-back').addEventListener('click', function () {
      /* Hardware back bilan AYNIY logika — home-android.js handleBackButton */
      if (window.ITHome && typeof window.ITHome.handleBackButton === 'function') {
        try { window.ITHome.handleBackButton(); return; } catch (e) { /* fallback */ }
      }
      /* Fallback navigatsiya */
      var id = sec.id;
      if (id === 'page-tests') {
        go('home');
      } else if (id === 'page-result') {
        go('tests');
      } else {
        go('tests');
      }
    });

    sec.insertBefore(bar, sec.firstChild);
  }

  function go(name) {
    if (typeof window.__itShowPage === 'function') {
      try { window.__itShowPage(name); return; } catch (e) { /* noop */ }
    }
    if (typeof window.showPage === 'function') {
      try { window.showPage(name); return; } catch (e) { /* noop */ }
    }
  }

  /* ---------- Joriy sahifa holatini sinxronlash ---------- */
  function sync() {
    if (!isNative()) return;

    var active = $('.page.active');
    var id = active ? active.id : '';
    var isTests = TEST_PAGES.indexOf(id) !== -1;

    document.body.classList.toggle('itnative-tests', isTests);

    if (!isTests) {
      document.body.removeAttribute('data-ta-page');
      return;
    }

    document.body.setAttribute('data-ta-page', id);

    TEST_PAGES.forEach(function (pid) {
      var s = document.getElementById(pid);
      if (s) ensureAppbar(s);
    });

    var bar = active.querySelector('.ta-appbar');
    if (!bar) return;

    var titleEl = bar.querySelector('.ta-title');
    var timerEl = bar.querySelector('.ta-timer');

    var title = DEFAULT_TITLES[id] || '';
    if (id === 'page-testlist') {
      var lt = $('#testListTitle');
      var raw = lt ? String(lt.textContent || '').trim() : '';
      /* "🐍 Python testlari" -> ikonkasiz nom */
      title = raw.replace(/^[^\wA-Za-z\u2018'\u2019]+/, '').replace(/\s*testlari\s*$/i, '').trim() || 'Testlar';
    } else if (id === 'page-test') {
      var tt = $('#testTitle');
      title = (tt && tt.textContent && tt.textContent.trim()) || 'Test';
    }

    if (titleEl && titleEl.textContent !== title) titleEl.textContent = title;

    if (timerEl) {
      if (id === 'page-test') {
        var t = $('#testTimer');
        var txt = t ? String(t.textContent || '').trim() : '';
        if (txt && timerEl.textContent !== txt) timerEl.textContent = txt;
      } else if (timerEl.textContent) {
        timerEl.textContent = '';
      }
    }
  }

  /* ---------- Observer: .page.active almashinishini kuzatish ---------- */
  function observe() {
    var targets = TEST_PAGES.map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if ('MutationObserver' in window) {
      var obs = new MutationObserver(function () { sync(); });
      targets.forEach(function (t) {
        obs.observe(t, { attributes: true, attributeFilter: ['class'] });
      });
      /* Sahifa elementlari kech qo'shilsa ham (masalan JS) — umumiy kuzatuv */
      var bodyObs = new MutationObserver(function () {
        var missing = TEST_PAGES.some(function (id) { return !document.getElementById(id); });
        if (missing) { sync(); }
      });
      bodyObs.observe(document.body, { childList: true });
    }

    /* Taymer va sarlavha textContent o'zgarishini ham ushlab turish */
    setInterval(function () {
      if (document.body.classList.contains('itnative-tests')) sync();
    }, 400);
  }

  function init() {
    if (!isNative()) return; /* Brauzer: no-op */
    sync();
    observe();
  }

  window.ITTestsAndroid = { enabled: isNative, sync: sync };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
