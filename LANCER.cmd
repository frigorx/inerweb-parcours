@echo off
REM =====================================================================
REM  LANCER.cmd — ouvrir l'atelier animations
REM ---------------------------------------------------------------------
REM  POURQUOI CE FICHIER EXISTE
REM  Ouvrir une page en double-cliquant sur le fichier .html marche
REM  souvent, mais pas toujours : selon la configuration de Windows, le
REM  .html part dans un editeur, ou le navigateur bloque les fichiers
REM  voisins. Ce lanceur sert la page par un petit serveur local : c'est
REM  le seul moyen d'avoir exactement le meme comportement partout.
REM
REM  Il n'installe rien, ne modifie rien, n'envoie rien sur Internet.
REM  Pour l'arreter : fermer cette fenetre noire.
REM =====================================================================
setlocal
cd /d "%~dp0"

set PORT=8123

echo.
echo   Atelier animations
echo   ------------------
echo   Demarrage du serveur local sur le port %PORT%...
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo   [!] Python est introuvable.
  echo       Ouvrez alors directement le fichier ACCUEIL.html en double-cliquant dessus.
  echo.
  pause
  exit /b 1
)

start "" http://localhost:%PORT%/ACCUEIL.html

echo   Le navigateur va s'ouvrir sur la page d'accueil.
echo.
echo   ^>^> LAISSEZ CETTE FENETRE OUVERTE pendant que vous testez.
echo   ^>^> Fermez-la quand vous avez fini.
echo.

python -m http.server %PORT% --bind 127.0.0.1
