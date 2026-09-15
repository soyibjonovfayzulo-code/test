/* SERTIFIKAT TIZIMI — REAL TEST (jsdom)
   Run: node certificates-check.cjs
   Per-lesson sertifikat oqimini haqiqiy DOM muhitida tekshiradi:
   preview grid, unique ID, ism oqimi, duplicate protection,
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
ok(CERT.CONFIG.CERTIFICATE_PREVIEW_MODE === true, 'CERTIFICATE_PREVIEW_MODE = true (preview rejim)');
ok(CERT.CONFIG.TEMPLATE_VERSION >= 1, 'TEMPLATE_VERSION saqlangan');
const totalLessons = API.listCourses().reduce((s, c) => s + c.lessons.length, 0);
ok(totalLessons > 0, 'CoursesAPI kurs/dars data mavjud (' + totalLessons + ' dars)');

/* ===== 2. PREVIEW GRID — barcha darslar uchun karta ===== */
section('Sertifikatlar page (preview grid)');
CERT.renderPage();
const cards = doc.querySelectorAll('#certGrid .certp-card');
ok(cards.length === totalLessons, 'har bir dars uchun karta: ' + cards.length + '/' + totalLessons);
const btns = doc.querySelectorAll('#certGrid [data-cert-open]');
ok(btns.length === totalLessons, 'har bir kartada "Sertifikatni ko\'rish" tugmasi: ' + btns.length);
ok(doc.querySelector('#certSummaryRow').textContent.indexOf('Sertifikat') !== -1, 'summary statistika render bo\'ldi');
ok(doc.querySelector('#certNameBar').textContent.indexOf('Ismni') !== -1, 'ism paneli render bo\'ldi');

/* ===== 3. ISM OQIMI (birinchi martta) ===== */
section('Ism yig\'ish oqimi');
const htmlCourse = API.getCourse('html');
const l1 = htmlCourse.lessons[0];
CERT.openCertForLesson(htmlCourse, l1);
const nameInput = doc.querySelector('#certNameInput');
ok(!!nameInput, 'ism kiritilmaganda NAME SCREEN ochildi');
ok(doc.querySelector('#certViewerOverlay').classList.contains('open'), 'viewer overlay ochiq');
nameInput.value = 'A';
nameInput.dispatchEvent(new w.Event('input', { bubbles: true }));
let submitBtn = doc.querySelector('#certNameSubmitBtn');
ok(submitBtn.disabled === true, 'juda qisqa ism — submit bloklandi');
nameInput.value = '   ';
nameInput.dispatchEvent(new w.Event('input', { bubbles: true }));
ok(submitBtn.disabled === true, 'bo\'sh ism — submit bloklandi');
nameInput.value = 'Ahatjon Soyibjonov';
nameInput.dispatchEvent(new w.Event('input', { bubbles: true }));
ok(submitBtn.disabled === false, 'tog\'ri ism — submit ochiladi');
ok(CERT.getCertName() === null, 'saqlamaguncha ism yo\'q');
doc.querySelector('#certNameForm').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
ok(CERT.getCertName() === 'Ahatjon Soyibjonov', 'ism trimlab saqlandi');
ok(w.__savedUserState === true, 'user state\'ga mirror qilindi (__itSaveUserState)');

/* ===== 4. CERTIFICATE PAPER — real data ===== */
section('Sertifikat paper (real data)');
const paper = doc.querySelector('.cert-paper');
ok(!!paper, 'certificate paper render bo\'ldi');
const nameEl = doc.querySelector('.cert-name');
ok(nameEl && nameEl.textContent.trim() === 'Ahatjon Soyibjonov', 'user name tog\'ri: ' + (nameEl && nameEl.textContent));
const bodyTxt = doc.querySelector('.cert-body').textContent;
ok(bodyTxt.indexOf('HTML') !== -1 && bodyTxt.indexOf('1') !== -1, 'course + dars raqami dinamik');
ok(bodyTxt.indexOf(l1.title) !== -1, 'lesson title real data: ' + l1.title);
const idTxt = doc.querySelector('#certIdCode').textContent;
ok(/^ITT-HTML-L01-[A-Z2-9]{6}$/.test(idTxt), 'unique ID format: ' + idTxt);
const dateTxt = doc.querySelector('#certIssueDate').textContent;
ok(/^\d{2}\.\d{2}\.\d{4}$/.test(dateTxt), 'real local date format: ' + dateTxt);
ok(doc.querySelector('.cert-foot-qr svg'), 'QR code SVG mavjud');
ok(doc.querySelector('.cert-stats'), 'stats blok mavjud');
ok(paper.textContent.indexOf('undefined') === -1 && paper.textContent.indexOf('null') === -1, 'undefined/null YO\'Q');
ok(CERT.count() === 1, 'bitta certificate record yaratildi');

/* ===== 5. IKKINCHI DARS — ism qayta so\'ralmaydi ===== */
section('Ikkinchi dars — auto ism');
const l2 = htmlCourse.lessons[1];
CERT.openCertForLesson(htmlCourse, l2);
ok(!doc.querySelector('#certNameInput'), 'ism modal QAYTA CHIQMADI');
const paper2 = doc.querySelector('.cert-paper');
ok(!!paper2, '2-dars sertifikati to\'g\'ridan-to\'g\'ri ochildi');
ok(paper2.querySelector('.cert-name').textContent.trim() === 'Ahatjon Soyibjonov', 'saqlangan ism ishlatildi');
const id2 = doc.querySelector('#certIdCode').textContent;
ok(/^ITT-HTML-L02-/.test(id2), '2-dars ID: ' + id2);
ok(CERT.count() === 2, '2 ta record');

/* ===== 6. DUPLICATE PROTECTION ===== */
section('Duplicate protection');
const before = JSON.stringify(CERT.getCertByLesson('html', l2.id));
CERT.openCertForLesson(htmlCourse, l2);
CERT.openCertForLesson(htmlCourse, l2);
const after = JSON.stringify(CERT.getCertByLesson('html', l2.id));
ok(before === after, 'qayta ochish recordni o\'zgartirmadi');
ok(CERT.count() === 2, 'record soni o\'zgarmadi (2)');

/* ===== 7. UNIQUE ID — barcha darslar ===== */
section('Unique ID generator');
const ids = new Set();
let dup = 0;
API.listCourses().forEach(c => c.lessons.forEach(l => {
  const r = CERT.ensureCert(c, l).record;
  if (ids.has(r.certificateId)) dup++;
  ids.add(r.certificateId);
}));
ok(dup === 0, 'hech bir ID takrorlanmadi (' + ids.size + ' unique ID)');
ok(ids.size === totalLessons, 'har darsga alohida ID: ' + ids.size);
const sample = CERT.getCertByLesson('python', 'python-d1');
ok(sample.certificateId.indexOf('ITT-PYTHON-L01-') === 0, 'python kurs tagidan: ' + sample.certificateId);

/* ===== 8. VERIFIKATSIYA ===== */
section('Verifikatsiya');
CERT.openVerify(id2);
ok(doc.querySelector('#certVerifyOverlay').classList.contains('open'), 'verify overlay ochiq');
ok(doc.querySelector('#certVerifyBody').textContent.indexOf('haqiqiy') !== -1, '✅ Sertifikat haqiqiy');
ok(doc.querySelector('#certVerifyBody').textContent.indexOf(id2) !== -1, 'verify da ID ko\'rsatildi');
const sInp = doc.querySelector('#verifySearchInput');
sInp.value = 'ITT-HTML-L99-XXXXXX';
doc.querySelector('#verifySearchForm').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
ok(doc.querySelector('#certVerifyBody').textContent.indexOf('topilmadi') !== -1, '❌ noto\'g\'ri ID — Sertifikat topilmadi');
doc.querySelector('#verifySearchInput').value = idTxt;
doc.querySelector('#verifySearchForm').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
ok(doc.querySelector('#certVerifyBody').textContent.indexOf('haqiqiy') !== -1, 'manual ID search: topildi');

/* ===== 9. HASH ROUTING (#/verify/<ID>) ===== */
section('QR hash routing');
w.location.hash = CERT.CONFIG.VERIFY_ROUTE + id2;
w.dispatchEvent(new w.Event('hashchange'));
ok(doc.querySelector('#certVerifyBody').textContent.indexOf('haqiqiy') !== -1, '#/verify/<ID> — verify page ochildi');

/* ===== 10. LESSON COMPLETE HOOK ===== */
section('Lesson complete hook');
const hooks = w.LessonsHooks.onLessonComplete;
ok(Array.isArray(hooks) && hooks.indexOf(CERT.onLessonComplete) !== -1, 'ITCertificates.onLessonComplete — LessonsHooks ulangan');
ok(hooks.length >= 2, 'Daily/Streak hook\'i bilan parallel (jami ' + hooks.length + ' hook)');
/* onLessonComplete 1.6s delay bilan auto-open qiladi — sinxron qismi xatosiz o'tishini tekshiramiz */
CERT.onLessonComplete({ course: API.getCourse('css'), lesson: API.getCourse('css').lessons[0], xp: 10 });
ok(true, 'hook chaqiruvi xatosiz (certificate 1.6s keyin auto-open)');
/*.delay qisqartirilgan holda: ensureCert to'g'ridan-to'g'ri tekshiruv */
const cssRes = CERT.ensureCert(API.getCourse('css'), API.getCourse('css').lessons[0]);
ok(!!cssRes.record && cssRes.record.certificateId.indexOf('ITT-CSS-L01-') === 0, 'css 1-dars record: ' + cssRes.record.certificateId);

/* ===== 11. SEARCH + FILTER ===== */
section('Search / filter');
/* real completion seed (progress store — source of truth) */
w.localStorage.setItem('darslar_state_v1::testuser', JSON.stringify({
  progress: { html: { completed: { 'html-d1': { at: Date.now(), score: 5, percent: 100 } } } }
}));
CERT.renderPage();
const searchInp = doc.querySelector('#certSearch');
searchInp.value = 'html 2';
searchInp.dispatchEvent(new w.Event('input', { bubbles: true }));
const filtered = doc.querySelectorAll('#certGrid .certp-card');
ok(filtered.length >= 1 && filtered.length < totalLessons, 'search "html 2" → ' + filtered.length + ' karta');
searchInp.value = '';
searchInp.dispatchEvent(new w.Event('input', { bubbles: true }));
const chips = doc.querySelectorAll('#certFilters .chip');
click(chips[1]); /* Tugallangan */
const completedCards = doc.querySelectorAll('#certGrid .certp-card');
ok(completedCards.length === 1, '"Tugallangan" filtr: ' + completedCards.length + ' karta (html 1-dars)');
click(chips[2]); /* Preview */
const previewCards = doc.querySelectorAll('#certGrid .certp-card');
ok(previewCards.length === totalLessons - 1, '"Preview" filtr: ' + previewCards.length + ' karta');
click(chips[0]); /* Barchasi */
ok(doc.querySelectorAll('#certGrid .certp-card').length === totalLessons, 'Barchasi → to\'liq grid');

/* ===== 12. PROFILE INTEGRATSIYA ===== */
section('Profil integratsiya');
CERT.renderProfileSummary();
ok(doc.querySelector('#profileCertSummary .profile-cert-card'), 'profil sertifikat kartasi render bo\'ldi');
ok(doc.querySelector('#profileCertSummary').textContent.indexOf(totalLessons + ' ta sertifikat') !== -1, 'profil kartasida jami son: ' + totalLessons);

/* ===== 13. UNLOCK ARCHITECTURE (production switch) ===== */
section('Production switch arxitekturasi');
CERT.CONFIG.CERTIFICATE_PREVIEW_MODE = false;
CERT.CONFIG.REQUIRE_LESSON_COMPLETE = true;
CERT.renderPage();
const lockCard = doc.querySelector('#certGrid .certp-card.locked');
ok(!!lockCard, 'preview OFF → tugallanmagan darslar 🔒 locked');
ok(doc.querySelector('#certGrid .certp-card.locked button').disabled === true, 'locked karta tugmasi o\'chirilgan');
CERT.CONFIG.CERTIFICATE_PREVIEW_MODE = true;
CERT.CONFIG.REQUIRE_LESSON_COMPLETE = false;
CERT.renderPage();
ok(!doc.querySelector('#certGrid .certp-card.locked'), 'preview ON → hammasi ochiq (qayta tiklandi)');

/* ===== NATIJA ===== */
console.log('\n===== NATIJA =====');
console.log('Passed: ' + passed + ' | Failed: ' + failed);
if (failed === 0) { console.log('✅ SERTIFIKAT TIZIMI — BARCHA TESTLAR PASS'); process.exit(0); }
process.exit(1);
