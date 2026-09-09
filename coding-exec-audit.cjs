/* CODING EXECUTION SYSTEM — TO'LIQ AUDIT
   Python (Pyodide real CPython) + C++ (JSCPP real interpreter) + SQL (sql.js real SQLite)
   Worker stdin-setup qismlari worker fayllari bilan BIR XIL qo'llanadi (fake yo'q).
   Run: node coding-exec-audit.cjs */
const path = require('path');
const fs = require('fs');

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra !== undefined ? '\n     ' + JSON.stringify(extra).slice(0, 500) : '')); }
}

// ---------- Worker stdin setup qismi (Python worker'dan verbatim) ----------
function pythonStdInSetup(py, stdin) {
  py.globals.set('__coding_stdin_text', stdin);
  py.runPython('import sys, io\nsys.stdin = io.StringIO(__coding_stdin_text)');
}

(async () => {
  /* ==================== PYTHON — input() / stdin audit ==================== */
  console.log('================= PYTHON (Pyodide real CPython) — input() audit =================');
  {
    const { loadPyodide } = require('pyodide');
    const py = await loadPyodide();
    const runPy = async (code, stdin) => {
      const stdout = { text: '' };
      py.setStdout({ batched: s => { stdout.text += s + '\n'; } });
      py.setStderr({ batched: () => {} });
      pythonStdInSetup(py, stdin);
      try {
        await py.runPythonAsync(code);
        return { ok: true, stdout: stdout.text };
      } catch (e) {
        return { ok: false, error: String((e && e.message) || e), stdout: stdout.text };
      }
    };

    // 1 ta input
    let r = await runPy('ism = input("Ism: ")\nprint("Salom", ism)', 'Sardor\n');
    ok(r.ok && /Salom Sardor/.test(r.stdout), '1-ta input -> print(ism): ' + JSON.stringify(r.stdout.trim()));
    ok(r.stdout.includes('Ism: '), 'input(prompt) stdout da chiqdi');

    // 2 ta input (USER TEST)
    r = await runPy('name = input("Ism: ")\nage = int(input("Yosh: "))\nprint(name, age)', 'Sardor\n18\n');
    ok(r.ok && /^Sardor 18$/m.test(r.stdout), '2-ta input (user test): Sardor 18 -> ' + JSON.stringify(r.stdout.trim().split('\n').pop()));

    // 3 ta input
    r = await runPy('a = input("a=")\nb = input("b=")\nc = input("c=")\nprint(a + b + c)', 'x\ny\nz\n');
    ok(r.ok && /xyz/.test(r.stdout), '3-ta input ketma-ket: xyz -> ' + JSON.stringify(r.stdout.trim().split('\n').pop()));

    // int(input()) — valid
    r = await runPy('n = int(input("Son: "))\nprint(n * 2)', '21\n');
    ok(r.ok && /42/.test(r.stdout), 'int(input()) valid: 42 -> ' + JSON.stringify(r.stdout.trim().split('\n').pop()));

    // int(input()) — invalid
    r = await runPy('n = int(input("Son: "))\nprint(n)', 'abc\n');
    ok(!r.ok && /ValueError/i.test(r.error), 'invalid input -> real ValueError: ' + r.error.split('\n').slice(-2).join(' | ').slice(0, 160));
    ok(!r.ok && /line\s+1/.test(r.error), 'ValueError user line 1');

    // EOF
    r = await runPy('x = input("X: ")\nprint(x)', '');
    ok(!r.ok && /EOFError/i.test(r.error), "bo'sh stdin -> real EOFError: " + r.error.split('\n').slice(-2).join(' | ').slice(0, 160));
    r = await runPy('a = input()\nb = input()\nprint(a, b)', 'faqat_bitta\n');
    ok(!r.ok && /EOFError/i.test(r.error), '2-input ga 1 qiymat -> 2-chida real EOFError');

    // Qayta ishlatish: yangi stdin, eski qolmasin
    r = await runPy('print(input())', 'bir_1\n');
    const afterFirst = r.stdout;
    r = await runPy('print(input())', 'ikki_2\n');
    ok(afterFirst.includes('bir_1'), 'run1 stdin qo\'yildi');
    ok(r.stdout.includes('ikki_2') && !r.stdout.includes('bir_1'), 'run2 yangi stdin, eski qolmadi: ' + JSON.stringify(r.stdout.trim()));

    // Syntax error line (user source)
    r = await runPy('x = 1\ndef f(:\n    pass', '');
    ok(!r.ok && /SyntaxError/i.test(r.error) && /line\s+2/.test(r.error), 'SyntaxError line 2 (user source)');

    // Runtime NameError line 1
    r = await runPy('print(mavjud_emas_123)', '');
    ok(!r.ok && /NameError/i.test(r.error) && /line\s+1/.test(r.error), 'NameError line 1 real');
  }

/* ==================== C++ — std::cin audit ==================== */
  console.log('\n================= C++ (JSCPP real interpreter) — cin audit =================');
  {
    const JSCPP = require('JSCPP');
    // Worker'dagi desugarStd — verbatim
    function desugarStd(source) {
      const segments = String(source || '').split(/("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')/g);
      for (let i = 0; i < segments.length; i += 2) {
        segments[i] = segments[i].replace(/std::(?=[A-Za-z_])/g, '');
      }
      let out = segments.join('');
      if (!/using\s+namespace\s+std\s*;/.test(out)) {
        out = out.replace(/^[^\n]*/, m => m + ' using namespace std;');
      }
      return out;
    }
    const runCpp = (code, stdin) => {
      let out = '';
      let errText = '';
      try {
        const exit = JSCPP.run(desugarStd(code), stdin, {
          stdio: { write: s => { out += s; }, error: s => { errText += s; } }
        });
        return { ok: true, out, errText, exit };
      } catch (e) {
        return { ok: false, error: String((e && e.message) || e), out, errText };
      }
    };

    // USER TEST: cin >> a >> b; cout << a+b; input "5 7\n"
    let r = runCpp(
      '#include <iostream>\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    std::cout << a + b;\n    return 0;\n}',
      '5 7\n');
    ok(r.ok && r.out.trim() === '12', 'cin>>a>>b (5 7) -> 12: ' + JSON.stringify(r.out.trim()));
    ok(r.exit === 0, 'C++ exit code 0 (real: ' + r.exit + ')');

    // multiple cin — 3 ta ketma-ket
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int a,b,c; cin >> a >> b >> c; cout << a << "," << b << "," << c; return 0; }', '1 2 3\n');
    ok(r.ok && r.out.trim() === '1,2,3', '3-ta cin ketma-ket: ' + JSON.stringify(r.out.trim()));

    // int input valid
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int n; cin >> n; cout << n * 3; }', '7\n');
    ok(r.ok && r.out.trim() === '21', 'int cin valid (7*3=21): ' + JSON.stringify(r.out.trim()));

    // string input
    r = runCpp('#include <iostream>\n#include <string>\nusing namespace std;\nint main(){ string s; cin >> s; cout << "Salom " << s; }', 'Ali\n');
    ok(r.ok && r.out.trim() === 'Salom Ali', 'string cin: ' + JSON.stringify(r.out.trim()));

    // for + cin
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int n; cin >> n; for(int i=1;i<=n;i++) cout << i << " "; }', '4\n');
    ok(r.ok && r.out.trim() === '1 2 3 4', 'for + cin: ' + JSON.stringify(r.out.trim()));

    // invalid input — int o'rniga matn (REAL xulq tekshiriladi, fake emas)
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int n; cin >> n; cout << n; }', 'abc\n');
    console.log('     (ma\'lumot) invalid int input -> ' + (r.ok ? 'stdout=' + JSON.stringify(r.out.trim()) + ', exit=' + r.exit : 'error=' + r.error.slice(0, 120)));

    // compile error line/col
    r = runCpp('#include <iostream>\nint main() {\n    std::cout << "x" <<;\n}', '');
    ok(!r.ok, 'C++ compile (parse) error real ushlandi');
    let cline = null, ccol = null;
    if (!r.ok) {
      const pm = r.error.match(/line (\d+) \(column (\d+)\)/) || r.error.match(/^\s*(\d+):(\d+)\s+/m);
      if (pm) { cline = Number(pm[1]); ccol = Number(pm[2]); }
      ok(cline === 3, 'compile error line 3 (real: ' + cline + ')');
      ok(!!ccol, 'compile error column bor (real: ' + ccol + ')');
    }

    // runtime error line:col
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int a = 0; cout << 5 / a << endl; }', '');
    ok(!r.ok, 'C++ runtime error real ushlandi');
    if (!r.ok) {
      ok(/^\s*\d+:\d+\s+/.test(r.error), 'runtime error line:col format (real: ' + r.error.split('\n').slice(0, 2).join(' ').slice(0, 100) + ')');
    }

    // Worker qayta ishlatilganda stale state yo'q (JSCPP har run yangi interpreter)
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int x = 9; cout << x; }', '');
    const stale1 = r.out.trim();
    r = runCpp('#include <iostream>\nusing namespace std;\nint main(){ int x = 4; cout << x; }', '');
    ok(stale1 === '9' && r.out.trim() === '4', '2-run JSCPP state toza (9 -> 4): ' + JSON.stringify([stale1, r.out.trim()]));
  }

/* ==================== SQL — sql.js (real SQLite) audit ==================== */
  console.log('\n================= SQL (sql.js real SQLite) — audit =================');
  {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    const runSql = (code) => {
      // Worker kabi: har run'da yangi Database (stale bo'lmasin)
      const db = new SQL.Database();
      const results = [];
      try {
        const it = db.iterateStatements(code);
        for (const stmt of it) {
          const columns = stmt.getColumnNames();
          const rows = [];
          while (stmt.step()) rows.push(stmt.get());
          results.push(columns.length > 0
            ? { kind: 'rows', columns, rows }
            : { kind: 'dml', changes: db.getRowsModified() });
        }
        return { ok: true, results };
      } catch (e) {
        return { ok: false, error: String((e && e.message) || e), results };
      } finally {
        try { db.close(); } catch (e) { /* noop */ }
      }
    };

    // USER TEST: CREATE + INSERT + SELECT -> 1 | Ali
    let r = runSql("CREATE TABLE users(id INTEGER, name TEXT);\nINSERT INTO users VALUES(1, 'Ali');\nSELECT * FROM users;");
    ok(r.ok, 'SQL CREATE+INSERT+SELECT xatosiz bajarildi');
    const last = r.results[r.results.length - 1];
    ok(last.kind === 'rows' && last.columns.join(',') === 'id,name', 'SQL final SELECT ustunlari: id,name');
    ok(JSON.stringify(last.rows) === '[[1,"Ali"]]', 'USER TEST natija: 1 | Ali (real: ' + JSON.stringify(last.rows) + ')');

    // UPDATE
    r = runSql("CREATE TABLE t(id INTEGER, v TEXT);\nINSERT INTO t VALUES(1,'a');\nUPDATE t SET v='b' WHERE id=1;\nSELECT v FROM t WHERE id=1;");
    ok(JSON.stringify(r.results[r.results.length - 1].rows) === '[["b"]]', 'UPDATE real: v=b -> ' + JSON.stringify(r.results[r.results.length - 1].rows));
    ok(r.results.some(x => x.kind === 'dml' && x.changes === 1), 'UPDATE 1 row affected');

    // DELETE
    r = runSql("CREATE TABLE t(id INTEGER);\nINSERT INTO t VALUES(1),(2),(3);\nDELETE FROM t WHERE id>1;\nSELECT COUNT(*) FROM t;");
    ok(r.results[r.results.length - 1].rows[0][0] === 1, 'DELETE real: qolgan count=1 -> ' + r.results[r.results.length - 1].rows[0][0]);

    // WHERE + ORDER BY + GROUP BY + SUM + AVG
    r = runSql("CREATE TABLE s(k TEXT, v INTEGER);\nINSERT INTO s VALUES('a',10),('a',20),('b',5);\nSELECT k, SUM(v), AVG(v) FROM s WHERE v>5 GROUP BY k ORDER BY k;");
    const agg = r.results[r.results.length - 1];
    ok(agg.kind === 'rows', 'aggregate real jadval');
    ok(JSON.stringify(agg.rows) === '[["a",30,15]]', 'GROUP BY/SUM/AVG/WHERE/ORDER real: ' + JSON.stringify(agg.rows));

    // JOIN
    r = runSql("CREATE TABLE users(id INTEGER, name TEXT);\nCREATE TABLE orders(user_id INTEGER, item TEXT);\nINSERT INTO users VALUES(1,'Ali'),(2,'Vali');\nINSERT INTO orders VALUES(1,'Kitob');\nSELECT users.name, orders.item FROM users JOIN orders ON users.id = orders.user_id;");
    const j = r.results[r.results.length - 1];
    ok(JSON.stringify(j.rows) === '[["Ali","Kitob"]]', 'JOIN real: ' + JSON.stringify(j.rows));

    // SQL error — real xato matni
    r = runSql('SELECT * FROM yoq_jadval;');
    ok(!r.ok && /no such table/i.test(r.error), 'real SQL error (no such table): ' + r.error);
    r = runSql('SELEC * FROM t;');
    ok(!r.ok && /syntax error/i.test(r.error), 'real SQL syntax error: ' + r.error);

    // 2-run alohida Database (stale emas)
    r = runSql("CREATE TABLE x(v INTEGER);\nINSERT INTO x VALUES(1);\nSELECT COUNT(*) FROM x;");
    const c1 = r.results[r.results.length - 1].rows[0][0];
    r = runSql("CREATE TABLE x(v INTEGER);\nINSERT INTO x VALUES(1),(2),(3);\nSELECT COUNT(*) FROM x;");
    const c2 = r.results[r.results.length - 1].rows[0][0];
    ok(c1 === 1 && c2 === 3, 'SQL 2-run alohida jadval (stale emas): ' + c1 + ' -> ' + c2);
  }

  console.log('\n=========================================');
  console.log('EXEC AUDIT NATIJA: ' + passed + ' PASS, ' + failed + ' FAIL');
  process.exit(failed === 0 ? 0 : 1);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });