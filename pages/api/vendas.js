// API Route para gerenciar vendas
// GET - Listar vendas
// POST - Adicionar venda

import fs from 'fs';
import path from 'path';

const VENDAS_FILE = path.join(process.cwd(), 'data', 'vendas.json');

// Garantir que o diretório existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Ler vendas do arquivo
function lerVendas() {
  ensureDataDir();
  if (!fs.existsSync(VENDAS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(VENDAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler vendas:', error);
    return [];
  }
}

// Salvar vendas no arquivo
function salvarVendas(vendas) {
  ensureDataDir();
  try {
    fs.writeFileSync(VENDAS_FILE, JSON.stringify(vendas, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar vendas:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Verificar autenticação básica
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.DASHBOARD_TOKEN || 'admin123'; // Mude isso!
  
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
      return res.status(500).json({ error: 'Erro ao buscar vendas' });
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
      return res.status(500).json({ error: 'Erro ao salvar venda' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

