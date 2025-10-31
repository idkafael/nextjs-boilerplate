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
      
      // Validar valor
      const valorFinal = valor || parseInt(process.env.PLANO_VITALICIO_19_90) || 1990;
      
      if (!valorFinal || valorFinal < 100) {
        return res.status(400).json({ 
          error: 'Valor inválido. O valor mínimo é R$ 1,00',
          message: 'Valor inválido. O valor mínimo é R$ 1,00'
        });
      }
      
      console.log('Criando PIX:', { valor: valorFinal, plano });
      
      // Criar PIX via PushinPay API
      const response = await fetch('https://api.pushinpay.com.br/pix/cashIn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: valorFinal,
          webhook_url: null,
          split_rules: []
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro PushinPay API:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        return res.status(response.status).json({ 
          error: data.error || data.message || 'Erro ao criar PIX',
          message: data.error || data.message || 'Erro ao criar PIX',
          details: data
        });
      }

      console.log('PIX criado com sucesso:', data);
      return res.status(200).json(data);
    }

    if (action === 'check-payment') {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId é obrigatório' });
      }

      // Verificar status do pagamento
      const response = await fetch(`https://api.pushinpay.com.br/pix/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ error: data.message || 'Erro ao verificar pagamento' });
      }

      return res.status(200).json(data);
    }

    return res.status(400).json({ 
      error: 'Ação inválida',
      message: 'Ação inválida' 
    });
  } catch (error) {
    console.error('Erro na API PushinPay:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro interno do servidor',
      message: error.message || 'Erro interno do servidor',
      type: error.name || 'Error'
    });
  }
}

