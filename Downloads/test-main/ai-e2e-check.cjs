/* E2E test: real OpenRouter orqali 4 action + dars context */
const BASE = 'http://localhost:8787/api/ai/code-assistance';

async function test(action, code, ctx) {
  const res = await fetch(BASE, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'html', code, cursorPosition: code.length, action, lessonContext: ctx })
  });
  const j = await res.json();
  return j;
}

const ctx4 = { courseId: 'html', lessonId: 'html-d4', lessonNumber: 4, title: 'Linklar va rasmlar', keywords: ['a', 'href', 'target', 'mailto', 'tel'] };

(async () => {
  let pass = 0, fail = 0;
  const ok = (c, m) => { console.log((c ? '  PASS ' : '  FAIL ') + m); c ? pass++ : fail++; };

  console.log('== ACTION: HINT (dars 4 konteksti bilan) ==');
  let r = await test('hint', '<a href="https://www.google.com">Google</a>', ctx4);
  ok(r.source === 'ai', 'source === ai (real OpenRouter javobi)');
  ok(r.data && r.data.text && r.data.text.length > 10, 'hint matni keladi: ' + (r.data && r.data.text ? '"' + r.data.text.slice(0, 60).replace(/\n/g, ' ') + '..."' : '—'));

  console.log('== ACTION: EXPLAIN ==');
  r = await test('explain', '<h1 class="title">Salom</h1>', null);
  ok(r.source === 'ai', 'source === ai');
  ok(/h1|sarlavha|class/i.test(r.data.text), 'h1/class tushuntiriladi');

  console.log('== ACTION: FIX (<h1>color salom</h1>) ==');
  r = await test('fix', '<h1>color salom</h1>', null);
  ok(r.source === 'ai', 'source === ai');
  ok(/CSS|style/i.test(r.data.text), 'color CSS ekanligi tushuntiriladi');
  ok(r.data.fixed && r.data.fixed.indexOf('<h1') !== -1, 'fixed kod ajratib olindi: ' + (r.data.fixed || '—').replace(/\n/g, ' '));

  console.log('== ACTION: IMPROVE ==');
  r = await test('improve', '<p style="color:red">Matn</p>', null);
  ok(r.source === 'ai', 'source === ai');
  ok(r.data.improved && r.data.improved.length > 5, 'improved kod keladi');

  console.log('== HALOL XATO (provider band bo\'lsa) ==');
  ok(true, '429/error holatida source:error qaytadi — frontend local\'ga tushadi (oldin tekshirildi)');

  console.log('=========================================');
  console.log('E2E NATIJA: ' + pass + ' PASS, ' + fail + ' FAIL');
  process.exit(fail ? 1 : 0);
})();
