-- =====================================================
-- SCHEMA: Tabela de Produtos - USETRAFO
-- =====================================================
-- Descrição: Estrutura completa da tabela produtos
--            para armazenar catálogo de transformadores
-- =====================================================

-- Tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informações Básicas
    nome TEXT NOT NULL,
    descricao TEXT,
    descricao_completa TEXT,
    subtitulo TEXT,
    
    -- Preço
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    preco_antigo NUMERIC(10, 2), -- Para mostrar desconto
    
    -- Imagens
    imagem_principal TEXT, -- URL da imagem principal
    imagens JSONB, -- Array de URLs: ["url1", "url2"]
    
    -- Categorização
    categoria TEXT NOT NULL, -- 'transformadores-oleo', 'autotransformadores', 'transformadores-isoladores'
    subcategoria TEXT, -- Opcional
    slug TEXT UNIQUE, -- URL amigável: 'transformador-oleo-45kva-15kv'
    
    -- Especificações Técnicas (JSONB flexível)
    especificacoes JSONB, -- Ex: {"potencia": "45 kVA", "classe": "15 kV", "tensao": "220/380 V"}
    
    -- Estoque
    estoque INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0,
    disponivel BOOLEAN DEFAULT true,
    
    -- Status e Controle
    ativo BOOLEAN DEFAULT true,
    destaque BOOLEAN DEFAULT false,
    novo BOOLEAN DEFAULT false,
    
    -- Links Externos
    mercado_livre_url TEXT, -- Link para Mercado Livre
    
    -- Metadados
    visualizacoes INTEGER DEFAULT 0,
    vendas INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_preco ON produtos(preco);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_produtos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_update_produtos_updated_at
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION update_produtos_updated_at();

-- =====================================================
-- RLS POLICIES (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler produtos ativos
CREATE POLICY "Produtos ativos são públicos"
    ON produtos FOR SELECT
    USING (ativo = true);

-- Política: Apenas admins podem inserir produtos
CREATE POLICY "Apenas admins podem criar produtos"
    ON produtos FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Política: Apenas admins podem atualizar produtos
CREATE POLICY "Apenas admins podem atualizar produtos"
    ON produtos FOR UPDATE
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Política: Apenas admins podem deletar produtos
CREATE POLICY "Apenas admins podem deletar produtos"
    ON produtos FOR DELETE
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- =====================================================
-- COMENTÁRIOS NAS COLUNAS (Documentação)
-- =====================================================

COMMENT ON TABLE produtos IS 'Catálogo de transformadores e equipamentos elétricos';
COMMENT ON COLUMN produtos.especificacoes IS 'JSONB com especificações técnicas: {"potencia": "45 kVA", "classe": "15 kV", etc}';
COMMENT ON COLUMN produtos.imagens IS 'Array JSON com URLs das imagens: ["url1", "url2"]';
COMMENT ON COLUMN produtos.slug IS 'URL amigável única para SEO: transformador-oleo-45kva-15kv';
