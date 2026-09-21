'use strict';
// scripts/smoke-agents.js — real bot'ga qarshi agent flow smoke test
// (bot npm start bilan ishlayotgan bo'lishi kerak, port .env BOT_PORT)
// Tokenlar .env dan o'qiladi — OUTPUTGA CHIQARMAYDI.
const fs = require('fs');
const path = require('path');

function readEnv() {
  const raw = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').replace(/^\uFEFF/, '');
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

(async () => {
  const env = readEnv();
  const port = env.BOT_PORT || 4010;
  const base = `http://localhost:${port}`;
  const tokens = {};
  (env.AGENT_TOKENS || '').split(',').forEach((p) => {
    const [k, v] = p.split('=');
    if (k && v) tokens[k.trim()] = v.trim();
  });

  // 1. health
  const h = await (await fetch(`${base}/health`)).json();
  console.log(`health: ok=${h.ok} telegram=${h.telegram} git=${h.git} uptime=${h.uptime}`);

  // 2. invalid token -> 401
  const r1 = await fetch(`${base}/agent/poll?token=INVALID`);
  console.log('invalid token:', r1.status === 401 ? '401 ✅' : 'XATO ❌');

  // 3. har agent poll (command yo'q kutiladi)
  for (const [member, token] of Object.entries(tokens)) {
    const r = await fetch(`${base}/agent/poll?token=${encodeURIComponent(token)}`);
    const d = await r.json();
    console.log(`agent ${member}: poll ok=${d.ok} command=${d.command === null ? 'yoq (kutiladi)' : 'BOR?'}`);
  }

  // 4. sardor agentiga command jo'natish + agent tomonidan olib, natija qaytarish
  // (bu simulyatsiya — haqiqiy agent xuddi shu HTTP chaqiruvlarni qiladi)
  const sardorToken = tokens.sardor;
  const r5 = await fetch(`${base}/agent/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'NOT-A-TOKEN', commandId: 'x', ok: true }),
  });
  console.log('invalid result token:', r5.status === 401 ? '401 ✅' : 'XATO ❌');
  console.log('SMOKE DONE ✅');
})().catch((e) => { console.error('SMOKE XATO:', e.message); process.exit(1); });
