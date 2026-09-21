@echo off
REM ============================================================
REM ORZUTALIM DEV BOT - restart loop (production)
REM ASCII ONLY (cmd.exe em-dash/emoji parser qilolmaydi)
REM
REM - node crash bo'lsa  -> 5s dan keyin avtomatik restart
REM - port band bo'lsa   -> boshqa instance ishlayapti (kod 99),
REM                         60s kutib qayta tekshiradi
REM - PC restart         -> Task Scheduler (install-startup.bat)
REM Log: github-team-bot\logs\bot.log   Toxtatish: stop-bot.cmd
REM ============================================================

setlocal
cd /d "%~dp0.."

if not exist logs mkdir logs

echo [%date% %time%] === BOT LOOP START === >> logs\bot.log

REM === SINGLE INSTANCE GUARD: port 4010 band bo'lsa loop chiqadi
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 4010 -State Listen -ErrorAction SilentlyContinue; if ($c) { exit 1 } else { exit 0 }"
if errorlevel 1 (
  echo [%date% %time%] Bot allaqachon ishlayapti ^(port 4010 band^) - bu loop chiqyapti >> logs\bot.log
  exit /b 0
)

:loop
node src\index.js >> logs\bot.log 2>&1
set EXITCODE=%errorlevel%
echo [%date% %time%] bot exited ^(code %EXITCODE%^) >> logs\bot.log
if "%EXITCODE%"=="99" (
  echo [%date% %time%] DUPLICATE instance - 60s kutamiz >> logs\bot.log
  timeout /t 60 /nobreak >nul
) else (
  echo [%date% %time%] 5s dan keyin restart >> logs\bot.log
  timeout /t 5 /nobreak >nul
)
goto loop
