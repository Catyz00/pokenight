import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request) {
  let connection = null

  try {
    const { username, characterName, gender } = await request.json()

    console.log('=== Criar Personagem ===')
    console.log('Username:', username)
    console.log('Character Name:', characterName)
    console.log('Gender:', gender)

    // Validações
    if (!username || !characterName || !gender) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (characterName.length < 2 || characterName.length > 29) {
      return NextResponse.json(
        { error: 'Nome deve ter entre 2 e 29 caracteres' },
        { status: 400 }
      )
    }

    // Validar apenas letras e espaços
    if (!/^[a-zA-Z\s]+$/.test(characterName)) {
      return NextResponse.json(
        { error: 'Nome deve conter apenas letras (sem números ou caracteres especiais)' },
        { status: 400 }
      )
    }

    if (!['masculino', 'feminino'].includes(gender)) {
      return NextResponse.json(
        { error: 'Gênero inválido' },
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

    console.log('✅ Conectado ao MySQL')

    // Buscar account_id
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

    // Verificar quantos personagens já existem
    const [playerCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM players WHERE account_id = ?',
      [accountId]
    )

    if (playerCount[0].count >= 4) {
      await connection.end()
      return NextResponse.json(
        { error: 'Limite de 4 personagens atingido' },
        { status: 400 }
      )
    }

    // Verificar se nome já existe
    const [nameCheck] = await connection.execute(
      'SELECT id FROM players WHERE name = ?',
      [characterName]
    )

    if (nameCheck.length > 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Este nome já está em uso' },
        { status: 400 }
      )
    }

    // Criar personagem
    const sex = gender === 'masculino' ? 1 : 0
    const [result] = await connection.execute(
      `INSERT INTO players (name, account_id, sex, vocation, level, health, healthmax, mana, manamax, cap, town_id, posx, posy, posz, conditions, looktype, lookhead, lookbody, looklegs, lookfeet, lookaddons) 
       VALUES (?, ?, ?, 0, 1, 150, 150, 0, 0, 400, 1, 160, 54, 7, '', ?, 0, 0, 0, 0, 0)`,
      [characterName, accountId, sex, sex === 1 ? 128 : 136]
    )

    await connection.end()

    console.log('✅ Personagem criado com ID:', result.insertId)

    return NextResponse.json({
      success: true,
      message: 'Personagem criado com sucesso!',
      character: {
        name: characterName,
        level: 1,
        vocation: 'Novato',
        world: 'Pokenight',
        status: 'offline',
        gender: gender
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar personagem:', error)
    
    if (connection) {
      try {
        await connection.end()
      } catch (e) {
        console.error('Erro ao fechar conexão:', e)
      }
    }

    return NextResponse.json(
      { error: error.message || 'Erro ao criar personagem' },
      { status: 500 }
    )
  }
}
