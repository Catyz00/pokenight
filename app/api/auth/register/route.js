import { NextResponse } from 'next/server'

export async function POST(request) {
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

    // Validar nome do personagem (2-29 caracteres, apenas letras e espaços)
    if (nome.length < 2 || nome.length > 29) {
      return NextResponse.json(
        { error: 'Nome do personagem deve ter entre 2 e 29 caracteres' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z\s]+$/.test(nome)) {
      return NextResponse.json(
        { error: 'Nome do personagem deve conter apenas letras' },
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

    // URL do backend PHP (MyAAC)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost'
    const fullUrl = `${backendUrl}/index.php?subtopic=accountmanagement&action=createaccount`
    
    console.log('Backend URL:', fullUrl)
    
    // Preparar dados do formulário
    const formData = new URLSearchParams({
      account_name: login,
      email: email,
      password: password,
      password2: password, // confirmação de senha
      name: nome,
      sex: genero === 'masculino' ? '1' : '0', // 1 = masculino, 0 = feminino
      character_name: nome,
      submit: 'Submit',
    })
    
    console.log('Form data:', formData.toString())
    
    // Fazer requisição para o backend PHP
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText)
      throw new Error('Erro ao comunicar com o servidor')
    }

    const text = await response.text()
    console.log('Response text (primeiros 1500 chars):', text.substring(0, 1500))
    
    // Extrair mensagem do body (remover HTML)
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyContent = bodyMatch ? bodyMatch[1] : text
    
    // Remover scripts e styles
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    
    // Remover tags HTML mas manter o texto
    bodyContent = bodyContent.replace(/<[^>]+>/g, ' ')
    bodyContent = bodyContent.replace(/\s+/g, ' ').trim()
    
    console.log('Body content (limpo):', bodyContent.substring(0, 500))
    
    // Verificar se houve erro na resposta
    if (text.includes('error') || text.includes('Error') || 
        bodyContent.toLowerCase().includes('already exist') ||
        bodyContent.toLowerCase().includes('invalid') ||
        bodyContent.toLowerCase().includes('please enter') ||
        bodyContent.toLowerCase().includes('must be')) {
      
      let errorMessage = 'Erro ao criar conta. Verifique os dados.'
      
      // Procurar por mensagens específicas de erro
      if (bodyContent.includes('already exist') || bodyContent.includes('já existe')) {
        if (bodyContent.toLowerCase().includes('account')) {
          errorMessage = 'Este nome de conta já está em uso.'
        } else if (bodyContent.toLowerCase().includes('character') || bodyContent.toLowerCase().includes('name')) {
          errorMessage = 'Este nome de personagem já está em uso.'
        } else if (bodyContent.toLowerCase().includes('email')) {
          errorMessage = 'Este email já está cadastrado.'
        }
      } else if (bodyContent.includes('Invalid') || bodyContent.includes('inválido')) {
        errorMessage = 'Dados inválidos. Verifique os campos.'
      } else if (bodyContent.includes('too short') || bodyContent.includes('muito curto')) {
        errorMessage = 'Nome ou senha muito curtos.'
      } else if (bodyContent.includes('too long') || bodyContent.includes('muito longo')) {
        errorMessage = 'Nome ou senha muito longos.'
      }
      
      console.error('Erro encontrado na resposta:', errorMessage)
      console.error('Body content:', bodyContent.substring(0, 500))
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    // Verificar se a conta foi criada com sucesso
    if (bodyContent.includes('created successfully') || 
        bodyContent.includes('Account Created') ||
        bodyContent.includes('successfully created') ||
        bodyContent.includes('criada com sucesso')) {
      console.log('=== CONTA CRIADA COM SUCESSO ===')
      return NextResponse.json({
        success: true,
        message: 'Conta criada com sucesso! Você já pode fazer login.',
        accountName: login
      })
    }

    console.log('=== SUCESSO (resposta genérica) ===')
    
    // Se chegou aqui sem erro, assumir sucesso
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Você já pode fazer login.',
      accountName: login
    })

  } catch (error) {
    console.error('=== ERRO NO REGISTRO ===')
    console.error('Erro no registro:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
