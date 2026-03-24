'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { LeaderboardEntry } from '@/types/database';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardFilters } from './LeaderboardFilters';

type FilterType = 'all_time' | 'weekly' | 'daily';

export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>('all_time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const supabase = createBrowserClient();

      const query = supabase
        .from('leaderboard')
        .select('*')
        .order('total_winnings', { ascending: false })
        .limit(50);

      const { data } = await query;
      setEntries((data as LeaderboardEntry[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, [filter]);

  return (
    <div className="space-y-4">
      <LeaderboardFilters active={filter} onChange={setFilter} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass h-16 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center" style={{ color: 'var(--app-text-muted)' }}>
          Nenhum jogador no ranking ainda.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <LeaderboardRow key={entry.user_id} entry={entry} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
