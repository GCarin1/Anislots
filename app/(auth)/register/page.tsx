'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Verifique seu email</h2>
        <p style={{ color: 'var(--app-text-muted)' }}>
          Enviamos um link de confirmação para <strong>{email}</strong>
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block font-medium"
          style={{ color: 'var(--waifu-primary)' }}
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h1
        className="mb-2 text-center text-3xl font-bold text-glow-waifu"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Criar Conta
      </h1>
      <p className="mb-8 text-center" style={{ color: 'var(--app-text-muted)' }}>
        Ganhe 10.000 moedas de boas-vindas!
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nome de usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--waifu-primary)]"
            placeholder="SeuNickname"
            minLength={2}
            maxLength={30}
            required
          />
        </div>
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
            placeholder="Mínimo 6 caracteres"
            minLength={6}
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
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
        Já tem conta?{' '}
        <Link href="/login" className="font-medium" style={{ color: 'var(--waifu-primary)' }}>
          Entrar
        </Link>
      </p>
    </div>
  );
}
