'use client';

import Link from 'next/link';
import { useWalletStore } from '@/lib/store/walletStore';
import { formatCurrency } from '@/lib/utils/format';
import { useSoundContext } from '@/components/providers/SoundProvider';

export function Navbar() {
  const { balance } = useWalletStore();
  const { muted, toggleMute } = useSoundContext();

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6" style={{ background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--app-border)', boxShadow: '0 2px 20px rgba(0,0,0,0.5), 0 1px 0 var(--waifu-glow)' }}>
      <Link
        href="/lobby"
        className="text-xl font-bold text-glow-waifu"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        AniSlots
      </Link>

      <div className="flex items-center gap-4">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Saldo
          </span>
          <span
            className="font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
          >
            {formatCurrency(balance)}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          title={muted ? 'Ativar som' : 'Mutar som'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <Link
          href="/wallet"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
        >
          💰
        </Link>
      </div>
    </nav>
  );
}
