# ✅ Variáveis Obrigatórias para Vercel

## ⚠️ IMPORTANTE
Todas estas variáveis **DEVEM** estar configuradas na Vercel e marcadas para **Production, Preview e Development**.

## 📋 Lista Completa de Variáveis Obrigatórias

### 1. IRONPAY_API_TOKEN
```
Valor: 1nppyoCxLouCQ4BMMAh92RIwlanP9QuF7c1QGFJxHg7g1sfsxvp1Ll4wxgLz
Status: ✅ Parece estar configurado (erro mudou para PRODUCT_HASH)
```

### 2. IRONPAY_PRODUCT_HASH
```
Valor: jsiobwuhxp
Status: ❌ FALTANDO (erro atual)
```

### 3. IRONPAY_OFFER_HASH
```
Valor: hmzqb
Status: ⚠️ Verificar se está configurado
```

### 4. IRONPAY_API_URL
```
Valor: https://api.ironpayapp.com.br/api/public/v1
Status: ⚠️ Verificar se está configurado
```

## 🔧 Como Adicionar na Vercel

1. **Acesse:** https://vercel.com/dashboard
2. **Abra o projeto** `marprivacy.site`
3. **Vá em Settings** → **Environment Variables**
4. **Para cada variável:**
   - Clique em "Add New"
   - Nome: `IRONPAY_PRODUCT_HASH`
   - Valor: `jsiobwuhxp`
   - Marque: ✅ Production, ✅ Preview, ✅ Development
   - Clique em "Save"

## 📝 Variáveis Opcionais (Recomendadas)

Estas não são obrigatórias, mas recomendadas:

- `IRONPAY_OFFER_HASH_19_90=hmzqb`
- `IRONPAY_OFFER_HASH_50_00=c3bvl`
- `IRONPAY_OFFER_HASH_99_90=wssla`
- `IRONPAY_DEFAULT_CURRENCY=BRL`
- `NEXT_PUBLIC_SITE_URL=https://marprivacy.site`
- `NEXT_PUBLIC_BASE_URL=https://marprivacy.site`
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID=856032176652340`

## ⚠️ Após Adicionar Variáveis

**SEMPRE faça um redeploy após adicionar/modificar variáveis!**

1. Vá em **Deployments**
2. Clique nos **3 pontos (⋯)** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o build completar

## ✅ Checklist

- [ ] `IRONPAY_API_TOKEN` configurado
- [ ] `IRONPAY_PRODUCT_HASH` configurado ← **FALTANDO**
- [ ] `IRONPAY_OFFER_HASH` configurado
- [ ] `IRONPAY_API_URL` configurado
- [ ] Todas marcadas para Production, Preview e Development
- [ ] Redeploy feito após adicionar variáveis

