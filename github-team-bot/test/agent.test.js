'use strict';
// ============================================================
// test/agent.test.js — Local Dev Agent arxitekturasi:
// token auth, command queue, agent git workflow
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { createDatabase } = require('../src/database');
const { createAgents } = require('../src/agents');
const { createAgentGit, runGit } = require('../agent/src/git');
const { tempDataDir } = require('./helpers');

// ---- Vaqtinchalik local git repo (agent testlari uchun) ----
function tempGitRepo({ withRemote = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentrepo-'));
  const g = (args, cwd = dir) => execSync(`git ${args}`, { cwd, stdio: 'pipe' });
  g('init -b sardor');
  g('config user.email test@test.com');
  g('config user.name Test');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init commit"');
  if (withRemote) {
    const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'agentremote-'));
    g('init -b sardor --bare', remote);
    g(`remote add origin ${remote}`);
    g('push -u origin sardor');
    return { dir, remote };
  }
  return { dir, remote: null };
}

const AGENT_TOKENS = {
  ahatjon: 'tok-ahatjon-1',
  sardor: 'tok-sardor-2',
  shodyona: 'tok-shodyona-3',
  oyatilo: 'tok-oyatilo-4',
  omadbek: 'tok-omadbek-5',
};

test('agents: token auth — to\'g\'ri token member qaytaradi, noto\'g\'risi null', () => {
  const db = createDatabase(tempDataDir());
  const agents = createAgents({ config: { agentTokens: AGENT_TOKENS }, db });
  assert.strictEqual(agents.memberByToken('tok-sardor-2'), 'sardor');
  assert.strictEqual(agents.memberByToken('tok-ahatjon-1'), 'ahatjon');
  assert.strictEqual(agents.memberByToken('tok-yolgon'), null);
  assert.strictEqual(agents.memberByToken(''), null);
  assert.strictEqual(agents.memberByToken(undefined), null);
});

test('agents: command queue — send/take/finish (faqat o\'z agenti oladi)', () => {
  const db = createDatabase(tempDataDir());
  const agents = createAgents({ config: { agentTokens: AGENT_TOKENS }, db });
  const cmd = agents.sendCommand('sardor', 'push', 'sardor', 12345);
  assert.strictEqual(cmd.status, 'pending');
  assert.strictEqual(cmd.chatId, '12345');
  // ahatjon agenti sardor commandini OLOLMAYDI
  assert.strictEqual(agents.takeCommand('ahatjon'), null);
  const taken = agents.takeCommand('sardor');
  assert.strictEqual(taken.id, cmd.id);
  assert.strictEqual(taken.status, 'sent');
  // ikkinchi marta — yo'q
  assert.strictEqual(agents.takeCommand('sardor'), null);
  agents.completeResult(cmd.id, { status: 'done', commitHash: 'abc123' });
  const done = db.getAgentCommand(cmd.id);
  assert.strictEqual(done.status, 'done');
  assert.strictEqual(done.result.commitHash, 'abc123');
  // online tracking
  assert.strictEqual(agents.isOnline('sardor'), true);
  assert.strictEqual(agents.isOnline('shodyona'), false);
});

test('agents: timeout — javob bermagan command timeout statusiga o\'tadi', () => {
  const db = createDatabase(tempDataDir());
  const agents = createAgents({ config: { agentTokens: AGENT_TOKENS }, db });
  const cmd = agents.sendCommand('sardor', 'push', 'sardor', 1);
  agents.takeCommand('sardor');
  const stale = agents.staleCommands();
  // hali fresh — stale yo'q
  assert.deepStrictEqual(stale, []);
  agents.completeResult(cmd.id, { status: 'timeout', reason: "javob yo'q" });
  assert.strictEqual(db.getAgentCommand(cmd.id).status, 'timeout');
});

test('agent git: push workflow — dirty repo add+commit+push REAL bajaradi (B: modified file)', async () => {
  const { dir } = tempGitRepo({ withRemote: true });
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v2-modified');
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true, 'real push success (exit code 0)');
  assert.strictEqual(res.status, 'pushed', 'status aniq: pushed (yangi commit remote\'ga yuborildi)');
  assert.ok(res.commitHash, 'commit hash bor');
  assert.ok(res.commitMessage.includes('Bot push'));
  // remote = local (real push tasdiqlanadi)
  execSync('git fetch origin', { cwd: dir, stdio: 'pipe' });
  const local = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const remote = execSync('git rev-parse origin/sardor', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(local, remote);
});

test('agent git: untracked fayl — add+commit+push REAL (C: untracked file)', async () => {
  const { dir } = tempGitRepo({ withRemote: true });
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  fs.writeFileSync(path.join(dir, 'untracked.txt'), 'untracked content');
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'pushed', 'untracked fayl commit bo\'lib remote\'ga yuborildi');
  execSync('git fetch origin', { cwd: dir, stdio: 'pipe' });
  const local = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const remote = execSync('git rev-parse origin/sardor', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(local, remote);
});

test('agent git: clean repo — push QILINMAYDI, status=no_changes (A + keraksiz commit YO\'Q)', async () => {
  const { dir } = tempGitRepo({ withRemote: true });
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const before = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'no_changes', 'clean repo — pushed EMAS, no_changes');
  assert.strictEqual(res.message, "Yangi o'zgarish yo'q");
  const after = execSync('git rev-parse HEAD', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(before, after, 'keraksiz commit YO\'Q');
  // remote ham o'zgarmagan
  execSync('git fetch origin', { cwd: dir, stdio: 'pipe' });
  const remote = execSync('git rev-parse origin/sardor', { cwd: dir, stdio: 'pipe' }).toString().trim();
  assert.strictEqual(before, remote, 'remote\'ga hech narsa yuborilmadi');
});

test('agent git: "Everything up-to-date" — status=no_changes (E: pushed EMAS)', async () => {
  const { dir } = tempGitRepo({ withRemote: true });
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  // 1) haqiqiy push (remote yangilanadi)
  fs.writeFileSync(path.join(dir, 'e.txt'), 'e1');
  const r1 = await git.push({ branch: 'sardor' });
  assert.strictEqual(r1.status, 'pushed');
  // 2) remote-tracking refni ORQAGA suramiz (stale) — rev-list "ahead>0" deydi,
  //    lekin aslida remote allaqachon shu commitda → push "Everything up-to-date" qaytaradi
  const oldSha = execSync('git rev-parse origin/sardor~1', { cwd: dir, stdio: 'pipe' }).toString().trim();
  execSync(`git update-ref refs/remotes/origin/sardor ${oldSha}`, { cwd: dir, stdio: 'pipe' });
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.status, 'no_changes', '"Everything up-to-date" → pushed EMAS, no_changes');
});

test('agent git: boshqa branchda tursa — checkout so\'raydi (xavfsiz xato)', async () => {
  const { dir } = tempGitRepo({ withRemote: true });
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'ahatjon' });
  execSync('git checkout -b ahatjon', { cwd: dir, stdio: 'pipe' });
  execSync('git checkout sardor', { cwd: dir, stdio: 'pipe' });
  const res = await git.push({ branch: 'ahatjon' });
  assert.strictEqual(res.ok, false);
  assert.ok(res.reason.includes('checkout'));
});

test('agent git: main push TAQIQLANGAN + branch cross-check', async () => {
  const { dir } = tempGitRepo();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  const r1 = await git.push({ branch: 'ahatjon' });
  assert.strictEqual(r1.ok, false);
  assert.ok(r1.reason.includes('mos emas'));
  const r2 = await git.push({ branch: 'main' });
  assert.strictEqual(r2.ok, false);
  assert.ok(r2.reason.includes('protected'));
});

test('agent git: shell injection argumentlari rad etiladi', async () => {
  const { dir } = tempGitRepo();
  const r = await runGit(dir, ['commit', '-m', 'msg; rm -rf /'], { allowSpaces: true });
  assert.strictEqual(r.ok, false);
  assert.ok(r.stderr.includes('Xavfsizlik'));
  const r2 = await runGit(dir, ['push', 'origin', 'main; echo hacked']);
  assert.strictEqual(r2.ok, false);
  // repo sog'lom
  const st = await runGit(dir, ['status', '--porcelain']);
  assert.strictEqual(st.ok, true);
});

test('agent git: push remote yo\'q bo\'lsa — XATO status=error (D: fake success YO\'Q)', async () => {
  const { dir } = tempGitRepo();
  const git = createAgentGit({ repoPath: dir, allowedBranch: 'sardor' });
  // repo allaqachon sardor branchida (init -b sardor) — checkout kerak emas
  fs.writeFileSync(path.join(dir, 'x.txt'), 'x');
  const res = await git.push({ branch: 'sardor' });
  assert.strictEqual(res.ok, false, 'remote yo\'q — push XATO');
  assert.strictEqual(res.status, 'error', 'status aniq: error');
  assert.ok(res.reason);
});


