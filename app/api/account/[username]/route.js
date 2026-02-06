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
    const { username } = await context.params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username é obrigatório' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar dados da conta
    const [accounts] = await connection.execute(
      `SELECT 
        id, 
        name,
        created,
        lastday,
        premdays,
        premium_points
      FROM accounts 
      WHERE name = ?`,
      [username]
    );

    if (accounts.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    const account = accounts[0];

    // Buscar personagens da conta
    const [players] = await connection.execute(
      `SELECT 
        p.id,
        p.name,
        p.level,
        p.vocation,
        p.lastlogin,
        p.town_id
      FROM players p
      WHERE p.account_id = ?
      ORDER BY p.level DESC`,
      [account.id]
    );

    // Buscar casas dos personagens
    let houses = [];
    try {
      const [housesResult] = await connection.execute(
        `SELECT 
          h.id,
          h.name as house_name,
          h.town_id,
          p.name as owner_name
        FROM houses h
        INNER JOIN players p ON p.id = h.owner
        WHERE p.account_id = ?`,
        [account.id]
      );
      houses = housesResult;
    } catch (error) {
      console.log('⚠️ Tabela houses não encontrada ou erro:', error.message);
    }

    // Buscar quests completadas (adaptado para o banco poke)
    let quests = [];
    try {
      const [questsResult] = await connection.execute(
        `SELECT 
          ps.player_id,
          ps.key as quest_key,
          ps.value,
          p.name as player_name
        FROM player_storage ps
        INNER JOIN players p ON p.id = ps.player_id
        WHERE p.account_id = ? 
        AND ps.key BETWEEN 10000 AND 20000
        ORDER BY ps.key
        LIMIT 100`,
        [account.id]
      );
      quests = questsResult;
    } catch (error) {
      console.log('⚠️ Tabela player_storage não encontrada ou erro:', error.message);
    }

    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        account: {
          id: account.id,
          username: account.name,
          createdAt: account.created,
          lastLogin: account.lastday,
          premdays: account.premdays || 0,
          nightcoins: account.premium_points || 0
        },
        characters: players.map(p => ({
          id: p.id,
          name: p.name,
          level: p.level,
          vocation: p.vocation,
          lastLogin: p.lastlogin,
          townId: p.town_id,
          guild: null,
          guildRank: null
        })),
        houses: houses.map(h => ({
          id: h.id,
          name: h.house_name,
          townId: h.town_id,
          owner: h.owner_name
        })),
        quests: quests.map(q => ({
          playerId: q.player_id,
          playerName: q.player_name,
          questName: `Quest ${q.quest_key}`,
          progress: q.value
        }))
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar perfil.' },
      { status: 500 }
    );
  }
}
