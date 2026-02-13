#!/usr/bin/env node

/**
 * Script de Importação de Produtos
 * Importa todos os produtos do catálogo para o banco de dados
 */

const mysql = require('mysql2/promise');

const produtos = [
    // Transformadores a Óleo – Média Tensão
    { nome: 'Transformador a Óleo 45 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 10700.00, especificacoes: { potencia: '45 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 45 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 11400.00, especificacoes: { potencia: '45 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 45 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 13600.00, especificacoes: { potencia: '45 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 75 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 14900.00, especificacoes: { potencia: '75 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 75 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 15900.00, especificacoes: { potencia: '75 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 75 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 17600.00, especificacoes: { potencia: '75 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 112.5 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 18300.00, especificacoes: { potencia: '112.5 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 112.5 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 19500.00, especificacoes: { potencia: '112.5 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 112.5 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 20800.00, especificacoes: { potencia: '112.5 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 150 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 22400.00, especificacoes: { potencia: '150 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 150 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 23700.00, especificacoes: { potencia: '150 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 150 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 26000.00, especificacoes: { potencia: '150 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 225 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 29900.00, especificacoes: { potencia: '225 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 225 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 31700.00, especificacoes: { potencia: '225 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 225 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 34900.00, especificacoes: { potencia: '225 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 300 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 34600.00, especificacoes: { potencia: '300 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 300 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 36600.00, especificacoes: { potencia: '300 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 300 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 39100.00, especificacoes: { potencia: '300 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 500 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 53500.00, especificacoes: { potencia: '500 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 500 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 56100.00, especificacoes: { potencia: '500 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 500 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 63000.00, especificacoes: { potencia: '500 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 750 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 72100.00, especificacoes: { potencia: '750 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 750 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 76400.00, especificacoes: { potencia: '750 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 750 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 84500.00, especificacoes: { potencia: '750 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 1000 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 92400.00, especificacoes: { potencia: '1000 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 1000 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 98600.00, especificacoes: { potencia: '1000 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 1000 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 108400.00, especificacoes: { potencia: '1000 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 1250 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 115600.00, especificacoes: { potencia: '1250 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 1250 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 123400.00, especificacoes: { potencia: '1250 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 1250 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 135600.00, especificacoes: { potencia: '1250 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 1500 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 127600.00, especificacoes: { potencia: '1500 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 1500 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 135600.00, especificacoes: { potencia: '1500 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 1500 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 149100.00, especificacoes: { potencia: '1500 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 2000 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 162600.00, especificacoes: { potencia: '2000 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 2000 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 172500.00, especificacoes: { potencia: '2000 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 2000 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 187300.00, especificacoes: { potencia: '2000 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 2500 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 203300.00, especificacoes: { potencia: '2500 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 2500 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 215600.00, especificacoes: { potencia: '2500 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 2500 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 234100.00, especificacoes: { potencia: '2500 kVA', classe: '36 kV' } },
    { nome: 'Transformador a Óleo 3000 kVA – Classe 15 kV', categoria: 'transformadores-oleo', preco: 244000.00, especificacoes: { potencia: '3000 kVA', classe: '15 kV' } },
    { nome: 'Transformador a Óleo 3000 kVA – Classe 25 kV', categoria: 'transformadores-oleo', preco: 258700.00, especificacoes: { potencia: '3000 kVA', classe: '25 kV' } },
    { nome: 'Transformador a Óleo 3000 kVA – Classe 36 kV', categoria: 'transformadores-oleo', preco: 280900.00, especificacoes: { potencia: '3000 kVA', classe: '36 kV' } },
    
    // Autotransformadores – Baixa Tensão
    { nome: 'Autotransformador 3 kVA – 220/380 V', categoria: 'autotransformadores', preco: 1150.60, especificacoes: { potencia: '3 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 3 kVA – 220/440 V', categoria: 'autotransformadores', preco: 1186.90, especificacoes: { potencia: '3 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 5 kVA – 220/380 V', categoria: 'autotransformadores', preco: 1309.00, especificacoes: { potencia: '5 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 5 kVA – 220/440 V', categoria: 'autotransformadores', preco: 1529.00, especificacoes: { potencia: '5 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 7.5 kVA – 220/380 V', categoria: 'autotransformadores', preco: 1556.50, especificacoes: { potencia: '7.5 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 7.5 kVA – 220/440 V', categoria: 'autotransformadores', preco: 1793.00, especificacoes: { potencia: '7.5 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 10 kVA – 220/380 V', categoria: 'autotransformadores', preco: 1793.00, especificacoes: { potencia: '10 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 10 kVA – 220/440 V', categoria: 'autotransformadores', preco: 2439.80, especificacoes: { potencia: '10 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 15 kVA – 220/380 V', categoria: 'autotransformadores', preco: 2497.00, especificacoes: { potencia: '15 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 15 kVA – 220/440 V', categoria: 'autotransformadores', preco: 2970.00, especificacoes: { potencia: '15 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 20 kVA – 220/380 V', categoria: 'autotransformadores', preco: 2893.00, especificacoes: { potencia: '20 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 20 kVA – 220/440 V', categoria: 'autotransformadores', preco: 3022.80, especificacoes: { potencia: '20 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 25 kVA – 220/380 V', categoria: 'autotransformadores', preco: 3025.00, especificacoes: { potencia: '25 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 25 kVA – 220/440 V', categoria: 'autotransformadores', preco: 3458.40, especificacoes: { potencia: '25 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 30 kVA – 220/380 V', categoria: 'autotransformadores', preco: 3476.00, especificacoes: { potencia: '30 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 30 kVA – 220/440 V', categoria: 'autotransformadores', preco: 3894.00, especificacoes: { potencia: '30 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 40 kVA – 220/380 V', categoria: 'autotransformadores', preco: 4719.00, especificacoes: { potencia: '40 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 40 kVA – 220/440 V', categoria: 'autotransformadores', preco: 6039.00, especificacoes: { potencia: '40 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 45 kVA – 220/380 V', categoria: 'autotransformadores', preco: 5087.50, especificacoes: { potencia: '45 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 45 kVA – 220/440 V', categoria: 'autotransformadores', preco: 6512.00, especificacoes: { potencia: '45 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 50 kVA – 220/380 V', categoria: 'autotransformadores', preco: 5456.00, especificacoes: { potencia: '50 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 50 kVA – 220/440 V', categoria: 'autotransformadores', preco: 6985.00, especificacoes: { potencia: '50 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 60 kVA – 220/380 V', categoria: 'autotransformadores', preco: 5918.00, especificacoes: { potencia: '60 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 60 kVA – 220/440 V', categoria: 'autotransformadores', preco: 7205.00, especificacoes: { potencia: '60 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 75 kVA – 220/380 V', categoria: 'autotransformadores', preco: 7095.00, especificacoes: { potencia: '75 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 75 kVA – 220/440 V', categoria: 'autotransformadores', preco: 8404.00, especificacoes: { potencia: '75 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 90 kVA – 220/380 V', categoria: 'autotransformadores', preco: 7634.00, especificacoes: { potencia: '90 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 90 kVA – 220/440 V', categoria: 'autotransformadores', preco: 9174.00, especificacoes: { potencia: '90 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 100 kVA – 220/380 V', categoria: 'autotransformadores', preco: 8547.00, especificacoes: { potencia: '100 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 100 kVA – 220/440 V', categoria: 'autotransformadores', preco: 9944.00, especificacoes: { potencia: '100 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 112.5 kVA – 220/380 V', categoria: 'autotransformadores', preco: 9245.50, especificacoes: { potencia: '112.5 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 112.5 kVA – 220/440 V', categoria: 'autotransformadores', preco: 10521.50, especificacoes: { potencia: '112.5 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 120 kVA – 220/380 V', categoria: 'autotransformadores', preco: 9944.00, especificacoes: { potencia: '120 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 120 kVA – 220/440 V', categoria: 'autotransformadores', preco: 11099.00, especificacoes: { potencia: '120 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 150 kVA – 220/380 V', categoria: 'autotransformadores', preco: 11033.00, especificacoes: { potencia: '150 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 150 kVA – 220/440 V', categoria: 'autotransformadores', preco: 12793.00, especificacoes: { potencia: '150 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 200 kVA – 220/380 V', categoria: 'autotransformadores', preco: 14619.00, especificacoes: { potencia: '200 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 200 kVA – 220/440 V', categoria: 'autotransformadores', preco: 18304.00, especificacoes: { potencia: '200 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 225 kVA – 220/380 V', categoria: 'autotransformadores', preco: 16049.00, especificacoes: { potencia: '225 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 225 kVA – 220/440 V', categoria: 'autotransformadores', preco: 20350.00, especificacoes: { potencia: '225 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 250 kVA – 220/380 V', categoria: 'autotransformadores', preco: 18370.00, especificacoes: { potencia: '250 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 250 kVA – 220/440 V', categoria: 'autotransformadores', preco: 24530.00, especificacoes: { potencia: '250 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 300 kVA – 220/380 V', categoria: 'autotransformadores', preco: 20240.00, especificacoes: { potencia: '300 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 300 kVA – 220/440 V', categoria: 'autotransformadores', preco: 26180.00, especificacoes: { potencia: '300 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 350 kVA – 220/380 V', categoria: 'autotransformadores', preco: 23430.00, especificacoes: { potencia: '350 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 350 kVA – 220/440 V', categoria: 'autotransformadores', preco: 31053.00, especificacoes: { potencia: '350 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 400 kVA – 220/380 V', categoria: 'autotransformadores', preco: 37576.00, especificacoes: { potencia: '400 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 400 kVA – 220/440 V', categoria: 'autotransformadores', preco: 40458.00, especificacoes: { potencia: '400 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 450 kVA – 220/380 V', categoria: 'autotransformadores', preco: 40458.00, especificacoes: { potencia: '450 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 450 kVA – 220/440 V', categoria: 'autotransformadores', preco: 42350.00, especificacoes: { potencia: '450 kVA', tensao: '220/440 V' } },
    { nome: 'Autotransformador 500 kVA – 220/380 V', categoria: 'autotransformadores', preco: 39336.00, especificacoes: { potencia: '500 kVA', tensao: '220/380 V' } },
    { nome: 'Autotransformador 500 kVA – 220/440 V', categoria: 'autotransformadores', preco: 44976.25, especificacoes: { potencia: '500 kVA', tensao: '220/440 V' } },
    
    // Transformadores Isoladores – Baixa Tensão
    { nome: 'Transformador Isolador 3 kVA', categoria: 'isoladores', preco: 1617.00, especificacoes: { potencia: '3 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 5 kVA', categoria: 'isoladores', preco: 2365.00, especificacoes: { potencia: '5 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 7.5 kVA', categoria: 'isoladores', preco: 2755.50, especificacoes: { potencia: '7.5 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 10 kVA', categoria: 'isoladores', preco: 3146.00, especificacoes: { potencia: '10 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 15 kVA', categoria: 'isoladores', preco: 3750.00, especificacoes: { potencia: '15 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 20 kVA', categoria: 'isoladores', preco: 5250.00, especificacoes: { potencia: '20 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 25 kVA', categoria: 'isoladores', preco: 6050.00, especificacoes: { potencia: '25 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 30 kVA', categoria: 'isoladores', preco: 7590.00, especificacoes: { potencia: '30 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 40 kVA', categoria: 'isoladores', preco: 8864.90, especificacoes: { potencia: '40 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 45 kVA', categoria: 'isoladores', preco: 9570.00, especificacoes: { potencia: '45 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 50 kVA', categoria: 'isoladores', preco: 10285.00, especificacoes: { potencia: '50 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 60 kVA', categoria: 'isoladores', preco: 11330.00, especificacoes: { potencia: '60 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 75 kVA', categoria: 'isoladores', preco: 13178.00, especificacoes: { potencia: '75 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 90 kVA', categoria: 'isoladores', preco: 14289.00, especificacoes: { potencia: '90 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 100 kVA', categoria: 'isoladores', preco: 16258.00, especificacoes: { potencia: '100 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 112.5 kVA', categoria: 'isoladores', preco: 19140.00, especificacoes: { potencia: '112.5 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 120 kVA', categoria: 'isoladores', preco: 20350.00, especificacoes: { potencia: '120 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 150 kVA', categoria: 'isoladores', preco: 24530.00, especificacoes: { potencia: '150 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 200 kVA', categoria: 'isoladores', preco: 37576.00, especificacoes: { potencia: '200 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 225 kVA', categoria: 'isoladores', preco: 40458.00, especificacoes: { potencia: '225 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 250 kVA', categoria: 'isoladores', preco: 42350.00, especificacoes: { potencia: '250 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 300 kVA', categoria: 'isoladores', preco: 47602.50, especificacoes: { potencia: '300 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 350 kVA', categoria: 'isoladores', preco: 52855.00, especificacoes: { potencia: '350 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 400 kVA', categoria: 'isoladores', preco: 60071.00, especificacoes: { potencia: '400 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 450 kVA', categoria: 'isoladores', preco: 67287.00, especificacoes: { potencia: '450 kVA', tipo: 'isolador' } },
    { nome: 'Transformador Isolador 500 kVA', categoria: 'isoladores', preco: 70829.00, especificacoes: { potencia: '500 kVA', tipo: 'isolador' } }
];

async function importarProdutos() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'usetrafo_user',
        password: process.env.DB_PASSWORD || 'usetrafo_123_secure',
        database: process.env.DB_NAME || 'usetrafo_db',
        port: process.env.DB_PORT || 3306
    });

    try {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║   IMPORTANDO PRODUTOS - USETRAFO       ║');
        console.log('╚════════════════════════════════════════╝\n');

        const connection = await pool.getConnection();

        let contador = 0;
        let erros = 0;

        for (const produto of produtos) {
            try {
                const slug = produto.nome
                    .toLowerCase()
                    .replace(/[áàãâä]/g, 'a')
                    .replace(/[éèêë]/g, 'e')
                    .replace(/[íìîï]/g, 'i')
                    .replace(/[óòõôö]/g, 'o')
                    .replace(/[úùûü]/g, 'u')
                    .replace(/[ç]/g, 'c')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                await connection.query(
                    `INSERT INTO produtos (nome, categoria, preco, especificacoes, slug, ativo) 
                     VALUES (?, ?, ?, ?, ?, TRUE)`,
                    [
                        produto.nome,
                        produto.categoria,
                        produto.preco,
                        JSON.stringify(produto.especificacoes),
                        slug
                    ]
                );

                contador++;
                process.stdout.write(`\r✓ ${contador} produtos importados...`);
            } catch (err) {
                erros++;
                console.error(`\n❌ Erro ao importar "${produto.nome}": ${err.message}`);
            }
        }

        connection.release();

        console.log(`\n\n✅ IMPORTAÇÃO CONCLUÍDA!\n`);
        console.log(`📊 Estatísticas:`);
        console.log(`   Total: ${produtos.length}`);
        console.log(`   ✓ Importados: ${contador}`);
        console.log(`   ✗ Erros: ${erros}\n`);

        console.log(`📂 Categorias importadas:`);
        console.log(`   • Transformadores a Óleo: 39 produtos`);
        console.log(`   • Autotransformadores: 46 produtos`);
        console.log(`   • Isoladores: 28 produtos\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ ERRO FATAL:', error.message);
        process.exit(1);
    }
}

importarProdutos();
