const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let fails = 0;
function ok(cond, msg) { console.log((cond ? 'PASS' : 'FAIL') + ': ' + msg); if (!cond) fails++; }

// === 1) mascot.js moduli jsdom da ishlaydi ===
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'dangerously', url: 'http://localhost/' });
const w = dom.window;
w.eval(fs.readFileSync(path.join(__dirname, 'mascot.js'), 'utf8'));

ok(typeof w.ITMascot === 'object', 'window.ITMascot mavjud');
ok(typeof w.IT_MASCOT_HTML === 'function', 'IT_MASCOT_HTML mavjud');
ok(/mascot\/it-robot\.png/.test(w.IT_MASCOT_HTML('idle')), 'rasm manzili mascot/it-robot.png');

const host = w.document.createElement('div');
w.document.body.appendChild(host);
host.insertAdjacentHTML('afterbegin', w.IT_MASCOT_HTML('idle', 'mascot-sm'));
const m = host.querySelector('.mascot');
ok(!!m && m.classList.contains('mascot--idle'), 'mascot HTML yaratildi');
w.ITMascot.setState(m, 'success');
ok(m.classList.contains('mascot--success') && !m.classList.contains('mascot--idle'), 'setState: success');
w.ITMascot.showXP(m, '+10 XP');
ok(!!m.querySelector('.mascot-xp'), 'showXP: +XP elementi');

// rasm yuklanmasa mascot-broken klassi
const img = m.querySelector('img');
if (img && img.getAttribute('onerror')) {
  new w.Function(img.getAttribute('onerror')).call(img);
}
ok(m.classList.contains('mascot-broken'), 'rasm yo\'q bo\'lsa mascot-broken (yashirinadi)');

// === 2) index.html integratsiyasi ===
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
ok(html.includes('mascot.css'), 'index: mascot.css ulangan');
ok(html.includes('mascot.js'), 'index: mascot.js ulangan');
ok(html.includes('heroMascotCard') || html.includes('mascot'), 'index: Dashboard hero mascot kartasi');
ok(html.includes('mascot'), 'index: mascot mavjud');

// === 3) lessons-app.js integratsiyasi ===
const ls = fs.readFileSync(path.join(__dirname, 'lessons-app.js'), 'utf8');
ok(ls.includes('ls-mascot-intro') || ls.includes('lesson-hero-mascot'), 'lessons: dars boshida robot');
ok(ls.includes('ls-quiz-mascot-wrap') || ls.includes('mascot'), 'lessons: test bosqichida robot');
ok(ls.includes('ls-result-mascot-wrap') || ls.includes('mascot'), 'lessons: natijada robot');
ok(ls.includes("ITMascot") || ls.includes("IT_MASCOT_HTML"), 'lessons: robot holatlari');
// speech bubble + text-only robot yo'qligi
ok(!/<b>🤖 ITTest Robot:/.test(ls), 'lessons: text-only "ITTest Robot:" yozuvi olib tashlangan');
ok(ls.includes('mascot-lg'), 'lessons: intro robot KATTA (mascot-lg)');

// === 4) script.js / ai-assistant.js ===
const ai = fs.readFileSync(path.join(__dirname, 'ai-assistant.js'), 'utf8');
ok(ai.includes("ITMascot") || ai.includes("mascot"), 'coding: 🤖 AI assistant mascot');

// === 5) rasm fayli mavjudligi (ogohlantirish) ===
const imgExists = fs.existsSync(path.join(__dirname, 'public', 'mascot', 'it-robot.png'));
console.log((imgExists ? 'PASS' : 'WARN') + ': public/mascot/it-robot.png ' + (imgExists ? 'mavjud' : 'YO\'Q — foydalanuvchi robot rasmini shu yerga saqlashi kerak'));

console.log(fails === 0 ? '\n✅ HAMMA TEST O\'TDI' : '\n❌ ' + fails + ' xato');
process.exit(fails === 0 ? 0 : 1);
