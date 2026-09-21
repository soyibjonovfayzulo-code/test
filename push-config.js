/* ==========================================================
   ITTest — Push Notifications server sozlamalari (FCM)
   FCM token serverga shu endpointga yuboriladi (POST).
   ----------------------------------------------------------
   Production'da quyidagi endpoint'ni o'z serveringiz manziliga
   almashtiring, masalan:
     endpoint: 'https://api.orzutalim.uz/api/push/tokens'
   Real qurilmada lokal serverni sinash uchun:
     adb reverse tcp:3000 tcp:3000
   endpoint bo'sh qoldirilsa, push.js standart manzildan foydalanadi:
     - Web: same-origin '/api/push/tokens'
     - Native: 'http://localhost:3000/api/push/tokens'
   ========================================================== */
window.ITTEST_PUSH_CONFIG = {
  endpoint: 'http://localhost:3000/api/push/tokens'
};
