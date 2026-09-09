/* GENERIC Lesson→Coding return context test — barcha darslar uchun */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;

const store = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: k => (store[k] == null ? null : store[k]),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
  }, configurable: true
});
window.__itShowPage = function (name) {
  doc.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = doc.querySelector('#page-' + name);
  if (pg) pg.classList.add('active');
};
window.__itGetCurrentUser = function () { return { username: 'generic', email: 'g@mail.com' }; };
window.showToast = function () {};
window.confirm = function () { return true; };
// jsdom scroll simulyatsiyasi: scrollY getter + ishlaydigan scrollTo
store.__scrollY = 0;
Object.defineProperty(window, 'scrollY', { get: () => store.__scrollY, configurable: true });
window.scrollTo = function (opts) { if (typeof opts === 'object' && opts) store.__scrollY = opts.top || 0; else if (typeof opts === 'number') store.__scrollY = arguments[1] || 0; };
Object.defineProperty(window, 'pageYOffset', { get: () => store.__scrollY, configurable: true });
// jsdom'da barcha rect.top=0 — sectionlarga id bo'yicha real absolyut pozitsiya beramiz
window.HTMLElement.prototype.getBoundingClientRect = function () {
  const m = this.id && /^ls-sec-(\d+)$/.exec(this.id);
  const top = m ? (Number(m[1]) * 500 + 400) : 0;
  return { top: top, bottom: top + 300, left: 0, right: 800, width: 800, height: 300 };
};

let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
window.eval(dataSrc);
window.eval(appSrc);
// Coding stub: ctx ni saqlab, showPage holatini simulyatsiya qiladi
window.openCodePlaygroundWithHtml = function (rawHtml, returnCtx) {
  window.__pgCtx = returnCtx;
  window.__itShowPage('coding');
  window.scrollTo(0, 0);
};

let passed = 0, failed = 0;
function ok(cond, label) { if (cond) { passed++; console.log('  PASS ' + label); } else { failed++; console.log('  FAIL ' + label); } }
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const API = window.CoursesAPI;
const htmlCourse = API.findCourse ? API.findCourse('html') : null;
const course = htmlCourse || API.findLesson('html', 'html-d1').course;

(async function main() {
  // HAR BIR dars: section tugmasi → ctx (sectionId + scrollY) → Coding → Return → scroll tiklanishi
  const lessons = course.lessons.filter(l => l.content && l.content.sections && l.content.sections.length &&
    l.content.sections.some(s => s.playground));
  for (const lesson of lessons) {
    window.Lessons.openCourse(course.id);
    window.Lessons.openLesson(course.id, lesson.id);
    await sleep(30);
    const btn = doc.querySelector('.ls-open-playground[data-ls-raw-code]');
    if (!btn) { ok(false, lesson.number + '-dars: playground tugma topilmadi'); continue; }
    // User darsning o'rtasiga scroll qildi (simulyatsiya)
    const sec = btn.closest('.ls-content-section');
    const secIdx = Array.prototype.indexOf.call(doc.querySelectorAll('#lsLessonContainer .ls-content-section'), sec);
    const SEC_TOP = secIdx * 500 + 400;
    store.__scrollY = 1500 + secIdx * 100;
    click(btn);
    await sleep(10);
    let ctx = null;
    try { ctx = JSON.parse(store['ls_return_ctx']); } catch (e) {}
    ok(!!ctx && ctx.lessonId === lesson.id, lesson.number + '-dars: ctx saqlandi (lessonId=' + lesson.id + ')');
    ok(ctx && typeof ctx.scrollY === 'number' && ctx.scrollY > 0, lesson.number + '-dars: scrollY saqlandi (' + (ctx && ctx.scrollY) + ')');
    ok(ctx && ctx.sectionId === 'ls-sec-' + secIdx, lesson.number + '-dars: sectionId saqlandi (' + (ctx && ctx.sectionId) + ')');
    // Return: returnFromCoding → openLesson → restore (async)
    window.Lessons.returnFromCoding();
    await sleep(500);
    // kutish: section top - 24 (return paytida scroll 0)
    const EXPECT = SEC_TOP - 24;
    const restored = window.scrollY;
    ok(restored === EXPECT, lesson.number + '-dars: scroll sectionga tiklandi (' + restored + ' ≈ ' + EXPECT + ')');
    ok(!store['ls_return_ctx'], lesson.number + '-dars: ctx tozalandi');
    // Multiple cycle: yana Coding → Return
    const btn2 = doc.querySelector('.ls-open-playground[data-ls-raw-code]');
    store.__scrollY = 2500;
    click(btn2);
    await sleep(10);
    ctx = JSON.parse(store['ls_return_ctx'] || 'null');
    ok(ctx && ctx.scrollY === 2500 && ctx.lessonId === lesson.id, lesson.number + '-dars: 2-sikl yangi context (scrollY=2500)');
    window.Lessons.returnFromCoding();
    await sleep(500);
    ok(window.scrollY === EXPECT, lesson.number + '-dars: 2-sikl qaytish to‘g‘ri (' + window.scrollY + ')');
  }
  // Stale context: boshqa darsga ta'sir qilmasin
  window.Lessons.openCourse(course.id);
  window.Lessons.openLesson(course.id, lessons[0].id);
  await sleep(30);
  const btnA = doc.querySelector('.ls-open-playground[data-ls-raw-code]');
  store.__scrollY = 900;
  click(btnA); await sleep(10);
  const firstLessonId = lessons[0].id;
  const next = lessons[1];
  if (next) {
    store['ls_return_ctx'] = JSON.stringify({ courseId: course.id, lessonId: firstLessonId, scrollY: 900, sectionIndex: 1 });
    window.Lessons.openLesson(course.id, next.id);
    await sleep(500);
    ok(!store['ls_return_ctx'], 'Stale context boshqa dars ochilganda tozalandi');
    ok(window.scrollY === 0, 'Stale context boshqa darsni buzmaydi');
  }
  console.log('\nRESULT: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
