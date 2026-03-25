'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { getTheme } from '@/lib/waifus/themes';
import { formatCurrency } from '@/lib/utils/format';

export function ProfileInfo() {
  const router = useRouter();
  const { profile, stats, isLoading, error } = useProfile();

  async function handleLogout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-lg" style={{ color: 'var(--app-text-muted)' }}>
          Carregando perfil...
        </span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <span className="text-red-400">{error ?? 'Perfil não encontrado'}</span>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500/20 px-6 py-2 font-bold text-red-400 transition-colors hover:bg-red-500/30"
        >
          Sair da conta
        </button>
      </div>
    );
  }

  const waifuTheme = getTheme(profile.selectedWaifu);

  return (
    <div className="space-y-6">
      {/* Avatar + Nome */}
      <div className="glass flex items-center gap-4 rounded-2xl p-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{
            background: `linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))`,
          }}
        >
          {waifuTheme.emoji}
        </div>
        <div className="flex-1">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
          >
            {profile.username}
          </h2>
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            {profile.maskedEmail}
          </p>
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            Membro desde {profile.memberSince}
          </p>
        </div>
      </div>

      {/* Saldo */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
          Carteira
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p
              className="text-2xl font-black"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
            >
              {formatCurrency(profile.balance)}
            </p>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
              Saldo atual
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(profile.totalDeposited)}
            </p>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
              Total depositado
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-orange-400">
              {formatCurrency(profile.totalWithdrawn)}
            </p>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
              Total sacado
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Total de spins" value={formatCurrency(stats.total_spins)} />
            <StatItem label="Total ganho" value={formatCurrency(stats.total_winnings)} color="text-green-400" />
            <StatItem label="Maior vitória" value={formatCurrency(stats.biggest_win)} color="text-yellow-400" />
            <StatItem label="Jackpots ganhos" value={String(stats.jackpots_won)} color="text-purple-400" />
          </div>
        </div>
      )}

      {/* Waifu ativa */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
          Waifu ativa
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{waifuTheme.emoji}</span>
          <div>
            <p className="font-bold" style={{ color: 'var(--waifu-primary)' }}>
              {waifuTheme.name}
            </p>
            <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
              {waifuTheme.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-bold text-red-400 transition-colors hover:bg-red-500/20"
      >
        Sair da conta
      </button>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color ?? ''}`}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
        {label}
      </p>
    </div>
  );
}
