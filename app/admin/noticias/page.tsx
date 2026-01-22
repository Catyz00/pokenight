"use client"

import { useState } from "react"
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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

// Dados de exemplo - na versao real viram do PHP/MariaDB
const initialNews = [
  {
    id: 1,
    title: "Novo Pokemon Lendario Disponivel!",
    category: "Evento",
    status: "Publicado",
    date: "2026-01-20",
    views: 1234,
  },
  {
    id: 2,
    title: "Atualizacao de Balanceamento v2.5",
    category: "Atualizacao",
    status: "Publicado",
    date: "2026-01-18",
    views: 856,
  },
  {
    id: 3,
    title: "Torneio Mensal de Janeiro",
    category: "Torneio",
    status: "Publicado",
    date: "2026-01-15",
    views: 2341,
  },
  {
    id: 4,
    title: "Manutencao Programada",
    category: "Aviso",
    status: "Rascunho",
    date: "2026-01-14",
    views: 0,
  },
  {
    id: 5,
    title: "Novo Mapa: Caverna Cristal",
    category: "Conteudo",
    status: "Publicado",
    date: "2026-01-12",
    views: 1567,
  },
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Evento":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "Torneio":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "Aviso":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "Atualizacao":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Publicado":
      return "bg-emerald-500/20 text-emerald-400"
    case "Rascunho":
      return "bg-amber-500/20 text-amber-400"
    default:
      return "bg-zinc-500/20 text-zinc-400"
  }
}

export default function AdminNoticias() {
  const [news, setNews] = useState(initialNews)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setNews(news.filter((item) => item.id !== id))
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Noticias</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie as noticias e publicacoes do site
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Noticia
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar noticias..."
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
                  Publicados
                </Button>
                <Button variant="ghost" size="sm">
                  Rascunhos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Lista de Noticias</CardTitle>
            <CardDescription>
              {filteredNews.length} noticias encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.views.toLocaleString()}
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
