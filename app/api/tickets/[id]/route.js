import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET(request, { params }) {
  try {
    const ticketId = params.id

    const [tickets] = await pool.query(
      `SELECT t.*, 
              CASE WHEN t.responded_by IS NOT NULL 
                THEN (SELECT name FROM players WHERE id = t.responded_by LIMIT 1)
                ELSE NULL 
              END as responder_name
       FROM tickets t
       WHERE t.id = ?`,
      [ticketId]
    )

    if (tickets.length === 0) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ticket: tickets[0] })

  } catch (error) {
    console.error('Erro ao buscar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ticket' },
      { status: 500 }
    )
  }
}
