import { NextResponse } from 'next/server'
import crypto from 'crypto'
import mysql from 'mysql2/promise'

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'poke'
}

export async function POST(request) {
  let connection

  try {
    const { code, email, password } = await request.json()

    console.log('=== Nova Senha - Debug ===')
    console.log('Code:', code)
    console.log('Email:', email)
    console.log('Password length:', password?.length)

    // Validações básicas
    if (!code || !email || !password) {
      return NextResponse.json(
        { error: 'Código, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Conectar ao banco de dados
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Conectado ao MySQL - database: poke')

    // Buscar o código de recuperação (você vai precisar criar uma tabela para isso)
    // Por enquanto, vamos apenas validar o email e atualizar a senha
    
    // Verificar se o email existe
    const [accounts] = await connection.execute(
      'SELECT id, name FROM accounts WHERE LOWER(email) = LOWER(?)',
      [email]
    )

    if (accounts.length === 0) {
      console.log('❌ Email não encontrado')
      await connection.end()
      return NextResponse.json(
        { error: 'Email não encontrado' },
        { status: 404 }
      )
    }

    const account = accounts[0]
    console.log('✅ Conta encontrada:', account.name)

    // Criar hash SHA1 da nova senha
    const passwordHash = crypto.createHash('sha1').update(password).digest('hex')
    console.log('🔐 Novo hash gerado:', passwordHash)

    // Atualizar a senha no banco de dados
    await connection.execute(
      'UPDATE accounts SET password = ? WHERE id = ?',
      [passwordHash, account.id]
    )

    console.log('✅ Senha atualizada com sucesso!')
    await connection.end()

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!'
    })

  } catch (error) {
    console.error('=== ERRO AO REDEFINIR SENHA ===')
    console.error('Erro:', error)
    console.error('Stack:', error.stack)
    
    if (connection) {
      await connection.end()
    }

    return NextResponse.json(
      { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
