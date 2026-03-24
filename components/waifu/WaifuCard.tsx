'use client';

import { motion } from 'framer-motion';
import type { WaifuTheme } from '@/types/waifu';
import { cn } from '@/lib/utils/cn';

interface WaifuCardProps {
  theme: WaifuTheme;
  selected: boolean;
  onSelect: (id: string) => void;
}

const rarityColors: Record<string, string> = {
  common: 'bg-gray-500/20 text-gray-300',
  rare: 'bg-purple-500/20 text-purple-300',
  legendary: 'bg-yellow-500/20 text-yellow-300',
};

export function WaifuCard({ theme, selected, onSelect }: WaifuCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(theme.id)}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'glass relative flex flex-col items-center gap-3 rounded-2xl p-6 transition-all',
        selected && 'ring-2 glow-waifu',
      )}
      style={{
        borderColor: selected ? theme.colors.primary : 'transparent',
        ['--waifu-primary' as string]: theme.colors.primary,
        ['--waifu-glow' as string]: `${theme.colors.primary}66`,
      }}
    >
      {/* Rarity badge */}
      <span
        className={cn(
          'absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold uppercase',
          rarityColors[theme.rarity],
        )}
      >
        {theme.rarity}
      </span>

      {/* Waifu placeholder */}
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full text-5xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}33, ${theme.colors.accent}33)`,
          border: `2px solid ${theme.colors.primary}`,
        }}
      >
        {theme.emoji}
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold" style={{ color: theme.colors.primary }}>
          {theme.name}
        </h3>
        <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
          {theme.tagline}
        </p>
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ background: theme.colors.primary }}
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}
