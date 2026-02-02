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
  Calendar,
  Clock,
  Shield,
  Home,
  Scroll,
  Users,
  Crown,
  MapPin,
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

const townNames = {
  1: 'Carlin',
  2: 'Thais',
  3: 'Edron',
  4: 'Venore',
  5: 'Ab\'Dendriel',
}

export default function ProfilePage({ params }) {
  const router = useRouter()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(null)

  // Resolver params de forma assíncrona
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setUsername(resolvedParams.username)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!username) return

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/account/${username}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar perfil')
        }

        setProfileData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Erro ao carregar perfil</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { account, characters, houses, quests } = profileData

  // Calcular progresso de quests (exemplo: assumindo 100 quests totais)
  const totalQuests = 100
  const completedQuests = quests.length
  const questProgress = (completedQuests / totalQuests) * 100

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho do Perfil */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </Avatar>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{account.username}</h1>
              
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                <Calendar className="h-4 w-4" />
                Membro desde {new Date(account.createdAt * 1000).toLocaleDateString('pt-BR')}
              </p>
              
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                <Clock className="h-4 w-4" />
                Último login: {account.lastLogin > 0 ? new Date(account.lastLogin * 1000).toLocaleDateString('pt-BR') : 'Nunca'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personagens ({characters.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {characters.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhum personagem encontrado
              </p>
            ) : (
              <div className="space-y-4">
                {characters.map((char) => (
                  <div key={char.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{char.name}</h3>
                        <Badge variant="outline">Lvl {char.level}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {vocationNames[char.vocation] || 'Desconhecida'}
                      </p>
                      {char.guild && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3" />
                          {char.guild} - {char.guildRank}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {townNames[char.townId] || 'Desconhecida'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Último login: {char.lastLogin > 0 ? new Date(char.lastLogin * 1000).toLocaleDateString('pt-BR') : 'Nunca'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Casas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Casas ({houses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {houses.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhuma casa encontrada
              </p>
            ) : (
              <div className="space-y-3">
                {houses.map((house) => (
                  <div key={house.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{house.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Dono: {house.owner}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {townNames[house.townId] || 'Localização desconhecida'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quests */}
      <Card className="mt-6">
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

            {quests.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold">Quests Recentes:</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {quests.slice(0, 10).map((quest, index) => (
                    <div key={index} className="flex items-center gap-2 rounded border p-2 text-sm">
                      <Scroll className="h-3 w-3 text-primary" />
                      <span className="flex-1 truncate">{quest.questName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {quest.playerName}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quests.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhuma quest completada ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
