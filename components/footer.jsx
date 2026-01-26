import Link from 'next/link';
import {
  Download,
  Map,
  Trophy,
  Users,
  BookOpen,
  Video,
  HelpCircle,
  Shield,
  Swords,
  Calendar,
  Gamepad2,
  Heart,
} from 'lucide-react';

const footerLinks = {
  jogar: [
    { name: 'Como Jogar', href: '/como-jogar', icon: BookOpen },
    { name: 'Baixar Jogo', href: '/download', icon: Download },
    { name: 'Regras', href: '/regras', icon: Shield },
  ],
  comunidade: [
    { name: 'Mapa Pokemon', href: '/mapa', icon: Map },
    { name: 'Eventos', href: '/eventos', icon: Calendar },
    { name: 'Clas', href: '/clas', icon: Swords },
    { name: 'Ranking', href: '/ranking', icon: Trophy },
  ],
  recursos: [
    { name: 'Wiki', href: '/wiki', icon: BookOpen },
    { name: 'Videos', href: '/videos', icon: Video },
    { name: 'Suporte', href: '/suporte', icon: HelpCircle },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-border bg-card">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-pokemon-yellow/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              {/* Coloque o arquivo de imagem em public/pokenight-logo.png */}
              <img src="/logopokenight.png" alt="PokeNight" className="h-30 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A melhor experiencia Pokemon online. Junte-se a milhares de
              treinadores e comece sua jornada.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-2">
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-pokemon-blue hover:bg-pokemon-blue/10 hover:text-pokemon-blue"
                aria-label="Discord"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-pokemon-red hover:bg-pokemon-red/10 hover:text-pokemon-red"
                aria-label="YouTube"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-pokemon-purple hover:bg-pokemon-purple/10 hover:text-pokemon-purple"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-foreground hover:bg-foreground/10 hover:text-foreground"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
              <Gamepad2 className="h-4 w-4" />
              Jogar
            </h3>
            <ul className="space-y-3">
              {footerLinks.jogar.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-pokemon-blue underline-offset-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
              <Users className="h-4 w-4" />
              Comunidade
            </h3>
            <ul className="space-y-3">
              {footerLinks.comunidade.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-pokemon-blue underline-offset-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-4 w-4" />
              Recursos
            </h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-pokemon-blue underline-offset-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-border pt-8 sm:flex-row">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-sm">2026 PokeNight</span>
            
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-pokemon-red" /> por
            <Link
              className="ml-1 font-medium text-primary hover:underline hover:decoration-pokemon-blue underline-offset-2"
              href="https://catarinaribeirodev.vercel.app/"
            >
              Catarina Dalsan
            </Link>
          </p>
          <div className="flex gap-6">
            <Link
              href="/termos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-pokemon-blue underline-offset-2"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-pokemon-blue underline-offset-2"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
