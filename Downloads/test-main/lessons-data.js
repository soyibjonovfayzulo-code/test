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

  const COURSES = [
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
                { code: '<img src="rasm.jpg">', prompt: 'Bu kodda nimani unutdik?', gaps: [
                  { label: 'alt="Rasm tavsifi"', ok: true, hint: '' },
                  { label: 'id="rasm"', ok: false, hint: 'id — shart emas, bu faqat yagona nom beradi' },
                  { label: 'class="rasm"', ok: false, hint: 'class — shart emas, bu guruhlash uchun' }
                ] },
                { code: '<a>Google</a>', prompt: 'Link ishlamayapti! Nima yetishmayapti?', gaps: [
                  { label: 'href="https://google.com"', ok: true, hint: '' },
                  { label: 'target="_blank"', ok: false, hint: 'target — faqat yangi tabda ochish uchun, link ishlashi uchun shart emas' },
                  { label: 'alt="Google"', ok: false, hint: 'alt — rasm atributi, linkda ishlamaydi' }
                ] },
                { code: '<img alt="Kompyuter rasmi">', prompt: 'Rasm ekranda ko‘rinmayapti! Nima yetishmayapti?', gaps: [
                  { label: 'src="kompyuter.jpg"', ok: true, hint: '' },
                  { label: 'href="kompyuter.jpg"', ok: false, hint: 'href — link atributi, rasmda ishlamaydi' },
                  { label: 'title="Rasm"', ok: false, hint: 'title — faqat hover izohi, rasmni yuklamaydi' }
                ] }
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
    raw: COURSES
  };
})();

