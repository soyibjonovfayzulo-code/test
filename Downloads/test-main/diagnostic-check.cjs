/* Diagnostik test: daraja qo'lda emas, javoblar natijasi bilan aniqlanishini tekshiradi. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'https://localhost/'
});
const w = dom.window;
const doc = w.document;
const visited = [];
w.__itShowPage = (name) => visited.push(name);
w.__itGetCurrentUser = () => ({ username: 'diagnostic-check' });
w.showToast = (msg, type) => { w.__toast = { msg, type }; };
w.confirm = () => true;

w.eval(fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8'));
w.eval(fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8'));

let passed = 0;
function ok(condition, message) {
  if (!condition) throw new Error('FAIL: ' + message);
  passed++;
  console.log('  ✅ ' + message);
}
function click(element) {
  if (!element) throw new Error('Kutilgan DOM elementi topilmadi');
  element.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
}
function normalize(value) {
  return String(value).replace(/`/g, '').replace(/\s+/g, ' ').trim();
}
function answerDiagnostic(allCorrect) {
  const bank = [];
  w.CoursesAPI.getCourse('html').lessons.forEach((lesson) => {
    (lesson.quiz && lesson.quiz.questions || []).forEach((question) => bank.push(question));
  });

  while (doc.querySelector('#lessonLevelModal').classList.contains('active')) {
    const question = normalize(doc.querySelector('.ls-diagnostic-question').textContent);
    const source = bank.find((item) => normalize(item.question) === question);
    const options = Array.from(doc.querySelectorAll('.ls-diagnostic-option'));
    const correct = source ? normalize(source.options[source.answer]) : '';
    const answer = allCorrect
      ? options.find((item) => normalize(item.textContent).slice(2).includes(correct))
      : options.find((item) => !normalize(item.textContent).slice(2).includes(correct));
    click(answer || options[0]);
  }
}

w.Lessons.handlePage('lessons');
const firstCard = doc.querySelector('#lsCoursesGrid .ls-course-card');
click(firstCard);
ok(visited.includes('lessonCourse'), 'Kurs sahifasi ochildi');
ok(doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Diagnostik modal ochildi');
ok(doc.querySelectorAll('#lessonLevelBody .ls-level-option').length === 0, 'Qo\'lda daraja tanlash tugmalari yo\'q');
ok(doc.querySelectorAll('#lessonLevelBody .ls-diagnostic-option').length === 4, 'Diagnostik savol variantlari chiqdi');
answerDiagnostic(false);
ok(!doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Test yakunlangach modal yopildi');
ok(/Umuman bilmayman|Asoslarini bilaman|Yaxshi bilaman/.test(doc.querySelector('#lsCourseContainer .ls-level-chip').textContent), 'Test natijasi daraja chipida aks etdi');
ok(/Test natijasi: \d+%/.test(w.__toast.msg), 'Test foizi toast orqali ko\'rsatildi');

click(doc.querySelector('#lsSettingsBtn'));
ok(doc.querySelector('#lessonSettingsBody .ls-level-option') === null, 'Sozlamalarda qo\'lda daraja tanlash yo\'q');
const retake = doc.querySelector('#lsRetakeDiagnosticBtn');
ok(!!retake, 'Darajani test orqali qayta aniqlash tugmasi bor');
click(retake);
ok(doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Qayta diagnostika ochildi');
answerDiagnostic(true);
ok(/Umuman bilmayman|Asoslarini bilaman|Yaxshi bilaman/.test(doc.querySelector('#lsCourseContainer .ls-level-chip').textContent), 'Qayta test natijasi darajani yangiladi');

click(doc.querySelector('#lsBackToLessons'));
ok(visited[visited.length - 1] === 'lessons', '← Darslar tugmasi orqaga qaytardi');
console.log(`\n✅ Diagnostik smoke-test: ${passed} ta tekshiruv muvaffaqiyatli`);
