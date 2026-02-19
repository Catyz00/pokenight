import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function PATCH(request, { params }) {
  try {
    const mapId = params.id
    const body = await request.json()
    const { 
      name, 
      description, 
      mapType, 
      levelRequirement,
      coordinatesX,
      coordinatesY,
      coordinatesZ,
      imageUrl,
      availablePokemon,
      isActive
    } = body

    const updates = []
    const values = []

    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (mapType) { updates.push('map_type = ?'); values.push(mapType); }
    if (levelRequirement !== undefined) { updates.push('level_requirement = ?'); values.push(levelRequirement); }
    if (coordinatesX !== undefined) { updates.push('coordinates_x = ?'); values.push(coordinatesX); }
    if (coordinatesY !== undefined) { updates.push('coordinates_y = ?'); values.push(coordinatesY); }
    if (coordinatesZ !== undefined) { updates.push('coordinates_z = ?'); values.push(coordinatesZ); }
    if (imageUrl !== undefined) { updates.push('image_url = ?'); values.push(imageUrl); }
    if (availablePokemon !== undefined) { 
      updates.push('available_pokemon = ?'); 
      values.push(availablePokemon ? JSON.stringify(availablePokemon) : null); 
    }
    if (isActive !== undefined) { updates.push('is_active = ?'); values.push(isActive ? 1 : 0); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    values.push(mapId)
    await pool.query(`UPDATE game_maps SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

    return NextResponse.json({ success: true, message: 'Mapa atualizado com sucesso!' })
  } catch (error) {
    console.error('Erro ao atualizar mapa:', error)
    return NextResponse.json({ error: 'Erro ao atualizar mapa' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const mapId = params.id
    await pool.query('DELETE FROM game_maps WHERE id = ?', [mapId])
    return NextResponse.json({ success: true, message: 'Mapa deletado com sucesso!' })
  } catch (error) {
    console.error('Erro ao deletar mapa:', error)
    return NextResponse.json({ error: 'Erro ao deletar mapa' }, { status: 500 })
  }
}
