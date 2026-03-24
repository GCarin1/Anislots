'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export function useJackpot() {
  const [jackpot, setJackpot] = useState(50000);

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase
      .from('jackpot')
      .select('current_amount')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setJackpot(data.current_amount);
      });

    const channel = supabase
      .channel('jackpot-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'jackpot',
          filter: 'id=eq.1',
        },
        (payload) => {
          setJackpot((payload.new as { current_amount: number }).current_amount);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return jackpot;
}
