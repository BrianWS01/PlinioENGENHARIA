-- Script para criar usuário admin inicial no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, crie o usuário manualmente no Authentication do Supabase
--    ou use este script para inserir diretamente (não recomendado para produção)

-- NOTA: Este script é para referência. O ideal é criar o usuário
--       através da interface do Supabase Authentication.

-- 2. Depois de criar o usuário, execute este script para torná-lo admin:

-- Substitua 'USER_ID_DO_ADMIN' pelo ID real do usuário criado
-- Substitua 'admin@usetrafo.com.br' pelo email do admin
-- Substitua 'Nome do Admin' pelo nome real

INSERT INTO admin_users (user_id, nome, email, ativo) VALUES
('USER_ID_DO_ADMIN', 'Nome do Admin', 'admin@usetrafo.com.br', true)
ON CONFLICT (user_id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    ativo = EXCLUDED.ativo,
    updated_at = NOW();

-- Verificar se foi inserido
SELECT * FROM admin_users WHERE email = 'admin@usetrafo.com.br';