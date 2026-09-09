/* REAL ENGINE TEST — sql.js / JSCPP / pyodide
   Node'da haqiqiy execution tekshiruvi (fake yo'q — engine'lar o'zlari ishlaydi).
   Run: node coding-exec-check.cjs */
const path = require('path');
const fs = require('fs');
const root = __dirname;

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + JSON.stringify(extra).slice(0, 300) : '')); }
}

(async () => {
  console.log('================= 1) SQL — sql.js (real SQLite WASM) =================');
  {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    const sql = [
      'CREATE TABLE users(id INTEGER, name TEXT);',
      "INSERT INTO users VALUES(1, 'Ali');",
      'SELECT * FROM users;'
    ].join('\n');
    let results = [];
    try {
      const it = db.iterateStatements(sql);
      for (const stmt of it) {
        const cols = stmt.getColumnNames();
        const rows = [];
        while (stmt.step()) rows.push(stmt.get());
        if (cols.length > 0 && rows.length > 0) results.push({ kind: 'rows', columns: cols, rows });
        else results.push({ kind: 'dml', changes: db.getRowsModified(), columns: cols, rows });
      }
    } catch (e) { ok(false, 'SQL exec xatosiz', String(e)); }
    ok(results.length === 3, '3 ta statement bajarildi (real: ' + results.length + ')');
    ok(results[0].kind === 'dml', 'CREATE TABLE dml sifatida');
    ok(results[1].kind === 'dml' && results[1].changes === 1, 'INSERT 1 row affected (real: ' + results[1].changes + ')');
    ok(results[2].kind === 'rows' && results[2].columns.join(',') === 'id,name', 'SELECT ustunlari: id,name');
    ok(JSON.stringify(results[2].rows) === '[[1,"Ali"]]', 'SELECT natijasi [[1,"Ali"]] (real: ' + JSON.stringify(results[2].rows) + ')');

    // UPDATE/DELETE/COUNT real tekshiruv
    db.run("INSERT INTO users VALUES(2, 'Vali');");
    db.run('UPDATE users SET name=? WHERE id=?', ['Ali2', 1]);
    const upd = db.exec('SELECT name FROM users WHERE id = 1');
    ok(upd[0].values[0][0] === 'Ali2', 'UPDATE real ishladi (name=Ali2)');
    db.run('DELETE FROM users WHERE id = 2');
    ok(db.exec('SELECT COUNT(*) FROM users')[0].values[0][0] === 1, 'DELETE + COUNT real');

    // Real SQL error
    let sqlErr = null;
    try { db.exec('SELECT * FROM mavjud_emas_jadval'); } catch (e) { sqlErr = String(e.message || e); }
    ok(!!sqlErr && /no such table/i.test(sqlErr), 'real SQL error: ' + sqlErr);

    // Aggregate real
    const agg = db.exec("SELECT COUNT(*), SUM(id), AVG(id) FROM users WHERE name LIKE 'A%'");
    ok(agg[0].values[0].length === 3, 'COUNT/SUM/AVG real (real: ' + JSON.stringify(agg[0].values[0]) + ')');
    db.close();
  }

  console.log('\n================= 2) C++ — JSCPP (real interpreter + std:: desugaring) =================');
  {
    const JSCPP = require('JSCPP');
    // std:: desugaring (string literal'larni buzmasdan) — semantik ekvivalent transformatsiya
    function desugarStd(source) {
      const segments = String(source || '').split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g);
      for (let i = 0; i < segments.length; i += 2) {
        segments[i] = segments[i].replace(/std::(?=[A-Za-z_])/g, '');
      }
      let out = segments.join('');
      if (!/using\s+namespace\s+std\s*;/.test(out)) {
        out = out.replace(/^[^\n]*/, m => m + ' using namespace std;');
      }
      return out;
    }

    const cppCode = [
      '#include <iostream>',
      'int main() {',
      '    std::cout << "Hello C++";',
      '    return 0;',
      '}'
    ].join('\n');
    let out = '';
    let exitCode = null;
    try {
      exitCode = JSCPP.run(desugarStd(cppCode), '', {
        stdio: { write: s => { out += s; }, error: () => {} }
      });
    } catch (e) { ok(false, 'C++ run xatosiz', String(e && e.stack || e)); }
    ok(out === 'Hello C++', 'C++ STDOUT aynan: ' + JSON.stringify(out));
    ok(exitCode === 0, 'exit code 0 (real: ' + exitCode + ')');

    // cin + loop + function real
    const cpp2 = [
      '#include <iostream>',
      'using namespace std;',
      'int kvadrat(int x) { return x * x; }',
      'int main() {',
      '    int n;',
      '    cin >> n;',
      '    for (int i = 1; i <= n; i++) {',
      '        cout << kvadrat(i) << " ";',
      '    }',
      '    cout << endl;',
      '    return 0;',
      '}'
    ].join('\n');
    let out2 = '';
    try {
      JSCPP.run(desugarStd(cpp2), '5\n', { stdio: { write: s => { out2 += s; } } });
    } catch (e) { ok(false, 'C++ cin/run xatosiz', String(e)); }
    ok(out2.trim() === '1 4 9 16 25', 'cin + for + function real: ' + JSON.stringify(out2.trim()));

    // string ichidagi std:: buzilmasligi
    let out3 = '';
    try {
      JSCPP.run('#include <iostream>\nusing namespace std;\nint main(){ cout << "std::cout literal" << endl; return 0; }', '', { stdio: { write: s => { out3 += s; } } });
    } catch (e) { ok(false, 'literal safe run', String(e)); }
    ok(out3.includes('std::cout literal'), 'string literal ichidagi std:: saqlangan: ' + JSON.stringify(out3.trim()));

    // Parse error + line/column (real parse xatosidan)
    let synErr = null;
    try {
      JSCPP.run(desugarStd('#include <iostream>\nint main() {\n    std::cout << "x" <<;\n    return 0;\n}'), '', { stdio: { write: () => {} } });
    } catch (e) { synErr = e; }
    ok(!!synErr, 'C++ compile (parse) error ushlandi');
    let parsedLine = null;
    if (synErr) {
      const msg = String(synErr.message || synErr);
      const pm = msg.match(/line (\d+) \(column (\d+)\)/) || msg.match(/^\s*(\d+):(\d+)\s+/m);
      if (pm) parsedLine = Number(pm[1]);
      ok(!!pm, 'parse error dan line/column ajratildi (real: ' + (pm ? 'line ' + pm[1] + ', col ' + pm[2] : 'yo\'q') + ')');
    }

    // Runtime error + line:col (real "line:col message" formatidan)
    let runErr = null;
    try {
      JSCPP.run(desugarStd('#include <iostream>\nusing namespace std;\nint main(){ int a = 0; cout << 5 / a << endl; return 0; }'), '', { stdio: { write: () => {} } });
    } catch (e) { runErr = e; }
    ok(!!runErr, 'C++ runtime error ushlandi');
    if (runErr) {
      const msg = String(runErr.message || runErr);
      const rm = msg.match(/^\s*(\d+):(\d+)\s+(.+)$/m);
      ok(!!rm, 'runtime error line:col ajratildi (real: ' + (rm ? rm[1] + ':' + rm[2] + ' ' + rm[3].slice(0, 40) : msg.slice(0, 60)) + ')');
    }
  }

  console.log('\n================= 3) PYTHON — Pyodide (real CPython WASM) =================');
  {
    const { loadPyodide } = require('pyodide');
    const py = await loadPyodide();
    ok(typeof py.runPython === 'function', 'Pyodide yuklandi (real CPython ' + py.version + ')');

    let stdout = '';
    let stderr = '';
    py.setStdout({ batched: s => { stdout += s + '\n'; } });
    py.setStderr({ batched: s => { stderr += s + '\n'; } });

    await py.runPythonAsync('print("Hello from Python")');
    ok(stdout.includes('Hello from Python'), 'print real: ' + JSON.stringify(stdout.trim()));

    // stdin + input()
    py.globals.set('__stdin_text', 'Ali\n25\n');
    await py.runPythonAsync([
      'import sys, io',
      'sys.stdin = io.StringIO(__stdin_text)',
      'ism = input("ism: ")',
      'yosh = int(input())',
      'print("Salom", ism, "- yosh:", yosh)'
    ].join('\n'));
    ok(stdout.includes('Salom Ali - yosh: 25'), 'input()/stdin real: ' + JSON.stringify(stdout.split('\n').slice(-2, -1)));

    // stdlib real
    stdout = '';
    await py.runPythonAsync('import math, json\nprint(math.sqrt(16), json.dumps({"a": 1}))');
    ok(stdout.includes('4.0 {"a": 1}'), 'stdlib (math/json) real: ' + JSON.stringify(stdout.trim()));

    // loop/function real
    stdout = '';
    await py.runPythonAsync('def kvadrat(x):\n    return x * x\nprint([kvadrat(i) for i in range(1, 6)])');
    ok(stdout.includes('[1, 4, 9, 16, 25]'), 'loop/function real');

    // Syntax error + line
    stdout = ''; stderr = '';
    try {
      await py.runPythonAsync('def x(:\n    pass');
    } catch (e) {
      const msg = String(e.message || e);
      ok(/SyntaxError/i.test(msg), 'SyntaxError real: ' + msg.split('\n').slice(-2).join(' | ').slice(0, 140));
      ok(/line\s+\d+/.test(msg), 'xato ichida line bor');
    }
    // Runtime error
    try {
      await py.runPythonAsync('print(mavjud_emas)');
    } catch (e) {
      const msg = String(e.message || e);
      ok(/NameError/i.test(msg) && /line\s+1/.test(msg), 'NameError + line 1 real');
    }
  }

  console.log('\n=========================================');
  console.log('ENGINE NATIJA: ' + passed + ' PASS, ' + failed + ' FAIL');
  process.exit(failed === 0 ? 0 : 1);

})().catch(e => { console.error('FATAL:', e); process.exit(1); });
