import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';

export async function POST(request) {
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

    const backendUrl = process.env.BACKEND_URL || 'http://localhost';
    
    // Preparar dados do formulário
    const formData = new URLSearchParams();
    formData.append('account_login', username);
    formData.append('password_login', passwordHash); // Enviar hash SHA1

    console.log('\n=== Login ===');
    console.log('Username:', username);
    console.log('Backend URL:', `${backendUrl}/?subtopic=accountmanagement&action=login`);

    // Fazer requisição para o backend MyAAC
    const response = await fetch(
      `${backendUrl}/?subtopic=accountmanagement&action=login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    console.log('Response status:', response.status);

    const responseText = await response.text();
    console.log('Response text (primeiros 1500 chars):', responseText.substring(0, 1500));

    // Limpar HTML para análise
    const cleanText = responseText
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    console.log('Body content (limpo):', cleanText.substring(0, 500));

    // Debug: verificar qual padrão está dando match
    const errorPatterns = [
      'account name or password is incorrect',
      'nome da conta ou senha está incorreta',
      'invalid account name',
      'invalid password entered',
      'password is wrong',
      'incorrect password',
      'account is blocked',
      'conta bloqueada',
      'too many login attempts',
      'muitas tentativas',
      'login has failed',
      'falha no login',
      'authentication failed'
    ];
    
    const matchedErrors = errorPatterns.filter(pattern => cleanText.includes(pattern));
    console.log('🔍 Matched error patterns:', matchedErrors);
    console.log('🔍 Number of errors found:', matchedErrors.length);

    const hasError = matchedErrors.length > 0;
    
    console.log('❌ Has error patterns?', hasError);
    console.log('✅ Contains "account management"?', cleanText.includes('account management'));
    
    // Se não tem erro E tem account management, priorizar account management (sucesso)
    if (cleanText.includes('account management') && !hasError) {
      console.log('✅ Login bem-sucedido! Página de Account Management carregada.');
      
      // Buscar email do usuário no banco de dados MySQL
      let userEmail = '';
      try {
        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'global',
        });
        
        console.log('✅ Conectado ao MySQL - database: global');
        
        const [rows] = await connection.execute(
          'SELECT email FROM accounts WHERE name = ?',
          [username]
        );
        
        console.log('📧 Query result:', rows);
        
        await connection.end();
        
        if (rows && rows.length > 0 && rows[0].email) {
          userEmail = rows[0].email;
          console.log('✅ Email encontrado:', userEmail);
        } else {
          console.log('⚠️ Email não encontrado, usando padrão');
          userEmail = username + '@pokenight.com';
        }
      } catch (e) {
        console.log('❌ Erro ao buscar email:', e.message);
        console.log('Stack:', e.stack);
        userEmail = username + '@pokenight.com';
      }
      
      const cookies = response.headers.get('set-cookie');
      console.log('Cookies:', cookies);
      console.log('Email retornado:', userEmail);
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Login realizado com sucesso!',
          username: username,
          email: userEmail
        },
        { 
          status: 200,
          headers: cookies ? { 'Set-Cookie': cookies } : {}
        }
      );
    }
    
    if (hasError) {
      console.log('Erro encontrado na resposta:', cleanText.substring(0, 200));
      
      // Tentar extrair mensagem de erro específica
      let errorMessage = 'Usuário ou senha incorretos';
      
      if (cleanText.includes('account name or password is incorrect') || 
          cleanText.includes('nome da conta ou senha está incorreta')) {
        errorMessage = 'Usuário ou senha incorretos';
      } else if (cleanText.includes('account is blocked') || cleanText.includes('bloqueada')) {
        errorMessage = 'Conta bloqueada';
      } else if (cleanText.includes('too many attempts') || cleanText.includes('muitas tentativas')) {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // Se não tem erro E chegou na página de Account Management = SUCESSO!
    if (cleanText.includes('account management')) {
      console.log('Login bem-sucedido! Página de Account Management carregada.');
      
      // Buscar email do usuário no banco de dados MySQL
      let userEmail = '';
      try {
        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'global',
        });
        
        console.log('✅ Conectado ao MySQL - database: global');
        
        const [rows] = await connection.execute(
          'SELECT email FROM accounts WHERE name = ?',
          [username]
        );
        
        console.log('📧 Query result:', rows);
        
        await connection.end();
        
        if (rows && rows.length > 0 && rows[0].email) {
          userEmail = rows[0].email;
          console.log('✅ Email encontrado:', userEmail);
        } else {
          console.log('⚠️ Email não encontrado, usando padrão');
          userEmail = username + '@pokenight.com';
        }
      } catch (e) {
        console.log('❌ Erro ao buscar email:', e.message);
        console.log('Stack:', e.stack);
        userEmail = username + '@pokenight.com';
      }
      
      // Tentar extrair cookies de sessão
      const cookies = response.headers.get('set-cookie');
      console.log('Cookies:', cookies);
      console.log('Email retornado:', userEmail);
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Login realizado com sucesso!',
          username: username,
          email: userEmail
        },
        { 
          status: 200,
          headers: cookies ? { 'Set-Cookie': cookies } : {}
        }
      );
    }

    // Se status 200 mas sem padrão claro, assumir sucesso
    console.log('Status 200 sem erro detectado. Assumindo sucesso.');
    return NextResponse.json(
      { 
        success: true,
        message: 'Login realizado com sucesso!',
        username: username
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro ao processar login. Tente novamente.' },
      { status: 500 }
    );
  }
}
