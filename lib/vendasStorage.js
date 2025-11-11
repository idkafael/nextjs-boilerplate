// Armazenamento compartilhado de vendas
// Compatível com ambiente serverless (Vercel)

let vendasStorage = [];

// Tentar carregar do arquivo apenas em desenvolvimento local
export function lerVendas() {
  // Em ambiente serverless (Vercel), usar apenas memória
  if (process.env.VERCEL) {
    return vendasStorage;
  }
  
  // Em desenvolvimento local, tentar ler do arquivo
  try {
    const fs = require('fs');
    const path = require('path');
    const VENDAS_FILE = path.join(process.cwd(), 'data', 'vendas.json');
    
    if (fs.existsSync(VENDAS_FILE)) {
      const data = fs.readFileSync(VENDAS_FILE, 'utf8');
      const vendas = JSON.parse(data);
      vendasStorage = vendas; // Sincronizar com memória
      return vendas;
    }
  } catch (error) {
    console.error('Erro ao ler vendas do arquivo:', error);
  }
  
  return vendasStorage;
}

// Salvar vendas
export function salvarVendas(vendas) {
  vendasStorage = vendas;
  
  // Em desenvolvimento local, tentar salvar no arquivo também
  if (!process.env.VERCEL) {
    try {
      const fs = require('fs');
      const path = require('path');
      const dataDir = path.join(process.cwd(), 'data');
      const VENDAS_FILE = path.join(dataDir, 'vendas.json');
      
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(VENDAS_FILE, JSON.stringify(vendas, null, 2), 'utf8');
    } catch (error) {
      console.error('Erro ao salvar vendas no arquivo:', error);
      // Não falhar se não conseguir salvar no arquivo
    }
  }
  
  return true;
}

