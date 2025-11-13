# 🔒 Privacy - Sistema de Pagamento PIX com Next.js

Sistema completo de pagamento PIX integrado com SyncPay para conteúdo premium, desenvolvido com Next.js para máxima segurança.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com SSR
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Estilização
- **SyncPay API** - Pagamentos PIX com Split Automático
- **Netlify** - Hospedagem

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

📘 **GUIA COMPLETO**: Veja [GUIA-COMPLETO-SYNCPAY.md](GUIA-COMPLETO-SYNCPAY.md) - **TUDO em um só lugar!**

📋 **Arquivo de exemplo**: Use o arquivo `env.example` como referência. Copie para `.env.local` e preencha os valores.

Este guia inclui:
- ✅ Configuração básica passo a passo
- ✅ Guia completo sobre Split Automático
- ✅ O que descobrimos na documentação oficial
- ✅ Geração de QR Code
- ✅ Webhooks
- ✅ Exemplos práticos
- ✅ Solução de problemas

**📋 Use o arquivo `env.example` como referência!**

1. **Copie `env.example` para `.env.local`**
2. **Preencha os valores obrigatórios** (já estão configurados)
3. **URL base da API**: `https://api.syncpayments.com.br` (já configurada)

**Valores já configurados no `env.example`**:
- `SYNCPAY_CLIENT_ID=cb8d5abc-f7ca-4305-986c-ca587b12cfa8`
- `SYNCPAY_CLIENT_SECRET=033840a6-db0e-43aa-9ea7-44845ad6eadc`
- `SYNCPAY_API_URL=https://api.syncpayments.com.br`

**Veja o arquivo `env.example` para todas as variáveis disponíveis.**

**⚠️ IMPORTANTE:** Nunca faça commit do arquivo `.env.local`!

**📚 Precisa de ajuda?** Consulte o [Guia Completo SyncPay](GUIA-COMPLETO-SYNCPAY.md) para saber onde conseguir todas as informações necessárias (client_id, client_secret, api_url, user_ids para split, etc.).

### 4. Execute localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy na Netlify

**📖 Siga o guia completo:** [NETLIFY-DEPLOY.md](NETLIFY-DEPLOY.md)

### Deploy Rápido

1. **Conecte ao GitHub:**
   - Vá em [netlify.com](https://netlify.com)
   - Clique em "Add new site" → "Import an existing project"
   - Selecione o repositório **idkafael/marmari**

2. **Configure Environment Variables:**
   - Vá em "Show advanced" → "Add environment variables"
   - Adicione todas as variáveis do `.env.local`

3. **Deploy:**
   - Clique em "Deploy site"
   - Aguarde o build (~3-4 minutos)
   - Teste o site funcionando

### URLs
- **Repositório**: https://github.com/idkafael/marmari
- **Site**: https://marprivacy.site

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
│       ├── syncpay.js     # API protegida SyncPay
│       ├── webhook-syncpay.js # Webhook SyncPay
│       └── telegram.js    # API protegida Telegram
├── components/
│   ├── MediaGrid.js       # Grid de mídias
│   ├── ModalPagamento.js  # Modal de pagamento PIX
│   └── LateralVideos.js   # Vídeos laterais
├── public/
│   ├── images/            # Imagens e vídeos
│   ├── css/               # Estilos
│   └── js/
│       ├── syncpay-real.js # JavaScript SyncPay
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
- ✅ Código HTML migrado para Next.js
- ✅ Arquivos HTML originais protegidos no GitHub

## 📝 Licença

Este projeto é privado e proprietário.

---

## 📝 Histórico de Modificações

### Última Atualização: 11/01/2025

#### ✅ Migração Completa para SyncPay
- **Removidos**: Todos os arquivos do PushinPay e IronPay
- **Adicionados**: Integração completa com SyncPay API
- **URL Base da API**: `https://api.syncpayments.com.br` (confirmada e testada)

#### 🗑️ Arquivos Removidos
- `pages/api/pushinpay.js`
- `pages/api/ironpay.js`
- `pages/api/webhook-pushinpay.js`
- `pages/api/webhook-ironpay.js`
- `public/js/pushinpay-real.js`
- `public/js/pushinpay-secure.js`
- `public/js/ironpay-real.js`

#### ✨ Arquivos Criados/Atualizados
- `pages/api/syncpay.js` - API Route para SyncPay (Bearer Token, PIX, Split)
- `pages/api/webhook-syncpay.js` - Webhook handler para SyncPay
- `public/js/syncpay-real.js` - JavaScript cliente para SyncPay
- `GUIA-COMPLETO-SYNCPAY.md` - Guia completo de configuração
- `env.example` - Arquivo de exemplo atualizado

#### 🔧 Melhorias Implementadas
1. **Autenticação Bearer Token**
   - Cache automático (válido por 1 hora)
   - Renovação automática quando expira
   - Tratamento de erros melhorado

2. **Detecção de Erros**
   - Detecta quando resposta é HTML (URL incorreta)
   - Mensagens de erro mais claras e detalhadas
   - Logs de diagnóstico melhorados

3. **Tratamento de URL**
   - Remove barra final automaticamente
   - Validação de URL base
   - Tratamento consistente em todas as funções

4. **Fluxo de Pagamento**
   - Verificação automática a cada 10 segundos
   - Redirecionamento automático para `/agradecimento`
   - Suporte a split automático (até 3 recebedores)
   - Geração de QR Code no frontend

5. **Status de Pagamento**
   - Suporta todos os status: `pending`, `completed`, `failed`, `refunded`, `med`
   - Tratamento correto do formato de resposta: `{ data: { status, ... } }`
   - Redirecionamento automático quando `status === 'completed'`

#### 📋 Configurações Atualizadas
- **URL Base da API**: `https://api.syncpayments.com.br`
- **Client ID Principal**: `74633f92-ee63-44e4-af4a-63b0cf1d6844` (nova conta principal)
- **Client Secret Principal**: `f97b2c78-a648-4972-b3b6-d7f916aa1ad2` (nova conta principal)
- **Split Configurado**: 50% para conta antiga (`cb8d5abc-f7ca-4305-986c-ca587b12cfa8`)
- **Documentação**: https://syncpay.apidog.io
- **Site Produção**: https://marprivacy.site

#### 🔄 Fluxo de Pagamento Implementado
1. Lead clica em pagar no `index.js`
2. Modal abre e cria PIX via SyncPay
3. QR Code é gerado e exibido
4. Verificação automática a cada 10 segundos
5. Quando `status === 'completed'`, redireciona para `/agradecimento`
6. Página de agradecimento exibe detalhes e acesso ao conteúdo

#### ⚠️ Notas Importantes
- **URL Base da API**: Confirmada como `https://api.syncpayments.com.br`
- **Documentação**: `syncpay.apidog.io` é apenas a documentação, não a API
- **Split Automático**: Suportado nativamente pela SyncPay (máximo 3 recebedores)
- **Migração Futura**: Credenciais atuais vão virar split, nova conta será main

#### 📚 Documentação
- **Guia Completo**: `GUIA-COMPLETO-SYNCPAY.md`
- **Arquivo de Exemplo**: `env.example`
- **Documentação Oficial**: https://syncpay.apidog.io

---

**Desenvolvido com ❤️ para facilitar pagamentos PIX seguros**

## 🔄 Sistema de Pagamento

Este projeto usa **SyncPay** como gateway de pagamento PIX.

### Configuração da API SyncPay

✅ **SyncPay tem Split Automático Nativo!**

A SyncPay suporta **split automático nativo** para dividir pagamentos entre múltiplos recebedores (afiliados, coprodutores, etc.). O split pode ser configurado de duas formas:

#### Opção 1: Via Variável de Ambiente (Recomendado)

Configure no `.env.local`:

```env
# Split com porcentagens (máximo 3 recebedores)
SYNCPAY_SPLIT_RULES=[{"percentage":10,"user_id":"uuid-afiliado-1"},{"percentage":5,"user_id":"uuid-afiliado-2"}]
```

#### Opção 2: Via Request (Dinâmico)

Envie `split_rules` no body da requisição ao criar o PIX:

```javascript
// Exemplo de uso no frontend
const response = await fetch('/api/syncpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create-pix',
    valor: 1990, // R$ 19,90 em centavos
    plano: '1 Mês',
    split_rules: [
      { percentage: 10, user_id: 'uuid-afiliado-1' },  // 10%
      { percentage: 5, user_id: 'uuid-afiliado-2' }    // 5%
    ]
  })
});
```

#### Formato das Regras de Split

- `percentage` (obrigatório): Porcentagem do valor (1-100, inteiro)
- `user_id` (obrigatório): UUID do recebedor (Client ID público das chaves em API Keys)

**Características**:
- Máximo: 3 recebedores por transação
- Porcentagem: 1-100% (inteiro)
- User ID: UUID (Client ID público)

#### Exemplo Prático

Para um pagamento de R$ 19,90 com split:
- 85% para você (R$ 16,92)
- 10% para afiliado 1 (R$ 1,99)
- 5% para afiliado 2 (R$ 1,00)

```json
[
  {"percentage": 85, "user_id": "seu-user-id-uuid"},
  {"percentage": 10, "user_id": "uuid-afiliado-1"},
  {"percentage": 5, "user_id": "uuid-afiliado-2"}
]
```

### Diferenças Importantes

- ✅ **Split nativo** - Suportado pela API SyncPay
- ✅ **Bearer Token** - Renovado automaticamente (válido 1 hora)
- ✅ **Valor em reais** - Converter de centavos para reais na API
- ✅ **QR Code gerado no frontend** - A partir do `pix_code` (string)
- ✅ **Identifier** - UUID para consultar transações

📖 **Consulte o [Guia Completo SyncPay](GUIA-COMPLETO-SYNCPAY.md) para mais detalhes.**

### ✅ Migração Concluída: Main → Split

**Situação Atual**:
- **Conta Principal**: `74633f92-ee63-44e4-af4a-63b0cf1d6844` (nova)
- **Split Configurado**: 50% para conta antiga
- **Conta Antiga (Split)**: `cb8d5abc-f7ca-4305-986c-ca587b12cfa8` (recebe 50%)

**Configuração Atual no `.env.local`**:
```env
# Nova conta principal (recebe 50% + split de 50%)
SYNCPAY_CLIENT_ID=74633f92-ee63-44e4-af4a-63b0cf1d6844
SYNCPAY_CLIENT_SECRET=f97b2c78-a648-4972-b3b6-d7f916aa1ad2

# Split: 50% para conta antiga
SYNCPAY_SPLIT_RULES=[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]
```

**Como Funciona**:
- Conta principal recebe 50% automaticamente (o restante após o split)
- Conta antiga recebe 50% via split
- Total: 100% dividido igualmente entre as duas contas

📖 **Veja seção "Migração Futura" no [Guia Completo SyncPay](GUIA-COMPLETO-SYNCPAY.md) para passo a passo detalhado.**
