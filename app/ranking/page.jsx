'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Target,
  BookOpen,
  Skull,
  Castle,
  Crown,
  Medal,
} from 'lucide-react';

// Dados de exemplo - na versao real viram do PHP/MariaDB
const rankingsData = {
  level: [
    { rank: 'Gold', score: 1803, name: 'A B E L', color: 'rank-gold' },
    { rank: 'Red', score: 1970, name: 'ZaRaKl KeNChi', color: 'rank-red' },
    { rank: 'Green', score: 1813, name: 'DuDuNR', color: 'rank-green' },
    { rank: 'Silver', score: 1737, name: 'WeSLeYZZz', color: 'rank-silver' },
    { rank: 'Blue', score: 1716, name: 'N i k l a u s', color: 'rank-blue' },
    { rank: 'Black', score: 1700, name: 'Sr Diniz', color: 'rank-black' },
    {
      rank: 'Purple',
      score: 1355,
      name: 'SAVAGE ROMANTICO',
      color: 'rank-purple',
    },
  ],
  tournament: [
    { rank: 'Gold', score: 3625, name: 'ABEL-IX', color: 'rank-gold' },
    { rank: 'Red', score: 4153, name: 'ZaRaKl KeNChi', color: 'rank-red' },
    { rank: 'Silver', score: 2650, name: 'RaFaZin xD', color: 'rank-silver' },
    { rank: 'Green', score: 2155, name: 'DuDuNR', color: 'rank-green' },
    { rank: 'Black', score: 2153, name: 'ArcanjoFrost', color: 'rank-black' },
    {
      rank: 'Purple',
      score: 1774,
      name: 'SAVAGE ROMANTICO',
      color: 'rank-purple',
    },
    { rank: 'Blue', score: 1695, name: 'AndreW C', color: 'rank-blue' },
  ],
  catch: [
    { rank: 'Gold', score: 224631, name: 'Daruma', color: 'rank-gold' },
    { rank: 'Red', score: 179482, name: 'Eutibato', color: 'rank-red' },
    { rank: 'Silver', score: 98526, name: 'Etopeu', color: 'rank-silver' },
    { rank: 'Green', score: 97574, name: 'Mither Otp', color: 'rank-green' },
    { rank: 'Blue', score: 93823, name: 'Theu Zekrom', color: 'rank-blue' },
    { rank: 'Black', score: 79950, name: 'H O L Y', color: 'rank-black' },
    { rank: 'Purple', score: 40529, name: 'Tuts Tranks', color: 'rank-purple' },
  ],
  pokedex: [
    {
      rank: 'Gold',
      score: 1533,
      name: 'ProF ViinG SchroedeR',
      color: 'rank-gold',
    },
    { rank: 'Red', score: 1530, name: 'Lord Joker II', color: 'rank-red' },
    { rank: 'Silver', score: 1530, name: 'L i n k e', color: 'rank-silver' },
    { rank: 'Green', score: 1526, name: 'G A L E N Y', color: 'rank-green' },
    { rank: 'Black', score: 1524, name: 'Magnata Dolly', color: 'rank-black' },
    { rank: 'Blue', score: 1508, name: 'Theu Zekrom', color: 'rank-blue' },
    {
      rank: 'Purple',
      score: 1437,
      name: 'K I M B E R L L Y',
      color: 'rank-purple',
    },
  ],
  bestiary: [
    { rank: 'Gold', score: 621, name: 'Pauloof', color: 'rank-gold' },
    {
      rank: 'Green',
      score: 549,
      name: 'Criador de Exeggutor',
      color: 'rank-green',
    },
    { rank: 'Red', score: 548, name: 'ZaRaKI KeNChi', color: 'rank-red' },
    {
      rank: 'Purple',
      score: 518,
      name: 'Bestiary EnVeNeNaDo',
      color: 'rank-purple',
    },
    { rank: 'Blue', score: 512, name: 'Dabliu Jota', color: 'rank-blue' },
    {
      rank: 'Silver',
      score: 468,
      name: 'I Tio Patinhas I',
      color: 'rank-silver',
    },
    { rank: 'Black', score: 366, name: 'ImonTe', color: 'rank-black' },
  ],
  tower: [
    { rank: 'Gold', score: 0, name: '-', color: 'rank-gold' },
    { rank: 'Black', score: 1347076, name: 'Blackstars', color: 'rank-black' },
    { rank: 'Silver', score: 1343145, name: 'WANTED', color: 'rank-silver' },
    {
      rank: 'Red',
      score: 1320661,
      name: 'Trovao do Agreste',
      color: 'rank-red',
    },
    { rank: 'Green', score: 0, name: '-', color: 'rank-green' },
    { rank: 'Blue', score: 0, name: '-', color: 'rank-blue' },
    { rank: 'Purple', score: 0, name: '-', color: 'rank-purple' },
  ],
};

const tabs = [
  { id: 'level', label: 'Top Level', icon: Trophy },
  { id: 'tournament', label: 'Torneio', icon: Trophy },
  { id: 'catch', label: 'Capturas', icon: Target },
  { id: 'pokedex', label: 'Pokedex', icon: BookOpen },
  { id: 'bestiary', label: 'Bestiario', icon: Skull },
  { id: 'tower', label: 'Torre', icon: Castle },
];

const getRankBadgeColor = (color) => {
  const colors = {
    'rank-gold': 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950',
    'rank-silver': 'bg-gradient-to-r from-slate-300 to-gray-400 text-slate-900',
    'rank-bronze':
      'bg-gradient-to-r from-orange-400 to-amber-600 text-orange-950',
    'rank-red': 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
    'rank-green': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
    'rank-blue': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    'rank-black': 'bg-gradient-to-r from-zinc-700 to-zinc-900 text-white',
    'rank-purple': 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
  };
  return colors[color] || colors['rank-silver'];
};

const getPositionStyle = (index) => {
  if (index === 0)
    return {
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/30',
    };
  if (index === 1)
    return {
      icon: Medal,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10 border-slate-400/30',
    };
  if (index === 2)
    return {
      icon: Medal,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/30',
    };
  return {
    icon: null,
    color: 'text-muted-foreground',
    bg: 'bg-muted/50 border-border',
  };
};

export default function Rankings() {
  const [activeTab, setActiveTab] = useState('level');

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-1.5">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Hall da Fama</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Rankings Globais
          </h2>
          <p className="mt-3 text-muted-foreground">
            Acompanhe os melhores jogadores em cada categoria
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-2.5 font-medium shadow-sm transition-all data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card className="border-2 border-border bg-card shadow-xl">
                <CardHeader className="border-b border-border bg-muted/30">
                  <CardTitle className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <tab.icon className="h-5 w-5 text-primary" />
                    </div>
                    {tab.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {rankingsData[tab.id]
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => {
                        const position = getPositionStyle(index);
                        const PositionIcon = position.icon;
                        return (
                          <div
                            key={`${player.name}-${index}`}
                            className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all hover:scale-[1.01] hover:shadow-md ${position.bg}`}
                          >
                            {/* Position */}
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-card text-lg font-bold ${position.color} shadow-sm`}
                            >
                              {PositionIcon ? (
                                <PositionIcon className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>

                            {/* Rank Badge */}
                            <div
                              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ${getRankBadgeColor(player.color)}`}
                            >
                              +{player.rank}
                            </div>

                            {/* Player Name */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-foreground">
                                {player.name}
                              </p>
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-xl font-bold tabular-nums text-primary">
                                {player.score.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                pontos
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
