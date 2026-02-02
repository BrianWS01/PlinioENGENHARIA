/**
 * Script para gerar JSON de produtos para importação no banco de dados
 */

// Copiar o código de catalogo-produtos.js aqui temporariamente
const fs = require('fs');

// Ler o arquivo catalogo-produtos.js
const scriptContent = fs.readFileSync('catalogo-produtos.js', 'utf8');

// Criar um contexto isolado para executar o script
const vm = require('vm');
const context = vm.createContext({
    console: console,
    require: require,
    module: {},
    exports: {},
    window: undefined,
    global: global
});

// Executar o script
vm.runInContext(scriptContent, context);

// Agora acessar o catalogoProdutos do contexto
const produtosArray = Object.values(context.catalogoProdutos);

// Converter para formato JSON pronto para importação no Supabase
const jsonData = produtosArray.map(produto => ({
    nome: produto.nome,
    descricao: produto.descricao,
    descricao_completa: produto.descricao_completa,
    preco: produto.preco,
    preco_antigo: produto.preco_antigo,
    imagem_principal: produto.imagem_principal,
    imagens: produto.imagens,
    categoria: produto.categoria,
    subcategoria: produto.subcategoria,
    especificacoes: produto.especificacoes,
    estoque: produto.estoque,
    estoque_minimo: produto.estoque_minimo,
    ativo: produto.ativo,
    destaque: produto.destaque,
    tags: [
        produto.categoria,
        produto.subcategoria,
        produto.especificacoes.potencia?.toLowerCase(),
        produto.especificacoes.classe?.toLowerCase(),
        produto.especificacoes.tensao?.toLowerCase(),
        produto.especificacoes.refrigeracao?.toLowerCase()
    ].filter(Boolean),
    mercado_livre_url: produto.mercado_livre_url || null
}));

// Salvar JSON
fs.writeFileSync('produtos-import.json', JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`✅ JSON gerado com sucesso! Total de produtos: ${jsonData.length}`);
console.log(`   Arquivo salvo em: produtos-import.json`);
