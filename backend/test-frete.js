
const fetch = require('node-fetch');

async function testFrete() {
    try {
        const response = await fetch('http://localhost:3000/api/frete/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cep: '13225340',
                itens: [
                    { product: 1, quantity: 1 },
                    { product: 2, quantity: 2 }
                ]
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Erro:', error);
    }
}

testFrete();
