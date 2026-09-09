/* 3-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
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
window.__itGetCurrentUser = function () { return { username: 'student1', email: 's@mail.com' }; };
window.showToast = function () {};
window.confirm = function () { return true; };

let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
window.eval(dataSrc);
window.eval(appSrc);
// Coding Playground stub — script.js yuklanmaydi, lekin integratsiya kontrakti tekshiriladi
window.openCodePlaygroundWithHtml = function (rawHtml, returnCtx) { window.__pgRaw = rawHtml; window.__pgCtx = returnCtx; };

let passed = 0, failed = 0;
function ok(cond, label) { if (cond) { passed++; console.log('  PASS ' + label); } else { failed++; console.log('  FAIL ' + label); } }
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
function fire(el, type) { el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true })); }
function setVal(el, v) { el.value = v; fire(el, 'input'); }

const API = window.CoursesAPI;
const l3 = API.findLesson('html', 'html-d3');
console.log('3-dars:', l3 && l3.lesson.title);

// Darsni ochish (progress toza — yangi user)
window.Lessons.openCourse('html');
window.Lessons.openLesson('html', 'html-d3');

const wrap = doc.querySelector('#lsLessonContainer');
ok(wrap.textContent.includes('Atribut nima?'), 'Section 1: atribut tushuntirilgan');
ok(wrap.textContent.includes('name="value" — nom va qiymat'), 'Section 2: name="value" tushuntirilgan');
ok(wrap.textContent.includes('src — rasm qayerdan olinadi'), 'Section 3: src');
ok(wrap.textContent.includes('alt — rasm haqida qisqa matn'), 'Section 4: alt');
ok(wrap.textContent.includes('class — elementga guruh nomi'), 'Section 5: class');
ok(wrap.textContent.includes('id — elementga o‘ziga xos nom'), 'Section 6: id');
ok(wrap.textContent.includes('title — hover qilsangiz'), 'Section 7: title (tooltip)');
ok(wrap.textContent.includes('Bir nechta atribut bitta elementda'), 'Section 8: bir nechta atribut');
ok(wrap.textContent.includes('🎨 CSS nima qiladi?') && wrap.textContent.includes('color:red'), 'CSS teaser bor (style=color:red)');
ok(wrap.textContent.includes('⚡ JavaScript nima qiladi?') && wrap.textContent.includes('onclick'), 'JS teaser bor (onclick/alert)');
ok(wrap.textContent.includes('Oldingi darslardan nimalarni bilamiz?') && wrap.textContent.includes('<body>'), 'Recap kartalar bor (HTML/tag/element/body...)');
ok(wrap.textContent.includes('KEYINGI DARS: 4-DARS') && wrap.textContent.includes('Linklar va rasmlar'), '4-dars teaser banner bor');
ok(wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length >= 6, '"CODINGDA SINAB KO\'R" tugmalari bor (' + wrap.querySelectorAll('.ls-open-playground[data-ls-raw-code]').length + ')');
ok(wrap.querySelector('.ls-alert-demo[data-alert-msg]') !== null, 'JS alert demo tugmasi bor');
ok(wrap.querySelector('.ls-img-preview-frame') !== null, 'Real image preview iframe bor');
ok(wrap.querySelector('.ls-img-preview').getAttribute('data-img-url').indexOf('https://upload.wikimedia.org/') === 0, 'Real image URL = Wikimedia HTTPS');
ok(wrap.textContent.includes('📷 Bu rasm HTML'), 'Rasm izohi bor');
ok(wrap.querySelector('#lsAttrDemo') !== null && wrap.textContent.includes('Attribute Magic'), '✨ Attribute Magic demo bor');
ok(doc.querySelectorAll('#lsAttrControls input[type="checkbox"][data-attr]').length === 5, 'Attribute Magic: 5 ta toggle (src/alt/class/id/title)');

// === ATTRIBUTE MAGIC: toggle o'chirilsa preview va kod o'zgaradi ===
const cbAlt = doc.querySelector('#lsAttrControls input[data-attr="alt"]');
cbAlt.checked = false;
fire(cbAlt, 'change');
const attrCode1 = doc.querySelector('#lsAttrCode').textContent;
ok(attrCode1.indexOf('alt=') === -1 && attrCode1.indexOf('src=') !== -1, 'ALT OFF → kodda alt yo‘q, src bor');
ok(doc.querySelector('[data-state="alt"]').textContent.indexOf('OFF') !== -1, 'ALT OFF → holat ko‘rsatiladi (OFF ❌)');
cbAlt.checked = true;
fire(cbAlt, 'change');
ok(doc.querySelector('#lsAttrCode').textContent.indexOf('alt=') !== -1, 'ALT ON → kod real yangilandi');

// Exercise tracker holati
ok(/Mashq 1\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Tracker: Mashq 1 ⬜');
ok(!/Mashq 4/.test(doc.querySelector('#lsExTracker').textContent), 'Faqat 3 ta mashq bor');

// === TEST LOCK: mashqlar bajarilmaguncha ===
ok(doc.querySelector('#lsStartQuizBtn') === null, 'Test tugmasi YO\'Q (lock faol)');
ok(doc.querySelector('#lsExLockedHint') !== null, '"Avval barcha mashqlarni bajaring" ko\'rinadi');
window.Lessons.openLesson('html', 'html-d3');
ok(doc.querySelector('#lsStartQuizBtn') === null, 'Qayta ochganda ham test YOPIQ (bypass imkonsiz)');

// === MASHQ 1: img ga alt qo'shish ===
const ta1 = doc.querySelector('#lsExCode-l3ex1');
setVal(ta1, '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg" width="320" alt="Kompyuter rasmi">');
click(doc.querySelector('[data-ex-run="l3ex1"]'));
ok(/Mashq 1\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 1 ✅ (alt qo\'shildi)');

// === MASHQ 2: button ga id ===
setVal(doc.querySelector('#lsExCode-l3ex2'), '<button id="startBtn">Boshlash</button>');
click(doc.querySelector('[data-ex-run="l3ex2"]'));
ok(/Mashq 2\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 2 ✅ (id=startBtn)');

// === MASHQ 3: div ga class (avval xato — keyin to'g'ri) ===
setVal(doc.querySelector('#lsExCode-l3ex3'), '<div>Salom</div>');
click(doc.querySelector('[data-ex-run="l3ex3"]'));
ok(/Mashq 3\s*⬜/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 hali ⬜ (class yo\'q — fake success YO\'Q)');
setVal(doc.querySelector('#lsExCode-l3ex3'), '<div class="card">\n  Salom 👋\n</div>');
click(doc.querySelector('[data-ex-run="l3ex3"]'));
ok(/Mashq 3\s*✅/.test(doc.querySelector('#lsExTracker').textContent), 'Mashq 3 ✅ (class=card)');

// === JS ALERT DEMO ===
const alertDemoBtn = wrap.querySelector('.ls-alert-demo[data-alert-msg]');
let alertFired = null;
window.alert = function (m) { alertFired = m; };
click(alertDemoBtn);
ok(alertFired === alertDemoBtn.getAttribute('data-alert-msg'), 'JS teaser: alert haqiqiy chaqirildi (' + alertFired + ')');

// === LOCK OCHILDI ===
const foot = doc.querySelector('#lsReadFooter');
console.log('FOOTER:', foot ? foot.textContent.slice(0, 140) : 'NULL');
ok(doc.querySelector('#lsStartQuizBtn') !== null, 'Barcha mashqlar bajarildi — test tugmasi chiqdi');

// === CODINGGA O'TISH + RETURN CONTEXT ===
click(doc.querySelector('.ls-open-playground[data-ls-raw-code]'));
const ctxRaw = window.localStorage.getItem('ls_return_ctx');
ok(!!ctxRaw && JSON.parse(ctxRaw).lessonId === 'html-d3', 'Lesson return context saqlandi (lessonId=html-d3)');
ok(typeof window.__pgRaw === 'string' && window.__pgRaw.indexOf('<style') === -1 && window.__pgRaw.indexOf('<img') !== -1, 'Playgroundga RAW HTML yuborildi (highlight emas)');
ok(typeof window.Lessons.returnFromCoding === 'function', 'Lessons.returnFromCoding API mavjud');

// === TEST: savollar javoblanadi (real user kabi) ===
window.Lessons.returnFromCoding(); // qaytish
click(doc.querySelector('#lsStartQuizBtn'));
const quizWrap = doc.querySelector('#lsLessonContainer');
ok(quizWrap.textContent.includes('1-savol') || quizWrap.querySelectorAll('.ls-quiz-option').length === 4, 'Test bosqichi ochildi');
let guard = 0;
while (guard++ < 15) {
  const opts = quizWrap.querySelectorAll('.ls-quiz-option');
  if (!opts.length) break;
  click(opts[0]);
  const cont = quizWrap.querySelector('#lsQuizNextBtn');
  if (cont) click(cont); else break;
}
const resultText = quizWrap.textContent;
const pctMatch = resultText.match(/(\d+)%/);
ok(!!pctMatch, 'Test natijasi ekrani chiqdi (' + (pctMatch ? pctMatch[1] + '%' : '?') + ')');
// 4 ta savol testi (QUIZ_QUESTIONS_PER_TEST=5): 0 to'g'ri -> fail holat
ok(resultText.includes('yetarli') || resultText.includes('o‘tdingiz') || resultText.includes('o\'tdingiz'), 'Natija holati ko\'rsatildi');

// XP bir marta berilishi: mastered XP faqat birinchi o'tishda
console.log('\nconsole errors: ' + errors.length);
errors.slice(0, 5).forEach(e => console.log('ERR: ' + e));
console.log((failed === 0 && errors.length === 0) ? '\nLESSON3 PART1 PASSED' : '\nLESSON3 PART1 FAILED');
process.exit(failed === 0 && errors.length === 0 ? 0 : 1);

