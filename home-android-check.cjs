/* ============================================================
   HOME ANDROID CHECK — home-android.js runtime smoke test (jsdom)
   Run: node home-android-check.cjs
   [1] Brauzer muhiti: #page-home DOMdan olib tashlanadi
   [2] Native (Capacitor APK): sahifa aktivlashganda real data render bo'ladi
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = __dirname;
const code = fs.readFileSync(path.join(root, 'home-android.js'), 'utf8');
const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const secMatch = homeHtml.match(/<section id="page-home"[\s\S]*?<\/section>/);
if (!secMatch) { console.error('FAIL: index.html da #page-home topilmadi'); process.exit(1); }

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

/* ---------- 1. BRAUZER MUHITI — sahifa olib tashlanadi ---------- */
console.log('\n[1] Brauzer muhiti (Capacitor yo\u2018q)');
const dom1 = makeDom(secMatch[0]);
runInDom(dom1);
ok(!!dom1.window.ITHome, 'window.ITHome eksport qilindi');
ok(dom1.window.ITHome.enabled() === false, 'enabled() = false (brauzer)');

/* DOMContentLoaded kechikishi mumkin — olib tashlanishini keyin tekshiramiz */
setTimeout(function () {
  ok(!dom1.window.document.getElementById('page-home'), '#page-home DOMdan olib tashlandi (brauzer himoyasi)');
  case2();
}, 50);

function case2() {
/* ---------- 2. NATIVE MUHIT — real render ---------- */
console.log('\n[2] Native muhit (Capacitor Android)');
  const dom = makeDom('<div class="topbar"></div>' + secMatch[0]);
  const w = dom.window;
  w.Capacitor = { isNativePlatform: () => true };
  w.__itGetCurrentUser = () => ({ username: 'sardor', firstname: 'Sardor', xp: 245, streak: 3 });
  w.CoursesAPI = {
    listCourses: () => [
      { id: 'html', name: 'HTML', icon: 'G', tagline: 'Web sahifalar', lessonCount: 2, lessons: [{ id: 'l1', number: 1, title: 'Kirish' }, { id: 'l2', number: 2, title: 'Teglar' }] },
      { id: 'python', name: 'Python', icon: 'P', tagline: 'Dasturlash', lessonCount: 1, lessons: [{ id: 'p1', number: 1, title: 'Asoslar' }] }
    ],
    getCourse: (id) => (w.CoursesAPI.listCourses().find(c => c.id === id) || null)
  };
  w.localStorage.setItem('darslar_state_v1::sardor', JSON.stringify({
    progress: { html: { lastVisit: 12345, completed: { l1: { at: 12345 } } } }
  }));
  runInDom(dom);

  ok(!!w.ITHome && w.ITHome.enabled() === true, 'enabled() = true (native)');
  ok(!!w.document.getElementById('page-home'), '#page-home saqlanib qoldi (native)');

  const sec = w.document.getElementById('page-home');
  sec.classList.add('active'); // MutationObserver renderAll'ni ishga tushiradi

  setTimeout(() => {
    const d = w.document;
    ok(d.body.classList.contains('ithome-active'), 'body.ithome-active qo\u2018shildi');
    ok(d.getElementById('ihStreakVal').textContent === '3', 'Streak chip: 3 kun');
    ok(d.getElementById('ihXpVal').textContent === '245', 'XP chip: 245');
    const cont = d.getElementById('ihContinueBody');
    ok(!!cont && cont.innerHTML.indexOf('HTML') !== -1, 'Davom ettirish: HTML kursi tanildi');
    ok(!!cont && cont.innerHTML.indexOf('2-dars: Teglar') !== -1, 'Davom ettirish: keyingi dars (2-dars: Teglar)');
    ok(!!cont && cont.innerHTML.indexOf('Davom ettirish') !== -1, 'Tugma: Davom ettirish (progress > 0)');
    ok(!!cont && cont.innerHTML.indexOf('50%') !== -1, 'Progress: 50% (1/2)');
    const me = d.getElementById('ihMe');
    ok(!!me && me.innerHTML.indexOf('Sardor') !== -1, 'Shaxsiy karta: ism render bo\u2018ldi');
    ok(!!me && me.innerHTML.indexOf('Level 3') !== -1, 'Level hisoblandi (245 XP \u2192 Level 3)');

    // Qidiruv
    const input = d.getElementById('ihSearchInput');
    const results = d.getElementById('ihSearchResults');
    input.value = 'pyt';
    input.dispatchEvent(new w.Event('input', { bubbles: true }));
    ok(!results.hidden && results.innerHTML.indexOf('Python') !== -1, 'Qidiruv: Python topildi');
    input.value = 'zzz';
    input.dispatchEvent(new w.Event('input', { bubbles: true }));
    ok(!results.hidden && results.innerHTML.indexOf('Hech narsa topilmadi') !== -1, 'Qidiruv: topilmadi holati');

    // Back-button testi
    ok(typeof w.ITHome.handleBackButton === 'function', 'handleBackButton mavjud');
    results.hidden = false;
    w.ITHome.handleBackButton();
    ok(results.hidden === true, 'Back-button: qidiruv natijalari yopildi');

    if (failed) process.exit(1);
    console.log('\nHOME ANDROID CHECK PASSED');
  }, 100);
}

