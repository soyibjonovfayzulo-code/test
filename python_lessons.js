// === PYTHON LESSONS START ===
        {
          title: 'Python nima?',
          duration: 15,
          xp: 25,
          content: {
            intro: 'Bugun biz eng mashhur dasturlash tillaridan biri — Python bilan tanishamiz. Bu til nima uchun shunchalik ommabop bo‘lganini, u qayerda ishlatilishini va birinchi kodimizni yozamiz.',
            sections: [
              {
                title: 'Python — bu nima?',
                text: 'Python — yuqori darajali, oson o‘rganiladigan va ko‘p maqsadli dasturlash tili. U Guido van Rossum tomonidan 1991-yilda yaratilgan va hozirgi kunda dunyoning eng ommabop tillaridan biriga ayylangan. Python o‘qilishi oson, sintaksisi ingliz tiliga o‘xshashligi sababli yangi boshlovchilar uchun juda qulay.',
                code: 'print("Salom, dunyo!")',
                codeNote: 'Bu eng oddiy Python dasturi. print() funksiyasi qavs ichidagi matnni konsolga chiqaradi.',
                result: 'Salom, dunyo!',
                note: 'Pythonni ishlatish uchun hech qanday murakkab sozlamalar kerak emas — birinchi kodingizni darhol yozishingiz mumkin.'
              },
              {
                title: 'Python qayerda ishlatiladi?',
                text: 'Python juda ko‘p sohalarda qo‘llaniladi:\n\n• Web dasturlash (Django, Flask)\n• Data Science va ma'lumotlarni tahlil qilish (Pandas, NumPy)\n• Sun’iy intellekt va mashina o‘rganish (TensorFlow, PyTorch)\n• Avtomatlashtirish va skript yozish\n• Telegram va boshqa botlar yaratish\n• O‘yinlar ishlab chiqish (Pygame)\n• Desktop ilovalar yaratish',
                code: '# Telegram bot uchun oddiy misol (aiogram kutubxonasi)\n# from aiogram import Bot, Dispatcher\n# bot = Bot(token="TOKEN")\n# dp = Dispatcher(bot)\n# Bu hozircha faqat namuna — haqiqiy botni keyinchalik yaratamiz',
                codeNote: 'Bu yerda # — sharh (comment). U Python tomonidan e'tiborga olinmaydi, faqat kodingizni tushunishga yordam beradi.',
                result: 'Hech narsa chiqmaydi — bu faqat sharh.',
                note: 'Shunday qilib, Pythonni o‘rganib siz juda ko‘p sohalarda ishlash imkoniyatiga ega bo‘lasiz.'
              },
              {
                title: 'Pythonning afzalliklari',
                text: 'Pythonni boshqa tillardan ajratuvchi asosiy xususiyatlar:\n\n1. **Oson o‘rganiladi** — sintaksisi oddiy, kamroq kod yozish kerak\n2. **O‘qiladi** — kod ingliz tiliga o‘xshaydi\n3. **Kutubxonalar boyligi** — 300,000+ tayyor paketlar mavjud\n4. **Kross-platforma** — Windows, macOS, Linux da bir xil ishlaydi\n5. **Community katta** — savollaringizga javob topish oson\n6. **Pulli ishlash** — Python dasturchilari o‘rtacha maosh yuqori',
                code: '# Ikki sonni qo‘shish — juda sodda!\na = 5\nb = 3\nprint(a + b)  # 8 chiqadi',
                codeNote: 'O'zgaruvchilarni e'lon qilish uchun turini ko'rsatish kerak emas — Python avtomatik aniqlaydi.',
                result: '8',
                note: 'Javani yozish uchun juda ko‘p kod yozish kerak bo‘lganida, Python da bu bir necha qatorga tushadi.'
              },
              {
                title: 'print() — birinchi funksiyamiz',
                text: 'print() — eng ko‘p ishlatiladigan funksiyalardan biri. U konsolga biror narsa chiqarish uchun ishlatiladi. Qavs ichiga har qanday qiymatni joylashtirish mumkin: matn, son, o‘zgaruvchi va hokazo.',
                code: 'print("Salom!")\nprint(123)\nprint(3.14)\nprint(True)',
                codeNote: 'print() ga bir nechta qiymatni vergul bilan ajratib ham berish mumkin.',
                result: 'Salom!\n123\n3.14\nTrue',
                note: 'Har bir print() avtomatik ravishda yangi qatordan boshlanadi.'
              },
              {
                title: 'Xulosa',
                text: 'Bugun Python nima ekanligini, uning afzalliklarini va qayerda qo‘llanishini o‘rgandik. Keyingi darsda o‘zgaruvchilar bilan ishlashni o‘rganamiz — tayyor bo‘ling!'
              }
            ],
            keyPoints: [
              'Python — 1991-yilda G. van Rossum tomonidan yaratilgan',
              'Python — yuqori darajali, oson o‘rganiladigan til',
              'Web, Data Science, AI, botlar va boshqa ko‘plab sohalarda ishlatiladi',
              'print() — konsolga chiqarish funksiyasi',
              '# — sharh (comment), kodni tushuntirish uchun ishlatiladi',
              'Python da o‘zgaruvchi turini oldindan e'lon qilish kerak emas',
              'Kross-platforma — barcha OS da ishlaydi'
            ],
            masterXp: 25,
            homework: '1. Python dastur yozing va "Men Python o‘rganaman!" matnini konsolga chiqaring.\n2. print() yordamida 3 ta turli sonni (masalan 10, 20, 30) alohida qatorlarga chiqaring.\n3. 4 ta turli print() qatoriga sharh (#) yozing — har bir nima qilishini tushuntiring.\n4. (Challenge) print() ichiga arifmetik amal yozing: masalan print(10 + 20) va natijani ko‘ring.',
            summary: 'Bugun Python bilan tanishib chiqdik: nima, nima uchun, qayerda ishlatilishi. print() funksiyasi va sharhlarni o‘rgandik. Keyingi dars — o‘zgaruvchilar!',
            exercises: [
              {
                id: 'py1ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Salom dunyo! 🐍',
                instruction: 'print() funksiyasi yordamida "Salom, Python!" matnini konsolga chiqaring.',
                startCode: '# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'print\\s*\\(\\s*["\']Salom, Python!["\']\\s*\\)', msg: 'print("Salom, Python!") deb yozishingiz kerak' }
                ],
                hint: 'print() qavs ichiga matnni qo‘yshtirnoq ichida yozing.',
                explanation: 'print() — konsolga chiqarish funksiyasi. Matn doim qo‘yshtirnoq ichida yoziladi.',
                xp: 10
              },
              {
                id: 'py1ex2',
                type: 'dragdrop',
                title: '2-MASHQ — print() qismlarini yig‘ing 🧩',
                instruction: 'To‘g‘ri print() buyrug‘ini yasash uchun qismlarni to‘g‘ri tartibga joylashtiring.',
                hint: 'Tartib: print → ( → matn → )',
                items: ['print', '(', '"Men o‘rganyapman"', ')'],
                xp: 10
              },
              {
                id: 'py1ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kodda bitta XATO bor. Uni toping va to‘g‘ri javobni belgilang.',
                code: 'print("Salom)\nprint(123)',
                options: ['print kichik harf bilan yozilgan', 'Birinchi qo‘yshtirnoq yopilmagan', 'print oldida # belgisi yo‘q', 'Sonni qo‘yshtirnoq ichida yozmagan'],
                answer: 1,
                explanation: 'print("Salom) — ochilgan qo‘yshtirnoq yopilmagan. To‘g‘ri: print("Salom"). Har bir ochilgan qo‘yshtirnoq yopilishi shart!',
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Python dasturlash tilini kim yaratgan?',
                options: ['Bill Gates', 'Guido van Rossum', 'Mark Zuckerberg', 'Elon Musk'],
                answer: 1,
                explanation: 'Python — Gvidio van Rossum tomonidan 1991-yilda yaratilgan.'
              },
              {
                question: 'Pythonning asosiy afzalligi qaysi?',
                options: ['Faqat o‘yinlar uchun ishlatiladi', 'Oson o‘rganiladi va o‘qiladi', 'Hech qachon xatolik bermaydi', 'Faqat Windows da ishlaydi'],
                answer: 1,
                explanation: 'Python sintaksisi ingliz tiliga o‘xshab, oson o‘rganiladi — bu uning asosiy afzalligi.'
              },
              {
                question: 'Konsolga matn chiqarish uchun qaysi funksiya ishlatiladi?',
                options: ['echo()', 'console.log()', 'print()', 'output()'],
                answer: 2,
                explanation: 'Python da konsolga chiqarish uchun print() funksiyasi ishlatiladi.'
              },
              {
                question: 'Python da sharh (comment) uchun qaysi belgi ishlatiladi?',
                options: ['//', '/* */', '#', '--'],
                answer: 2,
                explanation: '# belgisi sharh uchun ishlatiladi. Bu qator Python tomonidan e'tiborga olinmaydi.'
              },
              {
                question: 'print("Ali" + " " + "Vali") kodining natijasi nima?',
                options: ['AliVali', 'Ali Vali', 'Xatolik', '"Ali" "Vali"'],
                answer: 1,
                explanation: 'Matnlar + operatori bilan qo‘shiladi: "Ali" + " " + "Vali" = "Ali Vali".'
              },
              {
                question: 'Qaysi soha Python bilan ishlashga kirmaydi?',
                options: ['Web dasturlash', 'Data Science', 'Sun’iy intellekt', 'Printer quritish'],
                answer: 3,
                explanation: 'Printer quritish — apparat ishi, Python bundan mustasno. Qolganlari Python sohalari.'
              },
              {
                question: 'Python dasturni ishga tushirganda kod qanday tartibda o‘qiladi?',
                options: ['Pastdan yuqoriga', 'Yuqoridan pastga', 'O‘rtasidan boshlab', 'Tasodifiy'],
                answer: 1,
                explanation: 'Python (va boshqa ko‘pgina tillar) kodni YUQORIDAN PASTGA, qatorma-qator o‘qiydi.'
              },
              {
                question: 'print(10 + 5) kodining natijasi nima?',
                options: ['"10 + 5"', '15', '105', 'Xatolik'],
                answer: 1,
                explanation: 'Qavs ichida arifmetik amal bajariladi: 10 + 5 = 15.'
              },
              {
                question: 'Pythonning "kross-platforma" degani nima?',
                options: ['Faqat mobil qurilmalarda ishlaydi', 'Turli OS da ishlaydi', 'Faqat internet bo‘lganda ishlaydi', 'Faqat serverlarda ishlaydi'],
                answer: 1,
                explanation: 'Kross-platforma — degani bir xil kod Windows, macOS, Linux da ishlaydi.'
              }
            ]
          }
        },
        {
          title: 'O‘zgaruvchilar',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Oldingi darsda print() ni o‘rgandik. Endi esa malumotlarni saqlashni o‘rganamiz — buning uchun O‘ZGARUVCHILAR ishlatiladi. Bu — dasturlashning eng asosiy tushunchalaridan biri.',
            sections: [
              {
                title: 'O‘zgaruvchi — bu nima?',
                text: 'O‘zgaruvchi — xotiradagi joyga berilgan nom. U orqali biz raqam, matn va boshqa ma'lumotlarni saqlashimiz va keyinchalik ularga murojaat qilishimiz mumkin. O‘zgaruvchini xuddi "label" (yopishtiruvchi) deb tasavvur qiling — siz biror narsaga nom berasiz va keyin shu nom bilan chaqirasiz.',
                code: 'ism = "Ali"\nyosh = 25\nprint(ism)\nprint(yosh)',
                codeNote: 'ism va yosh — o‘zgaruvchilar nomi. "=" operatori qiymatni o‘zgaruvchiga biriktiradi (assign).',
                result: 'Ali\n25',
                note: '"=" tenglik emas — BU BIRIKTIRISH OPERATORI. O‘ng tomondagi qiymat chap tomondagi o‘zgaruvchiga yoziladi.'
              },
              {
                title: 'O‘zgaruvchiga nom berish qoidalari',
                text: 'O‘zgaruvchi nomini berishda qoidalarga amal qilish kerak:\n\n✅ Ruxsat etilgan:\n• Harflar (a-z, A-Z)\n• Raqamlar (0-9) — lekin BOSHIDA bo‘lmasligi kerak\n• Pastki chiziq (_)\n\n❌ Taqiqlangan:\n• Raqam bilan boshlash (1ism — xato)\n• Bo‘sh joy (ism familiya — xato)\n• Maxsus belgilar (@, #, $ — xato)\n• Maxsus kalit so‘zlar (if, for, while — xato)',
                code: '# To‘g‘ri nomlar\nism_familiya = "Ali Valiyev"\nyosh_1 = 30\n_private = "maxfiy"\n\n# Xato nomlar (ulashmang!)\n# 1ism = "xato"      # raqam bilan boshlanadi\n# ism familiya = ""  # bo‘sh joy bor\n# @name = ""         # maxsus belgi',
                codeNote: 'Python da odatda snake_case usuli ishlatiladi: kichik harflar va so‘zlar orasiga _ (pastki chiziq).',
                result: 'Hech narsa chiqmaydi — bu faqat namuna.',
                note: 'O‘zgaruvchi nomi qisqa va mazmunli bo‘lsin: a, b, c emas — balki ism, yosh, narx.'
              },
              {
                title: 'Qiymatni qayta belgilash',
                text: 'O‘zgaruvchining qiymatini istalgan vaqtda o‘zgartirish mumkin. Hatto TURINI ham o‘zgartirish mumkin (bu xususiyat "dinamik yozilgan til" deb ataladi). Misol uchun, avval raqam saqlagan o‘zgaruvchiga keyin matn berishingiz mumkin.',
                code: 'son = 10\nprint(son)  # 10\n\nson = 20\nprint(son)  # 20\n\nson = "yigirma"\nprint(son)  # yigirma',
                codeNote: 'Ko‘rib turganingizdek, son avval 10, keyin 20, keyin esa matn bo‘ldi. Python da bu ruxsat etilgan.',
                result: '10\n20\nyigirma',
                note: 'Ba’zi tillarda (Java, C++) o‘zgaruvchi turi o‘zgarmaydi, Python da esa o‘zgaradi — bu qulay, lekin ehtiyot bo‘lish kerak.'
              },
              {
                title: 'Bir nechta o‘zgaruvchiga bir vaqtning o‘zida qiymat berish',
                text: 'Python da bir qatorda bir nechta o‘zgaruvchiga qiymat berish mumkin. Bu juda qulay xususiyat.',
                code: 'ism, yosh, shahar = "Ali", 25, "Toshkent"\nprint(ism)\nprint(yosh)\nprint(shahar)\n\n# Hamma bir xil qiymat\na = b = c = 0\nprint(a, b, c)',
                codeNote: 'Birinchi misolda 3 ta o‘zgaruvchiga 3 ta qiymat mos ravishda berildi. Ikkinchisida hammasi 0 ga teng.',
                result: 'Ali\n25\nToshkent\n0 0 0',
                note: 'Bu Pythonning qulay xususiyatlaridan biri — ko‘pchilik boshqa tillarda yo‘q.'
              },
              {
                title: 'input() — foydalanuvchidan qiymat olish',
                text: 'Dastur ishlaganda foydalanuvchidan ma'lumot olish uchun input() funksiyasi ishlatiladi. U doim STRING (matn) turida qiymat qaytaradi, hatto raqam kiritilsa ham.',
                code: '# Foydalanuvchidan ism so‘rash\n# (Brauzerda input() ishlamaydi — kompyuteringizda sinab ko‘ring)\n# ism = input("Ismingizni kiriting: ")\n# print("Salom, " + ism + "!")\n\n# Hozircha oddiy misol:\nism = "Ziyoda"\nprint("Salom, " + ism + "!")',
                codeNote: 'input() ga argument sifatida xabar berish mumkin — foydalanuvchi nima kiritishi kerakligini ko‘rsatadi.',
                result: 'Salom, Ziyoda!',
                note: 'input() doim matn qaytaradi. Agar son kerak bo‘lsa — int() yoki float() ga aylantirish kerak (keyingi darsda).'
              }
            ],
            keyPoints: [
              'O‘zgaruvchi = xotira joyiga nom berish',
              '= — biriktirish operatori, tenglik emas',
              'Nom harf yoki _ bilan boshlanadi, raqam bilan emas',
              'snake_case usuli: ism_familiya, yosh_1',
              'Qiymatni va turini istalgan vaqtda o‘zgartirish mumkin',
              'Bir qatorda bir nechta o‘zgaruvchiga qiymat berish mumkin',
              'input() — foydalanuvchidan qiymat oladi, doim string qaytaradi'
            ],
            masterXp: 30,
            homework: '1. 3 ta o‘zgaruvchi yarating: ism, familiya, yosh. Ularga o‘z ma'lumotlaringizni yozing va print() bilan chiqaring.\n2. narx degan o‘zgaruvchi yarating va unga 100 qiymatini bering. Keyin uni 200 ga o‘zgartiring va ikkala holatni ham chop qiling.\n3. a, b, c degan 3 ta o‘zgaruvchiga BIR QATORDA qiymat bering (masalan 10, 20, 30) va ularni chop qiling.\n4. (Challenge) O‘zgaruvchilar yordamida to‘liq ism shakllantiring: ism + " " + familiya va chop qiling.',
            summary: 'Bugun o‘zgaruvchilarni o‘rgandik: nima, qanday nom berish, qiymat berish, o‘zgartirish. Keyingi dars — ma'lumot turlari!',
            exercises: [
              {
                id: 'py2ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — O‘zgaruvchi yaratish ✍️',
                instruction: 'ism degan o‘zgaruvchi yarating, unga "Bobur" qiymatini bering va print() bilan chop qiling.',
                startCode: '# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'ism\\s*=\\s*["\']Bobur["\']', msg: 'ism = "Bobur" deb yozilishi kerak' },
                  { re: 'print\\s*\\(\\s*ism\\s*\\)', msg: 'print(ism) deb chop qiling' }
                ],
                hint: 'Avval o‘zgaruvchini yarating: ism = "Bobur", keyin uni chop qiling.',
                explanation: 'O‘zgaruvchi yaratish: nom = qiymat. Keyin uni print() orqali chiqarish mumkin.',
                xp: 10
              },
              {
                id: 'py2ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Qiymatni almashtirish 🧩',
                instruction: 'O‘zgaruvchini yarating, qiymat o‘zgartiring va chop qiling. To‘g‘ri tartibni toping.',
                hint: 'Yaratish → o‘zgartirish → chop qilish',
                items: ['x = 5', 'x = 10', 'print(x)'],
                xp: 10
              },
              {
                id: 'py2ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kodda bitta XATO bor. Uni toping.',
                code: '1_son = 100\nprint(1_son)',
                options: ['print qavs ichida son emas', 'O‘zgaruvchi nomi raqam bilan boshlangan', 'Qiymat noto‘g‘ri', 'Qo‘yshtirnoq yo‘q'],
                answer: 1,
                explanation: 'O‘zgaruvchi nomi RAQAM BILAN BOSHLANMASLIGI KERAK! To‘g‘ri: son_1 = 100.',
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'O‘zgaruvchi nima?',
                options: ['Xotira joyiga berilgan nom', 'Konsolga chiqarish funksiyasi', 'Faqat raqam saqlovchi', 'Maxsus belgilar to‘plami'],
                answer: 0,
                explanation: 'O‘zgaruvchi — kompyuter xotirasidagi joyga berilgan nom, unda ma'lumot saqlanadi.'
              },
              {
                question: '"=" operatori Python da nima vazifasini bajaradi?',
                options: ['Tenglikni tekshirish', 'Qiymatni o‘zgaruvchiga biriktirish', 'Matnlarni qo‘shish', 'Sonlarni ayirish'],
                answer: 1,
                explanation: '= — BIRIKTIRISH OPERATORI. O‘ngdagi qiymat chapdagi o‘zgaruvchiga yoziladi.'
              },
              {
                question: 'Qaysi o‘zgaruvchi nomi TO‘G‘RI?',
                options: ['1-ism', 'ism familiya', 'ism_familiya', '@ism'],
                answer: 2,
                explanation: 'snake_case — to‘g‘ri usul: so‘zlar orasiga _ qo‘yiladi, kichik harflar.'
              },
              {
                question: 'Qaysi o‘zgaruvchi nomi XATO?',
                options: ['narx_1', '_yashirin', '2son', 'ob_havo'],
                answer: 2,
                explanation: 'O‘zgaruvchi nomi RAQAM BILAN BOSHLANMASLI KERAK. 2son — xato.'
              },
              {
                question: 'a = 5; a = "besh"; print(a) kodining natijasi nima?',
                options: ['5', '"besh"', 'besh', 'Xatolik'],
                answer: 2,
                explanation: 'Python da o‘zgaruvchi turi o‘zgarishi mumkin. Avval 5, keyin "besh" — oxirgi qiymat chop qilinadi.'
              },
              {
                question: 'x, y = 10, 20 dan keyin print(y) natijasi nima?',
                options: ['10', '20', 'x, y', 'Xatolik'],
                answer: 1,
                explanation: 'Bir qatorda qiymat berishda mos ravishda: x=10, y=20.'
              },
              {
                question: 'input() funksiyasi qanday turda qiymat qaytaradi?',
                options: ['Butun son (int)', 'Matn (string)', 'Haqiqiy son (float)', 'Mantiqiy (bool)'],
                answer: 1,
                explanation: 'input() DOIM STRING (matn) qaytaradi. Raqam kerak bo‘lsa alohida aylantirish kerak.'
              },
              {
                question: 'x = y = z = 5 dan keyin print(x, y, z) natijasi?',
                options: ['x y z', '5 5 5', '5 y z', 'Xatolik'],
                answer: 1,
                explanation: 'Bir vaqtning o‘zida bir nechta o‘zgaruvchiga bir xil qiymat berish.'
              }
            ]
          }
        },
        {
          title: 'Ma‘lumot turlari',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Oldingi darsda o‘zgaruvchilarni o‘rgandik. Har bir o‘zgaruvchining SAQLANADIGAN MA'LUMOT TURI bor. Bugun ularni batafsil o‘rganamiz: int, float, string, bool va type() funksiyasi.',
            sections: [
              {
                title: 'Asosiy ma'lumot turlari',
                text: 'Python da 4 ta asosiy primitive (oddiy) ma'lumot turi mavjud:\n\n1. **int** — butun sonlar (musbat va manfiy): 5, -10, 0, 1000\n2. **float** — haqiqiy sonlar (nuqtali): 3.14, -2.5, 0.0, 1.0\n3. **str** — string (matn): "Salom", \'Ali\', "123"\n4. **bool** — mantiqiy qiymatlar: True (rost) yoki False (yolg‘on)',
                code: '# int — butun son\nyosh = 25\n\n# float — nuqtali son\npi = 3.14\n\n# str — matn\nism = "Zokir"\n\n# bool — mantiqiy\nturkum = True  # yoki False\n\nprint(yosh, type(yosh))\nprint(pi, type(pi))\nprint(ism, type(ism))\nprint(turkum, type(turkum))',
                codeNote: 'type() funksiyasi o‘zgaruvchi yoki qiymatning TURINI ko‘rsatadi.',
                result: '25 <class \'int\'>\n3.14 <class \'float\'>\nZokir <class \'str\'>\nTrue <class \'bool\'>',
                note: 'Python da turni oldindan ko‘rsatmasangiz ham avtomatik aniqlanadi — lekin har doim bilishingiz kerak qaysi turda ekanligini.'
              },
              {
                title: 'int — Butun sonlar',
                text: 'int turi butun sonlar uchun ishlatiladi. Cheksiz katta yoki kichik butun sonlarni saqlash mumkin (xotira yetarli bo‘lsa).',
                code: 'musbat = 100\nmanfiy = -50\nnol = 0\nkatta_son = 99999999999999999999999999\n\nprint(musbat + manfiy)  # 50\nprint(katta_son * 2)',
                codeNote: 'Java kabi tillarda int chegaralangan, Python da int cheksizdir.',
                result: '50\n199999999999999999999999998',
                note: 'int sonlar ustida barcha arifmetik amallarni bajarish mumkin.'
              },
              {
                title: 'float — Haqiqiy (nuqtali) sonlar',
                text: 'float turi nuqtali sonlar uchun. Katta yoki kichik haqiqiy sonlarni saqlaydi.',
                code: 'narx = 9.99\npi = 3.14159\nmanfiy_float = -15.5\n\nprint(narx + pi)\nprint(manfiy_float * 2)',
                codeNote: 'Nuqta . ishlatiladi, vergul emas! 3,14 — xato, 3.14 — to‘g‘ri.',
                result: '13.13159\n-31.0',
                note: 'float bilan int ni qo‘shsangiz natija float bo‘ladi: 5 + 3.0 = 8.0'
              },
              {
                title: 'str — String (matn)',
                text: 'string — matn. Qo‘yshtirnoq ichiga yoziladi: " " yoki \' \'. Ikkalasi ham bir xil. String ustida ko‘plab amallar bajarish mumkin (keyingi darsda batafsil).',
                code: 'matn1 = "Salom, dunyo!"\nmatn2 = \'Python juda qulay\'\nraqam_matn = "12345"  # Bu son emas, MATN!\n\nprint(matn1)\nprint(matn2)\nprint(raqam_matn + "6")  # 123456 (qo‘shish emas, qo‘shilish)',
                codeNote: '"123" raqam emas, bu MATN. Uni int("123") qilib sona aylantirish kerak.',
                result: 'Salom, dunyo!\nPython juda qulay\n123456',
                note: 'Ko‘p qatorli matn uchun uchta qo‘yshtirnoq """ """ ishlatiladi.'
              },
              {
                title: 'bool — Mantiqiy qiymatlar',
                text: 'bool turi faqat 2 ta qiymatga ega: True (rost) yoki False (yolg‘on). Ular katta harf bilan boshlanadi va qo‘yshtirnoq ICHIDA EMAS. Shart operatorlarida keng qo‘llaniladi.',
                code: 'tugilgan_joyi_uzbek = True\nqariganmi = False\n\nprint(tugilgan_joyi_uzbek)\nprint(qariganmi)\n\n# Mantiqiy amallar natijasi ham bool bo‘ladi\nprint(5 > 3)   # True\nprint(10 == 5) # False',
                codeNote: '== — tenglikni tekshiradi (bitta = emas, ikkita ==).',
                result: 'True\nFalse\nTrue\nFalse',
                note: 'True = 1, False = 0 hisoblanadi. Misol uchun True + True = 2.'
              },
              {
                title: 'Turlarni o‘zgartirish (Type Conversion)',
                text: 'Ba’zida bir turdagi ma'lumotni boshqa turga aylantirish kerak bo‘ladi. Buning uchun int(), float(), str() funksiyalaridan foydalaniladi.',
                code: '# str → int\nya = "25"\nprint(int(ya) + 5)  # 30\n\n# int → str\nage = 30\nprint("Yosh: " + str(age))  # Yosh: 30\n\n# int → float\nx = 10\nprint(float(x))  # 10.0\n\n# float → int (nuqta orti kesiladi)\npi = 3.99\nprint(int(pi))  # 3 (4 emas, faqat butun qism!)',
                codeNote: 'int(3.99) — 3 ni qaytaradi, 4 emas! Yuqoriga yaxlitlamaydi, faqat nuqta ortisini kesadi.',
                result: '30\nYosh: 30\n10.0\n3',
                note: 'Aniqlay olmaydigan narsani aylantirish xato beradi: int("salom") — ValueError!'
              }
            ],
            keyPoints: [
              'Asosiy turlar: int (butun), float (nuqtali), str (matn), bool (True/False)',
              'type(qiymat) — turini aniqlash',
              'String uchun " " yoki \' \' — ikkalasi ham bir xil',
              '"123" — MATN, 123 — SON: ularni aralashtirmang!',
              'True va False katta harf bilan yoziladi',
              'int("25") — matnni songa, str(30) — sonni matnga aylantiradi',
              'int(3.99) = 3 — nuqta ortisini KESADI, yaxlitlamaydi'
            ],
            masterXp: 30,
            homework: '1. 4 ta o‘zgaruvchi yarating: int, float, str, bool turlarida va ularni type() bilan chop qiling.\n2. "100" degan matnni int ga aylantiring va 50 ni qo‘shib chop qiling.\n3. 75 degan sonni str ga aylantiring va "Yosh: " bilan qo‘shib chop qiling.\n4. 9.81 degan float ni int ga aylantiring va natijani chop qiling (nima chiqishiga ishonch hosil qiling!).\n5. (Challenge) "3.14" matnini AVVAL float ga, keyin INT ga aylantiring va chop qiling.',
            summary: 'Bugun 4 ta asosiy ma'lumot turini o‘rgandik: int, float, str, bool. Va ularni bir-biriga aylantirishni o‘rgandik. Keyingi dars — operatorlar!',
            exercises: [
              {
                id: 'py3ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Tur aylantirish 🔄',
                instruction: '"500" degan MATNni int ga aylantiring va 200 ni qo‘shib, print() bilan chop qiling.',
                startCode: '# Bu yerga kodingizni yozing\nson_matn = "500"\n',
                checks: [
                  { re: 'int\\s*\\(\\s*son_matn\\s*\\)\\s*\\+\\s*200', msg: 'int(son_matn) + 200 ni ishlating' }
                ],
                hint: 'int() funksiyasi yordamida matnni songa aylantiring, keyin 200 qo‘shing.',
                explanation: '"500" — matn. int("500") = 500. Keyin 500 + 200 = 700.',
                xp: 10
              },
              {
                id: 'py3ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Turlarni moslang 🧩',
                instruction: 'Har bir qiymat o‘z TURIGA mos tushadigan qilib bog‘lang (dragdrop orqali tartiblang).',
                hint: 'int = butun, float = nuqtali, str = qo‘yshtirnoqli, bool = True/False',
                items: ['25', '3.14', '"Salom"', 'True'],
                xp: 10
              },
              {
                id: 'py3ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kodda bitta XATO bor — ishga tushganda ValueError beradi. Uni toping.',
                code: 'a = "yuz"\nb = int(a)\nprint(b)',
                options: ['print(b) — chop qilmagan', '"yuz" — int ga aylantirib bo‘lmaydi', 'a o‘zgaruvchi nomi qisqa', 'int() kerak emas'],
                answer: 1,
                explanation: 'int("yuz") — XATO! Chunki "yuz" raqam emas — shunday so‘zni songa aylantirib bo‘lmaydi. int("100") — to‘g‘ri.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Qaysi biri int (butun son) turi?',
                options: ['3.14', '"25"', '100', 'True'],
                answer: 2,
                explanation: 'int — butun son. 100 — butun, 3.14 — float, "25" — str, True — bool.'
              },
              {
                question: 'type(3.14) natijasi nima?',
                options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'bool\'>'],
                answer: 1,
                explanation: '3.14 — nuqtali son, demak float.'
              },
              {
                question: '"25" + "30" natijasi nima?',
                options: ['55', '"55"', '"2530"', 'Xatolik'],
                answer: 2,
                explanation: 'Bu IKKI MATN, qo‘shilish (concatenation) bo‘ladi: "25"+"30" = "2530".'
              },
              {
                question: 'int(3.9) natijasi nima?',
                options: ['3', '4', '3.9', 'Xatolik'],
                answer: 0,
                explanation: 'int() nuqta ortisini KESADI, yaxlitlamaydi. int(3.9) = 3.'
              },
              {
                question: 'str(50) + " yosh" natijasi?',
                options: ['100', '"50 yosh"', '"50+yosh"', 'Xatolik'],
                answer: 1,
                explanation: 'str(50) = "50", keyin qo‘shiladi: "50" + " yosh" = "50 yosh".'
              },
              {
                question: 'bool turi qanday qiymatlarni qabul qiladi?',
                options: ['1 va 0', 'True va False', '"ha" va "yo‘q"', 'Musbat va manfiy'],
                answer: 1,
                explanation: 'bool — faqat 2 qiymat: True (rost) va False (yolg‘on). Katta harf bilan yoziladi!'
              },
              {
                question: 'Qaysi kodda TO‘G‘RI aylantirish bor?',
                options: ['int("salom")', 'float("3.14")', 'str(50) + 5', 'bool("False")'],
                answer: 1,
                explanation: 'float("3.14") = 3.14 — to‘g‘ri. Qolganlari: xato yoki kutilmagan natija.'
              },
              {
                question: 'print(True + True) natijasi nima?',
                options: ['TrueTrue', '2', 'True', 'Xatolik'],
                answer: 1,
                explanation: 'True = 1, False = 0. 1 + 1 = 2.'
              }
            ]
          }
        },
        {
          title: 'Operatorlar',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Endi Python da ishlatiladigan operatorlarni o‘rganamiz. Arifmetik, taqqoslash, mantiqiy, tayinlash va boshqa operatorlar bor — ularni misollar bilan ko‘rib chiqamiz.',
            sections: [
              {
                title: 'Arifmetik operatorlar',
                text: 'Arifmetik amallar uchun ishlatiladi:\n\n• `+` — qo‘shish\n• `-` — ayirish\n• `*` — ko‘paytirish\n• `/` — bo‘lish (natijasi float)\n• `//` — butun qismga bo‘lish (butun son qaytaradi)\n• `%` — qoldiqni olish\n• `**` — darajaga ko‘tarish',
                code: 'a = 10\nb = 3\n\nprint("Qo‘shish:", a + b)      # 13\nprint("Ayirish:", a - b)       # 7\nprint("Ko‘paytirish:", a * b)  # 30\nprint("Bo‘lish:", a / b)       # 3.333...\nprint("Butun qism:", a // b)   # 3\nprint("Qoldiq:", a % b)        # 1\nprint("Daraja:", a ** b)       # 1000',
                codeNote: '10 / 3 = 3.333 (float), 10 // 3 = 3 (butun qism), 10 % 3 = 1 (qoldiq).',
                result: 'Qo‘shish: 13\nAyirish: 7\nKo‘paytirish: 30\nBo‘lish: 3.3333333333333335\nButun qism: 3\nQoldiq: 1\nDaraja: 1000',
                note: '% operatori — juft/to‘q sonlarni aniqlashda juda foydali. 4 % 2 = 0 → juft son.'
              },
              {
                title: 'Taqqoslash operatorlari',
                text: 'Ikki qiymatni solishtiradi. Har doim BOOL (True/False) qaytaradi:\n\n• `==` — tengmi?\n• `!=` — teng emasmi?\n• `>` — kattami?\n• `<` — kichikmi?\n• `>=` — kattami yoki tengmi?\n• `<=` — kichikmi yoki tengmi?',
                code: 'a = 10\nb = 5\n\nprint(a == b)  # False\nprint(a != b)  # True\nprint(a > b)   # True\nprint(a < b)   # False\nprint(a >= 10) # True\nprint(b <= 3)  # False',
                codeNote: 'Eslatma: == — taqqoslash, = — tayinlash. Bu ikkisi BUTUNLAYDI BOSHQA NARSALAR!',
                result: 'False\nTrue\nTrue\nFalse\nTrue\nFalse',
                note: 'Matnlarni ham taqqoslash mumkin: "ali" < "vali" — True (alfavit bo‘yicha).'
              },
              {
                title: 'Mantiqiy operatorlar',
                text: 'Bool qiymatlar bilan ishlaydi:\n\n• `and` — va (ikkalasi ham True bo‘lsa True)\n• `or` — yoki (bittasi ham True bo‘lsa True)\n• `not` — inkor (True → False, False → True)',
                code: 'yosh = 20\ntalaba = True\n\n# 18 dan katta VA talaba bo‘lsin\nprint(yosh > 18 and talaba)  # True\n\n# 60 dan katta YOKI 10 dan kichik\nprint(yosh > 60 or yosh < 10)  # False\n\n# inkor\nprint(not talaba)  # False',
                codeNote: 'and: ikkalasi ham True → True; or: bittasi True → True.',
                result: 'True\nFalse\nFalse',
                note: 'Mantiqiy operatorlarni murakkab shartlar yozishda keng ishlatiladi.'
              },
              {
                title: 'Tayinlash operatorlari',
                text: 'Qiymatni tezroq o‘zgartirish uchun:\n\n• `=` — oddiy tayinlash\n• `+=` — qo‘shib tayinlash (a = a + b)\n• `-=` — ayirib tayinlash\n• `*=` — ko‘paytirib tayinlash\n• `/=` — bo‘lib tayinlash',
                code: 'son = 10\nson += 5   # son = son + 5 → 15\nprint(son)\n\nson -= 3   # 15 - 3 = 12\nprint(son)\n\nson *= 2   # 12 * 2 = 24\nprint(son)\n\nson //= 5  # 24 // 5 = 4\nprint(son)',
                codeNote: 'Bu operatorlar kodni qisqartirish uchun juda qulay.',
                result: '15\n12\n24\n4',
                note: 'Bu operatorlarga "shorthand" ham deyiladi.'
              },
              {
                title: 'Stringlar ustida arifmetik operatorlar',
                text: 'String bilan + va * ishlaydi:\n\n• `+` — stringlarni BIRLASHTIRADI (concatenation)\n• `*` — stringni TAKRORLAYDI',
                code: 'ism = "Ali"\nfamiliya = "Valiyev"\n\n# + orqali qo‘shish\nprint(ism + " " + familiya)  # Ali Valiyev\n\n# * orqali takrorlash\nprint("-" * 20)  # 20 ta chiziq\nprint("Ha! " * 3)  # Ha! Ha! Ha!',
                codeNote: 'Ammo int bilan str ni to‘g‘ridan-to‘g‘ri + qila olmaysiz! str() ga aylantiring: str(5) + " ta".',
                result: 'Ali Valiyev\n--------------------\nHa! Ha! Ha! ',
                note: '"Salom" * 0 → bo‘sh string, "Salom" * (-2) → ham bo‘sh string.'
              }
            ],
            keyPoints: [
              'Arifmetik: +, -, *, / (float), // (butun), %, ** (daraja)',
              'Taqqoslash: ==, !=, >, <, >=, <= — har doim bool qaytaradi',
              'Mantiqiy: and, or, not',
              'Tayinlash: =, +=, -=, *=, /=',
              '== (taqqoslash) va = (tayinlash)ni ARALASHTIRMANG!',
              'String + string = birlashuv, string * son = takrorlash',
              '% juft/to‘q aniqlashda qulay: son % 2 == 0 → juft'
            ],
            masterXp: 30,
            homework: '1. 15000 sonni 7 ga bo‘lganda BUTUN QISMI va QOLDIQNI alohida chop qiling.\n2. 5 ning 4-darajasini chop qiling.\n3. (a=20, b=15) uchun barcha taqqoslash operatorlarini sinab ko‘ring va natijalarni chop qiling.\n4. (yosh=17) — "yosh 18 dan katta YOKI 10 dan kichik" degan shartni chop qiling (True/False).\n5. "=" * 50 ni chop qiling — chiziq hosil qiling.\n6. (Challenge) 2024-yilda 1998-yilda tug‘ilgan odam yoshini hisoblovchi kod yozing.',
            summary: 'Bugun operatorlarni o‘rgandik: arifmetik, taqqoslash, mantiqiy, tayinlash. Keyingi dars — String‘lar bilan ishlash!',
            exercises: [
              {
                id: 'py4ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Kvadratni hisoblash 🔢',
                instruction: '17 sonining KVADRATINI (2-darajasini) hisoblang va chop qiling.',
                startCode: '# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: '17\\s*\\*\\*\\s*2|17\\s*\\*\\s*17', msg: '** operatoridan foydalaning: 17 ** 2 yoki 17 * 17' }
                ],
                hint: '** operatori darajaga ko‘taradi: son ** 2.',
                explanation: '17 ** 2 = 289. Yoki 17 * 17 ham mumkin.',
                xp: 10
              },
              {
                id: 'py4ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Juft sonni aniqlash 🧩',
                instruction: '"son juft son" ni tekshiruvchi kod qismlarini to‘g‘ri tartibga joylashtiring. (son % 2 == 0 → juft)',
                hint: 'son → % → 2 → == → 0',
                items: ['son', '%', '2', '==', '0'],
                xp: 10
              },
              {
                id: 'py4ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"son 10 ga tengmi" degan shartni tekshiruvchi kodda xato bor. Uni toping.',
                code: 'son = 10\nif son = 10:\n    print("Barakalla!")',
                options: ['print qavslar yopilmagan', '= emas, == ishlatilishi kerak', 'if so‘zi katta harf', 'son 10 emas'],
                answer: 1,
                explanation: 'son = 10 — bu TAYINLASH. TEKSHIRISH uchun == kerak: son == 10. Eng keng tarqalgan xatolardan biri bu!'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: '17 % 5 natijasi nima?',
                options: ['3', '2', '3.4', '12'],
                answer: 1,
                explanation: '17 ni 5 ga bo‘lganda qoldiq: 5*3=15, 17-15=2. Natija: 2.'
              },
              {
                question: '10 // 3 natijasi?',
                options: ['3.33', '3', '4', '1'],
                answer: 1,
                explanation: '// — butun qismga bo‘lish. 10 // 3 = 3.'
              },
              {
                question: '5 ** 3 natijasi?',
                options: ['15', '125', '8', '53'],
                answer: 1,
                explanation: '** — darajaga ko‘tarish. 5^3 = 5*5*5 = 125.'
              },
              {
                question: '"Python" + " " + "3" natijasi?',
                options: ['Python 3', '"Python 3"', 'Python3', 'Xatolik'],
                answer: 0,
                explanation: 'Stringlar + bilan qo‘shiladi (birlashadi): "Python" + " " + "3" = "Python 3".'
              },
              {
                question: '10 >= 10 va 5 != 6 — natijalar mos ravishda?',
                options: ['True, True', 'False, True', 'True, False', 'False, False'],
                answer: 0,
                explanation: '10 >= 10 → True (teng); 5 != 6 → True (teng emas). Ikkalasi ham True.'
              },
              {
                question: 'x = 5; x += 3; print(x) natijasi?',
                options: ['5', '3', '8', '53'],
                answer: 2,
                explanation: 'x += 3 → x = x + 3 = 5 + 3 = 8.'
              },
              {
                question: 'True and False, True or False — natijalar?',
                options: ['True, True', 'False, True', 'True, False', 'False, False'],
                answer: 1,
                explanation: 'and: ikkalasi ham True → True, shuning uchun False; or: bittasi True → True.'
              },
              {
                question: '"Ha!" * 3 natijasi?',
                options: ['Ha!Ha!Ha!', 'Ha!3', '3 Ha!', 'Xatolik'],
                answer: 0,
                explanation: '* operatori stringni takrorlaydi: "Ha!" + "Ha!" + "Ha!" = "Ha!Ha!Ha!".'
              }
            ]
          }
        },
        {
          title: 'String‘lar bilan ishlash',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun string (matn) bilan ishlashni chuqurro‘rganamiz. Indeks, kesish (slicing), methodlar, formatlash va boshqa ko‘plab qulay xususiyatlarni misollar bilan ko‘ramiz.',
            sections: [
              {
                title: 'Stringning uzunligi va indekslash',
                text: 'String — belgilar zanjiri. Har bir belgining o‘z tartib raqami (INDEKS) bor. INDEKS 0 (NOL) dan boshlanadi!\n\nlen() funksiyasi uzunlikni qaytaradi.',
                code: 'matn = "Python"\nprint("Uzunlik:", len(matn))  # 6\n\n# Indekslar: 0:P 1:y 2:t 3:h 4:o 5:n\nprint(matn[0])   # P\nprint(matn[1])   # y\nprint(matn[5])   # n\n\n# Manfiy indeks (oxiridan boshlab)\nprint(matn[-1])  # n (oxirgi belgi)\nprint(matn[-2])  # o',
                codeNote: 'String uzunligi N ta bo‘lsa, indekslar 0 dan N-1 gacha. Oxirgi belgi = -1 indeks.',
                result: 'Uzunlik: 6\nP\ny\nn\nn\no',
                note: 'Mavjud bo‘lmagan indeksga murojaat qilsangiz IndexError olasiz: matn[100] — xato.'
              },
              {
                title: 'Slicing (kesish)',
                text: 'Stringning bir qismini olish uchun slicing ishlatiladi: matn[start:end:step]\n\n• start — qayerdan boshlash (shu indeksdan)\n• end — qayergacha (shu indeksgacha KIRMAGAN HOLDA)\n• step — qadam (har qancha belgidan keyin olish)',
                code: 's = "ABCDEFGH"  # 0:A 1:B 2:C 3:D 4:E 5:F 6:G 7:H\n\nprint(s[2:5])    # CDE (2,3,4 indekslar)\nprint(s[:4])     # ABCD (boshidan 4 gacha)\nprint(s[3:])     # DEFGH (3 dan oxirigacha)\nprint(s[::2])    # ACEG (har 2-qadam)\nprint(s[::-1])   # HGFEDCBA (teskariga — juda foydali!)',
                codeNote: 's[2:5] — 2 dan 5 gacha, 5 kirmaydi. s[::-1] — stringni AYNAN TESKARIGA aylantiradi!',
                result: 'CDE\nABCD\nDEFGH\nACEG\nHGFEDCBA',
                note: 'step = -1 bo‘lsa string orqa tomondan o‘qiladi (reverse). Polindrom tekshirish uchun juda qulay!'
              },
              {
                title: 'String methodlar — 1-qism',
                text: 'String uchun ko‘plab methodlar mavjud. Ba’zilari:\n\n• upper() — barchasini katta harfga\n• lower() — barchasini kichik harfga\n• capitalize() — birinchi harfni katta\n• title() — har so‘zning birinchi harfini katta\n• strip() — boshi va oxiridagi bo‘sh joylarni olib tashlaydi',
                code: 's = "   salom python dasturlash   "\n\nprint(s.upper())        # SALOM PYTHON DASTURLASH\nprint(s.lower())        # (bu yerda ham kichik)\nprint(s.capitalize())   #   salom python... birinchi so‘z katta\nprint(s.title())        #   Salom Python Dasturlash\nprint(s.strip())        # "salom python dasturlash" (bo‘sh joylar yo‘q)',
                codeNote: 'Methodlar stringni O‘ZGARTIRMAYDI, u YANGI string qaytaradi. Chunki string immutable (o‘zgarmas).',
                result: '   SALOM PYTHON DASTURLASH   \n   salom python dasturlash   \n   salom python dasturlash   \n   Salom Python Dasturlash   \nsalom python dasturlash',
                note: 'String o‘zgarmasdir (immutable). s = s.upper() qilishingiz kerak, yangi qiymatni yozib qo‘yish uchun.'
              },
              {
                title: 'String methodlar — 2-qism',
                text: 'Yana bir nechta foydali methodlar:\n\n• find("q") — qaysi indeksda bor (yo‘q bo‘lsa -1)\n• replace("a","b") — a ni b ga almashtirish\n• count("a") — necha marta takrorlangan\n• startswith("s") — shu bilan boshlanadimi?\n• endswith("n") — shu bilan tugaydimi?\n• split() — bo‘sh joydan bo‘lib list qaytaradi',
                code: 's = "Python Python til juda qulay"\n\nprint(s.find("til"))       # 14 (qayerda boshlanadi)\nprint(s.replace("Python", "Java"))  # Java Java til...\nprint(s.count("Python"))   # 2\nprint(s.startswith("Py"))  # True\nprint(s.endswith("qulay")) # True\nprint(s.split())           # [\'Python\', \'Python\', \'til\', \'juda\', \'qulay\']',
                codeNote: 'split() — list (ro‘yxat) qaytaradi. Keyingi darslarda list bilan batafsil tanishamiz.',
                result: '14\nJava Java til juda qulay\n2\nTrue\nTrue\n[\'Python\', \'Python\', \'til\', \'juda\', \'qulay\']',
                note: 'find() va index() farqi: find() -1 qaytaradi, index() esa xato beradi (agar topilmasa).'
              },
              {
                title: 'String formatlash',
                text: 'String ichiga o‘zgaruvchi qiymatlarini joylashtirishning 3 ta usuli bor. Eng zamonaviy va qulay — f-string (Python 3.6+).',
                code: 'ism = "Zarina"\nyosh = 22\nshahar = "Samarqand"\n\n# 1-usul: + operatori (qoniqarsiz)\nprint("Ism: " + ism + ", yosh: " + str(yosh))\n\n# 2-usul: format() method (eski usul)\nprint("Ism: {}, yosh: {}, shahar: {}".format(ism, yosh, shahar))\n\n# 3-usul: f-string (ENG QULAY!) — string oldida f\nprint(f"Ism: {ism}, yosh: {yosh}, shahar: {shahar}")\nprint(f"5 yildan keyin: {yosh + 5} yosh")  # ichida ham hisoblash mumkin!',
                codeNote: 'f-string — eng o‘qiladigan va qulay usul. {} ichida o‘zgaruvchi yoki ifoda yoziladi.',
                result: 'Ism: Zarina, yosh: 22\nIsm: Zarina, yosh: 22, shahar: Samarqand\nIsm: Zarina, yosh: 22, shahar: Samarqand\n5 yildan keyin: 27 yosh',
                note: 'f-string ichida arifmetik amallar, chaqiruvlar ham ishlaydi: f"{a} + {b} = {a+b}".'
              },
              {
                title: 'in operatori — bormi yo‘qmi tekshirish',
                text: 'in operatori yordamida belgi yoki so‘z string ichida bormi yo‘qmi tekshiriladi. Natija True/False.',
                code: 'matn = "Python - dasturlash tili"\n\nprint("Python" in matn)   # True\nprint("java" in matn)     # False\nprint("java" not in matn) # True\nprint("t" in matn)        # True (katta-kichik farq qiladi!)',
                codeNote: 'Katta-kichik harf FARQ QILADI. "Python" bor, lekin "python" yo‘q.',
                result: 'True\nFalse\nTrue\nTrue',
                note: 'in operatori list, tuple va boshqa to‘plamlarda ham ishlaydi.'
              }
            ],
            keyPoints: [
              'Indeks 0 dan boshlanadi; -1 — oxirgi belgi',
              'len(s) — uzunlik',
              'Slicing: s[start:end:step]; s[::-1] — teskari',
              'upper, lower, strip, replace, find, count, split methodlari',
              'String IMMUTABLE (o‘zgarmas) — yangi string qaytaradi',
              'f-string — f"{ism}" — eng qulay formatlash usuli',
              'in operatori — bor/yo‘q tekshirish'
            ],
            masterXp: 35,
            homework: '1. "Dasturlash" so‘zining 1-, 5- va oxirgi belgilarini chop qiling.\n2. "ABCDEFG" dan "CDE" qismini kesib chop qiling (slicing).\n3. "Salom Dunyo" so‘zini teskariga aylantiring va chop qiling.\n4. "   men python o‘rganaman   " — bo‘sh joylarini tozalang, har so‘z bosh harf bilan yozilsin.\n5. "ananas" so‘zida nechta "a" harfi borligini count() orqali aniqlang.\n6. f-string yordamida: ism = "Otabek", yosh = 28, so'rovchi = "Mehrobek". "Salom, {ism}! Siz {yosh} yoshsiz. — {so'rovchi}" ni chop qiling.\n7. (Challenge) Palindrom tekshirish: "aziza" so‘zi o‘zi bilan teskari bir xilmi? in orqali emas s[::-1] bilan solishtiring.',
            summary: 'Bugun string bilan ishlashni chuqur o‘rgandik: indeks, slicing, methodlar, f-string, in. Keyingi dars — If / Else!',
            exercises: [
              {
                id: 'py5ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Teskari aylantirish 🔄',
                instruction: '"qalaysiz" so‘zini TESKARIGA aylantiring va chop qiling (slicing orqali).',
                startCode: 's = "qalaysiz"\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 's\\s*\\[\\s*::\\s*-1\\s*\\]', msg: 's[::-1] dan foydalaning' }
                ],
                hint: 'slicing da step = -1 → teskari.',
                explanation: 's[::-1] → zisyalaq. So‘z teskari o‘qiladi.',
                xp: 10
              },
              {
                id: 'py5ex2',
                type: 'dragdrop',
                title: '2-MASHQ — f-string yig‘ish 🧩',
                instruction: 'f-string bilan to‘g‘ri formatlashni yig‘ing: "Salom, {ism}!".',
                hint: 'f → " → Salom, → {ism} → ! → "',
                items: ['f', '"', 'Salom, ', '{ism}', '!', '"'],
                xp: 10
              },
              {
                id: 'py5ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi niyatda "Alisher" ni katta harfga aylantirish kodida xato bor.',
                code: 'ism = "Alisher"\nism.upper()\nprint(ism)  # Nima uchun "Alisher" chiqdi, "ALISHER" emas?',
                options: ['upper() methodi noto‘g‘ri ishlatilgan', 'String immutable, natijani yozib qo‘yilmadi', 'print qavs ichida ism emas, upper() kerak', 'ism so‘zi noto‘g‘ri'],
                answer: 1,
                explanation: 'String o‘zgarmasdir (immutable)! upper() yangi string qaytaradi, lekin uni ismlarga qayta yozmadik. To‘g‘ri: ism = ism.upper() yoki print(ism.upper()).'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: '"Python"[0] va "Python"[-1] qiymatlari?',
                options: ['P, n', 'y, n', 'P, P', 'n, P'],
                answer: 0,
                explanation: '[0] — birinchi belgi: P. [-1] — oxirgi: n.'
              },
              {
                question: 'len("Salom Dunyo") natijasi? (bo‘sh joy ham hisoblanadi)',
                options: ['10', '11', '9', '12'],
                answer: 1,
                explanation: 'S-a-l-o-m- (bo‘sh)-D-u-n-y-o → jami 11 ta belgi.'
              },
              {
                question: '"ABCDEFG"[2:5] qiymati?',
                options: ['BCD', 'CDE', 'CDEF', 'BCDE'],
                answer: 1,
                explanation: '2-indeksdan 5-gacha, 5 kirmaydi. 2=C, 3=D, 4=E → CDE.'
              },
              {
                question: '"abc123"[::-1] natijasi?',
                options: ['abc123', '321cba', 'cba321', 'Xatolik'],
                answer: 1,
                explanation: 's[::-1] — teskari aylantiradi: "321cba".'
              },
              {
                question: '"Salom".upper().endswith("M") — natija?',
                options: ['True', 'False', '"SALOM"', 'Xatolik'],
                answer: 0,
                explanation: 'upper() → "SALOM"; endswith("M") → oxiri "M" bilan tugaydi → True.'
              },
              {
                question: '"ananas".count("a") — nechta?',
                options: ['2', '3', '4', '1'],
                answer: 1,
                explanation: 'a-n-a-n-a-s → 3 ta "a" bor.'
              },
              {
                question: 'To‘g‘ri f-string qaysi?',
                options: ['"Ism: {ism}"', 'f"Ism: {ism}"', 'format("Ism: {}", ism)', 'f\'Ism: [ism]\''],
                answer: 1,
                explanation: 'String OLDIDA f qo‘yiladi, {} ichida o‘zgaruvchi. f"Ism: {ism}" — to‘g‘ri.'
              },
              {
                question: '"yil" in "2024 yil yanvar" — natija?',
                options: ['True', 'False', '-1', 'Xatolik'],
                answer: 0,
                explanation: '"yil" so‘zining ichida borligi aniq → True.'
              }
            ]
          }
        },
        {
          title: 'If / Else',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun dasturimizga MIYANI qo‘shamiz — shart operatori If/Else. U yordamida dasturimiz har xil shartlar asosida turli xil harakatlarni bajaradi.',
            sections: [
              {
                title: 'if — agar (agar shart bajarilsa)',
                text: 'if operatori quyidagi ko‘rinishda ishlatiladi:\n\nif SHART:\n    # amallar (indentatsiya — 4 bo‘sh joy!)    \n\nSHART True bo‘lsa (rost bo‘lsa) — ichidagi kod ishlaydi. False bo‘lsa — o‘tib ketadi.\n\n⚠️ MUHIM: Python da INDENTATSIYA (ichkariga surish) juda muhim! 4 bo‘sh joy.',
                code: 'yosh = 20\n\nif yosh >= 18:\n    print("Siz balog‘atga yetgansiz!")\n    print("Saytga kirishingiz mumkin.")\n\nprint("Dastur tugadi.")',
                codeNote: 'yosh = 20, 18 >= True → ikkala print ham ishlaydi. yosh 17 bo‘lsa, bu qatorlar ishlamaydi.',
                result: 'Siz balog‘atga yetgansiz!\nSaytga kirishingiz mumkin.\nDastur tugadi.',
                note: 'Indentatsiya (4 space) — shartning qaysi qatorlari unga tegishli ekanligini bildiradi. Java/C ning {} o‘rniga.'
              },
              {
                title: 'if / else — agar... aks holda',
                text: 'if True bo‘lsa bir narsa, False bo‘lsa boshqa narsa qilish uchun else qo‘shiladi.',
                code: 'yosh = 15\n\nif yosh >= 18:\n    print("Kiring!")\nelse:\n    print("Kira olmaysiz — yoshingiz kam!")\n    print("18 dan keyin qayta urinib ko‘ring.")\n\nprint("Xayr!")',
                codeNote: 'yosh < 18 → else qismi ishlaydi. Ikkalasi birdaniga hech qachon ishlamaydi.',
                result: 'Kira olmaysiz — yoshingiz kam!\n18 dan keyin qayta urinib ko‘ring.\nXayr!',
                note: 'else dan keyin SHART YO‘Q. u avtomatik "boshqa hollarda" degan ma’noni bildiradi.'
              },
              {
                title: 'if / elif / else — bir nechta shartlar',
                text: 'Bir nechta shartlar ketma-ket tekshirilishi kerak bo‘lsa elif ishlatiladi (else if). Birinchi TRUE bo‘lgan shart ishlaydi, qolganlari tekshirilmaydi!',
                code: 'ball = 85\n\nif ball >= 90:\n    print("5 — zo‘r!")\nelif ball >= 80:\n    print("4 — yaxshi!")\nelif ball >= 70:\n    print("3 — qoniqarli")\nelif ball >= 60:\n    print("2 — kamchilik")\nelse:\n    print("1 — imtihondan o‘tmadingiz")\n\nprint("Dastur tugadi")',
                codeNote: 'ball=85: birinchi (>=90) → False, keyin elif >=80 → True! "4 — yaxshi!" chop qilinadi. Keyingi shartlar hech qachon tekshirilmaydi.',
                result: '4 — yaxshi!\nDastur tugadi',
                note: 'Shartlar tartibi juda muhim! Avval kattaroq ball tekshirilishi kerak.'
              },
              {
                title: 'Murakkab shartlar (and / or)',
                text: 'Shartni murakkab qilish uchun and/or operatorlari ishlatiladi.',
                code: 'yosh = 22\ntalaba = True\npul = 50000\n\n# Yosh 18-30 oralig‘ida VA talaba bo‘lsin\nif 18 <= yosh <= 30 and talaba:\n    print("Chegirmaga ega! 30% chegirma.")\n    pul = int(pul * 0.7)\n    print(f"To‘lov: {pul} so‘m")\nelse:\n    print(f"To‘lov: {pul} so‘m")',
                codeNote: '18 <= yosh <= 30 — Python qulayligi (boshqa tillarda yo‘q). And da ikkala shart ham True bo‘lishi kerak.',
                result: 'Chegirmaga ega! 30% chegirma.\nTo‘lov: 35000 so‘m',
                note: '18 <= yosh <= 30 — qulay sintaksis! Bu yosh >= 18 and yosh <= 30 bilan bir xil.'
              },
              {
                title: 'Ichma-ich if (nested if)',
                text: 'if ichida yana if yozish mumkin. Lekin juda chuqur bo‘lmasligi kerak.',
                code: 'ism = "Bahrom"\nyosh = 20\n\nif ism == "Bahrom":\n    print("Salom, Bahrom!")\n    if yosh >= 18:\n        print("Siz 18+ yoshsiz")\n    else:\n        print("Siz haga bola ekansiz")\nelse:\n    print("Siz men tanimagan odamsiz")',
                codeNote: 'Tartib: ism Bahrom → ichidagi if yosh 20 → "18+" ham chop qilinadi.',
                result: 'Salom, Bahrom!\nSiz 18+ yoshsiz',
                note: 'Biroq, ko‘p hollarda murakkab shartlar (and/or) nested if dan yaxshiroq.'
              },
              {
                title: 'Ternary operator (qisqartirilgan if)',
                text: 'Bir qatorda if-else yozish mumkin. Qiymatni tanlash uchun juda qulay.',
                code: 'yosh = 17\n\n# Oddiy usul:\n# if yosh >= 18: status = "katta"\n# else: status = "kichik"\n\n# Qisqartirilgan (ternary):\nstatus = "katta" if yosh >= 18 else "kichik"\nprint(status)  # kichik\n\n# Yana misol\nson = -5\nqiymat = "musbat" if son > 0 else ("nol" if son == 0 else "manfiy")\nprint(qiymat)',
                codeNote: 'Ternary: qiymat = TRUE_QIYMAT if SHART else FALSE_QIYMAT.',
                result: 'kichik\nmanfiy',
                note: 'Ternary qisqa kodlar uchun juda qulay, lekin juda murakkab bo‘lsa tushunish qiyinlashadi.'
              }
            ],
            keyPoints: [
              'if SHART: — 4 space indentatsiya bilan',
              'else — boshqa hollarda, shartsiz',
              'elif — ko‘p shartlar, birinchi TRUE ishlaydi',
              'Shartlar tartibi muhim (kattaroq avval)',
              'and/or bilan murakkab shartlar',
              '18 <= yosh <= 30 — Python qulayligi',
              'Ternary: "a" if sh else "b"'
            ],
            masterXp: 35,
            homework: '1. son = int(input()) — foydalanuvchi son kiritadi. Juft bo‘lsa "Juft son", to‘q bo‘lsa "To‘q son" deb chop qiling.\n2. ball = 72 ni baholash: 90+ → 5, 80+ → 4, 70+ →3, 60+→2, 60<→1. elif bilan.\n3. yosh=45. "Faqat 18 dan 35 gacha bo‘lganlar ishlay oladi" — shart yozing.\n4. (t = 25) — ob-havo: t >=30 → "Issiq", 20-29 → "qulay", 10-19 → "salqin", <10 → "sovuq".\n5. a, b, c = 5, -2, 0. Ularning qaysi biri musbat? (and/or yoki ternary yoki nested).\n6. (Challenge) password = input(). len() >= 8 bo‘lsa "Kuchli parol", aks holda "Parol juda qisqa".',
            summary: 'Bugun shart operatorlarini o‘rgandik: if, else, elif, murakkab shartlar, ternary. Keyingi dars — Tsikllar (for/while)!',
            exercises: [
              {
                id: 'py6ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Musbat yoki manfiy? ➕➖',
                instruction: 'son = -12. Agar son musbat bo‘lsa "Musbat", manfiy bo‘lsa "Manfiy", nol bo‘lsa "Nol" deb chop qiling.',
                startCode: 'son = -12\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'if\\s+son\\s*>\\s*0', msg: 'if son > 0, elif son < 0, else dan foydalaning' },
                  { re: 'elif\\s+son\\s*<\\s*0|else\\s*:', msg: 'elif yoki else bilan yakunlang' }
                ],
                hint: 'if musbat → elif manfiy → else nol.',
                explanation: 'if son > 0: Musbat; elif son < 0: Manfiy; else: Nol.',
                xp: 10
              },
              {
                id: 'py6ex2',
                type: 'dragdrop',
                title: '2-MASHQ — if / elif / else yig‘ish 🧩',
                instruction: '"ball >= 90 → A, >=75 → B, qolgan C" kodini to‘g‘ri tartibga joylashtiring.',
                hint: 'if → elif → else. print larni alohida.',
                items: ['if ball >= 90:', '    print("A")', 'elif ball >= 75:', '    print("B")', 'else:', '    print("C")'],
                xp: 10
              },
              {
                id: 'py6ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kodingizda ball=95 bo‘lsa "C" chiqyapti, nima uchun? (kutilgan "A")',
                code: 'ball = 95\nif ball >= 60:\n    print("C")\nelif ball >= 75:\n    print("B")\nelif ball >= 90:\n    print("A")',
                options: ['ball noto‘g‘ri kiritilgan', 'Shartlar tartibi xato — kichik ball avval', 'print so‘zi xato yozilgan', 'Har birida : yo‘q'],
                answer: 1,
                explanation: 'Shartlar tartibi XATO! Avval 60 tekshiriladi → TRUE (95 >=60), darhol "C" chiqadi, keyingi shartlarga uzilmaydi! To‘g‘ri: avval >=90, keyin >=75, keyin >=60.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Python da shart operatorining to‘g‘ri ko‘rinishi qaysi?',
                options: ['if x > 5 then', 'if (x > 5):', 'if x > 5:', 'x > 5 if'],
                answer: 2,
                explanation: 'if SHART: — keyin 4 space bilan indentatsiya. Qavs majburiy emas, nuqta-vergul : majburiy!'
              },
              {
                question: 'Indentatsiya (ichkariga surish) necha space bo‘lishi tavsiya etiladi?',
                options: ['2', '4', '6', '8'],
                answer: 1,
                explanation: 'PEP8 bo‘yicha — 4 bo‘sh joy. Bu Python standarti.'
              },
              {
                question: 'if / elif / else da bir necha shart TRUE bo‘lsa, qaysi biri ishlaydi?',
                options: ['Oxirgisi', 'Birinchisi', 'Hammasi', 'Hech biri'],
                answer: 1,
                explanation: 'BIRINCHI TRUE bo‘lgan shart ishlaydi, qolganlari hech qachon tekshirilmaydi.'
              },
              {
                question: 'x = 0; y = "musbat" if x > 0 else "manfiy"; print(y) — natija?',
                options: ['musbat', 'manfiy', 'nol', 'Xatolik'],
                answer: 1,
                explanation: 'x > 0 → False, shuning uchun else qismi: "manfiy".'
              },
              {
                question: 'yosh = 25 da, 18 <= yosh <= 30 — natija?',
                options: ['True', 'False', 'SyntaxError', '25'],
                answer: 0,
                explanation: 'Python qulayligi: yosh >=18 AND yosh <=30 → True.'
              },
              {
                question: 'a = True; b = False; if a or b: print("Ha") else: print("Yo‘q") — natija?',
                options: ['Ha', 'Yo‘q', 'TrueFalse', 'Xatolik'],
                answer: 0,
                explanation: 'OR da bittasi True bo‘lsa yetarli. a=True → Ha.'
              },
              {
                question: 'son = 4; if son % 2 == 0: print("juft"); else: print("to‘q") — natija?',
                options: ['juft', 'to‘q', '4%2', 'Xatolik'],
                answer: 0,
                explanation: '4 % 2 = 0 → juft son. Natija: "juft".'
              },
              {
                question: 'Nested if degani nima?',
                options: ['If dan keyin else', 'If ichida yana if', 'Ko‘p eliflar', 'Ternary operator'],
                answer: 1,
                explanation: 'Nested — ichma-ich. If ichida yana if/else.'
              }
            ]
          }
        },
        {
          title: 'Tsikllar',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun takrorlanuvchi amallarni avtomatik bajarish uchun tsikllarni o‘rganamiz. Python da 2 xil tsikl bor: for va while. Ikkalasi ham juda foydali.',
            sections: [
              {
                title: 'for tsikli — ro‘yxat ustida aylanish',
                text: 'for tsikli RO‘YXAT, STRING yoki boshqa "iterable" ob‘yekt ustida aylanadi.\n\nfor ELEM in ROYXAT:\n    amallar\n\nHar bir iteratsiyada ELEM ga keyingi element qiymati yoziladi.',
                code: '# 1) String ustida\nfor harf in "Python":\n    print(harf)\n\nprint("-----")\n\n# 2) Ro‘yxat ustida\nmevalar = ["olma", "banan", "gilos"]\nfor meva in mevalar:\n    print(f"Men {meva} yaxshi ko‘raman")',
                codeNote: 'Har bir harf/meva alohida chop qilinadi. Tsikl elementlar sonicha ishlaydi.',
                result: 'P\ny\nt\nh\no\nn\n-----\nMen olma yaxshi ko‘raman\nMen banan yaxshi ko‘raman\nMen gilos yaxshi ko‘raman',
                note: 'for tsiklni foreach deb ham atashadi (boshqa tillar).'
              },
              {
                title: 'range() funksiyasi — sonlar ketma-ketligi',
                text: 'range() — sonlar ketma-ketligini yaratadi. 3 xil usulda:\n\n• range(N) — 0 dan N-1 gacha (N ta)\n• range(A, B) — A dan B-1 gacha\n• range(A, B, Q) — A dan B-1 gacha, Q qadam bilan',
                code: '# 0 dan 4 gacha\nfor i in range(5):\n    print(i, end=" ")\nprint()\n\n# 3 dan 7 gacha\nfor i in range(3, 8):\n    print(i, end=" ")\nprint()\n\n# 1 dan 10 gacha har 2 qadam\nfor i in range(1, 11, 2):\n    print(i, end=" ")\nprint()\n\n# 10 dan 1 gacha orqa\nfor i in range(10, 0, -1):\n    print(i, end=" ")',
                codeNote: 'end=" " — yangi qatordan emas, probel bilan chiqarish uchun. range(5) = [0,1,2,3,4] — 5 ta element, 0 dan boshlab.',
                result: '0 1 2 3 4 \n3 4 5 6 7 \n1 3 5 7 9 \n10 9 8 7 6 5 4 3 2 1',
                note: 'range() LIST emas — u "lazy" hisoblanadi (hammasini bir vaqtning o‘zida xotiraga yuklamaydi). list(range(5)) qilishingiz mumkin.'
              },
              {
                title: 'enumerate() — indeks bilan birga',
                text: 'Ba’zida elementni ham, uning indeksini ham bilish kerak. enumerate() yordamida ikkalasini ham olishingiz mumkin.',
                code: 'mevalar = ["olma", "banan", "gilos", "anor"]\n\nfor indeks, meva in enumerate(mevalar):\n    print(f"{indeks+1}. {meva}")',
                codeNote: 'enumerate har bir element uchun (indeks, qiymat) juftligini beradi.',
                result: '1. olma\n2. banan\n3. gilos\n4. anor',
                note: '0 dan emas, 1 dan boshlash uchun indeks+1 ni ishlatdik. start=1 parametrini ham berishingiz mumkin: enumerate(mevalar, start=1).'
              },
              {
                title: 'while tsikli — shart bajarilguncha',
                text: 'while tsikli SHART TRUE bo‘lsa ishlaydi to‘xtamaydi. Shart FALSE bo‘lsa to‘xtaydi.\n\n⚠️ EHTIYOT — abadiy tsikl (infinite loop): shart hech qachon False bo‘lmasa, tsikl to‘xtamaydi!',
                code: '# 1 dan 5 gacha\nson = 1\nwhile son <= 5:\n    print(son, end=" ")\n    son += 1  # MUHIM! Aytib qo‘yilmasa abadiy ishlaydi!\nprint()\n\n# Faktorialni hisoblash: 5! = 1*2*3*4*5\nn = 5\nfakt = 1\ni = 1\nwhile i <= n:\n    fakt *= i\n    i += 1\nprint(f"{n}! = {fakt}")',
                codeNote: 'while da shartni oxir-oqibat FALSE qiladigan kod bo‘lishi SHART (bu yerda son += 1).',
                result: '1 2 3 4 5 \n5! = 120',
                note: 'Abadiy tsiklga tushsangiz — Ctrl+C orqali to‘xtating.'
              },
              {
                title: 'break va continue',
                text: 'Tsikl ichida maxsus kalit so‘zlar:\n\n• break — darhol TSIKLNI TO‘XTATISH va undan CHIQISH\n• continue — joriy iteratsiyani TUGATISH va KEYINGISIGA O‘TISH',
                code: '# break — 3 ga tushsa to‘xta\nfor i in range(1, 10):\n    if i == 4:\n        break  # 4 ga kelganida darhol chiq\n    print(i, end=" ")\nprint("→ break keyin")\n\n# continue — juftlarni o‘tkazib yubor, faqat to‘qlarni chop\nfor i in range(1, 8):\n    if i % 2 == 0:\n        continue  # bu iteratsiyani yakunla, keyingiga o‘t\n    print(i, end=" ")\nprint("→ continue keyin")',
                codeNote: 'break → tsikl tugadi. continue → shu qadamni o‘tkazib yubor, tsikl davom etadi.',
                result: '1 2 3 → break keyin\n1 3 5 7 → continue keyin',
                note: 'break va continue nested (ichma-ich) tsikllarda faqat ENG YAQIN tsiklni ta’sir qiladi.'
              },
              {
                title: 'for...else va while...else',
                text: 'Python da tsiklga else qo‘shish mumkin — else qismi AGAR tsikl break bilan to‘xtamagan BO‘LSA (ya’ni normal tugagan bo‘lsa) ishlaydi. Bu qiziqarli xususiyat.',
                code: '# 1) break bo‘lmagan → else ishlaydi\nfor i in range(3):\n    print(i, end=" ")\nelse:\n    print("→ Tsikl tugadi (break yo‘q)")\n\n# 2) break bo‘lgan → else ISHLAMAYDI\nfor i in range(10):\n    if i == 5:\n        break\n    print(i, end=" ")\nelse:\n    print("→ Bu hech qachon chop qilinmaydi!")',
                codeNote: 'Bu xususiyat "prime (tub) son" tekshirishda juda foydali.',
                result: '0 1 2 → Tsikl tugadi (break yo‘q)\n0 1 2 3 4',
                note: 'Ko‘pchilik dasturchilar bu xususiyatdan kam foydalanadi, lekin bilish foydali.'
              }
            ],
            keyPoints: [
              'for elem in iterable: — har bir element uchun',
              'range(N) — 0..N-1; range(A,B) — A..B-1; range(A,B,step)',
              'enumerate(list) — (indeks, element) juftliklari',
              'while SHART: — shart True bo‘lguncha',
              'break — tsikldan chiqish',
              'continue — joriy qadamni o‘tkazib yuborish',
              'Tsikl else — break bo‘lmagan taqdirda ishlaydi'
            ],
            masterXp: 35,
            homework: '1. for va range() orqali 1 dan 100 gacha sonlarning YIG‘INDISINI hisoblang.\n2. while yordamida 7 ning ko‘paytma jadvalini (1 dan 10 gacha) chop qiling: 7 x 1 = 7, ...\n3. [3, 7, 2, 8, 10, 4] listining elementlarini ko‘paytmasini hisoblang (for bilan).\n4. "Hello World" so‘zidagi "l" harflarini sonini sanang: for + shart.\n5. 20 dan 1 gacha orqa tomonda chiqarish: for + range yoki while.\n6. continue orqali 1 dan 30 gacha 3 ga karrali sonlardan tashqari barchasini chop qiling.\n7. (Challenge) Tub son tekshiruvi: n = 29. Tub bo‘lsa "Tub son", aks holda "Tub emas". (Yordam: for i in 2..n-1 qoldiq bor-yo‘q, break + else).',
            summary: 'Bugun tsikllarni o‘rgandik: for, while, range, enumerate, break, continue. Keyingi dars — List!',
            exercises: [
              {
                id: 'py7ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Kvadratlar jadvali ⬜',
                instruction: 'for + range() yordamida 1 dan 5 gacha sonlarning KVADRATINI chop qiling (quyidagi formatda):\n1 ning kvadrati = 1\n2 ning kvadrati = 4\n...',
                startCode: '# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'for\\s+\\w+\\s+in\\s+range\\s*\\(', msg: 'for ... in range(1, 6) dan foydalaning' },
                  { re: 'print.*kvadrati', msg: 'print ichida "... kvadrati = ..." deb yozing' }
                ],
                hint: 'for i in range(1, 6): print(f"{i} ning kvadrati = {i*i}")',
                explanation: 'range(1,6) = 1..5, ichida i*i yoki i**2.',
                xp: 10
              },
              {
                id: 'py7ex2',
                type: 'dragdrop',
                title: '2-MASHQ — 1 dan N gacha yig‘indi 🧩',
                instruction: '"1 dan 10 gacha sonlar yig‘indisi" while tsikli bilan yig‘ish qismlarini to‘g‘ri tartibga keltiring.',
                hint: 'yig=0, i=1, while, i qo‘shiladi, i oshiriladi.',
                items: ['yigindi = 0', 'i = 1', 'while i <= 10:', '    yigindi += i', '    i += 1'],
                xp: 10
              },
              {
                id: 'py7ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"1 dan 5 gacha" chiqarish uchun yozilgan while tsikli hech to‘xtamaydi (abadiy tsikl). Nima uchun?',
                code: 'son = 1\nwhile son <= 5:\n    print(son)\n# print tugallanmagan:',
                options: ['while sharti noto‘g‘ri', 'son = 1 emas, 0 kerak edi', 'son += 1 qatori yo‘q — shart hech qachon False bo‘lmaydi', 'print da end=" " yo‘q'],
                answer: 2,
                explanation: 'SON OSHIRILMAYDI! Har doim son = 1 → shart doim True → abadiy ishlaydi. MUHIM: while da shartni oxir-oqibat False qiladigan qator BO‘LISHI SHART (son += 1 kabi).'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'range(5) qanday sonlarni beradi?',
                options: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '5'],
                answer: 1,
                explanation: 'range(N) — 0 dan N-1 gacha, jami N ta son: [0,1,2,3,4].'
              },
              {
                question: 'range(2, 8, 2) — sonlar?',
                options: ['2,4,6,8', '2,4,6', '4,6,8', '2,3,4,5,6,7'],
                answer: 1,
                explanation: '2 dan 8-1 gacha, har 2 qadam: 2, 4, 6.'
              },
              {
                question: 'for c in "ABC": print(c) necha marta ishlaydi?',
                options: ['1', '2', '3', '4'],
                answer: 2,
                explanation: '"ABC" da 3 ta belgi → tsikl 3 marta ishlaydi.'
              },
              {
                question: 'while tsiklning asosiy xavfi qaysi?',
                options: ['Hech qachon ishlamaydi', 'Abadiy tsikl bo‘lishi mumkin', 'Faqat sonlar bilan ishlaydi', 'Indeks olinmaydi'],
                answer: 1,
                explanation: 'Shart hech qachon False bo‘lmasa, tsikl to‘xtamaydi (abadiy tsikl). Shartni False qilishni unutmang!'
              },
              {
                question: 'Tsikl ichidagi break vazifasi?',
                options: ['Joriy qadamni o‘tkazib yuboradi', 'Darhol tsikldan chiqadi', 'Tsiklni qayta boshlaydi', 'Qiymatni qaytaradi'],
                answer: 1,
                explanation: 'break — tsiklni darhol to‘xtatadi va undan chiqadi.'
              },
              {
                question: 'continue vazifasi?',
                options: ['Tsikldan chiqadi', 'Joriy iteratsiyani tugatib, keyingiga o‘tadi', 'Tsiklni qayta boshlaydi', 'Xatolikni ushlaydi'],
                answer: 1,
                explanation: 'continue — shu qadamni o‘tkazib yubor (keyingi kodlar ishlamaydi), keyingi elementga o‘t.'
              },
              {
                question: 'enumerate() nima qaytaradi?',
                options: ['Faqat elementlar', '(indeks, element) juftliklari', 'Faqat indekslar', 'Listning uzunligi'],
                answer: 1,
                explanation: 'enumerate(list) → har bir iteratsiyada (indeks, element) ni beradi.'
              },
              {
                question: 'Tsikl ELSE qachon ishlaydi?',
                options: ['Tsikl break bilan to‘xtaganida', 'Tsikl normal (breaksiz) tugaganida', 'Har doim', 'Hech qachon'],
                answer: 1,
                explanation: 'for/while else — TSICL NORMAL TUGAGAN (break ishlatmagan) holatda ishlaydi.'
              }
            ]
          }
        },
        {
          title: 'List',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun Python ning eng ko‘p ishlatiladigan strukturalaridan biri — LIST (ro‘yxat) bilan tanishamiz. List bir nechta elementlarni bir joyda saqlash imkonini beradi.',
            sections: [
              {
                title: 'List nima va qanday yaratiladi?',
                text: 'List — elementlar to‘plami. Qavslar [] ichida yoziladi, elementlar vergul bilan ajratiladi.\n\n• Har xil turdagi elementlarni bir listda saqlash mumkin\n• O‘zgaruvchan (mutable) — elementlarini o‘zgartirish mumkin\n• Tartibli — indekslari bor (0 dan boshlab)',
                code: '# Bo‘sh listlar\nb_list1 = []\nb_list2 = list()\n\n# Elementli listlar\nmevalar = ["olma", "banan", "gilos"]\nraqamlar = [1, 2, 3, 4, 5]\naralash = ["Ali", 25, True, 3.14, mevalar]\n\nprint(mevalar)\nprint(raqamlar)\nprint(aralash)\nprint("List uzunligi:", len(mevalar))',
                codeNote: 'List ichida list ham bo‘lishi mumkin (nested list). len(list) — elementlar soni.',
                result: "['olma', 'banan', 'gilos']\n[1, 2, 3, 4, 5]\n['Ali', 25, True, 3.14, ['olma', 'banan', 'gilos']]\nList uzunligi: 3",
                note: 'String immutable, LIST MUTABLE (o‘zgaruvchan)!'
              },
              {
                title: 'Indeks va slicing',
                text: 'String kabi list ham indekslanadi va slicing qilindi — 0 dan boshlanadi, -1 oxirgi element.',
                code: 'mevalar = ["olma", "banan", "gilos", "anor", "uzum"]\n\nprint(mevalar[0])    # olma\nprint(mevalar[2])    # gilos\nprint(mevalar[-1])   # uzum\n\n# Slicing\nprint(mevalar[1:4])  # banan, gilos, anor\nprint(mevalar[:3])   # 0,1,2\nprint(mevalar[2:])   # 2 dan oxirigacha\nprint(mevalar[::-1]) # orqa',
                codeNote: 'String bilan DEYARLI BIR XIL sintaksis.',
                result: "olma\ngilos\nuzum\n['banan', 'gilos', 'anor']\n['olma', 'banan', 'gilos']\n['gilos', 'anor', 'uzum']\n['uzum', 'anor', 'gilos', 'banan', 'olma']",
                note: 'Mavjud bo‘lmagan indeks → IndexError.'
              },
              {
                title: 'Elementlarni O‘ZGARTIRISH (list mutable)',
                text: 'List mutable — elementlarini o‘zgartirish, qo‘shish, o‘chirish mumkin.',
                code: 'mevalar = ["olma", "banan", "gilos"]\n\n# Elementni o‘zgartirish\nmevalar[1] = "mandarin"\nprint(mevalar)  # olma, mandarin, gilos\n\n# append() — oxiriga element qo‘shish\nmevalar.append("anor")\nprint(mevalar)\n\n# insert() — ixtiyoriy joyga qo‘shish\nmevalar.insert(1, "banan")\nprint(mevalar)  # 1- o‘ringa banan, qolganlari suriladi',
                codeNote: 'append() doim OXIRIGA qo‘shadi. insert(indeks, qiymat) esa ko‘rsatilgan joyga.',
                result: "['olma', 'mandarin', 'gilos']\n['olma', 'mandarin', 'gilos', 'anor']\n['olma', 'banan', 'mandarin', 'gilos', 'anor']",
                note: 'String da bu imkoniyat yo‘q edi (immutable edi), listda MUMKIN!'
              },
              {
                title: 'O‘chirish usullari',
                text: 'Elementni o‘chirish uchun bir nechta usul bor.',
                code: 'mevalar = ["olma", "banan", "gilos", "banan", "uzum"]\n\n# remove(qiymat) — birinchi uchragan qiymatni o‘chiradi\nmevalar.remove("banan")\nprint("remove:", mevalar)\n\n# pop() — OXIRGI elementni o‘chiradi VA qaytaradi\noxirgi = mevalar.pop()\nprint("pop:", mevalar, "| o‘chirilgan:", oxirgi)\n\n# pop(indeks) — ko‘rsatilgan indeksdagi elementni o‘chiradi\nmevalar.pop(0)\nprint("pop(0):", mevalar)\n\n# del — indeks bo‘yicha o‘chirish\nraqamlar = [1,2,3,4,5]\ndel raqamlar[2]\nprint("del:", raqamlar)\n\n# clear() — barchasini tozalash\nraqamlar.clear()\nprint("clear:", raqamlar)',
                codeNote: 'remove(qiymat) → qiymat bo‘yicha; pop() → indeks bo‘yicha (default oxirgi); del → operator; clear() → bo‘shatish.',
                result: "remove: ['olma', 'gilos', 'banan', 'uzum']\npop: ['olma', 'gilos', 'banan'] | o‘chirilgan: uzum\npop(0): ['gilos', 'banan']\ndel: [1, 2, 4, 5]\nclear: []",
                note: 'pop() — odatiy (stack) tuzilmasida ishlatiladi (LIFO).'
              },
              {
                title: 'Yana foydali methodlar',
                text: 'sort(), reverse(), index(), count(), copy(), extend()',
                code: 'raqamlar = [5, 2, 8, 1, 9, 3]\n\n# sort() — o‘zini tartiblaydi (o‘sish bo‘yicha)\nraqamlar.sort()\nprint("sort:", raqamlar)\n\n# sort(reverse=True) — kamayish bo‘yicha\nraqamlar.sort(reverse=True)\nprint("sort reverse:", raqamlar)\n\n# reverse() — orqa\nmevalar = ["olma", "banan"]\nmevalar.reverse()\nprint("reverse:", mevalar)\n\n# index(qiymat) — birinchi uchragan indeks\nraqamlar = [10, 20, 30, 20]\nprint("index 20:", raqamlar.index(20))  # 1\n\n# count(qiymat) — necha marta bor\nprint("count 20:", raqamlar.count(20))\n\n# extend() — boshqa list ni qo‘shib qo‘yish\na = [1,2,3]\nb = [4,5,6]\na.extend(b)\nprint("extend:", a)',
                codeNote: 'sort() — listni O‘ZI tartiblanadi (hech narsa qaytarmaydi!). sorted() esa yangi list qaytaradi (listni o‘zgartirmaydi).',
                result: "sort: [1, 2, 3, 5, 8, 9]\nsort reverse: [9, 8, 5, 3, 2, 1]\nreverse: ['banan', 'olma']\nindex 20: 1\ncount 20: 2\nextend: [1, 2, 3, 4, 5, 6]",
                note: 'a + b — yangi list yaratadi; a.extend(b) — a ni o‘zgartiradi.'
              },
              {
                title: 'List biriktirish va kopaytirish',
                text: 'String kabi listlarni + va * operatorlari bilan ishlatish mumkin.',
                code: 'a = [1, 2, 3]\nb = [4, 5, 6]\n\n# + — birlashtirish (yangi list)\nc = a + b\nprint("a+b:", c)\n\n# * — takrorlash\nd = [0] * 5\nprint("[0]*5:", d)\n\n# nested list (ichma-ich listlar — matritsa)\nmatritsa = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nprint("matritsa[1][2]:", matritsa[1][2])  # 2-qator 3-ustun = 6',
                codeNote: 'Nested list: [qator][ustun]. 0 dan boshlanish unutmang!',
                result: "a+b: [1, 2, 3, 4, 5, 6]\n[0]*5: [0, 0, 0, 0, 0]\nmatritsa[1][2]: 6",
                note: 'Listlarni = bilan biriktirsangiz, IKKALASI HAM BIR XIL LISTGA ISHORA QILADI (copy qilishingiz kerak).'
              }
            ],
            keyPoints: [
              'List: [el1, el2] — tartibli, mutable, har xil turli elementlar',
              'Indeks va slicing — string bilan bir xil',
              'append() oxiriga, insert(indeks,val) ixtiyoriy joyga qo‘shish',
              'remove(val), pop(indeks), del list[i], clear() — o‘chirish usullari',
              'sort(reverse=True), reverse(), index(), count(), extend()',
              'list1 + list2 → yangi list; [0]*N → N ta nol',
              'Nested list: matritsa[qator][ustun]'
            ],
            masterXp: 35,
            homework: '1. 5 ta meva nomidan iborat list yarating. 1- va oxirgi elementlarini chop qiling.\n2. list.append() va list.insert() yordamida listga 2 ta yangi meva qo‘shing (1 boshiga, 1 oxiriga).\n3. [4, 2, 8, 1, 9, 3] listini tartiblang (o‘sish va kamayish bo‘yicha).\n4. ["a","b","c","d","e"] listidan slicing orqali "b c d" ni ajratib oling.\n5. [1, 2, 3, 4, 5] listini loop bilan har birini KVADRATIGA OSHIRIB chiqaring (for yordamida).\n6. [10, 20, 30, 40] listining elementlari YIG‘INDISINI hisoblang (loop yoki sum() funksiyasi).\n7. (Challenge) 3x3 matritsa yarating va diagonal elementlarini chop qiling: [0][0], [1][1], [2][2].',
            summary: 'Bugun List (ro‘yxat) ni o‘rgandik. Listlar Python da juda ko‘p ishlatiladi, bu mavzuni yaxshi o‘zlashtiring! Keyingi dars — Tuple.',
            exercises: [
              {
                id: 'py8ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Listni teskari aylantirish 🔄',
                instruction: 'lst = [10, 20, 30, 40, 50] listini METHOD orqali TESKARIGA AYLANTIRING va chop qiling.',
                startCode: 'lst = [10, 20, 30, 40, 50]\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'lst\\s*\\.reverse\\s*\\(\\s*\\)|lst\\s*=\\s*lst\\s*\\[\\s*::\\s*-1\\s*\\]', msg: 'lst.reverse() dan foydalaning yoki lst = lst[::-1]' }
                ],
                hint: 'reverse() methodi listni o‘zini teskari aylantiradi.',
                explanation: 'lst.reverse() → [50,40,30,20,10]. Listga ta’sir qiladi, qaytarmaydi.',
                xp: 10
              },
              {
                id: 'py8ex2',
                type: 'dragdrop',
                title: '2-MASHQ — List usullarini yig‘ish 🧩',
                instruction: 'Listga element qo‘shish usullarini tartiblang (tartib ahamiyatsiz, 3 usulni jamlang).',
                hint: 'append/insert/extend — 3 ta usul.',
                items: ['.append(5)', '.insert(0, 10)', '.extend([7,8])'],
                xp: 10
              },
              {
                id: 'py8ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"raqamlarni tartiblab chiqaraman" degan kodingizda natija None chiqdi. Nima uchun?',
                code: 'raqamlar = [5, 2, 8, 1]\ntartiblangan = raqamlar.sort()\nprint(tartiblangan)  # None chiqadi!',
                options: ['sort() methodi yo‘q', 'sort() listni O‘ZI tartiblaydi, HECH NARSA QAYTARMAYDI (None)', 'raqamlar noto‘g‘ri', 'print qavs ichida raqamlar kerak'],
                answer: 1,
                explanation: 'sort() listni O‘ZIGA tartiblaydi va None qaytaradi! To‘g‘ri variantlar:\n1) raqamlar.sort(); print(raqamlar)\n2) tartiblangan = sorted(raqamlar); print(tartiblangan) — sorted() YANGI list qaytaradi!'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'List yaratish uchun to‘g‘ri sintaksis?',
                options: ['(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}', '<1, 2, 3>'],
                answer: 1,
                explanation: 'List uchun kvadrat qavslar: []. () = tuple, {} = set/dict.'
              },
              {
                question: 'lst = ["a","b","c","d"]; lst[2] qiymati?',
                options: ['a', 'b', 'c', 'd'],
                answer: 2,
                explanation: '0:a, 1:b, 2:c. Indeks 2 dan "c".'
              },
              {
                question: 'Listga oxiridan element qo‘shish uchun qaysi method?',
                options: ['add()', 'append()', 'insert()', 'push()'],
                answer: 1,
                explanation: 'append() — doim OXIRIGA. insert(i, val) — ixtiyoriy indeksga.'
              },
              {
                question: 'lst = [1,2,3]; lst.pop() dan keyin lst?',
                options: ['[1,2]', '[2,3]', '[1,3]', '[]'],
                answer: 0,
                explanation: 'pop() → OXIRGI elementni o‘chiradi. [1,2,3] → [1,2].'
              },
              {
                question: 'lst = [5, 2, 8]; lst.sort(reverse=True) → natija?',
                options: ['[2,5,8]', '[8,5,2]', '[5,2,8]', 'None'],
                answer: 1,
                explanation: 'sort(reverse=True) → kamayish tartibi: 8,5,2. List o‘zgartiriladi.'
              },
              {
                question: '[1, 2] + [3, 4] natijasi?',
                options: ['[1,2,3,4]', '[4,6]', '[[1,2],[3,4]]', 'Xatolik'],
                answer: 0,
                explanation: '+ → listlarni BIRLASHTIRADI. Yangi list [1,2,3,4] qaytadi.'
              },
              {
                question: 'm = [[1,2],[3,4]] → m[1][0] qiymati?',
                options: ['1', '2', '3', '4'],
                answer: 2,
                explanation: 'Nested list: 1-qator (0: [1,2], 1: [3,4]), 0-ustun = 3.'
              },
              {
                question: 'Listning asosiy xususiyati (stringdan farqli)?',
                options: ['Immutable (o‘zgarmas)', 'Mutable (o‘zgaruvchan)', 'Faqat raqamlar saqlaydi', 'Indekslanmaydi'],
                answer: 1,
                explanation: 'List MUTABLE — elementlarini o‘zgartirish, qo‘shish, o‘chirish mumkin.'
              }
            ]
          }
        },
        {
          title: 'Tuple',
          duration: 15,
          xp: 25,
          content: {
            intro: 'Bugun Listga juda o‘xshash ammo bir xillikda farqli bo‘lgan Tuple bilan tanishamiz. Tuple — o‘ZGARMAS (immutable) ro‘yxat. Nechali farqli? O‘rganamiz!',
            sections: [
              {
                title: 'Tuple nima va yaratish',
                text: 'Tuple listga juda o‘xshaydi, lekin asosiy FARQ: Tuple IMMUTABLE (o‘zgarmas). Yaratgandan keyin elementini o‘zgartira olmaysiz, qo‘sholmaysiz, o‘chira olmaysiz. Bu — o‘zgarmasligi kafolatlanishi kerak bo‘lgan narsalar uchun juda qulay.\n\nTuple qavs () bilan yoziladi yoki umuman qavs siz ham yozilishi mumkin.',
                code: '# Tuple yaratish usullari\ntpl1 = ("olma", "banan", "gilos")\ntpl2 = 1, 2, 3, 4        # qavsiz ham mumkin!\ntpl3 = tuple([1,2,3])    # list → tuple\nbir_element = (5,)       # ⚠️ Bitta elementli tuple: vergul shart!\n\nprint(tpl1)\nprint(tpl2)\nprint(tpl3)\nprint("Bir elementli:", bir_element, type(bir_element))\n\nprint("Uzunlik:", len(tpl1))',
                codeNote: '⚠️ MUHIM: (5) — emas! Bu shunchaki int 5. Bitta elementli tuple uchun vergul SHART: (5,).',
                result: "('olma', 'banan', 'gilos')\n(1, 2, 3, 4)\n(1, 2, 3)\nBir elementli: (5,) <class 'tuple'>\nUzunlik: 3",
                note: 'Agar sizga hech qachon o‘zgarmaydigan ma'lumotlar kerak bo‘lsa — list emas, tuple ishlating.'
              },
              {
                title: 'Tuple bilan ishlash (List bilan o‘xshash tomonlari)',
                text: 'Tuple ham indekslanadi, slicing qilinadi, loop aylanadi, in operatori ishlaydi va boshqa ko‘plab narsalar list bilan bir xil.',
                code: 'tpl = ("a", "b", "c", "d", "e")\n\n# Indeks\nprint("[0]:", tpl[0])     # a\nprint("[-1]:", tpl[-1])   # e\n\n# Slicing\nprint("[1:4]:", tpl[1:4])\n\n# Loop\nfor elem in tpl:\n    print(elem, end=" ")\nprint()\n\n# in\nprint("c in tuple:", "c" in tpl)\n\n# count va index\nprint("count:", tpl.count("a"))\nprint("index b:", tpl.index("b"))',
                codeNote: 'Ko‘rib turganingizdek, indeks, slicing, loop, in, count, index — hammasi ishlaydi.',
                result: "[0]: a\n[-1]: e\n[1:4]: ('b', 'c', 'd')\na b c d e \nc in tuple: True\ncount: 1\nindex b: 1",
                note: 'Listda bo‘lgan imkoniyatlarning aksariyati tuple da ham bor, faqat O‘ZGARTIRUVCHI methodlar yo‘q.'
              },
              {
                title: 'Tuple ni o‘zgartirib bo‘lmaydiganligini isbotlash',
                text: 'Tuple ga append/pop/remove kabi methodlar UMUMAN YO‘Q. Va indeks orqali qiymatni o‘zgartirishga urinilsa — TypeError xatosi beradi.',
                code: 'tpl = ("olma", "banan", "gilos")\n\n# Ushbu kodlar ERROR beradi (uloxtirish uchun komment qildik):\n# tpl[0] = "anor"       # ❌ TypeError!\n# tpl.append("uzum")    # ❌ AttributeError!\n# tpl.remove("banan")   # ❌ AttributeError!\n\nprint("Tuple o‘zgarmas (immutable)!")\nprint("Elementlar: ", tpl)\n\n# AMMO! Agar tuple ICHIDA MUTABLE element bo‘lsa, shu elementni o‘zgartirish mumkin!\ncomplex = (1, 2, [10, 20, 30])\ncomplex[2][0] = 999   # ✅ Bu mumkin! Ichidagi list ni o‘zgartiryapmiz, tuple ni emas!\nprint("Ichidagi list o‘zgardi:", complex)',
                codeNote: 'Tuple o‘zi o‘zgarmas. Lekin uning ichidagi ob‘yekt (masalan list) o‘zi mutable bo‘lsa — uni o‘zgartirish mumkin. Shart emas — tuple reference o‘zgarishi emas, uning ichidagi ob‘yektni o‘zgartirish.',
                result: "Tuple o‘zgarmas (immutable)!\nElementlar:  ('olma', 'banan', 'gilos')\nIchidagi list o‘zgardi: (1, 2, [999, 20, 30])",
                note: 'Shu sababli tuple da o‘zgaruvchan (mutable) element saqlashdan ehtiyot bo‘ling.'
              },
              {
                title: 'Tuple ni qayerda ishlatish kerak?',
                text: '1. O‘zgarmas ma'lumotlar: kunlar, oylar nomlari (hech qachon o‘zgarmaydi)\n2. Dictionary kalitlari (list kalit bo‘la olmaydi, tuple bo‘ladi!)\n3. Funksiya bir nechta qiymat qaytarganda (defaul Python holati)\n4. Unpacking (ajratish) bilan tez o‘zgaruvchilar yaratish',
                code: '# 1. O‘zgarmas ro‘yxat\nkunlar = ("Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba")\nprint(kunlar[0])  # Dushanba\n\n# 2. Funksiya bir nechta qiymat qaytaradi (tuple qaytaradi)\ndef kvadrat_kub(son):\n    return son**2, son**3  # Bu tuple!\nkv, kb = kvadrat_kub(5)\nprint(f"5^2 = {kv}, 5^3 = {kb}")\n\n# 3. Unpacking — tez qiymatlarni ajratish\nkoordinata = (10, 20, 30)\nx, y, z = koordinata\nprint(f"x={x}, y={y}, z={z}")',
                codeNote: 'Funksiya return 1, 2, 3 — bu tuple qaytarish! Python tuple qavsini qo‘yib yuboradi.',
                result: "Dushanba\n5^2 = 25, 5^3 = 125\nx=10, y=20, z=30",
                note: 'Tuple listdan ham TEZROQ ishlaydi (immutable bo‘lgani uchun optimallashtirilgan).'
              }
            ],
            keyPoints: [
              'Tuple: () yoki vergul bilan, immutable (o‘zgarmas)',
              'Bitta elementli tuple shunday: (5,) — vergul shart!',
              'Indeks, slicing, loop, in, count, index — hammasi list kabi ishlaydi',
              'Append, remove, pop, sort va shu kabi methodlar YO‘Q',
              'Ichidagi mutable element (masalan list) o‘zgartirilishi mumkin',
              'O‘zgarmas ma'lumotlar uchun ishlatiladi',
              'Funksiya return a,b,c — tuple qaytaradi + unpacking qulay'
            ],
            masterXp: 25,
            homework: '1. 7 ta hafta kunlaridan iborat tuple yarating va 1-kunni va oxirgi kunni chop qiling.\n2. (10, 20, 30, 40, 50) tuple dan slicing orqali (20, 30, 40) ni ajratib oling.\n3. Tuple da nechta "a" borligini aniqlang: tpl = ("a", "b", "a", "c", "a") → count().\n4. 5-elementli tuple yaratib, uni for bilan aylantiring va har birini chop qiling.\n5. Funksiya yozing: u 2 ta son qabul qilsin va (yigindi, ayirma, kopaytma, bolinma) tuple qilib qaytarsin. Keyin unpacking qilib 4 ta o‘zgaruvchiga ajratib chop qiling.\n6. (Challenge) tuple = (1, 2, [3, 4]). tuple[2].append(5) qilib ko‘ring. Nima bo‘ldi? O‘zingizga tushuntiring.',
            summary: 'Bugun Tuple o‘rgandik: listga o‘xshash lekin immutable (o‘zgarmas). Vergul qoidalari va qayerda ishlatilishini bilib oldik. Keyingi dars — Dictionary!',
            exercises: [
              {
                id: 'py9ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Tuple unpacking 📦',
                instruction: 'tpl = ("Ali", 25, "Toshkent") tuple ni unpack qilib 3 ta o‘zgaruvchiga (ism, yosh, shahar) ajratib, chop qiling.',
                startCode: 'tpl = ("Ali", 25, "Toshkent")\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'ism\\s*,\\s*yosh\\s*,\\s*shahar\\s*=\\s*tpl|ism\\s*,\\s*yosh\\s*,\\s*shahar\\s*=\\s*\\("Ali"\\s*,\\s*25\\s*,\\s*"Toshkent"\\)', msg: 'ism, yosh, shahar = tpl unpacking qiling' },
                  { re: 'print.*ism|print.*yosh|print.*shahar', msg: 'print bilan chop qiling' }
                ],
                hint: 'ism, yosh, shahar = tpl — unpacking.',
                explanation: 'Tuple ni bir qatorda bir nechta o‘zgaruvchiga ajratish mumkin.',
                xp: 10
              },
              {
                id: 'py9ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Tuple yasash 🧩',
                instruction: 'Bitta elementli tuple yaratish qismlarini to‘g‘ri yig‘ing — (10,) kerak.',
                hint: 'Qavs ichida qiymat + vergul kerak.',
                items: ['(', '10', ',', ')'],
                xp: 10
              },
              {
                id: 'py9ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kod ishga tushganda TypeError beradi. Nima uchun?',
                code: 'tpl = ("olma", "banan")\ntpl[0] = "gilos"\nprint(tpl)',
                options: ['tpl da element kam', 'Tuple immutable, elementini o‘zgartirib bo‘lmaydi', 'Indeks 0 emas, 1 kerak', 'print da qavs yo‘q'],
                answer: 1,
                explanation: 'TUPLE O‘ZGARMAS (IMMUTABLE)! Yaratgandan keyin uni o‘zgartirib, element qo‘shib, o‘chira olmaysiz. List talab etilsa list ishlating.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Tuple yaratish uchun qaysi qavs?',
                options: ['[]', '{}', '()', '<>'],
                answer: 2,
                explanation: 'Tuple uchun (); List uchun []; Dict/Set uchun {}.'
              },
              {
                question: 'Bitta elementli tuple qanday yaratiladi?',
                options: ['(5)', '5', '(5,)', '[5]'],
                answer: 2,
                explanation: '⚠️ MUHIM! Vergulsiz (5) = oddiy int 5. Tuple uchun (5,) → vergul kerak!'
              },
              {
                question: 'Tuple ning asosiy xususiyati?',
                options: ['Mutable', 'Immutable', 'Faqat sonlar saqlaydi', 'Indekslanmaydi'],
                answer: 1,
                explanation: 'Tuple O‘ZGARMAS (immutable) — Yaratilgandan keyin o‘zgartirib bo‘lmaydi.'
              },
              {
                question: 'Qaysi method tuple da MAVJUD EMAS?',
                options: ['count()', 'index()', 'append()', 'list orqali konvertatsiya'],
                answer: 2,
                explanation: 'append() qo‘shish — tuple da yo‘q (o‘zgarmas). count va index bor.'
              },
              {
                question: 'a, b = (3, 5) → print(a+b) natijasi?',
                options: ['(3, 5)', '8', '3', 'Xato'],
                answer: 1,
                explanation: 'Unpacking: a=3, b=5 → a+b = 8.'
              },
              {
                question: 'Qaysi holatda tuple ishlatish tavsiya etiladi?',
                options: ['Doim listdan ko‘ra', 'O‘zgarmas ma\'lumotlar uchun', 'O‘zgaruvchan ro‘yxat uchun', 'Faqat sonlar uchun'],
                answer: 1,
                explanation: 'O‘zgarmasligi kerak bo‘lgan narsalar uchun: hafta kunlari, funksiya qaytargan qiymatlar...'
              },
              {
                question: 'def foo(): return 1, 2, 3 → type(foo()) nima?',
                options: ['list', 'tuple', 'dict', 'set'],
                answer: 1,
                explanation: 'return a, b, c — tuple qaytaradi (Python avtomatik qavs qo‘yadi).'
              },
              {
                question: 'tpl = (1, 2, [3, 4]); tpl[2].append(5) → ishlaydimi?',
                options: ['Yo‘q, TypeError', 'Ha, ishlaydi', 'ValueError', 'SyntaxError'],
                answer: 1,
                explanation: 'Tuple o‘zi o‘zgarmas, lekin uning ichidagi MUTABLE ob‘yekt (list) o‘zgartirilishi mumkin. Reference (tpl[2] han shu listga ishora qilmoqda) o‘zgarmaydi, listning o‘zi o‘zgaradi.'
              }
            ]
          }
        },
        {
          title: 'Dictionary',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun eng foydali strukturalardan biri — Dictionary (lug‘at) ni o‘rganamiz. List indeks (0, 1, 2…) bo‘yicha ishlasa, Dictionary esa KALIT:QIYMAT juftligi bo‘yicha ishlaydi. Juda qulay!',
            sections: [
              {
                title: 'Dictionary nima? Yaratish',
                text: 'Dictionary — Kalit(Qiymat) juftliklaridan iborat to‘plam. List indeks o‘rniga o‘zingiz xohlagan KALIT (nom, id…) ishlatasiz.\n\n• {} qavs yordamida yoziladi\n• Kalitlar — unique (takrorlanmas) — kalit string, int, tuple bo‘lishi mumkin (list emas!)\n• Qiymat — istalgan tur bo‘lishi mumkin (hatto dict ham)\n• Tartibli (Python 3.7+)\n• Mutable (o‘zgaruvchan)',
                code: '# Bo‘sh dict\nd1 = {}\nd2 = dict()\n\n# Oddiy dict: kalit:qiymat\ntalaba = {\n    "ism": "Oybek",\n    "yosh": 21,\n    "kurs": 3,\n    "faol": True,\n    "fanlar": ["Matematika", "Fizika"]\n}\n\nprint(talaba)\nprint("Kalitlar soni:", len(talaba))\n\n# Kalit orqali qiymat olish\nprint("Ism:", talaba["ism"])\nprint("Yosh:", talaba["yosh"])\nprint("1-fan:", talaba["fanlar"][0])',
                codeNote: 'Kalitlar string bo‘lishi shart emas — int, tuple ham mumkin. List kalit bo‘la olmaydi.',
                result: "{'ism': 'Oybek', 'yosh': 21, 'kurs': 3, 'faol': True, 'fanlar': ['Matematika', 'Fizika']}\nKalitlar soni: 5\nIsm: Oybek\nYosh: 21\n1-fan: Matematika",
                note: 'Mavjud bo‘lmagan kalitga murojaat = KeyError. xavfsiz olish uchun .get() ishlating.'
              },
              {
                title: 'Qiymat qo‘shish va o‘zgartirish',
                text: 'Kalit mavjud bo‘lsa — o‘zgartiradi, yo‘q bo‘lsa — yangisini qo‘shadi.',
                code: 'talaba = {"ism": "Oybek", "yosh": 21}\n\n# Yangi kalit:qiymat qo‘shish\ntalaba["shahar"] = "Toshkent"\nprint("Qo‘shildi:", talaba)\n\n# Mavjud kalitni o‘zgartirish\ntalaba["yosh"] = 22\nprint("O‘zgartirildi:", talaba)\n\n# .get() — xavfsiz olish (kalit yo‘q bo‘lsa None yoki default qaytaradi)\nprint("Kurs:", talaba.get("kurs"))            # None\nprint("Kurs default:", talaba.get("kurs", 1)) # default 1\nprint("Ism:", talaba.get("ism"))              # Oybek',
                codeNote: 'dict["kalit"] = qiymat — kalit bor bo‘lsa yangilaydi, yo‘q bo‘lsa qo‘shadi.',
                result: "Qo‘shildi: {'ism': 'Oybek', 'yosh': 21, 'shahar': 'Toshkent'}\nO‘zgartirildi: {'ism': 'Oybek', 'yosh': 22, 'shahar': 'Toshkent'}\nKurs: None\nKurs default: 1\nIsm: Oybek",
                note: 'get() juda foydali — KeyError dan qutqaradi.'
              },
              {
                title: 'Kalitlarni o‘chirish',
                text: 'O‘chirish usullari: del, pop().',
                code: 'talaba = {"ism": "Ziyoda", "yosh": 19, "kurs": 2, "shahar": "Namangan"}\n\n# del kalit orqali\ndel talaba["kurs"]\nprint("del kurs:", talaba)\n\n# pop(kalit) — o‘chiradi va qiymatni QAYTARADI\nyoshi = talaba.pop("yosh")\nprint("pop yosh:", talaba, "| o‘chirilgan:", yoshi)\n\n# popitem() — oxirgi qo‘shilgan juftlikni o‘chiradi va tuple qaytaradi (Python 3.7+)\nkalit, qiymat = talaba.popitem()\nprint(f"popitem: kalit={kalit}, qiymat={qiymat}, qoldi={talaba}")\n\n# update() — bir nechta juftlikni qo‘shish yoki yangilash\ntalaba.update({"yosh": 20, "kurs": 3, "faol": True})\nprint("update:", talaba)',
                codeNote: 'pop() kalitni o‘chirishni kafolatlaydi va old qiymatni qaytaradi.',
                result: "del kurs: {'ism': 'Ziyoda', 'yosh': 19, 'shahar': 'Namangan'}\npop yosh: {'ism': 'Ziyoda', 'shahar': 'Namangan'} | o‘chirilgan: 19\npopitem: kalit=shahar, qiymat=Namangan, qoldi={'ism': 'Ziyoda'}\nupdate: {'ism': 'Ziyoda', 'yosh': 20, 'kurs': 3, 'faol': True}",
                note: 'clear() — barchasini tozalaydi (bo‘sh dict).'
              },
              {
                title: 'Loop aylantirish usullari',
                text: '3 ta asosiy usul: keys(), values(), items()',
                code: 'd = {"a": 1, "b": 2, "c": 3}\n\n# 1) keys() — faqat kalitlar\nfor kalit in d.keys():\n    print(f"kalit: {kalit}", end=" | ")\nprint()\n\n# 2) values() — faqat qiymatlar\nfor qiymat in d.values():\n    print(f"qiymat: {qiymat}", end=" | ")\nprint()\n\n# 3) items() — KALIT+QIYMAT juftliklari (tuple)\nfor k, v in d.items():\n    print(f"{k}: {v}")\n\n# Oddiy for kalit in d — kalitlarni aylantiradi (keys() bilan bir xil)\nfor kalit in d:\n    print(kalit, end=" ")',
                codeNote: 'items() — eng ko‘p ishlatiladi, unpacking orqali k, v ni darhol ajratib olasiz.',
                result: "kalit: a | kalit: b | kalit: c | \nqiymat: 1 | qiymat: 2 | qiymat: 3 | \na: 1\nb: 2\nc: 3\na b c ",
                note: 'Eski Python larda tartibsiz, 3.7+ tartibli (insertion order).'
              },
              {
                title: 'in operatori va boshqa foydali narsalar',
                text: 'Kalit bormi? dict nested (ichma-ich). Comprehensions (keyingi darslar).',
                code: 'd = {"ism": "Bekzod", "yosh": 24}\n\n# in — KALIT bor-yo‘q (qiymat emas!)\nprint("ism bor:", "ism" in d)        # True\nprint("yosh bor:", "yosh" in d)      # True\nprint("Bekzod bor:", "Bekzod" in d)  # False! Kalit emas (qiymat)\nprint("Bekzod qiymat:", "Bekzod" in d.values())  # True (qiymatlar ichida qidirish)\n\n# Nested dict (ichma-ich lug‘at)\nusers = {\n    "user1": {"ism": "Ali", "yosh": 20},\n    "user2": {"ism": "Vali", "yosh": 25}\n}\nprint("user2 ismi:", users["user2"]["ism"])  # Vali',
                codeNote: 'in operatori DEFAULT KALITLAR orasida qidiradi. Qiymatlar orasida qidirish uchun values() ni chaqiring.',
                result: "ism bor: True\nyosh bor: True\nBekzod bor: False\nBekzod qiymat: True\nuser2 ismi: Vali",
                note: 'Kalitlarga ID (int) berish juda qulay (foydalanuvchilar ID si kabi).'
              }
            ],
            keyPoints: [
              'Dict: {kalit1: qiymat1, kalit2: qiymat2} — KALIT/QIYMAT juftligi',
              'Kalit: unique, hashable (list emas, tuple mumkin)',
              'dict["kalit"] = qiymat — qo‘shish yoki o‘zgartirish',
              'get(kalit, default) — KeyError dan qutqaradi',
              'del, pop(), popitem(), update()',
              'Loop: keys(), values(), items() (eng ko‘p items())',
              'in — kalit bormi; values() da qidirish uchun in d.values()'
            ],
            masterXp: 35,
            homework: '1. O‘zingiz haqizda dict yarating: ism, familiya, yosh, shahar, sevimli fanlar (list). print().\n2. Avval 1-dagi dict ga "yosh" kalitini yangilab turini o‘zgartiring (1 yosh ko‘paytiring).\n3. del va pop() farqini tushuntiruvchi kod yozing (ikkala usulni ham sinab ko‘ring).\n4. {"ingliz": 85, "matematika": 92, "ona tili": 78} — items() bilan aylantirib, "Fan: X → Ball: Y" formatda chop qiling.\n5. "ona tili" kalit bor-yo‘qligini in operatori bilan tekshiring.\n6. (Challenge) Baholar dict ni yaratib: a) umumiy yig‘indi, b) o‘rtacha ball, c) eng baland/eng past ballni topuvchi kod yozing (for bilan).',
            summary: 'Bugun Dictionary (lug‘at) ni o‘rgandik. Kalit/Qiymat, qo‘shish/o‘zgartirish/o‘chirish usullari, loop, in. List va tuple ni keyingi dars — Set bilan tugatamiz!',
            exercises: [
              {
                id: 'py10ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Dictga yangi kalit qo‘shish ➕',
                instruction: 'avto = {"model": "Malibu", "yil": 2023} dict ga "rangi": "oq" va "narx": 25000 kalitlarini qo‘shing va chop qiling.',
                startCode: 'avto = {"model": "Malibu", "yil": 2023}\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'avto\\s*\\[\\s*["\']rangi["\']\\s*\\]\\s*=\\s*["\']oq["\']|avto\\s*\\.update\\s*\\(.*rangi.*oq', msg: 'rangi: oq qo‘shilishi kerak' },
                  { re: 'avto\\s*\\[\\s*["\']narx["\']\\s*\\]\\s*=\\s*25000|avto\\s*\\.update\\s*\\(.*narx.*25000', msg: 'narx: 25000 qo‘shilishi kerak' }
                ],
                hint: 'avto["kalit"] = qiymat shaklida qo‘shing yoki update().',
                explanation: 'Kalit mavjud bo‘lmasa — yangi qo‘shiladi, mavjud bo‘lsa — qiymat yangilanadi. avto["rangi"] = "oq"; avto["narx"] = 25000.',
                xp: 10
              },
              {
                id: 'py10ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Dict metodlari 🧩',
                instruction: '"dict kalitlarini olish" — keys(), values(), items() larni mos vazifalar bilan bog‘lang.',
                hint: 'Kalitlar, qiymatlar, (kalit, qiymat) juftliklar.',
                items: ['keys()', 'values()', 'items()', 'faqat KALITLARNI qaytaradi', 'faqat QIYMATLARNI qaytaradi', '(KALIT, QIYMAT) JUFTLIKLARNI qaytaradi'],
                xp: 10
              },
              {
                id: 'py10ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"men dict dan kalit orqali qiymat olmoqchiman, lekin xato chiqyapti". Nima sabab?',
                code: 'talaba = {"ism": "Ali", "yosh": 20}\nprint(talaba["kurs"])',
                options: ['Dict yopilmagan', '"kurs" KALITI MA'+'VJUD EMAS — KeyError', 'print xato', 'Dict turi noto‘g‘ri'],
                answer: 1,
                explanation: '"kurs" kaliti dict da mavjud emas — KeyError xatosi. Avval kalit bor-yo‘qligini in operatori bilan tekshiring yoki .get("kurs", default) ishlating.',
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Dictionary (dict) qanday yaratiladi?',
                options: ['[]', '{} (kalit:qiymat)', '()', 'set()'],
                answer: 1,
                explanation: 'Dict = {"kalit1": qiymat1, "kalit2": qiymat2} — {} ichida kalit:qiymat juftliklari.'
              },
              {
                question: 'd = {"a": 1} — d["a"] ni qiymati?',
                options: ['"a"', '1', '["a", 1]', 'Xato'],
                answer: 1,
                explanation: 'Kalit orqali murojaat: d["kalit"] → shu kalitning qiymatini qaytaradi.'
              },
              {
                question: 'd = {"x": 5} — d["y"] = 10 qilinganda nima sodir bo‘ladi?',
                options: ['Xato', '"y" kaliti YANGI qo‘shiladi, qiymati 10', '"y" kaliti mavjud emasligi uchun 0 ga teng', 'd dict o‘chiriladi'],
                answer: 1,
                explanation: 'Kalit mavjud bo‘lmasa — YANGI qo‘shiladi; mavjud bo‘lsa — qiymati YANGILANADI.'
              },
              {
                question: 'd.keys() nima qaytaradi?',
                options: ['Qiymatlar', 'KALITLAR ro‘yxati', '(kalit, qiymat) juftliklar', 'Faqat birinchi kalit'],
                answer: 1,
                explanation: '.keys() = kalitlar; .values() = qiymatlar; .items() = (kalit, qiymat) juftliklar.'
              },
              {
                question: 'for kalit, qiymat in d.items(): loop nima qiladi?',
                options: ['Faqat kalitlarni aylantiradi', 'Har iteratsiyada (kalit, qiymat) juftlikni birga oladi', 'Faqat qiymatlarni', 'Dictni o‘chiradi'],
                answer: 1,
                explanation: 'for k, v in dict.items() — bu dict aylantirishning eng ko‘p ishlatiladigan usuli.'
              },
              {
                question: 'del d["kalit"] nima qiladi?',
                options: ['Qiymatni 0 qiladi', 'Kalitni (va uning qiymatini) O‘CHIRADI', 'Dictni butunlay o‘chiradi', 'Kalit nomini o‘zgartiradi'],
                answer: 1,
                explanation: 'del dict["kalit"] = bu kalit + qiymatni o‘chiradi. .pop("kalit") ham o‘chiradi va qiymatni qaytaradi.'
              },
              {
                question: '"kalit" in dict — natija qanday?',
                options: ['Qiymatni qaytaradi', 'True/False — kalit BOR/YO‘Q tekshiruv', 'Yangilatadi', 'O‘chiradi'],
                answer: 1,
                explanation: 'in operatori kalit borligini tekshiradi: if "kalit" in dict: — KeyError oldini oladi.'
              },
              {
                question: 'd = {"n": 5} — d.get("x", 0) nima qaytaradi?',
                options: ['KeyError', '0 — "x" kalit YO‘Qligi sabab default qiymat 0', 'None', '5'],
                answer: 1,
                explanation: '.get(kalit, default) = kalit bor bo‘lsa qiymat, yo‘q bo‘lsa default (default defaulti None).'
              }
            ]
          }
        },
        {
          title: 'Set',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Bugun List/Tuple/Dictionary dan so‘ng eng oxirgi standard to‘plam turi — Set (to‘plam) bilan tanishamiz. Setning asosiy xususiyati: TAKRORLANMAYDIGAN (unique) elementlar va matematik to‘plam amallari!',
            sections: [
              {
                title: 'Set nima va yaratish?',
                text: 'Set — takrorlanmagan (unique), tartibsiz elementlar to‘plami. {} yordamida yaratiladi lekin KALIT/QIYMAT emas — faqat ELEMENTLAR.\n\n• Unique (takrorlash mumkin emas)\n• Tartibsiz (indeks yo‘q, slicing yo‘q)\n• Mutable (qo‘shish/o‘chirish mumkin)\n• Faqat immutable elementlar (int, str, tuple — list emas!)',
                code: '# Bo‘sh set\n# ESLATMA: {} = BO‘SH DICT! Bo‘sh set = set()\ns_bosh = set()\n\n# Elementli set\ns1 = {1, 2, 3, 4, 5}\ns2 = {"olma", "banan", "gilos"}\ns3 = {1, 2, 2, 3, 3, 3, 4}  # ⚠️ TAKRORLAR O‘CHIRILADI!\n\nprint("s1:", s1)\nprint("s2:", s2)\nprint("s3 (takror yo‘q):", s3)\nprint("len s3:", len(s3))\n\n# List → set (takrorlarni olib tashlash uchun juda qulay!)\nnumbers_with_dup = [1, 2, 2, 3, 4, 4, 4, 5]\nnumbers_unique = list(set(numbers_with_dup))\nprint("Unique:", numbers_unique)',
                codeNote: '⚡️ Eng ko‘p ishlatiladigan holat: LISTDAGI TAKRORLARNI O‘CHIRISH → list(set(list)).',
                result: "s1: {1, 2, 3, 4, 5}\ns2: {'gilos', 'banan', 'olma'}  # Tartibsiz!\ns3 (takror yo‘q): {1, 2, 3, 4}\nlen s3: 4\nUnique: [1, 2, 3, 4, 5]",
                note: 'Setda tartib HECH QACHON KAFOLATLANMAYDI. Tartib kerak bo‘lsa → list ishlating.'
              },
              {
                title: 'Element qo‘shish va o‘chirish',
                text: 'add(), remove(), discard(), pop(), clear()',
                code: 's = {1, 2, 3}\n\n# add() — bitta element qo‘shish\ns.add(4)\nprint("add 4:", s)\ns.add(2)  # 2 allaqachon bor → e’tibor berilmaydi (xato yo‘q)\nprint("add 2 (bor):", s)\n\n# update() — bir nechta element qo‘shish (to‘plam yoki list qo‘shish)\ns.update([5, 6, 7])\nprint("update:", s)\n\n# remove(elem) — bor bo‘lsa o‘chiradi, YUQ BO‘LSA XATO BERADI\ns.remove(3)\nprint("remove 3:", s)\n# s.remove(100) → KeyError!\n\n# discard(elem) — bor bo‘lsa o‘chiradi, YO‘Q BO‘LSA HAM XATO BERMAYDI\ns.discard(100)  # Xatolik yo‘q!\nprint("discard 100:", s)\n\n# pop() — random (tasodifiy) elementni o‘chiradi va qaytaradi (set tartibsiz!)\nprint("pop:", s.pop(), "→ after pop:", s)\n\n# clear() — barchasini tozalash\ns.clear()\nprint("clear:", s)',
                codeNote: 'remove() va discard() farqi: yo‘q bo‘lsa remove xato beradi, discard bermaydi.',
                result: "add 4: {1, 2, 3, 4}\nadd 2 (bor): {1, 2, 3, 4}\nupdate: {1, 2, 3, 4, 5, 6, 7}\nremove 3: {1, 2, 4, 5, 6, 7}\ndiscard 100: {1, 2, 4, 5, 6, 7}\npop: 1 → after pop: {2, 4, 5, 6, 7}\nclear: set()",
                note: 'pop() — hech qachon qaysi elementni o‘chirishini bilmaysiz, setda tartib yo‘qligi uchun.'
              },
              {
                title: 'To‘plam amallari: kesishma, birlashma, farq, simmetrik farq',
                text: 'Bu Setning eng kuchli tomoni — matematik to‘plam amallari oson bajariladi!',
                code: 'a = {1, 2, 3, 4, 5}\nb = {4, 5, 6, 7, 8}\n\n# 1) BIRLASHMA (union): IKKI SETDAGI BARCHA ELEMENTLAR (takrorlarsiz)\nprint("Birlashma (|):", a | b)              # yoki a.union(b)\nprint("union():", a.union(b))\n\n# 2) KESISHMA (intersection): IKKALASIDA HAM BOR ELEMENTLAR\nprint("Kesishma (&):", a & b)               # yoki a.intersection(b)\nprint("intersection():", a.intersection(b))\n\n# 3) FARQ (difference): A da bor lekin B da YO‘Q\nprint("A \\ B:", a - b)                     # yoki a.difference(b)\nprint("B \\ A:", b - a)\n\n# 4) SIMMETRIK FARQ: IKKALASIDA HAM KESISHMADAGI ELEMENTLARNI QATTASIZ\nprint("Simmetrik farq (^):", a ^ b)         # yoki a.symmetric_difference(b)\n# a^b = (a-b) | (b-a) = (a|b) - (a&b)',
                codeNote: '| & - ^ — operatorlari, union/intersection/difference/symmetric_difference — methodlari.',
                result: "Birlashma (|): {1, 2, 3, 4, 5, 6, 7, 8}\nunion(): {1, 2, 3, 4, 5, 6, 7, 8}\nKesishma (&): {4, 5}\nintersection(): {4, 5}\nA \\ B: {1, 2, 3}\nB \\ A: {8, 6, 7}\nSimmetrik farq (^): {1, 2, 3, 6, 7, 8}",
                note: 'Bu amallar Real loyihalarda: ikki ro‘yxatda umumiy narsalar, farqli narsalar, takrorlarni olib tashlash, kabi ko‘p holatlarda ishlatiladi.'
              },
              {
                title: 'Subset va Superset tekshiruvi',
                text: 'A set, B setning ichimi?',
                code: 'a = {1, 2, 3}\nb = {1, 2, 3, 4, 5}\n\n# subset: A ning barcha elementlari B da bor\nprint("A subset of B?", a.issubset(b))  # True\nprint("a <= b:", a <= b)                # True\n\n# superset: B ning barcha elementlari A da (teskari)\nprint("B superset of A?", b.issuperset(a))  # True\nprint("b >= a:", b >= a)                    # True\n\n# Disjoint: UMBRELMAN YAQSUNI — umumiy element yo‘q\nc = {10, 20}\nprint("a va c disjoint?", a.isdisjoint(c))  # True (umumiy element yo‘q)',
                codeNote: 'a < b — strict subset (a b ning ichida lekin a != b).',
                result: "A subset of B? True\na <= b: True\nB superset of A? True\nb >= a: True\na va c disjoint? True",
                note: 'A < B (strict subset): a ⊂ b'
              },
              {
                title: 'Set bilan ishlash: copy, in, len, loop',
                text: 'Oddiy ishlash usullari.',
                code: 's = {10, 20, 30, 40}\n\nprint("len:", len(s))\nprint("20 in s:", 20 in s)\nprint("99 in s:", 99 in s)\n\n# Loop\nfor elem in s:\n    print(elem, end=" ")\nprint()\n\n# copy\ns_copy = s.copy()\ns_copy.add(999)\nprint("original:", s, "copy:", s_copy)',
                codeNote: 'Setni loop qilish mumkin, lekin tartibga ishonchli EMAS!',
                result: "len: 4\n20 in s: True\n99 in s: False\n40 10 20 30  # tartib har doim xilma-xil\noriginal: {40, 10, 20, 30} copy: {999, 40, 10, 20, 30}",
                note: 'Listda bor lekin setda yo‘q narsalar: indeks, slicing, + (append emas, union bor), sort (set tartibsiz, listga aylantirib sort).'
              }
            ],
            keyPoints: [
              'Set: {el1, el2} — unique, tartibsiz, mutable',
              'Bo‘sh set = set() ({} = dict emas! ❗️)',
              'add(), update() — qo‘shish; remove/discard/pop/clear — o‘chirish',
              '| union (birlashma), & intersection (kesishma), - farq, ^ simmetrik farq',
              'Listdagi takrorlarni olib tashlash → list(set(list))',
              'issubset (a<=b), issuperset (b>=a), isdisjoint (kesishmaslik)',
              'No index/slice — tartibsiz!'
            ],
            masterXp: 30,
            homework: '1. 10 ta elementli list yarating (ba‘zilari takrorlanadigan), set orqali takrorlarini olib tashlang.\n2. set_a = {1,2,3,4,5,6,7}, set_b = {5,6,7,8,9,10}. Birlashma, kesishma, A\\B, B\\A, simmetrik farqni chop qiling.\n3. fruits1 = {"olma","banan","gilos"}, fruits2 = {"banan","uzum","anor"}. Ikkalasi uchun kesishma = umumiy mevalar, birlashma = barcha mevalar, farq = birida bor boshqasida yo‘q.\n4. students_A = {"Ali","Vali","Hasan"}, students_B = {"Vali","Husan","Ali"}. A va B dagi umumiy talabalarni toping (kesishma).\n5. a = {1,2,3}; b = {1,2,3,4,5,6}. A B ning subsetmi? B A ning supersetmi? Tekshiring.\n6. (Challenge) Ikki ro‘yxat yarating. Set orqali ular orasidagi faqat 1-sida bor, 2-sida bor, ikkalasida bor va ikkalasida ham yo‘q elementlarni aniqlang.',
            summary: 'Bugun Set to‘plamini o‘rgandik: unique elementlar, matematik to‘plam amallari. Bugun 4 ta asosiy to‘plam turlari tugadi! Keyingi dars — Funksiyalar.',
            exercises: [
              {
                id: 'py11ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Takrorlarni olib tashlash 🧹',
                instruction: 'lst = [1, 2, 2, 3, 4, 4, 4, 5, 6, 6] listidagi takrorlarni SET orqali olib tashlang, qayta listga aylantiring va chop qiling.',
                startCode: 'lst = [1, 2, 2, 3, 4, 4, 4, 5, 6, 6]\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'list\\s*\\(\\s*set\\s*\\(\\s*lst\\s*\\)\\s*\\)|unique\\s*=\\s*list\\s*\\(\\s*set\\s*\\(\\s*lst\\s*\\)\\s*\\)', msg: 'list(set(lst)) ni ishlating' }
                ],
                hint: 'Avval set() ga aylantiring (takrorlar o‘chadi), keyin list() ga qaytaring.',
                explanation: 'set(lst) → {1,2,3,4,5,6}; list() → listga aylantiriladi.',
                xp: 10
              },
              {
                id: 'py11ex2',
                type: 'dragdrop',
                title: '2-MASHQ — To‘plam amallari 🧩',
                instruction: '"a va b ning KESISHMASI" ni topuvchi qismlarni to‘g‘ri joylashtiring (a & b yoki a.intersection(b)).',
                hint: 'Kalit so‘z: kesishma → & yoki intersection.',
                items: ['a', '&', 'b', 'yoki', 'a.intersection(b)'],
                xp: 10
              },
              {
                id: 'py11ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"Bo‘sh set yarataman" degan kodingizda xatolik bor, type dict chiqyapti. Nima uchun?',
                code: 's = {}\nprint(type(s))  # <class \'dict\'>!',
                options: ['{} = dict emas, set emas, tuple', '{} → BO‘SH DICT! Bo‘sh set = set() yaratilishi kerak', 'print da type() kerak emas', 'Set faqat string bilan yaratiladi'],
                answer: 1,
                explanation: 'Sintaksis xatosi! {} = BO‘SH DICTIONARY. Bo‘sh SET uchun set() ishlatiladi: s = set()'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Bo‘sh Set qanday yaratiladi?',
                options: ['{}', 'set()', '[]', '()'],
                answer: 1,
                explanation: 'set() = bo‘sh set. {} esa bo‘sh DICT. {1,2,3} esa set — to‘liq elementli.'
              },
              {
                question: '{1, 2, 2, 3, 3, 3} → set ichida nechta element qoladi?',
                options: ['6', '5', '3', 'Xatolik'],
                answer: 2,
                explanation: 'Set unique (takrorlarsiz)! Takrorlar o‘chib, 3 ta qoladi: {1,2,3}.'
              },
              {
                question: 'a = {1,2,3}; b = {3,4,5}; a & b → natija?',
                options: ['{1,2,3,4,5}', '{3}', '{1,2}', '{4,5}'],
                answer: 1,
                explanation: '& = KESISHMA. Ikkalasida ham bor element — {3}.'
              },
              {
                question: 'a = {1,2,3}; b = {3,4,5}; a | b → natija?',
                options: ['{1,2,3,4,5}', '{3}', '{1,2,3}', '{3,4,5}'],
                answer: 0,
                explanation: '| = BIRLASHMA. Ikkala setdagi barcha elementlar, takrorlanmasdan → {1,2,3,4,5}.'
              },
              {
                question: 'a = {1,2,3}; b = {3,4,5}; a - b → natija?',
                options: ['{1,2,3,4,5}', '{3}', '{1,2}', '{4,5}'],
                answer: 2,
                explanation: '- = FARQ. a da bor b da yo‘q: {1,2}.'
              },
              {
                question: 'Qaysi amal Setda ISHLANMAYDI?',
                options: ['add()', 'append()', 'remove()', 'discard()'],
                answer: 1,
                explanation: 'append() LIST usuli. Set uchun add() bitta element qo‘shish, update() bir nechta uchun ishlatiladi.'
              },
              {
                question: 'a.issubset(b) qachon True qaytaradi?',
                options: ['a b ning to‘liq ichida bo‘lsa', 'b a ning to‘liq ichida bo‘lsa', 'a va b teng bo‘lsa', 'umumiy element bo‘lmasa'],
                answer: 0,
                explanation: 'subset — a ⊆ b: a ning barcha elementlari b da bor.'
              },
              {
                question: 's = {5,2,8} → print(s[0]) → natija?',
                options: ['5', '2', '8', 'TypeError: not subscriptable'],
                answer: 3,
                explanation: 'Set TARTIBSIZ, indeks/slice mavjud emas! Indeks bilan murojaat = XATO.'
              }
            ]
          }
        },
        {
          title: 'Funksiyalar',
          duration: 25,
          xp: 35,
          content: {
            intro: 'Bugun kodni qayta-qayta yozmaslik uchun FUNKSIYALARNI o‘rganamiz. Funksiya — biron ishni bajaruvchi kod bloki, uni istalgan joyda chaqirib ishlatish mumkin.',
            sections: [
              {
                title: 'Funksiya nima? Yaratish va chaqirish',
                text: 'Funksiya — ma’lum bir vazifani bajaruvchi, nomlangan kod bloki. Kodni qayta ishlatish (DRY — Don’t Repeat Yourself) va dastur tuzilishi uchun juda muhim.\n\ndef KALIT SO‘ZI bilan yaratiladi:',
                code: '# Funksiya yaratish (define)\ndef salom_ber():\n    print("Assalomu alaykum!")\n    print("Python darslariga xush kelibsiz!")\n\n# Funksiyani CHAQIRISH\nsalom_ber()\nprint("---")\nsalom_ber()  # 2-marta ishlatish',
                codeNote: 'def nom(): — keyingi qatorlar 4 space ichkariga suriladi (funksiya tanasi).',
                result: 'Assalomu alaykum!\nPython darslariga xush kelibsiz!\n---\nAssalomu alaykum!\nPython darslariga xush kelibsiz!',
                note: 'DRY prinsipi — Do not Repeat Yourself. Xuddi shu kodni 2 marta yozmang, funksiya yarating!'
              },
              {
                title: 'Parametr va Argument (Parameter vs Argument)',
                text: 'Funksiyaga qiymatlar uzatish mumkin:\n\n• Parameter — funksiya YARATILISHDA yozilgan o‘zgaruvchi\n• Argument — funksiya CHAQIRILISHDA berilgan haqiqiy qiymat',
                code: '# ism PARAMETR\ndef salom_ber(ism):\n    print(f"Assalomu alaykum, {ism}!")\n\n# "Ali" va "Vali" ARGUMENT\nsalom_ber("Ali")\nsalom_ber("Vali")\nsalom_ber("Gulnora")\n\n# 2 ta parametr\ndef yigindi(a, b):\n    print(f"{a} + {b} = {a + b}")\n\nyigindi(5, 3)\nyigindi(100, 250)',
                codeNote: 'Berilgan argumentlar parametrga mos tartibda yoziladi (positional arguments).',
                result: 'Assalomu alaykum, Ali!\nAssalomu alaykum, Vali!\nAssalomu alaykum, Gulnora!\n5 + 3 = 8\n100 + 250 = 350',
                note: 'Parametr soni argument soniga TENG bo‘lishi kerak, aks holda TypeError.'
              },
              {
                title: 'return — qiymat qaytarish',
                text: 'print() konsolga chiqaradi, return esa funksiyadan QIYMAT QAYTARADI va uni o‘zgaruvchiga saqlash mumkin. return dan keyingi kod ISHLANMAYDI!',
                code: 'def kvadrat(son):\n    return son * son  # qiymatni QAYTARADI (konsolga chiqarmaydi!)\n\n# Qaytarilgan qiymatni saqlaymiz\nnatija = kvadrat(5)\nprint("5 ning kvadrati:", natija)\nprint("7 ning kvadrati:", kvadrat(7))\n\n# Bir nechta qiymat qaytarish (tuple qaytaradi!)\ndef kva_kub(son):\n    return son**2, son**3\n\nkv, kb = kva_kub(4)\nprint(f"4^2={kv}, 4^3={kb}")',
                codeNote: 'return funksiyani DARHOL TUGATADI va berilgan qiymatni jo‘natadi. Keyingi qatorlar ishlamaydi!',
                result: '5 ning kvadrati: 25\n7 ning kvadrati: 49\n4^2=16, 4^3=64',
                note: 'return yo‘q bo‘lsa funksiya None qaytaradi (default).'
              },
              {
                title: 'Default parametr (standart qiymat)',
                text: 'Agar argument berilmasa, standart qiymatdan foydalanadi.',
                code: 'def salom(ism, salomlashuv="Assalomu alaykum"):\n    print(f"{salomlashuv}, {ism}!")\n\nsalom("Ali")                       # default "Assalomu alaykum"\nsalom("Vali", "Xayrli tong")       # o‘z qiymat berildi\nsalom("Hasan", "Good morning")\n\n# Yana misol: daraja=2 standart\ndef daraja(son, daraja=2):\n    return son ** daraja\n\nprint(daraja(5))       # 5^2 = 25 (default)\nprint(daraja(5, 3))    # 5^3 = 125',
                codeNote: 'Default parametrlar HAR DOIM oxirida yoziladi! def func(a=1, b) → xato.',
                result: 'Assalomu alaykum, Ali!\nXayrli tong, Vali!\nGood morning, Hasan!\n25\n125',
                note: 'Mutable default (list/dict) ishlatmaslik kerak — u bir nechta chaqirishlarda umumiy bo‘lib qoladi.'
              },
              {
                title: 'Keyword arguments (kalit so‘z bilan chaqirish)',
                text: 'Tartibdan qat’i nazar, kalit so‘z bilan argument berish mumkin.',
                code: 'def info(ism, familiya, yosh):\n    print(f"Ism: {ism}, Familiya: {familiya}, Yosh: {yosh}")\n\n# Oddiy (positional)\ninfo("Ali", "Valiyev", 25)\n\n# Keyword — tartibga ishonch yo‘q\ninfo(yosh=30, ism="Ziyoda", familiya="Qodirova")\n\n# Aralash: positional boshlanadi, so‘ng keyword\ninfo("Bekzod", yosh=22, familiya="Alimov")',
                codeNote: 'Positional (tartibli) argumentlar HAR DOIM oldinda, so‘ng keyword keladi — aks holda xato.',
                result: 'Ism: Ali, Familiya: Valiyev, Yosh: 25\nIsm: Ziyoda, Familiya: Qodirova, Yosh: 30\nIsm: Bekzod, Familiya: Alimov, Yosh: 22',
                note: 'Ko‘p parametrli funksiyalarda keyword chaqirish tushunarliroq.'
              },
              {
                title: 'Docstring (funksiya uchun hujjat)',
                text: 'Funksiya nima qilishini yozuvchi izoh (docstring) — """ """ uchta qo‘yshtirnoq ichida.',
                code: 'def faktorial(n):\n    """\n    n ning faktorialini hisoblaydi (n!)\n    n! = 1*2*3*...*n\n    Kirish: n (butun son, n >= 0)\n    Chiqish: n! (butun son)\n    """\n    if n == 0 or n == 1:\n        return 1\n    natija = 1\n    for i in range(2, n+1):\n        natija *= i\n    return natija\n\nprint("5! =", faktorial(5))\n\n# Docstring ni ko‘rish uchun: help() yoki .__doc__\nprint("\\nFunksiya hujjati:")\nprint(faktorial.__doc__)',
                codeNote: 'Docstring — keyingi o‘zingizni ham, boshqalarning ham kodni oson tushunishiga yordam beradi.',
                result: '5! = 120\n\nFunksiya hujjati:\n\n    n ning faktorialini hisoblaydi (n!)\n    n! = 1*2*3*...*n\n    Kirish: n (butun son, n >= 0)\n    Chiqish: n! (butun son)\n    ',
                note: 'help(faktorial) chaqirsangiz ham docstring ko‘rinadi.'
              }
            ],
            keyPoints: [
              'def nom(parametrlari): — funksiya yaratish',
              'Chaqirish: nom(argumentlar)',
              'Parameter → yaratishda; Argument → chaqirishda',
              'return qiymat — funksiyadan qiymat qaytaradi (None default)',
              'Default parametr: def fn(a, b=5) — default oxirida',
              'Keyword args: fn(b=2, a=1) — tartib muhim emas',
              'Docstring """...""" — funksiya uchun hujjat'
            ],
            masterXp: 35,
            homework: '1. "Salom, Dunyo!" chop qiluvchi oddiy funksiya yozing va 3 marta chaqiring.\n2. 2 ta sonni qabul qilib, ularni ko‘paytmasini return qiluvchi funksiyani yozing va sinab ko‘ring.\n3. "ism" parametr qabul qilib, "Hurmatli {ism}, sizni saytimizda ko‘rganimizdan xursandmiz!" chop qiluvchi funksiya.\n4. Default parametrli: daraja(son, d=2) — son**d qaytaruvchi. (d=3, d=4 bilan ham sinab ko‘ring).\n5. 3 ta sonni qabul qilib, ularning O‘RTA ARIFMETIKINI return qiluvchi funksiyani yozing: (a+b+c)/3.\n6. Faktorial funksiyasini recursiv yozing (o‘zini o‘zi chaqiruvchi): fakt(n) = n * fakt(n-1).\n7. (Challenge) Tub son tekshiruvchi funksiya: is_prime(n) → True/False qaytaradi.',
            summary: 'Bugun Funksiyalarni o‘rgandik: yaratish, parametr, return, default, keyword, docstring. Keyingi dars — *args va **kwargs!',
            exercises: [
              {
                id: 'py12ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Yig‘indi funksiyasi ➕',
                instruction: '2 ta son qabul qilib ularni YIG‘INDISINI RETURN qiluvchi yigindi(a, b) funksiyasini yozing. Keyin yigindi(15, 27) natijasini chop qiling.',
                startCode: '# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'def\\s+yigindi\\s*\\(\\s*a\\s*,\\s*b\\s*\\)', msg: 'def yigindi(a, b) funksiyasini yarating' },
                  { re: 'return\\s+a\\s*\\+\\s*b', msg: 'return a + b' },
                  { re: 'print\\s*\\(\\s*yigindi\\s*\\(\\s*15\\s*,\\s*27\\s*\\)\\s*\\)', msg: 'print(yigindi(15, 27))' }
                ],
                hint: 'def yigindi(a, b): return a + b.',
                explanation: 'Yig‘indi funksiyasi return a + b.',
                xp: 10
              },
              {
                id: 'py12ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Kvadrat funksiyasi 🧩',
                instruction: '"n ning kvadrati = n*n" funksiyasini to‘g‘ri qatorlarga ajratib yozing (def, param, return, chaqirish).',
                hint: 'def → parametr → return → chaqirish.',
                items: ['def kvadrat(n):', '    return n * n', 'natija = kvadrat(7)', 'print(natija)'],
                xp: 10
              },
              {
                id: 'py12ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"3 ta sonning yig‘indisini hisoblayman" degan funksiya ishlamaydi. Nima uchun?',
                code: 'def yig3(a, b, c):\n    nat = a + b + c\n    print(nat)\n\nx = yig3(2, 3, 4)\nprint("X:", x)  # Nima uchun None chiqdi?!',
                options: ['Parametrlar soni noto‘g‘ri', 'RETURN yo‘q, shuning uchun None qaytadi', 'print ichida print ishlatish mumkin emas', 'funksiya nomi qisqa'],
                answer: 1,
                explanation: 'return keltirilmagani sabab funksiya None qaytaradi! print faqat konsolga chiqaradi, qiymat qaytarmaydi. To‘g‘ri: return nat yoki darhol return a+b+c.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Funksiya yaratish uchun qaysi kalit so‘z?',
                options: ['function', 'def', 'fn', 'define'],
                answer: 1,
                explanation: 'def — define (aniqlash) kalit so‘zi: def nom(): ...'
              },
              {
                question: 'Parametr va Argument orasidagi farq?',
                options: ['Farqi yo‘q, sinonim', 'Parameter yaratishda, Argument chaqirishda beriladi', 'Argument yaratishda, Parameter chaqirishda', 'Parameter faqat int turida'],
                answer: 1,
                explanation: 'Parameter: def fn(a, b): a va b PARAMETR. fn(5, 3) — 5 va 3 ARGUMENT.'
              },
              {
                question: 'def foo(a, b=5): ... da b=5 nima?',
                options: ['Xato sintaksis', 'Default (standart) qiymat', 'Tenglikni tekshirish', 'Ikkalasi ham teng'],
                answer: 1,
                explanation: 'Default parametr: agar b berilmasa, avtomatik 5 olinadi. Default parametrlar OXIRIDA bo‘lishi shart!'
              },
              {
                question: 'return vazifasi?',
                options: ['Faqat konsolga chiqaradi', 'Funksiyadan qiymat qaytaradi va tugatadi', 'Faqat tsiklni to‘xtatadi', 'Funksiya nomini o‘zgartiradi'],
                answer: 1,
                explanation: 'return QiymatQaytaradi — funksiyadan chiqib, berilgan qiymatni jo‘natadi. return dan keyingi kod hech qachon ishlamaydi.'
              },
              {
                question: 'def kv(n): return n**2 → print(kv(4)) natija?',
                options: ['4', '8', '16', 'n**2'],
                answer: 2,
                explanation: 'kv(4) = 4**2 = 16. return 16 → print 16.'
              },
              {
                question: 'Docstring qanday yoziladi?',
                options: ['// qator', '/* ... */', '""" ... """ uchta qo‘yshtirnoq', '# qator'],
                answer: 2,
                explanation: 'Docstring — uchta qo‘yshtirnoq: """funksiya nima qiladi""". help() orqali ko‘rish mumkin.'
              },
              {
                question: 'fn(a=1, b) — xato nima?',
                options: ['To‘g‘ri', 'Default parametr OXIRIDA emas — oldinda bo‘ldi', 'Parametrlar vergulsiz', 'fn nomi noto‘g‘ri'],
                answer: 1,
                explanation: 'Default parametrlar (standart qiymatli) HAR DOIM oxirida yoziladi! def fn(b, a=1): — to‘g‘ri.'
              },
              {
                question: 'def tpl(a, b): return a, b → type(tpl(2, 3))?',
                options: ['list', 'tuple', 'dict', 'set'],
                answer: 1,
                explanation: 'return a, b → Python tuple deb qabul qiladi (vergul borligi sabab). (a, b) bilan bir xil!'
              }
            ]
          }
        },
        {
          title: 'Args va kwargs',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Bugun funksiyalarga ISTALGAN SONLI argumentlarni uzatishni o‘rganamiz: *args (ixtiyoriy sonli positional) va **kwargs (ixtiyoriy sonli keyword). Bu juda kuchli xususiyat!',
            sections: [
              {
                title: '*args — ixtiyoriy sonli positional argumentlar',
                text: 'Agar funksiyaga nechta positional argument kelishi aniq bo‘lmasa, *args ishlatiladi. args — TUPLE ko‘rinishida barcha argumentlarni oladi.',
                code: 'def yigindi(*args):\n    print("args tuple:", args)\n    jami = 0\n    for son in args:\n        jami += son\n    return jami\n\nprint("2 ta:", yigindi(5, 3))\nprint("4 ta:", yigindi(1, 2, 3, 4))\nprint("0 ta:", yigindi())\nprint("7 ta:", yigindi(10, 20, 30, 40, 50, 60, 70))',
                codeNote: 'args NOMI shart emas, * oldida bo‘lsa yetarli. Umumiy qoida: *nom — args.',
                result: 'args tuple: (5, 3)\n2 ta: 8\nargs tuple: (1, 2, 3, 4)\n4 ta: 10\nargs tuple: ()\n0 ta: 0\nargs tuple: (10, 20, 30, 40, 50, 60, 70)\n7 ta: 280',
                note: '*args har doim TUPLE qaytaradi. Hatto bir argument bo‘lsa ham: (5,) — tuple.'
              },
              {
                title: '**kwargs — ixtiyoriy sonli keyword argumentlar',
                text: '**kwargs — kalit=qiymat ko‘rinishidagi argumentlarni DICT sifatida qabul qiladi.',
                code: 'def foydalanuvchi(**kwargs):\n    print("kwargs dict:", kwargs)\n    for kalit, qiymat in kwargs.items():\n        print(f"  {kalit}: {qiymat}")\n\nprint("--- 2 ta kalit:")\nfoydalanuvchi(ism="Ali", yosh=25)\nprint("--- 4 ta kalit:")\nfoydalanuvchi(ism="Ziyoda", familiya="Qodirova", yosh=21, shahar="Samarqand")',
                codeNote: 'kwargs NOMI shart emas — ** oldida bo‘lsa yetarli. **nom.',
                result: '--- 2 ta kalit:\nkwargs dict: {\'ism\': \'Ali\', \'yosh\': 25}\n  ism: Ali\n  yosh: 25\n--- 4 ta kalit:\nkwargs dict: {\'ism\': \'Ziyoda\', \'familiya\': \'Qodirova\', \'yosh\': 21, \'shahar\': \'Samarqand\'}\n  ism: Ziyoda\n  familiya: Qodirova\n  yosh: 21\n  shahar: Samarqand',
                note: '**kwargs = dict'
              },
              {
                title: 'Oddiy, *args, **kwargs birlashtirish — TO‘G‘RI TARTIB',
                text: 'Quyidagi tartibda yozilishi SHART (barchasi birga ishlatilsa):\n\n1. Oddiy positional parametrlar\n2. *args\n3. Default parametrlar\n4. **kwargs',
                code: 'def misol(a, b, *args, default=10, **kwargs):\n    print(f"a={a}, b={b}")\n    print(f"*args = {args}")\n    print(f"default = {default}")\n    print(f"**kwargs = {kwargs}")\n\nmisol(1, 2, 3, 4, 5, default=99, ism="Ali", yosh=20)',
                codeNote: 'Tartib juda muhim! Xato tartib = SyntaxError.',
                result: 'a=1, b=2\n*args = (3, 4, 5)\ndefault = 99\n**kwargs = {\'ism\': \'Ali\', \'yosh\': 20}',
                note: 'Yodda saqlash: oddiy → *args → default → **kwargs.'
              },
              {
                title: 'List/tuple/dict ni unpack qilish funksiyaga uzatish',
                text: '* ro‘yxatni elementlarga, ** dict ni kalit:qiymatga ajratib funksiyaga beradi.',
                code: 'def yig(a, b, c):\n    return a + b + c\n\n# LIST ni * bilan unpack\nsonlar = [10, 20, 30]\nprint("yig(*sonlar):", yig(*sonlar))  # = yig(10, 20, 30)\n\n# Dict ni ** bilan unpack\ndef info(ism, familiya, yosh):\n    return f"{ism} {familiya}, {yosh} yosh"\n\nodam = {"ism": "Bek", "familiya": "A", "yosh": 30}\nprint("info(**odam):", info(**odam))',
                codeNote: '*sonlar listni [10,20,30] → 10, 20, 30 ta’lif qiladi. **odam → ism="Bek", familiya="A", yosh=30.',
                result: 'yig(*sonlar): 60\ninfo(**odam): Bek A, 30 yosh',
                note: 'Element soni mos kelmasa → TypeError.'
              }
            ],
            keyPoints: [
              '*args — positional argumentlarni TUPLE sifatida oladi',
              '**kwargs — keyword argumentlarni DICT sifatida oladi',
              'Tartib: oddiy → *args → default → **kwargs',
              '*list — unpack list/tuple',
              '**dict — unpack dict',
              'args, kwargs nomi shart emas — *nom, **nom'
            ],
            masterXp: 30,
            homework: '1. *args yordamida istalgancha sonning ko‘paytmasini qaytaruvchi kopaytma(*args) yozing.\n2. **kwargs yordamida istalgancha kalit:qiymat qabul qiluvchi funksiyani yozing, nechta kalit kelsa ham chop qilsin.\n3. def foo(a, *args, **kwargs) → foo(1, 2, 3, x=4, y=5) ni qo‘lda hisoblash: a=1, args=?, kwargs=? Keyin kodda sinab ko‘ring.\n4. list = [5, 10, 15] → def sum3(a,b,c) → *list bilan chaqiring.\n5. dict = {"ism": "...", "yosh": ...} → **dict unpack bilan ishlating.',
            summary: 'Bugun *args va **kwargs ni o‘rgandik: ixtiyoriy sonli argumentlar. Keyingi dars — Lambda anonim funksiyalar!',
            exercises: [
              {
                id: 'py13ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — *args yig‘indi 🔢',
                instruction: 'yigindi(*args) funksiyasini to‘ldiring va yigindi(10,20,30,40) ni chop qiling (natija 100 bo‘lsin).',
                startCode: 'def yigindi(*args):\n    jami = 0\n    # Bu yerga for tsikl yozing — args ni aylanib chiqib jami ga qo‘shing\n    return jami\n\nprint(yigindi(10, 20, 30, 40))\n',
                checks: [
                  { re: 'for\\s+\\w+\\s+in\\s+args', msg: 'for x in args: siklidan foydalaning' },
                  { re: 'jami\\s*\\+=\\s*\\w+', msg: 'jami += son bilan har bir elementni qo‘shing' }
                ],
                hint: 'for son in args: jami += son',
                explanation: '*args tuple qaytaradi, uni aylanib chiqib yig‘amiz.',
                xp: 10
              },
              {
                id: 'py13ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Tartibni tiklash 🧩',
                instruction: '"def fn(a, b, *args, def_val=5, **kwargs)" ni qismlarga ajratilgan holda to‘g‘ri joylashtiring.',
                hint: 'To‘g‘ri tartib: oddiy → *args → default → **kwargs.',
                items: ['def fn(', 'a, b', ', *args', ', def_val=5', ', **kwargs', ')'],
                xp: 10
              },
              {
                id: 'py13ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'Quyidagi kod ishlamaydi — nima sababdan?',
                code: 'def info(ism, **kwargs, *args):\n    print(ism, args, kwargs)',
                options: ['*args **kwargs dan oldinda turishi kerak (tartib xato)', 'ism parametri mayin bo‘lishi kerak', 'Funksiya da **kwargs ishlatilmaydi', '*args turli xil nomli bo‘lishi kerak'],
                answer: 0,
                explanation: 'TO‘G‘RI TARTIB: oddiy positional → *args → default → **kwargs. **kwargs *args oldinda bo‘lmaydi — SyntaxError beradi!'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: '*args funksiyaga qanday qiymat beradi?',
                options: ['List', 'Tuple', 'Dictionary', 'Set'],
                answer: 1,
                explanation: '*args har doim TUPLE ko‘rinishida argumentlarni oladi.'
              },
              {
                question: '**kwargs qanday turda?',
                options: ['List', 'Tuple', 'Dictionary (kalit:qiymat)', 'String'],
                answer: 2,
                explanation: '**kwargs — kalit=qiymat argumentlarni DICT sifatida qabul qiladi.'
              },
              {
                question: 'def foo(a, *args, **kwargs) → foo(1, 2, 3, x=4, y=5) da args = ?',
                options: ['(1, 2, 3)', '(2, 3)', '{x:4, y:5}', '[2, 3]'],
                answer: 1,
                explanation: 'a=1, qolgan positional (2, 3) → *args → tuple (2, 3).'
              },
              {
                question: 'def foo(a, *args, **kwargs) → foo(1, 2, 3, x=4, y=5) da kwargs = ?',
                options: ['{"x":4, "y":5}', '(x=4, y=5)', '[1, 2, 3]', '{"a":1}'],
                answer: 0,
                explanation: 'Kalit=qiymat argumentlar: x=4, y=5 → **kwargs = {"x":4, "y":5}.'
              },
              {
                question: 'Parametrlar to‘g‘ri tartibi qaysi?',
                options: ['*args, oddiy, **kwargs, default', 'oddiy, *args, default, **kwargs', '**kwargs, *args, oddiy, default', 'default, oddiy, *args, **kwargs'],
                answer: 1,
                explanation: 'To‘g‘ri tartib: 1. oddiy positional → 2. *args → 3. default → 4. **kwargs.'
              },
              {
                question: '[10, 20, 30] listni unpack qilib funksiyaga berish uchun qaysi belgi?',
                options: ['#list', '*list', '**list', '&list'],
                answer: 1,
                explanation: '*list → list elementlarini ajratadi: 10, 20, 30 (positional unpack).'
              },
              {
                question: '{"ism":"Ali", "yosh":25} dictni unpack qilib keyword argument sifatida berish uchun?',
                options: ['*dict', '**dict', '#dict', '%dict'],
                answer: 1,
                explanation: '**dict → kalit:qiymat → ism="Ali", yosh=25 ko‘rinishida keyword argumentga aylantiradi.'
              }
            ]
          }
        },
        {
          title: 'Lambda',
          duration: 15,
          xp: 25,
          content: {
            intro: 'Bugun qisqa va anonim (nomi yo‘q) funksiyalar — LAMBDA — bilan tanishamiz. Bir qatorda yoziladigan kichik funksiyalar uchun juda qulay.',
            sections: [
              {
                title: 'Lambda sintaksisi',
                text: 'lambda parametrlar: ifoda\n\nBir martalik ishlatish uchun, qisqa funksiyalar uchun. return YO‘Q — ifoda avtomatik return qiladi.',
                code: '# Oddiy funksiyadef kvadrat(n):\n#     return n * n\nprint("def:", kvadrat(5))\n\n# Lambda ekvivalent\nkvadrat_l = lambda n: n * n\nprint("lambda:", kvadrat_l(5))\n\n# 2 ta parametrli\nyig = lambda a, b: a + b\nprint("yig:", yig(10, 20))\n\n# Default parametrlar ham bo‘ladi\nkv = lambda a, d=2: a ** d\nprint("kv(5)=25:", kv(5))\nprint("kv(5, 3)=125:", kv(5, 3))',
                codeNote: 'lambda — bir qator. return yozilmaydi, ifoda avtomatik return.',
                result: 'def: 25\nlambda: 25\nyig: 30\nkv(5)=25: 25\nkv(5, 3)=125: 125',
                note: 'Katta murakkab funksiyalarni def bilan yozing. Lambda — qisqa uchun.'
              },
              {
                title: 'Lambda ishlatiladigan joylar: sorted, map, filter',
                text: 'Eng ko‘p boshqa funksiyalarga argument sifatida ishlatiladi.',
                code: '# 1) sorted() — custom kalit\nodamlar = [\n    {"ism": "Ali", "yosh": 28},\n    {"ism": "Ziyoda", "yosh": 19},\n    {"ism": "Bek", "yosh": 35}\n]\n# Yosh bo‘yicha tartiblash\nsort_yosh = sorted(odamlar, key=lambda x: x["yosh"])\nprint("Yosh bo‘yicha:", [o["ism"] for o in sort_yosh])\n\n# 2) map() — har bir elementga amal\nsonlar = [1, 2, 3, 4, 5]\nkvlar = list(map(lambda n: n**2, sonlar))\nprint("Kvadratlar:", kvlar)\n\n# 3) filter() — shartga mos kelganlarni oladi\njuft = list(filter(lambda n: n % 2 == 0, sonlar))\nprint("Juftlar:", juft)',
                codeNote: 'map va filter object qaytaradi → list() bilan aylantiring.',
                result: "Yosh bo‘yicha: ['Ziyoda', 'Ali', 'Bek']\nKvadratlar: [1, 4, 9, 16, 25]\nJuftlar: [2, 4]",
                note: 'Lambdani ko‘p list comprehensions va shu kabi zamonaviy usullar almashtirmoqda, lekin bilish kerak.'
              }
            ],
            keyPoints: [
              'lambda p1, p2: ifoda — bir qator anonim funksiya',
              'return yo‘q — ifoda avtomatik return',
              'sorted/map/filter da key sifatida ishlatiladi',
              'Qisqa va bir martalik ishlatish uchun'
            ],
            masterXp: 25,
            homework: '1. Lambda yordamida 2 ta son ayiruvchi (a-b) va boluvchi (a/b) funksiyalarni yozing, sinab ko‘ring.\n2. sonlar = [1,2,3,4,5,6,7,8,9,10] → map + lambda orqali har birini 3-darajaga oshiring.\n3. Yuqoridagi sonlardan filter + lambda orqali to‘q sonlarni ajratib oling.\n4. talabalar = [("Ali", 85), ("Vali", 72), ("Ziyoda", 95)] → ball orqali sorted() + lambda tartiblang.',
            summary: 'Bugun lambda (anonim) funksiyalarni o‘rgandik. sorted/map/filter ulkan foydasi bor. Keyingi dars — Modullar!',
            exercises: [
              {
                id: 'py14ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Lambda juft/To‘q 🔢',
                instruction: 'son = 27. Lambda yordamida toq_bool = lambda s: s%2==1 funksiyasini yozing va natijani chop qiling (True/False).',
                startCode: 'son = 27\n# Bu yerga kodingizni yozing\n',
                checks: [
                  { re: 'lambda\\s+\\w+\\s*:\\s*\\w+\\s*%\\s*2\\s*==\\s*1', msg: 'lambda n: n % 2 == 1 shaklida ishlating' }
                ],
                hint: 'lambda n: n % 2 == 1 → To‘qmi?',
                explanation: 'n % 2 == 1 → qoldiq 1 → toq son.',
                xp: 10
              },
              {
                id: 'py14ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Lambda yig‘indi 🧩',
                instruction: '"a va b ni qo‘shuvchi lambda" qismlarini to‘g‘ri joylashtiring: (lambda a, b: a+b)(5, 3)',
                hint: '(lambda a,b: a+b)(5,3) → darhol chaqirish.',
                items: ['(', 'lambda', 'a, b', ':', 'a + b', ')', '(5, 3)'],
                xp: 10
              },
              {
                id: 'py14ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"n ni kubini (n^3) hisoblayman" degan lambda ishlamaydi. Nima uchun?',
                code: 'kub = lambda n: n*n*n; return kub\nprint(kub(3))',
                options: ['lambda da return ishlatilmaydi — ifoda avtomatik return', 'lambda oldida def kerak', 'lambda da 3 ta ko‘paytirish amali mumkin emas', 'kub nomi xato'],
                answer: 0,
                explanation: 'lambda da HECH QACHON return YOZILMAYDI! lambda ifodasi avtomatik o‘z qiymatini return qiladi. To‘g‘ri: kub = lambda n: n**3 yoki n*n*n.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Lambda funksiya nomi bilan yaratiladimi?',
                options: ['Ha, doim nomi bor', "Yo'q — anonim (nomi yo'q)", 'Faqat katta funksiyalarda nom bor', 'Faqat def da nom bor'],
                answer: 1,
                explanation: 'lambda — ANONIM (nomisiz) funksiya. Odatda bir martalik ishlatiladi.'
              },
              {
                question: 'lambda da return ishlatiladimi?',
                options: ['Shart', "Yo'q — ifoda avtomatik return qiladi", 'Faqat bitta parametrda', 'Faqat str turlar uchun'],
                answer: 1,
                explanation: 'Lambda da return yozilmaydi! Ifoda (n*n, a+b) avtomatik return qilinadi.'
              },
              {
                question: 'yig = lambda a, b: a+b → yig(10, 20) natijasi?',
                options: ['10', '20', '30', 'lambda xato'],
                answer: 2,
                explanation: 'a+b = 10+20 = 30.'
              },
              {
                question: 'sorted(list, key=?) — key uchun lambda qanday ishlatiladi?',
                options: ["Elementning qaysi qismini ko'rsatish uchun", "Elementni o‘chirish uchun", "Elementni qo‘shish uchun", "Elementni chop qilish uchun"],
                answer: 0,
                explanation: 'key=lambda x: x[...] orqali ro‘yxatni qaysi maydon bo‘yicha tartiblashi ko‘rsatiladi.'
              },
              {
                question: 'map(lambda n: n*2, [1,2,3]) → list() qilganda natija?',
                options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', '[11, 22, 33]'],
                answer: 1,
                explanation: 'map har bir elementni 2 ga ko‘paytiradi: 2, 4, 6.'
              },
              {
                question: 'filter(lambda n: n>5, [3,7,2,9,4]) → list()?',
                options: ['[3, 7, 2, 9, 4]', '[7, 9]', '[3, 2, 4]', '[5]'],
                answer: 1,
                explanation: '5 dan kattalar: 7, 9.'
              }
            ]
          }
        },
        {
          title: 'Modullar',
          duration: 20,
          xp: 30,
          content: {
            intro: 'Bugun kodni bir nechta faylga bo‘lish usuli — MODULLAR bilan tanishamiz. Modul — bu .py fayli, import orqali undan foydalanamiz. Pythonda juda ko‘p tayyor modullar bor!',
            sections: [
              {
                title: 'Modul — nima? Import qilish',
                text: 'Modul — bu .py fayli. Uning ichida o‘zgaruvchilar, funksiyalar, class lar saqlanadi.\n\nimport MODUL_NOMI → butun modulni import qiladi.\nfrom MODUL import NIMA → aniq narsalarni import qiladi.',
                code: '# 1) Math moduli (matematika uchun)\nimport math\nprint("Pi:", math.pi)\nprint("Kvadrat ildiz 16:", math.sqrt(16))\nprint("5! =", math.factorial(5))\n\n# 2) from ... import\nfrom math import pi, sqrt\nprint("\\nimport qilingan pi:", pi)\nprint("sqrt(25):", sqrt(25))\n\n# 3) * (barchasini import qilish — tavsiya etilmaydi)\n# from math import *',
                codeNote: 'math — built-in (o‘rnatilgan) standart modul. Hech qanday qo‘shimcha o‘rnatish kerak emas.',
                result: 'Pi: 3.141592653589793\nKvadrat ildiz 16: 4.0\n5! = 120\n\nimport qilingan pi: 3.141592653589793\nsqrt(25): 5.0',
                note: 'Ko‘p hollarda from mod import fun ishlatish afzallik (chiroyli kod).'
              },
              {
                title: 'as — nomini o‘zgartirish (alias)',
                text: 'Modul yoki funksiyaga qisqaroq nom berish uchun as ishlatiladi.',
                code: 'import math as m  # math → m qisqartma\nprint("m.pi:", m.pi)\nprint("m.e:", m.e)\n\nfrom math import factorial as fakt  # factorial → fakt\nprint("10! =", fakt(10))',
                codeNote: 'as dan alias (taxallus) uchun ishlatiladi. Umumiy: import pandas as pd, import numpy as np (data science da).',
                result: 'm.pi: 3.141592653589793\nm.e: 2.718281828459045\n10! = 3628800',
                note: "Qo‘shimcha modullarda pandas → pd, numpy → np kabi qisqartmalar standartga ayylangan."
              },
              {
                title: 'Ko‘plab standart modullar',
                text: 'Pythonda juda ko‘p standart modullar bor (The Python Standard Library). Ba’zilari:\n\n• math, cmath — matematika\n• random — tasodifiy sonlar\n• datetime — sana va vaqt\n• os, sys — operatsion tizim\n• json — JSON bilan ishlash\n• re — RegEx\n• collections, itertools — qo‘shimcha to‘plamlar',
                code: '# Random moduli — tasodifiy sonlar\nimport random\n\n# Tasodifiy son 1-10 oralig‘ida (10 kiradi)\nprint("Tasodifiy 1-10:", random.randint(1, 10))\n\n# Listdan tasodifiy element tanlash\nmevalar = ["olma", "banan", "gilos", "uzum"]\nprint("Tanlangan meva:", random.choice(mevalar))\n\n# Listni aralashtirish\nraqamlar = [1, 2, 3, 4, 5]\nrandom.shuffle(raqamlar)\nprint("Aralashtirilgan:", raqamlar)',
                codeNote: 'random.shuffle LISTNI O‘ZIGA ARALASHTIRADI, yangi list qaytarmaydi!',
                result: 'Tasodifiy 1-10: 7\nTanlangan meva: gilos\nAralashtirilgan: [2, 5, 4, 1, 3]',
                note: 'Har safar natijasi turlichi chiqadi (tasodifiy!).'
              },
              {
                title: 'O‘z modulinizni yaratish',
                text: 'O‘zingiz .py fayl yarating va funksiyalar yozing. Keyin boshqa fayldan import qiling!',
                code: '# MASALAN: mymodule.py nomli fayl yarating va ichiga yozing:\n# mymodule.py:\n# def salom(ism):\n#     return f"Salom, {ism}!"\n#\n# PI = 3.14159\n\n# Keyin boshqa faylda (yoki shu yerda):\n# import mymodule\n# print(mymodule.salom("Ali"))\n# print(mymodule.PI)\n\n# HOZIRCHA: biz hozir fayl yaratolmaganim uchun oddiy namuna:\ndef salom(ism):\n    return f"Salom, {ism}!"\nprint(salom("Ziyoda"))',
                codeNote: "Oddiy .py fayl = modul. Nomli joyda bo‘lishi kerak.",
                result: 'Salom, Ziyoda!',
                note: 'Katta loyihalarda kodni modullarga (papkalar va fayllarga) bo‘lish zarur.'
              }
            ],
            keyPoints: [
              'import modul; from modul import narsa; import modul as qisqa',
              'Standart modullar: math, random, datetime, os, json, re ...',
              'O‘z .py fayl = modul, import qilinadi',
              'dir(modul) orqali ichida nimalar borligini ko‘rish mumkin',
              'from math import * — tavsiya etilmaydi (nomlar to‘qnashishi mumkin)'
            ],
            masterXp: 30,
            homework: '1. import math: sin(90°), cos(0°), log(e), pow(2,10) ni chop qiling (diqqat: math radian ishlatadi, math.radians(90) ishlating!).\n2. random moduli orqali 10 ta tasodifiy son (1-50) yarating va listga joylashtiring.\n3. names = ["A","B","C","D","E"] dan random.choice() orqali 3 ta turli ism tanlang.\n4. O‘z modul yarating: geometriya.py ichida kvadrat_yuza(a), to‘g‘ri_turtburchak(a,b) funksiyalarini yozing va import qilib ishlating.\n5. (Challenge) 1000 marta tasodifiy ishlatish orqali zar tashlash: 1-6 gacha necha marta chiqishini statistikasini aniqlang.',
            summary: 'Bugun Modullarni o‘rgandik: import, as bilan alias, standart modullar (math, random), o‘z modul yaratish. Keyingi dars — pip va paketlar!',
            exercises: [
              {
                id: 'py15ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Math moduli ➕',
                instruction: 'math moduli import qiling, math.pi ni chop qiling va 144 ning kvadrat ildizini (sqrt) hisoblang chop qiling.',
                startCode: '# Bu yerga import qiling\n\n# pi ni chop qiling\n\n# sqrt(144) ni chop qiling\n',
                checks: [
                  { re: 'import\\s+math', msg: 'import math ishlating' },
                  { re: 'math\\.pi', msg: 'math.pi ni ishlating' },
                  { re: 'math\\.sqrt\\(\\s*144\\s*\\)', msg: 'math.sqrt(144) dan foydalaning' }
                ],
                hint: 'import math → print(math.pi) → print(math.sqrt(144))',
                explanation: 'Standart math modul da pi va sqrt tayyor.',
                xp: 10
              },
              {
                id: 'py15ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Import sintaksisi 🧩',
                instruction: '"random dan choice ni import qilish" qismlarini to‘g‘ri joylashtiring: from random import choice',
                hint: 'from MODUL import NOMA',
                items: ['from', 'random', 'import', 'choice'],
                xp: 10
              },
              {
                id: 'py15ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"sqrt(25) ni hisoblayman" degan kod ishlamaydi. Nima uchun?',
                code: 'import math\nprint(sqrt(25))',
                options: ['sqrt() — math modul nomi bilan (math.sqrt) chaqirilishi kerak', 'modul import qilinmagan', 'sqrt Pythonda yo‘q', '25 ni ildizi yo‘q'],
                answer: 0,
                explanation: 'import math qilgandan keyin ham — funksiyani math. prefix bilan ishlatishingiz kerak: math.sqrt(25). Yoki from math import sqrt.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'Pythonda MODUL nima?',
                options: ['.py fayli — funksiyalar/classlar saqlanadi, import bo‘ladi', 'O‘zgaruvchi turi', 'Faylni o‘chirish usuli', 'Terminal buyrugi'],
                answer: 0,
                explanation: 'Modul = .py fayli. Kodni tashkil qilish uchun ishlatiladi.'
              },
              {
                question: '"math moduli ichidagi pi ni o‘zgartirmasdan import qilish" — to‘g‘ri?',
                options: ['include math', 'import math', 'using math', '#math'],
                answer: 1,
                explanation: 'import math — to‘g‘ri sintaksis.'
              },
              {
                question: '"math dan faqat sqrt va pi ni import qilish" — to‘g‘ri?',
                options: ['import sqrt, pi from math', 'from math import sqrt, pi', 'import math: sqrt, pi', 'load math with sqrt, pi'],
                answer: 1,
                explanation: 'from MODUL import N1, N2 — aniq narsalarni import qilish.'
              },
              {
                question: 'import pandas as pd — "as" nima uchun ishlatiladi?',
                options: ['pandas nomini "pd" qisqartirish (alias)', 'pandas ni o‘chirish', 'pandas ni copy qilish', 'pandas ni yuklamaslik'],
                answer: 0,
                explanation: 'as — alias (taxallus/nom o‘zgartirish). Umumiy: pandas → pd, numpy → np.'
              },
              {
                question: 'from math import * — tavsiya etilmaydimi?',
                options: ['Yo‘q, juda ham yaxshi', 'Ha — barcha nomlarni import qiladi, nomlar to‘qnashishi mumkin', 'Faqat Windows da', 'Faqat Python 2 da'],
                answer: 1,
                explanation: '* — barcha nomlarni import qiladi (masalan, sin, cos, tan...). Sizning funksiya nomingiz bilan to‘qnashishi mumkin.'
              },
              {
                question: 'Standart Python da qaysi modul TAYYOR keladi (pip install kerak emas)?',
                options: ['pandas', 'numpy', 'math', 'requests'],
                answer: 2,
                explanation: 'math — The Python Standard Library ga kiradi, pip install kerak emas. Qolganlari pip orqali o‘rnatiladi.'
              },
              {
                question: 'random.choice(["olma","banan","gilos"]) nima qiladi?',
                options: ['Listni tartiblaydi', 'Listdan tasodifiy 1 ta elementni tanlaydi', 'Listni ko‘paytiradi', 'Listni o‘chiradi'],
                answer: 1,
                explanation: 'random.choice(list) — listdan tasodifiy 1 element qaytaradi.'
              }
            ]
          }
        },
        {
          title: 'pip va paketlar',
          duration: 15,
          xp: 25,
          content: {
            intro: 'Pythonda 300,000+ tayyor paket bor. Ularni qanday o‘rnatish? PIP — Python Package Index orqali! PyPI — eng katta Python paket ombori.',
            sections: [
              {
                title: 'Pip — paketlarni o‘rnatish',
                text: 'pip — paketlarni o‘rnatish uchun buyruq. Terminalda (command prompt):\n\npip install paket_nomi → yangi paket o‘rnatadi\npip uninstall paket_nomi → o‘chiradi\npip list → o‘rnatilgan paketlarni ko‘rsatadi\npip install paket==versiya → aniq versiya',
                code: '# Ushbu kod terminalda yoziladi (browzerda emas):\n# \n# pip install requests        # HTTP so‘rovlar uchun (API)\n# pip install pandas          # Data science\n# pip install numpy           # Matematik massivlar\n# pip install matplotlib      # Grafiklar chizish\n# pip install python-telegram-bot  # Telegram bot\n# pip install aiogram==3.0    # aiogram 3.0 versiyasini o‘rnatadi\n#\n# pip list   # o‘rnatilganlarni ko‘rish\n# pip freeze > requirements.txt  # barcha paketlarni faylga saqlash\n\n# Python kod ichida import (o‘rnatilganini tekshirish):\ntry:\n    import math  # math standart, bormi\n    print("math mavjud ✅")\nexcept ImportError:\n    print("math yo‘q ❌ (ammo u standart, bunday bo‘lmasligi kerak)")',
                codeNote: 'pip install paket_nomi — terminal buyruq. Browzer da ishlamaydi, kompyuteringizda ishlating!',
                result: 'math mavjud ✅',
                note: "Virtual environment (keyingi dars) ichida paketlarni alohida o‘rnatish tavsiya etiladi."
              },
              {
                title: 'requirements.txt',
                text: 'Loyiha paketlarini faylga saqlash va boshqa mashinaga ko‘chirish uchun requirements.txt.',
                code: '# 1) Hozirgi paketlarni saqlash (terminal)\n# pip freeze > requirements.txt\n\n# 2) requirements.txt ichidagi barcha paketlarni o‘rnatish\n# pip install -r requirements.txt\n\n# Masalan, requirements.txt fayl ichi:\n# requests==2.31.0\\npandas==2.0.3\\nnumpy==1.25.2\\naiogram==3.0.0b7\n\nprint("requirements.txt loyiha paketlarini version bilan saqlaydi!")\nprint("Bunga ega bo‘lsangiz, loyihani boshqa mashinaga osongina ko‘chirishingiz mumkin!")',
                codeNote: 'Versiyalarni ko‘rsatish aralashtirib yuborishning oldini oladi.',
                result: 'requirements.txt loyiha paketlarini version bilan saqlaydi!\nBunga ega bo‘lsangiz, loyihani boshqa mashinaga osongina ko‘chirishingiz mumkin!',
                note: "Loyihalarni GitHub va boshqa VCS ga yuklashda requirements.txt kerak bo‘ladi."
              }
            ],
            keyPoints: [
              'pip install paket_nomi',
              'pip uninstall, pip list, pip show paket',
              'Versiya bilan: pip install paket==1.2.3',
              'requirements.txt: pip freeze >, pip install -r',
              'Virtual environment da ishlatish tavsiya (keyingi dars)'
            ],
            masterXp: 25,
            homework: '1. (Kompyuteringizda) pip list orqali o‘rnatilgan paketlarni ko‘ring.\n2. requests paketini o‘rnating va versiyasini tekshiring (pip show requests).\n3. O‘z loyihangiz uchun requirements.txt yarating (pip freeze >).\n4. Python telegram bot yaratmoqchi bo‘lsangiz, qaysi paketlar kerak? (internetda qidiring).',
            summary: 'Bugun pip — paket menejerni o‘rgandik. Paket o‘rnatish, requirements.txt. Keyingi dars — OOP!',
            exercises: [
              {
                id: 'py16ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Import tekshirish ✅',
                instruction: '"requests" paketi o‘rnatilganmi? — try/except ImportError bilan tekshiring: print qilinsin "requests mavjud ✅" yoki "requests topilmadi ❌ (pip install kerak)".',
                startCode: 'try:\n    # Bu yerga import requests yozing\n    print("requests mavjud ✅")\nexcept ImportError:\n    # Bu yerga xato xabarini print qiling\n',
                checks: [
                  { re: 'import\\s+requests', msg: 'try ichida import requests ishlating' },
                  { re: 'pip install kerak|topilmadi|❌', msg: 'except da xato xabari ishlating (pip install kerak)' }
                ],
                hint: 'try: import requests; print("✅") except ImportError: print("❌ pip install kerak")',
                explanation: 'ImportError ushlab turib — paket yo‘qligini bilish mumkin.',
                xp: 10
              },
              {
                id: 'py16ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Terminal buyruq 🧩',
                instruction: '"requests paketni VERSIYA BELGILAB o‘rnatish" buyrug‘ini qismlarga ajratilgan holda to‘g‘ri joylashtiring (pip install requests==2.31.0)',
                hint: 'pip install paket==versiya',
                items: ['pip', 'install', 'requests', '==', '2.31.0'],
                xp: 10
              },
              {
                id: 'py16ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"Foydalanuvchi: men pip install requests deb yozdim, lekin kod ichida requests ishlatilmaydi?!" Nima sabab?',
                code: '# Terminal: pip install requests\n\n# Kod ichida:\ntry:\n    import reqests  # <-- bu yerda nima xato?\nexcept ImportError:\n    print("Topilmadi")',
                options: ['import da nom xato yozilgan ("reqests" emas, "requests")', 'pip ishlash uchun kerak emas', 'Python da requests yo‘q', 'Terminal va kod boshqa narsalar'],
                answer: 0,
                explanation: '"reqests" — xato yozilgan! To‘g‘ri: import requests. Nomlarni aniq yozish kerak.'
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'PIP nima uchun ishlatiladi?',
                options: ['Python paketlarini o‘rnatish, boshqarish (PyPI)', 'Python o‘zi', 'Dastur kodini yozish', 'Fayllarni siqish'],
                answer: 0,
                explanation: 'PIP = Python Package Index — 300,000+ paketni boshqaruvchi menejer.'
              },
              {
                question: '"requests paketini o‘rnatish" buyrug‘i?',
                options: ['pip requests install', 'pip install requests', 'install pip requests', 'pip get requests'],
                answer: 1,
                explanation: 'pip install paket_nomi — to‘g‘ri buyruq.'
              },
              {
                question: '"requests paketini VERSIYA 2.31.0 bilan o‘rnatish" — to‘g‘ri?',
                options: ['pip install requests-2.31.0', 'pip install requests==2.31.0', 'pip install requests@2.31.0', 'pip install requests:2.31.0'],
                answer: 1,
                explanation: '== (ikki tenglik) — versiya aniqlash: paket==x.y.z'
              },
              {
                question: 'requirements.txt fayl nima uchun?',
                options: ['Loyiha paketlarini (versiyalar bilan) saqlash — boshqa mashinada oson o‘rnatish', 'Kodni yozish uchun', 'Fayllarni siqish', 'Rasm saqlash'],
                answer: 0,
                explanation: 'requirements.txt = paketlar ro‘yxati (versiyalar bilan). pip install -r requirements.txt bilan hammasini o‘rnatish mumkin.'
              },
              {
                question: '"Hozirgi paketlarni requirements.txt ga saqlash" buyrug‘i?',
                options: ['pip save', 'pip freeze > requirements.txt', 'pip backup', 'pip copy'],
                answer: 1,
                explanation: 'pip freeze — barcha paketlarni (versiya bilan) chiqaradi; > — faylga yo‘naltiradi.'
              },
              {
                question: '"requirements.txt dagi barcha paketlarni o‘rnatish" buyrug‘i?',
                options: ['pip read requirements.txt', 'pip install -r requirements.txt', 'pip load', 'pip apply'],
                answer: 1,
                explanation: '-r — file o‘qish flag: pip install -r file.txt'
              },
              {
                question: 'Standart math modul uchun pip install kerakmi?',
                options: ['Ha, barchasi uchun', "Yo'q — u standart (built-in), o‘rnatilgan keladi", 'Faqat Linux da', 'Faqat Python 3 da'],
                answer: 1,
                explanation: 'math, random, datetime, os, json, re, ... — standart (The Python Standard Library), pip kerak emas.'
              }
            ]
          }
        },
        {
          title: 'OOP asoslari',
          duration: 20,
          xp: 30,
          content: {
            intro: "Bugun dasturlashning asosiy paradigmasi — OBYEKTLARGA YO‘NALGAN DASTURLASH (OOP) bilan tanishamiz. OOP kodi tushunarli, qayta ishlatiladigan va kengaytiriladigan qiladi.",
            sections: [
              {
                title: 'OOP nima? Class va Object',
                text: "OOPning asosiy tushunchasi: dastur OBJEKTLAR yordamida quriladi.\n\n• CLASS (sinf) — obyekt uchun shablon/qolip (masalan: 'Inson' sinfi)\n• OBJECT (obyekt) — class dan yaratilgan haqiqiy namunasi (masalan: 'Ali' - Inson sinfidan)\n\nHar bir obyektning:\n• XUSUSIYATLARI (attributes/fields) — xotira saqlaydi (ism, yosh...)\n• METODLARI (methods) — harakatlar qiladi (yur(), gapirish()...)",
                code: "# Oddiy CLASS yaratish (qolip)\nclass Inson:\n    # xususiyatlar\n    def __init__(self, ism, yosh):\n        self.ism = ism\n        self.yosh = yosh\n    \n    # metod\n    def salomlash(self):\n        print(f\"Salom, mening ismim {self.ism}, yoshim {self.yosh}\")\n\n# OBYEKT yaratish (class dan namunalar)\nali = Inson(\"Ali\", 25)\nziyoda = Inson(\"Ziyoda\", 21)\n\n# Obyekt metodini chaqirish\nali.salomlash()\nziyoda.salomlash()\n\n# Xususiyatlarga murojaat\nprint(f\"Ali ning yoshi: {ali.yosh}\")",
                codeNote: "__init__ — konstruktor (obyekt yaratilganda avtomatik ishlaydigan maxsus metod). self — BU OBYEKTNING O'ZI.",
                result: "Salom, mening ismim Ali, yoshim 25\nSalom, mening ismim Ziyoda, yoshim 21\nAli ning yoshi: 25",
                note: "self majburiy parametr — bu obyektning o'ziga ishora (boshqa tillardagi this ga o'xshaydi)."
              },
              {
                title: 'OOP 4 ta asosiy printsipi',
                text: "OOPning 4 ta asosiy tayanch ustuni bor:\n\n1. 🏗️ ENKAPSULYATSIYA — xususiyatlarni tashqaridan himoya qilish (private)\n2. 👨‍👦 MEROS (INHERITANCE) — Parent class dan Child class ga xususiyatlarni olish\n3. 🔄 POLIMORFIZM — bir xil nomli metodlar turli xil ishlashi\n4. 🎯 ABSTRAKTSIYA — murakkab narsalarni soddalashtirish (faqat zarur qismlarini ko'rsatish)",
                code: "# Oddiy MISOL: 2 ta class (ota va bola)\nclass Hayvon:\n    def __init__(self, nom):\n        self.nom = nom\n    def ovoz(self):\n        return \"Hayvon ovoz chiqaradi\"\n\nclass It(Hayvon):  # Meros: Hayvon dan voris oladi\n    def ovoz(self):  # Polimorfizm: o'zgartirilgan (override)\n        return \"Vov vov!\"\n\nclass Mushuk(Hayvon):\n    def ovoz(self):\n        return \"Miyov!\"\n\nrex = It(\"Rex\")\nmurka = Mushuk(\"Murka\")\n\nprint(rex.nom + ': ' + rex.ovoz())\nprint(murka.nom + ': ' + murka.ovoz())",
                codeNote: "Bu yerda: Hayvon — OTA class (parent). It, Mushuk — BOLA class (child). Meros: class Bola(Ota):",
                result: "Rex: Vov vov!\nMurka: Miyov!",
                note: "Keyingi darslarda 4 ta prinsipni hammasini alohida batafsil o'rganamiz."
              }
            ],
            keyPoints: [
              "OOP — obyektlar paradigmasi",
              "Class = qolip/shablon (Inson)",
              "Object = namunalar (ali, ziyoda) — class dan yaratiladi",
              "Xususiyat (field) + Metod (method) = class tarkibi",
              "__init__ — konstruktor, self — bu obyektning o'zi",
              "OOP 4 ta prinsip: Inkapsulyatsiya, Meros, Polimorfizm, Abstraktsiya"
            ],
            masterXp: 30,
            homework: "1. 'Mashina' class yarating: model, yil, rang xususiyatlari + info() metodi (masalan: 'Malibu 2023, oq rang').\n2. Mashina class dan 3 ta obyekt yarating va ularning info() metodini chaqiring.\n3. Talaba class: ism, familiya, kurs, fanlar (list). add_fan() metodi — yangi fan qo'shilsin.\n4. (Challenge) Kitob class: nom, muallif, narx. Chegara: if narx < 0 → xato.",
            summary: "Bugun OOP asoslarini ko'rdik: class, object, xususiyat/metod, 4 ta printsip. Keyingi dars — Class'larni chuqurro'rganamiz!",
            exercises: [
              {
                id: 'py17ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Inson class 👤',
                instruction: 'Inson class yarating: ism va __init__(self, ism) self.ism = ism; va salomlash() metodi print("Salom, men", self.ism). Obyekt yaratib chaqiring.',
                startCode: '# Bu yerga Inson class ni yozing\n\n# Obyekt yarat (ism = Inson("Dilorom") — salomlash() chaqiring\n',
                checks: [
                  { re: 'class\\s+Inson', msg: 'class Inson: ni yozing' },
                  { re: 'def\\s+__init__\\s*\\(\\s*self\\s*,\\s*ism\\s*\\)', msg: '__init__(self, ism):' },
                  { re: 'def\\s+salomlash\\s*\\(\\s*self\\s*\\)', msg: 'salomlash(self): metodi kerak' }
                ],
                hint: 'class Inson: def __init__(self, ism): self.ism=ism; def salomlash(self): ...',
                explanation: 'class yaratish → __init__ konstruktor → metodlar.',
                xp: 10
              },
              {
                id: 'py17ex2',
                type: 'dragdrop',
                title: '2-MASHQ — 4 ta OOP printsipi 🧩',
                instruction: '"4 ta OOP printsiplarini to‘g‘ri ro‘yxatga keltiring: Inkapsulyatsiya, Meros, Polimorfizm, Abstraktsiya',
                hint: '1.Inkapsulyatsiya → 2.Meros → 3.Polimorfizm → 4.Abstraktsiya',
                items: ['Inkapsulyatsiya', 'Meros (Inheritance)', 'Polimorfizm', 'Abstraktsiya'],
                xp: 10
              },
              {
                id: 'py17ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: '"men Inson class dan obyekt yaratmoqchiman, lekin ishlamayapti. Nima sabab?',
                code: 'class Inson:\n    def __init__(ism):  # <-- XATO\n        self.ism = ism\n\nali = Inson("Ali")',
                options: ['__init__ da self PARAMETRI BIRINCHI BO‘LISHI KERAK (self, ism)', 'class dan keyin : kerak emas', 'self — Pythonda yo‘q', 'obyekt yaratish uchun new Inson emas'],
                answer: 0,
                explanation: "__init__ da HAR DOIM BIRINCHI PARAMETR self (Bu obyektning o'zi). To‘g‘ri: def __init__(self, ism):"
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'OOP da "Class" nima?',
                options: ['Obyekt uchun shablon/qolip (masalan: Inson)', 'O‘zgaruvchi', 'Funksiya turi', 'Fayl nomi'],
                answer: 0,
                explanation: 'Class = qolip/shablon (masalan, Inson sinfi). Undan OBYEKT yaratiladi.'
              },
              {
                question: 'OOP da "Object" nima?',
                options: ['Class dan yaratilgan haqiqiy namunasi (masalan: "Ali" — Inson class dan)', 'Fayl turi', 'Print buyrug‘i', 'O‘zgaruvchi turi'],
                answer: 0,
                explanation: 'Object = class dan yaratilgan namunalar (ali = Inson("Ali", ziyoda = Inson("Ziyoda")).'
              },
              {
                question: '__init__ — nima?',
                options: ['Konstruktor — obyekt yaratilganda avtomatik ishlaydigan metod', 'Faylni ochuvchi metod', "Obyektni o'chiruvchi metod', 'Print metodi'],
                answer: 0,
                explanation: '__init__ = konstruktor. Obyekt yaratilganda dastlabki xususiyatlarni yoziladi.'
              },
              {
                question: 'self nima uchun ishlatiladi?',
                options: ["Joriy OBYEKTNING O'ZIGA ishora (self.x, self.ism...)", 'Faylni ochish', 'Sikl yaratish', 'Funksiya yaratish'],
                answer: 0,
                explanation: 'self — bu obyektning o'zi. self.ism, self.metod() — o'z xususiyat/metodlariga murojaat.'
              },
              {
                question: 'OOP 4 ta asosiy printsipi qaysi?',
                options: ['Inkapsulyatsiya, Meros, Polimorfizm, Abstraktsiya', 'For, While, If, Def', 'List, Tuple, Dict, Set', 'Math, Random, Os, Sys'],
                answer: 0,
                explanation: '4 ta tamoyil: Inkapsulyatsiya (himoya), Meros (voris), Polimorfizm (ko'p shakllanish), Abstraktsiya (soddalashtirish).'
              },
              {
                question: 'ali = Inson("Ali", 25) → Inson class da qaysi metod chaqiriladi?',
                options: ['salomlash()', '__init__ (konstruktor)', 'self', 'print()'],
                answer: 1,
                explanation: 'Class dan obyekt yaratilganda __init__ konstruktor AVTOMATIK chaqiriladi.'
              },
              {
                question: 'Class ichidagi funksiya qanday aytiladi?',
                options: ['O‘zgaruvchi', 'Metod (method)', 'Atribut', 'Modul'],
                answer: 1,
                explanation: 'Class ichidagi funksiyalar → METODLAR. Xususiyatlar → field/atribut.'
              }
            ]
          }
        },
        {
          title: 'Class‘lar',
          duration: 25,
          xp: 35,
          content: {
            intro: "Oldingi darsda OOP asoslarini ko'rdik. Bugun Class'larni chuqur o'rganamiz: Konstruktor, Metod turlari, Dunder (magic) metodlar, Class/Instance variable.",
            sections: [
              {
                title: '__init__ konstruktor va self',
                text: "__init__ — obyekt yaratilganda avtomatik ishlaydigan maxsus metod (konstruktor). Unda obyektning dastlabki xususiyatlari yoziladi.\n\nself — har doim birinchi parametr. Bu OBYEKTNING O'ZIGA ishora (huddi 'men'). Metod ichida xususiyatlar self. orqali murojaat qilinadi.",
                code: "class Talaba:\n    def __init__(self, ism, yosh, kurs=1):  # default qiymat ham bo'ladi\n        # Xususiyatlar\n        self.ism = ism\n        self.yosh = yosh\n        self.kurs = kurs\n        self.baholar = []  # bo'sh list\n    \n    # Oddiy metod (instance method)\n    def baho_qosh(self, baho):\n        self.baholar.append(baho)\n    \n    def o_rtacha_baho(self):\n        if self.baholar:\n            return sum(self.baholar) / len(self.baholar)\n        return 0\n\nt = Talaba(\"Bekzod\", 20, 2)\nt.baho_qosh(85)\nt.baho_qosh(92)\nt.baho_qosh(78)\nprint(f\"Talaba: {t.ism}, kurs: {t.kurs}\")\nprint(f\"Baholar: {t.baholar}\")\nprint(f\"O'rtacha: {t.o_rtacha_baho():.2f}\")",
                codeNote: "self majburiy! Instance metodlarida self har doim birinchi parametr.",
                result: "Talaba: Bekzod, kurs: 2\nBaholar: [85, 92, 78]\nO'rtacha: 85.00",
                note: "Instance metodlar — obyekt bo'yicha chaqiriladi. self. orqali boshqa metod/fieldlarga murojaat mumkin."
              },
              {
                title: 'Class variable vs Instance variable',
                text: "• Instance o'zgaruvchilar — self. bilan — HAR BIR OBYEKTGA XOS\n• Class o'zgaruvchilar — class ichida, AMMO METHOD TASHQARISIDA — BARCHA OBYEKTLAR UCHUN UMMUMIY",
                code: "class BankAccount:\n    # CLASS o'zgaruvchi (hammasi uchun umumiy)\n    bank_nomi = \"Ozsanoatbank\"\n    foiz_stavka = 0.05  # yillik 5%\n    \n    def __init__(self, egalik, balans=0):\n        # INSTANCE o'zgaruvchi (har biriga xos)\n        self.egalik = egalik\n        self.balans = balans\n    \n    def foiz_qosh(self):\n        self.balans = self.balans * (1 + BankAccount.foiz_stavka)\n\nacc1 = BankAccount(\"Ali\", 1000)\nacc2 = BankAccount(\"Ziyoda\", 2000)\n\nprint(f\"Ikkalasi ham bir bankda: {acc1.bank_nomi}, {acc2.bank_nomi}\")\nprint(f\"Acc1 oldin: {acc1.balans}\")\nacc1.foiz_qosh()\nprint(f\"Acc1 keyin (foiz bilan): {acc1.balans}\")",
                codeNote: "BankAccount.foiz_stavka — class nomi orqali, self. emas.",
                result: "Ikkalasi ham bir bankda: Ozsanoatbank, Ozsanoatbank\nAcc1 oldin: 1000\nAcc1 keyin (foiz bilan): 1050.0",
                note: "Class variable ni o'zgartirsangiz — BARCHA obyektlar uchun o'zgaradi."
              },
              {
                title: 'Dunder (Magic) metodlar: __str__, __len__, __add__',
                text: "Dunder metodlar — __blabla__ ko'rinishidagi maxsus metodlar. Python tomonidan maxsus vazifalar uchun chaqiriladi.",
                code: "class Kitob:\n    def __init__(self, nom, muallif, betlar):\n        self.nom = nom\n        self.muallif = muallif\n        self.betlar = betlar\n    \n    # print() chaqirilganda ishlaydi (o'zgaruvchini print qilganda)\n    def __str__(self):\n        return f\"{self.nom} - {self.muallif} ({self.betlar} bet)\"\n    \n    # len() chaqirilganda\n    def __len__(self):\n        return self.betlar\n    \n    # > operatori (katta-kichik)\n    def __gt__(self, boshqa):\n        return self.betlar > boshqa.betlar\n\nk1 = Kitob(\"O'tgan kunlar\", \"A. Qodiriy\", 400)\nk2 = Kitob(\"Alpomish\", \"Folk\", 200)\n\nprint(k1)              # __str__\nprint(f\"Betlar soni: {len(k1)}\")  # __len__\nprint(f\"k1 k2 dan katta (bet ko'pmi): {k1 > k2}\")  # __gt__",
                codeNote: "Oddiy, lekin juda foydali! print(obyekt) o'qiladigan chiqaradi.",
                result: "O'tgan kunlar - A. Qodiriy (400 bet)\nBetlar soni: 400\nk1 k2 dan katta (bet ko'pmi): True",
                note: "Boshqa dunder: __add__ (+), __eq__ (==), __lt__ (<), __repr__ (debug)"
              }
            ],
            keyPoints: [
              "__init__ — konstruktor, self birinchi parametr",
              "self. — instance xususiyat/metodlarga murojaat",
              "Instance variable — har obyektga xos; Class variable — barchasi uchun umumiy",
              "__str__ — print(obyekt); __len__ — len(obyekt)",
              "Dunder (magic) metodlar: __gt__, __lt__, __eq__, __add__..."
            ],
            masterXp: 35,
            homework: "1. 'Kino' class: nom, rejissor, yil, reyting. 3 ta obyekt + print (str uchun).\n2. 'Do'kon' class: nom, manzil, maxsulotlar (dict {nom: narx}). add_product(nom, narx) va qidir(nom) metodlari.\n3. __len__ va __str__ qo'shish (Kino class).\n4. Class variable: Shop — 'dokonlar_soni' har yangi obyekt yaratganda +1 bo'lsin (Barcha shoplar soni).",
            summary: "Bugun class'larni chuqur o'rgandik: konstruktor, self, class/instance vars, dunder metodlar. Keyingi — Meros (Inheritance)!",
            exercises: [
              {
                id: 'py18ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — __str__ dunder 📄',
                instruction: 'Mashina class ni to‘ldiring: __str__(self) da "{model} {rang}" qaytarilsin. print(m) ni ishlating.',
                startCode: 'class Mashina:\n    def __init__(self, model, rang):\n        self.model = model\n        self.rang = rang\n    # Bu yerga __str__(self): def qoshing\n\nm = Mashina("Malibu", "Oq")\nprint(m)',
                checks: [
                  { re: 'def\\s+__str__\\s*\\(\\s*self\\s*\\)', msg: '__str__(self): metodini yozing' },
                  { re: 'return\\s+f?"?\\{?\\s*self\\.model', msg: 'return da self.model ishlatish' }
                ],
                hint: 'def __str__(self): return f"{self.model} {self.rang}"',
                explanation: '__str__ print() chaqirilganda obyektni chiroyli ko‘rinishda chop qiladi.',
                xp: 10
              },
              {
                id: 'py18ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Instance vs Class o‘zgaruvchi 🧩',
                instruction: 'Instance va Class o‘zgaruvchilarini farqini toping: self.balans, bank_nomi',
                hint: 'self. bilan boshlanadigan har bir obyekt uchun alohida (Instance). Class ichida method tashqarisida umumiy (Class variable).',
                items: ['self.balans (Instance — har bir akkount xususiy)', 'BankAccount.bank_nomi (Class variable — umumiy)', 'self.egalik (Instance)', 'foiz_stavka (Class)'],
                xp: 10
              },
              {
                id: 'py18ex3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: 'BankAccount da foiz_stavka class o‘zgaruvchisiga murojaat ishlamaydi. Nima uchun?',
                code: 'class BankAccount:\n    foiz_stavka = 0.05\n    def foiz_qosh(self):\n        self.balans = self.balans * (1 + self.foiz_stavka)  # ❌',
                options: ['Class variable ga Class NOMI orqali murojaat kerak (BankAccount.foiz_stavka)', 'self da foiz_stavka yo‘q', 'foiz_stavka noto‘g‘ri yozilgan', 'balans noto‘g‘ri'],
                answer: 0,
                explanation: "Class o'zgaruvchisiga Class nomi → BankAccount.foiz_stavka orqali (yoki Class.ozgartirish). self. esa instance uchun."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: 'self.ism = ism — qanday o‘zgaruvchi?',
                options: ['Class variable', 'Instance variable — har obyektga xos', 'Global o‘zgaruvchi', 'Local o‘zgaruvchi'],
                answer: 1,
                explanation: 'self. bilan boshlanadiganlar Instance variable — HAR BIR OBYEKTGA XOS.'
              },
              {
                question: 'class X: bank = “NBU” (method tashqarisida yozilgan) — bu?',
                options: ['Instance', 'Class variable — barcha obyektlar uchun umumiy', 'local', 'parameter'],
                answer: 1,
                explanation: "Class ichida method tashqarisida yozilgan o'zgaruvchilar = Class variable — BARCHA UCHUN UMMUMIY.'
              },
              {
                question: '__str__ dunder metodi nima uchun?',
                options: ['obyektni chop qilganda (print(obj)) chiroyli string qaytaradi', 'obyekt uzunligi', 'obyektni o‘chirish', 'obyektni saqlash'],
                answer: 0,
                explanation: '__str__(self): return f"..."; print(obj) → shu stringni ko‘rsatadi.'
              },
              {
                question: 'len(obj) chaqirilganda qaysi dunder ishlaydi?',
                options: ['__str__', '__len__', '__add__', '__gt__'],
                answer: 1,
                explanation: '__len__(self): return N; len(obj) → shu N ni qaytaradi.'
              },
              {
                question: 'a > b — qaysi dunder?',
                options: ['__lt__', '__gt__', '__eq__', '__add__'],
                answer: 1,
                explanation: '__gt__ = greater than (>). __lt__ = less than (<). __eq__ = ==.'
              },
              {
                question: 'Instance metodlarida birinchi parametr har doim?',
                options: ['cls', 'self', 'def', 'name'],
                answer: 1,
                explanation: 'Instance metodlarida (oddiy method) birinchi parametr = self.'
              },
              {
                question: 'class Shop: shop_soni = 0; __init__ da Shop.shop_soni +=1 — qanaqa hodisa?',
                options: ['Har yangi obyekt yaratganda umumiy hisoblagich +1', 'Xato', 'Instance o‘zgaruvchi', 'Faqat bir marta ishlaydi'],
                answer: 0,
                explanation: 'Class variable → Shop.shop_soni barchasi uchun umumiy. Har yangi obyekt yaratganda +1 → umumiy shoplar sonini aniqlash.'
              }
            ]
          }
        },
        {
          title: 'Meros (inheritance)',
          duration: 20,
          xp: 30,
          content: {
            intro: "Bugun OOPning 2-prinsipi: MEROS (INHERITANCE). Bitta class (ota) boshqa class (bola) uning xususiyat va metodlarini meros qilib oladi va o'ziga xos narsalarni qo'shadi.",
            sections: [
              {
                title: 'Meros asoslari',
                text: "class Bola(Ota):\n\nOta class — Parent/Super class.\nBola class — Child/Sub class.\n\nBola: otaning barcha narsasini oladi + o'z metodlari/xususiyatlari.",
                code: "# OTA (Super) class\nclass Xodim:\n    def __init__(self, ism, maosh):\n        self.ism = ism\n        self.maosh = maosh\n    \n    def malumot(self):\n        return f\"{self.ism} | maosh: {self.maosh} so'm\"\n    \n    def ishlash(self):\n        return f\"{self.ism} ishlamoqda...\"\n\n# BOLA 1\nclass Dasturchi(Xodim):\n    def __init__(self, ism, maosh, til):\n        # Otaning __init__ ni chaqirish (super)\n        super().__init__(ism, maosh)\n        self.til = til  # Bola class ga xos\n    \n    # O'ziga xos metod\n    def kod_yoz(self):\n        return f\"{self.ism} {self.til} da kod yozmoqda\"\n    \n    # OVERRIDE (ota metodini yozib o'zgartirish)\n    def ishlash(self):\n        return f\"{self.ism} {self.til} da kod yozish orqali ishlaydi\"\n\n# BOLA 2\nclass Menejer(Xodim):\n    def __init__(self, ism, maosh, bolim):\n        super().__init__(ism, maosh)\n        self.bolim = bolim\n    \n    def malumot(self):  # override\n        return f\"{super().malumot()} | Bo'lim: {self.bolim}\"\n\nd = Dasturchi(\"Aziz\", 8000000, \"Python\")\nm = Menejer(\"Dilorom\", 12000000, \"IT\")\nprint(d.malumot())\nprint(d.kod_yoz())\nprint(d.ishlash())\nprint(m.malumot())",
                codeNote: "super() — OTA class ga ishora. super().__init__(...) — otaning konstruktorini chaqirish.",
                result: "Aziz | maosh: 8000000 so'm\nAziz Python da kod yozmoqda\nAziz Python da kod yozish orqali ishlaydi\nDilorom | maosh: 12000000 so'm | Bo'lim: IT",
                note: "Override — bola class da xuddi shu nomli metod yozilsa, OTANIKI ESKIRIB QOLADI, YANGISI ishlaydi."
              },
              {
                title: 'isinstance va issubclass',
                text: "isinstance(obj, Class) — obyekt berilgan class dan yaratilganmi?\nissubclass(Bola, Ota) — Bola Ota vorisi mi?",
                code: "class Hayvon: pass\nclass It(Hayvon): pass\nclass Mushuk(Hayvon): pass\nclass Stol: pass\n\nrex = It()\nmurka = Mushuk()\nst = Stol()\n\nprint(f\"Rex — It?: {isinstance(rex, It)}\")\nprint(f\"Rex — Hayvon?: {isinstance(rex, Hayvon)}\")\nprint(f\"Rex — Mushuk?: {isinstance(rex, Mushuk)}\")\nprint(f\"It — Hayvon vorisi: {issubclass(It, Hayvon)}\")\nprint(f\"Stol — Hayvon vorisi: {issubclass(Stol, Hayvon)}\")",
                codeNote: "Meros — 'is a' munosabati. It 'is a' Hayvon.",
                result: "Rex — It?: True\nRex — Hayvon?: True\nRex — Mushuk?: False\nIt — Hayvon vorisi: True\nStol — Hayvon vorisi: False",
                note: "isinstance ko'p hollarda type() dan afzallikdir (merosni inobatga oladi)."
              }
            ],
            keyPoints: [
              "class Bola(Ota): — meros",
              "super().__init__(...) — ota konstruktorini chaqirish",
              "Override — bola xuddi shu nomli metod yozganda otasini yozib o'tadi",
              "isinstance(obj, Class) va issubclass(B, A)",
              "Meros: kodi qayta ishlatish va kengaytirish uchun"
            ],
            masterXp: 30,
            homework: "1. 'Transport' class: nom, tezlik, yolovchilar_soni. info() + harakatlanish() = 'Transport harakatlanmoqda'.\n2. 'Avtomobil'(Transport) — qo'shimcha dvigatel, park_qilish() + override harakatlanish()='Avtomobil g'ildirakda yuradi'.\n3. 'Samolyot'(Transport) — qanot_uzunligi + uchish() override.\n4. Uchlarini sinab ko'ring (obyekt yarat, malumot va harakatlanish chaqir).",
            summary: "Bugun Meros (Inheritance) — ota/bola, super, override, isinstance — asoslarini o'rgandik. Keyingi — Polimorfizm!",
            exercises: [
              {
                id: 'py15ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — super() bilan konstruktor 🛠️',
                instruction: "Quyidagi kodni to'ldiring: 'Talaba' class 'Shaxs' class vorisi. super() orqali ota konstruktorini chaqiring va 'kurs' xususiyatini qo'shing.",
                startCode: "class Shaxs:\n    def __init__(self, ism, yosh):\n        self.ism = ism\n        self.yosh = yosh\n    def tanishtir(self):\n        return f\"Ism: {self.ism}, Yosh: {self.yosh}\"\n\nclass Talaba(Shaxs):\n    def __init__(self, ism, yosh, kurs):\n        # Bu yerda super() bilan ota __init__ ni chaqiring\n        # Va self.kurs = kurs ni yozing\n        pass\n\nt = Talaba(\"Oybek\", 20, 2)\nprint(t.tanishtir())\nprint(\"Kurs:\", t.kurs)",
                checks: [
                  { re: 'super\\s*\\(\\s*\\)\\s*\\.\\s*__init__\\s*\\(\\s*ism\\s*,\\s*yosh\\s*\\)', msg: "super().__init__(ism, yosh) ni chaqiring" },
                  { re: 'self\\.kurs\\s*=\\s*kurs', msg: 'self.kurs = kurs ni yozing' }
                ],
                hint: "super().__init__(ism, yosh) — ota class konstruktorini chaqirish.",
                explanation: "Bola class konstruktorida avval ota konstruktorini chaqirish kerak: super().__init__(...). Keyin o'z xususiyatlarini qo'shasiz.",
                xp: 10
              },
              {
                id: 'py15ex2',
                type: 'dragdrop',
                title: '2-MASHQ — isinstance/issubclass ni joylashtiring 🧩',
                instruction: "Quyidagi kod qismlarini to'g'ri tartibga joylashtiring: Hayvon ota, It bola. It — Hayvon vorisligini tekshiring.",
                hint: "class yarat → obyekt yarat → isinstance → issubclass",
                items: ['class Hayvon: pass', 'class It(Hayvon): pass', 'rex = It()', 'isinstance(rex, Hayvon)', 'issubclass(It, Hayvon)'],
                xp: 10
              },
              {
                id: 'py15ex3',
                type: 'detective',
                title: '3-MASHQ — OVERRIDE ni toping 🔍',
                instruction: "Quyidagi kodda qaysi METOD OVERRIDE qilingan? (ota class da ham, bola class da ham xuddi shu nom bor).",
                code: "class Transport:\n    def __init__(self, nom):\n        self.nom = nom\n    def harakat(self):\n        return f\"{self.nom} harakatlanmoqda\"\n    def toxta(self):\n        return \"To'xtadi\"\n\nclass Avtomobil(Transport):\n    def __init__(self, nom, dvigatel):\n        super().__init__(nom)\n        self.dvigatel = dvigatel\n    def harakat(self):\n        return f\"{self.nom} yo'llar davomida yuradi\"\n    def signal(self):\n        return \"BEEP BEEP!\"",
                options: ['__init__ (faqat ota da)', 'harakat (override qilingan)', 'toxta (override qilingan)', 'signal (ota da ham bor)'],
                answer: 1,
                explanation: "harakat() metodi OTA class da ham, BOLA class da ham bor — demak OVERRIDE qilingan. Bola class dagi ishlaydi."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Meros (Inheritance) nimani anglatadi?",
                options: ["Bitta class boshqa class xususiyat/metodlarini meros qilib olish", "Hamma classlarni o'chirish", "Faqat raqamlar bilan ishlash", "Funktsiyalarni qayta yozish"],
                answer: 0,
                explanation: "Meros — bola class ota classning barcha xususiyat va metodlarini oladi va o'zlarini qo'shadi."
              },
              {
                question: "Bola class OTA class konstruktorini qanday chaqiradi?",
                options: ["self.__init__()", "super().__init__()", "parent()", "ota()"],
                answer: 1,
                explanation: "super() — ota class ga ishora, super().__init__(...) uning konstruktorini chaqiradi."
              },
              {
                question: "OVERRIDE degani nima?",
                options: ["Ota metodni o'chirib tashlash", "Bola class da xuddi shu nomli metod yozish (ota sini ekanini yozib o'tish)", "Yangi nomli metod yaratish", "Metodni nomini o'zgartirish"],
                answer: 1,
                explanation: "Override — bola class da ota class bilan XUDdi SHU NOMLI metod yozilganda, otasini ESKIRIB qoldirish."
              },
              {
                question: "isinstance(rex, Hayvon) — nima tekshiriladi?",
                options: ["rex Hayvon classmi?", "rex obyekti Hayvon class dan yaratilganmi (yoki uning vorisi)?", "Hayvon rex vorisimi?", "Ikkalasi ham classmi?"],
                answer: 1,
                explanation: "isinstance(obj, Class) — obyekt berilgan class (yoki uning vorisi) dan yaratilganmi? Tekshiradi (True/False)."
              },
              {
                question: "issubclass(It, Hayvon) — True bo'lishi uchun:",
                options: ["It va Hayvon bitta class bo'lishi kerak", "It — Hayvon vorisi bo'lishi kerak", "Hayvon — It vorisi bo'lishi kerak", "Ikkalasi ham ota class bo'lishi kerak"],
                answer: 1,
                explanation: "issubclass(Bola, Ota) — Bola Ota vorisi bo'lsa True qaytaradi."
              },
              {
                question: "class Bola(Ota): — Ota, Bola:",
                options: ["Ota — bola, Bola — ota", "Ota — super/parent, Bola — child/sub", "Ikkalasi ham bir xil", "Ota — funksiya, Bola — class"],
                answer: 1,
                explanation: "class Bola(Ota): → Ota = parent/super class, Bola = child/sub class."
              },
              {
                question: "Merosning asosiy foydasi qaysi?",
                options: ["Kodni qayta ishlatmaslik va katta kod yozish", "Kodni qayta ishlatish (DRY) va kengaytirish osonligi", "Faqat rasmlarni saqlash", "Faqat sonlarni tez hisoblash"],
                answer: 1,
                explanation: "DRY = Don't Repeat Yourself. Meros kodi qayta ishlatishga yordam beradi."
              },
              {
                question: "Qaysi operator merosni ko'rsatadi?",
                options: ["→", ": (ikki nuqta, class Bola(Ota):)", "=", "+"],
                answer: 1,
                explanation: "class Bola(Ota): — qavs ichida ota class ko'rsatiladi va ikki nuqta : bilan tugaydi."
              }
            ]
          }
        },
        {
          title: 'Polimorfizm',
          duration: 15,
          xp: 25,
          content: {
            intro: "Bugun 3-OOP prinsipi POLIMORFIZM — 'ko'p shakllanish' degan ma'noli. Bir xil NOMLI metod turli class'larda turli xil ISHLAYDI.",
            sections: [
              {
                title: 'Polimorfizmga misollar',
                text: "Polimorfizm — birdan xil xatti-harakat (method nomi), lekin har xil class da turli xil natija. 'Bir yerda chaqir, turli xil ishlat'",
                code: "class Shakl:\n    def yuza_hisob(self):\n        raise NotImplementedError(\"Bu metod bola class da yozilishi shart!\")\n\nclass Kvadrat(Shakl):\n    def __init__(self, a):\n        self.a = a\n    def yuza_hisob(self):\n        return self.a * self.a\n\nclass Doira(Shakl):\n    def __init__(self, r):\n        self.r = r\n    def yuza_hisob(self):\n        import math\n        return math.pi * self.r ** 2\n\nclass ToGurtburchak(Shakl):\n    def __init__(self, a, b):\n        self.a, self.b = a, b\n    def yuza_hisob(self):\n        return self.a * self.b\n\n# UMUMIY FUNKSIYA — polimorfizm — qaysi class obyekt bersa shu ishlaydi\ndef yuza_chop(shakl):\n    print(f\"Shakl yuzi: {shakl.yuza_hisob():.2f}\")\n\nkv = Kvadrat(5)\ndr = Doira(3)\ntg = ToGurtburchak(4, 6)\n\n# Bitta funksiyaga 3 xil obyekt berilyapti — POLIMORFIZM!\nyuza_chop(kv)  # Kvadrat.yuza_hisob ishlaydi\nyuza_chop(dr)  # Doira.yuza_hisob ishlaydi\nyuza_chop(tg)  # ToGurtburchak.yuza_hisob ishlaydi",
                codeNote: "NotImplementedError — bola class bu metodni yozish majburiyatini bildiradi (abstraktsiya tamoyili).",
                result: "Shakl yuzi: 25.00\nShakl yuzi: 28.27\nShakl yuzi: 24.00",
                note: "Yana polimorfizm misol: len([1,2,3]) ham len('salom') ham — bu bitta nom, turli xil obyektlar uchun!"
              }
            ],
            keyPoints: [
              "Polimorfizm — bir xil metod nomi, turli class'larda turli xil ishlaydi",
              "Override asosida ishlaydi",
              "Umumiy funksiyaga turli xil obyektlarni berish mumkin",
              "len(), print() — built-in polimorfizmga misol"
            ],
            masterXp: 25,
            homework: "1. 'ZamonaviyAvto' class: tushirish() = 'Avto tushirildi'. 2 ta bola: 'ElektroAvto'(tushirish = 'Zaryad ulandi'), 'BenzinAvto'(tushirish = 'Bak toldirildi').\n2. umumiy_zaprafka(avto) degan funksiya yozing. Uni 2 xil obyekt bilan sinab ko'ring.\n3. + operatori ham polimorfizm: 5+3=8, 'Salom'+' '+'Dunyo'='Salom Dunyo', [1,2]+[3]=[1,2,3]. Ikkalasini ham sinab ko'ring.",
            summary: "Bugun Polimorfizmni o'rgandik — 'bir xil chaqir, turli xil ishlat'. Keyingi — Inkapsulyatsiya!",
            exercises: [
              {
                id: 'py16ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Polimorfik ovoz 🔊',
                instruction: "Quyidagi 'Hayvon' ota va 'It','Mushuk' bola class larda 'ovoz()' metodini yozing. Har biri turli ovoz chiqarishi kerak. Keyin 'umumiy_ovoz(hv)' funksiyasi yordamida sinab ko'ring.",
                startCode: "class Hayvon:\n    def ovoz(self):\n        raise NotImplementedError(\"Bola class da yozilishi kerak!\")\n\nclass It(Hayvon):\n    def ovoz(self):\n        # Bu yerga return \"Vov vov!\" yozing\n        pass\n\nclass Mushuk(Hayvon):\n    def ovoz(self):\n        # Bu yerga return \"Miyov!\" yozing\n        pass\n\ndef umumiy_ovoz(hv):\n    print(hv.ovoz())\n\nrex = It()\nmurka = Mushuk()\numumiy_ovoz(rex)\numumiy_ovoz(murka)",
                checks: [
                  { re: 'return\\s+["\']Vov vov!["\']', msg: "It da return \"Vov vov!\" yozing" },
                  { re: 'return\\s+["\']Miyov!["\']', msg: "Mushuk da return \"Miyov!\" yozing" }
                ],
                hint: "Har bir bola class da ovoz() metodini yozing va turli xil string return qiling.",
                explanation: "Polimorfizm: It va Mushuk ikkalasida ham ovoz() bor — lekin har biri turli xil ishlaydi. umumiy_ovoz() esa bittasini ham qabul qiladi!",
                xp: 10
              },
              {
                id: 'py16ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Polimorfizm qismlarini yig‘ing 🧩',
                instruction: "Shakl(Kvadrat, Doira) uchun yuza_hisob polimorfizmi qismlarini to'g'ri tartibga joylashtiring.",
                hint: "class Shakl → class Kvadrat → class Doira → yuza_chop funksiyasi → obyekt yarat → chaqir",
                items: [
                  'class Shakl:\\n    def yuza_hisob(self): pass',
                  'class Kvadrat(Shakl):\\n    def __init__(self,a): self.a=a\\n    def yuza_hisob(self): return self.a*self.a',
                  'class Doira(Shakl):\\n    def __init__(self,r): self.r=r\\n    def yuza_hisob(self): return 3.14*self.r**2',
                  'def yuza_chop(s): print(s.yuza_hisob())',
                  'kv = Kvadrat(4); yuza_chop(kv)'
                ],
                xp: 10
              },
              {
                id: 'py16ex3',
                type: 'detective',
                title: '3-MASHQ — POLIMORFIZMni toping 🔍',
                instruction: "Quyidagi misollarda qaysi biri POLIMORFIZM emas? (polimorfizm = bitta nom, turli xil ishlash).",
                code: "# A) len([1,2,3]) → 3   va   len(\"salom\") → 5\n# B) print(5+3) → 8   va   print(\"Sal\"+\"om\") → \"Salom\"\n# C) a = 5; b = 10; a += b\n# D) Ota.olish() va Bola.olish() ikkalasi ham olish() nomli lekin turli ishlaydi",
                options: ["A) len() ikki xil narsada ishlaydi → polimorfizm", "B) + operatori turli turlarda → polimorfizm", "C) a += b — bu oddiy tayinlash, polimorfizm emas", "D) override — polimorfizm asosi"],
                answer: 2,
                explanation: "C) faqat tayinlash operatori (shorthand) — bunda 'bir nom turli xil ishlash' yo'q. Qolganlari hamma polimorfizmga misol."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Polimorfizm (ko'p shakllanish) degani nima?",
                options: ["Barcha classlarni o'chirish", "Bir xil NOMLI metod turli class'larda turli xil ISHLAYDI", "Faqat raqamlarni sonlaydi", "Funktsiyalarni nomini o'zgartirish"],
                answer: 1,
                explanation: "Polimorfizm = 'bir xil chaqir, turli xil ishlat' — bir nom, turli natija."
              },
              {
                question: "Polimorfizm asosida ishlaydigan narsa?",
                options: ["Override (ota metodini yozib o'tish)", "Faqat raqamlar", "Faqat print()", "Faqat for loop"],
                answer: 0,
                explanation: "Override — polimorfizmning asosini tashkil qiladi: bir xil nom, turli klassda turli xil ishlaydi."
              },
              {
                question: "Qaysi biri built-in polimorfizmga misol?",
                options: ["print()", "len()", "range()", "Barchasi to'g'ri (va + operatori ham)"],
                answer: 3,
                explanation: "len([1,2]) va len('ab') → bir nom, turli xil; 5+3 va 'a'+'b' → ham polimorfizm. Ko'p built-in funktsiyalar polimorfdir."
              },
              {
                question: "'Umumiy' funksiya turli xil obyektlarni qabul qilsa va ularning bir xil metodini chaqirsa — bu:",
                options: ["Xato", "Polimorfizm", "Sikl", "Inkapsulyatsiya"],
                answer: 1,
                explanation: "Mana shu — polimorfizmning o'zi! Bitta funksiya, ko'p turdagi obyekt."
              },
              {
                question: "NotImplementedError — nimada ishlatiladi?",
                options: ["Ota class da 'bu metod bola class da yozilishi kerak' deb bildirish uchun", "Dasturdan chiqish uchun", "Faylni o'chirish uchun", "Faqat print uchun"],
                answer: 0,
                explanation: "Ota (abstrakt) class da NotImplementedError berilib, bola class majburiyat bilan shu metodni yozishi talab qilinadi."
              },
              {
                question: "Quyidagi qaysi misol polimorfizmga to'g'ri keladi?",
                options: ["a = 5; b = 3; c = a + b", "ism = 'Ali'; familiya = 'Vali'; toliq = ism + familiya", "Ikkalasi ham ( operatori + har ikki xil turda turli ishlaydi )", "Hech biri emas"],
                answer: 2,
                explanation: "Ikkalasi ham! + operatori sonlarda qo'shish, stringlarda birlashtirish — POLIMORFIZM."
              },
              {
                question: "Polimorfizm foydasi?",
                options: ["Kodni kengaytirish oson (yangi class qo'shilsa ham umumiy funksiya ishlaydi)", "Kodni ko'paytirish", "Kodni saqlash", "Kodni o'chirish"],
                answer: 0,
                explanation: "Open/Closed prinsipi: kengaytirishga ochiq (yangi qo'shiladi), o'zgartirishga yopiq (eski kodni o'zgartirmaslik)."
              },
              {
                question: "Kvadrat, Doira, Uchburchak — hammasida yuza_hisob() bor: buni nima deb atashadi?",
                options: ["Inkapsulyatsiya", "Meros", "Polimorfizm", "Abstrakt classlar (va polimorfizm)"],
                answer: 3,
                explanation: "Abstrakt ota + override → POLIMORFIZM. Yuza_hisob() bir nom, har birida turli natija."
              }
            ]
          }
        },
        {
          title: 'Inkapsulyatsiya',
          duration: 20,
          xp: 30,
          content: {
            intro: "Inkapsulyatsiya — OOPning 4-prinsipi. Ma'nosi: class ichidagi xususiyatlarni TASHQARIDAN to'g'ridan-to'g'ri O'ZGARTIRISHLARINI oldini olish (himoya qilish). Buni GETTER/SETTER methodlar orqali qilamiz.",
            sections: [
              {
                title: 'Public, Protected, Private xususiyatlar',
                text: "Python da 3 ta daraja bor (namuna ko'rsatmasdan xatti-harakat):\n\n• oddiy nom — PUBLIC: tashqaridan to'g'ridan to'g'ri O'QISH/O'ZGARTIRISH mumkin. Masalan: self.ism\n• bitta pastki chiziq _nom — PROTECTED: 'ichki ishlatish uchun' degan tavsiya. Ammo hech qanday cheklov YIQILMIDI — shunchaki KONVENSIYA.\n• ikkita pastki chiziq __nom — PRIVATE: nom o'zgaradi (name mangling). To'g'ridan-to'g'ri tashqaridan yozib bo'lmaydi.",
                code: "class Hisob:\n    def __init__(self, egalik, dastlab_balans):\n        self.egalik = egalik  # PUBLIC — oddiy\n        self._protected_info = \"Ichki ma'lumot\"  # PROTECTED — _ bilan\n        self.__balans = dastlab_balans  # PRIVATE — __ bilan — himoyalangan\n    \n    # GETTER — balansni o'qish uchun\n    def balansni_kor(self):\n        return f\"Hisob balansi: {self.__balans} so'm\"\n    \n    # SETTER — balansni to'g'ri usulda o'zgartirish\n    def pul_qosh(self, miqdor):\n        if miqdor > 0:\n            self.__balans += miqdor\n            return f\"{miqdor} qo'shildi. {self.balansni_kor()}\"\n        return \"Xato: musbat miqdor kiriting\"\n    \n    def pul_ol(self, miqdor):\n        if 0 < miqdor <= self.__balans:\n            self.__balans -= miqdor\n            return f\"{miqdor} yechildi. {self.balansni_kor()}\"\n        return \"Xato: yetarli mablag' yoki noto'g'ri miqdor\"\n\nh = Hisob(\"Akmal\", 500000)\n\n# PUBLIC: to'g'ridan to'g'ri\nprint(\"Egalik (public):\", h.egalik)\n\n# PRIVATE: BU YO'L BILAN O'QIB BO'LMAYDI (xato beradi):\n# print(h.__balans) → AttributeError!\n# print(h._Hisob__balans) → texnik jihatdan mumkin, LEKIN QILA OLMASLIGINGIZ KERAK!\n\n# GETTER/SETTER bilan ishlaymiz (TO'G'RI USUL):\nprint(h.balansni_kor())\nprint(h.pul_qosh(300000))\nprint(h.pul_ol(200000))\nprint(h.pul_qosh(-100))  # Xato — himoya ishladi!",
                codeNote: "__balans → Python uning nomini o'zgartiradi: _Hisob__balans → name mangling. Shuning uchun h.__balans deb yozsak — hech narsa topilmaydimi degan xato!",
                result: "Egalik (public): Akmal\nHisob balansi: 500000 so'm\n300000 qo'shildi. Hisob balansi: 800000 so'm\n200000 yechildi. Hisob balansi: 600000 so'm\nXato: musbat miqdor kiriting",
                note: "Keyingi darajada @property dekoratori orqali getter/setter yanada chiroyli yoziladi."
              }
            ],
            keyPoints: [
              "Inkapsulyatsiya — xususiyatlarni himoya qilish",
              "Public: nom; Protected: _nom (konvensiya); Private: __nom (name mangling)",
              "GETTER (o'qish) va SETTER (o'zgartirish) metodlari ishlatiladi",
              "Private ni to'g'ridan-to'g'ri o'zgartirib bo'lmaydi — setter orqali tekshirib o'zgartiriladi",
              "Inkapsulyatsiya → noto'g'ri qiymatlar kiritishning oldini oladi"
            ],
            masterXp: 30,
            homework: "1. 'Telefon' class yarating: __model (private), __narx (private). Modellni faqat o'qish (getter) va narxni faqat 50000+ bo'lganda o'zgartirish (setter) usullarini yozing.\n2. Istalgancha qo'shimcha get/set qo'shing (rang, xotira).\n3. Noto'g'ri qiymat berib sinab ko'ring — himoya ishladimi?\n4. (Challenge) @property dekoratori bilan getter va @nom.setter dekoratori bilan setterni yozib ko'ring (maslahat: Google 'Python property decorator').",
            summary: "Bugun Inkapsulyatsiyani o'rgandik — private/public/protected, getter/setter orqali himoya qilish. OOP 4 ta tamoyili tugadi! Keyingi — Exceptionlar!",
            exercises: [
              {
                id: 'py17ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Private balansni to‘ldirish 💰',
                instruction: "'BankHisob' class da __balans private. Bu yerga pul_qosh() SETTER yordamida 500 000 qo'shing va balansni chop qiling.",
                startCode: "class BankHisob:\n    def __init__(self, dastlab):\n        self.__balans = dastlab  # PRIVATE\n    \n    def balans_kor(self):  # GETTER\n        return self.__balans\n    \n    def pul_qosh(self, miqdor):  # SETTER\n        if miqdor > 0:\n            self.__balans += miqdor\n            return f\"{miqdor} qo'shildi\"\n        return \"Xato: musbat son kiriting\"\n\nh = BankHisob(100000)\n# Bu yerga: h.pul_qosh(500000) ni chaqiring\n# Va print(h.balans_kor()) ni yozing\n",
                checks: [
                  { re: 'h\\.pul_qosh\\s*\\(\\s*500000\\s*\\)', msg: "h.pul_qosh(500000) ni ishlating" },
                  { re: 'print\\s*\\(\\s*h\\.balans_kor\\s*\\(\\s*\\)\\s*\\)', msg: "print(h.balans_kor()) ni yozing" }
                ],
                hint: "SETTER = pul_qosh(), GETTER = balans_kor() ni ishlating. Tashqaridan h.__balans deb to'g'ridan to'g'ri yizolmaysiz!",
                explanation: "Inkapsulyatsiya: __balans private (himoyalangan). Uni faqat SETTER/GETTER orqali ishlatishingiz kerak — to'g'ridan-to'g'ri emas!",
                xp: 10
              },
              {
                id: 'py17ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Inkapsulyatsiya darajalari 🧩',
                instruction: "Public / Protected / Private ni turg'idagi ko'rinishlari bilan moslashtiring (tartib: 1.Public, 2.Protected, 3.Private).",
                hint: "oddiy = public, _ = protected (konvensiya), __ = private (name mangling)",
                items: ['self.ism = "Ali" (PUBLIC)', 'self._ichki = "test" (PROTECTED, _ bilan)', 'self.__maxfiy = 1234 (PRIVATE, __ bilan)'],
                xp: 10
              },
              {
                id: 'py17ex3',
                type: 'detective',
                title: '3-MASHQ — INKAPSUlyatsiyada XATONI toping 🔍',
                instruction: "Quyidagi kodda Inkapsulyatsiya tamoyili buzilgan. Qaysi qator xato?",
                code: "class Telefon:\n    def __init__(self, model, narx):\n        self.model = model            # [1] Public — oddiy\n        self._rang = \"Qora\"           # [2] Protected — _ bilan (konvensiya)\n        self.__narx = narx            # [3] Private — __ bilan (himoyalangan)\n    \n    def narx_ozgartir(self, yangi):\n        if yangi > 100:  # himoya: 100 dan yuqori bo'lsin\n            self.__narx = yangi        # [4] SETTER orqali — to'g'ri\n\nt = Telefon(\"iPhone\", 500)\nt.__narx = 1                        # [5] Tashqaridan to'g'ridan-to'g'ri!",
                options: ["[1] self.model = model — noto'g'ri", "[2] self._rang — noto'g'ri", "[3] self.__narx — noto'g'ri", "[5] t.__narx = 1 — private ni to'g'ridan o'zgartirishga urinish, noto'g'ri (va name mangling sabab ishlamaydi)"],
                answer: 3,
                explanation: "[5] XATO! self.__narx PRIVATE — uni tashqaridan t.__narx deb to'g'ridan o'zgartirib BO'LMAYDI! Faqat SETTER (narx_ozgartir) orqali."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Inkapsulyatsiya tamoyili nima?",
                options: ["Kodni ko'paytirish", "Class ichidagi xususiyatlarni himoya qilish (to'g'ridan o'zgartirishni oldini olish)", "Barcha narsalarni public qilish", "Fayllarni saqlash"],
                answer: 1,
                explanation: "Inkapsulyatsiya = 'himoya'. Xususiyatlarni private qilib, faqat GETTER/SETTER orqali ishlatish."
              },
              {
                question: "Python da PRIVATE xususiyat uchun qanday prefiks ishlatiladi?",
                options: ["Bitta _ (pastki chiziq)", "Ikkita __ (ikki pastki chiziq)", "$ belgi", "@ belgi"],
                answer: 1,
                explanation: "__nom = PRIVATE (name mangling ishlaydi). _nom = PROTECTED (konvensiya, cheklov yo'q)."
              },
              {
                question: "PROTECTED xususiyat (_nom) degani:",
                options: ["QATTIY cheklov (to'g'ridan ishlatib bo'lmaydi)", "Konvensiya: 'ichki ishlatish uchun' — lekin texnik jihatdan ishlatish mumkin", "Butunlay o'chirilgan", "Faqat string uchun"],
                answer: 1,
                explanation: "_nom = tavsiya/konvensiya. 'Bu narsa tashqaridan ishlatilmasligi kerak' — lekin Python hech qanday cheklov KIRITMAYDI."
              },
              {
                question: "GETTER va SETTER metodlarining vazifasi:",
                options: ["Faqat chop qilish", "GETTER = o'qish, SETTER = tekshirib o'zgartirish (himoya)", "Faqat o'chirish", "Faylni yozish"],
                answer: 1,
                explanation: "Getter — private ni O'QISH; Setter — private ni TEKSHIRIB O'ZGARTIRISH. Masalan, manfiy pul qo'shilishiga yo'l qo'ymaydi."
              },
              {
                question: "Name mangling (__nom) degani:",
                options: ["Nomi o'chiriladi", "Python __nom ni _Class__nom ga aylantiradi — shuning uchun tashqaridan to'g'ridan ishlatib bo'lmaydi", "Nomi kattalashadi", "String bo'ladi"],
                answer: 1,
                explanation: "__balans → _Hisob__balans ga aylanadi (name mangling). Shuning uchun h.__balans deb yozsak topilmaydi."
              },
              {
                question: "Qaysi kod INKAPSUlyatsiyaga TO'G'RI keladi?",
                options: ["h.__balans += 500", "h.pul_qosh(500)  # setter orqali", "h.balans = h.balans + 500", "h._Hisob__balans += 500 (name mangling orqali noqonuniy)"],
                answer: 1,
                explanation: "To'g'ri usul: SETTER orqali! pul_qosh(500) o'zida tekshiruv (musbatmi?) qiladi va keyin o'zgartiradi."
              },
              {
                question: "Inkapsulyatsiyaning foydasi:",
                options: ["Noto'g'ri qiymatlar kiritilishining oldini oladi (masalan balans manfiy bo'lmasligi)", "Kodni osonroq o'zgartirish mumkin (ichki tuzilish o'zgarsa ham tashqi API o'zgarmaydi)", "Ikkalasi ham", "Hech bir foydasi yo'q"],
                answer: 2,
                explanation: "Ikkalasi ham Inkapsulyatsiyaning foydasi: himoya va mustahkamlik."
              },
              {
                question: "Keyingi darajada GETTER/SETTERni yanada chiroyli yozuvchi dekorator:",
                options: ["@property va @nom.setter", "@staticmethod", "@classmethod", "@cache"],
                answer: 0,
                explanation: "@property — getter; @nom.setter — setter dekoratori. x.balans qilib chaqirsangiz ham, fonida getter/setter ishlaydi."
              }
            ]
          }
        },
        {
          title: 'Exception‘lar',
          duration: 20,
          xp: 30,
          content: {
            intro: "Dastur ishlayotganda kutilmagan xatolar bo'lishi mumkin (zero division, noto'g'ri tur, fayl topilmadi...). Bugun bu xatolarni qanday USHLASH (try/except) va o'z xatolarni yaratishni o'rganamiz.",
            sections: [
              {
                title: 'try / except',
                text: "try: qavs ichida — xato bo'lishi mumkin bo'lgan kod.\nexcept: qavs ichida — xato bo'lganda nima qilish.",
                code: "# Oddiy: 0 ga bo'lish xatosi\na = 10\nb = 0\ntry:\n    natija = a / b\n    print(f\"Natija: {natija}\")\nexcept ZeroDivisionError:\n    print(\"Xato: 0 ga bo'lib bo'lmaydi!\")\n\nprint(\"Dastur davom etmoqda... (to'xtamadi!)\")",
                codeNote: "ZeroDivisionError xatosi ushlandi. Dastur to'xtamadi, davom etdi!",
                result: "Xato: 0 ga bo'lib bo'lmaydi!\nDastur davom etmoqda... (to'xtamadi!)",
                note: "Barcha xato nomlari: https://docs.python.org/3/library/exceptions.html"
              },
              {
                title: 'Ko‘p except / else / finally',
                text: "Bir nechta turdagi xatolarni alohida ushlash mumkin. Hamma xatoni Exception bilan ushlash mumkin (ammo tavsiya etilmaydi — aniqroq qo'llang).\n\nelse — XATO BO'LMAGANDA ishlaydi.\nfinally — XATO BO'LSA HAM BO'LMASA HAM, HAR DOIM oxirida ishlaydi.",
                code: "try:\n    son = int(input(\"Son kiriting: \") or '5')  # brauzerda input ishlamagani uchun 5 qo'ldi\n    natija = 100 / son\n    print(f\"100 / {son} = {natija}\")\nexcept ValueError:\n    print(\"Xato: Butun son kiriting!\")\nexcept ZeroDivisionError:\n    print(\"Xato: NOL kirittiz! 0 ga bo'linmaydi!\")\nexcept Exception as e:\n    print(f\"Boshqa kutilmagan xato: {e}\")\nelse:\n    print(\"✅ Xato yo'q, hammasi joyida!\")\nfinally:\n    print(\"🔚 Bu qator HAR DOIM ishlaydi (tozalash uchun: fayl yopish, ulanishni yopish...)\")",
                codeNote: "ValueError: int('abc') kabi notug'ri tur konvertatsiyasi; ZeroDivision: 0 ga bo'lish.",
                result: "100 / 5 = 20.0\n✅ Xato yo'q, hammasi joyida!\n🔚 Bu qator HAR DOIM ishlaydi (tozalash uchun: fayl yopish, ulanishni yopish...)",
                note: "finally — resurslarni tozalash uchun juda qulay (fayl/network ulanish yopish)."
              },
              {
                title: 'raise — o‘z xatoningizni tashlash',
                text: "O'zingiz ham shart asosida xato tashlash mumkin.",
                code: "def yosh_kirit(yosh):\n    if yosh < 0:\n        raise ValueError(\"Yosh manfiy bo'la olmaydi!\")\n    if yosh > 150:\n        raise ValueError(\"Yosh juda katta, noto'g'ri!\")\n    return f\"Siz {yosh} yoshsiz\"\n\ntry:\n    print(yosh_kirit(25))\n    print(yosh_kirit(-5))  # XATO TASHLAYDI!\nexcept ValueError as e:\n    print(f\"Xato ushlandi: {e}\")",
                codeNote: "raise XatoTuri('xabar') — o'z xatoningizni tashlash.",
                result: "Siz 25 yoshsiz\nXato ushlandi: Yosh manfiy bo'la olmaydi!",
                note: "O'z Exception class yarating: class MyErr(Exception): pass — keyin raise MyErr('xabar')."
              }
            ],
            keyPoints: [
              "try — xato keltarib chiqarishi mumkin kod",
              "except XatoTuri — xato ushlash (bir nechta except bo'lishi mumkin)",
              "else — xato bo'lmagan ishlaydi",
              "finally — har doim oxirida (resurs tozalash)",
              "raise — o'z xatoningizni tashlash",
              "Exception — barcha xatolar uchun umumiy (ishlatishda ehtiyot)"
            ],
            masterXp: 30,
            homework: "1. int(input()) bilan son kiritib oladigan kod yozing: noto'g'ri qiymat kiritilsa xato bermasligini ta'minlang (while + try/except).\n2. Ikki sonni bo'luvchi dastur: ZeroDivision va ValueError ni ushlang.\n3. O'z xatotingizni yarating: ParolQisqaError. parol < 8 ta bo'lsa raise.\n4. try/finally bilan fayl ochish namunasini yozing (close() finally da yozilsin — keyingi dars fayllar).",
            summary: "Bugun Exception'larni o'rgandik: try/except/else/finally, raise. Keyingi — Fayllar bilan ishlash!",
            exercises: [
              {
                id: 'py18ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — 0 ga bo‘lishni ushlash 🛡️',
                instruction: "a / b ni hisoblashda ZeroDivisionError xatosi bo'lsa 'NOLGA BO'LINMAYDI!' deb chiqaruvchi kod yozing (try/except). Keyin a=10, b=0 bilan sinab ko'ring.",
                startCode: "a = 10\nb = 0\n# Bu yerga try: natija = a / b va except ZeroDivisionError: ... yozing\n# Keyin print(natija) yoki xatoni chop qiling\n",
                checks: [
                  { re: 'try\\s*:', msg: "try: blokidan foydalaning" },
                  { re: 'except\\s+ZeroDivisionError\\s*:', msg: "except ZeroDivisionError: ni qo'shing" }
                ],
                hint: "try: ichida a/b ni hisoblash, except ZeroDivisionError: da xatoni chop qilish.",
                explanation: "try/except ZeroDivisionError — 0 ga bo'lish xatosini ushlash va dastur to'xtashidan saqlash!",
                xp: 10
              },
              {
                id: 'py18ex2',
                type: 'dragdrop',
                title: '2-MASHQ — try/except/else/finally tartibi 🧩',
                instruction: "Quyidagi qismlarni TO'G'RI TARTIBGA joylashtiring (try → except → else → finally).",
                hint: "try → except ValueError → else → finally",
                items: [
                  'try:',
                  '    son = int(\"5\")',
                  'except ValueError:',
                  '    print(\"Xato: songa aylantirib bo‘lmaydi\")',
                  'else:',
                  '    print(\"Xato yo‘q!\")',
                  'finally:',
                  '    print(\"Har doim ishlaydi\")'
                ],
                xp: 10
              },
              {
                id: 'py18ex3',
                type: 'detective',
                title: '3-MASHQ — RAISE da XATONI toping 🔍',
                instruction: "Quyidagi raise bilan yozilgan kodda qaysi NUQTA noto'g'ri?",
                code: "def tekshir_yosh(yosh):\n    if yosh < 0:                          # [1]\n        raise ValueError(\"Yosh manfiy bo'la olmasin\")  # [2]\n    if yosh > 150:                        # [3]\n        raise ValueError(\"Yosh juda katta\")            # [4]\n    return f\"Yosh: {yosh}\"\n\ntry:\n    print(tekshir_yosh(-10))              # [5]\nexcept ValueError as e:                     # [6]\n    print(f\"Xato: {e}\")                    # [7]\n    # Keyingi qator: XATOSIZ davom etishi kerak — lekin:",
                options: [
                  "[1] if yosh < 0 — noto'g'ri",
                  "[2] raise ValueError — noto'g'ri",
                  "[5] tekshir_yosh(-10) → xato bo'lishi kerak, ishlaydi",
                  "raise ValueError emas, raise ExceptionError bo'lishi kerak (ValueError mavjud emas)"
                ],
                answer: 3,
                explanation: "ValueError — Python da STANDART xato turi (mavjud!). Xato usullari: ValueError, TypeError, ZeroDivisionError, KeyError, FileNotFoundError va boshqalar. 'ExceptionError' — bunday tur MAVJUD EMAS."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "try / except nima uchun ishlatiladi?",
                options: ["Kodni ko'paytirish", "Kutilmagan XATOLARNI USHLASH va dastur to'xtashidan saqlash", "Fayl yozish", "Sikl yaratish"],
                answer: 1,
                explanation: "try/except — xatolarni boshqarish (error handling) uchun. Xato bo'lsa ham dastur davom etadi."
              },
              {
                question: "0 ga bo'lishda qaysi xato turi chiqadi?",
                options: ["ValueError", "ZeroDivisionError", "TypeError", "FileNotFoundError"],
                answer: 1,
                explanation: "10 / 0 → ZeroDivisionError: division by zero."
              },
              {
                question: "int('abc') ga urinsa qaysi xato?",
                options: ["ZeroDivisionError", "ValueError (noto'g'ri qiymat tur)", "IndexError", "KeyError"],
                answer: 1,
                explanation: "int('abc') — ValueError: invalid literal for int() with base 10."
              },
              {
                question: "ELSE bloki (try/except/else) qachon ishlaydi?",
                options: ["XATO BO'LGANDA", "XATO BO'LMAGANDA (try muvaffaqiyatli tugaganda)", "HAR DOIM", "FAQAT finally dan keyin"],
                answer: 1,
                explanation: "else — faqat try muvaffaqiyatli (xatosiz) tugaganda ishlaydi."
              },
              {
                question: "FINALLY bloki qachon ishlaydi?",
                options: ["Faqat xato bo'lganda", "Faqat xato bo'lmaganda", "HAR DOIM (xato bo'lsa ham, bo'lmasa ham oxirida)", "Hech qachon"],
                answer: 2,
                explanation: "finally — RESURS TOZALASH uchun (fayl yopish, ulanishni yopish). Har doim ishlaydi."
              },
              {
                question: "RAISE kalit so'zi nima uchun ishlatiladi?",
                options: ["Xatoni ushlash", "O'zimiz XATO TASHLASH (keltirish)", "Fayl ochish", "Siklni to'xtatish"],
                answer: 1,
                explanation: "raise ValueError('xabar') — siz o'zingiz xato keltirasiz va yuoqoridagi try/except ushlaydi."
              },
              {
                question: "O'z Exception classingizni yaratish uchun:",
                options: ["Xato yaratib bo'lmaydi", "class MeningXatom(Exception): pass — keyin raise MeningXatom('xabar')", "import MyError dan foydalanish", "solo error() funksiyasi"],
                answer: 1,
                explanation: "class MeningXatolar(Exception): pass → keyin raise MeningXatolar('Bu mening xatom') ishlatiladi."
              },
              {
                question: "Ko'p except (bir nechta xato turi) — qaysi TO'G'RI?",
                options: ["Faqat bitta except bo'lishi mumkin", "Birinchi o'ziga xos turlar, oxirida umumiy Exception", "Birinchi umumiy Exception", "Faqat TypeError ishlatiladi"],
                answer: 1,
                explanation: "Avval aniq (ValueError, ZeroDivisionError), keyin kengroq Exception (barchasi uchun). Bu tartib juda muhim!"
              }
            ]
          }
        },
        {
          title: 'Fayllar bilan ishlash',
          duration: 20,
          xp: 30,
          content: {
            intro: "Bugun dasturimizdan FAYLLARGA yozish va ulardan O'QISHni o'rganamiz. Pythonda fayllar bilan ishlash juda oson!",
            sections: [
              {
                title: 'open(), rejimlar, close()',
                text: "fayl = open('nom.txt', 'rejim')\n\nRejimlar:\n• 'r' — o'qish (default) — fayl bo'lmasa xato\n• 'w' — yozish (AVVAL mavjud faylni TOZALAYDI, yo'q bo'lsa yaratadi)\n• 'a' — append (oxiriga qo'shish)\n• 'r+' — o'qish + yozish\n\nTugagandan keyin OBIRNOB close() qiling!",
                code: "# 1) Yozish: 'w' — ESLATMA: brauzer/pyodide fayl tizimi cheklanganligi sabab bu namuna\n# import io, os\n# with open('test.txt', 'w', encoding='utf-8') as f:\n#     f.write('Assalomu alaykum!\\n')\n#     f.write('Men Python o‘rganyapman.')\n\n# 2) O'qish — oddiy string simulyatsiyasi (ishlatilgan fayl matni):\nmatn = \"\"\"Assalomu alaykum!\nMen Python o‘rganyapman.\nBugun fayllar mavzusini o‘rganaman.\nQatorlar 3 ta.\"\"\"\nprint('\\n📖 Butun matn:')\nprint(matn)\n\nprint('\\n📖 Qatorma-qator (splitlines orqali):')\nfor i, qator in enumerate(matn.splitlines(), start=1):\n    print(f'{i}. {qator}')\n\nprint(f'\\n📊 Jami qatorlar: {len(matn.splitlines())} ta')",
                codeNote: "encoding='utf-8' O'zbekcha harflar uchun SHART!",
                result: "\\n📖 Butun matn:\\nAssalomu alaykum!\\nMen Python o‘rganyapman.\\nBugun fayllar mavzusini o‘rganaman.\\nQatorlar 3 ta.\\n\\n📖 Qatorma-qator (splitlines orqali):\\n1. Assalomu alaykum!\\n2. Men Python o‘rganyapman.\\n3. Bugun fayllar mavzusini o‘rganaman.\\n4. Qatorlar 3 ta.\\n\\n📊 Jami qatorlar: 4 ta",
                note: "Amalda: f = open('a.txt','r'); s = f.read(); f.close() — YOPISH MAJBURIY!"
              },
              {
                title: 'with (context manager)',
                text: "with open(...) as f: — f.close() AVTOMATIK ishlaydi! Xatolik bo'lsa ham. Bu eng TAVSIYA ETILGAN USUL!",
                code: "# Brauzer cheklovi sabab — pseudokod:\n# print('To‘g‘ri sintaksis (fayl bor kompyuterda):')\n# with open('fayl.txt', 'r', encoding='utf-8') as f:\n#     s = f.read()\n#     print(s)\n# # Bu yerda f o'zi yopiladi — f.close() kerak emas!\n\n# Analogi: StringIO bilan ishlash (faylga o'xshash)\nfrom io import StringIO\n\nf = StringIO()\nf.write('Birinchi qator\\n')\nf.write('Ikkinchi qator\\n')\nprint('StringIO (faylga o\\'xshash):')\nprint(f.getvalue())\nf.close()",
                codeNote: "with — bu eng yaxshi usul, xatolar bo'lsa ham resurs avtomatik ozod qilinadi.",
                result: "StringIO (faylga o'xshash):\\nBirinchi qator\\nIkkinchi qator\\n",
                note: "with as — context manager: file handling, db connection va shu kabi resurslar uchun juda kerak."
              },
              {
                title: 'read(), readline(), readlines()',
                text: "• .read() — butun faylni bitta string qaytaradi\n• .readline() — bir keyingi qatorni o'qiydi\n• .readlines() — har bir qator list elementi sifatida (list[str])",
                code: "matn = \"1-qator\\n2-qator\\n3-qator\"\n\n# Simulyatsiya:\nlines = matn.splitlines(keepends=True)  # readlines() ga o'xshash\nprint('readlines() list:')\nprint(lines)\n\nfor i, line in enumerate(lines, start=1):\n    print(f'{i}-qator: {line.rstrip()}')  # rstrip — yangi qator belgisini olib tashlaydi",
                codeNote: "Juda katta faylni read() bilan o'qimaslik — xotira to'lib ketishi mumkin.",
                result: "readlines() list:\\n['1-qator\\n', '2-qator\\n', '3-qator']\\n1-qator: 1-qator\\n2-qator: 2-qator\\n3-qator: 3-qator",
                note: "Katta fayllar uchun: for qator in fayl: — line-by-line o'qiydi."
              }
            ],
            keyPoints: [
              "open('nom.txt', 'r/w/a/r+', encoding='utf-8')",
              "Har doim CLOSE() qilish kerak — yoki WITH ishlatish (avtomatik yopadi)",
              "r: o'qish, w: yozish (avvalini o'chiradi), a: append (oxiriga qo'sh)",
              "read(), readline(), readlines() — o'qish usullari",
              "katta fayllar uchun for line in fayl: qatorma-qator o'qish",
              "encoding='utf-8' O'zbekcha uchun MAJBURIY"
            ],
            masterXp: 30,
            homework: "1. Kompyuteringizda (terminal/IDE): ism/yosh/shahar so'rab olib, faylga yozadigan dastur yozing ('w').\n2. Shu faylni yana o'qing va konsolga chiqaring.\n3. Foydalanuvchi ma'lumotlarini davomini qo'shib boring ('a' — append) — eski ma'lumotlar saqlansin.\n4. Qatorlar sonini va eng uzun qatorni aniqlaydigan kod yozing.\n5. (Challenge) CSV formatda yoz-o'qing: Ism,Yosh; keyin barchasini dict listka aylantiring.",
            summary: "Bugun fayllar bilan ishlashni o'rgandik: open/close, with context manager, read/write/append, o'qish usullari. Keyingi — OS moduli!",
            exercises: [
              {
                id: 'py19ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Faylga yozish StringIO bilan 📝',
                instruction: "StringIO (faylga o'xshash) orqali 3 ta qator yozing va oxirida getvalue() orqali chop qiling. Qatorlar: 'Birinchi qator', 'Ikkinchi qator', 'Uchinchi qator'.",
                startCode: "from io import StringIO\n\nf = StringIO()\n# Bu yerga f.write(...) bilan 3 ta qator yozing (oxiriga \\n qo'yishni unutmang)\n# Va oxirida print(f.getvalue()) ni yozing\n",
                checks: [
                  { re: 'f\\.write\\s*\\(', msg: "Kamida 3 marta f.write() ishlatilgan" },
                  { re: 'print\\s*\\(\\s*f\\.getvalue\\s*\\(\\s*\\)\\s*\\)', msg: "print(f.getvalue()) ni qo'shing" }
                ],
                hint: "f.write('Matn\\n') — har bir qatorni yozing. Keyin f.getvalue() barchasini oladi.",
                explanation: "StringIO xotirada fayldek ishlaydi. write() yozish, getvalue() esa barcha yozilgan matnni olish.",
                xp: 10
              },
              {
                id: 'py19ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Fayl rejimlarini (mode) joylashtiring 🧩',
                instruction: "Rejimlarni tavsiflariga mos tartibda joylashtiring: 1.O'qish, 2.Yozish (eski ma'lumotni o'chiradi), 3.Oxiriga qo'shish, 4.O'qish + yozish.",
                hint: "r=read, w=write (tozalaydi), a=append, r+=read+write",
                items: ["'r' — faqat o'qish (default)", "'w' — yozish (avval faylni tozalaydi, yo'qsa yaratadi)", "'a' — append (oxiriga qo'shadi)", "'r+' — o'qish + yozish"],
                xp: 10
              },
              {
                id: 'py19ex3',
                type: 'detective',
                title: '3-MASHQ — FAYL kodida XATONI toping 🔍',
                instruction: "Quyidagi fayl bilan ishlash kodida qaysi qator jiddiy xato (resurs yopilmagan)?",
                code: "# [1] Oddiy usul (with siz):\nf = open('fayl.txt', 'w', encoding='utf-8')  # [2]\nf.write('Salom!\\n')                              # [3]\nf.write('Python')                                # [4]\nprint('Yozildi')                                 # [5]\n# Bu yerda f.close() YO'Q!                        # [6] — XATO!",
                options: [
                  "[2] open da encoding noto'g'ri",
                  "[3] write da \\n kerak emas",
                  "[6] f.close() YO'Q — resurs ozod qilinmagan! Fayl zichlanishi mumkin",
                  "[5] print — bu fayl bilan ishlashka kerak emas"
                ],
                answer: 2,
                explanation: "f.close() MAJBURIY! (with ishlatmasangiz). Uni unutib qo'ysangiz, resurs zudlik bilan tugashi, fayl buferlari saqlanmasligi mumkin. Shuning uchun WITH ishlatish tavsiya etiladi (auto close)."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "open('a.txt', 'w') — 'w' rejimi nima qiladi?",
                options: ["Faqat o'qish", "Yozish: mavjud faylni BIRINCHI TOZALAYDI, keyin yangisini yozadi (yo'qsa yaratadi)", "Faqat oxiriga qo'shish", "Faylni o'chirish"],
                answer: 1,
                explanation: "'w' = WRITE: Eski ma'lumot O'CHIRILADI! Ehtiyot bo'ling. Agar qo'shish kerak bo'lsa — 'a' ni ishlating."
              },
              {
                question: "Faylni ochgandan keyin NIMA MAJBURIY qilish kerak?",
                options: ["print()", "close() (yoki WITH manager orqali avtomatik)", "open()", "del()"],
                answer: 1,
                explanation: "Resurs (fayl) ni ozod qilish shart: f.close(). Yoki eng yaxshisi 'with open(...) as f:' (auto close)."
              },
              {
                question: "with open(...) as f: — foydasini ayting:",
                options: ["Kodni tezroq ishlatadi", "Xato bo'lsa ham, faylni AVTOMATIK YOPADI (close) — xavfsiz", "Faqat katta fayllar uchun", "Faqat yozish uchun"],
                answer: 1,
                explanation: "with = context manager: kod oxirida yoki xato bo'lganda ham f.close() avtomatik ishlaydi. ENG TAVSIYA ETILGAN USUL."
              },
              {
                question: "'a' rejimi (append):",
                options: ["Faylni tozalaydi", "Faqat o'qiydi", "ESKI MA'LUMOT SAQLANADI, yangisi OXIRIGA qo'shiladi", "Faylni o'chiradi"],
                answer: 2,
                explanation: "'a' = APPEND: oldingi ma'lumot uchirilmaydi, yangisi oxiriga qo'shiladi. Jurnal yozuvlari uchun juda qulay."
              },
              {
                question: "UTF-8 encoding — nima uchun kerak?",
                options: ["Raqamlarni yozish uchun", "O'zbekcha (krikillatirilgan) harflarni to'g'ri ko'rsatish uchun SHART", "Faqat rasmlar uchun", "Faqat Windows uchun"],
                answer: 1,
                explanation: "encoding='utf-8' — O'zbekcha (Ў, Қ, Ғ, Ҳ, Ў, ...) va boshqa tillar uchun MAJBURIY! Open da ko'rsatmasangiz ba'zi OS da xato ko'rinadi."
              },
              {
                question: "read(), readline(), readlines() — FARQ:",
                options: ["Bir xil narsalar", "read()=butun string; readline()=1-qator; readlines()=list[qator_str]", "Faqat read() ishlatiladi", "Barchasi int qaytaradi"],
                answer: 1,
                explanation: "Uchlari farqli. Katta fayllar uchun for line in f: (line-by-line) ishlatish yaxshiroq."
              },
              {
                question: "Katta faylni o'qishda eng yaxshi usul:",
                options: ["read() — butun faylni bitta stringga", "for qator in fayl: — qatorma-qator (xotira tejaydi)", "readlines() — listga", "Barchasi bir xil"],
                answer: 1,
                explanation: "Katta fayllar uchun for line in f — qatorma-qator. xotira to'lib ketmaydi."
              },
              {
                question: "Fayl yo'q bo'lganda open('yoq.txt', 'r') — qaysi xato?",
                options: ["ValueError", "FileNotFoundError", "ZeroDivisionError", "TypeError"],
                answer: 1,
                explanation: "O'qish rejimida fayl topilmasa — FileNotFoundError. 'w' yoki 'a' esa yo'q bo'lsa yaratadi."
              }
            ]
          }
        },
        {
          title: 'OS moduli',
          duration: 15,
          xp: 25,
          content: {
            intro: "os moduli OPERATSION TIZIM bilan ishlashga yordam beradi: fayl/papka yaratish, o'chirish, fayllarni ro'yxatini olish, yo'llar bilan ishlash va hokazo.",
            sections: [
              {
                title: 'Asosiy os funksiyalari',
                text: "import os orqali import qilinadi.",
                code: "import os\nfrom pathlib import Path\n\n# 1) Joriy katalog (bu kod qayerda ishlayotgan joy)\ncwd = os.getcwd()\nprint('Joriy katalog:', cwd)\n\n# 2) Katalog ichidagi fayllar (brauzer cheklovi — listdir() kamroq element qaytarishi mumkin)\ntry:\n    files = os.listdir('.')[:10]  # faqat birinchi 10 tasi\n    print('\\n📁 Katalog elementlari:')\n    for f in files:\n        print('  •', f)\nexcept Exception as e:\n    print(f'listdir cheklangan: {e}')\n\n# 3) Fayl/katalog mavjudmi? (pathlib — zamonaviy usul)\nfayl_nom = 'salom.txt'\npath = Path(fayl_nom)\nprint(f'\\n"{fayl_nom}" mavjudmi?', path.exists())\nprint('Bu faylmi?', path.is_file())\nprint('Bu katalogmi?', path.is_dir())\n\n# 4) Yo'l birlashtirish (Windows \\ yoki Linux / ni avtomatik tanlaydi)\nto'liq = os.path.join(cwd, 'yangi_papka', 'fayl.txt')\nprint(f'\\nQo'shilgan yo‘l: {to\\'liq}')",
                codeNote: "Pathlib zamonaviy usuldir (Python 3.4+). path.exists(), path.is_file() va boshqalarni ishlating.",
                result: "Joriy katalog: /tmp\n\n📁 Katalog elementlari:\n  • ...\n\n'salom.txt' mavjudmi? False\nBu faylmi? False\nBu katalogmi? False\n\nQo'shilgan yo‘l: /tmp/yangi_papka/fayl.txt",
                note: "mkdir — papka yaratish, remove — faylni o'chirish, rmdir — bo'sh papkani o'chirish, rename — nom o'zgartirish."
              }
            ],
            keyPoints: [
              "import os, pathlib.Path (zamonaviy)",
              "os.getcwd(), os.listdir('.') — katalog bilan ishlash",
              "os.path.join(a, b) — yo'llarni birlashtirish (platformaga mos)",
              "Path('nom').exists() / is_file() / is_dir()",
              "os.mkdir('p'), os.rename('a','b'), os.remove('f.txt'), os.rmdir('p')",
              "os.environ — atrof-muhit o'zgaruvchilari"
            ],
            masterXp: 25,
            homework: "1. os.getcwd() orqali joriy katalogni chop qiling.\n2. Desktop katalogida 'test_python' papkasini yarating va ichida 'a.txt' yaratib yozib ko'ring (kompyuterda!).\n3. os.listdir() orqali barcha fayl va papkalarni chop qiling.\n4. Biror faylni os.rename() orqali nomini o'zgartirib ko'ring.\n5. (Challenge) Rekursiv barcha fayllarni sanab chiqaring: os.walk() yordamida.",
            summary: "Bugun OS moduli va pathlib bilan tanishdik — fayl/papka, yo'l bilan ishlash. Keyingi — datetime!",
            exercises: [
              {
                id: 'py20ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Joriy katalog va Path bilan tekshirish 📁',
                instruction: "os.getcwd() ni chop qiling va 'test_papka' uchun Path obyekt yaratib, mavjudligini (exists()) va katalog ekanligini (is_dir()) chop qiling.",
                startCode: "import os\nfrom pathlib import Path\n\n# Bu yerga:\n# 1) print(os.getcwd()) — joriy katalog\n# 2) p = Path('test_papka') yaratish\n# 3) print(p.exists()) va print(p.is_dir()) ni chop qiling\n",
                checks: [
                  { re: 'print\\s*\\(\\s*os\\.getcwd\\s*\\(\\s*\\)\\s*\\)', msg: "os.getcwd() ni chop qiling" },
                  { re: 'exists\\s*\\(\\s*\\)', msg: "Path.exists() ni ishlating" },
                  { re: 'is_dir\\s*\\(\\s*\\)', msg: "Path.is_dir() ni ishlating" }
                ],
                hint: "os.getcwd() joriy katalog. Path('nom').exists() — mavjudmi? is_dir() — papkami?",
                explanation: "os.getcwd() — bu kod qayerda ishlayotgan katalog. Pathlib zamonaviy: exists(), is_file(), is_dir() — qulay tekshiruvlar.",
                xp: 10
              },
              {
                id: 'py20ex2',
                type: 'dragdrop',
                title: '2-MASHQ — OS funksiyalarini joylashtiring 🧩',
                instruction: "Quyidagi OS funksiyalarini amallari bilan mos tartibda joylashtiring: 1.joriy katalog, 2.katalog elementlari, 3.yo'l birlashtirish, 4.nom o'zgartirish.",
                hint: "getcwd → listdir → path.join → rename",
                items: [
                  "os.getcwd() — joriy (ishlayotgan) katalog",
                  "os.listdir('.') — katalog ichidagi fayl/papkalar ro'yxati",
                  "os.path.join(a, b) — ikki yo'lni (platformaga mos holda) birlashtirish",
                  "os.rename('eski.txt', 'yangi.txt') — fayl/papka nomini o'zgartirish"
                ],
                xp: 10
              },
              {
                id: 'py20ex3',
                type: 'detective',
                title: '3-MASHQ — OS da XATONI toping 🔍',
                instruction: "Quyidagi kodda qaysi qator noto'g'ri (yoki xavfsiz emas)?",
                code: "import os\nfrom pathlib import Path\n\nos.getcwd()                                         # [1] to'g'ri\nos.listdir('.')                                     # [2] to'g'ri\nos.path.join('C:\\\\Users', 'fayl.txt')               # [3] to'g'ri\nos.remove('test_papka')                             # [4] PAPKAni remove() bilan o'chirishga urinish — XATO!",
                options: [
                  "[1] getcwd — noto'g'ri",
                  "[2] listdir — noto'g'ri",
                  "[3] path.join — noto'g'ri",
                  "[4] os.remove('test_papka') — PAPKANI o'chirishda remove EMAS, rmdir() kerak! (remove faqat FAYL uchun)"
                ],
                answer: 3,
                explanation: "[4] XATO! os.remove() — faqat FAYL uchun. PAPKA (katalog) uchun: os.rmdir() (faqat BO'SH papka) yoki shutil.rmtree() (ichidagilari bilan birga)."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "os moduli nima uchun ishlatiladi?",
                options: ["Faqat matematika hisoblash", "Operatsion tizim (OS) bilan ishlash: fayl/papka, yo'llar, atrof-muhit va hokazo", "Faqat rasm chizish", "Faqat tarmoq"],
                answer: 1,
                explanation: "os = Operating System. Fayl/papka boshqarish, yo'llar, joriy katalog va boshqa OZ bilan bog'liq ishlar."
              },
              {
                question: "Joriy (ishlayotgan) katalogni aniqlash uchun:",
                options: ["os.cwd()", "os.getcwd()", "os.pwd()", "os.current()"],
                answer: 1,
                explanation: "os.getcwd() = get current working directory: hozirgi kod ishlayotgan katalog yo'li."
              },
              {
                question: "Katalog ichidagi fayl va papkalarni ro'yxatini olish:",
                options: ["os.listdir('.')", "os.readdir('.')", "os.files('.')", "os.dir('.')"],
                answer: 0,
                explanation: "os.listdir('.') — joriy katalogning barcha elementlari (list[str])."
              },
              {
                question: "Yo'llarni BIRLASHTIRISH (Windows \\\\ yoki Linux / ni avtomatik tanlash) uchun:",
                options: ["a + b", "os.path.join(a, b)", "os.path.combine(a, b)", "strcat(a, b)"],
                answer: 1,
                explanation: "os.path.join() yoki Path(a) / b zamonaviy usullar — platformaga mos yo'l hosil qiladi. O'z qo'lingiz bilan '/' qo'shmang!"
              },
              {
                question: "Pathlib (from pathlib import Path) — zamonaviy usul. Path('f.txt').exists():",
                options: ["Faylni yozadi", "Mavjudmi? (True/False)", "Faylni o'chiradi", "Faylni nomini o'zgartiradi"],
                answer: 1,
                explanation: "Path('nom').exists() → True/False. is_file() → faylmi? is_dir() → papkami? juda qulay."
              },
              {
                question: "Yangi PAPKA (katalog) yaratish uchun:",
                options: ["os.newdir('p')", "os.mkdir('p')", "os.createdir('p')", "os.makedir('p')"],
                answer: 1,
                explanation: "os.mkdir('papka') — bitta papka yaratadi. os.makedirs('a/b/c') — ichma-ich hammasini yaratadi."
              },
              {
                question: "FAYLni o'chirish: os.remove('a.txt'). PAPKAni (faqat bo'sh) o'chirish:",
                options: ["os.delete('p')", "os.rmdir('p')", "os.removedir('p')", "os.remove('p')"],
                answer: 1,
                explanation: "os.rmdir() — faqat BO'SH papkani o'chiradi. Ichida narsa bo'lsa xato beradi. shutil.rmtree() esa to'liq o'chiradi (ehtiyot!)."
              },
              {
                question: "Atrof-muhit o'zgaruvchilari (masalan PATH) kirish:",
                options: ["os.env", "os.environ", "os.vars", "os.settings"],
                answer: 1,
                explanation: "os.environ — dict kabi atrof-muhit o'zgaruvchilari. os.environ.get('HOME') yoki os.environ.get('USERNAME')."
              }
            ]
          }
        },
        {
          title: 'Datetime',
          duration: 20,
          xp: 30,
          content: {
            intro: "Bugun SANA VAQT bilan ishlash: datetime moduli. Joriy vaqtni olish, sana tuzish, formatlash, sana oralig'i hisoblashni o'rganamiz.",
            sections: [
              {
                title: 'datetime — asosiy tushuncha',
                text: "import datetime yoki from datetime import datetime, date, time, timedelta.",
                code: "from datetime import datetime, date, time, timedelta\n\n# 1) Joriy sana-vaqt\nhozir = datetime.now()\nprint('Hozirgi sana-vaqt:', hozir)\nprint('Yil:', hozir.year)\nprint('Oy:', hozir.month)\nprint('Kun:', hozir.day)\nprint('Soat:', hozir.hour)\nprint('Daqiqa:', hozir.minute)\nprint('Soniya:', hozir.second)\n\n# 2) Maxsus sana yaratish\ntugilgan = date(2000, 1, 15)\nprint(f'\\nTug‘ilgan sana: {tugilgan}')\nprint('Hafta kuni (0-Dushanba):', tugilgan.weekday())\n\n# 3) Sana oralig'i (farq) — timedelta\nbugun = date.today()\nyosh = bugun - tugilgan\nprint(f'\\nSiz yashagan kunlar: {yosh.days} ta')\nprint(f'Taxminan yosh: {yosh.days // 365} yosh')",
                codeNote: "weekday(): 0-Dushanba, 6-Yakshanba. isoweekday(): 1-Dushanba, 7-Yakshanba.",
                result: "Hozirgi sana-vaqt: 2025-...\\nYil: 2025\\nOy: 9\\nKun: 19\\nSoat: ...\\nTug‘ilgan sana: 2000-01-15\\nHafta kuni (0-Dushanba): 5\\n\\nSiz yashagan kunlar: ... ta",
                note: "Sana farqini ayriboshlash: +timedelta(days=100), -timedelta..."
              },
              {
                title: 'strftime (sana→string) va strptime (string→sana)',
                text: "Formatlash kodi (yordamchi):\n%Y=to'liq yil (2024), %m=oy (01), %d=kun (09), %H=soat 24 format (15), %M=daqiqa, %S=soniya",
                code: "from datetime import datetime\n\nhozir = datetime(2024, 5, 9, 15, 30, 45)\n\n# 1) strftime: SANA → STRING\nprint('Format 1 (DD.MM.YYYY):', hozir.strftime('%d.%m.%Y'))\nprint('Format 2:', hozir.strftime('%d/%m/%Y %H:%M:%S'))\nprint('Format 3 (chiroyli):', hozir.strftime('%d %B %Y, %A — %H:%M'))\n\n# 2) strptime: STRING → SANA\nsana_str = '25-12-2024'\nsana = datetime.strptime(sana_str, '%d-%m-%Y')\nprint(f'\\nString dan sana: {sana} (type: {type(sana).__name__})')",
                codeNote: "%B — to'liq oy nomi (December), %A — to'liq hafta kuni. strptime xato beradi agar format mos kelmasa!",
                result: "Format 1 (DD.MM.YYYY): 09.05.2024\\nFormat 2: 09/05/2024 15:30:45\\nFormat 3 (chiroyli): 09 May 2024, Thursday — 15:30\\n\\nString dan sana: 2024-12-25 00:00:00 (type: datetime)",
                note: "Locale (til) o'zgartirib oy/kun nomlarini o'zbekcha ham chiqarish mumkin (locale.setlocale)."
              },
              {
                title: 'timedelta — vaqt qo‘shish/ayirish',
                text: "timedelta — VAQT ORALIĞI.",
                code: "from datetime import datetime, timedelta\n\nbugun = datetime(2024, 6, 1)\n\n# 100 kun keyingi sana\nkeyingi = bugun + timedelta(days=100)\nprint(f'Bugun: {bugun.date()} → 100 kun keyin: {keyingi.date()}')\n\n# 1 hafta oldin\navval = bugun - timedelta(weeks=1)\nprint(f'1 hafta oldin: {avval.date()}')\n\n# 2 soat 30 daqiqa keyin\nhozir = datetime(2024,6,1,10,0,0)\nvizit = hozir + timedelta(hours=2, minutes=30)\nprint(f'{hozir.time()} + 2:30 = {vizit.time()}')",
                codeNote: "timedelta: days, seconds, microseconds, milliseconds, minutes, hours, weeks — argumentlar.",
                result: "Bugun: 2024-06-01 → 100 kun keyin: 2024-09-08\\n1 hafta oldin: 2024-05-25\\n10:00:00 + 2:30 = 12:30:00",
                note: "Ikki sana ayriboshlash timedelta qaytaradi: sana1 - sana2 → timedelta."
              }
            ],
            keyPoints: [
              "from datetime import datetime, date, time, timedelta",
              "datetime.now() — hozir, date.today() — bugun",
              ".year/.month/.day/.hour/.minute/.second — xususiyatlar",
              "strftime() → formatlash (sana→string), kod: %Y, %m, %d, %H, %M, %S",
              "strptime(str, format) → string→sana",
              "timedelta(days=, hours=, weeks=...) — vaqt qo'shish/ayirish"
            ],
            masterXp: 30,
            homework: "1. Bugungi sanani 3 xil formatda chop qiling (DD.MM.YYYY, Kun/Oy/Yil Soat:Daqiqa).\n2. Tug'ilgan sanangizni date() orqali yarating va jami yashagan kunlar sonini hisoblang.\n3. '01.01.2025' dan 1000 kun keyin qaysi sana ekanini chop qiling.\n4. Bugungi sana va 1000 kun keyingi sana orasidagi FARQni (kunlarda) hisoblang.\n5. (Challenge) Ikki sana kiritib, ular orasidagi NECHA KUN NECHA SOAT farq qilishini aniqlovchi dastur yozing.",
            summary: "Bugun datetime moduli: sana-vaqt, formatlash, timedelta. Keyingi — List Comprehension!",
            exercises: [
              {
                id: 'py21ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Bugun + 30 KUN keyingi sana 📅',
                instruction: "Bugungi sanani (date.today()) olib, UNGA 30 KUN QO‘SHING (timedelta) va natijani chop qiling.",
                startCode: "from datetime import date, timedelta\n\nbugun = date.today()\n# Bu yerga: keyingi = bugun + timedelta(days=30) yozing\n# Va print(keyingi) ni chop qiling\n",
                checks: [
                  { re: 'timedelta\\s*\\(\\s*days\\s*=\\s*30\\s*\\)', msg: "timedelta(days=30) ni ishlating" },
                  { re: '\\+\\s*timedelta', msg: "bugun + timedelta(...) ni qo'shing" }
                ],
                hint: "timedelta(days=30) — 30 kunlik vaqt oralig'i. Sana + timedelta = yangi sana.",
                explanation: "Sanalar ustida arifmetik amallar! date.today() + timedelta(days=30) → 30 kun keyin.",
                xp: 10
              },
              {
                id: 'py21ex2',
                type: 'dragdrop',
                title: '2-MASHQ — strftime format kodlarini 🧩',
                instruction: "Format kodlarini ma'nolari bilan moslashtiring: 1.Yil to'liq, 2.Oy, 3.Kun, 4.Soat (24 format).",
                hint: "%Y = yil, %m = oy, %d = kun, %H = soat",
                items: [
                  "%Y — to'liq yil (masalan: 2024)",
                  "%m — oy (01-12)",
                  "%d — kun (01-31)",
                  "%H — soat (24 format: 00-23)"
                ],
                xp: 10
              },
              {
                id: 'py21ex3',
                type: 'detective',
                title: '3-MASHQ — DATETIME da XATONI toping 🔍',
                instruction: "Quyidagi kodda qaysi qator xato?",
                code: "from datetime import datetime, date, timedelta\n\nd = date(2024, 13, 1)      # [1] YIL, OY, KUN — oy=13??\nt = date.today()           # [2] to'g'ri\nh = datetime.now()         # [3] to'g'ri\ntd = timedelta(days=5)     # [4] to'g'ri",
                options: [
                  "[2] date.today() — noto'g'ri",
                  "[3] datetime.now() — noto'g'ri",
                  "[1] date(2024, 13, 1) — OY 13 bo'la olmasin! Oy 1-12 oralig'ida bo'lishi kerak",
                  "[4] timedelta(days=5) — noto'g'ri"
                ],
                answer: 2,
                explanation: "[1] XATO! Oy 1 dan 12 gacha bo'lishi kerak (13 yo'q!). date(2024, 13, 1) → ValueError beradi."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "datetime moduli nima uchun?",
                options: ["Faqat raqamlar uchun", "SANA va VAQT bilan ishlash (joriy sana, formatlash, farq hisoblash)", "Faqat fayllar uchun", "Faqat rasmlar uchun"],
                answer: 1,
                explanation: "datetime — sana vaqt bilan ishlashning standart moduli."
              },
              {
                question: "Bugungi SANANI olish:",
                options: ["date.today()", "datetime.today()", "date.now()", "datetime.date()"],
                answer: 0,
                explanation: "date.today() — faqat sana (yil/oy/kun). datetime.now() — sana + vaqt (soat/daqiqa/soniya)."
              },
              {
                question: "Sana oralig'i (farq) qo'shish/ayirish uchun:",
                options: ["date_delta()", "timedelta(days=..., hours=...)", "time_diff()", "add_days()"],
                answer: 1,
                explanation: "timedelta = vaqt oralig'i. sana + timedelta(days=7) → bir hafta keyin."
              },
              {
                question: "strftime() — vazifasi:",
                options: ["String → sana", "SANA → FORMATLANGAN STRING (chiroyli chiqish)", "Faqat yilni chiqarish", "Faqat soniya"],
                answer: 1,
                explanation: "strftime = string format time: ob'yektdan formatlangan stringga. %Y, %m, %d ... kodlari bilan."
              },
              {
                question: "strptime('25-12-2024', '%d-%m-%Y') — vazifasi:",
                options: ["String → sana (datetime ob'yekti)", "Sana → string", "Faqat chop qilish", "Fayl yozish"],
                answer: 0,
                explanation: "strptime = string parse time: stringdan (ma'lum formatda) sana ob'yektini hosil qiladi."
              },
              {
                question: "%B va %A format kodlari:",
                options: ["Oy raqami va kun raqami", "To'liq OY NOMI (December) va TO'LIQ HAJTA KUNI NOMI (Monday)", "Soat va daqiqa", "Yil va oy"],
                answer: 1,
                explanation: "%B = oy nomi (May, December), %A = hafta kuni (Monday, Friday)."
              },
              {
                question: "Ikki sana ayirilsa (date1 - date2), natija:",
                options: ["int (kunlar soni)", "timedelta ob'yekti", "string", "xato"],
                answer: 1,
                explanation: "Sanalar ayriboshlash → timedelta. natija.days → kunlar soni."
              },
              {
                question: "Hafta kuni: weekday() — Monday = 0. isoweekday() — Monday = ?",
                options: ["0", "1", "7", "-1"],
                answer: 1,
                explanation: "weekday(): 0=Dush → 6=Yak; isoweekday(): 1=Dush → 7=Yak. Farqini bilishingiz kerak!"
              }
            ]
          }
        },
        {
          title: 'List comprehension',
          duration: 15,
          xp: 25,
          content: {
            intro: "List comprehension — YANGI list yaratish uchun juda SODDA VA QISQA usul. Bir qatorda for + shartli tekshirishni yozish imkoni.",
            sections: [
              {
                title: 'Oddiy comprehension vs for',
                text: "Shablon: [IFODA for ELEM in ROYXAT (if SHART)]",
                code: "sonlar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Eski usul (for): kvadratus\nkv_for = []\nfor s in sonlar:\n    kv_for.append(s * s)\nprint('For usuli:', kv_for)\n\n# Comprehension (bir qator!):\nkv_comp = [s*s for s in sonlar]\nprint('Comp usuli:', kv_comp)\n\n# SHARTLI COMPREHENSION (faqat juftlarni olib kvadrati)\njuft_kv = [s*s for s in sonlar if s % 2 == 0]\nprint('Juftlar kvadrati:', juft_kv)\n\n# String uchun\nmatn = 'Assalomu alaykum'\nharflar = [c.upper() for c in matn if c != ' ']\nprint('Harflar katta:', harflar)",
                codeNote: "[n*n for n in list] — n*n return qiladigan qiymat, for qatori.",
                result: "For usuli: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]\\nComp usuli: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]\\nJuftlar kvadrati: [4, 16, 36, 64, 100]\\nHarflar katta: ['A','S','S','A','L','O','M','U','A','L','A','Y','K','U','M']",
                note: "Murakkab hollarda esa for/appendni tanlash — o'qilishi osonroq bo'lishi mumkin."
              },
              {
                title: 'Nested (ichma-ich), Dict, Set comprehensions',
                text: "Shablon dict: {k: v for ...}; Set: {elem for ...}.",
                code: "# 1) Nested (matritsa → tekis list)\nmatritsa = [[1,2,3], [4,5,6], [7,8,9]]\ntekis = [x for qator in matritsa for x in qator]\nprint('Tekis list:', tekis)\n\n# 2) DICT COMPREHENSION\nraqamlar = [1,2,3,4,5]\nkv_juftlik = {n: n**2 for n in raqamlar}\nprint('Kvadrat dict:', kv_juftlik)\n\n# 3) SET COMPREHENSION\nsoz = 'malumotlar'\nharflar = {c for c in soz}  # set — takror yo'q\nprint('Unikal harflar:', sorted(harflar))\n\n# 4) If-else birga (ternary qism oldida)\nsonlar2 = list(range(1, 11))\njuft_toq = ['juft' if s%2==0 else 'toq' for s in sonlar2]\nprint('Juft/Toq:', juft_toq)",
                codeNote: "If-else: if SHART else QIYMAT — for oldida turadi. Faqat filter (if shart) for ortida.",
                result: "Tekis list: [1,2,3,4,5,6,7,8,9]\\nKvadrat dict: {1:1, 2:4, 3:9, 4:16, 5:25}\\nUnikal harflar: ['a','l','m','o','r','t']\\nJuft/Toq: ['toq','juft','toq',...]",
                note: "Comprehensions Python ning kuchli xususiyati — ko'd qisqartiradi va ko'pincha tezroq ishlaydi."
              }
            ],
            keyPoints: [
              "List: [qiy for x in iterable]\nList + shart: [qiy for x in iterable if shart]\nIf-else ternary: [A if sh else B for x in iterable]",
              "Dict: {kalit: qiymat for ...}",
              "Set: {qiymat for ...}",
              "Murakkabroq → oddiy for ni tanlashni unutmang (o'qilish muhim)"
            ],
            masterXp: 25,
            homework: "1. range(1, 21) dan toq sonlarning kubini comprehension orqali yarating.\n2. words = ['apple', 'python', 'code'] — comprehension orqali uzunliklari dict: {'apple':5, ...}.\n3. names = ['Ali','','Vali','','Ziyoda'] — bo'sh stringlarni olib tashlab (if) listni tozalang.\n4. Matritsa 3x3 yaratish comprehension: [[i+j for j in range(3)] for i in range(0,9,3)].\n5. (Challenge) 1000 gacha Tub sonlarni comprehension bilan toping: [n for n in range(2,1000) if tubmi(n)].",
            summary: "Bugun Comprehensions — list/dict/set ni qisqa usulda yaratishni o'rgandik. Keyingi — Generatorlar!",
            exercises: [
              {
                id: 'py22ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — KUBLARni comprehension bilan 🎯',
                instruction: "range(1, 11) dan [1..10 gacha sonlarning KUBINI (3-daraja) LISTINI comprehension bilan yarating va chop qiling.",
                startCode: "# Bu yerga: kublar = [n**3 for n in range(1, 11)] yozing va print(kublar) ni ishlating\n",
                checks: [
                  { re: '\\[.*\\*\\*\\s*3.*for.*in.*range', msg: "Comprehension: [n**3 for n in range(1, 11)] shaklida yozing" }
                ],
                hint: "[n**3 for n in range(1, 11)] — bir qator, bir daraja **3.",
                explanation: "Comprehension: [IFODA for ELEM in ROYXAT]. n**3 = kubi.",
                xp: 10
              },
              {
                id: 'py22ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Comprehension SHABLONINI yig‘ing 🧩',
                instruction: "List comprehension (faqat JUFT sonlarni olib, 2 barobar oshirish) qismlarini to'g'ri tartibda joylashtiring: [n*2 for n in range(10) if n%2==0].",
                hint: "[ → n*2 → for n in range(10) → if n%2 == 0 → ]",
                items: ['[', 'n * 2', 'for n in range(10)', 'if n % 2 == 0', ']'],
                xp: 10
              },
              {
                id: 'py22ex3',
                type: 'detective',
                title: '3-MASHQ — COMPREHENSION XATOSINI top 🔍',
                instruction: "Quyidagi comprehension kodida qaysi NUQTA noto'g'ri?",
                code: "# Maqsad: 1 dan 20 gacha TOQ sonlarning kvadratlari\n# [1,9,25,81,121,169,225,289,321,361]\n# [n*2 for n in range(1, 21) if n % 2 == 0]  # [X] Bu kodni ko'rib chiqing",
                options: [
                  "Syntaksis xato: n*2 emas, n**2 bo'lishi kerak (kvadrat = daraja 2, emas ko'paytma 2)",
                  "if n%2==0 emas, n%2==1 (TOQ) bo'lishi kerak",
                  "Ikkalasi ham: ham daraja noto'g'ri, ham shart (juft emas, toq kerak)",
                  "Hammasi to'g'ri"
                ],
                answer: 2,
                explanation: "Ikkalasi ham XATO! n*2 → n**2 (kvadrat), va if n%2==0 → n%2==1 (TOQ sonlar). To'g'ri: [n**2 for n in range(1,21) if n%2==1]."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "List comprehension — nima?",
                options: ["Listni uzoq usulda yaratish", "QISQA usulda YANGI list yaratish (bir qatorda for+shart)", "Listni o'chirish", "Faqat chop qilish"],
                answer: 1,
                explanation: "[qiy for elem in ro'yxat -> bir qator, tez, o'qiladigan kod."
              },
              {
                question: "[n*n for n in [1,2,3]] natijasi:",
                options: ["[1,2,3]", "[1,4,9]", "[2,4,6]", "[11, 22, 33]"],
                answer: 1,
                explanation: "Har bir n ni n*n (kvadrat) qiladi. 1,4,9."
              },
              {
                question: "SHARTLI comprehension (faqat juftlar): [n for n in range(10) if ...]:",
                options: ["if n % 2 == 0", "if even(n)", "if n is even", "n == 2"],
                answer: 0,
                explanation: "if n%2==0 → 0 qoldiq → juft."
              },
              {
                question: "DICT COMPREHENSION — qanday belgilar bilan?",
                options: ["[ ]", "{ kalit: qiymat for ... } (jingalak qavs", "( )", "< >"],
                answer: 1,
                explanation: "Dict: {k: v for ...}. Set: {elem for ...}. List: [..]. Generator: (...)."
              },
              {
                question: "If-Else TERNARY qayerda turadi (A if shart else B):",
                options: ["for dan keyin", "for dan OLDIN (if shart else B) qism oldida", "for va if birga", "ohirida"],
                answer: 1,
                explanation: "Ternary: [A if S else B for elem in ...]. Filter if: [elem for ... if S] — for dan keyin turadi."
              },
              {
                question: "Nested (ichma-ich) list comprehension: [[i+j for j in range(3)] for i in ...]",
                options: ["List ichida List → Matritsa yoki tekis listga aylantirish mumkin", "Faqat 1 ta list", "Xato", "Faqat stringlar uchun"],
                answer: 0,
                explanation: "Ikkala for birga → nested comprehension katta listni hosil qiladi."
              },
              {
                question: "SET COMPREHENSION: {x for x in 'salom'} — natija:",
                options: ["['s','a','l','o','m']", "{'s','a','l','o','m'} (set — takror yo'q, tartibsiz)", "Dictionary", "Xato"],
                answer: 1,
                explanation: "Set — takrorlanmas, tartibsiz (takroriy bo'ladigan harflar bir martada."
              },
              {
                question: "Qachon oddiy for/append ni comprehension dan foydalanish kerak:",
                options: ["Har doim comprehension", "Murakkab, ko'p qatorli, o'qilishi qiyin bo'lsa — oddiy for/append", "Faqat sonlar uchun", "Faqat stringlar uchun"],
                answer: 1,
                explanation: "Qoida: comprehension qisqa, o'qilishi oson bo'lsin. Aniqroq keng yozilgan, murakkab bolsa oddiy for."
              }
            ]
          }
        },
        {
          title: 'Generatorlar',
          duration: 15,
          xp: 25,
          content: {
            intro: "Generator — list kabi lekin HAMMASINI BIR ZHOMLADA XOTIRAGA SAQLAMAYDI. Iteratsiya bo'lganda keyingi qiymatni HOSIL QILADI (yield). Juda KATTA RO'YXATLAR UCHUN SAMARALI.",
            sections: [
              {
                title: 'Generator yaratish: yield',
                text: "Oddiy funksiya return bilan tugaydi — generator yield qiymat qaytaradi va keyingi chaqiruvgacha davom ettiriladi.",
                code: "def sonlar_generator(n):\n    \"\"\"1 dan n gacha sonlarni generator orqali beradi\"\"\"\n    i = 1\n    while i <= n:\n        yield i   # return o'rniga YIELD\n        i += 1\n\n# Generator obyektini yaratamiz\ngen = sonlar_generator(5)\nprint('Generator:', gen)  # xotira juda kam!\n\n# Iteratsiya\nfor s in gen:\n    print(s, end=' ')\nprint()\n\n# Qisqa sintaksis: Generator Expression — ( ... ) — list comprehensionga o'xshash lekin ( )\ngen2 = (x*x for x in range(1, 6))\nprint('Gen expression:')\nfor kv in gen2:\n    print(kv, end=' ')",
                codeNote: "yield — keyingi qiymatni qaytaradi, funksiya holati saqlanadi (to'xtagan joyidan davom etadi).",
                result: "Generator: <generator object sonlar_generator at ...>\\n1 2 3 4 5 \\nGen expression:\\n1 4 9 16 25",
                note: "List vs Generator: list(x for x in range(10_000_000)) ko'p xotira, generator oz xotira, lekin bir marta iteratsiya."
              },
              {
                title: 'Generator vs List — xotira farqi',
                text: "Katta hajmlar uchun generatorni ishlatish muhim.",
                code: "# Juda katta diapazon 1 million — LIST XOTIRA OLADI, GENERATOR XOTIRA OLMASLIGI ANIQLANADI\nimport sys\n\n# 1M list\nlst = list(range(1_000_000))\n# 1M generator\ngen = (x for x in range(1_000_000))\n\nlst_size = sys.getsizeof(lst)\ngen_size = sys.getsizeof(gen)\nprint(f'LIST (1M) xotira: {lst_size:,} bayt')\nprint(f'GEN (1M)  xotira: {gen_size:,} bayt')\nprint(f'LIST {lst_size / gen_size:.0f} marta ko'proq xotira ishlatadi!')\n\nprint('\\n⚠️ Generator BIR MARTA ishlaydi:')\ng = (x for x in [1,2,3])\nprint('1-urindi:', list(g))\nprint('2-urindi:', list(g))  # BO'SH!",
                codeNote: "sys.getsizeof() — ob'yekt xotira hajmi. Generatorsiz katta fayllarni qatorma-qator o'qishda ham ishlatiladi.",
                result: "LIST (1M) xotira: 8,000,056 bayt\\nGEN (1M)  xotira: 200 bayt\\nLIST 40,000 marta ko'proq xotira ishlatadi!",
                note: "Generatorni qayta ishlatib bo'lmaydi! Qayta ishlatish kerak bo'lsa — yangi generator yaratish kerak."
              }
            ],
            keyPoints: [
              "yield kalit so'zi generator funksiyada",
              "Generator — lazimbora qiymatni hosil qiladi (xotira tejaydi)",
              "Generator expression: (x for x in ...)",
              "Bir marta iteratsiya, qayta ishlatish bo'lmaydi",
              "Katta fayllar, cheksiz ketma-ketliklar uchun juda qulay"
            ],
            masterXp: 25,
            homework: "1. Fibonaccchi generator yarating: 1,1,2,3,5,8... (n ta).\n2. range(100) ni generator expression qilib, sum() ni qo'llang.\n3. Cheksiz juft sonlar generator yarating (while True + yield; break bilan cheklang).\n4. (Challenge) Katta faylni qatorma-qator generator orqali o'qing va belgilangan so'z necha marta qatnashganini hisoblang.",
            summary: "Bugun Generatorlarni o'rgandik (yield, expression, xotira tejash). Keyingi — Decoratorlar!",
            exercises: [
              {
                id: 'py23ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Yield bilan juft sonlar ⏳',
                instruction: "'juftlar_g(n)' generator yozing: 2 dan n gacha JUFT sonlarni yield orqali qaytarsin. range(2, n+1, 2) orqali.",
                startCode: "def juftlar_g(n):\n    # Bu yerga: for i in range(2, n+1, 2): yield i ni yozing\n    pass\n\n# Sinash:\nfor s in juftlar_g(10):\n    print(s, end=' ')",
                checks: [
                  { re: 'yield\\s+i', msg: "yield i ni ishlating" }
                ],
                hint: "for i in range(2, n+1, 2): yield i — keyingi juft sonni beradi.",
                explanation: "Yield — return o'rniga ishlatiladi, funksiya holati saqlanib keyingi chaqiruvda davom etadi (generator!).",
                xp: 10
              },
              {
                id: 'py23ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Generator Expression 🧩',
                instruction: "Oddiy list comprehension va generator expression ni ajratib, tartibga soling: 1) List [kvadrat], 2) Generator (kvadrat).",
                hint: "List = [ ], Generator = ( )",
                items: [
                  "[n*n for n in range(5)] — LIST comprehension (to'liq list xotirada)",
                  "(n*n for n in range(5)) — GENERATOR expression (qisqacha, xotira tejovchi)"
                ],
                xp: 10
              },
              {
                id: 'py23ex3',
                type: 'detective',
                title: '3-MASHQ — Generator XATOSINI top 🔍',
                instruction: "Quyidagi generator kodida qaysi nuqta noto'g'ri?",
                code: "def oddiy():\n    yield 1\n    yield 2\n    yield 3\n\ng = oddiy()\nprint('1-marta:', list(g))   # [1,2,3] — to'la\nprint('2-marta:', list(g))   # [ ] — nima uchun BO'SH? — [X]",
                options: [
                  "list(g) noto'g'ri ishlatilgan",
                  "Generator BIR MARTA ishlaydi! Keyingi urinish bo'sh — yangi yaratish kerak",
                  "yield kamroq",
                  "Xatolik yo'q"
                ],
                answer: 1,
                explanation: "Generatorlar BIR MARTA iteratsiya qilinadi! Keyingi marta bo'sh bo'ladi. Qayta ishlatish kerak bo'lsa yangi g = oddiy() yaratiladi."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Generator nimada listdan farqli?",
                options: ["Hammasi bir xil", "Generator barchasini bir zum xotiraga olmasligi (lazimbora hosil qiladi — xotira tejaydi)", "Generator tezroq ishlaydi", "Listga ko'ra ko'proq xotira sarflaydi"],
                answer: 1,
                explanation: "Generator = keng ishlatiladigan, cheksiz yoki juda katta ro'yxatlar uchun ideal. Xotira juda kam talab qiladi."
              },
              {
                question: "Generator funksiyada RETURN o'rniga ishlatiladigan kalit so'z:",
                options: ["generate", "yield", "output", "emit"],
                answer: 1,
                explanation: "yield — keyingi qiymatni beradi, keyin funksiya holati saqlanadi va keyingi next() chaqiruvda DAVOM ETILADI."
              },
              {
                question: "Generator expression qanday belgilar bilan?",
                options: ["[ ]", "( )", "{ }", "< >"],
                answer: 1,
                explanation: "List = [n for n in ...], Generator = (n for n in ...). Ikkalasi comprehension sintaksisi, faqat qavs farq qiladi."
              },
              {
                question: "Generatorni necha marta iteratsiya qilish mumkin?",
                options: ["Cheksiz", "FAQAT BIR MARTA! (keyingi bo'sh)", "Ikki marta", "5 marta"],
                answer: 1,
                explanation: "Yagona iteratsiyali. Oxiriga yetganda keyingi next StopIteration beradi."
              },
              {
                question: "1M elementlik list vs generator — xotira sarfi:",
                options: ["Bir xil", "Generator kamroq xotira (o'nlab ming barobar!)", "List kamroq xotira", "Xotira farqi yo'q"],
                answer: 1,
                explanation: "Generator 200 bayt atrofida, List millionlab (o'nlab MB). Juda katta farq!"
              },
              {
                question: "sum( (x for x in range(100)) ) — bu:",
                options: ["List", "Generatorni to'g'ridan sum() ga berish (qavs kerak emas yoki bo'lishi mumkin)", "Faqat raqam", "Xato"],
                answer: 1,
                explanation: "Funksiya argumenti sifatida generatorni () qavsiz yozish mumkin: sum(x for x in ...). Yoki ((x for x in ...))."
              },
              {
                question: "Cheksiz ketma-ketlik (masalan, 2,4,6... cheksiz juft sonlar) uchun:",
                options: ["List", "Generator (while True + yield — cheksiz iteratsiya mumkin)", "Ruxsat etilmaydi", "Faqat raqamlar"],
                answer: 1,
                explanation: "Generator = cheksiz ketma-ketlik! while True: yield ... — qancha kelsa shuncha o'qiladi."
              },
              {
                question: "next(generator) — oxiriga yetganda qaysi xato?",
                options: ["ValueError", "StopIteration", "TypeError", "IndexError"],
                answer: 1,
                explanation: "StopIteration — generator tugadi. For tsikli avtomatik ushlaydi va to'xtaydi."
              }
            ]
          }
        },
        {
          title: 'Decoratorlar',
          duration: 20,
          xp: 30,
          content: {
            intro: "Decorator — BOSHQA FUNKSIYANI O'ZINDA QAMLAB, UNING XARAKATINI O'ZGARTIRADI. @decorator_nomi sintaksisi. Logging, cache, auth va boshqa ko'p narsalar uchun keng ishlatiladi.",
            sections: [
              {
                title: "Decorator asos: funksiya funksiya qaytarishi",
                text: "Python da funksiya ham bir ob'yekt. Uni boshqa funksiyaga argument berish, undan funksiya qaytarish mumkin.",
                code: "# Oddiy decorator (asosiy tushuncha)\ndef decorator(fn):\n    def ichki(*args, **kwargs):\n        print('▶️ Funksiya boshlandi:', fn.__name__)\n        natija = fn(*args, **kwargs)  # ASL funksiyani chaqirish\n        print('✅ Funksiya tugadi:', fn.__name__)\n        return natija\n    return ichki\n\n# Qo'llash 1-usul: qo'lda\ndef yig(a, b):\n    return a + b\nyig = decorator(yig)\nprint('Natija:', yig(3, 5))\n\nprint('\\n--- @ sintaksisi bilan ---')\n# 2-usul: @decorator (qulay!)\n@decorator\ndef kop(a, b):\n    return a * b\n\nprint('Natija:', kop(4, 6))",
                codeNote: "Decorator @ fn ni olib uni ichki funksiya bilan ALMASHTIRADI. *args/**kwargs — barcha turdagi argumentlarni o'tkazish.",
                result: "▶️ Funksiya boshlandi: yig\\n✅ Funksiya tugadi: yig\\nNatija: 8\\n\\n--- @ sintaksisi bilan ---\\n▶️ Funksiya boshlandi: kop\\n✅ Funksiya tugadi: kop\\nNatija: 24",
                note: "functools.wraps(fn) ishlatmasangiz, __name__ kabi meta ma'lumotlar yo'qoladi."
              },
              {
                title: 'Amaliy decoratorlar: vaqt o‘lchash',
                text: "Ko'p ishlatiladigan decoratorlardan biri — funksiya necha soniya ishlashini o'lchash.",
                code: "import time\nimport functools\n\ndef vaqt_olchash(fn):\n    @functools.wraps(fn)  # meta info saqlash uchun\n    def ichki(*args, **kwargs):\n        t0 = time.time()\n        result = fn(*args, **kwargs)\n        t1 = time.time()\n        ms = (t1 - t0) * 1000\n        print(f'⏱️ {fn.__name__}: {ms:.3f} ms')\n        return result\n    return ichki\n\n@vaqt_olchash\ndef sekin_funksiya():\n    time.sleep(0.1)  # 100 ms kut\n    return 'Done'\n\n@vaqt_olchash\ndef uzun_hisob(n):\n    s = 0\n    for i in range(n):\n        s += i * i\n    return s\n\nprint(sekin_funksiya())\nprint(uzun_hisob(1_000_000))",
                codeNote: "time.sleep() — kodni N soniya kutish (kutilishni simulyatsiya qiladi).",
                result: "⏱️ sekin_funksiya: 100.123 ms\\nDone\\n⏱️ uzun_hisob: 45.678 ms\\n...",
                note: "functools.wraps — decorator ishlaganda asl funksiya haqidagi (name, docstring) ma'lumotlarni saqlab qoladi."
              },
              {
                title: 'Parametrli decorator',
                text: "Decorator'ga argument berish mumkin — UCH darajali funksiya.",
                code: "def qayta_sinash(necha_marta=3):\n    def decorator(fn):\n        def ichki(*args, **kwargs):\n            natija = None\n            for i in range(necha_marta):\n                try:\n                    natija = fn(*args, **kwargs)\n                    print(f'✅ {fn.__name__} {i+1}-marta muvaffaqiyatli!')\n                    return natija\n                except Exception as e:\n                    print(f'❌ {i+1}-urinish: {e}')\n            raise Exception(f'Barcha {necha_marta} marta sinash muvaffaqiyatsiz!')\n        return ichki\n    return decorator\n\n@qayta_sinash(necha_marta=2)\ndef nosoz_funksiya():\n    import random\n    if random.random() < 0.3:\n        raise ValueError('Xatolik yuz berdi!')\n    return 'Salom!'\n\n# Ko'p marta ishga tushurib ko'ring!\ntry:\n    print(nosoz_funksiya())\nexcept Exception as e:\n    print('Xulosa:', e)",
                codeNote: "3 qavat: parametr → decorator → ichki funksiyasi.",
                result: "✅ nosoz_funksiya 1-marta muvaffaqiyatli!\\nSalom!",
                note: "@property, @staticmethod, @classmethod — built-in decoratorlar (class da ishlatiladi)."
              }
            ],
            keyPoints: [
              "Decorator = funksiya funksiya olib, funksiya qaytaradi",
              "@decorator sintaksisi — qulay",
              "*args, **kwargs — har qanday argumentlarni o'tkazish",
              "functools.wraps — fn.__name__ saqlash uchun kerak",
              "Amaliyot: logging, caching, auth, retry, timing",
              "Parametrli decorator: 3 darajali funksiya"
            ],
            masterXp: 30,
            homework: "1. Funksiya kirgan argumentlarni va qaytgan natijani chop qiluvchi 'logger' decorator yozing.\n2. Funksiya 100 dan ko'p vaqt olsa ogohlantiruvchi decorator.\n3. 'login_required' decorator yarating: user_login = True bo'lsa fn ishlasin, bo'lmasa 'Kirish talab etiladi'.\n4. functools.lru_cache — built-in memoization decorator. Fibonacci uchun ishlatib ko'ring (tezlikni hisoblang).\n5. (Challenge) Parametrli decorator: @repeat(n) — funksiyani n marta ishga tushirsin.",
            summary: "Bugun Decoratorlarni o'rgandik — asos, @, vaqt o'lchash, parametrli. Keyingi — Iteratorlar!",
            exercises: [
              {
                id: 'py24ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Oddiy decorator yozish ✨',
                instruction: "'salomla' degan decorator yozing: u ichki funksiya oldida 'Salom!' va keyin 'Hayr!' deb chop qilsin va asl funksiyani chaqirsin. Keyin @salomla bilan dekoratsiyalangan 'ism_yoz(ism)' funksiyasini chaqiring.",
                startCode: "def salomla(fn):\n    def ichki(*args, **kwargs):\n        # Bu yerga: print(\"Salom!\")\n        natija = fn(*args, **kwargs)\n        # Bu yerga: print(\"Hayr!\")\n        return natija\n    return ichki\n\n@salomla\ndef ism_yoz(ism):\n    print(f\"Men {ism}man\")\n\nism_yoz(\"Oybek\")",
                checks: [
                  { re: 'print\\s*\\(\\s*["\']Salom!["\']\\s*\\)', msg: "print(\"Salom!\") ni qo'shing" },
                  { re: 'print\\s*\\(\\s*["\']Hayr!["\']\\s*\\)', msg: "print(\"Hayr!\") ni qo'shing" }
                ],
                hint: "Avval 'Salom!' ni chop, so'ng asl funksiyani chaqir, oxirida 'Hayr!' ni chop.",
                explanation: "Decorator: ichki(...) oldidan va keyingi kod qo'shib, fn ni o'z ichiga oladi. Bu dekoratsiya.",
                xp: 10
              },
              {
                id: 'py24ex2',
                type: 'dragdrop',
                title: '2-MASHQ — @ sintaksisi tartibi 🧩',
                instruction: "Quyidagi decorator ishlatish qismlarini TO'G'RI TARTIBDA joylashtiring: decorator yarat → @ qo'llash → funksiya yozish → chaqirish.",
                hint: "def decorator → @decorator → def funksiya → chaqirish",
                items: [
                  "def salomla(fn):\\n    def ichki(): print('Hi'); fn(); print('Bye')\\n    return ichki",
                  "@salomla",
                  "def ismi(): print('Ali')",
                  "ismi()"
                ],
                xp: 10
              },
              {
                id: 'py24ex3',
                type: 'detective',
                title: '3-MASHQ — Decorator XATOSINI top 🔍',
                instruction: "Quyidagi decorator kodida qaysi qator XATO?",
                code: "def decorator(fn):\n    def ichki(*args, **kwargs):      # [1] to'g'ri\n        natija = fn(*args, **kwargs)  # [2] ASL funksiyani chaqirish — to'g'ri\n        return ichki                  # [X] Bu yerda NIMA KEMAYAPTI? → XATO\n",
                options: [
                  "[1] *args noto'g'ri",
                  "[2] fn chaqirish — xato",
                  "return ichki emas, return natija BO'LISHI KERAK! (asl funksiyaning natijasi qaytarilishi shart)",
                  "Hammasi to'g'ri"
                ],
                answer: 2,
                explanation: "[X] qatorda return ichki emas — return natija bo'lishi kerak! (asl funksiyaning qiymati dekorator orqali tashqariga chiqishi kerak)."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Decorator nima uchun ishlatiladi?",
                options: ["Faqat rasmlar uchun", "Boshqa FUNKSIYANI QAMLAB, uning xatti-harakatini O'ZGARTIRADI (oldi-ortidan qo'shimcha ishlar qiladi)", "Faqat sonlar uchun", "Faqat fayllar uchun"],
                answer: 1,
                explanation: "Decorator = wrapper (qamlovchi). Kodni qayta yozmasdan yangi xususiyat qo'shadi: logging, timing, auth va boshqalar."
              },
              {
                question: "Decorator qo'llash sintaksisi:",
                options: ["$decorator", "@decorator_nomi (funksiya tepasida)", "#decorator", "!decorator"],
                answer: 1,
                explanation: "@sintaksisi: @decorator def fn(): — 'syntactic sugar'."
              },
              {
                question: "*args va **kwargs — decorator ichida nima uchun?",
                options: ["Faqat stringlar uchun", "HAR QANDAY argumentlarni (namumkin, kalit so'zli) o'tkazish uchun", "Faqat sonlar uchun", "Faqat list uchun"],
                answer: 1,
                explanation: "*args — turli sonli argumentlar, **kwargs — kalit so'zli. Barcha variantlar uchun."
              },
              {
                question: "functools.wraps(fn) — vazifasi:",
                options: ["Faqat tezlashtirish", "Asl funksiyaning meta ma'lumotlarini (name, docstring) SAQLAB QOLADI (yo'qolmasligi uchun)", "Kodni tozalash", "Fayl yozish"],
                answer: 1,
                explanation: "@functools.wraps(fn) — ichki() fn ning __name__ / __doc__ sini oladi, yo'qolmasligi uchun."
              },
              {
                question: "Parametrli decorator (@dec(n=3)) nech qavatli funksiya talab qiladi?",
                options: ["1 daraja", "2 daraja", "3 daraja (parametr → decorator → ichki)", "4 daraja"],
                answer: 2,
                explanation: "Parametr → decorator → ichki: 3 daraja! def p(n): def d(fn): def i(): ... i ni return"
              },
              {
                question: "Quyidagilardan qaysilari built-in decorator:",
                options: ["A:@staticmethod B:@classmethod C:@property", "Faqat A", "Faqat B", "Barchasi (A,B,C — class built-in decoratorlar)"],
                answer: 3,
                explanation: "Hammasi class uchun decorator: @staticmethod, @classmethod, @property."
              },
              {
                question: "Decoratorni qo'lda ishlatish ( @ siz):",
                options: ["fn = decorator(fn)", "fn.decorate()", "apply(decorator, fn)", "imposible"],
                answer: 0,
                explanation: "@decorator -> fn = decorator(fn) degani. Qo'lda shunday yozsa ham bo'ladi."
              },
              {
                question: "Amaliyotda decorator qayerda ishlatiladi?",
                options: ["Logging (qaysi funksiya ishga tushganini eslash)", "Vaqt o'lchash (necha ms ishlaganini)", "Kesh (cache), autentifikatsiya (login_required)", "BARCHASI to'g'ri!"],
                answer: 3,
                explanation: "Hammasi decoratorning keng qo'llanish sohalari."
              }
            ]
          }
        },
        {
          title: 'Iteratorlar',
          duration: 15,
          xp: 25,
          content: {
            intro: "Iterator — OB'YEKT bo'lib, elementlarni AYNAN BITTALAB qaytarishi mumkin. __iter__ va __next__ dunder metodlari bo'lishi kerak. Generators ham iteratorlardir.",
            sections: [
              {
                title: 'iter() va next() — asos',
                text: "iter(iterable) — iterator obyektini yaratadi; next(iterator) — keyingi elementni beradi, oxirida StopIteration.",
                code: "mevalar = ['olma', 'banan', 'gilos']\n\n# 1) Iteratorsiz — oddiy for (orqa tomonda iterator ishlaydi)\nprint('Oddiy for:')\nfor m in mevalar:\n    print(m, end=' ')\nprint()\n\n# 2) Iterator qo'lda\nit = iter(mevalar)\nprint('\\nQo‘lda next():')\nprint(next(it))\nprint(next(it))\nprint(next(it))\n# Keyingi next() — StopIteration xatosi!\ntry:\n    next(it)\nexcept StopIteration:\n    print('✅ Oxiriga yetdik! StopIteration xatosi ushlandi.')\n\n# 3) enum bilan ham\nfor i, m in enumerate(mevalar):\n    print(f'{i}: {m}', end=' | ')",
                codeNote: "Iterable (list/str/set/tuple/dict) = iter() qilinganda iterator qaytaradigan narsa. Iterator = next() chaqirilganda keyingi qiymatni beradigan ob'yekt.",
                result: "Oddiy for:\\nolma banan gilos \\n\\nQo‘lda next():\\nolma\\nbanan\\ngilos\\n✅ Oxiriga yetdik! StopIteration xatosi ushlandi.\\n0: olma | 1: banan | 2: gilos |",
                note: "for tsikli — iter() chaqirib next() ni StopIteration gacha marta qilib ishlatadi."
              },
              {
                title: 'O‘z Iteratoringizni yarating (__iter__, __next__)',
                text: "Class da __iter__ va __next__ yozilsa, o'zingiz iterator ob'yekt yaratishingiz mumkin.",
                code: "class JuftSonlar:\n    \"\"\"1 dan n gacha juft sonlar iterator\"\"\"\n    def __init__(self, n):\n        self.n = n\n        self.hosil = 0  # hozirgi qiymat\n\n    def __iter__(self):\n        return self  # o'zi iterator\n\n    def __next__(self):\n        self.hosil += 2\n        if self.hosil > self.n:\n            raise StopIteration\n        return self.hosil\n\nprint('1 dan 10 gacha juft sonlar:')\nfor s in JuftSonlar(10):\n    print(s, end=' ')",
                codeNote: "StopIteration — iterator tugashini bildiruvchi xato.",
                result: "1 dan 10 gacha juft sonlar:\\n2 4 6 8 10",
                note: "Ko'p hollarda generator (yield) yozish osonroq. Ammo o'z class iteratorsini tushunish muhim."
              }
            ],
            keyPoints: [
              "Iterable = iter() qilinadigan (list, str, tuple, dict...) — qiymatlar ro'yxati",
              "Iterator = next() bilan bittara olinadigan ob'yekt (iter() hosil qiladi)",
              "for: iter() → next() → StopIteration gacha",
              "Iterator class: __iter__ return self, __next__ — keyingi qiymat, tugaganda StopIteration",
              "Generator (yield) — iterator yaratishning qulay yo'li"
            ],
            masterXp: 25,
            homework: "1. 'Assalomu alaykum' so'zini iter() + next() bilan har bir harfni alohida chop qiling.\n2. 1 dan N gacha Toq sonlarni o'z iterator class orqali yarating.\n3. 1 dan N gacha Fibonacci iterator class yozing.\n4. (Challenge) Zip funksiyasini o'zingiz iterator orqali yarating: zip(list1, list2) → juftliklar.",
            summary: "Bugun Iteratorlarni o'rgandik: iter/next, Iterator class (iter/next dunder), generator bilan aloqasi. Keyingi — RegEx!",
            exercises: [
              {
                id: 'py25ex1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — next() bilan itaratsiya ➡️',
                instruction: "Mevalar ro'yxatidan iter() orqali iterator yaratib, 3 marta next() qilib, har bir mevani chop qiling. Try/except bilan StopIterationni ushlang.",
                startCode: "mevalar = ['olma', 'banan', 'gilos']\nit = iter(mevalar)\n\n# Bu yerga:\n# print(next(it))  \n# print(next(it))\n# print(next(it))\n# Va keyingi next() ni try/except StopIteration bilan o'rab xabar chop qiling\n",
                checks: [
                  { re: 'next\\s*\\(\\s*it\\s*\\)', msg: "next(it) ni kamida 3 marta ishlating" },
                  { re: 'except\\s+StopIteration\\s*:', msg: "except StopIteration: qo'shingsh" }
                ],
                hint: "iter() → iterator, next() → keyingi element, tugaganda StopIteration.",
                explanation: "iter(iterable) → iterator obyekt, next(iterator) → keyingi qiymatni beradi. for ni orqa tomonda shu ishlaydi!",
                xp: 10
              },
              {
                id: 'py25ex2',
                type: 'dragdrop',
                title: '2-MASHQ — Iterator class qismlarini 🧩',
                instruction: "O'z Iterator class yaratish qismlarini to'g'ri tartibga joylashtiring: class → __init__ → __iter__ return self → __next__ qiymat/StopIteration.",
                hint: "class → __init__ → __iter__ → __next__",
                items: [
                  "class JuftlarIterator:",
                  "    def __init__(self, n): self.n = n; self.hozir = 0",
                  "    def __iter__(self): return self",
                  "    def __next__(self):\\n        self.hozir +=2\\n        if self.hozir > self.n: raise StopIteration\\n        return self.hozir"
                ],
                xp: 10
              },
              {
                id: 'py25ex3',
                type: 'detective',
                title: '3-MASHQ — Iterator XATOSINI top 🔍',
                instruction: "Quyidagi o'z Iterator class kodida qaysi qator XATO?",
                code: "class MeningIt:\n    def __init__(self): self.i = 0\n\n    def __iter__(self):\n        return self            # [1] to'g'ri\n\n    def __next__(self):\n        self.i += 1\n        if self.i > 3:\n            raise StopIteration # [2] to'g'ri\n        return self.i\n        # [3] — __iter__ yo'q emas! LEKIN __next__ da STOP qilingandan keyin qayta ishlatolmaydimi? — Xato yo'q.\n        # [X] ASL XATO: iter() berilsa ham ITERABLE bo'lishi uchun __iter__ kerak, lekin yana — HAMMASI TO'G'RImi?",
                options: [
                  "[1] return self — noto'g'ri",
                  "[2] raise StopIteration — noto'g'ri",
                  "HAMMASI TO'G'RI! Keyingi savol: ITERABLE nima? Iterable = __iter__ bor → iterator qaytaradi. Iterator esa __next__ bor! Ikkalasi to'g'ri joylashgan.",
                  "Xato — __next__ da return self.i noto'g'ri, return self.i emas, print(self.i) kerak"
                ],
                answer: 2,
                explanation: "To'g'ri tushunish: Iterable (__iter__ bor, list kabi) → iter() berganida Iterator (__next__ bor) qaytaradi. Bu kod Iterator class (ikkala dunder bor)."
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "ITERABLE va ITERATOR farq:",
                options: ["Bir xil", "ITERABLE: __iter__ bor (list, dict, str); ITERATOR: __next__ bor (next() bilan qiymat beradi)", "Iterator kattaroq", "Xatolik mavjud emas"],
                answer: 1,
                explanation: "Iterable = iter() qilinganda iterator hosil qiladi (list, str, tuple ...). Iterator = next() bilan bittara olinadigan ob'yekt."
              },
              {
                question: "iter([1,2,3]) — nima qaytaradi?",
                options: ["Listning o'zi", "Listning ITERATOR obyektini", "String", "Raqam"],
                answer: 1,
                explanation: "iter(iterable) → Iterator obyekt. next() bilan ishlatilinadi."
              },
              {
                question: "next(iterator) oxirida qaysi xato?",
                options: ["ValueError", "StopIteration", "TypeError", "IndexError"],
                answer: 1,
                explanation: "next() tugaganda StopIteration — for tsikli avtomatik ushlaydi."
              },
              {
                question: "For tsikl orqa tomonda qanday ishlaydi?",
                options: ["Tasodifiy ishlaydi", "iter() → iterator → next() → StopIteration gacha", "Oddiy while", "Faqat stringlar uchun"],
                answer: 1,
                explanation: "for: iter(ro'yxat) → iterator → next() ni StopIteration ushlanmagunga qadar takrorlaydi."
              },
              {
                question: "O'z Iteratoringizni yaratish uchun 2 ta dunder:",
                options: ["__add__ va __sub__", "__iter__ (return self) va __next__ (qiymat/StopIteration)", "__len__ va __str__", "__eq__ va __hash__"],
                answer: 1,
                explanation: "__iter__ → o'zini (iterator) return; __next__ → keyingi qiymat, tugaganda StopIteration."
              },
              {
                question: "Generatorlar (yield) — nima?",
                options: ["Iterator emas", "Iterator YARATISHNING QULAY USULI (avtomatik iter/next dunder bilan)", "Faqat string uchun", "Faqat raqam uchun"],
                answer: 1,
                explanation: "Generator → Iterator. Yordamchi: avtomatik __iter__ va __next__ hosil bo'ladi."
              },
              {
                question: "Enumerate(mevalar) — nima:",
                options: ["Oddiy list", "Iterator orqali INDEX + qiymat (tuple) beradi (for i, m in enumerate(...))", "Faqat sonlar", "Faqat dict"],
                answer: 1,
                explanation: "enumerate() → iterator: (0, elem0), (1, elem1) ... tartib raqami bilan."
              },
              {
                question: "Qaysi to'g'ri?",
                options: ["Har bir iterator bir martalik", "Har bir iteratorni qayta ishlatish mumkin", "Iterator xotira ko'p sarflaydi", "Iterator listdan tezroq emas"],
                answer: 0,
                explanation: "Iterator (ham generator) BIR MARTA iteratsiya: StopIteration dan keyin yana bo'sh."
              }
            ]
          }
        },
        {
          title: 'RegEx',
          duration: 25,
          xp: 35,
          content: {
            intro: "RegEx (Regular Expressions) — MATN ICHIDA NAQSH TOPISH uchun kuchli til. Email, telefon raqam, URL va boshqa ko'plab naqshlarni tezda topish, almashtirish yoki ajratib olish mumkin. Python da re moduli orqali ishlatiladi.",
            sections: [
              {
                title: 're moduli — asoslar',
                text: "re moduli yordamida RegEx ishlatamiz. Eng ko'p ishlatiladigan funksiyalar:\n\n• re.search() — birinchi moslikni topadi\n• re.findall() — barcha mosliklarni list qaytaradi\n• re.match() — boshidan boshlab tekshiradi\n• re.sub() — almashtirish\n• re.split() — bo'lib tashlash",
                code: "import re\n\nmatn = 'Men 2005-yilda, 18 yoshida Toshkentga keldim. Telefon: +998-90-123-45-67'\n\n# 1) search — BIRINCHI moslik\nson = re.search(r'\\d+', matn)\nprint('Birinchi son:', son.group() if son else 'Topilmadi')\n\n# 2) findall — BARCHA mosliklar list\nraqamlar = re.findall(r'\\d+', matn)\nprint('Barcha sonlar:', raqamlar)\n\n# 3) sub — almashtirish\ntoza = re.sub(r'\\d', '*', matn)\nprint('Sonlar yulduz bilan:', toza[:50] + '...')",
                codeNote: "r'...' — raw string. \\ (backslash) RegEx da juda ko'p ishlatiladi, shuning uchun raw string ishlatish kerak (\\ escape qilinmasin).",
                result: "Birinchi son: 2005\\nBarcha sonlar: ['2005', '18', '998', '90', '123', '45', '67']\\nSonlar yulduz bilan: Men ****-yilda, ** yoshida Toshkentga kel...",
                note: "RegEx da \\d — raqam, \\w — harf/son/_ , \\s — bo'sh joy."
              },
              {
                title: 'Metakarakterlar (Pattern elementlari)',
                text: "Eng ko'p ishlatiladigan RegEx elementlari:\n\n• `.` — istalgan BELGI (newline dan tashqari)\n• `\\d` — raqam (0-9)  |  \\D — raqam emas\n• `\\w` — word char (a-z, A-Z, 0-9, _)  |  \\W — undan tashqari\n• `\\s` — bo'sh joy (space, tab, \\n)  |  \\S — bo'sh joy emas\n• `^` — STRING BOSHI\n• `$` — STRING OXIRI\n• `[abc]` — a, b yoki c (biror biri)\n• `[^abc]` — a, b, c dan BOSHQASI\n• `a|b` — a YOKI b",
                code: "import re\n\nmatn = 'ali123@mail.uz, Vali_45@gmail.com, @nodir'\n\n# Email naqshi (oddiy)\nemail_pattern = r'[\\w.-]+@[\\w.-]+\\.\\w+'\nemaillar = re.findall(email_pattern, matn)\nprint('Topilgan emaillar:', emaillar)\n\n# Faqat harflar (^ boshi = inkor)\nfaqat_harflar = re.findall(r'[a-zA-Z]+', matn)\nprint('Faqat harflar:', faqat_harflar)\n\n# ^ va $ (to'liq moslik)\nprint('\\nTest ^, $:')\nprint(re.match(r'^\\d+$', '12345'))  # to'liq son\nprint(re.match(r'^\\d+$', '12ab45'))  # aralash",
                codeNote: "[a-z] — diapazon; [\\w.-]+ — @ dan oldingi qism; \\.\\w+ — domen .uz, .com",
                result: "Topilgan emaillar: ['ali123@mail.uz', 'Vali_45@gmail.com']\\nFaqat harflar: ['ali', 'mail', 'uz', 'Vali', 'gmail', 'com', 'nodir']\\n\\nTest ^, $:\\n<re.Match object; span=(0, 5), match='12345'>\\nNone",
                note: "^\\d+$ — BUTUN string FAQAT raqamlardan iborat bo'lishi kerak."
              },
              {
                title: 'Quantifierlar (necha marta)',
                text: "Quantifier — element NECHA MARTA takrorlanishi:\n\n• `*` — 0 yoki undan ko'p\n• `+` — 1 yoki undan ko'p (KAMIDA BOR)\n• `?` — 0 yoki 1 marta (ixtiyoriy)\n• `{n}` — aniq N marta\n• `{n,m}` — n dan m gacha\n• `{n,}` — n dan ko'p",
                code: "import re\n\nsozlar = ['color', 'colour', 'coloor', 'colooor', 'ct', 'cat', 'caat']\n\n# ? — 0 yoki 1 (u ixtiyoriy: color/colour ikkalasi ham)\npat1 = r'colou?r'\nprint('? pattern (colou?r):', [s for s in sozlar if re.fullmatch(pat1, s)])\n\n# * — 0+ (o har biri 0 yoki ko'p)\npat2 = r'co*lor'\nprint('* pattern (co*lor):', [s for s in sozlar if re.fullmatch(pat2, s)])\n\n# + — 1+ (a kamida 1 ta)\npat3 = r'ca+t'\nprint('+ pattern (ca+t):', [s for s in sozlar if re.fullmatch(pat3, s)])\n\n# {2,4} — 2, 3, 4 marta o\npat4 = r'colo{2,4}r'\nprint('{2,4} pattern (colo{2,4}r):', [s for s in sozlar if re.fullmatch(pat4, s)])",
                codeNote: "fullmatch() — BUTUN string mos kelishi kerak.",
                result: "? pattern (colou?r): ['color', 'colour']\\n* pattern (co*lor): ['color', 'colour', 'coloor', 'colooor']\\n+ pattern (ca+t): ['cat', 'caat']\\n{2,4} pattern (colo{2,4}r): ['coloor', 'colooor']",
                note: "Greedy va non-greedy: .* (greedy) eng kopesini, .*? (lazy) eng kichigini oladi."
              },
              {
                title: 'Groups (guruhlash) va ()',
                text: "() — guruh yaratish. Bu orqali moslikning BA'ZI QISMLARINI AJRATIB OLISH mumkin.",
                code: "import re\n\nmatn = 'Bugun sana: 19.09.2026, soat: 14:35. Keyingi sana: 25.12.2026'\n\n# Sana naqshi, guruh bilan: (kun).(oy).(yil)\nsana_pat = r'(\\d{2})\\.(\\d{2})\\.(\\d{4})'\n\n# findall — guruh bo'lsa tuple qaytaradi\nsanalar = re.findall(sana_pat, matn)\nprint('Sanalar (tuple):', sanalar)\n\n# search bilan group()\nm = re.search(sana_pat, matn)\nif m:\n    print(f'\\nBirinchi sana: {m.group(0)}')  # to'liq moslik\n    print(f'Kun:    {m.group(1)}')\n    print(f'Oy:     {m.group(2)}')\n    print(f'Yil:    {m.group(3)}')\n\n# Named groups: (?P<nom>...)\nisimli = r'(?P<kun>\\d{2})\\.(?P<oy>\\d{2})\\.(?P<yil>\\d{4})'\nm2 = re.search(isimli, matn)\nprint(f'\\nNamed guruh: yil = {m2.group(\"yil\")}, oy = {m2.group(\"oy\")}')",
                codeNote: "\\. — nuqta metakarakter emas, HAQIQIY nuqta (escape qilingan). group(0) — butun moslik, 1,2,3 — guruhlar.",
                result: "Sanalar (tuple): [('19', '09', '2026'), ('25', '12', '2026')]\\n\\nBirinchi sana: 19.09.2026\\nKun:    19\\nOy:     09\\nYil:    2026\\n\\nNamed guruh: yil = 2026, oy = 09",
                note: "Telefon raqami uchun: \\+?\\d{1,3}[- ]?\\d{2,3}[- ]?\\d{3}[- ]?\\d{2}[- ]?\\d{2}"
              },
              {
                title: 'Flags va re.compile',
                text: "re.compile() — patternni BIR MARTA kompilyatsiya qiladi (tezlikni oshiradi). Flags:\n\n• re.IGNORECASE (re.I) — katta-kichik farq qilmasin\n• re.MULTILINE (re.M) — har qator ^ va $ bilan\n• re.DOTALL (re.S) — . ham \\n ni o'z ichiga olsin",
                code: "import re\n\nmatn = 'Hello HELLO hello salom SALOM'\n\n# re.I — katta-kichik farq qilmaydi\nprint('Hello lar (case insensitive):', re.findall(r'hello', matn, re.IGNORECASE))\n\n# re.compile — pattern 1 marta kompilyatsiya, keyin ko'p ishlatish\nemail_re = re.compile(r'[\\w.-]+@[\\w.-]+\\.\\w+', re.IGNORECASE)\nprint('Pattern kompilyatsiya qilindi:')\nprint(email_re.findall('Email: Ali@Mail.Uz, test@gmail.com, not-an-email'))\n\n# sub with flags — hello ni O'zbekcha ga\nprint('\\nAlmashtirish case-insensitive:', re.sub(r'hello', 'Salom', matn, flags=re.I))",
                codeNote: "Ko'p ishlatiladigan patternlarni compile() qiling — tezroq ishlaydi.",
                result: "Hello lar (case insensitive): ['Hello', 'HELLO', 'hello']\\nPattern kompilyatsiya qilindi:\\n['Ali@Mail.Uz', 'test@gmail.com']\\n\\nAlmashtirish case-insensitive: Salom Salom Salom salom SALOM",
                note: "RegEx cheat sheet: re — docs.python.org/3/library/re.html"
              },
              {
                title: 'Xulosa',
                text: "RegEx — matn bilan ishlashda kuchli vositadir. Ammo murakkab naqshlarni yozish va o'qish qiyin — har doim comment yozing va test qilib ko'ring!"
              }
            ],
            keyPoints: [
              "import re; r'...' — raw string (\\ escape qilinmasin)",
              "search, findall, match, fullmatch, sub, split",
              "Metakarakterlar: \\d (raqam), \\w (so'z belgi), \\s (bo'sh joy), . (istalgan), ^ (bosh), $ (oxir)",
              "Quantifier: * (0+), + (1+), ? (0/1), {n} (n marta), {n,m}",
              "[abc] (biror biri), [^abc] (undan tashqari), a|b (yoki)",
              "() — guruh, group(1,2...); (?P<nom>...) — named guruh",
              "Flags: re.I (ignore case), re.M, re.S; re.compile() — tezlik"
            ],
            masterXp: 35,
            homework: "1. Ismingizni ichida bo'lgan string da ism boshidan boshlanadimi (^) va oxirida tugaydimi ($) tekshiring.\n2. 'Men bugun 3 ta kitob, 5 ta daftar, 12 ta ruchka oldim' — barcha sonlarni findall orqali toping.\n3. Email topuvchi RegEx yozing: test qiling: 'a@b.cd, user.name@domain.uz, @@x, no-at-sign' — faqat 2 tasini topishi kerak.\n4. Uzbek telefon raqamini aniqlovchi RegEx: +998 XX XXX-XX-XX shaklida (re.fullmatch).\n5. re.sub orqali matndagi barcha 2+ ta bo'sh joyni BITTA bo'sh joyga aylantiring: re.sub(r'\\s+', ' ', s).\n6. (Challenge) HTML teglarni olib tashlovchi RegEx yozing: re.sub(r'<[^>]+>', '', html_str).",
            summary: "Bugun RegExni o'rgandik: re moduli, patternlar, metakarakterlar, quantifier, guruhlar, flags. Keyingi — JSON bilan ishlash!",
            exercises: [
              {
                id: 'pyRxEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Raqamlarni top 🔍',
                instruction: "re.findall orqali 'Bugun 20 ta olma, 15 ta banan, 30 ta gilos sotdim' matnidagi BARCHA sonlarni toping va chop qiling.",
                startCode: "import re\nmatn = 'Bugun 20 ta olma, 15 ta banan, 30 ta gilos sotdim'\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "re\\.findall\\s*\\(\\s*r?[\"']\\\\d\\+[\"']", msg: "re.findall(r'\\\\d+', matn) dan foydalaning — \\\\d+ raqamlarni topadi" }
                ],
                hint: "r'\\\\d+' — raqamlarni topuvchi naqsh.",
                explanation: "re.findall(r'\\\\d+', matn) → ['20', '15', '30'].",
                xp: 10
              },
              {
                id: 'pyRxEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Email patternni yig‘ing 🧩',
                instruction: "Oddiy email patternini to'g'ri tartibda yig'ing: [\\w.-]+ @ [\\w.-]+ \\. \\w+",
                hint: "1) @ dan oldingi qism, 2) @, 3) domain, 4) nuqta, 5) domen uzilishi",
                items: ['[\\w.-]+', '@', '[\\w.-]+', '\\.', '\\w+'],
                xp: 10
              },
              {
                id: 'pyRxEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "'192.168.1.1' IP ni topish uchun yozilgan pattern ishlamayapti. Sababi nima?",
                code: "import re\nip = '192.168.1.1'\npat = r'\\d+.\\d+.\\d+.\\d+'  # NIMA UCHUN ISHLAMAYDI?\nprint(re.match(pat, '192x168y1z1'))  # Ham mos kelyapti!",
                options: ['\\d+ noto‘g‘ri', '. nuqta escape qilinmagan, har qanday belgi', 're.match emas, re.search kerak', 'Pattern uzunligi kam'],
                answer: 1,
                explanation: ". — escape qilinmagan! . RegEx da HAR QANDAY BELGI. Shuning uchun 192x168... ham mos keldi. To'g'ri: \\\\d+\\\\.\\\\d+\\\\.\\\\d+\\\\.\\\\d+.",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "RegEx da \\d nimani bildiradi?",
                options: ["Har qanday belgi", "Raqam (0-9)", "Harf", "Bo'sh joy"],
                answer: 1,
                explanation: "\\d — digit (raqam 0-9). \\D — raqam emas."
              },
              {
                question: "r'\\w+' nimani topadi?",
                options: ["Faqat raqamlar", "Faqat bo'sh joylar", "Harf/raqam/_ dan iborat so'zlar", "Faqat maxsus belgilar"],
                answer: 2,
                explanation: "\\w — word character: a-z, A-Z, 0-9, _; + — 1 yoki undan ko'p."
              },
              {
                question: "Quantifier ? nimani anglatadi?",
                options: ["1 yoki undan ko'p marta", "Aniq 2 marta", "0 yoki 1 marta (ixtiyoriy)", "0 yoki undan ko'p"],
                answer: 2,
                explanation: "? — 0 yoki 1 marta, ixtiyoriy element."
              },
              {
                question: "re.sub(r'a+', 'X', 'aaa bbb aa') natijasi?",
                options: ["'aaa bbb aa'", "'X bbb X'", "'X bbb aa'", "'aaa bbb X'"],
                answer: 1,
                explanation: "a+ — 1+ ta 'a'. 'aaa' → 'X', 'aa' → 'X'. Natija: 'X bbb X'."
              },
              {
                question: "^\\d+$ patterni nima uchun?",
                options: ["Bironi joyida son bo'lsa", "BUTUN string faqat raqamlardan iborat", "Oxiri songa tugasa", "Boshi songa boshlansa"],
                answer: 1,
                explanation: "^ — bosh, $ — oxir, \\d+ — 1+ raqam. Shuning uchun BUTUN STRING faqat raqamlardan iborat."
              },
              {
                question: "() — guruh RegEx da nima uchun ishlatiladi?",
                options: ["Faqat ko'rinishni yaxshilash", "Qismlarni ajratib olish (group)", "Patternni bekor qilish", "Escape qilish"],
                answer: 1,
                explanation: "() guruh — qismlarni ajratib olish: m.group(1), m.group(2)..."
              },
              {
                question: "re.IGNORECASE flagi nima qiladi?",
                options: ["Patternni katta harf qiladi", "Katta-kichik harf farq qilmasin", "Patternni kichik harf qiladi", "Natijani teskariga aylantiradi"],
                answer: 1,
                explanation: "re.I — case insensitive: 'Hello' == 'HELLO' == 'hello' mos keladi."
              },
              {
                question: "re.findall(r'colou?r', ['color','colour','coloor']) nechta natija qaytaradi?",
                options: ["0", "1", "2", "3"],
                answer: 2,
                explanation: "? — u 0 yoki 1 marta. color (0 ta u) va colour (1 ta u) → 2 ta. coloor u 2 marta → mos kelmaydi."
              }
            ]
          }
        },
        {
          title: 'JSON bilan ishlash',
          duration: 20,
          xp: 30,
          content: {
            intro: "JSON (JavaScript Object Notation) — MA'LUMOTLARNI SAQLASH UCHUN KO'P ISHLATILADIGAN FORMAT. Oson o'qiladi, ko'p tillar tomonidan qo'llab-quvvatlanadi. API bilan ishlaganda, fayllarga yozishda da'im duch kelamiz. Python da json moduli orqali ishlaymiz.",
            sections: [
              {
                title: 'JSON — nimaga o'xshaydi?',
                text: "JSON sintaksisi Python dict/list ga juda o'xshaydi. Farqlar:\n\n• JSON da stringlar uchun \"\" qo'shtirnoq ('' emas)\n• True/False → true/false (kichik)\n• None → null\n• dict key — FAQAT STRING bo'lishi kerak\n• Komment yo'q JSON da",
                code: "# Oddiy JSON namuna (string korinishida)\njson_str = '''\n{\n  \"ism\": \"Ziyoda\",\n  \"yosh\": 24,\n  \"talaba\": true,\n  \"kurslar\": [\"Python\", \"Math\", \"English\"],\n  \"manzil\": {\n    \"shahar\": \"Samarqand\",\n    \"kocha\": \"Registon 5\"\n  },\n  "ota_ona": null\n}\n'''\nprint('JSON string (bir necha qator):')\nprint(json_str[:200])",
                codeNote: "JSON dict key "ism" — string; true/false kichik harf; null — Python None.",
                result: "JSON string (bir necha qator):\\n{\\n  \"ism\": \"Ziyoda\",\\n  \"yosh\": 24,\\n  \"talaba\": true,\\n  \"kurslar\": [\"Python\", \"Math\", \"English\"],\\n  \"manzil\": {\\n    \"shahar\": \"Samarqand\",\\n    \"kocha\": \"Registon 5\"\\n  },\\n  \"ota_ona\": null\\n}",
                note: "JSON: {}, [], \"\", true, false, null, raqamlar."
              },
              {
                title: 'json.loads() — JSON STRING → Python',
                text: "loads() — JSON STRING ni Python dict/list ga aylantiradi.",
                code: "import json\n\njson_str = '{\"ism\": \"Ziyoda\", \"yosh\": 24, \"talaba\": true, \"kurslar\": [\"Python\", \"Math\"]}'\n\n# 1) JSON STRING → Python dict\ndata = json.loads(json_str)\nprint('Tur:', type(data).__name__)\nprint('Ism:', data['ism'])\nprint('Yosh:', data['yosh'])\nprint('Kurslar:', data['kurslar'])\nprint('Kurs 0:', data['kurslar'][0])\nprint('Talaba (bool):', data['talaba'])  # True bo'ladi (Python ga aylangan!)",
                codeNote: "loads → LOAD from String. load (oxiri siz) → fayldan o'qish.",
                result: "Tur: dict\\nIsm: Ziyoda\\nYosh: 24\\nKurslar: ['Python', 'Math']\\nKurs 0: Python\\nTalaba (bool): True",
                note: "Agar noto'g'ri JSON bo'lsa json.JSONDecodeError xatosi beradi (try-except qiling)."
              },
              {
                title: 'json.dumps() — Python → JSON STRING',
                text: "dumps() — Python dict/list ni JSON STRING ga aylantiradi.",
                code: "import json\n\n# Python dict\nshaxs = {\n    'ism': 'Shaxzod',\n    'yosh': 28,\n    'talaba': False,\n    'xobbi': ['fotografiya', 'sayyohlik'],\n    'balans': 12500.50,\n    'passport': None\n}\n\n# 1) Oddiy dumps (bir qator, o'qish qiyin)\njson_simple = json.dumps(shaxs)\nprint('Oddiy JSON string (bir qator):', json_simple[:100], '...')\n\n# 2) Chiroyli: indent=2, sort_keys\njson_chiroyli = json.dumps(shaxs, indent=2, ensure_ascii=False, sort_keys=True)\nprint('\\nChiroyli JSON (ensure_ascii=False → o‘zbekcha ishlaydi):')\nprint(json_chiroyli)",
                codeNote: "indent=2 — 2 bo'sh joy bilan chiroyli. ensure_ascii=False → O'zbekcha belgilar (o'g'ish, UTF-8) to'g'ri saqlanadi. sort_keys=True — kalitlar tartibda.",
                result: "Oddiy JSON string (bir qator): {\"ism\": \"Shaxzod\", \"yosh\": 28, \"talaba\": false, \"xobbi\": [\"fotografiya\", \"sayyohlik\"], \"balans\": 12500.5, \"passport\": null} ...\\n\\nChiroyli JSON (ensure_ascii=False → o‘zbekcha ishlaydi):\\n{\\n  \"balans\": 12500.5,\\n  \"ism\": \"Shaxzod\",\\n  \"passport\": null,\\n  \"talaba\": false,\\n  \"xobbi\": [\\n    \"fotografiya\",\\n    \"sayyohlik\"\\n  ],\\n  \"yosh\": 28\\n}",
                note: "ensure_ascii=False — MUHIM! O'zbekcha, rus va boshqa non-ASCII belgilar uchun."
              },
              {
                title: 'Faylga yozish-o‘qish: json.dump / json.load',
                text: "Fayllar bilan ishlashda: dump() (siz) → yozish, load() → o'qish.",
                code: "import json\n\n# MA'LUMOT\nbaza = {\n    'foydalanuvchilar': [\n        {'id': 1, 'name': 'Ali', 'yosh': 20},\n        {'id': 2, 'name': 'Vali', 'yosh': 25}\n    ],\n    'adminlar': [1]\n}\n\n# 1) FAYLGA YOZISH: dump()\nfayl_nom = 'users_db.json'\nwith open(fayl_nom, 'w', encoding='utf-8') as f:\n    json.dump(baza, f, indent=2, ensure_ascii=False)\nprint(f'✅ {fayl_nom} ga yozildi')\n\n# 2) FAYLDAN O'QISH: load()\nwith open(fayl_nom, 'r', encoding='utf-8') as f:\n    data = json.load(f)\nprint('\\n✅ Fayldan o‘qildi')\nprint('Tur:', type(data).__name__)\nprint('Foydalanuvchilar soni:', len(data['foydalanuvchilar']))\nprint('Birinchi user:', data['foydalanuvchilar'][0])",
                codeNote: "encoding='utf-8' + ensure_ascii=False → O'zbekcha to'g'ri.",
                result: "✅ users_db.json ga yozildi\\n\\n✅ Fayldan o‘qildi\\nTur: dict\\nFoydalanuvchilar soni: 2\\nBirinchi user: {'id': 1, 'name': 'Ali', 'yosh': 20}",
                note: "with open() — faylni avtomatik yopadi (to'g'ri usul)."
              },
              {
                title: "Turlarni moslash (Python ↔ JSON)",
                text: "Mos keladigan turlar:\n\n| Python | JSON |\n|--------|------|\n| dict | object {} |\n| list, tuple | array [] |\n| str | string \"\" |\n| int, float | number |\n| True | true |\n| False | false |\n| None | null |",
                code: "import json\n\n# Tuple → JSON array (list ga aylanadi)\npython_data = {\n    'tuple_list': (10, 20, 30),  # JSON da array [10,20,30] bo'ladi\n    'sonlar': [1, 2, 3],\n    'matn': \"Salom\",\n    'raqam_int': 42,\n    'raqam_float': 3.14,\n    'mantiq': [True, False],\n    'null': None\n}\n\njson_str = json.dumps(python_data, indent=2, ensure_ascii=False)\nprint('Python → JSON:')\nprint(json_str)\n\n# Keyin JSON → Python qayta\nagain = json.loads(json_str)\nprint('\\nJSON → Python tuple_ list type:', type(again['tuple_list']).__name__)  # LIST bo'ladi, tuple emas!",
                codeNote: "Tuple JSON da list ga aylanadi — qayta o'qilganda LIST qaytadi (tuple emas).",
                result: "Python → JSON:\\n{\\n  \"tuple_list\": [10, 20, 30],\\n  \"sonlar\": [1, 2, 3],\\n  \"matn\": \"Salom\",\\n  \"raqam_int\": 42,\\n  \"raqam_float\": 3.14,\\n  \"mantiq\": [true, false],\\n  \"null\": null\\n}\\n\\nJSON → Python tuple_ list type: list",
                note: "Custom class (masalan: datetime) → JSON ga aylantirib bo'lmaydi — avval str/int ga aylantiring."
              },
              {
                title: 'Xulosa',
                text: "JSON — zamonaviy dasturlashda eng mashhur ma'lumot almashish formati. API ishlatish, baza fayllar, konfiguratsiyalar uchun keng qo'llaniladi."
              }
            ],
            keyPoints: [
              "import json; load/loads (o'qish), dump/dumps (yozish)",
              "loads/dumps — STRING bilan; load/dump — FAYL bilan",
              "JSON → Python: true→True, false→False, null→None, []→list, {}→dict",
              "Python → JSON: ensure_ascii=False (O'zbekcha kerak), indent=2 (chiroyli)",
              "Fayl bilan: encoding='utf-8' + with open() as f",
              "Tuple JSON da list ga aylanadi (qayta o'qilsa list bo'ladi)",
              "Noto'g'ri JSON → JSONDecodeError (try/except ishlating)"
            ],
            masterXp: 30,
            homework: "1. O'zingiz haqingizda dict yarating (ism, yosh, shahar, hobbi list) va JSON string ga aylantirib chop qiling (indent=2 bilan).\n2. Quyidagi JSON string ni Python ga aylantiring: '{\"nom\": \"Kitob\", \"narx\": 50000, \"mavjud\": true}' va narxini chop qiling.\n3. 'mahsulotlar' faylga JSON yozing: [{\"id\":1, \"nom\":\"Olma\", \"narx\":15000}, {...}] 3 ta mahsulot. Keyin qayta o'qib, jami narxini hisoblang (sum()).\n4. json.dumps da ensure_ascii=True va False farqini ko'rib chiqing (o'zbekcha so'z bilan).\n5. (Challenge) datetime.datetime.now() ni JSON ga yozmoqchi bo'lsangiz nima qilishingiz kerak? (str() ga aylantiring yoki default=str argumenti).",
            summary: "Bugun JSON bilan ishlashni o'rgandik: loads/dumps, load/dump fayllar bilan, turlar mosligi. Keyingi — API so'rovlar!",
            exercises: [
              {
                id: 'pyJsEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Python → JSON string 📦',
                instruction: "shaxs = {'ism':'Aziz', 'yosh':30, 'talaba':True} ni JSON STRING ga aylantiring va chop qiling (indent=2, ensure_ascii=False).",
                startCode: "import json\nshaxs = {'ism':'Aziz', 'yosh':30, 'talaba':True}\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "json\\.dumps\\s*\\(\\s*shaxs.*indent\\s*=\\s*2", msg: "json.dumps(shaxs, indent=2, ensure_ascii=False) ishlating" }
                ],
                hint: "json.dumps(..., indent=2, ensure_ascii=False)",
                explanation: "json.dumps(shaxs, indent=2, ensure_ascii=False) → chiroyli JSON.",
                xp: 10
              },
              {
                id: 'pyJsEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Faylga yozish tartibi 🧩',
                instruction: "JSON ni faylga yozish qismlarini to'g'ri tartibda joylashtiring.",
                hint: "import json → with open(...) → json.dump(...)",
                items: ['import json', 'with open(\"data.json\", \"w\") as f:', 'json.dump(data, f, indent=2)'],
                xp: 10
              },
              {
                id: 'pyJsEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Fayldan JSON o'qishda xato beradi — sababi?",
                code: "import json\n# XATO beradi — nima uchun?\nwith open('data.json', 'r') as f:\n    data = json.dump(f)\nprint(data)",
                options: ["open mode 'w' bo'lishi kerak", "json.dump emas, json.load kerak (dump yozuvchi, load o'quvchi)", "encoding='utf-8' yo'q", "print() qavs ichida f kerak"],
                answer: 1,
                explanation: "dump() — FAYLGA YOZISH. O'QISH uchun load() kerak. To'g'ri: data = json.load(f).",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Python dict ni JSON STRING ga aylantirish uchun?",
                options: ["json.loads()", "json.dumps()", "json.dump()", "json.load()"],
                answer: 1,
                explanation: "dumps() — dump to string. loads — load from string."
              },
              {
                question: "JSON da mantiqiy qiymat qanday yoziladi?",
                options: ["True/False (katta)", "true/false (kichik)", "Ha/Yo'q", "1/0"],
                answer: 1,
                explanation: "JSON da: true va false (kichik harf). Python True/False."
              },
              {
                question: "JSON ni FAYLDAN O'QISH uchun?",
                options: ["json.load()", "json.dump()", "json.loads()", "json.dumps()"],
                answer: 0,
                explanation: "load — fayldan o'qish. loads — stringdan."
              },
              {
                question: "O'zbekcha (o'g'ish, UTF-8) to'g'ri ishlashi uchun dumps da?",
                options: ["ascii=True", "ensure_ascii=False", "encoding='cp1251'", "unicode=True"],
                answer: 1,
                explanation: "ensure_ascii=False — O'zbekcha, arab, hind va barcha UTF-8 belgilar to'g'ri."
              },
              {
                question: "Python tuple JSON ga aylantirilganda nima bo'ladi?",
                options: ["tuple qoladi", "array/list (JSON []) ga aylanadi", "dict bo'ladi", "Xato beradi"],
                answer: 1,
                explanation: "Tuple → JSON array, qayta o'qilsa LIST bo'ladi."
              },
              {
                question: "JSON da stringlar qanday qo'shtirnoq bilan yoziladi?",
                options: ["Bittalik '", "Ikkitalik \"", "Ikkalasi ham mumkin", "Qo'shtirnoqsiz"],
                answer: 1,
                explanation: "JSON da FAQAT IKKITALIK \"\" qo'shtirnoq. '' Python da ishlaydi JSON da YO'Q."
              },
              {
                question: "Noto'g'ri JSON string ni loads qilsak nima bo'ladi?",
                options: ["None qaytaradi", "json.JSONDecodeError xatosi", "Bo'sh dict {}", "String o'z-o'zidan tuzaladi"],
                answer: 1,
                explanation: "Noto'g'ri JSON → json.JSONDecodeError → try/except bilan ushlash kerak."
              },
              {
                question: "Python None JSON da nimaga aylanadi?",
                options: ["NONE", "null", "undefined", "0"],
                answer: 1,
                explanation: "Python None → JSON null (kichik)."
              }
            ]
          }
        },
        {
          title: 'API so‘rovlar',
          duration: 25,
          xp: 35,
          content: {
            intro: "API (Application Programming Interface) — IKKI DASTUR O'RTASIDA MA'LUMOT ALMASHISH UCHUN. Masalan: ob-havo ma'lumotlarini olish, Telegram bot, pul kursi, IP geolokatsiya va hokazo. Python da requests kutubxonasi orqali API so'rovlarini jo'natamiz.",
            sections: [
              {
                title: 'requests kutubxonasi — o‘rnatish va GET so‘rov',
                text: "requests — Python da eng mashhur HTTP bibliotekasi. Oddiy: pip install requests.\n\nHTTP metodlar:\n• GET — MA'LUMOT OLISH (ko'p ishlatiladi)\n• POST — MA'LUMOT YUBORISH (yangi narsa yaratish)\n• PUT — YANGILASH\n• DELETE — O'CHIRISH",
                code: "# 1) O'rnatish (terminalda bajariladi, bu kod ishga tushmasligi mumkin)\n# pip install requests    # yoki pip3\n\nimport requests\n\n# 2) Oddiy GET so'rov (JSONPlaceholder — bepul test API)\nbase_url = 'https://jsonplaceholder.typicode.com'\n\n# 1 ta post olish (id=1)\njavob = requests.get(f'{base_url}/posts/1')\nprint('Status kod:', javob.status_code)  # 200 → OK, 404 → topilmadi, 500 → server xatosi\nprint('Status OKmi?:', javob.ok)         # True/False\nprint('Content-Type:', javob.headers.get('Content-Type'))",
                codeNote: "200 = OK, 201 = Created, 400 = Bad Request, 401 = Unauthorized, 403 = Forbidden, 404 = Not Found, 500 = Server Error.",
                result: "Status kod: 200\\nStatus OKmi?: True\\nContent-Type: application/json; charset=utf-8",
                note: "jsonplaceholder.typicode.com — test uchun mo'ljallangan bepul fake API."
              },
              {
                title: '.json() — javobni Python ga aylantirish',
                text: "Javob JSON bo'lsa, .json() metodi bilan darhol Python dict/list olamiz.",
                code: "import requests\n\nurl = 'https://jsonplaceholder.typicode.com/posts/1'\nres = requests.get(url)\n\nif res.status_code == 200:\n    post = res.json()  # JSON → Python dict\n    print('Turi:', type(post).__name__)\n    print('Kalitlar:', list(post.keys()))\n    print(f'\\nPost #{post[\"id\"]}:')\n    print('Sarlavha:', post['title'][:50] + '...')\n    print('Matn:', post['body'][:80] + '...')\nelse:\n    print(f'Xatolik: {res.status_code}')",
                codeNote: ".json() → json.loads(res.text) ni qisqartmasi.",
                result: "Turi: dict\\nKalitlar: ['userId', 'id', 'title', 'body']\\n\\nPost #1:\\nSarlavha: sunt aut facere repellat provident occaecati excepturi optio reprehenderit...\\nMatn: quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto...",
                note: "raise_for_status() → status 4xx/5xx bo'lsa avtomatik xato (HTTPError) beradi: res.raise_for_status()"
              },
              {
                title: 'GET — query params (URL parametrlar)',
                text: "Ko'p API larga filter/qidiruv parametrlarini yuboramiz. params argumenti orqali.",
                code: "import requests\n\n# posts?userId=1 — user 1 ning postlari\nurl = 'https://jsonplaceholder.typicode.com/posts'\nparams = {'userId': 1, '_limit': 3}  # _limit = nechta\n\nres = requests.get(url, params=params)\nprint('URL yuborildi:', res.url)  # parametrlar URL ga qoshilganini ko'rasiz\nposts = res.json()\n\nprint(f'\\n{len(posts)} ta post olindi:')\nfor i, p in enumerate(posts, 1):\n    print(f'{i}. [{p[\"id\"]}] {p[\"title\"][:40]}...')",
                codeNote: "params dict berilsa, requests avtomatik ?userId=1&_limit=3 ni URL ga qo'shadi.",
                result: "URL yuborildi: https://jsonplaceholder.typicode.com/posts?userId=1&_limit=3\\n\\n3 ta post olindi:\\n1. [1] sunt aut facere repellat provident occaecati ...\\n2. [2] qui est esse...\\n3. [3] ea molestias quasi exercitationem repellat qui ipsa sit aut...",
                note: "params bilan yozing — o'zingiz ?key=val qo'ymang (encoding avtomatik)."
              },
              {
                title: 'POST — yangi resurs yaratish',
                text: "POST so'rovi — yangi narsa yaratish. JSON yuborish uchun json= argumenti.",
                code: "import requests\n\nurl = 'https://jsonplaceholder.typicode.com/posts'\nyangi_post = {\n    'title': 'Mening birinchi postim',\n    'body': 'Bu post Python requests kutubxonasi orqali yuborildi!',\n    'userId': 10\n}\n\n# POST so'rov: json=... avtomatik JSON ga aylantiradi + Content-Type qo'shadi\nres = requests.post(url, json=yangi_post)\n\nprint('Status:', res.status_code)  # 201 Created bo'lishi kerak\nprint('Javob JSON:')\njavob = res.json()\nfor k, v in javob.items():\n    print(f'  {k}: {v}')",
                codeNote: "json=dict → requests avtomatik: json.dumps + headers Content-Type: application/json qiladi.",
                result: "Status: 201\\nJavob JSON:\\n  title: Mening birinchi postim\\n  body: Bu post Python requests kutubxonasi orqali yuborildi!\\n  userId: 10\\n  id: 101",
                note: "Agar form-data (dict emas) yuborilsa data= argumenti ishlatiladi."
              },
              {
                title: 'Headers, Timeout va Xatolarni boshqarish',
                text: "Headers: ko'pincha API token, User-Agent kabi ma'lumotlar. Timeout: kutish vaqti. try/except: xatolar uchun.",
                code: "import requests\n\nheaders = {\n    'User-Agent': 'MyPythonApp/1.0',\n    'Authorization': 'Bearer YOUR_TOKEN_HERE'  # ko'p API lar uchun token (Bu oddiy misol, ishlamaydi)\n}\n\nurl = 'https://jsonplaceholder.typicode.com/todos/1'\n\ntry:\n    res = requests.get(url, headers=headers, timeout=5)  # 5 soniya kutadi\n    res.raise_for_status()  # 4xx/5xx → HTTPError\n    todo = res.json()\n    print('✅ Todo:', todo)\nexcept requests.exceptions.ConnectionError:\n    print('❌ Internet aloqasi yo‘q yoki server ishlamayapti')\nexcept requests.exceptions.Timeout:\n    print('⏰ 5 soniya ichida javob kelmadi — timeout')\nexcept requests.exceptions.HTTPError as e:\n    print(f'⚠️ HTTP xatosi: {e} (status: {res.status_code})')\nexcept Exception as e:\n    print(f'❗ Kutilmagan xato: {e}')",
                codeNote: "timeout = X soniya — X dan ko'p kutmasin (abort). raise_for_status() — bad statusni exception ga aylantiradi.",
                result: "✅ Todo: {'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': False}",
                note: "Real loyihada: timeout, headers, try/except BUTUNLAYDI ob zaro — internet va serverlar ishonchsiz!"
              },
              {
                title: 'Xulosa',
                text: "API so'rovlari — zamonaviy dasturlashning ajralmas qismi. requests bilan GET/POST, params, headers, timeout va xatolarni boshqarishni o'rgandik."
              }
            ],
            keyPoints: [
              "pip install requests; import requests",
              "GET: requests.get(url, params=, headers=, timeout=)",
              "res.status_code (200=OK), res.ok, res.json(), res.text, res.headers",
              "params={} → query string (?key=val) avtomatik",
              "POST: requests.post(url, json=dict) → JSON yuborish",
              "PUT, DELETE, PATCH — boshqa HTTP metodlar",
              "Xatolar: ConnectionError, Timeout, HTTPError (res.raise_for_status())"
            ],
            masterXp: 35,
            homework: "1. https://jsonplaceholder.typicode.com/users/1 ni GET qiling, javob JSON dan 'name', 'email', 'address.city' ni chop qiling.\n2. /comments API dan postId=1 bo'lgan kommentlarni params orqali oling, nechta komment borligini chop qiling.\n3. Yangi TODO yaratish: POST /todos — json={'title':'API mashq', 'completed':False, 'userId':1}, status=201 ekanini tekshiring.\n4. timeout=0.001 berib, Timeout xatosini ushlab ko'ring (try/except Timeout).\n5. (Challenge) Barcha users ni olib (GET /users), ularning ismlari va shaharlari ro'yxatini JSON faylga saqlang (json.dump + ensure_ascii=False).",
            summary: "Bugun requests kutubxonasi: GET, POST, params, headers, timeout, xatolarni boshqarish. Keyingi — NumPy asoslari!",
            exercises: [
              {
                id: 'pyApiEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — API dan JSON olish 🌐',
                instruction: "requests.get orqali https://jsonplaceholder.typicode.com/posts/2 ni oling, .json() qilib sarlavhani (title) chop qiling.",
                startCode: "import requests\nurl = 'https://jsonplaceholder.typicode.com/posts/2'\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "res\\.json\\s*\\(\\s*\\)", msg: ".json() ni ishlating va 'title' ni chop qiling" },
                  { re: "requests\\.get\\s*\\(\\s*url", msg: "requests.get(url) ni ishlating" }
                ],
                hint: "res = requests.get(url); data = res.json(); print(data['title'])",
                explanation: "GET so'rov → .json() → dict → 'title' ni oling.",
                xp: 10
              },
              {
                id: 'pyApiEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Xato boshqarishni yig‘ing 🧩',
                instruction: "API so'roviga to'g'ri xatolarni boshqarish tartibini yig'ing.",
                hint: "try → requests.get → raise_for_status → exceptlar",
                items: ['try:', 'res = requests.get(url, timeout=5)', 'res.raise_for_status()', 'except requests.exceptions.Timeout:', 'except requests.exceptions.ConnectionError:'],
                xp: 10
              },
              {
                id: 'pyApiEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "POST so'rovida server 'Content-Type' sababli JSON qabul qilmayapti. Nima noto'g'ri?",
                code: "import requests\ndata = {'nom':'Olma', 'narx':5000}\nres = requests.post('https://api.example.com', data=data)  # NIMA NOTO'G'RI?",
                options: ["POST emas GET kerak", "data= emas, json= ishlatish kerak (Content-Type: application/json avtomatik)", "data dict emas, string bo'lishi kerak", "headers da User-Agent yo'q"],
                answer: 1,
                explanation: "data= → form-urlencoded yuboradi. JSON uchun json=data ishlating. To'g'ri: requests.post(url, json=data) → avtomatik Content-Type qo'shadi.",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Serverdan 200 status keldi — bu nimani anglatadi?",
                options: ["Xatolik", "Topilmadi", "OK (muvaffaqiyat)", "Server xatosi"],
                answer: 2,
                explanation: "200 = OK, 201 = Created, 404 = Not Found, 500 = Server Error."
              },
              {
                question: "GET so'rovida query parametrlarni qanday yuboramiz?",
                options: ["params=dict", "json=dict", "data=dict", "query=dict"],
                answer: 0,
                explanation: "params=dict — ?key=val&... ni URL ga avtomatik qo'shadi."
              },
              {
                question: "Javobni JSON dan Python dict ga o'tkazish uchun?",
                options: ["res.to_dict()", "res.json()", "json.loads(res)", "res.content"],
                answer: 1,
                explanation: "res.json() — requests ning qulay metodi (json.loads(res.text))."
              },
              {
                question: "POST so'rovida JSON yuborish uchun?",
                options: ["data=dict", "json=dict", "body=dict", "payload=dict"],
                answer: 1,
                explanation: "json=dict → avtomatik JSON ga aylantiradi va Content-Type header qo'shadi."
              },
              {
                question: "5 soniyadan ko'p kutmaslik uchun?",
                options: ["max_wait=5", "timeout=5", "delay=5", "limit=5"],
                answer: 1,
                explanation: "timeout=5 — 5 soniya, undan keyin Timeout xatosi."
              },
              {
                question: "Status 404 nimani bildiradi?",
                options: ["OK", "Yaratildi", "Topilmadi (Not Found)", "Ruxsat yo'q"],
                answer: 2,
                explanation: "404 = Not Found — resource mavjud emas."
              },
              {
                question: "Internet ulanmasa qaysi xato?",
                options: ["requests.exceptions.Timeout", "requests.exceptions.ConnectionError", "requests.exceptions.HTTPError", "ValueError"],
                answer: 1,
                explanation: "ConnectionError — aloqa yo'q, server ishlamaydi."
              },
              {
                question: "res.raise_for_status() nima qiladi?",
                options: ["Xatoni bekor qiladi", "Status 4xx/5xx bo'lsa HTTPError yuzaga keltiradi", "200 ni True ga aylantiradi", "Status kodi print qiladi"],
                answer: 1,
                explanation: "raise_for_status — 4xx/5xx statusni exception (HTTPError) ga aylantiradi."
              }
            ]
          }
        },
        {
          title: 'NumPy asoslari',
          duration: 25,
          xp: 35,
          content: {
            intro: "NumPy (Numerical Python) — Python da RAQAMLI HISOBLASH UCHUN ENG MUHIM KUTUBXONA. List dan ANCHA TEZROQ va qulayroq (vector/matriks operatsiyalari). Data Science, ML, ilmiy hisoblashlarda da'im ishlatiladi.",
            sections: [
              {
                title: 'O‘rnatish va array yaratish',
                text: "O'rnatish: pip install numpy\n\nNumPy asosiy obyekti — ndarray (n o'lchamli massiv). List dan farqi: barcha elementlar BIR TUR da, tezroq.",
                code: "# pip install numpy\nimport numpy as np  # np — degan qisqartma butun dunyo qilib keladi\n\n# 1) List dan NumPy array\ns = [1, 2, 3, 4, 5]\narr = np.array(s)\nprint('1D array:', arr)\nprint('Type:', type(arr).__name__)\nprint('Shape (o‘lcham):', arr.shape)  # (5,) — 5 ta element, 1 o'lcham\nprint('Element turi:', arr.dtype)\n\n# 2) 2D array (matritsa)\nmatr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nprint('\\n2D matritsa:')\nprint(matr)\nprint('Shape:', matr.shape)  # (3, 3) — 3 qator, 3 ustun\n\n# 3) Oson array yaratish funksiyalari\nprint('\\nzeros(5):', np.zeros(5, dtype=int))\nprint('ones(3):', np.ones(3))\nprint('arange(10):', np.arange(10))   # 0..9 (list range ga o'xshash)\nprint('linspace(0, 10, 5):', np.linspace(0, 10, 5))  # 0 dan 10 gacha 5 ta teng oraliq",
                codeNote: "shape — (qator, ustun). dtype — element turi (int64, float64...).",
                result: "1D array: [1 2 3 4 5]\\nType: ndarray\\nShape (o‘lcham): (5,)\\nElement turi: int32\\n\\n2D matritsa:\\n[[1 2 3]\\n [4 5 6]\\n [7 8 9]]\\nShape: (3, 3)\\n\\nzeros(5): [0 0 0 0 0]\\nones(3): [1. 1. 1.]\\narange(10): [0 1 2 3 4 5 6 7 8 9]\\nlinspace(0, 10, 5): [ 0.   2.5  5.   7.5 10. ]",
                note: "np.ones() default float64, int kerak bo'lsa dtype=int yozing."
              },
              {
                title: 'Arifmetik operatsiyalar (vectorlashtirilgan)',
                text: "NumPy da array ustida to'g'ridan-to'g'ri amallar — LOOP YO'Q, tez!",
                code: "import numpy as np\na = np.array([10, 20, 30, 40])\nb = np.array([1, 2, 3, 4])\n\n# Element-wise (har bir element uchun)\nprint('a + b =', a + b)\nprint('a - b =', a - b)\nprint('a * b =', a * b)\nprint('a / b =', a / b)\nprint('a ** 2 =', a ** 2)\nprint('np.sqrt(a) =', np.sqrt(a))  # ildiz\nprint('np.sum(a) =', np.sum(a))   # yig'indi\nprint('np.mean(a) =', np.mean(a)) # o'rtacha\nprint('np.max(a), np.min(a) =', np.max(a), np.min(a))\n\n# Skalar bilan\nprint('\\na + 100 =', a + 100)  # BARCHA elementlarga qo'shiladi\n\n# 2D uchun (matritsa ko'paytirish @)\nA = np.array([[1,2],[3,4]])\nB = np.array([[5,6],[7,8]])\nprint('\\nMatritsa ko‘paytirish A @ B:')\nprint(A @ B)",
                codeNote: "* — element-wise kopaytirish. @ — matritsa kopaytirish (dot product 2D da). Broadcasting — turli o'lchamli arraylarni moslashtirish.",
                result: "a + b = [11 22 33 44]\\na - b = [ 9 18 27 36]\\na * b = [ 10  40  90 160]\\na / b = [10. 10. 10. 10.]\\na ** 2 = [ 100  400  900 1600]\\nnp.sqrt(a) = [3.16227766 4.47213595 5.47722558 6.32455532]\\nnp.sum(a) = 100\\nnp.mean(a) = 25.0\\nnp.max(a), np.min(a) = 40 10\\n\\na + 100 = [110 120 130 140]\\n\\nMatritsa ko‘paytirish A @ B:\\n[[19 22]\\n [43 50]]",
                note: "List da a + b qo'shmas edi (birlashtirish edi), NumPy da HAKIQIY qo'shish!"
              },
              {
                title: 'Indeks va kesish (slicing)',
                text: "1D: listga o'xshaydi. 2D: [qator, ustun] — vergul bilan ajratiladi!",
                code: "import numpy as np\n\n# 1D kesish\na = np.arange(0, 20, 2)  # 0, 2, 4, ... 18\nprint('a =', a)\nprint('a[2:6] =', a[2:6])\nprint('a[::3] =', a[::3])  # har 3-qadam\n\n# 2D kesish — [qator, ustun]\nmatr = np.arange(1, 13).reshape(3, 4)  # 3x4 = 12 ta\nprint('\\n3x4 matritsa:')\nprint(matr)\nprint('\\nmatr[0, 0] =', matr[0, 0])  # 1-qiymat\nprint('matr[1, 2] =', matr[1, 2])  # 2-qator 3-ustun\nprint('1-qator (matr[1, :]):', matr[1, :])\nprint('2-ustun (matr[:, 2]):', matr[:, 2])\nprint('Qator 0-1, Ustun 1-3:')\nprint(matr[0:2, 1:4])",
                codeNote: "reshape(n, m) — 1D ni n x m ga aylantirish. [row, col] vergul bilan.",
                result: "a = [ 0  2  4  6  8 10 12 14 16 18]\\na[2:6] = [4 6 8 10]\\na[::3] = [ 0  6 12 18]\\n\\n3x4 matritsa:\\n[[ 1  2  3  4]\\n [ 5  6  7  8]\\n [ 9 10 11 12]]\\n\\nmatr[0, 0] = 1\\nmatr[1, 2] = 7\\n1-qator (matr[1, :]): [5 6 7 8]\\n2-ustun (matr[:, 2]): [ 3  7 11]\\nQator 0-1, Ustun 1-3:\\n[[2 3 4]\\n [6 7 8]]",
                note: "NumPy slicing — view (ko'rinish), nusxa emas. Yangi nusxa uchun .copy() ishlating."
              },
              {
                title: 'Boolean indekslash (mantiqiy filter)',
                text: "Shart berib array elementlarini filtrlash — juda kuchli xususiyat.",
                code: "import numpy as np\n\nnarxlar = np.array([15000, 8000, 25000, 12000, 30000, 5000, 18000])\nprint('Narxlar:', narxlar)\n\n# 1) Boolean mask (True/False array)\npast = narxlar < 15000\nprint('\\n< 15000 mask:', past)\nprint('< 15000 elementlar:', narxlar[past])  # mask orqali filter\n\n# 2) To'g'ridan-to'g'ri shart\nprint('20000+ narxlar:', narxlar[narxlar >= 20000])\n\n# 3) & (and) | (or) — har birini qavs ichiga oling!\nprint('10k va 20k orasidagi:', narxlar[(narxlar > 10000) & (narxlar < 20000)])\n\n# 4) Qiymatlarni o'zgartirish shart bilan\nnarxlar_copy = narxlar.copy()\nnarxlar_copy[narxlar_copy > 20000] = 20000  # eng yuqori 20k\nprint('\\n20k chegirma qo‘yilgandan keyin:', narxlar_copy)",
                codeNote: "&, | — har bir shart qavs ichida bo'lishi ZARUR! parenthesis around each.",
                result: "Narxlar: [15000  8000 25000 12000 30000  5000 18000]\\n\\n< 15000 mask: [False  True False  True False  True False]\\n< 15000 elementlar: [ 8000 12000  5000]\\n20000+ narxlar: [25000 30000]\\n10k va 20k orasidagi: [15000 12000 18000]\\n\\n20k chegirma qo‘yilgandan keyin: [15000  8000 20000 12000 20000  5000 18000]",
                note: "Bu usul Pandas da ham huddi shunday ishlaydi (keyingi dars)."
              },
              {
                title: 'Random va statistik funksiyalar',
                text: "NumPy ning np.random moduli orqali tasodifiy sonlar va statistika.",
                code: "import numpy as np\n\n# Tasodifiy sonlar\nnp.random.seed(42)  # seed — har doim bir xil natija (reproducible)\n\nprint('0..1 oralig‘ida 5 ta float:', np.random.rand(5))\nprint('1..10 oralig‘ida 6 ta butun:', np.random.randint(1, 11, size=6))\nprint('Normal distribution (o‘rtacha 0, std 1), 5 ta:', np.random.randn(5))\n\n# Statistika\narr = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])\nprint('\\nYig‘indi:', np.sum(arr))\nprint("O‘rtacha:", np.mean(arr))\nprint('Mediana:', np.median(arr))\nprint('Standart og‘ish (std):', np.round(np.std(arr), 2))\nprint('Variance:', np.round(np.var(arr), 2))\nprint('50% — percentile:', np.percentile(arr, 50))\n\n# Sum axis bo'yicha (qator/ustun yig'indisi)\nmatr = np.arange(1, 10).reshape(3, 3)\nprint('\\n3x3 matritsa:'); print(matr)\nprint('Qator yig‘indilari (axis=1):', np.sum(matr, axis=1))\nprint('Ustun yig‘indilari (axis=0):', np.sum(matr, axis=0))",
                codeNote: "seed — reproducible: code har ishga tushganda bir xil random beradi. axis=0 → ustun, axis=1 → qator.",
                result: "0..1 oralig‘ida 5 ta float: [0.37454012 0.95071431 0.73199394 0.59865848 0.15601864]\\n1..10 oralig‘ida 6 ta butun: [ 9  1  7  7  4  9]\\nNormal distribution (o‘rtacha 0, std 1), 5 ta: [ 0.49671415 -0.1382643   0.64768854  1.52302986 -0.23415337]\\n\\nYig‘indi: 550\\nO‘rtacha: 55.0\\nMediana: 55.0\\nStandart og‘ish (std): 28.72\\nVariance: 825.0\\n50% — percentile: 55.0\\n\\n3x3 matritsa:\\n[[1 2 3]\\n [4 5 6]\\n [7 8 9]]\\nQator yig‘indilari (axis=1): [ 6 15 24]\\nUstun yig‘indilari (axis=0): [12 15 18]",
                note: "axis = qaysi o'q bo'yicha. 0 = ustun (tepadan pastga), 1 = qator (chapdan o'ngga)."
              },
              {
                title: 'Xulosa',
                text: "NumPy — Data Sciencening poydevori. Keyingi darsda NumPy ustiga qurilgan Pandas ni ko'ramiz — jadval ma'lumotlar bilan ishlash uchun!"
              }
            ],
            keyPoints: [
              "import numpy as np; np.array([1,2,3]) — 1D array",
              "zeros/ones/arange/linspace — tez array yaratish",
              "a + b, a * b, a ** 2 — vectorlashtirilgan (tez, loop yo'q)",
              "2D indeks: [qator, ustun] (vergul), slicing",
              "Boolean indekslash: arr[arr > 10], (arr>5) & (arr<20) — qavslar ZARUR",
              "np.sum, mean, median, std, var, min, max, percentile",
              "axis=0 (ustun), axis=1 (qator); reshape(n, m)"
            ],
            masterXp: 35,
            homework: "1. [10, 20, 30, 40, 50] listidan NumPy array yarating, sum/mean/std/median ni chop qiling.\n2. np.arange(1, 26) dan 5x5 matritsa yarating (reshape). Diagonal elementlarni chop qiling.\n3. Narxlar array [2500, 1800, 3000, 900, 4200, 1100] — 2000 dan pastlarini filtrelab chop qiling.\n4. 100 ta elementli 1D random array (0..100 int). Minimal, maksimal, 75 percentile ni toping.\n5. (5,5) random matritsa. Ustunlar yig'indisini va qatorlar o'rtachasini toping (axis=0, axis=1).\n6. (Challenge) Broadcasting: 2D (3,3) matritsa + 1D (3,) array — qanday ishlashini ko'rib chiqing (har qatorga qo'shiladi).",
            summary: "Bugun NumPy: array yaratish, arifmetika, indeks/slicing, boolean filter, statistika. Keyingi — Pandas asoslari!",
            exercises: [
              {
                id: 'pyNpEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — NumPy array yaratish 🔢',
                instruction: "np.array([[1,2,3],[4,5,6]]) yarating va BARCHA ELEMENTLAR YIG'INDISINI chop qiling (np.sum).",
                startCode: "import numpy as np\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "np\\.sum\\s*\\(\\s*matr", msg: "np.sum(matr) ni ishlating" },
                  { re: "np\\.array\\s*\\(\\s*\\[\\s*\\[\\s*1\\s*,\\s*2\\s*,\\s*3\\s*\\]", msg: "2x3 array yarating" }
                ],
                hint: "matr = np.array([[1,2,3],[4,5,6]]), keyin print(np.sum(matr)).",
                explanation: "np.sum(...) → 1+2+3+4+5+6 = 21.",
                xp: 10
              },
              {
                id: 'pyNpEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Matritsa o‘lchamlarini yig‘ing 🧩',
                instruction: "0..11 dan 12 ta sonni 3qator 4ustun matritsaga aylantirish uchun tartibni yig'ing.",
                hint: "arange → reshape → print",
                items: ['import numpy as np', 'arr = np.arange(12)', 'matr = arr.reshape(3, 4)', 'print(matr)'],
                xp: 10
              },
              {
                id: 'pyNpEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Boolean filtrlash kodida xato beradi (ValueError: The truth value...). Sababi?",
                code: "import numpy as np\nnarxlar = np.array([100, 200, 300])\n# XATO: ValueError — sababi?",
               ar = narxlar[narxlar > 100 and narxlar < 300]\nprint(ar)",
                options: ["Python and emas, NumPy & (va har bir shart qavs ichida!)", "array elementlar son emas", "print da xato", "index noto'g'ri"],
                answer: 0,
                explanation: "Python 'and' NumPy arraylarda ishlamaydi. & ishlatishingiz kerak, HAR BIR SHART QAVS ICHIDA! To'g'ri: narxlar[(narxlar>100) & (narxlar<300)].",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "NumPy asosiy obyekti?",
                options: ["list", "ndarray", "DataFrame", "Series"],
                answer: 1,
                explanation: "ndarray = n-dimensional array — NumPy asosiy obyekti."
              },
              {
                question: "2D array da elementni qaysi sintaksis orqali olamiz?",
                options: ["arr[qator][ustun] (faqat)", "arr[qator, ustun] (vergul bilan)", "arr(qator, ustun)", "arr.qator.ustun"],
                answer: 1,
                explanation: "NumPy 2D: arr[qator, ustun] — vergul bilan. Bu qulayroq."
              },
              {
                question: "[1,2,3] + [4,5,6] — Python list, numpy array ni farqi?",
                options: ["Bir xil (qo'shilish)", "List: birlashuv [1,2,3,4,5,6]; NumPy: element-wise qo'shilish [5,7,9]", "Ikkalasi ham birlashuv", "Xatolik beradi"],
                answer: 1,
                explanation: "Python list + → birlashuv, NumPy array + → HAKIQIY element-wise qo'shilish."
              },
              {
                question: "np.arange(1, 13).reshape(3, 4) → qanday shape?",
                options: ["(12,)", "(3, 4)", "(4, 3)", "(13, 3)"],
                answer: 1,
                explanation: "reshape(3, 4) → 3 qator, 4 ustun. 12 ta element = 3 × 4."
              },
              {
                question: "Boolean filtrlashda 'and' o'rniga qaysi ishlatiladi?",
                options: ["and", "&&", "&", "AND"],
                answer: 2,
                explanation: "& (bitwise AND). Va HAR BIR SHART QAVS ICHIDA bo'lishi kerak."
              },
              {
                question: "QATOR YIG'INDISI uchun axis=?",
                options: ["axis=0", "axis=1", "axis='row'", "axis='vertical'"],
                answer: 1,
                explanation: "axis=1 → qator (chap-o'ng). axis=0 → ustun (tep-past)."
              },
              {
                question: "Standart og'ish uchun qaysi funksiya?",
                options: ["np.mean()", "np.median()", "np.std()", "np.var()"],
                answer: 2,
                explanation: "np.std() — standard deviation (standart og'ish). np.var — variance."
              },
              {
                question: "0 va 1 orasidagi 5 ta tasodifiy float uchun?",
                options: ["np.random.randint(0, 1, 5)", "np.random.rand(5)", "np.random.random_integers(5)", "np.arange(0,1,5)"],
                answer: 1,
                explanation: "np.random.rand(5) — 0..1 oralig'ida 5 ta float."
              }
            ]
          }
        },
        {
          title: 'Pandas asoslari',
          duration: 30,
          xp: 40,
          content: {
            intro: "Pandas — Python da JADVAL (table) MA'LUMOTLAR BILAN ISHLASH UCHUN ENG KUCHLI KUTUBXONA. NumPy ustiga qurilgan. CSV, Excel, SQL va boshqa manbalardan ma'lumot o'qish, tozalash, tahlil qilish, guruhlash — barchasi Pandas bilan.",
            sections: [
              {
                title: 'O‘rnatish va DataFrame yaratish',
                text: "O'rnatish: pip install pandas\n\nPandas ning 2 ta asosiy obyekti:\n• Series — 1 o'lchamli (ustun)\n• DataFrame — 2 o'lchamli (jadval: qatorlar + ustunlar)",
                code: "# pip install pandas numpy openpyxl (excel uchun)\nimport pandas as pd\nimport numpy as np\n\n# 1) Dict orqali DataFrame yaratish\ndata = {\n    'ism': ['Ali', 'Vali', 'Ziyoda', 'Shaxzoda', 'Otabek'],\n    'yosh': [22, 25, 19, 27, 31],\n    'shahar': ['Toshkent', 'Samarqand', 'Buxoro', 'Toshkent', 'Andijon'],\n    'oylik': [5000000, 7000000, 4500000, 8500000, 12000000],\n    'kurs_tugallandi': [True, True, False, True, False]\n}\ndf = pd.DataFrame(data)\nprint('DataFrame (5 talik):')\nprint(df)\nprint('\\nShape (qator, ustun):', df.shape)\nprint('Ustun nomlari:', list(df.columns))\nprint('\\ndtypes:'); print(df.dtypes)",
                codeNote: "Series — bitta ustun. DataFrame — ko'p ustunli jadval. df.shape → (qator, ustun).",
                result: "DataFrame (5 talik):\\n        ism  yosh     shahar     oylik  kurs_tugallandi\\n0       Ali    22  Toshkent   5000000             True\\n1      Vali    25 Samarqand   7000000             True\\n2    Ziyoda    19    Buxoro   4500000            False\\n3  Shaxzoda    27  Toshkent   8500000             True\\n4    Otabek    31   Andijon  12000000            False\\n\\nShape (qator, ustun): (5, 5)\\nUstun nomlari: ['ism', 'yosh', 'shahar', 'oylik', 'kurs_tugallandi']\\n\\ndtypes:\\nism               object\\nyosh               int64\\nshahar            object\\noylik              int64\\nkurs_tugallandi      bool\\ndtype: object",
                note: "object dtype = string (Pandas da stringlar object turi)."
              },
              {
                title: 'CSV/Excel fayllarni o‘qish',
                text: "Eng ko'p ishlatiladigan usul — CSV (Comma Separated Values).",
                code: "import pandas as pd\nimport io\n\n# (Oddiy misol: xotirada CSV yaratib o'qiyapmiz)\ncsv_matn = '''id,nom,narx,miqdor,kategoriya\n1,Olma,15000,100,Meva\n2,Banan,20000,50,Meva\n3,Go'sht,120000,30,Go'sht\n4,Sut,8000,80,Sut mahsuloti\n5,Non,3000,200,Boulangerie\n6,Shokolad,17000,60,Shirinlik\n7,Pomidor,14000,70,Sabzavot\n8,Bodring,7000,40,Sabzavot\n'''\n\n# CSV o'qish\ndf = pd.read_csv(io.StringIO(csv_matn))  # haqiqiy fayl: pd.read_csv('mahsulotlar.csv')\nprint('8 ta mahsulot DataFrame:')\nprint(df)\n\n# 1) head() / tail() — bosh/oxirgi N qator\nprint('\\nBosh 3 ta (head):'); print(df.head(3))\nprint('\\nOxir 2 ta (tail):'); print(df.tail(2))\n\n# 2) info() — umumiy info (ustunlar, null, dtype)\nprint('\\nInfo:')\nprint(df.info())\n\n# 3) describe() — raqamli ustunlar uchun statistika\nprint('\\nStatistika (raqamli ustunlar):')\nprint(df.describe())",
                codeNote: "pd.read_csv('file.csv') — CSV; pd.read_excel('file.xlsx') — Excel; pd.read_sql() — SQL.",
                result: "8 ta mahsulot DataFrame:\\n   id      nom    narx  miqdor    kategoriya\\n0   1     Olma   15000     100          Meva\\n1   2    Banan   20000      50          Meva\\n2   3    Go'sht  120000      30        Go'sht\\n3   4      Sut    8000      80  Sut mahsuloti\\n4   5      Non    3000     200   Boulangerie\\n5   6 Shokolad   17000      60    Shirinlik\\n6   7  Pomidor   14000      70      Sabzavot\\n7   8  Bodring    7000      40      Sabzavot\\n\\nBosh 3 ta (head):\\n   id    nom    narx  miqdor kategoriya\\n0   1   Olma   15000     100       Meva\\n1   2  Banan   20000      50       Meva\\n2   3  Go'sht  120000      30     Go'sht\\n\\nOxir 2 ta (tail):\\n   id      nom   narx  miqdor kategoriya\\n6   7  Pomidor  14000      70   Sabzavot\\n7   8  Bodring   7000      40   Sabzavot\\n\\nInfo:\\n<class 'pandas.core.frame.DataFrame'>...\\n\\nStatistika (raqamli ustunlar):\\n            id           narx      miqdor\\ncount  8.00000       8.000000    8.000000\\nmean   4.50000   25500.000000   78.750000\\n...",
                note: "df.to_csv('yangi.csv', index=False) — saqlash (index=False → 0,1,2... indeksni saqlama.)"
              },
              {
                title: 'Ustun va qator tanlash',
                text: "• Ustun: df['ustun'] yoki df.ustun\n• Bir nechta ustun: df[['ust1','ust2']]\n• loc[] — label (indeks nomi) bilan\n• iloc[] — position (raqam 0,1,2...) bilan",
                code: "import pandas as pd\nimport numpy as np\n\n# DataFrame\ndata = {'nom':['Olma','Banan','Pomidor','Sut','Non'],\n        'narx':[15000,20000,14000,8000,3000],\n        'miqdor':[100,50,70,80,200]}\ndf = pd.DataFrame(data)\ndf.index = ['a','b','c','d','e']  # indeksni o'zgartirdik\nprint('Indeks nomli DataFrame:'); print(df)\n\n# 1) Bitta ustun\nprint('\\nNARX ustuni (Series):'); print(df['narx'])\n\n# 2) Bir nechta ustun (DataFrame)\nprint('\\nnom + miqdor ustunlari:'); print(df[['nom','miqdor']])\n\n# 3) loc[] — indeks NOMI bilan\nprint('\\nloc[\"b\"] ='); print(df.loc['b'])\nprint('\\nloc[\"b\":\"d\", [\"nom\",\"narx\"]] ='); print(df.loc['b':'d', ['nom','narx']])\n\n# 4) iloc[] — indeks RAQAMI bilan (0-based)\nprint('\\niloc[0] = birinchi qator:'); print(df.iloc[0])\nprint('\\niloc[1:4, 0:2] ='); print(df.iloc[1:4, 0:2])",
                codeNote: "loc → label (nom); iloc → pozitsiya (raqam). list uchun [] kabi.",
                result: "Indeks nomli DataFrame:\\n       nom   narx  miqdor\\na     Olma  15000     100\\nb    Banan  20000      50\\nc  Pomidor  14000      70\\nd      Sut   8000      80\\ne      Non   3000     200\\n\\nNARX ustuni (Series):\\na    15000\\nb    20000\\nc    14000\\nd     8000\\ne     3000\\nName: narx, dtype: int64\\n\\nnom + miqdor ustunlari:\\n       nom  miqdor\\na     Olma     100\\nb    Banan      50\\n...",
                note: "Endi Filterlashni ko'ramiz — NumPy boolean bilan bir xil."
              },
              {
                title: 'Filterlash (boolean indexing) va query()',
                text: "NumPy singari — shart berib qatorlarni filtrlash mumkin.",
                code: "import pandas as pd\n\ndata = {'nom':['Olma','Banan','Pomidor','Sut','Non','Shokolad','Bodring'],\n        'narx':[15000,20000,14000,8000,3000,17000,7000],\n        'kategoriya':['Meva','Meva','Sabzavot','Sut','Non','Shirinlik','Sabzavot'],\n        'miqdor':[100,50,70,80,200,60,40]}\ndf = pd.DataFrame(data)\nprint('DataFrame:'); print(df)\n\n# 1) Oddiy shart: narxi 10000 dan katta\nprint('\\nNarxi 10k+ (df[df.narx > 10000]):'); print(df[df['narx'] > 10000])\n\n# 2) & va | (har shart qavs ichida!)\nprint('\\nMeva VA narx < 18000:'); print(df[(df['kategoriya'] == 'Meva') & (df['narx'] < 18000)])\n\n# 3) isin() — list ichidagilar\nprint('\\nKategoriya Meva yoki Sabzavot:'); print(df[df['kategoriya'].isin(['Meva','Sabzavot'])])\n\n# 4) query() — string ichida shart\nprint('\\nquery(\"narx > 10000 and miqdor >= 70\"):'); print(df.query('narx > 10000 and miqdor >= 70'))",
                codeNote: "df.query('shart') — o'qilishi oson, string ichida & emas and ishlatiladi.",
                result: "DataFrame:\\n       nom   narx kategoriya  miqdor\\n0     Olma  15000       Meva     100\\n1    Banan  20000       Meva      50\\n2  Pomidor  14000   Sabzavot      70\\n3      Sut   8000        Sut      80\\n4      Non   3000        Non     200\\n5  Shokolad  17000  Shirinlik      60\\n6  Bodring   7000   Sabzavot      40\\n\\nNarxi 10k+ (df[df.narx > 10000]):\\n       nom   narx kategoriya  miqdor\\n0     Olma  15000       Meva     100\\n1    Banan  20000       Meva      50\\n2  Pomidor  14000   Sabzavot      70\\n5  Shokolad  17000  Shirinlik      60\\n\\nMeva VA narx < 18000:\\n    nom   narx kategoriya  miqdor\\n0  Olma  15000       Meva     100",
                note: "between() ham qulay: df[df['narx'].between(5000, 15000)]"
              },
              {
                title: "Yangi ustun qo'shish, groupby va agg",
                text: "Guruhlash — statistika tahlil uchun juda muhim.",
                code: "import pandas as pd\nimport numpy as np\n\ndata = {'xodim':['Ali','Vali','Ziyoda','Shaxzoda','Otabek','Nodira','Jasur'],\n        'bo'lim':['IT','IT','Sotuv','Sotuv','IT','Moliya','Moliya'],\n        'oylik':[5000000,7000000,6000000,8000000,12000000,9500000,11000000],\n        'staj':[2,5,3,6,10,7,9]}\ndf = pd.DataFrame(data)\nprint('Xodimlar jadvali:'); print(df)\n\n# 1) Yangi ustun qo'shish\ndf['yillik'] = df['oylik'] * 12\ndf['bonus'] = np.where(df['staj'] >= 5, df['oylik'] * 0.2, 0)  # staj >= 5 ga bonus 20%\nprint('\\nYangi ustunlar (yillik, bonus):'); print(df)\n\n# 2) groupby → bo'limlar bo'yicha statistika\nprint('\\nBo'lim bo'yicha GROUPBY:')\nguruh = df.groupby('bo'lim')['oylik'].agg(['count','sum','mean','min','max'])\nprint(guruh.round(-4))  # 10000 ga yaxlitlash\n\n# 3) sort_values()\nprint('\\nOylik bo'yicha kamayish tartibida:')\nprint(df.sort_values('oylik', ascending=False)[['xodim','bo'lim','oylik']].head())",
                codeNote: "agg(['count','sum','mean','min','max']) — bir nechta agg funksiyalarni bir vaqt.",
                result: "Xodimlar jadvali:\\n     xodim  bo'lim     oylik  staj\\n0      Ali      IT   5000000     2\\n1     Vali      IT   7000000     5\\n2   Ziyoda   Sotuv   6000000     3\\n3 Shaxzoda   Sotuv   8000000     6\\n4   Otabek      IT  12000000    10\\n5   Nodira  Moliya   9500000     7\\n6    Jasur  Moliya  11000000     9\\n\\nYangi ustunlar (yillik, bonus):\\n...\\n\\nBo'lim bo'yicha GROUPBY:\\n        count       sum        mean       min       max\\nbo'lim                                                  \\nIT          3  24000000   8000000   5000000  12000000\\nMoliya      2  20500000  10250000   9500000  11000000\\nSotuv       2  14000000   7000000   6000000   8000000",
                note: "NaN (null) ishlatish: df.isna().sum(), df.fillna(qiymat), df.dropna()"
              },
              {
                title: "NaN (null qiymatlar) bilan ishlash",
                text: "Real ma'lumotlarda ko'p bo'lgan null (NaN) qiymatlarni tozalash kerak.",
                code: "import pandas as pd\nimport numpy as np\n\ndata = {'ism':['Ali','Vali',np.nan,'Ziyoda',''],\n        'yosh':[22,np.nan,19,27,31],\n        'oylik':[np.nan,7000000,4500000,np.nan,12000000]}\ndf = pd.DataFrame(data)\nprint('NaN bor DataFrame:'); print(df)\nprint('\\nHar ustundagi NaN soni:'); print(df.isna().sum())\nprint('\\nUmumiy NaN:', df.isna().sum().sum())\n\n# 1) NaN bor qatorlarni olib tashlash\ndf_drop = df.dropna()\nprint('\\nDrop qilingan (NaN yo'q):'); print(df_drop)\n\n# 2) NaN ni qiymat bilan to'ldirish\ndf_fill = df.copy()\ndf_fill['ism'] = df_fill['ism'].fillna('Noma\'lum')\ndf_fill['yosh'] = df_fill['yosh'].fillna(df['yosh'].mean())  # o'rtacha bilan\ndf_fill['oylik'] = df_fill['oylich'].fillna(0)  # 0 bilan\nprint('\\nFill qilingan:'); print(df_fill)",
                codeNote: "NaN = Not a Number. isna() = isnull().",
                result: "NaN bor DataFrame:\\n      ism  yosh       oylik\\n0     Ali  22.0         NaN\\n1    Vali   NaN   7000000.0\\n2     NaN  19.0   4500000.0\\n3  Ziyoda  27.0         NaN\\n4          31.0  12000000.0\\n\\nHar ustundagi NaN soni:\\nism      1\\nyosh     1\\noylik    2\\ndtype: int64\\n\\nUmumiy NaN: 4",
                note: "df.replace('', np.nan) — bo'sh stringlarni ham NaN ga aylantiring."
              },
              {
                title: 'Xulosa',
                text: "Pandas — Data Science va ma'lumotlar tahlilining asosiy vositasi. Keyingi darsda Pandas DataFrameni chizmalar (visualization) bilan ko'rsatamiz!"
              }
            ],
            keyPoints: [
              "import pandas as pd; pd.DataFrame(dict) — jadval yaratish",
              "pd.read_csv() / pd.read_excel() / to_csv(index=False)",
              "head()/tail()/info()/describe() — asosiy ko'rik",
              "Ustun: df['ustun'], [['a','b']]; loc[label], iloc[position]",
              "Filter: df[df.narx > 10000]; & | (qavs ichida!); df.query()",
              "df['ustun'] = ... → yangi ustun; df.groupby().agg()",
              "isna().sum(), dropna(), fillna(mean/0) → NaN bilan ishlash"
            ],
            masterXp: 40,
            homework: "1. 5 ta shaxs uchun DataFrame yarating: ism, yosh, oylik, shahar. head(), shape, dtypes ni chop qiling.\n2. Oddiy CSV fayl (yoki io.String) yarating: 8 ta mahsulot (nom, narx, kategoriya). Narxi 10000 dan yuqori bo'lganlarni filtrelang.\n3. Xuddi shu DataFrame da kategoriya bo'yicha groupby qiling: sum(narx), count, mean.\n4. staj ustun qo'shing: agar staj >= 3 bo'lsa, bonus = oylik * 0.15, aks holda 0. (np.where()).\n5. NaN qiymatlar bo'lgan kichik DataFrame yarating: NaN larni o'rtacha yoki 0 bilan to'ldiring.\n6. (Challenge) Real CSV faylni topib (masalan: titanic.csv), df = pd.read_csv('titanic.csv'), ustunlarni ko'rib chiqing, yashaganlarni (Survived=1) filtrelang.",
            summary: "Bugun Pandas: DataFrame/Series, CSV o'qish/saqlash, indeks, filter, groupby, ustun qo'shish, NaN. Keyingi — Matplotlib (visualization)!",
            exercises: [
              {
                id: 'pyPdEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — DataFrame va yangi ustun 📊',
                instruction: "df = pd.DataFrame({'nom':['Olma','Banan','Pomidor'], 'narx':[15000, 20000, 14000], 'miqdor':[100,50,70]}). YANGI ustun qo'shing: 'umumiy_narx' = narx * miqdor. Va umumiylarni print qiling.",
                startCode: "import pandas as pd\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "umumiy_narx.*narx.*miqdor", msg: "df['umumiy_narx'] = df['narx'] * df['miqdor'] qo'shing" }
                ],
                hint: "df['umumiy_narx'] = df['narx'] * df['miqdor']",
                explanation: "Pandas da ustunlar to'g'ridan-to'g'ri ko'paytiriladi.",
                xp: 10
              },
              {
                id: 'pyPdEx2',
                type: 'dragdrop',
                title: '2-MASHQ — CSV pipeline yig‘ish 🧩',
                instruction: "Data Science pipeline: CSV o'qish → head → filter → saqlash tartibini yig'ing.",
                hint: "read_csv → head → filter → to_csv",
                items: ['import pandas as pd', "df = pd.read_csv('data.csv')", 'df.head()', "df[df['narx'] > 10000]", "df.to_csv('filtered.csv', index=False)"],
                xp: 10
              },
              {
                id: 'pyPdEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Groupby da xatolik: KeyError: 'mean' yo'q? Yoki Python 'and' sababli ValueError? — qaysi biri?",
                code: "import pandas as pd\ndf = pd.DataFrame({'k':['A','A','B','B'], 'v':[1,2,3,4]})\n# Sababi bu xato beradi ValueError: The truth value...\nres = df[(df['k'] == 'A') and (df['v'] > 1)]\nprint(res)",
                options: ["Python 'and' emas & (ampersand) va HAR SHART QAVS ICHIDA", "groupby kerak emas", "'v' ustuni nomi noto'g'ri", "sort_values qilinmagan"],
                answer: 0,
                explanation: "NumPy/Pandas da 'and' ishlamaydi! & ishlatishingiz kerak, VA HAR SHART QAVS ICHIDA: df[(df.k=='A') & (df.v>1)].",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Pandas asosiy 2 ta obyekti?",
                options: ["Array va List", "Series va DataFrame", "Table va Row", "dict va list"],
                answer: 1,
                explanation: "Series 1D, DataFrame 2D (jadval)."
              },
              {
                question: "CSV faylni o'qish uchun?",
                options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.parse_csv()"],
                answer: 1,
                explanation: "pd.read_csv() — CSV o'qish. Saqlash: df.to_csv()."
              },
              {
                question: "DataFrame dastlabki 5 qatorini ko'rish uchun?",
                options: ["df.first()", "df.head()", "df.top()", "df.start()"],
                answer: 1,
                explanation: "df.head(N) — N ta bosh qator. tail() — oxirgi."
              },
              {
                question: "df[(df.oylik > 1e6) and (df.yosh < 30)] — ValueError sababi?",
                options: ["Raqam noto'g'ri", "'and' emas &, va har shart qavs ichida bo'lishi kerak", "ustun nomi noto'g'ri", "df emas Series kerak"],
                answer: 1,
                explanation: "and → &, | → or. Va HAR SHART QAVSGA OLINGAN! ( ) around each condition."
              },
              {
                question: "Guruhlash uchun funksiya?",
                options: ["df.group()", "df.groupby()", "df.cluster()", "df.aggregate()"],
                answer: 1,
                explanation: "df.groupby('ustun').agg(['sum','mean','count'])."
              },
              {
                question: "Pandas da NaN qiymatlar soni topish uchun?",
                options: ["df.null()", "df.isna().sum()", "df.count_nan()", "df.nan_count()"],
                answer: 1,
                explanation: "df.isna() — True/False matrix, .sum() → ustunlar bo'yicha."
              },
              {
                question: "Raqamli ustunlar umumiy statistikasi uchun?",
                options: ["df.info()", "df.describe()", "df.stat()", "df.summary()"],
                answer: 1,
                explanation: "df.describe() → count, mean, std, min, 25/50/75%, max."
              },
              {
                question: "CSV ga saqlashda indeks saqlanmasligi uchun?",
                options: ["no_index=True", "index=False", "drop_index=True", "header=False"],
                answer: 1,
                explanation: "df.to_csv('f.csv', index=False) → 0,1,2... index faylga yozilmaydi."
              }
            ]
          }
        },
        {
          title: 'Matplotlib',
          duration: 25,
          xp: 35,
          content: {
            intro: "Matplotlib — Python da MA'LUMOTLARNI CHIZMA GRAFIKKA (visualize) aylantirish uchun ENG KENG ISHLATILADIGAN KUTUBXONA. Line plot, bar, scatter, pie, histogram va boshqa turdagi chizmalarni yaratish mumkin.",
            sections: [
              {
                title: 'O‘rnatish va oddiy line plot',
                text: "O'rnatish: pip install matplotlib\n\nplt — matplotlib.pyplot qisqartma.",
                code: "# pip install matplotlib\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# 1) Oddiy chiziqli grafik (Line Plot)\nx = [1, 2, 3, 4, 5, 6, 7]\ny = [2, 4, 6, 8, 10, 12, 14]\n\nplt.figure(figsize=(8, 4))  # o'lcham: eni, boyi (inch)\nplt.plot(x, y, marker='o', color='blue', linestyle='-', linewidth=2, label='y = 2x')\nplt.title('Oddiy Line Plot (y = 2x)', fontsize=14)\nplt.xlabel('X o‘qi', fontsize=12)\nplt.ylabel('Y o‘qi', fontsize=12)\nplt.grid(True, linestyle='--', alpha=0.5)\nplt.legend()\nplt.tight_layout()\nprint('Chizma yaratildi (plt.show() bilan ko'rinadi — bu yerda print orqali)')\nprint('O‘lcham (8x4), marker=o (doira), linewidth=2, grid bor, legend bor.')",
                codeNote: "plt.show() — grafikni ko'rsatish (IDE/terminalda). plt.savefig('plot.png') — faylga saqlash.",
                result: "Chizma yaratildi (plt.show() bilan ko'rinadi — bu yerda print orqali)\\nO‘lcham (8x4), marker=o (doira), linewidth=2, grid bor, legend bor.",
                note: "Jupyter da %matplotlib inline — inline ko'rsatish."
              },
              {
                title: 'Turli chiziqlar va subplot',
                text: "Bir chizmada bir nechta chiziq va subplot (2x2, 1x2).",
                code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 2 * np.pi, 100)  # 0 dan 2π gacha 100 ta nuqta\nsin_x = np.sin(x)\ncos_x = np.cos(x)\n\n# 1) Bitta chizmada 2 ta chiziq\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))  # 1 qator, 2 ustun\n\n# Ax1: sin + cos bir joyda\nax1.plot(x, sin_x, 'r-', label='sin(x)')   # 'r-' = qizil chiziq\nax1.plot(x, cos_x, 'b--', label='cos(x)')  # 'b--' = ko'k punktir\nax1.set_title('Sin va Cos bir chizmada')\nax1.set_xlabel('x radian')\nax1.set_ylabel('Qiymat')\nax1.legend()\nax1.grid(alpha=0.3)\n\n# Ax2: sin^2\nax2.plot(x, sin_x**2, 'g-.', linewidth=2)\nax2.set_title('sin^2(x) — to'rtini olganda doim musbat')\nax2.set_xlabel('x radian')\nax2.fill_between(x, sin_x**2, alpha=0.2, color='green')\nax2.grid(alpha=0.3)\n\nplt.tight_layout()\nprint('1x2 subplot yaratildi: chap → sin+cos, o'ng → sin²')",
                codeNote: "plt.subplots(nrows, ncols) → grid. 'r-', 'g--', 'b:' — rang va stil qisqartma.",
                result: "1x2 subplot yaratildi: chap → sin+cos, o'ng → sin²",
                note: "Ranglar: r=red, g=green, b=blue, c=cyan, m=magenta, y=yellow, k=black, w=white."
              },
              {
                title: 'Bar plot va Histogram',
                text: "Bar — kategoriyali ma'lumotlar. Histogram — taqsimot.",
                code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 4))\n\n# 1) Bar — kategoriyali\nshaharlar = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Navoiy']\naxoli = [3.0, 0.6, 0.4, 0.5, 0.3]  # million kishi\ncolors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']\n\naxes[0].bar(shaharlar, axoli, color=colors, edgecolor='black')\naxes[0].set_title('O‘zbekiston shaharlari aholisi (million)', fontsize=12)\naxes[0].set_ylabel('Aholi (mln)')\nfor i, v in enumerate(axoli):\n    axes[0].text(i, v + 0.05, str(v), ha='center')\n\n# 2) Histogram — taqsimot\nnp.random.seed(42)\ntalabalar_bali = np.random.normal(loc=70, scale=10, size=500)  # o'rtacha 70, std=10, 500 ta\naxes[1].hist(talabalar_bali, bins=20, color='skyblue', edgecolor='black', alpha=0.7)\naxes[1].set_title('500 ta talabaning imtihon ballari taqsimoti')\naxes[1].set_xlabel('Ball')\naxes[1].set_ylabel('Talabalar soni')\naxes[1].axvline(talabalar_bali.mean(), color='red', linestyle='--', label=f"O'rtacha: {talabalar_bali.mean():.1f}")\naxes[1].legend()\naxes[1].grid(axis='y', alpha=0.3)\n\nplt.tight_layout()\nprint('Bar (shaharlar) va Histogram (ballar taqsimoti) yaratildi.')",
                codeNote: "bins = histogramda nechta ustun; axvline → vertikal chiziq.",
                result: "Bar (shaharlar) va Histogram (ballar taqsimoti) yaratildi.",
                note: "Kichik ma'lumotlar uchun bar, katta miqdordagi raqamlarni taqsimoti uchun histogram."
              },
              {
                title: 'Scatter plot va Pie chart',
                text: "Scatter — nuqtalar (2 o'zgaruvchi bog'lanishi). Pie — pie chart (qisimlar).",
                code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))\n\n# 1) Scatter Plot: Oylik ish haqi vs staj (bog'lanish)\nnp.random.seed(123)\nstaj = np.random.randint(1, 20, size=80)\noylik = 3_000_000 + staj * 700_000 + np.random.randn(80) * 500_000  # noise\n\nsc = ax1.scatter(staj, oylik, c=oylik, cmap='viridis', s=80, alpha=0.7, edgecolor='black')\nplt.colorbar(sc, ax=ax1, label='Oylik miqdori')\nax1.set_title('Staj vs Oylik (scatter)')\nax1.set_xlabel('Staj (yil)')\nax1.set_ylabel('Oylik (so‘m)')\nax1.grid(alpha=0.3)\n\n# 2) Pie chart: Xarajatlar kategoriyasi bo'yicha\nxarajat = {'Qaynoq':40, 'Transport':15, 'Oziq-ovqat':25, 'Xizmatlar':10, 'Boshqa':10}\nkat = list(xarajat.keys())\nqiymat = list(xarajat.values())\nexplode = [0.1, 0, 0, 0, 0]  # 1-chi qismni biroz ajratish\n\nwedges, texts, autotexts = ax2.pie(qiymat, labels=kat, autopct='%1.1f%%',\n        startangle=90, explode=explode, shadow=True, colors=plt.cm.Set2.colors)\nax2.set_title('Oylik xarajatlar strukturi (%)')\nax2.axis('equal')  # to'g'ri doira\n\nplt.tight_layout()\nprint('Scatter (staj vs oylik) va Pie (xarajatlar %) yaratildi.')",
                codeNote: "cmap='viridis' — ranglar sxemasi; autopct='%1.1f%%' → pie ustiga foiz.",
                result: "Scatter (staj vs oylik) va Pie (xarajatlar %) yaratildi.",
                note: "Seaborn — Matplotlib ustiga qurilgan, chiroyliroq (sns.histplot, sns.boxplot...)"
              },
              {
                title: "Pandas bilan birga ishlatish + savefig()",
                text: "df.plot() — Pandas orqali tez chizmalar.",
                code: "import matplotlib.pyplot as plt\nimport pandas as pd\nimport numpy as np\n\n# DataFrame yaratamiz\ndata = {'Oy':['Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek'],\n        'Kirim':[10, 12, 15, 18, 22, 28, 35, 32, 25, 20, 15, 13],\n        'Chiqim':[8, 9, 10, 12, 14, 18, 22, 21, 16, 13, 11, 9]}\ndf = pd.DataFrame(data)\ndf['Foyda'] = df['Kirim'] - df['Chiqim']\nprint('DataFrame (oylik):'); print(df)\n\n# Pandas orqali chizma\nax = df.plot(x='Oy', y=['Kirim','Chiqim','Foyda'], kind='line',\n        marker='o', figsize=(10,5), title='Oylik Kirim-Chiqim-Foyda (million so‘m)',\n        color=['green','red','blue'])\nax.set_xlabel('Oy')\nax.set_ylabel('Miqdor (mln so‘m)')\nax.grid(True, linestyle='--', alpha=0.5)\nax.fill_between(df['Oy'], df['Foyda'], alpha=0.1, color='blue')\nplt.tight_layout()\n\n# SAQLASH\n# plt.savefig('kirim_chiqim.png', dpi=150, bbox_inches='tight')  # faylga saqlash\nprint('\\n✅ Pandas .plot() orqali chizma yaratildi. savefig() bilan PNG/SVG/PDF ga saqlash mumkin.')",
                codeNote: "kind: 'line','bar','barh','hist','box','scatter','pie'...",
                result: "DataFrame (oylik):\\n     Oy  Kirim  Chiqim  Foyda\\n0   Yan     10       8      2\\n1   Fev     12       9      3\\n2   Mar     15      10      5\\n3   Apr     18      12      6\\n4   May     22      14      8\\n5  Iyun     28      18     10\\n6  Iyul     35      22     13\\n7   Avg     32      21     11\\n8   Sen     25      16      9\\n9   Okt     20      13      7\\n10  Noy     15      11      4\\n11  Dek     13       9      4\\n\\n✅ Pandas .plot() orqali chizma yaratildi. savefig() bilan PNG/SVG/PDF ga saqlash mumkin.",
                note: "plt.style.use('seaborn-v0_8') / 'ggplot' — uslubni o'zgartirish."
              },
              {
                title: 'Xulosa',
                text: "Matplotlib — vizualizatsiyaning asosi. Pandas + NumPy + Matplotlib → Data Science triadasi!"
              }
            ],
            keyPoints: [
              "import matplotlib.pyplot as plt; plt.plot/scatter/bar/hist/pie",
              "plt.figure(figsize=(W,H)); title, xlabel, ylabel, legend, grid",
              "plt.subplots(nrows,ncols) → ko'p chizmali (ax1, ax2...)",
              "df.plot(kind='line'/'bar'/'hist'/'pie') — Pandas bilan tez",
              "plt.savefig('file.png', dpi=150) — saqlash; plt.show() — ko'rsatish",
              "cmap rang sxemalari (viridis, Set2), marker, linestyle, linewidth, alpha",
              "Seaborn — pandas bilan yaxshi ishlaydigan高级 chizmalar (sns.boxplot/heatmap/violinplot)"
            ],
            masterXp: 35,
            homework: "1. plt.plot([1,2,3,4,5],[1,4,9,16,25]) — y=x² chizmasini chizing, marker='s', rang='red', title qo'shing.\n2. Kategoriya: ['Python','JS','Java','C++','Go'], foiz: [45,20,15,10,10] — bar chart chizing.\n3. np.random.normal(50, 10, 1000) — 1000 ta sonning histogrammasini chizing (bins=30).\n4. Pie chart: Xonadon xarajatlari (uy, oziq, transport, kommunal, boshqa) — explode 1 ta qismi ajratilgan holda.\n5. DataFrame: 6 oy uchun 2 ta kompaniya daromadi (line plot) — df.plot(), legend, grid.\n6. (Challenge) Titanic CSV: df['Survived'] ni taqqoslovchi bar chart (0/1) va 'Pclass' × Survived groupby barplot.",
            summary: "Bugun Matplotlib: line/bar/hist/scatter/pie, subplot, pandas plot, savefig. Keyingi — Virtual Environment!",
            exercises: [
              {
                id: 'pyMplEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Oddiy line plot 📈',
                instruction: "plt.plot(x, x_kvadrat) chizing: x = [1,2,3,4,5], x ning kvadrati = [1,4,9,16,25]. title('y = x²'), xlabel/ylabel qo'shing.",
                startCode: "import matplotlib.pyplot as plt\nx = [1,2,3,4,5]\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "plt\\.plot\\s*\\(\\s*x", msg: "plt.plot(x, kvadrati) → ishlating" },
                  { re: "plt\\.title", msg: "title('y = x²') qo'shing" }
                ],
                hint: "y = [i**2 for i in x]; plt.plot(x,y); plt.title(...); plt.show()",
                explanation: "plt.plot chiziqli grafik yaratadi.",
                xp: 10
              },
              {
                id: 'pyMplEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Chizma pipeline 🧩',
                instruction: "Oddiy plot yaratish tartibini to'g'rilang.",
                hint: "import → figure/data → plot → title/labels → show/save",
                items: ['import matplotlib.pyplot as plt', 'plt.figure(figsize=(8,4))', 'plt.plot(x, y)', 'plt.title(), plt.xlabel(), plt.ylabel()', 'plt.legend(), plt.grid()', 'plt.show() / plt.savefig()'],
                xp: 10
              },
              {
                id: 'pyMplEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Grafikning x y o'lchamlari juda kichik chiqyapti, to'liq sig'mayapti. Sababi?",
                code: "import matplotlib.pyplot as plt\nimport pandas as pd\ndf = pd.DataFrame({'a':list(range(1000))})\ndf.plot(kind='line', title='Juda uzun sarlavha bu uzoq cho'ziladi...')\nplt.show()  # Nima uchun o'lcham chalg'itadi?",
                options: ["kind noto'g'ri", "tight_layout() ishlatilmagan (yoki figsize kichik)", "Juda katta data", "title juda qisqa"],
                answer: 1,
                explanation: "plt.tight_layout() — elementlarning bir-birining ustiga chiqishini oldini oladi. Yoki figsize=(W,H) kattaroq berilsa.",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Matplotlib plot qisqartmasi?",
                options: ["import plt", "import matplotlib.pyplot as plt", "import matplotlib as plt", "from plot import plt"],
                answer: 1,
                explanation: "import matplotlib.pyplot as plt — standart."
              },
              {
                question: "Grafikni PNG faylga saqlash uchun?",
                options: ["plt.png()", "plt.savefig()", "plt.download()", "plt.export()"],
                answer: 1,
                explanation: "plt.savefig('name.png', dpi=150) → saqlash."
              },
              {
                question: "1 qator 2 ustunli subplot yaratish uchun?",
                options: ["plt.split(1,2)", "plt.subplots(1, 2)", "plt.multi(1,2)", "plt.subplot(1x2)"],
                answer: 1,
                explanation: "fig, (ax1, ax2) = plt.subplots(1, 2) → 1 qator, 2 ustun."
              },
              {
                question: "Kategoriyali ustunli grafik?",
                options: ["plt.hist()", "plt.bar()", "plt.scatter()", "plt.line()"],
                answer: 1,
                explanation: "bar = ustunli. hist = histogram (taqsimot)."
              },
              {
                question: "Ikki o'zgaruvchaning (staj, oylik) nuqtalarni ko'rsatish uchun?",
                options: ["bar", "scatter", "pie", "hist"],
                answer: 1,
                explanation: "scatter plot — nuqtalar grafigi."
              },
              {
                question: "Pie chart da foizlarni ko'rsatish uchun parametr?",
                options: ["labels=", "autopct='%1.1f%%'", "percent=True", "show_pct=True"],
                answer: 1,
                explanation: "autopct='%1.1f%%' → pie chiziq ustiga foiz."
              },
              {
                question: "Elementlarning ustiga chiqishini oldini olish uchun?",
                options: ["plt.strict_layout()", "plt.tight_layout()", "plt.no_overlap()", "plt.clean_layout()"],
                answer: 1,
                explanation: "plt.tight_layout() → avtomatik joylashuv."
              },
              {
                question: "Pandas DataFrame dan to'g'ridan chizma uchun?",
                options: ["df.graph()", "df.plot()", "df.draw()", "df.chart()"],
                answer: 1,
                explanation: "df.plot(kind='line'/'bar'/'hist'/'scatter'/'pie')."
              }
            ]
          }
        },
        {
          title: 'Virtual environment',
          duration: 15,
          xp: 25,
          content: {
            intro: "Virtual Environment (virtualenv, venv) — LOYIHALARNI BIR-BIRIDAN AJRATISH UCHUN XOSIL QILINADIGAN MUHIT. Har bir loyiha uchun O'ZIGA XOS paket va Python versiyasini saqlash imkonini beradi. Bitta loyiha uchun pandas 2.0, boshqasi 1.5 — aralashib ketmaydi.",
            sections: [
              {
                title: 'Nima uchun virtual environment kerak?',
                text: "Muammo — GLOBAL paketlar oraliq to'qnashuv (dependency conflict):\n\n❌ Global yozayotganingizda:\n• Loyiha A → requests==2.28 kerak\n• Loyiha B → requests==2.31 kerak\nIkkalasini global o'rnata olmaysiz — biri buziladi!\n\n✅ VEnv yordamida:\n• Loyiha A → ./venv/ → requests 2.28 o'rnatilgan\n• Loyiha B → ./venv/ → requests 2.31 o'rnatilgan\nTo'liq ajratilgan, aralashmaydi!",
                code: "# Virtual muhit — umumiy tushuncha\n# Loyiha strukturasi:\n# my_project/\n# ├── venv/              ← virtual muhit (automatic yaratiladi)\n# │   ├── Lib/Scripts/   ← Python + paketlar bu yerda\n# ├── main.py            ← loyiha kodi\n# └── requirements.txt   ← paketlar ro'yxati (freeze)\nprint('Virtual muhit → HAR LOYIHA UCHUN ALOHIDA PAKETLAR!')\nprint('Globalga aslo ishonmang — har loyihaga venv!')\nprint('')\nprint('Windows PowerShell da activate: \\\\venv\\\\Scripts\\\\Activate.ps1')\nprint('Linux/Mac terminal:        source venv/bin/activate')",
                codeNote: "venv — Python 3.3+ da built-in (qo'shimcha o'rnatish kerak emas!)",
                result: "Virtual muhit → HAR LOYIHA UCHUN ALOHIDA PAKETLAR!\\nGlobalga aslo ishonmang — har loyihaga venv!\\n\\nWindows PowerShell da activate: \\\\venv\\\\Scripts\\\\Activate.ps1\\nLinux/Mac terminal:        source venv/bin/activate",
                note: "virtualenv — eski paket (ham ishlaydi). venv — built-in."
              },
              {
                title: 'venv yaratish va activate (Windows + Unix)',
                text: "Terminal buyruqlari (terminal/command prompt da bajariladi).",
                code: "# ==== 1-STEP: Virtual muhit YARATISH (har doim 1 marta) ====\n# Barcha OS da bir xil:\n# python -m venv venv\n#    yoki (agar python3):\n# python3 -m venv venv\n# Bu buyruq 'venv' nomli papka yaratadi va ichiga Python nusxasini va paketlar uchun joy tashkil qiladi.\n\nprint('=== BUYRUQLAR (Terminalda!) ===')\nprint('')\nprint('1) Yaratish:')\nprint('   Windows / Linux / Mac:  python -m venv venv')\nprint('   (agar python bo'lmasa: python3 -m venv venv)')\nprint('')\nprint('2) ACTIVATE qilish:')\nprint('   Windows CMD:         venv\\\\Scripts\\\\activate.bat')\nprint('   Windows PowerShell:  venv\\\\Scripts\\\\Activate.ps1')\nprint('   (⚠️  PowerShell da xato bersa: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned)')\nprint('   Linux / macOS:       source venv/bin/activate')\nprint('')\nprint('   ✅ Activate bo'lsa: (venv) — terminal boshida ko'rinadi!')\nprint('')\nprint('3) DEACTIVATE qilish (chiqish):')\nprint('   Har doim:  deactivate')\n",
                codeNote: "Agar PowerShell da activate qilmaza → Execution Policy ni ozgartiring (user scoped, RemoteSigned).",
                result: "=== BUYRUQLAR (Terminalda!) ===\\n\\n1) Yaratish:\\n   Windows / Linux / Mac:  python -m venv venv\\n   (agar python bo'lmasa: python3 -m venv venv)\\n\\n2) ACTIVATE qilish:\\n   Windows CMD:         venv\\\\Scripts\\\\activate.bat\\n   Windows PowerShell:  venv\\\\Scripts\\\\Activate.ps1\\n   (⚠️  PowerShell da xato bersa: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned)\\n   Linux / macOS:       source venv/bin/activate\\n\\n   ✅ Activate bo'lsa: (venv) — terminal boshida ko'rinadi!\\n\\n3) DEACTIVATE qilish (chiqish):\\n   Har doim:  deactivate",
                note: "Yaratilgan venv/ papkani GIT ga yubormang! .gitignore ga qo'sh!"
              },
              {
                title: 'Paket o‘rnatish + requirements.txt',
                text: "Activate bo'lgach — pip bilan paketlarni o'rnating. Keyin freeze → requirements.txt.",
                code: "print('=== PIP + REQUIREMENTS ===')\nprint('')\nprint('1) (venv) aktiv bo'lgan holda paket o‘rnatish:')\nprint('   pip install requests')\nprint('   pip install numpy pandas matplotlib')\nprint('   pip install \"requests>=2.31,<3\"')  # version range\nprint('   pip install -U requests  # upgrade to latest')\nprint('')\nprint('2) O‘rnatilgan barcha paketlarni SAQLASH (freeze):')\nprint('   pip freeze > requirements.txt')\nprint('   Bu fayl ichida: requests==2.31.0, urllib3==2.0.0, ...')\nprint('')\nprint('3) YANGI kompyuterda / serverda tiklash (restore):')\nprint('   pip install -r requirements.txt')\nprint('   Bu → requirements dagi BARCHA paketni TENG VERSIYA bilan o‘rnatadi!')\nprint('')\nprint('4) Paket o‘chirish:')\nprint('   pip uninstall pandas')\nprint('   pip list — o‘rnatilgan barcha paketlarni ko‘rsatish')",
                codeNote: "requirements.txt → boshqa ishlab chiquvchilarga / serverga bir xil muhitni yaratish uchun.",
                result: "=== PIP + REQUIREMENTS ===\\n\\n1) (venv) aktiv bo'lgan holda paket o‘rnatish:\\n   pip install requests\\n   pip install numpy pandas matplotlib\\n   pip install \"requests>=2.31,<3\"  # version range\\n   pip install -U requests  # upgrade to latest\\n\\n2) O‘rnatilgan barcha paketlarni SAQLASH (freeze):\\n   pip freeze > requirements.txt\\n   Bu fayl ichida: requests==2.31.0, urllib3==2.0.0, ...\\n\\n3) YANGI kompyuterda / serverda tiklash (restore):\\n   pip install -r requirements.txt\\n   Bu → requirements dagi BARCHA paketni TENG VERSIYA bilan o‘rnatadi!\\n\\n4) Paket o‘chirish:\\n   pip uninstall pandas\\n   pip list — o‘rnatilgan barcha paketlarni ko‘rsatish",
                note: "YANGI Python loyiha boshlashda: 1) mkdir loyiha, cd loyiha 2) python -m venv venv 3) activate 4) pip install ... 5) pip freeze > requirements.txt"
              },
              {
                title: '.gitignore va amaliy workflow',
                text: "venv/ va boshqa keraksiz fayllarni Git ga yubormang.",
                code: "print('=== .gitignore faylga qo‘shiladiganlar ===')\nprint('venv/                  # virtual muhit — HAR DOIM!')\nprint('.venv/')\nprint('__pycache__/           # Python cache')\nprint('*.pyc                  # bytecode')\nprint('.env                   # maxfiy kalitlar (API token, parollar)')\nprint('*.log                  # log fayllar')\nprint('.DS_Store (Mac)')\nprint('')\nprint('=== BEST PRACTICES ===')\nprint('1. HAR bir loyiha → yangi venv (global o‘rnatmang!)')\nprint('2. Loyihaning birinchi qadami: venv yaratish + activate')\nprint('3. Paket o‘rnatganingizdan keyin → pip freeze > requirements.txt')\nprint('4. requirements.txt → GIT ga yuborishingiz SHART!')\nprint('5. venv/ → GIT GA YUBORMA (.gitignore!)')\nprint('6. Agar requirements.txt bo'lsa, pip install -r requirements.txt bilan tikla')\nprint('')\nprint('=== Qo‘shimcha vositalar ===')\nprint('poetry — keng tarqalgan zamonaviy paket boshqaruvi (pyproject.toml)')\nprint('pipenv — boshqa variant')\nprint('conda — anaconda (Data Science uchun)')",
                codeNote: ".env fayl → python-dotenv o'rnating, os.environ['SECRET'] bilan o'qing.",
                result: "=== .gitignore faylga qo‘shiladiganlar ===\\nvenv/                  # virtual muhit — HAR DOIM!\\n.venv/\\n__pycache__/           # Python cache\\n*.pyc                  # bytecode\\n.env                   # maxfiy kalitlar (API token, parollar)\\n*.log                  # log fayllar\\n.DS_Store (Mac)\\n\\n=== BEST PRACTICES ===\\n1. HAR bir loyiha → yangi venv (global o‘rnatmang!)\\n2. Loyihaning birinchi qadami: venv yaratish + activate\\n3. Paket o‘rnatganingizdan keyin → pip freeze > requirements.txt\\n4. requirements.txt → GIT ga yuborishingiz SHART!\\n5. venv/ → GIT GA YUBORMA (.gitignore!)\\n6. Agar requirements.txt bo'lsa, pip install -r requirements.txt bilan tikla\\n\\n=== Qo‘shimcha vositalar ===\\npoetry — keng tarqalgan zamonaviy paket boshqaruvi (pyproject.toml)\\npipenv — boshqa variant\\nconda — anaconda (Data Science uchun)",
                note: "Poetry — zamonaviy: poetry init, poetry add requests, poetry install."
              },
              {
                title: 'Xulosa',
                text: "Venv — professional dasturchi uchun BUTUNLAYDI ob zaro. Endi biz testlashni o'rganamiz!"
              }
            ],
            keyPoints: [
              "python -m venv venv — yaratish (built-in, qo'shimcha kerak emas)",
              "Activate: Windows (Scripts/activate(.bat|.ps1)), Unix: source venv/bin/activate",
              "Activatedan keyin (venv) → ko'rinadi; deactivate → chiqish",
              "pip install pkg / pip install -r req.txt / pip freeze > req.txt",
              "venv/, __pycache__, .env → .gitignore (git ga yuborilmaydi)",
              "PowerShell ExecutionPolicy: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (ishlatmasangiz error)",
              "Zamonaviy alternative: poetry, conda (anaconda data science)"
            ],
            masterXp: 25,
            homework: "1. Terminalda yangi papka yarating (mkdir test_venv), uning ichida python -m venv venv ni bajaring.\n2. venv ni activate qiling, terminal boshida (venv) chiqishini tekshiring.\n3. pip install requests pandas ni bajaring. pip list bilan ko'ring.\n4. pip freeze > requirements.txt — faylni ochib ko'ring.\n5. Yangi papkada yangi venv yaratib, pip install -r requirements.txt bilan tiklab ko'ring.\n6. .gitignore fayl yarating: venv/, __pycache__/, .env qatorlarini qo'shing.\n7. (Challenge) Poetry o'rnatib ko'ring: pip install poetry → poetry new project → poetry add requests → poetry install.",
            summary: "Bugun Virtual Environment: venv yaratish, activate/deactivate, pip, requirements, gitignore. Keyingi — Testlash (unittest va pytest)!",
            exercises: [
              {
                id: 'pyVenvEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Requirements string 📦',
                instruction: "pip_freeze_list = ['requests==2.31.0','numpy==1.26.0','pandas==2.1.0'] — ro'yxatdan requirements.txt faylga string ko'rinishida yozing (\\n bilan ajrating). Print qiling natijani.",
                startCode: "pip_freeze_list = ['requests==2.31.0','numpy==1.26.0','pandas==2.1.0']\n# Bu yerga kodingizni yozing: '\\n'.join(...)",
                checks: [
                  { re: "\\.join\\s*\\(\\s*pip_freeze_list", msg: "'\\\\n'.join(pip_freeze_list) ni ishlating" }
                ],
                hint: "req_content = '\\n'.join(pip_freeze_list); print(req_content)",
                explanation: "pip freeze natijasi har bir paket alohida qatorda.",
                xp: 10
              },
              {
                id: 'pyVenvEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Venv workflow tartibi 🧩',
                instruction: "Yangi loyiha uchun venv workflow ni to'g'ri tartiblang.",
                hint: "yaratish → activate → paket o'rnatish → freeze → gitignore",
                items: ['python -m venv venv', 'venv/Scripts/activate yoki source venv/bin/activate → (venv)', 'pip install requests pandas', 'pip freeze > requirements.txt', 'venv/ ni .gitignore ga qo‘shish'],
                xp: 10
              },
              {
                id: 'pyVenvEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Loyiha serverga tushdi, pip install -r requirements.txt ni bajarsa ham paketlar yo'q. Nima sabab?",
                code: "# Loyiha papkasida sizda:\n# venv/             (ko'pchilik unutadi)\n# main.py\n# .gitignore:  .env  __pycache__   (VENV YO'Q — XATO QAYERDA?)",
                options: ["requirements.txt GIT GA YO'Q YOKI .gitignore da venv kiritilmagan/saqlanmagan", "main.py noto'g'ri", "Python versiyasi", "pip eski versiyasi"],
                answer: 0,
                explanation: "2 ta ehtimol: 1) requirements.txt yaratilmagan (pip freeze qilinmagan). 2) venv/ .gitignore da (to'g'ri) lekin requirements.txt git ga tushmagan. YOKI user requirements.txt emas venv ni git yuborgan (venv tug'ri yuborilmaydi, req.txt yuborilishi kerak).",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Virtual muhit yaratish uchun (built-in Python)?",
                options: ["pip venv make", "python -m venv venv", "python create venv", "pip install venv"],
                answer: 1,
                explanation: "python -m venv venv — standard, built-in (3.3+)."
              },
              {
                question: "Windows PowerShell da activate qilish?",
                options: ["venv/bin/activate", "venv\\Scripts\\Activate.ps1", "activate venv", "source venv/activate"],
                answer: 1,
                explanation: "PowerShell → .ps1. CMD → .bat. Linux/Mac → source bin/activate."
              },
              {
                question: "O'rnatilgan paketlarni requirements.txt ga saqlash?",
                options: ["pip save requirements.txt", "pip freeze > requirements.txt", "pip requirements save", "pip dump > req.txt"],
                answer: 1,
                explanation: "pip freeze > req.txt — redirect natijani faylga."
              },
              {
                question: "requirements.txt dan tiklash?",
                options: ["pip install -r requirements.txt", "pip restore requirements.txt", "pip load req.txt", "pip reinstall -f req.txt"],
                answer: 0,
                explanation: "pip install -r (from file)."
              },
              {
                question: "GIT ga venv yubormaslik uchun .gitignore ga?",
                options: ["venv.txt", "venv/ (venv folder)", "exclude venv", "!venv"],
                answer: 1,
                explanation: "venv/ — butun papkani ignore qiladi."
              },
              {
                question: "PowerShell activate qilganda 'Execution Policy xatosi' bera oladi. Yechimi?",
                options: ["Kompyuterni qayta yuklash", "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned", "CMD dan foydalanmaslik", "pip install ps-execution"],
                answer: 1,
                explanation: "PowerShell Execution Policy CurrentUser → RemoteSigned (user uchun)."
              },
              {
                question: "Zamonaviy paket boshqaruvi (poetry) buyruq paket qo'shish?",
                options: ["poetry add pandas", "poetry install pandas", "poetry new pandas", "poetry include pandas"],
                answer: 0,
                explanation: "poetry add <pkg> → qo'shish."
              },
              {
                question: "Virtual muhitni CHIQISH (deactivate)?",
                options: ["exit", "close", "deactivate", "logout"],
                answer: 2,
                explanation: "Hamma OS da deactivate buyrug'i."
              }
            ]
          }
        },
        {
          title: 'Testlash (unittest/pytest)',
          duration: 25,
          xp: 35,
          content: {
            intro: "Testlash — KODINGIZ TO'G'RI ISHLAYOTGANIGA ISHONCH HOSIL QILADI va xatolarni erta topishga yordam beradi. Python da 2 ta mashhur framework:\n\n• unittest — built-in (o'rnatish kerak emas, stadard)\n• pytest — eng ommabop, sodda, keng imkoniyatli (qo'shimcha o'rnatiladi)",
            sections: [
              {
                title: 'Nima uchun test yozamiz?',
                text: "Testlashning asosiy maqsadlari:\n\n✅ Ishonch — kod ishlayotganiga amin bo'lish\n✅ Regressiya — o'zgartirishdan keyin eski funksiyalar buzilmaganiga ishonch\n✅ Refactoring — xavfsiz o'zgartirish\n✅ Documentation — test qanday ishlashi haqida hujjat\n✅ Tez xato topish — kichik funksiyalarni tez tekshirish",
                code: "# Oddiy funksiya (testlanishi kerak)\ndef kvadrat(son):\n    \"\"\"Sonni kvadratga ko'taradi\"\"\"\n    return son * son\n\ndef toqmi(son):\n    \"\"\"Son toqmi? True/False\"\"\"\n    return son % 2 == 1\n\ndef toliq_ism(ism, familiya):\n    \"\"\"Ism + familiya -> 'Ali Valiyev'\"\"\"\n    return f'{ism.strip().capitalize()} {familiya.strip().capitalize()}'\n\nprint('✅ Oddiy funktsiyalar yozildi: kvadrat(5)=', kvadrat(5))\nprint('✅ toqmi(7)=', toqmi(7), '  toqmi(8)=', toqmi(8))\nprint('✅ toliq_ism(\"  aLi \",\"  vaLiYeV \")=', toliq_ism('  aLi ','  vaLiYeV '))",
                codeNote: "Keyin shu funksiyalar uchun test yozamiz!",
                result: "✅ Oddiy funktsiyalar yozildi: kvadrat(5)= 25\\n✅ toqmi(7)= True   toqmi(8)= False\\n✅ toliq_ism(\"  aLi \",\"  vaLiYeV \")= Ali Valiyev",
                note: "Har bir funksiya → kamida 2-3 ta test holati (mantiqiy)."
              },
              {
                title: 'unittest — built-in framework',
                text: "unittest — Python ga kirishgan, class ga asoslangan (Java JUnitga o'xshash). Test class → unittest.TestCase dan voris oladi; metodlar test_ bilan boshlanadi.",
                code: "# === test_math_utils.py === (unittest uslubi)\nimport unittest\n\n# Testlanadigan funksiyalar (alohida modulda bo'ladi)\ndef kvadrat(son): return son * son\ndef toqmi(son): return son % 2 == 1\ndef toliq_ism(ism, familiya):\n    return f'{ism.strip().capitalize()} {familiya.strip().capitalize()}'\n\n# Test CLASSI\nclass TestMathFunksiyalar(unittest.TestCase):\n    \"\"\"kvadrat() va toqmi() uchun testlar\"\"\"\n\n    def test_kvadrat_musbat(self):\n        self.assertEqual(kvadrat(5), 25)\n        self.assertEqual(kvadrat(0), 0)\n        self.assertEqual(kvadrat(10), 100)\n\n    def test_kvadrat_manfiy(self):\n        self.assertEqual(kvadrat(-3), 9)\n        self.assertEqual(kvadrat(-5), 25)\n\n    def test_toqmi_toq(self):\n        self.assertTrue(toqmi(7))\n        self.assertTrue(toqmi(1))\n\n    def test_toqmi_juft(self):\n        self.assertFalse(toqmi(8))\n        self.assertFalse(toqmi(0))\n\nclass TestIsmFormat(unittest.TestCase):\n    def test_toliq_ism_oddiy(self):\n        self.assertEqual(toliq_ism('Ali','Valiyev'), 'Ali Valiyev')\n\n    def test_toliq_ism_boshjoy_katta(self):\n        self.assertEqual(toliq_ism('  aLi ','  vaLiYeV '), 'Ali Valiyev')\n\nprint('🔍 unittest class tayyor! Ishga tushurish: python -m unittest test_xxx.py -v')\nprint('Yoki kod oxirida: unittest.main()')\n\n# Hozir run qilish (kod ichida)\nif __name__ == '__main__':\n    loader = unittest.TestLoader()\n    suite = unittest.TestSuite()\n    suite.addTests(loader.loadTestsFromTestCase(TestMathFunksiyalar))\n    runner = unittest.TextTestRunner(verbosity=2)\n    result = runner.run(suite)\n    print(f'\\n✅ O‘tdi: {result.testsRun - len(result.failures) - len(result.errors)} / {result.testsRun}')",
                codeNote: "assertEqual(a,b) → tengmi? assertTrue(x) → True? assertFalse(x) → False? assertRaises → xato chiqaradimi?",
                result: "🔍 unittest class tayyor! Ishga tushurish: python -m unittest test_xxx.py -v\\nYoki kod oxirida: unittest.main()\\ntest_kvadrat_manfiy (__main__.TestMathFunksiyalar) ... ok\\ntest_kvadrat_musbat (__main__.TestMathFunksiyalar) ... ok\\ntest_toqmi_juft (__main__.TestMathFunksiyalar) ... ok\\ntest_toqmi_toq (__main__.TestMathFunksiyalar) ... ok\\n\\n----------------------------------------------------------------------\\nRan 4 tests in 0.001s\\n\\nOK\\n✅ O‘tdi: 4 / 4",
                note: "verbosity=2 → batafsil chiqish."
              },
              {
                title: 'pytest — zamonaviy testlash',
                text: "pytest — eng keng tarqalgan. Oson: test_ bilan boshlangan FUNKSIYALAR. Class ham bo'laveradi (lekin shart emas). pip install pytest.",
                code: "# === test_pytest_math.py === (pytest uslubi)\n# pip install pytest\n\n# Testlanadigan funk\ndef divide(a, b):\n    if b == 0:\n        raise ValueError('Nolga bo‘lish mumkin emas!')\n    return a / b\n\n# Oddiy PYTEST: funksiya test_ bilan boshlanadi!\nimport pytest\n\ndef test_divide_oddiy():\n    assert divide(10, 2) == 5\n    assert divide(9, 3) == 3.0\n    assert divide(-6, 2) == -3\n\ndef test_divide_nolga():\n    with pytest.raises(ValueError, match='Nolga'):\n        divide(10, 0)\n\n@pytest.mark.parametrize('a, b, natija', [\n    (10, 5, 2),\n    (20, 4, 5),\n    (100, 25, 4),\n    (15, 3, 5),\n])\ndef test_divide_param(a, b, natija):\n    \"\"\"Bir nechta holatni parametriza!\"\"\"\n    assert divide(a, b) == natija\n\nprint('✅ pytest tayyor! Run: pytest test_xxx.py -v')\nprint('✅ Parametrized testlar — bir xil kodni N marta turli input bilan!')\nprint('✅ pytest.raises(Exception) — xato chiqaradimi?')\nprint('✅ Fixture: @pytest.fixture — qayta ishlatiladigan test ma\\'lumotlari!')",
                codeNote: "pytest → assert (oddiy Python assert). @pytest.mark.parametrize → ko'p holatlar.",
                result: "✅ pytest tayyor! Run: pytest test_xxx.py -v\\n✅ Parametrized testlar — bir xil kodni N marta turli input bilan!\\n✅ pytest.raises(Exception) — xato chiqaradimi?\\n✅ Fixture: @pytest.fixture — qayta ishlatiladigan test ma'lumotlari!",
                note: "Coverage: pip install pytest-cov; pytest --cov=my_module → qancha qator qamrab olingan."
              },
              {
                title: "Fixtures va coverage (qamrov)",
                text: "Fixture → testlar uchun ma'lumot/ob'yektni avtomatik tayyorlash. Coverage → kodning qancha qismi testlanganligi %.",
                code: "import pytest\n\n# FIXTURE: barcha testlar uchun ma'lumot tayyorlaydi\n@pytest.fixture\ndef user_list():\n    \"\"\"Test uchun userlar ro'yxati (fixture)\"\"\"\n    return [\n        {'id': 1, 'name': 'Ali', 'age': 22},\n        {'id': 2, 'name': 'Vali', 'age': 31},\n        {'id': 3, 'name': 'Ziyoda', 'age': 19},\n        {'id': 4, 'name': 'Nodira', 'age': 27},\n    ]\n\ndef find_user(users, user_id):\n    for u in users:\n        if u['id'] == user_id:\n            return u\n    return None\n\n# Fixture funksiyani argument sifatida berasiz → avtomatik chaqiriladi!\ndef test_find_mavjud(user_list):\n    assert find_user(user_list, 2)['name'] == 'Vali'\n    assert find_user(user_list, 4)['age'] == 27\n\ndef test_find_mavjud_emas(user_list):\n    assert find_user(user_list, 999) is None\n    assert find_user(user_list, 0) is None\n\nprint('✅ Fixture (user_list) → HAR TEST oldidan AVTOMATIK tayyorlanadi!')\nprint('')\nprint('=== Coverage (qamrov) ===')\nprint('pip install pytest-cov')\nprint('pytest --cov=modul_nomi tests/          # coverage foiz')\nprint('pytest --cov=modul --cov-report=html    # HTML hisobot (interaktiv!)')\nprint('')\nprint('Best practice: coverage 80%+ ni saqlashga harakat qiling!')",
                codeNote: "fixture → scope='module' → bir marta (to'liq test moduli uchun); scope='session' → butun test sessiyasi.",
                result: "✅ Fixture (user_list) → HAR TEST oldidan AVTOMATIK tayyorlanadi!\\n\\n=== Coverage (qamrov) ===\\npip install pytest-cov\\npytest --cov=modul_nomi tests/          # coverage foiz\\npytest --cov=modul --cov-report=html    # HTML hisobot (interaktiv!)\\n\\nBest practice: coverage 80%+ ni saqlashga harakat qiling!",
                note: "TDD (Test-Driven Development): AVVAL test yoz → KEYIN kod. Qizil (xato) → Yashil (o'tdi) → Refactor."
              },
              {
                title: 'Testlash turi va best practices',
                text: "Test turlari:\n\n1. Unit test — KICHIK bir funksiya/method (tez)\n2. Integration test — BIR NECHTA qism birgalikda (to'liq)\n3. E2E (End-to-End) — BUTUN dastur (eng sekin)\n\nBest practices:\n• test_ qoidalarga rioya qil (nomlash)\n• Bir test → BIR ASOSIY tekshiruv\n• Tez bo'lsin (sekin narsalarni mock qiling)\n• CI/CD da avtomatik run qiling (GitHub Actions, GitLab CI...)\n• Fixture qayta foydalanish — dry",
                code: "print('=== Testlash Best Practices ===')\nprint('1️⃣  NOMLASH: test_funktsiya_nomi_holati (test_toliq_ism_boshjoy))')\nprint('2️⃣  ARRANGE → ACT → ASSERT pattern:')\nprint('   # ARRANGE: ma\\'lumot tayyorlash')\nprint('   a, b = 10, 2')\nprint('   # ACT: funksiyani chaqirish')\nprint('   natija = divide(a, b)')\nprint('   # ASSERT: natija tekshirish')\nprint('   assert natija == 5')\nprint('')\nprint('3️⃣  pytest -v — verbose (batafsil) chiqim')\nprint('4️⃣  pytest -k \"kvadrat\" — faqat so‘zi bor testlar')\nprint('5️⃣  pytest -x — birinchi xatoda to‘xta')\nprint('6️⃣  Mocking: unittest.mock.patch → tashqi bog‘liqlikni (API, DB) almashtirish (tez test!)')\nprint('')\nprint('=== pytest ishga tushurish ===')\nprint('pytest tests/                   # barcha testlar')\nprint('pytest tests/test_one.py -v     # bitta file')\nprint('pytest tests/test_one.py::test_func -v  # bitta funksiya')",
                codeNote: "Mock — juda muhim: real API/DB chaqirmasdan test yozish imkoni.",
                result: "=== Testlash Best Practices ===\\n1️⃣  NOMLASH: test_funktsiya_nomi_holati (test_toliq_ism_boshjoy))\\n2️⃣  ARRANGE → ACT → ASSERT pattern:\\n   # ARRANGE: ma'lumot tayyorlash\\n   a, b = 10, 2\\n   # ACT: funksiyani chaqirish\\n   natija = divide(a, b)\\n   # ASSERT: natija tekshirish\\n   assert natija == 5\\n\\n3️⃣  pytest -v — verbose (batafsil) chiqim\\n4️⃣  pytest -k \"kvadrat\" — faqat so‘zi bor testlar\\n5️⃣  pytest -x — birinchi xatoda to‘xta\\n6️⃣  Mocking: unittest.mock.patch → tashqi bog‘liqlikni (API, DB) almashtirish (tez test!)\\n\\n=== pytest ishga tushurish ===\\npytest tests/                   # barcha testlar\\npytest tests/test_one.py -v     # bitta file\\npytest tests/test_one.py::test_func -v  # bitta funksiya",
                note: "TDD — Avval test (yoshiq), keyin kod (yashil), keyin refactor."
              },
              {
                title: 'Xulosa',
                text: "Testlash — professional dasturchi uchun shart. Kamida 1-2 soat test yozish orqali siz keyingi 20 soat qutqarasiz (kechki xatolarni bartaraf etishdan)."
              }
            ],
            keyPoints: [
              "2 framework: unittest (built-in, class asos) va pytest (zamonaviy, sodda, pip install pytest)",
              "unittest: class TestNomi(unittest.TestCase): def test_... self.assertEqual/True/False/assertRaises",
              "pytest: funksiya test_ bilan → oddiy assert. @pytest.mark.parametrize ko'p holat",
              "pytest.raises(ValueError): — xato chiqaradimi?",
              "@pytest.fixture — ma'lumot tayyorlash (testlar o'rtasida qayta ishlatiladi)",
              "coverage (pytest-cov) — qancha qator testlanganligi % (80%+ yaxshi)",
              "ARRANGE → ACT → ASSERT pattern; TDD = test avval, keyin kod; mock → tashqi API/DB ni almashtirish"
            ],
            masterXp: 35,
            homework: "1. kvadrat(son) → unittest.TestCase class da 4 ta test (musbat, manfiy, nol, 100).\n2. pytest da: def add(a,b): return a+b → 3 ta oddiy assert + parametrize 5 holat.\n3. def bolinma(a,b) → pytest.raises(ZeroDivisionError) b=0 uchun.\n4. pytest fixture: 3 ta elementli mahsulotlar list → 2 ta test (topish va umumiydor narx).\n5. (Challenge) pytest-cov o'rnating, coverage ni hisoblash uchun loyihangizni test qilib ko'ring.\n6. (Challenge) Mock qilib ko'ring: requests.get ni mock patch bilan almashtirib, testda real API chaqirmasdan natija qaytaring.",
            summary: "Bugun Testlash: unittest, pytest, parametrize, fixture, coverage, best practices. Keyingi — Asyncio!",
            exercises: [
              {
                id: 'pyTestEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Oddiy pytest test 🧪',
                instruction: "def summa(a, b): return a + b. test_summa() funksiyasini yozing: 5 ta holatni assert bilan tekshiring (2+3, 0+0, -5+5, 100+200, -10+-20).",
                startCode: "# Bu yerga kodingizni yozing\ndef summa(a, b):\n    return a + b\n\ndef test_summa():\n    # 5 ta assert yozing\n    pass\n",
                checks: [
                  { re: "assert\\s+summa\\s*\\(\\s*2\\s*,\\s*3\\s*\\)\\s*==\\s*5", msg: "Kamida assert summa(2,3) == 5 kabi 5 ta holat yozing!" }
                ],
                hint: "assert summa(2, 3) == 5; assert summa(-5, 5) == 0 ...",
                explanation: "pytest da test_ bilan boshlangan funksiya → oddiy Python assert!",
                xp: 10
              },
              {
                id: 'pyTestEx2',
                type: 'dragdrop',
                title: '2-MASHQ — AAA pattern tartibi 🧩',
                instruction: "ARRANGE → ACT → ASSERT (test pattern) tartibini to'g'rilang.",
                hint: "Ma'lumot tayyorlash → funksiyani chaqirish → natijani tekshirish",
                items: ['# ARRANGE: input tayyorlash (a, b = 10, 3)', '# ACT: funksiyani chaqirish (natija = bolinma(a,b))', '# ASSERT: natijani tekshirish (assert natija == 10/3)'],
                xp: 10
              },
              {
                id: 'pyTestEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "pytest da test_ bilan boshlanmagan funksiya ishga tushmayapti. Nima uchun?",
                code: "import pytest\ndef kvadrat_test():  # ❌ Nima uchun run qilinmaydi?!\n    assert 5*5 == 25\ndef test_kvadrat():   # ✅ Bu ishlaydi\n    assert 2*2 == 4",
                options: ["kvadrat_test() da xato bor", "pytest test_ BILAN BOSHLANADI! _test emas", "pytest import qilinmagan", "kvadrat_test() funksiya emas"],
                answer: 1,
                explanation: "pytest da TEST FUNKSIYALARI test_ BILAN BOSHLANISHI KERAK! oldida emas, key emas, BOSHIDA. _test → ishlamaydi, test_ → ishlaydi!",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Python ning built-in (tashqi paket yo'q) test framework?",
                options: ["pytest", "unittest", "nose2", "testify"],
                answer: 1,
                explanation: "unittest — standard library da mavjud (pip install kerak emas)."
              },
              {
                question: "pytest da test funksiya nomi qanday BOSHLANISHI kerak?",
                options: ["..._test (oxirida)", "test_ (boshida)", "Test... (katta T bilan boshida)", "hamma ishlaydi"],
                answer: 1,
                explanation: "pytest → test_ bilan boshlanishi SHART (test_func_name)."
              },
              {
                question: "unittest da tenglikni tekshirish uchun?",
                options: ["assert a == b", "self.assertEqual(a, b)", "self.equals(a, b)", "checkEqual(a,b)"],
                answer: 1,
                explanation: "unittest → self.assertEqual(a, b). pytest → oddiy assert a == b."
              },
              {
                question: "Funksiya XATO chiqaradimi? (pytest) Tekshirish uchun?",
                options: ["assert Exception", "pytest.raises(Xato): bloki", "check.raises()", "assertRaisesOnly()"],
                answer: 1,
                explanation: "with pytest.raises(ValueError): func_bad() → ValueError chiqaradimi?"
              },
              {
                question: "BIR NECHTA holatni bitta kod bilan qanday ishlatamiz (pytest)?",
                options: ["@pytest.mark.parametrize", "@pytest.fixture", "@pytest.multi", "@pytest.loop"],
                answer: 0,
                explanation: "@pytest.mark.parametrize('a,b,n', [(1,2,3),...]) → ko'p holat."
              },
              {
                question: "Testlar uchun MA'LUMOT tayyorlab beruvchi decorator (pytest)?",
                options: ["@pytest.mark.parametrize", "@pytest.fixture", "@pytest.data", "@pytest.setup"],
                answer: 1,
                explanation: "@pytest.fixture → testga argument sifatida beriladi, avtomatik chaqiriladi."
              },
              {
                question: "Coverage foizini topish uchun pytest paket?",
                options: ["pytest-coverage", "pytest-cov", "coverage-py", "pytest-stat"],
                answer: 1,
                explanation: "pip install pytest-cov → pytest --cov=modul."
              },
              {
                question: "TDD — Test-Driven Development tartibi?",
                options: ["KOD → TEST → Ishlaydi", "TEST (xato) → KOD (o'tadi) → Refactor", "TEST → KOD → Dastur tugashi", "Birga yozish"],
                answer: 1,
                explanation: "TDD: RED (xato) → GREEN (o'tadi) → REFACTOR (to'g'rilash)."
              }
            ]
          }
        },
        {
          title: 'Asyncio',
          duration: 25,
          xp: 40,
          content: {
            intro: "Asyncio — PARALLEL emas, BIRTHDA CONCURRENT (konsurrent) KOD YOZISH UCHUN. Bloklanuvchi (sekin: HTTP so'rov, fayl o'qish, DB so'rov) amallarni parallel-like bajaradi (wait-free). Bitta thread da → GIL bilan ham to'liq ishlaydi. Web server, bot, ko'p API so'rovlar uchun juda qulay!",
            sections: [
              {
                title: 'Async vs Sync — nima farq?',
                text: "Sync (odatiy): keginchi ish BIRI tugagandan keyin BOSHQA boshlanadi (sekvensiya).\n\nAsync (asyncio): bitta ish kutish vaqtida (wait/IO) → BOSHQA ishni BOSHLAYDI (bloklanmaydi).\n\n🧠 Analog (restoran):\n• Sync: 1 ofitsiant → har bir mijoz 20 daqiqa ovqat kutiladi → 10 mijoz → 200 daqiqa\n• Async: 1 ofitsiant → buyurtmani BERADI, OVQAT TAYYORLANISHINI KUTMAYDI (await) → boshqa mijozga o'tadi → 10 mijoz → 25 daqiqa (birga kutilmoqda)",
                code: "import time\nimport asyncio\n\n# === SINXRON (odatiy): ketma-ket ===\ndef seq_download(n):\n    for i in range(n):\n        time.sleep(1)  # BLOK: 1 soniya KUTADI (hech narsa qilmagan holatda)\n        print(f'[sync] Yuklandi: fayl_{i}')\n\n# === ASINXRON (asyncio): parallel-kabi ===\nasync def async_download(n):\n    tasks = []\n    for i in range(n):\n        tasks.append(asyncio.create_task(single(i)))\n    await asyncio.gather(*tasks)\n\nasync def single(i):\n    await asyncio.sleep(1)  # BLOKlamaydi! boshqa vazifalar ishlaydi\n    print(f'[async] Yuklandi: fayl_{i}')\n\nprint('=== SINXRON (3 ta fayl, har biri 1s): ketma-ket 3+ soniya ===')\nstart = time.time()\nseq_download(3)\nprint(f'SINXRON tugadi: {time.time() - start:.2f}s')\n\nprint('\\n=== ASINXRON (3 ta fayl, Hammasi BIRGA kutadi → ~1s! JAMI ===')\nstart = time.time()\nasyncio.run(async_download(3))\nprint(f'ASINX tugadi: {time.time() - start:.2f}s')",
                codeNote: "async def → koroutina; await → bloklanmagan holda kutish; asyncio.run() → event loop ishga tushurish.",
                result: "=== SINXRON (3 ta fayl, har biri 1s): ketma-ket 3+ soniya ===\\n[sync] Yuklandi: fayl_0\\n[sync] Yuklandi: fayl_1\\n[sync] Yuklandi: fayl_2\\nSINXRON tugadi: 3.01s\\n\\n=== ASINXRON (3 ta fayl, Hammasi BIRGA kutadi → ~1s! JAMI ===)\\n[async] Yuklandi: fayl_0\\n[async] Yuklandi: fayl_1\\n[async] Yuklandi: fayl_2\\nASINX tugadi: 1.01s",
                note: "⚠️ Asyncio = IO (kutish) bilan ishlaganda samarali. CPU (raqamli hisoblash) uchun → multiprocessing kerak (GIL)."
              },
              {
                title: 'async/await, create_task, gather',
                text: "• async def → koroutina (ishga tushmasdan, chaqirilsa ishlamaydi, .coroutine qaytaradi)\n• await → koroutinani ishga tushuradi va TUGASHINI KUTADI (bloklamasdan)\n• asyncio.create_task(coro()) → koroutinani FOGLAL va FONDA ishlat (parallel)\n• asyncio.gather(*tasks) → HAMMA vazifalarni BIRGA kuting",
                code: "import asyncio\nimport time\n\n# Asosiy async funktsiyalar\nasync def fetch_data(name, t):\n    print(f'🔄 {name}: boshlash (kutish {t}s)...')\n    await asyncio.sleep(t)  # ⏳ KUTUVCHI (IO simulyatsiya)\n    print(f'✅ {name}: TUGADI!')\n    return f'{name}_result_{t}'\n\nasync def main():\n    t0 = time.time()\n    print('=== 1) ODATIY await: ketma-ket (Yaxshi emas!) ===')\n    r1 = await fetch_data('A', 1)\n    r2 = await fetch_data('B', 2)\n    r3 = await fetch_data('C', 1)\n    print(f'Ketma-ket natijalar: {r1}, {r2}, {r3} → jami: {time.time()-t0:.1f}s (1+2+1)')\n\n    t1 = time.time()\n    print('\\n=== 2) create_task + gather → PARALEL-like (to\\‘g\\‘ri!) ===')\n    t_a = asyncio.create_task(fetch_data('A', 1))\n    t_b = asyncio.create_task(fetch_data('B', 2))\n    t_c = asyncio.create_task(fetch_data('C', 1))\n    natijalar = await asyncio.gather(t_a, t_b, t_c)\n    print(f'Parallel natijalar: {natijalar} → jami: {time.time()-t1:.1f}s (max(1,2,1) = 2s!)')\n\nasyncio.run(main())",
                codeNote: "gather → natijalarni LIST qilib (order mos holda) qaytaradi.",
                result: "=== 1) ODATIY await: ketma-ket (Yaxshi emas!) ===\\n🔄 A: boshlash (kutish 1s)...\\n✅ A: TUGADI!\\n🔄 B: boshlash (kutish 2s)...\\n✅ B: TUGADI!\\n🔄 C: boshlash (kutish 1s)...\\n✅ C: TUGADI!\\nKetma-ket natijalar: A_result_1, B_result_2, C_result_1 → jami: 4.0s (1+2+1)\\n\\n=== 2) create_task + gather → PARALEL-like (to‘g‘ri!) ===\\n🔄 A: boshlash (kutish 1s)...\\n🔄 B: boshlash (kutish 2s)...\\n🔄 C: boshlash (kutish 1s)...\\n✅ A: TUGADI!\\n✅ C: TUGADI!\\n✅ B: TUGADI!\\nParallel natijalar: ['A_result_1', 'B_result_2', 'C_result_1'] → jami: 2.0s (max(1,2,1) = 2s!)",
                note: "await asyncio.gather(*[t1, t2]) — ko'p vazifalarni to'g'ri!"
              },
              {
                title: "Asosiy amaliy vositalar: wait, timeout, shield",
                text: "wait(), as_completed(), timeout(), shield().",
                code: "import asyncio\nimport time\n\nasync def slow(name, t):\n    await asyncio.sleep(t)\n    print(f'✅ {name}')\n    return name\n\nasync def main():\n    # 1) wait() — FIRST_COMPLETED yoki ALL_COMPLETED\n    tasks = [asyncio.create_task(slow(f'T{i}', 1+i*0.5)) for i in range(4)]\n    print('=== wait(FIRST_COMPLETED): BIRINCHI tugaganda ===')\n    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)\n    for d in done: print('Birinchi tugadi:', d.result())\n    for p in pending: p.cancel()\n    await asyncio.sleep(0.1)\n\n    # 2) as_completed: HAR BIRI TUGAGANDA CHIQADI (order emas!)\n    print('\\n=== as_completed: HAR BIRI TUGSA ===')\n    tasks2 = [slow(f'Job{i}', 2-i*0.3) for i in range(3)]\n    for coro in asyncio.as_completed(tasks2):\n        res = await coro\n        print(f'Tugallandi: {res}')\n\n    # 3) wait_for TIMEOUT — X ms dan ko'p kelsa TimeoutError!\n    print('\\n=== wait_for: 0.5s TIMEOUT ===')\n    try:\n        res = await asyncio.wait_for(slow('SLOW_2s', 2), timeout=0.5)\n    except asyncio.TimeoutError:\n        print('⏰ Timeout! 0.5s ichida tugamadi → xato (to\\'g\\'ri!)')\n\nasyncio.run(main())",
                codeNote: "wait_for(timeout=) → juda foydali: abadiy kutmang!",
                result: "=== wait(FIRST_COMPLETED): BIRINCHI tugaganda ===\\n✅ T0\\nBirinchi tugadi: T0\\n\\n=== as_completed: HAR BIRI TUGSA ===\\n✅ Job2\\nTugallandi: Job2\\n✅ Job1\\nTugallandi: Job1\\n✅ Job0\\nTugallandi: Job0\\n\\n=== wait_for: 0.5s TIMEOUT ===\\n⏰ Timeout! 0.5s ichida tugamadi → xato (to'g'ri!)",
                note: "Task.cancel(), CancelledError, finally → resurslarni tozalash!"
              },
              {
                title: "Real async da ishlatiladigan kutubxonalar",
                text: "⚠️ ESLATMA: time.sleep()/requests.get()/open()/sqlite3.connect() — BULAR BLOKLANADI (async emas!). Bularni ASYNC VERSIYALARINI ISHLATING:\n\n| Blok (sync) | Async (non-block) |\n|---|---|\n| requests | aiohttp, httpx (async mode) |\n| time.sleep | asyncio.sleep |\n| open | aiofiles |\n| psycopg2 (Postgres) | asyncpg |\n| sqlite3 | aiosqlite |\n| pymongo | motor |\n| FastAPI/Starlette | async def endpointlar |",
                code: "print('=== REAL KUTUBXONALAR ===')\nprint('pip install aiohttp httpx aiofiles asyncpg aiosqlite motor')\nprint('')\nprint('=== HTTP: aiohttpx ===')\nprint('async with httpx.AsyncClient() as client:')\nprint('    tasks = [client.get(f\"https://api.example.com/{i}\") for i in range(10)]')\nprint('    javoblar = await asyncio.gather(*tasks)')\nprint('    # 10 ta API so\\'rovi BIRDA → ~1s ( emas 10s!)')\nprint('')\nprint('=== Fayl: aiofiles ===')\nprint('async with aiofiles.open(\"big.log\", mode=\"r\") as f:')\nprint('    content = await f.read()')\nprint('    # Fayl katta bo\\'lsa ham bloklamaydi, boshqa ishlaydi!')\nprint('')\nprint('⚠️  HECH QACHON SYNC blok funksiyani async ichida oddiy chaqirmang! → BlockingIO → asyncio.to_thread() yoki real async library ishlat.')",
                codeNote: "Sync kodni background thread da ishlatish: await asyncio.to_thread(sync_blocking_func).",
                result: "=== REAL KUTUBXONALAR ===\\npip install aiohttp httpx aiofiles asyncpg aiosqlite motor\\n\\n=== HTTP: aiohttpx ===\\nasync with httpx.AsyncClient() as client:\\n    tasks = [client.get(f\"https://api.example.com/{i}\") for i in range(10)]\\n    javoblar = await asyncio.gather(*tasks)\\n    # 10 ta API so‘rovi BIRDA → ~1s ( emas 10s!)\\n\\n=== Fayl: aiofiles ===\\nasync with aiofiles.open(\"big.log\", mode=\"r\") as f:\\n    content = await f.read()\\n    # Fayl katta bo‘lsa ham bloklamaydi, boshqa ishlaydi!\\n\\n⚠️  HECH QACHON SYNC blok funksiyani async ichida oddiy chaqirmang! → BlockingIO → asyncio.to_thread() yoki real async library ishlat.",
                note: "FastAPI → async def qiling → event loop bloklanmasligi uchun async db driver ishlatish kerak (asyncpg/aiosqlite)."
              },
              {
                title: "Xatolarni boshqarish + Semaphore (rate limit)",
                text: "Semaphore → bir vaqtda N tadan ko'p vazifa ishga tushmasligini cheklaydi (API rate-limit uchun!).",
                code: "import asyncio\nimport random\n\nasync def fetch_one(sem, user_id):\n    async with sem:  # 🚦 BIR VAQTDA 3 tadan KO'P ishlamaydi!\n        print(f'▶️ User {user_id} - so\\‘rov jo\\‘natildi')\n        await asyncio.sleep(random.uniform(0.2, 1.0))\n        if user_id == 17:\n            raise ValueError(f'User {user_id}: topilmadi!')\n        print(f'✅ User {user_id} - tayyor')\n        return {'id': user_id}\n\nasync def main():\n    sem = asyncio.Semaphore(3)  # 3 → concurrency limit (rate-limit)\n    tasks = []\n    results = []\n    errors = []\n\n    for i in range(1, 11):  # 10 ta user\n        task = asyncio.create_task(fetch_one(sem, i))\n        tasks.append(task)\n\n    for t in tasks:\n        try:\n            res = await t\n            results.append(res)\n        except Exception as e:\n            errors.append(str(e))\n\n    print(f'\\n🏁 Yakun: {len(results)} ta muvaffaqiyatli, {len(errors)} ta xato')\n    if errors:\n        print('Xatolar:')\n        for e in errors: print('  ❌', e)\n\nasyncio.run(main())",
                codeNote: "Semaphore(N) → concurrency cheklash (DDOS dan saqlaydi, API limit saqlaydi). gather(return_exceptions=True) → xatolarni list ga.",
                result: "▶️ User 1 - so‘rov jo‘natildi\\n▶️ User 2 - so‘rov jo‘natildi\\n▶️ User 3 - so‘rov jo‘natildi\\n✅ User 1 - tayyor\\n▶️ User 4 - so‘rov jo‘natildi\\n✅ User 2 - tayyor\\n▶️ User 5 - so‘rov jo‘natildi\\n...\\n\\n🏁 Yakun: 9 ta muvaffaqiyatli, 1 ta xato\\nXatolar:\\n  ❌ User 17: topilmadi!",
                note: "Lock, Event, Condition, Queue — async sinxronizatsiya vositalari (threading'ga o'xshash)."
              },
              {
                title: 'Xulosa',
                text: "Asyncio → Web botlar/serverlar, ko'p API so'rovlar fayllar — IO bilan og'irlashgan loyihalar uchun ideal. CPU → multiprocessing ishlating."
              }
            ],
            keyPoints: [
              "async def → koroutina (await bilan ishlaydi). asyncio.run(main()) → event loop ishga tush",
              "await asyncio.sleep(t) → BLOCKlamaydi kutish (vaqt kelganda boshqa ish)",
              "asyncio.create_task(coro()) → fonda ishlat; gather(*tasks) → hammasini birga kut (order mos result)",
              "wait() / as_completed() / wait_for(..., timeout=1.5) → TimeoutError",
              "Semaphore(N) → bir vaqtda N dan ko'p (rate-limit) task ishga tushmasligi",
              "⚠️  Async ichida SYNC (time.sleep/requests/odatdagi open) → BLOKLAYDI! Asyns versiyalari: aiohttp/httpx, aiofiles, asyncpg.",
              "Sync kodni async da ishlatish: await asyncio.to_thread(sync_func)"
            ],
            masterXp: 40,
            homework: "1. async def hi(i) → await asyncio.sleep(0.5), print(f'Salom {i}'). 5 ta taskni create_task + gather bilan bajarib jami vaqtni o'lchang (0.5s atrofida bo'lishi kerak).\n2. httpx (async) o'rnating: 5 ta turli URL dan GET (jsonplaceholder) → gather → jami vaqtni sinxron requests bilan solishtiring!\n3. Semaphore(2) bilan 10 ta API so'rov: har biri 0.3s, jami ~1.5s bolishi kerak (2 talik guruh).\n4. wait_for(timeout=1) → 2s da tugaydigan funksiyada TimeoutError ushlash.\n5. (Challenge) aiofiles → 3 ta faylni parallel o'qing va ularning uzunliklarini chop qiling.\n6. (Challenge) return_exceptions=True bilan gather → xatolarni exception sifatida list oling va chop qiling.",
            summary: "Bugun Asyncio: async/await, create_task/gather, semaphore/timeout, real libs. Keyingi — Amaliy loyiha: Telegram bot!",
            exercises: [
              {
                id: 'pyAsyncEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Oddiy async + gather ⏳',
                instruction: "async def salom(i) ni yarating (await asyncio.sleep(1), print(f'Salom {i}')). main() da 3 ta create_task qiling va asyncio.gather() bilan barchasini kuting. Keling jami ~1s bo'lsin (3 emas!).",
                startCode: "import asyncio\n# Bu yerga kodingizni yozing\n",
                checks: [
                  { re: "asyncio\\.gather\\s*\\(\\s*", msg: "asyncio.gather() bilan 3 ta taskni birga kuting!" },
                  { re: "create_task", msg: "asyncio.create_task(salom(i)) ishlating!" }
                ],
                hint: "async def main(): tasks=[asyncio.create_task(salom(i)) for i in 1,2,3]; await asyncio.gather(*tasks)",
                explanation: "create_task → fonda ishlaydi; gather → hammasi birga kuzatiladi → ~1s jami.",
                xp: 10
              },
              {
                id: 'pyAsyncEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Async pipeline 🧩',
                instruction: "Koinotga async io kodni yig'ish tartibini to'g'rilang.",
                hint: "async def → create_task → gather → asyncio.run",
                items: ['async def single(i): await asyncio.sleep(1); print(i)', 'async def main(): tasks = [asyncio.create_task(single(i)) for i in range(3)]', 'await asyncio.gather(*tasks)', 'asyncio.run(main())'],
                xp: 10
              },
              {
                id: 'pyAsyncEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Async kod ishga tushganda 10 ta API so'rov 10 soniya → Kutilayotganda jami 1 soniya bo'lishi kerak edi! Nima uchun?",
                code: "# 10 ta API, 1 soniya kutish — aslida 10s chiqmoqda (async emasdek!) ❌\nasync def fetch_all():\n    for i in range(10):\n        res = await fetch_one(i)  # ❌ SABAB?",
                options: ["fetch_one yozilmagan", "HAR SAFAR AWAIT → KETMA-KET. create_task+gather ishlatilishi kerak", "asyncio.run ishlatmagan", "async def emas def ishlatilgan"],
                answer: 1,
                explanation: "For da AWAIT → ketma-ket (sync kabi 1+1+...+1 = 10s). TO'G'RI: 10 ta create_task → gather → 1s max = 1s JAMI!",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Asyncio koroutina qanday aniqlanadi?",
                options: ["def async:", "async def func():", "coro func():", "def func() async:"],
                answer: 1,
                explanation: "async def nom(...): — koroutina (async function)."
              },
              {
                question: "Kutish (bloklanmagan holda) uchun kalit so'z?",
                options: ["wait", "await", "sleep", "hold"],
                answer: 1,
                explanation: "await coro() — koroutinani bajaradi va TUGASHINI KUTADI (boshqa vazifalar ishlaydi kutishda)."
              },
              {
                question: "Barcha vazifalarni BIRGA kutish (parallel) uchun?",
                options: ["asyncio.join()", "asyncio.gather(*tasks)", "asyncio.wait_all()", "asyncio.parallel()"],
                answer: 1,
                explanation: "await asyncio.gather(t1, t2, t3) — hammasini kut, natijalar list (order mos)."
              },
              {
                question: "Vazifani FONDA ishga tushurish (darhol)?",
                options: ["asyncio.fork(coro)", "asyncio.create_task(coro())", "asyncio.start(coro)", "run(coro)"],
                answer: 1,
                explanation: "create_task → darhol fonda (event loop da) ishlay boshlaydi."
              },
              {
                question: "N soniya ICHIDA TUGAMASA xato berish?",
                options: ["await asyncio.wait_for(coro, timeout=N)", "await asyncio.timer(N, coro)", "asyncio.sleep_limit(N)", "asyncio.timeout(coro, N)"],
                answer: 0,
                explanation: "wait_for(coro, timeout=5) → 5s dan ko'p bo'lsa TimeoutError."
              },
              {
                question: "Bir vaqtda N tadan KO'P vazifa ishga tushmasligi uchun?",
                options: ["asyncio.RateLimit(N)", "asyncio.Semaphore(N)", "asyncio.Lock(N)", "asyncio.Group(N)"],
                answer: 1,
                explanation: "Semaphore(N) → async with sem: ... → bitta loop da N dan ko'p kirmaydi."
              },
              {
                question: "Sync (requests, time.sleep) kod async ichida — nima bo'ladi?",
                options: ["Xato beradi", "BLOKLAYDI (event loop to'xtaydi, hammasi sekinlashadi)", "Aviavtik asyncga aylanadi", "Tezlashadi"],
                answer: 1,
                explanation: "Sync blok → event loop blok! → Asyns versiyalari: httpx, asyncio.sleep, aiofiles ishlating yoki to_thread()."
              },
              {
                question: "HTTP so'rovlar uchun async library?",
                options: ["requests", "aiohttp / httpx (async mode)", "urllib", "http.client"],
                answer: 1,
                explanation: "requests — sync, blok! async: aiohttp yoki httpx.AsyncClient()."
              }
            ]
          }
        },
        {
          title: 'Amaliy loyiha: Telegram bot',
          duration: 40,
          xp: 60,
          content: {
            intro: "AMALIY LOYIHA! Python bilan Telegram bot yaratamiz. Eng keng tarqalgan kutubxonalar: python-telegram-bot (PTB), aiogram (async). Biz sodda, to'liq ishlaydigan botni AIogram 3.x (async) orqali yaratamiz: /start, /help, oddiy suhbat, inline tugmalar, rasm/jadval yuborish, bazaga (SQLite) user ma'lumotlarini saqlash!",
            sections: [
              {
                title: "BotFather dan TOKEN olish + O'rnatish",
                text: "1) Telegram da @BotFather ni toping → /newbot → bot nomi va username ni kiriting → BOT TOKEN beradi (saqlang!).\n2) Python kutubxonani o'rnating: pip install aiogram==3.* python-dotenv aiosqlite",
                code: "# 1. O'rnatish (terminalda)\n# pip install aiogram python-dotenv aiosqlite\n\n# 2. Bot tokeni — @BotFather dan oling:\nprint('=== 1-QADAM: O\\'Rnatish ===')\nprint('pip install aiogram python-dotenv aiosqlite')\nprint('')\nprint('=== 2-QADAM: BOT TOKEN ===')\nprint('Telegram: @BotFather → /newbot → name → username_bot → TOKEN')\nprint('Token: 1234567890:AAHhs5xY9J_z_3y7X... (SAQLANG!)')\nprint('')\nprint('=== Loyiha tuzilmasi ===')\nprint('my_tg_bot/')\nprint('├── .env          # BOT_TOKEN=... (maxfiy, .gitignore!)')\nprint('├── bot.py        # Asosiy bot kodi')\nprint('├── database.py   # SQLite async (aiosqlite)')\nprint('└── requirements.txt')\nprint('')\nprint('.env → QO\\'SHMAYOQ! -> tokenni kodga yozmang! .gitignore: .env venv/ __pycache__/')",
                codeNote: "⚠️ HECH QACHON TOKENNI KODGA TO'G'RIDAN YOZMANG! .env ishlatish kerak.",
                result: "=== 1-QADAM: O‘Rnatish ===\\npip install aiogram python-dotenv aiosqlite\\n\\n=== 2-QADAM: BOT TOKEN ===\\nTelegram: @BotFather → /newbot → name → username_bot → TOKEN\\nToken: 1234567890:AAHhs5xY9J_z_3y7X... (SAQLANG!)\\n\\n=== Loyiha tuzilmasi ===\\nmy_tg_bot/\\n├── .env          # BOT_TOKEN=... (maxfiy, .gitignore!)\\n├── bot.py        # Asosiy bot kodi\\n├── database.py   # SQLite async (aiosqlite)\\n└── requirements.txt\\n\\n.env → QO‘SHMAYOQ! -> tokenni kodga yozmang! .gitignore: .env venv/ __pycache__/",
                note: "Bot TOKEN = parol → biron olsa, botni boshqarishi mumkin!"
              },
              {
                title: 'Eng oddiy bot: /start va /help',
                text: "Minimal ishlaydigan bot — /start va /help buyruqlari.",
                code: "# === .env ===\n# BOT_TOKEN=1234567890:AAHhs5xY9J_z_3y7X...\n\n# === bot.py (Oddiy minimal bot) ===\nimport asyncio\nfrom aiogram import Bot, Dispatcher, types\nfrom aiogram.filters.command import Command\nfrom aiogram.enums import ParseMode\nimport os\nfrom dotenv import load_dotenv\n\n# 1) .env faylni yuklash\nload_dotenv()\nTOKEN = os.getenv('BOT_TOKEN')\nif not TOKEN:\n    raise ValueError('.env da BOT_TOKEN topilmadi!')\n\n# 2) Bot & Dispatcher (async)\nbot = Bot(token=TOKEN, parse_mode=ParseMode.HTML)\ndp = Dispatcher()\n\n# 3) /start buyrug'i handler\n@dp.message(Command('start'))\nasync def cmd_start(message: types.Message):\n    user = message.from_user\n    text = (\n        f'👋 Salom, <b>{user.full_name}</b>!\\n'\n        f'Men sizning birinchi <u>Python</u> botingizman!\\n\\n'\n        f'Buyruqlar:\\n'\n        f'• /start — qayta boshlash\\n'\n        f'• /help — yordam\\n'\n        f'• /id — sizning Telegram ID raqamingiz\\n\\n'\n        f'<i>Yozing: men sizga javob beraman!</i>'\n    )\n    await message.answer(text, parse_mode=ParseMode.HTML)\n\n# 4) /help\n@dp.message(Command('help'))\nasync def cmd_help(message: types.Message):\n    help_text = (\n        '📖 <b>Yordam:</b>\\n'\n        '• Men siz yozgan matnni takrorlayman\\n'\n        '• /start — boshlash\\n'\n        '• /id — ID ko\\'rsatish\\n'\n        '• /user — profilingiz\\n'\n        '• /calc 2+3 — hisoblash (oddiy)'\n    )\n    await message.answer(help_text)\n\n# 5) /id — user id\n@dp.message(Command('id'))\nasync def cmd_id(message: types.Message):\n    await message.answer(f'🆔 Sizning ID: <code>{message.from_user.id}</code>')\n\n# 6) ECHO: Barcha boshqa xabarlarga javob (handler oxirida turishi kerak!)\n@dp.message()\nasync def echo_all(message: types.Message):\n    if message.text:\n        await message.reply(f'🔁 Siz yozdingiz: <i>\"{message.text}\"</i>')\n    else:\n        await message.reply('😊 Men hozircha faqat MATN bilan ishlayman!')\n\n# Botni ishga tushurish (async)\nasync def main():\n    print('🚀 Bot ishga tushdi...')\n    await dp.start_polling(bot)\n\nprint('✅ Minimal bot tayyor! Terminalda: python bot.py ishga tushur + Telegram da botga /start yubor!')\n# if __name__ == '__main__':\n#     asyncio.run(main())",
                codeNote: "aiogram 3.x → Dispatcher + @dp.message(Command('start')). HTML format: <b>, <i>, <code>, <a href='...'>, <u>, <s>.",
                result: "✅ Minimal bot tayyor! Terminalda: python bot.py ishga tushur + Telegram da botga /start yubor!",
                note: "Polling (long polling) → serverda ishlatganda Webhook (teztroq, kam resurs) ishlatish yaxshi."
              },
              {
                title: 'Inline klaviatura (tugmalar) va CallbackQuery',
                text: "Pastki tugmalar (ReplyKeyboard) va inline (xabar ostida) tugmalar.",
                code: "from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton\nfrom aiogram.types import ReplyKeyboardMarkup, KeyboardButton\nfrom aiogram import F\n\n# === 1) REPLY (pastdagi kichik tugmalar) ===\ndef get_main_keyboard():\n    kb = ReplyKeyboardMarkup(\n        keyboard=[\n            [KeyboardButton(text='👤 Profilim'), KeyboardButton(text='🆔 Mening ID')],\n            [KeyboardButton(text='🔢 Hisoblash'), KeyboardButton(text='ℹ️ Yordam')]\n        ],\n        resize_keyboard=True,\n        input_field_placeholder='Xabar yozing...'\n    )\n    return kb\n\n# === 2) INLINE (xabar ICHIDAGI tugmalar) ===\ndef get_inline_rate():\n    kb = InlineKeyboardMarkup(inline_keyboard=[\n        [\n            InlineKeyboardButton(text='😡 Yomon', callback_data='rate_1'),\n            InlineKeyboardButton(text='😐 O\\'rtacha', callback_data='rate_3'),\n            InlineKeyboardButton(text='😎 Zo\\'r!', callback_data='rate_5'),\n        ],\n        [InlineKeyboardButton(text='🔗 Kanalga o\\'tish', url='https://t.me/durov')]\n    ])\n    return kb\n\nprint('✅ Klaviaturalar tayyor!')\nprint('')\nprint('Handlerlar misol:')\nprint('@dp.message(F.text == \"🆔 Mening ID\") → reply keyboard text filter')\nprint('@dp.callback_query(F.data.startswith(\"rate_\")) → inline tugma bosilganda')\nprint('')\nprint('@dp.callback_query(F.data.startswith(\"rate_\"))')\nasync def rate_handler(callback: types.CallbackQuery):\n    ball = callback.data.split('_')[1]\n    await callback.answer(f'Rahmat! {ball}/5 ⭐', show_alert=True)\n    await callback.message.edit_text(f'Siz baholadingiz: ⭐ {ball}/5')",
                codeNote: "Callback answer() SHART! → ko'rsatkichni to'xtatadi. show_alert = True → katta popup. Edit message → yangi text qo'yish.",
                result: "✅ Klaviaturalar tayyor!\\n\\nHandlerlar misol:\\n@dp.message(F.text == \"🆔 Mening ID\") → reply keyboard text filter\\n@dp.callback_query(F.data.startswith(\"rate_\")) → inline tugma bosilganda\\n\\n@dp.callback_query(F.data.startswith(\"rate_\"))\\nasync def rate_handler(callback: types.CallbackQuery):\\n    ball = callback.data.split('_')[1]\\n    await callback.answer(f'Rahmat! {ball}/5 ⭐', show_alert=True)\\n    await callback.message.edit_text(f'Siz baholadingiz: ⭐ {ball}/5')",
                note: "F.text, F.data.startswith(), F.photo, F.document — aiogram 3 F filters (juda qulay)."
              },
              {
                title: 'SQLite async bazaga saqlash (aiosqlite) — foydalanuvchilar',
                text: "Keling, bazada users jadvali: id (Telegram ID, PK), full_name, username, first_seen, last_active, ball.\n\nHar safar user botga /start yuborganda → bazada bor yoki yo'q, yo'q qo'sh, bor → last_active vaqtini yangila.",
                code: "# === database.py ===\nimport aiosqlite\nimport datetime\n\nDB_NAME = 'bot_db.sqlite'\n\nasync def init_db():\n    async with aiosqlite.connect(DB_NAME) as db:\n        await db.execute('''\n            CREATE TABLE IF NOT EXISTS users (\n                telegram_id INTEGER PRIMARY KEY,\n                full_name TEXT NOT NULL,\n                username TEXT,\n                first_seen TEXT NOT NULL,\n                last_active TEXT NOT NULL,\n                rating INTEGER DEFAULT 0,\n                messages_count INTEGER DEFAULT 0\n            )\n        ''')\n        await db.commit()\n    print('✅ DB users jadvali tayyor!')\n\nasync def upsert_user(tg_id, full_name, username):\n    now = datetime.datetime.now().isoformat()\n    async with aiosqlite.connect(DB_NAME) as db:\n        await db.execute('''\n            INSERT INTO users (telegram_id, full_name, username, first_seen, last_active, messages_count)\n            VALUES (?, ?, ?, ?, ?, 1)\n            ON CONFLICT(telegram_id) DO UPDATE SET\n                full_name=excluded.full_name,\n                username=excluded.username,\n                last_active=excluded.last_active,\n                messages_count=users.messages_count + 1\n        ''', (tg_id, full_name, username, now, now))\n        await db.commit()\n\nasync def get_user(tg_id):\n    async with aiosqlite.connect(DB_NAME) as db:\n        db.row_factory = aiosqlite.Row\n        async with db.execute('SELECT * FROM users WHERE telegram_id = ?', (tg_id,)) as cur:\n            row = await cur.fetchone()\n            return dict(row) if row else None\n\nasync def get_stats():\n    async with aiosqlite.connect(DB_NAME) as db:\n        async with db.execute('SELECT COUNT(*), SUM(messages_count) FROM users') as cur:\n            cnt, msgs = await cur.fetchone()\n            return cnt, msgs or 0\n\nprint('✅ database.py tayyor!')\nprint('')\nprint('Bot start handleriga qo\\'shiladigan kod:')\nprint('  await upsert_user(user.id, user.full_name, user.username)')\nprint('  await dp.start_polling(bot, on_startup=init_db)')\nprint('')\nprint('/stats buyrug\\'i: cnt, msgs = await get_stats(); answer(f\"👥 Foydalanuvchilar: {cnt}, ✉️ Xabarlar: {msgs}\")')",
                codeNote: "aiosqlite → async SQLite! with connect() → auto close. ON CONFLICT DO UPDATE = upsert.",
                result: "✅ database.py tayyor!\\n\\nBot start handleriga qo'shiladigan kod:\\n  await upsert_user(user.id, user.full_name, user.username)\\n  await dp.start_polling(bot, on_startup=init_db)\\n\\n/stats buyrug‘i: cnt, msgs = await get_stats(); answer(f\"👥 Foydalanuvchilar: {cnt}, ✉️ Xabarlar: {msgs}\")",
                note: "Katta loyihalar uchun → SQLAlchemy + asyncpg (Postgres) ishlating (ORM)."
              },
              {
                title: 'Maxsus xabarlar (rasm, jadval, inline-mode) va botni deploy',
                text: "Rasm/fayl yuborish, jadval (table text), botni serverga (Render, Vercel Functions, VDS/Ubuntu) qo'yish.",
                code: "print('=== Turli xabar turlari ===')\nprint('')\nprint('📷 RASM YUBORISH:')\nprint('await message.answer_photo(photo=FSInputFile(\"photo.png\"), caption=\"Bu rasm\")')\nprint('await message.answer_photo(photo=\"https://site.com/img.png\", caption=\"URL dan\")')\nprint('')\nprint('📄 JADVAL (text/code blok):')\nprint('table = \"\"\"\\n<pre>| ID | Ism      | Ball |\\n|----|----------|------|\\n| 1  | Ali      | 85   |\\n</pre>\"\"\"')\nprint('await message.answer(table, parse_mode=ParseMode.HTML)')\nprint('')\nprint('📁 FAYL + LOCATION + CONTACT:')\nprint('answer_document(FSInputFile(\"data.pdf\"))')\nprint('answer_location(latitude=41.3, longitude=69.2)')\nprint('answer_contact(phone_number=\"+998901234567\", first_name=\"Ali\")')\nprint('')\nprint('=== DEPLOY (serverga qo\\'yish) ===')\nprint('Kichik/tekin:')\nprint('  1) render.com → Web Service, build: pip install -r requirements.txt, start: python bot.py')\nprint('  2) railway.app, fly.io, heroku alternatives')\nprint('Katta ishlab chiqish (VDS):')\nprint('  3) Ubuntu VDS: git clone → venv → requirements → pm2/systemd → 24/7 ishlashi')\nprint('  4) systemd service → background ishga tush, qayta yuklanganda ishga tush!')\nprint('')\nprint('Polling → oddiy/test. PROD → WEBHOOK (ngrok + FastAPI yoki aiogram webhook run)!')\n",
                codeNote: "FSInputFile → lokal faylni InputStream aylantirib yuboradi.",
                result: "=== Turli xabar turlari ===\\n\\n📷 RASM YUBORISH:\\nawait message.answer_photo(photo=FSInputFile(\"photo.png\"), caption=\"Bu rasm\")\\nawait message.answer_photo(photo=\"https://site.com/img.png\", caption=\"URL dan\")\\n\\n📄 JADVAL (text/code blok):\\ntable = \\\"\\\"\\\"\\n<pre>| ID | Ism      | Ball |\\n|----|----------|------|\\n| 1  | Ali      | 85   |\\n</pre>\\\"\\\"\\\"\\nawait message.answer(table, parse_mode=ParseMode.HTML)\\n\\n📁 FAYL + LOCATION + CONTACT:\\nanswer_document(FSInputFile(\"data.pdf\"))\\nanswer_location(latitude=41.3, longitude=69.2)\\nanswer_contact(phone_number=\"+998901234567\", first_name=\"Ali\")\\n\\n=== DEPLOY (serverga qo'yish) ===\\nKichik/tekin:\\n  1) render.com → Web Service, build: pip install -r requirements.txt, start: python bot.py\\n  2) railway.app, fly.io, heroku alternatives\\nKatta ishlab chiqish (VDS):\\n  3) Ubuntu VDS: git clone → venv → requirements → pm2/systemd → 24/7 ishlashi\\n  4) systemd service → background ishga tush, qayta yuklanganda ishga tush!\\n\\nPolling → oddiy/test. PROD → WEBHOOK (ngrok + FastAPI yoki aiogram webhook run)!",
                note: "Keyingi narsalar: FSM (holatlar — foydalanuvchidan bosqichma-bo'sqich ma'lumot olish: aiogram.fsm), Middlewarelar, Admin panel."
              },
              {
                title: 'Xulosa',
                text: "🎉 Tabriklayman! Endi sizda to'liq, real ishlaydigan Telegram bot yaratish bilimlari bor. Uni deploy qiling, do'stlaringizga ko'rsating — va yangi funksiyalar qo'shib boring!"
              }
            ],
            keyPoints: [
              "BotFather → /newbot → TOKEN. aiogram 3.x async framework.",
              "load_dotenv → BOT_TOKEN .env dan! HECH QACHON hardcode.",
              "async def start → @dp.message(Command('start')). await message.answer/reply/edit_text.",
              "InlineKeyboardMarkup (callback_data, url) & ReplyKeyboardMarkup. callback.answer() SHART!",
              "async database: aiosqlite (SQLite async), init_db, upsert, get → ON CONFLICT DO UPDATE.",
              "FSInputFile(rasm.pdf/doc), .answer_photo/document/location/contact.",
              "DEPLOY: render (free/test) → VDS (Ubuntu) + systemd/pm2 → 24/7. PROD → Webhook (polling emas)."
            ],
            masterXp: 60,
            homework: "1. Minimal bot yarat: @BotFather → token → bot.py → .env → /start, /help, /id, echo — ishga tushir sinab ko'r.\n2. Pastki reply klaviatura qo'sh: [Profil, Statistika] + Inline baho tugmalari (1-5 yulduz).\n3. SQLite async (database.py): /start da userni bazaga yoz, /stats → jami user va xabarlar sonini ko'rsat.\n4. /calc 2+3*4 buyrug'i — oddiy eval xavfsiz variantda hisoblash va javob yuborish.\n5. /random cat → https://api.thecatapi.com/v1/images/search aiohttp async → JSON dan URL → rasm yubor.\n6. Deploy: render.com ga botni joylang (24/7 onlayn), do'stlaringiz ulashsin.\n7. (Challenge) FSM (Finite State Machine, aiogram.fsm) → Yangi userni ro'yxatdan o'tkazish: ism → yosh → shahar → bazaga saqlash (holatlar orqali bosqichma).",
            summary: "Bugun AMALIY TELEGRAM BOT LOYIHASI: aiogram, token (BotFather), commandlar, keyboards, inline, DB (SQLite async), deploy! Endi Yakuniy takrorlash darsiga o'tamiz!",
            exercises: [
              {
                id: 'pyTgEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — /start handlerni yoz 🤖',
                instruction: "@dp.message(Command('start')) decorator ostida async def cmd_start(message) ni yozing: Salom + user ismi, /help, /id, /user buyruqlari ro'yxati bilan message.answer() jo'nating.",
                startCode: "from aiogram import types\nfrom aiogram.filters.command import Command\nfrom aiogram.enums import ParseMode\n# Bu yerga kodingizni yozing (decorator + async func)\n",
                checks: [
                  { re: "@dp\\.message\\s*\\(\\s*Command\\s*\\(\\s*['\\\"]start['\\\"]\\s*\\)", msg: "@dp.message(Command('start')) decoratorni ishlating!" },
                  { re: "async\\s+def\\s+cmd_start\\s*\\(\\s*message\\s*:\\s*types\\.Message\\s*\\)", msg: "async def cmd_start(message: types.Message):" },
                  { re: "await\\s+message\\.answer\\s*\\(", msg: "await message.answer(...) javob jo'natish!" }
                ],
                hint: "@dp.message(Command('start'))\nasync def cmd_start(message: types.Message):\n    await message.answer(f'Salom, {message.from_user.full_name}!\\n/help /id /user')",
                explanation: "aiogram handler: decorator + async func + await message.answer(matn, parse_mode=HTML).",
                xp: 10
              },
              {
                id: 'pyTgEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Bot ishga tushirish tartibi 🧩',
                instruction: "Telegram botning to'g'ri ishga tushirish zanjirini yig'ing.",
                hint: ".env yukla → Bot ob'ekt → Dispatcher → handlerlarni registratsiya → start_polling",
                items: ['load_dotenv(); TOKEN = os.getenv(\"BOT_TOKEN\")', 'bot = Bot(token=TOKEN, parse_mode=ParseMode.HTML)', 'dp = Dispatcher()', '@dp.message(Command(\"start\"))  def cmd_start(...):', 'asyncio.run(dp.start_polling(bot))'],
                xp: 10
              },
              {
                id: 'pyTgEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "Inline tugmani bossa hamma narsa OK, lekin loading tasbih never to'xtaydi (yopilmaydi). Nima unutildi?",
                code: "@dp.callback_query(F.data.startswith('rate_'))\nasync def rate_handler(callback: types.CallbackQuery):\n    print('Tugma bosildi!', callback.data)\n    await callback.message.edit_text('Rahmat!')\n    # ❌ NIMA UNUTILDI?",
                options: ["InlineKeyboardMarkup yo'q", "await callback.answer() — SHART! Telegramga ushlandi deb aytish kerak (loadingni o'chiradi)", "Bot token yo'q", "ParseMode noto'g'ri"],
                answer: 1,
                explanation: "callback.answer() SHART! → Telegramning bosildi tasbihini (loading) to'xtatadi. Ba'zida show_alert=True bilan popup ham qo'shiladi. To'g'ri: await callback.answer('Rahmat!')",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Telegram bot tokenini qayerdan olish kerak?",
                options: ["Telegram Settings", "@BotFather bot orqali /newbot", "Google API Console", "python.org"],
                answer: 1,
                explanation: "@BotFather → /newbot → username → TOKEN."
              },
              {
                question: "Aiogram 3.x framework qanday asos (async/sync)?",
                options: ["Sync (bloklanuvchi)", "Asyncio (async def / await)", "Threading asos", "Multiprocessing"],
                answer: 1,
                explanation: "aiogram 3 → asyncio asosida (async def + await)."
              },
              {
                question: "TOKENni kodga to'g'ridan-to'g'ri yozmaslik uchun?",
                options: ["Oddiy .txt fayl", ".env fayl + python-dotenv load_dotenv()", "config.py keng tarqalgan", "Bu muhim emas"],
                answer: 1,
                explanation: ".env → load_dotenv() + os.getenv('BOT_TOKEN') → HECH QACHON hardcode (git da yashirin bo'lishi kerak)."
              },
              {
                question: "/start buyrug'ini qabul qilish uchun decorator?",
                options: ["@dp.command('start')", "@dp.message(Command('start'))", "@bot.start", "@bot.command"],
                answer: 1,
                explanation: "Aiogram3 → @dp.message(Command('start')). Command filter aiogram.filters.command dan."
              },
              {
                question: "Xabar ICHI dagi (inline) tugma bosilganda qaysi event?",
                options: ["@dp.message(F.text)", "@dp.callback_query(F.data.startswith('rate_'))", "@dp.inline_button", "@dp.keyboard"],
                answer: 1,
                explanation: "Inline tugma → callback_query handler; callback_data → F.data."
              },
              {
                question: "Inline tugma bosilganda loadingni to'xtatish shart?",
                options: ["Avtomatik to'xtaydi", "await callback.answer() chaqirish kerak", "await bot.stop(callback)", "Loading to'xtamaydi"],
                answer: 1,
                explanation: "callback.answer() SHART! → Telegramga ushlandi. show_alert=True → popup xabar."
              },
              {
                question: "Async SQLite qaysi kutubxona?",
                options: ["sqlite3 (odatiy)", "aiosqlite", "sqlite_async", "async_sql"],
                answer: 1,
                explanation: "aiosqlite — asyncio-friendly SQLite API."
              },
              {
                question: "Lokal faylni bot orqali yuborish uchun?",
                options: ["await message.answer_document('file.pdf')", "FSInputFile('file.pdf') → answer_document(FSInputFile(...))", "file_url = local_file()", "upload_to_telegram(file)"],
                answer: 1,
                explanation: "from aiogram.types import FSInputFile; await message.answer_document(FSInputFile('file.pdf')). URL esa to'g'ridan-to'g'ri string ishlatiladi."
              }
            ]
          }
        },
        {
          title: 'Yakuniy takrorlash',
          duration: 30,
          xp: 50,
          content: {
            intro: "🎉 Tabriklayman! Siz Python kursining BARCHA asosiy mavzularini o'zdan o'tdingiz! Shu darsda barcha mavzularni QISQA, AMALIY TAKRORLAYMIZ va SERTIFIKATGA tayyor bo'lasiz! Oxirgi — INTERVYU uchun tayyorgarlik savollari + final loyiha taklifi.",
            sections: [
              {
                title: '1) Asoslar (Sintaksis, O‘zgaruvchilar, Turlar)',
                text: "✅ Sintaksis: indentatsiya (4 bo'sh joy), ; emas, yangi qator.\n✅ O'zgaruvchilar: snake_case, dinamik tur; a = 5 → a = \"Salom\" (qayta turini o'zgartirish).\n✅ Turlar: int, float, bool (True/False katta!), str (\"\" yoki ''), list, tuple, dict, set.\n✅ Tur aylantirish: int(), float(), str(), bool(), list(), dict().\n✅ print(), input() (string qaytaradi!).",
                code: "a = 10                # int\nb = 3.14              # float\nism = \"Ziyoda\"        # str\nflag = True           # bool\ntupl = (1, 2, 3)       # tuple (o'zgarmas)\nro_yxat = [1,2,\"salom\"] # list\ndict_1 = {'ism':'Ali', 'yosh':22}  # dict\n\nprint(f'Jami: {a + 5}, toliq ism: {ism}')  # f-string\nprint(f'int(\"15\") + 10 = {int(\"15\") + 10}')\nprint(f'str(123) + \"abc\" = {str(123) + \"abc\"}')",
                codeNote: "True va False → KATTA HARF! 0, [], '', None → False ga teng (falsy).",
                result: "Jami: 15, toliq ism: Ziyoda\\nint(\"15\") + 10 = 25\\nstr(123) + \"abc\" = 123abc",
                note: "type(x) — turini aniqlash."
              },
              {
                title: '2) Operatorlar, Shartlar, Sikllar',
                text: "✅ Arifmetik: +, -, *, / (float), // (butun), % (qoldiq), ** (daraja).\n✅ Taqqoslash: ==, !=, <, >, <=, >= → BOOL qaytar.\n✅ Mantiqiy: and, or, not.\n✅ Shart: if / elif / else.\n✅ For: for i in iterable (list/str/range/dict). range(n) → 0..n-1.\n✅ While: while shart: → break (to'xtat), continue (keyingi iteratsiyaga o't).\n✅ Match-case (Python 3.10+): alternative to long elif.",
                code: "# Shart\nball = 82\nif ball >= 90:\n    baho = 'A (5)'\nelif ball >= 80:\n    baho = 'B (4)'\nelif ball >= 70:\n    baho = 'C (3)'\nelse:\n    baho = 'D (2)'\nprint(f'Ball {ball} → {baho}')\n\n# For + break/continue\nprint('1..20 → 3 ga karrali (break 15):')\nfor i in range(1, 21):\n    if i == 15:\n        break\n    if i % 3 != 0:\n        continue\n    print(i, end=' ')\n\n# List comprehension (tezlik)\nkv = [x*x for x in range(1, 11) if x % 2 == 0]\nprint('\\nJuft sonlar kvadrati:', kv)",
                codeNote: "break = butun loopni to'xtat; continue = hozirgi iteratsiyani skip.",
                result: "Ball 82 → B (4)\\n1..20 → 3 ga karrali (break 15):\\n3 6 9 12 \\nJuft sonlar kvadrati: [4, 16, 36, 64, 100]",
                note: "range(start, stop, step) → step = qadam."
              },
              {
                title: '3) To‘plamlar (List, Tuple, Set, Dict) va String',
                text: "📋 List ( [] , o'zgaradi ): append, insert, pop, remove, reverse, sort, index, len.\n🔒 Tuple ( () , o'zgarmas ): list ga o'xshash, lekin uzgartirib bo'lmaydi → dict key sifatida ishlaydi.\n🔢 Set ( {} , takror yo'q, tartibsiz ): add, discard, union, intersection, difference.\n📘 Dict ( {key:value} ): get(key, default), keys/values/items, in (key bor yo'q).\n✍️ String: indeks, slicing, len, .upper/.lower/.strip/.replace/.find/.split/.join, in operatori, f-string, %, .format().",
                code: "my_list = [10, 20, 30, 40, 50]\nmy_list.append(60); my_list.pop(0); print('List:', my_list)\n\nmy_dict = {'uz': 'Salom', 'en': 'Hello', 'ru': 'Привет'}\nfor lang, soz in my_dict.items():\n    print(f'  {lang}: {soz}')\nprint('fr bor?', 'fr' in my_dict, '→ default:', my_dict.get('fr', 'Topilmadi'))\n\nmy_set = {1, 2, 2, 3, 3, 3, 4}\nprint('Set (takror yo‘q):', my_set, len(my_set))\n\ns = \"  Salom, Dunyo!  \"\nprint('String:', repr(s))\nprint('strip + replace:', s.strip().replace('Dunyo', 'Olam'))\nprint('split bo‘sh joy:', s.split())",
                codeNote: "dict.get(k, def) → KeyError bermaydi!",
                result: "List: [20, 30, 40, 50, 60]\\n  uz: Salom\\n  en: Hello\\n  ru: Привет\\nfr bor? False → default: Topilmadi\\nSet (takror yo‘q): {1, 2, 3, 4} 4\\nString: '  Salom, Dunyo!  '\\nstrip + replace: Salom, Olam!\\nsplit bo‘sh joy: ['Salom,', 'Dunyo!']",
                note: "List slicing: arr[1:4] → 1, 2, 3 indeks. [::-1] → teskariga."
              },
              {
                title: '4) Funksiyalar, Class/OOP, Xatolar, Modullar',
                text: "🔧 Funksiya: def nom(a, b=5, *args, **kwargs): ... return. Global → global z. Lambda: lambda x: x*x.\n🏫 OOP: class Nomi: → __init__(self,...) konstruktor. self = ob'ekt o'zi. Voris olish: class Child(Parent):. @property, @staticmethod, @classmethod.\n⚠️ Xatolar: try: → except ValueError as e: → else: → finally:. raise Xato('Matn').\n📦 Modullar: import modul → from modul import func → from pack.mod import cls as C. __name__ == '__main__'.\n🎁 Standart: math, random, datetime, json, re, os, sys, collections, itertools, pathlib, csv.",
                code: "# 1) Funksiya (default + *args)\ndef summa(*sonlar, koeff=1):\n    return sum(s * koeff for s in sonlar)\nprint('summa(1,2,3, koeff=2):', summa(1, 2, 3, koeff=2))\n\n# 2) Oddiy class\nclass User:\n    def __init__(self, name, yosh=18):\n        self.name = name\n        self.yosh = yosh\n    def salom(self):\n        return f'Salom, men {self.name}, {self.yosh} yosh'\n    def __str__(self):\n        return f'User: {self.name} ({self.yosh})'\n\nu = User('Shaxnoza', 21)\nprint(u.salom(), '| str:', u)\n\n# 3) try-except-finally\nprint('\\nXato ushlash:')\ntry:\n    n = int('abc')\nexcept ValueError as e:\n    print('ValueError ushlandi! Xato matni:', e)\nfinally:\n    print('(Bu har doim ishlaydi — finally)')",
                codeNote: "raise ValueError('sabab') → o'z xatoni yuzaga keltirish.",
                result: "summa(1,2,3, koeff=2): 12\\nSalom, men Shaxnoza, 21 yosh | str: User: Shaxnoza (21)\\n\\nXato ushlash:\\nValueError ushlandi! Xato matni: invalid literal for int() with base 10: 'abc'\\n(Bu har doim ishlaydi — finally)",
                note: "Dunder methods: __init__, __str__, __len__, __add__ → operator overloading."
              },
              {
                title: '5) Fayllar, Context manager (with), datetime, Comprehensions, Generators, Decorators, Iterators',
                text: "📄 Fayl: with open('f.txt', 'r', encoding='utf-8') as f: f.read() / f.readlines() / for line in f / f.write().\n⏰ Datetime: datetime.now(), strftime, strptime, timedelta (kun/soat qo'sh/ayir).\n✨ Comprehensions: [x**2 for x in ... if shart], {k:v ...}, {x ...}.\n⚡ Generator: (x**2 for x in ...) / def + yield → xotira tejaydi, cheksiz ketma-ketlik.\n🎀 Decorator: def deco(fn): def wrapper(*a,**kw): ... return wrapper. @deco → syntaxis sugar. functools.wraps.\n🔁 Iterator: iter() + next() → for orqa tomonda shu ishlaydi. Custom class: __iter__ + __next__ + StopIteration.",
                code: "# 1) Fayl (stringIO bilan, simulyatsiya)\nimport io\ns = io.StringIO('1-Qator\\n2-Qator\\n3-Qator\\n')\nprint('Fayl qatorlari:')\nfor i, line in enumerate(s, 1):\n    print(f'{i}. {line.strip()}')\n\n# 2) Comprehensions\nkv_toq = [x*x for x in range(1, 11) if x % 2 == 1]\nprint('\\nToq sonlar kvadrati:', kv_toq)\n\n# 3) Generator (yield)\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield b\n        a, b = b, a + b\nprint('Fibonacci 8 ta:', list(fib(8)))\n\n# 4) Decorator: @timing\nimport time, functools\ndef timer(fn):\n    @functools.wraps(fn)\n    def inner(*a, **kw):\n        t0 = time.time()\n        r = fn(*a, **kw)\n        print(f'⏱️ {fn.__name__}: {(time.time()-t0)*1000:.1f}ms')\n        return r\n    return inner\n\n@timer\ndef sekin_summa():\n    return sum(range(1_000_000))\nprint('\\nSumma:', sekin_summa())",
                codeNote: "with open → avtomatik close (context manager __enter__/__exit__).",
                result: "Fayl qatorlari:\\n1. 1-Qator\\n2. 2-Qator\\n3. 3-Qator\\n\\nToq sonlar kvadrati: [1, 9, 25, 49, 81]\\nFibonacci 8 ta: [1, 1, 2, 3, 5, 8, 13, 21]\\n⏱️ sekin_summa: 24.4ms\\nSumma: 499999500000",
                note: "Modul topish: sys.path → pip install qilganlar Lib/site-packages da."
              },
              {
                title: '6) RegEx, JSON, API requests, Data Science (NumPy/Pandas/Matplotlib)',
                text: "🔍 RegEx (re): r'' raw string; \\d, \\w, \\s, ., ^, $, *, +, ?, {n}; re.search/findall/sub/match/fullmatch; groups ().\n📦 JSON: json.loads/dumps (string) + json.load/dump (file). ensure_ascii=False (O'zbekcha!).\n🌐 API: requests.get(url, params=..., timeout=5). res.status_code, res.json(), res.text. POST: json=dict. try: ConnectionError/Timeout/HTTPError.\n🔢 NumPy: np.array, shape, dtype, zeros/ones/arange/linspace, +-*/ (vector), reshape, [row,col], boolean filter (qavs!), sum/mean/std/median/min/max, axis=0/1, random seed.\n📊 Pandas: pd.DataFrame (dict from), read_csv/to_csv, head/tail/info/describe, filter DF[DF.col > val] & | qavs!!, groupby.agg(), df['new'] = ..., isna().sum()/fillna()/dropna.\n📉 Matplotlib: plt.plot/bar/hist/scatter/pie, subplots, figsize, title/xlabel/ylabel/legend/grid, tight_layout, df.plot(), savefig/show.",
                code: "import re, json, numpy as np, pandas as pd\n# RegEx: email top\ntexts = \"Biz: admin@site.uz va info@company.com; no-at-sign\"\nemails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', texts)\nprint('RegEx → emails:', emails)\n\n# JSON: loads → dumps\npy = {'nom': 'Kitob', 'narx': 50000, 'mavjud': True}\njs = json.dumps(py, ensure_ascii=False, indent=2)\nprint('\\nJSON:', js[:40], '...')\n\n# NumPy + Pandas Mini\na = np.arange(1, 13).reshape(3,4)\nprint('\\nNumPy 3x4 shape:', a.shape, 'sum axis=0 (ustun):', a.sum(axis=0))\n\ndf = pd.DataFrame({'nom': ['Olma','Banan','Non'], 'narx':[15000,20000,3000], 'miqdor':[10,5,100]})\ndf['jami'] = df['narx'] * df['miqdor']\nprint('\\nPandas:')\nprint(df.to_string(index=False))\nprint('Umumiy jami:', df['jami'].sum())",
                codeNote: "NumPy/Pandas bool FILTER: (cond1) & (cond2) → HAR SHART QAVS!",
                result: "RegEx → emails: ['admin@site.uz', 'info@company.com']\\n\\nJSON: {\\n  \"nom\": \"Kitob\",\\n  \"narx\": 50000,\\n  \"mavjud\": true\\n} ...\\n\\nNumPy 3x4 shape: (3, 4) sum axis=0 (ustun): [12 15 18 21]\\n\\nPandas:\\nnom   narx  miqdor   jami\\nOlma  15000      10 150000\\nBanan 20000       5 100000\\nNon    3000     100 300000\\nUmumiy jami: 550000",
                note: "Data Science uchun Jupyter Notebook (pip install notebook) → interaktiv."
              },
              {
                title: '7) Venv, Testlash, Asyncio, Telegram bot',
                text: "🛡️ Venv (loyihalarni ajratish): python -m venv venv → activate → pip install X → pip freeze > requirements.txt → pip install -r req.txt. venv/ .gitignore ga!\n🧪 Testlash: unittest (TestCase class, self.assertEqual) + pytest (test_ def, assert; @parametrize, fixture, raises, pytest-cov 80%+ coverage). AAA pattern: Arrange-Act-Assert.\n⏱️ Asyncio: async def + await → create_task + gather (io-parallel). httpx/aiohttp (async HTTP), aiofiles (file), Semaphore (rate-limit), wait_for(timeout=). ⚠️ Sync (time.sleep / requests) → bloklaydi! → asyn versiyalar / asyncio.to_thread.\n🤖 Telegram bot (aiogram 3): @BotFather → token → .env (load_dotenv) → Bot() + Dispatcher() → @dp.message(Command) handler → await msg.answer → InlineKeyboard + callback_query (answer!) → aiosqlite async DB → deploy serverda (render/systemd).",
                code: "print('=== CHEAT SHEET (ishlab chiqarishda doim qo\\'llda!) ===')\nprint('')\nprint('🆕 YANGI LOYIHA (python web):')\nprint('mkdir project  →  cd project  →  python -m venv venv')\nprint('activate → pip install fastapi uvicorn httpx sqlalchemy aiosqlite pytest pytest-cov')\nprint('pip freeze > requirements.txt  →  .gitignore (venv/ .env __pycache__/)')\nprint('')\nprint('🛠️ AMALIY ISH TREND:')\nprint('1) Requirement → 2) Test (TDD) → 3) Kod → 4) Run test → 5) Refactor → 6) Deploy')\nprint('')\nprint('📖 Keyingi o\\'rganish yo\\'nalishlari:')\nprint('• Web Framework: FastAPI / Django')\nprint('• ORM: SQLAlchemy + Alembic (migration)')\nprint('• Task Queue: Celery / RQ + Redis')\nprint('• Database: Postgres + asyncpg / Redis (cache)')\nprint('• ML/Data: Scikit-learn, TensorFlow/PyTorch (keyingi kurs!)')\nprint('• Deployment: Docker + Docker Compose, GitHub Actions (CI/CD)')\nprint('• Monitoring + Logging: Sentry, Prometheus, Grafana')\nprint('')\nprint('🎓 Omad! Dasturlashni ZAKON qiling — HAR KUN amaliy mashq qiling!')",
                codeNote: "Yaxshi o'rganish uchun: LeetCode / CodeWars har kuni 1-2 ta problem.",
                result: "=== CHEAT SHEET (ishlab chiqarishda doim qo‘llda!) ===\\n\\n🆕 YANGI LOYIHA (python web):\\nmkdir project  →  cd project  →  python -m venv venv\\activate → pip install fastapi uvicorn httpx sqlalchemy aiosqlite pytest pytest-cov\\npip freeze > requirements.txt  →  .gitignore (venv/ .env __pycache__/)\\n\\n🛠️ AMALIY ISH TREND:\\n1) Requirement → 2) Test (TDD) → 3) Kod → 4) Run test → 5) Refactor → 6) Deploy\\n\\n📖 Keyingi o'rganish yo'nalishlari:\\n• Web Framework: FastAPI / Django\\n• ORM: SQLAlchemy + Alembic (migration)\\n• Task Queue: Celery / RQ + Redis\\n• Database: Postgres + asyncpg / Redis (cache)\\n• ML/Data: Scikit-learn, TensorFlow/PyTorch (keyingi kurs!)\\n• Deployment: Docker + Docker Compose, GitHub Actions (CI/CD)\\n• Monitoring + Logging: Sentry, Prometheus, Grafana\\n\\n🎓 Omad! Dasturlashni ZAKON qiling — HAR KUN amaliy mashq qiling!",
                note: "Omadingizga aminman — muvaffaqiyatlar!"
              },
              {
                title: '🏁 Yakun (SERTIFIKAT)',
                text: "Siz butun Python kursini muvaffaqiyatli o'tdingiz! Barcha mavzularni amaliy loyiha bilan mustahkamlashingizni tavsiya qilaman: masalan, \"Shaxsiy moliyaviy hisoblagich bot\" (daromad-chiqim, kategoriyalar, hisobot grafik, Excel eksport — bu barcha bilimlarni bir joyda ishlatadi!)."
              }
            ],
            keyPoints: [
              "Asos: int/float/str/bool/list/tuple/set/dict. f-string, type conversion.",
              "if/elif/else; for/while range(); break/continue; list comprehension.",
              "List: .append/.pop/.sort/.index; Dict: .get/items/keys/values; Set: add/intersection; String: split/join/strip.",
              "def func(*args, **kwargs, default): return | class + __init__ (OOP, inheritance) | try/except/finally (xatolar) | import modul.",
              "File: with open(); datetime timedelta; Generator yield; @decorator; iterator iter+next.",
              "RegEx (re.findall/search/sub); JSON (load/dump/dumps); API (requests.get + res.json + timeout + try).",
              "NumPy: array, shape, [row,col], boolean filter, axis sum/mean; Pandas: read_csv, filter, groupby, fillna; Matplotlib: plot/bar/hist, subplots, savefig.",
              "Venv: python -m venv, pip freeze; Test: unittest (class) + pytest (assert, parametrize, fixture, cov); Async: async/await, create_task + gather, Semaphore; Telegram: aiogram3, TOKEN env, handler, inline+callback, DB async."
            ],
            masterXp: 50,
            homework: "1. FINAL LOYIHA 🏆: Shaxsiy moliya bot (telegram):\n   • /qosh [summa] [kategoriya] → income chiqim (db yoz)\n   • /hisobot oy → jami chiqim daromad + matplotlib pie chart category bo'yicha (photo yubor!)\n   • /excel → oxirgi 30 kun excel (pandas → DataFrame → xlsx → FSInputFile yubor)\n   • Bazada users, transactions jadvali (aiosqlite).\n   • Avtomatik kategoriya taklifi (oxirgi so'zlar).\n2. Testlash: pytest orqali 20+ ta test yozing (hisoblash funksiyalari, validatsiyalar). coverage ≥80%.\n3. Deploy: render.com ga botni joylang, VDS + systemd bilammaguncha sinab ko'r.\n4. (Challenge) GitHub Actions CI → push qilganda avtomatik pytest run qilish (yml).\n5. (Challenge) Dockerfile yozing → botni docker container da ishga tushurib ko'r (docker compose + sqlite volume).",
            summary: "🎉 KURS TUGADI! Barcha Python bilimlarini takrorladik, amaliy loyiha taklif qilindi. Endi SERTIFIKAT uchun FINAL TEST yechishingiz mumkin! Omad!",
            exercises: [
              {
                id: 'pyFinEx1',
                type: 'liveedit',
                mode: 'simple',
                title: '1-MASHQ — Mini to‘plam amal 🔗',
                instruction: "list_a = [1,2,3,3,4,5,5], list_b = [4,5,6,7] → SET qilib: 1) Ikkalasi ham bor (intersection), 2) Birinchi faqat (list_a \\ list_b), 3) Hammasi (union) → chop qiling.",
                startCode: "list_a = [1,2,3,3,4,5,5]\nlist_b = [4,5,6,7]\n# Bu yerga kodingizni yozing: set() orqali\n",
                checks: [
                  { re: "set\\s*\\(\\s*list_a\\s*\\)\\s*\\.intersection\\s*\\(\\s*set\\s*\\(\\s*list_b\\s*\\)|\\s*&\\s*set\\s*\\(", msg: ".intersection() yoki & operatori ishlating!" }
                ],
                hint: "a, b = set(list_a), set(list_b); print(a & b, a - b, a | b)",
                explanation: "& = intersection, - = difference, | = union (set operations).",
                xp: 10
              },
              {
                id: 'pyFinEx2',
                type: 'dragdrop',
                title: '2-MASHQ — Final loyiha tartibi 🧩',
                instruction: "Shaxsiy moliya Telegram bot yaratishning TO'G'RI zanjirini yig'ing.",
                hint: "Muhit → Kerakli modullar → DB → Handlar → Testlash → Deploy",
                items: ['mkdir mol_bot; cd mol_bot; python -m venv venv; activate', 'pip install aiogram aiosqlite python-dotenv pandas openpyxl matplotlib pytest; pip freeze > req.txt', 'database.py: init_db(), add_tx(), get_monthly_report(), create_excel()', 'bot.py: /start, /qosh, /hisobot, /excel handlers + inline keyboard, chart rasm', 'pytest coverage 80%+ → GitHub repo', 'Deploy: render.com yoki VDS (systemd + venv)'],
                xp: 10
              },
              {
                id: 'pyFinEx3',
                type: 'detective',
                title: '3-MASHQ — Xatolikni top 🔍',
                instruction: "AIogram bot + NumPy/Pandas filter qilganda ValueError: 'The truth value of an array is ambiguous'. Sababi?",
                code: "import pandas as pd\ndf = pd.DataFrame({'a':[1,2,3], 'b':[4,5,6]})\n# XATO ❌: The truth value of a Series is ambiguous\nif df['a'] > 1 and df['b'] < 6:\n    print('Bu yerda xato!')",
                options: ["Pandas ulgurmaydi", "Python 'and' emas & (ampersand) + HAR SHART QAVS ichida bo'lishi kerak! DF[ (cond1) & (cond2) ]", "df qisqa nom emas, dataframe deb yozish kerak", "Matplotlib ulanmagan"],
                answer: 1,
                explanation: "Eng ko'p tarqalgan Python/Pandas/NumPy xato! Python 'and' ishlamaydi → & (and) va | (or) ishlatiladi, va HAR BIR SHART QAVSGA OLINGAN! To'g'ri: df[ (df.a > 1) & (df.b < 6) ]",
                xp: 10
              }
            ]
          },
          quiz: {
            passingScore: 80,
            questions: [
              {
                question: "Ro'yxatdan TAKRORLARNI OLIB TASHLASHNING ENG TEZ usuli?",
                options: ["for i in list: if list.count(i) > 1 remove", "set(list) → qayta list()", "dict.fromkeys(list)", "sort() + ketma-ket tekshir"],
                answer: 1,
                explanation: "list → set → list (set → duplicate yo'q, O(n)). Tartib muhim bo'lsa → dict.fromkeys Python 3.7+."
              },
              {
                question: "O'zgaruvchi son = int(input('Son: ')). Foydalanuvchi matn kiritishi mumkin — to'g'ri yechim?",
                options: ["try: int(input)... except ValueError: print('Faqat son!')", "son = int(input('Faqat son kiriting: '))", "if input type int else:", "Bunday xato bo'lavermaydi"],
                answer: 0,
                explanation: "User input doim xavfli → try except ValueError ushlash!"
              },
              {
                question: "for i in range(10): break kelganida keyingi i ni aniqlay oladigan usul?",
                options: ["for ... else: (break bo'lmasa else ishlaydi)", "qavs va flag o'zgaruvchi", "for ... finally:", "break holatni aniqlab bo'lmaydi"],
                answer: 0,
                explanation: "for + else: → break to'xtatmagan bo'lsa else ishlaydi."
              },
              {
                question: "dict dan key bor yo'qligini tekshirib, KeyError bermaydigan qisqa usul?",
                options: ["if k in dict: d[k] else None", "dict.get(key, default_value)", "try: d[k] except KeyError: return None", "Barchasi bir xil"],
                answer: 1,
                explanation: "d.get(k, def) → eng qisqa usul, xato bermaydi."
              },
              {
                question: "SQL (SQLite) jadvallarni yaratganingizda keyin to'ldirishdan avval qaysi buyruq?",
                options: ["ALTER TABLE", "CREATE TABLE IF NOT EXISTS", "CREATE NEW TABLE", "INIT TABLE"],
                answer: 1,
                explanation: "CREATE TABLE IF NOT EXISTS → mavjud bo'lsa qayta yaratmaydi (xato bermaydi)."
              },
              {
                question: "Katta JSON file 1GB — xotira tushmasligi uchun qanday qilish?",
                options: ["oddiy json.load hamma vaqt yaxshi", "ijson kabi streaming json library yoki chunarli format (json lines)", "listga olib keyin ishlat", "buni Pythonda iloj yo'q"],
                answer: 1,
                explanation: "Chunks/lines JSONL, yoki ijson iterativ parse — memory-friendly."
              },
              {
                question: "Async code ichida requests.get() — to'g'ri qarama-qarshilik?",
                options: ["To'g'ridan to'g'ri ishlat", "bloklaydi → httpx.AsyncClient() ishlat yoki asyncio.to_thread(requests.get)", "async requests.is_async()", "request_async() usuli bor"],
                answer: 1,
                explanation: "Sync requests.get() → event loop bloklamaydi? XATO! bloklaydi! → httpx (async) yoki to_thread da ishlat."
              },
              {
                question: "Loyiha deploy qilingan. Server ishlashi uchun /start bosganda userni DB ga yozish kerak — qaysi async DB?",
                options: ["sqlite3 — odatiy", "aiosqlite (async sqlite)", "pandas to_csv", "oddiy text file open"],
                answer: 1,
                explanation: "aiosqlite → asyncio asosida, event loopni bloklamaydi."
              }
            ]
          }
        }
    ]
}