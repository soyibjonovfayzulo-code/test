/* 5-DARS E2E test — haqiqiy DOM eventlar bilan (jsdom) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;

let errors = [];
window.addEventListener('error', function (e) { errors.push('window.onerror: ' + e.message); });

const store = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: k => (store[k] == null ? null : store[k]),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
  }, configurable: true
});
window.__itShowPage = function (name) {
  doc.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = doc.querySelector('#page-' + name);
  if (pg) pg.classList.add('active');
};
const testUser = { username: 'student5', email: 's5@mail.com', xp: 0, points: 0, coins: 0 };
window.__itGetCurrentUser = function () { return testUser; };
window.showToast = function (msg, type) { window.__lastToast = { msg: msg, type: type }; };
window.confirm = function () { return true; };

let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
window.eval(dataSrc);
window.eval(appSrc);
window.openCodePlaygroundWithHtml = function (rawHtml, returnCtx) { window.__pgHtml = rawHtml; window.__pgCtx = returnCtx; };
window.openCodePlaygroundWithCode = function (h, c, j, returnCtx) { window.__pgCode = { html: h, css: c, js: j, ctx: returnCtx }; };

let passed = 0, failed = 0;
function ok(cond, label) { if (cond) { passed++; console.log('  PASS ' + label); } else { failed++; console.log('  FAIL ' + label); } }
function click(el) { if (!el) { failed++; console.log('  FAIL click(null)'); return; } el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
function fire(el, type) { el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true })); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const API = window.CoursesAPI;
const l5 = API.findLesson('html', 'html-d5');
console.log('5-dars:', l5 && l5.lesson.title);

(async () => {
  window.Lessons.openCourse('html');
  const courseEl = doc.querySelector('#lsCourseContainer');
  ok(courseEl && courseEl.textContent.includes('Birinchi katta mini-loyiham'), 'Kurs ro\'yxatida 5-dars bor');

  window.Lessons.openLesson('html', 'html-d5');
  const wrap = doc.querySelector('#lsLessonContainer');
  ok(wrap.textContent.includes('REVIEW 1 — HTML asoslari'), 'REVIEW 1 bor');
  ok(wrap.textContent.includes('REVIEW 2 — HTML document skeleton'), 'REVIEW 2 bor');
  ok(wrap.textContent.includes('REVIEW 3 — Attributes'), 'REVIEW 3 bor');
  ok(wrap.textContent.includes('REVIEW 4 — Links'), 'REVIEW 4 bor');
  ok(wrap.textContent.includes('CSS — sahifani bezaydi'), 'CSS qisqa takror bor');
  ok(wrap.textContent.includes('JavaScript — sahifaga harakat beradi'), 'JS qisqa takror bor');

  /* TRI DEMO */
  const td = doc.querySelector('#lsTriDemo');
  ok(td !== null, 'TriDemo bloki bor');
  ok(td.querySelectorAll('[data-td-tab]').length === 3 && td.querySelectorAll('iframe.ls-td-frame').length === 3, 'TriDemo: 3 tab + 3 iframe');
  ok(td.querySelector('[data-td-panel="2"] iframe').getAttribute('srcdoc').includes('addEventListener'), 'TriDemo JS iframe da addEventListener bor');
  click(td.querySelector('[data-td-tab="2"]'));
  ok(td.querySelector('[data-td-panel="2"]').classList.contains('active') && !td.querySelector('[data-td-panel="0"]').classList.contains('active'), 'Tab 2 bosilganda panel almashadi');

  /* GAMES HUB */
  ok(doc.querySelectorAll('.ls-game-card').length === 7, '7 ta mini-o\'yin kartasi bor');
  ok(doc.querySelector('#lsGame-bughunter') && doc.querySelector('#lsGame-duel') && doc.querySelector('#lsGame-streak'), 'Bug Hunter / Duel / Streak kartalari mavjud');

  /* ONE-BY-ONE UNLOCK: ochilganda faqat 1-o'yin ochiq */
  const unlockedCards = () => Array.from(doc.querySelectorAll('.ls-game-card:not(.locked)')).map(c => c.getAttribute('data-game'));
  const lockedNote = (id) => { const c = doc.querySelector('#lsGame-' + id); return c && c.classList.contains('locked') && c.textContent.includes('Avval oldingi o‘yinni tugating'); };
  ok(unlockedCards().length === 1 && unlockedCards()[0] === 'bughunter', 'Dars ochilganda faqat 1-o\'yin (Bug Hunter) ochiq');
  ok(lockedNote('memory') && lockedNote('duel'), 'Yopiq o\'yinlarda 🔒 holat ko\'rsatiladi');
  ok(doc.querySelector('#lsGamesProgress').textContent.includes('0/7'), 'Progress 0/7 ko\'rinadi');

  /* O'YIN 1: BUG HUNTER */
  const bh = doc.querySelector('[data-game-body="bughunter"]');
  ok(bh && bh.textContent.includes('Round 1 / 3'), 'Bug Hunter round 1 render');
  click(bh.querySelector('[data-gap="0"]'));
  await sleep(850);
  click(bh.querySelector('[data-gap="0"]'));
  await sleep(850);
  click(bh.querySelector('[data-gap="0"]'));
  await sleep(50);
  ok(bh.textContent.includes('Bug Hunter tugadi'), 'Bug Hunter: 3/3 round — g\'alaba');
  ok(bh.closest('.ls-game-card').querySelector('[data-game-badge="bughunter"]').textContent.includes('Bajarildi'), 'Bug Hunter badge ✅');
  ok(unlockedCards().length === 2 && unlockedCards()[1] === 'build', 'Bug Hunter tugadi → 2-o\'yin (Build) ochildi');
  ok(lockedNote('memory'), 'Memory hali yopiq');

  /* O'YIN 2: BUILD THE HTML — dragdrop exercise (tap-select fallback) */
  const dndPool = doc.querySelector('#lsDndPool-l5build');
  const dndZone = doc.querySelector('#lsDndZone-l5build');
  ok(dndPool && dndZone, 'Build the HTML: pool + zone bor');
  const expectedItems = ['<body>', '  <h1>Salom dunyo</h1>', '  <p>Men web dastur o‘rganayapman.</p>', '</body>'];
  for (const want of expectedItems) {
    const chip = Array.from(dndPool.querySelectorAll('[data-chip-idx]')).find(c => c.textContent === want);
    click(chip); // tap-select (mobile fallback)
    click(dndZone.querySelector('.ls-dnd-slot-empty')); // keyingi bo'sh o'ringa joylash
  }
  click(wrap.querySelector('[data-ex-check="l5build"]'));
  const buildCard = wrap.querySelector('[data-ex-id="l5build"]');
  ok(buildCard.textContent.includes('Ajoyib! HTML skeleti to‘g‘ri tartiblangan'), 'Build the HTML: to\'g\'ri tartib qabul qilindi');
  ok(unlockedCards().length === 3 && unlockedCards()[2] === 'memory', 'Build tugadi → 3-o\'yin (Memory) ochildi');

  /* O'YIN 3: MEMORY CODE — flip mexanikasi */
  const mem = doc.querySelector('[data-game-body="memory"]');
  const memCards = mem.querySelectorAll('[data-mem]');
  ok(memCards.length === 12, 'Memory: 12 karta');
  click(mem.querySelector('[data-mem="0"]'));
  click(mem.querySelector('[data-mem="1"]'));
  ok(mem.querySelectorAll('.ls-mem-card.open').length === 2, 'Memory: 2 karta ochiladi');
  await sleep(900);
  ok(mem.querySelectorAll('.ls-mem-card.open').length === 0, 'Memory: mos kelmasa qayta yopiladi');

  /* Memory o'yinini TO'LIQ yakunlash (unlock zanjiri: 3 → 4) */
  {
    // Har bir juftlikning ikkala karta indeksini internal state'dan topamiz va moslashtiramiz
    const memCards = mem._memCards || [];
    const pairCount = memCards.reduce((m, c) => Math.max(m, c.pair + 1), 0);
    for (let p = 0; p < pairCount; p++) {
      const idxs = memCards.map((c, i) => (c.pair === p ? i : -1)).filter(i => i >= 0);
      click(mem.querySelector('[data-mem="' + idxs[0] + '"]'));
      click(mem.querySelector('[data-mem="' + idxs[1] + '"]'));
    }
    ok(mem.querySelectorAll('.ls-mem-card.matched, .ls-mem-card.open').length === 12, 'Memory: 6/6 juftlik — g\'alaba');
    ok(doc.querySelector('[data-game-badge="memory"]').textContent.includes('Bajarildi'), 'Memory badge ✅');
    ok(mem.textContent.includes('Memory Code tugadi'), 'Memory: tugadi ekrani');
    ok(unlockedCards().length === 4 && unlockedCards()[3] === 'runner', 'Memory tugadi → 4-o\'yin (Runner) ochildi');
  }

  /* O'YIN 4: CODE RUNNER — runnerQuestions a indekslari: [1,0,2,1,2,1] */
  const run = doc.querySelector('[data-game-body="runner"]');
  ok(run.textContent.includes('🏃'), 'Code Runner: avatar bor');
  const runAnswers = [1, 0, 2, 1, 2, 1];
  for (let i = 0; i < 6; i++) {
    click(run.querySelector('[data-opt="' + runAnswers[i] + '"]'));
    if (i < 5) await sleep(950);
  }
  await sleep(50);
  ok(run.textContent.includes('FINISH'), 'Code Runner: finish chizig\'iga yetdi');
  ok(run.closest('.ls-game-card').querySelector('[data-game-badge="runner"]').textContent.includes('Bajarildi'), 'Code Runner badge ✅');
  ok(unlockedCards().length === 5 && unlockedCards()[4] === 'sixty', 'Runner tugadi → 5-o\'yin (60 Seconds) ochildi');

  /* O'YIN 5: 60 SECONDS — boshlash + 8 to'g'ri javob → yakunlash */
  const sixty = doc.querySelector('[data-game-body="sixty"]');
  click(sixty.querySelector('[data-start="1"]'));
  ok(sixty.querySelector('[data-t]') !== null, '60 Seconds: timer render');
  click(sixty.querySelector('[data-opt="0"]'));
  await sleep(400);
  ok(sixty.querySelector('[data-s]') && (sixty.querySelector('[data-s]').textContent === '1' || sixty.textContent.includes('To‘g‘ri javob')), '60 Seconds: javob qabul qilindi (score yoki feedback)');
  for (let i = 0; i < 8; i++) {
    const q = sixty._q;
    if (!q) break;
    click(sixty.querySelector('[data-opt="' + q.a + '"]'));
    await sleep(400);
  }
  if (typeof sixty._stopSixty === 'function') sixty._stopSixty();
  await sleep(20);
  ok(doc.querySelector('[data-game-badge="sixty"]').textContent.includes('Bajarildi'), '60 Seconds: 8+ to\'g\'ri — bajarildi');
  ok(unlockedCards().length === 6 && unlockedCards()[5] === 'streak', '60 Seconds tugadi → 6-o\'yin (Streak) ochildi');

  /* O'YIN 6: STREAK FIRE — 7 ketma-ket (streakQuestions a: [1,0,1,1,1,1,0,...]) */
  const streak = doc.querySelector('[data-game-body="streak"]');
  const stAnswers = [1, 0, 1, 1, 1, 1, 0];
  for (let i = 0; i < 7; i++) click(streak.querySelector('[data-opt="' + stAnswers[i] + '"]'));
  ok(streak.textContent.includes('STREAK FIRE'), 'Streak Fire: 7 streak — g\'alaba');
  ok(streak.closest('.ls-game-card').querySelector('[data-game-badge="streak"]').textContent.includes('Bajarildi'), 'Streak badge ✅');
  ok(unlockedCards().length === 7 && unlockedCards()[6] === 'duel', 'Streak tugadi → 7-o\'yin (Duel) ochildi');

  /* O'YIN 7: CODE DUEL — 3 round (duelQuestions a: [0,1,2]) */
  const duel = doc.querySelector('[data-game-body="duel"]');
  ok(duel.textContent.includes('VS'), 'Code Duel: VS panel');
  const duAnswers = [0, 1, 2];
  for (let i = 0; i < 3; i++) {
    click(duel.querySelector('[data-opt="' + duAnswers[i] + '"]'));
    if (i < 2) await sleep(950);
  }
  await sleep(950);
  ok(duel.textContent.includes('G‘ALIB'), 'Code Duel: 3/3 to\'g\'ri — g\'alaba');
  ok(doc.querySelector('[data-game-badge="duel"]').textContent.includes('Bajarildi'), 'Duel badge ✅');
  ok(doc.querySelector('#lsGamesProgress').textContent.includes('7/7'), 'Progress 7/7 — barcha o\'yinlar bajarildi');
  ok(doc.querySelectorAll('.ls-game-card.locked').length === 0, '7/7 da hech qanday o\'yin yopiq emas');
  ok(duel.closest('.ls-game-card').querySelector('[data-game-badge="duel"]').textContent.includes('Bajarildi'), 'Duel badge ✅');

  /* LOYIHA — steps + checklist + playground */
  const proj = doc.querySelector('#lsProject');
  ok(proj !== null && proj.textContent.includes('MY FIRST PORTFOLIO'), 'LOYIHA bloki bor');
  ok(proj.querySelectorAll('.ls-step-card').length === 10, '10 ta STEP bor');
  click(proj.querySelector('[data-step-pg="8"]')); // STEP 9 (css) — kumulyativ kod
  await sleep(20);
  ok(window.__pgCode && window.__pgCode.css.includes('border-radius: 16px') && window.__pgCode.html.includes('<header id="top">'), 'STEP 9 → Playground: HTML+CSS+JS 3 tabga yuborildi');
  ok(window.__pgCode.ctx && window.__pgCode.ctx.lessonId === 'html-d5', 'Playground return context saqlandi');

  /* LOYIHA editori: starter + CSS + JS → checklist 100% */
  const projTa = doc.getElementById('lsExCode-l5project');
  ok(projTa && projTa.value.includes('<!DOCTYPE html>') && !projTa.value.includes('<style'), 'Loyiha editori starter (HTML only) bilan boshlanadi');
  const starter = projTa.value;
  const styled = starter.replace('</head>', '<style>\nbody { background: #111827; color: white; }\n.card { padding: 20px; border-radius: 16px; background: #1f2937; }\n</style>\n</head>')
    .replace('</body>', '<script>\nconst btn = document.getElementById("contactBtn");\nbtn.addEventListener("click", function () { alert("Salom!"); });\n</script>\n</body>');
  projTa.value = styled;
  fire(projTa, 'input');
  await sleep(20);
  ok(doc.querySelector('#lsProjectPct').textContent === '100%', 'Checklist: 100% (' + doc.querySelector('#lsProjectPct').textContent + ')');
  ok(!doc.querySelector('#lsProjectParty').hidden, '100% da TABRIKLAYMIZ banner');
  ok(doc.getElementById('lsProjectChecklist').querySelectorAll('.ls-check-item.done').length === 10, '10/10 checklist ✅');
  ok(window.localStorage.getItem('ls_project_code_html-d5') === styled, 'Loyiha kodi localStoragega saqlandi');

  /* PROJECT EVALUATION → darsni yakunlash */
  let hookCount = 0, hookInfo = null;
  window.LessonsHooks.onLessonComplete.push(function (info) { hookCount++; hookInfo = info; });
  const fbSlot = doc.getElementById('lsExFb-l5project');
  click(wrap.querySelector('[data-ex-run="l5project"]'));
  ok(fbSlot.textContent.includes('Topshiriq bajarildi'), 'LOYIHA evaluation: 10/10 checks — bajarildi');
  ok(wrap.querySelector('#lsFinishProjectBtn') !== null, '«Loyihani yakunlash» tugmasi chiqdi');
  click(wrap.querySelector('#lsFinishProjectBtn'));
  await sleep(20);
  ok(wrap.textContent.includes('BIRINCHI SAYTING TAYYOR'), 'Success screen: 🎉 BIRINCHI SAYTING TAYYOR!');
  ok(wrap.textContent.includes('Keyingi darsga o‘tish'), 'Success screen: keyingi dars tugmasi');
  ok(hookCount === 1 && hookInfo.xp === 50 && hookInfo.coins === 50, 'Hook: xp=50, coins=50 (bir marta)');
  ok(testUser.coins === 50, '+50 Coin berildi');
  ok(wrap.textContent.includes('6-dars ochildi'), 'Keyingi dars unlock banner');

  /* XP BIR NECHA MAROTABA BERILMASLIGI */
  window.Lessons.openLesson('html', 'html-d5');
  await sleep(20);
  const wrap2 = doc.querySelector('#lsLessonContainer');
  const coinsBefore = testUser.coins;
  click(wrap2.querySelector('#lsFinishProjectBtn'));
  await sleep(20);
  ok(window.__itGetCurrentUser().coins === coinsBefore, 'Qayta yakunlashda coin IKKINCHI marta berilmadi');
  ok(hookCount === 1, 'Qayta yakunlashda hook ikkinchi marta chaqirilmadi');
  ok(wrap2.textContent.includes('BIRINCHI SAYTING TAYYOR'), 'Completed dars qayta ochilsa result phase ko\'rinadi');

  /* Darsga qaytish → read phase (o'yin/loyiha elementlari qaytadi) */
  click(wrap2.querySelector('#lsReviewLessonBtn'));
  await sleep(20);
  ok(doc.querySelector('[data-game-body="bughunter"]') !== null && doc.querySelector('#lsProject') !== null, 'Darsga qaytish: o\'yinlar + loyiha saqlangan');
  ok(doc.querySelectorAll('.ls-gh-gap, .ls-run-opt, .ls-mem-card').length > 10, 'Touch-friendly tugmalar render');

  console.log('\nconsole errors: ' + errors.length);
  errors.slice(0, 5).forEach(e => console.log('ERR: ' + e));
  console.log((failed === 0 && errors.length === 0) ? '\nLESSON5 PASSED' : '\nLESSON5 FAILED');
  process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
