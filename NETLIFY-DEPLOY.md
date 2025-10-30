# 🚀 Deploy na Netlify - Passo a Passo

## ✅ Repositório GitHub Preparado

- ✅ Código enviado para https://github.com/idkafael/marmari
- ✅ `.env.local` protegido (não foi enviado)
- ✅ Tokens removidos do código
- ✅ Estrutura Next.js configurada
- ✅ `netlify.toml` criado

---

## 📋 Deploy na Netlify

### 1. Conectar Repositório

1. Acesse [netlify.com](https://netlify.com)
2. Faça login (com GitHub se preferir)
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Selecione **"Deploy with GitHub"**
5. Autorize acesso aos repositórios
6. Selecione o repositório **"idkafael/marmari"**
7. Clique em **"Connect to Git"**

### 2. Configurar Build Settings

Netlify deve detectar automaticamente as configurações do Next.js:

- **Build command**: `npm run build` (ou deixe vazio)
- **Publish directory**: `.next` (ou deixe vazio)

Se não detectar, configure manualmente:
- Build command: `npm run build`
- Publish directory: `.next`

### 3. Configurar Environment Variables

**⚠️ CRÍTICO:** Configure as variáveis de ambiente ANTES do deploy!

1. Na tela de "Configure build settings"
2. Clique em **"Show advanced"**
3. Clique em **"New variable"**
4. Adicione cada uma:

```
PUSHINPAY_TOKEN=seu_token_pushinpay_real_aqui
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_real_aqui
TELEGRAM_BOT_TOKEN=seu_bot_token_real_aqui
TELEGRAM_CHAT_ID=seu_chat_id_real_aqui
WHATSAPP_NUMBER=5547997118690
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000
NEXT_PUBLIC_BASE_URL=https://marmari.netlify.app
```

### 4. Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build (vai demorar ~3-4 minutos na primeira vez)
3. Quando terminar, clique no link do site

### 5. Verificar

1. Acesse o site pelo link da Netlify
2. Teste o sistema de pagamento
3. Verifique se tudo funciona

---

## 🔄 Deploys Automáticos

Depois do primeiro deploy:

- ✅ Cada push no GitHub faz deploy automático
- ✅ Deploy preview em cada Pull Request
- ✅ Ambiente de produção para main branch

---

## 🔐 Importante

- ⚠️ **Configure as Environment Variables ANTES de usar**
- ⚠️ **NÃO commite tokens no código** (já estão removidos)
- ⚠️ **Teste localmente primeiro** antes do deploy

---

## 📝 URLs

- **Repositório**: https://github.com/idkafael/marmari
- **Deploy**: https://marmari.netlify.app (ou URL personalizada)

---

## 🆚 Diferenças Netlify vs Vercel

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Suporte Next.js | Nativo | Plugin necessário |
| Deploy automático | ✅ | ✅ |
| Preview PRs | ✅ | ✅ |
| Environment Variables | ✅ | ✅ |
| Formulários | ❌ | ✅ |
| Functions | ✅ | ✅ |

---

## ✅ Checklist de Deploy

- [ ] Repositório no GitHub ✅
- [ ] Netlify conectado ao repo
- [ ] Environment Variables configuradas
- [ ] Primeiro deploy feito
- [ ] Site funcionando
- [ ] Pagamento testado

---

## 🐛 Troubleshooting

### Build falha?

```bash
# Verificar logs
- Vá em Deploy logs
- Procure por erros específicos

# Erro comum: Plugin Next.js
- Instale via Netlify UI: "Add plugin" → "Netlify Next.js Plugin"
```

### Variáveis de ambiente não funcionam?

1. Verificar se todas começam com `NEXT_PUBLIC_` para variáveis públicas
2. Fazer rebuild após adicionar variáveis
3. Verificar sintaxe (sem espaços extras)

---

**Pronto para deploy na Netlify! 🚀**

