"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trophy, Plus, Edit, Trash2, Calendar, Users } from 'lucide-react'

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingTournament, setEditingTournament] = useState(null)
  const [alert, setAlert] = useState(null)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'torneio',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    entryFee: '0',
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
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/tournaments')
      const data = await response.json()
      if (response.ok) setTournaments(data.tournaments)
    } catch (error) {
      console.error('Erro ao buscar torneios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      const url = editingTournament 
        ? `/api/admin/tournaments/${editingTournament.id}`
        : '/api/admin/tournaments'
      
      const method = editingTournament ? 'PATCH' : 'POST'
      
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
        setAlert({ type: 'success', message: data.message })
        setShowDialog(false)
        resetForm()
        fetchTournaments()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao salvar torneio:', error)
      setAlert({ type: 'error', message: 'Erro ao salvar torneio' })
    }
  }

  const handleEdit = (tournament) => {
    setEditingTournament(tournament)
    setFormData({
      title: tournament.title,
      description: tournament.description,
      type: tournament.type,
      startDate: tournament.start_date?.slice(0, 16),
      endDate: tournament.end_date?.slice(0, 16),
      maxParticipants: tournament.max_participants || '',
      entryFee: tournament.entry_fee || '0',
      prizePool: tournament.prize_pool || '',
      rules: tournament.rules || '',
      imageUrl: tournament.image_url || '',
      status: tournament.status
    })
    setShowDialog(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este torneio?')) return

    try {
      const response = await fetch(`/api/admin/tournaments/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (response.ok) {
        setAlert({ type: 'success', message: data.message })
        fetchTournaments()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao deletar torneio:', error)
      setAlert({ type: 'error', message: 'Erro ao deletar torneio' })
    }
  }

  const resetForm = () => {
    setEditingTournament(null)
    setFormData({
      title: '',
      description: '',
      type: 'torneio',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      entryFee: '0',
      prizePool: '',
      rules: '',
      imageUrl: '',
      status: 'planejado'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'planejado': 'bg-gray-500',
      'inscricoes_abertas': 'bg-blue-500',
      'em_andamento': 'bg-yellow-500',
      'finalizado': 'bg-green-500',
      'cancelado': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'planejado': 'Planejado',
      'inscricoes_abertas': 'Inscrições Abertas',
      'em_andamento': 'Em Andamento',
      'finalizado': 'Finalizado',
      'cancelado': 'Cancelado'
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Torneios e Eventos</h1>
          <p className="mt-1 text-muted-foreground">Gerencie torneios e eventos do servidor</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Torneio
        </Button>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center py-8 text-muted-foreground">Carregando...</p>
        ) : tournaments.length === 0 ? (
          <p className="col-span-full text-center py-8 text-muted-foreground">Nenhum torneio cadastrado</p>
        ) : (
          tournaments.map((tournament) => (
            <Card key={tournament.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tournament.title}</CardTitle>
                    <CardDescription className="mt-1">{tournament.type}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(tournament.status)}>
                    {getStatusLabel(tournament.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{tournament.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(tournament.start_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {tournament.max_participants && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Máx: {tournament.max_participants} jogadores</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(tournament)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tournament.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTournament ? 'Editar Torneio' : 'Novo Torneio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-input bg-background rounded-md">
                  <option value="torneio">Torneio</option>
                  <option value="evento">Evento</option>
                  <option value="competicao">Competição</option>
                  <option value="seasonal">Sazonal</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-input bg-background rounded-md">
                  <option value="planejado">Planejado</option>
                  <option value="inscricoes_abertas">Inscrições Abertas</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Data Início *</Label>
                <Input id="startDate" type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim *</Label>
                <Input id="endDate" type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                <Input id="maxParticipants" type="number" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="entryFee">Taxa Inscrição</Label>
                <Input id="entryFee" type="number" value={formData.entryFee} onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="prizePool">Premiação (JSON ou texto)</Label>
                <Textarea id="prizePool" value={formData.prizePool} onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })} rows={2} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="rules">Regras</Label>
                <Textarea id="rules" value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} rows={3} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input id="imageUrl" type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancelar</Button>
              <Button type="submit">{editingTournament ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
