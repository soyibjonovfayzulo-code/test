/* FULL CHAIN: Dars -> SINAB KO'R -> real openCodePlaygroundWithHtml (script.js) */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'),
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window, doc = w.document;
let failed = 0;
const ok = (c, l, x) => { console.log((c ? '  ✅ ' : '  ❌ ') + l + (c ? '' : ' — ' + (x || ''))); if (!c) failed++; };
w.showToast = (m, t) => { w.__lastToast = { m, t }; };
w.confirm = () => true;
w.addEventListener('error', e => console.log('WINDOW ERR:', e.message));
// Admin foydalanuvchi + sessiya (restoreSession avtomatik login qiladi)
const adminUser = { id: "u1", firstname: "Admin", lastname: "User", username: "admin", email: "a@a.a", password: "12345", xp: 280, points: 280, level: 3, avatar: "🤖", joinedAt: Date.now() - 86400000 * 30, streak: 5, lastActiveDay: null, testResults: [], store: { inventory: [], equipped: {} } };
w.localStorage.setItem('users', JSON.stringify([adminUser]));
w.localStorage.setItem('currentUser', JSON.stringify(adminUser));

for (const f of ['lessons-data.js', 'lessons-app.js', 'script.js']) {
  try { w.eval(fs.readFileSync(f, 'utf8')); } catch (e) { console.log('EVAL FAIL ' + f + ':', e.message); }
}
// initAuthState DOMContentLoaded'da ishlaydi — jsdom'da allaqachon o'tgan, qayta ishga tushiramiz
console.log('typeof w.showPage:', typeof w.showPage);
doc.dispatchEvent(new w.Event('DOMContentLoaded'));
console.log('after DCL, currentUser:', JSON.stringify(w.__itGetCurrentUser()));
// login (global let currentUser binding script.js ichida)
w.eval('currentUser = { id: "t1", username: "tester", email: "t@t.com" };');

function activePage() { const p = doc.querySelector('.page.active'); return p ? p.id : 'none'; }
function activeEditorView() { const v = doc.querySelector('.editor-view.active'); return v ? v.id : 'none'; }
function activeTab() { const t = doc.querySelector('.coding-tab.active'); return t ? t.getAttribute('data-tab') : 'none'; }

const testCode = '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Salom, dunyo!</h1>\n</body>\n</html>';
const ctx = { courseId: 'html', lessonId: 'html-d1', lessonNumber: 1 };

console.log('\n[CASE 1] Oddiy holat — web rejimda sinab ko‘r');
console.log('currentUser:', JSON.stringify(w.__itGetCurrentUser()));
w.eval('try { showPage("coding"); } catch (e) { console.log("SP THROW:", e.message); }');
console.log('after direct showPage:', activePage(), 'toast:', JSON.stringify(w.__lastToast));
w.__lastToast = null;
w.openCodePlaygroundWithHtml(testCode, ctx);
ok(activePage() === 'page-coding', 'Coding sahifasi ochildi', activePage());
ok(doc.getElementById('page-coding').classList.contains('active'), '#page-coding active', activePage());
ok(activeEditorView() === 'editor-view-html', 'HTML editor ko‘rinadi', activeEditorView());
ok(activeTab() === 'html', 'HTML tab aktiv', activeTab());
ok(doc.getElementById('htmlEditor').value === testCode, 'HTML editor dars kodini oldi', doc.getElementById('htmlEditor').value.slice(0, 40));
ok(!!doc.getElementById('lsReturnToLessonBtn'), '"1-darsga qaytish" tugmasi chiqdi');

console.log('\n[CASE 2] Foydalanuvchi avval PYTHON tanlagan holat — asosiy bug senariysi');
// foydalanuvchi Playgroundda native tilni tanlaydi (DOM select holati)
doc.getElementById('codingLangSelect').value = 'python';
w.openCodePlaygroundWithHtml(testCode, ctx);
ok(activeEditorView() === 'editor-view-html', 'HTML editor ko‘rinadi (python holatida ham)', activeEditorView());
ok(activeTab() === 'html', 'HTML tab aktiv', activeTab());
const sel = doc.getElementById('codingLangSelect').value;
ok(sel === 'web', 'Lang select web ga qaytdi', sel);
ok(doc.getElementById('htmlEditor').value === testCode, 'HTML editor dars kodini oldi');

console.log('\n[CASE 3] CSS/JS bufferlari tozalanganmi');
ok(doc.getElementById('cssEditor').value === '', 'CSS bo‘sh');
ok(doc.getElementById('jsEditor').value === '', 'JS bo‘sh');

console.log('\n[CASE 4] HTML+CSS+JS (loyiha) varianti');
w.openCodePlaygroundWithCode('<h1>A</h1>', 'h1{color:red}', 'console.log(1)', ctx);
ok(activeEditorView() === 'editor-view-html', 'HTML editor ko‘rinadi', activeEditorView());
ok(doc.getElementById('cssEditor').value === 'h1{color:red}', 'CSS kodi keldi');
ok(doc.getElementById('jsEditor').value === 'console.log(1)', 'JS kodi keldi');

console.log(failed ? '\n❌ ' + failed + ' ta test o‘tmadi — BUG TASDIQLANDI' : '\n✅ HAMMASI OK');
process.exit(failed ? 1 : 0);
