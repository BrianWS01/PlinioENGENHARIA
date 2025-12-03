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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('shadow');
    }
    
    lastScroll = currentScroll;
});

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

// Formulário de contato
const contatoForm = document.getElementById('contatoForm');
if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simula o envio do formulário
        const btn = contatoForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Enviando...';
        
        // Simula delay de envio
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            // Mostra mensagem de sucesso
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Limpa o formulário
            contatoForm.reset();
        }, 2000);
    });
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remove o alerta após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
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

// Lazy loading para imagens
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que não suportam lazy loading nativo
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

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

// Adiciona efeito de hover nos cards de produto
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
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

// Rastreia cliques nos botões de compra dos modais
document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-footer .btn-success')) {
        const modal = e.target.closest('.modal');
        const productName = modal?.querySelector('.modal-title')?.textContent || 'Produto';
        trackEvent('Purchase Intent', 'Click Comprar', productName);
        showAlert('Você será redirecionado para nossa loja em instantes!', 'success');
    }
    
    if (e.target.closest('.modal-footer .btn-primary')) {
        const modal = e.target.closest('.modal');
        const productName = modal?.querySelector('.modal-title')?.textContent || 'Produto';
        trackEvent('Quote Request', 'Click Orçamento', productName);
        showAlert('Preencha o formulário de contato para solicitar seu orçamento!', 'info');
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
console.log('%c🔌 Campo Limpo Engenharia Website Loaded Successfully!', 'color: #0066cc; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvido com ❤️', 'color: #28a745; font-size: 14px;');

// Exporta funções úteis para uso global
window.campolimpo = {
    showAlert,
    trackEvent,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
};

