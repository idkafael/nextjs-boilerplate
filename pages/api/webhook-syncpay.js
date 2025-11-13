// Webhook IronPay - Recebe notificações de pagamento confirmado
// Este endpoint é chamado pela IronPay quando um pagamento é confirmado
// Documentação: https://docs.ironpayapp.com.br

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('📩 Webhook recebido da IronPay:', JSON.stringify(req.body, null, 2));

    const payload = req.body;

    // Validar token de segurança (se configurado)
    // IronPay pode enviar token no header ou no payload
    const webhookToken = req.headers['x-webhook-token'] || 
                        req.headers['x-ironpay-signature'] || 
                        req.headers['authorization'] ||
                        payload.token;
    const expectedToken = process.env.IRONPAY_WEBHOOK_TOKEN;

    // Validação opcional do token de webhook
    if (expectedToken && webhookToken !== expectedToken) {
      console.error('❌ Token de webhook inválido');
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Extrair dados do pagamento
    // Estrutura IronPay conforme documentação
    // Pode vir como: { transaction_hash, status, amount, payment_method, paid_at, ... }
    // ou: { success: true, data: { hash, status, amount, ... } }
    const {
      transaction_hash,
      hash,
      status,
      amount,
      currency,
      paid_at,
      created_at,
      payment_method,
      description,
      data
    } = payload;

    // Normalizar dados (pode vir em data ou diretamente)
    const paymentData = data || payload;
    const paymentId = transaction_hash || hash || paymentData.transaction_hash || paymentData.hash;
    const paymentValue = amount || paymentData.amount;
    const paymentStatus = (status || paymentData.status)?.toLowerCase();
    const paymentCurrency = currency || paymentData.currency || 'BRL';
    const paymentDate = paid_at || paymentData.paid_at || created_at || paymentData.created_at;

    console.log('💰 Pagamento recebido da IronPay:', {
      id: paymentId,
      status: paymentStatus,
      value: paymentValue,
      currency: paymentCurrency,
      payment_method: payment_method || paymentData.payment_method,
      paid_at: paymentDate
    });

    // Verificar se o pagamento foi confirmado
    // Status possíveis IronPay: pending, paid, canceled, refunded
    if (paymentStatus === 'paid') {
      console.log('✅ Pagamento confirmado na IronPay! Hash:', paymentId);

      // Aqui você pode:
      // 1. Salvar no banco de dados
      // 2. Enviar email de confirmação
      // 3. Liberar acesso ao conteúdo
      // 4. Enviar notificação no Telegram

      // Enviar notificação no Telegram (se configurado)
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        try {
          const telegramMessage = `
🎉 *Novo Pagamento Confirmado (IronPay)!*

💰 Valor: R$ ${(paymentValue / 100)?.toFixed(2) || '0.00'}
💵 Moeda: ${paymentCurrency}
🆔 Hash: ${paymentId}
📅 Data: ${paymentDate || new Date().toLocaleString('pt-BR')}
📝 Descrição: ${description || paymentData.description || 'Não informado'}
💳 Método: ${payment_method || paymentData.payment_method || 'PIX'}

✅ Status: PAGO
          `.trim();

          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'Markdown'
            })
          });

          console.log('📱 Notificação enviada no Telegram');
        } catch (telegramError) {
          console.error('Erro ao enviar notificação no Telegram:', telegramError);
        }
      }

      // Enviar webhook para o WhatsApp (se configurado)
      if (process.env.WHATSAPP_WEBHOOK_URL) {
        try {
          await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_confirmed',
              payment_id: paymentId,
              value: paymentValue,
              currency: paymentCurrency,
              status: paymentStatus,
              transaction_date: paymentDate,
              provider: 'ironpay'
            })
          });

          console.log('📱 Webhook WhatsApp enviado');
        } catch (whatsappError) {
          console.error('Erro ao enviar webhook WhatsApp:', whatsappError);
        }
      }

      // Responder sucesso para a IronPay
      return res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        payment_id: paymentId
      });
    }

    // Outros status (pending, canceled, refunded)
    if (paymentStatus === 'pending') {
      console.log(`ℹ️ Pagamento pendente na IronPay: ${paymentId}`);
    } else if (paymentStatus === 'canceled') {
      console.log(`❌ Pagamento cancelado na IronPay: ${paymentId}`);
    } else if (paymentStatus === 'refunded') {
      console.log(`↩️ Pagamento reembolsado na IronPay: ${paymentId}`);
    } else {
      console.log(`ℹ️ Status do pagamento na IronPay: ${paymentStatus} - Hash: ${paymentId}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook recebido',
      status: paymentStatus,
      payment_id: paymentId
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook da IronPay:', error);
    return res.status(500).json({
      error: 'Erro ao processar webhook',
      message: error.message
    });
  }
}
