@echo off
title 9-Dots Experiment (Optimized)
cd /d "%~dp0"

echo ========================================================
echo   Nine Dots Cognitive Experiment (Optimized)
echo   Languages: Russian / English
echo   URL: http://localhost:3000
echo ========================================================
echo.

start "" "http://localhost:3000"
node server.js
pause
