# OrzuTalim — Duel Modul Professional Qilish: Implementation Plan

## Task 1: index.html — Matchmaking Cancel Button va Status Banner qo'shish
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - `#duelMatchmaking` ichiga `"Qidiruvni bekor qilish"` tugmasi qo'shish (btn btn-outline btn-block, full-width, ≥48px touch)
  - Matchmaking progress ostiga status banner div qo'shish: fallback dialog uchun placeholder (default hidden)
  - Real Player flow uchun connection status banner qo'shish (matchmaking section ichida, default hidden)
  - History table `#duelHistoryLog` ni mobile card-style listga moslash uchun wrapper sinfini qo'shish yoki mavjud table-wrap ni mobile CSS da override uchun tayyorlash
  - Real Player flow da 3rd chip qo'shish mumkin: "🤖 Bot bilan", "👥 Raqib qidirish", "👨‍👩‍👧 Hot-Seat" — (Lig: hozirgi "👥 Real Player" aslida hot-seat edi; bug fix: "👥 Raqib qidirish" = matchmaking → timeout → bot fallback, va yangi "🎮 Hot-Seat 2P" = eski real player hot-seat)
  - Yangi HTML sinflar: `mmCancelBtn`, `mmFallbackPanel`, `mmConnectionStatus`, `duel-history-cards` (mobile history list uchun option)
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-5, AC-8
- **Test Requirements**:
  - `rule` TR-1.1: Browserda `#duelMatchmaking` ichida mmCancelBtn mavjudligi getElementById bilan tekshirilganda non-null
  - `rule` TR-1.2: Hot-Seat 2P chip, 👥 Raqib qidirish chip, 🤖 Bot chip — 3 ta mode chip DOM da ko'rsatish (hammasi 3 ta mavjud)
  - `rubric` TR-1.3: HTML structure readability/changes minimal; scale 1-5; anchors: 1 = many unrelated DOM adds, 3 = duel section adds, 5 = only duel section targeted minimal changes; threshold >= 4
  - `rubric` TR-1.4: Mobile accessibility (button labels, aria labels); scale 1-5; anchors 1=no aria,3=partial,5=cancel btn has aria-label, status aria-live; threshold >=4
- **Notes**: 3-chip rejim structure tanlash: 
  1. 🤖 Bot → eski startMatchmaking (to'g'ri ishlaydi)
  2. 👥 Raqib qidirish → YANGI startSearchRealPlayer → matchmaking 8-12s → timeout → fallback dialog → Ha=bot bilan startMatchmaking, Yo'q=lobby
  3. 🎮 Hot-Seat 2P → eski startRealPlayerDuel (hot-seat dual keyboard)

## Task 2: script.js — Real Player Matchmaking va Bug Fixes
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (chip ids va cancel button ids match qilishi kerak)
- **Description**:
  - 3 ta mode chip uchun bindDuel da yangi mapping: `bot`=startMatchmaking, `search`=yangi `startSearchRealPlayer()`, `hotseat`=startRealPlayerDuel ( eski `player` ni rename `hotseat` ga )
  - YANGI `startSearchRealPlayer()`: #duelLobby hide → #duelMatchmaking show → P1/P2 ❓ placeholder → progress bar random 8-12s → after timeout → fallback panel show "Raqib topilmadi. Bot bilan davom etilsinmi? Ha / Yo'q". Ha bosilsa → startMatchmaking() call (bot o'ynatish). Yo'q → renderDuel() lobbyga. Cancel button → renderDuel().
  - Cancel button click listener: clear any search timer, renderDuel() (lobby).
  - **BUG FIX 1 (Real Player Round Hang)**: `startDuelTimer()` da timer 0 ga yetganda — joriy mode `hotseat` bo'lsa → avtomatik to'ldirish: p1 answer bermagan → realPlayerState.p1Choice = null, p1Answered = true; p2 → same; keyin `evaluateRealPlayerRound()` ni trigger; (hang yo'qolishi). Current `startDuelTimer` faqat `selectDuelAnswer(null)` chaqiradi — bu BOT mode uchun; extend qilib hotseat mode uchun ham.
  - **BUG FIX 2 (Real Player No Early Win)**: `loadRealPlayerQuestion()` boshiga `duelState.currentIndex >= 6 || duelState.player1.score >= 6 || duelState.player2.score >= 6` tekshiruvini qo'shish (bot mode dagi 2811-2813 qatorlarini copy).
  - **BUG FIX 3 (Keyboard Listener Leak)**: `loadRealPlayerQuestion` da yangi listener qo'shishdan OLDIN — oldingi `duelState._keyHandler` ni removeEventListener qilish. `finishDuel` da allaqachon bor cleanup ni saqlash. Nav change (page render → non-duel page) da cleanup qo'shish.
  - Status banner transitions: startSearch → "Raqib qidirilmoqda...", found simulation → "Raqib topildi!", start match → "Duel boshlandi!".
  - Connection status banner for hot-seat: start → "Ulandi ✅", potential timeout disconnection banner → "Raqib javob bermadi (timeout)", next round → tiklandi.
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-10, AC-11
- **Test Requirements**:
  - `rule` TR-2.1: startSearchRealPlayer → cancel button bosish → lobby (duelLobby hidden emas, matchmaking hidden)
  - `rule` TR-2.2: startSearchRealPlayer → 12s kuting → fallback panel hidden emasligi; "Ha" bosilsa → #duelMatchmaking hidden + #duelGameplay NOT hidden (bot mode starts)
  - `rule` TR-2.3: Hot-seat mode → 10s hech narsa bosmang → `duelState.currentIndex` 1 ga oshishi (round o'tgan bo'lsin, hang bo'lmasin)
  - `rule` TR-2.4: Hot-seat mode → P1 → 6 ball olgan vaqti (6-1 holat) → keyingi loadRealPlayerQuestion da finishDuel() chaqirilishi (result ko'rsatilishi, 6-savol emas)
  - `rule` TR-2.5: 3 marta hot-seat duel → dashboard → duel → 1 marta keyboard press → 1 marta console.log (listener leak yo'q)
  - `rubric` TR-2.6: Bug fix coverage (all 3 bugs + 2 new flows); scale 1-5; anchors 1 = 1 bug fixed, 3 = 3 bugs, 5 = 3 bugs + 2 new flows + banner messages; threshold >= 4
- **Notes**: BOT mode `startMatchmaking` va `startDuelMatch`, `selectDuelAnswer`, `loadDuelQuestion` ni buzmaslik — ularni aslida qo'yib turish, yangi search flow ularni alohida call qilishi kerak.

## Task 3: script.js — Duel History Card Style List (Mobile Fallback)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2 (duel state + history render flow)
- **Description**:
  - `renderDuelHistory()` ni modify qilib: window width ≤ 768px da table o'rniga card-style DIV list render qilish (har bir record = .duel-history-card-item ichida: sana, fan, raqib, natija badge, hisob). Overflow yo'qolishi uchun.
  - HistoryTable desktopda saqlanadi, mobile da toggle. Media query width check orqali.
- **Acceptance Criteria Addressed**: AC-8, AC-9 (regression for desktop view)
- **Test Requirements**:
  - `rule` TR-3.1: 375px width → `#duelHistoryLog` ichida table mavjud emas, .duel-history-card-item DIVs kamida 3 ta mavjud (agar 3+ history bo'lsa)
  - `rule` TR-3.2: 1024px width → `#duelHistoryLog` ichida TABLE render qilinadi, oldindek
  - `rubric` TR-3.3: History item visual quality on mobile; scale 1-5; anchors 1 = truncated overflow, 3 = acceptable wrap, 5 = all fields readable, badge colored, score bold; threshold >= 4
- **Notes**: Old code structure (table) saqlanishi kerak (desktop). Mobile uchun alohida render path.

## Task 4: style.css — Mobile CSS uchun Duel Mobile Targeted Overrides (desktop unchanged)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (new classes)
- **Description**:
  - `.duel-opt-btn` min-height 48px → boost (touch area)
  - `.duel-chip` (mode chips, diff chips) min-height 48px, font-size ≥ 14px mobile
  - `#duelStartSearchBtn` min-height 52px (start button)
  - `#duelSubjectSelect.form-control` min-height 48px
  - `.matchmaking-container` padding 20px → mobile; m-avatar 60px, m-player 100px width
  - `.tow-visualizer` stacked (already 768px media query bor, ammo 430px da gap/padding optimize)
  - `.tow-username` max-width 72px, `.tow-score` font-size 22px → for 320px
  - `.duel-q-text` font-size 16px (no wrap truncation), line-height 1.5
  - `.duel-double-grid` (hot-seat) mobile: grid-template-columns 1fr (yuqori-pastki), NOT 2 column side-by-side; horizontal scrolling yo'qolishi uchun. Player 1 panel, Player 2 panel stacked vertical.
  - `.duel-setup-card .card-body` padding 12px, form-group gap 8px
  - `.duel-history-table td, th` font-size 12px yoki Task 3 card path orqali (agar Task 3 ishlasa kamroq CSS kerak)
  - Cancel button `.mmCancelBtn` full-width, min-height 48px
  - Fallback panel `.mmFallbackPanel` 2 button stacked mobile (Ha / Yo'q)
- **Acceptance Criteria Addressed**: AC-6, AC-7, AC-8
- **Test Requirements**:
  - `rule` TR-4.1: Window width 320px, getComputedStyle `.duel-opt-btn`.minHeight → ≥48px
  - `rule` TR-4.2: 320px width → `#page-duel` parent body → computed overflow-x NOT "scroll" (horizontal overflow yo'q)
  - `rubric` TR-4.3: Mobile visual polish; scale 1-5; anchors 1 = overlaps, 3 = usable, 5 = professional app-like spacing, readable, great touch; threshold >= 4
  - `rubric` TR-4.4: Desktop unchanged; scale 1-5; anchors 1 = desktop broken, 3 = minor padding, 5 = 100% desktop look unchanged (no visual regressions); threshold >= 5
- **Notes**: Mavjud `style.css` @media (max-width:768px) sectionga qo'shimcha duel-specific rules yoki `mobile.css` ichidagi duel sectionni kengaytirish. Ikki fayldan birini tanlang (desktop unchanged tamoyiliga asosan). Preferred: mobile.css ichidagi 9. DUEL PAGE sectionni kengaytirish — desktop style.css untouched.

## Task 5: mobile.css — Mobile History Card Styles (agar Task 3 yozilsa)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 3, Task 4
- **Description**:
  - `.duel-history-card-item` uslubi: padding 12px, border 1px var(--border), radius sm, gap 6px, flex-col, item justify wrap
  - Status badge (win/loss/draw) pill-shaped right aligned
  - Score row bold
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-5.1: 375px width → har bir card item computed width ≤ 350px (no overflow)
  - `rubric` TR-5.2: History card visual; scale 1-5; anchors 1 = misaligned, 3 = okay, 5 = clean; threshold >= 4

## Task 6: Smoke Test — Bot Duel Full Round (Regression)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 4
- **Description**:
  - Manual automated-ish: node jsdom emas, browser flow test. Server ni run qilib, smoke script ichida button click, state snapshots, check:
    1. Bot mode Easy select → Start → Matchmaking seen → Opponent found → 6 rounds play (randomly select answers or select D/C option) → duelResult seen → Back to lobby → duelHistory length +1 → duelTotal +1
  - Ya'ni 0 → 1 history record ga o'zgarish borligini check.
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-6.1: Bot duel 1 → after back: localStorage `currentUser.duelHistory.length` oldingisidan 1 ko'p
  - `rule` TR-6.2: Bot mode Hard → 1 duel → `player2.difficulty === 'hard'` saved in duelHistory last entry
- **Notes**: Agar browserda manual bo'lsa, scratch/duel-smoke.cjs yangi fayl yaratish mumkin yoki existing runtime-smoke ga append. Agar faqat manual, screenshot + evidence.

## Task 7: Smoke Test — Real Player (Search → Cancel, Search → Timeout → Bot, Hot-Seat 2P Full Round)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 6
- **Description**:
  - Test 1: 👥 Raqib qidirish → Cancel → lobby (no state mutation, 0 history add)
  - Test 2: 👥 Raqib qidirish → timeout 12s → Ha → bot duel starts → result → history 1 add
  - Test 3: 🎮 Hot-Seat 2P → full 6 rounds → both players answer (use buttons / keyboard both) → result → history add
  - Test 4: 🎮 Hot-Seat 2P → no clicks 10s timeout → round passes, next question (no hang)
  - Test 5: 🎮 Hot-Seat 2P → reach 6-0 score → next step → result (early win, not 6 questions)
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-10
- **Test Requirements**:
  - `rule` TR-7.1: Cancel test → history count unchanged
  - `rule` TR-7.2: Timeout → Ha → result → history count +1
  - `rule` TR-7.3: Hot-Seat timeout hang test → currentIndex increases
  - `rule` TR-7.4: Hot-Seat early win → result screen at score >=6 BEFORE round 6
  - `rubric` TR-7.5: 5 testlar coverage; scale 1-5; anchors 1 = 2 pass, 3 = 4 pass, 5 = all 5 pass; threshold >= 5

## Task 8: Mobile UI Manual Test & Build/Lint/Diagnostic
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4, Task 5, Task 6, Task 7
- **Description**:
  - DevTools Device Mode 320px, 375px, 412px, 430px — barcha pages:
    1. Lobby (fan select, 3 chips, difficulty, start button) → horizontal scroll? NO
    2. Matchmaking → cancel button visible
    3. Duel gameplay → TOW, question, options ≥ 48px
    4. Result → players/rewards
    5. History → no horizontal overflow
  - GetDiagnostics → no lint errors
  - Package.json build/lint/typecheck mavjud bo'lsa run qilish
- **Acceptance Criteria Addressed**: AC-6, AC-7, AC-8
- **Test Requirements**:
  - `rule` TR-8.1: 320px da horizontal scroll (page scrollbar x) → none. Visual check: document.documentElement.scrollWidth == clientWidth (±2)
  - `rule` TR-8.2: `GetDiagnostics` → 0 errors, 0 warnings (type issues) OR project test command pass
  - `rubric` TR-8.3: UI Professional look & feel (app-like); scale 1-5; anchors 1 = looks like desktop shrunk, 3 = okay, 5 = native app-like duel screen, clean spacing, touch friendly, status messages crisp; threshold >= 4
