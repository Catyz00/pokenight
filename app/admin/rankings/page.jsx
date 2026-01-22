"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Pencil, Trash2, Trophy, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

// Dados de exemplo - na versao real viram do PHP/MariaDB
const initialRankings = {
  level: [
    { id: 1, rank: "Gold", score: 1803, name: "A B E L" },
    { id: 2, rank: "Red", score: 1970, name: "ZaRaKl KeNChi" },
    { id: 3, rank: "Green", score: 1813, name: "DuDuNR" },
    { id: 4, rank: "Silver", score: 1737, name: "WeSLeYZZz" },
    { id: 5, rank: "Blue", score: 1716, name: "N i k l a u s" },
    { id: 6, rank: "Black", score: 1700, name: "Sr Diniz" },
    { id: 7, rank: "Purple", score: 1355, name: "SAVAGE ROMANTICO" },
  ],
}

const rankColors = [
  { value: "Gold", label: "Gold", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "Silver", label: "Silver", color: "bg-slate-400/20 text-slate-300 border-slate-400/30" },
  { value: "Red", label: "Red", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "Green", label: "Green", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "Blue", label: "Blue", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "Black", label: "Black", color: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50" },
  { value: "Purple", label: "Purple", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
]

const getRankColor = (rank) => {
  const found = rankColors.find((r) => r.value === rank)
  return found?.color || "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
}

export default function AdminRankings() {
  const searchParams = useSearchParams()
  const [rankings, setRankings] = useState(initialRankings.level)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("level")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    rank: "Gold",
    score: "",
  })

  const filteredRankings = rankings
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.score - a.score)

  const handleDelete = (id) => {
    setRankings(rankings.filter((item) => item.id !== id))
  }

  const handleEdit = (player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      rank: player.rank,
      score: player.score.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingPlayer) {
      setRankings(
        rankings.map((item) =>
          item.id === editingPlayer.id
            ? { ...item, name: formData.name, rank: formData.rank, score: parseInt(formData.score) }
            : item
        )
      )
    } else {
      setRankings([
        ...rankings,
        {
          id: Math.max(...rankings.map((r) => r.id)) + 1,
          name: formData.name,
          rank: formData.rank,
          score: parseInt(formData.score),
        },
      ])
    }
    setIsDialogOpen(false)
    setEditingPlayer(null)
    setFormData({ name: "", rank: "Gold", score: "" })
  }

  const handleNewPlayer = () => {
    setEditingPlayer(null)
    setFormData({ name: "", rank: "Gold", score: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rankings</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os rankings e posicoes dos jogadores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Sincronizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleNewPlayer}>
                <Plus className="h-4 w-4" />
                Adicionar Jogador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPlayer ? "Editar Jogador" : "Adicionar Jogador"}
                </DialogTitle>
                <DialogDescription>
                  {editingPlayer
                    ? "Edite as informacoes do jogador no ranking"
                    : "Adicione um novo jogador ao ranking"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Jogador</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do jogador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Select
                    value={formData.rank}
                    onValueChange={(value) => setFormData({ ...formData, rank: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {rankColors.map((rank) => (
                        <SelectItem key={rank.value} value={rank.value}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={rank.color}>
                              +{rank.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">Pontuacao</Label>
                  <Input
                    id="score"
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="Pontuacao"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "level", label: "Top Level" },
          { id: "tournament", label: "Torneio" },
          { id: "catch", label: "Capturas" },
          { id: "pokedex", label: "Pokedex" },
          { id: "bestiary", label: "Bestiario" },
          { id: "tower", label: "Torre" },
        ].map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar jogador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Top Level
          </CardTitle>
          <CardDescription>
            {filteredRankings.length} jogadores no ranking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Posicao</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-right">Pontuacao</TableHead>
                <TableHead className="w-[100px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRankings.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRankColor(item.rank)}>
                      +{item.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-primary">
                    {item.score.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function Loading() {
  return null
}
