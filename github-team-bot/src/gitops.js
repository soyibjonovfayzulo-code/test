'use strict';
// ============================================================
// gitops.js — XAVFSIZ Git operatsiyalari.
//
// QOIDALAR:
// - FAQAT spawn('git', argsArray) — shell HECH QACHON ishlatilmaydi
// - Telegramdan kelgan text GIT COMMAND'GA to'g'ridan-to'g'ri bermaydi
// - FAQAT whitelist operationlar (quyida)
// - Branch nomi FAQAT config/db dan (member.allowed branch)
// - Force push / reset --hard / clean / push main — yo'q, qo'shib ham bo'lmaydi
// - Har operation TIMEOUT bilan (hanging child process himoyasi)
// - Parallel duplicate operation: chaqiruvchi tomondan lock qilinadi
// ============================================================
const { spawn } = require('child_process');

const GIT_TIMEOUT_MS = 60 * 1000;

// Git argumentlari whitelist regex (xavfsizlik 2-qatlam)
const SAFE_ARG_RE = /^[A-Za-z0-9@._\-/]+$/;

function runGit(cwd, args, { timeoutMs = GIT_TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    // xavfsizlik: har bir argument whitelist regexga mos bo'lsin
    for (const a of args) {
      if (typeof a !== 'string' || !SAFE_ARG_RE.test(a)) {
        return resolve({ ok: false, code: -1, stdout: '', stderr: `Xavfsizlik: git argumenti rad etildi (${String(a).slice(0, 40)})` });
      }
    }
    let child;
    let done = false;
    let stdout = '';
    let stderr = '';
    try {
      child = spawn('git', args, { cwd, windowsHide: true, shell: false });
    } catch (e) {
      return resolve({ ok: false, code: -1, stdout: '', stderr: `git spawn xato: ${e.message}` });
    }
    const timer = setTimeout(() => {
      if (!done) {
        try { child.kill('SIGKILL'); } catch (_) { /* noop */ }
        done = true;
        resolve({ ok: false, code: -1, stdout, stderr: 'Git command timeout' });
      }
    }, timeoutMs);
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (e) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve({ ok: false, code: -1, stdout, stderr: e.message });
      }
    });
    child.on('close', (code) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve({ ok: code === 0, code, stdout, stderr });
      }
    });
  });
}

// Git xabaridan userga xavfsiz ko'rsatiladigan qismini olish
function safeGitError(stderr, stdout) {
  const raw = (stderr || stdout || '').trim();
  if (!raw) return 'Noma\'lum git xatosi';
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const interesting = lines.find((l) => /CONFLICT|rejected|non-fast-forward|diverged|not found|denied|failed|error|no upstream|pull/i.test(l)) || lines[0];
  return interesting.slice(0, 200);
}

function isConflict(stderr, stdout) {
  return /CONFLICT/i.test(stderr || '') || /CONFLICT/i.test(stdout || '');
}

function createGitOps({ repoPath }) {
  return {
    runGit,

    // Git repository aniqlanganmi (start paytida tekshirish uchun)
    async isRepo() {
      const r = await runGit(repoPath, ['rev-parse', '--is-inside-work-tree'], { timeoutMs: 10000 });
      return r.ok && r.stdout.trim() === 'true';
    },

    // Current branch (real git'dan — Telegram text'dan EMAS)
    async currentBranch() {
      const r = await runGit(repoPath, ['branch', '--show-current']);
      return r.ok ? r.stdout.trim() : null;
    },

    async headHash() {
      const r = await runGit(repoPath, ['rev-parse', 'HEAD']);
      return r.ok ? r.stdout.trim() : null;
    },

    async lastCommit() {
      const r = await runGit(repoPath, ['log', '-1', '--oneline']);
      if (!r.ok) return null;
      const trimmed = r.stdout.trim();
      const parts = trimmed.split(/\s+/);
      return { hash: parts[0], message: trimmed.slice(parts[0].length).trim() };
    },

    // To'liq oxirgi commit: author, vaqt, message (handleLastPush fallback uchun)
    async lastCommitFull() {
      const r = await runGit(repoPath, ['log', '-1']);
      if (!r.ok) return null;
      const out = r.stdout;
      const hashM = out.match(/^commit\s+([0-9a-f]{7,40})/m);
      const authorM = out.match(/^Author:\s+(.+?)\s*<[^>]*>/m);
      const dateM = out.match(/^Date:\s+(.+)$/m);
      const bodyM = out.match(/\r?\n\r?\n\s*(.+)\s*$/s);
      let dateIso = null;
      if (dateM && dateM[1]) {
        const d = new Date(dateM[1].trim());
        if (!Number.isNaN(d.getTime())) dateIso = d.toISOString();
      }
      return {
        hash: hashM ? hashM[1] : null,
        author: authorM ? authorM[1].trim() : null,
        date: dateIso,
        message: bodyM ? bodyM[1].trim() : null,
      };
    },

    // Real git status
    async status() {
      const r = await runGit(repoPath, ['status', '--short']);
      const lines = r.ok ? r.stdout.split(/\r?\n/).filter(Boolean) : [];
      const modified = lines.filter((l) => l.startsWith(' M') || l.startsWith('M ')).length;
      const untracked = lines.filter((l) => l.startsWith('??')).length;
      return { ok: r.ok, clean: lines.length === 0, total: lines.length, modified, untracked, lines };
    },

    // origin/main'dan nechta commit ortda/oldinda
    async branchState(baseBranch = 'main') {
      const fetchRes = await runGit(repoPath, ['fetch', 'origin']);
      if (!fetchRes.ok && /Could not resolve host|Connection|timeout/i.test(fetchRes.stderr)) {
        return { ok: false, network: true, message: "GitHub bilan aloqa yo'q (offline)" };
      }
      const behindRes = await runGit(repoPath, ['rev-list', '--count', `HEAD..origin/${baseBranch}`]);
      const aheadRes = await runGit(repoPath, ['rev-list', '--count', `origin/${baseBranch}..HEAD`]);
      const remoteExists = behindRes.ok && aheadRes.ok;
      return {
        ok: true,
        network: false,
        remoteExists,
        behind: remoteExists ? parseInt(behindRes.stdout.trim(), 10) || 0 : null,
        ahead: remoteExists ? parseInt(aheadRes.stdout.trim(), 10) || 0 : null,
      };
    },

    // XAVFSIZ PULL: fetch + merge --ff-only (blind merge YO'Q, conflict avtomatik hal qilinmaydi)
    async pullFromMain(baseBranch = 'main') {
      const fetchRes = await runGit(repoPath, ['fetch', 'origin']);
      if (!fetchRes.ok) {
        return { ok: false, code: 'FETCH', reason: safeGitError(fetchRes.stderr, fetchRes.stdout), conflict: false };
      }
      const mergeRes = await runGit(repoPath, ['merge', '--ff-only', `origin/${baseBranch}`]);
      if (mergeRes.ok) {
        return { ok: true, output: mergeRes.stdout.trim().slice(0, 500) };
      }
      return {
        ok: false,
        code: 'MERGE',
        conflict: isConflict(mergeRes.stderr, mergeRes.stdout),
        reason: safeGitError(mergeRes.stderr, mergeRes.stdout),
      };
    },

    // XAVFSIZ PUSH: branch FAQAT config'dan keladi (user text'dan EMAS)
    async pushBranch(branch) {
      // himoya: main va boshqa protected branchlarga push umuman yo'q
      if (/^(main|master)$/i.test(branch)) {
        return { ok: false, code: 'PROTECTED', reason: 'protected branch push is not allowed' };
      }
      const pushRes = await runGit(repoPath, ['push', 'origin', branch]);
      if (pushRes.ok) {
        return { ok: true, output: pushRes.stdout.trim().slice(0, 500) };
      }
      return {
        ok: false,
        code: isConflict(pushRes.stderr, pushRes.stdout) ? 'CONFLICT' : 'PUSH',
        reason: safeGitError(pushRes.stderr, pushRes.stdout),
        rejected: /rejected/i.test(pushRes.stderr || ''),
      };
    },
  };
}

module.exports = { createGitOps, runGit, safeGitError, isConflict, GIT_TIMEOUT_MS };

