@echo off
echo ==============================================
echo  TEAM TASK MANAGER - LAUNCHER SCRIPT
echo ==============================================
echo.

echo [1/3] Checking and clearing port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 2^>nul') do (
    echo Killing background process %%a holding port 5000...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] Checking and starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB service started successfully!
) else (
    echo Note: Could not start MongoDB service. If it is already running or you are using Atlas, this is fine.
)

echo.
echo [3/3] Starting Task Manager Application...
echo.
npm run dev

pause
