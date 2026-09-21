'use strict';
// ============================================================
// webhook.js — GitHub webhook eventlarni qabul qilish:
// signature verify (invalid -> 401), duplicate delivery (skip),
// tez ack 200, og'ir ishlov background'da.
// ============================================================
const { verifyWebhookSignature } = require('./security');
const { logger } = require('./logger');
const { handlePush } = require('./handlers/push');
const { handlePullRequest } = require('./handlers/pullRequest');
const { handleWorkflowRun } = require('./handlers/workflow');

function createWebhookHandler(ctx) {
  return function handleWebhook({ headers, rawBody, payload }) {
    const secret = ctx.config.github.webhookSecret;

    // 1) Signature verification — GitHub'dan kelmagan soxta request QABUL QILINMAYDI
    const signature = headers['x-hub-signature-256'];
    if (!secret || !verifyWebhookSignature(rawBody, secret, signature)) {
      logger.webhook('INVALID signature — 401');
      return { status: 401, body: 'invalid signature' };
    }

    const event = headers['x-github-event'];
    const deliveryId = headers['x-github-delivery'];
    logger.webhook(`event=${event} delivery=${deliveryId}`);

    // 2) Duplicate protection — bir delivery ikki marta ishlanmaydi
    if (deliveryId && ctx.db.isWebhookProcessed(deliveryId)) {
      logger.webhook(`DUPLICATE delivery ${deliveryId} — skip`);
      return { status: 200, body: 'duplicate — skipped' };
    }
    if (deliveryId) ctx.db.markWebhookProcessed(deliveryId);

    // 3) Event routing (background — webhook tez ack qilinadi)
    (async () => {
      try {
        if (event === 'ping') {
          logger.webhook('ping — webhook aktiv ✅');
          return;
        }
        if (event === 'push') {
          await handlePush(ctx, payload);
        } else if (event === 'pull_request') {
          await handlePullRequest(ctx, payload);
        } else if (event === 'workflow_run') {
          await handleWorkflowRun(ctx, payload);
        } else {
          logger.webhook(`event "${event}" qo'llab-quvvatlanmaydi — skip`);
        }
      } catch (e) {
        logger.error(`webhook ishlov xato (${event}):`, e.message);
        // bot crash bo'lmasin — xato faqat logga yoziladi
      }
    })();

    return { status: 200, body: 'ok' };
  };
}

module.exports = { createWebhookHandler };
