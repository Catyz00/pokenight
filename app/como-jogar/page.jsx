import Link from 'next/link';
import {
  Download,
  BookOpen,
  Play,
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
      {/* Hero minimalista */}
      <section className="mb-20 text-center">
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
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Cadastro</h2>
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
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Download</h2>
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
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Tutorial</h2>
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
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Wiki</div>
                  <div className="text-sm hover:text-black">Guias completos</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>

            <a 
              href="https://www.youtube.com/embed/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-semibold">Vídeo Tutorial</div>
                  <div className="text-sm text-muted-foreground">Frokie Irado</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        {/* Contato */}
        <section className="rounded-lg bg-muted/50 p-8 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">Precisa de ajuda?</h3>
          <a 
            href="mailto:contato@pokenight.com" 
            className="text-primary hover:underline"
          >
            contato@pokenight.com
          </a>
        </section>
      </article>
    </main>
  );
}