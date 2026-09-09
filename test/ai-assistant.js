/* ============================================================
   ITTest — AI Coding Assistant (LOCAL smart assistant + AI tutor abstraction)
   - Autocomplete/snippets FULLY LOCAL (har keypress'da network yo'q)
   - AI request FAQAT button action orqali, agar backend sozlangan bo'lsa
   - API key frontendga YOZILMAYDI. Backend yo'q bo'lsa — halol
     "AI backend ulanmagan" holati ko'rsatiladi (fake AI YO'Q).
   - RAW source code saqlanadi: insert FAQAT textarea value orqali.
   - Ctrl+Z: insert document.execCommand('insertText') orqali — undo ishlaydi.
   ============================================================ */

const TAG_DOCS = {
  h1: 'Asosiy sarlavha', h2: 'Sarlavha', h3: 'Kichik sarlavha', h4: 'Kichik sarlavha',
  p: 'Paragraf (matn bloki)', div: 'Blok konteyner', span: 'Qator ichi konteyner',
  section: 'Bo\'lim', header: 'Sahifa headeri', footer: 'Sahifa pastki qismi',
  nav: 'Menyu / navigatsiya', main: 'Asosiy kontent', button: 'Bosiladigan tugma',
  img: 'Rasm', a: 'Link (boshqa sahifaga olib boradi)', ul: 'Tartibsiz ro\'yxat',
  ol: 'Tartibli ro\'yxat', li: 'Ro\'yxat elementi', form: 'Forma (inputlar to\'plami)',
  input: 'Kiritish maydoni', label: 'Maydon yorlig\'i', textarea: 'Ko\'p qatorli matn maydoni',
  select: 'Tanlash ro\'yxati', option: 'Tanlash varianti', table: 'Jadval', tr: 'Jadval qatori',
  td: 'Jadval katakchasi', th: 'Jadval sarlavha katakchasi', title: 'Tab nomi',
  head: 'Hujjat head qismi', body: 'Hujjat body qismi', html: 'Hujjat ildizi',
  style: 'CSS stillar', script: 'JavaScript kodi', br: 'Yangi qator', hr: 'Gorizontal chiziq',
  strong: 'Muhim matn (qalin)', em: 'Urg\'u (yim)', video: 'Video', audio: 'Audio'
};

const TAG_SNIPPETS = {
  h1: '<h1>|</h1>', h2: '<h2>|</h2>', h3: '<h3>|</h3>', h4: '<h4>|</h4>',
  p: '<p>|</p>', div: '<div>|</div>', span: '<span>|</span>',
  section: '<section>|</section>', header: '<header>|</header>', footer: '<footer>|</footer>',
  nav: '<nav>|</nav>', main: '<main>|</main>', button: '<button>|</button>',
  img: '<img src="|" alt="">', a: '<a href="|"></a>',
  ul: '<ul>\n  <li>|</li>\n</ul>', ol: '<ol>\n  <li>|</li>\n</ol>', li: '<li>|</li>',
  form: '<form>|</form>', input: '<input type="|" placeholder="">',
  label: '<label for="">|</label>', textarea: '<textarea></textarea>',
  select: '<select>\n  <option>|</option>\n</select>', option: '<option>|</option>',
  table: '<table>\n  <tr>\n    <td>|</td>\n  </tr>\n</table>',
  tr: '<tr>\n  <td>|</td>\n</tr>', td: '<td>|</td>', th: '<th>|</th>',
  title: '<title>|</title>', head: '<head>\n  |</head>', body: '<body>\n  |</body>',
  html: '<html>\n  |</html>', style: '<style>\n  |\n</style>', script: '<script>\n  |\n</script>',
  strong: '<strong>|</strong>', em: '<em>|</em>', br: '<br>', hr: '<hr>',
  video: '<video src="|" controls></video>', audio: '<audio src="|" controls></audio>'
};

const ATTR_DOCS = {
  src: 'Rasm/media manzili', alt: 'Rasm tavsifi (yuklanmasa ko\'rinadi)',
  href: 'Link manzili', target: 'Qayerda ochilishi (_blank = yangi oyna)',
  class: 'Elementga CSS guruh nomi beradi', id: 'Elementning o\'ziga xos nomi',
  title: 'Qo\'shimcha qisqa izoh (tooltip)', type: 'Input/input turi',
  placeholder: 'Bo\'sh maydondagi ko\'rsatma matn', value: 'Qiymat',
  name: 'Forma maydoni nomi', onclick: 'Element bosilganda ishlaydi',
  style: 'Elementga to\'g\'ridan-to\'g\'ri CSS beradi', for: 'Label bog\'lanadigan maydon',
  controls: 'Play/pause boshqaruvlari', disabled: 'Elementni o\'chiradi',
  required: 'To\'ldirilishi shart', width: 'Kenglik', height: 'Balandlik'
};

const TAG_ATTRS = {
  img: ['src', 'alt', 'title', 'width', 'height', 'class', 'id'],
  a: ['href', 'target', 'title', 'class', 'id'],
  input: ['type', 'placeholder', 'value', 'name', 'id', 'required', 'class'],
  button: ['id', 'class', 'onclick', 'type', 'disabled'],
  form: ['action', 'method', 'id', 'class'],
  label: ['for', 'class'], select: ['id', 'name', 'class'], option: ['value', 'selected'],
  video: ['src', 'controls', 'width', 'class'], audio: ['src', 'controls'],
  textarea: ['id', 'name', 'placeholder', 'rows', 'class']
};
const GLOBAL_ATTRS = ['class', 'id', 'title', 'style', 'onclick', 'hidden'];

const CSS_PROPS = [
  ['color', 'Matn rangini o\'zgartiradi'], ['background', 'Orqa fonni o\'zgartiradi'],
  ['background-color', 'Orqa fon rangi'], ['font-size', 'Matn o\'lchami'],
  ['font-weight', 'Matn qalinligi'], ['font-family', 'Shrift turi'],
  ['margin', 'Tashqi bo\'sh joy'], ['padding', 'Ichki bo\'sh joy'],
  ['width', 'Element kengligi'], ['height', 'Element balandligi'],
  ['border', 'Chegara chizig\'i'], ['border-radius', 'Burchaklarni yumshatadi'],
  ['display', 'Element qanday joylashishini belgilaydi'],
  ['position', 'Element joylashuv rejimi'], ['top', 'Yuqoridan masofa (position bilan)'],
  ['right', 'O\'ngdan masofa'], ['bottom', 'Pastdan masofa'], ['left', 'Chapdan masofa'],
  ['text-align', 'Matnni tekislaydi'], ['text-decoration', 'Matn bezagi (tagiga chizish va h.k.)'],
  ['opacity', 'Shaffoflik (0–1)'], ['box-shadow', 'Soya effekti'],
  ['flex', 'Flexbox element o\'lchami'], ['justify-content', 'Flex: gorizontal taqsimlash'],
  ['align-items', 'Flex: vertikal taqsimlash'], ['gap', 'Elementlar orasidagi bo\'sh joy'],
  ['cursor', 'Sichqoncha kursor ko\'rinishi'], ['transition', 'O\'zgarishni silliq qiladi'],
  ['transform', 'Elementni buradi/ko\'chiradi'], ['overflow', 'Toshib ketganda xatti-harakat']
];

const PSEUDO_DOCS = {
  ':hover': 'Sichqoncha element ustiga kelgandagi holat',
  ':focus': 'Element fokuslanganda (masalan input bosilganda)',
  ':active': 'Element bosilgan paytdagi holat',
  ':first-child': 'Ota elementning birinchi bolasi',
  ':last-child': 'Ota elementning oxirgi bolasi',
  '::before': 'Element oldiga qo\'shimcha kontent',
  '::after': 'Element orqasiga qo\'shimcha kontent'
};

const JS_SUGGESTIONS = [
  ['console.log', 'ma\'lumotni console oynasiga chiqaradi', 'console.log(|);'],
  ['alert', 'kichik xabar oynasini chiqaradi', 'alert(|);'],
  ['if', 'shart: agar ... bo\'lsa', 'if (|) {\n  \n}'],
  ['else', 'shart bajarilmasa', 'else {\n  |\n}'],
  ['for', 'takrorlash sikli', 'for (let i = 0; i < |; i++) {\n  \n}'],
  ['while', 'shart to\'g\'ri bo\'lganda takrorlaydi', 'while (|) {\n  \n}'],
  ['function', 'funksiya yaratadi', 'function name() {\n  |\n}'],
  ['const', 'o\'zgarmas o\'zgaruvchi', 'const | = ;'],
  ['let', 'o\'zgaruvchan o\'zgaruvchi', 'let | = ;'],
  ['var', 'eski uslubdagi o\'zgaruvchi', 'var | = ;'],
  ['addEventListener', 'hodisa (click va h.k.) tinglaydi', 'addEventListener("|", () => {\n  |\n});'],
  ['document.querySelector', 'HTML elementni tanlaydi', 'document.querySelector("|")'],
  ['getElementById', 'id bo\'yicha element tanlaydi', 'document.getElementById("|")'],
  ['return', 'funksiyadan qiymat qaytaradi', 'return |;'],
  ['querySelectorAll', 'barcha mos elementlarni tanlaydi', 'document.querySelectorAll("|")']
];

const PY_SUGGESTIONS = [
  ['print', 'Natijani chiqaradi', 'print(|)'],
  ['if', 'Shart', 'if |:\n    '],
  ['elif', 'Boshqa shart', 'elif |:\n    '],
  ['else', 'Shart bajarilmasa', 'else:\n    |'],
  ['for', 'Sikl', 'for i in range(|):\n    '],
  ['while', 'Shartli sikl', 'while |:\n    '],
  ['def', 'Funksiya yaratadi', 'def name():\n    |'],
  ['return', 'Qiymat qaytaradi', 'return |'],
  ['input', 'Foydalanuvchidan kiritish', 'input("|")'],
  ['len', 'Uzunlikni oladi', 'len(|)'],
  ['range', 'Sonlar diapazoni', 'range(|)'],
  ['int', 'Butun songa o\'tkazadi', 'int(|)'],
  ['str', 'Matnga o\'tkazadi', 'str(|)'],
  ['import', 'Kutubxona ulash', 'import |']
];
const JAVA_SUGGESTIONS = [
  ['System.out.println', 'Natijani chiqaradi', 'System.out.println(|);'],
  ['main', 'Programma kirish nuqtasi', 'public static void main(String[] args) {\n    |\n}'],
  ['for', 'Sikl', 'for (int i = 0; i < |; i++) {\n    \n}'],
  ['while', 'Shartli sikl', 'while (|) {\n    \n}'],
  ['if', 'Shart', 'if (|) {\n    \n}'],
  ['else', 'Aks holda', 'else {\n    |\n}'],
  ['int', 'Butun son tipi', 'int | = 0;'],
  ['String', 'Matn tipi', 'String | = "";'],
  ['new', 'Yangi obyekt yaratadi', 'new |'],
  ['return', 'Qiymat qaytaradi', 'return |;']
];
const CPP_SUGGESTIONS = [
  ['cout', 'Natijani chiqaradi', 'cout << | << endl;'],
  ['cin', 'Kiritish oladi', 'cin >> |;'],
  ['iostream', 'Kutubxona ulash', '#include <iostream>'],
  ['int main', 'Kirish nuqtasi', 'int main() {\n    |\n    return 0;\n}'],
  ['for', 'Sikl', 'for (int i = 0; i < |; i++) {\n    \n}'],
  ['if', 'Shart', 'if (|) {\n    \n}'],
  ['else', 'Aks holda', 'else {\n    |\n}'],
  ['vector', 'Dinamik massiv', 'vector<int> |;'],
  ['string', 'Matn', 'string | = "";'],
  ['return', 'Qiymat qaytaradi', 'return |;']
];
const CSHARP_SUGGESTIONS = [
  ['Console.WriteLine', 'Natijani chiqaradi', 'Console.WriteLine(|);'],
  ['Console.ReadLine', 'Kiritish oladi', 'Console.ReadLine()'],
  ['int', 'Butun son tipi', 'int | = 0;'],
  ['string', 'Matn tipi', 'string | = "";'],
  ['for', 'Sikl', 'for (int i = 0; i < |; i++) {\n    \n}'],
  ['foreach', 'To\'plam bo\'yicha sikl', 'foreach (var item in |) {\n    \n}'],
  ['if', 'Shart', 'if (|) {\n    \n}'],
  ['else', 'Aks holda', 'else {\n    |\n}'],
  ['new', 'Yangi obyekt', 'new |'],
  ['return', 'Qiymat qaytaradi', 'return |;']
];
const SQL_SUGGESTIONS = [
  ['SELECT', 'Ma\'lumot tanlaydi', 'SELECT | FROM table;'],
  ['FROM', 'Qaysi jadvaldan', 'FROM |'],
  ['WHERE', 'Shart', 'WHERE |'],
  ['INSERT INTO', 'Qo\'shish', 'INSERT INTO table VALUES (|);'],
  ['UPDATE', 'Yangilash', 'UPDATE table SET col = | WHERE ...;'],
  ['DELETE FROM', 'O\'chirish', 'DELETE FROM table WHERE |;'],
  ['ORDER BY', 'Saralash', 'ORDER BY |'],
  ['GROUP BY', 'Guruhlash', 'GROUP BY |'],
  ['JOIN', 'Jadvallarni birlashtirish', 'JOIN | ON ...'],
  ['COUNT', 'Sanoq', 'COUNT(|)']
];
const LANG_SUGGESTIONS = {
  python: PY_SUGGESTIONS, java: JAVA_SUGGESTIONS, cpp: CPP_SUGGESTIONS,
  csharp: CSHARP_SUGGESTIONS, sql: SQL_SUGGESTIONS
};

/* ============ LESSON CONTEXT ============ */
let lessonContext = null;

function setLessonContext(ctx) { lessonContext = ctx || null; }
function getLessonContext() { return lessonContext; }

/** Dars kontenti (sections code) dan tushunchalarni avtomatik yig'ish */
function extractLessonKeywords(lesson) {
  const kws = new Set();
  try {
    const secs = (lesson && lesson.content && lesson.content.sections) || [];
    const codeText = secs.map(s => String(s.code || '')).join('\n');
    (codeText.match(/<([a-z][a-z0-9]*)/gi) || []).forEach(t => kws.add(t.slice(1).toLowerCase()));
    (codeText.match(/([a-z-]+)=/gi) || []).forEach(a => kws.add(a.slice(0, -1).toLowerCase()));
    (codeText.match(/([a-z-]+)\s*:/gi) || []).forEach(p => kws.add(p.replace(/\s*:$/, '').toLowerCase()));
    ['console.log', 'alert', 'function', 'const', 'let', 'addEventListener', 'onclick', 'return']
      .forEach(k => { if (codeText.indexOf(k) !== -1) kws.add(k); });
  } catch (e) { /* ignore */ }
  return Array.from(kws).filter(k => k && k.length > 1);
}

/** Suggestion score: darsda o'rganilayotgan tushuncha tepaga chiqadi */
function lessonBoost(name) {
  if (!lessonContext) return 0;
  const kws = lessonContext.keywords || [];
  const n = String(name).toLowerCase();
  if (kws.some(k => String(k).toLowerCase() === n)) return 10; // aniq mos — max
  // qisman mos faqat 3+ belgi uchun (bitta harf hamma narsaga mos bo'lib qolmasin)
  const partial = kws.some(k => {
    const kk = String(k).toLowerCase();
    return kk.length >= 3 && (n.indexOf(kk) !== -1 || kk.indexOf(n) !== -1);
  });
  return partial ? 4 : 0;
}

/* ============ CONTEXT DETECTION ============ */
function detectContext(ta, lang) {
  const pos = ta.selectionStart;
  const before = ta.value.slice(0, pos);

  if (lang === 'css') {
    const line = before.slice(Math.max(before.lastIndexOf('\n'), before.lastIndexOf(';'), before.lastIndexOf('{')) + 1);
    const m = line.match(/^\s*([a-zA-Z-][\w-]*)$/);
    if (m) return { kind: 'css', prefix: m[1] };
    const pm = line.match(/([a-zA-Z][\w-]*)\s*:\s*([\w-]*)$/);
    if (pm && CSS_PROP_DOCS[pm[1]]) return { kind: 'css-value', prefix: pm[2], prop: pm[1] };
    const ps = line.match(/([a-zA-Z][\w-]*)(::?)([\w-]*)$/);
    if (ps) return { kind: 'css-pseudo', prefix: ps[2] + ps[3], tag: ps[1] };
    return null;
  }
  if (lang === 'js' || LANG_SUGGESTIONS[lang]) {
    const line = before.slice(before.lastIndexOf('\n') + 1);
    const m = line.match(/([A-Za-z_.$][\w.$]*)$/);
    if (m && m[1].length > 0) return { kind: 'lang', prefix: m[1] };
    return null;
  }
  // html — kontekstni matndan aniqlaymiz
  const openScript = (before.match(/<script\b/gi) || []).length - (before.match(/<\/script>/gi) || []).length;
  if (openScript > 0) {
    const line = before.slice(before.lastIndexOf('\n') + 1);
    const m = line.match(/([A-Za-z_.$][\w.$]*)$/);
    if (m) return { kind: 'lang', prefix: m[1] };
    return null;
  }
  const openStyle = (before.match(/<style\b/gi) || []).length - (before.match(/<\/style>/gi) || []).length;
  const styleAttr = before.match(/style\s*=\s*"([^"]*)$/);
  if (openStyle > 0 || styleAttr) {
    if (styleAttr) {
      // style="... ichida — CSS property context
      const tail = styleAttr[1];
      const pmv = tail.match(/([a-zA-Z][\w-]*)\s*:\s*([\w-]*)$/);
      if (pmv) return { kind: 'css-value', prefix: pmv[2], prop: pmv[1] };
      const wm = tail.match(/([a-zA-Z-][\w-]*)$/);
      return { kind: 'css', prefix: wm ? wm[1] : '' };
    }
    const line = before.slice(Math.max(before.lastIndexOf('\n'), before.lastIndexOf(';'), before.lastIndexOf('{')) + 1);
    const m = line.match(/^\s*([a-zA-Z-][\w-]*)$/);
    if (m) return { kind: 'css', prefix: m[1] };
    const pm = line.match(/([a-zA-Z][\w-]*)\s*:\s*([\w-]*)$/);
    if (pm && CSS_PROP_DOCS[pm[1]]) return { kind: 'css-value', prefix: pm[2], prop: pm[1] };
    const ps = line.match(/([a-zA-Z][\w-]*)(::?)([\w-]*)$/);
    if (ps) return { kind: 'css-pseudo', prefix: ps[2] + ps[3], tag: ps[1] };
    return null;
  }
  // 🔧 FIX: '<'siz "bare word" — yangi qatorda/`>`dan keyin yozilgan h1, img, a, button...
  // Avvalgi versiya faqat '<h' ko'rinishida ishlagani uchun popup chiqmasdi.
  const lastBreak = Math.max(before.lastIndexOf('>'), before.lastIndexOf('\n'));
  const tail = before.slice(lastBreak + 1);
  const bareWord = tail.match(/^\s{0,40}([a-zA-Z][\w-]*)$/);
  if (bareWord && TAG_DOCS[bareWord[1].toLowerCase()]) {
    return { kind: 'html-tag', prefix: bareWord[1] };
  }
  if (bareWord && Object.keys(TAG_DOCS).some(t => t.indexOf(bareWord[1].toLowerCase()) === 0)) {
    return { kind: 'html-tag', prefix: bareWord[1] };
  }
  const lt = before.lastIndexOf('<');
  if (lt !== -1) {
    const seg = before.slice(lt, pos);
    if (!seg.includes('>')) {
      const tagM = seg.match(/^<\s*([a-zA-Z][\w-]*)/);
      const tag = tagM ? tagM[1].toLowerCase() : null;
      const valM = seg.match(/([a-zA-Z-]+)\s*=\s*"([^"]*)$/);
      if (valM && tag) return { kind: 'attr-value', tag, attr: valM[1].toLowerCase(), prefix: valM[2] };
      const attrM = seg.match(/\s([a-zA-Z-][\w-]*)$/);
      if (attrM && tag) return { kind: 'html-attr', tag, prefix: attrM[1] };
      // <img " yoki <img  " — attr nomi hali yozilmagan, hammasini ko'rsat
      if (tag && /\s$/.test(seg)) return { kind: 'html-attr', tag, prefix: '' };
      const tagOnly = seg.match(/^<\s*([a-zA-Z][\w-]*)$/);
      if (tagOnly) return { kind: 'html-tag', prefix: tagOnly[1] };
      return null;
    }
  }
  if (before.endsWith('<')) return { kind: 'html-tag', prefix: '' };
  return null;
}

function makeSug(name, desc, insert, replaceStart, caret) {
  return { name, desc, insert, replaceStart, caret };
}

/* ============ SUGGESTION ENGINE (LOCAL, network yo'q) ============ */
function getSuggestions(ta, lang) {
  const ctx = detectContext(ta, lang);
  if (!ctx) return { ctx: null, items: [] };
  const items = [];
  const pos = ta.selectionStart;

  if (ctx.kind === 'html-tag') {
    const p = ctx.prefix.toLowerCase();
    Object.keys(TAG_DOCS).forEach(tag => {
      if (tag.indexOf(p) === 0) {
        const snippet = TAG_SNIPPETS[tag] || ('<' + tag + '>|</' + tag + '>');
        items.push({ tag, name: tag, desc: TAG_DOCS[tag] || '', snippet, score: lessonBoost(tag) });
      }
    });
    items.sort((a, b) => (b.score - a.score) || a.tag.length - b.tag.length || (a.tag < b.tag ? -1 : 1));
    return { ctx, items: items.slice(0, 8).map(it => makeSug(it.tag, it.desc, it.snippet, pos - p.length, null)) };
  }

  if (ctx.kind === 'html-attr') {
    const p = ctx.prefix.toLowerCase();
    const tagAttrs = TAG_ATTRS[ctx.tag] || [];
    const attrs = tagAttrs.concat(GLOBAL_ATTRS);
    const seen = new Set();
    attrs.filter(a => a.indexOf(p) === 0 && !seen.has(a) && seen.add(a)).forEach((a, idx) => {
      // score: dars boost + tag-uchun maxsus attr ustuvorligi (TAG_ATTRS tartibi)
      items.push({ name: a, desc: ATTR_DOCS[a] || '', snippet: a + '="|"', score: lessonBoost(a) * 100 - (idx < tagAttrs.length ? idx : 50) });
    });
    items.sort((a, b) => (b.score - a.score) || (a.name < b.name ? -1 : 1));
    return { ctx, items: items.slice(0, 8).map(it => makeSug(it.name, it.desc, it.snippet, pos - p.length, null)) };
  }

  if (ctx.kind === 'attr-value') {
    const vals = [];
    const kws = (lessonContext && lessonContext.keywords) || [];
    if (ctx.attr === 'href') {
      vals.push(['https://', 'Boshqa saytga link', 'https://|']);
      if (kws.some(k => String(k).indexOf('mail') !== -1)) vals.push(['mailto:', 'Email manzilga link', 'mailto:|']);
      if (kws.some(k => String(k) === 'tel' || String(k).indexOf('tel:') !== -1)) vals.push(['tel:', 'Telefon raqamga link', 'tel:|']);
      vals.push(['#', 'Bir xil sahifaga link', '#|']);
    } else if (ctx.attr === 'target') {
      vals.push(['_blank', 'Yangi oynada ochadi', '_blank|']);
    } else if (ctx.attr === 'type' && ctx.tag === 'input') {
      vals.push(['text', 'Oddiy matn', 'text|'], ['password', 'Parol maydoni', 'password|'],
        ['email', 'Email maydoni', 'email|'], ['number', 'Raqam', 'number|']);
    } else if (ctx.attr === 'src') {
      vals.push(['https://', 'Internetdagi rasm manzili', 'https://|']);
    } else if (lessonBoost(ctx.attr) > 0) {
      vals.push([ctx.attr, ATTR_DOCS[ctx.attr] || '', ctx.attr + '|']);
    }
    const p = ctx.prefix;
    const filtered = vals.filter(v => v[0].indexOf(p) === 0);
    if (!filtered.length) return { ctx, items: [] };
    return { ctx, items: filtered.slice(0, 8).map(v => makeSug(v[0], v[1], v[2], pos - p.length, null)) };
  }

  if (ctx.kind === 'css') {
    const p = ctx.prefix.toLowerCase();
    // Aliaslar: fon => background, rang => color (o'zbekcha/qisqa yozuvlar)
    const aliases = { fon: ['background', 'background-color'], rang: ['color'] };
    const extra = aliases[p] || [];
    CSS_PROPS.forEach(pair => {
      if (pair[0].indexOf(p) === 0 || extra.indexOf(pair[0]) !== -1)
        items.push({ name: pair[0], desc: pair[1], snippet: pair[0] + ': |;', score: lessonBoost(pair[0]) + (extra.indexOf(pair[0]) !== -1 ? 5 : 0) });
    });
    items.sort((a, b) => (b.score - a.score) || (a.name < b.name ? -1 : 1));
    return { ctx, items: items.slice(0, 8).map(it => makeSug(it.name, it.desc, it.snippet, pos - p.length, null)) };
  }

  if (ctx.kind === 'css-pseudo') {
    const p = ctx.prefix.toLowerCase();
    Object.keys(PSEUDO_DOCS).forEach(pse => {
      if (pse.indexOf(p) === 0) items.push(makeSug(pse, PSEUDO_DOCS[pse], pse + ' {|}', pos - p.length, null));
    });
    return { ctx, items: items.slice(0, 8) };
  }

  if (ctx.kind === 'css-value') {
    const colors = [['red', 'Qizil'], ['blue', 'Ko\'k'], ['green', 'Yashil'],
      ['black', 'Qora'], ['white', 'Oq'], ['yellow', 'Sariq'], ['orange', 'To\'q sariq'],
      ['purple', 'Binafsha'], ['gray', 'Kulrang'], ['pink', 'Pushti']];
    const p = ctx.prefix.toLowerCase();
    if (/color|background/.test(ctx.prop)) {
      return { ctx, items: colors.filter(c => c[0].indexOf(p) === 0).slice(0, 8)
        .map(c => makeSug(c[0], c[1], c[0] + '|', pos - p.length, null)) };
    }
    return { ctx, items: [] };
  }

  if (ctx.kind === 'lang') {
    const set = LANG_SUGGESTIONS[lang] || JS_SUGGESTIONS;
    const p = ctx.prefix.toLowerCase();
    set.filter(s => s[0].toLowerCase().indexOf(p) === 0)
      .forEach(s => items.push({ name: s[0], desc: s[1], snippet: s[2], score: lessonBoost(s[0]) }));
    items.sort((a, b) => (b.score - a.score) || (a.name < b.name ? -1 : 1));
    return { ctx, items: items.slice(0, 8).map(it => makeSug(it.name, it.desc, it.snippet, pos - p.length, null)) };
  }

  return { ctx, items };
}

/* ============ INSERT — RAW text, undo (Ctrl+Z) bilan ============ */
function insertSnippet(ta, replaceStart, snippet) {
  const caretIdx = snippet.indexOf('|');
  const text = caretIdx === -1 ? snippet : snippet.replace('|', '');
  const caretOffset = caretIdx === -1 ? text.length : caretIdx;
  const end = ta.selectionStart;

  ta.focus();
  try { ta.setSelectionRange(replaceStart, end); } catch (e) { /* ignore */ }
  let ok = false;
  try { ok = document.execCommand && document.execCommand('insertText', false, text); } catch (e) { ok = false; }
  if (!ok) ta.setRangeText(text, replaceStart, end, 'end'); // fallback (undo kafolatlanmaydi)
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  const target = replaceStart + caretOffset;
  try { ta.setSelectionRange(target, target); } catch (e) { /* ignore */ }
  hideSuggest();
}

/** Fix kodni butun editor qiymati sifatida almashtirish (undo bilan) */
function replaceWholeValue(ta, newText) {
  ta.focus();
  try { ta.setSelectionRange(0, ta.value.length); } catch (e) { /* ignore */ }
  let ok = false;
  try { ok = document.execCommand && document.execCommand('insertText', false, newText); } catch (e) { ok = false; }
  if (!ok) ta.value = newText;
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  try { ta.setSelectionRange(0, 0); } catch (e) { /* ignore */ }
}

/* ============ POPUP UI — bitta global popup ============ */
let aiPopup = null;
let popupState = { ta: null, items: [], ctx: null, active: 0 };

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ensurePopup() {
  if (aiPopup) return aiPopup;
  aiPopup = document.createElement('div');
  aiPopup.id = 'aiSuggestPopup';
  aiPopup.className = 'ai-suggest-popup';
  aiPopup.setAttribute('role', 'listbox');
  aiPopup.addEventListener('mousedown', function (e) {
    e.preventDefault(); // editor focus yo'qolmasin
    const item = e.target.closest('.ai-sug-item');
    if (item && popupState.ta) acceptSuggestion(parseInt(item.getAttribute('data-idx'), 10));
  });
  document.body.appendChild(aiPopup);
  return aiPopup;
}

function renderPopup() {
  const pop = ensurePopup();
  pop.innerHTML = '';
  popupState.items.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'ai-sug-item' + (i === popupState.active ? ' active' : '');
    row.setAttribute('data-idx', i);
    row.setAttribute('role', 'option');
    row.innerHTML = '<span class="ai-sug-name">' + escapeHtml(it.name) + '</span>' +
      '<span class="ai-sug-desc">' + escapeHtml(it.desc || '') + '</span>';
    pop.appendChild(row);
  });
  pop.classList.add('visible');
}

/** Caret koordinatalari — mirror texnikasi */
function getCaretCoords(ta) {
  const div = document.createElement('div');
  const style = getComputedStyle(ta);
  ['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'letterSpacing', 'tabSize',
    'padding', 'border', 'boxSizing'].forEach(prop => { div.style[prop] = style[prop]; });
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.width = ta.clientWidth + 'px';
  div.appendChild(document.createTextNode(ta.value.substring(0, ta.selectionStart)));
  const span = document.createElement('span');
  span.appendChild(document.createTextNode('\u200b'));
  div.appendChild(span);
  document.body.appendChild(div);
  const spanRect = span.getBoundingClientRect();
  const coords = { left: spanRect.left - ta.scrollLeft, top: spanRect.top - ta.scrollTop };
  document.body.removeChild(div);
  const taRect = ta.getBoundingClientRect();
  const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
  return { x: taRect.left + coords.left, y: taRect.top + coords.top, h: lh };
}

function positionPopup(ta) {
  const pop = ensurePopup();
  pop.style.visibility = 'hidden';
  pop.classList.add('visible');
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  const c = getCaretCoords(ta);
  let x = c.x, y = c.y + c.h + 6;
  const vw = window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  if (x + pw > vw - 8) x = Math.max(8, vw - pw - 8);
  if (y + ph > vh - 8) {
    y = c.y - ph - 4;
    if (y < 8) y = Math.max(8, vh - ph - 8);
  }
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  pop.style.visibility = 'visible';
}

function showSuggestions(ta, lang) {
  const res = getSuggestions(ta, lang);
  if (!res.items.length) { hideSuggest(); return; }
  popupState = { ta, items: res.items, ctx: res.ctx, active: 0 };
  renderPopup();
  positionPopup(ta);
}

function hideSuggest() {
  popupState = { ta: null, items: [], ctx: null, active: 0 };
  if (aiPopup) {
    aiPopup.classList.remove('visible');
    aiPopup.innerHTML = '';
  }
}

function isSuggestOpen() {
  return !!(aiPopup && aiPopup.classList.contains('visible') && popupState.items.length);
}

function acceptSuggestion(idx) {
  const { ta, items } = popupState;
  const it = items[idx != null ? idx : popupState.active];
  if (!ta || !it) { hideSuggest(); return; }
  insertSnippet(ta, it.replaceStart, it.insert);
}

function moveActive(dir) {
  const n = popupState.items.length;
  if (!n) return;
  popupState.active = (popupState.active + dir + n) % n;
  renderPopup();
  positionPopup(popupState.ta);
}

/* ============ EDITORGA ULASH (dedupe, capture keydown) ============ */
function attachEditor(ta, lang) {
  if (!ta || ta._aiBound) return;
  ta._aiBound = true;
  ta.setAttribute('data-ai-lang', lang);

  // capture: mavjud Tab handleridan OLDIN ishlashi kerak (popup ochiq bo'lsa)
  const host = ta.closest('.editor-container') || ta.closest('.ls-ex-card') || ta.parentElement;
  (host || ta).addEventListener('keydown', function (e) {
    if (e.target !== ta) return;
    if (!isSuggestOpen() || popupState.ta !== ta) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); e.stopImmediatePropagation(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); e.stopImmediatePropagation(); moveActive(-1); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); e.stopImmediatePropagation(); acceptSuggestion(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); hideSuggest(); }
  }, true);

  ta.addEventListener('input', function () {
    requestAnimationFrame(() => showSuggestions(ta, lang));
  });
  ta.addEventListener('click', () => hideSuggest());
  ta.addEventListener('blur', function () { setTimeout(hideSuggest, 120); });
  ta.addEventListener('scroll', hideSuggest);
  window.addEventListener('resize', hideSuggest);
}

/* ============ LOCAL TUTOR ENGINE (o'rgatuvchi, kod o'rniga yozmaydi) ============ */
const CSS_PROP_DOCS = {};
CSS_PROPS.forEach(p => { CSS_PROP_DOCS[p[0]] = p[1]; });

/** 🔍 Kodni tushuntirish — sodda, ~3–9 qator */
function explainCode(code, lang) {
  const out = [];
  const src = String(code || '').trim();
  if (!src) return 'Hozircha kod bo‘sh. Kichik bir narsa yozib ko‘ring — men tushuntiraman 🙂';
  if (lang === 'css') {
    src.split(/[;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 9).forEach(decl => {
      const prop = decl.split(':')[0].trim();
      if (CSS_PROP_DOCS[prop]) out.push('<code>' + escapeHtml(decl) + '</code> → <b>' + escapeHtml(prop) + '</b> ' + CSS_PROP_DOCS[prop]);
      else out.push('<code>' + escapeHtml(decl) + '</code> → CSS qoidasi');
    });
  } else if (lang === 'html' || /<[a-z!]/i.test(src)) {
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))*)\s*\/?>/g;
    let m;
    while ((m = tagRe.exec(src)) !== null && out.length < 9) {
      const closing = m[1] === '/';
      const tag = m[2].toLowerCase();
      const doc = TAG_DOCS[tag];
      if (doc) out.push('<code>&lt;' + (closing ? '/' : '') + tag + '&gt;</code> → ' + (closing ? doc + ' (yopiladi)' : doc));
      const attrs = m[3] || '';
      const attrRe = /([\w-]+)\s*=\s*"([^"]*)"/g;
      let a;
      while ((a = attrRe.exec(attrs)) !== null && out.length < 9) {
        const name = a[1].toLowerCase(), val = a[2];
        if (name === 'style' && val) {
          val.split(';').map(s => s.trim()).filter(Boolean).forEach(decl => {
            const prop = decl.split(':')[0].trim();
            if (CSS_PROP_DOCS[prop] && out.length < 9)
              out.push('<code>style="' + escapeHtml(decl) + '"</code> → <b>' + escapeHtml(prop) + '</b> ' + CSS_PROP_DOCS[prop]);
          });
        } else if (ATTR_DOCS[name]) {
          out.push('<code>' + name + '="' + escapeHtml(val) + '"</code> → ' + ATTR_DOCS[name]);
        }
      }
    }
    const text = src.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text && out.length < 9) out.push('<code>' + escapeHtml(text.slice(0, 40)) + '</code> → ekranda ko‘rinadigan matn');
    if (!out.length) out.push('Bu yerda tanilgan HTML tegi topilmadi.');
  } else {
    src.split('\n').filter(l => l.trim()).slice(0, 8).forEach(line => {
      out.push('<code>' + escapeHtml(line.trim().slice(0, 60)) + '</code>');
    });
  }
  return out.join('\n');
}

/** CSS property HTML attribute sifatida yozilganini tuzatish */
function fixCssAttrAsHtml(code) {
  const re = /<(\w+)([^>]*)\b(color|font-size|background|margin|padding|text-align|font-weight|border)\s*=\s*"([^"]*)"/g;
  let found = false;
  const fixed = code.replace(re, (full, tag, rest, prop, val) => {
    found = true;
    const styleM = rest.match(/\sstyle\s*=\s*"([^"]*)"/);
    const decl = prop + ': ' + val;
    let newRest;
    if (styleM) {
      const merged = styleM[1].replace(/;\s*$/, '') + '; ' + decl;
      newRest = rest.replace(styleM[0], ' style="' + merged + '"');
    } else {
      newRest = rest + ' style="' + decl + '"';
    }
    return '<' + tag + newRest;
  });
  return found ? fixed : null;
}

/** Matn ichiga CSS yozib yuborilganini aniqlash: <h1>color salom</h1> */
function findCssInText(code) {
  const m = code.match(/<(\w+)(?:\s[^>]*)?>\s*(color|font-size|background|margin|padding|text-align)\b/i);
  if (!m) return null;
  return { tag: m[1], prop: m[2].toLowerCase() };
}

/** 🔧 Xatoni top — lokal qoidalar (halol rule-based tekshiruv) */
function findIssues(code, lang) {
  const issues = [];
  const src = String(code || '');
  if (lang === 'html' || /<[a-z!]/i.test(src)) {
    const fixedCss = fixCssAttrAsHtml(src);
    if (fixedCss) {
      issues.push({
        problem: 'CSS xususiyati HTML attribute sifatida yozilgan (masalan <code>color="..."</code>).',
        reason: '<code>color</code> — bu CSS property. HTML buni attribute sifatida tushunmaydi, oddiy matn deb o‘ylaydi.',
        fix: fixedCss
      });
    }
    const cssText = findCssInText(src);
    if (cssText) {
      issues.push({
        problem: '<code>&lt;' + cssText.tag + '&gt;</code> ichida <code>' + cssText.prop + '</code> oddiy matn sifatida yozilgan.',
        reason: '<code>' + cssText.prop + '</code> HTML matni emas — bu <b>CSS property</b>. Rang berish uchun CSS ishlating.',
        fix: fixedCss || null
      });
    }
    if (/<img(?![^>]*\bsrc\s*=)[^>]*>/i.test(src)) {
      issues.push({
        problem: '<code>&lt;img&gt;</code> da <code>src</code> yo‘q.',
        reason: 'src — rasm manzili. Bo‘lmasa rasm ko‘rinmaydi.',
        fix: src.replace(/<img\b([^>]*)>/i, '<img src="https://example.com/rasm.jpg"$1>')
      });
    }
    if (/<img(?![^>]*\balt\s*=)[^>]*>/i.test(src)) {
      issues.push({
        problem: '<code>&lt;img&gt;</code> da <code>alt</code> yo‘q.',
        reason: 'alt — rasm tavsifi. Rasm yuklanmasa shu matn ko‘rinadi.',
        fix: null
      });
    }
    if (/<a\b(?![^>]*\bhref\s*=)[^>]*>/i.test(src)) {
      issues.push({
        problem: '<code>&lt;a&gt;</code> da <code>href</code> yo‘q.',
        reason: 'href — link manzili. Bo‘lmasa link bosilmaydi.',
        fix: src.replace(/<a\b([^>]*)>/i, '<a href="https://example.com"$1>')
      });
    }
    const needClose = ['div', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'span', 'button', 'ul', 'ol', 'li', 'section', 'header', 'footer'];
    needClose.forEach(tag => {
      const open = (src.match(new RegExp('<' + tag + '(\\s|>)', 'gi')) || []).length;
      const close = (src.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
      if (open > close) {
        issues.push({
          problem: '<code>&lt;' + tag + '&gt;</code> yopilmagan (' + (open - close) + ' ta).',
          reason: 'Har bir ochilgan teg <code>&lt;/' + tag + '&gt;</code> bilan yopilishi kerak.',
          fix: null
        });
      }
    });
  }
  if (lang === 'js') {
    const openB = (src.match(/{/g) || []).length, closeB = (src.match(/}/g) || []).length;
    if (openB !== closeB) issues.push({
      problem: 'Figurniy qavslar mos emas: { = ' + openB + ', } = ' + closeB + '.',
      reason: 'Har bir { uchun } kerak.',
      fix: null
    });
  }
  return issues;
}

/* ============ 💡 3-BOSQICHLI HINT ============ */
const aiHintStage = {};
function buildHints(ex) {
  const checks = (ex && ex.checks) || [];
  const tags = new Set(), attrs = new Set();
  checks.forEach(c => {
    const re = String(c.re || '');
    (re.match(/<\s*(\w+)/g) || []).forEach(t => tags.add(t.replace('<', '').toLowerCase()));
    (re.match(/(?:\(|\b|")(\w[\w-]*)(?=\s*\\b|\\s|=)/g) || []).forEach(a => {
      const k = a.toLowerCase();
      if (k.length > 2 && !['re', 'test', 'new', 'regexp'].includes(k)) attrs.add(k);
    });
  });
  const instruction = String((ex && ex.instruction) || '');
  const url = (instruction.match(/https?:\/\/[^\s)]+/) || [null])[0];
  const stage = aiHintStage[ex.id] || 0;
  const tagList = Array.from(tags);
  const attrList = Array.from(attrs);

  if (stage === 0) {
    return '💡 <b>1-HINT:</b> Vazifaga diqqat qiling: qaysi HTML teg kerakligini eslay olasizmi? Darsda xuddi shuni o‘rgangan edik 😉';
  }
  if (stage === 1) {
    let s = '💡 <b>2-HINT:</b>';
    if (tagList.length) s += ' <code>&lt;' + tagList[0] + '&gt;</code> tegini ishlating.';
    if (attrList.length) s += ' Unda <code>' + attrList.slice(0, 3).join('</code>, <code>') + '</code> attribute kerak bo‘ladi.';
    if (!tagList.length && !attrList.length) s += ' Dars misoliga qayta qarang — u yerda javob bor.';
    return s;
  }
  let example = '';
  if (tagList.length) {
    const tag = tagList[0];
    if (tag === 'a') example = '<a href="' + (url || 'https://www.google.com') + '">Google</a>';
    else if (tag === 'img') example = '<img src="' + (url || 'https://example.com/rasm.jpg') + '" alt="Rasm tavsifi">';
    else if (TAG_SNIPPETS[tag]) example = TAG_SNIPPETS[tag].replace('|', '...');
    else example = '<' + tag + '>...</' + tag + '>';
  } else {
    example = 'Dars misoliga qayta qarang — u yerda namunaviy kod bor';
  }
  return '💡 <b>3-HINT:</b> Namunaviy kod:<pre class="ai-code-sample">' + escapeHtml(example) + '</pre>';
}

/** ➡️ Keyingi qadam */
function nextStep(ex, code) {
  const checks = (ex && ex.checks) || [];
  for (const c of checks) {
    try {
      if (!new RegExp(c.re, 'i').test(String(code || ''))) {
        return '➡️ <b>Keyingi qadam:</b> ' + escapeHtml(c.msg || 'Shart hali bajarilmagan');
      }
    } catch (e) { /* ignore */ }
  }
  if (checks.length) return '✅ Barcha shartlar bajarilgan — <b>▶ RUN</b> bosing!';
  return '➡️ Vazifa talabiga qarab kodni to‘ldiring va <b>▶ RUN</b> bosing.';
}

/* ============ AI SERVICE ABSTRACTION ============
   Frontendga API key YOZILMAYDI. Endpoint sozlangan bo'lsa
   (window.ITTEST_AI_CONFIG = { endpoint: '...' }) real AI chaqiriladi,
   aks holda 'none' qaytadi va LOCAL yordamchi ishlaydi (fake javob YO'Q). */
async function getCodeAssistance(payload) {
  const cfg = window.ITTEST_AI_CONFIG || null;
  if (!cfg || !cfg.endpoint) {
    return { source: 'none', message: 'No AI backend connected' };
  }
  try {
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { source: 'error', message: 'HTTP ' + res.status };
    const data = await res.json();
    return { source: 'ai', data };
  } catch (e) {
    return { source: 'error', message: String(e && e.message || e) };
  }
}

function aiSourceNote() {
  return '<div class="ai-source-note">⚙️ Local assistant (offline, rule-based)' +
    (window.ITTEST_AI_CONFIG && window.ITTEST_AI_CONFIG.endpoint ? ' + AI backend' : ' · 🌐 AI backend ulanmagan') + '</div>';
}

/* ============ GEMINI AI — actionlar uchun (autocomplete AI chaqirmaydi) ============ */
/** Gemini javob matnini xavfsiz render: ```blok``` → <pre>, `x` → <code> */
function renderAiText(text, fixed) {
  let raw = String(text || '').trim();
  if (!raw) return '<div class="ai-out bad">🤖 AI bo‘sh javob qaytardi — qayta bosing yoki local assistant ishlatiling.</div>';
  let html = escapeHtml(raw);
  html = html.replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, (m, code) => '<pre class="ai-code-sample">' + code.trim() + '</pre>');
  html = html.replace(/`([^`\n]{1,80})`/g, '<code>$1</code>');
  let out = '<div class="ai-out">' + html + '</div>';
  if (fixed) {
    out += '<button type="button" class="btn btn-primary btn-xs ai-fix-btn" data-ai-act="fix">✅ Tuzatilgan kodni qo‘shish</button>';
  }
  return out;
}

function aiSourceNoteGemini() {
  return '<div class="ai-source-note">🤖 Gemini AI javobi</div>';
}

/** AI action: HOZIRCHA FAQAT LOCAL (backend chaqiruvi o'chirilgan).
   Agar keyinchalik backend qayta yoqilsa, window.ITTEST_AI_CONFIG.endpoint
   qayta sozlanishi kifoya — shu funksiya avtomatik AI'ga ulanadi. */
function aiAsk(out, ta, lang, action, localFn) {
  if (!out) return;
  const endpoint = window.ITTEST_AI_CONFIG && window.ITTEST_AI_CONFIG.endpoint;
  if (!endpoint) {
    // Local-only rejim: network request UMUMAN yuborilmaydi
    if (typeof localFn === 'function') localFn('');
    return;
  }
  out.innerHTML = '<div class="ai-out muted">🤖 AI o‘ylayapti...</div>';
  getCodeAssistance({
    language: lang,
    code: ta.value,
    cursorPosition: ta.selectionStart,
    lessonContext: getLessonContext(),
    action: action
  }).then(res => {
    if (res.source === 'ai' && res.data) {
      const fixed = action === 'fix' ? (res.data.fixed || null) : null;
      out.innerHTML = renderAiText(res.data.text, fixed) + aiSourceNoteGemini();
      if (fixed) {
        const b = out.querySelector('.ai-fix-btn');
        if (b) b._aiFix = fixed;
      }
    } else {
      // Halol holat + local fallback (localFn natijasi oldiga xato izohi qo'yiladi)
      const note = '<div class="ai-out bad">🌐 <b>AI javob bermadi</b> (' + escapeHtml(res.message || res.source) + ') — Local assistant natijasi:</div>';
      if (typeof localFn === 'function') { localFn(note); return; }
      out.innerHTML = note;
    }
  }).catch(e => {
    const note = '<div class="ai-out bad">🌐 <b>AI backendga ulanmadi</b> (' + escapeHtml(String(e && e.message || e)) + ') — Local assistant natijasi:</div>';
    if (typeof localFn === 'function') { localFn(note); return; }
    out.innerHTML = note;
  });
}


/* ============ 🤖 DARS ICHIDAGI AI YORDAMCHI PANELI (faqat liveedit) ============ */
function attachLessonExercise(ta, course, lesson, ex) {
  if (!ta || ta._aiPanelBound) return;
  ta._aiPanelBound = true;
  const lang = 'html';
  attachEditor(ta, lang);

  const card = ta.closest('.ls-ex-card');
  if (!card || card.querySelector('.ai-lesson-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'ai-lesson-panel';
  panel.innerHTML =
    '<div class="ai-lesson-head">🤖 AI Yordamchi <span class="ai-lesson-mode">BEGINNER MODE</span></div>' +
    '<div class="ai-lesson-actions">' +
      '<button type="button" class="btn btn-ghost btn-xs" data-ai-act="hint">💡 Hint</button>' +
      '<button type="button" class="btn btn-ghost btn-xs" data-ai-act="explain">🔍 Tushuntir</button>' +
      '<button type="button" class="btn btn-ghost btn-xs" data-ai-act="errors">🔧 Xatoni top</button>' +
      '<button type="button" class="btn btn-ghost btn-xs" data-ai-act="next">➡️ Keyingi qadam</button>' +
    '</div>' +
    '<div class="ai-lesson-out" id="aiOut-' + ex.id + '"></div>';

  const out = panel.querySelector('.ai-lesson-out');

  panel.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-ai-act]');
    if (!btn) return;
    if (btn.getAttribute('data-ai-act') === 'fix' && btn._aiFix) {
      replaceWholeValue(ta, btn._aiFix);
      out.innerHTML = '<div class="ai-out ok">✅ Tuzatilgan kod qo‘shildi. Ctrl+Z bilan qaytarish mumkin.</div>' + aiSourceNote();
      return;
    }
    const act = btn.getAttribute('data-ai-act');
    const code = ta.value;
    if (act === 'hint') {
      const stage = aiHintStage[ex.id] || 0;
      aiHintStage[ex.id] = Math.min(stage + 1, 2);
      aiAsk(out, ta, lang, 'hint', function (prefix) {
        out.innerHTML = (prefix || '') + buildHints(ex) + aiSourceNote();
      });
    } else if (act === 'explain') {
      aiAsk(out, ta, lang, 'explain', function (prefix) {
        out.innerHTML = (prefix || '') + '<div class="ai-out">🔍 <b>Kod tushuntirildi:</b><br>' + (explainCode(code, lang) || 'Tushuntirish topilmadi.') + '</div>' + aiSourceNote();
      });
    } else if (act === 'errors') {
      aiAsk(out, ta, lang, 'fix', function (prefix) {
        renderIssues(out, code, lang, prefix);
      });
    } else if (act === 'next') {
      out.innerHTML = nextStep(ex, code) + aiSourceNote();
    }
  });

  card.appendChild(panel);
}

/** Xatolar + fix tugmasi (umumiy renderer) */
function renderIssues(out, code, lang, prefix) {
  const issues = findIssues(code, lang);
  if (!issues.length) {
    out.innerHTML = (prefix || '') + '<div class="ai-out ok">✅ Tanilgan xatolar topilmadi. Kod yaxshi ko‘rinadi!</div>' + aiSourceNote();
    return;
  }
  let html = (prefix || '') + '<div class="ai-out">🔧 <b>' + issues.length + ' ta e’tibor:</b>';
  issues.forEach(iss => {
    html += '<div class="ai-issue"><b>Muammo:</b> ' + iss.problem +
      '<br><b>Sababi:</b> ' + iss.reason + '</div>';
    if (iss.fix) {
      html += '<pre class="ai-code-sample">' + escapeHtml(iss.fix) + '</pre>' +
        '<button type="button" class="btn btn-primary btn-xs ai-fix-btn" data-ai-act="fix">✅ Tuzatilgan kodni qo‘shish</button>';
    }
  });
  out.innerHTML = html + aiSourceNote();
  const fixes = issues.filter(i => i.fix);
  out.querySelectorAll('.ai-fix-btn').forEach((b, i) => { b._aiFix = fixes[i] && fixes[i].fix; });
}

/* ============ 🤖 CODING SAHIFASI — AI CODING PANELI ============ */
function getActiveCodingEditor() {
  const view = document.querySelector('#page-coding .editor-view.active');
  const ta = view && view.querySelector('textarea.code-textarea');
  if (ta) return ta;
  return document.querySelector('#page-coding textarea.code-textarea');
}

function langOfEditor(ta) {
  if (!ta) return 'html';
  const m = (ta.id || '').match(/^(.*)Editor$/);
  return m ? m[1] : (ta.getAttribute('data-ai-lang') || 'html');
}

function bindCodingPanel() {
  const toggle = document.getElementById('aiPanelToggle');
  const panel = document.getElementById('aiPanel');
  if (!toggle || !panel) return;

  if (!toggle._aiBound) {
    toggle._aiBound = true;
    toggle.addEventListener('click', function () {
      const closed = panel.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', closed ? 'false' : 'true');
      if (!closed) {
        const ta = getActiveCodingEditor();
        const lbl = document.getElementById('aiPanelLang');
        if (lbl && ta) lbl.textContent = '🤖 AI Coding Assistant — ' + langOfEditor(ta).toUpperCase();
        // 🤖 Robot yordamchi panelida o'ylayapti
        const m = panel.querySelector('.ai-panel-head .mascot');
        if (m && window.ITMascot) ITMascot.setState(m, 'thinking');
      }
    });
    const closeBtn = panel.querySelector('.ai-panel-close');
    if (closeBtn) closeBtn.addEventListener('click', function () {
      panel.classList.add('hidden');
    });
  }

  if (!panel._aiBound) {
    panel._aiBound = true;
    const out = panel.querySelector('.ai-panel-out');
    panel.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-ai-act]');
      if (!btn || !out) return;
      const ta = getActiveCodingEditor();
      if (!ta) { out.innerHTML = '<div class="ai-out bad">Editor topilmadi</div>'; return; }
      const lang = langOfEditor(ta);
      const act = btn.getAttribute('data-ai-act');

      if (act === 'fix' && btn._aiFix) {
        replaceWholeValue(ta, btn._aiFix);
        out.innerHTML = '<div class="ai-out ok">✅ Tuzatilgan kod qo‘shildi. Ctrl+Z bilan qaytarish mumkin.</div>' + aiSourceNote();
        return;
      }

      const code = ta.value;
      if (act === 'hint') {
        const ctx = getLessonContext();
        aiAsk(out, ta, lang, 'hint', function (prefix) {
          if (ctx && ctx.ex) {
            const stage = aiHintStage['coding'] || 0;
            aiHintStage['coding'] = Math.min(stage + 1, 2);
            out.innerHTML = (prefix || '') + buildHints(Object.assign({ id: 'coding' }, ctx.ex)) + aiSourceNote();
          } else {
            out.innerHTML = (prefix || '') + '💡 <b>Hint:</b> Dars mashq konteksti yo‘q. Kodni <b>🔧 Xatoni top</b> bilan tekshiring. ' +
              'Darsdan «💻 Codingda sinab ko‘r» orqali kelsangiz, mashq hintlari shu yerda ko‘rinadi.' + aiSourceNote();
          }
        });
      } else if (act === 'explain') {
        aiAsk(out, ta, lang, 'explain', function (prefix) {
          out.innerHTML = (prefix || '') + '<div class="ai-out">🔍 <b>Kod tushuntirildi:</b><br>' + (explainCode(code, lang) || 'Tushuntirish topilmadi.') + '</div>' + aiSourceNote();
        });
      } else if (act === 'errors') {
        aiAsk(out, ta, lang, 'fix', function (prefix) {
          renderIssues(out, code, lang, prefix);
        });
      } else if (act === 'improve') {
        // ✨ Yaxshilash — Gemini orqali, xato bo'lsa halol holat
        getCodeAssistance({
          language: lang,
          code: code,
          cursorPosition: ta.selectionStart,
          lessonContext: getLessonContext(),
          action: 'improve'
        }).then(res => {
          if (res.source === 'ai' && res.data) {
            out.innerHTML = renderAiText(res.data.text, res.data.improved || null) + aiSourceNoteGemini();
            const b = out.querySelector('.ai-fix-btn'); if (b) b._aiFix = res.data.improved;
          } else {
            out.innerHTML = '<div class="ai-out">🌐 <b>AI backend ulanmagan yoki xato</b> (' + escapeHtml(res.message || res.source) + '). ' +
              'Hozircha LOCAL yordamchi (autocomplete, hint, xato topish) to‘liq ishlaydi.</div>' + aiSourceNote();
          }
        }).catch(e => {
          out.innerHTML = '<div class="ai-out bad">🌐 <b>AI backendga ulanmadi</b> (' + escapeHtml(String(e && e.message || e)) + ').</div>' + aiSourceNote();
        });
      }
    });
  }
}

/* ============ PUBLIC API ============ */
window.ITTestAI = {
  attachEditor: attachEditor,
  attachLessonExercise: attachLessonExercise,
  bindCodingPanel: bindCodingPanel,
  setLessonContext: setLessonContext,
  getLessonContext: getLessonContext,
  extractLessonKeywords: extractLessonKeywords,
  getCodeAssistance: getCodeAssistance,
  explainCode: explainCode,
  findIssues: findIssues,
  buildHints: buildHints,
  nextStep: nextStep,
  getSuggestions: getSuggestions
};

// Coding editorlarini avtomatik ulash (dedupe ichida — qayta chaqirish xavfsiz)
function autoAttachCodingEditors() {
  ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'].forEach(lang => {
    const ta = document.getElementById(lang + 'Editor');
    if (ta) attachEditor(ta, lang);
  });
  bindCodingPanel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoAttachCodingEditors);
} else {
  autoAttachCodingEditors();
}












