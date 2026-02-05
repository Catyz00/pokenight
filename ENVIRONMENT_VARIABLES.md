# Guia de Variáveis de Ambiente - PokeNight

## 📋 Visão Geral

Este documento explica todas as variáveis de ambiente necessárias para configurar o projeto PokeNight em desenvolvimento e produção.

## 🔒 Segurança

### ⚠️ IMPORTANTE:
- **NUNCA** commite o arquivo `.env.local` com valores reais
- **SEMPRE** use HTTPS em produção
- Variáveis com prefixo `NEXT_PUBLIC_` são **expostas ao browser** (client-side)
- Variáveis sem `NEXT_PUBLIC_` são **privadas** (server-side only)

## 📁 Arquivos de Configuração

- `.env.local` - Variáveis locais (desenvolvimento) - **NÃO COMMITADO**
- `.env.example` - Exemplo para produção - **COMMITADO**
- `.env.production` - Configuração de produção (opcional)

## 🔧 Variáveis de Ambiente

### URLs Base

#### `BACKEND_URL` (Server-side)
- **Descrição**: URL do backend PHP (MyAAC/API)
- **Desenvolvimento**: `http://localhost`
- **Produção**: `https://seu-dominio.com.br`
- **Usado em**: Rotas API Next.js (server components)

#### `NEXT_PUBLIC_SITE_URL` (Client-side)
- **Descrição**: URL pública do site Next.js
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://seu-dominio.com.br`
- **Usado em**: Client components, links externos

#### `NEXT_PUBLIC_API_URL` (Client-side)
- **Descrição**: URL base da API Next.js
- **Padrão**: `/api`
- **Usado em**: Requisições fetch do cliente

#### `NEXT_PUBLIC_APP_URL` (Client-side)
- **Descrição**: URL do frontend (alternativa)
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://seu-dominio.com.br`

---

### APIs de Pagamento (PIX)

#### `NEXT_PUBLIC_PAYMENT_API_URL` (Client-side)
- **Descrição**: URL base da API PHP de pagamentos
- **Desenvolvimento**: `http://localhost/api`
- **Produção**: `https://seu-dominio.com.br/api`
- **Usado em**: Sistema de compra de NightCoins

#### `NEXT_PUBLIC_PAYMENT_WEBHOOK_URL` (Client-side)
- **Descrição**: URL do webhook para notificações de pagamento
- **Desenvolvimento**: `https://seu-dominio.com.br/webhook`
- **Produção**: `https://seu-dominio.com.br/webhook`
- **Usado em**: Confirmação automática de pagamentos PIX

**Endpoints gerados automaticamente:**
- PIX Create: `${NEXT_PUBLIC_PAYMENT_API_URL}/pix.php`
- PIX Check: `${NEXT_PUBLIC_PAYMENT_API_URL}/check-pix.php`
- Add Points: `${NEXT_PUBLIC_PAYMENT_API_URL}/add-premium-points.php`

---

### Twitch API

#### `TWITCH_CLIENT_ID` (Server-side)
- **Descrição**: ID do cliente da Twitch API
- **Obtenção**: https://dev.twitch.tv/console/apps
- **Usado em**: Listagem de streamers na página de parceiros

#### `TWITCH_CLIENT_SECRET` (Server-side)
- **Descrição**: Secret do cliente da Twitch API
- **Obtenção**: https://dev.twitch.tv/console/apps
- **Usado em**: Autenticação na Twitch API

---

### Google reCAPTCHA (Opcional)

#### `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (Client-side)
- **Descrição**: Chave pública do reCAPTCHA v3
- **Obtenção**: https://www.google.com/recaptcha/admin
- **Usado em**: Formulários de registro/recuperação de senha

#### `RECAPTCHA_SECRET_KEY` (Server-side)
- **Descrição**: Chave secreta do reCAPTCHA
- **Obtenção**: https://www.google.com/recaptcha/admin
- **Usado em**: Validação server-side

---

### Database (Opcional)

Se você precisar acessar o banco diretamente do Next.js:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=poke
DATABASE_USER=root
DATABASE_PASSWORD=
```

**Nota**: Atualmente o projeto usa APIs PHP para acessar o banco.

---

## 🚀 Configuração para Produção

### 1. Vercel/Netlify

Configure as variáveis no dashboard do provedor:

1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável listada acima
3. Use valores de produção (HTTPS)

### 2. Servidor VPS/Dedicado

Crie um arquivo `.env.local` no servidor:

```bash
# Copie o .env.example
cp .env.example .env.local

# Edite com seus valores reais
nano .env.local
```

### 3. Docker

Use arquivo `.env` ou `docker-compose.yml`:

```yaml
environment:
  - BACKEND_URL=https://seu-dominio.com.br
  - NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
  - NEXT_PUBLIC_PAYMENT_API_URL=https://seu-dominio.com.br/api
  # ... outras variáveis
```

---

## 🧪 Testando Configurações

### Verificar variáveis carregadas:

```javascript
// Em qualquer arquivo do projeto
console.log('Backend URL:', process.env.BACKEND_URL)
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('Payment API:', process.env.NEXT_PUBLIC_PAYMENT_API_URL)
```

### Variáveis client-side (browser):

Abra o console do navegador e digite:
```javascript
console.log(process.env)
```

**Lembre-se**: Apenas variáveis com `NEXT_PUBLIC_` aparecerão aqui!

---

## ❌ Erros Comuns

### 1. "Cannot read property of undefined"
- **Causa**: Variável de ambiente não definida
- **Solução**: Verifique se o `.env.local` existe e tem a variável

### 2. "CORS Error"
- **Causa**: Backend não permite requisições do frontend
- **Solução**: Configure CORS no PHP/Apache

### 3. "Invalid URL"
- **Causa**: URL sem protocolo (http:// ou https://)
- **Solução**: Sempre inclua o protocolo

### 4. Variável não atualiza
- **Causa**: Next.js precisa reiniciar após mudanças no .env
- **Solução**: Reinicie o servidor (`npm run dev`)

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Twitch API Documentation](https://dev.twitch.tv/docs/api/)

---

## 📝 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Todas as URLs usam HTTPS
- [ ] `.env.local` NÃO está no Git
- [ ] `.env.example` está atualizado
- [ ] Variáveis configuradas no provedor (Vercel, etc.)
- [ ] CORS configurado no backend PHP
- [ ] Webhook URL aponta para produção
- [ ] Twitch Client ID/Secret válidos
- [ ] reCAPTCHA configurado (se usado)
- [ ] Testado todas as funcionalidades de pagamento
- [ ] Backup das configurações importantes

---

**Última atualização**: 04/02/2026
