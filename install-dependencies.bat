@echo off
echo Installing dependencies for backend SFA...
echo.

REM Try npm install with various flags
echo Attempting npm install...
call npm install --legacy-peer-deps --no-audit --no-fund

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Standard npm install failed. Trying alternative methods...
    echo.
    
    REM Try with cache cleared
    echo Trying with cache cleared...
    call npm cache clean --force
    call npm install --legacy-peer-deps --no-audit --no-fund
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Dependencies installed successfully!
    echo ============================================
    echo.
) else (
    echo.
    echo ============================================
    echo Installation failed. Please try manually:
    echo   cd D:\SFA\backendSFA\backend-sfa
    echo   npm install
    echo ============================================
    echo.
)

pause