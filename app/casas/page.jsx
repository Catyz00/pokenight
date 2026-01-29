'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
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

const mockCasas = [
    { 
        id: 1, 
        nome: "Apartamento 5*", 
        numero: "#69",
        mundo: "Green", 
        cidade: "Saffron", 
        dono: "Katrinny",
        preco: 31605,
        fazias: true, 
        aSerDespejado: false,
        imagemMapa: "/maps/saffron.jpg"
    },
    { 
        id: 2, 
        nome: "Casa Luxo", 
        numero: "#12",
        mundo: "Green", 
        cidade: "Celadon", 
        dono: "PlayerOne",
        preco: 45000,
        fazias: false, 
        aSerDespejado: true,
        imagemMapa: "/maps/celadon.jpg"
    },
    { 
        id: 3, 
        nome: "Apartamento 3*", 
        numero: "#45",
        mundo: "Red", 
        cidade: "Vermilion", 
        dono: "TrainerMaster",
        preco: 22000,
        fazias: false, 
        aSerDespejado: false,
        imagemMapa: "/maps/vermilion.jpg"
    },
    { 
        id: 4, 
        nome: "Villa Premium", 
        numero: "#8",
        mundo: "Blue", 
        cidade: "Lavender", 
        dono: "",
        preco: 55000,
        fazias: true, 
        aSerDespejado: false,
        imagemMapa: "/maps/lavender.jpg"
    },
]

export default function CasasPage() {
    const [mundo, setMundo] = useState("todos")
    const [cidade, setCidade] = useState("todas")
    const [somenteFazias, setSomenteFazias] = useState(false)
    const [aSerDespejado, setASerDespejado] = useState(false)
    const [resultados, setResultados] = useState([])
    const [mostrouResumo, setMostrouResumo] = useState(false)

    // Opções de Mundo únicas a partir dos dados
    const mundos = useMemo(() => {
        const uniq = Array.from(new Set(mockCasas.map(c => c.mundo)))
        return ["todos", ...uniq]
    }, [])

    // Cidades disponíveis dependendo do mundo selecionado
    const cidadesDisponiveis = useMemo(() => {
        const filtradas = mundo === "todos" ? mockCasas : mockCasas.filter(c => c.mundo === mundo)
        const uniq = Array.from(new Set(filtradas.map(c => c.cidade)))
        return ["todas", ...uniq]
    }, [mundo])

    function handlePesquisar(e) {
        e.preventDefault()
        let filtrado = mockCasas

        if (mundo !== "todos") filtrado = filtrado.filter(c => c.mundo === mundo)
        if (cidade !== "todas") filtrado = filtrado.filter(c => c.cidade === cidade)
        if (somenteFazias) filtrado = filtrado.filter(c => c.fazias)
        if (aSerDespejado) filtrado = filtrado.filter(c => c.aSerDespejado)

        setResultados(filtrado)
        setMostrouResumo(true)
    }

    function handleLimpar() {
        setMundo("todos")
        setCidade("todas")
        setSomenteFazias(false)
        setASerDespejado(false)
        setResultados([])
        setMostrouResumo(false)
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
                        <form onSubmit={handlePesquisar} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="mundo">Mundo</Label>
                                    <Select value={mundo} onValueChange={(value) => { setMundo(value); setCidade("todas"); }}>
                                        <SelectTrigger id="mundo">
                                            <SelectValue placeholder="Selecione o mundo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mundos.map(m => (
                                                <SelectItem key={m} value={m}>
                                                    {m === 'todos' ? 'Todos os Mundos' : m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade</Label>
                                    <Select value={cidade} onValueChange={setCidade}>
                                        <SelectTrigger id="cidade">
                                            <SelectValue placeholder="Selecione a cidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cidadesDisponiveis.map(c => (
                                                <SelectItem key={c} value={c}>
                                                    {c === 'todas' ? 'Todas as Cidades' : c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <Label htmlFor="fazias" className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm">Somente fazias</span>
                                    <Switch
                                        id="fazias"
                                        checked={somenteFazias}
                                        onCheckedChange={setSomenteFazias}
                                    />
                                </Label>

                                <Label htmlFor="despejado" className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm">A ser despejado</span>
                                    <Switch
                                        id="despejado"
                                        checked={aSerDespejado}
                                        onCheckedChange={setASerDespejado}
                                    />
                                </Label>
                            </div>

                            <div className="flex justify-center gap-2">
                                <Button type="submit">
                                    <Search className="mr-2 h-4 w-4" />
                                    Pesquisar
                                </Button>
                                <Button type="button" variant="outline" onClick={handleLimpar}>
                                    <X className="mr-2 h-4 w-4" />
                                    Limpar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Resultados */}
                {mostrouResumo && (
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-primary" />
                                    Casas do Mundo: <span className="text-primary">{mundo === 'todos' ? 'Todos' : mundo}</span>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {resultados.length} {resultados.length === 1 ? 'casa encontrada' : 'casas encontradas'}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {resultados.length === 0 ? (
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
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Mapa</TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Cidade</TableHead>
                                                <TableHead>Dono</TableHead>
                                                <TableHead className="text-right">Preço</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultados.map(casa => (
                                                <TableRow key={casa.id}>
                                                    <TableCell>
                                                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                                            <MapPin className="h-6 w-6 text-primary" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {casa.nome} {casa.numero}
                                                    </TableCell>
                                                    <TableCell>{casa.cidade}</TableCell>
                                                    <TableCell>
                                                        {casa.dono || <span className="text-muted-foreground italic">Disponível</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-primary">
                                                        {casa.preco.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    )
}