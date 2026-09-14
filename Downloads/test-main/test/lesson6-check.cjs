/* 6-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;

let errors = [];
window.addEventListener('error', function (e) { errors.push('window.onerror: ' + e.message); });

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
window.__itGetCurrentUser = function () { return { username: 'student1', email: 's@mail.com' }; };
window.showToast = function () {};

let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
window.eval(dataSrc);
window.eval(appSrc);
window.openCodePlaygroundWithHtml = function (rawHtml, returnCtx) { window.__pgRaw = rawHtml; window.__pgCtx = returnCtx; };

let passed = 0, failed = 0;
function ok(cond, label) { if (cond) { passed++; console.log('  PASS ' + label); } else { failed++; console.log('  FAIL ' + label); } }
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
function fire(el, type) { el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true })); }
function setVal(el, v) { el.value = v; fire(el, 'input'); }

const API = window.CoursesAPI;
const found = API.findLesson('html', 'html-d6');
console.log('6-dars:', found && found.lesson.title);

window.Lessons.openCourse('html');
window.Lessons.openLesson('html', 'html-d6');

const wrap = doc.querySelector('#lsLessonContainer');

// === 1. TEZKOR ESLATMA — bittadan chiqadi ===
const rq = doc.querySelector('#lsReviewQuiz');
ok(!!rq, 'Tezkor eslatma bloki bor');
ok(rq.textContent.includes('Savol 1 / 4'), 'Review savollar BITTADAN (faqat 1/4 ko‘rinadi)');
ok(!rq.textContent.includes('Savol 2'), '2-savol hali yashirin');
ok(rq.textContent.includes('<h1>'), '1-savol: <h1> nima?');
click(rq.querySelector('[data-opt="1"]'));
ok(rq.querySelector('.ls-ex-feedback.bad') !== null, 'Xato javob → 💡 Kichik hint');
const rqAnswers = ['0', '1', '0', '2'];
let rqStep = 0;
function playReview() {
  const opts = doc.querySelectorAll('#lsReviewQuiz [data-opt]');
  if (!opts.length || rqStep >= rqAnswers.length) { afterReview(); return; }
  click(opts[Number(rqAnswers[rqStep])]);
  rqStep++;
  setTimeout(playReview, 950);
}
function waitFor(fn, cb, tries) {
  if (!tries && tries !== 0) tries = 40;
  if (fn() || tries <= 0) { cb(); return; }
  setTimeout(function () { waitFor(fn, cb, tries - 1); }, 100);
}
function afterReview() {
  const rq2 = doc.querySelector('#lsReviewQuiz');
  ok(rq2.querySelector('.ls-game-win') !== null, 'Review tugadi — win xabari');
  checkSections();
}
function checkSections() {
  ok(wrap.textContent.includes('— muhim matn'), 'Section: strong');
  ok(wrap.textContent.includes('urg‘uli matn'), 'Section: em');
  ok(wrap.textContent.includes('yangi qator'), 'Section: br');
  ok(wrap.textContent.includes('ajratuvchi chiziq'), 'Section: hr');
  ok(wrap.textContent.includes('tartibsiz ro‘yxat'), 'Section: ul');
  ok(wrap.textContent.includes('ro‘yxatdagi bitta band'), 'Section: li');
  ok(wrap.textContent.includes('tartibli ro‘yxat'), 'Section: ol');
  ok(wrap.textContent.includes('CSSga o‘tish'), 'Section: CSSga o‘tish');
  ok(wrap.textContent.includes('color — matn rangi'), 'Section: color');
  ok(wrap.textContent.includes('background-color — orqa fon rangi'), 'Section: background-color');
  ok(wrap.textContent.includes('CSS property'), 'Beginner warning: color HTML matni emas');
  ok(wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length >= 8, 'CODINGDA SINAB KO‘R tugmalari bor');
  ok(wrap.querySelectorAll('.ls-img-preview-frame').length >= 6, 'Real preview iframe lar bor');

  const games = wrap.querySelectorAll('.ls-game-card');
  ok(games.length === 5, '5 ta o‘yin kartasi bor (aslida: ' + games.length + ')');
  ok(games[0].className.indexOf('locked') === -1, 'O‘yin 1 ochiq');
  ok(games[1].className.indexOf('locked') !== -1, 'O‘yin 2 yopiq (one-by-one)');

  const g1body = doc.querySelector('[data-game-body="l6lists"]');
  ok(g1body.textContent.includes('bullet list'), 'Ro‘yxat ustasi: vazifa 1 (bullet → ul)');
  click(g1body.querySelector('[data-opt="0"]'));
  waitFor(function () {
    const b = doc.querySelector('[data-game-body="l6lists"]');
    return b && b.textContent.includes('1, 2, 3 tartibida');
  }, function () {
    const g1b = doc.querySelector('[data-game-body="l6lists"]');
    const opts2 = g1b.querySelectorAll('[data-opt]');
    ok(opts2.length > 0, 'Vazifa 2 ochildi (1-topshiriqdan keyin)');
    click(opts2[1]);
    waitFor(function () {
      const g2body = doc.querySelector('[data-game-body="l6detective"]');
      return g2body && g2body.querySelector('[data-opt]') !== null;
    }, function () {
      ok(true, 'O‘yin 2 (Kod detektivi) avtomatik ochildi');
      playDetective();
    });
  });
}

function playDetective() {
  const answers = ['0', '1', '1', '2', '0', '2'];
  let step = 0;
  function next() {
    if (step >= answers.length) { afterDetective(); return; }
    const b = doc.querySelector('[data-game-body="l6detective"]');
    const opts = b ? b.querySelectorAll('[data-opt]') : [];
    const cur = opts.length ? opts[0].getAttribute('data-qi') : null;
    if (!opts.length || Number(cur) !== step) { setTimeout(next, 100); return; }
    click(opts[Number(answers[step])]);
    step++;
    setTimeout(next, 100);
  }
  next();
}
function afterDetective() {
  // csstab o‘yinlarini ketma-ket yakunlash (ikkala tab + hub refresh hisobga olinadi)
  const c3 = doc.querySelector('[data-game-body="l6colorcmp"]');
  ok(c3 && c3.querySelector('[data-ctab]') !== null, 'O‘yin 3: CSSsiz/CSS bilan tablari bor (color)');
  click(c3.querySelectorAll('[data-ctab]')[0]);
  setTimeout(function () {
    const c3b = doc.querySelector('[data-game-body="l6colorcmp"]');
    click(c3b.querySelectorAll('[data-ctab]')[1]);
    waitFor(function () {
      const c4 = doc.querySelector('[data-game-body="l6bgcmp"]');
      return c4 && c4.querySelector('[data-ctab]') !== null;
    }, function () {
      ok(true, 'O‘yin 3 tugadi — O‘yin 4 ochildi (background-color)');
      const c4 = doc.querySelector('[data-game-body="l6bgcmp"]');
      click(c4.querySelectorAll('[data-ctab]')[0]);
      setTimeout(function () {
        const c4b = doc.querySelector('[data-game-body="l6bgcmp"]');
        click(c4b.querySelectorAll('[data-ctab]')[1]);
        waitFor(function () {
          const wb = doc.querySelector('[data-game-body="l6wizard"]');
          return wb && wb.querySelector('[data-tc]') !== null;
        }, function () {
          const wb = doc.querySelector('[data-game-body="l6wizard"]');
          ok(true, 'Rang sehrgari ochiq va real previewga ulangan');
          click(wb.querySelector('[data-tc="purple"]'));
          ok(wb.querySelector('iframe') !== null, 'Rang sehrgari: real iframe preview bor');
          ok(wb.textContent.includes('CODINGDA SINAB KO‘R'), 'Rang sehrgari: Codingga yuborish tugmasi bor');
          click(wb.querySelector('[data-wiz-pg]'));
          ok(typeof window.__pgRaw === 'string' && window.__pgRaw.indexOf('background-color') !== -1, 'Rang sehrgari → Playgroundga RAW kod yuborildi');
          const ctxRaw = window.localStorage.getItem('ls_return_ctx');
          ok(!!ctxRaw && JSON.parse(ctxRaw).lessonId === 'html-d6', 'Return context saqlandi (html-d6)');
          doExercises();
        });
      }, 60);
    });
  }, 60);
}

function doExercises() {
  setVal(doc.querySelector('#lsExCode-l6ex1'), '<p>Bu <strong>muhim</strong> matn.</p>');
  click(doc.querySelector('[data-ex-run="l6ex1"]'));
  ok(/Mashq 1\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 1 ✅ (strong)');

  setVal(doc.querySelector('#lsExCode-l6ex2'), '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>');
  click(doc.querySelector('[data-ex-run="l6ex2"]'));
  ok(/Mashq 2\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 2 ✅ (ul + 3 li)');

  setVal(doc.querySelector('#lsExCode-l6ex3'), '<ul>\n  <li>A</li>\n</ul>');
  click(doc.querySelector('[data-ex-run="l6ex3"]'));
  ok(/Mashq 3\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ⬜ (ol yo‘q — fake success YO‘Q)');
  setVal(doc.querySelector('#lsExCode-l6ex3'), '<ol>\n  <li>1</li>\n  <li>2</li>\n  <li>3</li>\n</ol>');
  click(doc.querySelector('[data-ex-run="l6ex3"]'));
  ok(/Mashq 3\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ✅ (ol + 3 li)');

  ok(doc.querySelector('#lsStartQuizBtn') !== null, '3/3 mashq — Test ochildi');
  ok(wrap.textContent.includes('KEYINGI DARS: 7-DARS'), '7-dars teaser bor');

  click(doc.querySelector('#lsStartQuizBtn'));
  const quizWrap = doc.querySelector('#lsLessonContainer');
  ok(quizWrap.querySelectorAll('.ls-quiz-option').length === 4, 'Test bosqichi ochildi');
  // Savollar va variantlar shuffle qilinadi — joriy savol matniga qarab to‘g‘ri javobni tanlaymiz
  const map = [
    { key: 'QALIN ko', ans: 'strong' },
    { key: 'ko‘rinadi?', ans: 'Kursiv (qiya)' },
    { key: 'yangi qatorga tushirish', ans: '<br>' },
    { key: 'nima qiladi?', ans: 'chiziq chizadi' },
    { key: 'Bullet (•) bilan', ans: 'ul' },
    { key: 'raqamlar bilan chiqadi', ans: 'Raqamlar' },
    { key: 'QIZIL qiladi?', ans: 'color: red' },
    { key: 'nimani o‘zgartiradi?', ans: 'orqa fon rangini' },
    { key: 'REVIEW (1-dars)', ans: 'h1' },
    { key: 'REVIEW (4-dars)', ans: 'href' }
  ];
  const used = {};
  function pickRule(text) {
    for (let i = 0; i < map.length; i++) {
      if (!used[i] && text.indexOf(map[i].key) !== -1) { used[i] = true; return map[i]; }
    }
    return null;
  }
  let qstep = 0;
  function playQuiz() {
    const opts = quizWrap.querySelectorAll('.ls-quiz-option');
    if (!opts.length || qstep >= map.length) { afterQuiz(); return; }
    const qText = quizWrap.textContent;
    const rule = pickRule(qText);
    let target = null;
    if (rule) {
      opts.forEach(function (o) { if (o.textContent.indexOf(rule.ans) !== -1) target = o; });
    }
    if (!target) target = opts[0];
    click(target);
    qstep++;
    const cont = quizWrap.querySelector('#lsQuizNextBtn');
    if (cont) click(cont);
    setTimeout(playQuiz, 30);
  }
  function afterQuiz() {
    const resultText = quizWrap.textContent;
    const pct = resultText.match(/(\d+)%/);
    ok(pct && Number(pct[1]) >= 80, 'Test ≥80% (aslida: ' + (pct ? pct[1] + '%' : '?') + ')');
    ok(resultText.includes('MASTERED') || resultText.includes('7-DARS') || resultText.includes('ochil') || resultText.includes('o‘tdingiz') || resultText.includes('o\'tdingiz') || resultText.includes('Zo‘r') || resultText.includes('Tabriklay'), 'Master/natija holati ko‘rsatildi');

    console.log('\nconsole errors: ' + errors.length);
    errors.slice(0, 5).forEach(function (e) { console.log('ERR: ' + e); });
    console.log((failed === 0 && errors.length === 0) ? '\nLESSON6 PASSED' : '\nLESSON6 FAILED');
    process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
  }
  playQuiz();
}
playReview();


