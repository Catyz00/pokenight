'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Map, ChevronLeft, ChevronRight, X } from 'lucide-react'

const maps = [
    { id: 1, name: 'Cidade', src: '/maps/cidade.jpg', alt: 'Mapa da Cidade' },
    { id: 2, name: 'Floresta', src: '/maps/floresta.jpg', alt: 'Mapa da Floresta' },
    { id: 3, name: 'Deserto', src: '/maps/deserto.jpg', alt: 'Mapa do Deserto' },
    { id: 4, name: 'Montanha', src: '/maps/montanha.jpg', alt: 'Mapa da Montanha' },
    { id: 5, name: 'Ilha', src: '/maps/ilha.jpg', alt: 'Mapa da Ilha' },
]

export default function Page() {
    const [openIndex, setOpenIndex] = useState(null)

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

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
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
                                    <img 
                                        src={m.src} 
                                        alt={m.alt}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-xl font-bold text-white">{m.name}</h3>
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
                                {openIndex !== null && maps[openIndex].name}
                            </DialogTitle>
                        </DialogHeader>

                        {openIndex !== null && (
                            <>
                                <div className="relative max-h-[70vh] overflow-auto rounded-lg bg-muted p-4">
                                    <img 
                                        src={maps[openIndex].src} 
                                        alt={maps[openIndex].alt}
                                        className="w-full rounded-md"
                                    />
                                </div>

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