#!/usr/bin/env node

const net = require('net');

console.log('Testando porta 3000...\n');

const socket = new net.Socket();
socket.setTimeout(2000);

socket.on('connect', () => {
    console.log('✅ SUCESSO! Servidor está respondendo na porta 3000');
    socket.destroy();
    process.exit(0);
});

socket.on('timeout', () => {
    console.log('❌ Timeout - ninguém na porta');
    socket.destroy();
    process.exit(1);
});

socket.on('error', (err) => {
    console.log('❌ Erro:', err.code);
    if (err.code === 'ECONNREFUSED') {
        console.log('   A porta 3000 está LIVRE mas ninguém está escutando!');
    }
    process.exit(1);
});

socket.connect(3000, '127.0.0.1');
