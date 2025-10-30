// Sistema de Banco de Dados para Remarketing
const Database = {
  // Configurações
  config: {
    version: '1.0.0',
    storageKey: 'privacy_database',
    backupInterval: 300000 // 5 minutos
  },

  // Inicializar banco de dados
  init() {
    console.log('🗄️ Inicializando banco de dados...');
    
    // Carregar dados existentes ou criar estrutura inicial
    const dados = this.getDatabase();
    if (!dados.clientes) dados.clientes = [];
    if (!dados.campanhas) dados.campanhas = [];
    if (!dados.logs) dados.logs = [];
    if (!dados.tracking) dados.tracking = [];
    if (!dados.estatisticas) dados.estatisticas = this.calcularEstatisticas();
    
    this.salvarDatabase(dados);
    
    // Iniciar backup automático
    this.iniciarBackup();
    
    console.log('✅ Banco de dados inicializado');
  },

  // Obter banco de dados completo
  getDatabase() {
    try {
      const dados = localStorage.getItem(this.config.storageKey);
      if (dados) {
        return JSON.parse(dados);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar banco de dados:', error);
    }
    
    // Retornar estrutura vazia se não existir
    return {
      version: this.config.version,
      clientes: [],
      campanhas: [],
      logs: [],
      tracking: [],
      estatisticas: {
        totalClientes: 0,
        totalReceita: 0,
        taxaConversao: 0,
        clientesAtivos: 0
      }
    };
  },

  // Salvar banco de dados
  salvarDatabase(dados) {
    try {
      dados.lastUpdate = new Date().toISOString();
      localStorage.setItem(this.config.storageKey, JSON.stringify(dados));
      console.log('💾 Banco de dados salvo');
    } catch (error) {
      console.error('❌ Erro ao salvar banco de dados:', error);
    }
  },

  // Adicionar novo cliente
  adicionarCliente(dados) {
    const database = this.getDatabase();
    
    // Verificar se cliente já existe (por email ou telefone)
    const clienteExistente = database.clientes.find(c => 
      c.email === dados.email || c.telefone === dados.telefone
    );
    
    if (clienteExistente) {
      // Atualizar cliente existente
      Object.assign(clienteExistente, dados, {
        ultimoAcesso: new Date().toISOString(),
        status: dados.status || clienteExistente.status
      });
      
      this.registrarAcao(clienteExistente.id, 'cliente_atualizado', 
        `Cliente ${clienteExistente.nome} atualizado`);
      
      console.log('🔄 Cliente atualizado:', clienteExistente);
    } else {
      // Criar novo cliente
      const novoCliente = {
        id: 'cliente_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        nome: dados.nome || 'Cliente Anônimo',
        email: dados.email || '',
        telefone: dados.telefone || '',
        transactionId: dados.transactionId || '',
        valor: parseFloat(dados.valor) || 0,
        status: dados.status || 'pending',
        timestamp: new Date().toISOString(),
        ultimoAcesso: new Date().toISOString(),
        origem: dados.origem || 'site',
        tags: dados.tags || ['novo'],
        observacoes: dados.observacoes || '',
        plano: dados.plano || '1 mês'
      };
      
      database.clientes.push(novoCliente);
      
      this.registrarAcao(novoCliente.id, 'cliente_criado', 
        `Novo cliente: ${novoCliente.nome}`);
      
      console.log('✅ Novo cliente adicionado:', novoCliente);
    }
    
    // Atualizar estatísticas
    database.estatisticas = this.calcularEstatisticas();
    
    this.salvarDatabase(database);
    return database.clientes[database.clientes.length - 1];
  },

  // Buscar clientes com filtros
  buscarClientes(filtros = {}) {
    const database = this.getDatabase();
    let clientes = [...database.clientes];
    
    // Aplicar filtros
    if (filtros.status) {
      clientes = clientes.filter(c => c.status === filtros.status);
    }
    
    if (filtros.tags && filtros.tags.length > 0) {
      clientes = clientes.filter(c => 
        filtros.tags.some(tag => c.tags.includes(tag))
      );
    }
    
    if (filtros.origem) {
      clientes = clientes.filter(c => c.origem === filtros.origem);
    }
    
    if (filtros.dataInicio) {
      clientes = clientes.filter(c => 
        new Date(c.timestamp) >= new Date(filtros.dataInicio)
      );
    }
    
    if (filtros.dataFim) {
      clientes = clientes.filter(c => 
        new Date(c.timestamp) <= new Date(filtros.dataFim)
      );
    }
    
    return clientes;
  },

  // Obter estatísticas
  getEstatisticas() {
    const database = this.getDatabase();
    return database.estatisticas;
  },

  // Calcular estatísticas
  calcularEstatisticas() {
    const database = this.getDatabase();
    const clientes = database.clientes;
    
    const totalClientes = clientes.length;
    const clientesPagos = clientes.filter(c => c.status === 'paid').length;
    const receitaTotal = clientes.reduce((sum, c) => sum + (parseFloat(c.valor) || 0), 0);
    const taxaConversao = totalClientes > 0 ? (clientesPagos / totalClientes) * 100 : 0;
    
    // Clientes ativos (últimos 30 dias)
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    const clientesAtivos = clientes.filter(c => 
      new Date(c.ultimoAcesso) >= trintaDiasAtras
    ).length;
    
    return {
      totalClientes,
      conversao: clientesPagos,
      receitaTotal,
      taxaConversao,
      clientesAtivos
    };
  },

  // Adicionar tag a cliente
  adicionarTag(clienteId, tag) {
    const database = this.getDatabase();
    const cliente = database.clientes.find(c => c.id === clienteId);
    
    if (cliente) {
      if (!cliente.tags.includes(tag)) {
        cliente.tags.push(tag);
        cliente.ultimoAcesso = new Date().toISOString();
        
        this.registrarAcao(clienteId, 'tag_adicionada', 
          `Tag "${tag}" adicionada ao cliente ${cliente.nome}`);
        
        this.salvarDatabase(database);
        console.log(`🏷️ Tag "${tag}" adicionada ao cliente ${cliente.nome}`);
      }
      return true;
    }
    return false;
  },

  // Remover tag de cliente
  removerTag(clienteId, tag) {
    const database = this.getDatabase();
    const cliente = database.clientes.find(c => c.id === clienteId);
    
    if (cliente) {
      const index = cliente.tags.indexOf(tag);
      if (index > -1) {
        cliente.tags.splice(index, 1);
        cliente.ultimoAcesso = new Date().toISOString();
        
        this.registrarAcao(clienteId, 'tag_removida', 
          `Tag "${tag}" removida do cliente ${cliente.nome}`);
        
        this.salvarDatabase(database);
        console.log(`🗑️ Tag "${tag}" removida do cliente ${cliente.nome}`);
        return true;
      }
    }
    return false;
  },

  // Atualizar status do cliente
  atualizarStatus(clienteId, novoStatus) {
    const database = this.getDatabase();
    const cliente = database.clientes.find(c => c.id === clienteId);
    
    if (cliente) {
      const statusAnterior = cliente.status;
      cliente.status = novoStatus;
      cliente.ultimoAcesso = new Date().toISOString();
      
      this.registrarAcao(clienteId, 'status_atualizado', 
        `Status alterado de "${statusAnterior}" para "${novoStatus}" - ${cliente.nome}`);
      
      database.estatisticas = this.calcularEstatisticas();
      this.salvarDatabase(database);
      
      console.log(`🔄 Status do cliente ${cliente.nome} atualizado para ${novoStatus}`);
      return true;
    }
    return false;
  },

  // Criar campanha
  criarCampanha(nome, tipo, destinatarios, mensagem) {
    const database = this.getDatabase();
    
    const campanha = {
      id: 'campanha_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      nome,
      tipo,
      mensagem,
      destinatarios: destinatarios.map(c => c.id),
      status: 'ativa',
      timestamp: new Date().toISOString(),
      enviados: 0,
      abertos: 0,
      cliques: 0
    };
    
    database.campanhas.push(campanha);
    
    this.registrarAcao(null, 'campanha_criada', 
      `Campanha "${nome}" criada com ${destinatarios.length} destinatários`);
    
    this.salvarDatabase(database);
    console.log('📧 Campanha criada:', campanha);
    
    return campanha;
  },

  // Registrar ação no log
  registrarAcao(clienteId, acao, detalhes, campanhaId = null) {
    const database = this.getDatabase();
    
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      clienteId,
      acao,
      detalhes,
      timestamp: new Date().toISOString(),
      usuario: 'sistema',
      campanhaId
    };
    
    database.logs.push(log);
    
    // Manter apenas os últimos 1000 logs
    if (database.logs.length > 1000) {
      database.logs = database.logs.slice(-1000);
    }
    
    this.salvarDatabase(database);
  },

  // Obter todos os logs
  getAllLogs() {
    const database = this.getDatabase();
    return database.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Enviar WhatsApp (simulação)
  enviarWhatsApp(telefone, mensagem) {
    console.log(`📱 WhatsApp enviado para ${telefone}: ${mensagem}`);
    
    // Aqui você integraria com uma API real de WhatsApp
    // Por exemplo: WhatsApp Business API, Twilio, etc.
    
    return {
      success: true,
      messageId: 'msg_' + Date.now(),
      timestamp: new Date().toISOString()
    };
  },

  // Exportar dados
  exportarDados(formato = 'json') {
    const database = this.getDatabase();
    
    if (formato === 'csv') {
      this.exportarCSV(database);
    } else {
      this.exportarJSON(database);
    }
  },

  // Exportar JSON
  exportarJSON(database) {
    const dataStr = JSON.stringify(database, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📄 Dados exportados em JSON');
  },

  // Exportar CSV
  exportarCSV(database) {
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Status', 'Valor', 'Origem', 'Tags', 'Data'];
    const rows = database.clientes.map(cliente => [
      cliente.id,
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.status,
      cliente.valor,
      cliente.origem,
      cliente.tags.join(';'),
      new Date(cliente.timestamp).toLocaleString('pt-BR')
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📊 Dados exportados em CSV');
  },

  // Backup automático
  iniciarBackup() {
    setInterval(() => {
      const database = this.getDatabase();
      localStorage.setItem(this.config.storageKey + '_backup', JSON.stringify(database));
      console.log('💾 Backup automático realizado');
    }, this.config.backupInterval);
  },

  // Restaurar backup
  restaurarBackup() {
    const backup = localStorage.getItem(this.config.storageKey + '_backup');
    if (backup) {
      localStorage.setItem(this.config.storageKey, backup);
      console.log('🔄 Backup restaurado');
      return true;
    }
    return false;
  },

  // Limpar todos os dados
  limparTodosDados() {
    if (confirm('⚠️ Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita!')) {
      localStorage.removeItem(this.config.storageKey);
      localStorage.removeItem(this.config.storageKey + '_backup');
      console.log('🗑️ Todos os dados foram removidos');
      return true;
    }
    return false;
  },

  // Obter cliente por ID
  getClientePorId(id) {
    const database = this.getDatabase();
    return database.clientes.find(c => c.id === id);
  },

  // Buscar clientes por texto
  buscarClientesPorTexto(texto) {
    const database = this.getDatabase();
    const textoLower = texto.toLowerCase();
    
    return database.clientes.filter(cliente => 
      cliente.nome.toLowerCase().includes(textoLower) ||
      cliente.email.toLowerCase().includes(textoLower) ||
      cliente.telefone.includes(texto) ||
      cliente.tags.some(tag => tag.toLowerCase().includes(textoLower))
    );
  },

  // Gerar ID único
  gerarId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Alias para compatibilidade (saveDatabase -> salvarDatabase)
  saveDatabase(dados) {
    return this.salvarDatabase(dados);
  }
};

// Inicializar automaticamente quando o script carregar
if (typeof window !== 'undefined') {
  window.Database = Database;
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Database.init());
  } else {
    Database.init();
  }
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Database;
}
