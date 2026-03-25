'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatProfileData, type FormattedProfile } from '@/lib/profile/profile';

interface ProfileStats {
  total_winnings: number;
  biggest_win: number;
  total_spins: number;
  jackpots_won: number;
}

interface ProfileState {
  profile: FormattedProfile | null;
  stats: ProfileStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile() {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    stats: null,
    isLoading: true,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) {
        throw new Error('Falha ao carregar perfil');
      }

      const data = await res.json();
      const formatted = formatProfileData(data.profile, data.email, data.wallet);

      setState({
        profile: formatted,
        stats: data.stats,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      }));
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { ...state, refetch: fetchProfile };
}
