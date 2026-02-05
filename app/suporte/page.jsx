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

  const email = 'contato@pokenight.com'
  const discordInvite = 'https://discord.gg/pokenight'

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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
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

        {/* Redes Sociais */}
        <div className="mt-8 max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">Siga-nos nas Redes Sociais</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" className="border-2">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
            <Button variant="outline" size="lg" className="border-2">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </Button>
            <Button variant="outline" size="lg" className="border-2">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
              Instagram
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
