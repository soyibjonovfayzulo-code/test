'use strict';
// ============================================================
// scripts/gen-agent-env.js — har member uchun agent .env yaratish.
//
//   node scripts/gen-agent-env.js
//
// Bot .env dagi AGENT_TOKENS dan har member tokenini olib,
// agent-setup/<member>.env fayllarini yaratadi (gitignored).
// Tokenlar console'ga CHIQMAYDI — faqat fayllarga yoziladi.
// ============================================================
const fs = require('fs');
const path = require('path');

const BOT_DIR = path.join(__dirname, '..');
const OUT_DIR = path.join(BOT_DIR, 'agent-setup');

function readEnv() {
  const p = path.join(BOT_DIR, '.env');
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
const tokens = {};
(env.AGENT_TOKENS || '').split(',').forEach((pair) => {
  const [k, v] = pair.split('=');
  if (k && v) tokens[k.trim()] = v.trim();
});

const members = Object.keys(tokens);
if (members.length !== 5) {
  console.error(`XATO: AGENT_TOKENS da ${members.length} ta token — 5 kerak`);
  process.exit(1);
}

const botUrl = (env.PUBLIC_WEBHOOK_URL || `http://localhost:${env.BOT_PORT || 4010}`).replace('/webhook/github', '').replace(/\/$/, '');

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const member of members) {
  const content = [
    '# OrzuTalim Local Dev Agent — o\'z kompyuteringizga qo\'ying:',
    '#   1. agent/ papkasini nusxa oling',
    '#   2. shu faylni agent/.env nomi bilan saqlang',
    '#   3. REPO_PATH ni o\'z kompyuteringizdagi OrzuTalim repo yo\'liga to\'g\'rilang',
    '#   4. npm start (yoki install-startup.bat bilan Windows startup\'ga qo\'ying)',
    '',
    `AGENT_NAME=${member}`,
    `AGENT_TOKEN=${tokens[member]}`,
    `BOT_URL=${botUrl}`,
    'REPO_PATH=C:\\projects\\orzutalim',
    `BRANCH=${member}`,
    '',
  ].join('\n');
  const file = path.join(OUT_DIR, `${member}.env`);
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ agent-setup/${member}.env yaratildi (token ichida, console'ga chiqmadi)`);
}
console.log(`\nTayyor. agent-setup/ papkasidagi fayllarni har memberga shaxsiy yuboring.`);
