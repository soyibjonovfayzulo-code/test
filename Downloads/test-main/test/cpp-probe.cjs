const J = require('JSCPP');

// std:: desugaring (string literal'larni buzmasdan)
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

// 1) desugar test — user'ning aynan kodi
const userCode = '#include <iostream>\nint main() {\n    std::cout << "Hello C++";\n    return 0;\n}';
let o = '';
try { const ec = J.run(desugarStd(userCode), '', { stdio: { write: s => { o += s; } } }); console.log('desugar-hello => OK out=' + JSON.stringify(o) + ' exit=' + ec); }
catch (e) { console.log('desugar-hello => FAIL ' + String(e.message).split('\n')[0].slice(0, 120)); }

// 2) string ichida std:: bo'lsa buzilmasligi
const strCode = '#include <iostream>\nusing namespace std;\nint main(){ cout << "std::cout literal" << endl; return 0; }';
o = '';
try { J.run(strCode, '', { stdio: { write: s => { o += s; } } }); console.log('literal-safe => OK out=' + JSON.stringify(o)); }
catch (e) { console.log('literal-safe => FAIL ' + String(e.message).split('\n')[0].slice(0, 120)); }

// 3) runtime error shape (line info?)
const probes = {
  'div-zero': '#include <iostream>\nusing namespace std;\nint main(){ int a = 0; cout << 5 / a << endl; return 0; }',
  'bad-ident': '#include <iostream>\nusing namespace std;\nint main(){ cout << yyy << endl; return 0; }',
  'missing-semi': '#include <iostream>\nusing namespace std;\nint main(){ int a = 5 cout << a; return 0; }'
};
for (const k in probes) {
  try { J.run(probes[k], '', { stdio: { write: () => {} } }); console.log(k + ' => OK (xato yo\'q)'); }
  catch (e) {
    const msg = String(e.message || e);
    console.log(k + ' => ERR line=' + (e.line || e.lineNumber || null) + ' msg=' + JSON.stringify(msg.split('\n').slice(0, 2).join(' | ').slice(0, 150)));
  }
}
