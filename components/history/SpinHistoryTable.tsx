'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { SpinRecord } from '@/types/database';
import { SpinHistoryRow } from './SpinHistoryRow';
import { HistoryFilters } from './HistoryFilters';

type HistoryFilter = 'all' | 'wins' | 'losses' | 'jackpots' | 'bonus';

export function SpinHistoryTable() {
  const [spins, setSpins] = useState<SpinRecord[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const supabase = createBrowserClient();

      let query = supabase
        .from('spins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter === 'wins') query = query.gt('payout', 0);
      if (filter === 'losses') query = query.eq('payout', 0);
      if (filter === 'jackpots') query = query.eq('is_jackpot', true);
      if (filter === 'bonus') query = query.eq('is_bonus_round', true);

      const { data } = await query;
      setSpins((data as SpinRecord[]) ?? []);
      setLoading(false);
    }
    fetchHistory();
  }, [filter]);

  return (
    <div className="space-y-4">
      <HistoryFilters active={filter} onChange={setFilter} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass h-16 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : spins.length === 0 ? (
        <p className="py-8 text-center" style={{ color: 'var(--app-text-muted)' }}>
          Nenhum spin registrado.
        </p>
      ) : (
        <div className="space-y-2">
          {spins.map((spin) => (
            <SpinHistoryRow key={spin.id} spin={spin} />
          ))}
        </div>
      )}
    </div>
  );
}
