import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'global'
}

export async function POST(request) {
  let connection

  try {
    const { username, oldPassword, newPassword } = await request.json()

    // Validações básicas
    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Conectar ao banco de dados
    connection = await mysql.createConnection(dbConfig)

    // Verificar se a conta existe e a senha antiga está correta
    const oldPasswordHash = crypto.createHash('sha1').update(oldPassword).digest('hex')
    
    console.log('=== Debug Alteração de Senha ===')
    console.log('Username:', username)
    console.log('Senha digitada:', oldPassword)
    console.log('Hash gerado:', oldPasswordHash)
    
    // Primeiro verificar se a conta existe (case-insensitive)
    const [accountCheck] = await connection.execute(
      'SELECT id, name, password FROM accounts WHERE LOWER(name) = LOWER(?)',
      [username]
    )
    
    if (accountCheck.length === 0) {
      console.log('❌ Conta não encontrada')
      await connection.end()
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✓ Conta encontrada:', accountCheck[0].name)
    console.log('Hash no banco:', accountCheck[0].password)
    console.log('Hashes coincidem?', accountCheck[0].password === oldPasswordHash)
    
    const [accounts] = await connection.execute(
      'SELECT id, name FROM accounts WHERE LOWER(name) = LOWER(?) AND password = ?',
      [username, oldPasswordHash]
    )

    if (accounts.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      )
    }

    const accountId = accounts[0].id

    // Criar hash SHA1 da nova senha
    const newPasswordHash = crypto.createHash('sha1').update(newPassword).digest('hex')

    // Atualizar a senha no banco de dados
    await connection.execute(
      'UPDATE accounts SET password = ? WHERE id = ?',
      [newPasswordHash, accountId]
    )

    await connection.end()

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    
    if (connection) {
      await connection.end()
    }

    return NextResponse.json(
      { error: 'Erro ao alterar senha. Tente novamente.' },
      { status: 500 }
    )
  }
}
