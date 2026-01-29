'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="relative ml-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar jogador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 border-2 pl-9 lg:w-64"
              />
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
              
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Entrar
                </Button>
              </Link>
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
                <Link href="/auth/login" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 bg-transparent font-medium"
                  >
                    Entrar
                  </Button>
                </Link>
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
