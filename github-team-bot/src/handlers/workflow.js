'use strict';
// ============================================================
// handlers/workflow.js — GitHub Actions workflow_run natijalari.
// Success spamni kamaytirish: success faqat oldingi run FAILED
// bo'lganda (recovery) yoki NOTIFY_WORKFLOW_SUCCESS=true bo'lsa yuboriladi.
// ============================================================
const { logger } = require('../logger');
const F = require('../formatters');

async function handleWorkflowRun(ctx, payload) {
  const { telegram, github, db, config } = ctx;
  const run = payload.workflow_run;
  if (!run) return;
  // faqat default branchdagi runlarni kuzatamiz (spam kamaytirish)
  const defaultBranch = payload.repository && payload.repository.default_branch;
  if (run.head_branch !== defaultBranch) {
    logger.webhook(`workflow run branch=${run.head_branch} (main emas), skip`);
    return;
  }

  const workflowName = run.name;

  if (run.conclusion === 'failure' || run.conclusion === 'timed_out' || run.conclusion === 'cancelled') {
    db.setWorkflowStatus(workflowName, 'failure');
    const text = F.formatWorkflowFailed({ run });
    await telegram.sendMessage(text, {
      keyboard: { inline_keyboard: [[{ text: '👀 GitHub', url: run.html_url }]] },
    });
    logger.webhook(`workflow failed notification yuborildi: ${workflowName}`);
    return;
  }

  if (run.conclusion === 'success') {
    const prev = db.getWorkflowStatus(workflowName);
    const isRecovery = prev === 'failure';
    db.setWorkflowStatus(workflowName, 'success');
    if (config.notifyWorkflowSuccess || isRecovery) {
      const text = F.formatWorkflowPassed({ run });
      await telegram.sendMessage(text, {
        keyboard: { inline_keyboard: [[{ text: '👀 GitHub', url: run.html_url }]] },
      });
      logger.webhook(`workflow success notification yuborildi: ${workflowName}${isRecovery ? ' (recovery)' : ''}`);
    } else {
      logger.webhook(`workflow success: ${workflowName} — spam kamaytirish uchun skip`);
    }
  }
}

module.exports = { handleWorkflowRun };
