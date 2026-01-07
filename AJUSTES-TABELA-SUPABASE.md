# 🔧 Ajustes na Tabela user_profiles

## Correções Necessárias:

### 1. Coluna `id`
- ✅ Type: `uuid` (correto)
- ✅ Primary: marcado (correto)
- ⚠️ **Default Value:** Mude de `gen_random_` para `gen_random_uuid()`
  - Clique no campo Default Value
  - Selecione ou digite: `gen_random_uuid()`

### 2. Coluna `user_id`
- ✅ Type: `uuid` (correto)
- ⚠️ **Default Value:** Remova (deixe NULL ou vazio)
- ⚠️ **Foreign Key:** Configure:
  - Clique no ícone de engrenagem (⚙️) ao lado de `user_id`
  - Selecione "Add Foreign Key"
  - **Referenced Table:** `auth.users`
  - **Referenced Column:** `id`
  - **On Delete:** `CASCADE` (opcional, mas recomendado)
- ⚠️ **Unique:** Marque como Unique
  - Clique no ícone de engrenagem
  - Marque a opção "Unique"

### 3. Coluna `data_cadastr`
- ⚠️ **Name:** Renomeie para `data_cadastro` (completo)
- ✅ Type: `timestamptz` (correto)
- ⚠️ **Default Value:** Mude de `NULL` para `now()`
  - Clique no campo Default Value
  - Selecione ou digite: `now()`

### 4. Coluna `updated_at`
- ✅ Type: `timestamptz` (correto)
- ⚠️ **Default Value:** Mude de `NULL` para `now()`
  - Clique no campo Default Value
  - Selecione ou digite: `now()`

### 5. Colunas `nome` e `telefone`
- ✅ Estão corretas (text, nullable)

## 📋 Resumo Final das Colunas:

| Nome | Type | Default | Primary | Unique | Foreign Key |
|------|------|---------|---------|--------|-------------|
| `id` | uuid | `gen_random_uuid()` | ✅ | - | - |
| `user_id` | uuid | NULL | - | ✅ | `auth.users.id` |
| `nome` | text | NULL | - | - | - |
| `telefone` | text | NULL | - | - | - |
| `data_cadastro` | timestamptz | `now()` | - | - | - |
| `updated_at` | timestamptz | `now()` | - | - | - |

## ✅ Depois de Ajustar:

1. Clique em **Save** para salvar a tabela
2. Vá para **RLS Policies** e configure as políticas de segurança (próximo passo)







