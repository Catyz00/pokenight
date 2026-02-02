import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'poke'
};

export async function GET(request, context) {
  let connection;

  try {
    const { name } = await context.params;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome do personagem é obrigatório' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar dados do personagem
    const [players] = await connection.execute(
      `SELECT 
        p.id,
        p.name,
        p.level,
        p.vocation,
        p.lastlogin,
        p.town_id
      FROM players p
      WHERE p.name = ?`,
      [name]
    );

    if (players.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Personagem não encontrado' },
        { status: 404 }
      );
    }

    const player = players[0];

    // Buscar casa do personagem
    let house = null;
    try {
      const [houses] = await connection.execute(
        `SELECT 
          h.id,
          h.name as house_name,
          h.town_id
        FROM houses h
        WHERE h.owner = ?`,
        [player.id]
      );
      if (houses.length > 0) {
        house = houses[0];
      }
    } catch (error) {
      console.log('⚠️ Tabela houses não encontrada ou erro:', error.message);
    }

    // Buscar quests completadas do personagem
    let quests = [];
    try {
      const [questsResult] = await connection.execute(
        `SELECT 
          ps.key as quest_key,
          ps.value
        FROM player_storage ps
        WHERE ps.player_id = ? 
        AND ps.key BETWEEN 10000 AND 20000
        ORDER BY ps.key
        LIMIT 100`,
        [player.id]
      );
      quests = questsResult;
    } catch (error) {
      console.log('⚠️ Tabela player_storage não encontrada ou erro:', error.message);
    }

    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        player: {
          id: player.id,
          name: player.name,
          level: player.level,
          vocation: player.vocation,
          lastLogin: player.lastlogin,
          townId: player.town_id
        },
        house: house ? {
          id: house.id,
          name: house.house_name,
          townId: house.town_id
        } : null,
        quests: quests.map(q => ({
          questName: `Quest ${q.quest_key}`,
          progress: q.value
        }))
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar personagem:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar personagem.' },
      { status: 500 }
    );
  }
}
