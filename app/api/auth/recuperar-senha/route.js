import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, email, method } = await request.json()

    console.log('=== Recuperação de Senha - Debug ===')
    console.log('Username:', username)
    console.log('Email:', email)
    console.log('Method:', method)

    // Validações básicas
    if (!username) {
      return NextResponse.json(
        { error: 'Nome de usuário é obrigatório' },
        { status: 400 }
      )
    }

    if (method === 'email' && !email) {
      return NextResponse.json(
        { error: 'Email é obrigatório para recuperação por email' },
        { status: 400 }
      )
    }

    // Validar formato de email
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // URL do backend PHP (MyAAC)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost'
    const fullUrl = `${backendUrl}/index.php?subtopic=lostaccount&action=step1`
    
    console.log('Backend URL:', fullUrl)
    
    // Fazer requisição para o backend PHP
    const formData = new URLSearchParams({
      action_type: 'no_char',
      email_rcv: email || '',
    })
    
    console.log('Form data:', formData.toString())
    
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
    if (text.includes('error') || text.includes('Error') || text.includes('erro') || 
        bodyContent.toLowerCase().includes('doesn\'t exist') ||
        bodyContent.toLowerCase().includes('invalid') ||
        bodyContent.toLowerCase().includes('try again')) {
      
      // Tentar extrair mensagem de erro
      let errorMessage = 'Erro ao processar solicitação. Verifique seus dados.'
      
      // Procurar por mensagens específicas
      if (bodyContent.includes('doesn\'t exist')) {
        errorMessage = 'Conta com este e-mail não existe.'
      } else if (bodyContent.includes('Invalid e-mail')) {
        errorMessage = 'E-mail inválido.'
      } else if (bodyContent.includes('must wait')) {
        errorMessage = 'Você deve aguardar antes de solicitar novamente.'
      }
      
      console.error('Erro encontrado na resposta:', errorMessage)
      console.error('Body content:', bodyContent.substring(0, 300))
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    // Verificar se o email foi enviado com sucesso
    if (bodyContent.includes('Details about steps') || 
        bodyContent.includes('should receive this email') ||
        bodyContent.includes('sent to')) {
      console.log('=== EMAIL ENVIADO COM SUCESSO ===')
      return NextResponse.json({
        success: true,
        message: 'Um email com instruções foi enviado para seu endereço cadastrado.'
      })
    }

    // Sucesso
    console.log('✓ Requisição processada com sucesso')
    return NextResponse.json({
      success: true,
      message: method === 'email' 
        ? 'Um email com instruções foi enviado para seu endereço cadastrado.'
        : 'Sua senha foi recuperada com sucesso!'
    })

  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
