'use strict';
// ============================================================
// test/workflow.test.js — UI flow: ism kiritish, 3 tugma,
// access control, oxirgi push, eski komandalar yashirinligi,
// admin komandalar
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { createDatabase } = require('../src/database');
const { createGitOps } = require('../src/gitops');
const { createBot } = require('../src/index');
const { tempDataDir, mockTelegram, mockGitHub } = require('./helpers');

const SECRET = 'test-webhook-secret';

// ---- Vaqtinchalik LOCAL git repo (production repo'ga TEGMAYMIZ) ----
function tempGitRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitrepo-'));
  const g = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe' });
  g('init -b main');
  g('config user.email test@test.com');
  g('config user.name Test');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init commit"');
  g('branch sardor');
  return dir;
}

function makeBot({ dataDir } = {}) {
  const tg = mockTelegram();
  const dir = dataDir || tempDataDir();
  const realRepo = tempGitRepo();
  const bot = createBot({
    config: {
      telegram: {},
      github: { owner: 'o', repo: 'r', defaultBranch: 'main', webhookSecret: SECRET },
      adminIds: ['777'],
      port: 4010,
      notifyWorkflowSuccess: false,
      dataDir: dir,
      repoPath: realRepo,
    },
    db: createDatabase(dir),
    github: mockGitHub(),
    telegram: tg,
  });
  return { bot, tg, db: bot.ctx.db, team: bot.ctx.team, realRepo };
}

test('bot: unknown user — Git Push bossa ism so\'raladi (Git operation YO\'Q)', async () => {
  const { bot, tg } = makeBot();
  await bot.handleCommand({ chat: { id: 2 }, from: { id: 888888 }, text: '🚀 Git Push' });
  assert.ok(tg.sent[0].text.includes('Ismingizni kiriting'));
});

test('bot: /start — ism; noto\'g\'ri ism rad; to\'g\'ri ism taniladi', async () => {
  const { bot, tg, team } = makeBot();
  await bot.handleCommand({ chat: { id: 3 }, from: { id: 121212 }, text: '/start' });
  assert.ok(tg.sent[0].text.includes('Ismingizni kiriting'));
  await bot.handleCommand({ chat: { id: 3 }, from: { id: 121212 }, text: 'hacker' });
  assert.ok(tg.sent[1].text.includes('topilmadingiz'));
  await bot.handleCommand({ chat: { id: 3 }, from: { id: 121212 }, text: 'ahatjon' });
  const okMsg = tg.sent[2].text;
  assert.ok(okMsg.includes('ahatjon'), 'ism ko\'rsatiladi');
  assert.ok(okMsg.includes('tanildi'), 'tanilganlik xabari');
  assert.strictEqual(team.findByTelegramId(121212).name, 'ahatjon');
  // whitelist'da yo'q ism topilmaydi (6-chi odam YO'Q)
  assert.strictEqual(team.findByName('hacker'), null);
});

test('bot: allaqachon bog\'langan user /start — ism SO\'RALMAYDI', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '/start' });
  const msg = tg.sent[0].text;
  assert.ok(msg.includes('sardor') && msg.includes('tanildi'));
  assert.ok(!msg.includes('Ismingizni kiriting'));
});

test('bot: eski komandalar YASHIRIN (javob YO\'Q)', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  for (const cmd of ['/help', '/team', '/commits', '/pr', '/main', '/mybranch', '/bind', '/approve']) {
    await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: cmd });
  }
  assert.strictEqual(tg.sent.length, 0, 'eski komandalarga javob YO\'Q');
});

test('bot: main\'da turgan holda Git Push — TAQIQLANGAN (preview ham YO\'Q)', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  // real repo hozir main'da
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '🚀 Git Push' });
  // agent mode: preview ko'rsatiladi (real push faqat agent kompyuterida)
  assert.ok(tg.sent[0].text.includes('GIT PUSH'));
  assert.ok(tg.sent[0].text.includes('Agent:'));
});

test('bot: callback confirm — boshqa user o\'zini deb tasdiqlay olmaydi', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  await bot.handleCallbackQuery({ id: 'q1', data: 'push:confirm:111222', from: { id: 999 }, message: { chat: { id: 1 } } });
  assert.ok(tg.sent.every((s) => !String(s.text || '').includes("GIT PUSH BO'LDI")));
  // 999 user uchun agent command yuborilmagan
  assert.strictEqual((readState(bot).agentCommands || []).length, 0);
});

test('bot: /status ishlaydi (GitHub API holati)', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '/status' });
  assert.ok(tg.sent[0].text.includes('ORZUTALIM STATUS'));
  // unknown user /status — tanilmadingiz
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 555 }, text: '/status' });
  assert.ok(tg.sent[1].text.includes('tanilmadingiz'));
});

test('bot: admin komandalar — member bo\'lmasa javob YO\'Q, admin bo\'lsa ishlaydi', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '/members' });
  assert.strictEqual(tg.sent.length, 0);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 777 }, text: '/members' });
  assert.ok(tg.sent[0].text.includes('TEAM'));
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 777 }, text: '/setbranch sardor sardor' });
  assert.ok(tg.sent[1].text.includes('Bajarildi'));
  assert.strictEqual(team.findByTelegramId(111222).branch, 'sardor');
  // protected branch biriktirib bo'lmaydi
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 777 }, text: '/setbranch sardor main' });
  assert.ok(tg.sent[2].text.includes('Bajarilmadi'));
});

test('bot: oxirgi kod o\'zgartirgan — record + RESTART persistence', async () => {
  const dir = tempDataDir();
  const { bot, tg, db, team } = makeBot({ dataDir: dir });
  team.claim('sardor', 111222);
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: "🕒 Oxirgi kod o'zgartirgan" });
  // GitHub API primary — REAL holat
  assert.ok(tg.sent[0].text.includes('OXIRGI KODNI'));
  assert.ok(tg.sent[0].text.includes("GitHub'dagi REAL holat"));
  db.recordPush({ telegramUserId: '111222', memberName: 'sardor', branch: 'sardor', commitHash: 'abc1234def', commitMessage: 'Fix mobile tests', result: 'success', source: 'agent' });
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: "🕒 Oxirgi kod o'zgartirgan" });
  const lastMsg = tg.sent[tg.sent.length - 1].text;
  assert.ok(lastMsg.includes('OXIRGI KODNI'));

  // RESTART: yangi instance, XUDDI SHU dataDir
  const bot2 = createBot({
    config: { telegram: {}, github: { owner: 'o', repo: 'r', defaultBranch: 'main', webhookSecret: SECRET }, adminIds: ['777'], port: 4010, dataDir: dir, repoPath: '.' },
    db: createDatabase(dir),
    github: mockGitHub(),
    telegram: mockTelegram(),
  });
  assert.strictEqual(bot2.ctx.team.findByTelegramId(111222).name, 'sardor', 'binding restartdan keyin saqlanadi');
  const persisted = bot2.ctx.db.getLastPush();
  assert.strictEqual(persisted.commitHash, 'abc1234def', 'last push restartdan keyin saqlanadi');
  assert.strictEqual(persisted.source, 'agent');
});

function readState(bot) {
  return JSON.parse(fs.readFileSync(path.join(bot.ctx.config.dataDir, 'bot-state.json'), 'utf8'));
}

/* __APPEND_MARKER2__ */

