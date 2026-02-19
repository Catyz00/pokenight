-- Script para verificar e criar as tabelas necessárias
-- Execute este script no seu banco de dados MariaDB

-- Verificar se as tabelas existem
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'poke'
    AND TABLE_NAME IN ('game_maps', 'tournaments', 'tickets', 'tournament_participants', 'coin_purchases');

-- Se alguma tabela não existir, execute o script completo tickets.sql
-- Ou execute os comandos abaixo individualmente:

-- Tabela de mapas
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

-- Tabela de torneios
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

-- Verificar novamente
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'poke' AND TABLE_NAME IN ('game_maps', 'tournaments');
