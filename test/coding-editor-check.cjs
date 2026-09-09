/* Coding Editor — REAL TEST (jsdom)
   Run: node coding-editor-check.js
   Bu test RC1..RC8 tuzatishlarini haqiqiy DOM muhitida tekshiradi. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const jsSrc = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const dom = new JSDOM(htmlSrc, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://localhost/' });
const w = dom.window;
const doc = w.document;

// Helperlar (real script.js'da yuqorida aniqlangan; slice'da yo'q — stub qilinadi)
w.$ = s => doc.querySelector(s);
w.$$ = s => Array.from(doc.querySelectorAll(s));
w.showToast = () => {};
w.confirm = () => true;

// Faqat CODING ENGINE slice'ini yuklaymiz (boshqa bo'limlarga tegmaymiz)
const marker = '/* ====================== CODE PLAYGROUND IDE ENGINE ====================== */';
const idx = jsSrc.indexOf(marker);
if (idx === -1) { console.error('FATAL: coding engine marker topilmadi'); process.exit(1); }
w.eval(jsSrc.slice(idx));

let passed = 0;
let failed = 0;
function ok(cond, label, extra) {
  if (cond) { passed++; console.log('  ✅ ' + label); }
  else { failed++; console.log('  ❌ ' + label + (extra ? '\n     ' + extra : '')); }
}

/* ===================== TOKENIZER — RAW CODE MUSADARA QILINMASIN ===================== */
function checkHighlight(name, fn, code, expectations, negatives) {
  console.log('\n[' + name + ']');
  let out;
  try { out = fn(code); } catch (e) { ok(false, 'highlight ishladi', e.stack); return; }
  const div = doc.createElement('div');
  div.innerHTML = out;
  const spans = Array.from(div.querySelectorAll('span'));
  const openCount = (out.match(/<span\b/g) || []).length;

  ok(spans.length === openCount, "markup buzilmagan (span parsing to'liq)");
  ok(div.textContent === code.replace(/\r\n/g, '\n'),
    'RAW CODE aynan saqlangan (round-trip)',
    'expected: ' + JSON.stringify(code) + '\n     got:      ' + JSON.stringify(div.textContent));
  ok(spans.every(s => !s.querySelector('span')), "nested/ichma-ich span YO'Q");
  ok(spans.every(s => /^token-/.test(s.className)), 'barcha span classlari token-*');
  ok(!out.includes('&nbsp;') && !out.includes('<br>'), "&nbsp;/<br> hack ishlatilmagan");

  for (const pair of (expectations || [])) {
    ok(spans.some(s => s.className === pair[1] && s.textContent === pair[0]),
      'token: <' + pair[1] + '>' + pair[0] + '</' + pair[1] + '>');
  }
  for (const bad of (negatives || [])) {
    ok(!out.includes(bad), 'negative: "' + bad + '" yo\'q');
  }
  return out;
}

console.log('================= TEST 1: REAL USER SAMPLES =================');
checkHighlight('HTML', w.highlightHtmlCode, '<div class="box">Hello</div>', [
  ['<div', 'token-html-tag'],
  ['class', 'token-html-attr-name'],
  ['"box"', 'token-html-attr-value'],
  ['</div', 'token-html-tag'],
  ['>', 'token-html-tag'],
]);

checkHighlight('CSS', w.highlightCssCode, '.box { color:red; }', [
  ['.box', 'token-css-class'],
  ['color', 'token-css-property'],
  ['red', 'token-css-value'],
]);

checkHighlight('JS', w.highlightJsCode, 'const x = 10;\nconsole.log(x);', [
  ['const', 'token-js-keyword'],
  ['x', 'token-js-variable'],
  ['10', 'token-js-number'],
  ['console.log', 'token-js-console'],
]);

console.log('\n================= TEST 2: TOKEN ICHIDA TOKEN BUZILMASIN (eski RC1 killer) =================');
checkHighlight('JS-string-with-keyword/comment/ops', w.highlightJsCode,
  'const s = "return true /* not a */ <b>=c|d</b>";', [
    ['"return true /* not a */ <b>=c|d</b>"', 'token-js-string'],
  ]);
{
  const out = w.highlightJsCode('const s = "return true /* not a */ <b>=c|d</b>";');
  const holder = doc.createElement('div');
  holder.innerHTML = out;
  const strSpan = holder.querySelector('span.token-js-string');
  ok(!!strSpan && strSpan.textContent === '"return true /* not a */ <b>=c|d</b>"', 'string span ichi aynan raw matn (DOM orqali)');
  const rawSpan = out.match(/<span class="token-js-string">([\s\S]*?)<\/span>/);
  ok(!!rawSpan && !rawSpan[1].includes('<span'), "string span ICHIDA hech qanday span YO'Q (nested yo'q)");
  ok(!out.includes('&lt;span'), 'string ichidagi <b> belgilari span ochib yubormagan');
}

checkHighlight('JS-comment-priority', w.highlightJsCode, '// const x = "str";\nlet y = 2;', [
  ['// const x = "str";', 'token-js-comment'],
  ['let', 'token-js-keyword'],
  ['y', 'token-js-variable'],
  ['2', 'token-js-number'],
]);

checkHighlight('HTML-attr-with-ops', w.highlightHtmlCode, '<a href="/x?y=1&z=2" data-x=\'v\'>T</a>', [
  ['href', 'token-html-attr-name'],
  ['"/x?y=1&z=2"', 'token-html-attr-value'],
  ['data-x', 'token-html-attr-name'],
]);

console.log('\n================= TEST 3: 8 TA TIL =================');
checkHighlight('HTML-full', w.highlightHtmlCode,
  '<!-- izoh -->\n<!DOCTYPE html>\n<ul id="list" class="c">\n  <li>One</li>\n</ul>', [
    ['<!-- izoh -->', 'token-html-comment'],
    ['<!DOCTYPE html>', 'token-html-comment'],
    ['<ul', 'token-html-tag'],
    ['id', 'token-html-attr-name'],
    ['"list"', 'token-html-attr-value'],
  ]);

checkHighlight('CSS-full', w.highlightCssCode,
  ':root { --main: #fff; }\na:hover { color: var(--main); background: url("bg.png"); }\n@media (max-width: 768px) { .x { top: 10px; } }', [
    [':root', 'token-css-pseudo'],
    ['--main', 'token-css-variable'],
    ['#fff', 'token-css-number'],
    ['a', 'token-css-selector'],
    [':hover', 'token-css-pseudo'],
    ['color', 'token-css-property'],
    ['"bg.png"', 'token-css-string'],
    ['@media', 'token-css-media'],
    ['max-width', 'token-css-property'],
    ['.x', 'token-css-class'],
    ['10px', 'token-css-value'],
  ]);

checkHighlight('Python', w.highlightPythonCode,
  'class Dog:\n    def bark(self):\n        x = 10  # izoh\n        return "woof"', [
    ['class', 'token-python-keyword'],
    ['Dog', 'token-python-class'],
    ['def', 'token-python-keyword'],
    ['bark', 'token-python-function'],
    ['self', 'token-python-variable'],
    ['"woof"', 'token-python-string'],
    ['# izoh', 'token-python-comment'],
    ['10', 'token-python-number'],
  ]);

checkHighlight('Java', w.highlightJavaCode,
  'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}', [
    ['public', 'token-java-keyword'],
    ['Main', 'token-java-class'],
    ['main', 'token-java-method'],
    ['System', 'token-java-class'],
    ['"Hello"', 'token-java-string'],
  ]);

checkHighlight('C++', w.highlightCppCode,
  '#include <iostream>\nint main() {\n    std::string msg = "Hi";\n    std::cout << msg << std::endl;\n    return 0;\n}', [
    ['<iostream>', 'token-cpp-string'],
    ['int', 'token-cpp-type'],
    ['main', 'token-cpp-function'],
    ['std', 'token-cpp-keyword'],
    ['string', 'token-cpp-type'],
    ['"Hi"', 'token-cpp-string'],
    ['return', 'token-cpp-keyword'],
    ['0', 'token-cpp-number'],
  ]);

checkHighlight('C#', w.highlightCSharpCode,
  'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hi");\n    }\n}', [
    ['using', 'token-csharp-keyword'],
    ['Program', 'token-csharp-type'],
    ['Main', 'token-csharp-function'],
    ['"Hi"', 'token-csharp-string'],
  ]);

checkHighlight('SQL', w.highlightSqlCode,
  "SELECT users.id, COUNT(orders.id) AS cnt\nFROM users\nWHERE users.is_active = 1\nGROUP BY users.id;", [
    ['SELECT', 'token-sql-keyword'],
    ['users', 'token-sql-table'],
    ['id', 'token-sql-field'],
    ['COUNT', 'token-sql-keyword'],
    ['FROM', 'token-sql-keyword'],
    ['1', 'token-sql-number'],
  ]);

console.log('\n================= TEST 4: LEGACY TOKEN-SPAN SANITIZER =================');
{
  const dirty = '<span class="token-js-keyword">const</span> x = 1;';
  const clean = w.normalizeHighlightSource(dirty);
  ok(clean === 'const x = 1;', "legacy token-span'lar raw code'dan tozalangan: " + JSON.stringify(clean));
  const out = w.highlightJsCode(dirty);
  const div = doc.createElement('div');
  div.innerHTML = out;
  ok(div.textContent === 'const x = 1;', 'sanitizatsiya -> highlight -> round-trip toza');
}

console.log('\n================= TEST 5: 10000+ QATOR PERFORMANCE =================');
{
  const bigJs = Array.from({ length: 10000 }, (_, i) => 'const v' + i + ' = ' + i + '; // line ' + i).join('\n');
  const t0 = Date.now();
  const out = w.highlightJsCode(bigJs);
  const dt = Date.now() - t0;
  const div = doc.createElement('div');
  div.innerHTML = out;
  ok(div.textContent === bigJs, '10000 qatorli JS: round-trip aniq (' + bigJs.split('\n').length + ' qator)');
  ok(dt < 2000, '10000 qator highlight < 2000ms (real: ' + dt + 'ms)');
  console.log('     ⏱ 10000-line JS highlight: ' + dt + 'ms, output ' + (out.length / 1024).toFixed(0) + 'KB');
}
{
  const bigHtml = Array.from({ length: 2500 }, (_, i) => '<div class="item-' + i + '" id="row' + i + '">Row ' + i + '</div>').join('\n');
  const t0 = Date.now();
  const out = w.highlightHtmlCode(bigHtml);
  const dt = Date.now() - t0;
  const div = doc.createElement('div');
  div.innerHTML = out;
  ok(div.textContent === bigHtml, '2500 qatorli HTML: round-trip aniq');
  ok(dt < 2000, '2500 qator HTML highlight < 2000ms (real: ' + dt + 'ms)');
  console.log('     ⏱ 2500-line HTML highlight: ' + dt + 'ms');
}

console.log('\n================= TEST 6: RUN — RAW CODE + LINE OFFSET (RC2) =================');
{
  const htmlEd = doc.getElementById('htmlEditor');
  const cssEd = doc.getElementById('cssEditor');
  const jsEd = doc.getElementById('jsEditor');
  htmlEd.value = '<h1 id="title">Salom</h1>';
  cssEd.value = '#title { color:red; }';
  const userJs = ['// qator 1', '// qator 2', 'console.log("qator 3");'].join('\n');
  jsEd.value = userJs;

  w.executeCombinedCode();
  const iframe = doc.getElementById('codingIframe');
  const docStr = iframe.getAttribute('srcdoc') || '';

  ok(docStr.includes('<h1 id="title">Salom</h1>'), 'RAW HTML srcdoc ichida aynan bor');
  ok(docStr.includes('#title { color:red; }'), 'RAW CSS <style> ichida aynan bor');
  ok(!docStr.includes('token-'), "srcdoc ichida token-* highlight markup YO'Q");

  const m = docStr.match(/window\.__js_line_offset = (\d+);/);
  ok(!!m, 'line offset script bor');
  const off = Number(m[1]);
  const scriptTagIdx = docStr.indexOf('<script>window.__js_line_offset');
  const secondScriptLine = docStr.indexOf('\n', scriptTagIdx) + 1;      // '<script>' qatori boshi
  const userJsStart = secondScriptLine + '<script>\n'.length;            // user JS 1-qatori
  const prefixNewlines = (docStr.slice(0, userJsStart).match(/\n/g) || []).length;

  ok(off === prefixNewlines, 'offset aniq: ' + off + ' === user JS oldidagi qatorlar ' + prefixNewlines,
    'off=' + off + ' prefixLines=' + prefixNewlines);
  ok(docStr.substr(userJsStart, userJs.length) === userJs, "user JS RAW holda, buzilmagan ko'chirilgan");
  ok(docStr.indexOf('window.onerror') < scriptTagIdx, "console/error interceptor user JS'dan OLDIN keladi");
  console.log('     ℹ️  user JS 1-qatori doc qatori ' + (prefixNewlines + 1) + ' -> reported - ' + off + ' = 1 ✔');
}

console.log('\n================= TEST 7: BUILDCLEANHTML (Browser open / Download) =================');
{
  const out = w.buildCleanHtml('<div class="box">Hello</div>', '.box { color:red; }', 'const x = 10;\nconsole.log(x);\n// </script> trick');
  ok(out.includes('<div class="box">Hello</div>'), 'RAW HTML saqlangan');
  ok(out.includes('.box { color:red; }'), 'RAW CSS saqlangan');
  ok(out.includes('const x = 10;'), 'RAW JS saqlangan');
  ok(out.includes('<\\/script> trick'), 'user JS ichidagi yopiluvchi script tag escape qilingan');
  ok(!out.includes('token-'), "highlight markup YO'Q");
  ok(out.includes('<style>') && out.includes('</style>'), 'standalone document tuzilishi');
}

console.log('\n================= TEST 8: BRAUZERDA OCHISH (RC3) =================');
{
  // jsdom'da URL.createObjectURL yo'q — stub
  let lastBlob = null;
  w.URL.createObjectURL = (blob) => { lastBlob = blob; return 'blob:mock-url'; };
  w.URL.revokeObjectURL = () => {};

  let openArgs = null;
  w.open = (url, target) => { openArgs = { url, target }; return { opener: 'x' }; };
  w.openInBrowser();
  ok(!!openArgs, 'window.open chaqirildi');
  ok(openArgs.url === 'blob:mock-url', 'Blob URL bilan ochildi (noopener-null bug tuzatildi)');
  ok(openArgs.target === '_blank', 'target=_blank');
  ok(lastBlob && lastBlob.size > 100, 'Blob mazmuni bor (size=' + (lastBlob && lastBlob.size) + ')');

  // Fallback: window.open null qaytarsa anchor click
  openArgs = null;
  let clickedHref = null;
  const origClick = w.HTMLAnchorElement.prototype.click;
  w.HTMLAnchorElement.prototype.click = function () { clickedHref = this.getAttribute('href'); };
  w.open = () => null;
  w.openInBrowser();
  w.HTMLAnchorElement.prototype.click = origClick;
  ok(clickedHref === 'blob:mock-url', 'popup bloklanganda Blob URL anchor fallback ishladi');
}

console.log('\n================= TEST 9: DUPLICATE RUN HIMOYASI (RC5) =================');
{
  let runs = 0;
  const origRun = w.executeCombinedCode;
  w.executeCombinedCode = function () { runs++; };
  doc.getElementById('page-coding').classList.add('active'); // window handler faqat coding sahifada ishlaydi
  w.bindCodingIdeEvents();

  const jsEd = doc.getElementById('jsEditor');
  jsEd.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true, cancelable: true }));
  ok(runs === 1, 'editor ichida Ctrl+Enter -> Run aynan 1 marta (real: ' + runs + ')');

  runs = 0;
  doc.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true, cancelable: true }));
  ok(runs === 1, 'editor tashqarisida Ctrl+Enter -> Run aynan 1 marta (real: ' + runs + ')');
  w.executeCombinedCode = origRun;
}

console.log('\n================= TEST 10: LINE NUMBERS + HIGHLIGHT SYNC =================');
{
  const htmlEd = doc.getElementById('htmlEditor');
  const gutter = doc.getElementById('htmlLineNumbers');
  htmlEd.value = 'a\nb\nc';
  w.updateLineNumbersFor('htmlEditor', 'htmlLineNumbers');
  ok(gutter.textContent.replace(/\s/g, '') === '123', '3 qator -> 1/2/3 raqamlari');

  const before = gutter.innerHTML;
  w.updateLineNumbersFor('htmlEditor', 'htmlLineNumbers');
  ok(gutter.innerHTML === before, "qator soni o'zgarmasa rebuild qilinmaydi (RC6 cache)");

  htmlEd.value += '\nd\ne';
  w.updateLineNumbersFor('htmlEditor', 'htmlLineNumbers');
  ok(gutter.textContent.replace(/\s/g, '') === '12345', '5 qator -> yangilandi');

  const hl = doc.getElementById('htmlHighlight');
  htmlEd.value = '<p>salom</p>';
  w.syncEditorHighlight('html');
  ok(hl.innerHTML.includes('<span class="token-html-tag">'), "syncEditorHighlight innerHTML to'ldiradi");
  ok(hl.scrollTop === htmlEd.scrollTop, 'scroll sync');
  ok(doc.createElement('div').innerHTML !== undefined && (() => { const d = doc.createElement('div'); d.innerHTML = hl.innerHTML; return d.textContent === '<p>salom</p>'; })(), 'highlight round-trip aynan raw');
}

console.log('\n================= TEST 11: NATIVE TIL — REAL EXECUTION ROUTING (FAKE RESULT YO\'Q) =================');
{
  const sel = doc.getElementById('codingLangSelect');
  sel.value = 'python';
  doc.getElementById('htmlEditor').value = '';
  doc.getElementById('cssEditor').value = '';
  doc.getElementById('jsEditor').value = '';

  // 11a) dispatch: non-web executeCombinedCode ni runNativeLanguage ga yo'naltiradi
  let routedTo = null;
  const origRunNative = w.runNativeLanguage;
  w.runNativeLanguage = function (lang) { routedTo = lang; };
  w.executeCombinedCode();
  ok(routedTo === 'python', 'executeCombinedCode python ni runNativeLanguage ga yo\'naltiradi (real: ' + routedTo + ')');
  w.runNativeLanguage = origRunNative;

  // 11b) preview placeholder real executor haqida halol xabar beradi (fake output emas)
  w.showCodingRuntimePlaceholder('python');
  const notice = doc.getElementById('codingIframe').getAttribute('srcdoc') || '';
  ok(notice.includes('real executor Worker ichida ishlaydi'), 'preview placeholder real-executor ko\'rsatadi');
  ok(!notice.includes('Program ready') && !notice.includes('Query ready'), "FAKE result matni YO'Q");
  ok(!notice.includes('successfully'), 'fake "successfully" YO\'Q');
  ok(!notice.includes('mavjud emas'), 'eski "execution unavailable" o\'rniga real-runtime placeholder');

  // 11c) jsdom'da Worker yo'q — createCodingWorker null qaytaradi (real Worker fayllari dist'da alohida tekshiriladi)
  ok(w.createCodingWorker('python') === null, 'Worker mavjud bo\'lmaganda createCodingWorker null qaytaradi');
  ok(w.createCodingWorker('cpp') === null, 'cpp Worker ham null (jsdom)');
}

console.log('\n================= TEST 12: INTERCEPTOR REAL IJRO (console + error line mapping) =================');
{
  const sel = doc.getElementById('codingLangSelect');
  sel.value = 'web';
  doc.getElementById('htmlEditor').value = '<h1 id="title">Salom</h1>';
  doc.getElementById('cssEditor').value = '#title { color:red; }';
  const userJs = 'console.log("Hello");\nconsole.warn("Warning");\nconsole.error("Error");';
  doc.getElementById('jsEditor').value = userJs;
  w.executeCombinedCode();

  const docStr = doc.getElementById('codingIframe').getAttribute('srcdoc') || '';
  // Barcha <script> bloklari sintaktik toza bo'lishi kerak
  const scriptBodies = [];
  const sre = /<script>([\s\S]*?)<\/script>/g;
  let sm2;
  while ((sm2 = sre.exec(docStr)) !== null) scriptBodies.push(sm2[1]);
  ok(scriptBodies.length >= 2, 'srcdoc ichida interceptor + user script bloklari bor (' + scriptBodies.length + ')');
  let allParse = true;
  for (const body of scriptBodies) {
    try { new Function(body); } catch (e) { allParse = false; console.log('     parse xato: ' + e.message); }
  }
  ok(allParse, 'generatsiya qilingan barcha script bloklari sintaktik valid');

  // Interceptor'ni fake muhitda REAL ishga tushirish
  const received = [];
  const fakeWindow = { parent: { postMessage: (msg) => received.push(msg) }, __js_line_offset: 85 };
  const fakeConsole = { log() {}, warn() {}, error() {}, info() {} };
  const interceptorBody = scriptBodies[0];
  new Function('window', 'console', interceptorBody)(fakeWindow, fakeConsole);

  fakeConsole.log('Hello');
  fakeConsole.warn('Warning');
  fakeConsole.error('Error');
  const types = received.filter(r => r.type === 'IDE_CONSOLE_LOG').map(r => r.logType);
  ok(types.join(',') === 'log,warn,error', '3 xil console log turi postMessage bilan yuborildi (real: ' + types.join(',') + ')');
  ok(received.some(r => r.type === 'IDE_CONSOLE_LOG' && r.message === 'Hello'), "console.log('Hello') matni aniq uzatildi");

  // Object readable formatda:
  fakeConsole.log({ a: 1, b: 'x' });
  const objMsg = received.filter(r => r.type === 'IDE_CONSOLE_LOG').pop();
  ok(objMsg.message.includes('"a"') && objMsg.message.includes('1'), 'object readable JSON formatda');

  // TEST 3 semantikasi: 3-qatordagi xato -> reported 88 -> user line 3
  const refErr = new ReferenceError('notDefined is not defined');
  fakeWindow.onerror('Uncaught ' + refErr.message, 'about:srcdoc', 88, 5, refErr);
  const errPost = received.filter(r => r.type === 'IDE_RUNTIME_ERROR').pop();
  ok(!!errPost && errPost.errorType === 'ReferenceError', 'ReferenceError turi aniq ushlandi');
  ok(!!errPost && errPost.line === 3, 'Satr USER qatoriga maplandi: reported 88 - offset 85 = 3 (real: ' + (errPost && errPost.line) + ')');
  ok(!!errPost && errPost.col === 5, 'Ustun ham uzatildi (real: ' + (errPost && errPost.col) + ')');

  // Unhandled promise rejection
  const rejReason = new TypeError('x is not a function');
  fakeWindow.onunhandledrejection({ reason: rejReason });
  const rejPost = received.filter(r => r.type === 'IDE_RUNTIME_ERROR').pop();
  ok(!!rejPost && rejPost.errorType === 'TypeError', 'Unhandled Promise Rejection (TypeError) ushlandi');
}

console.log('\n================= TEST 13: WRAP=OFF + DESIGN SAQLANGAN =================');
{
  const textareas = Array.from(doc.querySelectorAll('textarea.code-textarea'));
  ok(textareas.length === 8, '8 ta code-textarea bor');
  ok(textareas.every(t => t.getAttribute('wrap') === 'off'), 'hammasida wrap="off" (soft-wrap alignment tuzatildi)');
  ok(textareas.every(t => t.classList.contains('code-textarea')), 'classlar saqlangan (dizayn buzilmagan)');
  ok(!!doc.querySelector('#editor-view-html #htmlHighlight.editor-highlight'), 'editor-highlight arxitekturasi saqlangan');
  const cssSrc = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  ok(cssSrc.includes('.code-textarea::placeholder'), 'placeholder rangi qoshilgan (RC7)');
  ok(cssSrc.includes('.token-css-number'), 'token-css-number rangi qoshilgan');
}

console.log('\n=========================================');
console.log('NATIJA: ' + passed + ' PASS, ' + failed + ' FAIL');
process.exit(failed === 0 ? 0 : 1);



