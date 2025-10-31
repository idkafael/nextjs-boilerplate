// Script da página de agradecimento
(function() {
  'use strict';
  
  // Obter dados da URL
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('id') || 'N/A';
  const valor = urlParams.get('valor') || '19,90';
  const status = urlParams.get('status') || 'paid';
  
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Evento Facebook Pixel - Purchase (se disponível)
    try {
      if (typeof fbq !== 'undefined' && fbq) {
        fbq('track', 'Purchase', {
          value: 19.90,
          currency: 'BRL',
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          transaction_id: transactionId
        });
        console.log('✅ Facebook Pixel Purchase event enviado');
      }
    } catch (error) {
      // Silenciar erro - Facebook Pixel pode estar bloqueado
    }
    
    // Exibir ID da transação
    const transactionIdElement = document.getElementById('transactionId');
    if (transactionIdElement) {
      transactionIdElement.textContent = transactionId;
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
      telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 11) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
          value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        e.target.value = value;
      });
    }
    
    // Envio do formulário
    const form = document.getElementById('deliveryForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    
    // Animação de entrada
    const card = document.querySelector('.bg-white');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Pegar dados da transação temporária
    const transacaoTemp = JSON.parse(localStorage.getItem('transacao_temp') || '{}');
    
    // Pegar dados de rastreamento
    const trackingData = typeof LeadTracking !== 'undefined' 
      ? LeadTracking.getDadosRastreamento() 
      : JSON.parse(localStorage.getItem('lead_tracking') || '{}');
    
    // Combinar dados
    const dados = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      transactionId: transactionId || transacaoTemp.transactionId,
      valor: parseFloat((valor || transacaoTemp.valor || '19.90').replace(',', '.')),
      plano: transacaoTemp.plano || '1 mês',
      status: transacaoTemp.status || status || 'paid',
      origem: trackingData.origem || transacaoTemp.origem || 'site',
      source: trackingData.source || 'direct',
      medium: trackingData.medium || 'none',
      campaign: trackingData.campaign || 'organic',
      tags: ['convertido', 'pago', 'formulario_preenchido'],
      timestamp: new Date().toISOString()
    };
    
    console.log('📧 Enviando dados completos do cliente:', dados);
    
    try {
      const button = e.target.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;
      button.innerHTML = '⏳ Enviando...';
      button.disabled = true;
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Salvar no Database
      if (typeof Database !== 'undefined') {
        const clienteSalvo = Database.adicionarCliente(dados);
        console.log('✅ Cliente salvo no Database:', clienteSalvo);
        
        if (typeof LeadTracking !== 'undefined') {
          LeadTracking.rastrearConversao('formulario_agradecimento_completo');
          console.log('✅ Conversão registrada no LeadTracking');
        }
        
        localStorage.removeItem('transacao_temp');
      } else {
        // Fallback para localStorage
        const entregaveis = JSON.parse(localStorage.getItem('entregaveis') || '[]');
        entregaveis.push(dados);
        localStorage.setItem('entregaveis', JSON.stringify(entregaveis));
      }
      
      // Enviar notificação WhatsApp
      enviarNotificacaoWhatsApp(dados);
      
      // Mostrar sucesso
      document.getElementById('deliveryForm').classList.add('hidden');
      document.getElementById('deliveryStatus').classList.remove('hidden');
      
      // Abrir Drive
      const DRIVE_DEEPLINK = 'https://drive.google.com/SEU_LINK_AQUI'; // 🔴 SUBSTITUIR
      setTimeout(() => {
        window.open(DRIVE_DEEPLINK, '_blank');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro ao enviar dados:', error);
      alert('Erro ao enviar dados. Tente novamente.');
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }
  
  function enviarNotificacaoWhatsApp(dados) {
    const dataHora = new Date().toLocaleString('pt-BR');
    const mensagem = `🚨 NOVA VENDA CONFIRMADA! 🚨

📅 Data/Hora: ${dataHora}
💰 Valor: R$ ${dados.valor}
🆔 ID Transação: ${dados.transactionId}

👤 DADOS DO CLIENTE:
• Nome: ${dados.nome}
• Email: ${dados.email}
• WhatsApp: ${dados.telefone}

✅ Status: Pago
📦 Produto: Acesso Vitalício

⚠️ AÇÃO NECESSÁRIA: Enviar conteúdos para o cliente!`;

    const whatsappUrl = `https://wa.me/5547997118690?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  }
  
})();

