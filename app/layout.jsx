import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/navbar/footer';
import SocialSidebar from '@/components/redes-sociais/social-sidebar';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'PokeNight',
  description:
    'Jogue Pokemon online no PokeNight com ranking, eventos, torneios e uma comunidade ativa',
  generator: 'v0.app',
  icons: {
    icon: '/polenightfllav.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <SocialSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
