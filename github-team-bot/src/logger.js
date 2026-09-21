'use strict';
// ============================================================
// logger.js — structured logging
// Token/secret qiymatlarni logga CHIQARMAYDI (mask).
// ============================================================

const SECRET_ENV_KEYS = [
  'TELEGRAM_BOT_TOKEN',
  'GITHUB_TOKEN',
  'GITHUB_WEBHOOK_SECRET',
  'ADMIN_SECRET',
  'SECRET',
  'TOKEN',
];

function mask(value) {
  if (!value) return '***';
  const s = String(value);
  if (s.length <= 8) return '***';
  return s.slice(0, 4) + '***' + s.slice(-4);
}

// Objektdagi secret-larni yashirish
function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (SECRET_ENV_KEYS.some((sk) => k.toUpperCase().includes(sk))) {
        out[k] = mask(v);
      } else {
        out[k] = sanitize(v);
      }
    }
    return out;
  }
  return obj;
}

function fmt(parts) {
  return parts
    .map((p) => {
      if (typeof p === 'string') return p;
      try { return JSON.stringify(sanitize(p)); } catch { return String(p); }
    })
    .join(' ');
}

const logger = {
  webhook(...parts) { console.log('[WEBHOOK]', fmt(parts)); },
  telegram(...parts) { console.log('[TELEGRAM]', fmt(parts)); },
  github(...parts) { console.log('[GITHUB]', fmt(parts)); },
  error(...parts) { console.error('[ERROR]', fmt(parts)); },
  info(...parts) { console.log('[INFO]', fmt(parts)); },
};

module.exports = { logger, mask, sanitize };
