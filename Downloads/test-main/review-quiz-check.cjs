/* REVIEW QUIZ (Tezkor eslatma) runtime test — 6/7/8-darslar, real DOM */
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
window.__itGetCurrentUser = function () { return { username: 'rq', email: 'r@mail.com' }; };
window.showToast = function () {};
window.confirm = function () { return true; };
store.__scrollY = 0;
Object.defineProperty(window, 'scrollY', { get: () => store.__scrollY, configurable: true });
window.scrollTo = function (o) { if (o && typeof o === 'object') store.__scrollY = o.top || 0; };
window.HTMLElement.prototype.getBoundingClientRect = function () { return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }; };

let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
window.eval(dataSrc);
window.eval(appSrc);

const sleep = ms => new Promise(r => setTimeout(r, ms));
let passed = 0, failed = 0;
function ok(cond, label) { if (cond) { passed++; console.log('  PASS ' + label); } else { failed++; console.log('  FAIL ' + label); } }
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }

const API = window.CoursesAPI;

(async function main() {
  for (const lessonId of ['html-d6', 'html-d7', 'html-d8']) {
    const found = API.findLesson('html', lessonId);
    const lesson = found.lesson;
    const qs = lesson.content.reviewQuiz.questions;
    console.log('\n=== ' + lesson.number + '-dars reviewQuiz (' + qs.length + ' savol) ===');
    window.Lessons.openLesson('html', lessonId);
    await sleep(30);
    const body = doc.querySelector('#lsReviewQuiz [data-rq-body]');
    ok(!!body, lesson.number + '-dars: reviewQuiz render bo\'ldi');

    const shownTexts = [];
    for (let i = 0; i < qs.length; i++) {
      const step = body.querySelector('.ls-rq-step');
      const qEl = body.querySelector('.ls-rq-q');
      ok(step && step.textContent.trim() === 'Savol ' + (i + 1) + ' / ' + qs.length,
        lesson.number + '-dars: progress "' + (step ? step.textContent.trim() : '?') + '"');
      shownTexts.push(qEl ? qEl.textContent.trim() : '');
      // to'g'ri javobni bosamiz
      const opts = Array.from(body.querySelectorAll('[data-opt]'));
      const correct = opts[qs[i].a];
      click(correct);
      await sleep(950); // keyingi savol 900ms dan keyin render
    }
    // oxirgi ekranda tugash xabari
    ok(body.textContent.includes('Tezkor eslatma tugadi'), lesson.number + '-dars: ' + qs.length + '-savoldan keyin tugadi (loop YO\'Q)');
    // duplicate savol tekshiruvi (render ketma-ketligi = data ketma-ketligi)
    // NOTE: data'da markdown (**, `) bor — fmt() uni formatlaydi, shuning uchun markdown/whitespace normalizatsiya qilinadi
    const norm = s => String(s).replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
    const expected = qs.map(q => norm(q.q));
    const actual = shownTexts.map(norm);
    ok(JSON.stringify(actual) === JSON.stringify(expected), lesson.number + '-dars: savollar ketma-ketligi aynan data ketma-ketligi (duplicate YO\'Q)');
    const uniq = new Set(actual).size;
    ok(uniq === expected.length, lesson.number + '-dars: ' + uniq + '/' + expected.length + ' unique savol ko\'rsatildi');
    // progress localStorage
    const pRaw = Object.keys(store).find(k => k.indexOf('darslar_state_v1') !== -1);
    ok(!!pRaw && store[pRaw].indexOf(lessonId) !== -1 && store[pRaw].indexOf('reviewQuiz') !== -1, lesson.number + '-dars: reviewQuiz done localStorage\'da');
    // RESTART: darsni qayta ochish — yangi attempt, duplicate listener/loop yo'q
    window.Lessons.openCourse('html');
    window.Lessons.openLesson('html', lessonId);
    await sleep(30);
    const body2 = doc.querySelector('#lsReviewQuiz [data-rq-body]');
    ok(body2 && body2.querySelector('.ls-rq-step') && body2.querySelector('.ls-rq-step').textContent.includes('Savol 1 /'), lesson.number + '-dars: qayta ochish — Savol 1 dan boshlandi (eski holat qolmadi)');
    // birinchi savolga yana javob berish mumkin (listener faqat bir marta ishlaydi)
    const opts2 = Array.from(body2.querySelectorAll('[data-opt]'));
    click(opts2[qs[0].a]);
    await sleep(950);
    ok(body2.querySelector('.ls-rq-step') && body2.querySelector('.ls-rq-step').textContent.includes('Savol 2 / '),
      lesson.number + '-dars: restartda 2-savolga o\'tdi (double-listener YO\'Q)');
  }
  console.log('\nRESULT: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
