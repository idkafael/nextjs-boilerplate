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
    valorAtual: 1990
  },
  
  atualizarValorPlano(valor, plano) {
    this.config.valor = Math.round(valor * 100); // Converter para centavos
    this.estado.valorAtual = this.config.valor;
    this.config.planoAtual = plano;
    console.log(`📊 Valor atualizado: R$ ${valor.toFixed(2)} - ${plano}`);
  },
  
  async criarPix() {
    try {
      console.log('🔍 Criando PIX via API Route...');
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PushinPay API Error: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('✅ PIX criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      throw error;
    }
  },
  
  exibirQRCode(qrCodeBase64) {
    const qrDiv = document.getElementById('qrCode');
    if (qrDiv) {
      qrDiv.innerHTML = `<img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code PIX" class="mx-auto" />`;
      console.log('✅ QR Code exibido');
    }
  },
  
  exibirCodigoPix(codigoPix) {
    const pixInput = document.getElementById('pixCodeInput');
    if (pixInput) {
      pixInput.value = codigoPix;
      console.log('✅ Código PIX exibido');
    }
  },
  
  atualizarStatus(mensagem) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="flex items-center justify-center space-x-2 text-orange-600">
          <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>${mensagem}</span>
        </div>
      `;
    }
  },
  
  iniciarVerificacao() {
    console.log('🔄 Iniciando verificação de pagamento...');
    // TODO: Implementar verificação de pagamento
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

