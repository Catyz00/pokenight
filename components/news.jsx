'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  ArrowRight,
  Flame,
  Sparkles,
  AlertCircle,
  Newspaper,
  Zap,
  Star,
} from 'lucide-react';

// Dados de exemplo - na versao real viram do PHP/MariaDB
const newsData = [
  {
    id: 1,
    title: 'Novo Pokemon Lendario Disponivel!',
    excerpt:
      'Rayquaza agora pode ser encontrado nas torres do evento especial. Prepare sua equipe!',
    category: 'Evento',
    date: '2026-01-20',
    featured: true,
    image: '/news/rayquaza.jpg',
  },
  {
    id: 2,
    title: 'Atualizacao de Balanceamento v2.5',
    excerpt:
      'Ajustes em diversos Pokemon para melhorar a competitividade do jogo.',
    category: 'Atualizacao',
    date: '2026-01-18',
    featured: false,
  },
  {
    id: 3,
    title: 'Torneio Mensal de Janeiro',
    excerpt:
      'Inscricoes abertas para o torneio mensal. Premios exclusivos para os top 10!',
    category: 'Torneio',
    date: '2026-01-15',
    featured: true,
  },
  {
    id: 4,
    title: 'Manutencao Programada',
    excerpt:
      'Servidor ficara offline dia 25/01 das 03:00 as 06:00 para manutencao.',
    category: 'Aviso',
    date: '2026-01-14',
    featured: false,
  },
  {
    id: 5,
    title: 'Novo Mapa: Caverna Cristal',
    excerpt:
      'Explore a nova caverna e descubra Pokemon raros do tipo Gelo e Rocha.',
    category: 'Conteudo',
    date: '2026-01-12',
    featured: false,
  },
  {
    id: 6,
    title: 'Evento de Natal Encerrado',
    excerpt:
      'Obrigado a todos que participaram! Confira os vencedores do sorteio.',
    category: 'Evento',
    date: '2026-01-10',
    featured: false,
  },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Evento':
      return Sparkles;
    case 'Torneio':
      return Flame;
    case 'Aviso':
      return AlertCircle;
    case 'Atualizacao':
      return Zap;
    default:
      return Calendar;
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Evento':
      return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0';
    case 'Torneio':
      return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0';
    case 'Aviso':
      return 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-0';
    case 'Atualizacao':
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0';
    default:
      return 'bg-gradient-to-r from-zinc-500 to-zinc-600 text-white border-0';
  }
};

export function News() {
  const featuredNews = newsData.filter((news) => news.featured);
  const regularNews = newsData.filter((news) => !news.featured);

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-pokemon-yellow/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-pokemon-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-pokemon-yellow/30 bg-pokemon-yellow/10 px-4 py-1.5">
              <Newspaper className="h-5 w-5 text-pokemon-orange" />
              <span className="font-semibold text-pokemon-orange">
                Ultimas Noticias
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Novidades e Noticias
            </h2>
            <p className="mt-3 text-muted-foreground">
              Fique por dentro de tudo que acontece no jogo
            </p>
          </div>
        </div>

        {/* Featured News */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {featuredNews.slice(0, 2).map((news) => {
            const CategoryIcon = getCategoryIcon(news.category);
            return (
              <Card
                key={news.id}
                className="group w-full overflow-hidden border-2 border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-xl"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center gap-3">
                    <Badge
                      className={`gap-1.5 px-3 py-1 font-semibold shadow-sm ${getCategoryColor(news.category)}`}
                    >
                      <CategoryIcon className="h-3.5 w-3.5" />
                      {news.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(news.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                    <Star className="mr-2 inline h-5 w-5 text-pokemon-yellow" />
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {news.excerpt}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regular News Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {regularNews.slice(0, 4).map((news) => {
            const CategoryIcon = getCategoryIcon(news.category);
            return (
              <Card
                key={news.id}
                className="group w-full border-2 border-border bg-card shadow-md transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="mb-3">
                    <Badge
                      className={`gap-1 text-xs font-semibold ${getCategoryColor(news.category)}`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {news.category}
                    </Badge>
                  </div>
                  <h3 className="mb-2 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {news.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-start">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(news.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/noticias">
            <Button
              variant="outline"
              className="gap-2 border-2 bg-transparent font-semibold"
            >
              Ver Todas as Noticias
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
