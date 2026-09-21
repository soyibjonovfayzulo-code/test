/**
 * migrate.test.cjs — Migratsiya qilingan ma'lumotlar to'liqligini tekshirish testi.
 */
'use strict';

const { db, initDb } = require('./db.cjs');

async function verifyMigration() {
  await initDb();

  console.log('🔍 Migratsiya natijalarini tekshirish boshlandi...');

  // 1. Admin tekshirish
  const adminRow = await new Promise((res) => {
    db.get('SELECT * FROM admins WHERE username = ?', ['muhammadziyomashrabjonov544@gmail.com'], (err, r) => res(r));
  });
  if (!adminRow) {
    throw new Error('❌ Admin foydalanuvchisi topilmadi!');
  }
  console.log('✅ Admin foydalanuvchisi mavjud:', adminRow.username);

  // 2. Kurslar soni
  const courses = await new Promise((res) => {
    db.all('SELECT * FROM courses', (err, rows) => res(rows || []));
  });
  if (courses.length < 10) {
    throw new Error(`❌ Kurslar soni kam: kutilgan kamida 10 ta, amalda: ${courses.length}`);
  }
  console.log(`✅ Kurslar to'liq saqlangan (${courses.length} ta).`);

  // 3. Topics soni
  const topicsCount = await new Promise((res) => {
    db.get('SELECT COUNT(*) as cnt FROM topics', (err, r) => res(r ? r.cnt : 0));
  });
  if (topicsCount < 288) {
    throw new Error(`❌ Topics soni kam: kutilgan kamida 288 ta, amalda: ${topicsCount}`);
  }
  console.log(`✅ Topics (darslar) to'liq saqlangan (${topicsCount} ta).`);

  // 4. Test savollari soni
  const questionsCount = await new Promise((res) => {
    db.get('SELECT COUNT(*) as cnt FROM test_questions', (err, r) => res(r ? r.cnt : 0));
  });
  if (questionsCount < 810) {
    throw new Error(`❌ Test savollari kam: kutilgan kamida 810 ta, amalda: ${questionsCount}`);
  }
  console.log(`✅ Test savollari to'liq saqlangan (${questionsCount} ta).`);

  console.log('\n🎉 Barcha test tekshiruvlari muvaffaqiyatli o\'tdi!');
  db.close();
}

verifyMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
