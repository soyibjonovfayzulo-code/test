/* ============================================================
   ITTest — ANDROID NATIVE HOME (home-android.js)
   Yangi bosh sahifa: FAQAT Capacitor Android (native) muhitda
   ishlaydi. Brauzerda #page-home DOMdan olib tashlanadi —
   desktop/mobil brauzer ko'rinishi umuman o'zgarmaydi.

   Real data manbalari (fake/demo data YO'Q):
     - window.__itGetCurrentUser()          (user, XP, streak)
     - window.CoursesAPI                    (kurslar/darslar)
     - localStorage darslar_state_v1::<usr> (darslar progressi)
     - window.Lessons.openCourse/openLesson (haqiqiy dars)
     - window.__itShowPage                  (haqiqiy navigatsiya)
   ============================================================ */
(function () {
  'use strict';

  var STORE_PREFIX = 'darslar_state_v1';

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isNative() {
    try {
      return !!(window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform());
    } catch (e) { return false; }
  }

  /* ---------- Real data o'qish (dashboard.js bilan bir xil kalitlar) ---------- */
  function currentUser() {
    try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
    catch (e) { return null; }
  }

  function whoKey() {
    var u = currentUser();
    return String((u && (u.username || u.email)) || 'guest').toLowerCase();
  }

  function lessonsStore() {
    var raw = null;
    try { raw = localStorage.getItem(STORE_PREFIX + '::' + whoKey()); }
    catch (e) { raw = null; }
    var store = null;
    try { store = raw ? JSON.parse(raw) : null; } catch (e) { store = null; }
    if (!store || typeof store !== 'object') store = {};
    if (!store.progress) store.progress = {};
    return store;
  }

  function coursesList() {
    try { return (window.CoursesAPI && window.CoursesAPI.listCourses()) || []; }
    catch (e) { return []; }
  }

  function completedMap(store, courseId) {
    var p = store.progress && store.progress[courseId];
    return (p && p.completed) ? p.completed : {};
  }

  function completedCountOf(store, courseId) {
    return Object.keys(completedMap(store, courseId)).length;
  }

  /* Joriy kurs: oxirgi ochilgan tugallanmagan kurs, aks holda boshlanmagan birinchi kurs */
  function pickCurrentCourse(store) {
    var courses = coursesList();
    if (!courses.length) return null;
    var best = null, bestVisit = -1;
    courses.forEach(function (c) {
      var p = store.progress[c.id];
      if (!p) return;
      if (completedCountOf(store, c.id) >= (c.lessonCount || (c.lessons || []).length || 0)) return;
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

  function currentLessonOf(store, course) {
    var lessons = (course && course.lessons) || [];
    var done = completedMap(store, course.id);
    for (var i = 0; i < lessons.length; i++) {
      if (!done[lessons[i].id]) return lessons[i];
    }
    return null;
  }

  function userXp(u) {
    return Number((u && (u.xp != null ? u.xp : u.totalXp)) || 0);
  }

  /* ---------- Navigatsiya ---------- */
  function gotoPage(name) {
    if (typeof window.__itShowPage === 'function') {
      try { window.__itShowPage(name); return; } catch (e) { /* noop */ }
    }
  }

  function openCourse(id) {
    if (window.Lessons && typeof window.Lessons.openCourse === 'function') {
      try { window.Lessons.openCourse(id); return; } catch (e) { /* fallback */ }
    }
    gotoPage('lessons');
  }

  function openCurrentLesson(course, lesson) {
    if (course && lesson && window.Lessons && typeof window.Lessons.openLesson === 'function') {
      try { window.Lessons.openLesson(course.id, lesson.id); return; } catch (e) { /* fallback */ }
    }
    openCourse(course && course.id);
  }


  /* ---------- RENDER ---------- */
  function renderTop(u) {
    var streakVal = $('#ihStreakVal');
    if (streakVal) streakVal.textContent = String((u && u.streak) || 0);
    var xpVal = $('#ihXpVal');
    if (xpVal) xpVal.textContent = String(userXp(u));
  }

  function renderContinue(u, store) {
    var body = $('#ihContinueBody');
    if (!body) return;
    var course = pickCurrentCourse(store);
    if (!course) {
      body.innerHTML = '<div class="ih-continue-empty"><span aria-hidden="true">📚</span> Darslar hali tayyor emas.</div>';
      return;
    }
    var lesson = currentLessonOf(store, course);
    var total = course.lessonCount || (course.lessons || []).length || 0;
    var done = completedCountOf(store, course.id);
    var pct = total ? Math.round((done / total) * 100) : 0;
    var started = done > 0;

    if (!lesson) {
      body.innerHTML =
        '<h3 class="ih-continue-title">' + esc(course.name) + ' tugallandi! 🎉</h3>' +
        '<p class="ih-continue-sub">' + total + ' ta darsning barchasi yakunlandi.</p>' +
        '<button type="button" class="ih-btn" data-ih-goto="lessons">🚀 Yangi yo‘nalish tanlash</button>';
      return;
    }

    var lessonTitle = (lesson.number ? lesson.number + '-dars: ' : '') + (lesson.title || '');
    body.innerHTML =
      '<h3 class="ih-continue-title">' + esc(course.name) + ' — ' + esc(lessonTitle) + '</h3>' +
      '<p class="ih-continue-sub">' + esc(course.tagline || 'Darsni davom ettiring') + '</p>' +
      '<div class="ih-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"' +
      ' aria-label="Kurs progressi"><span id="ihContFill" style="width:' + pct + '%"></span></div>' +
      '<div class="ih-progress-meta"><span>' + pct + '% · ' + done + '/' + total + ' dars</span>' +
      '<span>⏱ ~15 daqiqa</span></div>' +
      '<button type="button" class="ih-btn" id="ihContBtn" data-course="' + esc(course.id) + '"' +
      ' data-lesson="' + esc(lesson.id) + '">' + (started ? '▶ Davom ettirish' : '🚀 O‘rganishni boshlash') + '</button>';
  }

  function renderMe(u) {
    var box = $('#ihMe');
    if (!box || !u) return;
    var name = u.firstname || u.username || 'Foydalanuvchi';
    var xp = userXp(u);
    var lvl = Math.floor(xp / 100) + 1;
    var base = xp % 100;
    var sub = (u.streak || 0) > 0
      ? '🔥 ' + Number(u.streak) + ' kunlik streak davom etmoqda — bugun ham bir qadam oldinga.'
      : 'Bugun atigi 15 daqiqa ajrating — o‘zingizni kechagidan kuchliroq qiling.';
    box.innerHTML =
      '<h3>Xush kelibsiz, ' + esc(name) + '! 👋</h3>' +
      '<p class="ih-me-sub">' + sub + '</p>' +
      '<div class="ih-me-row">' +
        '<span class="ih-level-badge">Level ' + lvl + '</span>' +
        '<div class="ih-me-xp">' +
          '<span class="ih-me-xp-text">' + base + ' / 100 XP · ⭐ ' + xp + ' XP</span>' +
          '<div class="ih-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + base + '"' +
          ' aria-label="Level XP progressi"><span style="width:' + base + '%"></span></div>' +
        '</div>' +
      '</div>';
  }

  function renderAll() {
    var u = currentUser();
    var store = lessonsStore();
    renderTop(u);
    renderContinue(u, store);
    renderMe(u);
  }


  /* ---------- QIDIRUV (real kurslar bo'yicha) ---------- */
  function bindSearch() {
    var input = $('#ihSearchInput');
    var results = $('#ihSearchResults');
    if (!input || !results || input.dataset.ihBound) return;
    input.dataset.ihBound = '1';

    function hide() { results.hidden = true; results.innerHTML = ''; }

    input.addEventListener('input', function () {
      var q = String(input.value || '').trim().toLowerCase();
      if (q.length < 2) { hide(); return; }
      var matches = coursesList().filter(function (c) {
        return String(c.name || c.id || '').toLowerCase().indexOf(q) !== -1;
      }).slice(0, 5);
      if (!matches.length) {
        results.innerHTML = '<div class="ih-search-empty">Hech narsa topilmadi — «' + esc(input.value) + '»</div>';
      } else {
        results.innerHTML = matches.map(function (c) {
          var n = c.lessonCount || (c.lessons || []).length || 0;
          return '<button type="button" class="ih-search-item" data-course="' + esc(c.id) + '">' +
            '<span aria-hidden="true">' + esc(c.icon || '📘') + '</span>' +
            '<span>' + esc(c.name || c.id) + '<br /><small>' + n + ' ta dars</small></span></button>';
        }).join('');
      }
      results.hidden = false;
    });

    results.addEventListener('click', function (e) {
      var item = e.target.closest('.ih-search-item');
      if (!item) return;
      hide();
      input.value = '';
      openCourse(item.getAttribute('data-course'));
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hide(); input.blur(); }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#ihSearchResults') && !e.target.closest('.ih-search')) hide();
    });
  }

  /* ---------- UMUMIY CLICK DELEGATSIYA ---------- */
  function bindRoot() {
    var root = $('#page-home');
    if (!root || root.dataset.ihBound) return;
    root.dataset.ihBound = '1';
    root.addEventListener('click', function (e) {
      var cont = e.target.closest('#ihContBtn');
      if (cont) {
        var cid = cont.getAttribute('data-course');
        var lid = cont.getAttribute('data-lesson');
        var course = window.CoursesAPI ? window.CoursesAPI.getCourse(cid) : null;
        var lesson = null;
        if (course && course.lessons) {
          for (var i = 0; i < course.lessons.length; i++) {
            if (course.lessons[i].id === lid) { lesson = course.lessons[i]; break; }
          }
        }
        openCurrentLesson(course, lesson);
        return;
      }
      var el = e.target.closest('[data-ih-goto]');
      if (el) gotoPage(el.getAttribute('data-ih-goto'));
    });
  }

  /* ---------- SAHIFA AKTIVLIGINI KUZATISH ---------- */
  function observe() {
    var sec = $('#page-home');
    if (!sec) return;
    function sync() {
      var active = sec.classList.contains('active');
      document.body.classList.toggle('ithome-active', active);
      if (active) renderAll();
    }
    if (typeof MutationObserver === 'function') {
      new MutationObserver(sync).observe(sec, { attributes: true, attributeFilter: ['class'] });
    } else {
      setInterval(sync, 600);
    }
    sync();
  }

  /* ---------- ANDROID APPARAT "ORQAGA" TUGMASI (BACK BUTTON) ---------- */
  var lastBackPressTime = 0;

  function handleAndroidBack() {
    // 1. Sidebar drawer
    var sidebar = $('#sidebar');
    var sidebarOverlay = $('#sidebarOverlay');
    if (sidebar && sidebar.classList.contains('active')) {
      var sidebarClose = $('#sidebarClose');
      if (sidebarClose) sidebarClose.click();
      else {
        sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      }
      return true;
    }

    // 2. Ochiq modallar / overlaylar
    var modals = [
      $('.itc-viewer-overlay:not(.hidden)'),
      $('.itc-name-overlay:not(.hidden)'),
      $('.itc-verify-overlay:not(.hidden)'),
      $('#aiPanel.active, #aiPanel:not(.hidden):not([style*="display: none"])'),
      $('.streak-modal-overlay:not(.hidden)'),
      $('#logoutConfirmModal.active, #logoutConfirmModal:not(.hidden):not([style*="display: none"])'),
      $('#startTestModal.active, #startTestModal:not(.hidden):not([style*="display: none"])'),
      $('#finishTestModal.active, #finishTestModal:not(.hidden):not([style*="display: none"])'),
      $('#editProfileModal.active, #editProfileModal:not(.hidden):not([style*="display: none"])'),
      $('#projectSaveModal.active, #projectSaveModal:not(.hidden):not([style*="display: none"])'),
      $('#projectNewModal.active, #projectNewModal:not(.hidden):not([style*="display: none"])'),
      $('#projectDeleteModal.active, #projectDeleteModal:not(.hidden):not([style*="display: none"])'),
      $('#achievementModal.active, #achievementModal:not(.hidden):not([style*="display: none"])'),
      $('#giftModal.active, #giftModal:not(.hidden):not([style*="display: none"])'),
      $('#sendGiftModal.active, #sendGiftModal:not(.hidden):not([style*="display: none"])'),
      $('#lessonLevelModal.active, #lessonLevelModal:not(.hidden):not([style*="display: none"])'),
      $('#lessonLockedModal.active, #lessonLockedModal:not(.hidden):not([style*="display: none"])'),
      $('#lessonSettingsModal.active, #lessonSettingsModal:not(.hidden):not([style*="display: none"])'),
      $('#ihSearchResults:not([hidden])')
    ];

    for (var i = 0; i < modals.length; i++) {
      var m = modals[i];
      if (m && !m.hidden && m.style.display !== 'none') {
        var closeBtn = m.querySelector('.close-btn, .modal-close, .itc-viewer-close, .itc-close, [data-close], .cancel-btn');
        if (closeBtn) { closeBtn.click(); return true; }
        m.classList.remove('active');
        m.classList.add('hidden');
        if (m.id === 'ihSearchResults') m.hidden = true;
        return true;
      }
    }

    // 3. Lessons ichki navigatsiyasi
    var lessonView = $('#page-lesson-view') || $('#page-lessonView');
    if (lessonView && lessonView.classList.contains('active')) {
      var backBtn = lessonView.querySelector('.ls-viewer-back, .ls-back-btn, [data-back]');
      if (backBtn) { backBtn.click(); return true; }
      gotoPage('lessons');
      return true;
    }

    // 4. Test o'tkazish sahifasi
    var pageTest = $('#page-test');
    if (pageTest && pageTest.classList.contains('active')) {
      var quitBtn = pageTest.querySelector('#quitTestBtn, .quit-test-btn');
      if (quitBtn) { quitBtn.click(); return true; }
      gotoPage('tests');
      return true;
    }
    var pageTestList = $('#page-testlist');
    if (pageTestList && pageTestList.classList.contains('active')) {
      gotoPage('tests');
      return true;
    }

    // 5. Boshqa sahifalardan Home/Dashboard ga qaytish
    var activePage = $('.page.active');
    var isHome = activePage && (activePage.id === 'page-home' || activePage.id === 'page-dashboard');
    if (activePage && !isHome) {
      if (isNative()) gotoPage('home');
      else gotoPage('dashboard');
      return true;
    }

    // 6. Home sahifasida ikki marta orqaga bosilganda ilovadan chiqish
    var now = Date.now();
    if (now - lastBackPressTime < 2000) {
      try {
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App && typeof window.Capacitor.Plugins.App.exitApp === 'function') {
          window.Capacitor.Plugins.App.exitApp();
        }
      } catch (e) { /* noop */ }
    } else {
      lastBackPressTime = now;
      if (typeof window.showToast === 'function') {
        window.showToast("Chiqish uchun yana bir bor bosing", "info");
      }
    }
    return true;
  }

  function bindBackButton() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        window.Capacitor.Plugins.App.addListener('backButton', function () {
          handleAndroidBack();
        });
      }
    } catch (e) { /* noop */ }

    document.addEventListener('backbutton', function (e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      handleAndroidBack();
    });
  }

  /* Native bo'lmasa — sahifani butunlay DOMdan olib tashlash (brauzer himoyasi) */
  function init() {
    bindBackButton();
    var sec = $('#page-home');
    if (!isNative()) {
      if (sec && sec.parentNode) sec.parentNode.removeChild(sec);
      return;
    }
    bindRoot();
    bindSearch();
    observe();
  }

  /* script.js showPage("dashboard") native muhitda home'ga yo'naltirilishi uchun */
  window.ITHome = {
    enabled: isNative,
    handleBackButton: handleAndroidBack
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
