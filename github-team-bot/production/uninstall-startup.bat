@echo off
REM ORZUTALIM DEV BOT - startup'dan ochirish
setlocal
set TASK_NAME=OrzuTalimDevBot

schtasks /Delete /TN "%TASK_NAME%" /F
if %errorlevel%==0 (
  echo Task ochirildi - bot endi Windows start bilan ishga tushmaydi.
) else (
  echo Task topilmadi yoki ochirib bolmadi.
)
echo Ishlayotgan botni toxtatish: stop-bot.cmd
pause
