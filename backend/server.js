/**
 * Servidor Principal - Backend USETRAFO
 * Node.js + Express + MariaDB
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configurações
const { testConnection } = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const carrinhoRoutes = require('./routes/carrinho');
const orcamentosRoutes = require('./routes/orcamentos');
const freteRoutes = require('./routes/frete');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES GLOBAIS
// =====================================================

// Segurança
app.use(helmet());

// CORS
// CORS
// CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requisições por IP
});
app.use('/api/', limiter);

// Rate limiting mais rigoroso para auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 // máximo 5 tentativas de login por 15 minutos
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// =====================================================
// ROTAS
// =====================================================

// Health Check
app.get('/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/orcamentos', orcamentosRoutes);
app.use('/api/frete', freteRoutes);

// Rota padrão
app.get('/', (req, res) => {
    res.json({
        name: 'USETRAFO API',
        version: '1.0.0',
        description: 'Backend API para sistema de e-commerce de transformadores',
        endpoints: {
            auth: '/api/auth',
            produtos: '/api/produtos',
            carrinho: '/api/carrinho',
            orcamentos: '/api/orcamentos'
        }
    });
});

// =====================================================
// MIDDLEWARE DE ERRO
// =====================================================

app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// =====================================================
// INICIALIZAR SERVIDOR
// =====================================================

async function startServer() {
    try {
        // Testar conexão com banco
        console.log('🔌 Testando conexão com MariaDB...');
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('❌ Não foi possível conectar ao banco de dados!');
            console.error('⚠️  Verifique as configurações em .env');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n✅ Servidor iniciado com sucesso!');
            console.log(`📡 API rodando em: http://localhost:${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 Documentação: http://localhost:${PORT}/`);
            console.log(`\n📋 Endpoints disponíveis:`);
            console.log(`   - POST /api/auth/register`);
            console.log(`   - POST /api/auth/login`);
            console.log(`   - GET  /api/auth/me`);
            console.log(`   - GET  /api/produtos`);
            console.log(`   - GET  /api/carrinho`);
            console.log(`   - POST /api/orcamentos`);
            console.log(`\n⚙️  Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Iniciar apenas se for executado diretamente (não importado)
if (require.main === module) {
    startServer();
}

module.exports = app;
