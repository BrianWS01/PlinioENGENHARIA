# 🚀 Backend USETRAFO - API REST

Backend Node.js + Express + MariaDB para sistema de e-commerce de transformadores.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MariaDB configurado e rodando
- Banco `usetrafo_db` criado com schema executado

## 🛠️ Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=usetrafo_user
DB_PASSWORD=sua_senha_aqui
DB_NAME=usetrafo_db
JWT_SECRET=sua_chave_secreta_jwt_muito_forte_aqui
```

### 3. Gerar hash da senha do admin

Execute para gerar o hash bcrypt da senha:

```bash
npm install bcrypt
node ../gerar-hash-senha.js
```

Use o hash gerado no arquivo `criar-admin-inicial.sql`.

### 4. Criar usuário admin

Execute o arquivo `criar-admin-inicial.sql` no MariaDB.

### 5. Iniciar servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação (`/api/auth`)

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Fazer logout

### Produtos (`/api/produtos`)

- `GET /api/produtos` - Listar produtos (público)
- `GET /api/produtos/:id` - Detalhes de um produto
- `GET /api/produtos/slug/:slug` - Buscar por slug
- `GET /api/produtos/categorias/lista` - Listar categorias
- `POST /api/produtos` - Criar produto (admin)
- `PUT /api/produtos/:id` - Atualizar produto (admin)
- `DELETE /api/produtos/:id` - Deletar produto (admin)

### Carrinho (`/api/carrinho`)

- `GET /api/carrinho` - Listar itens do carrinho
- `POST /api/carrinho` - Adicionar item ao carrinho
- `PUT /api/carrinho/:itemId` - Atualizar quantidade
- `DELETE /api/carrinho/:itemId` - Remover item
- `DELETE /api/carrinho` - Limpar carrinho

### Orçamentos (`/api/orcamentos`)

- `GET /api/orcamentos` - Listar orçamentos
- `GET /api/orcamentos/:id` - Detalhes de um orçamento
- `POST /api/orcamentos` - Criar orçamento
- `PUT /api/orcamentos/:id/status` - Atualizar status (admin)

## 🔐 Autenticação

Use JWT tokens nas requisições:

```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

## 📝 Exemplo de Uso

### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "senha": "senha123",
    "nome": "João Silva"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "senha": "senha123"
  }'
```

### Listar produtos

```bash
curl http://localhost:3000/api/produtos
```

## 🐛 Troubleshooting

### Erro de conexão com banco

Verifique:
- MariaDB está rodando?
- Credenciais em `.env` estão corretas?
- Banco `usetrafo_db` foi criado?

### Erro "JWT_SECRET not defined"

Defina `JWT_SECRET` no arquivo `.env`.

## 📚 Próximos Passos

1. ✅ Backend criado
2. ⏳ Importar produtos via API
3. ⏳ Conectar frontend às APIs
4. ⏳ Testar todas as funcionalidades
