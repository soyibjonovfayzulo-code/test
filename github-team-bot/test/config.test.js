'use strict';
// ============================================================
// test/config.test.js — .env loading va config parser testlari
// (ROOT CAUSE reglyatsiya testlari: BOM, UTF-16, duplicate key,
//  bo'sh tashqi env, -100... chat ID string holati)
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadEnvFile, createConfig, validateConfig, logConfigStatus } = require('../src/config');

function tempEnv() {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'envtest-')), '.env');
}

test('config: UTF-8 CRLF — TELEGRAM_CHAT_ID=-100... string sifatida o\'qiladi', () => {
  const p = tempEnv();
  fs.writeFileSync(p, 'TELEGRAM_CHAT_ID=-1003935277804\r\nBOT_PORT=4010\r\n');
  const out = loadEnvFile(p);
  assert.strictEqual(out.TELEGRAM_CHAT_ID, '-1003935277804');
  assert.strictEqual(typeof out.TELEGRAM_CHAT_ID, 'string', 'chat ID numberga aylantirilmaydi');
  assert.strictEqual(out.BOT_PORT, '4010');
});

test('config: UTF-8 BOM fayl to\'g\'ri o\'qiladi', () => {
  const p = tempEnv();
  fs.writeFileSync(p, '\uFEFFTELEGRAM_CHAT_ID=-1003935277804\n');
  const out = loadEnvFile(p);
  assert.strictEqual(out.TELEGRAM_CHAT_ID, '-1003935277804');
});

test('config: UTF-16 LE (Windows Notepad/PS redirect) fayl to\'g\'ri o\'qiladi', () => {
  const p = tempEnv();
  const content = 'TELEGRAM_CHAT_ID=-1003935277804\r\nTELEGRAM_BOT_TOKEN=fake:token123\r\n';
  const buf = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(content, 'utf16le')]);
  fs.writeFileSync(p, buf);
  const out = loadEnvFile(p);
  assert.strictEqual(out.TELEGRAM_CHAT_ID, '-1003935277804');
  assert.strictEqual(out.TELEGRAM_BOT_TOKEN, 'fake:token123');
});

test('config: duplicate key — oxirgi qiymat g\'alaba (bo\'sh qiymat ustidan yoziladi)', () => {
  const p = tempEnv();
  fs.writeFileSync(p, 'TELEGRAM_CHAT_ID=\r\nTELEGRAM_CHAT_ID=-1003935277804\r\n');
  const out = loadEnvFile(p);
  assert.strictEqual(out.TELEGRAM_CHAT_ID, '-1003935277804');
});

test('config: tashqi muhitdagi BO\'SH qiymat .env qiymatini buzmaydi', () => {
  const p = tempEnv();
  fs.writeFileSync(p, 'TELEGRAM_CHAT_ID=-1003935277804\n');
  process.env.TELEGRAM_CHAT_ID = ''; // PowerShell sessiyasida bo'sh export holati
  try {
    loadEnvFile(p);
    assert.strictEqual(process.env.TELEGRAM_CHAT_ID, '-1003935277804');
  } finally {
    delete process.env.TELEGRAM_CHAT_ID;
  }
});

test('config: fayl topilmasa crash bo\'lmaydi', () => {
  const out = loadEnvFile(path.join(os.tmpdir(), 'no-such-env-' + Date.now() + '.env'));
  assert.deepStrictEqual(out, {});
});

test('config: qo\'shtirnoq, komment va bo\'sh qatorlar', () => {
  const p = tempEnv();
  fs.writeFileSync(p, 'A="qiymat 1"\nB=oddity\n# bu komment\n\nC=\n');
  const out = loadEnvFile(p);
  assert.strictEqual(out.A, 'qiymat 1');
  assert.strictEqual(out.B, 'oddity');
  assert.strictEqual(out.C, '');
});

test('config: createConfig — chatId string, port number', () => {
  const cfg = createConfig();
  assert.strictEqual(typeof cfg.telegram.chatId, 'string');
  assert.strictEqual(typeof cfg.port, 'number');
  assert.ok(cfg.port > 0);
});

test('config: validateConfig — yetishmaydigani aniq ko\'rsatiladi', () => {
  const missing = validateConfig({
    telegram: { token: '', chatId: '' },
    github: { owner: '', repo: '', webhookSecret: '' },
  });
  assert.ok(missing.includes('TELEGRAM_CHAT_ID'));
  assert.ok(missing.includes('TELEGRAM_BOT_TOKEN'));
  assert.ok(missing.some((m) => m.startsWith('GITHUB_WEBHOOK_SECRET')));
  assert.strictEqual(missing.length, 5);
  // to'liq config — xato yo'q
  const ok = validateConfig({
    telegram: { token: 't', chatId: '-1003935277804' },
    github: { owner: 'o', repo: 'r', webhookSecret: 's' },
  });
  assert.deepStrictEqual(ok, []);
});

test('config: logConfigStatus — secret QIYMATLARI loglanmaydi', () => {
  const lines = [];
  const orig = console.log;
  console.log = (...a) => lines.push(a.join(' '));
  try {
    logConfigStatus({
      telegram: { token: 'tok_fake_value_12345', chatId: '-1003935277804' },
      github: { token: 'gh_fake_12345', owner: 'o', repo: 'r', webhookSecret: 'sec_fake_12345' },
      adminIds: ['111'],
      port: 4010,
    });
  } finally {
    console.log = orig;
  }
  const all = lines.join('\n');
  assert.ok(!all.includes('tok_fake_value_12345'), 'token qiymati logda YO\'Q');
  assert.ok(!all.includes('gh_fake_12345'), 'github token logda YO\'Q');
  assert.ok(!all.includes('sec_fake_12345'), 'secret logda YO\'Q');
  assert.ok(all.includes('TELEGRAM_BOT_TOKEN:     SET'));
  assert.ok(all.includes('TELEGRAM_CHAT_ID:       SET'));
  assert.ok(all.includes('BOT_PORT:               4010'));
});

// ---- Keyboard shape regression (Telegram "InlineKeyboardButton must be an Object") ----
function assertValidKeyboard(keyboard) {
  assert.ok(keyboard && Array.isArray(keyboard.inline_keyboard), 'inline_keyboard massiv');
  for (const row of keyboard.inline_keyboard) {
    assert.ok(Array.isArray(row), 'qator — massiv');
    for (const btn of row) {
      assert.strictEqual(typeof btn, 'object', 'button — OBJECT bo\'lishi kerak (massiv emas)');
      assert.ok(typeof btn.text === 'string', 'button.text bor');
      assert.ok(btn.url || btn.callback_data, 'button url yoki callback_data bor');
    }
  }
}

test('commands: /commits keyboard tuzilishi to\'g\'ri (button = object)', async () => {
  const { commitsCommand } = require('../src/commands/commits');
  const mockGh = {
    async listCommits() {
      return [
        { commit: { message: 'fix: tests mobile\nbody', author: { name: 'Jasurbek' } }, html_url: 'https://github.com/o/r/commit/1' },
        { commit: { message: 'feat: duel realtime', author: { name: 'Sardor' } }, html_url: 'https://github.com/o/r/commit/2' },
      ];
    },
  };
  const res = await commitsCommand({ github: mockGh, config: { github: { defaultBranch: 'main' } } });
  assert.ok(res.text.includes('LAST COMMITS'));
  assert.ok(res.text.includes('Jasurbek'));
  assertValidKeyboard(res.keyboard);
});

test('commands: /pr va /main keyboard tuzilishi to\'g\'ri', async () => {
  const { pullRequestsCommand } = require('../src/commands/pullRequests');
  const { mainCommand } = require('../src/commands/main');
  const mockGh = {
    async listOpenPRs() {
      return [{ number: 42, title: 'Duel mobile responsive', user: { login: 'sardor' }, head: { ref: 'sardor/duel' }, base: { ref: 'main' }, mergeable: true, html_url: 'https://github.com/o/r/pull/42' }];
    },
    async listCommits() {
      return [{ commit: { message: 'fix: profile mobile', author: { name: 'Bekzod', date: new Date().toISOString() } }, stats: { additions: 10, deletions: 2 }, html_url: 'https://github.com/o/r/commit/3' }];
    },
  };
  const ctx = { github: mockGh, config: { github: { defaultBranch: 'main' } } };
  const prRes = await pullRequestsCommand(ctx);
  assertValidKeyboard(prRes.keyboard);
  const mainRes = await mainCommand(ctx);
  assertValidKeyboard(mainRes.keyboard);
});

