'use strict';
// ============================================================
// agent/git.js — AGENT tomonidagi XAVFSIZ Git operatsiyalari.
//
// FAQAT spawn('git', argsArray) — shell HECH QACHON emas.
// Whitelist: status, add, commit, push, fetch, pull --ff-only.
// Branch faqat agent .env (BRANCH) + bot command cross-check.
// Timeout 60s. Force/reset/clean MUMKIN EMAS.
// ============================================================
const { spawn } = require('child_process');

const GIT_TIMEOUT_MS = 60 * 1000;
const SAFE_ARG_RE = /^[A-Za-z0-9@._\-:/\s]+$/;  // commit message uchun \s va : ruxsat (spawn args — shell yo'q, xavfsiz)
const STRICT_ARG_RE = /^[A-Za-z0-9@._\-/]+$/;   // oddiy argumentlar

function runGit(cwd, args, { timeoutMs = GIT_TIMEOUT_MS, allowSpaces = false } = {}) {
  return new Promise((resolve) => {
    const re = allowSpaces ? SAFE_ARG_RE : STRICT_ARG_RE;
    for (const a of args) {
      if (typeof a !== 'string' || !re.test(a)) {
        return resolve({ ok: false, code: -1, stdout: '', stderr: `Xavfsizlik: git argumenti rad etildi (${String(a).slice(0, 40)})` });
      }
    }
    let child, done = false, stdout = '', stderr = '';
    try {
      child = spawn('git', args, { cwd, windowsHide: true, shell: false });
    } catch (e) {
      return resolve({ ok: false, code: -1, stdout: '', stderr: `git spawn xato: ${e.message}` });
    }
    const timer = setTimeout(() => {
      if (!done) {
        try { child.kill('SIGKILL'); } catch (_) { /* noop */ }
        done = true;
        resolve({ ok: false, code: -1, stdout, stderr: 'Git command timeout (60s)' });
      }
    }, timeoutMs);
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (e) => {
      if (!done) { done = true; clearTimeout(timer); resolve({ ok: false, code: -1, stdout, stderr: e.message }); }
    });
    child.on('close', (code) => {
      if (!done) { done = true; clearTimeout(timer); resolve({ ok: code === 0, code, stdout, stderr }); }
    });
  });
}

function safeGitError(stderr, stdout) {
  const raw = (stderr || stdout || '').trim();
  if (!raw) return 'Noma\'lum git xatosi';
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const interesting = lines.find((l) => /CONFLICT|rejected|non-fast-forward|diverged|not found|denied|failed|error|no upstream|pull|timeout/i.test(l)) || lines[0];
  return interesting.slice(0, 200);
}

function createAgentGit({ repoPath, allowedBranch }) {
  return {
    runGit,

    async isRepo() {
      const r = await runGit(repoPath, ['rev-parse', '--is-inside-work-tree'], { timeoutMs: 10000 });
      return r.ok && r.stdout.trim() === 'true';
    },

    async currentBranch() {
      const r = await runGit(repoPath, ['branch', '--show-current']);
      return r.ok ? r.stdout.trim() : null;
    },

    // ---- REAL PUSH WORKFLOW ----
    async push({ branch }) {
      // 0a) protected branchlar — config'dan QAT'IY QAT'IY Nazorat (har qanday holatda)
      if (/^(main|master)$/i.test(branch)) {
        return { ok: false, reason: 'protected branch push is not allowed' };
      }
      // 0b) branch cross-check: bot'dan kelgan branch FAQAT agent config bilan bir xil
      if (branch !== allowedBranch) {
        return { ok: false, reason: `Branch mos emas: bot "${branch}" dedi, agent "${allowedBranch}" — rad etildi` };
      }

      // 1) current branch tekshiruvi
      const cur = await this.currentBranch();
      if (cur !== branch) {
        return { ok: false, reason: `Repo hozir "${cur || '?'}" branchida. Avval "git checkout ${branch}" qiling.` };
      }

      // 2) real status
      const st = await runGit(repoPath, ['status', '--porcelain']);
      const dirty = st.ok && st.stdout.trim().length > 0;

      // 3) faqat o'zgarish bo'lsa add+commit (keraksiz commit YO'Q)
      // commit message FAQAT ASCII (git argument whitelist regex uchun)
      let commitHash = null;
      let commitMessage = null;
      if (dirty) {
        const addRes = await runGit(repoPath, ['add', '-A']);
        if (!addRes.ok) return { ok: false, reason: safeGitError(addRes.stderr, addRes.stdout) };
        const files = st.stdout.split(/\r?\n/).filter(Boolean).length;
        commitMessage = `Bot push: ${files} fayl - ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
        const cRes = await runGit(repoPath, ['commit', '-m', commitMessage], { allowSpaces: true });
        if (!cRes.ok) return { ok: false, reason: safeGitError(cRes.stderr, cRes.stdout) };
      }

      // 4) push oldidan HEAD
      const head = await runGit(repoPath, ['rev-parse', 'HEAD']);
      commitHash = head.ok ? head.stdout.trim() : null;
      const logRes = await runGit(repoPath, ['log', '-1', '--pretty=format:%s']);
      commitMessage = commitMessage || (logRes.ok ? logRes.stdout.trim() : null);

      // 5) REAL push (exit code 0 = faqat shunda ok)
      const pushRes = await runGit(repoPath, ['push', 'origin', branch]);
      if (pushRes.ok) {
        const nothing = /Everything up-to-date/i.test(pushRes.stdout) && !dirty;
        return { ok: true, branch, commitHash, commitMessage, note: nothing ? "Yangi commit yo'q edi — up-to-date" : null };
      }
      return {
        ok: false,
        conflict: /CONFLICT/i.test(pushRes.stderr || ''),
        reason: safeGitError(pushRes.stderr, pushRes.stdout),
      };
    },

    // ---- REAL PULL WORKFLOW ----
    async pull({ baseBranch = 'main' } = {}) {
      const cur = await this.currentBranch();
      if (!cur) return { ok: false, reason: 'Repo topilmadi yoki branch aniqlanmadi' };

      const fetchRes = await runGit(repoPath, ['fetch', 'origin']);
      if (!fetchRes.ok) return { ok: false, reason: safeGitError(fetchRes.stderr, fetchRes.stdout) };

      // ff-only: blind merge YO'Q, conflict avtomatik hal qilinmaydi
      const pullRes = await runGit(repoPath, ['pull', '--ff-only', 'origin', baseBranch]);
      if (pullRes.ok) {
        const head = await runGit(repoPath, ['rev-parse', 'HEAD']);
        return { ok: true, branch: cur, output: pullRes.stdout.trim().slice(0, 300), commitHash: head.ok ? head.stdout.trim() : null };
      }
      return {
        ok: false,
        conflict: /CONFLICT/i.test(pullRes.stderr || '') || /not possible|diverged/i.test(pullRes.stderr || pullRes.stdout || ''),
        reason: safeGitError(pullRes.stderr, pullRes.stdout),
      };
    },
  };
}

module.exports = { createAgentGit, runGit, safeGitError, GIT_TIMEOUT_MS };

