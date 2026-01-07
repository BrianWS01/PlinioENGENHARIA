// Script para criar usuário de teste
// Execute este script no console do navegador ou inclua no HTML

(function criarUsuarioTeste() {
    const usuarioTeste = {
        nome: 'Usuário Teste',
        email: 'teste@usetrafo.com.br',
        senha: '123456',
        telefone: '(11) 99999-9999',
        dataCadastro: new Date().toISOString()
    };
    
    // Verificar se já existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.find(u => u.email === usuarioTeste.email);
    
    if (usuarioExistente) {
        // Atualizar usuário existente
        const index = usuarios.findIndex(u => u.email === usuarioTeste.email);
        usuarios[index] = usuarioTeste;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('✅ Usuário de teste ATUALIZADO com sucesso!');
    } else {
        // Criar novo usuário
        usuarios.push(usuarioTeste);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('✅ Usuário de teste CRIADO com sucesso!');
    }
    
    console.log('\n📋 CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('E-mail: teste@usetrafo.com.br');
    console.log('Senha: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return usuarioTeste;
})();

