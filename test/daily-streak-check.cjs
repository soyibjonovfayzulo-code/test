/* ============================================================
   ITTest — MOBILE KUNLIK REJIM + STREAK + STREAK FREEZE
   Runtime Smoke & Integration Test (jsdom)
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dsSrc = fs.readFileSync(path.join(root, 'daily-streak.js'), 'utf8');
const dashboardSrc = fs.readFileSync(path.join(root, 'dashboard.js'), 'utf8');
const lessonsDataSrc = fs.readFileSync(path.join(root, 'lessons-data.js'), 'utf8');
const lessonsAppSrc = fs.readFileSync(path.join(root, 'lessons-app.js'), 'utf8');

let fails = 0;
let passed = 0;
function ok(cond, msg) {
  if (cond) {
    passed++;
    console.log('  ✅ ' + msg);
  } else {
    fails++;
    console.error('  ❌ ' + msg);
  }
}

console.log('--- ITTEST MOBILE KUNLIK REJIM & STREAK FREEZE TEST ---\n');

// 1. Mobile environment setup (390px width)
const domMobile = new JSDOM(htmlSrc, {
  runScripts: 'outside-only',
  url: 'http://localhost/',
  pretendToBeVisual: true
});
const winM = domMobile.window;
winM.innerWidth = 390;
winM.innerHeight = 844;

// Mock user
const today = new Date();
const dayTs = (offset) => today.getTime() - offset * 86400000;
const dayKey = (ts) => {
  const d = new Date(ts || Date.now());
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

let testUser = {
  id: 'u1',
  firstname: 'Sardor',
  username: 'sardor',
  streak: 5,
  freezes: 2,
  lastActiveDay: dayKey(dayTs(1)), // kecha
  testResults: [],
  achievements: []
};

winM.__itGetCurrentUser = () => testUser;
winM.__itShowPage = (p) => { winM.__lastPage = p; };

// Load modules in mobile DOM
winM.eval(dsSrc);
winM.eval(lessonsDataSrc);
winM.eval(lessonsAppSrc);
winM.eval(dashboardSrc);

// TEST 10: Mobile detection vs Desktop
ok(winM.DailyStreak.isMobile() === true, 'TEST: Mobile (390px) isMobile() === true');

const domDesktop = new JSDOM(htmlSrc, {
  runScripts: 'outside-only',
  url: 'http://localhost/',
  pretendToBeVisual: true
});
const winD = domDesktop.window;
winD.innerWidth = 1440;
winD.innerHeight = 900;
winD.__itGetCurrentUser = () => testUser;
winD.eval(dsSrc);
ok(winD.DailyStreak.isMobile() === false, 'TEST 10: Desktop (1440px) isMobile() === false (no mobile flow)');

// TEST 6: New day -> new daily state
const store1 = winM.DailyStreak.getFullStore();
const recToday = winM.DailyStreak.getDayRecord(store1);
ok(recToday.date === dayKey(), 'TEST 6: Bugungi sana uchun yangi daily state yaratildi (' + recToday.date + ')');

// TEST 3 & 4: Lesson complete -> duplicate protection & NO celebration yet
winM.DailyStreak.recordActivity('lesson', { courseId: 'html', lessonId: 'html-d1', xp: 15 });
let storeUpdated = winM.DailyStreak.getFullStore();
let rec1 = winM.DailyStreak.getDayRecord(storeUpdated);
ok(rec1.lessonsCompleted === 1 && rec1.completedLessonIds.includes('html-d1'), 'TEST 3: 1-dars completion yozildi (lessonsCompleted=1)');
ok(winM.document.getElementById('dsCelebModal') === null, 'TEST 3B: Faqat dars tugaganda celebration CHIQMADI (celebration hali yo‘q)');

// Repeat same lesson completion today
winM.DailyStreak.recordActivity('lesson', { courseId: 'html', lessonId: 'html-d1', xp: 15 });
storeUpdated = winM.DailyStreak.getFullStore();
let rec2 = winM.DailyStreak.getDayRecord(storeUpdated);
ok(rec2.lessonsCompleted === 1, 'TEST 9: Bir xil dars qayta tugatilganda duplicate hisoblanmadi (lessonsCompleted=1)');

// TEST 4: Test complete after lesson -> Successful day -> celebration
winM.DailyStreak.onTestFinished({ subject: 'HTML', testId: 'HTML-beginner-1', score: 40, passed: true });
storeUpdated = winM.DailyStreak.getFullStore();
let rec3 = winM.DailyStreak.getDayRecord(storeUpdated);
ok(rec3.testsCompleted === 1 && rec3.completedTestIds.includes('HTML-beginner-1'), 'TEST 4A: Test completion daily recordga yozildi');
ok(rec3.celebrationShown === true, 'TEST 4B: celebrationShown = true belgilandi');

const celebEl = winM.document.getElementById('dsCelebModal');
ok(celebEl !== null, 'TEST 4C: Successful day bo‘lgach (lesson + test) Streak Celebration chiqdi');
ok(celebEl && celebEl.innerHTML.includes('ds-blue-flame'), 'TEST 4D: Celebrationda ITTest BLUE FLAME olovi mavjud');

// Dismiss celebration
if (celebEl) {
  celebEl.remove();
}

// TEST 5: Same day second lesson and test -> NO second celebration
winM.DailyStreak.recordActivity('lesson', { courseId: 'html', lessonId: 'html-d2', xp: 15 });
winM.DailyStreak.onTestFinished({ subject: 'HTML', testId: 'HTML-beginner-2', score: 40, passed: true });
const celebEl2 = winM.document.getElementById('dsCelebModal');
ok(celebEl2 === null, 'TEST 5: Bir kunda 2-dars va 2-test topshirilganda 2-marta celebration CHIQMADI (faqat 1 marta)');

// TEST 7: 1 Missed day + Freeze -> Streak preserved (1 freeze used)
const userG = {
  id: 'u_g',
  username: 'user_g',
  streak: 7,
  freezes: 2,
  lastActiveDay: dayKey(dayTs(2)) // 2 kun oldin (1 kun missed: kecha)
};
winM.__itGetCurrentUser = () => userG;
winM.DailyStreak.syncStreakAndFreezes(userG);
ok(userG.streak === 7, 'TEST 7: 1 kun missed bo‘lganda freeze ishlatilib streak (7) SAQLANDI');
ok(userG.freezes === 1, 'TEST 7B: 1 ta Freeze avtomatik ishlatildi (freezes: 1)');

// TEST: 2 Missed days + 2 Freezes -> Preserved (2 freezes used)
const userI = {
  id: 'u_i',
  username: 'user_i',
  streak: 10,
  freezes: 2,
  lastActiveDay: dayKey(dayTs(3)) // 3 kun oldin (2 kun missed)
};
winM.__itGetCurrentUser = () => userI;
winM.DailyStreak.syncStreakAndFreezes(userI);
ok(userI.streak === 10, 'TEST: 2 kun missed bo‘lganda 2 ta freeze ishlatilib streak (10) SAQLANDI');
ok(userI.freezes === 0, 'TEST: 2 ta Freeze ishlatildi (freezes: 0)');

// TEST 8: Miss next day with NO freeze -> Streak reset to 0
const userH = {
  id: 'u_h',
  username: 'user_h',
  streak: 7,
  freezes: 0,
  lastActiveDay: dayKey(dayTs(2)) // 2 kun oldin (1 kun missed), freeze yo'q
};
winM.__itGetCurrentUser = () => userH;
winM.DailyStreak.syncStreakAndFreezes(userH);
ok(userH.streak === 0, 'TEST 8: Freeze yo‘q bo‘lsa missed daydan keyin streak 0 ga RESET bo‘ldi');

// TEST: 3 Missed days + 2 Freezes -> 2 freezes used, 3rd day resets streak to 0
const userJ = {
  id: 'u_j',
  username: 'user_j',
  streak: 10,
  freezes: 2,
  lastActiveDay: dayKey(dayTs(4)) // 4 kun oldin (3 kun missed, 2 freeze bor)
};
winM.__itGetCurrentUser = () => userJ;
winM.DailyStreak.syncStreakAndFreezes(userJ);
ok(userJ.freezes === 0, 'TEST: Barcha 2 ta freeze ishlatildi');
ok(userJ.streak === 0, 'TEST: 3-kun freeze yetmaganligi sababli streak 0 ga RESET bo‘ldi');

// TEST: Data persistence
const storeSaved = winM.DailyStreak.getFullStore();
ok(storeSaved && typeof storeSaved.history === 'object', 'TEST: Store localStorage da saqlangan va qayta o‘qilmoqda');

// TEST: Lesson -> Test bridge function
const testBridged = winM.DailyStreak.openTestForCourse('html');
ok(testBridged === true, 'TEST: Lesson complete -> existing test bridge chaqirildi');

// TEST 1 & 2: Mobile Flow: Intro -> Permission -> Daily Main -> First lesson
let introDone = false;
winM.DailyStreak.showMobileIntro({ onDone: () => { introDone = true; } });
const introModal = winM.document.getElementById('dsIntroModal');
ok(introModal !== null, 'TEST 1: Mobile Daily Intro ekrani render bo‘ldi');
ok(introModal && introModal.innerHTML.includes('ds-blue-flame'), 'TEST 1B: Introda ITTest Blue Flame olovi bor');

// Next in Intro -> Permission Modal
const introBtn = introModal ? introModal.querySelector('#dsIntroNextBtn') : null;
if (introBtn) {
  introBtn.click();
}

setTimeout(() => {
  const permModal = winM.document.getElementById('dsPermModal');
  ok(permModal !== null, 'TEST 2A: Permission Modal render bo‘ldi');
  ok(permModal && permModal.textContent.includes('Har kuni eslatib turaymi?'), 'TEST 2B: Permission savoli to‘g‘ri');
  
  const allowBtn = permModal ? permModal.querySelector('#dsPermAllowBtn') : null;
  if (allowBtn) {
    allowBtn.click();
  }
  
  setTimeout(() => {
    const dailyMainModal = winM.document.getElementById('dsDailyMainModal');
    ok(dailyMainModal !== null, 'TEST 2C: Permissiondan so‘ng Daily Main Screen ochildi');
    ok(dailyMainModal && dailyMainModal.innerHTML.includes('ds-blue-flame'), 'TEST 2D: Daily Mainda ITTest Blue Flame olovi bor');
    
    const startLessonBtn = dailyMainModal ? dailyMainModal.querySelector('#dsStartFirstLessonBtn') : null;
    if (startLessonBtn) {
      startLessonBtn.click();
    }
    
    setTimeout(() => {
      ok(introDone === true, 'TEST 2E: 1-darsni boshlash bosilgach onDone callback chaqirildi (first lesson ochildi)');
      
      // Dashboard Streak render with freeze
      winM.ITDashboard.render();
      const streakBody = winM.document.getElementById('ndStreakBody');
      ok(streakBody && streakBody.innerHTML.includes('freeze'), 'Dashboardda freeze ko‘rsatildi');

      console.log('\n==========================================');
      console.log(fails === 0 ? 'ALL DAILY STREAK CHECKS PASSED ✅' : fails + ' CHECK(S) FAILED ❌');
      console.log('==========================================');
      process.exit(fails === 0 ? 0 : 1);
    }, 400);
  }, 400);
}, 400);
