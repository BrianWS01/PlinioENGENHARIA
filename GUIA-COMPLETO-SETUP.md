# 📚 Guia Completo de Setup - USETRAFO

## ✅ Status Atual

- ✅ Banco de dados criado (`usetrafo_db` no MariaDB)
- ✅ Schema executado (8 tabelas criadas)
- ✅ Estrutura do backend criada
- ⏳ **PRÓXIMO: Configurar e iniciar backend**

---

## 🎯 Ordem Correta de Execução

### 1️⃣ Criar Usuário Admin Inicial

#### Passo 1: Gerar Hash da Senha

```bash
# No diretório raiz do projeto
node gerar-hash-senha.js
```

Digite a senha desejada (ex: `admin123`) e copie o hash gerado.

#### Passo 2: Editar criar-admin-inicial.sql

Abra `criar-admin-inicial.sql` e substitua:

```sql
'$2b$10$SUBSTITUA_PELO_HASH_REAL_AQUI'
```

Pelo hash gerado no passo anterior.

#### Passo 3: Executar no MariaDB

Execute o arquivo `criar-admin-inicial.sql` no seu MariaDB (HeidiSQL ou MySQL Workbench).

---

### 2️⃣ Configurar Backend Node.js

#### Passo 1: Instalar Node.js

Se ainda não tiver:
- Download: https://nodejs.org/
- Instalar versão LTS (18 ou superior)

#### Passo 2: Instalar Dependências

```bash
cd backend
npm install
```

Isso vai instalar todas as dependências (Express, mysql2, bcrypt, etc.)

#### Passo 3: Configurar .env

Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=usetrafo_user
DB_PASSWORD=sua_senha_do_mariadb_aqui
DB_NAME=usetrafo_db
DB_CHARSET=utf8mb4

# Gerar JWT_SECRET com este comando:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=cole_aqui_o_jwt_secret_gerado
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
NODE_ENV=development
```

**Gerar JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Cole o resultado no `.env` como `JWT_SECRET`.

#### Passo 4: Testar Conexão

Inicie o servidor:

```bash
npm run dev
```

Você deve ver:

```
✅ Conexão com MariaDB estabelecida!
✅ Servidor iniciado com sucesso!
📡 API rodando em: http://localhost:3000
```

Se aparecer erro de conexão, verifique:
- MariaDB está rodando?
- Credenciais em `.env` estão corretas?
- Banco `usetrafo_db` existe?

#### Passo 5: Testar API

Abra no navegador:

```
http://localhost:3000/health
```

Deve retornar:

```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

---

### 3️⃣ Testar Autenticação

#### Testar Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123",
    "nome": "Teste Usuário"
  }'
```

#### Testar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123"
  }'
```

Salve o token retornado para usar nas próximas requisições.

---

### 4️⃣ Próximos Passos (Depois)

- ⏳ Importar produtos via API (vou criar script)
- ⏳ Conectar frontend às APIs
- ⏳ Testar todas as funcionalidades

---

## 📋 Checklist Final

- [ ] Hash da senha do admin gerado
- [ ] Usuário admin criado no banco
- [ ] Node.js instalado
- [ ] `npm install` executado
- [ ] Arquivo `.env` criado e configurado
- [ ] JWT_SECRET gerado e configurado
- [ ] Servidor inicia sem erros (`npm run dev`)
- [ ] Health check retorna sucesso
- [ ] Registro de usuário funciona
- [ ] Login funciona

---

## 🎉 Quando Tudo Estiver Funcionando

Você terá:

✅ Backend rodando em `http://localhost:3000`
✅ API REST completa
✅ Autenticação JWT funcionando
✅ Conexão com MariaDB estabelecida
✅ Pronto para importar produtos

---

## 🆘 Problemas?

Consulte:
- `backend/INSTALACAO.md` - Guia detalhado de instalação
- `backend/README.md` - Documentação da API
- `SETUP-MARIADB.md` - Configuração do banco

---

**Pronto para começar! Siga a ordem acima e me avise quando chegar no passo 4! 🚀**
