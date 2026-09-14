/* Coding Playground — SQL REAL executor
   Runtime: sql.js — haqiqiy SQLite WebAssembly'ga kompilyatsiya qilingan.
   Har bir statement REAL bajariladi: CREATE/INSERT/UPDATE/DELETE + SELECT natijalari
   ustunlar va qatorlar bilan qaytadi. Xatolar real SQLite xatolari.
   Protocol:
     in : { type: 'run', code, stdin }
     out: { type:'status', message } | { type:'result', result:{kind:'rows',columns,rows}|{kind:'dml',changes} }
        | { type:'done', exitCode, executed } | { type:'error', error:{type,message,line,column} } */

importScripts('../vendor/sqljs/sql-wasm.js');

let sqlEnginePromise = null;

function post(type, extra) {
  self.postMessage(Object.assign({ type }, extra || {}));
}

function ensureEngine() {
  if (!sqlEnginePromise) {
    post('status', { message: '⏳ SQLite (real SQLite WASM — sql.js) yuklanmoqda...' });
    sqlEnginePromise = initSqlJs({
      locateFile: (file) => new URL('../vendor/sqljs/' + file, self.location.href).href
    })
      .then((SQL) => {
        post('status', { message: '✓ SQLite tayyor (real SQLite WASM)' });
        return SQL;
      })
      .catch((err) => {
        sqlEnginePromise = null;
        throw err;
      });
  }
  return sqlEnginePromise;
}

self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type !== 'run') return;
  const code = String(data.code || '');
  let db = null;
  try {
    const SQL = await ensureEngine();
    db = new SQL.Database();
    post('status', { message: '▶ SQL bajarilmoqda...' });
    post('started');
    const iterator = db.iterateStatements(code);
    let executed = 0;
    for (const stmt of iterator) {
      const columns = stmt.getColumnNames();
      const rows = [];
      while (stmt.step()) rows.push(stmt.get());
      executed += 1;
      if (columns.length > 0) {
        post('result', { result: { kind: 'rows', columns, rows } });
      } else {
        post('result', { result: { kind: 'dml', changes: db.getRowsModified() } });
      }
    }
    post('done', { exitCode: 0, executed });
  } catch (err) {
    post('error', { error: { type: 'SQL Error', message: String((err && err.message) || err), line: null, column: null } });
  } finally {
    if (db) { try { db.close(); } catch (e) { /* noop */ } }
  }
};
