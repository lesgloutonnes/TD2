@echo off
setlocal
cd /d "%~dp0"
title TD2 Gear Builder

echo.
echo  TD2 Gear Builder
echo  -----------------
echo  Lancement du serveur local (aucun npm requis).
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0lancer-builder.ps1"
set ERR=%ERRORLEVEL%
if not "%ERR%"=="0" (
  echo.
  echo  Echec du lancement (code %ERR%).
  echo  Si Windows bloque le script : clic droit sur lancer-builder.ps1
  echo  puis Proprietes ^> Deblocker.
  echo.
  pause
)
