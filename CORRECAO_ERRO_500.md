# 🔧 Correção de Erro 500 - APIs Admin

## Problema Identificado
As APIs `/api/admin/maps` e `/api/admin/tournaments` estão retornando erro 500 porque as tabelas `game_maps` e `tournaments` podem não existir no banco de dados.

## ✅ Solução

### Passo 1: Verificar Banco de Dados
Abra o **phpMyAdmin** ou **HeidiSQL** e execute:

```sql
USE poke;
SHOW TABLES LIKE 'game_maps';
SHOW TABLES LIKE 'tournaments';
```

### Passo 2: Criar as Tabelas

Se as tabelas não existirem, execute o arquivo:
📄 `database/tickets.sql`

Ou execute os comandos individuais em:
📄 `database/verify-tables.sql`

### Passo 3: Verificar Estrutura

Após criar as tabelas, verifique se foram criadas corretamente:

```sql
DESCRIBE game_maps;
DESCRIBE tournaments;
```

### Passo 4: Reiniciar o Servidor

No terminal do VS Code:
```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
pnpm dev
```

## 🧪 Testar

Após reiniciar, teste:

1. Acesse: `http://localhost:3000/admin/mapas`
2. Clique em "Novo Mapa"
3. Preencha o formulário
4. Clique em "Salvar"

## 📋 Checklist

- [ ] Tabela `game_maps` existe
- [ ] Tabela `tournaments` existe
- [ ] Tabela `tickets` existe
- [ ] Servidor reiniciado
- [ ] Teste de adicionar mapa funcionando
- [ ] Teste de adicionar torneio funcionando

## 🔍 Debug

Se ainda der erro, verifique o console do navegador (F12) e veja a mensagem de erro completa. As APIs agora retornam detalhes do erro para facilitar o debug.

### Logs Disponíveis

As APIs agora mostram:
- `error`: Mensagem do erro
- `details`: Detalhes técnicos
- `stack`: Stack trace (apenas em desenvolvimento)

### Console do Terminal

Quando criar um mapa ou torneio, o terminal do Next.js mostrará:
```
Dados recebidos: { name: '...', description: '...', ... }
```

Se houver erro SQL, aparecerá:
```
Erro ao criar mapa: [mensagem de erro do MySQL]
```

## 📞 Suporte Adicional

Se o erro persistir, copie a mensagem completa do erro (do console F12) para análise mais detalhada.
