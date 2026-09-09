/* AI assistant functional check (jsdom) */
const { JSDOM } = require('jsdom');
const fs = require('fs');

const dom = new JSDOM('<!DOCTYPE html><html><body><textarea id="htmlEditor"></textarea><textarea id="cssEditor"></textarea><textarea id="jsEditor"></textarea><div id="page-coding"><button id="aiPanelToggle"></button><aside id="aiPanel"><button class="ai-panel-close"></button><div class="ai-panel-out"></div></aside></div></body></html>', { runScripts: 'outside-only', url: 'http://localhost/' });
const w = dom.window;
w.document.querySelectorAll('textarea').forEach(t => {
  ['clientWidth', 'clientHeight', 'scrollLeft', 'scrollTop', 'selectionStart', 'selectionEnd'].forEach(p => { if (p === 'clientWidth' || p === 'clientHeight') t[p] = 300; else t[p] = 0; });
});
const code = fs.readFileSync('ai-assistant.js', 'utf8');
w.eval(code);
const AI = w.ITTestAI;
let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  PASS', msg); } else { fail++; console.log('  FAIL', msg); } }

console.log('== HTML TAG SUGGESTIONS ==');
const htmlEd = w.document.getElementById('htmlEditor');
htmlEd.value = '<h';
const html = AI.getSuggestions(htmlEd, 'html');
ok(html.ctx && html.ctx.kind === 'html-tag', 'kontekst: html-tag');
ok(html.items.some(i => i.name === 'h1') && html.items.some(i => i.name === 'header'), 'h1/header topiladi');
ok(html.items[0].name === 'h1', 'birinchi: h1');
ok(html.items[0].insert === '<h1>|</h1>', 'snippet <h1>|</h1>');

htmlEd.value = '<img s';
const img = AI.getSuggestions(htmlEd, 'html');
ok(img.items.some(i => i.name === 'src'), 'img + s => src');
htmlEd.value = '<img ';
const imgAll = AI.getSuggestions(htmlEd, 'html');
ok(imgAll.items.some(i => i.name === 'alt') && imgAll.items.some(i => i.name === 'src'), 'img attrs: src/alt');
ok(imgAll.items[0].name === 'src', 'img birinchi attr: src');

htmlEd.value = '<a h';
ok(AI.getSuggestions(htmlEd, 'html').items.some(i => i.name === 'href'), 'a + h => href');
htmlEd.value = '<button i';
ok(AI.getSuggestions(htmlEd, 'html').items.some(i => i.name === 'id'), 'button + i => id');
htmlEd.value = '<div c';
ok(AI.getSuggestions(htmlEd, 'html').items.some(i => i.name === 'class'), 'div + c => class');
htmlEd.value = '<h1 style="';
const styleCtx = AI.getSuggestions(htmlEd, 'html');
ok(styleCtx.ctx && styleCtx.ctx.kind === 'css' && styleCtx.items.some(i => i.name === 'color'), 'style=" => CSS props (color)');

console.log('== CSS ==');
const cssEd = w.document.getElementById('cssEditor');
cssEd.value = '.box {\n  col';
const css = AI.getSuggestions(cssEd, 'css');
ok(css.items.some(i => i.name === 'color'), 'col => color');
cssEd.value = '.box {\n  margin';
ok(AI.getSuggestions(cssEd, 'css').items.some(i => i.name === 'margin'), 'margin');
cssEd.value = 'a:h';
const pseudo = AI.getSuggestions(cssEd, 'css');
ok(pseudo.ctx && pseudo.ctx.kind === 'css-pseudo' && pseudo.items.some(i => i.name === ':hover'), 'a:h => :hover');
ok(pseudo.items.find(i => i.name === ':hover').desc.length > 5, ':hover izoh bor');

console.log('== JS ==');
const jsEd = w.document.getElementById('jsEditor');
jsEd.value = 'con';
ok(AI.getSuggestions(jsEd, 'js').items.some(i => i.name === 'console.log'), 'con => console.log');
jsEd.value = 'aler';
const al = AI.getSuggestions(jsEd, 'js');
ok(al.items.some(i => i.name === 'alert'), 'aler => alert');
ok(al.items.find(i => i.name === 'alert').insert === 'alert(|);', 'alert snippet alert(|);');

console.log('== LESSON CONTEXT ==');
AI.setLessonContext({ courseId: 'html', lessonId: 'html-d4', keywords: ['a', 'href', 'target', 'mailto', 'tel'] });
htmlEd.value = '<a ';
const aCtx = AI.getSuggestions(htmlEd, 'html');
ok(aCtx.items[0].name === 'href', 'lesson 4: <a> da birinchi attr href');
htmlEd.value = '<a href="';
const hrefVals = AI.getSuggestions(htmlEd, 'html');
ok(hrefVals.items.some(i => i.name === 'mailto:'), 'lesson 4: mailto: qiymat');
ok(hrefVals.items.some(i => i.name === 'tel:'), 'lesson 4: tel: qiymat');
AI.setLessonContext(null);

console.log('== DEBUG lesson4 ==');
AI.setLessonContext({ courseId: 'html', lessonId: 'html-d4', keywords: ['a', 'href', 'target', 'mailto', 'tel'] });
const ta2 = w.document.createElement('textarea');
ta2.value = '<a ';
Object.defineProperty(ta2, 'selectionStart', { value: 3 });
Object.defineProperty(ta2, 'selectionEnd', { value: 3 });
const dbg = AI.getSuggestions(ta2, 'html');
console.log('ctx:', JSON.stringify(dbg.ctx));
console.log(dbg.items.map(i => i.name + '[' + i.desc + ']').join(' | '));
AI.setLessonContext(null);

console.log('== TUTOR ==');
const expl = AI.explainCode('<h1 class="title">Salom</h1>', 'html');
ok(/katta sarlavha/.test(expl) || /sarlavha/.test(expl), 'explain: h1 izohi');
ok(/class/.test(expl), 'explain: class izohi');

const iss1 = AI.findIssues('<h1 color="red">Ahatjon</h1>', 'html');
ok(iss1.length > 0 && iss1[0].fix && iss1[0].fix.indexOf('style="color: red"') !== -1, 'xato: color attr => style fix');

const iss2 = AI.findIssues('<h1>color salom</h1>', 'html');
ok(iss2.length > 0 && /CSS/.test(iss2[0].reason), 'xato: color matn ichida => CSS tushuntirildi');

const ex = { id: 'test', instruction: 'Google saytiga link yarating https://www.google.com', checks: [{ re: '<a\\b[^>]*href', msg: 'link yozing' }, { re: 'google', msg: 'google manzili' }] };
const h1 = AI.buildHints(ex);
ok(/1-HINT/.test(h1), 'hint stage 1');
aiHintStageShared();
function aiHintStageShared() {
  const AI2 = w.ITTestAI;
  const exObj = { id: 'test', instruction: '', checks: [{ re: '<a\\b', msg: 'x' }] };
  const s2 = AI2.buildHints(exObj); // stage oshirish panel orqali, shu yerda simulyatsiya
  ok(typeof s2 === 'string', 'hint string qaytaradi');
}
const ns = AI.nextStep(ex, '<a href="https://www.google.com">G</a>');
ok(/RUN/.test(ns) || /bajarilgan/.test(ns), 'nextStep: hammasi bajarilganda RUN');

console.log('== AI BACKEND HALOLIGI (local rejim) ==');
AI.getCodeAssistance({ action: 'improve' }).then(res => {
  ok(res.source === 'none' && res.message === 'No AI backend connected', 'endpoint yo\'q => source:"none", fetch chaqirilmaydi (fake YO\'Q)');

  console.log('== YANGI SNIPPET TEKSHIRUVLARI ==');
  const cssEd2 = w.document.getElementById('cssEditor');
  cssEd2.value = '.x {\n  fon';
  ok(AI.getSuggestions(cssEd2, 'css').items.some(i => i.name === 'background'), 'fon => background (alias)');
  cssEd2.value = '.x {\n  mar';
  ok(AI.getSuggestions(cssEd2, 'css').items.some(i => i.name === 'margin'), 'mar => margin');
  cssEd2.value = '.x {\n  pad';
  ok(AI.getSuggestions(cssEd2, 'css').items.some(i => i.name === 'padding'), 'pad => padding');
  jsEd.value = 'fun';
  ok(AI.getSuggestions(jsEd, 'js').items.some(i => i.name === 'function'), 'fun => function');
  jsEd.value = 'if';
  ok(AI.getSuggestions(jsEd, 'js').items.some(i => i.name === 'if'), 'if => if');
  jsEd.value = 'for';
  ok(AI.getSuggestions(jsEd, 'js').items.some(i => i.name === 'for'), 'for => for');
  htmlEd.value = '<p';
  ok(AI.getSuggestions(htmlEd, 'html').items.some(i => i.name === 'p' && i.insert === '<p>|</p>'), 'p => <p></p>');
  htmlEd.value = '<button ';
  ok(AI.getSuggestions(htmlEd, 'html').items.slice().map(i => i.name).join(',').indexOf('id') === 0, 'button attrs: id birinchi');

  console.log('== CODING PANEL BIND ==');
  AI.bindCodingPanel();
  ok(typeof AI.bindCodingPanel === 'function', 'bindCodingPanel xatosiz');

  console.log('=========================================');
  console.log('NATIJA: ' + pass + ' PASS, ' + fail + ' FAIL');
  process.exit(fail ? 1 : 0);
});
