import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { questNames, pokemonNames } from '@/lib/questNames';

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'poke'
};

export async function GET(request, context) {
  let connection;

  try {
    const { name } = await context.params;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome do personagem é obrigatório' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar dados do personagem
    const [players] = await connection.execute(
      `SELECT 
        p.id,
        p.name,
        p.level,
        p.vocation,
        p.lastlogin,
        p.town_id
      FROM players p
      WHERE p.name = ?`,
      [name]
    );

    if (players.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Personagem não encontrado' },
        { status: 404 }
      );
    }

    const player = players[0];

    // Buscar casa do personagem
    let house = null;
    try {
      const [houses] = await connection.execute(
        `SELECT 
          h.id,
          h.name as house_name,
          h.town_id
        FROM houses h
        WHERE h.owner = ?`,
        [player.id]
      );
      if (houses.length > 0) {
        house = houses[0];
      }
    } catch (error) {
      console.log('⚠️ Tabela houses não encontrada ou erro:', error.message);
    }

    // Buscar quests completadas do personagem
    let completedQuests = [];
    let allQuests = [];
    try {
      const [questsResult] = await connection.execute(
        `SELECT 
          ps.key as quest_key,
          ps.value
        FROM player_storage ps
        WHERE ps.player_id = ? 
        AND ps.key IN (31441546, 2353463, 2353465, 2353462, 2353461, 243243, 2353464, 2353468, 2353467, 2353466, 4234563, 4234564)
        ORDER BY ps.key`,
        [player.id]
      );
      completedQuests = questsResult;
      
      // Lista de todas as quest keys disponíveis
      const allQuestKeys = [31441546, 2353463, 2353465, 2353462, 2353461, 243243, 2353464, 2353468, 2353467, 2353466, 4234563, 4234564];
      
      // Criar um mapa das quests encontradas
      const questMap = new Map(questsResult.map(q => [q.quest_key, q.value]));
      
      allQuests = {
        completed: [],
        notCompleted: []
      };
      
      // Processar todas as quests
      allQuestKeys.forEach(key => {
        const questData = {
          questKey: key,
          questName: questNames[key] || `Quest #${key}`,
        };
        
        if (questMap.has(key)) {
          // Quest existe no banco - está completada ou em progresso
          const value = questMap.get(key);
          allQuests.completed.push({
            ...questData,
            progress: value,
            status: 'completed'
          });
        } else {
          // Quest não existe no banco - não foi iniciada
          allQuests.notCompleted.push({
            ...questData,
            progress: 0,
            status: 'not_completed'
          });
        }
      });
    } catch (error) {
      console.log('⚠️ Tabela player_storage não encontrada ou erro:', error.message);
    }

    // Buscar atividades recentes (deaths, level ups)
    let recentActivities = [];
    try {
      const [deaths] = await connection.execute(
        `SELECT 
          'death' as type,
          killed_by,
          date as timestamp
        FROM player_deaths
        WHERE player_id = ?
        ORDER BY date DESC
        LIMIT 10`,
        [player.id]
      );
      recentActivities = deaths.map(d => ({
        type: 'death',
        description: `Morreu para ${d.killed_by}`,
        timestamp: d.timestamp
      }));
    } catch (error) {
      console.log('⚠️ Tabela player_deaths não encontrada ou erro:', error.message);
    }

    // Buscar Bestiary (kills)
    let bestiary = [];
    try {
      const [kills] = await connection.execute(
        `SELECT 
          monster_name,
          kills as kill_count
        FROM player_bestiary
        WHERE player_id = ?
        ORDER BY kills DESC
        LIMIT 20`,
        [player.id]
      );
      bestiary = kills.map(k => ({
        monster: k.monster_name,
        kills: k.kill_count
      }));
    } catch (error) {
      console.log('⚠️ Não foi possível carregar bestiary:', error.message);
    }

    // Buscar Pokedex (pokémons capturados - usando player_storage)
    let pokedex = [];
    try {
      // Primeiro tentar com o range 20001-20721
      let [captured] = await connection.execute(
        `SELECT 
          ps.key as pokemon_id,
          ps.value as capture_count
        FROM player_storage ps
        WHERE ps.player_id = ? 
        AND ps.key BETWEEN 20001 AND 20721
        AND ps.value > 0
        ORDER BY ps.key ASC`,
        [player.id]
      );
      
      // Se não encontrar, tentar outros ranges comuns
      if (captured.length === 0) {
        [captured] = await connection.execute(
          `SELECT 
            ps.key as pokemon_id,
            ps.value as capture_count
          FROM player_storage ps
          WHERE ps.player_id = ? 
          AND ps.key BETWEEN 1 AND 721
          AND ps.value > 0
          ORDER BY ps.key ASC`,
          [player.id]
        );
        
        // Se encontrou neste range, usar pokemonId direto
        if (captured.length > 0) {
          pokedex = captured.map(p => ({
            pokemonId: p.pokemon_id,
            pokemonName: pokemonNames[p.pokemon_id] || `Pokemon #${p.pokemon_id}`,
            captures: p.capture_count,
            unlocked: true
          }));
        }
      } else {
        pokedex = captured.map(p => ({
          pokemonId: p.pokemon_id - 20000,
          pokemonName: pokemonNames[p.pokemon_id - 20000] || `Pokemon #${p.pokemon_id - 20000}`,
          captures: p.capture_count,
          unlocked: true
        }));
      }
      
      console.log(`✅ Pokédex carregada: ${pokedex.length} Pokémon encontrados`);
    } catch (error) {
      console.log('⚠️ Não foi possível carregar pokedex:', error.message);
    }

    await connection.end();

    return NextResponse.json(
      { 
        success: true,
        player: {
          id: player.id,
          name: player.name,
          level: player.level,
          vocation: player.vocation,
          lastLogin: player.lastlogin,
          townId: player.town_id
        },
        house: house ? {
          id: house.id,
          name: house.house_name,
          townId: house.town_id
        } : null,
        quests: allQuests,
        recentActivities: recentActivities,
        bestiary: bestiary,
        pokedex: pokedex
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar personagem:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Erro ao buscar personagem.' },
      { status: 500 }
    );
  }
}
