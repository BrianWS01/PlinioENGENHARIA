# 🚀 PASSO A PASSO - O QUE FAZER AGORA

## 📍 Você está aqui: Início

Siga estes passos na ordem:

---

## ✅ PASSO 1: Gerar Hash da Senha do Admin

### 1.1 Abra o terminal na pasta do projeto

```bash
cd C:\Users\Ead\Desktop\plinio
```

### 1.2 Instale o bcrypt (se ainda não tiver)

```bash
npm install bcrypt
```

### 1.3 Execute o gerador de hash

```bash
node gerar-hash-senha.js
```

### 1.4 Digite a senha desejada

Exemplo: `admin123` (ou a senha que você quiser)

### 1.5 Copie o hash gerado

Você verá algo como:
```
'$2b$10$abc123def456...'
```

**⚠️ IMPORTANTE: Copie esse hash inteiro!**

---

## ✅ PASSO 2: Criar Usuário Admin no Banco

### 2.1 Abra o arquivo `criar-admin-inicial.sql`

### 2.2 Encontre esta linha (por volta da linha 50):

```sql
'$2b$10$SUBSTITUA_PELO_HASH_REAL_AQUI',
```

### 2.3 Substitua pelo hash que você copiou no PASSO 1

Exemplo:
```sql
'$2b$10$abc123def456...',  -- O hash que você copiou
```

### 2.4 Execute no MariaDB

**Opção A: Via HeidiSQL/MySQL Workbench**
1. Abra HeidiSQL ou MySQL Workbench
2. Conecte ao seu MariaDB
3. Selecione o banco `usetrafo_db`
4. Abra o arquivo `criar-admin-inicial.sql`
5. Execute o arquivo (F9 ou botão Execute)

**Opção B: Via linha de comando**
```bash
mysql -u usetrafo_user -p usetrafo_db < criar-admin-inicial.sql
```

### 2.5 Verifique se funcionou

Execute no banco:
```sql
SELECT email, nome, is_admin FROM usuarios WHERE is_admin = TRUE;
```

Você deve ver seu usuário admin listado!

---

## ✅ PASSO 3: Configurar Backend Node.js

### 3.1 Instalar Node.js (se ainda não tiver)

- Download: https://nodejs.org/
- Instalar versão LTS (18 ou superior)
- Verificar: `node --version`

### 3.2 Entrar na pasta do backend

```bash
cd C:\Users\Ead\Desktop\plinio\backend
```

### 3.3 Instalar dependências

```bash
npm install
```

Isso vai instalar Express, mysql2, bcrypt, etc. (pode demorar alguns minutos)

---

## ✅ PASSO 4: Configurar Variáveis de Ambiente

### 4.1 Criar arquivo .env

Na pasta `backend/`, crie um arquivo chamado `.env` (sem extensão!)

### 4.2 Copiar conteúdo do exemplo

Abra o arquivo `backend/env-exemplo.txt` e copie o conteúdo.

### 4.3 Colar no .env e configurar

Seu arquivo `.env` deve ficar assim:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=usetrafo_user
DB_PASSWORD=SUA_SENHA_DO_MARIADB_AQUI
DB_NAME=usetrafo_db
DB_CHARSET=utf8mb4

# Gerar JWT_SECRET com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=cole_aqui_o_jwt_secret_gerado
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
NODE_ENV=development
```

### 4.4 Configurar suas credenciais

**Substitua:**
- `DB_PASSWORD=SUA_SENHA_DO_MARIADB_AQUI` → A senha do seu usuário MariaDB
- `DB_USER=usetrafo_user` → Seu usuário do MariaDB (pode ser `root` se preferir)

### 4.5 Gerar JWT_SECRET

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado (uma string longa) e cole no `.env` como `JWT_SECRET`:

```env
JWT_SECRET=aqui_vai_o_resultado_do_comando_acima
```

---

## ✅ PASSO 5: Testar Backend

### 5.1 Iniciar servidor

Na pasta `backend/`, execute:

```bash
npm run dev
```

### 5.2 Verificar mensagens

Você deve ver:

```
✅ Conexão com MariaDB estabelecida!
✅ Servidor iniciado com sucesso!
📡 API rodando em: http://localhost:3000
```

### 5.3 Testar no navegador

Abra: `http://localhost:3000/health`

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 🎉 Pronto!

Se chegou até aqui sem erros, seu backend está funcionando!

---

## 🆘 Problemas Comuns

### ❌ Erro: "Cannot find module 'bcrypt'"

**Solução:**
```bash
cd C:\Users\Ead\Desktop\plinio
npm install bcrypt
```

### ❌ Erro: "Access denied for user"

**Solução:** Verifique `DB_USER` e `DB_PASSWORD` no arquivo `.env`

### ❌ Erro: "Unknown database 'usetrafo_db'"

**Solução:** Execute o schema SQL para criar o banco:
```sql
CREATE DATABASE IF NOT EXISTS usetrafo_db;
USE usetrafo_db;
-- Depois execute o schema-mariadb-completo.sql
```

### ❌ Erro: "JWT_SECRET not defined"

**Solução:** Gere e configure o `JWT_SECRET` no `.env` (PASSO 4.5)

### ❌ Porta 3000 já está em uso

**Solução:** Altere `PORT=3000` para `PORT=3001` no `.env`

---

## 📞 Próximo Passo

Depois que o backend estiver rodando:

- ⏳ Vou criar script para importar os 120 produtos via API
- ⏳ Conectar frontend às APIs
- ⏳ Testar todas as funcionalidades

---

**Comece pelo PASSO 1 e me avise quando chegar no PASSO 5! 🚀**
