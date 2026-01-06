# 🚀 Guia de Configuração do Supabase

## Passo 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou e-mail
4. Clique em "New Project"

## Passo 2: Criar Projeto

1. **Nome do Projeto:** `usetrafo-ecommerce`
2. **Database Password:** Crie uma senha forte (anote ela!)
3. **Region:** Escolha `South America (São Paulo)` para melhor performance
4. Clique em "Create new project"
5. Aguarde 2-3 minutos para o projeto ser criado

## Passo 3: Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Você verá:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave pública)
   - **service_role key** (NUNCA exponha no frontend!)

## Passo 4: Configurar Tabela de Usuários

O Supabase já cria uma tabela `auth.users` automaticamente, mas vamos criar uma tabela adicional para dados do perfil:

1. No menu lateral, clique em **Table Editor**
2. Clique em **New Table**
3. Configure:
   - **Name:** `user_profiles`
   - **Description:** Perfis de usuários

4. Adicione as colunas:
   - `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
   - `user_id` (uuid, Foreign Key → auth.users.id, Unique)
   - `nome` (text)
   - `telefone` (text, nullable)
   - `data_cadastro` (timestamptz, Default: `now()`)
   - `updated_at` (timestamptz, Default: `now()`)

5. Clique em **Save**

## Passo 5: Habilitar Email Auth

1. Vá em **Authentication** → **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Templates**, você pode personalizar os e-mails (opcional)

## Passo 6: Configurar RLS (Row Level Security)

1. Vá em **Table Editor** → `user_profiles`
2. Clique em **RLS Policies**
3. Adicione políticas:

**Política 1: Usuários podem ver seu próprio perfil**
- Policy Name: `Users can view own profile`
- Allowed operation: `SELECT`
- Policy definition: `auth.uid() = user_id`

**Política 2: Usuários podem atualizar seu próprio perfil**
- Policy Name: `Users can update own profile`
- Allowed operation: `UPDATE`
- Policy definition: `auth.uid() = user_id`

**Política 3: Usuários podem inserir seu próprio perfil**
- Policy Name: `Users can insert own profile`
- Allowed operation: `INSERT`
- Policy definition: `auth.uid() = user_id`

## Passo 7: Adicionar Credenciais ao Projeto

1. Crie um arquivo `supabase-config.js` (já criado no projeto)
2. Substitua as credenciais:

```javascript
const SUPABASE_URL = 'SUA_PROJECT_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';
```

⚠️ **IMPORTANTE:** 
- NUNCA commite as credenciais no GitHub público
- Use variáveis de ambiente em produção
- O arquivo `supabase-config.js` está no `.gitignore` (se não estiver, adicione!)

## Passo 8: Testar

1. Abra o site localmente
2. Tente criar uma conta
3. Verifique no Supabase Dashboard → **Authentication** → **Users** se o usuário foi criado
4. Verifique em **Table Editor** → `user_profiles` se o perfil foi criado

## 🔒 Segurança

- ✅ Senhas são automaticamente criptografadas (bcrypt)
- ✅ Tokens JWT para autenticação
- ✅ HTTPS obrigatório
- ✅ RLS protege os dados
- ✅ Rate limiting automático

## 📊 Monitoramento

No dashboard do Supabase você pode:
- Ver usuários em **Authentication** → **Users**
- Ver logs em **Logs** → **API Logs**
- Monitorar uso em **Settings** → **Usage**

## 🆘 Problemas Comuns

**Erro: "Invalid API key"**
- Verifique se copiou a chave correta
- Certifique-se que está usando a `anon` key, não a `service_role`

**Erro: "Email already registered"**
- O e-mail já existe no sistema
- Use outro e-mail ou faça login

**Erro: "RLS policy violation"**
- Verifique se as políticas RLS estão configuradas corretamente
- Certifique-se que o usuário está autenticado

## 📚 Documentação

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript/introduction
- Auth Guide: https://supabase.com/docs/guides/auth







