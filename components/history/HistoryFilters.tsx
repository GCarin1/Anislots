'use client';

import { cn } from '@/lib/utils/cn';

type HistoryFilter = 'all' | 'wins' | 'losses' | 'jackpots' | 'bonus';

interface HistoryFiltersProps {
  active: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
}

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'wins', label: 'Ganhos' },
  { key: 'losses', label: 'Perdas' },
  { key: 'jackpots', label: 'Jackpots' },
  { key: 'bonus', label: 'Bônus' },
];

export function HistoryFilters({ active, onChange }: HistoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            active === f.key
              ? 'bg-[var(--waifu-primary)] text-white'
              : 'bg-white/5 hover:bg-white/10',
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
