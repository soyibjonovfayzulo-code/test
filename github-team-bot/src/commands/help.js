'use strict';
// commands/help.js
const { esc } = require('../formatters');

function helpCommand() {
  return {
    text:
      `🤖 <b>ORZUTALIM DEV BOT</b>\n\n` +
      `GitHub team komandalari:\n\n` +
      `/status — repo umumiy holati\n` +
      `/team — jamoa va branchlar holati\n` +
      `/commits — so'nggi commitlar\n` +
      `/pr — ochiq pull requestlar\n` +
      `/main — main branch holati\n` +
      `/mybranch — sizning branchingiz holati\n` +
      `/bind — GitHub hisobni bog'lash\n` +
      `/help — bu yordam`,
  };
}

module.exports = { helpCommand };
