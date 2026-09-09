/* REAL WORKER SIM TEST — sql-wasm.js + JSCPP + haqiqiy worker fayllarini
   importScripts muhitida ishga tushiryapti (node'da Worker yo'q).
   Bu worker fayllarining REAL ishlashini tekshiradi. */
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const root = __dirname;

let passed = 0, failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + String(extra).slice(0, 300) : '')); }
}

// Simulated classic worker: importScripts + self.onmessage farmoni
function makeWorkerEnv(files, vendorRoot) {
  const messages = [];
  const self = {};
  self.location = { href: 'https://app/workers/coding-x.worker.js' };
  self.postMessage = (msg) => messages.push(msg);
  const sandbox = {
    self, console, setTimeout, clearTimeout, setInterval, clearInterval,
    TextDecoder: require('util').TextDecoder,
    TextEncoder: require('util').TextEncoder,
    URL,
    Response, Blob, ArrayBuffer, Uint8Array,
    WordArray: undefined
  };
  sandbox.URL.createObjectURL = () => '';
  sandbox.URL.revokeObjectURL = () => {};
  // sql-wasm.js wasm-ni fetch orqali yuklaydi — vendor fayllarni diskdan serve qilamiz
  if (vendorRoot) {
    sandbox.fetch = (url) => {
      const href = String(url);
      const fileName = href.split('/').pop().split('?')[0];
      const filePath = path.join(vendorRoot, fileName);
      try {
        const buf = fs.readFileSync(filePath);
        return Promise.resolve(new Response(buf, { status: 200, headers: { 'Content-Type': 'application/wasm' } }));
      } catch (e) {
        return Promise.resolve(new Response('not found', { status: 404 }));
      }
    };
  }
  const importScripts = (...urls) => {
    for (const u of urls) {
      const fileName = path.basename(u);
      const full = files[fileName];
      if (!full) throw new Error('importScripts fayl topilmadi: ' + u);
      vm.runInContext(full, sandbox, { timeout: 8000 });
    }
  };
  sandbox.importScripts = importScripts;
  const ctx = vm.createContext(sandbox);
  return { ctx, self, messages, sandbox };
}

// ---------- SQL worker (real coding-sql.worker.js) ----------
{
  console.log('================= SQL WORKER (real file) =================');
  const files = {
    'sql-wasm.js': fs.readFileSync(path.join(root, 'public/vendor/sqljs/sql-wasm.js'), 'utf8')
  };
  const env = makeWorkerEnv(files, path.join(root, 'public/vendor/sqljs'));
  const workerSrc = fs.readFileSync(path.join(root, 'public/workers/coding-sql.worker.js'), 'utf8');
  vm.runInContext(workerSrc, env.ctx, { timeout: 15000 });

  const post = env.self.onmessage || vm.runInContext('typeof onmessage === "function" ? onmessage : null', env.ctx);
  env.self.onmessage({ data: {
    type: 'run',
    code: "CREATE TABLE users(id INTEGER, name TEXT);\nINSERT INTO users VALUES(1, 'Ali');\nINSERT INTO users VALUES(2, 'Vali');\nSELECT id, name FROM users ORDER BY id;",
    stdin: ''
  } });

  // importScripts sync, lekin sql wasm async — message'lar microtask'larda keladi
  setTimeout(() => {
    const types = env.messages.map(m => m.type);
    ok(types.includes('result'), 'SQL worker result yubordi (types: ' + types.join(',') + ')');
    const rowsResult = env.messages.find(m => m.type === 'result' && m.result && m.result.kind === 'rows');
    ok(!!rowsResult, 'SELECT natijasi rows sifatida keldi');
    if (rowsResult) {
      ok(rowsResult.result.columns.join(',') === 'id,name', 'SQL ustunlar: id,name (real: ' + rowsResult.result.columns.join(',') + ')');
      ok(JSON.stringify(rowsResult.result.rows) === '[[1,"Ali"],[2,"Vali"]]', 'SQL qatorlar real: ' + JSON.stringify(rowsResult.result.rows));
    }
    ok(env.messages.some(m => m.type === 'done'), 'SQL worker done yubordi');
    // real SQL error
    env.self.onmessage({ data: { type: 'run', code: 'SELECT * FROM yoq_jadval;', stdin: '' } });
    setTimeout(() => {
      const errMsg = env.messages.find(m => m.type === 'error');
      ok(!!errMsg, 'SQL error yuborildi');
      ok(!!errMsg && /no such table/i.test(errMsg.error.message), 'real SQL error matni: ' + (errMsg && errMsg.error.message));
      finishPart1();
    }, 300);
  }, 300);
}

let part1Done = false;
function finishPart1() { part1Done = true; runPart2(); }

// ---------- C++ worker (real coding-cpp.worker.js) ----------
function runPart2() {
  console.log('\n================= C++ WORKER (real file) =================');
  const files = {
    'JSCPP.bundle.js': fs.readFileSync(path.join(root, 'public/vendor/jscpp/JSCPP.bundle.js'), 'utf8')
  };
  const env = makeWorkerEnv(files);
  const workerSrc = fs.readFileSync(path.join(root, 'public/workers/coding-cpp.worker.js'), 'utf8');
  vm.runInContext(workerSrc, env.ctx, { timeout: 15000 });

  env.self.onmessage({ data: {
    type: 'run',
    code: '#include <iostream>\nint main() {\n    std::cout << "Hello C++ Worker" << std::endl;\n    return 0;\n}',
    stdin: ''
  } });

  setTimeout(() => {
    const types = env.messages.map(m => m.type);
    ok(types.includes('stdout'), 'C++ worker stdout yubordi (types: ' + types.join(',') + ')');
    const out = env.messages.filter(m => m.type === 'stdout').map(m => m.text).join('');
    ok(out.trim() === 'Hello C++ Worker', 'C++ worker STDOUT aynan: ' + JSON.stringify(out.trim()));
    ok(env.messages.some(m => m.type === 'done'), 'C++ worker done yubordi');

    // std:: desugaring worker ichida ham ishlashi
    env.messages.length = 0; // oldingi run chiqishlarini tozalash
    env.self.onmessage({ data: {
      type: 'run',
      code: '#include <iostream>\nusing namespace std;\nint main(){ int x; cin >> x; cout << x * 10 << endl; return 0; }',
      stdin: '4\n'
    } });
    setTimeout(() => {
      const out2 = env.messages.filter(m => m.type === 'stdout').map(m => m.text).join('');
      ok(out2.trim() === '40', 'C++ worker cin real (4*10=40): ' + JSON.stringify(out2.trim()));

      // compile error line/col worker orqali
      env.messages.length = 0;
      env.self.onmessage({ data: { type: 'run', code: '#include <iostream>\nint main() {\n    std::cout << "x" <<;\n}', stdin: '' } });
      setTimeout(() => {
        const errMsg = env.messages.find(m => m.type === 'error');
        ok(!!errMsg && errMsg.error.type === 'CompileError', 'C++ compile error turi CompileError');
        ok(!!errMsg && errMsg.error.line === 3, 'compile error line 3 (real: ' + (errMsg && errMsg.error.line) + ')');
        ok(!!errMsg && !!errMsg.error.column, 'column ham bor (real: ' + (errMsg && errMsg.error.column) + ')');
        finishPart2();
      }, 200);
    }, 200);
  }, 200);
}

function finishPart2() {
  console.log('\n=========================================');
  console.log('WORKER-SIM NATIJA: ' + passed + ' PASS, ' + failed + ' FAIL');
  process.exit(failed === 0 ? 0 : 1);
}
