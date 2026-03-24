'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { href: '/lobby', label: 'Lobby', icon: '🏠' },
  { href: '/slot', label: 'Jogar', icon: '🎰' },
  { href: '/leaderboard', label: 'Ranking', icon: '🏆' },
  { href: '/history', label: 'Histórico', icon: '📜' },
  { href: '/wallet', label: 'Carteira', icon: '💰' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors',
              isActive ? 'text-[var(--waifu-primary)]' : 'text-[var(--app-text-muted)]',
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={cn('font-medium', isActive && 'text-glow-waifu')}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
