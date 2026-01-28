import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'global'
};

export async function POST(request) {
  let connection;

  try {
    const { username, password } = await request.json();

    // Validações básicas
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Criptografar senha com SHA1 (formato MyAAC/Tibia)
    const passwordHash = crypto.createHash('sha1').update(password).digest('hex');

    console.log('\n=== Login (MySQL Direct) ===');
    console.log('Username:', username);
    console.log('Password Hash:', passwordHash);

    // Conectar ao banco de dados
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL - database: global');

    // Buscar conta no banco de dados com senha (case-insensitive)
    const [accounts] = await connection.execute(
      'SELECT id, name, email, password FROM accounts WHERE LOWER(name) = LOWER(?)',
      [username]
    );

    if (accounts.length === 0) {
      console.log('❌ Usuário não encontrado');
      await connection.end();
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    const account = accounts[0];
    console.log('✅ Usuário encontrado:', account.name);
    console.log('Hash no banco:', account.password);
    console.log('Hash informado:', passwordHash);
    console.log('Senhas coincidem?', account.password === passwordHash);

    // Validar senha
    if (account.password !== passwordHash) {
      console.log('❌ Senha incorreta');
      await connection.end();
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    console.log('✅ Login bem-sucedido!');
    
    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        message: 'Login realizado com sucesso!',
        username: account.name,
        email: account.email || username + '@pokenight.com'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao processar login. Tente novamente.' },
      { status: 500 }
    );
  }
}
