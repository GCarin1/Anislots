'use client';

import { motion } from 'framer-motion';
import { BASE_SYMBOLS, type SymbolId } from '@/lib/slot/symbols';
import { cn } from '@/lib/utils/cn';

interface SymbolProps {
  symbolId: SymbolId;
  isWinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-10 w-10 text-xl',
  md: 'h-14 w-14 text-3xl',
  lg: 'h-18 w-18 text-4xl',
};

export function Symbol({ symbolId, isWinning = false, size = 'md' }: SymbolProps) {
  const symbol = BASE_SYMBOLS.find((s) => s.id === symbolId);
  if (!symbol) return null;

  return (
    <motion.div
      className={cn(
        'flex items-center justify-center rounded-lg',
        sizeMap[size],
        isWinning && 'ring-2 ring-[var(--waifu-primary)]',
      )}
      animate={
        isWinning
          ? {
              scale: [1, 1.2, 1],
              filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)'],
            }
          : {}
      }
      transition={isWinning ? { duration: 0.5, repeat: 3 } : {}}
    >
      <span className="select-none">{symbol.emoji}</span>
    </motion.div>
  );
}
