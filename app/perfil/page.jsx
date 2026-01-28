'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Gamepad2,
  Settings,
  LogOut,
  Shield,
  Crown,
  Swords,
} from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado
    const loggedUser = localStorage.getItem('user')
    
    if (!loggedUser) {
      // Se não houver usuário logado, redirecionar para login
      router.push('/auth/login')
      return
    }

    try {
      const userData = JSON.parse(loggedUser)
      setUser(userData)
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    // Limpar dados de sessão/localStorage se houver
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // Redirecionar para login
    router.push('/auth/login')
  }

  // Mostrar loading enquanto carrega dados
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  // Se não houver usuário após loading, não renderizar nada (já redirecionou)
  if (!user) {
    return null
  }

  // Personagens de exemplo (futuramente buscar da API)
  const characters = [
    {
      name: user.username,
      level: user.level || 1,
      vocation: user.vocation || 'Novato',
      world: 'Pokenight',
      status: 'offline',
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header do Perfil */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary">
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 gap-1">
                  <Crown className="h-3 w-3" />
                  VIP
                </Badge>
              </div>

              {/* Informações do Usuário */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
                <p className="mt-1 flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleLogout}
                  title="Sair da conta"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="characters">Personagens</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Aba de Personagens */}
          <TabsContent value="characters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Personagens</CardTitle>
                <CardDescription>
                  Gerencie seus personagens no Pokenight
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {characters.map((char) => (
                  <div
                    key={char.name}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{char.name}</h3>
                          <Badge
                            variant={char.status === 'online' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {char.status === 'online' ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Level {char.level} • {char.vocation}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Estatísticas */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Level Máximo
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.level}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.vocation}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Guild
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.guild}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.rank}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Personagens
                  </CardTitle>
                  <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{characters.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de chars
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Conquistas Recentes</CardTitle>
                <CardDescription>
                  Suas últimas conquistas no Pokenight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Primeiro Level 100', date: '2026-01-20', xp: 500 },
                    { name: 'Mestre das Dungeons', date: '2026-01-18', xp: 1000 },
                    { name: 'Campeão PvP', date: '2026-01-15', xp: 1500 },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp} XP</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas preferências e segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Alterar Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferências
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair da Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
