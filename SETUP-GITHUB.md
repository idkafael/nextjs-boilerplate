# 🚀 Configuração para GitHub

## 📋 Passo a Passo

### 1. Inicializar Git (se ainda não iniciou)

```bash
git init
```

### 2. Adicionar arquivos

```bash
git add .
```

### 3. Fazer primeiro commit

```bash
git commit -m "Initial commit: Next.js Privacy project"
```

### 4. Criar repositório no GitHub

1. Vá para https://github.com
2. Clique em **New repository**
3. Nome: `privacy-nextjs` (ou o nome que preferir)
4. **NÃO** inicialize com README, .gitignore ou license
5. Clique em **Create repository**

### 5. Conectar ao repositório remoto

```bash
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/privacy-nextjs.git

# Ou se preferir usar SSH:
git remote add origin git@github.com:SEU_USUARIO/privacy-nextjs.git
```

### 6. Renomear branch principal (opcional)

```bash
git branch -M main
```

### 7. Fazer push

```bash
git push -u origin main
```

---

## ⚠️ IMPORTANTE - Antes de fazer push

### Verificar o que será enviado

```bash
# Ver arquivos que serão commitados
git status

# Ver diferenças
git diff --cached
```

### Arquivos que DEVEM estar no Git:

✅ `package.json`
✅ `next.config.js`
✅ `.gitignore`
✅ `README.md`
✅ `pages/`
✅ `public/`
✅ Arquivos `.html` originais (se quiser manter backup)

### Arquivos que NÃO devem estar no Git:

❌ `.env.local` (está no .gitignore)
❌ `node_modules/` (está no .gitignore)
❌ `.next/` (está no .gitignore)
❌ `.vercel/` (está no .gitignore)

---

## 🔐 Configuração na Vercel

Após fazer push para o GitHub:

1. **Conecte o repositório:**
   - Vá para https://vercel.com
   - Clique em **New Project**
   - Importe seu repositório do GitHub

2. **Configure Environment Variables:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione cada variável:
     - `PUSHINPAY_TOKEN` = seu token real
     - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` = seu pixel ID
     - `TELEGRAM_BOT_TOKEN` = seu bot token
     - `TELEGRAM_CHAT_ID` = seu chat ID
     - etc.

3. **Deploy automático:**
   - Toda vez que você fizer push no GitHub
   - A Vercel automaticamente faz deploy

---

## 📝 Comandos úteis

```bash
# Ver status
git status

# Adicionar arquivos específicos
git add package.json next.config.js

# Ver histórico
git log --oneline

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Fazer merge
git merge feature/nova-funcionalidade

# Fazer pull do GitHub
git pull origin main

# Fazer push
git push origin main
```

---

## ✅ Checklist antes do deploy

- [ ] `.env.local` não está no commit
- [ ] `node_modules/` não está no commit  
- [ ] Todos os tokens são placeholders (`SEU_TOKEN_AQUI`)
- [ ] `.gitignore` está configurado corretamente
- [ ] README.md está atualizado
- [ ] package.json tem todas as dependências
- [ ] Pronto para fazer push!

---

## 🎯 Próximos Passos Após Push

1. ✅ Fazer push para GitHub
2. ✅ Conectar repositório na Vercel
3. ✅ Configurar Environment Variables na Vercel
4. ✅ Fazer primeiro deploy
5. ✅ Testar tudo funcionando
6. ✅ Comemorar! 🎉

