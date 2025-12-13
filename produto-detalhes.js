// Base de dados dos produtos
const produtos = {
    'caixa-b': {
        name: 'Caixa B',
        category: 'Caixas',
        subtitle: 'Solução robusta para aplicações industriais com máxima confiabilidade',
        images: [
            'src/imgs/B (3) 1.png',
            'src/imgs/B (4) 1.png'
        ],
        description: `
            <p>Equipamento desenvolvido para aplicações específicas com alta qualidade e confiabilidade. Projetado com materiais de primeira linha e seguindo rigorosos padrões de qualidade.</p>
            <p>Todos os equipamentos produzidos pela USETRAFO são testados em nosso laboratório individualmente, e emitido certificado de garantia com 36 meses contra defeitos de fabricação.</p>
        `,
        specs: [
            { icon: 'check-circle', color: 'success', text: 'Sistema de refrigeração: Ar Natural' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 0,6 / 1,2 kV' },
            { icon: 'check-circle', color: 'success', text: 'Frequência: 50Hz ou 60Hz' },
            { icon: 'check-circle', color: 'success', text: 'Classe de material isolante: F (155ºC)' },
            { icon: 'check-circle', color: 'success', text: 'Grau de Proteção: IP-00 / IP-21 / IP-65' },
            { icon: 'check-circle', color: 'success', text: 'Elevação de temperatura: 105ºC' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'box', label: 'Categoria', value: 'Caixas' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#'
    },
    'caixa-c': {
        name: 'Caixa C',
        category: 'Caixas',
        subtitle: 'Transformador compacto com excelente desempenho e eficiência energética',
        images: [
            'src/imgs/C (1) 1.png',
            'src/imgs/C (3) 1.png'
        ],
        description: `
            <p>Equipamento desenvolvido para aplicações específicas com alta qualidade e confiabilidade. Projetado com materiais de primeira linha e seguindo rigorosos padrões de qualidade.</p>
            <p>Nossos equipamentos possuem projeto industrial de construção com matéria-prima adequada a classe F e/ou H. Núcleo de chapas de silício de grão orientado, adquirido com certificado de origem, pintura eletrostática atendendo as normas ABNT, material isolante classe F para maior segurança, fios (cobre/ alumínio) adquiridos de fabricantes que seguem as normas ISO de produção.</p>
        `,
        specs: [
            { icon: 'info-circle', color: 'info', text: 'Não proporciona separação elétrica entre os circuitos' },
            { icon: 'check-circle', color: 'success', text: 'Sistema de refrigeração: Ar Natural' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 0,6 / 1,2 kV' },
            { icon: 'check-circle', color: 'success', text: 'Frequência: 50Hz ou 60Hz' },
            { icon: 'check-circle', color: 'success', text: 'Classe de material isolante: F (155ºC)' },
            { icon: 'check-circle', color: 'success', text: 'Grau de Proteção: IP-00 / IP-21 / IP-65' },
            { icon: 'check-circle', color: 'success', text: 'Elevação de temperatura: 105ºC' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'box', label: 'Categoria', value: 'Caixas' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#'
    },
    'caixa-d': {
        name: 'Caixa D',
        category: 'Caixas',
        subtitle: 'Projetado para máxima durabilidade seguindo normas ABNT/NBR rigorosas',
        images: [
            'src/imgs/D (2) 1.png',
            'src/imgs/D (3) 1.png',
            'src/imgs/D (4) 1.png'
        ],
        description: `
            <p>Equipamento desenvolvido para aplicações específicas com alta qualidade e confiabilidade. Projetado com materiais de primeira linha e seguindo rigorosos padrões de qualidade.</p>
            <p>Todos os equipamentos produzidos pela USETRAFO são testados em nosso laboratório individualmente, e emitido certificado de garantia com 36 meses contra defeitos de fabricação.</p>
        `,
        specs: [
            { icon: 'info-circle', color: 'info', text: 'Não proporciona separação elétrica entre os circuitos' },
            { icon: 'check-circle', color: 'success', text: 'Sistema de refrigeração: Ar Natural' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 0,6 / 1,2 kV' },
            { icon: 'check-circle', color: 'success', text: 'Classe de material isolante: F (155ºC)' },
            { icon: 'certificate', color: 'warning', text: 'Normas: ABNT/NBR 5356-11 E 10295' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'box', label: 'Categoria', value: 'Caixas' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#'
    },
    'caixa-e': {
        name: 'Caixa E',
        category: 'Caixas',
        subtitle: 'Isolação elétrica completa para máxima segurança e proteção de circuitos',
        images: [
            'src/imgs/E (2) 1.png',
            'src/imgs/E (1) 1.png'
        ],
        description: `
            <p>Equipamento desenvolvido para aplicações específicas com alta qualidade e confiabilidade. Projetado com materiais de primeira linha e seguindo rigorosos padrões de qualidade.</p>
            <p>É próprio da característica deste equipamento ter isolação entre as ligações primária e secundária, proporcionando mais segurança ao circuito alimentado.</p>
            <p>Nossos equipamentos possuem projeto industrial de construção com matéria-prima adequada a classe F. Núcleo de chapas de silício de grão orientado, adquirido com certificado de origem, pintura eletrostática atendendo as normas ABNT.</p>
        `,
        specs: [
            { icon: 'shield-alt', color: 'primary', text: 'Proporciona separação elétrica entre os circuitos', bold: true },
            { icon: 'check-circle', color: 'success', text: 'Sistema de refrigeração: Ar Natural' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 0,6 / 1,2 kV' },
            { icon: 'check-circle', color: 'success', text: 'Frequência: 50Hz ou 60Hz' },
            { icon: 'check-circle', color: 'success', text: 'Grau de Proteção: IP-00 / IP-21 / IP-65' },
            { icon: 'check-circle', color: 'success', text: 'Classe de material isolante: F (155ºC)' },
            { icon: 'check-circle', color: 'success', text: 'Elevação de temperatura: 105ºC' },
            { icon: 'bolt', color: 'warning', text: 'Número de fases: 3 (sistema trifásico)' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'box', label: 'Categoria', value: 'Caixas' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#'
    },
    'caixa-f': {
        name: 'Caixa F',
        category: 'Caixas',
        subtitle: 'Sistema trifásico de alta performance com classe térmica F/H',
        images: [
            'src/imgs/F (1) 1.png',
            'src/imgs/F (3) 1.png'
        ],
        description: `
            <p>Equipamento desenvolvido para aplicações específicas com alta qualidade e confiabilidade. Projetado com materiais de primeira linha e seguindo rigorosos padrões de qualidade.</p>
            <p>Nossos equipamentos possuem projeto industrial de construção com matéria-prima adequada a classe F e/ou H. Núcleo de chapas de silício de grão orientado, adquirido com certificado de origem, pintura eletrostática atendendo as normas ABNT, material isolante classe F para maior segurança.</p>
            <p>Todos os equipamentos produzidos pela USETRAFO são testados em nosso laboratório individualmente, e emitido certificado de garantia com 36 meses contra defeitos de fabricação.</p>
        `,
        specs: [
            { icon: 'info-circle', color: 'info', text: 'Não proporciona separação elétrica entre os circuitos' },
            { icon: 'check-circle', color: 'success', text: 'Sistema de refrigeração: Ar Natural' },
            { icon: 'check-circle', color: 'success', text: 'Classe de tensão: 0,6 / 1,2 kV' },
            { icon: 'check-circle', color: 'success', text: 'Frequência: 50Hz ou 60Hz' },
            { icon: 'check-circle', color: 'success', text: 'Classe de material isolante: F (155ºC)' },
            { icon: 'check-circle', color: 'success', text: 'Grau de Proteção: IP-00 / IP-21' },
            { icon: 'check-circle', color: 'success', text: 'Elevação de temperatura: 105ºC' },
            { icon: 'bolt', color: 'warning', text: 'Número de fases: 3 (sistema trifásico)' },
            { icon: 'certificate', color: 'warning', text: 'Normas: ABNT/NBR 5356-11 E 10295' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'box', label: 'Categoria', value: 'Caixas' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'ABNT/NBR' }
        ],
        mercadoLivre: '#'
    },
    'autotransformador-c': {
        name: 'Autotransformador Linha C',
        category: 'Autotransformadores',
        subtitle: 'Adequação precisa de tensão com alta eficiência e estabilidade térmica',
        images: [
            'src/imgs/C (3) 1.png'
        ],
        description: `
            <p>Nossos autotransformadores são desenvolvidos com engenharia precisa e matéria-prima de alto padrão, seguindo as normas NBR/IEC para garantir segurança, confiabilidade e desempenho superior. Produzidos na classe térmica F, oferecem excelente estabilidade térmica e alta eficiência mesmo em operação contínua.</p>
            <p>Disponíveis de 5 kVA a 1000 kVA, nas versões monofásica, bifásica e trifásica, atendem com precisão às mais diversas necessidades de adequação de tensão e alimentação de cargas.</p>
            <p>A construção com enrolamentos em alumínio otimiza eficiência e reduz perdas, enquanto a pintura eletrostática garante durabilidade mecânica e anticorrosiva. O resultado é um equipamento robusto, confiável e com vida útil prolongada.</p>
        `,
        specs: [
            { icon: 'check-circle', color: 'success', text: 'IP00 – uso interno' },
            { icon: 'check-circle', color: 'success', text: 'IP23 – ambientes abrigados' },
            { icon: 'check-circle', color: 'success', text: 'IP54/IP65 – aplicações externas e ao tempo' },
            { icon: 'industry', color: 'info', text: 'Alimentação de ar-condicionado, motores e máquinas industriais' },
            { icon: 'cog', color: 'info', text: 'Sistemas de automação, bombas, compressoras e máquinas comerciais' },
            { icon: 'bolt', color: 'warning', text: 'Cargas que requerem adequação precisa de tensão com alto desempenho' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'exchange-alt', label: 'Categoria', value: 'Autotransformadores' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'NBR/IEC' }
        ],
        mercadoLivre: '#'
    },
    'autotransformador-d': {
        name: 'Autotransformador Linha D',
        category: 'Autotransformadores',
        subtitle: 'Excelente estabilidade térmica e alta eficiência em operação contínua',
        images: [
            'src/imgs/D (2) 1.png'
        ],
        description: `
            <p>Nossos autotransformadores são desenvolvidos com engenharia precisa e matéria-prima de alto padrão, seguindo as normas NBR/IEC para garantir segurança, confiabilidade e desempenho superior. Produzidos na classe térmica F, oferecem excelente estabilidade térmica e alta eficiência mesmo em operação contínua.</p>
            <p>Disponíveis de 5 kVA a 1000 kVA, nas versões monofásica, bifásica e trifásica, atendem com precisão às mais diversas necessidades de adequação de tensão e alimentação de cargas.</p>
            <p>A construção com enrolamentos em alumínio otimiza eficiência e reduz perdas, enquanto a pintura eletrostática garante durabilidade mecânica e anticorrosiva. O resultado é um equipamento robusto, confiável e com vida útil prolongada.</p>
        `,
        specs: [
            { icon: 'check-circle', color: 'success', text: 'IP00 – uso interno' },
            { icon: 'check-circle', color: 'success', text: 'IP23 – ambientes abrigados' },
            { icon: 'check-circle', color: 'success', text: 'IP54/IP65 – aplicações externas e ao tempo' },
            { icon: 'industry', color: 'info', text: 'Alimentação de ar-condicionado, motores e máquinas industriais' },
            { icon: 'cog', color: 'info', text: 'Sistemas de automação, bombas, compressoras e máquinas comerciais' },
            { icon: 'bolt', color: 'warning', text: 'Cargas que requerem adequação precisa de tensão com alto desempenho' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'exchange-alt', label: 'Categoria', value: 'Autotransformadores' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'NBR/IEC' }
        ],
        mercadoLivre: '#'
    },
    'transformador-isolador-d': {
        name: 'Transformador Isolador Linha D',
        category: 'Transformadores Isoladores',
        subtitle: 'Isolamento galvânico completo para proteção máxima de equipamentos sensíveis e redução de interferências',
        images: [
            'src/imgs/D (3) 1.png'
        ],
        description: `
            <p>Nossos transformadores isoladores são fabricados com engenharia de alta precisão e matéria-prima selecionada, seguindo rigorosamente as normas NBR/IEC. Projetados para oferecer isolamento galvânico completo entre primário e secundário, fornecem neutro estável, maior proteção contra surtos e aumento significativo da segurança elétrica em diversos cenários.</p>
            <p>Produzidos na classe térmica F e disponíveis em potências de 5 kVA a 1000 kVA, atendem aplicações monofásicas, bifásicas e trifásicas, garantindo operação confiável e redução de interferências elétricas (EMI/RFI).</p>
            <p>A construção com enrolamentos em alumínio, núcleo otimizado e pintura eletrostática assegura eficiência, durabilidade e baixa manutenção, oferecendo excelente desempenho térmico e vida útil prolongada.</p>
        `,
        specs: [
            { icon: 'check-circle', color: 'success', text: 'IP00 – uso interno' },
            { icon: 'check-circle', color: 'success', text: 'IP23 – aplicações abrigadas' },
            { icon: 'check-circle', color: 'success', text: 'IP54/IP65 – uso ao tempo e áreas expostas' },
            { icon: 'shield-alt', color: 'primary', text: 'Geração de neutro limpo e estável, ideal para circuitos sensíveis' },
            { icon: 'volume-down', color: 'info', text: 'Redução de ruídos elétricos e interferências' },
            { icon: 'bolt', color: 'warning', text: 'Proteção contra choques e falhas de isolamento' },
            { icon: 'chart-line', color: 'success', text: 'Melhora da qualidade de energia para equipamentos eletrônicos' },
            { icon: 'exclamation-triangle', color: 'warning', text: 'Mitigação de surtos e distúrbios provenientes da rede' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'shield-alt', label: 'Categoria', value: 'Transformadores Isoladores' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'NBR/IEC' }
        ],
        mercadoLivre: '#'
    },
    'transformador-isolador-f': {
        name: 'Transformador Isolador Linha F',
        category: 'Transformadores Isoladores',
        subtitle: 'Proteção avançada para equipamentos sensíveis com redução de ruídos',
        images: [
            'src/imgs/F (3) 1.png'
        ],
        description: `
            <p>Projetados com engenharia de alta precisão para proteger equipamentos sensíveis e reduzir ruídos. Nossos transformadores isoladores oferecem isolamento galvânico completo entre primário e secundário para máxima segurança.</p>
            <p>Fabricados com engenharia de alta precisão e matéria-prima selecionada, seguindo rigorosamente as normas NBR/IEC. Projetados para oferecer isolamento galvânico completo entre primário e secundário, fornecem neutro estável, maior proteção contra surtos e aumento significativo da segurança elétrica.</p>
        `,
        specs: [
            { icon: 'check-circle', color: 'success', text: 'IP00 – uso interno' },
            { icon: 'check-circle', color: 'success', text: 'IP23 – aplicações abrigadas' },
            { icon: 'check-circle', color: 'success', text: 'IP54/IP65 – uso ao tempo e áreas expostas' },
            { icon: 'shield-alt', color: 'primary', text: 'Geração de neutro limpo e estável' },
            { icon: 'volume-down', color: 'info', text: 'Redução de ruídos elétricos e interferências' },
            { icon: 'lightbulb', color: 'warning', text: 'Iluminação, tomadas de uso geral, equipamentos eletrônicos' },
            { icon: 'server', color: 'info', text: 'Sistemas de TI, sonorização, instrumentação' },
            { icon: 'hospital', color: 'danger', text: 'Equipamentos hospitalares, balanças, computadores' },
            { icon: 'shield-alt', color: 'primary', text: 'Garantia: 36 meses', bold: true }
        ],
        quickInfo: [
            { icon: 'shield-alt', label: 'Categoria', value: 'Transformadores Isoladores' },
            { icon: 'shield-alt', label: 'Garantia', value: '36 meses' },
            { icon: 'certificate', label: 'Certificado', value: 'NBR/IEC' }
        ],
        mercadoLivre: '#'
    }
};

// Função para obter parâmetro da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Carregar informações do produto
function loadProduct() {
    const produtoId = getUrlParameter('produto');
    
    if (!produtoId || !produtos[produtoId]) {
        // Produto não encontrado, redirecionar para loja
        window.location.href = 'loja.html';
        return;
    }
    
    const produto = produtos[produtoId];
    
    // Atualizar título da página
    document.title = `${produto.name} - USETRAFO`;
    
    // Atualizar breadcrumb (se existir)
    const breadcrumbElement = document.getElementById('breadcrumbProduct');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = produto.name;
    }
    
    // Atualizar hero section
    document.getElementById('productNameHero').textContent = produto.name;
    document.getElementById('productSubtitleHero').textContent = produto.subtitle;
    
    // Atualizar categoria
    document.getElementById('productCategory').textContent = produto.category;
    
    // Atualizar nome e subtítulo
    document.getElementById('productName').textContent = produto.name;
    document.getElementById('productSubtitle').textContent = produto.subtitle;
    
    // Atualizar imagens
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = produto.images[0];
    mainImage.alt = produto.name;
    
    // Criar thumbnails
    const thumbnailsContainer = document.getElementById('productThumbnails');
    thumbnailsContainer.innerHTML = '';
    produto.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `product-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${img}" alt="${produto.name} - Vista ${index + 1}">`;
        thumbnail.addEventListener('click', () => {
            mainImage.src = img;
            document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Atualizar descrição
    document.getElementById('productDescription').innerHTML = produto.description;
    
    // Atualizar especificações
    const specsContainer = document.getElementById('productSpecs');
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
        specsContainer.querySelector('.specs-list').appendChild(specItem);
    });
    specsContainer.innerHTML += '</div>';
    
    // Atualizar informações rápidas
    const quickInfoContainer = document.getElementById('quickInfo');
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
    
    // Atualizar botão adicionar ao carrinho
    const btnAddToCart = document.getElementById('btnAddToCart');
    btnAddToCart.setAttribute('data-product', produtoId);
    btnAddToCart.setAttribute('data-name', produto.name);
    btnAddToCart.setAttribute('data-price', '0');
    
    // Atualizar link do Mercado Livre
    document.getElementById('btnMercadoLivre').href = produto.mercadoLivre;
}

// Adicionar ao carrinho
document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    
    // Carrinho
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoBadge = document.getElementById('carrinhoBadge');
    
    function updateCartBadge() {
        const total = carrinho.reduce((sum, item) => sum + item.quantity, 0);
        carrinhoBadge.textContent = total;
    }
    
    updateCartBadge();
    
    // Botão adicionar ao carrinho
    document.getElementById('btnAddToCart').addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const image = produto.images && produto.images[0] ? produto.images[0] : '';
        
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
});

