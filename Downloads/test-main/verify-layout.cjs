/* ==========================================================
   LAYOUT REGRESSION TEST — Darslar sahifasi chegaralari
   Run: node verify-layout.cjs
   1) CSS audit (postcss parse) — ROOT CAUSE fix'lar joyida
   2) HTML audit — viewport/charset meta
   3) jsdom render — dars sahifasi strukturasi + console error = 0
   ========================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const { JSDOM } = require('jsdom');

const root = __dirname;
let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  \u2705 ' + label); }
  else { failed++; console.log('  \u274C ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(n) { console.log('\n[' + n + ']'); }

/* ---------- 1. CSS AUDIT ---------- */
section('1. CSS AUDIT (lessons.css)');
const lessonsCss = fs.readFileSync(path.join(root, 'lessons.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const lessonsAst = postcss.parse(lessonsCss);

function findRules(matcher) {
  const out = [];
  lessonsAst.walkRules(function (rule) {
    if (matcher(rule.selector)) out.push(rule);
  });
  return out;
}
function declOf(rule, prop) {
  let v = null;
  rule.walkDecls(prop, function (d) { v = d.value; });
  return v;
}
function lastRule(rules) { return rules[rules.length - 1]; } // cascade g'alibi
/** Selector bo'yicha BARCHA qoidalarda bu property'ning oxirgi (g'alaba qozongan) qiymati */
function declAnywhere(selector, prop) {
  let v = null;
  lessonsAst.walkRules(function (rule) {
    if (rule.selector.split(',').map(s => s.trim()).indexOf(selector) !== -1) {
      rule.walkDecls(prop, function (d) { v = d.value; });
    }
  });
  return v;
}

// 1a. Hero gradient — "transparent 65%" (qora zona) yo'q bo'lishi SHART
const heroBg = declAnywhere('.ls-viewer-hero', 'background');
ok(heroBg !== null, '.ls-viewer-hero mavjud');
ok(heroBg && heroBg.indexOf('transparent 65%') === -1, 'Hero gradientida shaffof "qora zona" YO\'Q (root cause fix)');
ok(heroBg && heroBg.indexOf('100%)') !== -1, 'Gradient 100% gacha to\'liq qoplanadi');

// 1b. Clipping — dekor ::before/::after parentdan chiqmaydi
ok(declAnywhere('.ls-lesson-card', 'overflow') === 'hidden', '.ls-lesson-card overflow:hidden (state-ico dekor clip)');
ok(declAnywhere('.ls-course-head', 'overflow') === 'hidden', '.ls-course-head overflow:hidden (radius clip)');
ok(declAnywhere('.ls-course-card', 'overflow') === 'hidden', '.ls-course-card overflow:hidden (::before clip)');
ok(declAnywhere('.ls-continue', 'overflow') === 'hidden', '.ls-continue overflow:hidden (::after glow clip)');

// 1c. Width/overflow guards
const viewerRules = findRules(s => s.trim() === '.ls-viewer-wrap');
const vw = declOf(lastRule(viewerRules), 'max-width');
ok(vw && vw.indexOf('100%') !== -1, '.ls-viewer-wrap max-width viewportdan oshmaydi (' + vw + ')');
const pageRules = findRules(s => s.indexOf('#page-lessonView') !== -1 && s.indexOf('#page-lessons') !== -1);
ok(pageRules.length > 0, '#page-lesson* width guard mavjud');
const containerRules = findRules(s => s.indexOf('#lsLessonContainer') !== -1 && s.indexOf('#lsCourseContainer') !== -1);
ok(containerRules.length > 0, '#lsLessonContainer/#lsCourseContainer width guard mavjud');
const gridChild = findRules(s => s.indexOf('.ls-lessons-grid > *') !== -1);
ok(gridChild.length > 0, 'Grid child min-width:0 guard mavjud');

// 1d. 100vw ishlatilmagan (horizontal scroll sababi bo'lmasin)
ok(!/100vw/.test(lessonsCss), "lessons.css da 100vw YO'Q");

// 1e. Safe-area
ok(/env\(safe-area-inset-top/.test(lessonsCss), 'safe-area-inset-top ishlatilgan');
ok(/env\(safe-area-inset-bottom/.test(lessonsCss), 'safe-area-inset-bottom ishlatilgan');
ok(/min-height:\s*100svh/.test(lessonsCss), "100svh (dinamik viewport) qo'llanilgan");

// 1f. Mobile media query mavjudligi
ok(/@media\s*\(max-width:\s*480px\)/.test(lessonsCss), 'Mobil (\u2264480px) media query mavjud');
ok(/@media\s*\(max-width:\s*640px\)/.test(lessonsCss), 'Mobil (\u2264640px) media query mavjud');
ok(/@media\s*\(max-width:\s*1024px\)/.test(lessonsCss), 'Desktop (\u22641024px) media query mavjud');

// 1g. Global zaxira
ok(/overflow-x:\s*hidden/.test(styleCss), 'style.css: html/body overflow-x hidden (global zaxira)');
ok(/min-width:\s*0/.test(styleCss), 'style.css: .main min-width:0');

section('2. HTML AUDIT (index.html)');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
ok(htmlSrc.indexOf('viewport-fit=cover') !== -1, 'viewport meta: viewport-fit=cover (safe-area uchun)');
ok(/<meta\s+charset=["']?UTF-8/i.test(htmlSrc), 'meta charset UTF-8');

/* ---------- 3. JSOM RENDER AUDIT ---------- */
section('3. RENDER AUDIT (jsdom — 1-dars)');
const dataSrc = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8');
const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window;
const doc = w.document;

let consoleErrors = 0;
w.addEventListener('error', function () { consoleErrors++; });
w.__itShowPage = function () {};
w.__itGetCurrentUser = function () { return { username: 'layoutuser', email: 'l@mail.com' }; };
w.showToast = function () {};
w.confirm = function () { return true; };
w.eval(dataSrc);
w.eval(appSrc);

function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }

setTimeout(function () {
  w.Lessons.handlePage('lessons');
  click(doc.querySelectorAll('#lsCoursesGrid .ls-course-card')[0]);
  click(doc.querySelectorAll('#lessonLevelBody .ls-level-option')[0]);
  w.Lessons.openLesson('html', 'html-d1');

  const viewer = doc.querySelector('#lsLessonContainer');
  const wrap = doc.querySelector('#lsLessonContainer .ls-viewer-wrap');
  ok(viewer !== null && wrap !== null, "Dars view render bo'ldi");
  ok(viewer.querySelectorAll('.ls-content-section').length >= 5, "Kontent bo'limlari joyida (" + viewer.querySelectorAll('.ls-content-section').length + ')');
  ok(viewer.querySelector('.ls-viewer-hero') !== null, 'Hero card bor');
  ok(viewer.querySelector('#lsBackToCourse') !== null, 'Back button bor');
  ok(doc.querySelector('#pageTitle').textContent.indexOf('1-dars') !== -1, 'Header sarlavhasi: "' + doc.querySelector('#pageTitle').textContent + '"');

  // Inline style audit: hech qanday element katta fixed px width bilan overflow qilmasin
  let inlineWidthIssues = 0;
  viewer.querySelectorAll('*').forEach(function (el) {
    const st = el.getAttribute('style') || '';
    if (/width:\s*\d{3,}px/.test(st)) inlineWidthIssues++;
  });
  ok(inlineWidthIssues === 0, "Inline fixed-width overflow YO'Q");

  const codeBlocks = viewer.querySelectorAll('.ls-content-code');
  ok(codeBlocks.length >= 3, 'Kod bloklari kartalar ichida (' + codeBlocks.length + ')');

  // Quiz oqimi buzilmagan
  click(doc.querySelector('#lsMarkReadBtn'));
  click(doc.querySelector('#lsStartQuizBtn'));
  ok(doc.querySelector('.ls-quiz-question') !== null, 'Quiz ishlaydi');
  ok(doc.querySelectorAll('.ls-quiz-option').length === 4, 'Quiz variantlari joyida');

  // Kurs sahifasi ham render
  click(doc.querySelector('#lsQuizBackBtn'));
  click(doc.querySelector('#lsBackToCourse'));
  ok(doc.querySelectorAll('#lsCourseContainer .ls-lesson-card').length >= 31, 'Kurs sahifasi: 31+ dars kartasi');

  ok(consoleErrors === 0, 'Console error = 0 (' + consoleErrors + ')');

  console.log('\n==========================================');
  console.log('  NATIJA: ' + passed + ' otdi, ' + failed + ' xato');
  console.log('==========================================');
  process.exit(failed ? 1 : 0);
}, 250);

