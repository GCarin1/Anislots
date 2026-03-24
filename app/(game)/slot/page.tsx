'use client';

import { SlotMachine } from '@/components/slot/SlotMachine';
import { JackpotCounter } from '@/components/jackpot/JackpotCounter';
import { JackpotWinScreen } from '@/components/jackpot/JackpotWinScreen';
import { useWallet } from '@/hooks/useWallet';
import { useAutoSpin } from '@/hooks/useAutoSpin';
import { useGameStore } from '@/lib/store/gameStore';
import { getTheme } from '@/lib/waifus/themes';

export default function SlotPage() {
  const selectedWaifu = useGameStore((s) => s.selectedWaifu);
  const theme = getTheme(selectedWaifu);

  // Initialize wallet and auto-spin
  useWallet();
  useAutoSpin();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {/* Waifu header */}
      <div className="text-center">
        <span className="text-3xl">{theme.emoji}</span>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          {theme.name} - {theme.tagline}
        </h2>
      </div>

      {/* Jackpot */}
      <JackpotCounter />

      {/* Slot Machine */}
      <SlotMachine />

      {/* Jackpot Win Screen Overlay */}
      <JackpotWinScreen />
    </div>
  );
}
