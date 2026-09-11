/* YANGI DASHBOARD — runtime smoke test (jsdom) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
// Faqat dashboard section'ni olamiz
const sec = html.match(/<section id="page-dashboard"[\s\S]*?<\/section>\s*\n\s*<!-- TESTS PAGE -->/);
if (!sec) { console.error('FAIL: page-dashboard topilmadi'); process.exit(1); }

const dom = new JSDOM('<!DOCTYPE html><html><body>' + sec[0].replace('<!-- TESTS PAGE -->', '') + '</body></html>', { runScripts: 'outside-only', url: 'http://localhost/' });
const { window } = dom;

// --- mock real data ---
const today = new Date();
const dayTs = (offset) => today.getTime() - offset * 86400000;
window.__itGetCurrentUser = () => ({
  id: 'u1', firstname: 'Ahatjon', username: 'ahat', avatar: '🤖',
  xp: 320, points: 320, level: 4, streak: 3, lastActiveDay: null,
  testResults: [{ timestamp: dayTs(0), subject: 'HTML', title: 'Test 1', score: 20, percent: 80, passed: true, durationSec: 300 }],
  duelHistory: [{ timestamp: dayTs(1), subject: 'CSS', winStatus: 'win', score1: 4, score2: 2, durationSec: 120 }],
  duelWins: 2, duelTotal: 5, achievements: ['first_test']
});
window.__itShowPage = (p) => { window.__lastPage = p; };

const course = {
  id: 'html', name: 'HTML', icon: '🌐', lessonCount: 10,
  lessons: Array.from({ length: 10 }, (_, i) => ({ id: 'html-d' + (i + 1), number: i + 1, title: 'Dars mavzusi ' + (i + 1), duration: 10 + i, xp: 10 + i * 2 }))
};
window.CoursesAPI = {
  listCourses: () => [course],
  getCourse: (id) => (id === 'html' ? course : null),
  findLesson: (cid, lid) => {
    const idx = course.lessons.findIndex(l => l.id === lid);
    return idx === -1 ? null : { course, lesson: course.lessons[idx], index: idx };
  }
};
window.Lessons = { openLesson: (cid, lid) => { window.__lastLesson = cid + '/' + lid; } };
window.ITMascot = { html: () => '<div class="mascot mascot--idle"></div>', setStateIn: () => {} };

// darslar progress: d1-d2 tugallangan (d1 2 kun oldin, d2 bugun)
window.localStorage.setItem('darslar_state_v1::ahat', JSON.stringify({
  levels: { html: 'intermediate' },
  progress: { html: { completed: { 'html-d1': { at: dayTs(2), score: 10 }, 'html-d2': { at: Date.now(), score: 10 } }, lastLessonId: 'html-d2', lastVisit: dayTs(0) } }
}));

// --- dashboard.js ni yuklash ---
const code = fs.readFileSync(path.join(root, 'dashboard.js'), 'utf8');
window.eval(code);
window.ITDashboard.render();

const $ = (s) => window.document.querySelector(s);
let fails = 0;
function ok(cond, msg) {
  if (cond) console.log('  ✅ ' + msg);
  else { console.error('  ❌ ' + msg); fails++; }
}

console.log('--- YANGI DASHBOARD CHECK ---');
ok($('#ndHeroName') && $('#ndHeroName').textContent === 'Ahatjon', 'Hero real ism: Ahatjon');
ok($('#ndHeroLevel').textContent === 'Level 4', 'Level badge: Level 4');
ok($('#ndHeroXpText').textContent.includes('20 / 100'), 'XP text: 20/100 (real 320%100)');
ok($('#ndHeroRobot').innerHTML.includes('mascot'), 'Hero robot inject');
ok($('#ndStreakBody').textContent.includes('3'), 'Streak: 3 kun (real)');
ok($('#ndWeek') || window.document.querySelector('.nd-week'), 'Hafta kunlari Du/Se/Ch render');
ok(window.document.querySelectorAll('.nd-day').length === 7, '7 ta hafta kuni');
ok($('#ndLessonBody').textContent.includes('3-dars'), 'Current lesson: 3-dars (1-dars hardcode EMAS)');
ok($('#ndLessonBody').textContent.includes('Davom ettirish'), 'Continue tugmasi');
ok($('#ndTodayBody').textContent.length > 50, 'Bugungi progress render (bugun: 1 dars + 1 test)');
ok($('#ndTodayBody').textContent.includes('daqiqa'), 'Bugungi daqiqalar (real durationSec)');
ok($('#ndTestsBody').textContent.includes('Bugun') && $('#ndTestsBody').textContent.includes('1 ta test'), 'Testlar: bugun 1 ta (real)');
ok($('#ndDuelBody').textContent.includes('2'), 'Duel g\'alabalar: 2 (real)');
ok($('#ndStatsBody').textContent.includes('320'), 'Stats XP: 320 (real)');
ok($('#ndStatsBody').textContent.includes('1'), 'Stats yutuq: 1 (real)');
ok($('#ndGoalBody').textContent.includes('Level 4') && $('#ndGoalBody').textContent.includes('80'), 'Next goal: Level 5 gacha 80 XP');
ok($('#ndActivityBody').textContent.includes('Test bajarildi') || $('#ndActivityBody').textContent.includes('tugatildi'), 'Activity feed (real eventlar)');
ok(window.document.querySelectorAll('[data-goto]').length >= 6, 'Quick actionlar (dead button yo\'q)');

// Quick action navigation
const testsBtn = window.document.querySelector('[data-goto="tests"]');
testsBtn.click();
ok(window.__lastPage === 'tests', 'Quick action → tests sahifasi');

// Continue lesson button
const contBtn = window.document.querySelector('#ndLessonBody [data-open-lesson]');
contBtn.click();
ok(window.__lastLesson === 'html/html-d3', 'Continue → openLesson(html, 3-dars)');

// Challenge
ok($('#ndChallengeBody').textContent.includes('darsni yakunlang'), 'Challenge card render (real kurs/dars)');

// Empty state (yangi user)
window.__itGetCurrentUser = () => ({ firstname: 'Yangi', username: 'new', xp: 0, points: 0, level: 1, streak: 0, lastActiveDay: null, testResults: [], duelHistory: [], duelWins: 0, duelTotal: 0, achievements: [] });
window.localStorage.setItem('darslar_state_v1::new', JSON.stringify({ levels: {}, progress: {} }));
window.ITDashboard.render();
ok($('#ndTodayBody').textContent.includes('ajoyib kun'), 'Yangi user empty state');
ok($('#ndActivityBody').textContent.includes('Hali faoliyat yo‘q'), 'Activity empty state');
ok($('#ndLessonBody').textContent.includes('Boshlash'), 'Yangi user: 1-dars "Boshlash"');

console.log(fails === 0 ? '\nALL CHECKS PASSED ✅' : '\n' + fails + ' CHECK(S) FAILED ❌');
process.exit(fails === 0 ? 0 : 1);