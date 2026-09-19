const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/USTAFON/Desktop/aaaayti/server/database.sqlite');
db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (e, t) => {
    console.log('TABLES:', e ? e.message : t.map(x => x.name).join(', '));
  });
  db.all("SELECT published, COUNT(*) n FROM test_questions GROUP BY published", (e, r) => {
    console.log('BY PUBLISHED:', e ? e.message : JSON.stringify(r));
  });
  db.all("SELECT subject, difficulty, COUNT(*) n FROM test_questions GROUP BY subject, difficulty", (e, r) => {
    console.log('BY SUBJECT/DIFF:', e ? e.message : JSON.stringify(r));
  });
  db.all("SELECT id, subject, difficulty, substr(question,1,40) q, published FROM test_questions ORDER BY id LIMIT 8", (e, r) => {
    console.log('SAMPLE:', e ? e.message : JSON.stringify(r, null, 1));
  });
  db.all("SELECT COUNT(*) n FROM courses", (e, r) => { console.log('COURSES:', e ? e.message : JSON.stringify(r)); db.close(); });
});