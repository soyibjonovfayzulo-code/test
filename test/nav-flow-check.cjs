/* SIDEBAR NAVIGATION + TEST FLOW — runtime smoke test (jsdom)
   Run: node test/nav-flow-check.cjs
   Har bir sidebar tugmasi o'z haqiqiy page ID'siga ochilishini,
   Testlar -> Boshlash -> quiz oqimini va routing bugini (CSS specificity) tekshiradi. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptSrc = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:5178/' });
const w = dom.window;
const doc = w.document;

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

w.Lessons = { handlePage: () => {} };
w.MobileUI = undefined;
w.ITMascot = { html: () => '<div class="mascot mascot--idle"></div>', inject: () => {}, setState: () => {}, setStateIn: () => {}, showXP: () => {}, say: () => {} };
w.scrollTo = () => {};
w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));

w.localStorage.setItem('currentUser', JSON.stringify({ id: 'u1' }));

const errors = [];
const origError = w.console.error;
w.console.error = (...a) => { errors.push(a.map(String).join(' ')); origError(...a); };

w.eval(scriptSrc);

(async () => {
// Native home Android bo'lmagan muhitda dashboard = page-dashboard
const expected = {
  dashboard: 'page-dashboard', lessons: 'page-lessons', tests: 'page-tests',
  duel: 'page-duel', store: 'page-store', coding: 'page-coding',
  projects: 'page-projects', ranking: 'page-ranking', certificate: 'page-certificate',
  achievements: 'page-achievements', profile: 'page-profile', settings: 'page-settings',
};

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
ok(!$('#app').classList.contains('hidden'), 'App korsatildi');

// QBANK async yuklanishini kutamiz
for (let i = 0; i < 100; i++) {
  const all = w.__itGetAllTests();
  if (all.Python && all.Python.length > 0) break;
  await new Promise(r => setTimeout(r, 50));
}

section('SIDEBAR NAVIGATION — har bir tugma o\'z page ID\'siga');
const navItems = [...doc.querySelectorAll('.sidebar-nav .nav-item[data-page]')];
ok(navItems.length === 12, 'Sidebar 12 ta nav-item topildi (' + navItems.length + ')');
for (const item of navItems) {
  const key = item.getAttribute('data-page');
  item.click();
  const active = [...doc.querySelectorAll('.page.active')].map(p => p.id);
  const exp = expected[key];
  ok(exp && active.includes(exp), key + ' \u2192 ' + exp, 'active: ' + active.join(','));
  ok(active.length === 1, key + ' \u2192 FAQAT bitta page active', 'active pages: ' + active.join(','));
}

section('LOGOUT TUGMASI');
const logoutBtn = $('#logoutBtn');
ok(!!logoutBtn, 'Chiqish tugmasi mavjud');

section('CSS ROUTING BUG TEKSHIRUVI (testlar-redesign.css)');
// jsdom specificity hisoblamaydi — statik assert: #page-tests bosh qoidasida display bo'lmasin
const css = fs.readFileSync(path.join(root, 'testlar-redesign.css'), 'utf8');
const baseRuleMatch = css.match(/#page-tests\s*\{([^}]*)\}/);
const baseRule = baseRuleMatch ? baseRuleMatch[1] : '';
ok(!/display\s*:/.test(baseRule), '#page-tests bosh qoidasida display YO\'Q (routing bugi tuzatilgan)', 'base rule: { ' + baseRule.trim() + ' }');
const activeRuleMatch = css.match(/#page-tests\.active\s*\{([^}]*)\}/);
ok(!!activeRuleMatch && /display\s*:\s*flex/.test(activeRuleMatch[1]), '#page-tests.active display:flex beradi');

section('TESTLAR \u2192 FAN KARTASI \u2192 TESTLIST \u2192 BOSHLASH \u2192 QUIZ');
w.__itShowPage('tests');
const grid = $('#testsGrid');
ok(!!grid && grid.querySelectorAll('.test-card').length > 0, 'Fan kartalari render boldi (' + (grid ? grid.querySelectorAll('.test-card').length : 0) + ')');
const card = grid.querySelector('.test-card');
click(card);
ok($('#page-testlist').classList.contains('active'), 'Fan kartasiga bosilganda testlist ochildi');
const items = $('#testListContainer').querySelectorAll('.test-list-item');
ok(items.length > 0, 'Testlar royxati render boldi (' + items.length + ' ta test)');
const startBtn = $('#testListContainer').querySelector('.start-test-btn');
ok(!!startBtn, '"Boshlash" tugmasi mavjud');
click(startBtn);
ok($('#startTestModal').classList.contains('active'), '"Boshlash" bosilganda startTestModal ochildi');
click($('#startTestConfirm'));
ok($('#page-test').classList.contains('active'), 'TESTNI BOSHLASH bosilganda quiz sahifasi ochildi (page-test active)', 'active: ' + [...doc.querySelectorAll('.page.active')].map(p => p.id).join(','));
ok(!!$('#questionArea') && $('#questionArea').children.length > 0, 'Savol render boldi');
ok($('#testTimer').textContent.length > 0, 'Timer: "' + $('#testTimer').textContent + '"');

// Quiz ichida javob berish + Keyingi
const opt = $('#optionsContainer').querySelector('.option');
click(opt);
ok($('#nextBtn').textContent.indexOf('Keyingi') !== -1, 'Keyingi tugmasi tayyor: "' + $('#nextBtn').textContent + '"');

console.log('\nCONSOLE.ERROR (' + errors.length + '):');
errors.slice(0, 10).forEach(e => console.log('  ' + e.split('\n').slice(0, 3).join(' | ')));

console.log('\n=== NATIJA: ' + passed + ' passed, ' + failed + ' failed ===');
process.exit(failed ? 1 : 0);

} catch (e) {
  console.error('HARNESS CRASH:', e && e.stack || e);
  process.exit(2);
}
})();