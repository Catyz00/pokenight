import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'PokeNight - Pokemon Online Game',
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
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
