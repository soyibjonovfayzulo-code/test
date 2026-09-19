/* TESTS + BACKEND INTEGRATSIYA — runtime smoke test (jsdom, haqiqiy SQLite bazasi)
   Run: node test/tests-backend-check.cjs
   1) /api/tests/questions (haqiqiy database.sqlite) frontendga yetib borishi
   2) DB'dan yangi qo'shilgan savollar yangi test sifatida paydo bo'lishi
   3) Unlock-zanjiri dinamik kengayishi
   4) Backend OFFLINE bo'lganda statik JSON fallback regressiyasiz ishlashi */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const sqlite3 = require('sqlite3').verbose();

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptSrc = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  \u2705 ' + label); }
  else { failed++; console.log('  \u274c ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function readDbQuestions() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path.join(root, 'server', 'database.sqlite'));
    db.all('SELECT subject, difficulty, question, options, correct_index, explanation FROM test_questions WHERE published = 1', (e, rows) => {
      db.close();
      if (e) return reject(e);
      resolve(rows.map(r => ({
        id: 0, subject: r.subject, difficulty: r.difficulty,
        q: r.question, o: JSON.parse(r.options), c: r.correct_index, e: r.explanation
      })));
    });
  });
}

function makeDom(fetchShim) {
  const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:5178/' });
  const w = dom.window;
  w.console.warn = () => {}; /* [TEST WARN] shovqinini o'chirish */
  w.fetch = fetchShim;
  w.AbortController = w.AbortController || global.AbortController;
  w.Lessons = { handlePage: () => {} };
  w.ITMascot = { html: () => '<div class="mascot mascot--idle"></div>', inject: () => {}, setState: () => {}, setStateIn: () => {}, showXP: () => {}, say: () => {} };
  w.scrollTo = () => {};
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
  w.localStorage.setItem('currentUser', JSON.stringify({ id: 'u1' }));
  w.eval(scriptSrc);
  w.document.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true }));
  return w;
}

/* fetch shim: statik fayllar diskdan, /api/* berilgan massivdan */
function makeShim(apiRows, apiWorks) {
  return (p) => {
    const url = new URL(p, 'http://localhost:5178/');
    if (url.pathname === '/api/tests/questions') {
      if (!apiWorks) return Promise.reject(new Error('mock: server offline'));
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(apiRows) });
    }
    try {
      const file = path.join(root, url.pathname.replace(/^\//, ''));
      const body = fs.readFileSync(file, 'utf8');
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(body)) });
    } catch (e) {
      return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('not found')) });
    }
  };
}

async function waitBank(w, timeoutMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const all = w.__itGetAllTests();
    if (all.Python && all.Python.length > 0) return true;
    await sleep(50);
  }
  return false;
}

function click(w, el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); }

(async () => {
  const dbRows = await readDbQuestions();
  section('DB');
  ok(Array.isArray(dbRows) && dbRows.length >= 800, `Bazadan ${dbRows.length} ta published savol o'qildi`);

  /* ======== SCENARIO A: backend ONLINE + 10 ta yangi admin savoli ======== */
  console.log('\n===== SCENARIO A: Backend online (haqiqiy DB + 10 yangi savol) =====');
  {
    const freshRows = dbRows.concat(Array.from({ length: 10 }, (_, i) => ({
      subject: 'Python', difficulty: 'beginner',
      q: `DBTEST: yangi admin savoli #${i + 1} bazadan keldimi?`,
      o: [`A${i}`, `B${i}`, `C${i}`, `D${i}`], c: i % 4, e: 'Admin panel orqali qoshilgan.'
    })));
    const w = makeDom(makeShim(freshRows, true));

    ok(await waitBank(w, 8000), 'Question bank yuklandi');
    const all = w.__itGetAllTests();

    const pyB = (all.Python || []).filter(t => t.difficulty === 'beginner');
    ok(pyB.length === 4, 'Python beginner: 3 (JSON) + 1 (yangi DB chunk) = 4 ta test', 'aslida: ' + pyB.length);
    ok((all.Python || []).length === 10, 'Python jami 10 ta test (4+3+3)', 'aslida: ' + (all.Python || []).length);

    const t4 = w.__itFindTestById('Python-beginner-4');
    ok(!!t4, 'Python-beginner-4 testi bazadan yaratildi');
    ok(!!t4 && t4.questions.some(q => String(q.q).includes('DBTEST')), 'Yangi test ichida DB savollari bor');

    const order = w.__itGetSubjectTestOrder('Python');
    ok(order.includes('Python-beginner-4'), 'Unlock-zanjiri dinamik kengaydi (Python-beginner-4 orderda)');

    /* Regressiya: boshqa fanlar o'zgarmasligi kerak */
    ok((all.HTML || []).length === 9, 'HTML: regressiya yoq (9 ta test, 3+3+3)', 'aslida: ' + (all.HTML || []).length);
    ok((all.JavaScript || []).length === 9, 'JavaScript: regressiya yoq (9 ta test)', 'aslida: ' + (all.JavaScript || []).length);
    ok((all['C++'] || []).length === 9, 'C++: regressiya yoq (9 ta test)', 'aslida: ' + (all['C++'] || []).length);

    /* UI: testlist render */
    w.__itOpenSubjectTests('Python');
    const items = w.document.querySelectorAll('#testListContainer .test-list-item');
    ok(items.length === 10, 'Testlist sahifasida 10 ta test qatori render boldi', 'aslida: ' + items.length);

    /* UI: fan kartalari (page-tests) */
    w.__itShowPage('tests');
    const cards = w.document.querySelectorAll('#testsGrid .test-card');
    ok(cards.length === 9, 'Tests sahifasida 9 ta fan kartasi', 'aslida: ' + cards.length);

    ok(w.__itGetBankState().backend.loaded === true, 'QBANK_LOADING.backend.loaded = true');
  }

  /* ======== SCENARIO B: backend OFFLINE (fallback) ======== */
  console.log('\n===== SCENARIO B: Backend offline (statik JSON fallback) =====');
  {
    const w = makeDom(makeShim([], false));
    ok(await waitBank(w, 8000), 'Fallback: JSON bank yuklandi (crash yoq)');
    const all = w.__itGetAllTests();
    ok((all.Python || []).length === 9, 'Python: 9 ta test (3+3+3) — regressiya yoq', 'aslida: ' + (all.Python || []).length);
    ok(w.__itGetBankState().backend.error !== null, 'Backend xatosi holatda qayd etildi');
    /* SQL fallback bankida avvaldan 2 manba (JSON + hardcoded) mavjud — bu
       o'zgartirish bilan bogliq emas, shuning uchun count dinamik tekshiriladi */
    const sqlCount = (all.SQL || []).length;
    ok(sqlCount > 0, 'SQL: fallback testlar saqlanib qoldi (' + sqlCount + ' ta)');
    w.__itOpenSubjectTests('SQL');
    const items = w.document.querySelectorAll('#testListContainer .test-list-item');
    ok(items.length === sqlCount, 'Fallback rejimda testlist toliq render boldi', 'aslida: ' + items.length + ' / kutilgan: ' + sqlCount);
  }

  /* ======== SCENARIO C: empty state + retry tugmasi ======== */
  console.log('\n===== SCENARIO C: Empty state + Retry tugmasi =====');
  {
    const w = makeDom(makeShim(dbRows, true));
    let loaded = false;
    for (let i = 0; i < 100; i++) { if (w.__itGetBankState().loaded) { loaded = true; break; } await sleep(50); }
    ok(loaded, 'Bank toliq yuklandi (loaded = true)');
    w.__itOpenSubjectTests('MavjudEmasFan');
    const retry = w.document.querySelector('#testListContainer .bank-retry-btn');
    ok(!!retry, 'Empty state uchun "Qayta urinib korish" tugmasi render boldi');
  }

  console.log('\n===== NATIJA =====');
  console.log(`Passed: ${passed} | Failed: ${failed}`);
  process.exit(failed === 0 ? 0 : 1);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });