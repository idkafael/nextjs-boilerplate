// API Route para PushinPay - Protegida no servidor
// Só o servidor tem acesso às variáveis de ambiente

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { action } = req.body;

  // Token PushinPay do ambiente (seguro, não exposto no cliente)
  const token = process.env.PUSHINPAY_TOKEN;
  
  if (!token || token === 'SEU_TOKEN_PUSHINPAY_AQUI') {
    return res.status(500).json({ 
      error: 'Token PushinPay não configurado. Configure a variável PUSHINPAY_TOKEN no .env.local' 
    });
  }

  try {
    if (action === 'create-pix') {
      const { valor, plano } = req.body;
      
      // Criar PIX via PushinPay API
      const response = await fetch('https://api.pushinpay.com.br/api/v1/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          valor: valor || process.env.PLANO_VITALICIO_19_90 || 1990,
          plano: plano || 'Vitalício',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ error: data.message || 'Erro ao criar PIX' });
      }

      return res.status(200).json(data);
    }

    if (action === 'check-payment') {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId é obrigatório' });
      }

      // Verificar status do pagamento
      const response = await fetch(`https://api.pushinpay.com.br/api/v1/pix/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ error: data.message || 'Erro ao verificar pagamento' });
      }

      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Ação inválida' });
  } catch (error) {
    console.error('Erro na API PushinPay:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

