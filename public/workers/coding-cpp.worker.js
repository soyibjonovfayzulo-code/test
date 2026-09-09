/* Coding Playground — C++ REAL executor
   Runtime: JSCPP — haqiqiy C++ interpreter (real parse + real ijro):
   iostream/cout/cin/endl, o'zgaruvchilar, if/else, looplar, funksiyalar, classlar.
   Eslatma: bu to'liq GCC kompilyatori emas — qo'llanmagan konstruksiyalar
   real parse/runtime xatolar beradi (line/column bilan).
   std:: desugaring: JSCPP grammatikasi `std::cout` qualified nomlarni parse qilmaydi,
   shuning uchun kod semantik ekvivalent ravishda `using namespace std;` holatiga
   keltiriladi (string literal'lar buzilmaydi, qator raqamlari saqlanadi).
   Protocol: python worker bilan bir xil. */

importScripts('../vendor/jscpp/JSCPP.bundle.js');

function post(type, extra) {
  self.postMessage(Object.assign({ type }, extra || {}));
}

function desugarStd(source) {
  const segments = String(source || '').split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g);
  for (let i = 0; i < segments.length; i += 2) {
    segments[i] = segments[i].replace(/std::(?=[A-Za-z_])/g, '');
  }
  let out = segments.join('');
  if (!/using\s+namespace\s+std\s*;/.test(out)) {
    out = out.replace(/^[^\n]*/, (m) => m + ' using namespace std;');
  }
  return out;
}

function parseCppError(raw) {
  const text = String(raw || '');
  let type = 'RuntimeError';
  let message = text;
  let line = null;
  let column = null;
  const rm = text.match(/^\s*(\d+):(\d+)\s+(.+)$/m);
  if (rm) {
    line = Number(rm[1]);
    column = Number(rm[2]);
    message = rm[3];
    if (/does not exist|undeclared|not declared/i.test(message)) type = 'CompileError';
  } else {
    const pm = text.match(/line (\d+) \(column (\d+)\)/);
    if (pm) {
      type = 'CompileError';
      line = Number(pm[1]);
      column = Number(pm[2]);
      const parts = text.split('\n').slice(0, 2).join(' ').replace(/\s+/g, ' ').trim();
      message = parts;
    } else {
      message = text.split('\n')[0];
    }
  }
  return { type, message: message.slice(0, 500), line, column };
}

self.onmessage = (event) => {
  const data = event.data || {};
  if (data.type !== 'run') return;
  const code = desugarStd(String(data.code || ''));
  const stdin = String(data.stdin || '');
  try {
    post('status', { message: '▶ C++ bajarilmoqda (real interpreter)...' });
    post('started');
    const exitCode = JSCPP.run(code, stdin, {
      stdio: {
        write: (s) => post('stdout', { text: String(s) }),
        error: (s) => post('stderr', { text: String(s) })
      }
    });
    post('done', { exitCode: typeof exitCode === 'number' ? exitCode : 0 });
  } catch (err) {
    post('error', { error: parseCppError(String((err && err.message) || err)) });
  }
};
