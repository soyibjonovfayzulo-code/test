'use strict';
// ============================================================
// telegram.js — Telegram Bot API client (native fetch, no deps).
// Long polling (user commands) + sendMessage (notifications).
// Retry + rate limit (429) himoyasi bor.
// ============================================================
const { logger } = require('./logger');

const API = 'https://api.telegram.org';

class TelegramApiError extends Error {
  constructor(message, status, retryAfter = null) {
    super(message);
    this.name = 'TelegramApiError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function createTelegramBot({ token, chatId }) {
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN bo\'sh — bot ishga tushmaydi');
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function call(method, params = {}, { retries = 3, timeoutMs = 45000 } = {}) {
    let attempt = 0;
    for (;;) {
      let res;
      try {
        // fetch timeout — network hang'da bot muzlab qolmasin
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), timeoutMs);
        try {
          res = await fetch(`${API}/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(t);
        }
      } catch (e) {
        if (attempt >= retries) throw new TelegramApiError(`Telegram tarmoq xatosi: ${e.message}`);
        attempt++;
        await sleep(1000 * attempt);
        continue;
      }

      const data = await res.json().catch(() => ({}));

      if (data.ok) return data.result;

      // Rate limit — retry_after ga hurmat bilan kutamiz (0 ham to'g'ri qiymat)
      const retryAfterRaw = data.parameters ? Number(data.parameters.retry_after) : NaN;
      const retryAfter = Number.isFinite(retryAfterRaw) && retryAfterRaw >= 0 ? retryAfterRaw : null;
      if (res.status === 429 && retryAfter !== null) {
        if (attempt >= retries) {
          throw new TelegramApiError('Telegram rate limit (429)', 429, retryAfter);
        }
        logger.telegram(`rate limit, ${retryAfter}s kutamiz`);
        await sleep((retryAfter + 1) * 1000);
        attempt++;
        continue;
      }

      // Server xatosi — retry
      if (res.status >= 500 && attempt < retries) {
        attempt++;
        await sleep(1000 * attempt);
        continue;
      }

      throw new TelegramApiError(data.description || `Telegram API xato: HTTP ${res.status}`, res.status);
    }
  }

  return {
    call,

    // ---- Xabar yuborish (retry bilan) ----
    async sendMessage(text, options = {}) {
      const params = {
        chat_id: options.chatId || chatId,
        text,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
        ...(options.keyboard ? { reply_markup: options.keyboard } : {}),
        ...(options.replyToMessageId ? { reply_to_message_id: options.replyToMessageId } : {}),
      };
      return call('sendMessage', params, { retries: options.retries == null ? 4 : options.retries });
    },

    async answerCallbackQuery(id, text) {
      try {
        await call('answerCallbackQuery', { callback_query_id: id, text: text || undefined });
      } catch (e) {
        logger.error('answerCallbackQuery xato:', e.message);
      }
    },

    async setCommands(commands) {
      try {
        await call('setMyCommands', { commands });
      } catch (e) {
        logger.error('setMyCommands xato:', e.message);
      }
    },

    // ---- Long polling (user komandalari) — DOIMIY ISHLASHI KERAK ----
    // - exponential backoff (1s → 30s cap)
    // - 409 conflict (boshqa bot instance) — max-retry sabrli
    // - 429/5xx/network — retry
    // - loop hech qachon o'chmaydi
    startPolling(onUpdate, { offset = 0 } = {}) {
      let currentOffset = offset;
      let stopped = false;
      let polling = null;
      let backoffMs = 1000;
      let lastOkAt = null; // /health: oxirgi muvaffaqiyatli poll vaqti

      async function loop() {
        while (!stopped) {
          try {
            const updates = await call('getUpdates', {
              offset: currentOffset,
              timeout: 30,
              allowed_updates: ['message', 'callback_query'],
            }, { retries: 0, timeoutMs: 40000 });
            backoffMs = 1000; // success — backoff reset
            lastOkAt = Date.now();
            for (const u of updates) {
              currentOffset = u.update_id + 1;
              // har update mustaqil, xato butun pollingni o'ldirmasin
              Promise.resolve(onUpdate(u)).catch((e) => logger.error('update ishlov xato:', e.message));
            }
          } catch (e) {
            if (stopped) break;
            if (e && e.status === 409) {
              logger.error('polling 409: boshqa bot instance polling qilyapti (duplicate process?) — 10s dan keyin qayta');
              await sleep(10000);
            } else {
              logger.error('polling xato:', e.message, `— ${Math.round(backoffMs / 1000)}s dan keyin qayta`);
              await sleep(backoffMs);
              backoffMs = Math.min(backoffMs * 2, 30000); // exponential backoff, max 30s
            }
          }
        }
      }

      polling = loop();
      return {
        stop() {
          stopped = true;
          return polling;
        },
        // /health: Telegram connectivity (oxirgi 90s ichida poll ok bo'lsa ulangan)
        getStatus: () => ({ lastOkAt, connected: !!(lastOkAt && Date.now() - lastOkAt < 90 * 1000) }),
      };
    },
  };
}

module.exports = { createTelegramBot, TelegramApiError };
