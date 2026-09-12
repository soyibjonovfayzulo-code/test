/* CSS-lessons-data sinov skripti */
const fs = require('fs');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { runScripts: 'outside-only' });
const w = dom.window;
w.eval(fs.readFileSync(__dirname + '/css-lessons-data.js', 'utf8'));

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}

const data = w.CSS_LESSONS_DATA;
ok(!!data, 'CSS_LESSONS_DATA mavjud');
ok(Array.isArray(data), 'massiv');
ok(data.length === 30, '30 ta dars (' + data.length + ')');

data.forEach(function (l, i) {
  const n = i + 1;
  const label = n + '. ' + l.title;
  const problems = [];
  if (!l.title) problems.push('title yo‘q');
  if (!l.content) problems.push('content yo‘q');
  if (l.content) {
    const c = l.content;
    if (!c.intro) problems.push('intro yo‘q');
    if (!Array.isArray(c.review) || c.review.length < 3) problems.push('review < 3');
    if (!Array.isArray(c.sections) || c.sections.length < 3) problems.push('sections < 3 (' + (c.sections || []).length + ')');
    if (!Array.isArray(c.keyPoints) || c.keyPoints.length < 3) problems.push('keyPoints < 3');
    if (!c.motivation) problems.push('motivation yo‘q');
    if (!c.motivationTitle) problems.push('motivationTitle yo‘q');
    (c.sections || []).forEach(function (s, si) {
      if (!s.title) problems.push('sec' + (si + 1) + ': title yo‘q');
      if (!s.text) problems.push('sec' + (si + 1) + ': text yo‘q');
      if (!s.note && !s.playground && !s.code) problems.push('sec' + (si + 1) + ': note/code yo‘q');
    });
    if (n < 30) {
      const codeCount = (c.sections || []).filter(function (s) { return !!s.code; }).length;
      if (codeCount < 2) problems.push('kod namunasi < 2 (' + codeCount + ')');
      if (!Array.isArray(c.exercises) || c.exercises.length < 3) problems.push('exercises < 3');
      (c.exercises || []).forEach(function (ex) {
        if (!ex.id || !ex.type) problems.push('exercise: id/type yo‘q');
        if (ex.type === 'liveedit') {
          if (!ex.startCode) problems.push(ex.id + ': startCode yo‘q');
          (ex.checks || []).forEach(function (ch) {
            try { new RegExp(ch.re, 'i'); } catch (e) { problems.push(ex.id + ': regex XATO ' + ch.re); }
            if (ex.startCode && new RegExp(ch.re, 'i').test(ex.startCode)) problems.push(ex.id + ': regex startCode bilan bajarilyapti! ' + ch.re);
          });
        }
      });
      if (!l.quiz || !Array.isArray(l.quiz.questions) || l.quiz.questions.length !== 5) problems.push('quiz != 5 savol');
      (l.quiz && l.quiz.questions || []).forEach(function (q, qi) {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 3) problems.push('q' + (qi + 1) + ': savol/options muammo');
        if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options || []).length) problems.push('q' + (qi + 1) + ': answer noto‘g‘ri');
        if (!q.explanation) problems.push('q' + (qi + 1) + ': explanation yo‘q');
      });
    }
  }
  if (problems.length) ok(false, label, problems.join(' | '));
  else ok(true, label);
});

console.log('\nNatija: ' + passed + ' ✅ / ' + failed + ' ❌');
process.exit(failed ? 1 : 0);
