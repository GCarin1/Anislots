'use client';

import type { LeaderboardEntry } from '@/types/database';
import { formatCurrency } from '@/lib/utils/format';
import { WAIFU_THEMES } from '@/lib/waifus/themes';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

const rankIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const waifu = WAIFU_THEMES.find((w) => w.id === entry.waifu_theme);

  return (
    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
      <span className="w-8 text-center text-lg font-bold">
        {rankIcons[rank] ?? `#${rank}`}
      </span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">
        {entry.avatar_url ? (
          <img src={entry.avatar_url} alt="" className="h-8 w-8 rounded-full" />
        ) : (
          entry.username.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{entry.username}</p>
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          {waifu?.emoji} {entry.total_spins} spins
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: 'var(--waifu-primary)' }}>
          {formatCurrency(entry.total_winnings)}
        </p>
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          Max: {formatCurrency(entry.biggest_win)}
        </p>
      </div>
    </div>
  );
}
