'use strict';
// ============================================================
// scripts/setup-branches.js — GitHub'da member branchlarini yaratish.
//
//   node scripts/setup-branches.js
//
// .env dan GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO o'qiydi.
// Har branch MAIN'dan yaratiladi. Mavjud bo'lsa tegmaydi.
// Member branch nomlari = member keylar (ahatjon, sardor, ...).
// Token logga/Telegramga CHIQMAYDI.
// ============================================================
const fs = require('fs');
const path = require('path');

// .env o'qish (bot papkasidan)
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
const BASE_BRANCH = env.GITHUB_DEFAULT_BRANCH || 'main';
const MEMBER_BRANCHES = ['ahatjon', 'sardor', 'shodyona', 'oyatilo', 'omadbek'];

if (!TOKEN || !OWNER || !REPO) {
  console.error('XATO: .env da GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO kerak');
  process.exit(1);
}

const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'orzutalim-dev-bot-setup',
  'Content-Type': 'application/json',
};

async function main() {
  console.log(`Repo: ${OWNER}/${REPO} | base branch: ${BASE_BRANCH}`);

  // 1) main oxirgi commit sha
  const mainRes = await fetch(`${API}/git/ref/heads/${BASE_BRANCH}`, { headers });
  if (!mainRes.ok) {
    console.error(`XATO: base branch olinmadi (HTTP ${mainRes.status})`);
    process.exit(1);
  }
  const mainRef = await mainRes.json();
  const mainSha = mainRef.object.sha;
  console.log(`Main SHA: ${mainSha.slice(0, 7)}`);

  let created = 0;
  let exists = 0;
  for (const branch of MEMBER_BRANCHES) {
    const checkRes = await fetch(`${API}/git/ref/heads/${branch}`, { headers });
    if (checkRes.ok) {
      console.log(`  ✅ ${branch} — allaqachon mavjud (o'zgartirilmadi)`);
      exists++;
      continue;
    }
    const createRes = await fetch(`${API}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainSha }),
    });
    if (createRes.ok || createRes.status === 422) {
      console.log(`  🌿 ${branch} — yaratildi (main'dan)`);
      created++;
    } else {
      console.error(`  ❌ ${branch} — yaratilmadi (HTTP ${createRes.status})`);
    }
  }
  console.log(`\nTayyor: ${created} yaratildi, ${exists} mavjud edi.`);
  console.log('Keyingi qadam: README §"Agent setup" bo\'yicha agentlarni ishga tushiring.');
}

main().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
