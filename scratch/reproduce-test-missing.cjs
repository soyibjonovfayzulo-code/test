const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

const ROOT = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
const packageJson = require(path.join(ROOT, 'package.json'));

const dom = new JSDOM(`<!DOCTYPE html><html data-theme="dark"><head><meta charset="utf-8"></head><body>
  <div id="app"></div>
  <section class="page" id="page-dashboard"></section>
  <section class="page" id="page-tests">
    <input type="hidden" id="testSearch" value="" />
    <div id="testsGrid"></div>
  </section>
  <section class="page" id="page-testlist"></section>
  <section class="page" id="page-quiz"></section>
  <section class="page" id="page-lessons"></section>
  <div id="ih-bottomnav"></div>
</body></html>`, {
  url: 'http://localhost:3000/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.fetch = dom.window.fetch = (u, o) => {
  const s = String(u);
  if (s.includes('/api/tests/questions')) {
    return Promise.resolve(new dom.window.Response(
      JSON.stringify(Array.from({ length: 810 }, (_, i) => ({
        id: i + 1,
        subject: ['Python','JavaScript','Java','C++','C#','HTML','CSS','SQL','AI'][Math.floor(i / 90)],
        difficulty: ['beginner','intermediate','advanced'][Math.floor((i % 90) / 30)],
        q: 'q' + i,
        question: 'question ' + i,
        o: ['a','b','c','d'],
        options: ['a','b','c','d'],
        c: i % 4,
        answer: i % 4,
        e: 'ok',
        explanation: 'ok',
        published: 1,
      }))),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
  }
  if (s.startsWith('/data/') || s.includes('/data/')) {
    return Promise.resolve(new dom.window.Response('[]', { status: 200 }));
  }
  return Promise.resolve(new dom.window.Response('null', { status: 404 }));
};

dom.window.eval(fs.readFileSync(path.join(ROOT, 'lessons-data.js'), 'utf8'));
dom.window.eval(`
  window.__itGetCurrentUser = function() {
    return {
      id: 1, username: 'u1', firstname: 'Admin', email: 'a@a.a', password: null,
      xp: 280, points: 280, level: 3, streak: 5, lastActiveDay: '2026-09-19',
      onboardingPending: true, freezes: 2, testResults: [], duelHistory: [], duelWins: 0, duelTotal: 0,
      achievements: [], friends: [], gifts: [], giftHistory: [], equipped: {}, inventory: {},
    };
  };
  window.__itShowPage = function() {};
  window.__itConfetti = function() {};
  window.CoursesAPI;
`);

console.log('=== Gipoteza 2: Promise ordering race (ALL_TESTS SYNC vs ASYNC) ===');
console.log('[BEFORE script.js eval]');

const preAllTestsKeys = dom.window.eval('typeof ALL_TESTS === "undefined" ? "undefined" : Object.keys(ALL_TESTS).length');
console.log('ALL_TESTS before script.js:', preAllTestsKeys);

dom.window.eval(script);

const syncAfterKeys = dom.window.eval('typeof ALL_TESTS === "undefined" ? "undefined" : Object.keys(ALL_TESTS).length');
const syncEntries = dom.window.eval(`
  const map = {};
  Object.keys(ALL_TESTS || {}).forEach(k => {
    const perSubj = ALL_TESTS[k] || [];
    const perDiff = {};
    perSubj.forEach(t => { perDiff[t.difficulty] = (perDiff[t.difficulty] || 0) + 1; });
    map[k] = { total: perSubj.length, perDiff };
  });
  JSON.stringify(map);
`);
console.log('ALL_TESTS AFTER sync top-level L769 rebuildAllTests() keys:', syncAfterKeys);
console.log('SYNC (FALLBACK only) ALL_TESTS:', JSON.stringify(JSON.parse(syncEntries), null, 2));
console.log('QBANK_LOADING.loaded:', dom.window.eval('QBANK_LOADING.loaded'));
console.log('QBANK_LOADING.backend:', dom.window.eval('JSON.stringify(QBANK_LOADING.backend)'));

setTimeout(() => {
  const afterAsync = dom.window.eval(`
    const map = {};
    Object.keys(ALL_TESTS || {}).forEach(k => {
      const perSubj = ALL_TESTS[k] || [];
      const perDiff = {};
      perSubj.forEach(t => { perDiff[t.difficulty] = (perDiff[t.difficulty] || 0) + 1; });
      map[k] = { total: perSubj.length, perDiff };
    });
    JSON.stringify({
      qbankLoaded: QBANK_LOADING.loaded,
      backendError: QBANK_LOADING.backend && QBANK_LOADING.backend.error,
      backendCount: QBANK_LOADING.backend && QBANK_LOADING.backend.count,
      keys: Object.keys(ALL_TESTS).length,
      perSubject: map,
    });
  `);
  console.log('\n[2000MS AFTER] QBANK async resolve:');
  const obj = JSON.parse(afterAsync);
  console.log('  qbankLoaded    :', obj.qbankLoaded);
  console.log('  backendError   :', obj.backendError);
  console.log('  backendCount   :', obj.backendCount);
  console.log('  ALL_TESTS keys :', obj.keys);
  console.log('  perSubject     :');
  Object.keys(obj.perSubject).forEach((k) => {
    const s = obj.perSubject[k];
    const pd = Object.entries(s.perDiff).map(([d, n]) => d + '=' + n).join(', ');
    console.log('   ', k.padEnd(12), 'total=' + s.total, '|', pd || '(empty)');
  });

  console.log('\n=== Gipoteza 1: #testSearch type=hidden ===');
  const searchInput = document.getElementById('testSearch');
  console.log('  testSearch exists:', !!searchInput);
  console.log('  testSearch type :', searchInput ? searchInput.getAttribute('type') : null);
  console.log('  testSearch visible? (type !== hidden):', searchInput ? searchInput.getAttribute('type') !== 'hidden' : null);

  console.log('\n=== Gipoteza 3: filter chip subset (dev/web/it) SUBJECTS count ===');
  const chipInfo = dom.window.eval(`JSON.stringify({
    SUBJECTS: SUBJECTS.map(s => s.name),
    FILTERS_DEV:  ['Python','Java','C++','C#'],
    FILTERS_WEB:  ['HTML','CSS','JavaScript','React','Node.js'],
    FILTERS_IT:   ['SQL','AI'],
  })`);
  const info = JSON.parse(chipInfo);
  console.log('  ALL subjects:', info.SUBJECTS.join(', '), '=', info.SUBJECTS.length);
  console.log('  dev subset  :', info.FILTERS_DEV.join(', '), '=', info.FILTERS_DEV.length, '(missing:', info.SUBJECTS.filter(s=>!info.FILTERS_DEV.includes(s)).join(', ') || 'none', ')');
  console.log('  web subset  :', info.FILTERS_WEB.join(', '), '=', info.FILTERS_WEB.length, '(missing:', info.SUBJECTS.filter(s=>!info.FILTERS_WEB.includes(s)).join(', ') || 'none', ')');
  console.log('  it subset   :', info.FILTERS_IT.join(', '), '=', info.FILTERS_IT.length, '(missing:', info.SUBJECTS.filter(s=>!info.FILTERS_IT.includes(s)).join(', ') || 'none', ')');

  console.log('\n=== TEST SUMMARY: 3 gipoteza holati ===');
  const g2 = Object.values(obj.perSubject).some(s => s.total < 9) ? '⚠️ RACE: Some subjects < 9 tests SYNC state' : '✅ 9 tests/subject async OK';
  console.log('G1 (hidden search UI):', searchInput && searchInput.getAttribute('type') === 'hidden' ? '⚠️ SEARCH INPUT HIDDEN — user search qila olmaydi' : '✅ search visible');
  console.log('G2 (sync vs async ALL_TESTS race):', g2);
  const subjsWithSmallSync = Object.entries(JSON.parse(syncEntries)).filter(([k, v]) => v.total < 9).map(([k]) => k);
  if (subjsWithSmallSync.length) {
    console.log('   → SYNC (FALLBACK only) < 9 test fans:', subjsWithSmallSync.join(', '));
  }
  console.log('G3 (subset filter empty confusions): ⚠️ DEV 4/9, WEB 5/9, IT 2/9 subset → user "barchasi" tanlamasa ½ fan chiqmaydi = empty confusion');
  process.exit(0);
}, 2000);
