
document.addEventListener('DOMContentLoaded', async function () {
    const produtosContainer = document.getElementById('loja-produtos');
    const contadorResultados = document.getElementById('contadorResultados');

    // State for filtering
    let allProducts = [];
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let filteredProducts = [];

    // Filter State
    const filtrosAtivos = {
        category: [],
        refrigeracao: [],
        construcao: [],
        potencia: [],
        uso: [],
        busca: ''
    };

    // Helper functions for UI
    function activateBtn(btn) {
        if (!btn) return;
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-outline-primary', 'btn-outline-secondary');
    }

    function deactivateBtn(btn) {
        if (!btn) return;
        btn.classList.remove('active', 'btn-primary');
        if (btn.dataset.filterType === 'category') btn.classList.add('btn-outline-primary');
        else btn.classList.add('btn-outline-secondary');
    }

    // Check if API is available
    if (!window.api) {
        console.error('API module not loaded!');
        produtosContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar módulo da API.</div>';
        return;
    }

    // Load products
    try {
        produtosContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';

        // Carregar todos os produtos para filtragem no frontend
        let produtosApi = [];
        try {
            produtosApi = await window.api.getProdutos({ por_pagina: 1000 });
        } catch (apiErr) {
            console.warn('Erro na chamada da API:', apiErr);
        }

        // Se a API retornar dados, usamos. Se não, usamos mock.
        if (produtosApi && produtosApi.length > 0) {
            allProducts = produtosApi;
            console.log('Produtos carregados da API:', allProducts.length);
        } else {
            console.warn('API vazia ou inacessível. Usando fallback de demonstração.');
            // DADOS COMPLETOS EXPORTADOS DO BANCO (66 itens)
            allProducts = [
                {
                    "id": "1ff0d641-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 10 kVA – 220/380 V",
                    "slug": "autotransformador-10-kva-220380-v",
                    "descricao": "Autotransformador 10 kVA para adequação de tensão 220/380 V",
                    "preco": 1793,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1ff285ac-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 10 kVA – 220/440 V",
                    "slug": "autotransformador-10-kva-220440-v",
                    "descricao": "Autotransformador 10 kVA para adequação de tensão 220/440 V",
                    "preco": 2439.8,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1ff7871b-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 15 kVA – 220/380 V",
                    "slug": "autotransformador-15-kva-220380-v",
                    "descricao": "Autotransformador 15 kVA para adequação de tensão 220/380 V",
                    "preco": 2497,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1ffb03b1-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 15 kVA – 220/440 V",
                    "slug": "autotransformador-15-kva-220440-v",
                    "descricao": "Autotransformador 15 kVA para adequação de tensão 220/440 V",
                    "preco": 2970,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "2001ca81-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 20 kVA – 220/380 V",
                    "slug": "autotransformador-20-kva-220380-v",
                    "descricao": "Autotransformador 20 kVA para adequação de tensão 220/380 V",
                    "preco": 2893,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "2006c998-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 20 kVA – 220/440 V",
                    "slug": "autotransformador-20-kva-220440-v",
                    "descricao": "Autotransformador 20 kVA para adequação de tensão 220/440 V",
                    "preco": 3022.8,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "200a4896-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 25 kVA – 220/380 V",
                    "slug": "autotransformador-25-kva-220380-v",
                    "descricao": "Autotransformador 25 kVA para adequação de tensão 220/380 V",
                    "preco": 3025,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "200bf5a8-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 25 kVA – 220/440 V",
                    "slug": "autotransformador-25-kva-220440-v",
                    "descricao": "Autotransformador 25 kVA para adequação de tensão 220/440 V",
                    "preco": 3458.4,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "1fdac596-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 3 kVA – 220/380 V",
                    "slug": "autotransformador-3-kva-220380-v",
                    "descricao": "Autotransformador 3 kVA para adequação de tensão 220/380 V",
                    "preco": 1150.6,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fdc7696-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 3 kVA – 220/440 V",
                    "slug": "autotransformador-3-kva-220440-v",
                    "descricao": "Autotransformador 3 kVA para adequação de tensão 220/440 V",
                    "preco": 1186.9,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "2014750e-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 30 kVA – 220/380 V",
                    "slug": "autotransformador-30-kva-220380-v",
                    "descricao": "Autotransformador 30 kVA para adequação de tensão 220/380 V",
                    "preco": 3476,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "20198dec-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 30 kVA – 220/440 V",
                    "slug": "autotransformador-30-kva-220440-v",
                    "descricao": "Autotransformador 30 kVA para adequação de tensão 220/440 V",
                    "preco": 3894,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "201b3e88-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 40 kVA – 220/380 V",
                    "slug": "autotransformador-40-kva-220380-v",
                    "descricao": "Autotransformador 40 kVA para adequação de tensão 220/380 V",
                    "preco": 4719,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "20203970-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 40 kVA – 220/440 V",
                    "slug": "autotransformador-40-kva-220440-v",
                    "descricao": "Autotransformador 40 kVA para adequação de tensão 220/440 V",
                    "preco": 6039,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "2023b8e8-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 45 kVA – 220/380 V",
                    "slug": "autotransformador-45-kva-220380-v",
                    "descricao": "Autotransformador 45 kVA para adequação de tensão 220/380 V",
                    "preco": 5087.5,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "20256c30-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 45 kVA – 220/440 V",
                    "slug": "autotransformador-45-kva-220440-v",
                    "descricao": "Autotransformador 45 kVA para adequação de tensão 220/440 V",
                    "preco": 6512,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "1fe17e54-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 5 kVA – 220/380 V",
                    "slug": "autotransformador-5-kva-220380-v",
                    "descricao": "Autotransformador 5 kVA para adequação de tensão 220/380 V",
                    "preco": 1309,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fe4f590-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 5 kVA – 220/440 V",
                    "slug": "autotransformador-5-kva-220440-v",
                    "descricao": "Autotransformador 5 kVA para adequação de tensão 220/440 V",
                    "preco": 1529,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "20271a9c-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 50 kVA – 220/380 V",
                    "slug": "autotransformador-50-kva-220380-v",
                    "descricao": "Autotransformador 50 kVA para adequação de tensão 220/380 V",
                    "preco": 5456,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "202c2e8a-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 50 kVA – 220/440 V",
                    "slug": "autotransformador-50-kva-220440-v",
                    "descricao": "Autotransformador 50 kVA para adequação de tensão 220/440 V",
                    "preco": 6985,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "202f9680-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 60 kVA – 220/380 V",
                    "slug": "autotransformador-60-kva-220380-v",
                    "descricao": "Autotransformador 60 kVA para adequação de tensão 220/380 V",
                    "preco": 5918,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "203148f5-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 60 kVA – 220/440 V",
                    "slug": "autotransformador-60-kva-220440-v",
                    "descricao": "Autotransformador 60 kVA para adequação de tensão 220/440 V",
                    "preco": 7205,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:24.000Z"
                },
                {
                    "id": "1fe6a4ab-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 7.5 kVA – 220/380 V",
                    "slug": "autotransformador-75-kva-220380-v",
                    "descricao": "Autotransformador 7.5 kVA para adequação de tensão 220/380 V",
                    "preco": 1556.5,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1febc0ba-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Autotransformador 7.5 kVA – 220/440 V",
                    "slug": "autotransformador-75-kva-220440-v",
                    "descricao": "Autotransformador 7.5 kVA para adequação de tensão 220/440 V",
                    "preco": 1793,
                    "categoria": "autotransformadores",
                    "imagem_principal": "src/imgs/C (3) 1.png",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f91cd2a-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1000 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-1000-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 1000 kVA classe 15 kV",
                    "preco": 92400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f96e250-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1000 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-1000-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 1000 kVA classe 25 kV",
                    "preco": 98600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f9a480f-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1000 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-1000-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 1000 kVA classe 36 kV",
                    "preco": 108400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f4fcb7b-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 112.5 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-1125-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 112.5 kVA classe 15 kV",
                    "preco": 18300,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f5308d2-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 112.5 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-1125-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 112.5 kVA classe 25 kV",
                    "preco": 19500,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f582a81-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 112.5 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-1125-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 112.5 kVA classe 36 kV",
                    "preco": 20800,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f9c046b-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1250 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-1250-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 1250 kVA classe 15 kV",
                    "preco": 115600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fa127d8-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1250 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-1250-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 1250 kVA classe 25 kV",
                    "preco": 123400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fa474d0-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1250 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-1250-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 1250 kVA classe 36 kV",
                    "preco": 135600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f5b7d1f-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 150 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-150-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 150 kVA classe 15 kV",
                    "preco": 22400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f5d2ff6-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 150 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-150-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 150 kVA classe 25 kV",
                    "preco": 23700,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f626d59-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 150 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-150-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 150 kVA classe 36 kV",
                    "preco": 26000,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1fa62793-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1500 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-1500-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 1500 kVA classe 15 kV",
                    "preco": 127600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fb21ad6-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1500 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-1500-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 1500 kVA classe 25 kV",
                    "preco": 135600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fba8f3d-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 1500 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-1500-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 1500 kVA classe 36 kV",
                    "preco": 149100,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fbc3d6a-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2000 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-2000-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 2000 kVA classe 15 kV",
                    "preco": 162600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fbdef41-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2000 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-2000-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 2000 kVA classe 25 kV",
                    "preco": 172500,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fc310e3-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2000 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-2000-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 2000 kVA classe 36 kV",
                    "preco": 187300,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f65a9ed-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 225 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-225-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 225 kVA classe 15 kV",
                    "preco": 29900,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f675ae1-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 225 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-225-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 225 kVA classe 25 kV",
                    "preco": 31700,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f6c8491-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 225 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-225-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 225 kVA classe 36 kV",
                    "preco": 34900,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1fc66c5d-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2500 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-2500-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 2500 kVA classe 15 kV",
                    "preco": 203300,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fc81d90-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2500 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-2500-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 2500 kVA classe 25 kV",
                    "preco": 215600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fcd249a-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 2500 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-2500-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 2500 kVA classe 36 kV",
                    "preco": 234100,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f6fd9d0-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 300 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-300-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 300 kVA classe 15 kV",
                    "preco": 34600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f718843-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 300 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-300-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 300 kVA classe 25 kV",
                    "preco": 36600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f76c2c1-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 300 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-300-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 300 kVA classe 36 kV",
                    "preco": 39100,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fd099f2-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 3000 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-3000-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 3000 kVA classe 15 kV",
                    "preco": 244000,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fd24c91-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 3000 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-3000-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 3000 kVA classe 25 kV",
                    "preco": 258700,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1fd76a45-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 3000 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-3000-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 3000 kVA classe 36 kV",
                    "preco": 280900,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f23691d-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 45 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-45-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 45 kVA classe 15 kV",
                    "preco": 10700,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f3648e2-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 45 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-45-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 45 kVA classe 25 kV",
                    "preco": 11400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f399226-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 45 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-45-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 45 kVA classe 36 kV",
                    "preco": 13600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f7a04cf-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 500 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-500-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 500 kVA classe 15 kV",
                    "preco": 53500,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f7bb56b-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 500 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-500-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 500 kVA classe 25 kV",
                    "preco": 56100,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f80d911-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 500 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-500-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 500 kVA classe 36 kV",
                    "preco": 63000,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f423798-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 75 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-75-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 75 kVA classe 15 kV",
                    "preco": 14900,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f48d3b0-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 75 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-75-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 75 kVA classe 25 kV",
                    "preco": 15900,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f4a8977-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 75 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-75-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 75 kVA classe 36 kV",
                    "preco": 17600,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:22.000Z"
                },
                {
                    "id": "1f87a200-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 750 kVA – Classe 15 kV",
                    "slug": "transformador-a-oleo-750-kva-classe-15-kv",
                    "descricao": "Transformador a óleo de média tensão 750 kVA classe 15 kV",
                    "preco": 72100,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f8cce66-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 750 kVA – Classe 25 kV",
                    "slug": "transformador-a-oleo-750-kva-classe-25-kv",
                    "descricao": "Transformador a óleo de média tensão 750 kVA classe 25 kV",
                    "preco": 76400,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                },
                {
                    "id": "1f901e3f-0817-11f1-bb23-d8bbc13b8ca2",
                    "nome": "Transformador a Óleo 750 kVA – Classe 36 kV",
                    "slug": "transformador-a-oleo-750-kva-classe-36-kv",
                    "descricao": "Transformador a óleo de média tensão 750 kVA classe 36 kV",
                    "preco": 84500,
                    "categoria": "transformadores-oleo",
                    "imagem_principal": "src/imgs/trafos a seco1 .jpeg",
                    "created_at": "2026-02-12T13:31:23.000Z"
                }
            ];
            console.log('Produtos carregados do Fallback:', allProducts.length);
        }

        // Initialize filters and render initial state
        initializeFilters();

    } catch (error) {
        console.error('Erro crítico ao carregar produtos:', error);
        // Fallback de emergência visual
        produtosContainer.innerHTML = '<div class="col-12 text-center text-muted"><p>Carregando catálogo de demonstração...</p></div>';
        // Tentar recarregar página em caso de erro crítico muito persistente, ou apenas deixar a mensagem
    }

    // Helper to extract mapped attributes from a product object
    // Defined early so it can be used if needed, but functions are hoisted so it's fine.

    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            // Remove old listeners to avoid duplicates if any
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFilterClick(newBtn);
            });
        });

        // Initial apply
        applyFilters();
    }

    function handleFilterClick(btn) {
        const type = btn.dataset.filterType;
        const value = btn.dataset.filter;

        if (value === 'all') {
            filtrosAtivos[type] = [];
            // Update UI: deactivate others, activate 'all'
            document.querySelectorAll(`[data-filter-type="${type}"]`).forEach(b => {
                if (b.dataset.filter === 'all') activateBtn(b);
                else deactivateBtn(b);
            });
        } else {
            // Toggle
            const index = filtrosAtivos[type].indexOf(value);
            if (index > -1) {
                filtrosAtivos[type].splice(index, 1);
                deactivateBtn(btn);
                if (filtrosAtivos[type].length === 0) {
                    activateBtn(document.querySelector(`[data-filter-type="${type}"][data-filter="all"]`));
                }
            } else {
                if (filtrosAtivos[type].length >= 2) {
                    alert('Máximo 2 filtros por categoria');
                    return;
                }
                filtrosAtivos[type].push(value);
                activateBtn(btn);
                deactivateBtn(document.querySelector(`[data-filter-type="${type}"][data-filter="all"]`));
            }
        }
        applyFilters();
    }

    // ... (inside window.addToCart is outside, this is inside DOMContentLoaded)

    // Limpar Filtros
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', () => {
            // Reset State
            Object.keys(filtrosAtivos).forEach(key => filtrosAtivos[key] = []);

            // Reset UI Buttons
            document.querySelectorAll('.filter-btn').forEach(btn => deactivateBtn(btn));
            document.querySelectorAll('.filter-btn[data-filter="all"]').forEach(btn => activateBtn(btn));

            applyFilters();
        });
    }

    function updateFilterCounts() {
        // Count items for each filter option based on CURRENT set of products (allProducts)
        // But usually counts show how many matching items exist in TOTAL for that category, 
        // regardless of currently selected other filters (or depending on logic).
        // Let's implement static counts (total in database/loaded) for simplicity and stability first,
        // or dynamic counts based on CURRENT intersection. 
        // UX Standard: Show count of items that match that specific filter value within the current context?
        // Or just total available? The HTML implies dynamic counts (starts with '-').

        // Allow simplified counting: Total items matching this attribute
        const counters = document.querySelectorAll('.filter-count');
        counters.forEach(badge => {
            const type = badge.dataset.filterType;
            const value = badge.dataset.filter;

            let count = 0;
            if (value === 'all') {
                count = allProducts.length;
            } else {
                count = allProducts.filter(p => {
                    // Re-use logic or pre-calculate map?
                    // Using the DOM element logic is hard here because we are iterating data.
                    // We need to simulate the mapping logic.
                    const mapping = getProductMapping(p);
                    return mapping[type] === value;
                }).length;
            }
            badge.textContent = count;
        });
    }

    // Helper to extract mapped attributes from a product object
    function getProductMapping(p) {
        const searchText = (p.nome + ' ' + (p.descricao || '') + ' ' + (p.subtitulo || '')).toLowerCase();

        // Refrigeração
        let refrigeracao = 'ar-natural';
        if (p.categoria === 'transformadores-oleo' || searchText.includes('óleo') || searchText.includes('oleo')) {
            refrigeracao = 'oleo';
        } else if (p.categoria === 'transformadores-isoladores' || searchText.includes('seco')) {
            refrigeracao = 'seco';
        }

        // Construção
        let construcao = 'trifasico';
        if (searchText.includes('monofásico') || searchText.includes('monofasico')) {
            construcao = 'monofasico';
        } else if (searchText.includes('bifásico') || searchText.includes('bifasico')) {
            construcao = 'bifasico';
        }

        // Potência
        let potenciaVal = 0;
        const kvaMatch = p.nome.match(/(\d+(\.\d+)?)(\s|-)*kva/i);
        if (kvaMatch) {
            potenciaVal = parseFloat(kvaMatch[1]);
        }
        let potenciaRange = 'ate-50';
        if (potenciaVal > 150) potenciaRange = 'acima-150';
        else if (potenciaVal > 50) potenciaRange = '50-150';

        // Uso
        let uso = 'interno';
        if (p.categoria === 'transformadores-oleo' || searchText.includes('externo') || searchText.includes('ao tempo')) {
            uso = 'externo';
        }

        return {
            category: p.categoria,
            refrigeracao,
            construcao,
            potencia: potenciaRange,
            uso
        };
    }

    function applyFilters() {
        // Debug
        console.log('Aplicando filtros:', filtrosAtivos);

        filteredProducts = [];

        // We filter from 'allProducts' data source, NOT DOM elements anymore because of pagination!
        // Wait, we need to show/hide DOM elements? No, we render pagination from data.
        // My previous implementation of renderPagination hid/showed DOM elements. 
        // But if pagination only renders 12, where are the others?
        // Ah, renderProducts renders ALL products to DOM initially?
        // Line 24: renderProducts(allProducts). Yes.
        // But if we have 1000 items, rendering 1000 DOM nodes is heavy.
        // Better approach: 'filteredProducts' should be the list of DATA objects.
        // Then renderPagination creates the DOM for the current page.

        // Let's refactor 'applyFilters' to filter DATA, not DOM nodes.
        // This fixes "Nenhum produto encontrado" if DOM nodes were hidden/manipulated wrongly.

        filteredProducts = allProducts.filter(p => {
            const map = getProductMapping(p);

            // Check all active filters
            for (const [key, values] of Object.entries(filtrosAtivos)) {
                if (key === 'busca') continue; // Search implemented separately if needed
                if (values.length > 0) {
                    if (!values.includes(map[key])) return false;
                }
            }
            return true;
        });

        console.log('Produtos filtrados:', filteredProducts.length);

        // Update counter
        if (contadorResultados) contadorResultados.textContent = filteredProducts.length;

        // Update Filter Badges to reflect available options within current selection?
        // Or just static total? Let's stick to updateFilterCounts() calling static totals for now 
        // to ensure they are not 0.
        updateFilterCounts();

        // Reset to page 1 and render
        currentPage = 1;
        renderPagination();
    }

    function formatCategory(cat) {
        if (!cat) return '';
        return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    function truncateString(str, num) {
        if (str.length <= num) return str;
        // Strip HTML tags for safety if description has HTML
        const tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        const text = tmp.textContent || tmp.innerText || "";
        return text.slice(0, num) + '...';
    }

    function renderPagination() {
        const produtosContainer = document.getElementById('loja-produtos');
        produtosContainer.innerHTML = ''; // Clear current view

        if (filteredProducts.length === 0) {
            produtosContainer.innerHTML = `
                    <div class="col-12 no-results text-center py-5">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h4 class="text-muted">Nenhum produto encontrado</h4>
                        <p class="text-muted">Tente ajustar os filtros.</p>
                        <button class="btn btn-outline-primary mt-3" id="btnLimparVazio">Limpar Filtros</button>
                    </div>
                `;
            // Add listener to redundant clear button
            const btn = document.getElementById('btnLimparVazio');
            if (btn) btn.addEventListener('click', () => btnLimparFiltros.click());

            // Clear pagination controls
            const paginacaoContainer = document.getElementById('paginacaoContainer');
            if (paginacaoContainer) paginacaoContainer.innerHTML = '';
            return;
        }

        // Slice data for current page
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = filteredProducts.slice(start, end);

        // Render items for current page
        pageItems.forEach(p => {
            const map = getProductMapping(p); // Re-calc mapping for render attributes if needed

            // Construct HTML (We need to replicate the HTML template from renderProducts)
            // To avoid code duplication, we should have a 'createProductCard(p)' function.
            // For now, I'll allow duplication or refactor slightly.

            let imgSrc = p.imagem_principal || 'src/imgs/placeholder.png';
            // HTML Template
            const html = `
                <div class="col-12 col-md-6 col-lg-4 loja-item" 
                     data-category="${map.category}" 
                     data-id="${p.id}">
                    <div class="card product-card h-100">
                        <div class="position-relative overflow-hidden">
                            <a href="produto-detalhes.html?produto=${p.slug}">
                                <img src="${imgSrc}" class="card-img-top product-image-hover" alt="${p.nome}" loading="lazy">
                                <div class="product-overlay">
                                    <span class="btn btn-light btn-sm rounded-pill px-3 fw-bold">
                                        <i class="fas fa-eye me-2"></i>Ver Detalhes
                                    </span>
                                </div>
                            </a>
                            ${p.destaque ? '<span class="position-absolute top-0 end-0 bg-warning text-dark badge m-2 shadow-sm"><i class="fas fa-star me-1"></i>Destaque</span>' : ''}
                            ${p.novo ? '<span class="position-absolute top-0 start-0 bg-success text-white badge m-2 shadow-sm">Novo</span>' : ''}
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge bg-light text-primary border border-primary bg-opacity-10 rounded-pill">
                                    ${formatCategory(p.categoria)}
                                </span>
                            </div>
                            <h5 class="card-title fw-bold mb-2">
                                <a href="produto-detalhes.html?produto=${p.slug}" class="text-decoration-none text-dark stretched-link">
                                    ${p.nome}
                                </a>
                            </h5>
                            <p class="card-text text-muted small mb-3 flex-grow-1">
                                ${p.subtitulo || truncateString(p.descricao || '', 80)}
                            </p>
                            
                            <div class="product-price mb-3">
                                <div class="d-flex align-items-end">
                                    <h4 class="mb-0 fw-bold text-primary">R$ ${parseFloat(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                                    ${p.preco_antigo ? `<small class="text-muted text-decoration-line-through ms-2">R$ ${parseFloat(p.preco_antigo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>` : ''}
                                </div>
                                <div class="small text-success">
                                    <i class="fas fa-credit-card me-1"></i> 12x de R$ ${(parseFloat(p.preco) / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-add-cart position-relative z-index-10" 
                                        data-product-id="${p.id}" 
                                        data-product-name="${p.nome}"
                                        data-product-price="${p.preco}"
                                        data-product-image="${imgSrc}"
                                        onclick="addToCart(this, event)">
                                    <i class="fas fa-shopping-cart me-2"></i>Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            produtosContainer.insertAdjacentHTML('beforeend', html);
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const paginacaoContainer = document.getElementById('paginacaoContainer');
        if (!paginacaoContainer) return;

        if (totalPages <= 1) {
            paginacaoContainer.innerHTML = '';
            return;
        }

        let html = '';

        // Previous Button
        html += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `;

        // Page Numbers logic (keeps same)
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `
                        <li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next Button
        html += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Próximo">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `;

        paginacaoContainer.innerHTML = html;

        // Add Event Listeners
        paginacaoContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    renderPagination();
                    const scrollTarget = document.getElementById('filtrosContainer') || document.getElementById('loja-produtos');
                    if (scrollTarget) {
                        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    // Global addToCart wrapper
    window.addToCart = function (btn, event) {
        event.preventDefault();
        event.stopPropagation();

        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice);
        const image = btn.dataset.productImage;

        if (window.carrinhoManager) {
            window.carrinhoManager.adicionarItem(id, name, price, image);
        } else {
            console.error('CarrinhoManager not found');
        }
    };
});
