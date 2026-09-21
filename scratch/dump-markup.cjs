const fs = require('fs');
const h = fs.readFileSync('c:/Users/USTAFON/Desktop/aaaayti/index.html', 'utf8');
const dump = (id, len) => {
  const i = h.indexOf(`id="${id}"`);
  console.log(`\n===== ${id} (idx ${i}) =====`);
  console.log(h.slice(i - 40, i + len));
};
dump('page-test', 3600);
dump('page-result', 3200);
dump('startTestModal', 1400);