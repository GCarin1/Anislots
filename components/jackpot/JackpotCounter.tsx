'use client';

import { motion } from 'framer-motion';
import { useJackpot } from '@/hooks/useJackpot';
import { formatCurrency } from '@/lib/utils/format';

export function JackpotCounter() {
  const jackpot = useJackpot();

  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="glass rounded-2xl p-4 text-center"
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#fbbf24' }}>
        Jackpot
      </p>
      <p
        className="text-3xl font-black md:text-4xl"
        style={{ fontFamily: 'var(--font-display)', color: '#fbbf24' }}
      >
        {formatCurrency(jackpot)}
      </p>
    </motion.div>
  );
}
