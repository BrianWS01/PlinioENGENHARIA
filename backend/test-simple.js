
const mysql = require('mysql2/promise');

async function test() {
    console.log('Iniciando teste...');
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'usetrafo_user',
            password: 'usetrafo_123_secure',
            database: 'usetrafo_db'
        });
        console.log('✅ Conectado!');
        const [rows] = await conn.execute('SELECT 1');
        console.log('✅ Query ok:', rows);
        await conn.end();
    } catch (e) {
        console.error('❌ Erro:', e);
    }
}
test();
