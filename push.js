/* ==========================================================
   ITTest — Push Notifications (Firebase Cloud Messaging)
   Capacitor Push Notifications plugin asosida.
   - Faqat NATIVE Android muhitda ishlaydi (brauzerda no-op, error yo'q)
   - Android 13+ POST_NOTIFICATIONS ruxsatini so'raydi
   - FCM tokenni oladi, localStorage'da saqlaydi va AVTOMATIK
     ravishda backend serverga yuboradi (POST /api/push/tokens)
   - Yuborish xato bo'lsa pendingSync navbatida qoladi va
     keyinroq (app ochilganda / internet qayta ulanganda) qayta yuboriladi
   - Notification bosilganda ilova kerakli page'ga yo'naltiradi
   ========================================================== */

(function () {
  'use strict';

  var TOKEN_STORE_KEY = 'ittest_push_tokens';   /* backendga yuborishga tayyor struktura */
  var CHANNEL_ID = 'ittest';                    /* Android notification channel id */
  var CHANNEL_NAME = 'ITTest';                  /* Notification channel nomi */
  var ROUTE_RETRY_MS = 300;

  /* Routerda mavjud page'lar (script.js PAGE_TITLES bilan mos) */
  var KNOWN_PAGES = [
    'dashboard', 'home', 'tests', 'testlist', 'test', 'result', 'ranking',
    'achievements', 'profile', 'duel', 'store', 'coding', 'projects',
    'lessons', 'lessonCourse', 'lessonView', 'certificate', 'settings'
  ];
  /* Notification data'da qulay aliaslar: { page: 'testlar' } kabi */
  var PAGE_ALIASES = {
    testlar: 'tests',
    bosh: 'dashboard',
    profil: 'profile',
    darslar: 'lessons',
    dokon: 'store'
  };

  /* Native'da backend manzil topilmasa ishlatiladigan standart endpoint.
     Production'da push-config.js (window.ITTEST_PUSH_CONFIG.endpoint) orqali
     real server manzili ko'rsatiladi. Dev'da real qurilmadan sinash uchun:
     adb reverse tcp:3000 tcp:3000 */
  var NATIVE_FALLBACK_ENDPOINT = 'http://localhost:3000/api/push/tokens';

  /* Backend endpoint tanlash:
     1) window.ITTEST_PUSH_CONFIG.endpoint (push-config.js) — eng yuqori ustuvorlik
     2) Web (brauzer): same-origin '/api/push/tokens' (server frontend'ni o'zi serve qiladi)
     3) Native (Android): standart localhost:3000 (adb reverse yoki prod URL) */
  function getEndpoint() {
    try {
      var cfg = window.ITTEST_PUSH_CONFIG;
      if (cfg && cfg.endpoint) return String(cfg.endpoint);
    } catch (e) { /* noop */ }
    if (!isNative()) return '/api/push/tokens';
    return NATIVE_FALLBACK_ENDPOINT;
  }

  /* Joriy foydalanuvchi id'si (script.js tomonidan ta'minlanadi) */
  function currentUserId() {
    try {
      if (typeof window.__itGetCurrentUser === 'function') {
        var u = window.__itGetCurrentUser();
        if (u && u.id) return u.id;
      }
    } catch (e) { /* noop */ }
    return 'anonymous';
  }

  function isNative() {
    try {
      return !!(
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()
      );
    } catch (e) { return false; }
  }

  function getPlugin() {
    try {
      if (isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications) {
        return window.Capacitor.Plugins.PushNotifications;
      }
    } catch (e) { /* noop */ }
    return null;
  }

  /* ---------- Token store (backendga yuborishga tayyor) ---------- */
  function readTokenStore() {
    var store = { tokens: {}, pendingSync: [], lastToken: null, updatedAt: null };
    try {
      var raw = localStorage.getItem(TOKEN_STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.tokens && typeof parsed.tokens === 'object') store.tokens = parsed.tokens;
          if (Array.isArray(parsed.pendingSync)) store.pendingSync = parsed.pendingSync;
          if (parsed.lastToken) store.lastToken = parsed.lastToken;
          if (parsed.updatedAt) store.updatedAt = parsed.updatedAt;
        }
      }
    } catch (e) { /* noop */ }
    return store;
  }

  function saveTokenStore(store) {
    try { localStorage.setItem(TOKEN_STORE_KEY, JSON.stringify(store)); } catch (e) { /* noop */ }
  }

  /* FCM token kelganda: log + saqlash + serverga yuborish + custom event. */
  function onToken(token) {
    console.log('%c[ITTest Push] FCM Token:', 'color:#10b981;font-weight:bold', token);
    var store = readTokenStore();
    var userId = currentUserId();

    store.lastToken = token;
    store.updatedAt = Date.now();
    store.tokens[userId] = { token: token, updatedAt: Date.now() };
    if (store.pendingSync.indexOf(token) === -1) store.pendingSync.push(token);
    saveTokenStore(store);

    /* Serverga avtomatik yuborish (fetch POST) */
    syncTokens();

    try {
      window.dispatchEvent(new CustomEvent('ittest:push-token', { detail: { token: token, userId: userId } }));
    } catch (e) { /* noop */ }
  }

  /* ---------- Serverga token yuborish (fetch POST) ----------
     - lastToken har doim yuboriladi (userId o'zgarganda serverda yangilanadi)
     - pendingSync navbatidagi tokenlar ham qayta yuboriladi
     - Muvaffaqiyatli yuborilganlar navbatdan o'chiriladi
     - Xato bo'lsa navbat saqlanadi va keyinroq qayta uriniladi
       (app ochilganda, 'online' event'da, yangi token kelganda)   */
  var syncing = false;

  function syncTokens() {
    if (syncing) return;
    if (!isNative()) return; /* brauzer rejimida serverga yuborilmaydi */
    var endpoint = getEndpoint();
    if (!endpoint || typeof fetch !== 'function') return;

    var store = readTokenStore();
    var list = [];
    if (store.lastToken) list.push(store.lastToken);
    store.pendingSync.forEach(function (t) {
      if (list.indexOf(t) === -1) list.push(t);
    });
    if (!list.length) return;

    syncing = true;
    var userId = currentUserId();

    Promise.all(list.map(function (token) {
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, userId: userId, platform: 'android' })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return token;
      });
    }))
      .then(function (sent) {
        var st = readTokenStore();
        st.pendingSync = st.pendingSync.filter(function (t) { return sent.indexOf(t) === -1; });
        saveTokenStore(st);
        console.log('%c[ITTest Push] Token serverga yuborildi:', 'color:#10b981;font-weight:bold', sent.length + ' ta');
      })
      .catch(function (e) {
        console.warn('[ITTest Push] Token serverga yuborilmadi — navbatda qoldi (keyinroq qayta uriniladi):', e && e.message);
      })
      .then(function () { syncing = false; });
  }

  /* Login qilinganda token<->user bog'lanishini yangilash (script.js'dan chaqiriladi) */
  function attachUser() {
    var store = readTokenStore();
    if (!store.lastToken) return;
    try {
      if (typeof window.__itGetCurrentUser === 'function') {
        var u = window.__itGetCurrentUser();
        if (u && u.id) {
          store.tokens[u.id] = { token: store.lastToken, updatedAt: Date.now() };
          saveTokenStore(store);
        }
      }
    } catch (e) { /* noop */ }
    /* Serverdagi token<->user bog'lanishini ham yangilash */
    syncTokens();
  }


  /* ---------- Notification tap -> route ---------- */
  function normalizePage(raw) {
    if (!raw) return null;
    var page = String(raw).trim().toLowerCase().replace(/^#\/?/, '');
    if (PAGE_ALIASES[page]) page = PAGE_ALIASES[page];
    if (KNOWN_PAGES.indexOf(page) !== -1) return page;
    return null;
  }

  function navigateTo(page) {
    var target = normalizePage(page);
    if (!target) return;
    if (typeof window.__itShowPage === 'function') {
      try { window.__itShowPage(target); return; } catch (e) { /* noop */ }
    }
    /* script.js hali yuklanmagan (cold start) — ozgina kutib qayta urinamiz */
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (typeof window.__itShowPage === 'function' || tries > 20) {
        clearInterval(timer);
        if (typeof window.__itShowPage === 'function') {
          try { window.__itShowPage(target); } catch (e) { /* noop */ }
        }
      }
    }, ROUTE_RETRY_MS);
  }

  function handleTap(notification) {
    var data = (notification && notification.data) || {};
    /* Backend / FCM Console'dan yuboriladigan data: { page: 'duel' } yoki { route: 'tests' } */
    navigateTo(data.page || data.route || data.target);
    try {
      window.dispatchEvent(new CustomEvent('ittest:push-tap', { detail: { data: data } }));
    } catch (e) { /* noop */ }
  }

  /* ---------- Asosiy init ---------- */
  function init() {
    if (!isNative()) {
      /* Brauzerda jim o'tadi — hech qanday error chiqarmaydi */
      return;
    }
    var Push = getPlugin();
    if (!Push) {
      console.warn('[ITTest Push] PushNotifications plugin topilmadi — npx cap sync android ishga tushirilganini tekshiring');
      return;
    }

    /* Listenerlar AVVAL ro'yxatdan o'tadi (cold start tap ushlanishi uchun) */
    try {
      Push.addListener('registration', function (value) {
        if (value && value.value) onToken(value.value);
      });
      Push.addListener('registrationError', function (err) {
        console.warn('[ITTest Push] Registration error:', err && err.error);
      });
      /* Foreground'da notification kelganda — JS orqali qo'shimcha vibration QILINMAYDI
         (Android tizim notification sozlamalari bilan mos ishlaydi) */
      Push.addListener('pushNotificationReceived', function (notification) {
        console.log('[ITTest Push] Notification kelgan (foreground):', notification);
      });
      /* Notification bosilganda: ilova ochiladi + kerakli page'ga yo'naltiriladi */
      Push.addListener('pushNotificationActionPerformed', function (action) {
        console.log('[ITTest Push] Notification bosildi:', action && action.notification);
        handleTap(action && action.notification);
      });
    } catch (e) {
      console.warn('[ITTest Push] Listener xatosi:', e && e.message);
      return;
    }

    /* Avvalgi sessiyada yuborilmagan tokenlarni qayta yuborish (retry) */
    syncTokens();

    /* Internet qayta ulanganda navbatdagi tokenlarni qayta yuborish */
    try {
      window.addEventListener('online', function () { syncTokens(); });
    } catch (e) { /* noop */ }

    /* Notification channel: nomi "ITTest", importance HIGH (4) */
    try {
      Push.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        description: 'ITTest ilovasi bildirishnomalari',
        importance: 4,          /* IMPORTANCE_HIGH — Android talablariga mos */
        visibility: 1,          /* PUBLIC */
        vibration: true,
        lights: true
      }).catch(function (e) {
        /* Kanal allaqachon mavjud bo'lsa ham muammo emas */
        console.info('[ITTest Push] Channel:', (e && e.message) || 'created/skipped');
      });
    } catch (e) { /* noop */ }

    /* Permission: Android 13+ POST_NOTIFICATIONS */
    Promise.resolve()
      .then(function () { return Push.checkPermissions(); })
      .then(function (status) {
        if (!status || status.receive === 'granted') return 'granted';
        if (status.receive === 'prompt' || status.receive === 'prompt-with-rationale') {
          return Push.requestPermissions().then(function (r) { return (r && r.receive) || 'denied'; });
        }
        return status.receive; /* 'denied' — ilova ishlashda davom etadi */
      })
      .then(function (result) {
        if (result !== 'granted') {
          console.info('[ITTest Push] Notification ruxsati berilmadi (' + result + ') — ilova ishlashda davom etadi');
          return;
        }
        /* FCM ro'yxatdan o'tish -> 'registration' event -> token */
        return Push.register();
      })
      .catch(function (e) {
        console.warn('[ITTest Push] Ruxsat/register xatosi:', e && e.message);
      });
  }

  window.ITPush = {
    init: init,
    isNative: isNative,
    getToken: function () { return readTokenStore().lastToken; },
    getTokenStore: readTokenStore,
    getEndpoint: getEndpoint,
    sync: syncTokens,
    attachUser: attachUser,
    handleTap: handleTap
  };

  /* App ochilganda avtomatik ishga tushadi (native'da permission so'raydi) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
