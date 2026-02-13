-- ==============================================
-- SCRIPT DE SETUP COMPLETO DO MARIADB
-- Execute este script no MariaDB com usuário root
-- ==============================================

-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Criar usuário específico
CREATE USER IF NOT EXISTS 'usetrafo_user'@'localhost' IDENTIFIED BY 'usetrafo_123_secure';

-- 3. Dar permissões ao usuário
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'localhost';

-- 4. Aplicar mudanças
FLUSH PRIVILEGES;

-- 5. Verificar criação
SELECT user, host FROM mysql.user WHERE user = 'usetrafo_user';

-- 6. Usar o banco
USE usetrafo_db;

-- FIM DO SCRIPT
-- A senha do usuário é: usetrafo_123_secure
-- Email: usetrafo_user
-- Host: localhost
