/**
 * Script para criar Produto e Oferta no IronPay com token customizado
 * Permite especificar o token de API via argumento ou variável de ambiente
 * 
 * Uso:
 *   node scripts/criar-produto-com-token.js
 *   node scripts/criar-produto-com-token.js --token=SEU_TOKEN_AQUI
 */

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

// Token pode vir de argumento, variável de ambiente ou padrão
const API_TOKEN = getArg('token', process.env.IRONPAY_API_TOKEN || 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb');
const API_URL = 'https://api.ironpayapp.com.br/api/public/v1';

async function criarProduto() {
  console.log('\n📦 Tentando criar produto no IronPay...\n');
  console.log(`Token usado: ${API_TOKEN.substring(0, 20)}...`);

  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  // Payload completo (obrigatório: cover e sale_page)
  const payload = {
    title: 'Acesso Vitalício - Marcelly Mar',
    cover: 'https://marprivacy.site/images/banner.jpg',
    sale_page: 'https://marprivacy.site',
    payment_type: 1,
    product_type: 'digital',
    delivery_type: 1,
    amount: 1990
  };

  console.log(`🔄 Criando produto...`);
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

    // IronPay retorna hash diretamente ou em data.hash
    const productHash = data.hash || data.data?.hash;
    
    if (response.ok && productHash) {
      console.log('\n✅ SUCESSO!');
      console.log(`Hash do Produto: ${productHash}`);
      
      // Verificar se já tem oferta criada automaticamente
      if (data.offers && data.offers.length > 0) {
        console.log(`Oferta criada automaticamente: ${data.offers[0].hash}`);
        return { productHash, offerHash: data.offers[0].hash };
      }
      console.log('');
      return { productHash, offerHash: null };
    } else {
      console.error('\n❌ Erro:', data.message || data.error || 'Erro desconhecido');
      console.error('Resposta completa:', JSON.stringify(data, null, 2));
      throw new Error(data.message || data.error || 'Erro ao criar produto');
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    throw error;
  }
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

      if (response.ok && data.hash) {
        console.log(`✅ Oferta criada! Hash: ${data.hash}\n`);
        ofertasCriadas.push({ hash: data.hash, titulo: oferta.titulo, valor: oferta.valor });
      } else {
        console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
        console.error('Resposta:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
    }
    
    // Aguardar entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return ofertasCriadas;
}

async function main() {
  console.log('🚀 Script de Criação de Produto e Ofertas - IronPay');
  console.log('='.repeat(60));
  console.log(`Conta: lukkasborges123@gmail.com`);
  console.log(`API URL: ${API_URL}\n`);

  try {
    // 1. Criar produto
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
    console.log('\n💡 Copie essas variáveis para o seu .env.local\n');

  } catch (error) {
    console.error('\n❌ Falha:', error.message);
    console.error('\n💡 Verifique se o token de API está correto para a conta lukkasborges123@gmail.com');
    process.exit(1);
  }
}

main();





