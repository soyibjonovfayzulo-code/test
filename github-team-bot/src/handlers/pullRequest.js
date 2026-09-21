'use strict';
// ============================================================
// handlers/pullRequest.js — PR opened / synchronize / closed / merged /
// conflict ishlov berish. Avtomatik merge QILINMAYDI — faqat ogohlantirish.
// ============================================================
const { logger } = require('../logger');
const F = require('../formatters');

const GITHUB_ACTIONS = {
  OPENED: 'opened',
  REOPENED: 'reopened',
  SYNCHRONIZE: 'synchronize',
  CLOSED: 'closed',
};

async function countPRFiles(github, pr) {
  // PR payload'da changed_files bo'lsa shuni ishlatamiz, aks holda API
  if (pr.changed_files != null) return pr.changed_files;
  try {
    const files = await github.getPRFiles(pr.number);
    return files.length;
  } catch (e) {
    logger.error('PR files olishda xato:', e.message);
    return 0;
  }
}

async function checkMergeable(github, pr) {
  // mergeable webhook payload'da ko'pincha null bo'ladi — API orqali so'raymiz
  try {
    const fresh = await github.getPR(pr.number);
    return { mergeable: fresh.mergeable, mergeableState: fresh.mergeable_state };
  } catch (e) {
    logger.error(`PR mergeable tekshirish xato (#${pr.number}):`, e.message);
    return { mergeable: null, mergeableState: null };
  }
}

async function handlePullRequest(ctx, payload) {
  const { telegram, github, db } = ctx;
  const pr = payload.pull_request;
  if (!pr) return;

  const action = payload.action;
  const authorName = payload.sender && payload.sender.login;
  const isDefaultBase = payload.repository && pr.base && pr.base.ref === payload.repository.default_branch;
  if (!isDefaultBase) {
    // main ga emas, boshqa branchga PR — v1 da skip (spam kamaytirish)
    logger.webhook(`PR #${pr.number} base=${pr.base.ref} (main emas), skip`);
    return;
  }

  // ---- PR MERGED ----
  if (action === GITHUB_ACTIONS.CLOSED && pr.merged) {
    const fileCount = await countPRFiles(github, pr);
    const text = F.formatPRMerged({ pr, fileCount, authorName });
    await telegram.sendMessage(text, {
      keyboard: { inline_keyboard: [[{ text: '👀 PRni ko\'rish', url: github.prUrl(pr.number) }]] },
    });
    logger.webhook(`PR merged notification yuborildi: #${pr.number}`);
    return;
  }

  // ---- PR YOPILDI (merge bo'lmagan) ----
  if (action === GITHUB_ACTIONS.CLOSED) {
    const text = F.formatPRClosed({ pr, authorName });
    await telegram.sendMessage(text, {
      keyboard: { inline_keyboard: [[{ text: '👀 PRni ko\'rish', url: github.prUrl(pr.number) }]] },
    });
    return;
  }

  // ---- PR OPENED / REOPENED ----
  if (action === GITHUB_ACTIONS.OPENED || action === GITHUB_ACTIONS.REOPENED) {
    const fileCount = await countPRFiles(github, pr);
    const text = F.formatPROpened({ pr, fileCount, authorName });
    await telegram.sendMessage(text, {
      keyboard: {
        inline_keyboard: [[
          { text: '👀 PRni ko\'rish', url: github.prUrl(pr.number) },
          { text: '📂 O\'zgarishlarni ko\'rish', url: github.prFilesUrl(pr.number) },
        ]],
      },
    });
    logger.webhook(`PR opened notification yuborildi: #${pr.number}`);
    return;
  }

  // ---- PR SYNCHRONIZE (yangi commit push qilindi) + conflict tekshirish ----
  if (action === GITHUB_ACTIONS.SYNCHRONIZE) {
    const text = F.formatPRUpdated({ pr, authorName });
    await telegram.sendMessage(text, {
      keyboard: {
        inline_keyboard: [[
          { text: '👀 PRni ko\'rish', url: github.prUrl(pr.number) },
          { text: '📂 O\'zgarishlarni ko\'rish', url: github.prFilesUrl(pr.number) },
        ]],
      },
    });
    // conflict best-effort tekshiruv
    const { mergeable, mergeableState } = await checkMergeable(github, pr);
    if (mergeable === false || mergeableState === 'dirty') {
      const conflictText = F.formatPRConflict({ pr, authorName });
      await telegram.sendMessage(conflictText, {
        keyboard: {
          inline_keyboard: [[
            { text: '📋 Buyruqni nusxalash', callback_data: 'copy:git fetch origin\ngit merge origin/main' },
            { text: '👀 PRni ko\'rish', url: github.prUrl(pr.number) },
          ]],
        },
      });
      logger.webhook(`CONFLICT aniqlandi: PR #${pr.number}`);
    }
  }
}

module.exports = { handlePullRequest, GITHUB_ACTIONS };
