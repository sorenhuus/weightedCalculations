@echo off
REM This script installs dependencies and runs tests
REM Make sure Node.js and npm are in your PATH

echo Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo Running tests...
call npm test

pause
