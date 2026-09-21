/**
 * backup.cjs — database.sqlite ni database.backup.sqlite ga nusxalaydi.
 * Idempotent va xavfsiz.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const backupPath = path.resolve(__dirname, 'database.backup.sqlite');

function createBackup() {
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath);
    const stat = fs.statSync(backupPath);
    console.log(`✅ Backup muvaffaqiyatli yaratildi: ${backupPath} (${stat.size} bayt)`);
  } else {
    console.log(`ℹ️ Asosiy database fayli (${dbPath}) hali mavjud emas. Backup yaratilmadi.`);
  }
}

if (require.main === module) {
  createBackup();
}

module.exports = { createBackup };
