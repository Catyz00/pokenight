"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  StarOff,
  CheckCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TwitchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

function YoutubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Dados de exemplo
const mockYoutubers = [
  {
    id: "1",
    channelId: "UC123456",
    channelName: "PokeNight Official",
    channelUrl: "https://youtube.com/@pokenightofficial",
    description: "Canal oficial do PokeNight com tutoriais, novidades e gameplays",
    subscribers: 125000,
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    channelId: "UC789012",
    channelName: "Pokemon Dicas BR",
    channelUrl: "https://youtube.com/@pokemondicasbr",
    description: "Dicas, truques e estrategias para Pokemon",
    subscribers: 89000,
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    channelId: "UC345678",
    channelName: "Shiny Hunter BR",
    channelUrl: "https://youtube.com/@shinyhunterbr",
    description: "Especialista em caca de Pokemon Shiny",
    subscribers: 67000,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    isVerified: false,
    isFeatured: true,
    isActive: true,
    createdAt: "2024-01-05",
  },
];

const mockTwitchSettings = {
  searchTerm: "pokenight.com.br",
  minViewers: 0,
  autoRefresh: true,
  refreshInterval: 60,
  showOffline: false,
};

const Loading = () => null;

export default function AdminParceirosPage() {
  const [youtubers, setYoutubers] = useState(mockYoutubers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingYoutuber, setEditingYoutuber] = useState(null);
  const [twitchSettings, setTwitchSettings] = useState(mockTwitchSettings);

  // Form state
  const [formData, setFormData] = useState({
    channelName: "",
    channelUrl: "",
    description: "",
    subscribers: "",
    profileImage: "",
    isVerified: false,
    isFeatured: false,
  });

  const filteredYoutubers = youtubers.filter(
    (y) =>
      y.channelName.toLowerCase().includes(search.toLowerCase()) ||
      y.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (youtuber) => {
    if (youtuber) {
      setEditingYoutuber(youtuber);
      setFormData({
        channelName: youtuber.channelName,
        channelUrl: youtuber.channelUrl,
        description: youtuber.description,
        subscribers: youtuber.subscribers.toString(),
        profileImage: youtuber.profileImage,
        isVerified: youtuber.isVerified,
        isFeatured: youtuber.isFeatured,
      });
    } else {
      setEditingYoutuber(null);
      setFormData({
        channelName: "",
        channelUrl: "",
        description: "",
        subscribers: "",
        profileImage: "",
        isVerified: false,
        isFeatured: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingYoutuber) {
      setYoutubers(
        youtubers.map((y) =>
          y.id === editingYoutuber.id
            ? {
                ...y,
                channelName: formData.channelName,
                channelUrl: formData.channelUrl,
                description: formData.description,
                subscribers: parseInt(formData.subscribers) || 0,
                profileImage: formData.profileImage,
                isVerified: formData.isVerified,
                isFeatured: formData.isFeatured,
              }
            : y
        )
      );
    } else {
      const newYoutuber = {
        id: Date.now().toString(),
        channelId: `UC${Date.now()}`,
        channelName: formData.channelName,
        channelUrl: formData.channelUrl,
        description: formData.description,
        subscribers: parseInt(formData.subscribers) || 0,
        profileImage: formData.profileImage || "https://via.placeholder.com/100",
        isVerified: formData.isVerified,
        isFeatured: formData.isFeatured,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setYoutubers([newYoutuber, ...youtubers]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja remover este parceiro?")) {
      setYoutubers(youtubers.filter((y) => y.id !== id));
    }
  };

  const handleToggleFeatured = (id) => {
    setYoutubers(
      youtubers.map((y) => (y.id === id ? { ...y, isFeatured: !y.isFeatured } : y))
    );
  };

  const handleToggleActive = (id) => {
    setYoutubers(
      youtubers.map((y) => (y.id === id ? { ...y, isActive: !y.isActive } : y))
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parceiros</h1>
            <p className="text-gray-600">Gerencie os criadores de conteudo parceiros</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TwitchIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Streamers Twitch</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <YoutubeIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{youtubers.length}</p>
                <p className="text-sm text-gray-500">Youtubers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {youtubers.filter((y) => y.isFeatured).length}
                </p>
                <p className="text-sm text-gray-500">Em Destaque</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {youtubers.filter((y) => y.isVerified).length}
                </p>
                <p className="text-sm text-gray-500">Verificados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <YoutubeIcon className="w-4 h-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="twitch" className="flex items-center gap-2">
              <TwitchIcon className="w-4 h-4" />
              Twitch
            </TabsTrigger>
          </TabsList>

          {/* YouTube Tab */}
          <TabsContent value="youtube" className="mt-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <YoutubeIcon className="w-5 h-5 text-red-600" />
                    Parceiros YouTube
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar canal..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-red-600 hover:bg-red-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Canal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>
                            {editingYoutuber ? "Editar Canal" : "Adicionar Canal do YouTube"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="channelName">Nome do Canal</Label>
                            <Input
                              id="channelName"
                              value={formData.channelName}
                              onChange={(e) =>
                                setFormData({ ...formData, channelName: e.target.value })
                              }
                              placeholder="Ex: PokeNight Official"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="channelUrl">URL do Canal</Label>
                            <Input
                              id="channelUrl"
                              value={formData.channelUrl}
                              onChange={(e) =>
                                setFormData({ ...formData, channelUrl: e.target.value })
                              }
                              placeholder="https://youtube.com/@canal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Descricao</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                              }
                              placeholder="Descricao do canal..."
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="subscribers">Inscritos</Label>
                              <Input
                                id="subscribers"
                                type="number"
                                value={formData.subscribers}
                                onChange={(e) =>
                                  setFormData({ ...formData, subscribers: e.target.value })
                                }
                                placeholder="125000"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="profileImage">URL da Foto</Label>
                              <Input
                                id="profileImage"
                                value={formData.profileImage}
                                onChange={(e) =>
                                  setFormData({ ...formData, profileImage: e.target.value })
                                }
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                id="verified"
                                checked={formData.isVerified}
                                onCheckedChange={(checked) =>
                                  setFormData({ ...formData, isVerified: checked })
                                }
                              />
                              <Label htmlFor="verified">Verificado</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                id="featured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) =>
                                  setFormData({ ...formData, isFeatured: checked })
                                }
                              />
                              <Label htmlFor="featured">Destaque</Label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                            {editingYoutuber ? "Salvar" : "Adicionar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Canal</TableHead>
                      <TableHead>Descricao</TableHead>
                      <TableHead>Inscritos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Destaque</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredYoutubers.map((youtuber) => (
                      <TableRow key={youtuber.id} className={!youtuber.isActive ? "opacity-50" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={youtuber.profileImage || "/placeholder.svg"}
                              alt={youtuber.channelName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{youtuber.channelName}</span>
                                {youtuber.isVerified && (
                                  <CheckCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <a
                                href={youtuber.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                              >
                                Ver canal <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {youtuber.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {youtuber.subscribers.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={youtuber.isActive}
                            onCheckedChange={() => handleToggleActive(youtuber.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(youtuber.id)}
                            className={youtuber.isFeatured ? "text-yellow-600" : "text-gray-400"}
                          >
                            {youtuber.isFeatured ? (
                              <Star className="w-5 h-5 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(youtuber)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(youtuber.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twitch Tab */}
          <TabsContent value="twitch" className="mt-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <TwitchIcon className="w-5 h-5 text-purple-600" />
                  Configuracoes da Twitch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="max-w-xl space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <TwitchIcon className="w-6 h-6 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-purple-900">Deteccao Automatica</h3>
                        <p className="text-sm text-purple-700">
                          Streamers que incluirem o termo configurado no titulo da live serao
                          exibidos automaticamente na pagina de parceiros.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="searchTerm">Termo de Busca</Label>
                    <Input
                      id="searchTerm"
                      value={twitchSettings.searchTerm}
                      onChange={(e) =>
                        setTwitchSettings({ ...twitchSettings, searchTerm: e.target.value })
                      }
                      placeholder="pokenight.com.br"
                    />
                    <p className="text-xs text-gray-500">
                      Streamers com esse termo no titulo aparecerao automaticamente
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minViewers">Minimo de Viewers</Label>
                    <Input
                      id="minViewers"
                      type="number"
                      value={twitchSettings.minViewers}
                      onChange={(e) =>
                        setTwitchSettings({
                          ...twitchSettings,
                          minViewers: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500">
                      Exibir apenas streams com pelo menos essa quantidade de viewers (0 = todos)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRefresh">Atualizar Automaticamente</Label>
                      <p className="text-xs text-gray-500">
                        Buscar novos streamers periodicamente
                      </p>
                    </div>
                    <Switch
                      id="autoRefresh"
                      checked={twitchSettings.autoRefresh}
                      onCheckedChange={(checked) =>
                        setTwitchSettings({ ...twitchSettings, autoRefresh: checked })
                      }
                    />
                  </div>

                  {twitchSettings.autoRefresh && (
                    <div className="space-y-2">
                      <Label htmlFor="refreshInterval">Intervalo de Atualizacao (segundos)</Label>
                      <Input
                        id="refreshInterval"
                        type="number"
                        value={twitchSettings.refreshInterval}
                        onChange={(e) =>
                          setTwitchSettings({
                            ...twitchSettings,
                            refreshInterval: parseInt(e.target.value) || 60,
                          })
                        }
                        placeholder="60"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showOffline">Mostrar Offline</Label>
                      <p className="text-xs text-gray-500">
                        Exibir streamers parceiros mesmo quando offline
                      </p>
                    </div>
                    <Switch
                      id="showOffline"
                      checked={twitchSettings.showOffline}
                      onCheckedChange={(checked) =>
                        setTwitchSettings({ ...twitchSettings, showOffline: checked })
                      }
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Salvar Configuracoes
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Testar Busca
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}
