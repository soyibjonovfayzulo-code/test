const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf-8');

const courses = [];
let pos = 0;

// Find each course by finding id: 'xxx' at top level
const courseHeaderRegex = /id:\s*['"](\w+)['"],\s*\n\s*name:\s*['"]([^'"]+)['"],/g;
let match;
while ((match = courseHeaderRegex.exec(file)) !== null) {
  courses.push({ id: match[1], name: match[2], start: match.index, topics: [] });
}

// Now for each course, extract topics between start of this course and start of next course (or end)
for (let i = 0; i < courses.length; i++) {
  const startIdx = courses[i].start;
  const endIdx = (i < courses.length - 1) ? courses[i+1].start : file.length;
  const slice = file.substring(startIdx, endIdx);
  
  // Find topics array start
  const topicsStart = slice.indexOf('topics:');
  if (topicsStart < 0) continue;
  
  // Count the number of topic objects by finding title inside topics
  // Find the topics array boundaries
  let topicsArrayStart = topicsStart;
  let bracketCount = 0;
  let started = false;
  let topicsArrayEnd = topicsArrayStart;
  for (let j = topicsArrayStart; j < slice.length; j++) {
    const ch = slice[j];
    if (ch === '[') { bracketCount++; started = true; }
    else if (ch === ']') { bracketCount--; if (started && bracketCount === 0) { topicsArrayEnd = j; break; } }
  }
  const topicsSlice = slice.substring(topicsArrayStart, topicsArrayEnd + 1);
  
  // Find each topic title
  const titleRegex = /(?:^|\n)\s*title:\s*['"]([^'"]+)['"]/g;
  let tm;
  while ((tm = titleRegex.exec(topicsSlice)) !== null) {
    courses[i].topics.push({ title: tm[1], hasContent: false, hasQuiz: false, sections: 0, exercises: 0, quizQs: 0 });
  }
  
  // Check content and quiz by looking backwards from each title
  const topicObjs = [];
  let depth = 0;
  for (let j = 0; j < topicsSlice.length; j++) {
    if (topicsSlice[j] === '{') depth++;
    else if (topicsSlice[j] === '}') depth--;
  }
  
  // Simpler: find "content:" occurrences within topics slice
  let tIdx = 0;
  const contentRegex = /content:\s*\{/g;
  const quizRegex = /quiz:\s*\{/g;
  const sectionsRegex = /title:\s*['"]([^'"]+)['"]\s*,\s*\n\s*text:\s*/g;
  const exerciseRegex = /id:\s*['"](ex|l\d+ex)[^'"]*['"]/gi;
  const questionRegex = /question:\s*['"`]([^'"`])/g;
  
  let cm, qm, sm, em, qqm;
  const contents = [], quizzes = [], sections = [], exercises = [], qquestions = [];
  while ((cm = contentRegex.exec(topicsSlice)) !== null) contents.push(cm.index);
  while ((qm = quizRegex.exec(topicsSlice)) !== null) quizzes.push(qm.index);
  while ((sm = sectionsRegex.exec(topicsSlice)) !== null) sections.push(sm.index);
  while ((em = exerciseRegex.exec(topicsSlice)) !== null) exercises.push(em.index);
  while ((qqm = questionRegex.exec(topicsSlice)) !== null) qquestions.push(qqm.index);
  
  // Map to each topic by finding nearest title before each content/quiz
  // First find all title positions
  const titlePositions = [];
  const tm2 = /(?:^|\n)\s*title:\s*['"]([^'"]+)['"]/g;
  let tm2m;
  while ((tm2m = tm2.exec(topicsSlice)) !== null) titlePositions.push({ title: tm2m[1], pos: tm2m.index });
  
  // For each content find which topic it belongs to
  for (let ti = 0; ti < courses[i].topics.length; ti++) {
    const cur = titlePositions[ti] ? titlePositions[ti].pos : 0;
    const nxt = titlePositions[ti+1] ? titlePositions[ti+1].pos : topicsSlice.length;
    
    courses[i].topics[ti].hasContent = contents.some(c => c >= cur && c < nxt);
    courses[i].topics[ti].hasQuiz = quizzes.some(q => q >= cur && q < nxt);
    courses[i].topics[ti].sections = sections.filter(s => s >= cur && s < nxt).length;
    courses[i].topics[ti].exercises = exercises.filter(e => e >= cur && e < nxt).length;
    courses[i].topics[ti].quizQs = qquestions.filter(q => q >= cur && q < nxt).length;
  }
}

console.log('='.repeat(90));
console.log('LOYIHA AUDITI - BARCHA KURS VA DARSLAR');
console.log('='.repeat(90));
console.log('OK = to\'liq, WARN = muammoli\n');

let totalLessons = 0;
let totalOK = 0;
let totalWarn = 0;
let problemList = [];

courses.forEach((c, ci) => {
  console.log(`\n[KURS ${ci+1}] ${c.name} (id: ${c.id}) — ${c.topics.length} dars`);
  console.log('   '.padEnd(70, '-'));
  console.log('  #  Dars nomi'.padEnd(55) + 'Content  Quiz  Sec  Ex  Qs   Holat');
  console.log('   '.padEnd(70, '-'));
  
  c.topics.forEach((t, ti) => {
    totalLessons++;
    const ok = t.hasContent && t.hasQuiz && t.sections >= 3 && t.exercises >= 1 && t.quizQs >= 5;
    if (ok) totalOK++; else { totalWarn++; problemList.push({ course: c.name, courseId: c.id, idx: ti, title: t.title, hasContent: t.hasContent, hasQuiz: t.hasQuiz, sections: t.sections, exercises: t.exercises, quizQs: t.quizQs }); }
    const mark = ok ? '✅ OK' : '⚠️ WARN';
    const num = (ti+1 + '.').padStart(3, ' ');
    const name = t.title.padEnd(45).substring(0, 45);
    const cc = t.hasContent ? ' +' : ' -';
    const qq = t.hasQuiz ? ' +' : ' -';
    const sc = String(t.sections).padStart(3, ' ');
    const ex = String(t.exercises).padStart(3, ' ');
    const qs = String(t.quizQs).padStart(3, ' ');
    console.log(`  ${num} ${name} ${cc}    ${qq}   ${sc}  ${ex}  ${qs}  ${mark}`);
  });
});

console.log('\n' + '='.repeat(90));
console.log('UMUMIY NATIJALAR:');
console.log('  Jami darslar: ' + totalLessons);
console.log('  To\'liq (OK):  ' + totalOK);
console.log('  Muammoli:     ' + totalWarn);
console.log('='.repeat(90));

console.log('\nMUAMMOLI DARSLAR (to\'liq kontent kerak bo\'lganlar):');
console.log('-'.repeat(90));
problemList.forEach((pl, i) => {
  const n = (i+1 + '.').padStart(3, ' ');
  const issues = [];
  if (!pl.hasContent) issues.push('content yo\'q');
  if (!pl.hasQuiz) issues.push('quiz yo\'q');
  if (pl.sections < 3) issues.push(`sections kam (${pl.sections}/3)`);
  if (pl.exercises < 3) issues.push(`mashq kam (${pl.exercises}/3)`);
  if (pl.quizQs < 5) issues.push(`quiz savollar kam (${pl.quizQs}/5)`);
  console.log(`  ${n} [${pl.course}] Dars ${pl.idx+1}: ${pl.title}`);
  console.log(`      Muammolar: ${issues.join(', ')}`);
});

// Save report
let rpt = '';
rpt += 'LOYIHA AUDITI - BARCHA KURS VA DARSLAR\n' + '='.repeat(90) + '\n\n';
courses.forEach((c, ci) => {
  rpt += `\n[KURS ${ci+1}] ${c.name} (id: ${c.id}) — ${c.topics.length} dars\n`;
  c.topics.forEach((t, ti) => {
    const ok = t.hasContent && t.hasQuiz && t.sections >= 3 && t.exercises >= 1 && t.quizQs >= 5;
    const mark = ok ? 'OK' : 'WARN';
    rpt += `  [${mark}] Dars ${ti+1}: ${t.title} | Content:${t.hasContent?'YES':'NO'} Quiz:${t.hasQuiz?'YES':'NO'} Sections:${t.sections} Ex:${t.exercises} QuizQs:${t.quizQs}\n`;
  });
});
rpt += `\nUmumiy: Jami:${totalLessons} OK:${totalOK} Muammoli:${totalWarn}\n\n`;
rpt += 'MUAMMOLI DARSLAR:\n';
problemList.forEach((pl, i) => {
  const issues = [];
  if (!pl.hasContent) issues.push('content yo\'q');
  if (!pl.hasQuiz) issues.push('quiz yo\'q');
  if (pl.sections < 3) issues.push(`sections kam (${pl.sections}/3)`);
  if (pl.exercises < 3) issues.push(`mashq kam (${pl.exercises}/3)`);
  if (pl.quizQs < 5) issues.push(`quiz savollar kam (${pl.quizQs}/5)`);
  rpt += `  ${i+1}. [${pl.course}] Dars ${pl.idx+1}: ${pl.title} - ${issues.join(', ')}\n`;
});

fs.writeFileSync(path.join(__dirname, 'audit-report.txt'), rpt, 'utf-8');
console.log('\nAudit report: audit-report.txt');
