"use client"

import { useState, Suspense } from "react"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Ban, Shield, Mail, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

// Dados de exemplo - na versao real viram do PHP/MariaDB
const initialPlayers = [
  {
    id: 1,
    name: "ZaRaKl KeNChi",
    email: "zaraki@email.com",
    level: 1970,
    clan: "Warriors",
    status: "Online",
    lastSeen: "2026-01-21",
    banned: false,
  },
  {
    id: 2,
    name: "DuDuNR",
    email: "dudunr@email.com",
    level: 1813,
    clan: "Elite",
    status: "Offline",
    lastSeen: "2026-01-20",
    banned: false,
  },
  {
    id: 3,
    name: "A B E L",
    email: "abel@email.com",
    level: 1803,
    clan: "Champions",
    status: "Online",
    lastSeen: "2026-01-21",
    banned: false,
  },
  {
    id: 4,
    name: "WeSLeYZZz",
    email: "wesley@email.com",
    level: 1737,
    clan: "Warriors",
    status: "Offline",
    lastSeen: "2026-01-19",
    banned: false,
  },
  {
    id: 5,
    name: "HackerBoy123",
    email: "hacker@email.com",
    level: 500,
    clan: "-",
    status: "Banido",
    lastSeen: "2026-01-10",
    banned: true,
  },
  {
    id: 6,
    name: "N i k l a u s",
    email: "niklaus@email.com",
    level: 1716,
    clan: "Elite",
    status: "Online",
    lastSeen: "2026-01-21",
    banned: false,
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Online":
      return "bg-emerald-500/20 text-emerald-400"
    case "Offline":
      return "bg-zinc-500/20 text-zinc-400"
    case "Banido":
      return "bg-red-500/20 text-red-400"
    default:
      return "bg-zinc-500/20 text-zinc-400"
  }
}

export default function AdminJogadores() {
  const [players, setPlayers] = useState(initialPlayers)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  const filteredPlayers = players.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleBan = (id) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? {
              ...player,
              banned: !player.banned,
              status: player.banned ? "Offline" : "Banido",
            }
          : player
      )
    )
  }

  const onlineCount = players.filter((p) => p.status === "Online").length
  const bannedCount = players.filter((p) => p.banned).length

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jogadores</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os jogadores registrados no servidor
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{players.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Jogadores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
                  <p className="text-sm text-muted-foreground">Online Agora</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-500/20 p-2">
                  <Ban className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bannedCount}</p>
                  <p className="text-sm text-muted-foreground">Banidos</p>
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
                  placeholder="Buscar por nome ou email..."
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
                  Online
                </Button>
                <Button variant="ghost" size="sm">
                  Banidos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Lista de Jogadores</CardTitle>
            <CardDescription>
              {filteredPlayers.length} jogadores encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jogador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Cla</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ultimo Acesso</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id} className={player.banned ? "opacity-60" : ""}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell className="text-muted-foreground">{player.email}</TableCell>
                    <TableCell className="tabular-nums font-bold text-primary">
                      {player.level}
                    </TableCell>
                    <TableCell>{player.clan}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(player.status)}>
                        {player.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(player.lastSeen).toLocaleDateString("pt-BR")}
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
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Mail className="h-4 w-4" />
                            Enviar Mensagem
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Shield className="h-4 w-4" />
                            Alterar Permissoes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={`gap-2 ${player.banned ? "text-emerald-500" : "text-destructive"}`}
                            onClick={() => toggleBan(player.id)}
                          >
                            <Ban className="h-4 w-4" />
                            {player.banned ? "Desbanir" : "Banir Jogador"}
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
