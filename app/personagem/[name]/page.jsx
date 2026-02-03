'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  User,
  Clock,
  Home,
  Scroll,
  MapPin,
  Sword,
  Shield,
  Activity,
  BookOpen,
  Star,
  CheckCircle2,
  XCircle,
  Skull,
} from 'lucide-react'

const vocationNames = {
  0: 'Nenhuma',
  1: 'Sorcerer',
  2: 'Druid',
  3: 'Paladin',
  4: 'Knight',
  5: 'Master Sorcerer',
  6: 'Elder Druid',
  7: 'Royal Paladin',
  8: 'Elite Knight',
}

const vocationIcons = {
  0: Shield,
  1: Sword,
  2: Sword,
  3: Sword,
  4: Shield,
  5: Sword,
  6: Sword,
  7: Sword,
  8: Shield,
}

const townNames = {
  1: 'Carlin',
  2: 'Thais',
  3: 'Edron',
  4: 'Venore',
  5: 'Ab\'Dendriel',
}

const questNames = {
  10000: 'Tutorial Quest',
  10001: 'First Mission',
  10002: 'Rookie Hunter',
  10003: 'Forest Explorer',
  10004: 'Cave Adventurer',
  10005: 'Mountain Climber',
  10006: 'Deep Sea Diver',
  10007: 'Desert Wanderer',
  10008: 'Ice Land Explorer',
  10009: 'Volcano Survivor',
  10010: 'Ancient Ruins',
  10011: 'Hidden Temple',
  10012: 'Lost City',
  10013: 'Forbidden Zone',
  10014: 'Sacred Ground',
  10015: 'Dark Portal',
  10016: 'Light Tower',
  10017: 'Shadow Realm',
  10018: 'Crystal Cave',
  10019: 'Golden Palace',
  10020: 'Silver Fortress',
  // Adicione mais quests conforme necessário
}

export default function PlayerPage({ params }) {
  const router = useRouter()
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playerName, setPlayerName] = useState(null)

  // Resolver params de forma assíncrona
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setPlayerName(resolvedParams.name)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!playerName) return

    const fetchPlayer = async () => {
      try {
        const response = await fetch(`/api/player/${playerName}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar personagem')
        }

        setPlayerData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [playerName])

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Erro ao carregar personagem</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { player, house, quests, recentActivities, bestiary, pokedex } = playerData

  // Calcular progresso de quests
  const completedQuests = quests?.completed?.length || 0
  const notCompletedQuests = quests?.notCompleted?.length || 0
  const totalQuests = completedQuests + notCompletedQuests
  const questProgress = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0

  const VocationIcon = vocationIcons[player.vocation] || Shield

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho do Personagem */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <VocationIcon className="h-12 w-12 text-primary" />
                </div>
              </Avatar>
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Level {player.level}
              </Badge>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{player.name}</h1>
              
              <p className="mt-2 text-lg font-medium text-primary">
                {vocationNames[player.vocation] || 'Desconhecida'}
              </p>
              
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="h-4 w-4" />
                {townNames[player.townId] || 'Desconhecida'}
              </p>

              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                <Clock className="h-4 w-4" />
                Último login: {player.lastLogin > 0 ? new Date(player.lastLogin * 1000).toLocaleDateString('pt-BR') : 'Nunca'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {/* Casa */}
        {house && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Casa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{house.name}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {townNames[house.townId] || 'Localização desconhecida'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scroll className="h-5 w-5" />
              Progresso de Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completedQuests} de {totalQuests} quests completadas
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {questProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={questProgress} className="h-2" />
              </div>

              {/* Quests Completadas */}
              {quests?.completed && quests.completed.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Quests Completadas ({quests.completed.length})
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto">
                    {quests.completed.map((quest, index) => (
                      <div key={index} className="flex items-center gap-2 rounded border border-green-500/20 bg-green-500/5 p-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="flex-1 truncate">{quest.questName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {quest.progress}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quests Não Completadas */}
              {quests?.notCompleted && quests.notCompleted.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Quests Não Completadas ({quests.notCompleted.length}+)
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto">
                    {quests.notCompleted.map((quest, index) => (
                      <div key={index} className="flex items-center gap-2 rounded border border-red-500/20 bg-red-500/5 p-2 text-sm">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="flex-1 truncate text-red-600">{quest.questName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedQuests === 0 && (!quests?.notCompleted || quests.notCompleted.length === 0) && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhuma quest disponível
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 rounded border p-3 text-sm">
                    <Skull className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <p>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp * 1000).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhuma atividade recente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Bestiary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bestiary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestiary && bestiary.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {bestiary.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between rounded border p-3 text-sm">
                    <span className="font-medium">{entry.monster}</span>
                    <Badge variant="outline">{entry.kills} kills</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhum monstro derrotado ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pokedex */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Pokédex
              </div>
              <Badge variant="outline">
                {pokedex?.length || 0} / 721 desbloqueados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pokedex && pokedex.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {pokedex.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between rounded border border-primary/20 bg-primary/5 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-medium">#{entry.pokemonId} {entry.pokemonName}</span>
                    </div>
                    <Badge variant="secondary">{entry.captures}x</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhum Pokémon capturado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
