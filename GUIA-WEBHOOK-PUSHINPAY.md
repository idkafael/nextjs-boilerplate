# 🔔 Como Configurar Webhook no Painel da PushinPay

## 📋 O que é e para que serve?

O **webhook** é uma URL que a PushinPay chama automaticamente quando um pagamento é confirmado.

**Benefícios**:
- ⚡ Detecção **INSTANTÂNEA** de pagamento (1-2 segundos)
- 🔄 Sem webhook: detecção em 3-30 segundos (verificação manual)
- 🎯 Melhor experiência para o cliente

---

## 🚀 Passo a Passo Completo

### **Passo 1: Acessar o Painel PushinPay**

1. Abra o navegador
2. Acesse: **https://dashboard.pushinpay.com.br** (ou o link que você usa para acessar)
3. Faça login com suas credenciais:
   - Email/Usuário
   - Senha

---

### **Passo 2: Localizar Configurações de Webhook**

Procure por uma dessas opções no menu lateral:

```
📌 Opções possíveis (varia por painel):
- "Webhooks"
- "Notificações"
- "Configurações" → "Webhooks"
- "API" → "Webhooks"
- "Integrações" → "Webhooks"
- "Desenvolvedor" → "Webhooks"
```

**Exemplo visual** (menu lateral):
```
┌─────────────────────────┐
│ 📊 Dashboard           │
│ 💰 Transações          │
│ 📈 Relatórios          │
│ ⚙️ Configurações       │ ← Clique aqui
│    └── 🔔 Webhooks     │ ← Ou aqui
│ 🔑 API                 │ ← Ou aqui
│ 👤 Conta               │
└─────────────────────────┘
```

---

### **Passo 3: Adicionar Nova URL de Webhook**

Procure por um botão similar a:
- ➕ "Adicionar Webhook"
- ➕ "Novo Webhook"
- ➕ "Configurar Webhook"
- ➕ "Add Webhook URL"

**Clique** no botão.

---

### **Passo 4: Preencher Dados do Webhook**

Você verá um formulário. Preencha com:

#### **URL do Webhook** (Campo obrigatório)
```
https://maiprivacy.site/api/webhook-pushinpay
```

**⚠️ IMPORTANTE**: 
- ✅ Use **HTTPS** (não HTTP)
- ✅ URL completa, sem espaços
- ✅ Copie e cole exatamente como está acima

---

#### **Eventos para Notificar** (Selecione os eventos)

Marque **TODAS** essas opções (se disponíveis):

```
☑️ transaction.paid          (Pagamento confirmado)
☑️ transaction.approved      (Pagamento aprovado)
☑️ transaction.confirmed     (Pagamento confirmado)
☑️ pix.paid                  (PIX pago)
☑️ payment.confirmed         (Pagamento confirmado)
```

**Se tiver dúvida**: Marque **TODOS** os eventos relacionados a pagamento confirmado/aprovado.

---

#### **Método HTTP** (Se perguntar)
```
POST
```

---

#### **Formato de Dados** (Se perguntar)
```
JSON
```

---

#### **Autenticação/Token** (Se pedir)

Alguns painéis pedem um token de segurança. 

**Opção A**: Se **não** pedir token
- ✅ Deixe em branco
- ✅ Nosso webhook já funciona sem token

**Opção B**: Se **pedir** token obrigatório
1. Crie um token qualquer, exemplo: `minha_chave_secreta_123456`
2. Anote esse token
3. **Me avise** que eu adiciono na Vercel como `PUSHINPAY_WEBHOOK_TOKEN`

---

### **Passo 5: Salvar Configuração**

1. Revise os dados:
   - ✅ URL: `https://maiprivacy.site/api/webhook-pushinpay`
   - ✅ Eventos: transaction.paid, approved, confirmed
   - ✅ Método: POST
   - ✅ Formato: JSON

2. Clique em:
   - "Salvar"
   - "Confirmar"
   - "Ativar Webhook"
   - "Save" (ou similar)

---

### **Passo 6: Testar Webhook (Se disponível)**

Alguns painéis têm botão "Testar Webhook" ou "Send Test".

**Se tiver**:
1. Clique em "Testar Webhook"
2. Aguarde resposta
3. Deve mostrar: ✅ "Webhook funcionando" ou "200 OK"

**Se NÃO tiver**:
- Sem problemas! Vamos testar com pagamento real depois.

---

## 📸 Exemplo Visual do Formulário

```
┌─────────────────────────────────────────────────────┐
│  Configurar Webhook                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  URL do Webhook *                                   │
│  ┌───────────────────────────────────────────────┐ │
│  │ https://maiprivacy.site/api/webhook-pushinpay│ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Eventos a Notificar *                              │
│  ☑️ transaction.paid                                │
│  ☑️ transaction.approved                            │
│  ☑️ transaction.confirmed                           │
│  ☐ transaction.pending                              │
│  ☐ transaction.cancelled                            │
│                                                     │
│  Método: POST  ▼                                    │
│  Formato: JSON ▼                                    │
│                                                     │
│  Token de Segurança (Opcional)                      │
│  ┌───────────────────────────────────────────────┐ │
│  │                                                │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│      [Cancelar]          [Salvar Webhook]          │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

Antes de salvar, confirme:

- [ ] URL está correta: `https://maiprivacy.site/api/webhook-pushinpay`
- [ ] HTTPS (não HTTP)
- [ ] Eventos de pagamento confirmado marcados
- [ ] Método POST selecionado
- [ ] Formato JSON selecionado
- [ ] Webhook salvo/ativado

---

## 🧪 Como Testar se Funcionou?

### **Teste 1: Verificar no Painel**
- Após salvar, o webhook deve aparecer na lista
- Status deve estar: ✅ "Ativo" ou "Habilitado"

### **Teste 2: Pagamento Real**
1. Acesse: https://maiprivacy.site
2. Clique em "1 Mês - R$ 19,90"
3. Gere o QR Code PIX
4. Faça o pagamento (pode ser R$ 0,10 se a PushinPay permitir teste)
5. Observe o tempo:
   - **Com webhook**: Detecta em 1-2 segundos ⚡
   - **Sem webhook**: Detecta em 3-30 segundos ⏳

---

## ❓ Problemas Comuns

### **1. "Não encontro opção de Webhook no painel"**

**Soluções**:
- Procure por: Notificações, API, Integrações, Desenvolvedor
- Entre em contato com suporte da PushinPay
- **Sistema funciona sem webhook** (só é mais lento)

---

### **2. "Erro ao salvar webhook: URL inválida"**

**Causas**:
- ❌ Digitou HTTP ao invés de HTTPS
- ❌ Tem espaço no final da URL
- ❌ Falta barra no final (alguns sistemas exigem)

**Teste essas variações**:
1. `https://maiprivacy.site/api/webhook-pushinpay`
2. `https://maiprivacy.site/api/webhook-pushinpay/` (com barra no final)

---

### **3. "Webhook não está funcionando"**

**Como verificar**:
1. Faça um pagamento teste
2. Veja quanto tempo demora para detectar
3. Se demorar mais de 5 segundos, webhook pode não estar ativo

**Solução**:
- Verifique se webhook está "Ativo" no painel
- Tente desativar e reativar
- Entre em contato com suporte PushinPay

---

## 📱 Precisa de Ajuda?

### **Se não encontrar onde configurar:**
1. Tire print/screenshot da tela do painel PushinPay
2. Me envie
3. Te oriento onde clicar

### **Se der erro ao salvar:**
1. Copie a mensagem de erro completa
2. Me envie
3. Te ajudo a resolver

### **Se quiser testar antes:**
- Sistema **já funciona** sem webhook configurado
- É só mais lento (3-30 segundos ao invés de 1-2 segundos)

---

## 🎯 Resumo Rápido

```bash
1. Acesse: https://dashboard.pushinpay.com.br
2. Procure: "Webhooks" no menu
3. Clique: "Adicionar Webhook"
4. Cole URL: https://maiprivacy.site/api/webhook-pushinpay
5. Marque: transaction.paid, approved, confirmed
6. Salve: Clique em "Salvar"
7. Teste: Faça pagamento e veja se detecta rápido
```

---

## ⏭️ Próximo Passo

Após configurar o webhook:

**Me passe o link do Google Drive** para finalizar! 📁

Aí está **100% completo**! 🎉

