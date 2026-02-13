require('dotenv').config();
const mysql = require('mysql2/promise');

async function listUsers() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('--- LISTA DE USUÁRIOS ---');

        const [rows] = await connection.execute('SELECT id, nome, email, is_admin, created_at FROM usuarios');

        if (rows.length === 0) {
            console.log('Nenhum usuário encontrado.');
        } else {
            rows.forEach(u => {
                console.log(`[${u.id}] ${u.nome} (${u.email}) - Admin: ${u.is_admin ? 'SIM' : 'NÃO'}`);
            });
        }

        await connection.end();
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

listUsers();
