/**
 * Rotas de Carrinho
 */

const express = require('express');
const router = express.Router();
const { query, beginTransaction, commit, rollback } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/carrinho
 * Listar itens do carrinho do usuário
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const carrinho = await query(
            `SELECT 
                c.*,
                p.nome as produto_nome,
                p.imagem_principal as produto_imagem,
                p.estoque as produto_estoque,
                p.ativo as produto_ativo,
                (c.quantidade * c.preco_unitario) as subtotal_item
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = ?`,
            [req.user.id]
        );

        // Calcular total
        let total = 0;
        carrinho.forEach(item => {
            total += parseFloat(item.subtotal_item || 0);
        });

        res.json({
            success: true,
            data: carrinho,
            total: total.toFixed(2)
        });

    } catch (error) {
        console.error('Erro ao listar carrinho:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar carrinho'
        });
    }
});

/**
 * POST /api/carrinho
 * Adicionar item ao carrinho
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { produto_id, quantidade = 1 } = req.body;

        if (!produto_id) {
            return res.status(400).json({
                success: false,
                message: 'ID do produto é obrigatório'
            });
        }

        // Verificar se produto existe e está disponível
        const [produtos] = await query(
            'SELECT id, preco, estoque, ativo, disponivel FROM produtos WHERE id = ?',
            [produto_id]
        );

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        const produto = produtos[0];

        if (!produto.ativo || !produto.disponivel) {
            return res.status(400).json({
                success: false,
                message: 'Produto não está disponível'
            });
        }

        if (produto.estoque < quantidade) {
            return res.status(400).json({
                success: false,
                message: `Estoque insuficiente. Disponível: ${produto.estoque}`
            });
        }

        // Verificar se item já está no carrinho
        const [itensExistentes] = await query(
            'SELECT id, quantidade FROM carrinho WHERE usuario_id = ? AND produto_id = ?',
            [req.user.id, produto_id]
        );

        if (itensExistentes && itensExistentes.length > 0) {
            // Atualizar quantidade
            const novaQuantidade = itensExistentes[0].quantidade + quantidade;
            
            if (produto.estoque < novaQuantidade) {
                return res.status(400).json({
                    success: false,
                    message: `Estoque insuficiente para esta quantidade`
                });
            }

            await query(
                'UPDATE carrinho SET quantidade = ?, updated_at = NOW() WHERE id = ?',
                [novaQuantidade, itensExistentes[0].id]
            );

            res.json({
                success: true,
                message: 'Quantidade atualizada no carrinho'
            });
        } else {
            // Adicionar novo item
            await query(
                `INSERT INTO carrinho (usuario_id, produto_id, quantidade, preco_unitario)
                 VALUES (?, ?, ?, ?)`,
                [req.user.id, produto_id, quantidade, produto.preco]
            );

            res.status(201).json({
                success: true,
                message: 'Produto adicionado ao carrinho'
            });
        }

    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao adicionar produto ao carrinho'
        });
    }
});

/**
 * PUT /api/carrinho/:itemId
 * Atualizar quantidade de um item
 */
router.put('/:itemId', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantidade } = req.body;

        if (!quantidade || quantidade < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantidade deve ser maior que zero'
            });
        }

        // Verificar se item pertence ao usuário
        const [itens] = await query(
            'SELECT c.*, p.estoque FROM carrinho c JOIN produtos p ON c.produto_id = p.id WHERE c.id = ? AND c.usuario_id = ?',
            [itemId, req.user.id]
        );

        if (!itens || itens.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item não encontrado no carrinho'
            });
        }

        const item = itens[0];

        if (item.estoque < quantidade) {
            return res.status(400).json({
                success: false,
                message: `Estoque insuficiente. Disponível: ${item.estoque}`
            });
        }

        await query(
            'UPDATE carrinho SET quantidade = ?, updated_at = NOW() WHERE id = ?',
            [quantidade, itemId]
        );

        res.json({
            success: true,
            message: 'Quantidade atualizada'
        });

    } catch (error) {
        console.error('Erro ao atualizar carrinho:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar carrinho'
        });
    }
});

/**
 * DELETE /api/carrinho/:itemId
 * Remover item do carrinho
 */
router.delete('/:itemId', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.params;

        // Verificar se item pertence ao usuário
        const [itens] = await query(
            'SELECT id FROM carrinho WHERE id = ? AND usuario_id = ?',
            [itemId, req.user.id]
        );

        if (!itens || itens.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item não encontrado no carrinho'
            });
        }

        await query('DELETE FROM carrinho WHERE id = ?', [itemId]);

        res.json({
            success: true,
            message: 'Item removido do carrinho'
        });

    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao remover item do carrinho'
        });
    }
});

/**
 * DELETE /api/carrinho
 * Limpar carrinho (remover todos os itens)
 */
router.delete('/', authenticateToken, async (req, res) => {
    try {
        await query('DELETE FROM carrinho WHERE usuario_id = ?', [req.user.id]);

        res.json({
            success: true,
            message: 'Carrinho limpo com sucesso'
        });

    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao limpar carrinho'
        });
    }
});

module.exports = router;
