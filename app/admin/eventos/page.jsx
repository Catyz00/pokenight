"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Calendar } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const getTypeColor = (type) => {
  switch (type) {
    case "Torneio":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "Evento":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "Desafio":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "Ativo":
      return "bg-emerald-500/20 text-emerald-400"
    case "Agendado":
      return "bg-blue-500/20 text-blue-400"
    case "Encerrado":
      return "bg-zinc-500/20 text-zinc-400"
    default:
      return "bg-zinc-500/20 text-zinc-400"
  }
}

const Loading = () => null;

export default function AdminEventos() {
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [user, setUser] = useState(null)
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'torneio',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    prizePool: '',
    rules: '',
    imageUrl: '',
    status: 'planejado'
  })

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
    }
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/tournaments')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.tournaments || [])
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'torneio',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      prizePool: '',
      rules: '',
      imageUrl: '',
      status: 'planejado'
    })
    setEditingEvent(null)
  }

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        title: event.title || event.name || '',
        description: event.description || '',
        type: event.type || 'torneio',
        startDate: event.start_date?.split('T')[0] || event.startDate || '',
        endDate: event.end_date?.split('T')[0] || event.endDate || '',
        maxParticipants: event.max_participants?.toString() || event.maxParticipants || '',
        prizePool: event.prize_pool || event.prizePool || '',
        rules: event.rules || '',
        imageUrl: event.image_url || event.imageUrl || '',
        status: event.status || 'planejado'
      })
    } else {
      resetForm()
    }
    setShowDialog(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Usuário não autenticado')
      return
    }

    try {
      const url = editingEvent 
        ? `/api/admin/tournaments/${editingEvent.id}`
        : '/api/admin/tournaments'
      
      const method = editingEvent ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Evento salvo com sucesso!')
        setShowDialog(false)
        resetForm()
        fetchEvents()
      } else {
        alert(data.error || 'Erro ao salvar evento')
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
      alert('Erro ao salvar evento')
    }
  }

  const filteredEvents = events.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return
    
    try {
      const response = await fetch(`/api/admin/tournaments/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setEvents(events.filter((item) => item.id !== id))
      } else {
        alert('Erro ao deletar evento')
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      alert('Erro ao deletar evento')
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie torneios, eventos e desafios do jogo
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* Modal de Adicionar/Editar Evento */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do evento. Os campos marcados são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Nome do evento"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o evento..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="torneio">Torneio</SelectItem>
                        <SelectItem value="evento">Evento</SelectItem>
                        <SelectItem value="desafio">Desafio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejado">Planejado</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="encerrado">Encerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Data de Término *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                      placeholder="0 = ilimitado"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="prizePool">Prêmio</Label>
                    <Input
                      id="prizePool"
                      value={formData.prizePool}
                      onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
                      placeholder="Ex: 10.000 NightCoins"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rules">Regras</Label>
                  <Textarea
                    id="rules"
                    value={formData.rules}
                    onChange={(e) => setFormData({...formData, rules: e.target.value})}
                    placeholder="Descreva as regras do evento..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {events.filter((e) => e.status === "Ativo").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Eventos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {events.filter((e) => e.status === "Agendado").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Agendados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/20 p-2">
                  <Calendar className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {events.reduce((acc, e) => acc + e.participants, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Participantes Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Todos
                </Button>
                <Button variant="ghost" size="sm">
                  Ativos
                </Button>
                <Button variant="ghost" size="sm">
                  Agendados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Lista de Eventos</CardTitle>
            <CardDescription>
              {filteredEvents.length} eventos encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead className="text-right">Participantes</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum evento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title || item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.start_date && new Date(item.start_date).toLocaleDateString("pt-BR")} -{" "}
                        {item.end_date && new Date(item.end_date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.max_participants?.toLocaleString() || item.participants?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
