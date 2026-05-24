@echo off
cd /d "%~dp0"
"D:\New Folder\npm.cmd" run dev -- --host 127.0.0.1 --port 5186 > "%~dp0run-dev-5186.log" 2>&1
