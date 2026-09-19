# ITTest — Firebase Cloud Messaging (Push Notification) sozlash

> Bu fayl faqat ko'rsatma. Ilova kodi allaqachon Firebase'ga tayyor.

## 1. Firebase Console'da Android app qo'shish

1. https://console.firebase.google.com → **Add project** (yoki mavjud project).
2. **Android** belgisini bosib app qo'shing:
   - **Android package name:** `uz.orzutalim.app` (loyihadagi `applicationId` — boshqa yozma!)
   - **App nickname:** `ITtest`
   - SHA-1 shart emas (faqat Auth/Sign-in uchun kerak bo'ladi).
3. **Download google-services.json** → faylni aynan shu joyga qo'ying:

```
android/app/google-services.json
```

(Eslatma: `google-services.json` — maxfiy emas, lekin biz baribir .gitignore'ga kiritdik.
Saqlash/jo'natish jarayonida shunchaki e'tiborli bo'ling.)

## 2. Cloud Messaging yoqilganini tekshirish

1. Firebase Console → **Project settings → Cloud Messaging** tab.
2. **Firebase Cloud Messaging API (V1)** — **Enable** holatda bo'lsin.
3. Agar "Cloud Messaging API (Legacy)" o'chirilgan bo'lsa — muammo emas,
   V1 yetarli (Console orqali test yuborish uchun V1 ishlatiladi).

## 3. Build va sinash tartibi

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

APK: `android\app\build\outputs\apk\debug\app-debug.apk`

## 4. Test qilish tartibi (FCM Console orqali)

1. Ilovani telefonaga o'rnating va oching → **Notification permission** so'raladi (Android 13+).
2. Android Studio → **Logcat** → filter: `ITTest Push` → **FCM token**ni nusxalab oling.
3. Firebase Console → **Engage → Messaging → Create your first campaign** → **Firebase Notification messages**.
4. Title / Text kiriting → **Next** → Target: **App** → `uz.orzutalim.app` tanlang.
5. Test yuborish uchun: **Send test message** → FCM registration token'ni qo'ying → **Test**.
6. Tekshiring:
   - Ilova **foreground**da: notification banner ko'rinadi + Console'da `pushNotificationReceived` log.
   - Ilova **background**da: tizim notification'i ko'rinadi.
   - Ilova **yopiq** (swipe away): notification keladi; bosilganda ITTest ochiladi.
7. Notification'ga data qo'shish (routing): Messaging → **Additional options → Custom data**:
   - `page` = `duel` / `tests` / `lessons` / `profile` va h.k.
   - Notification bosilganda ilova shu page'ga yo'naltiradi.

## 5. Server (backend) orqali yuborish — Tayyor! ✅

Serverda `POST /api/push/send` endpointi mavjud (Firebase Admin SDK orqali).

### 5.1. Bir martalik sozlash (Service account)

1. Firebase Console → ⚙️ **Project settings → Service accounts**.
2. **Generate new private key** → JSON fayl yuklab olinadi.
3. Faylni aynan shu joyga saqlang (boshqa nom bilan ham bo'ladi, lekin gitga kirmasin):

```
server/serviceAccountKey.json
```

⚠️ Bu fayl **maxfiy** — `.gitignore`da allaqachon (`server/serviceAccountKey.json`, `*serviceAccount*.json`).
GitHub'ga yuklamang, hech kimga yubormang.

4. Serverni ishga tushiring — konsolda `✅ Firebase Admin SDK ulandi` chiqishi kerak:

```powershell
npm install
npm run server
```

### 5.2. Xabar yuborish

Ilova ochilgan va token ro'yxatdan o'tgan bo'lishi shart
(`adb logcat | findstr "ITTest Push"` → "Token serverga yuborildi" logini ko'ring).

**Barcha qurilmalarga (broadcast):**

```powershell
# 1) Admin JWT olish (login orqali)
$login = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -ContentType 'application/json' -Body '{"username":"admin","password":"PAROLINGIZ"}'
$jwt = $login.token

# 2) Push yuborish
Invoke-RestMethod -Uri 'http://localhost:3000/api/push/send' -Method Post -Headers @{ Authorization = "Bearer $jwt" } -ContentType 'application/json' -Body '{"title":"ITTest","body":"Yangi test qo''shildi!","page":"tests"}'
```

**Bitta foydalanuvchiga:** body'ga `"userId":"<user-id>"` qo'shing.
**Bitta qurilmaga:** body'ga `"token":"<fcm-token>"` qo'shing.

Javob: `{ "success": true, "total": 1, "sent": 1, "failed": 0 }`
Eskirgan tokenlar avtomatik o'chiriladi (`invalidTokens`).

### 5.3. Endpointlar xulosa

| Endpoint | Auth | Vazifa |
|---|---|---|
| `POST /api/push/tokens` | ochiq | Qurilma tokenni ro'yxatdan o'tkazadi (ilova avtomatik qiladi) |
| `GET /api/push/tokens` | admin JWT | Barcha tokenlar ro'yxati |
| `DELETE /api/push/tokens/:token` | admin JWT | Token o'chirish |
| `POST /api/push/send` | admin JWT | Push xabar yuborish (token/userId/broadcast) |

## 6. Xavfsizlik (Muhim!)

- ❌ Firebase **service account JSON** / private key — frontend yoki APK ichiga qo'ymang.
- ❌ FCM **server key** (legacy) — client JS ichiga yozmang.
- ✅ `google-services.json` — faqat Android build konfiguratsiyasi (client-side, ochiq hisoblanadi).
- ✅ Maxfiy fayllar `.gitignore`da (`google-services.json`, `.env`, `*.keystore`).
