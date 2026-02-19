"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  TicketIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Filter,
  Search,
  Trash2
} from 'lucide-react'

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'todos',
    category: 'todos',
    priority: 'todos',
    search: ''
  })
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [response, setResponse] = useState('')
  const [statusUpdate, setStatusUpdate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status !== 'todos') params.append('status', filters.status)
      if (filters.category !== 'todos') params.append('category', filters.category)
      if (filters.priority !== 'todos') params.append('priority', filters.priority)

      const response = await fetch(`/api/admin/tickets?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setTickets(data.tickets)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [filters.status, filters.category, filters.priority])

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`)
      const data = await response.json()

      if (response.ok) {
        setSelectedTicket(data.ticket)
        setStatusUpdate(data.ticket.status)
        setResponse(data.ticket.response || '')
      }
    } catch (error) {
      console.error('Erro ao buscar ticket:', error)
    }
  }

  const handleRespondTicket = async () => {
    if (!response || !user) return

    setSubmitting(true)
    setAlert(null)

    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response,
          adminId: user.id,
          status: statusUpdate
        })
      })

      const data = await res.json()

      if (res.ok) {
        setAlert({ type: 'success', message: data.message })
        setSelectedTicket(null)
        setResponse('')
        fetchTickets()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao responder ticket:', error)
      setAlert({ type: 'error', message: 'Erro ao responder ticket' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm('Tem certeza que deseja deletar este ticket?')) return

    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setAlert({ type: 'success', message: data.message })
        fetchTickets()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao deletar ticket:', error)
      setAlert({ type: 'error', message: 'Erro ao deletar ticket' })
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'aberto': 'bg-blue-500',
      'em_andamento': 'bg-yellow-500',
      'resolvido': 'bg-green-500',
      'fechado': 'bg-gray-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'aberto': 'Aberto',
      'em_andamento': 'Em Andamento',
      'resolvido': 'Resolvido',
      'fechado': 'Fechado'
    }
    return labels[status] || status
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'ajuda': 'Ajuda',
      'reclamacao': 'Reclamação',
      'bug': 'Bug',
      'sugestao': 'Sugestão',
      'outro': 'Outro'
    }
    return labels[category] || category
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'baixa': 'bg-gray-500',
      'media': 'bg-blue-500',
      'alta': 'bg-orange-500',
      'urgente': 'bg-red-500'
    }
    return colors[priority] || 'bg-gray-500'
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        ticket.subject.toLowerCase().includes(search) ||
        ticket.username.toLowerCase().includes(search) ||
        ticket.id.toString().includes(search)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tickets de Suporte</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie e responda aos tickets enviados pelos jogadores
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Abertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.abertos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.em_andamento}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Resolvidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvidos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                Fechados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.fechados}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ID, assunto ou usuário..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="todos">Todos</option>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
            <div>
              <Label>Categoria</Label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="todos">Todas</option>
                <option value="ajuda">Ajuda</option>
                <option value="reclamacao">Reclamação</option>
                <option value="bug">Bug</option>
                <option value="sugestao">Sugestão</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="todos">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Nenhum ticket encontrado</p>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono">
                        #{ticket.id}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                      <Badge variant="secondary">
                        {getCategoryLabel(ticket.category)}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      {ticket.has_response && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Respondido
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: <span className="font-medium">{ticket.username}</span></span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ticket.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTicket(ticket.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Ver/Responder
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Resposta */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              Responda ao ticket do jogador {selectedTicket?.username}
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              {/* Info do Ticket */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {getStatusLabel(selectedTicket.status)}
                  </Badge>
                  <Badge variant="secondary">
                    {getCategoryLabel(selectedTicket.category)}
                  </Badge>
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  Criado em {new Date(selectedTicket.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Mensagem Original */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <Label className="text-sm font-semibold">Mensagem do Jogador:</Label>
                <p className="mt-2 whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* Resposta Anterior (se houver) */}
              {selectedTicket.response && (
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Resposta Anterior:
                  </Label>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{selectedTicket.response}</p>
                  {selectedTicket.responder_name && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Por: {selectedTicket.responder_name} em{' '}
                      {new Date(selectedTicket.responded_at).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              )}

              {/* Status */}
              <div>
                <Label>Status do Ticket</Label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="fechado">Fechado</option>
                </select>
              </div>

              {/* Nova Resposta */}
              <div>
                <Label htmlFor="response">
                  {selectedTicket.response ? 'Atualizar Resposta' : 'Sua Resposta'}
                </Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Digite sua resposta ao jogador..."
                  rows={6}
                  className="mt-1 resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRespondTicket} disabled={submitting || !response}>
              {submitting ? 'Enviando...' : 'Enviar Resposta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
