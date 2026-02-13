# Script PowerShell para configurar MariaDB
# Execute como Administrador

# Tentar múltiplos caminhos possíveis para o mysql.exe
$possiblePaths = @(
    "C:\Program Files\MariaDB 11.3\bin\mysql.exe",
    "C:\Program Files\MariaDB 11.2\bin\mysql.exe",
    "C:\Program Files\MariaDB 11.1\bin\mysql.exe",
    "C:\Program Files\MariaDB 11.0\bin\mysql.exe",
    "C:\Program Files\MariaDB 10.11\bin\mysql.exe",
    "C:\Program Files (x86)\MariaDB\bin\mysql.exe",
    "C:\MariaDB\bin\mysql.exe"
)

$mysqlPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        Write-Host "✅ Encontrado: $mysqlPath" -ForegroundColor Green
        break
    }
}

if ($null -eq $mysqlPath) {
    Write-Host "❌ mysql.exe não encontrado em nenhum dos caminhos padrão" -ForegroundColor Red
    Write-Host "Caminhos verificados:"
    $possiblePaths | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

# Arquivo SQL a executar
$sqlFile = ".\criar-usuario-mariadb.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Arquivo $sqlFile não encontrado!" -ForegroundColor Red
    exit 1
}

# Executar o SQL
Write-Host "Executando script SQL..." -ForegroundColor Cyan
Write-Host "Você será solicitado a digitar a senha do usuário root do MariaDB"

& $mysqlPath -u root -p < $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script executado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuração:"
    Write-Host "  Usuário: usetrafo_user"
    Write-Host "  Senha: usetrafo_123_secure"
    Write-Host "  Banco: usetrafo_db"
    Write-Host "  Host: localhost"
} else {
    Write-Host "❌ Erro ao executar script SQL" -ForegroundColor Red
    exit 1
}
