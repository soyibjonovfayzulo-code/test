'use strict';
// ============================================================
// config.js — .env yuklash va konfiguratsiya (secrets hech qachon
// logga chiqmaydi — logger.js mask qiladi)
// ============================================================
const fs = require('fs');
const path = require('path');

// Yengil .env loader (qo'shimcha dependency kerak emas)
// MUSTAHKAM parser:
// - UTF-8 BOM va UTF-16 LE (Windows Notepad/VS Code) himoyasi
// - CRLF/LF, qo'shtirnoq qo'llab-quvvatlanadi
// - Duplicate key: OXIRGI qiymat g'alaba qiladi + ogohlantirish
function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`[CONFIG] .env topilmadi: ${filePath}`);
      return {};
    }
    // Encoding deteksiyasi: UTF-16 LE BOM -> utf16le; aks holda UTF-8
    const buf = fs.readFileSync(filePath);
    let encoding = 'utf8';
    if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) encoding = 'utf16le';
    else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
      console.error('[CONFIG] .env UTF-16 BE — iltimos VS Code\'da "UTF-8" bilan saqlang');
    }
    let text = buf.toString(encoding);
    // UTF-16/BE holatida NUL baytlar qolishi mumkin — tozalash; UTF-8 BOM ham olib tashlanadi
    text = text.replace(/\u0000/g, '').replace(/^\uFEFF/, '');

    const out = {};
    const seen = new Set();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (seen.has(key)) {
        console.error(`[CONFIG] .env da "${key}" BIR NECHA MARTA yozilgan — oxirgi qiymat ishlatiladi (yuqoridagini o'chiring)`);
      }
      seen.add(key);
      out[key] = value;
      // Tashqi muhitdagi BO'SH qiymat .env qiymatini BUZMASIN
      if (!(key in process.env) || process.env[key] === '' || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    return out;
  } catch (e) {
    console.error('[CONFIG] .env o\'qishda xato:', e.message);
    return {};
  }
}

/* __APPEND_MARKER__ */

function createConfig(env = process.env) {
  // Bot o'z .env faylini yuklaydi — ABSOLUT yo'l (src/..), CWD ga bog'liq emas:
  // qayerdan ishga tushirilishidan qat'i nazar github-team-bot/.env topiladi.
  const loaded = loadEnvFile(path.join(__dirname, '..', '.env'));

  const num = (v, def) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  };

  // .env fayldagi qiymat ustuvor (bot papkasidagi .env — asosiy manba)
  const pick = (key, fallback = '') => {
    const fromFile = loaded[key];
    if (fromFile !== undefined && fromFile !== '') return fromFile;
    if (env[key] !== undefined && env[key] !== '') return env[key];
    return fallback;
  };

  // Chat ID manfiy (-100...) bo'lishi NORMAL — STRING sifatida saqlanadi,
  // numberga o'tkazilmaydi (Telegram API ham string qabul qiladi)
  const chatId = String(pick('TELEGRAM_CHAT_ID')).trim();
  if (chatId && !/^-?\d+$/.test(chatId)) {
    console.error('[CONFIG] TELEGRAM_CHAT_ID faqat raqam bo\'lishi kerak (masalan -1001234567890). Joriy qiymat formati noto\'g\'ri.');
  }

  return {
    telegram: {
      token: pick('TELEGRAM_BOT_TOKEN').trim(),
      chatId,
    },
    github: {
      token: pick('GITHUB_TOKEN').trim(),
      owner: pick('GITHUB_OWNER').trim(),
      repo: pick('GITHUB_REPO').trim(),
      defaultBranch: pick('GITHUB_DEFAULT_BRANCH', 'main'),
      webhookSecret: pick('GITHUB_WEBHOOK_SECRET').trim(),
    },
    adminIds: pick('BOT_ADMIN_IDS')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^\d+$/.test(s)),
    port: num(pick('BOT_PORT', '4010'), 4010),
    publicWebhookUrl: pick('PUBLIC_WEBHOOK_URL').trim(),
    notifyWorkflowSuccess: pick('NOTIFY_WORKFLOW_SUCCESS', 'false').toLowerCase() === 'true',
    dataDir: path.join(__dirname, '..', 'data'),
    // REPO_PATH — Git operatsiyalari bajariladigan repository. CWD ga ko'r-ko'rona
    // bog'lanmaydi: bo'sh bo'lsa default sifatida botning 2 ta yuqori papkasi
    // (OrzuTalim root) ishlatiladi va loglanadi.
    repoPath: pick('REPO_PATH').trim() || path.join(__dirname, '..', '..'),
    // AGENT_TOKENS — local agentlar tokeni: ahatjon=t1,sardor=t2,...
    agentTokens: (() => {
      const map = {};
      (pick('AGENT_TOKENS') || '').split(',').forEach((pair) => {
        const [k, v] = pair.split('=');
        if (k && v) map[k.trim()] = v.trim();
      });
      return map;
    })(),
  };
}

/* __APPEND_MARKER2__ */

// ---- Validatsiya: YETISHMAYDIGANLARNI ANIQ KO'RSATADI ----
function validateConfig(cfg) {
  const missing = [];
  if (!cfg.telegram.token) missing.push('TELEGRAM_BOT_TOKEN');
  if (!cfg.telegram.chatId) missing.push('TELEGRAM_CHAT_ID');
  if (!cfg.github.owner) missing.push('GITHUB_OWNER');
  if (!cfg.github.repo) missing.push('GITHUB_REPO');
  if (!cfg.github.webhookSecret) missing.push('GITHUB_WEBHOOK_SECRET (xavfsizlik uchun MAJBURIY)');
  if (missing.length) {
    console.error(`[CONFIG] Tekshiring: ${path.join(__dirname, '..', '.env')}`);
  }
  return missing;
}

// ---- Diagnostic log: secret QIYMATLARINI ko'rsatmasdan faqat SET/MISSING ----
function logConfigStatus(cfg) {
  const st = (v) => (v && String(v).trim() ? 'SET' : 'MISSING');
  console.log('[CONFIG] ENV holati (secret qiymatlari loglanmaydi):');
  console.log(`  TELEGRAM_BOT_TOKEN:     ${st(cfg.telegram.token)}`);
  console.log(`  TELEGRAM_CHAT_ID:       ${st(cfg.telegram.chatId)}${cfg.telegram.chatId ? '' : '  <- .env ga yozing'}`);
  console.log(`  GITHUB_TOKEN:           ${st(cfg.github.token)} (public repo uchun ixtiyoriy)`);
  console.log(`  GITHUB_OWNER/REPO:      ${st(cfg.github.owner)}/${st(cfg.github.repo)}`);
  console.log(`  GITHUB_WEBHOOK_SECRET:  ${st(cfg.github.webhookSecret)}`);
  console.log(`  BOT_ADMIN_IDS:          ${cfg.adminIds.length ? 'SET (' + cfg.adminIds.length + ' ta)' : 'MISSING (admin komandalar ishlamaydi)'}`);
  console.log(`  BOT_PORT:               ${cfg.port}`);
}

module.exports = { createConfig, validateConfig, loadEnvFile, logConfigStatus };
