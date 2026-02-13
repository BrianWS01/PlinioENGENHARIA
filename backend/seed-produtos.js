
const mysql = require('mysql2/promise');
require('dotenv').config();
const { catalogoProdutos } = require('../catalogo-produtos-static.js');

async function seed() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Conectar ao banco
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Limpar tabela
        console.log('🧹 Limpando tabela de produtos...');
        // Disable FK checks to allow truncate/delete
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE produtos');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Preparar statement
        // Schema: nome, slug, descricao, preco, categoria, subcategoria, imagem, estoque, disponivel, ativo, destaque
        // Note: 'descricao' in DB will store the HTML description

        const sql = `
            INSERT INTO produtos 
            (nome, slug, descricao, descricao_completa, preco, categoria, subcategoria, imagem_principal, imagens, estoque, disponivel, ativo, destaque) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const produtos = Object.values(catalogoProdutos);
        console.log(`📦 Encontrados ${produtos.length} produtos para inserir.`);

        let inserted = 0;
        for (const p of produtos) {
            // Map fields
            const nome = p.nome;
            const slug = p.slug;
            // Descricao curta
            const descricao = p.descricao;
            // Descricao HTML completa
            const descricao_completa = p.descricao_completa || p.descricao;

            const preco = p.preco;
            const categoria = p.categoria;
            const subcategoria = p.subcategoria;

            const imagem_principal = p.imagem_principal || (p.imagens && p.imagens[0]) || '';
            const imagens = JSON.stringify(p.imagens || []);

            const estoque = 100; // Default
            const disponivel = p.disponivel !== false;
            const ativo = p.ativo !== false;
            const destaque = p.destaque === true;

            await connection.execute(sql, [
                nome, slug, descricao, descricao_completa, preco, categoria, subcategoria, imagem_principal, imagens, estoque, disponivel, ativo, destaque
            ]);
            inserted++;
        }

        console.log(`✅ Sucesso! ${inserted} produtos inseridos.`);

    } catch (error) {
        console.error('❌ Erro no seed:', error);
    } finally {
        await connection.end();
    }
}

seed();
