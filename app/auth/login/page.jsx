'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Renderizar Cloudflare Turnstile
  useEffect(() => {
    const loadTurnstile = () => {
      if (typeof window !== 'undefined' && window.turnstile && turnstileRef.current) {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
        
        console.log('🔒 Carregando Turnstile com sitekey:', siteKey)
        
        try {
          window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: (token) => {
              console.log('✅ Token Turnstile recebido')
              setTurnstileToken(token)
            },
            'error-callback': () => {
              console.error('❌ Erro no Turnstile')
            },
            theme: 'dark',
            language: 'pt-BR',
          })
        } catch (error) {
          console.error('❌ Erro ao renderizar Turnstile:', error)
        }
      } else if (typeof window !== 'undefined' && !window.turnstile) {
        console.log('⏳ Aguardando script do Turnstile carregar...')
        setTimeout(loadTurnstile, 100)
      }
    }
    
    loadTurnstile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.username || !formData.password) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (!turnstileToken) {
        throw new Error('Por favor, complete a verificação de segurança')
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          turnstileToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      console.log('Login successful:', data)

      // ✅ Pega accountId (accounts.id) de qualquer nome que o backend possa estar usando
      const accountId =
        data?.accountId ??
        data?.account_id ??
        data?.id ??
        data?.account?.id ??
        data?.user?.id ??
        null

      // ✅ Salvar dados do usuário no localStorage (incluindo accountId)
      const userData = {
        accountId: accountId ? Number(accountId) : null,
        username: data.username || formData.username,
        email: data.email || '',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
        level: data.level || 1,
        vocation: data.vocation || 'Novato',
        guild: data.guild || 'Sem Guild',
        rank: data.rank || 'Membro',
      }

      localStorage.setItem('user', JSON.stringify(userData))

      // ✅ Chave que o ComprarPontos vai ler
      if (accountId) {
        localStorage.setItem('accountId', String(accountId))
      } else {
        // Se quiser, deixa um log pra debug (não quebra nada)
        console.warn('Login OK, mas o backend não retornou accountId/id. Comprar NightCoins não vai funcionar sem isso.')
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      router.push('/perfil')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">
          Acesse sua conta Pokenight
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Seu username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Link href="/auth/recuperar-senha" className="text-sm text-primary hover:underline font-medium">
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile */}
          <div ref={turnstileRef} className="flex justify-center"></div>

          <Button type="submit" className="w-full" disabled={loading || !turnstileToken}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Registre-se aqui
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
