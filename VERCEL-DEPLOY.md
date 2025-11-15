# 🚀 Deploy no Vercel

Guia completo para fazer deploy do projeto no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório GitHub: https://github.com/idkafael/marmari
3. Variáveis de ambiente configuradas

## 🚀 Deploy via Painel Web (Recomendado)

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório **idkafael/marmari**
5. Clique em **"Import"**

### 2. Configurar Projeto

#### Framework Preset
- **Framework Preset**: Next.js (detectado automaticamente)

#### Build Settings
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

#### Root Directory
- Deixe em branco (padrão)

### 3. Configurar Variáveis de Ambiente

Adicione todas as variáveis de ambiente necessárias:

#### Variáveis Obrigatórias

```
PUSHINPAY_TOKEN=seu_token_pushinpay_aqui
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui
TELEGRAM_BOT_TOKEN=seu_bot_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui
WHATSAPP_NUMBER=5547997118690
NEXT_PUBLIC_BASE_URL=https://seu-dominio.vercel.app
```

#### Variáveis Opcionais

```
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000
```

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (~3-5 minutos)
3. Acesse o link fornecido pelo Vercel

## 🔧 Deploy via CLI

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Fazer Login

```bash
vercel login
```

### 3. Deploy

```bash
cd nextjs-boilerplate-main
vercel
```

### 4. Configurar Variáveis de Ambiente

```bash
vercel env add PUSHINPAY_TOKEN
vercel env add NEXT_PUBLIC_FACEBOOK_PIXEL_ID
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add WHATSAPP_NUMBER
vercel env add NEXT_PUBLIC_BASE_URL
```

### 5. Deploy de Produção

```bash
vercel --prod
```

## 📝 Configurações Importantes

### Região
- **Região**: São Paulo (gru1) - Para melhor performance no Brasil

### Domínio Personalizado
1. Acesse **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

### Variáveis de Ambiente por Ambiente

Você pode configurar variáveis diferentes para:
- **Production**: Produção
- **Preview**: Branches de preview
- **Development**: Desenvolvimento local

## 🔄 Deploy Automático

O Vercel faz deploy automático quando:
- Você faz push para a branch `master` ou `main`
- Você cria um Pull Request
- Você faz merge de um Pull Request

## 📊 Monitoramento

- **Logs**: Acesse **Deployments** → Selecione um deploy → **Logs**
- **Analytics**: Acesse **Analytics** no painel
- **Function Logs**: Acesse **Functions** → Selecione uma função → **Logs**

## 🐛 Troubleshooting

### Erro de Build

1. Verifique os logs do build
2. Certifique-se de que todas as dependências estão no `package.json`
3. Verifique se todas as variáveis de ambiente estão configuradas

### Erro de Runtime

1. Verifique os logs de runtime
2. Certifique-se de que as variáveis de ambiente estão corretas
3. Verifique se as APIs estão acessíveis

### Imagens não carregam

1. Verifique se `i.imgur.com` está configurado no `next.config.js`
2. Verifique se as URLs das imagens estão corretas

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [Repositório GitHub](https://github.com/idkafael/marmari)

## ✅ Checklist de Deploy

- [ ] Repositório conectado ao Vercel
- [ ] Framework detectado (Next.js)
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Site acessível e funcionando
- [ ] Domínio personalizado configurado (opcional)
- [ ] Deploy automático configurado

---

**Desenvolvido com ❤️ para facilitar deploy no Vercel**

