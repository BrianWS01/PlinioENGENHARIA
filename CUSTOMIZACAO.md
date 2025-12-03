# Guia de Customização - Campo Limpo Engenharia Website

## 📋 Índice

1. [Substituir Imagens](#substituir-imagens)
2. [Alterar Textos](#alterar-textos)
3. [Modificar Cores](#modificar-cores)
4. [Adicionar Produtos](#adicionar-produtos)
5. [Configurar Formulário](#configurar-formulário)
6. [Integrar Google Analytics](#integrar-google-analytics)
7. [Adicionar WhatsApp](#adicionar-whatsapp)
8. [SEO e Meta Tags](#seo-e-meta-tags)

---

## 🖼️ Substituir Imagens

### 1. Criar estrutura de pastas
```
seu-projeto/
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── logo-white.png
│   │   ├── hero-bg.jpg
│   │   ├── produtos/
│   │   │   ├── produto1.jpg
│   │   │   ├── produto2.jpg
│   │   │   └── ...
│   │   └── personalizados/
│   │       ├── proj1.jpg
│   │       ├── proj2.jpg
│   │       └── ...
```

### 2. Substituir no HTML

**Logo no Header:**
```html
<!-- Procure por: -->
<img src="https://via.placeholder.com/150x50/0066cc/ffffff?text=CAMPO+LIMPO" alt="Campo Limpo Engenharia">

<!-- Substitua por: -->
<img src="assets/images/logo.png" alt="Campo Limpo Engenharia">
```

**Imagem da Hero Section:**
```html
<!-- Adicione background no CSS: -->
.hero-section {
    background: linear-gradient(135deg, rgba(0,102,204,0.9) 0%, rgba(0,75,153,0.9) 100%),
                url('assets/images/hero-bg.jpg') center/cover;
}
```

**Produtos:**
```html
<!-- Procure por: -->
<div class="card-img-placeholder">
    <i class="fas fa-charging-station fa-5x text-primary"></i>
</div>

<!-- Substitua por: -->
<img src="assets/images/produtos/carregador-ev.jpg" alt="Carregador EV" class="card-img-top">
```

---

## ✏️ Alterar Textos

### Editar no index.html

**Título da Página:**
```html
<title>Campo Limpo Engenharia - Transformadores há 30 anos | Seu novo texto aqui</title>
```

**Textos das Seções:**
```html
<!-- Procure pela seção desejada e edite o conteúdo: -->
<h2>Seu Novo Título</h2>
<p>Seu novo parágrafo aqui...</p>
```

---

## 🎨 Modificar Cores

### Alterar Cores Principais no style.css

```css
:root {
    /* Cores Atuais */
    --primary-color: #0066cc;      /* Azul principal */
    --secondary-color: #ffc107;    /* Amarelo */
    --success-color: #28a745;      /* Verde */
    
    /* Exemplos de outras paletas: */
    
    /* Paleta 1 - Moderna */
    --primary-color: #6366f1;      /* Indigo */
    --secondary-color: #f59e0b;    /* Amber */
    --success-color: #10b981;      /* Emerald */
    
    /* Paleta 2 - Corporativa */
    --primary-color: #1e40af;      /* Azul escuro */
    --secondary-color: #dc2626;    /* Vermelho */
    --success-color: #059669;      /* Verde escuro */
    
    /* Paleta 3 - Tech */
    --primary-color: #0ea5e9;      /* Cyan */
    --secondary-color: #8b5cf6;    /* Violeta */
    --success-color: #22c55e;      /* Verde lima */
}
```

### Alterar Gradientes

```css
/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, #SUA-COR-1 0%, #SUA-COR-2 100%);
}

/* Campo Limpo Engenharia Solar */
.bg-gradient-solar {
    background: linear-gradient(135deg, #SUA-COR-1 0%, #SUA-COR-2 100%);
}
```

---

## 📦 Adicionar Produtos

### 1. Adicionar Card no Carrossel

```html
<!-- Copie este bloco dentro de um carousel-item: -->
<div class="col-md-4">
    <div class="card product-card h-100">
        <div class="card-img-placeholder">
            <!-- Opção 1: Ícone -->
            <i class="fas fa-bolt fa-5x text-primary"></i>
            
            <!-- Opção 2: Imagem -->
            <!-- <img src="assets/images/produtos/seu-produto.jpg" alt="Produto" class="card-img-top"> -->
        </div>
        <div class="card-body">
            <h5 class="card-title">Nome do Produto</h5>
            <p class="card-text">Descrição breve do produto aqui...</p>
            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#produtoXModal">
                Saiba Mais
            </button>
        </div>
    </div>
</div>
```

### 2. Adicionar Modal do Produto

```html
<!-- Adicione antes do fechamento do body: -->
<div class="modal fade" id="produtoXModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nome do Produto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Descrição completa do produto...</p>
                
                <h6>Especificações:</h6>
                <ul>
                    <li>Especificação 1</li>
                    <li>Especificação 2</li>
                    <li>Especificação 3</li>
                </ul>
                
                <table class="table table-bordered">
                    <tr><td>Característica 1</td></tr>
                    <tr><td>Característica 2</td></tr>
                    <tr><td>Característica 3</td></tr>
                </table>
            </div>
        </div>
    </div>
</div>
```

---

## 📧 Configurar Formulário

### Opção 1: EmailJS (Grátis)

1. **Cadastre-se em [EmailJS](https://www.emailjs.com/)**

2. **Configure o serviço de email**

3. **Adicione no script.js:**

```javascript
// Substitua a função de submit do formulário:
contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contatoForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Enviando...';
    
    // Configure com suas credenciais do EmailJS
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contatoForm, 'YOUR_PUBLIC_KEY')
        .then(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            showAlert('Mensagem enviada com sucesso!', 'success');
            contatoForm.reset();
        }, (error) => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            showAlert('Erro ao enviar mensagem. Tente novamente.', 'danger');
            console.error('Erro:', error);
        });
});
```

4. **Adicione o script do EmailJS no index.html:**

```html
<!-- Antes do fechamento do body -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY');
</script>
```

### Opção 2: Formspree (Grátis)

1. **Cadastre-se em [Formspree](https://formspree.io/)**

2. **Crie um formulário e pegue o endpoint**

3. **Modifique o form no HTML:**

```html
<form id="contatoForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="text" name="nome" class="form-control" placeholder="Nome *" required>
    <input type="email" name="email" class="form-control" placeholder="Email *" required>
    <input type="tel" name="telefone" class="form-control" placeholder="Telefone *" required>
    <input type="text" name="empresa" class="form-control" placeholder="Empresa">
    <textarea name="mensagem" class="form-control" rows="5" placeholder="Mensagem *" required></textarea>
    <button type="submit" class="btn btn-primary btn-lg">Enviar Mensagem</button>
</form>
```

### Opção 3: Backend Próprio

```javascript
contatoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contatoForm);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('https://seu-backend.com/api/contato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showAlert('Mensagem enviada com sucesso!', 'success');
            contatoForm.reset();
        } else {
            throw new Error('Erro no envio');
        }
    } catch (error) {
        showAlert('Erro ao enviar mensagem. Tente novamente.', 'danger');
        console.error(error);
    }
});
```

---

## 📊 Integrar Google Analytics

1. **Crie uma conta no [Google Analytics](https://analytics.google.com/)**

2. **Obtenha seu ID de medição (G-XXXXXXXXXX)**

3. **Adicione no `<head>` do index.html:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 💬 Adicionar WhatsApp

### Botão Flutuante

Adicione antes do fechamento do `</body>`:

```html
<!-- Botão WhatsApp -->
<a href="https://wa.me/5511999999999?text=Olá,%20vim%20do%20site%20e%20gostaria%20de%20mais%20informações" 
   class="whatsapp-float" 
   target="_blank"
   aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>
```

Adicione no `style.css`:

```css
/* WhatsApp Flutuante */
.whatsapp-float {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: #25d366;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    z-index: 999;
    transition: all 0.3s ease;
    text-decoration: none;
}

.whatsapp-float:hover {
    background: #20ba5a;
    transform: scale(1.1);
    color: white;
}

@media (max-width: 768px) {
    .whatsapp-float {
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        font-size: 25px;
    }
}
```

---

## 🔍 SEO e Meta Tags

Adicione no `<head>` do index.html:

```html
<!-- Meta Tags SEO -->
<meta name="description" content="Campo Limpo Engenharia - Transformadores de alta qualidade desde 1994. Soluções personalizadas em transformadores isoladores, autotransformadores e energia solar.">
<meta name="keywords" content="transformadores, campo limpo engenharia, transformador isolador, autotransformador, energia solar, transformadores personalizados">
<meta name="author" content="Campo Limpo Engenharia">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.campolimpoengenharia.com.br">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.campolimpoengenharia.com.br">
<meta property="og:title" content="Campo Limpo Engenharia - Transformadores há 30 anos">
<meta property="og:description" content="Transformadores de alta qualidade desde 1994. Soluções personalizadas para sua empresa.">
<meta property="og:image" content="https://www.campolimpoengenharia.com.br/assets/images/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://www.campolimpoengenharia.com.br">
<meta property="twitter:title" content="Campo Limpo Engenharia - Transformadores há 30 anos">
<meta property="twitter:description" content="Transformadores de alta qualidade desde 1994. Soluções personalizadas para sua empresa.">
<meta property="twitter:image" content="https://www.campolimpoengenharia.com.br/assets/images/twitter-image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png">
```

---

## 🚀 Deploy

### Opção 1: Netlify (Recomendado)

1. Crie uma conta no [Netlify](https://www.netlify.com/)
2. Arraste a pasta do projeto para o Netlify Drop
3. Pronto! Seu site está online

### Opção 2: Vercel

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Conecte seu repositório GitHub
3. Deploy automático a cada commit

### Opção 3: GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages nas configurações
4. Acesse em: `https://seu-usuario.github.io/seu-repositorio`

---

## 📱 Criar Favicon

Use o site [Favicon.io](https://favicon.io/) para gerar favicons a partir de:
- Texto
- Imagem
- Emoji

Baixe o pacote e coloque na pasta `assets/images/`

---

## 🎯 Checklist de Lançamento

- [ ] Substituir todas as imagens placeholder
- [ ] Revisar todos os textos
- [ ] Configurar formulário de contato
- [ ] Adicionar Google Analytics
- [ ] Adicionar botão WhatsApp
- [ ] Configurar meta tags SEO
- [ ] Adicionar favicons
- [ ] Testar em mobile
- [ ] Testar em diferentes navegadores
- [ ] Verificar links
- [ ] Otimizar imagens (usar WebP, comprimir)
- [ ] Minificar CSS e JS
- [ ] Configurar SSL (HTTPS)
- [ ] Testar velocidade (Google PageSpeed)
- [ ] Cadastrar no Google Search Console
- [ ] Criar sitemap.xml
- [ ] Configurar robots.txt

---

## 💡 Dicas Extras

### Comprimir Imagens
Use: [TinyPNG](https://tinypng.com/) ou [Squoosh](https://squoosh.app/)

### Testar Performance
Use: [Google PageSpeed Insights](https://pagespeed.web.dev/)

### Testar Responsividade
Use: [Responsively](https://responsively.app/) ou DevTools do navegador

### Validar HTML
Use: [W3C Validator](https://validator.w3.org/)

### Verificar Acessibilidade
Use: [WAVE](https://wave.webaim.org/)

---

## 📞 Suporte

Dúvidas? Entre em contato:
- Email: unitrafo@campolimpoengenharia.com.br
- Telefone: (11) 4038-4800

---

**Boa customização! 🚀**

