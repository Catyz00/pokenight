'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy } from 'lucide-react'

// Dados mockados - substituir pela API real quando disponível
const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    playerName: 'Ash',
    achievement: 'capturou seu primeiro Legendary!',
    time: '2 min',
  },
  {
    id: 2,
    playerName: 'Misty',
    achievement: 'completou a Pokédex da Região Kanto',
    time: '5 min',
  },
  {
    id: 3,
    playerName: 'Brock',
    achievement: 'derrotou o Elite Four',
    time: '8 min',
  },
  {
    id: 4,
    playerName: 'Gary',
    achievement: 'alcançou Level 100',
    time: '12 min',
  },
  {
    id: 5,
    playerName: 'Red',
    achievement: 'venceu 100 batalhas consecutivas',
    time: '15 min',
  },
  {
    id: 6,
    playerName: 'Blue',
    achievement: 'capturou um Shiny Charizard',
    time: '18 min',
  },
  {
    id: 7,
    playerName: 'Lance',
    achievement: 'treinou 50 Pokémon diferentes',
    time: '22 min',
  },
  {
    id: 8,
    playerName: 'Cynthia',
    achievement: 'primeira vitória no Ranked',
    time: '25 min',
  },
]

export function RecentAchievements() {
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS)

  // Simula atualizações em tempo real (remover quando conectar à API real)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula uma nova conquista aparecendo no topo
      const newAchievement = {
        id: Date.now(),
        playerName: ['Ash', 'Misty', 'Brock', 'Gary', 'Red', 'Blue', 'Lance', 'Cynthia'][Math.floor(Math.random() * 8)],
        achievement: [
          'capturou um Pokémon raro',
          'venceu uma batalha épica',
          'subiu de nível',
          'completou uma quest',
          'encontrou um item especial',
          'derrotou um Boss',
          'capturou um Shiny',
        ][Math.floor(Math.random() * 7)],
        time: 'agora',
      }

      setAchievements((prev) => [newAchievement, ...prev.slice(0, 19)])
    }, 8000) // Nova conquista a cada 8 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-[var(--color-pokenight-yellow)]" />
            <h2 className="text-3xl font-bold">Conquistas Recentes</h2>
          </div>
          <p className="text-muted-foreground">
            Acompanhe em tempo real as conquistas da comunidade
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Feed ao Vivo</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 border border-border/50"
                    style={{
                      animation: index === 0 ? 'slideIn 0.5s ease-out' : 'none',
                    }}
                  >
                    {/* Numeração */}
                    <div className="text-xs text-muted-foreground font-mono min-w-[2rem] pt-1">
                      {achievements.length - index}.
                    </div>

                    {/* Conteúdo do chat */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-[var(--color-pokenight-yellow)]">
                          {achievement.playerName}
                        </span>
                        {' '}
                        <span className="text-foreground">
                          {achievement.achievement}
                        </span>
                      </p>
                    </div>

                    {/* Tempo */}
                    <div className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                      {achievement.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Nota para desenvolvedores */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          💡 <strong>Dev Note:</strong> Dados mockados - substituir pela API real em{' '}
          <code className="bg-muted px-2 py-1 rounded">/api/achievements</code>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  )
}
