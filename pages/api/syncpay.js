// API Route para IronPay - Protegida no servidor
// Só o servidor tem acesso às variáveis de ambiente

// Função para escolher a oferta baseada no valor (opcional)
// Se você tiver ofertas específicas por valor, use-as
// Caso contrário, usa a oferta padrão (IRONPAY_OFFER_HASH)
function escolherOfferHash(valorCentavos) {
  // Mapeamento de valores para ofertas específicas (opcional)
  const ofertasEspecificas = {
    1990: process.env.IRONPAY_OFFER_HASH_19_90,  // R$ 19,90
    5000: process.env.IRONPAY_OFFER_HASH_50_00,  // R$ 50,00
    9990: process.env.IRONPAY_OFFER_HASH_99_90   // R$ 99,90
  };

  // Se houver oferta específica para este valor, usar ela
  if (ofertasEspecificas[valorCentavos]) {
    return ofertasEspecificas[valorCentavos];
  }

  // Caso contrário, usar a oferta padrão
  return process.env.IRONPAY_OFFER_HASH;
}

export default async function handler(req, res) {
  // 🚀 VERSÃO NOVA - IronPay Integration v2.0.0
  console.log('%c🚀 VERSÃO NOVA - IronPay Integration v2.0.0', 'color: #ff6b35; font-weight: bold;');
  console.log('📅 Migração completa realizada em: 2025-11-13');
  console.log('🔗 API: https://api.ironpayapp.com.br/api/public/v1');
  
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Debug: Verificar variáveis de ambiente no início do handler
  const envVars = {
    hasApiToken: !!process.env.IRONPAY_API_TOKEN,
    hasApiUrl: !!process.env.IRONPAY_API_URL,
    apiUrl: process.env.IRONPAY_API_URL || 'NÃO CONFIGURADO',
    hasOfferHash: !!process.env.IRONPAY_OFFER_HASH,
    hasProductHash: !!process.env.IRONPAY_PRODUCT_HASH,
    isVercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    allIronPayVars: Object.keys(process.env).filter(k => k.includes('IRONPAY'))
  };
  
  console.log('🔍 Debug Handler - Variáveis de ambiente:', JSON.stringify(envVars, null, 2));

  const { action } = req.body;

  try {
    if (action === 'create-pix') {
      const { valor, plano, client, currency } = req.body;

      // Validar variáveis de ambiente obrigatórias
      const apiToken = process.env.IRONPAY_API_TOKEN;
      const apiUrl = process.env.IRONPAY_API_URL || 'https://api.ironpayapp.com.br/api/public/v1';
      const productHash = process.env.IRONPAY_PRODUCT_HASH;

      if (!apiToken) {
        return res.status(500).json({
          error: 'IRONPAY_API_TOKEN não configurado',
          message: 'Configure IRONPAY_API_TOKEN nas variáveis de ambiente'
        });
      }

      if (!productHash) {
        return res.status(500).json({
          error: 'IRONPAY_PRODUCT_HASH não configurado',
          message: 'Configure IRONPAY_PRODUCT_HASH nas variáveis de ambiente'
        });
      }

      // Validar valor
      // O valor vem do frontend em centavos (990, 1990, 4990)
      // IronPay também espera valor em centavos
      const valorFinalCentavos = valor || parseInt(process.env.PLANO_VITALICIO_19_90) || 990;

      // Escolher a oferta baseada no valor (suporta ofertas específicas ou padrão)
      const offerHash = escolherOfferHash(valorFinalCentavos);

      if (!offerHash) {
        return res.status(500).json({
          error: 'IRONPAY_OFFER_HASH não configurado',
          message: 'Configure IRONPAY_OFFER_HASH ou IRONPAY_OFFER_HASH_* nas variáveis de ambiente'
        });
      }

      if (!valorFinalCentavos || valorFinalCentavos < 50) {
        return res.status(400).json({
          error: 'Valor inválido. O valor mínimo é R$ 0,50 (50 centavos)',
          message: 'Valor inválido. O valor mínimo é R$ 0,50 (50 centavos)'
        });
      }

      // Determinar moeda (padrão: BRL) - ANTES de usar no console.log
      // Moedas suportadas: BRL, USD, EUR
      const moeda = (currency || process.env.IRONPAY_DEFAULT_CURRENCY || 'BRL').toUpperCase();
      const moedasSuportadas = ['BRL', 'USD', 'EUR'];
      const moedaFinal = moedasSuportadas.includes(moeda) ? moeda : 'BRL';

      console.log('Criando transação via IronPay:', {
        valorCentavos: valorFinalCentavos,
        moeda: moedaFinal,
        plano,
        offerHash,
        productHash
      });

      // Remover barra final da URL se houver
      let apiBaseUrl = apiUrl;
      if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }

      const endpoint = '/transactions';
      const url = `${apiBaseUrl}${endpoint}?api_token=${apiToken}`;

      // Configurar URL do webhook
      const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook-syncpay`
        : null;

      console.log(`Chamando API IronPay: ${url}`);
      if (webhookUrl) {
        console.log(`Webhook URL configurado: ${webhookUrl}`);
      }

      // Preparar dados do cliente
      // IronPay exige endereço completo, usar valores válidos
      // IMPORTANTE: Dados inválidos podem causar recusa da transação
      // CPF válido de teste: 00000000191 (gerado para testes)
      const customerData = {
        name: client?.name || 'João Silva',
        email: client?.email || process.env.IRONPAY_DEFAULT_EMAIL || 'joao.silva@exemplo.com',
        phone_number: (client?.phone || client?.phone_number || '11999999999').replace(/\D/g, '').slice(-11),
        // Usar CPF válido de teste se não fornecido
        // CPF: 00000000191 é um CPF válido para testes (gerado)
        document: (client?.document || client?.cpf || '00000000191').replace(/\D/g, '').padStart(11, '0').slice(0, 11),
        street_name: client?.street_name || client?.address?.street_name || 'Rua das Flores',
        number: client?.number || client?.address?.number || '123',
        complement: client?.complement || client?.address?.complement || '',
        neighborhood: client?.neighborhood || client?.address?.neighborhood || 'Centro',
        city: client?.city || client?.address?.city || 'São Paulo',
        state: client?.state || client?.address?.state || 'SP',
        zip_code: (client?.zip_code || client?.address?.zip_code || '01310100').replace(/\D/g, '').slice(0, 8)
      };
      
      console.log('👤 Dados do cliente preparados:', {
        name: customerData.name,
        email: customerData.email,
        document: customerData.document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4'), // Mascarar CPF
        phone_number: customerData.phone_number,
        street_name: customerData.street_name,
        number: customerData.number,
        city: customerData.city,
        state: customerData.state,
        zip_code: customerData.zip_code
      });

      // Preparar carrinho (cart)
      const cart = [{
        product_hash: productHash,
        title: plano || 'Produto',
        price: valorFinalCentavos,
        quantity: 1,
        operation_type: 1, // 1 = venda
        tangible: false // Produto digital
      }];

      // Determinar método de pagamento baseado na moeda
      // PIX funciona apenas para BRL, outras moedas usam cartão de crédito
      let paymentMethod = 'pix';
      
      if (moedaFinal === 'USD' || moedaFinal === 'EUR') {
        paymentMethod = 'credit_card'; // Para moedas internacionais, usar cartão
      }

      // Preparar payload conforme documentação IronPay
      // Documentação: https://docs.ironpayapp.com.br
      // IMPORTANTE: installments é obrigatório mesmo para PIX
      const payload = {
        amount: valorFinalCentavos, // Valor em centavos (ou menor unidade da moeda)
        offer_hash: offerHash,
        payment_method: paymentMethod, // 'pix' para BRL, 'credit_card' para USD/EUR
        customer: customerData,
        cart: cart,
        installments: 1, // Obrigatório: número de parcelas (1 = à vista) - necessário mesmo para PIX
        expire_in_days: 1, // PIX expira em 1 dia
        transaction_origin: 'api',
        ...(webhookUrl && { postback_url: webhookUrl })
      };

      // Adicionar currency apenas se for diferente de BRL (moedas internacionais)
      // Para PIX (BRL), o currency pode não ser necessário
      if (moedaFinal !== 'BRL') {
        payload.currency = moedaFinal;
      }

      console.log('📤 Payload enviado para IronPay:', JSON.stringify(payload, null, 2));
      console.log('📤 URL da requisição:', url.replace(apiToken, 'TOKEN_OCULTO'));
      console.log('📤 Método de pagamento:', paymentMethod);
      console.log('📤 Valor em centavos:', valorFinalCentavos);
      console.log('📤 Offer Hash:', offerHash);
      console.log('📤 Product Hash:', productHash);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('📥 Status da resposta HTTP:', response.status, response.statusText);

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
              error: 'URL da API IronPay está incorreta',
              message: `A URL ${url} está retornando HTML (página web) em vez de JSON (API).`,
              suggestion: 'Verifique se IRONPAY_API_URL está correto. Deve ser: https://api.ironpayapp.com.br/api/public/v1'
            });
          }
          
          return res.status(500).json({
            error: 'Resposta da API não é JSON',
            message: 'A API IronPay retornou uma resposta que não é JSON',
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
          error: 'Erro ao processar resposta da API IronPay',
          message: 'A API retornou uma resposta inválida',
          details: text.substring(0, 500)
        });
      }

      // Log completo da resposta para debug
      console.log('📥 Resposta completa da API IronPay:', JSON.stringify(data, null, 2));
      console.log('📥 Status da resposta:', response.status);
      console.log('📥 Status HTTP:', response.status, response.statusText);
      
      // Verificar se há mensagens de erro na resposta
      if (data.message || data.error || data.errors) {
        console.error('❌ Mensagens de erro da API:', {
          message: data.message,
          error: data.error,
          errors: data.errors
        });
      }

      if (!response.ok) {
        console.error('❌ Erro IronPay API:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });

        return res.status(response.status).json({
          error: data.message || data.error || 'Erro ao criar PIX',
          message: data.message || data.error || 'Erro ao criar PIX',
          details: data
        });
      }

      // IronPay pode retornar em diferentes formatos:
      // 1. { success: true, data: { hash, ... } }
      // 2. { hash, ... } (diretamente)
      // 3. { data: { hash, ... } }
      
      // Verificar se a resposta está vazia ou inválida
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        console.error('❌ Resposta vazia da API IronPay');
        return res.status(500).json({
          error: 'Resposta vazia da API IronPay',
          message: 'A API retornou uma resposta vazia',
          details: 'Verifique os logs do servidor para mais informações'
        });
      }

      // Extrair hash de diferentes possíveis estruturas
      const transactionHash = data.hash || data.data?.hash || data.transaction_hash || data.identifier;
      // IronPay pode retornar o código PIX em diferentes estruturas:
      // 1. data.pix_code ou data.data.pix_code (direto)
      // 2. data.data.pix.pix_url (estrutura aninhada)
      // 3. data.data.pix.pix_qr_code (string do código PIX - formato EMV)
      const pixCode = data.pix_code || 
                     data.data?.pix_code || 
                     data.data?.pix?.pix_url ||
                     data.data?.pix?.pix_qr_code; // pix_qr_code é o código PIX em formato string
      // QR Code pode vir como:
      // 1. data.qr_code ou data.data.qr_code (base64)
      // IMPORTANTE: data.data.pix.pix_qr_code é uma STRING do código PIX, não uma imagem base64!
      const qrCode = data.qr_code || 
                   data.data?.qr_code; // QR Code em base64 (se disponível)
      const pixQrCodeString = data.data?.pix?.pix_qr_code; // String do código PIX para gerar QR Code
      const paymentStatus = data.data?.payment_status || data.status || data.data?.status;

      // Verificar se o pagamento foi recusado
      if (paymentStatus === 'refused') {
        console.error('❌ ATENÇÃO: Transação foi RECUSADA pela IronPay!');
        console.error('❌ Status:', paymentStatus);
        console.error('❌ Resposta completa:', JSON.stringify(data, null, 2));
        console.error('❌ Payload enviado:', JSON.stringify(payload, null, 2));
        console.error('❌ Possíveis causas:');
        console.error('   1. Conta IronPay não verificada ou com restrições');
        console.error('   2. Produto/oferta inativo ou inválido');
        console.error('   3. Dados do cliente inválidos (CPF, endereço, etc.)');
        console.error('   4. Configuração da conta incompleta');
        console.error('   5. Limite de transações atingido');
        
        // Tentar extrair mensagem de erro mais específica
        const errorMessage = data.data?.message || 
                           data.message || 
                           data.error || 
                           data.data?.error ||
                           'Transação recusada pela IronPay';
        
        return res.status(400).json({
          error: 'Transação recusada pela IronPay',
          message: errorMessage,
          status: paymentStatus,
          details: data.data || data,
          suggestion: 'Verifique no painel IronPay se a conta está ativa e se o produto/oferta está configurado corretamente'
        });
      }

      // Determinar código PIX final (priorizar pix_qr_code se for string válida)
      let codigoPixFinal = pixCode;
      if (pixQrCodeString && typeof pixQrCodeString === 'string' && pixQrCodeString.startsWith('000201')) {
        codigoPixFinal = pixQrCodeString;
        console.log('✅ Usando pix_qr_code como código PIX:', codigoPixFinal.substring(0, 50) + '...');
      }

      // Adaptar resposta para formato compatível com frontend
      const adaptedResponse = {
        success: data.success !== false, // true se não for explicitamente false
        hash: transactionHash,
        identifier: transactionHash, // Compatibilidade com código existente
        status: paymentStatus || data.status || data.data?.status,
        pix_code: codigoPixFinal, // Código PIX (string)
        qr_code: qrCode, // Base64 image (se disponível)
        amount: data.amount || data.data?.amount,
        payment_method: data.payment_method || data.data?.payment_method,
        expires_at: data.expires_at || data.data?.expires_at,
        created_at: data.created_at || data.data?.created_at,
        // Manter estrutura completa para compatibilidade
        data: data.data || data
      };

      console.log('✅ Transação criada com sucesso via IronPay:', adaptedResponse);
      
      // Verificar se temos pelo menos o hash
      if (!adaptedResponse.hash) {
        console.error('⚠️ ATENÇÃO: Hash não encontrado na resposta adaptada');
        console.error('Resposta original:', JSON.stringify(data, null, 2));
      }

      // Se não tiver pix_code, tentar consultar a transação para obter
      // O IronPay pode não retornar o código PIX imediatamente na criação
      if (!adaptedResponse.pix_code && adaptedResponse.hash) {
        console.log('🔄 Código PIX não veio na criação, consultando transação...');
        console.log(`🔄 URL de consulta: ${apiBaseUrl}/transactions/${adaptedResponse.hash}?api_token=${apiToken.substring(0, 20)}...`);
        
        try {
          // Aguardar um pouco antes de consultar (pode levar alguns segundos para gerar)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const consultUrl = `${apiBaseUrl}/transactions/${adaptedResponse.hash}?api_token=${apiToken}`;
          const consultResponse = await fetch(consultUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          console.log(`📥 Status da consulta: ${consultResponse.status}`);
          
          if (consultResponse.ok) {
            const consultData = await consultResponse.json();
            console.log('📥 Resposta da consulta:', JSON.stringify(consultData, null, 2));
            
            // Tentar diferentes estruturas de resposta
            const consultPixCode = consultData.data?.pix_code || consultData.pix_code || consultData.data?.pixCode;
            const consultQrCode = consultData.data?.qr_code || consultData.qr_code || consultData.data?.qrCode;
            
            console.log('🔍 Extraindo da consulta:', {
              pixCode: consultPixCode ? 'Encontrado' : 'NÃO encontrado',
              qrCode: consultQrCode ? 'Encontrado' : 'NÃO encontrado',
              keys: Object.keys(consultData)
            });
            
            if (consultPixCode) {
              adaptedResponse.pix_code = consultPixCode;
              console.log('✅ Código PIX obtido via consulta:', consultPixCode.substring(0, 50) + '...');
            } else {
              console.warn('⚠️ Código PIX ainda não disponível na consulta');
            }
            
            if (consultQrCode) {
              adaptedResponse.qr_code = consultQrCode;
              console.log('✅ QR Code obtido via consulta');
            } else {
              console.warn('⚠️ QR Code ainda não disponível na consulta');
            }
          } else {
            const errorText = await consultResponse.text();
            console.error('❌ Erro ao consultar transação:', consultResponse.status, errorText.substring(0, 200));
          }
        } catch (consultError) {
          console.error('❌ Erro ao consultar transação para obter código PIX:', consultError.message);
        }
      }
      
      return res.status(200).json(adaptedResponse);
    }

    if (action === 'check-payment') {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId é obrigatório' });
      }

      // Verificar status do pagamento
      // Documentação: https://docs.ironpayapp.com.br
      // Endpoint: GET /transactions/{hash}
      // Autenticação: api_token na query string
      const apiToken = process.env.IRONPAY_API_TOKEN;
      const apiUrl = process.env.IRONPAY_API_URL || 'https://api.ironpayapp.com.br/api/public/v1';

      if (!apiToken) {
        return res.status(500).json({
          error: 'IRONPAY_API_TOKEN não configurado',
          message: 'Configure IRONPAY_API_TOKEN nas variáveis de ambiente'
        });
      }

      // Remover barra final da URL se houver
      let apiBaseUrl = apiUrl;
      if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }

      const endpoint = `/transactions/${transactionId}`;
      const url = `${apiBaseUrl}${endpoint}?api_token=${apiToken}`;

      try {
        console.log(`Consultando status do PIX na IronPay: ${url}`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        // Se 404, retornar erro
        if (response.status === 404) {
          console.log('⚠️ Transação não encontrada na IronPay (404)');
          return res.status(404).json({
            error: 'Transação não encontrada',
            message: 'A transação não foi encontrada'
          });
        }

        const data = await response.json();
        
        console.log('📥 Resposta completa da consulta IronPay:', JSON.stringify(data, null, 2));

        if (response.ok) {
          // Status possíveis: pending, paid, canceled, refunded
          // A resposta vem em formato: { success: true, data: { status, amount, ... } }
          // Ou pode vir diretamente: { hash, status, ... }
          const status = data.data?.status || data.status || 'pending';
          console.log(`✅ Status consultado com sucesso na IronPay: ${status}`);
          
          // Adaptar resposta para compatibilidade
          const adaptedResponse = {
            success: data.success,
            hash: data.data?.hash,
            identifier: data.data?.hash, // Compatibilidade
            status: status,
            amount: data.data?.amount,
            payment_method: data.data?.payment_method,
            paid_at: data.data?.paid_at,
            created_at: data.data?.created_at,
            data: data.data
          };
          
          return res.status(200).json(adaptedResponse);
        } else {
          // Outros erros
          console.error(`Erro ao consultar transação na IronPay: ${response.status}`, data);

          return res.status(response.status).json({
            error: data.message || data.error || 'Erro ao verificar pagamento',
            details: data
          });
        }
      } catch (error) {
        console.error('Erro ao consultar transação na IronPay:', error);
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
    console.error('Erro na API IronPay:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno do servidor',
      message: error.message || 'Erro interno do servidor',
      type: error.name || 'Error'
    });
  }
}
