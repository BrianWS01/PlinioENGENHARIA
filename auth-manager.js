/**
 * Gerenciador de Autenticação
 * Centraliza login, registro e gestão de sessão
 */

const AUTH_API_URL = 'http://localhost:3000/api';

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));

        // Inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('AuthManager initializing...');
        this.updateUI();
        this.setupLogout();
    }

    /**
     * Verificar se usuário está logado
     */
    isLoggedIn() {
        return !!this.token;
    }

    /**
     * Cabeçalhos para requisições autenticadas
     */
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    /**
     * Realizar Login
     */
    async login(email, senha) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }

            this.setSession(data.data.token, data.data.user);
            return data.data.user;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    /**
     * Realizar Registro
     */
    async register(userData) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no registro');
            }

            this.setSession(data.data.token, data.data.user);
            return data.data.user;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    /**
     * Salvar sessão
     */
    setSession(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Compatibilidade com código legado que usa 'usuarioLogado'
        const usuarioLegado = { ...user };
        delete usuarioLegado.id; // Legado pode não esperar ID ou usar formato diferente
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLegado));

        this.updateUI();
    }

    /**
     * Logout
     */
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('usuarioLogado'); // Legado

        this.updateUI();

        // Redirecionar para home ou login
        window.location.href = 'index.html';
    }

    /**
     * Atualizar Interface (Menu de Usuário)
     */
    updateUI() {
        const userMenuDropdown = document.getElementById('userMenuDropdown');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const menuItemLogin = document.getElementById('menuItemLogin');
        const menuItemRegister = document.getElementById('menuItemRegister');
        const menuItemConfig = document.getElementById('menuItemConfig');
        const menuItemLogout = document.getElementById('menuItemLogout');

        if (this.isLoggedIn() && this.user) {
            // Logado
            if (userNameDisplay) userNameDisplay.textContent = this.user.nome.split(' ')[0];
            if (menuItemLogin) menuItemLogin.style.display = 'none';
            if (menuItemRegister) menuItemRegister.style.display = 'none';
            if (menuItemConfig) menuItemConfig.style.display = 'block';
            if (menuItemLogout) menuItemLogout.style.display = 'block';
        } else {
            // Não logado
            if (userNameDisplay) userNameDisplay.textContent = 'Conta';
            if (menuItemLogin) menuItemLogin.style.display = 'block';
            if (menuItemRegister) menuItemRegister.style.display = 'block';
            if (menuItemConfig) menuItemConfig.style.display = 'none';
            if (menuItemLogout) menuItemLogout.style.display = 'none';
        }
    }

    setupLogout() {
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Handler para formulário de login
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginPassword').value;
        const btnSubmit = event.target.querySelector('button[type="submit"]');

        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Entrando...';
            }

            await this.login(email, senha);

            // Sucesso
            this.showAlert('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';
                window.location.href = redirect;
            }, 1000);

        } catch (error) {
            this.showAlert(error.message, 'danger');
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Entrar';
            }
        }
    }

    // Handler para formulário de registro
    async handleRegister(event) {
        event.preventDefault();
        const nome = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const telefone = document.getElementById('registerPhone').value;
        const senha = document.getElementById('registerPassword').value;
        const confirmSenha = document.getElementById('registerPasswordConfirm').value;
        const btnSubmit = event.target.querySelector('button[type="submit"]');

        // Validações básicas de frontend
        if (senha !== confirmSenha) {
            this.showAlert('As senhas não coincidem!', 'danger');
            return;
        }

        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Criando conta...';
            }

            await this.register({ nome, email, telefone, senha });

            // Sucesso
            this.showAlert('Conta criada com sucesso! Bem-vindo!', 'success');
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';
                window.location.href = redirect;
            }, 1000);

        } catch (error) {
            this.showAlert(error.message, 'danger');
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fas fa-user-plus me-2"></i>Criar Conta';
            }
        }
    }

    showAlert(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Inicializar e expor globalmente
window.authManager = new AuthManager();
console.log('AuthManager loaded');
