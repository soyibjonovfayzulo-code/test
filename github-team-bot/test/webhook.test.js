'use strict';
// ============================================================
// test/webhook.test.js — webhook + push/PR handler testlari
// (node:test built-in runner, dependency yo'q)
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const { createDatabase } = require('../src/database');
const { createWebhookHandler } = require('../src/webhook');
const { tempDataDir, mockTelegram, mockGitHub, sign } = require('./helpers');

const SECRET = 'test-webhook-secret';
const PUSH_PAYLOAD = JSON.stringify({
  ref: 'refs/heads/jasurbek/tests',
  repository: { default_branch: 'main' },
  pusher: { name: 'jasurbek' },
  head_commit: { id: 'abc123def', message: 'fix: tests mobile responsive', author: { name: 'Jasurbek' } },
  commits: [{
    id: 'abc123def',
    message: 'fix: tests mobile responsive',
    author: { name: 'Jasurbek' },
    added: ['mobile.css'],
    modified: ['index.html', 'script.js'],
    removed: [],
  }],
});

function makeCtx(db, tg, gh) {
  return {
    db,
    telegram: tg,
    github: gh,
    config: {
      github: { webhookSecret: SECRET, defaultBranch: 'main', owner: 'o', repo: 'r' },
      adminIds: ['999'],
      port: 4010,
      notifyWorkflowSuccess: false,
    },
  };
}

test('1. push event parse — push xabari to\'g\'ri formatlanadi', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const gh = mockGitHub();
  const handler = createWebhookHandler(makeCtx(db, tg, gh));
  const res = handler({ headers: { 'x-github-event': 'push', 'x-hub-signature-256': sign(SECRET, PUSH_PAYLOAD), 'x-github-delivery': 'd1' }, rawBody: PUSH_PAYLOAD, payload: JSON.parse(PUSH_PAYLOAD) });
  assert.strictEqual(res.status, 200);
  await new Promise((r) => setTimeout(r, 50)); // background ishlov
  assert.strictEqual(tg.sent.length, 1);
  const msg = tg.sent[0].text;
  assert.ok(msg.includes('GITHUB UPDATE'), 'sarlavha bor');
  assert.ok(msg.includes('Jasurbek'), 'kim: bor');
  assert.ok(msg.includes('jasurbek/tests'), 'branch: bor');
  assert.ok(msg.includes('fix: tests mobile responsive'), 'commit nomi: bor');
  assert.ok(msg.includes('index.html'), 'fayllar: bor');
  assert.ok(msg.includes('+100'), 'additions: bor');
  assert.ok(msg.includes('General'), 'module: General (xavfsiz aniqlash)');
});

test('2. PR opened — to\'g\'ri xabar', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const gh = mockGitHub();
  const handler = createWebhookHandler(makeCtx(db, tg, gh));
  const payload = JSON.stringify({
    action: 'opened',
    repository: { default_branch: 'main' },
    sender: { login: 'sardor' },
    pull_request: { number: 42, title: 'Duel mobile responsive', user: { login: 'sardor' }, head: { ref: 'sardor/duel' }, base: { ref: 'main' }, changed_files: 12 },
  });
  handler({ headers: { 'x-github-event': 'pull_request', 'x-hub-signature-256': sign(SECRET, payload), 'x-github-delivery': 'd2' }, rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 50));
  const msg = tg.sent[0].text;
  assert.ok(msg.includes('YANGI PULL REQUEST'));
  assert.ok(msg.includes('sardor'));
  assert.ok(msg.includes('Duel mobile responsive'));
  assert.ok(msg.includes('sardor/duel'));
  assert.ok(msg.includes('main'));
  assert.ok(msg.includes('Files: 12'));
});

test('3. PR merged — merged xabari', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const gh = mockGitHub();
  const handler = createWebhookHandler(makeCtx(db, tg, gh));
  const payload = JSON.stringify({
    action: 'closed',
    repository: { default_branch: 'main' },
    sender: { login: 'sardor' },
    pull_request: { number: 42, title: 'Duel mobile responsive', user: { login: 'sardor' }, head: { ref: 'sardor/duel' }, base: { ref: 'main' }, changed_files: 12, merged: true },
  });
  handler({ headers: { 'x-github-event': 'pull_request', 'x-hub-signature-256': sign(SECRET, payload), 'x-github-delivery': 'd3' }, rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 50));
  const msg = tg.sent[0].text;
  assert.ok(msg.includes('PULL REQUEST MERGED'));
  assert.ok(msg.includes('Main branch yangilandi'));
  assert.ok(msg.includes('12 files changed'));
});

test('4. main updated — main push + jamoa ko\'rsatmasi', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const gh = mockGitHub();
  db.upsertBinding({ telegramUserId: '1', telegramUsername: 'jas', githubUsername: 'Jasurbek', branch: 'jasurbek/tests' });
  const handler = createWebhookHandler(makeCtx(db, tg, gh));
  const payload = JSON.stringify({
    ref: 'refs/heads/main',
    repository: { default_branch: 'main' },
    pusher: { name: 'ali' },
    head_commit: { id: 'def456', message: 'fix: coding javascript', author: { name: 'Ali' } },
    commits: [{ id: 'def456', message: 'fix: coding javascript', author: { name: 'Ali' }, added: [], modified: ['coding/script.js'], removed: [] }],
  });
  handler({ headers: { 'x-github-event': 'push', 'x-hub-signature-256': sign(SECRET, payload), 'x-github-delivery': 'd4' }, rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 50));
  assert.ok(tg.sent.length >= 2, 'push + ko\'rsatma xabarlari');
  const mainMsg = tg.sent[0].text;
  assert.ok(mainMsg.includes('MAIN YANGILANDI'));
  const instr = tg.sent[1].text;
  assert.ok(instr.includes("O'Z BRANCHINGIZNI YANGILASH"));
  assert.ok(instr.includes('git fetch origin'));
  assert.ok(instr.includes('Jasurbek'));
  assert.ok(instr.includes('jasurbek/tests'));
});

test('5. invalid webhook signature — 401, xabar yo\'q', () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const handler = createWebhookHandler(makeCtx(db, tg, mockGitHub()));
  const res = handler({ headers: { 'x-github-event': 'push', 'x-hub-signature-256': 'sha256=deadbeef', 'x-github-delivery': 'd5' }, rawBody: PUSH_PAYLOAD, payload: JSON.parse(PUSH_PAYLOAD) });
  assert.strictEqual(res.status, 401);
  assert.strictEqual(tg.sent.length, 0);
});

test('6. duplicate webhook — bir xil delivery faqat bir marta ishlanadi', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const handler = createWebhookHandler(makeCtx(db, tg, mockGitHub()));
  const headers = { 'x-github-event': 'push', 'x-hub-signature-256': sign(SECRET, PUSH_PAYLOAD), 'x-github-delivery': 'dup-1' };
  const r1 = handler({ headers, rawBody: PUSH_PAYLOAD, payload: JSON.parse(PUSH_PAYLOAD) });
  const r2 = handler({ headers, rawBody: PUSH_PAYLOAD, payload: JSON.parse(PUSH_PAYLOAD) });
  assert.strictEqual(r1.status, 200);
  assert.strictEqual(r2.status, 200);
  assert.ok(r2.body.includes('duplicate'));
  await new Promise((r) => setTimeout(r, 50));
  assert.strictEqual(tg.sent.length, 1, 'faqat bitta notification');
});


