#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function executarSchema() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'usetrafo_user',
        password: 'usetrafo_123_secure',
        multipleStatements: true,
        database: 'usetrafo_db'
    });

    try {
        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║   EXECUTANDO SCHEMA - USETRAFO            ║');
        console.log('╚═══════════════════════════════════════════╝\n');

        const conn = await pool.getConnection();

        // Schema já existe, apenas verificar tabelas
        console.log('✅ Conectado ao banco\n');

        // Ler o arquivo de schema
        const schemaPath = path.join(__dirname, 'schema-mariadb-completo.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Remover comentários e quebras de linhas extras
        schemaSql = schemaSql
            .split('\n')
            .filter(line => !line.trim().startsWith('--') && line.trim())
            .join('\n');

        // Executar cada statement SQL
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        let count = 0;
        for (const statement of statements) {
            try {
                await conn.query(statement);
                count++;
                process.stdout.write(`\r⏳ Executando SQL... ${count}/${statements.length}`);
            } catch (err) {
                // Ignorar erros de "table already exists"
                if (!err.message.includes('already exists')) {
                    console.error(`\n❌ Erro: ${err.message}\nSQL: ${statement.substring(0, 100)}...`);
                }
            }
        }

        console.log(`\n✅ Schema executado com sucesso!\n`);

        // Verificar tabelas criadas
        const [tables] = await conn.query('SHOW TABLES');
        console.log('📊 Tabelas criadas:');
        tables.forEach(t => {
            const tableName = Object.values(t)[0];
            console.log(`   ✓ ${tableName}`);
        });

        conn.release();
        pool.end();
        
        console.log(`\n✅ Total de tabelas: ${tables.length}\n`);

    } catch (error) {
        console.error('❌ ERRO FATAL:', error.message);
        process.exit(1);
    }
}

executarSchema();
