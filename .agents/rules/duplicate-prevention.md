# ORZUTALIM — ARCHITECTURE & CODEBASE INTEGRITY RULES

## 1. Existing File First
- **ONE FEATURE → ONE MAIN IMPLEMENTATION → ONE SOURCE OF TRUTH.**
- Har doim mavjud fayllarni qayta ishlating (re-use existing files).
- Agar kerakli funksiya yoki komponent mavjud bo‘lsa, uni mavjud fayl ichida yangilang yoki kengaytiring.
- Yangi fayl faqat mavjud arxitekturaga to‘g‘ri kelmaydigan yangi mustaqil modul bo‘lsagina yaratiladi.

## 2. No New Duplicates
- Qat'iyan taqiqlanadi:
  - ❌ `*-v2.*`
  - ❌ `*-new.*`
  - ❌ `*-final.*`
  - ❌ `*-probe.*`
  - ❌ `*-check.*`
  - ❌ `*-variant.*`
  - ❌ `*-bak.*`, `*.bak`, `*.tmp`
- Bir xil vazifani bajaruvchi parallel fayllar yaratilmaydi.

## 3. Workflow Before Creating Any File
1. Shu vazifa uchun existing file bormi? (HTML, CSS, JS, backend, test)
2. Existing function yoki komponent bormi?
3. Existing API endpoint bormi?
4. Existing test suite bormi?
- **Agar YES:** Mavjudini yangilang va kengaytiring.
- **Agar NO:** Minimal, standartga mos yangi fayl yarating.

## 4. Temporary / Scratch Policy
- Bir martalik tekshiruvlar yoki scratch fayllar faqat `scratch/` papkasida bo'lishi mumkin.
- Scratch fayllar hech qachon production kodiga qo'shilmaydi va doimiy test sifatida saqlanmaydi.
- Production automated testlar `audit-tests.cjs`, `github-team-bot/test/` yoki `server/*.test.cjs` ichida jamlanadi.
