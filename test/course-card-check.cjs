/* COURSE CARD — duplicate action tekshiruvi (jsdom)
   Har bir kurs kartasida FAQAT BITTA action bo'lishi kerak:
   butun karta clickable. Alohida "Boshlash/Davom ettirish" tugmasi YO'Q.
   Status = pill (span, button emas).
   Run: node test/course-card-check.cjs */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window;
const doc = w.document;

const visitedPages = [];
w.__itShowPage = (name) => { visitedPages.push(name); };
w.__itGetCurrentUser = () => ({ username: 'testuser', email: 'test@mail.com' });
w.showToast = (msg, type) => { w.__lastToast = { msg, type }; };
w.confirm = () => true;

w.eval(dataSrc);
w.eval(appSrc);

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }

const API = w.CoursesAPI;

/* Real progress: html=1 dars (davom etmoqda), css=hammasi (tugallangan), qolganlar=boshlanmagan */
const htmlCourse = API.getCourse('html');
const cssCourse = API.getCourse('css');
const store = {
  levels: {},
  progress: {
    html: { completed: { [htmlCourse.lessons[0].id]: { at: Date.now(), score: 10 } }, lastLessonId: htmlCourse.lessons[0].id, lastVisit: Date.now() },
    css: { completed: {}, lastVisit: Date.now() }
  }
};
cssCourse.lessons.forEach(l => { store.progress.css.completed[l.id] = { at: Date.now() - 86400000, score: 10 }; });
w.localStorage.setItem('darslar_state_v1::testuser', JSON.stringify(store));

/* Darslar sahifasini render qilish */
w.Lessons.handlePage('lessons');
const grid = doc.querySelector('#lsCoursesGrid');
ok(!!grid && grid.querySelectorAll('.ls-course-card').length > 0, 'Kurs kartalari render qilindi');

const cards = Array.from(doc.querySelectorAll('#lsCoursesGrid .ls-course-card'));
const ACTION_WORDS = /Boshlash|Davom ettirish|Qayta ko‘rish|Qayta ko'rish/;

section('HAR BIR KARDA BITTA ACTION (button YO\'Q)');
cards.forEach(card => {
  const name = card.querySelector('h4') ? card.querySelector('h4').textContent : '?';
  const btns = card.querySelectorAll('button');
  const statusEl = card.querySelector('.ls-status');
  ok(btns.length === 0, name + ': alohida button YO\'Q (' + btns.length + ' ta topildi)');
  ok(statusEl && !ACTION_WORDS.test(statusEl.textContent), name + ': status faqat holat → "' + statusEl.textContent.trim() + '"');
  ok(!!card.querySelector('.ls-course-state'), name + ': progress ring / ✓ belgisi bor');
  ok(card.getAttribute('role') === 'button' && card.getAttribute('tabindex') === '0', name + ': karta clickable (role=button, tabindex)');
});

section('STATUS HOLATLARI (real progress)');
const findCard = (id) => cards.find(c => c.getAttribute('data-course') === id);
ok(findCard('html').querySelector('.ls-status').textContent.includes('Davom etmoqda'), 'HTML (1/33): "Davom etmoqda"');
ok(findCard('css').querySelector('.ls-status').textContent.includes('Tugallangan'), 'CSS (100%): "✅ Tugallangan" + ✓ belgisi');
ok(findCard('css').querySelector('.ls-state-done') !== null, 'CSS: tugallangan ✓ holati render');
const someIdle = cards.find(c => c.getAttribute('data-course') !== 'html' && c.getAttribute('data-course') !== 'css');
ok(someIdle.querySelector('.ls-status').textContent.includes('Boshlanmagan'), someIdle.querySelector('h4').textContent + ' (0%): "Boshlanmagan"');
ok(findCard('html').querySelector('.ls-state-ring-pct').textContent.includes('3'), 'HTML ring: real % ko\'rinadi');

section('CLICK — YAGONA ACTION (butun karta)');
const htmlCard = findCard('html');
visitedPages.length = 0;
htmlCard.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const openCalls = visitedPages.filter(p => p === 'lessonCourse').length;
ok(openCalls === 1, 'Card click → kurs FAQAT 1 marta ochiladi (' + openCalls + ' chaqiruv)');
const courseHead = doc.querySelector('#lsCourseContainer h3');
ok(courseHead && courseHead.textContent.trim() === 'HTML', 'openCourse real: kurs sahifasi hero sarlavhasi "HTML" render');

/* Klaviatura bilan ochish (Enter) */
visitedPages.length = 0;
w.Lessons.handlePage('lessons');
const pyCard = Array.from(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')).find(c => c.getAttribute('data-course') === 'python');
pyCard.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
const head2 = doc.querySelector('#lsCourseContainer h3');
ok(visitedPages.filter(p => p === 'lessonCourse').length === 1 && head2 && head2.textContent.trim() === 'Python', 'Keyboard Enter → kurs ochiladi (Python, bitta chaqiruv)');

/* Tugallangan kurs ham card click bilan ochiladi */
visitedPages.length = 0;
w.Lessons.handlePage('lessons');
const cssCard2 = Array.from(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')).find(c => c.getAttribute('data-course') === 'css');
cssCard2.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok(visitedPages.filter(p => p === 'lessonCourse').length === 1, 'Tugallangan kurs: card click → 1 marta');
ok(doc.querySelector('#lsCourseContainer h3').textContent.trim() === 'CSS', 'Tugallangan kurs sahifasi "CSS"');

console.log('\n=========================================');
console.log('NATIJA: ' + passed + ' PASS, ' + failed + ' FAIL');
process.exit(failed ? 1 : 0);