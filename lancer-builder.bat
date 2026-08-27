@echo off
setlocal
cd /d "%~dp0"

echo.
echo  TD2 Gear Builder
echo  -----------------
echo  Lancement du serveur local (aucun npm requis).
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0lancer-builder.ps1"
if errorlevel 1 (
  echo.
  echo  Echec du lancement. Sous Windows, PowerShell doit etre autorise.
  echo  Clic droit sur lancer-builder.ps1 ^> Executer avec PowerShell.
  pause
)
