'use strict';
// ============================================================
// ui.js — Yangi SODDA user UI:
//
//   /start → "Ismingizni kiriting:" → whitelist tekshiruv
//   → FAQAT 3 TA TUGMA:
//      🚀 Git Push
//      🔄 Git Pull
//      🕒 Oxirgi kod o'zgartirgan
//
// Security:
// - Telegram ID -> member -> allowed branch (ismga ishonch YO'Q)
// - Push faqat tasdiqlagandan keyin REAL git push
// - Parallel duplicate operations bloklangan (per-user lock)
// - Eski komandalar foydalanuvchiga ko'rinmaydi
// ============================================================
const { logger } = require('./logger');
const { esc } = require('./formatters');

const MAIN_MENU_TEXT = '👇 Kerakli amalni tanlang:';
const MENU_KEYBOARD = {
  keyboard: [
    [{ text: '🚀 Git Push' }, { text: '🔄 Git Pull' }],
    [{ text: "🕒 Oxirgi kod o'zgartirgan" }],
  ],
  resize_keyboard: true,
};

const CANCEL_KEYBOARD = {
  inline_keyboard: [[{ text: '❌ BEKOR QILISH', callback_data: 'cancel' }]],
};

function createUI({ config, db, team, git, telegram, github, agents }) {
  // ---- Per-user operation lock (duplicate git operation himoyasi) ----
  const busy = new Map(); // telegramUserId -> true
  function isBusy(id) { return busy.get(String(id)) || false; }
  function setBusy(id, v) { v ? busy.set(String(id), true) : busy.delete(String(id)); }

  // ---- Ism kiritish rejimi (per-chat state) ----
  const awaitingName = new Set(); // chatId

  function fmtTime(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // ---- /start ----
  async function handleStart(msg) {
    const from = msg.from || {};
    const chatId = msg.chat && msg.chat.id;
    const member = team.findByTelegramId(from.id);
    if (member) {
      // allaqachon bog'langan — ism so'ramaymiz
      await telegram.sendMessage(
        `👋 OrzuTalim Dev Team botiga xush kelibsiz.\n\n👤 <b>${esc(member.name)}</b> tanildi.\n${member.branch ? `🌿 Branch: ${esc(member.branch)}` : "⚠️ Branch hali sozlanmagan (admin bilan bog'laning)"}\n\n${MAIN_MENU_TEXT}`,
        { keyboard: MENU_KEYBOARD, chatId }
      );
      return;
    }
    // yangi user — ism so'raladi
    awaitingName.add(String(chatId));
    await telegram.sendMessage(
      '👋 OrzuTalim Dev Team botiga xush kelibsiz.\n\nIsmingizni kiriting:',
      { keyboard: { keyboard: [[{ text: '❌ Bekor qilish' }]], resize_keyboard: true }, chatId }
    );
  }

  // ---- Text message ishlovi ----
  async function handleMessage(msg) {
    const from = msg.from || {};
    const chatId = msg.chat && msg.chat.id;
    const text = String(msg.text || '').trim();

    // 1) Ism kiritish rejimi
    if (awaitingName.has(String(chatId))) {
      if (/^❌\s*Bekor qilish$/i.test(text) || /^\/start$/i.test(text)) {
        awaitingName.delete(String(chatId));
        if (text.startsWith('/')) return handleStart(msg);
        return;
      }
      if (text.startsWith('/')) return; // komanda — ism emas
      const claim = team.claim(text, from.id);
      if (claim.ok) {
        awaitingName.delete(String(chatId));
        const m = claim.member;
        logger.telegram(`member bound: ${m.key} -> tg:${from.id}`);
        await telegram.sendMessage(
          `✅ <b>${esc(m.name)}</b> tanildi.\n\nEndi Git boshqaruv panelidan foydalanishingiz mumkin.\n${m.branch ? `🌿 Branch: ${esc(m.branch)}` : "⚠️ GitHub/branch hali sozlanmagan (admin tomonidan keyincha biriktiriladi)."}\n\n${MAIN_MENU_TEXT}`,
          { keyboard: MENU_KEYBOARD, chatId }
        );
      } else if (claim.reason === 'not_found') {
        await telegram.sendMessage(
          '❌ Siz OrzuTalim Dev Team a\'zosi sifatida topilmadingiz.\n\nIsmni qayta kiriting yoki admin bilan bog\'laning.',
          { chatId }
        );
      } else if (claim.reason === 'already_bound') {
        await telegram.sendMessage(
          `❌ "${esc(text)}" ismi allaqachon boshqa Telegram hisobga bog'langan.\n\nAgar siz o'sha odam bo'lsangiz, admin bilan bog'laning.`,
          { chatId }
        );
      } else {
        await telegram.sendMessage('⛔ Bu a\'zo hozircha o\'chirilgan. Admin bilan bog\'laning.', { chatId });
      }
      return;
    }

    // 2) Komandalar
    if (text.startsWith('/')) {
      const cmd = text.split(/\s+/)[0].split('@')[0].toLowerCase();
      if (cmd === '/start') return handleStart(msg);
      if (cmd === '/status') return handleStatus(msg);
      // ESKI KOMANDALAR: /help /team /commits /pr /main /mybranch /bind ... — JIMLIK
      logger.telegram(`hidden command ignored: ${cmd} user=${from.id}`);
      return;
    }

    // 3) Tugmalar
    const member = team.findByTelegramId(from.id);
    if (!member) {
      awaitingName.add(String(chatId));
      await telegram.sendMessage('👋 OrzuTalim Dev Team botiga xush kelibsiz.\n\nIsmingizni kiriting:', { chatId });
      return;
    }
    if (/^🚀\s*Git Push$/i.test(text)) return startPushFlow(msg);
    if (/^🔄\s*Git Pull$/i.test(text)) return startPullFlow(msg);
    if (/^🕒\s*Oxirgi kod o'zgartirgan$/i.test(text)) return handleLastPush(msg);
  }

  // ---- /status (ixtiyoriy, sodda) ----
  async function handleStatus(msg) {
    const from = msg.from || {};
    const member = team.findByTelegramId(from.id);
    const st = await git.status();
    const branch = await git.currentBranch();
    let text = '📊 GIT STATUS\n\n';
    text += `Member: ${member ? esc(member.name) : '(noma\'lum)'}\n`;
    text += `Current branch: ${esc(branch || '(aniqlanmadi)')}\n`;
    text += `Working tree: ${st.clean ? '✅ Clean' : `⚠️ ${st.total} ta o'zgarish`}\n`;
    await telegram.sendMessage(text, { chatId: msg.chat && msg.chat.id });
  }

  let gitReady = false;

  // ---- GIT PUSH FLOW (Local Agent orqali) ----
  async function startPushFlow(msg) {
    const from = msg.from || {};
    const chatId = msg.chat && msg.chat.id;
    if (isBusy(from.id)) {
      return telegram.sendMessage('⏳ Git operation bajarilmoqda... biroz kuting.', { chatId });
    }
    const member = team.findByTelegramId(from.id);
    if (!member) return telegram.sendMessage('❌ Siz tanilmadingiz. /start bilan ismingizni kiriting.', { chatId });
    if (!member.enabled) return telegram.sendMessage(`⛔ ${esc(member.name)} o'chirilgan (admin).`, { chatId });
    if (!member.branch) return telegram.sendMessage('⚠️ Sizga hali branch biriktirilmagan. Admin bilan bog\'laning.', { chatId });

    const online = agents ? agents.isOnline(member.key) : false;
    const preview =
      `🚀 <b>GIT PUSH</b>\n\n` +
      `👤 Member: ${esc(member.name)}\n` +
      `🐙 GitHub: ${member.githubUsername ? '@' + esc(member.githubUsername) : '—'}\n` +
      `🌿 Branch: ${esc(member.branch)}\n` +
      `🤖 Agent: ${online ? '🟢 ONLINE' : '🔴 OFFLINE'}\n\n` +
      `Agent sizning KOMPYUTERINGIZDA real git bajaradi:\n` +
      `<code>git add . → git commit → git push origin ${esc(member.branch)}</code>\n\n` +
      `❗ O'z kompyuteringizda kerakli branchga o'tgan bo'ling.\n\n` +
      `Push qilamizmi?`;

    await telegram.sendMessage(preview, {
      chatId,
      keyboard: {
        inline_keyboard: [[
          { text: '✅ PUSH QILISH', callback_data: `push:confirm:${from.id}` },
          { text: '❌ BEKOR QILISH', callback_data: 'push:cancel' },
        ]],
      },
    });
  }

  // ---- PUSH: agentga buyruq yuborish (faqat tasdiqlangandan keyin) ----
  async function confirmPush(telegramUserId, chatId) {
    if (isBusy(telegramUserId)) {
      return telegram.sendMessage('⏳ Git operation bajarilmoqda...', { chatId });
    }
    const member = team.findByTelegramId(telegramUserId);
    if (!member) return telegram.sendMessage('❌ Siz tanilmadingiz.', { chatId });
    if (!member.branch) return telegram.sendMessage('⚠️ Branch biriktirilmagan.', { chatId });
    if (!agents) return telegram.sendMessage('❌ Agent tizimi sozlanmagan.', { chatId });
    if (!agents.isOnline(member.key)) {
      return telegram.sendMessage(
        `🔴 <b>Agent ulanmagan.</b>\n\n👤 ${esc(member.name)} kompyuteridagi agent OFFLINE.\nAgent'ni ishga tushiring (agent papkasida npm start) va qayta urinib ko'ring.`,
        { chatId }
      );
    }

    setBusy(telegramUserId, true);
    try {
      const cmd = agents.sendCommand(member.key, 'push', member.branch, chatId);
      logger.telegram(`agent command sent: ${cmd.id} push -> ${member.key}`);
      await telegram.sendMessage(
        `⏳ <b>Agentga yuborildi</b>\n\n👤 ${esc(member.name)}\n🌿 Branch: ${esc(member.branch)}\n🆔 ${esc(cmd.id.slice(0, 8))}\n\nAgent kompyuterda REAL git bajaradi — natija shu chatga keladi.`,
        { chatId }
      );
    } finally {
      setBusy(telegramUserId, false);
    }
  }

  /* __APPEND_MARKER__ */

  // ---- GIT PULL FLOW (Local Agent orqali) ----
  async function startPullFlow(msg) {
    const from = msg.from || {};
    const chatId = msg.chat && msg.chat.id;
    if (isBusy(from.id)) {
      return telegram.sendMessage('⏳ Git operation bajarilmoqda... biroz kuting.', { chatId });
    }
    const member = team.findByTelegramId(from.id);
    if (!member) return telegram.sendMessage('❌ Siz tanilmadingiz. /start bilan ismingizni kiriting.', { chatId });
    if (!member.branch) return telegram.sendMessage('⚠️ Sizga hali branch biriktirilmagan. Admin bilan bog\'laning.', { chatId });

    const online = agents ? agents.isOnline(member.key) : false;
    await telegram.sendMessage(
      `🔄 <b>MAIN'DAN YANGILIKNI OLAMIZMI?</b>\n\n` +
      `👤 Member: ${esc(member.name)}\n` +
      `🌿 Branch: ${esc(member.branch)}\n` +
      `🤖 Agent: ${online ? '🟢 ONLINE' : '🔴 OFFLINE'}\n\n` +
      `Agent kompyuteringizda bajaradi:\n<code>git fetch origin\ngit pull --ff-only origin main</code>`,
      {
        chatId,
        keyboard: {
          inline_keyboard: [[
            { text: '✅ PULL QILISH', callback_data: `pull:confirm:${from.id}` },
            { text: '❌ BEKOR QILISH', callback_data: 'pull:cancel' },
          ]],
        },
      }
    );
  }

  async function confirmPull(telegramUserId, chatId) {
    if (isBusy(telegramUserId)) {
      return telegram.sendMessage('⏳ Git operation bajarilmoqda...', { chatId });
    }
    const member = team.findByTelegramId(telegramUserId);
    if (!member) return telegram.sendMessage('❌ Siz tanilmadingiz.', { chatId });
    if (!agents) return telegram.sendMessage('❌ Agent tizimi sozlanmagan.', { chatId });
    if (!agents.isOnline(member.key)) {
      return telegram.sendMessage(
        `🔴 <b>Agent ulanmagan.</b>\n\n👤 ${esc(member.name)} agenti OFFLINE.\nAgent'ni ishga tushiring va qayta urinib ko'ring.`,
        { chatId }
      );
    }

    setBusy(telegramUserId, true);
    try {
      const cmd = agents.sendCommand(member.key, 'pull', member.branch, chatId);
      logger.telegram(`agent command sent: ${cmd.id} pull -> ${member.key}`);
      await telegram.sendMessage(
        `⏳ <b>Agentga yuborildi</b>\n\n👤 ${esc(member.name)}\n🌿 Branch: ${esc(member.branch)}\n🆔 ${esc(cmd.id.slice(0, 8))}\n\nAgent kompyuterda real pull bajaradi — natija shu chatga keladi.`,
        { chatId }
      );
    } finally {
      setBusy(telegramUserId, false);
    }
  }

  // ---- AGENT NATIJASI (agent result endpoint'dan keldi) ----
  // Bu yerdan boshqa hech qanday git bajarilmaydi — faqat xabar + audit.
  function onAgentResult(cmd) {
    if (!cmd) return;
    const r = cmd.result || {};
    const member = team.findByKey(cmd.memberKey) || { name: cmd.memberKey, githubUsername: null };
    const chatId = cmd.chatId;
    const branch = r.branch || cmd.branch || '—';
    // Status semantikasi: push uchun 'pushed' | 'no_changes' | 'error' (agent git.js);
    // eski/umumiy qiymatlar: 'done' | 'failed' | 'timeout' (pull va boshqalar uchun)
    const pushStatus = r.status || (cmd.status === 'done' ? 'pushed' : cmd.status === 'failed' ? 'error' : cmd.status);
    const ok = ['done', 'pushed', 'no_changes'].includes(cmd.status);

    (async () => {
      try {
        if (cmd.type === 'push') {
          if (ok && pushStatus === 'no_changes') {
            // Yangi commit yuborilmadi — SUCCESS EMAS, aniq "no_changes" holati
            db.recordPush({
              telegramUserId: null,
              memberName: member.name,
              githubUsername: member.githubUsername,
              branch,
              commitHash: r.commitHash || null,
              commitMessage: null,
              result: 'no_changes',
              source: 'agent',
            });
            if (chatId) {
              await telegram.sendMessage(
                `ℹ️ <b>GIT PUSH QILINMADI — yangi o'zgarish yo'q</b>\n\n👤 Kim: ${esc(member.name)}\n🌿 Branch: ${esc(branch)}\n\nWorking tree clean — commit va push bajarilmadi.\n(Real push emas, shuning uchun bu SUCCESS emas.)`,
                { chatId }
              );
            }
            // guruhga GIT ACTIVITY YUBORILMAYDI — hech narsa yuborilmadi
          } else if (ok && pushStatus === 'pushed') {
            // Yangi commit remote'ga HAQIQATAN yuborildi (verify qilingan)
            db.recordPush({
              telegramUserId: null,
              memberName: member.name,
              githubUsername: member.githubUsername,
              branch,
              commitHash: r.commitHash || null,
              commitMessage: r.commitMessage || null,
              result: 'pushed',
              source: 'agent',
            });
            if (chatId) {
              await telegram.sendMessage(
                `✅ <b>GIT PUSH BO'LDI</b>\n\n👤 Kim: ${esc(member.name)}\n🐙 GitHub: ${member.githubUsername ? '@' + esc(member.githubUsername) : '—'}\n🌿 Branch: ${esc(branch)}\n📝 Commit: ${esc(r.commitHash ? r.commitHash.slice(0, 7) : '—')}\n💬 ${esc(r.commitMessage || '')}`,
                { chatId }
              );
            }
            // guruhga GIT ACTIVITY
            if (config.telegram.chatId) {
              telegram.sendMessage(
                `📦 <b>GIT ACTIVITY</b>\n\n👤 ${esc(member.name)}\n🐙 ${member.githubUsername ? '@' + esc(member.githubUsername) : '—'}\n🌿 ${esc(branch)}\n🚀 Git Push\n\n📝 Commit: ${esc(r.commitHash ? r.commitHash.slice(0, 7) : '—')}\n💬 ${esc(r.commitMessage || '')}\n🕐 ${esc(fmtTime(new Date().toISOString()))}`,
                { chatId: config.telegram.chatId }
              ).catch(() => {});
            }
          } else {
            // error — yangi commit yuborilmadi
            db.recordPush({
              telegramUserId: null,
              memberName: member.name,
              githubUsername: member.githubUsername,
              branch,
              commitHash: r.commitHash || null,
              commitMessage: null,
              result: 'error',
              source: 'agent',
            });
            if (chatId) {
              await telegram.sendMessage(
                `❌ <b>GIT PUSH BO'LMADI</b>\n\n👤 ${esc(member.name)}\n🌿 ${esc(branch)}\n\n⚠️ Sabab:\n${esc(r.reason || 'agent push failed')}`,
                { chatId }
              );
            }
          }
        } else if (cmd.type === 'pull') {
          if (ok) {
            if (chatId) {
              await telegram.sendMessage(
                `✅ <b>GIT PULL BO'LDI</b>\n\n👤 Kim: ${esc(member.name)}\n🌿 Branch: ${esc(branch)}\n\nMain'dan yangi kodlar olindi.\n📝 ${esc(r.output ? r.output.slice(0, 200) : '')}`,
                { chatId }
              );
            }
            if (config.telegram.chatId) {
              telegram.sendMessage(
                `📦 <b>GIT ACTIVITY</b>\n\n👤 ${esc(member.name)}\n🌿 ${esc(branch)}\n🔄 Git Pull\n\n🕐 ${esc(fmtTime(new Date().toISOString()))}`,
                { chatId: config.telegram.chatId }
              ).catch(() => {});
            }
          } else if (chatId) {
            const conflict = /CONFLICT/i.test(r.reason || '');
            const reason = conflict
              ? '⚠️ GIT CONFLICT\n\nPull to\'xtatildi.\nConflictni lokal tarzda hal qilish kerak.\n(Avtomatik hal qilinmaydi, force qilinmaydi.)'
              : `⚠️ Sabab:\n${esc(r.reason || 'git pull failed')}`;
            await telegram.sendMessage(`❌ <b>GIT PULL BO'LMADI</b>\n\n${reason}`, { chatId });
          }
        }
      } catch (e) {
        logger.error('agent result telegram xato:', e.message);
      }
    })();
  }

  /* __APPEND_MARKER2__ */

  // ---- OXIRGI KOD O'ZGARTIRGAN (GitHub API primary — REAL) ----
  async function handleLastPush(msg) {
    const chatId = msg.chat && msg.chat.id;

    // 1) GitHub API — default branch'dagi REAL oxirgi commit
    try {
      const commits = await github.listCommits(config.github.defaultBranch, 1);
      const c = commits && commits[0];
      if (c) {
        const author = c.author && c.author.login
          ? '@' + c.author.login
          : (c.commit && c.commit.author ? c.commit.author.name : 'unknown');
        return telegram.sendMessage(
          `🕒 <b>OXIRGI KODNI KIM O'ZGARTIRDI?</b>\n\n` +
          `(GitHub'dagi REAL holat — ${esc(config.github.defaultBranch)} branch)\n\n` +
          `👤 Kim: ${esc(author)}\n` +
          `🌿 Branch: ${esc(config.github.defaultBranch)}\n` +
          `📝 Commit: ${esc(c.sha ? c.sha.slice(0, 7) : '—')}\n` +
          `💬 Message: ${esc((c.commit && c.commit.message ? c.commit.message : '').split('\n')[0])}\n` +
          `🕐 Vaqt: ${esc(fmtTime(c.commit && c.commit.author && c.commit.author.date))}`,
          {
            chatId,
            keyboard: { inline_keyboard: c.html_url ? [[{ text: '🔗 GitHub\'da ko\'rish', url: c.html_url }]] : undefined },
          }
        );
      }
    } catch (e) {
      logger.error('GitHub last commit olishda xato:', e.message);
      // fallback davom etadi
    }

    // 2) Bot audit logi — oxirgi HAQIQATAN push qilingan holat (agent/bot/webhook)
    const last = db.getLastPush();
    if (last && ['pushed', 'success'].includes(last.result)) {
      return telegram.sendMessage(
        `🕒 <b>OXIRGI KODNI KIM O'ZGARTIRDI?</b>\n\n` +
        `(bot/agent audit logi — GitHub API javob bermadi)\n\n` +
        `👤 Kim: ${esc(last.memberName || "(bot'dan tashqari)")}\n` +
        `🐙 GitHub: ${last.githubUsername ? '@' + esc(last.githubUsername) : '—'}\n` +
        `🌿 Branch: ${esc(last.branch || '—')}\n` +
        `📝 Commit: ${esc(last.commitHash || '—')}\n` +
        `💬 Message: ${esc(last.commitMessage || '—')}\n` +
        `🕐 Vaqt: ${esc(fmtTime(last.timestamp))}`,
        { chatId }
      );
    }

    // 3) Local git (bot mashinasidagi repo) — oxirgi variant
    const lastCommit = await git.lastCommit();
    if (lastCommit) {
      return telegram.sendMessage(
        `🕒 <b>OXIRGI KODNI KIM O'ZGARTIRDI?</b>\n\n(local repo oxirgi commit)\n\n📝 Commit: ${esc(lastCommit.hash)}\n💬 Message: ${esc(lastCommit.message)}`,
        { chatId }
      );
    }
    return telegram.sendMessage('ℹ️ Hali hech qanday push amalga oshirilmagan.', { chatId });
  }

  // ---- Callback query (inline tugmalar) ----
  async function handleCallback(query) {
    const data = String(query.data || '');
    const chatId = query.message && query.message.chat && query.message.chat.id;
    const from = query.from || {};
    try {
      if (data === 'push:cancel' || data === 'pull:cancel') {
        await telegram.answerCallbackQuery(query.id, 'Bekor qilindi');
        if (chatId) await telegram.sendMessage('❌ Bekor qilindi.', { chatId });
        return;
      }
      const [kind, action, userId] = data.split(':');
      if (action !== 'confirm') return;
      // TUGMA FAQAT O'Z OPERATIONI UCHUN: callback'dagi userId faqat
      // o'zining ID'si bo'lsa bajariladi (boshqaning pushini tasdiqlay olmaydi)
      if (String(from.id) !== String(userId)) {
        return telegram.answerCallbackQuery(query.id, "Bu sizning operation'ingiz emas.");
      }
      if (kind === 'push') {
        await telegram.answerCallbackQuery(query.id, 'Push boshlanmoqda...');
        await confirmPush(from.id, chatId);
      } else if (kind === 'pull') {
        await telegram.answerCallbackQuery(query.id, 'Pull boshlanmoqda...');
        await confirmPull(from.id, chatId);
      }
    } catch (e) {
      logger.error('callback ishlov xato:', e.message);
      try { await telegram.answerCallbackQuery(query.id, 'Xato yuz berdi'); } catch (_) { /* noop */ }
    }
  }





  return {
    handleStart, handleMessage, handleLastPush, startPushFlow, startPullFlow,
    handleCallback, isBusy, onAgentResult,
    statusProvider: () => ({ telegram: true, git: gitReady }),
    get awaitingName() { return awaitingName; },
  };
}

module.exports = { createUI, MENU_KEYBOARD };
