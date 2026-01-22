'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

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
    setSuccess(false)
    setLoading(true)

    try {
      // Validação
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (formData.username.length < 3) {
        throw new Error('Username deve ter no mínimo 3 caracteres')
      }

      if (!formData.email.includes('@')) {
        throw new Error('Email inválido')
      }

      if (formData.password.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não correspondem')
      }

      // Aqui você faria a chamada para a API
      console.log('Register attempt:', {
        username: formData.username,
        email: formData.email,
      })

      // Simular sucesso após 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      // Redirecionar após 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push('/auth/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Registre-se</CardTitle>
        <CardDescription>Crie sua conta Pokenight</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-600">Conta criada com sucesso! Redirecionando...</p>
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
              placeholder="seu_username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading || success}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || success}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading || success}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading || success}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
            {loading ? 'Criando conta...' : 'Registrar'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Faça login aqui
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
