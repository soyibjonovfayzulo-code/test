/**
 * FULL LESSON AUDIT SCRIPT
 * Scans lessons-data.js and all course JSON for incomplete lessons
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DATA_DIR = path.join(__dirname, 'public', 'data');
const LESSONS_DATA = path.join(__dirname, 'lessons-data.js');

const BAD_PATTERNS = [
  /Loading\.\.\./i,
  /Yuklanmoqda\.\.\./i,
  /undefined/i,
  /\bnull\b/i,
  /Coming soon/i,
  /Tayyorlanmoqda/i,
  /Tez kunda/i,
  /placeholder/i,
  /dars tayyorlanmoqda/i
];

function auditObject(obj, pathStr) {
  const issues = [];
  const stats = {
    hasContent: !!(obj && obj.content),
    hasSections: 0,
    hasKeyPoints: 0,
    hasExercises: 0,
    hasQuiz: 0,
    quizQuestions: 0
  };

  if (!obj) {
    return { issues: [pathStr + ': object null/undefined'], stats };
  }

  if (!obj.content || typeof obj.content !== 'object') {
    issues.push(pathStr + ': content maydoni mavjud emas');
    return { issues, stats };
  }

  const c = obj.content;
  if (c.intro) {
    for (const pat of BAD_PATTERNS) {
      if (pat.test(c.intro)) { issues.push(pathStr + '.content.intro: bad pattern'); }
    }
  } else {
    issues.push(pathStr + '.content.intro: mavjud emas yoki bosh');
  }

  if (!c.sections || !Array.isArray(c.sections) || c.sections.length === 0) {
    issues.push(pathStr + '.content.sections: massiv bosh yoki mavjud emas');
  } else {
    stats.hasSections = c.sections.length;
    c.sections.forEach((sec, idx) => {
      const p = pathStr + '.content.sections[' + idx + ']';
      if (!sec.title) issues.push(p + '.title: mavjud emas');
      if (!sec.text) {
        issues.push(p + '.text: mavjud emas');
      } else {
        for (const pat of BAD_PATTERNS) {
          if (pat.test(sec.text)) { issues.push(p + '.text: bad pattern'); }
        }
      }
    });
  }

  if (!c.keyPoints || !Array.isArray(c.keyPoints) || c.keyPoints.length === 0) {
    issues.push(pathStr + '.content.keyPoints: massiv bosh yoki mavjud emas');
  } else {
    stats.hasKeyPoints = c.keyPoints.length;
  }

  if (!c.exercises || !Array.isArray(c.exercises) || c.exercises.length === 0) {
    issues.push(pathStr + '.content.exercises: massiv bosh (kamida 3 ta mashq kerak)');
  } else {
    stats.hasExercises = c.exercises.length;
  }

  if (!obj.quiz || !obj.quiz.questions || !Array.isArray(obj.quiz.questions) || obj.quiz.questions.length < 5) {
    issues.push(pathStr + '.quiz: kamida 5 ta savol kerak, hozir: ' + ((obj.quiz && obj.quiz.questions) ? obj.quiz.questions.length : 0));
  } else {
    stats.hasQuiz = obj.quiz.questions.length;
    stats.quizQuestions = obj.quiz.questions.length;
    obj.quiz.questions.forEach((q, idx) => {
      const p = pathStr + '.quiz.questions[' + idx + ']';
      if (!q.question) issues.push(p + '.question: mavjud emas');
      if (!q.options || q.options.length < 2) issues.push(p + '.options: kamida 2 variant');
      if (q.answer === undefined || q.answer === null) issues.push(p + '.answer: mavjud emas');
    });
  }

  return { issues, stats };
}

function main() {
  console.log('='.repeat(80));
  console.log('LOYIHA AUDITI - BARCHA KURS VA DARSLAR');
  console.log('='.repeat(80));

  let report = '';
  report += 'LOYIHA AUDITI - BARCHA KURS VA DARSLAR\n';
  report += '='.repeat(80) + '\n\n';

  let lessonsDataContent;
  try {
    lessonsDataContent = fs.readFileSync(LESSONS_DATA, 'utf-8');
  } catch(e) {
    console.log('lessons-data.js oqilmadi:', e.message);
    return;
  }

  try {
    const extractorFnBody = `
      var COURSES_OUT;
      (function() {
        'use strict';
        var origCourses;
        ${lessonsDataContent.replace(
          /(const|let|var)\s+COURSES\s*=\s*\[([\s\S]*?)\]\s*;?\s*\}\s*\)\s*\(\s*\)\s*;?\s*$/,
          function(match, decl, rest) {
            return decl + ' COURSES = [' + rest + '];\n        COURSES_OUT = COURSES;\n      })();\n      return COURSES_OUT;';
          }
        )}
    `;
    
    let courses;
    // Alternative: manually extract via regex
    const coursesMatch = lessonsDataContent.match(/const COURSES\s*=\s*(\[[\s\S]*?\])\s*;\s*\}\s*\)\s*\(\s*\);?\s*$/);
    if (coursesMatch) {
      try {
        const fn = new Function('return (' + coursesMatch[1] + ');');
        courses = fn();
      } catch (parseErr) {
        console.log('Regex parse error:', parseErr.message);
        // Try simpler approach
        const arrStr = coursesMatch[1];
        // Save to temp file
        fs.writeFileSync(path.join(__dirname, 'audit_courses_raw.txt'), arrStr, 'utf-8');
        console.log('Raw courses array saved to audit_courses_raw.txt for manual inspection');
      }
    }

    if (!courses || !Array.isArray(courses)) {
      console.log('COURSES array topilmadi!');
      return;
    }

    let totalLessons = 0;
    let totalIssues = 0;
    const problemLessons = [];

    courses.forEach((course, ci) => {
      const cName = course.name || 'N/A';
      const cId = course.id || 'course-' + ci;
      const tCount = course.topics ? course.topics.length : 0;
      console.log('\n[KURS ' + (ci+1) + '] ' + cName + ' (id: ' + cId + ') — ' + tCount + ' dars');
      report += '\n[KURS ' + (ci+1) + '] ' + cName + ' (id: ' + cId + ') — ' + tCount + ' dars\n';

      if (!course.topics || course.topics.length === 0) {
        console.log('  XATO: Darslar mavjud emas!');
        report += '  XATO: Darslar mavjud emas!\n';
        return;
      }

      course.topics.forEach((topic, ti) => {
        totalLessons++;
        const pathStr = 'COURSES[' + ci + ':' + cId + '].topics[' + ti + ':' + (topic.title || 'unnamed') + ']';
        const { issues, stats } = auditObject(topic, pathStr);

        const icon = issues.length === 0 ? 'OK' : 'WARN';
        console.log('  [' + icon + '] Dars ' + (ti+1) + ': ' + (topic.title || 'unnamed'));
        console.log('      Stats: sections=' + stats.hasSections + ', keyPoints=' + stats.hasKeyPoints + ', exercises=' + stats.hasExercises + ', quizQs=' + stats.quizQuestions);
        report += '  [' + icon + '] Dars ' + (ti+1) + ': ' + (topic.title || 'unnamed') + '\n';
        report += '      Stats: sections=' + stats.hasSections + ', keyPoints=' + stats.hasKeyPoints + ', exercises=' + stats.hasExercises + ', quizQs=' + stats.quizQuestions + '\n';

        if (issues.length > 0) {
          totalIssues += issues.length;
          problemLessons.push({ courseId: cId, courseName: cName, lessonIdx: ti, title: topic.title || 'unnamed', issues, stats });
          issues.forEach(iss => {
            console.log('      ! ' + iss);
            report += '      ! ' + iss + '\n';
          });
        }
      });
    });

    console.log('\n' + '='.repeat(80));
    console.log('UMUMIY NATIJALAR:');
    console.log('  Jami darslar: ' + totalLessons);
    console.log('  Muammoli darslar: ' + problemLessons.length);
    console.log('  Jami muammolar: ' + totalIssues);
    console.log('='.repeat(80));

    report += '\n' + '='.repeat(80) + '\n';
    report += 'UMUMIY NATIJALAR:\n';
    report += '  Jami darslar: ' + totalLessons + '\n';
    report += '  Muammoli darslar: ' + problemLessons.length + '\n';
    report += '  Jami muammolar: ' + totalIssues + '\n';
    report += '='.repeat(80) + '\n\n';

    report += 'MUAMMOLI DARSLAR ROYXATI:\n';
    problemLessons.forEach((pl, i) => {
      report += '  ' + (i+1) + '. [' + pl.courseName + '] Dars ' + (pl.lessonIdx+1) + ': ' + pl.title + '\n';
      report += '     Muammolar soni: ' + pl.issues.length + '\n';
      pl.issues.forEach(iss => report += '       - ' + iss + '\n');
    });

    fs.writeFileSync(path.join(__dirname, 'audit-report.txt'), report, 'utf-8');
    console.log('\nAudit hisoboti audit-report.txt fayliga saqlandi!');
  } catch (e) {
    console.log('Xatolik:', e.message);
    console.log(e.stack);
  }
}

main();
