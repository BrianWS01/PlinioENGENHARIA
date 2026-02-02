/**
 * Rotas de Produtos
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/produtos
 * Listar produtos (público)
 */
router.get('/', async (req, res) => {
    try {
        const { 
            categoria, 
            subcategoria, 
            busca, 
            min_preco, 
            max_preco,
            pagina = 1,
            por_pagina = 12,
            ordenar = 'nome'
        } = req.query;

        let sql = 'SELECT * FROM produtos WHERE ativo = TRUE';
        const params = [];

        // Filtros
        if (categoria) {
            sql += ' AND categoria = ?';
            params.push(categoria);
        }

        if (subcategoria) {
            sql += ' AND subcategoria = ?';
            params.push(subcategoria);
        }

        if (busca) {
            sql += ' AND (nome LIKE ? OR descricao LIKE ? OR MATCH(nome, descricao) AGAINST(? IN BOOLEAN MODE))';
            const buscaTerm = `%${busca}%`;
            params.push(buscaTerm, buscaTerm, busca);
        }

        if (min_preco) {
            sql += ' AND preco >= ?';
            params.push(parseFloat(min_preco));
        }

        if (max_preco) {
            sql += ' AND preco <= ?';
            params.push(parseFloat(max_preco));
        }

        // Ordenação
        const ordenacoes = {
            'nome': 'nome ASC',
            'preco_asc': 'preco ASC',
            'preco_desc': 'preco DESC',
            'destaque': 'destaque DESC, nome ASC',
            'novo': 'created_at DESC'
        };

        sql += ` ORDER BY ${ordenacoes[ordenar] || 'nome ASC'}`;

        // Paginação
        const offset = (parseInt(pagina) - 1) * parseInt(por_pagina);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(por_pagina), offset);

        const produtos = await query(sql, params);

        // Contar total
        let countSql = 'SELECT COUNT(*) as total FROM produtos WHERE ativo = TRUE';
        const countParams = [];
        
        if (categoria) {
            countSql += ' AND categoria = ?';
            countParams.push(categoria);
        }
        if (subcategoria) {
            countSql += ' AND subcategoria = ?';
            countParams.push(subcategoria);
        }
        if (busca) {
            countSql += ' AND (nome LIKE ? OR descricao LIKE ?)';
            const buscaTerm = `%${busca}%`;
            countParams.push(buscaTerm, buscaTerm);
        }
        if (min_preco) {
            countSql += ' AND preco >= ?';
            countParams.push(parseFloat(min_preco));
        }
        if (max_preco) {
            countSql += ' AND preco <= ?';
            countParams.push(parseFloat(max_preco));
        }

        const [countResult] = await query(countSql, countParams);
        const total = countResult[0]?.total || 0;

        res.json({
            success: true,
            data: produtos,
            paginacao: {
                pagina: parseInt(pagina),
                por_pagina: parseInt(por_pagina),
                total: parseInt(total),
                total_paginas: Math.ceil(total / parseInt(por_pagina))
            }
        });

    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produtos'
        });
    }
});

/**
 * GET /api/produtos/:id
 * Detalhes de um produto
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [produtos] = await query(
            'SELECT * FROM produtos WHERE id = ? AND ativo = TRUE',
            [id]
        );

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        // Incrementar visualizações (opcional)
        await query(
            'UPDATE produtos SET visualizacoes = visualizacoes + 1 WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            data: produtos[0]
        });

    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto'
        });
    }
});

/**
 * GET /api/produtos/slug/:slug
 * Buscar produto por slug
 */
router.get('/slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const [produtos] = await query(
            'SELECT * FROM produtos WHERE slug = ? AND ativo = TRUE',
            [slug]
        );

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            data: produtos[0]
        });

    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto'
        });
    }
});

/**
 * GET /api/produtos/categorias
 * Listar categorias disponíveis
 */
router.get('/categorias/lista', async (req, res) => {
    try {
        const categorias = await query(
            'SELECT DISTINCT categoria, subcategoria FROM produtos WHERE ativo = TRUE ORDER BY categoria, subcategoria'
        );

        res.json({
            success: true,
            data: categorias
        });

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar categorias'
        });
    }
});

/**
 * POST /api/produtos
 * Criar produto (admin apenas)
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            nome,
            descricao,
            descricao_completa,
            subtitulo,
            preco,
            preco_antigo,
            imagem_principal,
            imagens,
            categoria,
            subcategoria,
            slug,
            especificacoes,
            estoque,
            estoque_minimo,
            tags,
            mercado_livre_url
        } = req.body;

        // Validações
        if (!nome || !preco || !categoria) {
            return res.status(400).json({
                success: false,
                message: 'Nome, preço e categoria são obrigatórios'
            });
        }

        // Gerar slug se não fornecido
        let finalSlug = slug;
        if (!finalSlug) {
            finalSlug = nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }

        // Verificar se slug já existe
        const [existing] = await query(
            'SELECT id FROM produtos WHERE slug = ?',
            [finalSlug]
        );

        if (existing && existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Slug já existe'
            });
        }

        // Inserir produto
        const result = await query(
            `INSERT INTO produtos (
                nome, descricao, descricao_completa, subtitulo, preco, preco_antigo,
                imagem_principal, imagens, categoria, subcategoria, slug,
                especificacoes, estoque, estoque_minimo, tags, mercado_livre_url,
                ativo, disponivel
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
            [
                nome,
                descricao || null,
                descricao_completa || null,
                subtitulo || null,
                preco,
                preco_antigo || null,
                imagem_principal || null,
                imagens ? JSON.stringify(imagens) : null,
                categoria,
                subcategoria || null,
                finalSlug,
                especificacoes ? JSON.stringify(especificacoes) : null,
                estoque || 0,
                estoque_minimo || 0,
                tags ? JSON.stringify(tags) : null,
                mercado_livre_url || null
            ]
        );

        // Buscar produto criado
        const [produtos] = await query(
            'SELECT * FROM produtos WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            data: produtos[0]
        });

    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar produto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * PUT /api/produtos/:id
 * Atualizar produto (admin apenas)
 */
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body;

        // Verificar se produto existe
        const [produtos] = await query(
            'SELECT id FROM produtos WHERE id = ?',
            [id]
        );

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        // Construir query de atualização dinamicamente
        const camposPermitidos = [
            'nome', 'descricao', 'descricao_completa', 'subtitulo',
            'preco', 'preco_antigo', 'imagem_principal', 'imagens',
            'categoria', 'subcategoria', 'slug', 'especificacoes',
            'estoque', 'estoque_minimo', 'tags', 'mercado_livre_url',
            'ativo', 'destaque', 'disponivel'
        ];

        const atualizacoes = [];
        const valores = [];

        camposPermitidos.forEach(campo => {
            if (campos[campo] !== undefined) {
                atualizacoes.push(`${campo} = ?`);
                
                // Se for JSON, stringify
                if ((campo === 'imagens' || campo === 'especificacoes' || campo === 'tags') && 
                    typeof campos[campo] === 'object') {
                    valores.push(JSON.stringify(campos[campo]));
                } else {
                    valores.push(campos[campo]);
                }
            }
        });

        if (atualizacoes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum campo para atualizar'
            });
        }

        valores.push(id);

        await query(
            `UPDATE produtos SET ${atualizacoes.join(', ')} WHERE id = ?`,
            valores
        );

        // Buscar produto atualizado
        const [produtosAtualizados] = await query(
            'SELECT * FROM produtos WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            data: produtosAtualizados[0]
        });

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar produto'
        });
    }
});

/**
 * DELETE /api/produtos/:id
 * Deletar produto (admin apenas - soft delete)
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete (marcar como inativo)
        await query(
            'UPDATE produtos SET ativo = FALSE WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Produto removido com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar produto'
        });
    }
});

module.exports = router;
