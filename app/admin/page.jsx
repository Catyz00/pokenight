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
  Activity,
  TrendingUp,
  Calendar,
  ShoppingCart
} from "lucide-react"

export default function AdminDashboard() {
  const [coinsReport, setCoinsReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar apenas relatório de coins da última semana
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="mt-1 text-muted-foreground">Carregando relatório de NightCoins...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="mt-1 text-muted-foreground">
          Relatório de compras de NightCoins da última semana
        </p>
      </div>

      {/* Estatísticas Principais de NightCoins */}
      {coinsReport && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total (7 dias)
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
                  Coins distribuídas aos jogadores
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/50 bg-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Total de Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {coinsReport.stats?.total_purchases || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Compras realizadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {formatCurrency(coinsReport.stats?.avg_purchase_value)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Valor médio por compra
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Vendas Diárias */}
          {coinsReport.dailySales?.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
                <CardDescription>Receita diária de NightCoins por dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coinsReport.dailySales.map((day, index) => {
                    const maxRevenue = Math.max(...coinsReport.dailySales.map(d => parseFloat(d.revenue) || 0))
                    const percentage = maxRevenue > 0 ? ((parseFloat(day.revenue) || 0) / maxRevenue) * 100 : 0
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            {new Date(day.date).toLocaleDateString('pt-BR', { 
                              weekday: 'long',
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(day.revenue)}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
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

          {/* Top Compradores */}
          {coinsReport.topBuyers?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Compradores da Semana</CardTitle>
                <CardDescription>Jogadores que mais compraram NightCoins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coinsReport.topBuyers.map((buyer, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <span className="text-sm font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{buyer.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {buyer.total_coins?.toLocaleString('pt-BR') || 0} coins
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(buyer.total_spent)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {buyer.purchase_count} compras
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Últimas Transações */}
          {coinsReport.recentPurchases?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas 10 compras de NightCoins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coinsReport.recentPurchases.map((purchase, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{purchase.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(purchase.purchase_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {purchase.coins} coins
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {formatCurrency(purchase.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
          <CardDescription>Navegar para outras seções do painel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/tickets"
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <TicketIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Tickets</p>
                <p className="text-xs text-muted-foreground">Suporte</p>
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
                <p className="text-xs text-muted-foreground">Cadastrar</p>
              </div>
            </Link>
            <Link
              href="/admin/eventos"
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Eventos</p>
                <p className="text-xs text-muted-foreground">Gerenciar</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
