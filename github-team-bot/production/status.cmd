@echo off
REM ============================================================
REM ORZUTALIM DEV BOT - holatni tekshirish
REM ============================================================
setlocal

echo === TASK SCHEDULER ===
schtasks /Query /TN "OrzuTalimDevBot" >nul 2>&1
if %errorlevel%==0 (
  echo Task mavjud: OrzuTalimDevBot
  schtasks /Query /TN "OrzuTalimDevBot" /FO LIST | findstr /I "Status Status:"
) else (
  echo Task ornashilmagan - install-startup.bat ishga tushiring
)

echo.
echo === BOT PROCESS ===
powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*src\index.js*' }; if ($p) { Write-Host ('node ishlayapti PID ' + $p.ProcessId) } else { Write-Host 'node process YOQ' }"

echo.
echo === HEALTH ===
powershell -NoProfile -Command "try { $h = Invoke-RestMethod http://localhost:4010/health -TimeoutSec 5; Write-Host ('health ok=' + $h.ok + ' telegram=' + $h.telegram + ' git=' + $h.git + ' uptime=' + $h.uptime + 's') } catch { Write-Host 'health JAVOB BERMAYDI (bot toxtatilgan?)' }"

echo.
echo === OXIRGI LOG (5 qator) ===
powershell -NoProfile -Command "if (Test-Path '%~dp0..\logs\bot.log') { Get-Content '%~dp0..\logs\bot.log' -Tail 5 } else { Write-Host 'log yoq' }"
