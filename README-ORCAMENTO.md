# Sistema de Geração de Orçamentos - UNITRAFO

## 📋 Visão Geral

Sistema completo para geração automática de orçamentos em PDF, baseado no template original da UNITRAFO (CP 02011). O sistema replica fielmente o layout do PDF original usando HTML, CSS e JavaScript puro.

## 📁 Arquivos

### 1. `template-orcamento.html`
Template HTML/CSS que replica visualmente o PDF original. Pode ser usado para:
- Visualização prévia do orçamento
- Impressão direta
- Base para geração de PDF

**Características:**
- Layout formato A4 (210mm x 297mm)
- Estrutura fiel ao PDF original
- Classes semânticas para fácil manutenção
- Responsivo para impressão

### 2. `gerador-orcamento.js`
Classe JavaScript `GeradorOrcamento` que gera PDFs usando jsPDF.

**Funcionalidades:**
- Geração de PDF fiel ao template
- Cálculo automático de totais e impostos
- Suporte a múltiplas páginas
- Formatação de valores monetários e datas
- Condições gerais completas

### 3. Integração em `loja.html`
A função `gerarPDFOrcamento()` foi atualizada para usar o novo gerador.

## 🚀 Como Usar

### Uso Básico

```javascript
// Criar instância do gerador
const gerador = new GeradorOrcamento();

// Preparar dados
const dadosOrcamento = {
    cliente: {
        razaoSocial: 'EMPRESA EXEMPLO LTDA',
        cnpj: '12.345.678/0001-90',
        ie: '123456789',
        endereco: 'Rua Exemplo, 123',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01234-567',
        telefone: '(11) 1234-5678',
        email: 'contato@exemplo.com.br',
        contato: 'João Silva'
    },
    itens: [
        {
            product: '11146592111',
            name: 'AUTO TRANSFORMADOR TRIFASICO 45 KVA',
            price: 4500.00,
            quantity: 1,
            potencia: '45 KVA (K1)',
            tensaoEntrada: '220 VY',
            tensaoSaida: '380 VYN',
            // ... outros campos opcionais
        }
    ],
    condicoes: {
        pagamento: '2 Parcelas (30/60 Dias)',
        frete: 'Por conta do emitente CIF (Sem Descarga)',
        validade: '30', // dias
        prazoFabricacao: '3',
        desconto: 0,
        seguro: 0,
        outros: 0
    },
    proposta: {
        numero: 'CP 02011', // ou deixar vazio para gerar automaticamente
        data: new Date() // ou string 'DD/MM/YYYY'
    }
};

// Gerar PDF
const resultado = await gerador.gerarPDF(dadosOrcamento);
console.log('PDF gerado:', resultado.nomeArquivo);
```

### Uso no Template HTML

```javascript
// Carregar template
const template = document.getElementById('orcamentoContainer');

// Inicializar com dados
window.OrcamentoTemplate.inicializar(dadosOrcamento);

// Visualizar ou imprimir
window.print(); // Para imprimir
```

## 📊 Estrutura de Dados

### Cliente
```javascript
{
    razaoSocial: string,    // Obrigatório
    cnpj: string,            // Obrigatório
    ie: string,              // Opcional
    endereco: string,        // Obrigatório
    numero: string,          // Opcional
    bairro: string,          // Opcional
    cidade: string,          // Obrigatório
    uf: string,              // Obrigatório
    cep: string,             // Obrigatório
    telefone: string,        // Opcional
    email: string,           // Opcional
    contato: string          // Opcional
}
```

### Item
```javascript
{
    product: string,         // Código do produto
    name: string,            // Descrição
    price: number,           // Preço unitário
    quantity: number,        // Quantidade
    // Campos opcionais do PDF:
    ncm: string,
    potencia: string,
    classeIsolamento: string,
    classeTermica: string,
    frequencia: string,
    grauProtecao: string,
    tensaoEntrada: string,
    tensaoSaida: string,
    tipoPintura: string,
    tipoMaterial: string,
    dijuntores: boolean,
    garantia: string
}
```

### Condições
```javascript
{
    pagamento: string,       // Ex: "2 Parcelas (30/60 Dias)"
    frete: string,           // Ex: "Por conta do emitente CIF"
    validade: string,        // Número de dias (string)
    prazoFabricacao: string, // Número de dias (string)
    desconto: number,        // Valor em R$
    seguro: number,          // Valor em R$
    outros: number           // Valor em R$
}
```

## 🧮 Cálculos Automáticos

O sistema calcula automaticamente:

1. **Subtotal dos produtos**: Soma de (preço × quantidade) de todos os itens
2. **Total geral**: Subtotal - Desconto + Frete + Seguro + Outros
3. **Impostos** (percentuais configuráveis):
   - ICMS: 12,00%
   - ICMS ST: 0,00%
   - PIS: 0,65%
   - IPI: 0,00%
   - COFINS: 3,00%
   - IBPT: 0,00%

## ⚙️ Configurações

### Alterar Impostos

Edite `gerador-orcamento.js`:

```javascript
impostos: {
    icms: 12.00,
    icmsSt: 0.00,
    pis: 0.65,
    ipi: 0.00,
    cofins: 3.00,
    ibpt: 0.00
}
```

### Alterar Dados da Empresa

Edite `gerador-orcamento.js`:

```javascript
empresa: {
    nome: 'UNITRAFO',
    endereco: 'RUA DORIVAL SPONCHIADO...',
    // ...
}
```

### Alterar Vendedor Padrão

Edite `gerador-orcamento.js`:

```javascript
vendedor: {
    nome: 'Felipe Weissmann',
    email: 'felipe.vendas@unitrafo.com.br',
    telefone: '+55 11 96930-7781'
}
```

## 📝 Limitações e Alternativas

### 1. Tabelas Complexas
**Limitação**: jsPDF não suporta tabelas HTML nativas com bordas complexas.

**Alternativa**: Usamos posicionamento manual de texto, que replica visualmente as tabelas do PDF.

### 2. Logo SVG
**Limitação**: jsPDF pode ter dificuldades com SVGs complexos.

**Alternativa**: 
- Converter SVG para PNG antes de usar
- Usar canvas para renderizar SVG
- Sistema atual tenta carregar logo, mas continua sem ela se falhar

### 3. Quebras de Página
**Limitação**: Quebras automáticas podem cortar itens no meio.

**Alternativa**: Sistema verifica espaço disponível antes de adicionar novos itens e cria nova página quando necessário.

### 4. Fontes Customizadas
**Limitação**: jsPDF usa fontes limitadas por padrão.

**Alternativa**: 
- Usar fontes padrão (Arial, Helvetica, Times)
- Para fontes customizadas, usar `jsPDF` com plugins de fontes

### 5. Formatação de Texto Complexa
**Limitação**: jsPDF não suporta HTML/CSS diretamente.

**Alternativa**: Usar métodos do jsPDF (`setFont`, `setFontSize`, `text`) para replicar formatação.

## 🔧 Melhorias Futuras

1. **Suporte a múltiplos idiomas**
2. **Templates alternativos**
3. **Exportação em outros formatos** (Excel, Word)
4. **Assinatura digital**
5. **Envio automático por e-mail**
6. **Histórico de orçamentos**

## 📚 Dependências

- **jsPDF**: Biblioteca para geração de PDFs
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`

## 🐛 Troubleshooting

### PDF não gera
- Verifique se jsPDF está carregado: `console.log(window.jspdf)`
- Verifique se GeradorOrcamento está disponível: `console.log(window.GeradorOrcamento)`
- Abra o console do navegador (F12) para ver erros

### Logo não aparece
- Verifique o caminho da imagem
- Verifique se a imagem existe
- O sistema continua funcionando sem a logo

### Layout quebrado
- Verifique se os dados estão no formato correto
- Verifique se não há valores muito longos
- Ajuste espaçamentos no código se necessário

## 📄 Licença

Sistema desenvolvido para UNITRAFO. Todos os direitos reservados.

## 👨‍💻 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Formato dos dados de entrada
3. Versão do jsPDF

---

**Versão**: 1.0.0  
**Data**: 2025-01-07  
**Autor**: Sistema de Orçamentos UNITRAFO

