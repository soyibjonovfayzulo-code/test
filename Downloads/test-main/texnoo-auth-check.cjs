/* ==========================================================
   TEXNOO AUTH & PROFILE SYNC VERIFICATION TEST
   Run: node texnoo-auth-check.cjs
   ========================================================== */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
let passed = 0, failed = 0;

function ok(cond, label) {
  if (cond) {
    passed++;
    console.log('  ✅ ' + label);
  } else {
    failed++;
    console.log('  ❌ ' + label);
  }
}

console.log('\n[1. TEXNOO AUTH MODULE AUDIT]');

const authJs = fs.readFileSync(path.join(root, 'texnoo-auth.js'), 'utf8');
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptSrc = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

ok(/generateCodeChallenge/.test(authJs), 'OWASP PKCE Challenge generatsiyasi mavjud');
ok(/validateState/.test(authJs), 'OWASP CSRF State validatsiyasi mavjud');
ok(/sanitizeProfileData/.test(authJs), 'OWASP XSS sanitizatsiya funksiyasi bor');
ok(/syncUserProfile/.test(authJs), 'Profil sinxronizatsiya funksiyasi bor');

console.log('\n[2. HTML & SCRIPT INTEGRATION AUDIT]');
ok(htmlSrc.includes('texnoo-auth.js'), 'index.html ga texnoo-auth.js ulangan');
ok(htmlSrc.includes('id="texnooAuthBtn"'), 'index.html da Texnoo Auth tugmasi bor');
ok(htmlSrc.includes('id="syncTexnooSettingsBtn"'), 'index.html Settings da Texnoo sinxronlash tugmasi bor');
ok(scriptSrc.includes('TexnooAuth'), 'script.js da TexnooAuth chaqiruvlari ulangan');

console.log('\n[3. JSDOM FUNCTIONALITY TEST]');

const dom = new JSDOM(htmlSrc, {
  runScripts: 'outside-only',
  url: 'https://localhost/'
});

const w = dom.window;

// Setup mock environment
w.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

w.sessionStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

w.showToast = function (msg, type) {
  console.log(`  [TOAST ${type.toUpperCase()}] ${msg}`);
};

w.eval(authJs);

ok(typeof w.TexnooAuth === 'object', 'TexnooAuth global obyekti yaratildi');

const mockState = 'test_state_12345';
w.sessionStorage.setItem('texnoo_state', mockState);

const isValid = w.TexnooAuth.validateState(mockState);
ok(isValid === true, 'CSRF State mosligi to\'g\'ri tasdiqlandi');

const invalidState = w.TexnooAuth.validateState('wrong_state');
ok(invalidState === false, 'CSRF State nomosligi to\'g\'ri rad etildi');

// Test XSS Sanitization
const xssPayload = {
  texnoo_id: 'tx_1122',
  username: '<script>alert(1)</script>',
  email: 'hacker@test.com',
  firstname: '<b>Malicious</b>',
  lastname: 'User',
  avatar: '🚀'
};

const cleanData = w.TexnooAuth.sanitizeProfileData(xssPayload);
ok(cleanData.username.indexOf('<script>') === -1, 'XSS script teglar tozalab tashlandi');
ok(cleanData.firstname.indexOf('&lt;b&gt;') !== -1, 'HTML teglar escape qilindi');

// Test Profile Sync
const syncedUser = w.TexnooAuth.syncUserProfile(xssPayload);
ok(syncedUser !== null && syncedUser.texnooLinked === true, 'Foydalanuvchi Texnoo bilan sinxronlashtirildi');
ok(syncedUser.texnooId === 'tx_1122', 'Texnoo ID profilga saqlandi');

console.log('\n==========================================');
console.log(`  NATIJA: ${passed} o'tdi, ${failed} xato`);
console.log('==========================================');

process.exit(failed ? 1 : 0);
