# 📋 Como Ver Logs de Runtime na Vercel

## ⚠️ Importante
Os logs de **build** são diferentes dos logs de **runtime**. Precisamos ver os logs de **runtime** (quando a API é executada).

## 🔍 Como Ver Logs de Runtime

### Método 1: Via Dashboard Vercel (Recomendado)

1. **Acesse:** https://vercel.com/dashboard
2. **Abra o projeto** `marprivacy.site`
3. **Vá em "Deployments"**
4. **Clique no último deploy** (o mais recente)
5. **Vá em "Functions"** → Clique em `/api/syncpay`
6. **Clique em "View Function Logs"** ou "Logs"
7. **Faça uma requisição** (tente fazer um pagamento no site)
8. **Os logs aparecerão em tempo real**

### Método 2: Via Real-time Logs

1. **Acesse:** https://vercel.com/dashboard
2. **Abra o projeto** `marprivacy.site`
3. **Vá em "Logs"** (aba no topo)
4. **Selecione o ambiente:** Production
5. **Faça uma requisição** (tente fazer um pagamento)
6. **Os logs aparecerão em tempo real**

## 🔍 O Que Procurar nos Logs

Quando você fizer uma requisição, deve aparecer:

```
🚀 VERSÃO NOVA - IronPay Integration v2.0.0
📅 Migração completa realizada em: 2025-11-13
🔗 API: https://api.ironpayapp.com.br/api/public/v1
🔍 Debug Handler - Variáveis de ambiente: {
  "hasApiToken": true/false,
  "hasApiUrl": true/false,
  "apiUrl": "...",
  "hasOfferHash": true/false,
  "hasProductHash": true/false,
  "isVercel": true,
  "vercelEnv": "production",
  "allIronPayVars": [...],
  "apiTokenLength": 0 ou número,
  "apiTokenPreview": "..."
}
```

## 🆘 Se Não Aparecer Nada

1. **Verifique se o deploy está ativo** (não em "Building")
2. **Aguarde alguns segundos** após fazer a requisição
3. **Tente fazer a requisição novamente**
4. **Verifique se está no ambiente correto** (Production)

## 📝 Teste Rápido

Abra o console do navegador e execute:

```javascript
fetch('https://marprivacy.site/api/syncpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'debug-env',
    debugToken: 'debug-2025-11-13'
  })
}).then(r => r.json()).then(console.log)
```

Isso retornará informações sobre as variáveis de ambiente disponíveis.

