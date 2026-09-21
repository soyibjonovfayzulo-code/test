' ============================================================
' ORZUTALIM DEV BOT — hidden launcher (terminal oyna KO'RSATMAYDI)
' bu fayl Task Scheduler'dan chaqiriladi (install-startup.bat)
' ============================================================
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

dir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = dir

' 0 = hidden window, False = kutmaslik
shell.Run "cmd /c bot-loop.cmd", 0, False
