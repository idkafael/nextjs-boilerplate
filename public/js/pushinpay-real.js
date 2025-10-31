// PushinPay Real Integration
const PushinPayReal = {
  config: {
    baseUrl: '/api', // Aponta para a API Route do Next.js
    valor: 1990, // R$ 19,90 em centavos (vitalício)
    webhookUrl: null,
    planoAtual: 'Vitalício'
  },
  
  estado: {
    qrCodeAtivo: false,
    intervaloVerificacao: null,
    valorAtual: 1990,
    transactionId: null
  },
  
  atualizarValorPlano(valor, plano) {
    this.config.valor = Math.round(valor * 100); // Converter para centavos
    this.estado.valorAtual = this.config.valor;
    this.config.planoAtual = plano;
    console.log(`📊 Valor atualizado: R$ ${valor.toFixed(2)} - ${plano}`);
  },
  
  async criarPix() {
    try {
      this.atualizarStatus('Gerando pagamento...');
      console.log('🔍 Criando PIX via API Route...', {
        valor: this.estado.valorAtual,
        plano: this.config.planoAtual
      });
      
      const response = await fetch(`${this.config.baseUrl}/pushinpay`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create-pix',
          valor: this.estado.valorAtual,
          plano: this.config.planoAtual
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Erro desconhecido ao criar PIX';
        console.error('❌ Erro na API:', {
          status: response.status,
          error: errorMsg,
          details: data
        });
        
        this.atualizarStatus(`Erro: ${errorMsg}`);
        throw new Error(`PushinPay API Error: ${errorMsg}`);
      }
      
      console.log('✅ PIX criado com sucesso:', data);
      
      // Exibir QR Code e código PIX
      // Segundos a documentação da PushinPay:
      // - qr_code_base64: Imagem do QR Code em base64
      // - qr_code: Código PIX completo no padrão EMV
      // - id: Identificador único da transação
      
      if (data.qr_code_base64) {
        this.exibirQRCode(data.qr_code_base64);
      }
      
      if (data.qr_code) {
        this.exibirCodigoPix(data.qr_code);
      }
      
      if (data.id) {
        this.estado.transactionId = data.id;
        this.iniciarVerificacao();
      }
      
      this.atualizarStatus('QR Code gerado com sucesso!');
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      this.atualizarStatus(`Erro: ${error.message || 'Falha ao gerar pagamento'}`);
      throw error;
    }
  },
  
  exibirQRCode(qrCodeBase64) {
    const qrDiv = document.getElementById('qrCode');
    if (qrDiv && qrCodeBase64) {
      // Se já tem o prefixo data:, usar direto, senão adicionar
      let imageSrc = qrCodeBase64;
      if (!qrCodeBase64.startsWith('data:')) {
        imageSrc = `data:image/png;base64,${qrCodeBase64}`;
      }
      qrDiv.innerHTML = `<img src="${imageSrc}" alt="QR Code PIX" class="mx-auto max-w-xs" style="max-width: 256px;" />`;
      console.log('✅ QR Code exibido');
    } else {
      console.warn('⚠️ QR Code base64 não disponível ou elemento qrCode não encontrado');
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
      const colorClass = isError ? 'text-red-600' : 'text-orange-600';
      const icon = isError ? '' : `
        <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      `;
      
      statusDiv.innerHTML = `
        <div class="flex items-center justify-center space-x-2 ${colorClass}">
          ${icon}
          <span>${mensagem}</span>
        </div>
      `;
    }
  },
  
  async iniciarVerificacao() {
    if (!this.estado.transactionId) {
      console.warn('⚠️ Transaction ID não disponível para verificação');
      return;
    }
    
    console.log('🔄 Iniciando verificação de pagamento...', this.estado.transactionId);
    
    this.pararVerificacao(); // Garantir que não há múltiplas verificações
    
    this.estado.intervaloVerificacao = setInterval(async () => {
      try {
        const response = await fetch(`${this.config.baseUrl}/pushinpay`, {
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
          
          // Se for 404, pode ser que o endpoint ainda não esteja deployado
          if (response.status === 404) {
            console.warn('⚠️ Endpoint de verificação não encontrado. Aguardando deploy...');
          }
          return;
        }
        
        const data = await response.json();
        console.log('📊 Status do pagamento:', data.status);
        
        // Verificar se o pagamento foi confirmado
        // Status possíveis: paid, approved, confirmed
        if (data.status === 'paid' || data.status === 'approved' || data.status === 'confirmed') {
          console.log('✅ Pagamento confirmado!');
          this.atualizarStatus('✅ Pagamento confirmado! Liberando acesso...');
          this.pararVerificacao();
          
          // Disparar evento customizado de pagamento confirmado
          window.dispatchEvent(new CustomEvent('paymentConfirmed', {
            detail: {
              transactionId: this.estado.transactionId,
              status: data.status,
              value: data.value
            }
          }));
          
          // Evento Facebook Pixel
          if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
              value: this.estado.valorAtual / 100,
              currency: 'BRL',
              content_name: this.config.planoAtual
            });
          }
          
          // Mostrar mensagem de sucesso
          setTimeout(() => {
            this.atualizarStatus('🎉 Acesso liberado! Redirecionando...');
            
            // Redirecionar para página de agradecimento com link do Drive
            setTimeout(() => {
              window.location.href = '/agradecimento';
            }, 2000);
          }, 1000);
        } else if (data.status === 'pending' || data.status === 'waiting') {
          // Pagamento ainda pendente, continuar verificando
          console.log('⏳ Aguardando pagamento...');
        } else if (data.status === 'cancelled' || data.status === 'expired') {
          // Pagamento cancelado ou expirado
          console.log('❌ Pagamento cancelado ou expirado');
          this.atualizarStatus('❌ Pagamento cancelado ou expirado. Gere um novo QR Code.');
          this.pararVerificacao();
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    }, 3000); // Verificar a cada 3 segundos
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
  window.PushinPayReal = PushinPayReal;
}

