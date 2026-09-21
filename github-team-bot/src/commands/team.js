'use strict';
// commands/team.js — jamoa a'zolari va branchlar holati (main ga nisbatan)
const F = require('../formatters');

async function teamCommand(ctx) {
  const { github, db, config } = ctx;
  try {
    const bindings = db.getAllBindings();
    if (!bindings.length) {
      return { text: `👥 Team hali bog'lanmagan.\n\n/bind bilan GitHub hisobingizni bog'lang.` };
    }
    let text = `👥 <b>ORZUTALIM TEAM</b>\n\n`;
    for (const b of bindings) {
      let status = { icon: '⚪', text: 'branch ko\'rsatilmagan' };
      if (b.branch) {
        try {
          const cmp = await github.compare(config.github.defaultBranch, b.branch);
          status = F.branchStatusIcon(cmp.ahead_by || 0, cmp.behind_by || 0);
        } catch (e) {
          status = { icon: '❓', text: 'branch tekshirilmadi' };
        }
      }
      text += `${status.icon} <b>${F.esc(b.githubUsername)}</b>\n`;
      if (b.branch) text += `  🌿 ${F.esc(b.branch)} — ${F.esc(status.text)}\n`;
      text += `\n`;
    }
    return { text };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { teamCommand };
