# OrzuTalim — Duel Modulini Professional Qilish

## Overview
- **Summary**: Duel modulidagi jiddiy real player buglarni root-cause darajasida tuzatish, mobile UI ni app-kabi ko'rinishga keltirish, bot rejimini saqlab qolish.
- **Purpose**: Hozirgi "Real Player" rejimi aslida haqiqiy real player emas (hot-seat 2-player local mode) va foydalanuvchini aldaydi. Mobile UI ham desktop form factor uchun mo'ljallangan bo'lib, telefonlarda qulay emas.
- **Target Users**: OrzuTalim platformasi foydalanuvchilari (desktop brauzer, mobile brauzer va Capacitor/Android APK).

## Goals
- Real Player rejimini to'g'rilash: matchmaking oynasi, raqib qidirish, cancel tugmasi, timeout/disconnect/reconnect statuslari, timeoutda roundni yakunlash
- Fake opponent muammosini yashirmaslik: real player mavjud emasligini aniq ko'rsatish yoki matchmaking timeoutida bot-ga o'tkazish
- BOT rejimini hech qanday taraflamasdan saqlab qolish
- Mobile UI (320px — 430px) uchun Duel sahifasini alohida qulay layout qilish
- Touch area ≥ 48px, horizontal overflow yo'q
- Test qilish: bot duel va real player duel alohida

## Non-Goals
- Backendga yangi WebSocket/Socket.io real-time infra yozmaslik (loyiha serverda duel yo'q, frontend-only arxitektura)
- Haqiqiy P2P real player network o'tkazish (umumiy arxitektura bu emas)
- Boshqa modullarga (tests, dashboard, lessons, store) tegishli o'zgarishlar
- Desktop form factor uchun katta formalarni kichraytirish (faqat mobilni yaxshilash)

## Background & Context
Audit natijasida aniqlangan holat:
1. **Arxitektura**: Duel moduli butunlay frontendda (script.js) yozilgan, serverda (server.cjs) duel uchun birorta ham route, DB jadvali yoki WebSocket/Socket.io yo'q. `faye-websocket` faqat transitive dependency.
2. **BOT rejimi** (`startMatchmaking` → `startDuelMatch`) to'g'ri ishlaydi: matchmaking screen, DUEL_OPPONENTS dan fake opponent tanlash, javoblarni rate asosida simulate qilish, timeout → null answer, score ≥6 early win, history saqlash.
3. **REAL PLAYER rejimi aslida FAKE**: `startRealPlayerDuel` (script.js:3013) matchmaking screenni o'tkazib yuboradi, Player 2 ni "🐼 Player 2" deb hardcode qiladi, va H/J/K/L keyboard bilan bir xil ekranda 2-kishi o'ynaydigan HOT-SEAT rejimiga aylantiriladi. Hech qanday opponent search, room, session, timeout, disconnect, reconnect yo'q.
4. **Real Player Round Hang Bug**: `startDuelTimer` timeoutida 0 ga yetganda `selectDuelAnswer(null)` chaqiradi (faqat bot mode). Real player mode da timeout handler yo'q — bir kishi javob bermasa round abadiy davom etadi.
5. **Real Player No Early Win**: `loadRealPlayerQuestion` da faqat `currentIndex >= 6` tekshiriladi, `score >= 6` yo'q — 6 ball oldingandan keyin ham barcha 6 savolga javob berish kerak.
6. **Mobile CSS**: `mobile.css` da duel uchun kam miqdorda override bor (1140-1208 qatorlar), ammo double-grid (real player hot-seat) mobil uchun mos emas, history table overflow xavfi bor, touch area kamchiliklari bor.

## Functional Requirements
- **FR-1**: Real Player rejimi "👥 Real Player" label ostida, avval matchmaking ekranini ko'rsatishi kerak: "Raqib qidirilmoqda..." status, progress, ikkala player avatarlar, "Qidiruvni bekor qilish" tugmasi.
- **FR-2**: Matchmaking timeout (masalan, 8-12 soniya) dan so'ng, real player topilmasligini aniq bildirib, "Raqib topilmadi. Bot bilan davom etishni xohlaysizmi?" variantini taklif qilish (cancel tugmasi ham).
- **FR-3**: Matchmakingni "Qidiruvni bekor qilish" orqali to'xtatish va lobby ga qaytish kerak.
- **FR-4**: Real player deb nomlanayotgan rejim aslida hot-seat 2-player local mode ekanligini, opponent topilmasa bot-ga o'tish kerakligini yashirmaslik.
- **FR-5**: Real player (hot-seat) mode da HAR bir player timeoutda (10s) javob bermasa, uning javobi null deb hisoblanib round avtomatik yakunlanishi kerak (hang yo'qolishi).
- **FR-6**: Real player mode da score >= 6 ga yetgan player g'alaba qozonishi (early win).
- **FR-7**: Connection/disconnect status banner: real player flow da "Ulandi", "Uzildi", "Qayta ulanish..." kabi aniq statuslar.
- **FR-8**: Mobile layout (≤430px): Lobby (fan select, opponent type, difficulty, start button), Matchmaking, Duel screen (avatar, score, progress, timer, question), Result — hammasi alohida moslashgan.
- **FR-9**: Mobile da touch area (option buttons, chips, start button) ≥ 48px balandlikda, horizontal overflow yo'q.
- **FR-10**: History table mobil uchun card-style listga convert (yoki scroll-wrap, horizontal overflow scroll emas, viewport chiqib ketmasligi).
- **FR-11**: Bot rejimi (Oson/O'rtacha/Qiyin) hech qanday usulda buzilmasligi kerak.
- **FR-12**: Duel history save qilish, stats (win/loss/total), XP/ball reward saqlanishi davom etishi kerak.

## Non-Functional Requirements
- **NFR-1**: Vanilla JS (IIFE global namespace) arxitekturasini saqlash — framework qo'shmang.
- **NFR-2**: Mobile-first, 320px dan 430px gacha 100% moslash.
- **NFR-3**: Performance: timer interval, DOM update — 60fps darajasida, jank yo'q.
- **NFR-4**: LocalStorage state migration oldingi saved userlarni buzmasligi.
- **NFR-5**: Accessibility: aria-live, role="radiogroup", keyboard navigation (mavjud S/C/J/L va A/S/D/F saqlanadi).

## Constraints
- **Technical**: Faqat `script.js`, `style.css`, `mobile.css`, `index.html` fayllariga Duel moduli doirasida o'zgartirish. Server fayllariga, DB jadvallariga yoki boshqa modullarga (tests, auth, store, dashboard, lessons) tegishli o'zgartirish kiritilmaydi.
- **Business**: Mavjud ishlayotgan BOT rejimini ASLIDA saqlash, yangi bug kiritmagan holda real player flowni to'g'rilash. Fake opponentni yashirmaslik (yashirish taqiqlanadi).
- **Dependencies**: Yangi npm package o'rnatmaslik, mavjud Vanilla JS, localStorage, setTimeout/setInterval asosida qolish.

## Assumptions
- Haqiqiy network real-time player yo'q, chunki serverda hech qanday duel infra yo'q va bu speciyning Non-Goal qismi.
- "Real Player" kechiktirish (delay) va timeout orqali opponentni simulate qilish (fake, ammo aniq label) + 2-player hot-seat local mode aniq belgilangan holda saqlanadi.
- Matchmaking timeoutdan keyin bot bilan o'ynashga o'tish eng professional UX hisoblanadi (foydalanuvchi kutib turib bo'lmaydi).

## Acceptance Criteria

### AC-1: Real Player Matchmaking Screenni to'g'ri ko'rsatish
- **Type**: `rule`
- **Given**: Foydalanuvchi "👥 Real Player" chipini tanlab, "DUELNI BOSHLASH" tugmasini bosgan
- **When**: Real player flow boshlangan
- **Then**: `#duelMatchmaking` ekrani ochilishi kerak; status "Raqib qidirilmoqda..." bo'lishi; P1 avatar+ismi va P2 uchun ❓ placeholder + pulse animation; progress bar to'ldirilishi; "Qidiruvni bekor qilish" tugmasi ko'rinishi va ishlashi kerak
- **Pass Condition**: Manual test: real player select → start → matchmaking ko'rish → cancel → lobby ga qaytish. DOM inspection: `#duelLobby.hidden`, `#duelMatchmaking` hidden emas, cancel button click listener attached.
- **Evidence**: DOM check, click flow video/screenshot, localStorage state preserved.

### AC-2: Matchmaking Timeout → Bot Fallback Taklifi
- **Type**: `rule`
- **Given**: Real player matchmaking boshlangan, ≥8s vaqt o'tgan
- **When**: Hech qanday "real" opponent topilmagan
- **Then**: Status "Raqib topilmadi. Bot bilan duelni boshlaymizmi?" degan banner; "Ha, bot bilan" va "Yo'q, chiqish" variantlari ko'rsatilishi kerak. "Ha" bosilsa → bot rejimiga o'tish, "Yo'q" → lobby.
- **Pass Condition**: 2 ta alohida test: 1) Wait timeout → fallback dialog appears → click Ha → bot match starts; 2) Yo'q → lobby. script.js debug log orqali mode transitionini tasdiqlash.
- **Evidence**: Manual test results, console log of `duelState.player2.difficulty !== null`.

### AC-3: Real Player Round Timeout Bug Tuzatilishi
- **Type**: `rule`
- **Given**: Real player (hot-seat) mode da yangi savol ko'rsatilgan, timer 10s dan 0 gacha hisoblanyapti
- **When**: Bir yoki ikkala player ham javob bermagan holda timer 0 ga yetgan
- **Then**: Javob bermagan player(lar) ning choice null deb belgilab, round evaluate bo'lishi (hang emas). `evaluateRealPlayerRound` chaqirilishi, score update, next question ga o'tish yoki finishDuel.
- **Pass Condition**: Manual: real player → hech narsa bossmasdan 10s kuting → round o'tishini ko'ring (banner + score update + next question). `duelState.currentIndex` 1 ga oshgan bo'lishi.
- **Evidence**: Screenshot chain, state diff.

### AC-4: Real Player Early Win (Score ≥ 6)
- **Type**: `rule`
- **Given**: Real player mode da playerlardan biri 6 ball oldi (question 4 da 6-0 bo'ldi)
- **When**: Keyingi savolni yuklashdan oldin tekshiruv bo'lsa
- **Then**: `finishDuel` chaqirilib, duel darhol tugashi kerak. 5 va 6-savollar olib tashlanishi.
- **Pass Condition**: Manual: real player → 6 ballni tez orada oling → result screen chiqishini tekshiring.
- **Evidence**: Duel state inspection, result screen screenshot.

### AC-5: Connection/Disconnect Status Banner
- **Type**: `rule`
- **Given**: Real player flow davom etmoqda
- **When**: Matchmaking, game start, round start, potential reconnect simulation
- **Then**: Aniq status messages: matchmaking ("Raqib qidirilmoqda..."), found ("Raqib topildi!"), started ("Duel boshlandi!"), potential disconnect simulation ("Raqib aloqasi uzildi" — timeout at fallbacks, reconnect attempt), winner ("Duel tugadi").
- **Pass Condition**: Har bir state transition da banner to'g'ri ko'rinishini manual tekshirish.
- **Evidence**: Banner text state log.

### AC-6: Mobile Lobby Layout (320px — 430px)
- **Type**: `rubric`
- **Dimension**: Mobil lobby (setup card) kompaktligi, touch target o'lchamlari, horizontal overflow yo'qligi
- **Scale**: 1-5
- **Anchors**: 1 = horizontal overflow bor, select/chip kichik (<40px), scrollbar ko'rinadi; 3 = ko'pchilik mos, ammo 1-2 joyda overflow; 5 = 320px da ham horizontal overflow yo'q, select ≥48px, chips flex-wrap, start button full-width ≥52px, vertical scroll.
- **Pass Threshold**: >= 4
- **Evidence**: DevTools device mode 320px va 430px width → screenshot + `window.innerWidth` check, computed heights of select/chip/start button.

### AC-7: Mobile Duel Gameplay Layout (TOW + Question + Options + Result)
- **Type**: `rubric`
- **Dimension**: Mobil da duel ekranining o'qilishi, avatar/score/timer/progress ko'rinishi, touch (option buttons ≥ 48px), horizontal overflow yo'qligi
- **Scale**: 1-5
- **Anchors**: 1 = option buttons kichik, TOW layout buzilgan, horizontal scroll; 3 = option buttons 44px, TOW stacked ammo username truncated; 5 = TOW stacked correctly, avatars readable, score bold, timer prominent, options grid 1-column ≥48px min-height, computed overflow-x===hidden at body/parent.
- **Pass Threshold**: >= 4
- **Evidence**: Screenshots 320px, 375px, 412px, 430px; computed min-height of `.duel-opt-btn`; getComputedStyle overflow-x.

### AC-8: Mobile Duel History (Horizontal Overflow Yo'q)
- **Type**: `rule`
- **Given**: Mobil viewport ≤ 375px va duelHistory ichida kamida 3 ta record
- **When**: Duel lobby history card render bo'lganda
- **Then**: Jadval horizontal overflow qilmasligi (card-style rows yoki overflow-x: auto + hidden parent, horizontal scrolling UX with card rows). Hech qachon viewport dan tashqariga chiqmaslik.
- **Pass Condition**: DevTools 320px → scroll horizontally by drag → NO horizontal page scroll; history card compute overflow-x; table-wrap mobile override.
- **Evidence**: Layout box model inspection, mobile screenshot.

### AC-9: Bot Rejimi Saqlanganligi (Regression)
- **Type**: `rule`
- **Given**: Foydalanuvchi bot mode (Oson / O'rtacha / Qiyin) tanlashi
- **When**: 6 savolgacha bo'lgan to'liq bot duel o'ynalgan
- **Then**: StartMatchmaking → fake DUEL_OPPONENTS dan opponent → 2-6.5s delayli javob → 35%/60%/85% correct rate → early win at score 6 → result XP/ball rewards → history saqlangan (duelHistory.length +1, duelTotal +1).
- **Pass Condition**: Oldingi behaviour bilan 100% mos. Manual: 2 ta duel (easy, hard), check rate approx, history record.
- **Evidence**: DuelState + localStorage snapshot before/after, console logs.

### AC-10: Real Player (Hot-Seat) Mode Saqlanganligi
- **Type**: `rule`
- **Given**: Matchmaking → cancel yo'q → hot-seat 2-player mode enabled
- **When**: Ikkala player ham A/S/D/F va H/J/K/L keyboard yoki button click bilan javob beradi
- **Then**: P1/P2 double-grid render, answers dual-record, `realPlayerState.p1Answered && p2Answered → evaluateRealPlayerRound`. Result screen o'zgarishsiz ishlaydi.
- **Pass Condition**: Manual: 2 player full 6 round duel → result → history saved.
- **Evidence**: DOM check for `#duelDoubleOptionsArea` not hidden; score diffs after rounds.

### AC-11: Keyboard Listener Leak Yo'q
- **Type**: `rule`
- **Given**: Real player duel → page → dashboard → orqaga duel → yangi duel
- **When**: Har bir loadRealPlayerQuestion oldingi keydown listener tozalanishi kerak; finishDuel da ham cleanup.
- **Then**: Bir necha marta duel → dashboard → duel aylantirilganda, bir xil tugma 1 marta callback trigger qilishi. 2+ emas.
- **Pass Condition**: Add console.log inside keyHandler → after 3 navigation loop, 1 keypress triggers 1 log.
- **Evidence**: Console log count per keypress.

## Open Questions
- [ ] Qo'shimcha: Real Player labelini "Hot-Seat 2 O'yinchi" deb o'zgartirish, "Real Player" matchmaking timeout → bot fallback qismi sifatida belgilash kerakmi? (Hozirgi spec: fallback aniq label bilan, "👥 Real Player" = matchmaking → timeout → bot; va hot-seat alohida variant? Yoki hozirgi player mode hot-seat deb rename + matchmaking → bot-only new flow? Assumption: "Real Player" matchmaking → timeout → bot fallback, hot-seat 2-player local alohida small chip.)
