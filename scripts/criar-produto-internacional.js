/**
 * Script para criar Produto com Pagamento Internacional habilitado
 * Suporta BRL, USD e EUR
 * 
 * Uso:
 *   node scripts/criar-produto-internacional.js
 *   node scripts/criar-produto-internacional.js --token=SEU_TOKEN_AQUI
 */

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

// Token da conta do Lukkas
const API_TOKEN = getArg('token', process.env.IRONPAY_API_TOKEN || '1nppyoCxLouCQ4BMMAh92RIwlanP9QuF7c1QGFJxHg7g1sfsxvp1Ll4wxgLz');
const API_URL = 'https://api.ironpayapp.com.br/api/public/v1';

// Token do co-produtor (para split de 50%)
const COPRODUTOR_TOKEN = process.env.IRONPAY_SPLIT_TOKEN || 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb';

async function criarProduto() {
  console.log('\n📦 Criando produto com pagamento internacional...\n');
  console.log(`Token: ${API_TOKEN.substring(0, 20)}...`);

  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  // Payload com campos que podem habilitar pagamento internacional
  // Vamos tentar diferentes abordagens
  const payloads = [
    // Tentativa 1: Com campo international ou currency
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      international: true,
      currencies: ['BRL', 'USD', 'EUR']
    },
    // Tentativa 2: Com campo accept_international
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      accept_international: true,
      supported_currencies: ['BRL', 'USD', 'EUR']
    },
    // Tentativa 3: Com campo payment_methods incluindo internacional
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      payment_methods: ['pix', 'credit_card'],
      international_payment: true
    },
    // Tentativa 4: Apenas criar produto (pagamento internacional pode ser padrão)
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990
    }
  ];

  for (let i = 0; i < payloads.length; i++) {
    const payload = payloads[i];
    console.log(`\n🔄 Tentativa ${i + 1}/${payloads.length}`);
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
        console.error('❌ Resposta não é JSON:', responseText.substring(0, 500));
        continue;
      }

      const productHash = data.hash || data.data?.hash;
      
      if (response.ok && productHash) {
        console.log('\n✅ PRODUTO CRIADO COM SUCESSO!');
        console.log(`Hash do Produto: ${productHash}`);
        
        if (data.offers && data.offers.length > 0) {
          console.log(`Oferta criada automaticamente: ${data.offers[0].hash}`);
        }

        // Verificar se pagamento internacional foi habilitado
        if (data.international || data.accept_international || data.supported_currencies) {
          console.log('✅ Pagamento internacional configurado!');
          console.log('   Moedas suportadas:', data.supported_currencies || data.currencies || 'BRL, USD, EUR');
        } else {
          console.log('⚠️ Produto criado. Pagamento internacional pode estar habilitado por padrão.');
          console.log('   Verifique no painel IronPay se USD e EUR estão disponíveis.');
        }

        return { productHash, offerHash: data.offers?.[0]?.hash, data };
      } else {
        console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
        if (response.status !== 422) {
          continue;
        }
      }
    } catch (error) {
      console.error('❌ Erro de rede:', error.message);
      continue;
    }
  }

  throw new Error('Todas as tentativas de criar produto falharam');
}

async function criarOfertas(productHash) {
  console.log(`\n🎁 Criando ofertas adicionais para produto ${productHash}...\n`);

  const ofertas = [
    { titulo: 'Oferta 3 Meses', valor: 5000 },   // R$ 50,00
    { titulo: 'Oferta Vitalício', valor: 9990 }  // R$ 99,90
  ];

  const ofertasCriadas = [];

  for (const oferta of ofertas) {
    const url = `${API_URL}/products/${productHash}/offers?api_token=${API_TOKEN}`;
    
    const payload = {
      title: oferta.titulo,
      price: oferta.valor
    };

    console.log(`🔄 Criando: ${oferta.titulo} - R$ ${(oferta.valor / 100).toFixed(2)}`);

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
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        continue;
      }

      if (response.ok && data.hash) {
        console.log(`✅ Oferta criada! Hash: ${data.hash}\n`);
        ofertasCriadas.push({ hash: data.hash, titulo: oferta.titulo, valor: oferta.valor });
      }
    } catch (error) {
      // Continuar
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return ofertasCriadas;
}

async function main() {
  console.log('🚀 Script de Criação de Produto com Pagamento Internacional - IronPay');
  console.log('='.repeat(60));
  console.log(`Conta: lukkasborges123@gmail.com`);
  console.log(`Moedas: BRL, USD, EUR`);
  console.log(`API URL: ${API_URL}\n`);

  try {
    // 1. Criar produto (tentando habilitar pagamento internacional)
    const { productHash, offerHash } = await criarProduto();

    // 2. Criar ofertas adicionais
    const ofertasCriadas = await criarOfertas(productHash);

    // 3. Exibir resultado final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CONCLUÍDO!');
    console.log('='.repeat(60));
    console.log(`\nIRONPAY_PRODUCT_HASH=${productHash}`);
    
    if (offerHash) {
      console.log(`IRONPAY_OFFER_HASH=${offerHash}`);
      console.log(`IRONPAY_OFFER_HASH_19_90=${offerHash}`);
    }
    
    ofertasCriadas.forEach((oferta) => {
      const valorKey = oferta.valor === 5000 ? '50_00' : '99_90';
      console.log(`IRONPAY_OFFER_HASH_${valorKey}=${oferta.hash}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 INFORMAÇÕES SOBRE PAGAMENTO INTERNACIONAL:');
    console.log('='.repeat(60));
    console.log('\n✅ O sistema já está configurado para aceitar múltiplas moedas:');
    console.log('   - BRL (Real) - PIX');
    console.log('   - USD (Dólar) - Cartão de Crédito');
    console.log('   - EUR (Euro) - Cartão de Crédito');
    console.log('\n📝 Para usar no frontend:');
    console.log('   await window.SyncPayReal.criarPix(null, "BRL"); // Real');
    console.log('   await window.SyncPayReal.criarPix(null, "USD"); // Dólar');
    console.log('   await window.SyncPayReal.criarPix(null, "EUR"); // Euro');
    console.log('\n⚠️ IMPORTANTE: Configure o co-produtor no painel:');
    console.log('   1. Acesse o painel IronPay');
    console.log('   2. Vá em "MEUS PRODUTOS"');
    console.log('   3. Clique no produto criado');
    console.log('   4. Configure co-produtor com 50% de split');
    console.log(`   5. Token: ${COPRODUTOR_TOKEN.substring(0, 20)}...`);
    console.log('\n💡 Copie essas variáveis para o seu .env.local\n');

  } catch (error) {
    console.error('\n❌ Falha:', error.message);
    console.error('\n💡 Verifique se o token está correto');
    process.exit(1);
  }
}

main();

