-- ==============================================
-- SCRIPT COMPLETO DE SETUP USETRAFO
-- ==============================================

-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Usar o banco
USE usetrafo_db;

-- 3. Criar tabelas (importar schema)
-- Tabela: usuarios
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

-- Tabela: produtos
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

-- Tabela: carrinho
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

-- Tabela: pedidos
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

-- Tabela: itens_pedido
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

-- Tabela: orcamentos
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

-- Tabela: admin_users
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

-- Tabela: logs
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

-- Fim do schema
