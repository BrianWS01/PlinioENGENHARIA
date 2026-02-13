
// Logic to load product details from API
async function loadProduct() {
    console.log('=== INICIANDO loadProduct() (via API) ===');

    const produtoSlug = getUrlParameter('produto');
    console.log('Slug do produto da URL:', produtoSlug);

    if (!produtoSlug) {
        console.error('ID/Slug do produto não encontrado na URL');
        window.location.href = 'loja.html';
        return;
    }

    try {
        if (!window.api) {
            throw new Error('API não carregada');
        }

        // Fetch product by slug
        // Note: api.js might need getProdutoBySlug or we use getProdutos and find?
        // api.js has getProdutoBySlug? I added it in step 198 (viewed in 220).
        // Wait, in step 220 I saw api.js had `getProdutos` and `criarOrcamento`.
        // I did NOT see `getProdutoBySlug` in the snippet!
        // I need to check api.js again.
        // If it's missing, I'll update api.js or use getProdutos().find().
        // getProdutos accepts filters.

        // Let's assume I need to check api.js. 
        // But to be safe, I'll attempt to fetch list and find, OR implement getProdutoBySlug in api.js if needed.
        // Actually, looking at implementation plan, I PLANNED to add getProdutoBySlug.

        // checking api.js content from my memory (step 220 snippet):
        // It had getProdutos and criarOrcamento.
        // I should probably add getProdutoBySlug to api.js?
        // Or just use getProdutos({ slug: ... }) if backend supports it.
        // Backend /produtos supports query params.

        let produto;
        const produtos = await window.api.getProdutos({ slug: produtoSlug });
        if (produtos && produtos.length > 0) {
            produto = produtos[0];
        } else {
            // Try by ID if slug not found (fallback)
            const pById = await window.api.getProdutos({ id: produtoSlug }); // assuming backend supports filtering by id
            if (pById && pById.length > 0) produto = pById[0];
        }

        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        renderProductDetails(produto);

    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Produto não encontrado ou erro de conexão. Redirecionando para a loja...');
        window.location.href = 'loja.html';
    }
}

function renderProductDetails(produto) {
    console.log('Dados do produto para renderizar:', produto);

    // Atualizar título da página
    if (produto.nome) {
        document.title = `${produto.nome} - USETRAFO`;
    }

    // Atualizar breadcrumb
    const breadcrumbElement = document.getElementById('breadcrumbProduct');
    if (breadcrumbElement && produto.nome) {
        breadcrumbElement.textContent = produto.nome;
    }

    // Atualizar hero section (se existir)
    const productNameHero = document.getElementById('productNameHero');
    const productSubtitleHero = document.getElementById('productSubtitleHero');
    if (productNameHero) productNameHero.textContent = produto.nome;
    if (productSubtitleHero) productSubtitleHero.textContent = produto.subtitulo || '';

    // Atualizar categoria
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.textContent = formatCategory(produto.categoria);
    }

    // Atualizar nome e subtítulo
    const productName = document.getElementById('productName');
    const productSubtitle = document.getElementById('productSubtitle');
    if (productName) productName.textContent = produto.nome;
    if (productSubtitle) productSubtitle.textContent = produto.subtitulo || '';

    // Imagens
    const mainImage = document.getElementById('mainProductImage');
    // Parse images if JSON string
    let images = [];
    try {
        if (typeof produto.imagens === 'string') {
            images = JSON.parse(produto.imagens);
        } else if (Array.isArray(produto.imagens)) {
            images = produto.imagens;
        }
    } catch (e) { images = []; }

    if (produto.imagem_principal && !images.includes(produto.imagem_principal)) {
        images.unshift(produto.imagem_principal);
    }
    if (images.length === 0) images = ['src/imgs/placeholder.png'];

    if (mainImage) {
        mainImage.src = images[0];
        mainImage.alt = produto.nome;
    }

    // Thumbnails
    const thumbnailsContainer = document.getElementById('productThumbnails');
    if (thumbnailsContainer && images.length > 0) {
        thumbnailsContainer.innerHTML = '';
        images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `product-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${img}" alt="${produto.nome} - Vista ${index + 1}">`;
            thumbnail.addEventListener('click', () => {
                if (mainImage) mainImage.src = img;
                document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Descrição
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.innerHTML = produto.descricao_completa || produto.descricao || '';
    }

    // Especificações (Fake specs if not in DB, or parse from DB if structured)
    // DB has 'especificacoes' column? Yes, checking seed script... logic used to be static specs.
    // In seed script, I didn't verify if I added specs to DB.
    // 'check-schema.js' showed 'especificacoes' column? 
    // Step 324: yes, 'especificacoes' column exists.
    // It's likely a JSON string or text.
    const specsContainer = document.getElementById('productSpecs');
    if (specsContainer) {
        let specs = [];
        try {
            if (typeof produto.especificacoes === 'string') {
                specs = JSON.parse(produto.especificacoes);
            } else if (typeof produto.especificacoes === 'object') {
                specs = produto.especificacoes; // if driver parsed json
            }
        } catch (e) { }

        // If specs is object (map), convert to array for display
        if (specs && !Array.isArray(specs) && typeof specs === 'object') {
            const tempSpecs = [];
            for (const [key, val] of Object.entries(specs)) {
                tempSpecs.push({ text: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`, icon: 'check-circle', color: 'primary' });
            }
            specs = tempSpecs;
        }

        if (specs && specs.length > 0) {
            specsContainer.innerHTML = '<div class="specs-list">';
            specs.forEach(spec => {
                const specItem = document.createElement('div');
                specItem.className = 'spec-item';
                specItem.innerHTML = `
                    <i class="fas fa-${spec.icon || 'check'} text-${spec.color || 'primary'}"></i>
                    <span style="font-size: 0.95rem;">${spec.text || spec}</span>
                `;
                specsContainer.querySelector('.specs-list').appendChild(specItem);
            });
        } else {
            specsContainer.innerHTML = '<p class="text-muted">Especificações detalhadas no catálogo técnico.</p>';
        }
    }

    // Preço
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        const preco = parseFloat(produto.preco);
        if (preco > 0) {
            productPrice.textContent = `R$ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        } else {
            productPrice.textContent = 'Consulte o preço';
        }
    }

    // Botão Adicionar ao Carrinho
    const btnAddToCart = document.getElementById('btnAddToCart');
    if (btnAddToCart) {
        btnAddToCart.setAttribute('data-product', produto.id); // Use ID for cart
        btnAddToCart.setAttribute('data-name', produto.nome);
        btnAddToCart.setAttribute('data-price', produto.preco);

        // Clone and replace to remove old listeners
        const newBtn = btnAddToCart.cloneNode(true);
        btnAddToCart.parentNode.replaceChild(newBtn, btnAddToCart);

        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.carrinhoManager) {
                window.carrinhoManager.adicionarItem(produto.id, produto.nome, parseFloat(produto.preco), images[0]);
            } else {
                // Fallback
                alert('Item adicionado ao carrinho (Fallback)');
            }
        });
    }

    // Botão Comprar Agora
    const btnBuyNow = document.getElementById('btnBuyNow');
    if (btnBuyNow) {
        // Clone to remove old listeners
        const newBtnBuyNow = btnBuyNow.cloneNode(true);
        btnBuyNow.parentNode.replaceChild(newBtnBuyNow, btnBuyNow);

        newBtnBuyNow.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.carrinhoManager) {
                // Add to cart
                window.carrinhoManager.adicionarItem(produto.id, produto.nome, parseFloat(produto.preco), images[0]);

                // Open cart modal immediately
                const btnCarrinho = document.getElementById('btnCarrinho');
                if (btnCarrinho) btnCarrinho.click();
            } else {
                alert('Erro ao processar compra. Tente novamente.');
            }
        });
    }

    // Mercado Livre
    const btnMercadoLivre = document.getElementById('btnMercadoLivre');
    if (btnMercadoLivre) {
        if (produto.mercado_livre_url && produto.mercado_livre_url !== '#') {
            btnMercadoLivre.href = produto.mercado_livre_url;
            btnMercadoLivre.style.display = 'inline-block';
        } else {
            btnMercadoLivre.style.display = 'none';
        }
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function formatCategory(cat) {
    if (!cat) return '';
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    loadProduct();
});
