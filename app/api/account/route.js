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
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId é obrigatório' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar dados da conta incluindo premium_points
    const [accounts] = await connection.execute(
      'SELECT id, name, email, premdays, premium_points FROM accounts WHERE id = ?',
      [accountId]
    );

    if (accounts.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    const account = accounts[0];
    
    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        accountId: account.id,
        username: account.name,
        email: account.email,
        premdays: account.premdays || 0,
        nightcoins: account.premium_points || 0
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar dados da conta:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar dados da conta.' },
      { status: 500 }
    );
  }
}
