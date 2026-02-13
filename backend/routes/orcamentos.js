/**
 * Rotas de Orçamentos
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/orcamentos
 * Listar orçamentos do usuário (ou todos se admin)
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        let sql = `
            SELECT o.*, u.nome as usuario_nome, u.email as usuario_email
            FROM orcamentos o
            LEFT JOIN usuarios u ON o.usuario_id = u.id
        `;
        const params = [];

        // Se não for admin, mostrar apenas os próprios orçamentos
        if (!req.user.is_admin) {
            sql += ' WHERE o.usuario_id = ?';
            params.push(req.user.id);
        }

        sql += ' ORDER BY o.created_at DESC';

        // Paginação
        const pagina = parseInt(req.query.pagina) || 1;
        const por_pagina = parseInt(req.query.por_pagina) || 10;
        const offset = (pagina - 1) * por_pagina;

        sql += ' LIMIT ? OFFSET ?';
        params.push(por_pagina, offset);

        const [orcamentos] = await query(sql, params);

        // Buscar itens de cada orçamento
        for (let orcamento of orcamentos) {
            const [itens] = await query(
                'SELECT * FROM orcamento_itens WHERE orcamento_id = ? ORDER BY ordem',
                [orcamento.id]
            );
            orcamento.itens = itens;
        }

        res.json({
            success: true,
            data: orcamentos
        });

    } catch (error) {
        console.error('Erro ao listar orçamentos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar orçamentos'
        });
    }
});

/**
 * GET /api/orcamentos/:id
 * Detalhes de um orçamento
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        let sql = `
            SELECT o.*, u.nome as usuario_nome, u.email as usuario_email
            FROM orcamentos o
            LEFT JOIN usuarios u ON o.usuario_id = u.id
            WHERE o.id = ?
        `;
        const params = [id];

        // Se não for admin, verificar se o orçamento pertence ao usuário
        if (!req.user.is_admin) {
            sql += ' AND o.usuario_id = ?';
            params.push(req.user.id);
        }

        const [orcamentos] = await query(sql, params);

        if (!orcamentos || orcamentos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Orçamento não encontrado'
            });
        }

        const orcamento = orcamentos[0];

        // Buscar itens
        const [itens] = await query(
            'SELECT * FROM orcamento_itens WHERE orcamento_id = ? ORDER BY ordem',
            [id]
        );

        orcamento.itens = itens;

        res.json({
            success: true,
            data: orcamento
        });

    } catch (error) {
        console.error('Erro ao buscar orçamento:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar orçamento'
        });
    }
});

/**
 * POST /api/orcamentos
 * Criar novo orçamento
 */
router.post('/', async (req, res) => {
    try {
        const {
            cliente_nome,
            cliente_email,
            cliente_telefone,
            cliente_cnpj,
            cliente_endereco,
            itens,
            subtotal,
            desconto = 0,
            frete = 0,
            icms = 0,
            icms_st = 0,
            pis = 0,
            ipi = 0,
            cofins = 0,
            ibpt = 0,
            condicoes_comerciais,
            observacoes,
            validade_ate
        } = req.body;

        // Validações
        if (!cliente_nome || !cliente_email || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nome, email e itens são obrigatórios'
            });
        }

        // Calcular total
        const total = (subtotal || 0) - (desconto || 0) + (frete || 0) +
            (icms || 0) + (icms_st || 0) + (pis || 0) +
            (ipi || 0) + (cofins || 0) + (ibpt || 0);

        // Gerar número de orçamento
        const [ultimoNumero] = await query(
            'SELECT numero_orcamento FROM orcamentos WHERE numero_orcamento REGEXP "^CP [0-9]+$" ORDER BY CAST(SUBSTRING(numero_orcamento FROM 4) AS UNSIGNED) DESC LIMIT 1'
        );

        let novoNumero = 'CP 00001';
        if (ultimoNumero && ultimoNumero.length > 0) {
            const ultimoNum = parseInt(ultimoNumero[0].numero_orcamento.replace('CP ', ''));
            novoNumero = `CP ${String(ultimoNum + 1).padStart(5, '0')}`;
        }

        // Usuário ID (pode ser null se não estiver logado)
        const usuarioId = req.user ? req.user.id : null;

        // Criar orçamento
        const [orcamentoResult] = await query(
            `INSERT INTO orcamentos (
                numero_orcamento, usuario_id, cliente_nome, cliente_email,
                cliente_telefone, cliente_cnpj, cliente_endereco,
                condicoes_comerciais, subtotal, desconto, frete,
                icms, icms_st, pis, ipi, cofins, ibpt, total,
                observacoes, validade_ate, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
            [
                novoNumero, usuarioId, cliente_nome, cliente_email,
                cliente_telefone || null, cliente_cnpj || null,
                cliente_endereco ? JSON.stringify(cliente_endereco) : null,
                condicoes_comerciais ? JSON.stringify(condicoes_comerciais) : null,
                subtotal || 0, desconto || 0, frete || 0,
                icms || 0, icms_st || 0, pis || 0, ipi || 0,
                cofins || 0, ibpt || 0, total,
                observacoes || null,
                validade_ate || null
            ]
        );

        // Obter ID do orçamento criado
        // A função query retorna objeto com insertId
        let orcamentoId = orcamentoResult?.insertId || null;

        // Fallback: buscar pelo número do orçamento se insertId não estiver disponível
        if (!orcamentoId || orcamentoId === 0) {
            const [orcamentos] = await query('SELECT id FROM orcamentos WHERE numero_orcamento = ? LIMIT 1', [novoNumero]);
            const orc = Array.isArray(orcamentos) ? orcamentos[0] : orcamentos;
            orcamentoId = orc?.id || null;
        }

        if (!orcamentoId) {
            throw new Error('Não foi possível obter o ID do orçamento criado');
        }

        // Criar itens do orçamento
        for (let i = 0; i < itens.length; i++) {
            const item = itens[i];
            await query(
                `INSERT INTO orcamento_itens (
                    orcamento_id, produto_id, nome_produto, quantidade,
                    preco_unitario, subtotal, especificacoes, ordem
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orcamentoId,
                    item.produto_id || null,
                    item.nome_produto,
                    item.quantidade,
                    item.preco_unitario,
                    item.subtotal || (item.quantidade * item.preco_unitario),
                    item.especificacoes ? JSON.stringify(item.especificacoes) : null,
                    i
                ]
            );
        }


        // Buscar orçamento criado
        const [orcamentos] = await query(
            'SELECT * FROM orcamentos WHERE id = ?',
            [orcamentoId]
        );

        const orcamento = orcamentos[0];

        // Buscar itens
        const [itensOrcamento] = await query(
            'SELECT * FROM orcamento_itens WHERE orcamento_id = ? ORDER BY ordem',
            [orcamentoId]
        );

        orcamento.itens = itensOrcamento;

        res.status(201).json({
            success: true,
            message: 'Orçamento criado com sucesso',
            data: orcamento
        });

    } catch (error) {
        console.error('Erro ao criar orçamento:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar orçamento',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * PUT /api/orcamentos/:id/status
 * Atualizar status do orçamento (admin apenas)
 */
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusValidos = ['pendente', 'enviado', 'aceito', 'recusado', 'expirado'];

        if (!status || !statusValidos.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status inválido. Valores permitidos: ${statusValidos.join(', ')}`
            });
        }

        await query(
            'UPDATE orcamentos SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Status atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar status'
        });
    }
});

module.exports = router;
