# Sistema Administrativo - Painel Completo

## 📋 Resumo

Foi criado um painel administrativo completo com as seguintes funcionalidades:

1. **Sistema de Tickets de Suporte**
2. **Gerenciamento de Torneios e Eventos**
3. **Gerenciamento de Mapas do Jogo**
4. **Relatórios Financeiros (NightCoins)**
5. **Dashboard com Gráficos e Estatísticas**

## 🔐 Controle de Acesso

- **Apenas usuários com `group_id = 6`** na tabela `players` podem acessar o painel admin
- Verificação implementada em `/app/admin/layout.jsx`

## 📁 Estrutura de Arquivos Criados

### 1. Database Schema
```
database/tickets.sql
```
Contém todas as tabelas necessárias:
- `tickets` - Sistema de tickets de suporte
- `tournaments` - Gerenciamento de torneios/eventos
- `tournament_participants` - Participantes dos torneios
- `game_maps` - Mapas do jogo
- `coin_purchases` - Registro de compras de NightCoins

### 2. APIs Criadas

#### Tickets (Área Pública)
- **POST** `/api/tickets` - Criar ticket
- **GET** `/api/tickets?userId={id}` - Listar tickets do usuário
- **GET** `/api/tickets/[id]` - Ver detalhes de um ticket

#### Tickets (Admin)
- **GET** `/api/admin/tickets` - Listar todos os tickets (com filtros)
- **POST** `/api/admin/tickets/[id]` - Responder ticket
- **PATCH** `/api/admin/tickets/[id]` - Atualizar status/prioridade
- **DELETE** `/api/admin/tickets/[id]` - Deletar ticket

#### Torneios (Admin)
- **GET** `/api/admin/tournaments` - Listar torneios
- **POST** `/api/admin/tournaments` - Criar torneio
- **GET** `/api/admin/tournaments/[id]` - Ver torneio específico
- **PATCH** `/api/admin/tournaments/[id]` - Atualizar torneio
- **DELETE** `/api/admin/tournaments/[id]` - Deletar torneio

#### Mapas (Admin)
- **GET** `/api/admin/maps` - Listar mapas
- **POST** `/api/admin/maps` - Criar mapa
- **PATCH** `/api/admin/maps/[id]` - Atualizar mapa
- **DELETE** `/api/admin/maps/[id]` - Deletar mapa

#### Relatórios (Admin)
- **GET** `/api/admin/reports/coins?period={week|month|year|all}` - Relatório de vendas de NightCoins

### 3. Páginas

#### Área Pública
- `/suporte` - Página de suporte com formulário de tickets

#### Área Admin
- `/admin` - Dashboard com gráficos e estatísticas
- `/admin/tickets` - Gerenciar tickets de suporte
- `/admin/torneios` - Gerenciar torneios e eventos
- `/admin/mapas` - Gerenciar mapas do jogo

### 4. Componentes Atualizados
- `components/admin/admin-sidebar.jsx` - Sidebar com novos links

## 🎯 Funcionalidades Detalhadas

### 1. Sistema de Tickets

**Para Jogadores (Área Pública):**
- Formulário em `/suporte` para criar tickets
- Categorias: Ajuda, Reclamação, Bug, Sugestão, Outro
- Visualização de tickets enviados (planejado para perfil)

**Para Admins:**
- Lista de todos os tickets com filtros por:
  - Status (Aberto, Em Andamento, Resolvido, Fechado)
  - Categoria
  - Prioridade (Baixa, Média, Alta, Urgente)
  - Busca por ID, assunto ou usuário
- Responder tickets
- Atualizar status e prioridade
- Deletar tickets
- Estatísticas em cards (total, abertos, em andamento, resolvidos, fechados)

### 2. Torneios e Eventos

**Funcionalidades:**
- Criar, editar e deletar torneios/eventos
- Tipos: Torneio, Evento, Competição, Sazonal
- Status: Planejado, Inscrições Abertas, Em Andamento, Finalizado, Cancelado
- Campos:
  - Título e descrição
  - Data de início e fim
  - Máximo de participantes
  - Taxa de inscrição
  - Premiação (JSON ou texto)
  - Regras
  - Imagem URL
- Visualização em cards com badges de status

### 3. Mapas do Jogo

**Funcionalidades:**
- Criar, editar e deletar mapas
- Tipos: Cidade, Rota, Caverna, Floresta, Especial, Outro
- Campos:
  - Nome e descrição
  - Tipo do mapa
  - Nível mínimo requerido
  - Coordenadas X, Y, Z
  - URL da imagem
  - Pokémon disponíveis (JSON ou texto)
  - Status (Ativo/Inativo)
- Visualização em cards com informações principais

### 4. Relatórios Financeiros (NightCoins)

**Dashboard Principal:**
- Cards com estatísticas da semana:
  - Receita total (em R$)
  - NightCoins vendidas (quantidade)
  - Total de transações
  - Top comprador
- Gráfico de barras simples mostrando vendas diárias dos últimos 7 dias

**API de Relatórios:**
- Filtragem por período (semana, mês, ano, todos)
- Estatísticas:
  - Total de compras
  - Compras aprovadas
  - Total de coins vendidas
  - Receita total
  - Valor médio por compra
- Vendas diárias (para gráficos)
- Top 10 compradores
- Últimas 20 transações

## 🗃️ Tabelas do Banco de Dados

### tickets
```sql
- id (PK)
- user_id
- username
- subject
- message
- category (enum: reclamacao, ajuda, sugestao, bug, outro)
- status (enum: aberto, em_andamento, resolvido, fechado)
- priority (enum: baixa, media, alta, urgente)
- response
- responded_by
- responded_at
- created_at
- updated_at
```

### tournaments
```sql
- id (PK)
- title
- description
- type (enum: torneio, evento, competicao, seasonal)
- start_date
- end_date
- max_participants
- entry_fee
- prize_pool (JSON)
- rules
- status (enum: planejado, inscricoes_abertas, em_andamento, finalizado, cancelado)
- image_url
- created_by
- created_at
- updated_at
```

### tournament_participants
```sql
- id (PK)
- tournament_id (FK)
- player_id
- player_name
- registered_at
- placement
- points
```

### game_maps
```sql
- id (PK)
- name
- description
- map_type (enum: cidade, rota, caverna, floresta, especial, outro)
- level_requirement
- coordinates_x
- coordinates_y
- coordinates_z
- image_url
- available_pokemon (JSON)
- is_active
- created_by
- created_at
- updated_at
```

### coin_purchases
```sql
- id (PK)
- user_id
- username
- amount
- price
- payment_method
- transaction_id
- status (enum: pendente, aprovado, recusado, cancelado)
- purchased_at
```

## 🚀 Como Usar

### 1. Executar SQL
Execute o arquivo `database/tickets.sql` no seu banco MariaDB para criar todas as tabelas necessárias.

### 2. Acessar Admin
- Faça login com uma conta que tenha `group_id = 6`
- Acesse `/admin` para ver o dashboard
- Use o menu lateral para navegar entre as funcionalidades

### 3. Sistema de Tickets
- **Jogadores:** Acessam `/suporte` e preenchem o formulário
- **Admins:** Acessam `/admin/tickets` para responder

### 4. Gerenciar Torneios
- Acesse `/admin/torneios`
- Clique em "Novo Torneio" para criar
- Use os botões de editar/deletar em cada card

### 5. Gerenciar Mapas
- Acesse `/admin/mapas`
- Clique em "Novo Mapa" para criar
- Edite ou delete mapas existentes

### 6. Ver Relatórios
- Dashboard principal (`/admin`) mostra automaticamente:
  - Estatísticas da semana
  - Gráfico de vendas diárias
  - Top comprador

## 📝 Notas Importantes

1. **Autenticação:** O sistema verifica se o usuário está logado e tem `group_id = 6`

2. **Validações:** Todas as APIs têm validações de campos obrigatórios

3. **Responsivo:** Todas as páginas são responsivas para mobile, tablet e desktop

4. **Estados de Loading:** Componentes mostram estados de carregamento

5. **Feedback Visual:** Alerts de sucesso/erro em todas as operações

6. **Filtros e Busca:** Sistema de tickets tem filtros avançados

7. **Dados do Usuário:** APIs usam `localStorage.getItem('user')` para pegar ID do admin

## 🎨 Componentes UI Utilizados

- Card, CardContent, CardHeader, CardTitle, CardDescription
- Button
- Badge
- Input, Textarea
- Label
- Alert, AlertDescription
- Dialog (para modals)
- Select (dropdown nativo)

## 🔄 Próximos Passos Sugeridos

1. Conectar dados reais do banco (substituir dados de exemplo)
2. Adicionar paginação nas listas
3. Adicionar exportação de relatórios (CSV/PDF)
4. Sistema de notificações para novos tickets
5. Upload de imagens para torneios e mapas
6. Histórico de ações dos admins
7. Permissões granulares por tipo de admin

## 🐛 Troubleshooting

Se encontrar erros:

1. Verifique se todas as tabelas foram criadas no banco
2. Confirme que `lib/db-config.js` está configurado corretamente
3. Verifique se o usuário tem `group_id = 6` no banco
4. Confira o console do navegador para erros de API
5. Verifique logs do servidor Next.js no terminal

---

**Desenvolvido para PokeNight** 🎮
Todas as funcionalidades foram implementadas com segurança e boas práticas em mente.
