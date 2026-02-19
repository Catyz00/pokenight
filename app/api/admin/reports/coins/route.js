import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // week, month, year, all
    
    let dateFilter = ''
    const now = new Date()
    
    switch(period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFilter = `WHERE purchased_at >= '${weekAgo.toISOString().split('T')[0]}'`
        break
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        dateFilter = `WHERE purchased_at >= '${monthAgo.toISOString().split('T')[0]}'`
        break
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        dateFilter = `WHERE purchased_at >= '${yearAgo.toISOString().split('T')[0]}'`
        break
      case 'all':
        dateFilter = ''
        break
    }

    // Estatísticas gerais
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_purchases,
        SUM(CASE WHEN status = 'aprovado' THEN 1 ELSE 0 END) as approved_purchases,
        SUM(CASE WHEN status = 'aprovado' THEN amount ELSE 0 END) as total_coins_sold,
        SUM(CASE WHEN status = 'aprovado' THEN price ELSE 0 END) as total_revenue,
        AVG(CASE WHEN status = 'aprovado' THEN price ELSE NULL END) as avg_purchase_value
      FROM coin_purchases
      ${dateFilter}
    `)

    // Vendas por dia (últimos 7 dias para gráfico)
    const [dailySales] = await pool.query(`
      SELECT 
        DATE(purchased_at) as date,
        COUNT(*) as purchases,
        SUM(CASE WHEN status = 'aprovado' THEN amount ELSE 0 END) as coins_sold,
        SUM(CASE WHEN status = 'aprovado' THEN price ELSE 0 END) as revenue
      FROM coin_purchases
      WHERE purchased_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(purchased_at)
      ORDER BY date ASC
    `)

    // Top compradores
    const [topBuyers] = await pool.query(`
      SELECT 
        username,
        COUNT(*) as purchase_count,
        SUM(CASE WHEN status = 'aprovado' THEN amount ELSE 0 END) as total_coins,
        SUM(CASE WHEN status = 'aprovado' THEN price ELSE 0 END) as total_spent
      FROM coin_purchases
      ${dateFilter}
      GROUP BY user_id, username
      ORDER BY total_spent DESC
      LIMIT 10
    `)

    // Transações recentes
    const [recentTransactions] = await pool.query(`
      SELECT 
        id,
        username,
        amount,
        price,
        status,
        payment_method,
        purchased_at
      FROM coin_purchases
      ${dateFilter}
      ORDER BY purchased_at DESC
      LIMIT 20
    `)

    return NextResponse.json({
      stats: stats[0],
      dailySales,
      topBuyers,
      recentTransactions
    })

  } catch (error) {
    console.error('Erro ao buscar relatório de coins:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar relatório' },
      { status: 500 }
    )
  }
}
