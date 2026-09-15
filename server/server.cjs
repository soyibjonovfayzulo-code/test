const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { db } = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.ADMIN_SECRET || 'it-test-admin-secret-key-change-in-production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Enable FK cascade for SQLite
db.run('PRAGMA foreign_keys = ON;');

// Serve static frontend from root
app.use(express.static(path.join(__dirname, '../')));
// Serve admin panel from /public/admin
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// -------------------------
// AUTHENTICATION
// -------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: row.id, username: row.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.admin = decoded;
    next();
  });
};

// -------------------------
// PUBLIC API (for script.js)
// -------------------------
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', [], (err, courses) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // For each course, fetch its topics
    let coursesProcessed = 0;
    if (courses.length === 0) return res.json([]);
    
    courses.forEach(course => {
      db.all('SELECT * FROM topics WHERE course_id = ?', [course.id], (err, topics) => {
        if (!err) {
          course.topics = topics.map(t => ({
            id: t.id,
            title: t.title,
            duration: t.duration,
            xp: t.xp,
            masterXp: t.masterXp,
            content: t.content ? JSON.parse(t.content) : null,
            quiz: t.quiz ? JSON.parse(t.quiz) : null,
            exercises: t.exercises ? JSON.parse(t.exercises) : null
          }));
        }
        
        coursesProcessed++;
        if (coursesProcessed === courses.length) {
          res.json(courses);
        }
      });
    });
  });
});

// -------------------------
// ADMIN API (Requires Auth)
// -------------------------
app.post('/api/courses', authMiddleware, (req, res) => {
  const { id, name, icon, color, tagline, description } = req.body;
  db.run(
    'INSERT INTO courses (id, name, icon, color, tagline, description) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, icon, color, tagline, description],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: id, name });
    }
  );
});

app.put('/api/courses/:id', authMiddleware, (req, res) => {
  const { name, icon, color, tagline, description } = req.body;
  db.run(
    'UPDATE courses SET name=?, icon=?, color=?, tagline=?, description=? WHERE id=?',
    [name, icon, color, tagline, description, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/courses/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM courses WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/topics', authMiddleware, (req, res) => {
  const { course_id, title, duration, xp, masterXp, content, quiz, exercises } = req.body;
  db.run(
    'INSERT INTO topics (course_id, title, duration, xp, masterXp, content, quiz, exercises) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [course_id, title, duration, xp, masterXp, JSON.stringify(content), JSON.stringify(quiz), JSON.stringify(exercises)],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/topics/:id', authMiddleware, (req, res) => {
  const { title, duration, xp, masterXp, content, quiz, exercises } = req.body;
  db.run(
    'UPDATE topics SET title=?, duration=?, xp=?, masterXp=?, content=?, quiz=?, exercises=? WHERE id=?',
    [title, duration, xp, masterXp, JSON.stringify(content), JSON.stringify(quiz), JSON.stringify(exercises), req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/topics/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM topics WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
