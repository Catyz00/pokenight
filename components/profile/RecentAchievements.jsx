// Componente de conquistas recentes baseado nas storages do personagem
import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Lista fixa das conquistas/quests
const QUESTS = [
  { name: 'First Stone', storage: 31441546 },
  { name: 'Earth Stone', storage: 2353463 },
  { name: 'Venom Stone', storage: 2353465 },
  { name: 'Darkness Stone', storage: 2353462 },
  { name: 'Punch Stone', storage: 2353461 },
  { name: 'Rayquaza', storage: 243243 },
  { name: 'Rock Stone', storage: 2353464 },
  { name: 'Boost Free', storage: 2353468 },
  { name: 'Boost Hell', storage: 2353467 },
  { name: 'Boost Ice', storage: 2353466 },
  { name: '20 HDS', storage: 4234563 },
  { name: 'The Begginer - Origins of Creation', storage: 4234564 },
]

export default function RecentAchievements({ storages }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {QUESTS.map((quest) => {
        const completed = storages?.[quest.storage] === 1
        return (
          <div
            key={quest.storage}
            className={
              'flex items-center gap-3 rounded-lg border px-4 py-3 bg-background shadow-sm ' +
              (completed
                ? 'border-green-400/60 bg-green-50/60'
                : 'border-muted/40 bg-muted/30')
            }
          >
            <div className={completed ? 'text-green-600' : 'text-gray-400'}>
              {completed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className={completed ? 'font-semibold text-green-700' : 'font-semibold text-gray-500'}>
                {quest.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Storage: {quest.storage}</div>
            </div>
            <Badge variant={completed ? 'default' : 'secondary'} className={completed ? 'bg-green-600/90 text-white' : 'bg-gray-300 text-gray-600'}>
              {completed ? 'Completa' : 'Não completa'}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}
