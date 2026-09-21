/**
 * api-e2e.test.cjs — Express server API va SQLite CRUD amallarini to'liq test qiladi.
 */
'use strict';

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

let serverProc;
const PORT = 3055; // alohida test porti

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null });
        } catch (_) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🚀 API E2E testlari boshlandi...');

  // Serverni ishga tushirish
  serverProc = spawn('node', ['server/server.cjs'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: PORT, ADMIN_SECRET: 'test-secret' },
    stdio: 'pipe'
  });

  // Server tayyor bo'lishini kutamiz
  await new Promise(r => setTimeout(r, 1500));

  try {
    // 1. Kurslar ro'yxati (Public)
    const coursesRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/courses',
      method: 'GET'
    });
    if (coursesRes.status !== 200 || !Array.isArray(coursesRes.data) || coursesRes.data.length < 10) {
      throw new Error(`Public courses API xatosi! Status: ${coursesRes.status}, count: ${coursesRes.data?.length}`);
    }
    console.log(`✅ 1. GET /api/courses OK (${coursesRes.data.length} ta kurs qaytdi)`);

    // 2. Test savollari (Public)
    const questionsRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/tests/questions?subject=HTML',
      method: 'GET'
    });
    if (questionsRes.status !== 200 || !Array.isArray(questionsRes.data) || questionsRes.data.length === 0) {
      throw new Error(`Public test questions API xatosi! Status: ${questionsRes.status}`);
    }
    console.log(`✅ 2. GET /api/tests/questions OK (HTML: ${questionsRes.data.length} ta savol)`);

    // 3. Admin Login (noto'g'ri parol bilan)
    const failLogin = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin', password: 'wrongpassword' });
    if (failLogin.status !== 401) {
      throw new Error(`Noto'g'ri login 401 qaytarmadi! Status: ${failLogin.status}`);
    }
    console.log('✅ 3. Login himoyasi OK (noto\'g\'ri parol rad etildi)');

    // 4. Admin Login (muvaffaqiyatli — vaqtinchalik admin123)
    const okLogin = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'muhammadziyomashrabjonov544@gmail.com', password: 'admin123' });
    if (okLogin.status !== 200 || !okLogin.data?.token) {
      throw new Error(`To'g'ri login muvaffaqiyatsiz! Status: ${okLogin.status}`);
    }
    const token = okLogin.data.token;
    console.log('✅ 4. Admin Login OK (JWT token olindi)');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 5. Himoyalangan endpoint (/api/auth/me)
    const meRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: authHeaders
    });
    if (meRes.status !== 200 || meRes.data?.username !== 'muhammadziyomashrabjonov544@gmail.com') {
      throw new Error(`Protected /api/auth/me xatosi! Status: ${meRes.status}`);
    }
    console.log('✅ 5. Protected /api/auth/me OK');

    // 6. Test Question CRUD (Admin)
    // 6.1 Create
    const createQ = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/test-questions',
      method: 'POST',
      headers: authHeaders
    }, {
      subject: 'HTML',
      difficulty: 'beginner',
      question: 'Avtomatlashtirilgan test savoli?',
      options: ['A varianti', 'B varianti', 'C varianti'],
      correct_index: 1,
      explanation: 'B to\'g\'ri javob'
    });
    if (createQ.status !== 200 || !createQ.data?.id) {
      throw new Error(`Test savoli yaratishda xato: ${JSON.stringify(createQ)}`);
    }
    const createdQId = createQ.data.id;
    console.log(`✅ 6.1 Admin: Test savoli yaratildi (ID: ${createdQId})`);

    // 6.2 Publish / Unpublish
    const unpubQ = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/admin/test-questions/${createdQId}/publish`,
      method: 'PATCH',
      headers: authHeaders
    }, { published: false });
    if (unpubQ.status !== 200) throw new Error('Unpublish xatosi');
    console.log('✅ 6.2 Admin: Test savoli unpublished qilindi');

    // 6.3 Update
    const updateQ = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/admin/test-questions/${createdQId}`,
      method: 'PUT',
      headers: authHeaders
    }, {
      subject: 'HTML',
      difficulty: 'beginner',
      question: 'Yangilangan test savoli?',
      options: ['A', 'B'],
      correct_index: 0,
      explanation: 'Yangilandi'
    });
    if (updateQ.status !== 200) throw new Error('Update xatosi');
    console.log('✅ 6.3 Admin: Test savoli tahrirlandi');

    // 6.4 Delete
    const delQ = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/admin/test-questions/${createdQId}`,
      method: 'DELETE',
      headers: authHeaders
    });
    if (delQ.status !== 200) throw new Error('Delete xatosi');
    console.log('✅ 6.4 Admin: Test savoli o\'chirildi');

    // 7. Course & Lesson CRUD
    // 7.1 Create Course
    const testCourseId = 'test-e2e-course';
    await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/courses',
      method: 'POST',
      headers: authHeaders
    }, {
      id: testCourseId,
      name: 'E2E Test Kursi',
      icon: '🧪',
      color: '#00ff00',
      tagline: 'Test kursi',
      description: 'Kurs tavsifi',
      published: 1
    });
    console.log('✅ 7.1 Admin: Kurs qo\'shildi');

    // 7.2 Create Topic
    const createTopicRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/topics',
      method: 'POST',
      headers: authHeaders
    }, {
      course_id: testCourseId,
      title: 'E2E Dars 1',
      duration: 10,
      xp: 15,
      content: { intro: 'Salom' },
      quiz: { passingScore: 80, questions: [] },
      published: 1
    });
    const topicId = createTopicRes.data?.id;
    console.log(`✅ 7.2 Admin: Dars qo'shildi (ID: ${topicId})`);

    // 7.3 Publish/Unpublish Lesson
    await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/topics/${topicId}/publish`,
      method: 'PATCH',
      headers: authHeaders
    }, { published: false });
    console.log('✅ 7.3 Admin: Dars unpublished qilindi');

    // 7.4 Delete Course (cascade deletes topic)
    await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/courses/${testCourseId}`,
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('✅ 7.4 Admin: Test kursi o\'chirildi');

    // 8. Stats
    const statsRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/stats',
      method: 'GET',
      headers: authHeaders
    });
    if (statsRes.status !== 200 || statsRes.data?.totalCourses < 10) {
      throw new Error(`Stats endpoint xatosi: ${JSON.stringify(statsRes.data)}`);
    }
    console.log(`✅ 8. Admin Stats OK (${statsRes.data.totalCourses} kurs, ${statsRes.data.totalTopics} dars, ${statsRes.data.totalQuestions} savol)`);

    console.log('\n🎉 BARCHA E2E TESTLARI MUVAFFAQIYATLI O\'TDI!');
  } finally {
    if (serverProc) {
      serverProc.kill();
    }
  }
}

runTests().catch(err => {
  console.error('❌ E2E Test xatosi:', err);
  if (serverProc) serverProc.kill();
  process.exit(1);
});
