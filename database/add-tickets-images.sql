-- Adicionar campo de imagens na tabela tickets
ALTER TABLE `tickets` 
ADD COLUMN `images` TEXT DEFAULT NULL COMMENT 'URLs das imagens anexadas, separadas por vírgula'
AFTER `message`;
