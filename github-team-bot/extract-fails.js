'use strict';
const fs = require('fs');
const t = fs.readFileSync('test-out.log', 'utf8').replace(/\u0000/g, '');
const lines = t.split(/\r?\n/);
let cap = false;
const out = [];
for (const l of lines) {
  if (/^not ok/.test(l.trim())) { cap = true; out.push('FAIL: ' + l.trim().slice(0, 90)); }
  else if (cap && /message:|error:|expected:|actual:|assert\.ok/.test(l)) { out.push('    ' + l.trim().slice(0, 110)); }
  else if (cap && /^ok /.test(l.trim())) { cap = false; }
  else if (cap && /^$/.test(l.trim())) { cap = false; }
}
fs.writeFileSync('fail-list.txt', out.join('\n'));
