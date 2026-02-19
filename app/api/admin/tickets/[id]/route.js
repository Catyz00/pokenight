import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function POST(request, { params }) {
  try {
    const ticketId = params.id
    const body = await request.json()
    const { response, adminId, status } = body

    if (!response || !adminId) {
      return NextResponse.json(
        { error: 'Resposta e ID do admin são obrigatórios' },
        { status: 400 }
      )
    }

    if (response.length < 10) {
      return NextResponse.json(
        { error: 'A resposta deve ter pelo menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Atualizar ticket com resposta
    await pool.query(
      `UPDATE tickets 
       SET response = ?, 
           responded_by = ?, 
           responded_at = NOW(),
           status = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [response, adminId, status || 'em_andamento', ticketId]
    )

    return NextResponse.json({
      success: true,
      message: 'Resposta enviada com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao responder ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao responder ticket' },
      { status: 500 }
    )
  }
}

// Atualizar status do ticket
export async function PATCH(request, { params }) {
  try {
    const ticketId = params.id
    const body = await request.json()
    const { status, priority } = body

    const updates = []
    const values = []

    if (status) {
      updates.push('status = ?')
      values.push(status)
    }

    if (priority) {
      updates.push('priority = ?')
      values.push(priority)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      )
    }

    updates.push('updated_at = NOW()')
    values.push(ticketId)

    await pool.query(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({
      success: true,
      message: 'Ticket atualizado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar ticket' },
      { status: 500 }
    )
  }
}

// Deletar ticket
export async function DELETE(request, { params }) {
  try {
    const ticketId = params.id

    await pool.query('DELETE FROM tickets WHERE id = ?', [ticketId])

    return NextResponse.json({
      success: true,
      message: 'Ticket deletado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao deletar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar ticket' },
      { status: 500 }
    )
  }
}
