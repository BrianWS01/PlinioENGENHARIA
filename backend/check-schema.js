
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [rows] = await connection.execute('DESCRIBE produtos');
    console.log('Columns:');
    rows.forEach(r => console.log(r.Field));
    await connection.end();
}

checkSchema().catch(console.error);
