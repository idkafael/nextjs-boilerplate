# 📊 Dashboard de Vendas

Sistema completo de dashboard para acompanhar vendas e estatísticas do sistema de pagamentos.

## 🚀 Como Acessar

1. Acesse: `https://seu-dominio.com/dashboard`
2. Digite a senha de acesso (padrão: `admin123`)
3. Visualize todas as vendas e estatísticas

## 🔐 Segurança

**⚠️ IMPORTANTE:** Altere a senha padrão antes de fazer deploy em produção!

Para alterar a senha, edite o arquivo `pages/dashboard.js`:

```javascript
const DASHBOARD_TOKEN = 'sua-senha-segura-aqui';
```

E também atualize a variável de ambiente `DASHBOARD_TOKEN` no servidor (arquivo `.env.local` ou configurações do Netlify).

## 📈 Funcionalidades

### Métricas Principais
- **Total de Vendas**: Quantidade total de vendas confirmadas
- **Receita Total**: Soma de todos os valores recebidos
- **Ticket Médio**: Valor médio por venda
- **Vendas Hoje**: Vendas e receita do dia atual

### Estatísticas por Período
- **Esta Semana**: Vendas e receita dos últimos 7 dias
- **Este Mês**: Vendas e receita do mês atual
- **Vendas por Plano**: Distribuição de vendas por tipo de plano

### Lista de Vendas
- Visualização completa de todas as transações
- Filtros por status (Todas, Pagas, Pendentes, Canceladas)
- Informações detalhadas: ID, Valor, Plano, Status, Data

## 💾 Armazenamento de Dados

As vendas são armazenadas em um arquivo JSON local (`data/vendas.json`).

**Para produção**, recomenda-se migrar para um banco de dados real:
- MongoDB
- PostgreSQL
- Firebase
- Supabase

## 🔄 Como as Vendas são Registradas

1. **Via Webhook PushinPay**: Quando um pagamento é confirmado, o webhook (`/api/webhook-pushinpay`) salva automaticamente a venda
2. **Manual**: Você pode adicionar vendas manualmente através da API `/api/vendas` (POST)

## 📝 Estrutura de Dados

Cada venda contém:
```json
{
  "id": 1,
  "transactionId": "abc123...",
  "valor": 9.90,
  "plano": "Vitalício",
  "status": "paid",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "payer": "Nome do Cliente",
    "payment_method": "PIX",
    "paid_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🛠️ API Endpoints

### GET `/api/vendas`
Lista todas as vendas (requer autenticação)

**Query Parameters:**
- `status`: Filtrar por status (paid, pending, cancelled)
- `dataInicio`: Data inicial (ISO format)
- `dataFim`: Data final (ISO format)
- `limit`: Limitar número de resultados

**Exemplo:**
```bash
curl -H "Authorization: Bearer admin123" \
  https://seu-dominio.com/api/vendas?status=paid&limit=10
```

### POST `/api/vendas`
Adiciona uma nova venda (requer autenticação)

**Body:**
```json
{
  "transactionId": "abc123",
  "valor": 9.90,
  "plano": "Vitalício",
  "status": "paid",
  "metadata": {}
}
```

### GET `/api/stats`
Retorna estatísticas de vendas (requer autenticação)

**Resposta:**
```json
{
  "totalVendas": 100,
  "totalReceita": 990.00,
  "ticketMedio": 9.90,
  "vendasPorPlano": {
    "Vitalício": 100
  },
  "hoje": {
    "vendas": 5,
    "receita": 49.50
  },
  "semana": {
    "vendas": 20,
    "receita": 198.00
  },
  "mes": {
    "vendas": 50,
    "receita": 495.00
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente

Adicione no `.env.local`:

```env
# Token de autenticação da dashboard
DASHBOARD_TOKEN=sua-senha-segura-aqui

# URL do site (para webhook salvar vendas)
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

## 📱 Responsivo

A dashboard é totalmente responsiva e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🎨 Recursos Visuais

- Interface moderna e limpa
- Cards coloridos para métricas
- Tabela responsiva com hover effects
- Filtros e busca
- Atualização manual de dados
- Indicadores visuais de status

## 🚨 Troubleshooting

### Vendas não aparecem na dashboard

1. Verifique se o webhook está configurado corretamente na PushinPay
2. Verifique se o arquivo `data/vendas.json` existe e tem permissões de escrita
3. Verifique os logs do servidor para erros

### Erro 401 (Não autorizado)

1. Verifique se a senha está correta
2. Limpe o localStorage do navegador
3. Faça login novamente

### Estatísticas não atualizam

1. Clique no botão "🔄 Atualizar"
2. Verifique se há vendas no arquivo `data/vendas.json`
3. Verifique a conexão com a API

## 🔄 Próximos Passos

Para melhorar o sistema, considere:

1. **Migrar para banco de dados**: Substituir arquivo JSON por banco real
2. **Exportar dados**: Adicionar funcionalidade de exportar vendas (CSV, Excel)
3. **Gráficos**: Adicionar gráficos de evolução de vendas
4. **Notificações**: Alertas quando novas vendas acontecem
5. **Filtros avançados**: Busca por ID, intervalo de datas, etc.
6. **Relatórios**: Gerar relatórios periódicos automáticos

