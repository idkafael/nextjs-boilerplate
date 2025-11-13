# 🔧 Guia de Atualização - Variáveis de Ambiente

**Data**: 11/01/2025  
**Status**: Migração para SyncPay com Split de 50% concluída

---

## 📋 O QUE PRECISA ATUALIZAR

Você precisa atualizar as variáveis de ambiente em **2 lugares**:

1. **`.env.local`** (Desenvolvimento Local)
2. **Vercel Environment Variables** (Produção)

---

## 1️⃣ ARQUIVO `.env.local` (Desenvolvimento Local)

### 📍 Onde está?
- Arquivo na raiz do projeto: `nextjs-boilerplate-main/.env.local`
- Se não existir, copie o `env.example` e renomeie para `.env.local`

### ✅ O QUE ATUALIZAR:

#### 🔑 VARIÁVEIS OBRIGATÓRIAS (ATUALIZAR AGORA):

```env
# ============================================
# SYNCPAY - NOVAS CREDENCIAIS PRINCIPAIS
# ============================================

# NOVA CONTA PRINCIPAL (recebe 50% automaticamente)
SYNCPAY_CLIENT_ID=74633f92-ee63-44e4-af4a-63b0cf1d6844
SYNCPAY_CLIENT_SECRET=f97b2c78-a648-4972-b3b6-d7f916aa1ad2
SYNCPAY_API_URL=https://api.syncpayments.com.br

# SPLIT AUTOMÁTICO: 50% para conta antiga
SYNCPAY_SPLIT_RULES=[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]
```

#### 🌐 VARIÁVEIS PÚBLICAS (JÁ CONFIGURADAS - VERIFICAR):

```env
NEXT_PUBLIC_SITE_URL=https://marprivacy.site
NEXT_PUBLIC_BASE_URL=https://marprivacy.site
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=856032176652340
```

#### 📱 VARIÁVEIS OPCIONAIS (MANTER OU ATUALIZAR):

```env
# Email padrão para clientes
SYNCPAY_DEFAULT_EMAIL=cliente@exemplo.com

# Token do webhook (se usar validação)
SYNCPAY_WEBHOOK_TOKEN=seu_token_webhook_aqui

# Telegram (se usar)
TELEGRAM_BOT_TOKEN=seu_bot_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# WhatsApp (se usar)
WHATSAPP_NUMBER=5547997118690
WHATSAPP_WEBHOOK_URL=https://seu-webhook-whatsapp.com

# Valores dos planos (em centavos)
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000
```

---

## 2️⃣ VERCEL ENVIRONMENT VARIABLES (Produção)

### 📍 Como acessar:
1. Acesse: https://vercel.com
2. Entre no seu projeto: `nextjs-boilerplate-main`
3. Vá em: **Settings** → **Environment Variables**

### ✅ O QUE ATUALIZAR/ADICIONAR:

#### 🔑 VARIÁVEIS OBRIGATÓRIAS (ADICIONAR/ATUALIZAR):

| Nome da Variável | Valor | Ambiente |
|-----------------|-------|----------|
| `SYNCPAY_CLIENT_ID` | `74633f92-ee63-44e4-af4a-63b0cf1d6844` | Production, Preview, Development |
| `SYNCPAY_CLIENT_SECRET` | `f97b2c78-a648-4972-b3b6-d7f916aa1ad2` | Production, Preview, Development |
| `SYNCPAY_API_URL` | `https://api.syncpayments.com.br` | Production, Preview, Development |
| `SYNCPAY_SPLIT_RULES` | `[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]` | Production, Preview, Development |

#### 🌐 VARIÁVEIS PÚBLICAS (VERIFICAR/ATUALIZAR):

| Nome da Variável | Valor | Ambiente |
|-----------------|-------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://marprivacy.site` | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | `https://marprivacy.site` | Production, Preview, Development |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | `856032176652340` | Production, Preview, Development |

#### 📱 VARIÁVEIS OPCIONAIS (SE USAR):

| Nome da Variável | Valor | Ambiente |
|-----------------|-------|----------|
| `SYNCPAY_DEFAULT_EMAIL` | `cliente@exemplo.com` | Production, Preview, Development |
| `SYNCPAY_WEBHOOK_TOKEN` | `seu_token_webhook_aqui` | Production, Preview, Development |
| `TELEGRAM_BOT_TOKEN` | `seu_bot_token_aqui` | Production, Preview, Development |
| `TELEGRAM_CHAT_ID` | `seu_chat_id_aqui` | Production, Preview, Development |
| `WHATSAPP_NUMBER` | `5547997118690` | Production, Preview, Development |
| `WHATSAPP_WEBHOOK_URL` | `https://seu-webhook-whatsapp.com` | Production, Preview, Development |
| `PLANO_VITALICIO_19_90` | `1990` | Production, Preview, Development |
| `PLANO_3_MESES` | `5000` | Production, Preview, Development |
| `PLANO_VITALICIO_100_00` | `10000` | Production, Preview, Development |

---

## 📝 PASSO A PASSO - VERCEL

### 1. Acesse o Dashboard da Vercel
- URL: https://vercel.com
- Entre no projeto: `nextjs-boilerplate-main`

### 2. Vá em Settings → Environment Variables

### 3. Para cada variável obrigatória:

**Adicionar/Atualizar `SYNCPAY_CLIENT_ID`:**
- Clique em **"Add New"**
- **Key**: `SYNCPAY_CLIENT_ID`
- **Value**: `74633f92-ee63-44e4-af4a-63b0cf1d6844`
- **Environments**: Marque todas (Production, Preview, Development)
- Clique em **"Save"**

**Adicionar/Atualizar `SYNCPAY_CLIENT_SECRET`:**
- Clique em **"Add New"**
- **Key**: `SYNCPAY_CLIENT_SECRET`
- **Value**: `f97b2c78-a648-4972-b3b6-d7f916aa1ad2`
- **Environments**: Marque todas (Production, Preview, Development)
- Clique em **"Save"**

**Adicionar/Atualizar `SYNCPAY_API_URL`:**
- Clique em **"Add New"**
- **Key**: `SYNCPAY_API_URL`
- **Value**: `https://api.syncpayments.com.br`
- **Environments**: Marque todas (Production, Preview, Development)
- Clique em **"Save"**

**Adicionar/Atualizar `SYNCPAY_SPLIT_RULES`:**
- Clique em **"Add New"**
- **Key**: `SYNCPAY_SPLIT_RULES`
- **Value**: `[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]`
- **Environments**: Marque todas (Production, Preview, Development)
- Clique em **"Save"**

### 4. Verificar variáveis públicas:

**Verificar `NEXT_PUBLIC_SITE_URL`:**
- Se já existe, verifique se está como: `https://marprivacy.site`
- Se não existe, adicione com o valor: `https://marprivacy.site`

**Verificar `NEXT_PUBLIC_BASE_URL`:**
- Se já existe, verifique se está como: `https://marprivacy.site`
- Se não existe, adicione com o valor: `https://marprivacy.site`

### 5. Após adicionar todas as variáveis:

- **IMPORTANTE**: Faça um novo deploy ou aguarde o próximo build automático
- As variáveis só serão aplicadas no próximo deploy

---

## ⚠️ IMPORTANTE

### 🔒 Segurança
- **NUNCA** faça commit do arquivo `.env.local` no Git
- O arquivo `.env.local` já está no `.gitignore`
- As variáveis na Vercel são seguras e não aparecem no código

### 🔄 Após Atualizar
1. **Local**: Reinicie o servidor (`npm run dev`)
2. **Vercel**: Faça um novo deploy ou aguarde build automático

### ✅ Verificação
- **Local**: Teste criando um PIX localmente
- **Vercel**: Teste criando um PIX na produção

---

## 📊 RESUMO DAS MUDANÇAS

### ❌ REMOVIDO (Credenciais Antigas):
- `SYNCPAY_CLIENT_ID=cb8d5abc-f7ca-4305-986c-ca587b12cfa8` (agora é split)
- `SYNCPAY_CLIENT_SECRET=033840a6-db0e-43aa-9ea7-44845ad6eadc` (agora é split)

### ✅ ADICIONADO (Novas Credenciais Principais):
- `SYNCPAY_CLIENT_ID=74633f92-ee63-44e4-af4a-63b0cf1d6844` (nova conta principal)
- `SYNCPAY_CLIENT_SECRET=f97b2c78-a648-4972-b3b6-d7f916aa1ad2` (nova conta principal)

### ✅ ADICIONADO (Split Configurado):
- `SYNCPAY_SPLIT_RULES=[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]`

---

## 🎯 CHECKLIST

### `.env.local` (Local):
- [ ] Atualizado `SYNCPAY_CLIENT_ID` para nova conta principal
- [ ] Atualizado `SYNCPAY_CLIENT_SECRET` para nova conta principal
- [ ] Verificado `SYNCPAY_API_URL` está correto
- [ ] Adicionado `SYNCPAY_SPLIT_RULES` com split de 50%
- [ ] Verificado `NEXT_PUBLIC_SITE_URL` está correto
- [ ] Reiniciado servidor (`npm run dev`)

### Vercel (Produção):
- [ ] Atualizado `SYNCPAY_CLIENT_ID` na Vercel
- [ ] Atualizado `SYNCPAY_CLIENT_SECRET` na Vercel
- [ ] Verificado `SYNCPAY_API_URL` na Vercel
- [ ] Adicionado `SYNCPAY_SPLIT_RULES` na Vercel
- [ ] Verificado `NEXT_PUBLIC_SITE_URL` na Vercel
- [ ] Feito novo deploy ou aguardado build automático

---

**✅ Após completar o checklist, o sistema estará funcionando com split de 50%!**

