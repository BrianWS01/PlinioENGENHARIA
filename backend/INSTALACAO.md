# 📦 Instalação do Backend - USETRAFO

## 🎯 Pré-requisitos

1. **Node.js 18+** instalado
   - Download: https://nodejs.org/
   - Verificar: `node --version`

2. **MariaDB** configurado
   - Banco `usetrafo_db` criado
   - Schema executado (`schema-mariadb-completo.sql`)

3. **npm** (vem com Node.js)
   - Verificar: `npm --version`

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
cd backend
npm install
```

Isso instalará:
- `express` - Framework web
- `mysql2` - Cliente MariaDB/MySQL
- `bcrypt` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT
- `dotenv` - Variáveis de ambiente
- `cors` - CORS
- `helmet` - Segurança HTTP
- `express-rate-limit` - Rate limiting
- `joi` - Validação
- `nodemon` - Auto-reload (desenvolvimento)

### 2. Configurar Variáveis de Ambiente

**Opção A: Criar arquivo .env manualmente**

Crie um arquivo `.env` na pasta `backend/` com este conteúdo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=usetrafo_user
DB_PASSWORD=sua_senha_aqui
DB_NAME=usetrafo_db
JWT_SECRET=sua_chave_secreta_jwt_aqui
CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
NODE_ENV=development
```

**Opção B: Copiar arquivo de exemplo**

```bash
cp env-exemplo.txt .env
```

Depois edite o `.env` com suas configurações.

### 3. Gerar JWT Secret

Execute para gerar uma chave secreta forte:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Cole o resultado no `.env` como `JWT_SECRET`.

### 4. Gerar Hash da Senha do Admin

Execute para gerar o hash bcrypt da senha do admin:

```bash
node ../gerar-hash-senha.js
```

Você será solicitado a digitar a senha. Use o hash gerado no arquivo `criar-admin-inicial.sql`.

### 5. Criar Usuário Admin

Abra o arquivo `criar-admin-inicial.sql` e substitua o hash fictício pelo hash real gerado no passo anterior.

Execute no MariaDB:

```sql
-- Via HeidiSQL ou MySQL Workbench
-- Execute o arquivo criar-admin-inicial.sql
```

Ou execute via linha de comando:

```bash
mysql -u usetrafo_user -p usetrafo_db < ../criar-admin-inicial.sql
```

### 6. Testar Conexão

Inicie o servidor:

```bash
npm run dev
```

Se tudo estiver correto, você verá:

```
✅ Conexão com MariaDB estabelecida!
✅ Servidor iniciado com sucesso!
📡 API rodando em: http://localhost:3000
```

### 7. Testar API

Abra no navegador ou use curl:

```bash
# Health check
curl http://localhost:3000/health

# Listar produtos
curl http://localhost:3000/api/produtos
```

## 📋 Checklist

- [ ] Node.js instalado
- [ ] `npm install` executado
- [ ] Arquivo `.env` criado e configurado
- [ ] JWT_SECRET gerado e configurado
- [ ] Hash da senha do admin gerado
- [ ] Usuário admin criado no banco
- [ ] Servidor inicia sem erros
- [ ] Health check retorna sucesso

## 🐛 Problemas Comuns

### Erro: "Cannot find module 'express'"

**Solução:** Execute `npm install` dentro da pasta `backend/`

### Erro: "Access denied for user"

**Solução:** Verifique as credenciais no arquivo `.env` (DB_USER, DB_PASSWORD)

### Erro: "Unknown database 'usetrafo_db'"

**Solução:** Execute o schema SQL para criar o banco:
```sql
CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erro: "JWT_SECRET not defined"

**Solução:** Defina `JWT_SECRET` no arquivo `.env`

### Porta 3000 já está em uso

**Solução:** Altere `PORT` no arquivo `.env` para outra porta (ex: 3001)

## 🎉 Próximo Passo

Após o servidor estar rodando:

1. ⏳ Importar produtos via API (vou criar script)
2. ⏳ Conectar frontend às APIs
3. ⏳ Testar todas as funcionalidades

## 📚 Comandos Úteis

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start

# Ver logs
npm run dev | grep ERROR

# Parar servidor
Ctrl + C
```

## 🔗 Documentação

- [Express.js Docs](https://expressjs.com/)
- [Node.js mysql2](https://github.com/sidorares/node-mysql2)
- [JWT](https://jwt.io/)
