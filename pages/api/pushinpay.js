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

      // Validar valor (mínimo 1 centavo para testes)
      if (!valor || valor < 1) {
        return res.status(400).json({ error: 'Valor inválido. O valor mínimo é R$ 0,01 (1 centavo)' });
      }
      
      // Garantir que o valor seja pelo menos 1 centavo
      const valorFinal = Math.max(valor, 1); // Mínimo 1 centavo

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
      const payload = {
        value: valorFinal, // Valor em centavos (mínimo 1)
        webhook_url: webhookUrl,
        // Split rules opcional (se configurado)
        ...(process.env.PUSHINPAY_SPLIT_RULES && {
          split_rules: JSON.parse(process.env.PUSHINPAY_SPLIT_RULES)
        })
      };
      
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

      // Retornar dados formatados conforme esperado pelo frontend
      const responseData = {
        id: finalTransactionId,
        transaction_id: finalTransactionId,
        qr_code_base64: data.qr_code_base64 || 
                       data.qrcode_base64 || 
                       data.qr_code_image ||
                       data.data?.qr_code_base64 ||
                       data.data?.qrcode_base64,
        qr_code: data.qr_code || 
                data.pix_code || 
                data.emv ||
                data.data?.qr_code ||
                data.data?.pix_code,
        status: data.status || data.data?.status || 'pending',
        value: data.value || data.data?.value || valorFinal,
        plano: plano
      };

      console.log('📤 Retornando dados para frontend:', {
        id: responseData.id,
        status: responseData.status,
        hasQrCode: !!responseData.qr_code_base64,
        hasPixCode: !!responseData.qr_code
      });

      return res.status(200).json(responseData);

    } else if (action === 'check-payment') {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID é obrigatório' });
      }

      console.log('🔍 Verificando status do pagamento...', transactionId);

      // Verificar status do pagamento usando a biblioteca PushinPay
      let data;
      try {
        data = await pushinpay.pix.status({
          id: transactionId
        });
        console.log('✅ Status verificado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error);
        const errorMsg = error.message || error.error || 'Erro desconhecido ao verificar pagamento';
        
        return res.status(error.status || 500).json({
          error: errorMsg,
          details: error.response || error
        });
      }

      console.log('📊 Status do pagamento:', data.status);

      // Retornar dados formatados
      return res.status(200).json({
        id: data.id || transactionId,
        status: data.status || 'pending',
        payment_status: data.status || 'pending',
        paid: data.status === 'paid' || data.status === 'completed' || data.status === 'approved',
        confirmed: data.status === 'paid' || data.status === 'completed' || data.status === 'approved',
        value: data.value,
        created_at: data.created_at,
        paid_at: data.paid_at
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

