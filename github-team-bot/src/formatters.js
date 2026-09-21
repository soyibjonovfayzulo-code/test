'use strict';
// ============================================================
// formatters.js — Telegram xabar formatlash (HTML parse_mode),
// module detection, file change summary, branch status ikonkalari.
// ============================================================

// ---- HTML escape (Telegram HTML parse_mode uchun) ----
function esc(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---- Vaqt "10 minutes ago" formatlash ----
function timeAgo(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'hozir';
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  return `${d} kun oldin`;
}

// ---- Branch status (main ga nisbatan) ----
function branchStatusIcon(ahead, behind) {
  if (behind > 0) return { icon: '🟡', text: `${behind} commit behind` };
  if (ahead > 0) return { icon: '🔵', text: `${ahead} commit ahead` };
  return { icon: '🟢', text: 'Up to date' };
}

// ---- SMART MODULE DETECTION (faqat xavfsiz match bo'lsa) ----
const MODULE_PATTERNS = [
  { key: 'tests', name: '📝 Tests', patterns: [/tests?/i, /quiz/i] },
  { key: 'duel', name: '⚔️ Duel', patterns: [/duel/i] },
  { key: 'coding', name: '💻 Coding', patterns: [/coding/i, /code-editor/i, /playground/i] },
  { key: 'store', name: '🛍️ Store', patterns: [/store/i, /shop/i] },
  { key: 'profile', name: '👤 Profile', patterns: [/profile/i, /auth/i] },
  { key: 'lessons', name: '📚 Lessons', patterns: [/lessons?/i, /course/i] },
];

function detectModules(filePaths) {
  const hits = new Set();
  for (const p of filePaths || []) {
    for (const mod of MODULE_PATTERNS) {
      if (mod.patterns.some((re) => re.test(p))) hits.add(mod.key);
    }
  }
  if (hits.size === 1) {
    return MODULE_PATTERNS.find((m) => hits.has(m.key)).name;
  }
  return 'General'; // bir nechta/yo'q bo'lsa noto'g'ri taxmin qilmaymiz
}

// ---- Push event: commitlardan fayl statistikasi ----
function summarizeFiles(commits) {
  const added = new Set();
  const modified = new Set();
  const removed = new Set();
  for (const c of commits || []) {
    for (const p of c.added || []) added.add(p);
    for (const p of c.modified || []) modified.add(p);
    for (const p of c.removed || []) removed.add(p);
  }
  return {
    added: [...added],
    modified: [...modified].filter((f) => !added.has(f)),
    removed: [...removed],
  };
}

function formatPush({ payload, stats, module, pusherName }) {
  const branch = payload.ref.replace('refs/heads/', '');
  const isMain = branch === (payload.repository && payload.repository.default_branch);
  const commitCount = (payload.commits || []).length;
  const headMsg = payload.head_commit ? (payload.head_commit.message || '').split('\n')[0] : '';
  const author = payload.head_commit && payload.head_commit.author ? payload.head_commit.author.name : pusherName;

  let text = `${isMain ? '⚠️ MAIN YANGILANDI' : '🚀 GITHUB UPDATE'}\n\n`;
  text += `👤 ${esc(author)}\n`;
  text += `🌿 Branch: ${esc(branch)}\n`;
  if (commitCount > 1) text += `📦 ${commitCount} commit\n`;
  text += `\n📝 Commit:\n${esc(headMsg)}\n`;

  if (stats && (stats.additions || stats.deletions)) {
    text += `\n📊 Changes: <b>+${stats.additions}</b> / <b>-${stats.deletions}</b>\n`;
  }

  const summary = summarizeFiles(payload.commits);
  const all = [...summary.added, ...summary.modified, ...summary.removed];
  const fileCount = all.length;
  if (fileCount > 0) {
    text += `\n📁 Files changed (${fileCount}):\n`;
    text += all.slice(0, 10).map((f) => `• ${esc(f)}`).join('\n');
    if (all.length > 10) text += `\n• ... va yana ${all.length - 10} fayl`;
    text += '\n';
  }

  if (module) text += `\n🎯 Module: ${esc(module)}\n`;
  return { text, branch, isMain, author, commitMsg: headMsg, fileCount };
}

// ---- MAIN yangilanganda: jamoaga ko'rsatma ----
function formatMainUpdateInstruction({ author, commitMsg, fileCount, memberBranches }) {
  let text = `📥 <b>O'Z BRANCHINGIZNI YANGILASH</b>\n\n`;
  text += `<code>git fetch origin\ngit merge origin/main</code>\n`;
  if (memberBranches && memberBranches.length) {
    text += `\n👥 Branch mapping:\n`;
    text += memberBranches.map((m) => `${esc(m.name)}: 🌿 ${esc(m.branch)}`).join('\n');
  }
  return text;
}

// ---- Branch orqada qolgan (behind) xabari ----
function formatBranchBehind({ name, branch, behindBy, aheadBy }) {
  let text = `🔔 <b>BRANCH YANGILANISHI KERAK</b>\n\n`;
  text += `👤 ${esc(name)}\n\n🌿 ${esc(branch)}\n\n`;
  text += `Main branchda yangi kod bor.\n\n`;
  text += `📊 Main'dan: <b>${behindBy} commit ortda</b>${aheadBy ? `, ${aheadBy} commit oldinda` : ''}\n\n`;
  text += `Yangilash:\n<code>git fetch origin\ngit merge origin/main</code>\n\n`;
  text += `⚠️ Agar lokalda commit qilinmagan o'zgarishlaringiz bo'lsa, avval ularni saqlang (<code>git stash</code>).`;
  return text;
}

// ---- PR xabarlari ----
function formatPROpened({ pr, fileCount, authorName }) {
  const author = authorName || (pr.user && pr.user.login) || 'unknown';
  let text = `🔀 <b>YANGI PULL REQUEST</b>\n\n`;
  text += `👤 ${esc(author)}\n\n`;
  text += `📌 Title:\n${esc(pr.title)}\n\n`;
  text += `🌿 From: ${esc(pr.head && pr.head.ref)}\n`;
  text += `➡️ To: ${esc(pr.base && pr.base.ref)}\n`;
  if (fileCount) text += `📁 Files: ${fileCount}\n`;
  text += `\n🔗 PR #${pr.number}`;
  return text;
}

function formatPRUpdated({ pr, authorName }) {
  const author = authorName || (pr.user && pr.user.login) || 'unknown';
  let text = `🔄 <b>PR YANGILANDI</b>\n\n`;
  text += `👤 ${esc(author)}\n`;
  text += `🔀 PR #${pr.number}\n`;
  text += `📌 ${esc(pr.title)}\n`;
  text += `🌿 ${esc(pr.head && pr.head.ref)} → ${esc(pr.base && pr.base.ref)}\n`;
  return text;
}

function formatPRMerged({ pr, fileCount, authorName }) {
  const author = authorName || (pr.user && pr.user.login) || 'unknown';
  let text = `✅ <b>PULL REQUEST MERGED</b>\n\n`;
  text += `👤 ${esc(author)}\n\n`;
  text += `📌 ${esc(pr.title)}\n\n`;
  text += `${esc(pr.head && pr.head.ref)}\n⬇️\n${esc(pr.base && pr.base.ref)}\n`;
  if (fileCount) text += `\n📁 ${fileCount} files changed\n`;
  text += `\n⚠️ Main branch yangilandi.`;
  return text;
}

function formatPRClosed({ pr, authorName }) {
  const author = authorName || (pr.user && pr.user.login) || 'unknown';
  let text = `🚫 <b>PULL REQUEST YOPILDI</b>\n\n`;
  text += `👤 ${esc(author)}\n`;
  text += `🔀 PR #${pr.number} — ${esc(pr.title)}\n`;
  return text;
}

function formatPRConflict({ pr, authorName }) {
  const author = authorName || (pr.user && pr.user.login) || 'unknown';
  let text = `🚨 <b>MERGE CONFLICT</b>\n\n`;
  text += `👤 ${esc(author)}\n\n`;
  text += `🔀 PR #${pr.number}\n`;
  text += `🌿 ${esc(pr.head && pr.head.ref)}\n⬇️\n${esc(pr.base && pr.base.ref)}\n\n`;
  text += `❌ Conflict mavjud.\n\n`;
  text += `Tavsiya:\n<code>git fetch origin\ngit merge origin/main</code>\n\n`;
  text += `⚠️ Conflictni qo'lda hal qiling. Avtomatik merge QILINMAYDI.`;
  return text;
}

// ---- Workflow/CI xabarlari ----
function formatWorkflowFailed({ run }) {
  let text = `❌ <b>BUILD FAILED</b>\n\n`;
  text += `Workflow:\n${esc(run.name)}\n\n`;
  text += `Branch:\n🌿 ${esc(run.head_branch)}\n\n`;
  if (run.actor && run.actor.login) text += `👤 ${esc(run.actor.login)}\n`;
  return text;
}

function formatWorkflowPassed({ run }) {
  let text = `✅ <b>BUILD PASSED</b>\n\n`;
  text += `Workflow:\n${esc(run.name)}\n\n`;
  text += `Branch:\n🌿 ${esc(run.head_branch)}\n`;
  return text;
}

// ---- Umumiy xatolik xabari ----
function formatGitHubError(err) {
  return `❌ <b>GitHub API error</b>\n\n${esc(err && err.message ? err.message : String(err))}\n\nKeyinroq qayta urinib ko'ring.`;
}

module.exports = {
  esc,
  timeAgo,
  branchStatusIcon,
  detectModules,
  summarizeFiles,
  formatPush,
  formatMainUpdateInstruction,
  formatBranchBehind,
  formatPROpened,
  formatPRUpdated,
  formatPRMerged,
  formatPRClosed,
  formatPRConflict,
  formatWorkflowFailed,
  formatWorkflowPassed,
  formatGitHubError,
};


