-- ====================================
-- SETUP DA TABELA TICKETS
-- Execute este SQL no banco 'poke' do phpMyAdmin
-- ====================================

USE `poke`;

-- Criar tabela tickets se não existir
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `images` text DEFAULT NULL COMMENT 'URLs das imagens anexadas, separadas por vírgula',
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

-- Se a tabela já existir sem a coluna 'images', adicionar ela
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'poke' 
  AND TABLE_NAME = 'tickets' 
  AND COLUMN_NAME = 'images'
);

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE `tickets` ADD COLUMN `images` TEXT DEFAULT NULL COMMENT "URLs das imagens anexadas, separadas por vírgula" AFTER `message`',
  'SELECT "Coluna images já existe" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar resultado
SELECT 'Tabela tickets configurada com sucesso!' AS status;
DESCRIBE `tickets`;
