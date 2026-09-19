/* ==========================================================
   ITTest — Haptics (Vibration / Haptic Feedback)
   Capacitor Haptics asosida, brauzer uchun xavfsiz fallback.
   Native Android: @capacitor/haptics (Impact / Notification)
   Brauzer (desktop): navigator.vibrate yo'q bo'lsa — no-op (hech qanday error yo'q)
   ========================================================== */

(function () {
  'use strict';

  /* @capacitor/haptics moduli — faqat bir marta yuklanadi */
  var MOD = null;
  var loadPromise = null;

  function loadModule() {
    if (MOD || loadPromise) return loadPromise || Promise.resolve(MOD);
    try {
      loadPromise = import('@capacitor/haptics')
        .then(function (m) { MOD = m; return m; })
        .catch(function () { MOD = null; return null; });
    } catch (e) {
      MOD = null;
      loadPromise = Promise.resolve(null);
    }
    return loadPromise;
  }

  /* Native Android muhitda ekanligini tekshirish */
  function isNative() {
    try {
      return !!(
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()
      );
    } catch (e) { return false; }
  }

  /* Brauzer fallback — navigator.vibrate (mobil brauzerlarda ishlaydi) */
  function webFallback(pattern) {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch (e) { /* noop */ }
  }

  /* Spamlashdan himoya — juda qisqa orada ketma-ket chaqirilsa o'tkazib yuboradi */
  var lastFireAt = 0;
  var MIN_INTERVAL_MS = 30;

  function canFire() {
    var now = Date.now();
    if (now - lastFireAt < MIN_INTERVAL_MS) return false;
    lastFireAt = now;
    return true;
  }

  function impact(style, fallbackMs) {
    if (!canFire()) return;
    loadModule().then(function (m) {
      if (m && m.Haptics) {
        try { m.Haptics.impact({ style: style }); return; } catch (e) { /* native ishlamasa fallback */ }
      }
      webFallback(fallbackMs);
    });
  }

  function notify(type, fallbackPattern) {
    if (!canFire()) return;
    loadModule().then(function (m) {
      if (m && m.Haptics) {
        try { m.Haptics.notification({ type: type }); return; } catch (e) { /* noop */ }
      }
      webFallback(fallbackPattern);
    });
  }

  /* ================== PUBLIC API ==================
     - hapticLight()   : yengil tap feedback (muhim buttonlar)
     - hapticSuccess() : to'g'ri javob / muvaffaqiyat
     - hapticError()   : noto'g'ri javob / xato
     - hapticWarning() : ogohlantirish
     - hapticStart()   : duel / ilova / jarayon boshlanishi
  =================================================== */
  var ITHaptics = {
    isNative: isNative,
    available: function () {
      try { return isNative() || (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'); }
      catch (e) { return false; }
    },
    hapticLight: function () { impact('LIGHT', 10); },
    hapticMedium: function () { impact('MEDIUM', 18); },
    hapticSuccess: function () { notify('SUCCESS', [25, 40, 25]); },
    hapticError: function () { notify('ERROR', [45, 45, 45]); },
    hapticWarning: function () { notify('WARNING', 20); },
    hapticStart: function () { impact('MEDIUM', 22); },
    /* Ilova ochilganda bir marta — juda yengil */
    hapticAppOpen: function () { impact('LIGHT', 10); }
  };

  window.ITHaptics = ITHaptics;

  /* Qulay qisqa nomlar (mavjud kod uslubiga mos) */
  window.hapticLight = ITHaptics.hapticLight;
  window.hapticSuccess = ITHaptics.hapticSuccess;
  window.hapticError = ITHaptics.hapticError;
  window.hapticStart = ITHaptics.hapticStart;

  /* Ilova ochilganda bir marta yengil haptic (har page o'zgarganda emas) */
  function bootHaptic() {
    try { ITHaptics.hapticAppOpen(); } catch (e) { /* noop */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHaptic);
  } else {
    bootHaptic();
  }
})();
