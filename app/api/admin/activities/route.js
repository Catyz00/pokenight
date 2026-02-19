import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET() {
  try {
    // Últimas atividades (tickets, torneios, etc)
    const activities = []

    // Últimos 5 tickets criados
    const [tickets] = await pool.query(`
      SELECT 
        id, 
        username, 
        subject, 
        category,
        created_at 
      FROM tickets 
      ORDER BY created_at DESC 
      LIMIT 5
    `)

    tickets.forEach(ticket => {
      activities.push({
        type: 'ticket',
        action: `Ticket de ${ticket.category}`,
        item: ticket.subject,
        user: ticket.username,
        time: ticket.created_at
      })
    })

    // Últimos 3 torneios criados
    const [tournaments] = await pool.query(`
      SELECT 
        id, 
        title, 
        type,
        status,
        created_at 
      FROM tournaments 
      ORDER BY created_at DESC 
      LIMIT 3
    `)

    tournaments.forEach(tournament => {
      activities.push({
        type: 'tournament',
        action: `${tournament.type} criado`,
        item: tournament.title,
        user: 'Admin',
        time: tournament.created_at
      })
    })

    // Últimos 3 mapas criados
    const [maps] = await pool.query(`
      SELECT 
        id, 
        name, 
        map_type,
        created_at 
      FROM game_maps 
      ORDER BY created_at DESC 
      LIMIT 3
    `)

    maps.forEach(map => {
      activities.push({
        type: 'map',
        action: `Mapa adicionado`,
        item: `${map.name} (${map.map_type})`,
        user: 'Admin',
        time: map.created_at
      })
    })

    // Ordenar por data
    activities.sort((a, b) => new Date(b.time) - new Date(a.time))

    // Pegar apenas os 10 mais recentes
    const recentActivities = activities.slice(0, 10)

    return NextResponse.json({ activities: recentActivities })

  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}
