'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Home, MapPin, Search, X, HelpCircle } from 'lucide-react'
import Link from 'next/link'

// Mapeamento de cidades
const townNames = {
  1: 'Saffron',
  2: 'Cerulean',
  3: 'Lavender',
  4: 'Fuchsia',
  5: 'Celadon',
  6: 'Pallet',
  7: 'Orre',
  8: 'Pewter',
  9: 'Viridian',
  10: 'Vermilion',
  11: 'Cinnabar',
  12: 'Singer',
  13: 'Larosse',
  14: 'Hunter Village',
  15: 'Sunshine',
  16: 'Canavale',
  17: 'Goldenrod',
  18: 'Azalea',
  19: 'Ecruteak',
  20: 'Olivine',
  21: 'Violet',
  22: 'Cherrygrove',
  23: 'New Bark',
  24: 'Mahogany',
  25: 'Battle City',
  26: 'Black City',
  27: 'Hamlin Island',
  28: 'Cianwood'
}

export default function CasasPage() {
  const [casas, setCasas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroCidade, setFiltroCidade] = useState('all')
  const [mostrarApenasDisponiveis, setMostrarApenasDisponiveis] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const ITENS_POR_PAGINA = 20

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch('/api/houses')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar casas')
        }

        setCasas(data.houses)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHouses()
  }, [])

  // Cidades disponíveis baseado nas casas que existem
  const cidadesDisponiveis = useMemo(() => {
    const cidadesComCasas = Array.from(new Set(casas.map(c => c.town)))
      .filter(townId => townNames[townId]) // Só incluir se tiver nome mapeado
      .map(townId => townNames[townId])
      .sort()
    return ['all', ...cidadesComCasas]
  }, [casas])

  // Filtrar casas
  const casasFiltradas = useMemo(() => {
    let filtrado = casas

    if (filtroTexto) {
      filtrado = filtrado.filter(c => 
        c.name.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        (c.owner_name && c.owner_name.toLowerCase().includes(filtroTexto.toLowerCase()))
      )
    }

    if (filtroCidade !== 'all') {
      filtrado = filtrado.filter(c => townNames[c.town] === filtroCidade)
    }

    if (mostrarApenasDisponiveis) {
      filtrado = filtrado.filter(c => !c.owner_name && (!c.owner || c.owner === 0))
    }

    return filtrado
  }, [casas, filtroTexto, filtroCidade, mostrarApenasDisponiveis])

  // Paginação
  const totalPaginas = Math.ceil(casasFiltradas.length / ITENS_POR_PAGINA)
  const casasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
    const fim = inicio + ITENS_POR_PAGINA
    return casasFiltradas.slice(inicio, fim)
  }, [casasFiltradas, paginaAtual])

  // Reset página quando filtros mudam
  useEffect(() => {
    setPaginaAtual(1)
  }, [filtroTexto, filtroCidade, mostrarApenasDisponiveis])

  function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR').format(price)
  }

  function handleLimpar() {
    setFiltroTexto('')
    setFiltroCidade('all')
    setMostrarApenasDisponiveis(false)
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto" />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-destructive">Erro ao carregar casas: {error}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-1.5">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Encontre seu Lar</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl flex items-center justify-center gap-2">
            <span>Casas do </span> 
            <span className='text-primary'>Mundo</span>
            <Link 
              href="/wiki/casas" 
                            className="inline-flex rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              title="Ajuda sobre casas"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>
          </h2>
          <div
            className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
            aria-hidden="true"
          />
          <p className="mt-5 text-muted-foreground">
            Pesquise e encontre a casa perfeita para você
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="busca">Buscar por nome ou dono</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="busca"
                    type="text"
                    placeholder="Digite para buscar..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {filtroTexto && (
                    <button
                      onClick={() => setFiltroTexto('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Select value={filtroCidade} onValueChange={setFiltroCidade}>
                  <SelectTrigger id="cidade">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Cidades</SelectItem>
                    {cidadesDisponiveis.filter(c => c !== 'all').map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disponiveis" className="block">Disponibilidade</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id="disponiveis"
                    checked={mostrarApenasDisponiveis}
                    onCheckedChange={setMostrarApenasDisponiveis}
                  />
                  <span className="text-sm">Somente disponíveis</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={handleLimpar} size="sm">
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Casas Disponíveis
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {casasFiltradas.length} {casasFiltradas.length === 1 ? 'casa encontrada' : 'casas encontradas'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {casasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Home className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhuma casa encontrada com os filtros atuais
                </p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros de pesquisa
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Dono</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Aluguel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casasPaginadas.map((casa, index) => (
                      <TableRow key={`${casa.id}-${index}`}>
                        <TableCell className="font-medium">
                          {casa.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {townNames[casa.town] || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {casa.tiles} tiles • {casa.beds} camas
                          </div>
                        </TableCell>
                        <TableCell>
                          {casa.owner_name ? (
                            <Link 
                              href={`/personagem/${casa.owner_name}`}
                              className="text-primary hover:underline"
                            >
                              {casa.owner_name}
                            </Link>
                          ) : (
                            <span className="text-emerald-600 font-semibold italic">Disponível</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatPrice(casa.price)} gold
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {casa.rent > 0 ? `${formatPrice(casa.rent)} gold` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                            className={paginaAtual === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {[...Array(totalPaginas)].map((_, i) => {
                          const pageNum = i + 1
                          // Mostrar primeira página, última página, página atual e vizinhas
                          if (
                            pageNum === 1 ||
                            pageNum === totalPaginas ||
                            (pageNum >= paginaAtual - 1 && pageNum <= paginaAtual + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  onClick={() => setPaginaAtual(pageNum)}
                                  isActive={paginaAtual === pageNum}
                                  className="cursor-pointer"
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          } else if (
                            pageNum === paginaAtual - 2 ||
                            pageNum === paginaAtual + 2
                          ) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }
                          return null
                        })}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                            className={paginaAtual === totalPaginas ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}