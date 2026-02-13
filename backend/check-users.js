
require('dotenv').config();
const { testConnection, query } = require('./config/database');

async function checkUsers() {
    try {
        console.log('Checking database connection...');
        await testConnection();
        console.log('Describing usuarios table...');
        const [rows] = await query('DESCRIBE usuarios');
        console.log('Columns in usuarios table:');
        rows.forEach(r => console.log(`${r.Field} (${r.Type})`));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkUsers();
