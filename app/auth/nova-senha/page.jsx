'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function NovaSenhaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  // Pegar código e email da URL
  const code = searchParams.get('code')
  const email = searchParams.get('email_rcv')

  useEffect(() => {
    if (!code || !email) {
      setError('Link inválido ou expirado. Solicite uma nova recuperação de senha.')
    }
  }, [code, email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.password || !formData.confirmPassword) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (formData.password.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não correspondem')
      }

      if (!code || !email) {
        throw new Error('Link inválido ou expirado')
      }

      // Chamar API para redefinir senha
      const response = await fetch('/api/auth/nova-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha')
      }

      setSuccess(true)
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl text-center">Nova Senha</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">
          Digite sua nova senha
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || !code || !email}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || !code || !email}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !code || !email}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-500">
                Senha redefinida com sucesso! Redirecionando para login...
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Lembrou sua senha?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Faça login aqui
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
