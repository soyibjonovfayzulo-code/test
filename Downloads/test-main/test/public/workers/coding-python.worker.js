/* Coding Playground — Python REAL executor
   Runtime: Pyodide — haqiqiy CPython WebAssembly'ga kompilyatsiya qilingan.
   Worker ichida ishlaydi -> main UI thread bloklanmaydi.
   Protocol:
     in : { type: 'run', code, stdin }
     out: { type:'status', message }
        | { type:'stdout', text } | { type:'stderr', text }
        | { type:'done', exitCode }
        | { type:'error', error: { type, message, line, column } } */

import { loadPyodide } from '../pyodide/pyodide.mjs';

let pyodide = null;
let loadingPromise = null;

function post(type, extra) {
  self.postMessage(Object.assign({ type }, extra || {}));
}

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!loadingPromise) {
    post('status', { message: '⏳ Python runtime (Pyodide / real CPython WASM) yuklanmoqda — birinchi yuklash ~5-15s, keyin keshdan tez' });
    // indexURL ni aniq ko'rsatamiz (worker'da document yo'q — stack-based auto-detect ishonchsiz)
    const indexURL = new URL('../pyodide/', self.location.href).href;
    loadingPromise = loadPyodide({ indexURL })
      .then((py) => {
        pyodide = py;
        post('status', { message: '✓ Python runtime tayyor (real CPython ' + (py.version || '') + ')' });
        return py;
      })
      .catch((err) => {
        loadingPromise = null;
        throw err;
      });
  }
  return loadingPromise;
}

function parsePythonError(raw) {
  const text = String(raw || '');
  let type = 'PythonError';
  let message = text;
  let line = null;
  let column = null;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const lastLine = lines[lines.length - 1] || text;
  const tm = lastLine.match(/^([A-Za-z_][\w.]*(?:Error|Exception|Interrupt|Exit|Warning))\s*:?\s*([\s\S]*)$/);
  if (tm) {
    type = tm[1];
    message = tm[2];
  }
  const lm = text.match(/File "<exec>", line (\d+)/)
    || text.match(/File "<[^"]*>", line (\d+)/)
    || text.match(/\n\s*line (\d+)/);
  if (lm) line = Number(lm[1]);
  return { type, message: (message || text).trim().slice(0, 800), line, column };
}

self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type !== 'run') return;
  const code = String(data.code || '');
  const stdin = String(data.stdin || '');
  try {
    const py = await ensurePyodide();
    post('status', { message: '▶ Python bajarilmoqda...' });
    post('started');
    py.setStdout({ batched: (s) => post('stdout', { text: String(s) + '\n' }) });
    py.setStderr({ batched: (s) => post('stderr', { text: String(s) + '\n' }) });
    py.globals.set('__coding_stdin_text', stdin);
    // stdin ni real sys.stdin ga ulash — input() va readline() ishlaydi
    py.runPython('import sys, io\nsys.stdin = io.StringIO(__coding_stdin_text)');
    await py.runPythonAsync(code);
    // yopiq qolgan chastı qismlarni chiqarish
    try { py.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()'); } catch (e) { /* noop */ }
    post('done', { exitCode: 0 });
  } catch (err) {
    post('error', { error: parsePythonError(String((err && err.message) || err)) });
  }
};
