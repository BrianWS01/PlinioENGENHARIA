# 📦 Estrutura de Produtos - USETRAFO

## 🎯 Visão Geral

Este documento descreve a estrutura completa de dados para produtos do sistema USETRAFO.

---

## 📊 Estrutura de Dados (Schema)

### Tabela: `produtos`

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | ✅ |
| `nome` | TEXT | Nome do produto | ✅ |
| `descricao` | TEXT | Descrição curta | ❌ |
| `descricao_completa` | TEXT | Descrição completa (HTML) | ❌ |
| `subtitulo` | TEXT | Subtítulo para exibição | ❌ |
| `preco` | NUMERIC(10,2) | Preço do produto | ✅ |
| `preco_antigo` | NUMERIC(10,2) | Preço anterior (desconto) | ❌ |
| `imagem_principal` | TEXT | URL da imagem principal | ❌ |
| `imagens` | JSONB | Array de URLs de imagens | ❌ |
| `categoria` | TEXT | Categoria principal | ✅ |
| `subcategoria` | TEXT | Subcategoria | ❌ |
| `slug` | TEXT | URL amigável única | ❌ |
| `especificacoes` | JSONB | Especificações técnicas | ❌ |
| `estoque` | INTEGER | Quantidade em estoque | ❌ |
| `estoque_minimo` | INTEGER | Estoque mínimo | ❌ |
| `disponivel` | BOOLEAN | Produto disponível | ❌ |
| `ativo` | BOOLEAN | Produto ativo | ❌ |
| `destaque` | BOOLEAN | Produto em destaque | ❌ |
| `novo` | BOOLEAN | Produto novo | ❌ |
| `mercado_livre_url` | TEXT | Link Mercado Livre | ❌ |
| `visualizacoes` | INTEGER | Contador de visualizações | ❌ |
| `vendas` | INTEGER | Contador de vendas | ❌ |
| `created_at` | TIMESTAMPTZ | Data de criação | ✅ |
| `updated_at` | TIMESTAMPTZ | Data de atualização | ✅ |

---

## 📋 Categorias de Produtos

### Categorias Principais:
- `transformadores-oleo` - Transformadores a Óleo (Média Tensão)
- `autotransformadores` - Autotransformadores (Baixa Tensão)
- `transformadores-isoladores` - Transformadores Isoladores (Baixa Tensão)

### Subcategorias (Opcional):
- `media-tensao` - Para transformadores a óleo
- `baixa-tensao` - Para autotransformadores e isoladores

---

## 📝 Campo `especificacoes` (JSONB)

Estrutura flexível para especificações técnicas:

```json
{
  "potencia": "45 kVA",
  "classe": "15 kV",
  "tensao_entrada": "220V",
  "tensao_saida": "380V",
  "frequencia": "50Hz ou 60Hz",
  "refrigeracao": "oleo",
  "construcao": "trifasico",
  "grau_protecao": "IP00",
  "classe_termica": "F",
  "garantia": "36 meses"
}
```

**Campos comuns:**
- `potencia` - Potência do transformador (ex: "45 kVA")
- `classe` - Classe de tensão (ex: "15 kV", "25 kV", "36 kV")
- `tensao` - Tensão (ex: "220/380 V")
- `tensao_entrada` - Tensão de entrada
- `tensao_saida` - Tensão de saída
- `frequencia` - Frequência (ex: "50Hz ou 60Hz")
- `refrigeracao` - Tipo de refrigeração (ex: "oleo", "ar-natural")
- `construcao` - Tipo de construção (ex: "trifasico", "monofasico")
- `grau_protecao` - Grau de proteção IP (ex: "IP00", "IP54")
- `classe_termica` - Classe térmica (ex: "F")
- `garantia` - Período de garantia (ex: "36 meses")

---

## 🔄 Fluxo de Trabalho Sugerido

### 1. Preparar Dados
1. Criar arquivo JSON com todos os produtos
2. Usar `produtos-template.json` como referência
3. Gerar slugs únicos para cada produto

### 2. Criar Tabela no Supabase
1. Executar `schema-produtos.sql` no SQL Editor do Supabase
2. Verificar se a tabela foi criada corretamente
3. Configurar RLS Policies conforme necessário

### 3. Importar Dados
1. Usar script de importação ou inserção manual
2. Validar dados antes de inserir
3. Verificar slugs únicos

### 4. Integrar Frontend
1. Criar API endpoints no backend
2. Atualizar `loja.html` para buscar do backend
3. Atualizar `produto-detalhes.js` para buscar do backend

---

## 📁 Arquivos Criados

1. **`schema-produtos.sql`** - Script SQL para criar tabela no Supabase
2. **`produtos-template.json`** - Template JSON de exemplo
3. **`catalogo-produtos.js`** - Gerenciador de produtos (frontend temporário)
4. **`ESTRUTURA-PRODUTOS.md`** - Esta documentação

---

## 🚀 Próximos Passos

1. ✅ Estrutura criada
2. ⏳ Adicionar produtos reais ao `catalogo-produtos.js`
3. ⏳ Criar tabela no Supabase usando `schema-produtos.sql`
4. ⏳ Criar script de importação de produtos
5. ⏳ Integrar frontend com backend

---

## 💡 Dicas

- Use slugs únicos e amigáveis para SEO
- Mantenha especificações consistentes entre produtos similares
- Use `preco_antigo` para mostrar descontos
- Configure `destaque: true` para produtos principais
- Use `novo: true` para produtos recém-adicionados
