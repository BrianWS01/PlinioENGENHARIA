
document.addEventListener('DOMContentLoaded', async function () {
    const produtosContainer = document.getElementById('loja-produtos');
    const contadorResultados = document.getElementById('contadorResultados');

    // State for filtering
    let allProducts = [];

    // Check if API is available
    if (!window.api) {
        console.error('API module not loaded!');
        produtosContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar módulo da API.</div>';
        return;
    }

    // Load products
    try {
        produtosContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';

        allProducts = await window.api.getProdutos();
        console.log('Produtos carregados:', allProducts.length);

        renderProducts(allProducts);
        initializeFilters();

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosContainer.innerHTML = '<div class="col-12 text-center text-danger"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar produtos. Tente novamente mais tarde.</div>';
    }

    function renderProducts(products) {
        produtosContainer.innerHTML = '';

        if (products.length === 0) {
            produtosContainer.innerHTML = `
                <div class="col-12 no-results text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">Nenhum produto encontrado</h4>
                    <p class="text-muted">Tente ajustar os filtros ou busca para encontrar o que procura.</p>
                </div>
            `;
            if (contadorResultados) contadorResultados.textContent = '0';
            return;
        }

        if (contadorResultados) contadorResultados.textContent = products.length;

        products.forEach(p => {
            // Determine attributes for filtering
            // Note: DB columns vs DOM data attributes
            // DB: categoria, subcategoria, imagem_principal, etc.
            // Filter logic expects: data-category, data-refrigeracao, data-construcao, data-potencia, data-uso
            // We need to map DB fields to these attributes.

            // Mapping Logic (heuristic based on existing data)
            let refrigeracao = 'oleo'; // default
            if (p.categoria === 'autotransformadores' || p.categoria === 'transformadores-isoladores') {
                refrigeracao = 'ar-natural'; // or seco?
            }

            let construcao = 'trifasico'; // default
            if (p.nome.toLowerCase().includes('monofásico')) construcao = 'monofasico';

            let potenciaVal = parseFloat(p.nome.match(/(\d+(\.\d+)?)\s*kVA/i)?.[1] || 0);
            let potenciaRange = 'ate-50';
            if (potenciaVal > 150) potenciaRange = 'acima-150';
            else if (potenciaVal > 50) potenciaRange = '50-150';

            let uso = 'interno'; // default
            if (p.categoria === 'transformadores-oleo') uso = 'externo'; // usually

            // Image path fix (if needed)
            // DB has 'src/imgs/...' relative path?
            // If backend does NOT serve static files at root, we might need adjustments.
            // But 'http-server' at root serves everything.
            let imgSrc = p.imagem_principal || 'src/imgs/placeholder.png';

            const html = `
                <div class="col-12 col-md-6 col-lg-4 loja-item" 
                     data-category="${p.categoria}" 
                     data-refrigeracao="${refrigeracao}"
                     data-construcao="${construcao}"
                     data-potencia="${potenciaRange}"
                     data-uso="${uso}"
                     data-id="${p.id}"
                     data-slug="${p.slug}">
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

    // Reuse/Adapt the filter logic from loja.html
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        // ... (We can expose filtering logic here or trigger existing one if available)
        // Since we replaced the static content, we should manually trigger the existing filter logic if it was event-based.
        // But the existing logic in loja.html (inline) runs ONCE on load. It won't see these new elements if it ran before render.
        // So we need to RE-RUN filter initialization or copy it here.
        // Copying it here is safer.

        // ... (Logic from loja.html inline script customized for this)
        // Implementation of filtering is complex to copy-paste entirely.
        // I'll implement a simplified version or rely on the fact that we can just call 'aplicarFiltros' if exposed?
        // It wasn't exposed.

        // I will implement a robust filter handler here.

        const filtrosAtivos = {
            category: [],
            refrigeracao: [],
            construcao: [],
            potencia: [],
            uso: [],
            busca: ''
        };

        filterButtons.forEach(btn => {
            // Remove old listeners to avoid duplicates if any
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFilterClick(newBtn);
            });
        });

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

        function applyFilters() {
            const items = document.querySelectorAll('.loja-item');
            let visibleCount = 0;

            items.forEach(item => {
                let show = true;

                // Check each filter category
                for (const [key, values] of Object.entries(filtrosAtivos)) {
                    if (key === 'busca') continue; // handled separately if we add search input
                    if (values.length > 0) {
                        const itemValue = item.dataset[key]; // e.g., data-category
                        if (!values.includes(itemValue)) {
                            show = false;
                            break;
                        }
                    }
                }

                if (show) {
                    item.classList.remove('d-none');
                    visibleCount++;
                } else {
                    item.classList.add('d-none');
                }
            });

            if (contadorResultados) contadorResultados.textContent = visibleCount;
        }

        // Initial apply (shows all)
        applyFilters();
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
