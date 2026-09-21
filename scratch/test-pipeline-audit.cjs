const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../server/database.sqlite');
const db = new sqlite3.Database(dbPath);

/* ============ 1. DB dagi barcha savollarni API formatida olish ============ */
function apiGetQuestions() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM test_questions WHERE published = 1';
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      const formatted = (rows || []).map(r => ({
        id: r.id,
        subject: r.subject,
        difficulty: r.difficulty,
        q: r.question,
        question: r.question,
        o: r.options ? JSON.parse(r.options) : [],
        options: r.options ? JSON.parse(r.options) : [],
        c: r.correct_index,
        answer: r.correct_index,
        e: r.explanation,
        explanation: r.explanation,
        published: r.published !== 0
      }));
      resolve(formatted);
    });
  });
}

/* ============ 2. Frontend mergeBackendQuestionBank logic ============ */
const QBANK_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const SUBJECT_NAMES = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'HTML', 'CSS', 'SQL', 'AI'];
const knownSubjects = new Set(SUBJECT_NAMES);
const QUESTIONS_PER_TEST = 10;

function normalizeQuestionText(text) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function mergeBackendQuestionBank(rows, existingBank) {
  const perSubject = {};
  let valid = 0;
  const skipped = [];

  for (const r of (rows || [])) {
    if (!r) continue;
    const subject = r.subject;
    const diff = String(r.difficulty || '').toLowerCase();
    const q = typeof r.q === 'string' ? r.q : r.question;
    const o = Array.isArray(r.o) ? r.o : r.options;
    const c = typeof r.c === 'number' ? r.c : r.answer;
    if (!knownSubjects.has(subject) || !QBANK_DIFFICULTIES.includes(diff)) {
      skipped.push({ id: r.id, reason: 'subject/diff mismatch', subject, diff });
      continue;
    }
    if (typeof q !== 'string' || !q.trim() || !Array.isArray(o) || o.length < 2) {
      skipped.push({ id: r.id, reason: 'invalid q/o', hasQ: !!q, oLen: o && o.length });
      continue;
    }
    if (typeof c !== 'number' || c < 0 || c >= o.length) {
      skipped.push({ id: r.id, reason: 'invalid c', c, oLen: o.length });
      continue;
    }

    (perSubject[subject] = perSubject[subject] || {})[diff] =
      (perSubject[subject][diff] || []).concat([{
        q, o, c,
        e: typeof r.e === 'string' ? r.e : r.explanation
      }]);
    valid++;
  }

  let added = 0;
  const Q_BANK = { ...existingBank };
  for (const [subject, levels] of Object.entries(perSubject)) {
    const cur = Q_BANK[subject] || { beginner: [], intermediate: [], advanced: [] };
    const mergeLevel = (fallbackArr, dbArr) => {
      const seen = new Set();
      const out = [];
      for (const qq of [...(dbArr || []), ...(fallbackArr || [])]) {
        const k = normalizeQuestionText(qq && qq.q);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        out.push(qq);
      }
      return out;
    };
    const before = QBANK_DIFFICULTIES.reduce((s, d) => s + (cur[d] || []).length, 0);
    Q_BANK[subject] = {
      beginner: mergeLevel(cur.beginner, levels.beginner),
      intermediate: mergeLevel(cur.intermediate, levels.intermediate),
      advanced: mergeLevel(cur.advanced, levels.advanced)
    };
    added += QBANK_DIFFICULTIES.reduce((s, d) => s + Q_BANK[subject][d].length, 0) - before;
  }
  return { valid, added, skipped, Q_BANK };
}

/* ============ 3. dedupe + buildTests logic ============ */
function dedupeQuestions(pool, testLabel) {
  const seen = new Set();
  const out = [];
  const skipped = [];
  for (const q of (pool || [])) {
    if (!q || !q.q || !Array.isArray(q.o) || q.o.length !== 4) {
      skipped.push({ reason: 'invalid q/o (need 4)', q: q && q.q });
      continue;
    }
    if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) {
      skipped.push({ reason: 'invalid c (need 0-3)', c: q.c, q: q.q });
      continue;
    }
    const key = normalizeQuestionText(q.q);
    if (seen.has(key)) { skipped.push({ reason: 'duplicate q text', q: q.q }); continue; }
    seen.add(key);
    out.push(q);
  }
  return { out, skipped };
}

function buildTestsFromPool(subjectName, diff, pool) {
  const { out: clean, skipped } = dedupeQuestions(pool, `${subjectName} ${diff}`);
  const total = Math.floor(clean.length / QUESTIONS_PER_TEST);
  const tests = [];
  for (let t = 0; t < total; t++) {
    const qs = clean.slice(t * QUESTIONS_PER_TEST, (t + 1) * QUESTIONS_PER_TEST);
    tests.push({
      id: `${subjectName}-${diff}-${t + 1}`,
      subject: subjectName,
      difficulty: diff,
      number: t + 1,
      title: `${diff} Test ${t + 1}`,
      questionCount: qs.length,
      questions: qs,
    });
  }
  const remainder = clean.length % QUESTIONS_PER_TEST;
  return { tests, cleanCount: clean.length, skippedDuringDedupe: skipped, remainder };
}

/* ============ 4. Run audit ============ */
(async () => {
  try {
    console.log('='.repeat(80));
    console.log('TEST PIPELINE AUDIT');
    console.log('='.repeat(80));
    const rows = await apiGetQuestions();
    console.log(`\n📊 API /api/tests/questions qaytargan savollar soni: ${rows.length}`);

    console.log('\n--- 1. Subject/Difficulty taqsimoti (API raw) ---');
    const bySubject = {};
    for (const r of rows) {
      const k = `${r.subject}/${r.difficulty}`;
      bySubject[k] = (bySubject[k] || 0) + 1;
    }
    for (const s of SUBJECT_NAMES) {
      for (const d of QBANK_DIFFICULTIES) {
        const n = bySubject[`${s}/${d}`] || 0;
        const expected = 30;
        const status = n === expected ? '✅' : (n > 0 ? `⚠️ (${n})` : '❌ 0');
        console.log(`  ${status} ${s.padEnd(12)} ${d.padEnd(14)} → ${String(n).padStart(3)} ta`);
      }
    }

    console.log('\n--- 2. mergeBackendQuestionBank natijasi ---');
    const merge = mergeBackendQuestionBank(rows, {});
    console.log(`  ✅ Valid savollar (DB dan o'tganlar): ${merge.valid}`);
    console.log(`  ⚠️  O'tkazib yuborilganlar: ${merge.skipped.length}`);
    if (merge.skipped.length) {
      const byReason = {};
      for (const s of merge.skipped) byReason[s.reason] = (byReason[s.reason] || 0) + 1;
      console.log('    Sabablar:', JSON.stringify(byReason));
    }

    console.log('\n--- 3. Q_BANK keyingi state (after merge) ---');
    const qb = merge.Q_BANK;
    let maxPossibleTests = 0;
    for (const s of SUBJECT_NAMES) {
      for (const d of QBANK_DIFFICULTIES) {
        const n = (qb[s] && qb[s][d]) ? qb[s][d].length : 0;
        const possible = Math.floor(n / 10);
        maxPossibleTests += possible;
        const status = possible >= 3 ? '✅' : (possible > 0 ? `⚠️ ${possible}` : '❌ 0');
        console.log(`  ${status} ${s.padEnd(12)} ${d.padEnd(14)} → ${String(n).padStart(3)} savol → ${possible} ta test`);
      }
    }
    console.log(`  JAMI: ${maxPossibleTests} ta test`);

    console.log('\n--- 4. buildTestsFromPool (dedupe + grouping) ---');
    const ALL_TESTS = {};
    let totalBuilt = 0;
    let totalSkippedQuestions = 0;
    let totalRemainder = 0;
    for (const s of SUBJECT_NAMES) {
      ALL_TESTS[s] = [];
      for (const d of QBANK_DIFFICULTIES) {
        const pool = (qb[s] && qb[s][d]) || [];
        const { tests, cleanCount, skippedDuringDedupe, remainder } = buildTestsFromPool(s, d, pool);
        ALL_TESTS[s].push(...tests);
        totalBuilt += tests.length;
        totalSkippedQuestions += skippedDuringDedupe.length;
        totalRemainder += remainder;
        if (tests.length < 3 || skippedDuringDedupe.length > 0 || remainder > 0) {
          console.log(`  ⚠️  ${s.padEnd(12)} ${d.padEnd(14)} → ${tests.length} test · dedupe skip: ${skippedDuringDedupe.length} · ortiqcha: ${remainder}`);
          if (skippedDuringDedupe.length) {
            const firstFew = skippedDuringDedupe.slice(0, 3).map(s => `    ${s.reason}: ${(s.q || '').slice(0, 60)}`).join('\n');
            console.log(firstFew);
          }
        }
      }
    }
    console.log(`\n  ✅ Umumiy testlar (ALL_TESTS): ${totalBuilt}`);
    console.log(`  ⚠️  dedupe da o'tkazib yuborilgan savollar: ${totalSkippedQuestions}`);
    console.log(`  ⚠️  Test hosil qilmagan ortiqcha savollar: ${totalRemainder}`);

    console.log('\n--- 5. Har bir subject uchun ALL_TESTS count ---');
    let missing = [];
    for (const s of SUBJECT_NAMES) {
      const n = (ALL_TESTS[s] || []).length;
      if (n < 9) missing.push(s);
      console.log(`  ${n >= 9 ? '✅' : '❌'} ${s.padEnd(12)} → ${n}/9 ta test`);
    }
    if (missing.length) {
      console.log(`\n❌ MUAMMO: ${missing.join(', ')} uchun to'liq 9 ta test yo'q!`);
    } else {
      console.log(`\n✅ Barcha 9 fan uchun 9*9=81 ta test mavjud.`);
    }

    console.log('\n--- 6. Validation: 4 variant va correct_index tekshiruvi ---');
    const optIssues = [];
    for (const s of SUBJECT_NAMES) {
      for (const d of QBANK_DIFFICULTIES) {
        const pool = (qb[s] && qb[s][d]) || [];
        for (let i = 0; i < pool.length; i++) {
          const q = pool[i];
          const uniq = new Set(q.o).size;
          if (uniq !== 4) optIssues.push({ subject: s, diff: d, idx: i, reason: `duplicate options (${uniq}/4 unique)`, q: q.q.slice(0, 50) });
        }
      }
    }
    console.log(optIssues.length ? `⚠️  ${optIssues.length} ta savol variantlari duplicate\n  Namuna:\n` + optIssues.slice(0, 5).map(x => `    ${x.subject}/${x.diff} #${x.idx}: ${x.reason} | ${x.q}`).join('\n') : '✅ Barcha savollarda 4 ta unique variant va to\'g\'ri correct_index bor.');

    db.close();
    console.log('\n' + '='.repeat(80));
    console.log('AUDIT TUGALLANDI.');
    console.log('='.repeat(80));
  } catch (e) {
    console.error('XATO:', e.message);
    db.close();
    process.exit(1);
  }
})();
