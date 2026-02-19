"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Buscar eventos da API que já existe
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

  const filteredEvents = events.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

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
                {filteredEvents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
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
                      {new Date(item.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(item.endDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.participants.toLocaleString()}
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
                          <DropdownMenuItem className="gap-2">
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
