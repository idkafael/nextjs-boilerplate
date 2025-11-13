/**
 * Script para criar Produto com Co-Produtor (50% split)
 * Tenta diferentes abordagens para configurar o split via API
 * 
 * Uso:
 *   node scripts/criar-produto-com-coprodutor.js
 *   node scripts/criar-produto-com-coprodutor.js --token=SEU_TOKEN_AQUI --coprodutor-token=TOKEN_COPRODUTOR
 */

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

// Tokens
const API_TOKEN = getArg('token', process.env.IRONPAY_API_TOKEN || '1nppyoCxLouCQ4BMMAh92RIwlanP9QuF7c1QGFJxHg7g1sfsxvp1Ll4wxgLz');
const COPRODUTOR_TOKEN = getArg('coprodutor-token', process.env.IRONPAY_SPLIT_TOKEN || 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb');
const API_URL = 'https://api.ironpayapp.com.br/api/public/v1';

// Configuração do split (50%)
const SPLIT_PERCENTAGE = 50;

async function criarProduto() {
  console.log('\n📦 Criando produto no IronPay...\n');
  console.log(`Token principal: ${API_TOKEN.substring(0, 20)}...`);
  console.log(`Token co-produtor: ${COPRODUTOR_TOKEN.substring(0, 20)}...`);

  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  // Payload completo com tentativa de incluir co-produtor
  // Vamos tentar diferentes campos que podem configurar o split
  const payloads = [
    // Tentativa 1: Campo co_producer ou coproducer
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      co_producer: COPRODUTOR_TOKEN,
      co_producer_percentage: SPLIT_PERCENTAGE
    },
    // Tentativa 2: Campo split ou split_rules
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      split_rules: [{
        token: COPRODUTOR_TOKEN,
        percentage: SPLIT_PERCENTAGE
      }]
    },
    // Tentativa 3: Campo producers (array)
    {
      title: 'Acesso Vitalício - Marcelly Mar',
      cover: 'https://marprivacy.site/images/banner.jpg',
      sale_page: 'https://marprivacy.site',
      payment_type: 1,
      product_type: 'digital',
      delivery_type: 1,
      amount: 1990,
      producers: [{
        token: COPRODUTOR_TOKEN,
        percentage: SPLIT_PERCENTAGE
      }]
    },
    // Tentativa 4: Apenas criar produto (sem split na criação)
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
    console.log(`\n🔄 Tentativa ${i + 1}/${payloads.length}: ${Object.keys(payload).join(', ')}`);
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

        // Verificar se o split foi configurado
        if (data.co_producer || data.split_rules || data.producers) {
          console.log('✅ Split configurado na criação do produto!');
        } else {
          console.log('⚠️ Produto criado, mas split não configurado na criação.');
          console.log('   Tentando configurar split após criação...');
          await configurarSplitAposCriacao(productHash);
        }

        return { productHash, offerHash: data.offers?.[0]?.hash };
      } else {
        console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
        if (response.status !== 422) {
          // Se não for erro de validação, continuar tentando
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

async function configurarSplitAposCriacao(productHash) {
  console.log(`\n🔧 Tentando configurar split para produto ${productHash}...`);

  // Tentar diferentes endpoints possíveis para configurar co-produtor
  const endpoints = [
    `/products/${productHash}/co-producers`,
    `/products/${productHash}/producers`,
    `/products/${productHash}/split`,
    `/products/${productHash}/coproducers`
  ];

  for (const endpoint of endpoints) {
    const url = `${API_URL}${endpoint}?api_token=${API_TOKEN}`;
    
    const payloads = [
      { token: COPRODUTOR_TOKEN, percentage: SPLIT_PERCENTAGE },
      { api_token: COPRODUTOR_TOKEN, percentage: SPLIT_PERCENTAGE },
      { coproducer_token: COPRODUTOR_TOKEN, percentage: SPLIT_PERCENTAGE },
      { producer_token: COPRODUTOR_TOKEN, split_percentage: SPLIT_PERCENTAGE }
    ];

    for (const payload of payloads) {
      console.log(`\n🔄 Tentando: ${endpoint}`);
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

        if (response.ok) {
          console.log('✅ Split configurado com sucesso!');
          return true;
        } else {
          const data = JSON.parse(responseText).catch(() => ({}));
          if (response.status !== 404) {
            console.log(`⚠️ Endpoint existe mas retornou erro: ${data.message || 'Erro desconhecido'}`);
          }
        }
      } catch (error) {
        // Endpoint não existe, continuar tentando
        continue;
      }
    }
  }

  console.log('⚠️ Não foi possível configurar split via API.');
  console.log('   O split deve ser configurado manualmente no painel IronPay.');
  return false;
}

async function criarOfertas(productHash) {
  console.log(`\n🎁 Criando ofertas adicionais para produto ${productHash}...\n`);

  const ofertas = [
    { titulo: 'Oferta 3 Meses', valor: 5000 },
    { titulo: 'Oferta Vitalício', valor: 9990 }
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
  console.log('🚀 Script de Criação de Produto com Co-Produtor (50% Split) - IronPay');
  console.log('='.repeat(60));
  console.log(`Conta principal: lukkasborges123@gmail.com`);
  console.log(`Co-produtor: 50% split`);
  console.log(`API URL: ${API_URL}\n`);

  try {
    // 1. Criar produto (tentando configurar split)
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
    console.log('\n⚠️ IMPORTANTE SOBRE O SPLIT:');
    console.log('='.repeat(60));
    console.log('\nSe o split não foi configurado via API, configure manualmente:');
    console.log('1. Acesse o painel IronPay');
    console.log('2. Vá em "MEUS PRODUTOS"');
    console.log('3. Clique no produto criado');
    console.log('4. Configure o co-produtor com 50% de split');
    console.log(`5. Use o token: ${COPRODUTOR_TOKEN.substring(0, 20)}...`);
    console.log('\n💡 Copie essas variáveis para o seu .env.local\n');

  } catch (error) {
    console.error('\n❌ Falha:', error.message);
    console.error('\n💡 Verifique se os tokens estão corretos');
    process.exit(1);
  }
}

main();

