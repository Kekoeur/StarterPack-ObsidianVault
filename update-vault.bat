@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║  🔄 Obsidian Vault — Mise à jour Starter Pack   ║
echo  ╚══════════════════════════════════════════════════╝
echo.

REM ═══ Détection du dossier du starter pack ═══
set "STARTER=%~dp0"
if "%STARTER:~-1%"=="\" set "STARTER=%STARTER:~0,-1%"

REM ═══ Demander le chemin du vault ═══
set /p "VAULT=  Chemin de ton vault Obsidian (ex: C:\Users\Moi\Documents\Mon Vault) : "
if "%VAULT%"=="" (
    echo  ❌ Chemin vide. Annulé.
    pause
    exit /b 1
)
if not exist "%VAULT%\06 - Templates" (
    echo  ❌ Ce dossier ne semble pas être un vault valide (pas de 06 - Templates).
    pause
    exit /b 1
)

echo.
echo  Starter Pack : %STARTER%
echo  Vault        : %VAULT%
echo.

REM ═══ Étape 1 : Pull du starter pack ═══
echo  [1/6] Pull des dernières mises à jour du Starter Pack...
cd /d "%STARTER%"
git pull
if errorlevel 1 (
    echo  ⚠️  Git pull a échoué. Vérifiez votre connexion ou le repo.
    echo  On continue avec la version locale...
)
echo.

REM ═══ Étape 2 : Sync des templates ═══
echo  [2/6] Mise à jour des templates (06 - Templates)...
set "TEMPLATES_ADDED=0"
set "TEMPLATES_UPDATED=0"
for %%f in ("%STARTER%\templates\*.md") do (
    set "TNAME=%%~nxf"
    if not exist "%VAULT%\06 - Templates\!TNAME!" (
        copy /Y "%%f" "%VAULT%\06 - Templates\!TNAME!" >nul
        echo   ➕ Nouveau template : !TNAME!
        set /a TEMPLATES_ADDED+=1
    ) else (
        fc /B "%%f" "%VAULT%\06 - Templates\!TNAME!" >nul 2>&1
        if errorlevel 1 (
            copy /Y "%%f" "%VAULT%\06 - Templates\!TNAME!" >nul
            echo   🔄 Mis à jour : !TNAME!
            set /a TEMPLATES_UPDATED+=1
        )
    )
)
echo   ✅ Templates : !TEMPLATES_ADDED! ajoutés, !TEMPLATES_UPDATED! mis à jour
echo.

REM ═══ Étape 3 : Sync des scripts ═══
echo  [3/6] Mise à jour des scripts (07 - Config/scripts)...
set "SCRIPTS_ADDED=0"
set "SCRIPTS_UPDATED=0"
for %%f in ("%STARTER%\scripts\*.js") do (
    set "SNAME=%%~nxf"
    if not exist "%VAULT%\07 - Config\scripts\!SNAME!" (
        copy /Y "%%f" "%VAULT%\07 - Config\scripts\!SNAME!" >nul
        echo   ➕ Nouveau script : !SNAME!
        set /a SCRIPTS_ADDED+=1
    ) else (
        fc /B "%%f" "%VAULT%\07 - Config\scripts\!SNAME!" >nul 2>&1
        if errorlevel 1 (
            copy /Y "%%f" "%VAULT%\07 - Config\scripts\!SNAME!" >nul
            echo   🔄 Mis à jour : !SNAME!
            set /a SCRIPTS_UPDATED+=1
        )
    )
)
echo   ✅ Scripts : !SCRIPTS_ADDED! ajoutés, !SCRIPTS_UPDATED! mis à jour
echo.

REM ═══ Étape 4 : Sync de la structure de dossiers ═══
echo  [4/6] Vérification de la structure de dossiers...
set "DIRS_CREATED=0"
for /R "%STARTER%\vault-structure" /D %%d in (*) do (
    set "RELPATH=%%d"
    set "RELPATH=!RELPATH:%STARTER%\vault-structure\=!"
    if not exist "%VAULT%\!RELPATH!" (
        mkdir "%VAULT%\!RELPATH!"
        echo   ➕ Nouveau dossier : !RELPATH!
        set /a DIRS_CREATED+=1
    )
)
echo   ✅ Dossiers : !DIRS_CREATED! créés
echo.

REM ═══ Étape 5 : Sync du Vault Settings (seulement si absent) ═══
echo  [5/6] Vérification du Vault Settings...
if not exist "%VAULT%\07 - Config\Vault Settings.md" (
    copy /Y "%STARTER%\Vault Settings.md" "%VAULT%\07 - Config\Vault Settings.md" >nul
    echo   ➕ Vault Settings créé (nouveau)
) else (
    echo   ⏭️  Vault Settings existe déjà (non écrasé — tes toggles sont préservés)
)
echo.

REM ═══ Étape 6 : Sync de la documentation ═══
echo  [6/6] Mise à jour de la documentation...
copy /Y "%STARTER%\Documentation Vault.md" "%VAULT%\07 - Config\Documentation Vault.md" >nul
echo   ✅ Documentation mise à jour
echo.

REM ═══ Résumé ═══
echo  ════════════════════════════════════════════════
echo  Mise à jour terminée !
echo  ════════════════════════════════════════════════
echo.
echo  Templates : !TEMPLATES_ADDED! ajoutés, !TEMPLATES_UPDATED! mis à jour
echo  Scripts   : !SCRIPTS_ADDED! ajoutés, !SCRIPTS_UPDATED! mis à jour
echo  Dossiers  : !DIRS_CREATED! créés
echo.
echo  ⚠️  Note : le Vault Settings n'est JAMAIS écrasé pour préserver tes toggles.
echo  Si de nouveaux modules ont été ajoutés, ajoute-les manuellement dans le frontmatter.
echo.

pause
