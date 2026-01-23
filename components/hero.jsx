'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Download,
  Play,
  Users,
  Trophy,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';

// Dados de exemplo - na versao real viram do PHP
const stats = [
  {
    label: 'Jogadores Online',
    value: '2,847',
    icon: Users,
    color: 'text-pokemon-blue',
  },
  {
    label: 'Torneios Realizados',
    value: '1,254',
    icon: Trophy,
    color: 'text-pokemon-yellow',
  },
  {
    label: 'Eventos Ativos',
    value: '12',
    icon: Calendar,
    color: 'text-pokemon-green',
  },
];

export function Hero() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <section className="relative overflow-hidden">
      {/* Colorful Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pokemon-yellow/5 to-pokemon-redxxxxxxxxxxxxx/10" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-pokemon-yellow/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pokemon-red/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-pokemon-yellow/50 bg-pokemon-yellow/20 px-4 py-1.5 text-sm font-semibold text-pokemon-orange">
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
                className="gap-2 border-2 px-8 text-base font-semibold bg-transparent hover:bg-secondary"
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
                  className="w-full font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Ver Detalhes do Torneio
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-6 shadow-md transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="rounded-full bg-muted p-3 transition-colors group-hover:bg-primary/10">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
