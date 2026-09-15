/* ============================================================
   ITTest — WIDGET STATE SYNC (real state -> Android widget)
   Source of truth: DailyStreak store + user object + darslar
   store. Fake/demo data YO'Q. Faqat native (Capacitor Android)
   muhitda ishlaydi — brauzerda noop.
   ============================================================ */

(function () {
  'use strict';

  var DAILY_KEY = 'daily_state_v1';
  var LESSON_KEY = 'darslar_state_v1';
  var _timer = null;
  var _lastJson = '';

  function isNative() {
    try {
      return !!(window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform());
    } catch (e) { return false; }
  }

  function plugin() {
    try {
      return window.Capacitor && window.Capacitor.Plugins
        ? window.Capacitor.Plugins.ITWidget : null;
    } catch (e) { return null; }
  }

  function dayKey(ts) {
    var d = ts ? new Date(ts) : new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function currentUser() {
    try {
      return (typeof window.__itGetCurrentUser === 'function')
        ? window.__itGetCurrentUser() : null;
    } catch (e) { return null; }
  }

  function userKey() {
    var u = currentUser();
    return String((u && (u.username || u.email || u.id)) || 'guest').toLowerCase();
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      var v = raw ? JSON.parse(raw) : null;
      return (v && typeof v === 'object') ? v : null;
    } catch (e) { return null; }
  }

  /* Joriy dars — lessons-app.js'dagi resumeLesson bilan BIR XIL mantiq.
     Ikkinchi nusxa state EMAS — bir xil store'dan o'qiydi. */
  function computeCurrentLesson(api, progress) {
    var courses = api.listCourses() || [];
    var best = null;
    Object.keys(progress).forEach(function (cid) {
      var prog = progress[cid] || {};
      var course = api.getCourse(cid);
      if (!course) return;
      if (Object.keys(prog.completed || {}).length >= course.lessonCount) return;
      if (!best || (prog.lastVisit || 0) > (progress[best].lastVisit || 0)) best = cid;
    });
    var cid = best;
    if (!cid) {
      for (var i = 0; i < courses.length; i++) {
        var p = progress[courses[i].id] || {};
        if (Object.keys(p.completed || {}).length === 0) { cid = courses[i].id; break; }
      }
      if (!cid) cid = courses.length ? courses[0].id : null;
    }
    if (!cid) return { allDone: true };
    var course = api.getCourse(cid);
    var prog = progress[cid] || {};
    var done = prog.completed || {};
    var resume = null;
    if (prog.lastLessonId) {
      var idx = course.lessons.findIndex(function (l) { return l.id === prog.lastLessonId; });
      if (idx !== -1) {
        var last = course.lessons[idx];
        if (!done[last.id]) resume = last;
        else {
          var next = course.lessons[idx + 1];
          if (next && !done[next.id]) resume = next;
        }
      }
    }
    if (!resume) {
      resume = course.lessons.find(function (l) { return !done[l.id]; }) || null;
    }
    if (!resume) return { allDone: true };
    return { course: course.name, number: resume.number, title: resume.title };
  }

  /* Haftalik row (Du..Ya) — daily-streak.js getWeekDaysData bilan BIR XIL mantiq.
     Statuslar: completed | today | future | missed | freeze | empty */
  function computeWeek(store) {
    var WEEK_LABELS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    var now = new Date();
    now.setHours(12, 0, 0, 0);
    var monday = new Date(now);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    var todayDk = dayKey(now.getTime());
    var days = [];

    for (var d = 0; d < 7; d++) {
      var ts = monday.getTime() + d * 86400000;
      var dk = dayKey(ts);
      var rec = (store && store.history && store.history[dk]) || null;
      var isToday = (dk === todayDk);
      var isPast = ts < now.getTime() && !isToday;
      var isFuture = ts > now.getTime() && !isToday;

      var status = 'empty';
      if (rec && rec.freezeUsed) status = 'freeze';
      else if (rec && (rec.streakEligible || rec.lessonsCompleted > 0 || rec.testsCompleted > 0)) status = 'completed';
      else if (rec && rec.missed) status = 'missed';
      else if (isToday) status = 'today';
      else if (isPast) status = 'missed';
      else if (isFuture) status = 'future';

      days.push(status);
    }
    return days;
  }

  function computeState() {
    var u = currentUser();
    var store = readJson(DAILY_KEY + '::' + userKey());
    var today = dayKey();
    var rec = (store && store.history && store.history[today]) || null;
    var goal = (store && store.settings && store.settings.dailyGoalMinutes) || 15;
    var minutes = rec ? (rec.learningMinutes || 0) : 0;
    var pct = goal > 0 ? Math.min(100, Math.round((minutes / goal) * 100)) : 0;
    var r = rec || {};

    var state = {
      hasData: !!(u && (u.username || u.email || u.id)),
      streak: (u && u.streak) || 0,
      freezes: (u && u.freezes) || 0,
      progressPct: pct,
      minutesDone: minutes,
      goalMinutes: goal,
      xpToday: r.xpEarned || 0,
      lessonsToday: r.lessonsCompleted || 0,
      testsToday: r.testsCompleted || 0,
      freezeUsedToday: !!r.freezeUsed,
      goalCompleted: !!(r.goalCompleted || (goal > 0 && minutes >= goal)),
      week: computeWeek(store),
      allDone: false,
      hasLesson: false,
      lessonCourse: '',
      lessonNumber: 0,
      lessonTitle: '',
      date: today
    };

    var api = window.CoursesAPI;
    if (api && typeof api.getCourse === 'function' && typeof api.listCourses === 'function') {
      var lstore = readJson(LESSON_KEY + '::' + userKey());
      var lesson = computeCurrentLesson(api, (lstore && lstore.progress) || {});
      if (lesson && lesson.allDone) state.allDone = true;
      else if (lesson) {
        state.hasLesson = true;
        state.lessonCourse = String(lesson.course || '');
        state.lessonNumber = lesson.number || 0;
        state.lessonTitle = String(lesson.title || '');
      }
    }
    return state;
  }



  function pushState() {
    if (!isNative()) return;
    var p = plugin();
    if (!p || typeof p.updateWidget !== 'function') return;
    var state;
    try { state = computeState(); } catch (e) { return; }
    var json = JSON.stringify(state);
    if (json === _lastJson) return; /* o'zgarmagan — battery tejash */
    _lastJson = json;
    try { p.updateWidget({ state: state }); } catch (e) { /* noop */ }
  }

  function schedule() {
    if (!isNative()) return;
    if (_timer) return;
    _timer = setTimeout(function () { _timer = null; pushState(); }, 250);
  }

  /* Widget clickdan keyin app: kerakli sahifaga o'tish */
  var ACTION_PAGE = {
    open_lesson: 'lessons',
    open_lessons: 'lessons',
    open_dashboard: 'dashboard',
    open_tests: 'tests'
  };

  async function handlePendingAction() {
    var p = plugin();
    if (!p || typeof p.getPendingAction !== 'function') return;
    try {
      var res = await p.getPendingAction();
      if (res && res.action) {
        await p.clearPendingAction();
        var page = ACTION_PAGE[res.action];
        if (page && typeof window.__itShowPage === 'function') {
          try { window.__itShowPage(page); } catch (e) { /* noop */ }
        }
      }
    } catch (e) { /* noop */ }
  }

  /* App resume -> widget refresh (near real-time) */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      _lastJson = '';
      schedule();
      handlePendingAction();
    }
  });

  /* Init + retry (login state keyin paydo bo'lishi mumkin) */
  pushState();
  handlePendingAction();
  setTimeout(function () { _lastJson = ''; pushState(); }, 2000);
  setTimeout(function () { _lastJson = ''; pushState(); }, 5000);

  window.ITWidgetSync = { schedule: schedule, push: pushState };
})();
