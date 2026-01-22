"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  ExternalLink,
  Circle,
  Search,
  Play,
  Eye,
  Heart,
  Star,
} from "lucide-react";

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Dados de exemplo da Twitch
const mockTwitchStreamers = [
  {
    id: "1",
    username: "PokeTrainerMax",
    displayName: "PokeTrainer Max",
    title: "CACANDO SHINY RARO! | pokenight.com.br",
    game: "Pokemon",
    viewers: 1250,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=70&h=70&fit=crop",
    isLive: true,
    followers: 45000,
  },
  {
    id: "2",
    username: "AshMasterBR",
    displayName: "Ash Master BR",
    title: "TORNEIO SEMANAL AO VIVO | pokenight.com.br",
    game: "Pokemon",
    viewers: 890,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=70&h=70&fit=crop",
    isLive: true,
    followers: 32000,
  },
  {
    id: "3",
    username: "MistyWaterPoke",
    displayName: "Misty Water",
    title: "Farmando EXP com a galera! pokenight.com.br",
    game: "Pokemon",
    viewers: 567,
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=70&h=70&fit=crop",
    isLive: true,
    followers: 28000,
  },
  {
    id: "4",
    username: "BrockGymLeader",
    displayName: "Brock Gym Leader",
    title: "Desafio dos 100 Pokemon | pokenight.com.br",
    game: "Pokemon",
    viewers: 432,
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&h=70&fit=crop",
    isLive: true,
    followers: 19000,
  },
  {
    id: "5",
    username: "PikachuFan99",
    displayName: "Pikachu Fan",
    title: "Maratona Pokemon | pokenight.com.br",
    game: "Pokemon",
    viewers: 0,
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f1f78?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=70&h=70&fit=crop",
    isLive: false,
    followers: 15000,
  },
  {
    id: "6",
    username: "EliteTrainerBR",
    displayName: "Elite Trainer BR",
    title: "Competitivo Pokemon | pokenight.com.br",
    game: "Pokemon",
    viewers: 0,
    thumbnail: "https://images.unsplash.com/photo-1560419015785-5658abf4ff4e?w=400&h=225&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=70&h=70&fit=crop",
    isLive: false,
    followers: 22000,
  },
];

// Dados de exemplo do YouTube (cadastrados manualmente)
const mockYoutubers = [
  {
    id: "1",
    channelId: "UC123456",
    channelName: "PokeNight Official",
    description: "Canal oficial do PokeNight com tutoriais, novidades e gameplays",
    subscribers: 125000,
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=200&fit=crop",
    isVerified: true,
    isFeatured: true,
    latestVideo: {
      title: "NOVO UPDATE! Tudo sobre a Geracao 9",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=320&h=180&fit=crop",
      views: 45000,
      date: "2024-01-15",
    },
  },
  {
    id: "2",
    channelId: "UC789012",
    channelName: "Pokemon Dicas BR",
    description: "Dicas, truques e estrategias para Pokemon",
    subscribers: 89000,
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop",
    isVerified: true,
    isFeatured: false,
    latestVideo: {
      title: "TOP 10 Pokemon mais fortes do meta",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=180&fit=crop",
      views: 32000,
      date: "2024-01-14",
    },
  },
  {
    id: "3",
    channelId: "UC345678",
    channelName: "Shiny Hunter BR",
    description: "Especialista em caca de Pokemon Shiny",
    subscribers: 67000,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=200&fit=crop",
    isVerified: false,
    isFeatured: true,
    latestVideo: {
      title: "SHINY CHARIZARD EM 5 MINUTOS!",
      thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=320&h=180&fit=crop",
      views: 78000,
      date: "2024-01-13",
    },
  },
  {
    id: "4",
    channelId: "UC901234",
    channelName: "Competitivo Pokemon",
    description: "Batalhas competitivas e analises de times",
    subscribers: 45000,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=800&h=200&fit=crop",
    isVerified: false,
    isFeatured: false,
    latestVideo: {
      title: "Como montar o time perfeito",
      thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=320&h=180&fit=crop",
      views: 21000,
      date: "2024-01-12",
    },
  },
];

function Loading() {
  return null;
}

export default function ParceirosPage() {
  const searchParams = useSearchParams();
  const [searchTwitch, setSearchTwitch] = useState("");
  const [searchYoutube, setSearchYoutube] = useState("");

  const filteredTwitch = mockTwitchStreamers.filter(
    (s) =>
      s.displayName.toLowerCase().includes(searchTwitch.toLowerCase()) ||
      s.title.toLowerCase().includes(searchTwitch.toLowerCase())
  );

  const filteredYoutube = mockYoutubers.filter(
    (y) =>
      y.channelName.toLowerCase().includes(searchYoutube.toLowerCase()) ||
      y.description.toLowerCase().includes(searchYoutube.toLowerCase())
  );

  const liveCount = mockTwitchStreamers.filter((s) => s.isLive).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossos Parceiros
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Criadores de conteudo que apoiam a comunidade PokeNight. Streamers com{" "}
              <span className="font-bold bg-white/20 px-2 py-1 rounded">pokenight.com.br</span> no titulo aparecem automaticamente!
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <TwitchIcon className="w-5 h-5" />
                <span className="font-semibold">{mockTwitchStreamers.length} Streamers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <YoutubeIcon className="w-5 h-5" />
                <span className="font-semibold">{mockYoutubers.length} Youtubers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="twitch" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="twitch" className="flex items-center gap-2">
                <TwitchIcon className="w-4 h-4" />
                Twitch
                {liveCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs ml-1">
                    {liveCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <YoutubeIcon className="w-4 h-4" />
                YouTube
              </TabsTrigger>
            </TabsList>

            {/* Twitch Tab */}
            <TabsContent value="twitch">
              {/* Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar streamer..."
                    value={searchTwitch}
                    onChange={(e) => setSearchTwitch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <TwitchIcon className="w-6 h-6 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900">Como aparecer aqui?</h3>
                    <p className="text-sm text-purple-700">
                      Basta adicionar <span className="font-bold">pokenight.com.br</span> no titulo da sua live na Twitch.
                      Seu canal aparecera automaticamente enquanto estiver ao vivo!
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Now Section */}
              {liveCount > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Circle className="w-2 h-2 fill-current mr-1" />
                      AO VIVO AGORA
                    </Badge>
                    <span className="text-gray-600">{liveCount} streamers transmitindo</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTwitch
                      .filter((s) => s.isLive)
                      .map((streamer) => (
                        <TwitchCard key={streamer.id} streamer={streamer} />
                      ))}
                  </div>
                </div>
              )}

              {/* Offline Streamers */}
              {filteredTwitch.filter((s) => !s.isLive).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-6">Parceiros Offline</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTwitch
                      .filter((s) => !s.isLive)
                      .map((streamer) => (
                        <TwitchCard key={streamer.id} streamer={streamer} />
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* YouTube Tab */}
            <TabsContent value="youtube">
              {/* Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar canal..."
                    value={searchYoutube}
                    onChange={(e) => setSearchYoutube(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <YoutubeIcon className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Quer ser um parceiro?</h3>
                    <p className="text-sm text-red-700">
                      Entre em contato conosco pelo Discord ou envie um email para parcerias@pokenight.com.br
                      com o link do seu canal!
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Channels */}
              {filteredYoutube.filter((y) => y.isFeatured).length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Canais em Destaque</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredYoutube
                      .filter((y) => y.isFeatured)
                      .map((youtuber) => (
                        <YoutubeCard key={youtuber.id} youtuber={youtuber} featured />
                      ))}
                  </div>
                </div>
              )}

              {/* All Channels */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-6">Todos os Parceiros</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredYoutube.map((youtuber) => (
                    <YoutubeCard key={youtuber.id} youtuber={youtuber} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TwitchCard({ streamer }: { streamer: (typeof mockTwitchStreamers)[0] }) {
  return (
    <a
      href={`https://twitch.tv/${streamer.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        streamer.isLive
          ? "border-purple-400 hover:border-purple-500 hover:shadow-purple-500/20"
          : "border-transparent hover:border-gray-300"
      }`}>
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={streamer.thumbnail || "/placeholder.svg"}
            alt={streamer.title}
            className={`w-full h-full object-cover ${!streamer.isLive && "grayscale opacity-70"}`}
          />
          {streamer.isLive && (
            <>
              <div className="absolute top-2 left-2">
                <Badge className="bg-red-600 text-white text-xs font-bold">
                  <Circle className="w-2 h-2 fill-current mr-1 animate-pulse" />
                  AO VIVO
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {streamer.viewers.toLocaleString()}
                </Badge>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={streamer.profileImage || "/placeholder.svg"}
              alt={streamer.displayName}
              className={`w-10 h-10 rounded-full ring-2 ${streamer.isLive ? "ring-purple-400" : "ring-gray-300"}`}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                {streamer.displayName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {streamer.isLive ? streamer.title : `${streamer.followers.toLocaleString()} seguidores`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function YoutubeCard({
  youtuber,
  featured = false,
}: {
  youtuber: (typeof mockYoutubers)[0];
  featured?: boolean;
}) {
  return (
    <a
      href={`https://youtube.com/channel/${youtuber.channelId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className={`overflow-hidden border-2 border-transparent hover:border-red-400 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 hover:-translate-y-1 ${
        featured ? "md:flex" : ""
      }`}>
        {featured ? (
          <>
            {/* Featured Layout */}
            <div className="relative md:w-1/2 aspect-video md:aspect-auto">
              <img
                src={youtuber.bannerImage || "/placeholder.svg"}
                alt={youtuber.channelName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <img
                  src={youtuber.profileImage || "/placeholder.svg"}
                  alt={youtuber.channelName}
                  className="w-12 h-12 rounded-full ring-2 ring-white"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{youtuber.channelName}</h3>
                    {youtuber.isVerified && (
                      <Badge className="bg-red-600 text-white text-xs">Verificado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/80">
                    {youtuber.subscribers.toLocaleString()} inscritos
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="md:w-1/2 p-4 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-4">{youtuber.description}</p>
                {youtuber.latestVideo && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">Ultimo video</p>
                    <div className="flex gap-3">
                      <img
                        src={youtuber.latestVideo.thumbnail || "/placeholder.svg"}
                        alt={youtuber.latestVideo.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {youtuber.latestVideo.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Eye className="w-3 h-3 inline mr-1" />
                          {youtuber.latestVideo.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                <Play className="w-4 h-4 mr-2" />
                Ver Canal
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            {/* Regular Layout */}
            <div className="relative aspect-video">
              <img
                src={youtuber.latestVideo?.thumbnail || youtuber.bannerImage}
                alt={youtuber.channelName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={youtuber.profileImage || "/placeholder.svg"}
                  alt={youtuber.channelName}
                  className="w-10 h-10 rounded-full ring-2 ring-red-400"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                      {youtuber.channelName}
                    </h3>
                    {youtuber.isVerified && (
                      <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {youtuber.subscribers.toLocaleString()} inscritos
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </a>
  );
}

export { Loading };
