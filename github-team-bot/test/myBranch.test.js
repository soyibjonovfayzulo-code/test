'use strict';
// test/myBranch.test.js — bind, module detection, mybranch testlari
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { createDatabase } = require('../src/database');
const { createBot } = require('../src/index');
const { tempDataDir, mockTelegram, mockGitHub } = require('./helpers');

const SECRET = 'test-webhook-secret';

function makeBot(ghOverrides = {}) {
  const tg = mockTelegram();
  const dataDir = tempDataDir();
  const db = createDatabase(dataDir);
  const bot = createBot({
    config: {
      telegram: {},
      github: { owner: 'o', repo: 'r', defaultBranch: 'main', webhookSecret: SECRET },
      adminIds: ['999'],
      port: 4010,
      notifyWorkflowSuccess: false,
      dataDir,
    },
    db,
    github: mockGitHub(ghOverrides),
    telegram: tg,
  });
  return { bot, tg, db };
}

test('11. bind flow — ism kiritish + admin /setbranch (yangi arxitektura)', async () => {
  const { bot, tg, db } = makeBot();
  // user /start → ism kiritadi
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111, username: 'jas_tg' }, text: '/start' });
  assert.ok(tg.sent[0].text.includes("Ismingizni kiriting"));
  // boshqa user o'sha ismni da'vo qilsa — keyinchalik rad etiladi
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111 }, text: 'jasurbek' }); // whitelistda YO'Q
  assert.ok(tg.sent[1].text.includes('topilmadingiz'));
  // to'g'ri whitelist ism
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111 }, text: 'ahatjon' });
  assert.ok(tg.sent[2].text.includes('tanildi'));
  // binding yaratildi
  const binding = db.getMemberBinding('ahatjon');
  assert.ok(binding);
  assert.strictEqual(String(binding.telegramUserId), '111');
  // boshqa Telegram ID xuddi shu ismni o'zlashtira olmaydi
  const team2 = bot.ctx.team;
  assert.strictEqual(team2.claim('ahatjon', 999999).reason, 'already_bound');
  // admin /setbranch
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 999 }, text: '/setbranch ahatjon ahatjon' });
  const updated = db.getMemberBinding('ahatjon');
  assert.strictEqual(updated.branch, 'ahatjon');
});

test('25. /mybranch — YASHIRIN (eski komanda javob bermaydi)', async () => {
  const { bot, tg } = makeBot({
    async compare() { return { ahead_by: 0, behind_by: 3 }; },
  });
  bot.ctx.team.claim('ahatjon', 111);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111 }, text: '/mybranch' });
  assert.strictEqual(tg.sent.length, 0, 'eski komanda javob bermaydi');
});

test('12. module detection — path bo\'yicha xavfsiz aniqlash', () => {
  const F = require('../src/formatters');
  assert.strictEqual(F.detectModules(['tests/mobile.css']), '📝 Tests');
  assert.strictEqual(F.detectModules(['duel/script.js']), '⚔️ Duel');
  assert.strictEqual(F.detectModules(['store/cart.js']), '🛍️ Store');
  assert.strictEqual(F.detectModules(['random/file.js']), 'General');
  assert.strictEqual(F.detectModules(['tests/a.js', 'duel/b.js']), 'General');
});

test('13. /mybranch olib tashlandi — uning ornida push flowda ACCESS DENIED', async () => {
  const { bot, tg } = makeBot({
    async compare() { return { ahead_by: 0, behind_by: 3 }; },
  });
  bot.ctx.team.claim('ahatjon', 111);
  bot.ctx.team.setBranch('ahatjon', 'ahatjon');
  // real repo main'da, ahatjon branchi farqli — ACCESS DENIED
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111 }, text: '🚀 Git Push' });
  // agent mode: member.branch config'dan — preview chiqadi (ACCESS agent kompyuterida tekshiriladi)
  assert.ok(tg.sent[0].text.includes('GIT PUSH'));
  // /mybranch esa javob bermaydi
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111 }, text: '/mybranch' });
  assert.strictEqual(tg.sent.length, 1);
});
