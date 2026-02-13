
/**
 * Rotas de Frete (Simulação)
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/frete/calcular
 * Calcular opções de frete baseado no CEP e itens
 */
router.post('/calcular', (req, res) => {
    try {
        const { cep, itens } = req.body;

        if (!cep) {
            return res.status(400).json({
                success: false,
                message: 'CEP é obrigatório'
            });
        }

        // Simulação de lógica de frete baseada na região (primeiro dígito do CEP)
        // 0xxxx a 9xxxx
        const cepPrefix = parseInt(cep.replace(/\D/g, '').substring(0, 1));

        let prazoBase = 3;
        let precoBase = 50.00;

        // Ajustar base conforme "distância" (simulada)
        if (cepPrefix >= 0 && cepPrefix <= 2) { // SP e região (perto)
            prazoBase = 2;
            precoBase = 30.00;
        } else if (cepPrefix >= 3 && cepPrefix <= 5) { // MG, RJ, ES
            prazoBase = 5;
            precoBase = 60.00;
        } else { // Outros
            prazoBase = 8;
            precoBase = 100.00;
        }

        // Adicionar peso simulado dos itens (R$ 10 por item extra)
        const qtdItens = itens ? itens.reduce((acc, item) => acc + (item.quantity || 1), 0) : 1;
        const custoPeso = (qtdItens - 1) * 15.00;

        const transportadora = {
            nome: 'Transportadora USETRAFO',
            preco: precoBase + custoPeso,
            prazo: prazoBase + 2,
            tipo: 'transportadora'
        };

        const retira = {
            nome: 'Retirar na Loja (Várzea Paulista/SP)',
            preco: 0.00,
            prazo: 1,
            tipo: 'retira'
        };

        const opcoes = [transportadora, retira];

        // Adicionar Correios apenas se forem itens pequenos (simulando que trafos grandes não vão por correio)
        // Aqui assumimos que tudo é grande, então só transportadora.
        // Mas vamos adicionar Sedex fictício para demonstração se quiser.

        res.json({
            success: true,
            data: opcoes
        });

    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao calcular frete'
        });
    }
});

module.exports = router;
