'use strict';
// ============================================================
// test/webhook-sync.test.js — webhook push <-> bot push sinxron:
// lastPush yangilanishi, duplicate delivery, bot push duplicate NOTIF
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const { createDatabase } = require('../src/database');
const { createTeam } = require('../src/team');
const { createWebhookHandler } = require('../src/webhook');
const { tempDataDir, mockTelegram, mockGitHub } = require('./helpers');

const SECRET = 'test-webhook-secret';

function makeHandler(dir) {
  const tg = mockTelegram();
  const db = createDatabase(dir || tempDataDir());
  createTeam(db);
  const handler = createWebhookHandler({
    db, telegram: tg, github: mockGitHub(),
    config: { github: { webhookSecret: SECRET, defaultBranch: 'main', owner: 'o', repo: 'r' }, adminIds: [] },
  });
  return { tg, db, handler };
}

function signedHeaders(payload, delivery) {
  return {
    'x-github-event': 'push',
    'x-hub-signature-256': 'sha256=' + crypto.createHmac('sha256', SECRET).update(payload).digest('hex'),
    'x-github-delivery': delivery,
  };
}

test('webhook: push notification + lastPush yangilanadi (source=webhook)', async () => {
  const { tg, db, handler } = makeHandler();
  const payload = JSON.stringify({
    ref: 'refs/heads/sardor',
    repository: { default_branch: 'main' },
    pusher: { name: 'sardor' },
    head_commit: { id: 'aa11bb22cc', message: 'Fix mobile tests', author: { name: 'Sardor' } },
    commits: [{ id: 'aa11bb22cc', message: 'Fix mobile tests', author: { name: 'Sardor' }, added: [], modified: ['mobile.css'], removed: [] }],
  });
  const h = signedHeaders(payload, 'w1');
  const res = handler({ headers: h, rawBody: payload, payload: JSON.parse(payload) });
  assert.strictEqual(res.status, 200);
  await new Promise((r) => setTimeout(r, 60));
  assert.ok(tg.sent[0].text.includes('GITHUB UPDATE'));
  assert.ok(tg.sent[0].text.includes('Sardor'));
  assert.strictEqual(db.getLastPush().source, 'webhook');
  assert.strictEqual(db.getLastPush().memberName, 'Sardor');
  assert.strictEqual(db.getLastPush().commitHash, 'aa11bb22cc');
  // duplicate delivery — qayta ishlanmaydi
  const r2 = handler({ headers: h, rawBody: payload, payload: JSON.parse(payload) });
  assert.ok(r2.body.includes('duplicate'));
  assert.strictEqual(tg.sent.length, 1);
});

test('webhook: bot o\'zi push qilgan commit — duplicate notification YO\'Q', async () => {
  const { tg, db, handler } = makeHandler();
  // bot pushini oldindan tarixga yozamiz
  db.recordPush({ memberName: 'sardor', branch: 'sardor', commitHash: 'aa11bb22cc', commitMessage: 'Fix mobile tests', result: 'success', source: 'bot' });
  const payload = JSON.stringify({
    ref: 'refs/heads/sardor',
    repository: { default_branch: 'main' },
    pusher: { name: 'sardor' },
    head_commit: { id: 'aa11bb22cc', message: 'Fix mobile tests', author: { name: 'Sardor' } },
    commits: [{ id: 'aa11bb22cc', message: 'Fix mobile tests', author: { name: 'Sardor' }, added: [], modified: [], removed: [] }],
  });
  handler({ headers: signedHeaders(payload, 'w2'), rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 60));
  assert.strictEqual(tg.sent.length, 0, 'bot push uchun qayta xabar YO\'Q');
});

test('webhook: bot pushdan keyin BOSHQA commit kelsa — xabar KELADI', async () => {
  const { tg, db, handler } = makeHandler();
  db.recordPush({ memberName: 'sardor', branch: 'sardor', commitHash: 'aa11bb22cc', commitMessage: 'Fix mobile tests', result: 'success', source: 'bot' });
  const payload = JSON.stringify({
    ref: 'refs/heads/ahatjon',
    repository: { default_branch: 'main' },
    pusher: { name: 'ahatjon' },
    head_commit: { id: 'dd44ee55ff', message: 'New feature', author: { name: 'Ahatjon' } },
    commits: [{ id: 'dd44ee55ff', message: 'New feature', author: { name: 'Ahatjon' }, added: [], modified: ['x.js'], removed: [] }],
  });
  handler({ headers: signedHeaders(payload, 'w3'), rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 60));
  assert.strictEqual(tg.sent.length, 1, 'yangi commit uchun xabar KELADI');
  assert.ok(tg.sent[0].text.includes('Ahatjon'));
});
