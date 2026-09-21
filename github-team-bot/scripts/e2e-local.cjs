'use strict';
// ============================================================
// scripts/e2e-local.cjs — REAL LIVE E2E (izolyatsiyalangan):
//   real server (port 4099) + real agent process + temp git repo
//   + temp bare remote. Asosiy repo va live bot'ga TEGMAYDI.
// Senariylar:
//   A) clean repo      -> status=no_changes
//   B) modified file   -> status=pushed (remote sha tekshiriladi)
//   C) untracked file  -> status=pushed
//   D) push error      -> status=error (fake success YO'Q)
// ============================================================
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = 4099;
const BASE = `http://localhost:${PORT}`;
const results = [];
let agentProc = null;
const tmpDirs = [];

function tmp(prefix) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tmpDirs.push(d);
  return d;
}
function g(args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: 'pipe' }).toString().trim();
}
function cleanup() {
  try { if (agentProc) agentProc.kill(); } catch (_) {}
  for (const d of tmpDirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} }
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitFor(commandId, timeoutMs = 30000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const r = results.find((x) => x.id === commandId);
    if (r) return r;
    await sleep(500);
  }
  throw new Error(`command ${commandId} javob bermadi (${timeoutMs}ms)`);
}

(async () => {
  const { createDatabase } = require(path.join(ROOT, 'src', 'database'));
  const { createAgents } = require(path.join(ROOT, 'src', 'agents'));
  const { createServer } = require(path.join(ROOT, 'src', 'server'));

  // ---- 1. Temp remote (bare) + temp repo ----
  const remoteDir = tmp('e2e-remote-');
  const repoDir = tmp('e2e-repo-');
  g('init -b sardor', repoDir);
  g('config user.email e2e@test.com', repoDir);
  g('config user.name E2E', repoDir);
  fs.writeFileSync(path.join(repoDir, 'a.txt'), 'v1');
  g('add .', repoDir);
  g('commit -m "init"', repoDir);
  g(`init -b sardor --bare ${remoteDir}`);
  g(`remote add origin ${remoteDir}`, repoDir);
  g('push -u origin sardor', repoDir);
  console.log('[E2E] temp repo + bare remote tayyor');

  // ---- 2. Bot tomoni: db + agents + server (port 4099) ----
  const dataDir = tmp('e2e-data-');
  const db = createDatabase(dataDir);
  const agents = createAgents({ config: { agentTokens: { sardor: 'tok-e2e-sardor' } }, db });
  const server = createServer(() => ({ status: 200, body: 'ok' }), {
    port: PORT,
    agents,
    onAgentResult: (cmd) => {
      results.push({ id: cmd.id, status: cmd.status, result: cmd.result || {} });
      console.log(`[E2E] natija: ${cmd.id.slice(0, 8)} status=${cmd.status} ok=${cmd.result && cmd.result.ok} hash=${((cmd.result && cmd.result.commitHash) || '').slice(0, 7)}`);
    },
  });
  await server.listen();

  // ---- 3. Real agent process (agent/src + o'z .env) ----
  const agentDir = tmp('e2e-agent-');
  fs.mkdirSync(path.join(agentDir, 'src'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'agent', 'src', 'agent.js'), path.join(agentDir, 'src', 'agent.js'));
  fs.copyFileSync(path.join(ROOT, 'agent', 'src', 'git.js'), path.join(agentDir, 'src', 'git.js'));
  fs.writeFileSync(path.join(agentDir, '.env'), [
    'AGENT_NAME=sardor',
    'AGENT_TOKEN=tok-e2e-sardor',
    `BOT_URL=${BASE}`,
    `REPO_PATH=${repoDir}`,
    'BRANCH=sardor',
    '',
  ].join('\n'));
  agentProc = spawn(process.execPath, ['src/agent.js'], { cwd: agentDir, stdio: 'ignore', windowsHide: true });
  await sleep(4000); // agent ulanishini kutish

  let failures = 0;
  function check(name, cond, detail) {
    if (cond) console.log(`  ✅ ${name}${detail ? ' — ' + detail : ''}`);
    else { console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); failures++; }
  }

  // ---- A) clean repo -> no_changes (push UMUMAN qilinmaydi) ----
  console.log('\n[A] clean repo -> kutilgan: status=no_changes');
  const shaBefore = g('rev-parse HEAD', repoDir);
  const cmdA = agents.sendCommand('sardor', 'push', 'sardor', null);
  const resA = await waitFor(cmdA.id);
  check('ok=true', resA.result.ok === true, `ok=${resA.result.ok}`);
  check('status=no_changes', resA.result.status === 'no_changes', `status=${resA.result.status}`);
  check('message bor', !!resA.result.message, resA.result.message || "yo'q");
  check("HEAD o'zgarmagan", g('rev-parse HEAD', repoDir) === shaBefore);
  check("remote o'zgarmagan", g('rev-parse origin/sardor', repoDir) === shaBefore);

  // ---- B) modified file -> pushed (real push) ----
  console.log('\n[B] modified file -> kutilgan: status=pushed');
  fs.writeFileSync(path.join(repoDir, 'a.txt'), 'v2-modified');
  const cmdB = agents.sendCommand('sardor', 'push', 'sardor', null);
  const resB = await waitFor(cmdB.id);
  check('ok=true', resB.result.ok === true, `ok=${resB.result.ok}`);
  check('status=pushed', resB.result.status === 'pushed', `status=${resB.result.status}`);
  check('commitHash bor', !!resB.result.commitHash, (resB.result.commitHash || '').slice(0, 7));
  g('fetch origin', repoDir);
  const localB = g('rev-parse HEAD', repoDir);
  const remoteB = g('rev-parse origin/sardor', repoDir);
  check('remote=local (HAQIQATAN yuborildi)', localB === remoteB && localB === resB.result.commitHash, `${localB.slice(0, 7)} vs ${remoteB.slice(0, 7)}`);

  // ---- C) untracked file -> pushed ----
  console.log('\n[C] untracked file -> kutilgan: status=pushed');
  fs.writeFileSync(path.join(repoDir, 'untracked.txt'), 'yangi fayl');
  const cmdC = agents.sendCommand('sardor', 'push', 'sardor', null);
  const resC = await waitFor(cmdC.id);
  check('status=pushed', resC.result.status === 'pushed', `status=${resC.result.status}`);
  g('fetch origin', repoDir);
  check('remote=local', g('rev-parse HEAD', repoDir) === g('rev-parse origin/sardor', repoDir));

  // ---- D) push error -> error (fake success YO'Q) ----
  console.log("\n[D] push error (origin buzilgan) -> kutilgan: status=error");
  const realOrigin = g('remote get-url origin', repoDir);
  g('remote set-url origin Z:/e2e-bu-remote-mavjud-emas', repoDir);
  fs.writeFileSync(path.join(repoDir, 'd.txt'), 'd');
  const cmdD = agents.sendCommand('sardor', 'push', 'sardor', null);
  const resD = await waitFor(cmdD.id);
  g('remote set-url origin ' + realOrigin, repoDir);
  check('ok=false', resD.result.ok === false, `ok=${resD.result.ok}`);
  check('status=error', resD.result.status === 'error', `status=${resD.result.status}`);
  check('reason bor', !!resD.result.reason, (resD.result.reason || '').slice(0, 60));

  // ---- Xulosa ----
  console.log('\n==============================');
  if (failures === 0) console.log("✅ E2E LIVE: 4/4 senariy o'tdi (fake success YO'Q)");
  else { console.log(`❌ E2E LIVE: ${failures} tekshiruv o'tmadi`); process.exitCode = 1; }
})().catch((e) => { console.error('E2E XATO:', e.message); process.exitCode = 1; })
  .finally(() => { cleanup(); process.exit(process.exitCode || 0); });
