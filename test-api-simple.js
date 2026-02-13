#!/usr/bin/env node

const http = require('http');

console.log('\n╔═══════════════════════════════════════════╗');
console.log('║     TESTANDO APIs - USETRAFO V2           ║');
console.log('╚═══════════════════════════════════════════╝\n');

const req = http.get('http://localhost:3000/api/produtos', {
    timeout: 5000
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        console.log('✅ SUCESSO!');
        console.log(`Status: ${res.statusCode}`);
        console.log(`Produtos encontrados: ${json.produtos ? json.produtos.length : 0}`);
        if (json.produtos && json.produtos.length > 0) {
            console.log(`\n📋 Primeira:`, json.produtos[0].nome);
        }
    });
});

req.on('error', (err) => {
    console.log('❌ Erro:', err.code, err.message);
});

req.on('timeout', () => {
    req.destroy();
    console.log('❌ Timeout');
});
