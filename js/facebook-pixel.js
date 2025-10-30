// Configuração do Facebook Pixel
const FacebookPixel = {
  // ID do seu pixel (substitua pelo seu)
  pixelId: 'SEU_PIXEL_ID_AQUI',
  
  // Inicializar pixel
  init() {
    if (typeof fbq === 'undefined') {
      console.log('Facebook Pixel não carregado');
      return;
    }
    
    console.log('📊 Facebook Pixel inicializado');
  },
  
  // Eventos personalizados
  eventos: {
    // Clique no botão de assinar
    botaoAssinar() {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          value: 19.90,
          currency: 'BRL'
        });
        console.log('📊 Pixel: Lead event tracked');
      }
    },
    
    // Início do checkout
    iniciarCheckout() {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          value: 19.90,
          currency: 'BRL',
          content_name: 'Curso Privacy',
          content_category: 'Digital Product'
        });
        console.log('📊 Pixel: InitiateCheckout event tracked');
      }
    },
    
    // Pagamento confirmado
    pagamentoConfirmado(transactionId) {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          value: 19.90,
          currency: 'BRL',
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          transaction_id: transactionId
        });
        console.log('📊 Pixel: Purchase event tracked');
      }
    },
    
    // Visualização de conteúdo
    visualizarConteudo() {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          value: 19.90,
          currency: 'BRL'
        });
        console.log('📊 Pixel: ViewContent event tracked');
      }
    },
    
    // Adicionar ao carrinho (se aplicável)
    adicionarAoCarrinho() {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          value: 19.90,
          currency: 'BRL'
        });
        console.log('📊 Pixel: AddToCart event tracked');
      }
    },
    
    // Evento personalizado para remarketing
    eventoPersonalizado(nomeEvento, parametros = {}) {
      if (typeof fbq !== 'undefined') {
        fbq('trackCustom', nomeEvento, {
          content_name: 'Curso Privacy',
          content_category: 'Digital Product',
          value: 19.90,
          currency: 'BRL',
          ...parametros
        });
        console.log(`📊 Pixel: Custom event "${nomeEvento}" tracked`);
      }
    }
  },
  
  // Rastrear origem do lead
  rastrearOrigem(origem) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'LeadOrigin', {
        origin: origem,
        content_name: 'Curso Privacy',
        content_category: 'Digital Product'
      });
      console.log(`📊 Pixel: Lead origin "${origem}" tracked`);
    }
  },
  
  // Rastrear conversão por canal
  rastrearConversaoCanal(canal, campanha) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'ChannelConversion', {
        channel: canal,
        campaign: campanha,
        content_name: 'Curso Privacy',
        content_category: 'Digital Product',
        value: 19.90,
        currency: 'BRL'
      });
      console.log(`📊 Pixel: Channel conversion "${canal}" tracked`);
    }
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.FacebookPixel = FacebookPixel;
}


