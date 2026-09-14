/* 8-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
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
window.__itGetCurrentUser = function () { return { username: 'student8', email: 's8@mail.com' }; };
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
const found = API.findLesson('html', 'html-d8');
console.log('8-dars:', found && found.lesson.title);
ok(!!found && found.lesson.number === 8, '8-dars mavjud va raqami 8');

window.Lessons.openCourse('html');
window.Lessons.openLesson('html', 'html-d8');

const wrap = doc.querySelector('#lsLessonContainer');

// === 1. TEZKOR ESLATMA — bittadan chiqadi ===
const rq = doc.querySelector('#lsReviewQuiz');
ok(!!rq, 'Tezkor eslatma bloki bor');
ok(rq.textContent.includes('Savol 1 / 10'), 'Review savollar BITTADAN (1/10)');
ok(!rq.textContent.includes('Savol 2'), '2-savol hali yashirin');
click(rq.querySelector('[data-opt="1"]'));
ok(rq.querySelector('.ls-ex-feedback.bad') !== null, 'Xato javob → hint ko‘rinadi');
const rqAnswers = ['0', '1', '0', '2', '1', '0', '1', '1', '2', '1'];
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
  ok(wrap.textContent.includes('bo‘sh qoldirish taqiqlangan'), 'Section: required');
  ok(wrap.textContent.includes('maydonga nom berish'), 'Section: name');
  ok(wrap.textContent.includes('boshlang‘ich qiymat'), 'Section: value');
  ok(wrap.textContent.includes('ko‘p qatorli matn'), 'Section: textarea');
  ok(wrap.textContent.includes('tanlash oynasi'), 'Section: select/option');
  ok(wrap.textContent.includes('CSS bilan formani chiroyli'), 'Section: CSS bilan forma');
  ok(wrap.textContent.includes('Elementlarni bittadan eslaymiz'), 'Section: birlashtirish qadamlari');
  ok(wrap.textContent.includes('kim nima qiladi'), 'Section: HTML+CSS+JS roli');
  ok(wrap.textContent.includes('submit'), 'Section: form submit');
  ok(wrap.textContent.includes('preventDefault'), 'Section: preventDefault');
  ok(wrap.textContent.includes('getElementById'), 'Section: getElementById');
  ok(wrap.textContent.includes('Salom, Ahatjon'), 'Section: real interaction');
  ok(wrap.textContent.includes('JavaScript validation'), 'Section: if/alert validation');
  ok(wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length >= 10, 'CODINGDA SINAB KO‘R tugmalari bor (' + wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length + ')');
  ok(wrap.querySelectorAll('.ls-img-preview-frame').length >= 6, 'Real preview iframe lar bor');
  ok(wrap.querySelectorAll('.ls-alert-demo').length >= 2, 'Demo alert tugmalari bor');
  ok(doc.querySelector('#lsStartQuizBtn') === null, 'Test hali YOPIQ (mashqlar bajarilmagan)');
  const games = wrap.querySelectorAll('.ls-game-card');
  ok(games.length === 3, '3 ta o‘yin kartasi bor (aslida: ' + games.length + ')');
  ok(games[0].className.indexOf('locked') === -1, 'O‘yin 1 ochiq');
  ok(games[1].className.indexOf('locked') !== -1, 'O‘yin 2 yopiq (one-by-one)');
  playDoctor();
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
function playDoctor() {
  const g1 = doc.querySelector('[data-game-body="l8reqdoc"]');
  ok(g1 && g1.textContent.includes('bo‘sh'), 'O‘yin 1 (Required Doctor) ochiq');
  playGame('l8reqdoc', ['0', '1', '1'], function () {
    waitFor(function () {
      const g2 = doc.querySelector('[data-game-body="l8formpick"]');
      return g2 && g2.querySelector('[data-opt]') !== null;
    }, function () {
      ok(true, 'O‘yin 2 (Formani tanla) avtomatik ochildi');
      playPick();
    });
  }, 0);
}
function playPick() {
  playGame('l8formpick', ['1', '2', '1'], function () {
    waitFor(function () {
      const g3 = doc.querySelector('[data-game-body="l8choice"]');
      return g3 && g3.querySelector('[data-opt]') !== null;
    }, function () {
      ok(true, 'O‘yin 3 (Choice Maker) avtomatik ochildi');
      playChoice();
    });
  }, 0);
}
function playChoice() {
  playGame('l8choice', ['1', '0', '1'], function () {
    waitFor(function () {
      const g3 = doc.querySelector('[data-game-body="l8choice"]');
      return g3 && g3.textContent.includes('Choice Maker');
    }, function () {
      ok(true, '✅ Choice Maker tugadi');
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
  setVal(doc.querySelector('#lsExCode-l8ex1'), '<input type="text" name="username" placeholder="Ismingiz">');
  click(doc.querySelector('[data-ex-run="l8ex1"]'));
  ok(/Mashq 1\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 1 ⬜ (required yo‘q — fake success YO‘Q)');
  setVal(doc.querySelector('#lsExCode-l8ex1'), '<input type="text" name="username" placeholder="Ismingiz" required>');
  click(doc.querySelector('[data-ex-run="l8ex1"]'));
  ok(/Mashq 1\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 1 ✅ (required qo‘shildi)');

  setVal(doc.querySelector('#lsExCode-l8ex2'), '<textarea placeholder="Xabaringizni yozing"></textarea>\n\n<select>\n  <option>HTML</option>\n  <option>CSS</option>\n</select>');
  click(doc.querySelector('[data-ex-run="l8ex2"]'));
  ok(/Mashq 2\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 2 ✅ (textarea + select)');

  setVal(doc.querySelector('#lsExCode-l8ex3'), '<form>\n  <input type="text">\n</form>');
  click(doc.querySelector('[data-ex-run="l8ex3"]'));
  ok(/Mashq 3\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ⬜ (to‘liq emas — fake success YO‘Q)');
  setVal(doc.querySelector('#lsExCode-l8ex3'), '<form>\n  <label for="name">Ismingiz</label>\n  <input id="name" name="username" type="text" placeholder="Ismingiz" required>\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" placeholder="Emailingiz" required>\n\n  <label for="message">Xabar</label>\n  <textarea id="message" name="message" placeholder="Xabaringiz"></textarea>\n\n  <button type="submit">Yuborish</button>\n</form>');
  click(doc.querySelector('[data-ex-run="l8ex3"]'));
  ok(/Mashq 3\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ✅ (ism + email + message + submit button)');

  ok(doc.querySelector('#lsStartQuizBtn') !== null, '3/3 mashq — Test ochildi');
  setVal(doc.querySelector('#lsExCode-l8bonuscss'), '<input type="text" placeholder="Ismingiz" style="color: white; background-color: #1e293b; border-radius: 10px;">\n\n<button type="submit" style="background-color: #6366f1; color: white;">Yuborish</button>');
  click(doc.querySelector('[data-ex-run="l8bonuscss"]'));
  ok(doc.querySelector('#lsStartQuizBtn') !== null, 'Bonus CSS bajarildi — test HAMON ochiq');
  setVal(doc.querySelector('#lsExCode-l8bonusjs'), 'const form = document.getElementById("myForm");\nconst nameInput = document.getElementById("name");\n\nform.addEventListener("submit", function (e) {\n  e.preventDefault();\n  if (!nameInput.value) {\n    alert("Ismingizni kiriting.");\n    return;\n  }\n  alert("Salom, " + nameInput.value + "! 👋");\n});');
  click(doc.querySelector('[data-ex-run="l8bonusjs"]'));
  ok(doc.querySelector('#lsStartQuizBtn') !== null, 'Bonus JS bajarildi — test HAMON ochiq');

  click(doc.querySelector('#lsStartQuizBtn'));
  const quizWrap = doc.querySelector('#lsLessonContainer');
  ok(quizWrap.querySelectorAll('.ls-quiz-option').length === 4, 'Test bosqichi ochildi');
  playQuiz();
}
const quizMap = [
  { key: 'required` nima qiladi?', ans: 'taqiqlaydi' },
  { key: 'nima uchun kerak?', ans: 'nom beradi' },
  { key: 'value="Ahatjon"', ans: 'boshlang‘ich qiymati' },
  { key: 'Ko‘p qatorli matn', ans: '<textarea>' },
  { key: '`<select>` ichida', ans: '<option>' },
  { key: 'ushlash qaysi event', ans: '"submit"' },
  { key: 'prevent()` nima', ans: 'vaqtincha to‘xtatadi' },
  { key: 'getElementById("name")', ans: 'id si orqali topadi' },
  { key: 'yozilgan qiymat', ans: '.value' },
  { key: 'nimani tekshiradi?', ans: 'YO‘Qligini' },
  { key: 'REVIEW (1-dars)', ans: '<h1>' },
  { key: 'REVIEW (4-dars)', ans: 'href' },
  { key: 'REVIEW (3-dars)', ans: 'Guruh nomi' }
];
const used = {};
function pickRule(text) {
  for (let i = 0; i < quizMap.length; i++) {
    if (!used[i] && text.indexOf(quizMap[i].key) !== -1) { used[i] = true; return quizMap[i]; }
  }
  return null;
}
let qstep = 0;
function playQuiz() {
  const quizWrap = doc.querySelector('#lsLessonContainer');
  const opts = quizWrap.querySelectorAll('.ls-quiz-option');
  if (!opts.length || qstep >= quizMap.length) { afterQuiz(); return; }
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
  const quizWrap = doc.querySelector('#lsLessonContainer');
  const resultText = quizWrap.textContent;
  const pct = resultText.match(/(\d+) ?%/);
  const pct2 = resultText.match(/(\d+)\/\d+/);
  const score = pct2 ? Number(pct2[1]) : (pct ? Number(pct[1]) : 0);
  ok(score >= 9, 'Test ≥80% (aslida: ' + (pct2 ? pct2[1] : pct ? pct[1] : '?') + ')');
  ok(resultText.includes('MASTERED') && resultText.includes('9-DARS OCHILDI'), 'Master + 9-dars unlock ko‘rsatildi');
  const saveKey = Object.keys(store).find(function (k) { return k.indexOf('darslar_state_v1') !== -1; });
  ok(!!saveKey && store[saveKey].indexOf('html-d8') !== -1, 'Progress localStorage da saqlandi');

  console.log('\nconsole errors: ' + errors.length);
  errors.slice(0, 5).forEach(function (e) { console.log('ERR: ' + e); });
  console.log((failed === 0 && errors.length === 0) ? '\nLESSON8 PASSED' : '\nLESSON8 FAILED');
  process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
}
playReview();
