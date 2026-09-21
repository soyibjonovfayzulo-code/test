'use strict';
// test/helpers.js — testlar uchun mock'lar
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

function tempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'orzutalim-bot-test-'));
}

function mockTelegram() {
  const sent = [];
  return {
    sent,
    async sendMessage(text, opts) { sent.push({ text, opts }); return { message_id: sent.length }; },
    async answerCallbackQuery(id, text) { sent.push({ callbackAnswered: id, text }); },
    async setCommands() {},
    startPolling() { return { async stop() {} }; },
  };
}

function mockGitHub(overrides = {}) {
  const base = {
    async getBranch() { return { commit: { commit: { message: 'feat: x', author: { name: 'Ali', date: new Date().toISOString() } } } }; },
    async getCommit() { return { files: [{ additions: 100, deletions: 40 }] }; },
    async compare() { return { ahead_by: 0, behind_by: 0 }; },
    async listBranches() { return [{ name: 'main' }]; },
    async listOpenPRs() { return []; },
    async getPR() { return { mergeable: true, mergeable_state: 'clean' }; },
    async getPRFiles() { return [{}, {}, {}]; },
    async listCommits() { return [{ commit: { message: 'fix: x\nbody', author: { name: 'Ali', date: new Date().toISOString() } }, html_url: 'https://github.com/o/r/commit/abc' }]; },
    repoUrl: () => 'https://github.com/o/r',
    branchUrl: (b) => `https://github.com/o/r/tree/${b}`,
    commitUrl: (sha) => `https://github.com/o/r/commit/${sha}`,
    compareUrl: (b, h) => `https://github.com/o/r/compare/${b}...${h}`,
    prUrl: (n) => `https://github.com/o/r/pull/${n}`,
    prFilesUrl: (n) => `https://github.com/o/r/pull/${n}/files`,
  };
  return { ...base, ...overrides };
}

function sign(secret, body) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

module.exports = { tempDataDir, mockTelegram, mockGitHub, sign };
