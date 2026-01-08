# 📋 Regras de Negócio - Sistema USETRAFO

## 🎯 Visão Geral

Sistema de e-commerce para venda de transformadores elétricos com:
- Autenticação de usuários
- Catálogo de produtos
- Carrinho de compras
- Geração de orçamentos/PDFs
- Calculadora de transformadores

---

## 🔐 1. AUTENTICAÇÃO E USUÁRIOS

### 1.1. Registro de Usuário

**Regras:**
- Email deve ser único no sistema
- Senha deve ter no mínimo 6 caracteres (pode ser aumentado)
- Campos obrigatórios: `nome`, `email`, `senha`
- Campos opcionais: `telefone`, `empresa`, `cpf/cnpj`
- Ao registrar, criar perfil na tabela `user_profiles` vinculado ao `auth.users`

**Estrutura de Dados:**
```sql
-- Tabela: auth.users (gerenciada pelo Supabase)
- id (uuid, PK)
- email (text, unique)
- encrypted_password (text)
- email_confirmed_at (timestamptz)
- created_at (timestamptz)

-- Tabela: user_profiles
- id (uuid, PK)
- user_id (uuid, FK → auth.users.id, unique)
- nome (text, NOT NULL)
- telefone (text, nullable)
- empresa (text, nullable)
- cpf_cnpj (text, nullable)
- data_cadastro (timestamptz, default: now())
- updated_at (timestamptz, default: now())
```

**Validações:**
- Email válido (formato)
- Senha forte (opcional, mas recomendado)
- CPF/CNPJ válido (se fornecido)

### 1.2. Login

**Regras:**
- Autenticação via email e senha
- Retornar token JWT para sessão
- Sessão deve persistir (refresh token)
- Se login falhar, retornar erro genérico (não expor se email existe ou não)

**Fluxo:**
1. Usuário envia email + senha
2. Backend valida credenciais
3. Se válido: retorna token JWT + dados do perfil
4. Se inválido: retorna erro 401

### 1.3. Logout

**Regras:**
- Invalidar token atual
- Limpar sessão no servidor
- Retornar sucesso

### 1.4. Recuperação de Senha

**Regras:**
- Enviar email com link de recuperação
- Link válido por 24 horas
- Permitir redefinir senha com token válido

---

## 📦 2. PRODUTOS

### 2.1. Estrutura de Dados

```sql
-- Tabela: produtos
- id (uuid, PK)
- nome (text, NOT NULL)
- descricao (text, nullable)
- descricao_completa (text, nullable)
- preco (numeric(10,2), NOT NULL)
- preco_antigo (numeric(10,2), nullable) -- para mostrar desconto
- imagem_principal (text, nullable) -- URL da imagem
- imagens (jsonb, nullable) -- array de URLs
- categoria (text, NOT NULL) -- 'isolador', 'autotransformador', 'caixa', etc.
- subcategoria (text, nullable)
- especificacoes (jsonb, nullable) -- ex: {potencia: "5kVA", tensao: "220V"}
- estoque (integer, default: 0)
- estoque_minimo (integer, default: 0)
- ativo (boolean, default: true)
- destaque (boolean, default: false)
- tags (text[], nullable) -- array de tags para busca
- mercado_livre_url (text, nullable)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
```

### 2.2. Regras de Negócio

**Listagem de Produtos:**
- Retornar apenas produtos com `ativo = true`
- Ordenação padrão: `destaque DESC, nome ASC`
- Suportar filtros por: categoria, subcategoria, faixa de preço, tags
- Suportar busca por texto (nome, descrição, tags)
- Paginação: 12 produtos por página (configurável)

**Detalhes do Produto:**
- Retornar todas as informações do produto
- Incluir produtos relacionados (mesma categoria)
- Verificar estoque antes de permitir adicionar ao carrinho

**Estoque:**
- Se `estoque = 0` ou `estoque < estoque_minimo`, produto não pode ser adicionado ao carrinho
- Exibir aviso de "Produto esgotado" ou "Estoque baixo"

**Preços:**
- Preço sempre em R$ (BRL)
- Se `preco_antigo` existir, calcular desconto: `((preco_antigo - preco) / preco_antigo) * 100`

---

## 🛒 3. CARRINHO DE COMPRAS

### 3.1. Estrutura de Dados

```sql
-- Tabela: carrinho
- id (uuid, PK)
- user_id (uuid, FK → auth.users.id, NOT NULL)
- produto_id (uuid, FK → produtos.id, NOT NULL)
- quantidade (integer, NOT NULL, default: 1, check: quantidade > 0)
- preco_unitario (numeric(10,2), NOT NULL) -- preço no momento da adição
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
- UNIQUE(user_id, produto_id) -- um produto por usuário no carrinho
```

### 3.2. Regras de Negócio

**Adicionar ao Carrinho:**
- Usuário deve estar autenticado
- Produto deve estar ativo e com estoque disponível
- Se produto já estiver no carrinho, incrementar quantidade
- Salvar `preco_unitario` no momento da adição (preço pode mudar depois)
- Validar: `quantidade <= estoque_disponivel`

**Atualizar Quantidade:**
- Permitir aumentar ou diminuir quantidade
- Se quantidade = 0, remover item do carrinho
- Validar estoque antes de aumentar

**Remover do Carrinho:**
- Permitir remover item específico
- Retornar carrinho atualizado

**Listar Carrinho:**
- Retornar apenas itens do usuário autenticado
- Incluir dados completos do produto (nome, imagem, etc.)
- Calcular subtotal por item: `quantidade * preco_unitario`
- Calcular total do carrinho: `SUM(quantidade * preco_unitario)`
- Verificar se produtos ainda estão ativos e com estoque

**Limpar Carrinho:**
- Remover todos os itens do carrinho do usuário

**Sincronização:**
- Carrinho deve ser persistido no backend
- Frontend pode usar localStorage como cache, mas backend é fonte da verdade
- Ao fazer login, sincronizar carrinho do backend com frontend

---

## 📄 4. ORÇAMENTOS

### 4.1. Estrutura de Dados

```sql
-- Tabela: orcamentos
- id (uuid, PK)
- numero_orcamento (text, unique, NOT NULL) -- ex: "CP 02011"
- user_id (uuid, FK → auth.users.id, nullable) -- nullable para orçamentos não logados
- cliente_nome (text, NOT NULL)
- cliente_email (text, NOT NULL)
- cliente_telefone (text, nullable)
- cliente_empresa (text, nullable)
- cliente_cpf_cnpj (text, nullable)
- cliente_endereco (jsonb, nullable) -- {rua, cidade, cep, etc}
- condicoes_comerciais (jsonb, nullable) -- {prazo_entrega, forma_pagamento, validade, etc}
- subtotal (numeric(10,2), NOT NULL)
- desconto (numeric(10,2), default: 0)
- frete (numeric(10,2), default: 0)
- icms (numeric(10,2), default: 0)
- icms_st (numeric(10,2), default: 0)
- pis (numeric(10,2), default: 0)
- ipi (numeric(10,2), default: 0)
- cofins (numeric(10,2), default: 0)
- ibpt (numeric(10,2), default: 0)
- total (numeric(10,2), NOT NULL)
- status (text, default: 'pendente') -- 'pendente', 'enviado', 'aceito', 'recusado', 'expirado'
- pdf_url (text, nullable) -- URL do PDF gerado
- observacoes (text, nullable)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
- validade_ate (date, nullable) -- data de validade do orçamento

-- Tabela: orcamento_itens
- id (uuid, PK)
- orcamento_id (uuid, FK → orcamentos.id, NOT NULL)
- produto_id (uuid, FK → produtos.id, nullable) -- nullable para itens customizados
- nome_produto (text, NOT NULL)
- quantidade (integer, NOT NULL)
- preco_unitario (numeric(10,2), NOT NULL)
- subtotal (numeric(10,2), NOT NULL) -- quantidade * preco_unitario
- especificacoes (jsonb, nullable) -- dados técnicos do produto
- ordem (integer, default: 0) -- ordem de exibição
```

### 4.2. Regras de Negócio

**Criar Orçamento:**
- Pode ser criado por usuário logado ou não logado
- Gerar `numero_orcamento` único (formato: "CP XXXXX" ou similar)
- Calcular impostos automaticamente:
  - ICMS: `subtotal * (icms_percentual / 100)`
  - PIS: `subtotal * (pis_percentual / 100)`
  - COFINS: `subtotal * (cofins_percentual / 100)`
  - IPI: `subtotal * (ipi_percentual / 100)`
- Total: `subtotal - desconto + frete + impostos`
- Validade padrão: 30 dias a partir da criação

**Itens do Orçamento:**
- Pode vir do carrinho ou ser criado manualmente
- Cada item deve ter: nome, quantidade, preço unitário
- Calcular subtotal por item automaticamente

**Geração de PDF:**
- Endpoint para gerar PDF do orçamento
- PDF deve seguir template visual específico (ver `template-orcamento.html`)
- Salvar PDF e retornar URL para download
- PDF deve incluir: logo, dados da empresa, dados do cliente, itens, totais, condições gerais

**Listar Orçamentos:**
- Usuário logado: ver apenas seus próprios orçamentos
- Admin: ver todos os orçamentos
- Ordenar por: `created_at DESC` (mais recentes primeiro)
- Filtrar por: status, data de criação, número do orçamento

**Atualizar Status:**
- Apenas admin pode atualizar status
- Status possíveis: 'pendente', 'enviado', 'aceito', 'recusado', 'expirado'

---

## 🧮 5. CALCULADORA DE TRANSFORMADORES

### 5.1. Funcionalidades

A calculadora permite conversões entre:
- HP → kVA
- kVA → Corrente
- Corrente → kVA
- kW → kVA
- Watts → kVA

### 5.2. Regras de Negócio

**Não requer backend inicialmente**, mas pode ser útil:
- Salvar histórico de cálculos do usuário
- Sugerir produtos baseado nos cálculos
- Gerar orçamento direto a partir do cálculo

**Estrutura Opcional (para histórico):**
```sql
-- Tabela: calculos_historico
- id (uuid, PK)
- user_id (uuid, FK → auth.users.id, nullable)
- tipo_calculo (text, NOT NULL) -- 'hp-kva', 'kva-corrente', etc.
- dados_entrada (jsonb, NOT NULL) -- valores de entrada
- resultado (jsonb, NOT NULL) -- valores calculados
- created_at (timestamptz, default: now())
```

---

## 🔒 6. SEGURANÇA E PERMISSÕES

### 6.1. Row Level Security (RLS)

**Políticas necessárias:**

**user_profiles:**
- SELECT: usuário pode ver apenas seu próprio perfil
- UPDATE: usuário pode atualizar apenas seu próprio perfil
- INSERT: usuário pode criar apenas seu próprio perfil

**carrinho:**
- SELECT: usuário pode ver apenas seu próprio carrinho
- INSERT: usuário pode adicionar apenas ao seu próprio carrinho
- UPDATE: usuário pode atualizar apenas seu próprio carrinho
- DELETE: usuário pode remover apenas do seu próprio carrinho

**orcamentos:**
- SELECT: usuário pode ver apenas seus próprios orçamentos (ou todos se admin)
- INSERT: qualquer um pode criar orçamento
- UPDATE: apenas admin pode atualizar orçamentos

**produtos:**
- SELECT: público pode ler produtos ativos
- INSERT/UPDATE/DELETE: apenas admin

### 6.2. Validações

- Todos os inputs devem ser validados no backend
- Sanitizar dados de entrada
- Proteger contra SQL injection
- Rate limiting em endpoints críticos (login, registro)
- CORS configurado corretamente

---

## 📡 7. APIs NECESSÁRIAS

### 7.1. Autenticação

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
PUT  /api/auth/profile
```

### 7.2. Produtos

```
GET    /api/produtos              -- Listar produtos (com filtros e paginação)
GET    /api/produtos/:id          -- Detalhes do produto
GET    /api/produtos/categorias   -- Listar categorias
GET    /api/produtos/busca        -- Buscar produtos
```

### 7.3. Carrinho

```
GET    /api/carrinho              -- Listar carrinho do usuário
POST   /api/carrinho              -- Adicionar item ao carrinho
PUT    /api/carrinho/:itemId      -- Atualizar quantidade
DELETE /api/carrinho/:itemId     -- Remover item
DELETE /api/carrinho              -- Limpar carrinho
```

### 7.4. Orçamentos

```
GET    /api/orcamentos            -- Listar orçamentos do usuário
POST   /api/orcamentos            -- Criar orçamento
GET    /api/orcamentos/:id       -- Detalhes do orçamento
GET    /api/orcamentos/:id/pdf   -- Gerar/download PDF
PUT    /api/orcamentos/:id/status -- Atualizar status (admin)
```

---

## 📊 8. DADOS INICIAIS

### 8.1. Configurações de Impostos

Valores padrão (podem ser configuráveis):
- ICMS: 12%
- ICMS ST: 0%
- PIS: 0.65%
- IPI: 0%
- COFINS: 3%
- IBPT: 0%

### 8.2. Dados da Empresa

```
Nome: UNITRAFO
Endereço: RUA DORIVAL SPONCHIADO - LOTEAMENTO OLARIA PARQUE EMPRESARIAL
Cidade: Várzea Paulista - SP
CEP: 13225-340
Telefone: (11) 4038-4800
Email: unitrafo@unitrafo.com.br
```

---

## 🚀 9. PRIORIDADES DE IMPLEMENTAÇÃO

### Fase 1 (Essencial):
1. ✅ Autenticação (login, registro, logout)
2. ✅ CRUD de produtos
3. ✅ Carrinho de compras
4. ✅ Criação de orçamentos

### Fase 2 (Importante):
5. Geração de PDF de orçamentos
6. Histórico de orçamentos
7. Busca e filtros de produtos

### Fase 3 (Melhorias):
8. Histórico de cálculos
9. Recomendações de produtos
10. Dashboard administrativo

---

## 📝 9. OBSERVAÇÕES IMPORTANTES

1. **Frontend atual usa localStorage** - Backend deve substituir isso gradualmente
2. **Supabase já está configurado** - Pode usar ou migrar para outro backend
3. **PDFs são gerados no frontend** - Backend pode assumir essa responsabilidade
4. **Carrinho atual é stateless** - Backend deve tornar stateful
5. **Orçamentos podem ser criados sem login** - Mas é melhor ter login

---

## 🔗 10. ARQUIVOS DE REFERÊNCIA

- `script.js` - Lógica de carrinho e autenticação atual
- `gerador-orcamento.js` - Lógica de geração de PDF
- `template-orcamento.html` - Template visual do PDF
- `loja.html` - Interface de produtos e carrinho
- `SUPABASE-SETUP.md` - Configuração atual do Supabase

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0

