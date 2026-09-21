'use strict';
// ============================================================
// test/gitops.test.js — real git (temp repo): status, push, main
// taqiqi, shell injection, safe error
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { createGitOps, runGit, safeGitError, isConflict } = require('../src/gitops');

// ---- Vaqtinchalik LOCAL git repo (production repo'ga TEGMAYMIZ) ----
function tempGitRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitrepo-'));
  const g = (args) => execSync(`git ${args}`, { cwd: dir, stdio: 'pipe' });
  g('init -b main');
  g('config user.email test@test.com');
  g('config user.name Test');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'v1');
  g('add .');
  g('commit -m "init commit"');
  g('branch sardor');
  return dir;
}

test('gitops: real git status ishlaydi (temp repo)', async () => {
  const repo = tempGitRepo();
  const git = createGitOps({ repoPath: repo });
  const st = await git.status();
  assert.strictEqual(st.ok, true);
  assert.strictEqual(st.clean, true);
  const branch = await git.currentBranch();
  assert.strictEqual(branch, 'main');
  const last = await git.lastCommit();
  assert.strictEqual(last.message, 'init commit');
  assert.ok(/^[0-9a-f]{7,}$/.test(last.hash));
  assert.strictEqual(await git.isRepo(), true);
});

test('gitops: real push — remote yo\'q bo\'lsa XATO (fake success YO\'Q)', async () => {
  const repo = tempGitRepo();
  const git = createGitOps({ repoPath: repo });
  const res = await git.pushBranch('sardor');
  assert.strictEqual(res.ok, false);
  assert.ok(res.reason);
});

test('gitops: main\'ga push gitops darajasida ham TAQIQLANGAN', async () => {
  const repo = tempGitRepo();
  const git = createGitOps({ repoPath: repo });
  const res = await git.pushBranch('main');
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.code, 'PROTECTED');
});

test('gitops: shell injection argumentlari rad etiladi', async () => {
  const repo = tempGitRepo();
  const r = await runGit(repo, ['log; rm -rf /']);
  assert.strictEqual(r.ok, false);
  assert.ok(r.stderr.includes('Xavfsizlik'));
  const r2 = await runGit(repo, ['push', 'origin', 'main; echo hacked']);
  assert.strictEqual(r2.ok, false);
  // repo sog'lom
  const git = createGitOps({ repoPath: repo });
  assert.strictEqual((await git.status()).ok, true);
});

test('gitops: safeGitError / isConflict', () => {
  const s = safeGitError('error: failed to push some refs\nTo github.com:x\nline3');
  assert.strictEqual(s, 'error: failed to push some refs');
  assert.ok(s.length <= 200);
  assert.strictEqual(safeGitError(''), 'Noma\'lum git xatosi');
  assert.strictEqual(isConflict('CONFLICT (content): Merge conflict in a.txt', ''), true);
  assert.strictEqual(isConflict('fatal: something', ''), false);
});

test('gitops: repo topilmasa isRepo=false, xato qaytadi (crash YO\'Q)', async () => {
  const git = createGitOps({ repoPath: path.join(os.tmpdir(), 'no-such-dir-' + Date.now()) });
  assert.strictEqual(await git.isRepo(), false);
  const r = await git.currentBranch();
  assert.strictEqual(r, null);
});
