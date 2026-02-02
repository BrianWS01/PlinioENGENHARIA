-- =====================================================
-- SCHEMA COMPLETO - BANCO DE DADOS USETRAFO
-- MariaDB Database Schema
-- =====================================================
-- Descrição: Estrutura completa do banco de dados
--            para sistema de e-commerce de transformadores
-- Versão: 1.0
-- Data: Janeiro 2026
-- Compatível: MariaDB 10.5+
-- =====================================================

-- Criar banco de dados (execute separadamente se necessário)
-- CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE usetrafo_db;

-- =====================================================
-- 1. TABELA: usuarios
-- =====================================================
-- Armazena dados de autenticação e informações básicas dos usuários

CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Autenticação
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt da senha',
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacao VARCHAR(255) NULL,
    token_verificacao_expiracao DATETIME NULL,
    
    -- Recuperação de senha
    token_reset_senha VARCHAR(255) NULL,
    token_reset_expiracao DATETIME NULL,
    
    -- Dados pessoais básicos
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    cpf_cnpj VARCHAR(18) NULL COMMENT 'CPF ou CNPJ',
    empresa VARCHAR(255) NULL,
    
    -- Perfil
    is_admin BOOLEAN DEFAULT FALSE,
    is_ativo BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_is_ativo (is_ativo),
    INDEX idx_usuarios_token_reset (token_reset_senha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABELA: produtos
-- =====================================================
-- Catálogo completo de transformadores e equipamentos

CREATE TABLE IF NOT EXISTS produtos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Informações Básicas
    nome TEXT NOT NULL,
    descricao TEXT NULL,
    descricao_completa LONGTEXT NULL,
    subtitulo VARCHAR(500) NULL,
    
    -- Preço
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    preco_antigo DECIMAL(10, 2) NULL COMMENT 'Para mostrar desconto',
    
    -- Imagens
    imagem_principal TEXT NULL COMMENT 'URL ou caminho da imagem principal',
    imagens JSON NULL COMMENT 'Array de URLs: ["url1", "url2"]',
    
    -- Categorização
    categoria VARCHAR(100) NOT NULL COMMENT 'transformadores-oleo, autotransformadores, transformadores-isoladores',
    subcategoria VARCHAR(100) NULL,
    slug VARCHAR(255) UNIQUE COMMENT 'URL amigável: transformador-oleo-45kva-15kv',
    
    -- Especificações Técnicas (JSON flexível)
    especificacoes JSON NULL COMMENT 'JSON: {"potencia": "45 kVA", "classe": "15 kV"}',
    
    -- Estoque
    estoque INT DEFAULT 0,
    estoque_minimo INT DEFAULT 0,
    disponivel BOOLEAN DEFAULT TRUE,
    
    -- Status e Controle
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    novo BOOLEAN DEFAULT FALSE,
    
    -- Tags para busca (JSON array)
    tags JSON NULL COMMENT 'Array de tags: ["transformador", "oleo", "45kVA"]',
    
    -- Links Externos
    mercado_livre_url TEXT NULL,
    
    -- Metadados
    visualizacoes INT DEFAULT 0,
    vendas INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_produtos_categoria (categoria),
    INDEX idx_produtos_ativo (ativo),
    INDEX idx_produtos_destaque (destaque),
    INDEX idx_produtos_slug (slug),
    INDEX idx_produtos_preco (preco),
    FULLTEXT INDEX idx_produtos_nome_search (nome, descricao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABELA: carrinho
-- =====================================================
-- Carrinho de compras dos usuários

CREATE TABLE IF NOT EXISTS carrinho (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Relacionamentos
    usuario_id CHAR(36) NOT NULL,
    produto_id CHAR(36) NOT NULL,
    
    -- Dados do item
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL COMMENT 'Preço no momento da adição',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_quantidade_positiva CHECK (quantidade > 0),
    CONSTRAINT uq_carrinho_usuario_produto UNIQUE (usuario_id, produto_id),
    
    -- Foreign Keys
    CONSTRAINT fk_carrinho_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_carrinho_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    
    INDEX idx_carrinho_usuario_id (usuario_id),
    INDEX idx_carrinho_produto_id (produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABELA: orcamentos
-- =====================================================
-- Orçamentos gerados pelos clientes

CREATE TABLE IF NOT EXISTS orcamentos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Identificação
    numero_orcamento VARCHAR(50) UNIQUE NOT NULL COMMENT 'Ex: CP 02011, CP 02012',
    
    -- Relacionamento (nullable para orçamentos não logados)
    usuario_id CHAR(36) NULL,
    
    -- Dados do Cliente
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefone VARCHAR(20) NULL,
    cliente_cnpj VARCHAR(18) NULL COMMENT 'CNPJ do cliente',
    cliente_endereco JSON NULL COMMENT 'JSON: {rua, numero, bairro, cidade, uf, cep}',
    
    -- Condições Comerciais
    condicoes_comerciais JSON NULL COMMENT 'JSON: {prazo_entrega, forma_pagamento, validade, observacoes}',
    
    -- Valores
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    frete DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Impostos
    icms DECIMAL(10, 2) DEFAULT 0.00,
    icms_st DECIMAL(10, 2) DEFAULT 0.00,
    pis DECIMAL(10, 2) DEFAULT 0.00,
    ipi DECIMAL(10, 2) DEFAULT 0.00,
    cofins DECIMAL(10, 2) DEFAULT 0.00,
    ibpt DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Total
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Status
    status ENUM('pendente', 'enviado', 'aceito', 'recusado', 'expirado') DEFAULT 'pendente',
    
    -- Arquivos
    pdf_url TEXT NULL COMMENT 'URL do PDF gerado',
    pdf_path TEXT NULL COMMENT 'Caminho do arquivo no servidor',
    
    -- Observações
    observacoes TEXT NULL,
    
    -- Datas
    validade_ate DATE NULL COMMENT 'Data de validade do orçamento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_orcamentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_orcamentos_usuario_id (usuario_id),
    INDEX idx_orcamentos_status (status),
    INDEX idx_orcamentos_numero (numero_orcamento),
    INDEX idx_orcamentos_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABELA: orcamento_itens
-- =====================================================
-- Itens de cada orçamento

CREATE TABLE IF NOT EXISTS orcamento_itens (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Relacionamento
    orcamento_id CHAR(36) NOT NULL,
    produto_id CHAR(36) NULL COMMENT 'Nullable para itens customizados',
    
    -- Dados do Item
    nome_produto VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL COMMENT 'quantidade * preco_unitario',
    
    -- Especificações (para itens customizados)
    especificacoes JSON NULL,
    
    -- Ordem de exibição
    ordem INT DEFAULT 0,
    
    -- Constraints
    CONSTRAINT chk_quantidade_positiva_item CHECK (quantidade > 0),
    
    -- Foreign Keys
    CONSTRAINT fk_orcamento_itens_orcamento FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE CASCADE,
    CONSTRAINT fk_orcamento_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL,
    
    INDEX idx_orcamento_itens_orcamento_id (orcamento_id),
    INDEX idx_orcamento_itens_produto_id (produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABELA: contatos
-- =====================================================
-- Mensagens do formulário de contato

CREATE TABLE IF NOT EXISTS contatos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Dados do Contato
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    cnpj VARCHAR(18) NULL COMMENT 'CNPJ se fornecido',
    assunto VARCHAR(255) DEFAULT 'Contato',
    mensagem TEXT NOT NULL,
    
    -- Status
    lido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    resposta TEXT NULL COMMENT 'Resposta do admin',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_contatos_lido (lido),
    INDEX idx_contatos_created_at (created_at DESC),
    INDEX idx_contatos_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABELA: calculos_historico (Opcional)
-- =====================================================
-- Histórico de cálculos da calculadora

CREATE TABLE IF NOT EXISTS calculos_historico (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Relacionamento (nullable para cálculos não logados)
    usuario_id CHAR(36) NULL,
    
    -- Tipo de cálculo
    tipo_calculo VARCHAR(50) NOT NULL COMMENT 'hp-kva, kva-corrente, corrente-kva, kw-kva, watts-kva',
    
    -- Dados de entrada e resultado
    dados_entrada JSON NOT NULL COMMENT 'Valores de entrada',
    resultado JSON NOT NULL COMMENT 'Valores calculados',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_calculos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_calculos_usuario_id (usuario_id),
    INDEX idx_calculos_tipo (tipo_calculo),
    INDEX idx_calculos_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TABELA: sessoes (Opcional - para gerenciar sessões)
-- =====================================================
-- Sessões de usuários (JWT refresh tokens)

CREATE TABLE IF NOT EXISTS sessoes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Relacionamento
    usuario_id CHAR(36) NOT NULL,
    
    -- Token
    token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500) UNIQUE,
    
    -- Informações
    ip_address VARCHAR(45) NULL COMMENT 'IPv4 ou IPv6',
    user_agent TEXT NULL,
    
    -- Expiração
    expira_em DATETIME NOT NULL,
    
    -- Status
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_sessoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_sessoes_usuario_id (usuario_id),
    INDEX idx_sessoes_token (token),
    INDEX idx_sessoes_refresh_token (refresh_token),
    INDEX idx_sessoes_ativo (ativo),
    INDEX idx_sessoes_expira_em (expira_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. FUNÇÕES ÚTEIS (Stored Procedures/Functions)
-- =====================================================

-- Função: Gerar número de orçamento automático
DELIMITER //

CREATE FUNCTION IF NOT EXISTS gerar_numero_orcamento() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE novo_numero VARCHAR(50);
    DECLARE ultimo_numero INT DEFAULT 0;
    DECLARE numero_extraido VARCHAR(10);
    
    -- Buscar último número de orçamento
    SELECT numero_orcamento INTO numero_extraido
    FROM orcamentos
    WHERE numero_orcamento REGEXP '^CP [0-9]+$'
    ORDER BY CAST(SUBSTRING(numero_orcamento FROM 4) AS UNSIGNED) DESC
    LIMIT 1;
    
    -- Extrair número se encontrado
    IF numero_extraido IS NOT NULL THEN
        SET ultimo_numero = CAST(SUBSTRING(numero_extraido FROM 4) AS UNSIGNED);
    END IF;
    
    -- Gerar novo número (próximo sequencial)
    SET novo_numero = CONCAT('CP ', LPAD((ultimo_numero + 1), 5, '0'));
    
    RETURN novo_numero;
END //

DELIMITER ;

-- Função: Calcular total do carrinho de um usuário
DELIMITER //

CREATE FUNCTION IF NOT EXISTS calcular_total_carrinho(p_usuario_id CHAR(36)) 
RETURNS DECIMAL(10, 2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10, 2) DEFAULT 0.00;
    
    SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
    INTO total
    FROM carrinho
    WHERE usuario_id = p_usuario_id;
    
    RETURN total;
END //

DELIMITER ;

-- Função: Verificar se produto pode ser adicionado ao carrinho
DELIMITER //

CREATE FUNCTION IF NOT EXISTS pode_adicionar_carrinho(p_produto_id CHAR(36), p_quantidade INT) 
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE produto_disponivel BOOLEAN;
    DECLARE estoque_disponivel INT;
    
    SELECT ativo, estoque
    INTO produto_disponivel, estoque_disponivel
    FROM produtos
    WHERE id = p_produto_id;
    
    RETURN (produto_disponivel = TRUE AND estoque_disponivel >= p_quantidade);
END //

DELIMITER ;

-- =====================================================
-- 10. VIEWS ÚTEIS
-- =====================================================

-- View: Produtos com informações completas para listagem
CREATE OR REPLACE VIEW vw_produtos_ativos AS
SELECT 
    p.*,
    CASE 
        WHEN p.preco_antigo IS NOT NULL AND p.preco_antigo > p.preco 
        THEN ROUND(((p.preco_antigo - p.preco) / p.preco_antigo) * 100, 0)
        ELSE NULL
    END as percentual_desconto,
    CASE 
        WHEN p.estoque <= 0 THEN 'esgotado'
        WHEN p.estoque <= p.estoque_minimo THEN 'estoque_baixo'
        ELSE 'disponivel'
    END as status_estoque
FROM produtos p
WHERE p.ativo = TRUE;

-- View: Carrinho com informações do produto
CREATE OR REPLACE VIEW vw_carrinho_detalhado AS
SELECT 
    c.*,
    p.nome as produto_nome,
    p.imagem_principal as produto_imagem,
    p.estoque as produto_estoque,
    p.ativo as produto_ativo,
    (c.quantidade * c.preco_unitario) as subtotal_item
FROM carrinho c
JOIN produtos p ON c.produto_id = p.id;

-- View: Orçamentos com informações do cliente
CREATE OR REPLACE VIEW vw_orcamentos_detalhados AS
SELECT 
    o.*,
    u.nome as usuario_nome,
    u.email as usuario_email,
    (SELECT COUNT(*) FROM orcamento_itens WHERE orcamento_id = o.id) as total_itens
FROM orcamentos o
LEFT JOIN usuarios u ON o.usuario_id = u.id;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Mensagem de sucesso
SELECT 'Schema MariaDB criado com sucesso!' as mensagem;
SELECT 'Tabelas criadas: usuarios, produtos, carrinho, orcamentos, orcamento_itens, contatos, calculos_historico, sessoes' as tabelas;
