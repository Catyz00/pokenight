import Link from 'next/link';
import {
  Download,
  BookOpen,
  Play,
  User,
  Youtube,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Como Jogar — PokeNight',
  description: 'Tutorial básico para começar a jogar PokeNight - cadastro, download e dicas iniciais.',
};

export default function ComoJogarPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-6 py-20 sm:px-8">
  <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pokenight-yellow/5 to-pokenight-red/10" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-pokenight-yellow/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pokenight-red/10 blur-3xl" />
      </div>
      {/* Hero minimalista */}
      <section className="mb-20 text-center">
        {/* Pokémon acima do título */}
        <div className="flex justify-center mb-4">
          <img 
            src="/pokemon/squirtle.png" 
            alt="Squirtle" 
            className="w-20 h-20 object-contain opacity-90 hover:opacity-100 transition-opacity animate-bounce"
          />
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
          <span className="text-foreground">Como&nbsp;</span>
          <span className="text-[var(--color-pokenight-yellow)]">Jogar</span>
        </h1>
        <div
          className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
          aria-hidden="true"
        />
        <p className="mx-auto max-w-xl text-lg text-muted-foreground mt-5">
          Um guia simples para começar sua jornada no PokeNight
        </p>
      </section>

      {/* Conteúdo principal */}
      <article className="space-y-16">
          {/* Seção 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Cadastro</h2>
            </div>
            <p className="pl-13 text-muted-foreground">
              Crie sua conta em poucos minutos. Configure seus dados e personagem.
              Recomendamos usar um email válido para recuperação de conta.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Download</h2>
            </div>
            <p className="pl-13 text-muted-foreground">
              Baixe o launcher oficial. Ele verificará atualizações e instalará o jogo
              automaticamente. Simples e rápido.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Tutorial</h2>
            </div>
            <p className="pl-13 text-muted-foreground">
              Siga o tutorial inicial no jogo. Você começará em uma cidade estilo Pallet e
              aprenderá os comandos básicos. Jogar com amigos torna tudo mais divertido.
            </p>
          </section>

        {/* Recursos */}
        <section className="space-y-6 border-t pt-16">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Recursos</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Link 
              href="/wiki"
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors transition-shadow transform hover:bg-accent hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary group-hover:text-[var(--color-primary-foreground)]" />
                <div>
                  <div className="font-semibold transition-colors group-hover:text-[var(--color-primary-foreground)]">Wiki</div>
                  <div className="text-sm text-muted-foreground transition-colors group-hover:text-[var(--color-primary-foreground)]">Guias completos</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-primary-foreground)]" />
            </Link>
            <a 
              href="https://www.youtube.com/watch?v=Z6FFYfOcEk0"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors transition-shadow transform hover:bg-accent hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-semibold transition-colors group-hover:text-[var(--color-primary-foreground)]">Vídeo Tutorial</div>
                  <div className="text-sm text-muted-foreground transition-colors group-hover:text-[var(--color-primary-foreground)]">
Canal Guiis</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-primary-foreground)]" />
            </a>
          </div>
        </section>

        {/* Contato */}
        <section className="rounded-lg bg-muted/50 p-8 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">Precisa de ajuda?</h3>
          <a 
            href="mailto:pokenightguiis7@gmail.com" 
            className="text-primary hover:underline"
          >
           pokenightguiis7@gmail.com
          </a>
        </section>
      </article>
    </main>
  );
}