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

    // Buscar contas (accounts) que contenham o termo de busca
    const [accounts] = await connection.execute(
      `SELECT 
        a.id,
        a.name,
        a.email,
        a.premium_points,
        a.premdays,
        COUNT(p.id) as character_count
      FROM accounts a
      LEFT JOIN players p ON p.account_id = a.id
      WHERE a.name LIKE ?
      GROUP BY a.id, a.name, a.email, a.premium_points, a.premdays
      ORDER BY a.name ASC
      LIMIT 10`,
      [`%${query}%`]
    );

    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        players: accounts.map(acc => ({
          name: acc.name,
          email: acc.email,
          nightcoins: acc.premium_points || 0,
          premdays: acc.premdays || 0,
          characterCount: acc.character_count,
          accountId: acc.id
        }))
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
