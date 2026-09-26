/* ============================================================
   OrzuTalim — PROFILE MODULE (real photo + mastery + achievements)
   - Real profil rasmi: upload → validate → crop → compress → server storage
   - Server: POST/GET/DELETE /api/profile/image (SQLite + file storage)
   - Mastery/Achievement/Certificate — FAQAT real data manbalaridan
   ============================================================ */
(function () {
  'use strict';

  /* ================== KONFIG ================== */
  var MAX_FILE_MB = 5;
  var MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
  var ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  var OUTPUT_SIZE = 256;   // 1:1 crop → 256×256 (avatar uchun yetarli, tez)
  var JPEG_QUALITY = 0.82;
  var API = '/api/profile/image';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function toast(msg, type) {
    try { if (typeof window.showToast === 'function') { window.showToast(msg, type || 'info'); return; } } catch (e) { /* noop */ }
    /* Fallback: script.js'ning toast tizimi global bo'lmasa — xuddi shu classlar bilan chizamiz */
    var c = document.getElementById('toastContainer');
    if (!c) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(function () { el.classList.add('show'); }, 10);
    setTimeout(function () {
      el.classList.add('removing');
      setTimeout(function () { el.remove(); }, 350);
    }, 2800);
  }
  /* Modal yordamchilari — script.js'dagi openModal/closeModal module-scoped,
     global expose yo'q, shuning uchun to'g'ridan-to'g'ri .active class boshqaramiz */
  function openModalEl(sel) {
    var el = document.querySelector(sel);
    if (el) el.classList.add('active');
  }
  function closeModalEl(sel) {
    var el = document.querySelector(sel);
    if (el) el.classList.remove('active');
  }
  function haptic(kind) {
    try { if (window.ITHaptics && typeof window.ITHaptics.tap === 'function') window.ITHaptics.tap(kind || 'light'); } catch (e) { /* noop */ }
  }

  /* ================== USER STATE (global store — duplicate state YO'Q) ================== */
  function getUser() {
    try { return typeof window.__itGetCurrentUser === 'function' ? window.__itGetCurrentUser() : null; }
    catch (e) { return null; }
  }
  function saveUser() {
    try { if (typeof window.__itSaveUserState === 'function') window.__itSaveUserState(); } catch (e) { /* noop */ }
  }
  /* User obyektini id bo'yicha real users[] ro'yxatidan topish (migrate/fallback) */
  function findRealUser(u) {
    try {
      var users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!u || !u.id) return null;
      for (var i = 0; i < users.length; i++) if (users[i].id === u.id) return users[i];
      return null;
    } catch (e) { return null; }
  }
  function uidOf(u) {
    if (!u) return '';
    if (u.id) return String(u.id);
    return String(u.username || u.email || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 64);
  }
  function photoUrlOf(u) { return u && typeof u.photoUrl === 'string' ? u.photoUrl : ''; }

  /* ================== SERVER STORAGE API ================== */
  function fetchServerPhoto(uid, cb) {
    if (!uid) return cb(null);
    fetch(API + '/' + encodeURIComponent(uid), { headers: { 'x-it-uid': uid } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { cb(d && d.url ? d.url : null); })
      .catch(function () { cb(null); });
  }
  function uploadServerPhoto(uid, dataUrl, cb) {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-it-uid': uid },
      body: JSON.stringify({ uid: uid, dataUrl: dataUrl })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) { cb(res.ok ? null : ((res.data && res.data.error) || 'Yuklashda xatolik'), res.data && res.data.url); })
      .catch(function () { cb('Serverga ulanmadi', null); });
  }
  function deleteServerPhoto(uid, cb) {
    fetch(API + '/' + encodeURIComponent(uid), { method: 'DELETE', headers: { 'x-it-uid': uid } })
      .then(function (r) { cb(r.ok ? null : 'O\u2018chirishda xatolik'); })
      .catch(function () { cb('Serverga ulanmadi'); });
  }

  /* ================== VALIDATION ================== */
  function validateFile(file) {
    if (!file) return 'Fayl tanlanmadi';
    if (file.size > MAX_FILE_BYTES) return 'Rasm hajmi ' + MAX_FILE_MB + ' MB dan oshmasligi kerak';
    if (!ACCEPTED_TYPES.includes(file.type)) return "Rasm formati qo'llab-quvvatlanmaydi";
    return null;
  }
  /* FileReader + Image yuklash — mime spoof'dan himoya (haqiqiy decode amalga oshadi) */
  function readAndDecode(file, cb) {
    var reader = new FileReader();
    reader.onerror = function () { cb("Rasm formati qo'llab-quvvatlanmaydi"); };
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        if (!img.naturalWidth || !img.naturalHeight) return cb("Rasm formati qo'llab-quvvatlanmaydi");
        cb(null, img, reader.result);
      };
      img.onerror = function () { cb("Rasm formati qo'llab-quvvatlanmaydi"); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  /* ================== CROP ENGINE (drag-only, 1:1 cover fit) ================== */
  var crop = {
    loaded: false,
    scale: 1,
    displayW: 0, displayH: 0,
    x: 0, y: 0,
    dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0,
    onDone: null
  };

  function clampCropPos() {
    var s = $('#pfCropStage');
    if (!s || !crop.loaded) return;
    var sw = s.clientWidth, sh = s.clientHeight;
    var iw = crop.displayW, ih = crop.displayH;
    if (iw <= sw) { crop.x = (sw - iw) / 2; }
    else {
      var minX = sw - iw;
      var maxX = 0;
      if (crop.x < minX) crop.x = minX;
      if (crop.x > maxX) crop.x = maxX;
    }
    if (ih <= sh) { crop.y = (sh - ih) / 2; }
    else {
      var minY = sh - ih;
      var maxY = 0;
      if (crop.y < minY) crop.y = minY;
      if (crop.y > maxY) crop.y = maxY;
    }
  }

  function applyCropTransform() {
    var im = $('#pfCropImg');
    if (!im) return;
    var s = $('#pfCropStage');
    var sw = s ? s.clientWidth : 0;
    var sh = s ? s.clientHeight : 0;
    var offX = (sw - crop.displayW) / 2 + crop.x;
    var offY = (sh - crop.displayH) / 2 + crop.y;
    im.style.width = crop.displayW + 'px';
    im.style.height = crop.displayH + 'px';
    im.style.transform = 'translate(' + offX + 'px,' + offY + 'px)';
  }

  function openCrop(imgSrc, onDone) {
    var stage = $('#pfCropStage'), img = $('#pfCropImg');
    if (!stage || !img) { toast('Crop oynasi topilmadi', 'error'); return; }
    crop.onDone = onDone;
    crop.loaded = false;
    crop.scale = 1; crop.x = 0; crop.y = 0;
    img.style.transform = 'none';
    img.style.width = '';
    img.style.height = '';
    img.onload = function () {
      crop.loaded = true;
      var sw = stage.clientWidth || 280;
      var sh = stage.clientHeight || sw;
      var nw = img.naturalWidth;
      var nh = img.naturalHeight;
      if (!nw || !nh) { toast("Rasm formati qo'llab-quvvatlanmaydi", 'error'); return; }
      var scale = Math.max(sw / nw, sh / nh);
      crop.scale = scale;
      crop.displayW = Math.round(nw * scale);
      crop.displayH = Math.round(nh * scale);
      var maxX = Math.max(0, (crop.displayW - sw) / 2);
      var maxY = Math.max(0, (crop.displayH - sh) / 2);
      if (crop.displayW <= sw) crop.x = 0; else crop.x = -maxX + (2 * maxX) / 2;
      if (crop.displayH <= sh) crop.y = 0; else crop.y = -maxY + (2 * maxY) / 2;
      crop.x = 0; crop.y = 0;
      applyCropTransform();
      openModalEl('#pfCropModal');
      requestAnimationFrame(function () {
        applyCropTransform();
      });
    };
    img.onerror = function () { toast("Rasm formati qo'llab-quvvatlanmaydi", 'error'); };
    img.src = imgSrc;
  }

  function bindCrop() {
    var stage = $('#pfCropStage'), img = $('#pfCropImg');
    if (!stage || !img || stage.dataset.pfBound) return;
    stage.dataset.pfBound = '1';

    stage.addEventListener('pointerdown', function (e) {
      if (!crop.loaded) return;
      crop.dragging = true;
      crop.startX = e.clientX; crop.startY = e.clientY;
      crop.baseX = crop.x; crop.baseY = crop.y;
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!crop.dragging || !crop.loaded) return;
      crop.x = crop.baseX + (e.clientX - crop.startX);
      crop.y = crop.baseY + (e.clientY - crop.startY);
      clampCropPos();
      applyCropTransform();
    });
    function endDrag() { crop.dragging = false; }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    var save = $('#pfCropSave');
    if (save) save.addEventListener('click', function () {
      if (!crop.loaded || !crop.onDone) return;
      var s = stage;
      var sw = s.clientWidth || 280;
      var sh = s.clientHeight || sw;
      var out = document.createElement('canvas');
      out.width = OUTPUT_SIZE; out.height = OUTPUT_SIZE;
      var ctx = out.getContext('2d');
      ctx.fillStyle = '#08111F';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      var nw = img.naturalWidth;
      var nh = img.naturalHeight;
      var renderedScale = Math.max(sw / nw, sh / nh);
      var renderedW = nw * renderedScale;
      var renderedH = nh * renderedScale;
      var offsetX = (sw - renderedW) / 2 + crop.x;
      var offsetY = (sh - renderedH) / 2 + crop.y;
      var naturalOffsetX = offsetX / renderedScale;
      var naturalOffsetY = offsetY / renderedScale;
      var naturalCropW = sw / renderedScale;
      var naturalCropH = sh / renderedScale;
      ctx.drawImage(img, naturalOffsetX, naturalOffsetY, naturalCropW, naturalCropH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      var dataUrl;
      try {
        dataUrl = out.toDataURL('image/jpeg', JPEG_QUALITY);
      } catch (e) {
        toast('Rasmni saqlashda xatolik', 'error');
        return;
      }
      closeModalEl('#pfCropModal');
      var done = crop.onDone; crop.onDone = null;
      done(dataUrl);
    });

    window.addEventListener('resize', function () {
      if (!document.querySelector('#pfCropModal.active')) return;
      if (!crop.loaded) return;
      var s = $('#pfCropStage');
      if (!s) return;
      var sw = s.clientWidth, sh = s.clientHeight;
      var nw = img.naturalWidth, nh = img.naturalHeight;
      if (!nw || !nh) return;
      var scale = Math.max(sw / nw, sh / nh);
      crop.scale = scale;
      crop.displayW = Math.round(nw * scale);
      crop.displayH = Math.round(nh * scale);
      clampCropPos();
      applyCropTransform();
    });
  }
  /* ================== UPLOAD / REMOVE PIPELINE ================== */
  var fileInput = null;
  function setBusy(b) {
    var save = $('#pfCropSave');
    if (save) { save.disabled = b; save.textContent = b ? '⏳ Rasm yuklanmoqda...' : 'Saqlash'; }
  }
  function pickAndCrop() {
    var u = getUser();
    if (!u) return;
    if (fileInput) fileInput.value = '';
    if (fileInput) fileInput.click();
  }
  function onFilePicked(file) {
    var err = validateFile(file);
    if (err) { toast('❌ ' + err, 'error'); return; }
    readAndDecode(file, function (dErr, img, dataSrc) {
      if (dErr) { toast('❌ ' + dErr, 'error'); return; }
      void img;
      haptic('light');
      openCrop(dataSrc, function (outDataUrl) {
        var u = getUser();
        var real = findRealUser(u) || u;
        if (!real) { toast('❌ Foydalanuvchi topilmadi', 'error'); return; }
        var uid = uidOf(real);
        setBusy(true);
        uploadServerPhoto(uid, outDataUrl, function (upErr, url) {
          setBusy(false);
          if (upErr) { toast('❌ ' + upErr, 'error'); return; }
          /* URL barcha user kopiylariga yangilanadi (real users[] + currentUser) */
          real.photoUrl = url;
          try {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            for (var i = 0; i < users.length; i++) if (users[i].id === real.id) users[i].photoUrl = url;
            localStorage.setItem('users', JSON.stringify(users));
          } catch (e) { /* noop */ }
          if (u && u.id === real.id) u.photoUrl = url;
          saveUser();
          if (typeof window.__itRefreshAvatarUI === 'function') { try { window.__itRefreshAvatarUI(); } catch (e) { /* noop */ } }
          if (typeof window.ITProfile !== 'undefined') window.ITProfile.render();
          toast('✅ Profil rasmi yangilandi', 'success');
        });
      });
    });
  }
  function requestRemovePhoto() {
    var u = getUser();
    if (!u || !photoUrlOf(u)) return;
    openModalEl('#pfRemoveConfirmModal');
  }
  function confirmRemovePhoto() {
    var u = getUser();
    var real = findRealUser(u) || u;
    if (!real) return;
    var uid = uidOf(real);
    deleteServerPhoto(uid, function (dErr) {
      closeModalEl('#pfRemoveConfirmModal');
      if (dErr) { toast('❌ ' + dErr, 'error'); return; }
      real.photoUrl = null;
      try {
        var users = JSON.parse(localStorage.getItem('users') || '[]');
        for (var i = 0; i < users.length; i++) if (users[i].id === real.id) users[i].photoUrl = null;
        localStorage.setItem('users', JSON.stringify(users));
      } catch (e) { /* noop */ }
      if (u && u.id === real.id) u.photoUrl = null;
      saveUser();
      if (typeof window.__itRefreshAvatarUI === 'function') { try { window.__itRefreshAvatarUI(); } catch (e) { /* noop */ } }
      if (typeof window.ITProfile !== 'undefined') window.ITProfile.render();
      toast('🗑 Profil rasmi olib tashlandi', 'success');
    });
  }

  /* ================== AVATAR HTML (real photo + fallback + skeleton) ================== */
  function avatarHTML(u, cls) {
    var fallback = (u && u.avatar) || '🧑‍🎓';
    try { if (typeof window.__itGetActiveAvatar === 'function') fallback = window.__itGetActiveAvatar(u); } catch (e) { /* noop */ }
    var clsBase = 'pf-avatar ' + (cls || '');
    var photo = photoUrlOf(u);
    var inner = '<span class="pf-avatar-fallback" aria-hidden="true">' + esc(fallback) + '</span>';
    if (photo) {
      inner += '<img class="pf-avatar-img" src="' + esc(photo) + '" alt="Profil rasmi" loading="lazy" ' +
        'onload="this.classList.add(\'loaded\')" onerror="this.remove()">';
      clsBase += ' has-photo';
    }
    return '<div class="' + clsBase + '">' + inner + '</div>';
  }
  /* ================== REAL DATA — MASTERY / ACHIEVEMENTS / CERTS ================== */
  /* Mastery FAQAT real testResults'dan hisoblanadi — fake/mock data YO'Q */
  function computeMastery(u) {
    var by = {};
    var list = (u && Array.isArray(u.testResults)) ? u.testResults : [];
    list.forEach(function (r) {
      if (!r || !r.subject) return;
      if (!by[r.subject]) by[r.subject] = { subject: r.subject, n: 0, sum: 0 };
      by[r.subject].n += 1;
      by[r.subject].sum += (typeof r.percent === 'number' ? r.percent : 0);
    });
    return Object.keys(by).map(function (k) {
      var s = by[k];
      return { subject: s.subject, percent: Math.round(s.sum / s.n), attempts: s.n };
    }).sort(function (a, b) { return b.percent - a.percent; });
  }
  function barHTML(p) {
    var filled = Math.round(p / 10);
    var bars = '';
    for (var i = 0; i < 10; i++) bars += '<span class="pf-bar-seg' + (i < filled ? ' on' : '') + '"></span>';
    return '<div class="pf-bar" aria-hidden="true">' + bars + '</div><b class="pf-bar-pct">' + p + '%</b>';
  }
  function achievementStats(u) {
    var all = [];
    try {
      if (typeof window.__itGetAchievements === 'function') all = window.__itGetAchievements() || [];
      else if (window.__itAchievements && window.__itAchievements.length) all = window.__itAchievements;
    } catch (e) { all = []; }
    var had = {};
    ((u && u.achievements) || []).forEach(function (id) { had[id] = true; });
    var unlocked = all.filter(function (a) { return had[a.id]; });
    var locked = all.filter(function (a) { return !had[a.id]; });
    return { all: all, unlocked: unlocked, locked: locked, total: all.length };
  }
  function certCount() {
    try {
      if (window.ITCertificates && typeof window.ITCertificates.allCertificates === 'function') {
        var list = window.ITCertificates.allCertificates();
        if (Array.isArray(list)) return list.length;
      }
    } catch (e) { /* noop */ }
    return -1; /* ma'lumot yo'q — fake son YOZMAYMIZ */
  }
  function customizationInfo(u) {
    var equipped = [];
    try {
      var info = typeof window.__itGetStoreInfo === 'function' ? window.__itGetStoreInfo() : null;
      if (info && info.equipped) {
        Object.keys(info.equipped).forEach(function (type) {
          var item = typeof window.__itStoreItem === 'function' ? window.__itStoreItem(info.equipped[type]) : null;
          if (item) equipped.push({ type: type, item: item });
        });
      }
    } catch (e) { /* noop */ }
    return equipped;
  }
  /* ================== STICKY PROFILE BAR (scroll paytida ixcham header) ==================
     - Katta hero card (.pf-head) OQIMDA qoladi — u sticky EMAS (ikkinchi marta
       yopishib qolmaydi), faqat ixcham bar yopishadi.
     - Bar #page-profile ichida `position: sticky` bo'ladi. Balandligi oqimga
       ta'sir qilmaydi (shell height:0 + abs ichki bar) → scroll'da layout shift YO'Q.
     - Ko'rinish: hero tepasi topbar ostidan chiqib ketgach (transform/opacity),
       ya'ni sahifa tepasida bar ko'rinmaydi, scroll boshlanganda chiqadi.
     - top offset: real topbar balandligi o'lchanadi → --pf-sticky-top. */
  var stickyBar = { el: null, hero: null, top: 64, stuck: null, ticking: false, bound: false };

  function stickyRaf(fn) {
    if (typeof window.requestAnimationFrame === 'function') return window.requestAnimationFrame(fn);
    return window.setTimeout(fn, 16);
  }
  /* Topbar (desktop/mobil) real balandligi → CSS top offset */
  function stickyTopbarHeight() {
    var tb = document.querySelector('.topbar');
    var h = 0;
    if (tb && tb.getBoundingClientRect) h = Math.round(tb.getBoundingClientRect().height);
    if (!h || h < 36 || h > 240) h = 64;
    stickyBar.top = h;
    try { document.documentElement.style.setProperty('--pf-sticky-top', h + 'px'); } catch (e) { /* noop */ }
    return h;
  }
  function stickySet(on) {
    stickyBar.stuck = !!on;
    var el = stickyBar.el || (stickyBar.el = document.getElementById('pfSticky'));
    if (el) el.classList.toggle('is-stuck', !!on);
  }
  function stickyUpdate() {
    stickyBar.ticking = false;
    var el = stickyBar.el || (stickyBar.el = document.getElementById('pfSticky'));
    if (!el) return;
    var page = document.getElementById('page-profile');
    if (!page || !page.classList.contains('active')) { stickySet(false); return; }
    var hero = stickyBar.hero || (stickyBar.hero = document.querySelector('#profileRoot .pf-head'));
    if (!hero) { stickySet(false); return; }
    var line = stickyTopbarHeight();
    var top = hero.getBoundingClientRect().top;
    /* Histerezis (1–8px): chegara atrofida miltillash bo'lmaydi */
    var next = stickyBar.stuck === true ? (top < line + 8) : (top <= line + 1);
    stickySet(next);
  }
  function stickySchedule() {
    if (stickyBar.ticking) return;
    stickyBar.ticking = true;
    stickyRaf(stickyUpdate);
  }
  function bindSticky() {
    if (stickyBar.bound) return;
    stickyBar.bound = true;
    window.addEventListener('scroll', stickySchedule, { passive: true });
    window.addEventListener('resize', function () { stickyTopbarHeight(); stickySchedule(); }, { passive: true });
    window.addEventListener('orientationchange', function () { stickyTopbarHeight(); stickySchedule(); }, { passive: true });
    var tb = document.querySelector('.topbar');
    if (tb && typeof window.ResizeObserver === 'function') {
      try { new window.ResizeObserver(function () { stickyTopbarHeight(); stickySchedule(); }).observe(tb); } catch (e) { /* noop */ }
    }
    stickyTopbarHeight();
  }
  function renderStickyBar(u) {
    var page = document.getElementById('page-profile');
    if (!page || !u) return;
    var el = document.getElementById('pfSticky');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pfSticky';
      el.className = 'pf-sticky';
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Profil qisqa paneli');
      page.insertBefore(el, page.firstChild);
    }
    stickyBar.el = el;
    stickyBar.hero = null; /* hero har render'da yangilanadi */
    var fullName = String((u.firstname || '') + ' ' + (u.lastname || '')).replace(/\s+/g, ' ').trim();
    if (!fullName) fullName = u.username ? '@' + u.username : 'Profil';
    el.innerHTML =
      '<div class="pf-sticky-bar">' +
        '<button type="button" class="pf-sticky-id" id="pfStickyTop" aria-label="Profil boshiga qaytish">' +
          avatarHTML(u, 'pf-avatar-xs') +
          '<span class="pf-sticky-text">' +
            '<span class="pf-sticky-name">' + esc(fullName) + '</span>' +
            '<span class="pf-sticky-user">@' + esc(u.username || '') + '</span>' +
          '</span>' +
        '</button>' +
        '<button type="button" class="btn btn-primary btn-sm pf-sticky-edit" id="pfStickyEdit" aria-label="Profilni tahrirlash">' +
          '<span aria-hidden="true">✏️</span><span class="pf-sticky-edit-txt">Tahrirlash</span>' +
        '</button>' +
      '</div>';
    var backTop = document.getElementById('pfStickyTop');
    if (backTop) backTop.addEventListener('click', function () {
      haptic('light');
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      catch (e) { try { window.scrollTo(0, 0); } catch (e2) { /* noop */ } }
    });
    var edit = document.getElementById('pfStickyEdit');
    if (edit) edit.addEventListener('click', function () { haptic('light'); openEditModal(); });
    bindSticky();
    stickyTopbarHeight();
    stickyUpdate();
  }

  /* ================== PROFILE RENDER (header + mastery + achievements) ================== */
  function renderProfilePage(u) {
    var root = $('#profileRoot');
    if (!root || !u) return;
    var mastery = computeMastery(u);
    var ach = achievementStats(u);
    var certs = certCount();
    var equippedHTML = (function () {
      var equipped = customizationInfo(u);
      if (!equipped.length) return '<span class="muted">Hozircha yo‘q</span>';
      return equipped.map(function (e) {
        return '<span class="store-equipped-pill">' + esc(e.item.icon || '') + ' ' +
          esc(String(e.item.name || '').replace(/^\S+\s/, '')) + '</span>';
      }).join('');
    })();
    var joined = u && u.joinedAt ? new Date(u.joinedAt) : null;
    var html =
      /* ——— HEADER ——— */
      '<div class="card pf-head">' +
        avatarHTML(u, 'pf-avatar-xl') +
        '<button type="button" class="pf-cam" id="pfCamBtn" aria-label="Rasmni o‘zgartirish">📷</button>' +
        '<h2 class="pf-name">' + esc(u.firstname || '') + ' ' + esc(u.lastname || '') + '</h2>' +
        '<div class="pf-username">@' + esc(u.username || '') + '</div>' +
        (u.bio ? '<p class="pf-bio">' + esc(u.bio) + '</p>' : '') +
        '<div class="pf-meta muted">' +
          (u.email ? '<span>' + esc(u.email) + '</span>' : '') +
          (joined ? '<span> · ' + joined.getDate() + '/' + (joined.getMonth() + 1) + '/' + joined.getFullYear() + '</span>' : '') +
        '</div>' +
        '<div class="pf-actions">' +
          '<button class="btn btn-primary" id="pfEditBtn" type="button">✏️ Profilni tahrirlash</button>' +
        '</div>' +
      '</div>' +

      /* ——— MASTERY (kichik karta → batafsil) ——— */
      '<div class="card pf-card">' +
        '<div class="card-header"><h3>🧠 Mastery System</h3></div>' +
        '<div class="card-body">' +
        (mastery.length
          ? mastery.slice(0, 4).map(function (m) {
              return '<div class="pf-mastery-row"><span class="pf-mastery-name">' + esc(m.subject) + '</span>' +
                barHTML(m.percent) + '</div>';
            }).join('')
          : '<p class="muted">Hali test ishlanmagan — Mastery test natijalari bilan shakllanadi.</p>') +
        (mastery.length ? '<button class="btn btn-ghost btn-sm pf-details-btn" id="pfMasteryBtn" type="button">Batafsil →</button>' : '') +
        '</div>' +
      '</div>' +

      /* ——— ACHIEVEMENTS ——— */
      '<div class="card pf-card">' +
        '<div class="card-header"><h3>🏆 Achievementlar</h3><span class="muted">' +
          (ach.total ? ach.unlocked.length + '/' + ach.total : '') + '</span></div>' +
        '<div class="card-body">' +
        (ach.total
          ? '<div class="pf-ach-row">' +
              ach.unlocked.slice(0, 6).map(function (a) {
                return '<span class="pf-ach unlocked" title="' + esc(a.name) + '">' + esc(a.icon) + '</span>';
              }).join('') +
              ach.locked.slice(0, Math.max(0, 6 - ach.unlocked.slice(0, 6).length)).map(function (a) {
                return '<span class="pf-ach locked" title="' + esc(a.name) + ': ' + esc(a.desc) + '">🔒</span>';
              }).join('') +
            '</div>' +
            '<div class="pf-ach-note muted">' +
              (ach.unlocked.length ? '✅ ' + ach.unlocked.length + ' ta ochildi · ' : '') +
              (ach.locked.length ? '🔒 ' + ach.locked.length + ' ta yopiq' : '') +
            '</div>'
          : '<p class="muted">Yutuqlar testlar va faoliyat bilan ochiladi.</p>') +
        '<button class="btn btn-ghost btn-sm pf-details-btn" id="pfAchBtn" type="button">Barcha yutuqlar →</button>' +
        '</div>' +
      '</div>' +

      /* ——— CERTIFICATES (umumiy preview) ——— */
      '<div class="card pf-card">' +
        '<div class="card-header"><h3>🎓 Sertifikatlar</h3></div>' +
        '<div class="card-body">' +
          '<p>' + (certs >= 0 ? '<strong>' + certs + ' ta sertifikat</strong>' : 'Sertifikatlar kurslarni tugatgach beriladi') + '</p>' +
          '<button class="btn btn-primary btn-sm pf-details-btn" id="pfCertBtn" type="button">Sertifikatlarni ko‘rish →</button>' +
        '</div>' +
      '</div>' +

      /* ——— CUSTOMIZATION ——— */
      '<div class="card pf-card">' +
        '<div class="card-header"><h3>🎨 Avatar / Frame / Badge</h3></div>' +
        '<div class="card-body">' +
          '<div class="pf-cust-preview">' + avatarHTML(u, 'pf-avatar-sm') +
            '<div class="store-equipped">' + equippedHTML + '</div>' +
          '</div>' +
          '<button class="btn btn-ghost btn-sm pf-details-btn" id="pfStoreBtn" type="button">Do‘konda sozlash →</button>' +
        '</div>' +
      '</div>';
    root.innerHTML = html;
    /* Sticky bar ham shu ma'lumotlardan quriladi (hero render bo'lgach) */
    renderStickyBar(u);
    /* ——— EVENTS ——— */
    var cam = $('#pfCamBtn');
    if (cam) cam.addEventListener('click', function () { haptic('light'); pickAndCrop(); });
    var edit = $('#pfEditBtn');
    if (edit) edit.addEventListener('click', function () { openEditModal(); });
    var mbtn = $('#pfMasteryBtn');
    if (mbtn) mbtn.addEventListener('click', function () { renderMasteryDetail(u); });
    var abtn = $('#pfAchBtn');
    if (abtn) abtn.addEventListener('click', function () { if (window.__itShowPage) window.__itShowPage('achievements'); });
    var cbtn = $('#pfCertBtn');
    if (cbtn) cbtn.addEventListener('click', function () { if (window.__itShowPage) window.__itShowPage('certificate'); });
    var sbtn = $('#pfStoreBtn');
    if (sbtn) sbtn.addEventListener('click', function () { if (window.__itShowPage) window.__itShowPage('store'); });
  }

  function renderMasteryDetail(u) {
    var body = $('#pfMasteryBody');
    if (!body) return;
    var list = computeMastery(u);
    body.innerHTML = list.length
      ? list.map(function (m) {
          var icon = '';
          try {
            var subs = (window.__itGetSubjects && window.__itGetSubjects()) || [];
            for (var i = 0; i < subs.length; i++) if (subs[i].name === m.subject) icon = subs[i].icon || '';
          } catch (e) { /* noop */ }
          return '<div class="pf-mastery-row"><span class="pf-mastery-name">' + esc(icon + ' ' + m.subject) + '</span>' +
            barHTML(m.percent) + '<span class="pf-mastery-attempts muted">' + m.attempts + ' test</span></div>';
        }).join('')
      : '<p class="muted">Hali test natijalari yo‘q.</p>';
    openModalEl('#pfMasteryModal');
  }
  /* ================== EDIT MODAL ================== */
  function openEditModal() {
    var u = getUser();
    if (!u) return;
    $('#editFirstname').value = u.firstname || '';
    $('#editLastname').value = u.lastname || '';
    $('#editUsername').value = u.username || '';
    $('#editEmail').value = u.email || '';
    $('#editBio').value = u.bio || '';
    var wrap = $('#pfEditAvatarWrap');
    if (wrap) wrap.innerHTML = avatarHTML(u, 'pf-avatar-lg');
    openModalEl('#editProfileModal');
  }
  function saveEdit() {
    var u = getUser();
    var real = findRealUser(u) || u;
    if (!real) return;
    var firstname = $('#editFirstname').value.trim();
    var lastname = $('#editLastname').value.trim();
    var username = $('#editUsername').value.trim();
    var email = $('#editEmail').value.trim();
    var bio = ($('#editBio').value || '').trim();
    if (!firstname || !lastname || !username || !email) { toast('Maydonlarni to‘ldiring', 'error'); return; }
    var btn = $('#editProfileSave');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Saqlanmoqda...'; }
    /* Kichik delay — loading holati foydalanuvchiga ko‘rinadi */
    setTimeout(function () {
      try {
        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var dupeU = null, dupeE = null;
        for (var i = 0; i < users.length; i++) {
          if (real.id && users[i].id === real.id) continue;
          if (users[i].username && users[i].username.toLowerCase() === username.toLowerCase()) dupeU = users[i];
          if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) dupeE = users[i];
        }
        if (dupeU || dupeE) {
          if (btn) { btn.disabled = false; btn.textContent = '💾 Saqlash'; }
          toast(dupeU ? '❌ Username band' : '❌ Email band', 'error');
          return;
        }
        real.firstname = firstname; real.lastname = lastname;
        real.username = username; real.email = email; real.bio = bio;
        for (var j = 0; j < users.length; j++) if (real.id && users[j].id === real.id) users[j] = real;
        localStorage.setItem('users', JSON.stringify(users));
        if (u && u.id === real.id) { u.firstname = firstname; u.lastname = lastname; u.username = username; u.email = email; u.bio = bio; }
        saveUser();
        if (btn) { btn.disabled = false; btn.textContent = '💾 Saqlash'; }
        closeModalEl('#editProfileModal');
        if (typeof window.__itRefreshAvatarUI === 'function') { try { window.__itRefreshAvatarUI(); } catch (e) { /* noop */ } }
        if (window.ITProfile) window.ITProfile.render();
        toast('✅ Profil yangilandi', 'success');
      } catch (e) {
        if (btn) { btn.disabled = false; btn.textContent = '💾 Saqlash'; }
        toast('❌ Profilni saqlashda xatolik yuz berdi', 'error');
      }
    }, 250);
  }
  /* ================== PUBLIC API + INIT ================== */
  var api = {
    /* Test uchun ichki expose (production'da ishlatilmaydi) */
    _test: {
      validateFile: validateFile,
      computeMastery: computeMastery,
      stickyUpdate: stickyUpdate,
      stickyTopbarHeight: stickyTopbarHeight,
      stickyState: function () {
        return {
          stuck: stickyBar.stuck,
          topOffset: stickyBar.top,
          hasBar: !!stickyBar.el,
          bound: stickyBar.bound
        };
      }
    },
    render: function () {
      var u = getUser();
      if (!u) return;
      /* Server'dan URL sink (boshqa qurilmadan yuklangan bo'lsa) */
      var local = photoUrlOf(u);
      fetchServerPhoto(uidOf(u), function (serverUrl) {
        var cur = getUser();
        if (!cur) return;
        if (serverUrl && serverUrl !== photoUrlOf(cur)) {
          cur.photoUrl = serverUrl;
          var real = findRealUser(cur);
          if (real) real.photoUrl = serverUrl;
          try {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            for (var i = 0; i < users.length; i++) if (cur.id && users[i].id === cur.id) users[i].photoUrl = serverUrl;
            localStorage.setItem('users', JSON.stringify(users));
          } catch (e) { /* noop */ }
        }
        if (document.querySelector('#page-profile.active')) renderProfilePage(cur);
      });
      if (document.querySelector('#page-profile.active')) renderProfilePage(u);
    }
  };
  window.ITProfile = api;

  function bindOnce() {
    if (api._bound) return;
    api._bound = true;
    fileInput = $('#pfEditFileInput');
    if (fileInput) fileInput.addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) onFilePicked(f);
      e.target.value = '';
    });
    var upBtn = $('#pfEditUploadBtn');
    if (upBtn) upBtn.addEventListener('click', pickAndCrop);
    var rmBtn = $('#pfEditRemoveBtn');
    if (rmBtn) rmBtn.addEventListener('click', requestRemovePhoto);
    var rmConfirm = $('#pfRemoveConfirmBtn');
    if (rmConfirm) rmConfirm.addEventListener('click', confirmRemovePhoto);
    var saveBtn = $('#editProfileSave');
    if (saveBtn) saveBtn.addEventListener('click', saveEdit);
    bindCrop();
    /* Scroll/resize → sticky bar holati (listener bir marta) */
    bindSticky();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bindOnce(); api.render(); });
  } else { bindOnce(); api.render(); }
})();
