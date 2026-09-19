const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf-8');

const lines = file.split('\n');

// Real topic titles = 10-space indent + title:
// Section titles = 16+ space indent
// So we find the exact indent level
const REAL_TOPIC_RE = /^\s{10}title:\s*['"]([^'"]+)['"]/;
const SECTION_RE = /^\s{16}title:\s*['"]([^'"]+)['"]/;
const CONTENT_OPEN_RE = /^\s{10}content:\s*\{/;
const QUIZ_OPEN_RE = /^\s{10}quiz:\s*\{/;

// Find course headers
const courseIds = [];
lines.forEach((l, i) => {
  const m = l.match(/^\s{6}id:\s*['"](\w+)['"],/);
  if (m) courseIds.push({ id: m[1], line: i, name: '', topics: [] });
});

// Find course names (next line after id)
lines.forEach((l, i) => {
  const m = l.match(/^\s{6}name:\s*['"]([^'"]+)['"],/);
  if (m) {
    // Match this name to the closest course id above
    for (let ci = courseIds.length - 1; ci >= 0; ci--) {
      if (courseIds[ci].line < i && !courseIds[ci].name) { courseIds[ci].name = m[1]; break; }
    }
  }
});

// Now assign topics to each course: each real topic found belongs to closest course id above it
let curCourseIdx = -1;
let topicIdxInCourse = 0;
const topicDetails = new Map(); // topic line -> { idx, hasContent, hasQuiz }

lines.forEach((l, i) => {
  // check if we passed a new course id line
  const nextCourse = courseIds.findIndex(c => c.line === i);
  if (nextCourse !== -1) {
    curCourseIdx = nextCourse;
    topicIdxInCourse = 0;
  }
  
  const tm = l.match(REAL_TOPIC_RE);
  if (tm) {
    if (curCourseIdx === -1) return;
    courseIds[curCourseIdx].topics.push({
      line: i,
      idx: topicIdxInCourse++,
      title: tm[1],
      hasContent: false,
      hasQuiz: false,
      sections: 0,
      exercises: 0,
      quizQs: 0
    });
    topicDetails.set(i, courseIds[curCourseIdx].topics[courseIds[curCourseIdx].topics.length - 1]);
  }
});

// Now find content/quiz for each topic: scan from topic line to next topic/course line
for (let ci = 0; ci < courseIds.length; ci++) {
  const course = courseIds[ci];
  const nextCourseLine = ci < courseIds.length - 1 ? courseIds[ci+1].line : lines.length;
  for (let ti = 0; ti < course.topics.length; ti++) {
    const topic = course.topics[ti];
    const start = topic.line;
    const end = (ti < course.topics.length - 1) ? course.topics[ti+1].line : nextCourseLine;
    for (let j = start; j < end; j++) {
      const l = lines[j];
      if (CONTENT_OPEN_RE.test(l)) topic.hasContent = true;
      if (QUIZ_OPEN_RE.test(l)) topic.hasQuiz = true;
      if (SECTION_RE.test(l)) topic.sections++;
      if (/^\s{16,}id:\s*['"](ex|l\d+ex|bonus|build|detective)/i.test(l)) topic.exercises++;
      if (/^\s{14,}question:\s*['"`]/.test(l)) topic.quizQs++;
    }
  }
}

console.log('='.repeat(100));
console.log('LOYIHA AUDITI - TO\'G\'RI NATIJA');
console.log('='.repeat(100));

let totalLessons = 0, totalOK = 0, totalWarn = 0;
const problems = [];

courseIds.forEach((c, ci) => {
  console.log(`\n[KURS ${ci+1}] ${c.name || '?'} (id: ${c.id}) — ${c.topics.length} ta real dars`);
  console.log('   '.padEnd(90, '-'));
  console.log('  #  '.padEnd(5) + 'Dars nomi'.padEnd(48) + '  C  Q  Sec Ex Qs  Holat');
  console.log('   '.padEnd(90, '-'));
  
  c.topics.forEach((t, ti) => {
    totalLessons++;
    const ok = t.hasContent && t.hasQuiz && t.sections >= 3 && t.exercises >= 1 && t.quizQs >= 5;
    if (ok) totalOK++; else { totalWarn++; problems.push({ ...t, course: c.name, courseId: c.id }); }
    const num = String(ti+1).padStart(3);
    const nm = t.title.padEnd(45).slice(0, 45);
    const cc = t.hasContent ? ' +' : ' -';
    const qq = t.hasQuiz ? ' +' : ' -';
    const sc = String(t.sections).padStart(3);
    const ex = String(t.exercises).padStart(3);
    const qs = String(t.quizQs).padStart(3);
    const mark = ok ? '✅ OK' : '⚠️ WARN';
    console.log(`  ${num}  ${nm}${cc} ${qq} ${sc}${ex}${qs}  ${mark}`);
  });
});

console.log('\n' + '='.repeat(100));
console.log('UMUMIY NATIJALAR:');
console.log('  Jami darslar: ' + totalLessons);
console.log('  To\'liq:      ' + totalOK);
console.log('  Muammoli:    ' + totalWarn);
console.log('='.repeat(100));

console.log('\nMUAMMOLI DARSLAR (to\'liq to\'ldirish kerak):');
console.log('-'.repeat(100));
problems.forEach((pl, i) => {
  const issues = [];
  if (!pl.hasContent) issues.push('KONTENT YO\'Q');
  if (!pl.hasQuiz) issues.push('QUIZ YO\'Q');
  if (pl.sections < 3) issues.push(`section kam (${pl.sections}/3)`);
  if (pl.exercises < 3) issues.push(`mashq kam (${pl.exercises}/3)`);
  if (pl.quizQs < 5) issues.push(`quizSavol kam (${pl.quizQs}/5)`);
  console.log(`  ${String(i+1).padStart(3)}. [${pl.course}] Dars ${pl.idx+1}: ${pl.title}`);
  console.log(`      Muammolar: ${issues.join(', ')}`);
});

// Save report
let rpt = '';
rpt += 'LOYIHA AUDITI\n' + '='.repeat(100) + '\n';
courseIds.forEach((c, ci) => {
  rpt += `\n[KURS ${ci+1}] ${c.name || '?'} (id: ${c.id}) — ${c.topics.length} dars\n`;
  c.topics.forEach((t, ti) => {
    const ok = t.hasContent && t.hasQuiz && t.sections >= 3 && t.exercises >= 1 && t.quizQs >= 5;
    rpt += `  [${ok?'OK':'WARN'}] Dars ${ti+1}: ${t.title} | C:${t.hasContent} Q:${t.hasQuiz} Sec:${t.sections} Ex:${t.exercises} Qs:${t.quizQs}\n`;
  });
});
rpt += `\nUmumiy: Jami:${totalLessons} OK:${totalOK} Muammoli:${totalWarn}\n\n`;
rpt += 'TO\'LDIRISH KERAK BO\'LGAN DARSLAR:\n';
problems.forEach((p, i) => {
  const issues = [];
  if (!p.hasContent) issues.push('content');
  if (!p.hasQuiz) issues.push('quiz');
  if (p.sections < 3) issues.push('sections=' + p.sections);
  if (p.exercises < 3) issues.push('exercises=' + p.exercises);
  if (p.quizQs < 5) issues.push('quizQs=' + p.quizQs);
  rpt += `  ${i+1}. [${p.course}/${p.courseId}] #${p.idx+1} "${p.title}" — ${issues.join(', ')}\n`;
});
fs.writeFileSync(path.join(__dirname, 'audit-report-clean.txt'), rpt, 'utf-8');
console.log('\nSaved to audit-report-clean.txt');
