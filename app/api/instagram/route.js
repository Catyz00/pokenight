import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cache de 30 minutos
export const revalidate = 1800;

/**
 * GET /api/instagram
 * Busca os últimos posts do Instagram usando RSS Feed (sem necessidade de Facebook App)
 * 
 * Configuração:
 * 1. Crie um feed RSS em: https://rss.app/
 * 2. Adicione o username do Instagram
 * 3. Copie a URL do feed JSON
 * 4. Cole no .env.local como INSTAGRAM_RSS_URL
 */
export async function GET() {
  try {
    // Método 1: RSS Feed (se configurado)
    const rssFeedUrl = process.env.INSTAGRAM_RSS_URL;
    
    if (rssFeedUrl) {
      return await fetchFromRSS(rssFeedUrl);
    }

    // Método 2: Username do Instagram (scraper simples - fallback gratuito)
    const username = process.env.INSTAGRAM_USERNAME;
    
    if (username) {
      return await fetchFromUsername(username);
    }

    // Método 3: API Oficial (apenas se tiver token configurado)
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (accessToken) {
      return await fetchFromAPI(accessToken);
    }

    // Se nenhum método estiver configurado, retorna posts de exemplo
    return NextResponse.json({
      success: true,
      method: 'Exemplo',
      message: 'Configure INSTAGRAM_USERNAME no .env.local para posts reais',
      posts: getExamplePosts(),
      total: 6,
    });

  } catch (error) {
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { 
        success: true,
        method: 'Fallback',
        posts: getExamplePosts(),
        total: 6,
      },
      { status: 200 }
    );
  }
}

/**
 * Busca posts via RSS Feed (não precisa de app do Facebook!)
 */
async function fetchFromRSS(rssFeedUrl) {
  try {
    const response = await fetch(rssFeedUrl, {
      next: { revalidate: 1800 }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar RSS feed');
    }

    const data = await response.json();
    
    // Processar dados do RSS (formato varia por serviço)
    const posts = (data.items || data.posts || [])
      .filter(item => {
        const text = (item.title || item.content_text || item.description || '').toLowerCase();
        return text.includes('pokenight') || text.includes('poke night');
      })
      .slice(0, 10)
      .map(item => ({
        id: item.id || item.guid || Date.now(),
        title: extractTitle(item.title || item.content_text || ''),
        excerpt: extractExcerpt(item.content_text || item.description || ''),
        caption: item.content_text || item.description,
        mediaType: 'IMAGE',
        mediaUrl: item.image || item.attachments?.[0]?.url || '',
        thumbnailUrl: item.image || item.attachments?.[0]?.url || '',
        permalink: item.url || '#',
        timestamp: item.date_published || item.pubDate || new Date().toISOString(),
        username: extractUsername(rssFeedUrl),
        category: 'Instagram',
        featured: false,
        source: 'instagram',
      }));

    return NextResponse.json({
      success: true,
      method: 'RSS Feed',
      username: extractUsername(rssFeedUrl),
      posts: posts,
      total: posts.length,
      cachedUntil: new Date(Date.now() + 1800000).toISOString(),
    });

  } catch (error) {
    throw new Error(`RSS Feed error: ${error.message}`);
  }
}

/**
 * Busca posts via API oficial do Instagram (precisa de app do Facebook)
 */
async function fetchFromAPI(accessToken) {
  try {
    // Buscar informações do usuário e media
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`,
      { next: { revalidate: 1800 } }
    );

    if (!userResponse.ok) {
      throw new Error('Erro ao conectar com Instagram API');
    }

    const userData = await userResponse.json();

    // Buscar os últimos posts (máximo 25)
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username&limit=25&access_token=${accessToken}`,
      { next: { revalidate: 1800 } }
    );

    if (!mediaResponse.ok) {
      throw new Error('Erro ao buscar posts do Instagram');
    }

    const mediaData = await mediaResponse.json();

    // Filtrar posts que mencionam "pokenight" na legenda (case-insensitive)
    const filteredPosts = mediaData.data
      .filter(post => {
        if (!post.caption) return false;
        const caption = post.caption.toLowerCase();
        return caption.includes('pokenight') || caption.includes('poke night');
      })
      .map(post => ({
        id: post.id,
        title: extractTitle(post.caption),
        excerpt: extractExcerpt(post.caption),
        caption: post.caption,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url || post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
        username: post.username,
        category: 'Instagram',
        featured: false,
        source: 'instagram',
      }));

    return NextResponse.json({
      success: true,
      method: 'Instagram API',
      username: userData.username,
      userId: userData.id,
      posts: filteredPosts,
      total: filteredPosts.length,
      cachedUntil: new Date(Date.now() + 1800000).toISOString(),
    });

  } catch (error) {
    throw new Error(`Instagram API error: ${error.message}`);
  }
}

/**
 * Extrai username da URL do RSS
 */
function extractUsername(url) {
  // Tentar extrair username da URL ou retornar padrão
  return 'instagram';
}

/**
 * Extrai um título da legenda do Instagram (primeiras palavras)
 */
function extractTitle(caption) {
  if (!caption) return 'Post do Instagram';
  
  // Pegar a primeira linha ou primeiras 60 caracteres
  const firstLine = caption.split('\n')[0].trim();
  
  if (firstLine.length <= 60) {
    return firstLine;
  }
  
  return firstLine.substring(0, 60) + '...';
}

/**
 * Extrai um excerpt da legenda (primeiros caracteres, sem hashtags)
 */
function extractExcerpt(caption) {
  if (!caption) return '';
  
  // Remover hashtags e emojis em excesso
  let text = caption
    .split('#')[0] // Remove tudo depois do primeiro #
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .trim();
  
  // Limitar a 150 caracteres
  if (text.length > 150) {
    text = text.substring(0, 150) + '...';
  }
  
  return text || 'Confira no Instagram!';
}

/**
 * Busca posts via username (método gratuito usando Picuki ou similar)
 */
async function fetchFromUsername(username) {
  try {
    // Por enquanto, retornar posts de exemplo
    // Em produção, você pode usar um serviço como Picuki ou Instagram's public API
    return NextResponse.json({
      success: true,
      method: 'Username (Exemplo)',
      message: 'Usando posts de exemplo. Para posts reais, configure RSS.app ou API oficial.',
      username: username,
      posts: getExamplePosts(),
      total: 6,
    });
  } catch (error) {
    throw new Error(`Username fetch error: ${error.message}`);
  }
}

/**
 * Retorna posts de exemplo para demonstração
 */
function getExamplePosts() {
  const now = new Date();
  
  return [
    {
      id: '1',
      title: '🚨🔥 O PokeNight TÁ DE VOLTA! 🔥🚨',
      description: `🚨🔥 O PokeNight TÁ DE VOLTA! 🔥🚨
O servidor retorna com a sua base padrão, inspirado em OTPokemon + Memories, mas agora com muitas novidades chegando pra elevar o nível do game 👊⚡

Estamos trazendo sistema de IV e EV, deixando os Pokémon muito mais únicos e estratégicos, além de várias outras features que vão ser reveladas em breve 👀✨

Se tu curte Pokémon e quer viver essa nova fase do servidor desde o começo, já chega junto pra não perder nada!

🎥 Último vídeo sobre o retorno do servidor:
https://youtu.be/ZBabyVdPUhU?si=o3qYZiTFhC73Ylth

💬 Entra na comunidade e acompanha todas as novidades:
https://youtu.be/ZBabyVdPUhU?si=o3qYZiTFhC73Ylth

PokeNight voltou… e agora é pra ficar`,
      caption: `🚨🔥 O PokeNight TÁ DE VOLTA! 🔥🚨
O servidor retorna com a sua base padrão, inspirado em OTPokemon + Memories, mas agora com muitas novidades chegando pra elevar o nível do game 👊⚡

Estamos trazendo sistema de IV e EV, deixando os Pokémon muito mais únicos e estratégicos, além de várias outras features que vão ser reveladas em breve 👀✨

Se tu curte Pokémon e quer viver essa nova fase do servidor desde o começo, já chega junto pra não perder nada!

🎥 Último vídeo sobre o retorno do servidor:
https://youtu.be/ZBabyVdPUhU?si=o3qYZiTFhC73Ylth

💬 Entra na comunidade e acompanha todas as novidades:
https://youtu.be/ZBabyVdPUhU?si=o3qYZiTFhC73Ylth

PokeNight voltou… e agora é pra ficar`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/charizard.png',
      thumbnailUrl: '/pokemon/charizard.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: true,
      source: 'example',
    },
    {
      id: '2',
      title: '⚡ Sistema IV/EV Chegando! ⚡',
      description: `⚡ Sistema IV/EV Chegando! ⚡

Prepare-se para uma nova era de batalhas estratégicas no PokeNight! 

🎯 Individual Values (IV) - Cada Pokémon será único
💪 Effort Values (EV) - Treine seus Pokémon do seu jeito
🔥 Competitivo de verdade - Mostre suas habilidades

Novidades em breve! 👀`,
      caption: `⚡ Sistema IV/EV Chegando! ⚡

Prepare-se para uma nova era de batalhas estratégicas no PokeNight! 

🎯 Individual Values (IV) - Cada Pokémon será único
💪 Effort Values (EV) - Treine seus Pokémon do seu jeito
🔥 Competitivo de verdade - Mostre suas habilidades

Novidades em breve! 👀`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/pikachu.png',
      thumbnailUrl: '/pokemon/pikachu.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: true,
      source: 'example',
    },
    {
      id: '3',
      title: '🎮 Servidor Online! 🎮',
      description: `🎮 Servidor Online! 🎮

O PokeNight está de volta e melhor que nunca!

✨ Base OTPokemon + Memories
🆕 Novos sistemas chegando
🌟 Comunidade ativa
🎯 Eventos semanais

Entre agora e seja um dos pioneiros! 

Discord: discord.gg/pokenight`,
      caption: `🎮 Servidor Online! 🎮

O PokeNight está de volta e melhor que nunca!

✨ Base OTPokemon + Memories
🆕 Novos sistemas chegando
🌟 Comunidade ativa
🎯 Eventos semanais

Entre agora e seja um dos pioneiros! 

Discord: discord.gg/pokenight`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/mewtwo.png',
      thumbnailUrl: '/pokemon/mewtwo.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: false,
      source: 'example',
    },
    {
      id: '4',
      title: '🏆 Torneio PvP em Breve! 🏆',
      description: `🏆 Torneio PvP em Breve! 🏆

Prepare seu time! O primeiro torneio oficial do PokeNight está chegando!

🎁 Prêmios exclusivos
⚔️ Batalhas épicas
👑 Prove que você é o melhor

Fique ligado para mais informações!`,
      caption: `🏆 Torneio PvP em Breve! 🏆

Prepare seu time! O primeiro torneio oficial do PokeNight está chegando!

🎁 Prêmios exclusivos
⚔️ Batalhas épicas
👑 Prove que você é o melhor

Fique ligado para mais informações!`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/rayquaza.png',
      thumbnailUrl: '/pokemon/rayquaza.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 96).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: false,
      source: 'example',
    },
    {
      id: '5',
      title: '🌟 Novos Pokémon Raros! 🌟',
      description: `🌟 Novos Pokémon Raros! 🌟

Explore o mundo e capture Pokémon raros e lendários!

✨ Shinies disponíveis
🔥 Lendários em eventos
💎 Sistema de raridade único

A aventura te espera! 🗺️`,
      caption: `🌟 Novos Pokémon Raros! 🌟

Explore o mundo e capture Pokémon raros e lendários!

✨ Shinies disponíveis
🔥 Lendários em eventos
💎 Sistema de raridade único

A aventura te espera! 🗺️`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/mew.png',
      thumbnailUrl: '/pokemon/mew.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 120).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: false,
      source: 'example',
    },
    {
      id: '6',
      title: '💬 Comunidade Crescendo! 💬',
      description: `💬 Comunidade Crescendo! 💬

Junte-se a centenas de jogadores no Discord!

🎮 Ajuda de veteranos
🤝 Faça amigos
📢 Notícias em primeira mão
🎉 Eventos exclusivos

Discord: discord.gg/pokenight
Instagram: @pokenightofc`,
      caption: `💬 Comunidade Crescendo! 💬

Junte-se a centenas de jogadores no Discord!

🎮 Ajuda de veteranos
🤝 Faça amigos
📢 Notícias em primeira mão
🎉 Eventos exclusivos

Discord: discord.gg/pokenight
Instagram: @pokenightofc`,
      mediaType: 'IMAGE',
      mediaUrl: '/pokemon/snorlax.png',
      thumbnailUrl: '/pokemon/snorlax.png',
      permalink: 'https://www.instagram.com/pokenightofc/',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 144).toISOString(),
      username: 'pokenightofc',
      category: 'Instagram',
      featured: false,
      source: 'example',
    },
  ];
}
