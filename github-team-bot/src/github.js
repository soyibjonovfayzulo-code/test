'use strict';
// ============================================================
// github.js — GitHub REST API client (native fetch, no deps).
// Rate limitni hisobga oladi, xatolarni tushunarli qilib otadi.
// ============================================================
const { logger } = require('./logger');

const API_BASE = 'https://api.github.com';

class GitHubApiError extends Error {
  constructor(message, status, extra = {}) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.extra = extra;
  }
}

function createGitHubClient({ owner, repo, token, defaultBranch = 'main' }) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  let remaining = null;
  let resetAt = null;
  let lastOkAt = null; // /health: oxirgi muvaffaqiyatli API chaqiruvi

  async function api(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
    let res;
    try {
      res = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'orzutalim-dev-bot',
          ...authHeaders,
        },
        ...options,
      });
    } catch (e) {
      throw new GitHubApiError(`GitHub API ga ulanib bo'lmadi: ${e.message}`);
    }

    remaining = res.headers.get('x-ratelimit-remaining');
    resetAt = res.headers.get('x-ratelimit-reset');

    if (res.status === 403 && remaining === '0') {
      throw new GitHubApiError('GitHub rate limit tugadi', 403, { resetAt });
    }
    if (res.status === 404) {
      throw new GitHubApiError('GitHub resursi topilmadi (404)', 404);
    }
    if (!res.ok) {
      throw new GitHubApiError(`GitHub API xato: HTTP ${res.status}`, res.status);
    }
    lastOkAt = Date.now();
    return res.json();
  }

  return {
    getRemainingRateLimit: () => remaining,
    getRateLimitReset: () => resetAt,
    // /health: oxirgi 5 daqiqa ichida muvaffaqiyatli API chaqiruvi bo'lsa ulangan
    // (hali chaqiruv bo'lmagan bo'lsa null — "noto'g'ri" emas, "tekshirilmagan")
    getStatus: () => ({ lastOkAt, ok: lastOkAt ? !!(Date.now() - lastOkAt < 5 * 60 * 1000) : null }),

    // Branch ref ma'lumoti (commit sha bilan)
    async getBranch(branch) {
      const data = await api(`/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`);
      return data;
    },

    // Commit detail
    async getCommit(sha) {
      return api(`/repos/${owner}/${repo}/commits/${encodeURIComponent(sha)}`);
    },

    // base...head holati: ahead_by / behind_by (compare)
    async compare(base, head) {
      try {
        return await api(`/repos/${owner}/${repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`);
      } catch (e) {
        if (e.status === 404) {
          // branch mavjud emas yoki umumiy ancestor yo'q
          throw new GitHubApiError(`Branch "${head}" topilmadi yoki "${base}" bilan bog'liq emas`, 404);
        }
        throw e;
      }
    },

    // Barcha branchlar
    async listBranches() {
      return api(`/repos/${owner}/${repo}/branches?per_page=100`);
    },

    // Ochiq PRlar
    async listOpenPRs() {
      return api(`/repos/${owner}/${repo}/pulls?state=open&per_page=30&sort=updated`);
    },

    // Bitta PR (mergeable holati bilan)
    async getPR(number) {
      return api(`/repos/${owner}/${repo}/pulls/${number}`);
    },

    // PR files
    async getPRFiles(number) {
      return api(`/repos/${owner}/${repo}/pulls/${number}/files?per_page=100`);
    },

    // So'nggi commitlar (default branch)
    async listCommits(branch = defaultBranch, perPage = 5) {
      return api(`/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${perPage}`);
    },

    repoUrl() {
      return `https://github.com/${owner}/${repo}`;
    },

    branchUrl(branch) {
      return `https://github.com/${owner}/${repo}/tree/${encodeURIComponent(branch)}`;
    },

    commitUrl(sha) {
      return `https://github.com/${owner}/${repo}/commit/${encodeURIComponent(sha)}`;
    },

    compareUrl(base, head) {
      return `https://github.com/${owner}/${repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`;
    },

    prUrl(number) {
      return `https://github.com/${owner}/${repo}/pull/${number}`;
    },

    prFilesUrl(number) {
      return `https://github.com/${owner}/${repo}/pull/${number}/files`;
    },

    async logRateLimit() {
      if (remaining !== null) {
        logger.github(`rate limit remaining=${remaining}`);
      }
    },
  };
}

module.exports = { createGitHubClient, GitHubApiError };
