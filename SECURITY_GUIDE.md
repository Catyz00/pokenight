# 🔒 Guia de Segurança: Variáveis de Ambiente

## ⚠️ CRÍTICO: Entenda a Diferença!

### 🌍 Variáveis PÚBLICAS (Client-Side)
**Prefixo: `NEXT_PUBLIC_`**

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_PAYMENT_API_URL=https://seu-dominio.com/api
```

✅ **Podem ser usadas:**
- No browser (client components)
- Em componentes React
- Em JavaScript do cliente

❌ **SÃO EXPOSTAS:**
- Qualquer pessoa pode ver no código fonte
- Aparecem no bundle JavaScript
- Visíveis no DevTools do navegador

💡 **Use para:**
- URLs públicas
- IDs de serviços públicos (ex: Twitch Client ID)
- Configurações não-sensíveis

---

### 🔐 Variáveis PRIVADAS (Server-Side)
**SEM prefixo `NEXT_PUBLIC_`**

```env
BACKEND_URL=http://localhost
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=sua-senha-secreta
TWITCH_CLIENT_SECRET=seu-secret
```

✅ **Podem ser usadas:**
- Apenas em API Routes (`/app/api/*`)
- Server Components
- Server-side code

❌ **NUNCA acessíveis:**
- No browser
- Em Client Components
- No código JavaScript do cliente

💡 **Use para:**
- Senhas de banco de dados
- API secrets
- Credenciais sensíveis
- URLs internas

---

## 📚 Exemplos Práticos

### ❌ ERRADO - Credenciais Expostas

```javascript
// ❌ NÃO FAÇA ISSO!
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'minha-senha',  // 🚨 EXPOSTO!
  database: 'poke',
})
```

### ✅ CORRETO - Usando Variáveis de Ambiente

```javascript
// ✅ FAÇA ISSO!
import { createDbConnection } from '@/lib/db-config'
import mysql from 'mysql2/promise'

const connection = await createDbConnection(mysql)
// Credenciais vêm do .env.local (seguro!)
```

---

## 🔍 Como Verificar Exposição

### Teste 1: DevTools do Navegador

1. Abra o site no navegador
2. Pressione `F12` (DevTools)
3. Vá em **Console**
4. Digite: `console.log(process.env)`

**Resultado esperado:**
- Apenas variáveis com `NEXT_PUBLIC_` devem aparecer
- Se aparecer `DATABASE_PASSWORD` ou similar: **🚨 PROBLEMA!**

### Teste 2: View Source

1. Clique direito na página → "View Page Source"
2. Procure por `Ctrl+F`: `DATABASE_`, `PASSWORD`, `SECRET`

**Resultado esperado:**
- ❌ Não deve aparecer nenhuma credencial
- ✅ URLs públicas podem aparecer

---

## 🛡️ Boas Práticas de Segurança

### 1. Nunca Hardcode Credenciais

```javascript
// ❌ ERRADO
const password = 'minha-senha-123'

// ✅ CERTO
const password = process.env.DATABASE_PASSWORD
```

### 2. Use .env.local (Não Commitado)

```bash
# ✅ Arquivo .env.local (no .gitignore)
DATABASE_PASSWORD=senha-real-aqui

# ✅ Arquivo .env.example (commitado)
DATABASE_PASSWORD=SUA-SENHA-AQUI
```

### 3. Diferentes Valores por Ambiente

```env
# .env.local (desenvolvimento)
DATABASE_HOST=localhost
DATABASE_PASSWORD=

# Produção (Vercel/servidor)
DATABASE_HOST=db.exemplo.com
DATABASE_PASSWORD=senha-super-segura-1234!@#$
```

### 4. Validação de Variáveis

```javascript
// ✅ Valide se as variáveis existem
if (!process.env.DATABASE_HOST) {
  throw new Error('DATABASE_HOST não configurado!')
}
```

---

## 🎯 Arquivos de Configuração

### `lib/db-config.js` - Configuração do Banco

```javascript
export const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'poke',
}

export async function createDbConnection(mysql) {
  return await mysql.createConnection(dbConfig)
}
```

**Uso:**
```javascript
// ✅ Em API Route
import { createDbConnection } from '@/lib/db-config'
const conn = await createDbConnection(mysql)
```

---

## 🚨 O Que NUNCA Fazer

### ❌ 1. Expor Senhas no Código

```javascript
// 🚨 NUNCA FAÇA ISSO!
const db = {
  password: 'senha123',
  apiKey: 'abc123xyz',
}
```

### ❌ 2. Usar NEXT_PUBLIC_ em Credenciais

```env
# 🚨 NUNCA FAÇA ISSO!
NEXT_PUBLIC_DATABASE_PASSWORD=senha123
NEXT_PUBLIC_API_SECRET=secret123
```

### ❌ 3. Commitar .env.local

```bash
# 🚨 NUNCA FAÇA ISSO!
git add .env.local
git commit -m "add env"
```

### ❌ 4. Logar Credenciais

```javascript
// 🚨 NUNCA FAÇA ISSO!
console.log('Password:', process.env.DATABASE_PASSWORD)
console.log('API Key:', apiKey)
```

---

## ✅ Checklist de Segurança

Antes de fazer deploy:

- [ ] Todas as senhas estão em variáveis de ambiente
- [ ] Nenhuma credencial está hardcoded no código
- [ ] `.env.local` está no `.gitignore`
- [ ] `.env.example` está atualizado (sem valores reais)
- [ ] Variáveis sensíveis NÃO têm prefixo `NEXT_PUBLIC_`
- [ ] Testei no DevTools (F12) - sem credenciais expostas
- [ ] View Source não mostra senhas
- [ ] Configurei variáveis no provedor (Vercel, etc.)
- [ ] Usei senhas fortes em produção
- [ ] SSL/HTTPS ativado em produção

---

## 🔗 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OWASP - Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**🛡️ Lembre-se: A segurança começa no código!**

Se você encontrou credenciais expostas no código, corrija imediatamente e:
1. Mude todas as senhas
2. Revogue todas as chaves de API
3. Gere novas credenciais
4. Atualize as variáveis de ambiente

**Última atualização**: 04/02/2026
