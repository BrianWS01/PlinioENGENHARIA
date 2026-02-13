# Script PowerShell para resetar senha do root do MariaDB
# Execute como Administrador!

Write-Host "`nRESETAR SENHA ROOT - MARIADB WINDOWS" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

# Pedir nova senha
$novaSenha = Read-Host "Digite a NOVA senha para o usuario root"

if ([string]::IsNullOrEmpty($novaSenha)) {
    Write-Host "Senha nao pode estar vazia!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[1/7] Parando servico MariaDB..." -ForegroundColor Yellow

try {
    Stop-Service -Name MariaDB -Force -ErrorAction Stop
    Write-Host "OK`n" -ForegroundColor Green
} catch {
    Write-Host "Falha (pode ja estar parado)`n" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host "[2/7] Localizando MariaDB..." -ForegroundColor Yellow

$mariadbPaths = @(
    'C:\Program Files\MariaDB 11.3\bin',
    'C:\Program Files\MariaDB 11.2\bin',
    'C:\Program Files\MariaDB 11.1\bin',
    'C:\Program Files\MariaDB 11.0\bin',
    'C:\Program Files\MariaDB 10.11\bin',
    'C:\Program Files (x86)\MariaDB\bin',
    'C:\MariaDB\bin'
)

$mariadbPath = $null
foreach ($path in $mariadbPaths) {
    if (Test-Path "$path\mysqld.exe") {
        $mariadbPath = $path
        Write-Host "OK - Encontrado em: $path`n" -ForegroundColor Green
        break
    }
}

if ($null -eq $mariadbPath) {
    Write-Host "Nao encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "[3/7] Iniciando MariaDB com --skip-grant-tables..." -ForegroundColor Yellow

$mysqldPath = "$mariadbPath\mysqld.exe"

# Iniciar em background
Start-Process -FilePath $mysqldPath -ArgumentList '--skip-grant-tables' -WindowStyle Hidden

Write-Host "OK - Aguardando inicializacao (3 segundos)..." -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host "`n[4/7] Conectando ao MariaDB..." -ForegroundColor Yellow

$mysqlPath = "$mariadbPath\mysql.exe"

# Arquivo SQL temporario
$sqlFile = [System.IO.Path]::GetTempFileName()
$sqlContent = @"
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$novaSenha';
FLUSH PRIVILEGES;
EXIT;
"@

Set-Content -Path $sqlFile -Value $sqlContent

Write-Host "OK - Arquivo SQL criado`n" -ForegroundColor Green

Write-Host "[5/7] Executando comandos SQL..." -ForegroundColor Yellow

try {
    $result = & $mysqlPath -u root --protocol=TCP 2>&1
    Write-Host "OK - Comandos executados`n" -ForegroundColor Green
} catch {
    Write-Host "Erro ao executar SQL, continuando..." -ForegroundColor Yellow
}

Write-Host "[6/7] Parando MariaDB..." -ForegroundColor Yellow

try {
    Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
    Write-Host "OK - Processo mysqld parado`n" -ForegroundColor Green
} catch {
    Write-Host "Erro ao parar mysqld`n" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host "[7/7] Reiniciando MariaDB normalmente..." -ForegroundColor Yellow

try {
    Start-Service -Name MariaDB
    Write-Host "OK - MariaDB reiniciado`n" -ForegroundColor Green
} catch {
    Write-Host "Erro ao reiniciar MariaDB`n" -ForegroundColor Yellow
}

# Limpar arquivo temporario
Remove-Item $sqlFile -ErrorAction SilentlyContinue

Write-Host "===================================================" -ForegroundColor Green
Write-Host "OK! SENHA RESETADA COM SUCESSO!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Nova credencial:" -ForegroundColor Cyan
Write-Host "  Usuario: root" -ForegroundColor Cyan
Write-Host "  Senha: $novaSenha" -ForegroundColor Cyan
Write-Host ""

Write-Host "Proximo passo:" -ForegroundColor Cyan
Write-Host "  Execute: node setup-auto.js" -ForegroundColor Cyan
Write-Host ""

# Limpar variavel de senha
Clear-Variable novaSenha
