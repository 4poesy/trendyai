@echo off
REM ============================================================
REM  Trendtactics Digital — Cloudflare Tunnel Auto-Start
REM  This script runs cloudflared tunnel on Windows startup.
REM  Place a shortcut to this file in:
REM    %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
REM ============================================================

REM Kill any existing cloudflared processes to avoid conflicts
taskkill /F /IM cloudflared.exe >nul 2>&1

REM Wait a moment for network interfaces to be ready
timeout /t 10 /nobreak >nul

REM Start cloudflared tunnel in background
start "" /B "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel run

echo Cloudflare tunnel started at %date% %time%
