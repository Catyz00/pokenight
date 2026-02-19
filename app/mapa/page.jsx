'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/page-loader'
import { Map, ChevronLeft, ChevronRight, X, MapPin, Star } from 'lucide-react'

export default function Page() {
    const [maps, setMaps] = useState([])
    const [openIndex, setOpenIndex] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMaps()
    }, [])

    const fetchMaps = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/maps')
            if (response.ok) {
                const data = await response.json()
                setMaps(data.maps || [])
            }
        } catch (error) {
            console.error('Erro ao buscar mapas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        function onKey(e) {
            if (openIndex === null) return
            if (e.key === 'Escape') setOpenIndex(null)
            if (e.key === 'ArrowRight') setOpenIndex(i => (i === null ? null : Math.min(maps.length - 1, i + 1)))
            if (e.key === 'ArrowLeft') setOpenIndex(i => (i === null ? null : Math.max(0, i - 1)))
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [openIndex])

    function openAt(i) {
        setOpenIndex(i)
    }
    function close() {
        setOpenIndex(null)
    }
    function next() {
        setOpenIndex(i => Math.min(maps.length - 1, i + 1))
    }
    function prev() {
        setOpenIndex(i => Math.max(0, i - 1))
    }

    if (loading) {
        return <PageLoader rows={4} />
    }

    if (maps.length === 0) {
        return (
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Map className="mx-auto h-16 w-16 text-muted-foreground" />
                        <h3 className="mt-4 text-xl font-semibold text-foreground">
                            Nenhum mapa disponível
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Os mapas serão adicionados em breve!
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    const currentMap = openIndex !== null ? maps[openIndex] : null

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    {/* Pokémon acima do badge */}
                    <div className="flex justify-center mb-3">
                        <img 
                            src="/pokemon/pidgeot.png" 
                            alt="Pidgeot" 
                            className="w-24 h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </div>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-1.5">
                        <Map className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Explore o Mundo</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        <span>Mapas do </span> <span className='text-primary'>Servidor</span>
                    </h2>
                    <div
                        className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
                        aria-hidden="true"
                    />
                    <p className="mt-5 text-muted-foreground">
                        Clique em um mapa para visualizar em tamanho completo. Use ← → ou Esc para navegar.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {maps.map((m, i) => (
                        <Card 
                            key={m.id} 
                            className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                            onClick={() => openAt(i)}
                        >
                            <CardContent className="p-0">
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    {m.image_url ? (
                                        <img 
                                            src={m.image_url} 
                                            alt={m.name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                            <Map className="h-16 w-16 text-primary/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white">{m.name}</h3>
                                            {m.level_requirement > 0 && (
                                                <Badge variant="secondary" className="bg-black/50 text-white">
                                                    Lv. {m.level_requirement}+
                                                </Badge>
                                            )}
                                        </div>
                                        {m.map_type && (
                                            <p className="mt-1 text-sm text-white/80 capitalize">
                                                {m.map_type.replace('_', ' ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={openIndex !== null} onOpenChange={close}>
                    <DialogContent className="max-w-6xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <Map className="h-6 w-6 text-primary" />
                                {currentMap?.name}
                            </DialogTitle>
                            {currentMap?.description && (
                                <DialogDescription>
                                    {currentMap.description}
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        {currentMap && (
                            <>
                                {/* Informações do Mapa */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {currentMap.map_type && (
                                        <Badge variant="outline" className="capitalize">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {currentMap.map_type.replace('_', ' ')}
                                        </Badge>
                                    )}
                                    {currentMap.level_requirement > 0 && (
                                        <Badge variant="secondary">
                                            <Star className="mr-1 h-3 w-3" />
                                            Level {currentMap.level_requirement}+ necessário
                                        </Badge>
                                    )}
                                    {currentMap.available_pokemon && (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                            Pokémon disponíveis
                                        </Badge>
                                    )}
                                </div>

                                {/* Imagem do Mapa */}
                                <div className="relative max-h-[70vh] overflow-auto rounded-lg bg-muted p-4">
                                    {currentMap.image_url ? (
                                        <img 
                                            src={currentMap.image_url} 
                                            alt={currentMap.name}
                                            className="w-full rounded-md"
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/5">
                                            <Map className="h-24 w-24 text-primary/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Pokémon Disponíveis */}
                                {currentMap.available_pokemon && (
                                    <div className="rounded-lg border border-border bg-card p-4">
                                        <h4 className="mb-2 font-semibold text-foreground">Pokémon Disponíveis:</h4>
                                        <p className="text-sm text-muted-foreground">{currentMap.available_pokemon}</p>
                                    </div>
                                )}

                                {/* Navegação */}
                                <div className="flex items-center justify-between gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={prev}
                                        disabled={openIndex === 0}
                                        className="flex-1"
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {openIndex + 1} / {maps.length}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={next}
                                        disabled={openIndex === maps.length - 1}
                                        className="flex-1"
                                    >
                                        Próximo
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}