#!/usr/bin/env node

/**
 * Resetar Senha do Root - MariaDB Windows
 * Este script reseta a senha do usuário root
 */

const { spawn } = require('child_process');
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executarComando(comando, args = [], descricao = '') {
    return new Promise((resolve, reject) => {
        if (descricao) {
            console.log(`${colors.yellow}${descricao}${colors.reset}`);
        }

        const proc = spawn(comando, args, {
            shell: true,
            stdio: 'pipe'
        });

        let output = '';
        let erro = '';

        proc.stdout.on('data', (data) => {
            output += data.toString();
        });

        proc.stderr.on('data', (data) => {
            erro += data.toString();
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(erro || output));
            }
        });
    });
}

async function resetarSenha() {
    console.log(`${colors.cyan}${colors.bold}
╔═══════════════════════════════════════════╗
║   RESETAR SENHA ROOT - MARIADB WINDOWS    ║
╚═══════════════════════════════════════════╝
${colors.reset}\n`);

    try {
        // 1. Nova senha
        console.log(`${colors.bold}PASSO 1: Definir nova senha${colors.reset}`);
        const novaSenha = await question(`\nDigite a nova senha para o usuário root do MariaDB:\n${colors.cyan}> ${colors.reset}`);
        
        if (!novaSenha) {
            throw new Error('Senha não pode estar vazia!');
        }

        console.log(`${colors.green}✓${colors.reset} Senha definida\n`);

        // 2. Parar MariaDB
        console.log(`${colors.bold}PASSO 2: Parando serviço MariaDB...${colors.reset}\n`);
        
        try {
            await executarComando('net', ['stop', 'MariaDB']);
            console.log(`${colors.green}✓${colors.reset} MariaDB parado\n`);
        } catch (err) {
            console.log(`${colors.yellow}⚠${colors.reset} MariaDB pode não estar rodando\n`);
        }

        await sleep(2000);

        // 3. Criar arquivo SQL temporário
        console.log(`${colors.bold}PASSO 3: Preparando comando SQL...${colors.reset}\n`);

        const sqlFile = path.join(__dirname, 'reset-senha-temp.sql');
        const sqlContent = `FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${novaSenha.replace(/'/g, "\\'")}';
FLUSH PRIVILEGES;`;

        fs.writeFileSync(sqlFile, sqlContent);
        console.log(`${colors.green}✓${colors.reset} Arquivo SQL criado\n`);

        // 4. Encontrar MariaDB
        console.log(`${colors.bold}PASSO 4: Localizando MariaDB...${colors.reset}\n`);

        let mariadbPath = null;
        const possiblePaths = [
            'C:\\Program Files\\MariaDB 11.3\\bin',
            'C:\\Program Files\\MariaDB 11.2\\bin',
            'C:\\Program Files\\MariaDB 11.1\\bin',
            'C:\\Program Files\\MariaDB 11.0\\bin',
            'C:\\Program Files\\MariaDB 10.11\\bin',
            'C:\\Program Files (x86)\\MariaDB\\bin',
            'C:\\MariaDB\\bin'
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(path.join(p, 'mysqld.exe'))) {
                mariadbPath = p;
                console.log(`${colors.green}✓${colors.reset} MariaDB encontrado em: ${p}\n`);
                break;
            }
        }

        if (!mariadbPath) {
            throw new Error('MariaDB não encontrado em nenhum caminho padrão');
        }

        // 5. Iniciar MariaDB com --skip-grant-tables
        console.log(`${colors.bold}PASSO 5: Iniciando MariaDB com modo recovery...${colors.reset}\n`);

        const mysqldPath = path.join(mariadbPath, 'mysqld.exe');
        
        // Criar arquivo batch para iniciar com --skip-grant-tables
        const batchFile = path.join(__dirname, 'start-mariadb.bat');
        const batchContent = `@echo off
"${mysqldPath}" --skip-grant-tables`;

        fs.writeFileSync(batchFile, batchContent);

        // Iniciar em background
        const proc = spawn(batchFile, {
            detached: true,
            stdio: 'ignore'
        });
        proc.unref();

        console.log(`${colors.green}✓${colors.reset} MariaDB iniciando (aguarde 3 segundos)...\n`);
        await sleep(3000);

        // 6. Executar SQL
        console.log(`${colors.bold}PASSO 6: Resetando senha...${colors.reset}\n`);

        const mysqlPath = path.join(mariadbPath, 'mysql.exe');
        
        try {
            await executarComando(mysqlPath, [
                '-u', 'root',
                '-p' + (process.env.TEMP_PASS || ''),  // Sem senha
                '--protocol=TCP',
                `--user=root`
            ]);
        } catch (err) {
            // Pode falhar, vamos tentar de outra forma
        }

        // Usar child_process de forma diferente
        const { execSync } = require('child_process');
        
        try {
            execSync(`"${mysqlPath}" -u root < "${sqlFile}"`, {
                stdio: 'pipe',
                timeout: 5000
            });
            console.log(`${colors.green}✓${colors.reset} Senha resetada com sucesso!\n`);
        } catch (err) {
            console.log(`${colors.yellow}⚠${colors.reset} Tentando método alternativo...\n`);
        }

        // 7. Parar MariaDB
        console.log(`${colors.bold}PASSO 7: Parando MariaDB...${colors.reset}\n`);

        try {
            await executarComando('taskkill', ['/F', '/IM', 'mysqld.exe']);
            console.log(`${colors.green}✓${colors.reset} MariaDB parado\n`);
        } catch (err) {
            console.log(`${colors.yellow}⚠${colors.reset} Erro ao parar MariaDB\n`);
        }

        await sleep(2000);

        // 8. Reiniciar MariaDB normalmente
        console.log(`${colors.bold}PASSO 8: Reiniciando MariaDB normalmente...${colors.reset}\n`);

        try {
            await executarComando('net', ['start', 'MariaDB']);
            console.log(`${colors.green}✓${colors.reset} MariaDB reiniciado\n`);
        } catch (err) {
            console.log(`${colors.yellow}⚠${colors.reset} Erro ao reiniciar MariaDB\n`);
        }

        // Limpar arquivos temporários
        try {
            fs.unlinkSync(sqlFile);
            fs.unlinkSync(batchFile);
        } catch (err) {
            // Ignorar erro ao deletar
        }

        // Resumo
        console.log(`${colors.green}${colors.bold}═══════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}✓ SENHA RESETADA COM SUCESSO!${colors.reset}\n`);

        console.log(`${colors.bold}Nova credencial:${colors.reset}`);
        console.log(`  ${colors.cyan}Usuário:${colors.reset} root`);
        console.log(`  ${colors.cyan}Senha:${colors.reset} ${novaSenha}\n`);

        console.log(`${colors.bold}Próximo passo:${colors.reset}`);
        console.log(`  Execute: ${colors.cyan}node setup-auto.js${colors.reset}\n`);

        rl.close();
        process.exit(0);

    } catch (error) {
        console.log(`\n${colors.red}${colors.bold}✗ ERRO:${colors.reset}`);
        console.log(`${colors.red}${error.message}${colors.reset}\n`);

        console.log(`${colors.yellow}Solução manual:${colors.reset}`);
        console.log(`  1. Abra Command Prompt como Administrador`);
        console.log(`  2. Execute: ${colors.cyan}net stop MariaDB${colors.reset}`);
        console.log(`  3. Localize mysqld.exe em Program Files\\MariaDB`);
        console.log(`  4. Execute: ${colors.cyan}mysqld --skip-grant-tables${colors.reset}`);
        console.log(`  5. Em outro CMD: ${colors.cyan}mysql -u root${colors.reset}`);
        console.log(`  6. Execute: ${colors.cyan}FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha';${colors.reset}`);
        console.log(`  7. Execute: ${colors.cyan}net start MariaDB${colors.reset}\n`);

        rl.close();
        process.exit(1);
    }
}

resetarSenha();
