'use strict';
// ============================================================
// test/hardening.test.js — FINAL AUDIT hardening testlari:
// push/pull status semantikasi, branch security, lock,
// 429 retry, restart recovery, health endpoint, audit statuslari
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { createDatabase } = require('../src/database');
const { createAgents } = require('../src/agents');
const { createAgentGit } = require('../agent/src/git');
const { createBot } = require('../src/index');
const { createServer } = require('../src/server');
const { createWebhookHandler } = require('../src/webhook');
const { createTelegramBot } = require('../src/telegram');
const { tempDataDir, mockTelegram, mockGitHub, sign } = require('./helpers');

const SECRET = 'test-webhook-secret';
const AGENT_TOKENS = { ahatjon: 'tok-a', sardor: 'tok-s', shodyona: 'tok-sh', oyatilo: 'tok-o', omadbek: 'tok-om' };

// ---- Vaqtinchalik repo + BARE remote (production repo'ga TEGMAYDI) ----
function tempRepoWithRemote() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hard-repo-'));
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'hard-remote-'));
  execSync('git init --bare -b main', { cwd: remote, stdio: 'pipe' });
  const g = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe' });
  g('init -b main');
  g('config user.email t@t.com');
  g('config user.name T');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init commit"');
  g(`remote add origin ${remote}`);
  g('push -u origin main');
  g('checkout -b sardor');
  g('push -u origin sardor');
  return { dir, remote, g };
}

function makeBot() {
  const tg = mockTelegram();
  const config = {
    telegram: { chatId: -100999 },
    github: { owner: 'o', repo: 'r', defaultBranch: 'main', webhookSecret: SECRET },
    adminIds: ['777'],
    port: 4010,
    notifyWorkflowSuccess: false,
    dataDir: tempDataDir(),
    repoPath: fs.mkdtempSync(path.join(os.tmpdir(), 'hard-botrepo-')),
    agentTokens: AGENT_TOKENS,
  };
  const bot = createBot({ config, telegram: tg });
  return { bot, tg, db: bot.ctx.db, team: bot.ctx.team, agents: bot.ctx.agents, config };
}

function readState(bot) {
  return JSON.parse(fs.readFileSync(path.join(bot.ctx.config.dataDir, 'bot-state.json'), 'utf8'));
}

// ---- 1) modified file → pushed + commitMessage ----
test('hardening: modified file → status=pushed, commitMessage ushlanadi', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v2');
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'pushed');
  assert.ok(/^[0-9a-f]{7,40}$/.test(res.commitHash || ''), 'commit hash qaytadi');
  assert.ok(res.commitMessage && res.commitMessage.includes('Bot push'), 'commitMessage ushlanadi');
});

// ---- 2) untracked file → pushed ----
test('hardening: untracked file → status=pushed', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  fs.writeFileSync(path.join(dir, 'new.txt'), 'brand new');
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'pushed');
  execSync('git fetch origin', { cwd: dir, stdio: 'pipe' });
  const remoteFiles = execSync('git ls-tree --name-only origin/sardor', { cwd: dir, stdio: 'pipe' }).toString();
  assert.ok(remoteFiles.includes('new.txt'), 'untracked fayl remote\u2019ga yuborildi');
});

// ---- 3) clean repo → no_changes ----
test('hardening: clean repo → status=no_changes, keraksiz commit YO\u2019Q', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const before = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'no_changes');
  const after = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(before, after, 'yangi commit yaratilmadi');
});

// ---- 4) "Everything up-to-date" → no_changes ----
test('hardening: "Everything up-to-date" → no_changes (pushed EMAS)', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  fs.writeFileSync(path.join(dir, 'e.txt'), 'e1');
  const r1 = await git.push({ branch: 'sardor' });
  assert.strictEqual(r1.status, 'pushed');
  const oldSha = execSync('git rev-parse origin/sardor~1', { cwd: dir, stdio: 'pipe' }).toString().trim();
  execSync(`git update-ref refs/remotes/origin/sardor ${oldSha}`, { cwd: dir, stdio: 'pipe' });
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.status, 'no_changes', '"up-to-date" hech qachon pushed EMAS');
});

// ---- 5) git failure → error ----
test('hardening: git push failure (remote yo\u2019q) → status=error', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hard-noremote-'));
  const g = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe' });
  g('init -b sardor');
  g('config user.email t@t.com');
  g('config user.name T');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init"');
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.status, 'error');
  assert.ok(res.reason, 'sabab ko\u2018rsatiladi');
});

// ---- 6) wrong branch → rejected ----
test('hardening: boshqa branch → cross-check rad etadi', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const res = await git.push({ branch: 'omadbek' });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.status, 'error');
  assert.ok(res.reason.includes('mos emas'));
});

// ---- 7) main push → rejected ----
test('hardening: main push → TAQIQLANGAN', async () => {
  const { dir } = tempRepoWithRemote();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const res = await git.push({ branch: 'main' });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.status, 'error');
  assert.ok(res.reason.includes('protected'));
});

// ---- 8) offline agent → aniq xabar ----
test('hardening: offline agent → "Agent offline" xabari, command YO\u2019Q', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  // sardor agenti OFFLINE (markSeen chaqirilmadi)
  await bot.handleCallbackQuery({
    id: 'q1', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } },
  });
  const msg = tg.sent.find((s) => s.opts && s.text && s.text.includes('Agent offline'));
  assert.ok(msg, '"Agent offline" xabari bor');
  assert.strictEqual((readState(bot).agentCommands || []).length, 0, 'command yuborilmadi');
});

// ---- 9) invalid agent token → 401 ----
test('hardening: invalid agent token → 401', async () => {
  const db = createDatabase(tempDataDir());
  const agents = createAgents({ config: { agentTokens: AGENT_TOKENS }, db });
  const server = createServer(() => ({ status: 200, body: 'ok' }), { port: 14131, agents });
  await server.listen();
  try {
    const r = await fetch('http://localhost:14131/agent/poll?token=wrong-token');
    assert.strictEqual(r.status, 401);
  } finally {
    await server.close();
  }
});

// ---- 10) webhook invalid signature → 401 ----
test('hardening: webhook invalid signature → 401, xabar YO\u2019Q', () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const handler = createWebhookHandler({
    db, telegram: tg, github: mockGitHub(),
    config: { github: { webhookSecret: SECRET, defaultBranch: 'main' }, adminIds: [] },
  });
  const res = handler({ headers: { 'x-github-event': 'push', 'x-hub-signature-256': 'sha256=deadbeef' }, rawBody: '{}', payload: {} });
  assert.strictEqual(res.status, 401);
  assert.strictEqual(tg.sent.length, 0);
});

// ---- 11) duplicate webhook → ignored ----
test('hardening: duplicate webhook delivery → faqat bir marta', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const handler = createWebhookHandler({
    db, telegram: tg, github: mockGitHub(),
    config: { github: { webhookSecret: SECRET, defaultBranch: 'main' }, adminIds: [] },
  });
  const payload = JSON.stringify({
    ref: 'refs/heads/sardor',
    repository: { default_branch: 'main' },
    pusher: { name: 'sardor' },
    head_commit: { id: 'ab12cd34ef', message: 'Fix', author: { name: 'S' } },
    commits: [{ id: 'ab12cd34ef', message: 'Fix', author: { name: 'S' }, added: [], modified: ['a.js'], removed: [] }],
  });
  const h = { 'x-github-event': 'push', 'x-hub-signature-256': sign(SECRET, payload), 'x-github-delivery': 'dup-9' };
  handler({ headers: h, rawBody: payload, payload: JSON.parse(payload) });
  const r2 = handler({ headers: h, rawBody: payload, payload: JSON.parse(payload) });
  assert.ok(r2.body.includes('duplicate'));
  await new Promise((r) => setTimeout(r, 60));
  assert.strictEqual(tg.sent.length, 1);
});

// ---- 12) webhook push → audit result=pushed ----
test('hardening: webhook push → audit result=pushed (umumiy "success" EMAS)', async () => {
  const db = createDatabase(tempDataDir());
  const tg = mockTelegram();
  const handler = createWebhookHandler({
    db, telegram: tg, github: mockGitHub(),
    config: { github: { webhookSecret: SECRET, defaultBranch: 'main' }, adminIds: [] },
  });
  const payload = JSON.stringify({
    ref: 'refs/heads/sardor',
    repository: { default_branch: 'main' },
    pusher: { name: 'sardor' },
    head_commit: { id: 'aa11bb22cc', message: 'Fix x', author: { name: 'Sardor' } },
    commits: [{ id: 'aa11bb22cc', message: 'Fix x', author: { name: 'Sardor' }, added: [], modified: ['a.js'], removed: [] }],
  });
  handler({ headers: { 'x-github-event': 'push', 'x-hub-signature-256': sign(SECRET, payload), 'x-github-delivery': 'h-audit' }, rawBody: payload, payload: JSON.parse(payload) });
  await new Promise((r) => setTimeout(r, 60));
  assert.strictEqual(db.getLastPush().result, 'pushed');
});

// ---- 13) pull fast-forward → success ----
test('hardening: pull fast-forward → success, HEAD yangilanadi', async () => {
  const { dir, remote } = tempRepoWithRemote();
  const cloneDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hard-clone-'));
  execSync(`git clone "${remote}" "${cloneDir}"`, { stdio: 'pipe' });
  const g2 = (args) => execSync(`git ${args}`, { cwd: cloneDir, stdio: 'pipe' });
  g2('config user.email t@t.com');
  g2('config user.name T');
  g2('checkout main');
  fs.writeFileSync(path.join(cloneDir, 'm.txt'), 'm1');
  g2('add .');
  g2('commit -m "main update"');
  g2('push origin main');
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const before = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const res = await git.pull({ baseBranch: 'main' });
  assert.strictEqual(res.ok, true);
  const after = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.notStrictEqual(before, after, 'main\u2019dan yangi commit olindi');
});

// ---- 14) pull diverged → safe error, repo buzilmaydi ----
test('hardening: pull diverged → safe error (no reset/force/clean)', async () => {
  const { dir, remote, g } = tempRepoWithRemote();
  fs.writeFileSync(path.join(dir, 's.txt'), 's1');
  g('add .');
  g('commit -m "sardor commit"');
  const cloneDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hard-clone2-'));
  execSync(`git clone "${remote}" "${cloneDir}"`, { stdio: 'pipe' });
  const g2 = (args) => execSync(`git ${args}`, { cwd: cloneDir, stdio: 'pipe' });
  g2('config user.email t@t.com');
  g2('config user.name T');
  g2('checkout main');
  fs.writeFileSync(path.join(cloneDir, 'm.txt'), 'm1');
  g2('add .');
  g2('commit -m "main update"');
  g2('push origin main');
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const before = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const res = await git.pull({ baseBranch: 'main' });
  assert.strictEqual(res.ok, false, 'diverged holatda ff-only pull XATO');
  assert.ok(res.reason, 'xavfsiz sabab ko\u2018rsatiladi');
  const after = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(before, after, 'HEAD o\u2019zgarmagan (reset YO\u2019Q)');
  const st = execSync('git status --porcelain', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(st, '', 'working tree toza (conflict qoldiq YO\u2019Q)');
});

// ---- 15) parallel push → per-user lock ----
test('hardening: parallel push so\u2019rovlari → per-user lock', async () => {
  const { bot, tg, team, agents } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  agents.markSeen('sardor');
  const q1 = bot.handleCallbackQuery({ id: 'q1', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } } });
  const q2 = bot.handleCallbackQuery({ id: 'q2', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } } });
  await Promise.all([q1, q2]);
  const lockMsg = tg.sent.find((s) => s.text && s.text.includes('bajarilmoqda'));
  assert.ok(lockMsg, 'ikkinchi parallel so\u2019rov lock xabari oldi');
});

// ---- 16) boshqa user o'zga operationni tasdiqlay olmaydi ----
test('hardening: boshqa user push\u2019ni tasdiqlay olmaydi', async () => {
  const { bot, tg, team, agents } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  agents.markSeen('sardor');
  await bot.handleCallbackQuery({ id: 'q1', data: 'push:confirm:111222', from: { id: 999999 }, message: { chat: { id: 1 } } });
  const denied = tg.sent.find((s) => s.callbackAnswered && s.text && s.text.toLowerCase().includes('sizning'));
  assert.ok(denied, 'callback rad etildi');
  assert.strictEqual((readState(bot).agentCommands || []).length, 0, 'command yuborilmadi');
});

// ---- 17) Telegram 429 → retry ----
test('hardening: Telegram 429 → retry_after bilan qayta urinadi', async () => {
  const origFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return {
        ok: false,
        status: 429,
        json: async () => ({ ok: false, description: 'Too Many Requests', parameters: { retry_after: 0 } }),
        headers: { get: () => null },
      };
    }
    return { ok: true, status: 200, json: async () => ({ ok: true, result: { message_id: 99 } }), headers: { get: () => null } };
  };
  try {
    const tg = createTelegramBot({ token: 'test-token', chatId: 1 });
    const res = await tg.sendMessage('salom');
    assert.strictEqual(res.message_id, 99);
    assert.strictEqual(calls, 2, 'birinchi 429 → ikkinchi urinish muvaffaqiyatli');
  } finally {
    global.fetch = origFetch;
  }
});

// ---- 18) bot restart → navbat/state tiklanadi ----
test('hardening: bot restart → navbat va state tiklanadi', () => {
  const dir = tempDataDir();
  const db1 = createDatabase(dir);
  const agents1 = createAgents({ config: { agentTokens: AGENT_TOKENS }, db: db1 });
  const cmd = agents1.sendCommand('sardor', 'push', 'sardor', 42);
  // "restart": xuddi shu papkadan yangi instansiyalar
  const db2 = createDatabase(dir);
  const agents2 = createAgents({ config: { agentTokens: AGENT_TOKENS }, db: db2 });
  assert.strictEqual(db2.getAgentCommand(cmd.id).status, 'pending', 'navbat faylda saqlangan');
  const taken = agents2.takeCommand('sardor');
  assert.strictEqual(taken.id, cmd.id, 'restartdan keyin ham command olinadi');
  agents2.completeResult(cmd.id, { status: 'pushed', branch: 'sardor', commitHash: 'abc123' });
  assert.strictEqual(db2.getAgentCommand(cmd.id).status, 'pushed');
  assert.strictEqual(db2.agentQueueStats().total, 1);
});

// ---- 19) /health — to'liq holat ----
test('hardening: /health — process, telegram, github, agents, queue', async () => {
  const health = {
    process: 'running',
    telegram: { lastOkAt: Date.now(), connected: true },
    github: { lastOkAt: Date.now(), ok: true },
    git: true,
    agents: [{ memberKey: 'ahatjon', online: true }, { memberKey: 'sardor', online: false }],
    queue: { total: 1, pending: 1, sent: 0, done: 0, failed: 0, timeout: 0 },
    uptime: 12,
  };
  const server = createServer(() => ({ status: 200, body: 'ok' }), { port: 14132, healthProvider: () => health });
  await server.listen();
  try {
    const res = await fetch('http://localhost:14132/health');
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.process, 'running');
    assert.strictEqual(body.telegram.connected, true);
    assert.strictEqual(body.github.ok, true);
    assert.strictEqual(body.agents.length, 2);
    assert.strictEqual(body.queue.pending, 1);
  } finally {
    await server.close();
  }
});

// ---- 20) /pushhistory — statuslar aniq ----
test('hardening: /pushhistory — no_changes \u2139\ufe0f bilan, status nomlari aniq', async () => {
  const { bot, tg, db } = makeBot();
  db.recordPush({ memberName: 'sardor', branch: 'sardor', commitHash: 'abc1234', result: 'pushed', source: 'agent' });
  db.recordPush({ memberName: 'sardor', branch: 'sardor', result: 'no_changes', source: 'agent' });
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 777 }, text: '/pushhistory' });
  const msg = tg.sent[tg.sent.length - 1].text;
  assert.ok(msg.includes('no_changes'), 'no_changes status nomi bor');
  assert.ok(msg.includes('pushed'), 'pushed status nomi bor');
  assert.ok(msg.includes('\u2139\ufe0f'), 'no_changes \u2139\ufe0f ikonkasi bilan');
});