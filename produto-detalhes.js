// Base de dados dos produtos
const produtos = {
    
    // Transformadores a Óleo - Média Tensão
    'oleo-45-15': {
        name: 'Transformador a Óleo 45 kVA – Classe 15 kV',
        category: 'Transformadores a Óleo',
        subtitle: 'Transformador a óleo de média tensão para aplicações industriais',
        images: ['src/imgs/C (3) 1.png'],
        description: '<p>Transformador a óleo de 45 kVA classe 15 kV, desenvolvido para aplicações de média tensão com alta confiabilidade e durabilidade.</p>',
        specs: [
            { icon: 'check-circle', color: 'success', text: 'Potência: 45 kVA' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 15 kV' },
            { icon: 'check-circle', color: 'success', text: 'Refrigeração: Óleo' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'oil-can', label: 'Categoria', value: 'Transformadores a Óleo' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#',
        price: 10700.00
    }
};

// Função para gerar definições de produtos dinamicamente - REMOVIDA
/*
function gerarDefinicoesProdutos() {
    const produtosCatalogo = {
        // Transformadores a Óleo
        'oleo-45-25': { potencia: '45 kVA', classe: '25 kV', price: 11400.00 },
        'oleo-45-36': { potencia: '45 kVA', classe: '36 kV', price: 13600.00 },
        'oleo-75-15': { potencia: '75 kVA', classe: '15 kV', price: 14900.00 },
        'oleo-75-25': { potencia: '75 kVA', classe: '25 kV', price: 15900.00 },
        'oleo-75-36': { potencia: '75 kVA', classe: '36 kV', price: 17600.00 },
        'oleo-112.5-15': { potencia: '112.5 kVA', classe: '15 kV', price: 18300.00 },
        'oleo-112.5-25': { potencia: '112.5 kVA', classe: '25 kV', price: 19500.00 },
        'oleo-112.5-36': { potencia: '112.5 kVA', classe: '36 kV', price: 20800.00 },
        'oleo-150-15': { potencia: '150 kVA', classe: '15 kV', price: 22400.00 },
        'oleo-150-25': { potencia: '150 kVA', classe: '25 kV', price: 23700.00 },
        'oleo-150-36': { potencia: '150 kVA', classe: '36 kV', price: 26000.00 },
        'oleo-225-15': { potencia: '225 kVA', classe: '15 kV', price: 29900.00 },
        'oleo-225-25': { potencia: '225 kVA', classe: '25 kV', price: 31700.00 },
        'oleo-225-36': { potencia: '225 kVA', classe: '36 kV', price: 34900.00 },
        'oleo-300-15': { potencia: '300 kVA', classe: '15 kV', price: 34600.00 },
        'oleo-300-25': { potencia: '300 kVA', classe: '25 kV', price: 36600.00 },
        'oleo-300-36': { potencia: '300 kVA', classe: '36 kV', price: 39100.00 },
        'oleo-500-15': { potencia: '500 kVA', classe: '15 kV', price: 53500.00 },
        'oleo-500-25': { potencia: '500 kVA', classe: '25 kV', price: 56100.00 },
        'oleo-500-36': { potencia: '500 kVA', classe: '36 kV', price: 63000.00 },
        'oleo-750-15': { potencia: '750 kVA', classe: '15 kV', price: 72100.00 },
        'oleo-750-25': { potencia: '750 kVA', classe: '25 kV', price: 76400.00 },
        'oleo-750-36': { potencia: '750 kVA', classe: '36 kV', price: 84500.00 },
        'oleo-1000-15': { potencia: '1000 kVA', classe: '15 kV', price: 92400.00 },
        'oleo-1000-25': { potencia: '1000 kVA', classe: '25 kV', price: 98600.00 },
        'oleo-1000-36': { potencia: '1000 kVA', classe: '36 kV', price: 108400.00 },
        'oleo-1250-15': { potencia: '1250 kVA', classe: '15 kV', price: 115600.00 },
        'oleo-1250-25': { potencia: '1250 kVA', classe: '25 kV', price: 123400.00 },
        'oleo-1250-36': { potencia: '1250 kVA', classe: '36 kV', price: 135600.00 },
        'oleo-1500-15': { potencia: '1500 kVA', classe: '15 kV', price: 127600.00 },
        'oleo-1500-25': { potencia: '1500 kVA', classe: '25 kV', price: 135600.00 },
        'oleo-1500-36': { potencia: '1500 kVA', classe: '36 kV', price: 149100.00 },
        'oleo-2000-15': { potencia: '2000 kVA', classe: '15 kV', price: 162600.00 },
        'oleo-2000-25': { potencia: '2000 kVA', classe: '25 kV', price: 172500.00 },
        'oleo-2000-36': { potencia: '2000 kVA', classe: '36 kV', price: 187300.00 },
        'oleo-2500-15': { potencia: '2500 kVA', classe: '15 kV', price: 203300.00 },
        'oleo-2500-25': { potencia: '2500 kVA', classe: '25 kV', price: 215600.00 },
        'oleo-2500-36': { potencia: '2500 kVA', classe: '36 kV', price: 234100.00 },
        'oleo-3000-15': { potencia: '3000 kVA', classe: '15 kV', price: 244000.00 },
        'oleo-3000-25': { potencia: '3000 kVA', classe: '25 kV', price: 258700.00 },
        'oleo-3000-36': { potencia: '3000 kVA', classe: '36 kV', price: 280900.00 },
        
        // Autotransformadores
        'auto-3-220-380': { potencia: '3 kVA', tensao: '220/380 V', price: 1150.60 },
        'auto-3-220-440': { potencia: '3 kVA', tensao: '220/440 V', price: 1186.90 },
        'auto-5-220-380': { potencia: '5 kVA', tensao: '220/380 V', price: 1309.00 },
        'auto-5-220-440': { potencia: '5 kVA', tensao: '220/440 V', price: 1529.00 },
        'auto-7.5-220-380': { potencia: '7.5 kVA', tensao: '220/380 V', price: 1556.50 },
        'auto-7.5-220-440': { potencia: '7.5 kVA', tensao: '220/440 V', price: 1793.00 },
        'auto-10-220-380': { potencia: '10 kVA', tensao: '220/380 V', price: 1793.00 },
        'auto-10-220-440': { potencia: '10 kVA', tensao: '220/440 V', price: 2439.80 },
        'auto-15-220-380': { potencia: '15 kVA', tensao: '220/380 V', price: 2497.00 },
        'auto-15-220-440': { potencia: '15 kVA', tensao: '220/440 V', price: 2970.00 },
        'auto-20-220-380': { potencia: '20 kVA', tensao: '220/380 V', price: 2893.00 },
        'auto-20-220-440': { potencia: '20 kVA', tensao: '220/440 V', price: 3022.80 },
        'auto-25-220-380': { potencia: '25 kVA', tensao: '220/380 V', price: 3025.00 },
        'auto-25-220-440': { potencia: '25 kVA', tensao: '220/440 V', price: 3458.40 },
        'auto-30-220-380': { potencia: '30 kVA', tensao: '220/380 V', price: 3476.00 },
        'auto-30-220-440': { potencia: '30 kVA', tensao: '220/440 V', price: 3894.00 },
        'auto-40-220-380': { potencia: '40 kVA', tensao: '220/380 V', price: 4719.00 },
        'auto-40-220-440': { potencia: '40 kVA', tensao: '220/440 V', price: 6039.00 },
        'auto-45-220-380': { potencia: '45 kVA', tensao: '220/380 V', price: 5087.50 },
        'auto-45-220-440': { potencia: '45 kVA', tensao: '220/440 V', price: 6512.00 },
        'auto-50-220-380': { potencia: '50 kVA', tensao: '220/380 V', price: 5456.00 },
        'auto-50-220-440': { potencia: '50 kVA', tensao: '220/440 V', price: 6985.00 },
        'auto-60-220-380': { potencia: '60 kVA', tensao: '220/380 V', price: 5918.00 },
        'auto-60-220-440': { potencia: '60 kVA', tensao: '220/440 V', price: 7205.00 },
        'auto-75-220-380': { potencia: '75 kVA', tensao: '220/380 V', price: 7095.00 },
        'auto-75-220-440': { potencia: '75 kVA', tensao: '220/440 V', price: 8404.00 },
        'auto-90-220-380': { potencia: '90 kVA', tensao: '220/380 V', price: 7634.00 },
        'auto-90-220-440': { potencia: '90 kVA', tensao: '220/440 V', price: 9174.00 },
        'auto-100-220-380': { potencia: '100 kVA', tensao: '220/380 V', price: 8547.00 },
        'auto-100-220-440': { potencia: '100 kVA', tensao: '220/440 V', price: 9944.00 },
        'auto-112.5-220-380': { potencia: '112.5 kVA', tensao: '220/380 V', price: 9245.50 },
        'auto-112.5-220-440': { potencia: '112.5 kVA', tensao: '220/440 V', price: 10521.50 },
        'auto-120-220-380': { potencia: '120 kVA', tensao: '220/380 V', price: 9944.00 },
        'auto-120-220-440': { potencia: '120 kVA', tensao: '220/440 V', price: 11099.00 },
        'auto-150-220-380': { potencia: '150 kVA', tensao: '220/380 V', price: 11033.00 },
        'auto-150-220-440': { potencia: '150 kVA', tensao: '220/440 V', price: 12793.00 },
        'auto-200-220-380': { potencia: '200 kVA', tensao: '220/380 V', price: 14619.00 },
        'auto-200-220-440': { potencia: '200 kVA', tensao: '220/440 V', price: 18304.00 },
        'auto-225-220-380': { potencia: '225 kVA', tensao: '220/380 V', price: 16049.00 },
        'auto-225-220-440': { potencia: '225 kVA', tensao: '220/440 V', price: 20350.00 },
        'auto-250-220-380': { potencia: '250 kVA', tensao: '220/380 V', price: 18370.00 },
        'auto-250-220-440': { potencia: '250 kVA', tensao: '220/440 V', price: 24530.00 },
        'auto-300-220-380': { potencia: '300 kVA', tensao: '220/380 V', price: 20240.00 },
        'auto-300-220-440': { potencia: '300 kVA', tensao: '220/440 V', price: 26180.00 },
        'auto-350-220-380': { potencia: '350 kVA', tensao: '220/380 V', price: 23430.00 },
        'auto-350-220-440': { potencia: '350 kVA', tensao: '220/440 V', price: 31053.00 },
        'auto-400-220-380': { potencia: '400 kVA', tensao: '220/380 V', price: 37576.00 },
        'auto-400-220-440': { potencia: '400 kVA', tensao: '220/440 V', price: 40458.00 },
        'auto-450-220-380': { potencia: '450 kVA', tensao: '220/380 V', price: 40458.00 },
        'auto-450-220-440': { potencia: '450 kVA', tensao: '220/440 V', price: 42350.00 },
        'auto-500-220-380': { potencia: '500 kVA', tensao: '220/380 V', price: 39336.00 },
        'auto-500-220-440': { potencia: '500 kVA', tensao: '220/440 V', price: 44976.25 },
        
        // Transformadores Isoladores
        'isolador-3': { potencia: '3 kVA', price: 1617.00 },
        'isolador-5': { potencia: '5 kVA', price: 2365.00 },
        'isolador-7.5': { potencia: '7.5 kVA', price: 2755.50 },
        'isolador-10': { potencia: '10 kVA', price: 3146.00 },
        'isolador-15': { potencia: '15 kVA', price: 3750.00 },
        'isolador-20': { potencia: '20 kVA', price: 5250.00 },
        'isolador-25': { potencia: '25 kVA', price: 6050.00 },
        'isolador-30': { potencia: '30 kVA', price: 7590.00 },
        'isolador-40': { potencia: '40 kVA', price: 8864.90 },
        'isolador-45': { potencia: '45 kVA', price: 9570.00 },
        'isolador-50': { potencia: '50 kVA', price: 10285.00 },
        'isolador-60': { potencia: '60 kVA', price: 11330.00 },
        'isolador-75': { potencia: '75 kVA', price: 13178.00 },
        'isolador-90': { potencia: '90 kVA', price: 14289.00 },
        'isolador-100': { potencia: '100 kVA', price: 16258.00 },
        'isolador-112.5': { potencia: '112.5 kVA', price: 19140.00 },
        'isolador-120': { potencia: '120 kVA', price: 20350.00 },
        'isolador-150': { potencia: '150 kVA', price: 24530.00 },
        'isolador-200': { potencia: '200 kVA', price: 37576.00 },
        'isolador-225': { potencia: '225 kVA', price: 40458.00 },
        'isolador-250': { potencia: '250 kVA', price: 42350.00 },
        'isolador-300': { potencia: '300 kVA', price: 47602.50 },
        'isolador-350': { potencia: '350 kVA', price: 52855.00 },
        'isolador-400': { potencia: '400 kVA', price: 60071.00 },
        'isolador-450': { potencia: '450 kVA', price: 67287.00 },
        'isolador-500': { potencia: '500 kVA', price: 70829.00 }
    };
    
    // Gerar definições para produtos que não existem
    for (const [id, dados] of Object.entries(produtosCatalogo)) {
        if (!produtos[id]) {
            const isOleo = id.startsWith('oleo-');
            const isAuto = id.startsWith('auto-');
            const isIsolador = id.startsWith('isolador-');
            
            let name, category, subtitle, description;
            
            if (isOleo) {
                name = `Transformador a Óleo ${dados.potencia} – Classe ${dados.classe}`;
                category = 'Transformadores a Óleo';
                subtitle = `Transformador a óleo de média tensão ${dados.potencia} classe ${dados.classe}`;
                description = `<p>Transformador a óleo de ${dados.potencia} classe ${dados.classe}, desenvolvido para aplicações de média tensão com alta confiabilidade e durabilidade.</p><p>Todos os equipamentos produzidos pela USETRAFO são testados em nosso laboratório individualmente, e emitido certificado de garantia com 36 meses contra defeitos de fabricação.</p>`;
            } else if (isAuto) {
                name = `Autotransformador ${dados.potencia} – ${dados.tensao}`;
                category = 'Autotransformadores';
                subtitle = `Autotransformador ${dados.potencia} para adequação de tensão ${dados.tensao}`;
                description = `<p>Autotransformador de ${dados.potencia} tensão ${dados.tensao}, desenvolvido com engenharia precisa e matéria-prima de alto padrão, seguindo as normas NBR/IEC para garantir segurança, confiabilidade e desempenho superior.</p>`;
            } else if (isIsolador) {
                name = `Transformador Isolador ${dados.potencia}`;
                category = 'Transformadores Isoladores';
                subtitle = `Transformador isolador ${dados.potencia} com isolamento galvânico completo`;
                description = `<p>Transformador isolador de ${dados.potencia}, fabricado com engenharia de alta precisão e matéria-prima selecionada, seguindo rigorosamente as normas NBR/IEC. Projetado para oferecer isolamento galvânico completo entre primário e secundário.</p>`;
            }
            
            produtos[id] = {
                name: name,
                category: category,
                subtitle: subtitle,
                images: ['src/imgs/C (3) 1.png'],
                description: description,
                specs: [
                    { icon: 'check-circle', color: 'success', text: `Potência: ${dados.potencia}` },
                    ...(dados.classe ? [{ icon: 'check-circle', color: 'success', text: `Classe de tensão: ${dados.classe}` }] : []),
                    ...(dados.tensao ? [{ icon: 'check-circle', color: 'success', text: `Tensão: ${dados.tensao}` }] : []),
                    { icon: 'check-circle', color: 'success', text: 'Frequência: 50Hz ou 60Hz' },
                    { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
                ],
                quickInfo: [
                    { icon: isOleo ? 'oil-can' : (isAuto ? 'exchange-alt' : 'shield-alt'), label: 'Categoria', value: category },
                    { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
                    { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
                ],
                mercadoLivre: '#',
                price: dados.price
            };
        }
    }
}

// Função para obter parâmetro da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Carregar informações do produto
function loadProduct() {
    console.log('=== INICIANDO loadProduct() ===');
    
    const produtoId = getUrlParameter('produto');
    console.log('ID do produto da URL:', produtoId);
    
    if (!produtoId) {
        console.error('ID do produto não encontrado na URL');
        window.location.href = 'loja.html';
        return;
    }
    
    // Verificar se o produto existe
    if (!produtos[produtoId]) {
        console.error(`Produto ${produtoId} não encontrado`);
        alert('Produto não encontrado. Redirecionando para a loja...');
        window.location.href = 'loja.html';
        return;
    }
    
    console.log('Produto encontrado:', produtoId);
    
    const produto = produtos[produtoId];
    
    console.log('Produto carregado:', produto);
    console.log('ID do produto:', produtoId);
    
    if (!produto) {
        console.error('Produto não encontrado após todas as tentativas');
        return;
    }
    
    // Atualizar título da página
    if (produto.name) {
        document.title = `${produto.name} - USETRAFO`;
    }
    
    // Atualizar breadcrumb (se existir)
    const breadcrumbElement = document.getElementById('breadcrumbProduct');
    if (breadcrumbElement && produto.name) {
        breadcrumbElement.textContent = produto.name;
    }
    
    // Atualizar hero section
    const productNameHero = document.getElementById('productNameHero');
    const productSubtitleHero = document.getElementById('productSubtitleHero');
    if (productNameHero && produto.name) {
        productNameHero.textContent = produto.name;
    }
    if (productSubtitleHero && produto.subtitle) {
        productSubtitleHero.textContent = produto.subtitle;
    }
    
    // Atualizar categoria
    const productCategory = document.getElementById('productCategory');
    if (productCategory && produto.category) {
        productCategory.textContent = produto.category;
    }
    
    // Atualizar nome e subtítulo
    const productName = document.getElementById('productName');
    const productSubtitle = document.getElementById('productSubtitle');
    if (productName && produto.name) {
        productName.textContent = produto.name;
    }
    if (productSubtitle && produto.subtitle) {
        productSubtitle.textContent = produto.subtitle;
    }
    
    // Atualizar imagens
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage && produto.images && produto.images.length > 0) {
        mainImage.src = produto.images[0];
        mainImage.alt = produto.name || 'Produto';
    }
    
    // Criar thumbnails
    const thumbnailsContainer = document.getElementById('productThumbnails');
    if (thumbnailsContainer && produto.images && produto.images.length > 0) {
        thumbnailsContainer.innerHTML = '';
        produto.images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `product-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${img}" alt="${produto.name || 'Produto'} - Vista ${index + 1}">`;
            thumbnail.addEventListener('click', () => {
                if (mainImage) {
                    mainImage.src = img;
                }
                document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    // Atualizar descrição
    const productDescription = document.getElementById('productDescription');
    if (productDescription && produto.description) {
        productDescription.innerHTML = produto.description;
    }
    
    // Atualizar especificações
    const specsContainer = document.getElementById('productSpecs');
    if (specsContainer && produto.specs && produto.specs.length > 0) {
        specsContainer.innerHTML = '<div class="specs-list">';
        produto.specs.forEach(spec => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            const boldTag = spec.bold ? '<strong style="color: var(--primary-color);">' : '';
            const boldClose = spec.bold ? '</strong>' : '';
            specItem.innerHTML = `
                <i class="fas fa-${spec.icon} text-${spec.color}"></i>
                <span style="font-size: 0.95rem;">${boldTag}${spec.text}${boldClose}</span>
            `;
            const specsList = specsContainer.querySelector('.specs-list');
            if (specsList) {
                specsList.appendChild(specItem);
            }
        });
    }
    
    // Atualizar informações rápidas
    const quickInfoContainer = document.getElementById('quickInfo');
    if (quickInfoContainer && produto.quickInfo && produto.quickInfo.length > 0) {
        quickInfoContainer.innerHTML = '';
        produto.quickInfo.forEach(info => {
            const infoItem = document.createElement('div');
            infoItem.className = 'quick-info-item';
            infoItem.innerHTML = `
                <i class="fas fa-${info.icon}"></i>
                <div>
                    <small class="text-muted d-block mb-1" style="font-size: 0.85rem;">${info.label}</small>
                    <strong style="color: var(--primary-color);">${info.value}</strong>
                </div>
            `;
            quickInfoContainer.appendChild(infoItem);
        });
    }
    
    // Atualizar botão adicionar ao carrinho
    const btnAddToCart = document.getElementById('btnAddToCart');
    if (btnAddToCart) {
        btnAddToCart.setAttribute('data-product', produtoId);
        btnAddToCart.setAttribute('data-name', produto.name || '');
        btnAddToCart.setAttribute('data-price', produto.price || '0');
    }
    
    // Atualizar link do Mercado Livre
    const btnMercadoLivre = document.getElementById('btnMercadoLivre');
    if (btnMercadoLivre && produto.mercadoLivre) {
        btnMercadoLivre.href = produto.mercadoLivre;
    }
    
    // Atualizar preço se houver elemento para isso
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        if (produto.price && produto.price > 0) {
            productPrice.textContent = `R$ ${produto.price.toFixed(2).replace('.', ',')}`;
            productPrice.style.fontSize = '1.5rem';
            productPrice.style.fontWeight = 'bold';
            productPrice.style.color = 'var(--primary-color)';
        } else {
            productPrice.textContent = 'Consulte o preço';
        }
    }
    
    console.log('Produto carregado com sucesso!');
    console.log('Elementos atualizados:', {
        name: !!productName,
        subtitle: !!productSubtitle,
        category: !!productCategory,
        description: !!productDescription,
        price: !!productPrice,
        images: !!mainImage
    });
}

// Função gerarDefinicoesProdutos removida - produtos dinâmicos desabilitados

// Adicionar ao carrinho
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando carregamento do produto...');
    
    // Carregar o produto
    loadProduct();
    
    // Carrinho
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoBadge = document.getElementById('carrinhoBadge');
    
    function updateCartBadge() {
        const total = carrinho.reduce((sum, item) => sum + item.quantity, 0);
        if (carrinhoBadge) carrinhoBadge.textContent = total;
    }
    
    updateCartBadge();
    
    // Botão adicionar ao carrinho
    const btnAddToCart = document.getElementById('btnAddToCart');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', function() {
            // Verificar se está logado
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;
            if (!usuarioLogado) {
                // Redirecionar para página de login com redirect
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            
            const product = this.getAttribute('data-product');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price')) || 0;
            const produtoAtual = produtos[product] || {};
            const image = produtoAtual.images && produtoAtual.images[0] ? produtoAtual.images[0] : '';
            
            // Usar o sistema de carrinho global se disponível
            if (window.carrinhoManager) {
                window.carrinhoManager.adicionarItem(product, name, price, image);
            } else {
                // Fallback para sistema antigo
                const item = carrinho.find(i => i.product === product);
                if (item) {
                    item.quantity++;
                } else {
                    carrinho.push({ product, name, price, quantity: 1, image });
                }
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                updateCartBadge();
            }
            
            // Feedback visual aprimorado
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-2"></i> Adicionado!';
            this.classList.add('btn-success');
            this.disabled = true;
            
            // Animação de pulso
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.classList.remove('btn-success');
                this.disabled = false;
            }, 2000);
        });
    }
});

