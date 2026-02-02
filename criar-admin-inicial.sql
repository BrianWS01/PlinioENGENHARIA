-- =====================================================
-- CRIAR USUÁRIO ADMIN INICIAL
-- =====================================================
-- IMPORTANTE: Execute este script APÓS criar o banco
-- e executar o schema-mariadb-completo.sql
-- =====================================================

USE usetrafo_db;

-- =====================================================
-- CRIAR USUÁRIO ADMIN
-- =====================================================
-- 
-- ⚠️ ATENÇÃO: A senha precisa ser hash bcrypt!
-- 
-- Para gerar o hash bcrypt, use o backend Node.js:
-- 
-- 1. Execute: npm install bcrypt
-- 2. Use o script: node gerar-hash-senha.js
-- 
-- OU execute este comando no backend:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);
-- console.log(hash);
-- 
-- =====================================================

-- Exemplo de inserção (SUBSTITUA O HASH PELO HASH REAL)
-- O hash abaixo é apenas um exemplo - você DEVE gerar um hash real no backend!

INSERT INTO usuarios (
    email, 
    senha_hash, 
    nome, 
    is_admin, 
    email_verificado,
    is_ativo
) VALUES (
    'admin@usetrafo.com.br',
    '$2b$10$SUBSTITUA_PELO_HASH_REAL_AQUI', -- ⚠️ SUBSTITUA PELO HASH BCRYPT REAL!
    'Administrador',
    TRUE,
    TRUE,
    TRUE
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

SELECT 
    id,
    email,
    nome,
    is_admin,
    email_verificado,
    is_ativo,
    created_at
FROM usuarios 
WHERE is_admin = TRUE;

-- =====================================================
-- NOTAS
-- =====================================================
-- 
-- 1. Este usuário terá acesso completo ao sistema
-- 2. Use uma senha forte na geração do hash
-- 3. NUNCA exponha o hash bcrypt ou a senha original
-- 4. Para criar mais admins, use o mesmo formato
-- 
-- =====================================================
