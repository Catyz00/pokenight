import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

// Lista todos os tickets (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    let query = `
      SELECT id, user_id, username, subject, category, status, priority, 
             created_at, updated_at, 
             CASE WHEN response IS NOT NULL THEN 1 ELSE 0 END as has_response
      FROM tickets
      WHERE 1=1
    `
    const params = []

    if (status && status !== 'todos') {
      query += ' AND status = ?'
      params.push(status)
    }

    if (category && category !== 'todos') {
      query += ' AND category = ?'
      params.push(category)
    }

    if (priority && priority !== 'todos') {
      query += ' AND priority = ?'
      params.push(priority)
    }

    query += ' ORDER BY created_at DESC LIMIT 100'

    const [tickets] = await pool.query(query, params)

    // Estatísticas
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
        SUM(CASE WHEN status = 'em_andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) as resolvidos,
        SUM(CASE WHEN status = 'fechado' THEN 1 ELSE 0 END) as fechados
      FROM tickets
    `)

    return NextResponse.json({ 
      tickets,
      stats: stats[0]
    })

  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tickets' },
      { status: 500 }
    )
  }
}
