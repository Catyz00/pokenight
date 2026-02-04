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
    connection = await mysql.createConnection(dbConfig);

    // Buscar todas as casas com informações do dono
    const [houses] = await connection.execute(
      `SELECT 
        h.id,
        h.name,
        h.town,
        h.size,
        h.price,
        h.rent,
        h.doors,
        h.beds,
        h.tiles,
        h.owner,
        p.name as owner_name
      FROM houses h
      LEFT JOIN players p ON h.owner = p.id
      ORDER BY h.town ASC, h.name ASC`
    );

    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        houses: houses
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar casas:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar casas.' },
      { status: 500 }
    );
  }
}
