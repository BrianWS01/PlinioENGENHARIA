const fetch = require('node-fetch');

async function testRegister() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Teste Debug',
                email: 'testedebug@example.com',
                password: 'password123', // Backend expects 'password' or 'senha'? Let's check routes.
                senha: 'password123',
                telefone: '11999999999'
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);

    } catch (error) {
        console.error('Erro:', error);
    }
}

testRegister();
