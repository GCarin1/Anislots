'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatCurrency } from '@/lib/utils/format';
import { BASE_SYMBOLS } from '@/lib/slot/symbols';

export function PaylineDisplay() {
  const paylinesWon = useGameStore((s) => s.paylinesWon);
  const spinState = useGameStore((s) => s.spinState);

  if (spinState !== 'idle' || paylinesWon.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {paylinesWon.slice(0, 5).map((pl, idx) => {
        const sym = BASE_SYMBOLS.find((s) => s.id === pl.symbol);
        return (
          <div
            key={idx}
            className="glass flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          >
            <span>{sym?.emoji}</span>
            <span className="font-medium">x{pl.count}</span>
            <span style={{ color: 'var(--waifu-primary)' }}>+{formatCurrency(pl.payout)}</span>
          </div>
        );
      })}
      {paylinesWon.length > 5 && (
        <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          +{paylinesWon.length - 5} mais
        </span>
      )}
    </div>
  );
}
