'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { formatCurrency } from '@/lib/utils/format';

export function JackpotWinScreen() {
  const isJackpotWon = useGameStore((s) => s.isJackpotWon);
  const jackpotAmount = useGameStore((s) => s.jackpotAmount);
  const clearJackpot = useGameStore((s) => s.clearJackpot);
  const setSpinState = useGameStore((s) => s.setSpinState);

  useEffect(() => {
    if (isJackpotWon) {
      import('canvas-confetti').then((confetti) => {
        const end = Date.now() + 3000;
        const frame = () => {
          confetti.default({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
          });
          confetti.default({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      });
    }
  }, [isJackpotWon]);

  function handleClose() {
    clearJackpot();
    setSpinState('idle');
  }

  return (
    <AnimatePresence>
      {isJackpotWon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-6xl"
            >
              🎰
            </motion.p>
            <h1
              className="mt-4 text-5xl font-black md:text-7xl jackpot-flash"
              style={{ fontFamily: 'var(--font-display)', color: '#fbbf24' }}
            >
              JACKPOT!
            </h1>
            <p
              className="mt-4 text-4xl font-black md:text-6xl"
              style={{ fontFamily: 'var(--font-display)', color: '#fbbf24' }}
            >
              {formatCurrency(jackpotAmount)}
            </p>
            <p className="mt-2 text-lg" style={{ color: 'var(--app-text-muted)' }}>
              moedas adicionadas ao seu saldo!
            </p>
            <button
              onClick={handleClose}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-black"
              style={{ background: '#fbbf24' }}
            >
              Coletar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
