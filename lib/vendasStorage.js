// Armazenamento compartilhado de vendas
// Compatível com ambiente serverless (Vercel)
// NOTA: Armazenamento em memória - dados serão perdidos quando a função reiniciar
// Para persistência, migre para um banco de dados (MongoDB, PostgreSQL, Supabase, etc.)

let vendasStorage = [];

export function lerVendas() {
  // Sempre retornar do armazenamento em memória
  // Em ambiente serverless, não podemos ler/escrever arquivos
  return vendasStorage || [];
}

export function salvarVendas(vendas) {
  // Sempre salvar apenas em memória
  vendasStorage = Array.isArray(vendas) ? vendas : [];
  return true;
}

// Função auxiliar para adicionar uma venda
export function adicionarVenda(venda) {
  const vendas = lerVendas();
  vendas.push(venda);
  salvarVendas(vendas);
  return venda;
}
