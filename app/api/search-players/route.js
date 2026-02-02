import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'poke'
};

export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: true, players: [] },
        { status: 200 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar apenas personagens (players) que contenham o termo de busca
    const [players] = await connection.execute(
      `SELECT 
        p.id,
        p.name,
        p.level,
        p.vocation
      FROM players p
      WHERE p.name LIKE ?
      ORDER BY p.level DESC
      LIMIT 10`,
      [`%${query}%`]
    );

    await connection.end();

    // Retornar apenas players
    const results = players.map(player => ({
      name: player.name,
      level: player.level,
      vocation: player.vocation,
      type: 'player',
      subtitle: `Level ${player.level}`
    }));

    return NextResponse.json(
      { 
        success: true,
        players: results
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar jogadores:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar jogadores.' },
      { status: 500 }
    );
  }
}
