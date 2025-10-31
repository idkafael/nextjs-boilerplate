# 🔔 Sistema de Webhook PushinPay

Sistema completo de notificações instantâneas de pagamento confirmado.

---

## ✅ O que foi implementado

### 1. **Endpoint de Webhook** (`/api/webhook-pushinpay`)
- Recebe notificações automáticas da PushinPay
- Processa pagamentos confirmados
- Envia notificações para Telegram
- Suporta webhook para WhatsApp

### 2. **Configuração Automática de Webhook**
- URL do webhook é enviada automaticamente ao criar PIX
- PushinPay notifica quando pagamento é confirmado

### 3. **Detecção de Pagamento no Frontend**
- Verifica status a cada 3 segundos
- Detecta pagamento confirmado (paid, approved, confirmed)
- Dispara evento customizado `paymentConfirmed`
- Envia evento Facebook Pixel `Purchase`

### 4. **Redirecionamento Automático**
- Mostra mensagem de sucesso
- Recarrega página (conteúdo desbloqueado)
- Ou redireciona para página de agradecimento

---

## 🔧 Configuração na Vercel

Adicione estas variáveis de ambiente:

### **Obrigatórias:**

```env
# Token da API PushinPay
PUSHINPAY_TOKEN=seu_token_aqui

# URL base da API
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api

# Valor do plano em centavos
PLANO_VITALICIO_19_90=1990

# URL do seu site (para webhook)
NEXT_PUBLIC_SITE_URL=https://marprivacy.site
```

### **Opcionais (Notificações):**

```env
# Token de segurança do webhook (opcional)
PUSHINPAY_WEBHOOK_TOKEN=seu_token_secreto_aqui

# Telegram Bot (notificações)
TELEGRAM_BOT_TOKEN=seu_token_bot
TELEGRAM_CHAT_ID=seu_chat_id

# WhatsApp Webhook (opcional)
WHATSAPP_WEBHOOK_URL=https://sua-url-webhook.com

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id
```

---

## 📡 Como Funciona

### **Fluxo de Pagamento:**

1. **Cliente** clica em "1 Mês - R$ 19,90"
2. **Sistema** cria PIX via API PushinPay com URL de webhook
3. **Cliente** escaneia QR Code ou copia código PIX
4. **Cliente** paga via app bancário

### **Confirmação Instantânea (Webhook):**

5. **PushinPay** detecta pagamento confirmado
6. **PushinPay** envia POST para `/api/webhook-pushinpay`
7. **Webhook** processa notificação
8. **Webhook** envia mensagem no Telegram (se configurado)
9. **Frontend** detecta pagamento confirmado
10. **Sistema** mostra mensagem de sucesso
11. **Sistema** recarrega página (conteúdo desbloqueado)

### **Verificação por Polling (Backup):**

- Se webhook falhar, sistema verifica a cada 3 segundos
- Consulta API PushinPay: `/api/pix/{id}`
- Detecta mudança de status: `pending` → `paid`

---

## 🧪 Testar Webhook Localmente

Para testar o webhook em desenvolvimento local:

### **1. Usar ngrok (recomendado)**

```bash
# Instalar ngrok
npm install -g ngrok

# Rodar projeto Next.js
npm run dev

# Em outro terminal, expor para internet
ngrok http 3001

# Ngrok vai gerar uma URL pública:
# https://abc123.ngrok.io

# Adicionar no .env.local:
NEXT_PUBLIC_SITE_URL=https://abc123.ngrok.io
```

### **2. Testar manualmente**

```bash
# Simular webhook da PushinPay
curl -X POST http://localhost:3001/api/webhook-pushinpay \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_123",
    "status": "paid",
    "value": 1990,
    "paid_at": "2025-10-31T12:00:00Z"
  }'
```

---

## 📊 Logs e Debug

### **Ver logs na Vercel:**

1. Acesse: **Deployments** → Clique no deploy → **Functions**
2. Selecione: `api/webhook-pushinpay`
3. Veja logs em tempo real

### **Logs importantes:**

```
📩 Webhook recebido da PushinPay: {...}
💰 Pagamento recebido: { id, status, value }
✅ Pagamento confirmado! ID: xxx
📱 Notificação enviada no Telegram
```

---

## 🔒 Segurança

### **Token de Webhook (Opcional)**

Adicione validação extra:

```env
PUSHINPAY_WEBHOOK_TOKEN=seu_token_secreto_muito_seguro
```

A PushinPay deve enviar este token no header:
```
X-Webhook-Token: seu_token_secreto_muito_seguro
```

### **IP Whitelist (Avançado)**

Configure no código para aceitar apenas IPs da PushinPay.

---

## 📱 Notificações

### **Telegram:**

1. Crie um bot: [@BotFather](https://t.me/BotFather)
2. Obtenha token: `/newbot`
3. Obtenha chat ID: [@userinfobot](https://t.me/userinfobot)
4. Configure variáveis de ambiente

**Mensagem enviada:**
```
🎉 Novo Pagamento Confirmado!
💰 Valor: R$ 19,90
🆔 ID: xxx
✅ Status: APROVADO
```

### **WhatsApp:**

Configure um webhook externo para receber notificações.

---

## 🎯 Eventos Customizados

O sistema dispara eventos que você pode escutar:

```javascript
// Escutar pagamento confirmado
window.addEventListener('paymentConfirmed', (event) => {
  console.log('Pagamento confirmado!', event.detail);
  // event.detail = { transactionId, status, value }
  
  // Fazer algo customizado:
  // - Mostrar confete
  // - Tocar som
  // - Enviar analytics
});
```

---

## ✅ Checklist de Deploy

- [ ] Adicionei `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente
- [ ] URL do site está correta (https://marprivacy.site)
- [ ] Testei criação de PIX (QR Code aparece?)
- [ ] Testei pagamento de teste
- [ ] Webhook está recebendo notificações? (ver logs)
- [ ] Telegram está enviando mensagens? (se configurado)
- [ ] Redirecionamento funciona após pagamento?

---

## 🆘 Troubleshooting

### **Webhook não recebe notificações**

1. Verifique se `NEXT_PUBLIC_SITE_URL` está correto
2. Veja logs na Vercel: Functions → `webhook-pushinpay`
3. Teste manualmente com curl (ver acima)

### **Frontend não detecta pagamento**

1. Abra DevTools → Console
2. Veja se há logs de verificação: `📊 Status do pagamento: xxx`
3. Verifique se API `/api/pushinpay` com `check-payment` funciona

### **Telegram não envia mensagens**

1. Verifique `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`
2. Teste envio manual: https://api.telegram.org/bot{TOKEN}/sendMessage

---

## 📚 Referências

- **PushinPay Docs**: https://pushinpay.com.br/docs
- **Webhook Vercel**: https://vercel.com/docs/functions/serverless-functions
- **Telegram Bot API**: https://core.telegram.org/bots/api

---

✅ **Sistema de Webhook implementado e pronto para uso!**

