/**
 * Configuração de Conexão com Banco de Dados (MariaDB/MySQL)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'usetrafo_db',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true
});

// Testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com MariaDB estabelecida com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MariaDB:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Verifique se o servidor MariaDB está rodando e a porta está correta.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   Verifique usuário e senha no arquivo .env');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('   O banco de dados não existe.');
        }
        return false;
    }
}

// Função query genérica (compatível com o estilo do mysql2)
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return [results]; // Retorna array para manter compatibilidade com mysql2 padrão [rows, fields]
    } catch (error) {
        console.error('Erro na query SQL:', error.message);
        console.error('SQL:', sql);
        throw error;
    }
}

module.exports = {
    pool,
    query,
    testConnection
};
