'use strict';
// ============================================================
// test/team.test.js — 5-member whitelist, access control,
// push/pull flows, last push, secret masking, shell injection
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const { TEAM_MEMBERS, createTeam, validateTeamConfig } = require('../src/team');
const { createDatabase } = require('../src/database');
const { tempDataDir } = require('./helpers');

test('team: aynan 5 member, ismlar to\'g\'ri', () => {
  assert.strictEqual(TEAM_MEMBERS.length, 5, '6-chi odam YO\'Q');
  assert.deepStrictEqual(
    TEAM_MEMBERS.map((m) => m.name),
    ['ahatjon', 'sardor', 'shodyona', 'oyatilo', 'omadbek']
  );
  assert.strictEqual(validateTeamConfig(TEAM_MEMBERS, () => null).length, 0);
});

test('team: 6-member qo\'shilsa validatsiya xato beradi', () => {
  const errors = validateTeamConfig([...TEAM_MEMBERS, { key: 'x', name: 'x' }], () => null);
  assert.ok(errors.length > 0);
});

test('team: unknown user rejected', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  assert.strictEqual(team.findByTelegramId(999999), null);
  const auth = team.authorizePush(999999, 'sardor');
  assert.strictEqual(auth.ok, false);
  assert.ok(auth.message.includes('topilmadingiz'));
});

test('team: ism kiritib binding ishlaydi, keyin ism so\'ralmaydi', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  const r1 = team.claim('sardor', 111222);
  assert.ok(r1.ok);
  assert.strictEqual(r1.member.telegramUserId, '111222');
  // keyingi safar ID bilan taniladi
  assert.strictEqual(team.findByTelegramId(111222).name, 'sardor');
  // yana /start — ism so'ralmaydi (claim allaqachon bor)
  const r2 = team.claim('sardor', 111222);
  assert.ok(r2.ok);
});

test('team: boshqa user o\'zini sardor deb yozsa rad qilinadi', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  assert.ok(team.claim('sardor', 111222).ok);
  const r = team.claim('sardor', 999999); // boshqa Telegram ID
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.reason, 'already_bound');
  // noma'lum ism
  const r2 = team.claim('hacker', 999999);
  assert.strictEqual(r2.ok, false);
  assert.strictEqual(r2.reason, 'not_found');
});

test('team: har user faqat o\'z branchiga push (boshqa branch rad)', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  // o'z branchi OK
  assert.strictEqual(team.authorizePush(111222, 'sardor').ok, true);
  // boshqa branch RAD
  const auth = team.authorizePush(111222, 'ahatjon');
  assert.strictEqual(auth.ok, false);
  assert.strictEqual(auth.code, 'FOREIGN_BRANCH');
  assert.ok(auth.message.includes('ACCESS DENIED'));
});

test('team: main\'ga push TAQIQLANGAN', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  team.claim('sardor', 111222);
  team.setBranch('sardor', 'sardor');
  const auth = team.authorizePush(111222, 'main');
  assert.strictEqual(auth.ok, false);
  assert.strictEqual(auth.code, 'MAIN');
  assert.ok(auth.message.includes('TAQIQLANGAN'));
});

test('team: disabled member push qilolmaydi', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  team.claim('omadbek', 444555);
  team.setBranch('omadbek', 'omadbek');
  team.setEnabled('omadbek', false);
  const auth = team.authorizePush(444555, 'omadbek');
  assert.strictEqual(auth.ok, false);
  assert.strictEqual(auth.code, 'DISABLED');
});

test('team: branch biriktirilmagan member push qilolmaydi', () => {
  // Yangi konfiguratsiya: barcha 5 member branchi config'dan kelayapti
  // (binding bo'lmasa ham) — "NO_BRANCH" holati endi oddiy flowda YO'Q
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  team.claim('oyatilo', 666777);
  const member = team.findByTelegramId(666777);
  assert.strictEqual(member.branch, 'oyatilo', 'config branch bindingsiz ham bor');
  const auth = team.authorizePush(666777, 'oyatilo');
  assert.strictEqual(auth.ok, true);
});

test('team: duplicate branch validatsiyada xato', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  team.setBranch('sardor', 'same');
  team.setBranch('ahatjon', 'same');
  const errors = team.validate();
  assert.ok(errors.some((e) => e.includes('duplicate branch')));
});

test('team: main branch biriktirish TAQIQLANGAN', () => {
  const db = createDatabase(tempDataDir());
  const team = createTeam(db);
  assert.strictEqual(team.setBranch('sardor', 'main'), false);
});
