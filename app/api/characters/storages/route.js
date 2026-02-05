import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { createDbConnection } from '@/lib/db-config'

// GET /api/characters/storages?character=NomeDoChar
export async function GET(request) {
  let connection = null
  try {
    const { searchParams } = new URL(request.url)
    const character = searchParams.get('character')
    if (!character) {
      return NextResponse.json({ error: 'Nome do personagem é obrigatório' }, { status: 400 })
    }
    
    connection = await createDbConnection(mysql)
    
    // Buscar id do personagem
    const [players] = await connection.execute(
      'SELECT id FROM players WHERE name = ?',
      [character]
    )
    if (players.length === 0) {
      await connection.end()
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 })
    }
    const playerId = players[0].id
    // Buscar todas as storages do personagem
    const [storages] = await connection.execute(
      'SELECT key, value FROM player_storage WHERE player_id = ?',
      [playerId]
    )
    await connection.end()
    // Retornar como objeto { storageid: value }
    const storageMap = {}
    for (const s of storages) {
      storageMap[s.key] = s.value
    }
    return NextResponse.json({ success: true, storages: storageMap })
  } catch (error) {
    if (connection) try { await connection.end() } catch {}
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
