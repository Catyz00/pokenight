'use client'

import ComprarPontos from "@/components/profile/comprar-pontos/shop.jsx";

import RecentAchievementsWrapper from './RecentAchievementsWrapper'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Gamepad2,
  LogOut,
  Shield,
  Crown,
  Plus,
} from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    gender: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [formError, setFormError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [characters, setCharacters] = useState([])
  const [selectedCharName, setSelectedCharName] = useState('')

  useEffect(() => {
    if (characters.length > 0) {
      setSelectedCharName(characters[0].name)
    } else {
      setSelectedCharName('')
    }
  }, [characters])

  useEffect(() => {
    const loadUserData = async () => {
      const loggedUser = localStorage.getItem('user')

      if (!loggedUser) {
        router.push('/auth/login')
        return
      }

      try {
        const userData = JSON.parse(loggedUser)
        setUser(userData)

        try {
          const response = await fetch(`/api/characters?username=${encodeURIComponent(userData.username)}`)
          const data = await response.json()

          if (data.success && data.characters) {
            setCharacters(data.characters)
            console.log('✅ Personagens carregados:', data.characters)
          } else {
            setCharacters([])
          }
        } catch (error) {
          console.error('Erro ao buscar personagens:', error)
          setCharacters([])
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  const handleCreateCharacter = async () => {
    setFormError('')

    if (!newCharacter.name || !newCharacter.gender) {
      setFormError('Por favor, preencha todos os campos')
      toast({
        variant: 'destructive',
        title: '✗ Erro ao criar personagem',
        description: 'Por favor, preencha todos os campos',
      })
      return
    }

    if (newCharacter.name.length < 2 || newCharacter.name.length > 29) {
      setFormError('O nome deve ter entre 2 e 29 caracteres')
      toast({
        variant: 'destructive',
        title: '✗ Erro ao criar personagem',
        description: 'O nome deve ter entre 2 e 29 caracteres',
      })
      return
    }

    if (!/^[a-zA-Z\s]+$/.test(newCharacter.name)) {
      setFormError('O nome deve conter apenas letras')
      toast({
        variant: 'destructive',
        title: '✗ Erro ao criar personagem',
        description: 'O nome deve conter apenas letras (sem números ou caracteres especiais)',
      })
      return
    }

    try {
      const response = await fetch('/api/characters/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          characterName: newCharacter.name,
          gender: newCharacter.gender,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar personagem')
      }

      setCharacters([...characters, data.character])

      setIsDialogOpen(false)
      setNewCharacter({ name: '', gender: '' })

      toast({
        variant: 'success',
        title: '✓ Personagem criado!',
        description: `${data.character.name} foi criado com sucesso.`,
      })

      console.log('✅ Personagem criado:', data.character)
    } catch (error) {
      console.error('Erro ao criar personagem:', error)
      toast({
        variant: 'destructive',
        title: '✗ Erro ao criar personagem',
        description: error.message,
      })
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Preencha todos os campos')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    try {
      const response = await fetch('/api/auth/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      setIsPasswordDialogOpen(false)
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })

      toast({
        variant: 'success',
        title: '✓ Senha alterada!',
        description: 'Sua senha foi alterada com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      setPasswordError(error.message)
      toast({
        variant: 'destructive',
        title: '✗ Erro ao alterar senha',
        description: error.message,
      })
    }
  }

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

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* ✅ Mantém a mesma margem/padrão do site */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
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

              <div className="flex gap-2">
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

        <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1">
  <TabsTrigger value="characters" className="whitespace-nowrap">Personagens</TabsTrigger>
  <TabsTrigger value="stats" className="whitespace-nowrap">Estatísticas</TabsTrigger>
  <TabsTrigger value="shop" className="whitespace-nowrap">Shop</TabsTrigger>
  <TabsTrigger value="settings" className="whitespace-nowrap">Configurações</TabsTrigger>
</TabsList>


          {/* Aba de Personagens */}
          <TabsContent value="characters" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meus Personagens</CardTitle>
                  <CardDescription>
                    Gerencie seus personagens no Pokenight ({characters.length}/4)
                  </CardDescription>
                </div>

                {characters.length < 4 && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Criar Personagem
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Novo Personagem</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do seu novo personagem
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        {formError && (
                          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                            <p className="text-sm text-destructive">{formError}</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="char-name">Nome do Personagem</Label>
                          <Input
                            id="char-name"
                            placeholder="Digite o nome (2-29 caracteres)"
                            value={newCharacter.name}
                            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                            maxLength={29}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="char-gender">Sexo</Label>
                          <Select
                            value={newCharacter.gender}
                            onValueChange={(value) => setNewCharacter({ ...newCharacter, gender: value })}
                          >
                            <SelectTrigger id="char-gender">
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false)
                            setNewCharacter({ name: '', gender: '' })
                            setFormError('')
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateCharacter}>
                          Criar Personagem
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {characters.map((char) => (
                  <div key={char.name} className="flex items-center gap-4 rounded-lg border p-4">
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
                ))}

                {characters.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <Gamepad2 className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Nenhum personagem</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Você ainda não criou nenhum personagem
                    </p>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Criar Primeiro Personagem
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Personagem</DialogTitle>
                          <DialogDescription>
                            Preencha os dados do seu novo personagem
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {formError && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                              <p className="text-sm text-destructive">{formError}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="char-name-empty">Nome do Personagem</Label>
                            <Input
                              id="char-name-empty"
                              placeholder="Digite o nome (2-29 caracteres)"
                              value={newCharacter.name}
                              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                              maxLength={29}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="char-gender-empty">Sexo</Label>
                            <Select
                              value={newCharacter.gender}
                              onValueChange={(value) => setNewCharacter({ ...newCharacter, gender: value })}
                            >
                              <SelectTrigger id="char-gender-empty">
                                <SelectValue placeholder="Selecione o sexo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="feminino">Feminino</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false)
                              setNewCharacter({ name: '', gender: '' })
                              setFormError('')
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateCharacter}>
                            Criar Personagem
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {characters.length === 4 && (
                  <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Você atingiu o limite de 4 personagens por conta
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Estatísticas */}
          
<TabsContent value="shop" className="space-y-4">
            {/* ...existing code for Estatísticas... */}
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comprar NightCoins</CardTitle>
                <CardDescription>
                  Adquira NightCoins para usar em compras dentro do Pokenight.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Componente de compra de pontos */}
                <ComprarPontos />
              </CardContent>
            </Card>
          </TabsContent>

          {/*Aba de Shop*/}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Level Máximo</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.level}</div>
                  <p className="text-xs text-muted-foreground">{user.vocation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guild</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.guild}</div>
                  <p className="text-xs text-muted-foreground">{user.rank}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Personagens</CardTitle>
                  <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{characters.length}</div>
                  <p className="text-xs text-muted-foreground">Total de chars</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    Conquistas Recentes
                    {characters.length > 0 && (
                      <Select value={selectedCharName} onValueChange={setSelectedCharName}>
                        <SelectTrigger className="w-40 h-8 text-sm">
                          <SelectValue placeholder="Escolher personagem" />
                        </SelectTrigger>
                        <SelectContent>
                          {characters.map((char) => (
                            <SelectItem key={char.name} value={char.name}>
                              {char.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardTitle>
                  <CardDescription>Suas últimas conquistas no Pokenight</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                {characters.length > 0 && selectedCharName ? (
                  <div className="py-4">
                    <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                    <p className="text-center text-muted-foreground mb-4">
                      Conquistas do personagem <b>{selectedCharName}</b>:
                    </p>

                    {/* ✅ mantém "sem estreitar" as conquistas */}
                    <div className="w-full">
                      <RecentAchievementsWrapper characterName={selectedCharName} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div className="space-y-2">
                      <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        Nenhum personagem para exibir conquistas.
                      </p>
                    </div>
                  </div>
                )}
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
                <Button
                  variant="outline"
                  className="w-full justify-start hover:text-primary hover:border-primary hover:cursor-pointer"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Alterar Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:text-primary hover:border-primary hover:cursor-pointer"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Alterar Senha
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

      {/* Modal de Alteração de Senha */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite sua senha atual e escolha uma nova senha segura.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {passwordError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {passwordError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="oldPassword">Senha Atual</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Digite sua senha atual"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Digite a nova senha (mínimo 6 caracteres)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a nova senha novamente"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Não lembra sua senha?{' '}
              <a href="/auth/recuperar-senha" className="text-primary hover:underline cursor-pointer">
                Clique aqui para recuperar
              </a>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsPasswordDialogOpen(false)
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                }}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleChangePassword}>
                Alterar Senha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
