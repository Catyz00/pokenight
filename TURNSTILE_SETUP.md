# Configuração do Cloudflare Turnstile

## O que é Cloudflare Turnstile?

O Cloudflare Turnstile é a alternativa moderna e focada em privacidade ao reCAPTCHA. Ele protege seu site contra bots sem rastrear usuários ou usar cookies, respeitando a privacidade GDPR/LGPD.

**Vantagens sobre o reCAPTCHA:**
- ✅ **Sem rastreamento**: Não coleta dados pessoais
- ✅ **Sem cookies**: 100% em conformidade com GDPR/LGPD
- ✅ **Mais rápido**: Menor impacto no carregamento da página
- ✅ **Melhor UX**: Menos desafios visuais
- ✅ **Grátis**: Até 1 milhão de validações/mês

## Como Obter as Chaves

1. **Acesse o Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Ou direto: https://dash.cloudflare.com/?to=/:account/turnstile

2. **Faça login** com sua conta Cloudflare
   - Se não tem conta, crie uma gratuitamente

3. **Acesse Turnstile**
   - No menu lateral: **Turnstile**
   - Ou vá para: Websites > Turnstile

4. **Crie um novo site**
   - Clique em **Add Site**
   - Preencha os dados:
     - **Site name**: Nome do seu projeto (ex: "PokeNight Login")
     - **Domains**: Adicione seus domínios
       - Em desenvolvimento: `localhost`
       - Em produção: `seu-dominio.com.br`
     - **Widget Mode**: Selecione `Managed` (recomendado)
       - Managed: Cloudflare decide quando mostrar challenge
       - Non-Interactive: Sempre invisível
       - Invisible: Sem widget visível
     - **Pre-Clearance**: Deixe padrão

5. **Copie as chaves geradas**
   - **Site Key**: Chave pública (exposta no cliente)
   - **Secret Key**: Chave privada (apenas server-side)

## Configuração no Projeto

### 1. Adicione as chaves no `.env.local`

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAXXXXXXXXXXXXXXXXXXX
TURNSTILE_SECRET_KEY=0x4AAAAAAAXXXXXXXXXXXXXXXXXXX_XXXXXXXXXXX
```

⚠️ **IMPORTANTE**: 
- Use `NEXT_PUBLIC_` para a Site Key (necessária no cliente)
- NÃO use `NEXT_PUBLIC_` para a Secret Key (apenas server-side)

### 2. Configuração já implementada

✅ O projeto já está configurado com Turnstile:
- Script carregado no `app/layout.jsx`
- Widget renderizado no `app/auth/login/page.jsx`
- Verificação server-side em `app/api/auth/login/route.js`

## Como Funciona

### Cliente (Frontend)
1. Widget Turnstile é renderizado no formulário
2. Usuário completa o desafio (se necessário)
3. Turnstile gera um token único
4. Token é enviado junto com username/password

### Servidor (Backend)
1. Recebe username, password e turnstileToken
2. Envia token para Cloudflare verificar
3. Cloudflare retorna success: true/false
4. Se success: true, permite login
5. Se success: false, bloqueia

## Widget Modes

### Managed (Recomendado) ✅
- Cloudflare decide automaticamente quando mostrar challenge
- Usuários normais: Invisível
- Comportamento suspeito: Challenge visual
- **Melhor UX + Segurança**

### Non-Interactive
- Sempre invisível, sem interação
- Apenas análise passiva
- Menos seguro que Managed

### Invisible
- Completamente invisível
- Pode usar desafios programáticos

## Personalização

### Tema Escuro/Claro
```javascript
window.turnstile.render('#turnstile-widget', {
  sitekey: 'SUA_SITE_KEY',
  theme: 'dark', // ou 'light', 'auto'
  language: 'pt-BR',
})
```

### Tamanho do Widget
```javascript
{
  size: 'normal', // ou 'compact', 'flexible'
}
```

### Callbacks
```javascript
{
  callback: (token) => {
    console.log('✅ Token gerado:', token)
  },
  'error-callback': () => {
    console.error('❌ Erro no Turnstile')
  },
  'expired-callback': () => {
    console.warn('⚠️ Token expirado')
  },
}
```

## Testando o Turnstile

### Desenvolvimento (localhost)
1. Execute o projeto: `npm run dev`
2. Acesse: http://localhost:3000/auth/login
3. Veja o widget Turnstile aparecer
4. Faça login normalmente
5. Verifique o console do servidor

### Verificando no Console
```bash
# Terminal do servidor mostrará:
🔒 Cloudflare Turnstile: ✅ Verificado
✅ Login bem-sucedido
```

### Teste com Bot (Opcional)
Para testar o bloqueio:
- Use cURL/Postman sem token Turnstile
- Use token inválido ou expirado
- Automação sem executar JavaScript

## Domínios para Produção

Quando publicar em produção, adicione seus domínios no Cloudflare:

1. Acesse https://dash.cloudflare.com/?to=/:account/turnstile
2. Clique no seu site configurado
3. Em "Domains", adicione:
   - `seu-dominio.com.br`
   - `www.seu-dominio.com.br`
   - `*.seu-dominio.com.br` (se usar subdomínios)

## Troubleshooting

### Erro: "Turnstile is not defined"
- Verifique se o script está carregado no `layout.jsx`
- Aguarde o script carregar antes de renderizar
- Use `useEffect` para garantir que `window.turnstile` existe

### Erro: "Invalid site key"
- Confirme se copiou a Site Key correta do Cloudflare
- Verifique se o domínio está registrado no Turnstile

### Widget não aparece
- Verifique se `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está no `.env.local`
- Reinicie o servidor: `npm run dev`
- Verifique o console do navegador para erros

### Erro: "Verification failed"
- Token pode ter expirado (válido por 300 segundos)
- Secret Key incorreta no `.env.local`
- Domínio não autorizado no Cloudflare

### Widget em loop infinito
- Pode ser extensão de navegador bloqueando
- Desative ad-blockers temporariamente
- Teste em navegador anônimo

## Monitoramento

Acesse o painel do Turnstile para ver estatísticas:
- https://dash.cloudflare.com/?to=/:account/turnstile
- Requests por dia
- Taxa de sucesso
- Challenges mostrados
- Países de origem

## Limite Gratuito

**Plano Free do Cloudflare:**
- ✅ **1 milhão** de validações/mês
- ✅ Todos os recursos
- ✅ Sem limite de domínios
- ✅ Sem cobrança escondida

Se precisar de mais:
- Enterprise: Contato comercial

## Comparação: reCAPTCHA vs Turnstile

| Recurso | reCAPTCHA v3 | Turnstile |
|---------|--------------|-----------|
| **Privacidade** | ❌ Rastreia usuários | ✅ Sem rastreamento |
| **Cookies** | ❌ Usa cookies | ✅ Sem cookies |
| **GDPR/LGPD** | ⚠️ Requer consentimento | ✅ Compliant |
| **Performance** | ⚠️ Script pesado | ✅ Leve e rápido |
| **UX** | ❌ Desafios visuais frequentes | ✅ Invisível na maioria |
| **Custo** | ✅ Grátis | ✅ Grátis (1M/mês) |
| **Score** | ✅ 0.0-1.0 | ❌ Sim/Não |

## Recursos Adicionais

- Documentação oficial: https://developers.cloudflare.com/turnstile/
- API Reference: https://developers.cloudflare.com/turnstile/get-started/
- Widget customization: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- Best practices: https://blog.cloudflare.com/turnstile-ga

## Migração do reCAPTCHA

Se você estava usando reCAPTCHA antes:

### O que mudou:
1. ❌ Removido: `window.grecaptcha.execute()`
2. ✅ Adicionado: Widget Turnstile renderizado com ref
3. ✅ Token gerado automaticamente via callback
4. ✅ Verificação server-side simplificada

### Passos da migração:
1. Obteve chaves no Cloudflare ✅
2. Atualizou `.env.local` ✅
3. Script carregado no `layout.jsx` ✅
4. Widget renderizado no login ✅
5. API atualizada para verificar Turnstile ✅

## Segurança

⚠️ **Nunca exponha sua Secret Key**:
- ❌ Não comite no Git
- ❌ Não use no código cliente
- ✅ Use apenas em variáveis de ambiente server-side
- ✅ Adicione `.env*.local` no `.gitignore`

## Suporte

Se encontrar problemas:
1. Consulte a [documentação oficial](https://developers.cloudflare.com/turnstile/)
2. Verifique o [status do Cloudflare](https://www.cloudflarestatus.com/)
3. Entre em contato com suporte Enterprise (se aplicável)

---

**Status**: ✅ Cloudflare Turnstile configurado e funcionando no formulário de login
