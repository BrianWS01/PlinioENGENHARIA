@echo off
REM Script para resetar senha do root do MariaDB
REM Este arquivo executa como Administrador

setlocal enabledelayedexpansion

REM Verificar se está executando como Admin
net session >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Este script DEVE ser executado como Administrador!
    echo.
    echo Clique com botão direito e escolha "Executar como administrador"
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════╗
echo ║   RESETAR SENHA ROOT - MARIADB WINDOWS    ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Executar PowerShell com o script
powershell -ExecutionPolicy Bypass -File "%~dp0resetar-senha-root.ps1"

pause
