'use client';

import { useProfile } from '@/hooks/useProfile';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { WAIFU_THEMES } from '@/lib/waifus/themes';

export default function ProfilePage() {
  const { profile, email, isLoading, signOut } = useProfile();
  const { balance } = useWallet();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
        <div className="glass h-40 animate-pulse rounded-2xl" />
        <div className="glass h-60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p style={{ color: 'var(--app-text-muted)' }}>Não foi possível carregar o perfil.</p>
      </div>
    );
  }

  const waifu = WAIFU_THEMES.find((w) => w.id === profile.selected_waifu);

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
      >
        Perfil
      </h1>

      {/* Avatar e nome */}
      <div className="glass flex items-center gap-4 rounded-2xl p-6">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold"
          style={{
            background: `linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))`,
          }}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            profile.username.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            {email}
          </p>
        </div>
      </div>

      {/* Informações */}
      <div className="glass space-y-4 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--app-text-muted)' }}>
          Informações
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Saldo</span>
            <span
              className="font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
            >
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Waifu favorita</span>
            <span className="flex items-center gap-2 font-medium">
              {waifu?.emoji} {waifu?.name ?? profile.selected_waifu}
            </span>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Membro desde</span>
            <span className="text-sm font-medium">{formatDate(profile.created_at)}</span>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Última atualização</span>
            <span className="text-sm font-medium">{formatDate(profile.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
      >
        Sair da conta
      </button>
    </div>
  );
}
