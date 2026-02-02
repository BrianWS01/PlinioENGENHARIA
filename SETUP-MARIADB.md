# 🐬 Setup do Banco MariaDB - USETRAFO

## 📋 Pré-requisitos

1. **MariaDB instalado** (versão 10.5 ou superior)
   - Download: https://mariadb.org/download/
   - Windows: https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.3.2&os=windows&cpu=x86_64&pkg=msi&m=enterprise
   - Linux: `sudo apt-get install mariadb-server mariadb-client`
   - macOS: `brew install mariadb`

2. **Cliente MySQL/MariaDB**
   - HeidiSQL: https://www.heidisql.com/download.php
   - MySQL Workbench: https://dev.mysql.com/downloads/workbench/
   - DBeaver: https://dbeaver.io/download/
   - phpMyAdmin: https://www.phpmyadmin.net/downloads/

## 🚀 Passo a Passo

### 1. Criar Banco de Dados

```sql
-- Conectar ao MariaDB como root
-- (geralmente usuário 'root')

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico (opcional, mas recomendado)
CREATE USER IF NOT EXISTS 'usetrafo_user'@'localhost' IDENTIFIED BY 'sua_senha_segura_aqui';

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'localhost';

-- Para acesso remoto (se necessário)
-- GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'%' IDENTIFIED BY 'sua_senha_segura_aqui';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Selecionar o banco
USE usetrafo_db;
```

### 2. Executar Schema

**Opção A: Via linha de comando (mysql)**
```bash
mysql -u usetrafo_user -p usetrafo_db < schema-mariadb-completo.sql
```

**Opção B: Via HeidiSQL ou MySQL Workbench**
1. Abra HeidiSQL ou MySQL Workbench
2. Conecte ao servidor MariaDB
3. Selecione o banco `usetrafo_db`
4. Abra o arquivo `schema-mariadb-completo.sql`
5. Execute (F9 ou Ctrl+Enter)

**Opção C: Via phpMyAdmin**
1. Acesse phpMyAdmin no navegador
2. Selecione o banco `usetrafo_db`
3. Vá na aba "SQL"
4. Cole o conteúdo do arquivo `schema-mariadb-completo.sql`
5. Clique em "Executar"

### 3. Verificar Instalação

```sql
-- Verificar tabelas criadas
SHOW TABLES;

-- Verificar estrutura de uma tabela
DESCRIBE usuarios;

-- Verificar se funções foram criadas
SHOW FUNCTION STATUS WHERE Db = 'usetrafo_db';

-- Verificar views
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

## 🔑 Criar Usuário Admin Inicial

```sql
USE usetrafo_db;

-- Inserir primeiro usuário admin
-- IMPORTANTE: A senha precisa ser hash bcrypt no backend!
-- Este é apenas um exemplo - o hash deve ser gerado no backend

INSERT INTO usuarios (
    email, 
    senha_hash, 
    nome, 
    is_admin, 
    email_verificado
) VALUES (
    'admin@usetrafo.com.br',
    '$2b$10$EXEMPLO_DE_HASH_AQUI', -- Hash bcrypt gerado no backend
    'Administrador',
    TRUE,
    TRUE
);
```

## 📦 Importar Produtos

### Opção 1: Via JSON (usando script backend)

O arquivo `produtos-import.json` pode ser importado via API ou script backend.

### Opção 2: Via SQL direto

```sql
USE usetrafo_db;

-- Exemplo de inserção manual
INSERT INTO produtos (
    id,
    nome,
    descricao,
    preco,
    categoria,
    slug,
    especificacoes,
    ativo
) VALUES (
    UUID(),
    'Transformador a Óleo 45 kVA – Classe 15 kV',
    'Transformador a óleo de média tensão 45 kVA classe 15 kV',
    10700.00,
    'transformadores-oleo',
    'transformador-oleo-45kva-classe-15kv',
    '{"potencia": "45 kVA", "classe": "15 kV", "frequencia": "60Hz"}',
    TRUE
);
```

## 🔒 Segurança

### 1. Hash de Senhas

**IMPORTANTE:** Senhas devem ser hash bcrypt no backend antes de inserir no banco!

```javascript
// Exemplo Node.js
const bcrypt = require('bcrypt');
const senhaHash = await bcrypt.hash('senha123', 10);
// Inserir $senhaHash no banco
```

### 2. Conexão Segura

Use SSL para conexões remotas:

```javascript
// Exemplo de conexão com SSL (Node.js)
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'usetrafo_db',
  user: 'usetrafo_user',
  password: 'sua_senha',
  ssl: false // Para produção, configure SSL corretamente
});
```

### 3. Backup

```bash
# Backup completo
mysqldump -u usetrafo_user -p usetrafo_db > backup_usetrafo_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u usetrafo_user -p usetrafo_db < backup_usetrafo_20260101.sql
```

## 🌐 Configurar Acesso Remoto (se necessário)

### 1. Editar arquivo my.cnf (Linux) ou my.ini (Windows)

```ini
[mysqld]
bind-address = 0.0.0.0  # Permite conexões externas
```

### 2. Criar usuário para acesso remoto

```sql
CREATE USER 'usetrafo_user'@'%' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'%';
FLUSH PRIVILEGES;
```

### 3. Abrir porta no firewall

```bash
# Linux (ufw)
sudo ufw allow 3306/tcp

# Windows Firewall
# Permitir porta 3306 nas configurações de firewall
```

**⚠️ ATENÇÃO:** Acesso remoto requer segurança adicional (SSL, firewall, etc.)

## 📊 Configurações Recomendadas

### my.cnf / my.ini (Otimizações)

```ini
[mysqld]
# Memória (ajuste conforme seu servidor)
innodb_buffer_pool_size = 256M
max_connections = 100

# Charset
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Logging
general_log = 1
general_log_file = /var/log/mariadb/mariadb.log
slow_query_log = 1
slow_query_log_file = /var/log/mariadb/slow.log

# Performance
innodb_flush_log_at_trx_commit = 2
```

## 🔗 String de Conexão

```
mysql://usetrafo_user:senha@localhost:3306/usetrafo_db
```

**Ou formato de objeto:**
```javascript
{
  host: 'localhost',
  port: 3306,
  database: 'usetrafo_db',
  user: 'usetrafo_user',
  password: 'sua_senha',
  charset: 'utf8mb4'
}
```

## 📝 Checklist de Verificação

- [ ] MariaDB instalado
- [ ] Banco `usetrafo_db` criado
- [ ] Usuário `usetrafo_user` criado com permissões
- [ ] Schema executado com sucesso
- [ ] Todas as tabelas criadas (8 tabelas)
- [ ] Funções criadas (gerar_numero_orcamento, calcular_total_carrinho, pode_adicionar_carrinho)
- [ ] Views criadas (vw_produtos_ativos, vw_carrinho_detalhado, vw_orcamentos_detalhados)
- [ ] Usuário admin inicial criado
- [ ] Backup configurado

## 🆘 Troubleshooting

### Erro: "Access denied for user"
```sql
GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'localhost';
FLUSH PRIVILEGES;
```

### Erro: "Unknown function UUID()"
Você está usando versão antiga do MariaDB. Use:
```sql
SELECT UUID(); -- Se funcionar, está ok
-- Ou use CHAR(36) e gere UUID no backend
```

### Erro: "Table already exists"
O schema já foi executado antes. Use `DROP TABLE IF EXISTS` se necessário.

### Erro: "Syntax error near DELIMITER"
DELIMITER só funciona no cliente de linha de comando. Use HeidiSQL ou MySQL Workbench.

## 📚 Próximos Passos

1. ✅ Banco criado e configurado
2. ⏳ Criar APIs backend (Node.js/PHP/Python)
3. ⏳ Conectar frontend às APIs
4. ⏳ Implementar autenticação JWT
5. ⏳ Importar produtos iniciais

## 🔗 Referências

- [MariaDB Documentation](https://mariadb.com/kb/en/documentation/)
- [HeidiSQL](https://www.heidisql.com/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Node.js mysql2](https://github.com/sidorares/node-mysql2)
- [PHP PDO MySQL](https://www.php.net/manual/en/book.pdo.php)

## ⚠️ Diferenças do PostgreSQL

- UUID: MariaDB usa `CHAR(36)` com `UUID()` ou gera no backend
- JSON: Suporte nativo desde MariaDB 10.2+
- Boolean: Usa `BOOLEAN` (armazena como TINYINT)
- Auto-update: `ON UPDATE CURRENT_TIMESTAMP` funciona automaticamente
- Full-text: Suporte nativo para busca em texto
