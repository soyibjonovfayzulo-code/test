const JSCPP = require('JSCPP');
function desugarStd(source) {
  const segments = String(source || '').split(/("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')/g);
  for (let i = 0; i < segments.length; i += 2) segments[i] = segments[i].replace(/std::(?=[A-Za-z_])/g, '');
  let out = segments.join('');
  if (!/using\s+namespace\s+std\s*;/.test(out)) out = out.replace(/^[^\n]*/, m => m + ' using namespace std;');
  return out;
}
const probes = {
  'int-main-return': '#include <iostream>\nusing namespace std;\nint main(){ int n; cin >> n; cout << n * 3; return 0; }',
  'for-cin-return': '#include <iostream>\nusing namespace std;\nint main(){ int n; cin >> n; for(int i=1;i<=n;i++) cout << i << " "; return 0; }',
  'string-cin-return': '#include <iostream>\n#include <string>\nusing namespace std;\nint main(){ string s; cin >> s; cout << "Salom " << s; return 0; }',
  'user-test': '#include <iostream>\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    std::cout << a + b;\n    return 0;\n}'
};
for (const k in probes) {
  let out = ''; let errText = '';
  try { const ec = JSCPP.run(desugarStd(probes[k]), k === 'string-cin-return' ? 'Ali\n' : (k === 'user-test' ? '5 7\n' : '4\n'), { stdio: { write: s => { out += s; }, error: s => { errText += s; } } }); console.log(k + ' => OK out=' + JSON.stringify(out.trim()) + ' exit=' + ec); }
  catch (e) { console.log(k + ' => ERR ' + String(e.message || e).split('\n')[0].slice(0, 140)); }
}
