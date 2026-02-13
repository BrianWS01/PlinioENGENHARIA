# Guia Manual - Configurar Banco via HeidiSQL

## 📋 Passos para Usar HeidiSQL

### 1. Abra o HeidiSQL

- Se não tiver, baixe em: https://www.heidisql.com/download.php
- Instale e abra

### 2. Conecte ao MariaDB

- Clique em "New" ou "Novo"
- Configure:
  - **Host name:** localhost
  - **User:** root
  - **Password:** (use sua senha do root)
  - **Port:** 3306
  - Clique em "Open"

> Se não souber a senha do root, você pode:
> - Tentar "root" sem senha
> - Tentar a senha que você usou na instalação do MariaDB
> - Usar a opção "Esqueci minha senha" do MariaDB

### 3. Após Conectar

Uma vez conectado, você verá a lista de bancos no lado esquerdo.

### 4. Executar os Comandos SQL

Cole este script INTEIRO na seção SQL do HeidiSQL e execute (F9):

```sql
-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Criar usuário específico
DROP USER IF EXISTS 'usetrafo_user'@'localhost';
CREATE USER 'usetrafo_user'@'localhost' IDENTIFIED BY 'usetrafo_123_secure';

-- 3. Dar permissões
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. Usar o banco
USE usetrafo_db;

-- 5. Criar tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    telefone VARCHAR(20),
    cpf_cnpj VARCHAR(20),
    endereco TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    email_verificado BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin)
);

-- 6. Criar tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    preco_desconto DECIMAL(10, 2),
    quantidade_estoque INT DEFAULT 0,
    imagem_url VARCHAR(500),
    especificacoes JSON,
    slug VARCHAR(255) UNIQUE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo),
    INDEX idx_slug (slug)
);

-- 7. Criar tabela: carrinho
CREATE TABLE IF NOT EXISTS carrinho (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    produto_id CHAR(36) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    UNIQUE KEY unique_carrinho (usuario_id, produto_id)
);

-- 8. Criar tabela: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    numero_pedido VARCHAR(20) UNIQUE,
    status VARCHAR(50) DEFAULT 'pendente',
    valor_total DECIMAL(10, 2),
    valor_desconto DECIMAL(10, 2) DEFAULT 0,
    endereco_entrega TEXT,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status),
    INDEX idx_numero_pedido (numero_pedido)
);

-- 9. Criar tabela: itens_pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pedido_id CHAR(36) NOT NULL,
    produto_id CHAR(36) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_pedido (pedido_id),
    INDEX idx_produto (produto_id)
);

-- 10. Criar tabela: orcamentos
CREATE TABLE IF NOT EXISTS orcamentos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36),
    numero_orcamento VARCHAR(20) UNIQUE,
    status VARCHAR(50) DEFAULT 'pendente',
    valor_total DECIMAL(10, 2),
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    validade_ate DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_numero_orcamento (numero_orcamento)
);

-- 11. Criar tabela: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    permissoes JSON,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_ativo (ativo)
);

-- 12. Criar tabela: logs
CREATE TABLE IF NOT EXISTS logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36),
    tipo VARCHAR(100),
    descricao TEXT,
    dados JSON,
    ip_origem VARCHAR(45),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_tipo (tipo),
    INDEX idx_usuario (usuario_id),
    INDEX idx_criado_em (criado_em)
);

-- Pronto!
```

### 5. Pressione F9 ou Clique em "Execute"

Todos os comandos serão executados e você verá a confirmação.

### 6. Verificar Resultado

No painel esquerdo, expanda:
- `usetrafo_db` → você deve ver as 8 tabelas criadas

---

## ✅ Depois de Pronto

Vá para o terminal/PowerShell e execute:

```bash
cd "c:\Users\brian\OneDrive\Desktop\plinio\PlinioENGENHARIA\backend"
npm run dev
```

Se aparecer:
```
✅ Servidor iniciado com sucesso!
📡 API rodando em: http://localhost:3000
```

Tudo está funcionando! 🎉

---

## 🆘 Problemas?

Se receber erro no SQL:
1. Verifique se está no banco certo (usetrafo_db)
2. Copie e cole **exatamente** conforme está acima
3. Se tiver erro de "já existe", é normal (IF NOT EXISTS)

Qualquer dúvida, me avise!
