'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Flame,
  Sparkles,
  AlertCircle,
  Newspaper,
  Zap,
  Star,
  Instagram,
} from 'lucide-react';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Instagram':
      return Instagram;
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
    case 'Instagram':
      return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0';
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
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/instagram');
      const data = await response.json();

      if (data.success && data.posts) {
        const instagramPosts = data.posts.slice(0, 6).map(post => ({
          id: post.id,
          title: post.title,
          description: post.caption || post.excerpt,
          category: 'Instagram',
          date: post.timestamp,
          featured: false,
          permalink: post.permalink,
          mediaUrl: post.thumbnailUrl || post.mediaUrl,
        }));
        
        if (instagramPosts.length > 0) instagramPosts[0].featured = true;
        if (instagramPosts.length > 1) instagramPosts[1].featured = true;

        setNews(instagramPosts);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredNews = news.filter((item) => item.featured);
  const regularNews = news.filter((item) => !item.featured);

  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-pokemon-yellow/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-pokemon-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <div>
            <div className="flex justify-center mb-4">
              <img 
                src="/pokemon/meowth.png" 
                alt="Meowth" 
                className="w-20 h-20 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform duration-300"
              />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-pokenight-yellow/30 bg-pokenight-yellow/10 px-4 py-1.5">
              <Newspaper className="h-5 w-5 text-pokenight-yellow" />
              <span className="font-semibold text-pokenight-yellow">
                Ultimas Noticias
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              <span className='text-foreground'>Novidades e </span><span className="text-pokenight-yellow">Notícias</span>
            </h2>
            <div className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]" aria-hidden="true" />
            <p className="mt-5 text-muted-foreground">
              Fique por dentro de tudo que acontece no Instagram
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando notícias...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma notícia disponível no momento.</p>
          </div>
        ) : (
          <>
            {featuredNews.length > 0 && (
              <div className="mb-8 grid gap-6 lg:grid-cols-2">
                {featuredNews.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  return (
                    <a key={item.id} href={item.permalink} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="group h-full overflow-hidden border-2 border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-xl">
                        {item.mediaUrl && (
                          <div className="relative h-48 w-full overflow-hidden bg-muted">
                            <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="mb-3 flex items-center gap-3">
                            <Badge className={`gap-1.5 px-3 py-1 font-semibold shadow-sm ${getCategoryColor(item.category)}`}>
                              <CategoryIcon className="h-3.5 w-3.5" />
                              {item.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                            <Star className="mr-2 inline h-5 w-5 text-pokemon-yellow" />
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-line text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            )}

            {regularNews.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {regularNews.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  return (
                    <a key={item.id} href={item.permalink} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="group h-full border-2 border-border bg-card shadow-md transition-all hover:border-primary/50 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <Badge className={`gap-1 text-xs font-semibold ${getCategoryColor(item.category)}`}>
                              <CategoryIcon className="h-3 w-3" />
                              {item.category}
                            </Badge>
                          </div>
                          <h3 className="mb-2 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                          <p className="mb-3 whitespace-pre-line text-sm text-muted-foreground line-clamp-4">{item.description}</p>
                          <div className="flex items-center justify-start">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center sm:hidden">
          <a href="https://www.instagram.com/pokenightofc/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 border-2 bg-transparent font-semibold">
              Ver Mais no Instagram
              <Instagram className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
