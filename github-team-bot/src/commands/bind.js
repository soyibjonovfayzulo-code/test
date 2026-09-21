'use strict';
// commands/bind.js — Telegram <-> GitHub hisob bog'lash (XAVFSIZ variant)
//
// FLOW (B + A kombinatsiyasi — v1 uchun eng xavfsiz):
// 1. User: /bind jasurbek  -> bot 6 xonali one-time kod beradi (15 daqiqa amal qiladi)
// 2. User kodni admin'ga ko'rsatadi (shaxsan tasdiqlaydi — soxta bog'lash mumkin emas)
// 3. Admin: /approve <github> <kod>  -> binding yaratiladi
// 4. Admin: /setbranch <github> <branch>  -> branch mapping
// 5. Admin: /unlink <github>  -> bog'lashni o'chirish
// Faqat BOT_ADMIN_IDS dagi userlar admin komandalarni ishlata oladi.
const { esc } = require('../formatters');
const { isAdmin, generateVerificationCode } = require('../security');

const GITHUB_USERNAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const BRANCH_RE = /^[A-Za-z0-9._\-/]{1,100}$/;

async function bindCommand(ctx, msg) {
  const { db, config } = ctx;
  const from = msg.from || {};
  const args = (msg.text || '').split(/\s+/).slice(1);
  const githubUsername = (args[0] || '').trim();

  if (!githubUsername) {
    return { text: `🔐 <b>GitHub accountni bog'lash</b>\n\nGitHub username yuboring:\n<code>/bind jasurbek</code>\n\nKeyin shaxsiy verification kod olasiz. Kodni admin'ga ko'rsatib tasdiqlatishingiz kerak.` };
  }

  if (!GITHUB_USERNAME_RE.test(githubUsername)) {
    return { text: `❌ Noto'g'ri GitHub username formati.` };
  }

  const code = generateVerificationCode();
  db.addPendingBind({
    telegramUserId: from.id,
    telegramUsername: from.username || '',
    githubUsername,
    code,
  });

  let text = `🔐 <b>GitHub accountni bog'lash</b>\n\n`;
  text += `GitHub: <b>${esc(githubUsername)}</b>\n`;
  text += `Verification kod: <code>${code}</code>\n\n`;
  text += `⏳ Kod 15 daqiqa amal qiladi.\n\n`;
  text += `✅ Tasdiqlash uchun kodni admin'ga ko'rsating. Admin:\n<code>/approve ${esc(githubUsername)} ${code}</code>\nbuyrug'ini yuboradi.\n\nSo'ng:\n✅ Account linked\nGitHub: ${esc(githubUsername)}`;

  // adminlarga ham xabar (ochiq chat bo'lsa)
  if (config.adminIds.length) {
    // eslint-disable-next-line no-empty
  }
  return { text };
}

async function approveCommand(ctx, msg) {
  const { db } = ctx;
  const from = msg.from || {};
  if (!isAdmin(from.id, ctx.config.adminIds)) {
    return { text: `⛔ Bu komanda faqat adminlar uchun.` };
  }
  const args = (msg.text || '').split(/\s+/).slice(1);
  const [githubUsername, code] = args;
  if (!githubUsername || !code) {
    return { text: `Foydalanish: <code>/approve &lt;github&gt; &lt;kod&gt;</code>` };
  }
  const result = db.approvePendingBind(githubUsername, code, from.username || String(from.id));
  if (!result) {
    return { text: `❌ Mos pending so'rov topilmadi (kod noto'g'ri yoki muddati o'tgan).` };
  }
  return { text: `✅ <b>Account linked</b>\n\nTelegram: ${esc(result.telegramUserId)}\nGitHub: <b>${esc(result.githubUsername)}</b>\n\nBranch qo'shish uchun:\n<code>/setbranch ${esc(result.githubUsername)} branch/nomi</code>` };
}

async function setBranchCommand(ctx, msg) {
  const { db } = ctx;
  const from = msg.from || {};
  if (!isAdmin(from.id, ctx.config.adminIds)) {
    return { text: `⛔ Bu komanda faqat adminlar uchun.` };
  }
  const args = (msg.text || '').split(/\s+/).slice(1);
  const [githubUsername, branch] = args;
  if (!githubUsername || !branch) {
    return { text: `Foydalanish: <code>/setbranch &lt;github&gt; &lt;branch&gt;</code>` };
  }
  if (!BRANCH_RE.test(branch)) {
    return { text: `❌ Noto'g'ri branch nomi.` };
  }
  const binding = db.getBindingByGithub(githubUsername);
  if (!binding) {
    return { text: `❌ ${esc(githubUsername)} uchun bog'lanish topilmadi.` };
  }
  db.upsertBinding({
    telegramUserId: binding.telegramUserId,
    telegramUsername: binding.telegramUsername,
    githubUsername: binding.githubUsername,
    branch,
    role: binding.role,
    approvedBy: binding.approvedBy,
  });
  return { text: `✅ ${esc(githubUsername)} → 🌿 ${esc(branch)}` };
}

async function unlinkCommand(ctx, msg) {
  const { db } = ctx;
  const from = msg.from || {};
  if (!isAdmin(from.id, ctx.config.adminIds)) {
    return { text: `⛔ Bu komanda faqat adminlar uchun.` };
  }
  const args = (msg.text || '').split(/\s+/).slice(1);
  const githubUsername = args[0];
  if (!githubUsername) {
    return { text: `Foydalanish: <code>/unlink &lt;github&gt;</code>` };
  }
  const binding = db.getBindingByGithub(githubUsername);
  if (!binding) return { text: `❌ Topilmadi.` };
  db.deleteBinding(binding.telegramUserId);
  return { text: `🗑️ ${esc(githubUsername)} bog'lash o'chirildi.` };
}

module.exports = { bindCommand, approveCommand, setBranchCommand, unlinkCommand };
