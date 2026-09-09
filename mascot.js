/* ==========================================================
   ITTest MASCOT — Robot maskot moduli (3D Mascot Engine)
   Bitta rasm: ./mascot/it-robot.png (public/mascot/it-robot.png)
   Futuristik neon platforma + tirik ko'z animatsiyalari
   ========================================================== */

const MASCOT_SRC = './mascot/it-robot.png';

const STATES = ['idle', 'thinking', 'error', 'success', 'complete', 'rocket', 'newLesson', 'xp'];

/** Mascot HTML — JS string ichiga qo'shish uchun */
function mascotHTML(state, extraCls) {
  const normState = (state === 'newLesson' ? 'rocket' : (state || 'idle'));
  return '<div class="mascot mascot--' + normState + (extraCls ? ' ' + extraCls : '') + '">' +
    '<div class="mascot-body">' +
      '<img src="' + MASCOT_SRC + '" alt="ITTest Robot" draggable="false" loading="lazy" ' +
      'onerror="this.closest(\'.mascot\')&&this.closest(\'.mascot\').classList.add(\'mascot-broken\')">' +
      '<div class="mascot-eyes" aria-hidden="true">' +
        '<span class="mascot-eye mascot-eye--l"></span>' +
        '<span class="mascot-eye mascot-eye--r"></span>' +
      '</div>' +
    '</div>' +
    '<div class="mascot-platform" aria-hidden="true">' +
      '<span class="mascot-platform-glow"></span>' +
      '<span class="mascot-platform-ring"></span>' +
      '<span class="mascot-platform-base"></span>' +
    '</div>' +
  '</div>';
}

/** Element ichiga mascot qo'shish (mavjud bo'lmasa) */
function inject(parent, state, extraCls) {
  if (!parent) return null;
  let el = parent.querySelector(':scope > .mascot');
  if (!el) {
    parent.insertAdjacentHTML('afterbegin', mascotHTML(state, extraCls));
    el = parent.querySelector(':scope > .mascot');
  } else {
    setState(el, state);
  }
  return el;
}

/** Holatni o'zgartirish */
function setState(el, state) {
  if (!el) return;
  STATES.forEach(s => el.classList.remove('mascot--' + s));
  let normState = state;
  if (normState === 'newLesson') normState = 'rocket';
  if (!STATES.includes(normState)) normState = 'idle';
  
  if (state === 'xp') {
    showXP(el, '+10 XP');
  }
  
  // animatsiyani qayta ishga tushirish
  el.classList.remove('mascot--' + normState);
  void el.offsetWidth;
  el.classList.add('mascot--' + normState);
}

/** Sahifadagi (container ichidagi) birinchi mascota holatini o'zgartirish */
function setStateIn(container, state) {
  const el = container && container.querySelector('.mascot');
  if (el) setState(el, state);
  return !!el;
}

/** ⭐ +XP yuqoriga uchishi */
function showXP(el, text) {
  if (!el) return;
  const span = document.createElement('span');
  span.className = 'mascot-xp';
  span.textContent = '⭐ ' + (text || '+10 XP');
  el.appendChild(span);
  setTimeout(() => span.remove(), 1400);
}

/** 🗨 Speech bubble (foydalanuvchi talabi bo'yicha toza vizual uchun yashiringan) */
function say(el, text) {
  if (!el) return;
  const b = el.querySelector(':scope > .mascot-bubble');
  if (b) b.remove();
}

window.ITMascot = { STATES, html: mascotHTML, inject, setState, setStateIn, showXP, say, src: MASCOT_SRC };
window.IT_MASCOT_HTML = mascotHTML;
