'use client';

import { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

interface UseProfileReturn {
  profile: Profile | null;
  email: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    setEmail(user.email ?? null);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data as Profile);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }, []);

  return { profile, email, isLoading, signOut, refresh: fetchProfile };
}
