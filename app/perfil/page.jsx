'use client'

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
  Settings,
  LogOut,
  Shield,
  Crown,
  Swords,
  Plus,
} from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    gender: '',
  })
  const [formError, setFormError] = useState('')
  const [characters, setCharacters] = useState([]) // Movido para estado

  useEffect(() => {
    const loadUserData = async () => {
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
        
        // Buscar personagens reais do banco de dados
        try {
          const response = await fetch(`/api/characters?username=${encodeURIComponent(userData.username)}`)
          const data = await response.json()
          
          if (data.success && data.characters) {
            setCharacters(data.characters)
            console.log('✅ Personagens carregados:', data.characters)
          } else {
            // Se não conseguir buscar, usar array vazio
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
    // Limpar dados de sessão/localStorage se houver
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // Redirecionar para login
    router.push('/auth/login')
  }

  const handleCreateCharacter = async () => {
    setFormError('')
    
    // Validações
    if (!newCharacter.name || !newCharacter.gender) {
      setFormError('Por favor, preencha todos os campos')
      toast({
        variant: "destructive",
        title: "✗ Erro ao criar personagem",
        description: "Por favor, preencha todos os campos",
      })
      return
    }

    if (newCharacter.name.length < 2 || newCharacter.name.length > 29) {
      setFormError('O nome deve ter entre 2 e 29 caracteres')
      toast({
        variant: "destructive",
        title: "✗ Erro ao criar personagem",
        description: "O nome deve ter entre 2 e 29 caracteres",
      })
      return
    }

    // Validar apenas letras e espaços
    if (!/^[a-zA-Z\s]+$/.test(newCharacter.name)) {
      setFormError('O nome deve conter apenas letras')
      toast({
        variant: "destructive",
        title: "✗ Erro ao criar personagem",
        description: "O nome deve conter apenas letras (sem números ou caracteres especiais)",
      })
      return
    }

    try {
      // Chamar API para criar personagem no banco
      const response = await fetch('/api/characters/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      // Adicionar à lista de personagens
      setCharacters([...characters, data.character])
      
      // Fechar dialog e limpar form
      setIsDialogOpen(false)
      setNewCharacter({ name: '', gender: '' })
      
      // Mostrar toast de sucesso
      toast({
        variant: "success",
        title: "✓ Personagem criado!",
        description: `${data.character.name} foi criado com sucesso.`,
      })
      
      console.log('✅ Personagem criado:', data.character)
    } catch (error) {
      console.error('Erro ao criar personagem:', error)
      toast({
        variant: "destructive",
        title: "✗ Erro ao criar personagem",
        description: error.message,
      })
    }
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
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="space-y-2">
                    <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Nenhuma conquista ainda
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Continue jogando para desbloquear conquistas!
                    </p>
                  </div>
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
      <Toaster />
    </div>
  )
}
