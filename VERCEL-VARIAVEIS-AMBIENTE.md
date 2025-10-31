# Variáveis de Ambiente para Vercel

Este arquivo contém todas as variáveis de ambiente necessárias para configurar o projeto na Vercel.

## Como Configurar

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável abaixo

---

## Variáveis Obrigatórias

### 🔐 PushinPay (Sistema de Pagamento PIX)

```
PUSHINPAY_TOKEN=seu_token_pushinpay_aqui
```
- **Onde obter**: Painel da PushinPay (https://pushinpay.com.br)
- **Descrição**: Token de autenticação da API PushinPay para criar pagamentos PIX

```
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api
```
- **Valor fixo**: Não altere este valor
- **Descrição**: URL base da API PushinPay

```
PLANO_VITALICIO_19_90=1990
```
- **Valor**: 1990 (equivale a R$ 19,90 em centavos)
- **Descrição**: Valor do plano "1 Mês" em centavos

---

### 📊 Facebook Pixel (Analytics - Opcional)

```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui
```
- **Onde obter**: Facebook Business Manager → Pixels
- **Descrição**: ID do Facebook Pixel para rastreamento de conversões
- **Opcional**: Se não tiver, deixe em branco ou use valor padrão

---

### 🤖 Telegram Bot (Notificações - Opcional)

```
TELEGRAM_BOT_TOKEN=seu_token_bot_telegram_aqui
```
- **Onde obter**: Fale com @BotFather no Telegram
- **Descrição**: Token do bot do Telegram para enviar notificações

```
TELEGRAM_CHAT_ID=seu_chat_id_aqui
```
- **Onde obter**: Use @userinfobot no Telegram
- **Descrição**: ID do chat onde o bot enviará as notificações

---

## Resumo dos Valores

Copie e cole no painel da Vercel (substitua os valores):

```env
PUSHINPAY_TOKEN=seu_token_pushinpay_aqui
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api
PLANO_VITALICIO_19_90=1990
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui
TELEGRAM_BOT_TOKEN=seu_token_bot_telegram_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui
```

---

## ⚠️ Importante

- **Nunca faça commit** do arquivo `.env.local` no GitHub
- As variáveis que começam com `NEXT_PUBLIC_` são expostas no frontend
- As demais variáveis são privadas e só existem no servidor
- Após adicionar/alterar variáveis, é necessário fazer **redeploy** do projeto

---

## Teste

Após configurar, teste:
1. Abra o site deployado
2. Clique no botão "1 Mês - R$ 19,90"
3. Verifique se o QR Code PIX é gerado
4. Se houver erro, verifique os logs na Vercel

---

## Suporte

- **PushinPay**: https://pushinpay.com.br/docs
- **Vercel**: https://vercel.com/docs/environment-variables

