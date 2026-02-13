/**
 * =====================================================
 * CATÁLOGO DE PRODUTOS - USETRAFO
 * =====================================================
 * Base de dados completa de produtos
 * Total: 99 produtos
 * - 42 Transformadores a Óleo (14 potências x 3 classes)
 * - 52 Autotransformadores (26 potências x 2 tensões)  
 * - 26 Transformadores Isoladores
 * =====================================================
 */

// Função para gerar slug único
function gerarSlug(nome) {
    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Lista de produtos - Transformadores a Óleo
const produtosOleo = [
    { potencia: '45', classes: ['15', '25', '36'], precos: [10700.00, 11400.00, 13600.00] },
    { potencia: '75', classes: ['15', '25', '36'], precos: [14900.00, 15900.00, 17600.00] },
    { potencia: '112.5', classes: ['15', '25', '36'], precos: [18300.00, 19500.00, 20800.00] },
    { potencia: '150', classes: ['15', '25', '36'], precos: [22400.00, 23700.00, 26000.00] },
    { potencia: '225', classes: ['15', '25', '36'], precos: [29900.00, 31700.00, 34900.00] },
    { potencia: '300', classes: ['15', '25', '36'], precos: [34600.00, 36600.00, 39100.00] },
    { potencia: '500', classes: ['15', '25', '36'], precos: [53500.00, 56100.00, 63000.00] },
    { potencia: '750', classes: ['15', '25', '36'], precos: [72100.00, 76400.00, 84500.00] },
    { potencia: '1000', classes: ['15', '25', '36'], precos: [92400.00, 98600.00, 108400.00] },
    { potencia: '1250', classes: ['15', '25', '36'], precos: [115600.00, 123400.00, 135600.00] },
    { potencia: '1500', classes: ['15', '25', '36'], precos: [127600.00, 135600.00, 149100.00] },
    { potencia: '2000', classes: ['15', '25', '36'], precos: [162600.00, 172500.00, 187300.00] },
    { potencia: '2500', classes: ['15', '25', '36'], precos: [203300.00, 215600.00, 234100.00] },
    { potencia: '3000', classes: ['15', '25', '36'], precos: [244000.00, 258700.00, 280900.00] }
];

// Lista de produtos - Autotransformadores
const produtosAuto = [
    { potencia: '3', tensoes: ['220/380', '220/440'], precos: [1150.60, 1186.90] },
    { potencia: '5', tensoes: ['220/380', '220/440'], precos: [1309.00, 1529.00] },
    { potencia: '7.5', tensoes: ['220/380', '220/440'], precos: [1556.50, 1793.00] },
    { potencia: '10', tensoes: ['220/380', '220/440'], precos: [1793.00, 2439.80] },
    { potencia: '15', tensoes: ['220/380', '220/440'], precos: [2497.00, 2970.00] },
    { potencia: '20', tensoes: ['220/380', '220/440'], precos: [2893.00, 3022.80] },
    { potencia: '25', tensoes: ['220/380', '220/440'], precos: [3025.00, 3458.40] },
    { potencia: '30', tensoes: ['220/380', '220/440'], precos: [3476.00, 3894.00] },
    { potencia: '40', tensoes: ['220/380', '220/440'], precos: [4719.00, 6039.00] },
    { potencia: '45', tensoes: ['220/380', '220/440'], precos: [5087.50, 6512.00] },
    { potencia: '50', tensoes: ['220/380', '220/440'], precos: [5456.00, 6985.00] },
    { potencia: '60', tensoes: ['220/380', '220/440'], precos: [5918.00, 7205.00] },
    { potencia: '75', tensoes: ['220/380', '220/440'], precos: [7095.00, 8404.00] },
    { potencia: '90', tensoes: ['220/380', '220/440'], precos: [7634.00, 9174.00] },
    { potencia: '100', tensoes: ['220/380', '220/440'], precos: [8547.00, 9944.00] },
    { potencia: '112.5', tensoes: ['220/380', '220/440'], precos: [9245.50, 10521.50] },
    { potencia: '120', tensoes: ['220/380', '220/440'], precos: [9944.00, 11099.00] },
    { potencia: '150', tensoes: ['220/380', '220/440'], precos: [11033.00, 12793.00] },
    { potencia: '200', tensoes: ['220/380', '220/440'], precos: [14619.00, 18304.00] },
    { potencia: '225', tensoes: ['220/380', '220/440'], precos: [16049.00, 20350.00] },
    { potencia: '250', tensoes: ['220/380', '220/440'], precos: [18370.00, 24530.00] },
    { potencia: '300', tensoes: ['220/380', '220/440'], precos: [20240.00, 26180.00] },
    { potencia: '350', tensoes: ['220/380', '220/440'], precos: [23430.00, 31053.00] },
    { potencia: '400', tensoes: ['220/380', '220/440'], precos: [37576.00, 40458.00] },
    { potencia: '450', tensoes: ['220/380', '220/440'], precos: [40458.00, 42350.00] },
    { potencia: '500', tensoes: ['220/380', '220/440'], precos: [39336.00, 44976.25] }
];

// Lista de produtos - Transformadores Isoladores
const produtosIsolador = [
    { potencia: '3', preco: 1617.00 },
    { potencia: '5', preco: 2365.00 },
    { potencia: '7.5', preco: 2755.50 },
    { potencia: '10', preco: 3146.00 },
    { potencia: '15', preco: 3750.00 },
    { potencia: '20', preco: 5250.00 },
    { potencia: '25', preco: 6050.00 },
    { potencia: '30', preco: 7590.00 },
    { potencia: '40', preco: 8864.90 },
    { potencia: '45', preco: 9570.00 },
    { potencia: '50', preco: 10285.00 },
    { potencia: '60', preco: 11330.00 },
    { potencia: '75', preco: 13178.00 },
    { potencia: '90', preco: 14289.00 },
    { potencia: '100', preco: 16258.00 },
    { potencia: '112.5', preco: 19140.00 },
    { potencia: '120', preco: 20350.00 },
    { potencia: '150', preco: 24530.00 },
    { potencia: '200', preco: 37576.00 },
    { potencia: '225', preco: 40458.00 },
    { potencia: '250', preco: 42350.00 },
    { potencia: '300', preco: 47602.50 },
    { potencia: '350', preco: 52855.00 },
    { potencia: '400', preco: 60071.00 },
    { potencia: '450', preco: 67287.00 },
    { potencia: '500', preco: 70829.00 }
];

// Gerar objeto completo de produtos
const catalogoProdutos = {};

// Gerar Transformadores a Óleo
produtosOleo.forEach((item) => {
    item.classes.forEach((classe, idxClasse) => {
        const id = `oleo-${item.potencia.replace('.', '-')}-${classe}`;
        const nome = `Transformador a Óleo ${item.potencia} kVA – Classe ${classe} kV`;
        const slug = gerarSlug(nome);

        catalogoProdutos[id] = {
            id: id,
            nome: nome,
            descricao: `Transformador a óleo de média tensão ${item.potencia} kVA classe ${classe} kV`,
            descricao_completa: `<p>Transformador a óleo de ${item.potencia} kVA classe ${classe} kV, desenvolvido para aplicações de média tensão com alta confiabilidade e durabilidade.</p><p>Todos os equipamentos produzidos pela USETRAFO são testados em nosso laboratório individualmente, e emitido certificado de garantia com 36 meses contra defeitos de fabricação.</p>`,
            subtitulo: `Transformador a óleo de média tensão ${item.potencia} kVA classe ${classe} kV`,
            preco: item.precos[idxClasse],
            preco_antigo: null,
            imagem_principal: 'src/imgs/trafos a seco1 .jpeg',
            imagens: ['src/imgs/trafos a seco1 .jpeg', 'src/imgs/trafos a seco2.jpeg', 'src/imgs/trafos a seco3.jpeg'],
            categoria: 'transformadores-oleo',
            subcategoria: 'media-tensao',
            slug: slug,
            especificacoes: {
                potencia: `${item.potencia} kVA`,
                classe: `${classe} kV`,
                frequencia: '50Hz ou 60Hz',
                refrigeracao: 'oleo',
                construcao: 'trifasico',
                garantia: '36 meses'
            },
            estoque: 0,
            estoque_minimo: 0,
            disponivel: true,
            ativo: true,
            destaque: false,
            novo: true,
            mercado_livre_url: '#',
            visualizacoes: 0,
            vendas: 0
        };
    });
});

// Gerar Autotransformadores
produtosAuto.forEach((item) => {
    item.tensoes.forEach((tensao, idx) => {
        const tensaoSlug = tensao.replace('/', '-');
        const id = `auto-${item.potencia.replace('.', '-')}-${tensaoSlug}`;
        const nome = `Autotransformador ${item.potencia} kVA – ${tensao} V`;
        const slug = gerarSlug(nome);

        catalogoProdutos[id] = {
            id: id,
            nome: nome,
            descricao: `Autotransformador ${item.potencia} kVA para adequação de tensão ${tensao} V`,
            descricao_completa: `<p>Autotransformador de ${item.potencia} kVA tensão ${tensao} V, desenvolvido com engenharia precisa e matéria-prima de alto padrão, seguindo as normas NBR/IEC para garantir segurança, confiabilidade e desempenho superior.</p><p>Produzidos na classe térmica F, oferecem excelente estabilidade térmica e alta eficiência mesmo em operação contínua.</p>`,
            subtitulo: `Autotransformador ${item.potencia} kVA para adequação de tensão ${tensao} V`,
            preco: item.precos[idx],
            preco_antigo: null,
            imagem_principal: 'src/imgs/C (3) 1.png',
            imagens: ['src/imgs/C (3) 1.png'],
            categoria: 'autotransformadores',
            subcategoria: 'baixa-tensao',
            slug: slug,
            especificacoes: {
                potencia: `${item.potencia} kVA`,
                tensao: `${tensao} V`,
                frequencia: '50Hz ou 60Hz',
                refrigeracao: 'ar-natural',
                construcao: 'trifasico',
                garantia: '36 meses'
            },
            estoque: 0,
            estoque_minimo: 0,
            disponivel: true,
            ativo: true,
            destaque: false,
            novo: true,
            mercado_livre_url: '#',
            visualizacoes: 0,
            vendas: 0
        };
    });
});

// Gerar Transformadores Isoladores
produtosIsolador.forEach((item) => {
    const id = `isolador-${item.potencia.replace('.', '-')}`;
    const nome = `Transformador Isolador ${item.potencia} kVA`;
    const slug = gerarSlug(nome);

    catalogoProdutos[id] = {
        id: id,
        nome: nome,
        descricao: `Transformador isolador ${item.potencia} kVA com isolamento galvânico completo`,
        descricao_completa: `<p>Transformador isolador de ${item.potencia} kVA, fabricado com engenharia de alta precisão e matéria-prima selecionada, seguindo rigorosamente as normas NBR/IEC. Projetado para oferecer isolamento galvânico completo entre primário e secundário.</p><p>Fornece neutro estável, maior proteção contra surtos e aumento significativo da segurança elétrica em diversos cenários.</p>`,
        subtitulo: `Transformador isolador ${item.potencia} kVA com isolamento galvânico completo`,
        preco: item.preco,
        preco_antigo: null,
        imagem_principal: 'src/imgs/C (3) 1.png',
        imagens: ['src/imgs/C (3) 1.png'],
        categoria: 'transformadores-isoladores',
        subcategoria: 'baixa-tensao',
        slug: slug,
        especificacoes: {
            potencia: `${item.potencia} kVA`,
            frequencia: '50Hz ou 60Hz',
            refrigeracao: 'ar-natural',
            construcao: 'trifasico',
            garantia: '36 meses'
        },
        estoque: 0,
        estoque_minimo: 0,
        disponivel: true,
        ativo: true,
        destaque: false,
        novo: true,
        mercado_livre_url: '#',
        visualizacoes: 0,
        vendas: 0
    };
});

// Funções auxiliares
function obterProdutosAtivos() {
    return Object.values(catalogoProdutos).filter(p => p.ativo === true);
}

function obterProdutosPorCategoria(categoria) {
    return obterProdutosAtivos().filter(p => p.categoria === categoria);
}

function obterProdutoPorId(id) {
    return catalogoProdutos[id] || null;
}

function obterProdutoPorSlug(slug) {
    return obterProdutosAtivos().find(p => p.slug === slug) || null;
}

// Exportar para uso no navegador
if (typeof window !== 'undefined') {
    window.catalogoProdutos = catalogoProdutos;
    window.obterProdutosAtivos = obterProdutosAtivos;
    window.obterProdutosPorCategoria = obterProdutosPorCategoria;
    window.obterProdutoPorId = obterProdutoPorId;
    window.obterProdutoPorSlug = obterProdutoPorSlug;
    window.gerarSlug = gerarSlug;
}

// Exportar para Node.js (seeding)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { catalogoProdutos, produtosOleo, produtosAuto, produtosIsolador };
}
