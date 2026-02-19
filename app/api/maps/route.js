import { NextResponse } from 'next/server'
import { mapsData } from '@/lib/maps-data'

// API pública para buscar apenas mapas ativos
export async function GET() {
  try {
    // Filtrar apenas mapas ativos
    const activeMaps = mapsData.filter(map => map.is_active === true)
    
    return NextResponse.json({ maps: activeMaps })
  } catch (error) {
    console.error('Erro ao buscar mapas públicos:', error)
    return NextResponse.json({ error: 'Erro ao buscar mapas' }, { status: 500 })
  }
}
