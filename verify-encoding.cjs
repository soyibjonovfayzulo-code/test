/* FINAL TEST — encoding + rendering tekshiruvi (jsdom)
   Run: node verify-encoding.cjs
   1-darsni haqiqiy DOM muhitida render qiladi:
   - o'zbekcha belgilar (o‘ g‘ O‘ G‘), tire (— –), quote (' '), emoji
   - console error = 0 talabini tekshiradi                        */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window;
const doc = w.document;

let consoleErrors = 0;
w.addEventListener('error', function () { consoleErrors++; });
const origError = w.console.error;
w.console.error = function () { consoleErrors++; origError.apply(w.console, arguments); };

w.__itShowPage = function () {};
w.__itGetCurrentUser = function () { return { username: 'verifyuser', email: 'v@mail.com' }; };
w.showToast = function () {};
w.confirm = function () { return true; };

w.eval(dataSrc);
w.eval(appSrc);

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  \u2705 ' + label); }
  else { failed++; console.log('  \u274C ' + label + (extra ? '\n     ' + extra : '')); }
}
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }

setTimeout(function () {
  console.log('\n[1. SOURCE ENCODING] lessons-data.js');
  const data = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
  ok(!/[\u0400-\u04FF]/.test(data), 'Data faylida kirill/mojibake belgi YO\'Q');
  ok(data.indexOf('o\u2018zgaruvchi') !== -1, 'o\u2018zgaruvchi — to\u2018g\u2018ri (o\u2018 + U+2018)');
  ok(/to\u2018g\u2018ri/.test(data), 'to\u2018g\u2018ri — g\u2018 belgisi to\u2018g\u2018ri');
  ok(data.indexOf('\u2014') !== -1, 'Uzun tire (\u2014) to\u2018g\u2018ri');
  ok(data.indexOf('\u2013') !== -1, 'Qisqa tire (\u2013) to\u2018g\u2018ri');
  ok(data.indexOf('\uD83C\uDF10') !== -1, 'Emoji (\uD83C\uDF10) buzilmagan');
  ok(data.indexOf('\uFFFD') === -1, 'Replacement char (U+FFFD) YO\'Q');

  console.log('\n[2. RENDER — 1-dars ekranda]');
  w.Lessons.handlePage('lessons');
  click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
  click(doc.querySelectorAll('#lessonLevelBody .ls-level-option')[0]);
  w.Lessons.openLesson('html', 'html-d1');
  const viewer = doc.querySelector('#lsLessonContainer');
  const txt = viewer.textContent;

  ok(txt.indexOf('HTML nima?') !== -1, '"HTML nima?" aynan shunday chiqdi');
  ok(txt.indexOf('o\u2018zgaruvchi') !== -1 || txt.indexOf('o\u2018rganamiz') !== -1, 'o\u2018 belgili so\u2018zlar to\u2018g\u2018ri chiqdi');
  ok(txt.indexOf('\u2014') !== -1, 'Tire (\u2014) to\u2018g\u2018ri chiqdi');
  ok(txt.indexOf('\uFFFD') === -1, 'Ekranda buzilgan belgi (U+FFFD) YO\'Q');
  ok(!/[\u0400-\u04FF]/.test(txt), 'Ekranda kirill/mojibake belgi YO\'Q');
  ok(viewer.querySelectorAll('.ls-content-section').length >= 5, 'Kontent bo\u2018limlari render bo\u2018ldi (' + viewer.querySelectorAll('.ls-content-section').length + ')');
  ok(viewer.querySelectorAll('.ls-content-code').length >= 3, 'Kod bloklari render bo\u2018ldi (' + viewer.querySelectorAll('.ls-content-code').length + ')');

  console.log('\n[3. TEST EKRANI — belgilar]');
  click(doc.querySelector('#lsMarkReadBtn'));
  click(doc.querySelector('#lsStartQuizBtn'));
  const qtxt = doc.querySelector('#lsLessonContainer').textContent;
  ok(doc.querySelector('.ls-quiz-question') !== null, 'Test savoli chiqdi');
  ok(qtxt.indexOf('\uFFFD') === -1, 'Testda buzilgan belgi YO\'Q');
  ok(!/[\u0400-\u04FF]/.test(qtxt), 'Testda kirill/mojibake YO\'Q');

  console.log('\n[4. CONSOLE]');
  ok(consoleErrors === 0, 'Console error = 0 (' + consoleErrors + ')');

  console.log('\n==========================================');
  console.log('  NATIJA: ' + passed + ' otdi, ' + failed + ' xato');
  console.log('==========================================');
  process.exit(failed ? 1 : 0);
}, 250);
