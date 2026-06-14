@echo off
echo Testing build...
echo.

cd D:\SFA\backendSFA\backend-sfa

echo Checking TypeScript compilation...
npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo TypeScript compilation errors found
    goto :error
)

echo TypeScript compilation successful
echo.

echo Attempting NestJS build...
call npx nest build
if %ERRORLEVEL% NEQ 0 (
    echo NestJS build failed
    goto :error
)

echo Build successful!
goto :end

:error
echo.
echo ============================================
echo Build failed. Please check the errors above.
echo ============================================
echo.

:end
pause