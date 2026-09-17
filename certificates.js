/* ==========================================================
   ITTest — PER-COURSE (KURS/MODUL) CERTIFICATE SYSTEM
   ==========================================================
   HAR BIR TO'LIQ KURS = BITTA PREMIUM SERTIFIKAT.

   • Sertifikat endi ALOHIDA DARS uchun EMAS — butun KURS/MODUL uchun
     beriladi (HTML, CSS, JavaScript, Python, Java, C++, SQL, AI ...)
   • Kursdagi BARCHA darslar va testlar 100% tugatilmaguncha
     sertifikat 🔒 LOCKED (qulflangan) holatda turadi
   • 100% tugatilganda: avtomatik ochiladi + QR kod bilan
     yuklab olish / ulashish imkoniyati chiqadi
   • QR kod → verification page (#/verify/<ID>) — browser / APK
   • Birinchi martalik ism-familiya yig'ish (keyingilarda auto)
   • PDF (print), Share (Web Share API / clipboard)
   • CERTIFICATE_PREVIEW_MODE — dizayn review rejimi (barchasi ochiq)
   • Duplicate protection — user+course bo'yicha 1 ta record

   SOURCE OF TRUTH:
   • Course/lesson data: window.CoursesAPI  (lessons-data.js)
   • Completion:         LessonsHooks.onLessonComplete (lessons-app.js)
   • Score/percent:      darslar_state_v1::<user> progress store
   • Bu fayl PARALLEL data yaratmaydi — mavjud state'dan o'qiydi.
   ========================================================== */
import qrcode from 'qrcode-generator';

(function () {
  'use strict';

  /* ================= 1) CONFIG — PRODUCTION SWITCH ================= */

  /* PRODUCTION (talab): sertifikat faqat KURS 100% tugatilganda ochiladi.
     Dizaynni ko'rish uchun: CERTIFICATE_PREVIEW_MODE = true qiling. */
  const CONFIG = {
    CERTIFICATE_PREVIEW_MODE: false,   // true = hammasi ochiq (dizayn review rejimi)
    REQUIRE_COURSE_COMPLETE: true,     // true => faqat 100% tugallangan kursga sertifikat
    TEMPLATE_VERSION: 2,               // sertifikat shabloni versiyasi (per-kurs)
    ID_PREFIX: 'ITT',                  // certificate ID prefiksi
    VERIFY_ROUTE: '#/verify/',         // QR URL routing
    AUTO_OPEN_DELAY: 1600              // kurs tugagach certificate auto-open kechikishi (ms)
  };

  /* ================= 2) KICHIK HELPERS ================= */

  const STORE_PREFIX = 'ittest_certs_v1::';
  const PROGRESS_PREFIX = 'darslar_state_v1::';
  const ID_ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no-confusion chars

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(iso) {
    try {
      const d = iso ? new Date(iso) : new Date();
      return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
    } catch (e) { return ''; }
  }
  function getUser() {
    try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
    catch (e) { return null; }
  }
  function toast(msg, type) {
    try { if (typeof window.showToast === 'function') window.showToast(msg, type || 'info'); }
    catch (e) { /* noop */ }
  }
  function who() {
    const u = getUser();
    return String((u && (u.username || u.email || u.id)) || 'guest').toLowerCase();
  }
  function userIdOf() {
    const u = getUser();
    return u ? String(u.id || u.username || u.email || 'user') : 'guest';
  }
  function courses() {
    try { return (window.CoursesAPI && window.CoursesAPI.listCourses()) || []; }
    catch (e) { return []; }
  }
  function findCourse(courseId) {
    try { return (window.CoursesAPI && window.CoursesAPI.getCourse(courseId)) || null; }
    catch (e) { return null; }
  }
  function findLesson(courseId, lessonId) {
    try { return window.CoursesAPI.findLesson(courseId, lessonId); }
    catch (e) { return null; }
  }

  /* ================= 3) USER STORE (per-user, localStorage) ================= */

  let store = null;
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_PREFIX + who());
      store = raw ? JSON.parse(raw) : null;
    } catch (e) { store = null; }
    if (!store || typeof store !== 'object') store = { name: null, certs: {} };
    if (!store.certs) store.certs = {};
    return store;
  }
  function saveStore() {
    try { localStorage.setItem(STORE_PREFIX + who(), JSON.stringify(store)); }
    catch (e) { console.warn('certificate store yozilmadi', e); }
  }

  /* ---------- ISM (certificateName) ---------- */
  /* Birinchi martta user kiritadi → keyingi barcha sertifikatlarda avtomatik. */
  function getCertName() {
    const st = loadStore();
    if (st.name && String(st.name).trim()) return String(st.name).trim();
    const u = getUser();
    if (u && u.certName && String(u.certName).trim()) return String(u.certName).trim();
    return null;
  }
  function validateName(raw) {
    const val = String(raw || '').replace(/\s+/g, ' ').trim();
    if (!val) return { ok: false, msg: 'Iltimos, ism va familiyangizni kiriting.' };
    if (val.length < 2) return { ok: false, msg: 'Ism juda qisqa — kamida 2 belgi kerak.' };
    if (val.length > 100) return { ok: false, msg: 'Ism juda uzun — 100 belgidan oshmasin.' };
    return { ok: true, val: val };
  }
  function setCertName(val) {
    const st = loadStore();
    st.name = val;
    saveStore();
    /* Profile/user state'ga ham mirror qilamiz (script.js user saqlash tizimi) */
    try {
      const u = getUser();
      if (u) {
        u.certName = val;
        if (typeof window.__itSaveUserState === 'function') window.__itSaveUserState();
      }
    } catch (e) { /* noop */ }
  }

  /* ================= 4) UNIQUE CERTIFICATE ID (per-course) ================= */

  function fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }
  function hash6(str) {
    let h = fnv1a(str);
    let out = '';
    for (let i = 0; i < 6; i++) {
      out += ID_ALPHA[h % ID_ALPHA.length];
      h = Math.imul(h ^ ((i + 1) * 0x9e3779b9), 0x85ebca6b) >>> 0;
      if (!h) h = 0x2545f491;
    }
    return out;
  }
  function courseTag(courseId) {
    const t = String(courseId || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return (t || 'GEN').slice(0, 6);
  }
  /* Kurs sertifikati ID: ITT-HTML-FULL-7F3A9B (alohida dars uchun EMAS) */
  function makeCertId(userId, courseId) {
    return CONFIG.ID_PREFIX + '-' + courseTag(courseId) + '-FULL-' +
      hash6(userId + '|' + courseId + '|full-course');
  }

  /* ================= 5) REAL PROGRESS DATA (source of truth) ================= */

  function readProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_PREFIX + who());
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function isLessonCompleted(courseId, lessonId) {
    const p = readProgress();
    return !!(p && p.progress && p.progress[courseId] && p.progress[courseId].completed &&
      p.progress[courseId].completed[lessonId]);
  }
  /* Faqat REAL natija — mavjud bo'lmasa null (fake score YO'Q) */
  function realResult(courseId, lessonId) {
    try {
      const p = readProgress();
      const cp = p && p.progress && p.progress[courseId];
      if (!cp) return null;
      const tr = cp.testResults && cp.testResults[lessonId];
      if (tr && typeof tr.percent === 'number') {
        return { percent: tr.percent, score: typeof tr.score === 'number' ? tr.score : null };
      }
      const done = cp.completed && cp.completed[lessonId];
      if (done && typeof done.percent === 'number') {
        return { percent: done.percent, score: typeof done.score === 'number' ? done.score : null };
      }
      return null;
    } catch (e) { return null; }
  }

  /* ---------- KURS DARAJASIDAGI STATISTIKA (per-course sertifikat asosi) ---------- */
  /* Kurs 100% = har bir dars completed (testdan o'tilgan) va
     hech bir test "passed: false" holatda qolmagan. */
  function courseStats(course) {
    const lessons = (course && course.lessons) || [];
    const p = readProgress();
    const cp = p && p.progress && p.progress[course.id];
    const completed = (cp && cp.completed) || {};
    const tests = (cp && cp.testResults) || {};
    let doneCount = 0, percentSum = 0, percentCount = 0, xp = 0, duration = 0;
    let passedAllTests = true;
    lessons.forEach(function (l) {
      const done = completed[l.id];
      const tr = tests[l.id];
      if (done) {
        doneCount++;
        if (typeof l.xp === 'number') xp += l.xp;
        if (typeof l.duration === 'number') duration += l.duration;
      }
      if (tr && typeof tr.percent === 'number') { percentSum += tr.percent; percentCount++; }
      else if (done && typeof done.percent === 'number') { percentSum += done.percent; percentCount++; }
      if (!done) passedAllTests = false;
      else if (tr && tr.passed === false) passedAllTests = false;
    });
    const total = lessons.length;
    const completedPct = total ? Math.round((doneCount / total) * 100) : 0;
    const avgPercent = percentCount ? Math.round(percentSum / percentCount) : null;
    const isComplete = total > 0 && doneCount === total && passedAllTests;
    return { total: total, doneCount: doneCount, completedPct: completedPct, avgPercent: avgPercent, xp: xp, duration: duration, isComplete: isComplete };
  }
  function isCourseCompleted(courseId) {
    const c = findCourse(courseId);
    return !!(c && courseStats(c).isComplete);
  }

  /* ================= 6) CERTIFICATE RECORD (duplicate protection) ================= */

  /* HAR BIR KURS uchun BITTA sertifikat — kalit: courseId (dars emas!) */
  function ensureCert(course) {
    loadStore();
    const key = course.id;
    if (store.certs[key]) return { record: store.certs[key], created: false, needName: false, locked: false };

    const stats = courseStats(course);
    /* 100% talab: kurs to'liq tugatilmagan bo'lsa sertifikat berilmaydi (🔒) */
    const canIssue = stats.isComplete || !CONFIG.REQUIRE_COURSE_COMPLETE || CONFIG.CERTIFICATE_PREVIEW_MODE;
    if (!canIssue) return { record: null, created: false, needName: false, locked: true };

    const name = getCertName();
    if (!name) return { record: null, created: false, needName: true, locked: false };

    const record = {
      certificateId: makeCertId(userIdOf(), course.id),
      userId: userIdOf(),
      userName: name,
      courseId: course.id,
      courseName: course.name,
      courseIcon: course.icon || '📘',
      courseColor: course.color || '#2563EB',
      lessonsCount: stats.total,
      avgPercent: stats.avgPercent,
      issuedAt: new Date().toISOString(),
      completionStatus: stats.isComplete ? 'completed' : 'preview',
      xp: stats.xp,
      duration: stats.duration,
      templateVersion: CONFIG.TEMPLATE_VERSION
    };
    store.certs[key] = record;
    saveStore();
    return { record: record, created: true, needName: false, locked: false };
  }
  function getCertByCourse(courseId) {
    loadStore();
    return store.certs[courseId] || null;
  }
  /* Eski (per-lesson) API mosligi — kurs sertifikatini qaytaradi */
  function getCertByLesson(courseId, lessonId) {
    return getCertByCourse(courseId);
  }
  function allCertificates() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(STORE_PREFIX) !== 0) continue;
        try {
          const st = JSON.parse(localStorage.getItem(k));
          const certs = (st && st.certs) || {};
          Object.keys(certs).forEach(function (key) {
            /* eski per-lesson yozuvlar (::) o'tkazib yuboriladi */
            if (key.indexOf('::') !== -1) return;
            out.push(certs[key]);
          });
        } catch (e) { /* skip broken */ }
      }
    } catch (e) { /* noop */ }
    return out;
  }
  function findCertById(certId) {
    const id = String(certId || '').trim().toUpperCase();
    if (!id) return null;
    return allCertificates().find(function (r) {
      return String(r.certificateId).toUpperCase() === id;
    }) || null;
  }

  /* ================= 7) VERIFICATION ================= */

  function verifyUrl(certId) {
    const base = (window.ITCertConfig && window.ITCertConfig.verifyBase) ||
      (location.origin + location.pathname);
    return base + CONFIG.VERIFY_ROUTE + certId;
  }

  function qrSvg(text) {
    try {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (e) { return ''; }
  }

  /* ================= 8) UNLOCK LOGIKA (kurs 100% => 🔓) ================= */

  function isUnlocked(course) {
    if (CONFIG.CERTIFICATE_PREVIEW_MODE) return true;
    if (!CONFIG.REQUIRE_COURSE_COMPLETE) return true;
    return !!(course && courseStats(course).isComplete);
  }

  /* ================= 9) OVERLAY YARATISH (bir martta) ================= */

  let viewerEl = null, verifyEl = null;
  let pendingFlow = null; // { courseId } — kurs tugagach ism kutilmoqda

  function ensureViewer() {
    if (viewerEl) return viewerEl;
    viewerEl = document.createElement('div');
    viewerEl.id = 'certViewerOverlay';
    viewerEl.className = 'certv-overlay';
    viewerEl.setAttribute('role', 'dialog');
    viewerEl.setAttribute('aria-modal', 'true');
    viewerEl.setAttribute('aria-label', 'Sertifikat');
    viewerEl.innerHTML =
      '<div class="certv-topbar">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-certv-back>← Orqaga</button>' +
        '<div class="certv-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-certv-pdf aria-label="Sertifikatni PDF sifatida yuklab olish">⬇️ PDF</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-certv-share aria-label="Sertifikatni ulashish">🔗 Ulashish</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-certv-verify aria-label="Sertifikatni verifikatsiya qilish">🛡️ Verifikatsiya</button>' +
        '</div>' +
      '</div>' +
      '<div class="certv-scroll"><div class="certv-body" id="certvBody" aria-live="polite"></div></div>';
    document.body.appendChild(viewerEl);

    viewerEl.addEventListener('click', function (e) {
      if (e.target.closest('[data-certv-back]')) { closeViewer(); return; }
      if (e.target.closest('[data-certv-pdf]')) { downloadPdf(); return; }
      if (e.target.closest('[data-certv-share]')) { shareCurrent(); return; }
      if (e.target.closest('[data-certv-verify]')) {
        if (currentRecord) openVerify(currentRecord.certificateId);
        return;
      }
    });
    /* overlay foniga bosganda yopish — faqat scroll maydoni tashqarisida */
    return viewerEl;
  }

  let currentRecord = null;

  /* ---------- ISM QADAMI (birinchi martta) ---------- */
  function nameStepHtml(pending) {
    const prefill = (function () {
      const u = getUser();
      return u ? [u.firstname, u.lastname].filter(Boolean).join(' ').trim() : '';
    })();
    return (
      '<div class="cert-name-step">' +
        '<div class="cert-name-emoji" aria-hidden="true">🎓</div>' +
        '<h2>Sertifikatingiz uchun ismingizni kiriting</h2>' +
        '<p class="muted">Bu ism sertifikatda aynan shu ko&lsquo;rinishda ko&rsquo;rsatiladi.</p>' +
        '<form id="certNameForm" novalidate>' +
          '<label class="visually-hidden" for="certNameInput">Ism va familiya</label>' +
          '<input type="text" id="certNameInput" class="input" maxlength="100" autocomplete="name" ' +
            'placeholder="Masalan: Ahatjon Soyibjonov" value="' + esc(prefill) + '" />' +
          '<div class="cert-name-warn" id="certNameWarn" role="alert" aria-live="polite"></div>' +
          '<button type="submit" class="btn btn-primary cert-name-submit" id="certNameSubmitBtn">Sertifikatni olish →</button>' +
          (pending ? '<button type="button" class="btn btn-ghost cert-name-skip" data-certv-back>Keyinroq</button>' : '') +
        '</form>' +
      '</div>'
    );
  }
  function bindNameStep(onSaved) {
    const form = $('#certNameForm');
    const input = $('#certNameInput');
    const warn = $('#certNameWarn');
    const submit = $('#certNameSubmitBtn');
    if (!form || !input) return;
    function check() {
      const v = validateName(input.value);
      if (warn) warn.textContent = v.ok ? '' : v.msg;
      if (submit) submit.disabled = !v.ok;
      return v;
    }
    input.addEventListener('input', check);
    check();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const v = check();
      if (!v.ok) { input.focus(); return; }
      setCertName(v.val);
      toast('Ism saqlandi — sertifikat tayyor! 🎉', 'success');
      if (typeof onSaved === 'function') onSaved(v.val);
    });
    setTimeout(function () { input.focus(); }, 120);
  }

  /* ================= 10) CERTIFICATE PAPER (premium light dizayn) ================= */

  function paperHtml(r) {
    const preview = r.completionStatus !== 'completed';
    const stats =
      '<div class="cert-stats">' +
        '<div class="cert-stat"><span class="cert-stat-ico" aria-hidden="true">📚</span><span class="cert-stat-lbl">Kurs</span><span class="cert-stat-val">' + esc(r.courseName) + ' · ' + r.lessonsCount + ' dars</span></div>' +
        (r.duration ? '<div class="cert-stat"><span class="cert-stat-ico" aria-hidden="true">⏱</span><span class="cert-stat-lbl">Davomiylik</span><span class="cert-stat-val">' + r.duration + ' daqiqa</span></div>' : '') +
        (r.xp ? '<div class="cert-stat"><span class="cert-stat-ico" aria-hidden="true">⭐</span><span class="cert-stat-lbl">XP</span><span class="cert-stat-val">+' + r.xp + ' XP</span></div>' : '') +
        (r.avgPercent != null ? '<div class="cert-stat"><span class="cert-stat-ico" aria-hidden="true">📊</span><span class="cert-stat-lbl">O&lsquo;rtacha natija</span><span class="cert-stat-val">' + r.avgPercent + '%</span></div>' : '') +
      '</div>';

    return (
      '<article class="cert-paper cert-reveal" aria-label="Sertifikat">' +
        '<div class="cert-border" aria-hidden="true"></div>' +
        '<div class="cert-corner cert-corner--tl" aria-hidden="true"></div>' +
        '<div class="cert-corner cert-corner--tr" aria-hidden="true"></div>' +
        '<div class="cert-corner cert-corner--bl" aria-hidden="true"></div>' +
        '<div class="cert-corner cert-corner--br" aria-hidden="true"></div>' +
        (preview ? '<div class="cert-preview-badge">PREVIEW KO&lsquo;RISH REJIMI</div>' : '') +
        '<header class="cert-head">' +
          '<div class="cert-logo"><span class="cert-logo-ico" aria-hidden="true">🧠</span><span class="cert-logo-text">IT<b>Test</b></span></div>' +
          '<div class="cert-tagline">Bugun yanada kuchliroq!</div>' +
          '<svg class="cert-deco" viewBox="0 0 120 24" fill="none" aria-hidden="true">' +
            '<path d="M0 12 H44 M76 12 H120" stroke="#2563EB" stroke-opacity=".35" stroke-width="1.5"/>' +
            '<rect x="50" y="6" width="20" height="12" rx="3" stroke="#06B6D4" stroke-width="1.6"/>' +
            '<path d="M56 12 l3 3 5-6" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</header>' +
        '<h1 class="cert-title">SERTIFIKAT</h1>' +
        '<p class="cert-sub">Ushbu sertifikat</p>' +
        '<div class="cert-name">' + esc(r.userName) + '</div>' +
        '<p class="cert-body">ITTest platformasida <strong>' + esc(r.courseName) + '</strong> kursining barcha ' +
          '<strong>' + r.lessonsCount + '</strong> ta dars va testlarini ' +
          '100% muvaffaqiyatli yakunlagani uchun berildi.</p>' +
        stats +
        '<footer class="cert-foot">' +
          '<div class="cert-foot-col cert-foot-date">' +
            '<span class="cert-foot-lbl">Berilgan sana</span>' +
            '<span class="cert-foot-val" id="certIssueDate">' + esc(fmtDate(r.issuedAt)) + '</span>' +
          '</div>' +
          '<div class="cert-foot-qr">' + qrSvg(verifyUrl(r.certificateId)) + '<span class="cert-qr-cap">Skan qiling — verifikatsiya</span></div>' +
          '<div class="cert-foot-col cert-foot-id">' +
            '<span class="cert-foot-lbl">Certificate ID</span>' +
            '<span class="cert-foot-val cert-id-code" id="certIdCode">' + esc(r.certificateId) + '</span>' +
          '</div>' +
        '</footer>' +
      '</article>'
    );
  }

  function openViewer(record) {
    currentRecord = record;
    const el = ensureViewer();
    const body = $('#certvBody');
    if (!body) return;
    body.innerHTML = paperHtml(record);
    el.classList.add('open');
    document.body.classList.add('cert-modal-open');
  }
  function closeViewer() {
    currentRecord = null;
    pendingFlow = null;
    if (viewerEl) viewerEl.classList.remove('open');
    document.body.classList.remove('cert-modal-open');
  }
  /* KURS uchun sertifikat ochish (per-course asosiy oqim) */
  function openCertForCourse(course) {
    const res = ensureCert(course);
    if (res.locked) {
      const st = courseStats(course);
      toast('🔒 ' + (course.name || 'Kurs') + ' hali 100% tugatilmagan — ' +
        st.doneCount + '/' + st.total + ' dars', 'warning');
      return;
    }
    if (res.needName) {
      const el = ensureViewer();
      const body = $('#certvBody');
      if (!body) return;
      pendingFlow = { courseId: course.id };
      currentRecord = null;
      body.innerHTML = nameStepHtml(true);
      el.classList.add('open');
      document.body.classList.add('cert-modal-open');
      bindNameStep(function () {
        const res2 = ensureCert(course);
        pendingFlow = null;
        if (res2.record) openViewer(res2.record);
      });
      return;
    }
    if (res.record) openViewer(res.record);
  }
  /* Eski (per-lesson) nom — endi ham kurs bo'yicha ochiladi (back-compat) */
  function openCertForLesson(course, lesson) {
    return openCertForCourse(course);
  }

  /* ================= 11) PDF + SHARE ================= */

  function downloadPdf() {
    if (!currentRecord) return;
    toast('📜 Sertifikat bosmaga tayyorlanmoqda...', 'info');
    document.body.classList.add('print-cert');
    setTimeout(function () {
      try { window.print(); }
      finally { setTimeout(function () { document.body.classList.remove('print-cert'); }, 400); }
    }, 300);
  }
  function shareCurrent() {
    if (!currentRecord) return;
    const r = currentRecord;
    const url = verifyUrl(r.certificateId);
    const shareData = {
      title: 'ITTest Sertifikati — ' + r.courseName + ' kursi',
      text: 'Men ITTest platformasida "' + r.courseName + '" kursini (' + r.lessonsCount +
        ' dars) 100% muvaffaqiyatli yakunladim! Sertifikat ID: ' + r.certificateId,
      url: url
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () { /* bekor qilindi */ });
      return;
    }
    try {
      navigator.clipboard.writeText(shareData.text + ' ' + url).then(function () {
        toast('🔗 Sertifikat havolasi nusxalandi!', 'success');
      }, function () { fallbackShare(shareData); });
    } catch (e) { fallbackShare(shareData); }
  }
  function fallbackShare(data) {
    try {
      const ta = document.createElement('textarea');
      ta.value = data.text + ' ' + data.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('🔗 Sertifikat havolasi nusxalandi!', 'success');
    } catch (e) { toast('Sertifikat ID: ' + (currentRecord ? currentRecord.certificateId : ''), 'info'); }
  }

  /* ================= 12) VERIFICATION PAGE (public — login shart emas) ================= */

  function ensureVerify() {
    if (verifyEl) return verifyEl;
    verifyEl = document.createElement('div');
    verifyEl.id = 'certVerifyOverlay';
    verifyEl.className = 'certv-overlay certv-verify';
    verifyEl.setAttribute('role', 'dialog');
    verifyEl.setAttribute('aria-modal', 'true');
    verifyEl.setAttribute('aria-label', 'Sertifikat verifikatsiyasi');
    verifyEl.innerHTML = '<div class="certv-scroll"><div class="certv-body" id="certVerifyBody" aria-live="polite"></div></div>';
    document.body.appendChild(verifyEl);
    verifyEl.addEventListener('click', function (e) {
      if (e.target.closest('[data-verify-close]') || e.target === verifyEl.querySelector('.certv-scroll')) closeVerify();
    });
    return verifyEl;
  }

  function verifyCardHtml(cert) {
    if (!cert) {
      return (
        '<div class="verify-card verify-fail cert-reveal">' +
          '<div class="verify-hero"><span class="verify-emoji" aria-hidden="true">❌</span><h2>Sertifikat topilmadi</h2>' +
          '<p>Bunday Certificate ID bilan ro&lsquo;yxatda qayd etilgan sertifikat yo&lsquo;q.</p></div>' +
          manualSearchHtml('') +
          '<button type="button" class="btn btn-ghost" data-verify-close>← Yopish</button>' +
        '</div>'
      );
    }
    return (
      '<div class="verify-card verify-ok cert-reveal">' +
        '<div class="verify-hero">' +
          '<span class="verify-emoji" aria-hidden="true">✅</span>' +
          '<h2>Sertifikat haqiqiy</h2>' +
          '<div class="verify-status-pill">✅ Verified</div>' +
        '</div>' +
        '<dl class="verify-grid">' +
          '<div><dt>Foydalanuvchi</dt><dd>' + esc(cert.userName) + '</dd></div>' +
          '<div><dt>Kurs</dt><dd>' + esc(cert.courseName) + ' — ' + cert.lessonsCount + ' dars (to&lsquo;liq kurs)</dd></div>' +
          '<div><dt>Berilgan sana</dt><dd>' + esc(fmtDate(cert.issuedAt)) + '</dd></div>' +
          (cert.avgPercent != null ? '<div><dt>O&lsquo;rtacha natija</dt><dd>' + cert.avgPercent + '%</dd></div>' : '') +
          '<div class="verify-wide"><dt>Certificate ID</dt><dd class="cert-id-code">' + esc(cert.certificateId) + '</dd></div>' +
        '</dl>' +
        manualSearchHtml(cert.certificateId) +
        '<button type="button" class="btn btn-ghost" data-verify-close>← Yopish</button>' +
      '</div>'
    );
  }
  function manualSearchHtml(prefill) {
    return (
      '<form class="verify-search" id="verifySearchForm" novalidate>' +
        '<label class="visually-hidden" for="verifySearchInput">Certificate ID kiriting</label>' +
        '<input type="text" id="verifySearchInput" class="input" placeholder="Certificate ID kiriting: ITT-HTML-FULL-7F3A9B" ' +
          'value="' + esc(prefill || '') + '" spellcheck="false" />' +
        '<button type="submit" class="btn btn-primary">Tekshirish</button>' +
      '</form>'
    );
  }
  function openVerify(certId) {
    const el = ensureVerify();
    const body = $('#certVerifyBody');
    if (!body) return;
    const cert = certId ? findCertById(certId) : null;
    body.innerHTML = verifyCardHtml(cert);
    el.classList.add('open');
    const form = $('#verifySearchForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const inp = $('#verifySearchInput');
        const id = inp ? inp.value.trim() : '';
        if (!id) { toast('Certificate ID kiriting', 'warning'); return; }
        const found = findCertById(id);
        body.innerHTML = verifyCardHtml(found);
        bindVerifySearchAgain();
        if (!found) toast('❌ Sertifikat topilmadi', 'error');
      });
    }
    const inp = $('#verifySearchInput');
    if (inp) setTimeout(function () { inp.focus(); }, 150);
  }
  function bindVerifySearchAgain() {
    const form = $('#verifySearchForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inp = $('#verifySearchInput');
      const id = inp ? inp.value.trim() : '';
      if (!id) { toast('Certificate ID kiriting', 'warning'); return; }
      const found = findCertById(id);
      const body = $('#certVerifyBody');
      if (body) body.innerHTML = verifyCardHtml(found);
      bindVerifySearchAgain();
      if (!found) toast('❌ Sertifikat topilmadi', 'error');
    });
  }
  function closeVerify() {
    if (verifyEl) verifyEl.classList.remove('open');
    if (location.hash.indexOf(CONFIG.VERIFY_ROUTE) === 0) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* noop */ }
    }
  }

  /* ================= 13) HASH ROUTING: #/verify/<ID> ================= */

  function routeFromHash() {
    const h = location.hash || '';
    if (h.indexOf(CONFIG.VERIFY_ROUTE) === 0) {
      return decodeURIComponent(h.slice(CONFIG.VERIFY_ROUTE.length)).trim();
    }
    return null;
  }
  function handleHash() {
    const id = routeFromHash();
    if (id) {
      closeViewer();
      openVerify(id);
    }
  }

  /* ================= 14) SERTIFIKATLAR PAGE (kurs kartalari) ================= */

  let pageFilter = 'all';
  let pageQuery = '';

  function certCount() {
    loadStore();
    return Object.keys(store.certs).length;
  }
  function renderPage() {
    const page = document.getElementById('page-certificate');
    if (!page) return;
    loadStore();
    renderCertSummary();
    renderCertNameBar();
    renderCertGrid();
  }
  function renderCertSummary() {
    const row = document.getElementById('certSummaryRow');
    if (!row) return;
    const list = courses();
    let earned = 0, locked = 0;
    list.forEach(function (c) {
      if (isUnlocked(c)) earned++;
      else locked++;
    });
    const total = list.length;
    row.innerHTML =
      '<div class="certp-stat"><span class="certp-stat-num">' + total + '</span><span class="certp-stat-lbl">🎓 Kurs</span></div>' +
      '<div class="certp-stat"><span class="certp-stat-num">' + earned + '</span><span class="certp-stat-lbl">🏆 Sertifikat tayyor</span></div>' +
      '<div class="certp-stat"><span class="certp-stat-num">' + locked + '</span><span class="certp-stat-lbl">🔒 Qulflangan</span></div>' +
      (CONFIG.CERTIFICATE_PREVIEW_MODE ? '<div class="certp-preview-note">Preview rejim: hozircha barcha kurs sertifikatlari ochiq</div>' : '');
  }
  function renderCertNameBar() {
    const bar = document.getElementById('certNameBar');
    if (!bar) return;
    const name = getCertName();
    bar.innerHTML =
      '<div class="certp-namebar-inner">' +
        '<span class="certp-namebar-lbl">Sertifikatdagi ism</span>' +
        '<strong>' + esc(name || 'Hali kiritilmagan') + '</strong>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="certChangeNameBtn">✏️ Ismni o&lsquo;zgartirish</button>' +
      '</div>';
    const btn = document.getElementById('certChangeNameBtn');
    if (btn) btn.addEventListener('click', function () { openNameEditor(); });
  }
  function openNameEditor() {
    const el = ensureViewer();
    const body = $('#certvBody');
    if (!body) return;
    const back = currentRecord;
    currentRecord = null;
    body.innerHTML = nameStepHtml(false);
    el.classList.add('open');
    document.body.classList.add('cert-modal-open');
    bindNameStep(function () {
      if (back) openViewer(back);
      else { closeViewer(); renderPage(); }
      toast('Sertifikatdagi ism saqlandi! 🎉', 'success');
    });
  }

  function courseMatches(course, q) {
    if (!q) return true;
    const s = (course.name + ' ' + course.id + ' kurs').toLowerCase();
    return s.indexOf(q) !== -1;
  }
  /* HAR BIR KURS/MODUL uchun BITTA premium sertifikat kartochkasi */
  function renderCertGrid() {
    const grid = document.getElementById('certGrid');
    if (!grid) return;
    const q = pageQuery.trim().toLowerCase();
    let html = '';
    courses().forEach(function (course) {
      if (!courseMatches(course, q)) return;
      const stats = courseStats(course);
      const rec = store.certs[course.id] || null;
      const unlocked = isUnlocked(course);
      if (pageFilter === 'completed' && !stats.isComplete) return;
      if (pageFilter === 'locked' && unlocked) return;
      const certId = rec ? rec.certificateId : makeCertId(userIdOf(), course.id);
      const badge = unlocked
        ? (stats.isComplete
            ? '<span class="cert-status-badge earned">✅ Sertifikat tayyor</span>'
            : '<span class="cert-status-badge preview">👁 Preview</span>')
        : '<span class="cert-status-badge locked">🔒 Qulflangan</span>';
      const progressHtml =
        '<div class="certp-progress">' +
          '<div class="certp-progress-track"><span class="certp-progress-bar" style="width:' + stats.completedPct + '%"></span></div>' +
          '<div class="certp-progress-meta">' +
            '<span class="certp-progress-count">' + stats.doneCount + '/' + stats.total + ' dars</span>' +
            '<span class="certp-progress-pct">' + stats.completedPct + '%</span>' +
          '</div>' +
        '</div>';
      html +=
        '<div class="certp-card' + (stats.isComplete ? ' earned' : '') + (unlocked ? '' : ' locked') + '">' +
          '<div class="certp-card-top">' +
            '<span class="certp-course-ico" style="background:' + esc(course.color || '#2563EB') + '1a;color:' + esc(course.color || '#2563EB') + '">' + esc(course.icon || '📘') + '</span>' +
            '<span class="certp-course-name">' + esc(course.name) + '</span>' +
            badge +
          '</div>' +
          '<div class="certp-lesson-num">To&lsquo;liq kurs sertifikati</div>' +
          '<div class="certp-lesson-title">' + esc(course.name) + ' kursi — barcha dars va testlar</div>' +
          progressHtml +
          '<div class="certp-cert-id" title="Certificate ID">' + esc(certId) + '</div>' +
          '<div class="certp-card-foot">' +
            (unlocked
              ? '<button type="button" class="btn btn-primary btn-sm" data-cert-open="' + esc(course.id) + '">Sertifikatni ko&lsquo;rish →</button>'
              : '<button type="button" class="btn btn-ghost btn-sm" disabled>🔒 Kursni 100% tugating</button>') +
          '</div>' +
        '</div>';
    });
    if (!html) html = '<div class="certp-empty">🔍 Hech narsa topilmadi — boshqa so&lsquo;z bilan urinib ko&lsquo;ring.</div>';
    grid.innerHTML = html;
    grid.querySelectorAll('[data-cert-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const courseId = btn.getAttribute('data-cert-open') || '';
        const course = findCourse(courseId);
        if (!course) { toast('Kurs topilmadi', 'error'); return; }
        openCertForCourse(course);
      });
    });
  }
  function bindPageControls() {
    const search = document.getElementById('certSearch');
    if (search) {
      search.addEventListener('input', function () {
        pageQuery = search.value;
        renderCertGrid();
      });
    }
    const filters = document.getElementById('certFilters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        const chip = e.target.closest('[data-cfilter]');
        if (!chip) return;
        filters.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        pageFilter = chip.getAttribute('data-cfilter') || 'all';
        renderCertGrid();
      });
    }
    const profileBtn = document.getElementById('profileCertsBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', function () {
        if (typeof window.__itShowPage === 'function') window.__itShowPage('certificate');
      });
    }
  }

  /* ================= 15) LESSON COMPLETE → COURSE CERTIFICATE FLOW ================= */

  /* Mavjud event: LessonsHooks.onLessonComplete (lessons-app.js) — SOURCE OF TRUTH.
     Daily/Streak hook'i bilan parallel ishlaydi, uni BUZMAYDI.
     YANGI MANTIQ: sertifikat HAR DARSda emas — faqat KURS 100% tugaganda
     (barcha darslar completed + testlar passed) bir martta ochiladi. */
  function onLessonComplete(info) {
    try {
      if (!info || !info.course) return;
      if (!getUser()) return;
      const course = info.course;
      /* Kurs hali to'liq tugamagan bo'lsa — hech narsa ochilmaydi */
      const stats = courseStats(course);
      if (!stats.isComplete && !CONFIG.CERTIFICATE_PREVIEW_MODE) return;
      /* Celebration effekti ko'rinib turadi — keyin certificate auto-open (bir martta) */
      setTimeout(function () {
        const found = findCourse(course.id);
        if (!found) return;
        /* Duplicate protection: ensureCert mavjud recordni qaytadi */
        openCertForCourse(found);
      }, CONFIG.AUTO_OPEN_DELAY);
    } catch (e) { console.warn('certificate flow xatosi', e); }
  }

  /* ================= 16) PROFILE SUMMARY ================= */

  function renderProfileSummary() {
    const host = document.getElementById('profileCertSummary');
    if (!host) return;
    loadStore();
    const list = courses();
    let earned = 0;
    list.forEach(function (c) { if (store.certs[c.id]) earned++; });
    host.classList.remove('hidden');
    host.innerHTML =
      '<div class="card profile-cert-card">' +
        '<div class="card-header"><h3>🏆 Sertifikatlar</h3></div>' +
        '<div class="card-body">' +
          '<p><strong>' + earned + ' ta kurs sertifikati</strong> · ' + list.length + ' ta kursdan</p>' +
          '<button type="button" class="btn btn-primary btn-sm" id="profileCertGoBtn">Sertifikatlarni ko&lsquo;rish →</button>' +
        '</div>' +
      '</div>';
    const go = document.getElementById('profileCertGoBtn');
    if (go) go.addEventListener('click', function () {
      if (typeof window.__itShowPage === 'function') window.__itShowPage('certificate');
    });
  }

  /* ================= 17) PUBLIC API + INIT ================= */

  window.ITCertificates = {
    CONFIG: CONFIG,
    renderPage: renderPage,
    openCertForCourse: openCertForCourse,
    openCertForLesson: openCertForLesson,
    openViewer: openViewer,
    closeViewer: closeViewer,
    openVerify: openVerify,
    closeVerify: closeVerify,
    verify: findCertById,
    getCertName: getCertName,
    setCertName: setCertName,
    ensureCert: ensureCert,
    getCertByCourse: getCertByCourse,
    getCertByLesson: getCertByLesson,
    allCertificates: allCertificates,
    count: certCount,
    onLessonComplete: onLessonComplete,
    renderProfileSummary: renderProfileSummary
  };

  function init() {
    bindPageControls();
    window.addEventListener('hashchange', handleHash);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (viewerEl && viewerEl.classList.contains('open')) closeViewer();
      if (verifyEl && verifyEl.classList.contains('open')) closeVerify();
    });
    /* LessonsHooks — lessons-app.js yuklangach push qilinadi (script order) */
    if (window.LessonsHooks && window.LessonsHooks.onLessonComplete) {
      window.LessonsHooks.onLessonComplete.push(onLessonComplete);
    } else {
      /* fallback: biroz kutib qayta urinish */
      let tries = 0;
      const t = setInterval(function () {
        tries++;
        if (window.LessonsHooks && window.LessonsHooks.onLessonComplete) {
          window.LessonsHooks.onLessonComplete.push(onLessonComplete);
          clearInterval(t);
        } else if (tries > 40) clearInterval(t);
      }, 250);
    }
    handleHash(); // sahifa QR/verify URL bilan ochilgan bo'lsa
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();