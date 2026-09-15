/* WIDGET SYNC — runtime check (jsdom)
   widget-sync.js real state'ni to'g'ri hisoblayotganini va
   native bridge'ga to'g'ri yuborayotganini tekshiradi. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'widget-sync.js'), 'utf8');

const today = new Date();
const dayKey = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const todayKey = dayKey(today);
const dayTs = (offset) => today.getTime() - offset * 86400000;

let fails = 0;
function ok(cond, msg) {
  if (cond) console.log('  ✅ ' + msg);
  else { console.error('  ❌ ' + msg); fails++; }
}

const course = {
  id: 'html', name: 'HTML', icon: '🌐', lessonCount: 10,
  lessons: Array.from({ length: 10 }, (_, i) => ({ id: 'html-d' + (i + 1), number: i + 1, title: 'Mavzu ' + (i + 1), duration: 10, xp: 10 }))
};
const coursesAPI = {
  listCourses: () => [course],
  getCourse: (id) => (id === 'html' ? course : null),
  findLesson: (cid, lid) => {
    const idx = course.lessons.findIndex(l => l.id === lid);
    return idx === -1 ? null : { course, lesson: course.lessons[idx], index: idx };
  }
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  /* ============ 1. NATIVE MUHIT — real state sync ============ */
  console.log('\n[1] Native (Capacitor Android) — real state sync');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'outside-only', url: 'http://localhost/' });
  const { window } = dom;

  const pushed = [];
  let clearedPending = 0;
  window.Capacitor = {
    isNativePlatform: () => true,
    Plugins: {
      ITWidget: {
        updateWidget: (args) => { pushed.push(args.state); },
        getPendingAction: async () => ({ action: 'open_lesson' }),
        clearPendingAction: async () => { clearedPending++; }
      }
    }
  };
  window.__itGetCurrentUser = () => ({
    id: 'u1', username: 'ahat', streak: 3, freezes: 1, lastActiveDay: todayKey
  });
  window.__itShowPage = (p) => { window.__lastPage = p; };
  window.CoursesAPI = coursesAPI;

  /* real daily store: bugun 12/15 min -> 80% */
  window.localStorage.setItem('daily_state_v1::ahat', JSON.stringify({
    settings: { dailyGoalMinutes: 15 },
    history: {
      [todayKey]: { date: todayKey, learningMinutes: 12, lessonsCompleted: 1, testsCompleted: 0, xpEarned: 10, goalMinutes: 15 }
    }
  }));
  /* real darslar store: d1-d2 tugallangan, current = d3 */
  window.localStorage.setItem('darslar_state_v1::ahat', JSON.stringify({
    levels: { html: 'beginner' },
    progress: { html: { completed: { 'html-d1': { at: dayTs(1) }, 'html-d2': { at: dayTs(0) } }, lastLessonId: 'html-d2', lastVisit: dayTs(0) } }
  }));

  window.eval(code);
  const ITWidgetSync = window.ITWidgetSync;
  ok(!!ITWidgetSync && typeof ITWidgetSync.schedule === 'function', 'widget-sync yuklandi + ITWidgetSync expose qilindi');
  await sleep(50);


  ok(pushed.length >= 1, 'init paytida updateWidget chaqirildi (' + pushed.length + ' marta)');
  const s = pushed[0] || {};
  ok(s.hasData === true, 'hasData: true (login user)');
  ok(s.streak === 3, 'streak REAL qiymat: 3 (fake 7 EMAS)');
  ok(s.freezes === 1, 'freezes: 1');
  ok(s.progressPct === 80, 'daily progress REAL: 12/15 min = 80% (fake EMAS)');
  ok(s.goalMinutes === 15 && s.minutesDone === 12, 'minutesDone/goalMinutes real: 12/15');
  ok(s.hasLesson === true && s.lessonCourse === 'HTML' && s.lessonNumber === 3, 'current lesson REAL: HTML — 3-dars (resume mantiqi)');
  ok(s.date === todayKey, 'sana: real local date (' + todayKey + ')');
  ok(window.__lastPage === 'lessons', 'widget click pending action: app lessons sahifasiga o‘tdi');
  ok(clearedPending === 1, 'pending action bir martalik (clear qilindi)');

  /* LARGE widget uchun real daily activity + week */
  ok(s.lessonsToday === 1 && s.testsToday === 0, 'lessonsToday/testsToday real: 1/0');
  ok(s.xpToday === 10, 'xpToday real: 10');
  ok(s.goalCompleted === false, 'goalCompleted false (12/15)');
  ok(Array.isArray(s.week) && s.week.length === 7, 'week: 7 kunlik row');
  const todayIdx = (new Date().getDay() + 6) % 7; /* Monday=0 */
  ok(s.week[todayIdx] === 'completed', 'week: bugun (1 dars tugatilgan) -> completed status');

  /* freeze used bugun -> freezeUsedToday + week freeze */
  window.localStorage.setItem('daily_state_v1::ahat', JSON.stringify({
    settings: { dailyGoalMinutes: 15 },
    history: {
      [todayKey]: { date: todayKey, learningMinutes: 0, freezeUsed: true, goalMinutes: 15 }
    }
  }));
  ITWidgetSync.push();
  const sf = pushed[pushed.length - 1];
  ok(sf.freezeUsedToday === true, 'freezeUsedToday: true (freeze kun)');
  ok(sf.week[todayIdx] === 'freeze', 'week: bugun -> freeze status');

  /* hafta ortasidagi completed kun -> week completed */
  const mondayTs = new Date().setHours(12, 0, 0, 0) - todayIdx * 86400000;
  const doneDay = dayKey(new Date(mondayTs));
  window.localStorage.setItem('daily_state_v1::ahat', JSON.stringify({
    settings: { dailyGoalMinutes: 15 },
    history: {
      [todayKey]: { date: todayKey, learningMinutes: 12, lessonsCompleted: 1, testsCompleted: 0, xpEarned: 10, goalMinutes: 15 },
      [doneDay]: { date: doneDay, learningMinutes: 15, streakEligible: true, goalMinutes: 15 }
    }
  }));
  ITWidgetSync.push();
  const sw = pushed[pushed.length - 1];
  ok(sw.week[0] === 'completed', 'week: dushanba completed (real history)');
  ok(sw.week[todayIdx] === 'completed', 'week: bugun completed (streakEligible)');

  /* debounce: state o'zgarsa -> schedule 1 push qiladi */
  window.__itGetCurrentUser = () => ({
    id: 'u1', username: 'ahat', streak: 4, freezes: 1, lastActiveDay: todayKey
  });
  const before = pushed.length;
  ITWidgetSync.schedule();
  await sleep(350);
  ok(pushed.length === before + 1 && pushed[pushed.length - 1].streak === 4, 'state o‘zgarsa debounce -> 1 push, streak 4');
  /* o'zgarmagan state -> push bo'lmaydi (battery tejash) */
  const before2 = pushed.length;
  ITWidgetSync.schedule();
  await sleep(350);
  ok(pushed.length === before2, 'o‘zgarmagan state push qilinmaydi (battery friendly)');

  /* yangi kun: bugungi record yo'q -> progress 0%, streak saqlanadi */
  window.__itGetCurrentUser = () => ({
    id: 'u1', username: 'ahat', streak: 3, freezes: 1, lastActiveDay: todayKey
  });
  window.localStorage.setItem('daily_state_v1::ahat', JSON.stringify({
    settings: { dailyGoalMinutes: 15 },
    history: {
      [dayKey(new Date(dayTs(1)))]: { date: dayKey(new Date(dayTs(1))), learningMinutes: 15, lessonsCompleted: 1, testsCompleted: 1, xpEarned: 20, goalMinutes: 15 }
    }
  }));
  ITWidgetSync.push();
  const s2 = pushed[pushed.length - 1];
  ok(s2.progressPct === 0 && s2.minutesDone === 0, 'new day (bugungi record yo‘q): progress 0% — stale qiymat YO‘Q');
  ok(s2.streak === 3, 'new day: streak real qiymatda qoladi (3)');

  /* hech narsa boshlanmagan: birinchi mavjud dars */
  window.localStorage.setItem('darslar_state_v1::ahat', JSON.stringify({ levels: {}, progress: {} }));
  ITWidgetSync.push();
  const s3 = pushed[pushed.length - 1];
  ok(s3.hasLesson === true && s3.lessonNumber === 1, 'boshlamagan user: birinchi mavjud dars (HTML — 1-dars)');

  /* barchasi tugallangan */
  const doneMap = {};
  course.lessons.forEach(l => { doneMap[l.id] = { at: Date.now(), score: 10 }; });
  window.localStorage.setItem('darslar_state_v1::ahat', JSON.stringify({
    levels: {}, progress: { html: { completed: doneMap, lastLessonId: 'html-d10', lastVisit: dayTs(0) } }
  }));
  ITWidgetSync.push();
  const s4 = pushed[pushed.length - 1];
  ok(s4.allDone === true, 'barcha darslar tugallangan: allDone=true');

  /* ============ 2. BRAUZER (non-native) — noop ============ */
  console.log('\n[2] Brauzer (non-native) — sync noop bo‘lishi kerak');
  const dom2 = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'outside-only', url: 'http://localhost/' });
  const w2 = dom2.window;
  let browserPushed = 0;
  w2.Capacitor = {
    isNativePlatform: () => false,
    Plugins: { ITWidget: { updateWidget: () => { browserPushed++; } } }
  };
  w2.eval(code);
  w2.ITWidgetSync.push();
  await sleep(50);
  ok(browserPushed === 0, 'brauzerda native widget update CHAQIRILMAYDI (noop)');

  console.log('');
  if (fails === 0) { console.log('✅ BARCHA WIDGET-SYNC CHECKLAR OTDI'); process.exit(0); }
  else { console.error('❌ ' + fails + ' check FAILED'); process.exit(1); }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
