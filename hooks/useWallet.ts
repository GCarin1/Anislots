'use client';

import { useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useWalletStore } from '@/lib/store/walletStore';

export function useWallet() {
  const { balance, setBalance, lastDailyBonusAt, setLastDailyBonusAt, isLoading, setIsLoading } =
    useWalletStore();

  const fetchWallet = useCallback(async () => {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('wallets')
      .select('virtual_coins, last_daily_bonus_at')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setBalance(data.virtual_coins);
      setLastDailyBonusAt(data.last_daily_bonus_at);
    }
    setIsLoading(false);
  }, [setBalance, setLastDailyBonusAt, setIsLoading]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const claimDailyBonus = useCallback(async () => {
    const res = await fetch('/api/wallet/daily-bonus', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setBalance(data.new_balance);
      setLastDailyBonusAt(new Date().toISOString());
    }
    return data;
  }, [setBalance, setLastDailyBonusAt]);

  return { balance, lastDailyBonusAt, isLoading, fetchWallet, claimDailyBonus };
}
