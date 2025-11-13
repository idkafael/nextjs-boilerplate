# 📘 Guia Completo - Integração SyncPay com Split Automático

**Última atualização**: 11/01/2025  
**Documentação oficial**: https://syncpay.apidog.io

---

## 📋 Índice

1. [Configuração Básica](#configuração-básica)
2. [Split Automático - Guia Completo](#split-automático---guia-completo)
3. [O Que Descobrimos na Documentação](#o-que-descobrimos-na-documentação)
4. [Geração de QR Code](#geração-de-qr-code)
5. [Webhooks](#webhooks)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Solução de Problemas](#solução-de-problemas)

---

## 🔧 Configuração Básica

### 1. Credenciais da API

Você precisa de:
- **Client ID** (UUID)
- **Client Secret** (UUID)
- **URL Base da API** (confirmar com suporte SyncPay)

### 2. Criar Arquivo `.env.local`

Crie um arquivo chamado `.env.local` na raiz do projeto:

```env
# ============================================
# SYNCPAY - Configuração Principal
# ============================================

# Client ID (UUID) - Obrigatório - CONTA PRINCIPAL (MAIN)
# Onde encontrar: Dashboard SyncPay > API Keys
# NOVA CONTA PRINCIPAL: 74633f92-ee63-44e4-af4a-63b0cf1d6844
SYNCPAY_CLIENT_ID=74633f92-ee63-44e4-af4a-63b0cf1d6844

# Client Secret (UUID) - Obrigatório - CONTA PRINCIPAL (MAIN)
# Onde encontrar: Dashboard SyncPay > API Keys
# NOVA CONTA PRINCIPAL: f97b2c78-a648-4972-b3b6-d7f916aa1ad2
SYNCPAY_CLIENT_SECRET=f97b2c78-a648-4972-b3b6-d7f916aa1ad2

# URL Base da API
# Endpoints são: /api/partner/v1/*
SYNCPAY_API_URL=https://api.syncpayments.com.br

# Email padrão do cliente (opcional)
SYNCPAY_DEFAULT_EMAIL=cliente@exemplo.com

# Token do Webhook (opcional, para validação de segurança)
SYNCPAY_WEBHOOK_TOKEN=seu_token_webhook_aqui

# Split Automático (opcional)
# Formato JSON: array de objetos com {percentage, user_id}
# Máximo: 3 recebedores
# percentage: 1-100 (inteiro)
# user_id: UUID (Client ID público das chaves em API Keys)
# 
# ✅ CONFIGURADO: 50% para conta antiga (que virou split)
# Conta antiga (split): cb8d5abc-f7ca-4305-986c-ca587b12cfa8
SYNCPAY_SPLIT_RULES=[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]
# 
# Como funciona:
# - Conta principal (74633f92-ee63-44e4-af4a-63b0cf1d6844) recebe 50% automaticamente
# - Conta antiga (cb8d5abc-f7ca-4305-986c-ca587b12cfa8) recebe 50% via split
# - Total: 100% dividido igualmente entre as duas contas

# ============================================
# Outras Configurações
# ============================================

# URL do site (para webhooks)
# Produção: https://marprivacy.site
# Desenvolvimento: http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://marprivacy.site

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=856032176652340

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=seu_bot_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# WhatsApp (opcional)
WHATSAPP_NUMBER=5547997118690
WHATSAPP_WEBHOOK_URL=https://seu-webhook-whatsapp.com

# Valores dos Planos (em centavos)
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000

# URLs
NEXT_PUBLIC_BASE_URL=https://marprivacy.site
```

**⚠️ IMPORTANTE**: Nunca faça commit do arquivo `.env.local`!

### 3. Onde Encontrar as Credenciais

1. **Acesse o Dashboard SyncPay** (confirmar URL com suporte)
2. **Vá em "API Keys"** ou "Chaves de API"
3. **Copie o Client ID** (UUID público)
4. **Copie o Client Secret** (UUID privado)
5. **Confirme a URL Base da API** com o suporte SyncPay

---

## 💰 Split Automático - Guia Completo

### ✅ SyncPay TEM Split Nativo!

A SyncPay suporta **split automático nativo** na criação de pagamentos.

### Características do Split

- **Máximo**: 3 recebedores por transação
- **Formato**: Porcentagem (1-100% inteiro)
- **Campo**: `user_id` (UUID - Client ID público das chaves em API Keys)
- **Campo**: `percentage` (inteiro de 1 a 100)

### Como Funciona

O split divide o valor do pagamento entre múltiplos recebedores automaticamente. Cada recebedor recebe uma porcentagem do valor total.

### Configuração do Split

#### Opção 1: Via Variável de Ambiente (Recomendado)

Configure no `.env.local`:

```env
# Split com porcentagens
# Exemplo genérico:
# SYNCPAY_SPLIT_RULES=[{"percentage":10,"user_id":"9f3c5b3a-41bc-4322-90e6-a87a98eefeca"},{"percentage":5,"user_id":"outro-uuid-aqui"}]

# Exemplo futuro (quando migrar, use o Client ID atual como split):
# SYNCPAY_SPLIT_RULES=[{"percentage":30,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]
```

#### Opção 2: Via Request (Dinâmico)

Envie `split_rules` no body da requisição:

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
      { percentage: 10, user_id: '9f3c5b3a-41bc-4322-90e6-a87a98eefeca' },  // 10%
      { percentage: 5, user_id: 'outro-uuid-aqui' }                          // 5%
    ]
  })
});
```

### Formato das Regras de Split

```json
{
  "percentage": 10,  // Porcentagem (1-100, inteiro)
  "user_id": "9f3c5b3a-41bc-4322-90e6-a87a98eefeca"  // UUID (Client ID público)
}
```

**Campos**:
- `percentage` (obrigatório): Porcentagem do valor (1-100, inteiro)
- `user_id` (obrigatório): UUID do recebedor (Client ID público das chaves em API Keys)

### Exemplo Prático

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

### Onde Obter User IDs

1. **Acesse o Dashboard SyncPay**
2. **Vá em "API Keys"** ou "Chaves de API"
3. **Copie o Client ID** (UUID público) de cada recebedor
4. **Use o Client ID como `user_id`** no split

**⚠️ IMPORTANTE**: O `user_id` deve ser o **Client ID público** (não o secret) das chaves em API Keys.

---

## 📚 O Que Descobrimos na Documentação

### Endpoints Principais

#### 1. Autenticação - Gerar Bearer Token
- **Endpoint**: `POST /api/partner/v1/auth-token`
- **Body**: `{ client_id, client_secret }`
- **Resposta**: `{ access_token, token_type, expires_in, expires_at }`
- **Validade**: 1 hora

#### 2. Criar PIX (CashIn)
- **Endpoint**: `POST /api/partner/v1/cash-in`
- **Autenticação**: Bearer Token
- **Body**: `{ amount, description, webhook_url, client, split }`
- **Resposta**: `{ message, pix_code, identifier }`
- **Valor**: Em reais (double), não centavos

#### 3. Consultar Transação
- **Endpoint**: `GET /api/partner/v1/transaction/{identifier}`
- **Autenticação**: Bearer Token
- **Resposta**: `{ data: { reference_id, status, amount, currency, transaction_date, description, pix_code } }`

#### 4. Status da Transação
- **pending**: Pagamento pendente
- **completed**: Pagamento confirmado
- **failed**: Pagamento falhou
- **refunded**: Pagamento reembolsado
- **med**: Pagamento em análise (Manual Evaluation Data)

### Estrutura de Dados

#### Criar PIX - Request
```json
{
  "amount": 19.90,  // Valor em reais (double)
  "description": "Pagamento",
  "webhook_url": "https://seu-site.com/api/webhook-syncpay",
  "client": {
    "name": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "split": [
    {
      "percentage": 10,
      "user_id": "9f3c5b3a-41bc-4322-90e6-a87a98eefeca"
    }
  ]
}
```

#### Criar PIX - Response
```json
{
  "message": "Cashin request successfully submitted",
  "pix_code": "00020126820014br.gov.bcb.pix...",
  "identifier": "3df0319d-ecf7-455a-84c4-070aee2779c1"
}
```

#### Consultar Transação - Response
```json
{
  "data": {
    "reference_id": "d22413c2-c768-4066-af70-c3b4e0f418ac",
    "currency": "BRL",
    "amount": 19.90,
    "transaction_date": "2025-06-16T17:32:44.000000Z",
    "status": "completed",
    "description": "Pagamento",
    "pix_code": "00020126820014br.gov.bcb.pix..."
  }
}
```

### Diferenças Importantes

1. **Valor**: SyncPay usa reais (double), não centavos
2. **QR Code**: SyncPay retorna apenas `pix_code` (string), não imagem base64
3. **Autenticação**: Bearer Token (válido 1 hora) ao invés de token permanente
4. **Identifier**: SyncPay usa `identifier` (UUID) para consultar transações
5. **Split**: Suporte nativo com porcentagem e user_id (UUID)

---

## 🎨 Geração de QR Code

### Problema

A SyncPay retorna apenas o `pix_code` (string), não uma imagem de QR Code.

### Solução

Gerar QR Code no frontend usando API online ou biblioteca JavaScript.

### Implementação Atual

O código usa **API online gratuita** para gerar QR Code:

```javascript
// Gerar QR Code usando QR Server API
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
```

### Fallback

Se a API online falhar, o código tenta carregar biblioteca QR Code via CDN:

```javascript
// Carregar biblioteca QRCode via CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
```

### Alternativas

1. **API Online** (atual): `https://api.qrserver.com/v1/create-qr-code/`
2. **Biblioteca CDN**: `https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js`
3. **Outra API**: Qualquer serviço que gere QR Code a partir de string

---

## 🔔 Webhooks

### Configuração

Os webhooks podem ser configurados de duas formas:

#### Opção 1: Via API (Recomendado)

Criar webhook via endpoint:

```
POST /api/partner/v1/webhooks
```

**Body**:
```json
{
  "title": "Webhook de Transações",
  "url": "https://seu-site.com/api/webhook-syncpay",
  "event": "cashin",
  "trigger_all_products": true
}
```

#### Opção 2: Via Payload (Dinâmico)

Passar `webhook_url` no payload ao criar PIX:

```json
{
  "amount": 19.90,
  "webhook_url": "https://seu-site.com/api/webhook-syncpay",
  ...
}
```

### Eventos Suportados

- `cashin`: Pagamento recebido (PIX)
- `cashout`: Saque realizado
- `infraction`: Infração detectada

### Estrutura do Webhook

```json
{
  "identifier": "3df0319d-ecf7-455a-84c4-070aee2779c1",
  "reference_id": "d22413c2-c768-4066-af70-c3b4e0f418ac",
  "status": "completed",
  "amount": 19.90,
  "currency": "BRL",
  "transaction_date": "2025-06-16T17:32:44.000000Z",
  "description": "Pagamento",
  "event": "cashin",
  "data": {
    ...
  }
}
```

### Validação de Segurança

O webhook pode incluir um token para validação:

```env
SYNCPAY_WEBHOOK_TOKEN=seu_token_aqui
```

O token pode vir no header ou no payload:
- Header: `x-webhook-token` ou `x-syncpay-signature`
- Payload: `token`

---

## 📝 Exemplos Práticos

### Exemplo 1: Criar PIX Sem Split

```javascript
// Frontend
const response = await fetch('/api/syncpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create-pix',
    valor: 1990, // R$ 19,90 em centavos
    plano: '1 Mês'
  })
});

const data = await response.json();
// data.pix_code - Código PIX para gerar QR Code
// data.identifier - UUID para consultar status
```

### Exemplo 2: Criar PIX Com Split

```javascript
// Frontend
const response = await fetch('/api/syncpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create-pix',
    valor: 1990, // R$ 19,90 em centavos
    plano: '1 Mês',
    split_rules: [
      { percentage: 10, user_id: '9f3c5b3a-41bc-4322-90e6-a87a98eefeca' },
      { percentage: 5, user_id: 'outro-uuid-aqui' }
    ]
  })
});
```

### Exemplo 3: Consultar Status

```javascript
// Frontend
const response = await fetch('/api/syncpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'check-payment',
    transactionId: '3df0319d-ecf7-455a-84c4-070aee2779c1'
  })
});

const data = await response.json();
// data.data.status - Status da transação
// data.data.amount - Valor da transação
```

### Exemplo 4: Gerar QR Code no Frontend

```javascript
// Usando API online
const pixCode = '00020126820014br.gov.bcb.pix...';
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;

// Exibir QR Code
const img = document.createElement('img');
img.src = qrCodeUrl;
img.alt = 'QR Code PIX';
document.getElementById('qrCode').appendChild(img);
```

---

## 🆘 Solução de Problemas

### Problema: "Client ID ou Client Secret não configurado"

**Solução**: Configure `SYNCPAY_CLIENT_ID` e `SYNCPAY_CLIENT_SECRET` no `.env.local`

### Problema: "Erro 401 - Não autorizado"

**Possíveis causas**:
1. Client ID ou Client Secret inválidos
2. Token Bearer expirado (renovado automaticamente)
3. Credenciais não pertencem à mesma conta

**Solução**:
1. Verifique se as credenciais estão corretas
2. Confirme que Client ID e Client Secret pertencem à mesma conta
3. Verifique os logs do servidor para mais detalhes

### Problema: "Erro 422 - Erro de parâmetro"

**Possíveis causas**:
1. Valor inválido (menor que mínimo)
2. Split configurado incorretamente
3. Dados do cliente inválidos

**Solução**:
1. Verifique se o valor está em reais (não centavos)
2. Verifique se o split tem porcentagem válida (1-100)
3. Verifique se os dados do cliente estão no formato correto

### Problema: "QR Code não aparece"

**Possíveis causas**:
1. API online de QR Code não está acessível
2. Código PIX inválido
3. Elemento `qrCode` não existe na página

**Solução**:
1. Verifique se a API online está acessível
2. Verifique se o `pix_code` foi retornado pela API
3. Verifique se o elemento `qrCode` existe na página
4. Verifique o console do navegador para erros

### Problema: "Split não funciona"

**Possíveis causas**:
1. User IDs inválidos (não são UUIDs válidos)
2. Porcentagem inválida (fora do range 1-100)
3. Mais de 3 recebedores configurados
4. Total de porcentagens excede 100%

**Solução**:
1. Verifique se os User IDs são UUIDs válidos (Client ID público)
2. Verifique se as porcentagens estão entre 1 e 100
3. Limite a 3 recebedores por transação
4. Verifique se o total não excede 100%

### Problema: "Webhook não é chamado"

**Possíveis causas**:
1. URL do webhook não é pública
2. Webhook não está configurado
3. Servidor não está acessível

**Solução**:
1. Verifique se a URL do webhook é pública e acessível
2. Configure o webhook via API ou payload
3. Verifique se o servidor está online e acessível
4. Verifique os logs do servidor para erros

### Problema: "Token expira muito rápido"

**Explicação**: O token Bearer tem validade de 1 hora. O código renova automaticamente quando necessário.

**Solução**: O código já implementa cache e renovação automática do token. Não é necessário fazer nada.

---

## 🔍 Informações que Precisam ser Confirmadas

### 1. URL Base da API

A documentação não especifica a URL base completa. Os endpoints são relativos (`/api/partner/v1/...`).

**Ação necessária**: Confirmar com suporte SyncPay a URL base da API.

**Possíveis URLs**:
- `https://api.syncpay.com.br`
- `https://api.syncpayments.com`
- Outra URL fornecida pelo suporte

### 2. User IDs para Split

Os User IDs devem ser o **Client ID público** das chaves em API Keys.

**Ação necessária**: 
1. Acessar Dashboard SyncPay
2. Ir em "API Keys" ou "Chaves de API"
3. Copiar o Client ID (UUID público) de cada recebedor
4. Usar como `user_id` no split

### 3. Token do Webhook

O token do webhook é opcional, mas recomendado para segurança.

**Ação necessária**: Confirmar com suporte SyncPay como obter/gerar o token do webhook.

---

## ✅ Checklist de Configuração

### Configuração Básica
- [ ] Arquivo `.env.local` criado
- [ ] `SYNCPAY_CLIENT_ID` configurado
- [ ] `SYNCPAY_CLIENT_SECRET` configurado
- [ ] `SYNCPAY_API_URL` configurado (confirmar com suporte)
- [ ] `NEXT_PUBLIC_SITE_URL` configurado
- [ ] Testado criação de PIX sem split

### Split Automático (Opcional)
- [ ] User IDs obtidos (Client ID público de cada recebedor)
- [ ] `SYNCPAY_SPLIT_RULES` configurado (se usar variável de ambiente)
- [ ] Testado criação de PIX com split
- [ ] Verificado que porcentagens somam até 100%
- [ ] Verificado que não excede 3 recebedores

### Webhooks (Opcional)
- [ ] Webhook configurado via API ou payload
- [ ] `SYNCPAY_WEBHOOK_TOKEN` configurado (se usar validação)
- [ ] URL do webhook é pública e acessível
- [ ] Testado recebimento de webhook

### Testes
- [ ] Testado criação de PIX
- [ ] Testado geração de QR Code
- [ ] Testado consulta de status
- [ ] Testado split (se configurado)
- [ ] Testado webhook (se configurado)
- [ ] Testado pagamento completo (criação → pagamento → confirmação)

---

## 🔧 Solução de Problemas

### Erro "fetch failed" ou "Erro ao gerar Bearer Token"

**Problema**: Erro ao conectar com a API SyncPay.

**Causa mais comum**: URL base da API (`SYNCPAY_API_URL`) está incorreta.

**Solução**:

1. **Verifique a URL no `.env.local`**:
   ```env
   SYNCPAY_API_URL=https://api.syncpayments.com.br
   ```

2. **URL base da API**:
   - URL correta: `https://api.syncpayments.com.br`
   - Documentação: https://syncpay.apidog.io (apenas para referência)
   - Endpoints: `/api/partner/v1/*`

3. **Teste a conexão**:
   ```bash
   # Teste manual
   curl -X POST https://api.syncpayments.com.br/api/partner/v1/auth-token \
     -H "Content-Type: application/json" \
     -d '{"client_id":"seu-client-id","client_secret":"seu-client-secret"}'
   ```

### Erro 401 "Não autorizado"

**Problema**: Credenciais inválidas.

**Solução**:

1. Verifique se `SYNCPAY_CLIENT_ID` e `SYNCPAY_CLIENT_SECRET` estão corretos
2. Confirme que as credenciais não expiraram
3. Verifique se as credenciais pertencem à conta correta

### Erro 422 "Erro de parâmetro"

**Problema**: Dados inválidos na requisição.

**Solução**:

1. Verifique o formato do `amount` (deve ser double em reais, ex: `19.90`)
2. Verifique o formato do `cpf` (deve ter exatamente 11 dígitos)
3. Verifique o formato do `phone` (deve ter 10-11 dígitos)
4. Verifique as regras de split (máximo 3 recebedores, percentage 1-100)

### QR Code não aparece

**Problema**: QR Code não é gerado ou exibido.

**Solução**:

1. Verifique se `pix_code` está sendo retornado pela API
2. Verifique se o elemento `#qrCode` existe no HTML
3. Verifique o console do navegador para erros
4. A geração do QR Code usa uma API online (`api.qrserver.com`) - verifique conexão com internet

### Webhook não está sendo chamado

**Problema**: Webhook não recebe notificações.

**Solução**:

1. Verifique se `NEXT_PUBLIC_SITE_URL` está configurado corretamente
2. Verifique se a URL do webhook é pública e acessível
3. Verifique se o endpoint `/api/webhook-syncpay` está funcionando
4. Confirme com suporte SyncPay se o IP do servidor está autorizado

### Status da transação não atualiza

**Problema**: Status permanece como "pending".

**Solução**:

1. Verifique se o pagamento foi realmente realizado
2. Verifique se o `identifier` está correto
3. Verifique os logs do servidor para erros na consulta
4. Aguarde alguns minutos - pode haver atraso na confirmação

---

## 📞 Suporte

Se precisar de ajuda:

1. **Documentação Oficial**: https://syncpay.apidog.io
2. **Suporte SyncPay**: Contatar suporte para:
   - **URL base da API** ⚠️ OBRIGATÓRIO se houver erro "fetch failed"
   - User IDs para split
   - Token do webhook
   - Dúvidas sobre a API
   - Autorização de IPs para webhooks

---

## 🎯 Resumo Rápido

### Para Começar Agora (Sem Split)
1. Crie `.env.local` com `SYNCPAY_CLIENT_ID` e `SYNCPAY_CLIENT_SECRET`
2. **Confirme `SYNCPAY_API_URL` com suporte SyncPay** ⚠️ OBRIGATÓRIO!
3. Configure `NEXT_PUBLIC_SITE_URL`
4. Execute `npm run dev`
5. Teste criando um PIX

### Para Usar Split
1. Obtenha User IDs (Client ID público de cada recebedor)
2. Configure `SYNCPAY_SPLIT_RULES` no `.env.local` ou passe no request
3. Teste criando um PIX com split
4. Verifique que as porcentagens somam até 100%

### Diferenças Chave
- ✅ **Split nativo** - Suportado pela API
- ✅ **Bearer Token** - Renovado automaticamente (válido 1 hora)
- ✅ **Valor em reais** - Converter de centavos para reais
- ✅ **QR Code gerado no frontend** - A partir do `pix_code` (string)
- ✅ **Identifier** - UUID para consultar transações

---

## ✅ Migração Concluída: Main → Split

### Situação Atual (Após Migração)

**Nova Conta Principal (Main)**:
- Client ID: `74633f92-ee63-44e4-af4a-63b0cf1d6844`
- Client Secret: `f97b2c78-a648-4972-b3b6-d7f916aa1ad2`
- Status: Recebe 50% automaticamente (restante após split)

**Conta Antiga (Split)**:
- Client ID: `cb8d5abc-f7ca-4305-986c-ca587b12cfa8` (usado como `user_id` no split)
- Status: Recebe 50% via split automático

### Configuração Atual (Após Migração)

**`.env.local` atual**:
```env
# Nova conta principal (recebe 50% automaticamente)
SYNCPAY_CLIENT_ID=74633f92-ee63-44e4-af4a-63b0cf1d6844
SYNCPAY_CLIENT_SECRET=f97b2c78-a648-4972-b3b6-d7f916aa1ad2

# Split: 50% para conta antiga
SYNCPAY_SPLIT_RULES=[{"percentage":50,"user_id":"cb8d5abc-f7ca-4305-986c-ca587b12cfa8"}]
```

**Como Funciona**:
- O `user_id` do split é o **Client ID público** da conta antiga
- `user_id`: `cb8d5abc-f7ca-4305-986c-ca587b12cfa8` (Client ID público da conta antiga)
- Split configurado: 50% para conta antiga
- Conta principal recebe automaticamente os outros 50% (restante após split)

**Resultado em um Pagamento de R$ 19,90**:
- R$ 9,95 (50%) → Nova conta principal (74633f92-ee63-44e4-af4a-63b0cf1d6844)
- R$ 9,95 (50%) → Conta antiga via split (cb8d5abc-f7ca-4305-986c-ca587b12cfa8)

### ⚠️ Importante

1. **User ID do Split**: Use o **Client ID público** (`cb8d5abc-f7ca-4305-986c-ca587b12cfa8`), não o secret
2. **Porcentagens**: A soma das porcentagens do split não precisa ser 100% - o restante vai para a conta principal
3. **Teste Antes**: Sempre teste em ambiente de desenvolvimento antes de migrar em produção
4. **Backup**: Faça backup das configurações antes de migrar

---

**Desenvolvido com base na documentação oficial**: https://syncpay.apidog.io

