#!/usr/bin/env node

/**
 * Script de Setup Automático do MariaDB - Versão Simplificada
 * Cria usuário, banco de dados e tabelas
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log(`${colors.cyan}${colors.bold}
╔════════════════════════════════════════╗
║  SETUP AUTOMÁTICO - USETRAFO MARIADB   ║
╚════════════════════════════════════════╝
${colors.reset}`);

    try {
        // 1. Solicitar senha do root
        const rootPassword = await question(`\n${colors.yellow}Digite a senha do usuário root do MariaDB:${colors.reset} `);

        console.log(`${colors.yellow}[1/4]${colors.reset} Conectando ao MariaDB como root...`);
        
        const rootConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: rootPassword,
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });

        console.log(`${colors.green}✓${colors.reset} Conectado ao MariaDB\n`);

        // 2. Criar usuário e banco
        console.log(`${colors.yellow}[2/4]${colors.reset} Criando usuário e banco de dados...`);

        const commands = [
            "CREATE DATABASE IF NOT EXISTS usetrafo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
            "DROP USER IF EXISTS 'usetrafo_user'@'localhost'",  // Remove user anterior se existir
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
        
        // Dividir por ponto e vírgula e executar
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
                    console.error(`  Erro: ${err.message}`);
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
        console.log(`  1. Arquivo ${colors.cyan}.env${colors.reset} já foi criado automaticamente`);
        console.log(`  2. Execute: ${colors.cyan}cd backend && npm install${colors.reset} (já feito)`);
        console.log(`  3. Execute: ${colors.cyan}npm run dev${colors.reset}`);
        console.log(`  4. Teste em: ${colors.cyan}http://localhost:3000/health${colors.reset}\n`);

        rl.close();
        process.exit(0);

    } catch (error) {
        console.log(`\n${colors.red}${colors.bold}✗ ERRO DURANTE SETUP:${colors.reset}`);
        console.log(`${colors.red}${error.message}${colors.reset}\n`);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log(`${colors.yellow}Dica:${colors.reset} Verifique se a senha do root está correta.\n`);
        }
        
        rl.close();
        process.exit(1);
    }
}

// Executar
setup();
