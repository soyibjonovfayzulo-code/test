/* Haqiqiy DOM event test — lessons-app drag&drop + lock logic (jsdom) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;

let errors = [];
window.addEventListener('error', function (e) { errors.push('window.onerror: ' + e.message); });
window.console.error = function () { errors.push('console.error: ' + Array.from(arguments).join(' ')); };

// Minimal localStorage mock (jsdom has it, but be safe)
const store = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: function (k) { return store[k] == null ? null : store[k]; },
    setItem: function (k, v) { store[k] = String(v); },
    removeItem: function (k) { delete store[k]; },
    clear: function () { for (const k in store) delete store[k]; }
  }, configurable: true
});

// Load modules as plain scripts (they are ES modules — wrap imports out)
let dataSrc = fs.readFileSync(path.join(__dirname, 'lessons-data.js'), 'utf8');
let appSrc = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
// strip ESM import/export statements
dataSrc = dataSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, 'window.LESSONS_DATA = ').replace(/export\s+/gm, '');
appSrc = appSrc.replace(/^\s*import[\s\S]*?;\s*$/gm, '').replace(/export\s+default\s+/m, '').replace(/export\s+/gm, '');
try { window.eval(dataSrc); } catch (e) { errors.push('lessons-data eval: ' + e.message); }
try { window.eval(appSrc); } catch (e) { errors.push('lessons-app eval: ' + e.message); }
console.log('appSrc has data-chip-idx:', appSrc.indexOf('data-chip-idx') !== -1, 'len', appSrc.length);

function fire(el, type, opts) {
  const ev = new window.Event(type, Object.assign({ bubbles: true, cancelable: true }, opts || {}));
  el.dispatchEvent(ev);
}
function fireDrag(el, type, dataTransfer) {
  const ev = new window.Event(type, { bubbles: true, cancelable: true });
  ev.dataTransfer = {
    _data: {},
    setData: function (t, v) { this._data[t] = v; },
    getData: function (t) { return this._data[t] || ''; },
    effectAllowed: null, dropEffect: null
  };
  el.dispatchEvent(ev);
}

let pass = 0, fail = 0;
function assert(name, cond) {
  if (cond) { console.log('  PASS ' + name); assert.count++; }
  else { console.log('  FAIL ' + name); fail++; }
}

const course = window.CoursesAPI.listCourses()[0];
console.log('courses found:', !!course);
const lesson = course.lessons
  ? course.lessons.find(function (l) { return (l.content && l.content.exercises || []).some(function (e) { return e.id === 'ex2'; }); })
  : (course.topics || []).flatMap(function (t) { return t.lessons || []; })
      .find(function (l) { return (l.content && l.content.exercises || []).some(function (e) { return e.id === 'ex2'; }); });
console.log('lesson found:', !!lesson, lesson && lesson.id);

// Navigate to lesson via app API
window.Lessons.openCourse(course.id);
window.Lessons.openLesson(course.id, lesson.id);

const pool = window.document.querySelector('#lsDndPool-ex2');
const zone = window.document.querySelector('#lsDndZone-ex2');
if (!pool || !zone) {
  console.log('FAIL: dnd markup not found (pool=' + !!pool + ' zone=' + !!zone + ')');
  fail++;
  process.exit(1);
}
assert('pool chips rendered (shuffled)', pool.querySelectorAll('[data-chip-idx]').length === 9);
assert('empty drop slot present', !!zone.querySelector('.ls-dnd-slot-empty'));
assert('hint tree shown', !!pool.querySelector('.ls-dnd-hint-box') && /├── head/.test(pool.querySelector('.ls-dnd-hint-tree').textContent));
assert('hint does NOT leak answer', !/<\/head>/.test(pool.querySelector('.ls-dnd-hint-box').textContent));

// --- MOBILE SCENARIO: tap chip -> tap slot, in EXPECTED order ---
const items = ['<!DOCTYPE html>', '<html>', '<head>', '<title>Mening saytim</title>', '</head>', '<body>', '<h1>Salom!</h1>', '</body>', '</html>'];
console.log('pool texts:', Array.from(pool.querySelectorAll('[data-chip-idx]')).map(function (c) { return JSON.stringify(c.textContent); }));
const dbgChip = pool.querySelector('[data-chip-idx]');
console.log('dbg innerHTML:', JSON.stringify(dbgChip && dbgChip.innerHTML));
console.log('dbg data attr:', dbgChip && dbgChip.getAttribute('data-chip-idx'));
for (const text of items) {
  const chip = Array.from(pool.querySelectorAll('[data-chip-idx]')).find(function (c) { return c.textContent === text; });
  if (!chip) { console.log('FAIL chip not found: ' + text); fail++; break; }
  fire(chip, 'click'); // select
  const freshChip = Array.from(pool.querySelectorAll('[data-chip-idx]')).find(function (c) { return c.textContent === text; });
  assert('chip selected class: ' + text, !!freshChip && freshChip.classList.contains('selected'));
  const slot = zone.querySelector('.ls-dnd-slot-empty');
  fire(slot, 'click'); // place at next position
}
assert('all 9 placed', pool.querySelectorAll('[data-chip-idx]').length === 0);
const slotsAfter = zone.querySelectorAll('.ls-dnd-slot');
assert('9 slots in zone', slotsAfter.length === 9);
const placedTexts = Array.from(slotsAfter).map(function (s) {
  const clone = s.cloneNode(true);
  const num = clone.querySelector('.ls-dnd-num'); if (num) num.remove();
  const rm = clone.querySelector('.ls-dnd-remove'); if (rm) rm.remove();
  return clone.textContent.trim();
});
assert('order text correct', placedTexts.join('|') === items.join('|'));

// Tekshirish
const checkBtn = window.document.querySelector('[data-ex-check="ex2"]');
fire(checkBtn, 'click');
const fb = window.document.querySelector('#lsExFb-ex2');
assert('feedback shows success', /Ajoyib!/i.test(fb.textContent));
assert('tracker shows Mashq 2 done', /Mashq 2\s*✅/.test(window.document.querySelector('#lsExTracker').textContent));
// test lock footer should be unlocked now? (ex3 still pending -> still locked; just ensure hint exists)
console.log('MOBILE SCENARIO DONE');

// --- DESKTOP DRAG SCENARIO (reset -> dragstart/dragover/drop in expected order) ---
const resetBtn = window.document.querySelector('[data-ex-reset="ex2"]');
fire(resetBtn, 'click');
assert('reset: pool has 9 chips', pool.querySelectorAll('[data-chip-idx]').length === 9);
console.log('after-reset texts:', JSON.stringify(Array.from(pool.querySelectorAll('[data-chip-idx]')).map(function (c) { return c.textContent; })));
for (const text of items) {
  const chip = Array.from(pool.querySelectorAll('[data-chip-idx]')).find(function (c) { return c.textContent === text; });
  if (!chip) { console.log('FAIL drag chip not found: ' + text); fail++; break; }
  fireDrag(chip, 'dragstart');
  assert('dragging class on: ' + text, chip.classList.contains('dragging'));
  const slot = zone.querySelector('.ls-dnd-slot-empty');
  fireDrag(slot, 'dragover');
  assert('slot highlighted on dragover', slot.classList.contains('over'));
  fireDrag(slot, 'drop');
  fire(window.document, 'dragend');
  assert('chip placed & removed from pool: ' + text, !Array.from(pool.querySelectorAll('[data-chip-idx]')).some(function (c) { return c.textContent === text; }));
}
const dSlots = zone.querySelectorAll('.ls-dnd-slot');
const dTexts = Array.from(dSlots).map(function (s) {
  const clone = s.cloneNode(true);
  const num = clone.querySelector('.ls-dnd-num'); if (num) num.remove();
  const rm = clone.querySelector('.ls-dnd-remove'); if (rm) rm.remove();
  return clone.textContent.trim();
});
assert('desktop drag: 9 slots', dSlots.length === 9);
assert('desktop drag: correct order', dTexts.join('|') === items.join('|'));
fire(window.document.querySelector('[data-ex-check="ex2"]'), 'click');
assert('desktop drag: exercise completed', /Ajoyib!/i.test(window.document.querySelector('#lsExFb-ex2').textContent));
assert('desktop drag: success animation class', zone.classList.contains('success'));

// --- WRONG ORDER SCENARIO: noto'g'ri tartib -> fail, xato pozitsiya ko'rsatiladi ---
fire(window.document.querySelector('[data-ex-reset="ex2"]'), 'click');
const poolChips = Array.from(pool.querySelectorAll('[data-chip-idx]'));
// 2-mashq items teskari tartibda joylaymiz
const reversed = items.slice().reverse();
for (const text of reversed) {
  const chip = Array.from(pool.querySelectorAll('[data-chip-idx]')).find(function (c) { return c.textContent === text; });
  if (!chip) { console.log('FAIL reverse chip not found: ' + text); fail++; break; }
  fire(chip, 'click');
  fire(zone.querySelector('.ls-dnd-slot-empty'), 'click');
}
fire(window.document.querySelector('[data-ex-check="ex2"]'), 'click');
assert('wrong order: marked not done', /noto‘g‘ri|Xato/i.test(window.document.querySelector('#lsExFb-ex2').textContent));
assert('wrong order: shows wrong positions', /o‘rin/.test(window.document.querySelector('#lsExFb-ex2').textContent));
assert('wrong order: wrong slots highlighted', zone.querySelectorAll('.ls-dnd-slot.wrong').length > 0);
assert('wrong order: no full answer leaked', !/9-o‘rin(lar)?<\/b>\. kutilgan to‘liq/i.test(window.document.querySelector('#lsExFb-ex2').textContent));
// Reset ishlaydi: success/wrong tozalanadi
fire(window.document.querySelector('[data-ex-reset="ex2"]'), 'click');
assert('reset clears success class', !zone.classList.contains('success'));
assert('reset repopulates pool', pool.querySelectorAll('[data-chip-idx]').length === 9);

console.log('\nconsole errors: ' + errors.length);
errors.slice(0, 5).forEach(function (e) { console.log('ERR: ' + e); });
console.log((fail === 0 && errors.length === 0) ? '\nALL CHECKS PASSED' : '\nCHECKS FAILED');
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
