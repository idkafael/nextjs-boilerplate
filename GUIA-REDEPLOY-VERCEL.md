# 🔄 Guia: Como Fazer Redeploy na Vercel

## ⚠️ Problema
O erro `IRONPAY_API_TOKEN não configurado` ocorre porque as variáveis de ambiente foram adicionadas **DEPOIS** do último deploy. A Vercel precisa fazer um **novo build** para carregar as variáveis.

## ✅ Solução: Redeploy na Vercel

### Passo 1: Acessar o Dashboard da Vercel
1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta

### Passo 2: Abrir o Projeto
1. Encontre o projeto `marprivacy.site` ou `nextjs-boilerplate`
2. Clique no projeto para abrir

### Passo 3: Ir para Deployments
1. Clique na aba **"Deployments"** no topo
2. Você verá uma lista de todos os deploys

### Passo 4: Fazer Redeploy
1. Encontre o **último deploy** (o mais recente)
2. Clique nos **três pontos (⋯)** no canto direito do deploy
3. Selecione **"Redeploy"** no menu
4. Confirme clicando em **"Redeploy"** novamente

### Passo 5: Aguardar o Build
1. O build começará automaticamente
2. Aguarde **2-3 minutos** para o build completar
3. Você verá o progresso em tempo real

### Passo 6: Verificar se Funcionou
1. Após o build completar, acesse: https://marprivacy.site
2. Tente fazer um pagamento
3. O erro deve desaparecer

## 🔍 Verificação Adicional

### Verificar Variáveis de Ambiente
1. No projeto Vercel, vá em **Settings** → **Environment Variables**
2. Confirme que estas variáveis estão configuradas:
   - ✅ `IRONPAY_API_TOKEN`
   - ✅ `IRONPAY_API_URL`
   - ✅ `IRONPAY_PRODUCT_HASH`
   - ✅ `IRONPAY_OFFER_HASH`

### Verificar Logs do Deploy
1. Após o redeploy, clique no deploy
2. Vá em **"Functions"** → `api/syncpay`
3. Procure por: `🔍 Debug Handler - Variáveis de ambiente`
4. Deve mostrar: `hasApiToken: true`

## ⚡ Alternativa: Deploy via CLI

Se você tiver o Vercel CLI instalado:

```bash
cd nextjs-boilerplate-main
vercel --prod
```

## 📝 Notas Importantes

- ⚠️ **Sempre faça redeploy após adicionar/modificar variáveis de ambiente**
- ⚠️ **O Next.js compila variáveis no build, não em runtime**
- ✅ **Variáveis configuradas antes do build funcionam automaticamente**
- ✅ **Após o redeploy, as variáveis estarão disponíveis**

## 🆘 Ainda com Problemas?

Se após o redeploy ainda houver erro:

1. Verifique se as variáveis estão configuradas para **Production, Preview e Development**
2. Verifique se não há espaços extras ou caracteres especiais nas variáveis
3. Verifique os logs do deploy para erros de build
4. Tente fazer um redeploy novamente

