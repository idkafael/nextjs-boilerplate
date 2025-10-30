// Sistema de Rastreamento de Leads
const LeadTracking = {
  // Configurações
  config: {
    utmSource: 'utm_source',
    utmMedium: 'utm_medium', 
    utmCampaign: 'utm_campaign',
    utmContent: 'utm_content',
    utmTerm: 'utm_term',
    referrer: 'referrer',
    timestamp: 'timestamp'
  },
  
  // Inicializar rastreamento
  init() {
    console.log('🔍 Inicializando rastreamento de leads...');
    
    // Detectar origem da URL
    const origem = this.detectarOrigem();
    
    // Salvar dados de rastreamento
    this.salvarDadosRastreamento(origem);
    
    // Aplicar rastreamento em formulários
    this.aplicarRastreamentoFormularios();
    
    console.log('✅ Rastreamento de leads ativado');
  },
  
  // Detectar origem do lead
  detectarOrigem() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    // Dados UTM
    const utmData = {
      source: urlParams.get(this.config.utmSource) || this.detectarFontePorReferrer(referrer),
      medium: urlParams.get(this.config.utmMedium) || this.detectarMeioPorReferrer(referrer),
      campaign: urlParams.get(this.config.utmCampaign) || 'organic',
      content: urlParams.get(this.config.utmContent) || '',
      term: urlParams.get(this.config.utmTerm) || ''
    };
    
    // Detectar origem específica
    const origem = this.detectarOrigemEspecifica(utmData.source, referrer);
    
    return {
      ...utmData,
      origem: origem,
      referrer: referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  },
  
  // Detectar fonte por referrer
  detectarFontePorReferrer(referrer) {
    if (!referrer) return 'direct';
    
    const domain = new URL(referrer).hostname.toLowerCase();
    
    const fontes = {
      'google.com': 'google',
      'google.com.br': 'google',
      'facebook.com': 'facebook',
      'instagram.com': 'instagram',
      'tiktok.com': 'tiktok',
      'twitter.com': 'twitter',
      'x.com': 'twitter',
      'youtube.com': 'youtube',
      'linkedin.com': 'linkedin',
      'whatsapp.com': 'whatsapp',
      'telegram.org': 'telegram',
      't.me': 'telegram',
      'linktr.ee': 'linktree',
      'linktree.com': 'linktree'
    };
    
    for (const [site, fonte] of Object.entries(fontes)) {
      if (domain.includes(site)) return fonte;
    }
    
    return 'referral';
  },
  
  // Detectar meio por referrer
  detectarMeioPorReferrer(referrer) {
    if (!referrer) return 'none';
    
    const domain = new URL(referrer).hostname.toLowerCase();
    
    if (domain.includes('google')) return 'cpc';
    if (domain.includes('facebook') || domain.includes('instagram')) return 'social';
    if (domain.includes('tiktok')) return 'social';
    if (domain.includes('twitter') || domain.includes('x.com')) return 'social';
    if (domain.includes('youtube')) return 'social';
    if (domain.includes('linkedin')) return 'social';
    if (domain.includes('whatsapp') || domain.includes('telegram')) return 'messaging';
    if (domain.includes('linktree')) return 'linktree';
    
    return 'referral';
  },
  
  // Detectar origem específica
  detectarOrigemEspecifica(source, referrer) {
    // Detectar se veio do Linktree (Instagram orgânico)
    if (source === 'linktree' || (referrer && referrer.includes('linktree'))) {
      return 'instagram_linktree';
    }
    
    const origens = {
      'google': 'google_ads',
      'facebook': 'facebook_ads',
      'instagram': 'instagram_ads',
      'tiktok': 'tiktok_ads',
      'twitter': 'twitter_ads',
      'youtube': 'youtube_ads',
      'linkedin': 'linkedin_ads',
      'whatsapp': 'whatsapp_organico',
      'telegram': 'telegram_organico',
      'linktree': 'instagram_linktree',
      'direct': 'site_direto',
      'referral': 'indicacao'
    };
    
    return origens[source] || 'desconhecido';
  },
  
  // Salvar dados de rastreamento
  salvarDadosRastreamento(dados) {
    // Salvar no localStorage para persistência
    const trackingData = {
      ...dados,
      sessionId: this.gerarSessionId(),
      pageViews: 1,
      firstVisit: new Date().toISOString()
    };
    
    localStorage.setItem('lead_tracking', JSON.stringify(trackingData));
    
    // Salvar no banco de dados se disponível
    if (typeof Database !== 'undefined') {
      this.salvarNoBanco(trackingData);
    }
    
    console.log('📊 Dados de rastreamento salvos:', trackingData);
  },
  
  // Salvar no banco de dados
  salvarNoBanco(dados) {
    const database = Database.getDatabase();
    
    // Criar entrada de rastreamento
    const trackingEntry = {
      id: Database.gerarId(),
      sessionId: dados.sessionId,
      source: dados.source,
      medium: dados.medium,
      campaign: dados.campaign,
      origem: dados.origem,
      referrer: dados.referrer,
      timestamp: dados.timestamp,
      userAgent: dados.userAgent,
      url: dados.url,
      pageViews: dados.pageViews,
      converted: false
    };
    
    // Adicionar ao banco se não existir
    if (!database.tracking) {
      database.tracking = [];
    }
    
    // Verificar se já existe
    const existing = database.tracking.find(t => t.sessionId === dados.sessionId);
    if (!existing) {
      database.tracking.push(trackingEntry);
      Database.saveDatabase(database);
    }
  },
  
  // Aplicar rastreamento em formulários
  aplicarRastreamentoFormularios() {
    // Rastrear formulário de agradecimento
    const formAgradecimento = document.getElementById('deliveryForm');
    if (formAgradecimento) {
      formAgradecimento.addEventListener('submit', (e) => {
        this.rastrearConversao('formulario_agradecimento');
      });
    }
    
    // Rastrear cliques no botão de assinar
    const botaoAssinar = document.getElementById('subscribeBtn');
    if (botaoAssinar) {
      botaoAssinar.addEventListener('click', () => {
        this.rastrearConversao('botao_assinar');
      });
    }
  },
  
  // Rastrear conversão
  rastrearConversao(tipoConversao) {
    const trackingData = JSON.parse(localStorage.getItem('lead_tracking') || '{}');
    
    const conversao = {
      tipo: tipoConversao,
      timestamp: new Date().toISOString(),
      sessionId: trackingData.sessionId,
      dados: trackingData
    };
    
    // Salvar conversão
    localStorage.setItem('lead_conversao', JSON.stringify(conversao));
    
    // Atualizar no banco
    if (typeof Database !== 'undefined') {
      this.atualizarConversaoNoBanco(conversao);
    }
    
    // Rastrear no Facebook Pixel
    if (typeof FacebookPixel !== 'undefined') {
      FacebookPixel.eventos.botaoAssinar();
      FacebookPixel.rastrearOrigem(trackingData.origem);
    }
    
    console.log('🎯 Conversão rastreada:', conversao);
  },
  
  // Atualizar conversão no banco
  atualizarConversaoNoBanco(conversao) {
    const database = Database.getDatabase();
    
    if (database.tracking) {
      const tracking = database.tracking.find(t => t.sessionId === conversao.sessionId);
      if (tracking) {
        tracking.converted = true;
        tracking.conversionType = conversao.tipo;
        tracking.conversionTimestamp = conversao.timestamp;
        Database.saveDatabase(database);
      }
    }
  },
  
  // Gerar ID de sessão
  gerarSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Obter dados de rastreamento
  getDadosRastreamento() {
    return JSON.parse(localStorage.getItem('lead_tracking') || '{}');
  },
  
  // Obter conversões
  getConversoes() {
    return JSON.parse(localStorage.getItem('lead_conversao') || '{}');
  },
  
  // Gerar relatório de leads
  gerarRelatorioLeads() {
    const database = Database.getDatabase();
    const tracking = database.tracking || [];
    
    const relatorio = {
      totalLeads: tracking.length,
      conversoes: tracking.filter(t => t.converted).length,
      porOrigem: this.agruparPor(tracking, 'origem'),
      porFonte: this.agruparPor(tracking, 'source'),
      porMeio: this.agruparPor(tracking, 'medium'),
      porCampanha: this.agruparPor(tracking, 'campaign'),
      taxaConversao: (tracking.filter(t => t.converted).length / tracking.length * 100).toFixed(2) + '%'
    };
    
    return relatorio;
  },
  
  // Agrupar por campo
  agruparPor(array, campo) {
    return array.reduce((acc, item) => {
      const valor = item[campo] || 'Não informado';
      acc[valor] = (acc[valor] || 0) + 1;
      return acc;
    }, {});
  },
  
  // Criar link de rastreamento
  criarLinkRastreamento(url, source, medium, campaign, content = '', term = '') {
    const baseUrl = new URL(url);
    baseUrl.searchParams.set('utm_source', source);
    baseUrl.searchParams.set('utm_medium', medium);
    baseUrl.searchParams.set('utm_campaign', campaign);
    if (content) baseUrl.searchParams.set('utm_content', content);
    if (term) baseUrl.searchParams.set('utm_term', term);
    
    return baseUrl.toString();
  }
};

// Inicializar rastreamento quando a página carregar
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    LeadTracking.init();
  });
}

// Exportar para global
if (typeof window !== 'undefined') {
  window.LeadTracking = LeadTracking;
}
