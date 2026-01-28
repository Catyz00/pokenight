'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { AlertCircle, CheckCircle, Eye, EyeOff, User, Star } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    genero: '',
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
      if (!formData.login || !formData.email || !formData.password || !formData.confirmPassword || !formData.nome || !formData.genero) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (formData.login.length < 3) {
        throw new Error('Login deve ter no mínimo 3 caracteres')
      }

      if (formData.nome.length < 2) {
        throw new Error('Nome deve ter no mínimo 2 caracteres')
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

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,
          email: formData.email,
          password: formData.password,
          nome: formData.nome,
          genero: formData.genero,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      setSuccess(true)
      setFormData({
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
        nome: '',
        genero: '',
      })

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                Sua Conta
              </h3>
              <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium">Login</label>
                <Input id="login" name="login" type="text" placeholder="seu_login" value={formData.login} onChange={handleChange} disabled={loading || success} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} disabled={loading || success} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-muted-foreground" />
                Seu Personagem
              </h3>
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">Nome</label>
                <Input id="nome" name="nome" type="text" placeholder="Nome do personagem" value={formData.nome} onChange={handleChange} disabled={loading || success} />
              </div>
              <div className="space-y-2">
                <label htmlFor="genero" className="text-sm font-medium">Gênero</label>
                <Select value={formData.genero} onValueChange={(value) => setFormData((p) => ({ ...p, genero: value }))} disabled={loading || success}>
                  <SelectTrigger><SelectValue placeholder="Selecione o gênero" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="" value={formData.password} onChange={handleChange} disabled={loading || success} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded" disabled={loading || success}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
              <div className="relative">
                <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="" value={formData.confirmPassword} onChange={handleChange} disabled={loading || success} />
                <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded" disabled={loading || success}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
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
