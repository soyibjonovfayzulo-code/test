const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, raw: data }); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== /api/health ===');
  const h = await get('http://localhost:3000/api/health');
  console.log('Status:', h.status, JSON.stringify(h.body));

  console.log('\n=== /api/tests/questions count ===');
  const t = await get('http://localhost:3000/api/tests/questions');
  console.log('Status:', t.status, 'Total rows:', t.body.length);
  const groups = {};
  t.body.forEach((r) => {
    const k = (r.subject || '') + '|' + (r.difficulty || '');
    groups[k] = (groups[k] || 0) + 1;
  });
  Object.keys(groups).sort().forEach((k) => {
    const [s, d] = k.split('|');
    console.log('  ', s.padEnd(12), d.padEnd(12), '×', groups[k]);
  });

  console.log('\n=== /api/courses count ===');
  const c = await get('http://localhost:3000/api/courses');
  console.log('Status:', c.status, 'Courses:', c.body.length);
  c.body.forEach((crs) => {
    const tc = Array.isArray(crs.topics) ? crs.topics.length : 0;
    console.log('  -', crs.id.padEnd(14), crs.name.padEnd(14), 'topics:', tc);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
