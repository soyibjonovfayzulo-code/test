/* ============================================================
   ITTest — YANGI DASHBOARD (0 dan qayta qurilgan)
   HOME / ACTION CENTER — analytics page EMAS.
   Real data manbalari:
     - window.__itGetCurrentUser()          (user, XP, streak, testResults, duelHistory)
     - window.CoursesAPI                    (kurslar/darslar real data)
     - localStorage darslar_state_v1::<usr> (darslar progressi — lessons-app.js bilan bir xil)
     - window.Lessons.openLesson            (haqiqiy darsni ochadi)
     - window.__itShowPage                  (haqiqiy sahifa navigatsiyasi)
     - window.ITMascot                      (3D robot)
   Hech qanday fake statistika yaratilmaydi: 0 bo'lsa 0 ko'rsatiladi.
   ============================================================ */
(function () {
  'use strict';

  var DAY_MS = 86400000;
  var STORE_PREFIX = 'darslar_state_v1';
  var DAILY_GOAL_ACTIONS = 3;   // bugungi maqsad: 3 ta faoliyat (dars/test/duel)
  var DAILY_GOAL_MINUTES = 15;  // bugungi vaqt maqsadi (faqat real durationSec'lardan)

  var WEEK_LABELS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']; // Dushanba → Yakshanba

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function currentUser() {
    try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
    catch (e) { return null; }
  }

  function dayKey(ts) {
    var d = ts ? new Date(ts) : new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function isToday(ts) { return !!ts && dayKey(ts) === dayKey(); }

  /* ---------- Darslar progress store (faqat O'QISH — lessons-app bilan bir xil kalit) ---------- */
  function lessonsStore() {
    var u = currentUser();
    var who = u ? (u.username || u.email || 'user') : 'guest';
    var raw = null;
    try { raw = localStorage.getItem(STORE_PREFIX + '::' + String(who).toLowerCase()); }
    catch (e) { raw = null; }
    var store = null;
    try { store = raw ? JSON.parse(raw) : null; } catch (e) { store = null; }
    if (!store || typeof store !== 'object') store = {};
    if (!store.levels) store.levels = {};
    if (!store.progress) store.progress = {};
    return store;
  }

  function completedMap(store, courseId) {
    var p = store.progress[courseId];
    return (p && p.completed) ? p.completed : {};
  }
  function completedCountOf(store, courseId) {
    return Object.keys(completedMap(store, courseId)).length;
  }
  function completedCountOfTotal(store) {
    var n = 0;
    Object.keys(store.progress).forEach(function (cid) { n += completedCountOf(store, cid); });
    return n;
  }

  /* Joriy kurs: oxirgi ochilgan tugallanmagan kurs, aks holda boshlanmagan birinchi kurs */
  function pickCurrentCourse(store) {
    var api = window.CoursesAPI;
    if (!api) return null;
    var courses = api.listCourses() || [];
    if (!courses.length) return null;
    var best = null, bestVisit = -1;
    courses.forEach(function (c) {
      var p = store.progress[c.id];
      if (!p) return;
      if (completedCountOf(store, c.id) >= (c.lessonCount || 0)) return; // tugallangan
      var v = p.lastVisit || 0;
      if (v > bestVisit) { best = c; bestVisit = v; }
    });
    if (!best) {
      for (var i = 0; i < courses.length; i++) {
        if (completedCountOf(store, courses[i].id) === 0) { best = courses[i]; break; }
      }
    }
    if (!best) best = courses[0];
    return best;
  }

  /* Joriy dars: birinchi tugallanmagan (lessons-app currentLesson mantiqining o'qishli replikasi) */
  function currentLessonOf(store, course) {
    var completed = completedMap(store, course.id);
    var level = store.levels[course.id] || 'intermediate';
    var sequential = level === 'beginner';
    for (var i = 0; i < course.lessons.length; i++) {
      var l = course.lessons[i];
      if (completed[l.id]) continue;
      if (sequential && i > 0) {
        var prev = course.lessons[i - 1];
        if (!completed[prev.id]) break; // hali ochilmagan (yopiq)
      }
      return l;
    }
    return null; // barchasi tugallangan
  }

  /* ---------- Bugungi real faoliyat ---------- */
  function todayStats(u, store) {
    var tests = (u.testResults || []).filter(function (r) { return isToday(r.timestamp); });
    var duels = (u.duelHistory || []).filter(function (d) { return isToday(d.timestamp); });
    var lessons = [];
    Object.keys(store.progress).forEach(function (cid) {
      var course = window.CoursesAPI ? window.CoursesAPI.getCourse(cid) : null;
      if (!course) return;
      var completed = completedMap(store, cid);
      Object.keys(completed).forEach(function (lid) {
        var rec = completed[lid];
        if (rec && rec.at && isToday(rec.at)) {
          var found = window.CoursesAPI.findLesson(cid, lid);
          lessons.push({
            courseId: cid,
            lesson: found ? found.lesson : null,
            courseName: course.name,
            score: rec.score || 0
          });
        }
      });
    });
    var minutes = 0;
    tests.forEach(function (r) { minutes += (r.durationSec || 0) / 60; });
    duels.forEach(function (d) { minutes += (d.durationSec || 0) / 60; });
    minutes = Math.round(minutes);
    var xp = tests.reduce(function (s, r) { return s + (r.score || 0); }, 0);
    var actions = tests.length + duels.length + lessons.length;
    return {
      tests: tests, duels: duels, lessons: lessons,
      minutes: minutes, xp: xp, actions: actions,
      pct: Math.min(100, Math.round((actions / DAILY_GOAL_ACTIONS) * 100))
    };
  }

  /* ---------- Streak hafta ko'rinishi (real streak + lastActiveDay) ---------- */
  function streakWeek(u) {
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var monday = new Date(today);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // shu hafta dushanbasi
    var activeKeys = {};
    var streak = u.streak || 0;
    if (u.lastActiveDay && streak > 0) {
      var anchor = null;
      if (u.lastActiveDay === dayKey(today.getTime())) anchor = today.getTime();
      else if (u.lastActiveDay === dayKey(today.getTime() - DAY_MS)) anchor = today.getTime() - DAY_MS;
      if (anchor != null) {
        for (var i = 0; i < streak; i++) activeKeys[dayKey(anchor - i * DAY_MS)] = true;
      }
    }
    var days = [];
    for (var d = 0; d < 7; d++) {
      var ts = monday.getTime() + d * DAY_MS;
      days.push({ label: WEEK_LABELS[d], active: !!activeKeys[dayKey(ts)], today: dayKey(ts) === dayKey(today.getTime()) });
    }
    return days;
  }

  /* ---------- Yaqin test maqsadi (real ACHIEVEMENTS valuesiga mos) ---------- */
  function nextTestGoal(total) {
    if (total < 5) return { target: 5, label: '5 test' };
    if (total < 20) return { target: 20, label: '20 test' };
    return null;
  }

  /* ---------- Bugungi challenge (deterministik kunlik tanlov — real kurs/dars) ---------- */
  function challengeOf(store) {
    var api = window.CoursesAPI;
    if (!api) return null;
    var courses = api.listCourses() || [];
    if (!courses.length) return null;
    var dk = dayKey();
    var seed = 0;
    for (var i = 0; i < dk.length; i++) seed = (seed * 31 + dk.charCodeAt(i)) % 100000;
    var course = courses[seed % courses.length];
    var lesson = currentLessonOf(store, course) || course.lessons[0];
    if (!lesson) return null;
    var completed = completedMap(store, course.id);
    var rec = completed[lesson.id];
    var done = !!(rec && rec.at && isToday(rec.at));
    return { course: course, lesson: lesson, done: done };
  }

  /* ---------- Recent activity (real eventlar: dars / test / duel) ---------- */
  function activityFeed(u, store) {
    var items = [];
    (u.testResults || []).forEach(function (r) {
      if (!r.timestamp) return;
      items.push({
        ts: r.timestamp, ico: '🧠',
        text: 'Test bajarildi: ' + (r.subject || '') + ' · ' + (r.percent || 0) + '%',
        sub: '+' + (r.score || 0) + ' XP' + (r.passed ? ' · ✅ Passed' : '')
      });
    });
    (u.duelHistory || []).forEach(function (d) {
      if (!d.timestamp) return;
      var w = d.winStatus === 'win', draw = d.winStatus === 'draw';
      items.push({
        ts: d.timestamp,
        ico: w ? '🏆' : (draw ? '🤝' : '⚔️'),
        text: 'Duel ' + (w ? 'g‘alabasi' : (draw ? 'durrang' : 'maglubiyat')) + (d.subject ? ' · ' + d.subject : ''),
        sub: (d.score1 != null ? d.score1 : '?') + ' : ' + (d.score2 != null ? d.score2 : '?')
      });
    });
    Object.keys(store.progress).forEach(function (cid) {
      var course = window.CoursesAPI ? window.CoursesAPI.getCourse(cid) : null;
      if (!course) return;
      var completed = completedMap(store, cid);
      Object.keys(completed).forEach(function (lid) {
        var rec = completed[lid];
        if (!rec || !rec.at) return;
        var found = window.CoursesAPI.findLesson(cid, lid);
        items.push({
          ts: rec.at, ico: '✅',
          text: (found ? found.course.name + ' · ' + found.lesson.number + '-dars' : course.name) + ' tugatildi',
          sub: '📚 ' + (found ? found.lesson.title : '')
        });
      });
    });
    items.sort(function (a, b) { return b.ts - a.ts; });
    return items.slice(0, 4);
  }

  /* ================== RENDER QISMLARI ================== */

  function renderHero(u) {
    var nameEl = $('#ndHeroName');
    if (nameEl) nameEl.textContent = u.firstname || u.username || 'Foydalanuvchi';
    var subEl = $('#ndHeroSub');
    if (subEl) {
      var s = u.streak || 0;
      subEl.textContent = s > 0
        ? '🔥 ' + s + ' kunlik streak davom etmoqda — bugun ham bir qadam oldinga.'
        : 'Bugun atigi 15 daqiqa ajrating — o‘zingizni kechagidan kuchliroq qiling.';
    }
    var av = $('#ndHeroAvatar');
    if (av) {
      var top = $('#topbarAvatar');
      av.textContent = (top && top.textContent) ? top.textContent : (u.avatar || 'U');
    }
    var lvl = u.level || 1;
    var base = (u.xp || 0) % 100;
    var badge = $('#ndHeroLevel');
    if (badge) badge.textContent = 'Level ' + lvl;
    var track = $('#ndHeroXpTrack');
    if (track) {
      track.setAttribute('aria-valuenow', String(base));
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-label', 'Level ' + lvl + ' XP progressi');
    }
    var fill = $('#ndHeroXpFill');
    if (fill) fill.style.width = base + '%';
    var txt = $('#ndHeroXpText');
    if (txt) txt.textContent = base + ' / 100 XP';
  }

  function renderHeroRobot() {
    var box = $('#ndHeroRobot');
    if (!box) return;
    if (window.ITMascot && typeof window.ITMascot.html === 'function') {
      box.innerHTML = window.ITMascot.html('idle', 'mascot--sm');
    }
  }

  function renderToday(u, store) {
    var body = $('#ndTodayBody');
    if (!body) return;
    var t = todayStats(u, store);

    if (t.actions === 0) {
      var fresh = (u.testResults || []).length === 0 && (u.duelHistory || []).length === 0 &&
        completedCountOfTotal(store) === 0;
      body.innerHTML =
        '<div class="nd-empty">' +
          '<div class="nd-empty-ico" aria-hidden="true">🌅</div>' +
          '<h3>' + (fresh ? 'Bugun boshlash uchun ajoyib kun!' : 'Bugun hali faoliyat yo‘q') + '</h3>' +
          '<p>' + (fresh ? 'Birinchi dars bilan boshlang — hammasi yaxshi bo‘ladi!' : 'Birinchi qadamni tashlang, qolgani o‘z-o‘zidan keladi.') + '</p>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">📚 Birinchi darsni boshlash</button>' +
        '</div>';
      return;
    }

    var rows =
      '<ul class="nd-facts">' +
        '<li><span class="nd-fact-ico" aria-hidden="true">📚</span><span class="nd-fact-t">Dars</span><span class="nd-fact-v">' + t.lessons.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">🧠</span><span class="nd-fact-t">Test</span><span class="nd-fact-v">' + t.tests.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">⚔️</span><span class="nd-fact-t">Duel</span><span class="nd-fact-v">' + t.duels.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">⭐</span><span class="nd-fact-t">XP (bugun)</span><span class="nd-fact-v">+' + t.xp + ' XP</span></li>' +
      '</ul>';

    var hint;
    if (t.pct >= 100 && t.minutes >= DAILY_GOAL_MINUTES) hint = '🎉 Zo‘r! Bugungi maqsad bajarildi.';
    else if (t.pct >= 100) hint = '✅ Bugungi faoliyat bajarildi — istasangiz 15 daqiqa ham oshiring.';
    else hint = 'Maqsad: ' + DAILY_GOAL_ACTIONS + ' ta faoliyat — ' + t.actions + ' ta bajarildi.';

    body.innerHTML =
      '<div class="nd-today">' +
        '<div class="nd-ring-wrap">' + ringSVG(t.pct) +
          '<div class="nd-ring-caption"><b>' + t.minutes + '</b><span>daqiqa</span></div>' +
        '</div>' +
        '<div class="nd-today-side">' + rows +
          '<p class="nd-hint" id="ndProgressHint">' + esc(hint) + '</p>' +
        '</div>' +
      '</div>';
  }

  function ringSVG(pct) {
    var r = 52, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<svg class="nd-ring" viewBox="0 0 120 120" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Bugungi progress">' +
      '<circle class="nd-ring-track" cx="60" cy="60" r="' + r + '"/>' +
      '<circle class="nd-ring-fill" cx="60" cy="60" r="' + r + '" data-off="' + off.toFixed(1) + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/>' +
      '</svg>';
  }

  function renderStreak(u) {
    var body = $('#ndStreakBody');
    if (!body) return;
    var s = u.streak || 0;
    var week = streakWeek(u);
    var dots = week.map(function (d) {
      var cls = 'nd-day' + (d.active ? ' nd-day--on' : '') + (d.today ? ' nd-day--today' : '');
      return '<span class="' + cls + '"><i aria-hidden="true">' + d.label + '</i></span>';
    }).join('');
    var hint = s === 0
      ? 'Bugun shug‘ullaning — streakni yoqib yuboring!'
      : (u.lastActiveDay === dayKey() ? 'Bugun belgilandi ✅ Streak davom etmoqda.' : 'Bugun shug‘ullaning — streak saqlanadi!');
    body.innerHTML =
      '<div class="nd-streak-num"><span class="nd-streak-flame" aria-hidden="true">🔥</span><b>' + s + '</b><span>kun</span></div>' +
      '<div class="nd-week" aria-label="Haftalik streak">' + dots + '</div>' +
      '<p class="nd-hint">' + esc(hint) + '</p>';
  }

  function renderLesson(u, store) {
    var body = $('#ndLessonBody');
    if (!body) return;
    var course = pickCurrentCourse(store);
    if (!course) {
      body.innerHTML = '<div class="nd-empty"><div class="nd-empty-ico" aria-hidden="true">📚</div><h3>Darslar hali tayyor emas</h3><p>Keyinroq qayta kiring.</p></div>';
      return;
    }
    var lesson = currentLessonOf(store, course);
    var done = completedCountOf(store, course.id);
    var total = course.lessonCount || course.lessons.length || 0;
    var pct = total ? Math.round((done / total) * 100) : 0;

    if (!lesson) {
      body.innerHTML =
        '<div class="nd-lesson-done">' +
          '<div class="nd-empty-ico" aria-hidden="true">🎉</div>' +
          '<h3>' + esc(course.name) + ' kursi tugallangan!</h3>' +
          '<p>' + total + ' ta darsning barchasi yakunlandi. Zo‘r ish!</p>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">Keyingi kursni boshlash →</button>' +
        '</div>';
      return;
    }

    var started = done > 0;
    body.innerHTML =
      '<div class="nd-lesson">' +
        '<div class="nd-lesson-icon" aria-hidden="true">' + esc(course.icon || '📘') + '</div>' +
        '<div class="nd-lesson-info">' +
          '<span class="nd-lesson-course">' + esc(course.name) + '</span>' +
          '<h3 class="nd-lesson-title">' + lesson.number + '-dars: ' + esc(lesson.title) + '</h3>' +
          '<div class="nd-lesson-meta">' +
            '<span>⏱ ' + (lesson.duration || 10) + ' daqiqa</span>' +
            '<span class="nd-xp-chip">⭐ +' + (lesson.xp || 10) + ' XP</span>' +
          '</div>' +
          '<div class="nd-lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(course.name) + ' kurs progressi">' +
            '<span style="width:' + pct + '%"></span>' +
          '</div>' +
          '<span class="nd-lesson-pct">' + pct + '% · ' + done + '/' + total + ' dars</span>' +
        '</div>' +
        '<div class="nd-lesson-cta">' +
          '<button type="button" class="nd-btn nd-btn--primary nd-btn--lg nd-pulse" data-open-lesson data-course="' + esc(course.id) + '" data-lesson="' + esc(lesson.id) + '">' + (started ? '▶ Davom ettirish' : '▶ Boshlash') + '</button>' +
        '</div>' +
      '</div>';
  }

  function renderTests(u) {
    var body = $('#ndTestsBody');
    if (!body) return;
    var total = (u.testResults || []).length;
    var today = (u.testResults || []).filter(function (r) { return isToday(r.timestamp); }).length;
    var goal = nextTestGoal(total);
    var goalHtml = '';
    if (goal) {
      var gp = Math.min(100, Math.round((total / goal.target) * 100));
      goalHtml =
        '<div class="nd-goal-line"><span>Yaqin maqsad</span><span>' + total + '/' + goal.target + ' test</span></div>' +
        '<div class="nd-mini-bar"><span style="width:' + gp + '%"></span></div>';
    } else {
      goalHtml = '<p class="nd-hint">🏆 Barcha test maqsadlari bajarildi!</p>';
    }
    body.innerHTML =
      '<div class="nd-kv"><span class="nd-kv-l">Bugun</span><span class="nd-kv-v">' + today + ' ta test</span></div>' +
      '<div class="nd-kv"><span class="nd-kv-l">Jami</span><span class="nd-kv-v">' + total + ' ta test</span></div>' +
      goalHtml +
      '<button type="button" class="nd-btn nd-btn--ghost" data-goto="tests">Testlarga o‘tish →</button>';
  }

  function renderDuel(u) {
    var body = $('#ndDuelBody');
    if (!body) return;
    var today = (u.duelHistory || []).filter(function (d) { return isToday(d.timestamp); }).length;
    body.innerHTML =
      '<div class="nd-kv"><span class="nd-kv-l">Bugungi duel</span><span class="nd-kv-v">' + today + ' ta</span></div>' +
      '<div class="nd-kv"><span class="nd-kv-l">🏆 G‘alabalar</span><span class="nd-kv-v">' + (u.duelWins || 0) + '</span></div>' +
      '<div class="nd-kv"><span class="nd-kv-l">🎮 Jami duel</span><span class="nd-kv-v">' + (u.duelTotal || 0) + '</span></div>' +
      '<button type="button" class="nd-btn nd-btn--ghost" data-goto="duel">Duel o‘ynash →</button>';
  }

  function renderChallenge(u, store) {
    var body = $('#ndChallengeBody');
    var card = $('#ndChallengeCard');
    if (!body) return;
    var ch = challengeOf(store);
    if (!ch) { body.innerHTML = '<p class="nd-hint">Challenge hali tayyor emas.</p>'; return; }
    if (card) card.classList.toggle('nd-card--done', ch.done);
    if (ch.done) {
      try { if (window.ITMascot && window.ITMascot.setStateIn) window.ITMascot.setStateIn($('#ndHeroRobot'), 'success'); }
      catch (e) { /* robot ixtiyoriy */ }
    }
    body.innerHTML =
      '<p class="nd-challenge-task">' +
        esc(ch.course.name) + ' kursida <b>' + ch.lesson.number + '-darsni yakunlang:</b><br>' +
        '<span class="nd-challenge-title">“' + esc(ch.lesson.title) + '”</span>' +
      '</p>' +
      '<div class="nd-challenge-meta">' +
        '<span class="nd-xp-chip">⭐ +' + (ch.lesson.xp || 10) + ' XP</span>' +
        '<span>⏱ ' + (ch.lesson.duration || 10) + ' daqiqa</span>' +
      '</div>' +
      (ch.done
        ? '<p class="nd-hint nd-hint--ok">✅ Bugungi challenge bajarildi — ajoyib!</p>'
        : '<button type="button" class="nd-btn nd-btn--warning" data-open-lesson data-course="' + esc(ch.course.id) + '" data-lesson="' + esc(ch.lesson.id) + '">Challenge’ni boshlash →</button>');
  }

  function renderStats(u) {
    var body = $('#ndStatsBody');
    if (!body) return;
    body.innerHTML =
      '<button type="button" class="nd-stat" data-goto="achievements" aria-label="XP — Yutuqlar sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">⭐</span><b>' + (u.points || 0) + '</b><span>XP</span></button>' +
      '<span class="nd-stat-sep" aria-hidden="true"></span>' +
      '<button type="button" class="nd-stat" data-goto="profile" aria-label="Streak — Profil sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">🔥</span><b>' + (u.streak || 0) + '</b><span>kun</span></button>' +
      '<span class="nd-stat-sep" aria-hidden="true"></span>' +
      '<button type="button" class="nd-stat" data-goto="achievements" aria-label="Yutuqlar sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">🏆</span><b>' + (u.achievements || []).length + '</b><span>yutuq</span></button>';
  }

  function renderNextGoal(u) {
    var body = $('#ndGoalBody');
    if (!body) return;
    var lvl = u.level || 1;
    var base = (u.xp || 0) % 100;
    var left = 100 - base;
    body.innerHTML =
      '<div class="nd-goal-top"><span class="nd-goal-lvl">Level ' + lvl + ' → ' + (lvl + 1) + '</span>' +
        '<span class="nd-goal-xp">' + base + '/100 XP</span></div>' +
      '<div class="nd-goal-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + base + '" aria-label="Keyingi level XP progressi"><span style="width:' + base + '%"></span></div>' +
      '<p class="nd-hint">' + (left > 0 ? 'Level ' + (lvl + 1) + ' gacha yana <b>' + left + ' XP</b>' : '🎉 Level ' + (lvl + 1) + ' juda yaqin — davom eting!') + '</p>';
  }

  function renderActivity(u, store) {
    var body = $('#ndActivityBody');
    if (!body) return;
    var items = activityFeed(u, store);
    if (!items.length) {
      body.innerHTML =
        '<div class="nd-empty nd-empty--row">' +
          '<div class="nd-empty-ico" aria-hidden="true">🌱</div>' +
          '<div><h3>Hali faoliyat yo‘q.</h3><p>Birinchi darsni boshlang.</p></div>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">📚 Darslarga o‘tish</button>' +
        '</div>';
      return;
    }
    body.innerHTML = '<ul class="nd-feed">' + items.map(function (it) {
      var d = new Date(it.ts);
      var hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      var dateStr = d.getDate() + '/' + (d.getMonth() + 1) + (isToday(it.ts) ? ' · bugun' : '');
      return '<li class="nd-feed-item"><span class="nd-feed-ico" aria-hidden="true">' + it.ico + '</span>' +
        '<span class="nd-feed-text"><b>' + esc(it.text) + '</b><span>' + esc(it.sub) + '</span></span>' +
        '<span class="nd-feed-time">' + dateStr + ' ' + hm + '</span></li>';
    }).join('') + '</ul>';
  }

  /* So'nggi natijalar — in-page statistika (oxirgi 5 real test natijasi).
     Alovida Results page yo'q: faqat dashboard kartasi ko'rsatiladi. */
  function renderRecent(u) {
    var body = $('#recentResults');
    if (!body) return;
    var recent = (u.testResults || []).slice().sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); }).slice(0, 5);
    if (!recent.length) {
      body.innerHTML =
        '<div class="nd-empty">' +
          '<div class="nd-empty-ico" aria-hidden="true">📝</div>' +
          '<h3>Hali test ishlanmagan</h3>' +
          '<p>Testlarni boshlash uchun Testlar sahifasiga o‘ting</p>' +
          '<button type="button" class="nd-btn nd-btn--ghost" data-goto="tests">Testlarga o‘tish →</button>' +
        '</div>';
      return;
    }
    var subjects = (window.__itGetSubjects && typeof window.__itGetSubjects === 'function') ? window.__itGetSubjects() : [];
    body.innerHTML = '<ul class="nd-feed">' + recent.map(function (r) {
      var d = new Date(r.timestamp);
      var dateStr = d.getDate() + '/' + (d.getMonth() + 1) + (isToday(r.timestamp) ? ' · bugun' : '');
      var ico = '📝';
      for (var i = 0; i < subjects.length; i++) {
        if (subjects[i].name === r.subject && subjects[i].icon) { ico = subjects[i].icon; break; }
      }
      var state = r.passed ? '✅ O‘tdi' : '❌ O‘tmadi';
      return '<li class="nd-feed-item">' +
        '<span class="nd-feed-ico" aria-hidden="true">' + ico + '</span>' +
        '<span class="nd-feed-text"><b>' + esc(r.subject) + ' · ' + esc(r.title || 'Test') + '</b>' +
        '<span>' + esc(state) + ' · ' + (r.score || 0) + '/' + (r.total || 0) + ' · ' + (r.percent || 0) + '%</span></span>' +
        '<span class="nd-feed-time">' + dateStr + '</span></li>';
    }).join('') + '</ul>';
  }

  /* ================== EVENTS / ANIMATSIYA / RENDER ================== */

  var bound = false;
  function bindRoot() {
    if (bound) return;
    var root = $('#ndRoot');
    if (!root) return;
    bound = true;
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-goto],[data-open-lesson]');
      if (!btn) return;
      if (btn.hasAttribute('data-open-lesson')) {
        var cid = btn.getAttribute('data-course');
        var lid = btn.getAttribute('data-lesson');
        if (cid && lid && window.Lessons && typeof window.Lessons.openLesson === 'function') {
          try { window.Lessons.openLesson(cid, lid); return; } catch (err) { /* fallback */ }
        }
        if (window.__itShowPage) window.__itShowPage('lessons');
        return;
      }
      var page = btn.getAttribute('data-goto');
      if (page === '#challenge') {
        var ch = $('#ndChallengeCard');
        if (ch) {
          ch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          ch.classList.remove('nd-flash');
          void ch.offsetWidth;
          ch.classList.add('nd-flash');
        }
        return;
      }
      if (window.__itShowPage) window.__itShowPage(page);
    });
  }

  function nextFrame(fn) {
    if (typeof window.requestAnimationFrame === 'function') {
      try { window.requestAnimationFrame(fn); return; } catch (e) { /* fallback */ }
    }
    setTimeout(fn, 16);
  }

  function animateIn() {
    var els = document.querySelectorAll('#ndRoot .nd-reveal');
    els.forEach(function (el, i) {
      el.classList.remove('nd-in');
      el.style.transitionDelay = (i * 55) + 'ms';
      var ring = el.querySelector ? el.querySelector('.nd-ring-fill') : null;
      if (ring) {
        var target = ring.getAttribute('data-off');
        ring.style.strokeDashoffset = '';
        nextFrame(function () {
          nextFrame(function () {
            ring.style.strokeDashoffset = target;
          });
        });
      }
    });
    nextFrame(function () {
      nextFrame(function () {
        els.forEach(function (el) { el.classList.add('nd-in'); });
      });
    });
  }

  function render() {
    var u = currentUser();
    if (!u) return;
    bindRoot();
    var store = lessonsStore();
    renderHero(u);
    renderHeroRobot();
    renderToday(u, store);
    renderStreak(u);
    renderLesson(u, store);
    renderTests(u);
    renderDuel(u);
    renderChallenge(u, store);
    renderStats(u);
    renderNextGoal(u);
    renderActivity(u, store);
    renderRecent(u);
    animateIn();
  }

  window.ITDashboard = { render: render };
})();