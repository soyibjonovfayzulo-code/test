/* COURSE PATH — SNAKE / WINDING ROAD SMOKE-TEST (jsdom)
   Run: node journey-check.cjs
   Tekshiradi: #lsCoursePath container; node holatlari (current/locked/done);
   deterministik zigzag (--l/--r/--card-col); SVG road (base+progress);
   node click → lessonView (mavjud openLesson oqimi); locked → toast + qulf modal;
   completed → "Qayta ko'rish"; kurslararo progress izolyatsiyasi; robot headerda. */
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

const visitedPages = [];
w.__itShowPage = (name) => { visitedPages.push(name); };
w.__itGetCurrentUser = () => ({ username: 'pathuser', email: 'p@mail.com' });
w.showToast = (msg, type) => { w.__lastToast = { msg, type }; };
w.confirm = () => true;
w.eval(fs.readFileSync(path.join(root, 'mascot.js'), 'utf8'));
w.eval(dataSrc);
w.eval(appSrc);

let passed = 0, failed = 0;
function ok(cond, label) {
  if (cond) { passed++; console.log('  PASS ' + label); }
  else { failed++; console.log('  FAIL ' + label); }
}
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }
function normQ(s) { return String(s).replace(/`/g, '').replace(/\s+/g, ' ').trim(); }
function answerDiagnostic(mode) {
  const API = w.CoursesAPI;
  const bank = [];
  API.getCourse('html').lessons.forEach(function (l) {
    ((l.quiz && l.quiz.questions) || []).forEach(function (q) { bank.push(q); });
  });
  let correctCount = 0, guard = 0;
  while (doc.querySelector('#lessonLevelModal').classList.contains('active')) {
    if (++guard > 20) throw new Error('diag guard');
    const question = normQ(doc.querySelector('.ls-diagnostic-question').textContent);
    const source = bank.find(function (b) { return normQ(b.question) === question; });
    const options = Array.from(doc.querySelectorAll('.ls-diagnostic-option'));
    const correct = source ? normQ(source.options[source.answer]) : '';
    const wantCorrect = mode === 'correct' || (mode === 'mixed' && correctCount < 2);
    let target;
    if (wantCorrect) { target = options.find(o => normQ(o.textContent).indexOf(correct) !== -1); correctCount++; }
    else { target = options.find(o => normQ(o.textContent).indexOf(correct) === -1); }
    click(target || options[0]);
  }
}

/* 1. Kurs tanlash -> kurs sahifasi -> course path chiqishi */
w.Lessons.handlePage('lessons');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]); // HTML
answerDiagnostic('wrong'); // beginner (sequential qulf)
const cpath = doc.querySelector('#lsCoursePath');
ok(!!cpath, 'Course path container chiqdi (#lsCoursePath)');
ok(!doc.querySelector('#lsJourney'), 'Eski journey path DOMda YO\'Q');
ok(!doc.querySelector('.ls-path-node') && !doc.querySelector('.ls-jnode'), 'Eski timeline/journey node\'lari yo\'q');
const nodes = doc.querySelectorAll('#lsCoursePath .ls-cnode');
ok(nodes.length === w.CoursesAPI.getCourse('html').lessonCount, 'Har bir dars uchun node chiqdi (' + nodes.length + ')');
ok(nodes[0].classList.contains('ls-cnode--current'), '1-dars node = CURRENT');
ok(nodes[1].classList.contains('ls-cnode--locked'), '2-dars node = LOCKED');
ok(nodes[0].getAttribute('data-state') === 'current', 'Node data-state=current');
ok(nodes[1].getAttribute('data-state') === 'locked', 'Node data-state=locked');
ok(!!doc.querySelector('#lsCoursePath .ls-croad-base') && !!doc.querySelector('#lsCoursePath .ls-croad-progress'), 'SVG road: base + progress path bor');
const progEl = doc.querySelector('#lsCoursePath .ls-croad-progress');
ok(!!progEl && progEl.getAttribute('pathLength') === '1', 'Progress path pathLength=1 (dasharray texnikasi)');
ok(!!doc.querySelector('#lsCoursePath .ls-ccard'), 'Lesson card chiqdi');
const card0 = doc.querySelectorAll('#lsCoursePath .ls-ccard')[0];
ok(card0.textContent.indexOf('Davom etmoqda') !== -1, 'Current card: "Davom etmoqda" statusi bor');
ok(card0.textContent.indexOf('Davom ettirish') !== -1, 'Current card: "Davom ettirish →" actioni bor');
ok(card0.textContent.indexOf('daqiqa') !== -1 && card0.textContent.indexOf('XP') !== -1, 'Card: davomiylik + XP');
ok(!!doc.querySelector('#lsCourseContainer .ls-hero-robot .mascot'), 'Robot course headerda');
ok(!!doc.querySelector('#lsBackToLessons'), '← Kursga qaytish tugmasi bor');

/* 2. Deterministik zigzag: node x fraksiyalari + kartalar chap-o'ng almashinishi */
const rows = doc.querySelectorAll('#lsCoursePath .ls-crow');
const styles = Array.from(rows).map(function (r) { return r.getAttribute('style') || ''; });
ok(styles[0].indexOf('* 0.38') !== -1, 'Row1 node x = 0.38 (chap)');
ok(styles[1].indexOf('* 0.66') !== -1, 'Row2 node x = 0.66 (o\'ng)');
ok(styles[2].indexOf('* 0.3') !== -1, 'Row3 node x = 0.30 (chap, boshqa amplituda)');
const cardCols = styles.map(function (s) {
  const m = s.match(/--card-col:(\d)/);
  return m ? m[1] : '';
});
ok(cardCols[0] === '3' && cardCols[1] === '1' && cardCols[2] === '3', 'Kartalar navbatlama o\'ng(3)/chap(1) tomonda');
ok(nodes[0].closest('.ls-crow') !== nodes[1].closest('.ls-crow'), 'Har node o\'z rowida');

/* 3. Node click → lesson view ochiladi (eski openLesson oqimi saqlangan) */
click(nodes[0]);
ok(visitedPages[visitedPages.length - 1] === 'lessonView', 'Node click -> lessonView ochildi');
ok(doc.querySelector('#lsLessonContainer').textContent.length > 0, 'Lesson kontenti render qilindi');

/* 4. Darsni test orqali tugallash */
click(doc.querySelector('#lsMarkReadBtn'));
click(doc.querySelector('#lsStartQuizBtn'));
const quizBank = w.CoursesAPI.getCourse('html').lessons[0].quiz.questions;
for (let qi = 0; qi < 5; qi++) {
  const qText = normQ(doc.querySelector('.ls-quiz-question').textContent);
  const bankQ = quizBank.find(b => normQ(b.question) === qText);
  const correctText = normQ(bankQ.options[bankQ.answer]);
  click(Array.from(doc.querySelectorAll('.ls-quiz-option')).find(o => normQ(o.textContent).indexOf(correctText) !== -1));
  click(doc.querySelector('#lsQuizNextBtn'));
}
ok(doc.querySelector('.ls-result-hero') !== null, 'Test natijasi chiqdi (PASS)');

/* 5. Kurs sahifasiga qaytish → done/current/locked holatlar yangilangan */
click(doc.querySelector('#lsBackToCourse'));
ok(visitedPages[visitedPages.length - 1] === 'lessonCourse', 'Kurs sahifasiga qaytdi');
const nodes2 = doc.querySelectorAll('#lsCoursePath .ls-cnode');
ok(nodes2[0].classList.contains('ls-cnode--done'), '1-dars node = DONE (✓)');
ok(nodes2[1].classList.contains('ls-cnode--current'), '2-dars node endi CURRENT (unlock)');
ok(nodes2[2].classList.contains('ls-cnode--locked'), '3-dars hali LOCKED');
const cards2 = doc.querySelectorAll('#lsCoursePath .ls-ccard');
ok(cards2[0].textContent.indexOf('Tugallangan') !== -1 && cards2[0].textContent.indexOf('Qayta ko‘rish') !== -1, 'Completed card: "Tugallangan" + "Qayta ko\'rish"');
ok(cards2[1].textContent.indexOf('Davom etmoqda') !== -1, '2-dars kartasi "Davom etmoqda"');

/* 6. Locked node → ochilmaydi + toast + qulf modal (eski oqim) */
const beforeLocked = visitedPages.length;
click(nodes2[2]);
ok(visitedPages.length === beforeLocked, 'Locked node sahifani o\'zgartirmadi');
ok(w.__lastToast && w.__lastToast.msg.indexOf('yopiq') !== -1, 'Locked toast chiqdi');
ok(doc.querySelector('#lessonLockedModal').classList.contains('active'), 'Qulf modal ham ochiladi (eski oqim)');

/* 7. Yana bir kurs (CSS) — alohida course path, progress izolyatsiyasi */
click(doc.querySelector('#lessonLockedFooter .btn-ghost'));
w.Lessons.openCourse('css');
answerDiagnostic('wrong');
const cssNodes = doc.querySelectorAll('#lsCoursePath .ls-cnode');
ok(cssNodes.length === w.CoursesAPI.getCourse('css').lessonCount, 'CSS kursi alohida path (' + cssNodes.length + ' node)');
ok(cssNodes[0].classList.contains('ls-cnode--current'), 'CSS 1-dars CURRENT (course-specific progress)');
ok(doc.querySelector('#lsCourseContainer').textContent.indexOf('0%') !== -1, 'CSS progress 0% (HTML progress ta\'sir qilmadi)');

console.log('\n==========================================');
console.log('  NATIJA: ' + passed + ' otdi, ' + failed + ' xato');
console.log('==========================================');
process.exit(failed ? 1 : 0);