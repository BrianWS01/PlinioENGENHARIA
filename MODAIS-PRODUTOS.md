# Guia dos Modais de Produtos - Campo Limpo Engenharia

## 📋 Visão Geral

Todos os produtos do site agora possuem modais informativos completos com botões de ação para compra e solicitação de orçamento.

## 🎯 Funcionalidades Implementadas

### ✅ Produtos com Modais

1. **Carregador para veículo elétrico ou híbrido** (`produto1Modal`)
2. **Autotransformadores para uso externo** (`produto2Modal`)
3. **Autotransformadores Trifásicos com flange** (`produto3Modal`)
4. **Transformador Isolador Trifásico para Uso Externo** (`produto4Modal`)
5. **Autotransformadores Trifásicos sem flange** (`produto5Modal`)
6. **Transformadores a Óleo** (`produto6Modal`)
7. **Transformadores Trifásicos a Seco Encapsulado** (`produto7Modal`)
8. **Transformador Isolador Trifásico** (`produto8Modal`)

### 🔘 Botões de Ação em Cada Modal

Cada modal possui 2 botões de ação:

#### 1. Botão "Comprar Agora" (Verde)
- **Cor:** Verde (#28a745)
- **Ícone:** Carrinho de compras
- **Ação:** Redireciona para a seção #loja
- **Efeito:** Animação de elevação ao hover
- **Rastreamento:** Registra evento no Analytics

#### 2. Botão "Solicitar Orçamento" (Azul)
- **Cor:** Azul primário (#0066cc)
- **Ícone:** Envelope
- **Ação:** Redireciona para a seção #contato
- **Efeito:** Animação de elevação ao hover
- **Rastreamento:** Registra evento no Analytics

## 🎨 Estrutura de um Modal

```html
<div class="modal fade" id="produtoXModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <!-- Cabeçalho Azul -->
            <div class="modal-header">
                <h5 class="modal-title">Nome do Produto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            
            <!-- Conteúdo -->
            <div class="modal-body">
                <p>Descrição detalhada...</p>
                <h6>Especificações Técnicas:</h6>
                <table class="table table-bordered">
                    <!-- Especificações -->
                </table>
            </div>
            
            <!-- Rodapé com Botões -->
            <div class="modal-footer">
                <a href="#loja" class="btn btn-success btn-lg">
                    <i class="fas fa-shopping-cart me-2"></i> Comprar Agora
                </a>
                <a href="#contato" class="btn btn-primary btn-lg">
                    <i class="fas fa-envelope me-2"></i> Solicitar Orçamento
                </a>
            </div>
        </div>
    </div>
</div>
```

## 📊 Conteúdo dos Modais

### Produto 1: Carregador EV
**Destaques:**
- Display LCD
- Cartão RFID
- Proteção Térmica
- Potência: 22 kW
- Grau de proteção IP65

### Produto 2 e 3: Autotransformadores
**Características:**
- Classe F ou H
- Refrigeração natural
- Garantia de 36 meses
- Normas ABNT

### Produto 4 e 8: Transformadores Isoladores
**Diferenciais:**
- Isolação galvânica
- Proteção de equipamentos
- Atenuação de ruídos
- Classe F (155ºC)

### Produto 5: Autotransformador sem flange
**Especificações:**
- Projeto industrial
- Material certificado
- Pintura eletrostática
- Testes individuais

### Produto 6: Transformadores a Óleo
**Características:**
- Óleo mineral isolante
- Buchas de porcelana
- Comutador de derivação
- Sistema ONAN

### Produto 7: Transformadores a Seco
**Vantagens:**
- Não inflamável
- Baixa manutenção
- Resistente à umidade
- Ecologicamente correto

## 🎭 Animações e Efeitos

### Abertura do Modal
```javascript
// Animação fadeInUp ao abrir
modalBody.style.animation = 'fadeInUp 0.5s ease';
modalFooter.style.animation = 'fadeInUp 0.6s ease';
```

### Hover nos Botões
- **Elevação:** translateY(-3px)
- **Sombra:** Aumenta ao passar o mouse
- **Transição:** Suave (0.3s)

### Estilos Especiais
```css
/* Checkmarks nas listas */
.modal-body ul li::before {
    content: '✓';
    color: #28a745;
}

/* Cabeçalhos destacados */
.modal-body h6 {
    color: #0066cc;
    text-transform: uppercase;
}

/* Rodapé com fundo */
.modal-footer {
    background: #f8f9fa;
    border-radius: 0 0 15px 15px;
}
```

## 📈 Rastreamento Analytics

Todos os modais rastreiam eventos importantes:

### Eventos Rastreados:

1. **Abertura do Modal**
   - Categoria: 'Modal'
   - Ação: 'Open'
   - Label: Nome do produto

2. **Clique em "Comprar Agora"**
   - Categoria: 'Purchase Intent'
   - Ação: 'Click Comprar'
   - Label: Nome do produto

3. **Clique em "Solicitar Orçamento"**
   - Categoria: 'Quote Request'
   - Ação: 'Click Orçamento'
   - Label: Nome do produto

## 🔧 Como Adicionar Novo Produto

### 1. Adicionar Card no Carrossel

```html
<div class="col-md-4">
    <div class="card product-card h-100">
        <div class="card-img-placeholder">
            <i class="fas fa-bolt fa-5x text-primary"></i>
        </div>
        <div class="card-body">
            <h5 class="card-title">Novo Produto</h5>
            <p class="card-text">Descrição breve...</p>
            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#produto9Modal">
                Saiba Mais
            </button>
        </div>
    </div>
</div>
```

### 2. Criar Modal Correspondente

```html
<div class="modal fade" id="produto9Modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Novo Produto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <!-- Conteúdo detalhado aqui -->
            </div>
            <div class="modal-footer">
                <a href="#loja" class="btn btn-success btn-lg" data-bs-dismiss="modal">
                    <i class="fas fa-shopping-cart me-2"></i> Comprar Agora
                </a>
                <a href="#contato" class="btn btn-primary btn-lg" data-bs-dismiss="modal">
                    <i class="fas fa-envelope me-2"></i> Solicitar Orçamento
                </a>
            </div>
        </div>
    </div>
</div>
```

## 💡 Dicas de Customização

### Alterar Cor dos Botões

```css
/* Botão Comprar - Trocar verde por outra cor */
.modal-footer .btn-success {
    background: #ff6b6b; /* Vermelho */
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.modal-footer .btn-success:hover {
    background: #ee5a52;
}
```

### Adicionar Mais Informações

```html
<div class="modal-body">
    <!-- Adicione seções como: -->
    <h6>Benefícios:</h6>
    <ul>
        <li>Benefício 1</li>
        <li>Benefício 2</li>
    </ul>
    
    <h6>Aplicações:</h6>
    <p>Texto sobre aplicações...</p>
    
    <h6>Certificações:</h6>
    <div class="d-flex gap-3">
        <img src="cert1.png" alt="Certificação 1">
        <img src="cert2.png" alt="Certificação 2">
    </div>
</div>
```

### Adicionar Galeria de Imagens

```html
<div class="modal-body">
    <div id="productCarousel" class="carousel slide mb-4">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="produto1.jpg" class="d-block w-100">
            </div>
            <div class="carousel-item">
                <img src="produto2.jpg" class="d-block w-100">
            </div>
        </div>
        <button class="carousel-control-prev" data-bs-target="#productCarousel">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" data-bs-target="#productCarousel">
            <span class="carousel-control-next-icon"></span>
        </button>
    </div>
    <!-- Resto do conteúdo -->
</div>
```

## 🔗 Integrar com E-commerce Real

### Opção 1: Shopify

```html
<a href="https://sua-loja.myshopify.com/products/codigo-produto" 
   class="btn btn-success btn-lg" 
   target="_blank">
    <i class="fas fa-shopping-cart me-2"></i> Comprar Agora
</a>
```

### Opção 2: WooCommerce

```html
<a href="https://seu-site.com/produto/slug-produto" 
   class="btn btn-success btn-lg" 
   target="_blank">
    <i class="fas fa-shopping-cart me-2"></i> Comprar Agora
</a>
```

### Opção 3: WhatsApp

```html
<a href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20comprar%20o%20NOME_PRODUTO" 
   class="btn btn-success btn-lg" 
   target="_blank">
    <i class="fab fa-whatsapp me-2"></i> Comprar via WhatsApp
</a>
```

## 📱 Responsividade

Os modais são totalmente responsivos:

- **Desktop:** Modal grande (modal-lg)
- **Tablet:** Ajuste automático
- **Mobile:** Tela cheia com scroll

### Ajustar Tamanho do Modal

```html
<!-- Pequeno -->
<div class="modal-dialog modal-sm">

<!-- Médio (padrão) -->
<div class="modal-dialog">

<!-- Grande (atual) -->
<div class="modal-dialog modal-lg">

<!-- Extra grande -->
<div class="modal-dialog modal-xl">

<!-- Tela cheia -->
<div class="modal-dialog modal-fullscreen">
```

## 🎯 Próximas Melhorias Sugeridas

- [ ] Adicionar imagens reais dos produtos nos modais
- [ ] Integrar com sistema de e-commerce real
- [ ] Adicionar vídeos demonstrativos
- [ ] Criar sistema de reviews/avaliações
- [ ] Adicionar botão "Comparar Produtos"
- [ ] Implementar wishlist
- [ ] Adicionar calculadora de especificações
- [ ] Sistema de download de catálogos PDF
- [ ] Chat online integrado nos modals
- [ ] Disponibilidade de estoque em tempo real

## ✅ Checklist de Verificação

- [x] Todos os produtos têm botão "Saiba Mais"
- [x] Todos os botões abrem modais
- [x] Todos os modais têm informações detalhadas
- [x] Todos os modais têm botão "Comprar Agora"
- [x] Todos os modais têm botão "Solicitar Orçamento"
- [x] Animações funcionando
- [x] Rastreamento Analytics configurado
- [x] Design responsivo
- [x] Acessibilidade (ESC fecha modal)

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0.0

