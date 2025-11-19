# 🔒 Privacy - Sistema de Pagamento PIX com Next.js

Sistema completo de pagamento PIX integrado com PushinPay para conteúdo premium, desenvolvido com Next.js para máxima segurança.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com SSR
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Estilização
- **PushinPay API** - Pagamentos PIX
- **Vercel** - Hospedagem

## 📋 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/idkafael/marmari.git
cd marmari
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

📋 **Arquivo de exemplo**: Use o arquivo `env.example` como referência. Copie para `.env.local` e preencha os valores.

**📋 Use o arquivo `env.example` como referência!**

1. **Copie `env.example` para `.env.local`**
2. **Preencha os valores obrigatórios**:
   - `PUSHINPAY_TOKEN` - Token da API PushinPay
   - `PUSHINPAY_API_URL` - URL da API (padrão: `https://api.pushinpay.com.br`)

**Veja o arquivo `env.example` para todas as variáveis disponíveis.**

**⚠️ IMPORTANTE:** Nunca faça commit do arquivo `.env.local`!

### 4. Execute localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy na Vercel

### Deploy Rápido

1. **Conecte ao GitHub:**
   - Vá em [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Selecione o repositório

2. **Configure Environment Variables:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione todas as variáveis do `.env.local`
   - `PUSHINPAY_TOKEN`
   - `PUSHINPAY_API_URL` (opcional)

3. **Deploy:**
   - A Vercel detecta Next.js automaticamente
   - Clique em "Deploy"
   - Aguarde o build (~2-3 minutos)
   - Teste o site funcionando

## 🔐 Segurança

- ✅ Tokens protegidos no servidor via API Routes
- ✅ Nenhum token exposto no cliente (HTML/JS)
- ✅ Variáveis de ambiente para todas as credenciais
- ✅ `.env.local` protegido no `.gitignore`

## 📁 Estrutura do Projeto

```
/
├── .env.local              # Variáveis de ambiente (não vai para git)
├── .gitignore              # Protege arquivos sensíveis
├── next.config.js          # Configuração Next.js
├── package.json            # Dependências
├── pages/
│   ├── _app.js            # Configuração Next.js
│   ├── index.js           # Página principal (React)
│   ├── agradecimento.js   # Pós-pagamento (React)
│   └── api/
│       ├── pushinpay.js   # API protegida PushinPay
│       └── telegram.js    # API protegida Telegram
├── components/
│   ├── MediaGrid.js       # Grid de mídias
│   ├── ModalPagamento.js  # Modal de pagamento PIX
│   └── LateralVideos.js   # Vídeos laterais
├── public/
│   ├── images/            # Imagens e vídeos
│   ├── css/               # Estilos
│   └── js/
│       ├── pushinpay-real.js # JavaScript PushinPay
│       ├── database.js     # Gerenciamento de banco
│       └── lead-tracking.js # Rastreamento de leads
└── README.md              # Este arquivo
```

## 🎨 Funcionalidades

- ✅ Sistema de pagamento PIX completo
- ✅ QR Code gerado automaticamente
- ✅ Verificação de pagamento em tempo real
- ✅ Notificações via Telegram
- ✅ Rastreamento Facebook Pixel
- ✅ Interface responsiva (mobile + desktop)
- ✅ Segurança máxima (tokens no servidor)
- ✅ React components reutilizáveis

## 📝 Licença

Este projeto é privado e proprietário.

---

## 📝 Histórico de Modificações

### Última Atualização: 2025

#### ✅ Migração para PushinPay
- **Gateway de Pagamento**: PushinPay
- **API Route**: `pages/api/pushinpay.js`
- **Frontend**: `public/js/pushinpay-real.js`
- **URL Base da API**: `https://api.pushinpay.com.br`

#### 🔄 Fluxo de Pagamento
1. Lead clica em pagar no `index.js`
2. Modal abre e cria PIX via PushinPay
3. QR Code é gerado e exibido
4. Verificação automática a cada 10 segundos
5. Quando pagamento confirmado, redireciona para `/agradecimento`
6. Página de agradecimento exibe detalhes e acesso ao conteúdo

---

**Desenvolvido com ❤️ para facilitar pagamentos PIX seguros**
