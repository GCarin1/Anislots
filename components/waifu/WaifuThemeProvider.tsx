'use client';

import { useEffect } from 'react';
import { getTheme } from '@/lib/waifus/themes';
import { useGameStore } from '@/lib/store/gameStore';

export function WaifuThemeProvider({ children }: { children: React.ReactNode }) {
  const selectedWaifu = useGameStore((s) => s.selectedWaifu);

  useEffect(() => {
    const theme = getTheme(selectedWaifu);
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [selectedWaifu]);

  return <>{children}</>;
}
