/**
 * store.cjs — DO'KON modulining server tomonidagi biznes-logikasi.
 *
 * TAMOYILLAR (clientga ishonib qolmaymiz):
 *  - Narx FAQAT server-side katalogdan olinadi (client yuborgan price e'tiborga olinmaydi).
 *  - Balans server DB'da (user_wallet) saqlanadi.
 *  - Purchase atomik tranzaksiyada bajariladi: BEGIN IMMEDIATE → tekshiruvlar →
 *    balans yechish + inventarga qo'shish + audit log → COMMIT (xatolik bo'lsa ROLLBACK).
 *  - Qayta sotib olish DB darajasidagi UNIQUE(user_key, item_id) cheklov bilan ham bloklanadi.
 */
'use strict';

const now = () => new Date().toISOString();

/* ====================== SERVER-SIDE KATALOG (narx manbasi) ====================== */
const STORE_CATALOG = [
  { id: 'avatar_neon', name: '👤 Neon Avatar', type: 'avatar', price: 180, rarity: 'rare', icon: '🧑‍🚀', description: 'Neon qahramon avatari', unlockReq: null },
  // Hats
  { id: 'hat_basic', name: '🎩 Classic Hat', type: 'hat', price: 100, rarity: 'common', icon: '🎩', description: 'Klassik shlyapa', unlockReq: null },
  { id: 'hat_crown', name: '👑 Royal Crown', type: 'hat', price: 300, rarity: 'epic', icon: '👑', description: 'Qirollik toji', unlockReq: null },
  { id: 'hat_wizard', name: '🧙 Wizard Hat', type: 'hat', price: 250, rarity: 'rare', icon: '🧙', description: 'Sehrgar shlyapasi', unlockReq: null },
  { id: 'hat_party', name: '🎉 Party Hat', type: 'hat', price: 150, rarity: 'common', icon: '🎉', description: 'Bayram shlyapasi', unlockReq: null },
  { id: 'hat_golden', name: '💛 Golden Crown', type: 'hat', price: 500, rarity: 'legendary', icon: '💛', description: 'Oltin toj', unlockReq: { type: 'tests', count: 100 } },

  // Glasses
  { id: 'glass_cool', name: '🕶 Cool Glasses', type: 'glasses', price: 150, rarity: 'common', icon: '🕶', description: "Zo'r ko'zoynak", unlockReq: null },
  { id: 'glass_nerd', name: '🤓 Nerd Glasses', type: 'glasses', price: 120, rarity: 'common', icon: '🤓', description: 'Geek ko\u2018zoynagi', unlockReq: null },
  { id: 'glass_star', name: '🌟 Star Glasses', type: 'glasses', price: 200, rarity: 'rare', icon: '🌟', description: 'Yulduzli ko\u2018zoynak', unlockReq: null },
  { id: 'clothes_hoodie', name: '👕 Tech Hoodie', type: 'clothes', price: 220, rarity: 'rare', icon: '🧥', description: 'Texno huddi', unlockReq: null },
  { id: 'clothes_armor', name: '🛡️ Cyber Armor', type: 'clothes', price: 480, rarity: 'epic', icon: '🛡️', description: 'Kiber zirh', unlockReq: null },

  // Badges
  { id: 'badge_dev', name: '⚡ Developer Badge', type: 'badge', price: 700, rarity: 'epic', icon: '⚡', description: 'Dasturchi belgisi', unlockReq: null },
  { id: 'badge_master', name: '🏆 Master Badge', type: 'badge', price: 800, rarity: 'epic', icon: '🏆', description: 'Master darajasi', unlockReq: { type: 'level', value: 10 } },
  { id: 'badge_python', name: '🐍 Python Master', type: 'badge', price: 400, rarity: 'rare', icon: '🐍', description: 'Python ustasi', unlockReq: { type: 'subject', name: 'Python', tests: 10 } },
  { id: 'badge_js', name: '⚡ JS Master', type: 'badge', price: 400, rarity: 'rare', icon: '⚡', description: 'JavaScript ustasi', unlockReq: { type: 'subject', name: 'JavaScript', tests: 10 } },
  { id: 'badge_perfect', name: '💯 Perfect Score', type: 'badge', price: 1000, rarity: 'legendary', icon: '💯', description: '100% natija belgisi', unlockReq: { type: 'perfect', count: 5 } },

  // Frames
  { id: 'frame_diamond', name: '💎 Diamond Frame', type: 'frame', price: 1000, rarity: 'legendary', icon: '💎', description: 'Olmos ramka', unlockReq: null },
  { id: 'frame_fire', name: '🔥 Fire Frame', type: 'frame', price: 600, rarity: 'epic', icon: '🔥', description: 'Olovli ramka', unlockReq: { type: 'streak', days: 7 } },
  { id: 'frame_gold', name: '🥇 Golden Frame', type: 'frame', price: 500, rarity: 'rare', icon: '🥇', description: 'Oltin ramka', unlockReq: null },
  { id: 'frame_silver', name: '🥈 Silver Frame', type: 'frame', price: 300, rarity: 'common', icon: '🥈', description: 'Kumush ramka', unlockReq: null },

  // Backgrounds
  { id: 'bg_galaxy', name: '🌌 Galaxy BG', type: 'background', price: 450, rarity: 'rare', icon: '🌌', description: 'Galaktika foni', unlockReq: null },
  { id: 'bg_ocean', name: '🌊 Ocean BG', type: 'background', price: 350, rarity: 'common', icon: '🌊', description: 'Okean foni', unlockReq: null },
  { id: 'bg_sunset', name: '🌅 Sunset BG', type: 'background', price: 400, rarity: 'rare', icon: '🌅', description: 'Quyosh botimi foni', unlockReq: null },

  // Effects
  { id: 'effect_sparkle', name: '✨ Sparkle Effect', type: 'effect', price: 550, rarity: 'epic', icon: '✨', description: 'Yaltirab turish effekti', unlockReq: null },
  { id: 'effect_glow', name: '🌟 Glow Effect', type: 'effect', price: 500, rarity: 'rare', icon: '🌟', description: 'Nur sochish effekti', unlockReq: null },
  { id: 'effect_rainbow', name: '🌈 Rainbow Effect', type: 'effect', price: 800, rarity: 'legendary', icon: '🌈', description: 'Kamalak effekti', unlockReq: { type: 'achievement', id: 'achievement_master' } },
  { id: 'gift_coffee', name: '☕ Coffee Gift', type: 'gift', price: 80, rarity: 'common', icon: '☕', description: 'Do\u2018stingizga energiya yuboring', unlockReq: null },
  { id: 'gift_star', name: '⭐ Star Gift', type: 'gift', price: 150, rarity: 'rare', icon: '⭐', description: 'Maxsus yulduzli sovg\u2018a', unlockReq: null },
  { id: 'gift_trophy', name: '🏆 Trophy Gift', type: 'gift', price: 300, rarity: 'epic', icon: '🏆', description: 'G\u2018oliblar uchun sovg\u2018a', unlockReq: null },
];

/* Equippable slotlar (gift slot emas — taqib bo'lmaydi) */
const EQUIP_SLOTS = ['avatar', 'hat', 'glasses', 'clothes', 'badge', 'frame', 'background', 'effect'];

/* ====================== DB HELPERS (promise-based) ====================== */
function run(db, sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, function (err) { err ? reject(err) : resolve(this); }));
}
function get(db, sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}
function all(db, sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}

/* ====================== KATALOG SEED ====================== */
async function seedStoreItems(db) {
  for (let i = 0; i < STORE_CATALOG.length; i++) {
    const item = STORE_CATALOG[i];
    await run(
      db,
      `INSERT INTO store_items (id, name, type, price, rarity, icon, description, unlock_req, sort_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET
         name=excluded.name, type=excluded.type, price=excluded.price, rarity=excluded.rarity,
         icon=excluded.icon, description=excluded.description, unlock_req=excluded.unlock_req,
         sort_order=excluded.sort_order, active=1`,
      [item.id, item.name, item.type, item.price, item.rarity, item.icon, item.description || '',
        item.unlockReq ? JSON.stringify(item.unlockReq) : null, i]
    );
  }
}

/* ====================== FOYDALANUVCHI KALITI ====================== */
function sanitizeUserKey(raw) {
  const key = String(raw || '').trim().toLowerCase();
  if (!key || key.length > 64) return null;
  if (!/^[a-z0-9_.@-]+$/.test(key)) return null; // xavfsiz belgilar chegarasi
  return key;
}

/* ====================== WALLET ====================== */
// Wallet yo'q bo'lsa yaratiladi. clientPoints — clientning hozirgi ballari
// (birinchi marta migratsiya uchun; server balansi client balansidan past bo'lsa
//  client topgan yangi ballar qabul qilinadi — balans bu yo'l bilan FAQAT OSHIRILADI,
//  pasaytirish huquqi FAQAT server purchase tranzaksiyasida bor).
async function ensureWallet(db, userKey, clientPoints = null) {
  const row = await get(db, 'SELECT points FROM user_wallet WHERE user_key = ?', [userKey]);
  if (row) {
    const clientVal = Number(clientPoints);
    if (Number.isFinite(clientVal) && clientVal > row.points) {
      await run(db, 'UPDATE user_wallet SET points = ?, updated_at = ? WHERE user_key = ?', [Math.floor(clientVal), now(), userKey]);
      return Math.floor(clientVal);
    }
    return row.points;
  }
  const initial = Math.max(0, Math.floor(Number(clientPoints) || 0));
  await run(db, 'INSERT INTO user_wallet (user_key, points, updated_at) VALUES (?, ?, ?)', [userKey, initial, now()]);
  return initial;
}

/* ====================== STATE ====================== */
async function getStoreState(db, userKey, clientPoints = null) {
  const balance = await ensureWallet(db, userKey, clientPoints);
  const invRows = await all(db, 'SELECT item_id, purchased_at FROM user_inventory WHERE user_key = ?', [userKey]);
  const eqRows = await all(db, 'SELECT slot, item_id FROM user_equipped WHERE user_key = ?', [userKey]);
  const equipped = {};
  eqRows.forEach(r => { equipped[r.slot] = r.item_id; });
  return {
    balance,
    inventory: invRows.map(r => r.item_id),
    purchasedAt: Object.fromEntries(invRows.map(r => [r.item_id, r.purchased_at])),
    equipped
  };
}

/* ====================== ATOMIC PURCHASE ====================== */
/**
 * Xaridni atomik bajaradi. Client faqat itemId yuboradi — narx server katalogidan olinadi.
 * @returns {Promise<{ok:true, balance:number, item:object}|{ok:false, code:number, error:string}>}
 */
async function purchaseItem(db, userKey, itemId, clientPoints = null) {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run('BEGIN IMMEDIATE', (beginErr) => {
        if (beginErr) return resolve({ ok: false, code: 500, error: 'Tranzaksiya boshlanmadi' });

        let settled = false;
        const finish = (result) => {
          if (settled) return;
          settled = true;
          if (result.ok) {
            db.run('COMMIT', (cErr) => {
              if (cErr) {
                db.run('ROLLBACK', () => {});
                resolve({ ok: false, code: 500, error: 'Tranzaksiyani yakunlashda xatolik' });
              } else {
                resolve(result);
              }
            });
          } else {
            db.run('ROLLBACK', () => resolve(result));
          }
        };

        (async () => {
          try {
            // 1. Item server katalogdan olinadi (narx clientdan KELMAYDI)
            const item = await get(db, 'SELECT * FROM store_items WHERE id = ? AND active = 1', [itemId]);
            if (!item) return finish({ ok: false, code: 404, error: 'Buyum topilmadi yoki sotuvda emas' });

            // 2. Qayta sotib olishni bloklash
            const owned = await get(db, 'SELECT 1 AS x FROM user_inventory WHERE user_key = ? AND item_id = ?', [userKey, itemId]);
            if (owned) return finish({ ok: false, code: 409, error: 'Bu buyum allaqachon sotib olingan' });

            // 3. Balansni server tomonda tekshirish
            const balance = await ensureWallet(db, userKey, clientPoints);
            if (balance < item.price) {
              return finish({ ok: false, code: 402, error: `Ball yetarli emas (kerak: ${item.price}, mavjud: ${balance})` });
            }

            // 4. Balansni yechish
            const newBalance = balance - item.price;
            await run(db, 'UPDATE user_wallet SET points = ?, updated_at = ? WHERE user_key = ?', [newBalance, now(), userKey]);

            // 5. Inventarga qo'shish (UNIQUE cheklov qo'shimcha himoya)
            try {
              await run(db, 'INSERT INTO user_inventory (user_key, item_id, price_paid, purchased_at) VALUES (?, ?, ?, ?)',
                [userKey, itemId, item.price, now()]);
            } catch (invErr) {
              if (String(invErr.message || '').includes('UNIQUE')) {
                return finish({ ok: false, code: 409, error: 'Bu buyum allaqachon sotib olingan' });
              }
              throw invErr;
            }

            // 6. Audit log
            await run(db, 'INSERT INTO store_purchases (user_key, item_id, price_paid, created_at) VALUES (?, ?, ?, ?)',
              [userKey, itemId, item.price, now()]);

            finish({
              ok: true,
              balance: newBalance,
              item: {
                id: item.id, name: item.name, type: item.type, price: item.price,
                rarity: item.rarity, icon: item.icon, description: item.description
              }
            });
          } catch (err) {
            finish({ ok: false, code: 500, error: 'Xarid bajarilmadi: ' + (err.message || 'server xatosi') });
          }
        })();
      });
    });
  });
}

/* ====================== EQUIP / UNEQUIP (loadout) ====================== */
async function equipItem(db, userKey, itemId) {
  const item = await get(db, 'SELECT * FROM store_items WHERE id = ? AND active = 1', [itemId]);
  if (!item) return { ok: false, code: 404, error: 'Buyum topilmadi' };
  if (!EQUIP_SLOTS.includes(item.type)) return { ok: false, code: 400, error: 'Bu buyum taqib bo\u2018lmaydigan tur' };
  const owned = await get(db, 'SELECT 1 AS x FROM user_inventory WHERE user_key = ? AND item_id = ?', [userKey, itemId]);
  if (!owned) return { ok: false, code: 403, error: 'Buyum inventaringizda mavjud emas' };
  await run(db, `INSERT INTO user_equipped (user_key, slot, item_id) VALUES (?, ?, ?)
                 ON CONFLICT(user_key, slot) DO UPDATE SET item_id = excluded.item_id`,
    [userKey, item.type, item.id]);
  return { ok: true, slot: item.type, itemId: item.id };
}

async function unequipItem(db, userKey, slot) {
  if (!EQUIP_SLOTS.includes(String(slot))) return { ok: false, code: 400, error: 'Noto\u2018g\u2018ri slot' };
  await run(db, 'DELETE FROM user_equipped WHERE user_key = ? AND slot = ?', [userKey, slot]);
  return { ok: true, slot };
}

/* ====================== GIFT (sovg'a) ====================== */
/**
 * Atomik sovg'a: yuboruvchi balansidan yechiladi, item qabul qiluvchi
 * inventariga DB'da qo'shiladi + audit log. Yuboruvchi balansi yetmasa ROLLBACK.
 */
async function giftItem(db, senderKey, recipientKey, itemId, clientPoints = null) {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run('BEGIN IMMEDIATE', (beginErr) => {
        if (beginErr) return resolve({ ok: false, code: 500, error: 'Tranzaksiya boshlanmadi' });

        let settled = false;
        const finish = (result) => {
          if (settled) return;
          settled = true;
          if (result.ok) {
            db.run('COMMIT', (cErr) => {
              if (cErr) {
                db.run('ROLLBACK', () => {});
                resolve({ ok: false, code: 500, error: 'Tranzaksiyani yakunlashda xatolik' });
              } else {
                resolve(result);
              }
            });
          } else {
            db.run('ROLLBACK', () => resolve(result));
          }
        };

        (async () => {
          try {
            const item = await get(db, 'SELECT * FROM store_items WHERE id = ? AND active = 1', [itemId]);
            if (!item) return finish({ ok: false, code: 404, error: 'Buyum topilmadi yoki sotuvda emas' });
            if (!recipientKey || recipientKey === senderKey) {
              return finish({ ok: false, code: 400, error: 'Qabul qiluvchi noto\u2018g\u2018ri' });
            }

            // Yuboruvchi balansini tekshirish va yechish
            const balance = await ensureWallet(db, senderKey, clientPoints);
            if (balance < item.price) {
              return finish({ ok: false, code: 402, error: `Ball yetarli emas (kerak: ${item.price}, mavjud: ${balance})` });
            }
            const newBalance = balance - item.price;
            await run(db, 'UPDATE user_wallet SET points = ?, updated_at = ? WHERE user_key = ?', [newBalance, now(), senderKey]);

            // Item qabul qiluvchi inventariga (qayta sovg'a qilinmasligi uchun UNIQUE)
            try {
              await run(db, 'INSERT INTO user_inventory (user_key, item_id, price_paid, purchased_at) VALUES (?, ?, ?, ?)',
                [recipientKey, itemId, 0, now()]);
            } catch (invErr) {
              if (String(invErr.message || '').includes('UNIQUE')) {
                return finish({ ok: false, code: 409, error: 'Bu buyum allaqachon qabul qiluvchining inventarida bor' });
              }
              throw invErr;
            }
            await run(db, 'INSERT INTO store_purchases (user_key, item_id, price_paid, created_at) VALUES (?, ?, ?, ?)',
              [senderKey, itemId, item.price, now()]);

            finish({ ok: true, balance: newBalance, item: { id: item.id, name: item.name, icon: item.icon, price: item.price } });
          } catch (err) {
            finish({ ok: false, code: 500, error: 'Sovg\u2018a yuborilmadi: ' + (err.message || 'server xatosi') });
          }
        })();
      });
    });
  });
}


module.exports = {
  STORE_CATALOG,
  EQUIP_SLOTS,
  seedStoreItems,
  sanitizeUserKey,
  ensureWallet,
  getStoreState,
  purchaseItem,
  equipItem,
  unequipItem,
  giftItem
};

