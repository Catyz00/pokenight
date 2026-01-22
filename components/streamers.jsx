"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tv, Users, ExternalLink, Circle, Youtube, ChevronRight } from "lucide-react";
import Link from "next/link";

// Dados de exemplo - substitua por chamadas à sua API PHP
const mockTwitchStreamers = [
  {
    id: "1",
    username: "PokeTrainerMax",
    displayName: "PokeTrainer Max",
    title: "🔴 CAÇANDO SHINY RARO! | pokenight.com.br",
    game: "Pokemon",
    viewers: 1250,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=320&h=180&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=70&h=70&fit=crop",
    isLive: true,
  },
  {
    id: "2",
    username: "AshMasterBR",
    displayName: "Ash Master BR",
    title: "TORNEIO SEMANAL AO VIVO | pokenight.com.br",
    game: "Pokemon",
    viewers: 890,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=180&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=70&h=70&fit=crop",
    isLive: true,
  },
  {
    id: "3",
    username: "MistyWaterPoke",
    displayName: "Misty Water",
    title: "Farmando EXP com a galera! pokenight.com.br",
    game: "Pokemon",
    viewers: 567,
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=320&h=180&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=70&h=70&fit=crop",
    isLive: true,
  },
  {
    id: "4",
    username: "BrockGymLeader",
    displayName: "Brock Gym Leader",
    title: "Desafio dos 100 Pokemon | pokenight.com.br",
    game: "Pokemon",
    viewers: 432,
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=320&h=180&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&h=70&fit=crop",
    isLive: true,
  },
];

function TwitchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

export function Streamers() {
  const [streamers, setStreamers] = useState(mockTwitchStreamers);
  const [isLoading, setIsLoading] = useState(false);

  // Aqui você faria a chamada para sua API PHP que busca da Twitch
  // useEffect(() => {
  //   fetch('/api/twitch/streams?search=pokenight.com.br')
  //     .then(res => res.json())
  //     .then(data => setStreamers(data))
  // }, [])

  const liveCount = streamers.filter((s) => s.isLive).length;

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                <TwitchIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Streamers ao Vivo</h2>
              {liveCount > 0 && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Circle className="w-2 h-2 fill-current mr-1" />
                  {liveCount} AO VIVO
                </Badge>
              )}
            </div>
            <p className="text-gray-600">
              Criadores de conteudo com <span className="font-semibold text-purple-600">pokenight.com.br</span> no titulo
            </p>
          </div>
          <Link href="/parceiros">
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent">
              Ver todos os parceiros
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Streamers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : streamers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {streamers.slice(0, 4).map((streamer) => (
              <a
                key={streamer.id}
                href={`https://twitch.tv/${streamer.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={streamer.thumbnail || "/placeholder.svg"}
                      alt={streamer.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Live Badge */}
                    {streamer.isLive && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-600 text-white text-xs font-bold">
                          <Circle className="w-2 h-2 fill-current mr-1 animate-pulse" />
                          AO VIVO
                        </Badge>
                      </div>
                    )}
                    {/* Viewers */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {streamer.viewers.toLocaleString()}
                      </Badge>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={streamer.profileImage || "/placeholder.svg"}
                        alt={streamer.displayName}
                        className="w-10 h-10 rounded-full ring-2 ring-purple-400"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                          {streamer.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{streamer.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <TwitchIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum streamer ao vivo</h3>
            <p className="text-gray-500">
              Streamers com <span className="font-semibold">pokenight.com.br</span> no titulo aparecerao aqui
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}
