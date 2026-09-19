/* Serverni background'da ishga tushirish uchun yordamchi */
const { spawn } = require('child_process');
const http = require('http');

const srv = spawn('node', ['server/server.cjs'], { cwd: 'c:/Users/USTAFON/Desktop/aaaayti', stdio: 'inherit' });

setTimeout(() => {
  http.get('http://127.0.0.1:3000/api/tests/questions?subject=Python', res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      try {
        const arr = JSON.parse(body);
        console.log('STATUS:', res.statusCode, 'COUNT:', Array.isArray(arr) ? arr.length : 'NOT ARRAY');
        console.log('SAMPLE:', JSON.stringify(arr[0]));
      } catch (e) { console.log('PARSE ERR:', e.message, body.slice(0, 300)); }
      srv.kill();
      process.exit(0);
    });
  }).on('error', e => { console.log('HTTP ERR:', e.message); srv.kill(); process.exit(1); });
}, 2500);