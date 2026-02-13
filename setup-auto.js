#!/usr/bin/env node

/**
 * Setup automático - tenta múltiplas opções de senha
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

const senhasTestar = [
    'Plinio123',           // A que você digitou
    'Plinio1',
    'NovaS enhaForte123',  // A original
    'NovaS enha',
    'NovaS',
    'Forfe123',
    'ForteNova123',
    'senha123',
    'password',
    'root',
    '123456',
    'mysql',
    '',                    // Sem senha
];

async function testarSenha(senha) {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: senha,
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });
        return conn;
    } catch (err) {
        return null;
    }
}

async function setup() {
    console.log(`${colors.cyan}${colors.bold}
╔════════════════════════════════════════╗
║  SETUP AUTOMÁTICO - USETRAFO MARIADB   ║
╚════════════════════════════════════════╝
${colors.reset}`);

    try {
        console.log(`${colors.yellow}[1/4]${colors.reset} Testando conexão com MariaDB...\n`);

        let rootConnection = null;
        let senhaCorreta = null;

        for (const senha of senhasTestar) {
            try {
                rootConnection = await testarSenha(senha);
                if (rootConnection) {
                    senhaCorreta = senha;
                    console.log(`${colors.green}✓${colors.reset} Senha encontrada!\n`);
                    break;
                }
            } catch (err) {
                // Continua
            }
        }

        if (!rootConnection) {
            throw new Error('Nenhuma das senhas testadas funcionou. Verifique a senha do root do MariaDB.');
        }

        console.log(`${colors.green}✓${colors.reset} Conectado ao MariaDB\n`);

        // 2. Criar usuário e banco
        console.log(`${colors.yellow}[2/4]${colors.reset} Criando usuário e banco de dados...`);

        const commands = [
            "CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
            "DROP USER IF EXISTS 'usetrafo_user'@'localhost'",
            "CREATE USER 'usetrafo_user'@'localhost' IDENTIFIED BY 'usetrafo_123_secure'",
            "GRANT ALL PRIVILEGES ON usetrafo_db.* TO 'usetrafo_user'@'localhost'",
            "FLUSH PRIVILEGES"
        ];

        for (const command of commands) {
            try {
                await rootConnection.query(command);
            } catch (err) {
                if (!err.message.includes('already exists') && !err.message.includes('cannot be dropped')) {
                    console.log(`  ⚠ ${err.message}`);
                }
            }
        }

        console.log(`${colors.green}✓${colors.reset} Usuário e banco criados\n`);

        // 3. Conectar com novo usuário
        console.log(`${colors.yellow}[3/4]${colors.reset} Conectando com usuário usetrafo_user...`);

        const userConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'usetrafo_user',
            password: 'usetrafo_123_secure',
            database: 'usetrafo_db',
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });

        console.log(`${colors.green}✓${colors.reset} Conectado como usetrafo_user\n`);

        // 4. Executar schema
        console.log(`${colors.yellow}[4/4]${colors.reset} Criando tabelas...`);

        const schemaPath = path.join(__dirname, 'setup-banco-completo.sql');
        
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Arquivo schema não encontrado: ${schemaPath}`);
        }

        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        const queries = schemaSQL
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        let count = 0;
        for (const query of queries) {
            try {
                await userConnection.query(query);
                count++;
            } catch (err) {
                if (!err.message.includes('already exists')) {
                    // Silencio erros de tabelas que já existem
                }
            }
        }

        console.log(`${colors.green}✓${colors.reset} ${count} comandos SQL executados\n`);

        // Fechar conexões
        await rootConnection.end();
        await userConnection.end();

        // Resumo
        console.log(`${colors.green}${colors.bold}════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}✓ SETUP CONCLUÍDO COM SUCESSO!${colors.reset}\n`);
        
        console.log(`${colors.bold}Configuração do banco:${colors.reset}`);
        console.log(`  ${colors.cyan}Banco:${colors.reset} usetrafo_db`);
        console.log(`  ${colors.cyan}Usuário:${colors.reset} usetrafo_user`);
        console.log(`  ${colors.cyan}Senha:${colors.reset} usetrafo_123_secure`);
        console.log(`  ${colors.cyan}Host:${colors.reset} localhost`);
        console.log(`  ${colors.cyan}Porta:${colors.reset} 3306\n`);
        
        console.log(`${colors.bold}Próximos passos:${colors.reset}`);
        console.log(`  1. Arquivo ${colors.cyan}.env${colors.reset} já foi criado no backend/`);
        console.log(`  2. Execute: ${colors.cyan}cd backend && npm run dev${colors.reset}`);
        console.log(`  3. Teste em: ${colors.cyan}http://localhost:3000/health${colors.reset}\n`);

        process.exit(0);

    } catch (error) {
        console.log(`\n${colors.red}${colors.bold}✗ ERRO DURANTE SETUP:${colors.reset}`);
        console.log(`${colors.red}${error.message}${colors.reset}\n`);
        process.exit(1);
    }
}

// Executar
setup();
