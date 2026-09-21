'use strict';
// ============================================================
// database.js — bot uchun ALOHIDA JSON storage (data/bot-state.json).
// OrzuTalim production database'iga HECH QANDAY dependency YO'Q.
// Saqlanadi: bindings (telegram<->github+branch), pendingBinds
// (verification), processedWebhookIds (duplicate protection).
// Sensitive data saqlanmaydi.
// ============================================================
const fs = require('fs');
const path = require('path');

const MAX_PROCESSED_IDS = 2000;

function emptyState() {
  return {
    bindings: [],            // { telegramUserId, telegramUsername, githubUsername, branch, role, createdAt, updatedAt, approvedBy }
    pendingBinds: [],        // { telegramUserId, telegramUsername, githubUsername, code, createdAt, expiresAt }
    processedWebhookIds: [], // GitHub delivery IDs
    workflowStatus: {},      // { workflowName: 'success'|'failure' } — success spam kamaytirish uchun
    memberBindings: {},      // { memberKey: { telegramUserId, githubUsername, branch, enabled } }
    lastPush: null,          // oxirgi muvaffaqiyatli push (audit)
    pushHistory: [],         // push audit logi (max 50)
    agentCommands: [],       // Central Bot -> Local Agent command queue (max 100)
  };
}

function createDatabase(dataDir) {
  const file = path.join(dataDir, 'bot-state.json');

  function read() {
    try {
      if (!fs.existsSync(file)) return emptyState();
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      return Object.assign(emptyState(), raw);
    } catch (e) {
      console.error('[DB] state o\'qishda xato, yangi state yaratilyapti:', e.message);
      return emptyState();
    }
  }

  function write(state) {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
    fs.renameSync(tmp, file); // atomic write
  }

  return {
    // ---- Bindings ----
    getBindingByTelegramId(telegramUserId) {
      return read().bindings.find((b) => String(b.telegramUserId) === String(telegramUserId)) || null;
    },
    getBindingByGithub(githubUsername) {
      return read().bindings.find(
        (b) => String(b.githubUsername).toLowerCase() === String(githubUsername).toLowerCase()
      ) || null;
    },
    getAllBindings() {
      return read().bindings;
    },
    upsertBinding({ telegramUserId, telegramUsername, githubUsername, branch, role, approvedBy }) {
      const state = read();
      const now = new Date().toISOString();
      const existing = state.bindings.find((b) => String(b.telegramUserId) === String(telegramUserId));
      if (existing) {
        Object.assign(existing, {
          telegramUsername: telegramUsername || existing.telegramUsername,
          githubUsername,
          branch,
          role: role || existing.role,
          updatedAt: now,
          approvedBy: approvedBy || existing.approvedBy,
        });
      } else {
        state.bindings.push({
          telegramUserId: String(telegramUserId),
          telegramUsername: telegramUsername || '',
          githubUsername,
          branch,
          role: role || 'developer',
          createdAt: now,
          updatedAt: now,
          approvedBy: approvedBy || '',
        });
      }
      write(state);
    },
    deleteBinding(telegramUserId) {
      const state = read();
      const before = state.bindings.length;
      state.bindings = state.bindings.filter((b) => String(b.telegramUserId) !== String(telegramUserId));
      write(state);
      return before !== state.bindings.length;
    },

    // ---- Pending binds (one-time verification) ----
    addPendingBind({ telegramUserId, telegramUsername, githubUsername, code, ttlMs = 15 * 60 * 1000 }) {
      const state = read();
      const now = Date.now();
      // eski expiredlarni tozalash
      state.pendingBinds = state.pendingBinds.filter((p) => p.expiresAt > now);
      // o'sha user'ning eski pendinglarini o'chirish
      state.pendingBinds = state.pendingBinds.filter((p) => String(p.telegramUserId) !== String(telegramUserId));
      state.pendingBinds.push({
        telegramUserId: String(telegramUserId),
        telegramUsername: telegramUsername || '',
        githubUsername,
        code,
        createdAt: new Date(now).toISOString(),
        expiresAt: now + ttlMs,
      });
      write(state);
    },
    // admin tasdiqlashi: username + code mos bo'lsa binding yaratadi
    approvePendingBind(githubUsername, code, approvedBy) {
      const state = read();
      const now = Date.now();
      const pending = state.pendingBinds.find(
        (p) =>
          p.expiresAt > now &&
          String(p.githubUsername).toLowerCase() === String(githubUsername).toLowerCase() &&
          String(p.code) === String(code)
      );
      if (!pending) return null;
      state.pendingBinds = state.pendingBinds.filter((p) => p !== pending);
      const existing = state.bindings.find((b) => String(b.telegramUserId) === pending.telegramUserId);
      if (existing) {
        Object.assign(existing, {
          githubUsername: pending.githubUsername,
          telegramUsername: pending.telegramUsername || existing.telegramUsername,
          updatedAt: new Date(now).toISOString(),
          approvedBy: approvedBy || '',
        });
      } else {
        state.bindings.push({
          telegramUserId: pending.telegramUserId,
          telegramUsername: pending.telegramUsername || '',
          githubUsername: pending.githubUsername,
          branch: '',
          role: 'developer',
          createdAt: new Date(now).toISOString(),
          updatedAt: new Date(now).toISOString(),
          approvedBy: approvedBy || '',
        });
      }
      write(state);
      return { telegramUserId: pending.telegramUserId, githubUsername: pending.githubUsername };
    },
    removePendingBind(telegramUserId) {
      const state = read();
      state.pendingBinds = state.pendingBinds.filter((p) => String(p.telegramUserId) !== String(telegramUserId));
      write(state);
    },
    getPendingByCode(githubUsername, code) {
      const state = read();
      const now = Date.now();
      return state.pendingBinds.find(
        (p) =>
          p.expiresAt > now &&
          String(p.githubUsername).toLowerCase() === String(githubUsername).toLowerCase() &&
          String(p.code) === String(code)
      ) || null;
    },

    // ---- Duplicate webhook protection ----
    isWebhookProcessed(deliveryId) {
      if (!deliveryId) return false;
      const state = read();
      return state.processedWebhookIds.includes(String(deliveryId));
    },
    markWebhookProcessed(deliveryId) {
      if (!deliveryId) return;
      const state = read();
      state.processedWebhookIds.push(String(deliveryId));
      if (state.processedWebhookIds.length > MAX_PROCESSED_IDS) {
        state.processedWebhookIds = state.processedWebhookIds.slice(-MAX_PROCESSED_IDS);
      }
      write(state);
    },

    // ---- Workflow status (success spam kamaytirish) ----
    getWorkflowStatus(name) {
      const state = read();
      return state.workflowStatus[name] || null;
    },
    setWorkflowStatus(name, conclusion) {
      const state = read();
      state.workflowStatus[name] = conclusion;
      write(state);
    },

    // ---- Team member bindings (Telegram ID -> member -> github -> branch) ----
    getMemberBinding(key) {
      const state = read();
      return (state.memberBindings && state.memberBindings[key]) || null;
    },
    setMemberBinding(key, patch) {
      const state = read();
      if (!state.memberBindings) state.memberBindings = {};
      const existing = state.memberBindings[key] || {};
      state.memberBindings[key] = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      write(state);
    },

    // ---- Push history / oxirgi push (audit log — restartdan keyin saqlanadi) ----
    getLastPush() {
      const state = read();
      return state.lastPush || null;
    },
    recordPush({ telegramUserId, memberName, githubUsername, branch, commitHash, commitMessage, result, source }) {
      const state = read();
      const entry = {
        timestamp: new Date().toISOString(),
        telegramUserId: telegramUserId == null ? null : String(telegramUserId),
        memberName: memberName || null,
        githubUsername: githubUsername || null,
        branch: branch || null,
        commitHash: commitHash || null,
        commitMessage: commitMessage || null,
        result: result || 'success',
        source: source || 'bot', // 'bot' | 'webhook' | 'manual'
      };
      state.lastPush = entry;
      if (!state.pushHistory) state.pushHistory = [];
      state.pushHistory.push(entry);
      if (state.pushHistory.length > 50) state.pushHistory = state.pushHistory.slice(-50);
      write(state);
      return entry;
    },
    getPushHistory(limit = 10) {
      const state = read();
      const h = state.pushHistory || [];
      return limit ? h.slice(-limit).reverse() : [...h].reverse();
    },

    // ---- Agent command queue (Central Bot -> Local Agent) ----
    addAgentCommand({ id, memberKey, type, branch, chatId }) {
      const state = read();
      if (!state.agentCommands) state.agentCommands = [];
      const cmd = {
        id, memberKey, type,
        branch: branch || null,
        chatId: chatId == null ? null : String(chatId),
        status: 'pending',
        createdAt: new Date().toISOString(),
        sentAt: null,
        result: null,
      };
      state.agentCommands.push(cmd);
      if (state.agentCommands.length > 100) state.agentCommands = state.agentCommands.slice(-100);
      write(state);
      return cmd;
    },
    // Agent poll: birinchi pending commandni oladi (pending -> sent)
    takeAgentCommand(memberKey) {
      const state = read();
      if (!state.agentCommands) return null;
      const cmd = state.agentCommands.find((c) => c.memberKey === memberKey && c.status === 'pending');
      if (!cmd) return null;
      cmd.status = 'sent';
      cmd.sentAt = new Date().toISOString();
      write(state);
      return cmd;
    },
    getAgentCommand(id) {
      const state = read();
      return (state.agentCommands || []).find((c) => c.id === id) || null;
    },
    finishAgentCommand(id, { status, result }) {
      const state = read();
      const cmd = (state.agentCommands || []).find((c) => c.id === id);
      if (!cmd) return null;
      cmd.status = status; // 'done' | 'failed' | 'timeout'
      cmd.result = result || null;
      cmd.finishedAt = new Date().toISOString();
      write(state);
      return cmd;
    },
    // Timeout bo'lgan 'sent' commandlar (javob kelgan yo'q)
    staleSentAgentCommands(timeoutMs) {
      const state = read();
      const now = Date.now();
      return (state.agentCommands || []).filter(
        (c) => c.status === 'sent' && c.sentAt && now - new Date(c.sentAt).getTime() > timeoutMs
      );
    },
  };
}

module.exports = { createDatabase };
