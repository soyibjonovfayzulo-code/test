/* PROFILE IMAGE API — REAL E2E TEST
   Run: node profile-server-check.cjs
   Real Express server spawn (PORT=3058) — real fayl storage + SQLite.
   Test uid: selftest-profile (oxirida tozalanadi)
*/
'use strict';
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const PORT = 3058;
const UID = 'selftest-profile';
const UPLOADS = path.join(root, 'server', 'uploads', 'profile', UID);

let serverProc;
let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}
function section(n) { console.log('\n[' + n + ']'); }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function request(pathname, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1', port: PORT, path: pathname, method,
      headers: { ...headers, ...(data ? { 'Content-Type': 'application/json' } : {}) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(body) }); } catch (_) { resolve({ status: res.statusCode, data: body }); } });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/* 1x1 valid PNG */
const PNG_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
/* 6MB buffer PNG magic bilan boshlanadi (hajm limiti testi) */
const bigBuf = Buffer.alloc(6 * 1024 * 1024);
bigBuf[0] = 0x89; bigBuf[1] = 0x50; bigBuf[2] = 0x4E; bigBuf[3] = 0x47;
const PNG_6MB = bigBuf.toString('base64');
/* EXE magic (MZ) */
const EXE_6B = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]).toString('base64');

function cleanup() {
  try { if (fs.existsSync(UPLOADS)) fs.rmSync(UPLOADS, { recursive: true, force: true }); } catch (_) {}
}

(async () => {
  cleanup();
  console.log('🚀 profile-server-check boshlandi (PORT ' + PORT + ')');
  serverProc = spawn('node', ['server/server.cjs'], {
    cwd: root,
    env: { ...process.env, PORT: String(PORT), ADMIN_SECRET: 'test-secret' },
    stdio: 'ignore'
  });
  let up = false;
  for (let i = 0; i < 30 && !up; i++) {
    await sleep(400);
    try { const h = await request('/api/health'); up = h.status === 200; } catch (_) {}
  }
  ok(up, 'Server ishga tushdi (/api/health 200)');
  if (!up) throw new Error('server up bo\'lmadi');

  const H = { 'x-it-uid': UID };

  section('1. POST valid PNG');
  const up1 = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/png;base64,' + PNG_1PX }, H);
  ok(up1.status === 200 && up1.data.success, 'POST -> 200 success');
  ok(typeof up1.data.url === 'string' && up1.data.url.indexOf('/uploads/profile/' + UID + '/') === 0, 'URL /uploads/profile/<uid>/... shaklida: ' + (up1.data.url || ''));

  section('2. GET + static serve');
  const g1 = await request('/api/profile/image/' + UID, 'GET', null, H);
  ok(g1.status === 200 && g1.data.url === up1.data.url, 'GET -> shu URL qaytadi');
  const files = fs.existsSync(UPLOADS) ? fs.readdirSync(UPLOADS) : [];
  ok(files.length === 1, 'Faqat 1 ta fayl diskda (orphan yo\u2018q): ' + files.join(','));
  const staticRes = await new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path: up1.data.url }, (res) => {
      let b = 0; res.on('data', c => b += c.length);
      res.on('end', () => resolve({ status: res.statusCode, bytes: b, type: res.headers['content-type'] }));
    }).on('error', reject);
  });
  ok(staticRes.status === 200 && staticRes.bytes === 70, 'Static /uploads serve 200 (' + staticRes.bytes + ' bayt PNG)');
  section('3. Xavfsizlik rad etishlari');
  const upExe = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/png;base64,' + EXE_6B }, H);
  ok(upExe.status === 400, 'EXE (MZ magic) -> 400 rad');
  const upSvg = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/svg+xml;base64,' + Buffer.from('<svg/>').toString('base64') }, H);
  ok(upSvg.status === 400, 'SVG mime -> 400 rad');
  const upMismatch = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/jpeg;base64,' + PNG_1PX }, H);
  ok(upMismatch.status === 400, 'Mime<->magic mos emas (jpeg deb PNG) -> 400 rad');
  const upBig = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/png;base64,' + PNG_6MB }, H);
  ok(upBig.status === 413, '6MB+ -> 413 rad');
  const upTraversal = await request('/api/profile/image', 'POST', { uid: '../../evil', dataUrl: 'data:image/png;base64,' + PNG_1PX }, H);
  ok(upTraversal.status === 400, 'Path-traversal uid -> 400 rad');
  const upHeaderMismatch = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/png;base64,' + PNG_1PX }, { 'x-it-uid': 'boshqa-user' });
  ok(upHeaderMismatch.status === 403, 'Header uid != body uid -> 403 rad');

  section('4. Almashtirish (replace) — eski fayl o\'chadi');
  const up2 = await request('/api/profile/image', 'POST', { uid: UID, dataUrl: 'data:image/png;base64,' + PNG_1PX }, H);
  ok(up2.status === 200 && up2.data.url !== up1.data.url, 'Yangi URL berildi (cache-friendly)');
  await sleep(300);
  const files2 = fs.existsSync(UPLOADS) ? fs.readdirSync(UPLOADS) : [];
  ok(files2.length === 1, 'Eski fayl o\'chirildi — diskda faqat 1 ta fayl');

  section('5. DELETE + 404');
  const del = await request('/api/profile/image/' + UID, 'DELETE', null, H);
  ok(del.status === 200 && del.data.success, 'DELETE -> 200 success');
  await sleep(300);
  const files3 = fs.existsSync(UPLOADS) ? fs.readdirSync(UPLOADS) : [];
  ok(files3.length === 0, 'Fayl diskdan ham o\'chirildi');
  const g2 = await request('/api/profile/image/' + UID, 'GET', null, H);
  ok(g2.status === 404, 'O\'chirilgach GET -> 404 (default avatar holati)');

  console.log('\n========================================');
  console.log('PASS: ' + passed + ' | FAIL: ' + failed);
  process.exitCode = failed ? 1 : 0;
})().catch(e => {
  console.error('TEST CRASH:', e && e.message);
  process.exitCode = 1;
}).finally(() => {
  cleanup();
  if (serverProc) try { serverProc.kill(); } catch (_) {}
});
