'use strict';
// ============================================================
// handlers/push.js — push event ishlov berish:
// 1. Branch push xabari (+/-, fayllar, module)
// 2. main yangilansa: alohida xabar + har member branchiga ko'rsatma
// 3. Bound branchlar main'dan orqada qolganini tekshirish
// ============================================================
const { logger } = require('../logger');
const F = require('../formatters');

async function getPushStats(github, payload) {
  // push payload'da +/- yo'q — head commitni API orqali olib hisoblaymiz (best-effort)
  try {
    const head = payload.head_commit && payload.head_commit.id;
    if (!head) return { additions: 0, deletions: 0 };
    const commit = await github.getCommit(head);
    const additions = (commit.files || []).reduce((a, f) => a + (f.additions || 0), 0);
    const deletions = (commit.files || []).reduce((a, f) => a + (f.deletions || 0), 0);
    return { additions, deletions };
  } catch (e) {
    logger.error('push stats olishda xato:', e.message);
    return { additions: 0, deletions: 0 };
  }
}

async function handlePush(ctx, payload) {
  const { telegram, github, db, config } = ctx;
  const defaultBranch = (payload.repository && payload.repository.default_branch) || config.github.defaultBranch;

  // Branch o'chirilgan pushlar — xabar yo'q
  if (payload.deleted) {
    logger.webhook(`branch o'chirildi: ${payload.ref}, skip`);
    return;
  }
  // bot o'zi merge qilmaydi; bo'sh push ham skip
  if (!payload.head_commit) {
    logger.webhook('push without head_commit, skip');
    return;
  }

  const branch = payload.ref.replace('refs/heads/', '');
  const headSha = payload.head_commit.id;

  // DUPLICATE himoya: bot/agent o'zi REAL push qilib xabar qilgan commit — yana xabar YO'Q
  const last = db.getLastPush();
  if (headSha && last && ['success', 'pushed'].includes(last.result) && last.commitHash &&
      String(last.commitHash).startsWith(headSha.slice(0, 10)) && ['bot', 'agent'].includes(last.source)) {
    logger.webhook(`push ${headSha.slice(0, 7)} — bot allaqachon xabar qilgan (bot push), skip`);
    return;
  }

  const pusherName = payload.pusher ? payload.pusher.name : 'unknown';
  const summary = F.summarizeFiles(payload.commits);
  const allFiles = [...summary.added, ...summary.modified, ...summary.removed];
  const module = F.detectModules(allFiles);
  const stats = await getPushStats(github, payload);

  const { text, isMain, author, commitMsg, fileCount } = F.formatPush({
    payload, stats, module, pusherName,
  });

  const keyboard = {
    inline_keyboard: [
      [
        { text: '👀 Commitni ko\'rish', url: github.commitUrl(headSha) },
        { text: '🌿 Branchni ko\'rish', url: github.branchUrl(branch) },
      ],
    ],
  };

  await telegram.sendMessage(text, { keyboard });
  logger.webhook(`push notification yuborildi: ${branch} (${author})`);

  // pushni audit history'ga yozamiz (webhook source — bot push emas)
  try {
    db.recordPush({
      memberName: author,
      githubUsername: pusherName,
      branch,
      commitHash: headSha,
      commitMessage: commitMsg,
      result: 'pushed',
      source: 'webhook',
    });
  } catch (e) {
    logger.error('push history yozishda xato:', e.message);
  }

  // ---- MAIN yangilandi: alohida xabar + har member uchun ko'rsatma ----
  if (isMain) {
    const bindings = db.getAllBindings().filter((b) => b.branch && b.branch !== defaultBranch);
    const memberBranches = bindings.map((b) => ({ name: b.githubUsername, branch: b.branch }));
    const instruction = F.formatMainUpdateInstruction({ author, commitMsg, fileCount, memberBranches });
    await telegram.sendMessage(instruction, {
      keyboard: {
        inline_keyboard: [[
          { text: '👀 Commitni ko\'rish', url: github.commitUrl(headSha) },
        ]],
      },
    });
    logger.webhook(`main update notification yuborildi (${bindings.length} member branchlari)`);

    // ---- Har bir bound branch main'dan orqada qolganini tekshirish ----
    for (const binding of bindings) {
      try {
        const cmp = await github.compare(defaultBranch, binding.branch);
        const behind = cmp.behind_by || 0;
        const ahead = cmp.ahead_by || 0;
        if (behind > 0) {
          const behindText = F.formatBranchBehind({
            name: binding.githubUsername,
            branch: binding.branch,
            behindBy: behind,
            aheadBy: ahead,
          });
          await telegram.sendMessage(behindText, {
            keyboard: {
              inline_keyboard: [[
                { text: '📋 Compare', url: github.compareUrl(defaultBranch, binding.branch) },
                { text: '📋 Buyruqni nusxalash', callback_data: 'copy:git fetch origin\ngit merge origin/main' },
              ]],
            },
          });
        }
      } catch (e) {
        logger.error(`branch tekshirish xato (${binding.branch}):`, e.message);
      }
    }
  }
}

module.exports = { handlePush };
