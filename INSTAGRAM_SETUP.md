# 📸 Configuração da API do Instagram

Este guia explica como configurar a Instagram Graph API para buscar posts do Instagram e exibir nas notícias do PokeNight.

## 🔑 Pré-requisitos

Você já criou o **Portfólio Empresarial** no Meta Business Suite! Agora siga os próximos passos:

---

## 📋 Passo a Passo Completo

### ✅ Passo 1: Criar App no Meta Developers

1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Faça login com sua conta Facebook/Meta
3. Clique em **"My Apps"** (Meus Apps)
4. Clique em **"Create App"** (Criar App)
5. Selecione o tipo: **"Business"** (ou "Other" se não aparecer Business)
6. Preencha:
   - **App Name**: `PokeNight API`
   - **App Contact Email**: seu-email@exemplo.com
7. Clique em **"Create App"**

### ✅ Passo 2: Adicionar Instagram Graph API

1. **Após criar o app**, você será redirecionado para o **Dashboard do App** (painel principal)
   - URL: `https://developers.facebook.com/apps/SEU_APP_ID/dashboard/`
2. No lado esquerdo, role para baixo e procure por **"Add Product"** (Adicionar Produto)
   - Ou na área central do dashboard, você verá cards de produtos disponíveis
3. Encontre o card **"Instagram"** (tem o ícone do Instagram)
4. Clique no botão **"Set Up"** (Configurar) dentro do card
5. Isso habilitará o Instagram Graph API no seu app
6. O menu lateral agora terá uma nova opção **"Instagram"**

### ✅ Passo 3: Configurar Ferramentas do Instagram

**Se você já vê "Instagram" no histórico do painel, o produto foi adicionado com sucesso!**

Agora vamos configurar:

1. No menu lateral esquerdo, procure e clique em **"Configurações do app"** (ícone de engrenagem)
2. Clique em **"Básico"** 
3. Role até encontrar **"App Secret"** - você vai precisar disso depois!
4. Anote ou copie:
   - **App ID** (ID do app)
   - **App Secret** (clique em "Show" para ver)

### ✅ Passo 4: Conectar Conta do Instagram

Agora precisamos gerar o token de acesso. Existem 2 formas:

#### Opção A: Via Graph API Explorer (Mais Fácil)

1. Acesse: [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. No campo **"Meta App"**, selecione **"Jogue PokeNight"** (seu app)
3. Clique no dropdown **"Obter token"** (Get Token)
4. Selecione **"Obter token de acesso da Página"** (Get Page Access Token)
5. Uma janela vai abrir mostrando suas Páginas do Facebook
6. **Selecione a página que está vinculada ao seu Instagram**
7. Aceite as permissões solicitadas (marque as que aparecerem):
   - ✅ `pages_read_engagement` (obrigatório)
   - ✅ `pages_show_list` (obrigatório)
   - Se aparecer: `instagram_basic`, `instagram_manage_comments` (opcional)
   
   **IMPORTANTE:** Não se preocupe se não aparecer permissões específicas do Instagram! 
   O acesso ao Instagram vem através das permissões da Página do Facebook.

8. Clique em **"Gerar Token de Acesso"** ou **"Generate Access Token"**
9. O token da página aparecerá no campo **"Token de acesso"**

**IMPORTANTE: Agora você precisa obter o ID da conta do Instagram vinculada à página:**

10. No campo de requisição (onde está escrito algo como `/me` ou `/v19.0/me`), apague tudo
11. Digite: `me?fields=instagram_business_account`
12. Clique no botão **"Submit"** ou **"Enviar"**
13. A resposta vai mostrar algo como:
```json
{
  "instagram_business_account": {
    "id": "17841400000000000"
  },
  "id": "123456789"
}
```
14. **Copie o ID que está dentro de `instagram_business_account`** - esse é o ID da sua conta do Instagram!
15. **Guarde também o token de acesso da página** que está no campo "Token de acesso"

#### Opção B: Via Ferramenta de Tokens

1. Acesse: [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)
2. Localize seu app **"Jogue PokeNight"**
3. Clique em **"Generate Token"** para User Token ou Page Token
4. Copie o token gerado

**IMPORTANTE**: Sua conta do Instagram deve estar:
   - Convertida para **Conta Profissional** (Business ou Creator)
   - Vinculada a uma **Página do Facebook**

### ✅ Passo 4: Gerar Access Token

**Você já fez os passos anteriores! Agora:**

1. Após conectar a conta, clique em **"Generate Token"** (Gerar Token)
2. Aceite as permissões solicitadas:
   - `instagram_basic`
   - `pages_show_list`
   - `instagram_manage_insights` (opcional)
3. **Copie o token gerado** - ele começa com algo como: `IGxxxxxxxx...`
4. **IMPORTANTE**: Este é um token de curta duração (1 hora)

### ✅ Passo 5: Buscar Posts do Instagram

Agora que você tem o token da página e o ID da conta do Instagram, vamos buscar os posts:

1. No Graph API Explorer, no campo de requisição, digite:
   ```
   SEU_INSTAGRAM_ID/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp
   ```
   Substitua `SEU_INSTAGRAM_ID` pelo ID que você copiou no passo anterior

2. Clique em **"Submit"** ou **"Enviar"**
3. Você verá a lista de posts do Instagram! 🎉

Se funcionou, significa que está tudo certo! Agora vamos converter o token para longa duração.

### ✅ Passo 6: Gerar Token de Longa Duração (60 dias)

Os tokens gerados expiram em 1 hora. Você precisa converter para um token de **longa duração** (60 dias):

#### Método 1: Via API (Recomendado)

1. Abra o terminal/PowerShell
2. Execute o comando (substitua os valores):

```bash
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=SEU_APP_SECRET&access_token=SEU_TOKEN_CURTO"
```

**Onde encontrar:**
- `SEU_APP_SECRET`: No painel do app → Settings → Basic → App Secret (clique em "Show")
- `SEU_TOKEN_CURTO`: O token que você copiou no passo 4

3. O retorno será algo como:
```json
{
  "access_token": "IGxxxxxxxxxxxxxxx",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

4. **Copie este novo `access_token`** - ele dura 60 dias!

#### Método 2: Via Interface Web

1. Acesse a ferramenta: [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
2. Cole o token de curta duração
3. Clique em **"Extend Access Token"**
4. Copie o novo token de longa duração

### ✅ Passo 7: Configurar no Projeto

1. Abra o arquivo `.env.local` no projeto
2. Adicione a linha:
   ```bash
   INSTAGRAM_ACCESS_TOKEN=SEU_TOKEN_DE_LONGA_DURACAO_AQUI
   ```

### ✅ Passo 8: Renovar Token Automaticamente (Opcional)

O token de longa duração expira em 60 dias. Para renovar automaticamente, o projeto já tem uma rota:

**Agendar renovação manual:**
1. Acesse: `http://localhost:3000/api/instagram/refresh-token`
2. Faça isso a cada 30-45 dias para manter o token sempre válido

**Ou configure um cron job** para chamar a URL automaticamente.

---

## 📝 Como Vincular Instagram à Página do Facebook

Se você ainda não vinculou sua conta do Instagram a uma Página do Facebook:

1. Acesse [Meta Business Suite](https://business.facebook.com/)
2. Vá em **"Configurações"**
3. Clique em **"Contas do Instagram"**
4. Clique em **"Conectar conta"**
5. Faça login na conta do Instagram que deseja conectar
6. Autorize a conexão

---

## 🎯 Testando a API

Após configurar tudo:

1. **Reinicie o servidor Next.js**:
   ```bash
   npm run dev
   ```

2. **Teste a API diretamente**:
   ```bash
   http://localhost:3000/api/instagram
   ```

3. **Acesse a home do site** - os posts devem aparecer na seção "Notícias"

---

## ⚠️ Troubleshooting

### Erro: "Instagram não configurado"
- Verifique se adicionou `INSTAGRAM_ACCESS_TOKEN` no `.env.local`
- Reinicie o servidor Next.js

### Erro: "Invalid OAuth access token"
- O token expirou (tokens de curta duração duram 1 hora)
- Gere um token de **longa duração** (60 dias) usando o Passo 5

### Erro: "Permissions error"
- Sua conta do Instagram não é Profissional/Business
- Vá em: Instagram App → Configurações → Conta → Mudar tipo de conta

### Nenhum post encontrado
- Verifique se há posts com "pokenight" na legenda
- A API filtra posts que mencionam "pokenight" ou "poke night"
- Tente criar um post de teste no Instagram

### Erro: "Instagram account not linked to Facebook page"
- Siga a seção "Como Vincular Instagram à Página do Facebook"
- Sua conta do Instagram DEVE estar vinculada a uma página do Facebook

---

## 🔒 Segurança

**IMPORTANTE:**
- ❌ Nunca commite o arquivo `.env.local` no Git
- ❌ Nunca exponha seu `INSTAGRAM_ACCESS_TOKEN` publicamente
- ✅ O token só é usado no servidor (server-side)
- ✅ Renove o token a cada 60 dias para manter ativo
- ✅ O arquivo `.env.local` está no `.gitignore` por padrão

---

## 📚 Recursos Úteis

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Get Started Guide](https://developers.facebook.com/docs/instagram-api/getting-started)
- [Access Tokens](https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens)
- [Meta for Developers](https://developers.facebook.com/)
- [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

---

## 🔄 Resumo do Fluxo

```
1. Criar App no Meta Developers
   ↓
2. Adicionar Instagram Graph API
   ↓
3. Conectar Conta do Instagram (Business)
   ↓
4. Vincular Instagram à Página Facebook
   ↓
5. Gerar Token de Curta Duração (1h)
   ↓
6. Converter para Token de Longa Duração (60 dias)
   ↓
7. Adicionar token no .env.local
   ↓
8. Reiniciar servidor
   ↓
9. ✅ Posts aparecem automaticamente!
```

---

## 🎉 Alternativa: Método Simples (RSS Feed)

Se você achar muito complicado configurar a API oficial, existe uma alternativa mais simples usando RSS Feed:

### Passo 1: Criar RSS Feed
1. Acesse [RSS.app](https://rss.app/) ou [InstaFeed](https://instafeed.me/)
2. Crie uma conta gratuita
3. Adicione o username do Instagram
4. Copie a URL do feed JSON gerado

### Passo 2: Configurar
Adicione no `.env.local`:
```bash
INSTAGRAM_RSS_URL=https://rss.app/feeds/seu-feed-id.json
```

**Vantagens:**
- ✅ Mais simples
- ✅ Não expira
- ✅ Não precisa de Facebook App

**Desvantagens:**
- ❌ Dependente de serviço terceiro
- ❌ Pode ter delay na atualização
- ❌ Limitações do plano gratuito

---

✅ **Após configurar, sua home exibirá automaticamente os posts do Instagram com "pokenight" na legenda!**
