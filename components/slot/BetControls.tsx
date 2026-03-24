'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatCurrency } from '@/lib/utils/format';

export function BetControls() {
  const betAmount = useGameStore((s) => s.betAmount);
  const increaseBet = useGameStore((s) => s.increaseBet);
  const decreaseBet = useGameStore((s) => s.decreaseBet);
  const maxBet = useGameStore((s) => s.maxBet);
  const spinState = useGameStore((s) => s.spinState);

  const disabled = spinState !== 'idle';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={decreaseBet}
        disabled={disabled}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-bold transition-colors hover:bg-white/10 disabled:opacity-30"
      >
        -
      </button>

      <div className="glass min-w-[120px] rounded-lg px-4 py-2 text-center">
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          Aposta
        </p>
        <p
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          {formatCurrency(betAmount)}
        </p>
      </div>

      <button
        onClick={increaseBet}
        disabled={disabled}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-bold transition-colors hover:bg-white/10 disabled:opacity-30"
      >
        +
      </button>

      <button
        onClick={maxBet}
        disabled={disabled}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase transition-colors hover:bg-white/10 disabled:opacity-30"
      >
        Max
      </button>
    </div>
  );
}
