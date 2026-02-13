/**
 * API Integration Layer
 * Centralizes all communication with the backend
 */

const API_URL = 'http://localhost:3000/api';

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
    }
};

// Expose to window for global access
window.api = api;
