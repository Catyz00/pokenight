import { NextResponse } from 'next/server';

/**
 * GET /api/instagram/refresh-token
 * Converte um token de curta duração em token de longa duração (60 dias)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortLivedToken = searchParams.get('token') || process.env.INSTAGRAM_ACCESS_TOKEN;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;

    if (!shortLivedToken || !appSecret) {
      return NextResponse.json(
        { 
          error: 'Token ou App Secret não configurado',
          help: 'Forneça o token via ?token=SEU_TOKEN ou configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_APP_SECRET no .env.local'
        },
        { status: 400 }
      );
    }

    // Trocar token de curta duração por longa duração
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Erro ao renovar token', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      expiresInDays: Math.floor(data.expires_in / 86400),
      message: '✅ Token renovado com sucesso!',
      instructions: [
        '1. Copie o accessToken acima',
        '2. Cole no .env.local como INSTAGRAM_ACCESS_TOKEN',
        '3. Reinicie o servidor (npm run dev)',
        `4. Este token expira em ${Math.floor(data.expires_in / 86400)} dias`,
        '5. Configure um lembrete para renovar antes de expirar'
      ]
    });

  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    return NextResponse.json(
      { error: 'Erro ao renovar token', message: error.message },
      { status: 500 }
    );
  }
}
