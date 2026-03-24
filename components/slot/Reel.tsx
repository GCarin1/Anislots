'use client';

import { motion } from 'framer-motion';
import type { SymbolId } from '@/lib/slot/symbols';
import { Symbol } from './Symbol';

interface ReelProps {
  symbols: SymbolId[];
  spinning: boolean;
  delay: number;
  winningRows?: Set<number>;
}

export function Reel({ symbols, spinning, delay, winningRows = new Set() }: ReelProps) {
  return (
    <div className="reel-container flex flex-col gap-1 p-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
      {spinning ? (
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, -60, -120, -60, 0] }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            ease: 'linear',
            delay,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex h-14 w-14 items-center justify-center text-3xl">
              {['🍒', '⭐', '💖', '🔴', '🔵'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay }}
        >
          {symbols.map((sym, row) => (
            <Symbol key={row} symbolId={sym} isWinning={winningRows.has(row)} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
