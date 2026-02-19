import { NextResponse } from 'next/server'
import { mapsData } from '@/lib/maps-data'
import fs from 'fs'
import path from 'path'

// Função para salvar os mapas no arquivo
function saveMapsToFile(maps) {
  const filePath = path.join(process.cwd(), 'lib', 'maps-data.js')
  const content = `// Arquivo de dados dos mapas - gerenciado pelo painel admin
export const mapsData = ${JSON.stringify(maps, null, 2)}
`
  fs.writeFileSync(filePath, content, 'utf8')
}

export async function GET() {
  try {
    return NextResponse.json({ maps: mapsData })
  } catch (error) {
    console.error('Erro ao buscar mapas:', error)
    return NextResponse.json({ 
      error: 'Erro ao buscar mapas', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      mapType, 
      levelRequirement,
      imageUrl,
      availablePokemon
    } = body

    console.log('Dados recebidos:', body)

    if (!name || !mapType) {
      return NextResponse.json({ error: 'Nome e tipo são obrigatórios' }, { status: 400 })
    }

    // Criar novo mapa
    const newMap = {
      id: Date.now(), // Usar timestamp como ID único
      name,
      description: description || '',
      map_type: mapType,
      level_requirement: parseInt(levelRequirement) || 0,
      image_url: imageUrl || '',
      available_pokemon: availablePokemon || '',
      is_active: true
    }

    // Adicionar ao array
    const updatedMaps = [...mapsData, newMap]
    
    // Salvar no arquivo
    saveMapsToFile(updatedMaps)

    return NextResponse.json({
      success: true,
      message: 'Mapa criado com sucesso!',
      map: newMap
    })
  } catch (error) {
    console.error('Erro ao criar mapa:', error)
    return NextResponse.json({ 
      error: 'Erro ao criar mapa',
      details: error.message
    }, { status: 500 })
  }
}
