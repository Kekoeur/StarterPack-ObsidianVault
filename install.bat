@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║  🧠 Obsidian Vault — Installation Starter Pack  ║
echo  ╚══════════════════════════════════════════════════╝
echo.

REM ═══ Détection du dossier du starter pack ═══
set "STARTER=%~dp0"
if "%STARTER:~-1%"=="\" set "STARTER=%STARTER:~0,-1%"

echo  Starter Pack détecté : %STARTER%
echo.

REM ═══ Demander le chemin du vault ═══
set /p "VAULT=  Chemin du vault Obsidian à créer (ex: C:\Users\Moi\Documents\Mon Vault) : "
if "%VAULT%"=="" (
    echo  ❌ Chemin vide. Annulé.
    pause
    exit /b 1
)

if exist "%VAULT%" (
    echo.
    echo  ⚠️  Le dossier "%VAULT%" existe déjà.
    set /p "CONFIRM=  Continuer quand même ? Les fichiers existants ne seront PAS écrasés. (o/n) : "
    if /i not "!CONFIRM!"=="o" (
        echo  Annulé.
        pause
        exit /b 0
    )
) else (
    mkdir "%VAULT%"
    if errorlevel 1 (
        echo  ❌ Impossible de créer le dossier.
        pause
        exit /b 1
    )
)

echo.
echo  [1/6] Création de la structure de dossiers...
robocopy "%STARTER%\vault-structure" "%VAULT%" /E /NJH /NJS /NP /NFL /NDL >nul
echo   ✅ Structure créée

echo  [2/6] Copie des templates dans 06 - Templates...
robocopy "%STARTER%\templates" "%VAULT%\06 - Templates" /E /NJH /NJS /NP >nul
echo   ✅ 19 templates copiés

echo  [3/6] Copie des scripts dans 07 - Config/scripts...
robocopy "%STARTER%\scripts" "%VAULT%\07 - Config\scripts" /E /NJH /NJS /NP >nul
echo   ✅ 7 scripts copiés

echo  [4/6] Copie du Vault Settings dans 07 - Config...
if not exist "%VAULT%\07 - Config\Vault Settings.md" (
    copy /Y "%STARTER%\Vault Settings.md" "%VAULT%\07 - Config\Vault Settings.md" >nul
)
echo   ✅ Vault Settings copié

echo  [5/6] Copie de la documentation...
if not exist "%VAULT%\07 - Config\Documentation Vault.md" (
    copy /Y "%STARTER%\Documentation Vault.md" "%VAULT%\07 - Config\Documentation Vault.md" >nul
)
echo   ✅ Documentation copiée

echo  [6/6] Création de Home.md...
if not exist "%VAULT%\Home.md" (
    (
        echo ---
        echo tags: [home]
        echo ---
        echo.
        echo # 🏠 Accueil
        echo.
        echo ^> Bienvenue dans ton vault ! Ouvre `07 - Config/Vault Settings.md` pour configurer tes modules.
        echo.
        echo ## ⚡ Pour commencer
        echo.
        echo 1. Installer les plugins ^(voir `07 - Config/Documentation Vault.md`^)
        echo 2. Configurer Templater : Template folder = `06 - Templates`
        echo 3. Configurer Daily Notes : format = `[Daily - ]YYYY-MM-DD`, dossier = `04 - Journal/Daily`, template = `06 - Templates/Daily`
        echo 4. Configurer QuickAdd : Macro folder = `07 - Config/scripts`
        echo 5. Ouvrir `07 - Config/Vault Settings.md` et activer/désactiver les modules
        echo 6. Cliquer sur une date dans le Calendar pour créer ton premier Daily !
    ) > "%VAULT%\Home.md"
)
echo   ✅ Home.md créé

REM ═══ Nettoyage des .gitkeep ═══
echo.
echo  Nettoyage des fichiers .gitkeep...
for /R "%VAULT%" %%f in (.gitkeep) do del "%%f" 2>nul
echo   ✅ Nettoyé

REM ═══ Optionnel : lier le starter pack ═══
echo.
echo  ════════════════════════════════════════════════
echo  Installation terminée !
echo  ════════════════════════════════════════════════
echo.
echo  Ton vault est prêt dans : %VAULT%
echo.
echo  Prochaines étapes :
echo    1. Ouvrir Obsidian → "Open folder as vault" → %VAULT%
echo    2. Installer les plugins (Templater, Dataview, Meta Bind, QuickAdd, etc.)
echo    3. Configurer les plugins (voir Documentation Vault.md)
echo    4. Ouvrir Vault Settings.md et choisir tes modules
echo    5. Adapter git-helpers.js avec tes projets
echo.

set /p "LINK=  Veux-tu lier le Starter Pack pour recevoir les mises à jour ? (o/n) : "
if /i "!LINK!"=="o" (
    if exist "%VAULT%\08 - Starter Kit" (
        rmdir /S /Q "%VAULT%\08 - Starter Kit" 2>nul
    )
    mklink /J "%VAULT%\08 - Starter Kit" "%STARTER%"
    echo.
    echo   ✅ Junction créée : 08 - Starter Kit → %STARTER%
    echo   Pour mettre à jour : lance update-vault.bat depuis le starter pack
)

echo.
pause
