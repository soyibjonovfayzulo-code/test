/* Smoke check: faqat Darslar bosh sahifasi redesign (UI/UX) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const w = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
global.window = w.window;
global.document = w.window.document;
const win = w.window;

let fails = 0;
function ok(cond, msg) { console.log((cond ? '\u2705' : '\u274C') + ' ' + msg); if (!cond) fails++; }

/* Minimal script.js bo'lmagan muhit uchun stub'lar */
win.matchMedia = win.matchMedia || function () { return { matches: false, addListener: function () {}, removeListener: function () {} }; };
if (!win.requestAnimationFrame) win.requestAnimationFrame = function (fn) { return setTimeout(fn, 16); };
const pages = [];
win.__itShowPage = function (name) { pages.push(name); };
win.__itGetCurrentUser = function () { return null; };

/* index.html'dagi #page-lessons markupini qurish */
const htmlSrc = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = htmlSrc.match(/<section id="page-lessons"[\s\S]*?<\/section>/);
document.body.innerHTML = m[0];

/* lessons-data.js + lessons-app.js yuklash (test uslubida) */
let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
appSrc = 'var requestAnimationFrame = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };\nvar localStorage = window.localStorage;\n' + appSrc;
win.eval(dataSrc);
win.eval(appSrc);

const API = win.CoursesAPI;
ok(!!API, 'CoursesAPI mavjud');
const courses = API.listCourses();
let totalLessons = 0; courses.forEach(c => totalLessons += c.lessonCount);

function render() { win.Lessons.handlePage('lessons'); }
function click(el) { el.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); }

console.log('\n[1] UMUMIY PROGRESS — real data (0 dars)');
render();
const overall = document.querySelector('#lsOverallSlot .ls-overall');
ok(!!overall, 'Umumiy progress kartasi chiqdi');
ok(overall.querySelector('.ls-overall-pct').textContent.indexOf('0') === 0, 'Progress 0% (yangi user, real localStorage)');
ok(overall.textContent.includes(String(totalLessons)), 'Jami darslar soni real: ' + totalLessons);
ok(!!overall.querySelector('.ls-ring-fill'), 'Progress ring bor');
ok(overall.textContent.includes('Umumiy progress'), '"Umumiy progress" sarlavhasi');

console.log('\n[2] MAVZULAR — kartalar tartibli + statuslar');
const cards = document.querySelectorAll('#lsCoursesGrid .ls-course-card');
ok(cards.length === courses.length, courses.length + ' ta karta chiqdi');
ok(cards[0].textContent.includes(courses[0].name), '1-karta = ' + courses[0].name + ' (tartib saqlangan)');
ok(cards[cards.length - 1].textContent.includes(courses[courses.length - 1].name), 'Oxirgi karta = ' + courses[courses.length - 1].name);
ok(/Boshlash/.test(cards[0].textContent), 'Yangi userda: ▶ Boshlash statusi');

console.log('\n[3] DAVOM ETTIRISH — joriy darsni ochadi');
/* HTML kursda 1-darsni tugallangan qilib qo'yish -> resume = 2-dars */
const u = API.getCourse('html');
const d1 = u.lessons[0], d2 = u.lessons[1];
const key = 'darslar_state_v1::guest';
const st = { levels: { html: 'intermediate' }, progress: { html: { completed: {}, lastLessonId: d2.id, lastVisit: Date.now() } } };
st.progress.html.completed[d1.id] = { at: Date.now() };
win.localStorage.setItem(key, JSON.stringify(st));
render();
const banner = document.querySelector('#lsContinueSlot .ls-continue');
ok(!!banner, 'Davom ettirish banneri chiqdi');
ok(banner.textContent.includes(d2.title), 'Banner aynan joriy darsni ko\'rsatadi: ' + d2.title);
ok(banner.textContent.includes(d2.number + '-dars'), 'Dars raqami: ' + d2.number + '-dars');
const pctNow = Math.round((1 / u.lessonCount) * 100);
ok(banner.textContent.includes(pctNow + '%'), 'Banner progressi real: ' + pctNow + '%');
click(document.querySelector('#lsContinueBtn'));
ok(pages.indexOf('lessonView') !== -1, 'CTA bosilganda lessonView ochildi (openLesson)');

console.log('\n[4] KARTA STATUSLARI — progressdan keladi');
render();
const cards2 = document.querySelectorAll('#lsCoursesGrid .ls-course-card');
const htmlCard = Array.from(cards2).find(c => c.getAttribute('data-course') === 'html');
ok(/Davom etmoqda/.test(htmlCard.textContent), 'HTML: ▶ Davom etmoqda (' + pctNow + '%)');
ok(/Davom ettirish/.test(htmlCard.textContent), 'HTML: Davom ettirish tugmasi');
ok(!/Tugallangan/.test(htmlCard.textContent) || pctNow === 100, 'HTML hali tugallanmagan');

console.log('\n[5] KURS OCHILISHI buzilmagan');
pages.length = 0;
click(cards2[0]);
ok(pages.indexOf('lessonCourse') !== -1, 'Karta bosilganda kurs sahifasi ochildi');

console.log('\n' + (fails === 0 ? '✅ BARCHA SMOKE TESTLAR OTDI' : '❌ ' + fails + ' xato'));
process.exit(fails === 0 ? 0 : 1);
