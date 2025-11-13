// Webhook SyncPay - Recebe notificações de pagamento confirmado
// Este endpoint é chamado pela SyncPay quando um pagamento é confirmado
// Documentação: https://syncpay.apidog.io

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('📩 Webhook recebido da SyncPay:', JSON.stringify(req.body, null, 2));

    const payload = req.body;

    // Validar token de segurança (se configurado)
    // SyncPay pode enviar token no header ou no payload
    const webhookToken = req.headers['x-webhook-token'] || 
                        req.headers['x-syncpay-signature'] || 
                        req.headers['authorization'] ||
                        payload.token;
    const expectedToken = process.env.SYNCPAY_WEBHOOK_TOKEN;

    // Validação opcional do token de webhook
    if (expectedToken && webhookToken !== expectedToken) {
      console.error('❌ Token de webhook inválido');
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Extrair dados do pagamento
    // Estrutura pode variar conforme evento (cashin onCreate/onUpdate)
    // Campos possíveis conforme documentação SyncPay
    const {
      identifier,
      reference_id,
      status,
      amount,
      currency,
      transaction_date,
      description,
      pix_code,
      event, // cashin, cashout, infraction
      data
    } = payload;

    // Normalizar dados (pode vir em data ou diretamente)
    const paymentData = data || payload;
    const paymentId = identifier || reference_id || paymentData.identifier || paymentData.reference_id;
    const paymentValue = amount || paymentData.amount;
    const paymentStatus = (status || paymentData.status)?.toLowerCase();
    const paymentCurrency = currency || paymentData.currency || 'BRL';

    console.log('💰 Pagamento recebido da SyncPay:', {
      id: paymentId,
      status: paymentStatus,
      value: paymentValue,
      currency: paymentCurrency,
      event: event || 'cashin',
      transaction_date: transaction_date || paymentData.transaction_date
    });

    // Verificar se o pagamento foi confirmado
    // Status possíveis: pending, completed, failed, refunded, med
    if (paymentStatus === 'completed') {
      console.log('✅ Pagamento confirmado na SyncPay! ID:', paymentId);

      // Aqui você pode:
      // 1. Salvar no banco de dados
      // 2. Enviar email de confirmação
      // 3. Liberar acesso ao conteúdo
      // 4. Enviar notificação no Telegram

      // Enviar notificação no Telegram (se configurado)
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        try {
          const telegramMessage = `
🎉 *Novo Pagamento Confirmado (SyncPay)!*

💰 Valor: R$ ${paymentValue?.toFixed(2) || '0.00'}
💵 Moeda: ${paymentCurrency}
🆔 ID: ${paymentId}
📅 Data: ${transaction_date || paymentData.transaction_date || new Date().toLocaleString('pt-BR')}
📝 Descrição: ${description || paymentData.description || 'Não informado'}

✅ Status: COMPLETO
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
              transaction_date: transaction_date || paymentData.transaction_date,
              provider: 'syncpay'
            })
          });

          console.log('📱 Webhook WhatsApp enviado');
        } catch (whatsappError) {
          console.error('Erro ao enviar webhook WhatsApp:', whatsappError);
        }
      }

      // Responder sucesso para a SyncPay
      return res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        payment_id: paymentId
      });
    }

    // Outros status (pending, failed, refunded, med)
    if (paymentStatus === 'pending') {
      console.log(`ℹ️ Pagamento pendente na SyncPay: ${paymentId}`);
    } else if (paymentStatus === 'failed') {
      console.log(`❌ Pagamento falhou na SyncPay: ${paymentId}`);
    } else if (paymentStatus === 'refunded') {
      console.log(`↩️ Pagamento reembolsado na SyncPay: ${paymentId}`);
    } else if (paymentStatus === 'med') {
      console.log(`⚠️ Pagamento em análise (MED) na SyncPay: ${paymentId}`);
    } else {
      console.log(`ℹ️ Status do pagamento na SyncPay: ${paymentStatus} - ID: ${paymentId}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook recebido',
      status: paymentStatus,
      payment_id: paymentId
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook da SyncPay:', error);
    return res.status(500).json({
      error: 'Erro ao processar webhook',
      message: error.message
    });
  }
}


