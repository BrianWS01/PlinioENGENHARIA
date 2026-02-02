/**
 * Script para gerar hash bcrypt de senha
 * Use este script para gerar o hash da senha do admin
 * 
 * Executar: node gerar-hash-senha.js
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Gerador de Hash BCrypt para Senha\n');

rl.question('Digite a senha para o admin: ', async (senha) => {
    try {
        // Gerar hash com salt rounds 10 (padrão recomendado)
        const hash = await bcrypt.hash(senha, 10);
        
        console.log('\n✅ Hash gerado com sucesso!\n');
        console.log('📋 Use este hash no arquivo criar-admin-inicial.sql:\n');
        console.log(`'${hash}'`);
        console.log('\n📝 Exemplo completo de INSERT:\n');
        console.log(`INSERT INTO usuarios (email, senha_hash, nome, is_admin, email_verificado, is_ativo)`);
        console.log(`VALUES (`);
        console.log(`    'admin@usetrafo.com.br',`);
        console.log(`    '${hash}',`);
        console.log(`    'Administrador',`);
        console.log(`    TRUE,`);
        console.log(`    TRUE,`);
        console.log(`    TRUE`);
        console.log(`);\n`);
        
        rl.close();
    } catch (error) {
        console.error('❌ Erro ao gerar hash:', error.message);
        rl.close();
    }
});
