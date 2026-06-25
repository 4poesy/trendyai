@echo off
title TrendyAI Startup Manager
echo ===================================================
echo     Starting All TrendyAI Infrastructure Services
echo ===================================================
echo.

:: 1. Start Docker Containers
echo [1/3] Starting local Docker Stack (Flowise, activepieces, n8n, etc.)...
cd "C:\Users\Akinola Olujobi\Documents\TrendyAi"
docker compose up -d
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ ERROR: Make sure Docker Desktop application is launched and running!
    echo.
    pause
    exit /b
)
echo Docker stack is UP!
echo.

:: 2. Start Local Bridge API
echo [2/3] Starting Local Bridge API (Port 4500) in new window...
start "TrendyAI Local Bridge API" cmd /k "cd C:\Users\Akinola Olujobi\trendyai-bridge && npm start"
echo.

:: 3. Start Cloudflare Tunnel
echo [3/3] Exposing Bridge via Cloudflare Tunnel...
echo.
echo 💡 IMPORTANT REMINDER:
echo Once the next window opens, copy the generated trycloudflare.com URL 
echo (e.g. https://xxxx-xxxx.trycloudflare.com) and paste it into 
echo your Railway dashboard under the "BRIDGE_URL" environment variable.
echo.
pause
start "Cloudflare Quick Tunnel" cmd /k "cloudflared tunnel --url http://localhost:4500"

echo.
echo All services launched! You can now close this launcher.
echo ===================================================
pause
