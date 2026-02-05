'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Download,
  Play,
  Trophy,
  Sparkles,
  Zap,
  Crown,
  Award,
  Star,
  Flame,
  Target,
} from 'lucide-react';

// Dados mockados de conquistas (somente 4)
const MOCK_ACHIEVEMENTS = [
  { id: 1, playerName: 'Ash', achievement: 'capturou seu primeiro Legendary!', time: '2 min', icon: 'crown', emoji: '👑' },
  { id: 2, playerName: 'Misty', achievement: 'completou a Pokédex da Região Kanto', time: '5 min', icon: 'trophy', emoji: '🏆' },
  { id: 3, playerName: 'Brock', achievement: 'derrotou o Elite Four', time: '8 min', icon: 'award', emoji: '⚔️' },
  { id: 4, playerName: 'Gary', achievement: 'alcançou Level 100', time: '12 min', icon: 'star', emoji: '⭐' },
];

const ICON_MAP = {
  crown: Crown,
  trophy: Trophy,
  award: Award,
  star: Star,
  flame: Flame,
  zap: Zap,
  target: Target,
  sparkles: Sparkles,
};

const ACHIEVEMENT_COLORS = [
  'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'from-red-500/20 to-rose-500/20 border-red-500/30',
];

export function Hero() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);

  // Countdown para proximo torneio - data de exemplo
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(20, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simula novas conquistas
  useEffect(() => {
    const interval = setInterval(() => {
      const icons = ['crown', 'trophy', 'award', 'star', 'flame', 'zap', 'target', 'sparkles'];
      const emojis = ['🎮', '⚡', '🔥', '💎', '🌟', '🎯', '💪', '🎉', '🏅', '👑', '⚔️', '🛡️'];
      const newAchievement = {
        id: Date.now(),
        playerName: ['Ash', 'Misty', 'Brock', 'Gary', 'Red', 'Blue'][Math.floor(Math.random() * 6)],
        achievement: [
          'capturou um Pokémon raro',
          'venceu uma batalha épica',
          'derrotou um Boss',
          'encontrou um item especial',
          'evoluiu um Pokémon',
          'completou uma missão lendária',
        ][Math.floor(Math.random() * 6)],
        time: 'agora',
        icon: icons[Math.floor(Math.random() * icons.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      };
      setAchievements((prev) => [newAchievement, ...prev.slice(0, 3)]); // Máximo de 4 conquistas
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Colorful Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pokenight-yellow/5 to-pokenight-red/10" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-pokenight-yellow/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pokenight-red/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-pokenight-yellow/50 bg-pokenight-yellow/20 px-4 py-1.5 text-sm font-semibold text-pokenight-yellow">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Novo Evento Disponivel
            <Zap className="h-4 w-4" />
          </div>

          {/* Title */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">A Melhor Experiencia</span>
            <span className="mt-2 block text-pokenight-yellow">
              Pokemon Online
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Junte-se a milhares de treinadores em uma aventura epica. Capture,
            treine e batalhe com seus Pokemon favoritos em um mundo vasto e
            cheio de desafios.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/download">
              <Button
                size="lg"
                className="gap-2 px-8 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
              >
                <Download className="h-5 w-5" />
                Baixar Jogo Gratis
              </Button>
            </Link>
            <Link href="/como-jogar">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-2 px-8 text-base font-semibold bg-transparent hover:bg-secondary hover:text-pokenight-text"
              >
                <Play className="h-5 w-5" />
                Como Jogar
              </Button>
            </Link>
          </div>

          {/* Tournament Countdown */}
          <div className="mx-auto mt-16 max-w-lg">
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-xl shadow-primary/10">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-pokemon-yellow" />
                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                  Proximo Torneio em
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    label: 'Dias',
                    value: countdown.days,
                    color: 'from-pokemon-red to-pokemon-orange',
                  },
                  {
                    label: 'Horas',
                    value: countdown.hours,
                    color: 'from-pokemon-blue to-primary',
                  },
                  {
                    label: 'Min',
                    value: countdown.minutes,
                    color: 'from-pokemon-green to-pokemon-blue',
                  },
                  {
                    label: 'Seg',
                    value: countdown.seconds,
                    color: 'from-pokemon-purple to-pokemon-red',
                  },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div
                      className={`rounded-xl bg-gradient-to-br ${item.color} p-0.5 shadow-lg`}
                    >
                      <div className="rounded-[10px] bg-card px-3 py-3 text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/eventos" className="mt-4 block">
                <Button
                  variant="ghost"
                  className="w-full font-semibold text-primary hover:bg-primary/10 hover:text-pokenight-bg"
                >
                  Ver Detalhes do Torneio
                </Button>
              </Link>
            </div>
          </div>

          {/* Conquistas Recentes - Feed ao Vivo */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-2xl border-2 border-transparent bg-transparent p-6">
              
              <div className="space-y-2">
                {achievements.slice(0, 4).map((achievement, index) => {
                  const IconComponent = ICON_MAP[achievement.icon] || Trophy;
                  const colorClass = ACHIEVEMENT_COLORS[index % ACHIEVEMENT_COLORS.length];
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${colorClass} hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm relative overflow-hidden group`}
                      style={{
                        animation: index === 0 ? 'slideIn 0.5s ease-out, glow 2s ease-in-out infinite' : 'none',
                        opacity: index === 3 ? 0.3 : 1,
                        transform: index === 3 ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.5s ease-out',
                      }}
                    >
                      {/* Efeito de brilho */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      {/* Emoji grande */}
                      <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                        {achievement.emoji}
                      </div>

                      {/* Ícone da conquista */}
                      <div className="rounded-full bg-background/80 p-2.5 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <IconComponent className="w-5 h-5 text-[var(--color-pokenight-yellow)]" />
                      </div>

                      {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug font-medium">
                        <span className="font-bold text-white drop-shadow-lg">
                          {achievement.playerName}
                        </span>
                        {' '}
                        <span className="text-white/90">
                          {achievement.achievement}
                        </span>
                        {index === 0 && <span className="ml-2 text-xs">✨ NOVO!</span>}
                      </p>
                    </div>

                    {/* Tempo */}
                    <div className="text-xs font-semibold text-white/70 whitespace-nowrap bg-black/20 px-2 py-1 rounded-full">
                      {achievement.time}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(234, 179, 8, 0.6);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}</style>
    </section>
  );
}
