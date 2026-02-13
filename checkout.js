
/**
 * Lógica da Página de Checkout
 */

const checkout = {
    state: {
        itens: [],
        subtotal: 0,
        frete: null, // { valor: 0, tipo: '', prazo: 0 }
        total: 0,
        formaPagamento: null,
        endereco: null,
        usuario: null
    },

    init: async () => {
        // 1. Verificar Autenticação
        const user = localStorage.getItem('usuarioLogado');
        if (!user) {
            // Salvar URL de retorno
            window.location.href = 'login.html?redirect=checkout.html';
            return;
        }
        checkout.state.usuario = JSON.parse(user);

        // 2. Carregar Dados do Carrinho/Checkout
        // Tenta pegar de 'checkoutData' (setado no carrinho) ou direto do 'carrinho'
        const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (checkoutData) {
            checkout.state.itens = checkoutData.itens;
            // Se já veio com frete calculado, preenche
            if (checkoutData.frete) {
                // Precisamos recalcular/selecionar visualmente, mas por enquanto vamos resetar o frete 
                // para obrigar confirmação de endereço, ou usar se o endereço for o mesmo.
                // Por segurança, vamos pedir o CEP de novo ou usar dados do usuário.
            }
        } else if (carrinho.length > 0) {
            checkout.state.itens = carrinho;
        } else {
            // Carrinho vazio
            alert('Seu carrinho está vazio!');
            window.location.href = 'loja.html';
            return;
        }

        checkout.renderResumo();
        checkout.preencherDadosUsuario();
        checkout.setupListeners();
    },

    preencherDadosUsuario: () => {
        const user = checkout.state.usuario;
        if (!user) return;

        // Se tivermos dados de endereço salvos (mock ou estrutura real), preenchemos
        // Por enquanto, vamos deixar em branco ou preencher com dados fictícios se quiser testar
        // console.log('Usuário:', user);
    },

    setupListeners: () => {
        // Máscara de CEP e Busca
        const cepInput = document.getElementById('cep');
        const btnBuscarCep = document.getElementById('btnBuscarCep');

        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }

        if (btnBuscarCep) {
            btnBuscarCep.addEventListener('click', checkout.buscarFrete);
        }

        // Finalizar Pedido
        const btnPlaceOrder = document.getElementById('btnPlaceOrder');
        if (btnPlaceOrder) {
            btnPlaceOrder.addEventListener('click', checkout.finalizarPedido);
        }
    },

    buscarFrete: async () => {
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (cep.length !== 8) {
            checkout.showNotification('CEP inválido', 'warning');
            return;
        }

        const btn = document.getElementById('btnBuscarCep');
        const container = document.getElementById('shippingOptions');

        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Usar API de frete existente
            const opcoes = await window.api.calcularFrete(cep, checkout.state.itens);

            container.innerHTML = '';

            if (opcoes.length === 0) {
                container.innerHTML = '<p class="text-danger">Nenhuma opção de entrega para este CEP.</p>';
                return;
            }

            opcoes.forEach((opcao, index) => {
                const div = document.createElement('div');
                div.className = 'form-check p-3 border rounded mb-2';
                div.style.cursor = 'pointer';
                div.innerHTML = `
                    <input class="form-check-input" type="radio" name="freteOption" id="frete${index}" value="${index}">
                    <label class="form-check-label w-100" for="frete${index}" style="cursor: pointer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${opcao.nome}</strong>
                                <div class="small text-muted">até ${opcao.prazo} dias úteis</div>
                            </div>
                            <span class="fw-bold text-primary">
                                ${opcao.preco === 0 ? 'Grátis' : `R$ ${opcao.preco.toFixed(2).replace('.', ',')}`}
                            </span>
                        </div>
                    </label>
                `;

                div.addEventListener('click', () => {
                    div.querySelector('input').checked = true;
                    checkout.selecionarFrete(opcao);
                });

                container.appendChild(div);
            });

        } catch (error) {
            console.error(error);
            checkout.showNotification('Erro ao calcular frete', 'danger');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-search"></i>';
        }
    },

    selecionarFrete: (opcao) => {
        checkout.state.frete = opcao;
        checkout.atualizarTotais();
        checkout.validarPedido();
    },

    selectPayment: (tipo) => {
        checkout.state.formaPagamento = tipo;

        // Update UI
        document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');

        checkout.atualizarTotais();
        checkout.validarPedido();
    },

    renderResumo: () => {
        const container = document.getElementById('orderItems');
        let subtotal = 0;

        container.innerHTML = checkout.state.itens.map(item => {
            const totalItem = item.price * item.quantity;
            subtotal += totalItem;
            return `
                <div class="d-flex align-items-center mb-3">
                    <div class="me-3" style="width: 50px; height: 50px; background: #eee; border-radius: 4px; overflow: hidden;">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                    </div>
                    <div class="flex-grow-1">
                        <small class="d-block fw-bold text-truncate" style="max-width: 180px;">${item.name}</small>
                        <small class="text-muted">Qtd: ${item.quantity}</small>
                    </div>
                    <div class="text-end">
                        <small class="fw-bold">R$ ${totalItem.toFixed(2).replace('.', ',')}</small>
                    </div>
                </div>
            `;
        }).join('');

        checkout.state.subtotal = subtotal;
        checkout.atualizarTotais();
    },

    atualizarTotais: () => {
        const subtotal = checkout.state.subtotal;
        const frete = checkout.state.frete ? checkout.state.frete.preco : 0;
        let discount = 0;

        // Regra de desconto PIX (5%)
        if (checkout.state.formaPagamento === 'pix') {
            discount = (subtotal + frete) * 0.05;
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('summaryDiscount').textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
        } else {
            document.getElementById('discountRow').style.display = 'none';
        }

        const total = subtotal + frete - discount;

        document.getElementById('summarySubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('summaryShipping').textContent = checkout.state.frete
            ? (frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2).replace('.', ',')}`)
            : '--';
        document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    },

    validarPedido: () => {
        const btn = document.getElementById('btnPlaceOrder');
        constenderecoValido = document.getElementById('rua').value && document.getElementById('numero').value && document.getElementById('cidade').value;
        const freteSelecionado = !!checkout.state.frete;
        const pagamentoSelecionado = !!checkout.state.formaPagamento;

        btn.disabled = !(constenderecoValido && freteSelecionado && pagamentoSelecionado);
    },

    finalizarPedido: async () => {
        if (!checkout.state.usuario) return;

        const btn = document.getElementById('btnPlaceOrder');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processando...';

        try {
            // Preparar dados para API
            const endereco = {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            };

            const itensFormatados = checkout.state.itens.map(item => ({
                produto_id: item.product,
                nome_produto: item.name,
                quantidade: item.quantity,
                preco_unitario: item.price,
                subtotal: item.price * item.quantity
            }));

            const freteValor = checkout.state.frete ? checkout.state.frete.preco : 0;
            const subtotal = checkout.state.subtotal;
            const desconto = checkout.state.formaPagamento === 'pix' ? (subtotal + freteValor) * 0.05 : 0;
            const total = subtotal + freteValor - desconto;

            const pedido = {
                cliente_nome: checkout.state.usuario.nome,
                cliente_email: checkout.state.usuario.email,
                cliente_telefone: checkout.state.usuario.telefone || '',
                cliente_endereco: endereco,
                itens: itensFormatados,
                subtotal: subtotal,
                frete: freteValor,
                desconto: desconto,
                total: total,
                condicoes_comerciais: {
                    forma_pagamento: checkout.state.formaPagamento,
                    frete_tipo: checkout.state.frete ? checkout.state.frete.nome : 'Não informado'
                },
                observacoes: `Pedido realizado via Checkout Online. Forma de Pagamento: ${checkout.state.formaPagamento.toUpperCase()}`
            };

            // Enviar para API
            const resultado = await window.api.criarOrcamento(pedido);

            if (resultado.success) {
                // Limpar carrinho
                localStorage.removeItem('carrinho');
                localStorage.removeItem('checkoutData');

                // Redirecionar para sucesso
                const pedidoId = resultado.data ? resultado.data.id : (resultado.orcamentoId || Math.floor(Math.random() * 10000));
                window.location.href = `sucesso.html?pedido=${pedidoId}`;
            } else {
                throw new Error(resultado.message);
            }

        } catch (error) {
            console.error(error);
            checkout.showNotification(error.message || 'Erro ao processar pedido. Tente novamente.', 'danger');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Finalizar Pedido';
        }
    },

    showNotification: (message, type = 'info') => {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`; // Sem classe progress, conforme fix anterior
        notification.innerHTML = `
            <div class="notification-icon"><i class="fas fa-info-circle"></i></div>
            <div class="notification-content">
                <div class="notification-title">Mensagem</div>
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
};

document.addEventListener('DOMContentLoaded', checkout.init);
