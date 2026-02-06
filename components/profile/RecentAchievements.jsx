// Componente de conquistas recentes baseado nas storages do personagem
import React from 'react'
import { Check, X } from 'lucide-react'

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
  const total = QUESTS.length
  const completed = QUESTS.filter((q) => storages?.[q.storage] === 1).length
  const percent = Math.round((completed / total) * 100)

  return (
    <div className="w-full">
      {/* Barra de progresso */}
      <div className="mb-6 w-full">
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-sm font-medium text-muted-foreground">
            Progresso das Quests
          </span>
        </div>
        <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-6 bg-green-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
          <span
            className="absolute w-full text-center text-xs font-bold text-white z-10 top-1 left-0 select-none"
            style={{ textShadow: '0 1px 2px #0008' }}
          >
            {percent}%
          </span>
        </div>
      </div>
      {/* Grid 3 colunas para as quests, ocupando toda a largura */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {QUESTS.map((quest) => {
          const isCompleted = storages?.[quest.storage] === 1
          return (
            <div
              key={quest.storage}
              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-muted shadow-sm"
            >
              <span
                className={
                  'flex items-center justify-center rounded-full w-7 h-7 border-2 text-lg ' +
                  (isCompleted
                    ? 'border-green-500 bg-green-100 text-green-600'
                    : 'border-red-500 bg-red-100 text-red-600')
                }
              >
                {isCompleted ? <Check size={18} /> : <X size={18} />}
              </span>
              <span
                className={
                  'font-semibold break-words ' +
                  (isCompleted ? 'text-green-700' : 'text-red-600')
                }
              >
                {quest.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
