import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

export async function POST(request) {
  let connection = null;
  
  try {
    const { login, email, password, nome, genero } = await request.json()

    console.log('=== Registro de Conta - Debug ===')
    console.log('Login:', login)
    console.log('Email:', email)
    console.log('Nome:', nome)
    console.log('Genero:', genero)

    // Validações básicas
    if (!login || !email || !password || !nome || !genero) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar login (3-32 caracteres, apenas letras e números)
    if (login.length < 3 || login.length > 32) {
      return NextResponse.json(
        { error: 'Login deve ter entre 3 e 32 caracteres' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9]+$/.test(login)) {
      return NextResponse.json(
        { error: 'Login deve conter apenas letras e números' },
        { status: 400 }
      )
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }


    // Validar nome do personagem (2-29 caracteres, apenas letras e espaços, primeira letra maiúscula)
    if (nome.length < 2 || nome.length > 29) {
      return NextResponse.json(
        { error: 'Nome do personagem deve ter entre 2 e 29 caracteres' },
        { status: 400 }
      )
    }
    if (!/^[A-Z][a-zA-Z\s]+$/.test(nome)) {
      return NextResponse.json(
        { error: 'O nome do personagem deve começar com letra maiúscula e conter apenas letras (sem números ou caracteres especiais)' },
        { status: 400 }
      )
    }

    // Validar gênero
    if (!['masculino', 'feminino'].includes(genero)) {
      return NextResponse.json(
        { error: 'Gênero inválido' },
        { status: 400 }
      )
    }

    // Conectar ao banco de dados
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'poke',
    })

    console.log('✅ Conectado ao MySQL - database: poke')

    // Verificar se conta já existe
    const [accountCheck] = await connection.execute(
      'SELECT id FROM accounts WHERE name = ?',
      [login]
    )

    if (accountCheck.length > 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Este nome de conta já está em uso.' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const [emailCheck] = await connection.execute(
      'SELECT id FROM accounts WHERE email = ?',
      [email]
    )

    if (emailCheck.length > 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Este email já está cadastrado.' },
        { status: 400 }
      )
    }

    // Verificar se nome do personagem já existe
    const [playerCheck] = await connection.execute(
      'SELECT id FROM players WHERE name = ?',
      [nome]
    )

    if (playerCheck.length > 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Este nome de personagem já está em uso.' },
        { status: 400 }
      )
    }

    // Criptografar senha com SHA1 (padrão MyAAC/Tibia)
    const passwordHash = crypto.createHash('sha1').update(password).digest('hex')

    // Inserir conta no banco de dados
    const [accountResult] = await connection.execute(
      'INSERT INTO accounts (name, password, email, created) VALUES (?, ?, ?, UNIX_TIMESTAMP())',
      [login, passwordHash, email]
    )

    const accountId = accountResult.insertId
    console.log('✅ Conta criada com ID:', accountId)

    // Inserir personagem no banco de dados
    const sex = genero === 'masculino' ? 1 : 0
  const looktype = sex === 1 ? 63 : 511
    const [playerResult] = await connection.execute(
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
      [nome, accountId, sex, looktype]
    )

    console.log('✅ Personagem criado com ID:', playerResult.insertId)

    await connection.end()

    console.log('=== CONTA E PERSONAGEM CRIADOS COM SUCESSO ===')
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Você já pode fazer login.',
      accountName: login
    })

  } catch (error) {
    console.error('=== ERRO NO REGISTRO ===')
    console.error('Erro no registro:', error)
    console.error('Stack:', error.stack)
    
    // Fechar conexão se estiver aberta
    if (connection) {
      try {
        await connection.end()
      } catch (e) {
        console.error('Erro ao fechar conexão:', e)
      }
    }
    
    return NextResponse.json(
      { error: error.message || 'Erro ao processar solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
