-- =====================================================
-- SCHEMA SUPABASE - USETRAFO
-- PostgreSQL Database Schema
-- =====================================================
-- Descrição: Estrutura completa do banco de dados
--            para sistema de e-commerce de transformadores
-- Versão: 1.0
-- Data: Janeiro 2026
-- Compatível: PostgreSQL (Supabase)
-- =====================================================

-- =====================================================
-- 1. TABELA: produtos
-- =====================================================
-- Catálogo completo de transformadores e equipamentos

CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Informações Básicas
    nome TEXT NOT NULL,
    descricao TEXT NULL,
    descricao_completa TEXT NULL,
    subtitulo VARCHAR(500) NULL,

    -- Preço
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    preco_antigo DECIMAL(10, 2) NULL,

    -- Imagens
    imagem_principal TEXT NULL,
    imagens JSONB NULL,

    -- Categorização
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100) NULL,
    slug VARCHAR(255) UNIQUE,

    -- Especificações Técnicas
    especificacoes JSONB NULL,

    -- Estoque
    estoque INT DEFAULT 0,
    estoque_minimo INT DEFAULT 0,
    disponivel BOOLEAN DEFAULT TRUE,

    -- Status e Controle
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    novo BOOLEAN DEFAULT FALSE,

    -- Tags para busca
    tags TEXT[] NULL,

    -- Links Externos
    mercado_livre_url TEXT NULL,

    -- Metadados
    visualizacoes INT DEFAULT 0,
    vendas INT DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA: carrinho
-- =====================================================
-- Carrinho de compras dos usuários

CREATE TABLE IF NOT EXISTS carrinho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamentos
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,

    -- Dados do item
    quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, produto_id)
);

-- =====================================================
-- 3. TABELA: orcamentos
-- =====================================================
-- Orçamentos gerados pelos clientes

CREATE TABLE IF NOT EXISTS orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificação
    numero_orcamento VARCHAR(50) UNIQUE NOT NULL,

    -- Relacionamento (nullable para orçamentos não logados)
    user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Dados do Cliente
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefone VARCHAR(20) NULL,
    cliente_cnpj VARCHAR(18) NULL,
    cliente_endereco JSONB NULL,

    -- Condições Comerciais
    condicoes_comerciais JSONB NULL,

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
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado', 'aceito', 'recusado', 'expirado')),

    -- Arquivos
    pdf_url TEXT NULL,
    pdf_path TEXT NULL,

    -- Observações
    observacoes TEXT NULL,

    -- Datas
    validade_ate DATE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA: orcamento_itens
-- =====================================================
-- Itens de cada orçamento

CREATE TABLE IF NOT EXISTS orcamento_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento
    orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
    produto_id UUID NULL REFERENCES produtos(id) ON DELETE SET NULL,

    -- Dados do Item
    nome_produto VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,

    -- Especificações (para itens customizados)
    especificacoes JSONB NULL,

    -- Ordem de exibição
    ordem INT DEFAULT 0
);

-- =====================================================
-- 5. TABELA: contatos
-- =====================================================
-- Mensagens do formulário de contato

CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Dados do Contato
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    cnpj VARCHAR(18) NULL,
    assunto VARCHAR(255) DEFAULT 'Contato',
    mensagem TEXT NOT NULL,

    -- Status
    lido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    resposta TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABELA: calculos_historico (Opcional)
-- =====================================================
-- Histórico de cálculos da calculadora

CREATE TABLE IF NOT EXISTS calculos_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento (nullable para cálculos não logados)
    user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Tipo de cálculo
    tipo_calculo VARCHAR(50) NOT NULL,

    -- Dados de entrada e resultado
    dados_entrada JSONB NOT NULL,
    resultado JSONB NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABELA: admin_users (para usuários admin)
-- =====================================================
-- Usuários administradores do sistema

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_preco ON produtos(preco);
CREATE INDEX IF NOT EXISTS idx_produtos_nome_search ON produtos USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_produtos_descricao_search ON produtos USING gin(to_tsvector('portuguese', descricao));

CREATE INDEX IF NOT EXISTS idx_carrinho_user_id ON carrinho(user_id);
CREATE INDEX IF NOT EXISTS idx_carrinho_produto_id ON carrinho(produto_id);

CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id ON orcamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_numero ON orcamentos(numero_orcamento);
CREATE INDEX IF NOT EXISTS idx_orcamentos_created_at ON orcamentos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orcamento_itens_orcamento_id ON orcamento_itens(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_itens_produto_id ON orcamento_itens(produto_id);

CREATE INDEX IF NOT EXISTS idx_contatos_lido ON contatos(lido);
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON contatos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON contatos(email);

CREATE INDEX IF NOT EXISTS idx_calculos_user_id ON calculos_historico(user_id);
CREATE INDEX IF NOT EXISTS idx_calculos_tipo ON calculos_historico(tipo_calculo);
CREATE INDEX IF NOT EXISTS idx_calculos_created_at ON calculos_historico(created_at DESC);

-- =====================================================
-- FUNCTIONS ÚTEIS
-- =====================================================

-- Function: Gerar número de orçamento automático
CREATE OR REPLACE FUNCTION gerar_numero_orcamento()
RETURNS TEXT AS $$
DECLARE
    novo_numero TEXT;
    ultimo_numero INT := 0;
    numero_extraido TEXT;
BEGIN
    -- Buscar último número de orçamento
    SELECT numero_orcamento INTO numero_extraido
    FROM orcamentos
    WHERE numero_orcamento ~ '^CP [0-9]+$'
    ORDER BY CAST(SUBSTRING(numero_orcamento FROM 4) AS INTEGER) DESC
    LIMIT 1;

    -- Extrair número se encontrado
    IF numero_extraido IS NOT NULL THEN
        ultimo_numero := CAST(SUBSTRING(numero_extraido FROM 4) AS INTEGER);
    END IF;

    -- Gerar novo número (próximo sequencial)
    novo_numero := 'CP ' || LPAD((ultimo_numero + 1)::TEXT, 5, '0');

    RETURN novo_numero;
END;
$$ LANGUAGE plpgsql;

-- Function: Calcular total do carrinho de um usuário
CREATE OR REPLACE FUNCTION calcular_total_carrinho(p_user_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2) := 0.00;
BEGIN
    SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
    INTO total
    FROM carrinho
    WHERE user_id = p_user_id;

    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function: Verificar se produto pode ser adicionado ao carrinho
CREATE OR REPLACE FUNCTION pode_adicionar_carrinho(p_produto_id UUID, p_quantidade INT)
RETURNS BOOLEAN AS $$
DECLARE
    produto_disponivel BOOLEAN;
    estoque_disponivel INT;
BEGIN
    SELECT ativo, estoque
    INTO produto_disponivel, estoque_disponivel
    FROM produtos
    WHERE id = p_produto_id;

    RETURN (produto_disponivel = TRUE AND estoque_disponivel >= p_quantidade);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS ÚTEIS
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
    u.raw_user_meta_data->>'nome' as usuario_nome,
    u.email as usuario_email,
    (SELECT COUNT(*) FROM orcamento_itens WHERE orcamento_id = o.id) as total_itens
FROM orcamentos o
LEFT JOIN auth.users u ON o.user_id = u.id;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrinho ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (todos podem ler produtos ativos)
CREATE POLICY "Produtos ativos são públicos" ON produtos
    FOR SELECT USING (ativo = true);

CREATE POLICY "Admins podem gerenciar produtos" ON produtos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.ativo = true
        )
    );

-- Políticas para carrinho (usuários só veem seu próprio carrinho)
CREATE POLICY "Usuários podem gerenciar seu carrinho" ON carrinho
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para orçamentos
CREATE POLICY "Usuários podem ver seus próprios orçamentos" ON orcamentos
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuários podem criar orçamentos" ON orcamentos
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins podem gerenciar todos os orçamentos" ON orcamentos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.ativo = true
        )
    );

-- Políticas para itens de orçamento
CREATE POLICY "Usuários podem ver itens de seus orçamentos" ON orcamento_itens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamento_itens.orcamento_id
            AND (orcamentos.user_id = auth.uid() OR orcamentos.user_id IS NULL)
        )
    );

CREATE POLICY "Usuários podem criar itens em seus orçamentos" ON orcamento_itens
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamento_itens.orcamento_id
            AND (orcamentos.user_id = auth.uid() OR orcamentos.user_id IS NULL)
        )
    );

CREATE POLICY "Admins podem gerenciar todos os itens" ON orcamento_itens
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.ativo = true
        )
    );

-- Políticas para contatos (todos podem criar, admins podem gerenciar)
CREATE POLICY "Todos podem criar contatos" ON contatos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem gerenciar contatos" ON contatos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.ativo = true
        )
    );

-- Políticas para histórico de cálculos
CREATE POLICY "Usuários podem ver seus cálculos" ON calculos_historico
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuários podem criar cálculos" ON calculos_historico
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Políticas para admin_users (só admins podem ver)
CREATE POLICY "Admins podem gerenciar admin_users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.ativo = true
        )
    );

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir usuário admin inicial
-- IMPORTANTE: Substitua o hash abaixo pelo hash real gerado
INSERT INTO admin_users (user_id, nome, email, ativo) VALUES
('00000000-0000-0000-0000-000000000000', 'Administrador', 'admin@usetrafo.com.br', true)
ON CONFLICT (user_id) DO NOTHING;

-- Mensagem de sucesso
SELECT 'Schema Supabase criado com sucesso!' as mensagem;