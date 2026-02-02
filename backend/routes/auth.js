/**
 * Rotas de Autenticação
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken, generateRefreshToken, authenticateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Registrar novo usuário
 */
router.post('/register', async (req, res) => {
    try {
        const { email, senha, nome, telefone, cpf_cnpj, empresa } = req.body;

        // Validações básicas
        if (!email || !senha || !nome) {
            return res.status(400).json({
                success: false,
                message: 'Email, senha e nome são obrigatórios'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        // Validar senha (mínimo 6 caracteres)
        if (senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Senha deve ter no mínimo 6 caracteres'
            });
        }

        // Verificar se email já existe
        const [existing] = await query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existing && existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }

        // Gerar hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Inserir usuário
        const result = await query(
            `INSERT INTO usuarios (email, senha_hash, nome, telefone, cpf_cnpj, empresa, email_verificado, is_ativo)
             VALUES (?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
            [email, senhaHash, nome, telefone || null, cpf_cnpj || null, empresa || null]
        );

        const userId = result.insertId || result[0]?.id;

        // Gerar tokens
        const token = generateToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // Buscar dados do usuário criado
        const [usuarios] = await query(
            'SELECT id, email, nome, telefone, empresa, cpf_cnpj, is_admin, is_ativo, created_at FROM usuarios WHERE id = ?',
            [userId]
        );

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                user: usuarios[0],
                token,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/auth/login
 * Fazer login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validações
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // Buscar usuário
        const [usuarios] = await query(
            'SELECT id, email, senha_hash, nome, telefone, empresa, is_admin, is_ativo FROM usuarios WHERE email = ?',
            [email]
        );

        if (!usuarios || usuarios.length === 0) {
            // Não revelar se o email existe ou não (segurança)
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        const user = usuarios[0];

        // Verificar se usuário está ativo
        if (!user.is_ativo) {
            return res.status(403).json({
                success: false,
                message: 'Usuário inativo. Entre em contato com o administrador.'
            });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        // Atualizar último login
        await query(
            'UPDATE usuarios SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Gerar tokens
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Remover senha_hash da resposta
        delete user.senha_hash;

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                user,
                token,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/auth/me
 * Obter dados do usuário autenticado
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [usuarios] = await query(
            'SELECT id, email, nome, telefone, empresa, cpf_cnpj, is_admin, is_ativo, created_at, last_login FROM usuarios WHERE id = ?',
            [req.user.id]
        );

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            data: usuarios[0]
        });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

/**
 * POST /api/auth/refresh
 * Renovar token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token não fornecido'
            });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (decoded.type !== 'refresh') {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // Gerar novos tokens
        const token = generateToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        res.json({
            success: true,
            data: {
                token,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
});

/**
 * POST /api/auth/logout
 * Fazer logout (invalidar token - implementar blacklist se necessário)
 */
router.post('/logout', authenticateToken, (req, res) => {
    // Em um sistema mais robusto, você invalidaria o token aqui
    // Por enquanto, apenas retornamos sucesso
    res.json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
});

module.exports = router;
