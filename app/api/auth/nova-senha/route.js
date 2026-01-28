import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { code, email, password } = await request.json()

    console.log('=== Nova Senha - Debug ===')
    console.log('Code:', code)
    console.log('Email:', email)
    console.log('Password length:', password?.length)
    
    // Criptografar senha com SHA1 (formato MyAAC/Tibia)
    const passwordHash = crypto.createHash('sha1').update(password).digest('hex')

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

    // URL do backend PHP (MyAAC)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost'
    const fullUrl = `${backendUrl}/index.php?subtopic=lostaccount&action=checkcode`
    
    console.log('Backend URL:', fullUrl)
    
    // Preparar dados do formulário com senha SHA1
    const formData = new URLSearchParams({
      code: code,
      email_rcv: email,
      new_password: passwordHash,  // Usar hash SHA1
      new_password2: passwordHash, // confirmação também com hash
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
    
    // Extrair mensagem do body
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyContent = bodyMatch ? bodyMatch[1] : text
    
    // Remover scripts e styles
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    
    // Remover tags HTML
    bodyContent = bodyContent.replace(/<[^>]+>/g, ' ')
    bodyContent = bodyContent.replace(/\s+/g, ' ').trim()
    
    console.log('Body content (limpo):', bodyContent.substring(0, 500))
    
    // Verificar se houve erro
    if (text.includes('error') || text.includes('Error') || 
        bodyContent.toLowerCase().includes('invalid') ||
        bodyContent.toLowerCase().includes('expired') ||
        bodyContent.toLowerCase().includes('wrong')) {
      
      let errorMessage = 'Código inválido ou expirado. Solicite uma nova recuperação.'
      
      if (bodyContent.includes('expired') || bodyContent.includes('expirado')) {
        errorMessage = 'Código expirado. Solicite uma nova recuperação de senha.'
      } else if (bodyContent.includes('Invalid code') || bodyContent.includes('código inválido')) {
        errorMessage = 'Código inválido. Verifique o link no email.'
      }
      
      console.error('Erro encontrado:', errorMessage)
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    // Verificar sucesso
    if (bodyContent.includes('password has been changed') || 
        bodyContent.includes('senha foi alterada') ||
        bodyContent.includes('successfully') ||
        bodyContent.includes('sucesso')) {
      console.log('=== SENHA ALTERADA COM SUCESSO ===')
      return NextResponse.json({
        success: true,
        message: 'Senha redefinida com sucesso!'
      })
    }

    console.log('=== SUCESSO (resposta genérica) ===')
    
    // Se chegou aqui sem erro, assumir sucesso
    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!'
    })

  } catch (error) {
    console.error('=== ERRO AO REDEFINIR SENHA ===')
    console.error('Erro:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
