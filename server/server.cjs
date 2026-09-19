const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { db, initDb } = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.ADMIN_SECRET || 'it-test-admin-secret-key-change-in-production';

// -------------------------
// FIREBASE ADMIN (lazy init)
// server/serviceAccountKey.json mavjud bo'lsa FCM orqali
// push xabar yuborish imkoni ochiladi. Yo'q bo'lsa server
// odatdagidek ishlaydi (faqat /api/push/send 503 qaytaradi).
// -------------------------
let firebaseMessaging = null;
try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    const admin = require('firebase-admin');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    const app2 = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    firebaseMessaging = admin.messaging(app2);
    console.log('✅ Firebase Admin SDK ulandi — /api/push/send ishlaydi');
  } else {
    console.log('ℹ️ serviceAccountKey.json topilmadi — FCM yuborish o\'chirilgan (/api/push/send 503 qaytaradi)');
  }
} catch (e) {
  console.error('Firebase Admin init xatosi:', e.message);
}

// Init DB
initDb().catch(err => console.error('Database initialization error:', err));

// CORS — allow both Vite dev (5173) and production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    // Capacitor native WebView originlari (Android/iOS ilovadan kelgan so'rovlar)
    'http://localhost',
    'https://localhost',
    'capacitor://localhost'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Enable FK cascade for SQLite
db.run('PRAGMA foreign_keys = ON;');

// Serve static frontend from root (for npm run server only)
app.use(express.static(path.join(__dirname, '../')));
// Serve admin panel from /public/admin
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// -------------------------
// HELPERS
// -------------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Yaroqsiz yoki muddati o\'tgan token' });
    req.admin = decoded;
    next();
  });
};

const superAdminMiddleware = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Faqat Super Admin uchun ruxsat berilgan' });
  }
  next();
};

// -------------------------
// AUTHENTICATION
// -------------------------
// Login — accepts username OR email
app.post('/api/auth/login', (req, res) => {
  const { username, password, email } = req.body;
  const loginId = email || username;

  if (!loginId || !password) {
    return res.status(400).json({ error: 'Login va parol kiritilishi shart' });
  }

  // Try matching username or email
  db.get(
    'SELECT * FROM admins WHERE (username = ? OR email = ?) AND active != 0',
    [loginId, loginId],
    async (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(401).json({ error: 'Foydalanuvchi topilmadi yoki deaktivatsiya qilingan' });

      const match = await bcrypt.compare(password, row.password);
      if (!match) return res.status(401).json({ error: 'Foydalanuvchi nomi yoki parol noto\'g\'ri' });

      const token = jwt.sign(
        { id: row.id, username: row.username, email: row.email, role: row.role || 'admin' },
        SECRET_KEY,
        { expiresIn: '24h' }
      );
      res.json({
        token,
        username: row.username,
        email: row.email,
        role: row.role || 'admin'
      });
    }
  );
});

// Admin me / check auth
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    id: req.admin.id,
    username: req.admin.username,
    email: req.admin.email,
    role: req.admin.role || 'admin'
  });
});

// Admin change password
app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Eski va yangi parolni kiriting' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak' });
  }

  db.get('SELECT * FROM admins WHERE id = ?', [req.admin.id], async (err, admin) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!admin) return res.status(404).json({ error: 'Admin topilmadi' });

    const match = await bcrypt.compare(oldPassword, admin.password);
    if (!match) return res.status(400).json({ error: 'Eski parol noto\'g\'ri' });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE admins SET password = ? WHERE id = ?', [newHash, req.admin.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Parolni yangilashda xatolik' });
      res.json({ success: true, message: 'Parol muvaffaqiyatli yangilandi' });
    });
  });
});

// -------------------------
// SUPER ADMIN — Admins Management
// -------------------------

// List all admins (super_admin only)
app.get('/api/super/admins', authMiddleware, superAdminMiddleware, (req, res) => {
  db.all('SELECT id, username, email, role, active FROM admins ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Create new admin (super_admin only)
app.post('/api/super/admins', authMiddleware, superAdminMiddleware, async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username va parol majburiy' });
  if (password.length < 6) return res.status(400).json({ error: 'Parol kamida 6 ta belgi bo\'lsin' });

  const validRole = (role === 'super_admin') ? 'super_admin' : 'admin';
  const hash = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO admins (username, email, password, role, active) VALUES (?, ?, ?, ?, 1)',
    [username, email || null, hash, validRole],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, username, email, role: validRole, active: 1 });
    }
  );
});

// Update admin (super_admin only)
app.put('/api/super/admins/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  const { username, email, role, active, password } = req.body;
  const targetId = parseInt(req.params.id);

  // Prevent super admin from downgrading themselves
  if (targetId === req.admin.id && role === 'admin' && req.admin.role === 'super_admin') {
    return res.status(400).json({ error: 'O\'zingizni super_admin dan tushira olmaysiz' });
  }

  const validRole = (role === 'super_admin') ? 'super_admin' : 'admin';
  const activeVal = active ? 1 : 0;

  if (password && password.length >= 6) {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'UPDATE admins SET username=?, email=?, role=?, active=?, password=? WHERE id=?',
      [username, email || null, validRole, activeVal, hash, targetId],
      function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
      }
    );
  } else {
    db.run(
      'UPDATE admins SET username=?, email=?, role=?, active=? WHERE id=?',
      [username, email || null, validRole, activeVal, targetId],
      function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
      }
    );
  }
});

// Delete admin (super_admin only, can't delete self)
app.delete('/api/super/admins/:id', authMiddleware, superAdminMiddleware, (req, res) => {
  const targetId = parseInt(req.params.id);
  if (targetId === req.admin.id) {
    return res.status(400).json({ error: 'O\'zingizni o\'chira olmaysiz' });
  }
  db.run('DELETE FROM admins WHERE id = ?', [targetId], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// Toggle admin active status (super_admin only)
app.patch('/api/super/admins/:id/active', authMiddleware, superAdminMiddleware, (req, res) => {
  const targetId = parseInt(req.params.id);
  if (targetId === req.admin.id) {
    return res.status(400).json({ error: 'O\'z statusingizni o\'zgartira olmaysiz' });
  }
  const { active } = req.body;
  db.run('UPDATE admins SET active = ? WHERE id = ?', [active ? 1 : 0, targetId], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, active: active ? 1 : 0 });
  });
});

// -------------------------
// PUBLIC API (for script.js / students)
// -------------------------
app.get('/api/courses', (req, res) => {
  const authHeader = req.headers['authorization'];
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      jwt.verify(authHeader.split(' ')[1], SECRET_KEY);
      isAdmin = true;
    } catch (_) {}
  }

  const queryCourses = (isAdmin && req.query.all === '1')
    ? 'SELECT * FROM courses ORDER BY sort_order ASC, id ASC'
    : 'SELECT * FROM courses WHERE published = 1 ORDER BY sort_order ASC, id ASC';

  db.all(queryCourses, [], (err, courses) => {
    if (err) return res.status(500).json({ error: err.message });
    if (courses.length === 0) return res.json([]);

    let coursesProcessed = 0;
    courses.forEach(course => {
      const queryTopics = (isAdmin && req.query.all === '1')
        ? 'SELECT * FROM topics WHERE course_id = ? ORDER BY sort_order ASC, id ASC'
        : 'SELECT * FROM topics WHERE course_id = ? AND published = 1 ORDER BY sort_order ASC, id ASC';

      db.all(queryTopics, [course.id], (err, topics) => {
        if (!err) {
          course.topics = (topics || []).map(t => ({
            id: t.id,
            title: t.title,
            duration: t.duration,
            xp: t.xp,
            masterXp: t.masterXp,
            sort_order: t.sort_order,
            published: t.published !== 0,
            content: t.content ? JSON.parse(t.content) : null,
            quiz: t.quiz ? JSON.parse(t.quiz) : null,
            exercises: t.exercises ? JSON.parse(t.exercises) : null
          }));
        } else {
          course.topics = [];
        }

        coursesProcessed++;
        if (coursesProcessed === courses.length) {
          res.json(courses);
        }
      });
    });
  });
});

// Public test questions for Question Bank
app.get('/api/tests/questions', (req, res) => {
  const { subject, difficulty } = req.query;
  let sql = 'SELECT * FROM test_questions WHERE published = 1';
  const params = [];

  if (subject) { sql += ' AND subject = ?'; params.push(subject); }
  if (difficulty) { sql += ' AND difficulty = ?'; params.push(difficulty); }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = (rows || []).map(r => ({
      id: r.id,
      subject: r.subject,
      difficulty: r.difficulty,
      q: r.question,
      question: r.question,
      o: r.options ? JSON.parse(r.options) : [],
      options: r.options ? JSON.parse(r.options) : [],
      c: r.correct_index,
      answer: r.correct_index,
      e: r.explanation,
      explanation: r.explanation,
      published: r.published !== 0
    }));
    res.json(formatted);
  });
});

// -------------------------
// ADMIN API (Requires Auth)
// -------------------------

// COURSES CRUD + Publish/Unpublish
app.post('/api/courses', authMiddleware, (req, res) => {
  const { id, name, icon, color, tagline, description, published, sort_order } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;
  db.run(
    'INSERT INTO courses (id, name, icon, color, tagline, description, published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, icon, color, tagline, description, isPub, sort_order || 0],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id, name, published: isPub });
    }
  );
});

app.put('/api/courses/:id', authMiddleware, (req, res) => {
  const { name, icon, color, tagline, description, published, sort_order } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;
  db.run(
    'UPDATE courses SET name=?, icon=?, color=?, tagline=?, description=?, published=?, sort_order=? WHERE id=?',
    [name, icon, color, tagline, description, isPub, sort_order || 0, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, id: req.params.id });
    }
  );
});

app.patch('/api/courses/:id/publish', authMiddleware, (req, res) => {
  const { published } = req.body;
  const val = published ? 1 : 0;
  db.run('UPDATE courses SET published = ? WHERE id = ?', [val, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, published: val });
  });
});

// Reorder courses
app.patch('/api/courses/:id/reorder', authMiddleware, (req, res) => {
  const { sort_order } = req.body;
  db.run('UPDATE courses SET sort_order = ? WHERE id = ?', [sort_order || 0, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/courses/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM courses WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// TOPICS / LESSONS CRUD + Publish/Unpublish
app.post('/api/topics', authMiddleware, (req, res) => {
  const { course_id, title, duration, xp, masterXp, content, quiz, exercises, published, sort_order } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;
  db.run(
    'INSERT INTO topics (course_id, title, duration, xp, masterXp, content, quiz, exercises, published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [course_id, title, duration, xp, masterXp, JSON.stringify(content), JSON.stringify(quiz), JSON.stringify(exercises), isPub, sort_order || 0],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, published: isPub });
    }
  );
});

app.put('/api/topics/:id', authMiddleware, (req, res) => {
  const { title, duration, xp, masterXp, content, quiz, exercises, published, sort_order } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;
  db.run(
    'UPDATE topics SET title=?, duration=?, xp=?, masterXp=?, content=?, quiz=?, exercises=?, published=?, sort_order=? WHERE id=?',
    [title, duration, xp, masterXp, JSON.stringify(content), JSON.stringify(quiz), JSON.stringify(exercises), isPub, sort_order || 0, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.patch('/api/topics/:id/publish', authMiddleware, (req, res) => {
  const { published } = req.body;
  const val = published ? 1 : 0;
  db.run('UPDATE topics SET published = ? WHERE id = ?', [val, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, published: val });
  });
});

app.patch('/api/topics/:id/reorder', authMiddleware, (req, res) => {
  const { sort_order } = req.body;
  db.run('UPDATE topics SET sort_order = ? WHERE id = ?', [sort_order || 0, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/topics/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM topics WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// TEST QUESTIONS CRUD + Publish/Unpublish (Admin)
app.get('/api/admin/test-questions', authMiddleware, (req, res) => {
  const { subject, difficulty } = req.query;
  let sql = 'SELECT * FROM test_questions WHERE 1=1';
  const params = [];
  if (subject) { sql += ' AND subject = ?'; params.push(subject); }
  if (difficulty) { sql += ' AND difficulty = ?'; params.push(difficulty); }
  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = (rows || []).map(r => ({
      id: r.id,
      subject: r.subject,
      difficulty: r.difficulty,
      question: r.question,
      options: r.options ? JSON.parse(r.options) : [],
      correct_index: r.correct_index,
      explanation: r.explanation,
      published: r.published !== 0
    }));
    res.json(formatted);
  });
});

app.post('/api/admin/test-questions', authMiddleware, (req, res) => {
  const { subject, difficulty, question, options, correct_index, explanation, published } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;

  db.run(
    'INSERT INTO test_questions (subject, difficulty, question, options, correct_index, explanation, published) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subject, difficulty, question, JSON.stringify(options || []), correct_index || 0, explanation || '', isPub],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    }
  );
});

app.put('/api/admin/test-questions/:id', authMiddleware, (req, res) => {
  const { subject, difficulty, question, options, correct_index, explanation, published } = req.body;
  const isPub = published !== undefined ? (published ? 1 : 0) : 1;

  db.run(
    'UPDATE test_questions SET subject=?, difficulty=?, question=?, options=?, correct_index=?, explanation=?, published=? WHERE id=?',
    [subject, difficulty, question, JSON.stringify(options || []), correct_index || 0, explanation || '', isPub, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.patch('/api/admin/test-questions/:id/publish', authMiddleware, (req, res) => {
  const { published } = req.body;
  const val = published ? 1 : 0;
  db.run('UPDATE test_questions SET published = ? WHERE id = ?', [val, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, published: val });
  });
});

app.delete('/api/admin/test-questions/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM test_questions WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// Stats endpoint
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  db.get(`
    SELECT
      (SELECT COUNT(*) FROM courses) AS totalCourses,
      (SELECT COUNT(*) FROM courses WHERE published = 1) AS publishedCourses,
      (SELECT COUNT(*) FROM topics) AS totalTopics,
      (SELECT COUNT(*) FROM topics WHERE published = 1) AS publishedTopics,
      (SELECT COUNT(*) FROM test_questions) AS totalQuestions,
      (SELECT COUNT(*) FROM test_questions WHERE published = 1) AS publishedQuestions,
      (SELECT COUNT(*) FROM admins WHERE active != 0) AS totalAdmins
  `, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// -------------------------
// PUSH TOKENS (FCM)
// -------------------------
// Qurilma FCM tokenni ro'yxatdan o'tkazadi (public — native ilovadan yuboriladi)
app.post('/api/push/tokens', (req, res) => {
  const { token, userId, platform } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token majburiy' });
  }

  db.run(
    `INSERT INTO push_tokens (token, user_id, platform, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(token) DO UPDATE SET
       user_id = excluded.user_id,
       platform = excluded.platform,
       updated_at = datetime('now')`,
    [token, userId || null, platform || 'android'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Ro'yxatdan o'tgan barcha qurilma tokenlari (admin)
app.get('/api/push/tokens', authMiddleware, (req, res) => {
  db.all(
    'SELECT token, user_id, platform, updated_at FROM push_tokens ORDER BY updated_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Tokenni o'chirish (qurilma o'chirilganda/uzoq ishlatilmaganda) — admin
app.delete('/api/push/tokens/:token', authMiddleware, (req, res) => {
  db.run('DELETE FROM push_tokens WHERE token = ?', [req.params.token], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// -------------------------
// PUSH YUBORISH (FCM via Firebase Admin SDK)
// admin JWT talab qiladi.
// Body: { title, body, token?, userId?, page?, data? }
//   - token berilsa  -> faqat shu qurilmaga
//   - userId berilsa -> shu foydalanuvchining tokenlariga
//   - ikkalasi ham yo'q -> barcha ro'yxatdan o'tgan tokenlarga (broadcast)
//   - page (masalan 'tests', 'duel') -> notification bosilganda
//     ilova o'sha page'ga yo'naltiradi (push.js handleTap)
// -------------------------
app.post('/api/push/send', authMiddleware, async (req, res) => {
  if (!firebaseMessaging) {
    return res.status(503).json({
      error: "Firebase Admin sozlanmagan. Firebase Console → Project settings → Service accounts → 'Generate new private key' → faylni server/serviceAccountKey.json sifatida saqlang va serverni qayta ishga tushiring."
    });
  }

  const { title, body, token, userId, page, data } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'title va body majburiy' });
  }

  // Yuborish uchun tokenlar ro'yxatini aniqlash
  let targetTokens = [];
  try {
    if (token) {
      targetTokens = [String(token)];
    } else if (userId) {
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT token FROM push_tokens WHERE user_id = ?', [userId], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });
      targetTokens = rows.map(r => r.token);
    } else {
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT token FROM push_tokens', [], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });
      targetTokens = rows.map(r => r.token);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  if (!targetTokens.length) {
    return res.status(404).json({ error: "Tokenlar topilmadi — hech qurilma ro'yxatdan o'tmagan (ilovani ochib tokenni ro'yxatdan o'tkazing)" });
  }

  // FCM data qiymatlari string bo'lishi shart
  const payloadData = {};
  Object.entries(data || {}).forEach(([k, v]) => { payloadData[String(k)] = String(v); });
  if (page) payloadData.page = String(page);

  const baseMessage = {
    notification: { title: String(title), body: String(body) },
    data: payloadData,
    android: {
      priority: 'high',
      notification: {
        channelId: 'ittest',   /* push.js'da yaratilgan channel bilan mos */
        sound: 'default'
      }
    }
  };

  const results = { sent: 0, failed: 0, invalidTokens: [] };
  await Promise.all(targetTokens.map(async (t) => {
    try {
      await firebaseMessaging.send({ ...baseMessage, token: t });
      results.sent++;
    } catch (err) {
      results.failed++;
      const code = err && err.code;
      if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
        results.invalidTokens.push(t);
      }
    }
  }));

  // Eskirgan/bekor qilingan tokenlarni bazadan tozalash
  if (results.invalidTokens.length) {
    results.invalidTokens.forEach(t => {
      db.run('DELETE FROM push_tokens WHERE token = ?', [t], () => {});
    });
  }

  res.json({ success: true, total: targetTokens.length, ...results });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Admin Panel: http://localhost:${PORT}/admin/`);
  console.log(`   API: http://localhost:${PORT}/api/health`);
});
