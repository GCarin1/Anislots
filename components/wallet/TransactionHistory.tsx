'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Transaction } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils/format';

const typeLabels: Record<string, string> = {
  spin_bet: 'Aposta',
  spin_win: 'Ganho',
  bonus: 'Bônus',
  daily_bonus: 'Bônus Diário',
  jackpot: 'Jackpot',
  deposit: 'Depósito',
  withdraw: 'Saque',
};

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setTransactions((data as Transaction[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass h-12 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center" style={{ color: 'var(--app-text-muted)' }}>
        Nenhuma transação ainda.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.id} className="glass flex items-center justify-between rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium">{typeLabels[tx.type] ?? tx.type}</p>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
              {formatDate(tx.created_at)}
            </p>
          </div>
          <span
            className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {tx.amount > 0 ? '+' : ''}
            {formatCurrency(tx.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
