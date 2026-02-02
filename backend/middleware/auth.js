/**
 * Middleware de Autenticação JWT
 */

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware para verificar token JWT
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Token não fornecido' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar se o usuário ainda existe e está ativo
        const [usuarios] = await query(
            'SELECT id, email, nome, is_admin, is_ativo FROM usuarios WHERE id = ? AND is_ativo = TRUE',
            [decoded.userId]
        );

        if (!usuarios || usuarios.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuário não encontrado ou inativo' 
            });
        }

        // Adicionar dados do usuário à requisição
        req.user = usuarios[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expirado' 
            });
        }
        
        return res.status(403).json({ 
            success: false,
            message: 'Token inválido' 
        });
    }
}

// Middleware para verificar se é admin
function requireAdmin(req, res, next) {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ 
            success: false,
            message: 'Acesso negado. Administrador necessário.' 
        });
    }
    next();
}

// Gerar token JWT
function generateToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}

// Gerar refresh token
function generateRefreshToken(userId) {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
}

module.exports = {
    authenticateToken,
    requireAdmin,
    generateToken,
    generateRefreshToken
};
