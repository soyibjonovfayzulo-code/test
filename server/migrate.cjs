/**
 * migrate.cjs — script.js dan COURSES ma'lumotlarini SQLite ga ko'chiradi.
 * String yoki to'liq object bo'lgan topic'larning ikkalasini ham handle qiladi.
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const { db, initDb } = require('./db.cjs');
const bcrypt = require('bcrypt');

const scriptPath = path.resolve(__dirname, '../script.js');

/* ─── 1. Massiv chegarasini topuvchi helper ─── */
function extractArrayString(source, startKeyword) {
  const startIdx = source.indexOf(startKeyword);
  if (startIdx === -1) return null;

  /* Array [ dan boshlaymiz */
  const arrStart = source.indexOf('[', startIdx + startKeyword.length - 1);
  if (arrStart === -1) return null;

  let depth   = 0;
  let inStr   = false;
  let strChar = '';

  for (let i = arrStart; i < source.length; i++) {
    const ch   = source[i];
    const prev = source[i - 1];

    if (inStr) {
      if (ch === strChar && prev !== '\\') inStr = false;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = true; strChar = ch; continue; }
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
    title:     raw.title     || null,
    duration:  raw.duration  || null,
    xp:        raw.xp        || null,
    masterXp:  raw.masterXp  || null,
    content:   raw.content   ? JSON.stringify(raw.content)   : null,
    quiz:      raw.quiz      ? JSON.stringify(raw.quiz)      : null,
    exercises: raw.exercises ? JSON.stringify(raw.exercises) : null,
  };
}

/* ─── 3. Asosiy migratsiya ─── */
async function doMigration() {
  await initDb();

  /* Default admin yaratish */
  const adminHash = await bcrypt.hash('admin123', 10);
  db.run(
    'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)',
    ['admin', adminHash]
  );

  const code = fs.readFileSync(scriptPath, 'utf8');
  const coursesStr = extractArrayString(code, 'const COURSES = ');
  if (!coursesStr) {
    console.error('COURSES massivi topilmadi!');
    return;
  }

  /* VM da eval qilamiz — bare minimum global'lar bilan */
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`var _data = ${coursesStr};`, sandbox);
  const courses = sandbox._data;

  if (!Array.isArray(courses) || courses.length === 0) {
    console.error('COURSES bo\'sh yoki noto\'g\'ri format!');
    return;
  }

  console.log(`✅ ${courses.length} kurs topildi. DB ga yozilmoqda...`);

  for (const course of courses) {
    /* Course row */
    db.run(
      'INSERT OR REPLACE INTO courses (id, name, icon, color, tagline, description) VALUES (?,?,?,?,?,?)',
      [course.id, course.name, course.icon, course.color, course.tagline, course.description]
    );

    const topics = course.topics || [];
    console.log(`  📚 ${course.name}: ${topics.length} ta topic`);

    for (const raw of topics) {
      const t = normalizeTopic(raw);
      db.run(
        'INSERT INTO topics (course_id, title, duration, xp, masterXp, content, quiz, exercises) VALUES (?,?,?,?,?,?,?,?)',
        [course.id, t.title, t.duration, t.xp, t.masterXp, t.content, t.quiz, t.exercises]
      );
    }
  }

  /* Yozish tugashini kutamiz */
  setTimeout(() => {
    db.get('SELECT COUNT(*) AS cnt FROM topics', (_, r) => {
      console.log(`\n✅ Migration tugadi! Jami topics: ${r.cnt}`);
      db.close();
    });
  }, 1500);
}

doMigration().catch(err => {
  console.error('Migration xatosi:', err);
  process.exit(1);
});
