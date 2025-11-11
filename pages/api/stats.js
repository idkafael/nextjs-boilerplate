// API Route para estatísticas de vendas

import { lerVendas } from '../../lib/vendasStorage';

export default async function handler(req, res) {
  // Verificar autenticação básica
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.DASHBOARD_TOKEN || 'admin123';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const vendas = lerVendas();
    const vendasPagas = vendas.filter(v => v.status === 'paid' || v.status === 'pago');
    
    // Estatísticas gerais
    const totalVendas = vendasPagas.length;
    const totalReceita = vendasPagas.reduce((sum, v) => sum + v.valor, 0);
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;
    
    // Vendas por plano
    const vendasPorPlano = {};
    vendasPagas.forEach(v => {
      const plano = v.plano || 'Não especificado';
      vendasPorPlano[plano] = (vendasPorPlano[plano] || 0) + 1;
    });
    
    // Vendas por dia (últimos 30 dias)
    const vendasPorDia = {};
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    vendasPagas
      .filter(v => new Date(v.timestamp) >= trintaDiasAtras)
      .forEach(v => {
        const data = new Date(v.timestamp).toISOString().split('T')[0];
        if (!vendasPorDia[data]) {
          vendasPorDia[data] = { vendas: 0, receita: 0 };
        }
        vendasPorDia[data].vendas += 1;
        vendasPorDia[data].receita += v.valor;
      });
    
    // Vendas hoje
    const hojeStr = hoje.toISOString().split('T')[0];
    const vendasHoje = vendasPagas.filter(v => 
      v.timestamp.startsWith(hojeStr)
    ).length;
    const receitaHoje = vendasPagas
      .filter(v => v.timestamp.startsWith(hojeStr))
      .reduce((sum, v) => sum + v.valor, 0);
    
    // Vendas esta semana
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    
    const vendasSemana = vendasPagas.filter(v => 
      new Date(v.timestamp) >= inicioSemana
    ).length;
    const receitaSemana = vendasPagas
      .filter(v => new Date(v.timestamp) >= inicioSemana)
      .reduce((sum, v) => sum + v.valor, 0);
    
    // Vendas este mês
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const vendasMes = vendasPagas.filter(v => 
      new Date(v.timestamp) >= inicioMes
    ).length;
    const receitaMes = vendasPagas
      .filter(v => new Date(v.timestamp) >= inicioMes)
      .reduce((sum, v) => sum + v.valor, 0);
    
    return res.status(200).json({
      totalVendas,
      totalReceita: parseFloat(totalReceita.toFixed(2)),
      ticketMedio: parseFloat(ticketMedio.toFixed(2)),
      vendasPorPlano,
      vendasPorDia,
      hoje: {
        vendas: vendasHoje,
        receita: parseFloat(receitaHoje.toFixed(2))
      },
      semana: {
        vendas: vendasSemana,
        receita: parseFloat(receitaSemana.toFixed(2))
      },
      mes: {
        vendas: vendasMes,
        receita: parseFloat(receitaMes.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return res.status(500).json({ 
      error: 'Erro ao calcular estatísticas',
      message: error.message 
    });
  }
}
