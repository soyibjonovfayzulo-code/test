'use strict';
// ============================================================
// scripts/simulate-webhook.js — LOCAL TEST MODE
// Localda webhook eventni simulyatsiya qiladi:
//   node scripts/simulate-webhook.js push
//   node scripts/simulate-webhook.js pr-open
//   node scripts/simulate-webhook.js pr-merge
//   node scripts/simulate-webhook.js workflow-fail
// FAQAT localhost:4010 ga yuboradi — production xabar yubormaydi.
// GITHUB_WEBHOOK_SECRET muhit o'zgaruvchisi (yoki bot .env) kerak.
// ============================================================
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// bot .env dan secret o'qish (yengil parser)
function readEnvSecret() {
  const envFile = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = /^GITHUB_WEBHOOK_SECRET=(.*)$/.exec(line.trim());
      if (m && m[1]) return m[1].trim();
    }
  }
  return null;
}

const secret = process.env.GITHUB_WEBHOOK_SECRET || readEnvSecret();
if (!secret) {
  console.error('XATO: GITHUB_WEBHOOK_SECRET o\'rnatilmagan (.env yoki env orqali)');
  process.exit(1);
}

const PORT = process.env.BOT_PORT || 4010;
const type = process.argv[2] || 'push';

const PAYLOADS = {
  push: {
    ref: 'refs/heads/jasurbek/tests',
    repository: { default_branch: 'main', name: 'test' },
    pusher: { name: 'jasurbek' },
    head_commit: { id: 'sim' + crypto.randomBytes(3).toString('hex'), message: 'fix: tests mobile responsive (simulated)', author: { name: 'Jasurbek' } },
    commits: [{
      id: 'sim0001',
      message: 'fix: tests mobile responsive (simulated)',
      author: { name: 'Jasurbek' },
      added: ['tests/sim.js'],
      modified: ['index.html'],
      removed: [],
    }],
  },
  pushMain: {
    ref: 'refs/heads/main',
    repository: { default_branch: 'main', name: 'test' },
    pusher: { name: 'ali' },
    head_commit: { id: 'sim' + crypto.randomBytes(3).toString('hex'), message: 'fix: coding javascript (simulated main)', author: { name: 'Ali' } },
    commits: [{ id: 'sim0002', message: 'fix: coding javascript (simulated)', author: { name: 'Ali' }, added: [], modified: ['coding/script.js'], removed: [] }],
  },
  'pr-open': {
    action: 'opened',
    repository: { default_branch: 'main' },
    sender: { login: 'sardor' },
    pull_request: { number: 42, title: 'Duel mobile responsive (simulated)', user: { login: 'sardor' }, head: { ref: 'sardor/duel' }, base: { ref: 'main' }, changed_files: 12 },
  },
  'pr-merge': {
    action: 'closed',
    repository: { default_branch: 'main' },
    sender: { login: 'sardor' },
    pull_request: { number: 42, title: 'Duel mobile responsive (simulated)', user: { login: 'sardor' }, head: { ref: 'sardor/duel' }, base: { ref: 'main' }, changed_files: 12, merged: true },
  },
  'workflow-fail': {
    action: 'completed',
    workflow_run: {
      name: 'CI',
      head_branch: 'main',
      conclusion: 'failure',
      html_url: 'https://github.com/owner/repo/actions/runs/1',
      actor: { login: 'jasurbek' },
    },
    repository: { default_branch: 'main' },
  },
};

const payload = PAYLOADS[type];
if (!payload) {
  console.error(`Noma'lum event turi: "${type}"`);
  console.error('Mavjud: push, pushMain, pr-open, pr-merge, workflow-fail');
  process.exit(1);
}

const body = JSON.stringify(payload);
const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

(async () => {
  try {
    const res = await fetch(`http://localhost:${PORT}/webhook/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': type.startsWith('pr-') ? 'pull_request' : (type === 'workflow-fail' ? 'workflow_run' : 'push'),
        'X-GitHub-Delivery': 'sim-' + crypto.randomBytes(8).toString('hex'),
        'X-Hub-Signature-256': signature,
      },
      body,
    });
    console.log(`HTTP ${res.status} — ${await res.text()}`);
    if (res.status === 200 && (await res.text()) !== 'invalid signature') {
      console.log('✅ Webhook qabul qilindi — Telegram guruhiga xabar yuborilishi kerak (bot running bo\'lsa)');
    }
  } catch (e) {
    console.error(`XATO: localhost:${PORT} ga ulanib bo'lmadi — bot ishlab turayotganini tekshiring (${e.message})`);
    process.exit(1);
  }
})();
