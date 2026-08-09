@echo off
REM =====================================================================
REM  LANCER.cmd - ouvrir les capsules (visite guidee de demonstration)
REM ---------------------------------------------------------------------
REM  Sert les pages par un petit serveur local ecrit en Node pur
REM  (outils\servir.mjs) : aucune dependance, aucun telechargement,
REM  fonctionne hors ligne. Node est deja exige par le logiciel du centre.
REM
REM  Port 4190 : le notre. JAMAIS 8123, qui est l'administration
REM  d'inerWeb Habilitation - les deux doivent pouvoir tourner ensemble.
REM
REM  Pour l'arreter : fermer cette fenetre noire.
REM =====================================================================
setlocal
cd /d "%~dp0"

set PORT=4190

echo.
echo   Capsules - visite guidee
echo   ------------------------

where node >nul 2>&1
if errorlevel 1 (
  echo   [!] Node.js est introuvable sur ce poste.
  echo       Ouvrez alors directement refonte\visite.html en double-cliquant dessus.
  echo       ^(certaines pages marchent moins bien ainsi, mais la visite s'affiche^)
  echo.
  pause
  exit /b 1
)

start "" http://localhost:%PORT%/refonte/visite.html

echo.
echo   ^>^> LAISSEZ CETTE FENETRE OUVERTE pendant la demonstration.
echo.

node outils\servir.mjs %PORT% .
