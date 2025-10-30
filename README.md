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
git clone https://github.com/seu-usuario/privacy-nextjs.git
cd privacy-nextjs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# PushinPay Configuration
PUSHINPAY_TOKEN=seu_token_pushinpay_aqui

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui

# Telegram Bot
TELEGRAM_BOT_TOKEN=seu_bot_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# WhatsApp
WHATSAPP_NUMBER=5547997118690

# Valores dos Planos (em centavos)
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Nunca faça commit do arquivo `.env.local`!

### 4. Execute localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy

### Deploy na Vercel (Recomendado)

1. **Conecte ao GitHub:**
   - Faça push deste repositório para o GitHub
   - Vá em [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

2. **Configure Environment Variables:**
   - Vá em Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`
   - Values devem ser os tokens reais (não os placeholders)

3. **Deploy Automático:**
   - A cada push no GitHub, a Vercel faz deploy automaticamente

### Deploy Manual

```bash
# Build do projeto
npm run build

# Executar produção localmente
npm start

# Ou fazer deploy na Vercel via CLI
npx vercel
```

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
│   ├── index.js           # Página principal
│   ├── agradecimento.js   # Pós-pagamento
│   └── api/
│       ├── pushinpay.js   # API protegida PushinPay
│       └── telegram.js    # API protegida Telegram
├── public/
│   ├── images/            # Imagens e vídeos
│   ├── css/               # Estilos
│   └── js/                # JavaScript cliente
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

## 📝 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ para facilitar pagamentos PIX seguros**
