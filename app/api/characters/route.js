import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET(request) {
  let connection = null

  try {
    // Pegar o username dos query params
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username é obrigatório' },
        { status: 400 }
      )
    }

    // Conectar ao banco
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'global',
    })

    console.log('✅ Buscando personagens do usuário:', username)

    // Buscar account_id pelo username
    const [accounts] = await connection.execute(
      'SELECT id FROM accounts WHERE name = ?',
      [username]
    )

    if (accounts.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    const accountId = accounts[0].id

    // Buscar personagens da conta
    const [players] = await connection.execute(
      'SELECT name, level, vocation, sex FROM players WHERE account_id = ?',
      [accountId]
    )

    await connection.end()

    // Mapear vocações
    const vocationMap = {
      0: 'Novato',
      1: 'Sorcerer',
      2: 'Druid',
      3: 'Paladin',
      4: 'Knight',
      5: 'Master Sorcerer',
      6: 'Elder Druid',
      7: 'Royal Paladin',
      8: 'Elite Knight',
    }

    // Formatar personagens
    const characters = players.map(player => ({
      name: player.name,
      level: player.level,
      vocation: vocationMap[player.vocation] || 'Novato',
      world: 'Pokenight',
      status: 'offline',
      gender: player.sex === 1 ? 'masculino' : 'feminino'
    }))

    console.log('✅ Personagens encontrados:', characters.length)

    return NextResponse.json({
      success: true,
      characters: characters
    })

  } catch (error) {
    console.error('❌ Erro ao buscar personagens:', error)
    
    if (connection) {
      try {
        await connection.end()
      } catch (e) {
        console.error('Erro ao fechar conexão:', e)
      }
    }

    return NextResponse.json(
      { error: 'Erro ao buscar personagens' },
      { status: 500 }
    )
  }
}
