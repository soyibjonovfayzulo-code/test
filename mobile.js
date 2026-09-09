/* ============================================================
   ITTest — Android Mobile UI (mobile.js)
   Faqat mobil dashboard (hero, statistika, kurslar) + drawer ESC.
   Mavjud funksiyalar/IDlar bilan konflikt qilmaydi.
   ============================================================ */
(function () {
  const STORE_PREFIX = 'darslar_state_v1';

  let activeCat = 'all';

  const CATEGORY_MAP = {
    frontend: ['html', 'css', 'javascript', 'react'],
    backend: ['sql', 'nodejs'],
    dasturlash: ['python', 'java', 'cpp', 'csharp'],
    ai: ['ai'],
    boshqa: []
  };

  function $(sel) { return document.querySelector(sel); }

  function who() {
    let u = null;
    try { u = window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; } catch (e) { /* noop */ }
    return String((u && (u.username || u.email)) || 'guest').toLowerCase();
  }

  function loadProgress() {
    let store = null;
    try {
      const raw = localStorage.getItem(STORE_PREFIX + '::' + who());
      store = raw ? JSON.parse(raw) : null;
    } catch (e) { store = null; }
    return (store && store.progress) ? store.progress : {};
  }

  function completedOf(courseId, progress) {
    const p = progress[courseId];
    return (p && p.completed) ? Object.keys(p.completed).length : 0;
  }

  function courseCategory(id) {
    for (const cat in CATEGORY_MAP) {
      if (CATEGORY_MAP[cat].indexOf(id) !== -1) return cat;
    }
    return 'boshqa';
  }

  function xpValue() {
    const el = $('#statXp');
    if (el) {
      const n = parseInt(String(el.textContent).replace(/\D/g, ''), 10);
      if (!isNaN(n)) return n;
    }
    return 0;
  }

  function streakValue() {
    let u = null;
    try { u = window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; } catch (e) { /* noop */ }
    return (u && u.streak) ? u.streak : 0;
  }

  function coursesList() {
    if (window.CoursesAPI && typeof window.CoursesAPI.listCourses === 'function') {
      try { return window.CoursesAPI.listCourses() || []; } catch (e) { return []; }
    }
    return [];
  }

  function renderHero(courses, progress) {
    const titleEl = $('#mHeroCourse');
    const lessonEl = $('#mHeroLesson');
    const fillEl = $('#mHeroFill');
    const pctEl = $('#mHeroPct');
    const btn = $('#mHeroBtn');
    if (!titleEl || !btn) return;

    // eng ko'p progressli kursni top (yoki birinchi kurs)
    let target = null, bestPct = -1;
    courses.forEach(c => {
      const total = (c.lessons || []).length;
      if (!total) return;
      const pct = Math.round((completedOf(c.id, progress) / total) * 100);
      if (pct > bestPct) { bestPct = pct; target = c; }
    });
    if (!target && courses.length) target = courses.find(c => (c.lessons || []).length > 0) || courses[0];
    if (!target) return;

    const total = (target.lessons || []).length;
    const done = completedOf(target.id, progress);
    const pct = total ? Math.round((done / total) * 100) : 0;

    titleEl.textContent = target.name || target.id;
    lessonEl.textContent = target.tagline || '';
    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '% (' + done + '/' + total + ')';
    btn.dataset.course = target.id;
  }

  function renderStats(courses, progress) {
    let totalLessons = 0, totalDone = 0;
    courses.forEach(c => {
      totalLessons += (c.lessons || []).length;
      totalDone += completedOf(c.id, progress);
    });
    const set = (id, v) => { const el = $(id); if (el) el.textContent = String(v); };
    set('#mStatLessons', totalLessons);
    set('#mStatDone', totalDone);
    set('#mStatStreak', streakValue());
    set('#mStatXp', xpValue());
  }

  function renderCourses(courses, progress) {
    const cont = $('#mCourses');
    if (!cont) return;
    const list = courses.filter(c => activeCat === 'all' || courseCategory(c.id) === activeCat);

    cont.innerHTML = list.map(c => {
      const total = (c.lessons || []).length;
      const done = completedOf(c.id, progress);
      const pct = total ? Math.round((done / total) * 100) : 0;
      const doneTxt = done > 0 ? '<span>✅ ' + done + ' tugallangan</span>' : '';
      return (
        '<div class="m-course-card" data-course="' + c.id + '" role="button" tabindex="0">' +
          '<div class="m-course-icon">' + (c.icon || '📘') + '</div>' +
          '<div class="m-course-body">' +
            '<span class="m-course-title">' + (c.name || c.id) + '</span>' +
            '<span class="m-course-desc">' + (c.tagline || '') + '</span>' +
            '<div class="m-course-meta"><span>📚 ' + total + ' ta dars</span>' + doneTxt + '</div>' +
            '<div class="m-course-progress"><span style="width:' + pct + '%"></span></div>' +
            '<span class="m-course-pct" style="font-size:11px;color:#8f8aa8">' + pct + '%</span>' +
          '</div>' +
          '<div class="m-course-arrow">→</div>' +
        '</div>'
      );
    }).join('');

    cont.querySelectorAll('.m-course-card').forEach(card => {
      card.addEventListener('click', () => openCourse(card.dataset.course));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCourse(card.dataset.course); }
      });
    });
  }

  function openCourse(id) {
    if (window.Lessons && typeof window.Lessons.openCourse === 'function') {
      try { window.Lessons.openCourse(id); return; } catch (e) { /* fallback */ }
    }
    if (window.__itShowPage) window.__itShowPage('lessons');
  }

  function renderDashboard() {
    const dash = $('#mDash');
    if (!dash) return;
    const courses = coursesList();
    const progress = loadProgress();
    renderHero(courses, progress);
    renderStats(courses, progress);
    renderCourses(courses, progress);
  }

  function bindChips() {
    const chips = $('#mChips');
    if (!chips || chips.dataset.bound) return;
    chips.dataset.bound = '1';
    chips.addEventListener('click', (e) => {
      const chip = e.target.closest('.m-chip');
      if (!chip) return;
      chips.querySelectorAll('.m-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.getAttribute('data-cat') || 'all';
      renderDashboard();
    });
  }

  function bindExtras() {
    const allBtn = $('#mAllCourses');
    if (allBtn && !allBtn.dataset.bound) {
      allBtn.dataset.bound = '1';
      allBtn.addEventListener('click', () => {
        if (window.__itShowPage) window.__itShowPage('lessons');
      });
    }
    const heroBtn = $('#mHeroBtn');
    if (heroBtn && !heroBtn.dataset.bound) {
      heroBtn.dataset.bound = '1';
      heroBtn.addEventListener('click', () => openCourse(heroBtn.dataset.course));
    }
    // ESC — drawer yopish
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const sidebar = $('#sidebar');
      if (sidebar && sidebar.classList.contains('active')) {
        const close = $('#sidebarClose');
        if (close) close.click();
      }
    });
  }

  window.MobileUI = { renderDashboard: renderDashboard };

  function init() {
    bindChips();
    bindExtras();
    setTimeout(renderDashboard, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
