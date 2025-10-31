# 🚀 Guia Completo de Deploy na Vercel

Este guia mostra como fazer o deploy do projeto na Vercel passo a passo.

---

## 📋 Pré-requisitos

- ✅ Código já enviado para `https://github.com/idkafael/nextjs-boilerplate`
- ✅ Conta no GitHub
- ✅ Tokens da PushinPay em mãos

---

## 🔥 Passo a Passo

### 1. Acessar a Vercel

1. Acesse: [https://vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

---

### 2. Criar Novo Projeto

1. No dashboard da Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Você verá uma lista dos seus repositórios do GitHub

---

### 3. Importar o Repositório

1. Procure por **"nextjs-boilerplate"** na lista
2. Clique em **"Import"** ao lado do repositório
3. A Vercel irá detectar automaticamente que é um projeto Next.js

---

### 4. Configurar o Projeto

#### Nome do Projeto (opcional)
- Você pode alterar o nome do projeto
- Por padrão será: `nextjs-boilerplate`
- O domínio será: `nextjs-boilerplate.vercel.app`

#### Framework Preset
- A Vercel detecta automaticamente: **Next.js**
- Não precisa alterar nada

#### Build Settings
- **Build Command**: `npm run build` (já detectado)
- **Output Directory**: `.next` (já detectado)
- **Install Command**: `npm install` (já detectado)

**✅ Não altere essas configurações, deixe como detectado!**

---

### 5. Adicionar Variáveis de Ambiente

**IMPORTANTE**: Antes de clicar em "Deploy", você precisa adicionar as variáveis de ambiente.

1. Clique em **"Environment Variables"** (expanda se necessário)
2. Adicione cada variável abaixo:

#### Variável 1: PUSHINPAY_TOKEN
- **Key**: `PUSHINPAY_TOKEN`
- **Value**: `seu_token_pushinpay_aqui` (cole seu token)
- **Environments**: Marque todas (Production, Preview, Development)
- Clique em **"Add"**

#### Variável 2: PUSHINPAY_API_URL
- **Key**: `PUSHINPAY_API_URL`
- **Value**: `https://api.pushinpay.com.br/api`
- **Environments**: Marque todas
- Clique em **"Add"**

#### Variável 3: PLANO_VITALICIO_19_90
- **Key**: `PLANO_VITALICIO_19_90`
- **Value**: `1990`
- **Environments**: Marque todas
- Clique em **"Add"**

#### Variável 4: NEXT_PUBLIC_FACEBOOK_PIXEL_ID (Opcional)
- **Key**: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
- **Value**: `seu_pixel_id_aqui` (ou deixe em branco)
- **Environments**: Marque todas
- Clique em **"Add"**

#### Variável 5: TELEGRAM_BOT_TOKEN (Opcional)
- **Key**: `TELEGRAM_BOT_TOKEN`
- **Value**: `seu_token_telegram` (ou deixe em branco)
- **Environments**: Marque todas
- Clique em **"Add"**

#### Variável 6: TELEGRAM_CHAT_ID (Opcional)
- **Key**: `TELEGRAM_CHAT_ID`
- **Value**: `seu_chat_id` (ou deixe em branco)
- **Environments**: Marque todas
- Clique em **"Add"**

---

### 6. Deploy!

1. Após adicionar todas as variáveis, clique em **"Deploy"**
2. A Vercel irá:
   - Clonar o repositório
   - Instalar dependências
   - Fazer build do projeto
   - Publicar online

**⏱️ Tempo estimado**: 2-3 minutos

---

### 7. Deploy Concluído

Quando aparecer **"Congratulations!"** ou confetes 🎉:

1. Clique em **"Visit"** para abrir seu site
2. Ou copie a URL: `https://seu-projeto.vercel.app`

---

## 🧪 Testar o Site

### Teste 1: Página Principal
- ✅ A página deve carregar normalmente
- ✅ Banner, perfil e mídia devem aparecer

### Teste 2: Galeria de Mídia
- ✅ Clicar em "159 Mídias"
- ✅ Passar o mouse sobre os vídeos (deve reproduzir automaticamente)
- ✅ Imagens devem ter blur inicial

### Teste 3: Pagamento PIX
1. ✅ Clicar no botão **"1 Mês - R$ 19,90"**
2. ✅ Modal deve abrir
3. ✅ QR Code PIX deve ser gerado
4. ✅ Código PIX para copiar deve aparecer

**Se houver erro no PIX**:
- Verifique se o token da PushinPay está correto
- Verifique os logs na Vercel (próximo passo)

---

## 📊 Verificar Logs (se houver erro)

1. No dashboard da Vercel, clique no seu projeto
2. Vá em **"Deployments"**
3. Clique no deployment mais recente
4. Clique em **"Functions"**
5. Veja os logs de execução das APIs

---

## ⚙️ Configurações Adicionais

### Domínio Customizado (Opcional)

Se você tem um domínio próprio:

1. No projeto, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `privacy.com.br`)
4. Siga as instruções para configurar DNS

### Deploy Automático

- ✅ **Já está ativo por padrão!**
- Cada push no GitHub faz deploy automático
- Branch `main` → Deploy de produção
- Outras branches → Deploy de preview

---

## 🔄 Redeploy (se necessário)

Se você precisar fazer redeploy (após alterar variáveis de ambiente):

1. No projeto, clique nos **"..."** (três pontos)
2. Selecione **"Redeploy"**
3. Confirme

---

## 🐛 Solução de Problemas

### Erro: "PUSHINPAY_TOKEN não configurado"
- **Solução**: Adicione a variável de ambiente e faça redeploy

### Erro: "404: The route pix/cashIn could not be found"
- **Solução**: Verifique se `PUSHINPAY_API_URL` está correto:
  - `https://api.pushinpay.com.br/api`

### Erro: "Build failed"
- **Solução**: Verifique os logs de build
- Pode ser erro de sintaxe no código

### Imagens não carregam
- **Solução**: Verifique se a pasta `/public/images/` foi enviada ao GitHub

---

## 📈 Monitoramento

### Analytics (Built-in)
- A Vercel já fornece analytics básico gratuitamente
- Veja: **"Analytics"** no menu do projeto

### Facebook Pixel
- Se configurou o Pixel ID, ele já está rastreando
- Verifique no Facebook Business Manager

---

## 💰 Limites do Plano Gratuito

- ✅ **Banda**: 100GB/mês
- ✅ **Builds**: Ilimitados
- ✅ **Funções Serverless**: 100GB-horas/mês
- ✅ **Domínios**: Ilimitados

**Se ultrapassar os limites**, a Vercel enviará um email. Você pode:
- Fazer upgrade para plano pago (~$20/mês)
- Otimizar o site para reduzir banda

---

## 🎉 Sucesso!

Seu site agora está online na Vercel:
- 🌐 **URL**: `https://nextjs-boilerplate.vercel.app`
- 🔄 **Deploy automático**: A cada push no GitHub
- 📊 **Monitoramento**: Via dashboard da Vercel
- 🚀 **Performance**: Otimizada automaticamente

---

## 📚 Links Úteis

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Suporte Vercel**: https://vercel.com/support
- **PushinPay Docs**: https://pushinpay.com.br/docs
- **Seu Repositório**: https://github.com/idkafael/nextjs-boilerplate

---

## 🗑️ Desativar Netlify (Opcional)

Agora que você migrou para a Vercel:

1. Acesse: https://app.netlify.com
2. Vá no seu projeto antigo
3. **Settings** → **General** → **Danger Zone**
4. Clique em **"Delete site"** ou **"Pause site"**

Isso evita cobranças caso você ultrapasse limites.

---

**✅ Migração completa! Seu projeto está rodando na Vercel.**

