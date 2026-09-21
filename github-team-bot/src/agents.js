'use strict';
// ============================================================
// agents.js — Local Dev Agent registry (Central Bot tomoni).
//
// Har member kompyuterida agent ishlaydi:
//   agent -> GET /agent/poll?token=...   (command olish)
//   agent -> POST /agent/result          (natija qaytarish)
//
// Token: AGENT_TOKENS env (ahatjon=t1,sardor=t2,...) — faqat shu
// 5 member agentiga ruxsat. Ismdan emas, token+memberKey'dan.
// ============================================================
const crypto = require('crypto');

const ONLINE_WINDOW_MS = 25 * 1000;   // oxirgi poll 25s ichida = online
const COMMAND_TIMEOUT_MS = 120 * 1000; // agent javob bermasa 120s = timeout

function createAgents({ config, db }) {
  const lastSeen = new Map(); // memberKey -> timestamp

  function memberByToken(token) {
    if (!token) return null;
    for (const [key, value] of Object.entries(config.agentTokens || {})) {
      if (value === token) return key;
    }
    return null;
  }

  function markSeen(memberKey) {
    lastSeen.set(memberKey, Date.now());
  }

  function isOnline(memberKey) {
    return (lastSeen.get(memberKey) || 0) > Date.now() - ONLINE_WINDOW_MS;
  }

  function onlineStatuses() {
    return Object.keys(config.agentTokens || {}).map((k) => ({
      memberKey: k,
      online: isOnline(k),
    }));
  }

  // Bot -> queue -> agent
  function sendCommand(memberKey, type, branch, chatId) {
    const cmd = db.addAgentCommand({
      id: crypto.randomBytes(8).toString('hex'),
      memberKey, type, branch, chatId,
    });
    return cmd;
  }

  // Agent poll qilganda
  function takeCommand(memberKey) {
    markSeen(memberKey);
    return db.takeAgentCommand(memberKey);
  }

  // Agent natija yuborganda
  // result = {status, branch, commitHash, ...} — statusni ajratib, qolganini result sifatida saqlaymiz
  function completeResult(id, result) {
    const status = result && result.status ? result.status : (result && result.ok === true ? 'done' : 'failed');
    return db.finishAgentCommand(id, { status, result });
  }

  // Timeout watchdog: javob bermagan commandlar
  function staleCommands() {
    return db.staleSentAgentCommands(COMMAND_TIMEOUT_MS);
  }

  return {
    memberByToken, markSeen, isOnline, onlineStatuses,
    sendCommand, takeCommand, completeResult, staleCommands,
    COMMAND_TIMEOUT_MS, ONLINE_WINDOW_MS,
  };
}

module.exports = { createAgents, ONLINE_WINDOW_MS, COMMAND_TIMEOUT_MS };
