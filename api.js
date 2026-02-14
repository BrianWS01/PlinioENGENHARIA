console.log('Carregando api.js...');
/**
 * API Integration Layer
 * Centralizes all communication with the backend
 */

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : '/api';

const api = {
    /**
     * Get all products with optional filters
     * @param {Object} filters - Query parameters (categoria, busca, etc)
     * @returns {Promise<Array>} List of products
     */
    getProdutos: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/produtos?${queryParams}`);

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            // Fallback para array vazio para não quebrar a UI
            return [];
        }
    },

    /**
     * Get a single product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise<Object|null>} Product detail or null
     */
    getProdutoPorId: async (id) => {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`);

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error(`Erro ao buscar produto ${id}:`, error);
            return null;
        }
    },

    /**
     * Get a single product by Slug
     * @param {string} slug - Product slug
     * @returns {Promise<Object|null>} Product detail or null
     */
    getProdutoBySlug: async (slug) => {
        try {
            const response = await fetch(`${API_URL}/produtos/slug/${slug}`);

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error(`Erro ao buscar produto ${slug}:`, error);
            return null;
        }
    },

    /**
     * Get all categories
     * @returns {Promise<Array>} List of categories
     */
    getCategorias: async () => {
        try {
            const response = await fetch(`${API_URL}/produtos/categorias/lista`);

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    },

    /**
     * Create a new order/quote
     * @param {Object} orcamentoData - Order data
     * @returns {Promise<Object>} Created order
     */
    criarOrcamento: async (orcamentoData) => {
        try {
            const response = await fetch(`${API_URL}/orcamentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orcamentoData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar orçamento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao criar orçamento:', error);
            throw error;
        }
    },

    /**
     * Calculate shipping options
     * @param {string} cep - Zip code
     * @param {Array} itens - Cart items
     * @returns {Promise<Array>} Shipping options
     */
    calcularFrete: async (cep, itens) => {
        try {
            const response = await fetch(`${API_URL}/frete/calcular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cep, itens })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao calcular frete');
            }
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            throw error;
        }
    },

    /**
     * Get order details by ID
     * @param {string|number} id - Order ID
     * @returns {Promise<Object>} Order details
     */
    getOrcamento: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/orcamentos/${id}`, { headers });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar orçamento');
            }
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Erro ao buscar orçamento:', error);
            throw error;
        }
    },
    /**
     * Get all quotes/orders
     * @returns {Promise<Array>} List of orders
     */
    getOrcamentos: async () => {
        try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/orcamentos`, { headers });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar orçamentos');
            }
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Erro ao buscar orçamentos:', error);
            throw error;
        }
    }
};

// Expose to window for global access
window.api = api;
window.API_URL = API_URL;

// AuthManager code removed - moved to auth-manager.js

console.log('API script loaded');
window.api = api;
