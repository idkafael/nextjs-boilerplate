/**
 * Script para verificar se o arquivo .env.local existe e tem as variáveis necessárias
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

console.log('🔍 Verificando arquivo .env.local...\n');
console.log('='.repeat(60));

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local NÃO encontrado!');
  console.log('\n💡 Copie o arquivo env.example para .env.local:');
  console.log('   cp env.example .env.local');
  process.exit(1);
}

console.log('✅ Arquivo .env.local encontrado');

const envContent = fs.readFileSync(envPath, 'utf-8');

const requiredVars = [
  'PUSHINPAY_TOKEN',
  'PUSHINPAY_API_URL'
];

console.log('\n📋 Verificando variáveis obrigatórias:\n');

let todasOk = true;

for (const varName of requiredVars) {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && match[1].trim() && !match[1].includes('seu_') && !match[1].includes('aqui')) {
    const value = match[1].trim();
    const displayValue = varName.includes('TOKEN') ? `${value.substring(0, 20)}...` : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NÃO CONFIGURADO ou está com valor padrão`);
    todasOk = false;
  }
}

console.log('\n' + '='.repeat(60));

if (todasOk) {
  console.log('✅ Todas as variáveis obrigatórias estão configuradas!');
  console.log('\n⚠️ IMPORTANTE: Reinicie o servidor Next.js:');
  console.log('   1. Pare o servidor (Ctrl+C no terminal)');
  console.log('   2. Execute: npm run dev');
  console.log('\n💡 O Next.js só carrega .env.local na inicialização!');
} else {
  console.log('❌ Algumas variáveis estão faltando ou com valores padrão!');
  console.log('\n💡 Verifique o arquivo .env.local e atualize os valores');
}
