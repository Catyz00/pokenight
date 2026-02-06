# Configuração do Google reCAPTCHA v3

## O que é reCAPTCHA v3?

O reCAPTCHA v3 é uma ferramenta de segurança do Google que protege seu site contra bots e spam sem interromper a experiência do usuário. Diferente do v2 (checkbox "Não sou um robô"), o v3 funciona **invisível** e retorna um score de 0.0 a 1.0 indicando a probabilidade de ser humano.

## Como Obter as Chaves

1. **Acesse o Google reCAPTCHA Admin Console**
   - URL: https://www.google.com/recaptcha/admin

2. **Faça login** com sua conta Google

3. **Registre um novo site**
   - Clique em `+` (Adicionar site)
   - Preencha os dados:
     - **Label**: Nome do seu projeto (ex: "PokeNight")
     - **reCAPTCHA type**: Selecione `reCAPTCHA v3`
     - **Domains**: Adicione seus domínios
       - Em desenvolvimento: `localhost`
       - Em produção: `seu-dominio.com.br`
     - **Owners**: Seu email Google
     - Aceite os Termos de Serviço

4. **Copie as chaves geradas**
   - **Site Key**: Chave pública (exposta no cliente)
   - **Secret Key**: Chave privada (apenas server-side)

## Configuração no Projeto

### 1. Adicione as chaves no `.env.local`

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **IMPORTANTE**: 
- Use `NEXT_PUBLIC_` para a Site Key (necessária no cliente)
- NÃO use `NEXT_PUBLIC_` para a Secret Key (apenas server-side)

### 2. Configuração já implementada

✅ O projeto já está configurado com reCAPTCHA:
- Script carregado no `app/layout.jsx`
- Validação implementada no `app/auth/login/page.jsx`
- Verificação server-side em `app/api/auth/login/route.js`

## Como Funciona

### Cliente (Frontend)
1. Usuário preenche o formulário de login
2. Ao submeter, o reCAPTCHA executa em background
3. Gera um token único
4. Token é enviado junto com username/password

### Servidor (Backend)
1. Recebe username, password e recaptchaToken
2. Envia token para Google verificar
3. Google retorna score (0.0 a 1.0)
4. Se score >= 0.5, permite login
5. Se score < 0.5, bloqueia (provável bot)

## Score do reCAPTCHA

| Score | Interpretação | Ação |
|-------|---------------|------|
| 1.0   | Muito provável humano | ✅ Permitir |
| 0.9   | Provável humano | ✅ Permitir |
| 0.7   | Humano | ✅ Permitir |
| 0.5   | Suspeito | ⚠️ Limite mínimo |
| 0.3   | Provável bot | ❌ Bloquear |
| 0.0   | Muito provável bot | ❌ Bloquear |

**Configuração atual**: Score mínimo de **0.5**

## Testando o reCAPTCHA

### Desenvolvimento (localhost)
1. Execute o projeto: `npm run dev`
2. Acesse: http://localhost:3000/auth/login
3. Faça login normalmente
4. Verifique o console do servidor para ver o score

### Verificando no Console
```bash
# Terminal do servidor mostrará:
🔒 reCAPTCHA Score: 0.9
✅ Login bem-sucedido
```

### Teste com Bot (Opcional)
Para testar o bloqueio de bots, use ferramentas como:
- cURL/Postman sem token reCAPTCHA
- Automação de navegador sem execução de JavaScript

## Domínios para Produção

Quando publicar em produção, adicione seus domínios no Google reCAPTCHA Admin:

1. Acesse https://www.google.com/recaptcha/admin
2. Clique no seu site registrado
3. Em "Settings" > "Domains", adicione:
   - `seu-dominio.com.br`
   - `www.seu-dominio.com.br`

## Troubleshooting

### Erro: "Missing required parameter: sitekey"
- Verifique se `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` está no `.env.local`
- Reinicie o servidor: `npm run dev`

### Erro: "Invalid site key"
- Confirme se copiou a Site Key correta do Google
- Verifique se o domínio está registrado no reCAPTCHA Admin

### Erro: "Timeout or duplicate"
- Token reCAPTCHA expira em 2 minutos
- Gere um novo token a cada submit

### Score sempre 0.1
- Pode ser navegação privada/incognito
- VPN/Proxy pode reduzir o score
- Muitas tentativas seguidas baixam o score

## Monitoramento

Acesse o painel do reCAPTCHA para ver estatísticas:
- https://www.google.com/recaptcha/admin
- Requests por dia
- Score distribution
- Blocked requests

## Recursos Adicionais

- Documentação oficial: https://developers.google.com/recaptcha/docs/v3
- FAQ: https://developers.google.com/recaptcha/docs/faq
- Best practices: https://cloud.google.com/recaptcha-enterprise/docs/best-practices

## Segurança

⚠️ **Nunca exponha sua Secret Key**:
- ❌ Não comite no Git
- ❌ Não use no código cliente
- ✅ Use apenas em variáveis de ambiente server-side
- ✅ Adicione `.env*.local` no `.gitignore`

---

**Status**: ✅ reCAPTCHA v3 configurado e funcionando no formulário de login
