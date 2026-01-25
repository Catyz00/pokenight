import { NextResponse } from 'next/server';

let cachedToken = null;
let tokenExpiry = null;

async function getTwitchAccessToken() {
  // Verifica se o token em cache ainda é válido
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET || '';

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' },
    );

    if (!response.ok) {
      throw new Error('Failed to get Twitch access token');
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Token expira em expires_in segundos, guardamos com 5 min de margem
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error('Error getting Twitch token:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const accessToken = await getTwitchAccessToken();
    const clientId =
      process.env.TWITCH_CLIENT_ID || 'kw7rdnm9cp8d2cr4egtot6wpmchw7n';

    // Buscar todos os streams ao vivo
    const response = await fetch(
      'https://api.twitch.tv/helix/streams?first=100',
      {
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Twitch streams');
    }

    const data = await response.json();

    // Filtrar streams que contêm "pokenight.com.br" no título
    const pokeNightStreams = data.data.filter((stream) =>
      stream.title.toLowerCase().includes('pokenight.com.br'),
    );

    // Buscar informações dos usuários
    if (pokeNightStreams.length > 0) {
      const userIds = pokeNightStreams.map((s) => s.user_id).join('&id=');
      const usersResponse = await fetch(
        `https://api.twitch.tv/helix/users?id=${userIds}`,
        {
          headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const usersMap = {};
        usersData.data.forEach((user) => {
          usersMap[user.id] = user;
        });

        // Combinar dados de streams com dados de usuários
        const enrichedStreams = pokeNightStreams.map((stream) => {
          const user = usersMap[stream.user_id];
          return {
            id: stream.id,
            userId: stream.user_id,
            username: stream.user_login,
            displayName: stream.user_name,
            title: stream.title,
            game: stream.game_name,
            viewers: stream.viewer_count,
            thumbnail: stream.thumbnail_url
              .replace('{width}', '440')
              .replace('{height}', '248'),
            profileImage: user?.profile_image_url || '',
            isLive: true,
            startedAt: stream.started_at,
          };
        });

        return NextResponse.json({
          success: true,
          data: enrichedStreams,
          count: enrichedStreams.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
    });
  } catch (error) {
    console.error('Error fetching Twitch streams:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        data: [],
        count: 0,
      },
      { status: 500 },
    );
  }
}
