require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createOwner() {
    try {
        console.log('Conectando ao banco de dados...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const email = 'diretoria@usetrafo.com.br';
        const senha = 'usetrafo2026'; // Senha forte inicial
        const nome = 'Diretoria USETRAFO';

        console.log(`Criando usuário para: ${email}`);

        // Gerar hash
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Verificar se já existe
        const [rows] = await connection.execute('SELECT id FROM usuarios WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('Usuário já existe. Atualizando senha e garantindo admin...');
            await connection.execute(
                'UPDATE usuarios SET senha_hash = ?, is_admin = 1, is_ativo = 1, nome = ? WHERE email = ?',
                [senhaHash, nome, email]
            );
        } else {
            console.log('Inserindo novo usuário...');
            await connection.execute(
                `INSERT INTO usuarios (email, senha_hash, nome, is_admin, is_ativo, email_verificado) 
                 VALUES (?, ?, ?, 1, 1, 1)`,
                [email, senhaHash, nome]
            );
        }

        console.log('✅ Usuário criado/atualizado com sucesso!');
        console.log(`Email: ${email}`);
        console.log(`Senha: ${senha}`);

        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

createOwner();
