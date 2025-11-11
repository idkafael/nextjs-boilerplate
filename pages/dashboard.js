import Head from 'next/head';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [stats, setStats] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('all');
  const [atualizando, setAtualizando] = useState(false);

  // IMPORTANTE: Altere esta senha em produção!
  // Para maior segurança, você pode criar uma API route de autenticação
  const DASHBOARD_TOKEN = 'admin123'; // Mude esta senha!

  useEffect(() => {
    // Verificar se já está autenticado
    const token = localStorage.getItem('dashboard_token');
    if (token === DASHBOARD_TOKEN) {
      setAutenticado(true);
      carregarDados();
    }
  }, []);

  const fazerLogin = (e) => {
    e.preventDefault();
    if (senha === DASHBOARD_TOKEN) {
      localStorage.setItem('dashboard_token', senha);
      setAutenticado(true);
      carregarDados();
    } else {
      alert('Senha incorreta!');
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem('dashboard_token');
    setAutenticado(false);
    router.push('/');
  };

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem('dashboard_token');
      
      // Carregar estatísticas
      const statsRes = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Carregar vendas
      const vendasRes = await fetch('/api/vendas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const vendasData = await vendasRes.json();
      setVendas(vendasData.vendas || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados da dashboard');
    } finally {
      setCarregando(false);
    }
  };

  const atualizarDados = async () => {
    setAtualizando(true);
    await carregarDados();
    setTimeout(() => setAtualizando(false), 1000);
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const vendasFiltradas = filtroStatus === 'all' 
    ? vendas 
    : vendas.filter(v => v.status === filtroStatus);

  if (!autenticado) {
    return (
      <>
        <Head>
          <title>Dashboard - Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
              🔐 Dashboard
            </h1>
            <form onSubmit={fazerLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard de Vendas - Marcelly Mar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard de Vendas</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={atualizarDados}
                  disabled={atualizando}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {atualizando ? '🔄 Atualizando...' : '🔄 Atualizar'}
                </button>
                <button
                  onClick={fazerLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {carregando ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Carregando dados...</p>
            </div>
          ) : stats ? (
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Vendas</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalVendas}</p>
                    </div>
                    <div className="text-4xl">💰</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Receita Total</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {formatarMoeda(stats.totalReceita)}
                      </p>
                    </div>
                    <div className="text-4xl">💵</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ticket Médio</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {formatarMoeda(stats.ticketMedio)}
                      </p>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vendas Hoje</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.hoje.vendas}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {formatarMoeda(stats.hoje.receita)}
                      </p>
                    </div>
                    <div className="text-4xl">📈</div>
                  </div>
                </div>
              </div>

              {/* Estatísticas por Período */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Esta Semana</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.semana.vendas} vendas</p>
                  <p className="text-lg text-green-600 mt-2">{formatarMoeda(stats.semana.receita)}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📆 Este Mês</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.mes.vendas} vendas</p>
                  <p className="text-lg text-green-600 mt-2">{formatarMoeda(stats.mes.receita)}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 Vendas por Plano</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.vendasPorPlano).map(([plano, quantidade]) => (
                      <div key={plano} className="flex justify-between">
                        <span className="text-gray-600">{plano}</span>
                        <span className="font-semibold">{quantidade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de Vendas */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">📋 Últimas Vendas</h2>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="paid">Pagas</option>
                    <option value="pending">Pendentes</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plano</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-500">
                            Nenhuma venda encontrada
                          </td>
                        </tr>
                      ) : (
                        vendasFiltradas.map((venda) => (
                          <tr key={venda.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-mono text-gray-600">
                              {venda.transactionId?.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-green-600">
                              {formatarMoeda(venda.valor)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">{venda.plano}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                venda.status === 'paid' || venda.status === 'pago'
                                  ? 'bg-green-100 text-green-800'
                                  : venda.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {venda.status === 'paid' || venda.status === 'pago' ? '✓ Pago' : venda.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatarData(venda.timestamp)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Erro ao carregar dados</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

