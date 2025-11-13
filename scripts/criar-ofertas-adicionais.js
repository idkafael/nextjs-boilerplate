/**
 * Script para criar ofertas adicionais para diferentes valores
 * Cria ofertas para R$ 50,00 e R$ 99,90
 * 
 * Uso:
 *   node scripts/criar-ofertas-adicionais.js
 */

const API_TOKEN = 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb';
const API_URL = 'https://api.ironpayapp.com.br/api/public/v1';
const PRODUCT_HASH = 'ndzkl4u6kt'; // Hash do produto criado na nova conta

// Ofertas para criar (apenas as que faltam)
// R$ 19,90 já existe: xf0o0 (criada automaticamente)
const ofertas = [
  { titulo: 'Oferta 3 Meses', valor: 5000 },   // R$ 50,00
  { titulo: 'Oferta Vitalício', valor: 9990 }  // R$ 99,90
];

async function criarOferta(titulo, valor) {
  console.log(`\n🎁 Criando oferta: ${titulo} - R$ ${(valor / 100).toFixed(2)}`);

  const url = `${API_URL}/products/${PRODUCT_HASH}/offers?api_token=${API_TOKEN}`;
  
  const payload = {
    title: titulo,
    price: valor  // IronPay usa "price" em vez de "amount" para ofertas
  };

  console.log('📤 Payload:', JSON.stringify(payload, null, 2));

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
      return null;
    }

    if (response.ok && data.hash) {
      console.log(`✅ Oferta criada! Hash: ${data.hash}`);
      return { hash: data.hash, titulo, valor };
    } else {
      console.error('❌ Erro:', data.message || data.error || 'Erro desconhecido');
      console.error('Resposta completa:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Criando Ofertas Adicionais - IronPay');
  console.log('='.repeat(60));
    console.log(`Produto Hash: ${PRODUCT_HASH}`);
    console.log(`Oferta existente (R$ 19,90): xf0o0\n`);

  const ofertasCriadas = [];

  for (const oferta of ofertas) {
    const resultado = await criarOferta(oferta.titulo, oferta.valor);
    if (resultado) {
      ofertasCriadas.push(resultado);
    }
    // Aguardar um pouco entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (ofertasCriadas.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('✅ OFERTAS CRIADAS:');
    console.log('='.repeat(60));
    
    console.log('\n1. Oferta 1 Mês (já existia)');
    console.log('   Hash: xf0o0');
    console.log('   Valor: R$ 19,90');
    
    ofertasCriadas.forEach((oferta, index) => {
      console.log(`\n${index + 2}. ${oferta.titulo}`);
      console.log(`   Hash: ${oferta.hash}`);
      console.log(`   Valor: R$ ${(oferta.valor / 100).toFixed(2)}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Hashes para configurar:');
    console.log('='.repeat(60));
    console.log('\n# Ofertas criadas:');
    console.log('IRONPAY_OFFER_HASH_19_90=xf0o0');
    ofertasCriadas.forEach((oferta) => {
      const valorKey = oferta.valor === 5000 ? '50_00' : '99_90';
      console.log(`IRONPAY_OFFER_HASH_${valorKey}=${oferta.hash}`);
    });
    
    console.log('\n💡 Agora você pode:');
    console.log('   1. Usar uma única oferta (hhfon) para todos os valores (recomendado)');
    console.log('   2. Ou adaptar o código para usar ofertas específicas por valor');
    console.log('      (veja GUIA-OFERTAS-ESPECIFICAS.md)\n');
  } else {
    console.log('\n❌ Nenhuma oferta foi criada.');
  }
}

main();
