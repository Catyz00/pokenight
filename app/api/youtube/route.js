import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId') || 'UCpmCmu2U8VYhUCJIwyzc1eg' // ID do canal Guiis
    const query = searchParams.get('query') || 'pokenight'
    
    const API_KEY = process.env.YOUTUBE_API_KEY
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key não configurada' },
        { status: 500 }
      )
    }

    // Buscar vídeos do canal com "pokenight" no título
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&q=${query}&type=video`,
      { next: { revalidate: 3600 } } // Cache por 1 hora
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar vídeos do YouTube')
    }

    const data = await response.json()
    
    // Filtrar apenas vídeos que contenham "pokenight" no título (case insensitive)
    const filteredVideos = data.items.filter(item => 
      item.snippet.title.toLowerCase().includes('pokenight')
    )

    return NextResponse.json({
      success: true,
      videos: filteredVideos,
      total: filteredVideos.length
    })
  } catch (error) {
    console.error('Erro na API do YouTube:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
