import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET() {
  try {
    const [maps] = await pool.query('SELECT * FROM game_maps ORDER BY name ASC')
    return NextResponse.json({ maps })
  } catch (error) {
    console.error('Erro ao buscar mapas:', error)
    return NextResponse.json({ error: 'Erro ao buscar mapas' }, { status: 500 })
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
      coordinatesX,
      coordinatesY,
      coordinatesZ,
      imageUrl,
      availablePokemon,
      createdBy 
    } = body

    if (!name || !mapType || !createdBy) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const [result] = await pool.query(
      `INSERT INTO game_maps 
       (name, description, map_type, level_requirement, coordinates_x, coordinates_y, 
        coordinates_z, image_url, available_pokemon, created_by, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name, 
        description || null, 
        mapType, 
        levelRequirement || 0,
        coordinatesX || null,
        coordinatesY || null,
        coordinatesZ || null,
        imageUrl || null,
        availablePokemon ? JSON.stringify(availablePokemon) : null,
        createdBy
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Mapa criado com sucesso!',
      mapId: result.insertId
    })
  } catch (error) {
    console.error('Erro ao criar mapa:', error)
    return NextResponse.json({ error: 'Erro ao criar mapa' }, { status: 500 })
  }
}
