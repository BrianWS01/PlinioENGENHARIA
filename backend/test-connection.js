/**
 * Script de teste de conexão com MariaDB
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('\n=== TESTE DE CONEXÃO COM MARIADB ===\n');
    
    // Mostrar configurações (sem senha)
    console.log('Configurações:');
    console.log('  DB_HOST:', process.env.DB_HOST || 'NÃO DEFINIDO');
    console.log('  DB_PORT:', process.env.DB_PORT || 'NÃO DEFINIDO');
    console.log('  DB_USER:', process.env.DB_USER || 'NÃO DEFINIDO');
    console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***DEFINIDO***' : 'NÃO DEFINIDO');
    console.log('  DB_NAME:', process.env.DB_NAME || 'NÃO DEFINIDO');
    console.log('  DB_CHARSET:', process.env.DB_CHARSET || 'NÃO DEFINIDO');
    console.log('');
    
    // Tentar conectar
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'usetrafo_db',
            charset: process.env.DB_CHARSET || 'utf8mb4'
        });
        
        console.log('✅ Conexão estabelecida com sucesso!');
        
        // Testar query simples
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query de teste executada:', rows);
        
        // Verificar se o banco existe
        const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'usetrafo_db']);
        if (databases.length > 0) {
            console.log('✅ Banco de dados encontrado:', process.env.DB_NAME);
        } else {
            console.log('⚠️  Banco de dados NÃO encontrado:', process.env.DB_NAME);
        }
        
        // Verificar se as tabelas existem
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('✅ Tabelas encontradas:', tables.length);
        if (tables.length > 0) {
            console.log('   Tabelas:', tables.map(t => Object.values(t)[0]).join(', '));
        }
        
        await connection.end();
        console.log('\n✅ Teste concluído com sucesso!\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ ERRO NA CONEXÃO:');
        console.error('   Código:', error.code);
        console.error('   Mensagem:', error.message);
        console.error('   SQL State:', error.sqlState || 'N/A');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Dica: O servidor MariaDB pode não estar rodando ou a porta está incorreta.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Dica: Verifique o usuário e senha no arquivo .env');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('\n💡 Dica: O banco de dados não existe. Execute o schema SQL primeiro.');
        }
        
        console.log('');
        process.exit(1);
    }
}

testConnection();
