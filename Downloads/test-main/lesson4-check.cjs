/* 4-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
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
window.__itGetCurrentUser = function () { return { username: 'student4', email: 's4@mail.com' }; };
window.showToast = function () {};
window.confirm = function () { return true; };

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

const API = window.CoursesAPI;
const l4 = API.findLesson('html', 'html-d4');
console.log('4-dars:', l4 && l4.lesson.title);

window.Lessons.openCourse('html');
window.Lessons.openLesson('html', 'html-d4');

const wrap = doc.querySelector('#lsLessonContainer');
ok(wrap.textContent.includes('<a> — link elementi'), 'Section 1: <a> tushuntirilgan');
ok(wrap.textContent.includes('href va URL'), 'Section 2: href/URL');
ok(wrap.textContent.includes('Tashqi va ichki link'), 'Section 3: tashqi/ichki');
ok(wrap.textContent.includes('target="_blank"') && wrap.textContent.includes('Yangi tabda ochish'), 'Section 4: target=_blank');
ok(wrap.textContent.includes('mailto:test@example.com') && wrap.textContent.includes('tel:+998901234567'), 'Section 5: mailto + tel');
ok(wrap.textContent.includes('Page anchor') && wrap.textContent.includes('href="#contact"'), 'Section 6: anchor');
ok(wrap.textContent.includes('JavaScript: link bosilishini boshqarish') && wrap.textContent.includes('preventDefault'), 'Section 7: JS click event (kichik intro)');
ok(wrap.textContent.includes('KEYINGI DARS: 5-DARS'), 'Keyingi dars teaseri bor');

/* LIVE DEMO */
const demo = wrap.querySelector('.ls-livedemo');
ok(demo !== null, 'Real Interactive Demo bloki bor');
const demoTa = demo.querySelector('[data-demo-code]');
const demoFrame = demo.querySelector('iframe.ls-livedemo-frame');
const demoBtn = demo.querySelector('[data-demo-run]');
ok(demoTa && demoFrame && demoBtn, 'Demo: editor + iframe + RUN tugmasi bor');
ok(!demoFrame.getAttribute('srcdoc'), 'Demo iframe boshlanishida bosh (fake preview YOQ)');
fire(demoTa, 'input');
demoTa.value = '<a href="https://example.com" id="demoLink">Mening saytim</a>';
click(demoBtn);
ok(demoFrame.getAttribute('srcdoc').indexOf('demoLink') !== -1, 'RUN bosilganda srcdoc HAQIQIY yangilandi');

/* MASHQLAR */
ok(wrap.textContent.includes('0 / 3 bajarildi'), 'Tracker: 0 / 3 bajarildi');
ok(wrap.textContent.includes('Test hali ochilmagan'), 'Tracker: test yopiq holati');
ok(wrap.querySelectorAll('.ls-ex-card').length === 4, '4 ta mashq kartasi (3 majburiy + 1 bonus)');
ok(wrap.querySelectorAll('[data-ex-run]').length === 4, 'Har mashqda Javobni tekshirish tugmasi bor');
ok(wrap.querySelectorAll('[data-ex-reset]').length === 4 && wrap.querySelectorAll('[data-ex-playground]').length === 0, 'Har mashqda "Kodni qayta qoyish" bor, Codingda tugmasi YOQ');
ok(wrap.querySelectorAll('.ls-ex-preview-wrap').length === 1, 'Faqat livedemo da 1 ta preview bor');
ok(wrap.textContent.includes('BONUS'), 'Bonus JS challenge bor');

const answers = {
  l4ex1: '<a href="https://google.com">Saytga kirish</a>',
  l4ex2: '<a href="https://example.com" target="_blank">Yangi tabda ochish</a>',
  l4ex3: '<a href="#contact">Kontaktga o\'tish</a>\n\n<section id="contact">\n    <h2>Kontakt</h2>\n</section>',
  l4js: '<a href="#" id="testLink">Bos</a>\n\n<script>\nconst link = document.getElementById("testLink");\nlink.addEventListener("click", function(event) { event.preventDefault(); alert("Salom!") });\n</script>'
};

function setEx(exId, code) {
  const ta = doc.getElementById('lsExCode-' + exId);
  ta.value = code;
  fire(ta, 'input');
}
function checkEx(exId) { click(wrap.querySelector('[data-ex-run="' + exId + '"]')); }
function card(exId) { return wrap.querySelector('[data-ex-id="' + exId + '"]'); }

/* 1-mashq: noto'g'ri -> to'g'ri */
checkEx('l4ex1');
ok(card('l4ex1').textContent.includes('❌'), '1-mashq: boshlangich kodda ❌ (fake success YOQ)');
setEx('l4ex1', answers.l4ex1); checkEx('l4ex1');
ok(card('l4ex1').textContent.includes('To‘g‘ri! +10 XP'), '1-mashq: ✅ To\'g\'ri! +10 XP');
ok(card('l4ex1').textContent.includes('explanation') || card('l4ex1').textContent.includes('href'), '1-mashq: tushuntirish chiqdi');
ok(wrap.textContent.includes('1 / 3 bajarildi'), 'Tracker: 1 / 3 bajarildi');

/* 2-mashq */
setEx('l4ex2', answers.l4ex2); checkEx('l4ex2');
ok(card('l4ex2').textContent.includes('To‘g‘ri! +10 XP'), '2-mashq: ✅ To\'g\'ri! +10 XP');
ok(wrap.textContent.includes('2 / 3 bajarildi'), 'Tracker: 2 / 3 bajarildi');

/* Bonus: majburiy emas — 3/3 bo'lmasdan turib bonus bajarilsa ham test YOPIQ */
setEx('l4js', answers.l4js); checkEx('l4js');
ok(card('l4js').textContent.includes('To‘g‘ri! +10 XP'), 'Bonus mashq bajarildi');
ok(wrap.textContent.includes('Test hali ochilmagan'), 'Bonus bajarilsa ham test HANOZ yopiq (bonus majburiy emas)');

/* 3-mashq -> test ochiladi */
setEx('l4ex3', answers.l4ex3); checkEx('l4ex3');
ok(card('l4ex3').textContent.includes('To‘g‘ri! +10 XP'), '3-mashq: ✅ To\'g\'ri! +10 XP');
ok(wrap.textContent.includes('3 / 3 bajarildi'), 'Tracker: 3 / 3 bajarildi');
ok(wrap.textContent.includes('Barcha mashqlar bajarildi!') && wrap.textContent.includes('Test ochildi'), 'Tracker: barchasi bajarildi + test ochildi');
ok(wrap.querySelector('#lsStartQuizBtn') !== null, 'Test tugmasi chiqdi');

/* RESET: kodni qayta qoyish (read bosqichida, testdan oldin) */
setEx('l4ex3', '<p> buzilgan kod </p>');
click(wrap.querySelector('[data-ex-reset="l4ex3"]'));
const ex3ta = doc.getElementById('lsExCode-l4ex3');
ok(ex3ta && ex3ta.value.indexOf('href="#"') !== -1, '🔄 Reset: boshlangich kod qayta qoyildi');

/* TEST */
click(wrap.querySelector('#lsStartQuizBtn'));
ok(wrap.textContent.length > 100 && doc.querySelector('#lsLessonContainer') !== null, 'Test bosqichi ochildi');

console.log('\nconsole errors: ' + errors.length);
errors.slice(0, 5).forEach(e => console.log('ERR: ' + e));
console.log((failed === 0 && errors.length === 0) ? '\nLESSON4 PASSED' : '\nLESSON4 FAILED');
process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
