'use strict';
// commands/myBranch.js — foydalanuvchining bog'langan branch holati
const F = require('../formatters');

async function myBranchCommand(ctx, msg) {
  const { github, db, config } = ctx;
  const telegramUserId = msg.from && msg.from.id;
  const binding = db.getBindingByTelegramId(telegramUserId);

  if (!binding) {
    return { text: `👤 Sizning GitHub hisobingiz bog'lanmagan.\n\n/bind bilan bog'lang.` };
  }

  if (!binding.branch) {
    return { text: `👤 GitHub: <b>${F.esc(binding.githubUsername)}</b>\n\n🌿 Branch hali ko'rsatilmagan. Admin tomonidan qo'shilishi kerak.` };
  }

  try {
    const cmp = await github.compare(config.github.defaultBranch, binding.branch);
    const behind = cmp.behind_by || 0;
    const ahead = cmp.ahead_by || 0;
    const status = F.branchStatusIcon(ahead, behind);

    let lastMsg = '—';
    let lastUrl = null;
    try {
      const commits = await github.listCommits(binding.branch, 1);
      if (commits[0]) {
        lastMsg = (commits[0].commit.message || '').split('\n')[0];
        lastUrl = commits[0].html_url;
      }
    } catch (_) { /* best-effort */ }

    let text = `👤 <b>YOU</b>\n\n`;
    text += `GitHub:\n<b>${F.esc(binding.githubUsername)}</b>\n\n`;
    text += `Branch:\n🌿 ${F.esc(binding.branch)}\n\n`;
    text += `Status:\n${status.icon} ${F.esc(status.text)}\n\n`;
    text += `Latest commit:\n${F.esc(lastMsg)}\n\n`;
    if (behind > 0) {
      text += `Update:\n<code>git fetch origin\ngit merge origin/main</code>`;
    }
    const rows = [];
    if (behind > 0) {
      rows.push([
        { text: '📋 Copy command', callback_data: 'copy:git fetch origin\ngit merge origin/main' },
        { text: '🔍 Compare branch', url: github.compareUrl(config.github.defaultBranch, binding.branch) },
      ]);
    }
    if (lastUrl) rows.push([{ text: '🔗 Latest commit', url: lastUrl }]);
    return { text, keyboard: rows.length ? { inline_keyboard: rows } : undefined };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { myBranchCommand };
