const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Admins table (extended with role, email, active)
      db.run(`
        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          email TEXT,
          role TEXT DEFAULT 'admin',
          active INTEGER DEFAULT 1
        )
      `);

      // Courses table
      db.run(`
        CREATE TABLE IF NOT EXISTS courses (
          id TEXT PRIMARY KEY,
          name TEXT,
          icon TEXT,
          color TEXT,
          tagline TEXT,
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          published INTEGER DEFAULT 1
        )
      `);

      // Topics / Lessons table
      db.run(`
        CREATE TABLE IF NOT EXISTS topics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          course_id TEXT,
          title TEXT,
          duration INTEGER,
          xp INTEGER,
          content TEXT,
          quiz TEXT,
          masterXp INTEGER,
          exercises TEXT,
          sort_order INTEGER DEFAULT 0,
          published INTEGER DEFAULT 1,
          FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
      `);

      // Push tokens (FCM device tokens)
      db.run(`
        CREATE TABLE IF NOT EXISTS push_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          token TEXT UNIQUE NOT NULL,
          user_id TEXT,
          platform TEXT DEFAULT 'android',
          updated_at TEXT
        )
      `);

      // Tests / Test Questions table for Question Bank
      db.run(`
        CREATE TABLE IF NOT EXISTS test_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subject TEXT,
          difficulty TEXT,
          question TEXT,
          options TEXT,
          correct_index INTEGER,
          explanation TEXT,
          published INTEGER DEFAULT 1
        )
      `, (err) => {
        if (err) return reject(err);

        // Run migrations for existing DBs that might miss columns
        const alterStatements = [
          `ALTER TABLE courses ADD COLUMN published INTEGER DEFAULT 1`,
          `ALTER TABLE courses ADD COLUMN sort_order INTEGER DEFAULT 0`,
          `ALTER TABLE topics ADD COLUMN published INTEGER DEFAULT 1`,
          `ALTER TABLE topics ADD COLUMN sort_order INTEGER DEFAULT 0`,
          `ALTER TABLE admins ADD COLUMN email TEXT`,
          `ALTER TABLE admins ADD COLUMN role TEXT DEFAULT 'admin'`,
          `ALTER TABLE admins ADD COLUMN active INTEGER DEFAULT 1`
        ];

        let pending = alterStatements.length;
        alterStatements.forEach(stmt => {
          db.run(stmt, () => {
            // Ignore error if column already exists
            pending--;
            if (pending === 0) resolve();
          });
        });
      });
    });
  });
}

module.exports = {
  db,
  initDb
};
