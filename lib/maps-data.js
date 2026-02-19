// Arquivo de dados dos mapas - gerenciado pelo painel admin
export const mapsData = [
  {
    id: 1,
    name: 'Cidade Central',
    description: 'A principal cidade do servidor, onde tudo começa',
    map_type: 'cidade',
    level_requirement: 0,
    image_url: '/maps/cidade.jpg',
    available_pokemon: 'Pidgey, Rattata, Meowth',
    is_active: true
  },
  {
    id: 2,
    name: 'Floresta Verde',
    description: 'Uma floresta densa cheia de Pokémon do tipo Planta',
    map_type: 'floresta',
    level_requirement: 5,
    image_url: '/maps/floresta.jpg',
    available_pokemon: 'Bulbasaur, Oddish, Caterpie, Weedle',
    is_active: true
  },
  {
    id: 3,
    name: 'Deserto Ardente',
    description: 'Um deserto quente com Pokémon raros',
    map_type: 'especial',
    level_requirement: 15,
    image_url: '/maps/deserto.jpg',
    available_pokemon: 'Sandshrew, Cubone, Diglett',
    is_active: true
  },
  {
    id: 4,
    name: 'Montanha Gelada',
    description: 'Picos nevados onde vivem Pokémon de gelo',
    map_type: 'especial',
    level_requirement: 25,
    image_url: '/maps/montanha.jpg',
    available_pokemon: 'Seel, Shellder, Jynx',
    is_active: true
  },
  {
    id: 5,
    name: 'Ilha Misteriosa',
    description: 'Uma ilha remota com Pokémon lendários',
    map_type: 'especial',
    level_requirement: 50,
    image_url: '/maps/ilha.jpg',
    available_pokemon: 'Dratini, Dragonair, Lapras',
    is_active: true
  }
]
