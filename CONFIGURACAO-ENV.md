# 🔐 Configuração de Variáveis de Ambiente

## ⚠️ IMPORTANTE

**O arquivo `.env.local` não existe ainda - você precisa criá-lo manualmente!**

Copie o template abaixo e crie um arquivo chamado `.env.local` na raiz do projeto com suas informações reais.

---

## 📋 Template do .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# ⚠️ NUNCA FAÇA COMMIT DESTE ARQUIVO!
# Este arquivo contém informações sensíveis

# PushinPay Configuration
PUSHINPAY_TOKEN=SEU_TOKEN_PUSHINPAY_AQUI

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=SEU_PIXEL_ID_AQUI

# Telegram Bot
TELEGRAM_BOT_TOKEN=SEU_BOT_TOKEN_AQUI
TELEGRAM_CHAT_ID=SEU_CHAT_ID_AQUI

# WhatsApp (para notificações)
WHATSAPP_NUMBER=5547997118690

# Valores dos Planos (em centavos)
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🔧 Como Configurar

### 1. Criar o arquivo `.env.local`

```bash
# No terminal, na raiz do projeto:
touch .env.local  # Linux/Mac
# ou crie manualmente no editor
```

### 2. Preencher com seus dados reais

Substitua os valores `SEU_TOKEN_PUSHINPAY_AQUI`, etc. pelos seus valores reais.

### 3. Configurar na Vercel

Quando fizer deploy na Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável:
   - `PUSHINPAY_TOKEN` = seu token PushinPay
   - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` = seu Pixel ID
   - `TELEGRAM_BOT_TOKEN` = seu Bot Token
   - `TELEGRAM_CHAT_ID` = seu Chat ID
   - etc.

---

## ✅ Variáveis Configuradas

- ✅ `.env.local` criado (você precisa fazer)
- ✅ `.gitignore` configurado (`.env.local` não vai para o git)
- ✅ API Routes protegidas (tokens no servidor)

---

## 🚀 Próximos Passos

1. Criar `.env.local` com seus dados
2. Instalar dependências: `npm install`
3. Rodar localmente: `npm run dev`
4. Testar tudo funcionando
5. Fazer deploy na Vercel
6. Configurar Environment Variables na Vercel

