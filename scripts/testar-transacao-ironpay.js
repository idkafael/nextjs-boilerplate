// Script para testar criação de transação na IronPay
// Execute: node scripts/testar-transacao-ironpay.js

require('dotenv').config({ path: '.env.local' });

const API_TOKEN = process.env.IRONPAY_API_TOKEN;
const API_URL = process.env.IRONPAY_API_URL || 'https://api.ironpayapp.com.br/api/public/v1';
const OFFER_HASH = process.env.IRONPAY_OFFER_HASH;
const PRODUCT_HASH = process.env.IRONPAY_PRODUCT_HASH;

if (!API_TOKEN || !OFFER_HASH || !PRODUCT_HASH) {
  console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
  console.error('Configure no .env.local:');
  console.error('  - IRONPAY_API_TOKEN');
  console.error('  - IRONPAY_OFFER_HASH');
  console.error('  - IRONPAY_PRODUCT_HASH');
  process.exit(1);
}

async function testarTransacao() {
  console.log('\n🧪 Testando criação de transação na IronPay...\n');
  console.log(`Token: ${API_TOKEN.substring(0, 20)}...`);
  console.log(`Offer Hash: ${OFFER_HASH}`);
  console.log(`Product Hash: ${PRODUCT_HASH}\n`);

  const url = `${API_URL}/transactions?api_token=${API_TOKEN}`;

  // Payload mínimo conforme documentação
  const payload = {
    amount: 1990, // R$ 19,90 em centavos
    offer_hash: OFFER_HASH,
    payment_method: 'pix',
    customer: {
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone_number: '11999999999',
      document: '00000000191', // CPF válido de teste
      street_name: 'Rua das Flores',
      number: '123',
      complement: '',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01310100'
    },
    cart: [{
      product_hash: PRODUCT_HASH,
      title: 'Acesso Vitalício - Marcelly Mar',
      price: 1990,
      quantity: 1,
      operation_type: 1,
      tangible: false
    }],
    installments: 1,
    expire_in_days: 1,
    transaction_origin: 'api'
  };

  console.log('📤 Payload:', JSON.stringify(payload, null, 2));
  console.log('\n🔄 Enviando requisição...\n');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`📥 Status HTTP: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Resposta não é JSON:');
      console.error(responseText);
      return;
    }

    console.log('\n📥 Resposta completa:', JSON.stringify(data, null, 2));

    if (response.ok) {
      const transactionHash = data.hash || data.data?.hash;
      const paymentStatus = data.data?.payment_status || data.status;
      
      console.log('\n✅ Transação criada com sucesso!');
      console.log(`Hash: ${transactionHash}`);
      console.log(`Status: ${paymentStatus}`);
      
      if (paymentStatus === 'refused') {
        console.error('\n❌ ATENÇÃO: Transação foi RECUSADA!');
        console.error('Possíveis causas:');
        console.error('  1. Conta IronPay não verificada');
        console.error('  2. Produto/oferta inativo');
        console.error('  3. Dados do cliente inválidos');
        console.error('  4. Configuração da conta incompleta');
      } else if (data.data?.pix?.pix_url) {
        console.log('\n✅ Código PIX gerado!');
        console.log(`PIX URL: ${data.data.pix.pix_url.substring(0, 50)}...`);
      }
    } else {
      console.error('\n❌ Erro ao criar transação:');
      console.error(`Status: ${response.status}`);
      console.error(`Mensagem: ${data.message || data.error || 'Erro desconhecido'}`);
      if (data.errors) {
        console.error('Erros:', JSON.stringify(data.errors, null, 2));
      }
    }
  } catch (error) {
    console.error('\n❌ Erro de rede:', error.message);
    console.error(error.stack);
  }
}

testarTransacao();





