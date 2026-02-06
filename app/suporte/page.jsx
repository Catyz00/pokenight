'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/page-loader'
import { Mail, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react'

export default function SuportePage() {
  const [loading, setLoading] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const email = 'pokenightguiis7@gmail.com'
  const discordInvite = 'https://discord.com/invite/B7SHQaHnFh'

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'email') {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      } else {
        setCopiedDiscord(true)
        setTimeout(() => setCopiedDiscord(false), 2000)
      }
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  if (loading) {
    return <PageLoader rows={3} />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* Pokémon acima do título */}
        <div className="flex justify-center mb-4">
          <img 
            src="/pokemon/chansey.png" 
            alt="Chansey" 
            className="w-24 h-24 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-300"
          />
        </div>

        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          <span>Central de </span> <span className='text-primary'>Suporte</span>
        </h2>
        <div
          className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
          aria-hidden="true"
        />
        <p className="mt-5 text-muted-foreground text-lg">
          Entre em contato conosco através dos nossos canais oficiais
        </p>
      </div>

      {/* Cards de Contato */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          
          {/* Email Card */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Email</CardTitle>
              </div>
              <CardDescription>
                Entre em contato por email para suporte técnico, dúvidas ou reportar problemas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted border-2 border-border">
                <p className="text-sm text-muted-foreground mb-1">Endereço de email:</p>
                <p className="font-mono font-semibold text-foreground">{email}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => window.location.href = `mailto:${email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(email, 'email')}
                  className="border-2"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Dica:</strong> Sempre inclua o nome do seu personagem no email para facilitar o suporte.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Discord Card */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-indigo-500/10">
                  <MessageCircle className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle className="text-2xl">Discord</CardTitle>
              </div>
              <CardDescription>
                Junte-se à nossa comunidade no Discord para chat em tempo real, eventos e atualizações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-indigo-500/10 border-2 border-indigo-500/20">
                <p className="text-sm text-muted-foreground mb-1">Link do servidor:</p>
                <p className="font-mono font-semibold text-foreground break-all">{discordInvite}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => window.open(discordInvite, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Entrar no Discord
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(discordInvite, 'discord')}
                  className="border-2"
                >
                  {copiedDiscord ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  🎮 <strong>Comunidade ativa:</strong> Converse com outros jogadores, participe de eventos e receba suporte rápido!
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Informações Adicionais */}
        <Card className="mt-8 max-w-4xl mx-auto border-2 border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span>📋</span> Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">• Tempo de resposta:</strong> Respondemos em até 48 horas úteis. Doadores têm prioridade no suporte.
              </p>
              <p>
                <strong className="text-foreground">• Horário de atendimento:</strong> Segunda a Sexta, 9h às 18h (Horário de Brasília).
              </p>
              <p>
                <strong className="text-foreground">• Antes de entrar em contato:</strong> Verifique se sua dúvida não está respondida nas <a href="/regras" className="text-primary hover:underline">Regras</a> ou <a href="/como-jogar" className="text-primary hover:underline">Como Jogar</a>.
              </p>
              <p>
                <strong className="text-foreground">• Para reportar bugs:</strong> Use o comando in-game Ctrl+R ou envie email com prints e descrição detalhada.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
  )
}
