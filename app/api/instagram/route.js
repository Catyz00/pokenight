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
    // Método 1: RSS Feed (Recomendado - não precisa de app do Facebook)
    const rssFeedUrl = process.env.INSTAGRAM_RSS_URL;
    
    if (rssFeedUrl) {
      return await fetchFromRSS(rssFeedUrl);
    }

    // Método 2: API Oficial (apenas se tiver token configurado)
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (accessToken) {
      return await fetchFromAPI(accessToken);
    }

    // Se nenhum método estiver configurado, retorna instruções
    return NextResponse.json(
      { 
        error: 'Instagram não configurado',
        message: 'Configure INSTAGRAM_RSS_URL no .env.local',
        instructions: 'Veja INSTAGRAM_ALTERNATIVE.md para configuração sem Facebook App',
        fallback: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts do Instagram', message: error.message, fallback: true },
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
