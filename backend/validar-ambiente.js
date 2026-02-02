/**
 * Script de validação completa do ambiente
 * Verifica .env, conexão com banco, dependências, etc.
 */

console.log('\n🔍 VALIDAÇÃO DO AMBIENTE - BACKEND USETRAFO\n');
console.log('=' .repeat(60) + '\n');

// 1. Verificar dotenv
console.log('1️⃣ Verificando dotenv...');
try {
    require('dotenv').config();
    console.log('   ✅ dotenv carregado');
} catch (error) {
    console.error('   ❌ Erro ao carregar dotenv:', error.message);
    process.exit(1);
}

// 2. Verificar variáveis de ambiente
console.log('\n2️⃣ Verificando variáveis de ambiente (.env)...');
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missingVars = [];

requiredVars.forEach(varName => {
    if (process.env[varName]) {
        if (varName === 'DB_PASSWORD' || varName === 'JWT_SECRET') {
            console.log(`   ✅ ${varName}: DEFINIDO (${process.env[varName].length} caracteres)`);
        } else {
            console.log(`   ✅ ${varName}: ${process.env[varName]}`);
        }
    } else {
        console.log(`   ❌ ${varName}: NÃO DEFINIDO`);
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.error(`\n   ⚠️  Variáveis obrigatórias faltando: ${missingVars.join(', ')}`);
    console.error('   Configure no arquivo .env dentro da pasta backend/');
}

// Variáveis opcionais
console.log(`   📋 DB_PORT: ${process.env.DB_PORT || '3306 (padrão)'}`);
console.log(`   📋 DB_CHARSET: ${process.env.DB_CHARSET || 'utf8mb4 (padrão)'}`);
console.log(`   📋 PORT: ${process.env.PORT || '3000 (padrão)'}`);
console.log(`   📋 NODE_ENV: ${process.env.NODE_ENV || 'development (padrão)'}`);

// 3. Verificar dependências
console.log('\n3️⃣ Verificando dependências...');
const requiredModules = ['express', 'mysql2', 'bcrypt', 'jsonwebtoken', 'dotenv', 'cors', 'helmet'];
const missingModules = [];

requiredModules.forEach(moduleName => {
    try {
        require(moduleName);
        console.log(`   ✅ ${moduleName}: instalado`);
    } catch (error) {
        console.log(`   ❌ ${moduleName}: NÃO instalado`);
        missingModules.push(moduleName);
    }
});

if (missingModules.length > 0) {
    console.error(`\n   ⚠️  Módulos faltando: ${missingModules.join(', ')}`);
    console.error('   Execute: npm install');
    process.exit(1);
}

// 4. Verificar arquivos importantes
console.log('\n4️⃣ Verificando arquivos do projeto...');
const fs = require('fs');
const requiredFiles = [
    'server.js',
    'config/database.js',
    'routes/auth.js',
    'routes/produtos.js',
    'routes/carrinho.js',
    'routes/orcamentos.js',
    'middleware/auth.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}: existe`);
    } else {
        console.log(`   ❌ ${file}: NÃO encontrado`);
    }
});

// 5. Testar conexão com banco
console.log('\n5️⃣ Testando conexão com MariaDB...');
const { testConnection } = require('./config/database');

testConnection().then(success => {
    if (success) {
        console.log('\n' + '='.repeat(60));
        console.log('✅ VALIDAÇÃO COMPLETA - AMBIENTE PRONTO!');
        console.log('='.repeat(60));
        console.log('\n📋 Próximos passos:');
        console.log('   1. Execute: npm run dev');
        console.log('   2. Acesse: http://localhost:3000/health');
        console.log('   3. Teste o endpoint de login\n');
        process.exit(0);
    } else {
        console.log('\n' + '='.repeat(60));
        console.log('❌ VALIDAÇÃO FALHOU - CORRIGA OS ERROS ACIMA');
        console.log('='.repeat(60));
        console.log('\n💡 Verifique:');
        console.log('   - MariaDB está rodando?');
        console.log('   - Credenciais no .env estão corretas?');
        console.log('   - Banco de dados existe?\n');
        process.exit(1);
    }
}).catch(error => {
    console.error('\n❌ Erro ao testar conexão:', error.message);
    process.exit(1);
});
