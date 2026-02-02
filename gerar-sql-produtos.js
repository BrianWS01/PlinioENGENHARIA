/**
 * Script para gerar SQL de importação de produtos
 * Lê o catalogo-produtos.js e gera importar-produtos.sql completo
 */

const fs = require('fs');
const path = require('path');

// Ler o arquivo catalogo-produtos.js
const catalogoPath = path.join(__dirname, 'catalogo-produtos.js');
const catalogoContent = fs.readFileSync(catalogoPath, 'utf8');

// Criar contexto isolado para executar o código
const vm = require('vm');

// Contexto global que simula navegador
const context = vm.createContext({
    window: {},
    console: {
        log: () => {} // Suprimir logs
    },
    require: () => ({}),
    module: { exports: {} },
    exports: {}
});

// Adicionar catalogoProdutos ao contexto
context.catalogoProdutos = {};
context.produtosOleo = [];
context.produtosAuto = [];
context.produtosIsolador = [];
context.gerarSlug = function(nome) {
    return nome.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Executar o código do catálogo
try {
    vm.runInContext(catalogoContent, context);
} catch (e) {
    console.error('Erro ao executar código:', e.message);
}

// Obter catalogoProdutos do contexto
const catalogoProdutos = context.catalogoProdutos || context.window?.catalogoProdutos || {};
const produtos = Object.values(catalogoProdutos);

console.log(`📦 Produtos encontrados: ${produtos.length}`);

// Se não encontrou produtos, usar os arrays diretamente para gerar
if (produtos.length === 0) {
    console.log('⚠️ Não encontrou produtos no objeto, gerando a partir das listas...');
    // Você pode criar produtos manualmente aqui ou verificar o problema
}

// Função para escapar strings SQL
function escapeSQL(str) {
    if (!str || str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

// Função para formatar JSON para SQL
function formatJSON(obj) {
    if (!obj) return 'NULL';
    return escapeSQL(JSON.stringify(obj));
}

// Função para formatar array JSON
function formatJSONArray(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return 'NULL';
    return escapeSQL(JSON.stringify(arr));
}

// Gerar SQL INSERT
let sql = `-- =====================================================
-- SCRIPT DE IMPORTAÇÃO DE PRODUTOS COMPLETO
-- Importa todos os produtos do catálogo
-- Total: ${produtos.length} produtos
-- =====================================================

USE usetrafo_db;

-- Limpar produtos existentes (OPCIONAL - descomente se quiser limpar antes)
-- DELETE FROM produtos;

-- =====================================================
-- INSERÇÃO DE PRODUTOS
-- =====================================================

`;

// Gerar INSERT para cada produto
if (produtos.length > 0) {
    produtos.forEach((produto) => {
        const tagsArray = produto.tags || [];
        
        sql += `INSERT INTO produtos (
    id,
    nome,
    descricao,
    descricao_completa,
    subtitulo,
    preco,
    categoria,
    slug,
    especificacoes,
    imagem_principal,
    imagens,
    ativo,
    tags,
    subcategoria,
    estoque,
    disponivel
) VALUES (
    UUID(),
    ${escapeSQL(produto.nome)},
    ${escapeSQL(produto.descricao)},
    ${escapeSQL(produto.descricao_completa)},
    ${escapeSQL(produto.subtitulo)},
    ${produto.preco},
    ${escapeSQL(produto.categoria)},
    ${escapeSQL(produto.slug)},
    ${formatJSON(produto.especificacoes)},
    ${escapeSQL(produto.imagem_principal)},
    ${formatJSONArray(produto.imagens)},
    ${produto.ativo ? 'TRUE' : 'FALSE'},
    ${formatJSONArray(tagsArray)},
    ${escapeSQL(produto.subcategoria || null)},
    ${produto.estoque || 0},
    ${produto.disponivel !== false ? 'TRUE' : 'FALSE'}
);

`;
    });
} else {
    sql += `-- ⚠️ ATENÇÃO: Nenhum produto encontrado no catálogo!\n`;
    sql += `-- Verifique o arquivo catalogo-produtos.js\n\n`;
}

// Adicionar mensagem de sucesso
sql += `-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

SELECT 'Produtos importados com sucesso!' as mensagem;
SELECT COUNT(*) as total_produtos FROM produtos;

-- Ver produtos por categoria
SELECT categoria, COUNT(*) as total FROM produtos GROUP BY categoria;
`;

// Salvar arquivo SQL
const outputPath = path.join(__dirname, 'importar-produtos-completo.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

if (produtos.length > 0) {
    console.log(`✅ SQL gerado com sucesso!`);
    console.log(`📁 Arquivo: importar-produtos-completo.sql`);
    console.log(`📦 Total de produtos: ${produtos.length}`);
    console.log(`\nPróximo passo: Execute o arquivo SQL no seu MariaDB`);
} else {
    console.log(`⚠️ Arquivo gerado mas sem produtos!`);
    console.log(`📁 Arquivo: importar-produtos-completo.sql`);
    console.log(`\n⚠️ Verifique o arquivo catalogo-produtos.js`);
}
