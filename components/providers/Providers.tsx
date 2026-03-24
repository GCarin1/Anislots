'use client';

import { SupabaseProvider } from './SupabaseProvider';
import { ThemeProvider } from './ThemeProvider';
import { SoundProvider } from './SoundProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <SoundProvider>{children}</SoundProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
}
