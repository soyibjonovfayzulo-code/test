/* PROFILE REDESIGN — REAL TEST (jsdom)
   Run: node profile-check.cjs
   Tekshiriladi: profil render, mastery real data, achievements,
   real photo avatar, edit modal, validatsiya, server fetch oqimi.
*/
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const profileSrc = fs.readFileSync(path.join(root, 'profile.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://ittest.test/' });
const w = dom.window;
const doc = w.document;

/* ---- Mock user state (real users[] localStorage modeli) ---- */
const USERS = [
  { id: 'u1', firstname: 'Ahatjon', lastname: 'Soyibjonov', username: 'ahatjon', email: 'a@mail.com', bio: 'Test bio', avatar: '🤖', xp: 280, points: 280, level: 3, joinedAt: Date.now() - 86400000 * 30, photoUrl: null,
    testResults: [
      { subject: 'HTML', percent: 80, score: 40, passed: true, timestamp: Date.now() },
      { subject: 'HTML', percent: 90, score: 45, passed: true, timestamp: Date.now() },
      { subject: 'CSS', percent: 60, score: 30, passed: true, timestamp: Date.now() },
      { subject: 'JavaScript', percent: 40, score: 20, passed: false, timestamp: Date.now() }
    ],
    achievements: ['first_test', 'pass_ten'], store: { inventory: [], equipped: {} } },
  { id: 'u2', firstname: 'Sarah', lastname: 'Kim', username: 'sarah_k', email: 's@mail.com', bio: '', avatar: '🦊', photoUrl: null }
];
w.localStorage.setItem('users', JSON.stringify(USERS));

let currentUser = USERS[0];
w.__itGetCurrentUser = () => currentUser;
w.__itSaveUserState = () => { w.__savedUserState = true; };
w.__itShowPage = (name) => { w.__lastPage = name; };
w.__itGetActiveAvatar = (u) => (u && u.avatar) || '🧑‍🎓';
w.__itRefreshAvatarUI = () => { w.__avatarRefreshed = true; };
w.__itGetSubjects = () => [
  { name: 'HTML', icon: '🌐' }, { name: 'CSS', icon: '🎨' }, { name: 'JavaScript', icon: '⚡' },
  { name: 'Python', icon: '🐍' }, { name: 'Java', icon: '☕' }, { name: 'C++', icon: '🔧' },
  { name: 'C#', icon: '🔷' }, { name: 'SQL', icon: '🗄' }, { name: 'AI', icon: '🤖' }
];
w.__itAchievements = [
  { id: 'first_test', icon: '🥇', name: 'Birinchi test', desc: '1 ta testdan oting' },
  { id: 'pass_ten', icon: '✅', name: '10 ta Passed', desc: '10 ta testdan oting' },
  { id: 'lv3', icon: '⭐', name: 'Level 3', desc: '3-levelga chiqing' },
  { id: 'streak3', icon: '🔥', name: '3 kunlik streak', desc: '3 kun streak' }
];
w.__itGetStoreInfo = () => ({ equipped: { hat: 'hat_basic' }, inventoryCount: 1, points: 280 });
w.__itStoreItem = (id) => (id === 'hat_basic' ? { id: 'hat_basic', icon: '🎩', name: '🎩 Basic Hat' } : null);
w.showToast = (msg, type) => { w.__lastToast = { msg, type }; };
w.openModal = (sel) => { const el = doc.querySelector(sel); if (el) el.classList.add('active'); };
w.closeModal = (sel) => { const el = doc.querySelector(sel); if (el) el.classList.remove('active'); };

/* Mock fetch — stateful server API simulyatsiyasi */
const fetchLog = [];
w.fetch = function (url, opts) {
  const entry = { url: String(url), method: (opts && opts.method) || 'GET', body: opts && opts.body ? JSON.parse(opts.body) : null, headers: (opts && opts.headers) || {} };
  fetchLog.push(entry);
  const isGet = entry.method === 'GET' && entry.url.indexOf('/api/profile/image/') !== -1;
  const hasPhoto = !!USERS[0].photoUrl;
  return Promise.resolve({
    ok: !(isGet && !hasPhoto),
    json: () => Promise.resolve(
      (isGet && !hasPhoto)
        ? { error: 'Profil rasmi topilmadi' }
        : { success: true, url: entry.method === 'POST' ? '/uploads/profile/u1/mock-' + fetchLog.length + '.jpg' : USERS[0].photoUrl, updatedAt: new Date().toISOString() }
    )
  });
};

w.eval(profileSrc);
if (doc.readyState === 'loading') {
  doc.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true }));
}

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }
function click(el) { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); }
const $ = (sel) => doc.querySelector(sel);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* == CHECKS == */
(async () => {
  section('1. Profil render');
  doc.querySelector('#page-profile').classList.add('active');
  w.ITProfile.render();
  await sleep(50);
  const rootHTML = $('#profileRoot').innerHTML;
  ok(rootHTML.includes('Ahatjon') && rootHTML.includes('Soyibjonov'), 'Header: ism/familiya ko\u2018rinadi');
  ok(rootHTML.includes('@ahatjon'), 'Header: @username ko\u2018rinadi');
  ok(rootHTML.includes('Test bio'), 'Header: bio ko\u2018rinadi');
  ok(rootHTML.includes('pf-cam'), 'Camera tugmasi mavjud');
  ok(rootHTML.includes('Profilni tahrirlash'), 'Edit tugmasi mavjud');

  section('2. Mastery (real data)');
  ok(rootHTML.includes('Mastery System'), 'Mastery kartasi bor');
  ok(/HTML[\s\S]{0,700}?85%/.test(rootHTML), 'HTML mastery = 85% ((80+90)/2 real hisob)');
  ok(/CSS[\s\S]{0,700}?60%/.test(rootHTML), 'CSS mastery = 60% (real)');
  ok(/JavaScript[\s\S]{0,700}?40%/.test(rootHTML), 'JavaScript mastery = 40% (real)');

  click($('#pfMasteryBtn'));
  const mbody = $('#pfMasteryBody').innerHTML;
  ok(mbody.includes('85%') && mbody.includes('2 test'), 'Mastery detail: 85% + 2 test (real attempts)');
  ok($('#pfMasteryModal').classList.contains('active'), 'Mastery modal ochildi');

  section('3. Achievements (real hisob)');
  ok(rootHTML.includes('2/4'), 'Achievement preview 2/4 (real)');
  ok(rootHTML.includes('\u{1F947}'), 'Ochildi: 🥇 icon ko\u2018rinadi');
  ok(rootHTML.includes('\uD83D\uDD12'), 'Yopiq achievementlar 🔒 bilan');

  section('4. Real photo avatar');
  ok(!rootHTML.includes('pf-avatar-img'), 'Rasm yuklanmagan — img YO\u2018Q (fallback)');
  ok(rootHTML.includes('pf-avatar-fallback'), 'Fallback avatar mavjud (broken image yo\u2018q)');
  currentUser.photoUrl = '/uploads/profile/u1/mock-1.jpg';
  w.ITProfile.render();
  ok($('#profileRoot').innerHTML.includes('pf-avatar-img'), 'photoUrl bor — <img> render bo\u2018ldi');
  ok($('#profileRoot').innerHTML.includes('mock-1.jpg'), 'Img src server URL');

  section('5. Edit modal');
  click($('#pfEditBtn'));
  ok($('#editProfileModal').classList.contains('active'), 'Edit modal ochildi');
  ok($('#editFirstname').value === 'Ahatjon', 'Ism maydoni to\u2018ldirildi');
  ok($('#editBio').value === 'Test bio', 'Bio maydoni to\u2018ldirildi');
  $('#editBio').value = 'Yangi bio';
  click($('#editProfileSave'));
  await sleep(400);
  ok(USERS[0].bio === 'Yangi bio', 'Bio user state\u2018ga saqlandi (real users[])');
  ok(w.__savedUserState === true, 'saveUserState chaqirildi');
  ok(!$('#editProfileModal').classList.contains('active'), 'Modal yopildi');
  ok(w.__lastToast && w.__lastToast.msg.indexOf('Profil yangilandi') !== -1, 'Success toast: "✅ Profil yangilandi"');

  click($('#pfEditBtn'));
  $('#editUsername').value = 'sarah_k';
  click($('#editProfileSave'));
  await sleep(400);
  ok(w.__lastToast && w.__lastToast.msg.indexOf('band') !== -1, 'Band username rad etildi');

  section('6. Rasm validatsiya');
  const V = w.ITProfile._test;
  ok(V.validateFile({ size: 6 * 1024 * 1024, type: 'image/jpeg', name: 'x.jpg' }).indexOf('5 MB') !== -1, '5MB+ rasm rad etildi');
  ok(V.validateFile({ size: 1000, type: 'image/svg+xml', name: 'x.svg' }).indexOf('quvvatlanmaydi') !== -1, 'SVG mime rad etildi');
  ok(V.validateFile({ size: 1000, type: 'image/png', name: 'ok.png' }) === null, 'PNG qabul qilindi');
  ok(V.validateFile({ size: 1000, type: 'image/webp', name: 'ok.webp' }) === null, 'WEBP qabul qilindi');

  section('7. Remove oqimi (DELETE + confirm)');
  click($('#pfEditRemoveBtn'));
  ok($('#pfRemoveConfirmModal').classList.contains('active'), 'Remove confirm modal ochildi');
  ok($('#pfRemoveConfirmModal').textContent.indexOf('olib tashlaysizmi') !== -1, 'Confirm matni mavjud');
  click($('#pfRemoveConfirmBtn'));
  await sleep(150);
  const delCall = fetchLog.find(f => f.method === 'DELETE');
  ok(!!delCall && delCall.url.indexOf('/api/profile/image/') !== -1, 'DELETE /api/profile/image/<uid> yuborildi');
  ok(!!delCall && delCall.headers['x-it-uid'] === 'u1', 'x-it-uid header user id bilan');
  ok(USERS[0].photoUrl === null, 'photoUrl null bo\u2018ldi (default avatar qaytadi)');

  section('8. Server fetch (GET sync)');
  fetchLog.length = 0;
  w.ITProfile.render();
  await sleep(150);
  ok(fetchLog.some(f => f.method === 'GET' && f.url.indexOf('/api/profile/image/') !== -1), 'GET /api/profile/image/<uid> render paytida chaqirildi');

  console.log('\n========================================');
  console.log('PASS: ' + passed + ' | FAIL: ' + failed);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('TEST CRASH:', e); process.exit(1); });
