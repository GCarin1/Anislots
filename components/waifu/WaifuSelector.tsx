'use client';

import { WAIFU_THEMES } from '@/lib/waifus/themes';
import { useGameStore } from '@/lib/store/gameStore';
import { WaifuCard } from './WaifuCard';

export function WaifuSelector() {
  const selectedWaifu = useGameStore((s) => s.selectedWaifu);
  const setSelectedWaifu = useGameStore((s) => s.setSelectedWaifu);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {WAIFU_THEMES.map((theme) => (
        <WaifuCard
          key={theme.id}
          theme={theme}
          selected={selectedWaifu === theme.id}
          onSelect={setSelectedWaifu}
        />
      ))}
    </div>
  );
}
