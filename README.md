# Campo Limpo Engenharia - Website Institucional

Site institucional da Campo Limpo Engenharia, empresa especializada em transformadores desde 1994.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com animações
- **Bootstrap 5.3** - Framework CSS responsivo
- **JavaScript ES6+** - Interatividade e funcionalidades
- **Font Awesome 6** - Ícones vetoriais

## 📁 Estrutura do Projeto

```
campolimpo-website/
│
├── index.html          # Página principal
├── style.css           # Estilos customizados
├── script.js           # JavaScript customizado
└── README.md           # Documentação
```

## 🎨 Seções do Site

1. **Header/Navbar** - Menu de navegação fixo e responsivo
2. **Hero Section** - Banner principal com destaque para 30 anos
3. **Sobre** - Informações sobre a empresa com modal expandido
4. **Produtos** - Carrossel de produtos com detalhes em modals
5. **Unitrafo Solar** - Seção especial sobre energia solar
6. **Transformadores Personalizados** - Galeria de projetos customizados
7. **Contato** - Formulário e informações de contato
8. **Instagram Feed** - Integração visual com redes sociais
9. **Footer** - Rodapé com links e informações

## 🎯 Funcionalidades

### JavaScript
- ✅ Scroll suave para navegação
- ✅ Navbar com efeito de scroll
- ✅ Botão "Voltar ao topo"
- ✅ Validação de formulários
- ✅ Máscaras para campos de telefone
- ✅ Animações de entrada ao scroll
- ✅ Carrossel automático com pause ao hover
- ✅ Modais interativos para produtos e galeria
- ✅ Contador animado (30 anos)
- ✅ Sistema de alertas customizado
- ✅ Lazy loading de imagens
- ✅ Debounce para performance
- ✅ Suporte a navegação por teclado

### CSS
- ✅ Design totalmente responsivo
- ✅ Animações suaves e transições
- ✅ Gradientes modernos
- ✅ Hover effects em cards e botões
- ✅ Variáveis CSS para cores
- ✅ Media queries para mobile, tablet e desktop
- ✅ Efeitos de sombra e profundidade
- ✅ Bordas arredondadas modernas

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Mobile (< 576px)
- 📱 Tablet (576px - 768px)
- 💻 Desktop (768px - 1200px)
- 🖥️ Large Desktop (> 1200px)

## 🎨 Paleta de Cores

```css
--primary-color: #0066cc     /* Azul principal */
--secondary-color: #ffc107   /* Amarelo/Dourado */
--success-color: #28a745     /* Verde (Solar) */
--dark-color: #212529        /* Cinza escuro */
--light-gray: #f8f9fa        /* Cinza claro */
```

## 🚀 Como Usar

1. **Clone ou baixe os arquivos do projeto**

2. **Abra o arquivo `index.html` no navegador**
   - Dê dois cliques no arquivo
   - Ou arraste para o navegador
   - Ou use um servidor local (recomendado)

3. **Para servidor local (opcional):**
   ```bash
   # Usando Python 3
   python -m http.server 8000
   
   # Usando Node.js
   npx http-server
   
   # Usando PHP
   php -S localhost:8000
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

## 🔧 Customização

### Alterar Cores
Edite as variáveis CSS no arquivo `style.css`:
```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #ffc107;
    /* ... outras cores */
}
```

### Alterar Imagens
Substitua os placeholders no `index.html`:
```html
<!-- De: -->
<img src="https://via.placeholder.com/..." alt="...">

<!-- Para: -->
<img src="assets/images/sua-imagem.jpg" alt="...">
```

### Adicionar Produtos
No `index.html`, copie e edite um card de produto:
```html
<div class="col-md-4">
    <div class="card product-card h-100">
        <!-- Conteúdo do card -->
    </div>
</div>
```

### Configurar Formulário
No `script.js`, altere a função de envio:
```javascript
contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Adicione sua lógica de envio aqui
    // Ex: fetch para API, EmailJS, etc.
});
```

## 📊 Performance

- ⚡ Carregamento rápido
- ⚡ Lazy loading de imagens
- ⚡ Debounce em eventos
- ⚡ Animações otimizadas
- ⚡ CSS e JS minificados (em produção)

## 🔒 Segurança

- ✅ Sanitização de inputs
- ✅ Validação de formulários
- ✅ HTTPS recomendado em produção
- ✅ Content Security Policy (CSP) recomendado

## 📝 Próximas Melhorias

- [ ] Integração real com backend/API
- [ ] Sistema de envio de e-mail
- [ ] Galeria de imagens reais dos produtos
- [ ] Blog/Notícias
- [ ] Área de clientes
- [ ] Chat online
- [ ] Multilíngue
- [ ] PWA (Progressive Web App)
- [ ] Otimização SEO avançada
- [ ] Google Analytics
- [ ] Integração com CRM

## 🐛 Suporte

Para suporte ou dúvidas:
- 📧 Email: contato@campolimpoengenharia.com.br
- 📞 Telefone: (11) 4038-4800
- 📍 Endereço: Rua Dorival Sponchiado, 549 - Várzea Paulista/SP

## 📄 Licença

© 2025 Campo Limpo Engenharia. Todos os direitos reservados.

## 👨‍💻 Desenvolvido por

Mustache

---

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2025

