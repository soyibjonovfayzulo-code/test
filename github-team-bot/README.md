# 🤖 OrzuTalim Dev Bot — Central Bot + 5 Local Agent

**Arxitektura:** Central Telegram Bot (serverda) + 5 ta Local Dev Agent (har developer kompyuterida) + GitHub.

```
Sardor Telegramda: 🚀 Git Push → ✅ PUSH QILISH
  ↓
Central Bot (server, port 4010) — faqat 5 member whitelist
  ↓ command queue (token auth)
Sardorning LOCAL AGENTI (o'z kompyuterida)
  ↓ REAL git: add → commit → push origin sardor
GitHub (soyibjonovfayzulo-code/test)
  ↓ webhook
Telegram guruh: 📦 GIT ACTIVITY + user chat: ✅ GIT PUSH BO'LDI
```

## 👥 5 Member (whitelist — boshqasi umuman ishlamaydi)

| Member | GitHub | Branch |
|---|---|---|
| ahatjon | soyibjonovfayzulo-code | ahatjon |
| sardor | eldorhakimuv7-spec | sardor |
| shodyona | shodiyona531-boop | shodyona |
| oyatilo | stormdeveloper-glitch | oyatilo |
| omadbek | ovaliyev484-bit | omadbek |

Branchlar GitHub'da main'dan yaratilgan: `node scripts/setup-branches.js`

## 🖥️ AGENT SETUP (har developer uchun)

1. Admin `node scripts/gen-agent-env.js` ishga tushiradi → `agent-setup/<ism>.env` fayllar tayyor
2. Developer `agent/` papkasini o'z kompyuteriga ko'chiradi
3. `agent-setup/<ism>.env` ni `agent/.env` nomi bilan saqlaydi
4. `.env` ichida `REPO_PATH` ni o'z kompyuteridagi OrzuTalim repo yo'liga to'g'rilaydi
5. Ishga tushirish: `npm start` (agent papkasida)
6. **Windows avtomatik start:** `install-startup.bat` ni admin sifatida bir marta ishga tushirish (Task Scheduler)
7. Agent natijalari Telegram'ga avtomatik keladi

Agent xavfsizligi: faqat o'z tokeni bilan ulanadi, faqat o'z branchiga push, main push TAQIQLANGAN, force/reset/clean mavjud emas, commit message whitelist regex, 60s timeout, network uzilsa exponential backoff reconnect, Windows startup + crash himoyasi.

## 🧪 Setup scriptlar

```bash
node scripts/setup-branches.js    # GitHub'da 5 ta branchni yaratish (main'dan)
node scripts/setup-webhook.js     # GitHub webhook yaratish (PUBLIC_WEBHOOK_URL kerak)
node scripts/gen-agent-env.js     # har member uchun agent .env tayyorlash
```



## 🎯 Yangi Workflow (v2)

Faqat 5 member (whitelist): **ahatjon, sardor, shodyona, oyatilo, omadbek** — boshqa hech kim Git operatsiyalar qila olmaydi.

```
/start
↓
Ismingizni kiriting:      (whitelist tekshiruvi)
↓
✅ Sardor tanildi.
↓
FAQAT 3 TA TUGMA:
┌──────────────┬──────────────┐
│ 🚀 Git Push  │ 🔄 Git Pull  │
├──────────────┴──────────────┤
│ 🕒 Oxirgi kod o'zgartirgan  │
└─────────────────────────────┘
```

- **🚀 Git Push** → preview (member, branch, changed files, commits ahead, oxirgi commit) → `✅ PUSH QILISH` → **REAL** `git push origin <allowed-branch>` → `✅ GIT PUSH BO'LDI` (exit code 0 bo'lsa) yoki `❌ GIT PUSH BO'LMADI` + xavfsiz sabab. Success bo'lsa "Oxirgi kod o'zgartirgan" yangilanadi.
- **🔄 Git Pull** → `✅ PULL QILISH` → `git fetch origin` + `git merge --ff-only origin/main` → `✅ GIT PULL BO'LDI` / `❌ GIT PULL BO'LMADI` (conflict bo'lsa xavfsiz to'xtaydi — avtomatik hal qilinmaydi).
- **🕒 Oxirgi kod o'zgartirgan** → oxirgi muvaffaqiyatli push (bot audit logi yoki repo oxirgi commit): kim, branch, commit, message, vaqt.

## 🔐 Access modeli

```
Telegram User ID → Team member → GitHub username → Allowed branch
```

- Push **faqat** o'z branchiga; **main/master'ga push MUTLAQO TAQIQLANGAN** (force push ham yo'q — kod darajasida imkoni yo'q).
- Ismga ishonch YO'Q: ism faqat birinchi da'vo qilgan Telegram ID'ga bog'lanadi, keyin har doim ID bo'yicha taniladi.
- Noma'lum user barcha Git funksiyalardan bloklangan.
- Branch nomi Telegram message'dan emas, FAQAT real git (`git branch --show-current`) va config'dan olinadi.
- Git: `spawn('git', argsArray)` — shell YO'Q, argument whitelist regex, timeout, `reset --hard`/`clean -fd` umuman mavjud emas.
- Eski komandalar (`/help /team /commits /pr /main /mybranch /bind`) foydalanuvchiga **yashirin** — faqat `/start` va `/status` ko'rinadi.
- Admin komandalar (faqat `BOT_ADMIN_IDS`, yashirin): `/members`, `/setbranch <ism> <branch>`, `/setgithub <ism> <user>`, `/enable <ism>`, `/disable <ism>`, `/unbind <ism>`, `/pushhistory`. Admin ham raw shell ishlata olmaydi.

## ⚙️ Sozlash (.env)

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
GITHUB_TOKEN=            # private repo uchun
GITHUB_OWNER=...
GITHUB_REPO=...
GITHUB_WEBHOOK_SECRET=...
BOT_ADMIN_IDS=...        # admin Telegram IDlari (vergul bilan)
BOT_PORT=4010
REPO_PATH=C:\projects\orzutalim   # bot shu repoda Git operatsiyalar bajaradi
PUBLIC_WEBHOOK_URL=...
```

## 🚀 Production ishga tushirish (avtomatik restart)

### Windows server/PC

**Variant A — PM2 (tavsiya):**
```powershell
npm install -g pm2
pm2 start github-team-bot/src/index.js --name orzutalim-dev-bot
pm2 save
pm2-startup install    # Windows'da pm2-installer kerak: https://github.com/jessety/pm2-installer
```

**Variant B — Windows Task Scheduler (PM2'siz):**
1. `Win+R` → `taskschd.msc`
2. Create Task → Trigger: "At startup" + "Daily"
3. Action: `powershell.exe -WindowStyle Hidden -Command "cd C:\Users\...\aaaayti\github-team-bot; npm start"`
4. "Run whether user is logged on or not" ✅

Terminal yopilsa ham, PC restart bo'lsa ham bot qayta ishga tushadi.

### Linux server
```bash
pm2 start github-team-bot/src/index.js --name orzutalim-dev-bot
pm2 save && pm2 startup
```

## 🩺 Health & Monitoring

- `GET /health` → `{ ok, bot, telegram, git, uptime }` (secretlar qaytmaydi)
- Telegram polling: exponential backoff (1s→30s), 429/5xx/timeout/network — o'zi tiklanadi, 409 (duplicate instance) — ogohlantiradi
- GitHub webhook: HMAC signature (invalid → 401), duplicate delivery skip, bot-push bilan duplicate notification skip
- `uncaughtException`/`unhandledRejection` processni o'ldirmaydi

---

## 📚 ESKI HUJJAT (arxitektura referens)

Bot nima qiladi?


| Event | Xabar |
|---|---|
| **Push** (har qanday branch) | 👤 kim, 🌿 qaysi branch, 📝 commit, 📁 o'zgargan fayllar, 📊 +/- soni, 🎯 module |
| **Push** → `main` | ⚠️ MAIN YANGILANDI + `git fetch origin && git merge origin/main` ko'rsatmasi + har bir a'zoning branchi |
| **Branch main'dan orqada qolsa** | 🔔 BRANCH YANGILANISHI KERAK (nechta commit ortda + compare link) |
| **PR opened** | 🔀 YANGI PULL REQUEST (from → to, files, inline buttons) |
| **PR synchronized** | 🔄 PR yangilandi + conflict tekshiruv |
| **PR conflict** | 🚨 MERGE CONFLICT ogohlantirish (avtomatik merge QILINMAYDI) |
| **PR merged** | ✅ PULL REQUEST MERGED (⚠️ main yangilandi) |
| **CI workflow** | ❌ BUILD FAILED / ✅ BUILD PASSED (recovery holatida; spam kamaytirilgan) |

## Telegram komandalari

```
/help      — yordam
/status    — repo umumiy holati (last commit, open PR, branches)
/team      — jamoa + har bir branching main'ga nisbatan holati (🟢🟡🔵)
/commits   — so'nggi 5 commit (linklar bilan)
/pr        — ochiq PRlar (mergeable holati bilan)
/main      — main branch oxirgi commit holati
/mybranch  — sizning branchingiz holati + update ko'rsatmasi
/bind      — GitHub hisobni Telegram'ga bog'lash
```

## Arxitektura

```
github-team-bot/            ← MUSTAQIL modul/process (root projectga dependency YO'Q)
├── package.json            ← nol dependency (Node >= 18, native fetch)
├── .env.example            ← environment namunasi (secret yo'q)
├── .gitignore
├── data/
│   └── bot-state.json      ← alohida storage (OrzuTalim DB ga tegmaydi)
├── scripts/
│   └── simulate-webhook.js ← LOCAL TEST MODE (faqat localhost)
├── src/
│   ├── index.js            ← orchestrator (mustaqil process)
│   ├── config.js           ← .env loader + validatsiya
│   ├── telegram.js         ← Bot API client (long polling + retry)
│   ├── github.js           ← REST API client (rate limit hisobga olingan)
│   ├── webhook.js          ← event router (signature + dedupe)
│   ├── server.js           ← alohida HTTP server (default :4010)
│   ├── database.js         ← JSON storage (atomic write)
│   ├── formatters.js       ← xabar formatlash + module detection
│   ├── security.js         ← HMAC signature, admin check, kod generator
│   ├── logger.js           ← [WEBHOOK]/[TELEGRAM]/[GITHUB]/[ERROR] loglar (secret mask)
│   ├── commands/           ← help, status, team, commits, pullRequests, main, myBranch, bind
│   └── handlers/           ← push, pullRequest, workflow
└── test/                   ← node:test (13 test)
```

Muhim: `server/server.cjs` va `server/db.cjs` fayllari **umuman o'zgartirilmagan**. Bot alohida portda (4010), alohida process sifatida ishlaydi — OrzuTalim serveri (3000) crash bo'lsa ham bot ishlaydi, aksincha ham.

## O'rnatish

```bash
# 1. .env faylini yaratish
cp github-team-bot/.env.example github-team-bot/.env
# va qiymatlarni to'ldiring (pastroqda)
```

**Node.js >= 18** talab qilinadi (native `fetch` uchun). `npm install` KERAK EMAS — bot dependency-free.

## Environment Variables (`.env`)

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...     # @BotFather token
TELEGRAM_CHAT_ID=-1001234567890          # dev guruh chat ID (manfiy)
GITHUB_TOKEN=github_pat_...              # private repo uchun (public da ixtiyoriy)
GITHUB_OWNER=orzutalim                   # repo egasi
GITHUB_REPO=orzutalim.uz                 # repo nomi
GITHUB_DEFAULT_BRANCH=main
GITHUB_WEBHOOK_SECRET=uzoq-tasodifiy-string   # GitHub webhook sozlamasidagi bilan BIR XIL
BOT_ADMIN_IDS=111111,222222              # Telegram admin user IDlar
BOT_PORT=4010
PUBLIC_WEBHOOK_URL=https://orzutalim.uz/github-bot/webhook
NOTIFY_WORKFLOW_SUCCESS=false            # true = har success build haqida xabar
```

> GitHub Token uchun **minimal permission**: fine-grained PAT, faqat **Contents: read** + **Pull requests: read**. Write huquqi KERAK EMAS — bot hech narsani yozmaydi, faqat o'qiydi.

## Telegram sozlash

1. Telegram'da **@BotFather** → `/newbot` → token oling → `TELEGRAM_BOT_TOKEN` ga yozing
2. Botni dev guruhga qo'shing (admin huquq shart emas, faqat xabar yuborish)
3. Chat ID olish: guruhga biror xabar yozib `https://api.telegram.org/bot<TOKEN>/getUpdates` dan `chat.id` oling (manfiy bo'ladi) → `TELEGRAM_CHAT_ID`
4. Admin IDlar: `@userinfobot` yoki `@getmyid_bot` dan → `BOT_ADMIN_IDS` (vergul bilan)

## GitHub Webhook sozlash

1. Repo → **Settings → Webhooks → Add webhook**
2. **Payload URL**: `PUBLIC_WEBHOOK_URL` qiymati, masalan `https://orzutalim.uz/github-bot/webhook`
   (reverse proxy: `https://orzutalim.uz/github-bot/webhook → localhost:4010/webhook/github`)
3. **Content type**: `application/json`
4. **Secret**: `GITHUB_WEBHOOK_SECRET` bilan bir xil qiymat
5. **Events**: `push`, `pull requests`, `workflow runs` (Let me select individual events)

Webhook sifati HMAC-SHA256 bilan tekshiriladi: noto'g'ri signature → **401**, duplicate delivery → skip.

## Ishga tushirish

```bash
# Local (root dan):
npm run bot          # yoki: node github-team-bot/src/index.js

# Bot papkasi ichidan:
npm start
```

### Local test mode (webhook simulyatsiya)

Bot running holatda, alohida terminalda:

```bash
cd github-team-bot
node scripts/simulate-webhook.js push          # branch push
node scripts/simulate-webhook.js pushMain      # main push (jamoa ko'rsatmasi)
node scripts/simulate-webhook.js pr-open       # PR opened
node scripts/simulate-webhook.js pr-merge      # PR merged
node scripts/simulate-webhook.js workflow-fail # CI failed
```

Bu FAQAT `localhost:4010` ga yuboradi — production Telegram guruhiga soxta xabar chiqmaydi (faqat botning o'zi running bo'lsa, o'sha guruhga yuboradi).

## Production deployment

```bash
# PM2 bilan (tavsiya):
pm2 start github-team-bot/src/index.js --name orzutalim-dev-bot
pm2 save

# Yoki oddiy:
nohup node github-team-bot/src/index.js > logs/bot.log 2>&1 &
```

- Bot **alohida port**da ishlaydi (4010) — mavjud OrzuTalim serveriga (3000) ta'sir qilmaydi, restart qilmaydi
- Nginx reverse proxy misoli:

```nginx
location /github-bot/ {
    proxy_pass http://127.0.0.1:4010/;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## Xavfsizlik

- ✅ Hech qanday token/secret source code ichida YO'Q — hammasi `.env`da (`.gitignore`da)
- ✅ Webhook **HMAC-SHA256 signature** tekshiruvi (invalid → 401)
- ✅ **Duplicate delivery** himoyasi (bir event ikki marta yuborilmaydi)
- ✅ Loglarda **secret mask** qilinadi
- ✅ Admin komandalar (`/approve`, `/setbranch`, `/unlink`) faqat `BOT_ADMIN_IDS` uchun
- ✅ Bot crash-ga chidamli: `uncaughtException`/`unhandledRejection` processni o'ldirmaydi
- ✅ Telegram 429 rate limit — `retry_after` hurmat qilinadi
- ✅ `/bind` — one-time verification kod (15 daqiqa) + admin tasdiqlash; soxta bog'lash mumkin emas

## Bind flow (hisob bog'lash)

1. A'zo: `/bind jasurbek` → bot 6 xonali kod beradi
2. A'zo kodni admin'ga shaxsan ko'rsatadi (shaxsni tasdiqlash)
3. Admin: `/approve jasurbek <kod>` → bog'lanish yaratiladi
4. Admin: `/setbranch jasurbek jasurbek/tests` → branch mapping
5. Bekor qilish: `/unlink jasurbek`

Team mapping **kod ichida hardcode emas** — database (data/bot-state.json) orqali boshqariladi.

## Testlar

```bash
cd github-team-bot
npm test     # 13 test: push parse, PR opened/merged, main updated,
             # invalid signature, duplicate, formatting, branch status,
             # GitHub API error, unknown user, bind flow, module detection
```

## Troubleshooting

| Muammo | Yechim |
|---|---|
| Bot ishga tushmaydi, ENV yetishmaydi | `.env` faylini tekshiring (`.env.example` bilan solishtiring) |
| Webhook 401 qaytaryapti | GitHub webhook `Secret` = `GITHUB_WEBHOOK_SECRET` tekshiring |
| Xabarlar kelmaydi | `TELEGRAM_CHAT_ID` to'g'riligini (manfiy, `-100...`), bot guruhda ekanini tekshiring |
| `403 rate limit` | `GITHUB_TOKEN` qo'shing (public repo uchun ham tavsiya) |
| Branchlar `❓ tekshirilmadi` | Branch nomini `/setbranch` bilan to'g'rilang |
| Testlar ishlamayapti | Node >= 18 ekanini tekshiring (`node -v`) |

