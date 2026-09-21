'use strict';
// ============================================================
// test/agent-flow.test.js — UI → Agent → Result integratsiyasi:
// push command routing, onAgentResult, offline agent,
// server agent endpoints
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { createDatabase } = require('../src/database');
const { createAgents } = require('../src/agents');
const { createBot } = require('../src/index');
const { createServer } = require('../src/server');
const { tempDataDir, mockTelegram, mockGitHub } = require('./helpers');

const SECRET = 'test-webhook-secret';
const AGENT_TOKENS = {
  ahatjon: 'tok-a', sardor: 'tok-s', shodyona: 'tok-sh', oyatilo: 'tok-o', omadbek: 'tok-om',
};

function tempGitRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flowrepo-'));
  const g = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe' });
  g('init -b sardor');
  g('config user.email t@t.com');
  g('config user.name T');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init commit"');
  return dir;
}

function makeBot() {
  const tg = mockTelegram();
  const dataDir = tempDataDir();
  const config = {
    telegram: { chatId: -100999 },
    github: { owner: 'o', repo: 'r', defaultBranch: 'main', webhookSecret: SECRET },
    adminIds: ['777'],
    port: 4010,
    notifyWorkflowSuccess: false,
    dataDir,
    repoPath: tempGitRepo(),
    agentTokens: AGENT_TOKENS,
  };
  const bot = createBot({ config, telegram: tg });
  return { bot, tg, db: bot.ctx.db, team: bot.ctx.team, agents: bot.ctx.agents, config };
}

function readState(bot) {
  return JSON.parse(fs.readFileSync(path.join(bot.ctx.config.dataDir, 'bot-state.json'), 'utf8'));
}

test('bot: push flow — online agentga command yuboriladi', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  bot.ctx.agents.markSeen('sardor'); // agent ONLINE
  await bot.handleCommand({ chat: { id: 1 }, from: { id: 111222 }, text: '🚀 Git Push' });
  assert.ok(tg.sent[0].text.includes('GIT PUSH'));
  assert.ok(tg.sent[0].text.includes('ONLINE'));
  await bot.handleCallbackQuery({
    id: 'q1', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } },
  });
  const sentToUser = tg.sent.filter((s) => s.opts && String(s.opts.chatId) === '1');
  assert.ok(sentToUser.some((s) => s.text.includes('Agentga yuborildi')));
  const state = readState(bot);
  assert.strictEqual(state.agentCommands.length, 1);
  assert.strictEqual(state.agentCommands[0].memberKey, 'sardor');
  assert.strictEqual(state.agentCommands[0].type, 'push');
});

test('bot: agent result push success — GIT PUSH BO\'LDI + group + audit', async () => {
  const { bot, tg, db, team, agents } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  agents.markSeen('sardor');
  await bot.handleCallbackQuery({
    id: 'q1', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } },
  });
  const agentCmd = readState(bot).agentCommands.find((c) => c.type === 'push');
  assert.ok(agentCmd, 'command queueda bor');
  bot.ctx.ui.onAgentResult({ ...agentCmd, status: 'done', result: { ok: true, branch: 'sardor', commitHash: 'abc1234def', commitMessage: 'Fix mobile tests' } });
  await new Promise((r) => setTimeout(r, 30));
  const userMsg = tg.sent.find((s) => s.opts && String(s.opts.chatId) === '1' && s.text.includes("GIT PUSH BO'LDI"));
  assert.ok(userMsg, '"GIT PUSH BO\'LDI" bor');
  assert.ok(userMsg.text.includes('sardor'));
  assert.ok(userMsg.text.includes('abc1234'), 'commit hash (7 xona) ko\'rsatiladi');
  const groupMsg = tg.sent.find((s) => s.opts && String(s.opts.chatId) === '-100999' && s.text.includes('GIT ACTIVITY'));
  assert.ok(groupMsg, 'guruhga GIT ACTIVITY ketti');
  const last = db.getLastPush();
  assert.strictEqual(last.source, 'agent');
  assert.strictEqual(last.commitHash, 'abc1234def');
});

test('bot: agent result push failure — GIT PUSH BO\'LMADI (fake success YO\'Q)', async () => {
  const { bot, tg, team, agents } = makeBot();
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  agents.markSeen('sardor');
  await bot.handleCallbackQuery({
    id: 'q2', data: 'push:confirm:111222', from: { id: 111222 }, message: { chat: { id: 1 } },
  });
  const agentCmd = readState(bot).agentCommands.filter((c) => c.type === 'push').pop();
  bot.ctx.ui.onAgentResult({ ...agentCmd, status: 'failed', result: { ok: false, branch: 'sardor', reason: 'error: failed to push some refs' } });
  await new Promise((r) => setTimeout(r, 30));
  const failMsg = tg.sent.find((s) => s.opts && s.text.includes("GIT PUSH BO'LMADI"));
  assert.ok(failMsg, '"GIT PUSH BO\'LMADI" bor');
  assert.ok(failMsg.text.includes('failed to push some refs'));
  assert.strictEqual(tg.sent.filter((s) => s.opts && s.text.includes("GIT PUSH BO'LDI") && String(s.opts.chatId) === '1').length, 0, 'FAKE SUCCESS YO\'Q');
});

test('bot: offline agent — push rad etiladi (command yuborilmaydi)', async () => {
  const { bot, tg, team } = makeBot();
  team.claim('shodyona', 333333);
  team.setBranch('shodyona', 'shodyona');
  // shodyona agenti OFFLINE
  await bot.handleCallbackQuery({
    id: 'q3', data: 'push:confirm:333333', from: { id: 333333 }, message: { chat: { id: 1 } },
  });
  const offlineMsg = tg.sent.find((s) => s.opts && s.text && s.text.includes('Agent ulanmagan'));
  assert.ok(offlineMsg, '"Agent ulanmagan" xabari bor');
  assert.strictEqual((readState(bot).agentCommands || []).length, 0, 'command yuborilmadi');
});

test('server: agent endpoints — poll/result token auth', async () => {
  const db = createDatabase(tempDataDir());
  const agents = createAgents({ config: { agentTokens: AGENT_TOKENS }, db });
  let received = null;
  const server = createServer(() => ({ status: 200, body: 'ok' }), {
    port: 14123,
    agents,
    onAgentResult: (cmd) => { received = cmd; },
  });
  await server.listen();
  try {
    const r1 = await fetch('http://localhost:14123/agent/poll?token=wrong');
    assert.strictEqual(r1.status, 401);
    const r2 = await fetch('http://localhost:14123/agent/poll?token=tok-s');
    const d2 = await r2.json();
    assert.strictEqual(d2.ok, true);
    assert.strictEqual(d2.command, null);
    agents.sendCommand('sardor', 'pull', 'sardor', 42);
    const r3 = await fetch('http://localhost:14123/agent/poll?token=tok-s');
    const d3 = await r3.json();
    assert.strictEqual(d3.command.type, 'pull');
    assert.strictEqual(d3.command.branch, 'sardor');
    const r4 = await fetch('http://localhost:14123/agent/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'tok-s', commandId: d3.command.id, ok: true, branch: 'sardor', output: 'up-to-date' }),
    });
    assert.strictEqual(r4.status, 200);
    assert.ok(received, 'onAgentResult chaqirildi');
    assert.strictEqual(received.status, 'done');
    const r5 = await fetch('http://localhost:14123/agent/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'wrong-token', commandId: d3.command.id, ok: true }),
    });
    assert.strictEqual(r5.status, 401);
  } finally {
    await server.close();
  }
});


