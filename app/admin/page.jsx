"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  TicketIcon, 
  Trophy, 
  Map as MapIcon, 
  DollarSign, 
  Coins,
  Activity
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [coinsReport, setCoinsReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const statsRes = await fetch('/api/admin/stats')
      const statsData = await statsRes.json()
      if (statsRes.ok) setStats(statsData)

      const activitiesRes = await fetch('/api/admin/activities')
      const activitiesData = await activitiesRes.json()
      if (activitiesRes.ok) setActivities(activitiesData.activities || [])

      const coinsRes = await fetch('/api/admin/reports/coins?period=week')
      const coinsData = await coinsRes.json()
      if (coinsRes.ok) setCoinsReport(coinsData)

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `Há ${diffMins} min`
    if (diffHours < 24) return `Há ${diffHours}h`
    if (diffDays < 7) return `Há ${diffDays}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral do sistema e estatísticas em tempo real
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats && (
          <>
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Jogadores Cadastrados
                </CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.players?.total?.toLocaleString('pt-BR') || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.players?.online || 0} online agora
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tickets de Suporte
                </CardTitle>
                <TicketIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.tickets?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.tickets?.open || 0} aguardando resposta
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Torneios/Eventos
                </CardTitle>
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.tournaments?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.tournaments?.active || 0} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mapas Ativos
                </CardTitle>
                <MapIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.maps?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponíveis no jogo
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {coinsReport && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Receita da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(coinsReport.stats?.total_revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {coinsReport.stats?.approved_purchases || 0} compras aprovadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Coins className="h-4 w-4" />
                NightCoins Vendidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {coinsReport.stats?.total_coins_sold?.toLocaleString('pt-BR') || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {formatCurrency(coinsReport.stats?.avg_purchase_value)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/50 bg-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {coinsReport.stats?.total_purchases || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 7 dias
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Comprador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 truncate">
                {coinsReport.topBuyers?.[0]?.username || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(coinsReport.topBuyers?.[0]?.total_spent)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {coinsReport?.dailySales?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
            <CardDescription>Receita diária de NightCoins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coinsReport.dailySales.map((day, index) => {
                const maxRevenue = Math.max(...coinsReport.dailySales.map(d => parseFloat(d.revenue) || 0))
                const percentage = maxRevenue > 0 ? ((parseFloat(day.revenue) || 0) / maxRevenue) * 100 : 0
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma atividade recente
                </p>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="truncate text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Atalhos para tarefas comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/tickets"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <TicketIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Tickets</p>
                  <p className="text-xs text-muted-foreground">Ver tickets</p>
                </div>
              </Link>
              <Link
                href="/admin/torneios"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Torneios</p>
                  <p className="text-xs text-muted-foreground">Gerenciar</p>
                </div>
              </Link>
              <Link
                href="/admin/mapas"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Mapas</p>
                  <p className="text-xs text-muted-foreground">Adicionar mapa</p>
                </div>
              </Link>
              <Link
                href="/admin/parceiros"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Parceiros</p>
                  <p className="text-xs text-muted-foreground">Ver parceiros</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
