'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Menu,
  X,
  Download,
  Map,
  Trophy,
  Users,
  BookOpen,
  Video,
  HelpCircle,
  ChevronDown,
  Home,
  Calendar,
  Shield,
  Swords,
  Gamepad2,
  User,
  LogOut,
} from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Como Jogar', href: '/como-jogar', icon: Download },
];

const communityLinks = [
  { name: 'Mapa Pokemon', href: '/mapa', icon: Map },
  { name: 'Eventos', href: '/eventos', icon: Calendar },
  { name: 'Casas', href: '/casas', icon: Shield },
  { name: 'Clas', href: '/clas', icon: Swords },
  { name: 'Ranking', href: '/ranking', icon: Trophy },
];

const resourceLinks = [
  { name: 'Regras', href: '/regras', icon: BookOpen },
  { name: 'Videos', href: '/videos', icon: Video },
  { name: 'Wiki', href: '/wiki', icon: BookOpen },
  { name: 'Suporte', href: '/suporte', icon: HelpCircle },
];

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const searchRef = useRef(null);

  // Verificar se o usuário está logado
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUsername(userData.username || '');
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    
    // Listener para mudanças no localStorage (quando fizer login/logout em outra aba)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accountId');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  // Buscar jogadores quando o usuário digitar
  useEffect(() => {
    const searchPlayers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/search-players?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data.success) {
          setSearchResults(data.players || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logopokenight.png"
                alt="PokeNight Logo"
                className="h-18 w-auto object-contain mt-1"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap"
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap hover:cursor-pointer">
                  <Users className="h-4 w-4" />
                  Comunidade
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 border-2">
                {communityLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="flex items-center gap-2 hover:cursor-pointer">
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap hover:cursor-pointer">
                  <BookOpen className="h-4 w-4" />
                  Recursos
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 border-2">
                {resourceLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="flex items-center gap-2 hover:cursor-pointer">
                      <link.icon className="h-4 w-4 " />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="relative ml-4" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar jogador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="w-48 border-2 pl-9 lg:w-64"
              />
              
              {/* Resultados da busca */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border-2 border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      href={`/personagem/${result.name}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{result.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Level {result.level}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      </div>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Mensagem quando não há resultados */}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border-2 border-border rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm text-muted-foreground text-center">
                    Nenhum resultado encontrado
                  </p>
                </div>
              )}
            </div>

            {/* User Profile Icon */}
            <Link href="/perfil" className="ml-4">
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all px-3"
                title="Meu Perfil"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Perfil</span>
              </Button>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {/* CTA Buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Entrar
                  </Button>
                </Link>
              )}
              <Link href="/download">
                <Button
                  size="sm"
                  className="gap-2 font-semibold shadow-md shadow-primary/30"
                >
                  <Download className="h-4 w-4" />
                  Baixar
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t-2 border-border py-4 lg:hidden">
            {/* Mobile Search */}
            <div className="relative mb-4 sm:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar jogador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 pl-9"
              />
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}

              <div className="py-2">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-primary">
                  Comunidade
                </p>
                {communityLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="py-2">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-primary">
                  Recursos
                </p>
                {resourceLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 border-t-2 border-border pt-4">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="w-full border-2 bg-transparent font-medium gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                ) : (
                  <Link href="/auth/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-2 bg-transparent font-medium"
                    >
                      Entrar
                    </Button>
                  </Link>
                )}
                <Link href="/download" className="flex-1">
                  <Button className="w-full gap-2 font-semibold shadow-md shadow-primary/30">
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
