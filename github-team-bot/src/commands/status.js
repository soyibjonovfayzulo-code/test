'use strict';
// commands/status.js
const F = require('../formatters');

async function statusCommand(ctx) {
  const { github, config } = ctx;
  try {
    const branch = await github.getBranch(config.github.defaultBranch);
    const lastCommit = branch.commit;
    const openPRs = await github.listOpenPRs();
    const branches = await github.listBranches();
    const pendingReview = openPRs.filter((pr) => (pr.requested_reviewers || []).length > 0).length;

    let text = `📊 <b>ORZUTALIM STATUS</b>\n\n`;
    text += `Main:\n✅ Healthy\n\n`;
    text += `Last commit:\n${F.esc((lastCommit.commit.message || '').split('\n')[0])}\n`;
    text += `👤 ${F.esc(lastCommit.commit.author ? lastCommit.commit.author.name : 'unknown')}\n`;
    text += `🕐 ${F.esc(F.timeAgo(lastCommit.commit.author && lastCommit.commit.author.date))}\n\n`;
    text += `Open PR: <b>${openPRs.length}</b>\n`;
    text += `Pending review: <b>${pendingReview}</b>\n`;
    text += `Branches: <b>${branches.length}</b>`;
    return { text };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { statusCommand };
