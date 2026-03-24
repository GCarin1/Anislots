'use client';

import { motion } from 'framer-motion';
import { useWalletStore } from '@/lib/store/walletStore';
import { formatCurrency } from '@/lib/utils/format';

export function WalletBalance() {
  const { balance, isLoading } = useWalletStore();

  return (
    <div className="glass rounded-2xl p-6 text-center">
      <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--app-text-muted)' }}>
        Saldo Disponível
      </p>
      {isLoading ? (
        <div className="mx-auto mt-2 h-10 w-48 animate-pulse rounded-lg bg-white/10" />
      ) : (
        <motion.p
          key={balance}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="mt-2 text-4xl font-black"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          {formatCurrency(balance)}
        </motion.p>
      )}
      <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>
        moedas virtuais
      </p>
    </div>
  );
}
