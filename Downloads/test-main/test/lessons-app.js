/* ==========================================================
   DARSLAR TIZIMI — ASOSIY LOGIKA
   ==========================================================
   window.Lessons  — UI boshqaruvi (script.js showPage() chaqiradi)
   window.LessonsHooks — kelajakdagi funksiyalar uchun hook'lar
   (XP, Coin, Streak, Achievement, Leaderboard...)

   Ma'lumot manbasi: lessons-data.js -> window.CoursesAPI
   Progress: localStorage (foydalanuvchi bo'yicha ajratilgan)
   ========================================================== */

(function () {
  'use strict';

  /* ---------- YORDAMCHILAR ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  /** Matn formatteri: `kod` -> inline code, **matn** -> qalin, \n -> yangi qator */
  function fmtText(str) {
    return esc(str)
      .replace(/`([^`]+)`/g, '<code class="ls-inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
  }
  /** Savol/variant formatteri: faqat `kod` markeri */
  function fmt(str) {
    return esc(str).replace(/`([^`]+)`/g, '<code class="ls-inline-code">$1</code>');
  }
  /** Massivni aralashtirish (Fisher-Yates) */
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function toast(msg, type) {
    if (typeof window.showToast === 'function') window.showToast(msg, type || 'info');
    else console.log('[Darslar]', msg);
  }
  /** prefers-reduced-motion yoqilganmi? */
  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  /** Elementga bir martalik shake animatsiyasi */
  function shakeEl(el) {
    if (!el || reducedMotion()) return;
    el.classList.remove('ls-shake');
    void el.offsetWidth; // reflow — animatsiyani qayta ishga tushirish uchun
    el.classList.add('ls-shake');
    setTimeout(function () { el.classList.remove('ls-shake'); }, 520);
  }

  /* 🤖 ITTest Robot reaksiyasi — to'g'ri javob: quvonch, xato: yordam holati */
  function mascotReact(state) {
    try {
      if (window.ITMascot && typeof window.ITMascot.setStateIn === 'function') {
        const host = document.getElementById('lsLessonContainer') || document;
        window.ITMascot.setStateIn(host, state);
        if (state === 'success' || state === 'error') {
          setTimeout(function () { window.ITMascot.setStateIn(host, 'idle'); }, 1800);
        }
      }
    } catch (e) { /* mascot ixtiyoriy — dars buzilmasin */ }
  }
  /** Progress barlar 0'dan haqiqiy qiymatgacha smooth to'ladi (0.8–1.2s) */
  function animateProgressBars(scope) {
    $$('.ls-progress-track span, .ls-continue-bar span', scope || document).forEach(function (bar) {
      const target = bar.style.width || '0%';
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth; // reflow
      bar.style.transition = ''; // CSS transition tiklanadi (width .8-.9s)
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { bar.style.width = target; });
      });
    });
  }
  function page(name) {
    if (typeof window.__itShowPage === 'function') window.__itShowPage(name);
    else console.warn('__itShowPage mavjud emas — script.js yangilanmaganmi?');
  }
  function currentUser() {
    try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
    catch (e) { return null; }
  }

  /* ---------- BILIM DARAJALARI ---------- */
  const LEVELS = {
    beginner: {
      id: 'beginner',
      emoji: '1️⃣',
      title: 'Umuman bilmayman',
      desc: 'Hali deyarli ishlamaganman. Men 0 dan boshlamoqchiman.',
      sequential: true   // darslar ketma-ket ochiladi
    },
    intermediate: {
      id: 'intermediate',
      emoji: '2️⃣',
      title: 'Asoslarini bilaman',
      desc: 'Biroz ishlaganman, asosiy tushunchalarni bilaman. Bilimimni mustahkamlamoqchiman.',
      sequential: false  // barcha darslar ochiq
    },
    advanced: {
      id: 'advanced',
      emoji: '3️⃣',
      title: 'Yaxshi bilaman',
      desc: 'Bemalol ishlayman. Kerakli mavzuni to‘g‘ridan-to‘g‘ri tanlab o‘rganmoqchiman.',
      sequential: false  // barcha darslar ochiq
    }
  };
  const LEVEL_LABELS = {
    beginner: 'Umuman bilmayman',
    intermediate: 'Asoslarini bilaman',
    advanced: 'Yaxshi bilaman'
  };

  /* ---------- STORAGE (foydalanuvchi bo'yicha) ---------- */
  const STORE_PREFIX = 'darslar_state_v1';
  let store = null;

  function userStoreKey() {
    const u = currentUser();
    const who = u ? (u.username || u.email || 'user') : 'guest';
    return STORE_PREFIX + '::' + String(who).toLowerCase();
  }

  function defaultStore() {
    return { levels: {}, progress: {} };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(userStoreKey());
      store = raw ? JSON.parse(raw) : defaultStore();
    } catch (e) { store = defaultStore(); }
    if (!store.levels) store.levels = {};
    if (!store.progress) store.progress = {};
    return store;
  }

  function saveStore() {
    try { localStorage.setItem(userStoreKey(), JSON.stringify(store)); }
    catch (e) { console.warn('localStorage yozib bo‘lmadi', e); }
  }

  /* Qayta kirganda o'sha foydalanuvchi ma'lumotlari o'qilishi uchun
     har bir sahifa ko'rsatilishida store qayta yuklanadi. */

  /* ---------- PROGRESS / QULF LOGIKASI ---------- */

  /** Kurs bo'yicha progress obyekti */
  function courseProgress(courseId) {
    if (!store) loadStore();
    return store.progress[courseId] || { completed: {}, lastLessonId: null, lastVisit: 0 };
  }

  function completedCount(courseId) {
    return Object.keys(courseProgress(courseId).completed).length;
  }

  function isLessonCompleted(courseId, lessonId) {
    return !!courseProgress(courseId).completed[lessonId];
  }

  /** Progress foizi */
  function progressPercent(courseId, course) {
    const total = course ? course.lessonCount : 0;
    if (!total) return 0;
    return Math.round((completedCount(courseId) / total) * 100);
  }

  /** Bilim darajasi (tanlanmagan bo'lsa null) */
  function levelOf(courseId) {
    if (!store) loadStore();
    return store.levels[courseId] || null;
  }

  function setLevel(courseId, levelId) {
    if (!LEVELS[levelId]) return;
    if (!store) loadStore();
    store.levels[courseId] = levelId;
    saveStore();
  }

  /**
   * Dars ochiq yoki yo'q.
   * beginner  -> faqat 1-dars va oldingi darslari tugallanganlar ochiq
   * boshqalar -> hammasi ochiq
   */
  function isLessonUnlocked(course, lesson, index) {
    const lvl = levelOf(course.id) || 'intermediate';
    if (!LEVELS[lvl].sequential) return true;
    if (index === 0) return true;
    const prev = course.lessons[index - 1];
    return !!prev && isLessonCompleted(course.id, prev.id);
  }

  /** Keyingi o'rganiladigan (joriy) dars — birinchi ochiq va tugallanmagan */
  function currentLesson(course) {
    for (let i = 0; i < course.lessons.length; i++) {
      if (!isLessonCompleted(course.id, course.lessons[i].id)) return course.lessons[i];
    }
    return null;
  }

  /** Dars o'qilganmi? (darsni oxirigacha ko'rish yoki "O'qidim" belgisi) */
  function isLessonRead(courseId, lessonId) {
    const p = courseProgress(courseId);
    return !!(p.read && p.read[lessonId]);
  }

  /** Darsni o'qilgan deb belgilash */
  function markLessonRead(courseId, lessonId) {
    const p = courseProgress(courseId);
    if (!p.read) p.read = {};
    if (!p.read[lessonId]) {
      p.read[lessonId] = { at: Date.now() };
      saveStore();
      return true;
    }
    return false;
  }

  /** Dars testining oxirgi natijasi (yoki null) */
  function getTestResult(courseId, lessonId) {
    const p = courseProgress(courseId);
    return (p.testResults && p.testResults[lessonId]) || null;
  }
  /** Kurs bo'yicha "davom ettirish" darsini aniqlash */
  function resumeLesson(course) {
    const prog = courseProgress(course.id);
    if (prog.lastLessonId) {
      const idx = course.lessons.findIndex(function (l) { return l.id === prog.lastLessonId; });
      if (idx !== -1) {
        const last = course.lessons[idx];
        if (!isLessonCompleted(course.id, last.id)) return last;
        // oxirgi dars tugallangan bo'lsa — keyingisiga o'tish
        const next = course.lessons[idx + 1];
        if (next && isLessonUnlocked(course, next, idx + 1)) return next;
      }
    }
    return currentLesson(course);
  }

  /** Eng oxirgi ochilgan tugallanmagan kurs (davom ettirish banneri uchun) */
  function lastActiveCourseId() {
    if (!store) loadStore();
    let best = null;
    Object.keys(store.progress).forEach(function (cid) {
      const prog = store.progress[cid];
      const course = window.CoursesAPI.getCourse(cid);
      if (!course) return;
      if (Object.keys(prog.completed).length >= course.lessonCount) return; // tugallangan
      if (!best || (prog.lastVisit || 0) > (store.progress[best].lastVisit || 0)) best = cid;
    });
    return best;
  }

  /** Umuman boshlanmagan birinchi kurs (banner fallback) */
  function firstNotStartedCourseId() {
    const courses = window.CoursesAPI.listCourses();
    for (let i = 0; i < courses.length; i++) {
      if (completedCount(courses[i].id) === 0) return courses[i].id;
    }
    return courses.length ? courses[0].id : null;
  }

  /* ---------- TEST KONSTANTALARI ---------- */
  const QUIZ_QUESTIONS_PER_TEST = 5;   // har bir urinishda nechta savol chiqadi
  const LESSON_COIN_REWARD = 20;       // testdan o'tganda beriladigan coin

  /* ---------- ICHKI HOLAT ---------- */
  const state = {
    currentCourseId: null,   // kurs sahifasida ko'rilayotgan kurs
    currentLessonId: null,   // viewer'da ochilgan dars
    lessonPhase: 'read',     // 'read' | 'quiz' | 'result' — darsning joriy bosqichi
    quiz: null,              // aktiv test urinishasi: { items, answers, index, result }
    diagnostic: null,        // darajani aniqlash testi: { courseId, items, answers, index }
    _scrollCleanup: null     // read kuzatuv scroll listenerini tozalash
  };

  /* ---------- KELAJAKDAGI FUNKSIYALAR UCHUN HOOK'LAR ---------- */
  /* Namuna: window.LessonsHooks.onLessonComplete.push(function (info) { ... });
     info = { courseId, course, lesson, xp, coins, totalCompleted, courseCompleted } */
  const Hooks = {
    onLessonComplete: [],
    onLevelChange: []
    // TODO: XP, Coin, Streak, Achievement, Leaderboard integratsiyalari
    // shu hook'lar orqali qo'shiladi — asosiy logikani o'zgartirmasdan.
  };

  /* ---------- DARS TUGALLASH EFFEKTLARI ---------- */
  /* 🎉 notification + ✨ confetti + ⭐ XP + 🪙 Coin + 🔓 keyingi dars.
     XP/coin balans o'zgarishlari kelajakda onLessonComplete hook'lari orqali
     ulanadi; bu yerda faqat vizual effektlar va tayyor struktura. */
  const Effects = {
    /** ✨ Confetti/particle — script.js'dagi mavjud triggerConfetti ishlatiladi.
        prefers-reduced-motion yoqilgan bo'lsa o'tkazib yuboriladi. */
    confetti: function () {
      if (reducedMotion()) return;
      try { if (typeof window.__itConfetti === 'function') window.__itConfetti(); }
      catch (e) { /* effekt muhim emas — xatolikni e'tiborsiz qoldirish */ }
    },
    /** To'liq nishonlash nuqtasi (kelajakda bu yerga qo'shimcha animatsiyalar qo'shiladi) */
    celebrate: function (info) {
      this.confetti();
    }
  };

  /* ==========================================================
     1) DARSLAR BOSH SAHIFASI — kurslar grid
     ========================================================== */
  function renderCoursesPage() {
    loadStore();
    const contSlot = $('#lsContinueSlot');
    const grid = $('#lsCoursesGrid');
    if (!grid) return;

    // --- Davom ettirish banneri ---
    if (contSlot) {
      const activeId = lastActiveCourseId() || firstNotStartedCourseId();
      const course = activeId ? window.CoursesAPI.getCourse(activeId) : null;
      if (course) {
        const pct = progressPercent(course.id, course);
        const res = resumeLesson(course);
        contSlot.innerHTML =
          '<div class="ls-continue">' +
            '<div class="ls-continue-info">' +
              '<div class="ls-continue-icon">' + esc(course.icon) + '</div>' +
              '<div class="ls-continue-text">' +
                '<h3>👋 O‘qishni davom ettiring</h3>' +
                '<p>' + esc(course.name) + (res ? ' — ' + res.number + '-dars: ' + esc(res.title) : ' — kurs yakunlangan! 🎉') + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="ls-continue-progress">' +
              '<div class="ls-continue-bar"><span style="width:' + pct + '%"></span></div>' +
              '<span class="ls-continue-pct">' + pct + '%</span>' +
            '</div>' +
            '<button type="button" class="btn ls-btn-continue" id="lsContinueBtn">Davom ettirish <span class="ls-btn-arrow">→</span></button>' +
          '</div>';
        const btn = $('#lsContinueBtn');
        if (btn) btn.addEventListener('click', function () { openCourse(course.id); });
      } else {
        contSlot.innerHTML = '';
      }
    }

    // --- Kurs kartalari ---
    const courses = window.CoursesAPI.listCourses();
    if (!courses.length) {
      grid.innerHTML =
        '<div class="ls-empty" style="grid-column:1/-1">' +
          '<div class="ls-empty-ico">📭</div>' +
          '<h4>Kurslar hozircha bo‘sh</h4>' +
          '<p>Kurslar tez orada qo‘shiladi.</p>' +
        '</div>';
      return;
    }
    grid.innerHTML = courses.map(function (c, i) {
      const done = completedCount(c.id);
      const pct = progressPercent(c.id, c);
      const finished = done >= c.lessonCount && c.lessonCount > 0;
      const label = pct > 0 ? 'Davom ettirish <span class="ls-btn-arrow">→</span>' : 'Boshlash <span class="ls-btn-arrow">→</span>';
      return (
        '<div class="ls-course-card" data-course="' + esc(c.id) + '" style="--ls-color:' + esc(c.color) + ';animation-delay:' + (Math.min(i, 11) * 50) + 'ms">' +
          '<div class="ls-course-top">' +
            '<div class="ls-course-icon">' + esc(c.icon) + '</div>' +
            (finished ? '<span class="ls-course-done-badge">✅ Tugallangan</span>' : '') +
          '</div>' +
          '<h4>' + esc(c.name) + '</h4>' +
          '<p>' + esc(c.tagline) + '</p>' +
          '<div class="ls-course-meta"><span>📚 <strong>' + c.lessonCount + '</strong> ta dars</span>' +
            (done > 0 ? '<span>✅ <strong>' + done + '</strong> tugallangan</span>' : '') + '</div>' +
          '<div class="ls-course-progress-row">' +
            '<div class="ls-progress-track"><span style="width:' + pct + '%"></span></div>' +
            '<span class="ls-progress-pct">' + pct + '%</span>' +
          '</div>' +
          '<button type="button" class="btn btn-primary ls-course-open">' + label + '</button>' +
        '</div>'
      );
    }).join('');

    // Kartalar bosilishi
    $$('.ls-course-card', grid).forEach(function (card) {
      card.addEventListener('click', function () { openCourse(card.getAttribute('data-course')); });
    });

    // Progress barlar 0'dan smooth to'lishi
    animateProgressBars($('#page-lessons'));
  }

  /* ==========================================================
     2) KURS SAHIFASI — darslar ro'yxati
     ========================================================== */
  function openCourse(courseId) {
    const course = window.CoursesAPI.getCourse(courseId);
    if (!course) { toast('Kurs topilmadi', 'error'); return; }
    state.currentCourseId = courseId;
    state.currentLessonId = null;
    state.lessonPhase = 'read';
    state.quiz = null;
    loadStore();
    // Birinchi marta kirilyotgan bo'lsa — bilim darajasi so'raladi
    if (!levelOf(courseId)) {
      renderCoursePage();
      page('lessonCourse');
      openLevelModal(courseId, true);
      return;
    }
    renderCoursePage();
    page('lessonCourse');
  }

  function renderCoursePage() {
    const wrap = $('#lsCourseContainer');
    if (!wrap) return;
    loadStore();
    const course = window.CoursesAPI.getCourse(state.currentCourseId);
    if (!course) {
      wrap.innerHTML = '<div class="ls-empty"><div class="ls-empty-ico">🤔</div><h4>Kurs topilmadi</h4><p>Darslar sahifasidan kursni tanlang.</p></div>';
      return;
    }
    const done = completedCount(course.id);
    const pct = progressPercent(course.id, course);
    const lvl = levelOf(course.id);
    const cur = currentLesson(course);

    const titleEl = $('#pageTitle');
    if (titleEl) titleEl.textContent = course.name + ' kursi';

    let head =
      '<div class="ls-course-head" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-course-head-icon">' + esc(course.icon) + '</div>' +
        '<div class="ls-course-head-info">' +
          '<h3>' + esc(course.name) + ' kursi</h3>' +
          '<p>' + esc(course.description) + '</p>' +
          '<div class="ls-course-progress-row">' +
            '<div class="ls-progress-track"><span style="width:' + pct + '%"></span></div>' +
            '<span class="ls-progress-pct">' + pct + '%</span>' +
          '</div>' +
          '<div class="ls-course-meta" style="margin-top:10px">' +
            '<span>📚 <strong>' + course.lessonCount + '</strong> ta dars</span>' +
            '<span>✅ <strong>' + done + '</strong> tugallangan</span>' +
            (cur ? '<span>🔵 Joriy: <strong>' + cur.number + '-dars</strong></span>' : '<span>🎉 Hammasi tugallangan!</span>') +
          '</div>' +
        '</div>' +
        '<div class="ls-course-head-actions">' +
          '<button type="button" class="btn btn-ghost ls-course-back" id="lsBackToLessons">← Darslar</button>' +
          '<span class="ls-level-chip">🧠 Bilim darajasi: <strong>' + esc(lvl ? LEVEL_LABELS[lvl] : '—') + '</strong></span>' +
          '<button type="button" class="btn btn-ghost" id="lsSettingsBtn">⚙️ O‘rganish sozlamalari</button>' +
          (cur ? '<button type="button" class="btn btn-primary" id="lsResumeBtn">Davom ettirish <span class="ls-btn-arrow">→</span></button>' : '') +
        '</div>' +
      '</div>';

    let list;
    if (!course.lessons.length) {
      list = '<div class="ls-empty"><div class="ls-empty-ico">📭</div><h4>Darslar hozircha bo‘sh</h4><p>Ushbu kursga darslar tez orada qo‘shiladi.</p></div>';
    } else {
      list = '<div class="ls-lessons-grid">' + course.lessons.map(function (l, i) {
        const unlocked = isLessonUnlocked(course, l, i);
        const completed = isLessonCompleted(course.id, l.id);
        const isCur = cur && cur.id === l.id && !completed;
        let cls = 'ls-lesson-card', ico;
        if (!unlocked) { cls += ' ls-locked'; ico = '🔒'; }
        else if (completed) { cls += ' ls-completed'; ico = '✅'; }
        else {
          // Joriy (davom ettiriladigan) dars — CSS uslubi .ls-lesson-card.ls-current
          if (isCur) cls += ' ls-current';
          ico = isLessonRead(course.id, l.id) ? '📖' : '🧪';
        }
        return (
          '<div class="' + cls + '" data-lesson="' + esc(l.id) + '" style="animation-delay:' + (Math.min(i, 12) * 35) + 'ms">' +
            '<div class="ls-lesson-num">' + String(l.number).padStart(2, '0') +
              '<span class="ls-state-ico">' + ico + '</span>' +
            '</div>' +
            '<div class="ls-lesson-info">' +
              '<h5>' + esc(l.title) + '</h5>' +
              '<p><span>' + esc(l.difficulty) + '</span><span>⏱ ' + l.duration + ' daqiqa</span></p>' +
            '</div>' +
            '<span class="ls-lesson-arrow">→</span>' +
          '</div>'
        );
      }).join('') + '</div>';
    }

    wrap.innerHTML = head + list;

    // Eventlar
    $$('.ls-lesson-card', wrap).forEach(function (card) {
      card.addEventListener('click', function () {
        const lid = card.getAttribute('data-lesson');
        const f = window.CoursesAPI.findLesson(state.currentCourseId, lid);
        // Qulflangan dars: cardga shake + toast (modal openLesson ichida ochiladi)
        if (f && !isLessonUnlocked(f.course, f.lesson, f.index)) shakeEl(card);
        openLesson(state.currentCourseId, lid);
      });
    });
    const settingsBtn = $('#lsSettingsBtn');
    if (settingsBtn) settingsBtn.addEventListener('click', function () { openSettingsModal(state.currentCourseId); });
    const backBtn = $('#lsBackToLessons');
    if (backBtn) backBtn.addEventListener('click', function () {
      state.currentCourseId = null;
      state.currentLessonId = null;
      state.diagnostic = null;
      page('lessons');
    });
    const resumeBtn = $('#lsResumeBtn');
    if (resumeBtn) resumeBtn.addEventListener('click', function () {
      const res = resumeLesson(course);
      if (res) openLesson(course.id, res.id);
    });

    // Progress bar 0'dan smooth to'lishi
    animateProgressBars(wrap);
  }

  /* ==========================================================
     3) DARSNI OCHISH + QULF MODALI
     ========================================================== */
  function openLesson(courseId, lessonId) {
    const found = window.CoursesAPI.findLesson(courseId, lessonId);
    if (!found) { toast('Dars topilmadi', 'error'); return; }
    const course = found.course, lesson = found.lesson, index = found.index;

    if (!isLessonUnlocked(course, lesson, index)) {
      openLockedModal(course, lesson, index);
      return; // foydalanuvchi boshqa sahifaga olib ketilmaydi
    }

    state.currentCourseId = courseId;
    state.currentLessonId = lessonId;
    state.lessonPhase = 'read'; // har doim o'qish bosqichidan boshlanadi
    state.quiz = null;
    // oxirgi faollikni saqlash (davom ettirish uchun)
    const prog = courseProgress(courseId);
    prog.lastLessonId = lessonId;
    prog.lastVisit = Date.now();
    store.progress[courseId] = prog;
    saveStore();

    renderLessonView();
    page('lessonView');
  }

  function openLockedModal(course, lesson, index) {
    // Kichik notification (toast) — smooth slide/fade bilan
    toast('🔒 Bu dars hozircha yopiq. Avvalgi darsni tugating.', 'warning');
    const modal = $('#lessonLockedModal');
    const body = $('#lessonLockedBody');
    const footer = $('#lessonLockedFooter');
    if (!modal || !body) return;
    const prev = course.lessons[index - 1];
    body.innerHTML =
      '<div class="ls-locked-body">' +
        '<div class="ls-locked-ico">🔒</div>' +
        '<h4>Bu dars hozircha yopiq</h4>' +
        '<p>Avvalgi darsni tugatib, keyingi mavzuni oching.<br>' +
        'Progressingiz: <strong>' + progressPercent(course.id, course) + '%</strong> (' +
        completedCount(course.id) + '/' + course.lessonCount + ' dars)</p>' +
        (prev ? '<span class="ls-locked-prev">🔓 ' + prev.number + '-dars: ' + esc(prev.title) + '</span>' : '') +
      '</div>';
    if (footer) {
      footer.innerHTML = prev
        ? '<button type="button" class="btn btn-primary" id="lsGoPrevBtn">← Oldingi darsga o‘tish</button>' +
          '<button type="button" class="btn btn-ghost" data-close>Yopish</button>'
        : '<button type="button" class="btn btn-primary" data-close>Yopish</button>';
      const goPrev = $('#lsGoPrevBtn');
      if (goPrev) goPrev.addEventListener('click', function () {
        modal.classList.remove('active');
        openLesson(course.id, prev.id);
      });
    }
    modal.classList.add('active');
  }

  /* ==========================================================
     4) DARS VIEWER — 3 BOSQICH: 📚 Read | 🧪 Quiz | 🏆 Result
     ========================================================== */

  /** Scroll kuzatuvini tozalash */
  function cleanupScroll() {
    if (state._scrollCleanup) {
      try { state._scrollCleanup(); } catch (e) { /* ignore */ }
      state._scrollCleanup = null;
    }
  }

  /** Dars kontentini HTML bloklarga aylantirish (bo'limlar + kod + natija + eslatmalar) */
  function renderLessonContentHTML(content, course, lesson) {
    let html = '';
    if (content.intro) {
      html += '<div class="ls-content-intro">💡 ' + fmtText(content.intro) + '</div>';
    }
    // 🔁 Tezkor eslatma — review savollari BITTADAN chiqadi
    if (content.reviewQuiz) {
      const rq = content.reviewQuiz;
      html += '<div class="ls-review-quiz" id="lsReviewQuiz">' +
        '<div class="ls-rq-title">' + esc(rq.title || '🔁 Tezkor eslatma') + '</div>' +
        (rq.subtitle ? '<div class="ls-rq-sub">' + fmtText(rq.subtitle) + '</div>' : '') +
        '<div class="ls-rq-body" data-rq-body></div>' +
        '</div>';
    }
    // "Eslab qol" — oldingi darslar review kartalari
    if (Array.isArray(content.review) && content.review.length) {
      html += '<div class="ls-review-cards"><div class="ls-review-cards-title">' + esc(content.reviewTitle || '🔁 Eslab qol') + '</div><div class="ls-review-cards-grid">' +
        content.review.map(function (c) {
          return '<div class="ls-review-card"><code>' + esc(c.t) + '</code><span>' + esc(c.d) + '</span></div>';
        }).join('') + '</div></div>';
    }
    (content.sections || []).forEach(function (sec, i) {
      html += '<div class="ls-content-section">';
      html += '<div class="ls-content-sec-title"><span class="ls-sec-num">' + (i + 1) + '</span><span>' + esc(sec.title || '') + '</span></div>';
      if (sec.text) html += '<div class="ls-content-text">' + fmtText(sec.text) + '</div>';
      if (sec.code) {
        html += '<div class="ls-content-codeblock">' +
          '<div class="ls-code-lang">💻 HTML</div>' +
          '<pre class="ls-content-code">' + esc(sec.code) + '</pre>' +
          (sec.codeNote ? '<div class="ls-content-codenote">🔍 <b>Kod izohi:</b> ' + fmtText(sec.codeNote) + '</div>' : '') +
          (sec.playground ? '<button type="button" class="ls-open-playground" data-ls-raw-code="' + esc(sec.code) + '">💻 CODINGDA SINAB KO‘R</button>' : '') +
          (sec.demoButton ? '<button type="button" class="ls-open-playground ls-alert-demo" data-alert-msg="' + esc(sec.demoButton.msg) + '">' + esc(sec.demoButton.label) + '</button>' : '') +
          '</div>';
      }
      if (sec.previewHtml) {
        html += '<div class="ls-img-preview" data-img-url="' + esc(sec.imgCheckUrl || '') + '">' +
          '<iframe class="ls-img-preview-frame" title="Preview" sandbox="allow-same-origin" srcdoc="' + esc(sec.previewHtml) + '"></iframe>' +
          (sec.previewCaption ? '<div class="ls-img-caption">' + fmtText(sec.previewCaption) + '</div>' : '') +
          '<div class="ls-img-failed" hidden>⚠️ Rasm yuklanmadi — internet aloqasini tekshiring.</div>' +
          '</div>';
      }
      if (sec.liveDemo) {
        /* 🎮 REAL INTERACTIVE DEMO — chapda kod, o'ngda haqiqiy preview (Run bosilganda srcdoc yangilanadi) */
        html += '<div class="ls-livedemo">' +
          '<div class="ls-livedemo-head">🎮 Real Interactive Demo — kodni o‘zgartiring va ▶ RUN bosing</div>' +
          '<textarea class="ls-ex-code" data-demo-code="1" spellcheck="false" aria-label="Demo kod muharriri">' + esc(sec.liveDemo.code || '') + '</textarea>' +
          '<div class="ls-ex-actions"><button type="button" class="btn btn-primary btn-sm" data-demo-run="1">▶ RUN</button></div>' +
          '<div class="ls-ex-preview-wrap"><div class="ls-ex-preview-label">👁 LIVE PREVIEW</div>' +
          '<iframe class="ls-ex-preview ls-livedemo-frame" title="Live Preview" sandbox="allow-scripts allow-modals allow-popups allow-forms"></iframe></div>' +
          '</div>';
      }
      if (sec.result) html += '<div class="ls-content-result"><span class="ls-content-result-label">🖥 Natija:</span> ' + fmtText(sec.result) + '</div>';
      if (sec.note) html += '<div class="ls-content-note">⭐ ' + fmtText(sec.note) + '</div>';
      html += '</div>';
    });
    // 🎛 "Bir sahifa, uch xil holat" — interaktiv demo (HTML only / +CSS / +JS)
    if (content.triDemo) html += renderTriDemoHTML(content.triDemo);
    if (Array.isArray(content.keyPoints) && content.keyPoints.length) {
      html += '<div class="ls-content-keypoints">' +
        '<div class="ls-content-sec-title"><span class="ls-sec-num kp">⭐</span><span>Muhim eslatmalar</span></div>' +
        '<ul>' + content.keyPoints.map(function (kp) { return '<li>' + fmtText(kp) + '</li>'; }).join('') + '</ul></div>';
    }
    // 🚀 5-dars motivatsiya banneri
    if (content.motivation) {
      html += '<div class="ls-motivation"><div class="ls-motivation-title">' + esc(content.motivationTitle || '🚀 5-DARSDA BIRINCHI MINI LOYIHANGIZ!') + '</div>' +
        '<div class="ls-motivation-text">' + fmtText(content.motivation) + '</div></div>';
    }
    // 🎛 Interaktiv attribute demo — ✨ Attribute Magic (toggle rejimi)
    if (content.attrDemo) {
      html += '<div class="ls-content-section" id="lsAttrDemo"><div class="ls-content-sec-title"><span class="ls-sec-num">✨</span><span>Attribute Magic — atributlarni yoqib/o‘chirib ko‘ring</span></div>' +
        '<p class="ls-content-text">Har bir tugma bosilganda real HTML preview o‘zgaradi. Qaysi atribut nima qilganini toping 😄</p>' +
        '<div class="ls-attr-demo">' +
          '<div class="ls-attr-controls" id="lsAttrControls">' +
            ['src', 'alt', 'class', 'id', 'title'].map(function (a) {
              return '<label class="ls-attr-row ls-attr-toggle"><input type="checkbox" data-attr="' + a + '" checked><span class="ls-attr-toggle-label">' + esc(a) + ' <span class="ls-attr-state" data-state="' + a + '">ON ✅</span></span></label>';
            }).join('') +
          '</div>' +
          '<div class="ls-attr-preview-wrap">' +
            '<div class="ls-attr-code" id="lsAttrCode"></div>' +
            '<iframe class="ls-attr-preview" id="lsAttrPreview" title="Attribute demo preview" sandbox="allow-same-origin"></iframe>' +
            '<div class="ls-img-failed" id="lsAttrImgFailed" hidden>⚠️ src manzili yuklanmadi — internetni tekshiring.</div>' +
            '<div class="ls-img-caption" id="lsAttrHint">🖱️ Rasm ustiga olib boring — title yoqiq bo‘lsa tooltip chiqadi.</div>' +
          '</div>' +
        '</div></div>';
    }
    // 🎮 5-dars: 7 mini-o‘yin + loyiha (test o‘rniga LOYIHA baholash)
    if (Array.isArray(content.games) && content.games.length) html += renderGamesHTML(course, lesson);
    if (content.project) html += renderProjectHTML(course, lesson);
    if (Array.isArray(content.exercises) && content.exercises.length) {
      html += renderExercisesHTML(course, lesson);
    }
    return html;
  }

  /* ---------- 3-DARS EXTRAS: rasm preview tekshiruvi + interaktiv attribute demo ---------- */

  /** src manzili real yuklanishini tekshirish (onerror sandboxda ishlamaydi — shu yerda tekshiramiz) */
  function checkImageLoad(url, onOk, onFail) {
    if (!url) { onFail(); return; }
    const img = new Image();
    let settled = false;
    const timer = setTimeout(function () { if (!settled) { settled = true; onFail(); } }, 10000);
    img.onload = function () { if (!settled) { settled = true; clearTimeout(timer); onOk(); } };
    img.onerror = function () { if (!settled) { settled = true; clearTimeout(timer); onFail(); } };
    img.src = url;
  }

  /** Rasm preview bloklarida real yuklanishni tekshirish */
  function setupImagePreviews() {
    document.querySelectorAll('.ls-img-preview[data-img-url]').forEach(function (box) {
      const url = box.getAttribute('data-img-url');
      const failed = box.querySelector('.ls-img-failed');
      checkImageLoad(url, function () { if (failed) failed.hidden = true; }, function () { if (failed) failed.hidden = false; });
    });
  }

  /** ✨ Attribute Magic — har bir atributni yoqib/o‘chirib, real previewda natijani ko‘rish */
  function setupAttrDemo(content) {
    const demo = $('#lsAttrDemo');
    if (!demo || !content.attrDemo) return;
    const cfg = content.attrDemo;
    const boxes = demo.querySelectorAll('#lsAttrControls input[type="checkbox"][data-attr]');
    const values = { src: cfg.src || '', alt: cfg.alt || '', title: cfg.title || '', 'class': cfg.className || '', id: cfg.id || '' };
    const codeEl = $('#lsAttrCode');
    const preview = $('#lsAttrPreview');
    const failedEl = $('#lsAttrImgFailed');

    function active() {
      const out = [];
      boxes.forEach(function (b) { if (b.checked) out.push(b.getAttribute('data-attr')); });
      return out;
    }
    function buildHtml(attrs) {
      if (!attrs.length) return '<!-- Hozircha atribut yo‘q 😅 -->';
      return '<img\n' + attrs.map(function (a) {
        return '    ' + (a === 'class' ? 'class' : a) + '="' + values[a] + '"';
      }).join('\n') + '\n>';
    }
    function buildSrcdoc(attrs) {
      let imgAttrs = attrs.map(function (a) {
        return (a === 'class' ? 'class="photo"' : a + '="' + values[a] + '"');
      }).join(' ');
      return '<style>' +
        '.photo{max-width:100%;height:auto;border:3px solid #6366f1;border-radius:14px;display:block;margin:10px auto}' +
        'body{font-family:sans-serif;background:#0b0f1d;color:#f8fafc;text-align:center;padding:8px}' +
        '.cap{color:#94a3b8;font-size:13px;margin-top:6px}' +
        '</style>' +
        (attrs.length ? '<img ' + imgAttrs + '>' : '<div class="cap">Atributlar o‘chirilgan — hech narsa ko‘rinmi? 😄</div>') +
        '<div class="cap">📷 Bu real HTML &lt;img&gt; elementi — sizning atributlaringiz bilan.</div>';
    }
    function update() {
      const attrs = active();
      boxes.forEach(function (b) {
        const st = demo.querySelector('[data-state="' + b.getAttribute('data-attr') + '"]');
        if (st) st.textContent = b.checked ? 'ON ✅' : 'OFF ❌';
      });
      if (codeEl) codeEl.textContent = buildHtml(attrs);
      if (preview) preview.setAttribute('srcdoc', buildSrcdoc(attrs));
      checkImageLoad(values.src, function () { if (failedEl) failedEl.hidden = true; }, function () { if (failedEl) failedEl.hidden = false; });
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update(); // boshlang'ich holat
  }

  /** Dars renderidan keyin extraslarni ulash + return-context scroll tiklash */
  function setupLessonExtras(course, lesson) {
    if (!lesson.content) return;
    setupImagePreviews();
    if (lesson.content.attrDemo) setupAttrDemo(lesson.content);
    if (lesson.content.triDemo) setupTriDemo(lesson.content.triDemo);
    if (lesson.content.reviewQuiz) setupReviewQuiz(course, lesson);
    if (Array.isArray(lesson.content.games) && lesson.content.games.length) setupGames(course, lesson);
    if (lesson.content.project) setupProject(course, lesson);
    // Codingdan qaytganda oldingi scroll pozitsiyasini tiklash
    try {
      const ctxRaw = localStorage.getItem('ls_return_ctx');
      if (ctxRaw) {
        const ctx = JSON.parse(ctxRaw);
        if (ctx && ctx.courseId === course.id && ctx.lessonId === lesson.id && ctx.scrollY) {
          const body = document.querySelector('.ls-viewer-body');
          if (body) body.scrollTop = ctx.scrollY;
          localStorage.removeItem('ls_return_ctx');
          toast('📍 ' + lesson.number + '-darsga qaytdingiz — o‘sha joyidan davom eting', 'info');
        } else {
          localStorage.removeItem('ls_return_ctx');
        }
      }
    } catch (e) { /* ignore */ }
  }

  /* ==========================================================
     MASHQLAR ENGINE — Live Edit | Drag & Drop | Kod detektivi
     ========================================================== */

  /** Mashq XP mukofoti (lesson XP tizimiga mos) */
  function awardExerciseXP(xp) {
    try {
      const u = currentUser();
      if (u && typeof window.xpToLevel === 'function') {
        u.xp = (u.xp || 0) + xp;
        u.points = (u.points || 0) + xp;
        u.level = window.xpToLevel(u.xp);
      }
    } catch (e) { /* ignore */ }
    toast('✅ Topshiriq bajarildi! ⭐ +' + xp + ' XP', 'success');
  }

  function isExerciseDone(courseId, lessonId, exId) {
    const p = courseProgress(courseId);
    return !!(p.exercises && p.exercises[lessonId] && p.exercises[lessonId][exId]);
  }

  function allExercisesDone(courseId, lessonId, exercises) {
    return (exercises || []).filter(function (ex) { return !ex.bonus; }).every(function (ex) { return isExerciseDone(courseId, lessonId, ex.id); });
  }

  function markExerciseDone(courseId, lessonId, ex, feedbackEl) {
    if (isExerciseDone(courseId, lessonId, ex.id)) {
      if (feedbackEl) feedbackEl.innerHTML = '<div class="ls-ex-feedback ok">✅ Topshiriq bajarildi (avval) · ⭐ +' + ex.xp + ' XP</div>';
      return;
    }
    const p = courseProgress(courseId);
    if (!p.exercises) p.exercises = {};
    if (!p.exercises[lessonId]) p.exercises[lessonId] = {};
    p.exercises[lessonId][ex.id] = { at: Date.now() };
    saveStore();
    awardExerciseXP(ex.xp || 10);
    if (feedbackEl) feedbackEl.innerHTML = '<div class="ls-ex-feedback ok">✅ Topshiriq bajarildi · ⭐ +' + ex.xp + ' XP</div>';
    const found = window.CoursesAPI.findLesson && window.CoursesAPI.findLesson(courseId, lessonId);
    if (found) {
      refreshExerciseTracker(found.course, found.lesson);
      refreshReadFooter(found.course, found.lesson);
      /* 🔓 ONE-BY-ONE: agar bu mashq o‘yin sifatida ro‘yxatda bo‘lsa (masalan Build the HTML) — keyingi o‘yinni och */
      if ((found.lesson.content.games || []).some(function (g) { return g.exercise === ex.id; })) {
        refreshGamesHub(found.course, found.lesson);
      }
    }
  }

  function getExById(lesson, exId) {
    return ((lesson.content && lesson.content.exercises) || []).find(function (ex) { return ex.id === exId; });
  }

  /** Mashqlar paneli — tracker + mashq kartalari */
  function exerciseTrackerHTML(course, lesson, exercises) {
    const required = exercises.filter(function (ex) { return !ex.bonus; });
    const doneCount = required.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
    const all = required.length > 0 && doneCount === required.length;
    let html = '<span class="ls-ex-count">' + doneCount + ' / ' + required.length + ' bajarildi</span>';
    html += required.map(function (ex, i) {
      const done = isExerciseDone(course.id, lesson.id, ex.id);
      return '<span class="ls-ex-chip' + (done ? ' done' : '') + '">Mashq ' + (i + 1) + ' ' + (done ? '✅' : '⬜') + '</span>';
    }).join('');
    exercises.forEach(function (ex) {
      if (!ex.bonus) return;
      const done = isExerciseDone(course.id, lesson.id, ex.id);
      html += '<span class="ls-ex-chip' + (done ? ' done' : '') + '">🎁 Bonus ' + (done ? '✅' : '⬜') + '</span>';
    });
    if (!lesson.quiz) {
      html += '<span class="ls-ex-status' + (all ? ' ok' : '') + '">' + (all ? '✅ Barcha topshiriqlar bajarildi — darsni yakunlashingiz mumkin!' : '🔒 Darsni yakunlash uchun barcha topshiriqlarni bajaring') + '</span>';
    } else {
      html += '<span class="ls-ex-status' + (all ? ' ok' : '') + '">' + (all ? '✅ Barcha mashqlar bajarildi! 🔓 Test ochildi' : '🔒 Test hali ochilmagan') + '</span>';
    }
    return html;
  }

  function renderExercisesHTML(course, lesson) {
    const exercises = lesson.content.exercises || [];
    let html = '<div class="ls-exercises" id="lsExercises">' +
      '<div class="ls-ex-head">🧩 Amaliy topshiriqlar <span class="ls-ex-sub">— ' + (lesson.quiz ? 'barchasini bajaring, test ochiladi' : 'loyihani yakunlang, dars tugaydi') + '</span></div>' +
      '<div class="ls-ex-tracker" id="lsExTracker">' +
      exerciseTrackerHTML(course, lesson, exercises) +
      '</div>';

    exercises.forEach(function (ex) {
      const done = isExerciseDone(course.id, lesson.id, ex.id);
      html += '<div class="ls-ex-card' + (done ? ' done' : '') + '" data-ex-id="' + esc(ex.id) + '">' +
        '<div class="ls-ex-title">' + esc(ex.title) + (done ? ' <span class="ls-ex-done-badge">✅</span>' : '') + '</div>' +
        '<div class="ls-ex-instruction">' + fmtText(ex.instruction || '') + '</div>';

      if (ex.type === 'liveedit') {
          if (ex.mode === 'simple') {
          /* SODDA MASHQ: faqat editor + Javobni tekshirish + Hint + kodni qayta qo'yish */
          html +=
            '<textarea class="ls-ex-code" id="lsExCode-' + esc(ex.id) + '" spellcheck="false" aria-label="HTML kod muharriri">' + esc(ex.startCode || (lesson.content.project && lesson.content.project.starter) || '') + '</textarea>' +
            '<div class="ls-ex-actions">' +
              '<button type="button" class="btn btn-primary btn-sm" data-ex-run="' + esc(ex.id) + '">✅ Javobni tekshirish</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ex-hint="' + esc(ex.id) + '">💡 Hint</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Kodni qayta qo‘yish</button>' +
            '</div>' +
            '<div class="ls-ex-hint" id="lsExHint-' + esc(ex.id) + '" hidden>💡 ' + fmtText(ex.hint || '') + '</div>';
        } else {
        html +=
          '<textarea class="ls-ex-code" id="lsExCode-' + esc(ex.id) + '" spellcheck="false" aria-label="HTML kod muharriri">' + esc(ex.startCode || (lesson.content.project && lesson.content.project.starter) || '') + '</textarea>' +
          '<div class="ls-ex-actions">' +
            '<button type="button" class="btn btn-primary btn-sm" data-ex-run="' + esc(ex.id) + '">▶ RUN</button>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Qayta boshlash</button>' +
            (ex.mode === 'project'
              ? '<button type="button" class="btn btn-ghost btn-sm" data-project-pg="1">💻 Codingda davom etish</button>'
              : '<button type="button" class="btn btn-ghost btn-sm" data-ex-playground="' + esc(ex.id) + '">💻 Codingda sinab ko‘r</button>') +
          '</div>' +
          '<div class="ls-ex-preview-wrap"><div class="ls-ex-preview-label" id="lsExPrevLabel-' + esc(ex.id) + '">👁 Preview</div>' +
            '<iframe class="ls-ex-preview" id="lsExPreview-' + esc(ex.id) + '" title="Preview" sandbox="allow-same-origin"></iframe></div>';
        }
      } else if (ex.type === 'dragdrop') {
        html +=
          '<div class="ls-ex-dnd">' +
            '<div class="ls-dnd-pool" id="lsDndPool-' + esc(ex.id) + '"></div>' +
            '<div class="ls-dnd-zone" id="lsDndZone-' + esc(ex.id) + '" data-dropzone="1"></div>' +
          '</div>' +
          '<div class="ls-ex-actions">' +
            '<button type="button" class="btn btn-primary btn-sm" data-ex-check="' + esc(ex.id) + '">✅ Tekshirish</button>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Qayta boshlash</button>' +
          '</div>';
      } else if (ex.type === 'detective') {
        html +=
          '<pre class="ls-ex-code ls-ex-code-ro">' + esc(ex.code || '') + '</pre>' +
          '<div class="ls-ex-options" data-detective="' + esc(ex.id) + '">' +
          (ex.options || []).map(function (opt, oi) {
            return '<button type="button" class="ls-ex-option" data-opt="' + oi + '">' + fmt(opt) + '</button>';
          }).join('') +
          '</div>';
      }
      html += '<div class="ls-ex-feedback-slot" id="lsExFb-' + esc(ex.id) + '">' +
        (done ? '<div class="ls-ex-feedback ok">' + (ex.mode === 'simple' ? '✅ To‘g‘ri! +' + (ex.xp || 10) + ' XP' : '✅ Topshiriq bajarildi · ⭐ +' + ex.xp + ' XP') + '</div>' +
          (ex.mode === 'simple' && ex.explanation ? '<div class="ls-ex-explain">📖 ' + fmtText(ex.explanation) + '</div>' : '') : '') + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /** Tracker yozuvlarini yangilash (mashq bajarilgach) */
  function refreshExerciseTracker(course, lesson) {
    const tracker = $('#lsExTracker');
    const exercises = (lesson.content && lesson.content.exercises) || [];
    if (!tracker) return;
    tracker.innerHTML = exerciseTrackerHTML(course, lesson, exercises);
  }

  /* ---------- 1-MASHQ ENGINE: LIVE EDIT (l1 title-check + universal regex checks) ---------- */
  function runLiveEdit(course, lesson, ex) {
    const ta = $('#lsExCode-' + ex.id);
    const preview = $('#lsExPreview-' + ex.id);
    const label = $('#lsExPrevLabel-' + ex.id);
    const fb = $('#lsExFb-' + ex.id);
    if (!ta) return;
    const code = ta.value;
    if (preview) preview.setAttribute('srcdoc', code);

    // Universal real-checker: ex.checks — har biri majburiy regex (RAW code tekshiriladi)
    if (ex.checks && ex.checks.length) {
      for (let i = 0; i < ex.checks.length; i++) {
        const c = ex.checks[i];
        if (!new RegExp(c.re, 'i').test(code)) {
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ ' + fmtText(c.msg) + '</div>';
          const card = ta.closest('.ls-ex-card');
          shakeEl(card);
          return;
        }
      }
      if (fb) fb.innerHTML = '';
      markExerciseDone(course.id, lesson.id, ex, fb);
      if (ex.mode === 'simple') {
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! +' + (ex.xp || 10) + ' XP</div>' +
          (ex.explanation ? '<div class="ls-ex-explain">📖 ' + fmtText(ex.explanation) + '</div>' : '');
      }
      return;
    }

    // L1 (1-dars) maxsus tekshiruvi: <title> mavjud va eski nom o'zgargan
    const m = code.match(/<title>([\s\S]*?)<\/title>/i);
    const newTitle = m ? m[1].trim() : '';
    const oldM = (ex.startCode || '').match(/<title>([\s\S]*?)<\/title>/i);
    const oldTitle = oldM ? oldM[1].trim() : '';
    if (label) label.textContent = '👁 Preview — tab nomi: ' + (newTitle ? '«' + newTitle + '»' : '—');
    if (!newTitle) {
      if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ `&lt;title&gt;` topilmadi. Head ichiga `&lt;title&gt;...&lt;/title&gt;` yozing va qayta RUN bosing.</div>';
      return;
    }
    if (newTitle === oldTitle) {
      if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Hozircha eski nom turibdi ("' + esc(oldTitle) + '"). `&lt;title&gt;` ichidagi matnni o‘zgartiring.</div>';
      return;
    }
    markExerciseDone(course.id, lesson.id, ex, fb);
  }

  /* ---------- 2-MASHQ: DRAG & DROP (+ touch fallback) ---------- */
  /* STATE: order = joylangan bo'laklarning INDEX ro'yxati (identity sifatida
     matn emas!), selected = touch fallback tanlovi, dragIdx = drag andozi.
     Eventlar DELEGATSIYA bilan pool/zone ga bir marta bog'lanadi — render()
     innerHTML almashtirsa ham listenerlar yo'qolmaydi. */
  function setupDragDrop(course, lesson, ex) {
    const pool = $('#lsDndPool-' + ex.id);
    const zone = $('#lsDndZone-' + ex.id);
    if (!pool || !zone) return;

    let items = (ex.items || []).map(function (_, i) { return i; }); // [0..n-1] indexlar
    if (typeof shuffleArr === 'function') items = shuffleArr(items); // shuffle faqat ko'rinish tartibini aralashtiradi
    let order = [];        // joylangan item indexlari (current order state)
    let selected = null;   // touch: tanlangan item index
    let dragIdx = null;    // hozir drag qilinayotgan item index

    function textOf(idx) { return ex.items[idx]; }
    function isPlaced(idx) { return order.indexOf(idx) !== -1; }

    function render() {
      const remaining = items.filter(function (idx) { return !isPlaced(idx); });
      const hintHtml = ex.hint
        ? '<div class="ls-dnd-hint-box"><b>💡 Eslatma:</b><pre class="ls-dnd-hint-tree">html\n├── head\n│   └── title\n└── body\n    └── h1</pre><span class="ls-dnd-hint-text">' + fmt(ex.hint) + '</span></div>'
        : '';
      pool.innerHTML = hintHtml + (remaining.length
        ? remaining.map(function (idx) {
            return '<span class="ls-dnd-chip' + (selected === idx ? ' selected' : '') +
              '" draggable="true" data-chip-idx="' + idx + '" role="button" tabindex="0">' +
              esc(textOf(idx)) + '</span>';
          }).join('')
        : '<span class="ls-dnd-empty">Bo‘laklar qolmadi 👍</span>');

      let slotsHtml = '';
      order.forEach(function (idx, i) {
        slotsHtml +=
          '<span class="ls-dnd-slot just-placed" data-slot="' + i + '" data-insert="' + i + '" role="button" tabindex="0">' +
            '<b class="ls-dnd-num">' + (i + 1) + '</b>' + esc(textOf(idx)) +
            '<button type="button" class="ls-dnd-remove" data-remove="' + i + '" title="Olib tashlash" aria-label="Olib tashlash">×</button>' +
          '</span>';
      });
      if (order.length < items.length) {
        slotsHtml +=
          '<span class="ls-dnd-slot ls-dnd-slot-empty" data-slot="' + order.length + '" data-insert="' + order.length + '" role="button" tabindex="0">' +
            '<b class="ls-dnd-num">' + (order.length + 1) + '</b>' +
            (selected != null
              ? '📍 Tanlangan bo‘lakni <b>' + (order.length + 1) + '-o‘ringa</b> joylash uchun bosing'
              : '🧩 Keyingi bo‘lakni shu yerga tashlang / ' + (order.length + 1) + '-o‘rin') +
          '</span>';
      }
      zone.innerHTML = order.length
        ? '<div class="ls-dnd-order">' + slotsHtml + '</div>'
        : slotsHtml;
      zone.classList.toggle('complete', order.length === items.length);
    }

    /** chipni berilgan pozitsiyaga joylash (slotIndex == null -> oxiriga) */
    function placeChip(idx, slotIndex) {
      if (idx == null || isPlaced(idx)) return;
      if (slotIndex == null || slotIndex >= order.length) order.push(idx);
      else order.splice(slotIndex, 0, idx);
      selected = null;
      render();
    }

    function removeAt(slotIndex) {
      if (slotIndex < 0 || slotIndex >= order.length) return;
      order.splice(slotIndex, 1);
      render();
    }

    function toggleSelect(idx) {
      selected = (selected === idx) ? null : idx; // qayta bosish = bekor qilish
      render();
      if (selected != null) toast('👆 Endi joylash o‘rnini bosing: ' + textOf(selected), 'info');
    }

    /* ---- DESKTOP: haqiqiy HTML5 Drag & Drop ---- */
    pool.addEventListener('dragstart', function (e) {
      const chip = e.target.closest('[data-chip-idx]');
      if (!chip) return;
      dragIdx = Number(chip.getAttribute('data-chip-idx'));
      e.dataTransfer.setData('text/plain', textOf(dragIdx));
      e.dataTransfer.effectAllowed = 'move';
      chip.classList.add('dragging'); // opacity feedback
    });
    document.addEventListener('dragend', function () {
      dragIdx = null;
      pool.querySelectorAll('.ls-dnd-chip.dragging').forEach(function (el) { el.classList.remove('dragging'); });
      zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { el.classList.remove('over'); });
      zone.classList.remove('dragover');
    });
    zone.addEventListener('dragover', function (e) {
      e.preventDefault(); // drop ishlashi uchun MAJBURIY
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('dragover');
      const slot = e.target.closest('[data-insert]');
      zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { if (el !== slot) el.classList.remove('over'); });
      if (slot) slot.classList.add('over'); // aniq drop target ko'rinsin
    });
    zone.addEventListener('dragleave', function (e) {
      if (!zone.contains(e.relatedTarget)) zone.classList.remove('dragover');
    });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { el.classList.remove('over'); });
      let idx = dragIdx;
      if (idx == null) {
        const txt = e.dataTransfer.getData('text/plain');
        const found = items.find(function (i2) { return !isPlaced(i2) && textOf(i2) === txt; });
        idx = found == null ? null : found;
      }
      if (idx == null) return;
      let slotIndex = null;
      const slot = e.target.closest('[data-insert]');
      if (slot) slotIndex = Number(slot.getAttribute('data-insert'));
      placeChip(idx, slotIndex);
    });

    /* ---- MOBILE/TOUCH fallback: tap-to-select -> tap-to-place ---- */
    pool.addEventListener('click', function (e) {
      const chip = e.target.closest('[data-chip-idx]');
      if (!chip) return;
      toggleSelect(Number(chip.getAttribute('data-chip-idx')));
    });
    pool.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const chip = e.target.closest('[data-chip-idx]');
      if (!chip) return;
      e.preventDefault();
      toggleSelect(Number(chip.getAttribute('data-chip-idx')));
    });
    zone.addEventListener('click', function (e) {
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        removeAt(Number(rm.getAttribute('data-remove')));
        return;
      }
      const slot = e.target.closest('[data-insert]');
      if (selected != null && slot) {
        placeChip(selected, Number(slot.getAttribute('data-insert')));
        return;
      }
      if (selected != null) placeChip(selected, null); // zonaning bosh joyi — oxiriga
    });
    zone.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const slot = e.target.closest('[data-insert]');
      if (slot && selected != null) {
        e.preventDefault();
        placeChip(selected, Number(slot.getAttribute('data-insert')));
      }
    });

    render();

    /* ---- TEKSHIRISH: haqiqiy current order vs expected order ---- */
    const exCard = zone.closest('.ls-ex-card');
    const fb = $('#lsExFb-' + ex.id);
    exCard.querySelector('[data-ex-check="' + ex.id + '"]').addEventListener('click', function () {
      if (order.length !== items.length) {
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Hali hammasi joylanmadi (' + order.length + '/' + items.length + '). Davom eting.</div>';
        shakeEl(exCard);
        return;
      }
      const currentTexts = order.map(textOf);
      const wrongPos = [];
      currentTexts.forEach(function (t, i) { if (t !== ex.items[i]) wrongPos.push(i + 1); });
      if (!wrongPos.length) {
        // exercise completed = true (FAQAT to'g'ri order bo'lsa)
        zone.classList.add('success'); // success animation
        zone.querySelectorAll('.ls-dnd-slot').forEach(function (el, i2) { el.classList.add('correct'); });
        markExerciseDone(course.id, lesson.id, ex, fb);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Ajoyib! HTML skeleti to‘g‘ri tartiblangan · ⭐ +' + ex.xp + ' XP</div>';
      } else {
        zone.classList.remove('success');
        zone.querySelectorAll('.ls-dnd-slot').forEach(function (el, i2) {
          if (wrongPos.indexOf(i2 + 1) !== -1) el.classList.add('wrong');
        });
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Tartib noto‘g‘ri. Xato pozitsiyalar: <b>' +
          wrongPos.join(', ') + '-o‘rin(lar)</b>. ' + (wrongPos[0] - 1) + '-o‘rinda kutilgani: <code>' +
          esc(ex.items[wrongPos[0] - 1]) + '</code>, turibdi: <code>' + esc(currentTexts[wrongPos[0] - 1]) +
          '</code>. Qayta joylab ko‘ring.</div>';
        shakeEl(exCard);
      }
    });
    exCard.querySelector('[data-ex-reset="' + ex.id + '"]').addEventListener('click', function () {
      order = []; selected = null; dragIdx = null;
      items = (ex.items || []).map(function (_, i) { return i; });
      if (typeof shuffleArr === 'function') items = shuffleArr(items);
      zone.classList.remove('success'); // success/wrong holatlarni tozalash
      if (fb) fb.innerHTML = '';
      render();
    });
  }

  /* ---------- 3-MASHQ: KOD DETEKTIVI ---------- */
  function setupDetective(course, lesson, ex) {
    const box = document.querySelector('[data-detective="' + ex.id + '"]');
    if (!box) return;
    const fb = $('#lsExFb-' + ex.id);
    box.addEventListener('click', function (e) {
      const btn = e.target.closest('.ls-ex-option');
      if (!btn) return;
      if (isExerciseDone(course.id, lesson.id, ex.id)) return;
      if (Number(btn.getAttribute('data-opt')) === ex.answer) {
        btn.classList.add('correct');
        markExerciseDone(course.id, lesson.id, ex, fb);
      } else {
        btn.classList.add('wrong');
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Qayta urinib ko‘ring — bu qism to‘g‘ri ko‘rinadi.</div>';
      }
    });
  }

  /** Barcha mashqlarni bind qilish (renderReadPhase chaqiradi) */
  function bindExercises(course, lesson) {
    const exercises = (lesson.content && lesson.content.exercises) || [];
    // 🎮 REAL INTERACTIVE DEMO — Run bosilganda iframe srcdoc haqiqiy yangilanadi
    document.querySelectorAll('.ls-livedemo').forEach(function (demo) {
      const ta = demo.querySelector('[data-demo-code]');
      const frame = demo.querySelector('iframe.ls-livedemo-frame');
      const btn = demo.querySelector('[data-demo-run]');
      if (!ta || !frame || !btn) return;
      if (btn.getAttribute('data-demo-bound')) return;
      btn.setAttribute('data-demo-bound', '1');
      btn.addEventListener('click', function () {
        frame.setAttribute('srcdoc', ta.value);
      });
    });
    // 💻 "CODINGDA SINAB KO'R" — RAW HTML -> Coding Playground
    document.querySelectorAll('.ls-open-playground[data-ls-raw-code], .ls-alert-demo[data-alert-msg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // ⚡ JS teaser — haqiqiy alert demo tugmasi
        const alertMsg = btn.getAttribute('data-alert-msg');
        if (alertMsg != null) { try { window.alert(alertMsg); } catch (e) { toast(alertMsg, 'info'); } return; }
        const raw = btn.getAttribute('data-ls-raw-code');
        if (typeof window.openCodePlaygroundWithHtml === 'function') {
          // Lesson return context: Codingdan qaytish uchun saqlanadi
          const body = document.querySelector('.ls-viewer-body');
          const ctx = {
            courseId: course.id,
            lessonId: lesson.id,
            lessonNumber: lesson.number,
            scrollY: body ? body.scrollTop : 0,
            at: Date.now()
          };
          try { localStorage.setItem('ls_return_ctx', JSON.stringify(ctx)); } catch (e) { /* ignore */ }
          window.openCodePlaygroundWithHtml(raw, ctx);
          toast('💻 Kod Coding Playgroundga yuklandi', 'info');
        } else {
          toast('Coding Playground topilmadi', 'error');
        }
      });
    });
    exercises.forEach(function (ex) {
      if (ex.type === 'liveedit') {
        // 🤖 AI Yordamchi: amaliy kod editoriga autocomplete + AI panel ulash
        // (sodda mashqlarda AI panel ko'rsatilmaydi)
        if (window.ITTestAI && ex.mode !== 'simple') {
          try {
            window.ITTestAI.attachLessonExercise(
              document.getElementById('lsExCode-' + ex.id), course, lesson, ex);
          } catch (e) { /* AI panel ixtiyoriy — dars buzilmasin */ }
        }
        const runBtn = document.querySelector('[data-ex-run="' + ex.id + '"]');
        const resetBtn = document.querySelector('[data-ex-reset="' + ex.id + '"]');
        const pgBtn = document.querySelector('[data-ex-playground="' + ex.id + '"]');
        if (runBtn) runBtn.addEventListener('click', function () { runLiveEdit(course, lesson, ex); });
        const hintBtn = document.querySelector('[data-ex-hint="' + ex.id + '"]');
        if (hintBtn) hintBtn.addEventListener('click', function () {
          const hb = document.getElementById('lsExHint-' + ex.id);
          if (hb) hb.hidden = !hb.hidden;
        });
        if (resetBtn) resetBtn.addEventListener('click', function () {
          const ta = $('#lsExCode-' + ex.id);
          if (ta) ta.value = ex.startCode || '';
          const pv = $('#lsExPreview-' + ex.id);
          if (pv) pv.removeAttribute('srcdoc');
          const fb = $('#lsExFb-' + ex.id);
          if (fb) fb.innerHTML = '';
        });
        if (pgBtn) pgBtn.addEventListener('click', function () {
          const ta = $('#lsExCode-' + ex.id);
          if (ta && typeof window.openCodePlaygroundWithHtml === 'function') {
            window.openCodePlaygroundWithHtml(ta.value);
            toast('💻 Kod Coding Playgroundga yuklandi', 'info');
          }
        });
      } else if (ex.type === 'dragdrop') {
        setupDragDrop(course, lesson, ex);
      } else if (ex.type === 'detective') {
        setupDetective(course, lesson, ex);
      }
    });
  }

  /* ==========================================================
     🚀 5-DARS ENGINE — TriDemo | 7 mini-o‘yin | LOYIHA
     ========================================================== */

  /* ---------- O‘YIN XP — bir marta beriladi ---------- */
  function isGameDone(courseId, lessonId, gameId) {
    const p = courseProgress(courseId);
    return !!(p.games && p.games[lessonId] && p.games[lessonId][gameId]);
  }
  function markGameDone(course, lesson, game) {
    if (isGameDone(course.id, lesson.id, game.id)) return;
    const p = courseProgress(course.id);
    if (!p.games) p.games = {};
    if (!p.games[lesson.id]) p.games[lesson.id] = {};
    p.games[lesson.id][game.id] = { at: Date.now() };
    saveStore();
    awardExerciseXP(game.xp || 10);
    const badge = document.querySelector('[data-game-badge="' + game.id + '"]');
    if (badge) { badge.textContent = '✅ Bajarildi'; badge.classList.add('done'); }
    /* 🔓 ONE-BY-ONE: keyingi o‘yinni ochish uchun hubni yangilash */
    refreshGamesHub(course, lesson);
  }
  function gameBest(course, lesson, key) {
    const p = courseProgress(course.id);
    return (p.games && p.games[lesson.id] && p.games[lesson.id][key]) || 0;
  }
  function setGameBest(course, lesson, key, val) {
    const p = courseProgress(course.id);
    if (!p.games) p.games = {};
    if (!p.games[lesson.id]) p.games[lesson.id] = {};
    if (val > (p.games[lesson.id][key] || 0)) { p.games[lesson.id][key] = val; saveStore(); }
  }

  /* ---------- 🔁 TEZKOR ESLATMA (reviewQuiz) — savollar bittadan ---------- */
  function isReviewDone(courseId, lessonId) {
    const p = courseProgress(courseId);
    return !!(p.reviewQuiz && p.reviewQuiz[lessonId]);
  }
  function markReviewDone(course, lesson, rq) {
    if (isReviewDone(course.id, lesson.id)) return;
    const p = courseProgress(course.id);
    if (!p.reviewQuiz) p.reviewQuiz = {};
    p.reviewQuiz[lesson.id] = { at: Date.now() };
    saveStore();
    awardExerciseXP(rq.xp || 10);
  }
  function setupReviewQuiz(course, lesson) {
    const rq = lesson.content.reviewQuiz;
    if (!rq) return;
    const root = document.getElementById('lsReviewQuiz');
    const body = root ? root.querySelector('[data-rq-body]') : null;
    if (!body) return;
    const questions = rq.questions || [];
    if (!questions.length) return;
    let qi = 0;
    function renderQ() {
      const q = questions[qi];
      body.innerHTML =
        '<div class="ls-rq-step">Savol ' + (qi + 1) + ' / ' + questions.length + '</div>' +
        '<div class="ls-rq-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-rq-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-rq-fb"></div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-opt]');
      if (!btn) return;
      const q = questions[qi];
      if (!q) return;
      const fb = body.querySelector('.ls-rq-fb');
      if (Number(btn.getAttribute('data-opt')) === q.a) {
        mascotReact('success');
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri!</div>';
        qi++;
        if (qi >= questions.length) {
          markReviewDone(course, lesson, rq);
          body.innerHTML = '<div class="ls-game-win">🎉 Tezkor eslatma tugadi — eslab qoldingiz! Endi pastdagi bo‘limlarga o‘tamiz.</div>';
          return;
        }
        setTimeout(renderQ, 900);
      } else {
        mascotReact('error');
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmt(q.hint || 'Yana urinib ko‘ring') + '</div>';
      }
    });
    renderQ();
  }

  /* ---------- 🎛 TRI DEMO — bir sahifa, uch xil holat ---------- */
  function renderTriDemoHTML(cfg) {
    const frames = [cfg.htmlOnly, cfg.withCss, cfg.withJs].map(function (code, i) {
      return '<div class="ls-td-panel' + (i === 0 ? ' active' : '') + '" data-td-panel="' + i + '">' +
        '<iframe class="ls-td-frame" title="' + esc((cfg.tabs || [])[i] || 'Holat') + '" sandbox="allow-scripts allow-modals" srcdoc="' + esc(code || '') + '"></iframe>' +
        '</div>';
    }).join('');
    return '<div class="ls-content-section" id="lsTriDemo"><div class="ls-content-sec-title"><span class="ls-sec-num">🎛</span><span>' + esc(cfg.title || 'Bir sahifa, uch xil holat') + '</span></div>' +
      '<p class="ls-content-text">Tablar orqali uch holatni solishtiring: <b>HTML</b> — tuzilma, <b>+CSS</b> — chiroyli ko‘rinish, <b>+JS</b> — interaktivlik (3-tabda tugmani bosib ko‘ring!).</p>' +
      '<div class="ls-td-tabs">' + (cfg.tabs || []).map(function (t, i) {
        return '<button type="button" class="ls-td-tab' + (i === 0 ? ' active' : '') + '" data-td-tab="' + i + '">' + esc(t) + '</button>';
      }).join('') + '</div>' +
      '<div class="ls-td-panels">' + frames + '</div>' +
      '</div>';
  }
  function setupTriDemo(cfg) {
    const root = $('#lsTriDemo');
    if (!root) return;
    root.querySelectorAll('[data-td-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        const i = tab.getAttribute('data-td-tab');
        root.querySelectorAll('[data-td-tab]').forEach(function (t2) { t2.classList.toggle('active', t2 === tab); });
        root.querySelectorAll('[data-td-panel]').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-td-panel') === i); });
      });
    });
  }

  /* ---------- 🎮 O‘YIN TURLARI: quizgame | csstab | wizard ---------- */
  function setupQuizGame(course, lesson, game, questions, body) {
    if (!questions.length) return;
    let qi = 0;
    function render() {
      const q = questions[qi];
      body.innerHTML =
        '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '" data-qi="' + qi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-run-fb"></div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-opt]');
      if (!btn || qi >= questions.length) return;
      if (Number(btn.getAttribute('data-qi')) !== qi) return; // eski savol tugmasi
      const q = questions[qi];
      const fb = body.querySelector('.ls-run-fb');
      if (Number(btn.getAttribute('data-opt')) === q.a) {
        mascotReact('success');
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri!</div>';
        qi++;
        if (qi >= questions.length) {
          markGameDone(course, lesson, game);
          body.innerHTML = '<div class="ls-game-win">' + esc(game.win || '🏆 O‘yin tugadi! Barcha javoblar to‘g‘ri.') + '</div>';
          return;
        }
        setTimeout(render, 850);
      } else {
        mascotReact('error');
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmt(q.hint || 'Yana urinib ko‘ring') + '</div>';
      }
    });
    render();
  }

  function setupCsstab(course, lesson, game, body) {
    const tabs = game.tabs || [];
    if (!tabs.length) return;
    const visited = {};
    function render() {
      body.innerHTML =
        '<div class="ls-cstab-row">' + tabs.map(function (t, i) {
          return '<button type="button" class="ls-cstab' + (i === 0 ? ' active' : '') + '" data-ctab="' + i + '">' + esc(t.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-cstab-panels">' + tabs.map(function (t, i) {
          return '<div class="ls-cstab-panel' + (i === 0 ? ' active' : '') + '" data-cstab-panel="' + i + '">' +
            '<iframe class="ls-img-preview-frame" title="Preview" sandbox="allow-same-origin" srcdoc="' + esc(t.html || '') + '"></iframe>' +
            '<pre class="ls-cstab-code">' + esc(t.code || '') + '</pre>' +
            '</div>';
        }).join('') + '</div>';
    }
    body.addEventListener('click', function (e) {
      const tab = e.target.closest('[data-ctab]');
      if (!tab) return;
      const i = Number(tab.getAttribute('data-ctab'));
      body.querySelectorAll('[data-ctab]').forEach(function (t2) { t2.classList.toggle('active', t2 === tab); });
      body.querySelectorAll('[data-cstab-panel]').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-cstab-panel') === String(i)); });
      visited[i] = true;
      if (!gameDoneState(course, lesson, game) && Object.keys(visited).length >= tabs.length) {
        mascotReact('success');
        markGameDone(course, lesson, game);
      }
    });
    render();
  }

  function setupWizard(course, lesson, game, body) {
    const colors = game.colors || {};
    const tcs = colors.text || [];
    const bcs = colors.bg || [];
    if (!tcs.length) return;
    let tc = tcs[0].v, bc = bcs.length ? bcs[0].v : null, picked = false;
    function codeStr() {
      let s = '<h2 style="color: ' + tc + ';';
      if (bc) s += ' background-color: ' + bc + ';';
      s += '">\n  ITTest\n</h2>';
      return s;
    }
    function previewSrcdoc() {
      return '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;">' +
        '<h2 style="margin:0;color:' + tc + ';' + (bc ? 'background-color:' + bc + ';padding:8px;border-radius:8px;' : '') + '">ITTest</h2></div>';
    }
    function render() {
      let html = '<div class="ls-wiz-row">';
      html += '<div class="ls-wiz-group"><div class="ls-wiz-label">Matn rangi (color)</div><div class="ls-wiz-btns">' +
        tcs.map(function (c) {
          return '<button type="button" class="ls-wiz-btn' + (c.v === tc ? ' active' : '') + '" data-tc="' + esc(c.v) + '">' + esc(c.label) + '</button>';
        }).join('') + '</div></div>';
      if (bcs.length) {
        html += '<div class="ls-wiz-group"><div class="ls-wiz-label">Fon rangi (background-color)</div><div class="ls-wiz-btns">' +
          bcs.map(function (c) {
            return '<button type="button" class="ls-wiz-btn' + (c.v === bc ? ' active' : '') + '" data-bc="' + esc(c.v) + '">' + esc(c.label) + '</button>';
          }).join('') + '</div></div>';
      }
      html += '</div>';
      html += '<div class="ls-wiz-preview"><iframe class="ls-img-preview-frame" title="Rang sehrgari preview" sandbox="allow-same-origin" srcdoc="' + esc(previewSrcdoc()) + '"></iframe></div>';
      html += '<pre class="ls-cstab-code" data-wiz-code>' + esc(codeStr()) + '</pre>';
      html += '<button type="button" class="ls-open-playground" data-wiz-pg>💻 CODINGDA SINAB KO‘R</button>';
      body.innerHTML = html;
    }
    function openPlayground() {
      const raw = codeStr();
      if (typeof window.openCodePlaygroundWithHtml === 'function') {
        const viewerBody = document.querySelector('.ls-viewer-body');
        const ctx = { courseId: course.id, lessonId: lesson.id, lessonNumber: lesson.number, scrollY: viewerBody ? viewerBody.scrollTop : 0, at: Date.now() };
        try { localStorage.setItem('ls_return_ctx', JSON.stringify(ctx)); } catch (e2) { /* ignore */ }
        window.openCodePlaygroundWithHtml(raw, ctx);
        toast('💻 Kod Coding Playgroundga yuklandi', 'info');
      } else {
        toast('Coding Playground topilmadi', 'error');
      }
    }
    body.addEventListener('click', function (e) {
      const pg = e.target.closest('[data-wiz-pg]');
      if (pg) { openPlayground(); return; }
      const tbtn = e.target.closest('[data-tc]');
      const bbtn = e.target.closest('[data-bc]');
      if (!tbtn && !bbtn) return;
      if (tbtn) tc = tbtn.getAttribute('data-tc');
      if (bbtn) bc = bbtn.getAttribute('data-bc');
      render();
      if (!picked) {
        picked = true;
        mascotReact('success');
        markGameDone(course, lesson, game);
      }
    });
    render();
  }

  /* ---------- 🎮 O‘YINLAR HUB — ONE-BY-ONE UNLOCK ---------- */
  /** Ketma-ket bajarilgan o‘yinlar soni — shunchalik ko‘p bo‘lsa, shuncha o‘yin ochiq */
  function gamesUnlockedCount(course, lesson) {
    const games = (lesson.content && lesson.content.games) || [];
    let n = 0;
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      const done = g.exercise ? isExerciseDone(course.id, lesson.id, g.exercise) : isGameDone(course.id, lesson.id, g.id);
      if (!done) break;
      n++;
    }
    return n;
  }
  function isGameUnlocked(course, lesson, gameIndex) {
    return gameIndex <= gamesUnlockedCount(course, lesson);
  }
  function gameDoneState(course, lesson, game) {
    return game.exercise ? isExerciseDone(course.id, lesson.id, game.exercise) : isGameDone(course.id, lesson.id, game.id);
  }
  /** Hubni qayta chizish — o‘yin tugagach keyingisini ochadi */
  function refreshGamesHub(course, lesson) {
    const root = document.getElementById('lsGames');
    if (!root) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = renderGamesHTML(course, lesson);
    const next = wrap.firstElementChild;
    root.replaceWith(next);
    setupGames(course, lesson);
  }

  function renderGamesHTML(course, lesson) {
    const content = lesson.content;
    const games = content.games || [];
    const total = games.length;
    const unlockedCount = gamesUnlockedCount(course, lesson);
    let html = '<div class="ls-games" id="lsGames"><div class="ls-games-title">' + esc(content.gamesTitle || '🎮 Mini-o‘yinlar') +
      '<span class="ls-games-progress" id="lsGamesProgress">🏁 ' + unlockedCount + '/' + total + '</span></div>' +
      '<div class="ls-games-bar"><div class="ls-games-bar-fill" style="width:' + Math.round(unlockedCount / total * 100) + '%"></div></div>';
    games.forEach(function (game, gi) {
      const done = gameDoneState(course, lesson, game);
      const unlocked = isGameUnlocked(course, lesson, gi);
      html += '<div class="ls-game-card' + (unlocked ? '' : ' locked') + (done ? ' done' : '') + '" id="lsGame-' + esc(game.id) + '" data-game="' + esc(game.id) + '">' +
        '<div class="ls-game-head">' +
          '<span class="ls-game-ico">' + (unlocked ? esc(game.icon) : '🔒') + '</span>' +
          '<span class="ls-game-name">' + esc(game.title) + '</span>' +
          '<span class="ls-game-desc">' + esc(game.desc) + '</span>' +
          '<span class="ls-game-badge' + (done ? ' done' : '') + '" data-game-badge="' + esc(game.id) + '">' +
            (done ? '✅ Bajarildi' : (unlocked ? '⭐ +' + (game.xp || 10) + ' XP' : '🔒 Yopiq')) + '</span>' +
        '</div>' +
        '<div class="ls-game-body" data-game-body="' + esc(game.id) + '">' +
          (unlocked ? '' : '<div class="ls-game-locked-note">🔒 Avval oldingi o‘yinni tugating</div>') +
        '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function setupGames(course, lesson) {
    const content = lesson.content;
    const data = content.gamesData || {};
    (content.games || []).forEach(function (game, gi) {
      const body = document.querySelector('[data-game-body="' + game.id + '"]');
      if (!body || body.getAttribute('data-bound')) return;
      body.setAttribute('data-bound', '1');
      if (!isGameUnlocked(course, lesson, gi)) { body.innerHTML = '<div class="ls-game-locked-note">🔒 Avval oldingi o‘yinni tugating</div>'; return; }
      if (gameDoneState(course, lesson, game)) {
        body.innerHTML = '<div class="ls-game-win">✅ Bu o‘yin allaqachon bajarilgan — XP olindi. Istasangiz qayta o‘ynashingiz mumkin.</div>' +
          '<div class="ls-game-replay-slot" data-game-replay="' + esc(game.id) + '"></div>';
        setupGameById(game.id, course, lesson, data, body.querySelector('[data-game-replay="' + game.id + '"]'));
        return;
      }
      setupGameById(game.id, course, lesson, data, body);
    });
  }

  function setupGameById(gameId, course, lesson, data, body) {
    if (!body) return;
    const game = (lesson.content.games || []).find(function (g) { return g.id === gameId; });
    if (!game) return;
    /* 🎮 Yangi turlar — game.type bo'yicha (7-dars va undan keyingi o'yinlar) */
    if (game.type === 'quizgame') { setupQuizGame(course, lesson, game, game.questions || [], body); return; }
    if (game.type === 'csstab') { setupCsstab(course, lesson, game, body); return; }
    if (game.type === 'wizard') { setupWizard(course, lesson, game, body); return; }
    if (gameId === 'bughunter') setupBugHunter(course, lesson, game, data.bugHunterRounds || [], body);
    else if (gameId === 'build') { body.innerHTML = '<div class="ls-game-note">👇 Bu o‘yin pastdagi <b>Amaliy topshiriqlar</b> bo‘limida — «Build the HTML» kartasida joylashgan.</div>'; }
    else if (gameId === 'memory') setupMemory(course, lesson, game, data.memoryPairs || [], body);
    else if (gameId === 'runner') setupRunner(course, lesson, game, data.runnerQuestions || [], body);
    else if (gameId === 'sixty') setupSixty(course, lesson, game, data.sixtyQuestions || [], body);
    else if (gameId === 'streak') setupStreak(course, lesson, game, data.streakQuestions || [], body);
    else if (gameId === 'duel') setupDuel(course, lesson, game, data.duelQuestions || [], body);
  }

  /* ---------- 🐛 O‘YIN 1: BUG HUNTER ---------- */
  function setupBugHunter(course, lesson, game, rounds, body) {
    if (!rounds.length) return;
    let ri = 0;
    function render() {
      const r = rounds[ri];
      body.innerHTML =
        '<div class="ls-gh-round">Round ' + (ri + 1) + ' / ' + rounds.length + '</div>' +
        '<div class="ls-gh-q">' + fmt(r.prompt) + '</div>' +
        '<pre class="ls-gh-code">' + esc(r.code) + '</pre>' +
        '<div class="ls-gh-gaps">' + r.gaps.map(function (g, i) {
          return '<button type="button" class="ls-gh-gap" data-gap="' + i + '">' + fmt(g.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-gh-fb"></div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-gap]');
      if (!btn || ri >= rounds.length) return;
      const g = rounds[ri].gaps[Number(btn.getAttribute('data-gap'))];
      const fb = body.querySelector('.ls-gh-fb');
      if (g.ok) {
        btn.classList.add('correct');
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Topdingiz! ' + fmt(g.label) + ' — bu yetishib qolgan.</div>';
        ri++;
        if (ri >= rounds.length) {
          markGameDone(course, lesson, game);
          body.innerHTML = '<div class="ls-game-win">🏆 Bug Hunter tugadi! Barcha xatolar topildi.</div>';
        } else setTimeout(render, 800);
      } else {
        btn.classList.add('wrong');
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmtText(g.hint || 'Yana urinib ko‘ring') + '</div>';
      }
    });
    render();
  }

  /* ---------- 🧠 O‘YIN 3: MEMORY CODE ---------- */
  function setupMemory(course, lesson, game, pairs, body) {
    if (!pairs.length) return;
    let cards = [];
    pairs.forEach(function (p, pi) {
      cards.push({ pair: pi, text: p[0], kind: 'code' });
      cards.push({ pair: pi, text: p[1], kind: 'label' });
    });
    cards = shuffleArr(cards);
    body._memCards = cards; /* test hook: juftliklarni aniq topish uchun */
    let flipped = [], matched = 0, lock = false;
    function render() {
      body.innerHTML = '<div class="ls-mem-grid">' + cards.map(function (c, i) {
        const open = c.open || c.matched;
        return '<button type="button" class="ls-mem-card' + (c.matched ? ' matched' : '') + (open ? ' open' : '') + '" data-mem="' + i + '"' + (c.matched ? ' disabled' : '') + '>' +
          (open ? (c.kind === 'code' ? '<code>' + esc(c.text) + '</code>' : esc(c.text)) : '❓') + '</button>';
      }).join('') + '</div><div class="ls-mem-fb"></div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-mem]');
      if (!btn || lock) return;
      const i = Number(btn.getAttribute('data-mem'));
      const c = cards[i];
      if (c.open || c.matched) return;
      c.open = true;
      flipped.push(i);
      render();
      if (flipped.length === 2) {
        lock = true;
        const a = cards[flipped[0]], b = cards[flipped[1]];
        const fb = body.querySelector('.ls-mem-fb');
        if (a.pair === b.pair && flipped[0] !== flipped[1]) {
          a.matched = b.matched = true;
          matched++;
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Juftlik topildi! (' + matched + '/' + pairs.length + ')</div>';
          flipped = []; lock = false;
          if (matched === pairs.length) {
            markGameDone(course, lesson, game);
            body.querySelector('.ls-mem-fb').innerHTML = '<div class="ls-game-win">🏆 Memory Code tugadi — barcha juftliklar topildi!</div>';
          } else render();
        } else {
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Juftlik emas — yana urinib ko‘ring.</div>';
          setTimeout(function () {
            a.open = b.open = false;
            flipped = []; lock = false;
            render();
          }, 800);
        }
      }
    });
    render();
  }

  /* ---------- 🏃 O‘YIN 4: CODE RUNNER ---------- */
  function setupRunner(course, lesson, game, questions, body) {
    if (!questions.length) return;
    const FINISH = 6;
    let pos = 0, qi = 0;
    function render() {
      const q = questions[qi % questions.length];
      body.innerHTML =
        '<div class="ls-run-track">' +
          Array.from({ length: FINISH + 1 }, function (_, i) {
            return '<span class="ls-run-cell' + (i === pos ? ' here' : '') + (i === FINISH ? ' finish' : '') + '">' +
              (i === FINISH ? '🏁' : (i === pos ? '🏃' : (i < pos ? '👣' : '·'))) + '</span>';
          }).join('') +
        '</div>' +
        '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-run-fb"></div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-opt]');
      if (!btn || pos >= FINISH) return;
      const q = questions[qi % questions.length];
      const ok = Number(btn.getAttribute('data-opt')) === q.a;
      const fb = body.querySelector('.ls-run-fb');
      if (ok) {
        pos++;
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! 🏃 oldinga yurding (' + pos + '/' + FINISH + ')</div>';
        if (pos >= FINISH) {
          markGameDone(course, lesson, game);
          body.innerHTML = '<div class="ls-game-win">🏁 FINISH! Code Runner tugadi — sen finish chizig‘iga yetib kelding!</div>';
          return;
        }
      } else {
        pos = Math.max(0, pos - 1);
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Noto‘g‘ri — 🏃 orqaga qaytdi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
      }
      qi++;
      setTimeout(render, 900);
    });
    render();
  }

  /* ---------- ⚡ O‘YIN 5: 60 SECONDS ---------- */
  function setupSixty(course, lesson, game, questions, body) {
    if (!questions.length) return;
    let timer = null, left = 60, score = 0, asked = 0, order = [];
    function pick() {
      if (!order.length) order = shuffleArr(questions.map(function (_, i) { return i; }));
      return questions[order.pop()];
    }
    function renderQ() {
      const q = pick(); asked++;
      body.innerHTML =
        '<div class="ls-sixty-head"><span class="ls-sixty-timer" data-t>⏱ ' + left + '</span><span class="ls-sixty-score">✅ <b data-s>' + score + '</b></span></div>' +
        '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-run-fb"></div>';
      body._q = q;
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      const acc = asked ? Math.round(score / asked * 100) : 0;
      setGameBest(course, lesson, 'sixtyBest', score);
      if (score >= 8) markGameDone(course, lesson, game);
      const done = isGameDone(course.id, lesson.id, game.id);
      body.innerHTML =
        '<div class="ls-game-win">⏱ Vaqt tugadi! Natija: <b>' + score + '</b> to‘g‘ri javob · Aniqlik: <b>' + acc + '%</b> · 🏅 Rekord: <b>' + gameBest(course, lesson, 'sixtyBest') + '</b></div>' +
        (done ? '' : '<div class="ls-game-note">Kamida 8 ta to‘g‘ri javob — o‘yin bajarilgan hisoblanadi.</div>') +
        '<button type="button" class="btn btn-primary btn-sm" data-retry="1">🔄 Qayta o‘ynash</button>';
      const rb = body.querySelector('[data-retry]');
      if (rb) rb.addEventListener('click', start);
    }
    function start() {
      if (timer) clearInterval(timer);
      score = 0; asked = 0; left = 60; order = [];
      renderQ();
      timer = setInterval(function () {
        left--;
        const tEl = body.querySelector('[data-t]');
        if (tEl) tEl.textContent = '⏱ ' + left;
        if (left <= 0) stop();
      }, 1000);
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-opt]');
      if (!btn || !timer) return;
      const q = body._q;
      const ok = Number(btn.getAttribute('data-opt')) === q.a;
      const fb = body.querySelector('.ls-run-fb');
      if (ok) {
        score++;
        const sEl = body.querySelector('[data-s]');
        if (sEl) sEl.textContent = score;
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅</div>';
      } else {
        shakeEl(btn);
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
      }
      setTimeout(function () { if (timer) renderQ(); }, ok ? 350 : 900);
    });
    body.innerHTML = '<div class="ls-game-note">⚡ 60 soniya — tez savol-javob o‘yini. Tayyor bo‘lsangiz bosing!</div>' +
      '<button type="button" class="btn btn-primary btn-sm" data-start="1">▶ Boshlash</button>';
    const sb = body.querySelector('[data-start]');
    if (sb) sb.addEventListener('click', start);
    body._stopSixty = stop; /* test hook: vaqtni kutmasdan yakunlash */
  }

  /* ---------- 🔥 O‘YIN 6: STREAK FIRE ---------- */
  function setupStreak(course, lesson, game, questions, body) {
    if (!questions.length) return;
    const GOAL = 7;
    let streak = 0, qi = 0;
    function flames(n) { return n > 0 ? '🔥'.repeat(Math.min(n, GOAL)) : '💨'; }
    function render(msg) {
      const q = questions[qi % questions.length];
      body.innerHTML =
        '<div class="ls-streak-head"><span class="ls-streak-flames' + (streak >= 4 ? ' hot' : '') + '">' + flames(streak) + '</span>' +
          '<span class="ls-streak-count">Streak: <b>' + streak + '</b> / ' + GOAL + '</span>' +
          '<span class="ls-streak-best">🏅 Best: ' + Math.max(streak, gameBest(course, lesson, 'streakBest')) + '</span></div>' +
        '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-run-fb">' + (msg || '') + '</div>';
    }
    body.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-opt]');
      if (!btn) return;
      if (e.target.closest('[data-streak-retry]')) { streak = 0; qi = 0; render(); return; }
      const q = questions[qi % questions.length];
      const ok = Number(btn.getAttribute('data-opt')) === q.a;
      let msg;
      if (ok) {
        streak++;
        setGameBest(course, lesson, 'streakBest', streak);
        if (streak >= GOAL) {
          markGameDone(course, lesson, game);
          body.innerHTML = '<div class="ls-game-win hot">🔥🔥🔥 STREAK FIRE! ' + GOAL + ' ketma-ket to‘g‘ri javob — ajoyib!</div>' +
            '<button type="button" class="btn btn-primary btn-sm" data-streak-retry="1">🔄 Qayta o‘ynash</button>';
          return;
        }
        msg = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! Streak oshdi 🔥</div>';
      } else {
        streak = 0;
        shakeEl(btn);
        msg = '<div class="ls-ex-feedback bad">❌ Streak reset bo‘ldi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
      }
      qi++;
      render(msg);
    });
    render();
  }

  /* ---------- ⚔️ O‘YIN 7: CODE DUEL (bot-versiya — real-time Duel arxitekturaga ulanuvchan) ---------- */
  function setupDuel(course, lesson, game, questions, body) {
    if (!questions.length) return;
    const ROUNDS = 3;
    let ri = 0, me = 0, bot = 0, lock = false;
    function render(msg) {
      const q = questions[ri % questions.length];
      body.innerHTML =
        '<div class="ls-duel-score"><span class="ls-duel-me">🧑 Siz: <b>' + me + '</b></span><span class="ls-duel-vs">VS</span><span class="ls-duel-bot">🤖 Bot: <b>' + bot + '</b></span></div>' +
        '<div class="ls-duel-round">Round ' + (ri + 1) + ' / ' + ROUNDS + ' — bir xil savol, kim tezroq va to‘g‘ri javob bersa — g‘olib!</div>' +
        '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
        '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
          return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-run-fb">' + (msg || '') + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm ls-duel-full" data-full-duel="1">⚔️ To‘liq Duel sahifasini ochish</button>';
    }
    function finish() {
      setGameBest(course, lesson, 'duelWins', me);
      const won = me > bot;
      if (won) markGameDone(course, lesson, game);
      body.innerHTML =
        '<div class="ls-game-win' + (won ? ' hot' : '') + '">' + (won ? '⚔️ G‘ALIB! Siz botni yutdingiz (' + me + ' : ' + bot + ')!' : '💪 Bot yutdi (' + bot + ' : ' + me + '). Yana urinib ko‘ring!') + '</div>' +
        '<button type="button" class="btn btn-primary btn-sm" data-duel-retry="1">🔄 Qayta duellar</button>' +
        '<button type="button" class="btn btn-ghost btn-sm ls-duel-full" data-full-duel="1">⚔️ To‘liq Duel sahifasini ochish</button>';
    }
    body.addEventListener('click', function (e) {
      if (e.target.closest('[data-full-duel]')) { page('duel'); return; } // 🔗 mavjud Duel tizimiga o‘tish
      if (e.target.closest('[data-duel-retry]')) { ri = 0; me = 0; bot = 0; lock = false; render(); return; }
      const btn = e.target.closest('[data-opt]');
      if (!btn || lock || ri >= ROUNDS) return;
      lock = true;
      const q = questions[ri % questions.length];
      const myOk = Number(btn.getAttribute('data-opt')) === q.a;
      const myTime = Date.now();
      const botOk = Math.random() < 0.6; // bot 60% aniqlik bilan javob beradi
      const botTime = myTime + 800 + Math.floor(Math.random() * 1800);
      let msg;
      const myPoint = myOk && (!botOk || myTime < botTime);
      const botPoint = botOk && (!myOk || botTime <= myTime);
      if (myPoint) { me++; msg = '<div class="ls-ex-feedback ok">✅ Tez va to‘g‘ri — ochko sizniki! ⚡</div>'; }
      else if (botPoint) { bot++; msg = '<div class="ls-ex-feedback bad">🤖 Bot javob berdi: <b>' + fmt(q.o[q.a]) + '</b> — bot tezroq bo‘ldi.</div>'; }
      else { msg = '<div class="ls-ex-feedback bad">❌ Ikkala tomon ham xato qildi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>'; }
      ri++;
      if (ri >= ROUNDS) setTimeout(finish, 900);
      else setTimeout(function () { render(msg); lock = false; }, 900);
    });
    render();
  }

  /* ---------- 🚀 LOYIHA: MY FIRST PORTFOLIO ---------- */
  function projectReturnCtx(course, lesson) {
    const body = document.querySelector('.ls-viewer-body');
    const ctx = { courseId: course.id, lessonId: lesson.id, lessonNumber: lesson.number, scrollY: body ? body.scrollTop : 0, at: Date.now() };
    try { localStorage.setItem('ls_return_ctx', JSON.stringify(ctx)); } catch (e) { /* ignore */ }
    return ctx;
  }
  function renderProjectHTML(course, lesson) {
    const cfg = lesson.content.project;
    let html = '<div class="ls-project" id="lsProject">' +
      '<div class="ls-project-hero"><div class="ls-project-title">' + esc(cfg.title) + '</div>' +
        '<div class="ls-project-sub">' + esc(cfg.subtitle) + '</div>' +
        '<div class="ls-project-intro">' + fmtText(cfg.intro || '') + '</div></div>';
    // STEP bosqichlari — kumulyativ kod (har bosqich oldingisiga qo‘shiladi)
    let acc = { html: '', css: '', js: '' };
    html += '<div class="ls-project-steps">';
    cfg.steps.forEach(function (step, i) {
      acc.html += step.addHtml || '';
      acc.css += (step.addCss || '');
      acc.js += (step.addJs || '');
      html += '<div class="ls-step-card"><div class="ls-step-head"><span class="ls-step-num">' + (i + 1) + '</span><span class="ls-step-title">' + esc(step.title) + '</span></div>' +
        '<div class="ls-step-note">' + fmtText(step.note || '') + '</div>';
      if (step.addHtml) html += '<pre class="ls-step-code">' + esc(step.addHtml) + '</pre>';
      if (step.addCss) html += '<pre class="ls-step-code css">&lt;style&gt;\n' + esc(step.addCss) + '\n&lt;/style&gt;</pre>';
      if (step.addJs) html += '<pre class="ls-step-code js">&lt;script&gt;\n' + esc(step.addJs) + '\n&lt;/script&gt;</pre>';
      html += '<button type="button" class="btn btn-ghost btn-sm ls-step-pg" data-step-pg="' + i + '">💻 Codingda davom etish</button>' +
        '</div>';
    });
    html += '</div>';
    // CHECKLIST + progress
    html += '<div class="ls-project-checklist-wrap"><div class="ls-checklist-title">📋 PROJECT CHECKLIST</div>' +
      '<div class="ls-progress-track ls-project-progress"><span id="lsProjectBar" style="width:0%"></span></div>' +
      '<div class="ls-project-pct" id="lsProjectPct">0%</div>' +
      '<div class="ls-checklist" id="lsProjectChecklist"></div>' +
      '<div class="ls-game-note" id="lsProjectParty" hidden>🎉 <b>TABRIKLAYMIZ!</b> Sen birinchi portfolio saytingni yaratding! Endi pastdagi LOYIHA editorida ▶ RUN bosib, «🏆 Loyihani yakunlash» tugmasini bosing.</div>' +
      '</div>';
    html += '</div>';
    return html;
  }
  function splitPageCode(code) {
    const cssM = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const jsM = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    let html = code.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<!DOCTYPE[^>]*>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?head[^>]*>/gi, '').replace(/<\/?body[^>]*>/gi, '').replace(/<title[^>]*>[\s\S]*?<\/title>/i, '').trim();
    return { html: html, css: (cssM ? cssM[1].trim() : ''), js: (jsM ? jsM[1].trim() : '') };
  }
  function setupProject(course, lesson) {
    const root = $('#lsProject');
    const cfg = lesson.content.project;
    if (!root) return;
    // Kumulyativ step kodlari — playgroundga yuborish uchun hisoblanadi
    const stepCode = [];
    let acc = { html: '', css: '', js: '' };
    cfg.steps.forEach(function (step) {
      acc = { html: acc.html + (step.addHtml || ''), css: acc.css + (step.addCss || ''), js: acc.js + (step.addJs || '') };
      stepCode.push({ html: acc.html, css: acc.css, js: acc.js });
    });
    // STEP → Coding Playground (raw HTML + CSS + JS — 3 ta tabga)
    root.querySelectorAll('[data-step-pg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const s = stepCode[Number(btn.getAttribute('data-step-pg'))] || { html: '', css: '', js: '' };
        if (typeof window.openCodePlaygroundWithCode === 'function') {
          window.openCodePlaygroundWithCode(s.html, s.css, s.js, projectReturnCtx(course, lesson));
          toast('💻 Kod Coding Playgroundga yuklandi (HTML / CSS / JS)', 'info');
        } else if (typeof window.openCodePlaygroundWithHtml === 'function') {
          window.openCodePlaygroundWithHtml(s.html, projectReturnCtx(course, lesson));
        } else toast('Coding Playground topilmadi', 'error');
      });
    });
    // LOYIHA editori (ex: l5project) — kodni saqlash + checklistni yangilash
    const KEY = 'ls_project_code_' + lesson.id;
    const ta = document.getElementById('lsExCode-l5project');
    if (ta) {
      try {
        const saved = localStorage.getItem(KEY);
        if (saved != null && saved !== '') ta.value = saved;
      } catch (e) { /* ignore */ }
      ta.addEventListener('input', function () {
        try { localStorage.setItem(KEY, ta.value); } catch (e) { /* ignore */ }
        updateProjectChecklist(course, lesson, cfg);
      });
      // 💻 "Codingda davom etish" — hozirgi loyiha kodini HTML/CSS/JS bo'lib yuborish
      const pgBtn = document.querySelector('[data-project-pg="1"]');
      if (pgBtn && !pgBtn.getAttribute('data-bound')) {
        pgBtn.setAttribute('data-bound', '1');
        pgBtn.addEventListener('click', function () {
          const parts = splitPageCode(ta.value);
          if (typeof window.openCodePlaygroundWithCode === 'function') {
            window.openCodePlaygroundWithCode(parts.html, parts.css, parts.js, projectReturnCtx(course, lesson));
            toast('💻 Kod Coding Playgroundga yuklandi (HTML / CSS / JS)', 'info');
          } else if (typeof window.openCodePlaygroundWithHtml === 'function') {
            window.openCodePlaygroundWithHtml(ta.value, projectReturnCtx(course, lesson));
          }
        });
      }
    }
    updateProjectChecklist(course, lesson, cfg);
  }
  function updateProjectChecklist(course, lesson, cfg) {
    const wrap = $('#lsProjectChecklist');
    if (!wrap) return;
    const ta = document.getElementById('lsExCode-l5project');
    const code = ta ? ta.value : '';
    let doneCount = 0;
    const items = cfg.checklist.map(function (c) {
      const ok = new RegExp(c.re, 'i').test(code);
      if (ok) doneCount++;
      return '<div class="ls-check-item' + (ok ? ' done' : '') + '"><span class="ls-check-ico">' + (ok ? '✅' : '☐') + '</span><span>' + esc(c.label) + '</span></div>';
    }).join('');
    const pct = Math.round(doneCount / cfg.checklist.length * 100);
    wrap.innerHTML = items;
    const bar = $('#lsProjectBar'); if (bar) bar.style.width = pct + '%';
    const pctEl = $('#lsProjectPct'); if (pctEl) pctEl.textContent = pct + '%';
    const party = $('#lsProjectParty'); if (party) party.hidden = pct !== 100;
  }

  /* ---------- 🏆 LOYIHANI YAKUNLASH (+ success screen) ---------- */
  function finishProjectLesson(course, lesson) {
    const prog = courseProgress(course.id);
    if (!prog.completed) prog.completed = {};
    if (!prog.completed[lesson.id]) {
      prog.completed[lesson.id] = { at: Date.now(), score: 10, percent: 100, project: true };
      const coins = (lesson.content.project && lesson.content.project.coins) || 50;
      try {
        const u = currentUser();
        if (u) u.coins = (u.coins || 0) + coins;
      } catch (e) { /* ignore */ }
      prog.lastVisit = Date.now();
      store.progress[course.id] = prog;
      saveStore();
      const totalCompleted = Object.keys(prog.completed).length;
      const courseCompleted = totalCompleted >= course.lessonCount;
      Effects.celebrate({ courseId: course.id, course: course, lesson: lesson });
      Hooks.onLessonComplete.forEach(function (fn) {
        try { fn({ courseId: course.id, course: course, lesson: lesson, xp: lesson.xp, coins: coins, totalCompleted: totalCompleted, courseCompleted: courseCompleted }); } catch (e) { /* ignore */ }
      });
      toast('🎉 BIRINCHI SAYTING TAYYOR! ⭐ +' + lesson.xp + ' XP · 🪙 +' + coins, 'success');
    } else {
      saveStore();
    }
    state.lessonPhase = 'result';
    renderLessonView();
    page('lessonView');
  }
  /** 🎉 5-dars SUCCESS SCREEN — quiz yo‘q, loyiha natijasi */
  function renderProjectResultPhase(found) {
    const wrap = $('#lsLessonContainer');
    if (!wrap) return;
    const course = found.course, lesson = found.lesson;
    const next = window.CoursesAPI.nextLesson(course.id, lesson.id);
    let xp = 0, coins = 0, streak = '—';
    try {
      const u = currentUser();
      if (u) { xp = u.xp || 0; coins = u.coins || 0; streak = u.streak || u.streakCount || '—'; }
    } catch (e) { /* ignore */ }
    wrap.innerHTML =
      '<div class="ls-viewer-wrap ls-result-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top"><button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button></div>' +
        '<div class="ls-viewer-card">' +
          '<div class="ls-viewer-hero ls-result-hero pass ls-project-hero-pass">' +
            '<div class="ls-result-emoji">🎉</div>' +
            '<h3>BIRINCHI SAYTING TAYYOR!</h3>' +
            '<div class="ls-project-congrats">' +
              '<p>“Sen <b>HTML structure</b> yaratding.”</p>' +
              '<p>“<b>CSS</b> bilan uni bezading.”</p>' +
              '<p>“<b>JavaScript</b> bilan interaktiv qilding.”</p>' +
            '</div>' +
            '<div class="ls-reward-chips">' +
              '<span class="ls-reward-chip xp">⭐ XP: ' + xp + '</span>' +
              '<span class="ls-reward-chip coin">🪙 Coins: ' + coins + '</span>' +
              '<span class="ls-reward-chip">🔥 Streak: ' + streak + '</span>' +
              '<span class="ls-reward-chip ok">🏆 Project: ✅</span>' +
            '</div>' +
          '</div>' +
          (next ? '<div class="ls-unlock-banner">🔓 ' + next.number + '-dars ochildi: <b>' + esc(next.title) + '</b></div>' : '') +
          '<div class="ls-viewer-footer ls-result-actions">' +
            (next ? '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoNextBtn">🚀 Keyingi darsga o‘tish</button>' : '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoCourseBtn">🏆 Kurs sahifasiga qaytish</button>') +
            '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsga qaytish</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    const backBtn = $('#lsBackToCourse');
    if (backBtn) backBtn.addEventListener('click', function () { openCourse(course.id); });
    const nextBtn = $('#lsGoNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', function () { openLesson(course.id, next.id); });
    const courseBtn = $('#lsGoCourseBtn');
    if (courseBtn) courseBtn.addEventListener('click', function () { openCourse(course.id); });
    const revBtn = $('#lsReviewLessonBtn');
    if (revBtn) revBtn.addEventListener('click', function () { state.lessonPhase = 'read'; renderLessonView(); });
  }

  /** Read bosqichi pastki CTA qismi */
  function readFooterHTML(course, lesson) {
    /* 🏆 5-dars LOYIHA yakunlash: quiz yo‘q — loyiha bajarilgach dars tugaydi */
    if (!lesson.quiz && lesson.content && lesson.content.project) {
      const exs = (lesson.content.exercises || []).filter(function (ex) { return !ex.bonus; });
      const done = exs.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
      if (!allExercisesDone(course.id, lesson.id, exs)) {
        return '<div class="ls-read-hint locked" id="lsExLockedHint">🔒 Darsni yakunlash uchun <b>LOYIHANI bajaring</b> (' + done + '/' + exs.length + ' topshiriq bajarildi).</div>';
      }
      const completed = isLessonCompleted(course.id, lesson.id);
      return '<div class="ls-read-hint ok">🏆 Loyiha bajarildi — checklist 100%!</div>' +
        '<button type="button" class="btn btn-primary ls-btn-test" id="lsFinishProjectBtn">' + (completed ? '🎉 Natija ekranini ko‘rish' : '🏆 Loyihani yakunlash') + '</button>';
    }
    if (!lesson.quiz) {
      return '<div class="ls-read-hint">🧪 Bu darsning testi tez orada qo‘shiladi.</div>';
    }
    // Mashqlar mavjud bo'lsa — barchasi bajarilmaguncha test YOPIQ
    const exercises = ((lesson.content && lesson.content.exercises) || []).filter(function (ex) { return !ex.bonus; });
    if (exercises.length) {
      const done = exercises.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
      if (!allExercisesDone(course.id, lesson.id, exercises)) {
        return '<div class="ls-read-hint locked" id="lsExLockedHint">🔒 Test hali yopiq. <b>Avval barcha mashqlarni bajaring</b> (' + done + '/' + exercises.length + ' bajarildi).</div>';
      }
      return '<div class="ls-read-hint ok">🧩 Barcha mashqlar bajarildi — test ochildi!</div>' +
        '<button type="button" class="btn btn-primary ls-btn-test" id="lsStartQuizBtn">🧪 Testni boshlash <span class="ls-btn-arrow">→</span></button>';
    }
    const read = isLessonRead(course.id, lesson.id);
    const completed = isLessonCompleted(course.id, lesson.id);
    if (read) {
      return (completed
          ? '<div class="ls-read-hint ok">✅ Bu dars allaqachon tugallangan. Testni qayta topshirib, natijani yangilashingiz mumkin.</div>'
          : '') +
        '<button type="button" class="btn btn-primary ls-btn-test" id="lsStartQuizBtn">🧪 Testni boshlash <span class="ls-btn-arrow">→</span></button>';
    }
    return '<div class="ls-read-hint" id="lsReadHint">📖 Darsni oxirigacha o‘qing — test avtomatik ochiladi.</div>' +
      '<button type="button" class="btn btn-ghost" id="lsMarkReadBtn">✅ O‘qidim deb belgilash</button>';
  }

  function bindReadFooter(course, lesson) {
    const startBtn = $('#lsStartQuizBtn');
    if (startBtn) startBtn.addEventListener('click', function () { startQuizAttempt(course, lesson); });
    const finishBtn = $('#lsFinishProjectBtn');
    if (finishBtn) finishBtn.addEventListener('click', function () { finishProjectLesson(course, lesson); });
    const markBtn = $('#lsMarkReadBtn');
    if (markBtn) markBtn.addEventListener('click', function () {
      markLessonRead(course.id, lesson.id);
      cleanupScroll();
      refreshReadFooter(course, lesson);
      toast('📖 Dars o‘qilgan deb belgilandi — test ochildi!', 'info');
    });
  }

  function refreshReadFooter(course, lesson) {
    const footer = $('#lsReadFooter');
    if (!footer) return;
    footer.innerHTML = readFooterHTML(course, lesson);
    bindReadFooter(course, lesson);
  }

  /** Dars oxirigacha scroll qilinganini kuzatish — read bo'lsa test ochiladi */
  function attachReadTracking(course, lesson) {
    cleanupScroll();
    if (isLessonRead(course.id, lesson.id) || !lesson.content) return;
    const onScroll = function () {
      const body = document.querySelector('.ls-viewer-body');
      if (!body) return;
      const rect = body.getBoundingClientRect();
      // Kontent oxiri ekranda ko'rinsa — o'qilgan hisoblanadi
      if (rect.bottom <= window.innerHeight + 90) {
        markLessonRead(course.id, lesson.id);
        cleanupScroll();
        refreshReadFooter(course, lesson);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    state._scrollCleanup = function () { window.removeEventListener('scroll', onScroll); };
    // Kontent qisqa bo'lib butunlay ko'rinsa — darhol o'qilgan deb belgilash
    setTimeout(onScroll, 350);
  }

  /** Viewer dispatcher — bosqichga qarab render */
  function renderLessonView() {
    cleanupScroll();
    const wrap = $('#lsLessonContainer');
    if (!wrap) return;
    const found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
    if (!found) {
      wrap.innerHTML = '<div class="ls-empty"><div class="ls-empty-ico">🤔</div><h4>Dars topilmadi</h4></div>';
      return;
    }
    if (state.lessonPhase === 'quiz') return renderQuizPhase(found);
    if (state.lessonPhase === 'result') {
      if (found.lesson.content && found.lesson.content.project && !found.lesson.quiz) return renderProjectResultPhase(found);
      return renderResultPhase(found);
    }
    return renderReadPhase(found);
  }

  /** 📚 1-BOSQICH: Darsni o'rganish */
  function renderReadPhase(found) {
    const wrap = $('#lsLessonContainer');
    if (!wrap) return;
    const course = found.course, lesson = found.lesson, index = found.index;
    const completed = isLessonCompleted(course.id, lesson.id);
    const read = isLessonRead(course.id, lesson.id);
    const next = course.lessons[index + 1] || null;
    const prev = course.lessons[index - 1] || null;

    const titleEl = $('#pageTitle');
    if (titleEl) titleEl.textContent = course.name + ' — ' + lesson.number + '-dars';

    // Holat belgisi
    let statusHtml;
    if (completed) statusHtml = '<span class="ls-status-badge done">✅ Tugallangan</span>';
    else if (read) statusHtml = '<span class="ls-status-badge ready">🧪 Testga tayyor</span>';
    else statusHtml = '<span class="ls-status-badge reading">📖 O‘qilmoqda</span>';

    // Kontent yoki placeholder
    const bodyHtml = lesson.content ? renderLessonContentHTML(lesson.content, course, lesson) :
      '<div class="ls-placeholder">' +
        '<div class="ls-placeholder-ico">📚</div>' +
        '<h4>Dars tayyorlanmoqda</h4>' +
        '<p>Bu darsning kontenti tez orada qo‘shiladi. Qolgan darslar bilan tanishib chiqishingiz mumkin.</p>' +
      '</div>';

    // 🤖 Robot dars boshida — HAQIQIY 3D RASM + platforma
    const mascotIntro =
      '<div class="ls-mascot-intro">' +
        '<div class="ls-mascot-intro-text">' +
          '<h4>' + lesson.number + '-dars: ' + esc(lesson.title) + '</h4>' +
          '<p>' + esc(lesson.description || 'Ushbu darsda mavzu nazariyasi, amaliy kod namunalari va qiziqarli topshiriqlar bilan tanishasiz.') + '</p>' +
        '</div>' +
        (window.IT_MASCOT_HTML ? IT_MASCOT_HTML('idle', 'mascot-lg') : '') +
      '</div>';

    wrap.innerHTML =
      '<div class="ls-viewer-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
          '<button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
          '<div class="ls-viewer-hero">' +
            '<div class="ls-viewer-crumb">' +
              '<span class="ls-chip">' + esc(course.icon) + ' ' + esc(course.name) + '</span>' +
              '<span>' + lesson.number + '-dars / ' + course.lessonCount + '</span>' +
            '</div>' +
            '<h3>📚 ' + lesson.number + '-dars: ' + esc(lesson.title) + '</h3>' +
            '<div class="ls-viewer-meta">' +
              '<span>⏱ ' + lesson.duration + ' daqiqa</span>' +
              '<span>📊 ' + esc(lesson.difficulty) + '</span>' +
              statusHtml +
            '</div>' +
          '</div>' +
          '<div class="ls-viewer-body">' + mascotIntro + bodyHtml + '</div>' +
          '<div class="ls-read-footer" id="lsReadFooter">' + readFooterHTML(course, lesson) + '</div>' +
          '<div class="ls-viewer-footer">' +
            '<button type="button" class="btn btn-ghost" id="lsPrevLesson"' + (prev ? '' : ' disabled') + '>← Oldingi</button>' +
            '<div class="ls-complete-note">💡 Darsni o‘qing, testni topshiring — o‘tsangiz keyingi dars ochiladi.</div>' +
            '<button type="button" class="btn btn-ghost" id="lsNextLesson">' +
              (next ? (isLessonUnlocked(course, next, index + 1) ? 'Keyingi →' : '🔒 Keyingi') : 'Keyingi →') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    $('#lsBackToCourse').addEventListener('click', function () {
      cleanupScroll();
      renderCoursePage();
      page('lessonCourse');
    });
    // 🤖 Yangi dars ochildi → newLesson / rocket, keyin idle
    const introM = wrap.querySelector('.ls-mascot-intro .mascot');
    if (introM && window.ITMascot) {
      ITMascot.setState(introM, 'newLesson');
      ITMascot.say(introM, '');
      setTimeout(function () {
        if (introM.isConnected) ITMascot.setState(introM, 'idle');
      }, 1200);
    }
    const prevBtn = $('#lsPrevLesson');
    if (prevBtn && prev) prevBtn.addEventListener('click', function () { openLesson(course.id, prev.id); });
    const nextBtn = $('#lsNextLesson');
    if (nextBtn && next) {
      nextBtn.addEventListener('click', function () {
        if (isLessonUnlocked(course, next, index + 1)) openLesson(course.id, next.id);
        else openLockedModal(course, next, index + 1);
      });
    } else if (nextBtn) {
      nextBtn.disabled = true; // oxirgi dars
    }
    bindReadFooter(course, lesson);
    attachReadTracking(course, lesson);
    // 🤖 AI lesson context — darsdagi tushunchalar autocomplete'da ustuvor
    if (window.ITTestAI) {
      try {
        window.ITTestAI.setLessonContext({
          courseId: course.id, lessonId: lesson.id, lessonNumber: lesson.number,
          title: lesson.title, keywords: window.ITTestAI.extractLessonKeywords(lesson)
        });
      } catch (e) { /* ignore */ }
    }
    if (lesson.content && lesson.content.exercises) bindExercises(course, lesson);
    setupLessonExtras(course, lesson);
  }

  /* ==========================================================
     5) 🧪 TEST ENGINE — random savollar + natija
     ========================================================== */

  /** Bitta savolni variantlari aralashtirilgan ko'rinishga keltirish */
  function shuffleQuestion(q) {
    const order = q.options.map(function (_, i) { return i; });
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
    return {
      question: q.question,
      options: order.map(function (i) { return q.options[i]; }),
      answer: order.indexOf(q.answer),
      explanation: q.explanation || ''
    };
  }

  /** Yangi test urinishasi boshlash — bankdan random 5 ta savol */
  function startQuizAttempt(course, lesson) {
    const quiz = lesson.quiz;
    if (!quiz || !quiz.questions.length) return;
    // Mashqlar bajarilmaguncha test ochilmaydi
    const exercises = (lesson.content && lesson.content.exercises) || [];
    if (exercises.length && !allExercisesDone(course.id, lesson.id, exercises)) {
      toast('🔒 Test hali yopiq. Avval barcha mashqlarni bajaring.', 'warning');
      state.lessonPhase = 'read';
      renderLessonView();
      return;
    }
    // Savollar soni: dars override qilsa shunchaki, aks holda global default
    const qCount = (lesson.content && lesson.content.quizQuestionCount) || QUIZ_QUESTIONS_PER_TEST;
    const picked = shuffleArr(quiz.questions).slice(0, Math.min(qCount, quiz.questions.length));
    state.quiz = {
      items: picked.map(shuffleQuestion),
      answers: picked.map(function () { return null; }),
      index: 0,
      result: null
    };
    state.lessonPhase = 'quiz';
    renderLessonView();
  }

  function answerQuizOption(i) {
    const qs = state.quiz;
    if (!qs || qs.answers[qs.index] != null) return; // allaqachon javob berilgan
    qs.answers[qs.index] = i;
    // renderQuizPhase argumant sifatida found'ni talab qiladi —
    // joriy darsni qayta topamiz — course/lesson konteksti yo‘qolmasin
    const found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
    renderQuizPhase(found); // to'g'ri/noto'g'ri feedback bilan qayta chizish
  }

  /** 🧪 2-BOSQICH: savol kartasi */
  function renderQuizPhase(found) {
    const wrap = $('#lsLessonContainer');
    if (!wrap) return;
    // Himoya: found berilmasa (yoki eskirgan bo'lsa) joriy darsdan qayta topamiz
    if (!found || !found.course) {
      found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
    }
    if (!found) { state.lessonPhase = 'read'; state.quiz = null; return renderLessonView(); }
    const course = found.course, lesson = found.lesson;
    const quiz = lesson.quiz;
    const qs = state.quiz;
    if (!qs) { startQuizAttempt(course, lesson); return; }

    const item = qs.items[qs.index];
    const total = qs.items.length;
    const answered = qs.answers[qs.index] != null;
    const selected = qs.answers[qs.index];
    const isLast = qs.index >= total - 1;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const testResult = getTestResult(course.id, lesson.id);

    const titleEl = $('#pageTitle');
    if (titleEl) titleEl.textContent = course.name + ' — ' + lesson.number + '-dars testi';

    let optionsHtml = item.options.map(function (opt, i) {
      let cls = 'ls-quiz-option';
      let mark = '';
      if (answered) {
        if (i === item.answer) { cls += ' ls-opt-correct'; mark = '<span class="ls-opt-mark ok">✓</span>'; }
        else if (i === selected) { cls += ' ls-opt-wrong'; mark = '<span class="ls-opt-mark bad">✗</span>'; }
      }
      return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (answered ? ' disabled' : '') + '>' +
        '<span class="ls-opt-letter">' + letters[i] + '</span>' +
        '<span class="ls-opt-text">' + fmt(opt) + '</span>' +
        mark +
        '</button>';
    }).join('');

    wrap.innerHTML =
      '<div class="ls-viewer-wrap ls-quiz-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
          '<button type="button" class="ls-back-btn" id="lsQuizBackBtn">← Darsga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
          '<div class="ls-viewer-hero ls-quiz-hero">' +
            '<div class="ls-viewer-crumb">' +
              '<span class="ls-chip">🧪 ' + lesson.number + '-dars testi</span>' +
              '<span class="ls-chip">' + esc(course.icon) + ' ' + esc(course.name) + '</span>' +
            '</div>' +
            '<h3>' + esc(lesson.title) + '</h3>' +
            '<div class="ls-viewer-meta">' +
              '<span>❓ Savollar: ' + total + ' ta</span>' +
              '<span>🎯 O‘tish balli: ' + quiz.passingScore + '%</span>' +
              (testResult ? '<span>🔁 Urinishlar: ' + testResult.attempts + '</span>' : '') +
            '</div>' +
            '<div class="ls-quiz-progress">' +
              '<div class="ls-progress-track"><span style="width:' + Math.round(((qs.index + 1) / total) * 100) + '%"></span></div>' +
              '<span class="ls-quiz-progress-text">' + (qs.index + 1) + ' / ' + total + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="ls-viewer-body ls-quiz-body">' +
            '<div class="ls-quiz-questioncard ls-anim-quiz">' +
              '<div class="ls-quiz-qnum">' + (qs.index + 1) + '-savol</div>' +
              '<div class="ls-quiz-question">' + fmt(item.question) + '</div>' +
              '<div class="ls-quiz-options">' + optionsHtml + '</div>' +
              (answered
                ? '<div class="ls-quiz-actions"><button type="button" class="btn btn-primary" id="lsQuizNextBtn">' + (isLast ? 'Natijani ko‘rish →' : 'Keyingi savol →') + '</button></div>'
                : '<div class="ls-quiz-hint">👆 Variantlardan birini tanlang</div>') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    $('#lsQuizBackBtn').addEventListener('click', function () {
      state.lessonPhase = 'read';
      state.quiz = null;
      renderLessonView();
    });
    $$('.ls-quiz-option', wrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        answerQuizOption(Number(btn.getAttribute('data-i')));
      });
    });
    const nextBtn = $('#lsQuizNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (qs.index >= total - 1) finishQuizAttempt(found);
      else { qs.index++; renderQuizPhase(found); }
    });
  }

  /** Test yakunlandi — ball hisoblanadi va saqlanadi */
  function finishQuizAttempt(found) {
    const course = found.course, lesson = found.lesson;
    const quiz = lesson.quiz;
    const qs = state.quiz;
    if (!qs) return;
    const total = qs.items.length;
    let score = 0;
    qs.items.forEach(function (it, i) { if (qs.answers[i] === it.answer) score++; });
    const percent = Math.round((score / total) * 100);
    // passingScore: masalan 80% va 5 savol => kamida 4 to'g'ri javob
    const passed = score * 100 >= quiz.passingScore * total;

    const prog = courseProgress(course.id);
    if (!prog.testResults) prog.testResults = {};
    const prev = prog.testResults[lesson.id];
    prog.testResults[lesson.id] = {
      passed: passed, score: score, total: total, percent: percent,
      at: Date.now(), attempts: ((prev && prev.attempts) || 0) + 1
    };

    let firstPass = false;
    if (passed && !isLessonCompleted(course.id, lesson.id)) {
      firstPass = true;
      if (!prog.completed) prog.completed = {};
      prog.completed[lesson.id] = { at: Date.now(), score: score, percent: percent };
    }

    // 🏆 MASTER: barcha mashqlar bajarilgan + testdan o'tilgan
    const exs = (lesson.content && lesson.content.exercises) || [];
    const isMastered = !!(passed && exs.length && allExercisesDone(course.id, lesson.id, exs));
    let masterAwardedNow = false;
    if (isMastered && !(prog.mastered && prog.mastered[lesson.id])) {
      if (!prog.mastered) prog.mastered = {};
      prog.mastered[lesson.id] = { at: Date.now() };
      masterAwardedNow = true;
      const masterXp = (lesson.content && lesson.content.masterXp) || 30;
      try {
        const u = currentUser();
        if (u && typeof window.xpToLevel === 'function') {
          u.xp = (u.xp || 0) + masterXp;
          u.points = (u.points || 0) + masterXp;
          u.level = window.xpToLevel(u.xp);
        }
      } catch (e) { /* ignore */ }
    }
    prog.lastVisit = Date.now();
    store.progress[course.id] = prog;
    saveStore();

    qs.result = { score: score, total: total, percent: percent, passed: passed, firstPass: firstPass, mastered: isMastered, masterAwardedNow: masterAwardedNow };
    state.lessonPhase = 'result';

    if (passed) {
      const totalCompleted = Object.keys(prog.completed).length;
      const courseCompleted = totalCompleted >= course.lessonCount;
      const xp = lesson.xp || 10, coins = LESSON_COIN_REWARD;
      if (masterAwardedNow) {
        const mxp = (lesson.content && lesson.content.masterXp) || 30;
        toast('🎉 ' + lesson.number + '-DARS MASTERED! ⭐ +' + mxp + ' XP 🔓 ' + ((course.lessons[course.lessons.findIndex(function (l) { return l.id === lesson.id; }) + 1] || {}).number || '') + '-dars ochildi', 'success');
      } else if (firstPass) {
        toast('🎉 Testdan o‘tdingiz! ⭐ +' + xp + ' XP · 🪙 +' + coins, 'success');
        Effects.celebrate({ courseId: course.id, course: course, lesson: lesson });
        Hooks.onLessonComplete.forEach(function (fn) {
          try {
            fn({ courseId: course.id, course: course, lesson: lesson, xp: xp, coins: coins, totalCompleted: totalCompleted, courseCompleted: courseCompleted });
          } catch (e) { console.warn('onLessonComplete hook xatosi', e); }
        });
        if (courseCompleted) toast('🏆 "' + course.name + '" kursini to‘liq tugatdingiz!', 'success');
      } else {
        toast('✅ Test qayta topshirildi: ' + percent + '%', 'success');
      }
    } else {
      toast('❌ Testdan o‘tmadingiz (' + percent + '%). Yana urinib ko‘ring!', 'error');
    }
    renderResultPhase(found);
  }

  /** Variant harflari (A, B, C, D...) */
  function lettersOf(item) {
    return item.options.map(function (_, i) {
      return ['A', 'B', 'C', 'D', 'E', 'F'][i] || String(i + 1);
    });
  }

  /** 🏆 3-BOSQICH: natija ekrani + xatolar tahlili */
  function renderResultPhase(found) {
    const wrap = $('#lsLessonContainer');
    if (!wrap) return;
    const course = found.course, lesson = found.lesson;
    const qs = state.quiz;
    if (!qs || !qs.result) { state.lessonPhase = 'read'; return renderReadPhase(found); }
    const r = qs.result;
    const quiz = lesson.quiz;
    const next = course.lessons[course.lessons.findIndex(function (l) { return l.id === lesson.id; }) + 1] || null;

    const titleEl = $('#pageTitle');
    if (titleEl) titleEl.textContent = course.name + ' — test natijasi';

    // --- Javoblar tahlili (har bir savol + izoh) ---
    let reviewHtml = '<div class="ls-review"><div class="ls-review-title">📋 Javoblaringiz tahlili</div>';
    qs.items.forEach(function (it, i) {
      const selected = qs.answers[i];
      const ok = selected === it.answer;
      reviewHtml +=
        '<div class="ls-review-item' + (ok ? '' : ' wrong') + '">' +
          '<div class="ls-review-head">' + (ok ? '<span class="ok">✅ To‘g‘ri</span>' : '<span class="bad">❌ Noto‘g‘ri</span>') + '<span class="ls-review-num">' + (i + 1) + '-savol</span></div>' +
          '<div class="ls-review-q">' + fmt(it.question) + '</div>' +
          (selected != null
            ? '<div class="ls-review-line">Siz: <b>' + lettersOf(it)[selected] + ') ' + fmt(it.options[selected]) + '</b></div>'
            : '<div class="ls-review-line">Siz: javob berilmadi</div>') +
          (!ok ? '<div class="ls-review-line good">To‘g‘ri javob: <b>' + lettersOf(it)[it.answer] + ') ' + fmt(it.options[it.answer]) + '</b></div>' : '') +
          (it.explanation ? '<div class="ls-review-expl">💡 ' + fmtText(it.explanation) + '</div>' : '') +
        '</div>';
    });
    reviewHtml += '</div>';
    // --- Mukofotlar ---
    const rewardsHtml = r.passed
      ? '<div class="ls-reward-chips">' +
          '<span class="ls-reward-chip xp">⭐ +' + (lesson.xp || 10) + ' XP</span>' +
          '<span class="ls-reward-chip coin">🪙 +' + (r.firstPass ? LESSON_COIN_REWARD : 0) + ' Coin</span>' +
        '</div>'
      : '';

    // --- Tugmalar ---
    const buttonsHtml = r.passed
      ? (next
          ? '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoNextBtn">Keyingi dars →</button>'
          : '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoCourseBtn">🏆 Kurs sahifasiga qaytish</button>') +
        '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsga qaytish</button>'
      : '<button type="button" class="btn btn-primary" id="lsRetakeBtn">🔄 Qayta topshirish</button>' +
        '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsni qayta ko‘rish</button>';

    wrap.innerHTML =
      '<div class="ls-viewer-wrap ls-result-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
          '<button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
          '<div class="ls-viewer-hero ls-result-hero ' + (r.passed ? 'pass' : 'fail') + '">' +
            '<div class="ls-result-emoji">' + (r.passed ? '🎉' : '😔') + '</div>' +
            '<h3>' + (r.passed ? 'Ajoyib!' : 'Bu safar yetarli bo‘lmadi.') + '</h3>' +
            '<div class="ls-result-score">' +
              '<span class="ls-result-frac">' + r.score + ' / ' + r.total + '</span>' +
              '<span class="ls-result-percent">' + r.percent + '%</span>' +
            '</div>' +
            '<div class="ls-result-badge ' + (r.passed ? 'ok' : 'bad') + '">' + (r.passed ? '✅ Testdan o‘tdingiz!' : '❌ Testdan o‘tmadingiz') + '</div>' +
            (!r.passed ? '<div class="ls-result-note">Kamida <b>' + quiz.passingScore + '%</b> kerak. Darsni qayta ko‘rib, yana urinib ko‘ring — siz bilasiz! 💪</div>' : '') +
            rewardsHtml +
          '</div>' +
          (r.passed && r.mastered ? '<div class="ls-unlock-banner master">🎉 ' + lesson.number + '-DARS MASTERED · ⭐ +' + ((lesson.content && lesson.content.masterXp) || 30) + ' XP' + (next ? ' · 🔓 ' + next.number + '-DARS OCHILDI' : '') + '</div>' : '') +
          (r.passed && next ? '<div class="ls-unlock-banner">🔓 ' + next.number + '-dars ochildi: <b>' + esc(next.title) + '</b></div>' : '') +
          '<div class="ls-viewer-body">' + reviewHtml + '</div>' +
          '<div class="ls-viewer-footer ls-result-actions">' + buttonsHtml + '</div>' +
        '</div>' +
      '</div>';

    $('#lsBackToCourse').addEventListener('click', function () {
      state.quiz = null;
      state.lessonPhase = 'read';
      renderCoursePage();
      page('lessonCourse');
    });
    const nextBtn = $('#lsGoNextBtn');
    if (nextBtn && next) nextBtn.addEventListener('click', function () {
      const wasLocked = !isLessonUnlocked(course, next, course.lessons.findIndex(function (l) { return l.id === next.id; }));
      state.quiz = null;
      openLesson(course.id, next.id);
      if (wasLocked) toast('🔓 ' + next.number + '-dars ochildi!', 'success');
    });
    const goCourseBtn = $('#lsGoCourseBtn');
    if (goCourseBtn) goCourseBtn.addEventListener('click', function () {
      state.quiz = null;
      state.lessonPhase = 'read';
      renderCoursePage();
      page('lessonCourse');
    });
    const retakeBtn = $('#lsRetakeBtn');
    if (retakeBtn) retakeBtn.addEventListener('click', function () {
      startQuizAttempt(course, lesson); // yangi random savollar bilan
    });
    const reviewBtn = $('#lsReviewLessonBtn');
    if (reviewBtn) reviewBtn.addEventListener('click', function () {
      state.quiz = null;
      state.lessonPhase = 'read';
      renderLessonView();
    });
  }

  /* ==========================================================
     6) BILIM DARAJASI MODALI
     ========================================================== */
  function closeModalSafe(el) { if (el) el.classList.remove('active'); }

  function openLevelModal(courseId, firstTime) {
    const modal = $('#lessonLevelModal');
    const body = $('#lessonLevelBody');
    const title = $('#lessonLevelTitle');
    const course = window.CoursesAPI.getCourse(courseId);
    if (!modal || !body || !course) return;

    if (title) title.textContent = course.name + ' bilim darajangizni aniqlaymiz';
    const questions = diagnosticQuestions(course);
    state.diagnostic = {
      courseId: courseId,
      items: questions.map(shuffleQuestion),
      answers: questions.map(function () { return null; }),
      index: 0
    };
    renderDiagnosticQuestion(modal, body);

    const closeBtn = $('#lessonLevelClose');
    if (closeBtn) closeBtn.style.display = firstTime ? 'none' : '';
    const footerClose = modal.querySelector('.modal-footer [data-close]');
    if (footerClose) footerClose.style.display = firstTime ? 'none' : '';
    modal.classList.add('active');
  }

  /** Kurs savollaridan qo‘lda daraja tanlamasdan diagnostika testi tuzish. */
  function diagnosticQuestions(course) {
    const bank = [];
    (course.lessons || []).forEach(function (lesson) {
      if (lesson.quiz && Array.isArray(lesson.quiz.questions)) {
        lesson.quiz.questions.forEach(function (question) {
          if (bank.length < 15) bank.push(question);
        });
      }
    });
    if (!bank.length) return [{ question: course.name + ' kursini boshlashga tayyormisiz?', options: ['Ha', 'Hali emas'], answer: 0, explanation: '' }];
    const count = Math.min(5, bank.length);
    const step = Math.max(1, Math.floor(bank.length / count));
    return Array.from({ length: count }, function (_, i) { return bank[Math.min(i * step, bank.length - 1)]; });
  }

  function renderDiagnosticQuestion(modal, body) {
    const d = state.diagnostic;
    if (!d || !d.items.length) return;
    const item = d.items[d.index];
    const answered = d.answers[d.index] != null;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    body.innerHTML =
      '<p class="ls-modal-sub">Darajani siz emas, shu qisqa test natijasi aniqlaydi.</p>' +
      '<div class="ls-diagnostic-progress">Savol ' + (d.index + 1) + ' / ' + d.items.length + '</div>' +
      '<div class="ls-diagnostic-question">' + fmt(item.question) + '</div>' +
      '<div class="ls-diagnostic-options">' + item.options.map(function (opt, i) {
        return '<button type="button" class="ls-diagnostic-option' + (answered && i === item.answer ? ' correct' : '') + '" data-i="' + i + '"' + (answered ? ' disabled' : '') + '>' +
          '<span>' + letters[i] + '</span>' + fmt(opt) + '</button>';
      }).join('') + '</div>' +
      (answered ? '<div class="ls-diagnostic-feedback">' + (d.answers[d.index] === item.answer ? '✅ To‘g‘ri javob' : '💡 To‘g‘ri javob: ' + fmt(item.options[item.answer])) + '</div>' : '');
    $$('.ls-diagnostic-option', body).forEach(function (button) {
      button.addEventListener('click', function () {
        d.answers[d.index] = Number(button.getAttribute('data-i'));
        if (d.index < d.items.length - 1) d.index++;
        else finishDiagnostic(modal, body);
        renderDiagnosticQuestion(modal, body);
      });
    });
  }

  function finishDiagnostic(modal, body) {
    const d = state.diagnostic;
    const score = d.answers.reduce(function (sum, answer, i) { return sum + (answer === d.items[i].answer ? 1 : 0); }, 0);
    const percent = Math.round((score / d.items.length) * 100);
    const lvl = percent < 40 ? 'beginner' : (percent < 75 ? 'intermediate' : 'advanced');
    setLevel(d.courseId, lvl);
    Hooks.onLevelChange.forEach(function (fn) { try { fn(d.courseId, lvl); } catch (e) { console.warn(e); } });
    closeModalSafe(modal);
    state.diagnostic = null;
    toast('🧠 Test natijasi: ' + percent + '% — "' + LEVEL_LABELS[lvl] + '" daraja aniqlandi', 'success');
    renderCoursePage();
  }

  /* ==========================================================
     7) O'RGANISH SOZLAMALARI MODALI
     ========================================================== */
  function openSettingsModal(courseId) {
    const modal = $('#lessonSettingsModal');
    const body = $('#lessonSettingsBody');
    const course = window.CoursesAPI.getCourse(courseId);
    if (!modal || !body || !course) return;
    const lvl = levelOf(courseId);

    body.innerHTML =
      '<div class="ls-settings-current">🧠 <span><strong>' + esc(course.name) + '</strong> uchun bilim darajasi: <strong>' +
        esc(lvl ? LEVEL_LABELS[lvl] : '—') + '</strong></span></div>' +
      '<p class="ls-modal-sub">Daraja qo‘lda tanlanmaydi. Uni qayta aniqlash uchun testni topshiring.</p>' +
      '<button type="button" class="btn btn-primary" id="lsRetakeDiagnosticBtn">🧪 Darajani test orqali qayta aniqlash</button>' +
      '<div class="ls-settings-danger">' +
        '<button type="button" class="btn btn-ghost" id="lsResetProgressBtn" style="color:var(--danger)">🗑 Kurs progressini tozalash</button>' +
      '</div>';

    const retakeBtn = $('#lsRetakeDiagnosticBtn');
    if (retakeBtn) retakeBtn.addEventListener('click', function () {
      closeModalSafe(modal);
      openLevelModal(courseId, false);
    });

    const resetBtn = $('#lsResetProgressBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (!window.confirm('"' + course.name + '" kursidagi barcha progress o‘chiriladi. Davom etasizmi?')) return;
      delete store.progress[courseId];
      saveStore();
      closeModalSafe(modal);
      toast('Kurs progressi tozalandi', 'info');
      renderCoursePage();
    });

    modal.classList.add('active');
  }

  /* ==========================================================
     8) ROUTING INTEGRATSIYASI (script.js showPage chaqiradi)
     ========================================================== */
  function handlePage(name) {
    loadStore(); // foydalanuvchi o'zgargan bo'lishi mumkin — store yangilash
    if (name === 'lessons') {
      state.currentCourseId = null;
      state.currentLessonId = null;
      renderCoursesPage();
    } else if (name === 'lessonCourse') {
      if (!state.currentCourseId || !window.CoursesAPI.getCourse(state.currentCourseId)) {
        // to'g'ridan-to'g'ri URL orqali kirilgan bo'lsa
        page('lessons');
        return;
      }
      renderCoursePage();
    } else if (name === 'lessonView') {
      if (!state.currentCourseId || !state.currentLessonId ||
          !window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId)) {
        page('lessons');
        return;
      }
      renderLessonView();
    }
  }

  /* ---------- GLOBAL API ---------- */
  window.Lessons = {
    handlePage: handlePage,
    openCourse: openCourse,
    openLesson: openLesson,
    openLevelModal: openLevelModal,
    openSettingsModal: openSettingsModal,
    /** Codingdan darsga qaytish — return context (course/lesson/scroll) tiklanadi */
    returnFromCoding: function () {
      let ctx = null;
      try { ctx = JSON.parse(localStorage.getItem('ls_return_ctx') || 'null'); } catch (e) { ctx = null; }
      if (ctx && ctx.courseId && ctx.lessonId) {
        openLesson(ctx.courseId, ctx.lessonId); // setupLessonExtras scrollni tiklaydi + toast
      } else {
        openCourse('html'); // context yo'q bo'lsa kurs sahifasiga
      }
    },
    /** Darslar bo'limining bosh sahifasiga o'tish */
    go: function () { page('lessons'); }
  };
  window.LessonsHooks = Hooks;
  window.LessonsEffects = Effects;
  window.LessonsLevels = LEVELS;
})();
