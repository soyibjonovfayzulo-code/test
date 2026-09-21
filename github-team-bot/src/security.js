'use strict';
// ============================================================
// security.js — webhook signature verification, admin tekshiruv
// ============================================================
const crypto = require('crypto');

// GitHub: X-Hub-Signature-256: sha256=<hmac_sha256_hex(rawBody, secret)>
function verifyWebhookSignature(rawBody, secret, signatureHeader) {
  if (!rawBody || !secret || !signatureHeader) return false;
  const m = /^sha256=([0-9a-fA-F]+)$/.exec(signatureHeader.trim());
  if (!m) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(typeof rawBody === 'string' ? rawBody : Buffer.from(rawBody))
    .digest('hex');
  const provided = m[1].toLowerCase();
  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

function isAdmin(telegramUserId, adminIds) {
  return adminIds.includes(String(telegramUserId));
}

// One-time verification code uchun tasodifiy 6 xonali kod
function generateVerificationCode() {
  return String(crypto.randomInt(100000, 999999));
}

module.exports = { verifyWebhookSignature, isAdmin, generateVerificationCode };
