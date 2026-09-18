/* TESTLAR OQIMI — runtime smoke test (jsdom)
   Run: node test/tests-flow-check.cjs
   Tests sahifasi -> fan kartasi -> testlist -> Boshlash -> modal -> TESTNI BOSHLASH -> quiz sahifasi
   Butun oqimni haqiqiy DOM muhitida tekshiradi. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptSrc = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:5178/' });
const w = dom.window;
const doc = w.document;

// Haqiqiy brauzer kabi fetch — data/*.json fayllarini diskdan xizmat qilamiz
w.fetch = (p) => {
  try {
    const url = new URL(p, 'http://localhost:5178/');
    const file = path.join(root, url.pathname.replace(/^\//, ''));
    const body = fs.readFileSync(file, 'utf8');
    return Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(body)) });
  } catch (e) {
    return Promise.reject(e);
  }
};

// Module skriptlar (browserda alohida yuklanadi) — stub
w.Lessons = { handlePage: () => {} };
w.MobileUI = undefined;
w.ITMascot = { html: () => '<div class="mascot mascot--idle"></div>', inject: () => {}, setState: () => {}, setStateIn: () => {}, showXP: () => {}, say: () => {} };
w.scrollTo = () => {};
w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));

// Login session
w.localStorage.setItem('currentUser', JSON.stringify({ id: 'u1' }));

// Captured console errors
const errors = [];
const origError = w.console.error;
w.console.error = (...a) => { errors.push(a.map(String).join(' ')); origError(...a); };

w.eval(scriptSrc);

(async () => {
let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  \u2705 ' + label); }
  else { failed++; console.log('  \u274c ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); }
const $ = (s) => doc.querySelector(s);
try {

section('INIT');
doc.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true }));
ok(!$('#app').classList.contains('hidden'), 'App korsatildi (session restore)');
ok(!!w.__itShowPage, 'script.js expose qilindi');

section('TESTS PAGE');
// QBANK async yuklanishini kutamiz (haqiqiy brauzerdagi kabi)
for (let i = 0; i < 100; i++) {
  const all = w.__itGetAllTests();
  if (all.Python && all.Python.length > 0) break;
  await new Promise(r => setTimeout(r, 50));
}
const allTests = w.__itGetAllTests();
ok(allTests.Python && allTests.Python.length > 0, 'Python testlari yuklandi (' + (allTests.Python || []).length + ')');

w.__itShowPage('tests');
const grid = $('#testsGrid');
ok(!!grid && grid.querySelectorAll('.test-card').length > 0, 'Fan kartalari render boldi (' + (grid ? grid.querySelectorAll('.test-card').length : 0) + ')');

// 1-qadam: fan kartasiga bosish -> testlist ochilishi kerak
const card = grid.querySelector('.test-card');
click(card);
ok($('#page-testlist').classList.contains('active'), 'Fan kartasiga bosilganda testlist sahifasi ochildi (active)', 'active pages: ' + [...doc.querySelectorAll('.page.active')].map(p => p.id).join(','));
const items = $('#testListContainer').querySelectorAll('.test-list-item');
ok(items.length > 0, 'Testlar royxati render boldi (' + items.length + ' ta test)');
const startBtn = $('#testListContainer').querySelector('.start-test-btn');
ok(!!startBtn, '"Boshlash" tugmasi mavjud');

// 2-qadam: Boshlash tugmasi -> startTestModal ochilishi kerak
click(startBtn);
const modal = $('#startTestModal');
ok(modal.classList.contains('active'), '"Boshlash" bosilganda startTestModal ochildi', 'modal class="' + modal.className + '"');
ok(($('#startTestName').textContent || '').length > 3, 'Modal sarlavhasi: "' + $('#startTestName').textContent + '"');

// 3-qadam: TESTNI BOSHLASH -> quiz sahifasi ochilishi kerak
click($('#startTestConfirm'));
ok($('#page-test').classList.contains('active'), 'TESTNI BOSHLASH bosilganda quiz sahifasi ochildi (page-test active)', 'active pages: ' + [...doc.querySelectorAll('.page.active')].map(p => p.id).join(','));
const qArea = $('#questionArea');
ok(!!qArea && qArea.children.length > 0, 'Savol render boldi (' + (qArea ? qArea.children.length : 0) + ' element)', 'questionArea bo\\\'sh');
ok($('#questionNav').querySelectorAll('.qnav-dot, button, [data-q]').length > 0, 'Navigator render boldi');
ok($('#testTimer').textContent.length > 0, 'Timer: "' + $('#testTimer').textContent + '"');

console.log('\nCONSOLE.ERROR (' + errors.length + '):');
errors.slice(0, 10).forEach(e => console.log('  ' + e.split('\n').slice(0, 3).join(' | ')));

console.log('\n=== NATIJA: ' + passed + ' passed, ' + failed + ' failed ===');
process.exit(failed ? 1 : 0);

} catch (e) {
  console.error('HARNESS CRASH:', e && e.stack || e);
  process.exit(2);
}
})();
