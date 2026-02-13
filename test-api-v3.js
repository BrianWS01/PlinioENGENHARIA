#!/usr/bin/env node

const http = require('http');

console.log('\n╔═══════════════════════════════════════════╗');
console.log('║     TESTANDO APIs - USETRAFO V3           ║');
console.log('╚═══════════════════════════════════════════╝\n');

const req = http.get('http://127.0.0.1:3000/api/produtos', {
    timeout: 5000
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('✅ SUCESSO!');
            console.log(`Status: ${res.statusCode}`);
            console.log(`Produtos encontrados: ${json.produtos ? json.produtos.length : 0}`);
            if (json.produtos && json.produtos.length > 0) {
                const p = json.produtos[0];
                console.log(`\n📋 Primeira:`, p.nome);
                console.log(`   Categoria: ${p.categoria}`);
                console.log(`   Preço: R$ ${p.preco}`);
            }
        } catch(e) {
            console.log('❌ Erro ao parsear JSON:', e.message);
        }
    });
});

req.on('error', (err) => {
    console.log('❌ Erro:', err.code, err.message);
    console.log('   Verifique se o servidor está rodando em http://127.0.0.1:3000');
});

req.on('timeout', () => {
    req.destroy();
    console.log('❌ Timeout - servidor não responde');
});
