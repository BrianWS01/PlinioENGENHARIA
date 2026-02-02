-- =====================================================
-- SCRIPT DE IMPORTAÇÃO DE PRODUTOS COMPLETO
-- Importa todos os produtos do catálogo
-- Total: 0 produtos
-- =====================================================

USE usetrafo_db;

-- Limpar produtos existentes (OPCIONAL - descomente se quiser limpar antes)
-- DELETE FROM produtos;

-- =====================================================
-- INSERÇÃO DE PRODUTOS
-- =====================================================

-- ⚠️ ATENÇÃO: Nenhum produto encontrado no catálogo!
-- Verifique o arquivo catalogo-produtos.js

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

SELECT 'Produtos importados com sucesso!' as mensagem;
SELECT COUNT(*) as total_produtos FROM produtos;

-- Ver produtos por categoria
SELECT categoria, COUNT(*) as total FROM produtos GROUP BY categoria;
