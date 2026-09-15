/* ============================================================
   ITTest — MOBILE DAILY / STREAK / FREEZE ENGINE (v2)
   Noldan qayta yozilgan yagona kunlik tizim:
     • Real lokal sana (YYYY-MM-DD) asosidagi daily state
     • Har kun uchun yagona record — celebration kuniga 1 marta
     • Successful day = lesson complete + test complete
     • Missed day -> avtomatik Streak Freeze (yo'q bo'lsa reset)
     • Flow: Intro -> Permission -> Daily Main -> Dars -> Test
     • Desktop (>768px): butun mobil oqim umuman ochilmaydi
   Mavjud tizimlar bilan INTEGRATSIYA:
     - onboarding.js  -> DailyStreak.showMobileIntro()
     - lessons-app.js -> onLessonOpened / onLessonCompleted / openTestForCourse
     - script.js      -> onTestFinished / syncStreakAndFreezes
     - dashboard.js   -> getWeekDaysData / ensureUserFreezes
   ============================================================ */

(function () {
  'use strict';

  var DAILY_STORE_KEY = 'daily_state_v1';
  var DEFAULT_FREEZES = 2;
  var DEFAULT_GOAL_MINUTES = 15;
  var ANIM_MS = 260;

  /* ========================= HELPERS ========================= */

  function isMobile() {
    try {
      if (typeof window === 'undefined') return false;
      if (window.Capacitor) return true;
      var w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
      return w > 0 && w <= 768;
    } catch (e) { return false; }
  }

  function reducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) { return false; }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function outMs() { return reducedMotion() ? 10 : ANIM_MS; }

  /* ====================== SANA YORDAMCHILARI ====================== */

  function dayKey(ts) {
    var d = ts ? new Date(ts) : new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function parseDayKey(dk) {
    if (!dk || typeof dk !== 'string') return new Date();
    var p = dk.split('-').map(Number);
    return new Date(p[0], (p[1] || 1) - 1, p[2] || 1, 12, 0, 0, 0);
  }

  function daysDiff(d1Str, d2Str) {
    var d1 = parseDayKey(d1Str);
    var d2 = parseDayKey(d2Str);
    return Math.round((d2.getTime() - d1.getTime()) / 86400000);
  }

  function currentUser() {
    try {
      return (window.__itGetCurrentUser && typeof window.__itGetCurrentUser === 'function')
        ? window.__itGetCurrentUser() : null;
    } catch (e) { return null; }
  }

  function userKey() {
    var u = currentUser();
    return String((u && (u.username || u.email || u.id)) || 'guest').toLowerCase();
  }

  function persistUsers() {
    try {
      if (typeof window.saveUsersAndCurrent === 'function') window.saveUsersAndCurrent();
    } catch (e) { /* noop */ }
  }

  /* ====================== LOCALSTORAGE STATE ====================== */

  function getFullStore() {
    var k = DAILY_STORE_KEY + '::' + userKey();
    var raw = null;
    try { raw = localStorage.getItem(k); } catch (e) { raw = null; }
    var store = null;
    try { store = raw ? JSON.parse(raw) : null; } catch (e) { store = null; }
    if (!store || typeof store !== 'object') store = {};
    if (!store.history || typeof store.history !== 'object') store.history = {};
    if (!store.settings || typeof store.settings !== 'object') {
      store.settings = {
        dailyGoalMinutes: DEFAULT_GOAL_MINUTES,
        notificationEnabled: false,
        permissionAsked: false,
        onboardingIntroCompleted: false
      };
    }
    return store;
  }

  function saveFullStore(store) {
    var k = DAILY_STORE_KEY + '::' + userKey();
    try { localStorage.setItem(k, JSON.stringify(store)); } catch (e) { /* noop */ }
  }

  function getDayRecord(store, dateStr) {
    var dk = dateStr || dayKey();
    if (!store.history[dk]) {
      store.history[dk] = {
        date: dk,
        learningMinutes: 0,
        lessonsCompleted: 0,
        testsCompleted: 0,
        xpEarned: 0,
        goalMinutes: (store.settings && store.settings.dailyGoalMinutes) || DEFAULT_GOAL_MINUTES,
        goalCompleted: false,
        streakEligible: false,
        freezeUsed: false,
        protected: false,
        missed: false,
        completedLessonIds: [],
        completedTestIds: [],
        celebrationShown: false
      };
    }
    var rec = store.history[dk];
    if (!Array.isArray(rec.completedLessonIds)) rec.completedLessonIds = [];
    if (!Array.isArray(rec.completedTestIds)) rec.completedTestIds = [];
    return rec;
  }

  /* =================== STREAK + FREEZE EVALUATION =================== */

  function ensureUserFreezes(u) {
    if (!u) return DEFAULT_FREEZES;
    if (u.freezes === undefined || u.freezes === null) u.freezes = DEFAULT_FREEZES;
    return u.freezes;
  }

  /* Missed kunlarni aniqlash: freeze bor — streak saqlanadi, yo'q — 0 ga reset */
  function syncStreakAndFreezes(u) {
    if (!u) return;
    ensureUserFreezes(u);
    var today = dayKey();
    var lastActive = u.lastActiveDay;
    var streak = u.streak || 0;
    if (!lastActive || streak <= 0) return;

    var diff = daysDiff(lastActive, today);
    if (diff <= 1) return; /* bugun yoki kecha — streak xavfsiz */

    var missedCount = diff - 1;
    var store = getFullStore();
    var lastTs = parseDayKey(lastActive).getTime();
    var frozenDays = [];

    for (var i = 1; i <= missedCount; i++) {
      var dk = dayKey(lastTs + i * 86400000);
      var rec = getDayRecord(store, dk);

      /* Duplicate protection: bu kun allaqachon ishlangan */
      if (rec.freezeUsed || rec.streakEligible || rec.lessonsCompleted > 0 || rec.testsCompleted > 0) {
        continue;
      }

      if (u.freezes > 0) {
        u.freezes -= 1;
        rec.freezeUsed = true;
        rec.protected = true;
        frozenDays.push(dk);
      } else {
        /* Freeze tugagan — streak 0 ga reset */
        u.streak = 0;
        rec.missed = true;
        break;
      }
    }

    saveFullStore(store);
    persistUsers();

    if (frozenDays.length && isMobile()) showFreezeToast(frozenDays.length);
  }

  /* Kichik muz effekti toast: "Streak Freeze streakingizni saqladi." */
  function showFreezeToast(days) {
    try {
      var existing = document.getElementById('dsFreezeToast');
      if (existing) existing.remove();
      var t = document.createElement('div');
      t.id = 'dsFreezeToast';
      t.className = 'ds-freeze-toast ds-anim-in';
      t.setAttribute('role', 'status');
      t.innerHTML =
        '<span class="ds-freeze-ico" aria-hidden="true">🧊</span>' +
        '<span class="ds-freeze-txt"><b>Streak Freeze</b> streakingizni saqladi.' +
        (days > 1 ? ' <span class="ds-freeze-n">' + days + ' kun</span>' : '') + '</span>';
      document.body.appendChild(t);
      setTimeout(function () {
        t.classList.add('ds-anim-out');
        setTimeout(function () { if (t.parentNode) t.remove(); }, outMs());
      }, 2800);
    } catch (e) { /* noop */ }
  }

  /* =================== ACTIVITY RECORDING =================== */

  /* Widget sync hook (widget-sync.js native muhitda mavjud bo'lsa) */
  function widgetSyncTick() {
    try {
      if (window.ITWidgetSync && typeof window.ITWidgetSync.schedule === 'function') {
        window.ITWidgetSync.schedule();
      }
    } catch (e) { /* noop */ }
  }

  function recordActivity(type, info) {
    var u = currentUser();
    var store = getFullStore();
    var today = dayKey();
    syncStreakAndFreezes(u);

    var rec = getDayRecord(store, today);
    var xp = Number((info && info.xp) || 0);

    if (type === 'lesson') {
      var lid = info && info.lessonId;
      if (lid && rec.completedLessonIds.indexOf(lid) === -1) {
        rec.completedLessonIds.push(lid);
        rec.lessonsCompleted = (rec.lessonsCompleted || 0) + 1;
        rec.xpEarned = (rec.xpEarned || 0) + xp;
      }
    } else if (type === 'test') {
      var tid = info && info.testId;
      if (tid && rec.completedTestIds.indexOf(tid) === -1) {
        rec.completedTestIds.push(tid);
        rec.testsCompleted = (rec.testsCompleted || 0) + 1;
        rec.xpEarned = (rec.xpEarned || 0) + xp;
      }
    }

    /* Kunlik muvaffaqiyat — successful day asosi */
    if (rec.lessonsCompleted > 0 || rec.testsCompleted > 0) {
      rec.streakEligible = true;
      rec.goalCompleted = true;
    }

    /* Streak o'sishi: successful day (dars + test) birinchi marta yakunlanganda */
    if (u && rec.lessonsCompleted > 0 && rec.testsCompleted > 0 && u.lastActiveDay !== today) {
      u.streak = (u.streak || 0) > 0 ? (u.streak + 1) : 1;
      u.lastActiveDay = today;
      persistUsers();
    }

    saveFullStore(store);
    widgetSyncTick();
    return rec;
  }

  /* =================== LEARNING TIME TRACKER =================== */

  var session = {
    active: false, startAt: 0, lastTick: 0,
    accumulatedSec: 0, courseId: null, lessonId: null, interval: null
  };

  function startLearningSession(courseId, lessonId) {
    endLearningSession();
    session.active = true;
    session.startAt = Date.now();
    session.lastTick = Date.now();
    session.accumulatedSec = 0;
    session.courseId = courseId || null;
    session.lessonId = lessonId || null;
    if (!session.interval) {
      session.interval = setInterval(function () {
        if (!session.active || document.hidden) return;
        var now = Date.now();
        var delta = (now - session.lastTick) / 1000;
        session.lastTick = now;
        if (delta > 0 && delta < 10) session.accumulatedSec += delta;
      }, 1000);
    }
  }

  function pauseLearningSession() {
    if (!session.active) return;
    var delta = (Date.now() - session.lastTick) / 1000;
    session.lastTick = Date.now();
    if (delta > 0 && delta < 10) session.accumulatedSec += delta;
  }

  function endLearningSession() {
    if (!session.active) return;
    pauseLearningSession();
    session.active = false;
    if (session.interval) { clearInterval(session.interval); session.interval = null; }
    var minutes = Math.max(1, Math.round(session.accumulatedSec / 60));
    var store = getFullStore();
    var rec = getDayRecord(store, dayKey());
    rec.learningMinutes = (rec.learningMinutes || 0) + minutes;
    if (rec.learningMinutes >= rec.goalMinutes) {
      rec.goalCompleted = true;
      rec.streakEligible = true;
    }
    saveFullStore(store);
    widgetSyncTick();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pauseLearningSession();
    else if (session.active) session.lastTick = Date.now();
  });
  window.addEventListener('beforeunload', function () { endLearningSession(); });

  /* =================== HAFTALIK KO'RINISH (Du..Ya) =================== */

  var WEEK_LABELS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  function getWeekDaysData(u) {
    var now = new Date();
    now.setHours(12, 0, 0, 0);
    var monday = new Date(now);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

    var store = getFullStore();
    var todayDk = dayKey(now.getTime());
    var days = [];

    for (var d = 0; d < 7; d++) {
      var ts = monday.getTime() + d * 86400000;
      var dk = dayKey(ts);
      var rec = store.history[dk] || null;
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

      days.push({
        dayIndex: d,
        label: WEEK_LABELS[d],
        dateKey: dk,
        isToday: isToday,
        isPast: isPast,
        isFuture: isFuture,
        status: status,
        freezeUsed: !!(rec && rec.freezeUsed),
        completed: status === 'completed',
        rec: rec
      });
    }
    return days;
  }

  function weekRowHtml(week, todayDone) {
    return week.map(function (w) {
      var icon = '○';
      var cls = 'ds-week-day';
      if (w.status === 'completed' || (todayDone && w.isToday)) { icon = '✓'; cls += ' ds-day-done'; }
      else if (w.status === 'freeze') { icon = '🧊'; cls += ' ds-day-freeze'; }
      else if (w.isToday) { icon = '•'; cls += ' ds-day-today'; }
      else if (w.status === 'missed') { cls += ' ds-day-missed'; }
      else if (w.status === 'future') { cls += ' ds-day-future'; }
      return '<div class="' + cls + '"><span class="ds-day-lbl">' + w.label + '</span><span class="ds-day-dot">' + icon + '</span></div>';
    }).join('');
  }

  /* =================== ITTEST BLUE FIRE SVG (BLUE OLOV) =================== */

  var svgUid = 0;
  function blueFireSVG(size) {
    svgUid += 1;
    var id = 'dsFireGrad' + svgUid;
    var gid = 'dsFireGlow' + svgUid;
    var s = size || 44;
    return (
      '<span class="ds-blue-flame" style="width:' + s + 'px;height:' + s + 'px;" aria-hidden="true">' +
        '<svg viewBox="0 0 40 48" class="ds-fire-svg" focusable="false">' +
          '<defs>' +
            '<linearGradient id="' + id + '" x1="0%" y1="100%" x2="0%" y2="0%">' +
              '<stop offset="0%" stop-color="#1d4ed8" />' +
              '<stop offset="45%" stop-color="#2563eb" />' +
              '<stop offset="78%" stop-color="#38bdf8" />' +
              '<stop offset="100%" stop-color="#e0f2fe" />' +
            '</linearGradient>' +
            '<filter id="' + gid + '" x="-40%" y="-40%" width="180%" height="180%">' +
              '<feGaussianBlur stdDeviation="2.4" result="b" />' +
              '<feComposite in="SourceGraphic" in2="b" operator="over" />' +
            '</filter>' +
          '</defs>' +
          '<path class="ds-fire-glow" fill="url(#' + id + ')" filter="url(#' + gid + ')" d="M20 2 C23 9, 31 15, 34 23 C39 31, 35 42, 24 46 C32 40, 31 30, 26 25 C24 33, 19 36, 17 44 C8 39, 4 30, 8 20 C10 15, 16 11, 17 6 C17 12, 19 13, 20 2 Z" />' +
          '<path class="ds-fire-outer" fill="url(#' + id + ')" d="M20 2 C23 9, 31 15, 34 23 C39 31, 35 42, 24 46 C32 40, 31 30, 26 25 C24 33, 19 36, 17 44 C8 39, 4 30, 8 20 C10 15, 16 11, 17 6 C17 12, 19 13, 20 2 Z" />' +
          '<path class="ds-fire-inner" fill="#ffffff" opacity="0.92" d="M20 18 C22 23, 27 27, 26 34 C25 38, 22 42, 19 43 C22 39, 21 34, 18 31 C17 35, 14 37, 14 41 C11 38, 10 32, 12 28 C13 25, 17 23, 18 21 C18 24, 19 25, 20 18 Z" />' +
        '</svg>' +
      '</span>'
    );
  }

  function robotHtml(state) {
    try {
      if (window.ITMascot && typeof window.ITMascot.html === 'function') {
        return window.ITMascot.html(state || 'idle');
      }
    } catch (e) { /* noop */ }
    return '<div class="ds-mascot-fallback">🤖</div>';
  }

  function streakCounterHtml(size, streak, unitText, blueText) {
    return (
      '<div class="ds-streak-counter">' +
        blueFireSVG(size) +
        '<span class="ds-streak-number' + (blueText ? ' ds-blue-text' : '') + '">' + streak + '</span>' +
        '<span class="ds-streak-unit">' + unitText + '</span>' +
      '</div>'
    );
  }

  /* =================== SCREEN INFRA =================== */

  function removeById(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  function openScreen(id, inner, cls) {
    removeById(id);
    var modal = document.createElement('div');
    modal.id = id;
    modal.className = 'ds-screen-overlay' + (cls ? ' ' + cls : '');
    modal.innerHTML = '<div class="ds-screen-card ds-anim-in">' + inner + '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  function closeScreen(modal, cb) {
    modal.classList.add('ds-anim-out');
    setTimeout(function () {
      if (modal.parentNode) modal.remove();
      if (typeof cb === 'function') cb();
    }, outMs());
  }

  /* ============================================================
     MOBILE EKRANLAR
     1. FIRST-TIME DAILY INTRO   (faqat bir marta)
     2. NOTIFICATION PERMISSION  (faqat bir marta)
     3. DAILY MAIN SCREEN        -> first available lesson
     4. STREAK CELEBRATION       (successful day, kuniga 1 marta)
     ============================================================ */

  /* 1. FIRST-TIME MOBILE DAILY INTRO */
  function showMobileIntro(options) {
    var onDone = (options && typeof options.onDone === 'function') ? options.onDone : null;
    if (!isMobile()) { if (onDone) onDone(); return; }

    var store = getFullStore();
    if (store.settings.onboardingIntroCompleted) {
      /* Intro allaqachon ko'rilgan — to'g'ridan-to'g'ri keyingi bosqich */
      proceedAfterIntro(options);
      return;
    }

    var u = currentUser();
    syncStreakAndFreezes(u);
    var streak = Math.max(1, (u && u.streak) || 1);
    var week = weekRowHtml(getWeekDaysData(u), false);

    var modal = openScreen('dsIntroModal',
      '<div class="ds-screen-badge"><span aria-hidden="true">🎯</span> KUNLIK O‘QUV REJIMI</div>' +
      '<h2 class="ds-screen-title">Har kuni ozgina o‘rganing —<br>bilimingiz kuchayadi.</h2>' +
      '<p class="ds-screen-sub">Har kuni bitta dars va bitta test — streakingiz yonadi.</p>' +
      '<div class="ds-mascot-box">' + robotHtml('idle') + '</div>' +
      streakCounterHtml(38, streak, 'kunlik streak', false) +
      '<div class="ds-week-row" aria-label="Haftalik streak">' + week + '</div>' +
      '<div class="ds-screen-actions">' +
        '<button type="button" class="ds-btn ds-btn-primary ds-btn-lg" id="dsIntroNextBtn">🚀 Davom etish</button>' +
      '</div>'
    );

    var btn = modal.querySelector('#dsIntroNextBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        var s = getFullStore();
        s.settings.onboardingIntroCompleted = true;
        saveFullStore(s);
        closeScreen(modal, function () { proceedAfterIntro(options); });
      });
    }
  }

  function proceedAfterIntro(options) {
    var store = getFullStore();
    if (!store.settings.permissionAsked) {
      showMobilePermission(options);
    } else {
      showMobileDailyMain(options);
    }
    /* onDone faqat "1-darsni boshlash" bosilganda chaqiriladi */
  }

  /* 2. NOTIFICATION PERMISSION — FAQAT BIR MARTA */
  function systemPermissionGranted() {
    try {
      return !!(typeof window.Notification !== 'undefined' && window.Notification.permission === 'granted');
    } catch (e) { return false; }
  }

  function showMobilePermission(options) {
    var onDone = (options && typeof options.onDone === 'function') ? options.onDone : null;
    if (!isMobile()) { if (onDone) onDone(); return; }

    var store = getFullStore();
    if (store.settings.permissionAsked || systemPermissionGranted()) {
      store.settings.permissionAsked = true;
      saveFullStore(store);
      showMobileDailyMain(options);
      return;
    }

    var modal = openScreen('dsPermModal',
      '<div class="ds-screen-badge"><span aria-hidden="true">🔔</span> ESLATMALAR</div>' +
      '<div class="ds-perm-icon" aria-hidden="true">🔔</div>' +
      '<h2 class="ds-screen-title">Har kuni eslatib turaymi?</h2>' +
      '<p class="ds-screen-sub">Kunlik dars va streakni yo‘qotmaslik uchun qisqa eslatma yuboramiz.</p>' +
      '<div class="ds-screen-actions">' +
        '<button type="button" class="ds-btn ds-btn-primary ds-btn-lg" id="dsPermAllowBtn">🔔 Ruxsat berish</button>' +
        '<button type="button" class="ds-btn ds-btn-ghost ds-btn-lg" id="dsPermLaterBtn">Keyinroq</button>' +
      '</div>'
    );

    function proceed(allowed) {
      var s = getFullStore();
      s.settings.permissionAsked = true;
      s.settings.notificationEnabled = !!allowed;
      saveFullStore(s);

      if (allowed && typeof window.Notification !== 'undefined' && typeof window.Notification.requestPermission === 'function') {
        try { window.Notification.requestPermission(); } catch (e) { /* noop */ }
      }
      closeScreen(modal, function () { showMobileDailyMain(options); });
    }

    var allowBtn = modal.querySelector('#dsPermAllowBtn');
    if (allowBtn) allowBtn.addEventListener('click', function () { proceed(true); });
    var laterBtn = modal.querySelector('#dsPermLaterBtn');
    if (laterBtn) laterBtn.addEventListener('click', function () { proceed(false); });
  }

  /* 3. DAILY / STREAK MAIN SCREEN (Mobile) */
  function showMobileDailyMain(options) {
    var onDone = (options && typeof options.onDone === 'function') ? options.onDone : null;
    if (!isMobile()) { if (onDone) onDone(); return; }

    var u = currentUser();
    syncStreakAndFreezes(u);
    var streak = Math.max(1, (u && u.streak) || 1);
    var freezes = ensureUserFreezes(u);
    var week = weekRowHtml(getWeekDaysData(u), false);

    var modal = openScreen('dsDailyMainModal',
      '<div class="ds-screen-badge"><span aria-hidden="true">🔥</span> KUNLIK REJIM</div>' +
      '<h2 class="ds-screen-title">15 daqiqa dars va bilimingizni sinang</h2>' +
      '<p class="ds-screen-sub">Darsni tugatib, testni topshiring — bugungi streak yonadi!</p>' +
      '<div class="ds-mascot-box">' + robotHtml('rocket') + '</div>' +
      streakCounterHtml(42, streak, 'kunlik streak', true) +
      '<div class="ds-freeze-chip" title="Streak Freeze"><span aria-hidden="true">🧊</span> <b>' + freezes + '</b> freeze</div>' +
      '<div class="ds-week-row" aria-label="Haftalik streak">' + week + '</div>' +
      '<div class="ds-screen-actions">' +
        '<button type="button" class="ds-btn ds-btn-primary ds-btn-lg" id="dsStartFirstLessonBtn">🚀 1-darsni boshlash</button>' +
      '</div>'
    );

    var btn = modal.querySelector('#dsStartFirstLessonBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        var s = getFullStore();
        s.settings.onboardingIntroCompleted = true;
        saveFullStore(s);
        closeScreen(modal, function () { if (onDone) onDone(); });
      });
    }
  }

  /* 4. STREAK CELEBRATION — kuniga FAQAT 1 marta, keyin avtomatik dashboard */
  function showStreakCelebration(info) {
    if (!isMobile()) return;

    var store = getFullStore();
    var today = dayKey();
    var rec = getDayRecord(store, today);

    /* Duplicate protection: bugun allaqachon ko'rsatilgan bo'lsa chiqmaydi */
    if (rec.celebrationShown) return;
    rec.celebrationShown = true;
    saveFullStore(store);

    var u = currentUser();
    syncStreakAndFreezes(u);
    var streak = Math.max(1, (u && u.streak) || 1);
    var xpEarned = (info && info.xp) || rec.xpEarned || 20;
    var week = weekRowHtml(getWeekDaysData(u), true);

    var particles = '';
    for (var i = 0; i < 8; i++) {
      particles += '<span class="ds-particle ds-p' + i + '" aria-hidden="true"></span>';
    }

    var modal = openScreen('dsCelebModal',
      '<div class="ds-celeb-halo" aria-hidden="true"></div>' +
      particles +
      '<div class="ds-mascot-box">' + robotHtml('complete') + '</div>' +
      streakCounterHtml(44, streak, 'kunlik streak!', true) +
      '<p class="ds-celeb-sub">Bugungi dars va test bajarildi! ⭐ <b>+' + Number(xpEarned) + ' XP</b></p>' +
      '<div class="ds-week-row" aria-label="Haftalik streak">' + week + '</div>' +
      '<div class="ds-celeb-auto-note">Bosh sahifaga o‘tilmoqda…</div>',
      'ds-celeb-overlay'
    );

    try {
      if (typeof window.__itConfetti === 'function' && !reducedMotion()) window.__itConfetti();
    } catch (e) { /* noop */ }

    var autoTimer = setTimeout(close, reducedMotion() ? 900 : 1900);

    function close() {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
      closeScreen(modal, function () {
        try {
          if (typeof window.__itShowPage === 'function') window.__itShowPage('dashboard');
        } catch (e) { /* noop */ }
      });
    }

    modal.addEventListener('click', close);
  }

  /* ============ LESSON -> MAVJUD TEST BRIDGE ============ */

  function findMatchingTestForCourse(courseId) {
    var map = {
      html: 'HTML-beginner-1',
      css: 'CSS-beginner-1',
      javascript: 'JavaScript-beginner-1',
      python: 'Python-beginner-1',
      java: 'Java-beginner-1',
      cpp: 'C++-beginner-1',
      csharp: 'C#-beginner-1',
      sql: 'SQL-beginner-1',
      ai: 'AI-beginner-1'
    };
    return map[courseId] || null;
  }

  function openTestForCourse(courseId) {
    var testId = findMatchingTestForCourse(courseId);
    if (testId && typeof window.__itStartQuiz === 'function') {
      try { window.__itStartQuiz(testId); return true; } catch (e) { /* fallback */ }
    }
    if (typeof window.__itShowPage === 'function') {
      try { window.__itShowPage('tests'); return true; } catch (e) { /* noop */ }
    }
    return false;
  }

  /* =================== HOOKS =================== */

  function onLessonOpened(courseId, lessonId) {
    startLearningSession(courseId, lessonId);
    widgetSyncTick();
  }

  function onLessonCompleted(info) {
    endLearningSession();
    var courseId = info.courseId || (info.course && info.course.id);
    var lessonId = info.lesson && info.lesson.id;
    var xp = info.xp || (info.lesson && info.lesson.xp) || 10;
    recordActivity('lesson', { courseId: courseId, lessonId: lessonId, xp: xp });
    /* CELEBRATION BU YERDA CHIQMAYDI — dars tugadi = hali celebration emas.
       Darsdan keyin mavjud test ochiladi (lessons-app.js openTestForCourse bridge),
       test yakunlangach successful day bo'lsa celebration chiqadi. */
  }

  function onTestFinished(info) {
    info = info || {};
    var rec = recordActivity('test', {
      subject: info.subject,
      testId: info.testId,
      score: info.score,
      xp: info.score
    });

    /* FAQAT successful day (dars + test) yakunlanganda — kuniga 1 marta */
    if (isMobile() && rec.lessonsCompleted > 0 && rec.testsCompleted > 0 && !rec.celebrationShown) {
      showStreakCelebration({ xp: rec.xpEarned || info.score, subject: info.subject });
    }
  }

  /* =================== EXPORTS =================== */

  window.DailyStreak = {
    isMobile: isMobile,
    dayKey: dayKey,
    daysDiff: daysDiff,
    getFullStore: getFullStore,
    saveFullStore: saveFullStore,
    getDayRecord: getDayRecord,
    getWeekDaysData: getWeekDaysData,
    ensureUserFreezes: ensureUserFreezes,
    syncStreakAndFreezes: syncStreakAndFreezes,
    recordActivity: recordActivity,
    startLearningSession: startLearningSession,
    endLearningSession: endLearningSession,
    showMobileIntro: showMobileIntro,
    showMobilePermission: showMobilePermission,
    showMobileDailyMain: showMobileDailyMain,
    showStreakCelebration: showStreakCelebration,
    openTestForCourse: openTestForCourse,
    onLessonOpened: onLessonOpened,
    onLessonCompleted: onLessonCompleted,
    onTestFinished: onTestFinished
  };
})();