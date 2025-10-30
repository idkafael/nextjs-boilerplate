// Sistema PushinPay Real - QR Code e Pagamento Funcional
const PushinPayReal = {
  // Configurações
  config: {
    baseUrl: 'https://api.pushinpay.com.br',
    token: 'SEU_TOKEN_PUSHINPAY_AQUI', // ⚠️ CONFIGURE: Adicione seu token na Vercel Environment Variables
    valor: 1990, // R$ 19,90 em centavos (vitalício)
    webhookUrl: null // Sem webhook por enquanto
  },
  
  // Estado atual
  estado: {
    transacaoId: null,
    status: 'pending',
    intervaloVerificacao: null,
    valorAtual: 5000, // Valor em centavos
    planoAtual: '1 mês'
  },
  
  // Criar PIX real via PushinPay
  async criarPix() {
    try {
      console.log('🔍 Criando PIX real via PushinPay...');
      
      const response = await fetch(`${this.config.baseUrl}/api/pix/cashIn`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: this.estado.valorAtual,
          webhook_url: this.config.webhookUrl,
          split_rules: []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
      }
      
      const data = await response.json();
      console.log('✅ PIX criado com sucesso:', data);
      
      // Salvar dados da transação
      this.estado.transacaoId = data.id;
      this.estado.status = data.status;
      
      return data;
      
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      throw error;
    }
  },
  
  // Consultar status do PIX
  async consultarStatus(transacaoId) {
    try {
      console.log('🔍 Consultando status do PIX:', transacaoId);
      
      const response = await fetch(`${this.config.baseUrl}/api/pix/status/${transacaoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Transação não encontrada
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Status consultado:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ Erro ao consultar status:', error);
      return null;
    }
  },
  
  // Exibir QR Code real da PushinPay
  exibirQRCode(qrCodeBase64) {
    const container = document.getElementById('qrCode');
    if (!container) {
      console.error('❌ Container QR Code não encontrado');
      return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    // Criar imagem do QR Code
    const img = document.createElement('img');
    img.src = qrCodeBase64;
    img.alt = 'QR Code PIX PushinPay';
    img.style.maxWidth = '250px';
    img.style.height = 'auto';
    img.style.margin = '0 auto';
    img.style.display = 'block';
    img.style.border = '2px solid #ddd';
    img.style.borderRadius = '8px';
    
    container.appendChild(img);
    console.log('✅ QR Code real exibido');
  },
  
  // Exibir código PIX
  exibirCodigoPix(qrCode) {
    const input = document.getElementById('pixCodeInput');
    if (input) {
      input.value = qrCode;
      console.log('✅ Código PIX exibido');
    }
  },
  
  // Iniciar verificação de pagamento
  iniciarVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
    }
    
    console.log('🔄 Iniciando verificação de pagamento...');
    
    this.estado.intervaloVerificacao = setInterval(async () => {
      if (!this.estado.transacaoId) return;
      
      const dados = await this.consultarStatus(this.estado.transacaoId);
      
      if (dados) {
        this.estado.status = dados.status;
        
        if (dados.status === 'paid') {
          console.log('🎉 Pagamento confirmado!');
          this.pagamentoConfirmado(dados);
          clearInterval(this.estado.intervaloVerificacao);
        } else if (dados.status === 'expired') {
          console.log('⏰ PIX expirado');
          this.pixExpirado();
          clearInterval(this.estado.intervaloVerificacao);
        } else {
          console.log('🔄 Aguardando pagamento...');
          this.atualizarStatus('Aguardando pagamento...');
        }
      }
    }, 5000); // Verificar a cada 5 segundos
  },
  
  // Atualizar status na tela
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
  
  // Pagamento confirmado
  pagamentoConfirmado(dados) {
    console.log('🎉 Pagamento confirmado!', dados);
    
    // Atualizar status
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="flex items-center justify-center space-x-2 text-green-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Pagamento confirmado! Redirecionando...</span>
        </div>
      `;
    }
    
    // Liberar conteúdo
    this.liberarConteudo();
    
    // Salvar transação temporária no localStorage para ser completada no agradecimento
    const transacaoTemp = {
      transactionId: dados.id || this.estado.transacaoId,
      valor: (this.estado.valorAtual / 100).toFixed(2),
      plano: this.estado.planoAtual,
      status: 'paid',
      origem: 'site',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('transacao_temp', JSON.stringify(transacaoTemp));
    console.log('💾 Transação temporária salva para completar no agradecimento');
    
    // Redirecionar para página de agradecimento após 3 segundos
    setTimeout(() => {
      this.irParaAgradecimento(dados);
    }, 3000);
  },
  
  // PIX expirado
  pixExpirado() {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="flex items-center justify-center space-x-2 text-red-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          <span>PIX expirado. Crie um novo pagamento.</span>
        </div>
      `;
    }
  },
  
  // Liberar conteúdo
  liberarConteudo() {
    console.log('🔓 Liberando conteúdo...');
    
    // Remover blur das imagens
    document.querySelectorAll('.blur').forEach(element => {
      element.classList.remove('blur');
    });
    
    // Remover marca d'água
    document.querySelectorAll('.watermark').forEach(element => {
      element.style.display = 'none';
    });
  },
  
  // Ir para página de agradecimento
  irParaAgradecimento(dados) {
    console.log('🎉 Redirecionando para página de agradecimento...');
    
    // Fechar modal primeiro
    this.fecharModal();
    
    // Redirecionar para página de agradecimento com dados
    const params = new URLSearchParams({
      id: dados.id || this.estado.transacaoId,
      valor: (this.estado.valorAtual / 100).toFixed(2).replace('.', ','),
      plano: this.estado.planoAtual,
      status: 'paid',
      timestamp: new Date().toISOString()
    });
    
    // Redirecionar para a página de agradecimento
    window.location.href = `agradecimento.html?${params.toString()}`;
  },
  
  // Fechar modal
  fecharModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  },
  
  // Parar verificação
  pararVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
      console.log('⏹️ Verificação parada');
    }
  },
  
  // Atualizar valor e plano
  atualizarValorPlano(valor, plano) {
    this.estado.valorAtual = Math.round(valor * 100); // Converter para centavos
    this.estado.planoAtual = plano;
    console.log('💰 Valor e plano atualizados:', { valor: this.estado.valorAtual, plano: this.estado.planoAtual });
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.PushinPayReal = PushinPayReal;
}
