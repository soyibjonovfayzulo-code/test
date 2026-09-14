/* TEST VALIDATOR — barcha testlarni tekshiradi (10 unique savol, 4 variant, correct answer) */
const fs = require('fs');
const path = require('path');

const QUESTIONS_PER_TEST = 10;
const SUBJECTS = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'HTML', 'CSS', 'SQL', 'AI'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const fileMap = { Python: 'python', JavaScript: 'javascript', Java: 'java', 'C++': 'cpp', 'C#': 'csharp', HTML: 'html', CSS: 'css', SQL: 'sql', AI: 'ai' };

const norm = t => String(t || '').trim().toLowerCase().replace(/\s+/g, ' ');
const dedupe = (pool, label) => {
  const seen = new Set(); const out = [];
  for (const q of (pool || [])) {
    if (!q || !q.q || !Array.isArray(q.o) || q.o.length !== 4) { console.error(`[TEST ERROR] ${label}: invalid question:`, JSON.stringify(q).slice(0, 120)); continue; }
    if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) { console.error(`[TEST ERROR] ${label}: missing correct answer:`, q.q); continue; }
    const k = norm(q.q);
    if (seen.has(k)) continue;
    seen.add(k); out.push(q);
  }
  return out;
};

let totalTests = 0, failed = 0, failedIds = [];
const crossTestOwners = new Map(); // savol -> [testId...]

for (const subject of SUBJECTS) {
  const file = path.join(__dirname, 'data', fileMap[subject] + '.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log('===', subject, LEVELS.map(l => (data[l] || []).length).join('/'));
  for (const diff of LEVELS) {
    const clean = dedupe(data[diff] || [], `${subject} ${diff}`);
    const total = Math.floor(clean.length / QUESTIONS_PER_TEST);
    for (let t = 0; t < total; t++) {
      const qs = clean.slice(t * QUESTIONS_PER_TEST, (t + 1) * QUESTIONS_PER_TEST);
      const id = `${subject}-${diff}-${t + 1}`;
      totalTests++;
      const problems = [];
      if (qs.length !== QUESTIONS_PER_TEST) problems.push(`Expected 10, Found ${qs.length}`);
      const ids = new Set();
      qs.forEach((q, i) => {
        const k = norm(q.q);
        if (ids.has(k)) problems.push(`Savol #${i + 1} DUPLICATE: ${q.q}`);
        ids.add(k);
        if (crossTestOwners.has(k)) problems.push(`Savol boshqa testda ham bor (${crossTestOwners.get(k)}): ${q.q}`);
        else crossTestOwners.set(k, id);
        if (new Set(q.o).size !== 4) problems.push(`Savol #${i + 1}: variantlar duplicate`);
      });
      if (problems.length) { failed++; failedIds.push(id); console.error(`[TEST ERROR] ${id}\n  ` + problems.join('\n  ')); }
      else console.log(`PASS ✅ ${id} — 10/10 unique`);
    }
    const tail = clean.length % QUESTIONS_PER_TEST;
    if (tail > 0) console.warn(`[WARN] ${subject} ${diff}: ${tail} ortiqcha savol — to'liq 10 lik bo'lmagani uchun test yaratilmadi.`);
  }
}

console.log(`\n===== NATIJA =====`);
console.log(`Total tests: ${totalTests}`);
console.log(`Failed: ${failed} ${failedIds.join(', ')}`);
if (failed === 0) { console.log('✅ ALL TESTS PASS — har bir test 10 ta UNIQUE savoldan iborat.'); process.exit(0); }
process.exit(1);

