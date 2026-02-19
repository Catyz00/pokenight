"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Newspaper, Calendar, Trophy, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Coins } from "lucide-react"

// Dados de exemplo - na versao real viram do PHP/MariaDB
const stats = [
  {
    title: "Jogadores Online",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Noticias Publicadas",
    value: "156",
    change: "+3",
    trend: "up",
    icon: Newspaper,
  },
  {
    title: "Eventos Ativos",
    value: "12",
    change: "-2",
    trend: "down",
    icon: Calendar,
  },
  {
    title: "Torneios do Mes",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Trophy,
  },
]

const recentActivities = [
  { action: "Nova noticia publicada", item: "Novo Pokemon Lendario Disponivel!", time: "Ha 2 horas" },
  { action: "Evento criado", item: "Torneio Mensal de Janeiro", time: "Ha 5 horas" },
  { action: "Ranking atualizado", item: "Top Level - Janeiro", time: "Ha 1 dia" },
  { action: "Jogador banido", item: "user123 - Uso de hacks", time: "Ha 2 dias" },
  { action: "Configuracao alterada", item: "Taxa de spawn aumentada", time: "Ha 3 dias" },
]

export default function AdminDashboard() {
  const [coinsReport, setCoinsReport] = useState(null)
  const [loadingCoins, setLoadingCoins] = useState(true)

  useEffect(() => {
    fetchCoinsReport()
  }, [])

  const fetchCoinsReport = async () => {
    try {
      const response = await fetch('/api/admin/reports/coins?period=week')
      const data = await response.json()
      if (response.ok) {
        setCoinsReport(data)
      }
    } catch (error) {
      console.error('Erro ao buscar relatório de coins:', error)
    } finally {
      setLoadingCoins(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visao geral do sistema e estatisticas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span
                  className={`flex items-center text-xs font-medium ${
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relatório Financeiro NightCoins */}
      {!loadingCoins && coinsReport && (
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
                {coinsReport.stats?.approved_purchases} compras aprovadas
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
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {coinsReport.topBuyers?.[0]?.username || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(coinsReport.topBuyers?.[0]?.total_spent)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico Simples de Vendas Diárias */}
      {!loadingCoins && coinsReport?.dailySales?.length > 0 && (
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

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Ultimas acoes realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
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
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Acoes Rapidas</CardTitle>
            <CardDescription>Atalhos para tarefas comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/admin/noticias/nova"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Nova Noticia</p>
                  <p className="text-xs text-muted-foreground">Criar publicacao</p>
                </div>
              </a>
              <a
                href="/admin/eventos/novo"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Novo Evento</p>
                  <p className="text-xs text-muted-foreground">Agendar evento</p>
                </div>
              </a>
              <a
                href="/admin/rankings"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Atualizar Rankings</p>
                  <p className="text-xs text-muted-foreground">Gerenciar rankings</p>
                </div>
              </a>
              <a
                href="/admin/jogadores"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Ver Jogadores</p>
                  <p className="text-xs text-muted-foreground">Lista de usuarios</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
