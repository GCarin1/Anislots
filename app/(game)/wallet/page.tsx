'use client';

import { WalletBalance } from '@/components/wallet/WalletBalance';
import { DailyBonusButton } from '@/components/wallet/DailyBonusButton';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { useWallet } from '@/hooks/useWallet';

export default function WalletPage() {
  useWallet();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
      >
        Carteira
      </h1>

      <WalletBalance />
      <DailyBonusButton />

      <div>
        <h2 className="mb-4 text-lg font-bold">Transações Recentes</h2>
        <TransactionHistory />
      </div>
    </div>
  );
}
