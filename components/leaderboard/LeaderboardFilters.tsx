'use client';

import { cn } from '@/lib/utils/cn';

type FilterType = 'all_time' | 'weekly' | 'daily';

interface LeaderboardFiltersProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'daily', label: 'Hoje' },
  { key: 'weekly', label: 'Semana' },
  { key: 'all_time', label: 'Geral' },
];

export function LeaderboardFilters({ active, onChange }: LeaderboardFiltersProps) {
  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
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
