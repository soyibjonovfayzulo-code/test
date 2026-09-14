/* LESSON MINI-QUIZ AUDIT — faqat dars ichidagi reviewQuiz/mini-testlar */
global.window = {};
const fs = require('fs');
let src = fs.readFileSync(__dirname + '/lessons-data.js', 'utf8');
src = src.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
eval(src);
const API = window.CoursesAPI;
const courses = API.listCourses();
let total = 0, withRQ = 0, without = 0, issues = 0;
courses.forEach(course => {
  (course.lessons || []).forEach(l => {
    total++;
    const rq = l.content && l.content.reviewQuiz;
    if (!rq) { without++; return; }
    withRQ++;
    const qs = rq.questions || [];
    console.log('\n=== ' + l.number + '-dars [' + course.id + '] reviewQuiz: "' + (rq.title || '') + '" — ' + qs.length + ' savol, xp=' + rq.xp);
    // duplicate savol matnlari
    const seen = new Map();
    qs.forEach((q, i) => {
      const key = String(q.q || '').trim();
      if (seen.has(key)) { console.log('  ⚠ DUPLICATE: savol ' + (seen.get(key) + 1) + ' va ' + (i + 1) + ' bir xil: ' + key.slice(0, 60)); issues++; }
      seen.set(key, i);
      // options va answer tekshiruvi
      if (!Array.isArray(q.o) || q.o.length < 2) { console.log('  ⚠ Savol ' + (i + 1) + ': options yetarli emas (' + (q.o ? q.o.length : 'undefined') + ')'); issues++; }
      if (typeof q.a !== 'number' || !Array.isArray(q.o) || q.a < 0 || q.a >= q.o.length) { console.log('  ⚠ Savol ' + (i + 1) + ': correct answer indeksi noto\'g\'ri (a=' + q.a + ')'); issues++; }
      if (Array.isArray(q.o) && q.o.length >= 2 && new Set(q.o.map(String)).size !== q.o.length) { console.log('  ⚠ Savol ' + (i + 1) + ': duplicate optionlar'); issues++; }
    });
    // title/subtitle ichida son va'dasi bor-yo'qligi
    const claimed = (String(rq.subtitle || '') + ' ' + String(rq.title || '')).match(/(\d+)\s*(ta\s*)?(savol|savollar)/i);
    if (claimed && Number(claimed[1]) !== qs.length) { console.log('  ⚠ TITLE VA\'DASI: "' + claimed[0] + '" lekin real: ' + qs.length + ' savol'); issues++; }
    if (!issues) console.log('  ✅ OK — ' + qs.length + ' unique savol, options/answer toza');
  });
});
console.log('\n================ AUDIT YAKUNI ================');
console.log('Total lessons scanned: ' + total);
console.log('Lessons with mini-test (reviewQuiz): ' + withRQ);
console.log('Lessons without mini-test: ' + without);
console.log('Issues found: ' + issues);