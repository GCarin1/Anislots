import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import { WaifuThemeProvider } from '@/components/waifu/WaifuThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AniSlots - Slot Machine Anime',
  description: 'Jogo de caça-níquel com estética anime waifu. Escolha sua waifu e gire!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen antialiased">
        <Providers>
          <WaifuThemeProvider>{children}</WaifuThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
