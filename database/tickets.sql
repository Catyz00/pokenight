-- Tabela para gerenciar tickets de suporte dos jogadores
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `category` enum('reclamacao', 'ajuda', 'sugestao', 'bug', 'outro') NOT NULL DEFAULT 'ajuda',
  `status` enum('aberto', 'em_andamento', 'resolvido', 'fechado') NOT NULL DEFAULT 'aberto',
  `priority` enum('baixa', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
  `response` text DEFAULT NULL,
  `responded_by` int(11) DEFAULT NULL,
  `responded_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `category` (`category`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela para gerenciar torneios e eventos
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` enum('torneio', 'evento', 'competicao', 'seasonal') NOT NULL DEFAULT 'evento',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `entry_fee` int(11) DEFAULT 0,
  `prize_pool` text DEFAULT NULL,
  `rules` text DEFAULT NULL,
  `status` enum('planejado', 'inscricoes_abertas', 'em_andamento', 'finalizado', 'cancelado') NOT NULL DEFAULT 'planejado',
  `image_url` varchar(500) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `start_date` (`start_date`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela para participantes dos torneios
CREATE TABLE IF NOT EXISTS `tournament_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tournament_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `player_name` varchar(255) NOT NULL,
  `registered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `placement` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `player_id` (`player_id`),
  UNIQUE KEY `tournament_player` (`tournament_id`, `player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela para gerenciar mapas do jogo
CREATE TABLE IF NOT EXISTS `game_maps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `map_type` enum('cidade', 'rota', 'caverna', 'floresta', 'especial', 'outro') NOT NULL DEFAULT 'outro',
  `level_requirement` int(11) DEFAULT 0,
  `coordinates_x` int(11) DEFAULT NULL,
  `coordinates_y` int(11) DEFAULT NULL,
  `coordinates_z` int(11) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `available_pokemon` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `map_type` (`map_type`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela para registrar compras de NightCoins (relatórios)
CREATE TABLE IF NOT EXISTS `coin_purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('pendente', 'aprovado', 'recusado', 'cancelado') NOT NULL DEFAULT 'pendente',
  `purchased_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `purchased_at` (`purchased_at`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
