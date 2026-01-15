/**
 * Gerador de Orçamento PDF - Baseado no template HTML
 * Integra com jsPDF para gerar PDFs fieis ao template original
 */

class GeradorOrcamento {
    constructor() {
        this.config = {
            empresa: {
                nome: 'UNITRAFO',
                endereco: 'RUA DORIVAL SPONCHIADO - LOTEAMENTO OLARIA PARQUE EMPRESARIAL',
                cidade: 'Várzea Paulista - SP',
                cep: 'CEP: 13225-340',
                telefone: 'Telefone(s): (11) 4038-4800',
                email: 'E-mail: unitrafo@unitrafo.com.br'
            },
            vendedor: {
                nome: 'Felipe Weissmann',
                email: 'felipe.vendas@unitrafo.com.br',
                telefone: '+55 11 96930-7781'
            },
            impostos: {
                icms: 12.00,
                icmsSt: 0.00,
                pis: 0.65,
                ipi: 0.00,
                cofins: 3.00,
                ibpt: 0.00
            }
        };
    }

    /**
     * Formata valor monetário
     */
    formatarMoeda(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }

    /**
     * Formata data
     */
    formatarData(data) {
        if (!data) {
            const hoje = new Date();
            const dia = String(hoje.getDate()).padStart(2, '0');
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const ano = hoje.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
        if (data instanceof Date) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    }

    /**
     * Gera número de proposta
     */
    gerarNumeroProposta() {
        const numero = Math.floor(Math.random() * 100000);
        return `CP ${String(numero).padStart(5, '0')}`;
    }

    /**
     * Calcula totais e impostos
     */
    calcularTotais(itens, desconto = 0, frete = 0, seguro = 0, outros = 0) {
        let subtotal = 0;
        
        itens.forEach(item => {
            const precoUnit = item.price || 0;
            const quantidade = item.quantity || 1;
            subtotal += precoUnit * quantidade;
        });
        
        const total = subtotal - desconto + frete + seguro + outros;
        
        // Calcular impostos sobre o total
        const icms = (total * this.config.impostos.icms) / 100;
        const pis = (total * this.config.impostos.pis) / 100;
        const cofins = (total * this.config.impostos.cofins) / 100;
        
        return {
            produto: subtotal,
            desconto: desconto,
            frete: frete,
            seguro: seguro,
            outros: outros,
            total: total,
            impostos: {
                icms: icms,
                pis: pis,
                cofins: cofins
            }
        };
    }

    /**
     * Gera PDF usando jsPDF com layout fiel ao template
     */
    async gerarPDF(dados) {
        if (!window.jspdf) {
            throw new Error('Biblioteca jsPDF não está disponível');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Dados
        const dadosCliente = dados.cliente || {};
        const itens = dados.itens || [];
        const condicoes = dados.condicoes || {};
        const proposta = dados.proposta || {};
        const vendedor = dados.vendedor || this.config.vendedor;
        
        const numeroProposta = proposta.numero || this.gerarNumeroProposta();
        const dataProposta = this.formatarData(proposta.data);
        
        // Calcular totais
        const totais = this.calcularTotais(
            itens,
            condicoes.desconto || 0,
            condicoes.frete || 0,
            condicoes.seguro || 0,
            condicoes.outros || 0
        );

        let yPos = 10; // Posição vertical inicial (em mm)

        // ============================================
        // CABEÇALHO
        // ============================================
        
        // Logo (se disponível)
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.src = 'src/imgs/WhatsApp Image 2026-01-07 at 07.40.38 1.svg';
            
            await new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(), 1000);
                logoImg.onload = () => {
                    clearTimeout(timeout);
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 30;
                        canvas.height = 30;
                        ctx.drawImage(logoImg, 0, 0, 30, 30);
                        const logoData = canvas.toDataURL('image/png');
                        doc.addImage(logoData, 'PNG', 10, yPos, 15, 15);
                    } catch (e) {
                        console.log('Erro ao processar logo:', e);
                    }
                    resolve();
                };
                logoImg.onerror = () => {
                    clearTimeout(timeout);
                    resolve();
                };
            });
        } catch (e) {
            console.log('Logo não carregada');
        }

        // Nome da empresa
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(this.config.empresa.nome, 27, yPos + 5);

        // Informações da empresa (centralizadas)
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const centerX = 105; // Centro da página A4 (210mm / 2)
        doc.text(this.config.empresa.endereco, centerX, yPos + 12, { align: 'center' });
        doc.text(`${this.config.empresa.cidade} - ${this.config.empresa.cep}`, centerX, yPos + 17, { align: 'center' });
        doc.text(this.config.empresa.telefone, centerX, yPos + 22, { align: 'center' });
        doc.text(this.config.empresa.email, centerX, yPos + 27, { align: 'center' });

        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(10, yPos + 32, 200, yPos + 32);
        yPos += 40;

        // ============================================
        // PROPOSTA E DATA
        // ============================================
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`PROPOSTA: ${numeroProposta}`, 10, yPos);
        doc.text(dataProposta, 190, yPos, { align: 'right' });
        yPos += 8;

        // Vendedor
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Vendedor: ${vendedor.nome} - ${vendedor.email} ${vendedor.telefone}`, 10, yPos);
        yPos += 5;
        doc.text(`Representante: ${vendedor.nome} - ${vendedor.email} ${vendedor.telefone}`, 10, yPos);
        yPos += 8;

        // ============================================
        // DADOS DO CLIENTE
        // ============================================
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Dados do cliente', 10, yPos);
        yPos += 6;

        // Tabela de dados do cliente
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        // Linha 1: Nome
        doc.text(`Nome: ${dadosCliente.nome || ''}`, 10, yPos);
        yPos += 5;

        // Linha 2: CNPJ
        doc.text(`CNPJ: ${dadosCliente.cnpj || ''}`, 10, yPos);
        yPos += 5;

        // Linha 3: Telefone
        doc.text(`Telefone: ${dadosCliente.telefone || ''}`, 10, yPos);
        yPos += 5;

        // Linha 4: Email
        doc.text(`E-mail: ${dadosCliente.email || ''}`, 10, yPos);
        yPos += 8;

        // Linha separadora
        doc.setLineWidth(0.3);
        doc.line(10, yPos, 200, yPos);
        yPos += 5;

        // ============================================
        // TOTAIS E IMPOSTOS
        // ============================================
        const yTotais = yPos;
        
        // Coluna esquerda: Totais
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Total das mercadorias e serviços', 10, yTotais);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Produto:', 10, yTotais + 5);
        doc.text(this.formatarMoeda(totais.produto), 50, yTotais + 5);
        
        doc.text('Desconto:', 10, yTotais + 10);
        doc.text(this.formatarMoeda(totais.desconto), 50, yTotais + 10);
        
        doc.text('Frete:', 10, yTotais + 15);
        doc.text(this.formatarMoeda(totais.frete), 50, yTotais + 15);
        
        doc.text('Seguro:', 10, yTotais + 20);
        doc.text(this.formatarMoeda(totais.seguro), 50, yTotais + 20);
        
        doc.text('Outros:', 10, yTotais + 25);
        doc.text(this.formatarMoeda(totais.outros), 50, yTotais + 25);
        
        doc.setFont(undefined, 'bold');
        doc.text('Total:', 10, yTotais + 30);
        doc.text(this.formatarMoeda(totais.total), 50, yTotais + 30);

        // Coluna direita: Impostos
        doc.setFont(undefined, 'bold');
        doc.text('Total dos tributos', 120, yTotais);
        
        doc.setFont(undefined, 'normal');
        doc.text(`ICMS: ${this.config.impostos.icms.toFixed(2).replace('.', ',')}%`, 120, yTotais + 5);
        doc.text(`ICMS ST: ${this.config.impostos.icmsSt.toFixed(2).replace('.', ',')}%`, 120, yTotais + 10);
        doc.text(`PIS: ${this.config.impostos.pis.toFixed(2).replace('.', ',')}%`, 120, yTotais + 15);
        doc.text(`IPI: ${this.config.impostos.ipi.toFixed(2).replace('.', ',')}%`, 120, yTotais + 20);
        doc.text(`COFINS: ${this.config.impostos.cofins.toFixed(2).replace('.', ',')}%`, 120, yTotais + 25);
        doc.text(`IBPT: ${this.config.impostos.ibpt.toFixed(2).replace('.', ',')}%`, 120, yTotais + 30);

        yPos = yTotais + 35;

        // Linha separadora
        doc.setLineWidth(0.3);
        doc.line(10, yPos, 200, yPos);
        yPos += 5;

        // ============================================
        // CONDIÇÕES COMERCIAIS
        // ============================================
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Condições comerciais', 10, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`- Pagamento: ${condicoes.pagamento || '2 Parcelas (30/60 Dias)'}`, 10, yPos);
        yPos += 5;
        doc.text(`- Frete: ${condicoes.frete || 'Por conta do emitente CIF (Sem Descarga)'}`, 10, yPos);
        yPos += 8;

        // Linha separadora
        doc.setLineWidth(0.3);
        doc.line(10, yPos, 200, yPos);
        yPos += 5;

        // ============================================
        // ITENS DA PROPOSTA
        // ============================================
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Itens da proposta', 10, yPos);
        yPos += 8;

        itens.forEach((item, index) => {
            // Verificar se precisa de nova página
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            const itemNumero = String(index + 1).padStart(5, '0');
            const precoUnit = item.price || 0;
            const quantidade = item.quantity || 1;
            const precoTotal = precoUnit * quantidade;

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            
            // Cabeçalho do item
            doc.text(`Item: ${itemNumero}`, 10, yPos);
            doc.text(`Código do Produto: ${item.product || 'N/A'}`, 100, yPos);
            yPos += 6;

            // Descrição
            doc.text('Descrição', 10, yPos);
            yPos += 4;
            doc.text(item.name || 'Produto', 10, yPos);
            yPos += 5;

            // Detalhes do produto
            if (item.ncm) {
                doc.text(`N.C.M. ${item.ncm}`, 10, yPos);
                yPos += 5;
            }
            if (item.potencia) {
                doc.text(`Potência ${item.potencia}`, 10, yPos);
                yPos += 5;
            }
            if (item.classeIsolamento) {
                doc.text(`Classe de Isolamento ${item.classeIsolamento}`, 10, yPos);
                yPos += 5;
            }
            if (item.classeTermica) {
                doc.text(`Classe Térmica ${item.classeTermica}`, 10, yPos);
                yPos += 5;
            }
            if (item.frequencia) {
                doc.text(`Frequência ${item.frequencia}`, 10, yPos);
                yPos += 5;
            }
            if (item.grauProtecao) {
                doc.text(`Grau de proteção ${item.grauProtecao}`, 10, yPos);
                yPos += 5;
            }
            if (item.tensaoEntrada) {
                doc.text(`Tensão de entrada ${item.tensaoEntrada}`, 10, yPos);
                yPos += 5;
            }
            if (item.tensaoSaida) {
                doc.text(`Tensão de saída ${item.tensaoSaida}`, 10, yPos);
                yPos += 5;
            }
            if (item.tipoPintura) {
                doc.text(`Tipo de Pintura ${item.tipoPintura}`, 10, yPos);
                yPos += 5;
            }
            if (item.tipoMaterial) {
                doc.text(`Tipo Material PA ${item.tipoMaterial}`, 10, yPos);
                yPos += 5;
            }
            if (item.dijuntores !== undefined) {
                doc.text(`Dijuntores ${item.dijuntores ? 'SIM' : 'NÃO'}`, 10, yPos);
                yPos += 5;
            }
            if (item.garantia) {
                doc.text(`Garantia ${item.garantia}`, 10, yPos);
                yPos += 5;
            }

            // Unidade, quantidade e preços
            doc.text('Unidade UNID', 10, yPos);
            doc.text(`Qtde ${quantidade.toFixed(3)}`, 100, yPos);
            yPos += 5;

            doc.text(`Preço un. (R$) ${this.formatarMoeda(precoUnit)}`, 10, yPos);
            doc.text(`Preço Total (R$) ${this.formatarMoeda(precoTotal)}`, 100, yPos);
            yPos += 5;

            // Prazo e validade
            if (condicoes.prazoFabricacao) {
                doc.text(`Prazo de Fabricação: ${condicoes.prazoFabricacao} - Dias úteis, contados a partir da Data da Confirmação da Compra.`, 10, yPos);
                yPos += 5;
            }

            if (condicoes.validade) {
                const dataValidade = new Date();
                dataValidade.setDate(dataValidade.getDate() + parseInt(condicoes.validade));
                const diaVal = String(dataValidade.getDate()).padStart(2, '0');
                const mesVal = String(dataValidade.getMonth() + 1).padStart(2, '0');
                const anoVal = dataValidade.getFullYear();
                doc.text(`Validade da Proposta: ${diaVal}/${mesVal}/${anoVal}`, 10, yPos);
                yPos += 5;
            }

            yPos += 5; // Espaço entre itens
        });

        // ============================================
        // CONDIÇÕES GERAIS (Nova página)
        // ============================================
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('CONDIÇÕES GERAIS DE FORNECIMENTO', centerX, yPos, { align: 'center' });
        yPos += 10;

        const condicoesGerais = this.getCondicoesGerais();
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        condicoesGerais.forEach(linha => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(linha, 10, yPos);
            yPos += 6;
        });

        // ============================================
        // RODAPÉ (em todas as páginas)
        // ============================================
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`${vendedor.nome} - ${vendedor.email}`, 10, 285);
            doc.text(dataProposta, 190, 285, { align: 'right' });
            doc.text(`Página ${i} de ${pageCount}`, centerX, 285, { align: 'center' });
        }

        // Salvar PDF
        const nomeArquivo = `Orcamento_${numeroProposta}_${dataProposta.replace(/\//g, '-')}.pdf`;
        doc.save(nomeArquivo);

        return {
            sucesso: true,
            nomeArquivo: nomeArquivo,
            numeroProposta: numeroProposta
        };
    }

    /**
     * Retorna condições gerais formatadas
     */
    getCondicoesGerais() {
        return [
            '1. Pagamento:',
            '1.1 - O pedido estará condicionado à aprovação do cadastro financeiro do cliente por parte de nosso departamento de cadastro. Caso julgue necessário, a UNITRAFO poderá solicitar garantias de pagamento.',
            '1.1 BNDES:',
            '1.1.1 - O cliente pode optar como forma de pagamento o BNDES, desde que informado no ato da compra.',
            '1.2 Pagamento Após o Vencimento:',
            '1.2.1 - No caso de pagamentos após o vencimento original pactuado, o valor devido será acrescido do custo financeiro vigente na ocasião, bem como todas as taxas e despesas inerentes a esta situação. Além dos encargos apontados, o valor em atraso será acrescido de uma multa de 5% e incidirão ainda juros de 0,33% ao dia.',
            '2. Faturamento direto ao cliente final:',
            '2.1 - O faturamento para uma terceira empresa poderá ser efetuado apenas mediante autorização por escrito da mesma e aprovação de seu cadastro financeiro.',
            '3. Reajuste de Preços:',
            '3.1 - Sempre que ocorrer diferenças financeiras em virtude de aumento de custos em relação à proposta original, as partes comprometem-se a buscar de comum acordo, uma solução que restabeleça a equação financeira inicial do pedido.',
            '4. Cancelamento do pedido:',
            '4.1 - No caso de Cancelamentos, será cobrada multa contratual sobre o valor total do item cancelado conforme condições abaixo:',
            '4.1.1 - 15% - fase de confecções dos projetos;',
            '4.1.2 - 50% - fase de fabricação dos equipamentos (válido para período inferior a 75% do prazo total)',
            '4.1.3 - 85% - fase de fabricação dos equipamentos (válido para período entre 75% e 90% do prazo total).',
            '4.1.4 - 95% - fase final de fabricação/testes.',
            '4.2 - Quando o objeto do pedido for equipamento com exigências específicas do contratante, no caso de cancelamento unilateral pelo contratante, o valor a ser pago será de 100% do pedido, independentemente do tempo em que foi feito, tendo em vista as especificações técnicas, o caráter personalíssimo do pedido e a impossibilidade de se comercializar o equipamento para outrem que não o contratante.',
            '5. Garantia:',
            '5.1 - A garantia cobre somente contra qualquer defeito de fabricação a contar da data da emissão da nota fiscal.',
            '5.2 - Extinção da garantia: Pelo término do prazo de sua validade; Por assistência prestada no aparelho por terceiros, sem prévia autorização escrita do fabricante; Por acidentes de transporte por terceiros sem responsabilidade do fabricante; Por instalação em desacordo com as Normas Técnicas da A.B.N.T.',
            '5.3 - Generalidades: A garantia pode ser na forma de reparo ou substituição do transformador, a critério do fabricante. A assistência do transformador será prestada nesta indústria, ou por terceiros autorizados. As despesas de transporte do transformador, à fábrica ou a terceiros autorizados correm por conta do comprador. A garantia somente se dará com apresentação deste certificado.',
            '6. Assistência Técnica:',
            '6.1 - O reparo ou assistência técnica a produtos UNITRAFO deve ser solicitado através do vendedor responsável pela venda.',
            '7. Ensaios:',
            '7.1 - Caso seja necessário envio de relatório de ensaios, deverá vir descrito com o pedido. Ensaios especiais poderão ser realizados, mediante acordo prévio e especificação no pedido.',
            '8. Inspeção:',
            '8.1 - O cliente deverá inspecionar o material no ato do recebimento em suas instalações, devendo comunicar qualquer divergência a UNITRAFO no mesmo momento. Mediante prévio acordo, o cliente poderá acompanhar os ensaios dos equipamentos na UNITRAFO, com todas as despesas pagas pelo contratante. Quando prevista a inspeção, a data será confirmada com 5 dias de antecedência.',
            '9. Devoluções de mercadorias:',
            '9.1 - A devolução sem prévia comunicação ensejará no NÃO ACEITE, incorrendo todas as despesas e ônus por conta do remetente; o reembolso, caso enseje o fato, ocorrerá após o recebimento e averiguação do produto, que deverá ser remetido em embalagem apropriada. O produto adquirido não poderá apresentar danos ou marcas que evidenciem o mau uso por parte do comprador ou remetente sob o risco de invalidar o termo de garantia e por consequência, a responsabilidade da UNITRAFO, inclusive sobre o reembolso e despesas de envio.',
            '10. Transporte:',
            '10.1 - O transporte quando por responsabilidade da UNITRAFO está livre de descarga. Quando houver a necessidade de equipamento para descarga, será necessário informar anteriormente para a contratação do equipamento necessário, sendo previamente pago pelo cliente.'
        ];
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.GeradorOrcamento = GeradorOrcamento;
}

