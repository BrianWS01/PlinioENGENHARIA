# 🔍 Diagnóstico de Conexão - MariaDB

## ❌ Problema Identificado

**Erro:** `ECONNREFUSED`

**Causa:** O servidor MariaDB não está rodando ou não está acessível na porta 3306.

---

## ✅ Soluções

### Opção 1: Iniciar o Serviço MariaDB

#### Windows (via Serviços)

1. Pressione `Win + R`
2. Digite `services.msc` e pressione Enter
3. Procure por "MariaDB" ou "MySQL"
4. Clique com botão direito → "Iniciar"

#### Windows (via PowerShell como Administrador)

```powershell
# Ver serviços
Get-Service -Name "*mariadb*","*mysql*"

# Iniciar serviço (substitua pelo nome real)
Start-Service -Name "MariaDB"  # ou "MySQL"
```

#### Windows (via Linha de Comando)

```cmd
net start MariaDB
# ou
net start MySQL
```

---

### Opção 2: Verificar se MariaDB está Instalado

Se o serviço não existir, você precisa instalar o MariaDB primeiro.

Siga o guia: `SETUP-MARIADB.md`

---

### Opção 3: Verificar Porta e Configuração

Se o MariaDB estiver rodando em outra porta, atualize o `.env`:

```env
DB_PORT=3307  # ou a porta que você configurou
```

---

### Opção 4: Verificar Firewall

O firewall pode estar bloqueando a porta 3306:

```powershell
# Verificar regras de firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*MariaDB*" -or $_.DisplayName -like "*MySQL*"}
```

---

## 🧪 Teste Novamente

Depois de iniciar o MariaDB, execute:

```bash
node test-connection.js
```

---

## 📞 Próximos Passos

1. ✅ Iniciar MariaDB
2. ✅ Testar conexão novamente
3. ✅ Continuar com criação do usuário admin
4. ✅ Subir o backend
