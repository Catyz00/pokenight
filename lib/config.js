// Application configuration and constants

export const SITE_CONFIG = {
  name: 'PokeNight',
  description: 'Jogue Pokemon online no PokeNight com ranking, eventos, torneios e uma comunidade ativa',
  url: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/pokenight',
    github: 'https://github.com/pokenight',
  },
}

// URLs da API - Essas são usadas no código, mas vêm do .env
// NUNCA hardcode URLs de produção aqui!
export const API_CONFIG = {
  // Server-side only (não exposto ao browser)
  backend: process.env.BACKEND_URL || 'http://localhost',
  
  // Client-side (pode ser acessado pelo browser)
  nextApi: process.env.NEXT_PUBLIC_API_URL || '/api',
}

// ⚠️ IMPORTANTE: 
// - process.env.BACKEND_URL é privado (server-side only)
// - process.env.NEXT_PUBLIC_* são públicos (expostos ao browser)
// - Configure no .env.local para desenvolvimento
// - Configure no provedor (Vercel, etc.) para produção

export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Home', public: true },
  { href: '/parceiros', label: 'Parceiros', public: true },
  { href: '/admin', label: 'Admin', public: false },
]

export const ADMIN_NAVIGATION_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'home' },
  { href: '/admin/jogadores', label: 'Jogadores', icon: 'users' },
  { href: '/admin/eventos', label: 'Eventos', icon: 'calendar' },
  { href: '/admin/noticias', label: 'Notícias', icon: 'newspaper' },
  { href: '/admin/rankings', label: 'Rankings', icon: 'trophy' },
  { href: '/admin/parceiros', label: 'Parceiros', icon: 'handshake' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: 'settings' },
]

export const PAGINATION_LIMIT = 10
export const CACHE_DURATION = 60
