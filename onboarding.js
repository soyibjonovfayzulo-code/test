/* ==========================================================
   ITTest — YANGI FOYDALANUVCHI ONBOARDING (5 bosqich)
   Bosqichma-bosqich tanlovlar — ITTest original dizayni bilan
   (dark + cyan/indigo accent, Duolingo nusxasi emas).
   Flow: Ro'yxatdan o'tish → Onboarding → Darslar → Kurs → Lesson Path
   - State: localStorage (user id bo'yicha) → refreshda davom etadi
   - FAQAT onboardingPending belgisi bor userga ko'rinadi
   - Tugagach: LOGIN → DASHBOARD (qaytib chiqmaydi)
   ========================================================== */

(() => {
  'use strict';

  /* ====================== MA'LUMOTLAR ====================== */

  const STEPS = [
    {
      key: 'track',
      title: 'Siz nimani o‘rganmoqchisiz?',
      sub: 'Sizga qiziq yo‘nalishni tanlang.',
      options: [
        { id: 'web', icon: '🌐', label: 'Web dasturlash', desc: 'HTML • CSS • JavaScript' },
        { id: 'python', icon: '🐍', label: 'Python', desc: 'Boshlang‘ichdan loyiha' },
        { id: 'javascript', icon: '⚡', label: 'JavaScript', desc: 'Web va interaktivlik' },
        { id: 'java', icon: '☕', label: 'Java', desc: 'Backend va OOP' },
        { id: 'cpp', icon: '💻', label: 'C++', desc: 'Algoritmlar va dasturlash' },
        { id: 'ai', icon: '🤖', label: 'AI', desc: 'Sun’iy intellekt' }
      ]
    },
    {
      key: 'level',
      title: 'Dasturlash bo‘yicha tajribangiz qanday?',
      sub: 'Halol javob — yo‘l aynan shunga qarab tuziladi.',
      options: [
        { id: 'beginner', icon: '🌱', label: 'Men endi boshlayapman', desc: 'Hech qachon kod yozmaganman.' },
        { id: 'some', icon: '📘', label: 'Biroz bilaman', desc: 'HTML/CSS yoki boshqa narsalarni ko‘rganman.' },
        { id: 'mid', icon: '📊', label: 'O‘rtacha', desc: 'Oddiy loyihalar qila olaman.' },
        { id: 'good', icon: '🚀', label: 'Yaxshi bilaman', desc: 'Mustaqil loyihalar qilganman.' }
      ]
    },
    {
      key: 'reason',
      title: 'Nima uchun dasturlashni o‘rganyapsiz?',
      sub: 'Motivatsiyangizni bilmoqchiman.',
      options: [
        { id: 'career', icon: '💼', label: 'Kasb o‘rganish uchun' },
        { id: 'job', icon: '🔎', label: 'Ish topish uchun' },
        { id: 'project', icon: '🚀', label: 'O‘z loyihamni yaratish uchun' },
        { id: 'study', icon: '🎓', label: 'O‘qish uchun' },
        { id: 'income', icon: '💰', label: 'Daromad qilish uchun' },
        { id: 'fun', icon: '❤️', label: 'Shunchaki qiziqaman' }
      ]
    },
    {
      key: 'daily',
      title: 'Kuniga qancha vaqt ajrata olasiz?',
      sub: 'Bu kundalik maqsadingiz sifatida saqlanadi.',
      options: [
        { id: '5', icon: '⏱', label: '5 daqiqa', desc: 'Yengil' },
        { id: '10', icon: '⏱', label: '10 daqiqa', desc: 'Oddiy' },
        { id: '15', icon: '⏱', label: '15 daqiqa', desc: 'Barqaror' },
        { id: '30', icon: '⏱', label: '30 daqiqa', desc: 'Jiddiy' },
        { id: '60', icon: '⏱', label: '1 soat+', desc: 'Intensiv' }
      ]
    },
    {
      key: 'goal',
      title: 'Maqsadingiz nima?',
      sub: 'Oxirgi bosqich — shaxsiy o‘quv yo‘lingiz tayyorlanadi.',
      options: [
        { id: 'beginner_dev', icon: '🌱', label: 'Boshlang‘ich dasturchi bo‘lish' },
        { id: 'first_site', icon: '🌐', label: 'Birinchi sayt yaratish' },
        { id: 'frontend', icon: '🎨', label: 'Frontend Developer bo‘lish' },
        { id: 'backend', icon: '🖥️', label: 'Backend Developer bo‘lish' },
        { id: 'fullstack', icon: '🚀', label: 'Full Stack Developer bo‘lish' },
        { id: 'mobile', icon: '📱', label: 'Mobil ilova yaratish' },
        { id: 'ai_work', icon: '🤖', label: 'AI bilan ishlash' },
        { id: 'job_ready', icon: '💼', label: 'Ishga tayyorlanish' }
      ]
    }
  ];

  /* Tanlangan track → mavjud course ID mapping (CoursesAPI bilan tekshiriladi) */
  const TRACK_COURSE = { web: 'html', python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp', ai: 'ai' };

  const LEVEL_LABEL = {
    beginner: 'Boshlang‘ich daraja',
    some: 'Biroz tajriba',
    mid: 'O‘rtacha daraja',
    good: 'Yaxshi daraja'
  };
  const DAILY_LABEL = {
    '5': 'Kuniga 5 daqiqa', '10': 'Kuniga 10 daqiqa', '15': 'Kuniga 15 daqiqa',
    '30': 'Kuniga 30 daqiqa', '60': 'Kuniga 1 soat+'
  };

  const SPEECH = {
    1: 'Salom! 👋 Birga tanlaymiz.',
    2: 'O‘ylab ko‘ramiz… 🤔',
    3: 'Maqsadingiz muhim! 💡',
    4: 'Kunlik rejim qiziq! ⏱',
    5: 'Oxirgi qadam! 🎯',
    6: 'Zo‘r! 🎉 Tayyor!'
  };
  const MASCOT_STATE = { 1: 'idle', 2: 'thinking', 3: 'idle', 4: 'thinking', 5: 'idle', 6: 'complete' };

  /* ====================== HOLAT ====================== */

  const TOTAL = STEPS.length; // 5
  const FINAL = TOTAL + 1;    // 6 — yakuniy ekran

  let S = { step: 1, answers: {}, completed: false };
  let userRef = null;
  let built = false;
  let dom = {};

  const $ = (sel, root) => (root || document).querySelector(sel);

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function stateKey(u) {
    return 'ittest_onboarding_v1::' + ((u && (u.id || u.username)) || 'anon');
  }

  function loadState(u) {
    try {
      const raw = localStorage.getItem(stateKey(u));
      if (!raw) return null;
      const st = JSON.parse(raw);
      if (!st || typeof st !== 'object') return null;
      return { step: Number(st.step) || 1, answers: st.answers || {}, completed: !!st.completed };
    } catch (e) { return null; }
  }

  function saveState() {
    if (!userRef) return;
    try { localStorage.setItem(stateKey(userRef), JSON.stringify(S)); } catch (e) { /* noop */ }
  }

  function pendingFlag(u) {
    return !!(u && u.onboardingPending === true);
  }

  /* ====================== KURS ANIQLASH ====================== */

  function resolveCourse(track) {
    const api = window.CoursesAPI;
    let id = TRACK_COURSE[track] || 'html';
    const exists = (cid) => {
      try { return !!(api && typeof api.getCourse === 'function' && api.getCourse(cid)); }
      catch (e) { return false; }
    };
    if (!exists(id)) {
      id = 'html';
      if (!exists(id)) {
        try {
          const list = (api && typeof api.listCourses === 'function' && api.listCourses()) || [];
          id = (list[0] && list[0].id) || null;
        } catch (e) { id = null; }
      }
    }
    return id;
  }

  /* ====================== DOM QURISH ====================== */

  function build() {
    if (built) return;
    const root = $('#onboardingRoot');
    if (!root) return;

    root.innerHTML = [
      '<div class="ob-bg" aria-hidden="true">',
      '  <span class="ob-orb ob-orb-1"></span>',
      '  <span class="ob-orb ob-orb-2"></span>',
      '  <span class="ob-orb ob-orb-3"></span>',
      '</div>',
      '<div class="ob-shell" role="dialog" aria-modal="true" aria-label="ITTest onboarding">',
      '  <header class="ob-header">',
      '    <button type="button" class="ob-back" id="obBack" aria-label="Oldingi bosqich" hidden>←</button>',
      '    <div class="ob-logo" aria-hidden="true">🧠 <span>IT<b>Test</b></span></div>',
      '    <div class="ob-step" id="obStep">1 / 5</div>',
      '    <button type="button" class="ob-skip" id="obSkip">Keyinroq</button>',
      '  </header>',
      '  <div class="ob-progress" role="progressbar" aria-valuemin="0" aria-valuemax="5" aria-valuenow="1">',
      '    <span class="ob-progress-fill" id="obFill"></span>',
      '  </div>',
      '  <div class="ob-body">',
      '    <aside class="ob-side" aria-hidden="true">',
      '      <div class="ob-mascot-host" id="obMascot"></div>',
      '      <div class="ob-speech" id="obSpeech"></div>',
      '    </aside>',
      '    <div class="ob-stage" id="obStage"></div>',
      '  </div>',
      '  <footer class="ob-footer">',
      '    <p class="ob-error" id="obError" role="alert" hidden></p>',
      '    <button type="button" class="ob-cta" id="obCta" disabled>Davom etish →</button>',
      '  </footer>',
      '</div>'
    ].join('');

    dom = {
      root: root,
      shell: $('.ob-shell', root),
      back: $('#obBack', root),
      step: $('#obStep', root),
      skip: $('#obSkip', root),
      progress: $('.ob-progress', root),
      fill: $('#obFill', root),
      mascotHost: $('#obMascot', root),
      speech: $('#obSpeech', root),
      stage: $('#obStage', root),
      error: $('#obError', root),
      cta: $('#obCta', root)
    };

    dom.back.addEventListener('click', function () { go(S.step - 1); });
    dom.skip.addEventListener('click', finishSkip);
    dom.cta.addEventListener('click', onCta);

    built = true;
  }

  /* ====================== RENDER ====================== */

  function swapScreen(builder) {
    const old = dom.stage.querySelector('.ob-screen');
    const screen = document.createElement('div');
    screen.className = 'ob-screen';
    builder(screen);
    if (old) {
      if (reducedMotion()) { old.remove(); }
      else {
        old.classList.add('ob-out');
        setTimeout(function () { if (old.parentNode) old.remove(); }, 420);
      }
    }
    dom.stage.appendChild(screen);
  }

  function choiceButton(opt, key) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ob-choice';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', S.answers[key] === opt.id ? 'true' : 'false');
    if (S.answers[key] === opt.id) b.classList.add('selected');

    const icon = document.createElement('span');
    icon.className = 'ob-choice-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = opt.icon;

    const text = document.createElement('span');
    text.className = 'ob-choice-text';
    const label = document.createElement('strong');
    label.textContent = opt.label;
    text.appendChild(label);
    if (opt.desc) {
      const small = document.createElement('small');
      small.textContent = opt.desc;
      text.appendChild(small);
    }

    const check = document.createElement('span');
    check.className = 'ob-choice-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';

    b.appendChild(icon);
    b.appendChild(text);
    b.appendChild(check);
    b.addEventListener('click', function () { select(key, opt.id); });
    return b;
  }

  function select(key, id) {
    S.answers[key] = id;
    saveState();
    dom.stage.querySelectorAll('.ob-screen [role="radio"]').forEach(function (r) {
      const isSel = r.dataset.opt === (key + ':' + id);
      r.classList.toggle('selected', isSel);
      r.setAttribute('aria-checked', isSel ? 'true' : 'false');
    });
    dom.cta.disabled = false;
    hideError();
    syncWebNote();
  }

  function syncWebNote() {
    const note = dom.stage.querySelector('.ob-webnote');
    if (note) note.hidden = S.answers.track !== 'web';
  }

  function renderQuestion(screen, idx) {
    const def = STEPS[idx - 1];

    const mini = document.createElement('div');
    mini.className = 'ob-mini-mascot';
    mini.setAttribute('aria-hidden', 'true');

    const title = document.createElement('h2');
    title.className = 'ob-title';
    title.textContent = def.title;

    const sub = document.createElement('p');
    sub.className = 'ob-sub';
    sub.textContent = def.sub;

    const grid = document.createElement('div');
    grid.className = 'ob-choices ob-choices--' + def.key;
    grid.setAttribute('role', 'radiogroup');
    grid.setAttribute('aria-label', def.title);

    def.options.forEach(function (opt) {
      const b = choiceButton(opt, def.key);
      b.dataset.opt = def.key + ':' + opt.id;
      grid.appendChild(b);
    });

    screen.appendChild(mini);
    screen.appendChild(title);
    screen.appendChild(sub);
    screen.appendChild(grid);

    if (def.key === 'track') {
      const note = document.createElement('p');
      note.className = 'ob-webnote';
      note.hidden = S.answers.track !== 'web';
      note.textContent = '🌐 Web tanlandingiz — yo‘l HTML, CSS va JavaScript asosida tuziladi.';
      screen.appendChild(note);
    }

    if (window.ITMascot) window.ITMascot.inject(mini, MASCOT_STATE[idx] || 'idle');
  }

  function renderFinal(screen) {
    const mini = document.createElement('div');
    mini.className = 'ob-mini-mascot';
    mini.setAttribute('aria-hidden', 'true');

    const title = document.createElement('h2');
    title.className = 'ob-title ob-title--final';
    title.textContent = 'Zo‘r! 🎉';

    const sub = document.createElement('p');
    sub.className = 'ob-sub';
    sub.textContent = 'Siz uchun shaxsiy o‘quv yo‘li tayyorlandi.';

    const card = document.createElement('div');
    card.className = 'ob-summary';

    const a = S.answers;
    const trackOpt = STEPS[0].options.find(function (o) { return o.id === a.track; }) || { icon: '📚', label: 'Yo‘nalish' };
    const goalOpt = STEPS[4].options.find(function (o) { return o.id === a.goal; }) || null;

    const rows = [
      { icon: trackOpt.icon, text: trackOpt.label },
      { icon: '🌱', text: LEVEL_LABEL[a.level] || 'Boshlang‘ich daraja' },
      { icon: '⏱', text: DAILY_LABEL[a.daily] || 'Kuniga 10 daqiqa' }
    ];
    if (goalOpt) rows.push({ icon: '🎯', text: 'Maqsad: ' + goalOpt.label });

    rows.forEach(function (r) {
      const row = document.createElement('div');
      row.className = 'ob-summary-row';
      const ic = document.createElement('span');
      ic.className = 'ob-summary-ico';
      ic.setAttribute('aria-hidden', 'true');
      ic.textContent = r.icon;
      const tx = document.createElement('span');
      tx.className = 'ob-summary-text';
      tx.textContent = r.text;
      row.appendChild(ic);
      row.appendChild(tx);
      card.appendChild(row);
    });

    screen.appendChild(mini);
    screen.appendChild(title);
    screen.appendChild(sub);
    screen.appendChild(card);

    if (window.ITMascot) window.ITMascot.inject(mini, 'complete');
  }

  function render() {
    const clamped = Math.min(Math.max(S.step, 1), FINAL);
    const isFinal = clamped >= FINAL;
    const shown = isFinal ? TOTAL : clamped;

    dom.back.hidden = clamped === 1;
    dom.skip.hidden = isFinal;
    dom.step.textContent = shown + ' / ' + TOTAL;
    dom.progress.setAttribute('aria-valuenow', String(shown));
    dom.fill.style.width = (shown / TOTAL * 100) + '%';

    dom.speech.textContent = SPEECH[clamped] || '';
    if (dom.mascotHost && window.ITMascot) {
      const m = dom.mascotHost.querySelector(':scope > .mascot');
      if (m) window.ITMascot.setState(m, MASCOT_STATE[clamped] || 'idle');
      else window.ITMascot.inject(dom.mascotHost, MASCOT_STATE[clamped] || 'idle');
    }

    if (isFinal) {
      dom.cta.textContent = '🚀 Darslarni boshlash';
      dom.cta.disabled = !S.answers.track;
      swapScreen(renderFinal);
      if (window.__itConfetti) { try { window.__itConfetti(); } catch (e) { /* noop */ } }
    } else {
      dom.cta.textContent = 'Davom etish →';
      dom.cta.disabled = !S.answers[STEPS[clamped - 1].key];
      swapScreen(function (screen) { renderQuestion(screen, clamped); });
    }
    hideError();
  }

  /* ====================== NAVIGATSIYA ====================== */

  function go(step) {
    const next = Math.min(Math.max(step, 1), FINAL);
    if (next === S.step) return;
    S.step = next;
    saveState();
    render();
  }

  function onCta() {
    if (S.step >= FINAL) { startLessons(); return; }
    const key = STEPS[S.step - 1].key;
    if (!S.answers[key]) { showError('Iltimos, avval bir variantni tanlang.'); return; }
    go(S.step + 1);
  }

  function finishSkip() {
    /* Foydalanuvchi o'tkazib yubordi — flag tozalanadi, qayta chiqmaydi */
    S.completed = true;
    saveState();
    completeUserFlag();
    hide();
  }

  function startLessons() {
    if (!S.answers.track) {
      showError('Yo‘nalish tanlanmagan — 1-bosqichga qaytib tanlang.');
      go(1);
      return;
    }
    S.completed = true;
    saveState();
    completeUserFlag();
    hide();

    /* 🎯 DARHOL tanlangan kursning Lesson Path sahifasiga o'tamiz */
    const courseId = resolveCourse(S.answers.track);
    if (courseId && window.Lessons && typeof window.Lessons.openCourse === 'function') {
      try { window.Lessons.openCourse(courseId); return; }
      catch (e) { console.warn('openCourse xatosi:', e); }
    }
    if (window.__itShowPage) window.__itShowPage('lessons');
  }

  function completeUserFlag() {
    try {
      if (typeof window.__itOnboardingFinish === 'function') window.__itOnboardingFinish();
      else if (userRef) { delete userRef.onboardingPending; userRef.onboardingCompleted = true; }
    } catch (e) { console.warn('onboarding flag:', e); }
  }

  function showError(msg) {
    if (!dom.error) return;
    dom.error.textContent = msg;
    dom.error.hidden = false;
  }

  function hideError() {
    if (dom.error) { dom.error.hidden = true; dom.error.textContent = ''; }
  }

  /* ====================== OPEN / CLOSE ====================== */

  function open() {
    if (!userRef) return false;
    build();
    if (!built) return false;

    const saved = loadState(userRef);
    S = saved && !saved.completed
      ? { step: Math.min(Math.max(saved.step, 1), FINAL), answers: saved.answers || {}, completed: false }
      : { step: 1, answers: {}, completed: false };
    saveState();

    dom.root.hidden = false;
    dom.root.classList.add('open');
    document.body.classList.add('ob-lock');
    render();
    return true;
  }

  function hide() {
    if (!built) return;
    dom.root.hidden = true;
    dom.root.classList.remove('open');
    document.body.classList.remove('ob-lock');
  }

  function maybeStart(u) {
    if (!u || !pendingFlag(u)) return false;
    const saved = loadState(u);
    if (saved && saved.completed) {
      completeUserFlag();
      return false;
    }
    userRef = u;
    return open();
  }

  function reset() {
    if (userRef) {
      try { localStorage.removeItem(stateKey(userRef)); } catch (e) { /* noop */ }
      userRef.onboardingPending = true;
    }
    S = { step: 1, answers: {}, completed: false };
    return open();
  }

  function isActive() {
    return !!(built && dom.root && !dom.root.hidden);
  }

  /* Onboarding majburiy o'tiladigan oqim — Esc bilan yopilmaydi, "Keyinroq" tugmasi bor */

  window.ITOnboarding = { maybeStart: maybeStart, open: open, hide: hide, reset: reset, isActive: isActive };
})();


