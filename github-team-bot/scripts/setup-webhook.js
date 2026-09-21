'use strict';
// ============================================================
// scripts/setup-webhook.js — GitHub webhook'ni avtomatik yaratish.
//
//   node scripts/setup-webhook.js
//
// .env dan GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO,
// GITHUB_WEBHOOK_SECRET, PUBLIC_WEBHOOK_URL o'qiydi.
// PUBLIC_WEBHOOK_URL bo'sh bo'lsa — tushuntiradi va chiqadi.
// Mavjud webhook'ni YANGILAYDI (patch) yoki yaratadi.
// ============================================================
const fs = require('fs');
const path = require('path');

function readEnv() {
  const p = path.join(__dirname, '..', '.env');
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

const env = readEnv();
const TOKEN = env.GITHUB_TOKEN;
const OWNER = env.GITHUB_OWNER;
const REPO = env.GITHUB_REPO;
const SECRET = env.GITHUB_WEBHOOK_SECRET;
const WEBHOOK_URL = env.PUBLIC_WEBHOOK_URL;

if (!TOKEN || !OWNER || !REPO || !SECRET) {
  console.error('XATO: .env da GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_WEBHOOK_SECRET kerak');
  process.exit(1);
}
if (!WEBHOOK_URL) {
  console.error('XATO: PUBLIC_WEBHOOK_URL bo\'sh.');
  console.error('.env ga PUBLIC_WEBHOOK_URL=https://<sizning-server>/webhook/github yozing');
  console.error('(Reverse proxy: https://domain/webhook/github → localhost:4010/webhook/github)');
  process.exit(1);
}

const API = `https://api.github.com/repos/${OWNER}/${REPO}/hooks`;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'orzutalim-dev-bot-setup',
  'Content-Type': 'application/json',
};

async function main() {
  const config = {
    url: WEBHOOK_URL,
    content_type: 'json',
    secret: SECRET,
    insecure_ssl: '0',
  };
  const events = ['push', 'pull_request', 'workflow_run'];

  // mavjud webhooklarni tekshirish
  const listRes = await fetch(API, { headers });
  if (!listRes.ok) {
    console.error(`webhooklar ro'yxati olinmadi (HTTP ${listRes.status})`);
    process.exit(1);
  }
  const hooks = await listRes.json();
  const existing = hooks.find((h) => h.config && h.config.url === WEBHOOK_URL);

  const payload = { name: 'webhook', config, events, active: true };

  if (existing) {
    const patchRes = await fetch(`${API}/${existing.id}`, {
      method: 'PATCH', headers, body: JSON.stringify({ config, events, active: true }),
    });
    if (patchRes.ok) {
      console.log(`✅ Mavjud webhook YANGILANDI (id ${existing.id}) → ${WEBHOOK_URL}`);
      console.log(`Events: ${events.join(', ')}`);
    } else {
      console.error(`❌ Webhook yangilanmadi (HTTP ${patchRes.status})`);
      process.exit(1);
    }
  } else {
    const createRes = await fetch(API, {
      method: 'POST', headers, body: JSON.stringify(payload),
    });
    if (createRes.ok) {
      const hook = await createRes.json();
      console.log(`✅ Webhook YARATILDI (id ${hook.id}) → ${WEBHOOK_URL}`);
      console.log(`Events: ${events.join(', ')}`);
    } else {
      const err = await createRes.json().catch(() => ({}));
      console.error(`❌ Webhook yaratilmadi (HTTP ${createRes.status}):`, err.message || '');
      process.exit(1);
    }
  }
}

main().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
