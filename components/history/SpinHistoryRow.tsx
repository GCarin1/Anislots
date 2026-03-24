'use client';

import type { SpinRecord } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { WAIFU_THEMES } from '@/lib/waifus/themes';

export function SpinHistoryRow({ spin }: { spin: SpinRecord }) {
  const waifu = WAIFU_THEMES.find((w) => w.id === spin.waifu_theme);
  const isWin = spin.payout > 0;

  return (
    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
      <span className="text-lg">{waifu?.emoji ?? '🎰'}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Aposta: {formatCurrency(spin.bet_amount)}</span>
          {spin.is_jackpot && (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-400">
              JACKPOT
            </span>
          )}
          {spin.is_bonus_round && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">
              BONUS
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          {formatDate(spin.created_at)}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
          {isWin ? '+' : '-'}
          {formatCurrency(isWin ? spin.payout : spin.bet_amount)}
        </p>
        {spin.multiplier > 0 && (
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            {spin.multiplier}x
          </p>
        )}
      </div>
    </div>
  );
}
