'use strict';
// ============================================================
// index.js — OrzuTalim Dev Bot: asosiy orchestrator.
//
// MUSTAQIL PROCESS — mavjud OrzuTalim serveriga (server/server.cjs,
// db.cjs) HECH QANDAY dependency YO'Q, uning portiga tegmaydi.
// Crash-ga chidamli: uncaught xatolar botni o'ldirmaydi.
//
// PM2: pm2 start github-team-bot/src/index.js --name orzutalim-dev-bot
// ============================================================
const { createConfig, validateConfig, logConfigStatus } = require('./config');
const { logger } = require('./logger');
const { createDatabase } = require('./database');
const { createGitHubClient } = require('./github');
const { createTelegramBot } = require('./telegram');
const { createServer } = require('./server');
const { createWebhookHandler } = require('./webhook');
const { createGitOps } = require('./gitops');
const { createTeam, PROTECTED_BRANCHES } = require('./team');
const { createUI } = require('./ui');
const { createAgents } = require('./agents');
const { esc } = require('./formatters');

const { statusCommand } = require('./commands/status');

// ---- Factory: test uchun dependency injection imkonini beradi ----
function createBot(overrides = {}) {
  const config = overrides.config || createConfig();
  const db = overrides.db || createDatabase(config.dataDir);
  const github = overrides.github || createGitHubClient(config.github);
  const telegram = overrides.telegram || createTelegramBot(config.telegram);
  const git = overrides.git || createGitOps({ repoPath: config.repoPath });
  const team = overrides.team || createTeam(db);
  const agents = overrides.agents || createAgents({ config, db });
  const ui = overrides.ui || createUI({ config, db, team, git, telegram, github, agents });
  const ctx = { config, db, github, telegram, git, team, agents, ui };
  const isAdmin = (id) => config.adminIds.includes(String(id));
  let gitReady = false;
  let watchdog = null;

  // ---- Telegram update router ----
  // User ko'radigan: /start, /status, 3 tugma.
  // ESKI user komandalar (/help /team /commits /pr /main /mybranch /bind) — YASHIRIN.
  // Admin komandalar (faqat BOT_ADMIN_IDS): /members /setbranch /setgithub
  //   /enable /disable /unbind /pushhistory — raw shell YO'Q.
  async function handleCommand(msg) {
    const text = String(msg.text || '').trim();
    const from = msg.from || {};
    const chatId = msg.chat && msg.chat.id;
    if (!text.startsWith('/')) {
      // 3 tugma Reply keyboard'dan kelgan text yoki ism kiritish
      return ui.handleMessage(msg);
    }
    const cmd = text.split(/\s+/)[0].split('@')[0].toLowerCase();
    logger.telegram(`command=${cmd} user=${from.id}`);

    try {
      switch (cmd) {
        case '/start':
          return await ui.handleStart(msg);
        case '/status':
          return await handleMemberStatus(msg);
        // ---- ADMIN-ONLY (yashirin) ----
        case '/members':
          return await adminMembers(msg);
        case '/setbranch':
          return adminSet('setBranch', msg);
        case '/setgithub':
          return adminSet('setGithub', msg);
        case '/enable':
          return adminSet('setEnabledTrue', msg);
        case '/disable':
          return adminSet('setEnabledFalse', msg);
        case '/unbind':
          return adminSet('unbind', msg);
        case '/pushhistory':
          return adminPushHistory(msg);
        default:
          // noma'lum/eski komanda — foydalanuvchiga ko'rinmaydi (jimlik)
          logger.telegram(`hidden command ignored: ${cmd} user=${from.id}`);
          return;
      }
    } catch (e) {
      logger.error(`command ishlov xato (${cmd}):`, e.message);
      try {
        await telegram.sendMessage('❌ Amal bajarilmadi. Qaytadan urinib ko\'ring.', { chatId });
      } catch (_) { /* ignore */ }
    }
  }

  // member uchun sodda /status
  async function handleMemberStatus(msg) {
    const from = msg.from || {};
    const member = team.findByTelegramId(from.id);
    if (!isAdmin(from.id) && !member) {
      return telegram.sendMessage('❌ Siz tanilmadingiz. /start bilan ismingizni kiriting.', { chatId: msg.chat && msg.chat.id });
    }
    const result = await statusCommand(ctx);
    await telegram.sendMessage(result.text, { keyboard: result.keyboard, chatId: msg.chat && msg.chat.id });
  }

  // ---- Admin handlers (raw shell YO'Q — faqat config/api) ----
  async function adminMembers(msg) {
    if (!isAdmin(msg.from && msg.from.id)) return; // yashirin
    const members = team.listMembers();
    let text = '👥 <b>TEAM (5 member)</b>\n\n';
    for (const m of members) {
      text += `${m.enabled ? '🟢' : '🔴'} <b>${esc(m.name)}</b>\n`;
      text += `  Telegram: ${m.telegramUserId ? esc(m.telegramUserId) : '—'}\n`;
      text += `  GitHub: ${m.githubUsername ? '@' + esc(m.githubUsername) : '—'}\n`;
      text += `  Branch: ${m.branch ? esc(m.branch) : '—'}\n\n`;
    }
    const errors = team.validate();
    if (errors.length) text += `⚠️ CONFIG:\n${errors.map((e) => '• ' + esc(e)).join('\n')}`;
    return telegram.sendMessage(text, { chatId: msg.chat && msg.chat.id });
  }

  function adminSet(op, msg) {
    if (!isAdmin(msg.from && msg.from.id)) return; // yashirin
    const args = String(msg.text || '').trim().split(/\s+/).slice(1);
    const [key, value] = args;
    let ok = false;
    if (op === 'setBranch' && key && value) ok = team.setBranch(key, value);
    else if (op === 'setGithub' && key && value) ok = team.setGithub(key, value);
    else if (op === 'setEnabledTrue' && key) ok = team.setEnabled(key, true);
    else if (op === 'setEnabledFalse' && key) ok = team.setEnabled(key, false);
    else if (op === 'unbind' && key) ok = team.unbind(key);
    return telegram.sendMessage(ok ? '✅ Bajarildi.' : '❌ Bajarilmadi (noma\'lum member / protected branch / argument yo\'q).', { chatId: msg.chat && msg.chat.id });
  }

  function adminPushHistory(msg) {
    if (!isAdmin(msg.from && msg.from.id)) return;
    const history = db.getPushHistory(10);
    if (!history.length) return telegram.sendMessage('ℹ️ Push history bo\'sh.', { chatId: msg.chat && msg.chat.id });
    let text = '📜 <b>PUSH HISTORY</b>\n\n';
    const icon = (r) => (r === 'no_changes' ? 'ℹ️' : (['success', 'pushed'].includes(r) ? '✅' : '❌'));
    text += history.map((h) =>
      `${icon(h.result)} [${esc(h.result || '?')}] ${esc(h.memberName || '?')} → ${esc(h.branch || '?')}\n  ${esc(h.commitHash || '—')} ${esc((h.commitMessage || '').slice(0, 40))}\n  🕐 ${esc(h.timestamp)}`
    ).join('\n\n');
    return telegram.sendMessage(text, { chatId: msg.chat && msg.chat.id });
  }

  // ---- Callback query (inline button) ----
  async function handleCallbackQuery(query) {
    const data = query.data || '';
    if (data.startsWith('push:') || data.startsWith('pull:') || data === 'push:cancel' || data === 'pull:cancel') {
      return ui.handleCallback(query);
    }
    // eski 'copy:' callback — back-compat (jim)
  }

  // ---- Telegram update dispatch ----
  function handleUpdate(update) {
    if (update.message) return handleCommand(update.message);
    if (update.callback_query) return handleCallbackQuery(update.callback_query);
  }

  /* __APPEND_MARKER2__ */

  // ---- Start ----
  async function start() {
    // ENV diagnostic (secret qiymatlari ko'rsatilmaydi — faqat SET/MISSING)
    logConfigStatus(config);
    const missing = validateConfig(config);
    if (missing.length) {
      logger.error('ENV yetishmaydi:', missing.join(', '), '\ngithub-team-bot/.env faylini to\'ldiring (.env.example ga qarang). Fayl aynan: github-team-bot/.env bo\'lishi kerak (.env.txt emas).');
      process.exitCode = 1;
      return;
    }

    // TEAM CONFIG validatsiya (5 member, duplicate yo'q, branch main emas)
    const teamErrors = team.validate();
    if (teamErrors.length) {
      logger.error('❌ TEAM CONFIG ERROR:', teamErrors.join(' | '));
    } else {
      logger.info('[CONFIG] Team members: 5 ✅ (ahatjon, sardor, shodyona, oyatilo, omadbek)');
    }

    // AGENT diagnostics
    const agentCount = Object.keys(config.agentTokens || {}).length;
    if (agentCount === 5) {
      logger.info('[CONFIG] Agents: 5 ✅ (har member tokeni sozlangan)');
    } else {
      logger.error(`❌ AGENT CONFIG: AGENT_TOKENS da ${agentCount} ta token — 5 bo'lishi kerak`);
    }

    // GIT REPOSITORY detection
    gitReady = await git.isRepo();
    if (gitReady) {
      logger.info(`✅ Git repository detected: ${config.repoPath}`);
    } else {
      logger.error(`❌ Git repository not found: ${config.repoPath} — REPO_PATH ni .env da tekshiring. Git operations DISABLED.`);
    }

    const webhookHandler = createWebhookHandler(ctx);
    const server = overrides.server || createServer(webhookHandler, {
      port: config.port,
      healthProvider: () => ({
        process: 'running',
        telegram: telegram.getStatus ? telegram.getStatus() : { polling: true, connected: true },
        github: github.getStatus ? github.getStatus() : null,
        git: gitReady,
        agents: agents.onlineStatuses(),
        queue: db.agentQueueStats ? db.agentQueueStats() : null,
        uptime: Math.floor(process.uptime()),
      }),
      agents,
      onAgentResult: (cmd) => ui.onAgentResult(cmd),
    });
    try {
      await server.listen();
    } catch (e) {
      if (e.code === 'EADDRINUSE') {
        // FAQAT BITTA INSTANCE: port band = bot allaqachon ishlayapti.
        // Restart-loop uchun maxsus exit kod (99) — loop 60s kutadi.
        logger.error(`⚠️ Port ${config.port} band — bot allaqachon ishlayapti (duplicate instance himoyasi). Chiqyapti (kod 99).`);
        process.exit(99);
      }
      throw e;
    }
    logger.info(`webhook server ${config.port} portda ishlayapti → POST /webhook/github`);
    if (config.publicWebhookUrl) {
      logger.info(`public webhook URL: ${config.publicWebhookUrl}`);
    }

    // Agent watchdog: agent javob bermagan (timeout) commandlarni aniqlash
    watchdog = setInterval(() => {
      try {
        const stale = agents.staleCommands();
        for (const cmd of stale) {
          agents.completeResult(cmd.id, { status: 'timeout', reason: 'Agent javob bermadi (120s timeout)' });
          if (cmd.chatId) {
            telegram.sendMessage(
              `⏱️ <b>GIT OPERATION TIMEOUT</b>\n\n👤 ${esc(cmd.memberKey)}\n🌿 ${esc(cmd.branch || '—')}\n🆔 ${esc(cmd.id.slice(0, 8))}\n\nAgent 120s ichida javob bermadi.\nAgent kompyuterda ishlab turganini tekshiring.\n(Polling va Telegram o'z ishida davom etadi).`,
              { chatId: cmd.chatId }
            ).catch(() => {});
          }
          logger.error(`agent command TIMEOUT: ${cmd.id} (${cmd.memberKey})`);
        }
      } catch (e) {
        logger.error('watchdog xato:', e.message);
      }
    }, 30000);
    if (watchdog.unref) watchdog.unref();

    // FAQAT 2 ta ko'rinadigan komanda (eski komandalar menuda YO'Q)
    await telegram.setCommands([
      { command: 'start', description: 'Botni ishga tushirish' },
      { command: 'status', description: 'Repo holati' },
    ]);

    const polling = telegram.startPolling(handleUpdate);
    logger.info('Telegram long polling ishga tushdi ✅');

    return { server, polling, ctx, watchdog };
  }

  return { ctx, start, handleCommand, handleCallbackQuery, handleUpdate };
}

// ---- Crash-ga chidamlilik: xatolar processni o'ldirmasin ----
process.on('uncaughtException', (e) => logger.error('uncaughtException:', e.message));
process.on('unhandledRejection', (e) => logger.error('unhandledRejection:', e && e.message ? e.message : String(e)));

if (require.main === module) {
  const bot = createBot();
  bot.start().then((r) => {
    if (!r) return;
    logger.info('🤖 OrzuTalim Dev Bot ishga tushdi');
    const shutdown = async () => {
      logger.info('o\'chiryapti...');
      try { if (r.watchdog) clearInterval(r.watchdog); } catch {}
      try { await r.polling.stop(); } catch {}
      try { await r.server.close(); } catch {}
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }).catch((e) => {
    logger.error('start xato:', e.message);
  });
}

module.exports = { createBot };


