# 📸 Opções Gratuitas para Feed do Instagram

## ⚠️ Problema
O RSS.app tem limite no plano gratuito e pode ser pago após certo uso.

## ✅ Soluções Gratuitas

### **Opção 1: Posts de Exemplo (Atual - 100% Gratuito)**
- ✅ **Status:** Já configurado e funcionando
- ✅ **Custo:** Totalmente gratuito
- ✅ **Manutenção:** Você edita os posts manualmente no código
- ✅ **Vantagem:** Controle total sobre o conteúdo

**Como atualizar os posts:**
1. Abra `app/api/instagram/route.js`
2. Encontre a função `getExamplePosts()`
3. Edite os posts com seu conteúdo real do Instagram
4. Salve e reinicie o servidor

---

### **Opção 2: Instagram Official API (Gratuito mas Complexo)**
- 💰 **Custo:** Gratuito
- ⚠️ **Complexidade:** Alta - requer Facebook Business
- 📋 **Requisitos:**
  - Conta Instagram Business
  - Página do Facebook vinculada
  - App no Facebook Developers
  - Token de acesso (expira a cada 60 dias)

**Passos para configurar:**
Veja o arquivo `INSTAGRAM_SETUP.md` para instruções completas.

---

### **Opção 3: Insta-RSS (Alternativa Gratuita)**
- 💰 **Custo:** Gratuito
- ✅ **Facilidade:** Média
- 🔗 **URL:** https://insta-rss.com/

**Como usar:**
1. Acesse https://insta-rss.com/
2. Digite o username: `pokenightofc`
3. Copie a URL do feed RSS gerada
4. Cole no `.env.local`:
   ```bash
   INSTAGRAM_RSS_URL=https://insta-rss.com/feed/pokenightofc
   ```

---

### **Opção 4: RSS Bridge (Self-Hosted - 100% Gratuito)**
- 💰 **Custo:** Gratuito
- ⚠️ **Complexidade:** Alta - requer servidor próprio
- 🔗 **GitHub:** https://github.com/RSS-Bridge/rss-bridge

**Para usar:**
1. Instale RSS Bridge no seu servidor
2. Configure o Instagram Bridge
3. Use a URL gerada no `.env.local`

---

### **Opção 5: Picuki (Web Scraping - Arriscado)**
- 💰 **Custo:** Gratuito
- ⚠️ **Risco:** Instagram pode bloquear
- ⚠️ **Legalidade:** Zona cinzenta

**Não recomendado** pois viola os termos de uso do Instagram.

---

## 🎯 Recomendação

### Para Desenvolvimento/Testes:
**Use a Opção 1 (Posts de Exemplo)** - Já está funcionando!

### Para Produção:
1. **Melhor:** Opção 2 (API Oficial) - Mais confiável e legal
2. **Alternativa:** Opção 3 (Insta-RSS) - Simples e gratuito
3. **Fallback:** Continue com Posts de Exemplo atualizados manualmente

---

## 📝 Status Atual

✅ **Configuração Atual:** Posts de Exemplo (100% Gratuito)
- 6 posts com descrições completas
- Imagens de Pokémon do `/public/pokemon/`
- Links para o Instagram oficial
- Atualização manual quando necessário

---

## 🔄 Como Trocar de Método

### Mudar para Insta-RSS:
```bash
# .env.local
INSTAGRAM_RSS_URL=https://insta-rss.com/feed/pokenightofc
# INSTAGRAM_USERNAME=pokenightofc  # Comente esta linha
```

### Mudar para API Oficial:
```bash
# .env.local
INSTAGRAM_ACCESS_TOKEN=seu_token_aqui
# INSTAGRAM_USERNAME=pokenightofc  # Comente esta linha
```

### Voltar para Posts de Exemplo:
```bash
# .env.local
INSTAGRAM_USERNAME=pokenightofc
# INSTAGRAM_RSS_URL=...  # Comente outras linhas
```

---

## 💡 Dica

Os posts de exemplo já incluem o texto completo que você mencionou:
> "🚨🔥 O PokeNight TÁ DE VOLTA! 🔥🚨..."

Você pode editar esses posts diretamente no código e eles funcionarão perfeitamente sem custo algum! 🎮
