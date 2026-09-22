'use strict';
// ============================================================
// server.js — mustaqil HTTP server (alohida port, default 4010).
// Mavjud OrzuTalim serveriga (3000) tegmaydi.
// POST /webhook/github yoki /github/webhook — GitHub webhook
// GET  /health — holat
// ============================================================
const http = require('http');
const { logger } = require('./logger');

function createServer(webhookHandler, { port, healthProvider, agents, onAgentResult } = {}) {
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8');

      // ---- Agent endpoints (Local Dev Agent <-> Central Bot) ----
      const url = req.url || '';
      if (agents && url.startsWith('/agent/')) {
        try {
          const u = new URL(url, 'http://localhost');
          if (req.method === 'GET' && u.pathname === '/agent/poll') {
            const token = u.searchParams.get('token');
            const memberKey = agents.memberByToken(token);
            if (!memberKey) {
              logger.webhook('agent poll: INVALID token — 401');
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: false, error: 'invalid agent token' }));
              return;
            }
            const cmd = agents.takeCommand(memberKey);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, command: cmd ? { id: cmd.id, type: cmd.type, branch: cmd.branch, chatId: cmd.chatId } : null }));
            return;
          }
          if (req.method === 'POST' && u.pathname === '/agent/result') {
            const body = JSON.parse(rawBody || '{}');
            const memberKey = agents.memberByToken(body.token);
            if (!memberKey) {
              logger.webhook('agent result: INVALID token — 401');
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: false, error: 'invalid agent token' }));
              return;
            }
            agents.markSeen(memberKey);
            const cmd = agents.completeResult(body.commandId, {
              ok: body.ok === true,
              status: body.status || (body.ok === true ? 'done' : 'failed'),
              branch: body.branch || null,
              commitHash: body.commitHash || null,
              commitMessage: body.commitMessage || null,
              message: body.message || null,
              reason: body.reason || null,
              output: body.output || null,
            });
            if (cmd && typeof onAgentResult === 'function') {
              try { onAgentResult(cmd); } catch (e) { logger.error('onAgentResult xato:', e.message); }
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
            return;
          }
        } catch (e) {
          logger.error('agent endpoint xato:', e.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'internal error' }));
          return;
        }
      }

      if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
        const extra = typeof healthProvider === 'function' ? healthProvider() : {};
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          bot: 'orzutalim-dev-bot',
          process: 'running',
          telegram: extra.telegram !== undefined ? extra.telegram : true,
          github: extra.github !== undefined ? extra.github : null,
          git: extra.git !== undefined ? !!extra.git : null,
          agents: extra.agents !== undefined ? extra.agents : null,
          queue: extra.queue !== undefined ? extra.queue : null,
          uptime: extra.uptime !== undefined ? extra.uptime : Math.floor(process.uptime()),
        })); // secretlar QAYTMAYDI
        return;
      }


      const isWebhookPath = req.method === 'POST' &&
        (req.url === '/webhook/github' || req.url === '/github/webhook');

      if (!isWebhookPath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        return;
      }

      let payload = null;
      try { payload = JSON.parse(rawBody || '{}'); } catch { payload = {}; }

      try {
        const result = webhookHandler({
          headers: req.headers,
          rawBody,
          payload,
        });
        res.writeHead(result.status, { 'Content-Type': 'text/plain' });
        res.end(result.body);
      } catch (e) {
        logger.error('webhook handler xato:', e.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('internal error');
      }
    });
  });

  return {
    listen() {
      return new Promise((resolve, reject) => {
        const onErr = (e) => { server.removeListener('listening', onOk); reject(e); };
        const onOk = () => { server.removeListener('error', onErr); resolve(); };
        server.once('error', onErr);
        server.listen(port, onOk);
      });
    },
    close() {
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

module.exports = { createServer };
