import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { createDbConnection } from '@/lib/db-config'

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
    // Validar: primeira letra maiúscula, apenas letras e espaços
    if (!/^[A-Z][a-zA-Z\s]+$/.test(characterName)) {
      return NextResponse.json(
        { error: 'O nome do personagem deve começar com letra maiúscula e conter apenas letras (sem números ou caracteres especiais)' },
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
    connection = await createDbConnection(mysql)

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
  const looktype = sex === 1 ? 63 : 511
    const [result] = await connection.execute(
      `INSERT INTO players (
        name, account_id, group_id, sex, vocation, level, 
        health, healthmax, experience, 
        lookbody, lookfeet, lookhead, looklegs, looktype, lookaddons, lookmount,
        maglevel, mana, manamax, manaspent, soul,
        town_id, posx, posy, posz, conditions,
        cap, lastlogin, lastip, save,
        skull, skulltime, rank_id, guildnick, lastlogout,
        blessings, pvp_blessing, balance, stamina, direction,
        loss_experience, loss_mana, loss_skills, loss_containers, loss_items,
        premend, online, marriage, marrystatus, promotion, deleted
      ) VALUES (
        ?, ?, 1, ?, 1, 8,
        295, 295, 4200,
        68, 76, 78, 58, ?, 0, 0,
        0, 6, 6, 0, 0,
  1, 1043, 1904, 6, '',
        7, 0, 0, 1,
        0, 0, 0, '', 0,
        0, 0, 0, 151200000, 0,
        10, 10, 10, 100, 100,
        0, 0, 0, 0, 0, 0
      )`,
      [characterName, accountId, sex, looktype]
    )

    await connection.end()

    console.log('✅ Personagem criado com ID:', result.insertId)

    return NextResponse.json({
      success: true,
      message: 'Personagem criado com sucesso!',
      character: {
        name: characterName,
        level: 8,
        vocation: 'Treinador',
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
