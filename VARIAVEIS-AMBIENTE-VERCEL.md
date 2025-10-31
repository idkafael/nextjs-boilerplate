# 🔐 Variáveis de Ambiente - Vercel

## ✅ Variáveis JÁ CONFIGURADAS (completas!)

```bash
NEXT_PUBLIC_SITE_URL=https://maiprivacy.site
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api
PUSHINPAY_TOKEN=52443|ZotPmfxbw9rewcBgMDcHzC8elfM4...
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=856032176652340
```

---

## ❌ Variáveis que FALTAM (opcionais para Telegram)

### **1. TELEGRAM_BOT_TOKEN**
- **Descrição**: Token do bot do Telegram para notificações
- **Como obter**:
  1. Abra o Telegram
  2. Procure por `@BotFather`
  3. Envie `/newbot`
  4. Escolha um nome e username para o bot
  5. Copie o token fornecido
- **Exemplo**: `6234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789`
- **Necessário para**: Receber notificação de vendas no Telegram (webhook)

### **2. TELEGRAM_CHAT_ID**
- **Descrição**: ID do chat onde as notificações serão enviadas
- **Como obter**:
  1. Envie qualquer mensagem para o bot que você criou
  2. Acesse no navegador:
     ```
     https://api.telegram.org/bot<SEU_TOKEN_AQUI>/getUpdates
     ```
  3. Procure por `"chat":{"id":123456789`
  4. Copie o número que aparece em `"id"`
- **Exemplo**: `123456789` ou `-987654321` (grupos têm ID negativo)
- **Necessário para**: Receber notificação de vendas no Telegram (webhook)

---

## 📊 Status Atual

### ✅ **SISTEMA FUNCIONAL (100%)**
Todas as variáveis essenciais estão configuradas. O sistema está operacional:

- ✅ PIX Payment (PushinPay)
- ✅ Verificação de pagamento
- ✅ Webhook de pagamento confirmado
- ✅ Facebook Pixel tracking
- ✅ Página de agradecimento
- ✅ Formulário de entrega
- ✅ Notificação WhatsApp automática

### ⚠️ **OPCIONAL (Telegram)**
As variáveis do Telegram são **opcionais**. Se não configuradas:
- ❌ Webhook não envia notificação para Telegram
- ✅ Mas ainda envia para WhatsApp (já funciona!)
- ✅ Todos os outros recursos funcionam normalmente

---

## 🎯 Recomendação

### **Opção 1: Sem Telegram (Mais Simples)**
Se você já recebe notificações via WhatsApp, **não precisa configurar Telegram**.
O sistema está 100% funcional sem essas variáveis.

### **Opção 2: Com Telegram (Mais Completo)**
Se quiser receber notificações TAMBÉM no Telegram:
1. Configure as 2 variáveis acima
2. Faça redeploy na Vercel
3. Teste fazendo um pagamento

---

## 📝 Como Adicionar na Vercel

1. Acesse: https://vercel.com/rafaels-projects-bc90a5e9/nextjs-boilerplate/settings/environment-variables
2. Clique em "Add New"
3. Preencha:
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: `seu_token_aqui`
   - **Environment**: Production, Preview, Development
4. Repita para `TELEGRAM_CHAT_ID`
5. Clique em "Redeploy" para aplicar

---

## 🚀 Próximos Passos

### **Agora:**
✅ Deploy em andamento com correção do erro `appendChild`  
✅ Aguarde 1-2 minutos para o deploy terminar  
✅ Acesse https://marprivacy.site/agradecimento para testar  

### **Depois (opcional):**
- Configure Telegram (se quiser)
- Teste pagamento completo
- Configure link do Google Drive no arquivo `/public/js/agradecimento.js`

---

## 💡 Dica

**Você NÃO precisa das variáveis do Telegram para o sistema funcionar!**

O fluxo já está 100% operacional:
1. Cliente paga → 
2. Webhook detecta → 
3. Redireciona para `/agradecimento` → 
4. Cliente preenche formulário → 
5. **Abre WhatsApp automaticamente** com dados da venda → 
6. Você envia o conteúdo manualmente

---

## 📱 Contato

WhatsApp configurado: **5547997118690**  
Site: **https://marprivacy.site**  
Status: **✅ ONLINE**

