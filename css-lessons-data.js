/* ==========================================================
   CSS KURSI — 30 TA TO'LIQ DARS (DATA-ONLY)
   ==========================================================
   Bu fayl FAQAT ma'lumot saqlaydi: window.CSS_LESSONS_DATA
   massivini yaratadi. lessons-data.js bu massivni CSS kursining
   topics sifatida ishlatadi (HTML darslar bilan bir xil sxema).

   Har bir dars tuzilmasi (1-29):
     title, duration, xp,
     content: { intro, reviewTitle, review[], sections[],
                keyPoints[], motivationTitle, motivation,
                quizQuestionCount, exercises[] },
     quiz: { passingScore: 80, questions[] }
   30-dars — Yakuniy LOYIHA (project flow, test o'rniga checklist).

   Section maydonlari: title, text, code, codeNote, result,
   note, playground, liveDemo
   Mashq turlari: liveedit (startCode+checks), detective,
   dragdrop (items)
   ========================================================== */

(function () {
  'use strict';

  window.CSS_LESSONS_DATA = [
    {
      title: 'CSS nima?',
      duration: 20,
      xp: 30,
      content: {
        intro: 'Bu kursda siz web sahifalarga **chiroyli ko‘rinish** beruvchi til — **CSS** bilan tanishasiz. HTML kursida sahifaning tuzilishini yaratgan edik. Endi uni rang, shrift va joylashuv bilan bezamiz! Har bir tushuncha sodda misollar bilan tushuntiriladi, oxirida amaliy topshiriq va test kutib turadi. 🚀',
        reviewTitle: '🔁 ESLAB QOLING — HTML KURSIDAN',
        review: [
          'HTML — sahifaning **tuzilishi**: sarlavha, paragraf, rasm, tugma',
          'Teglar burchakli qavslarda yoziladi: `<p>`, `<h1>`, `<div>`',
          '`class` — ko‘p elementlarga beriladigan **guruh nomi**',
          '`id` — elementning **yagona (unique)** nomi',
          '`<style>` tegi ichida sahifaga stil berish mumkin edi — endi uni chuqur o‘rganamiz!'
        ],
        sections: [
          {
            title: 'CSS nima? 🎨',
            text: '**CSS** (Cascading Style Sheets) — web sahifa elementlarining **ko‘rinishini** boshqaruvchi **uslublash tili**. Rang, shrift, o‘lcham, masofa, joylashuv — hammasi CSS.\n\nNomini parchalab ko‘ramiz:\n• **Cascading** — «kaskadli». Stillar bir-biri ustiga «yog‘iladi»: bir elementga bir nechta qoida tegsa, brauzer aniq ustuvorlik tartibida yechim tanlaydi.\n• **Style** — uslub: matn rangi, fon, chegara, masofa...\n• **Sheets** — varaq (fayl): CSS kodlari odatda alohida `.css` faylda saqlanadi.\n\n⚠️ **Muhim:** CSS ham HTML kabi **dasturlash tili emas** — bu **uslublash tili**. U o‘zgaruvchi yoki mantiqiy operatorlarga ega emas — u elementlarga «qanday ko‘rinish»ni aytadi.',
            note: 'HTML — odamning skeleti, CSS — kiyimi, JavaScript — harakati. Uchtasi birgalikda to‘liq sayt yaratadi.'
          },
          {
            title: 'CSS nima uchun kerak? HTML va CSS farqi',
            text: 'HTML va CSS bir-birini to‘ldiradi:\n• **HTML** — sahifada **NIMA** borligini belgilaydi: sarlavha, paragraf, rasm, tugma. Ya’ni **tuzilish**.\n• **CSS** — elementlar **QANDAY ko‘rinishini** belgilaydi: rang, o‘lcham, masofa, joylashuv. Ya’ni **dizayn**.\n\nFaqat HTML yozsangiz — sahifa oddiy, qora-oq ko‘rinadi. CSS qo‘shilsa — sahifa «tirilib», zamonaviy saytga aylanadi! 🎉',
            code: '<h1>Salom!</h1>\n\n<style>\n  h1 { color: tomato; }\n</style>',
            codeNote: '• `<h1>Salom!</h1>` — HTML: elementning tuzilishi\n• `<style>` ichidagi `h1 { color: tomato; }` — CSS: uslub qoidasi\n• `color: tomato;` — barcha `h1` elementlari to‘q sariq (tomato) rangda chiqadi',
            result: '«Salom!» yozuvi oddiy qora emas — **to‘q sariq (tomato)** rangda ko‘rinadi.',
            playground: true
          },
          {
            title: 'CSS bilan nimalar qilish mumkin? 💪',
            text: 'CSS juda kuchli — deyarli barcha vizual narsalarni boshqaradi:\n• 🎨 **Ranglar** — matn, fon va chegara ranglari\n• 🔤 **Shriftlar** — tur, o‘lcham, qalinlik\n• 📦 **Joylashuv** — elementlarni qator va panjaralar bo‘ylab joylashtirish (Flexbox, Grid)\n• 📱 **Responsive dizayn** — telefon, planshet, kompyuter ekranlariga moslashuv\n• ✨ **Effektlar** — soyalar, silliq o‘tishlar (transition), animatsiyalar\n• 🖱 **Holatlar** — hover va active kabi sichqoncha holatlariga javob\n\nZamonaviy saytlarning aksariyat dizayni aynan CSS bilan yaratilgan!'
          },
          {
            title: 'CSS qayerlarda ishlatiladi? 🌍',
            text: 'CSS — webning asosiy uslublash tili, shuning uchun u hamma joyda:\n• 🌐 **Saytlar** — korxona saytlari, internet-do‘konlar, bloglar\n• 📱 **Web ilovalar** — Gmail, YouTube, Figma interfeyslari\n• 📧 **Email shablonlari** — xatlarning dizayni\n• 📊 **Dashboardlar** — admin panellar va analitika ekranlari\n\nBu bilim — front-end dasturchi kasbining asosi: **HTML + CSS + JavaScript = Frontend uchligi**!'
          },
          {
            title: 'Birinchi CSS kodingiz — 5 daqiqada! 🏃',
            text: 'Endi o‘zingiz sinab ko‘ring! Quyidagi **to‘liq ishlaydigan** sahifada kodni tahrirlab natijani ko‘ring: rang va o‘lchamlarni o‘zingiz xohlagancha o‘zgartiring 😄',
            code: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  h1 {\n    color: royalblue;\n    font-size: 40px;\n    text-align: center;\n  }\n  p {\n    color: gray;\n    font-size: 20px;\n  }\n</style>\n</head>\n<body>\n  <h1>Mening birinchi CSS sahifam!</h1>\n  <p>Men CSS o‘rganyapman. Bu zo‘r!</p>\n</body>\n</html>',
            codeNote: '• `h1 { ... }` — barcha h1 elementlarga qoida\n• `color: royalblue;` — matn rangi\n• `font-size: 40px;` — shrift o‘lchami\n• `text-align: center;` — matnni markazga joylaydi\n• `p { ... }` — barcha paragraflarga qoida',
            result: 'Sarlavha ko‘k (royalblue), katta (40px) va markazda chiqadi. Paragraf esa kulrang (gray) va kichikroq (20px) ko‘rinadi.',
            playground: true
          }
        ],
        keyPoints: [
          'CSS (Cascading Style Sheets) — elementlarning **ko‘rinishini** boshqaruvchi uslublash tili',
          '**HTML = tuzilish**, **CSS = dizayn**, **JavaScript = interaktivlik**',
          'CSS ham HTML kabi **dasturlash tili emas** — u faqat uslub beradi',
          'CSS bilan: ranglar, shriftlar, joylashuv, responsive dizayn, animatsiyalar qilinadi',
          'CSS — webning asosiy uslublash tili: saytlar, web ilovalar, dashboardlar, email',
          'Kaskad (Cascading) — bir elementga bir nechta qoida tushsa, ular ustuvorlik bilan echiladi'
        ],
        motivationTitle: '➡️ KEYINGI DARS: 2-DARS',
        motivation: '**CSS sintaksisi!** ⌨️\n\n• selector — kimni stillaymiz\n• property — nimasini o‘zgartiramiz\n• value — qanday qiymat beramiz\n\nSintaksisni bilgan odam CSSdagi istalgan xususiyatni bemalol yozadi 💪',
        quizQuestionCount: 5,
        exercises: [
          {
            id: 'c1ex1',
            type: 'liveedit',
            title: '1-MASHQ — Birinchi CSS kodingiz',
            instruction: 'Shu sahifani **rangingiz bilan bezang**: `h1` rangini `crimson`, `p` rangini `seagreen` qiling. Har o‘zgartirishdan keyin ▶ RUN bosib natijani ko‘ring!',
            startCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  h1 { color: black; }\n  p { color: black; }\n</style>\n</head>\n<body>\n  <h1>Salom, CSS!</h1>\n  <p>Men uslublashni o‘rganyapman.</p>\n</body>\n</html>',
            checks: [
              { re: 'h1\\s*\\{[^}]*color\\s*:\\s*crimson', msg: '`h1 { color: crimson; }` qiling' },
              { re: 'p\\s*\\{[^}]*color\\s*:\\s*seagreen', msg: '`p { color: seagreen; }` qiling' }
            ],
            hint: 'Har bir qoida: selector { property: value; }. Masalan: h1 { color: crimson; }',
            xp: 10
          },
          {
            id: 'c1ex2',
            type: 'dragdrop',
            title: '2-MASHQ — CSS qoidasini yig‘',
            instruction: 'CSS qoidasi bo‘laklari aralashib ketgan! Ularni **to‘g‘ri tartibda** joylang: kompyuterda sudrab tashlang, telefonda: bo‘lakni bosing → joyiga bos.',
            items: ['h1 {', '  color: tomato;', '}'],
            hint: 'Tartib: selector ochiladi → property: value → qavs yopiladi.',
            xp: 10
          },
          {
            id: 'c1ex3',
            type: 'detective',
            title: '3-MASHQ — Kod detektivi',
            instruction: 'CSS kodida bitta xato bor. Uni toping — noto‘g‘ri bo‘lgan qismni tanlang.',
            code: '<style>\n  p {\n    color green;\n  }\n</style>',
            options: ['`p` selectorida xato bor', '`color` property’si noto‘g‘ri yozilgan', '`green` va `color` orasida **ikki nuqta (:)** yetishmaydi', 'qavslar yopilmagan'],
            answer: 2,
            explanation: '`property` va `value` orasida har doim **ikki nuqta (:)** bo‘lishi shart: `color: green;`',
            xp: 10
          }
        ]
      },
      quiz: {
        passingScore: 80,
        questions: [
          {
            question: 'CSS nimani boshqaradi?',
            options: ['Sahifaning tuzilishini', 'Elementlarning ko‘rinishini (dizaynini)', 'Ma‘lumotlar bazasini', 'Server mantiqini'],
            answer: 1,
            explanation: 'CSS — uslublash tili: rang, shrift, masofa, joylashuv — ya’ni ko‘rinish. Tuzilishni HTML beradi.'
          },
          {
            question: 'CSS nomining kengaytmasi qaysi?',
            options: ['Creative Style System', 'Cascading Style Sheets', 'Computer Styled Sections', 'Coded Style Syntax'],
            answer: 1,
            explanation: 'CSS = Cascading Style Sheets — «kaskadli uslub varaqalari».'
          },
          {
            question: 'Sahifada chiroyli ko‘rinish uchun qaysi til ishlatiladi?',
            options: ['HTML', 'CSS', 'SQL', 'PHP'],
            answer: 1,
            explanation: 'CSS — dizayn tili. HTML tuzilish, JavaScript esa interaktivlik beradi.'
          },
          {
            question: 'CSS qayerlarda ishlatilmaydi?',
            options: ['Saytlarda', 'Web ilovalarda', 'Kompyuter dasturlarining o‘zak (kernel) qismida', 'Dashboardlarda'],
            answer: 2,
            explanation: 'CSS — web uslublash tili: saytlar, web ilovalar, email va dashboardlar. OS kerneli CSS bilan yozilmaydi.'
          },
          {
            question: '`h1 { color: red; }` kodida `color` nima deb ataladi?',
            options: ['selector', 'property', 'value', 'tag'],
            answer: 1,
            explanation: '`color` — property (xususiyat), `red` — value (qiymat), `h1` — selector.'
          }
        ]
      }
    },
    {
      title: 'CSS sintaksisi',
      duration: 20,
      xp: 30,
      content: {
        intro: '1-darsda CSS nima ekanligini bilib oldingiz. Endi **CSS qanday yoziladi** — ya’ni sintaksisini (yozilish qoidalarini) to‘liq o‘rganamiz. Bu dars CSS kursining **eng muhim darsi**: uni yaxshi o‘zlashtirsangiz, qolgan barcha xususiyatlarni bemalol yozasiz! 🎯',
        reviewTitle: '🔁 ESLAB QOLING — 1-DARSDAN',
        review: [
          'CSS — elementlarning **ko‘rinishini** boshqaruvchi uslublash tili',
          'CSS qoidasi `<style>` tegi ichida yoziladi',
          '`h1 { color: red; }` — barcha `h1` elementlarga qoida',
          '**HTML = tuzilish**, **CSS = dizayn**',
          'Har bir qoida selector bilan boshlanadi'
        ],
        sections: [
          {
            title: 'CSS qoidasi (rule) qanday yoziladi? 📐',
            text: 'Har bir CSS kodining asosi — **qoida (rule)**. Qoida 2 qismdan tuziladi:\n\n1. **Selector** — KIMGA uslub beramiz? (masalan: `p` — barcha paragraflar)\n2. **Declaration block** — QANDAY uslub? `{ ... }` figurali qavslar ichida.\n\n`{ }` ichidagi har bir yozuv — **declaration** (e‘lon). Declaration esa 3 qismdan:\n• **property** — qaysi xususiyatni o‘zgartiramiz? (`color` — rang)\n• **ikki nuqta `:`** — property va value’ni ajratadi\n• **value** — qiymat (`red` — qizil)\n• oxirida **vergul nuqta `;`** — declaration tugadi degan belgi',
            code: 'p {\n  color: red;\n}',
            codeNote: '• `p` — selector (kim? — barcha paragraflar)\n• `{ ... }` — declaration block\n• `color` — property (xususiyat)\n• `:` — ajratuvchi\n• `red` — value (qiymat)\n• `;` — declaration tugadi belgisi',
            result: 'Barcha paragraflar qizil rangda chiqadi.',
            note: 'Qoidani bir qatorda ham yozish mumkin: `p { color: red; }` — brauzer uchun farqi yo‘q. Lekin professional kodda har bir property **yangi qatorda** yoziladi — o‘qishga oson bo‘ladi!'
          },
          {
            title: 'Selector — kimni stillaymiz? 🎯',
            text: '**Selector** — qoidaning «murojaat manzili». U brauzerga aytadi: «bu uslub QAYSI elementlarga tegishli».\n\nEng oddiy selectorlar:\n• **element selector** — teg nomi: `p`, `h1`, `div` — shu tegdagi HAMMA elementlar\n• **class selector** — nuqta bilan: `.title` — `class="title"` bo‘lgan elementlar\n• **id selector** — panjara bilan: `#main` — `id="main"` bo‘lgan bitta element\n\nQuyidagi misolda uchala selectorni solishtiramiz:',
            code: '<h1>Asosiy sarlavha</h1>\n<p class="intro">Kirish matni</p>\n<p id="footer-note">Pastki izoh</p>\n\n<style>\n  h1 { color: navy; }\n  .intro { color: teal; }\n  #footer-note { color: gray; }\n</style>',
            codeNote: '• `h1` — barcha h1 elementlar (element selector)\n• `.intro` — oldidagi nuqta «bu class» degani\n• `#footer-note` — oldidagi panjara «bu id» degani\n• HTMLda `class="intro"` va `id="footer-note"` yozilgan — CSS selectorlari aynan shu nomlarga bog‘lanadi',
            result: 'Sarlavha to‘q ko‘k (navy), kirish matni — firuza (teal), pastki izoh — kulrang (gray).',
            note: 'Element nomida katta-kichik harf ahamiyatsiz: `H1` va `h1` bir xil. Lekin class/id nomlarida ahamiyatli: `.Title` va `.title` — ikki xil nom!'
          },
          {
            title: 'Property va value — nima va qanday? 🔧',
            text: '**Property** — elementning qaysi xususiyatini o‘zgartirishimizni aytadi. **Value** esa qanday qiymat berishimizni.\n\nMisol uchun:\n• `color: blue;` — color (property) = matn rangi, blue (value) = ko‘k\n• `font-size: 24px;` — font-size = shrift o‘lchami, 24px = 24 piksel\n• `text-align: center;` — text-align = matn joylashuvi, center = markaz\n\n⚠️ Property nomini xato yozsangiz — CSS **jim** ishlamaydi: xato property **tashlab yuboriladi** va hech qanday xabar chiqmaydi! Shu uchun property nomlarini aniq yozing.',
            code: '<p>Bu matn barcha uslublar bilan.</p>\n\n<style>\n  p {\n    color: blue;\n    font-size: 24px;\n    text-align: center;\n  }\n</style>',
            codeNote: '• `color: blue;` — matn rangini ko‘k qiladi\n• `font-size: 24px;` — shrift o‘lchamini 24 piksel qiladi\n• `text-align: center;` — matnni markazga joylaydi\n• Har bir satr oxirida `;` bo‘lishi SHART — aks holda keyingi satr ishlamaydi!',
            result: 'Matn ko‘k rangda, katta (24px) va markazda ko‘rinadi.',
            note: '`;` ni unutish — eng ko‘p uchraydigan xato! Oxirgi property’dan keyin ham `;` qo‘ying — keyinchalik yangi satr qo‘shsangiz, kod buzilmaydi.'
          },
          {
            title: 'Bir selectorga bir nechta declaration 🧩',
            text: 'Bitta selector bir vaqtning o‘zida **istagan qancha** property olishi mumkin! Har biri yangi qatorda, har biri `;` bilan tugaydi.\n\nBu — CSSning kuchi: bitta joyda yozib, bir elementning to‘liq ko‘rinishini boshqarasiz.',
            code: '<div class="card">\n  Men karta men!\n</div>\n\n<style>\n  .card {\n    color: white;\n    background-color: midnightblue;\n    font-size: 20px;\n    padding: 20px;\n    border-radius: 12px;\n  }\n</style>',
            codeNote: '• `color: white;` — matn rangi oq\n• `background-color: midnightblue;` — fon to‘q ko‘k\n• `font-size: 20px;` — o‘lcham\n• `padding: 20px;` — ichki masofa (keyingi darslarda batafsil)\n• `border-radius: 12px;` — burchaklarni yumaloqlash',
            result: 'To‘q ko‘k, yumaloq burchakli karta ichida oq matn chiqadi — 5 ta property birdan ishlaganini ko‘rasiz.',
            playground: true
          },
          {
            title: 'CSS kommentlari va oltin qoidalar 📜',
            text: 'CSSda izoh (komment) `/* ... */` yoziladi — brauzer ularni **ishlamaydi**, faqat o‘quvchi uchun.\n\n**5 ta oltin qoida:**\n1. Property va selectorlar kichik harf bilan yoziladi\n2. Property va value orasida ikki nuqta `:` bo‘ladi\n3. Har bir declaration `;` bilan tugaydi\n4. Qavslar juftlikda ochiladi va yopiladi `{ ... }`\n5. Xato yozilsa brauzer **jimlik bilan tashlab yuboradi** — DevTools (F12) orqali tekshiring',
            code: '/* Bu komment — brauzer buni ko‘rmaydi */\np {\n  color: green;   /* rang — yashil */\n  /* font-size: 30px; — vaqtincha o‘chirib qo‘yilgan */\n}',
            codeNote: '• `/* ... */` orasidagi hamma narsa brauzer uchun yo‘q deb hisoblanadi\n• Kodni vaqtincha o‘chirish uchun ham komment ishlatiladi — kodni o‘chirib tashlamasdan faollashtirish mumkin',
            result: 'Paragraf yashil rangda chiqadi. `font-size` kommentda bo‘lgani uchun ishlamaydi.',
            note: 'Ishlamayotgan CSS bor deb his qilsangiz — avval `;` va `:` belgilarini tekshiring, so‘ng property imlosini. Eng kichik xato ham jim ishlamay qoladi!'
          }
        ],
        keyPoints: [
          'CSS qoidasi (rule) = **selector + declaration block** `{ ... }`',
          'Declaration = **property + `:` + value + `;`**',
          'Selector — kimga: `p` (element), `.title` (class), `#main` (id)',
          'Property — nimasini: color, font-size, text-align...',
          'Value — qanday: red, 24px, center...',
          'Komment: `/* ... */` — brauzer ko‘rmaydi, faqat odam o‘qiydi'
        ],
        motivationTitle: '➡️ KEYINGI DARS: 3-DARS',
        motivation: '**CSSni HTMLga ulash!** 🔗\n\nInline, internal, external — 3 xil usul. Qaysi biri eng yaxshi va nima uchun professional dasturchilar aynan bittasini tanlaydi? Bilasiz! 😉',
        quizQuestionCount: 5,
        exercises: [
          {
            id: 'c2ex1',
            type: 'liveedit',
            title: '1-MASHQ — Qoidani to‘g‘rilash',
            instruction: 'Quyidagi karta elementini bezang: `.card` selectoriga **3 ta property** qo‘shing: `color` (o‘z xohlagan rang), `background-color` (o‘z xohlagan rang) va `font-size` (raqam + px).',
            startCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .card {\n  }\n</style>\n</head>\n<body>\n  <div class="card">Bu mening kartam!</div>\n</body>\n</html>',
            checks: [
              { re: '\\.card\\s*\\{[^}]*color\\s*:\\s*\\w+', msg: '`.card` ichida `color: ...;` qo‘shing' },
              { re: '\\.card\\s*\\{[^}]*background-color\\s*:\\s*\\w+', msg: '`.card` ichida `background-color: ...;` qo‘shing' },
              { re: '\\.card\\s*\\{[^}]*font-size\\s*:\\s*\\d+px', msg: '`.card` ichida `font-size: 20px;` kabi o‘lcham qo‘shing' }
            ],
            hint: 'Har bir satr: `property: value;`. Masalan: color: navy;',
            xp: 10
          },
          {
            id: 'c2ex2',
            type: 'detective',
            title: '2-MASHQ — Kod detektivi',
            instruction: 'CSS qoidasida bitta xato bor — shu sababli ikkinchi satr ishlamayapti. Uni toping!',
            code: '<style>\n  p {\n    color: blue;\n    font-size; 18px;\n  }\n</style>',
            options: ['`color: blue;` satrida xato bor', '`font-size` va `18px` orasida **ikki nuqta (:)** o‘rniga **vergul (;)** yozilgan', 'qavslar yopilmagan', '`p` selectori xato'],
            answer: 1,
            explanation: 'Property va value orasida faqat **ikki nuqta** bo‘ladi: `font-size: 18px;`. Vergul declarationni tugatadi, shuning uchun xato satrdan keyingisi ham buziladi.',
            xp: 10
          },
          {
            id: 'c2ex3',
            type: 'dragdrop',
            title: '3-MASHQ — Qoidani yig‘',
            instruction: 'CSS qoidasini to‘g‘ri tartibda yig‘ing. Kompyuterda sudrab tashlang, telefonda: bo‘lakni bosing → joyiga bos.',
            items: ['.title {', '  color: purple;', '  font-size: 30px;', '}'],
            hint: 'Selector ochiladi → property’lar → qavs yopiladi. Har bir property `;` bilan tugaydi.',
            xp: 10
          }
        ]
      },
      quiz: {
        passingScore: 80,
        questions: [
          {
            question: 'CSS qoidasining 2 ta asosiy qismi qaysi?',
            options: ['selector va declaration block', 'tag va attribute', 'property va comment', 'value va class'],
            answer: 0,
            explanation: 'Qoida = selector (kimga) + declaration block `{ ... }` (qanday).'
          },
          {
            question: 'Declaration qanday tugaydi?',
            options: ['Ikki nuqta (:) bilan', 'Vergul nuqta (;) bilan', 'Qavs (}) bilan', 'Komment (/* */) bilan'],
            answer: 1,
            explanation: 'Har bir declaration `;` bilan tugaydi: `color: red;`'
          },
          {
            question: '`h1 { color: red; }` kodida qaysi qism **value** hisoblanadi?',
            options: ['h1', 'color', 'red', '{ }'],
            answer: 2,
            explanation: '`red` — value (qiymat). `h1` — selector, `color` — property.'
          },
          {
            question: 'CSSda komment qanday yoziladi?',
            options: ['// bu komment', '<!-- bu komment -->', '/* bu komment */', '# bu komment'],
            answer: 2,
            explanation: 'CSSda komment `/* ... */` shaklida yoziladi. `//` va `#` — boshqa tillar uchun.'
          },
          {
            question: 'Property nomi xato yozilsa nima bo‘ladi?',
            options: ['Brauzer xato xabari chiqaradi', 'Sahifa umuman ochilmaydi', 'Brauzer o‘sha property’ni tashlab yuboradi va jim ishlamaydi', 'Sahifa qorayadi'],
            answer: 2,
            explanation: 'CSS brauzer tomonidan «jim» pardalanadi: noto‘g‘ri property tashlab yuboriladi. Shu sababli DevTools (F12) bilan tekshirish kerak.'
          }
        ]
      }
    },
    {
      title: 'CSSni HTMLga ulash',
      duration: 20,
      xp: 30,
      content: {
        intro: 'CSS kodi o‘zimizga ham tushunarli bo‘ldi — endi uni **sahifaga qanday ulashni** o‘rganamiz. 3 ta usul bor: **Inline**, **Internal** va **External**. Har birining afzalligi va kamchiligini ko‘rib, professional dasturchilar nima uchun aynan bittasini tanlashini tushunasiz! 🔗',
        reviewTitle: '🔁 ESLAB QOLING — 2-DARSDAN',
        review: [
          'CSS qoidasi = **selector + `{ property: value; }`**',
          'Declaration har doim `;` bilan tugaydi',
          'Property va value orasida `:` bo‘ladi',
          'Komment — `/* ... */`',
          'Xato yozilsa brauzer jim tashlab yuboradi'
        ],
        sections: [
          {
            title: '3 ta usul — umumiy ko‘rinish 🗺',
            text: 'CSSni HTML sahifaga ulashning 3 ta usuli bor:\n\n• **Inline CSS** — uslub to‘g‘ridan-to‘g‘ri elementning `style` atributida yoziladi\n• **Internal CSS** — uslub sahifaning `<head>` qismidagi `<style>` tegida yoziladi\n• **External CSS** — uslub **alohida `.css` faylda** yoziladi va `<link>` tegi bilan ulanadi\n\nQuyida har birini batafsil ko‘ramiz — oxirida qaysi biri nima uchun eng yaxshisi ekanligini tushunasiz!',
            note: 'Professional loyihalarda deyarli har doim **External CSS** ishlatiladi. Inline va Internal — kichik misollar yoki maxsus holatlar uchun.'
          },
          {
            title: 'Inline CSS — style atributi 🏷',
            text: '**Inline CSS** — uslub elementning **o‘zida**, `style` atributi ichida yoziladi. Boshqa fayl yoki `<style>` tegi kerak emas — eng tezkor usul.\n\nLekin diqqat: `style` atributi **faqat bitta elementga** ta’sir qiladi. 100 ta elementni bezash uchun 100 marta yozish kerak bo‘ladi — bu yomon!',
            code: '<p style="color: crimson; font-size: 20px;">Bu matn qizil va katta.</p>\n<p>Bu esa oddiy paragraf.</p>',
            codeNote: '• `style` — HTML atributi, qiymati CSS kodi\n• `style="color: crimson; font-size: 20px;"` — ikkita property bitta elementga\n• Ikkala property ham ikki nuqta bilan, oralarida vergul nuqta bilan yozilgan\n• Faqat birinchi `<p>` ta’sirlandi — ikkinchisi oddiy qoldi',
            result: 'Birinchi matn qizil va katta chiqadi, ikkinchisi oddiy qora. Usul faqat bitta elementga ta’sir qildi.',
            playground: true,
            note: 'Inline CSSdan imkon qadar qoching: HTML va CSS aralashib ketadi, kodni saqlash qiyinlashadi. Vaqtincha test qilish uchun yoki JavaScript bilan dinamik uslub berishda ishlatiladi.'
          },
          {
            title: 'Internal CSS — <style> tegi 📄',
            text: '**Internal CSS** — uslublar sahifa ichidagi `<style>` tegida yoziladi. `<style>` odatda `<head>` qismiga qo‘yiladi (lekin sahifaning istalgan joyida ishlaydi).\n\nBu usul **bitta sahifadagi hamma elementlarni** bezash uchun qulay: bitta `p { ... }` qoidasi sahifadagi BARCHA paragraflarga ta’sir qiladi.\n\nKamchiligi: uslublar faqat shu sahifada ishlaydi. 10 ta sahifangiz bo‘lsa — CSSni 10 marta nusxalash kerak bo‘ladi!',
            code: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; }\n  h1 { color: teal; text-align: center; }\n  p { color: dimgray; line-height: 1.6; }\n</style>\n</head>\n<body>\n  <h1>Internal CSS misoli</h1>\n  <p>Bu sahifadagi hamma paragraflar bir xil uslub oladi.</p>\n  <p>Ikkinchi paragraf ham xuddi shunday ko‘rinadi.</p>\n</body>\n</html>',
            codeNote: '• `<style>` — `<head>` ichida turadi\n• `body { font-family: Arial; }` — butun sahifa shrifti\n• `h1 { ... }` va `p { ... }` — shu sahifadagi barcha h1 va p elementlarga ta’sir qiladi\n• Yoki: internal CSS sahifa darajasidagi uslublar uchun — «bitta sahifa = bitta uslub to‘plami»',
            result: 'Sarlavha markazda firuza rangda, ikkala paragraf ham xuddi shu uslubda (kulrang, o‘qishga qulay qatorlar bilan) chiqadi.'
          },
          {
            title: 'External CSS — alohida fayl (ENG YAXSHI usul!) 🌟',
            text: '**External CSS** — barcha uslublar **alohida `.css` faylga** (masalan, `style.css`) yoziladi va `<link>` tegi bilan sahifaga ulanadi.\n\nNima uchun bu eng yaxshi usul?\n• ♻️ **Qayta ishlatiladi** — bitta CSS fayl 100 ta sahifaga ulanadi\n• ⚡ **Tez yuklanadi** — brauzer CSS faylni keshlab qo‘yadi, keyingi sahifalarda qayta yuklamaydi\n• 🧹 **Toza kod** — HTML faqat tuzilish, CSS faqat uslub\n• 👥 **Jamoa uchun qulay** — dizayner CSSni, dasturchi HTMLni alohida tahrirlaydi',
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>External CSS ishlayapti!</h1>\n</body>\n</html>\n\n<!-- style.css faylining ichida: -->\nh1 {\n  color: rebeccapurple;\n  font-size: 36px;\n  text-align: center;\n}',
            codeNote: '• `<link rel="stylesheet" href="style.css">` — shu qator style.css faylini sahifaga ulaydi\n• `rel="stylesheet"` — bog‘lanish turi: «bu uslublar fayli»\n• `href="style.css"` — fayl manzili; fayl boshqa papkada bo‘lsa: `href="css/style.css"`\n• CSS fayl ichida `<style>` tegi YO‘Q — toza CSS qoidalar yoziladi',
            result: 'Sahifa style.css dagi qoidalarni o‘qiydi va sarlavha binafsha (rebeccapurple), katta va markazda chiqadi.',
            note: '`<link>` — yopiluvchi tegsiz (void) element: `<link ... />` yoki oddiy `<link ...>` yoziladi. Bir sahifaga bir nechta CSS faylni ulash ham mumkin — har biri alohida `<link>` bilan.'
          },
          {
            title: 'Ustuvorlik (priority) — qaysi biri g‘olib? 🥊',
            text: 'Bir elementga bir vaqtda 3 usul bilan har xil uslub bersangiz-chi? Qaysi biri ishlaydi? Qoida oddiy:\n\n**Inline > Internal/External > brauzerning standart uslublari**\n\n• Inline CSS har doim eng kuchli — u elementga eng yaqin\n• Internal va External orasida esa **oxirida ulangan yoki yozilgan** biri g‘olib bo‘ladi (kaskad tartibi)\n\nBu hodisa — **kaskad (Cascading)** — CSS nomining C harfining ma’nosidir!',
            code: '<p style="color: red;">Bu matn qanday rangda?</p>\n\n<style>\n  p { color: blue; }\n</style>',
            codeNote: '• Inline `style="color: red"` — elementga bevosita yozilgan\n• Internal `p { color: blue; }` — sahifa darajasidagi qoida\n• Ikkalasi ham `color` ni o‘zgartirishga harakat qilmoqda — kim g‘olib?',
            result: 'Matn **QIZIL** chiqadi — inline CSS ustuvorlikda birinchi o‘rinda turadi va internal qoidani yengib o‘tadi.',
            note: 'Kuchli uslubni «yengish» kerak bo‘lsa — `!important` ishlatiladi (masalan: `color: blue !important;`). Lekin buni ortiqcha ishlatmang — kodingni boshqarish qiyinlashadi!'
          }
        ],
        keyPoints: [
          '**Inline** — `style` atributi: bitta elementga, eng kuchli ustuvorlik',
          '**Internal** — `<style>` tegi: bitta sahifaga',
          '**External** — alohida `.css` fayl + `<link rel="stylesheet" href="...">`: loyihaning hammasi uchun',
          'External fayl ichida `<style>` tegi yozilmaydi — faqat qoidalar',
          'Ustuvorlik: **Inline > Internal/External** (kaskad tartibi)',
          'Professional loyihalarda — deyarli har doim External CSS'
        ],
        motivationTitle: '➡️ KEYINGI DARS: 4-DARS',
        motivation: '**Selectorlar dunyosi!** 🎯\n\nElement, class, id, universal, group va descendant — 6 xil selector. Ularni bilganingizdan keyin sahifadagi istalgan elementni «muvaffaqiyatli ushlab» oling! 💪',
        quizQuestionCount: 5,
        exercises: [
          {
            id: 'c3ex1',
            type: 'liveedit',
            title: '1-MASHQ — Internal CSS',
            instruction: '`<style>` tegi ichida ikki qoida yozing: `h1 { color: teal; }` va `p { font-size: 18px; }`. Natijada sarlavha firuza, matn esa 18px bo‘lishi kerak.',
            startCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n\n</style>\n</head>\n<body>\n  <h1>Salom!</h1>\n  <p>Bu matn uslubsiz qoldi.</p>\n</body>\n</html>',
            checks: [
              { re: '<style[\\s>][\\s\\S]*h1\\s*\\{[^}]*color\\s*:\\s*teal', msg: '`<style>` ichida `h1 { color: teal; }` yozing' },
              { re: '<style[\\s>][\\s\\S]*p\\s*\\{[^}]*font-size\\s*:\\s*18px', msg: '`<style>` ichida `p { font-size: 18px; }` yozing' }
            ],
            hint: 'Qoidalar `<style>` va `</style>` orasiga yoziladi: h1 { color: teal; }',
            xp: 10
          },
          {
            id: 'c3ex2',
            type: 'detective',
            title: '2-MASHQ — Kod detektivi',
            instruction: 'Sahifaga style.css faylini ulashmoqchiydi, lekin `<link>` tegining ichida bitta xato bor. Uni toping!',
            code: '<head>\n  <link rel="style" href="style.css">\n</head>',
            options: ['`href` qiymati xato', '`rel="stylesheet"` bo‘lishi kerak — `style` emas', 'link tegi `<body>` ichida bo‘lishi kerak', 'fayl kengaytmasi .html bo‘lishi kerak'],
            answer: 1,
            explanation: '`<link rel="stylesheet">` — uslublar fayli ekanligini aytadi. `rel="style"` — noto‘g‘ri qiymat, shu sababli brauzer faylni CSS sifatida ishlatmaydi.',
            xp: 10
          },
          {
            id: 'c3ex3',
            type: 'dragdrop',
            title: '3-MASHQ — Usullarni farqlash',
            instruction: 'CSS uslublarini to‘g‘ri usul nomlari bilan juftlang: har bir kodni o‘z usuli ustiga qo‘ying.',
            items: ['style="color: red;" — INLINE', '<style> ... </style> — INTERNAL', '<link rel="stylesheet" href="style.css"> — EXTERNAL'],
            hint: 'Element ichida — inline, head ichidagi teg — internal, alohida fayl — external.',
            xp: 10
          }
        ]
      },
      quiz: {
        passingScore: 80,
        questions: [
          {
            question: 'CSSni ulashning 3 usuli qaysi?',
            options: ['Inline, Internal, External', 'Tag, Class, Id', 'Link, Script, Meta', 'Style, Font, Color'],
            answer: 0,
            explanation: 'Inline (style atributi), Internal (<style> tegi) va External (alohida .css fayl + <link>).'
          },
          {
            question: 'Inline CSS qayerda yoziladi?',
            options: ['Alohida .css faylda', '<style> tegida', 'Elementning style atributida', '<head> tegining nomida'],
            answer: 2,
            explanation: 'Inline CSS elementning bevosita o‘zida, `style` atributi ichida yoziladi.'
          },
          {
            question: 'Alohida CSS faylni qaysi teg ulaydi?',
            options: ['<script>', '<style>', '<link rel="stylesheet" href="...">', '<css src="...">'],
            answer: 2,
            explanation: '`<link rel="stylesheet" href="style.css">` — alohida CSS faylni ulashning standart yo‘li.'
          },
          {
            question: 'Professional loyihalarda qaysi usul afzal ko‘riladi?',
            options: ['Inline', 'Internal', 'External', 'Barchasi barobar'],
            answer: 2,
            explanation: 'External CSS: qayta ishlatiladi, tez yuklanadi (kesh), HTML va CSS toza ajratiladi.'
          },
          {
            question: 'Ikkala qoida ham bir elementga tegsa, kim g‘olib bo‘ladi?',
            options: ['Alifbo tartibidagi', 'Inline har doim yengadi', 'Har doim internal', 'Har doim external'],
            answer: 1,
            explanation: 'Ustuvorlik: Inline > Internal/External. Inline — elementga eng yaqin, shu sababli eng kuchli.'
          }
        ]
      }
    },
    {
      title: 'CSS Selectorlar',
      duration: 25,
      xp: 30,
      content: {
        intro: 'Selector — CSSning «ko‘zi». U aytdi: «mana shu elementga uslub beraman». Bu darsda 6 xil selectorni o‘rganamiz: element, class, id, universal, group va descendant. Ularni bilgan odam sahifadagi ISTALGAN elementni uslublay oladi! 🎯',
        reviewTitle: '🔁 ESLAB QOLING — 3-DARSDAN',
        review: [
          'CSS 3 usulda ulanadi: **Inline, Internal, External**',
          'External — eng yaxshi: alohida `.css` fayl + `<link>`',
          'Ustuvorlik: **Inline > Internal/External**',
          'Qoidalar `<style>` tegida yoki alohida faylda yoziladi',
          'Kaskad — uslublar ustuvorlik bilan qo‘llanishi'
        ],
        sections: [
          {
            title: 'Element selector — teg nomi bilan 🏷',
            text: 'Element selector — eng sodda selector: **teg nomi** yoziladi. U shu tegdagi **HAMMA** elementlarga ta’sir qiladi.\n\nMasalan: `p` — barcha paragraflar, `h1` — barcha birinchi darajali sarlavhalar, `ul` — barcha ro‘yxatlar.\n\nQachon ishlatiladi? Sahifadagi element TURiga umumiy uslub berishda (masalan: barcha matn bir xil shriftda bo‘lsin).',
            code: '<h1>Sarlavha</h1>\n<p>Birinchi paragraf</p>\n<p>Ikkinchi paragraf</p>\n\n<style>\n  p {\n    color: dimgray;\n  }\n</style>',
            codeNote: '• `p` — element selector: sahifadagi barcha `<p>` elementlari\n• Ikkala paragraf ham xuddi shu uslubni oldi — chunki ikkalasi ham `p` tegi\n• `h1` esa hech qanday qoidaga tegmadi — oddiy qoldi',
            result: 'Ikkala paragraf ham kulrang (dimgray) chiqadi. Element selector har doim hammasiga birdek ta’sir qiladi.'
          },
          {
            title: 'Class selector — .nom 🏷🏷',
            text: 'Class selector — **nuqta (.) + class nomi**: `.card`, `.btn`, `.title`. U `class="card"` bo‘lgan **barcha elementlarga** ta’sir qiladi.\n\nBu — CSSda ENG KO‘P ishlatiladigan selector, chunki:\n• Bir classni istagan qancha element olishi mumkin\n• Turli xil elementlar (p, div, button) bitta classni bo‘lishishi mumkin\n• Bir elementda bir nechta class bo‘lishi mumkin',
            code: '<p class="highlight">Muhim jumla!</p>\n<p>Oddiy jumla.</p>\n<div class="highlight">Muhim blok!</div>\n\n<style>\n  .highlight {\n    background-color: gold;\n    font-weight: bold;\n  }\n</style>',
            codeNote: '• `class="highlight"` — HTMLda ikki elementga ham bir xil class berilgan\n• `.highlight` — CSSda nuqta bilan «highlight classni ushlab olish»\n• `<p>` ham, `<div>` ham — turli xil elementlar bo‘lsa ham, ikkalasi ham uslub oldi',
            result: 'Ikkala «muhim» element ham oltin (gold) fondagi qalin matn bo‘lib chiqadi — class ularni guruhladi!',
            note: 'Class nomlari kichik harf bilan, ma’noli yoziladi: `.btn-primary`, `.card`, `.navbar`. Razdelitel sifatida chiziqcha `-` ishlatiladi: `.big-title`.'
          },
          {
            title: 'ID selector — #nom 🆔',
            text: 'ID selector — **panjara (#) + id nomi**: `#header`, `#main`. U **faqat bitta** elementga ta’sir qiladi — chunki HTML qoidasiga ko‘ra bir `id` sahifada **faqat bitta** bo‘lishi shart!\n\nQachon ishlatiladi? Sahifada **yagona** elementlar uchun: header, footer, asosiy konteyner, navigatsiya.',
            code: '<header id="header">Sayt sarlavhasi</header>\n<section id="about">Men haqimda</section>\n\n<style>\n  #header {\n    background-color: navy;\n    color: white;\n    text-align: center;\n  }\n  #about {\n    background-color: #f0f0f0;\n  }\n</style>',
            codeNote: '• `id="header"` — HTMLda bitta elementga berilgan yagona nom\n• `#header` — CSSda panjara bilan «header idni ushlab olish»\n• Ikki xil id — ikki xil uslub; ular takrorlansa brauzer hamda CSS xato ishlaydi',
            result: 'Header to‘q ko‘k fonli, oq matnli va markazda chiqadi. About esa och kulrang fonli bo‘ladi.',
            note: 'Bir sahifada bir xil `id` ikki marta ishlatilmaydi! Class esa istagan qancha marta ishlatilishi mumkin.'
          },
          {
            title: 'Universal selector — * ✨',
            text: 'Universal selector — **yulduzcha (*)**. U sahifadagi **BARCHA** elementlarga ta’sir qiladi — hech narsani tushirib qoldirmaydi.\n\nEng ko‘p ishlatiladigan holat — **CSS reset**: brauzerning ichki uslublarini tozalash.',
            code: '<style>\n  * {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n  }\n</style>\n\n<h1>Sarlavha</h1>\n<p>Paragraf</p>\n<ul><li>Ro‘yxat</li></ul>',
            codeNote: '• `*` — hammasiga: h1, p, ul, li va hokazo\n• `margin: 0; padding: 0;` — brauzerning standart masofalarini nolga qaytaradi\n• `box-sizing: border-box;` — o‘lchovlar hisobini soddalashtiradi (12-darsda batafsil)',
            result: 'Barcha elementlar oldidagi «kutilmagan» bo‘sh joylar yo‘qoladi — sahifa toza boshlanadi.',
            note: 'Bu 3 ta satr — professional loyihalarning boshlanish qismi (reset). Uni har bir loyiha boshida yozish tavsiya etiladi!'
          },
          {
            title: 'Group selector — vergul bilan 🧑‍🤝‍🧑',
            text: 'Bir xil uslub **bir nechta** selectorga kerak bo‘lsa — ularni **vergul (,)** bilan juftlashtiring. Bu kodni qisqartiradi va takrorlanishni yo‘q qiladi.\n\n❌ Yomon: 3 marta bir xil qoida yozish\n✅ Yaxshi: bir qoidada 3 ta selector',
            code: '<h1>Salom</h1>\n<h2>Kichik sarlavha</h2>\n<p>Paragraf</p>\n\n<style>\n  h1, h2, p {\n    font-family: Georgia, serif;\n    color: #333;\n  }\n</style>',
            codeNote: '• `h1, h2, p` — vergul «VA» degani: barcha h1 VA barcha h2 VA barcha p\n• Hammasiga bir xil shrift va rang berildi — kod 3 marta yozilmadi\n• Vergulni unutsangiz `h1 h2` bo‘lib qoladi — bu endi descendant selector (keyingi bo‘lim)!',
            result: 'Hammasi bir xil shrift (Georgia) va to‘q kulrang (#333) rangda chiqadi.',
            playground: true
          },
          {
            title: 'Descendant selector — probel bilan 👨‍👩‍👧',
            text: 'Descendant selector — **probel bilan ajratilgan 2 selector**: `.card p`. Ma’nosi: «`.card` ichidagi HAMMA `p` elementlari».\n\nBu — aniq nishonga olish usuli: sahifaning boshqa qismidagi `p` elementlari ta’sir qilmaydi, faqat ichidagilari!',
            code: '<div class="card">\n  <p>Kartadagi matn — uslublanadi!</p>\n</div>\n<p>Sahifadagi matn — uslublanmaydi.</p>\n\n<style>\n  .card p {\n    color: steelblue;\n    font-style: italic;\n  }\n</style>',
            codeNote: '• `.card p` — probel «ichida» degani: class=card bo‘lgan element ICHIDAGI hamma p\n• Kartadagi `p` — ta’sirlandi (ko‘k kursiv)\n• Kartadan tashqaridagi `p` — ta’sir qilmadi, oddiy qoldi\n• Probel bilan ajratilgan selectorlarning tartibi ahamiyatli: avval ota, keyin bola',
            result: 'Faqat karta ichidagi matn ko‘k (steelblue) kursivda chiqadi. Tashqaridagi paragraf oddiy qoladi.',
            note: 'Diqqat: `.card p` (probel) va `.card.p` (probel yo‘q) — MUTLAQO HAR XIL! Probel bilan — ichidagi element. Probelsiz — bir elementda ikkala class ham bo‘lgan holat.'
          }
        ],
        keyPoints: [
          '**Element** selector: `p` — shu tegdagi hammasi',
          '**Class** selector: `.nom` — nuqta bilan; ko‘p elementlarga beriladi',
          '**ID** selector: `#nom` — panjara bilan; sahifada YAGONA',
          '**Universal** selector: `*` — hamma narsa; CSS reset uchun',
          '**Group** selector: `h1, h2, p` — vergul = VA',
          '**Descendant** selector: `.card p` — probel = ichidagi hammasi'
        ],
        motivationTitle: '➡️ KEYINGI DARS: 5-DARS',
        motivation: '**Class va ID chuqurroq!** ⚖️\n\nQachon class, qachon id? Bir elementga bir nechta class qanday beriladi? Bu savollarga aniq javob olasiz — keyin hech qachon shubha qilmaysiz! 😉',
        quizQuestionCount: 5,
        exercises: [
          {
            id: 'c4ex1',
            type: 'liveedit',
            title: '1-MASHQ — Class selector',
            instruction: 'Ikkala «Muhim» elementga ham uslub bering: `.highlight` classiga `background-color: gold;` va `font-weight: bold;` qo‘shing. Oddiy elementlar uslublanmasligi kerak!',
            startCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .highlight {\n\n  }\n</style>\n</head>\n<body>\n  <p class="highlight">Muhim jumla!</p>\n  <p>Oddiy jumla.</p>\n  <div class="highlight">Muhim blok!</div>\n</body>\n</html>',
            checks: [
              { re: '\\.highlight\\s*\\{[^}]*background-color\\s*:\\s*gold', msg: '`.highlight` ichida `background-color: gold;` qo‘shing' },
              { re: '\\.highlight\\s*\\{[^}]*font-weight\\s*:\\s*bold', msg: '`.highlight` ichida `font-weight: bold;` qo‘shing' }
            ],
            hint: 'Class selector nuqta bilan boshlanadi: .highlight { ... }',
            xp: 10
          },
          {
            id: 'c4ex2',
            type: 'detective',
            title: '2-MASHQ — Kod detektivi',
            instruction: 'Dasturchi faqat `#about` bo‘limidagi matnni ko‘k qilmoqchi edi, lekin sahifadagi BARCHA matnlar ko‘k bo‘lib qoldi. Xato qayerda?',
            code: '<style>\n  #about, p {\n    color: steelblue;\n  }\n</style>',
            options: ['`color` property’si xato', 'vergul o‘rniga probel yozilishi kerak edi — `#about p`', 'panjara (#) noto‘g‘ri', 'qoida umuman xato emas'],
            answer: 1,
            explanation: 'Vergul «VA» degani: `#about, p` = id=about VA barcha p — hammasi ta’sirlandi. «Ichidagi» degani uchun PROBEL kerak: `#about p`.',
            xp: 10
          },
          {
            id: 'c4ex3',
            type: 'dragdrop',
            title: '3-MASHQ — Selectorni yig‘',
            instruction: 'Descendant selectorni to‘g‘ri tartibda yig‘ing: karta ichidagi ro‘yxat elementlariga uslub.',
            items: ['.card', ' ', 'li {', '  color: teal;', '}'],
            hint: 'Avval ota selector (.card), keyin probel, keyin bola (li) va qoida.',
            xp: 10
          }
        ]
      },
      quiz: {
        passingScore: 80,
        questions: [
          {
            question: 'Class selector qanday yoziladi?',
            options: ['#nom', '.nom', 'nom', '*nom'],
            answer: 1,
            explanation: 'Class selector nuqta bilan: `.nom`. Panjara (#) — id, oddiy nom — element selector.'
          },
          {
            question: 'ID selector qanday yoziladi?',
            options: ['.nom', 'nom', '#nom', '@nom'],
            answer: 2,
            explanation: 'ID selector panjara bilan: `#nom`. Bir id — sahifada faqat bitta elementda bo‘ladi.'
          },
          {
            question: '`h1, h2, p` selectori nimani anglatadi?',
            options: ['h1 ichidagi h2 ichidagi p', 'barcha h1 VA h2 VA p elementlari', 'faqat birinchisi', 'h1 classli h2 va p'],
            answer: 1,
            explanation: 'Vergul — group selector: bir xil uslub bir nechta selectorga beriladi.'
          },
          {
            question: '`.card p` selectori nimani anglatadi?',
            options: ['class=card bo‘lgan element ichidagi hamma p', 'card va p classli elementlar', 'faqat p elementi', 'faqat .card elementi'],
            answer: 0,
            explanation: 'Probel — descendant (mavjudlik): `.card` ichidagi hamma `p` elementlari.'
          },
          {
            question: '`* { margin: 0; padding: 0; }` kodida `*` nimani anglatadi?',
            options: ['Sharh (komment)', 'Hammasa — universal selector', 'Faqat paragraflar', 'Xato'],
            answer: 1,
            explanation: '`*` — universal selector: sahifadagi BARCHA elementlarga ta’sir qiladi. CSS reset asosi.'
          }
        ]
      }
    },
    /*__NEXT__*/
  ];
})();

