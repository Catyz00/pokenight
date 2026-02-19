import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

// Lista todos os torneios
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    let query = `SELECT * FROM tournaments WHERE 1=1`
    const params = []

    if (status && status !== 'todos') {
      query += ' AND status = ?'
      params.push(status)
    }

    if (type && type !== 'todos') {
      query += ' AND type = ?'
      params.push(type)
    }

    query += ' ORDER BY start_date DESC'

    const [tournaments] = await pool.query(query, params)

    return NextResponse.json({ tournaments })

  } catch (error) {
    console.error('Erro ao buscar torneios:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar torneios',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Criar novo torneio
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      type, 
      startDate, 
      endDate, 
      maxParticipants,
      entryFee,
      prizePool,
      rules,
      imageUrl,
      createdBy 
    } = body

    if (!title || !description || !type || !startDate || !endDate || !createdBy) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    console.log('Dados do torneio recebidos:', body)

    // Converter prizePool para string se necessário
    const prizePoolString = typeof prizePool === 'string' 
      ? prizePool 
      : (prizePool ? JSON.stringify(prizePool) : null)

    const [result] = await pool.query(
      `INSERT INTO tournaments 
       (title, description, type, start_date, end_date, max_participants, 
        entry_fee, prize_pool, rules, image_url, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'planejado')`,
      [
        title, 
        description, 
        type, 
        startDate, 
        endDate, 
        maxParticipants ? parseInt(maxParticipants) : null,
        entryFee ? parseInt(entryFee) : 0,
        prizePoolString,
        rules || null,
        imageUrl || null,
        parseInt(createdBy)
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Torneio criado com sucesso!',
      tournamentId: result.insertId
    })

  } catch (error) {
    console.error('Erro ao criar torneio:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao criar torneio',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
