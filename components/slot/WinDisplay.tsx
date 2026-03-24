'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { formatCurrency, formatMultiplier } from '@/lib/utils/format';

export function WinDisplay() {
  const lastPayout = useGameStore((s) => s.lastPayout);
  const lastMultiplier = useGameStore((s) => s.lastMultiplier);
  const spinState = useGameStore((s) => s.spinState);

  const showWin = spinState === 'idle' && lastPayout > 0;

  useEffect(() => {
    if (showWin && lastMultiplier >= 10) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['var(--waifu-primary)', '#fbbf24', '#f43f5e'],
        });
      });
    }
  }, [showWin, lastMultiplier]);

  return (
    <AnimatePresence>
      {showWin && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-4xl font-black text-glow-waifu"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
          >
            +{formatCurrency(lastPayout)}
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--app-text-muted)' }}>
            {formatMultiplier(lastMultiplier)}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
