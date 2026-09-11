/* AUTH REDESIGN CHECK: yangi premium auth UI ustida mavjud auth logic testi */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'),
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window, doc = w.document;
let failed = 0;
const ok = (c, l, x) => { console.log((c ? '  ✅ ' : '  ❌ ') + l + (c ? '' : ' — ' + (x || ''))); if (!c) failed++; };
w.showToast = (m, t) => { w.__lastToast = { m, t }; };
w.confirm = () => true;
w.addEventListener('error', e => { console.log('WINDOW ERR:', e.message); failed++; });

for (const f of ['lessons-data.js', 'script.js', 'auth-fx.js']) {
  try { w.eval(fs.readFileSync(f, 'utf8')); } catch (e) { console.log('EVAL FAIL ' + f + ':', e.message); failed++; }
}
doc.dispatchEvent(new w.Event('DOMContentLoaded'));

console.log('\n[STRUCTURE]');
ok(!!doc.getElementById('authScreen'), '#authScreen mavjud');
ok(doc.querySelectorAll('#authScreen .auth-robot').length === 1, 'Robot qatlami bor');
ok(doc.querySelectorAll('#authScreen .tech-chip').length === 9, '9 floating chip bor');
ok(doc.querySelectorAll('#authScreen .pwd-toggle').length === 3, '3 parol eye-toggle bor');
ok(doc.querySelectorAll('#authScreen .input-shell .input-ico').length === 5, '5 input ikonkasi bor');
ok(doc.getElementById('authThemeToggle') !== null, 'auth tema tugmasi bor');
ok(doc.querySelector('#authScreen .auth-tab[data-tab="login"]') !== null, 'Kirish tab bor');
ok(doc.querySelector('#authScreen .auth-tab[data-tab="register"]') !== null, 'Register tab bor');

console.log('\n[PASSWORD VISIBILITY]');
const loginPwd = doc.getElementById('loginPassword');
const loginEye = doc.querySelector('.pwd-toggle[data-target="loginPassword"]');
ok(loginPwd.type === 'password', 'Boshlanishida parol yashirin', loginPwd.type);
loginEye.click();
ok(loginPwd.type === 'text', 'Eye click → ko‘rinadi', loginPwd.type);
loginEye.click();
ok(loginPwd.type === 'password', 'Eye click → yashirin', loginPwd.type);

console.log('\n[TABS]');
const regTab = doc.querySelector('.auth-tab[data-tab="register"]');
regTab.click();
ok(doc.getElementById('registerForm').classList.contains('active'), 'Register tab → registerForm aktiv');
ok(!doc.getElementById('loginForm').classList.contains('active'), 'loginForm yashirildi');
doc.querySelector('.auth-tab[data-tab="login"]').click();
ok(doc.getElementById('loginForm').classList.contains('active'), 'Kirish tab → loginForm aktiv');

console.log('\n[REGISTER + LOGIN FLOW]');
doc.getElementById('regFirstname').value = 'Test';
doc.getElementById('regLastname').value = 'User';
doc.getElementById('regUsername').value = 'testuser';
doc.getElementById('regEmail').value = 'test@mail.com';
doc.getElementById('regPassword').value = 'parol123';
doc.getElementById('regConfirmPassword').value = 'parol123';
doc.getElementById('registerForm').dispatchEvent(new w.Event('submit', { cancelable: true }));
const users = JSON.parse(w.localStorage.getItem('users') || '[]');
ok(users.some(u => u.username === 'testuser'), 'Ro‘yxatdan o‘tish localStorage ga yozildi');

doc.getElementById('loginEmail').value = 'testuser';
doc.getElementById('loginPassword').value = 'parol123';
doc.getElementById('loginForm').dispatchEvent(new w.Event('submit', { cancelable: true }));
ok(doc.getElementById('authScreen').classList.contains('hidden'), 'Login → authScreen yashirin (app ochildi)');
ok(!doc.getElementById('app').classList.contains('hidden'), 'Login → #app ko‘rinadi');

console.log('\n[THEME TOGGLE — auth-fx]');
const before = doc.documentElement.getAttribute('data-theme');
doc.getElementById('authThemeToggle').click();
const after = doc.documentElement.getAttribute('data-theme');
ok(before !== after, 'Tema almashdi: ' + before + ' → ' + after);
const stored = w.localStorage.getItem('theme');
ok(stored === JSON.stringify(after), 'theme kaliti JSON formatda saqlandi (script.js LS bilan mos)', stored);

console.log('\n[NO CONSOLE ERRORS]');
console.log(failed === 0 ? '\n✅ BARCHA TEKSHIRUVLAR OTDI' : '\n❌ ' + failed + ' xato');
process.exit(failed === 0 ? 0 : 1);