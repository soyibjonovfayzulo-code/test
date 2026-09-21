/**
 * store-e2e.test.cjs — DO'KON modulini real SQLite DB bilan E2E test qiladi.
 *
 * Tekshiriladi:
 *  1. Balans haqiqiy DB'dan olinadi (wallet bootstrap)
 *  2. Katalog server tomondan qaytadi
 *  3. Purchase: server tomonda tasdiqlanadi, narx clientdan kelmaydi
 *  4. Bir itemni qayta sotib olish mumkin emas (409)
 *  5. Balans yetarli emas bo'lsa rad etiladi (402) + atomiklik
 *  6. Purchase'dan keyin balans/inventory darhol yangilanadi
 *  7. Refresh (qayta state so'rash)da ma'lumot saqlanadi
 *  8. Equip/unequip loadout DB'da saqlanadi
 */
'use strict';

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let serverProc;
const PORT = 3056;
const TEST_DB = path.resolve(__dirname, 'store-test.sqlite');

// Test DB ni tozalash
if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

function request(pathname, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: pathname,
      method,
      headers: data ? { 'Content-Type': 'application/json' } : {}
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null }); }
        catch (_) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg);
  console.log('✅ ' + msg);
}

async function runTests() {
  console.log('🚀 Store E2E testlari boshlandi...');

  serverProc = spawn('node', ['server/server.cjs'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: PORT, ADMIN_SECRET: 'test-secret', DB_PATH: TEST_DB },
    stdio: 'pipe'
  });
  await new Promise(r => setTimeout(r, 1800));

  try {
    const USER = { username: 'test_user' };

    // 1. Katalog serverdan qaytadi va narxlar bor
    const catalog = await request('/api/store/catalog');
    assert(catalog.status === 200 && Array.isArray(catalog.data) && catalog.data.length >= 25,
      `1. GET /api/store/catalog OK (${catalog.data.length} ta item)`);
    const hatBasic = catalog.data.find(i => i.id === 'hat_basic');
    assert(hatBasic && hatBasic.price === 100, '1.1 hat_basic narxi DB\u2019dan: 100');

    // 2. State — wallet bootstrap (client 350 ball bilan keldi)
    const state1 = await request('/api/store/state', 'POST', { ...USER, points: 350 });
    assert(state1.status === 200 && state1.data.ok && state1.data.balance === 350,
      '2. Balans DB\u2019dan olinadi (wallet bootstrap: 350)');
    assert(Array.isArray(state1.data.inventory) && state1.data.inventory.length === 0,
      '2.1 Boshlang\u2018ich inventar bo\u2018sh');

    // 3. Purchase — faqat itemId yuboriladi, client price yuborsa ham e'tiborga olinmaydi
    const buy1 = await request('/api/store/purchase', 'POST', { ...USER, itemId: 'hat_basic', points: 350, price: 1 });
    assert(buy1.status === 200 && buy1.data.ok, '3. Purchase server tomonda tasdiqlandi');
    assert(buy1.data.balance === 250, '3.1 Balans darhol yangilandi (350 - 100 = 250, client price=1 e\u2019tiborga olinmadi)');
    assert(buy1.data.inventory.includes('hat_basic'), '3.2 Inventory darhol yangilandi');

    // 4. Qayta sotib olish bloklanadi
    const buy2 = await request('/api/store/purchase', 'POST', { ...USER, itemId: 'hat_basic' });
    assert(buy2.status === 409, '4. Qayta sotib olish rad etildi (409)');

    // 5. Balans yetarli emas + atomiklik
    const buy3 = await request('/api/store/purchase', 'POST', { ...USER, itemId: 'badge_perfect' });
    assert(buy3.status === 402, '5. Balans yetarli emas rad etildi (402)');
    const stateAfterFail = await request('/api/store/state', 'POST', USER);
    assert(stateAfterFail.data.balance === 250 && !stateAfterFail.data.inventory.includes('badge_perfect'),
      '5.1 Atomiklik: muvaffaqiyatsiz xariddan keyin balans/inventar o\u2018zgarmadi');

    // 6. Narxni client o'zgartira olmaydi — server narxi qo'llanadi
    const buy4 = await request('/api/store/purchase', 'POST', { ...USER, itemId: 'glass_cool', price: 1 });
    assert(buy4.status === 200 && buy4.data.balance === 100,
      '6. Tampered price rad etildi — server narxi (250-150=100) qo\u2018llandi');

    // 7. Mavjud bo'lmagan item
    const buy5 = await request('/api/store/purchase', 'POST', { ...USER, itemId: 'fake_item' });
    assert(buy5.status === 404, '7. Noto\u2018g\u2018ri itemId rad etildi (404)');

    // 8. Equip (loadout) — faqat egalik qilingan item
    const equipNotOwned = await request('/api/store/equip', 'POST', { ...USER, itemId: 'clothes_armor' });
    assert(equipNotOwned.status === 403, '8. Egalik qilinmagan item taqilmadi (403)');

    const equip1 = await request('/api/store/equip', 'POST', { ...USER, itemId: 'hat_basic' });
    assert(equip1.status === 200 && equip1.data.equipped.hat === 'hat_basic',
      '8.1 Item taqildi va loadout DB\u2019da saqlandi');

    // 9. Refresh — qayta state so'rashda hammasi saqlangan
    const state2 = await request('/api/store/state', 'POST', USER);
    assert(state2.data.balance === 100, '9. Refresh: balans saqlangan (100)');
    assert(state2.data.inventory.includes('hat_basic') && state2.data.inventory.includes('glass_cool'),
      '9.1 Refresh: inventory saqlangan (2 ta item)');
    assert(state2.data.equipped.hat === 'hat_basic', '9.2 Refresh: loadout saqlangan');

    // 10. Unequip
    const uneq = await request('/api/store/unequip', 'POST', { ...USER, slot: 'hat' });
    assert(uneq.status === 200 && !uneq.data.equipped.hat, '10. Unequip ishlaydi');

    // 11. Noto'g'ri username rad etiladi
    const badUser = await request('/api/store/purchase', 'POST', { username: 'bad user!!', itemId: 'hat_party' });
    assert(badUser.status === 400, '11. Noto\u2018g\u2018ri username rad etildi (400)');

    console.log('\n🎉 BARCHA STORE E2E TESTLARI MUVAFFAQIYATLI O\u2018TDI!');
  } finally {
    if (serverProc) serverProc.kill();
  }
}

runTests().catch(err => {
  console.error('❌ Store E2E Test xatosi:', err.message);
  if (serverProc) serverProc.kill();
  process.exit(1);
});