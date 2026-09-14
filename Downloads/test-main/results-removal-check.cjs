/* NATIJALAR BO'LIMI OLIB TASHLANGAN — removal test */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;
let errors = [];
window.addEventListener('error', e => errors.push(e.message));

const store = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: k => (store[k] == null ? null : store[k]),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
  }, configurable: true
});
window.__itGetCurrentUser = () => ({ username: 'nr', email: 'n@mail.com' });
window.showToast = function (msg) { window.__lastToast = msg; };
window.confirm = () => true;

let src = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
src = src.replace(/^\s*import[\s\S]*?;\s*$/gm, '');
window.eval(src);
// login holatini simulyatsiya qilish
if (typeof window.__itForceLogin === 'function') window.__itForceLogin();
try { window.__itShowPage('dashboard'); } catch (e) { errors.push('showPage dashboard: ' + e.message); }

let passed = 0, failed = 0;
const ok = (c, l) => { if (c) { passed++; console.log('  PASS ' + l); } else { failed++; console.log('  FAIL ' + l); } };

// 1) Sidebar'da Natijalar YO'Q
const navResults = doc.querySelectorAll('.nav-item[data-page="results"]');
ok(navResults.length === 0, 'Sidebar: data-page="results" element YO\'Q');
ok(!doc.querySelector('a[href="#results"]'), 'Sidebar: href="#results" link YO\'Q');
ok(!doc.getElementById('page-results'), 'HTML: page-results section YO\'Q');
// boshqa bo'limlar joyida
['dashboard', 'lessons', 'tests', 'duel', 'store', 'coding', 'projects', 'ranking', 'achievements', 'profile', 'settings']
  .forEach(p => ok(!!doc.querySelector('.nav-item[data-page="' + p + '"]'), 'Sidebar: "' + p + '" bo\'limi joyida'));

// 2) Eski results route fallback (dashboard)
try { window.__itShowPage('results'); } catch (e) { errors.push('showPage results: ' + e.message); }
const activePage = doc.querySelector('.page.active');
ok(!!activePage && activePage.id === 'page-dashboard', 'Eski /#results URL → dashboard fallback (' + (activePage && activePage.id) + ')');
const toastEl = doc.querySelector('.toast, #toastContainer .toast, .show-toast');
ok(!!toastEl || doc.body.textContent.includes("Natijalar bo'limi olib tashlandi"), 'Fallback toast ko\'rsatildi');

// 3) Boshqa sahifalar render (error bo'lmasa)
['tests', 'ranking', 'achievements', 'profile', 'duel', 'store', 'coding', 'projects', 'lessons'].forEach(p => {
  const before = errors.length;
  try { window.__itShowPage(p); } catch (e) { errors.push(p + ': ' + e.message); }
  ok(errors.length === before, p + ' sahifasi xatosiz render bo\'ldi');
});

// 4) Dashboard recent results (in-page statistika) ishlaydi
window.__itShowPage('dashboard');
ok(!!doc.getElementById('recentResults'), 'Dashboard: So\'nggi natijalar kartasi joyida (alohida Results page\'ga link YO\'Q)');
ok(doc.querySelectorAll('.nav-item[data-page="results"]').length === 0, 'Yakuniy: hech qanday results navigatsiya qolmagan');

console.log('\nconsole errors: ' + errors.length);
errors.slice(0, 5).forEach(e => console.log('  ERR: ' + e));
console.log('RESULT: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed || errors.length ? 1 : 0);
