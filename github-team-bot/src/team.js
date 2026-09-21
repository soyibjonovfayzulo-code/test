'use strict';
// ============================================================
// team.js — OrzuTalim Dev Team: FAQAT 5 a'zoli whitelist.
// Ismlar va GitHub username mapping aynan quyidagicha SAQLANADI.
// Branch: FAQAT GitHub'da REAL mavjud branchlar (o'ylab topilmaydi).
//   - 'ahatjon' branchi GitHub'da mavjud → biriktirildi
//   - sardor/shodyona/oyatilo/omadbek branchlari HAZIRCHA YO'Q
//     → admin keyincha /setbranch bilan biriktiradi
// Runtime holati (binding/enable) data/bot-state.json'da saqlanadi.
// ============================================================

// ---- MARKAZIY KONFIGURATSIYA: 5 TA A'ZO (whitelist) ----
// Branchlar GitHub'da REAL mavjud (scripts/setup-branches.js yaratdi,
// har biri main'dan):
//   ahatjon, sardor, shodyona, oyatilo, omadbek
const TEAM_MEMBERS = [
  { key: 'ahatjon', name: 'ahatjon', telegramUserId: null, githubUsername: 'soyibjonovfayzulo-code', branch: 'ahatjon', enabled: true },
  { key: 'sardor', name: 'sardor', telegramUserId: null, githubUsername: 'eldorhakimuv7-spec', branch: 'sardor', enabled: true },
  { key: 'shodyona', name: 'shodyona', telegramUserId: null, githubUsername: 'shodiyona531-boop', branch: 'shodyona', enabled: true },
  { key: 'oyatilo', name: 'oyatilo', telegramUserId: null, githubUsername: 'stormdeveloper-glitch', branch: 'oyatilo', enabled: true },
  { key: 'omadbek', name: 'omadbek', telegramUserId: null, githubUsername: 'ovaliyev484-bit', branch: 'omadbek', enabled: true },
];

const PROTECTED_BRANCHES = ['main', 'master'];

// ---- Config validatsiyasi (secretlarsiz diagnostic) ----
function validateTeamConfig(members, getBinding) {
  const errors = [];
  if (!Array.isArray(members) || members.length !== 5) {
    errors.push(`TEAM_MEMBERS soni 5 bo'lishi kerak (hozir: ${members ? members.length : 0})`);
    return errors;
  }
  const seenName = new Set();
  const seenTg = new Set();
  const seenBranch = new Set();
  for (const m of members) {
    if (!m.key || !m.name) errors.push(`member key/name bo'sh`);
    if (seenName.has(m.name)) errors.push(`duplicate ism: ${m.name}`);
    seenName.add(m.name);
    const b = getBinding ? getBinding(m.key) : null;
    const tgId = (b && b.telegramUserId) || m.telegramUserId;
    const branch = (b && b.branch) || m.branch;
    if (tgId) {
      if (seenTg.has(String(tgId))) errors.push(`duplicate Telegram ID (member: ${m.name})`);
      seenTg.add(String(tgId));
    }
    if (branch) {
      if (seenBranch.has(branch)) errors.push(`duplicate branch: ${branch}`);
      if (PROTECTED_BRANCHES.includes(String(branch).toLowerCase())) errors.push(`branch "main" bo'lishi mumkin emas (member: ${m.name})`);
      seenBranch.add(branch);
    }
  }
  return errors;
}

function createTeam(db) {
  function getBinding(key) {
    return db.getMemberBinding ? db.getMemberBinding(key) : null;
  }

  // Barcha memberlar (binding merge qilingan)
  // MUHIM: binding faqat BO'SH JOYLARNI to'ldiradi — config'dagi
  // branch/githubUsername HECH QACHON null bilan OVERRIDE QILINMAYDI
  // (aks holda "branch biriktirilmagan" noto'g'ri xabar chiqadi)
  function listMembers() {
    return TEAM_MEMBERS.map((m) => {
      const b = getBinding(m.key) || {};
      return {
        ...m,
        telegramUserId: b.telegramUserId || m.telegramUserId || null,
        githubUsername: b.githubUsername || m.githubUsername || null,
        branch: b.branch || m.branch || null,
        enabled: b.enabled !== undefined ? !!b.enabled : m.enabled,
        bound: !!b.telegramUserId,
      };
    });
  }

  function findByName(name) {
    if (!name) return null;
    const n = String(name).trim().toLowerCase();
    return listMembers().find((m) => m.name.toLowerCase() === n) || null;
  }

  function findByKey(key) {
    return listMembers().find((m) => m.key === key) || null;
  }

  // Telegram ID -> member (FAQAT ID bilan; ismga ishonch YO'Q)
  function findByTelegramId(telegramUserId) {
    if (telegramUserId === undefined || telegramUserId === null) return null;
    return listMembers().find((m) => m.telegramUserId && String(m.telegramUserId) === String(telegramUserId)) || null;
  }

  // Ism kiritib o'zini tanitish: faqat bog'lanmagan ismni birinchi da'vo qilgan
  // Telegram ID bog'lanadi. Boshqa ID'ga bog'langan ism RAD etiladi.
  function claim(name, telegramUserId) {
    const member = findByName(name);
    if (!member) return { ok: false, reason: 'not_found' };
    if (member.enabled === false) return { ok: false, reason: 'disabled', member };
    if (member.telegramUserId && String(member.telegramUserId) !== String(telegramUserId)) {
      return { ok: false, reason: 'already_bound', member };
    }
    if (!member.telegramUserId) {
      db.setMemberBinding(member.key, { telegramUserId: String(telegramUserId) });
    }
    return { ok: true, member: findByKey(member.key) };
  }

  // Push/pull uchun access check: Telegram ID -> member -> allowed branch
  // currentGitBranch FAQAT real git'dan olinadi (Telegram message'dan EMAS)
  function authorizePush(telegramUserId, currentGitBranch) {
    const member = findByTelegramId(telegramUserId);
    if (!member) return { ok: false, code: 'UNKNOWN', message: '❌ Siz OrzuTalim Dev Team a\'zosi sifatida topilmadingiz.' };
    if (!member.enabled) return { ok: false, code: 'DISABLED', message: `⛔ ${member.name} hozircha o'chirilgan (admin tomonidan).` };
    if (!member.branch) return { ok: false, code: 'NO_BRANCH', message: `⚠️ Sizga hali branch biriktirilmagan. Admin bilan bog'laning.` };
    if (PROTECTED_BRANCHES.includes(String(currentGitBranch || '').toLowerCase())) {
      return { ok: false, code: 'MAIN', message: '🚫 MAIN BRANCH\'GA PUSH TAQIQLANGAN\n\nSiz faqat o\'zingizga biriktirilgan branchga push qila olasiz.\nMain faqat Pull Request workflow orqali yangilanadi.' };
    }
    if (currentGitBranch !== member.branch) {
      return {
        ok: false,
        code: 'FOREIGN_BRANCH',
        message: `🚫 ACCESS DENIED\n\nSizga faqat:\n<b>${member.branch}</b>\nbranchi biriktirilgan.\n\nHozirgi branch: ${currentGitBranch || '(aniqlanmadi)'}`,
      };
    }
    return { ok: true, member };
  }

  // ---- Admin amallari (admin ham raw shell ochmaydi) ----
  function setBranch(key, branch) {
    if (!findByKey(key)) return false;
    if (PROTECTED_BRANCHES.includes(String(branch).toLowerCase())) return false;
    db.setMemberBinding(key, { branch });
    return true;
  }
  function setGithub(key, username) {
    if (!findByKey(key)) return false;
    db.setMemberBinding(key, { githubUsername: username });
    return true;
  }
  function setEnabled(key, enabled) {
    if (!findByKey(key)) return false;
    db.setMemberBinding(key, { enabled: !!enabled });
    return true;
  }
  function unbind(key) {
    if (!findByKey(key)) return false;
    db.setMemberBinding(key, { telegramUserId: null });
    return true;
  }

  return {
    listMembers, findByName, findByKey, findByTelegramId, claim,
    authorizePush, setBranch, setGithub, setEnabled, unbind,
    validate: () => validateTeamConfig(TEAM_MEMBERS, getBinding),
  };
}

module.exports = { TEAM_MEMBERS, PROTECTED_BRANCHES, createTeam, validateTeamConfig };


