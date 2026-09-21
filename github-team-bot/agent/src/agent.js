'use strict';
// ============================================================
// agent/agent.js — LOCAL DEV AGENT (har developer kompyuterida).
//
// Central Bot bilan aloqa: HTTP poll (NAT/firewall orqali ishlaydi)
//   GET  {BOT_URL}/agent/poll?token=...   — buyruq olish
//   POST {BOT_URL}/agent/result           — natija qaytarish
//
// Sifatlari:
// - token = agent .env (AGENT_TOKEN) — faqat o'z memberi uchun
// - network uzilsa: exponential backoff reconnect
// - git hang: 60s timeout
// - crash: uncaught handlers + Windows startup + PM2 tavsiya
// - hech qachon o'lik holatda qolmaydi
// ============================================================
const fs = require('fs');
const path = require('path');
const { createAgentGit } = require('./git');

// ---- .env yuklash (agent papkasidan) ----
function loadEnv(dir) {
  const p = path.join(dir, '.env');
  if (!fs.existsSync(p)) return {};
  const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').replace(/\u0000/g, '');
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return out;
}

const AGENT_DIR = path.join(__dirname, '..');
const env = { ...loadEnv(AGENT_DIR), ...process.env };

const BOT_URL = (env.BOT_URL || 'http://localhost:4010').replace(/\/$/, '');
const AGENT_NAME = (env.AGENT_NAME || '').trim();
const AGENT_TOKEN = (env.AGENT_TOKEN || '').trim();
const REPO_PATH = (env.REPO_PATH || '').trim();
const BRANCH = (env.BRANCH || '').trim() || null;

function log(...parts) { console.log('[AGENT]', AGENT_NAME || '?', ...parts); }
function logErr(...parts) { console.error('[AGENT]', AGENT_NAME || '?', ...parts); }

// ---- Validatsiya ----
if (!AGENT_NAME || !AGENT_TOKEN || !REPO_PATH || !BRANCH) {
  logErr('KONFIGURATSIYA XATO: .env da AGENT_NAME, AGENT_TOKEN, REPO_PATH, BRANCH hammasi kerak');
  logErr('Namuna: agent/.env.example ga qarang');
  process.exit(1);
}

const git = createAgentGit({ repoPath: REPO_PATH, allowedBranch: BRANCH });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- HTTP fetch timeout bilan ----
async function fetchWithTimeout(url, options = {}, timeoutMs = 40000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

// ---- Buyruqni bajarish (faqat whitelist: push/pull) ----
async function executeCommand(cmd) {
  if (cmd.type === 'push') {
    log('PUSH boshlandi (branch:', cmd.branch + ')');
    const res = await git.push({ branch: cmd.branch || BRANCH });
    log('PUSH natija:', res.ok ? 'SUCCESS' : 'FAIL', res.reason || res.commitHash || '');
    return res;
  }
  if (cmd.type === 'pull') {
    log('PULL boshlandi (base: main)');
    const res = await git.pull({ baseBranch: 'main' });
    log('PULL natija:', res.ok ? 'SUCCESS' : 'FAIL', res.reason || '');
    return res;
  }
  return { ok: false, reason: `Noma'lum command type: ${cmd.type}` };
}

// ---- Natijani botga qaytarish ----
async function postResult(commandId, result, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(`${BOT_URL}/agent/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: AGENT_TOKEN,
          commandId,
          ok: !!result.ok,
          branch: result.branch || BRANCH,
          commitHash: result.commitHash || null,
          commitMessage: result.commitMessage || null,
          reason: result.reason || null,
          output: result.output || null,
        }),
      }, 15000);
      if (res.ok) { log('natija yuborildi'); return true; }
      logErr('result status:', res.status);
    } catch (e) {
      logErr('result yuborishda xato:', e.message);
    }
    await sleep(2000 * (attempt + 1));
  }
  return false;
}

// ---- ASOSIY LOOP (hech qachon tugamaydi) ----
let backoffMs = 3000;
let connectedOnce = false;

async function loop() {
  while (true) {
    try {
      const res = await fetchWithTimeout(`${BOT_URL}/agent/poll?token=${encodeURIComponent(AGENT_TOKEN)}`, {}, 35000);
      if (res.status === 401) {
        logErr('TOKEN INVALID (401) — agent .env dagi AGENT_TOKEN noto\'g\'ri. 60s dan keyin qayta...');
        await sleep(60000);
        continue;
      }
      if (!res.ok) throw new Error(`poll HTTP ${res.status}`);
      const data = await res.json();
      if (!connectedOnce) { log(`bot bilan ulanish OK (${BOT_URL}) — poll ishlayapti`); connectedOnce = true; }
      backoffMs = 3000; // success reset

      if (data && data.command) {
        const cmd = data.command;
        log('COMMAND olindi:', cmd.id.slice(0, 8), cmd.type, cmd.branch || '');
        let result;
        try {
          result = await executeCommand(cmd);
        } catch (e) {
          result = { ok: false, reason: `Agent ichki xato: ${e.message}` };
        }
        await postResult(cmd.id, result);
      } else {
        await sleep(3000); // oddiy poll interval
      }
    } catch (e) {
      logErr(connectedOnce ? 'poll xato:' : 'bot ga ulanib bo\'lmadi:', e.message, `— ${Math.round(backoffMs / 1000)}s dan keyin qayta`);
      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs * 2, 60000); // exponential backoff, max 60s
    }
  }
}

// ---- Crash himoyasi ----
process.on('uncaughtException', (e) => logErr('uncaughtException:', e.message));
process.on('unhandledRejection', (e) => logErr('unhandledRejection:', e && e.message ? e.message : String(e)));

// ---- Start ----
(async () => {
  log('ishga tushmoqda...');
  log(`BOT_URL: ${BOT_URL}`);
  log(`REPO_PATH: ${REPO_PATH}`);
  log(`BRANCH: ${BRANCH}`);
  const repoOk = await git.isRepo();
  log(repoOk ? '✅ Git repository detected' : '❌ Git repository NOT FOUND — REPO_PATH tekshiring');
  loop();
})();


