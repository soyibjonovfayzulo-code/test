@echo off
REM ============================================================
REM ORZUTALIM DEV BOT - toxtatish (loop + node)
REM ============================================================
setlocal

echo Bot (loop + node) toxtatilmoqda...

powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*bot-loop.cmd*' -or ($_.Name -eq 'node.exe' -and $_.CommandLine -like '*src\index.js*') } | ForEach-Object { Write-Host ('toxtatildi PID ' + $_.ProcessId + ' [' + $_.Name + ']'); Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 4010 -State Listen -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host 'port 4010 ozodlandi' }"

echo Bot toxtatildi.
