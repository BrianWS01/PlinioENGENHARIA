
const fetch = require('node-fetch');

async function testCreateOrder() {
    try {
        // 1. Buscar um produto real
        const prodResponse = await fetch('http://localhost:3000/api/produtos');
        const prodData = await prodResponse.json();

        if (!prodData.success || prodData.data.length === 0) {
            console.error('Nenhum produto encontrado para teste.');
            return;
        }

        const produtoReal = prodData.data[0];
        console.log('Usando produto:', produtoReal.nome, 'ID:', produtoReal.id);

        const payload = {
            cliente_nome: "Teste Automatizado",
            cliente_email: "teste@checkout.com",
            cliente_telefone: "11999999999",
            cliente_endereco: {
                cep: "13225-340",
                rua: "Rua Teste",
                numero: "123",
                bairro: "Centro",
                cidade: "São Paulo",
                estado: "SP"
            },
            itens: [
                {
                    produto_id: produtoReal.id,
                    nome_produto: produtoReal.nome,
                    quantidade: 2,
                    preco_unitario: parseFloat(produtoReal.preco),
                    subtotal: parseFloat(produtoReal.preco) * 2
                }
            ],
            subtotal: parseFloat(produtoReal.preco) * 2,
            frete: 50.00,
            total: (parseFloat(produtoReal.preco) * 2) + 50.00,
            condicoes_comerciais: {
                forma_pagamento: "boleto",
                frete_tipo: "transportadora"
            },
            observacoes: "Teste de integração backend"
        };

        const response = await fetch('http://localhost:3000/api/orcamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('Pedido Criado ID:', data.data.id);
            console.log('Número:', data.data.numero_orcamento);
        } else {
            console.log('Erro:', data.message);
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

testCreateOrder();
