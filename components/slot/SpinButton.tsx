'use client';

import { motion } from 'framer-motion';
import { useSlot } from '@/hooks/useSlot';
import { useGameStore } from '@/lib/store/gameStore';

export function SpinButton() {
  const { executeSpin, canSpin } = useSlot();
  const spinState = useGameStore((s) => s.spinState);
  const isBonusSpin = useGameStore((s) => s.isBonusSpin);

  const spinning = spinState === 'spinning' || spinState === 'stopping';
  const disabled = !canSpin || isBonusSpin;

  return (
    <motion.button
      onClick={executeSpin}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={
        spinning
          ? {
              boxShadow: [
                '0 0 20px var(--waifu-glow)',
                '0 0 50px var(--waifu-glow)',
                '0 0 20px var(--waifu-glow)',
              ],
            }
          : {}
      }
      transition={spinning ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } : {}}
      className="relative h-16 w-full max-w-xs rounded-2xl font-bold text-white shadow-lg transition-all disabled:opacity-40 md:h-20"
      style={{
        fontFamily: 'var(--font-display)',
        background: !disabled
          ? `linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))`
          : 'rgba(255,255,255,0.1)',
        boxShadow: !disabled ? '0 0 30px var(--waifu-glow)' : 'none',
      }}
    >
      {spinning ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="inline-block text-2xl"
        >
          🎰
        </motion.span>
      ) : isBonusSpin ? (
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-lg tracking-wider"
        >
          FREE SPIN
        </motion.span>
      ) : (
        <span className="text-xl tracking-wider">SPIN</span>
      )}
    </motion.button>
  );
}
