# 🔍 Verificar Confirmação de Email no Supabase

## Problema Comum:
Se você criou uma conta mas não apareceu no Supabase, pode ser que a **confirmação de email** esteja habilitada.

## Como Verificar e Desabilitar (para testes):

1. **No Supabase Dashboard:**
   - Vá em **Authentication** → **Providers**
   - Clique em **Email**
   - Procure por **"Confirm email"** ou **"Enable email confirmations"**
   - **Desmarque** essa opção (apenas para testes)
   - Clique em **Save**

2. **Verificar usuários criados:**
   - Vá em **Authentication** → **Users**
   - Você deve ver os usuários criados, mesmo sem confirmar email

3. **Verificar perfis:**
   - Vá em **Table Editor** → `user_profiles`
   - Você deve ver os perfis criados

## ⚠️ Importante:
- Desabilitar confirmação de email é apenas para **desenvolvimento/testes**
- Em **produção**, sempre mantenha a confirmação de email habilitada
- Isso garante que apenas emails válidos sejam usados

## Alternativa: Verificar Email Manualmente
Se preferir manter a confirmação habilitada:
- O Supabase envia um email de confirmação
- Verifique a caixa de entrada (e spam)
- Clique no link de confirmação
- Depois disso, o usuário aparecerá como confirmado







