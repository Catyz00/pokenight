import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { createDbConnection } from '@/lib/db-config'

/**
 * GET /api/achievements
 * 
 * Retorna as conquistas recentes dos jogadores
 * 
 * TODO: Criar tabela no banco de dados:
 * 
 * CREATE TABLE player_achievements (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   player_id INT NOT NULL,
 *   player_name VARCHAR(255) NOT NULL,
 *   achievement_id INT NOT NULL,
 *   achievement_name VARCHAR(255) NOT NULL,
 *   achievement_description TEXT,
 *   icon VARCHAR(50) DEFAULT 'trophy',
 *   rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
 *   INDEX idx_created_at (created_at DESC)
 * );
 */

export async function GET(request) {
  // TODO: Descomentar quando a tabela existir
  /*
  let connection = null
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    
    connection = await createDbConnection(mysql)
    
    // Buscar conquistas recentes com informações do jogador
    const [achievements] = await connection.execute(
      `SELECT 
        pa.id,
        pa.player_name as playerName,
        pa.achievement_name as achievement,
        pa.icon,
        pa.rarity,
        CASE 
          WHEN TIMESTAMPDIFF(SECOND, pa.created_at, NOW()) < 60 
            THEN 'Agora mesmo'
          WHEN TIMESTAMPDIFF(MINUTE, pa.created_at, NOW()) < 60 
            THEN CONCAT(TIMESTAMPDIFF(MINUTE, pa.created_at, NOW()), ' minutos atrás')
          WHEN TIMESTAMPDIFF(HOUR, pa.created_at, NOW()) < 24 
            THEN CONCAT(TIMESTAMPDIFF(HOUR, pa.created_at, NOW()), ' horas atrás')
          ELSE CONCAT(TIMESTAMPDIFF(DAY, pa.created_at, NOW()), ' dias atrás')
        END as time,
        pa.created_at
      FROM player_achievements pa
      ORDER BY pa.created_at DESC
      LIMIT ?`,
      [limit]
    )
    
    await connection.end()
    
    return NextResponse.json({ 
      success: true, 
      achievements,
      count: achievements.length 
    })
    
  } catch (error) {
    if (connection) {
      try { await connection.end() } catch {}
    }
    
    console.error('❌ Erro ao buscar conquistas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conquistas', details: error.message },
      { status: 500 }
    )
  }
  */

  // Dados mockados temporários
  return NextResponse.json({
    success: true,
    message: 'API de conquistas ainda não implementada. Usando dados mockados.',
    achievements: [
      {
        id: 1,
        playerName: 'Ash',
        achievement: 'Capturou seu primeiro Legendary',
        icon: 'crown',
        time: '2 minutos atrás',
        rarity: 'legendary'
      },
      {
        id: 2,
        playerName: 'Misty',
        achievement: 'Completou a Pokédex da Região Kanto',
        icon: 'trophy',
        time: '5 minutos atrás',
        rarity: 'epic'
      },
      {
        id: 3,
        playerName: 'Brock',
        achievement: 'Derrotou o Elite Four',
        icon: 'award',
        time: '8 minutos atrás',
        rarity: 'rare'
      },
    ],
    todo: [
      '1. Criar tabela player_achievements no banco',
      '2. Descomentar código SQL acima',
      '3. Implementar sistema de conquistas no servidor',
      '4. Atualizar componente para usar a API real'
    ]
  })
}
