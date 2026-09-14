/* 7-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
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
window.__itGetCurrentUser = function () { return { username: 'student7', email: 's7@mail.com' }; };
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
function waitFor(fn, cb, tries) {
  if (!tries && tries !== 0) tries = 40;
  if (fn() || tries <= 0) { cb(); return; }
  setTimeout(function () { waitFor(fn, cb, tries - 1); }, 100);
}

const API = window.CoursesAPI;
const found = API.findLesson('html', 'html-d7');
console.log('7-dars:', found && found.lesson.title);
ok(!!found && found.lesson.number === 7, '7-dars mavjud va raqami 7');

window.Lessons.openCourse('html');
window.Lessons.openLesson('html', 'html-d7');

const wrap = doc.querySelector('#lsLessonContainer');

// === 1. TEZKOR ESLATMA — bittadan chiqadi ===
const rq = doc.querySelector('#lsReviewQuiz');
ok(!!rq, 'Tezkor eslatma bloki bor');
ok(rq.textContent.includes('Savol 1 / 6'), 'Review savollar BITTADAN (1/6)');
ok(!rq.textContent.includes('Savol 2'), '2-savol hali yashirin');
click(rq.querySelector('[data-opt="1"]'));
ok(rq.querySelector('.ls-ex-feedback.bad') !== null, 'Xato javob → hint ko‘rinadi');
const rqAnswers = ['0', '1', '0', '2', '1', '1'];
let rqStep = 0;
function playReview() {
  const opts = doc.querySelectorAll('#lsReviewQuiz [data-opt]');
  if (!opts.length || rqStep >= rqAnswers.length) { afterReview(); return; }
  click(opts[Number(rqAnswers[rqStep])]);
  rqStep++;
  setTimeout(playReview, 1000);
}
function afterReview() {
  const rq2 = doc.querySelector('#lsReviewQuiz');
  ok(rq2.querySelector('.ls-game-win') !== null, 'Review tugadi — win xabari');
  checkSections();
}
function checkSections() {
  ok(wrap.textContent.includes('maydon nomi'), 'Section: label');
  ok(wrap.textContent.includes('yozish maydoni'), 'Section: input');
  ok(wrap.textContent.includes('yordamchi matn'), 'Section: placeholder');
  ok(wrap.textContent.includes('email uchun'), 'Section: email');
  ok(wrap.textContent.includes('yashirish'), 'Section: password');
  ok(wrap.textContent.includes('bosadigan tugma') || wrap.textContent.includes('tugma 🔘'), 'Section: button');
  ok(wrap.textContent.includes('birlashtiramiz'), 'Section: to‘liq forma');
  ok(wrap.textContent.includes('CSSga o‘tish'), 'Section: CSSga o‘tish');
  ok(wrap.textContent.includes('English tilida'), 'Section: English rang nomlari');
  ok(wrap.textContent.includes('orqa fon rangi'), 'Section: background-color');
  ok(wrap.textContent.includes('getElementById'), 'Section: JavaScript getElementById');
  ok(wrap.textContent.includes('qiymat'), 'Section: input.value');
  ok(wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length >= 8, 'CODINGDA SINAB KO‘R tugmalari bor (' + wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length + ')');
  ok(wrap.querySelectorAll('.ls-img-preview-frame').length >= 6, 'Real preview iframe lar bor');
  ok(wrap.querySelectorAll('.ls-livedemo').length >= 2, 'Live demo (placeholder + JS) bor');

  const games = wrap.querySelectorAll('.ls-game-card');
  ok(games.length === 3, '3 ta o‘yin kartasi bor (aslida: ' + games.length + ')');
  ok(games[0].className.indexOf('locked') === -1, 'O‘yin 1 ochiq');
  ok(games[1].className.indexOf('locked') !== -1, 'O‘yin 2 yopiq (one-by-one)');
  playTypedoc();
}
function playGame(gameId, answers, after, step) {
  const b = doc.querySelector('[data-game-body="' + gameId + '"]');
  if (!b || step >= answers.length) { after(); return; }
  const opts = b.querySelectorAll('[data-opt]');
  const cur = opts.length ? Number(opts[0].getAttribute('data-qi')) : -1;
  if (!opts.length || cur !== step) { setTimeout(function () { playGame(gameId, answers, after, step); }, 100); return; }
  click(opts[Number(answers[step])]);
  step++;
  setTimeout(function () { playGame(gameId, answers, after, step); }, 120);
}
function playTypedoc() {
  const g1 = doc.querySelector('[data-game-body="l7typedoc"]');
  ok(g1 && g1.textContent.includes('Email'), 'O‘yin 1 (Type Doctor) ochiq');
  playGame('l7typedoc', ['1', '2', '1'], function () {
    waitFor(function () {
      const g2 = doc.querySelector('[data-game-body="l7colorquiz"]');
      return g2 && g2.querySelector('[data-opt]') !== null;
    }, function () {
      ok(true, 'O‘yin 2 (Rangni toping) avtomatik ochildi');
      playColor();
    });
  }, 0);
}
function playColor() {
  playGame('l7colorquiz', ['1', '2', '1'], function () {
    waitFor(function () {
      const g3 = doc.querySelector('[data-game-body="l7build"]');
      return g3 && g3.querySelector('[data-opt]') !== null;
    }, function () {
      ok(true, 'O‘yin 3 (Formani yig‘ing) avtomatik ochildi');
      playBuild();
    });
  }, 0);
}
function playBuild() {
  playGame('l7build', ['0', '1', '0', '1'], function () {
    waitFor(function () {
      const g3 = doc.querySelector('[data-game-body="l7build"]');
      return g3 && g3.textContent.includes('Forma tayyor');
    }, function () {
      ok(true, '✅ Forma tayyor! xabari ko‘rsatildi');
      checkProgress();
    });
  }, 0);
}
function checkProgress() {
  const progEl = doc.querySelector('#lsGamesProgress');
  ok(progEl && progEl.textContent.includes('3/3'), 'O‘yinlar progressi 3/3 (aslida: ' + (progEl ? progEl.textContent.trim() : '?') + ')');
  doExercises();
}
function doExercises() {
  setVal(doc.querySelector('#lsExCode-l7ex1'), '<input id="name" type="text" placeholder="Ismingizni kiriting">');
  click(doc.querySelector('[data-ex-run="l7ex1"]'));
  ok(/Mashq 1\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 1 ✅ (text input)');

  setVal(doc.querySelector('#lsExCode-l7ex2'), '<input id="email" type="email" placeholder="Emailingiz">');
  click(doc.querySelector('[data-ex-run="l7ex2"]'));
  ok(/Mashq 2\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 2 ✅ (email input)');

  setVal(doc.querySelector('#lsExCode-l7ex3'), '<input type="text">');
  click(doc.querySelector('[data-ex-run="l7ex3"]'));
  ok(/Mashq 3\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ⬜ (form yo‘q — fake success YO‘Q)');
  setVal(doc.querySelector('#lsExCode-l7ex3'), '<form>\n  <input id="name" type="text" placeholder="Ismingizni kiriting">\n  <input id="email" type="email" placeholder="Emailingiz">\n  <button>Yuborish</button>\n</form>');
  click(doc.querySelector('[data-ex-run="l7ex3"]'));
  ok(/Mashq 3\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ✅ (form + inputlar + button)');

  ok(doc.querySelector('#lsStartQuizBtn') !== null, '3/3 mashq — Test ochildi');
  // Bonus JS — testni bloklamasin
  setVal(doc.querySelector('#lsExCode-l7bonusjs'), 'const button = document.getElementById("sendBtn");\nbutton.addEventListener("click", function() {\n  const name = document.getElementById("name").value;\n  alert("Salom, " + name + "! 👋");\n});');
  click(doc.querySelector('[data-ex-run="l7bonusjs"]'));
  ok(doc.querySelector('#lsStartQuizBtn') !== null, 'Bonus bajarildi — test HAMON ochiq');
  ok(wrap.textContent.includes('KEYINGI DARS: 8-DARS'), '8-dars teaser bor');

  click(doc.querySelector('#lsStartQuizBtn'));
  const quizWrap = doc.querySelector('#lsLessonContainer');
  ok(quizWrap.querySelectorAll('.ls-quiz-option').length === 4, 'Test bosqichi ochildi');
  const map = [
    { key: '<form> nima?', ans: 'kiritish uchun hudud' },
    { key: 'atributi nima qiladi?', ans: 'bog‘laydi' },
    { key: 'yozadigan maydon', ans: '<input>' },
    { key: 'Email kiritish uchun', ans: 'type="email"' },
    { key: 'placeholder nima?', ans: 'yordamchi matn' },
    { key: 'Parolni yashirish', ans: 'type="password"' },
    { key: 'color: red;', ans: 'MATN rangini' },
    { key: 'background-color: blue;', ans: 'ORQA FONI' },
    { key: 'REVIEW (3-dars)', ans: 'yagona nomi' },
    { key: 'id orqali topish', ans: 'getElementById' }
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
    ok(resultText.includes('MASTERED') || resultText.includes('8-DARS') || resultText.includes('o‘tdingiz') || resultText.includes('Tabriklay'), 'Master/8-dars unlock holati ko‘rsatildi');
    const saveKey = Object.keys(store).find(function (k) { return k.indexOf('darslar_state_v1') !== -1; });
    ok(!!saveKey && store[saveKey].indexOf('html-d7') !== -1, 'Progress localStorage da saqlandi');

    console.log('\nconsole errors: ' + errors.length);
    errors.slice(0, 5).forEach(function (e) { console.log('ERR: ' + e); });
    console.log((failed === 0 && errors.length === 0) ? '\nLESSON7 PASSED' : '\nLESSON7 FAILED');
    process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
  }
  playQuiz();
}
playReview();

