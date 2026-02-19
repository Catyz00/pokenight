import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET() {
  try {
    // Total de jogadores cadastrados
    const [totalPlayers] = await pool.query(
      'SELECT COUNT(*) as total FROM players'
    )

    // Jogadores online (players_online table se existir, senão retorna 0)
    let onlinePlayers = 0
    try {
      const [online] = await pool.query('SELECT COUNT(*) as total FROM players_online')
      onlinePlayers = online[0]?.total || 0
    } catch (error) {
      // Tabela players_online pode não existir
      onlinePlayers = 0
    }

    // Total de tickets
    const [totalTickets] = await pool.query(
      'SELECT COUNT(*) as total FROM tickets'
    )

    // Tickets abertos
    const [openTickets] = await pool.query(
      "SELECT COUNT(*) as total FROM tickets WHERE status = 'aberto'"
    )

    // Total de torneios
    const [totalTournaments] = await pool.query(
      'SELECT COUNT(*) as total FROM tournaments'
    )

    // Torneios ativos (em andamento ou inscrições abertas)
    const [activeTournaments] = await pool.query(
      "SELECT COUNT(*) as total FROM tournaments WHERE status IN ('em_andamento', 'inscricoes_abertas')"
    )

    // Total de mapas ativos
    const [activeMaps] = await pool.query(
      'SELECT COUNT(*) as total FROM game_maps WHERE is_active = 1'
    )

    // Total de parceiros
    let totalPartners = 0
    try {
      const [partners] = await pool.query('SELECT COUNT(*) as total FROM partners')
      totalPartners = partners[0]?.total || 0
    } catch (error) {
      // Tabela partners pode não existir
      totalPartners = 0
    }

    return NextResponse.json({
      players: {
        total: totalPlayers[0]?.total || 0,
        online: onlinePlayers
      },
      tickets: {
        total: totalTickets[0]?.total || 0,
        open: openTickets[0]?.total || 0
      },
      tournaments: {
        total: totalTournaments[0]?.total || 0,
        active: activeTournaments[0]?.total || 0
      },
      maps: {
        active: activeMaps[0]?.total || 0
      },
      partners: {
        total: totalPartners
      }
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
