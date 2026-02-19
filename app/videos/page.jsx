'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageLoader } from '@/components/ui/page-loader'
import { Video, Search, Calendar, Eye, Youtube } from 'lucide-react'

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/youtube?query=pokenight')
      const data = await response.json()

      if (data.success) {
        setVideos(data.videos)
      } else {
        setError(data.error || 'Erro ao carregar vídeos')
      }
    } catch (err) {
      console.error('Erro ao buscar vídeos:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = videos.filter(video =>
    video.snippet.title.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <PageLoader rows={6} />
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/pokemon/meowth.png" 
              alt="Meowth" 
              className="w-24 h-24 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-300"
            />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-red-500/30 bg-red-500/10 px-4 py-1.5">
            <Youtube className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-red-500">Canal Oficial</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Vídeos <span className="text-primary">PokeNight</span>
          </h1>
          <div
            className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
            aria-hidden="true"
          />
          <p className="mt-5 text-muted-foreground">
            Confira todos os vídeos do canal oficial do Guiis sobre PokeNight
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por título do vídeo..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground text-center">
              {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p>{error}</p>
                <button 
                  onClick={fetchVideos}
                  className="mt-4 text-primary hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id.videoId} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-red-600 rounded-full p-4">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {video.snippet.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.snippet.description || 'Sem descrição disponível'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(video.snippet.publishedAt)}</span>
                  </div>

                  <div className="mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Youtube className="h-3 w-3" />
                      Guiis
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum vídeo encontrado com esse título
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* YouTube Channel Link */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <Youtube className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <p className="text-sm text-muted-foreground mb-4">
                Quer ver mais conteúdo? Visite o canal oficial!
              </p>
              <a
                href="https://www.youtube.com/@Guiis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Youtube className="h-5 w-5" />
                Ir para o Canal do Guiis
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
