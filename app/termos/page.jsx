'use client'

import TermosCondicoes from '@/components/regras/termos-condicoes'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center">
        {/* Pokémon acima do título */}
        <div className="flex justify-center mb-4">
          <img 
            src="/pokemon/alakazam.png" 
            alt="Alakazam" 
            className="w-24 h-24 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-300"
          />
        </div>

        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          <span>Termos e </span> <span className='text-primary'>Condições</span>
        </h2>
        <div
          className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
          aria-hidden="true"
        />
        <p className="mt-5 text-muted-foreground text-lg">
          Leia atentamente todos os termos e condições antes de jogar. O desconhecimento das regras não isenta o jogador de punições.
        </p>
      </div>

      <Alert className="mb-8 border-2 border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="text-sm">
          <strong>Importante:</strong> As regras podem ser alteradas sem aviso prévio. Verifique-as regularmente. 
          Ninguém é obrigado a jogar o PokeNight. Se não concordar com estas regras, não jogue e não faça doações.
        </AlertDescription>
      </Alert>

      <TermosCondicoes />
    </div>
  )
}
