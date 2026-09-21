'use strict';
// ============================================================
// test/commands.test.js — Telegram komandalar + formatlash testlari
// ============================================================
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

test('7. Telegram formatting — HTML escape ishlaydi', () => {
  const F = require('../src/formatters');
  assert.strictEqual(F.esc('<script>&x'), '&lt;script&gt;&amp;x');
  const msg = require('../src/commands/help').helpCommand();
  assert.ok(msg.text.includes('ORZUTALIM DEV BOT'));
  assert.ok(msg.text.includes('/status'));
});

test('8. branch status — behind/ahead ikonkalar', () => {
  const F = require('../src/formatters');
  assert.deepStrictEqual(F.branchStatusIcon(0, 0), { icon: '🟢', text: 'Up to date' });
  assert.deepStrictEqual(F.branchStatusIcon(0, 3), { icon: '🟡', text: '3 commit behind' });
  assert.deepStrictEqual(F.branchStatusIcon(1, 0), { icon: '🔵', text: '1 commit ahead' });
});

test('9. GitHub API error — xato xabari chiroyli chiqadi (/status orqali)', async () => {
  const fail = () => { const e = new Error('GitHub API xato: HTTP 500'); e.status = 500; e.name = 'GitHubApiError'; throw e; };
  const { bot, tg } = makeBot({
    async getBranch() { fail(); },
    async listOpenPRs() { fail(); },
    async listBranches() { fail(); },
  });
  // member bo'lishi kerak (yangi access modeli)
  bot.ctx.team.claim('sardor', 111222);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '/status' });
  assert.ok(tg.sent[0].text.includes('GitHub API error'), 'foydalanuvchiga tushunarli xabar');
  // noma'lum user /status — "tanilmadingiz"
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 12345 }, text: '/status' });
  assert.ok(tg.sent[1].text.includes('tanilmadingiz'));
});

test('10. unknown Telegram user — Git Push so\'rovi ism so\'roviga olib keladi', async () => {
  const { bot, tg } = makeBot();
  // unknown user tugma bosadi — ism so'raladi (Git operation YO'Q)
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 12345 }, text: '🚀 Git Push' });
  assert.ok(tg.sent[0].text.includes('Ismingizni kiriting'));
  // noma'lum komanda — javob yo'q (spam kamaytirish)
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 12345 }, text: '/unknown' });
  assert.strictEqual(tg.sent.length, 1);
});

test('10. unknown Telegram user — ESKI /mybranch yashirin, yangi UI ishlaydi', async () => {
  const { bot, tg } = makeBot();
  // eski /mybranch — yashirin (javob YO'Q)
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 12345 }, text: '/mybranch' });
  assert.strictEqual(tg.sent.length, 0, '/mybranch javob bermaydi');
  // noma'lum komanda — javob yo'q (spam kamaytirish)
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 12345 }, text: '/unknown' });
  assert.strictEqual(tg.sent.length, 0);
});
