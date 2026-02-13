/**
 * Configuração de Conexão com Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://oamrsklfhlwnsxtohsjm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbXJza2xmaGx3bnN4dG9oc2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1ODgwNzgsImV4cCI6MjA4MTE2NDA3OH0.i8jTEnbRVkenD0l2gZk-W1vROoe9ZFQ7s_A2KSxttu0';

// Cliente Supabase (service role para operações administrativas)
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Testar conexão
async function testConnection() {
    try {
        // Testar conexão fazendo uma query simples
        const { data, error } = await supabase
            .from('admin_users')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Erro na conexão com Supabase:', error.message);
            return false;
        }

        console.log('✅ Conexão com Supabase estabelecida!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao Supabase:', error.message);
        console.error('   Verifique as credenciais em .env');
        return false;
    }
}

// Função auxiliar para executar queries
async function query(table, operation = 'select', options = {}) {
    try {
        let queryBuilder = supabase.from(table);

        switch (operation) {
            case 'select':
                queryBuilder = queryBuilder.select(options.columns || '*', options.options || {});
                if (options.filters) {
                    Object.entries(options.filters).forEach(([key, value]) => {
                        queryBuilder = queryBuilder.eq(key, value);
                    });
                }
                break;

            case 'insert':
                queryBuilder = queryBuilder.insert(options.data, options.options || {});
                break;

            case 'update':
                queryBuilder = queryBuilder.update(options.data, options.options || {});
                if (options.filters) {
                    Object.entries(options.filters).forEach(([key, value]) => {
                        queryBuilder = queryBuilder.eq(key, value);
                    });
                }
                break;

            case 'delete':
                queryBuilder = queryBuilder.delete(options.options || {});
                if (options.filters) {
                    Object.entries(options.filters).forEach(([key, value]) => {
                        queryBuilder = queryBuilder.eq(key, value);
                    });
                }
                break;

            default:
                throw new Error(`Operação não suportada: ${operation}`);
        }

        const { data, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erro na query:', error.message);
        throw error;
    }
}

// Funções específicas para operações comuns
async function getUserById(userId) {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
}

async function createUser(email, password, userData = {}) {
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: userData,
        email_confirm: true
    });
    if (error) throw error;
    return data.user;
}

async function updateUser(userId, updates) {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);
    if (error) throw error;
    return data.user;
}

async function deleteUser(userId) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
}

module.exports = {
    supabase,
    query,
    testConnection,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
