@echo off
REM ============================================================
REM ORZUTALIM LOCAL DEV AGENT - Windows startup (Task Scheduler)
REM Admin sifatida BIR MAROTABA ishga tushiring:
REM   install-startup.bat
REM PC har restart bo'lganda agent avtomatik ishga tushadi.
REM ============================================================

setlocal
set AGENT_DIR=%~dp0
set TASK_NAME=OrzuTalimDevAgent-%USERNAME%

REM .env mavjudligini tekshirish
if not exist "%AGENT_DIR%.env" (
  echo XATO: agent papkasida .env yoq.
  echo agent\.env.example dan nusxa olib to'ldiring:
  echo   AGENT_NAME, AGENT_TOKEN, BOT_URL, REPO_PATH, BRANCH
  pause
  exit /b 1
)

REM Eski taskni ochirish
schtasks /Delete /TN "%TASK_NAME%" /F >nul 2>&1

REM Task yaratish: user logon bo'lganda hidden window'da npm start
schtasks /Create /TN "%TASK_NAME%" ^
  /TR "cmd /c cd /d \"%AGENT_DIR%\" && npm start >> \"%AGENT_DIR%agent.log\" 2>&1" ^
  /SC ONLOGON /RU %USERNAME% /RL HIGHEST /F

if %errorlevel%==0 (
  echo.
  echo ============================================================
  echo  OK: Agent Windows startup'ga ulandi ^(task: %TASK_NAME%^)
  echo  - Har user logon bo'lganda hidden background'da start
  echo  - Network uzilsa: agent o'zi reconnect qiladi ^(backoff^)
  echo  - Log: %AGENT_DIR%agent.log
  echo  - Hozir ishga tushirish: schtasks /Run /TN "%TASK_NAME%"
  echo  - Toxtatish: taskkill /F /IM node.exe yoki Task Scheduler
  echo ============================================================
) else (
  echo.
  echo XATO: Task yaratilmadi. Terminalni "Run as administrator" bilan oching.
)
pause
