'use client';

import { motion } from 'framer-motion';
import { useSlot } from '@/hooks/useSlot';
import { useGameStore } from '@/lib/store/gameStore';

export function SpinButton() {
  const { executeSpin, canSpin } = useSlot();
  const spinState = useGameStore((s) => s.spinState);

  const spinning = spinState === 'spinning' || spinState === 'stopping';

  return (
    <motion.button
      onClick={executeSpin}
      disabled={!canSpin}
      whileTap={canSpin ? { scale: 0.95 } : {}}
      className="relative h-16 w-full max-w-xs rounded-2xl font-bold text-white shadow-lg transition-all disabled:opacity-40 md:h-20"
      style={{
        fontFamily: 'var(--font-display)',
        background: canSpin
          ? `linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))`
          : 'rgba(255,255,255,0.1)',
        boxShadow: canSpin ? '0 0 30px var(--waifu-glow)' : 'none',
      }}
    >
      {spinning ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block text-2xl"
        >
          🎰
        </motion.span>
      ) : (
        <span className="text-xl tracking-wider">SPIN</span>
      )}
    </motion.button>
  );
}
