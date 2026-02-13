#!/usr/bin/env node

const mysql = require('mysql2/promise');

async function verificar() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'usetrafo_user',
        password: 'usetrafo_123_secure',
        database: 'usetrafo_db'
    });

    try {
        const conn = await pool.getConnection();
        
        // Total de produtos
        const [rows] = await conn.query('SELECT COUNT(*) as total FROM produtos');
        console.log('\n✅ Total de produtos no banco:', rows[0].total);
        
        // Por categoria
        const [categorias] = await conn.query('SELECT categoria, COUNT(*) as qtd FROM produtos GROUP BY categoria');
        console.log('\n📊 Por categoria:');
        categorias.forEach(cat => {
            console.log(`   • ${cat.categoria}: ${cat.qtd} produtos`);
        });
        
        // Amostra
        const [amostra] = await conn.query('SELECT id, nome, categoria, preco FROM produtos LIMIT 5');
        console.log('\n📋 Amostra de 5 produtos:');
        amostra.forEach(p => {
            const preco = typeof p.preco === 'number' ? p.preco.toFixed(2) : p.preco;
            console.log(`   • [${p.id}] ${p.nome} - R$ ${preco}`);
        });
        
        conn.release();
        pool.end();
    } catch (err) {
        console.error('❌ Erro:', err.message);
        process.exit(1);
    }
}

verificar();
