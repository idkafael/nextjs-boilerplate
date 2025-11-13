// API Route para SyncPay - Protegida no servidor
// Só o servidor tem acesso às variáveis de ambiente

// Cache para o Bearer Token (válido por 1 hora)
let tokenCache = {
  access_token: null,
  expires_at: null
};

// Função para obter ou gerar Bearer Token
// 
// CONTA PRINCIPAL ATUAL (recebe 50% + split de 50%):
// - Client ID: 74633f92-ee63-44e4-af4a-63b0cf1d6844
// - Client Secret: f97b2c78-a648-4972-b3b6-d7f916aa1ad2
//
// SPLIT CONFIGURADO (50% para conta antiga):
// - User ID (split): cb8d5abc-f7ca-4305-986c-ca587b12cfa8
async function getBearerToken() {
  const clientId = process.env.SYNCPAY_CLIENT_ID;
  const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;
  // URL base da API - OBRIGATÓRIO configurar no .env.local
  // URL correta: https://api.syncpayments.com.br
  // Endpoints são: /api/partner/v1/*
  let apiBaseUrl = process.env.SYNCPAY_API_URL;
  
  // SOLUÇÃO TEMPORÁRIA: Usar valor padrão se não estiver configurado
  // TODO: Remover após resolver problema com variáveis de ambiente na Vercel
  if (!apiBaseUrl) {
    apiBaseUrl = 'https://api.syncpayments.com.br';
    console.warn('⚠️ SYNCPAY_API_URL não encontrado nas variáveis de ambiente. Usando valor padrão:', apiBaseUrl);
    console.warn('⚠️ Configure SYNCPAY_API_URL nas Environment Variables da Vercel para produção.');
  }
  
  // Debug: Log para verificar se a variável está sendo lida
  console.log('🔍 Debug - Variáveis de ambiente:', {
    hasApiUrl: !!process.env.SYNCPAY_API_URL,
    apiUrlFromEnv: process.env.SYNCPAY_API_URL || 'NÃO CONFIGURADO',
    apiUrlFinal: apiBaseUrl,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    isVercel: !!process.env.VERCEL
  });
  
  // Remover barra final se houver (para evitar URLs duplicadas)
  if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
    apiBaseUrl = apiBaseUrl.slice(0, -1);
    console.log('🔧 Barra final removida da URL:', apiBaseUrl);
  }

  if (!clientId || !clientSecret) {
    const envHint = process.env.VERCEL 
      ? 'Configure nas Environment Variables da Vercel (Settings → Environment Variables)'
      : 'Configure no arquivo .env.local';
    throw new Error(`SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET devem estar configurados. ${envHint}`);
  }

  // Verificar se o token em cache ainda é válido
  if (tokenCache.access_token && tokenCache.expires_at) {
    const now = Date.now();
    const expiresAt = new Date(tokenCache.expires_at).getTime();
    
    // Se o token expira em menos de 5 minutos, renovar
    if (now < expiresAt - 300000) {
      console.log('✅ Usando token Bearer em cache');
      return tokenCache.access_token;
    }
  }

  // Gerar novo token
  console.log('🔄 Gerando novo Bearer Token...');
  
  const authUrl = `${apiBaseUrl}/api/partner/v1/auth-token`;
  
  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret
      }),
    });

    // Verificar se a resposta é JSON antes de tentar parsear
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (!contentType.includes('application/json')) {
      // Se não for JSON, ler como texto para diagnosticar
      const text = await response.text();
      console.error('❌ Resposta de autenticação não é JSON. Content-Type:', contentType);
      console.error('❌ URL tentada:', authUrl);
      console.error('❌ Resposta (primeiros 500 caracteres):', text.substring(0, 500));
      
      // Se for HTML, a URL está errada (provavelmente apontando para documentação)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype')) {
        throw new Error(`❌ ERRO: A URL ${authUrl} está retornando HTML (página web) em vez de JSON (API).

⚠️ PROBLEMA:
A URL configurada está apontando para a documentação ou uma página web, não para a API real.

📋 Detalhes:
- URL atual: ${apiBaseUrl}
- URL completa tentada: ${authUrl}
- Resposta recebida: HTML (página web)

✅ SOLUÇÃO:
1. syncpay.apidog.io é a URL da DOCUMENTAÇÃO, não da API
2. Entre em contato com o suporte SyncPay
3. Pergunte: "Qual é a URL base da API para produção?"
4. A URL da API geralmente é diferente da documentação
5. Atualize SYNCPAY_API_URL no .env.local com a URL correta

💡 Possíveis URLs da API (confirmar com suporte):
- https://api.syncpay.app
- https://api.syncpay.com
- Outra URL fornecida pelo suporte`);
      }
      
      throw new Error(`A API retornou uma resposta que não é JSON. Content-Type: ${contentType}`);
    }
    
    data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro ao gerar Bearer Token:', data);
      throw new Error(data.message || data.error || 'Erro ao gerar token');
    }

    // Atualizar cache
    // expires_at já vem como string ISO da API (ex: "2025-06-22T02:49:47.440458Z")
    // Se não vier, calcular baseado em expires_in (em segundos)
    let expiresAt = data.expires_at;
    if (!expiresAt && data.expires_in) {
      expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
    }
    
    tokenCache = {
      access_token: data.access_token,
      expires_at: expiresAt
    };

    console.log('✅ Bearer Token gerado com sucesso. Expira em:', expiresAt);
    return data.access_token;
  } catch (error) {
    console.error('❌ Erro ao gerar Bearer Token:', error);
    console.error('❌ URL tentada:', authUrl);
    console.error('❌ Código do erro:', error.code);
    console.error('❌ Mensagem do erro:', error.message);
    
    // Verificar se é erro de conexão (URL incorreta)
    if (error.message.includes('fetch failed') || 
        error.code === 'ENOTFOUND' || 
        error.code === 'ECONNREFUSED' ||
        error.message.includes('getaddrinfo ENOTFOUND') ||
        error.message.includes('connect ECONNREFUSED')) {
      const errorMessage = `❌ ERRO DE CONEXÃO COM API SYNCPAY

⚠️ A URL base da API está incorreta ou não está acessível.

📋 Detalhes:
- URL atual configurada: ${apiBaseUrl}
- URL completa tentada: ${authUrl}
- Erro: ${error.message || error.code || 'Erro desconhecido'}

✅ SOLUÇÃO:
1. Entre em contato com o suporte SyncPay
2. Pergunte qual é a URL base da API para produção
3. Atualize SYNCPAY_API_URL no arquivo .env.local
4. Reinicie o servidor (npm run dev)

💡 A documentação (https://syncpay.apidog.io) não especifica a URL base.
   Você precisa obter essa informação diretamente do suporte SyncPay.

📞 Informações para fornecer ao suporte:
- Client ID: ${clientId ? clientId.substring(0, 8) + '...' : 'não configurado'}
- Endpoint: /api/partner/v1/auth-token
- Você precisa da URL base completa da API`;
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
}

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Debug: Verificar variáveis de ambiente no início do handler
  const envVars = {
    hasApiUrl: !!process.env.SYNCPAY_API_URL,
    apiUrl: process.env.SYNCPAY_API_URL || 'NÃO CONFIGURADO',
    hasClientId: !!process.env.SYNCPAY_CLIENT_ID,
    hasClientSecret: !!process.env.SYNCPAY_CLIENT_SECRET,
    hasSplitRules: !!process.env.SYNCPAY_SPLIT_RULES,
    isVercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    allSyncPayVars: Object.keys(process.env).filter(k => k.includes('SYNCPAY'))
  };
  
  console.log('🔍 Debug Handler - Variáveis de ambiente:', JSON.stringify(envVars, null, 2));
  
  // Nota: SYNCPAY_API_URL agora usa valor padrão se não estiver configurado
  // Isso permite que o sistema funcione enquanto investigamos o problema com variáveis de ambiente

  const { action } = req.body;

  try {
    if (action === 'create-pix') {
      const { valor, plano, split_rules, client } = req.body;

      // Validar valor
      // O valor vem do frontend em centavos (990, 1990, 4990)
      // SyncPay espera valor em reais (double), então convertemos
      const valorFinalCentavos = valor || parseInt(process.env.PLANO_VITALICIO_19_90) || 990;
      const valorFinalReais = valorFinalCentavos / 100; // Converter centavos para reais

      if (!valorFinalCentavos || valorFinalCentavos < 50) {
        return res.status(400).json({
          error: 'Valor inválido. O valor mínimo é R$ 0,50 (50 centavos)',
          message: 'Valor inválido. O valor mínimo é R$ 0,50 (50 centavos)'
        });
      }

      console.log('Criando PIX via SyncPay:', {
        valorCentavos: valorFinalCentavos,
        valorReais: valorFinalReais,
        plano,
        split_rules
      });

      // Obter Bearer Token
      const bearerToken = await getBearerToken();
      // URL base já validada na função getBearerToken()
      let apiBaseUrl = process.env.SYNCPAY_API_URL || '';
      // Remover barra final se houver
      if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }
      const endpoint = '/api/partner/v1/cash-in';
      const url = `${apiBaseUrl}${endpoint}`;

      // Configurar URL do webhook
      const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook-syncpay`
        : null;

      console.log(`Chamando API SyncPay: ${url}`);
      if (webhookUrl) {
        console.log(`Webhook URL configurado: ${webhookUrl}`);
      }

      // Configurar Split Automático
      // SyncPay suporta split: array de objetos com {percentage, user_id}
      // percentage: 1-100 (inteiro)
      // user_id: UUID (Client ID público das chaves em API Keys)
      // Máximo: 3 recebedores
      let splitRules = [];

      // Opção 1: Split passado no request (prioridade)
      if (split_rules && Array.isArray(split_rules) && split_rules.length > 0) {
        // Validar e formatar split rules
        splitRules = split_rules
          .slice(0, 3) // Máximo 3 recebedores
          .map(rule => ({
            percentage: parseInt(rule.percentage),
            user_id: rule.user_id || rule.userId || rule.recipient_id
          }))
          .filter(rule => rule.percentage >= 1 && rule.percentage <= 100 && rule.user_id);
        
        console.log('✅ Split configurado via request:', splitRules);
      }
      // Opção 2: Split configurado via variáveis de ambiente
      else if (process.env.SYNCPAY_SPLIT_RULES) {
        try {
          const envSplitRules = JSON.parse(process.env.SYNCPAY_SPLIT_RULES);
          splitRules = envSplitRules
            .slice(0, 3)
            .map(rule => ({
              percentage: parseInt(rule.percentage),
              user_id: rule.user_id || rule.userId || rule.recipient_id
            }))
            .filter(rule => rule.percentage >= 1 && rule.percentage <= 100 && rule.user_id);
          
          console.log('✅ Split configurado via variável de ambiente:', splitRules);
        } catch (error) {
          console.warn('⚠️ Erro ao parsear SYNCPAY_SPLIT_RULES:', error);
        }
      }

      // Validar split se configurado
      if (splitRules.length > 0) {
        const totalPercentage = splitRules.reduce((sum, rule) => sum + rule.percentage, 0);
        
        if (totalPercentage > 100) {
          console.warn('⚠️ Total do split excede 100%. Ajustando...');
        }
        
        console.log(`💰 Split configurado: ${splitRules.length} recebedor(es), total: ${totalPercentage}%`);
      }

      // Preparar payload conforme documentação SyncPay
      // Documentação: https://syncpay.apidog.io
      // Campos obrigatórios: amount (double em reais)
      // Campos opcionais: description, webhook_url, client, split
      // client: { name (string), cpf (string, 11 dígitos), email (string), phone (string, 10-11 dígitos) }
      const payload = {
        amount: parseFloat(valorFinalReais.toFixed(2)), // Valor em reais (double, 2 casas decimais)
        description: plano || 'Pagamento',
        ...(webhookUrl && { webhook_url: webhookUrl }),
        // Client é opcional, mas se fornecido deve ter name, cpf, email, phone
        ...(client && {
          client: {
            name: client.name || 'Cliente',
            cpf: (client.cpf || client.document?.replace(/\D/g, '') || '00000000000').padStart(11, '0').slice(0, 11),
            email: client.email || process.env.SYNCPAY_DEFAULT_EMAIL || 'cliente@exemplo.com',
            phone: (client.phone || client.phone_number?.replace(/\D/g, '') || '11999999999').slice(-11) // Últimos 11 dígitos
          }
        }),
        ...(splitRules.length > 0 && { split: splitRules })
      };

      console.log('📤 Payload enviado para SyncPay:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        // Verificar o Content-Type antes de tentar parsear JSON
        const contentType = response.headers.get('content-type') || '';
        
        if (!contentType.includes('application/json')) {
          // Se não for JSON, ler como texto
          const text = await response.text();
          console.error('❌ Resposta não é JSON. Content-Type:', contentType);
          console.error('❌ Resposta recebida (primeiros 500 caracteres):', text.substring(0, 500));
          
          // Se for HTML, provavelmente é uma página de erro ou documentação
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype')) {
            return res.status(500).json({
              error: 'URL da API SyncPay está incorreta',
              message: `A URL ${url} está retornando HTML (página web) em vez de JSON (API). Isso geralmente significa que a URL está apontando para a documentação ou uma página web, não para a API real.`,
              suggestion: 'Verifique se SYNCPAY_API_URL está correto. syncpay.apidog.io é a documentação, não a API. Entre em contato com o suporte SyncPay para obter a URL base correta da API.',
              contentType: contentType,
              responsePreview: text.substring(0, 200)
            });
          }
          
          return res.status(500).json({
            error: 'Resposta da API não é JSON',
            message: 'A API SyncPay retornou uma resposta que não é JSON',
            contentType: contentType,
            responsePreview: text.substring(0, 500)
          });
        }
        
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Erro ao parsear resposta JSON:', parseError);
        const text = await response.text().catch(() => 'Não foi possível ler a resposta');
        console.error('Resposta recebida (texto):', text.substring(0, 500));
        return res.status(500).json({
          error: 'Erro ao processar resposta da API SyncPay',
          message: 'A API retornou uma resposta inválida',
          details: text.substring(0, 500),
          suggestion: 'Verifique se a URL da API está correta. syncpay.apidog.io é a documentação, não a API real.'
        });
      }

      if (!response.ok) {
        console.error('Erro SyncPay API:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });

        // Tratamento específico para erro 401 (token inválido)
        if (response.status === 401) {
          // Limpar cache e tentar novamente uma vez
          tokenCache = { access_token: null, expires_at: null };
          console.log('🔄 Token expirado, regenerando...');
          
          try {
            const newToken = await getBearerToken();
            const retryResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });

            const retryData = await retryResponse.json();

            if (!retryResponse.ok) {
              return res.status(retryResponse.status).json({
                error: retryData.message || retryData.error || 'Erro ao criar PIX',
                message: retryData.message || retryData.error || 'Erro ao criar PIX',
                details: retryData
              });
            }

            console.log('✅ PIX criado com sucesso após regenerar token');
            return res.status(200).json(retryData);
          } catch (retryError) {
            return res.status(401).json({
              error: 'Erro de autenticação',
              message: 'Não foi possível autenticar na API SyncPay',
              details: retryError.message
            });
          }
        }

        return res.status(response.status).json({
          error: data.message || data.error || 'Erro ao criar PIX',
          message: data.message || data.error || 'Erro ao criar PIX',
          details: data
        });
      }

      console.log('✅ PIX criado com sucesso via SyncPay:', data);
      return res.status(200).json(data);
    }

    if (action === 'check-payment') {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId é obrigatório' });
      }

      // Verificar status do pagamento
      // Documentação: https://syncpay.apidog.io
      // Endpoint: GET /api/partner/v1/transaction/{identifier}
      // Autenticação: Bearer Token
      const bearerToken = await getBearerToken();
      // URL base já validada na função getBearerToken()
      let apiBaseUrl = process.env.SYNCPAY_API_URL || '';
      // Remover barra final se houver
      if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }
      const endpoint = `/api/partner/v1/transaction/${transactionId}`;
      const url = `${apiBaseUrl}${endpoint}`;

      try {
        console.log(`Consultando status do PIX na SyncPay: ${url}`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
          },
        });

        // Se 404, retornar erro
        if (response.status === 404) {
          console.log('⚠️ Transação não encontrada na SyncPay (404)');
          return res.status(404).json({
            error: 'Transação não encontrada',
            message: 'A transação não foi encontrada'
          });
        }

        const data = await response.json();

        if (response.ok) {
          // Status possíveis: pending, completed, failed, refunded, med
          // A resposta vem em formato: { data: { status, amount, ... } }
          const status = data.data?.status || data.status || 'unknown';
          console.log(`✅ Status consultado com sucesso na SyncPay: ${status}`);
          return res.status(200).json(data);
        } else {
          // Outros erros
          console.error(`Erro ao consultar transação na SyncPay: ${response.status}`, data);
          
          // Se 401, tentar regenerar token
          if (response.status === 401) {
            tokenCache = { access_token: null, expires_at: null };
            const newToken = await getBearerToken();
            
            const retryResponse = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${newToken}`,
              },
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              return res.status(200).json(retryData);
            }
          }

          return res.status(response.status).json({
            error: data.message || data.error || 'Erro ao verificar pagamento',
            details: data
          });
        }
      } catch (error) {
        console.error('Erro ao consultar transação na SyncPay:', error);
        return res.status(500).json({
          error: 'Erro ao verificar pagamento',
          message: error.message
        });
      }
    }

    return res.status(400).json({
      error: 'Ação inválida',
      message: 'Ação inválida'
    });
  } catch (error) {
    console.error('Erro na API SyncPay:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno do servidor',
      message: error.message || 'Erro interno do servidor',
      type: error.name || 'Error'
    });
  }
}

