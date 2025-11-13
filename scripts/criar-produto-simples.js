/**
 * Script simplificado para criar Produto e Oferta no IronPay
 * Tenta diferentes combinações de campos para evitar erros
 */

// Token pode vir de variável de ambiente ou usar padrão
// Para usar token de outra conta: export IRONPAY_API_TOKEN=seu_token_aqui
const API_TOKEN = process.env.IRONPAY_API_TOKEN || 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb';
const API_URL = 'https://api.ironpayapp.com.br/api/public/v1';

async function criarProduto() {
  console.log('\n📦 Tentando criar produto no IronPay...\n');

  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  // Tentativa 1: Payload mínimo (sem categoria)
  const payload1 = {
    title: 'Acesso Vitalício - Marcelly Mar',
    product_type: 'digital',
    delivery_type: 1,
    amount: 1990
  };

  // Tentativa 2: Com mais campos
  const payload2 = {
    title: 'Acesso Vitalício - Marcelly Mar',
    cover: 'https://marprivacy.site/images/banner.jpg',
    sale_page: 'https://marprivacy.site',
    payment_type: 1,
    product_type: 'digital',
    delivery_type: 1,
    amount: 1990
  };

  const tentativas = [
    { nome: 'Payload mínimo', payload: payload1 },
    { nome: 'Payload completo', payload: payload2 }
  ];

  for (const tentativa of tentativas) {
    console.log(`🔄 Tentativa: ${tentativa.nome}`);
    console.log('Payload:', JSON.stringify(tentativa.payload, null, 2));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(tentativa.payload)
      });

      const responseText = await response.text();
      console.log(`Status: ${response.status}`);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Resposta não é JSON:');
        console.error(responseText.substring(0, 500));
        continue;
      }

      // IronPay retorna hash diretamente ou em data.hash
      const productHash = data.hash || data.data?.hash;
      
      if (response.ok && productHash) {
        console.log('✅ SUCESSO!');
        console.log(`Hash do Produto: ${productHash}`);
        
        // Verificar se já tem oferta criada automaticamente
        if (data.offers && data.offers.length > 0) {
          console.log(`Oferta criada automaticamente: ${data.offers[0].hash}`);
        }
        console.log('');
        return productHash;
      } else {
        console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
        console.error('Resposta completa:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('❌ Erro de rede:', error.message);
    }
    
    console.log('');
  }

  throw new Error('Todas as tentativas falharam');
}

async function criarOferta(productHash) {
  console.log(`🎁 Criando oferta para produto ${productHash}...\n`);

  const url = `${API_URL}/products/${productHash}/offers?api_token=${API_TOKEN}`;
  
  const payload = {
    title: 'Oferta Vitalício',
    price: 1990  // IronPay usa "price" para ofertas
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log(`Status: ${response.status}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Resposta não é JSON:');
      console.error(responseText.substring(0, 500));
      throw new Error('Resposta inválida');
    }

    if (response.ok && data.success && data.data && data.data.hash) {
      console.log('✅ SUCESSO!');
      console.log(`Hash da Oferta: ${data.data.hash}\n`);
      return data.data.hash;
    } else {
      console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
      console.error('Resposta completa:', JSON.stringify(data, null, 2));
      throw new Error(data.message || data.error || 'Erro ao criar oferta');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Script Simplificado - IronPay');
  console.log('='.repeat(60));

  try {
    const productHash = await criarProduto();
    const offerHash = await criarOferta(productHash);

    console.log('='.repeat(60));
    console.log('✅ CONCLUÍDO!');
    console.log('='.repeat(60));
    console.log(`\nIRONPAY_PRODUCT_HASH=${productHash}`);
    console.log(`IRONPAY_OFFER_HASH=${offerHash}\n`);

  } catch (error) {
    console.error('\n❌ Falha:', error.message);
    console.error('\n💡 Tente criar manualmente via painel IronPay ou API');
    process.exit(1);
  }
}

main();

