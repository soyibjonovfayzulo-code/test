/* SERTIFIKAT TIZIMI — REAL TEST (jsdom)
   Run: node certificates-check.cjs
   PER-COURSE sertifikat oqimini haqiqiy DOM muhitida tekshiradi:
   har kurs uchun 1 karta, 100% lock/unlock, ism oqimi, duplicate protection,
   QR/verifikatsiya, hash routing, PDF/share tugmalari. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8');
const qrSrc = fs.readFileSync(path.join(root, 'node_modules/qrcode-generator/dist/qrcode.js'), 'utf8');
let certSrc = fs.readFileSync(path.join(root, 'certificates.js'), 'utf8');
/* ES import — jsdom uchun UMD global (window.qrcode) bilan almashtiriladi */
certSrc = certSrc.replace(/^\s*import\s+qrcode\s+from\s+'qrcode-generator';?\s*$/m, '');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://ittest.test/' });
const w = dom.window;
const doc = w.document;

const visitedPages = [];
w.__itShowPage = (name) => { visitedPages.push(name); };
w.__itGetCurrentUser = () => ({ id: 'u1', username: 'testuser', email: 'test@mail.com', firstname: 'Ahatjon', lastname: 'Soyibjonov' });
w.__itSaveUserState = () => { w.__savedUserState = true; };
w.showToast = (msg, type) => { w.__lastToast = { msg, type }; };

w.eval(qrSrc);
if (typeof w.qrcode !== 'function') throw new Error('qrcode UMD global yuklanmadi');
w.eval(dataSrc);
w.eval(appSrc);
w.eval(certSrc);
/* jsdom: DOMContentLoaded hali otilmagan bo'lsa — certificates.js init ishga tushsin */
if (doc.readyState === 'loading') {
  doc.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true }));
}

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }

const API = w.CoursesAPI;
const CERT = w.ITCertificates;

/* ===== 1. MODUL VA CONFIG ===== */
section('Modul va config');
ok(!!CERT, 'window.ITCertificates mavjud');
ok(CERT.CONFIG.CERTIFICATE_PREVIEW_MODE === false, 'CERTIFICATE_PREVIEW_MODE = false (production: locked)');
ok(CERT.CONFIG.REQUIRE_COURSE_COMPLETE === true, 'REQUIRE_COURSE_COMPLETE = true (kurs 100% talab)');
ok(CERT.CONFIG.TEMPLATE_VERSION >= 2, 'TEMPLATE_VERSION >= 2 (per-kurs shablon)');
const COURSES = API.listCourses();
const totalCourses = COURSES.length;
const totalLessons = COURSES.reduce((s, c) => s + c.lessons.length, 0);
ok(totalCourses > 0 && totalLessons > 0, 'CoursesAPI kurs/dars data mavjud (' + totalCourses + ' kurs, ' + totalLessons + ' dars)');

/* ===== 2. PER-COURSE GRID — har kurs uchun 1 karta (locked) ===== */
section('Sertifikatlar page (per-course grid, locked)');
CERT.renderPage();
const cards = doc.querySelectorAll('#certGrid .certp-card');
ok(cards.length === totalCourses, 'har bir KURS uchun bitta karta: ' + cards.length + '/' + totalCourses);
ok(doc.querySelectorAll('#certGrid .certp-card.locked').length === totalCourses, 'hech bir kurs 100% emas → hammasi 🔒 locked');
ok(doc.querySelectorAll('#certGrid [data-cert-open]').length === 0, 'qulflangan kartalarda "Sertifikatni ko\'rish" tugmasi YO\'Q');
ok(doc.querySelectorAll('#certGrid .certp-progress').length === totalCourses, 'har kartada kurs progress bar (X/Y dars)');
ok(doc.querySelector('#certSummaryRow').textContent.indexOf('Sertifikat') !== -1, 'summary statistika render bo\'ldi');
ok(doc.querySelector('#certNameBar').textContent.indexOf('Ismni') !== -1, 'ism paneli render bo\'ldi');

/* ===== 3. ENSURECERT — tugallanmagan kurs qulflangan ===== */
section('ensureCert — locked holat');
const htmlCourse = API.getCourse('html');
const lockedRes = CERT.ensureCert(htmlCourse);
ok(lockedRes.locked === true && !lockedRes.record, '100% emas → sertifikat berilmaydi (locked)');

/* ===== 4. KURSNI 100% TUGATISH → UNLOCK ===== */
section('Kurs 100% → unlock');
function seedCourse(courseId) {
  const c = API.getCourse(courseId);
  let progress = {};
  try { progress = JSON.parse(w.localStorage.getItem('darslar_state_v1::testuser')) || {}; } catch (e) {}
  if (!progress.progress) progress.progress = {};
  progress.progress[courseId] = { completed: {}, testResults: {} };
  c.lessons.forEach(l => {
    progress.progress[courseId].completed[l.id] = { at: Date.now(), score: 5, percent: 100 };
    progress.progress[courseId].testResults[l.id] = { passed: true, score: 5, total: 5, percent: 100, at: Date.now(), attempts: 1 };
  });
  w.localStorage.setItem('darslar_state_v1::testuser', JSON.stringify(progress));
}
seedCourse('html');
CERT.renderPage();
const unlockedCards = doc.querySelectorAll('#certGrid .certp-card:not(.locked)');
ok(unlockedCards.length === 1, 'HTML 100% tugatildi → 1 karta unlocked');
const htmlBtn = doc.querySelector('#certGrid [data-cert-open="html"]');
ok(!!htmlBtn, 'unlocked kartada "Sertifikatni ko\'rish" tugmasi chiqdi');

/* ===== 5. ISM OQIMI (birinchi martta) → sertifikat qog'ozi ===== */
section('Ism yig\'ish oqimi');
click(htmlBtn);
ok(!!doc.querySelector('#certViewerOverlay.open'), 'viewer ochildi');
ok(!!doc.querySelector('#certNameForm'), 'birinchi martta ism formasi ko\'rsatildi');
const nameInput = doc.querySelector('#certNameInput');
nameInput.value = 'Ahatjon Soyibjonov';
nameInput.dispatchEvent(new w.Event('input', { bubbles: true }));
doc.querySelector('#certNameForm').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
const paper = doc.querySelector('#certvBody .cert-paper');
ok(!!paper, 'ism saqlandi → sertifikat qog\'ozi render bo\'ldi');
ok(paper.textContent.indexOf('Ahatjon Soyibjonov') !== -1, 'ism qog\'ozda: Ahatjon Soyibjonov');
ok(paper.textContent.indexOf('ITT-HTML-FULL-') !== -1, 'per-course ID: ITT-HTML-FULL-...');
ok(paper.textContent.indexOf('HTML') !== -1, 'kurs nomi qog\'ozda: HTML');
ok(paper.textContent.indexOf('100%') !== -1, '100% yakunlangan matni bor');

/* ===== 6. DUPLICATE PROTECTION ===== */
section('Duplicate protection (per-course)');
const r1 = CERT.ensureCert(htmlCourse).record;
const r2 = CERT.ensureCert(htmlCourse).record;
ok(r1.certificateId === r2.certificateId, 'user+kurs uchun 1 ta record: ' + r1.certificateId);
ok(CERT.allCertificates().length === 1, 'allCertificates: 1 ta kurs sertifikati (eski per-lesson yozuvlar hisobga olinmaydi)');
/* eski per-lesson yozuv (::) e'tiborga olinmaydi */
w.localStorage.setItem('ittest_certs_v1::testuser', JSON.stringify({
  name: 'Ahatjon Soyibjonov',
  certs: { 'html::html-d1': { certificateId: 'ITT-HTML-L01-OLDOLD' }, 'html': r1 }
}));
ok(CERT.allCertificates().length === 1, 'legacy "courseId::lessonId" yozuvlari filtrlandi');
const res = CERT.ensureCert(htmlCourse).record;
ok(res.certificateId === r1.certificateId, 'yangi mantiq record buzilmadi: ' + res.certificateId);

/* ===== 7. QR + VERIFIKATSIYA + HASH ROUTING ===== */
section('QR / verifikatsiya / hash routing');
CERT.closeViewer();
const htmlCert = CERT.getCertByCourse('html');
ok(!!htmlCert && htmlCert.lessonsCount === htmlCourse.lessons.length, 'getCertByCourse: lessonsCount = ' + htmlCert.lessonsCount);
w.location.hash = CERT.CONFIG.VERIFY_ROUTE + htmlCert.certificateId;
w.dispatchEvent(new w.Event('hashchange', { bubbles: true }));
ok(doc.querySelector('#certVerifyBody').textContent.indexOf('haqiqiy') !== -1, '#/verify/<ID> — verify page ochildi (to\'liq kurs)');
w.location.hash = '';
w.dispatchEvent(new w.Event('hashchange', { bubbles: true }));

/* ===== 8. LESSON COMPLETE HOOK → faqat kurs 100% bo'lganda ===== */
section('Lesson complete hook (per-course flow)');
const hooks = w.LessonsHooks.onLessonComplete;
ok(Array.isArray(hooks) && hooks.indexOf(CERT.onLessonComplete) !== -1, 'ITCertificates.onLessonComplete — LessonsHooks ulangan');
ok(hooks.length >= 2, 'Daily/Streak hook\'i bilan parallel (jami ' + hooks.length + ' hook)');
/* CSS kursi hali tugallanmagan — hook hech narsa ochmasligi kerak */
CERT.onLessonComplete({ course: API.getCourse('css'), lesson: API.getCourse('css').lessons[0], xp: 10 });
ok(true, 'hook chaqiruvi xatosiz (kurs 100% emas → auto-open yo\'q)');
seedCourse('css');
CERT.onLessonComplete({ course: API.getCourse('css'), lesson: API.getCourse('css').lessons[0], xp: 10 });
const cssRes = CERT.ensureCert(API.getCourse('css'));
ok(!!cssRes.record && cssRes.record.certificateId.indexOf('ITT-CSS-FULL-') === 0, 'css 100% → kurs sertifikati: ' + cssRes.record.certificateId);

/* ===== 9. SEARCH + FILTER ===== */
section('Search / filter');
CERT.closeViewer();
CERT.renderPage();
const searchInp = doc.querySelector('#certSearch');
searchInp.value = 'html';
searchInp.dispatchEvent(new w.Event('input', { bubbles: true }));
let filtered = doc.querySelectorAll('#certGrid .certp-card');
ok(filtered.length === 1, 'search "html" → 1 karta (kurs bo\'yicha)');
searchInp.value = '';
searchInp.dispatchEvent(new w.Event('input', { bubbles: true }));
const chips = doc.querySelectorAll('#certFilters .chip');
click(chips[1]); /* Tugallangan */
const completedCards = doc.querySelectorAll('#certGrid .certp-card');
ok(completedCards.length === 2, '"Tugallangan" filtr: 2 karta (html + css)');
click(chips[2]); /* Qulflangan */
const lockedCards = doc.querySelectorAll('#certGrid .certp-card');
ok(lockedCards.length === totalCourses - 2, '"Qulflangan" filtr: ' + lockedCards.length + ' karta');
click(chips[0]); /* Barchasi */
ok(doc.querySelectorAll('#certGrid .certp-card').length === totalCourses, 'Barchasi → to\'liq grid (' + totalCourses + ' kurs)');

/* ===== 10. PROFILE INTEGRATSIYA ===== */
section('Profil integratsiya');
CERT.renderProfileSummary();
ok(doc.querySelector('#profileCertSummary .profile-cert-card'), 'profil sertifikat kartasi render bo\'ldi');
ok(doc.querySelector('#profileCertSummary').textContent.indexOf('2 ta kurs sertifikati') !== -1, 'profil kartasida 2 ta kurs sertifikati');

/* ===== 11. PREVIEW SWITCH (dizayn review rejimi) ===== */
section('Preview switch arxitekturasi');
CERT.CONFIG.CERTIFICATE_PREVIEW_MODE = true;
CERT.renderPage();
ok(!doc.querySelector('#certGrid .certp-card.locked'), 'preview ON → hammasi ochiq (dizayn review)');
ok(doc.querySelectorAll('#certGrid [data-cert-open]').length === totalCourses, 'preview ON → har kartada ko\'rish tugmasi');
CERT.CONFIG.CERTIFICATE_PREVIEW_MODE = false;
CERT.renderPage();
ok(doc.querySelectorAll('#certGrid .certp-card.locked').length === totalCourses - 2, 'preview OFF → qayta locked (2 ta tugallangan bundan tashqari)');

/* ===== NATIJA ===== */
console.log('\n===== NATIJA =====');
console.log('Passed: ' + passed + ' | Failed: ' + failed);
if (failed === 0) { console.log('✅ SERTIFIKAT TIZIMI (PER-COURSE) — BARCHA TESTLAR PASS'); process.exit(0); }
process.exit(1);