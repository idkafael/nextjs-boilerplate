// SyncPay Real Integration
const SyncPayReal = {
  config: {
    baseUrl: '/api', // Aponta para a API Route do Next.js
    valor: 990, // R$ 9,90 em centavos (vitalício)
    webhookUrl: null,
    planoAtual: 'Vitalício'
  },

  estado: {
    qrCodeAtivo: false,
    intervaloVerificacao: null,
    valorAtual: 990,
    transactionId: null
  },

  atualizarValorPlano(valor, plano) {
    this.config.valor = Math.round(valor * 100); // Converter para centavos
    this.estado.valorAtual = this.config.valor;
    this.config.planoAtual = plano;
    console.log(`📊 Valor atualizado: R$ ${valor.toFixed(2)} - ${plano}`);
  },

  async criarPix(splitRules = null) {
    try {
      this.atualizarStatus('Gerando pagamento...');
      console.log('🔍 Criando PIX via API Route SyncPay...', {
        valor: this.estado.valorAtual,
        plano: this.config.planoAtual,
        splitRules: splitRules
      });

      // Preparar payload
      const payload = {
        action: 'create-pix',
        valor: this.estado.valorAtual,
        plano: this.config.planoAtual
      };

      // Adicionar split se fornecido
      // Exemplo de uso: syncPay.criarPix([{user_id: 'uuid-afiliado', percentage: 10}])
      if (splitRules && Array.isArray(splitRules) && splitRules.length > 0) {
        payload.split_rules = splitRules;
        console.log('💰 Split configurado:', splitRules);
      }

      const response = await fetch(`${this.config.baseUrl}/syncpay`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Erro desconhecido ao criar PIX';
        console.error('❌ Erro na API SyncPay:', {
          status: response.status,
          error: errorMsg,
          details: data
        });

        this.atualizarStatus(`Erro: ${errorMsg}`);
        throw new Error(`SyncPay API Error: ${errorMsg}`);
      }

      console.log('✅ PIX criado com sucesso via SyncPay:', data);

      // Exibir QR Code e código PIX
      // Conforme documentação oficial: https://syncpay.apidog.io
      // A resposta tem estrutura: { message, pix_code, identifier }
      const pixCode = data.pix_code;
      const identifier = data.identifier;

      // QR Code será gerado a partir do pix_code
      // SyncPay retorna apenas o código PIX (string), não uma imagem
      if (pixCode) {
        this.gerarEExibirQRCode(pixCode);
        this.exibirCodigoPix(pixCode);
      }

      // Salvar identifier da transação (UUID conforme documentação oficial)
      if (identifier) {
        this.estado.transactionId = identifier;
        console.log('✅ Transaction Identifier salvo:', identifier);
        // Iniciar verificação automática após criar PIX
        this.iniciarVerificacao();
      } else {
        console.warn('⚠️ Transaction Identifier não encontrado na resposta da API SyncPay:', data);
      }

      this.atualizarStatus('QR Code gerado com sucesso!');

      return data;
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      this.atualizarStatus(`Erro: ${error.message || 'Falha ao gerar pagamento'}`);
      throw error;
    }
  },

  // Gerar QR Code a partir do código PIX usando API online
  gerarEExibirQRCode(pixCode) {
    if (!pixCode) {
      console.warn('⚠️ Código PIX não disponível para gerar QR Code');
      return;
    }

    const qrDiv = document.getElementById('qrCode');
    if (!qrDiv) {
      console.warn('⚠️ Elemento qrCode não encontrado');
      return;
    }

    // Limpar conteúdo anterior
    qrDiv.innerHTML = '';

    // Usar API online gratuita para gerar QR Code
    // Opção 1: QR Server API (recomendado)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;

    // Criar imagem do QR Code
    const img = document.createElement('img');
    img.src = qrCodeUrl;
    img.alt = 'QR Code PIX';
    img.className = 'mx-auto max-w-xs';
    img.style.maxWidth = '256px';
    img.style.height = 'auto';

    // Adicionar evento de erro (fallback)
    img.onerror = () => {
      console.warn('⚠️ Erro ao carregar QR Code da API, tentando alternativa...');
      // Fallback: usar outra API ou exibir apenas o código
      this.exibirQRCodeFallback(pixCode);
    };

    qrDiv.appendChild(img);
    console.log('✅ QR Code gerado e exibido');
  },

  // Fallback: exibir QR Code usando outra API ou biblioteca CDN
  exibirQRCodeFallback(pixCode) {
    const qrDiv = document.getElementById('qrCode');
    if (!qrDiv) return;

    // Tentar carregar biblioteca QR Code via CDN se não estiver carregada
    if (typeof QRCode === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.onload = () => {
        this.gerarQRCodeComBiblioteca(pixCode);
      };
      script.onerror = () => {
        // Se falhar, exibir apenas mensagem
        qrDiv.innerHTML = '<p class="text-sm text-gray-600">Escaneie o código PIX abaixo com seu app bancário</p>';
      };
      document.head.appendChild(script);
    } else {
      this.gerarQRCodeComBiblioteca(pixCode);
    }
  },

  // Gerar QR Code usando biblioteca QRCode (se disponível)
  gerarQRCodeComBiblioteca(pixCode) {
    if (typeof QRCode === 'undefined') {
      console.warn('⚠️ Biblioteca QRCode não disponível');
      return;
    }

    const qrDiv = document.getElementById('qrCode');
    if (!qrDiv) return;

    // Limpar conteúdo
    qrDiv.innerHTML = '';

    // Criar canvas para o QR Code
    const canvas = document.createElement('canvas');
    qrDiv.appendChild(canvas);

    // Gerar QR Code
    QRCode.toCanvas(canvas, pixCode, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, (error) => {
      if (error) {
        console.error('❌ Erro ao gerar QR Code:', error);
        qrDiv.innerHTML = '<p class="text-sm text-gray-600">Erro ao gerar QR Code. Use o código PIX abaixo.</p>';
      } else {
        console.log('✅ QR Code gerado com biblioteca');
      }
    });
  },

  exibirQRCode(qrCodeBase64) {
    // Método legado para compatibilidade (se receber base64)
    const qrDiv = document.getElementById('qrCode');
    if (qrDiv && qrCodeBase64) {
      qrDiv.innerHTML = '';

      const img = document.createElement('img');
      let imageSrc = qrCodeBase64;
      if (!qrCodeBase64.startsWith('data:')) {
        imageSrc = `data:image/png;base64,${qrCodeBase64}`;
      }
      img.src = imageSrc;
      img.alt = 'QR Code PIX';
      img.className = 'mx-auto max-w-xs';
      img.style.maxWidth = '256px';

      qrDiv.appendChild(img);
      console.log('✅ QR Code exibido (base64)');
    }
  },

  exibirCodigoPix(codigoPix) {
    const pixInput = document.getElementById('pixCodeInput');
    if (pixInput) {
      pixInput.value = codigoPix;
      console.log('✅ Código PIX exibido');
    }
  },

  atualizarStatus(mensagem, isError = false) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = '';

      const container = document.createElement('div');
      container.className = `flex items-center justify-center space-x-2 ${isError ? 'text-red-600' : 'text-orange-600'}`;

      if (!isError) {
        const icon = document.createElement('svg');
        icon.className = 'w-5 h-5 animate-spin';
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>';
        container.appendChild(icon);
      }

      const span = document.createElement('span');
      span.textContent = mensagem;
      container.appendChild(span);

      statusDiv.appendChild(container);
    }
  },

  async iniciarVerificacao() {
    if (!this.estado.transactionId) {
      console.warn('⚠️ Transaction ID não disponível para verificação');
      return;
    }

    // Evitar múltiplas verificações simultâneas
    if (this.estado.intervaloVerificacao) {
      console.warn('⚠️ Verificação já está em andamento');
      return;
    }

    console.log('🔄 Iniciando verificação de pagamento...', this.estado.transactionId);

    this.pararVerificacao(); // Garantir que não há múltiplas verificações

    let tentativas = 0;
    const maxTentativas = 300; // Limitar a 300 tentativas (5 horas com intervalo de 1 minuto)
    let ultimaConsulta = 0; // Timestamp da última consulta

    this.estado.intervaloVerificacao = setInterval(async () => {
      tentativas++;

      // Respeitar limite da API - consultas a cada intervalo razoável
      const agora = Date.now();
      const tempoDesdeUltimaConsulta = agora - ultimaConsulta;
      const intervaloMinimo = 10000; // 10 segundos entre consultas

      if (tempoDesdeUltimaConsulta < intervaloMinimo && ultimaConsulta > 0) {
        const tempoRestante = intervaloMinimo - tempoDesdeUltimaConsulta;
        console.log(`⏳ Aguardando ${Math.ceil(tempoRestante / 1000)}s antes da próxima consulta`);
        return;
      }

      // Parar após muitas tentativas
      if (tentativas > maxTentativas) {
        console.warn('⚠️ Limite de tentativas atingido. Parando verificação.');
        this.pararVerificacao();
        this.atualizarStatus('⏱️ Tempo de verificação expirado. Gere um novo QR Code.', true);
        return;
      }

      ultimaConsulta = agora;
      try {
        const response = await fetch(`${this.config.baseUrl}/syncpay`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'check-payment',
            transactionId: this.estado.transactionId
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Erro ao verificar pagamento:', {
            status: response.status,
            error: errorData.error || errorData.message || 'Erro desconhecido'
          });

          // Se for 404, a transação ainda não foi criada
          if (response.status === 404) {
            console.log('⏳ Transação ainda não encontrada na API (aguardando criação)...');
          }
          return;
        }

        const data = await response.json();

        // Estrutura da resposta: { data: { reference_id, status, amount, ... } }
        const transactionData = data.data || data;
        
        // Status conforme documentação oficial da SyncPay
        // Status possíveis: "pending" | "completed" | "failed" | "refunded" | "med"
        const status = transactionData.status?.toLowerCase() || 'unknown';
        console.log('📊 Status do pagamento SyncPay:', status, '| Dados completos:', transactionData);

        // Verificar se o pagamento foi confirmado
        // Status "completed" conforme documentação oficial
        const isPagamentoConfirmado = status === 'completed';

        if (isPagamentoConfirmado) {
          console.log('✅✅✅ PAGAMENTO CONFIRMADO! Redirecionando para agradecimento...');
          this.atualizarStatus('✅ Pagamento confirmado! Liberando acesso...');
          this.pararVerificacao();

          // Disparar evento customizado de pagamento confirmado
          window.dispatchEvent(new CustomEvent('paymentConfirmed', {
            detail: {
              transactionId: this.estado.transactionId,
              status: status,
              value: transactionData.amount || this.estado.valorAtual / 100
            }
          }));

          // Evento Facebook Pixel
          if (typeof fbq !== 'undefined') {
            try {
              fbq('track', 'Purchase', {
                value: this.estado.valorAtual / 100,
                currency: 'BRL',
                content_name: this.config.planoAtual
              });
              console.log('✅ Facebook Pixel Purchase event enviado');
            } catch (fbError) {
              console.warn('⚠️ Erro ao enviar Facebook Pixel:', fbError);
            }
          }

          // Redirecionar após confirmar pagamento
          const valorFormatado = (this.estado.valorAtual / 100).toFixed(2).replace('.', ',');
          const urlParams = new URLSearchParams();
          urlParams.set('id', this.estado.transactionId);
          urlParams.set('valor', valorFormatado);
          urlParams.set('status', status);

          // Mostrar mensagem de sucesso e redirecionar
          this.atualizarStatus('🎉 Acesso liberado! Redirecionando...');

          // Redirecionar após 1 segundo
          setTimeout(() => {
            const urlAgradecimento = `/agradecimento?${urlParams.toString()}`;
            console.log('🔄 Redirecionando para:', urlAgradecimento);

            try {
              window.location.href = urlAgradecimento;
            } catch (error) {
              console.warn('⚠️ Erro com window.location.href, tentando window.location.replace:', error);
              try {
                window.location.replace(urlAgradecimento);
              } catch (error2) {
                console.error('❌ Erro com window.location.replace, tentando window.location.assign:', error2);
                window.location.assign(urlAgradecimento);
              }
            }
          }, 1000);

        } else if (status === 'pending') {
          // Pagamento criado mas ainda não pago, continuar verificando
          console.log('⏳ Aguardando pagamento... Status: pending');
        } else if (status === 'failed') {
          // Pagamento falhou
          console.log('❌ Pagamento falhou. Status:', status);
          this.atualizarStatus('❌ Pagamento falhou. Gere um novo QR Code.', true);
          this.pararVerificacao();
        } else if (status === 'refunded') {
          // Pagamento reembolsado
          console.log('↩️ Pagamento reembolsado. Status:', status);
          this.atualizarStatus('↩️ Pagamento foi reembolsado.', true);
          this.pararVerificacao();
        } else if (status === 'med') {
          // Pagamento em análise (MED - Manual Evaluation Data)
          console.log('⚠️ Pagamento em análise (MED). Status:', status);
          this.atualizarStatus('⚠️ Pagamento em análise. Aguarde...');
        } else {
          // Status desconhecido, continuar verificando por segurança
          console.log('⚠️ Status desconhecido:', status, '- Continuando verificação...');
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        // Em caso de erro, aguardar antes de tentar novamente
        ultimaConsulta = Date.now();
      }
    }, 10000); // Verificar a cada 10 segundos

    console.log('✅ Verificação automática iniciada');
  },

  pararVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
      this.estado.intervaloVerificacao = null;
      console.log('⏸️ Verificação parada');
    }
  }
};

// Expor globalmente
if (typeof window !== 'undefined') {
  window.SyncPayReal = SyncPayReal;
}

