/* JOURNEY PATH — YANGI UX SMOKE-TEST (jsdom)
   Run: node journey-check.cjs
   Tekshiradi: node click → detail panel → Boshlash → dars ochiladi;
   locked node → ochilmaydi + toast; node holatlari; zigzag offsetlar. */
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
w.__itGetCurrentUser = () => ({ username: 'journeyuser', email: 'j@mail.com' });
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

/* 1. Kurs tanlash -> kurs sahifasi -> journey path chiqishi */
w.Lessons.handlePage('lessons');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]); // HTML
answerDiagnostic('wrong'); // beginner (sequential qulf)
const journey = doc.querySelector('#lsJourney');
ok(!!journey, 'Journey path container chiqdi (#lsJourney)');
const nodes = doc.querySelectorAll('#lsJourney .ls-jnode');
ok(nodes.length === w.CoursesAPI.getCourse('html').lessonCount, 'Har bir dars uchun node chiqdi (' + nodes.length + ')');
ok(nodes[0].classList.contains('ls-jnode--current'), '1-dars node = CURRENT');
ok(nodes[1].classList.contains('ls-jnode--locked'), '2-dars node = LOCKED');
ok(nodes[0].getAttribute('data-state') === 'current', 'Node data-state=current');
ok(nodes[1].getAttribute('data-state') === 'locked', 'Node data-state=locked');
ok(!!doc.querySelector('#lsJourney .ls-jnode-robot .mascot'), 'Robot current node yaqinida');
ok(!!doc.querySelector('#lsJourney .ls-jlinks'), 'SVG connector elementi bor');
ok(!!doc.querySelector('#lsBackToLessons'), '← Darslarga qaytish tugmasi bor');

/* 2. Node click → detail panel (darhol ochilmaydi) */
const before = visitedPages.length;
click(nodes[0]);
const panel = doc.querySelector('#lsJourneyDetail');
ok(!!panel && !panel.hidden, 'Node bosilganda detail panel ochildi (lesson ochilmadi)');
ok(visitedPages.length === before, 'Node bosilganda lesson DARHOL ochilmadi');
ok(panel.textContent.includes('HTML nima?'), 'Panel dars nomini korsatadi (lessons-data dan)');
ok(panel.textContent.includes('15'), 'Panel davomiylikni korsatadi');
ok(panel.textContent.includes('XP'), 'Panel XP ni korsatadi');
const goBtn = panel.querySelector('.ls-detail-go');
ok(!!goBtn && goBtn.textContent.includes('Boshlash'), 'Panelda [Boshlash] tugmasi bor');

/* 3. Boshlash → mavjud lesson view ochiladi → darsni test orqali tugallash */
click(goBtn);
ok(visitedPages[visitedPages.length - 1] === 'lessonView', 'Boshlash -> lessonView ochildi');
ok(doc.querySelector('#lsLessonContainer').textContent.length > 0, 'Lesson kontenti render qilindi');
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

/* 4. Darsdan kursga qaytish → completed/current unlock */
click(doc.querySelector('#lsBackToCourse'));
ok(visitedPages[visitedPages.length - 1] === 'lessonCourse', 'Kurs sahifasiga qaytdi');
const nodes2 = doc.querySelectorAll('#lsJourney .ls-jnode');
ok(nodes2[0].classList.contains('ls-jnode--done'), '1-dars node = DONE (✓)');
ok(nodes2[1].classList.contains('ls-jnode--current'), '2-dars node endi CURRENT (unlock)');
ok(nodes2[2].classList.contains('ls-jnode--locked'), '3-dars hali LOCKED');

/* 5. Locked node → ochilmaydi + toast */
const beforeLocked = visitedPages.length;
click(nodes2[2]);
ok(visitedPages.length === beforeLocked, 'Locked node sahifani o\'zgartirmadi');
ok(w.__lastToast && w.__lastToast.msg.indexOf('yopiq') !== -1, 'Locked toast chiqdi');
ok(doc.querySelector('#lessonLockedModal').classList.contains('active'), 'Qulf modal ham ochiladi (eski oqim)');

/* 6. Completed node → panel "Qayta ko'rish" bilan ochiladi */
click(doc.querySelector('#lessonLockedFooter .btn-ghost'));
click(nodes2[0]);
const panel2 = doc.querySelector('#lsJourneyDetail');
ok(!!panel2 && !panel2.hidden && panel2.querySelector('.ls-detail-go').textContent.includes('Qayta ko‘rish'), 'Completed node → "Qayta ko\'rish" paneli');

/* 7. Panel yopilishi: Esc */
doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
ok(doc.querySelector('#lsJourneyDetail').hidden, 'Esc panelni yopadi');

/* 8. Yana bir kurs (CSS) — alohida course path */
w.Lessons.openCourse('css');
answerDiagnostic('wrong');
const cssNodes = doc.querySelectorAll('#lsJourney .ls-jnode');
ok(cssNodes.length === w.CoursesAPI.getCourse('css').lessonCount, 'CSS kursi alohida path (' + cssNodes.length + ' node)');
ok(cssNodes[0].classList.contains('ls-jnode--current'), 'CSS 1-dars CURRENT (course-specific progress)');
ok(doc.querySelector('#lsCourseContainer').textContent.includes('0%'), 'CSS progress 0% (HTML progress ta\'sir qilmadi)');

/* 9. Zigzag determinizm: --ls-xf pattern [0,1,-1] */
const rows = doc.querySelectorAll('#lsJourney .ls-jrow');
ok(rows[0].style.getPropertyValue('--ls-xf') === '0' && rows[1].style.getPropertyValue('--ls-xf') === '1' && rows[2].style.getPropertyValue('--ls-xf') === '-1', 'Zigzag ofsetlar deterministik [0,1,-1]');

console.log('\n==========================================');
console.log('  NATIJA: ' + passed + ' otdi, ' + failed + ' xato');
console.log('==========================================');
process.exit(failed ? 1 : 0);