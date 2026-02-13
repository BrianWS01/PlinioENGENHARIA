-- Execute este script no HeidiSQL para permitir conexões de outros computadores (via VPN ou Rede Local)

-- 1. Criar usuário com permissão de acesso externo (%)
CREATE USER IF NOT EXISTS 'usetrafo_user'@'%' IDENTIFIED BY 'NovaSenhaForte123';

-- 2. Conceder permissões
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'%';

-- 3. Atualizar privilégios
FLUSH PRIVILEGES;

-- 4. Verificar usuários criados
SELECT user, host FROM mysql.user WHERE user = 'usetrafo_user';
