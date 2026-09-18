/* ============================================================
   TESTS ANDROID CHECK — tests-android.js runtime smoke test (jsdom)
   Run: node tests-android-check.cjs
   [1] Brauzer muhiti: hech narsa o'zgarmaydi (no-op)
   [2] Native (Capacitor APK): body class + app-bar + taymer sinxron
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = __dirname;
const code = fs.readFileSync(path.join(root, 'tests-android.js'), 'utf8');

function makeDom(bodyHtml) {
  return new JSDOM('<!DOCTYPE html><html><body>' + bodyHtml + '</body></html>', {
    url: 'http://localhost/',
    runScripts: 'outside-only'
  });
}
function runInDom(dom) { vm.runInContext(code, dom.getInternalVMContext()); }

let passed = 0, failed = 0;
function ok(cond, label) {
  if (cond) { passed++; console.log('  \u2705 ' + label); }
  else { failed++; console.log('  \u274C ' + label); }
}

const PAGES_HTML =
  '<div class="topbar"></div>' +
  '<section id="page-tests" class="page"></section>' +
  '<section id="page-testlist" class="page"><div class="page-head"><button class="back-btn"></button><h2 id="testListTitle"></h2></div></section>' +
  '<section id="page-test" class="page"><div class="test-header"><h2 id="testTitle"></h2></div><div class="test-timer" id="testTimer"></div></section>' +
  '<section id="page-result" class="page"></section>';

/* ---------- 1. BRAUZER MUHITI — no-op ---------- */
console.log('\n[1] Brauzer muhiti (Capacitor yo\u2018q)');
const dom1 = makeDom(PAGES_HTML);
runInDom(dom1);
ok(!!dom1.window.ITTestsAndroid, 'window.ITTestsAndroid eksport qilindi');
ok(dom1.window.ITTestsAndroid.enabled() === false, 'enabled() = false (brauzer)');

setTimeout(function () {
  const d1 = dom1.window.document;
  d1.getElementById('page-tests').classList.add('active');
  setTimeout(function () {
    ok(!d1.body.classList.contains('itnative-tests'), 'Brauzer: body class qo\u2018shilmadi');
    ok(!d1.querySelector('.ta-appbar'), 'Brauzer: app-bar qo\u2018shilmadi');
    ok(!!d1.querySelector('.topbar'), 'Brauzer: .topbar yashirinmadi (CSS class\u2018ga bog\u2018liq)');
    case2();
  }, 120);
}, 50);

function case2() {
  /* ---------- 2. NATIVE MUHIT ---------- */
  console.log('\n[2] Native muhit (Capacitor Android)');
  const dom = makeDom(PAGES_HTML);
  const w = dom.window;
  w.Capacitor = { isNativePlatform: () => true };
  const navSpy = [];
  w.__itShowPage = (name) => navSpy.push(name);
  runInDom(dom);

  ok(w.ITTestsAndroid.enabled() === true, 'enabled() = true (native)');

  const d = w.document;
  // page-tests aktiv (boshlang\u2018ich holat)
  d.getElementById('page-tests').classList.add('active');
  setTimeout(function () {
    ok(d.body.classList.contains('itnative-tests'), 'Native: body.itnative-tests qo\u2018shildi');
    ok(d.body.getAttribute('data-ta-page') === 'page-tests', 'data-ta-page = page-tests');
    const bar1 = d.querySelector('#page-tests .ta-appbar');
    ok(!!bar1, '#page-tests ichida app-bar yaratildi');
    ok(bar1 && bar1.querySelector('.ta-title').textContent === 'Testlar', 'App-bar sarlavha: Testlar');

    // Testlist sahifasi
    d.getElementById('page-tests').classList.remove('active');
    d.getElementById('page-testlist').classList.add('active');
    d.getElementById('testListTitle').textContent = '\uD83D\uDC0D Python testlari';
    setTimeout(function () {
      ok(d.body.getAttribute('data-ta-page') === 'page-testlist', 'data-ta-page = page-testlist');
      const bar2 = d.querySelector('#page-testlist .ta-appbar');
      ok(!!bar2, '#page-testlist ichida app-bar yaratildi');
      ok(bar2 && bar2.querySelector('.ta-title').textContent === 'Python', 'Sarlavha ikonkasiz: Python');

      // Test o\u2018ynash sahifasi
      d.getElementById('page-testlist').classList.remove('active');
      d.getElementById('page-test').classList.add('active');
      d.getElementById('testTitle').textContent = 'Beginner Test 1';
      d.getElementById('testTimer').textContent = '09:46';
      setTimeout(function () {
        const bar3 = d.querySelector('#page-test .ta-appbar');
        ok(!!bar3, '#page-test ichida app-bar yaratildi');
        ok(bar3 && bar3.querySelector('.ta-title').textContent === 'Beginner Test 1', 'App-bar: Beginner Test 1');
        ok(bar3 && bar3.querySelector('.ta-timer').textContent === '09:46', 'Taymer chip sinxron: 09:46');
        ok(d.body.getAttribute('data-ta-page') === 'page-test', 'data-ta-page = page-test');

        // Orqaga tugmasi \u2192 __itShowPage
        bar3.querySelector('.ta-back').click();
        ok(navSpy.indexOf('tests') !== -1, 'Orqaga: tests sahifasiga qaytdi (' + navSpy.join(',') + ')');

        // Result sahifasi
        d.getElementById('page-test').classList.remove('active');
        d.getElementById('page-result').classList.add('active');
        setTimeout(function () {
          ok(d.body.getAttribute('data-ta-page') === 'page-result', 'data-ta-page = page-result');
          const bar4 = d.querySelector('#page-result .ta-appbar');
          ok(!!bar4, '#page-result ichida app-bar yaratildi');
          ok(bar4 && bar4.querySelector('.ta-timer').textContent === '', 'Result: taymer chip bo\u2018sh');

          if (failed) process.exit(1);
          console.log('\nTESTS ANDROID CHECK PASSED');
        }, 120);
      }, 120);
    }, 120);
  }, 120);
}
