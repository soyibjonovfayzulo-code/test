/* --- script.js --- */
(() => {
  /* --- lessons-data.js --- */
  /* ==========================================================
    DARSLAR — KURS MA'LUMOTLARI (DATA-ONLY)
    ==========================================================
    Bu fayl FAQAT ma'lumot saqlaydi. UI kodini o'zgartirmasdan
    istalgan kursga yangi dars qo'shish mumkin.
 
    Yangi dars qo'shish:
      1. Kerakli kursning `topics` massiviga yangi sarlavha qo'shing.
      2. Yoki to'liq obyekt ko'rinishida qo'shing:
 
         {
           title: 'Dars nomi',
           duration: 15,              // daqiqada (ixtiyoriy)
           description: 'Qisqa izoh', // ixtiyoriy
           xp: 10,                    // mukofot XP (ixtiyoriy)
           content: {                 // IXTIYORIY — hozircha null
             theory: 'Nazariya matni (HTML/string)',
             code: "console.log('salom')",
             quiz: [{ q: 'Savol?', options: ['A', 'B'], answer: 0 }],
             task: 'Amaliy topshiriq matni'
           }
         }
 
    `content` berilmasa yoki null bo'lsa — dars ichida
    "Dars tayyorlanmoqda" placeholder ko'rsatiladi.
 
    Yangi kurs qo'shish: COURSES massiviga yangi obyekt qo'shing —
    u avtomatik ravishda Darslar sahifasida kartada paydo bo'ladi.
    ========================================================== */

  (function () {
    'use strict';

    let COURSES = [
      {
        id: 'html',
        name: 'HTML',
        icon: '🌐',
        color: '#e34f26',
        tagline: 'Web sahifalar yaratishni o‘rganing.',
        description: 'Web sahifalarning tuzilishi: teglar, formalar, semantic markup va HTML5 imkoniyatlari.',
        topics: [
          {
            title: 'HTML nima?',
            duration: 15,
            content: {
              intro: 'Bu darsda HTMLning nima ekanligini, qanday ishlashini, teg va element tushunchalarini hamda oddiy HTML sahifaning tuzilishini o‘rganamiz. Darsni oxirigacha diqqat bilan o‘qing — oxirida bilimingizni test bilan tekshirasiz.',
              sections: [
                {
                  title: 'HTML nima?',
                  text: '**HTML** (HyperText Markup Language) — web sahifalarning **tuzilishini** yaratish uchun ishlatiladigan **belgilash tili** (Markup Language). Nomini parchalab ko‘ramiz:\n\n• **HyperText** — sahifalarni bir-biriga bog‘lovchi havolalar (link) matni. Bir sahifadan boshqasiga "sakrash" imkonini beradi.\n• **Markup** — "belgilash". Matnga teglar yordamida belgi qo‘yib, brauzerga har bir qismning vazifasini aytamiz: "bu sarlavha", "bu paragraf", "bu rasm".\n• **Language** — o‘z qoidalari va sintaksisi bor til.\n\n⚠️ **Muhim:** HTML — **dasturlash tili emas**. U o‘zgaruvchi, shart operatori yoki tsikl kabi vositalarga ega emas. HTML faqat sahifaning **tuzilishini** beradi. Chiroyli ko‘rinish uchun **CSS**, interaktivlik uchun **JavaScript** ishlatiladi.',
                  note: 'HTML sahifa skeleti (tuzilishi), CSS — kiyimi (dizayni), JavaScript — harakati (mantiq) deb tasavvur qiling.'
                },
                {
                  title: 'HTML qanday ishlaydi?',
                  text: 'HTML kodi oddiy matn faylida yoziladi va `.html` kengaytmasi bilan saqlanadi (masalan, `index.html`). Ishlash tartibi:\n\n1. Siz HTML kodni faylga yozasiz.\n2. Faylni brauzer (Chrome, Firefox, Safari...) ochadi.\n3. Brauzer kodni **yuqoridan pastga** o‘qiydi (bu jarayon **parse** deb ataladi) va har bir tegni tushunib, ekranda mos elementni chizadi.\n4. Natijada siz ko‘rayotgan sahifa hosil bo‘ladi.\n\nBrauzer hech qachon kodni "bajarib yubormaydi" — u kodni **o‘qiydi va chizadi**. Shuning uchun HTML dasturlash tili emas.',
                  code: '<p>Bu matn brauzerda ko‘rinadi.</p>',
                  codeNote: 'Brauzer bu kodni o‘qib, `<p>` — paragraf (abzas) ekanligini tushunadi va matnni yangi qatorda oddiy shriftda chiqaradi.',
                  result: 'Bu matn brauzerda ko‘rinadi. — (paragraf ko‘rinishida)'
                },
                {
                  title: 'Teg (Tag), Kontent va Element',
                  text: 'HTMLdagi eng asosiy tushuncha — **teg** (Tag). Teglar burchakli qavslarda yoziladi va brauzerga buyruq beradi. Har bir oddiy element 3 qismdan tuziladi:\n\n• **Ochiluvchi teg** (Opening Tag) — elementni boshlaydi: `<p>`\n• **Kontent** (Content) — teglar orasidagi matn yoki boshqa elementlar\n• **Yopiluvchi teg** (Closing Tag) — elementni tugatadi: `</p>` — oldida **slash `/`** bo‘ladi\n\n**Ochiluvchi teg + kontent + yopiluvchi teg = Element**',
                  code: '<p>Bugun HTML o‘rganishni boshladim</p>',
                  codeNote: 'Bu yerda: `<p>` — ochiluvchi teg, `Bugun HTML o‘rganishni boshladim` — kontent, `</p>` — yopiluvchi teg. Uchalasi birgalikda **paragraf elementi**ni hosil qiladi.',
                  note: 'Ba‘zi teglarning yopiluvchisi bo‘lmaydi — ular **bo‘sh teglar** (Void Elements) deyiladi. Masalan: `<br>` (yangi qator), `<img>` (rasm), `<hr>` (gorizontal chiziq). Ular faqat ochiluvchi tegdan iborat.'
                },
                {
                  title: 'Oddiy HTML sahifa strukturasi',
                  text: 'Har bir HTML sahifaning standart skeleti bor. Qatorma-qator tahlil qilamiz:',
                  code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Mening birinchi saytim</title>\n  </head>\n  <body>\n    <h1>Salom, dunyo!</h1>\n    <p>Men HTML o‘rganyapman.</p>\n  </body>\n</html>',
                  codeNote: '• `<!DOCTYPE html>` — hujjat turi e‘loni: "Bu HTML5 hujjat". Har bir sahifa birinchi qatorida bo‘lishi **shart**.\n• `<html>` — barcha elementlarning **ildizi** (root). Butun sahifa shu teg ichida.\n• `<head>` — sahifa haqidagi **ko‘rinmaydigan** ma‘lumotlar: sahifa nomi (title), kodirovka (meta charset) va boshqalar.\n• `<title>` — brauzer **tabida** ko‘rinadigan nom. U aynan shu yerga yoziladi.\n• `<body>` — foydalanuvchiga **ko‘rinadigan** barcha kontent: matn, rasm, tugma — hammasi shu teg ichida.\n• `<h1>` — eng katta (eng muhim) sarlavha.\n• `<p>` — paragraf (abzas).',
                  result: 'Brauzer tabida "Mening birinchi saytim" yozuvi chiqadi. Sahifada esa katta qalin "Salom, dunyo!" sarlavhasi va ostida oddiy "Men HTML o‘rganyapman." paragrafi ko‘rinadi.',
                  note: '`<head>` ichidagi hech narsa sahifada ko‘rinmaydi — u faqat brauzer uchun ma‘lumot. Ko‘radigan narsangizni har doim `<body>` ichiga yozing.'
                },
                {
                  title: 'Parent va Child (ota va bola) elementlar',
                  text: 'Teglar ichma-ich joylashadi. Ichida turgan element — **child** (bola), uni o‘rab turgan element — **parent** (ota):',
                  code: '<html>            ← parent (ota)\n  <body>          ← child (bola), lekin <p> uchun — parent\n    <p>Matn</p>  ← <body> uchun child\n  </body>\n</html>',
                  codeNote: '`<body>` uchun `<html>` — parent, `<p>` esa child. `<p>` uchun esa `<body>` — parent.',
                  note: '**Yopish tartibi muhim:** ochilgan oxirgi teg birinchi yopiladi. `<p><b>Matn</b></p>` — to‘g‘ri, `<p><b>Matn</p></b>` — xato (teglar kesishib qolgan).'
                },
                {
                  title: 'Sarlavhalar (h1–h6), Paragraf (p) va Yangi qator (br)',
                  text: '• **`<h1>` ... `<h6>`** — 6 darajali sarlavhalar. `h1` — eng katta va eng muhim, `h6` — eng kichik. Raqam oshgani sari sarlavha kichrayadi. Bir sahifada odatda **bitta** `h1` bo‘ladi (asosiy mavzu), qolganlari bo‘lim sarlavhalari.\n• **`<p>`** — paragraf. Har bir paragraf avtomatik ravishda **yangi qatordan** boshlanadi va atrofida bo‘sh joy (otstup) paydo bo‘ladi.\n• **`<br>`** — qatorni uzish (Line Break). Matn o‘rtasida yangi qatorga o‘tish uchun ishlatiladi. Bu — bo‘sh teg, yopiluvchisi yo‘q.',
                  code: '<h1>Do‘kon</h1>\n<p>Yangi mahsulotlar keldi.</p>\n<p>Birinchi qator<br>Ikkinchi qator</p>',
                  codeNote: '`<h1>` katta sarlavha chizadi. Ikkinchi paragrafda `<br>` tufayli matn ikki qatorga bo‘linadi — yangi paragraf ochilmaydi.',
                  result: 'Katta "Do‘kon" sarlavhasi. Ostida "Yangi mahsulotlar keldi." paragrafi. Pastda esa bitta paragraf ichida ikki qator: "Birinchi qator" va undan keyin "Ikkinchi qator".'
                },
                {
                  title: 'Xulosa',
                  text: 'Endi siz HTMLning nima ekanligini, teg va element tushunchalarini, sahifaning asosiy tuzilishini bilib oldingiz. Tayyorgarlik to‘liq — bilimingizni test bilan mustahkamlash vaqti keldi! 🚀'
                }
              ],
              keyPoints: [
                'HTML — Belgilash tili (Markup Language), **dasturlash tili emas**',
                'Element = ochiluvchi teg + kontent + yopiluvchi teg (`<p>...</p>`)',
                'Yopiluvchi teg oldida slash `/` bo‘ladi: `</p>`',
                '`<br>` — yopiluvchi tegsiz yangi qator (bo‘sh teg)',
                '`<!DOCTYPE html>` — HTML5 e‘loni, har bir sahifaning birinchi qatorida bo‘lishi shart',
                '`<head>` — ko‘rinmaydigan ma‘lumotlar, `<body>` — ko‘rinadigan kontent',
                '`<title>` — brauzer tabida ko‘rinadigan sahifa nomi',
                '`<h1>` — eng katta va eng muhim sarlavha, `<h6>` — eng kichik',
                'Ichma-ich turgan teglar: parent (ota) va child (bola); oxirgi ochilgan teg birinchi yopiladi'
              ]
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: 'HTML — qanday til?',
                  options: ['Dasturlash tili', 'Belgilash tili (Markup Language)', 'Operatsion tizim', 'Ma\'lumotlar bazasi'],
                  answer: 1,
                  explanation: 'HTML — HyperText Markup Language, ya\'ni **belgilash tili**. U sahifaning tuzilishini yaratadi. O\'zgaruvchi va tsikllar bo\'lmagani uchun u dasturlash tili emas.'
                },
                {
                  question: 'HTML nomining "HyperText" qismi nimani anglatadi?',
                  options: ['Sahifalar orasida o\'tish imkonini beruvchi havolalar (link) matni', 'Tez ishlaydigan internet turi', 'Katta hajmdagi fayl formati', 'Rasmlarni siqish usuli'],
                  answer: 0,
                  explanation: 'HyperText — bir sahifadan boshqa sahifaga "sakrash" imkonini beruvchi havolalar (link) orqali bog\'langan matn.'
                },
                {
                  question: '`<p>Salom</p>` kodida yopiluvchi teg (Closing Tag) qaysi?',
                  options: ['`<p>`', '`</p>`', '`(p)`', '`<//p>`'],
                  answer: 1,
                  explanation: 'Yopiluvchi teg ochiluvchi teg bilan bir xil yoziladi, lekin oldida **slash `/`** bo\'ladi: `</p>`.'
                },
                {
                  question: 'HTML elementi nimalardan tuziladi?',
                  options: ['Faqat ochiluvchi tegdan', 'Faqat matndan', 'Ochiluvchi teg + kontent + yopiluvchi tegdan', 'Faqat yopiluvchi tegdan'],
                  answer: 2,
                  explanation: 'Element = ochiluvchi teg (`<p>`) + kontent (matn) + yopiluvchi teg (`</p>`). Uchalasi birgalikda to\'liq elementni hosil qiladi.'
                },
                {
                  question: '`<p>Bugun yaxshi kun</p>` kodida elementning kontenti (content) qaysi qism?',
                  options: ['`<p>`', '`Bugun yaxshi kun`', '`</p>`', '`p` harfi'],
                  answer: 1,
                  explanation: 'Kontent — teglar orasidagi matn. Bu yerda u "Bugun yaxshi kun".'
                },
                {
                  question: 'Quyidagi kod natijasida nima chiqadi?\n`<h1>Salom</h1>`\n`<p>Men HTML o\'rganyapman.</p>`',
                  options: ['Katta qalin "Salom" sarlavhasi va ostida paragraf', 'Faqat paragraf, sarlavha chiqmaydi', 'Hech narsa chiqmaydi', 'Brauzer xatolik ko\'rsatadi'],
                  answer: 0,
                  explanation: '`<h1>` — eng katta qalin sarlavha, `<p>` — oddiy paragraf. Ikkalasi birgalikda sarlavha + paragraf ko\'rinishida chiqadi.'
                },
                {
                  question: 'Qaysi kod brauzer tabida "Mening saytim" nomini ko\'rsatadi?',
                  options: ['`<h1>Mening saytim</h1>`', '`<title>Mening saytim</title>`', '`<p>Mening saytim</p>`', '`<body>Mening saytim</body>`'],
                  answer: 1,
                  explanation: '`<title>` brauzer tabidagi sahifa nomini belgilaydi. `h1` va `p` sahifa ichida ko\'rinadi, tab nomiga ta\'sir qilmaydi.'
                },
                {
                  question: '`<!DOCTYPE html>` yozuvi nima vazifani bajaradi?',
                  options: ['Brauzerga bu HTML5 hujjat ekanligini bildiradi', 'Sahifaga rasm qo\'shadi', 'Sahifa nomini o\'rnatadi', 'Internetga ulanadi'],
                  answer: 0,
                  explanation: '`<!DOCTYPE html>` — hujjat turi e\'loni. Brauzerga "bu zamonaviy HTML5 hujjat" degan ma\'lumot beradi va sahifaning birinchi qatorida yoziladi.'
                },
                {
                  question: 'Foydalanuvchiga ko\'rinadigan barcha kontent (matn, rasm, tugma) qaysi teg ichida bo\'lishi kerak?',
                  options: ['`<head>`', '`<title>`', '`<body>`', '`<!DOCTYPE html>`'],
                  answer: 2,
                  explanation: '`<body>` — ko\'rinadigan kontent joylashadigan asosiy teg. `<head>` va `<title>` ichidagilar esa sahifada ko\'rinmaydi.'
                },
                {
                  question: '`<head>` ichiga qaysi element joylashtiriladi?',
                  options: ['`<title>`', '`<h1>`', '`<p>`', '`<br>`'],
                  answer: 0,
                  explanation: '`<head>` ichida sahifa haqidagi ko\'rinmaydigan ma\'lumotlar turadi: `<title>`, `<meta>` va boshqalar. `h1`, `p`, `br` — ko\'rinadigan kontent, ular `<body>` ichida bo\'ladi.'
                },
                {
                  question: '`<br>` tegi haqida qaysi fikr to\'g\'ri?',
                  options: ['Matnni yangi qatorga o\'tkazadi va yopiluvchi tegi yo\'q', 'Sahifaga rasm qo\'shadi', 'U har doim `</br>` bilan yopiladi', 'U faqat sarlavhalar bilan ishlaydi'],
                  answer: 0,
                  explanation: '`<br>` — bo\'sh teg (Void Element): qatorni uzish uchun ishlatiladi va yopiluvchi tegi yo\'q.'
                },
                {
                  question: 'Quyidagi kodlardan qaysi birida XATO bor?',
                  options: ['`<p>Salom</p>`', '`<h1>Sarlavha</h1>`', '`<p>Matn</div>`', '`<br>`'],
                  answer: 2,
                  explanation: '`<p>` tegi faqat `</p>` bilan yopiladi. `</div>` — noto\'g\'ri yopiluvchi teg. Ochiluvchi va yopiluvchi teglar mos bo\'lishi shart.'
                },
                {
                  question: '`<html>` va `<body>` teglari orasidagi munosabat qanday?',
                  options: ['`<html>` — parent (ota), `<body>` — child (bola)', '`<body>` — parent, `<html>` — child', 'Ular bir-biriga bog\'liq emas', 'Ikkalasi ham child hisoblanadi'],
                  answer: 0,
                  explanation: '`<body>` ichida `<html>` turgani uchun `<html>` — parent (ota), `<body>` — child (bola) element.'
                },
                {
                  question: 'Sarlavhalar (h1–h6) orasida ENG KATTA va eng muhim sarlavha qaysi?',
                  options: ['`<h6>`', '`<h1>`', '`<p>`', '`<h3>`'],
                  answer: 1,
                  explanation: '`<h1>` — eng katta va eng muhim sarlavha. Raqam oshgani sari sarlavha kichrayadi: `h1` > `h2` > ... > `h6`.'
                },
                {
                  question: '`Salom<br>Dunyo` matni brauzerda qanday ko\'rinadi?',
                  options: ['"Salom" birinchi qatorda, "Dunyo" ikkinchi qatorda', 'Bitta qatorda "SalomDunyo"', 'Faqat "Salom" ko\'rinadi', 'Brauzer xatolik ko\'rsatadi'],
                  answer: 0,
                  explanation: '`<br>` — qatorni uzish tegi. Matn o\'sha joydan yangi qatorga o\'tadi: "Salom" va undan keyin yangi qatorda "Dunyo".'
                }
              ]
            }
          },
          {
            title: 'HTML hujjati strukturasi',
            duration: 20,
            xp: 30,
            content: {
              intro: '1-darsda teg va elementlarni o‘rgandingiz. Endi ularni **to‘g‘ri joyga** qo‘yamiz: har bir HTML hujjatning aniq skeleti bor. Bu darsda faqat **struktura** — CSS va JavaScript keyingi kurslarda.',
              sections: [
                {
                  title: 'HTML skeleti — umumiy ko‘rinish',
                  text: 'Har bir HTML sahifa xuddi **odam skeleti** kabi qurilgan. Uchta asosiy qatlam: `<!DOCTYPE html>` — e‘lon, `<head>` — ko‘rinmaydigan qism, `<body>` — ko‘rinadigan qism.',
                  code: '<!DOCTYPE html>\n<html lang="uz">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mening saytim</title>\n  </head>\n  <body>\n    <h1>Salom, dunyo!</h1>\n  </body>\n</html>',
                  codeNote: 'Yuqoridan pastga: DOCTYPE → html → head (meta, title) → body (kontent). Bu tartib har bir sahifada bir xil.',
                  playground: true,
                  result: 'Brauzer tabida "Mening saytim" yozuvi, sahifada esa "Salom, dunyo!" sarlavhasi chiqadi.'
                },
                {
                  title: '<!DOCTYPE html> — hujjat turi e‘loni',
                  text: '**Bu nima?** Brauzerga "bu HTML5 hujjat" degan e‘lon.\n**Nima uchun kerak?** Brauzer sahifani zamonaviy qoidalar bo‘yicha to‘g‘ri chizsin.\n**Qayerga yoziladi?** Har doim **birinchi qator**ga. Yopiluvchi tegi yo‘q.',
                  code: '<!DOCTYPE html>',
                  codeNote: 'Katta-kichik harf farq qilmaydi, lekin an’anaga ko‘ra katta harf bilan yoziladi.',
                  result: 'Sahifada hech narsa ko‘rinmaydi — bu e‘lon faqat brauzer uchun.'
                },
                {
                  title: '<html lang="uz"> — ildiz element',
                  text: '**Bu nima?** Butun hujjatni o‘rab turuvchi **ildiz** (root) element.\n**Nima uchun kerak?** `lang` atributi sahifa tili o‘zbek ekanligini aytadi — brauzer tarjima va ovozli o‘qish uchun ishlatadi.\n**Qayerga yoziladi?** DOCTYPE‘dan keyin, barcha elementlar shu teg **ichida**.',
                  code: '<html lang="uz">\n  ...\n</html>',
                  codeNote: '`lang="uz"` — til kodi. Inglizcha sahifa uchun `lang="en"` yoziladi. `<html>` — barcha teglarning parenti.',
                  result: 'Ekranda o‘zgarish yo‘q, lekin sahifa "o‘zbek tilida" deb belgilanadi.'
                },
                {
                  title: '<head> — ko‘rinmaydigan qism',
                  text: '**Bu nima?** Sahifa haqidagi **ma‘lumotlar** (metama‘lumotlar) konteyneri.\n**Nima uchun kerak?** Sahifa nomi, kodirovka, mobil moslashuv — bularning hammasi shu yerda.\n**Qayerga yoziladi?** `<html>` ichida, `<body>`dan **oldin**. Ichidagi narsalar sahifada ko‘rinmaydi (1-dars eslatmasi).',
                  code: '<head>\n  <meta charset="UTF-8">\n  <title>Mening saytim</title>\n</head>',
                  codeNote: '`<head>` ochiladi va `</head>` bilan **yopilishi shart**. Ichiga `<title>` va `<meta>` yoziladi.',
                  result: 'Sahifada ko‘rinmaydi, lekin brauzer tabida sarlavha paydo bo‘ladi.'
                },
                {
                  title: '<meta charset="UTF-8"> va viewport',
                  text: '**charset="UTF-8"** — matn kodirovkasi. O‘zbekcha harflar (o‘, g‘) to‘g‘ri chiqishi uchun kerak. `<head>` ichida birinchi o‘rinda yoziladi.\n**viewport** — sahifa telefon ekraniga moslashuvini yoqadi. Bo‘lmasa telefon sahifani kichraytirilgan ko‘rinishda ko‘rsatadi.',
                  code: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                  codeNote: '`meta` — bo‘sh teg (yopiluvchisi yo‘q). `width=device-width` — ekran kengligini qurilma kengligiga tenglashtiradi.',
                  result: 'Salom, dunyo! — barcha harflar to‘g‘ri; telefonda sahifa to‘g‘ri masshtabda.'
                },
                {
                  title: '<title> — sahifa nomi',
                  text: '**Bu nima?** Brauzer **tabida** ko‘rinadigan sahifa nomi.\n**Nima uchun kerak?** Foydalanuvchi sahifani tablar orasida topishi uchun, Google esa qidiruvda shu nomni ko‘rsatadi.\n**Qayerga yoziladi?** `<head>` **ichida** — `<body>`ga emas!',
                  code: '<title>Mening saytim</title>',
                  codeNote: 'Matn `<title>` va `</title>` orasiga yoziladi. Bu — head‘dagi yagona "matnli" teg.',
                  result: 'Tabda: "Mening saytim".'
                },
                {
                  title: '<body> — ko‘rinadigan qism',
                  text: '**Bu nima?** Foydalanuvchiga **ko‘rinadigan** barcha kontent konteyneri.\n**Nima uchun kerak?** Sarlavha, matn, rasm, tugma — hammasi shu yerda yashaydi.\n**Qayerga yoziladi?** `<head>`dan **keyin**, `<html>` ichida.',
                  code: '<body>\n  <h1>Salom, dunyo!</h1>\n</body>',
                  codeNote: '1-dars eslatmasi: `<h1>` — eng katta sarlavha, `<p>` — paragraf. Hammasi `<body>` ichida bo‘lishi shart.',
                  result: 'Sahifada "Salom, dunyo!" sarlavhasi chiqadi.'
                },
                {
                  title: 'Parent / Child — ota va bola',
                  text: '**Bu nima?** Ichma-ich joylashgan elementlar munosabati. Ichida turgan — **child** (bola), o‘rab turgan — **parent** (ota).\n**Nima uchun kerak?** Brauzer sahifani shu daraxt kabi tuzilma sifatida eslab qoladi.\n**Qayerga yoziladi?** Skeletda: `<html>` — parent, `<head>` va `<body>` — child, `<title>` — `<head>`ning childi.',
                  code: '<html>              ← parent\n  <head>            ← child\n    <title>...</title>  ← headning childi\n  </head>\n  <body>            ← child\n    <h1>...</h1>    ← bodyning childi\n  </body>\n</html>',
                  codeNote: 'Bir element boshqasiga nisbatan parent, o‘sha boshqaga nisbatan child bo‘lishi mumkin: `<body>` — `<html>`ga child, `<h1>`ga esa parent.',
                  result: 'Daraxt: html → (head, body); head → title; body → h1.'
                },
                {
                  title: 'Nesting va Indentation',
                  text: '**Nesting** — elementlarni to‘g‘ri ichma-ich joylash: ochilgan teg **o‘z childidan keyin** yopilishi kerak. Noto‘g‘ri nesting = buzilgan sahifa.\n**Indentation** — ichki elementlarni 2 bo‘sh joy (space) ichkariga surish. Brauzer uchun farq qilmaydi — kod o‘qilishi uchun shart.',
                  code: '<!-- ✅ To‘g‘ri nesting + indentation -->\n<body>\n  <p>Bu to‘g‘ri</p>\n</body>\n\n<!-- ❌ Noto‘g‘ri: <p> ochiq holatda <body> yopildi -->\n<body>\n  <p>Bu xato\n</body>',
                  codeNote: 'Qoida: oxirgi ochilgan teg **birinchi yopiladi**. Har bir yangi child 2 space ichkariga suriladi.',
                  result: 'To‘g‘ri kodda har bir qatorning egasi aniq; xato kodda brauzer tuzilmani buzib chizadi.'
                }
              ],
              keyPoints: [
                '`<!DOCTYPE html>` — har doim 1-qator, HTML5 e‘loni',
                '`<html lang="uz">` — ildiz element, til ko‘rsatiladi',
                '`<head>` — ko‘rinmaydigan qism: meta, title',
                '`<meta charset="UTF-8">` — matn kodirovkasi',
                '`<meta viewport>` — telefon ekraniga moslashuv',
                '`<title>` — brauzer tabidagi nom, head ichida',
                '`<body>` — ko‘rinadigan barcha kontent',
                'Parent — ota, child — bola: ichma-ich joylashuv',
                'Nesting — oxirgi ochilgan teg birinchi yopiladi',
                'Indentation — 2 space, kod o‘qilishi uchun'
              ],
              masterXp: 30,
              exercises: [
                {
                  id: 'ex1',
                  type: 'liveedit',
                  title: '1-MASHQ — Live Edit',
                  instruction: 'Kodni tahrirlang: `<title>` nomini **"Mening saytim"** dan boshqa nomga o‘zgartiring (masalan, **Mening Portfolioim**). So‘ngra **▶ RUN** bosing — previewda tab nomi o‘zgarganini ko‘rasiz.',
                  startCode: '<!DOCTYPE html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8">\n  <title>Mening saytim</title>\n</head>\n<body>\n  <h1>Salom, dunyo!</h1>\n</body>\n</html>',
                  xp: 10
                },
                {
                  id: 'ex2',
                  type: 'dragdrop',
                  title: '2-MASHQ — Drag & Drop',
                  instruction: 'Aralashtirilgan skelet qismlarini **to‘g‘ri tartibga** qo‘ying. Kompyuterda tashib qo‘ying (drag & drop), telefonda: bo‘lakni bosing → joylash o‘rnini bosing.',
                  hint: '<!DOCTYPE html> bilan boshlanadi. html ichida head va body. head ichida title, body ichida h1. Yopiluvchi teglar teskari tartibda yopiladi.',
                  items: ['<!DOCTYPE html>', '<html>', '<head>', '<title>Mening saytim</title>', '</head>', '<body>', '<h1>Salom!</h1>', '</body>', '</html>'],
                  xp: 10
                },
                {
                  id: 'ex3',
                  type: 'detective',
                  title: '3-MASHQ — Kod detektivi',
                  instruction: 'Kodda bitta xato bor. Uni toping — noto‘g‘ri bo‘lgan qisorni tanlang.',
                  code: '<!DOCTYPE html>\n<html lang="uz">\n  <head>\n    <meta charset="UTF-8">\n    <title>Test</title>\n  <body>\n    <h1>Salom</h1>\n  </body>\n</html>',
                  options: ['`<!DOCTYPE html>` qatorida xato bor', '`<head>` ochilib, `</head>` bilan yopilmagan', '`<h1>` tegi xato yozilgan', '`lang="uz"` atributi kerak emas'],
                  answer: 1,
                  explanation: '`<head>` ochilgan, lekin `</head>` yozilmagan — `<body>` uning ichida qolib ketgan. Oxirgi ochilgan teg birinchi yopilishi kerak (nesting qoidasi).',
                  xp: 10
                }
              ]
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: '`<!DOCTYPE html>` yozuvi nima va qayerda turadi?',
                  options: ['HTML5 e‘loni — har doim hujjatning birinchi qatorida', 'Sahifa nomi — head ichida', 'Kodirovka — body ichida', 'Yopiluvchi teg — oxirgi qatorda'],
                  answer: 0,
                  explanation: '`<!DOCTYPE html>` — "bu HTML5 hujjat" e‘loni va har doim birinchi qatorda turadi.'
                },
                {
                  question: '`lang="uz"` atributi qaysi tegda yoziladi?',
                  options: ['`<head>`', '`<body>`', '`<html>`', '`<title>`'],
                  answer: 2,
                  explanation: '`<html lang="uz">` — sahifa tili ildiz elementda ko‘rsatiladi.'
                },
                {
                  question: 'Brauzer tabida ko‘rinadigan sahifa nomi qaysi tegda yoziladi?',
                  options: ['`<h1>`', '`<title>`', '`<meta>`', '`<p>`'],
                  answer: 1,
                  explanation: '`<title>` ichidagi matn brauzer tabida ko‘rinadi.'
                },
                {
                  question: '`<title>` tegi qayerga yoziladi?',
                  options: ['`<body>` ichiga', '`<head>` ichiga', '`<html>`dan tashqariga', 'DOCTYPE‘dan oldin'],
                  answer: 1,
                  explanation: '`<title>` — ko‘rinmaydigan ma‘lumot, shuning uchun `<head>` ichida yoziladi.'
                },
                {
                  question: '`<meta charset="UTF-8">` nima uchun kerak?',
                  options: ['Sahifa nomini beradi', 'Telefon ekraniga moslashtiradi', 'O‘zbekcha harflar to‘g‘ri chiqishi uchun (kodirovka)', 'Internetga ulaydi'],
                  answer: 2,
                  explanation: 'UTF-8 kodirovkasi o‘, g‘ kabi harflarning to‘g‘ri ko‘rinishini ta‘minlaydi.'
                },
                {
                  question: 'Telefon ekranida sahifaning to‘g‘ri masshtabda ko‘rinishini qaysi teg ta‘minlaydi?',
                  options: ['`<meta name="viewport" ...>`', '`<meta charset="UTF-8">`', '`<title>`', '`<!DOCTYPE html>`'],
                  answer: 0,
                  explanation: 'Viewport meta tegi `width=device-width, initial-scale=1.0` qiymatlari bilan mobil moslashuvni yoqadi.'
                },
                {
                  question: 'Foydalanuvchiga ko‘rinadigan barcha kontent qaysi teg ichida bo‘lishi shart?',
                  options: ['`<head>`', '`<body>`', '`<title>`', '`<meta>`'],
                  answer: 1,
                  explanation: '`<body>` — ko‘rinadigan kontent joylashadigan asosiy teg.'
                },
                {
                  question: '`<body>` ichida turgan `<h1>` uchun qaysi munosabat to‘g‘ri?',
                  options: ['`<h1>` — parent, `<body>` — child', '`<body>` — parent, `<h1>` — child', 'Ikkalasi ham child', 'Ular bog‘liq emas'],
                  answer: 1,
                  explanation: 'Ichida turgan element — child, o‘rab turgan — parent: `<body>` parent, `<h1>` child.'
                },
                {
                  question: 'Nesting (ichma-ich joylashuv) qoidasiga ko‘ra qaysi kod to‘g‘ri?',
                  options: ['`<body><p>Matn</p></body>`', '`<body><p>Matn</body></p>`', '`<body></p><p></body>`', '`<p><body>Matn</body></p>`'],
                  answer: 0,
                  explanation: 'Oxirgi ochilgan teg birinchi yopiladi: `<p>` yopiladi, so‘ngra `</body>` yopiladi.'
                },
                {
                  question: 'Indentation (2 space ichkariga surish) kim uchun kerak?',
                  options: ['Brauzer shuni talab qiladi', 'Kodni odamga o‘qishga tushunarli qilish uchun', 'Sahifani tezlashtiradi', 'Hech kim — kerak emas'],
                  answer: 1,
                  explanation: 'Indentation kod tuzilishini o‘qishni osonlashtiradi. Brauzer uchun bo‘sh joylar farq qilmaydi.'
                }
              ]
            }
          },
          {
            title: 'HTML atributlari va elementga qo‘shimcha ma’lumot berish',
            duration: 25,
            xp: 30,
            content: {
              intro: 'Bugun Siz elementlarga **qo‘shimcha ma’lumot berishni** o‘rganasiz — atributlar orqali. Har bir tushunchani misol bilan ko‘ramiz, oxirida 3 ta mashq va test bilan mustahkamlaymiz. 💪',
              quizQuestionCount: 10,
              reviewTitle: '👀 Oldingi darslardan nimalarni bilamiz?',
              review: [
                { t: 'HTML', d: 'Web sahifaning tuzilishini yaratadigan til (dasturlash tili emas!)' },
                { t: 'tag', d: 'Masalan: <p>, <h1>, <img> — brauzerga buyruq beradi' },
                { t: 'element', d: 'Ochiluvchi teg + kontent + yopiluvchi teg' },
                { t: '<html>', d: 'Barcha elementlarning ildizi (ota-osi)' },
                { t: '<head>', d: 'Ko‘rinmaydigan qism: title, meta' },
                { t: '<title>', d: 'Brauzer tabidagi sahifa nomi' },
                { t: '<body>', d: 'Foydalanuvchiga ko‘rinadigan barcha kontent' }
              ],
              sections: [
                {
                  title: 'Atribut nima? 🤔',
                  text: 'Siz allaqachon element yaratishni bilasiz. Lekin ba’zan elementga **qo‘shimcha ma’lumot** berish kerak bo‘ladi: "bu rasm qayerdan olinsin?", "bu elementning nomi nima?"\n\nBuning uchun **atribut** ishlatiladi.\n\n**Atribut — HTML elementiga qo‘shimcha ma’lumot beradigan qism.** U har doim **ochiluvchi teg ichida** yoziladi.',
                  code: '<img src="rasm.jpg" alt="Rasm">',
                  codeNote: 'Parchalab ko‘ring:\n• `<img>` — element\n• `src="rasm.jpg"` — atribut (rasm manzili)\n• `alt="Rasm"` — atribut (rasm tavsifi)',
                  result: 'Brauzer rasm.jpg faylini topib, sahifaga chizadi.',
                  note: 'Atribut har doim **name="value"** ko‘rinishida yoziladi.',
                  playground: true
                },
                {
                  title: 'name="value" — nom va qiymat 🔑',
                  text: 'Har bir atribut ikki qismdan iborat:\n\n• **name** — atribut **nomi** (nima haqida ma’lumot)\n• **value** — atribut **qiymati** (o‘zi nima)\n\nMisol: `src="rasm.jpg"`\n• `src` → atribut nomi\n• `"rasm.jpg"` → atribut qiymati\n\nXuddi shunday: `alt="Rasm"` — nomi `alt`, qiymati `"Rasm"`. Sodda, shunday emasmi? 😄',
                  code: '<img src="rasm.jpg" alt="Rasm">',
                  codeNote: '`src` = nom, `"rasm.jpg"` = qiymat\n`alt` = nom, `"Rasm"` = qiymat\nIkkalasi ham ochiluvchi teg ichida, probel bilan ajratilgan.',
                  note: 'Qiymat har doim **qo‘shtirnoq** ichida yoziladi: name="value"',
                  playground: true
                },
                {
                  title: 'src — rasm qayerdan olinadi? 📥',
                  text: '**src** rasm yoki boshqa resurs **qayerdan olinishi** kerakligini ko‘rsatadi.\n\nBu yerda src — **to‘liq internet manzili** (URL). Brauzer shu manzilga boradi va rasmni yuklab, sahifaga chizadi.\n\nQuyida real rasm ko‘rsatilgan — aynan yuqoridagi src manzilidan yuklandi! 🎉',
                  code: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg">',
                  codeNote: '• `<img>` — rasm elementi\n• `src` — atribut nomi\n• `https://...` — qiymat: rasmning internetdagi manzili',
                  previewHtml: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg" alt="Kompyuter rasmi" style="max-width:100%;height:auto;border-radius:12px;display:block;margin:0 auto">',
                  previewCaption: '📷 Bu rasm HTML <img> elementi orqali qo‘shildi.',
                  imgCheckUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg',
                  result: 'Real rasm previewda ko‘rinishi kerak. Agar ko‘rinmasa — internet aloqasini tekshiring.',
                  playground: true
                },
                {
                  title: 'alt — rasm haqida qisqa matn 📝',
                  text: '**alt** rasm haqida **qisqa matn** beradi.\n\nNega kerak?\n• Rasm ochilmasa — o‘rnida alt matni chiqadi\n• Ko‘zi ojiz foydalanuvchilar uni eshitadi (accessibility)\n• Google rasmni alt orqali tushunadi\n\nOrtiqcha nazariya shart emas — shu uch xil foyda yetarli! 😊',
                  code: '<img\n  src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg"\n  alt="Kompyuter rasmi"\n>',
                  codeNote: '• `alt` — atribut nomi\n• `"Kompyuter rasmi"` — atribut qiymati: rasmning qisqa tavsifi',
                  result: 'Rasm yuklansa — faqat rasm ko‘rinadi. Yuklanmasa — "Kompyuter rasmi" matni chiqadi.',
                  note: 'Professional saytlarda har bir mazmunli rasmda alt bo‘ladi — bu qoidani Siz ham odat qiling.',
                  playground: true
                },
                {
                  title: 'class — elementga guruh nomi berish 🏷️',
                  text: '**class** — elementga **guruh yoki umumiy nom** berishga yordam beradi.\n\nBir xil classni **bir nechta elementga** berish mumkin — xuddi sinfdagi o‘quvchilar kabi: hammada bir "class" nomi bor.\n\nCSS keyinchalik class orqali elementlarni **bezashga** yordam beradi. CSS haqida batafsil keyin o‘rganamiz.',
                  code: '<div class="card">\n  Salom\n</div>',
                  codeNote: '• `<div>` — element\n• `class` — atribut nomi\n• `"card"` — qiymat: elementning guruh nomi',
                  note: 'id = unikal pasport (faqat bittaga), class = umumiy etiketka (ko‘pchilikka).',
                  playground: true
                },
                {
                  title: 'id — elementga o‘ziga xos nom 🆔',
                  text: '**id** elementga **o‘ziga xos (unikal) nom** berishga yordam beradi.\n\nBir sahifada bir xil id **faqat bitta** elementda bo‘lishi kerak — xuddi pasport raqami kabi.\n\n⚡ JavaScript keyinchalik id orqali kerakli element bilan ishlashi mumkin. Hozircha faqat shunchaki eslab qoling.',
                  code: '<button id="startBtn">\n  Boshlash\n</button>',
                  codeNote: '• `<button>` — element\n• `id` — atribut nomi\n• `"startBtn"` — qiymat: elementning unikal nomi',
                  result: 'Bu button endi "startBtn" nomi bilan tanilgan — JS uni osongina topadi.',
                  note: 'id qisqa va tushunarli bo‘lsin: startBtn, mainImage, footerMenu...',
                  playground: true
                },
                {
                  title: 'title — hover qilsangiz chiqadigan izoh 💬',
                  text: '**title** — element ustiga **sichqoncha olib borganda** chiqadigan kichik izoh (tooltip).\n\n⚠️ Chalkashtirmang: `<title>` tegi (tab nomi) va `title` atributi — ikki xil narsa!',
                  code: '<button title="Boshlash uchun bosing">\n  Boshlash\n</button>',
                  codeNote: '`title` qiymati brauzer tomonidan kichik izoh oynasida (tooltip) ko‘rsatiladi — hech qanday CSS kerak emas.',
                  previewHtml: '<div style="font-family:sans-serif;padding:20px;text-align:center"><button title="Boshlash uchun bosing" style="padding:14px 28px;font-size:18px;border-radius:10px;border:none;background:#6366f1;color:#fff;cursor:pointer">Boshlash</button><p style="color:#94a3b8;margin-top:14px;font-size:14px">Mouse ustiga olib boring 👀</p></div>',
                  previewCaption: '🖱️ Tugma ustida sichqonchani bir necha soniya turib qoldiring — tooltip chiqadi.',
                  result: 'Button ustiga olib borganda "Boshlash uchun bosing" izohi ko‘rinadi.',
                  playground: true
                },
                {
                  title: 'Bir nechta atribut bitta elementda 🎯',
                  text: 'Real loyihalarda elementda **4–5 ta atribut** bo‘ladi. Har birini siz allaqachon o‘rgandingiz — endi birlashtiramiz!\n\nAtributlar probel bilan ketma-ket yoziladi, tartibi muhim emas.',
                  code: '<img\n    src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg"\n    alt="Kompyuter"\n    class="photo"\n    id="mainPhoto"\n    title="Asosiy rasm"\n>',
                  codeNote: '• `src` — rasm manzili\n• `alt` — rasm tavsifi\n• `class` — CSS uchun guruh nomi\n• `id` — unikal nom\n• `title` — tooltip izoh\nHammasi bir ochiluvchi teg ichida!',
                  result: 'Bitta element — 5 ta atribut. Uzun ro‘yxatda har birini alohida qatorga yozish o‘qilishi oshiradi.',
                  note: 'Uzun atributlar ro‘yxatida har birini **alohida qatorga** yozish o‘qilishni oshiradi — brauzer uchun farqi yo‘q.',
                  playground: true
                },
                {
                  title: '🎨 CSS nima qiladi?',
                  text: '**CSS** HTML yaratgan narsalarni **chiroyli qilishga** yordam beradi.\n\nKichik misol: `style="color:red"` — matn rangini qizil qiladi. Buni to‘liq CSS kursida chuqur o‘rganamiz — hozir faqat bir martalik tanishuv. 👋',
                  code: '<p style="color:red;">\n  Salom\n</p>',
                  codeNote: '`style` — bu ham atribut! Uning qiymati CSS kodi: `color:red` — rangni qizil qiladi.',
                  result: '"Salom" matni qizil rangda chiqadi.',
                  note: 'CSS‘ni keyingi CSS darslarida batafsil o‘rganamiz.',
                  playground: true
                },
                {
                  title: '⚡ JavaScript nima qiladi?',
                  text: '**JavaScript** saytga **harakat va mantiq** qo‘shishga yordam beradi.\n\nQuyidagi tugmani bosing va nima bo‘lishini ko‘ring — bu haqiqiy alert! 😄',
                  code: '<button onclick="alert(\'Salom!\')">\n  Bosing\n</button>',
                  codeNote: '`onclick` — bu ham atribut! Bosilganda qiymatidagi kod bajariladi: alert — kichik oyna chiqaradi.',
                  demoButton: { label: '🖱️ Bosing', msg: 'Salom!' },
                  result: 'Tugma bosilganda "Salom!" degan alert oynasi chiqadi.',
                  note: 'JS‘ni alohida JavaScript kursida batafsil o‘rganamiz — bu faqat teaser.',
                  playground: true
                }
              ],
              attrDemo: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg',
                alt: 'Kompyuter rasmi',
                title: 'Asosiy rasm',
                className: 'photo',
                id: 'mainPhoto'
              },
              motivationTitle: '🚀 KEYINGI DARS: 4-DARS',
              motivation: '**Linklar va rasmlar bilan ishlaymiz!** 🔗\n\n• 🔗 boshqa sahifaga o‘tish\n• 🌐 internetdagi saytga ulanish\n• 🖼️ rasmni link qilish\n\nWeb sahifangiz endi asta-sekin **haqiqiy saytga o‘xshab bormoqda** 😎',
              keyPoints: [
                'Attribute — `name="value"` ko‘rinishida, faqat **opening tag ichida**',
                '`src` — fayl manzili: to‘liq URL yoki nisbiy yo‘l',
                '`alt` — rasm yuklanmaganda/ko‘rinmaganda ko‘rsatiladigan matn (accessibility)',
                '`class` — ko‘p elementlarga beriladigan nom (CSS guruhlaydi)',
                '`id` — unikal nom, sahifada faqat bitta (JS topadi)',
                '`title` — hoverda ko‘rinadigan tooltip izoh',
                'Bir elementda bir nechta attribute probel bilan yoziladi'
              ],
              exercises: [
                {
                  id: 'l3ex1',
                  mode: 'simple',
                  type: 'liveedit',
                  title: '1-MASHQ — <img> ga alt qo‘shing 🖼️',
                  instruction: 'Rasmga **alt** atributini qo‘shing. Quyidagi koddagi `<img>` tag ichiga **alt="Kompyuter rasmi"** yozing.',
                  startCode: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/A_person_working_on_old_desktop_computer.jpg" width="320">',
                  checks: [
                    { re: '<img[^>]*src=', msg: '`<img>` elementida `src` saqlangan bo‘lishi kerak' },
                    { re: '<img[^>]*\\salt="[^"]+"', msg: '`<img>` ichida `alt="..."` atributi qo‘shilishi kerak. Masalan: alt="Kompyuter rasmi"' }
                  ],
                  hint: 'alt rasm haqida matn yozish uchun ishlatiladi.',
                  explanation: 'alt — rasm ochilmasa yoki accessibility uchun rasm haqida ma’lumot beradi.',
                  xp: 10
                },
                {
                  id: 'l3ex2',
                  type: 'liveedit',
                  mode: 'simple',
                  title: '2-MASHQ — <button> ga id qo‘shing 🆔',
                  instruction: 'button elementiga **id** qo‘shing. Quyidagi koddagi `<button>` tag ichiga **id="startBtn"** yozing.',
                  startCode: '<button>Bosish</button>',
                  checks: [
                    { re: '<button[^>]*\\sid="startBtn"', msg: '`<button>` ichida `id="startBtn"` bo‘lishi kerak (id va qiymat aynan shunday yozilsin)' }
                  ],
                  hint: 'id elementga yagona nom berish uchun ishlatiladi.',
                  explanation: 'id yordamida keyinchalik JavaScript elementni topishi mumkin.',
                  xp: 10
                },
                {
                  id: 'l3ex3',
                  type: 'liveedit',
                  mode: 'simple',
                  title: '3-MASHQ — <div> ga class qo‘shing 🎨',
                  instruction: 'div elementiga **class** qo‘shing. Quyidagi koddagi `<div>` tag ichiga **class="card"** yozing.',
                  startCode: '<div>Salom</div>',
                  checks: [
                    { re: '<div[^>]*\\sclass="card"', msg: '`<div>` ichida `class="card"` bo‘lishi kerak' }
                  ],
                  hint: 'class elementlarni bir xil guruhga ajratish uchun ishlatiladi.',
                  explanation: 'class keyinchalik bir nechta elementga bir xil style berish yoki ularni guruhlashda ishlatiladi.',
                  xp: 10
                }
              ],
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: 'Attribute\'ning umumiy ko‘rinishi qanday yoziladi?',
                  options: ['name="value" — opening tag ichida', 'value="name" — yopiluvchi teg ichida', 'name:value — `<style>` ichida', 'name(value) — `<body>`dan tashqarida'],
                  answer: 0,
                  explanation: 'Attribute har doim `name="value"` ko‘rinishida va faqat **ochiluvchi teg ichida** yoziladi: `<img src="photo.jpg">`.'
                },
                {
                  question: '`<img>` elementida `src` atributi nima vazifani bajaradi?',
                  options: ['Rasmga izoh beradi', 'Rasm faylining manzilini ko‘rsatadi', 'Rasmga unikal nom beradi', 'Rasmni CSS orqali bezaydi'],
                  answer: 1,
                  explanation: '`src` (source) — brauzer qaysi fayldan rasmni yuklashini aytadi: `src="photo.jpg"` yoki to‘liq URL.'
                },
                {
                  question: '`alt` atributi nima uchun kerak?',
                  options: ['Rasmni kattalashtirish uchun', 'Rasm yuklanmaganda ko‘rsatiladigan muqobil matn — accessibility uchun', 'Rasmga chegara chizish uchun', 'Rasmni tab nomida ko‘rsatish uchun'],
                  answer: 1,
                  explanation: '`alt` — rasm yuklanmasa yoki foydalanuvchi ko‘ra olmasa ko‘rsatiladigan matn. Ekran o‘quvchilari va Google ham shundan foydalanadi.'
                },
                {
                  question: '`class` va `id` orasidagi asosiy farq nima?',
                  options: ['`class` — unikal, `id` — takrorlanuvchi', 'Farqi yo‘q, ikkalasi bir xil', '`id` — sahifada faqat bitta elementga, `class` — bir nechta elementga beriladi', '`class` faqat `<div>` uchun ishlatiladi'],
                  answer: 2,
                  explanation: '`id` — unikal pasport (bir element), `class` — umumiy etiketka (ko‘p elementlar bir xil class oladi).'
                },
                {
                  question: '`title` atributi qayerda va qanday ko‘rinadi?',
                  options: ['Tab nomida doim ko‘rinadi', 'Element ustiga sichqoncha olib borilganda tooltip ko‘rinishida', 'Sahifa oxirida ro‘yxatda', 'Rasm yuklanmaganda o‘rnida'],
                  answer: 1,
                  explanation: '`title` atributi — hover qilinganda brauzer kichik izoh oynasi (tooltip) ko‘rsatadi. `<title>` tegi esa tab nomi — boshqa narsa.'
                },
                {
                  question: 'Qaysi kod bir elementda BIR NECHTA atributni to‘g‘ri ishlatadi?',
                  options: ['`<img src="a.jpg" alt="Rasm" title="Izoh">`', '`<img src="a.jpg"; alt="Rasm"; title="Izoh">`', '`<img><src="a.jpg"><alt="Rasm">`', '`<img src="a.jpg" src="b.jpg" alt="Rasm">`'],
                  answer: 0,
                  explanation: 'Atributlar probel bilan ajratiladi: `name="value" name="value" ...`. Nuqta-vergul ishlatilmaydi, bir atribut ikki marta yozilmaydi.'
                },
                {
                  question: '`<img>` qanday teg?',
                  options: ['Yopiluvchi tegi bo‘lgan oddiy teg', 'Bo‘sh teg (void element) — yopiluvchisi yo‘q', 'Faqat `<head>` ichida turadigan teg', 'CSS yozadigan teg'],
                  answer: 1,
                  explanation: '`<img>` — bo‘sh teg: kontent va yopiluvchi tegi yo‘q, barcha ma’lumot atributlarda turadi (`src`, `alt`...).'
                },
                {
                  question: 'REVIEW (1-dars): `<!DOCTYPE html>` yozuvi nima va qayerda turadi?',
                  options: ['HTML5 e’loni — har doim hujjatning birinchi qatorida', 'Sahifa nomi — head ichida', 'Kodirovka — body ichida', 'Rasm manzili — img ichida'],
                  answer: 0,
                  explanation: '1-darsdan eslang: `<!DOCTYPE html>` — "bu HTML5 hujjat" e’loni va har doim birinchi qatorda turadi.'
                },
                {
                  question: 'REVIEW (2-dars): `<title>` tegi qayerga yoziladi?',
                  options: ['`<body>` ichiga', '`<head>` ichiga', '`<img>` ichiga', 'Sahifaning oxiriga'],
                  answer: 1,
                  explanation: '2-darsdan eslang: `<title>` — ko‘rinmaydigan ma’lumot va `<head>` ichida yoziladi. `<body>` esa faqat ko‘rinadigan kontent.'
                },
                {
                  question: 'REVIEW (2-dars): foydalanuvchiga ko‘rinadigan barcha kontent qaysi teg ichida bo‘lishi kerak?',
                  options: ['`<head>`', '`<title>`', '`<body>`', '`<!DOCTYPE html>`'],
                  answer: 2,
                  explanation: '2-darsdan eslang: `<body>` — foydalanuvchiga ko‘rinadigan barcha kontent joylashadigan qism. `<head>` esa ko‘rinmaydigan ma’lumotlar uchun.'
                },
                {
                  question: '`class` atributi nima uchun kerak?',
                  options: ['Elementga guruh (umumiy) nom beradi — bir nechta elementga berish mumkin', 'Rasm manzilini ko‘rsatadi', 'Tab nomini o‘zgartiradi', 'Rasm yuklanmaganda matn ko‘rsatadi'],
                  answer: 0,
                  explanation: '`class` — elementga guruh nomi beradi. Bir xil classni bir nechta elementga berish mumkin — CSS keyin shu nom orqali ularni bezaydi.'
                }
              ]
            }
          },
          /* ==LESSON3== */

          {
            title: 'Linklar va rasmlar',
            duration: 25,
            xp: 30,
            content: {
              intro: 'Bugun saytlarning eng muhim qismini o‘rganamiz — **linklar**! Link tufayli sahifalar bir-biriga bog‘lanadi va internet "internet" bo‘ladi. Oxirida 3 ta mashq va test sizni kutmoqda. 🚀',
              quizQuestionCount: 10,
              reviewTitle: '👀 Oldingi darslardan nimalarni bilamiz?',
              review: [
                { t: 'attribute', d: 'name="value" ko‘rinishida, faqat opening tag ichida' },
                { t: 'id', d: 'Elementga yagona nom — sahifada faqat bitta' },
                { t: 'class', d: 'Elementlarga guruh nomi — bir nechta elementga beriladi' },
                { t: '<title>', d: 'Brauzer tabidagi sahifa nomi (head ichida)' },
                { t: '<body>', d: 'Foydalanuvchiga ko‘rinadigan barcha kontent' }
              ],
              sections: [
                {
                  title: '<a> — link elementi 🔗',
                  text: '**Bu nima?** `<a>` (anchor) — link (havola) yaratadigan element. Link — bosilganda boshqa sahifaga yoki joyga o‘tadigan matn.\n\n**Nima uchun kerak?** Internet shundan iborat: bitta sahifadan boshqasiga o‘tish. Link bo‘lmasa — "web" ham bo‘lmasdi.\n\n**Qayerga yoziladi?** `<body>` ichiga, boshqa ko‘rinadigan elementlar qatori.',
                  code: '<a href="https://example.com">Saytga kirish</a>',
                  codeNote: '• `<a>` — link elementi\n• `href` — manzil (qayerga o‘tish kerak)\n• `Saytga kirish` — foydalanuvchi ko‘radigan va bosadigan matn',
                  result: '"Saytga kirish" degan bosiladigan matn (odatda ko‘k va tagi chizilgan) chiqadi. Bosilganda example.com ochiladi.',
                  playground: true
                },
                {
                  title: 'href va URL 🌍',
                  text: '**href nima?** (hypertext reference) — `<a>` elementining eng muhim atributi: link **qayerga** o‘tishini ko‘rsatadi.\n\n**URL nima?** (Uniform Resource Locator) — resursning internetdagi manzili: `https://google.com`. Xuddi uy manzili kabi — brauzer shu manzil bo‘yicha sahifani topadi.\n\n**Qayerga yoziladi?** Faqat opening tag ichida: `<a href="URL">...`. Quyidagi URLni o‘zgartirib ko‘ring — kod va natija darhol yangilanadi!',
                  code: '<a href="https://google.com">Google</a>',
                  codeNote: '`href="https://google.com"` — URL qo‘shtirnoq ichida. Matn (`Google`) esa foydalanuvchi ko‘radigan qism.',
                  result: '"Google" linki chiqadi. Bosilganda brauzer google.com sahifasiga o‘tadi.',
                  liveDemo: {
                    code: '<a href="https://example.com"\n   id="demoLink">\n   Mening saytim\n</a>\n\n<p>Yuqoridagi koddagi href va matnni o‘zgartirib, ▶ RUN bosing 👆</p>'
                  },
                  playground: true
                },
                {
                  title: 'Tashqi va ichki link 🔀',
                  text: 'Linklar 2 xil bo‘ladi:\n\n• **Tashqi link** — boshqa saytga o‘tadi. href ichida **to‘liq URL** yoziladi: `https://example.com`.\n• **Ichki link** — bir xil sayt ICHIDAGI boshqa sahifaga o‘tadi. href ichida **fayl nomi** yoziladi: `about.html`.\n\n**Qachon qaysi biri?** Saytdan tashqariga chiqish kerak bo‘lsa — tashqi (`https://...`). O‘z saytingizning sahifalari orasida harakat uchun — ichki (`about.html`, `contact.html`).',
                  code: '<!-- Tashqi link — boshqa saytga -->\n<a href="https://example.com">Tashqi sayt</a>\n\n<!-- Ichki link — o‘z saytimizdagi sahifaga -->\n<a href="about.html">Men haqimda</a>',
                  codeNote: '`https://` bilan boshlansa — tashqi. Faqat fayl nomi bo‘lsa (`about.html`) — ichki: brauzer shu faylni shu saytdan qidiradi.',
                  result: 'Ikkala link ham chiqadi. Birinchisi boshqa saytga, ikkinchisi o‘z saytdagi about.html sahifasiga o‘tadi.',
                  note: 'Ichki linkda `https://` yozmang — u allaqachon sizning saytingizda!',
                  playground: true
                },
                {
                  title: 'target="_blank" — yangi tabda ochish 🗂️',
                  text: '**target nima?** Link **qayerda ochilishini** bildiradigan atribut.\n\n**"_blank" nima?** target‘ning qiymati: "yangi, bo‘sh tabda och". Default holatda (target yozilmasa) link o‘sha tabda ochiladi va sahifa almashtiriladi. `target="_blank"` bilan esa yangi tab ochiladi va sizning sahifangiz ochiq qoladi.\n\n**Qachon kerak?** Tashqi saytga o‘tkazmoqchi bo‘lsa — foydalanuvchi sizning sahifangizni yo‘qotmasligi uchun.',
                  code: '<a href="https://example.com" target="_blank">\n    Yangi tabda ochish\n</a>',
                  codeNote: '• `target` — qayerda ochilishini bildiradigan atribut\n• `"_blank"` — yangi tabda och',
                  result: 'Link bosilganda example.com **yangi tabda** ochiladi, sizning sahifa tab qoladi.',
                  playground: true
                },
                {
                  title: 'Email va telefon linklari 📧📞',
                  text: 'href faqat saytlarga olib bormaydi:\n\n• **`mailto:`** — bosilganda foydalanuvchining email dasturi ochilib, tayyor xat yaratadi. Kontakt sahifalarida ishlatiladi.\n• **`tel:`** — bosilganda qo‘ng‘iroq qilishni boshlaydi (ayniqsa telefonda qulay!).',
                  code: '<a href="mailto:test@example.com">\n    Email yuborish\n</a>\n\n<a href="tel:+998901234567">\n    Qo‘ng‘iroq qilish\n</a>',
                  codeNote: '`mailto:` dan keyin email manzil, `tel:` dan keyin telefon raqam (+ bilan) yoziladi. Bu — URLning boshqa turlari, xuddi `https://` kabi.',
                  result: 'Kompyuterda "Email yuborish" bosilganda pochtachi dastur ochiladi. Telefonda "Qo‘ng‘iroq qilish" bosilganda chaqiruv boshlanadi.',
                  playground: true
                },
                {
                  title: 'Page anchor — sahifa ichida sakrash ⚓',
                  text: 'Uzun sahifada bir bo‘limga tez o‘tish kerak bo‘ladi. Buning uchun **anchor** ishlatiladi:\n\n1. Bog‘lanadigan bo‘limga `id` beramiz: `<section id="contact">`\n2. Link href‘ida o‘sha idni `#` bilan yozamiz: `href="#contact"`\n\n`#contact` va `id="contact"` aynan shu tarzda bir-biriga bog‘lanadi: `#` dan keyingi so‘z = sahifadagi elementning id si.',
                  code: '<a href="#contact">Kontaktga o\'tish</a>\n\n<section id="contact">\n    <h2>Kontakt</h2>\n</section>',
                  codeNote: '• `href="#contact"` — "sahifadagi contact id li elementga o‘t"\n• `id="contact"` — anchor‘ning bog‘lanish nuqtasi\n`#` belgisi "shu sahifada" degani.',
                  result: 'Link bosilganda sahifa avtomatik "Kontakt" bo‘limiga scroll qiladi.',
                  playground: true
                },
                {
                  title: '⚡ JavaScript: link bosilishini boshqarish',
                  text: 'Endi juda kichik **JavaScript** ta’siri — faqat link bilan bog‘liq qismi! 😄\n\nLink bosilganda JavaScript ishlatib biror ish qilish mumkin. Quyidagi kodda link bosilganda alert chiqadi:\n\n• `document.getElementById("helloLink")` → id bo‘yicha elementni topadi\n• `addEventListener("click", ...)` → bosish eventiga javob beradi\n• `event.preventDefault()` → linkning default harakatini (o‘tishni) vaqtincha to‘xtatadi\n• `alert(...)` → kichik xabar oynasi chiqaradi\n\nBu — faqat tanishuv. JavaScript‘ni alohida kursda chuqur o‘rganamiz!',
                  code: '<a href="#" id="helloLink">Bosib ko‘r</a>\n\n<script>\nconst link = document.getElementById("helloLink");\n\nlink.addEventListener("click", function(event) {\n    event.preventDefault();\n    alert("Link bosildi!");\n});\n</script>',
                  codeNote: '`"click"` — user linkni bosganda ishlaydigan event. `preventDefault()` bo‘lmasa link `#` ga o‘tib ketardi.',
                  result: 'Link bosilganda sahifa o‘zgarmaydi — faqat "Link bosildi!" alerti chiqadi.',
                  playground: true
                }
              ],
              keyPoints: [
                '`<a>` — link elementi, `<body>` ichida yoziladi',
                '`href` — link manzili (URL), opening tag ichida',
                'Tashqi link: `href="https://..."` · Ichki link: `href="about.html"`',
                '`target="_blank"` — yangi tabda ochish',
                '`mailto:` — email, `tel:` — qo‘ng‘iroq linklari',
                '`href="#id"` + `id="..."` — sahifa ichida sakrash (anchor)',
                'JS: `getElementById` element topadi, `addEventListener("click",...)` bosishni ushlaydi, `preventDefault()` default harakatni to‘xtatadi'
              ],
              motivationTitle: '🚀 KEYINGI DARS: 5-DARS',
              motivation: '**Ro‘yxatlar bilan ishlaymiz!** 📋\n\n• 🔢 tartibli va tartibsiz ro‘yxatlar\n• 📝 `ul`, `ol`, `li` teglari\n\nSahifalaringiz endi **bog‘lana boshlaydi** — real web shunday paydo bo‘ladi! 😎',
              exercises: [
                {
                  id: 'l4ex1',
                  type: 'liveedit',
                  mode: 'simple',
                  title: '1-MASHQ — Google ga link yarating 🔗',
                  instruction: 'Link yaratishingiz kerak: `<a>` tag ichiga **href="https://google.com"** atributini qo‘shing.',
                  startCode: '<a>Saytga kirish</a>',
                  checks: [
                    { re: '<a[^>]*href="https:\\/\\/(www\\.)?google\\.com"', msg: '`<a>` ichida `href="https://google.com"` bo‘lishi kerak' }
                  ],
                  hint: 'href — link manzili. Uni opening tag ichida yozing: <a href="...">',
                  explanation: '`href` — link qayerga o‘tishini ko‘rsatadi. To‘liq URL `https://` bilan boshlanadi.',
                  xp: 10
                },
                {
                  id: 'l4ex2',
                  type: 'liveedit',
                  mode: 'simple',
                  title: '2-MASHQ — Yangi tabda ochiladigan link 🗂️',
                  instruction: 'Linkni **yangi tabda** ochiladigan qiling: `<a>` tag ichiga **target="_blank"** atributini qo‘shing.',
                  startCode: '<a href="https://example.com">Yangi tabda ochish</a>',
                  checks: [
                    { re: '<a[^>]*href="https:\\/\\/example\\.com"', msg: '`href="https://example.com"` saqlangan bo‘lishi kerak' },
                    { re: '<a[^>]*target="_blank"', msg: '`<a>` ichida `target="_blank"` atributi bo‘lishi kerak' }
                  ],
                  hint: 'target atributining qiymati _blank bo‘lsa — link yangi tabda ochiladi.',
                  explanation: '`target="_blank"` — link yangi tabda ochiladi va joriy sahifa ochiq qoladi.',
                  xp: 10
                },
                {
                  id: 'l4ex3',
                  type: 'liveedit',
                  mode: 'simple',
                  title: '3-MASHQ — Anchor bilan Kontakt bo‘limiga o‘tish ⚓',
                  instruction: 'Link **Kontakt bo‘limiga** o‘tsin: linkdagi `href="#"` ni **href="#contact"** ga o‘zgartiring (pastda `id="contact"` li section bor).',
                  startCode: '<a href="#">Kontaktga o‘tish</a>\n\n<section id="contact">\n    <h2>Kontakt</h2>\n</section>',
                  checks: [
                    { re: '<a[^>]*href="#contact"', msg: '`href="#contact"` bo‘lishi kerak — # dan keyin section id si yoziladi' },
                    { re: 'id="contact"', msg: '`id="contact"` li section saqlangan bo‘lishi kerak' }
                  ],
                  hint: '# dan keyingi so‘z sahifadagi elementning id si bo‘lishi kerak: href="#contact"',
                  explanation: '`href="#contact"` va `id="contact"` bir-biriga bog‘lanadi — link bosilganda sahifa shu bo‘limga scroll qiladi.',
                  xp: 10
                },
                {
                  id: 'l4js',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — JS Mini Challenge ⚡',
                  instruction: 'Link bosilganda **"Salom!"** alert chiqarsin: `<script>` ichidagi comment o‘rniga darsda o‘rgangan JavaScript kodini yozing.',
                  startCode: '<a href="#" id="testLink">Bos</a>\n\n<script>\n// Bu yerga JavaScript yozing\n</script>',
                  checks: [
                    { re: 'id="testLink"', msg: '`id="testLink"` saqlangan bo‘lishi kerak' },
                    { re: 'addEventListener\\(\\s*[\'"]click', msg: '`addEventListener("click", ...)` ishlatilishi kerak' },
                    { re: 'alert\\(\\s*[\'"]Salom![\'"]\\s*\\)', msg: '`alert("Salom!")` chaqirilishi kerak — aynan shu matn bilan' }
                  ],
                  hint: 'const link = document.getElementById("testLink"); keyin link.addEventListener("click", function(event) { ... }); ichida alert("Salom!")',
                  explanation: 'Rahmat! Bu faqat kichik ta’sir edi — JavaScript‘ni alohida kursda chuqur o‘rganamiz. 🚀',
                  xp: 10
                }
              ]
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: 'Link yaratish uchun qaysi element ishlatiladi?',
                  options: ['`<link>`', '`<a>`', '`<nav>`', '`<href>`'],
                  answer: 1,
                  explanation: '`<a>` (anchor) — link elementi. `<link>` esa head ichida ishlatiladigan boshqa teg.'
                },
                {
                  question: '`href` atributi nima vazifani bajaradi?',
                  options: ['Link matnini rangini o‘zgartiradi', 'Linkning qayerga o‘tishini (manzilini) ko‘rsatadi', 'Linkni yangi tabda ochadi', 'Linkni noqiladigan qiladi'],
                  answer: 1,
                  explanation: '`href` (hypertext reference) — linkning manzili: `<a href="URL">`.'
                },
                {
                  question: 'Qaysi kod ichki (o‘z saytdagi sahifaga) link yaratadi?',
                  options: ['`<a href="https://google.com">Google</a>`', '`<a href="about.html">Men haqimda</a>`', '`<a href="mailto:x@y.com">Yozish</a>`', '`<a href="tel:+99890">Qo‘ng‘iroq</a>`'],
                  answer: 1,
                  explanation: 'Ichki link — faqat fayl nomi: `about.html`. `https://` bilan boshlanishi tashqi link, `mailto:` va `tel:` esa boshqa tur URL‘lar.'
                },
                {
                  question: '`target="_blank"` nimani bildiradi?',
                  options: ['Link o‘sha tabda ochiladi', 'Link yangi tabda ochiladi', 'Link o‘chib qoladi', 'Sahifa oxiriga scroll qiladi'],
                  answer: 1,
                  explanation: '`target="_blank"` — link **yangi tabda** ochiladi, joriy sahifa ochiq qoladi.'
                },
                {
                  question: 'Email yuborish linki qanday yoziladi?',
                  options: ['`<a href="email:x@y.com">`', '`<a href="mailto:x@y.com">`', '`<a href="mail:x@y.com">`', '`<a mail="x@y.com">`'],
                  answer: 1,
                  explanation: '`mailto:` URL turi: `href="mailto:email@manzil.com"` — bosilganda pochta dasturi ochiladi.'
                },
                {
                  question: 'Telefon raqamiga qo‘ng‘iroq linki qanday yoziladi?',
                  options: ['`<a href="tel:+998901234567">`', '`<a href="phone:+998901234567">`', '`<a call="+998901234567">`', '`<a href="#tel">`'],
                  answer: 0,
                  explanation: '`tel:` URL turi — bosilganda (ayniqsa telefonda) qo‘ng‘iroq boshlanadi.'
                },
                {
                  question: '`href="#contact"` linki nimaga olib boradi?',
                  options: ['contact.html sahifasiga', 'Tashqi saytga', 'Shu sahifadagi `id="contact"` li elementga', 'Yangi tabda bo‘sh sahifaga'],
                  answer: 2,
                  explanation: '`#` bilan boshlangan href — anchor: shu sahifadagi mos `id` li elementga scroll qiladi.'
                },
                {
                  question: 'JavaScriptda elementni id bo‘yicha topish funksiyasi qaysi?',
                  options: ['`document.querySelector()`', '`document.getElementById("x")`', '`element.find("x")`', '`window.top("x")`'],
                  answer: 1,
                  explanation: '`document.getElementById("x")` — id bo‘yicha elementni topadi (darsda link bosilishini ushlash uchun ishlatdik).'
                },
                {
                  question: 'REVIEW (1-dars): `<!DOCTYPE html>` yozuvi nima va qayerda turadi?',
                  options: ['HTML5 e’loni — har doim hujjatning birinchi qatorida', 'Sahifa nomi — head ichida', 'Kodirovka — body ichida', 'Rasm manzili — img ichida'],
                  answer: 0,
                  explanation: '1-darsdan eslang: `<!DOCTYPE html>` — "bu HTML5 hujjat" e’loni va har doim birinchi qatorda turadi.'
                },
                {
                  question: 'REVIEW (3-dars): atributning to‘g‘ri yozilish qaysi?',
                  options: ['`href->https://x.com`', '`href:https://x.com`', '`href="https://x.com"` — opening tag ichida', '`<href>https://x.com</href>`'],
                  answer: 2,
                  explanation: '3-darsdan eslang: atribut har doim `name="value"` ko‘rinishida va faqat ochiluvchi teg ichida yoziladi.'
                }
              ]
            }
          },
          /* ==LESSON5== */
          {
            title: 'Birinchi katta mini-loyiham',
            duration: 35,
            xp: 50,
            content: {
              intro: 'Bugun boshqa dars! 🚀 1–4-darslarda o‘rgangan barcha bilimlaringizni qaytarib, 7 ta mini-o‘yin o‘ynab, oxirida o‘zingizning **BIRINCHI haqiqiy web-saytingizni** — portfoliongizni yaratasiz! Bu darsda test emas — **LOYIHA** asosiy baholash.',
              reviewTitle: '🔁 1–4-DARSLARNI ESLAYMIZ',
              review: [
                { t: '<h1> / <p>', d: 'Katta sarlavha va paragraf — matn tuzilmasi' },
                { t: '<!DOCTYPE html>', d: 'HTML5 e’loni — har doim birinchi qator' },
                { t: 'alt', d: 'Rasm tavsifi — rasm yuklanmasa ko‘rinadi' },
                { t: 'id / class', d: 'Yagona nom / guruhlash uchun nom' },
                { t: '<a href>', d: 'Link — sahifalarni bir-biriga bog‘lash' }
              ],
              sections: [
                {
                  title: 'REVIEW 1 — HTML asoslari 📦',
                  text: '**HTML nima?** Sahifaning **tuzilmasini** yaratadigan belgilash tili.\n\n• **Tag** — burchakli qavs ichidagi buyruq: `<p>`\n• **Element** — to‘liq juftlik: `<p>Salom</p>`\n• `<h1>` — eng katta sarlavha, `<p>` — paragraf, `<body>` — ko‘rinadigan kontent\n\n**Nima uchun kerak?** HTML bo‘lmasa — sahifa ham bo‘lmaydi. Har bir sayt elementlardan iborat!',
                  code: '<h1>Salom dunyo</h1>\n<p>Men web dasturlashni o‘rganyapman.</p>',
                  result: 'Katta sarlavha + ostida oddiy matn.',
                  playground: true
                },
                {
                  title: 'REVIEW 2 — HTML document skeleton 🦴',
                  text: 'Har bir sahifa bir xil **skelet** bilan boshlanadi:',
                  code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Mening sahifam</title>\n</head>\n<body>\n  <h1>Salom!</h1>\n  <p>Bu mening birinchi sahifam.</p>\n</body>\n</html>',
                  codeNote: '`<!DOCTYPE html>` — HTML5 e’loni · `<head>` — brauzer uchun ma’lumot (`<title>` bilan) · `<body>` — foydalanuvchiga ko‘rinadigan hammasi.',
                  result: 'Brauzer tabida «Mening sahifam», sahifada sarlavha + paragraf.',
                  playground: true
                },
                {
                  title: 'REVIEW 3 — Attributes 🏷️',
                  text: 'Atributlar elementga **qo‘shimcha xususiyat** beradi:\n\n• `src` — rasm manzili · `alt` — rasm tavsifi\n• `id` — yagona nom (sahifada bitta) · `class` — guruh nomi (ko‘p marta)\n• `title` — hover qilsangiz chiqadigan izoh',
                  code: '<img src="kompyuter.jpg" alt="Kompyuter rasmi">\n<button id="startBtn">Bosish</button>\n<div class="card">Salom</div>',
                  result: 'Rasm (tavsif bilan), bosiladigan tugma va kartochka.',
                  playground: true
                },
                {
                  title: 'REVIEW 4 — Links 🔗',
                  text: '`<a>` + `href` — link:\n\n• `href="https://..."` — boshqa saytga\n• `target="_blank"` — yangi tabda ochish\n• `mailto:` — email · `tel:` — telefon\n• `href="#id"` — sahifa ichida sakrash',
                  code: '<a href="https://google.com" target="_blank">\n  Google\n</a>\n<a href="mailto:salom@mail.com">Yozish</a>\n<a href="#contact">Aloqaga o‘tish</a>',
                  result: 'Bosiladigan linklar — tashqi saytga, emailga va aloqa bo‘limiga o‘tadi.',
                  playground: true
                },
                {
                  title: '🎨 CSS — sahifani bezaydi',
                  text: 'HTML sahifani **yaratadi**, CSS esa uni **bezaydi**.\n\nCSS bo‘lmasa — sahifa bor, lekin juda oddiy ko‘rinadi: oddiy oq fon, oddiy matn, oddiy tugma. CSS qo‘shilsa — dark fon, chiroyli kartalar, yumaloq burchaklar, gradient tugmalar!\n\n**HTML — tuzilma** · **CSS — ko‘rinish**',
                  code: '<!-- 1) HTML ONLY — oddiy ko‘rinish -->\n<h1>Men haqimda</h1>\n<p>Men dasturchi bo‘lishni o‘rganyapman.</p>\n<button>Bosish</button>\n\n<!-- 2) WITH CSS — chiroyli ko‘rinish -->\n<style>\nbody {\n  font-family: Arial;\n  background: #111827;\n  color: white;\n}\n.card {\n  padding: 20px;\n  border-radius: 16px;\n  background: #1f2937;\n}\n</style>',
                  codeNote: '`body { ... }` — butun sahifaga, `.card { ... }` — class="card" li elementlarga ta’sir qiladi.',
                  result: 'Quyidagi «Bir sahifa, uch xil holat» demoda uchalasini jonli ko‘ring 👇',
                  playground: true
                },
                {
                  title: '⚡ JavaScript — sahifaga harakat beradi',
                  text: 'JavaScript sahifaga **interaktivlik** beradi.\n\nTugma bosilganda **hech narsa bo‘lmasa** — bu shunchaki HTML. Bosilganda **alert chiqsa** — bu JavaScript!\n\nHar qatorni ko‘ramiz:\n• `const button` — o‘zgaruvchi: elementni saqlab qo‘yamiz\n• `document.getElementById("helloBtn")` — id bo‘yicha elementni topadi\n• `addEventListener("click", ...)` — bosish eventini ushlaydi\n• `function() { ... }` — bosilganda bajariladigan kod',
                  code: '<button id="helloBtn">Bosish</button>\n\n<script>\nconst button = document.getElementById("helloBtn");\n\nbutton.addEventListener("click", function() {\n  alert("Salom!");\n});\n</script>',
                  result: 'Tugma bosilganda «Salom!» alerti chiqadi. Quyidagi tugma — aynan shu JS bilan ishlaydi 👇',
                  playground: true,
                  demoButton: { label: '⚡ Bosib ko‘r — alert!', msg: 'Salom! Bu JavaScript ishlayapti 🚀' }
                },
                {
                  title: '🚀 ENDI O‘ZING YARAT',
                  text: 'Sen **HTML** tuzilmasini bilasan.\n**CSS** sahifani chiroyli qilishini ko‘rding.\n**JavaScript** sahifaga harakat berishini ko‘rding.\n\nEndi uchalasini **birlashtiramiz** — o‘zining birinchi haqiqiy web-saytini yaratamiz! 💪\n\nYo‘l xaritasi:\n1️⃣ Qaytaramiz (yuqorida tugadi)\n2️⃣ Uch xil holatni ko‘ramiz\n3️⃣ 7 ta mini-o‘yin o‘ynaymiz\n4️⃣ 🏆 BIRINCHI PORTFOLIO SAYTINI YARATAMIZ'
                }
              ],
              triDemo: {
                title: '🎛 BIR SAHIFA, UCH XIL HOLAT',
                tabs: ['1) HTML ONLY', '2) + CSS', '3) + JAVASCRIPT'],
                htmlOnly: '<h1>Men haqimda</h1>\n<p>Men dasturchi bo‘lishni o‘rganyapman.</p>\n<button>Bosish</button>',
                withCss: '<style>\nbody { font-family: Arial; background: #111827; color: white; text-align: center; padding: 30px; }\nh1 { color: #818cf8; }\nbutton { padding: 12px 24px; border-radius: 12px; border: none; background: #6366f1; color: white; font-size: 16px; }\n</style>\n\n<h1>Men haqimda</h1>\n<p>Men dasturchi bo‘lishni o‘rganyapman.</p>\n<button>Bosish</button>',
                withJs: '<style>\nbody { font-family: Arial; background: #111827; color: white; text-align: center; padding: 30px; }\nh1 { color: #818cf8; }\nbutton { padding: 12px 24px; border-radius: 12px; border: none; background: #6366f1; color: white; font-size: 16px; cursor: pointer; }\n</style>\n\n<h1>Men haqimda</h1>\n<p>Men dasturchi bo‘lishni o‘rganyapman.</p>\n<button id="hiBtn">Bosish</button>\n\n<script>\nconst btn = document.getElementById("hiBtn");\nbtn.addEventListener("click", function() {\n  btn.textContent = "Bosildi! ✅";\n});\n</script>'
              },
              keyPoints: [
                '**HTML = tuzilma** · **CSS = dizayn** · **JS = interaktivlik**',
                'Har bir sahifa skeletdan boshlanadi: `<!DOCTYPE html>` → `<html>` → `<head>` → `<body>`',
                'Atributlar: `src`, `alt`, `id`, `class`, `title` — opening tag ichida `name="value"`',
                'Linklar: `<a href>` + `target="_blank"` / `mailto:` / `tel:` / `#id`',
                'JS: `getElementById` topadi · `addEventListener("click", ...)` ushlaydi · `function()` bajaradi',
                'Bu darsda test YO‘Q — asosiy baholash LOYIHA: 🚀 My First Portfolio'
              ],
              gamesTitle: '🎮 7 TA MINI-O‘YIN — BILIMNI MUSTAHKAMLAYMIZ',
              games: [
                { id: 'bughunter', icon: '🐛', title: 'Bug Hunter', desc: 'Koddagi xatoni top', xp: 10 },
                { id: 'build', icon: '🧱', title: 'Build the HTML', desc: 'Teglarni to‘g‘ri tartibga qo‘y (quyida — Amaliy topshiriqlarda)', xp: 10, exercise: 'l5build' },
                { id: 'memory', icon: '🧠', title: 'Memory Code', desc: 'Tag va ma’no juftligini top', xp: 10 },
                { id: 'runner', icon: '🏃', title: 'Code Runner', desc: 'To‘g‘ri javob — oldinga yur!', xp: 10 },
                { id: 'sixty', icon: '⚡', title: '60 Seconds', desc: '60 soniyada maksimal to‘g‘ri javob', xp: 10 },
                { id: 'streak', icon: '🔥', title: 'Streak Fire', desc: 'Ketma-ket 7 ta to‘g‘ri javob', xp: 10 },
                { id: 'duel', icon: '⚔️', title: 'Code Duel', desc: 'Botga qarshi tezlik dueli (2 player rejimi tayyor)', xp: 10 }
              ],
              gamesData: {
                bugHunterRounds: [
                  {
                    code: '<img src="rasm.jpg">', prompt: 'Bu kodda nimani unutdik?', gaps: [
                      { label: 'alt="Rasm tavsifi"', ok: true, hint: '' },
                      { label: 'id="rasm"', ok: false, hint: 'id — shart emas, bu faqat yagona nom beradi' },
                      { label: 'class="rasm"', ok: false, hint: 'class — shart emas, bu guruhlash uchun' }
                    ]
                  },
                  {
                    code: '<a>Google</a>', prompt: 'Link ishlamayapti! Nima yetishmayapti?', gaps: [
                      { label: 'href="https://google.com"', ok: true, hint: '' },
                      { label: 'target="_blank"', ok: false, hint: 'target — faqat yangi tabda ochish uchun, link ishlashi uchun shart emas' },
                      { label: 'alt="Google"', ok: false, hint: 'alt — rasm atributi, linkda ishlamaydi' }
                    ]
                  },
                  {
                    code: '<img alt="Kompyuter rasmi">', prompt: 'Rasm ekranda ko‘rinmayapti! Nima yetishmayapti?', gaps: [
                      { label: 'src="kompyuter.jpg"', ok: true, hint: '' },
                      { label: 'href="kompyuter.jpg"', ok: false, hint: 'href — link atributi, rasmda ishlamaydi' },
                      { label: 'title="Rasm"', ok: false, hint: 'title — faqat hover izohi, rasmni yuklamaydi' }
                    ]
                  }
                ],
                memoryPairs: [
                  ['<h1>', 'Sarlavha'],
                  ['<img>', 'Rasm'],
                  ['<a>', 'Link'],
                  ['alt', 'Rasm tavsifi'],
                  ['id', 'Yagona nom'],
                  ['class', 'Guruhlash']
                ],
                runnerQuestions: [
                  { q: 'Rasmga alternativ matn berish uchun qaysi atribut?', o: ['src', 'alt', 'id', 'title'], a: 1 },
                  { q: 'Link manzili qaysi atributda yoziladi?', o: ['href', 'alt', 'class', 'src'], a: 0 },
                  { q: 'Eng katta sarlavha tegi qaysi?', o: ['<h6>', '<p>', '<h1>', '<title>'], a: 2 },
                  { q: 'Sahifada faqat bitta bo‘lishi kerak bo‘lgan atribut?', o: ['class', 'id', 'alt', 'src'], a: 1 },
                  { q: 'Foydalanuvchiga ko‘rinadigan kontent qayerda turadi?', o: ['<head>', '<title>', '<body>', '<!DOCTYPE>'], a: 2 },
                  { q: 'Linkni yangi tabda ochish uchun nima yoziladi?', o: ['target="_self"', 'target="_blank"', 'href="_blank"', 'new="tab"'], a: 1 }
                ],
                sixtyQuestions: [
                  { q: '<h1> nima?', o: ['Sarlavha', 'Paragraf', 'Rasm', 'Link'], a: 0 },
                  { q: '<p> nima?', o: ['Rasm', 'Paragraf', 'Tugma', 'Sarlavha'], a: 1 },
                  { q: '<img> nima?', o: ['Link', 'Rasm', 'Matn', 'Jadval'], a: 1 },
                  { q: 'alt nimani beradi?', o: ['Rasm tavsifi', 'Manzil', 'Nom', 'Rang'], a: 0 },
                  { q: 'id nima?', o: ['Guruh nomi', 'Yagona nom', 'Link', 'Tavsif'], a: 1 },
                  { q: 'class nima?', o: ['Yagona nom', 'Rasm', 'Guruhlash', 'Manzil'], a: 2 },
                  { q: '<a> nima?', o: ['Sarlavha', 'Rasm', 'Link', 'Paragraf'], a: 2 },
                  { q: 'href nima?', o: ['Link manzili', 'Rasm manzili', 'Tavsif', 'Nom'], a: 0 },
                  { q: 'CSS nima qiladi?', o: ['Tuzilma beradi', 'Sahifani bezaydi', 'Interaktivlik beradi', 'Ma’lumot saqlaydi'], a: 1 },
                  { q: 'JavaScript nima qiladi?', o: ['Bezaydi', 'Tuzilma beradi', 'Interaktivlik beradi', 'Hech narsa'], a: 2 },
                  { q: '<!DOCTYPE html> nima?', o: ['Sarlavha', 'HTML5 e’loni', 'Rasm', 'Link'], a: 1 },
                  { q: '<title> qayerda ko‘rinadi?', o: ['Sahifada', 'Brauzer tabida', 'Rasmda', 'Tugmada'], a: 1 },
                  { q: 'target="_blank" nima qiladi?', o: ['O‘sha tabda ochadi', 'Yangi tabda ochadi', 'O‘chiradi', 'Saqlaydi'], a: 1 },
                  { q: 'mailto: nimaga olib boradi?', o: ['Saytga', 'Emailga', 'Telefonga', 'Rasmga'], a: 1 }
                ],
                streakQuestions: [
                  { q: 'Katta sarlavha uchun teg?', o: ['<p>', '<h1>', '<a>', '<img>'], a: 1 },
                  { q: 'Paragraf uchun teg?', o: ['<p>', '<h1>', '<div>', '<a>'], a: 0 },
                  { q: 'Rasm tegi?', o: ['<a>', '<img>', '<p>', '<h1>'], a: 1 },
                  { q: 'Rasm tavsifi atributi?', o: ['src', 'alt', 'id', 'class'], a: 1 },
                  { q: 'Yagona nom atributi?', o: ['class', 'id', 'alt', 'src'], a: 1 },
                  { q: 'Guruhlash atributi?', o: ['id', 'class', 'href', 'title'], a: 1 },
                  { q: 'Link tegi?', o: ['<a>', '<p>', '<img>', '<h1>'], a: 0 },
                  { q: 'Link manzili atributi?', o: ['src', 'alt', 'href', 'id'], a: 2 },
                  { q: 'Yangi tabda ochish?', o: ['target="_blank"', 'target="_self"', 'href="#top"', 'alt="tab"'], a: 0 },
                  { q: 'Sahifani bezaydigan til?', o: ['HTML', 'CSS', 'JS', 'SQL'], a: 1 }
                ],
                duelQuestions: [
                  { q: 'Rasmga tavsif beruvchi atribut?', o: ['alt', 'src', 'id', 'title'], a: 0 },
                  { q: 'Link manzili qaysi atributda?', o: ['class', 'href', 'alt', 'src'], a: 1 },
                  { q: 'Eng katta sarlavha?', o: ['<h6>', '<p>', '<h1>', '<title>'], a: 2 },
                  { q: 'Sahifada yagona nom?', o: ['class', 'id', 'alt', 'title'], a: 1 },
                  { q: 'Ko‘rinadigan kontent qayerda?', o: ['<head>', '<title>', '<body>', '<html>'], a: 2 },
                  { q: 'Interaktivlik beruvchi til?', o: ['HTML', 'CSS', 'JavaScript', 'SQL'], a: 2 }
                ]
              },
              project: {
                title: '🚀 MY FIRST PORTFOLIO',
                subtitle: 'Mening birinchi portfolio saytim',
                xp: 100,
                coins: 50,
                intro: 'Quyida 10 ta bosqich. Har bosqichda «💻 Codingda davom etish» bosib, kodni real Coding Playgroundda (HTML / CSS / JS — 3 ta tab) sinab ko‘ring. Keyin pastdagi LOYIHA editorida to‘liq sahifani yig‘ib, checklistni 100% ga yetkazing!',
                steps: [
                  { title: 'STEP 1 — HTML skeleton', note: 'Har bir sayt skeletdan boshlanadi.', addHtml: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Men haqimda</title>\n</head>\n<body>\n' },
                  { title: 'STEP 2 — Header', note: 'Isming va kasbing.', addHtml: '  <header id="top">\n    <h1>Ali Valiyev</h1>\n    <p>Junior Web Developer</p>\n  </header>\n' },
                  { title: 'STEP 3 — About', note: 'O‘zing haqingda qisqa matn.', addHtml: '  <section id="about" class="card">\n    <h2>Men haqimda</h2>\n    <p>Salom! Men web dasturlashni o‘rganayapman. Bu — mening birinchi portfolio saytim.</p>\n  </section>\n' },
                  { title: 'STEP 4 — Image + alt', note: 'Avatar rasmi — alt atributini unutma!', addHtml: '  <img class="avatar" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar-progressive.svg/120px-OOjs_UI_icon_userAvatar-progressive.svg.png" alt="Mening avatarm">\n' },
                  { title: 'STEP 5 — Skills', note: 'Uchta ko‘nikma ro‘yxati.', addHtml: '  <section id="skills" class="card">\n    <h2>Skills</h2>\n    <ul>\n      <li class="skill">HTML</li>\n      <li class="skill">CSS</li>\n      <li class="skill">JavaScript</li>\n    </ul>\n  </section>\n' },
                  { title: 'STEP 6 — Projects', note: '2 ta kichik loyiha.', addHtml: '  <section id="projects" class="card">\n    <h2>Loyihalar</h2>\n    <div class="project">1. Birinchi sahifam — <a href="https://example.com" target="_blank">ko‘rish</a></div>\n    <div class="project">2. Linklar darsi — <a href="https://example.com" target="_blank">ko‘rish</a></div>\n  </section>\n' },
                  { title: 'STEP 7 — Links', note: 'Tashqi link + target="_blank".', addHtml: '  <p><a href="https://google.com" target="_blank">Google</a> — mening sevimli qidiruv tizimi.</p>\n' },
                  { title: 'STEP 8 — Contact + id', note: 'Aloqa bo‘limi — id="contact" anchor bilan.', addHtml: '  <section id="contact" class="card">\n    <h2>Aloqa</h2>\n    <p>Email: <a href="mailto:ali@example.com">ali@example.com</a></p>\n    <p>Telefon: <a href="tel:+998901234567">+998 90 123 45 67</a></p>\n    <button id="contactBtn">Men bilan bog‘lanish</button>\n  </section>\n</body>\n</html>' },
                  { title: 'STEP 9 — CSS styling', note: 'HTML tuzilma bor — endi uni bezaymiz: dark fon, card, rounded, gradient.', addCss: 'body { font-family: Arial; background: #111827; color: white; margin: 0; padding: 16px; }\nheader, .card { max-width: 640px; margin: 20px auto; padding: 24px; background: #1f2937; border-radius: 16px; }\nheader { text-align: center; background: linear-gradient(135deg, #312e81, #1f2937); }\n.avatar { width: 110px; height: 110px; border-radius: 50%; }\nnav a { display: inline-block; margin: 6px; padding: 8px 14px; background: #6366f1; color: white; border-radius: 10px; text-decoration: none; }\n.skill { display: inline-block; margin: 6px; padding: 8px 14px; background: #312e81; border-radius: 10px; }\nbutton { margin-top: 10px; padding: 12px 22px; border: none; border-radius: 12px; background: linear-gradient(90deg, #6366f1, #06b6d4); color: white; font-size: 16px; cursor: pointer; }' },
                  { title: 'STEP 10 — JavaScript interaction', note: 'Tugma bosilganda interaktivlik!', addJs: 'const btn = document.getElementById("contactBtn");\nbtn.addEventListener("click", function () {\n  alert("Salom! Men bilan bog‘laning: ali@example.com");\n});' }
                ],
                checklist: [
                  { id: 'skeleton', label: 'HTML skeleton', re: '<!DOCTYPE html>', msg: '`<!DOCTYPE html>` qatorini sahifa boshiga qo‘shing' },
                  { id: 'header', label: 'Header', re: '<header[\\s\\S]*<\\/header>', msg: '<header> ... </header> bo‘limi kerak' },
                  { id: 'h1', label: 'h1 sarlavha', re: '<h1[\\s>][\\s\\S]*<\\/h1>', msg: '<h1>...</h1> sarlavha qo‘shing' },
                  { id: 'p', label: 'p paragraf', re: '<p[\\s>][\\s\\S]*<\\/p>', msg: '<p>...</p> paragraf qo‘shing' },
                  { id: 'imgalt', label: 'img + alt', re: '<img[^>]*alt="[^"]+"', msg: '<img> ga alt="..." atributi qo‘shing' },
                  { id: 'links', label: 'a + href', re: '<a[^>]*href="[^"]+"', msg: '<a href="..."> link qo‘shing' },
                  { id: 'id', label: 'id atribut', re: 'id="[^"]+"', msg: 'Biror elementga id="..." bering' },
                  { id: 'class', label: 'class atribut', re: 'class="[^"]+"', msg: 'Biror elementga class="..." bering' },
                  { id: 'css', label: 'CSS style', re: '<style[\\s>][\\s\\S]*<\\/style>', msg: '<style> bloki ichida CSS qo‘shing (STEP 9 kodi)' },
                  { id: 'js', label: 'JavaScript interaction', re: '<script[\\s>][\\s\\S]*addEventListener', msg: '<script> ichida addEventListener bilan interaktivlik qo‘shing (STEP 10 kodi)' }
                ],
                starter: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Ali Valiyev — Portfolio</title>\n</head>\n<body>\n  <header id="top">\n    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar-progressive.svg/120px-OOjs_UI_icon_userAvatar-progressive.svg.png" alt="Mening avatarm">\n    <h1>Ali Valiyev</h1>\n    <p>Junior Web Developer</p>\n  </header>\n\n  <section id="about" class="card">\n    <h2>Men haqimda</h2>\n    <p>Salom! Men web dasturlashni o‘rganayapman. Bu — mening birinchi portfolio saytim.</p>\n  </section>\n\n  <section id="skills" class="card">\n    <h2>Skills</h2>\n    <ul>\n      <li class="skill">HTML</li>\n      <li class="skill">CSS</li>\n      <li class="skill">JavaScript</li>\n    </ul>\n  </section>\n\n  <section id="projects" class="card">\n    <h2>Loyihalar</h2>\n    <div class="project">1. Birinchi sahifam — <a href="https://example.com" target="_blank">ko‘rish</a></div>\n    <div class="project">2. Linklar darsi — <a href="https://example.com" target="_blank">ko‘rish</a></div>\n  </section>\n\n  <section id="contact" class="card">\n    <h2>Aloqa</h2>\n    <p>Email: <a href="mailto:ali@example.com">ali@example.com</a></p>\n    <p>Telefon: <a href="tel:+998901234567">+998 90 123 45 67</a></p>\n    <button id="contactBtn">Men bilan bog‘lanish</button>\n  </section>\n</body>\n</html>'
              },
              exercises: [
                {
                  id: 'l5build',
                  type: 'dragdrop',
                  title: '🎮 O‘YIN 2 — Build the HTML 🧱',
                  instruction: 'HTML bo‘laklari aralashib ketgan! Ularni **to‘g‘ri tartibda** joylang: kompyuterda sudrab tashlang yoki telefonda **bosib tanla → joyiga bos**.',
                  items: ['<body>', '  <h1>Salom dunyo</h1>', '  <p>Men web dastur o‘rganayapman.</p>', '</body>'],
                  hint: 'Tartib: <body> ochiladi → sarlavha → paragraf → </body> yopiladi.',
                  xp: 10
                },
                {
                  id: 'l5project',
                  type: 'liveedit',
                  mode: 'project',
                  title: '🚀 MY FIRST PORTFOLIO — LOYIHA',
                  instruction: 'Bu — senin **birinchi haqiqiy sayting**! Yuqoridagi STEP 9 (CSS) va STEP 10 (JS) kodlarini shu editorga qo‘shib, checklistni **10/10** qil. Har o‘zgartirishdan keyin ▶ RUN bosib natijani ko‘r.',
                  checks: [
                    { re: '<!DOCTYPE html>', msg: '`<!DOCTYPE html>` qatorini sahifa boshiga qo‘shing' },
                    { re: '<header[\\s\\S]*<\\/header>', msg: '<header> ... </header> bo‘limi kerak' },
                    { re: '<h1[\\s>][\\s\\S]*<\\/h1>', msg: '<h1>...</h1> sarlavha qo‘shing' },
                    { re: '<p[\\s>][\\s\\S]*<\\/p>', msg: '<p>...</p> paragraf qo‘shing' },
                    { re: '<img[^>]*alt="[^"]+"', msg: '<img> ga alt="..." atributi qo‘shing' },
                    { re: '<a[^>]*href="[^"]+"', msg: '<a href="..."> link qo‘shing' },
                    { re: 'id="[^"]+"', msg: 'Biror elementga id="..." bering' },
                    { re: 'class="[^"]+"', msg: 'Biror elementga class="..." bering' },
                    { re: '<style[\\s>][\\s\\S]*<\\/style>', msg: '<style> bloki ichida CSS qo‘shing (STEP 9 kodi)' },
                    { re: '<script[\\s>][\\s\\S]*addEventListener', msg: '<script> ichida addEventListener bilan interaktivlik qo‘shing (STEP 10 kodi)' }
                  ],
                  hint: 'STEP 9 — <style> blokini <head> ichiga yozing. STEP 10 — <script> blokini </body> oldiga qo‘ying.',
                  xp: 100
                }
              ],
            }
          },
          {
            title: 'HTML matnlar, ro‘yxatlar va sahifani rang bilan bezash',
            duration: 25,
            xp: 30,
            content: {
              intro: 'Bugun matnni **qalin va urg‘uli** qilishni, yangi qator va ajratuvchi chiziqni hamda **ro‘yxatlar**ni o‘rganamiz. Oxirida esa sahifani **rang** bilan bezaymiz — juda ozgina CSS bilan. 🎨',
              quizQuestionCount: 10,
              reviewQuiz: {
                id: 'l6review',
                title: '🔁 TEZKOR ESLATMA — eslaymiz!',
                subtitle: 'Oldingi darslardan eng kerakli tushunchalar. Har bir savol bittadan chiqadi.',
                xp: 10,
                questions: [
                  {
                    q: '`<h1>` nima?',
                    o: ['Eng katta va eng muhim sarlavha', 'Oddiy paragraf matni', 'Rasm elementi', 'Link elementi'],
                    a: 0,
                    hint: '1-darsdan eslang: h1–h6 — sarlavhalar. h1 — eng kattasi.'
                  },
                  {
                    q: '`href` nima?',
                    o: ['Rasm manzili', 'Link manzili (URL) — `<a>` tegning atributi', 'Sahifa nomi', 'Kodirovka turi'],
                    a: 1,
                    hint: '4-darsdan eslang: `<a href="https://...">` — link qayerga o‘tishini ko‘rsatadi.'
                  },
                  {
                    q: '`alt` nima?',
                    o: ['Rasm tavsifi — rasm yuklanmasa ko‘rinadi', 'Elementning nomi', 'Sahifa nomi', 'Link matni'],
                    a: 0,
                    hint: '3-darsdan eslang: `<img src="..." alt="...">` — alt rasm haqida qisqa matn.'
                  },
                  {
                    q: '`id` nima?',
                    o: ['Guruh nomi — ko‘p marta ishlatiladi', 'Rasm manzili', 'Elementning O‘ZIGA XOS yagona nomi', 'CSS rangi'],
                    a: 2,
                    hint: '3-darsdan eslang: id — sahifada faqat BIRTA elementga beriladigan yagona nom.'
                  }
                ]
              },
              sections: [
                {
                  title: '<strong> — muhim matn 💪',
                  text: '**Bu nima?** `<strong>` — matnni **qalin** ko‘rsatadigan teg va uni "muhim" deb belgilaydi.\n\n**Nima uchun kerak?** Ba’zan matn ichida bir so‘zni ajratib ko‘rsatish kerak bo‘ladi: "bu — ENG MUHIM qism!".\n\n**Qayerga yoziladi?** Har qanday matn ichida — `<p>`, `<h1>` va h.k. ichiga.',
                  code: '<p>Bu oddiy matn.</p>\n\n<p><strong>Bu muhim matn.</strong></p>',
                  codeNote: '• `<strong>` — ochiluvchi teg\n• `Bu muhim matn.` — kontent\n• `</strong>` — yopiluvchi teg',
                  result: 'Ikkinchi paragrafdagi matn QALIN ko‘rinadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><p style="margin:4px 0">Bu oddiy matn.</p><p style="margin:4px 0"><strong>Bu muhim matn.</strong></p></div>',
                  note: '`<strong>` nafaqat qalin qiladi — brauzerga "bu qism MUHIM" deb ham aytadi.',
                  playground: true
                },
                {
                  title: 'Qaysi biri qalin matn beradi? 🤔',
                  text: 'Keling, darhol tekshiramiz. Quyidagi ikki koddan qaysi biri matnni **qalin** qiladi?',
                  code: '1) <p>Bu oddiy matn.</p>\n\n2) <p><strong>Bu muhim matn.</strong></p>',
                  result: '1-tugmani bosing — demo xato javobni tushuntiradi. To‘g‘ri javob: **2)** — `<strong>` qalin matn beradi. ✅',
                  demoButton: { label: '1) <p> bilan', msg: '❌ Yo‘q! <p> — oddiy paragraf, qalinlik bermaydi. To‘g‘ri javob: <strong> bilan.' }
                },
                {
                  title: '<em> — urg‘uli matn 🔊',
                  text: '**Bu nima?** `<em>` — matnga **urg‘u** beradi (emphasis). Brauzerda u **kursiv** ko‘rinadi.\n\n**Nima uchun kerak?** Gapni ochiq o‘qiganingizda tovushni kuchaytirganingiz kabi: "Men *salom* dedim" — aynan shu so‘zga urg‘u.\n\n**Qayerga yoziladi?** Xuddi `<strong>` singari — matn ichida.',
                  code: '<p>Men <em>salom</em> dedim.</p>',
                  codeNote: '• `<em>` — urg‘u boshlanishi\n• `</em>` — urg‘u tugashi',
                  result: '"salom" so‘zi kursiv (qiya) ko‘rinadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><p style="margin:4px 0">Men <em>salom</em> dedim.</p></div>',
                  playground: true
                },
                {
                  title: '<strong> va <em> — farqi qani? ⚖️',
                  text: 'Ikkalasini yonma-yon solishtiramiz:\n\n• **`<strong>`** → **qalin** — "bu MUHIM!"\n• **`<em>`** → *kursiv* — "bu so‘zga urg‘u berilgan"\n\nIkkalasi ham matn ichida ishlaydi va hatto birga ham ishlatilishi mumkin: `<strong><em>Salom</em></strong>`.',
                  code: '<strong>Bu qalin — muhim!</strong>\n<em>Bu kursiv — urg‘uli!</em>',
                  result: 'Birinchi qator qalin, ikkinchi qator kursiv.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><p style="margin:4px 0"><strong>Bu qalin — muhim!</strong></p><p style="margin:4px 0"><em>Bu kursiv — urg‘uli!</em></p></div>',
                  playground: true
                },
                {
                  title: '<br> — yangi qator ⏎',
                  text: '**Bu nima?** `<br>` — matnni **yangi qatorga** tushiradi (line break).\n\n**Nima uchun kerak?** HTML kodda Enter bosishning brauzerga TA’SIRI YO‘Q. Ular buni probel sifatida o‘qiydi. Yangi qator kerak bo‘lsa — `<br>` yozasiz.\n\n**Qayerga yoziladi?** Matn o‘rtasida. Bu — **yopiluvchi tegsiz** bo‘sh teg: `<br>`.',
                  code: '<p>Salom</p>\n<p>Salom<br>Dasturchi</p>',
                  codeNote: 'Birinchi paragrafda `Salom` va `Dasturchi` BIR qatorda.\nIkkinchi paragrafda `<br>` ularni ikki qatorga bo‘ladi.',
                  result: '"Salom" yangi qatorda, undan keyin "Dasturchi".',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><p style="margin:4px 0">Salom Dasturchi</p><p style="margin:4px 0">Salom<br>Dasturchi</p></div>',
                  note: 'Kodda Enter bilan qator tushirsangiz ham brauzer ularni BIR qatorda chizadi — `<br>` kerak!',
                  playground: true
                },
                {
                  title: '<hr> — ajratuvchi chiziq ➖',
                  text: '**Bu nima?** `<hr>` — sahifada **gorizontal chiziq** chizadi va bo‘limlarni ajratadi (horizontal rule).\n\n**Nima uchun kerak?** Sahifada bir mavzu tugab, boshqasi boshlanganda — ko‘zga ko‘rinadigan ajratma qo‘yish uchun.\n\n**Qayerga yoziladi?** `<body>` ichida, ikki bo‘lim orasida. Bu ham **yopiluvchi tegsiz** bo‘sh teg.',
                  code: '<h1>Bo‘lim 1</h1>\n<p>Bu birinchi bo‘lim.</p>\n<hr>\n<h1>Bo‘lim 2</h1>\n<p>Bu ikkinchi bo‘lim.</p>',
                  result: 'Ikki bo‘lim o‘rtasida real chiziq paydo bo‘ladi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><h3 style="margin:4px 0">Bo‘lim 1</h3><p style="margin:4px 0;color:#94a3b8">Bu birinchi bo‘lim.</p><hr style="border:none;border-top:2px solid #6366f1"><h3 style="margin:4px 0">Bo‘lim 2</h3><p style="margin:4px 0;color:#94a3b8">Bu ikkinchi bo‘lim.</p></div>',
                  playground: true
                },
                {
                  title: '<ul> — tartibsiz ro‘yxat 📋',
                  text: '**Bu nima?** `<ul>` — **tartibsiz ro‘yxat** (unordered list). Har bir element oldida nuqta (bullet) • chiqadi.\n\n**Nima uchun kerak?** Tartibi muhim bo‘lmagan narsalarni sanash uchun: qobilalar, skills, mahsulotlar.\n\n**Qanday ishlaydi?** `<ul>` ro‘yxatni ochadi, ichida har bir band `<li>` bilan yoziladi, `</ul>` ro‘yxatni yopadi.',
                  code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>',
                  codeNote: '• `<ul>` → ro‘yxat boshlanadi\n• `<li>...</li>` → ro‘yxatdagi bitta element\n• `</ul>` → ro‘yxat tugaydi',
                  result: 'Uchta qator, har biri oldida bullet • bilan.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><ul style="margin:4px 0;padding-left:22px;"><li>HTML</li><li>CSS</li><li>JavaScript</li></ul></div>',
                  playground: true
                },
                {
                  title: '<li> — ro‘yxatdagi bitta band 📌',
                  text: '**Bu nima?** `<li>` — ro‘yxatdagi **bitta band** (list item).\n\n**Qoida:** `<li>` hech qachon yolg‘iz turmaydi — u doim `<ul>` yoki `<ol>` ICHIDA turadi. Nechta `<li>` yozsangiz — shuncha element chiqadi.',
                  code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n  <li>Git</li>\n</ul>',
                  codeNote: 'Bu yerda 4 ta `<li>` bor — demak ro‘yxatda 4 ta band chiqadi.',
                  result: '4 ta bullet • bilan boshlanadigan qator.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><ul style="margin:4px 0;padding-left:22px;"><li>HTML</li><li>CSS</li><li>JavaScript</li><li>Git</li></ul></div>',
                  note: '🎮 "Ro‘yxat ustasi" o‘yinida o‘zingiz 3 ta element qo‘shib ko‘rasiz!',
                  playground: true
                },
                {
                  title: '<ol> — tartibli ro‘yxat 🔢',
                  text: '**Bu nima?** `<ol>` — **tartibli ro‘yxat** (ordered list). Bullet o‘rniga **raqamlar** (1, 2, 3...) chiqadi.\n\n**Nima uchun kerak?** Tartibi MUHIM bo‘lgan qadamlar uchun: retsept, o‘rnatish bosqichlari, yo‘riqnoma.',
                  code: '<ol>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ol>',
                  codeNote: 'Tuzilishi `<ul>` bilan bir xil — faqat `<ul>` o‘rniga `<ol>` yozamiz.',
                  result: 'Har bir qator oldida raqam: 1. HTML · 2. CSS · 3. JavaScript',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><ol style="margin:4px 0;padding-left:22px;"><li>HTML</li><li>CSS</li><li>JavaScript</li></ol></div>',
                  playground: true
                },
                {
                  title: '<ul> yoki <ol>? — yakuniy taqqoslash ⚖️',
                  text: '• **`<ul>`** → bullet • — tartib muhim EMAS\n• **`<ol>`** → raqam 1,2,3 — tartib MUHIM\n• **`<li>`** → har ikkalasida bitta band\n\nOvqat pishirish retsepti qaysi biri? Retsept — qadamlar ketma-ketligi, demak `<ol>`. Skills ro‘yxati esa `<ul>`!',
                  code: '<ul>\n  <li>Olma</li>\n  <li>Banom</li>\n</ul>\n\n<ol>\n  <li>Tuxumni ur</li>\n  <li>Aralashtir</li>\n  <li>Pishir</li>\n</ol>',
                  result: 'Birinchi ro‘yxat bullet bilan, ikkinchisi raqamlar bilan.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><ul style="margin:4px 0;padding-left:22px;"><li>Olma</li><li>Banom</li></ul><ol style="margin:4px 0;padding-left:22px;"><li>Tuxumni ur</li><li>Aralashtir</li><li>Pishir</li></ol></div>',
                  playground: true
                },
                {
                  title: '🎨 CSSga o‘tish — ozgina chiroyli qilamiz',
                  text: 'HTML ro‘yxat va matnni yaratdi. Endi uni ozgina chiroyli qilamiz. 🎨\n\n**CSS nima?** CSS — HTML yaratgan narsaning **ko‘rinishini** o‘zgartiradi: rangi, foni, shrifti... (Bu darsda faqat 2 ta CSS xususiyatini o‘rganamiz — `color` va `background-color`. Qolgani — alohida CSS kursida.)\n\nCSSni element ichida `style` atributi orqali yozamiz.'
                },
                {
                  title: 'CSS: color — matn rangi 🔴',
                  text: '**CSSsiz** holat: `<h1>ITTest</h1>` — oddiy oq/qora matn.\n\n**CSS bilan:** matn rangini o‘zgartiramiz. Parchalab ko‘ramiz:\n\n• `style` → element ichida CSS yozish joyi (atribut)\n• `color` → matn RANGINI o‘zgartiradigan CSS xususiyati\n• `red` → rang qiymati\n• `;` → CSS qoidasi tugadi',
                  code: '<!-- CSSsiz -->\n<h1>ITTest</h1>\n\n<!-- CSS bilan -->\n<h1 style="color: red;">ITTest</h1>',
                  codeNote: '`style="color: red;"` — ochiluvchi `<h1>` teg ICHIDA yoziladi. `color` — nima o‘zgaradi, `red` — qanday rang.',
                  result: 'ITTest yozuvi QIZIL rangda chiqadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><h3 style="margin:4px 0">ITTest</h3><h3 style="margin:4px 0;color:red;">ITTest 🔴</h3></div>',
                  note: '⚠️ Beginner warning: agar siz `<h1>color salom</h1>` deb yozsangiz — ekranda oddiy "color salom" matni chiqadi! 💡 `color` HTML matni EMAS — u CSS property. Uni `<h1 style="color:red;">Salom</h1>` ko‘rinishida yozish kerak.',
                  playground: true
                },
                {
                  title: 'CSS: background-color — orqa fon rangi 🟦',
                  text: '**Bu nima?** `background-color` — elementning **orqa fon rangini** o‘zgartiradi.\n\nParchalab ko‘ramiz:\n\n• `background-color` → fon rangi xususiyati\n• `blue` → rang qiymati\n\nFarqni eslab qoling: `color` → MATN rangi, `background-color` → ORQA FON rangi.',
                  code: '<!-- CSSsiz -->\n<div>ITTest</div>\n\n<!-- CSS bilan -->\n<div style="background-color: blue;">\n  ITTest\n</div>',
                  codeNote: '`style` — yana ochiluvchi teg ichida. `background-color: blue;` — butun quti foni ko‘k bo‘ladi.',
                  result: 'ITTest matni atrofida KO‘K fonli quti chiqadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><div style="margin:4px 0">ITTest</div><div style="margin:4px 0;background-color:blue;padding:8px;">ITTest 🟦</div></div>',
                  playground: true
                }
              ],
              keyPoints: [
                '`<strong>` → **qalin + muhim** · `<em>` → *kursiv + urg‘u*',
                '`<br>` → yangi qator · `<hr>` → ajratuvchi chiziq (ikkalasi ham yopiluvchi tegsiz)',
                '`<ul>` → bullet ro‘yxat · `<ol>` → raqamli ro‘yxat · `<li>` → bitta band (ul/ol ichida)',
                'CSS `style="..."` — element ichida yoziladi',
                '`color` → matn rangi · `background-color` → fon rangi · qiymatdan keyin `;` qo‘yiladi',
                '⚠️ `color` HTML matni emas — CSS property. `<h1 style="color:red;">Salom</h1>` to‘g‘ri yozuv'
              ],
              gamesTitle: '🎮 MINI-O‘YINLAR — BILIMNI MUSTAHKAMLAYMIZ',
              games: [
                {
                  id: 'l6lists',
                  type: 'quizgame',
                  icon: '🎮',
                  title: 'O‘yin 1 — Ro‘yxat ustasi',
                  desc: 'HTML, CSS, JavaScript ro‘yxatini to‘g‘ri yozing',
                  xp: 10,
                  questions: [
                    {
                      q: 'Vazifa 1/2: "HTML, CSS, JavaScript" ro‘yxatini **oddiy bullet list** (•) qiling. Qaysi teg?',
                      o: ['`<ul>`', '`<ol>`', '`<hr>`', '`<br>`'],
                      a: 0,
                      hint: 'Tartib muhim emas, bullet • kerak — demak tartibsiz ro‘yxat: `<ul>`.'
                    },
                    {
                      q: 'Vazifa 2/2: Endi ro‘yxat **1, 2, 3 tartibida** chiqsin. Qaysi teg?',
                      o: ['`<ul>`', '`<ol>`', '`<li>`', '`<em>`'],
                      a: 1,
                      hint: 'Raqam 1,2,3 — tartibli ro‘yxat: `<ol>` (ordered list).'
                    }
                  ]
                },
                {
                  id: 'l6detective',
                  type: 'quizgame',
                  icon: '🧠',
                  title: 'O‘yin 2 — Kod detektivi',
                  desc: 'Qaysi kod nima qiladi — moslashtiring',
                  xp: 10,
                  questions: [
                    { q: 'Qaysi biri **yangi qator** qiladi?', o: ['`<br>`', '`<hr>`', '`<em>`', '`<strong>`'], a: 0, hint: '`<br>` = line break — matnni yangi qatorga tushiradi.' },
                    { q: 'Qaysi biri **bullet list** qiladi?', o: ['`<ol>`', '`<ul>`', '`<li>`', '`<hr>`'], a: 1, hint: '`<ul>` — tartibsiz (unordered) ro‘yxat → bullet •.' },
                    { q: 'Qaysi biri **matn rangini** o‘zgartiradi?', o: ['`background-color`', '`color`', '`<hr>`', '`id`'], a: 1, hint: '`color` — CSS property, matn rangi. `background-color` esa fon.' },
                    { q: '`<strong>` nima qiladi?', o: ['Kursiv qiladi', 'Yangi qator', 'Qalin (muhim) qiladi', 'Fon rangi'], a: 2, hint: '`<strong>` = qalin + "bu muhim" ma‘nosi.' },
                    { q: '`<hr>` nima qiladi?', o: ['Ajratuvchi chiziq chizadi', 'Rasm chizadi', 'Raqam qo‘yadi', 'Link ochadi'], a: 0, hint: '`<hr>` = horizontal rule — gorizontall chiziq.' },
                    { q: 'Qaysi biri **orqa fon rangini** beradi?', o: ['`color`', '`<ol>`', '`background-color`', '`<em>`'], a: 2, hint: '`background-color` — elementning orqa foni.' }
                  ]
                },
                {
                  id: 'l6colorcmp',
                  type: 'csstab',
                  icon: '🎨',
                  title: 'O‘yin 3 — CSSsiz yoki CSS bilan? (color)',
                  desc: 'Ikkala holatni real ko‘rib chiqing',
                  xp: 10,
                  tabs: [
                    { label: 'CSSsiz', html: '<h1>ITTest</h1>', code: '<h1>ITTest</h1>' },
                    { label: 'CSS bilan', html: '<h1 style="color: cyan;">ITTest</h1>', code: '<h1 style="color: cyan;">ITTest</h1>' }
                  ]
                },
                {
                  id: 'l6bgcmp',
                  type: 'csstab',
                  icon: '🖼',
                  title: 'O‘yin 4 — CSSsiz yoki CSS bilan? (background-color)',
                  desc: 'Fon rangini real taqqoslang',
                  xp: 10,
                  tabs: [
                    { label: 'CSSsiz', html: '<div>ITTest</div>', code: '<div>ITTest</div>' },
                    { label: 'CSS bilan', html: '<div style="background-color: blue; padding: 8px;">ITTest</div>', code: '<div style="background-color: blue;">ITTest</div>' }
                  ]
                },
                {
                  id: 'l6wizard',
                  type: 'wizard',
                  icon: '✨',
                  title: 'O‘yin 5 — Rang sehrgari',
                  desc: 'Rang tanlang — real preview o‘zgarsin',
                  xp: 10,
                  colors: {
                    text: [
                      { label: '🔴 red', v: 'red' },
                      { label: '🔵 blue', v: 'blue' },
                      { label: '🟢 green', v: 'green' },
                      { label: '🟣 purple', v: 'purple' }
                    ],
                    bg: [
                      { label: '⬜ white', v: 'white' },
                      { label: '⬛ black', v: 'black' },
                      { label: '🔵 blue', v: 'blue' },
                      { label: '🟣 purple', v: 'purple' }
                    ]
                  }
                }
              ],
              motivationTitle: '🚀 KEYINGI DARS: 7-DARS',
              motivation: '**Endi HTML bilan sahifani yanada tartibli qilishni o‘rganamiz!** 📦\n\nSahifangizda katta bo‘limlar, sarlavhalar va tartib paydo bo‘ladi — haqiqiy sayt qadami. Kuting! 😉',
              exercises: [
                {
                  id: 'l6ex1',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 1 — `<strong>` bilan muhim matn yarating 💪',
                  instruction: 'Kodga `<strong>...</strong>` qo‘shib, biror matnni **muhim (qalin)** qiling.',
                  startCode: '<p>Bu oddiy matn.</p>',
                  checks: [
                    { re: '<strong[\\s>][\\s\\S]*<\\/strong>', msg: '`<strong>...</strong>` juftligini qo‘shing — ichida biror matn bo‘lsin' }
                  ],
                  hint: 'Masalan: <p>Bu <strong>javob</strong> to‘g‘ri.</p>',
                  explanation: '`<strong>` matnni qalin qiladi va "muhim" deb belgilaydi.',
                  xp: 10
                },
                {
                  id: 'l6ex2',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 2 — `<ul>` va `<li>` bilan 3 ta skill yozing 📋',
                  instruction: '`<ul>` va `<li>` yordamida kamida **3 ta skill** ro‘yxatini yarating (masalan: HTML, CSS, JavaScript).',
                  startCode: '<!-- Bu yerga <ul> ro‘yxat yozing -->',
                  checks: [
                    { re: '<ul[\\s>][\\s\\S]*<\\/ul>', msg: '`<ul>...</ul>` ro‘yxati kerak' },
                    { re: '(?:[\\s\\S]*<li[\\s>][\\s\\S]*<\\/li>){3}', msg: 'Kamida 3 ta `<li>...</li>` bandi kerak' }
                  ],
                  hint: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>',
                  explanation: '`<ul>` bullet ro‘yxat ochadi, har bir `<li>` — bitta band.',
                  xp: 10
                },
                {
                  id: 'l6ex3',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 3 — `<ol>` va `<li>` bilan 3 ta qadam yarating 🔢',
                  instruction: '`<ol>` va `<li>` yordamida kamida **3 ta qadam** yarating (1, 2, 3 tartibida chiqadi).',
                  startCode: '<!-- Bu yerga <ol> ro‘yxat yozing -->',
                  checks: [
                    { re: '<ol[\\s>][\\s\\S]*<\\/ol>', msg: '`<ol>...</ol>` ro‘yxati kerak' },
                    { re: '(?:[\\s\\S]*<li[\\s>][\\s\\S]*<\\/li>){3}', msg: 'Kamida 3 ta `<li>...</li>` bandi kerak' }
                  ],
                  hint: '<ol>\n  <li>Kompyuterni yoq</li>\n  <li>Editor och</li>\n  <li>Kod yoz</li>\n</ol>',
                  explanation: '`<ol>` tartibli ro‘yxat — elementlar 1, 2, 3 raqamlari bilan chiqadi.',
                  xp: 10
                },
                {
                  id: 'l6bonus',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — CSS bilan bezang 🎨',
                  instruction: 'Ixtiyoriy: 1) Matningizni **qizil rangga** o‘zgartiring (`color: red;`), 2) elementga **orqa fon rangi** bering (`background-color: ...`).',
                  startCode: '<h1>ITTest</h1>',
                  checks: [
                    { re: 'style\\s*=\\s*"[^"]*color\\s*:\\s*red', msg: '`style="color: red;"` qo‘shing — matn rangi uchun' },
                    { re: 'style\\s*=\\s*"[^"]*background-color\\s*:\\s*\\w+', msg: '`style="background-color: ...;"` qo‘shing — fon uchun' }
                  ],
                  hint: '<h1 style="color: red; background-color: black;">ITTest</h1>',
                  explanation: 'Zo‘r! CSS qolgan batafsil — alohida CSS kursida. 🎨',
                  xp: 10
                }
              ]
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: 'Qaysi teg matnni QALIN ko‘rsatadi?',
                  options: ['`<em>`', '`<strong>`', '`<br>`', '`<hr>`'],
                  answer: 1,
                  explanation: '`<strong>` — qalin va "muhim" matn. `<em>` esa kursiv (urg‘u).'
                },
                {
                  question: '`<em>` brauzerda qanday ko‘rinadi?',
                  options: ['Qalin', 'Kursiv (qiya)', 'Rangli', 'Katta'],
                  answer: 1,
                  explanation: '`<em>` — urg‘u (emphasis) va brauzerda kursiv ko‘rinadi.'
                },
                {
                  question: 'Matnni yangi qatorga tushirish uchun qaysi teg kerak?',
                  options: ['`<hr>`', '`<br>`', '`<ul>`', '`<strong>`'],
                  answer: 1,
                  explanation: '`<br>` — line break: matnni yangi qatorga tushiradi, yopiluvchi tegi yo‘q.'
                },
                {
                  question: '`<hr>` nima qiladi?',
                  options: ['Yangi qator ochadi', 'Rasm chizadi', 'Gorizontal ajratuvchi chiziq chizadi', 'Raqamli ro‘yxat yaratadi'],
                  answer: 2,
                  explanation: '`<hr>` (horizontal rule) — bo‘limlarni ajratuvchi chiziq.'
                },
                {
                  question: 'Bullet (•) bilan ro‘yxat qaysi teg bilan boshlanadi?',
                  options: ['`<ol>`', '`<li>`', '`<ul>`', '`<list>`'],
                  answer: 2,
                  explanation: '`<ul>` — tartibsiz (unordered) ro‘yxat: har bir `<li>` oldida bullet chiqadi.'
                },
                {
                  question: '`<ol>` ichidagi elementlar qanday ko‘rinadi?',
                  options: ['Bullet bilan', 'Raqamlar bilan: 1, 2, 3...', 'Hech qanday belgisiz', 'Rasmlar bilan'],
                  answer: 1,
                  explanation: '`<ol>` — tartibli (ordered) ro‘yxat: elementlar 1, 2, 3... raqamlari bilan chiqadi.'
                },
                {
                  question: 'Qaysi yozuv matnni QIZIL qiladi?',
                  options: ['`<h1>color red</h1>`', '`<h1 style="color: red;">Salom</h1>`', '`<h1 red>Salom</h1>`', '`<color>red</color>`'],
                  answer: 1,
                  explanation: '`color` — CSS property. Uni `style` atributi ichida yozish kerak: `style="color: red;"`. `<h1>color red</h1>` esa oddiy matn sifatida chiqadi!'
                },
                {
                  question: '`background-color` nimani o‘zgartiradi?',
                  options: ['Matn rangini', 'Elementning orqa fon rangini', 'Sahifa nomini', 'Link manzilini'],
                  answer: 1,
                  explanation: '`background-color` — orqa fon rangi. `color` esa matn rangi — ularni aralashtirmang!'
                },
                {
                  question: 'REVIEW (1-dars): eng katta va eng muhim sarlavha qaysi teg?',
                  options: ['`<h6>`', '`<p>`', '`<h1>`', '`<title>`'],
                  answer: 2,
                  explanation: '1-darsdan eslang: `<h1>` — eng katta sarlavha, `<h6>` — eng kichik.'
                },
                {
                  question: 'REVIEW (4-dars): link manzili qaysi atributda yoziladi?',
                  options: ['`src`', '`alt`', '`href`', '`id`'],
                  answer: 2,
                  explanation: '4-darsdan eslang: `<a href="...">` — href link qayerga o‘tishini ko‘rsatadi.'
                }
              ]
            }
          },
          {
            title: 'HTML formalar, inputlar va CSS bilan rang berish',
            duration: 25,
            xp: 30,
            content: {
              intro: 'Bugun saytlarning ENG interaktiv qismini o‘rganamiz — **formalar**! Input, label va buttonlarni bittadan yaratamiz, so‘ng ozgina **CSS** bilan rang beramiz va oxirida **JavaScript** bilan tugmani jonlantiramiz. 🚀',
              quizQuestionCount: 10,
              reviewQuiz: {
                id: 'l7review',
                title: '🔁 TEZKOR ESLATMA — eslaymiz!',
                subtitle: 'Oldingi darslardan eng kerakli tushunchalar. Har bir savol bittadan chiqadi.',
                xp: 10,
                questions: [
                  {
                    q: '`<h1>` nima?',
                    o: ['Eng katta va eng muhim sarlavha', 'Oddiy paragraf matni', 'Rasm elementi', 'Link elementi'],
                    a: 0,
                    hint: '1-darsdan eslang: h1–h6 — sarlavhalar. h1 — eng kattasi.'
                  },
                  {
                    q: '`href` nima?',
                    o: ['Rasm manzili', 'Link manzili (URL) — `<a>` tegning atributi', 'Sahifa nomi', 'Kodirovka turi'],
                    a: 1,
                    hint: '4-darsdan eslang: `<a href="https://...">` — link qayerga o‘tishini ko‘rsatadi.'
                  },
                  {
                    q: '`alt` nima?',
                    o: ['Rasm tavsifi — rasm yuklanmasa ko‘rinadi', 'Elementning nomi', 'Sahifa nomi', 'Link matni'],
                    a: 0,
                    hint: '3-darsdan eslang: `<img src="..." alt="...">` — alt rasm haqida qisqa matn.'
                  },
                  {
                    q: '`id` nima?',
                    o: ['Guruh nomi — ko‘p marta ishlatiladi', 'Rasm manzili', 'Elementning O‘ZIGA XOS yagona nomi', 'CSS rangi'],
                    a: 2,
                    hint: '3-darsdan eslang: id — sahifada faqat BIRTA elementga beriladigan yagona nom.'
                  },
                  {
                    q: '`class` nima?',
                    o: ['Elementning yagona nomi — faqat bittaga beriladi', 'Guruh nomi — ko‘p elementlarga beriladi', 'Link manzili', 'Rasm tavsifi'],
                    a: 1,
                    hint: '3-darsdan eslang: class — GURUH nomi, bir xil class ko‘p elementga beriladi; id esa faqat bittaga.'
                  },
                  {
                    q: '`<ul>` nima?',
                    o: ['Tartibli ro‘yxat (1, 2, 3)', 'Tartibsiz (bullet •) ro‘yxat', 'Jadval', 'Paragraf'],
                    a: 1,
                    hint: '5-darsdan eslang: `<ul>` — tartibsiz ro‘yxat, har bir band `<li>` ichida.'
                  }
                ]
              },
              sections: [
                {
                  title: '<form> — forma 📋',
                  text: '**Bu nima?** `<form>` — foydalanuvchi **ma‘lumot KIRITISHI** uchun mo‘ljallangan hudud (forma). Ichiga input, button kabi elementlar qo‘yiladi.\n\n**Nima uchun kerak?** Saytda ro‘yxatdan o‘tish, login qilish, izoh yozish — hammasi forma orqali. Forma brauzerga "bu yerda foydalanuvchi ma‘lumot yozadi" deb aytadi.\n\n**Qayerga yoziladi?** `<body>` ichida. Ochiluvchi `<form>` va yopiluvchi `</form>` tegi bor.',
                  code: '<form>\n</form>',
                  codeNote: '• `<form>` — forma boshlanishi\n• `</form>` — forma tugashi\n• Hozircha ichi bo‘sh — endi bittadan to‘ldiramiz',
                  result: 'Ekranda hali hech narsa ko‘rinmaydi — forma o‘zi ko‘rinmas quti. Ichiga elementlar qo‘shsak, ular chiqadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><div style="border:2px dashed #6366f1;border-radius:10px;padding:12px;text-align:center;color:#94a3b8;">📄 Bo‘sh forma — ichida hali element yo‘q</div></div>',
                  playground: true
                },
                {
                  title: 'Forma ishlayaptimi? 🤔',
                  text: 'Keling, darhol tekshiramiz. Quyidagi tugma oddiy `<button>` — **formasiz va JSsiz** turibdi. Bosing:',
                  code: '<button>\n  Yuborish\n</button>',
                  result: 'Tugma bosilganda hech narsa bo‘lmadi? To‘g‘ri — tugma hali nima qilishini bilmaydi. Keyinroq uni JS bilan jonlantiramiz. ⚡',
                  demoButton: { label: '🖱 Bosing (hech narsa bo‘lmaydi)', msg: '👀 Ko‘rdingizmi? Hozircha hech narsa bo‘lmadi — bu normal! Yaqinda tugmani JavaScript bilan jonlantiramiz.' }
                },
                {
                  title: '<label> — maydon nomi 🏷',
                  text: '**Bu nima?** `<label>` — input yonidagi yoki ustidagi **maydon nomi**. "Bu maydonga nima yozish kerak?" degan savolga javob beradi.\n\n**Nima uchun kerak?** Foydalanuvchi bo‘sh maydonni ko‘rib nima yozishini bilmaydi. `<label>` uni aytadi.\n\n**Qayerga yoziladi?** Forma ICHIDA, inputdan OLDIN. `for` atributiga e‘tibor bering: `for="name"` — shu label QAYSI inputga tegishliligini ko‘rsatadi. `for` qiymati inputning `id` si bilan **BIR XIL** bo‘lishi kerak!',
                  code: '<label for="name">Ismingiz</label>\n\n<input id="name" type="text">',
                  codeNote: '• `<label for="name">` — label va uning input nomi\n• `for="name"` — label qaysi inputga tegishli (inputning id si bilan mos!)\n• `<input id="name">` — inputning id si aynan "name"',
                  result: '"Ismingiz" yozuvi va uning ostida yozish maydoni chiqadi. Maydonga bosib yozib ko‘ring!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><label for="pname" style="display:block;margin-bottom:6px;color:#e2e8f0;">Ismingiz</label><input id="pname" type="text" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"></div>',
                  playground: true
                },
                {
                  title: '<input> — yozish maydoni ✍️',
                  text: '**Bu nima?** `<input>` — foydalanuvchi **ma‘lumot yozadigan** maydon.\n\n**Nima uchun kerak?** Login, qidiruv, izoh — foydalanuvchi biror narsa yozishi kerak bo‘lgan har joyda input bor.\n\n**Qayerga yoziladi?** Forma ichida (lekin tashqarida ham ishlaydi). Bu — **yopiluvchi tegsiz** bo‘sh teg: `<input>`. `type` atributi input QANDAY turdagi ma‘lumot qabul qilishini belgilaydi.',
                  code: '<input type="text">',
                  codeNote: '• `<input>` — input elementi (yopiluvchi tegi YO‘Q)\n• `type="text"` — oddiy matn qabul qiladi',
                  result: 'Bo‘sh yozish maydoni chiqadi — bosing va yozib ko‘ring!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><input type="text" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"></div>',
                  playground: true
                },
                {
                  title: 'placeholder — yordamchi matn 💬',
                  text: '**Bu nima?** `placeholder` — input ICHIDA ko‘rinib turadigan **yordamchi matn**.\n\n**Nima uchun kerak?** Foydalanuvchiga aynan NIMA yozish kerakligini ko‘rsatadi.\n\n**Qayerga yoziladi?** Ochiluvchi `<input>` tegi ichida, atribut sifatida. Yozishni boshlaganingizda placeholder **g‘oyib bo‘ladi** — pastdagi live demoda sinab ko‘ring!',
                  code: '<input\n  type="text"\n  placeholder="Ismingizni kiriting"\n>',
                  codeNote: '• `type="text"` — oddiy matn\n• `placeholder="Ismingizni kiriting"` — input ichida ko‘rinadigan yordamchi matn',
                  result: 'Input ichida kulrang "Ismingizni kiriting" yozuvi turadi. Yozgach — g‘oyib bo‘ladi! 👇',
                  liveDemo: { code: '<input\n  type="text"\n  placeholder="Ismingizni kiriting"\n>' },
                  playground: true
                },
                {
                  title: 'type="email" — email uchun 📧',
                  text: '**Bu nima?** `type="email"` — inputning **email** uchun mo‘ljallangan turi.\n\n**Nima uchun kerak?** Brauzer yozilgan matn email formatiga mosligini TEKSHIRADI (masalan, `@` belgisi bo‘lishi shart).\n\n**Qayerga yoziladi?** Ochiluvchi `<input>` tegi ichida.',
                  code: '<input\n  type="email"\n  placeholder="Emailingiz"\n>',
                  codeNote: '• `type="email"` — email turidagi input\n• `placeholder="Emailingiz"` — yordamchi matn',
                  result: 'Email maydoni chiqadi. Agar `@` siz yozsangiz, brauzer xato deb ogohlantiradi!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><input type="email" placeholder="Emailingiz" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"></div>',
                  playground: true
                },
                {
                  title: 'type="password" — parolni yashirish 🔒',
                  text: '**Bu nima?** `type="password"` — yozilgan belgilarni **yashirish** uchun input turi.\n\n**Nima uchun kerak?** Parolni yozganda yonidagan odam ko‘rmasligi uchun. Har bir belgi `• • •` nuqtada ko‘rinadi.\n\n**Qayerga yoziladi?** Ochiluvchi `<input>` tegi ichida.',
                  code: '<input\n  type="password"\n  placeholder="Parolingiz"\n>',
                  codeNote: '• `type="password"` — yashirin input\n• `placeholder="Parolingiz"` — yordamchi matn',
                  result: 'Maydonga biror narsa yozing — belgilar nuqta (•) ko‘rinishida yashirinadi!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><input type="password" placeholder="Parolingiz" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"></div>',
                  playground: true
                },
                {
                  title: '<button> — tugma 🔘',
                  text: '**Bu nima?** `<button>` — foydalanuvchi **bosadigan** tugma.\n\n**Nima uchun kerak?** Formani yuborish, biror amalni boshlash uchun.\n\n**Qayerga yoziladi?** Forma ichida, oxirida. Tugmada ko‘rinadigan matn ochiluvchi va yopiluvchi teg **ORASIDA** yoziladi (inputdan farqi — inputning ichi bo‘sh, buttonning ichi matn!).',
                  code: '<button>\n  Yuborish\n</button>',
                  codeNote: '• `<button>` — tugma boshlanishi\n• `Yuborish` — tugmada ko‘rinadigan matn\n• `</button>` — tugma tugashi',
                  result: '"Yuborish" yozuvli tugma chiqadi.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><button style="padding:12px 24px;border:none;border-radius:10px;background:linear-gradient(90deg,#6366f1,#06b6d4);color:white;font-size:16px;cursor:pointer;">Yuborish</button></div>',
                  playground: true
                },
                {
                  title: 'Hammasini birlashtiramiz — to‘liq forma 🧩',
                  text: 'Endi o‘rgangan qismlarimizni birlashtiramiz: **form** → **label** → **input** → **button**. Har bir qismni allaqachon bittadan bilib oldingiz — endi ular bitta yaxlit forma bo‘ladi!',
                  code: '<form>\n\n  <label for="name">\n    Ismingiz\n  </label>\n\n  <input\n    id="name"\n    type="text"\n    placeholder="Ismingizni kiriting"\n  >\n\n  <label for="email">\n    Email\n  </label>\n\n  <input\n    id="email"\n    type="email"\n    placeholder="Emailingiz"\n  >\n\n  <button>\n    Yuborish\n  </button>\n\n</form>',
                  codeNote: '• `<form>` — forma ildiizi, hammasi ICHIDA\n• `label for="name"` + `input id="name"` — id lar mos!\n• `type="text"` — ism uchun, `type="email"` — email uchun\n• `<button>` — forma oxirida',
                  result: 'To‘liq forma tayyor: Ismingiz maydoni, Email maydoni va Yuborish tugmasi. Sinab ko‘ring! 👇',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><form><label for="fname" style="display:block;margin:6px 0;color:#e2e8f0;">Ismingiz</label><input id="fname" type="text" placeholder="Ismingizni kiriting" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"><label for="femail" style="display:block;margin:8px 0 6px;color:#e2e8f0;">Email</label><input id="femail" type="email" placeholder="Emailingiz" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #6366f1;background:#111827;color:#f8fafc;"><button style="margin-top:10px;padding:12px 24px;border:none;border-radius:10px;background:linear-gradient(90deg,#6366f1,#06b6d4);color:white;font-size:16px;cursor:pointer;">Yuborish</button></form></div>',
                  playground: true
                },
                {
                  title: 'CSSga o‘tish — formani chiroyli qilamiz 🎨',
                  text: 'HTML forma yaratdi. **Endi uni ozgina chiroyli qilamiz!** 🎨\n\n**CSS** — HTML yaratgan narsalarning **ko‘rinishini** o‘zgartiradi (rang, kattalik, fon...). Quyidagi ikkita sarlavhani solishtiring: birinchisi **CSSsiz**, ikkinchisi **CSS bilan**.',
                  code: '<h1>ITTest</h1>\n\n<h1 style="color: red;">\n  ITTest\n</h1>',
                  codeNote: '• Birinchi `<h1>` — oddiy (CSSsiz)\n• `style="color: red;"` — CSS. `color` — matn rangi, `red` — rang qiymati\n• `style` — ochiluvchi teg ICHIDA yoziladi',
                  result: 'Birinchi sarlavha oddiy, ikkinchisi QIZIL. Farqni ko‘ryapsizmi?',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><h1 style="margin:4px 0;font-size:24px;">ITTest</h1><h1 style="margin:4px 0;font-size:24px;color:red;">ITTest</h1></div>',
                  playground: true
                },
                {
                  title: 'Rang nomlari English tilida 🇬🇧',
                  text: 'CSSda rang nomi **English tilida** yoziladi:\n\n• `red` → qizil\n• `blue` → ko‘k\n• `green` → yashil\n• `yellow` → sariq\n• `purple` → binafsha\n• `black` → qora\n• `white` → oq\n\nCSSda rang nomi English tilida yozilishi mumkin — shunchaki yodlab oling. Agar rangdan muammom yo‘q desangiz ham, English nomlari orqali har qanday rangni ishlatishingiz mumkin. 😉',
                  code: '<h2 style="color: purple;">\n  ITTest\n</h2>',
                  codeNote: '`purple` — binafsha rang nomi (English tilida yozilgan).',
                  result: 'Sarlavha binafsha (purple) rangda chiqadi!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><h2 style="margin:4px 0;color:purple;">ITTest</h2></div>',
                  playground: true
                },
                {
                  title: 'background-color — orqa fon rangi 🟦',
                  text: '**Bu nima?** `background-color` — elementning **orqa fon rangini** o‘zgartiradi.\n\n**Nima uchun kerak?** Qutini ajratib ko‘rsatish, banner yasash, matnni o‘qishni osonlashtirish uchun.\n\n**Qayerga yoziladi?** `style` atributi ichida. E‘tibor bering: `color` — **matn** rangi, `background-color` — **fon** rangi. Aralashtirmang!',
                  code: '<div>\n  ITTest\n</div>\n\n<div style="background-color: blue;">\n  ITTest\n</div>',
                  codeNote: '• `background-color` — orqa fon rangi property si\n• `blue` — rang qiymati (English tilida)',
                  result: 'Birinchi quti oddiy, ikkinchi quti butunligicha KO‘K fonli!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><div style="margin:4px 0;">ITTest</div><div style="margin:4px 0;background-color:blue;padding:8px;">ITTest 🟦</div></div>',
                  playground: true
                },
                /*__L7SEC__*/
                {
                  title: 'JavaScript — tugmaga jon berish ⚡',
                  text: 'Tugma bosilganda hozircha hech narsa bo‘lmaydi. Buni hal qiladi — **JavaScript**! Kodni qo‘rqinchli ko‘rsatish uchun emas, bittadan tushuntiraman:\n\n1. `const` → qiymatni saqlash\n2. `button` → o‘zgaruvchi nomi (o‘zingiz qo‘yasiz)\n3. `document` → web sahifani boshqarish obyekti\n4. `getElementById` → id orqali elementni topadi\n5. `"sendBtn"` → elementning id qiymati\n6. `addEventListener` → hodisani kutadi\n7. `"click"` → bosilganda\n8. `function()` → bajariladigan kod\n9. `alert()` → xabar oynasini chiqaradi\n\nPastdagi live demoda ▶ RUN bosib, so‘ng tugmani bosing!',
                  code: '<button id="sendBtn">\n  Yuborish\n</button>\n\n<script>\nconst button = document.getElementById("sendBtn");\n\nbutton.addEventListener("click", function() {\n  alert("Ma\'lumot yuborildi!");\n});\n</script>',
                  codeNote: '• `const button = document.getElementById("sendBtn");` — id si "sendBtn" bo‘lgan tugmani topib, button o‘zgaruvchisiga saqlaydi\n• `addEventListener("click", function() {...})` — tugma BOSILGANDA ichidagi kod ishlaydi\n• `alert("Ma\'lumot yuborildi!");` — xabar oynasi chiqadi',
                  result: 'Tugmani bosing — "Ma\'lumot yuborildi!" xabar oynasi chiqadi!',
                  liveDemo: { code: '<button id="sendBtn">\n  Yuborish\n</button>\n\n<script>\nconst button = document.getElementById("sendBtn");\n\nbutton.addEventListener("click", function() {\n  alert("Ma\'lumot yuborildi!");\n});\n</script>' },
                  playground: true
                },
                {
                  title: 'input.value — yozilgan qiymat 💡',
                  text: '**Bu nima?** `value` — input ICHIGA yozilgan qiymat.\n\n`document.getElementById("name").value` deb o‘qib olamiz: "id si name bo‘lgan elementning qiymati". Endi haqiqiy interaktiv narsa yasaymiz: ism yozing, tugmani bosing — robot sizni salomlaydi! 🤖',
                  code: '<input id="name" type="text" placeholder="Ismingizni kiriting">\n\n<button id="sendBtn">\n  Yuborish\n</button>\n\n<script>\nconst button = document.getElementById("sendBtn");\n\nbutton.addEventListener("click", function() {\n  const name = document.getElementById("name").value;\n  alert("Salom, " + name + "! 👋");\n});\n</script>',
                  codeNote: '• `document.getElementById("name").value` — input ichiga yozilgan matn\n• `"Salom, " + name + "! 👋"` — matn va qiymat `+` bilan birlashtiriladi',
                  result: 'Live demoda ism yozing (masalan: Ahatjon) va Yuborishni bosing — "Salom, Ahatjon! 👋" chiqadi! 🎉',
                  liveDemo: { code: '<input id="name" type="text" placeholder="Ismingizni kiriting">\n\n<button id="sendBtn">\n  Yuborish\n</button>\n\n<script>\nconst button = document.getElementById("sendBtn");\n\nbutton.addEventListener("click", function() {\n  const name = document.getElementById("name").value;\n  alert("Salom, " + name + "! 👋");\n});\n</script>' },
                  playground: true
                }
              ],
              keyPoints: [
                '`<form>` — forma; input, label, button ICHIDA turadi',
                '`<label for="...">` — maydon nomi; `for` qiymati = inputning `id` si',
                '`<input>` — yozish maydoni (yopiluvchi tegsiz); `type` — ma‘lumot turi',
                '`type="text"` — matn · `type="email"` — email · `type="password"` — yashirin parol',
                '`placeholder` — input ichidagi yordamchi matn, yozganda g‘oyib bo‘ladi',
                '`<button>...</button>` — tugma; matni teglar ORASIDA yoziladi',
                '`color` → matn rangi · `background-color` → fon rangi · rang nomlari English: red, blue, green, yellow, purple, black, white',
                'CSS `style="..."` — ochiluvchi teg ichida; property dan keyin `:` , qiymatdan keyin `;`',
                '`document.getElementById("id")` — id orqali element topish',
                '`addEventListener("click", function() {...})` — bosilganda kod ishlaydi · `alert()` — xabar oynasi · `input.value` — yozilgan qiymat'
              ],
              motivationTitle: '🚀 KEYINGI DARS: 8-DARS',
              motivation: '**Endi formani yanada kuchaytiramiz — boshqa form elementlari bilan!** 📦\n\nRo‘yxatdan o‘tish formasini haqiqiy sayt darajasiga olib boramiz. Kuting! 😉',
              gamesTitle: '🎮 MINI-O‘YINLAR — BILIMNI MUSTAHKAMLAYMIZ',
              games: [
                {
                  id: 'l7typedoc',
                  type: 'quizgame',
                  icon: '🩺',
                  title: 'O‘yin 1 — Type Doctor',
                  desc: 'Qaysi type qayerda ishlaydi?',
                  xp: 10,
                  questions: [
                    {
                      q: '**Email** kiritish uchun qaysi `type` kerak?',
                      o: ['`type="text"`', '`type="email"`', '`type="password"`', '`type="button"`'],
                      a: 1,
                      hint: 'Email uchun maxsus tur bor — `type="email"`. Brauzer `@` belgisini tekshiradi.'
                    },
                    {
                      q: '**Parolni yashirish** uchun qaysi `type` kerak?',
                      o: ['`type="text"`', '`type="email"`', '`type="password"`', '`type="label"`'],
                      a: 2,
                      hint: '`type="password"` — yozilgan har bir belgini • • • qilib yashiradi.'
                    },
                    {
                      q: 'Input ichida ko‘rinib turadigan **yordamchi matn** qaysi atribut?',
                      o: ['`value`', '`placeholder`', '`id`', '`for`'],
                      a: 1,
                      hint: '`placeholder` — yozishni boshlaganda g‘oyib bo‘ladigan yordamchi matn.'
                    }
                  ]
                },
                {
                  id: 'l7colorquiz',
                  type: 'quizgame',
                  icon: '🎨',
                  title: 'O‘yin 2 — Rangni toping',
                  desc: 'CSS rang property larini taning',
                  xp: 10,
                  questions: [
                    {
                      q: 'Matnni **QIZIL** qilish uchun qaysi CSS property?',
                      o: ['`background-color`', '`color`', '`margin`', '`type`'],
                      a: 1,
                      hint: '`color` — matn rangi. `background-color` esa fon rangi — aralashtirmang!'
                    },
                    {
                      q: 'Quti **FONINI** ko‘k qilish uchun qaysi property?',
                      o: ['`color`', '`blue`', '`background-color`', '`border`'],
                      a: 2,
                      hint: '`background-color: blue;` — butun quti foni ko‘k bo‘ladi.'
                    },
                    {
                      q: 'Qaysi yozuv TO‘G‘RI?',
                      o: ['`<h1 color:red>S</h1>`', '`<h1 style="color: red;">S</h1>`', '`<h1 red>S</h1>`', '`<color red>S</color>`'],
                      a: 1,
                      hint: 'CSS property `style="..."` atributi ICHIDA yoziladi.'
                    }
                  ]
                },
                {
                  id: 'l7build',
                  type: 'quizgame',
                  icon: '🧩',
                  title: 'O‘yin 3 — Formani yig‘ing',
                  desc: 'Elementlarni to‘g‘ri ketma-ketlikda tanlang',
                  xp: 10,
                  win: '✅ Forma tayyor!',
                  questions: [
                    {
                      q: 'Vazifa 1/4: Formani boshlash uchun qaysi teg?',
                      o: ['`<form>`', '`<input>`', '`<button>`', '`<label>`'],
                      a: 0,
                      hint: 'Hammasi `<form>` ICHIDA turadi — undan boshlaymiz.'
                    },
                    {
                      q: 'Vazifa 2/4: Endi maydon NOMI. Qaysi teg?',
                      o: ['`<form>`', '`<label>`', '`<button>`', '`<hr>`'],
                      a: 1,
                      hint: '`<label>` — input yonidagi yoki ustidagi maydon nomi.'
                    },
                    {
                      q: 'Vazifa 3/4: Endi yozish maydoni. Qaysi teg?',
                      o: ['`<input>`', '`<label>`', '`<ul>`', '`<div>`'],
                      a: 0,
                      hint: '`<input>` — foydalanuvchi ma‘lumot yozadigan maydon.'
                    },
                    {
                      q: 'Vazifa 4/4: Oxirgi qadam — foydalanuvchi bosadigan tugma!',
                      o: ['`<link>`', '`<button>`', '`<img>`', '`<table>`'],
                      a: 1,
                      hint: '`<button>` — foydalanuvchi bosadigan tugma.'
                    }
                  ]
                }
              ],
              exercises: [
                {
                  id: 'l7ex1',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 1 — Ism uchun text input yarating ✍️',
                  instruction: '`<input>` yozing: `type="text"` va `id="name"` bo‘lsin.',
                  startCode: '<!-- Ism uchun input yozing -->',
                  checks: [
                    { re: '<input[\\s>]', msg: '`<input>` elementi kerak' },
                    { re: 'type\\s*=\\s*["\']text["\']', msg: '`type="text"` qo‘shing' },
                    { re: 'id\\s*=\\s*["\']name["\']', msg: '`id="name"` bering' }
                  ],
                  hint: '<input id="name" type="text" placeholder="Ismingizni kiriting">',
                  explanation: '`<input>` — yozish maydoni. `type="text"` — oddiy matn, `id="name"` — label bog‘lanishi uchun yagona nom.',
                  xp: 10
                },
                {
                  id: 'l7ex2',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 2 — Email uchun email input yarating 📧',
                  instruction: '`<input>` yozing: `type="email"`, `id="email"` va `placeholder` bo‘lsin.',
                  startCode: '<!-- Email uchun input yozing -->',
                  checks: [
                    { re: '<input[\\s>]', msg: '`<input>` elementi kerak' },
                    { re: 'type\\s*=\\s*["\']email["\']', msg: '`type="email"` qo‘shing' },
                    { re: 'id\\s*=\\s*["\']email["\']', msg: '`id="email"` bering' },
                    { re: 'placeholder\\s*=\\s*["\'][^"\']+["\']', msg: '`placeholder="..."` qo‘shing — yordamchi matn' }
                  ],
                  hint: '<input id="email" type="email" placeholder="Emailingiz">',
                  explanation: '`type="email"` — brauzer email formatini tekshiradi. `placeholder` — ichida ko‘rinadigan yordamchi matn.',
                  xp: 10
                },
                {
                  id: 'l7ex3',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 3 — Ism + email + button bilan kichik forma yarating 🧩',
                  instruction: '`<form>` ichida: ism uchun text input, email uchun email input va `<button>` yarating.',
                  startCode: '<!-- Bu yerga formani yozing -->',
                  checks: [
                    { re: '<form[\\s>][\\s\\S]*<\\/form>', msg: '`<form>...</form>` kerak — hammasi ichida' },
                    { re: 'type\\s*=\\s*["\']text["\']', msg: 'Ism uchun `type="text"` input kerak' },
                    { re: 'type\\s*=\\s*["\']email["\']', msg: 'Email uchun `type="email"` input kerak' },
                    { re: '<button[\\s>][\\s\\S]*<\\/button>', msg: '`<button>...</button>` kerak' }
                  ],
                  hint: '<form>\n  <label for="name">Ismingiz</label>\n  <input id="name" type="text" placeholder="Ismingizni kiriting">\n\n  <label for="email">Email</label>\n  <input id="email" type="email" placeholder="Emailingiz">\n\n  <button>Yuborish</button>\n</form>',
                  explanation: 'To‘liq forma: form → label → input (text, email) → button. Endi siz haqiqiy forma yasay olasiz!',
                  xp: 10
                },
                {
                  id: 'l7bonuscss',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — Rangli input va tugma 🎨',
                  instruction: 'Ixtiyoriy: Input matnini **red** qiling (`color: red;`), input fonini **blue** qiling (`background-color: blue;`), button matnini **white** qiling (`color: white;`).',
                  startCode: '<input type="text" placeholder="Ismingiz">\n\n<button>Yuborish</button>',
                  checks: [
                    { re: '<input[^>]*style\\s*=\\s*"[^"]*color\\s*:\\s*red', msg: 'Input ga `style="color: red;"` qo‘shing' },
                    { re: '<input[^>]*style\\s*=\\s*"[^"]*background-color\\s*:\\s*blue', msg: 'Input ga `background-color: blue;` qo‘shing' },
                    { re: '<button[^>]*style\\s*=\\s*"[^"]*color\\s*:\\s*white', msg: 'Button ga `style="color: white;"` qo‘shing' }
                  ],
                  hint: '<input type="text" placeholder="Ismingiz" style="color: red; background-color: blue;">\n\n<button style="color: white;">Yuborish</button>',
                  explanation: 'Zo‘r! `color` — matn rangi, `background-color` — fon rangi. Rang nomlari English tilida yoziladi.',
                  xp: 10
                },
                {
                  id: 'l7bonusjs',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — JS: Salom, [ism]! 👋',
                  instruction: 'Tugma bosilganda inputdagi ism bilan **"Salom, [ism]!"** alert chiqarsin. `<script>` ichidagi comment o‘rniga darsda o‘rgangan JavaScript kodini yozing.',
                  startCode: '<input id="name" type="text" placeholder="Ismingizni kiriting">\n\n<button id="sendBtn">Yuborish</button>\n\n<script>\n// Bu yerga JavaScript yozing\n</script>',
                  checks: [
                    { re: 'getElementById\\s*\\(\\s*["\']sendBtn["\']\\s*\\)', msg: '`document.getElementById("sendBtn")` bilan tugmani toping' },
                    { re: 'addEventListener\\s*\\(\\s*["\']click["\']', msg: '`addEventListener("click", ...)` bilan bosishni kuting' },
                    { re: '\\.value', msg: '`.value` — input ichidagi qiymatni oling' },
                    { re: 'alert\\s*\\(', msg: '`alert(...)` bilan xabar chiqaring' }
                  ],
                  hint: 'const button = document.getElementById("sendBtn");\nbutton.addEventListener("click", function() {\n  const name = document.getElementById("name").value;\n  alert("Salom, " + name + "! 👋");\n});',
                  explanation: 'Super! `input.value` — yozilgan qiymat. `alert()` — xabar oynasi. Bu — sizning birinchi interaktiv dasturingiz! 🎉',
                  xp: 10
                }
              ],
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: '`<form>` nima?',
                  options: ['Foydalanuvchi ma‘lumot kiritish uchun hudud', 'Sahifa sarlavhasi', 'Rasm konteyneri', 'CSS fayli'],
                  answer: 0,
                  explanation: '`<form>` — foydalanuvchi ma‘lumot kiritadigan hudud. Ichiga input, label, button qo‘yiladi.'
                },
                {
                  question: '`<label>`ning `for` atributi nima qiladi?',
                  options: ['Labelni id orqali input bilan bog‘laydi', 'Label rangini o‘zgartiradi', 'Formani yuboradi', 'Input turini belgilaydi'],
                  answer: 0,
                  explanation: '`for="name"` qiymati inputning `id` si bilan bir xil bo‘lishi kerak — ular shu orqali bog‘lanadi.'
                },
                {
                  question: 'Foydalanuvchi yozadigan maydon qaysi teg?',
                  options: ['`<label>`', '`<input>`', '`<form>`', '`<button>`'],
                  answer: 1,
                  explanation: '`<input>` — foydalanuvchi ma‘lumot yozadigan maydon. Yopiluvchi tegi yo‘q.'
                },
                {
                  question: 'Email kiritish uchun qaysi input turi?',
                  options: ['`type="text"`', '`type="email"`', '`type="password"`', '`type="mail"`'],
                  answer: 1,
                  explanation: '`type="email"` — brauzer email formatini (@ belgisi) tekshiradi.'
                },
                {
                  question: '`placeholder` nima?',
                  options: ['Input ichida ko‘rinadigan yordamchi matn — yozganda g‘oyib bo‘ladi', 'Inputning qiymati', 'Forma nomi', 'Tugma matni'],
                  answer: 0,
                  explanation: '`placeholder` — input ichidagi yordamchi matn. Foydalanuvchi yozishni boshlaganda g‘oyib bo‘ladi.'
                },
                {
                  question: 'Parolni yashirish uchun qaysi input turi?',
                  options: ['`type="hidden"`', '`type="text"`', '`type="password"`', '`type="secret"`'],
                  answer: 2,
                  explanation: '`type="password"` — yozilgan belgilar • • • nuqta ko‘rinishida yashirinadi.'
                },
                {
                  question: '`color: red;` nimani o‘zgartiradi?',
                  options: ['Elementning fonini', 'MATN rangini', 'Sahifa nomini', 'Input turini'],
                  answer: 1,
                  explanation: '`color` — MATN rangi. Fon uchun `background-color` ishlatiladi.'
                },
                {
                  question: '`background-color: blue;` natijada nima bo‘ladi?',
                  options: ['Matn ko‘k bo‘ladi', 'Elementning ORQA FONI ko‘k bo‘ladi', 'Hech narsa', 'Link ko‘k bo‘ladi'],
                  answer: 1,
                  explanation: '`background-color` — elementning orqa fon rangi. `blue` — ko‘k (English).'
                },
                {
                  question: 'REVIEW (3-dars): `id` nima?',
                  options: ['Ko‘p elementga beriladigan guruh nomi', 'Elementning O‘ZIGA XOS yagona nomi', 'Rasm manzili', 'Link matni'],
                  answer: 1,
                  explanation: 'id — sahifada faqat BIRTA elementga beriladigan yagona nom. JS aynan id orqali elementni topadi.'
                },
                {
                  question: 'JavaScriptda elementni id orqali topish qaysi kod?',
                  options: ['`document.getElementById("sendBtn")`', '`document.find("sendBtn")`', '`button.get("sendBtn")`', '`searchId("sendBtn")`'],
                  answer: 0,
                  explanation: '`document.getElementById("...")` — id orqali elementni topadi. Keyin `addEventListener("click", ...)` bilan bosishni kutasiz.'
                }
              ]
            }
          },
          {
            title: 'Formani kuchaytirish: required, textarea, select va JavaScript validation',
            duration: 30,
            xp: 30,
            content: {
              intro: 'Bugun formani **KUCHAYTIRAMIZ**! 💪\n\n• 🚫 `required` — bo‘sh yuborishni taqiqlaydi\n• 📛 `name` va `value` — maydonga nom va qiymat\n• 📝 `textarea` — ko‘p qatorli matn\n• 📋 `select` — tanlash oynasi\n• 🎨 ozgina CSS, keyin **JavaScript validation**\n\nOxirida forma sizning ISMINGIZ bilan salomlaydi! 🤖',
              quizQuestionCount: 10,
              reviewQuiz: {
                id: 'l8review',
                title: '🔁 TEZKOR ESLATMA — eslaymiz!',
                subtitle: '1–7-darslardan eng kerakli tushunchalar. Har bir savol bittadan chiqadi.',
                xp: 10,
                questions: [
                  {
                    q: '`<h1>` nima?',
                    o: ['Eng katta va eng muhim sarlavha', 'Oddiy paragraf', 'Rasm elementi', 'Link elementi'],
                    a: 0,
                    hint: '1-darsdan eslang: h1–h6 sarlavhalar, h1 — eng kattasi.'
                  },
                  {
                    q: '`href` nima?',
                    o: ['Rasm manzili', 'Link manzili (URL)', 'Sahifa nomi', 'Forma nomi'],
                    a: 1,
                    hint: '4-darsdan eslang: `<a href="...">` — link qayerga o‘tishini ko‘rsatadi.'
                  },
                  {
                    q: '`alt` nima?',
                    o: ['Rasm tavsifi — rasm yuklanmasa ko‘rinadi', 'Element nomi', 'Matn rangi', 'Link matni'],
                    a: 0,
                    hint: '4-darsdan eslang: `<img src alt>` — alt rasm haqida qisqa matn.'
                  },
                  {
                    q: '`id` nima?',
                    o: ['Guruh nomi', 'Rasm manzili', 'Elementning O‘ZIGA XOS yagona nomi', 'Forma turi'],
                    a: 2,
                    hint: '3-darsdan eslang: id — faqat BIRTA elementga beriladigan yagona nom.'
                  },
                  {
                    q: '`class` nima?',
                    o: ['Yagona nom — faqat bittaga', 'Guruh nomi — ko‘p elementlarga beriladi', 'Link manzili', 'Input turi'],
                    a: 1,
                    hint: '3-darsdan eslang: class — GURUH nomi; id esa faqat bittaga.'
                  },
                  {
                    q: '`<form>` nima?',
                    o: ['Foydalanuvchi ma‘lumot kiritish uchun hudud', 'Sarlavha', 'Rasm konteyneri', 'Ro‘yxat'],
                    a: 0,
                    hint: '7-darsdan eslang: forma ichiga input, label, button qo‘yiladi.'
                  },
                  {
                    q: '`<input>` nima?',
                    o: ['Maydon nomi', 'Foydalanuvchi ma‘lumot yozadigan maydon', 'Tugma', 'Fon rangi'],
                    a: 1,
                    hint: '7-darsdan eslang: input — yozish maydoni, yopiluvchi tegi yo‘q.'
                  },
                  {
                    q: '`type="email"` nima qiladi?',
                    o: ['Matn yozadi', 'Email formatini (@) tekshiradi', 'Parol yashiradi', 'Rasm chizadi'],
                    a: 1,
                    hint: '7-darsdan eslang: type — input TURI. Email uchun alohida tur bor.'
                  },
                  {
                    q: '`placeholder` nima?',
                    o: ['Inputning qiymati', 'Forma nomi', 'Input ichidagi yordamchi matn — yozganda g‘oyib bo‘ladi', 'Tugma matni'],
                    a: 2,
                    hint: '7-darsdan eslang: placeholder — yozishni boshlaganda g‘oyib bo‘ladi.'
                  },
                  {
                    q: '`color: red;` nimani o‘zgartiradi?',
                    o: ['Fon rangini', 'MATN rangini', 'Sahifa nomini', 'Input turini'],
                    a: 1,
                    hint: '5–7-darsdan eslang: color — MATN rangi, background-color — fon rangi.'
                  }
                ]
              },
              sections: [
                {
                  title: 'required — bo‘sh qoldirish taqiqlangan! 🚫',
                  text: '**Bu nima?** `required` — inputni **bo‘sh qoldirib yuborishni TAQIQLAYDIGAN** atribut.\n\n**Nima uchun kerak?** Ismsiz yuborilgan ro‘yxatdan o‘tish formasi foydasiz! Brauzer o‘zi tekshiradi: maydon bo‘sh bo‘lsa — yubormaydi va ogohlantiradi.\n\n**Qayerga yoziladi?** Opening tag ICHIDA, qiymatsiz — shunchaki so‘z.',
                  code: '<!-- Avval: bo‘sh ham yuboriladi -->\n<input type="text">\n\n<!-- Keyin: bo‘sh yuborib BO‘LMAYDI -->\n<input type="text" required>',
                  codeNote: '• `type="text"` — oddiy matn maydoni\n• `required` — qiymatsiz atribut: faqat so‘z, `=` va `"` KERAK EMAS\n• Maydon bo‘sh bo‘lsa — brauzer yuborishni TO‘XTATADI',
                  result: 'Bo‘sh input bilan Yuborishni bossangiz — brauzer yubormaydi va ogohlantirish chiqaradi!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><div style="margin-bottom:6px;color:#94a3b8;font-size:13px;">Avval: bo‘sh ham yuboriladi</div><input type="text" placeholder="Ismingiz" style="width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;margin-bottom:10px;"><div style="margin-bottom:6px;color:#94a3b8;font-size:13px;">Keyin: required bilan</div><input type="text" required placeholder="Ismingiz" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ef4444;background:#1e293b;color:#f8fafc;"><div style="color:#f59e0b;font-size:13px;margin-top:6px;">🚫 Bo‘sh yuborsangiz: &quot;Please fill out this field&quot;</div></div>',
                  demoButton: { label: '🖱 Bo‘sh yuborib ko‘r — brauzer xabari', msg: '⚠️ Brauzer shunday degan bo‘lardi: "Please fill out this field" — maydon bo‘sh, yuborilmadi!' },
                  playground: true
                },
                {
                  title: 'name — maydonga nom berish 📛',
                  text: '**Bu nima?** `name` — maydonga **NOM beradigan** atribut. Forma yuborilganda har bir maydon shu nom bilan yuboriladi.\n\n**Nima uchun kerak?** Yuborilgan ma‘lumotda "bu qiymat KIMniki?" degan chalkashlik bo‘lmasligi uchun. `name="username"` — bu maydon ism ekan, aniq.\n\n**Qayerga yoziladi?** Opening tag ichida, `name="qiymat"` ko‘rinishida.',
                  code: '<input\n  type="text"\n  name="username">',
                  codeNote: '• `name` — atribut nomi\n• `"username"` — maydonga bergan NOMINGIZ\n• `id` dan farqi: id — sahifa ICHIDA (JS/CSS uchun), name — forma YUBORILGANDA qiymat bilan birga ketadi',
                  result: 'Ko‘rinishda hech narsa o‘zgarmaydi — lekin forma yuborilganda bu maydon "username" nomi bilan ketadi.',
                  playground: true
                },
                {
                  title: 'value — boshlang‘ich qiymat 💡',
                  text: '**Bu nima?** `value` — inputning **BOSHLANG‘ICH QIYMATI**. Sahifa ochilganda input ichida shu matn turgan bo‘ladi.\n\n**Nima uchun kerak?** Foydalanuvchiga tayyor qiymat berish uchun. U uni o‘chirib, o‘zgartirishi mumkin.',
                  code: '<input\n  type="text"\n  value="Ahatjon">',
                  codeNote: '• `value` — atribut\n• `"Ahatjon"` — sahifa ochilganda input ICHIDA turgan matn\n• `placeholder` dan farqi: placeholder — ko‘rsatma (yozganda g‘oyib bo‘ladi), value — HAQIQIY qiymat',
                  result: 'Input ichida "Ahatjon" yozilgan bo‘ladi. Uni o‘chirib, o‘z ismingizni yozing — endi qiymat sizniki!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><input type="text" value="Ahatjon" style="width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"></div>',
                  playground: true
                },
                {
                  title: 'textarea — ko‘p qatorli matn 📝',
                  text: '**Bu nima?** `<textarea></textarea>` — **KO‘P QATORLI** matn kiritish joyi. Input bitta qator, textarea esa nechta qator.\n\n**Nima uchun kerak?** Xabar, izoh, sharh yozish uchun — qisqa matn inputga, uzun matn textareaga.\n\n**Qayerga yoziladi?** Forma ichida. E‘tibor bering: textarea — YOPILUVCHI tegi BOR element!',
                  code: '<textarea\n  placeholder="Xabaringizni yozing">\n</textarea>',
                  codeNote: '• `<textarea>` — ochiluvchi teg\n• `placeholder="..."` — bo‘sh holda ko‘rinadigan yordamchi matn\n• `</textarea>` — yopiluvchi teg (inputdan FARQI!)',
                  result: 'Bir necha qatorga cho‘zilgan katta yozish maydoni chiqadi. Burchagidan tortib kattalashtirish ham mumkin.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><textarea placeholder="Xabaringizni yozing" rows="3" style="width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;resize:vertical;"></textarea></div>',
                  playground: true
                },
                {
                  title: 'select va option — tanlash oynasi 📋',
                  text: '**Bu nima?** `<select>` — **tanlash oynasi** (dropdown). Ichidagi har bir `<option>` — tanlashdagi **bitta variant**.\n\n**Nima uchun kerak?** Foydalanuvchi yozishi shart emas — tayyor ro‘yxatdan BITTASINI tanlaydi. Xatolik kamayadi.\n\n**Qayerga yoziladi?** `<select>...</select>` ichiga optionlar qo‘yiladi.',
                  code: '<select>\n  <option>HTML</option>\n  <option>CSS</option>\n  <option>JavaScript</option>\n</select>',
                  codeNote: '• `<select>` — tanlash oynasi ochadi\n• `<option>HTML</option>` — bitta variant: matni teglar ORASIDA yoziladi\n• Har bir option — alohida qator',
                  result: 'O‘qchali (▲▼) tanlash oynasi chiqadi. Bosganda HTML, CSS, JavaScript ro‘yxati ochiladi — bittasini tanlaysiz.',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><select style="width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"><option>HTML</option><option>CSS</option><option>JavaScript</option></select></div>',
                  playground: true
                },
                {
                  title: 'CSS bilan formani chiroyli qilamiz 🎨',
                  text: '**CSSsiz** forma oddiy ko‘rinadi. **CSS bilan** — juda sodda 4 ta property bilan chiroyli qilamiz:\n\n• `background-color` — inputning FON rangi\n• `color` — yozilgan MATN rangi\n• `border` — atrofidagi chiziq\n• `border-radius` — burchaklarni yumaloqlash\n\nHammasi 7-darsgacha o‘rgangan bilimlarimiz! Qayerga? `style="..."` atributi ichiga.',
                  code: '<!-- CSSsiz -->\n<label>Ism</label>\n<input type="text">\n\n<!-- CSS bilan -->\n<input\n  type="text"\n  placeholder="Ismingiz"\n  style="\n    color: white;\n    background-color: #1e293b;\n    border: 2px solid #6366f1;\n    border-radius: 10px;\n  ">',
                  codeNote: '• `color: white;` — yozgan matningiz OQ\n• `background-color: #1e293b;` — input FONI to‘q ko‘k-qora\n• `border: 2px solid #6366f1;` — 2px qalinlikda binafsha chiziq\n• `border-radius: 10px;` — burchaklar yumaloq\n• Har bir qoidadan keyin `;`',
                  result: 'To‘q fonli, oq matnli, binafsha chiziqli, yumaloq burchakli zamonaviy input!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;"><div style="margin-bottom:6px;color:#94a3b8;font-size:13px;">CSSsiz:</div><input type="text" placeholder="Ismingiz" style="width:100%;padding:8px;margin-bottom:12px;"><div style="margin-bottom:6px;color:#94a3b8;font-size:13px;">CSS bilan:</div><input type="text" placeholder="Ismingiz" style="width:100%;padding:10px;color:white;background-color:#1e293b;border:2px solid #6366f1;border-radius:10px;"></div>',
                  playground: true
                },
                {
                  title: 'Elementlarni bittadan eslaymiz 🧱',
                  text: 'Endi HAMMASINI birlashtiramiz. Har bir elementning roli:\n\n• **`<form>`** — hammasi UNING ICHIDA turadi\n• **`<label for="name">`** — maydon nomi; `for` qiymati inputning `id` si bilan BIR XIL\n• **`<input id="name" name="username" type="text" required>`** — yozish maydoni; id — JS uchun, name — yuborish uchun, required — bo‘sh yuborilmasin\n• **`<textarea>`** — ko‘p qatorli xabar\n• **`<select>` + `<option>`** — tanlash oynasi\n• **`<button type="submit">`** — yuborish tugmasi; `type="submit"` = formani yubor',
                  code: '<!-- Qadamlar: 1) form  2) label  3) input  4) textarea  5) select  6) button -->\n<form>\n\n  <label for="name">Ismingiz</label>\n  <input id="name" name="username" type="text"\n         placeholder="Ismingiz" required>\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email"\n         placeholder="Emailingiz" required>\n\n  <label for="message">Xabar</label>\n  <textarea id="message" name="message"\n            placeholder="Xabaringiz"></textarea>\n\n  <label for="course">Kurs</label>\n  <select id="course" name="course">\n    <option>HTML</option>\n    <option>CSS</option>\n    <option>JavaScript</option>\n  </select>\n\n  <button type="submit">Yuborish</button>\n\n</form>',
                  codeNote: '• Har bir label FOR = input ID — juftlik shu orqali bog‘lanadi\n• `type="email"` — email formatini ham tekshiradi\n• Barcha maydonlarda `name` bor — yuborilganda hammasi nomi bilan ketadi\n• `required` — ism va email bo‘sh bo‘lsa yuborilmaydi',
                  result: 'To‘liq ishlaydigan forma: ism, email, xabar, kurs tanlash va Yuborish tugmasi!',
                  previewHtml: '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;font-size:13px;"><div style="border:2px dashed #6366f1;border-radius:12px;padding:12px;"><div style="margin-bottom:4px;">👤 Ismingiz</div><input placeholder="Ismingiz" style="width:100%;padding:8px;margin-bottom:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"><div style="margin-bottom:4px;">📧 Email</div><input placeholder="Emailingiz" style="width:100%;padding:8px;margin-bottom:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"><div style="margin-bottom:4px;">💬 Xabar</div><textarea rows="2" placeholder="Xabaringiz" style="width:100%;margin-bottom:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"></textarea><div style="margin-bottom:4px;">🎓 Kurs</div><select style="width:100%;padding:8px;margin-bottom:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;"><option>HTML</option><option>CSS</option><option>JavaScript</option></select><button style="width:100%;padding:10px;border-radius:10px;border:none;background:#6366f1;color:#fff;font-weight:600;">Yuborish</button></div></div>',
                  playground: true
                },
                {
                  title: 'HTML + CSS + JavaScript — kim nima qiladi? 🤝',
                  text: 'Endi 3 qahramonning roli aniq:\n\n• **HTML** → formani YARATADI (tuzilma)\n• **CSS** → formani CHIROYLI qiladi (ko‘rinish)\n• **JavaScript** → forma QANDAY ISHLASHINI boshqaradi (interaktivlik)\n\nFormani yuborganda nima bo‘lishini JavaScript YOZADI. Shu darsda eng sodda yo‘li bilan o‘rganamiz.',
                  code: '<!-- HTML: tuzilma -->\n<form id="myForm">\n  <input id="name" type="text">\n  <button type="submit">Yuborish</button>\n</form>\n\n<!-- CSS: ko‘rinish (style ichida) -->\n<!-- JS: ishlash (script ichida) -->',
                  codeNote: '• `<form id="myForm">` — formaga id berdik: JS shu orqali topadi\n• `<script>` — JavaScript yozish joyi, `<body>` OXIRIGA qo‘yiladi',
                  result: 'Hozircha ko‘rinish bir xil — lekin endi formaga JS ulashga tayyormiz!',
                  playground: true
                },
                {
                  title: 'submit — forma yuborilishi 🚀',
                  text: '**submit** — forma YUBORILGANDA sodir bo‘ladigan **hodisa** (event).\n\n• `event` → sodir bo‘lgan hodisa haqidagi ma‘lumot (bizga `e` deb beriladi)\n• `preventDefault()` → browserning ODATIY submit harakatini (sahifani yangilash) VAQTINCHA to‘xtatadi',
                  code: 'const form = document.getElementById("myForm");\n\nform.addEventListener("submit", function (e) {\n  e.preventDefault();\n  // endi shu yerda O‘Z kodimiz ishlaydi\n});',
                  codeNote: '• `addEventListener("submit", ...)` — formadan submit hodisasini KUTAMIZ\n• `function (e)` — `e` = hodisa (event) obyekti\n• `e.preventDefault();` — sahifa YANGILANMAYDI, bizning kod ishlaydi\n• `click` EMAS, `submit` — formada submit ishlatiladi!',
                  result: 'Yuborish bosilganda sahifa yangilanmaydi — boshqaruv JavaScriptga o‘tadi.',
                  playground: true
                },
                {
                  title: 'getElementById va .value — yozilgan qiymatni olish 💡',
                  text: 'Foydalanuvchi inputga yozgan matnni olish uchun:\n\n• `const` → qiymatni saqlash uchun o‘zgaruvchi\n• `nameInput` → biz bergan o‘zgaruvchi nomi\n• `document` → sahifa\n• `getElementById` → id orqali elementni TOPADI\n• `"name"` → elementning id qiymati\n• `.value` → input ICHIGA yozilgan qiymat',
                  code: 'const nameInput = document.getElementById("name");\n\nform.addEventListener("submit", function (e) {\n  e.preventDefault();\n  alert(nameInput.value);\n});',
                  codeNote: '• `document.getElementById("name")` — "id si name bo‘lgan elementni top"\n• `nameInput.value` — inputdagi yozilgan matn\n• `.value` — inputlarning FAQATGINA o‘ziga xos xususiyati',
                  result: 'Yuborish bosilganda inputga yozgan matningiz alertda chiqadi!',
                  playground: true
                },
                {
                  title: 'REAL INTERACTION — Salom, Ahatjon! 👋',
                  text: 'Endi haqiqiy narsa! Ism yozing: **Ahatjon**, Yuborishni bosing → **"Salom, Ahatjon! 👋"** chiqadi.\n\nMantiq oddiy: `"Salom, " + name + "!"` — matnlarni `+` bilan birlashtiramiz.',
                  code: '<form id="myForm">\n  <input id="name" type="text" placeholder="Ismingiz">\n  <button type="submit">Yuborish</button>\n</form>\n\n<script>\nconst form = document.getElementById("myForm");\nconst nameInput = document.getElementById("name");\n\nform.addEventListener("submit", function (e) {\n  e.preventDefault();\n  alert("Salom, " + nameInput.value + "! 👋");\n});\n</script>',
                  codeNote: '• `"Salom, "` — oddiy matn\n• `nameInput.value` — siz yozgan ism\n• `+` — matnlarni BIRLASHTIRADI\n• Natija: Salom, Ahatjon! 👋',
                  result: 'Ismingizni yozib yuborsangiz — forma sizni ismingiz bilan salomlaydi! 🎉\n\nQuyidagi demo tugmasini bosing — aynan shu JS ishlayapti:',
                  demoButton: { label: '🖱 Demo: Salom, Ahatjon!', msg: 'Salom, Ahatjon! 👋' },
                  playground: true
                },
                {
                  title: 'if va alert — JavaScript validation ✅',
                  text: 'Ism BO‘SH bo‘lsa-chi? Tekshirish kerak!\n\n• `if` → shart TEKSHIRADI: "agar shart to‘g‘ri bo‘lsa — ichidagi kod bajariladi"\n• `!` → "YO‘Q" yoki inkor: `!nameInput.value` = "inputdagi qiymat YO‘Q"\n• `value` → inputdagi qiymat (bo‘sh = "yo‘q")\n• `alert` → xabar oynasi chiqaradi\n\n`{ }` qavslar ichiga faqat shart TO‘G‘RI bo‘lsa bajariladigan kod yoziladi.',
                  code: 'form.addEventListener("submit", function (e) {\n  e.preventDefault();\n\n  if (!nameInput.value) {\n    alert("Ismingizni kiriting!");\n    return;\n  }\n\n  if (!emailInput.value) {\n    alert("Emailingizni kiriting.");\n    return;\n  }\n\n  alert("Salom, " + nameInput.value + "! 👋");\n});',
                  codeNote: '• `if (!nameInput.value)` — agar input BO‘SH bo‘lsa\n• `alert("Ismingizni kiriting!")` — ogohlantirish chiqadi\n• `return;` — shu yerdan chiqib ket: qolgan kod bajarilmaydi\n• Ketma-ket ikki if: avval ism, keyin email tekshiriladi',
                  result: 'Bo‘sh yuborsangiz — "Ismingizni kiriting!" chiqadi. To‘ldirsangiz — "Salom, [ism]! 👋"',
                  demoButton: { label: '🖱 Demo: bo‘sh yubordim', msg: 'Ismingizni kiriting!' },
                  playground: true
                }
              ],
              keyPoints: [
                '`required` — qiymatsiz atribut: maydon bo‘sh bo‘lsa brauzer yubormaydi',
                '`name` — forma yuborilganda maydon shu NOM bilan ketadi',
                '`value` — inputning boshlang‘ich qiymati; `.value` — JSdagi yozilgan qiymat',
                '`<textarea>...</textarea>` — ko‘p qatorli matn (yopiluvchi tegi BOR)',
                '`<select>` — tanlash oynasi, `<option>` — bitta variant',
                'Formada `click` emas, `submit` event ishlatiladi',
                '`e.preventDefault()` — sahifa yangilanishini vaqtincha to‘xtatadi',
                '`document.getElementById("id")` — elementni topadi, `.value` — qiymatini beradi',
                '`if (!qiymat)` — "qiymat yo‘q" bo‘lsa ichidagi kod bajariladi; `alert()` — xabar oynasi',
                'CSS: `color` → matn · `background-color` → fon · `border` → chiziq · `border-radius` → yumaloq burchak'
              ],
              motivationTitle: '🚀 KEYINGI DARS: 9-DARS',
              motivation: '**Formangiz endi haqiqiy darajada!** 🏆\n\n• ✅ required bilan himoyalangan\n• ✅ textarea va select bilan to‘liq\n• ✅ JavaScript bilan tirik\n\nKeyingi darslarda yanada kuchli mavzular kutib turadi. Kuting! 😉',
              gamesTitle: '🎮 MINI-O‘YINLAR — BILIMNI MUSTAHKAMLAYMIZ',
              games: [
                {
                  id: 'l8reqdoc',
                  type: 'quizgame',
                  icon: '🩺',
                  title: 'O‘yin 1 — Required Doctor',
                  desc: 'Maydonni bo‘sh qoldirmaslik uchun nima kerak?',
                  xp: 10,
                  questions: [
                    {
                      q: 'Maydonni **bo‘sh qoldirib yuborilmasligi** uchun nima kerak?',
                      o: ['`required`', '`placeholder`', '`value`'],
                      a: 0,
                      hint: '`required` — brauzerga "bu maydon bo‘sh bo‘lmasin" deb aytadi.'
                    },
                    {
                      q: '`required` qanday yoziladi?',
                      o: ['`required="yes"`', 'Faqat so‘z: `required`', '`required="true"`'],
                      a: 1,
                      hint: 'required — qiymatsiz atribut: opening tag ichida shunchaki so‘z.'
                    },
                    {
                      q: 'Bo‘sh required maydonni yuborsangiz nima bo‘ladi?',
                      o: ['Hech narsa', 'Brauzer yubormaydi va ogohlantiradi', 'Sahifa o‘chadi'],
                      a: 1,
                      hint: 'Brauzer o‘zi tekshiradi: "Please fill out this field".'
                    }
                  ]
                },
                {
                  id: 'l8formpick',
                  type: 'quizgame',
                  icon: '🧠',
                  title: 'O‘yin 2 — Formani tanla',
                  desc: 'Qaysi element qayerda ishlaydi?',
                  xp: 10,
                  questions: [
                    {
                      q: '**Ko‘p qatorli matn** uchun qaysi element?',
                      o: ['`<input>`', '`<textarea>`', '`<select>`'],
                      a: 1,
                      hint: '`<textarea></textarea>` — bir necha qatorli yozish maydoni.'
                    },
                    {
                      q: '`<textarea>`da yordamchi matn qaysi atributda?',
                      o: ['`value`', '`name`', '`placeholder`'],
                      a: 2,
                      hint: '`placeholder="Xabaringizni yozing"` — yozishni boshlaganda g‘oyib bo‘ladi.'
                    },
                    {
                      q: 'Qaysi elementning YOPILUVCHI tegi bor?',
                      o: ['`<input>`', '`<textarea>`', 'Ikkalasida ham yo‘q'],
                      a: 1,
                      hint: '`<input>` — yopilmaydi, `<textarea>` esa `</textarea>` bilan yopiladi.'
                    }
                  ]
                },
                {
                  id: 'l8choice',
                  type: 'quizgame',
                  icon: '📋',
                  title: 'O‘yin 3 — Choice Maker',
                  desc: 'Variantlardan bittasini tanlash uchun nima kerak?',
                  xp: 10,
                  win: '✅ Choice Maker — barcha javoblar to‘g‘ri!',
                  questions: [
                    {
                      q: '**Variantlardan bittasini tanlash** uchun qaysi element?',
                      o: ['`<input>`', '`<select>`', '`<textarea>`'],
                      a: 1,
                      hint: '`<select>` — dropdown tanlash oynasi ochadi.'
                    },
                    {
                      q: 'Tanlash oynasidagi BITTA variant qaysi teg?',
                      o: ['`<option>`', '`<select>`', '`<li>`'],
                      a: 0,
                      hint: '`<option>HTML</option>` — select ICHIDA turadi.'
                    },
                    {
                      q: 'Formani yuborishda qaysi event ishlatiladi?',
                      o: ['`"click"`', '`"submit"`', '`"change"`'],
                      a: 1,
                      hint: 'Formada `addEventListener("submit", ...)` ishlatiladi.'
                    }
                  ]
                }
              ],
              exercises: [
                {
                  id: 'l8ex1',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 1 — Ism inputiga required qo‘shing 🚫',
                  instruction: 'Quyidagi inputga **required** atributini qo‘shing — bo‘sh yuborilmasin!',
                  startCode: '<input type="text" name="username" placeholder="Ismingiz">',
                  checks: [
                    { re: '<input[\\s>]', msg: '`<input>` elementi saqlangan bo‘lishi kerak' },
                    { re: 'type\\s*=\\s*["\']text["\']', msg: '`type="text"` saqlangan bo‘lsin' },
                    { re: '<input[^>]*\\srequired(?![\\w-])', msg: 'input ichiga `required` so‘zini qo‘shing (qiymatsiz!)' }
                  ],
                  hint: '<input type="text" name="username" placeholder="Ismingiz" required>',
                  explanation: '`required` — qiymatsiz atribut. Maydon bo‘sh bo‘lsa brauzer yubormaydi va ogohlantiradi.',
                  xp: 10
                },
                {
                  id: 'l8ex2',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 2 — Textarea va select yarating 📝',
                  instruction: 'Bitta `<textarea>` (placeholder bilan) va bitta `<select>` (kamida 2 ta `<option>` bilan) yarating.',
                  startCode: '<!-- Bu yerga textarea va select yozing -->',
                  checks: [
                    { re: '<textarea[\\s>][\\s\\S]*<\\/textarea>', msg: '`<textarea>...</textarea>` kerak (yopiluvchi tegi bilan!)' },
                    { re: '<textarea[^>]*placeholder\\s*=\\s*["\'][^"\']+["\']', msg: 'textareaga `placeholder="..."` qo‘shing' },
                    { re: '<select[\\s>][\\s\\S]*<\\/select>', msg: '`<select>...</select>` kerak' },
                    { re: '(?:[\\s\\S]*<option[\\s>][\\s\\S]*<\\/option>){2}', msg: 'select ichida kamida 2 ta `<option>...</option>` kerak' }
                  ],
                  hint: '<textarea placeholder="Xabaringizni yozing"></textarea>\n\n<select>\n  <option>HTML</option>\n  <option>CSS</option>\n</select>',
                  explanation: '`textarea` — ko‘p qatorli matn, `select` + `option` — tanlash oynasi. Ikkalasi ham forma elementlari!',
                  xp: 10
                },
                {
                  id: 'l8ex3',
                  type: 'liveedit',
                  mode: 'simple',
                  title: 'MASHQ 3 — To‘liq ishlaydigan forma yarating 🧩',
                  instruction: '`<form>` ichida: ism (text, required), email (email, required), message (textarea) va `<button type="submit">` yarating.',
                  startCode: '<!-- Bu yerga to‘liq formani yozing -->',
                  checks: [
                    { re: '<form[\\s>][\\s\\S]*<\\/form>', msg: '`<form>...</form>` kerak — hammasi ichida' },
                    { re: 'type\\s*=\\s*["\']text["\'][^>]*>', msg: 'Ism uchun `type="text"` input kerak' },
                    { re: '<input[^>]*type\\s*=\\s*["\']text["\'][^>]*\\srequired(?![\\w-])|<input[^>]*\\srequired(?![\\w-])[^>]*type\\s*=\\s*["\']text["\']', msg: 'Ism inputida `required` bo‘lsin' },
                    { re: 'type\\s*=\\s*["\']email["\']', msg: 'Email uchun `type="email"` input kerak' },
                    { re: '<textarea[\\s>]', msg: 'Xabar uchun `<textarea>` kerak' },
                    { re: '<button[^>]*type\\s*=\\s*["\']submit["\'][\\s\\S]*<\\/button>', msg: '`<button type="submit">...</button>` kerak' }
                  ],
                  hint: '<form>\n  <label for="name">Ismingiz</label>\n  <input id="name" name="username" type="text" placeholder="Ismingiz" required>\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" placeholder="Emailingiz" required>\n\n  <label for="message">Xabar</label>\n  <textarea id="message" name="message" placeholder="Xabaringiz"></textarea>\n\n  <button type="submit">Yuborish</button>\n</form>',
                  explanation: 'Zo‘r! To‘liq forma: form → label → input (required!) → textarea → button. Endi haqiqiy sayt formasini yasaysiz!',
                  xp: 10
                },
                {
                  id: 'l8bonuscss',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — Input va tugmani CSS bilan bezang 🎨',
                  instruction: 'Ixtiyoriy: Input fonini **#1e293b** qiling, matnini **white** qiling, border-radius **10px** bering. Buttonga `background-color: #6366f1; color: white;` bering.',
                  startCode: '<input type="text" placeholder="Ismingiz">\n\n<button type="submit">Yuborish</button>',
                  checks: [
                    { re: '<input[^>]*style\\s*=\\s*"[^"]*background-color\\s*:\\s*#1e293b', msg: 'Inputga `background-color: #1e293b;` qo‘shing' },
                    { re: '<input[^>]*style\\s*=\\s*"[^"]*color\\s*:\\s*white', msg: 'Inputga `color: white;` qo‘shing' },
                    { re: '<input[^>]*style\\s*=\\s*"[^"]*border-radius\\s*:\\s*10px', msg: 'Inputga `border-radius: 10px;` qo‘shing' },
                    { re: '<button[^>]*style\\s*=\\s*"[^"]*background-color\\s*:\\s*#6366f1', msg: 'Buttonga `background-color: #6366f1;` qo‘shing' },
                    { re: '<button[^>]*style\\s*=\\s*"[^"]*color\\s*:\\s*white', msg: 'Buttonga `color: white;` qo‘shing' }
                  ],
                  hint: '<input type="text" placeholder="Ismingiz" style="color: white; background-color: #1e293b; border-radius: 10px;">\n\n<button type="submit" style="background-color: #6366f1; color: white; border-radius: 10px;">Yuborish</button>',
                  explanation: 'Super! `background-color` — fon, `color` — matn, `border-radius` — yumaloq burchak. Forma chiroyli bo‘ldi! 🎨',
                  xp: 10
                },
                {
                  id: 'l8bonusjs',
                  type: 'liveedit',
                  mode: 'simple',
                  bonus: true,
                  title: '🎁 BONUS — JS validation: Salom, [ism]! 👋',
                  instruction: 'Tugma bosilganda: ism bo‘sh bo‘lsa **"Ismingizni kiriting."** alert chiqsin, to‘ldirilgan bo‘lsa **"Salom, [ism]!"** chiqsin. `<script>` ichidagi comment o‘rniga darsda o‘rgangan JavaScriptni yozing.',
                  startCode: '<form id="myForm">\n  <input id="name" type="text" placeholder="Ismingiz">\n  <button type="submit">Yuborish</button>\n</form>\n\n<script>\n// Bu yerga JavaScript yozing\n</script>',
                  checks: [
                    { re: 'getElementById\\s*\\(\\s*["\']myForm["\']\\s*\\)', msg: '`document.getElementById("myForm")` bilan formani toping' },
                    { re: 'addEventListener\\s*\\(\\s*["\']submit["\']', msg: '`addEventListener("submit", ...)` bilan yuborishni kuting' },
                    { re: 'preventDefault\\s*\\(\\s*\\)', msg: '`e.preventDefault()` — sahifa yangilanmasin' },
                    { re: 'if\\s*\\(\\s*!', msg: '`if (!nameInput.value)` bilan bo‘shlikni tekshiring' },
                    { re: 'alert\\s*\\(\\s*["\']Ismingizni kiriting', msg: 'Bo‘sh bo‘lsa: `alert("Ismingizni kiriting.")`' },
                    { re: '\\.value', msg: '`.value` bilan ismni oling va "Salom, " + ism + "!" alert qiling' }
                  ],
                  hint: 'const form = document.getElementById("myForm");\nconst nameInput = document.getElementById("name");\n\nform.addEventListener("submit", function (e) {\n  e.preventDefault();\n  if (!nameInput.value) {\n    alert("Ismingizni kiriting.");\n    return;\n  }\n  alert("Salom, " + nameInput.value + "! 👋");\n});',
                  explanation: 'Ajoyib! `submit` + `preventDefault()` + `if (!value)` + `alert()` — endi formangiz HAQIQIY validatsiyali! 🎉',
                  xp: 10
                }
              ]
            },
            quiz: {
              passingScore: 80,
              questions: [
                {
                  question: '`required` nima qiladi?',
                  options: ['Inputga qiymat beradi', 'Maydonni bo‘sh qoldirib yuborishni taqiqlaydi', 'Inputga nom beradi', 'Formani yashiradi'],
                  answer: 1,
                  explanation: '`required` — qiymatsiz atribut. Bo‘sh maydon bilan yuborsangiz brauzer to‘xtatadi.'
                },
                {
                  question: '`name="username"` nima uchun kerak?',
                  options: ['CSS uchun', 'Forma yuborilganda maydonga nom beradi', 'Rasm manzili', 'Sahifa nomi'],
                  answer: 1,
                  explanation: '`name` — forma yuborilganda maydon shu nom bilan yuboriladi.'
                },
                {
                  question: '`value="Ahatjon"` nima?',
                  options: ['Yordamchi matn', 'Inputning boshlang‘ich qiymati', 'Forma nomi', 'Input turi'],
                  answer: 1,
                  explanation: '`value` — sahifa ochilganda input ichida turgan boshlang‘ich qiymat.'
                },
                {
                  question: 'Ko‘p qatorli matn uchun qaysi element?',
                  options: ['`<input>`', '`<textarea>`', '`<select>`', '`<label>`'],
                  answer: 1,
                  explanation: '`<textarea></textarea>` — ko‘p qatorli matn maydoni, yopiluvchi tegi bor.'
                },
                {
                  question: '`<select>` ichida nima turadi?',
                  options: ['`<li>`', '`<option>`', '`<input>`', '`<div>`'],
                  answer: 1,
                  explanation: '`<option>` — tanlash oynasidagi bitta variant.'
                },
                {
                  question: 'Forma yuborilishini ushlash qaysi event?',
                  options: ['`"click"`', '`"submit"`', '`"input"`', '`"load"`'],
                  answer: 1,
                  explanation: 'Formada `form.addEventListener("submit", ...)` ishlatiladi.'
                },
                {
                  question: '`e.preventDefault()` nima qiladi?',
                  options: ['Formani yuboradi', 'Browserning odatiy submit harakatini (sahifa yangilanishini) vaqtincha to‘xtatadi', 'Inputni bo‘shatadi', 'Sahifani o‘chiradi'],
                  answer: 1,
                  explanation: '`e.preventDefault()` — odatiy harakat to‘xtaydi, o‘rniga sizning JS kodingiz ishlaydi.'
                },
                {
                  question: '`document.getElementById("name")` nima qiladi?',
                  options: ['Elementni NOMI orqali topadi', 'Elementni id si orqali topadi', 'Formani yuboradi', 'Sahifani yangilaydi'],
                  answer: 1,
                  explanation: '`getElementById` — id orqali elementni topadi.'
                },
                {
                  question: 'Inputga yozilgan qiymat qaysi xususiyatda?',
                  options: ['`.text`', '`.value`', '`.name`', '`.html`'],
                  answer: 1,
                  explanation: '`.value` — input ICHIGA yozilgan foydalanuvchi qiymati.'
                },
                {
                  question: '`if (!nameInput.value)` nimani tekshiradi?',
                  options: ['Input to‘lganini', 'Inputdagi qiymat YO‘Qligini (bo‘shligini)', 'Input borligini', 'Input turini'],
                  answer: 1,
                  explanation: '`!` — inkor: `!value` = "qiymat yo‘q". To‘g‘ri bo‘lsa alert chiqadi.'
                },
                {
                  question: 'REVIEW (1-dars): eng katta sarlavha qaysi teg?',
                  options: ['`<h6>`', '`<p>`', '`<h1>`', '`<title>`'],
                  answer: 2,
                  explanation: '1-darsdan eslang: `<h1>` — eng katta, `<h6>` — eng kichik.'
                },
                {
                  question: 'REVIEW (4-dars): link manzili qaysi atributda?',
                  options: ['`src`', '`alt`', '`href`', '`name`'],
                  answer: 2,
                  explanation: '4-darsdan eslang: `<a href="...">` — href link qayerga o‘tishini ko‘rsatadi.'
                },
                {
                  question: 'REVIEW (3-dars): `class` nima?',
                  options: ['Yagona nom — faqat bittaga', 'Guruh nomi — ko‘p elementlarga beriladi', 'Rasm manzili', 'Input turi'],
                  answer: 1,
                  explanation: 'class — GURUH nomi; id esa faqat bittaga beriladi.'
                }
              ]
            }
          },


          'Sarlavhalar (h1–h6)',
          'Paragraf va formatlash',
          'Havolalar (a tegi)',
          'Rasmlar bilan ishlash',
          'Ro‘yxatlar (ul, ol, dl)',
          'Jadvallar (table)',
          'Form elementlari',
          'Input turlari',
          'Semantic HTML',
          'Audio va Video',
          'Iframe bilan ishlash',
          'Div va Span',
          'Attributlar',
          'Global attributlar',
          'Class va id',
          'Meta teglari',
          'HTML5 API‘lar',
          'Web Storage',
          'Canvas asoslari',
          'SVG asoslari',
          'Forma validatsiyasi',
          'Accessibility (A11y)',
          'SEO asoslari',
          'Amaliy loyiha: Portfolio',
          'Yakuniy takrorlash'
        ]
      },
      {
        id: 'css',
        name: 'CSS',
        icon: '🎨',
        color: '#2965f1',
        tagline: 'Web sahifaga chiroyli stil bering.',
        description: 'Web sahifa stillari: selektorlar, Flexbox, Grid, animatsiyalar va responsive dizayn.',
        topics: [
          'CSS nima?',
          'Selektorlar',
          'Ranglar',
          'Matn uslublari',
          'Box Model',
          'Display xossalari',
          'Position',
          'Flexbox asoslari',
          'Flexbox ilg‘or',
          'Grid asoslari',
          'Grid ilg‘or',
          'Responsive dizayn',
          'Media Queries',
          'Transition',
          'Animation',
          'Transform',
          'Shadow va Gradient',
          'CSS o‘zgaruvchilari',
          'Pseudo-classes',
          'Pseudo-elements',
          'Z-index',
          'Specificity',
          'Temalar bilan ishlash',
          'BEM metodologiyasi',
          'Amaliy loyiha: Landing page'
        ]
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: '⚡',
        color: '#f7df1e',
        tagline: 'Web sahifani interaktiv qiling.',
        description: 'Web dasturlash tili: DOM, ES6+, async, API bilan ishlash va amaliy loyihalar.',
        topics: [
          'JavaScript nima?',
          'O‘zgaruvchilar',
          'Ma‘lumot turlari',
          'Operatorlar',
          'Shart operatorlari',
          'Tsikllar (for, while)',
          'Funksiyalar',
          'Arrow funksiyalar',
          'Massivlar',
          'Massiv metodlari',
          'Obyektlar',
          'Obyekt metodlari',
          'String metodlari',
          'Raqam metodlari',
          'Math obyekti',
          'Date bilan ishlash',
          'Scope tushunchasi',
          'Hoisting',
          'Closure‘lar',
          'Callback funksiyalar',
          'Promise‘lar',
          'Async/Await',
          'Fetch API',
          'JSON bilan ishlash',
          'DOM nima?',
          'DOM selektorlar',
          'DOM manipulyatsiya',
          'Eventlar',
          'Event delegation',
          'localStorage',
          'Error handling',
          'Destructuring',
          'Spread va Rest',
          'Modullar',
          'Class‘lar',
          'Inheritance',
          'Map va Set',
          'RegEx asoslari',
          'Amaliy loyiha: Todo app',
          'Yakuniy takrorlash'
        ]
      },
      {
        id: 'python',
        name: 'Python',
        icon: '🐍',
        color: '#3776ab',
        tagline: 'Eng oson boshlanadigan dasturlash tili.',
        description: 'Python asoslari: OOP, kutubxonalar, data science, botlar va avtomatlashtirish.',
        topics: [
          'Python nima?',
          'O‘zgaruvchilar',
          'Ma‘lumot turlari',
          'Operatorlar',
          'String‘lar bilan ishlash',
          'If / Else',
          'Tsikllar',
          'List',
          'Tuple',
          'Dictionary',
          'Set',
          'Funksiyalar',
          'Args va kwargs',
          'Lambda',
          'Modullar',
          'pip va paketlar',
          'OOP asoslari',
          'Class‘lar',
          'Meros (inheritance)',
          'Polimorfizm',
          'Inkapsulyatsiya',
          'Exception‘lar',
          'Fayllar bilan ishlash',
          'OS moduli',
          'Datetime',
          'List comprehension',
          'Generatorlar',
          'Decoratorlar',
          'Iteratorlar',
          'RegEx',
          'JSON bilan ishlash',
          'API so‘rovlar',
          'NumPy asoslari',
          'Pandas asoslari',
          'Matplotlib',
          'Virtual environment',
          'Testlash (unittest)',
          'Asyncio',
          'Amaliy loyiha: Telegram bot',
          'Yakuniy takrorlash'
        ]
      },
      {
        id: 'java',
        name: 'Java',
        icon: '☕',
        color: '#f89820',
        tagline: 'Universal OOP tili — JVM kuchi.',
        description: 'Java: OOP, Collections, JVM, multithreading va korporativ dasturlash asoslari.',
        topics: [
          'Java nima?',
          'JDK va IDE o‘rnatish',
          'O‘zgaruvchilar',
          'Ma‘lumot turlari',
          'Operatorlar',
          'Shart operatorlari',
          'Tsikllar',
          'Massivlar',
          'String bilan ishlash',
          'Metodlar',
          'OOP asoslari',
          'Class va Object',
          'Konstruktorlar',
          'Meros (inheritance)',
          'Polimorfizm',
          'Abstraksiya',
          'Interfeyslar',
          'Inkapsulyatsiya',
          'Static kalit so‘zi',
          'Collections',
          'List interfeysi',
          'Set interfeysi',
          'Map interfeysi',
          'Exception‘lar',
          'File I/O',
          'Generics',
          'Stream API',
          'Multithreading',
          'Amaliy loyiha',
          'Yakuniy takrorlash'
        ]
      },
      {
        id: 'cpp',
        name: 'C++',
        icon: '🔧',
        color: '#659ad2',
        tagline: 'Tizim dasturlash va algoritmlar tili.',
        description: 'C++: pointerlar, OOP, STL, xotira boshqaruvi va yuqori samarali dasturlar.',
        topics: [
          'C++ nima?',
          'Kompilyatsiya',
          'O‘zgaruvchilar',
          'Ma‘lumot turlari',
          'Operatorlar',
          'Kiritish va chiqarish',
          'Shart operatorlari',
          'Tsikllar',
          'Massivlar',
          'String bilan ishlash',
          'Funksiyalar',
          'Pointerlar',
          'Referenslar',
          'Dinamik xotira',
          'Class‘lar',
          'Konstruktorlar',
          'Meros (inheritance)',
          'Polimorfizm',
          'Inkapsulyatsiya',
          'Operator overloading',
          'STL bilan tanishuv',
          'Vector',
          'Map va Set',
          'Stack va Queue',
          'STL algoritmlar',
          'Rekursiya',
          'File I/O',
          'Exception‘lar',
          'Amaliy loyiha',
          'Yakuniy takrorlash'
        ]
      },
      {
        id: 'sql',
        name: 'SQL',
        icon: '🗄️',
        color: '#00758f',
        tagline: 'Ma‘lumotlar bazasi bilan ishlang.',
        description: 'Ma‘lumotlar bazasi: JOIN, GROUP BY, indekslar, procedure‘lar va normalizatsiya.',
        topics: [
          'SQL nima?',
          'Ma‘lumotlar bazasi tushunchasi',
          'DBMS turlari',
          'CREATE TABLE',
          'Ma‘lumot turlari',
          'INSERT',
          'SELECT',
          'WHERE',
          'ORDER BY',
          'UPDATE va DELETE',
          'Aggregate funksiyalar',
          'GROUP BY',
          'HAVING',
          'JOIN asoslari',
          'INNER JOIN',
          'LEFT va RIGHT JOIN',
          'Subquery‘lar',
          'Constraints',
          'Primary va Foreign Key',
          'Index',
          'Views',
          'Stored Procedures',
          'Triggers',
          'Normalizatsiya',
          'Amaliy loyiha'
        ]
      },
      {
        id: 'react',
        name: 'React',
        icon: '⚛️',
        color: '#61dafb',
        tagline: 'Zamonaviy UI kutubxonasi.',
        description: 'React: komponentlar, hooks, state management, router va real loyihalar.',
        topics: [
          'React nima?',
          'JSX',
          'Komponentlar',
          'Props',
          'State',
          'Eventlar',
          'Conditional rendering',
          'Ro‘yxatlar va keys',
          'Formalar',
          'useState',
          'useEffect',
          'Custom hooks',
          'Context API',
          'useRef',
          'useMemo',
          'useCallback',
          'React Router',
          'API bilan ishlash',
          'Styling usullari',
          'Komponent hayot aylanishi',
          'Error boundaries',
          'Performance optimizatsiya',
          'Amaliy loyiha',
          'Testing',
          'Deploy'
        ]
      },
      {
        id: 'nodejs',
        name: 'Node.js',
        icon: '🟢',
        color: '#68a063',
        tagline: 'JavaScript bilan backend yozing.',
        description: 'Node.js: Express, REST API, ma‘lumotlar bazasi, autentifikatsiya va deployment.',
        topics: [
          'Node.js nima?',
          'npm',
          'Modullar',
          'File System',
          'HTTP server',
          'Express.js asoslari',
          'Routing',
          'Middleware',
          'REST API',
          'Body parsing',
          'MongoDB bilan ishlash',
          'SQL bilan ishlash',
          'Autentifikatsiya (JWT)',
          'Environment variables',
          'Error handling',
          'Async pattern‘lar',
          'Websockets',
          'Deployment',
          'Xavfsizlik asoslari',
          'Amaliy loyiha'
        ]
      },
      {
        id: 'ai',
        name: 'AI',
        icon: '🤖',
        color: '#8b5cf6',
        tagline: 'Sun‘iy intellekt olamiga qadam.',
        description: 'Sun‘iy intellekt: ML, neural tarmoqlar, NLP, computer vision va LLM‘lar.',
        topics: [
          'AI nima?',
          'Machine Learning asoslari',
          'Supervised learning',
          'Unsupervised learning',
          'Neural tarmoqlar',
          'Deep Learning',
          'Python + AI vositalari',
          'Data preprocessing',
          'Regressiya',
          'Klassifikatsiya',
          'Klasterlash',
          'NLP asoslari',
          'Computer Vision',
          'Prompt engineering',
          'LLM‘lar',
          'RAG tushunchasi',
          'Fine-tuning',
          'AI etikasi',
          'Amaliy loyiha',
          'Kelajak yo‘nalishlari'
        ]
      }
    ];

    /* ==========================================================
       DARS OBYEKTI SCHEMASI (string | object):
         'Dars sarlavhasi'                       — oddiy string
         {
           title: 'HTML nima?',
           duration: 12,                          // daqiqa (ixtiyoriy)
           xp: 10,                                // mukofot XP (ixtiyoriy)
           content: {                             // 📚 DARS KONTENTI (ixtiyoriy — null => placeholder)
             intro: 'Qisqa kirish',
             sections: [                          // bo'limlar: tushuntirish + kod + natija + eslatma
               { title: 'Bo\'lim nomi',
                 text: 'Matn. **qalin** va `kod` markerlari ishlaydi.',
                 code: '<p>Salom</p>',            // ixtiyoriy — kod namunasi
                 codeNote: 'Kod izohi',           // ixtiyoriy — kodning izohi
                 result: 'Brauzerdagi natija',    // ixtiyoriy — natija
                 note: 'Muhim eslatma' }          // ixtiyoriy — amaliy eslatma
             ],
             keyPoints: ['Muhim eslatma 1', '...'] // dars xulosasi
           },
           quiz: {                                // 🧪 TEST (ixtiyoriy — null => test yo'q)
             passingScore: 80,                    // minimal o'tish foizi
             questions: [                         // savollar banki (10-15 ta)
               { question: 'Savol matni (`kod` markeri ishlaydi)',
                 options: ['A', 'B', 'C', 'D'],   // 4 variant
                 answer: 1,                       // to'g'ri variant indeksi
                 explanation: '💡 Izoh — test tugagach ko\'rsatiladi' }
             ]
           }
         }
       Matnlarda markerlar: `kod` -> inline code, **matn** -> qalin, \n -> yangi qator.
       Barcha matnlar o'zbek tilida; texnik atamalar qavsda original bilan.
       ========================================================== */

    function defaultDifficulty(index, total) {
      const third = Math.max(1, Math.ceil(total / 3));
      if (index < third) return 'Boshlang‘ich daraja';
      if (index < third * 2) return 'O‘rta daraja';
      return 'Ilg‘or daraja';
    }

    function defaultDuration(index) {
      return [10, 15, 15, 20][index % 4];
    }

    /** quiz raw -> normalized quiz (yoki null) */
    function normalizeQuiz(raw) {
      if (!raw || !Array.isArray(raw.questions) || raw.questions.length === 0) return null;
      return {
        passingScore: Number(raw.passingScore) > 0 ? Number(raw.passingScore) : 80,
        questions: raw.questions.map(function (q, i) {
          return {
            id: i + 1,
            question: String(q.question || ''),
            options: Array.isArray(q.options) ? q.options.map(String) : [],
            answer: Number(q.answer) || 0,
            explanation: q.explanation ? String(q.explanation) : ''
          };
        })
      };
    }

    /** topic (string | object) -> normalized lesson obyekt */
    function normalizeLesson(course, raw, index, total) {
      const isObj = raw && typeof raw === 'object';
      const id = course.id + '-d' + (index + 1);
      return {
        id: id,
        courseId: course.id,
        number: index + 1,
        title: isObj ? String(raw.title || 'Dars ' + (index + 1)) : String(raw),
        description: isObj && raw.description ? String(raw.description) : '',
        duration: isObj && raw.duration ? Number(raw.duration) || defaultDuration(index) : defaultDuration(index),
        difficulty: isObj && raw.difficulty ? String(raw.difficulty) : defaultDifficulty(index, total),
        xp: isObj && raw.xp != null ? Number(raw.xp) || 0 : 10,
        // content null => "Dars tayyorlanmoqda" placeholder. Kelajakda shu yerga real kontent qo'shiladi.
        content: isObj && raw.content ? raw.content : null,
        // quiz null => bu darsda test hali yo'q (kontent ham bo'lmasa dars tugallanmaydi)
        quiz: isObj ? normalizeQuiz(raw.quiz) : null
      };
    }

    const normalizedCache = {};

    function getCourseNormalized(id) {
      if (normalizedCache[id]) return normalizedCache[id];
      const raw = COURSES.find(function (c) { return c.id === id; });
      if (!raw) return null;
      const total = raw.topics.length;
      const normalized = {
        id: raw.id,
        name: raw.name,
        icon: raw.icon,
        color: raw.color,
        tagline: raw.tagline || raw.description || '',
        description: raw.description || raw.tagline || '',
        lessonCount: total,
        lessons: raw.topics.map(function (t, i) { return normalizeLesson(raw, t, i, total); })
      };
      normalizedCache[id] = normalized;
      return normalized;
    }

    window.CoursesAPI = {
      /** Barcha kurslar ro'yxati (normalized) */
      listCourses: function () { return COURSES.map(function (c) { return getCourseNormalized(c.id); }); },
      /** id bo'yicha bitta kurs yoki null */
      getCourse: getCourseNormalized,
      /** Runtime'da data o'zgartirilsa cache tozalash */
      refresh: function () { Object.keys(normalizedCache).forEach(function (k) { delete normalizedCache[k]; }); },
      /** Kurs + lesson id bo'yicha dars topish: { course, lesson, index } | null */
      findLesson: function (courseId, lessonId) {
        const course = getCourseNormalized(courseId);
        if (!course) return null;
        const index = course.lessons.findIndex(function (l) { return l.id === lessonId; });
        if (index === -1) return null;
        return { course: course, lesson: course.lessons[index], index: index };
      },
      /** Darslar ro'yxatidagi keyingi / oldingi dars */
      nextLesson: function (courseId, lessonId) {
        const found = this.findLesson(courseId, lessonId);
        if (!found || found.index >= found.course.lessons.length - 1) return null;
        return found.course.lessons[found.index + 1];
      },
      prevLesson: function (courseId, lessonId) {
        const found = this.findLesson(courseId, lessonId);
        if (!found || found.index <= 0) return null;
        return found.course.lessons[found.index - 1];
      },
      raw: COURSES,
      loadFromBackend: async function() {
        try {
          const res = await fetch('/api/courses');
          if (!res.ok) return false;
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            COURSES = data;
            window.CoursesAPI.raw = COURSES;
            window.CoursesAPI.refresh();
            if (typeof renderCoursesPage === 'function') { try { renderCoursesPage(); } catch (_) {} }
            return true;
          }
        } catch (_) {}
        return false;
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() { window.CoursesAPI.loadFromBackend(); }, 80);
      });
    }
  })();



  /* --- mascot.js --- */
  /* ==========================================================
     ITTest MASCOT — Robot maskot moduli (3D Mascot Engine)
     Bitta rasm: ./mascot/it-robot.png (public/mascot/it-robot.png)
     Futuristik neon platforma + tirik ko'z animatsiyalari
     ========================================================== */

  const MASCOT_SRC = './mascot/it-robot.png';

  const STATES = ['idle', 'thinking', 'error', 'success', 'complete', 'rocket', 'newLesson', 'xp'];

  /** Mascot HTML — JS string ichiga qo'shish uchun */
  function mascotHTML(state, extraCls) {
    const normState = (state === 'newLesson' ? 'rocket' : (state || 'idle'));
    return '<div class="mascot mascot--' + normState + (extraCls ? ' ' + extraCls : '') + '">' +
      '<div class="mascot-body">' +
      '<img src="' + MASCOT_SRC + '" alt="ITTest Robot" draggable="false" loading="lazy" ' +
      'onerror="this.closest(\'.mascot\')&&this.closest(\'.mascot\').classList.add(\'mascot-broken\')">' +
      '<div class="mascot-eyes" aria-hidden="true">' +
      '<span class="mascot-eye mascot-eye--l"></span>' +
      '<span class="mascot-eye mascot-eye--r"></span>' +
      '</div>' +
      '</div>' +
      '<div class="mascot-platform" aria-hidden="true">' +
      '<span class="mascot-platform-glow"></span>' +
      '<span class="mascot-platform-ring"></span>' +
      '<span class="mascot-platform-base"></span>' +
      '</div>' +
      '</div>';
  }

  /** Element ichiga mascot qo'shish (mavjud bo'lmasa) */
  function inject(parent, state, extraCls) {
    if (!parent) return null;
    let el = parent.querySelector(':scope > .mascot');
    if (!el) {
      parent.insertAdjacentHTML('afterbegin', mascotHTML(state, extraCls));
      el = parent.querySelector(':scope > .mascot');
    } else {
      setState(el, state);
    }
    return el;
  }

  /** Holatni o'zgartirish */
  function setState(el, state) {
    if (!el) return;
    STATES.forEach(s => el.classList.remove('mascot--' + s));
    let normState = state;
    if (normState === 'newLesson') normState = 'rocket';
    if (!STATES.includes(normState)) normState = 'idle';

    if (state === 'xp') {
      showXP(el, '+10 XP');
    }

    // animatsiyani qayta ishga tushirish
    el.classList.remove('mascot--' + normState);
    void el.offsetWidth;
    el.classList.add('mascot--' + normState);
  }

  /** Sahifadagi (container ichidagi) birinchi mascota holatini o'zgartirish */
  function setStateIn(container, state) {
    const el = container && container.querySelector('.mascot');
    if (el) setState(el, state);
    return !!el;
  }

  /** ⭐ +XP yuqoriga uchishi */
  function showXP(el, text) {
    if (!el) return;
    const span = document.createElement('span');
    span.className = 'mascot-xp';
    span.textContent = '⭐ ' + (text || '+10 XP');
    el.appendChild(span);
    setTimeout(() => span.remove(), 1400);
  }

  /** 🗨 Speech bubble (foydalanuvchi talabi bo'yicha toza vizual uchun yashiringan) */
  function say(el, text) {
    if (!el) return;
    const b = el.querySelector(':scope > .mascot-bubble');
    if (b) b.remove();
  }

  window.ITMascot = { STATES, html: mascotHTML, inject, setState, setStateIn, showXP, say, src: MASCOT_SRC };
  window.IT_MASCOT_HTML = mascotHTML;


  /* --- lessons-app.js --- */
  /* ==========================================================
     DARSLAR TIZIMI — ASOSIY LOGIKA
     ==========================================================
     window.Lessons  — UI boshqaruvi (script.js showPage() chaqiradi)
     window.LessonsHooks — kelajakdagi funksiyalar uchun hook'lar
     (XP, Coin, Streak, Achievement, Leaderboard...)
  
     Ma'lumot manbasi: lessons-data.js -> window.CoursesAPI
     Progress: localStorage (foydalanuvchi bo'yicha ajratilgan)
     ========================================================== */

  (function () {
    'use strict';

    /* ---------- YORDAMCHILAR ---------- */
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
    function esc(str) {
      return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    /** Matn formatteri: `kod` -> inline code, **matn** -> qalin, \n -> yangi qator */
    function fmtText(str) {
      return esc(str)
        .replace(/`([^`]+)`/g, '<code class="ls-inline-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\n/g, '<br>');
    }
    /** Savol/variant formatteri: faqat `kod` markeri */
    function fmt(str) {
      return esc(str).replace(/`([^`]+)`/g, '<code class="ls-inline-code">$1</code>');
    }
    /** Massivni aralashtirish (Fisher-Yates) */
    function shuffleArr(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    function toast(msg, type) {
      if (typeof window.showToast === 'function') window.showToast(msg, type || 'info');
      else console.log('[Darslar]', msg);
    }
    /** prefers-reduced-motion yoqilganmi? */
    function reducedMotion() {
      try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
      catch (e) { return false; }
    }
    /** Elementga bir martalik shake animatsiyasi */
    function shakeEl(el) {
      if (!el || reducedMotion()) return;
      el.classList.remove('ls-shake');
      void el.offsetWidth; // reflow — animatsiyani qayta ishga tushirish uchun
      el.classList.add('ls-shake');
      setTimeout(function () { el.classList.remove('ls-shake'); }, 520);
    }

    /* 🤖 ITTest Robot reaksiyasi — to'g'ri javob: quvonch, xato: yordam holati */
    function mascotReact(state) {
      try {
        if (window.ITMascot && typeof window.ITMascot.setStateIn === 'function') {
          const host = document.getElementById('lsLessonContainer') || document;
          window.ITMascot.setStateIn(host, state);
          if (state === 'success' || state === 'error') {
            setTimeout(function () { window.ITMascot.setStateIn(host, 'idle'); }, 1800);
          }
        }
      } catch (e) { /* mascot ixtiyoriy — dars buzilmasin */ }
    }
    /** Progress barlar 0'dan haqiqiy qiymatgacha smooth to'ladi (0.8–1.2s) */
    function animateProgressBars(scope) {
      $$('.ls-progress-track span, .ls-continue-bar span', scope || document).forEach(function (bar) {
        const target = bar.style.width || '0%';
        bar.style.transition = 'none';
        bar.style.width = '0%';
        void bar.offsetWidth; // reflow
        bar.style.transition = ''; // CSS transition tiklanadi (width .8-.9s)
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.style.width = target; });
        });
      });
    }
    /** Dars kartasidagi mini progress ring 0'dan haqiqiy qiymatgacha smooth to'ladi */
    function animateStateRings(scope) {
      $$('.ls-state-ring .ls-state-ring-fill', scope || document).forEach(function (ring) {
        const C = 2 * Math.PI * 18;
        const pct = parseFloat(ring.getAttribute('data-pct') || '0');
        const target = C * (1 - pct / 100);
        if (reducedMotion()) { ring.style.strokeDashoffset = String(target); return; }
        ring.style.transition = 'none';
        ring.style.strokeDashoffset = String(C);
        void ring.getBoundingClientRect(); // reflow
        ring.style.transition = '';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { ring.style.strokeDashoffset = String(target); });
        });
      });
    }
    function page(name) {
      if (typeof window.__itShowPage === 'function') window.__itShowPage(name);
      else console.warn('__itShowPage mavjud emas — script.js yangilanmaganmi?');
    }
    function currentUser() {
      try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
      catch (e) { return null; }
    }

    /* ---------- BILIM DARAJALARI ---------- */
    const LEVELS = {
      beginner: {
        id: 'beginner',
        emoji: '1️⃣',
        title: 'Umuman bilmayman',
        desc: 'Hali deyarli ishlamaganman. Men 0 dan boshlamoqchiman.',
        sequential: true   // darslar ketma-ket ochiladi
      },
      intermediate: {
        id: 'intermediate',
        emoji: '2️⃣',
        title: 'Asoslarini bilaman',
        desc: 'Biroz ishlaganman, asosiy tushunchalarni bilaman. Bilimimni mustahkamlamoqchiman.',
        sequential: false  // barcha darslar ochiq
      },
      advanced: {
        id: 'advanced',
        emoji: '3️⃣',
        title: 'Yaxshi bilaman',
        desc: 'Bemalol ishlayman. Kerakli mavzuni to‘g‘ridan-to‘g‘ri tanlab o‘rganmoqchiman.',
        sequential: false  // barcha darslar ochiq
      }
    };
    const LEVEL_LABELS = {
      beginner: 'Umuman bilmayman',
      intermediate: 'Asoslarini bilaman',
      advanced: 'Yaxshi bilaman'
    };

    /* ---------- STORAGE (foydalanuvchi bo'yicha) ---------- */
    const STORE_PREFIX = 'darslar_state_v1';
    let store = null;

    function userStoreKey() {
      const u = currentUser();
      const who = u ? (u.username || u.email || 'user') : 'guest';
      return STORE_PREFIX + '::' + String(who).toLowerCase();
    }

    function defaultStore() {
      return { levels: {}, progress: {} };
    }

    function loadStore() {
      try {
        const raw = localStorage.getItem(userStoreKey());
        store = raw ? JSON.parse(raw) : defaultStore();
      } catch (e) { store = defaultStore(); }
      if (!store.levels) store.levels = {};
      if (!store.progress) store.progress = {};
      return store;
    }

    function saveStore() {
      try { localStorage.setItem(userStoreKey(), JSON.stringify(store)); }
      catch (e) { console.warn('localStorage yozib bo‘lmadi', e); }
    }

    /* Qayta kirganda o'sha foydalanuvchi ma'lumotlari o'qilishi uchun
       har bir sahifa ko'rsatilishida store qayta yuklanadi. */

    /* ---------- PROGRESS / QULF LOGIKASI ---------- */

    /** Kurs bo'yicha progress obyekti */
    function courseProgress(courseId) {
      if (!store) loadStore();
      return store.progress[courseId] || { completed: {}, lastLessonId: null, lastVisit: 0 };
    }

    function completedCount(courseId) {
      return Object.keys(courseProgress(courseId).completed).length;
    }

    function isLessonCompleted(courseId, lessonId) {
      return !!courseProgress(courseId).completed[lessonId];
    }

    /** Progress foizi */
    function progressPercent(courseId, course) {
      const total = course ? course.lessonCount : 0;
      if (!total) return 0;
      return Math.round((completedCount(courseId) / total) * 100);
    }

    /** Bilim darajasi (tanlanmagan bo'lsa null) */
    function levelOf(courseId) {
      if (!store) loadStore();
      return store.levels[courseId] || null;
    }

    function setLevel(courseId, levelId) {
      if (!LEVELS[levelId]) return;
      if (!store) loadStore();
      store.levels[courseId] = levelId;
      saveStore();
    }

    /**
     * Dars ochiq yoki yo'q.
     * beginner  -> faqat 1-dars va oldingi darslari tugallanganlar ochiq
     * boshqalar -> hammasi ochiq
     */
    function isLessonUnlocked(course, lesson, index) {
      const lvl = levelOf(course.id) || 'intermediate';
      if (!LEVELS[lvl].sequential) return true;
      if (index === 0) return true;
      const prev = course.lessons[index - 1];
      return !!prev && isLessonCompleted(course.id, prev.id);
    }

    /** Keyingi o'rganiladigan (joriy) dars — birinchi ochiq va tugallanmagan */
    function currentLesson(course) {
      for (let i = 0; i < course.lessons.length; i++) {
        if (!isLessonCompleted(course.id, course.lessons[i].id)) return course.lessons[i];
      }
      return null;
    }

    /** Dars o'qilganmi? (darsni oxirigacha ko'rish yoki "O'qidim" belgisi) */
    function isLessonRead(courseId, lessonId) {
      const p = courseProgress(courseId);
      return !!(p.read && p.read[lessonId]);
    }

    /** Darsni o'qilgan deb belgilash */
    function markLessonRead(courseId, lessonId) {
      const p = courseProgress(courseId);
      if (!p.read) p.read = {};
      if (!p.read[lessonId]) {
        p.read[lessonId] = { at: Date.now() };
        saveStore();
        return true;
      }
      return false;
    }

    /** Dars testining oxirgi natijasi (yoki null) */
    function getTestResult(courseId, lessonId) {
      const p = courseProgress(courseId);
      return (p.testResults && p.testResults[lessonId]) || null;
    }
    /** Kurs bo'yicha "davom ettirish" darsini aniqlash */
    function resumeLesson(course) {
      const prog = courseProgress(course.id);
      if (prog.lastLessonId) {
        const idx = course.lessons.findIndex(function (l) { return l.id === prog.lastLessonId; });
        if (idx !== -1) {
          const last = course.lessons[idx];
          if (!isLessonCompleted(course.id, last.id)) return last;
          // oxirgi dars tugallangan bo'lsa — keyingisiga o'tish
          const next = course.lessons[idx + 1];
          if (next && isLessonUnlocked(course, next, idx + 1)) return next;
        }
      }
      return currentLesson(course);
    }

    /** Eng oxirgi ochilgan tugallanmagan kurs (davom ettirish banneri uchun) */
    function lastActiveCourseId() {
      if (!store) loadStore();
      let best = null;
      Object.keys(store.progress).forEach(function (cid) {
        const prog = store.progress[cid];
        const course = window.CoursesAPI.getCourse(cid);
        if (!course) return;
        if (Object.keys(prog.completed).length >= course.lessonCount) return; // tugallangan
        if (!best || (prog.lastVisit || 0) > (store.progress[best].lastVisit || 0)) best = cid;
      });
      return best;
    }

    /** Umuman boshlanmagan birinchi kurs (banner fallback) */
    function firstNotStartedCourseId() {
      const courses = window.CoursesAPI.listCourses();
      for (let i = 0; i < courses.length; i++) {
        if (completedCount(courses[i].id) === 0) return courses[i].id;
      }
      return courses.length ? courses[0].id : null;
    }

    /* ---------- TEST KONSTANTALARI ---------- */
    const QUIZ_QUESTIONS_PER_TEST = 5;   // har bir urinishda nechta savol chiqadi
    const LESSON_COIN_REWARD = 20;       // testdan o'tganda beriladigan coin

    /* ---------- ICHKI HOLAT ---------- */
    const state = {
      currentCourseId: null,   // kurs sahifasida ko'rilayotgan kurs
      currentLessonId: null,   // viewer'da ochilgan dars
      lessonPhase: 'read',     // 'read' | 'quiz' | 'result' — darsning joriy bosqichi
      quiz: null,              // aktiv test urinishasi: { items, answers, index, result }
      diagnostic: null,        // darajani aniqlash testi: { courseId, items, answers, index }
      _scrollCleanup: null     // read kuzatuv scroll listenerini tozalash
    };

    /* ---------- KELAJAKDAGI FUNKSIYALAR UCHUN HOOK'LAR ---------- */
    /* Namuna: window.LessonsHooks.onLessonComplete.push(function (info) { ... });
       info = { courseId, course, lesson, xp, coins, totalCompleted, courseCompleted } */
    const Hooks = {
      onLessonComplete: [],
      onLevelChange: []
      // TODO: XP, Coin, Streak, Achievement, Leaderboard integratsiyalari
      // shu hook'lar orqali qo'shiladi — asosiy logikani o'zgartirmasdan.
    };

    /* ---------- DARS TUGALLASH EFFEKTLARI ---------- */
    /* 🎉 notification + ✨ confetti + ⭐ XP + 🪙 Coin + 🔓 keyingi dars.
       XP/coin balans o'zgarishlari kelajakda onLessonComplete hook'lari orqali
       ulanadi; bu yerda faqat vizual effektlar va tayyor struktura. */
    const Effects = {
      /** ✨ Confetti/particle — script.js'dagi mavjud triggerConfetti ishlatiladi.
          prefers-reduced-motion yoqilgan bo'lsa o'tkazib yuboriladi. */
      confetti: function () {
        if (reducedMotion()) return;
        try { if (typeof window.__itConfetti === 'function') window.__itConfetti(); }
        catch (e) { /* effekt muhim emas — xatolikni e'tiborsiz qoldirish */ }
      },
      /** To'liq nishonlash nuqtasi (kelajakda bu yerga qo'shimcha animatsiyalar qo'shiladi) */
      celebrate: function (info) {
        this.confetti();
      }
    };

    /* ==========================================================
       1) DARSLAR BOSH SAHIFASI — Progress-first UX
       (Umumiy progress → Davom ettirish → Mavzular)
       ========================================================== */

    /** Global smart CTA: foydalanuvchining real state'idan joriy kurs va
        joriy darsni topib, aynan shu darsni ochadi (existing resume logic). */
    function continueCurrentLesson() {
      const activeId = lastActiveCourseId() || firstNotStartedCourseId();
      const course = activeId ? window.CoursesAPI.getCourse(activeId) : null;
      if (!course) { toast('Darslarni boshlash uchun kurs tanlang.', 'info'); return; }
      const res = resumeLesson(course);
      if (res) openLesson(course.id, res.id);
      else openCourse(course.id);
    }

    function renderCoursesPage() {
      loadStore();
      const overallSlot = $('#lsOverallSlot');
      const contSlot = $('#lsContinueSlot');
      const grid = $('#lsCoursesGrid');
      if (!grid) return;

      // --- UMUMIY PROGRESS (real user data: localStorage + lesson data) ---
      const all = window.CoursesAPI.listCourses();
      let totalLessons = 0, totalDone = 0;
      all.forEach(function (c) {
        totalLessons += c.lessonCount || 0;
        totalDone += completedCount(c.id);
      });
      const allPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;
      const allFinished = totalLessons > 0 && totalDone >= totalLessons;
      const motive = allFinished
        ? '🎉 Barcha darslarni tugatdingiz — ajoyib natija!'
        : (allPct >= 70
          ? 'Zo‘r ishlayapsiz! Keyingi darsga o‘tamiz.'
          : (allPct > 0
            ? 'Yaxshi ketmoqda — oldinda qiziq darslar bor!'
            : 'Birinchi dars bilan boshlang — siz ham qila olasiz! 🚀'));
      const ringC = 2 * Math.PI * 42;
      const ringOff = ringC * (1 - allPct / 100);
      let robotHtml = '';
      try {
        if (window.ITMascot && typeof window.ITMascot.html === 'function') {
          robotHtml = window.ITMascot.html(allFinished ? 'success' : 'idle', 'mascot--sm');
        }
      } catch (e) { /* robot ixtiyoriy — sahifa buzilmasin */ }
      if (overallSlot) {
        overallSlot.innerHTML =
          '<div class="ls-overall">' +
          '<div class="ls-overall-info">' +
          '<span class="ls-overall-label">Umumiy progress</span>' +
          '<div class="ls-overall-pct">' + allPct + '<small>%</small></div>' +
          '<p class="ls-overall-stats"><strong>' + totalDone + '</strong> / ' + totalLessons + ' dars tugallangan</p>' +
          '<p class="ls-overall-motive">' + motive + '</p>' +
          '</div>' +
          '<div class="ls-overall-ring-wrap">' +
          '<svg class="ls-overall-ring" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle class="ls-ring-bg" cx="50" cy="50" r="42"></circle>' +
          '<circle class="ls-ring-fill" cx="50" cy="50" r="42" stroke-dasharray="' + ringC.toFixed(1) + '" stroke-dashoffset="' + ringOff.toFixed(1) + '"></circle>' +
          '</svg>' +
          '<div class="ls-ring-pct">' + allPct + '<small>%</small></div>' +
          '</div>' +
          '<div class="ls-overall-robot">' + robotHtml + '</div>' +
          '</div>';
        // Halqa 0'dan haqiqiy qiymatgacha smooth to'ladi (reduced-motion'da darhol)
        const ring = overallSlot.querySelector('.ls-ring-fill');
        if (ring && !reducedMotion()) {
          ring.style.transition = 'none';
          ring.style.strokeDashoffset = String(ringC);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              ring.style.transition = 'stroke-dashoffset 1s var(--bounce)';
              ring.style.strokeDashoffset = String(ringOff);
            });
          });
        }
        const ctaEl = overallSlot.querySelector('.ls-overall-cta');
        if (ctaEl) ctaEl.addEventListener('click', continueCurrentLesson);
      }

      // --- DAVOM ETTIRISH — joriy dars (real user state asosida) ---
      if (contSlot) {
        const activeId = lastActiveCourseId() || firstNotStartedCourseId();
        const course = activeId ? window.CoursesAPI.getCourse(activeId) : null;
        if (!course) {
          contSlot.innerHTML = '';
        } else if (!resumeLesson(course) && allFinished) {
          // Barcha darslar tugallangan — nishonlash holati
          contSlot.innerHTML =
            '<div class="ls-continue ls-continue-done">' +
            '<div class="ls-continue-info">' +
            '<div class="ls-continue-icon">🎉</div>' +
            '<div class="ls-continue-text">' +
            '<h3>Barcha darslarni tugatdingiz!</h3>' +
            '<p class="ls-continue-sub">Zo‘r ish! Bilimingizni Testlar bo‘limida mustahkamlab turing.</p>' +
            '</div>' +
            '</div>' +
            '</div>';
        } else {
          const pct = progressPercent(course.id, course);
          const res = resumeLesson(course);
          contSlot.innerHTML =
            '<div class="ls-continue-head"><h4>Davom ettirish</h4>' +
            '<span>' + esc(course.name) + ' kursi &middot; ' + (res ? res.number + '-dars' : 'yakunlangan') + '</span></div>' +
            '<div class="ls-continue">' +
            '<div class="ls-continue-info">' +
            '<div class="ls-continue-icon">' + esc(course.icon) + '</div>' +
            '<div class="ls-continue-text">' +
            (res
              ? '<span class="ls-continue-course">' + esc(course.name) + ' &middot; ' + res.number + '-dars</span>' +
              '<h3>' + esc(res.title) + '</h3>' +
              '<div class="ls-continue-meta"><span>⏱ ' + res.duration + ' daqiqa</span>' +
              '<span class="ls-continue-xp">+' + (res.xp || 10) + ' XP</span></div>'
              : '<h3>🎉 ' + esc(course.name) + ' kursi yakunlangan!</h3>' +
              '<p class="ls-continue-sub">Barcha darslar tugallangan — qolgan kurslarni ko‘rib chiqing.</p>') +
            '</div>' +
            '</div>' +
            '<div class="ls-continue-progress">' +
            '<div class="ls-continue-bar"><span style="width:' + pct + '%"></span></div>' +
            '<span class="ls-continue-pct">' + pct + '%</span>' +
            '</div>' +
            '<button type="button" class="btn ls-btn-continue" id="lsContinueBtn">' + (res ? '▶ Davom ettirish' : 'Kursni ko‘rish') + ' <span class="ls-btn-arrow">→</span></button>' +
            '</div>';
          const btn = $('#lsContinueBtn');
          if (btn) btn.addEventListener('click', function () {
            // Joriy (davom etayotgan) darsni aynan ochish — dars boshiga majburan qaytarilmaydi
            if (res) openLesson(course.id, res.id);
            else openCourse(course.id);
          });
        }
      }

      // --- Kurs kartalari ---
      const courses = window.CoursesAPI.listCourses();
      const tcEl = $('#lsTopicsCount');
      if (tcEl) tcEl.textContent = courses.length + ' ta fan';
      if (!courses.length) {
        grid.innerHTML =
          '<div class="ls-empty" style="grid-column:1/-1">' +
          '<div class="ls-empty-ico">📭</div>' +
          '<h4>Kurslar hozircha bo‘sh</h4>' +
          '<p>Kurslar tez orada qo‘shiladi.</p>' +
          '</div>';
        return;
      }
      grid.innerHTML = courses.map(function (c, i) {
        const done = completedCount(c.id);
        const pct = progressPercent(c.id, c);
        const finished = done >= c.lessonCount && c.lessonCount > 0;
        const inProgress = !finished && pct > 0;
        /* Kichik STATUS badge — faqat holat, BUTTON emas. Yagona action = butun karta clickable. */
        const status = finished
          ? '<span class="ls-status ls-status-done">✅ Tugallangan</span>'
          : (inProgress
            ? '<span class="ls-status ls-status-active">Davom etmoqda</span>'
            : '<span class="ls-status ls-status-idle">Boshlanmagan</span>');
        /* O'ng tomon holat belgisi: ✓ tugallangan | mini progress ring + % */
        const RING_C = (2 * Math.PI * 18).toFixed(1);
        let stateHtml;
        if (finished) {
          stateHtml = '<div class="ls-course-state ls-state-done" aria-hidden="true"><span>✓</span></div>';
        } else {
          const off = (2 * Math.PI * 18 * (1 - pct / 100)).toFixed(1);
          stateHtml = '<div class="ls-course-state ls-state-ring' + (inProgress ? '' : ' ls-state-idle') + '" aria-hidden="true">' +
            '<svg viewBox="0 0 44 44">' +
            '<circle class="ls-state-ring-bg" cx="22" cy="22" r="18"></circle>' +
            '<circle class="ls-state-ring-fill" cx="22" cy="22" r="18" data-pct="' + pct + '" stroke-dasharray="' + RING_C + '" stroke-dashoffset="' + off + '"></circle>' +
            '</svg>' +
            '<span class="ls-state-ring-pct">' + pct + '%</span>' +
            '</div>';
        }
        /* Ixcham gorizontal learning card: icon + title/desc/count + ring.
           FAQAT BITTA action: butun karta clickable (pastda bind qilinadi).
           Alohida "Boshlash/Davom ettirish" tugmasi YO'Q — status pill faqat holat. */
        return (
          '<div class="ls-course-card' + (finished ? ' ls-course-finished' : '') + '" data-course="' + esc(c.id) + '" role="button" tabindex="0" style="--ls-color:' + esc(c.color) + ';animation-delay:' + (Math.min(i, 11) * 50) + 'ms">' +
          '<div class="ls-course-icon">' + esc(c.icon) + '</div>' +
          '<div class="ls-course-id">' +
          '<h4>' + esc(c.name) + '</h4>' +
          '<p class="ls-course-tagline">' + esc(c.tagline) + '</p>' +
          '<div class="ls-course-meta">' +
          '<span>📚 ' + c.lessonCount + ' ta dars</span>' +
          status +
          '</div>' +
          '</div>' +
          '<div class="ls-course-side">' +
          stateHtml +
          '</div>' +
          '</div>'
        );
      }).join('');

      // Kartalar bosilishi — yagona action (butun karta clickable)
      $$('.ls-course-card', grid).forEach(function (card) {
        card.addEventListener('click', function () { openCourse(card.getAttribute('data-course')); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCourse(card.getAttribute('data-course')); }
        });
      });

      // Progress barlar 0'dan smooth to'lishi
      animateProgressBars($('#page-lessons'));
      animateStateRings(grid);
    }

    /* ==========================================================
       2) KURS SAHIFASI — darslar ro'yxati
       ========================================================== */
    function openCourse(courseId) {
      const course = window.CoursesAPI.getCourse(courseId);
      if (!course) { toast('Kurs topilmadi', 'error'); return; }
      state.currentCourseId = courseId;
      state.currentLessonId = null;
      state.lessonPhase = 'read';
      state.quiz = null;
      loadStore();
      // Birinchi marta kirilyotgan bo'lsa — bilim darajasi so'raladi
      if (!levelOf(courseId)) {
        renderCoursePage();
        page('lessonCourse');
        openLevelModal(courseId, true);
        return;
      }
      renderCoursePage();
      page('lessonCourse');
    }

    function renderCoursePage() {
      const wrap = $('#lsCourseContainer');
      if (!wrap) return;
      loadStore();
      const course = window.CoursesAPI.getCourse(state.currentCourseId);
      if (!course) {
        wrap.innerHTML = '<div class="ls-empty"><div class="ls-empty-ico">🤔</div><h4>Kurs topilmadi</h4><p>Darslar sahifasidan kursni tanlang.</p></div>';
        return;
      }
      const done = completedCount(course.id);
      const pct = progressPercent(course.id, course);
      const lvl = levelOf(course.id);
      const cur = currentLesson(course);

      const titleEl = $('#pageTitle');
      if (titleEl) titleEl.textContent = course.name + ' kursi';

      /* finishedAll — barcha darslar tugallanganmi (robot 'complete' holati uchun) */
      const finishedAll = done >= course.lessonCount && course.lessonCount > 0;
      let heroRobot = '';
      try {
        if (window.ITMascot && typeof window.ITMascot.html === 'function') {
          heroRobot = window.ITMascot.html(finishedAll ? 'complete' : 'idle');
        }
      } catch (e) { /* mascot mavjud emas — jim o'tkazamiz */ }

      /* REFERENCE COMPOSITION:
         1) ← Kursga qaytish (yuqori qator)
         2) HERO: icon + title/tagline + "N / M dars" + progress + % | ROBOT + floating badge'lar | quote kartasi
         3) "Darslar yo'li" sarlavha + subtitle | level chip + sozlamalar + davom ettirish */
      let head =
        '<div class="ls-course-topbar">' +
        '<button type="button" class="ls-back-btn" id="lsBackToLessons">← Kursga qaytish</button>' +
        '</div>' +
        '<div class="ls-course-head ls-hero" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-hero-main">' +
        '<div class="ls-course-head-icon">' + esc(course.icon) + '</div>' +
        '<div class="ls-course-head-info">' +
        '<h3>' + esc(course.name) + '</h3>' +
        '<p>' + esc(course.tagline || course.description) + '</p>' +
        '<div class="ls-hero-countrow">' +
        '<span class="ls-hero-count">📚 <strong>' + done + '</strong> / ' + course.lessonCount + ' dars</span>' +
        '<div class="ls-progress-track"><span style="width:' + pct + '%"></span></div>' +
        '<span class="ls-progress-pct">' + pct + '%</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        (heroRobot
          ? '<div class="ls-hero-robot" aria-hidden="true">' + heroRobot +
          '<span class="ls-hero-badge ls-hero-badge--code">&lt;/&gt;</span>' +
          '<span class="ls-hero-badge ls-hero-badge--tag">' + esc(course.name) + '</span>' +
          '</div>'
          : '') +
        '<div class="ls-hero-quote">' +
        '<p>“Katta loyihalar kichik qadamlar bilan boshlanadi.”</p>' +
        '<span class="ls-hero-quote-ico" aria-hidden="true">🚀</span>' +
        '</div>' +
        '</div>' +
        '<div class="ls-road-head">' +
        '<div class="ls-road-title">' +
        '<span class="ls-road-ico" aria-hidden="true">📚</span>' +
        '<div class="ls-road-title-text">' +
        '<h3>Darslar yo‘li</h3>' +
        '<p>Quyidagi ketma-ketlikda darslarni o‘ting va yangi imkoniyatlarni oching!</p>' +
        '</div>' +
        '</div>' +
        '<div class="ls-course-head-actions ls-road-actions">' +
        '<span class="ls-level-chip">🧠 Bilim darajasi: <strong>' + esc(lvl ? LEVEL_LABELS[lvl] : '—') + '</strong></span>' +
        '<button type="button" class="btn btn-ghost" id="lsSettingsBtn">⚙️ Sozlamalar</button>' +
        (cur ? '<button type="button" class="btn btn-primary" id="lsResumeBtn">Davom ettirish <span class="ls-btn-arrow">→</span></button>' : '') +
        '</div>' +
        '</div>';

      let list;
      if (!course.lessons.length) {
        list = '<div class="ls-empty"><div class="ls-empty-ico">📭</div><h4>Darslar hozircha bo‘sh</h4><p>Ushbu kursga darslar tez orada qo‘shiladi.</p></div>';
      } else {
        /* ==========================================================
           COURSE PATH — SNAKE / WINDING LEARNING ROAD (0'dan qurildi)
           • Node: deterministik zigzag x-pozitsiya (random emas)
           • Karta: node'ning qarshi tomonida (chap-o'ng almashadi)
           • Yo'l: bitta uzluksiz SVG cubic Bézier (base + progress)
           • Data: mavjud CoursesAPI (title/duration/xp/order/unlock)
           ========================================================== */
        /* Desktop zigzag fraksiyalari: juft indeks → chap, toq → o'ng.
           Amplituda har qadamda ozgina o'zgaradi — "jonli" snake yo'l. */
        const xLeft = [0.38, 0.3, 0.34];
        const xRight = [0.66, 0.72, 0.68];
        const rowsHtml = course.lessons.map(function (l, i) {
          const unlocked = isLessonUnlocked(course, l, i);
          const completed = isLessonCompleted(course.id, l.id);
          const isCur = cur && cur.id === l.id && !completed;
          let state, face, cardState, statusTxt, actionTxt;
          if (!unlocked) {
            state = 'locked'; face = '🔒'; cardState = 'locked';
            statusTxt = '🔒 Yopiq'; actionTxt = '';
          } else if (completed) {
            state = 'done'; face = '✓'; cardState = 'done';
            statusTxt = '✓ Tugallangan'; actionTxt = 'Qayta ko‘rish';
          } else if (isCur) {
            state = 'current'; face = '▶'; cardState = 'current';
            statusTxt = 'Davom etmoqda'; actionTxt = 'Davom ettirish';
          } else {
            state = 'open'; face = String(l.number); cardState = 'open';
            statusTxt = 'Boshlanmagan'; actionTxt = 'Boshlash';
          }
          const xf = i % 2 === 0 ? xLeft[(i / 2) % 3] : xRight[((i - 1) / 2) % 3];
          const mxf = i % 2 === 0 ? 0.62 : 0.38; /* mobil: ±12% ixcham zigzag */
          const cardCol = xf < 0.5 ? 3 : 1;      /* node chapda → karta o'ngda */
          const cardJust = cardCol === 3 ? 'start' : 'end';
          const cardAlign = mxf > 0.5 ? 'end' : 'start'; /* mobil: karta node tomonida */
          return (
            '<div class="ls-crow' + (isCur ? ' ls-crow--current' : '') + '" style="' +
            '--l:calc((100% - 76px) * ' + xf + ');--r:calc((100% - 76px) * ' + (1 - xf).toFixed(2) + ');' +
            '--lm:calc((100% - 58px) * ' + mxf + ');--rm:calc((100% - 58px) * ' + (1 - mxf).toFixed(2) + ');' +
            '--card-col:' + cardCol + ';--card-just:' + cardJust + ';--card-align:' + cardAlign + ';' +
            'animation-delay:' + (Math.min(i, 12) * 45) + 'ms">' +
            '<button type="button" class="ls-cnode ls-cnode--' + state + '" data-lesson="' + esc(l.id) + '" data-state="' + state + '"' +
            ' aria-label="' + l.number + '-dars: ' + esc(l.title) + (completed ? ' (tugallangan)' : (state === 'locked' ? ' (yopiq)' : '')) + '">' +
            '<span class="ls-cnode-face" aria-hidden="true">' + face + '</span>' +
            '</button>' +
            '<article class="ls-ccard ls-ccard--' + cardState + '" data-lesson="' + esc(l.id) + '" tabindex="0" role="button"' +
            ' aria-label="' + l.number + '-dars: ' + esc(l.title) + '. ' + esc(statusTxt) + '">' +
            '<div class="ls-ccard-top">' +
            '<span class="ls-ccard-num">' + l.number + '-dars</span>' +
            '<span class="ls-ccard-status ls-ccard-status--' + state + '">' + statusTxt + '</span>' +
            '</div>' +
            '<h5 class="ls-ccard-title">' + esc(l.title) + '</h5>' +
            (l.description ? '<p class="ls-ccard-desc">' + esc(l.description) + '</p>' : '') +
            '<div class="ls-ccard-meta">' +
            '<span>⏱ ' + l.duration + ' daqiqa</span>' +
            '<span>⭐ +' + (l.xp || 10) + ' XP</span>' +
            '<span>' + esc(l.difficulty) + '</span>' +
            '</div>' +
            (actionTxt ? '<span class="ls-ccard-action ls-ccard-action--' + state + '">' + actionTxt + ' <b>→</b></span>' : '') +
            '</article>' +
            '</div>'
          );
        }).join('');

        list =
          '<div class="ls-cpath" id="lsCoursePath">' +
          /* PathBackground — dekorativ fon (hammasi pointer-events: none) */
          '<div class="ls-cpath-bg" aria-hidden="true">' +
          '<span class="ls-cpath-blob ls-cpath-blob--a"></span>' +
          '<span class="ls-cpath-blob ls-cpath-blob--b"></span>' +
          '<span class="ls-cpath-dots"></span>' +
          '<span class="ls-cpath-chip ls-cpath-chip--html">&lt;/&gt;</span>' +
          '<span class="ls-cpath-chip ls-cpath-chip--css">{ }</span>' +
          '<span class="ls-cpath-chip ls-cpath-chip--js">JS</span>' +
          '<span class="ls-cpath-decor ls-cpath-decor--laptop">💻</span>' +
          '</div>' +
          /* SvgLearningRoad — base (kulrang) + progress (gradient, real progress bilan to'ladi) */
          '<svg class="ls-cpath-road" aria-hidden="true" focusable="false" preserveAspectRatio="none">' +
          '<defs>' +
          '<linearGradient id="lsRoadGrad" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#3b82f6" />' +
          '<stop offset="55%" stop-color="#7c5cff" />' +
          '<stop offset="100%" stop-color="#06b6d4" />' +
          '</linearGradient>' +
          '</defs>' +
          '<path class="ls-croad-base" />' +
          '<path class="ls-croad-progress" pathLength="1" />' +
          '</svg>' +
          rowsHtml +
          '</div>';
      }

      wrap.innerHTML = head + list;

      /* Snake yo'lni chizish (SVG Bézier + real progress) + eventlar */
      bindCoursePathResize();
      requestAnimationFrame(function () { drawCourseRoad(wrap); });
      setupCoursePath(wrap, course);

      // Eventlar (settings / back / resume)
      const settingsBtn = $('#lsSettingsBtn');
      if (settingsBtn) settingsBtn.addEventListener('click', function () { openSettingsModal(state.currentCourseId); });
      const backBtn = $('#lsBackToLessons');
      if (backBtn) backBtn.addEventListener('click', function () {
        state.currentCourseId = null;
        state.currentLessonId = null;
        state.diagnostic = null;
        page('lessons');
      });
      const resumeBtn = $('#lsResumeBtn');
      if (resumeBtn) resumeBtn.addEventListener('click', function () {
        const res = resumeLesson(course);
        if (res) openLesson(course.id, res.id);
      });

      // Progress bar 0'dan smooth to'lishi
      animateProgressBars(wrap);
    }

    /* ==========================================================
       2b) COURSE PATH — SNAKE / WINDING ROAD yordamchilari
           • Uzluksiz SVG cubic Bézier yo'l node markazlari orasida
           • progressPath stroke-dashoffset bilan real progressga qarab to'ladi
           • Resize'da debounce bilan qayta chiziladi (passiv listener)
       ========================================================== */
    let _cpathResizeBound = false;

    /** Node markazlari orasidan smooth "snake road" chizadi + progressni to'ldiradi */
    function drawCourseRoad(root) {
      const pathEl = $('.ls-cpath', root) || (root && root.classList && root.classList.contains('ls-cpath') ? root : null);
      const svg = pathEl ? $('.ls-cpath-road', pathEl) : null;
      if (!pathEl || !svg) return;
      const base = $('.ls-croad-base', svg);
      const prog = $('.ls-croad-progress', svg);
      if (!base || !prog) return;
      const pRect = pathEl.getBoundingClientRect();
      if (!pRect.width || !pRect.height) return; // jsdom / yashirin holat
      svg.setAttribute('viewBox', '0 0 ' + Math.round(pRect.width) + ' ' + Math.round(pRect.height));
      const nodeEls = $$('.ls-cnode', pathEl);
      if (!nodeEls.length) return;
      const pts = nodeEls.map(function (n) {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - pRect.left, y: r.top + r.height / 2 - pRect.top };
      });
      /* Uzluksiz smooth Bézier: har qo'shni juftlik orasida S-curve.
         Kontrol nuqtalar gorizontal midpointda — node'larda tangent vertikal,
         shuning uchun yo'lda hech qanday o'tkir burchak yo'q. */
      let d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (let i = 1; i < pts.length; i++) {
        const my = ((pts[i - 1].y + pts[i].y) / 2).toFixed(1);
        d += ' C' + pts[i - 1].x.toFixed(1) + ' ' + my +
          ', ' + pts[i].x.toFixed(1) + ' ' + my +
          ', ' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1);
      }
      base.setAttribute('d', d);
      prog.setAttribute('d', d);

      /* REAL PROGRESS: birinchi tugallanmagan (joriy) node markazigacha
         yo'l uzunligining qanday qismi to'ladi — hech narsa hardcode emas. */
      const courseId = state.currentCourseId;
      const courseObj = courseId ? window.CoursesAPI.getCourse(courseId) : null;
      if (!courseObj) return;
      let targetIdx = -1;
      for (let i = 0; i < courseObj.lessons.length; i++) {
        if (!isLessonCompleted(courseId, courseObj.lessons[i].id)) { targetIdx = i; break; }
      }
      prog.style.transition = 'none';
      if (targetIdx === 0) { prog.style.strokeDasharray = '1'; prog.style.strokeDashoffset = '1'; return; }
      let frac = 1; // hammasi tugallangan → to'liq yo'l
      if (targetIdx > 0) {
        try {
          const total = prog.getTotalLength();
          const targetY = pts[targetIdx].y;
          let best = 0;
          const STEPS = 64;
          for (let s = 1; s <= STEPS; s++) {
            const len = total * s / STEPS;
            const pt = prog.getPointAtLength(len);
            if (pt.y <= targetY + 0.5) best = len; else break;
          }
          frac = total > 0 ? best / total : 0;
        } catch (e) { frac = 0; }
      }
      const target = String(Math.max(0, 1 - frac));
      prog.style.strokeDasharray = '1';
      if (reducedMotion()) { prog.style.strokeDashoffset = target; return; }
      prog.style.strokeDashoffset = '1';
      requestAnimationFrame(function () {
        prog.style.transition = 'stroke-dashoffset 0.9s var(--bounce)';
        prog.style.strokeDashoffset = target;
      });
    }

    function bindCoursePathResize() {
      if (_cpathResizeBound) return;
      _cpathResizeBound = true;
      let t = null;
      window.addEventListener('resize', function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          const j = document.querySelector('.ls-cpath');
          if (j) drawCourseRoad(j);
        }, 160);
      }, { passive: true });
    }

    /** Node/karta click → mavjud openLesson oqimi (qulf modal, resume, XP — hammasi saqlanadi) */
    function setupCoursePath(wrap, course) {
      const pathEl = $('#lsCoursePath', wrap);
      if (!pathEl) return;
      $$('.ls-cnode, .ls-ccard', pathEl).forEach(function (el) {
        const go = function () {
          const lid = el.getAttribute('data-lesson');
          const f = window.CoursesAPI.findLesson(course.id, lid);
          if (!f) return;
          // Qulflangan dars: shake + mavjud toast/qulf modal oqimi (openLesson ichida)
          if (!isLessonUnlocked(f.course, f.lesson, f.index)) shakeEl(el);
          openLesson(course.id, lid);
        };
        el.addEventListener('click', go);
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
      });
    }

    /* ==========================================================
       3) DARSNI OCHISH + QULF MODALI
       ========================================================== */
    function openLesson(courseId, lessonId) {
      const found = window.CoursesAPI.findLesson(courseId, lessonId);
      if (!found) { toast('Dars topilmadi', 'error'); return; }
      const course = found.course, lesson = found.lesson, index = found.index;

      if (!isLessonUnlocked(course, lesson, index)) {
        openLockedModal(course, lesson, index);
        return; // foydalanuvchi boshqa sahifaga olib ketilmaydi
      }

      state.currentCourseId = courseId;
      state.currentLessonId = lessonId;
      state.lessonPhase = 'read'; // har doim o'qish bosqichidan boshlanadi
      state.quiz = null;
      // oxirgi faollikni saqlash (davom ettirish uchun)
      const prog = courseProgress(courseId);
      prog.lastLessonId = lessonId;
      prog.lastVisit = Date.now();
      store.progress[courseId] = prog;
      saveStore();

      renderLessonView();
      page('lessonView');
    }

    function openLockedModal(course, lesson, index) {
      // Kichik notification (toast) — smooth slide/fade bilan
      toast('🔒 Bu dars hozircha yopiq. Avvalgi darsni tugating.', 'warning');
      const modal = $('#lessonLockedModal');
      const body = $('#lessonLockedBody');
      const footer = $('#lessonLockedFooter');
      if (!modal || !body) return;
      const prev = course.lessons[index - 1];
      body.innerHTML =
        '<div class="ls-locked-body">' +
        '<div class="ls-locked-ico">🔒</div>' +
        '<h4>Bu dars hozircha yopiq</h4>' +
        '<p>Avvalgi darsni tugatib, keyingi mavzuni oching.<br>' +
        'Progressingiz: <strong>' + progressPercent(course.id, course) + '%</strong> (' +
        completedCount(course.id) + '/' + course.lessonCount + ' dars)</p>' +
        (prev ? '<span class="ls-locked-prev">🔓 ' + prev.number + '-dars: ' + esc(prev.title) + '</span>' : '') +
        '</div>';
      if (footer) {
        footer.innerHTML = prev
          ? '<button type="button" class="btn btn-primary" id="lsGoPrevBtn">← Oldingi darsga o‘tish</button>' +
          '<button type="button" class="btn btn-ghost" data-close>Yopish</button>'
          : '<button type="button" class="btn btn-primary" data-close>Yopish</button>';
        const goPrev = $('#lsGoPrevBtn');
        if (goPrev) goPrev.addEventListener('click', function () {
          modal.classList.remove('active');
          openLesson(course.id, prev.id);
        });
      }
      modal.classList.add('active');
    }

    /* ==========================================================
       4) DARS VIEWER — 3 BOSQICH: 📚 Read | 🧪 Quiz | 🏆 Result
       ========================================================== */

    /** Scroll kuzatuvini tozalash */
    function cleanupScroll() {
      if (state._scrollCleanup) {
        try { state._scrollCleanup(); } catch (e) { /* ignore */ }
        state._scrollCleanup = null;
      }
    }

    /** Dars kontentini HTML bloklarga aylantirish (bo'limlar + kod + natija + eslatmalar) */
    function renderLessonContentHTML(content, course, lesson) {
      let html = '';
      if (content.intro) {
        html += '<div class="ls-content-intro">💡 ' + fmtText(content.intro) + '</div>';
      }
      // 🔁 Tezkor eslatma — review savollari BITTADAN chiqadi
      if (content.reviewQuiz) {
        const rq = content.reviewQuiz;
        html += '<div class="ls-review-quiz" id="lsReviewQuiz">' +
          '<div class="ls-rq-title">' + esc(rq.title || '🔁 Tezkor eslatma') + '</div>' +
          (rq.subtitle ? '<div class="ls-rq-sub">' + fmtText(rq.subtitle) + '</div>' : '') +
          '<div class="ls-rq-body" data-rq-body></div>' +
          '</div>';
      }
      // "Eslab qol" — oldingi darslar review kartalari
      if (Array.isArray(content.review) && content.review.length) {
        html += '<div class="ls-review-cards"><div class="ls-review-cards-title">' + esc(content.reviewTitle || '🔁 Eslab qol') + '</div><div class="ls-review-cards-grid">' +
          content.review.map(function (c) {
            return '<div class="ls-review-card"><code>' + esc(c.t) + '</code><span>' + esc(c.d) + '</span></div>';
          }).join('') + '</div></div>';
      }
      (content.sections || []).forEach(function (sec, i) {
        html += '<div class="ls-content-section" id="ls-sec-' + i + '">';
        html += '<div class="ls-content-sec-title"><span class="ls-sec-num">' + (i + 1) + '</span><span>' + esc(sec.title || '') + '</span></div>';
        if (sec.text) html += '<div class="ls-content-text">' + fmtText(sec.text) + '</div>';
        if (sec.code) {
          html += '<div class="ls-content-codeblock">' +
            '<div class="ls-code-lang">💻 HTML</div>' +
            '<pre class="ls-content-code">' + esc(sec.code) + '</pre>' +
            (sec.codeNote ? '<div class="ls-content-codenote">🔍 <b>Kod izohi:</b> ' + fmtText(sec.codeNote) + '</div>' : '') +
            (sec.playground ? '<button type="button" class="ls-open-playground" data-ls-raw-code="' + esc(sec.code) + '" data-ls-sec-title="' + esc(sec.title || '') + '">💻 CODINGDA SINAB KO‘R</button>' : '') +
            (sec.demoButton ? '<button type="button" class="ls-open-playground ls-alert-demo" data-alert-msg="' + esc(sec.demoButton.msg) + '">' + esc(sec.demoButton.label) + '</button>' : '') +
            '</div>';
        }
        if (sec.previewHtml) {
          html += '<div class="ls-img-preview" data-img-url="' + esc(sec.imgCheckUrl || '') + '">' +
            '<iframe class="ls-img-preview-frame" title="Preview" sandbox="allow-same-origin" srcdoc="' + esc(sec.previewHtml) + '"></iframe>' +
            (sec.previewCaption ? '<div class="ls-img-caption">' + fmtText(sec.previewCaption) + '</div>' : '') +
            '<div class="ls-img-failed" hidden>⚠️ Rasm yuklanmadi — internet aloqasini tekshiring.</div>' +
            '</div>';
        }
        if (sec.liveDemo) {
          /* 🎮 REAL INTERACTIVE DEMO — chapda kod, o'ngda haqiqiy preview (Run bosilganda srcdoc yangilanadi) */
          html += '<div class="ls-livedemo">' +
            '<div class="ls-livedemo-head">🎮 Real Interactive Demo — kodni o‘zgartiring va ▶ RUN bosing</div>' +
            '<textarea class="ls-ex-code" data-demo-code="1" spellcheck="false" aria-label="Demo kod muharriri">' + esc(sec.liveDemo.code || '') + '</textarea>' +
            '<div class="ls-ex-actions"><button type="button" class="btn btn-primary btn-sm" data-demo-run="1">▶ RUN</button></div>' +
            '<div class="ls-ex-preview-wrap"><div class="ls-ex-preview-label">👁 LIVE PREVIEW</div>' +
            '<iframe class="ls-ex-preview ls-livedemo-frame" title="Live Preview" sandbox="allow-scripts allow-modals allow-popups allow-forms"></iframe></div>' +
            '</div>';
        }
        if (sec.result) html += '<div class="ls-content-result"><span class="ls-content-result-label">🖥 Natija:</span> ' + fmtText(sec.result) + '</div>';
        if (sec.note) html += '<div class="ls-content-note">⭐ ' + fmtText(sec.note) + '</div>';
        html += '</div>';
      });
      // 🎛 "Bir sahifa, uch xil holat" — interaktiv demo (HTML only / +CSS / +JS)
      if (content.triDemo) html += renderTriDemoHTML(content.triDemo);
      if (Array.isArray(content.keyPoints) && content.keyPoints.length) {
        html += '<div class="ls-content-keypoints">' +
          '<div class="ls-content-sec-title"><span class="ls-sec-num kp">⭐</span><span>Muhim eslatmalar</span></div>' +
          '<ul>' + content.keyPoints.map(function (kp) { return '<li>' + fmtText(kp) + '</li>'; }).join('') + '</ul></div>';
      }
      // 🚀 5-dars motivatsiya banneri
      if (content.motivation) {
        html += '<div class="ls-motivation"><div class="ls-motivation-title">' + esc(content.motivationTitle || '🚀 5-DARSDA BIRINCHI MINI LOYIHANGIZ!') + '</div>' +
          '<div class="ls-motivation-text">' + fmtText(content.motivation) + '</div></div>';
      }
      // 🎛 Interaktiv attribute demo — ✨ Attribute Magic (toggle rejimi)
      if (content.attrDemo) {
        html += '<div class="ls-content-section" id="lsAttrDemo"><div class="ls-content-sec-title"><span class="ls-sec-num">✨</span><span>Attribute Magic — atributlarni yoqib/o‘chirib ko‘ring</span></div>' +
          '<p class="ls-content-text">Har bir tugma bosilganda real HTML preview o‘zgaradi. Qaysi atribut nima qilganini toping 😄</p>' +
          '<div class="ls-attr-demo">' +
          '<div class="ls-attr-controls" id="lsAttrControls">' +
          ['src', 'alt', 'class', 'id', 'title'].map(function (a) {
            return '<label class="ls-attr-row ls-attr-toggle"><input type="checkbox" data-attr="' + a + '" checked><span class="ls-attr-toggle-label">' + esc(a) + ' <span class="ls-attr-state" data-state="' + a + '">ON ✅</span></span></label>';
          }).join('') +
          '</div>' +
          '<div class="ls-attr-preview-wrap">' +
          '<div class="ls-attr-code" id="lsAttrCode"></div>' +
          '<iframe class="ls-attr-preview" id="lsAttrPreview" title="Attribute demo preview" sandbox="allow-same-origin"></iframe>' +
          '<div class="ls-img-failed" id="lsAttrImgFailed" hidden>⚠️ src manzili yuklanmadi — internetni tekshiring.</div>' +
          '<div class="ls-img-caption" id="lsAttrHint">🖱️ Rasm ustiga olib boring — title yoqiq bo‘lsa tooltip chiqadi.</div>' +
          '</div>' +
          '</div></div>';
      }
      // 🎮 5-dars: 7 mini-o‘yin + loyiha (test o‘rniga LOYIHA baholash)
      if (Array.isArray(content.games) && content.games.length) html += renderGamesHTML(course, lesson);
      if (content.project) html += renderProjectHTML(course, lesson);
      if (Array.isArray(content.exercises) && content.exercises.length) {
        html += renderExercisesHTML(course, lesson);
      }
      return html;
    }

    /* ---------- 3-DARS EXTRAS: rasm preview tekshiruvi + interaktiv attribute demo ---------- */

    /** src manzili real yuklanishini tekshirish (onerror sandboxda ishlamaydi — shu yerda tekshiramiz) */
    function checkImageLoad(url, onOk, onFail) {
      if (!url) { onFail(); return; }
      const img = new Image();
      let settled = false;
      const timer = setTimeout(function () { if (!settled) { settled = true; onFail(); } }, 10000);
      img.onload = function () { if (!settled) { settled = true; clearTimeout(timer); onOk(); } };
      img.onerror = function () { if (!settled) { settled = true; clearTimeout(timer); onFail(); } };
      img.src = url;
    }

    /** Rasm preview bloklarida real yuklanishni tekshirish */
    function setupImagePreviews() {
      document.querySelectorAll('.ls-img-preview[data-img-url]').forEach(function (box) {
        const url = box.getAttribute('data-img-url');
        const failed = box.querySelector('.ls-img-failed');
        checkImageLoad(url, function () { if (failed) failed.hidden = true; }, function () { if (failed) failed.hidden = false; });
      });
    }

    /** ✨ Attribute Magic — har bir atributni yoqib/o‘chirib, real previewda natijani ko‘rish */
    function setupAttrDemo(content) {
      const demo = $('#lsAttrDemo');
      if (!demo || !content.attrDemo) return;
      const cfg = content.attrDemo;
      const boxes = demo.querySelectorAll('#lsAttrControls input[type="checkbox"][data-attr]');
      const values = { src: cfg.src || '', alt: cfg.alt || '', title: cfg.title || '', 'class': cfg.className || '', id: cfg.id || '' };
      const codeEl = $('#lsAttrCode');
      const preview = $('#lsAttrPreview');
      const failedEl = $('#lsAttrImgFailed');

      function active() {
        const out = [];
        boxes.forEach(function (b) { if (b.checked) out.push(b.getAttribute('data-attr')); });
        return out;
      }
      function buildHtml(attrs) {
        if (!attrs.length) return '<!-- Hozircha atribut yo‘q 😅 -->';
        return '<img\n' + attrs.map(function (a) {
          return '    ' + (a === 'class' ? 'class' : a) + '="' + values[a] + '"';
        }).join('\n') + '\n>';
      }
      function buildSrcdoc(attrs) {
        let imgAttrs = attrs.map(function (a) {
          return (a === 'class' ? 'class="photo"' : a + '="' + values[a] + '"');
        }).join(' ');
        return '<style>' +
          '.photo{max-width:100%;height:auto;border:3px solid #6366f1;border-radius:14px;display:block;margin:10px auto}' +
          'body{font-family:sans-serif;background:#0b0f1d;color:#f8fafc;text-align:center;padding:8px}' +
          '.cap{color:#94a3b8;font-size:13px;margin-top:6px}' +
          '</style>' +
          (attrs.length ? '<img ' + imgAttrs + '>' : '<div class="cap">Atributlar o‘chirilgan — hech narsa ko‘rinmi? 😄</div>') +
          '<div class="cap">📷 Bu real HTML &lt;img&gt; elementi — sizning atributlaringiz bilan.</div>';
      }
      function update() {
        const attrs = active();
        boxes.forEach(function (b) {
          const st = demo.querySelector('[data-state="' + b.getAttribute('data-attr') + '"]');
          if (st) st.textContent = b.checked ? 'ON ✅' : 'OFF ❌';
        });
        if (codeEl) codeEl.textContent = buildHtml(attrs);
        if (preview) preview.setAttribute('srcdoc', buildSrcdoc(attrs));
        checkImageLoad(values.src, function () { if (failedEl) failedEl.hidden = true; }, function () { if (failedEl) failedEl.hidden = false; });
      }
      boxes.forEach(function (b) { b.addEventListener('change', update); });
      update(); // boshlang'ich holat
    }

    /* ==========================================================
       LESSON ↔ CODING RETURN CONTEXT (generic — barcha darslar)
       Muammo sabablari:
         1) scroll window orqali bo'ladi, .ls-viewer-body scroll konteyner emas
            → eski kod hamesha scrollY=0 saqlardi;
         2) restore ham .ls-viewer-body.scrollTop ga yozardi (ta'sir qilmasdi);
         3) page('lessonView') showPage() ichida window.scrollTo(0) qiladi
            → render paytidagi scroll keyin yana 0 ga tushardi.
       Yechim: window scrollni saqlash + sectionId/sectionIndex + DOM/layout
       tayyor bo'lgandan keyin (rAF ×2 + kechikish) window.scrollTo bilan tiklash.
       ========================================================== */
    /** Darsning joriy scroll pozitsiyasi (window scroller) */
    function getLessonScrollTop() {
      return Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
    }
    /** Tugma qaysi dars bo'limida (section) joylashganini aniqlash */
    function findLessonSection(btn) {
      if (!btn) return null;
      const sec = btn.closest('.ls-content-section');
      if (!sec) return null;
      const all = document.querySelectorAll('#lsLessonContainer .ls-content-section');
      return { id: sec.id || null, index: Array.prototype.indexOf.call(all, sec) };
    }
    /** Codingga kirishdan OLDIN dars holatini saqlash (generic — har bir yangi session yangilanadi) */
    function saveLessonCodingContext(course, lesson, btn, extra) {
      const sec = findLessonSection(btn);
      const ctx = Object.assign({
        courseId: course.id,
        lessonId: lesson.id,
        lessonNumber: lesson.number,
        lessonTitle: lesson.title || '',
        sectionId: sec ? sec.id : null,
        sectionIndex: sec ? sec.index : -1,
        scrollY: getLessonScrollTop(),
        at: Date.now()
      }, extra || {});
      try { localStorage.setItem('ls_return_ctx', JSON.stringify(ctx)); } catch (e) { /* ignore */ }
      return ctx;
    }
    /** Tiklashni layout tayyor bo'lgach bajarish (sahifa hali ko'rinmasligi mumkin) */
    function applyLessonScrollRestore(ctx) {
      let target = null;
      if (ctx.sectionId && typeof ctx.sectionId === 'string') target = document.getElementById(ctx.sectionId);
      if (!target && typeof ctx.sectionIndex === 'number' && ctx.sectionIndex >= 0) {
        const sections = document.querySelectorAll('#lsLessonContainer .ls-content-section');
        if (sections[ctx.sectionIndex]) target = sections[ctx.sectionIndex];
      }
      const y = (typeof ctx.scrollY === 'number' && isFinite(ctx.scrollY)) ? ctx.scrollY : 0;
      if (target) {
        const top = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) - 24;
        window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: 'auto' });
      } else if (y > 2) {
        window.scrollTo({ top: y, behavior: 'auto' }); // section topilmasa — scrollY fallback
      } else {
        return; // scroll 0 bo'lsa default holat — hech narsa qilish shart emas
      }
      toast('📍 ' + (ctx.lessonNumber || '') + '-darsga qaytdingiz — o‘sha joyidan davom eting', 'info');
    }
    /** Codingdan qaytganda kontekstni tiklash (setupLessonExtras dan chaqiriladi) */
    function restoreLessonCodingContext(course, lesson) {
      let ctx = null;
      try { ctx = JSON.parse(localStorage.getItem('ls_return_ctx') || 'null'); } catch (e) { ctx = null; }
      if (!ctx) return;
      try { localStorage.removeItem('ls_return_ctx'); } catch (e) { /* ignore */ }
      // Stale kontekst boshqa darsga ta'sir qilmasin — faqat shu dars bo'lsa tiklaymiz
      if (ctx.courseId !== course.id || ctx.lessonId !== lesson.id) return;
      // openLesson: renderLessonView() → page('lessonView') tartibi sababli
      // sahifa hali yashirin bo'lishi mumkin — rAF ×2 + kechikish bilan layoutni kutamiz
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTimeout(function () {
            try { applyLessonScrollRestore(ctx); } catch (e) { /* ignore */ }
          }, 120);
        });
      });
    }

    /** Dars renderidan keyin extraslarni ulash + return-context scroll tiklash */
    function setupLessonExtras(course, lesson) {
      if (!lesson.content) return;
      setupImagePreviews();
      if (lesson.content.attrDemo) setupAttrDemo(lesson.content);
      if (lesson.content.triDemo) setupTriDemo(lesson.content.triDemo);
      if (lesson.content.reviewQuiz) setupReviewQuiz(course, lesson);
      if (Array.isArray(lesson.content.games) && lesson.content.games.length) setupGames(course, lesson);
      if (lesson.content.project) setupProject(course, lesson);
      // Codingdan qaytganda oldingi joyga qaytarish (generic — barcha darslar)
      restoreLessonCodingContext(course, lesson);
    }

    /* ==========================================================
       MASHQLAR ENGINE — Live Edit | Drag & Drop | Kod detektivi
       ========================================================== */

    /** Mashq XP mukofoti (lesson XP tizimiga mos) */
    function awardExerciseXP(xp) {
      try {
        const u = currentUser();
        if (u && typeof window.xpToLevel === 'function') {
          u.xp = (u.xp || 0) + xp;
          u.points = (u.points || 0) + xp;
          u.level = window.xpToLevel(u.xp);
        }
      } catch (e) { /* ignore */ }
      toast('✅ Topshiriq bajarildi! ⭐ +' + xp + ' XP', 'success');
    }

    function isExerciseDone(courseId, lessonId, exId) {
      const p = courseProgress(courseId);
      return !!(p.exercises && p.exercises[lessonId] && p.exercises[lessonId][exId]);
    }

    function allExercisesDone(courseId, lessonId, exercises) {
      return (exercises || []).filter(function (ex) { return !ex.bonus; }).every(function (ex) { return isExerciseDone(courseId, lessonId, ex.id); });
    }

    function markExerciseDone(courseId, lessonId, ex, feedbackEl) {
      if (isExerciseDone(courseId, lessonId, ex.id)) {
        if (feedbackEl) feedbackEl.innerHTML = '<div class="ls-ex-feedback ok">✅ Topshiriq bajarildi (avval) · ⭐ +' + ex.xp + ' XP</div>';
        return;
      }
      const p = courseProgress(courseId);
      if (!p.exercises) p.exercises = {};
      if (!p.exercises[lessonId]) p.exercises[lessonId] = {};
      p.exercises[lessonId][ex.id] = { at: Date.now() };
      saveStore();
      awardExerciseXP(ex.xp || 10);
      if (feedbackEl) feedbackEl.innerHTML = '<div class="ls-ex-feedback ok">✅ Topshiriq bajarildi · ⭐ +' + ex.xp + ' XP</div>';
      const found = window.CoursesAPI.findLesson && window.CoursesAPI.findLesson(courseId, lessonId);
      if (found) {
        refreshExerciseTracker(found.course, found.lesson);
        refreshReadFooter(found.course, found.lesson);
        /* 🔓 ONE-BY-ONE: agar bu mashq o‘yin sifatida ro‘yxatda bo‘lsa (masalan Build the HTML) — keyingi o‘yinni och */
        if ((found.lesson.content.games || []).some(function (g) { return g.exercise === ex.id; })) {
          refreshGamesHub(found.course, found.lesson);
        }
      }
    }

    function getExById(lesson, exId) {
      return ((lesson.content && lesson.content.exercises) || []).find(function (ex) { return ex.id === exId; });
    }

    /** Mashqlar paneli — tracker + mashq kartalari */
    function exerciseTrackerHTML(course, lesson, exercises) {
      const required = exercises.filter(function (ex) { return !ex.bonus; });
      const doneCount = required.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
      const all = required.length > 0 && doneCount === required.length;
      let html = '<span class="ls-ex-count">' + doneCount + ' / ' + required.length + ' bajarildi</span>';
      html += required.map(function (ex, i) {
        const done = isExerciseDone(course.id, lesson.id, ex.id);
        return '<span class="ls-ex-chip' + (done ? ' done' : '') + '">Mashq ' + (i + 1) + ' ' + (done ? '✅' : '⬜') + '</span>';
      }).join('');
      exercises.forEach(function (ex) {
        if (!ex.bonus) return;
        const done = isExerciseDone(course.id, lesson.id, ex.id);
        html += '<span class="ls-ex-chip' + (done ? ' done' : '') + '">🎁 Bonus ' + (done ? '✅' : '⬜') + '</span>';
      });
      if (!lesson.quiz) {
        html += '<span class="ls-ex-status' + (all ? ' ok' : '') + '">' + (all ? '✅ Barcha topshiriqlar bajarildi — darsni yakunlashingiz mumkin!' : '🔒 Darsni yakunlash uchun barcha topshiriqlarni bajaring') + '</span>';
      } else {
        html += '<span class="ls-ex-status' + (all ? ' ok' : '') + '">' + (all ? '✅ Barcha mashqlar bajarildi! 🔓 Test ochildi' : '🔒 Test hali ochilmagan') + '</span>';
      }
      return html;
    }

    function renderExercisesHTML(course, lesson) {
      const exercises = lesson.content.exercises || [];
      let html = '<div class="ls-exercises" id="lsExercises">' +
        '<div class="ls-ex-head">🧩 Amaliy topshiriqlar <span class="ls-ex-sub">— ' + (lesson.quiz ? 'barchasini bajaring, test ochiladi' : 'loyihani yakunlang, dars tugaydi') + '</span></div>' +
        '<div class="ls-ex-tracker" id="lsExTracker">' +
        exerciseTrackerHTML(course, lesson, exercises) +
        '</div>';

      exercises.forEach(function (ex) {
        const done = isExerciseDone(course.id, lesson.id, ex.id);
        html += '<div class="ls-ex-card' + (done ? ' done' : '') + '" data-ex-id="' + esc(ex.id) + '">' +
          '<div class="ls-ex-title">' + esc(ex.title) + (done ? ' <span class="ls-ex-done-badge">✅</span>' : '') + '</div>' +
          '<div class="ls-ex-instruction">' + fmtText(ex.instruction || '') + '</div>';

        if (ex.type === 'liveedit') {
          if (ex.mode === 'simple') {
            /* SODDA MASHQ: faqat editor + Javobni tekshirish + Hint + kodni qayta qo'yish */
            html +=
              '<textarea class="ls-ex-code" id="lsExCode-' + esc(ex.id) + '" spellcheck="false" aria-label="HTML kod muharriri">' + esc(ex.startCode || (lesson.content.project && lesson.content.project.starter) || '') + '</textarea>' +
              '<div class="ls-ex-actions">' +
              '<button type="button" class="btn btn-primary btn-sm" data-ex-run="' + esc(ex.id) + '">✅ Javobni tekshirish</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ex-hint="' + esc(ex.id) + '">💡 Hint</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Kodni qayta qo‘yish</button>' +
              '</div>' +
              '<div class="ls-ex-hint" id="lsExHint-' + esc(ex.id) + '" hidden>💡 ' + fmtText(ex.hint || '') + '</div>';
          } else {
            html +=
              '<textarea class="ls-ex-code" id="lsExCode-' + esc(ex.id) + '" spellcheck="false" aria-label="HTML kod muharriri">' + esc(ex.startCode || (lesson.content.project && lesson.content.project.starter) || '') + '</textarea>' +
              '<div class="ls-ex-actions">' +
              '<button type="button" class="btn btn-primary btn-sm" data-ex-run="' + esc(ex.id) + '">▶ RUN</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Qayta boshlash</button>' +
              (ex.mode === 'project'
                ? '<button type="button" class="btn btn-ghost btn-sm" data-project-pg="1">💻 Codingda davom etish</button>'
                : '<button type="button" class="btn btn-ghost btn-sm" data-ex-playground="' + esc(ex.id) + '">💻 Codingda sinab ko‘r</button>') +
              '</div>' +
              '<div class="ls-ex-preview-wrap"><div class="ls-ex-preview-label" id="lsExPrevLabel-' + esc(ex.id) + '">👁 Preview</div>' +
              '<iframe class="ls-ex-preview" id="lsExPreview-' + esc(ex.id) + '" title="Preview" sandbox="allow-same-origin"></iframe></div>';
          }
        } else if (ex.type === 'dragdrop') {
          html +=
            '<div class="ls-ex-dnd">' +
            '<div class="ls-dnd-pool" id="lsDndPool-' + esc(ex.id) + '"></div>' +
            '<div class="ls-dnd-zone" id="lsDndZone-' + esc(ex.id) + '" data-dropzone="1"></div>' +
            '</div>' +
            '<div class="ls-ex-actions">' +
            '<button type="button" class="btn btn-primary btn-sm" data-ex-check="' + esc(ex.id) + '">✅ Tekshirish</button>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-ex-reset="' + esc(ex.id) + '">🔄 Qayta boshlash</button>' +
            '</div>';
        } else if (ex.type === 'detective') {
          html +=
            '<pre class="ls-ex-code ls-ex-code-ro">' + esc(ex.code || '') + '</pre>' +
            '<div class="ls-ex-options" data-detective="' + esc(ex.id) + '">' +
            (ex.options || []).map(function (opt, oi) {
              return '<button type="button" class="ls-ex-option" data-opt="' + oi + '">' + fmt(opt) + '</button>';
            }).join('') +
            '</div>';
        }
        html += '<div class="ls-ex-feedback-slot" id="lsExFb-' + esc(ex.id) + '">' +
          (done ? '<div class="ls-ex-feedback ok">' + (ex.mode === 'simple' ? '✅ To‘g‘ri! +' + (ex.xp || 10) + ' XP' : '✅ Topshiriq bajarildi · ⭐ +' + ex.xp + ' XP') + '</div>' +
            (ex.mode === 'simple' && ex.explanation ? '<div class="ls-ex-explain">📖 ' + fmtText(ex.explanation) + '</div>' : '') : '') + '</div>';
        html += '</div>';
      });
      html += '</div>';
      return html;
    }

    /** Tracker yozuvlarini yangilash (mashq bajarilgach) */
    function refreshExerciseTracker(course, lesson) {
      const tracker = $('#lsExTracker');
      const exercises = (lesson.content && lesson.content.exercises) || [];
      if (!tracker) return;
      tracker.innerHTML = exerciseTrackerHTML(course, lesson, exercises);
    }

    /* ---------- 1-MASHQ ENGINE: LIVE EDIT (l1 title-check + universal regex checks) ---------- */
    function runLiveEdit(course, lesson, ex) {
      const ta = $('#lsExCode-' + ex.id);
      const preview = $('#lsExPreview-' + ex.id);
      const label = $('#lsExPrevLabel-' + ex.id);
      const fb = $('#lsExFb-' + ex.id);
      if (!ta) return;
      const code = ta.value;
      if (preview) preview.setAttribute('srcdoc', code);

      // Universal real-checker: ex.checks — har biri majburiy regex (RAW code tekshiriladi)
      if (ex.checks && ex.checks.length) {
        for (let i = 0; i < ex.checks.length; i++) {
          const c = ex.checks[i];
          if (!new RegExp(c.re, 'i').test(code)) {
            if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ ' + fmtText(c.msg) + '</div>';
            const card = ta.closest('.ls-ex-card');
            shakeEl(card);
            return;
          }
        }
        if (fb) fb.innerHTML = '';
        markExerciseDone(course.id, lesson.id, ex, fb);
        if (ex.mode === 'simple') {
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! +' + (ex.xp || 10) + ' XP</div>' +
            (ex.explanation ? '<div class="ls-ex-explain">📖 ' + fmtText(ex.explanation) + '</div>' : '');
        }
        return;
      }

      // L1 (1-dars) maxsus tekshiruvi: <title> mavjud va eski nom o'zgargan
      const m = code.match(/<title>([\s\S]*?)<\/title>/i);
      const newTitle = m ? m[1].trim() : '';
      const oldM = (ex.startCode || '').match(/<title>([\s\S]*?)<\/title>/i);
      const oldTitle = oldM ? oldM[1].trim() : '';
      if (label) label.textContent = '👁 Preview — tab nomi: ' + (newTitle ? '«' + newTitle + '»' : '—');
      if (!newTitle) {
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ `&lt;title&gt;` topilmadi. Head ichiga `&lt;title&gt;...&lt;/title&gt;` yozing va qayta RUN bosing.</div>';
        return;
      }
      if (newTitle === oldTitle) {
        if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Hozircha eski nom turibdi ("' + esc(oldTitle) + '"). `&lt;title&gt;` ichidagi matnni o‘zgartiring.</div>';
        return;
      }
      markExerciseDone(course.id, lesson.id, ex, fb);
    }

    /* ---------- 2-MASHQ: DRAG & DROP (+ touch fallback) ---------- */
    /* STATE: order = joylangan bo'laklarning INDEX ro'yxati (identity sifatida
       matn emas!), selected = touch fallback tanlovi, dragIdx = drag andozi.
       Eventlar DELEGATSIYA bilan pool/zone ga bir marta bog'lanadi — render()
       innerHTML almashtirsa ham listenerlar yo'qolmaydi. */
    function setupDragDrop(course, lesson, ex) {
      const pool = $('#lsDndPool-' + ex.id);
      const zone = $('#lsDndZone-' + ex.id);
      if (!pool || !zone) return;

      let items = (ex.items || []).map(function (_, i) { return i; }); // [0..n-1] indexlar
      if (typeof shuffleArr === 'function') items = shuffleArr(items); // shuffle faqat ko'rinish tartibini aralashtiradi
      let order = [];        // joylangan item indexlari (current order state)
      let selected = null;   // touch: tanlangan item index
      let dragIdx = null;    // hozir drag qilinayotgan item index

      function textOf(idx) { return ex.items[idx]; }
      function isPlaced(idx) { return order.indexOf(idx) !== -1; }

      function render() {
        const remaining = items.filter(function (idx) { return !isPlaced(idx); });
        const hintHtml = ex.hint
          ? '<div class="ls-dnd-hint-box"><b>💡 Eslatma:</b><pre class="ls-dnd-hint-tree">html\n├── head\n│   └── title\n└── body\n    └── h1</pre><span class="ls-dnd-hint-text">' + fmt(ex.hint) + '</span></div>'
          : '';
        pool.innerHTML = hintHtml + (remaining.length
          ? remaining.map(function (idx) {
            return '<span class="ls-dnd-chip' + (selected === idx ? ' selected' : '') +
              '" draggable="true" data-chip-idx="' + idx + '" role="button" tabindex="0">' +
              esc(textOf(idx)) + '</span>';
          }).join('')
          : '<span class="ls-dnd-empty">Bo‘laklar qolmadi 👍</span>');

        let slotsHtml = '';
        order.forEach(function (idx, i) {
          slotsHtml +=
            '<span class="ls-dnd-slot just-placed" data-slot="' + i + '" data-insert="' + i + '" role="button" tabindex="0">' +
            '<b class="ls-dnd-num">' + (i + 1) + '</b>' + esc(textOf(idx)) +
            '<button type="button" class="ls-dnd-remove" data-remove="' + i + '" title="Olib tashlash" aria-label="Olib tashlash">×</button>' +
            '</span>';
        });
        if (order.length < items.length) {
          slotsHtml +=
            '<span class="ls-dnd-slot ls-dnd-slot-empty" data-slot="' + order.length + '" data-insert="' + order.length + '" role="button" tabindex="0">' +
            '<b class="ls-dnd-num">' + (order.length + 1) + '</b>' +
            (selected != null
              ? '📍 Tanlangan bo‘lakni <b>' + (order.length + 1) + '-o‘ringa</b> joylash uchun bosing'
              : '🧩 Keyingi bo‘lakni shu yerga tashlang / ' + (order.length + 1) + '-o‘rin') +
            '</span>';
        }
        zone.innerHTML = order.length
          ? '<div class="ls-dnd-order">' + slotsHtml + '</div>'
          : slotsHtml;
        zone.classList.toggle('complete', order.length === items.length);
      }

      /** chipni berilgan pozitsiyaga joylash (slotIndex == null -> oxiriga) */
      function placeChip(idx, slotIndex) {
        if (idx == null || isPlaced(idx)) return;
        if (slotIndex == null || slotIndex >= order.length) order.push(idx);
        else order.splice(slotIndex, 0, idx);
        selected = null;
        render();
      }

      function removeAt(slotIndex) {
        if (slotIndex < 0 || slotIndex >= order.length) return;
        order.splice(slotIndex, 1);
        render();
      }

      function toggleSelect(idx) {
        selected = (selected === idx) ? null : idx; // qayta bosish = bekor qilish
        render();
        if (selected != null) toast('👆 Endi joylash o‘rnini bosing: ' + textOf(selected), 'info');
      }

      /* ---- DESKTOP: haqiqiy HTML5 Drag & Drop ---- */
      pool.addEventListener('dragstart', function (e) {
        const chip = e.target.closest('[data-chip-idx]');
        if (!chip) return;
        dragIdx = Number(chip.getAttribute('data-chip-idx'));
        e.dataTransfer.setData('text/plain', textOf(dragIdx));
        e.dataTransfer.effectAllowed = 'move';
        chip.classList.add('dragging'); // opacity feedback
      });
      document.addEventListener('dragend', function () {
        dragIdx = null;
        pool.querySelectorAll('.ls-dnd-chip.dragging').forEach(function (el) { el.classList.remove('dragging'); });
        zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { el.classList.remove('over'); });
        zone.classList.remove('dragover');
      });
      zone.addEventListener('dragover', function (e) {
        e.preventDefault(); // drop ishlashi uchun MAJBURIY
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('dragover');
        const slot = e.target.closest('[data-insert]');
        zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { if (el !== slot) el.classList.remove('over'); });
        if (slot) slot.classList.add('over'); // aniq drop target ko'rinsin
      });
      zone.addEventListener('dragleave', function (e) {
        if (!zone.contains(e.relatedTarget)) zone.classList.remove('dragover');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('dragover');
        zone.querySelectorAll('.ls-dnd-slot.over').forEach(function (el) { el.classList.remove('over'); });
        let idx = dragIdx;
        if (idx == null) {
          const txt = e.dataTransfer.getData('text/plain');
          const found = items.find(function (i2) { return !isPlaced(i2) && textOf(i2) === txt; });
          idx = found == null ? null : found;
        }
        if (idx == null) return;
        let slotIndex = null;
        const slot = e.target.closest('[data-insert]');
        if (slot) slotIndex = Number(slot.getAttribute('data-insert'));
        placeChip(idx, slotIndex);
      });

      /* ---- MOBILE/TOUCH fallback: tap-to-select -> tap-to-place ---- */
      pool.addEventListener('click', function (e) {
        const chip = e.target.closest('[data-chip-idx]');
        if (!chip) return;
        toggleSelect(Number(chip.getAttribute('data-chip-idx')));
      });
      pool.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const chip = e.target.closest('[data-chip-idx]');
        if (!chip) return;
        e.preventDefault();
        toggleSelect(Number(chip.getAttribute('data-chip-idx')));
      });
      zone.addEventListener('click', function (e) {
        const rm = e.target.closest('[data-remove]');
        if (rm) {
          removeAt(Number(rm.getAttribute('data-remove')));
          return;
        }
        const slot = e.target.closest('[data-insert]');
        if (selected != null && slot) {
          placeChip(selected, Number(slot.getAttribute('data-insert')));
          return;
        }
        if (selected != null) placeChip(selected, null); // zonaning bosh joyi — oxiriga
      });
      zone.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const slot = e.target.closest('[data-insert]');
        if (slot && selected != null) {
          e.preventDefault();
          placeChip(selected, Number(slot.getAttribute('data-insert')));
        }
      });

      render();

      /* ---- TEKSHIRISH: haqiqiy current order vs expected order ---- */
      const exCard = zone.closest('.ls-ex-card');
      const fb = $('#lsExFb-' + ex.id);
      exCard.querySelector('[data-ex-check="' + ex.id + '"]').addEventListener('click', function () {
        if (order.length !== items.length) {
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Hali hammasi joylanmadi (' + order.length + '/' + items.length + '). Davom eting.</div>';
          shakeEl(exCard);
          return;
        }
        const currentTexts = order.map(textOf);
        const wrongPos = [];
        currentTexts.forEach(function (t, i) { if (t !== ex.items[i]) wrongPos.push(i + 1); });
        if (!wrongPos.length) {
          // exercise completed = true (FAQAT to'g'ri order bo'lsa)
          zone.classList.add('success'); // success animation
          zone.querySelectorAll('.ls-dnd-slot').forEach(function (el, i2) { el.classList.add('correct'); });
          markExerciseDone(course.id, lesson.id, ex, fb);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Ajoyib! HTML skeleti to‘g‘ri tartiblangan · ⭐ +' + ex.xp + ' XP</div>';
        } else {
          zone.classList.remove('success');
          zone.querySelectorAll('.ls-dnd-slot').forEach(function (el, i2) {
            if (wrongPos.indexOf(i2 + 1) !== -1) el.classList.add('wrong');
          });
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Tartib noto‘g‘ri. Xato pozitsiyalar: <b>' +
            wrongPos.join(', ') + '-o‘rin(lar)</b>. ' + (wrongPos[0] - 1) + '-o‘rinda kutilgani: <code>' +
            esc(ex.items[wrongPos[0] - 1]) + '</code>, turibdi: <code>' + esc(currentTexts[wrongPos[0] - 1]) +
            '</code>. Qayta joylab ko‘ring.</div>';
          shakeEl(exCard);
        }
      });
      exCard.querySelector('[data-ex-reset="' + ex.id + '"]').addEventListener('click', function () {
        order = []; selected = null; dragIdx = null;
        items = (ex.items || []).map(function (_, i) { return i; });
        if (typeof shuffleArr === 'function') items = shuffleArr(items);
        zone.classList.remove('success'); // success/wrong holatlarni tozalash
        if (fb) fb.innerHTML = '';
        render();
      });
    }

    /* ---------- 3-MASHQ: KOD DETEKTIVI ---------- */
    function setupDetective(course, lesson, ex) {
      const box = document.querySelector('[data-detective="' + ex.id + '"]');
      if (!box) return;
      const fb = $('#lsExFb-' + ex.id);
      box.addEventListener('click', function (e) {
        const btn = e.target.closest('.ls-ex-option');
        if (!btn) return;
        if (isExerciseDone(course.id, lesson.id, ex.id)) return;
        if (Number(btn.getAttribute('data-opt')) === ex.answer) {
          btn.classList.add('correct');
          markExerciseDone(course.id, lesson.id, ex, fb);
        } else {
          btn.classList.add('wrong');
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Qayta urinib ko‘ring — bu qism to‘g‘ri ko‘rinadi.</div>';
        }
      });
    }

    /** Barcha mashqlarni bind qilish (renderReadPhase chaqiradi) */
    function bindExercises(course, lesson) {
      const exercises = (lesson.content && lesson.content.exercises) || [];
      // 🎮 REAL INTERACTIVE DEMO — Run bosilganda iframe srcdoc haqiqiy yangilanadi
      document.querySelectorAll('.ls-livedemo').forEach(function (demo) {
        const ta = demo.querySelector('[data-demo-code]');
        const frame = demo.querySelector('iframe.ls-livedemo-frame');
        const btn = demo.querySelector('[data-demo-run]');
        if (!ta || !frame || !btn) return;
        if (btn.getAttribute('data-demo-bound')) return;
        btn.setAttribute('data-demo-bound', '1');
        btn.addEventListener('click', function () {
          frame.setAttribute('srcdoc', ta.value);
        });
      });
      // 💻 "CODINGDA SINAB KO'R" — RAW HTML -> Coding Playground
      document.querySelectorAll('.ls-open-playground[data-ls-raw-code], .ls-alert-demo[data-alert-msg]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          // ⚡ JS teaser — haqiqiy alert demo tugmasi
          const alertMsg = btn.getAttribute('data-alert-msg');
          if (alertMsg != null) { try { window.alert(alertMsg); } catch (e) { toast(alertMsg, 'info'); } return; }
          const raw = btn.getAttribute('data-ls-raw-code');
          if (typeof window.openCodePlaygroundWithHtml === 'function') {
            // Lesson return context: generic saqlash (lesson + section + scroll)
            const ctx = saveLessonCodingContext(course, lesson, btn, {
              sectionTitle: btn.getAttribute('data-ls-sec-title') || '',
              language: 'html',
              initialCode: raw || ''
            });
            window.openCodePlaygroundWithHtml(raw, ctx);
            toast('💻 Kod Coding Playgroundga yuklandi', 'info');
          } else {
            toast('Coding Playground topilmadi', 'error');
          }
        });
      });
      exercises.forEach(function (ex) {
        if (ex.type === 'liveedit') {
          // 🤖 AI Yordamchi: amaliy kod editoriga autocomplete + AI panel ulash
          // (sodda mashqlarda AI panel ko'rsatilmaydi)
          if (window.ITTestAI && ex.mode !== 'simple') {
            try {
              window.ITTestAI.attachLessonExercise(
                document.getElementById('lsExCode-' + ex.id), course, lesson, ex);
            } catch (e) { /* AI panel ixtiyoriy — dars buzilmasin */ }
          }
          const runBtn = document.querySelector('[data-ex-run="' + ex.id + '"]');
          const resetBtn = document.querySelector('[data-ex-reset="' + ex.id + '"]');
          const pgBtn = document.querySelector('[data-ex-playground="' + ex.id + '"]');
          if (runBtn) runBtn.addEventListener('click', function () { runLiveEdit(course, lesson, ex); });
          const hintBtn = document.querySelector('[data-ex-hint="' + ex.id + '"]');
          if (hintBtn) hintBtn.addEventListener('click', function () {
            const hb = document.getElementById('lsExHint-' + ex.id);
            if (hb) hb.hidden = !hb.hidden;
          });
          if (resetBtn) resetBtn.addEventListener('click', function () {
            const ta = $('#lsExCode-' + ex.id);
            if (ta) ta.value = ex.startCode || '';
            const pv = $('#lsExPreview-' + ex.id);
            if (pv) pv.removeAttribute('srcdoc');
            const fb = $('#lsExFb-' + ex.id);
            if (fb) fb.innerHTML = '';
          });
          if (pgBtn) pgBtn.addEventListener('click', function () {
            const ta = $('#lsExCode-' + ex.id);
            if (ta && typeof window.openCodePlaygroundWithHtml === 'function') {
              // Return context: generic saqlash — mashq darajasidagi tugma ham aynan shu darsga/joyiga qaytadi
              const exCtx = saveLessonCodingContext(course, lesson, pgBtn, {
                sectionTitle: ex.title || '',
                language: 'html',
                initialCode: ta.value || ex.startCode || ''
              });
              window.openCodePlaygroundWithHtml(ta.value, exCtx);
              toast('💻 Kod Coding Playgroundga yuklandi', 'info');
            }
          });
        } else if (ex.type === 'dragdrop') {
          setupDragDrop(course, lesson, ex);
        } else if (ex.type === 'detective') {
          setupDetective(course, lesson, ex);
        }
      });
    }

    /* ==========================================================
       🚀 5-DARS ENGINE — TriDemo | 7 mini-o‘yin | LOYIHA
       ========================================================== */

    /* ---------- O‘YIN XP — bir marta beriladi ---------- */
    function isGameDone(courseId, lessonId, gameId) {
      const p = courseProgress(courseId);
      const rec = p.games && p.games[lessonId] && p.games[lessonId][gameId];
      /* completed flag YO'Q lekin `at` bor — eski format (migratsiya): bajarilgan hisoblanadi */
      return !!(rec && (rec.completed || rec.at));
    }
    /* 🔁 YAGONA REPLAY KONTRAKT:
       - GAME COMPLETION: p.games[lessonId][gameId] = { completed, at, attempts, bestScore, lastScore }
       - CURRENT ATTEMPT: faqat DOM ichida (body element almashtirilsa — toza attempt)
       - Replay: XP yana berilmaydi, exercise/test/lesson/unlock state tegilmaydi */
    function gameRecord(course, lesson, gameId) {
      const p = courseProgress(course.id);
      return (p.games && p.games[lesson.id] && p.games[lesson.id][gameId]) || null;
    }
    function gameStatsHTML(course, lesson, game) {
      const rec = gameRecord(course, lesson, game.id);
      if (!rec) return '';
      const bits = [];
      if (rec.bestScore != null) bits.push('🏆 Eng yaxshi: ' + rec.bestScore);
      if (rec.lastScore != null) bits.push('📊 Oxirgi: ' + rec.lastScore);
      if (rec.attempts) bits.push('🔄 Urinishlar: ' + rec.attempts);
      return bits.length ? '<div class="ls-game-stats">' + esc(bits.join(' · ')) + '</div>' : '';
    }
    function gameReplayBtnHTML(game) {
      return '<button type="button" class="btn btn-ghost btn-sm ls-game-replay-btn" data-game-replay-btn="' + esc(game.id) + '">🔄 Qayta o‘ynash</button>';
    }
    function markGameDone(course, lesson, game, lastScore) {
      const p = courseProgress(course.id);
      if (!p.games) p.games = {};
      if (!p.games[lesson.id]) p.games[lesson.id] = {};
      const prev = p.games[lesson.id][game.id];
      const first = !(prev && prev.completed);
      const rec = {
        completed: true,
        at: Date.now(),
        attempts: ((prev && prev.attempts) || 0) + 1
      };
      if (lastScore != null) {
        rec.lastScore = lastScore;
        rec.bestScore = Math.max((prev && prev.bestScore) || 0, lastScore);
      } else if (prev && prev.bestScore != null) {
        rec.lastScore = prev.lastScore;
        rec.bestScore = prev.bestScore;
      }
      p.games[lesson.id][game.id] = rec;
      saveStore();
      const badge = document.querySelector('[data-game-badge="' + game.id + '"]');
      if (badge) { badge.textContent = '✅ Bajarildi'; badge.classList.add('done'); }
      if (first) {
        /* ⭐ XP faqat BIRINCI tugatishda */
        awardExerciseXP(game.xp || 10);
        toast('🎉 ' + (game.title || 'O‘yin') + ' tugadi! ✅ Bajarildi', 'success');
        /* 🔓 ONE-BY-ONE: keyingi o‘yinni ochish uchun hubni yangilash */
        refreshGamesHub(course, lesson);
      }
      /* Replay tugashi: hub/unlock/exercise state O‘ZGARMAYDI — faqat shu o‘yin body yangilanadi */
    }
    function recordGameScore(course, lesson, game, score) {
      const p = courseProgress(course.id);
      if (!p.games) p.games = {};
      if (!p.games[lesson.id]) p.games[lesson.id] = {};
      const prev = p.games[lesson.id][game.id] || { completed: false };
      const rec = Object.assign({}, prev, {
        lastScore: score,
        bestScore: Math.max(prev.bestScore || 0, score)
      });
      p.games[lesson.id][game.id] = rec;
      saveStore();
    }
    /** 🎮 Yangi attempt: body element almashtiriladi → eski listener/holat/savol-indeks tozalanadi */
    function startGameAttempt(course, lesson, game) {
      const old = document.querySelector('[data-game-body="' + game.id + '"]');
      if (!old) return;
      const fresh = document.createElement('div');
      fresh.className = 'ls-game-body';
      fresh.setAttribute('data-game-body', game.id);
      old.replaceWith(fresh);
      setupGameById(game.id, course, lesson, (lesson.content && lesson.content.gamesData) || {}, fresh);
      try { fresh.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* noop */ }
    }
    function bindGameReplayButtons(course, lesson) {
      document.querySelectorAll('[data-game-replay-btn]').forEach(function (btn) {
        if (btn.getAttribute('data-replay-bound')) return;
        btn.setAttribute('data-replay-bound', '1');
        btn.addEventListener('click', function () {
          const gid = btn.getAttribute('data-game-replay-btn');
          const game = ((lesson.content && lesson.content.games) || []).find(function (g) { return g.id === gid; });
          if (!game) return;
          toast('🎮 Yangi urinish boshlandi!', 'info');
          startGameAttempt(course, lesson, game);
        });
      });
    }
    /** O‘yin tugashi ekrani: g‘alaba ekrani + statistika + 🔄 Qayta o‘ynash.
        Birinchi tugatish: XP + keyingi o‘yin ochilishi (hub yangilanadi),
        replay tugashi: state tegilmaydi, «yana bajarildi» eslatmasi chiqadi */
    function finishGameScreen(course, lesson, game, body, winHTML, score) {
      const first = !isGameDone(course.id, lesson.id, game.id);
      markGameDone(course, lesson, game, score); /* first → hub re-render (keyingi o‘yin ochiladi) */
      const show = winHTML +
        (first ? '' : '<div class="ls-game-replay-note">🎉 Yana ajoyib! O‘yin qayta bajarildi — XP allaqachon berilgan.</div>') +
        '<div class="ls-game-after">' + gameStatsHTML(course, lesson, game) + gameReplayBtnHTML(game) + '</div>';
      /* Hub yangilangan bo‘lsa — g‘alaba ekrani yangi (bog‘langan) body-ga qo‘yiladi */
      const target = document.querySelector('[data-game-body="' + game.id + '"]') || body;
      target.innerHTML = show;
      bindGameReplayButtons(course, lesson);
    }
    function gameBest(course, lesson, key) {
      const p = courseProgress(course.id);
      return (p.games && p.games[lesson.id] && p.games[lesson.id][key]) || 0;
    }
    function setGameBest(course, lesson, key, val) {
      const p = courseProgress(course.id);
      if (!p.games) p.games = {};
      if (!p.games[lesson.id]) p.games[lesson.id] = {};
      if (val > (p.games[lesson.id][key] || 0)) { p.games[lesson.id][key] = val; saveStore(); }
    }

    /* ---------- 🔁 TEZKOR ESLATMA (reviewQuiz) — savollar bittadan ---------- */
    function isReviewDone(courseId, lessonId) {
      const p = courseProgress(courseId);
      return !!(p.reviewQuiz && p.reviewQuiz[lessonId]);
    }
    function markReviewDone(course, lesson, rq) {
      if (isReviewDone(course.id, lesson.id)) return;
      const p = courseProgress(course.id);
      if (!p.reviewQuiz) p.reviewQuiz = {};
      p.reviewQuiz[lesson.id] = { at: Date.now() };
      saveStore();
      awardExerciseXP(rq.xp || 10);
    }
    function setupReviewQuiz(course, lesson) {
      const rq = lesson.content.reviewQuiz;
      if (!rq) return;
      const root = document.getElementById('lsReviewQuiz');
      const body = root ? root.querySelector('[data-rq-body]') : null;
      if (!body) return;
      const questions = rq.questions || [];
      if (!questions.length) return;
      let qi = 0;
      function renderQ() {
        const q = questions[qi];
        body.innerHTML =
          '<div class="ls-rq-step">Savol ' + (qi + 1) + ' / ' + questions.length + '</div>' +
          '<div class="ls-rq-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-rq-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-rq-fb"></div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-opt]');
        if (!btn) return;
        const q = questions[qi];
        if (!q) return;
        const fb = body.querySelector('.ls-rq-fb');
        if (Number(btn.getAttribute('data-opt')) === q.a) {
          mascotReact('success');
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri!</div>';
          qi++;
          if (qi >= questions.length) {
            markReviewDone(course, lesson, rq);
            body.innerHTML = '<div class="ls-game-win">🎉 Tezkor eslatma tugadi — eslab qoldingiz! Endi pastdagi bo‘limlarga o‘tamiz.</div>';
            return;
          }
          setTimeout(renderQ, 900);
        } else {
          mascotReact('error');
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmt(q.hint || 'Yana urinib ko‘ring') + '</div>';
        }
      });
      renderQ();
    }

    /* ---------- 🎛 TRI DEMO — bir sahifa, uch xil holat ---------- */
    function renderTriDemoHTML(cfg) {
      const frames = [cfg.htmlOnly, cfg.withCss, cfg.withJs].map(function (code, i) {
        return '<div class="ls-td-panel' + (i === 0 ? ' active' : '') + '" data-td-panel="' + i + '">' +
          '<iframe class="ls-td-frame" title="' + esc((cfg.tabs || [])[i] || 'Holat') + '" sandbox="allow-scripts allow-modals" srcdoc="' + esc(code || '') + '"></iframe>' +
          '</div>';
      }).join('');
      return '<div class="ls-content-section" id="lsTriDemo"><div class="ls-content-sec-title"><span class="ls-sec-num">🎛</span><span>' + esc(cfg.title || 'Bir sahifa, uch xil holat') + '</span></div>' +
        '<p class="ls-content-text">Tablar orqali uch holatni solishtiring: <b>HTML</b> — tuzilma, <b>+CSS</b> — chiroyli ko‘rinish, <b>+JS</b> — interaktivlik (3-tabda tugmani bosib ko‘ring!).</p>' +
        '<div class="ls-td-tabs">' + (cfg.tabs || []).map(function (t, i) {
          return '<button type="button" class="ls-td-tab' + (i === 0 ? ' active' : '') + '" data-td-tab="' + i + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        '<div class="ls-td-panels">' + frames + '</div>' +
        '</div>';
    }
    function setupTriDemo(cfg) {
      const root = $('#lsTriDemo');
      if (!root) return;
      root.querySelectorAll('[data-td-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () {
          const i = tab.getAttribute('data-td-tab');
          root.querySelectorAll('[data-td-tab]').forEach(function (t2) { t2.classList.toggle('active', t2 === tab); });
          root.querySelectorAll('[data-td-panel]').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-td-panel') === i); });
        });
      });
    }

    /* ---------- 🎮 O‘YIN TURLARI: quizgame | csstab | wizard ---------- */
    function setupQuizGame(course, lesson, game, questions, body) {
      if (!questions.length) return;
      let qi = 0;
      function render() {
        const q = questions[qi];
        body.innerHTML =
          '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '" data-qi="' + qi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-run-fb"></div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-opt]');
        if (!btn || qi >= questions.length) return;
        if (Number(btn.getAttribute('data-qi')) !== qi) return; // eski savol tugmasi
        const q = questions[qi];
        const fb = body.querySelector('.ls-run-fb');
        if (Number(btn.getAttribute('data-opt')) === q.a) {
          mascotReact('success');
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri!</div>';
          qi++;
          if (qi >= questions.length) {
            finishGameScreen(course, lesson, game, body,
              '<div class="ls-game-win">' + esc(game.win || '🏆 O‘yin tugadi! Barcha javoblar to‘g‘ri.') + '</div>', null);
            return;
          }
          setTimeout(render, 850);
        } else {
          mascotReact('error');
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmt(q.hint || 'Yana urinib ko‘ring') + '</div>';
        }
      });
      render();
    }

    function setupCsstab(course, lesson, game, body) {
      const tabs = game.tabs || [];
      if (!tabs.length) return;
      const visited = {};
      function render() {
        body.innerHTML =
          '<div class="ls-cstab-row">' + tabs.map(function (t, i) {
            return '<button type="button" class="ls-cstab' + (i === 0 ? ' active' : '') + '" data-ctab="' + i + '">' + esc(t.label) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-cstab-panels">' + tabs.map(function (t, i) {
            return '<div class="ls-cstab-panel' + (i === 0 ? ' active' : '') + '" data-cstab-panel="' + i + '">' +
              '<iframe class="ls-img-preview-frame" title="Preview" sandbox="allow-same-origin" srcdoc="' + esc(t.html || '') + '"></iframe>' +
              '<pre class="ls-cstab-code">' + esc(t.code || '') + '</pre>' +
              '</div>';
          }).join('') + '</div>';
      }
      body.addEventListener('click', function (e) {
        const tab = e.target.closest('[data-ctab]');
        if (!tab) return;
        const i = Number(tab.getAttribute('data-ctab'));
        body.querySelectorAll('[data-ctab]').forEach(function (t2) { t2.classList.toggle('active', t2 === tab); });
        body.querySelectorAll('[data-cstab-panel]').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-cstab-panel') === String(i)); });
        visited[i] = true;
        if (!gameDoneState(course, lesson, game) && Object.keys(visited).length >= tabs.length) {
          mascotReact('success');
          markGameDone(course, lesson, game);
        }
      });
      render();
    }

    function setupWizard(course, lesson, game, body) {
      const colors = game.colors || {};
      const tcs = colors.text || [];
      const bcs = colors.bg || [];
      if (!tcs.length) return;
      let tc = tcs[0].v, bc = bcs.length ? bcs[0].v : null, picked = false;
      function codeStr() {
        let s = '<h2 style="color: ' + tc + ';';
        if (bc) s += ' background-color: ' + bc + ';';
        s += '">\n  ITTest\n</h2>';
        return s;
      }
      function previewSrcdoc() {
        return '<div style="font-family:sans-serif;padding:10px;background:#0b0f1d;color:#f8fafc;">' +
          '<h2 style="margin:0;color:' + tc + ';' + (bc ? 'background-color:' + bc + ';padding:8px;border-radius:8px;' : '') + '">ITTest</h2></div>';
      }
      function render() {
        let html = '<div class="ls-wiz-row">';
        html += '<div class="ls-wiz-group"><div class="ls-wiz-label">Matn rangi (color)</div><div class="ls-wiz-btns">' +
          tcs.map(function (c) {
            return '<button type="button" class="ls-wiz-btn' + (c.v === tc ? ' active' : '') + '" data-tc="' + esc(c.v) + '">' + esc(c.label) + '</button>';
          }).join('') + '</div></div>';
        if (bcs.length) {
          html += '<div class="ls-wiz-group"><div class="ls-wiz-label">Fon rangi (background-color)</div><div class="ls-wiz-btns">' +
            bcs.map(function (c) {
              return '<button type="button" class="ls-wiz-btn' + (c.v === bc ? ' active' : '') + '" data-bc="' + esc(c.v) + '">' + esc(c.label) + '</button>';
            }).join('') + '</div></div>';
        }
        html += '</div>';
        html += '<div class="ls-wiz-preview"><iframe class="ls-img-preview-frame" title="Rang sehrgari preview" sandbox="allow-same-origin" srcdoc="' + esc(previewSrcdoc()) + '"></iframe></div>';
        html += '<pre class="ls-cstab-code" data-wiz-code>' + esc(codeStr()) + '</pre>';
        html += '<button type="button" class="ls-open-playground" data-wiz-pg>💻 CODINGDA SINAB KO‘R</button>';
        body.innerHTML = html;
      }
      function openPlayground() {
        const raw = codeStr();
        if (typeof window.openCodePlaygroundWithHtml === 'function') {
          const ctx = saveLessonCodingContext(course, lesson, null, { language: 'html', initialCode: raw });
          window.openCodePlaygroundWithHtml(raw, ctx);
          toast('💻 Kod Coding Playgroundga yuklandi', 'info');
        } else {
          toast('Coding Playground topilmadi', 'error');
        }
      }
      body.addEventListener('click', function (e) {
        const pg = e.target.closest('[data-wiz-pg]');
        if (pg) { openPlayground(); return; }
        const tbtn = e.target.closest('[data-tc]');
        const bbtn = e.target.closest('[data-bc]');
        if (!tbtn && !bbtn) return;
        if (tbtn) tc = tbtn.getAttribute('data-tc');
        if (bbtn) bc = bbtn.getAttribute('data-bc');
        render();
        if (!picked) {
          picked = true;
          mascotReact('success');
          markGameDone(course, lesson, game);
        }
      });
      render();
    }

    /* ---------- 🎮 O‘YINLAR HUB — ONE-BY-ONE UNLOCK ---------- */
    /** Ketma-ket bajarilgan o‘yinlar soni — shunchalik ko‘p bo‘lsa, shuncha o‘yin ochiq */
    function gamesUnlockedCount(course, lesson) {
      const games = (lesson.content && lesson.content.games) || [];
      let n = 0;
      for (let i = 0; i < games.length; i++) {
        const g = games[i];
        const done = g.exercise ? isExerciseDone(course.id, lesson.id, g.exercise) : isGameDone(course.id, lesson.id, g.id);
        if (!done) break;
        n++;
      }
      return n;
    }
    function isGameUnlocked(course, lesson, gameIndex) {
      return gameIndex <= gamesUnlockedCount(course, lesson);
    }
    function gameDoneState(course, lesson, game) {
      return game.exercise ? isExerciseDone(course.id, lesson.id, game.exercise) : isGameDone(course.id, lesson.id, game.id);
    }
    /** Hubni qayta chizish — o‘yin tugagach keyingisini ochadi */
    function refreshGamesHub(course, lesson) {
      const root = document.getElementById('lsGames');
      if (!root) return;
      const wrap = document.createElement('div');
      wrap.innerHTML = renderGamesHTML(course, lesson);
      const next = wrap.firstElementChild;
      root.replaceWith(next);
      setupGames(course, lesson);
    }

    function renderGamesHTML(course, lesson) {
      const content = lesson.content;
      const games = content.games || [];
      const total = games.length;
      const unlockedCount = gamesUnlockedCount(course, lesson);
      let html = '<div class="ls-games" id="lsGames"><div class="ls-games-title">' + esc(content.gamesTitle || '🎮 Mini-o‘yinlar') +
        '<span class="ls-games-progress" id="lsGamesProgress">🏁 ' + unlockedCount + '/' + total + '</span></div>' +
        '<div class="ls-games-bar"><div class="ls-games-bar-fill" style="width:' + Math.round(unlockedCount / total * 100) + '%"></div></div>';
      games.forEach(function (game, gi) {
        const done = gameDoneState(course, lesson, game);
        const unlocked = isGameUnlocked(course, lesson, gi);
        html += '<div class="ls-game-card' + (unlocked ? '' : ' locked') + (done ? ' done' : '') + '" id="lsGame-' + esc(game.id) + '" data-game="' + esc(game.id) + '">' +
          '<div class="ls-game-head">' +
          '<span class="ls-game-ico">' + (unlocked ? esc(game.icon) : '🔒') + '</span>' +
          '<span class="ls-game-name">' + esc(game.title) + '</span>' +
          '<span class="ls-game-desc">' + esc(game.desc) + '</span>' +
          '<span class="ls-game-badge' + (done ? ' done' : '') + '" data-game-badge="' + esc(game.id) + '">' +
          (done ? '✅ Bajarildi' : (unlocked ? '⭐ +' + (game.xp || 10) + ' XP' : '🔒 Yopiq')) + '</span>' +
          '</div>' +
          '<div class="ls-game-body" data-game-body="' + esc(game.id) + '">' +
          (unlocked ? '' : '<div class="ls-game-locked-note">🔒 Avval oldingi o‘yinni tugating</div>') +
          '</div>' +
          '</div>';
      });
      html += '</div>';
      return html;
    }

    function setupGames(course, lesson) {
      const content = lesson.content;
      const data = content.gamesData || {};
      (content.games || []).forEach(function (game, gi) {
        const body = document.querySelector('[data-game-body="' + game.id + '"]');
        if (!body || body.getAttribute('data-bound')) return;
        body.setAttribute('data-bound', '1');
        if (!isGameUnlocked(course, lesson, gi)) { body.innerHTML = '<div class="ls-game-locked-note">🔒 Avval oldingi o‘yinni tugating</div>'; return; }
        if (gameDoneState(course, lesson, game)) {
          /* ✅ Bajarildi — lekin xohlagan payt qayta o‘ynash mumkin (yangi attempt) */
          body.innerHTML = '<div class="ls-game-win">✅ Bajarildi — istasangiz qayta o‘ynashingiz mumkin.</div>' +
            gameStatsHTML(course, lesson, game) +
            '<div class="ls-game-after">' + gameReplayBtnHTML(game) + '</div>';
          return;
        }
        setupGameById(game.id, course, lesson, data, body);
      });
      bindGameReplayButtons(course, lesson);
    }

    function setupGameById(gameId, course, lesson, data, body) {
      if (!body) return;
      const game = (lesson.content.games || []).find(function (g) { return g.id === gameId; });
      if (!game) return;
      /* 🎮 Yangi turlar — game.type bo'yicha (7-dars va undan keyingi o'yinlar) */
      if (game.type === 'quizgame') { setupQuizGame(course, lesson, game, game.questions || [], body); return; }
      if (game.type === 'csstab') { setupCsstab(course, lesson, game, body); return; }
      if (game.type === 'wizard') { setupWizard(course, lesson, game, body); return; }
      if (gameId === 'bughunter') setupBugHunter(course, lesson, game, data.bugHunterRounds || [], body);
      else if (gameId === 'build') { body.innerHTML = '<div class="ls-game-note">👇 Bu o‘yin pastdagi <b>Amaliy topshiriqlar</b> bo‘limida — «Build the HTML» kartasida joylashgan.</div>'; }
      else if (gameId === 'memory') setupMemory(course, lesson, game, data.memoryPairs || [], body);
      else if (gameId === 'runner') setupRunner(course, lesson, game, data.runnerQuestions || [], body);
      else if (gameId === 'sixty') setupSixty(course, lesson, game, data.sixtyQuestions || [], body);
      else if (gameId === 'streak') setupStreak(course, lesson, game, data.streakQuestions || [], body);
      else if (gameId === 'duel') setupDuel(course, lesson, game, data.duelQuestions || [], body);
    }

    /* ---------- 🐛 O‘YIN 1: BUG HUNTER ---------- */
    function setupBugHunter(course, lesson, game, rounds, body) {
      if (!rounds.length) return;
      let ri = 0;
      function render() {
        const r = rounds[ri];
        body.innerHTML =
          '<div class="ls-gh-round">Round ' + (ri + 1) + ' / ' + rounds.length + '</div>' +
          '<div class="ls-gh-q">' + fmt(r.prompt) + '</div>' +
          '<pre class="ls-gh-code">' + esc(r.code) + '</pre>' +
          '<div class="ls-gh-gaps">' + r.gaps.map(function (g, i) {
            return '<button type="button" class="ls-gh-gap" data-gap="' + i + '">' + fmt(g.label) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-gh-fb"></div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-gap]');
        if (!btn || ri >= rounds.length) return;
        const g = rounds[ri].gaps[Number(btn.getAttribute('data-gap'))];
        const fb = body.querySelector('.ls-gh-fb');
        if (g.ok) {
          btn.classList.add('correct');
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Topdingiz! ' + fmt(g.label) + ' — bu yetishib qolgan.</div>';
          ri++;
          if (ri >= rounds.length) {
            finishGameScreen(course, lesson, game, body,
              '<div class="ls-game-win">🏆 Bug Hunter tugadi! Barcha xatolar topildi.</div>', rounds.length);
          } else setTimeout(render, 800);
        } else {
          btn.classList.add('wrong');
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">💡 Hint: ' + fmtText(g.hint || 'Yana urinib ko‘ring') + '</div>';
        }
      });
      render();
    }

    /* ---------- 🧠 O‘YIN 3: MEMORY CODE ---------- */
    function setupMemory(course, lesson, game, pairs, body) {
      if (!pairs.length) return;
      let cards = [];
      pairs.forEach(function (p, pi) {
        cards.push({ pair: pi, text: p[0], kind: 'code' });
        cards.push({ pair: pi, text: p[1], kind: 'label' });
      });
      cards = shuffleArr(cards);
      body._memCards = cards; /* test hook: juftliklarni aniq topish uchun */
      let flipped = [], matched = 0, lock = false;
      function render() {
        body.innerHTML = '<div class="ls-mem-grid">' + cards.map(function (c, i) {
          const open = c.open || c.matched;
          return '<button type="button" class="ls-mem-card' + (c.matched ? ' matched' : '') + (open ? ' open' : '') + '" data-mem="' + i + '"' + (c.matched ? ' disabled' : '') + '>' +
            (open ? (c.kind === 'code' ? '<code>' + esc(c.text) + '</code>' : esc(c.text)) : '❓') + '</button>';
        }).join('') + '</div><div class="ls-mem-fb"></div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-mem]');
        if (!btn || lock) return;
        const i = Number(btn.getAttribute('data-mem'));
        const c = cards[i];
        if (c.open || c.matched) return;
        c.open = true;
        flipped.push(i);
        render();
        if (flipped.length === 2) {
          lock = true;
          const a = cards[flipped[0]], b = cards[flipped[1]];
          const fb = body.querySelector('.ls-mem-fb');
          if (a.pair === b.pair && flipped[0] !== flipped[1]) {
            a.matched = b.matched = true;
            matched++;
            if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ Juftlik topildi! (' + matched + '/' + pairs.length + ')</div>';
            flipped = []; lock = false;
            if (matched === pairs.length) {
              finishGameScreen(course, lesson, game, body,
                '<div class="ls-game-win">🏆 Memory Code tugadi — barcha juftliklar topildi!</div>', pairs.length);
            } else render();
          } else {
            if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Juftlik emas — yana urinib ko‘ring.</div>';
            setTimeout(function () {
              a.open = b.open = false;
              flipped = []; lock = false;
              render();
            }, 800);
          }
        }
      });
      render();
    }

    /* ---------- 🏃 O‘YIN 4: CODE RUNNER ---------- */
    function setupRunner(course, lesson, game, questions, body) {
      if (!questions.length) return;
      const FINISH = 6;
      let pos = 0, qi = 0;
      function render() {
        const q = questions[qi % questions.length];
        body.innerHTML =
          '<div class="ls-run-track">' +
          Array.from({ length: FINISH + 1 }, function (_, i) {
            return '<span class="ls-run-cell' + (i === pos ? ' here' : '') + (i === FINISH ? ' finish' : '') + '">' +
              (i === FINISH ? '🏁' : (i === pos ? '🏃' : (i < pos ? '👣' : '·'))) + '</span>';
          }).join('') +
          '</div>' +
          '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-run-fb"></div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-opt]');
        if (!btn || pos >= FINISH) return;
        const q = questions[qi % questions.length];
        const ok = Number(btn.getAttribute('data-opt')) === q.a;
        const fb = body.querySelector('.ls-run-fb');
        if (ok) {
          pos++;
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! 🏃 oldinga yurding (' + pos + '/' + FINISH + ')</div>';
          if (pos >= FINISH) {
            finishGameScreen(course, lesson, game, body,
              '<div class="ls-game-win">🏁 FINISH! Code Runner tugadi — sen finish chizig‘iga yetib kelding!</div>', pos);
            return;
          }
        } else {
          pos = Math.max(0, pos - 1);
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ Noto‘g‘ri — 🏃 orqaga qaytdi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
        }
        qi++;
        setTimeout(render, 900);
      });
      render();
    }

    /* ---------- ⚡ O‘YIN 5: 60 SECONDS ---------- */
    function setupSixty(course, lesson, game, questions, body) {
      if (!questions.length) return;
      let timer = null, left = 60, score = 0, asked = 0, order = [];
      function pick() {
        if (!order.length) order = shuffleArr(questions.map(function (_, i) { return i; }));
        return questions[order.pop()];
      }
      function renderQ() {
        const q = pick(); asked++;
        body.innerHTML =
          '<div class="ls-sixty-head"><span class="ls-sixty-timer" data-t>⏱ ' + left + '</span><span class="ls-sixty-score">✅ <b data-s>' + score + '</b></span></div>' +
          '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-run-fb"></div>';
        body._q = q;
      }
      function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        const acc = asked ? Math.round(score / asked * 100) : 0;
        setGameBest(course, lesson, 'sixtyBest', score);
        recordGameScore(course, lesson, game, score);
        const winHTML =
          '<div class="ls-game-win">⏱ Vaqt tugadi! Natija: <b>' + score + '</b> to‘g‘ri javob · Aniqlik: <b>' + acc + '%</b> · 🏅 Rekord: <b>' + gameBest(course, lesson, 'sixtyBest') + '</b></div>' +
          (score >= 8 ? '' : '<div class="ls-game-note">Kamida 8 ta to‘g‘ri javob — o‘yin bajarilgan hisoblanadi.</div>');
        if (score >= 8) { finishGameScreen(course, lesson, game, body, winHTML, score); return; }
        /* ❌ O‘yin hali tugamagan — qayta urinish (XP yo‘q, completion saqlanadi) */
        body.innerHTML = winHTML +
          '<div class="ls-game-after">' + gameStatsHTML(course, lesson, game) + gameReplayBtnHTML(game) + '</div>';
        bindGameReplayButtons(course, lesson);
      }
      function start() {
        if (timer) clearInterval(timer);
        score = 0; asked = 0; left = 60; order = [];
        renderQ();
        timer = setInterval(function () {
          left--;
          const tEl = body.querySelector('[data-t]');
          if (tEl) tEl.textContent = '⏱ ' + left;
          if (left <= 0) stop();
        }, 1000);
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-opt]');
        if (!btn || !timer) return;
        const q = body._q;
        const ok = Number(btn.getAttribute('data-opt')) === q.a;
        const fb = body.querySelector('.ls-run-fb');
        if (ok) {
          score++;
          const sEl = body.querySelector('[data-s]');
          if (sEl) sEl.textContent = score;
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback ok">✅</div>';
        } else {
          shakeEl(btn);
          if (fb) fb.innerHTML = '<div class="ls-ex-feedback bad">❌ To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
        }
        setTimeout(function () { if (timer) renderQ(); }, ok ? 350 : 900);
      });
      body.innerHTML = '<div class="ls-game-note">⚡ 60 soniya — tez savol-javob o‘yini. Tayyor bo‘lsangiz bosing!</div>' +
        '<button type="button" class="btn btn-primary btn-sm" data-start="1">▶ Boshlash</button>';
      const sb = body.querySelector('[data-start]');
      if (sb) sb.addEventListener('click', start);
      body._stopSixty = stop; /* test hook: vaqtni kutmasdan yakunlash */
    }

    /* ---------- 🔥 O‘YIN 6: STREAK FIRE ---------- */
    function setupStreak(course, lesson, game, questions, body) {
      if (!questions.length) return;
      const GOAL = 7;
      let streak = 0, qi = 0;
      function flames(n) { return n > 0 ? '🔥'.repeat(Math.min(n, GOAL)) : '💨'; }
      function render(msg) {
        const q = questions[qi % questions.length];
        body.innerHTML =
          '<div class="ls-streak-head"><span class="ls-streak-flames' + (streak >= 4 ? ' hot' : '') + '">' + flames(streak) + '</span>' +
          '<span class="ls-streak-count">Streak: <b>' + streak + '</b> / ' + GOAL + '</span>' +
          '<span class="ls-streak-best">🏅 Best: ' + Math.max(streak, gameBest(course, lesson, 'streakBest')) + '</span></div>' +
          '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-run-fb">' + (msg || '') + '</div>';
      }
      body.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-opt]');
        if (!btn) return;
        if (e.target.closest('[data-streak-retry]')) { streak = 0; qi = 0; render(); return; }
        const q = questions[qi % questions.length];
        const ok = Number(btn.getAttribute('data-opt')) === q.a;
        let msg;
        if (ok) {
          streak++;
          setGameBest(course, lesson, 'streakBest', streak);
          if (streak >= GOAL) {
            finishGameScreen(course, lesson, game, body,
              '<div class="ls-game-win hot">🔥🔥🔥 STREAK FIRE! ' + GOAL + ' ketma-ket to‘g‘ri javob — ajoyib!</div>', streak);
            return;
          }
          msg = '<div class="ls-ex-feedback ok">✅ To‘g‘ri! Streak oshdi 🔥</div>';
        } else {
          streak = 0;
          shakeEl(btn);
          msg = '<div class="ls-ex-feedback bad">❌ Streak reset bo‘ldi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>';
        }
        qi++;
        render(msg);
      });
      render();
    }

    /* ---------- ⚔️ O‘YIN 7: CODE DUEL (bot-versiya — real-time Duel arxitekturaga ulanuvchan) ---------- */
    function setupDuel(course, lesson, game, questions, body) {
      if (!questions.length) return;
      const ROUNDS = 3;
      let ri = 0, me = 0, bot = 0, lock = false;
      function render(msg) {
        const q = questions[ri % questions.length];
        body.innerHTML =
          '<div class="ls-duel-score"><span class="ls-duel-me">🧑 Siz: <b>' + me + '</b></span><span class="ls-duel-vs">VS</span><span class="ls-duel-bot">🤖 Bot: <b>' + bot + '</b></span></div>' +
          '<div class="ls-duel-round">Round ' + (ri + 1) + ' / ' + ROUNDS + ' — bir xil savol, kim tezroq va to‘g‘ri javob bersa — g‘olib!</div>' +
          '<div class="ls-run-q">' + fmt(q.q) + '</div>' +
          '<div class="ls-run-opts">' + q.o.map(function (o, oi) {
            return '<button type="button" class="ls-run-opt" data-opt="' + oi + '">' + fmt(o) + '</button>';
          }).join('') + '</div>' +
          '<div class="ls-run-fb">' + (msg || '') + '</div>' +
          '<button type="button" class="btn btn-ghost btn-sm ls-duel-full" data-full-duel="1">⚔️ To‘liq Duel sahifasini ochish</button>';
      }
      function finish() {
        setGameBest(course, lesson, 'duelWins', me);
        const won = me > bot;
        const duelLinks = '<button type="button" class="btn btn-ghost btn-sm ls-duel-full" data-full-duel="1">⚔️ To‘liq Duel sahifasini ochish</button>';
        const winHTML = '<div class="ls-game-win' + (won ? ' hot' : '') + '">' + (won ? '⚔️ G‘ALIB! Siz botni yutdingiz (' + me + ' : ' + bot + ')!' : '💪 Bot yutdi (' + bot + ' : ' + me + '). Yana urinib ko‘ring!') + '</div>' + duelLinks;
        if (won) { finishGameScreen(course, lesson, game, body, winHTML, me); return; }
        /* 💪 Yutqazildi — o‘yin completion o‘zgarmaydi, qayta urinish mumkin */
        body.innerHTML = winHTML +
          '<button type="button" class="btn btn-primary btn-sm" data-duel-retry="1">🔄 Qayta duellar</button>';
      }
      body.addEventListener('click', function (e) {
        if (e.target.closest('[data-full-duel]')) { page('duel'); return; } // 🔗 mavjud Duel tizimiga o‘tish
        if (e.target.closest('[data-duel-retry]')) { ri = 0; me = 0; bot = 0; lock = false; render(); return; }
        const btn = e.target.closest('[data-opt]');
        if (!btn || lock || ri >= ROUNDS) return;
        lock = true;
        const q = questions[ri % questions.length];
        const myOk = Number(btn.getAttribute('data-opt')) === q.a;
        const myTime = Date.now();
        const botOk = Math.random() < 0.6; // bot 60% aniqlik bilan javob beradi
        const botTime = myTime + 800 + Math.floor(Math.random() * 1800);
        let msg;
        const myPoint = myOk && (!botOk || myTime < botTime);
        const botPoint = botOk && (!myOk || botTime <= myTime);
        if (myPoint) { me++; msg = '<div class="ls-ex-feedback ok">✅ Tez va to‘g‘ri — ochko sizniki! ⚡</div>'; }
        else if (botPoint) { bot++; msg = '<div class="ls-ex-feedback bad">🤖 Bot javob berdi: <b>' + fmt(q.o[q.a]) + '</b> — bot tezroq bo‘ldi.</div>'; }
        else { msg = '<div class="ls-ex-feedback bad">❌ Ikkala tomon ham xato qildi. To‘g‘ri javob: <b>' + fmt(q.o[q.a]) + '</b></div>'; }
        ri++;
        if (ri >= ROUNDS) setTimeout(finish, 900);
        else setTimeout(function () { render(msg); lock = false; }, 900);
      });
      render();
    }

    /* ---------- 🚀 LOYIHA: MY FIRST PORTFOLIO ---------- */
    function projectReturnCtx(course, lesson) {
      return saveLessonCodingContext(course, lesson, null, { language: 'html' });
    }
    function renderProjectHTML(course, lesson) {
      const cfg = lesson.content.project;
      let html = '<div class="ls-project" id="lsProject">' +
        '<div class="ls-project-hero"><div class="ls-project-title">' + esc(cfg.title) + '</div>' +
        '<div class="ls-project-sub">' + esc(cfg.subtitle) + '</div>' +
        '<div class="ls-project-intro">' + fmtText(cfg.intro || '') + '</div></div>';
      // STEP bosqichlari — kumulyativ kod (har bosqich oldingisiga qo‘shiladi)
      let acc = { html: '', css: '', js: '' };
      html += '<div class="ls-project-steps">';
      cfg.steps.forEach(function (step, i) {
        acc.html += step.addHtml || '';
        acc.css += (step.addCss || '');
        acc.js += (step.addJs || '');
        html += '<div class="ls-step-card"><div class="ls-step-head"><span class="ls-step-num">' + (i + 1) + '</span><span class="ls-step-title">' + esc(step.title) + '</span></div>' +
          '<div class="ls-step-note">' + fmtText(step.note || '') + '</div>';
        if (step.addHtml) html += '<pre class="ls-step-code">' + esc(step.addHtml) + '</pre>';
        if (step.addCss) html += '<pre class="ls-step-code css">&lt;style&gt;\n' + esc(step.addCss) + '\n&lt;/style&gt;</pre>';
        if (step.addJs) html += '<pre class="ls-step-code js">&lt;script&gt;\n' + esc(step.addJs) + '\n&lt;/script&gt;</pre>';
        html += '<button type="button" class="btn btn-ghost btn-sm ls-step-pg" data-step-pg="' + i + '">💻 Codingda davom etish</button>' +
          '</div>';
      });
      html += '</div>';
      // CHECKLIST + progress
      html += '<div class="ls-project-checklist-wrap"><div class="ls-checklist-title">📋 PROJECT CHECKLIST</div>' +
        '<div class="ls-progress-track ls-project-progress"><span id="lsProjectBar" style="width:0%"></span></div>' +
        '<div class="ls-project-pct" id="lsProjectPct">0%</div>' +
        '<div class="ls-checklist" id="lsProjectChecklist"></div>' +
        '<div class="ls-game-note" id="lsProjectParty" hidden>🎉 <b>TABRIKLAYMIZ!</b> Sen birinchi portfolio saytingni yaratding! Endi pastdagi LOYIHA editorida ▶ RUN bosib, «🏆 Loyihani yakunlash» tugmasini bosing.</div>' +
        '</div>';
      html += '</div>';
      return html;
    }
    function splitPageCode(code) {
      const cssM = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const jsM = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      let html = code.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      html = html.replace(/<!DOCTYPE[^>]*>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?head[^>]*>/gi, '').replace(/<\/?body[^>]*>/gi, '').replace(/<title[^>]*>[\s\S]*?<\/title>/i, '').trim();
      return { html: html, css: (cssM ? cssM[1].trim() : ''), js: (jsM ? jsM[1].trim() : '') };
    }
    function setupProject(course, lesson) {
      const root = $('#lsProject');
      const cfg = lesson.content.project;
      if (!root) return;
      // Kumulyativ step kodlari — playgroundga yuborish uchun hisoblanadi
      const stepCode = [];
      let acc = { html: '', css: '', js: '' };
      cfg.steps.forEach(function (step) {
        acc = { html: acc.html + (step.addHtml || ''), css: acc.css + (step.addCss || ''), js: acc.js + (step.addJs || '') };
        stepCode.push({ html: acc.html, css: acc.css, js: acc.js });
      });
      // STEP → Coding Playground (raw HTML + CSS + JS — 3 ta tabga)
      root.querySelectorAll('[data-step-pg]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const s = stepCode[Number(btn.getAttribute('data-step-pg'))] || { html: '', css: '', js: '' };
          if (typeof window.openCodePlaygroundWithCode === 'function') {
            window.openCodePlaygroundWithCode(s.html, s.css, s.js, projectReturnCtx(course, lesson));
            toast('💻 Kod Coding Playgroundga yuklandi (HTML / CSS / JS)', 'info');
          } else if (typeof window.openCodePlaygroundWithHtml === 'function') {
            window.openCodePlaygroundWithHtml(s.html, projectReturnCtx(course, lesson));
          } else toast('Coding Playground topilmadi', 'error');
        });
      });
      // LOYIHA editori (ex: l5project) — kodni saqlash + checklistni yangilash
      const KEY = 'ls_project_code_' + lesson.id;
      const ta = document.getElementById('lsExCode-l5project');
      if (ta) {
        try {
          const saved = localStorage.getItem(KEY);
          if (saved != null && saved !== '') ta.value = saved;
        } catch (e) { /* ignore */ }
        ta.addEventListener('input', function () {
          try { localStorage.setItem(KEY, ta.value); } catch (e) { /* ignore */ }
          updateProjectChecklist(course, lesson, cfg);
        });
        // 💻 "Codingda davom etish" — hozirgi loyiha kodini HTML/CSS/JS bo'lib yuborish
        const pgBtn = document.querySelector('[data-project-pg="1"]');
        if (pgBtn && !pgBtn.getAttribute('data-bound')) {
          pgBtn.setAttribute('data-bound', '1');
          pgBtn.addEventListener('click', function () {
            const parts = splitPageCode(ta.value);
            if (typeof window.openCodePlaygroundWithCode === 'function') {
              window.openCodePlaygroundWithCode(parts.html, parts.css, parts.js, projectReturnCtx(course, lesson));
              toast('💻 Kod Coding Playgroundga yuklandi (HTML / CSS / JS)', 'info');
            } else if (typeof window.openCodePlaygroundWithHtml === 'function') {
              window.openCodePlaygroundWithHtml(ta.value, projectReturnCtx(course, lesson));
            }
          });
        }
      }
      updateProjectChecklist(course, lesson, cfg);
    }
    function updateProjectChecklist(course, lesson, cfg) {
      const wrap = $('#lsProjectChecklist');
      if (!wrap) return;
      const ta = document.getElementById('lsExCode-l5project');
      const code = ta ? ta.value : '';
      let doneCount = 0;
      const items = cfg.checklist.map(function (c) {
        const ok = new RegExp(c.re, 'i').test(code);
        if (ok) doneCount++;
        return '<div class="ls-check-item' + (ok ? ' done' : '') + '"><span class="ls-check-ico">' + (ok ? '✅' : '☐') + '</span><span>' + esc(c.label) + '</span></div>';
      }).join('');
      const pct = Math.round(doneCount / cfg.checklist.length * 100);
      wrap.innerHTML = items;
      const bar = $('#lsProjectBar'); if (bar) bar.style.width = pct + '%';
      const pctEl = $('#lsProjectPct'); if (pctEl) pctEl.textContent = pct + '%';
      const party = $('#lsProjectParty'); if (party) party.hidden = pct !== 100;
    }

    /* ---------- 🏆 LOYIHANI YAKUNLASH (+ success screen) ---------- */
    function finishProjectLesson(course, lesson) {
      const prog = courseProgress(course.id);
      if (!prog.completed) prog.completed = {};
      if (!prog.completed[lesson.id]) {
        prog.completed[lesson.id] = { at: Date.now(), score: 10, percent: 100, project: true };
        const coins = (lesson.content.project && lesson.content.project.coins) || 50;
        try {
          const u = currentUser();
          if (u) u.coins = (u.coins || 0) + coins;
        } catch (e) { /* ignore */ }
        prog.lastVisit = Date.now();
        store.progress[course.id] = prog;
        saveStore();
        const totalCompleted = Object.keys(prog.completed).length;
        const courseCompleted = totalCompleted >= course.lessonCount;
        Effects.celebrate({ courseId: course.id, course: course, lesson: lesson });
        Hooks.onLessonComplete.forEach(function (fn) {
          try { fn({ courseId: course.id, course: course, lesson: lesson, xp: lesson.xp, coins: coins, totalCompleted: totalCompleted, courseCompleted: courseCompleted }); } catch (e) { /* ignore */ }
        });
        toast('🎉 BIRINCHI SAYTING TAYYOR! ⭐ +' + lesson.xp + ' XP · 🪙 +' + coins, 'success');
      } else {
        saveStore();
      }
      state.lessonPhase = 'result';
      renderLessonView();
      page('lessonView');
    }
    /** 🎉 5-dars SUCCESS SCREEN — quiz yo‘q, loyiha natijasi */
    function renderProjectResultPhase(found) {
      const wrap = $('#lsLessonContainer');
      if (!wrap) return;
      const course = found.course, lesson = found.lesson;
      const next = window.CoursesAPI.nextLesson(course.id, lesson.id);
      let xp = 0, coins = 0, streak = '—';
      try {
        const u = currentUser();
        if (u) { xp = u.xp || 0; coins = u.coins || 0; streak = u.streak || u.streakCount || '—'; }
      } catch (e) { /* ignore */ }
      wrap.innerHTML =
        '<div class="ls-viewer-wrap ls-result-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top"><button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button></div>' +
        '<div class="ls-viewer-card">' +
        '<div class="ls-viewer-hero ls-result-hero pass ls-project-hero-pass">' +
        '<div class="ls-result-emoji">🎉</div>' +
        '<h3>BIRINCHI SAYTING TAYYOR!</h3>' +
        '<div class="ls-project-congrats">' +
        '<p>“Sen <b>HTML structure</b> yaratding.”</p>' +
        '<p>“<b>CSS</b> bilan uni bezading.”</p>' +
        '<p>“<b>JavaScript</b> bilan interaktiv qilding.”</p>' +
        '</div>' +
        '<div class="ls-reward-chips">' +
        '<span class="ls-reward-chip xp">⭐ XP: ' + xp + '</span>' +
        '<span class="ls-reward-chip coin">🪙 Coins: ' + coins + '</span>' +
        '<span class="ls-reward-chip">🔥 Streak: ' + streak + '</span>' +
        '<span class="ls-reward-chip ok">🏆 Project: ✅</span>' +
        '</div>' +
        '</div>' +
        (next ? '<div class="ls-unlock-banner">🔓 ' + next.number + '-dars ochildi: <b>' + esc(next.title) + '</b></div>' : '') +
        '<div class="ls-viewer-footer ls-result-actions">' +
        (next ? '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoNextBtn">🚀 Keyingi darsga o‘tish</button>' : '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoCourseBtn">🏆 Kurs sahifasiga qaytish</button>') +
        '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsga qaytish</button>' +
        '</div>' +
        '</div>' +
        '</div>';
      const backBtn = $('#lsBackToCourse');
      if (backBtn) backBtn.addEventListener('click', function () { openCourse(course.id); });
      const nextBtn = $('#lsGoNextBtn');
      if (nextBtn) nextBtn.addEventListener('click', function () { openLesson(course.id, next.id); });
      const courseBtn = $('#lsGoCourseBtn');
      if (courseBtn) courseBtn.addEventListener('click', function () { openCourse(course.id); });
      const revBtn = $('#lsReviewLessonBtn');
      if (revBtn) revBtn.addEventListener('click', function () { state.lessonPhase = 'read'; renderLessonView(); });
    }

    /** Read bosqichi pastki CTA qismi */
    function readFooterHTML(course, lesson) {
      /* 🏆 5-dars LOYIHA yakunlash: quiz yo‘q — loyiha bajarilgach dars tugaydi */
      if (!lesson.quiz && lesson.content && lesson.content.project) {
        const exs = (lesson.content.exercises || []).filter(function (ex) { return !ex.bonus; });
        const done = exs.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
        if (!allExercisesDone(course.id, lesson.id, exs)) {
          return '<div class="ls-read-hint locked" id="lsExLockedHint">🔒 Darsni yakunlash uchun <b>LOYIHANI bajaring</b> (' + done + '/' + exs.length + ' topshiriq bajarildi).</div>';
        }
        const completed = isLessonCompleted(course.id, lesson.id);
        return '<div class="ls-read-hint ok">🏆 Loyiha bajarildi — checklist 100%!</div>' +
          '<button type="button" class="btn btn-primary ls-btn-test" id="lsFinishProjectBtn">' + (completed ? '🎉 Natija ekranini ko‘rish' : '🏆 Loyihani yakunlash') + '</button>';
      }
      if (!lesson.quiz) {
        return '<div class="ls-read-hint">🧪 Bu darsning testi tez orada qo‘shiladi.</div>';
      }
      // Mashqlar mavjud bo'lsa — barchasi bajarilmaguncha test YOPIQ
      const exercises = ((lesson.content && lesson.content.exercises) || []).filter(function (ex) { return !ex.bonus; });
      if (exercises.length) {
        const done = exercises.filter(function (ex) { return isExerciseDone(course.id, lesson.id, ex.id); }).length;
        if (!allExercisesDone(course.id, lesson.id, exercises)) {
          return '<div class="ls-read-hint locked" id="lsExLockedHint">🔒 Test hali yopiq. <b>Avval barcha mashqlarni bajaring</b> (' + done + '/' + exercises.length + ' bajarildi).</div>';
        }
        return '<div class="ls-read-hint ok">🧩 Barcha mashqlar bajarildi — test ochildi!</div>' +
          '<button type="button" class="btn btn-primary ls-btn-test" id="lsStartQuizBtn">🧪 Testni boshlash <span class="ls-btn-arrow">→</span></button>';
      }
      const read = isLessonRead(course.id, lesson.id);
      const completed = isLessonCompleted(course.id, lesson.id);
      if (read) {
        return (completed
          ? '<div class="ls-read-hint ok">✅ Bu dars allaqachon tugallangan. Testni qayta topshirib, natijani yangilashingiz mumkin.</div>'
          : '') +
          '<button type="button" class="btn btn-primary ls-btn-test" id="lsStartQuizBtn">🧪 Testni boshlash <span class="ls-btn-arrow">→</span></button>';
      }
      return '<div class="ls-read-hint" id="lsReadHint">📖 Darsni oxirigacha o‘qing — test avtomatik ochiladi.</div>' +
        '<button type="button" class="btn btn-ghost" id="lsMarkReadBtn">✅ O‘qidim deb belgilash</button>';
    }

    function bindReadFooter(course, lesson) {
      const startBtn = $('#lsStartQuizBtn');
      if (startBtn) startBtn.addEventListener('click', function () { startQuizAttempt(course, lesson); });
      const finishBtn = $('#lsFinishProjectBtn');
      if (finishBtn) finishBtn.addEventListener('click', function () { finishProjectLesson(course, lesson); });
      const markBtn = $('#lsMarkReadBtn');
      if (markBtn) markBtn.addEventListener('click', function () {
        markLessonRead(course.id, lesson.id);
        cleanupScroll();
        refreshReadFooter(course, lesson);
        toast('📖 Dars o‘qilgan deb belgilandi — test ochildi!', 'info');
      });
    }

    function refreshReadFooter(course, lesson) {
      const footer = $('#lsReadFooter');
      if (!footer) return;
      footer.innerHTML = readFooterHTML(course, lesson);
      bindReadFooter(course, lesson);
    }

    /** Dars oxirigacha scroll qilinganini kuzatish — read bo'lsa test ochiladi */
    function attachReadTracking(course, lesson) {
      cleanupScroll();
      if (isLessonRead(course.id, lesson.id) || !lesson.content) return;
      const onScroll = function () {
        const body = document.querySelector('.ls-viewer-body');
        if (!body) return;
        const rect = body.getBoundingClientRect();
        // Kontent oxiri ekranda ko'rinsa — o'qilgan hisoblanadi
        if (rect.bottom <= window.innerHeight + 90) {
          markLessonRead(course.id, lesson.id);
          cleanupScroll();
          refreshReadFooter(course, lesson);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      state._scrollCleanup = function () { window.removeEventListener('scroll', onScroll); };
      // Kontent qisqa bo'lib butunlay ko'rinsa — darhol o'qilgan deb belgilash
      setTimeout(onScroll, 350);
    }

    /** Viewer dispatcher — bosqichga qarab render */
    function renderLessonView() {
      cleanupScroll();
      const wrap = $('#lsLessonContainer');
      if (!wrap) return;
      const found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
      if (!found) {
        wrap.innerHTML = '<div class="ls-empty"><div class="ls-empty-ico">🤔</div><h4>Dars topilmadi</h4></div>';
        return;
      }
      if (state.lessonPhase === 'quiz') return renderQuizPhase(found);
      if (state.lessonPhase === 'result') {
        if (found.lesson.content && found.lesson.content.project && !found.lesson.quiz) return renderProjectResultPhase(found);
        return renderResultPhase(found);
      }
      return renderReadPhase(found);
    }

    /** 📚 1-BOSQICH: Darsni o'rganish */
    function renderReadPhase(found) {
      const wrap = $('#lsLessonContainer');
      if (!wrap) return;
      const course = found.course, lesson = found.lesson, index = found.index;
      const completed = isLessonCompleted(course.id, lesson.id);
      const read = isLessonRead(course.id, lesson.id);
      const next = course.lessons[index + 1] || null;
      const prev = course.lessons[index - 1] || null;

      const titleEl = $('#pageTitle');
      if (titleEl) titleEl.textContent = course.name + ' — ' + lesson.number + '-dars';

      // Holat belgisi
      let statusHtml;
      if (completed) statusHtml = '<span class="ls-status-badge done">✅ Tugallangan</span>';
      else if (read) statusHtml = '<span class="ls-status-badge ready">🧪 Testga tayyor</span>';
      else statusHtml = '<span class="ls-status-badge reading">📖 O‘qilmoqda</span>';

      // Kontent yoki placeholder
      const bodyHtml = lesson.content ? renderLessonContentHTML(lesson.content, course, lesson) :
        '<div class="ls-placeholder">' +
        '<div class="ls-placeholder-ico">📚</div>' +
        '<h4>Dars tayyorlanmoqda</h4>' +
        '<p>Bu darsning kontenti tez orada qo‘shiladi. Qolgan darslar bilan tanishib chiqishingiz mumkin.</p>' +
        '</div>';

      // 🤖 Robot dars boshida — HAQIQIY 3D RASM + platforma
      const mascotIntro =
        '<div class="ls-mascot-intro">' +
        '<div class="ls-mascot-intro-text">' +
        '<h4>' + lesson.number + '-dars: ' + esc(lesson.title) + '</h4>' +
        '<p>' + esc(lesson.description || 'Ushbu darsda mavzu nazariyasi, amaliy kod namunalari va qiziqarli topshiriqlar bilan tanishasiz.') + '</p>' +
        '</div>' +
        (window.IT_MASCOT_HTML ? IT_MASCOT_HTML('idle', 'mascot-lg') : '') +
        '</div>';

      wrap.innerHTML =
        '<div class="ls-viewer-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
        '<button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
        '<div class="ls-viewer-hero">' +
        '<div class="ls-viewer-crumb">' +
        '<span class="ls-chip">' + esc(course.icon) + ' ' + esc(course.name) + '</span>' +
        '<span>' + lesson.number + '-dars / ' + course.lessonCount + '</span>' +
        '</div>' +
        '<h3>📚 ' + lesson.number + '-dars: ' + esc(lesson.title) + '</h3>' +
        '<div class="ls-viewer-meta">' +
        '<span>⏱ ' + lesson.duration + ' daqiqa</span>' +
        '<span>📊 ' + esc(lesson.difficulty) + '</span>' +
        statusHtml +
        '</div>' +
        '</div>' +
        '<div class="ls-viewer-body">' + mascotIntro + bodyHtml + '</div>' +
        '<div class="ls-read-footer" id="lsReadFooter">' + readFooterHTML(course, lesson) + '</div>' +
        '<div class="ls-viewer-footer">' +
        '<button type="button" class="btn btn-ghost" id="lsPrevLesson"' + (prev ? '' : ' disabled') + '>← Oldingi</button>' +
        '<div class="ls-complete-note">💡 Darsni o‘qing, testni topshiring — o‘tsangiz keyingi dars ochiladi.</div>' +
        '<button type="button" class="btn btn-ghost" id="lsNextLesson">' +
        (next ? (isLessonUnlocked(course, next, index + 1) ? 'Keyingi →' : '🔒 Keyingi') : 'Keyingi →') +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>';

      $('#lsBackToCourse').addEventListener('click', function () {
        cleanupScroll();
        renderCoursePage();
        page('lessonCourse');
      });
      // 🤖 Yangi dars ochildi → newLesson / rocket, keyin idle
      const introM = wrap.querySelector('.ls-mascot-intro .mascot');
      if (introM && window.ITMascot) {
        ITMascot.setState(introM, 'newLesson');
        ITMascot.say(introM, '');
        setTimeout(function () {
          if (introM.isConnected) ITMascot.setState(introM, 'idle');
        }, 1200);
      }
      const prevBtn = $('#lsPrevLesson');
      if (prevBtn && prev) prevBtn.addEventListener('click', function () { openLesson(course.id, prev.id); });
      const nextBtn = $('#lsNextLesson');
      if (nextBtn && next) {
        nextBtn.addEventListener('click', function () {
          if (isLessonUnlocked(course, next, index + 1)) openLesson(course.id, next.id);
          else openLockedModal(course, next, index + 1);
        });
      } else if (nextBtn) {
        nextBtn.disabled = true; // oxirgi dars
      }
      bindReadFooter(course, lesson);
      attachReadTracking(course, lesson);
      // 🤖 AI lesson context — darsdagi tushunchalar autocomplete'da ustuvor
      if (window.ITTestAI) {
        try {
          window.ITTestAI.setLessonContext({
            courseId: course.id, lessonId: lesson.id, lessonNumber: lesson.number,
            title: lesson.title, keywords: window.ITTestAI.extractLessonKeywords(lesson)
          });
        } catch (e) { /* ignore */ }
      }
      if (lesson.content && lesson.content.exercises) bindExercises(course, lesson);
      setupLessonExtras(course, lesson);
    }

    /* ==========================================================
       5) 🧪 TEST ENGINE — random savollar + natija
       ========================================================== */

    /** Bitta savolni variantlari aralashtirilgan ko'rinishga keltirish */
    function shuffleQuestion(q) {
      const order = q.options.map(function (_, i) { return i; });
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = order[i]; order[i] = order[j]; order[j] = t;
      }
      return {
        question: q.question,
        options: order.map(function (i) { return q.options[i]; }),
        answer: order.indexOf(q.answer),
        explanation: q.explanation || ''
      };
    }

    /** Yangi test urinishasi boshlash — bankdan random 5 ta savol */
    function startQuizAttempt(course, lesson) {
      const quiz = lesson.quiz;
      if (!quiz || !quiz.questions.length) return;
      // Mashqlar bajarilmaguncha test ochilmaydi
      const exercises = (lesson.content && lesson.content.exercises) || [];
      if (exercises.length && !allExercisesDone(course.id, lesson.id, exercises)) {
        toast('🔒 Test hali yopiq. Avval barcha mashqlarni bajaring.', 'warning');
        state.lessonPhase = 'read';
        renderLessonView();
        return;
      }
      // Savollar soni: dars override qilsa shunchaki, aks holda global default
      const qCount = (lesson.content && lesson.content.quizQuestionCount) || QUIZ_QUESTIONS_PER_TEST;
      const picked = shuffleArr(quiz.questions).slice(0, Math.min(qCount, quiz.questions.length));
      state.quiz = {
        items: picked.map(shuffleQuestion),
        answers: picked.map(function () { return null; }),
        index: 0,
        result: null
      };
      state.lessonPhase = 'quiz';
      renderLessonView();
    }

    function answerQuizOption(i) {
      const qs = state.quiz;
      if (!qs || qs.answers[qs.index] != null) return; // allaqachon javob berilgan
      qs.answers[qs.index] = i;
      // renderQuizPhase argumant sifatida found'ni talab qiladi —
      // joriy darsni qayta topamiz — course/lesson konteksti yo‘qolmasin
      const found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
      renderQuizPhase(found); // to'g'ri/noto'g'ri feedback bilan qayta chizish
    }

    /** 🧪 2-BOSQICH: savol kartasi */
    function renderQuizPhase(found) {
      const wrap = $('#lsLessonContainer');
      if (!wrap) return;
      // Himoya: found berilmasa (yoki eskirgan bo'lsa) joriy darsdan qayta topamiz
      if (!found || !found.course) {
        found = window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId);
      }
      if (!found) { state.lessonPhase = 'read'; state.quiz = null; return renderLessonView(); }
      const course = found.course, lesson = found.lesson;
      const quiz = lesson.quiz;
      const qs = state.quiz;
      if (!qs) { startQuizAttempt(course, lesson); return; }

      const item = qs.items[qs.index];
      const total = qs.items.length;
      const answered = qs.answers[qs.index] != null;
      const selected = qs.answers[qs.index];
      const isLast = qs.index >= total - 1;
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const testResult = getTestResult(course.id, lesson.id);

      const titleEl = $('#pageTitle');
      if (titleEl) titleEl.textContent = course.name + ' — ' + lesson.number + '-dars testi';

      let optionsHtml = item.options.map(function (opt, i) {
        let cls = 'ls-quiz-option';
        let mark = '';
        if (answered) {
          if (i === item.answer) { cls += ' ls-opt-correct'; mark = '<span class="ls-opt-mark ok">✓</span>'; }
          else if (i === selected) { cls += ' ls-opt-wrong'; mark = '<span class="ls-opt-mark bad">✗</span>'; }
        }
        return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (answered ? ' disabled' : '') + '>' +
          '<span class="ls-opt-letter">' + letters[i] + '</span>' +
          '<span class="ls-opt-text">' + fmt(opt) + '</span>' +
          mark +
          '</button>';
      }).join('');

      wrap.innerHTML =
        '<div class="ls-viewer-wrap ls-quiz-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
        '<button type="button" class="ls-back-btn" id="lsQuizBackBtn">← Darsga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
        '<div class="ls-viewer-hero ls-quiz-hero">' +
        '<div class="ls-viewer-crumb">' +
        '<span class="ls-chip">🧪 ' + lesson.number + '-dars testi</span>' +
        '<span class="ls-chip">' + esc(course.icon) + ' ' + esc(course.name) + '</span>' +
        '</div>' +
        '<h3>' + esc(lesson.title) + '</h3>' +
        '<div class="ls-viewer-meta">' +
        '<span>❓ Savollar: ' + total + ' ta</span>' +
        '<span>🎯 O‘tish balli: ' + quiz.passingScore + '%</span>' +
        (testResult ? '<span>🔁 Urinishlar: ' + testResult.attempts + '</span>' : '') +
        '</div>' +
        '<div class="ls-quiz-progress">' +
        '<div class="ls-progress-track"><span style="width:' + Math.round(((qs.index + 1) / total) * 100) + '%"></span></div>' +
        '<span class="ls-quiz-progress-text">' + (qs.index + 1) + ' / ' + total + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="ls-viewer-body ls-quiz-body">' +
        '<div class="ls-quiz-questioncard ls-anim-quiz">' +
        '<div class="ls-quiz-qnum">' + (qs.index + 1) + '-savol</div>' +
        '<div class="ls-quiz-question">' + fmt(item.question) + '</div>' +
        '<div class="ls-quiz-options">' + optionsHtml + '</div>' +
        (answered
          ? '<div class="ls-quiz-actions"><button type="button" class="btn btn-primary" id="lsQuizNextBtn">' + (isLast ? 'Natijani ko‘rish →' : 'Keyingi savol →') + '</button></div>'
          : '<div class="ls-quiz-hint">👆 Variantlardan birini tanlang</div>') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      $('#lsQuizBackBtn').addEventListener('click', function () {
        state.lessonPhase = 'read';
        state.quiz = null;
        renderLessonView();
      });
      $$('.ls-quiz-option', wrap).forEach(function (btn) {
        btn.addEventListener('click', function () {
          answerQuizOption(Number(btn.getAttribute('data-i')));
        });
      });
      const nextBtn = $('#lsQuizNextBtn');
      if (nextBtn) nextBtn.addEventListener('click', function () {
        if (qs.index >= total - 1) finishQuizAttempt(found);
        else { qs.index++; renderQuizPhase(found); }
      });
    }

    /** Test yakunlandi — ball hisoblanadi va saqlanadi */
    function finishQuizAttempt(found) {
      const course = found.course, lesson = found.lesson;
      const quiz = lesson.quiz;
      const qs = state.quiz;
      if (!qs) return;
      const total = qs.items.length;
      let score = 0;
      qs.items.forEach(function (it, i) { if (qs.answers[i] === it.answer) score++; });
      const percent = Math.round((score / total) * 100);
      // passingScore: masalan 80% va 5 savol => kamida 4 to'g'ri javob
      const passed = score * 100 >= quiz.passingScore * total;

      const prog = courseProgress(course.id);
      if (!prog.testResults) prog.testResults = {};
      const prev = prog.testResults[lesson.id];
      prog.testResults[lesson.id] = {
        passed: passed, score: score, total: total, percent: percent,
        at: Date.now(), attempts: ((prev && prev.attempts) || 0) + 1
      };

      let firstPass = false;
      if (passed && !isLessonCompleted(course.id, lesson.id)) {
        firstPass = true;
        if (!prog.completed) prog.completed = {};
        prog.completed[lesson.id] = { at: Date.now(), score: score, percent: percent };
      }

      // 🏆 MASTER: barcha mashqlar bajarilgan + testdan o'tilgan
      const exs = (lesson.content && lesson.content.exercises) || [];
      const isMastered = !!(passed && exs.length && allExercisesDone(course.id, lesson.id, exs));
      let masterAwardedNow = false;
      if (isMastered && !(prog.mastered && prog.mastered[lesson.id])) {
        if (!prog.mastered) prog.mastered = {};
        prog.mastered[lesson.id] = { at: Date.now() };
        masterAwardedNow = true;
        const masterXp = (lesson.content && lesson.content.masterXp) || 30;
        try {
          const u = currentUser();
          if (u && typeof window.xpToLevel === 'function') {
            u.xp = (u.xp || 0) + masterXp;
            u.points = (u.points || 0) + masterXp;
            u.level = window.xpToLevel(u.xp);
          }
        } catch (e) { /* ignore */ }
      }
      prog.lastVisit = Date.now();
      store.progress[course.id] = prog;
      saveStore();

      qs.result = { score: score, total: total, percent: percent, passed: passed, firstPass: firstPass, mastered: isMastered, masterAwardedNow: masterAwardedNow };
      state.lessonPhase = 'result';

      if (passed) {
        const totalCompleted = Object.keys(prog.completed).length;
        const courseCompleted = totalCompleted >= course.lessonCount;
        const xp = lesson.xp || 10, coins = LESSON_COIN_REWARD;
        if (masterAwardedNow) {
          const mxp = (lesson.content && lesson.content.masterXp) || 30;
          toast('🎉 ' + lesson.number + '-DARS MASTERED! ⭐ +' + mxp + ' XP 🔓 ' + ((course.lessons[course.lessons.findIndex(function (l) { return l.id === lesson.id; }) + 1] || {}).number || '') + '-dars ochildi', 'success');
        } else if (firstPass) {
          toast('🎉 Testdan o‘tdingiz! ⭐ +' + xp + ' XP · 🪙 +' + coins, 'success');
          Effects.celebrate({ courseId: course.id, course: course, lesson: lesson });
          Hooks.onLessonComplete.forEach(function (fn) {
            try {
              fn({ courseId: course.id, course: course, lesson: lesson, xp: xp, coins: coins, totalCompleted: totalCompleted, courseCompleted: courseCompleted });
            } catch (e) { console.warn('onLessonComplete hook xatosi', e); }
          });
          if (courseCompleted) toast('🏆 "' + course.name + '" kursini to‘liq tugatdingiz!', 'success');
        } else {
          toast('✅ Test qayta topshirildi: ' + percent + '%', 'success');
        }
      } else {
        toast('❌ Testdan o‘tmadingiz (' + percent + '%). Yana urinib ko‘ring!', 'error');
      }
      renderResultPhase(found);
    }

    /** Variant harflari (A, B, C, D...) */
    function lettersOf(item) {
      return item.options.map(function (_, i) {
        return ['A', 'B', 'C', 'D', 'E', 'F'][i] || String(i + 1);
      });
    }

    /** 🏆 3-BOSQICH: natija ekrani + xatolar tahlili */
    function renderResultPhase(found) {
      const wrap = $('#lsLessonContainer');
      if (!wrap) return;
      const course = found.course, lesson = found.lesson;
      const qs = state.quiz;
      if (!qs || !qs.result) { state.lessonPhase = 'read'; return renderReadPhase(found); }
      const r = qs.result;
      const quiz = lesson.quiz;
      const next = course.lessons[course.lessons.findIndex(function (l) { return l.id === lesson.id; }) + 1] || null;

      const titleEl = $('#pageTitle');
      if (titleEl) titleEl.textContent = course.name + ' — test natijasi';

      // --- Javoblar tahlili (har bir savol + izoh) ---
      let reviewHtml = '<div class="ls-review"><div class="ls-review-title">📋 Javoblaringiz tahlili</div>';
      qs.items.forEach(function (it, i) {
        const selected = qs.answers[i];
        const ok = selected === it.answer;
        reviewHtml +=
          '<div class="ls-review-item' + (ok ? '' : ' wrong') + '">' +
          '<div class="ls-review-head">' + (ok ? '<span class="ok">✅ To‘g‘ri</span>' : '<span class="bad">❌ Noto‘g‘ri</span>') + '<span class="ls-review-num">' + (i + 1) + '-savol</span></div>' +
          '<div class="ls-review-q">' + fmt(it.question) + '</div>' +
          (selected != null
            ? '<div class="ls-review-line">Siz: <b>' + lettersOf(it)[selected] + ') ' + fmt(it.options[selected]) + '</b></div>'
            : '<div class="ls-review-line">Siz: javob berilmadi</div>') +
          (!ok ? '<div class="ls-review-line good">To‘g‘ri javob: <b>' + lettersOf(it)[it.answer] + ') ' + fmt(it.options[it.answer]) + '</b></div>' : '') +
          (it.explanation ? '<div class="ls-review-expl">💡 ' + fmtText(it.explanation) + '</div>' : '') +
          '</div>';
      });
      reviewHtml += '</div>';
      // --- Mukofotlar ---
      const rewardsHtml = r.passed
        ? '<div class="ls-reward-chips">' +
        '<span class="ls-reward-chip xp">⭐ +' + (lesson.xp || 10) + ' XP</span>' +
        '<span class="ls-reward-chip coin">🪙 +' + (r.firstPass ? LESSON_COIN_REWARD : 0) + ' Coin</span>' +
        '</div>'
        : '';

      // --- Tugmalar ---
      const buttonsHtml = r.passed
        ? (next
          ? '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoNextBtn">Keyingi dars →</button>'
          : '<button type="button" class="btn btn-primary ls-btn-test" id="lsGoCourseBtn">🏆 Kurs sahifasiga qaytish</button>') +
        '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsga qaytish</button>'
        : '<button type="button" class="btn btn-primary" id="lsRetakeBtn">🔄 Qayta topshirish</button>' +
        '<button type="button" class="btn btn-ghost" id="lsReviewLessonBtn">📚 Darsni qayta ko‘rish</button>';

      wrap.innerHTML =
        '<div class="ls-viewer-wrap ls-result-wrap" style="--ls-color:' + esc(course.color) + '">' +
        '<div class="ls-viewer-top">' +
        '<button type="button" class="ls-back-btn" id="lsBackToCourse">← ' + esc(course.name) + ' kursiga qaytish</button>' +
        '</div>' +
        '<div class="ls-viewer-card">' +
        '<div class="ls-viewer-hero ls-result-hero ' + (r.passed ? 'pass' : 'fail') + '">' +
        '<div class="ls-result-emoji">' + (r.passed ? '🎉' : '😔') + '</div>' +
        '<h3>' + (r.passed ? 'Ajoyib!' : 'Bu safar yetarli bo‘lmadi.') + '</h3>' +
        '<div class="ls-result-score">' +
        '<span class="ls-result-frac">' + r.score + ' / ' + r.total + '</span>' +
        '<span class="ls-result-percent">' + r.percent + '%</span>' +
        '</div>' +
        '<div class="ls-result-badge ' + (r.passed ? 'ok' : 'bad') + '">' + (r.passed ? '✅ Testdan o‘tdingiz!' : '❌ Testdan o‘tmadingiz') + '</div>' +
        (!r.passed ? '<div class="ls-result-note">Kamida <b>' + quiz.passingScore + '%</b> kerak. Darsni qayta ko‘rib, yana urinib ko‘ring — siz bilasiz! 💪</div>' : '') +
        rewardsHtml +
        '</div>' +
        (r.passed && r.mastered ? '<div class="ls-unlock-banner master">🎉 ' + lesson.number + '-DARS MASTERED · ⭐ +' + ((lesson.content && lesson.content.masterXp) || 30) + ' XP' + (next ? ' · 🔓 ' + next.number + '-DARS OCHILDI' : '') + '</div>' : '') +
        (r.passed && next ? '<div class="ls-unlock-banner">🔓 ' + next.number + '-dars ochildi: <b>' + esc(next.title) + '</b></div>' : '') +
        '<div class="ls-viewer-body">' + reviewHtml + '</div>' +
        '<div class="ls-viewer-footer ls-result-actions">' + buttonsHtml + '</div>' +
        '</div>' +
        '</div>';

      $('#lsBackToCourse').addEventListener('click', function () {
        state.quiz = null;
        state.lessonPhase = 'read';
        renderCoursePage();
        page('lessonCourse');
      });
      const nextBtn = $('#lsGoNextBtn');
      if (nextBtn && next) nextBtn.addEventListener('click', function () {
        const wasLocked = !isLessonUnlocked(course, next, course.lessons.findIndex(function (l) { return l.id === next.id; }));
        state.quiz = null;
        openLesson(course.id, next.id);
        if (wasLocked) toast('🔓 ' + next.number + '-dars ochildi!', 'success');
      });
      const goCourseBtn = $('#lsGoCourseBtn');
      if (goCourseBtn) goCourseBtn.addEventListener('click', function () {
        state.quiz = null;
        state.lessonPhase = 'read';
        renderCoursePage();
        page('lessonCourse');
      });
      const retakeBtn = $('#lsRetakeBtn');
      if (retakeBtn) retakeBtn.addEventListener('click', function () {
        startQuizAttempt(course, lesson); // yangi random savollar bilan
      });
      const reviewBtn = $('#lsReviewLessonBtn');
      if (reviewBtn) reviewBtn.addEventListener('click', function () {
        state.quiz = null;
        state.lessonPhase = 'read';
        renderLessonView();
      });
    }

    /* ==========================================================
       6) BILIM DARAJASI MODALI
       ========================================================== */
    function closeModalSafe(el) { if (el) el.classList.remove('active'); }

    function openLevelModal(courseId, firstTime) {
      const modal = $('#lessonLevelModal');
      const body = $('#lessonLevelBody');
      const title = $('#lessonLevelTitle');
      const course = window.CoursesAPI.getCourse(courseId);
      if (!modal || !body || !course) return;

      if (title) title.textContent = course.name + ' bilim darajangizni aniqlaymiz';
      const questions = diagnosticQuestions(course);
      state.diagnostic = {
        courseId: courseId,
        items: questions.map(shuffleQuestion),
        answers: questions.map(function () { return null; }),
        index: 0
      };
      renderDiagnosticQuestion(modal, body);

      const closeBtn = $('#lessonLevelClose');
      if (closeBtn) closeBtn.style.display = firstTime ? 'none' : '';
      const footerClose = modal.querySelector('.modal-footer [data-close]');
      if (footerClose) footerClose.style.display = firstTime ? 'none' : '';
      modal.classList.add('active');
    }

    /** Kurs savollaridan qo‘lda daraja tanlamasdan diagnostika testi tuzish. */
    function diagnosticQuestions(course) {
      const bank = [];
      (course.lessons || []).forEach(function (lesson) {
        if (lesson.quiz && Array.isArray(lesson.quiz.questions)) {
          lesson.quiz.questions.forEach(function (question) {
            if (bank.length < 15) bank.push(question);
          });
        }
      });
      if (!bank.length) return [{ question: course.name + ' kursini boshlashga tayyormisiz?', options: ['Ha', 'Hali emas'], answer: 0, explanation: '' }];
      const count = Math.min(5, bank.length);
      const step = Math.max(1, Math.floor(bank.length / count));
      return Array.from({ length: count }, function (_, i) { return bank[Math.min(i * step, bank.length - 1)]; });
    }

    function renderDiagnosticQuestion(modal, body) {
      const d = state.diagnostic;
      if (!d || !d.items.length) return;
      const item = d.items[d.index];
      const answered = d.answers[d.index] != null;
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      body.innerHTML =
        '<p class="ls-modal-sub">Darajani siz emas, shu qisqa test natijasi aniqlaydi.</p>' +
        '<div class="ls-diagnostic-progress">Savol ' + (d.index + 1) + ' / ' + d.items.length + '</div>' +
        '<div class="ls-diagnostic-question">' + fmt(item.question) + '</div>' +
        '<div class="ls-diagnostic-options">' + item.options.map(function (opt, i) {
          return '<button type="button" class="ls-diagnostic-option' + (answered && i === item.answer ? ' correct' : '') + '" data-i="' + i + '"' + (answered ? ' disabled' : '') + '>' +
            '<span>' + letters[i] + '</span>' + fmt(opt) + '</button>';
        }).join('') + '</div>' +
        (answered ? '<div class="ls-diagnostic-feedback">' + (d.answers[d.index] === item.answer ? '✅ To‘g‘ri javob' : '💡 To‘g‘ri javob: ' + fmt(item.options[item.answer])) + '</div>' : '');
      $$('.ls-diagnostic-option', body).forEach(function (button) {
        button.addEventListener('click', function () {
          d.answers[d.index] = Number(button.getAttribute('data-i'));
          if (d.index < d.items.length - 1) d.index++;
          else finishDiagnostic(modal, body);
          renderDiagnosticQuestion(modal, body);
        });
      });
    }

    function finishDiagnostic(modal, body) {
      const d = state.diagnostic;
      const score = d.answers.reduce(function (sum, answer, i) { return sum + (answer === d.items[i].answer ? 1 : 0); }, 0);
      const percent = Math.round((score / d.items.length) * 100);
      const lvl = percent < 40 ? 'beginner' : (percent < 75 ? 'intermediate' : 'advanced');
      setLevel(d.courseId, lvl);
      Hooks.onLevelChange.forEach(function (fn) { try { fn(d.courseId, lvl); } catch (e) { console.warn(e); } });
      closeModalSafe(modal);
      state.diagnostic = null;
      toast('🧠 Test natijasi: ' + percent + '% — "' + LEVEL_LABELS[lvl] + '" daraja aniqlandi', 'success');
      renderCoursePage();
    }

    /* ==========================================================
       7) O'RGANISH SOZLAMALARI MODALI
       ========================================================== */
    function openSettingsModal(courseId) {
      const modal = $('#lessonSettingsModal');
      const body = $('#lessonSettingsBody');
      const course = window.CoursesAPI.getCourse(courseId);
      if (!modal || !body || !course) return;
      const lvl = levelOf(courseId);

      body.innerHTML =
        '<div class="ls-settings-current">🧠 <span><strong>' + esc(course.name) + '</strong> uchun bilim darajasi: <strong>' +
        esc(lvl ? LEVEL_LABELS[lvl] : '—') + '</strong></span></div>' +
        '<p class="ls-modal-sub">Daraja qo‘lda tanlanmaydi. Uni qayta aniqlash uchun testni topshiring.</p>' +
        '<button type="button" class="btn btn-primary" id="lsRetakeDiagnosticBtn">🧪 Darajani test orqali qayta aniqlash</button>' +
        '<div class="ls-settings-danger">' +
        '<button type="button" class="btn btn-ghost" id="lsResetProgressBtn" style="color:var(--danger)">🗑 Kurs progressini tozalash</button>' +
        '</div>';

      const retakeBtn = $('#lsRetakeDiagnosticBtn');
      if (retakeBtn) retakeBtn.addEventListener('click', function () {
        closeModalSafe(modal);
        openLevelModal(courseId, false);
      });

      const resetBtn = $('#lsResetProgressBtn');
      if (resetBtn) resetBtn.addEventListener('click', function () {
        if (!window.confirm('"' + course.name + '" kursidagi barcha progress o‘chiriladi. Davom etasizmi?')) return;
        delete store.progress[courseId];
        saveStore();
        closeModalSafe(modal);
        toast('Kurs progressi tozalandi', 'info');
        renderCoursePage();
      });

      modal.classList.add('active');
    }

    /* ==========================================================
       8) ROUTING INTEGRATSIYASI (script.js showPage chaqiradi)
       ========================================================== */
    function handlePage(name) {
      loadStore(); // foydalanuvchi o'zgargan bo'lishi mumkin — store yangilash
      if (name === 'lessons') {
        state.currentCourseId = null;
        state.currentLessonId = null;
        renderCoursesPage();
      } else if (name === 'lessonCourse') {
        if (!state.currentCourseId || !window.CoursesAPI.getCourse(state.currentCourseId)) {
          // to'g'ridan-to'g'ri URL orqali kirilgan bo'lsa
          page('lessons');
          return;
        }
        renderCoursePage();
      } else if (name === 'lessonView') {
        if (!state.currentCourseId || !state.currentLessonId ||
          !window.CoursesAPI.findLesson(state.currentCourseId, state.currentLessonId)) {
          page('lessons');
          return;
        }
        renderLessonView();
      }
    }

    /* ---------- GLOBAL API ---------- */
    window.Lessons = {
      handlePage: handlePage,
      openCourse: openCourse,
      openLesson: openLesson,
      openLevelModal: openLevelModal,
      openSettingsModal: openSettingsModal,
      /** Codingdan darsga qaytish — return context (course/lesson/scroll) tiklanadi */
      returnFromCoding: function () {
        let ctx = null;
        try { ctx = JSON.parse(localStorage.getItem('ls_return_ctx') || 'null'); } catch (e) { ctx = null; }
        if (ctx && ctx.courseId && ctx.lessonId) {
          openLesson(ctx.courseId, ctx.lessonId); // setupLessonExtras scrollni tiklaydi + toast
        } else {
          openCourse('html'); // context yo'q bo'lsa kurs sahifasiga
        }
      },
      /** Darslar bo'limining bosh sahifasiga o'tish */
      go: function () { page('lessons'); }
    };
    window.LessonsHooks = Hooks;
    window.LessonsEffects = Effects;
    window.LessonsLevels = LEVELS;
  })();


  /* --- dashboard.js --- */
  /* ============================================================
     ITTest — YANGI DASHBOARD (0 dan qayta qurilgan)
     HOME / ACTION CENTER — analytics page EMAS.
     Real data manbalari:
       - window.__itGetCurrentUser()          (user, XP, streak, testResults, duelHistory)
       - window.CoursesAPI                    (kurslar/darslar real data)
       - localStorage darslar_state_v1::<usr> (darslar progressi — lessons-app.js bilan bir xil)
       - window.Lessons.openLesson            (haqiqiy darsni ochadi)
       - window.__itShowPage                  (haqiqiy sahifa navigatsiyasi)
       - window.ITMascot                      (3D robot)
     Hech qanday fake statistika yaratilmaydi: 0 bo'lsa 0 ko'rsatiladi.
     ============================================================ */
  (function () {
    'use strict';

    var DAY_MS = 86400000;
    var STORE_PREFIX = 'darslar_state_v1';
    var DAILY_GOAL_ACTIONS = 3;   // bugungi maqsad: 3 ta faoliyat (dars/test/duel)
    var DAILY_GOAL_MINUTES = 15;  // bugungi vaqt maqsadi (faqat real durationSec'lardan)

    var WEEK_LABELS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']; // Dushanba → Yakshanba

    function $(sel, root) { return (root || document).querySelector(sel); }
    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function currentUser() {
      try { return window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; }
      catch (e) { return null; }
    }

    function dayKey(ts) {
      var d = ts ? new Date(ts) : new Date();
      return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    }
    function isToday(ts) { return !!ts && dayKey(ts) === dayKey(); }

    /* ---------- Darslar progress store (faqat O'QISH — lessons-app bilan bir xil kalit) ---------- */
    function lessonsStore() {
      var u = currentUser();
      var who = u ? (u.username || u.email || 'user') : 'guest';
      var raw = null;
      try { raw = localStorage.getItem(STORE_PREFIX + '::' + String(who).toLowerCase()); }
      catch (e) { raw = null; }
      var store = null;
      try { store = raw ? JSON.parse(raw) : null; } catch (e) { store = null; }
      if (!store || typeof store !== 'object') store = {};
      if (!store.levels) store.levels = {};
      if (!store.progress) store.progress = {};
      return store;
    }

    function completedMap(store, courseId) {
      var p = store.progress[courseId];
      return (p && p.completed) ? p.completed : {};
    }
    function completedCountOf(store, courseId) {
      return Object.keys(completedMap(store, courseId)).length;
    }
    function completedCountOfTotal(store) {
      var n = 0;
      Object.keys(store.progress).forEach(function (cid) { n += completedCountOf(store, cid); });
      return n;
    }

    /* Joriy kurs: oxirgi ochilgan tugallanmagan kurs, aks holda boshlanmagan birinchi kurs */
    function pickCurrentCourse(store) {
      var api = window.CoursesAPI;
      if (!api) return null;
      var courses = api.listCourses() || [];
      if (!courses.length) return null;
      var best = null, bestVisit = -1;
      courses.forEach(function (c) {
        var p = store.progress[c.id];
        if (!p) return;
        if (completedCountOf(store, c.id) >= (c.lessonCount || 0)) return; // tugallangan
        var v = p.lastVisit || 0;
        if (v > bestVisit) { best = c; bestVisit = v; }
      });
      if (!best) {
        for (var i = 0; i < courses.length; i++) {
          if (completedCountOf(store, courses[i].id) === 0) { best = courses[i]; break; }
        }
      }
      if (!best) best = courses[0];
      return best;
    }

    /* Joriy dars: birinchi tugallanmagan (lessons-app currentLesson mantiqining o'qishli replikasi) */
    function currentLessonOf(store, course) {
      var completed = completedMap(store, course.id);
      var level = store.levels[course.id] || 'intermediate';
      var sequential = level === 'beginner';
      for (var i = 0; i < course.lessons.length; i++) {
        var l = course.lessons[i];
        if (completed[l.id]) continue;
        if (sequential && i > 0) {
          var prev = course.lessons[i - 1];
          if (!completed[prev.id]) break; // hali ochilmagan (yopiq)
        }
        return l;
      }
      return null; // barchasi tugallangan
    }

    /* ---------- Bugungi real faoliyat ---------- */
    function todayStats(u, store) {
      var tests = (u.testResults || []).filter(function (r) { return isToday(r.timestamp); });
      var duels = (u.duelHistory || []).filter(function (d) { return isToday(d.timestamp); });
      var lessons = [];
      Object.keys(store.progress).forEach(function (cid) {
        var course = window.CoursesAPI ? window.CoursesAPI.getCourse(cid) : null;
        if (!course) return;
        var completed = completedMap(store, cid);
        Object.keys(completed).forEach(function (lid) {
          var rec = completed[lid];
          if (rec && rec.at && isToday(rec.at)) {
            var found = window.CoursesAPI.findLesson(cid, lid);
            lessons.push({
              courseId: cid,
              lesson: found ? found.lesson : null,
              courseName: course.name,
              score: rec.score || 0
            });
          }
        });
      });
      var minutes = 0;
      tests.forEach(function (r) { minutes += (r.durationSec || 0) / 60; });
      duels.forEach(function (d) { minutes += (d.durationSec || 0) / 60; });
      minutes = Math.round(minutes);
      var xp = tests.reduce(function (s, r) { return s + (r.score || 0); }, 0);
      var actions = tests.length + duels.length + lessons.length;
      return {
        tests: tests, duels: duels, lessons: lessons,
        minutes: minutes, xp: xp, actions: actions,
        pct: Math.min(100, Math.round((actions / DAILY_GOAL_ACTIONS) * 100))
      };
    }

    /* ---------- Streak hafta ko'rinishi (real streak + lastActiveDay) ---------- */
    function streakWeek(u) {
      var today = new Date();
      today.setHours(12, 0, 0, 0);
      var monday = new Date(today);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // shu hafta dushanbasi
      var activeKeys = {};
      var streak = u.streak || 0;
      if (u.lastActiveDay && streak > 0) {
        var anchor = null;
        if (u.lastActiveDay === dayKey(today.getTime())) anchor = today.getTime();
        else if (u.lastActiveDay === dayKey(today.getTime() - DAY_MS)) anchor = today.getTime() - DAY_MS;
        if (anchor != null) {
          for (var i = 0; i < streak; i++) activeKeys[dayKey(anchor - i * DAY_MS)] = true;
        }
      }
      var days = [];
      for (var d = 0; d < 7; d++) {
        var ts = monday.getTime() + d * DAY_MS;
        days.push({ label: WEEK_LABELS[d], active: !!activeKeys[dayKey(ts)], today: dayKey(ts) === dayKey(today.getTime()) });
      }
      return days;
    }

    /* ---------- Yaqin test maqsadi (real ACHIEVEMENTS valuesiga mos) ---------- */
    function nextTestGoal(total) {
      if (total < 5) return { target: 5, label: '5 test' };
      if (total < 20) return { target: 20, label: '20 test' };
      return null;
    }

    /* ---------- Bugungi challenge (deterministik kunlik tanlov — real kurs/dars) ---------- */
    function challengeOf(store) {
      var api = window.CoursesAPI;
      if (!api) return null;
      var courses = api.listCourses() || [];
      if (!courses.length) return null;
      var dk = dayKey();
      var seed = 0;
      for (var i = 0; i < dk.length; i++) seed = (seed * 31 + dk.charCodeAt(i)) % 100000;
      var course = courses[seed % courses.length];
      var lesson = currentLessonOf(store, course) || course.lessons[0];
      if (!lesson) return null;
      var completed = completedMap(store, course.id);
      var rec = completed[lesson.id];
      var done = !!(rec && rec.at && isToday(rec.at));
      return { course: course, lesson: lesson, done: done };
    }

    /* ---------- Recent activity (real eventlar: dars / test / duel) ---------- */
    function activityFeed(u, store) {
      var items = [];
      (u.testResults || []).forEach(function (r) {
        if (!r.timestamp) return;
        items.push({
          ts: r.timestamp, ico: '🧠',
          text: 'Test bajarildi: ' + (r.subject || '') + ' · ' + (r.percent || 0) + '%',
          sub: '+' + (r.score || 0) + ' XP' + (r.passed ? ' · ✅ Passed' : '')
        });
      });
      (u.duelHistory || []).forEach(function (d) {
        if (!d.timestamp) return;
        var w = d.winStatus === 'win', draw = d.winStatus === 'draw';
        items.push({
          ts: d.timestamp,
          ico: w ? '🏆' : (draw ? '🤝' : '⚔️'),
          text: 'Duel ' + (w ? 'g‘alabasi' : (draw ? 'durrang' : 'maglubiyat')) + (d.subject ? ' · ' + d.subject : ''),
          sub: (d.score1 != null ? d.score1 : '?') + ' : ' + (d.score2 != null ? d.score2 : '?')
        });
      });
      Object.keys(store.progress).forEach(function (cid) {
        var course = window.CoursesAPI ? window.CoursesAPI.getCourse(cid) : null;
        if (!course) return;
        var completed = completedMap(store, cid);
        Object.keys(completed).forEach(function (lid) {
          var rec = completed[lid];
          if (!rec || !rec.at) return;
          var found = window.CoursesAPI.findLesson(cid, lid);
          items.push({
            ts: rec.at, ico: '✅',
            text: (found ? found.course.name + ' · ' + found.lesson.number + '-dars' : course.name) + ' tugatildi',
            sub: '📚 ' + (found ? found.lesson.title : '')
          });
        });
      });
      items.sort(function (a, b) { return b.ts - a.ts; });
      return items.slice(0, 4);
    }

    /* ================== RENDER QISMLARI ================== */

    function renderHero(u) {
      var nameEl = $('#ndHeroName');
      if (nameEl) nameEl.textContent = u.firstname || u.username || 'Foydalanuvchi';
      var subEl = $('#ndHeroSub');
      if (subEl) {
        var s = u.streak || 0;
        subEl.textContent = s > 0
          ? '🔥 ' + s + ' kunlik streak davom etmoqda — bugun ham bir qadam oldinga.'
          : 'Bugun atigi 15 daqiqa ajrating — o‘zingizni kechagidan kuchliroq qiling.';
      }
      var av = $('#ndHeroAvatar');
      if (av) {
        var top = $('#topbarAvatar');
        av.textContent = (top && top.textContent) ? top.textContent : (u.avatar || 'U');
      }
      var lvl = u.level || 1;
      var base = (u.xp || 0) % 100;
      var badge = $('#ndHeroLevel');
      if (badge) badge.textContent = 'Level ' + lvl;
      var track = $('#ndHeroXpTrack');
      if (track) {
        track.setAttribute('aria-valuenow', String(base));
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-label', 'Level ' + lvl + ' XP progressi');
      }
      var fill = $('#ndHeroXpFill');
      if (fill) fill.style.width = base + '%';
      var txt = $('#ndHeroXpText');
      if (txt) txt.textContent = base + ' / 100 XP';
    }

    function renderHeroRobot() {
      var box = $('#ndHeroRobot');
      if (!box) return;
      if (window.ITMascot && typeof window.ITMascot.html === 'function') {
        box.innerHTML = window.ITMascot.html('idle', 'mascot--sm');
      }
    }

    function renderToday(u, store) {
      var body = $('#ndTodayBody');
      if (!body) return;
      var t = todayStats(u, store);

      if (t.actions === 0) {
        var fresh = (u.testResults || []).length === 0 && (u.duelHistory || []).length === 0 &&
          completedCountOfTotal(store) === 0;
        body.innerHTML =
          '<div class="nd-empty">' +
          '<div class="nd-empty-ico" aria-hidden="true">🌅</div>' +
          '<h3>' + (fresh ? 'Bugun boshlash uchun ajoyib kun!' : 'Bugun hali faoliyat yo‘q') + '</h3>' +
          '<p>' + (fresh ? 'Birinchi dars bilan boshlang — hammasi yaxshi bo‘ladi!' : 'Birinchi qadamni tashlang, qolgani o‘z-o‘zidan keladi.') + '</p>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">📚 Birinchi darsni boshlash</button>' +
          '</div>';
        return;
      }

      var rows =
        '<ul class="nd-facts">' +
        '<li><span class="nd-fact-ico" aria-hidden="true">📚</span><span class="nd-fact-t">Dars</span><span class="nd-fact-v">' + t.lessons.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">🧠</span><span class="nd-fact-t">Test</span><span class="nd-fact-v">' + t.tests.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">⚔️</span><span class="nd-fact-t">Duel</span><span class="nd-fact-v">' + t.duels.length + ' ta</span></li>' +
        '<li><span class="nd-fact-ico" aria-hidden="true">⭐</span><span class="nd-fact-t">XP (bugun)</span><span class="nd-fact-v">+' + t.xp + ' XP</span></li>' +
        '</ul>';

      var hint;
      if (t.pct >= 100 && t.minutes >= DAILY_GOAL_MINUTES) hint = '🎉 Zo‘r! Bugungi maqsad bajarildi.';
      else if (t.pct >= 100) hint = '✅ Bugungi faoliyat bajarildi — istasangiz 15 daqiqa ham oshiring.';
      else hint = 'Maqsad: ' + DAILY_GOAL_ACTIONS + ' ta faoliyat — ' + t.actions + ' ta bajarildi.';

      body.innerHTML =
        '<div class="nd-today">' +
        '<div class="nd-ring-wrap">' + ringSVG(t.pct) +
        '<div class="nd-ring-caption"><b>' + t.minutes + '</b><span>daqiqa</span></div>' +
        '</div>' +
        '<div class="nd-today-side">' + rows +
        '<p class="nd-hint" id="ndProgressHint">' + esc(hint) + '</p>' +
        '</div>' +
        '</div>';
    }

    function ringSVG(pct) {
      var r = 52, c = 2 * Math.PI * r;
      var off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
      return '<svg class="nd-ring" viewBox="0 0 120 120" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Bugungi progress">' +
        '<circle class="nd-ring-track" cx="60" cy="60" r="' + r + '"/>' +
        '<circle class="nd-ring-fill" cx="60" cy="60" r="' + r + '" data-off="' + off.toFixed(1) + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/>' +
        '</svg>';
    }

    function renderStreak(u) {
      var body = $('#ndStreakBody');
      if (!body) return;
      var s = u.streak || 0;
      var week = streakWeek(u);
      var dots = week.map(function (d) {
        var cls = 'nd-day' + (d.active ? ' nd-day--on' : '') + (d.today ? ' nd-day--today' : '');
        return '<span class="' + cls + '"><i aria-hidden="true">' + d.label + '</i></span>';
      }).join('');
      var hint = s === 0
        ? 'Bugun shug‘ullaning — streakni yoqib yuboring!'
        : (u.lastActiveDay === dayKey() ? 'Bugun belgilandi ✅ Streak davom etmoqda.' : 'Bugun shug‘ullaning — streak saqlanadi!');
      body.innerHTML =
        '<div class="nd-streak-num"><span class="nd-streak-flame" aria-hidden="true">🔥</span><b>' + s + '</b><span>kun</span></div>' +
        '<div class="nd-week" aria-label="Haftalik streak">' + dots + '</div>' +
        '<p class="nd-hint">' + esc(hint) + '</p>';
    }

    function renderLesson(u, store) {
      var body = $('#ndLessonBody');
      if (!body) return;
      var course = pickCurrentCourse(store);
      if (!course) {
        body.innerHTML = '<div class="nd-empty"><div class="nd-empty-ico" aria-hidden="true">📚</div><h3>Darslar hali tayyor emas</h3><p>Keyinroq qayta kiring.</p></div>';
        return;
      }
      var lesson = currentLessonOf(store, course);
      var done = completedCountOf(store, course.id);
      var total = course.lessonCount || course.lessons.length || 0;
      var pct = total ? Math.round((done / total) * 100) : 0;

      if (!lesson) {
        body.innerHTML =
          '<div class="nd-lesson-done">' +
          '<div class="nd-empty-ico" aria-hidden="true">🎉</div>' +
          '<h3>' + esc(course.name) + ' kursi tugallangan!</h3>' +
          '<p>' + total + ' ta darsning barchasi yakunlandi. Zo‘r ish!</p>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">Keyingi kursni boshlash →</button>' +
          '</div>';
        return;
      }

      var started = done > 0;
      body.innerHTML =
        '<div class="nd-lesson">' +
        '<div class="nd-lesson-icon" aria-hidden="true">' + esc(course.icon || '📘') + '</div>' +
        '<div class="nd-lesson-info">' +
        '<span class="nd-lesson-course">' + esc(course.name) + '</span>' +
        '<h3 class="nd-lesson-title">' + lesson.number + '-dars: ' + esc(lesson.title) + '</h3>' +
        '<div class="nd-lesson-meta">' +
        '<span>⏱ ' + (lesson.duration || 10) + ' daqiqa</span>' +
        '<span class="nd-xp-chip">⭐ +' + (lesson.xp || 10) + ' XP</span>' +
        '</div>' +
        '<div class="nd-lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(course.name) + ' kurs progressi">' +
        '<span style="width:' + pct + '%"></span>' +
        '</div>' +
        '<span class="nd-lesson-pct">' + pct + '% · ' + done + '/' + total + ' dars</span>' +
        '</div>' +
        '<div class="nd-lesson-cta">' +
        '<button type="button" class="nd-btn nd-btn--primary nd-btn--lg nd-pulse" data-open-lesson data-course="' + esc(course.id) + '" data-lesson="' + esc(lesson.id) + '">' + (started ? '▶ Davom ettirish' : '▶ Boshlash') + '</button>' +
        '</div>' +
        '</div>';
    }

    function renderTests(u) {
      var body = $('#ndTestsBody');
      if (!body) return;
      var total = (u.testResults || []).length;
      var today = (u.testResults || []).filter(function (r) { return isToday(r.timestamp); }).length;
      var goal = nextTestGoal(total);
      var goalHtml = '';
      if (goal) {
        var gp = Math.min(100, Math.round((total / goal.target) * 100));
        goalHtml =
          '<div class="nd-goal-line"><span>Yaqin maqsad</span><span>' + total + '/' + goal.target + ' test</span></div>' +
          '<div class="nd-mini-bar"><span style="width:' + gp + '%"></span></div>';
      } else {
        goalHtml = '<p class="nd-hint">🏆 Barcha test maqsadlari bajarildi!</p>';
      }
      body.innerHTML =
        '<div class="nd-kv"><span class="nd-kv-l">Bugun</span><span class="nd-kv-v">' + today + ' ta test</span></div>' +
        '<div class="nd-kv"><span class="nd-kv-l">Jami</span><span class="nd-kv-v">' + total + ' ta test</span></div>' +
        goalHtml +
        '<button type="button" class="nd-btn nd-btn--ghost" data-goto="tests">Testlarga o‘tish →</button>';
    }

    function renderDuel(u) {
      var body = $('#ndDuelBody');
      if (!body) return;
      var today = (u.duelHistory || []).filter(function (d) { return isToday(d.timestamp); }).length;
      body.innerHTML =
        '<div class="nd-kv"><span class="nd-kv-l">Bugungi duel</span><span class="nd-kv-v">' + today + ' ta</span></div>' +
        '<div class="nd-kv"><span class="nd-kv-l">🏆 G‘alabalar</span><span class="nd-kv-v">' + (u.duelWins || 0) + '</span></div>' +
        '<div class="nd-kv"><span class="nd-kv-l">🎮 Jami duel</span><span class="nd-kv-v">' + (u.duelTotal || 0) + '</span></div>' +
        '<button type="button" class="nd-btn nd-btn--ghost" data-goto="duel">Duel o‘ynash →</button>';
    }

    function renderChallenge(u, store) {
      var body = $('#ndChallengeBody');
      var card = $('#ndChallengeCard');
      if (!body) return;
      var ch = challengeOf(store);
      if (!ch) { body.innerHTML = '<p class="nd-hint">Challenge hali tayyor emas.</p>'; return; }
      if (card) card.classList.toggle('nd-card--done', ch.done);
      if (ch.done) {
        try { if (window.ITMascot && window.ITMascot.setStateIn) window.ITMascot.setStateIn($('#ndHeroRobot'), 'success'); }
        catch (e) { /* robot ixtiyoriy */ }
      }
      body.innerHTML =
        '<p class="nd-challenge-task">' +
        esc(ch.course.name) + ' kursida <b>' + ch.lesson.number + '-darsni yakunlang:</b><br>' +
        '<span class="nd-challenge-title">“' + esc(ch.lesson.title) + '”</span>' +
        '</p>' +
        '<div class="nd-challenge-meta">' +
        '<span class="nd-xp-chip">⭐ +' + (ch.lesson.xp || 10) + ' XP</span>' +
        '<span>⏱ ' + (ch.lesson.duration || 10) + ' daqiqa</span>' +
        '</div>' +
        (ch.done
          ? '<p class="nd-hint nd-hint--ok">✅ Bugungi challenge bajarildi — ajoyib!</p>'
          : '<button type="button" class="nd-btn nd-btn--warning" data-open-lesson data-course="' + esc(ch.course.id) + '" data-lesson="' + esc(ch.lesson.id) + '">Challenge’ni boshlash →</button>');
    }

    function renderStats(u) {
      var body = $('#ndStatsBody');
      if (!body) return;
      body.innerHTML =
        '<button type="button" class="nd-stat" data-goto="achievements" aria-label="XP — Yutuqlar sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">⭐</span><b>' + (u.points || 0) + '</b><span>XP</span></button>' +
        '<span class="nd-stat-sep" aria-hidden="true"></span>' +
        '<button type="button" class="nd-stat" data-goto="profile" aria-label="Streak — Profil sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">🔥</span><b>' + (u.streak || 0) + '</b><span>kun</span></button>' +
        '<span class="nd-stat-sep" aria-hidden="true"></span>' +
        '<button type="button" class="nd-stat" data-goto="achievements" aria-label="Yutuqlar sahifasiga o‘tish">' +
        '<span class="nd-stat-ico" aria-hidden="true">🏆</span><b>' + (u.achievements || []).length + '</b><span>yutuq</span></button>';
    }

    function renderNextGoal(u) {
      var body = $('#ndGoalBody');
      if (!body) return;
      var lvl = u.level || 1;
      var base = (u.xp || 0) % 100;
      var left = 100 - base;
      body.innerHTML =
        '<div class="nd-goal-top"><span class="nd-goal-lvl">Level ' + lvl + ' → ' + (lvl + 1) + '</span>' +
        '<span class="nd-goal-xp">' + base + '/100 XP</span></div>' +
        '<div class="nd-goal-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + base + '" aria-label="Keyingi level XP progressi"><span style="width:' + base + '%"></span></div>' +
        '<p class="nd-hint">' + (left > 0 ? 'Level ' + (lvl + 1) + ' gacha yana <b>' + left + ' XP</b>' : '🎉 Level ' + (lvl + 1) + ' juda yaqin — davom eting!') + '</p>';
    }

    function renderActivity(u, store) {
      var body = $('#ndActivityBody');
      if (!body) return;
      var items = activityFeed(u, store);
      if (!items.length) {
        body.innerHTML =
          '<div class="nd-empty nd-empty--row">' +
          '<div class="nd-empty-ico" aria-hidden="true">🌱</div>' +
          '<div><h3>Hali faoliyat yo‘q.</h3><p>Birinchi darsni boshlang.</p></div>' +
          '<button type="button" class="nd-btn nd-btn--primary" data-goto="lessons">📚 Darslarga o‘tish</button>' +
          '</div>';
        return;
      }
      body.innerHTML = '<ul class="nd-feed">' + items.map(function (it) {
        var d = new Date(it.ts);
        var hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        var dateStr = d.getDate() + '/' + (d.getMonth() + 1) + (isToday(it.ts) ? ' · bugun' : '');
        return '<li class="nd-feed-item"><span class="nd-feed-ico" aria-hidden="true">' + it.ico + '</span>' +
          '<span class="nd-feed-text"><b>' + esc(it.text) + '</b><span>' + esc(it.sub) + '</span></span>' +
          '<span class="nd-feed-time">' + dateStr + ' ' + hm + '</span></li>';
      }).join('') + '</ul>';
    }

    /* So'nggi natijalar — in-page statistika (oxirgi 5 real test natijasi).
       Alovida Results page yo'q: faqat dashboard kartasi ko'rsatiladi. */
    function renderRecent(u) {
      var body = $('#recentResults');
      if (!body) return;
      var recent = (u.testResults || []).slice().sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); }).slice(0, 5);
      if (!recent.length) {
        body.innerHTML =
          '<div class="nd-empty">' +
          '<div class="nd-empty-ico" aria-hidden="true">📝</div>' +
          '<h3>Hali test ishlanmagan</h3>' +
          '<p>Testlarni boshlash uchun Testlar sahifasiga o‘ting</p>' +
          '<button type="button" class="nd-btn nd-btn--ghost" data-goto="tests">Testlarga o‘tish →</button>' +
          '</div>';
        return;
      }
      var subjects = (window.__itGetSubjects && typeof window.__itGetSubjects === 'function') ? window.__itGetSubjects() : [];
      body.innerHTML = '<ul class="nd-feed">' + recent.map(function (r) {
        var d = new Date(r.timestamp);
        var dateStr = d.getDate() + '/' + (d.getMonth() + 1) + (isToday(r.timestamp) ? ' · bugun' : '');
        var ico = '📝';
        for (var i = 0; i < subjects.length; i++) {
          if (subjects[i].name === r.subject && subjects[i].icon) { ico = subjects[i].icon; break; }
        }
        var state = r.passed ? '✅ O‘tdi' : '❌ O‘tmadi';
        return '<li class="nd-feed-item">' +
          '<span class="nd-feed-ico" aria-hidden="true">' + ico + '</span>' +
          '<span class="nd-feed-text"><b>' + esc(r.subject) + ' · ' + esc(r.title || 'Test') + '</b>' +
          '<span>' + esc(state) + ' · ' + (r.score || 0) + '/' + (r.total || 0) + ' · ' + (r.percent || 0) + '%</span></span>' +
          '<span class="nd-feed-time">' + dateStr + '</span></li>';
      }).join('') + '</ul>';
    }

    /* ================== EVENTS / ANIMATSIYA / RENDER ================== */

    var bound = false;
    function bindRoot() {
      if (bound) return;
      var root = $('#ndRoot');
      if (!root) return;
      bound = true;
      root.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-goto],[data-open-lesson]');
        if (!btn) return;
        if (btn.hasAttribute('data-open-lesson')) {
          var cid = btn.getAttribute('data-course');
          var lid = btn.getAttribute('data-lesson');
          if (cid && lid && window.Lessons && typeof window.Lessons.openLesson === 'function') {
            try { window.Lessons.openLesson(cid, lid); return; } catch (err) { /* fallback */ }
          }
          if (window.__itShowPage) window.__itShowPage('lessons');
          return;
        }
        var page = btn.getAttribute('data-goto');
        if (page === '#challenge') {
          var ch = $('#ndChallengeCard');
          if (ch) {
            ch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ch.classList.remove('nd-flash');
            void ch.offsetWidth;
            ch.classList.add('nd-flash');
          }
          return;
        }
        if (window.__itShowPage) window.__itShowPage(page);
      });
    }

    function nextFrame(fn) {
      if (typeof window.requestAnimationFrame === 'function') {
        try { window.requestAnimationFrame(fn); return; } catch (e) { /* fallback */ }
      }
      setTimeout(fn, 16);
    }

    function animateIn() {
      var els = document.querySelectorAll('#ndRoot .nd-reveal');
      els.forEach(function (el, i) {
        el.classList.remove('nd-in');
        el.style.transitionDelay = (i * 55) + 'ms';
        var ring = el.querySelector ? el.querySelector('.nd-ring-fill') : null;
        if (ring) {
          var target = ring.getAttribute('data-off');
          ring.style.strokeDashoffset = '';
          nextFrame(function () {
            nextFrame(function () {
              ring.style.strokeDashoffset = target;
            });
          });
        }
      });
      nextFrame(function () {
        nextFrame(function () {
          els.forEach(function (el) { el.classList.add('nd-in'); });
        });
      });
    }

    function render() {
      var u = currentUser();
      if (!u) return;
      bindRoot();
      var store = lessonsStore();
      renderHero(u);
      renderHeroRobot();
      renderToday(u, store);
      renderStreak(u);
      renderLesson(u, store);
      renderTests(u);
      renderDuel(u);
      renderChallenge(u, store);
      renderStats(u);
      renderNextGoal(u);
      renderActivity(u, store);
      renderRecent(u);
      animateIn();
    }

    window.ITDashboard = { render: render };
  })();

  /* --- mobile.js --- */
  /* ============================================================
     ITTest — Android Mobile UI (mobile.js)
     Faqat mobil dashboard (hero, statistika, kurslar) + drawer ESC.
     Mavjud funksiyalar/IDlar bilan konflikt qilmaydi.
     ============================================================ */
  (function () {
    const STORE_PREFIX = 'darslar_state_v1';

    let activeCat = 'all';

    const CATEGORY_MAP = {
      frontend: ['html', 'css', 'javascript', 'react'],
      backend: ['sql', 'nodejs'],
      dasturlash: ['python', 'java', 'cpp', 'csharp'],
      ai: ['ai'],
      boshqa: []
    };

    function $(sel) { return document.querySelector(sel); }

    function who() {
      let u = null;
      try { u = window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; } catch (e) { /* noop */ }
      return String((u && (u.username || u.email)) || 'guest').toLowerCase();
    }

    function loadProgress() {
      let store = null;
      try {
        const raw = localStorage.getItem(STORE_PREFIX + '::' + who());
        store = raw ? JSON.parse(raw) : null;
      } catch (e) { store = null; }
      return (store && store.progress) ? store.progress : {};
    }

    function completedOf(courseId, progress) {
      const p = progress[courseId];
      return (p && p.completed) ? Object.keys(p.completed).length : 0;
    }

    function courseCategory(id) {
      for (const cat in CATEGORY_MAP) {
        if (CATEGORY_MAP[cat].indexOf(id) !== -1) return cat;
      }
      return 'boshqa';
    }

    function xpValue() {
      const el = $('#statXp');
      if (el) {
        const n = parseInt(String(el.textContent).replace(/\D/g, ''), 10);
        if (!isNaN(n)) return n;
      }
      return 0;
    }

    function streakValue() {
      let u = null;
      try { u = window.__itGetCurrentUser ? window.__itGetCurrentUser() : null; } catch (e) { /* noop */ }
      return (u && u.streak) ? u.streak : 0;
    }

    function coursesList() {
      if (window.CoursesAPI && typeof window.CoursesAPI.listCourses === 'function') {
        try { return window.CoursesAPI.listCourses() || []; } catch (e) { return []; }
      }
      return [];
    }

    function renderHero(courses, progress) {
      const titleEl = $('#mHeroCourse');
      const lessonEl = $('#mHeroLesson');
      const fillEl = $('#mHeroFill');
      const pctEl = $('#mHeroPct');
      const btn = $('#mHeroBtn');
      if (!titleEl || !btn) return;

      // eng ko'p progressli kursni top (yoki birinchi kurs)
      let target = null, bestPct = -1;
      courses.forEach(c => {
        const total = (c.lessons || []).length;
        if (!total) return;
        const pct = Math.round((completedOf(c.id, progress) / total) * 100);
        if (pct > bestPct) { bestPct = pct; target = c; }
      });
      if (!target && courses.length) target = courses.find(c => (c.lessons || []).length > 0) || courses[0];
      if (!target) return;

      const total = (target.lessons || []).length;
      const done = completedOf(target.id, progress);
      const pct = total ? Math.round((done / total) * 100) : 0;

      titleEl.textContent = target.name || target.id;
      lessonEl.textContent = target.tagline || '';
      if (fillEl) fillEl.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '% (' + done + '/' + total + ')';
      btn.dataset.course = target.id;
    }

    function renderStats(courses, progress) {
      let totalLessons = 0, totalDone = 0;
      courses.forEach(c => {
        totalLessons += (c.lessons || []).length;
        totalDone += completedOf(c.id, progress);
      });
      const set = (id, v) => { const el = $(id); if (el) el.textContent = String(v); };
      set('#mStatLessons', totalLessons);
      set('#mStatDone', totalDone);
      set('#mStatStreak', streakValue());
      set('#mStatXp', xpValue());
    }

    function renderCourses(courses, progress) {
      const cont = $('#mCourses');
      if (!cont) return;
      const list = courses.filter(c => activeCat === 'all' || courseCategory(c.id) === activeCat);

      cont.innerHTML = list.map(c => {
        const total = (c.lessons || []).length;
        const done = completedOf(c.id, progress);
        const pct = total ? Math.round((done / total) * 100) : 0;
        const doneTxt = done > 0 ? '<span>✅ ' + done + ' tugallangan</span>' : '';
        return (
          '<div class="m-course-card" data-course="' + c.id + '" role="button" tabindex="0">' +
          '<div class="m-course-icon">' + (c.icon || '📘') + '</div>' +
          '<div class="m-course-body">' +
          '<span class="m-course-title">' + (c.name || c.id) + '</span>' +
          '<span class="m-course-desc">' + (c.tagline || '') + '</span>' +
          '<div class="m-course-meta"><span>📚 ' + total + ' ta dars</span>' + doneTxt + '</div>' +
          '<div class="m-course-progress"><span style="width:' + pct + '%"></span></div>' +
          '<span class="m-course-pct" style="font-size:11px;color:#8f8aa8">' + pct + '%</span>' +
          '</div>' +
          '<div class="m-course-arrow">→</div>' +
          '</div>'
        );
      }).join('');

      cont.querySelectorAll('.m-course-card').forEach(card => {
        card.addEventListener('click', () => openCourse(card.dataset.course));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCourse(card.dataset.course); }
        });
      });
    }

    function openCourse(id) {
      if (window.Lessons && typeof window.Lessons.openCourse === 'function') {
        try { window.Lessons.openCourse(id); return; } catch (e) { /* fallback */ }
      }
      if (window.__itShowPage) window.__itShowPage('lessons');
    }

    function renderDashboard() {
      const dash = $('#mDash');
      if (!dash) return;
      const courses = coursesList();
      const progress = loadProgress();
      renderHero(courses, progress);
      renderStats(courses, progress);
      renderCourses(courses, progress);
    }

    function bindChips() {
      const chips = $('#mChips');
      if (!chips || chips.dataset.bound) return;
      chips.dataset.bound = '1';
      chips.addEventListener('click', (e) => {
        const chip = e.target.closest('.m-chip');
        if (!chip) return;
        chips.querySelectorAll('.m-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat') || 'all';
        renderDashboard();
      });
    }

    function bindExtras() {
      const allBtn = $('#mAllCourses');
      if (allBtn && !allBtn.dataset.bound) {
        allBtn.dataset.bound = '1';
        allBtn.addEventListener('click', () => {
          if (window.__itShowPage) window.__itShowPage('lessons');
        });
      }
      const heroBtn = $('#mHeroBtn');
      if (heroBtn && !heroBtn.dataset.bound) {
        heroBtn.dataset.bound = '1';
        heroBtn.addEventListener('click', () => openCourse(heroBtn.dataset.course));
      }
      // ESC — drawer yopish
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const sidebar = $('#sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
          const close = $('#sidebarClose');
          if (close) close.click();
        }
      });
    }

    window.MobileUI = { renderDashboard: renderDashboard };

    function init() {
      bindChips();
      bindExtras();
      setTimeout(renderDashboard, 400);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();


  /* --- ai-assistant.js --- */
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
        return {
          ctx, items: colors.filter(c => c[0].indexOf(p) === 0).slice(0, 8)
            .map(c => makeSug(c[0], c[1], c[0] + '|', pos - p.length, null))
        };
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














  /* --- onboarding.js --- */
  /* ==========================================================
     ITTest — YANGI FOYDALANUVCHI ONBOARDING (5 bosqich)
     Bosqichma-bosqich tanlovlar — ITTest original dizayni bilan
     (dark + cyan/indigo accent, Duolingo nusxasi emas).
     Flow: Ro'yxatdan o'tish → Onboarding → Darslar → Kurs → Lesson Path
     - State: localStorage (user id bo'yicha) → refreshda davom etadi
     - FAQAT onboardingPending belgisi bor userga ko'rinadi
     - Tugagach: LOGIN → DASHBOARD (qaytib chiqmaydi)
     ========================================================== */

  (() => {
    'use strict';

    /* ====================== MA'LUMOTLAR ====================== */

    const STEPS = [
      {
        key: 'track',
        title: 'Siz nimani o‘rganmoqchisiz?',
        sub: 'Sizga qiziq yo‘nalishni tanlang.',
        options: [
          { id: 'web', icon: '🌐', label: 'Web dasturlash', desc: 'HTML • CSS • JavaScript' },
          { id: 'python', icon: '🐍', label: 'Python', desc: 'Boshlang‘ichdan loyiha' },
          { id: 'javascript', icon: '⚡', label: 'JavaScript', desc: 'Web va interaktivlik' },
          { id: 'java', icon: '☕', label: 'Java', desc: 'Backend va OOP' },
          { id: 'cpp', icon: '💻', label: 'C++', desc: 'Algoritmlar va dasturlash' },
          { id: 'ai', icon: '🤖', label: 'AI', desc: 'Sun’iy intellekt' }
        ]
      },
      {
        key: 'level',
        title: 'Dasturlash bo‘yicha tajribangiz qanday?',
        sub: 'Halol javob — yo‘l aynan shunga qarab tuziladi.',
        options: [
          { id: 'beginner', icon: '🌱', label: 'Men endi boshlayapman', desc: 'Hech qachon kod yozmaganman.' },
          { id: 'some', icon: '📘', label: 'Biroz bilaman', desc: 'HTML/CSS yoki boshqa narsalarni ko‘rganman.' },
          { id: 'mid', icon: '📊', label: 'O‘rtacha', desc: 'Oddiy loyihalar qila olaman.' },
          { id: 'good', icon: '🚀', label: 'Yaxshi bilaman', desc: 'Mustaqil loyihalar qilganman.' }
        ]
      },
      {
        key: 'reason',
        title: 'Nima uchun dasturlashni o‘rganyapsiz?',
        sub: 'Motivatsiyangizni bilmoqchiman.',
        options: [
          { id: 'career', icon: '💼', label: 'Kasb o‘rganish uchun' },
          { id: 'job', icon: '🔎', label: 'Ish topish uchun' },
          { id: 'project', icon: '🚀', label: 'O‘z loyihamni yaratish uchun' },
          { id: 'study', icon: '🎓', label: 'O‘qish uchun' },
          { id: 'income', icon: '💰', label: 'Daromad qilish uchun' },
          { id: 'fun', icon: '❤️', label: 'Shunchaki qiziqaman' }
        ]
      },
      {
        key: 'daily',
        title: 'Kuniga qancha vaqt ajrata olasiz?',
        sub: 'Bu kundalik maqsadingiz sifatida saqlanadi.',
        options: [
          { id: '5', icon: '⏱', label: '5 daqiqa', desc: 'Yengil' },
          { id: '10', icon: '⏱', label: '10 daqiqa', desc: 'Oddiy' },
          { id: '15', icon: '⏱', label: '15 daqiqa', desc: 'Barqaror' },
          { id: '30', icon: '⏱', label: '30 daqiqa', desc: 'Jiddiy' },
          { id: '60', icon: '⏱', label: '1 soat+', desc: 'Intensiv' }
        ]
      },
      {
        key: 'goal',
        title: 'Maqsadingiz nima?',
        sub: 'Oxirgi bosqich — shaxsiy o‘quv yo‘lingiz tayyorlanadi.',
        options: [
          { id: 'beginner_dev', icon: '🌱', label: 'Boshlang‘ich dasturchi bo‘lish' },
          { id: 'first_site', icon: '🌐', label: 'Birinchi sayt yaratish' },
          { id: 'frontend', icon: '🎨', label: 'Frontend Developer bo‘lish' },
          { id: 'backend', icon: '🖥️', label: 'Backend Developer bo‘lish' },
          { id: 'fullstack', icon: '🚀', label: 'Full Stack Developer bo‘lish' },
          { id: 'mobile', icon: '📱', label: 'Mobil ilova yaratish' },
          { id: 'ai_work', icon: '🤖', label: 'AI bilan ishlash' },
          { id: 'job_ready', icon: '💼', label: 'Ishga tayyorlanish' }
        ]
      }
    ];

    /* Tanlangan track → mavjud course ID mapping (CoursesAPI bilan tekshiriladi) */
    const TRACK_COURSE = { web: 'html', python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp', ai: 'ai' };

    const LEVEL_LABEL = {
      beginner: 'Boshlang‘ich daraja',
      some: 'Biroz tajriba',
      mid: 'O‘rtacha daraja',
      good: 'Yaxshi daraja'
    };
    const DAILY_LABEL = {
      '5': 'Kuniga 5 daqiqa', '10': 'Kuniga 10 daqiqa', '15': 'Kuniga 15 daqiqa',
      '30': 'Kuniga 30 daqiqa', '60': 'Kuniga 1 soat+'
    };

    const SPEECH = {
      1: 'Salom! 👋 Birga tanlaymiz.',
      2: 'O‘ylab ko‘ramiz… 🤔',
      3: 'Maqsadingiz muhim! 💡',
      4: 'Kunlik rejim qiziq! ⏱',
      5: 'Oxirgi qadam! 🎯',
      6: 'Zo‘r! 🎉 Tayyor!'
    };
    const MASCOT_STATE = { 1: 'idle', 2: 'thinking', 3: 'idle', 4: 'thinking', 5: 'idle', 6: 'complete' };

    /* ====================== HOLAT ====================== */

    const TOTAL = STEPS.length; // 5
    const FINAL = TOTAL + 1;    // 6 — yakuniy ekran

    let S = { step: 1, answers: {}, completed: false };
    let userRef = null;
    let built = false;
    let dom = {};

    const $ = (sel, root) => (root || document).querySelector(sel);

    function reducedMotion() {
      try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
      catch (e) { return false; }
    }

    function stateKey(u) {
      return 'ittest_onboarding_v1::' + ((u && (u.id || u.username)) || 'anon');
    }

    function loadState(u) {
      try {
        const raw = localStorage.getItem(stateKey(u));
        if (!raw) return null;
        const st = JSON.parse(raw);
        if (!st || typeof st !== 'object') return null;
        return { step: Number(st.step) || 1, answers: st.answers || {}, completed: !!st.completed };
      } catch (e) { return null; }
    }

    function saveState() {
      if (!userRef) return;
      try { localStorage.setItem(stateKey(userRef), JSON.stringify(S)); } catch (e) { /* noop */ }
    }

    function pendingFlag(u) {
      return !!(u && u.onboardingPending === true);
    }

    /* ====================== KURS ANIQLASH ====================== */

    function resolveCourse(track) {
      const api = window.CoursesAPI;
      let id = TRACK_COURSE[track] || 'html';
      const exists = (cid) => {
        try { return !!(api && typeof api.getCourse === 'function' && api.getCourse(cid)); }
        catch (e) { return false; }
      };
      if (!exists(id)) {
        id = 'html';
        if (!exists(id)) {
          try {
            const list = (api && typeof api.listCourses === 'function' && api.listCourses()) || [];
            id = (list[0] && list[0].id) || null;
          } catch (e) { id = null; }
        }
      }
      return id;
    }

    /* ====================== DOM QURISH ====================== */

    function build() {
      if (built) return;
      const root = $('#onboardingRoot');
      if (!root) return;

      root.innerHTML = [
        '<div class="ob-bg" aria-hidden="true">',
        '  <span class="ob-orb ob-orb-1"></span>',
        '  <span class="ob-orb ob-orb-2"></span>',
        '  <span class="ob-orb ob-orb-3"></span>',
        '</div>',
        '<div class="ob-shell" role="dialog" aria-modal="true" aria-label="ITTest onboarding">',
        '  <header class="ob-header">',
        '    <button type="button" class="ob-back" id="obBack" aria-label="Oldingi bosqich" hidden>←</button>',
        '    <div class="ob-logo" aria-hidden="true">🧠 <span>IT<b>Test</b></span></div>',
        '    <div class="ob-step" id="obStep">1 / 5</div>',
        '    <button type="button" class="ob-skip" id="obSkip">Keyinroq</button>',
        '  </header>',
        '  <div class="ob-progress" role="progressbar" aria-valuemin="0" aria-valuemax="5" aria-valuenow="1">',
        '    <span class="ob-progress-fill" id="obFill"></span>',
        '  </div>',
        '  <div class="ob-body">',
        '    <aside class="ob-side" aria-hidden="true">',
        '      <div class="ob-mascot-host" id="obMascot"></div>',
        '      <div class="ob-speech" id="obSpeech"></div>',
        '    </aside>',
        '    <div class="ob-stage" id="obStage"></div>',
        '  </div>',
        '  <footer class="ob-footer">',
        '    <p class="ob-error" id="obError" role="alert" hidden></p>',
        '    <button type="button" class="ob-cta" id="obCta" disabled>Davom etish →</button>',
        '  </footer>',
        '</div>'
      ].join('');

      dom = {
        root: root,
        shell: $('.ob-shell', root),
        back: $('#obBack', root),
        step: $('#obStep', root),
        skip: $('#obSkip', root),
        progress: $('.ob-progress', root),
        fill: $('#obFill', root),
        mascotHost: $('#obMascot', root),
        speech: $('#obSpeech', root),
        stage: $('#obStage', root),
        error: $('#obError', root),
        cta: $('#obCta', root)
      };

      dom.back.addEventListener('click', function () { go(S.step - 1); });
      dom.skip.addEventListener('click', finishSkip);
      dom.cta.addEventListener('click', onCta);

      built = true;
    }

    /* ====================== RENDER ====================== */

    function swapScreen(builder) {
      const old = dom.stage.querySelector('.ob-screen');
      const screen = document.createElement('div');
      screen.className = 'ob-screen';
      builder(screen);
      if (old) {
        if (reducedMotion()) { old.remove(); }
        else {
          old.classList.add('ob-out');
          setTimeout(function () { if (old.parentNode) old.remove(); }, 420);
        }
      }
      dom.stage.appendChild(screen);
    }

    function choiceButton(opt, key) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ob-choice';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', S.answers[key] === opt.id ? 'true' : 'false');
      if (S.answers[key] === opt.id) b.classList.add('selected');

      const icon = document.createElement('span');
      icon.className = 'ob-choice-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = opt.icon;

      const text = document.createElement('span');
      text.className = 'ob-choice-text';
      const label = document.createElement('strong');
      label.textContent = opt.label;
      text.appendChild(label);
      if (opt.desc) {
        const small = document.createElement('small');
        small.textContent = opt.desc;
        text.appendChild(small);
      }

      const check = document.createElement('span');
      check.className = 'ob-choice-check';
      check.setAttribute('aria-hidden', 'true');
      check.textContent = '✓';

      b.appendChild(icon);
      b.appendChild(text);
      b.appendChild(check);
      b.addEventListener('click', function () { select(key, opt.id); });
      return b;
    }

    function select(key, id) {
      S.answers[key] = id;
      saveState();
      dom.stage.querySelectorAll('.ob-screen [role="radio"]').forEach(function (r) {
        const isSel = r.dataset.opt === (key + ':' + id);
        r.classList.toggle('selected', isSel);
        r.setAttribute('aria-checked', isSel ? 'true' : 'false');
      });
      dom.cta.disabled = false;
      hideError();
      syncWebNote();
    }

    function syncWebNote() {
      const note = dom.stage.querySelector('.ob-webnote');
      if (note) note.hidden = S.answers.track !== 'web';
    }

    function renderQuestion(screen, idx) {
      const def = STEPS[idx - 1];

      const mini = document.createElement('div');
      mini.className = 'ob-mini-mascot';
      mini.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h2');
      title.className = 'ob-title';
      title.textContent = def.title;

      const sub = document.createElement('p');
      sub.className = 'ob-sub';
      sub.textContent = def.sub;

      const grid = document.createElement('div');
      grid.className = 'ob-choices ob-choices--' + def.key;
      grid.setAttribute('role', 'radiogroup');
      grid.setAttribute('aria-label', def.title);

      def.options.forEach(function (opt) {
        const b = choiceButton(opt, def.key);
        b.dataset.opt = def.key + ':' + opt.id;
        grid.appendChild(b);
      });

      screen.appendChild(mini);
      screen.appendChild(title);
      screen.appendChild(sub);
      screen.appendChild(grid);

      if (def.key === 'track') {
        const note = document.createElement('p');
        note.className = 'ob-webnote';
        note.hidden = S.answers.track !== 'web';
        note.textContent = '🌐 Web tanlandingiz — yo‘l HTML, CSS va JavaScript asosida tuziladi.';
        screen.appendChild(note);
      }

      if (window.ITMascot) window.ITMascot.inject(mini, MASCOT_STATE[idx] || 'idle');
    }

    function renderFinal(screen) {
      const mini = document.createElement('div');
      mini.className = 'ob-mini-mascot';
      mini.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h2');
      title.className = 'ob-title ob-title--final';
      title.textContent = 'Zo‘r! 🎉';

      const sub = document.createElement('p');
      sub.className = 'ob-sub';
      sub.textContent = 'Siz uchun shaxsiy o‘quv yo‘li tayyorlandi.';

      const card = document.createElement('div');
      card.className = 'ob-summary';

      const a = S.answers;
      const trackOpt = STEPS[0].options.find(function (o) { return o.id === a.track; }) || { icon: '📚', label: 'Yo‘nalish' };
      const goalOpt = STEPS[4].options.find(function (o) { return o.id === a.goal; }) || null;

      const rows = [
        { icon: trackOpt.icon, text: trackOpt.label },
        { icon: '🌱', text: LEVEL_LABEL[a.level] || 'Boshlang‘ich daraja' },
        { icon: '⏱', text: DAILY_LABEL[a.daily] || 'Kuniga 10 daqiqa' }
      ];
      if (goalOpt) rows.push({ icon: '🎯', text: 'Maqsad: ' + goalOpt.label });

      rows.forEach(function (r) {
        const row = document.createElement('div');
        row.className = 'ob-summary-row';
        const ic = document.createElement('span');
        ic.className = 'ob-summary-ico';
        ic.setAttribute('aria-hidden', 'true');
        ic.textContent = r.icon;
        const tx = document.createElement('span');
        tx.className = 'ob-summary-text';
        tx.textContent = r.text;
        row.appendChild(ic);
        row.appendChild(tx);
        card.appendChild(row);
      });

      screen.appendChild(mini);
      screen.appendChild(title);
      screen.appendChild(sub);
      screen.appendChild(card);

      if (window.ITMascot) window.ITMascot.inject(mini, 'complete');
    }

    function render() {
      const clamped = Math.min(Math.max(S.step, 1), FINAL);
      const isFinal = clamped >= FINAL;
      const shown = isFinal ? TOTAL : clamped;

      dom.back.hidden = clamped === 1;
      dom.skip.hidden = isFinal;
      dom.step.textContent = shown + ' / ' + TOTAL;
      dom.progress.setAttribute('aria-valuenow', String(shown));
      dom.fill.style.width = (shown / TOTAL * 100) + '%';

      dom.speech.textContent = SPEECH[clamped] || '';
      if (dom.mascotHost && window.ITMascot) {
        const m = dom.mascotHost.querySelector(':scope > .mascot');
        if (m) window.ITMascot.setState(m, MASCOT_STATE[clamped] || 'idle');
        else window.ITMascot.inject(dom.mascotHost, MASCOT_STATE[clamped] || 'idle');
      }

      if (isFinal) {
        dom.cta.textContent = '🚀 Darslarni boshlash';
        dom.cta.disabled = !S.answers.track;
        swapScreen(renderFinal);
        if (window.__itConfetti) { try { window.__itConfetti(); } catch (e) { /* noop */ } }
      } else {
        dom.cta.textContent = 'Davom etish →';
        dom.cta.disabled = !S.answers[STEPS[clamped - 1].key];
        swapScreen(function (screen) { renderQuestion(screen, clamped); });
      }
      hideError();
    }

    /* ====================== NAVIGATSIYA ====================== */

    function go(step) {
      const next = Math.min(Math.max(step, 1), FINAL);
      if (next === S.step) return;
      S.step = next;
      saveState();
      render();
    }

    function onCta() {
      if (S.step >= FINAL) { startLessons(); return; }
      const key = STEPS[S.step - 1].key;
      if (!S.answers[key]) { showError('Iltimos, avval bir variantni tanlang.'); return; }
      go(S.step + 1);
    }

    function finishSkip() {
      /* Foydalanuvchi o'tkazib yubordi — flag tozalanadi, qayta chiqmaydi */
      S.completed = true;
      saveState();
      completeUserFlag();
      hide();
    }

    function startLessons() {
      if (!S.answers.track) {
        showError('Yo‘nalish tanlanmagan — 1-bosqichga qaytib tanlang.');
        go(1);
        return;
      }
      S.completed = true;
      saveState();
      completeUserFlag();
      hide();

      /* 🎯 DARHOL tanlangan kursning Lesson Path sahifasiga o'tamiz */
      const courseId = resolveCourse(S.answers.track);
      if (courseId && window.Lessons && typeof window.Lessons.openCourse === 'function') {
        try { window.Lessons.openCourse(courseId); return; }
        catch (e) { console.warn('openCourse xatosi:', e); }
      }
      if (window.__itShowPage) window.__itShowPage('lessons');
    }

    function completeUserFlag() {
      try {
        if (typeof window.__itOnboardingFinish === 'function') window.__itOnboardingFinish();
        else if (userRef) { delete userRef.onboardingPending; userRef.onboardingCompleted = true; }
      } catch (e) { console.warn('onboarding flag:', e); }
    }

    function showError(msg) {
      if (!dom.error) return;
      dom.error.textContent = msg;
      dom.error.hidden = false;
    }

    function hideError() {
      if (dom.error) { dom.error.hidden = true; dom.error.textContent = ''; }
    }

    /* ====================== OPEN / CLOSE ====================== */

    function open() {
      if (!userRef) return false;
      build();
      if (!built) return false;

      const saved = loadState(userRef);
      S = saved && !saved.completed
        ? { step: Math.min(Math.max(saved.step, 1), FINAL), answers: saved.answers || {}, completed: false }
        : { step: 1, answers: {}, completed: false };
      saveState();

      dom.root.hidden = false;
      dom.root.classList.add('open');
      document.body.classList.add('ob-lock');
      render();
      return true;
    }

    function hide() {
      if (!built) return;
      dom.root.hidden = true;
      dom.root.classList.remove('open');
      document.body.classList.remove('ob-lock');
    }

    function maybeStart(u) {
      if (!u || !pendingFlag(u)) return false;
      const saved = loadState(u);
      if (saved && saved.completed) {
        completeUserFlag();
        return false;
      }
      userRef = u;
      return open();
    }

    function reset() {
      if (userRef) {
        try { localStorage.removeItem(stateKey(userRef)); } catch (e) { /* noop */ }
        userRef.onboardingPending = true;
      }
      S = { step: 1, answers: {}, completed: false };
      return open();
    }

    function isActive() {
      return !!(built && dom.root && !dom.root.hidden);
    }

    /* Onboarding majburiy o'tiladigan oqim — Esc bilan yopilmaydi, "Keyinroq" tugmasi bor */

    window.ITOnboarding = { maybeStart: maybeStart, open: open, hide: hide, reset: reset, isActive: isActive };
  })();




  /* --- script.js --- */
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

  async function loadQuestionBankFromBackend() {
    try {
      const res = await fetch('/api/tests/questions');
      if (!res.ok) return;
      const questions = await res.json();
      if (!Array.isArray(questions) || !questions.length) return;

      for (const item of questions) {
        const sbj = item.subject;
        const diff = item.difficulty || 'beginner';
        if (!Q_BANK[sbj]) {
          Q_BANK[sbj] = { beginner: [], intermediate: [], advanced: [] };
        }
        if (!Q_BANK[sbj][diff]) Q_BANK[sbj][diff] = [];
        
        // Dublikat bo'lmasa qo'shamiz
        const exists = Q_BANK[sbj][diff].some(x => (x.q || x.question) === (item.q || item.question));
        if (!exists) {
          Q_BANK[sbj][diff].push({
            q: item.q || item.question,
            o: item.o || item.options,
            c: item.c !== undefined ? item.c : item.answer,
            e: item.e || item.explanation
          });
        }
      }

      if (typeof rebuildAllTests === 'function' && typeof ALL_TESTS !== 'undefined') {
        const rebuilt = rebuildAllTests();
        for (const k of Object.keys(rebuilt)) ALL_TESTS[k] = rebuilt[k];
        console.log('ALL_TESTS rebuilt after backend test questions sync.');
      }
    } catch (_) {}
  }

  loadQuestionBank();
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(loadQuestionBankFromBackend, 120);
    });
  }

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

    function showAuthScreen() {
      $("#app").classList.add("hidden");
      $("#authScreen").classList.remove("hidden");
      const loginTab = $(".auth-tab[data-tab='login']");
      if (loginTab) loginTab.click();
    }
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
    if (window.ITOnboarding) {
      try { window.ITOnboarding.hide(); } catch (e) { /* noop */ }
    }
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
    /* 🤖 YANGI FOYDALANUVCHI ONBOARDING — faqat ro'yxatdan o'tgan va hali
       onboardingni tugatmagan userlar uchun (existing userlar darhol dashboardga) */
    if (window.ITOnboarding) {
      try { window.ITOnboarding.maybeStart(currentUser); }
      catch (e) { console.warn("Onboarding start xatosi:", e); }
    }
  }

  /* ====================== ONBOARDING BRIDGE ====================== */
  /* Onboarding tugatilganda / o'tkazib yuborilganda user belgisini tozalash.
     Shu bilan "LOGIN → DASHBOARD" backward-compatible flow saqlanadi. */
  window.__itOnboardingFinish = function () {
    if (!currentUser) return false;
    delete currentUser.onboardingPending;
    currentUser.onboardingCompleted = true;
    saveUsersAndCurrent();
    return true;
  };

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
        store: { inventory: [], equipped: {} },
        onboardingPending: true
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
    /* YANGI DASHBOARD (0 dan qayta qurilgan) — window.ITDashboard.render()
       real user data bilan render qiladi: hero, bugungi progress, streak,
       current lesson, quick actions, test/duel/challenge, XP/goal, activity.
       Eski giant hero, stats-grid, fanlar progressi, chartlar va
       "So'nggi natijalar" paneli Dashboarddan butunlay olib tashlandi. */
    if (window.ITDashboard && typeof window.ITDashboard.render === "function") {
      try {
        window.ITDashboard.render();
        return;
      } catch (e) {
        console.warn("Dashboard render xatosi:", e);
      }
    }
    /* Fallback: dashboard.js moduli hali yuklanmagan bo'lsa — minimal welcome */
    const u = currentUser;
    if (!u) return;
    const nameEl = $("#ndHeroName");
    if (nameEl) nameEl.textContent = u.firstname || u.username || "Foydalanuvchi";
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


  /* --- auth-fx.js --- */
  /* =====================================================================
     ITTEST AUTH — PREMIUM FX
     • Desktop mouse parallax (transform3d, rAF throttled)
     • Binance-style robot "peek" idle animatsiyasi
     • Auth screen tema tugmasi (mavjud theme logic bilan mos)
     Auth logic, formalar, validatsiya — tegilmagan.
     ===================================================================== */

  (function () {
    'use strict';

    const screen = document.getElementById('authScreen');
    if (!screen) return;

    /* Eski WebView / test muhitlari uchun xavfsiz matchMedia wrapper */
    const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: null });
    const prefersReduced = mq('(prefers-reduced-motion: reduce)');
    const finePointer = mq('(pointer: fine)');

    /* ---------- 1. DESKTOP MOUSE PARALLAX ---------- */
    const layers = [
      { el: screen.querySelector('.auth-bg'), depth: 3 },      // fon: 2–4px
      { el: screen.querySelector('.auth-robot'), depth: 8 },   // robot: 5–10px
      { el: screen.querySelector('.auth-chips'), depth: 5 },   // chips: 3–7px
      { el: screen.querySelector('.auth-card'), depth: 1.5 }   // card: 1–2px
    ].filter(l => l.el);

    let rafId = 0;
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;

    function applyParallax() {
      // Yengil lerp — harakat tabiiy va "premium" his qiladi
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      // Mobil breakpointda robot markazlashuvi translateX(-50%) orqali — saqlansin
      const narrow = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
      for (const l of layers) {
        const dx = (curX * l.depth).toFixed(2);
        const dy = (curY * l.depth).toFixed(2);
        if (l.el.classList.contains('auth-robot') && narrow) {
          l.el.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px)`;
        } else {
          l.el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
      }

      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        rafId = requestAnimationFrame(applyParallax);
      } else {
        rafId = 0;
      }
    }

    function onPointerMove(e) {
      if (prefersReduced.matches || !finePointer.matches) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;   // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx;
      targetY = ny;
      if (!rafId) rafId = requestAnimationFrame(applyParallax);
    }

    function enableParallax() {
      if (!finePointer.matches || prefersReduced.matches) return;
      window.addEventListener('mousemove', onPointerMove, { passive: true });
    }

    /* media o'zgarsa (masalan pointer/rezim almashsa) — inline transformlarni
       tozalab, CSS holatiga qaytish */
    finePointer.addEventListener?.('change', () => {
      window.removeEventListener('mousemove', onPointerMove);
      targetX = targetY = curX = curY = 0;
      layers.forEach(l => { l.el.style.transform = ''; });
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      enableParallax();
    });

    /* ---------- 2. ROBOT "PEEK" (Binance uslubi, occasional) ---------- */
    const robot = screen.querySelector('.auth-robot');
    if (robot && !prefersReduced.matches) {
      screen.classList.add('auth-robot-peek');
    }

    /* ---------- 3. AUTH SCREEN THEME TOGGLE ---------- */
    const THEMES = ['dark', 'light'];
    const toggle = document.getElementById('authThemeToggle');

    function applyTheme(theme) {
      if (!THEMES.includes(theme)) theme = 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', JSON.stringify(theme)); } catch (e) { /* noop */ }
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }

    enableParallax();
  })();


})();


  // Admin button visibility check
  async function checkAdminStatus() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const link = document.getElementById('adminPanelLink');
        if (link) link.style.display = 'flex';
      }
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', checkAdminStatus);
  }
