import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, username, subject, message, category } = body

    // Validação
    if (!userId || !username || !subject || !message || !category) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (subject.length < 5 || subject.length > 255) {
      return NextResponse.json(
        { error: 'O assunto deve ter entre 5 e 255 caracteres' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'A mensagem deve ter pelo menos 10 caracteres' },
        { status: 400 }
      )
    }

    const validCategories = ['reclamacao', 'ajuda', 'sugestao', 'bug', 'outro']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }

    // Inserir ticket no banco
    const [result] = await pool.query(
      `INSERT INTO tickets (user_id, username, subject, message, category, status, priority)
       VALUES (?, ?, ?, ?, ?, 'aberto', 'media')`,
      [userId, username, subject, message, category]
    )

    return NextResponse.json({
      success: true,
      message: 'Ticket criado com sucesso! Nossa equipe entrará em contato em breve.',
      ticketId: result.insertId
    })

  } catch (error) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ticket. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}

// Lista tickets do usuário
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const [tickets] = await pool.query(
      `SELECT id, subject, category, status, priority, created_at, updated_at, 
              CASE WHEN response IS NOT NULL THEN 1 ELSE 0 END as has_response
       FROM tickets 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    )

    return NextResponse.json({ tickets })

  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tickets' },
      { status: 500 }
    )
  }
}
