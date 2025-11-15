// API Route para PushinPay - Protegida no servidor
// Token protegido no servidor, não exposto no cliente

import { Pushinpay } from 'pushinpay';

export default async function handler(req, res) {
  // 🚀 PushinPay Integration
  console.log('%c🚀 PushinPay Integration', 'color: #ff6b35; font-weight: bold;');
  
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verificar variáveis de ambiente
  const apiToken = process.env.PUSHINPAY_TOKEN;
  const isSandbox = process.env.PUSHINPAY_SANDBOX === 'true';
  
  if (!apiToken) {
    const isVercel = !!process.env.VERCEL;
    const errorMessage = isVercel 
      ? 'PUSHINPAY_TOKEN não configurado. Verifique: 1) Variáveis configuradas em Settings → Environment Variables, 2) Variáveis marcadas para Production, 3) Redeploy feito após adicionar variáveis.'
      : 'Configure PUSHINPAY_TOKEN nas variáveis de ambiente';
    
    console.error('❌ ERRO: PUSHINPAY_TOKEN não encontrado!');
    console.error('🔍 Debug:', {
      isVercel: isVercel,
      vercelEnv: process.env.VERCEL_ENV,
      allPushinPayKeys: Object.keys(process.env).filter(k => k.includes('PUSHINPAY')),
    });
    
    return res.status(500).json({ 
      error: errorMessage,
      details: 'PUSHINPAY_TOKEN não configurado nas variáveis de ambiente'
    });
  }

  // Inicializar cliente PushinPay
  const pushinpay = new Pushinpay({ 
    token: apiToken, 
    sandbox: isSandbox 
  });

  const { action } = req.body;

  try {
    if (action === 'create-pix') {
      const { valor, plano } = req.body;

      // Validar valor (mínimo 100 centavos = R$ 1,00 para evitar problemas com valores muito baixos)
      if (!valor || valor < 100) {
        return res.status(400).json({ 
          error: 'Valor inválido. O valor mínimo é R$ 1,00 (100 centavos)',
          valorRecebido: valor,
          valorMinimo: 100
        });
      }
      
      // Garantir que o valor seja pelo menos R$ 1,00
      const valorFinal = Math.max(valor, 100); // Mínimo 100 centavos (R$ 1,00)

      // Construir URL do webhook (opcional)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://marprivacy.site';
      const webhookUrl = `${baseUrl}/api/webhook-pushinpay`;

      console.log('🔍 Criando PIX via PushinPay API...', {
        valor,
        plano,
        webhookUrl,
        hasToken: !!apiToken,
        sandbox: isSandbox
      });

      // Preparar payload conforme documentação PushinPay
      // A biblioteca pode precisar de campos específicos
      const payload = {
        value: valorFinal, // Valor em centavos (mínimo 1)
        webhook_url: webhookUrl,
        // Split rules opcional (se configurado)
        ...(process.env.PUSHINPAY_SPLIT_RULES && {
          split_rules: JSON.parse(process.env.PUSHINPAY_SPLIT_RULES)
        })
      };
      
      console.log('📤 Payload enviado para PushinPay:', JSON.stringify(payload, null, 2));
      
      console.log('💰 Valor do pagamento:', {
        valorOriginal: valor,
        valorFinal: valorFinal,
        valorEmReais: (valorFinal / 100).toFixed(2)
      });

      // Criar PIX usando a biblioteca PushinPay
      console.log('🔄 Criando PIX usando biblioteca PushinPay...');
      
      let data;
      try {
        data = await pushinpay.pix.create(payload);
        console.log('✅ PIX criado com sucesso via biblioteca');
        console.log('📦 Resposta completa da biblioteca PushinPay:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('❌ Erro ao criar PIX:', error);
        const errorMsg = error.message || error.error || 'Erro desconhecido ao criar PIX';
        
        return res.status(error.status || 500).json({
          error: errorMsg,
          details: error.response || error,
          help: 'Verifique se PUSHINPAY_TOKEN está correto e se o valor está em centavos'
        });
      }

      // Extrair transaction ID de todas as formas possíveis
      // A biblioteca PushinPay pode retornar em diferentes formatos
      const transactionId = data.id || 
                            data.transaction_id || 
                            data.transactionId ||
                            data.payment_id ||
                            data.paymentId ||
                            data.uuid ||
                            data.hash ||
                            data.identifier ||
                            (data.data && (data.data.id || data.data.transaction_id || data.data.payment_id));

      console.log('🔍 Transaction ID extraído:', transactionId);
      console.log('📊 Dados extraídos:', {
        transactionId,
        status: data.status || data.data?.status,
        hasQrCode: !!(data.qr_code_base64 || data.qrcode_base64 || data.qr_code_image || data.data?.qr_code_base64),
        hasPixCode: !!(data.qr_code || data.pix_code || data.emv || data.data?.qr_code || data.data?.pix_code)
      });

      // Se não tiver transaction ID, gerar um temporário baseado em timestamp
      // Isso permite que a verificação funcione mesmo sem ID inicial
      const finalTransactionId = transactionId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (!transactionId) {
        console.warn('⚠️ Transaction ID não encontrado na resposta. Usando ID temporário:', finalTransactionId);
      }

      // Verificar se temos QR Code ou código PIX na resposta
      // A biblioteca PushinPay pode retornar em diferentes formatos
      const qrCodeBase64 = data.qr_code_base64 || 
                          data.qrcode_base64 || 
                          data.qr_code_image ||
                          data.qr_code_image_base64 ||
                          data.data?.qr_code_base64 ||
                          data.data?.qrcode_base64 ||
                          data.data?.qr_code_image;
      
      const pixCode = data.qr_code || 
                     data.pix_code || 
                     data.emv ||
                     data.pix_qr_code ||
                     data.qrcode ||
                     data.data?.qr_code ||
                     data.data?.pix_code ||
                     data.data?.emv ||
                     data.data?.pix_qr_code;

      console.log('🔍 Verificação de QR Code e PIX Code:', {
        hasQrCodeBase64: !!qrCodeBase64,
        hasPixCode: !!pixCode,
        qrCodeBase64Length: qrCodeBase64 ? qrCodeBase64.length : 0,
        pixCodeLength: pixCode ? pixCode.length : 0,
        allDataKeys: Object.keys(data),
        dataStructure: data.data ? Object.keys(data.data) : 'no data property'
      });

      // Se não tiver QR Code nem código PIX, tentar consultar o pagamento novamente
      // A biblioteca pode precisar de uma consulta adicional para obter o QR Code
      let finalQrCodeBase64 = qrCodeBase64;
      let finalPixCode = pixCode;
      
      if (!qrCodeBase64 && !pixCode && finalTransactionId && !finalTransactionId.startsWith('temp_')) {
        console.log('🔄 QR Code não encontrado na criação. Tentando consultar pagamento...');
        try {
          const paymentData = await pushinpay.pix.status({
            id: finalTransactionId
          });
          console.log('📦 Dados do pagamento consultado:', JSON.stringify(paymentData, null, 2));
          
          finalQrCodeBase64 = paymentData.qr_code_base64 || 
                              paymentData.qrcode_base64 || 
                              paymentData.qr_code_image ||
                              paymentData.data?.qr_code_base64;
          
          finalPixCode = paymentData.qr_code || 
                        paymentData.pix_code || 
                        paymentData.emv ||
                        paymentData.data?.qr_code ||
                        paymentData.data?.pix_code;
          
          if (finalQrCodeBase64 || finalPixCode) {
            console.log('✅ QR Code obtido na consulta!');
          }
        } catch (statusError) {
          console.warn('⚠️ Erro ao consultar status do pagamento:', statusError.message);
        }
      }
      
      if (!finalQrCodeBase64 && !finalPixCode) {
        console.warn('⚠️ ATENÇÃO: QR Code e código PIX não encontrados!');
        console.warn('⚠️ Possíveis causas:');
        console.warn('   1. Token PushinPay inválido ou não configurado');
        console.warn('   2. A biblioteca PushinPay não está retornando os dados corretamente');
        console.warn('   3. O formato da resposta é diferente do esperado');
        console.warn('   4. A API PushinPay pode estar com problemas');
        console.warn('💡 Verifique os logs acima para ver a resposta completa da biblioteca');
      }

      // Retornar dados formatados conforme esperado pelo frontend
      const responseData = {
        id: finalTransactionId,
        transaction_id: finalTransactionId,
        qr_code_base64: finalQrCodeBase64,
        qr_code: finalPixCode,
        status: data.status || data.data?.status || 'pending',
        value: data.value || data.data?.value || valorFinal,
        plano: plano
      };

      console.log('📤 Retornando dados para frontend:', {
        id: responseData.id,
        status: responseData.status,
        hasQrCode: !!responseData.qr_code_base64,
        hasPixCode: !!responseData.qr_code,
        value: responseData.value
      });

      return res.status(200).json(responseData);

    } else if (action === 'check-payment') {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID é obrigatório' });
      }

      console.log('🔍 Verificando status do pagamento...', transactionId);

      // Verificar status do pagamento usando a biblioteca PushinPay
      // Documentação: https://pushinpay.com.br
      // Status esperado: 'paid' quando confirmado
      let data;
      try {
        console.log('🔄 Consultando status na PushinPay para ID:', transactionId);
        
        // Se for um ID temporário, não tentar consultar na API
        if (transactionId.startsWith('temp_')) {
          console.warn('⚠️ ID temporário detectado. Não é possível verificar na API PushinPay.');
          return res.status(200).json({
            id: transactionId,
            status: 'pending',
            payment_status: 'pending',
            paid: false,
            confirmed: false,
            message: 'ID temporário - aguardando ID real da transação'
          });
        }
        
        data = await pushinpay.pix.status({
          id: transactionId
        });
        
        console.log('✅ Status verificado com sucesso');
        console.log('📦 Resposta completa do status:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error);
        console.error('❌ Detalhes do erro:', {
          message: error.message,
          error: error.error,
          response: error.response,
          status: error.status
        });
        
        const errorMsg = error.message || error.error || 'Erro desconhecido ao verificar pagamento';
        
        // Se for erro 404, a transação pode não existir ainda
        if (error.status === 404 || error.response?.status === 404) {
          console.warn('⚠️ Transação não encontrada (404). Pode ainda não ter sido criada na PushinPay.');
          return res.status(200).json({
            id: transactionId,
            status: 'pending',
            payment_status: 'pending',
            paid: false,
            confirmed: false,
            message: 'Transação não encontrada - ainda pode estar sendo processada'
          });
        }
        
        return res.status(error.status || 500).json({
          error: errorMsg,
          details: error.response || error
        });
      }

      // Extrair status de diferentes formatos possíveis
      const status = data.status?.toLowerCase() || 
                     data.data?.status?.toLowerCase() ||
                     data.payment_status?.toLowerCase() ||
                     'pending';
      
      console.log('📊 Status extraído do pagamento:', status);
      console.log('📊 Dados completos do status:', {
        status,
        id: data.id || data.data?.id,
        paid: data.paid || data.data?.paid,
        value: data.value || data.data?.value,
        paidAt: data.paid_at || data.data?.paid_at,
        createdAt: data.created_at || data.data?.created_at
      });

      // Verificar se está pago (PushinPay usa 'paid' como status confirmado)
      const isPaid = status === 'paid' || 
                     data.paid === true || 
                     data.data?.paid === true ||
                     status === 'completed' ||
                     status === 'approved';

      // Retornar dados formatados
      return res.status(200).json({
        id: data.id || data.data?.id || transactionId,
        status: status,
        payment_status: status,
        paid: isPaid,
        confirmed: isPaid,
        value: data.value || data.data?.value,
        created_at: data.created_at || data.data?.created_at,
        paid_at: data.paid_at || data.data?.paid_at,
        // Incluir dados completos para debug
        _debug: {
          originalStatus: data.status || data.data?.status,
          extractedStatus: status,
          isPaid: isPaid,
          originalResponse: data
        }
      });

    } else {
      return res.status(400).json({ error: 'Ação não reconhecida. Use: create-pix ou check-payment' });
    }

  } catch (error) {
    console.error('❌ Erro ao processar requisição PushinPay:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}

