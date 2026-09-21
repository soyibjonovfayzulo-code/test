# Android Home — CSS/JS Line-by-Line Modernization Map

> Tarang: Rasm ko'rilmadi. Faqat kod tahlili.
> Foydalanuvchi so'ragan: qator-qator ko'rsatish, nima qayerda o'zgarishi kerak.

---

## home-android.css — 10 ta critical o'zgarish

| CSS selector | Qayerda | Nima o'zgarishi kerak |
|---|---|---|
| `#page-home` | 10-13 qat | `background: var(--itt-bg-alt, #F4F8FF)` → `background: var(--itt-bg-alt);` |
| `.ih-quick-card` | 162-176 qat | `background` → `var(--itt-surface-2)`, `border` → `var(--itt-border-strong)`, + hover (desktop only) |
| `.ih-grid-item` | 385-402 qat | `background` → `var(--itt-surface-2)`, `border` → `var(--itt-border-strong)`, + hover (desktop only) |
| `.ih-me` | 407-413 qat | `background` → `var(--itt-surface-2)`, `border` → `var(--itt-border-strong)` |
| `.ih-continue` | 264-273 qat | `background` → gradient + surface-2, `border` → `rgba(37,99,235,0.3)` |
| `.ih-banner` | 205-220 qat | Gradient 3-layer (2 radial + 1 linear), dark-optimal |
| `.ih-search` | 89-99 qat | `+ :focus-within { border-color: primary; box-shadow: ring; }` |
| `.ih-bottomnav button.active` | 497-499 qat | `position: relative;` + `::before { indicator bar }` + `.ih-nav-ico { drop-shadow glow }` |
| Yangi: `@keyframes ihSlideUp` | 508 qat (yangi) | Staggered animation for all sections |
| Yangi: `.ih-progress span[style]` | 323-330 qat (yangi) | `box-shadow: glow on fill` |

## home-android.js — 3 ta o'zgarish

| Function | Qayerda | Nima |
|---|---|---|
| `renderTop()` | 128-133 qat | streak chip + xp chip `textShadow` glow inline |
| `renderAll()` / `observe()` | 271-286 qat | entrance animations trigger (`classList.add` vs `animationend`) |
| `renderContinue()` | 135-167 qat | skeleton loading placeholder before render |

---

## Exact CSS additions (NEW, bold in existing file)

```css
/* AFTER line 25 (after #page-home.active block) */
.ih-search:focus-within {
  border-color: var(--itt-primary, #2563EB);
  box-shadow: 0 0 0 3px var(--itt-primary-soft, rgba(37, 99, 235, 0.14));
}

/* AFTER .ih-quick-card block (after line 202) */
@media (hover: hover) {
  .ih-quick-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--itt-shadow-sm);
    border-color: rgba(37, 99, 235, 0.35);
  }
  .ih-grid-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--itt-shadow-sm);
    border-color: rgba(37, 99, 235, 0.3);
  }
}

/* AFTER .ih-banner block */
.ih-banner-art {
  box-shadow: 0 0 24px rgba(56, 189, 248, 0.3);
}
.ih-progress span {
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.4);
}
.ih-chip--streak b {
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
}
.ih-chip--xp b {
  text-shadow: 0 0 8px rgba(202, 138, 4, 0.4);
}

/* AFTER .ih-bottomnav button:active (after line 499) */
.ih-bottomnav button.active {
  position: relative;
}
.ih-bottomnav button.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 999px;
  background: var(--itt-primary, #2563EB);
}
.ih-bottomnav button.active .ih-nav-ico {
  filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.5));
}

/* NEW: Entrance animation keyframes (NEW block) */
@keyframes ihSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* NEW: Staggered animation triggers (NEW block) */
#page-home.active .ih-top { animation: ihSlideUp 400ms var(--itt-ease-spring) both; }
#page-home.active .ih-search { animation: ihSlideUp 400ms var(--itt-ease-spring) 60ms both; }
#page-home.active .ih-quick { animation: ihSlideUp 400ms var(--itt-ease-spring) 120ms both; }
#page-home.active .ih-banner { animation: ihSlideUp 400ms var(--itt-ease-spring) 180ms both; }
#page-home.active .ih-continue { animation: ihSlideUp 400ms var(--itt-ease-spring) 240ms both; }
#page-home.active .ih-section-title { animation: ihSlideUp 400ms var(--itt-ease-spring) 300ms both; }
#page-home.active .ih-grid { animation: ihSlideUp 400ms var(--itt-ease-spring) 300ms both; }
#page-home.active .ih-me { animation: ihSlideUp 400ms var(--itt-ease-spring) 360ms both; }
```

## Exact JS additions

```js
// IN renderTop() — AFTER streakVal/xpVal textContent set:
if (streakVal) streakVal.style.textShadow = '0 0 8px rgba(56, 189, 248, 0.5)';
if (xpVal) xpVal.style.textShadow = '0 0 8px rgba(202, 138, 4, 0.4)';

// IN observe() — renderAll() ichiga qo'shiladi:
// CSS animations handle entrance; no JS change needed IF CSS @keyframes applied.
// BUT: if renderAll() clears and re-renders content, animation doesn't re-trigger.
// FIX: observe() sync() ichiga qo'sh:
/*
if (active && !sec.dataset.ihAnimated) {
  sec.dataset.ihAnimated = '1';
  // force reflow to trigger animation
  void sec.offsetWidth;
}
*/
```
