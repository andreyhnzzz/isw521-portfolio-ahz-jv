@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 5500
) else (
  python -m http.server 5500
)
endlocal
