// Scroll suave para links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Fecha o menu mobile após clicar
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Sistema completo de carrinho
class CarrinhoManager {
    constructor() {
        this.carrinho = this.getCarrinho();
        this.init();
    }
    
    getCarrinho() {
        try {
            return JSON.parse(localStorage.getItem('carrinho')) || [];
        } catch (e) {
            return [];
        }
    }
    
    saveCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
        this.dispatchCarrinhoEvent();
    }
    
    dispatchCarrinhoEvent() {
        window.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: this.carrinho }));
    }
    
    adicionarItem(productId, name, price = 0, image = '') {
        const itemExistente = this.carrinho.find(item => item.product === productId);
        
        if (itemExistente) {
            itemExistente.quantity++;
        } else {
            this.carrinho.push({
                product: productId,
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }
        
        this.saveCarrinho();
        this.atualizarBadge();
        this.mostrarFeedback('Produto adicionado ao carrinho!', 'success');
        return true;
    }
    
    removerItem(productId) {
        this.carrinho = this.carrinho.filter(item => item.product !== productId);
        this.saveCarrinho();
        this.atualizarBadge();
        this.renderCarrinho();
        this.mostrarFeedback('Produto removido do carrinho', 'info');
    }
    
    atualizarQuantidade(productId, quantity) {
        const item = this.carrinho.find(item => item.product === productId);
        if (item) {
            if (quantity <= 0) {
                this.removerItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCarrinho();
                this.renderCarrinho();
            }
        }
    }
    
    limparCarrinho() {
        this.carrinho = [];
        this.saveCarrinho();
        this.atualizarBadge();
        this.renderCarrinho();
        this.mostrarFeedback('Carrinho limpo', 'info');
    }
    
    getTotalItens() {
        return this.carrinho.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    
    getTotalPreco() {
        return this.carrinho.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    atualizarBadge() {
        const carrinhoBadge = document.getElementById('carrinhoBadge');
        if (carrinhoBadge) {
            const total = this.getTotalItens();
            carrinhoBadge.textContent = total;
            carrinhoBadge.style.display = total > 0 ? 'flex' : 'none';
            carrinhoBadge.setAttribute('aria-label', `${total} itens no carrinho`);
        }
    }
    
    renderCarrinho() {
        const carrinhoVazio = document.getElementById('carrinhoVazio');
        const carrinhoItens = document.getElementById('carrinhoItens');
        const carrinhoLista = document.getElementById('carrinhoLista');
        const carrinhoTotal = document.getElementById('carrinhoTotal');
        const btnFinalizar = document.getElementById('btnFinalizarCompra');
        
        if (!carrinhoLista) return;
        
        if (this.carrinho.length === 0) {
            if (carrinhoVazio) carrinhoVazio.classList.remove('d-none');
            if (carrinhoItens) carrinhoItens.classList.add('d-none');
            if (btnFinalizar) btnFinalizar.classList.add('d-none');
            return;
        }
        
        if (carrinhoVazio) carrinhoVazio.classList.add('d-none');
        if (carrinhoItens) carrinhoItens.classList.remove('d-none');
        if (btnFinalizar) btnFinalizar.classList.remove('d-none');
        
        carrinhoLista.innerHTML = this.carrinho.map(item => `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom carrinho-item" data-product="${item.product}">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 80px; height: 80px; object-fit: cover;">` : ''}
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">R$ ${item.price.toFixed(2).replace('.', ',')} cada</small>
                    <div class="mt-2 d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="carrinhoManager.atualizarQuantidade('${item.product}', ${item.quantity - 1})" aria-label="Diminuir quantidade">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-3">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="carrinhoManager.atualizarQuantidade('${item.product}', ${item.quantity + 1})" aria-label="Aumentar quantidade">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" onclick="carrinhoManager.removerItem('${item.product}')" aria-label="Remover item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="text-end ms-3">
                    <strong>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
        `).join('');
        
        if (carrinhoTotal) {
            carrinhoTotal.textContent = `R$ ${this.getTotalPreco().toFixed(2).replace('.', ',')}`;
        }
    }
    
    mostrarFeedback(mensagem, tipo = 'success') {
        if (typeof showAlert === 'function') {
            showAlert(mensagem, tipo);
        } else {
            // Fallback simples
            const alert = document.createElement('div');
            alert.className = `alert alert-${tipo} position-fixed`;
            alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
            alert.textContent = mensagem;
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 3000);
        }
    }
    
    init() {
        const btnCarrinho = document.getElementById('btnCarrinho');
        const carrinhoModal = document.getElementById('carrinhoModal');
        
        // Atualizar badge inicial
        this.atualizarBadge();
        
        // Abrir modal ao clicar no carrinho
        if (btnCarrinho && carrinhoModal) {
            btnCarrinho.addEventListener('click', () => {
                this.renderCarrinho();
                const modal = new bootstrap.Modal(carrinhoModal);
                modal.show();
            });
        }
        
        // Renderizar carrinho quando modal abrir
        if (carrinhoModal) {
            carrinhoModal.addEventListener('show.bs.modal', () => {
                this.renderCarrinho();
            });
        }
        
        // Botão finalizar compra
        const btnFinalizar = document.getElementById('btnFinalizarCompra');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => {
                if (this.carrinho.length > 0) {
                    window.location.href = 'loja.html#contato';
                    const modal = bootstrap.Modal.getInstance(carrinhoModal);
                    if (modal) modal.hide();
                }
            });
        }
        
        // Escutar mudanças no carrinho
        window.addEventListener('carrinhoAtualizado', () => {
            this.carrinho = this.getCarrinho();
            this.atualizarBadge();
        });
        
        // Escutar mudanças no localStorage (outras abas)
        window.addEventListener('storage', (e) => {
            if (e.key === 'carrinho') {
                this.carrinho = this.getCarrinho();
                this.atualizarBadge();
                this.renderCarrinho();
            }
        });
    }
}

// Inicializar carrinho
let carrinhoManager;
document.addEventListener('DOMContentLoaded', function() {
    carrinhoManager = new CarrinhoManager();
    
    // Tornar global para uso em onclick
    window.carrinhoManager = carrinhoManager;
    
    // Adicionar botões "Adicionar ao Carrinho" nos produtos
    document.querySelectorAll('[data-product-id]').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name') || 'Produto';
            const productPrice = parseFloat(this.getAttribute('data-product-price')) || 0;
            const productImage = this.getAttribute('data-product-image') || '';
            
            carrinhoManager.adicionarItem(productId, productName, productPrice, productImage);
            
            // Feedback visual no botão
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-2"></i>Adicionado!';
            this.classList.add('btn-success');
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.classList.remove('btn-success');
                this.disabled = false;
            }, 2000);
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Torna o fundo transparente quando rola para baixo
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('shadow');
    }
    
    lastScroll = currentScroll;
    
    // Atualiza link ativo baseado na seção visível
    updateActiveNavLink();
});

// Função para destacar o link ativo baseado na seção visível
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Chama a função ao carregar a página
updateActiveNavLink();

// Scroll to top button
const scrollTopBtn = document.createElement('div');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Formulário de contato com feedback visual aprimorado
const contatoForm = document.getElementById('contatoForm');
if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!contatoForm.checkValidity()) {
            contatoForm.classList.add('was-validated');
            showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }
        
        // Simula o envio do formulário
        const btn = contatoForm.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const typingIndicator = btn.querySelector('.typing-indicator');
        
        // Feedback visual no botão
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
        if (btnText) btnText.classList.add('d-none');
        if (typingIndicator) typingIndicator.classList.remove('d-none');
        
        // Animação de loading
        btn.style.position = 'relative';
        
        // Simula delay de envio
        setTimeout(() => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            if (btnText) btnText.classList.remove('d-none');
            if (typingIndicator) typingIndicator.classList.add('d-none');
            
            // Mostra mensagem de sucesso com animação
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success', 6000);
            
            // Limpa o formulário
            contatoForm.reset();
            contatoForm.classList.remove('was-validated');
            
            // Feedback visual de sucesso no botão
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check me-2"></i>Enviado!';
            btn.classList.add('btn-success');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
            }, 2000);
        }, 2000);
    });
    
    // Feedback visual em campos do formulário
    const inputs = contatoForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value && this.checkValidity()) {
                this.parentElement.classList.add('valid');
            } else if (this.value && !this.checkValidity()) {
                this.parentElement.classList.add('invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.parentElement.classList.remove('invalid');
                this.parentElement.classList.add('valid');
            }
        });
    });
}

// Função para mostrar alertas com animação
function showAlert(message, type = 'info', duration = 5000) {
    // Remove alertas anteriores
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed custom-alert`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideInRight 0.3s ease;';
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remove o alerta após o tempo especificado
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }, duration);
}

// Adicionar animações CSS para alertas
if (!document.getElementById('alertAnimations')) {
    const style = document.createElement('style');
    style.id = 'alertAnimations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .custom-alert {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Animação de entrada dos elementos ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observa cards e seções
document.querySelectorAll('.card, section > .container > .row').forEach(el => {
    observer.observe(el);
});

// Carousel auto-play pause on hover
const carousels = document.querySelectorAll('.carousel');
carousels.forEach(carousel => {
    carousel.addEventListener('mouseenter', () => {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) {
            bsCarousel.pause();
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) {
            bsCarousel.cycle();
        }
    });
});

// Gallery modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('galleryModal');
const galleryModalImg = document.getElementById('galleryModalImg');
const galleryModalTitle = document.getElementById('galleryModalTitle');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h5').textContent;
        
        if (galleryModalImg && galleryModalTitle) {
            galleryModalImg.src = img.src;
            galleryModalImg.alt = title;
            galleryModalTitle.textContent = title;
        }
    });
});

// Lazy loading nativo do navegador - não precisa de código adicional
// O atributo loading="lazy" já é suficiente para navegadores modernos
// Navegadores antigos simplesmente carregarão as imagens normalmente

// Contador animado para a seção de anos
const animateCounter = (element, start, end, duration) => {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
};

// Anima o contador de anos quando visível
const heroYearsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.hero-years span:first-child');
            if (counter) {
                animateCounter(counter, 0, 30, 2000);
                heroYearsObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroYearsObserver.observe(heroSection);
}

// Adiciona efeito de hover nos cards de produto com feedback visual
document.querySelectorAll('.product-card, .card').forEach(card => {
    // Excluir o card do guia completo
    if (card.querySelector('#linkGuiaCompleto') || card.querySelector('a[href*="transformadores-diferenca.html"]')) {
        return; // Não adicionar listeners neste card
    }
    
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    });
    
    // Feedback ao clicar
    card.addEventListener('click', function(e) {
        // Não fazer nada se clicar em link ou botão
        if (e.target.closest('button, a')) {
            return;
        }
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Validação customizada de formulário
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});

// Máscaras para campos de formulário
const telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        
        e.target.value = value;
    });
});

// Detecta navegador e adiciona classes específicas
const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const html = document.documentElement;
    
    if (userAgent.includes('firefox')) {
        html.classList.add('firefox');
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        html.classList.add('safari');
    } else if (userAgent.includes('chrome')) {
        html.classList.add('chrome');
    } else if (userAgent.includes('edge')) {
        html.classList.add('edge');
    }
};

detectBrowser();

// Performance: Debounce para eventos de scroll e resize
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Aplica debounce ao scroll
window.addEventListener('scroll', debounce(() => {
    // Código adicional de scroll aqui se necessário
}, 100));

// Aplica debounce ao resize
window.addEventListener('resize', debounce(() => {
    // Código adicional de resize aqui se necessário
}, 250));

// Preload de imagens importantes
const preloadImages = () => {
    const imageUrls = [
        // Adicione URLs de imagens importantes aqui
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};

// Executa quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Adiciona classe 'loaded' ao body
    document.body.classList.add('loaded');
    
    // Inicializa tooltips do Bootstrap se houver
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Inicializa popovers do Bootstrap se houver
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Descomente para ativar o service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Accessibility: Adiciona suporte para navegação por teclado
document.addEventListener('keydown', (e) => {
    // ESC fecha modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
});

// Animação especial ao abrir modais de produtos
document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
    trigger.addEventListener('click', function() {
        const targetModal = document.querySelector(this.getAttribute('data-bs-target'));
        if (targetModal) {
            // Adiciona animação de entrada
            targetModal.addEventListener('shown.bs.modal', function animateModal() {
                const modalBody = this.querySelector('.modal-body');
                const modalFooter = this.querySelector('.modal-footer');
                
                if (modalBody) {
                    modalBody.style.animation = 'fadeInUp 0.5s ease';
                }
                if (modalFooter) {
                    modalFooter.style.animation = 'fadeInUp 0.6s ease';
                }
                
                // Remove o listener após executar
                targetModal.removeEventListener('shown.bs.modal', animateModal);
            });
        }
    });
});

// Rastreia abertura de modais de produtos
document.querySelectorAll('[data-bs-target^="#produto"]').forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-bs-target');
        const productName = this.closest('.card-body')?.querySelector('.card-title')?.textContent || 'Produto';
        trackEvent('Modal', 'Open', productName);
    });
});

// Rastreia cliques nos botões de compra dos modais com feedback visual
document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-footer .btn-success')) {
        const modal = e.target.closest('.modal');
        const productName = modal?.querySelector('.modal-title')?.textContent || 'Produto';
        trackEvent('Purchase Intent', 'Click Comprar', productName);
        
        const btn = e.target.closest('.btn-success');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Redirecionando...';
        btn.disabled = true;
        
        showAlert('Você será redirecionado para nossa loja em instantes!', 'success');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);
    }
    
    if (e.target.closest('.modal-footer .btn-primary')) {
        const modal = e.target.closest('.modal');
        const productName = modal?.querySelector('.modal-title')?.textContent || 'Produto';
        trackEvent('Quote Request', 'Click Orçamento', productName);
        
        const btn = e.target.closest('.btn-primary');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Solicitado!';
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('btn-success');
        }, 2000);
    }
});

// Adiciona eventos de Analytics (Google Analytics, etc)
const trackEvent = (category, action, label) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
};

// Rastreia cliques em botões importantes
document.querySelectorAll('.btn-primary, .btn-warning').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        trackEvent('Button', 'Click', text);
    });
});

// Console log para debug (remover em produção)
console.log('%c🔌 USETRAFO Website Loaded Successfully!', 'color: #0066cc; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvido com ❤️', 'color: #28a745; font-size: 14px;');

// Exporta funções úteis para uso global
window.usetrafo = {
    showAlert,
    trackEvent,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
};

// Filtros da Loja - REMOVIDO: A lógica de filtros está agora em loja.html
// Este código estava interferindo com a funcionalidade de múltiplas seleções
// document.addEventListener('DOMContentLoaded', function() {
//     const filterButtons = document.querySelectorAll('.filter-btn');
//     const lojaItems = document.querySelectorAll('.loja-item');
//
//     filterButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // Remove active de todos os botões
//             filterButtons.forEach(btn => btn.classList.remove('active'));
//             // Adiciona active no botão clicado
//             this.classList.add('active');
//
//             const filter = this.getAttribute('data-filter');
//
//             // Filtra os produtos
//             lojaItems.forEach(item => {
//                 if (filter === 'all') {
//                     item.classList.remove('hidden');
//                 } else {
//                     const category = item.getAttribute('data-category');
//                     if (category === filter) {
//                         item.classList.remove('hidden');
//                     } else {
//                         item.classList.add('hidden');
//                     }
//                 }
//             });
//         });
//     });
// });

// Sistema de Autenticação com Supabase
class AuthManager {
    constructor() {
        // Inicializar cliente Supabase se disponível
        this.supabase = null;
        if (typeof supabase !== 'undefined' && window.supabaseClient) {
            this.supabase = window.supabaseClient;
        }
        
        this.usuarioLogado = null;
        this.init();
    }
    
    async getUsuarioLogado() {
        // Se Supabase estiver disponível, usar autenticação do Supabase
        if (this.supabase) {
            try {
                const { data: { user } } = await this.supabase.auth.getUser();
                if (user) {
                    // Buscar perfil do usuário
                    const { data: profile } = await this.supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    
                    if (profile) {
                        return {
                            id: user.id,
                            email: user.email,
                            nome: profile.nome,
                            telefone: profile.telefone,
                            dataCadastro: profile.data_cadastro
                        };
                    }
                    
                    // Se não tem perfil, retornar dados básicos do auth
                    return {
                        id: user.id,
                        email: user.email,
                        nome: user.email.split('@')[0], // Nome padrão do email
                        telefone: null,
                        dataCadastro: user.created_at
                    };
                }
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        }
        
        // Fallback para localStorage (migração gradual)
        try {
            return JSON.parse(localStorage.getItem('usuarioLogado')) || null;
        } catch (e) {
            return null;
        }
    }
    
    async init() {
        this.usuarioLogado = await this.getUsuarioLogado();
        this.atualizarMenuUsuario();
        this.setupEventListeners();
        
        // Listener para mudanças de autenticação (Supabase)
        if (this.supabase) {
            this.supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    this.getUsuarioLogado().then(user => {
                        this.usuarioLogado = user;
                        this.atualizarMenuUsuario();
                    });
                } else if (event === 'SIGNED_OUT') {
                    this.usuarioLogado = null;
                    this.atualizarMenuUsuario();
                }
            });
        }
    }
    
    setupEventListeners() {
        // Formulário de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Formulário de Registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Botão de Logout
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => this.handleLogout(e));
        }
        
        // Verificar login ao tentar finalizar compra
        const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', (e) => this.verificarLoginAntesCompra(e));
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginPassword').value;
        
        // Se Supabase estiver disponível, usar autenticação do Supabase
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: email,
                    password: senha
                });
                
                if (error) {
                    this.showAlert(error.message || 'E-mail ou senha incorretos!', 'danger');
                    return;
                }
                
                if (data.user) {
                    // Buscar perfil do usuário
                    const { data: profile } = await this.supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', data.user.id)
                        .single();
                    
                    this.usuarioLogado = {
                        id: data.user.id,
                        email: data.user.email,
                        nome: profile?.nome || data.user.email.split('@')[0],
                        telefone: profile?.telefone || null,
                        dataCadastro: profile?.data_cadastro || data.user.created_at
                    };
                    
                    // Fechar modal se existir
                    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (modal) modal.hide();
                    
                    // Atualizar menu
                    this.atualizarMenuUsuario();
                    
                    // Mostrar mensagem de sucesso
                    this.showAlert('Login realizado com sucesso!', 'success');
                    
                    // Limpar formulário
                    const loginForm = document.getElementById('loginForm');
                    if (loginForm) loginForm.reset();
                    
                    // Redirecionar se houver parâmetro redirect
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    if (redirect) {
                        setTimeout(() => {
                            window.location.href = redirect;
                        }, 1500);
                    }
                }
            } catch (error) {
                console.error('Erro no login:', error);
                this.showAlert('Erro ao fazer login. Tente novamente.', 'danger');
            }
        } else {
            // Fallback para localStorage (migração gradual)
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);
            
            if (usuario) {
                const usuarioSemSenha = { ...usuario };
                delete usuarioSemSenha.senha;
                
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));
                this.usuarioLogado = usuarioSemSenha;
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                if (modal) modal.hide();
                
                this.atualizarMenuUsuario();
                this.showAlert('Login realizado com sucesso!', 'success');
                
                const loginForm = document.getElementById('loginForm');
                if (loginForm) loginForm.reset();
            } else {
                this.showAlert('E-mail ou senha incorretos!', 'danger');
            }
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const nome = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const telefone = document.getElementById('registerPhone').value;
        const senha = document.getElementById('registerPassword').value;
        const confirmSenha = document.getElementById('registerPasswordConfirm').value;
        
        // Validações
        if (senha !== confirmSenha) {
            this.showAlert('As senhas não coincidem!', 'danger');
            return;
        }
        
        if (senha.length < 6) {
            this.showAlert('A senha deve ter no mínimo 6 caracteres!', 'danger');
            return;
        }
        
        // Se Supabase estiver disponível, usar autenticação do Supabase
        if (this.supabase) {
            try {
                // Criar usuário no Supabase Auth
                const { data: authData, error: authError } = await this.supabase.auth.signUp({
                    email: email,
                    password: senha,
                    options: {
                        data: {
                            nome: nome,
                            telefone: telefone
                        }
                    }
                });
                
                if (authError) {
                    this.showAlert(authError.message || 'Erro ao criar conta. Tente novamente.', 'danger');
                    return;
                }
                
                if (authData.user) {
                    // Criar perfil do usuário na tabela user_profiles
                    const { error: profileError } = await this.supabase
                        .from('user_profiles')
                        .insert([
                            {
                                user_id: authData.user.id,
                                nome: nome,
                                telefone: telefone || null,
                                data_cadastro: new Date().toISOString()
                            }
                        ]);
                    
                    if (profileError) {
                        console.error('Erro ao criar perfil:', profileError);
                        // Continuar mesmo se der erro no perfil (pode ser criado depois)
                    }
                    
                    // Fazer login automaticamente
                    this.usuarioLogado = {
                        id: authData.user.id,
                        email: authData.user.email,
                        nome: nome,
                        telefone: telefone || null,
                        dataCadastro: new Date().toISOString()
                    };
                    
                    // Fechar modal se existir
                    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    if (modal) modal.hide();
                    
                    // Atualizar menu
                    this.atualizarMenuUsuario();
                    
                    // Mostrar mensagem de sucesso
                    this.showAlert('Conta criada com sucesso! Bem-vindo!', 'success');
                    
                    // Limpar formulário
                    const registerForm = document.getElementById('registerForm');
                    if (registerForm) registerForm.reset();
                    
                    // Redirecionar se houver parâmetro redirect
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    if (redirect) {
                        setTimeout(() => {
                            window.location.href = redirect;
                        }, 1500);
                    }
                }
            } catch (error) {
                console.error('Erro no registro:', error);
                this.showAlert('Erro ao criar conta. Tente novamente.', 'danger');
            }
        } else {
            // Fallback para localStorage (migração gradual)
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            
            if (usuarios.find(u => u.email === email)) {
                this.showAlert('Este e-mail já está cadastrado!', 'danger');
                return;
            }
            
            const novoUsuario = {
                nome,
                email,
                telefone,
                senha,
                dataCadastro: new Date().toISOString()
            };
            
            usuarios.push(novoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            const usuarioSemSenha = { ...novoUsuario };
            delete usuarioSemSenha.senha;
            
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));
            this.usuarioLogado = usuarioSemSenha;
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
            
            this.atualizarMenuUsuario();
            this.showAlert('Conta criada com sucesso! Bem-vindo!', 'success');
            
            const registerForm = document.getElementById('registerForm');
            if (registerForm) registerForm.reset();
        }
    }
    
    handleLogout(e) {
        e.preventDefault();
        
        // Criar modal de confirmação customizado
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal fade';
        confirmModal.setAttribute('tabindex', '-1');
        confirmModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-sign-out-alt me-2"></i>Confirmar Saída
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fas fa-question-circle fa-3x text-primary mb-3"></i>
                        <p class="lead">Deseja realmente sair da sua conta?</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmLogout">
                            <i class="fas fa-sign-out-alt me-2"></i>Sair
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(confirmModal);
        
        const bsModal = new bootstrap.Modal(confirmModal);
        bsModal.show();
        
        document.getElementById('confirmLogout').addEventListener('click', async () => {
            // Se Supabase estiver disponível, fazer logout no Supabase
            if (this.supabase) {
                try {
                    await this.supabase.auth.signOut();
                } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                }
            }
            
            // Limpar localStorage (fallback)
            localStorage.removeItem('usuarioLogado');
            this.usuarioLogado = null;
            this.atualizarMenuUsuario();
            this.showAlert('Logout realizado com sucesso!', 'success');
            bsModal.hide();
            
            // Remover modal do DOM
            setTimeout(() => confirmModal.remove(), 300);
            
            // Redirecionar se estiver na página de configurações
            if (window.location.pathname.includes('configuracoes.html')) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
        
        // Remover modal quando fechar sem confirmar
        confirmModal.addEventListener('hidden.bs.modal', () => {
            confirmModal.remove();
        });
    }
    
    verificarLoginAntesCompra(e) {
        if (!this.usuarioLogado) {
            e.preventDefault();
            e.stopPropagation();
            
            // Redirecionar para página de login com redirect
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            
            return false;
        }
        return true;
    }
    
    atualizarMenuUsuario() {
        const userNameDisplay = document.getElementById('userNameDisplay');
        const menuItemLogin = document.getElementById('menuItemLogin');
        const menuItemRegister = document.getElementById('menuItemRegister');
        const menuItemConfig = document.getElementById('menuItemConfig');
        const menuItemLogout = document.getElementById('menuItemLogout');
        
        if (this.usuarioLogado) {
            // Usuário logado
            if (userNameDisplay) {
                userNameDisplay.textContent = this.usuarioLogado.nome.split(' ')[0];
            }
            if (menuItemLogin) menuItemLogin.style.display = 'none';
            if (menuItemRegister) menuItemRegister.style.display = 'none';
            if (menuItemConfig) menuItemConfig.style.display = 'block';
            if (menuItemLogout) menuItemLogout.style.display = 'block';
        } else {
            // Usuário não logado
            if (userNameDisplay) {
                userNameDisplay.textContent = 'Conta';
            }
            if (menuItemLogin) menuItemLogin.style.display = 'block';
            if (menuItemRegister) menuItemRegister.style.display = 'block';
            if (menuItemConfig) menuItemConfig.style.display = 'none';
            if (menuItemLogout) menuItemLogout.style.display = 'none';
        }
    }
    
    showAlert(message, type = 'info', duration = 4000) {
        // Criar container de notificações se não existir
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Determinar ícone e título baseado no tipo
        let icon = 'fa-info-circle';
        let title = 'Informação';
        
        switch(type) {
            case 'success':
                icon = 'fa-check-circle';
                title = 'Sucesso!';
                break;
            case 'error':
            case 'danger':
                icon = 'fa-exclamation-circle';
                title = 'Erro!';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                title = 'Atenção!';
                break;
            case 'info':
            default:
                icon = 'fa-info-circle';
                title = 'Informação';
                break;
        }
        
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type} progress`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close" aria-label="Fechar">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress-bar" style="animation-duration: ${duration}ms;"></div>
        `;
        
        container.appendChild(notification);
        
        // Fechar ao clicar no botão
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Auto-fechar após duração
        setTimeout(() => {
            this.closeNotification(notification);
        }, duration);
    }
    
    closeNotification(notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    isLoggedIn() {
        return this.usuarioLogado !== null;
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});

// Ajustar navbar quando passa do hero
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const navbar = document.querySelector('.navbar');
    
    if (heroSection && navbar) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > heroBottom) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Garantir que o link do guia completo funcione corretamente
document.addEventListener('DOMContentLoaded', function() {
    // Função para navegar para a página do guia
    function navegarParaGuia(e) {
        e.stopPropagation(); // Impede que outros event listeners interceptem
        e.preventDefault(); // Previne comportamento padrão
        // Navegação direta
        window.location.href = 'transformadores-diferenca.html';
        return false;
    }
    
    // Aguardar um pouco para garantir que o DOM está totalmente carregado
    setTimeout(function() {
        // Link específico pelo ID
        const linkGuiaCompleto = document.getElementById('linkGuiaCompleto');
        if (linkGuiaCompleto) {
            // Remover qualquer listener anterior
            const novoLink = linkGuiaCompleto.cloneNode(true);
            linkGuiaCompleto.parentNode.replaceChild(novoLink, linkGuiaCompleto);
            
            // Adicionar listener com prioridade máxima
            novoLink.addEventListener('click', navegarParaGuia, true);
            novoLink.addEventListener('click', function(e) {
                e.stopImmediatePropagation();
            }, true);
        }
        
        // Todos os links para transformadores-diferenca.html
        document.querySelectorAll('a[href*="transformadores-diferenca.html"]').forEach(link => {
            link.addEventListener('click', navegarParaGuia, true);
            link.addEventListener('click', function(e) {
                e.stopImmediatePropagation();
            }, true);
        });
    }, 100);
});


