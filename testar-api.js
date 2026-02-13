#!/usr/bin/env node

const http = require('http');

function fazerRequisicao(metodo, caminho, dados = null) {
    return new Promise((resolve, reject) => {
        const opcoes = {
            hostname: 'localhost',
            port: 3000,
            path: caminho,
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000,
            family: 4
        };

        const req = http.request(opcoes, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        dados: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        dados: data
                    });
                }
            });
        });

        req.on('error', (err) => {
            console.error('Detalhe do erro:', err.code, err.message);
            reject(err);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout na requisição'));
        });
        
        if (dados) req.write(JSON.stringify(dados));
        req.end();
    });
}

async function testarAPIs() {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║     TESTANDO APIs - USETRAFO              ║');
    console.log('╚═══════════════════════════════════════════╝\n');

    try {
        // 1. Health Check
        console.log('🔍 1. Health Check...');
        let res = await fazerRequisicao('GET', '/health');
        console.log(`   Status: ${res.status} - ${res.dados?.message || 'OK'}\n`);

        // 2. Listar Produtos
        console.log('🔍 2. Listando Produtos...');
        res = await fazerRequisicao('GET', '/api/produtos');
        console.log(`   Status: ${res.status}`);
        if (res.dados?.produtos) {
            console.log(`   Total: ${res.dados.produtos.length} produtos`);
            if (res.dados.produtos.length > 0) {
                const p = res.dados.produtos[0];
                console.log(`   Exemplo: ${p.nome} - R$ ${p.preco}`);
            }
        }
        console.log();

        // 3. Registrar Usuário
        console.log('🔍 3. Registrando novo usuário...');
        res = await fazerRequisicao('POST', '/api/auth/register', {
            nome: 'Teste ' + Math.random().toString(36).substring(7),
            email: 'teste_' + Math.random().toString(36).substring(7) + '@example.com',
            senha: 'Senha123!@#',
            empresa: 'Empresa Teste'
        });
        console.log(`   Status: ${res.status}`);
        console.log(`   ${res.dados?.message || (res.dados?.error ? '❌ ' + res.dados.error : 'OK')}\n`);

        // 4. Listar Categorias
        console.log('🔍 4. Categorias de produtos...');
        res = await fazerRequisicao('GET', '/api/produtos?categoria=transformadores-oleo');
        console.log(`   Status: ${res.status}`);
        if (res.dados?.produtos) {
            console.log(`   Transformadores a Óleo: ${res.dados.produtos.length}`);
        }
        console.log();

        console.log('✅ Testes concluídos!\n');
        console.log('📊 Próximas etapas:');
        console.log('   1. Integrar frontend com API');
        console.log('   2. Testar autenticação completa');
        console.log('   3. Implementar carrinho de compras');
        console.log('   4. Implementar orçamentos\n');

    } catch (err) {
        console.error('❌ Erro ao testar:', err.message);
    }
}

// Aguardar servidor inicializar
setTimeout(testarAPIs, 2000);
