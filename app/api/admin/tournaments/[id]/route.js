import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

// Buscar torneio específico
export async function GET(request, { params }) {
  try {
    const tournamentId = params.id

    const [tournaments] = await pool.query(
      'SELECT * FROM tournaments WHERE id = ?',
      [tournamentId]
    )

    if (tournaments.length === 0) {
      return NextResponse.json(
        { error: 'Torneio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tournament: tournaments[0] })

  } catch (error) {
    console.error('Erro ao buscar torneio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar torneio' },
      { status: 500 }
    )
  }
}

// Atualizar torneio
export async function PATCH(request, { params }) {
  try {
    const tournamentId = params.id
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
      status
    } = body

    const updates = []
    const values = []

    if (title) {
      updates.push('title = ?')
      values.push(title)
    }
    if (description) {
      updates.push('description = ?')
      values.push(description)
    }
    if (type) {
      updates.push('type = ?')
      values.push(type)
    }
    if (startDate) {
      updates.push('start_date = ?')
      values.push(startDate)
    }
    if (endDate) {
      updates.push('end_date = ?')
      values.push(endDate)
    }
    if (maxParticipants !== undefined) {
      updates.push('max_participants = ?')
      values.push(maxParticipants || null)
    }
    if (entryFee !== undefined) {
      updates.push('entry_fee = ?')
      values.push(entryFee)
    }
    if (prizePool !== undefined) {
      updates.push('prize_pool = ?')
      values.push(prizePool ? JSON.stringify(prizePool) : null)
    }
    if (rules !== undefined) {
      updates.push('rules = ?')
      values.push(rules)
    }
    if (imageUrl !== undefined) {
      updates.push('image_url = ?')
      values.push(imageUrl)
    }
    if (status) {
      updates.push('status = ?')
      values.push(status)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      )
    }

    values.push(tournamentId)

    await pool.query(
      `UPDATE tournaments SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    )

    return NextResponse.json({
      success: true,
      message: 'Torneio atualizado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao atualizar torneio:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar torneio' },
      { status: 500 }
    )
  }
}

// Deletar torneio
export async function DELETE(request, { params }) {
  try {
    const tournamentId = params.id

    // Deletar participantes primeiro
    await pool.query('DELETE FROM tournament_participants WHERE tournament_id = ?', [tournamentId])
    
    // Deletar torneio
    await pool.query('DELETE FROM tournaments WHERE id = ?', [tournamentId])

    return NextResponse.json({
      success: true,
      message: 'Torneio deletado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao deletar torneio:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar torneio' },
      { status: 500 }
    )
  }
}
