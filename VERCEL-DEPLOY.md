# 🚀 Deploy na Vercel - Passo a Passo

## ✅ Repositório GitHub Preparado

- ✅ Código enviado para https://github.com/idkafael/marmari
- ✅ `.env.local` protegido (não foi enviado)
- ✅ Tokens removidos do código
- ✅ Estrutura Next.js configurada

---

## 📋 Deploy na Vercel

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Faça login (com GitHub se preferir)
3. Clique em **"Add New Project"** ou **"Import Project"**
4. Selecione o repositório **"idkafael/marmari"**
5. Clique em **"Import"**

### 2. Configurar Environment Variables

**⚠️ CRÍTICO:** Configure as variáveis de ambiente antes do deploy!

Vá em **Settings** → **Environment Variables** e adicione:

```
PUSHINPAY_TOKEN=seu_token_pushinpay_real_aqui
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_real_aqui
TELEGRAM_BOT_TOKEN=seu_bot_token_real_aqui
TELEGRAM_CHAT_ID=seu_chat_id_real_aqui
WHATSAPP_NUMBER=5547997118690
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000
NEXT_PUBLIC_BASE_URL=https://marmari.vercel.app
```

### 3. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (vai demorar ~2 minutos na primeira vez)
3. Quando terminar, clique no link do deploy

### 4. Verificar

1. Acesse o site pelo link da Vercel
2. Teste o sistema de pagamento
3. Verifique se tudo funciona

---

## 🔄 Deploys Automáticos

Depois do primeiro deploy:

- ✅ Cada push no GitHub faz deploy automático
- ✅ Deploy de preview em cada Pull Request
- ✅ Ambiente de produção para main branch

---

## 🔐 Importante

- ⚠️ **Configure as Environment Variables ANTES de usar**
- ⚠️ **NÃO commite tokens no código** (já estão removidos)
- ⚠️ **Teste localmente primeiro** antes do deploy

---

## 📝 URLs

- **Repositório**: https://github.com/idkafael/marmari
- **Deploy**: https://marmari.vercel.app (ou URL personalizada)

---

## ✅ Checklist de Deploy

- [ ] Repositório no GitHub ✅
- [ ] Vercel conectado ao repo
- [ ] Environment Variables configuradas
- [ ] Primeiro deploy feito
- [ ] Site funcionando
- [ ] Pagamento testado

---

**Pronto para deploy! 🚀**

