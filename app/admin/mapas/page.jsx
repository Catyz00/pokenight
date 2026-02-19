"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Map, Plus, Edit, Trash2, MapPin } from 'lucide-react'

export default function AdminMapsPage() {
  const [maps, setMaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingMap, setEditingMap] = useState(null)
  const [alert, setAlert] = useState(null)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mapType: 'cidade',
    levelRequirement: '0',
    coordinatesX: '',
    coordinatesY: '',
    coordinatesZ: '',
    imageUrl: '',
    availablePokemon: '',
    isActive: true
  })

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
    }
    fetchMaps()
  }, [])

  const fetchMaps = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/maps')
      const data = await response.json()
      if (response.ok) setMaps(data.maps)
    } catch (error) {
      console.error('Erro ao buscar mapas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      const url = editingMap ? `/api/admin/maps/${editingMap.id}` : '/api/admin/maps'
      const method = editingMap ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, createdBy: user.id })
      })

      const data = await response.json()

      if (response.ok) {
        setAlert({ type: 'success', message: data.message })
        setShowDialog(false)
        resetForm()
        fetchMaps()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao salvar mapa:', error)
      setAlert({ type: 'error', message: 'Erro ao salvar mapa' })
    }
  }

  const handleEdit = (map) => {
    setEditingMap(map)
    setFormData({
      name: map.name,
      description: map.description || '',
      mapType: map.map_type,
      levelRequirement: map.level_requirement?.toString() || '0',
      coordinatesX: map.coordinates_x?.toString() || '',
      coordinatesY: map.coordinates_y?.toString() || '',
      coordinatesZ: map.coordinates_z?.toString() || '',
      imageUrl: map.image_url || '',
      availablePokemon: map.available_pokemon || '',
      isActive: map.is_active === 1
    })
    setShowDialog(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este mapa?')) return

    try {
      const response = await fetch(`/api/admin/maps/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (response.ok) {
        setAlert({ type: 'success', message: data.message })
        fetchMaps()
      } else {
        setAlert({ type: 'error', message: data.error })
      }
    } catch (error) {
      console.error('Erro ao deletar mapa:', error)
      setAlert({ type: 'error', message: 'Erro ao deletar mapa' })
    }
  }

  const resetForm = () => {
    setEditingMap(null)
    setFormData({
      name: '',
      description: '',
      mapType: 'cidade',
      levelRequirement: '0',
      coordinatesX: '',
      coordinatesY: '',
      coordinatesZ: '',
      imageUrl: '',
      availablePokemon: '',
      isActive: true
    })
  }

  const getMapTypeLabel = (type) => {
    const labels = {
      'cidade': 'Cidade',
      'rota': 'Rota',
      'caverna': 'Caverna',
      'floresta': 'Floresta',
      'especial': 'Especial',
      'outro': 'Outro'
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mapas do Jogo</h1>
          <p className="mt-1 text-muted-foreground">Gerencie os mapas disponíveis no servidor</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Mapa
        </Button>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center py-8 text-muted-foreground">Carregando...</p>
        ) : maps.length === 0 ? (
          <p className="col-span-full text-center py-8 text-muted-foreground">Nenhum mapa cadastrado</p>
        ) : (
          maps.map((map) => (
            <Card key={map.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{map.name}</CardTitle>
                  </div>
                  <Badge variant={map.is_active ? 'default' : 'secondary'}>
                    {map.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Badge variant="outline">{getMapTypeLabel(map.map_type)}</Badge>
                  {map.level_requirement > 0 && (
                    <p className="text-sm text-muted-foreground">Nível mínimo: {map.level_requirement}</p>
                  )}
                </div>
                {map.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{map.description}</p>
                )}
                {(map.coordinates_x || map.coordinates_y || map.coordinates_z) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {map.coordinates_x}, {map.coordinates_y}, {map.coordinates_z}
                    </span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(map)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(map.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMap ? 'Editar Mapa' : 'Novo Mapa'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome do Mapa *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div>
                <Label htmlFor="mapType">Tipo *</Label>
                <select id="mapType" value={formData.mapType} onChange={(e) => setFormData({ ...formData, mapType: e.target.value })} className="w-full px-3 py-2 border border-input bg-background rounded-md" required>
                  <option value="cidade">Cidade</option>
                  <option value="rota">Rota</option>
                  <option value="caverna">Caverna</option>
                  <option value="floresta">Floresta</option>
                  <option value="especial">Especial</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <Label htmlFor="levelRequirement">Nível Mínimo</Label>
                <Input id="levelRequirement" type="number" value={formData.levelRequirement} onChange={(e) => setFormData({ ...formData, levelRequirement: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="coordinatesX">Coordenada X</Label>
                <Input id="coordinatesX" type="number" value={formData.coordinatesX} onChange={(e) => setFormData({ ...formData, coordinatesX: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="coordinatesY">Coordenada Y</Label>
                <Input id="coordinatesY" type="number" value={formData.coordinatesY} onChange={(e) => setFormData({ ...formData, coordinatesY: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="coordinatesZ">Coordenada Z</Label>
                <Input id="coordinatesZ" type="number" value={formData.coordinatesZ} onChange={(e) => setFormData({ ...formData, coordinatesZ: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="isActive">Status</Label>
                <select id="isActive" value={formData.isActive.toString()} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-3 py-2 border border-input bg-background rounded-md">
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input id="imageUrl" type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="availablePokemon">Pokémon Disponíveis (JSON ou lista)</Label>
                <Textarea id="availablePokemon" value={formData.availablePokemon} onChange={(e) => setFormData({ ...formData, availablePokemon: e.target.value })} rows={3} placeholder='Ex: ["Pikachu", "Bulbasaur"] ou texto livre' />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancelar</Button>
              <Button type="submit">{editingMap ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
