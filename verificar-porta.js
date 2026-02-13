#!/usr/bin/env node

const net = require('net');

function verificarPorta() {
    const socket = new net.Socket();
    socket.setTimeout(3000);

    socket.on('connect', () => {
        console.log('✅ Servidor está respondendo na porta 3000!');
        socket.destroy();
        process.exit(0);
    });

    socket.on('timeout', () => {
        console.log('❌ Timeout ao conectar');
        socket.destroy();
        process.exit(1);
    });

    socket.on('error', (err) => {
        console.log('❌ Erro ao conectar:', err.code);
        process.exit(1);
    });

    console.log('🔍 Verificando se servidor está na porta 3000...\n');
    socket.connect(3000, 'localhost');
}

verificarPorta();
