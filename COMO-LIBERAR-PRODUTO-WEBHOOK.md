# 🎁 Como Liberar Produto Automaticamente Após Pagamento

Guia completo para configurar liberação automática de conteúdo após confirmação de pagamento PIX.

---

## 🎯 Fluxo Completo

```
Cliente paga PIX
    ↓
PushinPay confirma pagamento
    ↓
Webhook notifica seu sistema (/api/webhook-pushinpay)
    ↓
Sistema libera acesso ao conteúdo
    ↓
Cliente recebe link de acesso
```

---

## ✅ Já Implementado

Seu sistema **JÁ TEM** a base do webhook implementada:

1. ✅ Endpoint: `/api/webhook-pushinpay`
2. ✅ Detecção de pagamento confirmado
3. ✅ Notificação no Telegram
4. ✅ Frontend detecta pagamento e recarrega

---

## 🔧 Configuração Necessária

### **1. Adicionar Variável de Ambiente na Vercel**

```env
NEXT_PUBLIC_SITE_URL=https://marprivacy.site
```

**Como adicionar:**
1. Vercel → Seu projeto → Settings → Environment Variables
2. Key: `NEXT_PUBLIC_SITE_URL`
3. Value: `https://marprivacy.site`
4. Environments: ✅ Production ✅ Preview ✅ Development
5. Clique em "Save"
6. **Redeploy** o projeto

---

## 📦 Opções de Liberação de Produto

Você tem 3 opções principais:

### **Opção 1: Redirecionar para Área de Membros (Simples)**

O sistema já faz isso! Após pagar:
- Frontend detecta pagamento
- Mostra mensagem de sucesso
- Recarrega a página (conteúdo desbloqueado)

**Implementação:**
```javascript
// Já está em: public/js/pushinpay-real.js linha 208
window.location.reload();
```

---

### **Opção 2: Enviar Link por Email (Recomendado)**

Enviar email com link de acesso ao conteúdo.

**O que fazer:**

1. **Instalar biblioteca de email:**
```bash
npm install nodemailer
```

2. **Adicionar variáveis de ambiente:**
```env
# SMTP (Gmail, SendGrid, etc)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# Configurações do produto
PRODUCT_ACCESS_URL=https://marprivacy.site/acesso
PRODUCT_NAME=Privacy - Conteúdo Exclusivo
```

3. **Atualizar webhook:**

Edite `pages/api/webhook-pushinpay.js` e adicione após linha 54:

```javascript
// Enviar email com link de acesso
if (process.env.SMTP_HOST && payer?.email) {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const accessLink = `${process.env.PRODUCT_ACCESS_URL}?payment=${id}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: payer.email,
    subject: `✅ Pagamento Confirmado - ${process.env.PRODUCT_NAME}`,
    html: `
      <h2>🎉 Pagamento Confirmado!</h2>
      <p>Seu pagamento de <strong>R$ ${(value / 100).toFixed(2)}</strong> foi aprovado.</p>
      <p><strong>Acesse seu conteúdo exclusivo:</strong></p>
      <a href="${accessLink}" style="display: inline-block; padding: 15px 30px; background: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        🔓 ACESSAR AGORA
      </a>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        ID do Pagamento: ${id}<br>
        Data: ${new Date().toLocaleString('pt-BR')}
      </p>
    `,
  });

  console.log('📧 Email de acesso enviado para:', payer.email);
}
```

---

### **Opção 3: Gerar Link Único de Acesso (Mais Seguro)**

Criar link único e temporário para cada compra.

**1. Criar tabela de acessos (pode usar JSON simples ou BD):**

```javascript
// pages/api/access-tracker.js
const fs = require('fs');
const path = require('path');

const ACCESS_FILE = path.join(process.cwd(), 'access-data.json');

export function grantAccess(paymentId, email) {
  const accessToken = generateRandomToken(32);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias de acesso

  const accessData = {
    token: accessToken,
    paymentId: paymentId,
    email: email,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'active'
  };

  // Salvar em arquivo JSON (para produção, use banco de dados)
  let allAccess = [];
  if (fs.existsSync(ACCESS_FILE)) {
    allAccess = JSON.parse(fs.readFileSync(ACCESS_FILE, 'utf8'));
  }
  allAccess.push(accessData);
  fs.writeFileSync(ACCESS_FILE, JSON.stringify(allAccess, null, 2));

  return accessToken;
}

function generateRandomToken(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

**2. Atualizar webhook para gerar token:**

```javascript
// No webhook (linha 54+)
const { grantAccess } = require('./access-tracker');

const accessToken = grantAccess(id, payer?.email || 'sem-email');
const accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/acesso/${accessToken}`;

console.log('🔑 Token de acesso gerado:', accessToken);

// Enviar link por email (código acima)
```

**3. Criar página de acesso:**

```javascript
// pages/acesso/[token].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AccessPage() {
  const router = useRouter();
  const { token } = router.query;
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verificar se o token é válido
      fetch('/api/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        setIsValid(data.valid);
        setLoading(false);
      });
    }
  }, [token]);

  if (loading) return <div>Verificando acesso...</div>;
  if (!isValid) return <div>Token inválido ou expirado</div>;

  return (
    <div>
      <h1>🎉 Bem-vindo! Acesso Liberado</h1>
      {/* Mostrar conteúdo exclusivo aqui */}
    </div>
  );
}
```

---

## 🔐 Sistema Atual (Mais Simples)

Seu sistema atual funciona assim:

1. Cliente paga PIX
2. Sistema detecta pagamento (webhook ou polling)
3. **Frontend recarrega a página**
4. Conteúdo aparece desbloqueado

**Para melhorar:**

Você pode verificar se o usuário pagou usando:
- Cookie com ID da transação
- LocalStorage
- Consulta ao backend

---

## 🎯 Recomendação Final

Para seu caso (conteúdo do Privacy), recomendo:

### **Sistema Híbrido:**

1. **Webhook envia notificação no Telegram** ✅ (já tem)
2. **Frontend recarrega e libera conteúdo** ✅ (já tem)
3. **+ Adicionar: Enviar email com link de acesso** (implementar)

**Por quê?**
- Cliente tem confirmação por email
- Pode acessar de qualquer dispositivo
- Mais profissional

---

## 📝 Checklist de Implementação

- [x] ✅ Webhook criado (`/api/webhook-pushinpay`)
- [x] ✅ Notificação Telegram funcionando
- [x] ✅ Frontend detecta pagamento
- [ ] ⏳ Adicionar `NEXT_PUBLIC_SITE_URL` na Vercel
- [ ] ⏳ Testar webhook com pagamento real
- [ ] 🎯 Implementar envio de email (Opção 2)
- [ ] 🎯 Criar sistema de tokens (Opção 3 - avançado)

---

## 🧪 Testar Webhook Localmente

```bash
# Simular webhook da PushinPay
curl -X POST https://marprivacy.site/api/webhook-pushinpay \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_12345",
    "status": "paid",
    "value": 1990,
    "payer": {
      "name": "Cliente Teste",
      "email": "cliente@test.com"
    },
    "paid_at": "2025-10-31T12:00:00Z"
  }'
```

---

## 🆘 Próximos Passos

1. **Configure `NEXT_PUBLIC_SITE_URL` na Vercel**
2. **Faça redeploy**
3. **Teste com pagamento real**
4. **Veja logs no Telegram**
5. **Implemente email (Opção 2)**

---

✅ **O webhook JÁ ESTÁ PRONTO! Só falta configurar a variável de ambiente.**

