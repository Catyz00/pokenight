'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Mail, Key, ArrowLeft } from 'lucide-react'

// Carregar script do reCAPTCHA
const RECAPTCHA_SITE_KEY = '6Lc9O1csAAAAAIl8H5nU8Dz6MY6dz578XUC6-7l2'

export default function RecuperarSenhaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [recoveryMethod, setRecoveryMethod] = useState(null) // 'email' ou 'key'
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    recoveryKey: '',
  })

  // Carregar reCAPTCHA
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => setRecaptchaLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

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
      if (!formData.username) {
        throw new Error('Por favor, informe seu nome de usuário/conta')
      }

      if (recoveryMethod === 'email') {
        if (!formData.email) {
          throw new Error('Por favor, informe seu email')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          throw new Error('Email inválido')
        }
      } else if (recoveryMethod === 'key') {
        if (!formData.recoveryKey) {
          throw new Error('Por favor, informe sua chave de recuperação')
        }
      }

      // Obter token reCAPTCHA
      let recaptchaToken = null
      if (recaptchaLoaded && window.grecaptcha) {
        try {
          recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'recuperar_senha' })
        } catch (err) {
          console.warn('Erro ao obter token reCAPTCHA:', err)
        }
      }

      // Chamada para a API de recuperação
      const response = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          recoveryKey: formData.recoveryKey,
          method: recoveryMethod,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar solicitação')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRecoveryMethod(null)
    setError('')
    setSuccess(false)
    setFormData({
      username: '',
      email: '',
      recoveryKey: '',
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">
          {!recoveryMethod && 'Escolha o método para recuperar sua conta'}
          {recoveryMethod === 'email' && 'Recuperar por email'}
          {recoveryMethod === 'key' && 'Recuperar por chave de recuperação'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!recoveryMethod && !success && (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Escolha por onde recuperar
            </p>
            
            <Button
              onClick={() => setRecoveryMethod('email')}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              size="lg"
            >
              <Mail className="w-5 h-5" />
              Email
            </Button>

            <Button
              onClick={() => setRecoveryMethod('key')}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              size="lg"
            >
              <Key className="w-5 h-5" />
              Recover Key
            </Button>
          </div>
        )}

        {recoveryMethod && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button
              type="button"
              onClick={resetForm}
              variant="ghost"
              size="sm"
              className="mb-2 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            {error && (
              <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Nome de Usuário/Conta
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="seu-usuario"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {recoveryMethod === 'email' && (
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
                  disabled={loading}
                />
              </div>
            )}

            {recoveryMethod === 'key' && (
              <div className="space-y-2">
                <label htmlFor="recoveryKey" className="text-sm font-medium">
                  Chave de Recuperação
                </label>
                <Input
                  id="recoveryKey"
                  name="recoveryKey"
                  type="text"
                  placeholder="Digite sua chave de recuperação"
                  value={formData.recoveryKey}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Recuperar Senha'}
            </Button>
          </form>
        )}

        {success && (
          <div className="space-y-4">
            <div className="flex gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-500">
                {recoveryMethod === 'email' 
                  ? 'Um email com instruções para recuperação foi enviado para seu endereço.'
                  : 'Sua senha foi recuperada com sucesso! Verifique seu email para a nova senha.'}
              </p>
            </div>
            
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Voltar para Login
            </Button>
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
