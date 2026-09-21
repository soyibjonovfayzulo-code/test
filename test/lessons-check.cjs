/* DARSLAR TIZIMI — REAL TEST (jsdom)
   Run: node lessons-check.cjs
   Darslar platformasining butun oqimini haqiqiy DOM muhitida tekshiradi:
   kurslar grid -> bilim darajasi -> qulf logikasi -> progress -> davom ettirish. */
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

// script.js'ning expose qilingan qismlari — stub (modul ichida)
const visitedPages = [];
w.__itShowPage = (name) => { visitedPages.push(name); };
w.__itGetCurrentUser = () => ({ username: 'testuser', email: 'test@mail.com' });
w.showToast = (msg, type) => { w.__lastToast = { msg, type }; };
w.confirm = () => true;

// Darslar skriptlari
w.eval(dataSrc);
w.eval(appSrc);

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }

/* Diagnostika testini yechish (daraja endi test natijasi orqali aniqlanadi):
   mode = 'correct' (advanced) | 'wrong' (beginner) | 'mixed' (2/5 -> intermediate) */
function normQ(s) { return String(s).replace(/`/g, '').replace(/\s+/g, ' ').trim(); }
function answerDiagnostic(mode) {
  const bank = [];
  API.getCourse('html').lessons.forEach(function (l) {
    ((l.quiz && l.quiz.questions) || []).forEach(function (q) { bank.push(q); });
  });
  let correctCount = 0, guard = 0;
  while (doc.querySelector('#lessonLevelModal').classList.contains('active')) {
    if (++guard > 20) throw new Error('Diagnostika testi tugamadi (guard)');
    const question = normQ(doc.querySelector('.ls-diagnostic-question').textContent);
    const source = bank.find(function (b) { return normQ(b.question) === question; });
    const options = Array.from(doc.querySelectorAll('.ls-diagnostic-option'));
    const correct = source ? normQ(source.options[source.answer]) : '';
    const wantCorrect = mode === 'correct' || (mode === 'mixed' && correctCount < 2);
    let target;
    if (wantCorrect) {
      target = options.find(function (o) { return normQ(o.textContent).indexOf(correct) !== -1; });
      correctCount++;
    } else {
      target = options.find(function (o) { return normQ(o.textContent).indexOf(correct) === -1; });
    }
    click(target || options[0]);
  }
}

/* ===================== 1. DATA ARXITEKTURASI ===================== */
section('DATA ARXITEKTURASI');
const API = w.CoursesAPI;
ok(!!API, 'CoursesAPI mavjud');
const courses = API.listCourses();
ok(courses.length === 10, '10 ta kurs bor (' + courses.length + ')');
const htmlCourse = API.getCourse('html');
ok(!!htmlCourse && htmlCourse.lessonCount === API.raw[0].topics.length, "HTML kursi darslari = topics uzunligi (" + (htmlCourse && htmlCourse.lessonCount) + ')');
const jsCourse = API.getCourse('javascript');
ok(!!jsCourse && jsCourse.lessonCount === 40, 'JavaScript kursi 40 dars (' + (jsCourse && jsCourse.lessonCount) + ')');
ok(API.getCourse('css').lessonCount === 25, 'CSS kursi 25 dars');
const found = API.findLesson('html', 'html-d1');
ok(!!found && found.lesson.title === 'HTML nima?' && found.index === 0, 'findLesson ishlaydi');
ok(!!API.nextLesson('html', 'html-d1') && API.nextLesson('html', 'html-d1').id === 'html-d2', 'nextLesson ishlaydi');
ok(API.getCourse('yoq') === null, "Noto'g'ri id -> null");

// Yangi dars qo'shish = faqat data (scalable arxitektura tekshiruvi)
const baseCount = API.raw[0].topics.length;
API.raw[0].topics.push('TEST yangi dars');
API.refresh();
ok(API.getCourse('html').lessonCount === baseCount + 1, "Data'ga 1 qator qo'shilib yangi dars paydo bo'ldi");
API.raw[0].topics.pop();
API.refresh();
ok(API.getCourse('html').lessonCount === baseCount, "Qayta o'chirildi");

/* ===================== 2. DARSLAR BOSH SAHIFASI ===================== */
section('DARSLAR BOSH SAHIFASI');
w.Lessons.handlePage('lessons');
const cards = doc.querySelectorAll('#lsCoursesGrid .ls-course-card');
ok(cards.length === 10, '10 ta kurs karta chiqdi (' + cards.length + ')');
ok(doc.querySelector('#lsContinueSlot .ls-continue') !== null, 'Davom ettirish banneri chiqdi');
ok(cards[0].textContent.includes('HTML'), 'Birinchi karta HTML');
ok(/ta dars|ta dars/.test(cards[0].textContent) && /\d+/.test(cards[0].textContent), "Kartada darslar soni bor");
ok(cards[0].textContent.includes('0%'), 'Kartada progress 0%');
ok(cards[0].textContent.includes('Boshlash'), 'Kartada "Boshlash" tugmasi');

/* ===================== 3. BILIM DARAJASI — DIAGNOSTIKA TESTI (birinchi kirish) ===================== */
section('BILIM DARAJASI — DIAGNOSTIKA TESTI');
click(cards[0]);
ok(visitedPages.includes('lessonCourse'), "Kurs sahifasiga o'tildi");
ok(doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Diagnostika modal ochildi (birinchi kirish)');
ok(doc.querySelectorAll('#lessonLevelBody .ls-diagnostic-option').length >= 2, 'Diagnostika savol variantlari chiqdi');
// Hammasiga noto'g'ri javob -> beginner (ketma-ket qulf rejimi)
answerDiagnostic('wrong');
ok(!doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Test yakunlangach modal yopildi');
ok(doc.querySelector('#lsCourseContainer .ls-level-chip').textContent.includes('Umuman bilmayman'), "Test natijasi: 'Umuman bilmayman' darajasi");

/* ===================== 4. QULF LOGIKASI (BEGINNER) ===================== */
section('QULF LOGIKASI — BEGINNER (ketma-ket)');
const lessons = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(lessons.length === API.raw[0].topics.length, 'Barcha dars kartalari chiqdi (' + lessons.length + ')');
ok(lessons[0].classList.contains('ls-current'), '1-dars = joriy (ochiq)');
ok(lessons[1].classList.contains('ls-locked'), '2-dars qulflangan');
ok(lessons[lessons.length - 1].classList.contains('ls-locked'), 'Oxirgi dars ham qulflangan');
ok(lessons[0].textContent.includes('15 daqiqa'), 'Kartada davomiylik bor');
ok(lessons[0].textContent.includes('Boshlang'), 'Kartada daraja matni bor');

// Qulflangan darsga bosilganda — modal chiqadi, sahifa o'zgarmaydi
const before = visitedPages.length;
click(lessons[1]);
ok(visitedPages.length === before, "Qulflangan dars sahifani o'zgartirmadi");
ok(doc.querySelector('#lessonLockedModal').classList.contains('active'), '🔒 Qulf modal chiqdi');
ok(doc.querySelector('#lessonLockedBody').textContent.includes('Bu dars hozircha yopiq'), "Modal matni to'g'ri");
ok(doc.querySelector('#lessonLockedFooter').textContent.includes('Oldingi darsga'), "Modalda 'Oldingi darsga o'tish' tugmasi bor");
const goPrev = doc.querySelector('#lsGoPrevBtn');
ok(!!goPrev, "Oldingi darsga o'tish tugmasi mavjud");
click(goPrev);
ok(!doc.querySelector('#lessonLockedModal').classList.contains('active'), 'Tugma bosilgach modal yopildi');
ok(visitedPages[visitedPages.length - 1] === 'lessonView', "Oldingi (1-) darsga o'tildi");

/* ===================== 5. 📚 DARSLARNI O'QISH BOSQICHI ===================== */
section("DARSNI O'QISH BOSQICHI (1-dars kontenti)");
w.__itShowPage('lessonView');
const viewer = doc.querySelector('#lsLessonContainer');
ok(viewer.textContent.includes('📚 1-dars: HTML nima?'), 'Dars sarlavhasi chiqdi');
ok(viewer.textContent.includes('daqiqa'), 'Davomiylik korsatildi');
// Kontent render bo'ldi
ok(viewer.querySelectorAll('.ls-content-section').length >= 5, 'Kontent bo\'limlari chiqdi (' + viewer.querySelectorAll('.ls-content-section').length + ')');
ok(viewer.textContent.includes('HyperText Markup Language'), 'Nazariyada HyperText Markup Language bor');
ok(viewer.textContent.includes('Belgilash tili'), 'Nazariyada "Belgilash tili" bor');
ok(viewer.querySelectorAll('.ls-content-code').length >= 3, 'Kod namunalari bor (' + viewer.querySelectorAll('.ls-content-code').length + ')');
ok(viewer.textContent.includes('Natija:'), 'Natija bloklari bor');
ok(viewer.textContent.includes('Muhim eslatmalar'), 'Muhim eslatmalar bloki bor');
ok(viewer.querySelectorAll('.ls-content-keypoints li').length >= 8, 'Eslatmalar soni (' + viewer.querySelectorAll('.ls-content-keypoints li').length + ')');
// Test tugmasi HALI aktiv emas — darsni o'qish kerak
ok(viewer.querySelector('#lsStartQuizBtn') === null, 'Test tugmasi o\'qishdan OLDIN mavjud emas ✅');
ok(viewer.textContent.includes('Darsni oxirigacha o‘qing'), 'O\'qish uchun ko\'rsatma bor');
ok(viewer.querySelector('#lsCompleteBtn') === null, 'Eski "Darsni tugallash" tugmasi olib tashlandi ✅');
ok(viewer.querySelector('#lsNextLesson').textContent.includes('🔒'), 'Keyingi dars tugmasida qulf belgisi (2-dars yopiq)');
// "O'qidim" tugmasi bosilgach — test ochiladi
click(viewer.querySelector('#lsMarkReadBtn'));
ok(viewer.querySelector('#lsStartQuizBtn') !== null, '"O\'qidim" belgilangach Testni boshlash tugmasi paydo bo\'ldi ✅');
// Yopiq "Keyingi" tugmasi bosilsa — modal chiqadi, sahifa o'zgarmaydi
const beforeNext = visitedPages.length;
click(viewer.querySelector('#lsNextLesson'));
ok(doc.querySelector('#lessonLockedModal').classList.contains('active'), "Yopiq keyingi darsga bosilganda qulf modali chiqdi");
ok(visitedPages.length === beforeNext, "Sahifa o'zgarmadi");
// Modalni yopamiz
click(doc.querySelector('#lessonLockedFooter .btn-ghost'));

/* ===================== 5b. KONTENTSIZ DARS (placeholder) ===================== */
section('KONTENTSIZ DARS — PLACEHOLDER');
w.__itGetCurrentUser = function () { return { username: 'adv_user' }; };
w.eval(appSrc);
w.Lessons.handlePage('lessons');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
answerDiagnostic('correct'); // advanced — hammasi ochiq
const noContentId = 'html-d' + w.CoursesAPI.getCourse('html').lessonCount; // oxirgi dars — string topic, kontent yo'q
w.Lessons.openLesson('html', noContentId);
ok(visitedPages[visitedPages.length - 1] === 'lessonView', 'Kontentsiz dars ochildi (advanced)');
const viewer3 = doc.querySelector('#lsLessonContainer');
ok(viewer3.textContent.includes('Dars tayyorlanmoqda'), '"Dars tayyorlanmoqda" placeholder chiqdi (kontent yo\'q dars)');
ok(viewer3.textContent.includes('testi tez orada'), 'Test ham hali yo\'q — eslatma bor');
w.__itGetCurrentUser = function () { return { username: 'testuser', email: 'test@mail.com' }; };
w.eval(appSrc); // testuser ga qaytish

/* ===================== 6. 🧪 TEST: O'TISH + PROGRESS + OCHILISH ===================== */
section("TESTDAN O'TISH — PROGRESS + KEYINGI DARS");
const quizBank = w.CoursesAPI.getCourse('html').lessons[0].quiz.questions;
ok(quizBank.length === 15, 'Savollar banki 15 ta (' + quizBank.length + ')');
ok(w.CoursesAPI.getCourse('html').lessons[0].quiz.passingScore === 80, 'passingScore = 80%');
// testuser qayta "kirdi" (5b da skript qayta yuklangandi) — 1-darsni ochamiz
w.Lessons.openLesson('html', 'html-d1');
ok(viewer.querySelector('#lsStartQuizBtn') !== null, 'Qayta kirganda o\'qilgan darsda test tugmasi DARHOL bor (read saqlangan) ✅');
click(viewer.querySelector('#lsStartQuizBtn'));
ok(visitedPages[visitedPages.length - 1] === 'lessonView', 'Test bosqichi ochildi');
const normS = function (s) { return String(s).replace(/`/g, '').replace(/\s+/g, ' ').trim(); };
// 5 ta savolga to'g'ri javob berish
for (let qi = 0; qi < 5; qi++) {
  const qText = normS(doc.querySelector('.ls-quiz-question').textContent);
  const bankQ = quizBank.find(function (b) { return normS(b.question) === qText; });
  ok(!!bankQ, (qi + 1) + '-savol bankdan: ' + qText.slice(0, 36) + '...');
  const correctText = normS(bankQ.options[bankQ.answer]);
  const opts = Array.from(doc.querySelectorAll('.ls-quiz-option'));
  ok(opts.length === 4, (qi + 1) + '-savolda 4 variant');
  const optTexts = opts.map(function (o) { return normS(o.textContent).replace(/^[A-F]\)/, '').trim(); });
  ok(new Set(optTexts).size === 4, (qi + 1) + '-savol variantlari takrorlanmaydi');
  const target = opts.find(function (o) { return normS(o.textContent).indexOf(correctText) !== -1; });
  click(target);
  ok(doc.querySelector('.ls-quiz-option.ls-opt-correct') !== null, (qi + 1) + '-savol: to\'g\'ri javob yashil belgilandi');
  ok(doc.querySelector('#lsQuizNextBtn') !== null, (qi + 1) + '-savoldan keyin davom tugmasi chiqdi');
  click(doc.querySelector('#lsQuizNextBtn'));
}
// Natija ekrani — o'tdi
const resHero = doc.querySelector('.ls-result-hero');
ok(resHero !== null && resHero.classList.contains('pass'), 'Natija ekrani: PASS holati');
ok(resHero.textContent.includes('Ajoyib!'), '🎉 Ajoyib! matni bor');
ok(resHero.textContent.includes('5 / 5'), 'Ball 5/5');
ok(resHero.textContent.includes('100%'), 'Foiz 100%');
ok(resHero.textContent.includes('Testdan o‘tdingiz!'), '✅ Testdan o\'tdingiz belgisi');
ok(resHero.textContent.includes('+10 XP'), '+10 XP chipi');
ok(resHero.textContent.includes('+20 Coin'), '+20 Coin chipi');
const unlockBanner = doc.querySelector('.ls-unlock-banner');
ok(unlockBanner !== null && unlockBanner.textContent.includes('2-dars ochildi'), '🔓 2-dars ochildi banneri');
ok(doc.querySelectorAll('.ls-review-item').length === 5, 'Tahlil: 5 ta savol ko\'rsatildi');
ok(doc.querySelectorAll('.ls-review-expl').length === 5, 'Har bir savolda izoh bor');
ok(doc.querySelector('#lsGoNextBtn') !== null, 'Keyingi dars tugmasi bor');

// Kurs sahifasiga qaytish — progress + holatlar
click(doc.querySelector('#lsBackToCourse'));
ok(visitedPages[visitedPages.length - 1] === 'lessonCourse', "Kurs sahifasiga qaytdi");
const lessons2 = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(lessons2[0].classList.contains('ls-completed'), '1-dars = ✅ tugallangan');
ok(lessons2[0].textContent.includes('✅'), '1-dars kartasida ✅ ikonkasi');
ok(lessons2[1].classList.contains('ls-current'), '2-dars = joriy (ochiq bo\'ldi)');
ok(lessons2[1].textContent.includes('🧪'), '2-dars kartasida 🧪 test ikonkasi');
ok(lessons2[2].classList.contains('ls-locked'), '3-dars hali yopiq');
ok(doc.querySelector('#lsCourseContainer').textContent.includes('3%'), 'Progress 3% (1/30) — faqat testdan keyin oshdi');
ok(doc.querySelector('#lsCourseContainer').textContent.includes('Bilim darajasi'), "Bilim darajasi chipda ko'rinadi");

/* ===================== 7. SOZLAMALAR — DARAJANI O'ZGARTIRISH ===================== */
section("O'RGANISH SOZLAMALARI");
click(doc.querySelector('#lsSettingsBtn'));
ok(doc.querySelector('#lessonSettingsModal').classList.contains('active'), 'Sozlamalar modali ochildi');
ok(doc.querySelector('#lessonSettingsBody').textContent.includes('Umuman bilmayman'), 'Joriy daraja korsatildi');
// Daraja endi qo'lda tanlanmaydi — diagnostikani qayta topshirish orqali o'zgartiriladi
click(doc.querySelector('#lsRetakeDiagnosticBtn'));
ok(doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Qayta diagnostika ochildi');
answerDiagnostic('mixed'); // 2/5 to'g'ri = 40% -> intermediate
const lessons3 = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(!lessons3[29].classList.contains('ls-locked'), 'Intermediate: barcha darslar ochiq (30-dars ham)');

// Qayta topshirib advanced darajaga o'tish
click(doc.querySelector('#lsSettingsBtn'));
click(doc.querySelector('#lsRetakeDiagnosticBtn'));
answerDiagnostic('correct'); // advanced
ok(!doc.querySelectorAll('#lsCourseContainer .ls-lesson-card')[29].classList.contains('ls-locked'), 'Advanced: hammasi ochiq');

/* ===================== 8. DAVOM ETTIRISH BANNERI ===================== */
section('DAVOM ETTIRISH BANNERI');
w.Lessons.handlePage('lessons');
const banner = doc.querySelector('#lsContinueSlot .ls-continue');
ok(banner.textContent.includes('Davom ettirish'), 'Banner matni bor');
ok(banner.textContent.includes('HTML'), 'Oxirgi faol kurs (HTML) korinadi');
ok(banner.textContent.includes('2-dars'), 'Oxirgi dars (2-dars) korinadi');
ok(banner.textContent.includes('3%'), 'Bannerda progress bor');
click(doc.querySelector('#lsContinueBtn'));
ok(visitedPages[visitedPages.length - 1] === 'lessonView', 'Davom ettirish tugmasi joriy darsni to‘g‘ridan ochdi');

/* ===================== 9. SAQLANISH (localStorage) ===================== */
section('SAQLANISH — QAYTA KIRGANDA JOYIDAN DAVOM');
// "Yangi sessiya": hamma skriptni qayta eval qilish (store qayta yuklanadi)
w.eval(dataSrc);
w.eval(appSrc);
w.Lessons.handlePage('lessons');
const banner2 = doc.querySelector('#lsContinueSlot .ls-continue');
ok(banner2.textContent.includes('HTML') && banner2.textContent.includes('3%'), 'Progress saqlangan (3%)');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
const lessons4 = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(lessons4[0].classList.contains('ls-completed'), '1-dars tugallangan holati saqlangan');
ok(lessons4[1].classList.contains('ls-current'), '2-dars joriy holati saqlangan');
ok(!doc.querySelector('#lessonLevelModal').classList.contains('active'), 'Daraja modal qayta so\'ralmadi (saqlangan)');

/* ===================== 10. HAR KIM UCHUN AJRATILGAN SAQLASH ===================== */
section('FOYDALANUVCHI BO\'YICHA AJRATILGAN SAQLASH');
w.__itGetCurrentUser = () => ({ username: 'boshqa_user' });
w.eval(appSrc); // qayta yuklash
w.Lessons.handlePage('lessons');
ok(doc.querySelector('#lsCoursesGrid .ls-course-card').textContent.includes('0%'), 'Boshqa foydalanuvchi -> progress 0%');

/* ===================== 11. UX — PROFIL DROPDOWN va CHIQISH ===================== */
section('UX — PROFIL DROPDOWN va CHIQISH');
const dd = doc.querySelector('#userDropdown');
ok(!!dd, 'Profil dropdown DOMda mavjud');
const menuItems = dd ? dd.querySelectorAll('.ux-menu-item') : [];
ok(menuItems.length === 6, '6 ta menyu elementi (' + (menuItems && menuItems.length) + ')');
const menuTexts = dd ? dd.textContent : '';
['Profilim', 'Sozlamalar', 'Til', 'Mavzu', 'Yordam', 'Chiqish'].forEach(function (t) {
  ok(menuTexts.indexOf(t) !== -1, 'Menyu elementi: ' + t);
});
ok(menuItems.length && menuItems[menuItems.length - 1].classList.contains('ux-menu-danger'), "Chiqish xavfsiz uslubda (ux-menu-danger)");
const lcm = doc.querySelector('#logoutConfirmModal');
ok(!!lcm, 'Chiqish tasdiqlash modali DOMda');
ok(lcm.textContent.indexOf('Hisobdan chiqmoqchimisiz?') !== -1, 'Modal savoli: Hisobdan chiqmoqchimisiz?');
ok(lcm.textContent.indexOf('Bekor qilish') !== -1 && lcm.textContent.indexOf('Chiqish') !== -1, 'Bekor qilish / Chiqish tugmalari bor');
ok(lcm.textContent.indexOf('saqlanib qoladi') !== -1, "Modalda ma'lumotlar saqlanadi izohi bor");
ok(!!doc.querySelector('#logoutConfirmBtn'), 'Tasdiqlash tugmasi (#logoutConfirmBtn) bor');

/* ===================== 12. UX — SHAKE, TOAST, ARROW, EFFECTS, PROGRESS ===================== */
section('UX — SHAKE / TOAST / ARROW / EFFECTS / PROGRESS ANIMATSIYA');
// Yangi foydalanuvchi bilan toza holat
w.__itGetCurrentUser = function () { return { username: 'uxtest', email: 'ux@test.com' }; };
w.eval(dataSrc);
w.eval(appSrc);
w.Lessons.handlePage('lessons');
const bannerBtn11 = doc.querySelector('#lsContinueBtn');
ok(bannerBtn11 && bannerBtn11.querySelector('.ls-btn-arrow'), 'Davom ettirish tugmasida arrow span bor');

// Kurs sahifasi (beginner daraja)
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
answerDiagnostic('wrong'); // beginner
const resumeBtn11 = doc.querySelector('#lsResumeBtn');
ok(resumeBtn11 && resumeBtn11.querySelector('.ls-btn-arrow'), 'Kurs sahifasi Davom ettirish tugmasida arrow bor');
const chip11 = doc.querySelector('#lsCourseContainer .ls-level-chip');
ok(!!chip11 && chip11.textContent.indexOf('Umuman bilmayman') !== -1, 'Bilim darajasi badge chiqdi');

// Qulflangan karta: shake + toast + modal
const lockedCard11 = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card')[1];
click(lockedCard11);
ok(lockedCard11.classList.contains('ls-shake'), 'Qulflangan karta shake animatsiya oladi');
ok(w.__lastToast.msg.indexOf('Bu dars hozircha yopiq') !== -1, 'Toast: Bu dars hozircha yopiq');
ok(doc.querySelector('#lessonLockedModal').classList.contains('active'), 'Qulf modal ham ochiladi (eski funksiya saqlangan)');
// modalni yopish
click(doc.querySelector('#lessonLockedFooter .btn-ghost'));

// Completion via test: hook info (xp=10, coins=20), toast, effects
let hookInfo = null;
w.LessonsHooks.onLessonComplete.push(function (info) { hookInfo = info; });
click(doc.querySelectorAll('#lsCourseContainer .ls-lesson-card')[0]); // 1-dars (read bosqichi)
click(doc.querySelector('#lsMarkReadBtn')); // o'qilgan deb belgilash
click(doc.querySelector('#lsStartQuizBtn')); // testni boshlash
// 5 savolga to'g'ri javob
const quizBank12 = w.CoursesAPI.getCourse('html').lessons[0].quiz.questions;
for (let qi = 0; qi < 5; qi++) {
  const qText = normS(doc.querySelector('.ls-quiz-question').textContent);
  const bankQ = quizBank12.find(function (b) { return normS(b.question) === qText; });
  const correctText = normS(bankQ.options[bankQ.answer]);
  const target = Array.from(doc.querySelectorAll('.ls-quiz-option')).find(function (o) { return normS(o.textContent).indexOf(correctText) !== -1; });
  click(target);
  click(doc.querySelector('#lsQuizNextBtn'));
}
ok(hookInfo && hookInfo.xp === 10 && hookInfo.coins === 20, 'Hook info: xp=10, coins=20 (+10 XP / +20 Coin)');
ok(w.__lastToast.msg.indexOf('🪙') !== -1 && w.__lastToast.msg.indexOf('XP') !== -1, 'Toastda XP va Coin bor');
ok(typeof w.LessonsEffects === 'object' && typeof w.LessonsEffects.celebrate === 'function', 'LessonsEffects.celebrate mavjud');
w.LessonsEffects.celebrate({}); // xatosiz ishlashi kerak (confetti yo'q muhitda)
ok(true, 'celebrate xatosiz chaqirildi');

// Progress bar animatsiyasi: 0% dan boshlanadi -> rAF dan keyin haqiqiy qiymat
click(doc.querySelector('#lsBackToCourse'));
const bar11 = doc.querySelector('#lsCourseContainer .ls-progress-track span');
ok(bar11 && bar11.style.width === '0%', 'Progress bar 0% dan boshlanadi (animatsiya rejimi)');
setTimeout(function () {
  ok(bar11 && bar11.style.width === '3%', 'Progress bar 3% ga smooth to‘ldi (1/30, rAF dan keyin)');

/* ===================== 13. TESTDAN O'TMASLIK + QAYTA TOPSHIRISH ===================== */
section("TESTDAN O'TMASLIK — QAYTA TOPSHIRISH");
w.__itGetCurrentUser = function () { return { username: 'failuser' }; };
w.eval(dataSrc);
w.eval(appSrc);
w.Lessons.handlePage('lessons');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
answerDiagnostic('wrong'); // beginner
click(doc.querySelectorAll('#lsCourseContainer .ls-lesson-card')[0]); // 1-dars
click(doc.querySelector('#lsMarkReadBtn'));
click(doc.querySelector('#lsStartQuizBtn'));
// 3 ta to'g'ri, 2 ta noto'g'ri => 60% — o'tmadi
for (let qi = 0; qi < 5; qi++) {
  const qText = normS(doc.querySelector('.ls-quiz-question').textContent);
  const bankQ = quizBank.find(function (b) { return normS(b.question) === qText; });
  const correctText = normS(bankQ.options[bankQ.answer]);
  const optsF = Array.from(doc.querySelectorAll('.ls-quiz-option'));
  let targetF = optsF.find(function (o) { return normS(o.textContent).indexOf(correctText) !== -1; });
  if (qi >= 3) {
    targetF = optsF.find(function (o) { return normS(o.textContent).indexOf(correctText) === -1; });
  }
  click(targetF); // javob berish
  if (qi >= 3) {
    ok(doc.querySelector('.ls-quiz-option.ls-opt-wrong') !== null, (qi + 1) + '-savol: noto\'g\'ri javob qizil belgilandi');
    ok(doc.querySelector('.ls-quiz-option.ls-opt-correct') !== null, (qi + 1) + '-savol: to\'g\'ri javob ham ko\'rsatildi');
  }
  click(doc.querySelector('#lsQuizNextBtn'));
}
const failHero = doc.querySelector('.ls-result-hero');
ok(failHero !== null && failHero.classList.contains('fail'), 'Natija: FAIL holati');
ok(failHero.textContent.includes('yetarli bo‘lmadi'), '😔 Xato matni bor');
ok(failHero.textContent.includes('3 / 5'), 'Ball 3/5');
ok(failHero.textContent.includes('60%'), 'Foiz 60%');
ok(failHero.textContent.includes('Testdan o‘tmadingiz'), '❌ Testdan o\'tmadingiz');
ok(failHero.textContent.includes('80%'), 'Minimal ball eslatmasi (80%) bor');
ok(doc.querySelector('#lsRetakeBtn') !== null, '🔄 Qayta topshirish tugmasi bor');
ok(doc.querySelector('#lsReviewLessonBtn') !== null, '📚 Darsni qayta ko\'rish tugmasi bor');
ok(doc.querySelector('#lsGoNextBtn') === null, 'Keyingi dars tugmasi YO\'Q (o\'tmadi)');
ok(doc.querySelectorAll('.ls-review-item.wrong').length === 2, '2 ta noto\'g\'ri javob tahlilda belgilangan');
ok(doc.querySelectorAll('.ls-review-line.good').length === 2, 'Noto\'g\'ri javoblar uchun to\'g\'ri javob ko\'rsatilgan');

// O'tmasa — keyingi dars yopiq qoladi
click(doc.querySelector('#lsBackToCourse'));
const lessonsF = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(lessonsF[1].classList.contains('ls-locked'), 'Testdan o\'tmagach 2-dars HAMON yopiq');
ok(doc.querySelector('#lsCourseContainer').textContent.includes('0%'), 'Progress 0% — o\'tmagan dars hisobga olinmadi');
// Qayta topshirish: darsga qaytib, testni yangi random savollar bilan topshirish
click(doc.querySelectorAll('#lsCourseContainer .ls-lesson-card')[0]); // 1-darsga qaytish (read bosqichi — o'qilgan, tugallanmagan)
ok(doc.querySelector('#lsStartQuizBtn') !== null, 'Qayta kirganda test tugmasi mavjud (o\'qilgan saqlangan)');
click(doc.querySelector('#lsStartQuizBtn'));
const attempt1 = [];
for (let qi = 0; qi < 5; qi++) {
  attempt1.push(normS(doc.querySelector('.ls-quiz-question').textContent));
  const bankQ1 = quizBank.find(function (b) { return normS(b.question) === attempt1[qi]; });
  const correct1 = normS(bankQ1.options[bankQ1.answer]);
  click(Array.from(doc.querySelectorAll('.ls-quiz-option')).find(function (o) { return normS(o.textContent).indexOf(correct1) !== -1; }));
  if (qi < 4) click(doc.querySelector('#lsQuizNextBtn'));
}
click(doc.querySelector('#lsQuizNextBtn')); // natija
const passHero2 = doc.querySelector('.ls-result-hero');
ok(passHero2.classList.contains('pass'), 'Qayta topshirishda o\'tdi (100%)');
// dars endi tugallandi — 2-dars ochildi
click(doc.querySelector('#lsBackToCourse'));
const lessonsF2 = doc.querySelectorAll('#lsCourseContainer .ls-lesson-card');
ok(lessonsF2[0].classList.contains('ls-completed'), 'Qayta topshirib o\'tgach 1-dars tugallandi');
ok(!lessonsF2[1].classList.contains('ls-locked'), 'Endi 2-dars ochildi');
ok(doc.querySelector('#lsCourseContainer').textContent.includes('3%'), 'Progress 3% bo\'ldi');

// RANDOM: ikki urinishda savollar to'plami farq qilishi kerak (ehtimoliy — C(15,5)=3003)
w.__itGetCurrentUser = function () { return { username: 'randuser' }; };
w.eval(dataSrc);
w.eval(appSrc);
w.Lessons.handlePage('lessons');
click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
answerDiagnostic('correct'); // advanced
w.Lessons.openLesson('html', 'html-d1');
click(doc.querySelector('#lsMarkReadBtn'));
click(doc.querySelector('#lsStartQuizBtn'));
const setA = [];
for (let qi = 0; qi < 5; qi++) {
  setA.push(normS(doc.querySelector('.ls-quiz-question').textContent));
  click(doc.querySelectorAll('.ls-quiz-option')[0]); // birinchi variant
  if (qi < 4) click(doc.querySelector('#lsQuizNextBtn'));
}
click(doc.querySelector('#lsQuizBackBtn')); // darsga qaytish (urinish bekor)
click(doc.querySelector('#lsStartQuizBtn')); // yangi urinish
const setB = [];
for (let qi = 0; qi < 5; qi++) {
  setB.push(normS(doc.querySelector('.ls-quiz-question').textContent));
  click(doc.querySelectorAll('.ls-quiz-option')[0]);
  if (qi < 4) click(doc.querySelector('#lsQuizNextBtn'));
}
const sameSet = setA.length === setB.length && setA.every(function (q) { return setB.indexOf(q) !== -1; });
ok(!sameSet, 'Random: ikki urinishda savollar to\'plami farq qiladi');
setA.forEach(function (q) {
  ok(quizBank.some(function (b) { return normS(b.question) === q; }), 'Random savol bankdan: ' + q.slice(0, 32) + '...');
});
  /* ===================== XULOSA ===================== */
  console.log('\n==========================================');
  console.log('  NATIJA: ' + passed + ' otdi, ' + failed + ' xato');
  console.log('==========================================');
  process.exit(failed ? 1 : 0);
}, 250);

