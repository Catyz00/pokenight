'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/page-loader'
import { Swords, Trophy, Flag, Target, Clock, Gift } from 'lucide-react'

const events = [
    {
        id: 1,
        title: "Duelo na Arena",
        when: "Diário · 12:00 - 17:00",
        startHour: 12,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        objective: "Vença 3 duelos contra outros jogadores.",
        rewards: "XP +50, Moedas +100",
        icon: Swords,
    },
    {
        id: 2,
        title: "Captura de Bandeira PVP",
        when: "Diário · 20:00 - 20:30",
        startHour: 20,
        startMinute: 0,
        endHour: 20,
        endMinute: 30,
        objective: "Recupere a bandeira inimiga 2 vezes.",
        rewards: "XP +80, Item raro (temporário)",
        icon: Flag,
    },
    {
        id: 3,
        title: "Caçada de Pilotos",
        when: "Diário · 21:00 - 21:30",
        startHour: 21,
        startMinute: 0,
        endHour: 21,
        endMinute: 30,
        objective: "Elimine 10 jogadores diferentes.",
        rewards: "XP +100, Cristais +20",
        icon: Target,
    },
]

// Função para verificar se o evento está acontecendo agora
const isEventHappening = (event) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    const startTimeInMinutes = event.startHour * 60 + event.startMinute
    const endTimeInMinutes = event.endHour * 60 + event.endMinute
    
    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes
}

export default function Page() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [loading, setLoading] = useState(true)

    // Atualizar o horário a cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000) // Atualiza a cada 1 minuto

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 650)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return <PageLoader rows={5} />
    }

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    {/* Pokémon acima do badge */}
                    <div className="flex justify-center mb-4">
                        <img 
                            src="/pokemon/lucario.png" 
                            alt="Lucario" 
                            className="w-24 h-24 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-300"
                        />
                    </div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-1.5">
                        <Swords className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Competição Diária</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        <span>Eventos </span> <span className='text-primary'>PVP</span>
                    </h2>
                    <div
                        className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
                        aria-hidden="true"
                    />
                    <p className="mt-5 text-muted-foreground">
                        Atividades competitivas entre jogadores — acompanhe os eventos diários
                    </p>
                </div>

                {/* Explicação PVP */}
                <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            O que é PVP?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-muted-foreground">
                        <p>
                            PVP (Player vs Player) é um modo de evento onde jogadores competem entre si em partidas ou objetivos específicos.
                            Nos eventos listados aqui, todas as ocorrências são <strong className="text-foreground">diárias</strong>: aparecem todo dia em horários definidos,
                            com requisitos claros e recompensas por participação e desempenho.
                        </p>
                        <ul className="ml-6 space-y-1 list-disc">
                            <li>Participação diária — entre no horário e complete os objetivos</li>
                            <li>Recompensas limitadas — resgate no mesmo dia</li>
                            <li>Competição direta contra outros jogadores ou times</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Grid de Eventos */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => {
                        const isHappening = isEventHappening(event)
                        
                        return (
                            <Card 
                                key={event.id} 
                                className={`group border-2 transition-all ${
                                    isHappening 
                                        ? 'border-red-500 shadow-lg shadow-red-500/30 animate-pulse' 
                                        : 'hover:border-primary hover:shadow-lg hover:shadow-primary/20'
                                }`}
                            >
                                <CardHeader>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className={`rounded-lg p-2.5 ${
                                            isHappening ? 'bg-red-500/10' : 'bg-primary/10'
                                        }`}>
                                            <event.icon className={`h-6 w-6 ${
                                                isHappening ? 'text-red-500' : 'text-primary'
                                            }`} />
                                        </div>
                                        {isHappening ? (
                                            <Badge className="gap-1 bg-red-500 hover:bg-red-600">
                                                <Clock className="h-3 w-3" />
                                                Acontecendo agora
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                Diário
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl">{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Horário</p>
                                                <p className="text-sm text-muted-foreground">{event.when}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Objetivo</p>
                                                <p className="text-sm text-muted-foreground">{event.objective}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Recompensas</p>
                                                <p className="text-sm text-muted-foreground">{event.rewards}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        💡 Observação: horários e objetivos podem mudar entre temporadas. Verifique diariamente para não perder as recompensas.
                    </p>
                </div>
            </div>
        </section>
    )
}