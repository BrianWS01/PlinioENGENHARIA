-- Script SQL para configurar RLS Policies no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Habilitar RLS na tabela user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Política: Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';






