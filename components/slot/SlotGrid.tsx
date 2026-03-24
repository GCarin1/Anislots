'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { Reel } from './Reel';

export function SlotGrid() {
  const symbols = useGameStore((s) => s.symbols);
  const spinState = useGameStore((s) => s.spinState);
  const paylinesWon = useGameStore((s) => s.paylinesWon);

  const winningPositions = useMemo(() => {
    const positions: Map<number, Set<number>> = new Map();
    if (spinState === 'idle' && paylinesWon.length > 0) {
      paylinesWon.forEach((pl) => {
        if (pl.index >= 0) {
          pl.payline.forEach((row, col) => {
            if (!positions.has(col)) positions.set(col, new Set());
            positions.get(col)!.add(row);
          });
        }
      });
    }
    return positions;
  }, [paylinesWon, spinState]);

  const spinning = spinState === 'spinning';

  return (
    <div className="flex items-center justify-center gap-2">
      {symbols.map((colSymbols, col) => (
        <Reel
          key={col}
          symbols={colSymbols}
          spinning={spinning}
          delay={col * 0.1}
          winningRows={winningPositions.get(col)}
        />
      ))}
    </div>
  );
}
