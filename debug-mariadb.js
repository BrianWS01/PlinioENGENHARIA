#!/usr/bin/env node

/**
 * Debugar conexão com MariaDB
 * Verifica status e credenciais
 */

const mysql = require('mysql2/promise');

async function debug() {
    console.log('\n=== DEBUG MARIADB CONNECTION ===\n');

    const configs = [
        {
            name: 'Root sem senha',
            host: 'localhost',
            user: 'root',
            password: ''
        },
        {
            name: 'Root com Plinio123',
            host: 'localhost',
            user: 'root',
            password: 'Plinio123'
        },
        {
            name: 'Root com Plinio1',
            host: 'localhost',
            user: 'root',
            password: 'Plinio1'
        },
        {
            name: 'Root com NovaS enhaForte123',
            host: 'localhost',
            user: 'root',
            password: 'NovaS enhaForte123'
        },
        {
            name: 'TCP Socket',
            host: '127.0.0.1',
            user: 'root',
            password: '',
            port: 3306
        },
        {
            name: 'Host localhost com port',
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306
        }
    ];

    for (const config of configs) {
        try {
            console.log(`Testando: ${config.name}`);
            console.log(`  Host: ${config.host}`);
            console.log(`  Port: ${config.port || 3306}`);
            console.log(`  User: ${config.user}`);
            console.log(`  Password: ${config.password ? '***' : '(nenhuma)'}`);

            const conn = await mysql.createConnection({
                host: config.host,
                port: config.port || 3306,
                user: config.user,
                password: config.password,
                waitForConnections: true,
                connectionLimit: 1,
                queueLimit: 0,
                enableKeepAlive: true
            });

            const result = await conn.query('SELECT VERSION()');
            console.log(`  ✓ SUCESSO! MariaDB ${result[0][0]['VERSION()']}\n`);
            
            await conn.end();
            process.exit(0);

        } catch (err) {
            console.log(`  ✗ ${err.message}\n`);
        }
    }

    console.log('❌ Nenhuma configuração funcionou!');
    console.log('\nDicas:');
    console.log('  1. Verifique se MariaDB está rodando: net start MariaDB');
    console.log('  2. Use HeidiSQL para conectar e verificar a senha');
    console.log('  3. Se nenhuma conexão funcionar, MariaDB pode estar corrompido\n');

    process.exit(1);
}

debug();
