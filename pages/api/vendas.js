// API Route para gerenciar vendas
// GET - Listar vendas
// POST - Adicionar venda
// 
// NOTA: Na Vercel (serverless), usamos armazenamento em memória
// Para produção, considere migrar para um banco de dados (MongoDB, PostgreSQL, etc.)

import { lerVendas, salvarVendas } from '../../lib/vendasStorage';

export default async function handler(req, res) {
  // Verificar autenticação básica
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.DASHBOARD_TOKEN || 'admin123';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    try {
      const vendas = lerVendas();
      
      // Filtrar por query params
      const { status, dataInicio, dataFim, limit } = req.query;
      let vendasFiltradas = [...vendas];
      
      if (status) {
        vendasFiltradas = vendasFiltradas.filter(v => v.status === status);
      }
      
      if (dataInicio) {
        vendasFiltradas = vendasFiltradas.filter(v => 
          new Date(v.timestamp) >= new Date(dataInicio)
        );
      }
      
      if (dataFim) {
        vendasFiltradas = vendasFiltradas.filter(v => 
          new Date(v.timestamp) <= new Date(dataFim)
        );
      }
      
      // Ordenar por data (mais recente primeiro)
      vendasFiltradas.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      // Limitar resultados
      if (limit) {
        vendasFiltradas = vendasFiltradas.slice(0, parseInt(limit));
      }
      
      return res.status(200).json({
        vendas: vendasFiltradas,
        total: vendasFiltradas.length,
        totalGeral: vendas.length
      });
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar vendas',
        message: error.message 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { transactionId, valor, plano, status, metadata } = req.body;
      
      if (!transactionId || !valor) {
        return res.status(400).json({ error: 'transactionId e valor são obrigatórios' });
      }
      
      const vendas = lerVendas();
      
      // Verificar se já existe
      const existe = vendas.find(v => v.transactionId === transactionId);
      if (existe) {
        return res.status(200).json({ 
          message: 'Venda já existe',
          venda: existe 
        });
      }
      
      const novaVenda = {
        id: vendas.length + 1,
        transactionId,
        valor: parseFloat(valor),
        plano: plano || 'Não especificado',
        status: status || 'paid',
        timestamp: new Date().toISOString(),
        metadata: metadata || {}
      };
      
      vendas.push(novaVenda);
      salvarVendas(vendas);
      
      return res.status(201).json({ 
        message: 'Venda registrada com sucesso',
        venda: novaVenda 
      });
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      return res.status(500).json({ 
        error: 'Erro ao salvar venda',
        message: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
