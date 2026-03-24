'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/lobby';
    }
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h1
        className="mb-2 text-center text-3xl font-bold text-glow-waifu"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        AniSlots
      </h1>
      <p className="mb-8 text-center" style={{ color: 'var(--app-text-muted)' }}>
        Entre para jogar
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--waifu-primary)]"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--waifu-primary)]"
            placeholder="********"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 font-bold text-white transition-all glow-waifu disabled:opacity-50"
          style={{ background: 'var(--waifu-primary)' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
          ou
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleOAuth('google')}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-medium transition-colors hover:bg-white/10"
        >
          Google
        </button>
        <button
          onClick={() => handleOAuth('discord')}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#5865F2]/20 py-3 font-medium transition-colors hover:bg-[#5865F2]/30"
        >
          Discord
        </button>
      </div>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
        Não tem conta?{' '}
        <Link href="/register" className="font-medium" style={{ color: 'var(--waifu-primary)' }}>
          Criar conta
        </Link>
      </p>
    </div>
  );
}
