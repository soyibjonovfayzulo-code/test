@echo off
REM ============================================================
REM ORZUTALIM DEV BOT - Windows startup'ga ulash (BIR MAROTABA)
REM
REM BU FAYLNI ADMIN sifatida BIR MAROTABA ishga tushiring.
REM
REM Nima qiladi:
REM  - Task Scheduler'da "OrzuTalimDevBot" task yaratadi
REM  - Har user LOGON bo'lganda bot hidden background'da start
REM  - Terminal oynasi OCHilmaydi
REM  - Crash auto-restart: bot-loop.cmd ichida
REM  - PC restart -> avtomatik qayta start
REM
REM ONLOGON sababi: git push credentials (Credential Manager)
REM user profilida saqlanadi - SYSTEM sessiyasida ishlamaydi.
REM ============================================================

setlocal
set PROD_DIR=%~dp0
set TASK_NAME=OrzuTalimDevBot
set VBS=%PROD_DIR%start-bot-hidden.vbs

if not exist "%VBS%" (
  echo XATO: %VBS% topilmadi
  pause
  exit /b 1
)

schtasks /Delete /TN "%TASK_NAME%" /F >nul 2>&1

schtasks /Create /TN "%TASK_NAME%" /TR "wscript.exe \"%VBS%\"" /SC ONLOGON /RU %USERNAME% /RL HIGHEST /F

if %errorlevel%==0 (
  echo.
  echo ============================================================
  echo  OK: Bot Windows startup'ga ulandi ^(task: %TASK_NAME%^)
  echo  - Har user logon bo'lganda hidden background'da start
  echo  - Crash - avtomatik restart ^(5s^)
  echo  - Log: github-team-bot\logs\bot.log
  echo  - Hozir ishga tushirish: schtasks /Run /TN "%TASK_NAME%"
  echo  - Toxtatish: stop-bot.cmd
  echo  - Ochirish: uninstall-startup.bat
  echo ============================================================
) else (
  echo.
  echo XATO: Task yaratilmadi. Terminalni "Run as administrator"
  echo bilan oching va bu faylni qayta ishga tushiring.
)
pause
