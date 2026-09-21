'use strict';
// commands/pullRequests.js — ochiq PRlar
const F = require('../formatters');

async function pullRequestsCommand(ctx) {
  const { github } = ctx;
  try {
    const prs = await github.listOpenPRs();
    if (!prs.length) {
      return { text: `🔀 Ochiq pull request yo'q.` };
    }
    let text = `🔀 <b>OPEN PULL REQUESTS</b>\n\n`;
    const rows = [];
    for (const pr of prs) {
      const mergeable = pr.mergeable === false ? '❌ conflict' : pr.mergeable === true ? '✅ mergeable' : '⏳ tekshirilmoqda';
      text += `<b>#${pr.number}</b>\n`;
      text += `👤 ${F.esc(pr.user && pr.user.login)}\n`;
      text += `${F.esc(pr.title)}\n`;
      text += `${F.esc(pr.head.ref)} → ${F.esc(pr.base.ref)}\n`;
      text += `Review: ${pr.draft ? '📝 draft' : '👀 ready'} | Merge: ${mergeable}\n\n`;
      rows.push([{ text: `#PR${pr.number} — ${pr.title.slice(0, 22)}`, url: pr.html_url }]);
    }
    return { text, keyboard: { inline_keyboard: rows } };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { pullRequestsCommand };
