"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Globe, Bell, Shield, Database, Palette } from "lucide-react"

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState({
    siteName: "PokeWorld",
    siteDescription: "A melhor experiencia Pokemon online",
    maintenanceMode: false,
    registrationOpen: true,
    maxPlayersOnline: 5000,
    discordWebhook: "",
    emailNotifications: true,
    autoBackup: true,
    backupInterval: 24,
    primaryColor: "#22c55e",
    footerText: "2026 PokeNight. Todos os direitos reservados.",
  })

  const handleSave = () => {
    // Na versao real, enviaria para o PHP/MariaDB
    alert("Configuracoes salvas com sucesso!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuracoes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as configuracoes gerais do site e servidor
          </p>
        </div>
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Salvar Alteracoes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Configuracoes Gerais
            </CardTitle>
            <CardDescription>Informacoes basicas do site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descricao</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerText">Texto do Rodape</Label>
              <Input
                id="footerText"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Server Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Configuracoes do Servidor
            </CardTitle>
            <CardDescription>Controle de acesso e limites</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Manutencao</Label>
                <p className="text-sm text-muted-foreground">
                  Desativa o acesso ao site para jogadores
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Registro Aberto</Label>
                <p className="text-sm text-muted-foreground">
                  Permite novos jogadores se registrarem
                </p>
              </div>
              <Switch
                checked={settings.registrationOpen}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, registrationOpen: checked })
                }
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Maximo de Jogadores Online</Label>
              <Input
                id="maxPlayers"
                type="number"
                value={settings.maxPlayersOnline}
                onChange={(e) =>
                  setSettings({ ...settings, maxPlayersOnline: parseInt(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificacoes
            </CardTitle>
            <CardDescription>Configure alertas e integracoes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
              <Input
                id="discordWebhook"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={settings.discordWebhook}
                onChange={(e) => setSettings({ ...settings, discordWebhook: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Receba notificacoes de eventos importantes no Discord
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificacoes por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Envia emails para administradores
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Backup e Dados
            </CardTitle>
            <CardDescription>Configuracoes de backup automatico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Automatico</Label>
                <p className="text-sm text-muted-foreground">
                  Realiza backup periodico do banco de dados
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoBackup: checked })
                }
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="backupInterval">Intervalo de Backup (horas)</Label>
              <Input
                id="backupInterval"
                type="number"
                value={settings.backupInterval}
                onChange={(e) =>
                  setSettings({ ...settings, backupInterval: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                Fazer Backup Agora
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Restaurar Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Aparencia
            </CardTitle>
            <CardDescription>Personalize as cores e visual do site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Cor Primaria</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="flex h-10 items-center justify-center rounded-md text-sm font-medium text-white"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Botao de Exemplo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
