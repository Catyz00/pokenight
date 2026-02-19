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

export async function PATCH(request, { params }) {
  try {
    const mapId = parseInt(params.id)
    const body = await request.json()
    const { 
      name, 
      description, 
      mapType, 
      levelRequirement,
      imageUrl,
      availablePokemon,
      isActive
    } = body

    // Encontrar o índice do mapa
    const mapIndex = mapsData.findIndex(m => m.id === mapId)
    
    if (mapIndex === -1) {
      return NextResponse.json({ error: 'Mapa não encontrado' }, { status: 404 })
    }

    // Atualizar o mapa
    const updatedMap = {
      ...mapsData[mapIndex],
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(mapType && { map_type: mapType }),
      ...(levelRequirement !== undefined && { level_requirement: parseInt(levelRequirement) || 0 }),
      ...(imageUrl !== undefined && { image_url: imageUrl }),
      ...(availablePokemon !== undefined && { available_pokemon: availablePokemon }),
      ...(isActive !== undefined && { is_active: isActive })
    }

    // Criar novo array com o mapa atualizado
    const updatedMaps = [...mapsData]
    updatedMaps[mapIndex] = updatedMap

    // Salvar no arquivo
    saveMapsToFile(updatedMaps)

    return NextResponse.json({ 
      success: true, 
      message: 'Mapa atualizado com sucesso!',
      map: updatedMap
    })
  } catch (error) {
    console.error('Erro ao atualizar mapa:', error)
    return NextResponse.json({ 
      error: 'Erro ao atualizar mapa',
      details: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const mapId = parseInt(params.id)
    
    // Filtrar removendo o mapa
    const updatedMaps = mapsData.filter(m => m.id !== mapId)
    
    if (updatedMaps.length === mapsData.length) {
      return NextResponse.json({ error: 'Mapa não encontrado' }, { status: 404 })
    }

    // Salvar no arquivo
    saveMapsToFile(updatedMaps)

    return NextResponse.json({ 
      success: true, 
      message: 'Mapa deletado com sucesso!' 
    })
  } catch (error) {
    console.error('Erro ao deletar mapa:', error)
    return NextResponse.json({ 
      error: 'Erro ao deletar mapa',
      details: error.message
    }, { status: 500 })
  }
}
