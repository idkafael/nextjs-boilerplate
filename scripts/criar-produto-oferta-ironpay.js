/**
 * Script auxiliar para criar Produto e Oferta no IronPay
 * e obter os hashes necessários para configurar as variáveis de ambiente
 * 
 * Uso:
 *   node scripts/criar-produto-oferta-ironpay.js
 * 
 * Ou com valores customizados:
 *   node scripts/criar-produto-oferta-ironpay.js --titulo="Meu Produto" --valor=1990
 * 
 * Para listar produtos existentes:
 *   node scripts/criar-produto-oferta-ironpay.js --listar
 */

const API_TOKEN = process.env.IRONPAY_API_TOKEN || 'V40fQfjehIy2SM0xpueMZIEwlN3jbKMklb8zqBsjYOVIfXCyeqYZ5E7QZIpb';
const API_URL = process.env.IRONPAY_API_URL || 'https://api.ironpayapp.com.br/api/public/v1';

// Valores padrão (podem ser sobrescritos via argumentos)
const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

const LISTAR_MODE = args.includes('--listar') || args.includes('--list');

const PRODUTO_TITULO = getArg('titulo', 'Acesso Vitalício - Marcelly Mar');
const PRODUTO_COVER = getArg('cover', 'https://marprivacy.site/images/banner.jpg');
const PRODUTO_SALE_PAGE = getArg('sale_page', 'https://marprivacy.site');
const OFERTA_TITULO = getArg('oferta_titulo', 'Oferta Vitalício');
const VALOR_CENTAVOS = parseInt(getArg('valor', '1990')); // R$ 19,90

async function listarCategorias() {
  console.log('\n📋 Listando categorias disponíveis...');
  const url = `${API_URL}/categories?api_token=${API_TOKEN}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      console.log('✅ Categorias disponíveis:');
      data.data.forEach(cat => {
        console.log(`   ID: ${cat.id} - ${cat.name || cat.title || 'Sem nome'}`);
      });
      return data.data;
    } else {
      console.log('⚠️ Não foi possível listar categorias. Continuando sem categoria...');
      return [];
    }
  } catch (error) {
    console.log('⚠️ Erro ao listar categorias. Continuando sem categoria...');
    return [];
  }
}

async function listarProdutos() {
  console.log('\n📦 Listando produtos existentes...');
  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.data && Array.isArray(data.data)) {
      if (data.data.length === 0) {
        console.log('   Nenhum produto encontrado.');
        return [];
      }
      
      console.log(`✅ Encontrados ${data.data.length} produto(s):\n`);
      data.data.forEach((prod, index) => {
        console.log(`   ${index + 1}. ${prod.title || 'Sem título'}`);
        console.log(`      Hash: ${prod.hash}`);
        console.log(`      Valor: R$ ${((prod.amount || 0) / 100).toFixed(2)}`);
        console.log(`      Tipo: ${prod.product_type || 'N/A'}`);
        console.log('');
      });
      return data.data;
    } else {
      console.log('⚠️ Resposta inesperada da API:', data);
      return [];
    }
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error.message);
    return [];
  }
}

async function criarProduto() {
  console.log('\n📦 Criando produto no IronPay...');
  console.log(`   Título: ${PRODUTO_TITULO}`);
  console.log(`   Valor: R$ ${(VALOR_CENTAVOS / 100).toFixed(2)}`);

  // Primeiro, tentar obter categorias
  const categorias = await listarCategorias();
  const categoriaId = categorias.length > 0 ? categorias[0].id : null;

  const url = `${API_URL}/products?api_token=${API_TOKEN}`;
  
  // Payload mínimo - sem categoria se não houver
  const payload = {
    title: PRODUTO_TITULO,
    cover: PRODUTO_COVER,
    sale_page: PRODUTO_SALE_PAGE,
    payment_type: 1, // 1 = pagamento único
    product_type: 'digital', // digital ou physical
    delivery_type: 1, // 1 = entrega automática
    amount: VALOR_CENTAVOS // Valor em centavos
  };

  // Adicionar categoria apenas se disponível
  if (categoriaId) {
    payload.id_category = categoriaId;
    console.log(`   Categoria: ${categoriaId}`);
  } else {
    console.log(`   ⚠️ Criando sem categoria (pode ser opcional)`);
  }

  console.log('\n📤 Payload enviado:');
  console.log(JSON.stringify(payload, null, 2));

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
    } catch (parseError) {
      console.error('❌ Resposta não é JSON válido:');
      console.error('Status:', response.status);
      console.error('Headers:', Object.fromEntries(response.headers));
      console.error('Resposta (primeiros 500 chars):', responseText.substring(0, 500));
      throw new Error(`Resposta inválida da API (Status: ${response.status})`);
    }

    if (!response.ok) {
      console.error('\n❌ Erro ao criar produto:');
      console.error('Status:', response.status);
      console.error('Resposta completa:', JSON.stringify(data, null, 2));
      
      // Mensagens de erro mais específicas
      if (response.status === 400) {
        throw new Error('Dados inválidos. Verifique os campos obrigatórios.');
      } else if (response.status === 401) {
        throw new Error('Token de API inválido ou expirado.');
      } else if (response.status === 422) {
        throw new Error('Erro de validação. Verifique os dados enviados.');
      } else {
        throw new Error(data.message || data.error || `Erro do servidor (Status: ${response.status})`);
      }
    }

    if (data.success && data.data && data.data.hash) {
      console.log('\n✅ Produto criado com sucesso!');
      console.log(`   Hash do Produto: ${data.data.hash}`);
      return data.data.hash;
    } else {
      console.error('❌ Resposta inesperada:', data);
      throw new Error('Resposta inválida da API - hash não encontrado');
    }
  } catch (error) {
    console.error('\n❌ Erro ao criar produto:', error.message);
    throw error;
  }
}

async function criarOferta(productHash) {
  console.log('\n🎁 Criando oferta no IronPay...');
  console.log(`   Título: ${OFERTA_TITULO}`);
  console.log(`   Produto Hash: ${productHash}`);

  const url = `${API_URL}/products/${productHash}/offers?api_token=${API_TOKEN}`;
  
  const payload = {
    title: OFERTA_TITULO,
    cover: PRODUTO_COVER,
    amount: VALOR_CENTAVOS // Valor em centavos
  };

  console.log('\n📤 Payload enviado:');
  console.log(JSON.stringify(payload, null, 2));

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
    } catch (parseError) {
      console.error('❌ Resposta não é JSON válido:');
      console.error('Status:', response.status);
      console.error('Resposta:', responseText.substring(0, 500));
      throw new Error(`Resposta inválida da API (Status: ${response.status})`);
    }

    if (!response.ok) {
      console.error('\n❌ Erro ao criar oferta:');
      console.error('Status:', response.status);
      console.error('Resposta completa:', JSON.stringify(data, null, 2));
      
      if (response.status === 404) {
        throw new Error('Produto não encontrado. Verifique se o hash do produto está correto.');
      } else if (response.status === 400) {
        throw new Error('Dados inválidos. Verifique os campos obrigatórios.');
      } else if (response.status === 401) {
        throw new Error('Token de API inválido ou expirado.');
      } else {
        throw new Error(data.message || data.error || `Erro do servidor (Status: ${response.status})`);
      }
    }

    if (data.success && data.data && data.data.hash) {
      console.log('\n✅ Oferta criada com sucesso!');
      console.log(`   Hash da Oferta: ${data.data.hash}`);
      return data.data.hash;
    } else {
      console.error('❌ Resposta inesperada:', data);
      throw new Error('Resposta inválida da API - hash não encontrado');
    }
  } catch (error) {
    console.error('\n❌ Erro ao criar oferta:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Script de Criação de Produto e Oferta - IronPay');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`API Token: ${API_TOKEN.substring(0, 20)}...`);

  // Modo listar
  if (LISTAR_MODE) {
    await listarProdutos();
    return;
  }

  try {
    // 1. Criar produto
    const productHash = await criarProduto();

    // 2. Criar oferta para o produto
    const offerHash = await criarOferta(productHash);

    // 3. Exibir resultado final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CONCLUÍDO! Copie os hashes abaixo para o .env.local:');
    console.log('='.repeat(60));
    console.log(`\nIRONPAY_PRODUCT_HASH=${productHash}`);
    console.log(`IRONPAY_OFFER_HASH=${offerHash}`);
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Dica: Adicione essas variáveis ao seu arquivo .env.local');
    console.log('   e reinicie o servidor Next.js.\n');

  } catch (error) {
    console.error('\n❌ Falha ao criar produto/oferta:', error.message);
    console.error('\n💡 Dicas para resolver:');
    console.error('   1. Verifique se o token de API está correto');
    console.error('   2. Tente listar produtos existentes: node scripts/criar-produto-oferta-ironpay.js --listar');
    console.error('   3. Verifique a documentação: https://docs.ironpayapp.com.br');
    console.error('   4. Entre em contato com o suporte IronPay se o problema persistir\n');
    process.exit(1);
  }
}

// Executar
main();
