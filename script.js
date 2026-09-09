/* ==========================================================
   IT/AI TEST PLATFORM — Vanilla JavaScript
   ========================================================== */

'use strict';

/* ====================== SUBJECTS META (9 FAN) ====================== */

const SUBJECTS = [
  { name: 'Python', icon: '🐍', description: 'Python dasturlash asoslari va ilg\'or tushunchalar' },
  { name: 'JavaScript', icon: '⚡', description: 'Web dasturlash tili — DOM, ES6+, Async' },
  { name: 'Java', icon: '☕', description: 'Universal OOP tili — Collections, JVM' },
  { name: 'C++', icon: '🔧', description: 'Tizim dasturlash — OOP, STL, Pointerlar' },
  { name: 'C#', icon: '🔷', description: '.NET ekotizimi — OOP, LINQ, Async' },
  { name: 'HTML', icon: '🌐', description: 'Web sahifa tuzilishi — Semantic, Forms' },
  { name: 'CSS', icon: '🎨', description: 'Web sahifa stillari — Flex, Grid, Responsive' },
  { name: 'SQL', icon: '🗄', description: 'Ma\'lumotlar bazasi — JOIN, GROUP BY, INDEX' },
  { name: 'AI', icon: '🤖', description: 'Sun\'iy intellekt — ML, NN, NLP' },
];

const DIFFICULTY_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const DIFF_COUNT = { beginner: 3, intermediate: 3, advanced: 3 };
const QUESTIONS_PER_TEST = 10;
const TEST_DURATION_SEC = 10 * 60;

/* ====================== SAVOLLAR BANKI (REAL SAVOLLAR) ====================== */
/* JSON fayllardan yuklanadi */

const Q_BANK = {};

const FALLBACK_Q_BANK = {
  Python: {
    beginner: [
      { q: 'Python nima?', o: ['Dasturlash tili', 'Python — yuqori darajadagi, oson o‘qitiladigan dasturlash tili', 'Databaza', 'Markup'], c: 1, e: 'Python ko‘p soha uchun ishlatiladi: web, AI, avtomatlashtirish.' },
      { q: 'print() funksiyasi nima qiladi?', o: ['Fayl yaratadi', 'Matnni konsolga chiqaradi', 'Baza yaratadi', 'Dizayn ishlatadi'], c: 1, e: 'print() — ma’lumotni ekranga chiqarish funksiyasi.' },
      { q: 'Python-da o‘zgaruvchi e’lon qilish usuli?', o: ['var x = 5', 'x = 5', 'int x = 5', 'let x = 5'], c: 1, e: 'Python-da turini yozmasdan x = 5 kabi e’lon qilinadi.' }
    ],
    intermediate: [
      { q: 'List comprehension nima?', o: ['Oddiy ro‘yxat', 'Ro‘yxatni qisqa yozish usuli', 'Fayl tanlash', 'For loop emas'], c: 1, e: 'U yangi ro‘yxatni kompakt tarzda yaratadi.' },
      { q: 'Lambda funksiyasi nima?', o: ['Bitta satrlik anonim funksiya', 'Dastur boshlovchi', 'O‘zgaruvchi turi', 'Mantiqiy if'], c: 0, e: 'Lambda qisqa, nomsiz funksiyadir.' },
      { q: 'Exception handling uchun qaysi kalit so‘z ishlatiladi?', o: ['catch', 'try/except', 'throw', 'switch'], c: 1, e: 'try/except Python-da xatolarni ushlab qolish uchun ishlatiladi.' }
    ],
    advanced: [
      { q: 'Generator nima?', o: ['Har bir qiymatni ketma-ket yaratadigan obyekt', 'Qayta ishlanmaydigan funksiyasi', 'Mavjud emas', 'Yangi class'], c: 0, e: 'Generator qiymatlarni on-demand tarzda beradi.' },
      { q: 'Decorator nima?', o: ['Funksiyani o‘ramlovchi vosita', 'Klass turi', 'HTML tag', 'SQL operator'], c: 0, e: 'Decorator funksiyani qadoqlab qo‘shimcha xatti-harakat qo‘shadi.' }
    ]
  },
  JavaScript: {
    beginner: [
      { q: 'JavaScript qayerda ishlatiladi?', o: ['Web sahifa interaktivligi va dinamikasi', 'SQL ma’lumotlar bazasi', 'Bash fayl', 'CSS'], c: 0, e: 'JS veb sahifalarga interaktivlik, backend (Node.js) va boshqa joylarda ishlatiladi.' },
      { q: "const bilan e’lon qilingan o‘zgaruvchini keyin o‘zgartirish mumkinmi?", o: ["Ha, har doim", "Yo‘q (qayta assignment mumkin emas)", "Faqat stringda", "Faqat funksiya ichida"], c: 1, e: "const bilan qaysi qiymatga ishora qilish o‘zgarmaydi (reference ni o'zgartirib bo'lmaydi)." },
      { q: "=== operatori nima qiladi?", o: ["Qiymat VA ma’lumot turini qat’iy solishtiradi (strict equality)", "Qiymatni solishtiradi (type coercion bilan)", "Faqat stringlarni taqqoslaydi", "Faktorialni hisoblaydi"], c: 0, e: "=== — strict equality: qiymat ham, type ham mos kelishi kerak. == esa type coercion qiladi." }
    ],
    intermediate: [
      { q: 'setTimeout nima qiladi?', o: ['Vaqtdan keyin funksiyani ishga tushiradi', 'Faylni o‘chiradi', 'Baza bilan bog‘lanadi', 'CSS yaratadi'], c: 0, e: 'U belgilangan sondan keyin callbackni chaqiradi.' },
      { q: 'Promise nima?', o: ['Asenkron vazifa uchun obyekt', 'HTML elementi', 'O‘zgarmas qiymat', 'Dastur uzunligi'], c: 0, e: 'Promise kelajakdagi natija uchun hold space yaratadi.' },
      { q: 'Array.map() nima qaytaradi?', o: ['Original array', 'Transform qilingan yangi array', 'Bitta element', 'Boolean'], c: 1, e: 'map() har element bo‘yicha qayta ishlovchi yangi array qaytaradi.' }
    ],
    advanced: [
      { q: 'Async/await nima uchun kerak?', o: ['Asenkron kodni sinxron ko‘rinishda yozish', 'Xatolarni olib tashlash', 'HTML ushlab olish', 'Yangi variable'], c: 0, e: 'async/await Promise bilan ishlashni osonlashtiradi.' },
      { q: 'Closure nima?', o: ['Funksiya tashqaridagi o‘zgaruvchilarni eslab qolish', 'O‘zgaruvchi turi', 'CSS class', 'DOM event'], c: 0, e: 'Closure ichki funksiya tashqi scopega murojaat qilishi mumkin.' }
    ]
  },
  Java: {
    beginner: [
      { q: 'Java dasturlash tilining asosiy xususiyati?', o: ['Platform independent', 'SQL', 'HTML', 'CSS'], c: 0, e: 'Java bytecode orqali platformaga bog‘liq bo‘lmagan tarzda ishlaydi.' },
      { q: 'class nima?', o: ['Obyekt uchun shablon', 'Fayl turi', 'CSS stili', 'Sizning ism'], c: 0, e: 'Class — obyektlarni yaratish uchun template.' },
      { q: 'main() metodida qaysi qiymat qaytariladi?', o: ['void', 'int', 'char', 'float'], c: 0, e: 'main() void yoki int bo‘lishi mumkin, lekin odatda void.' }
    ],
    intermediate: [
      { q: 'interface nima?', o: ['Shartnoma/kontrakt', 'Database table', 'HTML tag', 'CSS selector'], c: 0, e: 'Interface obyektlar qanday xatti-harakatga ega bo‘lishi kerakligini belgilaydi.' },
      { q: 'ArrayList va LinkedList farqi?', o: ['ArrayList indexli va tezkor, LinkedList qo‘shish/olish bilan qulayroq', 'Biri faqat int', 'Biri faqat string', 'Bir xil'], c: 0, e: 'Har bir strukturada ishlash tezligi farq qiladi.' },
      { q: 'Exception qachon paydo bo‘ladi?', o: ['Dastur xatolik yuz berganda', 'Fayl ochilmaganda', 'HTML renderda', 'SQL so‘rovda'], c: 0, e: 'Runtime xatolar Exception orqali boshqariladi.' }
    ],
    advanced: [
      { q: 'Generics nima?', o: ['Tur parametrli klasslar/metodlar', 'HTML generator', 'SQL adapter', 'DOM event'], c: 0, e: 'Generics kodni umumiy va xavfsiz qilishga yordam beradi.' },
      { q: 'Stream API nima qiladi?', o: ['Ma’lumotlar ustida deklarativ ishlov berish', 'Faylni o‘chirish', 'CSS ishlatish', 'Uzun so‘zlarni chop etish'], c: 0, e: 'Streamlar ma’lumotlarni filtratsiya, xaritalash va kamaytirish uchun ishlatiladi.' }
    ]
  },
  'C++': {
    beginner: [
      { q: 'C++ ning asosiy afzalligi nima?', o: ['Yuqori tezlik va quvvatli control', 'Faqat veb ishlatish', 'Barcha ma’lumotlarni bashorat qilish', 'Statik HTML'], c: 0, e: 'C++ performans va low-level control bilan mashhur.' },
      { q: 'Namespace nima?', o: ['Nomlar maydoni', 'O‘zgaruvchi turi', 'Dastur boshlovchi', 'HTML atributi'], c: 0, e: 'Namespace funksiyalar va o‘zgaruvchilar nomlarini ajratishga yordam beradi.' },
      { q: 'cout nima?', o: ['Konsolga chiqish uchun stream', 'O‘qish funksiyasi', 'Fayl so‘ruvchi', 'Loop'], c: 0, e: 'cout standard output uchun ishlatiladi.' }
    ],
    intermediate: [
      { q: 'Pointer nima?', o: ['O‘zgaruvchining manzili', 'String turi', 'Xatolik', 'Function'], c: 0, e: 'Pointer boshqa obyekt manzilini saqlaydi.' },
      { q: 'Reference nima?', o: ['O‘zgaruvchiga boshqa nom', 'Mantiqiy if', 'Web element', 'SQL join'], c: 0, e: 'Reference bir obyektga ishora qiladi va boshqa nom sifatida ishlatiladi.' },
      { q: 'STL nima?', o: ['Standart kutubxona', 'Dastur nomi', 'HTML library', 'C++ teglari'], c: 0, e: 'STL umumiy ma’lumotlar tuzilmalari va algoritmlarni ta’minlaydi.' }
    ],
    advanced: [
      { q: 'Move semantics nima?', o: ['Resursni ko‘chirish, ko‘paytirmasdan', 'CSS animatsiya', 'HTML DOM', 'Debugger'], c: 0, e: 'Move semantics qiymatlar ko‘chirilishni optimallashtiradi.' },
      { q: 'RAII nima?', o: ['Resursni avto boshqarish patterni', 'Loop turi', 'Dastur test', 'Fayl skaneri'], c: 0, e: 'Resource Acquisition Is Initialization — resurslar obyekt hayoti bilan boshqariladi.' }
    ]
  },
  'C#': {
    beginner: [
      { q: 'C# qaysi ekotizimga tegishli?', o: ['.NET', 'Node', 'Ruby', 'Django'], c: 0, e: 'C# .NET uchun asosiy til hisoblanadi.' },
      { q: 'var nima?', o: ['Kompyuter turlari', 'Kompilyatsiya vaqtida aniqlanadigan lokal o‘zgaruvchi', 'SQL operator', 'HTML tag'], c: 1, e: 'var kompilyator tomonidan tur aniqlanadi.' },
      { q: 'namespace nima?', o: ['Nomlar maydoni', 'HTML atributi', 'Baza jadvali', 'Xatolik'], c: 0, e: 'Namespace kodni tashkil qilishga yordam beradi.' }
    ],
    intermediate: [
      { q: 'LINQ nima?', o: ['Query syntax for collections', 'O‘qish operatori', 'Yangi class', 'CSS animatsiya'], c: 0, e: 'LINQ ma’lumotlar ustida deklarativ so‘rovlar qiladi.' },
      { q: 'async/await nima uchun ishlatiladi?', o: ['Asenkron operatsiyalar', 'HTML render', 'SQL bog‘lanish', 'Sizning ism'], c: 0, e: 'Asenkron kodni oson va toza yozishga yordam beradi.' },
      { q: 'class va record farqi?', o: ['record data-oriented value type bo‘lib, class referens type', 'Faqat biri mavjud', 'Ikkalasi bir xil', 'Class HTML'], c: 0, e: 'record odatda ma’lumotlarni saqlash uchun ishlatiladi.' }
    ],
    advanced: [
      { q: 'Delegat nima?', o: ['Metodga murojaat qiladigan tip', 'HTML element', 'Dizayn template', 'SQL constraint'], c: 0, e: 'Delegatlar funksiyalarni qadoqlash uchun ishlatiladi.' },
      { q: 'Task nima?', o: ['Asenkron ish uchun tasdiqlangan obyekt', 'CSS rule', 'HTML table', 'DOM event'], c: 0, e: 'Task asenkron vazifalarni boshqarishga yordam beradi.' }
    ]
  },
  HTML: {
    beginner: [
      { q: 'HTML nima?', o: ['Web sahifa tuzilishi', 'Dasturlash tili', 'DB', 'CSS'], c: 0, e: 'HTML veb sahifalarning tarkibini belgilaydi.' },
      { q: '<h1> tagi nima uchun ishlatiladi?', o: ['Sarlavha', 'Button', 'Form', 'Table'], c: 0, e: 'h1 eng katta sarlavha tagidir.' },
      { q: 'Alt atributi qanday maqsadda ishlatiladi?', o: ['Rasm uchun muqobil matn', 'CSS rang', 'JS event', 'Table border'], c: 0, e: 'alt — rasm ko‘rinmasa, uning o‘rniga matn ishlatiladi.' }
    ],
    intermediate: [
      { q: 'Semantic HTML elementlari qanday?', o: ['header, main, section, footer', 'color, font, border', 'let, const, var', 'array, object'], c: 0, e: 'Semantic taglar struktura va ma’noni aniqroq bildiradi.' },
      { q: 'form elementining maqsadi nima?', o: ['Foydalanuvchi ma’lumotlarini yuborish', 'Rasm chizish', 'Qayta ishlash', 'CSS rang berish'], c: 0, e: 'Form foydalanuvchi ma’lumotlarini serverga yuboradi.' },
      { q: 'meta charset nima qilish uchun kerak?', o: ['Brauzerga kodlashni aytib beradi', 'CSS qo‘shadi', 'JS funktsiyasini yuritadi', 'Dastur boshlaydi'], c: 0, e: 'charset matnni to‘g‘ri ko‘rsatish uchun muhim.' }
    ],
    advanced: [
      { q: 'Accessibility nima?', o: ['Kirish imkoniyati va qulaylik', 'Sukur', 'Yangi JS library', 'Dizayn rang'], c: 0, e: 'Accessibility har bir foydalanuvchiga qulay foydalanish imkonini yaratadi.' },
      { q: 'aria-* atributi qaysi maqsadda ishlatiladi?', o: ['Aksesiblilik atributi', 'CSS class', 'SQL constraint', 'JS variable'], c: 0, e: 'aria-* ekran o‘qiydigan texnologiyalar uchun qo‘shimcha ma’lumot beradi.' }
    ]
  },
  CSS: {
    beginner: [
      { q: 'CSS nima?', o: ['Web sahifasining uslubi', 'Dasturlash tili', 'Database query', 'Server',], c: 0, e: 'CSS sahifa ko‘rinishi va layoutni boshqaradi.' },
      { q: 'color xossasi nima ishlatiladi?', o: ['Matn rangi', 'Fayl turi', 'Baza nomi', 'HTML element'], c: 0, e: 'color — matn rangi.' },
      { q: 'margin va padding farqi?', o: ['margin tashqi bo‘shliq, padding ichki bo‘shliq', 'Ular bir xil', 'padding faqat text', 'margin faqat input'], c: 0, e: 'margin element tashqarisiga, padding ichki yuzasiga ta’sir qiladi.' }
    ],
    intermediate: [
      { q: 'Flexbox nima?', o: ['Bir o‘lchovli layout usuli', 'DB query', 'JS framework', 'HTML list'], c: 0, e: 'Flexbox elementlarni bir qator/ustunda joylashtirish uchun qulay.' },
      { q: 'Grid nima?', o: ['2D layout tizimi', 'Database engine', 'Move function', 'Regex'], c: 0, e: 'CSS Grid 2D joylashtirish imkonini beradi.' },
      { q: 'Media query nima?', o: ['Responsive design uchun shart', 'JavaScript loop', 'HTML tag', 'Server config'], c: 0, e: 'Media queries ekran o‘lchamiga qarab uslubni o‘zgartiradi.' }
    ],
    advanced: [
      { q: 'Pseudo-element nima?', o: ['Element ichidagi vizual dekoratsiya', 'HTML tag', 'Databaza', 'Tugma'], c: 0, e: '::before va ::after misol bo‘ladi.' },
      { q: 'CSS cascade nima?', o: ['Uslub ustunligi/priority qoidasi', 'JS chaqiriq', 'Server render', 'SQL join'], c: 0, e: 'Cascade bir nechta uslublar bir-birini chetlab chiqadi.' }
    ]
  },
  SQL: {
    beginner: [
      { q: 'SQL nima?', o: ['Ma’lumotlar bazasi uchun so‘rov tili', 'JavaScript library', 'CSS framework', 'Operating system'], c: 0, e: 'SQL structured query language hisoblanadi.' },
      { q: 'SELECT nima qiladi?', o: ['Ma’lumotlarni tanlash', 'Faylni o‘chirish', 'Rang o‘zgartirish', 'HTML yaratish'], c: 0, e: 'SELECT jadvaldan ustunlar va qatorlarni tanlaydi.' },
      { q: 'WHERE nima?', o: ['Shart filtri', 'Xatolik', 'Atributlar', 'Loop'], c: 0, e: 'WHERE ma’lumotlarni shartga ko‘ra ajratadi.' }
    ],
    intermediate: [
      { q: 'JOIN nima?', o: ['Jadvallarni birlashtirish', 'Array length', 'Loop condition', 'CSS border'], c: 0, e: 'JOIN ikki yoki undan ko‘p jadvalni bog‘lash uchun ishlatiladi.' },
      { q: 'GROUP BY nima?', o: ['Guruhlab jamlash', 'O‘chirish', 'Yangi jadval', 'Vaqt hisoblash'], c: 0, e: 'GROUP BY natijalarni guruhga ajratadi.' },
      { q: 'HAVING nima?', o: ['Guruh natijalariga shart', 'CSS property', 'JS variable', 'Loop'], c: 0, e: 'HAVING GROUP BY dan keyin filtr uyg‘otadi.' }
    ],
    advanced: [
      { q: 'INDEX nima?', o: ['Ma’lumotlar tezligini oshiradigan indeks', 'HTML tag', 'CSS rule', 'JS object'], c: 0, e: 'INDEX qidiruv tezligini yaxshilaydi.' },
      { q: 'NORMALIZATION nima?', o: ['Ma’lumotlarni tuzish va takrorlanishni kamaytirish', 'Dizayn', 'Proxy', 'Event'], c: 0, e: 'Normalization ma’lumotlarni aniq va barqaror strukturaga keltiradi.' }
    ]
  },
  AI: {
    beginner: [
      { q: 'AI nima?', o: ['Sun’iy intellekt', 'Database format', 'CSS library', 'Server language'], c: 0, e: 'AI kompyuterlarning aql bilan ishlashini simulyatsiya qilishga urinishdir.' },
      { q: 'Machine learning nima?', o: ['Ma’lumotlardan o‘rganish', 'HTML yasash', 'Fayl tekshirish', 'Dizayn'], c: 0, e: 'ML model ma’lumotlar asosida namuna o‘rganadi.' },
      { q: 'Dataset nima?', o: ['O‘rganish uchun ma’lumotlar to‘plami', 'Baza jadvallari', 'CSS uslublar', 'Dizayn chizig‘i'], c: 0, e: 'Dataset modelni o‘rgatish uchun kerak bo‘ladi.' }
    ],
    intermediate: [
      { q: 'Overfitting nima?', o: ['Model o‘rgangan ma’lumotlarga juda moslashib, yangi ma’lumotlarda yomon ishlashi', 'Dastur xatoligi', 'HTML xatosi', 'Loop'], c: 0, e: 'Overfitting modelni umumlashtrishda yomonlashadi.' },
      { q: 'Feature nima?', o: ['O‘rganishda foydalaniladigan atribut', 'Fayl turi', 'CSS klassi', 'API shartnomasi'], c: 0, e: 'Feature — modelga kiruvchi xususiyat.' },
      { q: 'Neural network nima?', o: ['Aqliy model qavatlaridan tashkil topgan struktura', 'SQL operator', 'HTML layout', 'DB engine'], c: 0, e: 'NN ma’lumotlar ichidan naqshlarni o‘rganadi.' }
    ],
    advanced: [
      { q: 'Transformer nima?', o: ['NLP uchun kuchli arxitektura', 'CSS framework', 'DB index', 'Server library'], c: 0, e: 'Transformer attention mexanizmi asosida ishlaydi.' },
      { q: 'Prompt engineering nima?', o: ['LLMga aniq so‘rov berish', 'Fayl yuklash', 'Database optimization', 'CSS animation'], c: 0, e: 'Promptlash LLMdan kerakli javob olish samaradorligini oshiradi.' }
    ]
  }
};

/* ====================== DYNAMIC OPTION SHUFFLING & BALANCING ENGINE ====================== */
function prepareShuffledQuestions(questions) {
  if (!Array.isArray(questions) || !questions.length) return [];

  // Deep clone questions to avoid mutating original source bank
  const cloned = JSON.parse(JSON.stringify(questions));

  // Create a sequence of balanced target answer positions (0, 1, 2, 3 -> A, B, C, D)
  const basePositions = [0, 1, 2, 3];
  const targetPositions = [];
  while (targetPositions.length < cloned.length) {
    const shuffledBlock = basePositions.slice().sort(() => Math.random() - 0.5);
    targetPositions.push(...shuffledBlock);
  }

  return cloned.map((q, idx) => {
    if (!q.o || !Array.isArray(q.o) || q.o.length < 2) return q;

    const originalCorrectIndex = (q.c !== undefined && q.c >= 0 && q.c < q.o.length) ? q.c : 0;
    const correctOptionText = q.o[originalCorrectIndex];
    const distractors = q.o.filter((_, i) => i !== originalCorrectIndex);
    const shuffledDistractors = distractors.sort(() => Math.random() - 0.5);

    const targetPos = targetPositions[idx] % q.o.length;
    const newOptions = [];
    let distractorCounter = 0;

    for (let i = 0; i < q.o.length; i++) {
      if (i === targetPos) {
        newOptions.push(correctOptionText);
      } else {
        newOptions.push(shuffledDistractors[distractorCounter++] || '');
      }
    }

    return {
      ...q,
      o: newOptions,
      c: targetPos
    };
  });
}

function ensureBank(subjectName) {
  if (!Q_BANK[subjectName]) {
    Q_BANK[subjectName] = { beginner: [], intermediate: [], advanced: [] };
  }
  if (subjectName === 'C++' && !Q_BANK['CPlusPlus']) Q_BANK['CPlusPlus'] = Q_BANK[subjectName];
  if (subjectName === 'C#' && !Q_BANK['CSharp']) Q_BANK['CSharp'] = Q_BANK[subjectName];
}

function normalizeQuestionText(text) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/* Remove invalid questions and duplicates (by unique ID-ish normalized text). */
function dedupeQuestions(pool, testLabel) {
  const seen = new Set();
  const out = [];
  for (const q of (pool || [])) {
    if (!q || !q.q || !Array.isArray(q.o) || q.o.length !== 4) {
      console.error(`[TEST ERROR] ${testLabel}: invalid question skipped:`, q);
      continue;
    }
    if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) {
      console.error(`[TEST ERROR] ${testLabel}: missing correct answer, skipped:`, q.q);
      continue;
    }
    const key = normalizeQuestionText(q.q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

/* Validate a built test. Logs clear errors, returns list of problems. */
function validateTest(test) {
  const problems = [];
  if (!test) { problems.push('test mavjud emas'); return problems; }
  if (!test.id) problems.push('test ID mavjud emas');
  if (!Array.isArray(test.questions)) { problems.push('questions mavjud emas'); return problems; }
  if (test.questions.length !== QUESTIONS_PER_TEST)
    problems.push(`Expected ${QUESTIONS_PER_TEST} questions, Found ${test.questions.length}`);
  const ids = new Set(), texts = new Set();
  test.questions.forEach((q, i) => {
    if (!q || !q.q) { problems.push(`Savol #${i + 1}: matn mavjud emas`); return; }
    const key = normalizeQuestionText(q.q);
    if (ids.has(key)) problems.push(`Savol #${i + 1}: DUPLICATE savol: "${q.q}"`);
    ids.add(key);
    if (texts.has(key)) problems.push(`Savol #${i + 1}: DUPLICATE matn`);
    texts.add(key);
    if (!Array.isArray(q.o) || q.o.length !== 4) problems.push(`Savol #${i + 1}: 4 ta variant yo'q`);
    else if (new Set(q.o).size !== 4) problems.push(`Savol #${i + 1}: variantlar duplicate`);
    if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) problems.push(`Savol #${i + 1}: to'g'ri javob noto'g'ri`);
  });
  if (test.subject && test.difficulty && !DIFFICULTY_LABELS[test.difficulty])
    problems.push(`level noto'g'ri: ${test.difficulty}`);
  if (problems.length)
    console.error(`[TEST ERROR] ${test.title || test.id}\n  ` + problems.join('\n  '));
  return problems;
}

/*
  Build tests from a subject/level question pool.
  RULES:
   - duplicate questions removed (never repeat questions inside a test)
   - only COMPLETE chunks of 10 unique questions become tests
   - a test is NEVER padded by repeating questions
*/
function buildTestsFromPool(subjectName, diff, pool) {
  const tests = [];
  const clean = dedupeQuestions(pool, `${subjectName} ${diff}`);
  const total = Math.floor(clean.length / QUESTIONS_PER_TEST);
  for (let t = 0; t < total; t++) {
    const qs = clean.slice(t * QUESTIONS_PER_TEST, (t + 1) * QUESTIONS_PER_TEST);
    const test = {
      id: `${subjectName}-${diff}-${t + 1}`,
      subject: subjectName,
      difficulty: diff,
      number: t + 1,
      title: `${DIFFICULTY_LABELS[diff]} Test ${t + 1}`,
      questionCount: qs.length,
      durationSec: TEST_DURATION_SEC,
      questions: qs,
    };
    validateTest(test);
    tests.push(test);
  }
  if (clean.length % QUESTIONS_PER_TEST !== 0 && clean.length > 0) {
    console.warn(`[TEST WARN] ${subjectName} ${diff}: ${clean.length % QUESTIONS_PER_TEST} ortiqcha savol — to'liq 10 lik test bo'lmagani uchun test yaratilmadi (duplicate padding TAQIQLANGAN).`);
  }
  return tests;
}

function rebuildAllTests() {
  const all = {};
  for (const sbj of SUBJECTS) {
    ensureBank(sbj.name);
    const bank = Q_BANK[sbj.name];
    const tests = [];
    if (!bank) {
      all[sbj.name] = [];
      continue;
    }
    for (const diff of ['beginner', 'intermediate', 'advanced']) {
      tests.push(...buildTestsFromPool(sbj.name, diff, bank[diff] || []));
    }
    all[sbj.name] = tests;
  }
  return all;
}

Object.assign(Q_BANK, FALLBACK_Q_BANK);

/* ====================== JSON LOADER ====================== */
async function loadQuestionBank() {
  try {
    const subjects = ['python', 'javascript', 'java', 'cpp', 'csharp', 'html', 'css', 'sql', 'ai'];

    for (const subject of subjects) {
      try {
        const response = await fetch(`./data/${subject}.json`);
        if (!response.ok) continue;

        const data = await response.json();

        const keyMap = {
          'python': 'Python',
          'javascript': 'JavaScript',
          'java': 'Java',
          'cpp': 'CPlusPlus',
          'csharp': 'CSharp',
          'html': 'HTML',
          'css': 'CSS',
          'sql': 'SQL',
          'ai': 'AI'
        };

        const key = keyMap[subject];
        if (key && data) {
          const merged = {
            beginner: data.beginner || [],
            intermediate: data.intermediate || [],
            advanced: data.advanced || []
          };
          const current = Q_BANK[key] || { beginner: [], intermediate: [], advanced: [] };
          /* JSON data has priority — dedupe so no duplicate questions can enter pools */
          const seen = new Set();
          const mergeLevel = (fallbackArr, jsonArr) => {
            const out = [];
            for (const q of [...(jsonArr || []), ...(fallbackArr || [])]) {
              const k = normalizeQuestionText(q && q.q);
              if (!k || seen.has(k)) continue;
              seen.add(k);
              out.push(q);
            }
            return out;
          };
          Q_BANK[key] = {
            beginner: mergeLevel(current.beginner, merged.beginner),
            intermediate: mergeLevel(current.intermediate, merged.intermediate),
            advanced: mergeLevel(current.advanced, merged.advanced)
          };
        }
      } catch (e) {
        console.debug(`Failed to load ${subject}.json (using fallback):`, e.message);
      }
    }

    Q_BANK['C++'] = Q_BANK['C++'] || Q_BANK['CPlusPlus'] || { beginner: [], intermediate: [], advanced: [] };
    Q_BANK['C#'] = Q_BANK['C#'] || Q_BANK['CSharp'] || { beginner: [], intermediate: [], advanced: [] };
    Q_BANK['CPlusPlus'] = Q_BANK['CPlusPlus'] || Q_BANK['C++'];
    Q_BANK['CSharp'] = Q_BANK['CSharp'] || Q_BANK['C#'];

    console.log('Question bank loaded:', Object.keys(Q_BANK));

    try {
      if (typeof ALL_TESTS !== 'undefined') {
        const rebuilt = rebuildAllTests();
        for (const k of Object.keys(rebuilt)) ALL_TESTS[k] = rebuilt[k];
        console.log('ALL_TESTS rebuilt after JSON load.');
      }
    } catch (e) {
      console.warn('ALL_TESTS rebuild skipped:', e);
    }
  } catch (error) {
    console.error('Error loading question bank:', error);
  }
}

loadQuestionBank();

/* Question banks are loaded from JSON files and custom banks below. */

/* SQL (90) */
Q_BANK["SQL"] = {
  beginner: [
    { q: "SQL nima?", o: ['Dasturlash', 'Structured Query Language (ma\'lumotlar bazasi so\'rov)', 'OOP tili', 'Markup'], c: 1, e: "MBD bilan ishlash tili." },
    { q: "Barcha ustunlarni olish:", o: ['SELECT #', 'SELECT * FROM users;', 'ALL FROM users', 'FETCH users'], c: 1, e: "* = all columns." },
    { q: "Muayyan ustun:", o: ['DISPLAY name', 'SELECT name, age FROM users;', 'GET name', 'users.name'], c: 1, e: "SELECT col, col FROM table." },
    { q: "Filtr WHERE:", o: ['FILTER BY', "SELECT * FROM u WHERE age > 18;", 'age > 18', 'LIMIT 18'], c: 1, e: "WHERE conditions." },
    { q: "AND / OR:", o: ['&&', "WHERE age>18 AND city='Tosh'", 'AND', '+ OR'], c: 1, e: "Logical operators." },
    { q: "Unique (takrorlanmas) qiymatlar:", o: ['DIFFERENT', 'SELECT DISTINCT city FROM u;', 'UNIQUE', 'SEPARATE'], c: 1, e: "DISTINCT duplicates remove." },
    { q: "ORDER BY sort:", o: ['SORT', 'SELECT * FROM u ORDER BY age DESC; name ASC', 'GROUP', 'RANK'], c: 1, e: "ASC kichkattan, DESC kattadan." },
    { q: "LIMIT:", o: ['ROWNUM', "SELECT * FROM u LIMIT 10 OFFSET 20; → 3-sahifa, 10", 'COUNT LIMIT', 'FIRST 10'], c: 1, e: "Offset pagination MySQL/Postgres." },
    { q: "LIKE qidiruv:", o: ['MATCH', "SELECT * FROM u WHERE name LIKE 'A%'; (A bilan boshlanish)", 'EQUAL', 'REGEXP'], c: 1, e: "% → any chars; _ → one char." },
    { q: "IN operator:", o: ['LIST', "SELECT * FROM u WHERE id IN (1,3,5);", 'RANGE', 'BETWEEN'], c: 1, e: "IN (list) shorthand OR." },
    { q: "BETWEEN oralig\'i:", o: ['>= AND <=', 'WHERE age BETWEEN 18 AND 30; inclusive', 'RANGE', 'INTERVAL'], c: 1, e: "Inclusive ikkala tomondan." },
    { q: "IS NULL:", o: ['= NULL', "WHERE email IS NULL; IS NOT NULL emas = NULL ishlamaydi", 'NULL =', 'NONE'], c: 1, e: "NULL — IS NULL/ IS NOT NULL." },
    { q: "COUNT —", o: ['Yig\'indi', 'SELECT COUNT(*) FROM u; — qatorlar soni', 'TOTAL', 'LEN'], c: 1, e: "Aggregate COUNT, SUM, AVG, MIN, MAX." },
    { q: "SUM (yig\'indi):", o: ['SUM', 'SELECT SUM(amount) FROM orders;', 'ADD', 'TOTAL'], c: 1, e: "SUM — numeric total." },
    { q: "AVG (o\'rtacha):", o: ['MEDIAN', "SELECT AVG(price) FROM products; → o\'rtacha", 'AVERAGE()', 'MEAN'], c: 1, e: "Average aggregate." },
    { q: "MIN / MAX:", o: ['extremes', 'SELECT MIN(price), MAX(price) FROM p;', 'LOW HIGH', 'BOTTOM TOP'], c: 1, e: "Min, max values." },
    { q: "AS alias:", o: ['NAME', "SELECT COUNT(*) AS cnt FROM u; alias nom", 'LABEL', 'RENAME'], c: 1, e: "Column/table alias." },
    { q: "INSERT:", o: ['ADD', "INSERT INTO users(name, age) VALUES('Ali', 20);", 'NEW', 'STORE'], c: 1, e: "INSERT new row." },
    { q: "UPDATE:", o: ['MODIFY', "UPDATE u SET age=21 WHERE id=1;", 'CHANGE', 'EDIT'], c: 1, e: "Update WHERE shart majbur." },
    { q: "DELETE:", o: ['REMOVE', "DELETE FROM u WHERE id=1; WHERE majbur barchasini o\'chirmaslik uchun", 'DROP', 'TRUNCATE'], c: 1, e: "Delete rows WHERE critical." },
    { q: "CREATE TABLE:", o: ['MAKE TABLE', 'CREATE TABLE x(id INT, name VARCHAR(50));', 'NEW TABLE', 'DEFINE TABLE'], c: 1, e: "DDL CREATE TABLE." },
    { q: "PRIMARY KEY:", o: ['Unique index', "Har bir qatorni unikal identifikatsiya; NOT NULL + UNIQUE birga", 'Duplicate', 'Optional'], c: 1, e: "PK identity." },
    { q: "FOREIGN KEY:", o: ['Self key', "Boshqa jadval PK ga bog\'lanadi; referensial integrity", 'Index', 'Unique'], c: 1, e: "FK relationships." },
    { q: "NOT NULL ustun:", o: ['Empty', "Majburiy to\'ldirish (NULL bo\'lmaydi)", 'Blank', 'Default'], c: 1, e: "Column constraint." },
    { q: "UNIQUE:", o: ['PK faqat', "Qiymatlar unikal (takrorlanmas); NULL lar (ba'zi DB) → ko\'p", 'Same PK', 'Auto'], c: 1, e: "Unique constraint duplicates oldini." },
    { q: "AUTO_INCREMENT / SERIAL / IDENTITY:", o: ['Manual id', "Avtomatik PK raqam (o\'zi oshiradi): id INT AUTO_INCREMENT PRIMARY KEY", 'Sequence', 'Trigger'], c: 1, e: "Auto ID generation." },
    { q: "DEFAULT qiymat:", o: ['0 faqat', "DEFAULT 'active' — kiritmasa shu qiymatni oladi", 'Required', 'NULL default'], c: 1, e: "Default column value." },
    { q: "ALTER TABLE ustun qo\'shish:", o: ['ADD COLUMN', 'ALTER TABLE u ADD COLUMN email VARCHAR(100);', 'NEW COLUMN', 'UPDATE COL'], c: 1, e: "DDL alter add column." },
    { q: "DROP TABLE:", o: ['Clear rows', "Jadvalni butunlay o\'chiradi (sistema, hamma narsa); DELETE emas", 'Clear', 'EMPTY'], c: 1, e: "Drop deletes structure + data." },
    { q: "TRUNCATE:", o: ['Drop', "Hamma qatorni o\'chiradi(tez, log ko\'p emas); rollback yo\'q ba'zi DB", 'Delete all', 'Same as DELETE'], c: 1, e: "Faster but structure saqlaydi." },
  ],
  intermediate: [
    { q: "GROUP BY — nima uchun?", o: ['Sort', "Aggregate ni guruhlash: SELECT city, COUNT(*) FROM u GROUP BY city;", 'PARTITION', 'ORDER'], c: 1, e: "Group by aggregate groups." },
    { q: "HAVING (groupdan keyin filtr):", o: ['WHERE', "GROUP BY dan keyin: HAVING COUNT(*) > 5; WHERE group oldi", 'After order', 'Filter row'], c: 1, e: "HAVING filter after aggregation." },
    { q: "JOIN (inner join):", o: ['Cartesian', "SELECT * FROM orders JOIN users ON orders.user_id = users.id; → ikkala to\'g\'ri", 'UNION', 'MERGE'], c: 1, e: "INNER JOIN — common." },
    { q: "LEFT JOIN:", o: ['Same inner', "Chap jadval BARCHA qatorlari; o\'ngdagi mos emaslar NULL (orders left join users)", 'RIGHT', 'CROSS'], c: 1, e: "LEFT = LEFT OUTER." },
    { q: "RIGHT JOIN:", o: ['Left opposite', "O'ng jadval barcha; chap mos kelmasa NULL", 'INNER', 'FULL'], c: 1, e: "Right outer join." },
    { q: "FULL OUTER JOIN:", o: ['Inner', "Ikkala tomon barcha qatorlar; mos kelmasa NULL (MySQL yo\'q; Postgres/MSSQL bor)", 'Cross', 'Left only'], c: 1, e: "All rows both tables." },
    { q: "UNION (ikala SELECT birlashma):", o: ['JOIN', "SELECT ... UNION SELECT ... → duplicate olib tashlaydi; UNION ALL qoladi", 'JOIN ALL', 'CROSS'], c: 1, e: "Vertical concat result sets." },
    { q: "Subquery (ichki so\'rov):", o: ['Temp', "SELECT * FROM o WHERE id IN (SELECT id FROM ...); — nested", 'Join', 'Function'], c: 1, e: "Inner query → outer where/in." },
    { q: "CASE WHEN (sql if/else):", o: ['IIF', "SELECT CASE WHEN age<18 THEN 'minor' ELSE 'adult' END FROM u;", 'Switch', 'Logic'], c: 1, e: "Conditional expression." },
    { q: "COALESCE —:", o: ['Empty', "COALESCE(a, b, c) → birinchi bo\'lmagan NULL; ISNULL/IFNULL alternative", 'Merge', 'Concat'], c: 1, e: "Null fallback chain." },
    { q: "CAST / CONVERT:", o: ['Type change', "CAST('42' AS INT) → tur o\'zgartirish", 'Format', 'Transform'], c: 1, e: "Type casting." },
    { q: "CONCAT:", o: ['+ string', "CONCAT(first, ' ', last) — birlashtirish; + MSSQL da", '||', 'Append'], c: 1, e: "String concatenation function." },
    { q: "UPPER / LOWER:", o: ['Proper', 'UPPER(name) / LOWER(name) — katta-kichik harf', 'INITCAP', 'CASE'], c: 1, e: "Text normalize case." },
    { q: "LEN / LENGTH / CHAR_LENGTH:", o: ['Size', "Belgilar soni: LENGTH(name)", 'SIZE', 'COUNT chars'], c: 1, e: "String length." },
    { q: "INNER JOIN 3 jadval:", o: ['Mumkin emas', "SELECT ... FROM a JOIN b ON a.id=b.a_id JOIN c ON c.b_id=b.id", 'Only 2', 'UNION 3'], c: 1, e: "Multi-table joins." },
    { q: "Self join (o\'z-o\'ziga):", o: ['Impossible', "Xodim va menejer jadval: JOIN emp m ON emp.mgr_id = m.id", 'Recursive CTE', 'Cross'], c: 1, e: "Hierarchy self-join." },
    { q: "EXISTS:", o: ['IN faqat', "WHERE EXISTS (SELECT 1 FROM o WHERE o.user_id = u.id) — boolean, tez", 'HAVING', 'CONTAINS'], c: 1, e: "Efficiency: found row stop." },
    { q: "Index:", o: ['Rang', "CREATE INDEX idx_u_name ON users(name); → qidirish tez", 'Slow', 'View'], c: 1, e: "Speeds WHERE/JOIN/SORT." },
    { q: "Composite index:", o: ['Multiple index', "CREATE INDEX ON u(city, age) → bir necha ustun; order zarur", 'Separated', 'Unique only'], c: 1, e: "Multi column index order." },
    { q: "View:", o: ['Temp table', "CREATE VIEW v AS SELECT ...; — virtual jadval (saqlangan so\'rov)", 'Snapshot', 'Function'], c: 1, e: "View — saved query." },
    { q: "LIMIT bilan sahifalash offset — katta table:", o: ['Always optimal', "OFFSET katta bo\'lganda sekin; keyset pagination (WHERE id>lastid LIMIT)", 'Fast all', 'Row_number'], c: 1, e: "Seek method = keyset pagination." },
    { q: "LIKE '%pattern%' — index:", o: ['Index always', "Boshi % bo\'lsa B-tree index ishlamaydi (full scan); → FULL TEXT INDEX", 'Fast start', 'Binary search'], c: 1, e: "Leading wildcard disables range index." },
    { q: "UNIQUE INDEX:", o: ['Same PK', "UNIQUE INDEX → dublikat oldini, lekin bir dona NULL (DB ga qarab)", 'PK same', 'Clustered'], c: 1, e: "Uniqueness via index." },
    { q: "Transactions COMMIT/ROLLBACK:", o: ['Auto commit', "BEGIN TRANSACTION; ... COMMIT — yig\'ib yubor; ROLLBACK — qaytar", 'Flush', 'Save'], c: 1, e: "ACID unit." },
    { q: "ACID nima:", o: ['Backup', "Atomicity Consistency Isolation Durability — trans xususiyatlari", 'Index', 'Lock'], c: 1, e: "Reliability properties." },
    { q: "Isolation levels (Read Uncommitted → Serializable):", o: ['Concurrency', "Tushirishlar (phantom/nonrepeatable/dirty) ni kamaytirish; selectivi → serializable", 'Only locks', 'Durability'], c: 1, e: "Read phenomena + isolation levels." },
    { q: "Window function ROW_NUMBER():", o: ['Group', "SELECT row_number() OVER(ORDER BY date) FROM o; → raqam; GROUP emas", 'Rank group', 'Auto increment'], c: 1, e: "Window functions analytic." },
    { q: "OVER (PARTITION BY):", o: ['Group by', "Guruh bo\'yicha (PARTITION BY city) — har bir guruh uchun window", 'Order', 'Frame'], c: 1, e: "Partition per group." },
    { q: "RANK() vs DENSE_RANK:", o: ['No diff', 'RANK: 1,1,3; DENSE_RANK: 1,1,2 (tenglashdan keyin qisqartmas)', 'Same row_number', 'Ordinal'], c: 1, e: "Rank variants ties." },
    { q: "CTE Common Table Expression:", o: ['Subquery', "WITH monthly AS (SELECT ...) SELECT * FROM monthly; — qulay nomlangan so\'rov", 'Temp table variable', 'Nested view'], c: 1, e: "WITH clause, recursive CTE too." },
  ],
  advanced: [
    { q: "Recursive CTE:", o: ['Loop', "WITH RECURSIVE cat AS (SELECT ... UNION ALL SELECT ... FROM cat WHERE ...) — hierarchy", 'Cursor loop', 'While'], c: 1, e: "Categories/org trees recursion." },
    { q: "Materialized View:", o: ['View', "Fizik saqlangan (diskda); REFRESH MATERIALIZED VIEW — tez o\'qish, oldindan hisoblash", 'Virtual', 'Index'], c: 1, e: "Postgres/Oracle materialized views." },
    { q: "Clustered vs Non-clustered index:", o: ['Same perf', "Clustered: jadvallarning o\'zi order saqlanadi (PK); Nonclustered: boshqa joyda", 'Covering', 'Heap'], c: 1, e: "SQL Server/ InnoDB PK clustered." },
    { q: "Covering index:", o: ['Heavy', "So\'rov barcha kerakli ustunlarni indexdan o\'qiydi; key lookup yo\'q", 'All cols clustered', 'Full scan'], c: 1, e: "Include all needed cols." },
    { q: "Index fragmentation:", o: ['Good', "Page split bo\'lganda; REBUILD/REORGANIZE — skanerlash sekinlash", 'Speedup', 'Always rebuild'], c: 1, e: "Maintenance defrag." },
    { q: "Plan Explain/EXPLAIN ANALYZE:", o: ['Debugging', "So\'rov ijro rejasi — qaysi index, scan, join order; optimize", 'Syntax check', 'Profile'], c: 1, e: "EXPLAIN slow query fix." },
    { q: "N+1 query problemi:", o: ['Join', "Loop har bir user uchun order so\'raydi; → JOIN yoki IN bir necha; ORMda eager loading", 'Batch', 'Cached'], c: 1, e: "ORM common fix: includes." },
    { q: "Denormalization:", o: ['Always bad', "Normallashtirish teskari — join kamaytirish, read performance oshirish; write sekinroq", '3NF', 'No joins'], c: 1, e: "Read-heavy systems." },
    { q: "3NF (Third Normal Form):", o: ['Any', "Transitive functional dependency yo\'q → har bir key va nothing but key", 'Denormal', 'First NF'], c: 1, e: "Reduce redundancy / anomalies." },
    { q: "Deadlock:", o: ['Lock one', "Ikki transaction bir-birining lockini kutilishi; (DB o\'zi kill qilsa, retry)", 'Lost update', 'Read lock'], c: 1, e: "Circular wait solution order/acquire." },
    { q: "Optimistic vs Pessimistic locking:", o: ['Same lock', "Optimistic: version/date check (ko\'p conflict bo\'lmasa); Pessimistic: SELECT ... FOR UPDATE", 'Shared', 'Exclusive'], c: 1, e: "Concurrency control approach." },
    { q: "SELECT ... FOR UPDATE (row lock):", o: ['Read lock', "Qatorlarni exclusive lock; boshqa transaction update/read blocked", 'Share lock', 'Intent lock'], c: 1, e: "Pessimistic concurrency." },
    { q: "Sharding:", o: ['Partition', "Jadvalni ko\'p serverlarga (range/hash) — katta scale", 'Split column', 'Backup shard'], c: 1, e: "Horizontal partitioning." },
    { q: "Partitioning:", o: ['Shard server', "Table ni qismlarga (range/list/hash) — bitta serverda, logik qismlarga", 'Index', 'Temp split'], c: 1, e: "Single DB partition." },
    { q: "Replication: Primary/Replica (master/slave):", o: ['Backup only', "Primary write; replica reads → read scaling; async/semi sync", 'Sharding', 'Clustering'], c: 1, e: "Replication for scale reads/DR." },
    { q: "Stored procedure:", o: ['SQL function', "DB da saqlangan parametrli sql kod/procedure; execute", 'Script file', 'External'], c: 1, e: "Server-side procedural SQL." },
    { q: "Trigger:", o: ['Schedule', "INSERT/UPDATE/DELETE avtomatik ishga tushuvchi callback funksiyasi", 'Stored proc', 'Event scheduler'], c: 1, e: "Auto logic events." },
    { q: "JSON ustun (MySQL Postgres JSONB):", o: ['Text only', "Schemaless saqlash; Postgres JSONB index + qidiruv; query JSON_EXTRACT", 'XML', 'Serialized blob'], c: 1, e: "Semi-structured JSON columns." },
    { q: "Full-text search: MATCH/AGAINST MySQL yoki tsvector Postgres:", o: ['LIKE %', "Natural til qidiruv (to\'xtatuvchi so\'zlar, so\'zlar), indeks; FAST textsearch", 'Regex', '='], c: 1, e: "Full text specialized indexes." },
    { q: "Temporal tables (System-Versioned):", o: ['Snapshot', "Har qator tarixini saqlaydi (valid_from/to); oldingi holatlarni qaytarish mumkin", 'Backup', 'SCD1'], c: 1, e: "SQL:2011 built-in history." },
    { q: "BULK INSERT/COPY:", o: ['Row row', "Ommaviy yuklash: COPY table FROM '/tmp/data.csv' CSV HEADER; → tez", 'Meger', 'Batch insert'], c: 1, e: "Minimal logging bulk." },
    { q: "Upsert: INSERT ... ON CONFLICT (Postgres) yoki ON DUPLICATE KEY UPDATE (MySQL):", o: ['Insert only', "Qator mavjud bo\'lsa UPDATE → INSERT; merge qismi", 'Replace', 'Save'], c: 1, e: "Idempotent write upsert." },
    { q: "MERGE statement (SQL:2003):", o: ['Insert delete', "MERGE INTO target USING src WHEN MATCHED UPDATE WHEN NOT MATCH INSERT — 'upsert' plus", 'Combine tables', 'Union'], c: 1, e: "SQL standard merge/upsert." },
    { q: "Sargable query (Search ARGument):", o: ['Any condition', "WHERE func(col) = 5 emas; col = 5 → indexdan foydalansa (sargable)", 'All index used', 'Projections'], c: 1, e: "Make WHERE/index-friendly." },
    { q: "Query Store (MSSQL) / pg_stat_statements:", o: ['Logs', "So\'rovlar statistikasi: runtime, freq, plan regressiya; identify slow query", 'Audit', 'Crash'], c: 1, e: "Monitor slow/top queries." },
    { q: "Row Level Security (RLS Postgres):", o: ['Grant only', "CREATE POLICY ... ON tbl TO role USING(user_id = current_user_id); qator filtrlash", 'Column mask', 'App only'], c: 1, e: "Fine-grained per-row DB security." },
    { q: "Dynamic SQL / SQL Injection:", o: ['No risk', "Parametrize! PREPARE/EXECUTE / mysqli bind param; string concat → SQLi hujum", 'Escaping only', 'Admin only'], c: 1, e: "Always use prepared statements parameter binding." },
    { q: "Two-phase commit (2PC) — distributed:", o: ['Single DB', "Ko\'p DB bo\'ylab trans → prepare (o\'z commit tayyor) + commit yoki rollback; atomik", 'Sharding', 'ACID single'], c: 1, e: "Distributed transaction protocol." },
    { q: "MVCC Multi-Version Concurrency Control (Postgres/InnoDB):", o: ['Locks only', "Har transaction o\'z versiyasini ko\'radi → kamroq lock; readers writers block emas", 'Pessimistic lock', 'Single version'], c: 1, e: "Non-blocking MVCC high concurrency." },
    { q: "Write-Ahead Logging (WAL):", o: ['Crash', "Har o\'zgarish avval log → save (durability, crash recovery consistent)", 'Binlog only', 'Slow'], c: 1, e: "Durability mechanism (Postgres pg_wal)." },
  ]
};

/* AI (90) */
Q_BANK["AI"] = {
  beginner: [
    { q: "AI nima?", o: ['Robots faqat', 'Artificial Intelligence — kompyuterga odamga o\'xshash qobiliyat', 'O\'yinlar', 'Web'], c: 1, e: "Sun'iy intellekt — odam kabi o\'ylash/maslahat." },
    { q: "ML nima (Machine Learning):", o: ['Hard code', "AI turi — aniq dasturlashdan ko\'ra DATA dan o\'rganish", 'Robotics', 'Games'], c: 1, e: "Machine learning data-driven patterns." },
    { q: "Supervised o\'rganish nazorat ostida:", o: ['Label yo\'q', "Labeled (javoblari yozilgan) data → predict: klassifikatsiya/regressiya", 'Clustering', 'Reward'], c: 1, e: "Supervised — known answers train." },
    { q: "Classification klassifikatsiya:", o: ['Raqam', "Kategoriya (label): spam/ham, mushuk/it; diskret", 'Continuous', 'Clustering'], c: 1, e: "Discrete classes predict." },
    { q: "Regression regressiya:", o: ['Kategor', "Raqamli bashorat: uylar narxi, ob-havo; continuous qiymat", 'Classification', 'Clustering'], c: 1, e: "Predict real-valued output." },
    { q: "Unsupervised nazoratsiz:", o: ['Javobli', "Yozuvli yo\'q (labelsiz data): klasterlash (guruhlash)", 'Reward', 'Predict'], c: 1, e: "Find hidden structure unlabeled." },
    { q: "Clustering klaster:", o: ['Predict', "Xuddi shundaylarga ajratish: K-Means — guruhlash", 'Label', 'Classification'], c: 1, e: "Group similar items automatically." },
    { q: "Reinforcement Learning (RL):", o: ['Javoblar', "Agent = muvozanat → reward (mukofot)/jarima → optimal strategiya", 'Labelled train', 'None'], c: 1, e: "Trial and error reward." },
    { q: "Dataset: Train / Test split —", o: ['All train', "Train (o\'rganish: ~70-80%) va test unseen data (20-30%) — overfit oldini olish", 'Same as training', 'Validation=Test'], c: 1, e: "Generalization check holdout." },
    { q: "Accuracy aniqlik:", o: ['Only positive', 'Umumiy to\'g\'rilik: (TP + TN) / barchasi', 'Precision', 'Recall'], c: 1, e: "Overall correctness metric." },
    { q: "Train data overfit:", o: ['Good', "Aniq train data go\'zal, test yomon — yodlash o\'rgangan emas", 'High bias', 'Underfit'], c: 1, e: "Memorization → poor generalize." },
    { q: "Underfit:", o: ['Complex', "Model juda sodda; ham train ham test yomon", 'High variance', 'Overfitting'], c: 1, e: "Too simple can't capture pattern." },
    { q: "Deep Learning —", o: ['AI same', "ML turi — katta sonli neyron tarmoqlar (hidden layers) → complex patterns", 'Simple regression', 'Symbolic'], c: 1, e: "DL neural networks multi hidden layers." },
    { q: "NLP (Natural Language Processing):", o: ['Rasm', "Tabiiy tillar bilan ishlash (matn, nutq) — OCR, translate, chatbot", 'Audio', 'Computer vision'], c: 1, e: "NLP language tasks." },
    { q: "Computer Vision (CV):", o: ['Matn', "Rasmlar/video: aniqlash, klassifikatsiya, segmentation", 'Robotics', 'NLP'], c: 1, e: "CV visual understanding." },
    { q: "Feature engineering:", o: ['Auto', "Model uchun raw data → yaxshi xususiyatlar (xususiyatlar) yaratish; model performansga katta ta'sir", 'Training only', 'Hyperparameters'], c: 1, e: "Quality features critical perf." },
    { q: "Normalization/Standardization:", o: ['Scale', "Xususiyatlarni (0-1 yoki mean=0, std=1) scale → gradient descent (RFM) tez, optimal", 'Outliers', 'Encode'], c: 1, e: "Numeric scaling for stability." },
    { q: "Missing values:", o: ['Drop always', "Average/median to\'ldirish; yoki model impute; kam bo\'lsa drop qator/ustun", 'Zero always', 'Delete all'], c: 1, e: "Handling NaN data cleaning." },
    { q: "K-Nearest Neighbors (KNN):", o: ['Linear', "Teng qo\'shni K ta (eng yaqin) ga qarab klass/raqam", 'Param', 'Tree'], c: 1, e: "Instance-based lazy classifier." },
    { q: "Linear Regression:", o: ['Discrete', "To\'g\'ri chiziq fit: y = w·x + b → bashorat (continuous)", 'Classification', 'Nonlinear'], c: 1, e: "Fits straight line to data." },
    { q: "Logistic Regression:", o: ['To\'g\'ri chiziqli', "Klassifikatsiya (0/1) uchun — sigmoid orqali probability [0,1]", 'Regression faqat', 'Clustering'], c: 1, e: "Despite name: classifier." },
    { q: "Decision Tree:", o: ['Lines faqat', "Shoxli qaror — if/else savollar zanjiri; interpret, overfit easy", 'Black box', 'Linear'], c: 1, e: "Flow-chart like tree model." },
    { q: "Random Forest:", o: ['Single decision', "Ko\'p decision trees ensemble → ovoz (majority vote) — kamroq overfit, kuchli", 'Gradient boosting', 'Boosted'], c: 1, e: "Ensemble bagged trees." },
    { q: "Neuron: ANN unit (perceptron) —", o: ['Logic', "Inputs + weights → sum + activation → output; biological neuron inspiration", 'Memory', 'CPU core'], c: 1, e: "Artificial neuron building block." },
    { q: "Activation function ReLU:", o: ['Zero', "f(x)=max(0,x); nonlinearity; DL da keng ishlatiladi", 'Sigmoid only', 'Linear'], c: 1, e: "Rectified linear unit most common." },
    { q: "Sigmoid (0-1):", o: ['Regression', "0-1 oralig\'i; probability → binary classification oxiri", 'Linear', 'Vector'], c: 1, e: "Squash to probability." },
    { q: "Softmax (ko\'p sinf):", o: ['Sum 0', "N ta sinf ehtimollari = 1; multi-class classification oxiri", 'One hot', 'Sigmoid'], c: 1, e: "Normalized exp class prob." },
    { q: "Loss function (cost):", o: ['Reward', "Model noto\'g\'riligini o\'lchash → minimize uchun (MSE, cross-entropy)", 'Accuracy', 'Score'], c: 1, e: "Objective to minimize during training." },
    { q: "Gradient Descent:", o: ['Search', "Lossni kamaytirish uchun weightlarni step-step (learning rate) yangilash", 'Random', 'Brute force'], c: 1, e: "Optimize weights via derivatives." },
    { q: "Epoch — DL:", o: ['Batch', "BUTUN train data 1 marta model o\'tgani (iterations soni batches)", 'Mini-batch', 'Update'], c: 1, e: "Whole dataset pass count." },
  ],
  intermediate: [
    { q: "Precision (aniqlik):", o: ['All real', "Predicted positive ichidan HAQIQIY positive: TP / (TP+FP); spamni kam xato belgilash", 'Recall', 'Accuracy'], c: 1, e: "Low FP → minimize false alarms." },
    { q: "Recall (sensitivity):", o: ['Predicted', "Real positive ichidan topilgan: TP/(TP+FN); kasallikni tashxiso\'t o\'tkazmaslik", 'Specificity', 'Precision'], c: 1, e: "Find all positives minimize false negatives." },
    { q: "F1-score:", o: ['Avg p-r', "Precision va Recall garmonik o\'rtacha: 2*P*R/(P+R); imbalanced data yaxshi", 'Sum', 'Max'], c: 1, e: "Balance precision/recall." },
    { q: "Confusion Matrix:", o: ['Score', "TP TN FP FN → 2x2 (yoki multi-class) matritsa; barcha metriclar shu asosida", 'Probability', 'ROC'], c: 1, e: "Table of predictions vs actuals." },
    { q: "ROC-AUC:", o: ['Cutoff', "Thresholdlar o\'rtasidagi silliq grafik AUC = 1 → best; 0.5 random; 0 teskari", 'MSE', 'Log loss'], c: 1, e: "Area under receiver op curve." },
    { q: "Cross-Validation (K-fold):", o: ['Only split', "5-fold: 5 qism; har birida 1 test, 4 train → yanada ishonchli natija", 'Holdout only', 'Overfit'], c: 1, e: "Better estimate generalization." },
    { q: "Stratified k-fold:", o: ['Random', "Har fold sinf nisbatini saqlaydi (imbalanced) — yaxshi", 'Regression faqat', 'Shuffle'], c: 1, e: "Class balance across folds." },
    { q: "Hyperparameters:", o: ['Weights', "Modeldan TASHQARI tanlanadigan: learning rate, depth, n_estimators → Grid/RandomSearchCV", 'Learned params', 'Features'], c: 1, e: "Tuning search best config." },
    { q: "Regularization L1 L2:", o: ['Complexity', "Overfit ni kamaytirish: L1(Lasso sparse), L2(Ridge — weight penalize)", 'Data augm', 'Batch norm'], c: 1, e: "Reduce weights → simpler model." },
    { q: "Learning rate — too high / too low:", o: ['Any', "Too high → diverge/oscillate; too low → slow/stuck local min; → lr schedule", 'Only small', 'No impact'], c: 1, e: "Critical tuning hyperparameter." },
    { q: "Dropout:", o: ['Batch norm', "Train paytida random ba'zi neuronlarni o\'chirib → overfit kamaytirish (ensemble ta'siri)", 'Weight decay', 'Shuffle'], c: 1, e: "DL regularization technique." },
    { q: "Batch Normalization:", o: ['Standardize', "Hamma layer ichidagi activations ni normallashtirish → tez, stabil train", 'Input only', 'Dropout'], c: 1, e: "Internal covariate shift fix." },
    { q: "CNN Convolutional NNet:", o: ['Text faqat', "Computer vision uchun — convolution layerlar → local pattern, translation invariance", 'RNN', 'Transformers'], c: 1, e: "CV architecture conv filters." },
    { q: "Pooling layer (Max/Mean):", o: ['Upsample', "O'lchamni kamaytirish (downsample), robust bo\'lish → translation", 'Convolve', 'Flatten'], c: 1, e: "Feature invariance + dim reduction." },
    { q: "RNN (Recurrent NNet):", o: ['Feed forward', "Sequential (text/vaqt) — hidden state o\'tishi; LSTM/GRU memory gradient vanish ni bartaraf", 'CNN', 'Attention'], c: 1, e: "Time sequence handling." },
    { q: "LSTM Long Short-Term Memory:", o: ['RNN better', "RNN ga o\'xshaydi; unutish (forget/update/output) darvozalar → uzoq bog\'lanish", 'Feedforward', 'CNN seq'], c: 1, e: "Gated memory RNN." },
    { q: "GRU:", o: ['LSTM variant', "LSTM soddalashtirilgan; kamroq parametr, tez — bazi tasks yaxshi", 'ConvRNN', 'Transformer'], c: 1, e: "Gated recurrent unit simplified." },
    { q: "Embeddings (so\'z vektorlar):", o: ['One hot', "So\'zlarni dense low-dim vektorlarga (word2vec, GloVe); semantic yaqinlik = geometrik", 'Sparse', 'TF-IDF'], c: 1, e: "Dense semantic word vectors." },
    { q: "Word2Vec (Skip-gram / CBOW):", o: ['Count', "Neural embedding; Skip-gram: word→context, CBOW context→target", 'TF-IDF', 'Co-occurrence'], c: 1, e: "Neural word embeddings." },
    { q: "BERT (Encoder Transformer):", o: ['Autoregressive', "Google bidirectional encoder; NLP uchun (text classification, QA, NER) base", 'GPT family', 'Decoder-only'], c: 1, e: "Bidirectional encoder reps." },
    { q: "Attention mechanism:", o: ['All same', "Qaysi input qismiga e'tibor (weighted) → katta input (translation) hotfix long dependency", 'RNN only', 'CNN'], c: 1, e: "Core idea transformers — dynamic focus." },
    { q: "Self-Attention / Scaled Dot-product:", o: ['Self query', "Q(K, V) = softmax(QK^T/sqrt(d_k)) · V — transformer core; paralell", 'Seq', 'Recurrent'], c: 1, e: "Foundation attention equation." },
    { q: "Transformer arxitektura:", o: ['RNN seq', "Attention Is All You Need — Encoder+Decoder stack; parallel; NLP SOTA", 'LSTM only', 'CNN seq'], c: 1, e: "State of the art architecture." },
    { q: "Tokenization (NLP):", o: ['Words', "Textni tokenlarga (word/subword/char) — BPE byte pair encoding; Transformer da keng", 'Lemmatize', 'Vectorize'], c: 1, e: "Text → ids for embedding." },
    { q: "GPT (Generative Pre-trained Transformer):", o: ['Encoder', "Decoder-only Autoregressive; keyingi so\'z (token) bashorat; ChatGPT/GPT-x foundation", 'BERT-like', 'Bidirectional'], c: 1, e: "Decoder causal LM." },
    { q: "Prompt Engineering:", o: ['Hardcode prompt', "LLMga aniq natija olish uchun so\'rov (prompt)ni yaxshilash; in-context learning few-shot", 'Train model', 'Fine tune'], c: 1, e: "Design prompts for LLM output quality." },
    { q: "Fine-tuning:", o: ['From scratch', "Oldindan o\'rgatilgan (pre-trained) modelni yangi task/yangi data bilan keyingi o\'rgatish", 'Zero shot', 'Prompt only'], c: 1, e: "Adapt pretrained to custom task." },
    { q: "Data Augmentation:", o: ['Duplicate', "Train data sonini (transforms) ko\'paytirish; rasmlar: flip/crop/rotate/color → kamroq overfit", 'More epochs', 'Cleaning'], c: 1, e: "Artificial dataset enlargement." },
    { q: "Transfer Learning:", o: ['From scratch', "Pre-trained modelni yangi data → darhol yaxshi natija (kam data + tez)", 'Zero', 'Random init'], c: 1, e: "Reuse representation weights." },
    { q: "Object Detection: YOLO / R-CNN:", o: ['Classification faqat', "Rasm ichida ob'ektni sinf + ramka (bounding box) aniqlash", 'Semantic segmentation', 'Landmarks'], c: 1, e: "Detect + localize." },
  ],
  advanced: [
    { q: "Semantic / Instance segmentation:", o: ['Box only', "Semantic: har bir piksel sinf; Instance: alohida obyekt har birini", 'Detect only', 'Key-points'], c: 1, e: "Pixel-level visual understanding." },
    { q: "Diffusion models (Stable Diffusion):", o: ['GANs', "Shovqinni bosqichma-bosqich yo\'qotish orqali generate → so\'zlar/rasm; SOTA image", 'VAE faqat', 'Autoregressive'], c: 1, e: "Denoising diffusion probabilistic models generative." },
    { q: "GANs (Generative Adversarial):", o: ['One net', "Generator (yasash) va Discriminator (ajratish) bir-biri bilan o\'ynash → haqiqiy fake", 'VAE', 'Flow'], c: 1, e: "Adversarial minmax game." },
    { q: "VAE Variational Autoencoder:", o: ['Dimensionality', "Encoder → latent gauss distrib → Decoder; generative model continuous latent space", 'Discriminative', 'Random forest'], c: 1, e: "Latent variational inference." },
    { q: "LoRA Low-Rank Adaptation:", o: ['Full fine-tune', "LLM ni ozgina parametr (rank) ni train; keng (Stable Diffusion, LLM) → kichkina fayl va tez", 'Full param', 'Adapter only'], c: 1, e: "PEFT — parameter-efficient." },
    { q: "RLHF (Reinforcement Learning Human Feedback):", o: ['Reward model', "Inson feedback → reward model → PPO LLM → foydalanuvchi xohishiga moslash (ChatGPT)", 'RL env only', 'Self-supervised'], c: 1, e: "Human preference alignment." },
    { q: "PPO Proximal Policy Optimization:", o: ['DQN', "Policy gradient RL — policy updates cheklab; stabil + sample efficient; ChatGPT RLHF", 'Monte carlo', 'QLearning'], c: 1, e: "On-policy RL clipped surrogate." },
    { q: "RAG (Retrieval-Augmented Generation):", o: ['Train only', "LLM javobdan AVVAL yangi/hujjatlar qidir (retrieval) → promptga qo\'sh → generate; bilim va to\'g\'rilikni oshir", 'Fine tune all', 'Long context'], c: 1, e: "Reduce hallucinations by grounding docs." },
    { q: "Vector Embeddings qidiruv (ANN):", o: ['LIKE text', "So\'z/random → vectorlar (embedding); yaqinlik topish FAISS/Annoy/pgvector; RAG asos", 'Keyword search', 'SQL contains'], c: 1, e: "Semantic similarity search via vector DB." },
    { q: "Quantization (LLM int8 / int4):", o: ['Full precision', "32-bit float → 8/4 bit integer; kichik xotira, kamroq tezlik va aniqlik; on-device LLM", 'Only prune', 'Distill'], c: 1, e: "Compress model low bitwidth inference." },
    { q: "Knowledge Distillation:", o: ['Ensemble', "Katta model (teacher) → kichkina (student) o\'rgatish; deploy kichkina, fast", 'LoRA', 'Prune'], c: 1, e: "Compress → smaller mimic teacher." },
    { q: "Mixture of Experts (MoE):", o: ['All params', "Expertlardan (layer) faqat aktiv bir nechtasini forward → katta model lekin har bir token pastki hisoblash", 'Small model', 'Dense'], c: 1, e: "Sparse large models GShard / Switch." },
    { q: "Flash Attention:", o: ['IO bound', "GPU HBM → SRAM qismlarga bo\'lib attention → faster, less memory; LLM train/infer oshirish", 'Exact', 'Fp16 only'], c: 1, e: "IO-aware tiling attention kernel." },
    { q: "KV Cache (generation LLM):", o: ['Every time recompute', "Keyingi token uchun Key/Value larni saqlab, qayta hisoblashni yo\'q → tez inference", 'No memory', 'Only encoder'], c: 1, e: "Autoregressive caching decode step." },
    { q: "Speculative Decoding:", o: ['Slow', "Kichkina draft model → several tokens; Katta model tekshir parallel → speed oshirish (lossless)", 'Single token', 'Quant'], c: 1, e: "Guess + verify faster autoregressive." },
    { q: "AI Hallucination:", o: ['Confident lie', "Model qayta ishonchli ko\'rinishda noto\'g\'ri ma'lumot (tahminiy) → RAG/facts check kamaytir", 'Creative', 'True data'], c: 1, e: "Confident plausible but wrong output." },
    { q: "Responsible AI / Fairness:", o: ['Accuracy', "Model kamsituvchi guruhlarga nisbatan xatolik farqi → fairness metrics, auditing", 'Speed only', 'Big data'], c: 1, e: "Avoid bias discrimination." },
    { q: "Explainable AI (XAI): SHAP / LIME:", o: ['Black box', "Nima uchun model bu javobni berishini izohlaydigan usullar — global/local feature", 'Perf only', 'Interpret bad'], c: 1, e: "Post-hoc explanation methods." },
    { q: "Adversarial Attacks:", o: ['Noise small', "Kichik (ko\'zga ko\'rinmas) noise → noto\'g\'ri classify; robustness train", 'Big changes', 'Outliers'], c: 1, e: "Subtle imperceptible perturbations fool model." },
    { q: "Federated Learning:", o: ['Central data', "Data serverga yig\'masdan, qurilmalarda lokal train, faqat model parameter → privacy (mobile/saqlov)", 'All data in one', 'Peer to peer'], c: 1, e: "Privacy-preserving distributed training." },
    { q: "Differential Privacy:", o: ['Anonim', "Query natijalariga shovqin qo\'shish → oddiy odamning ma'lumotini aniqlash qiyin; epsilon delta", 'Hashing', 'Encrypt'], c: 1, e: "Formal mathematical privacy guarantee." },
    { q: "AI Alignment:", o: ['Task faqat', "Model xatti-harakatlari inson qoidalari/values (good) mos kelishi; safety research", 'Accuracy fit', 'Reward spec'], c: 1, e: "Make AI do what humans intend safely." },
    { q: "AGI (Artificial General Intelligence):", o: ['AI hozir', "Yaxshi — eng turli vazifalarda inson darajasi intellekt; hozircha yo\'q (farq narrow AI)", 'LLM today', 'Cheksiz'], c: 1, e: "Broad general human-level capability." },
    { q: "Gradient Clipping:", o: ['Regularization', "Exploding oldini olish — gradient norm chek → DL RNN/Transformer train stability", 'Weight decay', 'Clip weight'], c: 1, e: "Max gradient magnitude norm clipping." },
    { q: "Residual Connections (ResNet):", o: ['Deepen', "Skip-addition x = F(x) + x → 100+ layer train (gradient vanish oldini)", 'Only CNN', 'DenseNet cat'], c: 1, e: "Residual learning enable very deep nets." },
    { q: "Adam Optimizer:", o: ['SGD fixed lr', "Adaptive moment estimation — RMSprop+momentum; tez konvergensiya, default DL opt", 'Newton', 'Adagrad only'], c: 1, e: "Most common adaptive optimizer deep learning." },
    { q: "A/B testing model:", o: ['Offline metrics', "Yangi modelni A guruhi yangi, B eski va real foydalanuvchilar → keyin compare online metric", 'Local test only', 'Eval set'], c: 1, e: "Online real-world validation before full rollout." },
    { q: "Feature Attribution (Integrated Gradients, LRP):", o: ['XAI', "Aytish — qaysi input pixel/word model javobiga maksimal ta'sir etganligini aniqlab ko\'rsatish", 'Saliency', 'Shap/LIME only'], c: 1, e: "Input feature contribution for specific prediction." },
    { q: "LangChain / LlamaIndex (AI frameworks):", o: ['Train', "LLM + tools (RAG, agents, chains, memory) dasturlarini tuzish uchun framework", 'Framework only UI', 'Fine tune UI'], c: 1, e: "LLM orchestration tools agents/RAG." },
    { q: "Tool use / Function calling (LLM):", o: ['Only text', "Model → JSON function nomi + argument → code/API execute → natija LLMga qaytib javob", 'No external', 'Prompt only'], c: 1, e: "LLM integrates tools/apis via structured calls." },
  ]
};

/* ====================== ALIASES (nom moslash) ====================== */
Q_BANK["C++"] = Q_BANK["CPlusPlus"] || Q_BANK["C++"];
Q_BANK["C#"] = Q_BANK["CSharp"] || Q_BANK["C#"];

/* ====================== ALL_TESTS REGISTRY ====================== */
function createTestsForSubject(subjectName) {
  const bank = Q_BANK[subjectName];
  if (!bank) { console.warn("No Q_BANK for:", subjectName); return []; }
  const tests = [];
  for (const diff of ["beginner", "intermediate", "advanced"]) {
    tests.push(...buildTestsFromPool(subjectName, diff, bank[diff] || []));
  }
  return tests;
}

const ALL_TESTS = {};
Object.assign(ALL_TESTS, rebuildAllTests());

function findTestById(id) {
  for (const s of SUBJECTS) {
    const t = (ALL_TESTS[s.name] || []).find(x => x.id === id);
    if (t) return t;
  }
  return null;
}

/* ====================== TEST UNLOCK PROGRESS ====================== */
function getSubjectTestOrder(subjectName) {
  const order = [];
  for (const diff of ["beginner", "intermediate", "advanced"]) {
    const count = DIFF_COUNT[diff];
    for (let t = 1; t <= count; t++) {
      order.push(`${subjectName}-${diff}-${t}`);
    }
  }
  return order;
}

function ensureUserTestProgress(user) {
  if (!user) return {};
  if (!user.testProgress || typeof user.testProgress !== "object") {
    user.testProgress = {};
  }
  for (const sbj of SUBJECTS) {
    const order = getSubjectTestOrder(sbj.name);
    if (order.length && !(order[0] in user.testProgress)) {
      user.testProgress[order[0]] = "unlocked";
    }
  }
  return user.testProgress;
}

function isTestUnlocked(user, testId) {
  if (!user) return false;
  const progress = ensureUserTestProgress(user);
  return progress[testId] === "unlocked" || progress[testId] === "completed";
}

function isTestCompleted(user, testId) {
  if (!user) return false;
  const progress = ensureUserTestProgress(user);
  return progress[testId] === "completed";
}

function markTestCompletedAndUnlockNext(user, completedTestId) {
  if (!user) return null;
  const progress = ensureUserTestProgress(user);
  if (progress[completedTestId] === "completed") return null;

  progress[completedTestId] = "completed";

  const subject = completedTestId.split("-").slice(0, -2).join("-") ||
    SUBJECTS.find(s => completedTestId.startsWith(s.name))?.name;
  const subjectName = (() => {
    for (const s of SUBJECTS) if (completedTestId.startsWith(s.name + "-")) return s.name;
    return null;
  })();
  if (!subjectName) return null;

  const order = getSubjectTestOrder(subjectName);
  const idx = order.indexOf(completedTestId);
  if (idx === -1 || idx >= order.length - 1) return null;

  const nextId = order[idx + 1];
  if (!(nextId in progress) || progress[nextId] === "locked") {
    progress[nextId] = "unlocked";
    userStatsMemo.delete(user);
    return nextId;
  }
  return null;
}

/* ====================== DOM / STORAGE HELPERS ====================== */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

/* ====================== STORE CATALOG ====================== */
const STORE_ITEMS = [
  { id: 'avatar_neon', name: '👤 Neon Avatar', type: 'avatar', price: 180, rarity: 'rare', icon: '🧑‍🚀', description: 'Neon qahramon avatari', unlockReq: null },
  // Hats
  { id: 'hat_basic', name: '🎩 Classic Hat', type: 'hat', price: 100, rarity: 'common', icon: '🎩', description: 'Klassik shlyapa', unlockReq: null },
  { id: 'hat_crown', name: '👑 Royal Crown', type: 'hat', price: 300, rarity: 'epic', icon: '👑', description: 'Qirollik toji', unlockReq: null },
  { id: 'hat_wizard', name: '🧙 Wizard Hat', type: 'hat', price: 250, rarity: 'rare', icon: '🧙', description: 'Sehrgar shlyapasi', unlockReq: null },
  { id: 'hat_party', name: '🎉 Party Hat', type: 'hat', price: 150, rarity: 'common', icon: '🎉', description: 'Bayram shlyapasi', unlockReq: null },
  { id: 'hat_golden', name: '💛 Golden Crown', type: 'hat', price: 500, rarity: 'legendary', icon: '💛', description: 'Oltin toj', unlockReq: { type: 'tests', count: 100 } },

  // Glasses
  { id: 'glass_cool', name: '🕶 Cool Glasses', type: 'glasses', price: 150, rarity: 'common', icon: '🕶', description: 'Zo\'r ko\'zoynak', unlockReq: null },
  { id: 'glass_nerd', name: '🤓 Nerd Glasses', type: 'glasses', price: 120, rarity: 'common', icon: '🤓', description: 'Geek ko\'zoynagi', unlockReq: null },
  { id: 'glass_star', name: '🌟 Star Glasses', type: 'glasses', price: 200, rarity: 'rare', icon: '🌟', description: 'Yulduzli ko\'zoynak', unlockReq: null },
  { id: 'clothes_hoodie', name: '👕 Tech Hoodie', type: 'clothes', price: 220, rarity: 'rare', icon: '🧥', description: 'Texno huddi', unlockReq: null },
  { id: 'clothes_armor', name: '🛡️ Cyber Armor', type: 'clothes', price: 480, rarity: 'epic', icon: '🛡️', description: 'Kiber zirh', unlockReq: null },

  // Badges  
  { id: 'badge_dev', name: '⚡ Developer Badge', type: 'badge', price: 700, rarity: 'epic', icon: '⚡', description: 'Dasturchi belgisi', unlockReq: null },
  { id: 'badge_master', name: '🏆 Master Badge', type: 'badge', price: 800, rarity: 'epic', icon: '🏆', description: 'Master darajasi', unlockReq: { type: 'level', value: 10 } },
  { id: 'badge_python', name: '🐍 Python Master', type: 'badge', price: 400, rarity: 'rare', icon: '🐍', description: 'Python ustasi', unlockReq: { type: 'subject', name: 'Python', tests: 10 } },
  { id: 'badge_js', name: '⚡ JS Master', type: 'badge', price: 400, rarity: 'rare', icon: '⚡', description: 'JavaScript ustasi', unlockReq: { type: 'subject', name: 'JavaScript', tests: 10 } },
  { id: 'badge_perfect', name: '💯 Perfect Score', type: 'badge', price: 1000, rarity: 'legendary', icon: '💯', description: '100% natija belgisi', unlockReq: { type: 'perfect', count: 5 } },

  // Frames
  { id: 'frame_diamond', name: '💎 Diamond Frame', type: 'frame', price: 1000, rarity: 'legendary', icon: '💎', description: 'Olmos ramka', unlockReq: null },
  { id: 'frame_fire', name: '🔥 Fire Frame', type: 'frame', price: 600, rarity: 'epic', icon: '🔥', description: 'Olovli ramka', unlockReq: { type: 'streak', days: 7 } },
  { id: 'frame_gold', name: '🥇 Golden Frame', type: 'frame', price: 500, rarity: 'rare', icon: '🥇', description: 'Oltin ramka', unlockReq: null },
  { id: 'frame_silver', name: '🥈 Silver Frame', type: 'frame', price: 300, rarity: 'common', icon: '🥈', description: 'Kumush ramka', unlockReq: null },

  // Backgrounds
  { id: 'bg_galaxy', name: '🌌 Galaxy BG', type: 'background', price: 450, rarity: 'rare', icon: '🌌', description: 'Galaktika foni', unlockReq: null },
  { id: 'bg_ocean', name: '🌊 Ocean BG', type: 'background', price: 350, rarity: 'common', icon: '🌊', description: 'Okean foni', unlockReq: null },
  { id: 'bg_sunset', name: '🌅 Sunset BG', type: 'background', price: 400, rarity: 'rare', icon: '🌅', description: 'Quyosh botimi foni', unlockReq: null },

  // Effects
  { id: 'effect_sparkle', name: '✨ Sparkle Effect', type: 'effect', price: 550, rarity: 'epic', icon: '✨', description: 'Yaltirab turish effekti', unlockReq: null },
  { id: 'effect_glow', name: '🌟 Glow Effect', type: 'effect', price: 500, rarity: 'rare', icon: '🌟', description: 'Nur sochish effekti', unlockReq: null },
  { id: 'effect_rainbow', name: '🌈 Rainbow Effect', type: 'effect', price: 800, rarity: 'legendary', icon: '🌈', description: 'Kamalak effekti', unlockReq: { type: 'achievement', id: 'achievement_master' } },
  { id: 'gift_coffee', name: '☕ Coffee Gift', type: 'gift', price: 80, rarity: 'common', icon: '☕', description: 'Do‘stingizga energiya yuboring', unlockReq: null },
  { id: 'gift_star', name: '⭐ Star Gift', type: 'gift', price: 150, rarity: 'rare', icon: '⭐', description: 'Maxsus yulduzli sovg‘a', unlockReq: null },
  { id: 'gift_trophy', name: '🏆 Trophy Gift', type: 'gift', price: 300, rarity: 'epic', icon: '🏆', description: 'G‘oliblar uchun sovg‘a', unlockReq: null },
];

const RARITY_COLORS = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};

const RARITY_LABELS = {
  common: 'Oddiy',
  rare: 'Kam uchraydigan',
  epic: 'Epik',
  legendary: 'Afsonaviy'
};

const LS = {
  get(key, def = null) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  del(key) { localStorage.removeItem(key); },
};

/* ====================== AUTH & USER ====================== */
const AVATARS = ["🦊", "🐼", "🐵", "🦁", "🐯", "🐸", "🐙", "🦄", "🐲", "👾", "🤖", "👨‍💻", "👩‍💻", "🧑‍🎓", "🧙", "🦸"];

function ensureUsers() {
  let users = LS.get("users", null);
  if (!users || !Array.isArray(users)) {
    users = [
      { id: "u1", firstname: "Admin", lastname: "User", username: "admin", email: "a@a.a", password: "12345", xp: 280, points: 280, level: 3, avatar: "🤖", joinedAt: Date.now() - 86400000 * 30, streak: 5, lastActiveDay: null, testResults: [], store: { inventory: [], equipped: {} } },
      { id: "u2", firstname: "Sarah", lastname: "Kim", username: "sarah_k", email: "s@mail.com", password: "12345", xp: 180, points: 180, level: 2, avatar: "🦊", joinedAt: Date.now() - 86400000 * 14, streak: 2, lastActiveDay: null, testResults: [], store: { inventory: [], equipped: {} } },
      { id: "u3", firstname: "Bekzod", lastname: "R.", username: "bekzod", email: "b@mail.com", password: "12345", xp: 95, points: 95, level: 1, avatar: "🐼", joinedAt: Date.now() - 86400000 * 7, streak: 1, lastActiveDay: null, testResults: [], store: { inventory: [], equipped: {} } },
    ];
    LS.set("users", users);
  }

  // Migrate legacy profile data into the shared Store state once.
  users = users.map(u => {
    if (!u.store || typeof u.store !== "object") {
      u.store = {
        inventory: Array.isArray(u.inventory) ? u.inventory.slice() : [],
        equipped: u.equippedItems && typeof u.equippedItems === "object" ? { ...u.equippedItems } : {}
      };
    }
    u.store.inventory = Array.isArray(u.store.inventory) ? [...new Set(u.store.inventory)] : [];
    u.store.equipped = u.store.equipped && typeof u.store.equipped === "object" ? u.store.equipped : {};
    delete u.inventory;
    if (!u.duelHistory) u.duelHistory = [];
    if (!Array.isArray(u.gifts)) u.gifts = [];
    if (!Array.isArray(u.giftHistory)) u.giftHistory = [];
    if (!u.achievements) u.achievements = [];
    ensureUserTestProgress(u);
    return u;
  });
  const demoFriends = [
    ['Abdulloh', 'abdulloh', '👨‍💻'],
    ['Sardor', 'sardor', '🧑‍💻'],
    ['Muhammad', 'muhammad', '🧙'],
    ['Aziz', 'aziz', '🦁'],
    ['Jasur', 'jasur', '🐯']
  ];
  demoFriends.forEach(([firstname, username, avatar], index) => {
    if (!users.some(user => user.username === username)) {
      users.push({
        id: `demo_${username}`, firstname, lastname: 'Demo', username, email: `${username}@demo.local`,
        password: '12345', xp: 0, points: 350, level: 1, avatar, joinedAt: Date.now() - index * 86400000,
        streak: 0, lastActiveDay: null, testResults: [], duelHistory: [], achievements: [], gifts: [], giftHistory: [],
        store: { inventory: [], equipped: {} }
      });
    }
  });

  LS.set("users", users);
  return users;
}

let users = [];
let currentUser = null;
const userStatsMemo = new WeakMap();

function saveUsersAndCurrent() {
  if (currentUser) {
    const real = users.find(u => u.id === currentUser.id);
    if (real) currentUser = real;
  }
  LS.set("users", users);
  if (currentUser) {
    LS.set("currentUser", currentUser);
    userStatsMemo.delete(currentUser);
  }
  else LS.del("currentUser");
}

function migrateLegacyKeys() {
  if (currentUser) {
    const legacy = ["balance", "xp", "inventory", "equippedItems", "gifts", "giftHistory", "testResults", "duelHistory"];
    legacy.forEach(k => { try { LS.del(k); } catch (_) { } });
  }
}
function userById(id) { return users.find(u => u.id === id); }

function xpToLevel(xp) { return Math.max(1, Math.floor((xp || 0) / 100) + 1); }
function xpProgress(xp) {
  const base = (xp || 0) % 100;
  return { current: base, next: 100, percent: Math.min(100, (base / 100) * 100) };
}

/* ====================== SCORE & STREAK ====================== */
const SCORE_PER_CORRECT = 5;
const MAX_SCORE_PER_TEST = SCORE_PER_CORRECT * QUESTIONS_PER_TEST;
const PASS_THRESHOLD_PERCENT = 60;

function dayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function updateStreakOnTest(user) {
  const today = dayKey();
  const yest = dayKey(Date.now() - 86400000);
  if (user.lastActiveDay === today) return;
  if (user.lastActiveDay === yest) user.streak = (user.streak || 0) + 1;
  else user.streak = 1;
  user.lastActiveDay = today;
}
function awardXPAndPoints(user, score) {
  user.points = (user.points || 0) + score;
  user.xp = (user.xp || 0) + score;
  user.level = xpToLevel(user.xp);
}

/* ====================== TOAST / NOTIF ====================== */
function showToast(msg, type = "info", duration = 2800) {
  const container = $("#toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => {
    el.classList.add("removing");
    setTimeout(() => el.remove(), 350);
  }, duration);
}

/* ====================== THEME ====================== */
const THEMES = ["dark", "light"];
function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "dark";
  document.documentElement.setAttribute("data-theme", theme);
  LS.set("theme", theme);
  const b = $("#settingsThemeBtn");
  if (b) b.textContent = theme === "dark" ? "🌙 Dark" : "☀️ Light";
}
function loadTheme() { applyTheme(LS.get("theme", "dark")); }

/* ====================== ROUTING ====================== */
const PAGE_TITLES = {
  dashboard: "Bosh sahifa", tests: "Testlar", testlist: "Testlar ro\'yxati",
  test: "Test", result: "Natija",
  ranking: "Reyting", achievements: "Yutuqlar", profile: "Profil", settings: "Sozlamalar",
  duel: "Duel", store: "Do'kon", coding: "Code Playground", projects: "Loyihalarim",
  lessons: "Darslar", lessonCourse: "Kurs darslari", lessonView: "Dars",
};
const PROTECTED_PAGES = ["dashboard", "tests", "testlist", "test", "result", "ranking", "achievements", "profile", "duel", "store", "coding", "projects", "lessons", "lessonCourse", "lessonView"];

/* Darslar tizimi (lessons-app.js) bilan integratsiya uchun expose */
window.__itShowPage = showPage;
window.__itGetCurrentUser = () => currentUser;
window.__itConfetti = triggerConfetti;

function showPage(name) {
  /* "Natijalar" bo'limi olib tashlangan — eski /#results link/dashboard havolalari
     Bosh sahifaga yo'naltiriladi (broken page / bo'sh sahifa bo'lmaydi) */
  if (name === "results") { showToast("📊 Natijalar bo'limi olib tashlandi — Bosh sahifaga yo'naltirildi", "info"); name = "dashboard"; }
  if (PROTECTED_PAGES.includes(name) && !currentUser) {
    showToast("Avval tizimga kiring", "info");
    showAuthScreen();
    return;
  }

  $$(".page").forEach(p => p.classList.remove("active"));
  const pg = $(`#page-${name}`);
  if (pg) pg.classList.add("active");
  const t = $("#pageTitle");
  if (t && PAGE_TITLES[name]) t.textContent = PAGE_TITLES[name];
  $$(".nav-item[data-page]").forEach(n => n.classList.toggle("active", n.getAttribute("data-page") === name));
  if (name === "dashboard") { renderDashboard(); if (window.MobileUI) window.MobileUI.renderDashboard(); }
  else if (name === "tests") renderTestsPage();
  else if (name === "ranking") renderLeaderboard();
  else if (name === "achievements") renderAchievements();
  else if (name === "profile") renderProfile();
  else if (name === "duel") renderDuel();
  else if (name === "store") renderStore();
  else if (name === "coding") renderCodingPage();
  else if (name === "projects") { if (typeof renderProjectsPage === "function") renderProjectsPage(); }
  else if (name === "lessons" || name === "lessonCourse" || name === "lessonView") {
    if (window.Lessons) window.Lessons.handlePage(name);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}
function bindNav() {
  const app = $("#app");
  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function applyDesktopSidebarState(collapsed) {
    if (!app || !sidebar) return;
    app.classList.toggle("sidebar-collapsed", collapsed);
    sidebar.classList.toggle("collapsed", collapsed);
    try {
      localStorage.setItem("sidebarCollapsed", String(collapsed));
    } catch (e) {
      console.warn("localStorage not available or restricted");
    }
  }

  function closeMobileSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  }

  function syncSidebarState() {
    if (!sidebar || !app) return;

    if (isMobileView()) {
      sidebar.classList.remove("collapsed");
      app.classList.remove("sidebar-collapsed");
      closeMobileSidebar();
      return;
    }

    const shouldCollapse = localStorage.getItem("sidebarCollapsed") === "true";
    applyDesktopSidebarState(shouldCollapse);
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  }

  function toggleSidebarMenu() {
    if (isMobileView()) {
      const shouldOpen = !sidebar.classList.contains("active");
      sidebar.classList.toggle("active", shouldOpen);
      overlay.classList.toggle("active", shouldOpen);
      document.body.classList.toggle("sidebar-open", shouldOpen);
      return;
    }

    const shouldCollapse = !sidebar.classList.contains("collapsed");
    applyDesktopSidebarState(shouldCollapse);
  }

  $$('[data-nav]').forEach(el => el.addEventListener("click", () => {
    const n = el.getAttribute("data-nav"); if (n) showPage(n);
  }));
  $$('.back-btn[data-back]').forEach(el => el.addEventListener("click", () => showPage(el.getAttribute("data-back"))));
  $("#hamburger").addEventListener("click", toggleSidebarMenu);

  window.addEventListener("resize", syncSidebarState);

  $("#sidebarOverlay").addEventListener("click", () => {
    if (isMobileView()) closeMobileSidebar();
  });

  $("#sidebarClose").addEventListener("click", () => {
    if (isMobileView()) closeMobileSidebar();
  });

  $("#themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });
  $("#settingsThemeBtn").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  $$('.nav-item[data-page]').forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const p = el.getAttribute("data-page"); if (p) showPage(p);
      if (isMobileView()) closeMobileSidebar();
    });
  });

  // Notifications dropdown
  const notifBtn = $("#notifBtn");
  const notifDropdown = $("#notifDropdown");
  const userChip = $("#userChip");
  const userDropdown = $("#userDropdown");
  function setNotifDropdown(open) {
    if (!notifDropdown || !notifBtn) return;
    notifDropdown.classList.toggle("active", open);
    notifBtn.setAttribute("aria-expanded", String(open));
  }
  function closeNotifDropdown() { setNotifDropdown(false); }

  // User chip (avatar) — dropdown menyu
  function setUserDropdown(open) {
    if (!userDropdown || !userChip) return;
    userDropdown.classList.toggle("active", open);
    userChip.setAttribute("aria-expanded", String(open));
  }
  function closeUserDropdown() { setUserDropdown(false); }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeUserDropdown();
      setNotifDropdown(!notifDropdown.classList.contains("active"));
    });
  }
  if (userChip && userDropdown) {
    userChip.addEventListener("click", (e) => {
      e.stopPropagation();
      closeNotifDropdown();
      const willOpen = !userDropdown.classList.contains("active");
      if (willOpen) refreshUserMenu();
      setUserDropdown(willOpen);
    });
    $$(".ux-menu-item", userDropdown).forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const m = item.getAttribute("data-menu");
        closeUserDropdown();
        if (m === "profile") showPage("profile");
        else if (m === "settings") showPage("settings");
        else if (m === "lang") showToast("🌐 Til almashtirish tez orada qo'shiladi", "info");
        else if (m === "theme") { const t = $("#themeToggle"); if (t) t.click(); }
        else if (m === "help") showToast("❓ Yordam markazi tez orada qo'shiladi", "info");
        else if (m === "logout") openModal("#logoutConfirmModal");
      });
    });
  }

  // Tashqariga bosilganda ikkala menyuni ham yopish.
  document.addEventListener("click", (e) => {
    if (notifDropdown && notifBtn && !notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) closeNotifDropdown();
    if (userDropdown && userChip && !userDropdown.contains(e.target) && !userChip.contains(e.target)) closeUserDropdown();
  });

  // ESC har qanday ochiq menyuni yopadi.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeUserDropdown();
    closeNotifDropdown();
  });

  // Chiqish tasdiqlash modali
  const logoutConfirmBtn = $("#logoutConfirmBtn");
  if (logoutConfirmBtn) logoutConfirmBtn.addEventListener("click", () => {
    closeModal("#logoutConfirmModal");
    logoutUser();
  });

  syncSidebarState();
}

/* ====================== AUTH FUNCTIONS ====================== */
function initialsOf(name) {
  return (name || "U").split(/\s+/).map(s => s[0]).join("").slice(0, 2).toUpperCase();
}

function getActiveAvatar(u = currentUser) {
  if (!u) return "U";
  const equippedId = storeState(u).equipped?.avatar;
  const equippedItem = equippedId ? storeItem(equippedId) : null;
  if (equippedItem && equippedItem.icon) return equippedItem.icon;
  if (u.avatar) return u.avatar;
  return initialsOf(`${u.firstname || ""} ${u.lastname || ""}`) || "U";
}

function refreshUserChip() {
  const u = currentUser;
  $("#topbarUsername").textContent = u ? u.username : "User";
  const a = $("#topbarAvatar");
  if (a) a.textContent = getActiveAvatar(u);
}

/* Profil dropdown menyusi kontentini yangilash */
function refreshUserMenu() {
  const u = currentUser;
  const n = $("#dropdownUsername");
  if (n) n.textContent = u ? u.username : "User";
  const e = $("#dropdownEmail");
  if (e) e.textContent = u && u.email ? u.email : "";
  const a = $("#dropdownAvatar");
  if (a) a.textContent = getActiveAvatar(u);
}

function showAuthScreen() {
  $("#app").classList.add("hidden");
  $("#authScreen").classList.remove("hidden");
  const loginTab = $(".auth-tab[data-tab='login']");
  if (loginTab) loginTab.click();
}

function showAuth() {
  showAuthScreen();
}

function logoutUser() {
  currentUser = null;
  // FAQAT session kaliti tozalanadi — users, progress, XP, coin, sozlamalar saqlanadi
  LS.del("currentUser");
  const userDropdown = $("#userDropdown");
  const userChip = $("#userChip");
  if (userDropdown) userDropdown.classList.remove("active");
  if (userChip) userChip.setAttribute("aria-expanded", "false");
  showToast("🚪 Hisobdan chiqdingiz. Yana ko'rishguncha!", "info");
  showAuthScreen();
}

function showApp() {
  if (!currentUser) {
    console.warn("⚠️ showApp called without currentUser - redirecting to auth");
    showAuthScreen();
    return;
  }
  $("#authScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  refreshUserChip();
  showPage("dashboard");
}

function bindAuth() {
  $$(".pwd-toggle").forEach(b => b.addEventListener("click", () => {
    const id = b.getAttribute("data-target");
    const inp = document.getElementById(id);
    inp.type = inp.type === "password" ? "text" : "password";
  }));

  $$(".auth-tab").forEach(t => t.addEventListener("click", () => {
    $$(".auth-tab").forEach(x => x.classList.remove("active"));
    $$(".auth-form").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const tab = t.getAttribute("data-tab");
    $(`#${tab}Form`).classList.add("active");
  }));

  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const pass = $("#loginPassword").value;
    const u = users.find(x =>
      (x.email && x.email.toLowerCase() === email.toLowerCase()) ||
      (x.username && x.username.toLowerCase() === email.toLowerCase())
    );
    if (!u) return showToast("Bunday foydalanuvchi topilmadi", "error");
    if (u.password !== pass) return showToast("Parol xato", "error");
    currentUser = u;
    saveUsersAndCurrent();
    $("#loginForm").reset();
    showToast("Tizimga kirdingiz", "success");
    showApp();
  });

  $("#registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      firstname: $("#regFirstname").value.trim(),
      lastname: $("#regLastname").value.trim(),
      username: $("#regUsername").value.trim(),
      email: $("#regEmail").value.trim(),
      password: $("#regPassword").value,
      confirmPassword: $("#regConfirmPassword") ? $("#regConfirmPassword").value : "",
    };
    if (!data.firstname || !data.lastname || !data.username || !data.email || !data.password) {
      return showToast("Barcha maydonlarni to\'ldiring", "error");
    }
    if (data.password.length < 4) return showToast("Parol kamida 4 belgidan iborat bo\'lsin", "error");
    if (data.password !== data.confirmPassword) return showToast("Parollar mos kelmaydi", "error");
    if (users.find(x => x.username && x.username.toLowerCase() === data.username.toLowerCase()))
      return showToast("Bu username allaqachon band", "error");
    if (users.find(x => x.email && x.email.toLowerCase() === data.email.toLowerCase()))
      return showToast("Bu email bilan account allaqachon mavjud", "error");
    delete data.confirmPassword;
    const u = {
      id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...data,
      xp: 0, points: 0, level: 1,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      joinedAt: Date.now(),
      streak: 0, lastActiveDay: null, testResults: [],
      duelHistory: [],
      achievements: [],
      store: { inventory: [], equipped: {} }
    };
    users.push(u);
    currentUser = u;
    saveUsersAndCurrent();
    $("#registerForm").reset();
    showToast("Hisob yaratildi. Xush kelibsiz!", "success");
    showApp();
  });

  $("#logoutBtn").addEventListener("click", () => {
    openModal("#logoutConfirmModal");
  });
}

/* ====================== DASHBOARD ====================== */
function userStats(user) {
  if (userStatsMemo.has(user)) return userStatsMemo.get(user);
  const list = user.testResults || [];
  const total = list.length;
  const sumScore = list.reduce((s, r) => s + (r.score || 0), 0);
  const sumPercent = list.reduce((s, r) => s + (r.percent || 0), 0);
  const avgPercent = total ? Math.round(sumPercent / total) : 0;
  const bySubject = {};
  for (const r of list) {
    if (!bySubject[r.subject]) bySubject[r.subject] = { count: 0, totalScore: 0, bestScore: 0 };
    bySubject[r.subject].count++;
    bySubject[r.subject].totalScore += r.score || 0;
    if ((r.score || 0) > bySubject[r.subject].bestScore) bySubject[r.subject].bestScore = r.score || 0;
  }
  const res = { total, sumScore, avgPercent, bySubject };
  userStatsMemo.set(user, res);
  return res;
}

function updateDuelStatsUI() {
  const u = currentUser;
  if (!u) return;
  const wins = u.duelWins || 0;
  const losses = u.duelLosses || 0;
  const total = u.duelTotal || (wins + losses);

  const winsEl = $("#statDuelWins");
  const lossesEl = $("#statDuelLosses");
  const totalEl = $("#statDuelTotal");

  if (winsEl) winsEl.textContent = wins;
  if (lossesEl) lossesEl.textContent = losses;
  if (totalEl) totalEl.textContent = total;
}

function renderDashboard() {
  const u = currentUser;
  if (!u) return;
  const xp = u.xp || 0;
  const lvl = u.level || 1;
  $("#welcomeMini").textContent = `Salom, ${u.firstname} 👋`;
  $("#dashLevelBadge").textContent = `Level ${lvl}`;
  const xpp = xpProgress(xp);
  $("#dashXpText").textContent = `${xpp.current} XP`;
  $("#dashXpNext").textContent = `/ ${xpp.next} XP`;
  $("#dashXpFill").style.width = `${xpp.percent}%`;

  const s = userStats(u);
  $("#statXp").textContent = u.points || 0;
  $("#statTests").textContent = s.total;
  $("#statAvg").textContent = `${s.avgPercent}%`;
  $("#statStreak").textContent = u.streak || 0;

  updateDuelStatsUI();

  // Fanlar progress
  const sp = $("#subjectProgress");
  sp.innerHTML = "";
  for (const sbj of SUBJECTS) {
    const st = s.bySubject[sbj.name] || { count: 0, totalScore: 0, bestScore: 0 };
    const maxBest = MAX_SCORE_PER_TEST * 9;
    const percent = maxBest ? Math.min(100, Math.round((st.bestScore * 100) / maxBest)) : 0;
    const row = document.createElement("div");
    row.className = "progress-item";
    row.innerHTML = `
      <div class="progress-item-head">
        <span><strong>${sbj.icon}</strong> ${sbj.name}</span>
        <span class="muted">${st.count} ta · ${percent}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
    `;
    sp.appendChild(row);
  }

  // Recent results
  const rr = $("#recentResults");
  rr.innerHTML = "";
  const recent = (u.testResults || []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  if (!recent.length) rr.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📝</div><h3>Hali test ishlanmagan</h3><p>Testlarni boshlash uchun Testlar sahifasiga o'ting</p></div>`;
  for (const r of recent) {
    const d = new Date(r.timestamp);
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
    const el = document.createElement("div");
    el.className = "recent-item";
    el.innerHTML = `
      <div class="recent-item-info">
        <div class="recent-item-name">${SUBJECTS.find(x => x.name === r.subject)?.icon || '📝'} ${r.subject} · ${r.title}</div>
        <div class="recent-item-sub">${dateStr} · ${DIFFICULTY_LABELS[r.difficulty] || ''}</div>
      </div>
      <div class="recent-item-score">
        <div class="recent-item-pct">${r.score}/50 · ${r.percent}%</div>
        <span class="badge ${r.passed ? 'badge-success' : 'badge-danger'}">${r.passed ? 'PASSED' : 'FAILED'}</span>
      </div>
    `;
    rr.appendChild(el);
  }

  // CHARTS
  renderLineChart(u);
  renderDonutChart(u);
}

/* ---------- CHARTS ---------- */
function renderLineChart(u) {
  const container = $("#lineChartContainer");
  if (!container) return;
  const all = (u.testResults || []).slice().sort((a, b) => a.timestamp - b.timestamp);
  const lastN = all.slice(-10);

  const subTitle = $("#chartSubtitle");
  if (subTitle) subTitle.textContent = all.length ? `Oxirgi ${lastN.length} ta test · jami ${all.length}` : "Hali test ishlanmagan";

  if (!lastN.length) {
    container.innerHTML = `<div class="line-chart-empty"><div class="big-icon">📊</div><div>Test ishlaganingizda bu yerda progress grafigi ko'rinadi</div></div>`;
    return;
  }

  const W = 800, H = 260, P = { l: 40, r: 20, t: 20, b: 34 };
  const chartW = W - P.l - P.r, chartH = H - P.t - P.b;
  const n = lastN.length;

  const x = i => P.l + (chartW * i) / Math.max(1, n - 1);
  const y = v => P.t + chartH - (v / 100) * chartH;
  const yPass = y(50);

  const pts = lastN.map((r, i) => [x(i), y(r.percent)]);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${P.t + chartH} L ${pts[0][0]} ${P.t + chartH} Z`;

  let gridLines = '';
  [0, 25, 50, 75, 100].forEach(v => {
    const yy = y(v);
    gridLines += `<line x1="${P.l}" y1="${yy}" x2="${W - P.r}" y2="${yy}" stroke="var(--border)" stroke-dasharray="${v === 50 ? '6 4' : '3 3'}" stroke-width="1" opacity="${v === 50 ? '0.8' : '0.45'}" />`;
    gridLines += `<text x="${P.l - 8}" y="${yy + 4}" text-anchor="end" font-size="10" fill="var(--muted)" opacity="0.9">${v}%</text>`;
  });

  let xLabels = '';
  lastN.forEach((r, i) => {
    const d = new Date(r.timestamp);
    const label = n <= 5 ? `${d.getDate()}/${d.getMonth() + 1}` : (i % Math.ceil(n / 5) === 0 || i === n - 1 ? `T${i + 1}` : '');
    if (label) {
      xLabels += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="10" fill="var(--muted)" opacity="0.9">${label}</text>`;
    }
  });

  let ptsMarkers = '';
  pts.forEach((p, i) => {
    const r = lastN[i];
    ptsMarkers += `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${r.passed ? 'var(--success)' : 'var(--primary)'}" stroke="#fff" stroke-width="2"/>`;
    ptsMarkers += `<title>${r.subject} · ${r.title} — ${r.percent}%${r.passed ? ' (PASSED)' : ''}</title>`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <line x1="${P.l}" y1="${yPass}" x2="${W - P.r}" y2="${yPass}" stroke="var(--success)" stroke-width="2" stroke-dasharray="8 6" opacity="0.75"/>
      <path d="${areaPath}" fill="url(#areaGrad)"/>
      <path d="${linePath}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      ${ptsMarkers}
      ${xLabels}
    </svg>
  `;
}

function renderDonutChart(u) {
  const wrap = $("#donutChart");
  if (!wrap) return;
  const all = u.testResults || [];
  const totals = { correct: 0, incorrect: 0, skipped: 0 };
  all.forEach(r => {
    totals.correct += r.correct || 0;
    totals.incorrect += r.incorrect || 0;
    totals.skipped += r.skipped || 0;
  });

  $("#csCorrect").textContent = totals.correct;
  $("#csWrong").textContent = totals.incorrect;
  $("#csSkipped").textContent = totals.skipped;

  const sum = totals.correct + totals.incorrect + totals.skipped;
  if (!sum) {
    wrap.innerHTML = `<div class="donut-empty"><div style="font-size:56px;opacity:0.5">🎯</div><div>Ma'lumotlar mavjud emas</div></div>`;
    return;
  }

  const pct = Math.round((totals.correct / sum) * 100);
  const R = 78, C = 2 * Math.PI * R, CX = 100, CY = 100;
  const segments = [
    { val: totals.correct, color: 'var(--success)', label: 'correct' },
    { val: totals.incorrect, color: 'var(--danger)', label: 'wrong' },
    { val: totals.skipped, color: 'var(--muted)', label: 'skipped' },
  ];

  let offset = 0;
  let circles = '';
  segments.forEach(s => {
    if (!s.val) return;
    const len = (s.val / sum) * C;
    circles += `<circle cx="${CX}" cy="${CY}" r="${R}"
      stroke="${s.color}" stroke-width="22" fill="none"
      stroke-dasharray="${len.toFixed(3)} ${C.toFixed(3)}"
      stroke-dashoffset="${(-offset).toFixed(3)}"
      stroke-linecap="butt"
      transform="rotate(-90 ${CX} ${CY})" />`;
    offset += len;
  });

  wrap.innerHTML = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${CX}" cy="${CY}" r="${R}" stroke="var(--bg)" stroke-width="22" fill="none"/>
      ${circles}
    </svg>
    <div class="donut-center-text">
      <span class="dc-big">${pct}%</span>
      <span class="dc-small">Aniqlik</span>
    </div>
  `;
}

/* ====================== TESTS PAGE (fanlar grid) ====================== */
let currentFilterDiff = "all";
let currentSearch = "";

function subjectCard(sbj) {
  const st = userStats(currentUser || {});
  const info = st.bySubject[sbj.name] || { count: 0 };
  const card = document.createElement("div");
  card.className = "subject-card";
  card.innerHTML = `
    <div class="subject-card-head">
      <div class="subject-icon">${sbj.icon}</div>
      <div class="subject-name">${sbj.name}</div>
    </div>
    <div class="subject-desc muted">${sbj.description}</div>
    <div class="subject-meta">
      <span>9 ta test</span>
      <span>${info.count} ta ishlangan</span>
    </div>
    <button class="btn btn-primary btn-block subject-btn" data-subject="${sbj.name}">Testlarni ko\'rish</button>
  `;
  card.querySelector(".subject-btn").addEventListener("click", () => openSubjectTests(sbj.name));
  return card;
}

function renderTestsPage() {
  const grid = $("#testsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  let list = SUBJECTS.slice();
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  if (currentFilterDiff && currentFilterDiff !== "all") {
    list = list.filter(sbj => {
      const tests = ALL_TESTS[sbj.name] || [];
      return tests.some(test => test.difficulty === currentFilterDiff);
    });
  }

  for (const s of list) grid.appendChild(subjectCard(s));
  if (!list.length) grid.innerHTML = `<div class="empty-state">Fan topilmadi</div>`;
}

function bindTestsPage() {
  $("#testSearch").addEventListener("input", (e) => {
    currentSearch = e.target.value; renderTestsPage();
  });
  $$("#diffFilter .chip").forEach(c => c.addEventListener("click", () => {
    $$("#diffFilter .chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    currentFilterDiff = c.getAttribute("data-diff");
    renderTestsPage();
  }));
}

/* ====================== TEST LIST PAGE ====================== */
let currentSubject = null;

function difficultyBadge(diff) {
  const map = {
    beginner: { cls: "diff-badge diff-beginner", txt: "Beginner" },
    intermediate: { cls: "diff-badge diff-intermediate", txt: "Intermediate" },
    advanced: { cls: "diff-badge diff-advanced", txt: "Advanced" },
  };
  const m = map[diff] || map.beginner;
  return `<span class="${m.cls}">${m.txt}</span>`;
}

function openSubjectTests(name) {
  currentSubject = name;
  const title = $("#testListTitle");
  const s = SUBJECTS.find(x => x.name === name);
  if (title) title.innerHTML = `${s ? s.icon : '📝'} ${name} testlari`;
  const list = ALL_TESTS[name] || [];
  const container = $("#testListContainer");
  container.innerHTML = "";
  if (!list.length) container.innerHTML = `<div class="empty-state">Testlar mavjud emas</div>`;

  ensureUserTestProgress(currentUser);

  const best = {};
  for (const r of (currentUser?.testResults || [])) {
    if (r.subject !== name) continue;
    if (!best[r.testId] || (best[r.testId].score || 0) < (r.score || 0)) best[r.testId] = r;
  }

  for (const test of list) {
    const durMin = Math.floor(test.durationSec / 60);
    const row = document.createElement("div");
    const unlocked = isTestUnlocked(currentUser, test.id);
    const completed = isTestCompleted(currentUser, test.id);
    row.className = "test-list-item" + (unlocked ? "" : " test-item-locked");
    const bestScore = best[test.id]?.score ?? null;
    const bestPct = best[test.id]?.percent ?? null;
    row.innerHTML = `
      <div class="tli-left">
        <div class="tli-title">${unlocked ? "" : "🔒 "}${test.title}${completed ? ' ✅' : ''}</div>
        <div class="tli-meta muted">
          ${difficultyBadge(test.difficulty)}
          <span>${test.questionCount} ta savol</span>
          <span>⏱ ${durMin} daqiqa</span>
          ${bestScore !== null ? `<span class="tli-best">🏆 ${bestScore}/50 · ${bestPct}%</span>` : ''}
        </div>
        ${!unlocked ? `<div class="tli-lock-hint muted" style="margin-top:6px;font-size:12px;color:var(--warning);">🔒 Avval oldingi testni yakunlang</div>` : ''}
      </div>
      <div class="tli-right">
        <button class="btn ${unlocked ? 'btn-primary' : 'btn-ghost'} start-test-btn" data-testid="${test.id}" ${unlocked ? '' : 'disabled style="opacity:0.55;cursor:not-allowed;pointer-events:none;"'}>
          ${unlocked ? (completed ? 'Qayta ishlash' : 'Boshlash') : '🔒 Yopiq'}
        </button>
      </div>
    `;
    const btn = row.querySelector(".start-test-btn");
    if (unlocked) {
      btn.addEventListener("click", () => openStartTestModal(test.id));
    } else {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showToast("🔒 Avval oldingi testni yakunlang", "warning");
      });
      btn.style.cursor = "not-allowed";
    }
    container.appendChild(row);
  }
  $$('.back-btn[data-back]').forEach(el => {
    if (!el.dataset._bound) {
      el.dataset._bound = "1";
      el.addEventListener("click", () => showPage(el.getAttribute("data-back")));
    }
  });
  showPage("testlist");
}

/* ====================== QUIZ STATE ====================== */
const quiz = {
  test: null,
  currentIndex: 0,
  answers: [],
  marked: [],
  startedAt: 0,
  remainingSec: 0,
  timer: null,
  autoNavTimeout: null,
  finished: false,
};

/* ====================== START TEST MODAL ====================== */
function openStartTestModal(testId) {
  const test = findTestById(testId);
  if (!test) return;
  if (!isTestUnlocked(currentUser, testId)) {
    showToast("🔒 Avval oldingi testni yakunlang", "warning");
    return;
  }
  $("#startTestName").textContent = `${test.subject} · ${test.title}`;
  const durMin = Math.floor(test.durationSec / 60);
  $("#startTestBody").innerHTML = `
    <div class="start-info">
      <div class="start-info-row"><span>Fan:</span><strong>${test.subject}</strong></div>
      <div class="start-info-row"><span>Qiyinlik:</span>${difficultyBadge(test.difficulty)}</div>
      <div class="start-info-row"><span>Savollar:</span><strong>${test.questionCount} ta</strong></div>
      <div class="start-info-row"><span>Vaqt:</span><strong>${durMin} daqiqa</strong></div>
      <div class="start-info-row"><span>Maksimal ball:</span><strong>50 ball</strong></div>
      <div class="start-info-row"><span>O'tish:</span><strong>≥ 60% (30/50)</strong></div>
    </div>
  `;
  $("#startTestModal").classList.add("active");
  $("#startTestConfirm").onclick = () => {
    closeModal("#startTestModal");
    startQuiz(testId);
  };
}

function bindModalsClose() {
  $$(".modal-overlay").forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay") || e.target.closest('[data-close]')) {
        m.classList.remove("active");
      }
    });
    $$('[data-close]', m).forEach(c => c.addEventListener("click", () => m.classList.remove("active")));
  });
}
function closeModal(sel) { $(sel)?.classList.remove("active"); }
function openModal(sel) { $(sel)?.classList.add("active"); }

/* ====================== QUIZ ENGINE ====================== */
function stopTimer() {
  if (quiz.timer) { clearInterval(quiz.timer); quiz.timer = null; }
}
function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function startTimer() {
  stopTimer();
  $("#testTimer").textContent = formatTime(quiz.remainingSec);
  quiz.timer = setInterval(() => {
    quiz.remainingSec -= 1;
    $("#testTimer").textContent = formatTime(quiz.remainingSec);
    if (quiz.remainingSec <= 10) $("#testTimer").classList.add("timer-warn");
    else $("#testTimer").classList.remove("timer-warn");
    if (quiz.remainingSec <= 0) {
      stopTimer();
      showToast("Vaqt tugadi!", "warning");
      finishTest({ silent: true });
    }
  }, 1000);
}

function renderProgress() {
  const total = quiz.test.questionCount;
  const answered = quiz.answers.filter(a => a !== null && a !== undefined).length;
  $("#testProgressText").textContent = `Savol ${quiz.currentIndex + 1} / ${total}`;
  $("#testProgressFill").style.width = `${((quiz.currentIndex + 1) / total) * 100}%`;
  $("#testMiniStats").innerHTML = `
    <span>Javob berilgan: <strong>${answered}/${total}</strong></span>
    <span>Belgilangan: <strong>${quiz.marked.filter(Boolean).length}</strong></span>
    <span>Taxminiy ball: <strong id="estScore">${estimateScore()}/50</strong></span>
  `;
  renderQuestionNav();
}

function estimateScore() {
  let correct = 0;
  for (let i = 0; i < quiz.test.questions.length; i++) {
    const a = quiz.answers[i];
    if (a === null || a === undefined) continue;
    if (a === quiz.test.questions[i].c) correct++;
  }
  return correct * SCORE_PER_CORRECT;
}

function renderQuestionNav() {
  const nav = $("#questionNav");
  nav.innerHTML = "";
  for (let i = 0; i < quiz.test.questions.length; i++) {
    const btn = document.createElement("button");
    btn.className = "qn-btn";
    if (i === quiz.currentIndex) btn.classList.add("current");
    const ans = quiz.answers[i];
    if (ans !== null && ans !== undefined) {
      if (ans === quiz.test.questions[i].c) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
    }
    if (quiz.marked[i]) btn.classList.add("marked");
    btn.textContent = String(i + 1);
    btn.addEventListener("click", () => { quiz.currentIndex = i; renderQuestion(); renderProgress(); });
    nav.appendChild(btn);
  }
}

function renderQuestion() {
  const q = quiz.test.questions[quiz.currentIndex];
  const idx = quiz.currentIndex;
  const selected = quiz.answers[idx];
  const hasAnswer = selected !== null && selected !== undefined;

  $("#testTitle").textContent = quiz.test.title;
  $("#testSubtitle").textContent = `${quiz.test.subject} · ${DIFFICULTY_LABELS[quiz.test.difficulty]}`;
  const area = $("#questionArea");
  area.innerHTML = `
    <div class="question">
      <div class="q-mascot-row">
        <div class="mascot mascot--idle" id="qMascot" aria-hidden="true">
          <img src="./mascot/it-robot.png" alt="ITTest Robot" draggable="false" loading="lazy"
            onerror="this.closest('.mascot')&&this.closest('.mascot').classList.add('mascot-broken')" />
        </div>
        <span class="q-mascot-text">🤖 Robot sizga ishonadi — to'g'ri javobni tanlang!</span>
      </div>
      <div class="question-number">Savol ${idx + 1}</div>
      <div class="question-text">${q.q}</div>
      <div class="options ${hasAnswer ? 'options-locked' : ''}" id="optionsContainer">
        ${q.o.map((opt, i) => {
    const isSel = selected === i;
    let cls = `option ${isSel ? 'selected' : ''}`;
    if (isSel) {
      cls += i === q.c ? ' correct' : ' wrong';
    }
    if (hasAnswer && !isSel) {
      cls += ' option-disabled';
    }
    return `
          <label class="${cls}">
            <input type="radio" name="opt" value="${i}" ${isSel ? 'checked' : ''} />
            <span class="option-mark">${String.fromCharCode(65 + i)}</span>
            <span class="option-text">${opt}</span>
            ${isSel ? `<span class="option-badge ${i === q.c ? 'badge-correct' : 'badge-wrong'}">${i === q.c ? '✓ To\'g\'ri' : '✗ Xato'}</span>` : ''}
          </label>
        `;
  }).join("")}
      </div>
      <div class="question-flag ${quiz.marked[idx] ? 'show' : ''}">⚑ Ko\'rib chiqish uchun belgilangan</div>
    </div>
  `;

  $$('#optionsContainer .option').forEach((lab, i) => {
    lab.addEventListener("click", (e) => {
      e.preventDefault();

      if (!quiz.test || quiz.finished) return;
      if (quiz.answers[idx] !== null && quiz.answers[idx] !== undefined) return;
      if (quiz.autoNavTimeout) return;

      quiz.answers[idx] = i;
      renderQuestion();
      renderProgress();
      $("#nextBtn").disabled = true;
      $("#clearAnswerBtn").disabled = false;

      if (quiz.autoNavTimeout) clearTimeout(quiz.autoNavTimeout);
      quiz.autoNavTimeout = setTimeout(() => {
        if (!quiz.test || quiz.finished) return;
        quiz.autoNavTimeout = null;

        if (quiz.currentIndex < quiz.test.questions.length - 1) {
          quiz.currentIndex++;
          renderQuestion();
          renderProgress();
        } else {
          finishTest({});
        }
      }, 700);
    });
  });

  $("#prevBtn").disabled = idx === 0;
  $("#nextBtn").disabled = hasAnswer;
  $("#clearAnswerBtn").disabled = !hasAnswer;
  $("#nextBtn").textContent = idx === quiz.test.questions.length - 1 ? "Yakunlash →" : "Keyingi →";

  // 🤖 Robot reaksiyasi: javob berilmagan — o'ylayapti; to'g'ri — bounce; xato — shake
  const qMascot = $("#qMascot");
  if (qMascot && window.ITMascot) {
    if (!hasAnswer) ITMascot.setState(qMascot, "thinking");
    else ITMascot.setState(qMascot, selected === q.c ? "success" : "error");
  }
}

function startQuiz(testId) {
  const test = findTestById(testId);
  if (!test) return;
  if (!isTestUnlocked(currentUser, testId)) {
    showToast("🔒 Avval oldingi testni yakunlang", "warning");
    return;
  }
  if (quiz.autoNavTimeout) {
    clearTimeout(quiz.autoNavTimeout);
    quiz.autoNavTimeout = null;
  }
  const shuffledQuestions = prepareShuffledQuestions(test.questions);
  quiz.test = {
    ...test,
    questions: shuffledQuestions
  };
  quiz.currentIndex = 0;
  quiz.answers = new Array(shuffledQuestions.length).fill(null);
  quiz.marked = new Array(shuffledQuestions.length).fill(false);
  quiz.autoNavTimeout = null;
  quiz.finished = false;
  quiz.startedAt = Date.now();
  quiz.remainingSec = test.durationSec;
  showPage("test");
  renderQuestion();
  renderProgress();
  startTimer();
}

function bindQuizUI() {
  $("#prevBtn").addEventListener("click", () => {
    // Avtomatik o'tish timeout'ni cancel qilish
    if (quiz.autoNavTimeout) {
      clearTimeout(quiz.autoNavTimeout);
      quiz.autoNavTimeout = null;
      $("#nextBtn").disabled = false;  // Tugmani qayta enable qilish
    }
    
    if (quiz.currentIndex > 0) { 
      quiz.currentIndex--; 
      renderQuestion(); 
      renderProgress(); 
    }
  });
  $("#nextBtn").addEventListener("click", () => {
    // Avtomatik o'tish timeout'ni cancel qilish
    if (quiz.autoNavTimeout) {
      clearTimeout(quiz.autoNavTimeout);
      quiz.autoNavTimeout = null;
    }
    
    if (!quiz.test) return;
    if (quiz.currentIndex < quiz.test.questions.length - 1) {
      quiz.currentIndex++;
      renderQuestion();
      renderProgress();
    } else {
      askFinishConfirm();
    }
  });
  $("#clearAnswerBtn").addEventListener("click", () => {
    if (!quiz.test || quiz.finished) return;
    const selected = quiz.answers[quiz.currentIndex];
    if (selected === null || selected === undefined) return;
    quiz.answers[quiz.currentIndex] = null;
    renderQuestion();
    renderProgress();
    showToast("Javob tozalandi", "info");
  });
  $("#markReviewBtn").addEventListener("click", () => {
    if (!quiz.test) return;
    quiz.marked[quiz.currentIndex] = !quiz.marked[quiz.currentIndex];
    renderQuestion();
    renderProgress();
    showToast(quiz.marked[quiz.currentIndex] ? "Belgilandi" : "Belgi olindi", "info");
  });
  $("#finishTestBtn").addEventListener("click", () => askFinishConfirm());
  $("#finishTestConfirm").addEventListener("click", () => {
    closeModal("#finishTestModal");
    finishTest({});
  });
}

function askFinishConfirm() {
  const answered = quiz.answers.filter(a => a !== null && a !== undefined).length;
  const total = quiz.test.questions.length;
  $("#finishTestSummary").textContent = `Javob berilgan: ${answered}/${total} ta savol. Davom etasizmi?`;
  openModal("#finishTestModal");
}

/* ====================== FINISH TEST — SCORING ====================== */
let lastResult = null;

function finishTest({ silent = false } = {}) {
  if (!quiz.test || quiz.finished) return;
  quiz.finished = true;

  if (quiz.autoNavTimeout) {
    clearTimeout(quiz.autoNavTimeout);
    quiz.autoNavTimeout = null;
  }
  
  stopTimer();
  const test = quiz.test;
  let correct = 0, incorrect = 0, skipped = 0;
  for (let i = 0; i < test.questions.length; i++) {
    const a = quiz.answers[i];
    if (a === null || a === undefined) skipped++;
    else if (a === test.questions[i].c) correct++;
    else incorrect++;
  }
  const score = correct * SCORE_PER_CORRECT;          // 5 ball har bir to\'g\'ri
  const percent = Math.round((correct / test.questions.length) * 100);
  const passed = percent >= PASS_THRESHOLD_PERCENT;   // 60% = 30/50

  const result = {
    id: "r" + Math.random().toString(36).slice(2, 10),
    testId: test.id,
    subject: test.subject,
    difficulty: test.difficulty,
    title: test.title,
    timestamp: Date.now(),
    durationSec: test.durationSec - quiz.remainingSec,
    correct, incorrect, skipped,
    score, percent, passed,
    answers: quiz.answers.slice(),
    questions: test.questions,
  };
  lastResult = result;

  // User uchun save
  if (currentUser) {
    currentUser.testResults = currentUser.testResults || [];
    currentUser.testResults.push(result);
    updateStreakOnTest(currentUser);
    awardXPAndPoints(currentUser, score);
    saveUsersAndCurrent();
  }

  if (!silent) showToast(passed ? "Test yakunlandi ✓" : "Test yakunlandi", passed ? "success" : "warning");

  // Reset quiz state to prevent interference with duel
  quiz.test = null;
  quiz.answers = [];
  quiz.marked = [];
  quiz.currentIndex = 0;
  quiz.remainingSec = 0;
  quiz.finished = true;

  renderResult(result);
  showPage("result");
}

function renderResult(r) {
  const passed = r.passed;
  $("#resultEmoji").textContent = passed ? (r.percent === 100 ? "🏆" : "🎉") : (r.percent >= 40 ? "💪" : "📚");

  // 🤖 Robot bayram yoki rag'bat holati
  const rm = $("#resultMascot");
  if (rm && window.ITMascot) {
    ITMascot.setState(rm, passed ? "complete" : "error");
    if (passed) ITMascot.showXP(rm, `+${r.score} XP`);
  }

  $("#resultScore").textContent = `${r.score} / 50`;
  $("#resultPercent").textContent = `${r.percent}%`;
  $("#resultStatus").textContent = passed ? "PASSED" : "FAILED";
  $("#resultStatus").className = `result-status ${passed ? 'passed' : 'failed'}`;

  $("#resultStats").innerHTML = `
    <div class="result-stat-card"><div class="val">${r.correct}</div><div class="lbl">To'g'ri</div></div>
    <div class="result-stat-card"><div class="val">${r.incorrect}</div><div class="lbl">Noto'g'ri</div></div>
    <div class="result-stat-card"><div class="val">${r.skipped}</div><div class="lbl">O'tkazilgan</div></div>
    <div class="result-stat-card"><div class="val">${r.percent}%</div><div class="lbl">Foiz</div></div>
    <div class="result-stat-card"><div class="val">${r.score}/50</div><div class="lbl">Ball</div></div>
    <div class="result-stat-card"><div class="val">${formatTime(r.durationSec)}</div><div class="lbl">Vaqt</div></div>
  `;

  // Review default hidden, toggle qilindi
  $("#reviewCard").classList.remove("active");
  const rb = $("#reviewBody");
  rb.innerHTML = "";
  for (let i = 0; i < r.questions.length; i++) {
    const q = r.questions[i];
    const ua = r.answers[i];
    const isCorrect = ua !== null && ua !== undefined && ua === q.c;
    const uaTxt = (ua === null || ua === undefined) ? `<em class="muted">Javob berilmagan</em>` : q.o[ua];
    const caTxt = q.o[q.c];
    const row = document.createElement("div");
    row.className = "review-item";
    row.innerHTML = `
      <div class="review-q">Savol ${i + 1}: ${q.q}</div>
      <div class="review-ans"><span class="label">Sizning javobingiz:</span><span class="ans ${isCorrect ? 'review-correct' : 'review-wrong'}">${uaTxt}</span></div>
      <div class="review-ans"><span class="label">To'g'ri javob:</span><span class="ans review-correct">${caTxt}</span></div>
      <div class="review-status ${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? '✅ TO\'G\'RI' : '❌ XATO'}</div>
      <div class="review-explanation">💡 Izoh: ${q.e || '—'}</div>
    `;
    rb.appendChild(row);
  }
}

function bindResultActions() {
  $("#reviewBtn").addEventListener("click", () => {
    $("#reviewCard").classList.toggle("active");
    $("#reviewBtn").textContent = $("#reviewCard").classList.contains("active") ? "Javoblarni yashirish" : "Natijani ko\'rish";
  });
  $("#retakeBtn").addEventListener("click", () => {
    if (lastResult) { const id = lastResult.testId; lastResult = null; openStartTestModal(id); }
  });
}

/* RESULTS HISTORY — OLIB TASHLANGAN: Natijalar alohida bolimi olib tashlandi. testResults datasi saqlanadi (XP, Reyting, Yutuqlar uchun). */
/* ====================== LEADERBOARD (umumiy BALL asosida) ====================== */
let rankPeriod = "all";

function bindLeaderboardFilter() {
  $$("#rankFilter .chip").forEach(c => c.addEventListener("click", () => {
    $$("#rankFilter .chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    rankPeriod = c.getAttribute("data-period");
    renderLeaderboard();
  }));
}

function periodFilterTS(period) {
  const now = Date.now();
  if (period === "week") return now - 7 * 86400000;
  if (period === "month") return now - 30 * 86400000;
  return 0;
}

function computeRankPoints(user, period) {
  // Asosiy: umumiy ball (points). Period bo\'yicha — shu davrda yig\'ilgan test scorelar summasi + points'ning perioddagi ulushi.
  const since = periodFilterTS(period);
  if (period === "all") return user.xp || 0; // Rank by lifetime XP instead of spendable points
  const sum = (user.testResults || [])
    .filter(r => (r.timestamp || 0) >= since)
    .reduce((s, r) => s + (r.score || 0), 0);
  return sum;
}

function renderLeaderboard() {
  const lb = $("#leaderboard");
  lb.innerHTML = "";
  const rows = users.slice().map(u => ({
    user: u,
    pts: computeRankPoints(u, rankPeriod),
    total: u.points || 0,
    testsCount: (u.testResults || []).length,
  })).sort((a, b) => b.pts - a.pts);

  // Top 3
  const top = rows.slice(0, 3);
  const rest = rows.slice(3);
  const medals = ["🥇", "🥈", "🥉"];
  const podium = document.createElement("div");
  podium.className = "podium";
  podium.innerHTML = top.map((row, i) => {
    const u = row.user;
    return `
      <div class="podium-place place-${i + 1}">
        <div class="podium-medal">${medals[i]}</div>
        <div class="avatar">${u.avatar || initialsOf(u.firstname)}</div>
        <div class="p-name">${u.firstname} ${u.lastname}</div>
        <div class="p-username muted">@${u.username}</div>
        <div class="p-pts"><strong>${row.pts}</strong> <span class="muted">ball</span></div>
      </div>
    `;
  }).join("");
  lb.appendChild(podium);

  const list = document.createElement("div");
  list.className = "leader-list";
  const restRows = rows.slice(3);
  if (!restRows.length) list.innerHTML = '<div class="empty-state">Yana ishtirokchilar yo\'q</div>';
  else list.innerHTML = restRows.map((row, i) => {
    const u = row.user;
    const isMe = currentUser && currentUser.id === u.id;
    return `
      <div class="leader-row ${isMe ? 'me' : ''}">
        <div class="lr-rank">${i + 4}</div>
        <div class="lr-avatar">${u.avatar || initialsOf(u.firstname)}</div>
        <div class="lr-info">
          <div class="lr-name">${u.firstname} ${u.lastname} ${isMe ? '<span class="me-tag">Siz</span>' : ''}</div>
          <div class="lr-user muted">@${u.username} · ${row.testsCount} ta test</div>
        </div>
        <div class="lr-pts"><strong>${row.pts}</strong><span class="muted"> ball</span></div>
      </div>
    `;
  }).join("");
  lb.appendChild(list);
}

/* ====================== ACHIEVEMENTS ====================== */
const ACHIEVEMENTS = [
  { id: "first_test", icon: "🎯", name: "Birinchi test", desc: "Birinchi testni yakunlang", check: u => (u.testResults || []).length >= 1 },
  { id: "five_tests", icon: "📚", name: "5 ta test", desc: "5 ta testni yakunlang", check: u => (u.testResults || []).length >= 5 },
  { id: "twenty", icon: "💯", name: "20 ta test", desc: "20 ta testni yakunlang", check: u => (u.testResults || []).length >= 20 },
  { id: "perfect", icon: "🏆", name: "Mukammal natija", desc: "Bir testda 50/50 oling", check: u => (u.testResults || []).some(r => r.percent === 100) },
  { id: "pass_ten", icon: "✅", name: "10 ta Passed", desc: "10 ta testdan o\'ting", check: u => (u.testResults || []).filter(r => r.passed).length >= 10 },
  { id: "lv3", icon: "⭐", name: "Level 3", desc: "3-levelga chiqing", check: u => (u.level || 1) >= 3 },
  { id: "lv5", icon: "🌟", name: "Level 5", desc: "5-levelga chiqing", check: u => (u.level || 1) >= 5 },
  { id: "streak3", icon: "🔥", name: "3 kunlik streak", desc: "3 kun ketma-ket test ishlang", check: u => (u.streak || 0) >= 3 },
  {
    id: "all_subj", icon: "🌈", name: "Barcha fanlar", desc: "Har bir fandan kamida 1 ta test", check: u => {
      const set = new Set((u.testResults || []).map(r => r.subject));
      return SUBJECTS.every(s => set.has(s.name));
    }
  },
];

function checkAchievements(user) {
  const had = new Set(user.achievements || []);
  const nowUnlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (!had.has(a.id) && a.check(user)) {
      had.add(a.id);
      nowUnlocked.push(a);
    }
  }
  user.achievements = Array.from(had);
  return nowUnlocked;
}

function renderAchievements() {
  const u = currentUser;
  const wrap = $("#achievementGrid");
  wrap.innerHTML = "";
  const had = new Set(u?.achievements || []);
  for (const a of ACHIEVEMENTS) {
    const unlocked = had.has(a.id);
    const el = document.createElement("div");
    el.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
    el.innerHTML = `
      <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
      <h4>${a.name}</h4>
      <p>${a.desc}</p>
      <div class="achievement-status ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? '✅ Ochildi' : '🔒 Yopiq'}</div>
    `;
    wrap.appendChild(el);
  }
}

/* ====================== PROFILE ====================== */
function renderProfile() {
  const u = currentUser;
  if (!u) return;
  const st = userStats(u);
  const joined = new Date(u.joinedAt);
  $("#profileHeader").innerHTML = `
    <div class="profile-avatar">${getActiveAvatar(u)}</div>
    <div class="profile-head-info">
      <h2>${u.firstname} ${u.lastname}</h2>
      <div class="muted">@${u.username} · ${u.email}</div>
      <div class="profile-level-row">
        <div class="level-badge">Level ${u.level}</div>
        <div class="xp-bar-wrap profile-xp">
          <div class="xp-bar-info">
            <span>${xpProgress(u.xp).current} XP</span>
            <span>/ ${xpProgress(u.xp).next} XP</span>
          </div>
          <div class="xp-bar"><div class="xp-bar-fill" style="width:${xpProgress(u.xp).percent}%"></div></div>
        </div>
      </div>
    </div>
  `;
  $("#profileStats").innerHTML = `
    <div class="profile-stat-card"><div class="val">${u.points || 0}</div><div class="lbl">Umumiy ball</div></div>
    <div class="profile-stat-card"><div class="val">${u.xp || 0}</div><div class="lbl">XP</div></div>
    <div class="profile-stat-card"><div class="val">${u.level || 1}</div><div class="lbl">Level</div></div>
    <div class="profile-stat-card"><div class="val">${st.total}</div><div class="lbl">Ishlangan testlar</div></div>
    <div class="profile-stat-card"><div class="val">${st.avgPercent}%</div><div class="lbl">O'rtacha foiz</div></div>
    <div class="profile-stat-card"><div class="val">${u.streak || 0} kun</div><div class="lbl">Streak</div></div>
    <div class="profile-stat-card"><div class="val">${(u.achievements || []).length}/${ACHIEVEMENTS.length}</div><div class="lbl">Yutuqlar</div></div>
    <div class="profile-stat-card"><div class="val">${joined.getDate()}/${joined.getMonth() + 1}/${joined.getFullYear()}</div><div class="lbl">Qo'shilgan</div></div>
  `;
  const state = storeState(u);
  const equipped = Object.values(state.equipped).map(storeItem).filter(Boolean);
  const gifts = (u.gifts || []).map(gift => {
    const item = storeItem(gift.itemId);
    const sender = userById(gift.from);
    return item ? `<span class="store-equipped-pill">${item.icon} ${item.name.replace(/^\S+\s/, '')} · ${sender ? sender.firstname : 'Do‘st'}</span>` : '';
  }).join('');
  $("#profileStats").insertAdjacentHTML("afterend", `
    <div class="card profile-store-summary">
      <div class="card-header"><h3>🛍️ Do'kon profili</h3></div>
      <div class="card-body">
        <p><strong>💰 ${u.points || 0} ball</strong> · <strong>XP ${u.xp || 0}</strong></p>
        <p class="muted">Taqilgan buyumlar</p>
        <div class="store-equipped">${equipped.length ? equipped.map(item => `<span class="store-equipped-pill">${item.icon} ${item.name.replace(/^\S+\s/, '')}</span>`).join('') : '<span class="muted">Hozircha yo‘q</span>'}</div>
        <p class="muted">Inventar: ${state.inventory.length} ta · Qabul qilingan sovg'alar: ${u.gifts ? u.gifts.length : 0} ta</p>
        <div class="store-equipped">${gifts || '<span class="muted">Sovg‘alar yo‘q</span>'}</div>
      </div>
    </div>
  `);
}

/* ====================== PROFILE EDIT MODAL ====================== */
function bindProfileEdit() {
  $("#editProfileBtn").addEventListener("click", () => {
    const u = currentUser; if (!u) return;
    $("#editFirstname").value = u.firstname;
    $("#editLastname").value = u.lastname;
    $("#editUsername").value = u.username;
    $("#editEmail").value = u.email;
    openModal("#editProfileModal");
  });
  $("#editProfileSave").addEventListener("click", () => {
    const u = currentUser; if (!u) return;
    const firstname = $("#editFirstname").value.trim();
    const lastname = $("#editLastname").value.trim();
    const username = $("#editUsername").value.trim();
    const email = $("#editEmail").value.trim();
    if (!firstname || !lastname || !username || !email) return showToast("Maydonlarni to\'ldiring", "error");
    if (users.find(x => x.username && x.username.toLowerCase() === username.toLowerCase() && x.id !== u.id))
      return showToast("Username band", "error");
    if (users.find(x => x.email && x.email.toLowerCase() === email.toLowerCase() && x.id !== u.id))
      return showToast("Email band", "error");
    u.firstname = firstname; u.lastname = lastname; u.username = username; u.email = email;
    saveUsersAndCurrent();
    refreshUserChip();
    renderProfile();
    renderDashboard();
    closeModal("#editProfileModal");
    showToast("Saqlandi", "success");
  });
}

/* ====================== SETTINGS ====================== */
function bindSettings() {
  $("#clearResultsBtn").addEventListener("click", () => {
    if (!confirm("Barcha test natijalarini o\'chirishga ishonchingiz komilmi?")) return;
    if (currentUser) {
      const lossScore = (currentUser.testResults || []).reduce((s, r) => s + (r.score || 0), 0);
      currentUser.testResults = [];
      currentUser.points = Math.max(0, (currentUser.points || 0) - lossScore);
      currentUser.xp = Math.max(0, (currentUser.xp || 0) - lossScore);
      currentUser.level = xpToLevel(currentUser.xp);
      currentUser.achievements = [];
      currentUser.testProgress = {};
      ensureUserTestProgress(currentUser);
      saveUsersAndCurrent();
    }
    showToast("Natijalar o\'chirildi", "info");
    renderDashboard();
  });
  $("#deleteAccountBtn").addEventListener("click", () => {
    if (!confirm("Hisobni butunlay o\'chirishga ishonchingiz komilmi? Bu amal qaytib kelmaydi!")) return;
    if (currentUser) {
      users = users.filter(u => u.id !== currentUser.id);
      currentUser = null;
      LS.del("currentUser");
      LS.set("users", users);
      showToast("Hisob o\'chirildi", "info");
      showAuthScreen();
    }
  });
}

/* ====================== HOOK: TEST FINISH → ACHIEVEMENTS AUTOCHECK + NEXT UNLOCK ====================== */
const _origFinish = finishTest;
finishTest = function (opts) {
  _origFinish(opts);
  if (currentUser && lastResult) {
    const total = lastResult.questions.length;
    if (total > 0) {
      ensureUserTestProgress(currentUser);
      const nextId = markTestCompletedAndUnlockNext(currentUser, lastResult.testId);
      saveUsersAndCurrent();
      if (nextId) {
        const next = findTestById(nextId);
        showToast(`🎉 Keyingi test ochildi: ${next ? next.title : nextId}`, "success", 3800);
      }
    }
    const unlocked = checkAchievements(currentUser);
    saveUsersAndCurrent();
    if (unlocked.length) {
      $("#achievementModalBody").innerHTML = unlocked.map(a => `
        <div class="achievement-unlocked">
          <div class="au-icon">${a.icon}</div>
          <div class="au-info"><h4>Yutuq ochildi!</h4><strong>${a.name}</strong><div class="muted">${a.desc}</div></div>
        </div>
      `).join("");
      openModal("#achievementModal");
    }
  }
};

/* ====================== DUEL ENGINE ====================== */
const DUEL_OPPONENTS = [
  { name: "Abdulloh", avatar: "👨‍💻", rate: 0.65 },
  { name: "Bobur", avatar: "🦁", rate: 0.60 },
  { name: "Shahzod", avatar: "🧙", rate: 0.70 },
  { name: "Kamola", avatar: "👩‍💻", rate: 0.68 },
  { name: "Jasur", avatar: "🐯", rate: 0.58 },
  { name: "Zilola", avatar: "🦸", rate: 0.64 }
];

const duelState = {
  subject: "all",
  questions: [],
  currentIndex: 0,
  player1: { name: "Siz", avatar: "🦊", score: 0 },
  player2: { name: "Raqib", avatar: "🐼", score: 0, rate: 0.6 },
  answers1: [],
  answers2: [],
  timer: null,
  remainingSec: 10,
  opponentTimer: null,
  opponentAnswered: false,
  opponentChoice: null,
  startTime: 0,
  totalDurationSec: 0,
};

function renderDuel() {
  // Reset screen states
  $("#duelLobby").classList.remove("hidden");
  $("#duelMatchmaking").classList.add("hidden");
  $("#duelGameplay").classList.add("hidden");
  $("#duelResult").classList.add("hidden");

  // Load user info for Player 1
  const u = currentUser;
  if (u) {
    duelState.player1.name = u.username || "Siz";
    duelState.player1.avatar = u.avatar || "🦊";
  } else {
    duelState.player1.name = "Siz";
    duelState.player1.avatar = "🦊";
  }

  renderDuelHistory();
}

function renderDuelHistory() {
  const container = $("#duelHistoryLog");
  if (!container) return;
  const history = currentUser?.duelHistory || [];
  if (!history.length) {
    container.innerHTML = `<div class="empty-state">Hali duellar o'tkazilmagan. Birinchi duelni boshlang!</div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table class="duel-history-table">
        <thead>
          <tr>
            <th>Sana</th>
            <th>Fan</th>
            <th>Raqib</th>
            <th>Natija</th>
            <th>Hisob</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(d => {
    const date = new Date(d.timestamp);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    let statusCls = "";
    let statusTxt = "";
    if (d.winStatus === "win") {
      statusCls = "duel-history-win";
      statusTxt = "G'alaba";
    } else if (d.winStatus === "loss") {
      statusCls = "duel-history-loss";
      statusTxt = "Mag'lubiyat";
    } else {
      statusCls = "duel-history-draw";
      statusTxt = "Durang";
    }
    return `
              <tr>
                <td class="muted">${dateStr}</td>
                <td>${d.subject}</td>
                <td>${d.player2}</td>
                <td><span class="${statusCls}">${statusTxt}</span></td>
                <td><strong>${d.score1} — ${d.score2}</strong></td>
              </tr>
            `;
  }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function stopDuelTimers() {
  if (duelState.timer) { clearInterval(duelState.timer); duelState.timer = null; }
  if (duelState.opponentTimer) { clearTimeout(duelState.opponentTimer); duelState.opponentTimer = null; }
}

function bindDuel() {
  // Mode selector chips (Bot vs Real Player)
  const modeChips = $$('#duelModeSelector .duel-chip');
  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const mode = chip.getAttribute('data-mode');
      const botDiffGroup = $('#botDifficultyGroup');
      if (botDiffGroup) {
        botDiffGroup.style.display = mode === 'bot' ? 'block' : 'none';
      }
    });
  });

  // Difficulty selector chips
  const diffChips = $$('#duelDiffSelector .duel-chip');
  diffChips.forEach(chip => {
    chip.addEventListener('click', () => {
      diffChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  $("#duelStartSearchBtn")?.addEventListener("click", () => {
    const activeMode = $('#duelModeSelector .duel-chip.active')?.getAttribute('data-mode') || 'bot';
    if (activeMode === 'player') {
      startRealPlayerDuel();
    } else {
      startMatchmaking();
    }
  });

  $("#duelBackToLobbyBtn")?.addEventListener("click", () => {
    stopDuelTimers();
    renderDuel();
  });
}

function startMatchmaking() {
  $("#duelLobby").classList.add("hidden");
  $("#duelMatchmaking").classList.remove("hidden");

  // P1 Loading UI
  $("#mmP1Avatar").textContent = duelState.player1.avatar;
  $("#mmP1Name").textContent = duelState.player1.name;

  // Choose a random opponent
  const opp = DUEL_OPPONENTS[Math.floor(Math.random() * DUEL_OPPONENTS.length)];
  duelState.player2.name = opp.name;
  duelState.player2.avatar = opp.avatar;
  const activeDiff = $('#duelDiffSelector .duel-chip.active')?.getAttribute('data-diff') || 'easy';
  const diffRates = { easy: 0.35, medium: 0.60, hard: 0.85 };
  duelState.player2.rate = diffRates[activeDiff] || 0.60;
  duelState.player2.difficulty = activeDiff;
  duelState.player2.score = 0;
  duelState.player1.score = 0;

  // P2 Loading animation
  $("#mmP2Avatar").textContent = "❓";
  $("#mmP2Name").textContent = "Qidirilmoqda...";
  $("#mmP2Status").textContent = "Kutilmoqda...";
  $("#mmP2Status").className = "m-status text-warning";
  $("#mmProgressFill").style.width = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      // Opponent found
      $("#mmP2Avatar").textContent = opp.avatar;
      $("#mmP2Name").textContent = opp.name;
      $("#mmP2Status").textContent = "Tayyor ✓";
      $("#mmP2Status").className = "m-status text-success";

      setTimeout(() => {
        startDuelMatch();
      }, 1000);
    }
    $("#mmProgressFill").style.width = `${progress}%`;
  }, 150);
}

function startDuelMatch() {
  $("#duelMatchmaking").classList.add("hidden");
  $("#duelGameplay").classList.remove("hidden");

  // Reset gameplay option grid display to single player
  $("#duelSingleOptionsArea")?.classList.remove("hidden");
  $("#duelDoubleOptionsArea")?.classList.add("hidden");

  duelState.currentIndex = 0;
  duelState.player1.score = 0;
  duelState.player2.score = 0;
  duelState.answers1 = [];
  duelState.answers2 = [];
  duelState.startTime = Date.now();

  // Set selected subject
  const subjVal = $("#duelSubjectSelect").value;
  duelState.subject = subjVal;

  // Pool questions
  let pool = [];
  if (subjVal === "all") {
    // Collect from all subjects
    for (const subName in Q_BANK) {
      const bank = Q_BANK[subName];
      for (const diff in bank) {
        pool = pool.concat(bank[diff]);
      }
    }
  } else {
    // Collect from specific subject
    const key = Object.keys(Q_BANK).find(k => k.toLowerCase() === subjVal.toLowerCase());
    if (key && Q_BANK[key]) {
      const bank = Q_BANK[key];
      for (const diff in bank) {
        pool = pool.concat(bank[diff]);
      }
    }
  }

  // If pool is empty, fall back to JavaScript questions
  if (!pool.length) {
    pool = pool.concat(Q_BANK.JavaScript.beginner).concat(Q_BANK.JavaScript.intermediate);
  }

  // Select 6 random questions and shuffle option positions
  duelState.questions = [];
  const tempPool = pool.slice();
  for (let i = 0; i < 6; i++) {
    if (tempPool.length === 0) break;
    const randIdx = Math.floor(Math.random() * tempPool.length);
    duelState.questions.push(tempPool.splice(randIdx, 1)[0]);
  }
  duelState.questions = prepareShuffledQuestions(duelState.questions);

  // Set Gameplay UI Elements
  $("#towP1Avatar").textContent = duelState.player1.avatar;
  $("#towP1Name").textContent = duelState.player1.name;
  $("#towP1Score").textContent = "0";
  $("#towP1Card").classList.remove("leading");

  $("#towP2Avatar").textContent = duelState.player2.avatar;
  $("#towP2Name").textContent = duelState.player2.name + (duelState.player2.difficulty ? ` [${({ easy: 'Oson', medium: "O'rtacha", hard: 'Qiyin' })[duelState.player2.difficulty]}]` : '');
  $("#towP2Score").textContent = "0";
  $("#towP2Card").classList.remove("leading");

  $("#towRopeMarker").style.left = "50%";

  loadDuelQuestion();
}

function loadDuelQuestion() {
  if (duelState.currentIndex >= 6 || duelState.player1.score >= 6 || duelState.player2.score >= 6) {
    finishDuel();
    return;
  }

  const qIndex = duelState.currentIndex;
  const q = duelState.questions[qIndex];

  // Set UI Question
  $("#duelQuestionNum").textContent = `SAVOL ${qIndex + 1} / 6`;
  $("#duelQText").textContent = q.q;

  // Set Options
  const container = $("#duelOptionsContainer");
  container.innerHTML = "";

  q.o.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "duel-opt-btn";
    btn.innerHTML = `
      <span class="duel-opt-mark">${String.fromCharCode(65 + idx)}</span>
      <span class="duel-opt-text">${opt}</span>
    `;
    btn.addEventListener("click", () => {
      selectDuelAnswer(idx);
    });
    container.appendChild(btn);
  });

  // Reset status banner
  const banner = $("#duelStatusBanner");
  banner.classList.remove("show", "success", "danger", "neutral");

  // Reset timer variables
  duelState.opponentAnswered = false;
  duelState.opponentChoice = null;
  duelState.remainingSec = 10;

  // Opponent simulates answer
  const oppDelay = Math.random() * 4500 + 2000; // 2s to 6.5s delay
  const isOppCorrect = Math.random() < duelState.player2.rate;
  if (isOppCorrect) {
    duelState.opponentChoice = q.c;
  } else {
    // Select a random wrong option
    const wrongs = [0, 1, 2, 3].filter(x => x !== q.c);
    duelState.opponentChoice = wrongs[Math.floor(Math.random() * wrongs.length)];
  }

  duelState.opponentTimer = setTimeout(() => {
    duelState.opponentAnswered = true;
    showToast(`${duelState.player2.name} javob berdi! ⚡`, "info", 1500);
  }, oppDelay);

  startDuelTimer();
}

function startDuelTimer() {
  if (duelState.timer) clearInterval(duelState.timer);

  const badge = $("#duelTimerBadge");
  badge.textContent = duelState.remainingSec;
  badge.classList.remove("warning");

  // Animate timer fill bar
  const fillEl = $("#duelTimerFill");
  if (fillEl) fillEl.style.width = "100%";

  duelState.timer = setInterval(() => {
    duelState.remainingSec -= 1;
    badge.textContent = duelState.remainingSec;
    if (fillEl) fillEl.style.width = `${(duelState.remainingSec / 10) * 100}%`;

    if (duelState.remainingSec <= 3) {
      badge.classList.add("warning");
    }

    if (duelState.remainingSec <= 0) {
      clearInterval(duelState.timer);
      selectDuelAnswer(null); // Time out
    }
  }, 1000);
}

function selectDuelAnswer(userChoice) {
  if (duelState.timer) clearInterval(duelState.timer);
  if (duelState.opponentTimer) clearTimeout(duelState.opponentTimer);

  // Disable all option buttons
  const btns = $$(".duel-opt-btn");
  btns.forEach(b => b.disabled = true);

  const q = duelState.questions[duelState.currentIndex];
  const correctIdx = q.c;

  // If opponent hasn't answered yet, force their answer now
  if (!duelState.opponentAnswered) {
    duelState.opponentAnswered = true;
  }
  const oppChoice = duelState.opponentChoice;

  // Record choices
  duelState.answers1.push(userChoice);
  duelState.answers2.push(oppChoice);

  // Mark classes on options
  btns.forEach((btn, idx) => {
    // Correct choice glows green
    if (idx === correctIdx) {
      btn.classList.add("correct");
      let selectorText = "";
      if (userChoice === correctIdx && oppChoice === correctIdx) {
        selectorText = `Siz + ${duelState.player2.name}`;
      } else if (userChoice === correctIdx) {
        selectorText = "Siz";
      } else if (oppChoice === correctIdx) {
        selectorText = duelState.player2.name;
      }
      if (selectorText) {
        btn.innerHTML += `<span class="duel-opt-badge c-badge">${selectorText}</span>`;
      }
    } else {
      // If user chose this wrong option
      if (idx === userChoice) {
        btn.classList.add("wrong");
        btn.innerHTML += `<span class="duel-opt-badge w-badge">Siz</span>`;
      }
      // If opponent chose this wrong option
      if (idx === oppChoice) {
        btn.classList.add("wrong");
        btn.innerHTML += `<span class="duel-opt-badge w-badge">${duelState.player2.name}</span>`;
      }
    }
  });

  // Calculate scores
  const userCorrect = userChoice === correctIdx;
  const oppCorrect = oppChoice === correctIdx;

  if (userCorrect) {
    duelState.player1.score += 1;
    showToast("To'g'ri! +1", "success", 1200);
  }
  if (oppCorrect) {
    duelState.player2.score += 1;
  }

  // Update Score UI
  $("#towP1Score").textContent = duelState.player1.score;
  $("#towP2Score").textContent = duelState.player2.score;

  // Update leadership glows
  $("#towP1Card").classList.toggle("leading", duelState.player1.score > duelState.player2.score);
  $("#towP2Card").classList.toggle("leading", duelState.player2.score > duelState.player1.score);

  // Move Tug of War rope marker
  // 50% is center. Max lead is 6 points. Shift by 7.5% per point difference.
  const scoreDiff = duelState.player1.score - duelState.player2.score;
  const shiftPct = 50 + scoreDiff * 7.5;
  // Constraint between 5% and 95%
  const finalPct = Math.max(5, Math.min(95, shiftPct));
  $("#towRopeMarker").style.left = `${finalPct}%`;

  // Status banner text
  const banner = $("#duelStatusBanner");
  banner.classList.remove("show", "success", "danger", "neutral");

  if (userCorrect && oppCorrect) {
    banner.textContent = "Ikkala o'yinchi ham to'g'ri javob berdi! 🤝";
    banner.classList.add("neutral");
  } else if (userCorrect) {
    banner.textContent = "Siz to'g'ri javob berdingiz! ⚡";
    banner.classList.add("success");
  } else if (oppCorrect) {
    banner.textContent = `${duelState.player2.name} to'g'ri javob berdi! 🛡️`;
    banner.classList.add("danger");
  } else {
    banner.textContent = "Har ikkala o'yinchi ham xato javob berdi! ❌";
    banner.classList.add("neutral");
  }
  banner.classList.add("show");

  // Move to next question after 2.5s
  setTimeout(() => {
    duelState.currentIndex += 1;
    loadDuelQuestion();
  }, 2500);
}

const realPlayerState = {
  p1Answered: false,
  p2Answered: false,
  p1Choice: null,
  p2Choice: null,
};

function startRealPlayerDuel() {
  $("#duelLobby").classList.add("hidden");
  $("#duelMatchmaking").classList.add("hidden");
  $("#duelGameplay").classList.remove("hidden");

  // Setup real player names
  const u = currentUser;
  duelState.player1.name = u ? (u.username || 'Player 1') : 'Player 1';
  duelState.player1.avatar = u ? (u.avatar || '🦊') : '🦊';
  duelState.player2.name = 'Player 2';
  duelState.player2.avatar = '🐼';
  duelState.player2.rate = 1; // human player
  duelState.player2.difficulty = null;
  duelState.player1.score = 0;
  duelState.player2.score = 0;
  duelState.answers1 = [];
  duelState.answers2 = [];
  duelState.startTime = Date.now();
  duelState.currentIndex = 0;

  // Build question pool
  const subjVal = $("#duelSubjectSelect").value;
  duelState.subject = subjVal;
  let pool = [];
  if (subjVal === "all") {
    for (const subName in Q_BANK) {
      const bank = Q_BANK[subName];
      for (const diff in bank) pool = pool.concat(bank[diff]);
    }
  } else {
    const key = Object.keys(Q_BANK).find(k => k.toLowerCase() === subjVal.toLowerCase());
    if (key && Q_BANK[key]) {
      for (const diff in Q_BANK[key]) pool = pool.concat(Q_BANK[key][diff]);
    }
  }
  if (!pool.length) pool = Q_BANK.JavaScript.beginner.concat(Q_BANK.JavaScript.intermediate);
  duelState.questions = [];
  const tempPool = pool.slice();
  for (let i = 0; i < 6 && tempPool.length; i++) {
    const idx = Math.floor(Math.random() * tempPool.length);
    duelState.questions.push(tempPool.splice(idx, 1)[0]);
  }

  // Update TOW UI
  $("#towP1Avatar").textContent = duelState.player1.avatar;
  $("#towP1Name").textContent = duelState.player1.name;
  $("#towP1Score").textContent = "0";
  $("#towP1Card").classList.remove("leading");
  $("#towP2Avatar").textContent = duelState.player2.avatar;
  $("#towP2Name").textContent = duelState.player2.name;
  $("#towP2Score").textContent = "0";
  $("#towP2Card").classList.remove("leading");
  $("#towRopeMarker").style.left = "50%";

  // Show double options, hide single
  $("#duelSingleOptionsArea").classList.add("hidden");
  $("#duelDoubleOptionsArea").classList.remove("hidden");
  $("#duelP1PanelName").textContent = duelState.player1.name;
  $("#duelP2PanelName").textContent = duelState.player2.name;

  loadRealPlayerQuestion();
}

function loadRealPlayerQuestion() {
  if (duelState.currentIndex >= 6) { finishDuel(); return; }
  const q = duelState.questions[duelState.currentIndex];
  $("#duelQuestionNum").textContent = `SAVOL ${duelState.currentIndex + 1} / 6`;
  $("#duelQText").textContent = q.q;

  realPlayerState.p1Answered = false;
  realPlayerState.p2Answered = false;
  realPlayerState.p1Choice = null;
  realPlayerState.p2Choice = null;

  // Render P1 options (keyboard A/S/D/F → index 0/1/2/3)
  const p1Container = $("#duelP1OptionsContainer");
  const p2Container = $("#duelP2OptionsContainer");
  p1Container.innerHTML = "";
  p2Container.innerHTML = "";

  const keys1 = ['A', 'S', 'D', 'F'];
  const keys2 = ['H', 'J', 'K', 'L'];

  q.o.forEach((opt, idx) => {
    // P1 button
    const btn1 = document.createElement("button");
    btn1.className = "duel-opt-btn";
    btn1.dataset.idx = idx;
    btn1.innerHTML = `<span class="duel-opt-mark">${keys1[idx]}</span><span class="duel-opt-text">${opt}</span>`;
    btn1.addEventListener("click", () => selectRealPlayerAnswer(1, idx));
    p1Container.appendChild(btn1);

    // P2 button
    const btn2 = document.createElement("button");
    btn2.className = "duel-opt-btn";
    btn2.dataset.idx = idx;
    btn2.innerHTML = `<span class="duel-opt-mark">${keys2[idx]}</span><span class="duel-opt-text">${opt}</span>`;
    btn2.addEventListener("click", () => selectRealPlayerAnswer(2, idx));
    p2Container.appendChild(btn2);
  });

  // Reset status banner
  const banner = $("#duelStatusBanner");
  banner.classList.remove("show", "success", "danger", "neutral");

  // Keyboard listeners
  const keyHandler = (e) => {
    const k = e.key.toUpperCase();
    const kMap1 = { A: 0, S: 1, D: 2, F: 3 };
    const kMap2 = { H: 0, J: 1, K: 2, L: 3 };
    if (!realPlayerState.p1Answered && kMap1[k] !== undefined) selectRealPlayerAnswer(1, kMap1[k]);
    if (!realPlayerState.p2Answered && kMap2[k] !== undefined) selectRealPlayerAnswer(2, kMap2[k]);
  };
  document.addEventListener('keydown', keyHandler);
  duelState._keyHandler = keyHandler;

  // Timer
  duelState.remainingSec = 10;
  startDuelTimer();
}

function selectRealPlayerAnswer(player, choiceIdx) {
  if (player === 1 && realPlayerState.p1Answered) return;
  if (player === 2 && realPlayerState.p2Answered) return;

  if (player === 1) {
    realPlayerState.p1Answered = true;
    realPlayerState.p1Choice = choiceIdx;
    // Mark P1 button
    const btns = $$('#duelP1OptionsContainer .duel-opt-btn');
    btns.forEach(b => { if (parseInt(b.dataset.idx) === choiceIdx) b.classList.add('p1-selected'); b.disabled = true; });
    showToast(`${duelState.player1.name} javob berdi!`, "info", 1000);
  } else {
    realPlayerState.p2Answered = true;
    realPlayerState.p2Choice = choiceIdx;
    const btns = $$('#duelP2OptionsContainer .duel-opt-btn');
    btns.forEach(b => { if (parseInt(b.dataset.idx) === choiceIdx) b.classList.add('p2-selected'); b.disabled = true; });
    showToast(`${duelState.player2.name} javob berdi!`, "info", 1000);
  }

  // If both answered, evaluate
  if (realPlayerState.p1Answered && realPlayerState.p2Answered) {
    if (duelState.timer) clearInterval(duelState.timer);
    if (duelState._keyHandler) { document.removeEventListener('keydown', duelState._keyHandler); duelState._keyHandler = null; }
    evaluateRealPlayerRound();
  }
}

function evaluateRealPlayerRound() {
  const q = duelState.questions[duelState.currentIndex];
  const correct = q.c;
  const p1c = realPlayerState.p1Choice;
  const p2c = realPlayerState.p2Choice;

  // Show correct/wrong on P1 options
  $$('#duelP1OptionsContainer .duel-opt-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    if (idx === correct) btn.classList.add('correct');
    else if (idx === p1c) btn.classList.add('wrong');
  });
  $$('#duelP2OptionsContainer .duel-opt-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    if (idx === correct) btn.classList.add('correct');
    else if (idx === p2c) btn.classList.add('wrong');
  });

  const p1ok = p1c === correct;
  const p2ok = p2c === correct;
  if (p1ok) duelState.player1.score++;
  if (p2ok) duelState.player2.score++;

  $("#towP1Score").textContent = duelState.player1.score;
  $("#towP2Score").textContent = duelState.player2.score;
  $("#towP1Card").classList.toggle("leading", duelState.player1.score > duelState.player2.score);
  $("#towP2Card").classList.toggle("leading", duelState.player2.score > duelState.player1.score);

  const scoreDiff = duelState.player1.score - duelState.player2.score;
  const shiftPct = Math.max(5, Math.min(95, 50 + scoreDiff * 7.5));
  $("#towRopeMarker").style.left = `${shiftPct}%`;

  const banner = $("#duelStatusBanner");
  banner.classList.remove("show", "success", "danger", "neutral");
  if (p1ok && p2ok) { banner.textContent = "Ikkala o'yinchi ham to'g'ri! 🤝"; banner.classList.add("neutral"); }
  else if (p1ok) { banner.textContent = `${duelState.player1.name} to'g'ri javob berdi! ⚡`; banner.classList.add("success"); }
  else if (p2ok) { banner.textContent = `${duelState.player2.name} to'g'ri javob berdi! 🛡️`; banner.classList.add("danger"); }
  else { banner.textContent = "Ikkalasi ham xato! ❌"; banner.classList.add("neutral"); }
  banner.classList.add("show");

  duelState.answers1.push(p1c);
  duelState.answers2.push(p2c);

  setTimeout(() => {
    duelState.currentIndex++;
    // Re-show single/double areas
    $("#duelSingleOptionsArea").classList.add("hidden");
    $("#duelDoubleOptionsArea").classList.remove("hidden");
    loadRealPlayerQuestion();
  }, 2500);
}

function finishDuel() {
  // Cleanup real player keyboard
  if (duelState._keyHandler) {
    document.removeEventListener('keydown', duelState._keyHandler);
    duelState._keyHandler = null;
  }
  // Reset option areas
  $("#duelSingleOptionsArea")?.classList.remove("hidden");
  $("#duelDoubleOptionsArea")?.classList.add("hidden");

  if (duelState.timer) clearInterval(duelState.timer);
  if (duelState.opponentTimer) clearTimeout(duelState.opponentTimer);

  duelState.totalDurationSec = Math.floor((Date.now() - duelState.startTime) / 1000);

  // Store results before resetting state
  const score1 = duelState.player1.score;
  const score2 = duelState.player2.score;
  const player1Name = duelState.player1.name;
  const player2Name = duelState.player2.name;
  const player1Avatar = duelState.player1.avatar;
  const player2Avatar = duelState.player2.avatar;
  const win = score1 > score2;
  const draw = score1 === score2;

  // Reset duel state for next match
  duelState.currentIndex = 0;
  duelState.player1.score = 0;
  duelState.player2.score = 0;
  duelState.answers1 = [];
  duelState.answers2 = [];
  duelState.questions = [];
  duelState.opponentAnswered = false;
  duelState.opponentChoice = null;

  // Populate result player cards
  const resP1El = $("#duelResP1Avatar");
  const resP2El = $("#duelResP2Avatar");
  const resP1Name = $("#duelResP1Name");
  const resP2Name = $("#duelResP2Name");
  const resP1Score = $("#duelResP1Score");
  const resP2Score = $("#duelResP2Score");
  if (resP1El) resP1El.textContent = player1Avatar;
  if (resP2El) resP2El.textContent = player2Avatar;
  if (resP1Name) resP1Name.textContent = player1Name;
  if (resP2Name) resP2Name.textContent = player2Name;
  if (resP1Score) resP1Score.textContent = score1;
  if (resP2Score) resP2Score.textContent = score2;

  // Add winner class to winner card
  const p1card = $(".duel-res-player.p1-card");
  const p2card = $(".duel-res-player.p2-card");
  if (p1card) p1card.classList.toggle("winner-card", win);
  if (p2card) p2card.classList.toggle("winner-card", !win && !draw);

  let xpAwarded = 10;
  let pointsAwarded = 0;

  if (win) {
    xpAwarded = 50;
    pointsAwarded = 25;
    $("#duelResultTitle").textContent = "G'ALABA! 🏆";
    $("#duelResultEmoji").textContent = "🏆";
    $("#duelResultOpponentText").textContent = `Siz ${player2Name} ustidan g'alaba qozondingiz!`;
    triggerConfetti();
  } else if (draw) {
    xpAwarded = 15;
    pointsAwarded = 0;
    $("#duelResultTitle").textContent = "DURANG! 🤝";
    $("#duelResultEmoji").textContent = "🤝";
    $("#duelResultOpponentText").textContent = `Siz ${player2Name} bilan durang o'ynadingiz.`;
  } else {
    xpAwarded = 10;
    pointsAwarded = 0;
    $("#duelResultTitle").textContent = "MAG'LUBIYAT! 💀";
    $("#duelResultEmoji").textContent = "💀";
    $("#duelResultOpponentText").textContent = `Siz ${player2Name}ga yutqazdingiz. Harakatdan to'xtamang!`;
  }

  $("#duelResultScoreText").textContent = `${score1} — ${score2}`;
  $("#rewardXpVal").textContent = `+${xpAwarded} XP`;
  $("#rewardPointsVal").textContent = `+${pointsAwarded} ball`;

  // Update current user
  if (currentUser) {
    currentUser.xp = (currentUser.xp || 0) + xpAwarded;
    currentUser.points = (currentUser.points || 0) + pointsAwarded;
    currentUser.level = xpToLevel(currentUser.xp);

    // Increment Real-Time Duel Stats
    currentUser.duelTotal = (currentUser.duelTotal || 0) + 1;
    if (win) {
      currentUser.duelWins = (currentUser.duelWins || 0) + 1;
    } else if (!draw) {
      currentUser.duelLosses = (currentUser.duelLosses || 0) + 1;
    }

    saveUsersAndCurrent();
    updateDuelStatsUI();
  }

  // Log duel in history
  const activeModeSaved = $('#duelModeSelector .duel-chip.active')?.getAttribute('data-mode') || 'bot';
  const duelRecord = {
    id: "d" + Math.random().toString(36).slice(2, 10),
    timestamp: Date.now(),
    subject: duelState.subject,
    player1: player1Name,
    player2: player2Name,
    score1: score1,
    score2: score2,
    winStatus: win ? "win" : (draw ? "draw" : "loss"),
    mode: activeModeSaved,
    difficulty: duelState.player2.difficulty || null,
    durationSec: duelState.totalDurationSec,
  };

  if (currentUser) {
    currentUser.duelHistory = currentUser.duelHistory || [];
    currentUser.duelHistory.push(duelRecord);
    saveUsersAndCurrent();
  }

  // Transition UI
  $("#duelGameplay").classList.add("hidden");
  $("#duelResult").classList.remove("hidden");
}

function triggerConfetti() {
  const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `-20px`;
    el.style.width = `${Math.random() * 8 + 6}px`;
    el.style.height = `${Math.random() * 12 + 6}px`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    el.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

/* ====================== AUTH INITIALIZATION ====================== */
function initAuthState() {
  users = ensureUsers();
  const savedUser = LS.get("currentUser", null);

  if (savedUser && savedUser.id) {
    const validUser = users.find(u => u.id === savedUser.id);

    if (validUser) {
      currentUser = validUser;
      LS.set("currentUser", currentUser);
      migrateLegacyKeys();
      console.log("✅ Session restored:", currentUser.username);
      return true;
    }
  }

  currentUser = null;
  LS.del("currentUser");
  console.log("ℹ️ No active session");
  return false;
}

/* ====================== INIT ====================== */
function loadSidebarState() {
  try {
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    const isMobile = window.innerWidth <= 1024;
    
    if (!isMobile && isCollapsed) {
      const sidebar = $("#sidebar");
      const main = $(".main");
      if (sidebar) sidebar.classList.add("collapsed");
      if (main) main.classList.add("expanded");
    }
  } catch (e) {
    console.warn("localStorage not available or restricted");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthState();

  loadTheme();
  loadSidebarState();
  bindAuth();
  bindNav();
  bindTestsPage();
  bindQuizUI();
  bindResultActions();
  bindLeaderboardFilter();
  bindProfileEdit();
  bindSettings();
  bindModalsClose();
  bindDuel();
  bindStore();

  if (currentUser) showApp();
  else showAuth();
});


/* ====================== STORE ====================== */
let storeCategory = 'all';
let pendingGiftId = null;

function storeState(user = currentUser) {
  if (!user) return { inventory: [], equipped: {} };
  if (!user.store || typeof user.store !== 'object') user.store = { inventory: [], equipped: {} };
  if (!Array.isArray(user.store.inventory)) user.store.inventory = [];
  if (!user.store.equipped || typeof user.store.equipped !== 'object') user.store.equipped = {};
  return user.store;
}

function storeItem(id) { return STORE_ITEMS.find(item => item.id === id); }
function storeOwned(item) { return !!currentUser && storeState().inventory.includes(item.id); }

function storeUnlockLabel(req) {
  if (!req) return '';
  if (req.type === 'level') return `Level ${req.value} kerak`;
  if (req.type === 'tests') return `${req.count} ta test kerak`;
  if (req.type === 'streak') return `${req.days} kunlik streak kerak`;
  if (req.type === 'perfect') return `${req.count} ta mukammal test kerak`;
  return 'Maxsus yutuq kerak';
}

function storeRequirementMet(req) {
  if (!req || !currentUser) return true;
  if (req.type === 'level') return (currentUser.level || 1) >= req.value;
  if (req.type === 'tests') return (currentUser.testResults || []).length >= req.count;
  if (req.type === 'subject') return (currentUser.testResults || []).filter(r => r.subject === req.name).length >= req.tests;
  if (req.type === 'streak') return (currentUser.streak || 0) >= req.days;
  if (req.type === 'perfect') return (currentUser.testResults || []).filter(r => r.percent === 100).length >= req.count;
  if (req.type === 'achievement') return (currentUser.achievements || []).includes(req.id);
  return true;
}

function storeRarity(item) { return RARITY_LABELS[item.rarity] || item.rarity; }

function renderStore() {
  if (!currentUser) return;
  const state = storeState();
  const balance = $('#storeBalanceValue');
  if (balance) balance.textContent = (currentUser.points || 0).toLocaleString();
  const name = $('#storeAvatarName');
  if (name) name.textContent = currentUser.username || currentUser.firstname || 'Player';
  renderStoreAvatar(state);
  renderStoreInventory(state);
  renderStoreCatalog(state);
}

function renderStoreCatalog(state = storeState()) {
  const grid = $('#storeGrid');
  if (!grid) return;
  const items = storeCategory === 'all' ? STORE_ITEMS : STORE_ITEMS.filter(item => item.type === storeCategory);
  const count = $('#storeCatalogCount');
  if (count) count.textContent = `${items.length} buyum`;
  grid.innerHTML = items.map(item => {
    const owned = state.inventory.includes(item.id);
    const locked = !storeRequirementMet(item.unlockReq);
    const affordable = (currentUser.points || 0) >= item.price;
    const action = item.type === 'gift'
      ? `<button class="store-item-action" data-gift="${item.id}">🎁 Yuborish</button>`
      : owned
        ? `<button class="store-item-action owned" data-equip="${item.id}">${state.equipped[item.type] === item.id ? '✓ Taqilgan' : 'Taqish'}</button>`
        : locked
          ? `<button class="store-item-action locked" disabled title="${storeUnlockLabel(item.unlockReq)}">🔒 Qulflangan</button>`
          : `<button class="store-item-action" data-buy="${item.id}" ${affordable ? '' : 'disabled'}>${affordable ? 'Sotib olish' : 'Ball yetarli emas'}</button>`;
    return `<article class="store-item ${owned ? 'is-owned' : ''} ${locked ? 'is-locked' : ''}">
      <div class="store-item-art rarity-${item.rarity}">${item.icon}</div>
      <div class="store-item-meta"><span class="store-rarity rarity-text-${item.rarity}">${storeRarity(item)}</span><span class="store-item-type">${item.type}</span></div>
      <h3>${item.name.replace(/^\S+\s/, '')}</h3><p>${item.description || ''}</p>${owned ? '<span class="store-owned-status">✓ Sotib olingan</span>' : ''}
      <div class="store-item-footer"><strong>💎 ${item.price}</strong>${action}</div>
    </article>`;
  }).join('');
}

function renderStoreAvatar(state = storeState()) {
  const stage = $('#storeAvatarPreview');
  if (!stage) return;
  const base = stage.querySelector('.store-avatar-base');
if (base) base.textContent = getActiveAvatar(currentUser);
stage.className = 'store-avatar-stage';
['hat', 'glasses', 'badge', 'clothes'].forEach(type => {
  const target = stage.querySelector(`.store-avatar-${type}`);
  const item = storeItem(state.equipped[type]);
  if (target) { target.textContent = item ? item.icon : ''; target.classList.toggle('visible', !!item); }
});
const bg = storeItem(state.equipped.background);
const frame = storeItem(state.equipped.frame);
const effect = storeItem(state.equipped.effect);
if (bg) stage.classList.add(`store-bg-${bg.id.replace('bg_', '')}`);
if (frame) stage.classList.add(`store-frame-${frame.id.replace('frame_', '')}`);
if (effect) stage.classList.add(`store-effect-${effect.id.replace('effect_', '')}`);
}

function renderStoreInventory(state = storeState()) {
  const list = $('#storeInventory');
  const equippedList = $('#storeEquippedList');
  const count = $('#storeInventoryCount');
  if (count) count.textContent = `${state.inventory.length} / ${STORE_ITEMS.length}`;
  if (equippedList) {
    const equipped = Object.entries(state.equipped).map(([type, id]) => ({ type, item: storeItem(id) })).filter(x => x.item);
    equippedList.innerHTML = equipped.length ? equipped.map(({ type, item }) => `<button class="store-equipped-pill" data-unequip="${type}" title="Olib tashlash"><span>${item.icon}</span>${item.name.replace(/^\S+\s/, '')} <b>×</b></button>`).join('') : '<span class="store-empty-equipped">Loadout bo\'sh</span>';
  }
  if (!list) return;
  const owned = state.inventory.map(storeItem).filter(Boolean);
  list.innerHTML = owned.length ? owned.map(item => {
    const equipped = state.equipped[item.type] === item.id;
    return `<button class="store-inventory-item ${equipped ? 'equipped' : ''}" data-equip="${item.id}"><span>${item.icon}</span><small>${equipped ? 'TAQILGAN' : 'TAQISH'}</small></button>`;
  }).join('') : '<div class="store-empty-inventory">🎒<span>Inventar bo\'sh</span></div>';
}

function bindStore() {
  const filters = $('#storeFilters');
  if (filters) filters.addEventListener('click', e => {
    const button = e.target.closest('[data-category]');
    if (!button) return;
    storeCategory = button.dataset.category || 'all';
    $$('#storeFilters .store-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    renderStoreCatalog();
  });
  const grid = $('#storeGrid');
  if (grid) grid.addEventListener('click', e => {
    const buy = e.target.closest('[data-buy]');
    const equip = e.target.closest('[data-equip]');
    const gift = e.target.closest('[data-gift]');
    if (buy) showGiftModal(buy.dataset.buy);
    else if (gift) openSendGiftModal(gift.dataset.gift);
    else if (equip) equipStoreItem(equip.dataset.equip);
  });
  const inventory = $('#storeInventory');
  if (inventory) inventory.addEventListener('click', e => {
    const equip = e.target.closest('[data-equip]');
    if (equip) equipStoreItem(equip.dataset.equip);
  });
  const equipped = $('#storeEquippedList');
  if (equipped) equipped.addEventListener('click', e => {
    const remove = e.target.closest('[data-unequip]');
    if (remove) unequipStoreItem(remove.dataset.unequip);
  });
  const confirm = $('#confirmGiftBtn');
  if (confirm) confirm.addEventListener('click', () => { if (pendingGiftId) buyStoreItem(pendingGiftId); });
  const giftChoice = $('#giftChoice');
  if (giftChoice) giftChoice.addEventListener('change', updateGiftPrice);
  const sendGift = $('#sendGiftConfirm');
  if (sendGift) sendGift.addEventListener('click', sendGiftToUser);
}

function giftItems() { return STORE_ITEMS.filter(item => item.type === 'gift'); }
function openSendGiftModal(itemId) {
  if (!currentUser) return;
  const recipients = users.filter(user => user.id !== currentUser.id);
  const recipient = $('#giftRecipient');
  const choice = $('#giftChoice');
  if (!recipient || !choice || !recipients.length) return showToast("Sovg'a yuborish uchun do'stlar topilmadi", 'error');
  recipient.innerHTML = recipients.map(user => `<option value="${user.id}">${user.firstname} ${user.lastname}</option>`).join('');
  choice.innerHTML = giftItems().map(item => `<option value="${item.id}" ${item.id === itemId ? 'selected' : ''}>${item.icon} ${item.name.replace(/^\S+\s/, '')}</option>`).join('');
  updateGiftPrice();
  openModal('#sendGiftModal');
}
function updateGiftPrice() {
  const item = storeItem($('#giftChoice')?.value);
  const price = $('#giftSendPrice');
  if (price) price.textContent = item ? `${item.price} ball` : '0 ball';
}
function sendGiftToUser() {
  const recipient = userById($('#giftRecipient')?.value);
  const item = storeItem($('#giftChoice')?.value);
  if (!currentUser || !recipient || !item) return;
  if ((currentUser.points || 0) < item.price) return showToast('Ball yetarli emas!', 'error');
  currentUser.points -= item.price;
  recipient.gifts = Array.isArray(recipient.gifts) ? recipient.gifts : [];
  recipient.giftHistory = Array.isArray(recipient.giftHistory) ? recipient.giftHistory : [];
  currentUser.giftHistory = Array.isArray(currentUser.giftHistory) ? currentUser.giftHistory : [];
  const gift = { id: `gift_${Date.now()}`, itemId: item.id, from: currentUser.id, to: recipient.id, createdAt: Date.now() };
  recipient.gifts.push(gift);
  recipient.giftHistory.push(gift);
  currentUser.giftHistory.push(gift);
  saveUsersAndCurrent();
  closeModal('#sendGiftModal');
  showToast(`🎁 ${recipient.firstname}ga sovg'a yuborildi!`, 'success');
  triggerPurchaseConfetti();
  refreshStoreViews();
}

function showGiftModal(itemId) {
  const item = storeItem(itemId);
  if (!item || !currentUser || storeOwned(item)) return;
  pendingGiftId = itemId;
  $('#purchaseItemIcon').textContent = item.icon;
  $('#purchaseItemName').textContent = item.name;
  $('#purchaseItemPrice').textContent = `${item.price} ball`;
  $('#purchaseCurrentBalance').textContent = `${currentUser.points || 0} ball`;
  $('#purchaseAfterBalance').textContent = `${Math.max(0, (currentUser.points || 0) - item.price)} ball`;

  const questionEl = $('.purchase-question');
  if (questionEl) {
    questionEl.textContent = `Ushbu sovg'ani ${item.price} ballga sotib olmoqchimisiz?`;
  }

  openModal('#giftModal');
}

function buyStoreItem(itemId) {
  const item = storeItem(itemId);
  if (!item || !currentUser) return;
  const state = storeState();
  if (state.inventory.includes(item.id)) return closeModal('#giftModal');
  if (!storeRequirementMet(item.unlockReq)) return showToast(storeUnlockLabel(item.unlockReq), 'info');
  if ((currentUser.points || 0) < item.price) return showToast('Ball yetarli emas!', 'error');
  currentUser.points -= item.price;
  state.inventory.push(item.id);
  saveUsersAndCurrent();
  pendingGiftId = null;
  closeModal('#giftModal');
  showToast("🎉 Sovg'a olindi!", "success");
  triggerPurchaseConfetti();
  refreshStoreViews();
}

function equipStoreItem(itemId) {
  const item = storeItem(itemId);
  const state = storeState();
  if (!item || !state.inventory.includes(item.id)) return;
  state.equipped[item.type] = item.id;
  saveUsersAndCurrent();
  showToast(`${item.name} taqildi!`, 'success');
  refreshStoreViews();
}

function unequipStoreItem(type) {
  const state = storeState();
  if (!state.equipped[type]) return;
  state.equipped[type] = null;
  saveUsersAndCurrent();
  refreshStoreViews();
}

function refreshStoreViews() {
  renderStore();
  refreshUserChip();
  if ($('#page-dashboard')?.classList.contains('active')) renderDashboard();
  if ($('#page-profile')?.classList.contains('active')) renderProfile();
  if ($('#page-ranking')?.classList.contains('active')) renderLeaderboard();
}

function triggerPurchaseConfetti() {
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = '-20px';
    el.style.animationDelay = `${Math.random() * .6}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

/* ====================== CODE PLAYGROUND IDE ENGINE ====================== */
const DEFAULT_IDE_CODES = {
  html: `<div class="container">
  <h1 id="title">Code Playground IDE 🚀</h1>
  <p class="subtitle">HTML5, CSS3 va JavaScript kodlarini birga ishlatib ko'ring.</p>
  <button id="btn" class="btn">Tugmani bosing</button>
  <div id="output" class="output-box"></div>
</div>`,
  css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  padding: 30px;
  margin: 0;
}

.container {
  max-width: 600px;
  background: #1e293b;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
}

h1 { color: #818cf8; margin-top: 0; }
.subtitle { color: #94a3b8; font-size: 14px; }

.btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.output-box {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  font-weight: 500;
  color: #10b981;
}`,
  js: `// JavaScript kodi
const btn = document.getElementById("btn");
const output = document.getElementById("output");
let count = 0;

if (btn) {
  btn.onclick = () => {
    count++;
    console.log("Tugma " + count + "-marta bosildi");
    if (output) output.textContent = "🎉 Tugma " + count + "-marta bosildi!";
  };
}

console.log("IDE muvaffaqiyatli ishga tushdi!");`,
  python: `print("Hello from Python!\nThis is a syntax-highlight-only editor in the browser.")
name = "Python"
print(f"Language: {name}")`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from Java!");
    System.out.println("Execution unavailable in this browser app.");
  }
}`,
  cpp: `#include <iostream>
#include <string>

int main() {
    std::string message = "Hello from C++!";
    std::cout << message << std::endl;
    std::cout << "Execution unavailable in this browser app." << std::endl;
    return 0;
}`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        Console.WriteLine("Execution unavailable in this browser app.");
    }
}`,
  sql: `SELECT users.id,
       users.username,
       COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON orders.user_id = users.id
WHERE users.is_active = 1
GROUP BY users.id, users.username
ORDER BY order_count DESC
LIMIT 10;`
};

const IDE_LANGUAGE_META = {
  web: { label: '🌐 Web Stack', editors: ['html', 'css', 'js'] },
  python: { label: '🐍 Python', editors: ['python'] },
  java: { label: '☕ Java', editors: ['java'] },
  cpp: { label: '🔧 C++', editors: ['cpp'] },
  csharp: { label: '🔷 C#', editors: ['csharp'] },
  sql: { label: '🗄 SQL', editors: ['sql'] }
};

let codingIdeState = {
  activeTab: 'html', // 'html' | 'css' | 'javascript'
  activeLangSelect: 'web',
  autoRun: false,
  autoRunTimer: null,
  running: false,
  consoleLogs: [],
  errors: []
};

function setupViewportAwareCoding() {
  if (window.__codingViewportBound) return;
  window.__codingViewportBound = true;

  const applyViewportHeight = () => {
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--app-viewport-height', `${viewportHeight}px`);
  };

  applyViewportHeight();
  window.addEventListener('resize', applyViewportHeight, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyViewportHeight, { passive: true });
  }
}

function normalizeCodingLanguage(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized || normalized === 'web' || normalized === 'stack' || normalized === 'htmlcssjs') return 'web';
  if (normalized === 'javascript' || normalized === 'js') return 'web';
  if (normalized === 'python' || normalized === 'py') return 'python';
  if (normalized === 'java') return 'java';
  if (normalized === 'cpp' || normalized === 'c++' || normalized === 'cxx') return 'cpp';
  if (normalized === 'csharp' || normalized === 'c#' || normalized === 'cs') return 'csharp';
  if (normalized === 'sql') return 'sql';
  return 'web';
}

function getActiveCodingLanguage() {
  const languageSelect = $('#codingLangSelect');
  const selectedValue = languageSelect ? languageSelect.value : codingIdeState.activeLangSelect;
  return normalizeCodingLanguage(selectedValue || codingIdeState.activeLangSelect || 'web');
}

function renderCodingPage() {
  setupViewportAwareCoding();
  loadCodingIdeBuffers();
  bindCodingIdeEvents();
  setupCodingIdeUI();
  // Web stack avtomatik preview qilinadi; native tillar uchun preview'da halol ko'rsatma
  if (getActiveCodingLanguage() === 'web') executeCombinedCode();
  else showCodingRuntimePlaceholder(getActiveCodingLanguage());
}

function loadCodingIdeBuffers() {
  const editors = ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'];
  const autoRunToggle = $('#autoRunToggle');

  editors.forEach(lang => {
    const editor = $(`#${lang}Editor`);
    if (!editor) return;
    const savedValue = localStorage.getItem(`coding_${lang}_code`);
    editor.value = savedValue !== null && savedValue !== undefined ? savedValue : (DEFAULT_IDE_CODES[lang] || '');
  });

  const initialLang = getActiveCodingLanguage();
  codingIdeState.activeLangSelect = initialLang;
  const langSelect = $('#codingLangSelect');
  if (langSelect) {
    langSelect.value = initialLang === 'web' ? 'web' : initialLang;
  }

  if (autoRunToggle) {
    codingIdeState.autoRun = localStorage.getItem('coding_autorun') === 'true';
    autoRunToggle.checked = codingIdeState.autoRun;
  }
}

function setupCodingIdeUI() {
  const langSelect = $('#codingLangSelect');
  if (langSelect) {
    langSelect.value = codingIdeState.activeLangSelect || 'web';
  }
  switchEditorTab(codingIdeState.activeTab || (codingIdeState.activeLangSelect === 'web' ? 'html' : codingIdeState.activeLangSelect));
  updateAllLineNumbers();
  syncAllEditorHighlights();
}

function switchEditorTab(tabName) {
  const langSelect = $('#codingLangSelect');
  const selectedLanguage = normalizeCodingLanguage(langSelect ? langSelect.value : codingIdeState.activeLangSelect || 'web');

  if (selectedLanguage !== 'web') {
    codingIdeState.activeLangSelect = selectedLanguage;
    codingIdeState.activeTab = selectedLanguage;
    if (langSelect) langSelect.value = selectedLanguage;

    $$('.coding-tab').forEach(t => t.classList.toggle('active', false));
    $$('.editor-view').forEach(v => {
      const isActive = v.id === `editor-view-${selectedLanguage}`;
      v.classList.toggle('active', isActive);
    });

    const titleEl = $('#editorLangLabel');
    if (titleEl) {
      const titles = {
        python: '🐍 Python Editor',
        java: '☕ Java Editor',
        cpp: '🔧 C++ Editor',
        csharp: '🔷 C# Editor',
        sql: '🗄 SQL Editor'
      };
      titleEl.textContent = titles[selectedLanguage] || 'Code Editor';
    }

    const activeEditor = $(`#${selectedLanguage}Editor`);
    if (activeEditor) activeEditor.focus();
    $$('.coding-file').forEach(file => {
      file.classList.remove('active');
      file.setAttribute('aria-selected', 'false');
    });
    return;
  }

  const normName = (tabName === 'javascript' || tabName === 'js') ? 'js' : (tabName || 'html');
  codingIdeState.activeTab = normName;
  codingIdeState.activeLangSelect = 'web';
  if (langSelect) langSelect.value = 'web';

  $$('.coding-tab').forEach(t => {
    const attr = t.getAttribute('data-tab');
    const isMatch = attr === normName || (normName === 'js' && (attr === 'js' || attr === 'javascript'));
    t.classList.toggle('active', isMatch);
  });
  $$('.coding-file').forEach(file => {
    const selected = file.getAttribute('data-coding-file') === normName;
    file.classList.toggle('active', selected);
    file.setAttribute('aria-selected', String(selected));
  });

  $$('.editor-view').forEach(v => {
    const isActive = v.id === `editor-view-${normName}`;
    v.classList.toggle('active', isActive);
  });

  const titleEl = $('#editorLangLabel');
  if (titleEl) {
    const titles = { html: '🌐 HTML5 Editor', css: '🎨 CSS3 Editor', js: '⚡ JavaScript Editor', javascript: '⚡ JavaScript Editor' };
    titleEl.textContent = titles[normName] || 'Code Editor';
  }

  const activeEditor = $(`#${normName}Editor`);
  if (activeEditor) activeEditor.focus();
}

function updateLineNumbersFor(editorId, gutterId) {
  const editor = $(`#${editorId}`);
  const gutter = $(`#${gutterId}`);
  if (!editor || !gutter) return;
  const lineCount = editor.value.split('\n').length;
  if (gutter._lastLineCount === lineCount) return; // RC6: qator soni o'zgarmasa innerHTML qayta yaratilmaydi
  gutter._lastLineCount = lineCount;
  gutter.innerHTML = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1).join('<br>');
}

function updateAllLineNumbers() {
  ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'].forEach(lang => {
    updateLineNumbersFor(`${lang}Editor`, `${lang}LineNumbers`);
  });
}

function normalizeHighlightSource(value) {
  return String(value ?? '')
    .replace(/<span\b[^>]*class="[^"]*token-[^"]*"[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/\r\n/g, '\n');
}

function escapeHtml(value) {
  return normalizeHighlightSource(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ====================== SINGLE-PASS TOKENIZER (RC1 FIX) ======================
   Har bir token FAQAT raw source'dan, aynan bir marta yaratiladi.
   Generated markup HECH QACHON qayta regex bilan ishlanmaydi.
   Yangi qator/space literal qoladi (white-space: pre) -> textarea bilan 1:1 mos. */

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function emitSpan(cls, text) {
  return `<span class="${cls}">${esc(text)}</span>`;
}

function tokenizeByRules(source, rules, extraFlags) {
  const combined = new RegExp(rules.map(r => `(${r.re.source})`).join('|'), 'gm' + (extraFlags || ''));
  let out = '';
  let last = 0;
  let match;
  while ((match = combined.exec(source)) !== null) {
    if (match.index > last) out += esc(source.slice(last, match.index));
    const text = match[0];
    if (text.length === 0) { combined.lastIndex++; continue; }
    let rule = null;
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) { rule = rules[i - 1]; break; }
    }
    out += (rule && rule.emit) ? rule.emit(text) : emitSpan(rule.cls, text);
    last = match.index + text.length;
  }
  out += esc(source.slice(last));
  return out;
}

const HTML_TOKEN_RULES = [
  { re: /<!--[\s\S]*?-->/, cls: 'token-html-comment' },
  { re: /<![Dd][Oo][Cc][Tt][Yy][Pp][Ee][^>]*>/, cls: 'token-html-comment' },
  { re: /"[^"\n]*"?|'[^'\n]*'?/, cls: 'token-html-attr-value' },
  { re: /<\/?[A-Za-z][\w:.-]*/, cls: 'token-html-tag' },
  { re: /\/?>/, cls: 'token-html-tag' },
  { re: /[\w:.-]+(?=\s*=)/, cls: 'token-html-attr-name' }
];

function highlightHtmlCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), HTML_TOKEN_RULES);
}

function highlightCssCode(code) {
  const source = normalizeHighlightSource(code);
  const re = /(\/\*[\s\S]*?\*\/)|("(?:\\[\s\S]|[^"\\\n])*(?:"|$)|'(?:\\[\s\S]|[^'\\\n])*(?:'|$))|(@[\w-]+)|(--[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|(\.[A-Za-z_][\w-]*)|(#[A-Za-z_][\w-]*)|([A-Za-z-][\w-]*(?=\s*:)[^;{}]*)|(:{1,2}[A-Za-z-]+(?:\([^)]*\))?)|([{}])/g;
  let out = '';
  let last = 0;
  let depth = 0;
  let m;
  while ((m = re.exec(source)) !== null) {
    if (m.index > last) out += esc(source.slice(last, m.index));
    const text = m[0];
    if (m[1] !== undefined) out += emitSpan('token-css-comment', text);
    else if (m[2] !== undefined) out += emitSpan('token-css-string', text);
    else if (m[3] !== undefined) out += emitSpan(/@(media|supports|keyframes|import|document|page|font-face|charset)/i.test(text) ? 'token-css-media' : 'token-css-at-rule', text);
    else if (m[4] !== undefined) out += emitSpan('token-css-variable', text);
    else if (m[5] !== undefined) out += emitSpan('token-css-number', text);
    else if (m[6] !== undefined) out += emitSpan('token-css-class', text);
    else if (m[7] !== undefined) out += emitSpan('token-css-id', text);
    else if (m[8] !== undefined) out += emitCssDeclaration(text, depth);
    else if (m[9] !== undefined) out += depth > 0 ? esc(text) : emitSpan('token-css-pseudo', text);
    else if (m[10] !== undefined) {
      if (text === '{') depth += 1;
      else if (text === '}') depth = Math.max(0, depth - 1);
      out += esc(text);
    }
    last = m.index + text.length;
  }
  out += esc(source.slice(last));
  return out;
}

function emitCssDeclaration(text, depth) {
  const colonIdx = text.indexOf(':');
  if (colonIdx === -1) return esc(text);
  const name = text.slice(0, colonIdx);
  const rest = text.slice(colonIdx);
  const value = rest.slice(1);
  const isMediaFeature = depth === 0 && /\d/.test(value) && /^[\s\w.%()<>/+,#-]*$/.test(value);
  if (depth > 0 || isMediaFeature) {
    const leadWs = value.slice(0, value.length - value.trimStart().length);
    const trailWs = value.slice(value.trimEnd().length);
    return emitSpan('token-css-property', name) + esc(':' + leadWs) + emitCssValue(value.trim()) + esc(trailWs);
  }
  return emitSpan('token-css-selector', name) + emitCssSelectorRest(rest);
}

function emitCssValue(text) {
  const re = /"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|--[\w-]+/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out += emitSpan('token-css-value', text.slice(last, m.index));
    out += emitSpan(m[0][0] === '-' ? 'token-css-variable' : 'token-css-string', m[0]);
    last = m.index + m[0].length;
  }
  if (last < text.length) out += emitSpan('token-css-value', text.slice(last));
  return out;
}

function emitCssSelectorRest(text) {
  const re = /:{1,2}[A-Za-z-]+(?:\([^)]*\))?/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    out += esc(text.slice(last, m.index));
    out += emitSpan('token-css-pseudo', m[0]);
    last = m.index + m[0].length;
  }
  out += esc(text.slice(last));
  return out;
}

const JS_TOKEN_RULES = [
  { re: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/, cls: 'token-js-comment' },
  { re: /`(?:\\[\s\S]|[^`\\])*`?/, cls: 'token-js-template' },
  { re: /"(?:\\[\s\S]|[^"\\\n])*(?:"|$)|'(?:\\[\s\S]|[^'\\\n])*(?:'|$)/, cls: 'token-js-string' },
  { re: /\bconsole\s*\.\s*(?:log|warn|error|info|debug|table|dir|trace)\b/, cls: 'token-js-console' },
  { re: /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*/, emit: emitJsDeclaration },
  { re: /\b(?:const|let|var|function|class|return|if|else|for|while|do|switch|case|default|break|continue|new|delete|typeof|instanceof|in|of|try|catch|finally|throw|await|async|yield|import|export|from|extends|super|this|void|static|get|set)\b/, cls: 'token-js-keyword' },
  { re: /\b(?:true|false|null|undefined|NaN|Infinity)\b/, cls: 'token-js-boolean' },
  { re: /\b(?:document|window|console|Math|JSON|Array|Object|String|Number|Boolean|Date|Promise|Map|Set|Symbol|RegExp|Error|localStorage|sessionStorage|fetch|setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame|parseInt|parseFloat|isNaN|alert|confirm|prompt)\b/, cls: 'token-js-builtin' },
  { re: /\b[A-Za-z_$][\w$]*(?=\s*\()/, cls: 'token-js-function' },
  { re: /\b[A-Za-z_$][\w$]*(?=\s*:)/, cls: 'token-js-property' },
  { re: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?)\b/, cls: 'token-js-number' },
  { re: /[+\-*/%=!<>&|?:^~]+/, cls: 'token-js-operator' }
];

function emitJsDeclaration(text) {
  const m = text.match(/^(const|let|var)(\s+)([A-Za-z_$][\w$]*)$/);
  if (!m) return esc(text);
  return emitSpan('token-js-keyword', m[1]) + esc(m[2]) + emitSpan('token-js-variable', m[3]);
}

function highlightJsCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), JS_TOKEN_RULES);
}

function renderHighlightForLanguage(lang, value) {
  const base = normalizeHighlightSource(value || '');
  if (lang === 'html') return highlightHtmlCode(base);
  if (lang === 'css') return highlightCssCode(base);
  if (lang === 'js' || lang === 'javascript') return highlightJsCode(base);
  if (lang === 'python') return highlightPythonCode(base);
  if (lang === 'java') return highlightJavaCode(base);
  if (lang === 'cpp' || lang === 'c++') return highlightCppCode(base);
  if (lang === 'csharp' || lang === 'cs') return highlightCSharpCode(base);
  if (lang === 'sql') return highlightSqlCode(base);
  return escapeHtml(base);
}

const PYTHON_TOKEN_RULES = [
  { re: /#[^\n]*/, cls: 'token-python-comment' },
  { re: /"""[\s\S]*?"""|'''[\s\S]*?'''/, cls: 'token-python-string' },
  { re: /(?:\b[rub]{1,2})?"(?:\\[\s\S]|[^"\\\n])*(?:"|$)|(?:\b[rub]{1,2})?'(?:\\[\s\S]|[^'\\\n])*(?:'|$)/, cls: 'token-python-string' },
  { re: /@[\w.]+/, cls: 'token-python-function' },
  { re: /\b(?:def|class)\s+[A-Za-z_]\w*/, emit: emitPythonDefClass },
  { re: /\b(?:def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|and|or|not|in|is|pass|break|continue|yield|async|await|global|nonlocal|del|assert|True|False|None)\b/, cls: 'token-python-keyword' },
  { re: /\b[A-Z][A-Za-z0-9_]*\b/, cls: 'token-python-class' },
  { re: /\b[A-Za-z_]\w*(?=\s*\()/, cls: 'token-python-function' },
  { re: /\b[A-Za-z_]\w*(?=\s*=(?!=))/, cls: 'token-python-variable' },
  { re: /\bself\b/, cls: 'token-python-variable' },
  { re: /\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?j?\b/, cls: 'token-python-number' }
];

function emitPythonDefClass(text) {
  const m = text.match(/^(def|class)(\s+)([A-Za-z_]\w*)$/);
  if (!m) return esc(text);
  const nameCls = m[1] === 'def' ? 'token-python-function' : 'token-python-class';
  return emitSpan('token-python-keyword', m[1]) + esc(m[2]) + emitSpan(nameCls, m[3]);
}

function highlightPythonCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), PYTHON_TOKEN_RULES);
}

const JAVA_TOKEN_RULES = [
  { re: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/, cls: 'token-java-comment' },
  { re: /"(?:\\[\s\S]|[^"\\\n])*(?:"|$)/, cls: 'token-java-string' },
  { re: /'(?:\\[\s\S]|[^'\\\n])*(?:'|$)/, cls: 'token-java-string' },
  { re: /@[\w.]+/, cls: 'token-java-class' },
  { re: /\b(?:public|private|protected|class|interface|enum|record|static|final|abstract|void|return|if|else|for|while|switch|case|break|continue|try|catch|finally|new|throw|throws|package|import|extends|implements|instanceof|this|super|do|default|synchronized|volatile|transient|native|strictfp|assert|var|boolean|byte|short|int|long|float|double|char|true|false|null)\b/, cls: 'token-java-keyword' },
  { re: /\b[A-Z][A-Za-z0-9_]*\b/, cls: 'token-java-class' },
  { re: /\b[A-Za-z_]\w*(?=\s*\()/, cls: 'token-java-method' },
  { re: /\b\d[\d_]*(?:\.[\d_]+)?[fFdDlL]?\b|\b0[xX][0-9a-fA-F]+\b/, cls: 'token-java-number' }
];

function highlightJavaCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), JAVA_TOKEN_RULES);
}

const CPP_TOKEN_RULES = [
  { re: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/, cls: 'token-cpp-comment' },
  { re: /#\s*include\s*(?:<[^\n>]*>|"[^\n"]*")/, emit: emitCppInclude },
  { re: /#\s*[A-Za-z_]+/, cls: 'token-cpp-keyword' },
  { re: /"(?:\\[\s\S]|[^"\\\n])*(?:"|$)|'(?:\\[\s\S]|[^'\\\n])*(?:'|$)/, cls: 'token-cpp-string' },
  { re: /\b(?:auto|break|case|catch|class|const|constexpr|continue|default|delete|do|else|enum|explicit|extern|for|friend|goto|if|inline|namespace|new|operator|private|protected|public|register|return|sizeof|static|struct|switch|template|this|throw|try|typedef|typename|union|using|virtual|void|volatile|while|include|define|ifndef|ifdef|endif|std|nullptr|true|false)\b/, cls: 'token-cpp-keyword' },
  { re: /\b(?:int|float|double|char|bool|short|long|unsigned|signed|size_t|wchar_t|string|vector|map|set|pair|array|list|deque|queue|stack|unordered_map|unordered_set|multimap|multiset)\b/, cls: 'token-cpp-type' },
  { re: /\b[A-Za-z_]\w*(?=\s*\()/, cls: 'token-cpp-function' },
  { re: /\b\d[\d_]*(?:\.[\d_]+)?[fFuUlL]*\b|\b0[xX][0-9a-fA-F]+\b/, cls: 'token-cpp-number' }
];

function emitCppInclude(text) {
  const m = text.match(/^(#\s*include\s*)(<[^\n>]*>|"[^\n"]*")$/);
  if (!m) return esc(text);
  return emitSpan('token-cpp-keyword', m[1]) + emitSpan('token-cpp-string', m[2]);
}

function highlightCppCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), CPP_TOKEN_RULES);
}

const CSHARP_TOKEN_RULES = [
  { re: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/, cls: 'token-csharp-comment' },
  { re: /@?"(?:\\[\s\S]|[^"\\\n])*(?:"|$)/, cls: 'token-csharp-string' },
  { re: /'(?:\\[\s\S]|[^'\\\n])*(?:'|$)/, cls: 'token-csharp-string' },
  { re: /\b(?:abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|dynamic|else|enum|event|explicit|extern|finally|fixed|float|for|foreach|get|goto|if|implicit|in|init|int|interface|internal|is|lock|long|namespace|new|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|var|virtual|void|volatile|while|true|false|null)\b/, cls: 'token-csharp-keyword' },
  { re: /\b[A-Za-z_]\w*(?=\s*\()/, cls: 'token-csharp-function' },
  { re: /\b[A-Z][A-Za-z0-9_]*\b/, cls: 'token-csharp-type' },
  { re: /\b\d[\d_]*(?:\.[\d_]+)?[fFdDmMuUlL]*\b|\b0[xX][0-9a-fA-F]+\b/, cls: 'token-csharp-number' }
];

function highlightCSharpCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), CSHARP_TOKEN_RULES);
}

const SQL_TOKEN_RULES = [
  { re: /--[^\n]*|\/\*[\s\S]*?\*\//, cls: 'token-sql-comment' },
  { re: /'(?:''|[^'\n])*'?/, cls: 'token-sql-string' },
  { re: /"(?:[^"\n]|"")*"?|`[^`\n]*`?/, cls: 'token-sql-string' },
  { re: /\b(?:SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|FULL|INNER|OUTER|CROSS|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|VIEW|UNIQUE|PRIMARY|FOREIGN|KEY|REFERENCES|DISTINCT|AS|ON|AND|OR|NOT|IS|NULL|CASE|WHEN|THEN|ELSE|END|LIKE|IN|BETWEEN|EXISTS|UNION|ALL|ASC|DESC|COUNT|SUM|AVG|MIN|MAX|COALESCE|CAST|CONVERT)\b/, cls: 'token-sql-keyword' },
  { re: /\b[A-Za-z_]\w*(?=\s*\()/, cls: 'token-sql-function' },
  { re: /\b[A-Za-z_]\w*(?=\s*\.)/, cls: 'token-sql-table' },
  { re: /\.\s*[A-Za-z_]\w*/, emit: emitSqlField },
  { re: /\b\d+(?:\.\d+)?\b/, cls: 'token-sql-number' }
];

function emitSqlField(text) {
  const m = text.match(/^(\.\s*)([A-Za-z_]\w*)$/);
  if (!m) return esc(text);
  return esc(m[1]) + emitSpan('token-sql-field', m[2]);
}

function highlightSqlCode(code) {
  return tokenizeByRules(normalizeHighlightSource(code), SQL_TOKEN_RULES, 'i');
}

function syncEditorHighlight(lang) {
  const editor = $(`#${lang}Editor`);
  const highlight = $(`#${lang}Highlight`);
  if (!editor || !highlight) return;

  highlight.innerHTML = renderHighlightForLanguage(lang, editor.value);
  highlight.scrollTop = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
}

function syncAllEditorHighlights() {
  ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'].forEach(lang => syncEditorHighlight(lang));
}

// RC6: ketma-ket keystroke'larni bitta rAF frame'ga birlashtirish —
// 10000+ qatorli kodda ham real-time typing browser freeze qilmaydi.
const pendingHighlightFrames = {};
function scheduleEditorHighlight(lang) {
  if (pendingHighlightFrames[lang]) return;
  pendingHighlightFrames[lang] = true;
  requestAnimationFrame(() => {
    pendingHighlightFrames[lang] = false;
    syncEditorHighlight(lang);
  });
}

function bindCodingIdeEvents() {
  // Bind editors scroll sync & line numbers
  ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'].forEach(lang => {
    const editor = $(`#${lang}Editor`);
    const gutter = $(`#${lang}LineNumbers`);
    if (editor && !editor._boundIDE) {
      editor._boundIDE = true;

      editor.addEventListener('scroll', () => {
        if (gutter) gutter.scrollTop = editor.scrollTop;
        const highlight = $(`#${lang}Highlight`);
        if (highlight) {
          highlight.scrollTop = editor.scrollTop;
          highlight.scrollLeft = editor.scrollLeft;
        }
      });

      editor.addEventListener('input', () => {
        updateLineNumbersFor(`${lang}Editor`, `${lang}LineNumbers`);
        scheduleEditorHighlight(lang);
        localStorage.setItem(`coding_${lang}_code`, editor.value);
        scheduleProjectAutoSave(lang, editor.value);
        // AutoRun faqat web preview uchun (native tillar Run tugmasi bilan real Worker'da bajariladi)
        if (codingIdeState.autoRun && lang === 'web') triggerDebouncedAutoRun();
      });

      editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
          editor.selectionStart = editor.selectionEnd = start + 2;
          updateLineNumbersFor(`${lang}Editor`, `${lang}LineNumbers`);
          scheduleEditorHighlight(lang);
          localStorage.setItem(`coding_${lang}_code`, editor.value);
          scheduleProjectAutoSave(lang, editor.value);
          if (codingIdeState.autoRun && lang === 'web') triggerDebouncedAutoRun();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          executeCombinedCode();
          showToast("▶ Kod ishga tushirildi", "info");
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          saveCodingIdeBuffers();
        }
      });
    }
  });

  $$('.coding-tab').forEach(tab => {
    tab.onclick = () => {
      const tabName = tab.getAttribute('data-tab');
      switchEditorTab(tabName);
    };
  });

  // VS Code explorer: fayl bosilganda tegishli editor tabini ochadi.
  $$('.coding-file').forEach(file => {
    file.onclick = () => {
      const tabName = file.getAttribute('data-coding-file');
      switchEditorTab(tabName);
      $$('.coding-file').forEach(item => {
        const selected = item === file;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
    };
  });

  const langSelect = $('#codingLangSelect');
  if (langSelect && !langSelect._bound) {
    langSelect._bound = true;
    langSelect.onchange = () => {
      const selectedLanguage = normalizeCodingLanguage(langSelect.value);
      codingIdeState.activeLangSelect = selectedLanguage;
      if (selectedLanguage === 'web') {
        switchEditorTab(codingIdeState.activeTab || 'html');
      } else {
        switchEditorTab(selectedLanguage);
      }
      clearCodingConsole();
      clearCodingErrors();
      if (selectedLanguage === 'python' || selectedLanguage === 'sql' || selectedLanguage === 'cpp') {
        addIdeLog('[Info] ' + selectedLanguage.toUpperCase() + " real runtime mavjud — ▶ Run bosing. Natija Console panelida STDOUT/STDERR bo'lib chiqadi.", 'info');
      } else if (selectedLanguage === 'java' || selectedLanguage === 'csharp') {
        addIdeLog('[Info] ' + selectedLanguage.toUpperCase() + " browserda real runtime yo'q (FAKE chiqarmaymiz). Real ijro uchun server endpoint sozlang — Run bosganda so'raladi.", 'info');
      }
      if (codingIdeState.autoRun && selectedLanguage === 'web') executeCombinedCode();
    };
  }

  // Auto Run Toggle
  const autoRunToggle = $('#autoRunToggle');
  if (autoRunToggle && !autoRunToggle._bound) {
    autoRunToggle._bound = true;
    autoRunToggle.onchange = () => {
      codingIdeState.autoRun = autoRunToggle.checked;
      localStorage.setItem('coding_autorun', codingIdeState.autoRun ? 'true' : 'false');
      if (codingIdeState.autoRun) {
        executeCombinedCode();
        showToast("Auto Run faollashtirildi", "success");
      }
    };
  }

  // Action Buttons
  const runBtn = $('#codingRunBtn');
  if (runBtn) runBtn.onclick = () => { executeCombinedCode(); showToast("▶ Kod ishga tushirildi", "info"); };

  const openBrowserBtn = $('#codingOpenBrowserBtn');
  if (openBrowserBtn) openBrowserBtn.onclick = () => openInBrowser();

  const downloadBtn = $('#codingDownloadBtn');
  if (downloadBtn) downloadBtn.onclick = () => downloadCleanHtml();

  const saveBtn = $('#codingSaveBtn');
  if (saveBtn) saveBtn.onclick = () => { if (typeof openProjectSaveModal === 'function') openProjectSaveModal(); else saveCodingIdeBuffers(); };

  const resetBtn = $('#codingResetBtn');
  if (resetBtn) resetBtn.onclick = () => resetCodingIdeBuffers();

  const clearConsoleBtn = $('#clearConsoleBtn');
  if (clearConsoleBtn) clearConsoleBtn.onclick = () => clearCodingConsole();

  const clearErrorsBtn = $('#clearErrorsBtn');
  if (clearErrorsBtn) clearErrorsBtn.onclick = () => clearCodingErrors();

  // stdin panel toggle (Python input() / C++ cin / server stdin uchun)
  const stdinToggleBtn = $('#stdinToggleBtn');
  if (stdinToggleBtn && !stdinToggleBtn._bound) {
    stdinToggleBtn._bound = true;
    stdinToggleBtn.onclick = () => {
      const panel = $('#stdinPanel');
      if (panel) panel.classList.toggle('hidden');
    };
  }

  // Output Tabs
  $$('#outputTabs .output-tab').forEach(tab => {
    tab.onclick = () => {
      const tabName = tab.getAttribute('data-tab');
      switchOutputTab(tabName);
    };
  });

  // Global keyboard shortcuts (Ctrl+Enter to Run, Ctrl+S to Save)
  if (!window._codingKeysBound) {
    window._codingKeysBound = true;
    window.addEventListener('keydown', (e) => {
      const codingPage = $('#page-coding');
      if (codingPage && codingPage.classList.contains('active')) {
        // RC5: editor textarea ichida Ctrl+Enter/Ctrl+S allaqachon editor handler tomonidan
        // ishlatilgan — bu yerda qayta ishlatish Run'ni ikki marta chaqiradi.
        if (e.target && e.target.classList && e.target.classList.contains('code-textarea')) return;
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          executeCombinedCode();
          showToast("▶ Kod ishga tushirildi", "info");
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          saveCodingIdeBuffers();
        }
      }
    });
  }
}

function switchOutputTab(tabName) {
  $$('#outputTabs .output-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
  $$('.coding-output-panel .output-view').forEach(v => v.classList.toggle('active', v.id === `view-${tabName}`));
}

function triggerDebouncedAutoRun() {
  if (codingIdeState.autoRunTimer) clearTimeout(codingIdeState.autoRunTimer);
  codingIdeState.autoRunTimer = setTimeout(() => {
    executeCombinedCode();
  }, 600);
}

function clearCodingConsole() {
  codingIdeState.consoleLogs = [];
  const container = $('#codingConsole');
  if (container) container.innerHTML = `<div class="console-line muted">// Executed console logs will appear here</div>`;
  const badge = $('#consoleBadge');
  if (badge) {
    badge.textContent = '0';
    badge.classList.add('hidden');
  }
  // Native executor bo'limlarini tozalash (STDOUT/STDERR/SQL tables)
  const execSections = container ? container.querySelectorAll('.console-section') : [];
  execSections.forEach((sec) => sec.remove());
}

function clearCodingErrors() {
  codingIdeState.errors = [];
  const container = $('#codingErrors');
  if (container) container.innerHTML = `<div class="console-line muted">// Runtime & syntax errors will appear here</div>`;
  const badge = $('#errorBadge');
  if (badge) {
    badge.textContent = '0';
    badge.classList.add('hidden');
  }
}

/* ====================== NATIVE LANGUAGE EXECUTORS (REAL RUNTIME) ======================
   Python  -> Pyodide (real CPython WASM)   | Worker: workers/coding-python.worker.js
   SQL     -> sql.js (real SQLite WASM)     | Worker: workers/coding-sql.worker.js
   C++     -> JSCPP (real C++ interpreter)  | Worker: workers/coding-cpp.worker.js
   C#/Java -> server endpoint adapter (real server-side execution arxitekturasi);
              endpoint sozlanmaganda halol holat ko'rsatiladi — FAKE OUTPUT YO'Q.
   Har bir ijro 8s timeout bilan: infinite loop bo'lsa worker terminate qilinadi. */

const EXEC_TIMEOUT_MS = 8000;
const EXEC_LOAD_TIMEOUT_MS = 30000;
const EXEC_SERVER_ENDPOINT_KEY = 'coding_exec_server_endpoint';
const activeCodingWorkers = {};

function getRuntimeBaseUrl() {
  return String(self.location.href).replace(/[^/]*$/, '');
}

function createCodingWorker(lang) {
  const url = getRuntimeBaseUrl() + 'workers/coding-' + lang + '.worker.js';
  try {
    if (typeof Worker === 'undefined') return null;
    // Pyodide ESM import ishlatadi -> module worker; qolganlari classic (importScripts)
    return lang === 'python' ? new Worker(url, { type: 'module' }) : new Worker(url);
  } catch (err) {
    return null;
  }
}

function terminateCodingWorker(lang) {
  const worker = activeCodingWorkers[lang];
  if (worker) {
    try { worker.terminate(); } catch (err) { /* noop */ }
    activeCodingWorkers[lang] = null;
  }
}

function runInWorker(lang, code, stdin, handlers) {
  return new Promise((resolve) => {
    const worker = createCodingWorker(lang);
    if (!worker) {
      resolve({
        ok: false,
        error: {
          type: 'RuntimeError',
          message: "Worker yaratib bo'lmadi — runtime fayllar (workers/, pyodide/, vendor/) topilmadi. Ilovani 'npm run build' orqali build qilib ishga tushiring.",
          line: null,
          column: null
        }
      });
      return;
    }
    activeCodingWorkers[lang] = worker;
    let settled = false;
    let execTimer = null;
    let loadTimer = null;
    const startLoadTimer = () => {
      loadTimer = setTimeout(() => {
        terminateCodingWorker(lang);
        finish({ ok: false, timeout: true, timeoutAfter: EXEC_LOAD_TIMEOUT_MS });
      }, EXEC_LOAD_TIMEOUT_MS);
    };
    const startExecTimer = () => {
      if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
      execTimer = setTimeout(() => {
        terminateCodingWorker(lang);
        finish({ ok: false, timeout: true, timeoutAfter: EXEC_TIMEOUT_MS });
      }, EXEC_TIMEOUT_MS);
    };
    startLoadTimer();
    function finish(value) {
      if (settled) return;
      settled = true;
      if (loadTimer) clearTimeout(loadTimer);
      if (execTimer) clearTimeout(execTimer);
      resolve(value);
    }
    worker.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === 'started') startExecTimer(); // runtime yuklandi, endi 8s execution timeout
      else if (data.type === 'status' && handlers.onStatus) handlers.onStatus(String(data.message || ''));
      else if (data.type === 'stdout' && handlers.onStdout) handlers.onStdout(String(data.text || ''));
      else if (data.type === 'stderr' && handlers.onStderr) handlers.onStderr(String(data.text || ''));
      else if (data.type === 'result' && handlers.onResult) handlers.onResult(data.result);
      else if (data.type === 'done') finish({ ok: true, exitCode: typeof data.exitCode === 'number' ? data.exitCode : 0 });
      else if (data.type === 'error') finish({ ok: false, error: data.error || {} });
    };
    worker.onerror = (event) => {
      terminateCodingWorker(lang);
      finish({
        ok: false,
        error: {
          type: 'RuntimeError',
          message: 'Worker yuklashda xato: ' + ((event && event.message) || 'runtime fayl topilmadi yoki yuklanmadi'),
          line: null,
          column: null
        }
      });
    };
    worker.postMessage({ type: 'run', code, stdin: stdin || '' });
  });
}

function setRunBusy(busy) {
  const btn = $('#codingRunBtn');
  if (!btn) return;
  btn.disabled = busy;
  if (busy) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.textContent = '⏳ Bajarilmoqda...';
  } else if (btn.dataset.label) {
    btn.textContent = btn.dataset.label;
  }
}

function addIdeStatus(message) {
  addIdeLog(message, 'info');
}

function addIdeLog(msg, type = 'log') {
  codingIdeState.consoleLogs.push({ msg, type });
  const container = $('#codingConsole');
  if (container) {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }
  const badge = $('#consoleBadge');
  if (badge) {
    badge.textContent = codingIdeState.consoleLogs.length;
    badge.classList.remove('hidden');
  }
}

function addIdeError(msg, meta) {
  const m = meta || {};
  const locBits = [];
  if (m.line !== null && m.line !== undefined && String(m.line) !== '') locBits.push('Satr: ' + m.line);
  if (m.column !== null && m.column !== undefined && String(m.column) !== '') locBits.push('Ustun: ' + m.column);
  const typePrefix = m.type ? '[' + m.type + '] ' : '';
  const formattedMsg = typePrefix + msg + (locBits.length ? ' (' + locBits.join(', ') + ')' : '');
  codingIdeState.errors.push(formattedMsg);
  const container = $('#codingErrors');
  if (container) {
    const line = document.createElement('div');
    line.className = `console-line error`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ❌ ${formattedMsg}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }
  const badge = $('#errorBadge');
  if (badge) {
    badge.textContent = codingIdeState.errors.length;
    badge.classList.remove('hidden');
  }

  // Also list errors in console tab
  addIdeLog(`❌ ${formattedMsg}`, 'error');
}

const EXEC_OUTPUT_LIMIT = 200000;

function ensureExecSection(kind) {
  let section = document.getElementById('execSection' + kind);
  if (!section) {
    const container = $('#codingConsole');
    if (!container) return null;
    section = document.createElement('div');
    section.id = 'execSection' + kind;
    section.className = 'console-section ' + kind;
    section.innerHTML = '<div class="console-section-title ' + kind + '">' + kind.toUpperCase() + '</div>'
      + '<div class="console-section-body"></div>';
    container.appendChild(section);
  }
  return section.querySelector('.console-section-body');
}

function appendExecChunk(kind, text) {
  const body = ensureExecSection(kind);
  if (!body) return;
  if (body.textContent.length > EXEC_OUTPUT_LIMIT) {
    if (!body.dataset.truncated) {
      body.dataset.truncated = '1';
      body.textContent += '\n... (chiqish hajmi chegaradan oshdi, kesildi)';
    }
    return;
  }
  body.textContent += text;
  const container = $('#codingConsole');
  if (container) container.scrollTop = container.scrollHeight;
}

function appendSqlResult(result) {
  const container = $('#codingConsole');
  if (!container || !result) return;
  if (result.kind === 'rows') {
    const info = document.createElement('div');
    info.className = 'console-line muted';
    info.textContent = '▶ ' + (result.columns || []).join(', ') + '  (' + (result.rows || []).length + ' qator)';
    container.appendChild(info);
    const table = document.createElement('table');
    table.className = 'sql-result-table';
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    (result.columns || []).forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    if (!result.rows || result.rows.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = Math.max(1, (result.columns || []).length);
      emptyCell.className = 'muted';
      emptyCell.textContent = '(0 qator)';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      result.rows.forEach((row) => {
        const tr = document.createElement('tr');
        (row || []).forEach((cell) => {
          const td = document.createElement('td');
          td.textContent = cell === null || cell === undefined ? 'NULL' : String(cell);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);
    container.appendChild(table);
  } else if (result.kind === 'dml') {
    const line = document.createElement('div');
    line.className = 'console-line info';
    line.textContent = '✓ ' + (result.changes || 0) + ' row(s) affected';
    container.appendChild(line);
  }
  container.scrollTop = container.scrollHeight;
}

function runNativeLanguage(lang) {
  const editor = $(`#${lang}Editor`);
  const source = editor ? String(editor.value || '') : '';
  const stdinEl = $('#codingStdin');
  const stdin = stdinEl ? stdinEl.value : '';

  clearCodingConsole();
  clearCodingErrors();
  switchOutputTab('console');
  setRunBusy(true);
  codingIdeState.running = true;
  const startedAt = Date.now();

  addIdeStatus('▶ ' + lang.toUpperCase() + ' real execution boshlandi (' + new Date().toLocaleTimeString() + ')');

  const finishRun = () => {
    codingIdeState.running = false;
    setRunBusy(false);
  };

  let runner = null;
  if (lang === 'python' || lang === 'sql' || lang === 'cpp') {
    runner = runInWorker(lang, source, stdin, {
      onStatus: (msg) => addIdeStatus(msg),
      onStdout: (text) => appendExecChunk('stdout', text),
      onStderr: (text) => appendExecChunk('stderr', text),
      onResult: (result) => appendSqlResult(result)
    });
  } else {
    runner = runViaServer(lang, source, stdin);
  }

  Promise.resolve(runner).then((outcome) => {
    finishRun();
    if (!outcome) return;
    const secs = ((Date.now() - startedAt) / 1000).toFixed(1);
    if (outcome.timeout) {
      const secs = ((outcome.timeoutAfter || EXEC_TIMEOUT_MS) / 1000).toFixed(0);
      addIdeError("Execution timeout (" + secs + "s). Infinite loop yoki juda uzun ijro bo'lishi mumkin — ishga tushirish to'xtatildi.", { type: 'Timeout' });
      return;
    }
    if (outcome.ok) {
      addIdeLog('✓ ' + lang.toUpperCase() + ' ijro tugadi — exit code ' + (typeof outcome.exitCode === 'number' ? outcome.exitCode : 0) + ' (' + secs + 's)', 'info');
    } else if (outcome.error) {
      const err = outcome.error;
      addIdeError(err.message || "Noma'lum xato", { type: err.type || 'RuntimeError', line: err.line, column: err.column });
    }
  }).catch((err) => {
    finishRun();
    addIdeError(String((err && err.message) || err), { type: 'RuntimeError' });
  });
}

function getExecServerEndpoint() {
  try { return localStorage.getItem(EXEC_SERVER_ENDPOINT_KEY) || ''; } catch (err) { return ''; }
}

function runViaServer(lang, source, stdin) {
  const endpoint = getExecServerEndpoint();
  if (!endpoint) {
    addIdeError(lang.toUpperCase() + " uchun browser ichida real runtime mavjud emas (real compiler/JVM WASM amaliy jihatdan imkonsiz darajada og'ir). Shuning uchun FAKE natija chiqarilmaydi.", { type: 'NotConfigured' });
    addIdeLog("ℹ️ Real ijro uchun server-endpoint arxitekturasi tayyor. Kontrakt: POST {language, source, stdin} → {stdout, stderr, error:{type,message,line,column}}. Run bosganda endpoint URL so'raladi va localStorage'ga saqlanadi.", 'info');
    let wantsConfig = false;
    try { wantsConfig = confirm(lang.toUpperCase() + ' uchun real execution server endpointini hozir sozlaysizmi?'); } catch (err) { wantsConfig = false; }
    if (wantsConfig) {
      const url = prompt('Execution server endpoint URL (masalan https://server/api/execute):', getExecServerEndpoint());
      if (url && url.trim()) {
        try { localStorage.setItem(EXEC_SERVER_ENDPOINT_KEY, url.trim()); } catch (err) { /* noop */ }
        addIdeLog('✓ Endpoint saqlandi. Yana Run bosing — kod serverga real yuboriladi.', 'info');
      }
    }
    return Promise.resolve({ ok: false, error: null });
  }
  addIdeStatus('⏳ ' + lang.toUpperCase() + ' server endpointga yuborilmoqda: ' + endpoint);
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: lang, source, stdin })
  })
    .then((resp) => {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json();
    })
    .then((payload) => {
      if (payload && payload.stdout) appendExecChunk('stdout', String(payload.stdout));
      if (payload && payload.stderr) appendExecChunk('stderr', String(payload.stderr));
      if (payload && payload.error) {
        const e = payload.error;
        addIdeError(e.message || 'Server xatosi', { type: e.type || 'CompileError', line: e.line, column: e.column });
        return { ok: false, error: e };
      }
      return { ok: true, exitCode: typeof (payload && payload.exitCode) === 'number' ? payload.exitCode : 0 };
    })
    .catch((err) => {
      return {
        ok: false,
        error: { type: 'ServerError', message: 'Server execution xatosi: ' + String((err && err.message) || err), line: null, column: null }
      };
    });
}

function showCodingRuntimePlaceholder(lang) {
  const iframe = $('#codingIframe');
  if (!iframe) return;
  const labelMap = { python: '🐍 Python', java: '☕ Java', cpp: '🔧 C++', csharp: '🔷 C#', sql: '🗄 SQL' };
  const label = labelMap[lang] || lang.toUpperCase();
  iframe.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
    + 'body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:Segoe UI,sans-serif;background:#090d16;color:#94a3b8;}'
    + '.hint{text-align:center;padding:24px;} .hint b{color:#e2e8f0;}'
    + 'code{background:rgba(99,102,241,.15);padding:2px 8px;border-radius:6px;color:#c4b5fd;}'
    + '</style></head><body><div class="hint"><p><b>' + label + '</b> real executor Worker ichida ishlaydi.</p>'
    + '<p>Natija <code>Console</code> panelida STDOUT/STDERR bo\'lib chiqadi — <b>▶ Run</b> bosing.</p></div></body></html>';
}



function executeCombinedCode() {
  if (codingIdeState.running) return; // parallel ijro yo'q (Run ikki marta bosilishi himoyasi)
  const selectedLanguage = getActiveCodingLanguage();
  if (selectedLanguage !== 'web') {
    runNativeLanguage(selectedLanguage); // Python/SQL/C++ real worker, C#/Java server adapter
    return;
  }
  const iframe = $('#codingIframe');
  if (!iframe) return;

  clearCodingConsole();
  clearCodingErrors();

  const html = $('#htmlEditor')?.value || '';
  const css = $('#cssEditor')?.value || '';
  const js = $('#jsEditor')?.value || '';

  const consoleInterceptor = `
    <script>
      (function() {
        const _log = console.log;
        const _warn = console.warn;
        const _error = console.error;
        const _info = console.info;

        function sendLog(type, args) {
          const msg = Array.from(args).map(a => {
            if (a instanceof Error) return a.name + ': ' + a.message + (a.stack ? '\\n' + a.stack : '');
            if (typeof a === 'object') {
              try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
            }
            return String(a);
          }).join(' ');
          window.parent.postMessage({ type: 'IDE_CONSOLE_LOG', logType: type, message: msg }, '*');
        }
        console.log = function() { sendLog('log', arguments); _log.apply(console, arguments); };
        console.warn = function() { sendLog('warn', arguments); _warn.apply(console, arguments); };
        console.error = function() { sendLog('error', arguments); _error.apply(console, arguments); };
        console.info = function() { sendLog('info', arguments); _info.apply(console, arguments); };
        
        window.onerror = function(msg, url, line, col, error) {
          const offset = window.__js_line_offset || 0;
          let realLine = line - offset;
          let isJsError = true;
          
          if (offset && line < offset) {
            realLine = line;
            isJsError = false;
          }
          
          const errorType = error ? error.name : (msg.includes('SyntaxError') ? 'SyntaxError' : (msg.includes(':') ? msg.split(':')[0] : 'RuntimeError'));
          let cleanMsg = error ? error.message : msg;
          if (cleanMsg.startsWith('Uncaught ')) {
            cleanMsg = cleanMsg.substring(9);
          }
          
          window.parent.postMessage({
            type: 'IDE_RUNTIME_ERROR',
            errorType: errorType,
            message: cleanMsg,
            line: isJsError ? realLine : null,
            col: col
          }, '*');
          return false;
        };

        window.onunhandledrejection = function(e) {
          const reason = e.reason || 'Unhandled Promise Rejection';
          const msg = reason.message || String(reason);
          const errorType = reason.name || 'UnhandledRejection';
          let line = 0;
          let col = 0;
          if (reason.stack) {
            const match = reason.stack.match(/about:srcdoc:(\\d+):(\\d+)/);
            if (match) {
              line = parseInt(match[1], 10) - (window.__js_line_offset || 0);
              col = parseInt(match[2], 10);
            }
          }
          window.parent.postMessage({
            type: 'IDE_RUNTIME_ERROR',
            errorType: errorType,
            message: msg,
            line: line > 0 ? line : null,
            col: col > 0 ? col : null
          }, '*');
        };
      })();
    <\/script>
  `;

  // Build document parts to count lines precisely.
  // RC2 fix: offset qo'lda +4 emas, haqiqiy qatorlar sonidan avtomatik hisoblanadi.
  const parts = [];
  parts.push('<!DOCTYPE html>');
  parts.push('<html>');
  parts.push('<head>');
  parts.push('  <meta charset="utf-8">');
  parts.push('  <style>');
  if (css) parts.push(css);
  parts.push('  </style>');
  parts.push(consoleInterceptor);
  parts.push('</head>');
  parts.push('<body>');
  if (html) parts.push(html);

  // User JS 1-qatorigacha bo'lgan qatorlar:
  //   1..K            -> parts (K qator)
  //   K+1             -> <script>window.__js_line_offset = N;</script>
  //   K+2             -> <script>
  //   K+3             -> user JS 1-qatori
  // Demak: userLine = reportedLine - (K + 2)
  const prefixLineCount = parts.join('\n').split('\n').length;
  const lineOffset = prefixLineCount + 2;

  const fullDocument = `${parts.join('\n')}
<script>window.__js_line_offset = ${lineOffset};<\/script>
<script>
${js}
<\/script>
</body>
</html>`;

  iframe.srcdoc = fullDocument;
}

// Window postMessage listener for iframe DevTools logs & errors
window.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.type === 'IDE_CONSOLE_LOG') {
    addIdeLog(e.data.message, e.data.logType || 'log');
  } else if (e.data.type === 'IDE_RUNTIME_ERROR') {
    const { errorType, message, line, col } = e.data;
    if (errorType) {
      let formattedMsg = `${errorType}: ${message}`;
      if (line) {
        formattedMsg += ` (Satr: ${line}`;
        if (col) formattedMsg += `, Ustun: ${col}`;
        formattedMsg += `)`;
      }
      addIdeError(formattedMsg);
    } else {
      addIdeError(e.data.message);
    }
  }
});

/* ====================== DARSLARDAN PLAYGROUNDGA RAW HTML YUBORISH ======================
   lessons-app.js "💻 CODINGDA SINAB KO'R" tugmasi shu funksiyani chaqiradi.
   FAQAT RAW HTML yuboriladi — highlight markup emas. Playground arxitekturasi o'zgarmaydi. */
function openCodePlaygroundWithHtml(rawHtml, returnCtx) {
  const htmlEd = $('#htmlEditor');
  if (!htmlEd) { showToast("Coding Playground topilmadi", "error"); return; }
  htmlEd.value = String(rawHtml ?? '');
  // HTML darslari uchun faqat HTML — CSS/JS bufferlarini bo'shatamiz
  const cssEd = $('#cssEditor'); if (cssEd) cssEd.value = '';
  const jsEd = $('#jsEditor'); if (jsEd) jsEd.value = '';
  ['html', 'css', 'js'].forEach(l => syncEditorHighlight(l));
  updateAllLineNumbers();
  // Dars HTML kodi kelganligi sababli doim WEB rejimga qaytamiz (agar user oldin Python/C++ tanlagan bo'lsa ham)
  codingIdeState.activeLangSelect = 'web';
  codingIdeState.activeTab = 'html';
  const langSel = $('#codingLangSelect'); if (langSel) langSel.value = 'web';
  switchEditorTab('html');
  saveCodingIdeBuffers();
  showPage("coding");
  setTimeout(() => { executeCombinedCode(); }, 80);
  // Darsdan o'tilgani konteksti: "← N-darsga qaytish" tugmasi
  try {
    if (returnCtx && returnCtx.courseId && returnCtx.lessonId) {
      localStorage.setItem('ls_return_ctx', JSON.stringify(returnCtx));
      mountLessonReturnButton(returnCtx);
      // AI lesson context: dars mashq kontekstini Codingga uzatish (4-dars => a/href/target ustuvor)
      try {
        if (window.ITTestAI && window.CoursesAPI) {
          const found = window.CoursesAPI.findLesson(returnCtx.courseId, returnCtx.lessonId);
          if (found && found.lesson) {
            window.ITTestAI.setLessonContext({
              courseId: returnCtx.courseId,
              lessonId: returnCtx.lessonId,
              lessonNumber: returnCtx.lessonNumber || found.lesson.number,
              title: found.lesson.title,
              keywords: window.ITTestAI.extractLessonKeywords(found.lesson)
            });
          }
        }
      } catch (e) { /* ignore */ }
    }
  } catch (e) { /* ignore */ }
}

/* Dars → Coding integratsiyasi: qaytish tugmasi (faqat lesson context bo'lsa ko'rinadi) */
function mountLessonReturnButton(ctx) {
  const page = $('#page-coding');
  if (!page) return;
  let btn = document.getElementById('lsReturnToLessonBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'lsReturnToLessonBtn';
    btn.type = 'button';
    btn.className = 'btn btn-ghost ls-return-lesson-btn';
    btn.addEventListener('click', function () {
      if (window.Lessons && typeof window.Lessons.returnFromCoding === 'function') {
        window.Lessons.returnFromCoding(); // scroll/context setupLessonExtras'da tiklanadi
      }
      btn.remove();
    });
    page.prepend(btn);
  }
  btn.textContent = '← ' + (ctx.lessonNumber || '') + (ctx.lessonNumber ? '-darsga' : ' darsga') + ' qaytish';
  btn.hidden = false;
}
window.openCodePlaygroundWithHtml = openCodePlaygroundWithHtml;

/* ====================== DARSLARDAN PLAYGROUNDGA HTML+CSS+JS YUBORISH ======================
   5-dars LOYIHA: step kodlari va loyiha editori 3 xil tabga (HTML/CSS/JS) bo'lib yuboriladi.
   Mavjud Playground arxitekturasi o'zgarmaydi — faqat bufferlar to'ldiriladi. */
function openCodePlaygroundWithCode(rawHtml, rawCss, rawJs, returnCtx) {
  const htmlEd = $('#htmlEditor');
  if (!htmlEd) { showToast("Coding Playground topilmadi", "error"); return; }
  htmlEd.value = String(rawHtml ?? '');
  const cssEd = $('#cssEditor'); if (cssEd) cssEd.value = String(rawCss ?? '');
  const jsEd = $('#jsEditor'); if (jsEd) jsEd.value = String(rawJs ?? '');
  ['html', 'css', 'js'].forEach(l => syncEditorHighlight(l));
  updateAllLineNumbers();
  // Loyiha HTML+CSS+JS — doim WEB rejim (user oldin native til tanlagan bo'lsa ham)
  codingIdeState.activeLangSelect = 'web';
  codingIdeState.activeTab = 'html';
  const langSelCode = $('#codingLangSelect'); if (langSelCode) langSelCode.value = 'web';
  switchEditorTab('html');
  saveCodingIdeBuffers();
  showPage("coding");
  setTimeout(() => { executeCombinedCode(); }, 80);
  // Darsdan o'tilgani konteksti: "← N-darsga qaytish" tugmasi
  try {
    if (returnCtx && returnCtx.courseId && returnCtx.lessonId) {
      localStorage.setItem('ls_return_ctx', JSON.stringify(returnCtx));
      mountLessonReturnButton(returnCtx);
      try {
        if (window.ITTestAI && window.CoursesAPI) {
          const found = window.CoursesAPI.findLesson(returnCtx.courseId, returnCtx.lessonId);
          if (found && found.lesson) {
            window.ITTestAI.setLessonContext({
              courseId: returnCtx.courseId,
              lessonId: returnCtx.lessonId,
              lessonNumber: returnCtx.lessonNumber || found.lesson.number,
              title: found.lesson.title,
              keywords: window.ITTestAI.extractLessonKeywords(found.lesson)
            });
          }
        }
      } catch (e) { /* ignore */ }
    }
  } catch (e) { /* ignore */ }
}
window.openCodePlaygroundWithCode = openCodePlaygroundWithCode;

/* --- Loyiha auto-save (dars → Coding integratsiyasi ham shu orqali saqlanadi) --- */
let projectAutoSaveTimer = null;
function scheduleProjectAutoSave(_lang, _value) {
  if (projectAutoSaveTimer) clearTimeout(projectAutoSaveTimer);
  projectAutoSaveTimer = setTimeout(() => { projectAutoSaveTimer = null; saveCurrentProjectFromBuffers(true); }, 1500);
}
function flushProjectAutoSave() {
  if (projectAutoSaveTimer) { clearTimeout(projectAutoSaveTimer); projectAutoSaveTimer = null; }
}
function saveCurrentProjectFromBuffers(silent) {
  try {
    const user = (typeof window.__itGetCurrentUser === 'function' ? window.__itGetCurrentUser() : null) || currentUser;
    if (!user) return;
    const get = id => { const el = $(id); return el ? String(el.value ?? '') : ''; };
    const project = {
      html: get('#htmlEditor'), css: get('#cssEditor'), js: get('#jsEditor'),
      python: get('#pythonEditor'), java: get('#javaEditor'), cpp: get('#cppEditor'),
      csharp: get('#csharpEditor'), sql: get('#sqlEditor'),
      at: Date.now()
    };
    localStorage.setItem('coding_project_autosave_' + (user.username || 'guest'), JSON.stringify(project));
    if (!silent) showToast("🔄 Loyiha avtomatik saqlandi", "success");
  } catch (e) { /* ignore */ }
}

function saveCodingIdeBuffers() {
  ['html', 'css', 'js', 'python', 'java', 'cpp', 'csharp', 'sql'].forEach(lang => {
    const editor = $(`#${lang}Editor`);
    if (editor) localStorage.setItem(`coding_${lang}_code`, editor.value);
  });
  flushProjectAutoSave();
  saveCurrentProjectFromBuffers();

  showToast("💾 Barcha kodlar saqlandi", "success");
}

function resetCodingIdeBuffers() {
  if (!confirm("Barcha kodlarni standart holatga tiklashni tasdiqlaysizmi?")) return;

  const activeLanguage = getActiveCodingLanguage();
  const resetLanguages = activeLanguage === 'web' ? ['html', 'css', 'js'] : [activeLanguage];

  resetLanguages.forEach(lang => {
    const editor = $(`#${lang}Editor`);
    if (!editor) return;
    editor.value = DEFAULT_IDE_CODES[lang] || '';
    localStorage.setItem(`coding_${lang}_code`, editor.value);
    syncEditorHighlight(lang);
    updateLineNumbersFor(`${lang}Editor`, `${lang}LineNumbers`);
  });

  if (activeLanguage === 'web') {
    updateAllLineNumbers();
    executeCombinedCode();
  } else {
    // Reset natijasida native kod avtomatik ishga tushmaydi — faqat placeholder ko'rsatiladi
    showCodingRuntimePlaceholder(activeLanguage);
  }
  showToast("🔄 Kodlar tiklandi", "info");
}

function buildCleanHtml(html, css, js) {
  const safeCss = String(css || '').replace(/<\/style>/gi, '<\\/style>');
  const safeJs = String(js || '').replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playground Output</title>
  <style>
${safeCss}
  </style>
</head>
<body>
${html}
  <script>
${safeJs}
  <\/script>
</body>
</html>`;
}

function openInBrowser() {
  if (getActiveCodingLanguage() !== 'web') {
    // Python/Java/C++/C#/SQL kodini HTML preview oynasiga yubormaslik
    showToast('🌐 "Brauzerda ochish" faqat Web Stack (HTML+CSS+JS) uchun', 'warning');
    return;
  }
  const html = $('#htmlEditor')?.value || '';
  const css = $('#cssEditor')?.value || '';
  const js = $('#jsEditor')?.value || '';
  const cleanHtml = buildCleanHtml(html, css, js);

  // RC3 fix: 'noopener' feature bilan window.open() spec bo'yicha har doim null qaytaradi.
  // Blob URL ishlatiladi (istalgan hajm, truncation yo'q), fallback — anchor click.
  const blobUrl = URL.createObjectURL(new Blob([cleanHtml], { type: 'text/html;charset=utf-8' }));
  let popup = null;
  try {
    popup = window.open(blobUrl, '_blank');
  } catch (err) {
    popup = null;
  }

  if (popup) {
    try { popup.opener = null; } catch (err) { /* noopener emulatsiyasi */ }
    showToast("🌐 Kod yangi tabda ochildi", "success");
  } else {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("🌐 Kod yangi tabda ochildi", "success");
  }

  setTimeout(() => {
    try { URL.revokeObjectURL(blobUrl); } catch (err) { /* noop */ }
  }, 120000);
}

function downloadCleanHtml() {
  if (getActiveCodingLanguage() !== 'web') {
    showToast('⬇️ Download faqat Web Stack (HTML+CSS+JS) uchun', 'warning');
    return;
  }
  const html = $('#htmlEditor')?.value || '';
  const css = $('#cssEditor')?.value || '';
  const js = $('#jsEditor')?.value || '';
  const cleanHtml = buildCleanHtml(html, css, js);

  const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("⬇️ index.html yuklab olindi", "success");
}
