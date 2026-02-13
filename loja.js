
document.addEventListener('DOMContentLoaded', async function () {
    const produtosContainer = document.getElementById('loja-produtos');
    const contadorResultados = document.getElementById('contadorResultados');

    // State for filtering
    let allProducts = [];
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let filteredProducts = [];

    // Filter State
    const filtrosAtivos = {
        category: [],
        refrigeracao: [],
        construcao: [],
        potencia: [],
        uso: [],
        busca: ''
    };

    // Helper functions for UI
    function activateBtn(btn) {
        if (!btn) return;
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-outline-primary', 'btn-outline-secondary');
    }

    function deactivateBtn(btn) {
        if (!btn) return;
        btn.classList.remove('active', 'btn-primary');
        if (btn.dataset.filterType === 'category') btn.classList.add('btn-outline-primary');
        else btn.classList.add('btn-outline-secondary');
    }

    // Check if API is available
    if (!window.api) {
        console.error('API module not loaded!');
        produtosContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar módulo da API.</div>';
        return;
    }

    // Load products
    try {
        produtosContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';

        // Carregar todos os produtos para filtragem no frontend
        allProducts = await window.api.getProdutos({ por_pagina: 1000 });

        // CORREÇÃO PARA MODO DEMO:
        // Se a API retornar vazio (seja por falha tratada no api.js ou banco vazio), 
        // lançamos erro para forçar o uso dos dados mockados no catch abaixo.
        if (!allProducts || allProducts.length === 0) {
            throw new Error('Nenhum produto retornado pela API. Ativando modo fallback.');
        }

        console.log('Produtos carregados:', allProducts.length);

        // Initialize filters and render initial state
        initializeFilters();

    } catch (error) {
        console.warn('API falhou, carregando produtos de demonstração (fallback)...', error);

        // DADOS MOCKADOS PARA MODO DEMO
        allProducts = [
            {
                id: 1,
                nome: 'Transformador a Óleo 15kVA',
                descricao: 'Transformador de distribuição imerso em óleo isolante, ideal para redes de distribuição urbana e rural.',
                preco: 3500.00,
                categoria: 'transformadores-oleo',
                imagem: 'src/imgs/transformadores a oleo1.jpeg'
            },
            {
                id: 2,
                nome: 'Transformador a Seco 75kVA',
                descricao: 'Transformador de potência a seco encapsulado em resina epóxi, alta segurança contra incêndios.',
                preco: 12500.00,
                categoria: 'transformadores-seco',
                imagem: 'src/imgs/trafos a seco1 .jpeg'
            },
            {
                id: 3,
                nome: 'Autotransformador Trifásico 5kVA',
                descricao: 'Equipamento compacto para ajuste de tensão em máquinas e equipamentos industriais.',
                preco: 1800.00,
                categoria: 'autotransformadores',
                imagem: 'src/imgs/transformadores a oleo2.jpeg'
            },
            {
                id: 4,
                nome: 'Transformador Isolador 3kVA',
                descricao: 'Garante isolação galvânica entre rede e carga, protegendo equipamentos sensíveis.',
                preco: 1200.00,
                categoria: 'transformadores-isoladores',
                imagem: 'src/imgs/transformadores a oleo3.jpeg'
            },
            {
                id: 5,
                nome: 'Transformador Pedestal 300kVA',
                descricao: 'Transformador pad-mounted para instalação ao tempo em redes subterrâneas.',
                preco: 45000.00,
                categoria: 'transformadores-pedestal',
                imagem: 'src/imgs/transformadores a oleo4.jpeg'
            },
            {
                id: 6,
                nome: 'Regulador de Tensão 10kVA',
                descricao: 'Estabiliza a tensão de saída para proteger equipamentos contra oscilações da rede.',
                preco: 4500.00,
                categoria: 'reguladores',
                imagem: 'src/imgs/transformadores a oleo5.jpeg'
            }
        ];

        console.log('Produtos mockados carregados:', allProducts.length);
        initializeFilters();

        // Remover aviso de carregamento se houver
        if (docProdutosContainer && docProdutosContainer.querySelector('.spinner-border')) {
            // Limpar apenas se ainda tiver o spinner, o renderPagination vai cuidar do resto
        }
    }

    // Helper to extract mapped attributes from a product object
    // Defined early so it can be used if needed, but functions are hoisted so it's fine.

    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            // Remove old listeners to avoid duplicates if any
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFilterClick(newBtn);
            });
        });

        // Initial apply
        applyFilters();
    }

    function handleFilterClick(btn) {
        const type = btn.dataset.filterType;
        const value = btn.dataset.filter;

        if (value === 'all') {
            filtrosAtivos[type] = [];
            // Update UI: deactivate others, activate 'all'
            document.querySelectorAll(`[data-filter-type="${type}"]`).forEach(b => {
                if (b.dataset.filter === 'all') activateBtn(b);
                else deactivateBtn(b);
            });
        } else {
            // Toggle
            const index = filtrosAtivos[type].indexOf(value);
            if (index > -1) {
                filtrosAtivos[type].splice(index, 1);
                deactivateBtn(btn);
                if (filtrosAtivos[type].length === 0) {
                    activateBtn(document.querySelector(`[data-filter-type="${type}"][data-filter="all"]`));
                }
            } else {
                if (filtrosAtivos[type].length >= 2) {
                    alert('Máximo 2 filtros por categoria');
                    return;
                }
                filtrosAtivos[type].push(value);
                activateBtn(btn);
                deactivateBtn(document.querySelector(`[data-filter-type="${type}"][data-filter="all"]`));
            }
        }
        applyFilters();
    }

    // ... (inside window.addToCart is outside, this is inside DOMContentLoaded)

    // Limpar Filtros
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', () => {
            // Reset State
            Object.keys(filtrosAtivos).forEach(key => filtrosAtivos[key] = []);

            // Reset UI Buttons
            document.querySelectorAll('.filter-btn').forEach(btn => deactivateBtn(btn));
            document.querySelectorAll('.filter-btn[data-filter="all"]').forEach(btn => activateBtn(btn));

            applyFilters();
        });
    }

    function updateFilterCounts() {
        // Count items for each filter option based on CURRENT set of products (allProducts)
        // But usually counts show how many matching items exist in TOTAL for that category, 
        // regardless of currently selected other filters (or depending on logic).
        // Let's implement static counts (total in database/loaded) for simplicity and stability first,
        // or dynamic counts based on CURRENT intersection. 
        // UX Standard: Show count of items that match that specific filter value within the current context?
        // Or just total available? The HTML implies dynamic counts (starts with '-').

        // Allow simplified counting: Total items matching this attribute
        const counters = document.querySelectorAll('.filter-count');
        counters.forEach(badge => {
            const type = badge.dataset.filterType;
            const value = badge.dataset.filter;

            let count = 0;
            if (value === 'all') {
                count = allProducts.length;
            } else {
                count = allProducts.filter(p => {
                    // Re-use logic or pre-calculate map?
                    // Using the DOM element logic is hard here because we are iterating data.
                    // We need to simulate the mapping logic.
                    const mapping = getProductMapping(p);
                    return mapping[type] === value;
                }).length;
            }
            badge.textContent = count;
        });
    }

    // Helper to extract mapped attributes from a product object
    function getProductMapping(p) {
        const searchText = (p.nome + ' ' + (p.descricao || '') + ' ' + (p.subtitulo || '')).toLowerCase();

        // Refrigeração
        let refrigeracao = 'ar-natural';
        if (p.categoria === 'transformadores-oleo' || searchText.includes('óleo') || searchText.includes('oleo')) {
            refrigeracao = 'oleo';
        } else if (p.categoria === 'transformadores-isoladores' || searchText.includes('seco')) {
            refrigeracao = 'seco';
        }

        // Construção
        let construcao = 'trifasico';
        if (searchText.includes('monofásico') || searchText.includes('monofasico')) {
            construcao = 'monofasico';
        } else if (searchText.includes('bifásico') || searchText.includes('bifasico')) {
            construcao = 'bifasico';
        }

        // Potência
        let potenciaVal = 0;
        const kvaMatch = p.nome.match(/(\d+(\.\d+)?)(\s|-)*kva/i);
        if (kvaMatch) {
            potenciaVal = parseFloat(kvaMatch[1]);
        }
        let potenciaRange = 'ate-50';
        if (potenciaVal > 150) potenciaRange = 'acima-150';
        else if (potenciaVal > 50) potenciaRange = '50-150';

        // Uso
        let uso = 'interno';
        if (p.categoria === 'transformadores-oleo' || searchText.includes('externo') || searchText.includes('ao tempo')) {
            uso = 'externo';
        }

        return {
            category: p.categoria,
            refrigeracao,
            construcao,
            potencia: potenciaRange,
            uso
        };
    }

    function applyFilters() {
        // Debug
        console.log('Aplicando filtros:', filtrosAtivos);

        filteredProducts = [];

        // We filter from 'allProducts' data source, NOT DOM elements anymore because of pagination!
        // Wait, we need to show/hide DOM elements? No, we render pagination from data.
        // My previous implementation of renderPagination hid/showed DOM elements. 
        // But if pagination only renders 12, where are the others?
        // Ah, renderProducts renders ALL products to DOM initially?
        // Line 24: renderProducts(allProducts). Yes.
        // But if we have 1000 items, rendering 1000 DOM nodes is heavy.
        // Better approach: 'filteredProducts' should be the list of DATA objects.
        // Then renderPagination creates the DOM for the current page.

        // Let's refactor 'applyFilters' to filter DATA, not DOM nodes.
        // This fixes "Nenhum produto encontrado" if DOM nodes were hidden/manipulated wrongly.

        filteredProducts = allProducts.filter(p => {
            const map = getProductMapping(p);

            // Check all active filters
            for (const [key, values] of Object.entries(filtrosAtivos)) {
                if (key === 'busca') continue; // Search implemented separately if needed
                if (values.length > 0) {
                    if (!values.includes(map[key])) return false;
                }
            }
            return true;
        });

        console.log('Produtos filtrados:', filteredProducts.length);

        // Update counter
        if (contadorResultados) contadorResultados.textContent = filteredProducts.length;

        // Update Filter Badges to reflect available options within current selection?
        // Or just static total? Let's stick to updateFilterCounts() calling static totals for now 
        // to ensure they are not 0.
        updateFilterCounts();

        // Reset to page 1 and render
        currentPage = 1;
        renderPagination();
    }

    function formatCategory(cat) {
        if (!cat) return '';
        return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    function truncateString(str, num) {
        if (str.length <= num) return str;
        // Strip HTML tags for safety if description has HTML
        const tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        const text = tmp.textContent || tmp.innerText || "";
        return text.slice(0, num) + '...';
    }

    function renderPagination() {
        const produtosContainer = document.getElementById('loja-produtos');
        produtosContainer.innerHTML = ''; // Clear current view

        if (filteredProducts.length === 0) {
            produtosContainer.innerHTML = `
                    <div class="col-12 no-results text-center py-5">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h4 class="text-muted">Nenhum produto encontrado</h4>
                        <p class="text-muted">Tente ajustar os filtros.</p>
                        <button class="btn btn-outline-primary mt-3" id="btnLimparVazio">Limpar Filtros</button>
                    </div>
                `;
            // Add listener to redundant clear button
            const btn = document.getElementById('btnLimparVazio');
            if (btn) btn.addEventListener('click', () => btnLimparFiltros.click());

            // Clear pagination controls
            const paginacaoContainer = document.getElementById('paginacaoContainer');
            if (paginacaoContainer) paginacaoContainer.innerHTML = '';
            return;
        }

        // Slice data for current page
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = filteredProducts.slice(start, end);

        // Render items for current page
        pageItems.forEach(p => {
            const map = getProductMapping(p); // Re-calc mapping for render attributes if needed

            // Construct HTML (We need to replicate the HTML template from renderProducts)
            // To avoid code duplication, we should have a 'createProductCard(p)' function.
            // For now, I'll allow duplication or refactor slightly.

            let imgSrc = p.imagem_principal || 'src/imgs/placeholder.png';
            // HTML Template
            const html = `
                <div class="col-12 col-md-6 col-lg-4 loja-item" 
                     data-category="${map.category}" 
                     data-id="${p.id}">
                    <div class="card product-card h-100">
                        <div class="position-relative overflow-hidden">
                            <a href="produto-detalhes.html?produto=${p.slug}">
                                <img src="${imgSrc}" class="card-img-top product-image-hover" alt="${p.nome}" loading="lazy">
                                <div class="product-overlay">
                                    <span class="btn btn-light btn-sm rounded-pill px-3 fw-bold">
                                        <i class="fas fa-eye me-2"></i>Ver Detalhes
                                    </span>
                                </div>
                            </a>
                            ${p.destaque ? '<span class="position-absolute top-0 end-0 bg-warning text-dark badge m-2 shadow-sm"><i class="fas fa-star me-1"></i>Destaque</span>' : ''}
                            ${p.novo ? '<span class="position-absolute top-0 start-0 bg-success text-white badge m-2 shadow-sm">Novo</span>' : ''}
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge bg-light text-primary border border-primary bg-opacity-10 rounded-pill">
                                    ${formatCategory(p.categoria)}
                                </span>
                            </div>
                            <h5 class="card-title fw-bold mb-2">
                                <a href="produto-detalhes.html?produto=${p.slug}" class="text-decoration-none text-dark stretched-link">
                                    ${p.nome}
                                </a>
                            </h5>
                            <p class="card-text text-muted small mb-3 flex-grow-1">
                                ${p.subtitulo || truncateString(p.descricao || '', 80)}
                            </p>
                            
                            <div class="product-price mb-3">
                                <div class="d-flex align-items-end">
                                    <h4 class="mb-0 fw-bold text-primary">R$ ${parseFloat(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                                    ${p.preco_antigo ? `<small class="text-muted text-decoration-line-through ms-2">R$ ${parseFloat(p.preco_antigo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>` : ''}
                                </div>
                                <div class="small text-success">
                                    <i class="fas fa-credit-card me-1"></i> 12x de R$ ${(parseFloat(p.preco) / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-add-cart position-relative z-index-10" 
                                        data-product-id="${p.id}" 
                                        data-product-name="${p.nome}"
                                        data-product-price="${p.preco}"
                                        data-product-image="${imgSrc}"
                                        onclick="addToCart(this, event)">
                                    <i class="fas fa-shopping-cart me-2"></i>Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            produtosContainer.insertAdjacentHTML('beforeend', html);
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const paginacaoContainer = document.getElementById('paginacaoContainer');
        if (!paginacaoContainer) return;

        if (totalPages <= 1) {
            paginacaoContainer.innerHTML = '';
            return;
        }

        let html = '';

        // Previous Button
        html += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `;

        // Page Numbers logic (keeps same)
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `
                        <li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next Button
        html += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Próximo">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `;

        paginacaoContainer.innerHTML = html;

        // Add Event Listeners
        paginacaoContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    renderPagination();
                    const scrollTarget = document.getElementById('filtrosContainer') || document.getElementById('loja-produtos');
                    if (scrollTarget) {
                        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    // Global addToCart wrapper
    window.addToCart = function (btn, event) {
        event.preventDefault();
        event.stopPropagation();

        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice);
        const image = btn.dataset.productImage;

        if (window.carrinhoManager) {
            window.carrinhoManager.adicionarItem(id, name, price, image);
        } else {
            console.error('CarrinhoManager not found');
        }
    };
});
