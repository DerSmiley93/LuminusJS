@echo off
echo Starting TypeScript in watch mode...

:: Check if TypeScript is installed
where tsc >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo TypeScript compiler not found! Please install TypeScript:
    echo npm install -g typescript
    pause
    exit /b 1
)

:: Run TypeScript in watch mode
echo TypeScript compiler found. Starting watch mode...
tsc --watch

pause