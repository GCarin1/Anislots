'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { cn } from '@/lib/utils/cn';

const AUTO_SPIN_OPTIONS = [5, 10, 25, 50];

export function AutoSpinControls() {
  const { autoSpinActive, autoSpinRemaining, isBonusSpin, startAutoSpin, stopAutoSpin, spinState } =
    useGameStore();

  if (autoSpinActive && isBonusSpin) {
    return (
      <div className="rounded-lg bg-yellow-500/20 px-4 py-2 text-sm font-bold text-yellow-400">
        Free Spins ({autoSpinRemaining})
      </div>
    );
  }

  if (autoSpinActive) {
    return (
      <button
        onClick={stopAutoSpin}
        className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/30"
      >
        Parar ({autoSpinRemaining})
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
        Auto:
      </span>
      {AUTO_SPIN_OPTIONS.map((count) => (
        <button
          key={count}
          onClick={() => startAutoSpin(count)}
          disabled={spinState !== 'idle'}
          className={cn(
            'rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-30',
          )}
        >
          {count}
        </button>
      ))}
    </div>
  );
}
