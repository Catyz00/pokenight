-- Execute este SQL no banco de dados 'poke' no phpMyAdmin
-- Copie e cole todo este código na aba SQL e clique em "Executar"

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `images` text DEFAULT NULL,
  `category` enum('reclamacao','ajuda','sugestao','bug','outro') NOT NULL DEFAULT 'ajuda',
  `status` enum('aberto','em_andamento','resolvido','fechado') NOT NULL DEFAULT 'aberto',
  `priority` enum('baixa','media','alta','urgente') NOT NULL DEFAULT 'media',
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
