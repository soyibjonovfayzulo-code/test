'use strict';
// commands/commits.js — so'nggi commitlar (main)
const F = require('../formatters');

async function commitsCommand(ctx) {
  const { github, config } = ctx;
  try {
    const commits = await github.listCommits(config.github.defaultBranch, 5);
    let text = `📝 <b>LAST COMMITS</b>\n\n`;
    const items = commits.map((c, i) => {
      const msg = (c.commit.message || '').split('\n')[0];
      const author = c.commit.author ? c.commit.author.name : 'unknown';
      return `${i + 1}. 👤 ${F.esc(author)}\n   ${F.esc(msg)}`;
    });
    text += items.join('\n\n');
    // inline_keyboard: qatorlar massivi, har qatorda button-OBJECTlar
    // (oldin tashqi [ ] ortiqcha bo'lgan -> "InlineKeyboardButton must be an Object" xatosi)
    const keyboard = {
      inline_keyboard: commits.slice(0, 5).map((c) => [
        { text: `• ${(c.commit.message || '').split('\n')[0].slice(0, 24)}`, url: c.html_url },
      ]),
    };
    return { text, keyboard };
  } catch (e) {
    return { text: F.formatGitHubError(e) };
  }
}

module.exports = { commitsCommand };
