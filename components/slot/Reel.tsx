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

const SPIN_EMOJIS = ['🍒', '⭐', '💖', '🔴', '🔵', '💎', '🌸', '🔥'];

export function Reel({ symbols, spinning, delay, winningRows = new Set() }: ReelProps) {
  return (
    <div
      className={`reel-container flex flex-col gap-1 p-1 transition-shadow duration-300 ${spinning ? 'reel-spinning' : ''}`}
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      {spinning ? (
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, -60, -120, -60, 0] }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            ease: 'linear',
            delay,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex h-14 w-14 items-center justify-center text-3xl"
              style={{ filter: 'blur(1.5px)' }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.05,
              }}
            >
              {SPIN_EMOJIS[Math.floor(Math.random() * SPIN_EMOJIS.length)]}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ y: -30, filter: 'blur(2px)' }}
          animate={{ y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay }}
        >
          {symbols.map((sym, row) => (
            <motion.div
              key={row}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + row * 0.05, duration: 0.2 }}
            >
              <Symbol key={row} symbolId={sym} isWinning={winningRows.has(row)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
