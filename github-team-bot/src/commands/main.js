'use strict';
// commands/main.js — main branch holati
const F = require('../formatters');

async function mainCommand(ctx) {
  const { github, config } = ctx;
  try {
    const commits = await github.listCommits(config.github.defaultBranch, 1);
    const c = commits[0];
    if (!c) return { text: `🌿 Main bo'sh.` };
    let text = `🌿 <b>MAIN</b>\n\n`;
    text += `Latest commit:\n${F.esc((c.commit.message || '').split('\n')[0])}\n\n`;
    text += `👤 ${F.esc(c.commit.author.name)}\n`;
    text += `🕐 ${F.esc(F.timeAgo(c.commit.author.date))}\n`;
    text += `Changed: ${c.files ? c.files.length : c.stats ? '—' : '—'} files\n`;
    if (c.stats) text += `📊 +${c.stats.additions} / -${c.stats.deletions}\n`;
    const keyboard = { inline_keyboard: [[{ text: '🔗 View commit', url: c.html_url }]] };
    return { text, keyboard };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { mainCommand };
