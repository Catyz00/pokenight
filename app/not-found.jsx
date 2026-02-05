'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageLoader } from '@/components/ui/page-loader'

export default function NotFound() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento da página 404
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLoader rows={3} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 text-center">
          {/* Psyduck confuso */}
          <div className="mb-8 relative">
            <div className=" flex justify-center">
              <div className="relative w-28 h-28">
                <Image
                  src="/psyduck-confuso.png"
                  alt="Psyduck confuso"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
              <div className="flex gap-2">
                <span className="text-4xl animate-pulse">❓</span>
                <span className="text-4xl animate-pulse delay-100">❓</span>
                <span className="text-4xl animate-pulse delay-200">❓</span>
              </div>
            </div>
          </div>

          {/* Código de erro */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-[var(--color-pokenight-yellow)] mb-2">
              404
            </h1>
            <h2 className="text-3xl font-semibold mb-4">
              Psyduck está confuso!
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Esta página está em construção ou não foi encontrada.
            </p>
            <p className="text-sm text-muted-foreground">
              Parece que você se perdeu na Tall Grass...
            </p>
          </div>

          {/* Mensagem temática */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 border-2 border-dashed border-[var(--color-pokenight-yellow)]/30">
            <p className="text-sm italic text-muted-foreground mb-3">
              "Wild MISSINGNO. appeared!"
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-destructive">🚧</span>
                <span>Esta área ainda está sendo desenvolvida</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>⚙️</span>
                <span>Nossos desenvolvedores estão treinando para concluí-la</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[var(--color-pokenight-yellow)]">✨</span>
                <span>Em breve estará disponível!</span>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                🏠 Voltar para Home
              </Button>
            </Link>
            <Link href="/ranking">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                🏆 Ver Rankings
              </Button>
            </Link>
          </div>

          {/* Easter egg */}
          <div className="mt-8 text-xs text-muted-foreground">
            <p>Dica: Use Fly ou Teleport para voltar à civilização!</p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}
