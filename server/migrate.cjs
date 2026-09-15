/**
 * migrate.cjs — script.js dan COURSES hamda data/*.json dan TEST QUESTIONS'ni SQLite ga ko'chiradi.
 * String yoki to'liq object bo'lgan topic'larning ikkalasini ham handle qiladi.
 * Admin email: muhammadziyomashrabjonov544@gmail.com, parol: admin123
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { db, initDb } = require('./db.cjs');
const bcrypt = require('bcrypt');

const scriptPath = path.resolve(__dirname, '../script.js');
const dataDirPath = path.resolve(__dirname, '../data');

/* ─── 1. Massiv chegarasini topuvchi helper ─── */
function extractArrayString(source, startKeyword) {
  const startIdx = source.indexOf(startKeyword);
  if (startIdx === -1) return null;

  const arrStart = source.indexOf('[', startIdx + startKeyword.length - 1);
  if (arrStart === -1) return null;

  let depth = 0;
  let inStr = false;
  let strChar = '';

  for (let i = arrStart; i < source.length; i++) {
    const ch = source[i];
    const prev = source[i - 1];

    if (inStr) {
      if (ch === strChar && prev !== '\\') inStr = false;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = true;
      strChar = ch;
      continue;
    }
    if (ch === '[') { depth++; continue; }
    if (ch === ']') {
      depth--;
      if (depth === 0) return source.substring(arrStart, i + 1);
    }
  }
  return null;
}

/* ─── 2. Topic normallashtiruvchi helper ─── */
function normalizeTopic(raw) {
  if (typeof raw === 'string') {
    return { title: raw, duration: null, xp: null, content: null, quiz: null, exercises: null, masterXp: null };
  }
  return {
    title: raw.title || null,
    duration: raw.duration || null,
    xp: raw.xp || null,
    masterXp: raw.masterXp || null,
    content: raw.content ? JSON.stringify(raw.content) : null,
    quiz: raw.quiz ? JSON.stringify(raw.quiz) : null,
    exercises: raw.exercises ? JSON.stringify(raw.exercises) : null,
  };
}

/* ─── 3. Asosiy migratsiya ─── */
async function doMigration() {
  await initDb();

  /* Admin foydalanuvchisini yaratish / yangilash */
  const adminHash = await bcrypt.hash('admin123', 10);
  const targetEmail = 'muhammadziyomashrabjonov544@gmail.com';

  await new Promise((res, rej) => {
    db.run(
      'INSERT INTO admins (username, password) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET password=excluded.password',
      [targetEmail, adminHash],
      (err) => err ? rej(err) : res()
    );
  });
  // 'admin' ham zaxira sifatida bo'lishi mumkin
  await new Promise((res) => {
    db.run(
      'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)',
      ['admin', adminHash],
      () => res()
    );
  });
  console.log(`✅ Admin (${targetEmail} va admin) paroli o'rnatildi.`);

  /* 3.1 COURSES migratsiyasi */
  const code = fs.readFileSync(scriptPath, 'utf8');
  const coursesStr = extractArrayString(code, 'const COURSES = ');
  if (!coursesStr) {
    console.error('COURSES massivi topilmadi!');
    return;
  }

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`var _data = ${coursesStr};`, sandbox);
  const courses = sandbox._data;

  if (!Array.isArray(courses) || courses.length === 0) {
    console.error('COURSES bo\'sh yoki noto\'g\'ri format!');
    return;
  }

  console.log(`✅ ${courses.length} ta kurs topildi. DB ga yozilmoqda...`);

  for (const course of courses) {
    await new Promise((res, rej) => {
      db.run(
        'INSERT OR REPLACE INTO courses (id, name, icon, color, tagline, description, published) VALUES (?,?,?,?,?,?,1)',
        [course.id, course.name, course.icon, course.color, course.tagline || '', course.description || ''],
        (err) => err ? rej(err) : res()
      );
    });

    const topics = course.topics || [];
    console.log(`  📚 ${course.name}: ${topics.length} ta topic`);

    // Eski topiclarni tozalab yangitdan yozamiz
    await new Promise((res) => db.run('DELETE FROM topics WHERE course_id = ?', [course.id], () => res()));

    for (const raw of topics) {
      const t = normalizeTopic(raw);
      await new Promise((res, rej) => {
        db.run(
          'INSERT INTO topics (course_id, title, duration, xp, masterXp, content, quiz, exercises, published) VALUES (?,?,?,?,?,?,?,?,1)',
          [course.id, t.title, t.duration, t.xp, t.masterXp, t.content, t.quiz, t.exercises],
          (err) => err ? rej(err) : res()
        );
      });
    }
  }

  /* 3.2 TEST QUESTIONS migratsiyasi (data/*.json fayllaridan) */
  if (fs.existsSync(dataDirPath)) {
    const jsonFiles = fs.readdirSync(dataDirPath).filter(f => f.endsWith('.json'));
    console.log(`\n✅ ${jsonFiles.length} ta test savollari fayli topildi (data/ papkasi).`);

    const keyMap = {
      'python': 'Python',
      'javascript': 'JavaScript',
      'java': 'Java',
      'cpp': 'C++',
      'csharp': 'C#',
      'html': 'HTML',
      'css': 'CSS',
      'sql': 'SQL',
      'ai': 'AI'
    };

    // test_questions jadvalini tozalash (xavfsiz qayta migratsiya uchun)
    await new Promise((res) => db.run('DELETE FROM test_questions', () => res()));

    let totalMigratedQuestions = 0;

    for (const file of jsonFiles) {
      const baseName = file.replace('.json', '');
      const rawData = JSON.parse(fs.readFileSync(path.join(dataDirPath, file), 'utf8'));
      const subject = keyMap[baseName] || rawData.name || baseName;

      for (const diff of ['beginner', 'intermediate', 'advanced']) {
        const questions = rawData[diff] || [];
        for (const item of questions) {
          const q = item.q || item.question || '';
          const o = JSON.stringify(item.o || item.options || []);
          const c = (item.c !== undefined ? item.c : item.answer) ?? 0;
          const e = item.e || item.explanation || '';

          await new Promise((res, rej) => {
            db.run(
              'INSERT INTO test_questions (subject, difficulty, question, options, correct_index, explanation, published) VALUES (?,?,?,?,?,?,1)',
              [subject, diff, q, o, c, e],
              (err) => err ? rej(err) : res()
            );
          });
          totalMigratedQuestions++;
        }
      }
      console.log(`  📝 ${subject}: savollar bazaga yuklandi.`);
    }
    console.log(`✅ Jami ko'chirilgan test savollari: ${totalMigratedQuestions}`);
  }

  /* 3.3 Yakuniy tekshiruv */
  const counts = await new Promise((res) => {
    db.get('SELECT (SELECT COUNT(*) FROM courses) as c_cnt, (SELECT COUNT(*) FROM topics) as t_cnt, (SELECT COUNT(*) FROM test_questions) as q_cnt', (err, row) => {
      res(row || {});
    });
  });

  console.log(`\n🎉 MIGRATION YAKUNLANDI!`);
  console.log(`- Kurslar soni: ${counts.c_cnt}`);
  console.log(`- Darslar (topics) soni: ${counts.t_cnt}`);
  console.log(`- Test savollari soni: ${counts.q_cnt}`);
}

if (require.main === module) {
  doMigration()
    .then(() => {
      setTimeout(() => process.exit(0), 500);
    })
    .catch((err) => {
      console.error('Migration xatosi:', err);
      process.exit(1);
    });
}

module.exports = { doMigration };
