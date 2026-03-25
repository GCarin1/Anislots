'use client';

import { useRouter } from 'next/navigation';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { DailyBonusButton } from '@/components/wallet/DailyBonusButton';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { useWallet } from '@/hooks/useWallet';

export default function WalletPage() {
  const router = useRouter();
  useWallet();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg transition-colors hover:bg-white/10"
          aria-label="Voltar"
        >
          ←
        </button>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          Carteira
        </h1>
      </div>

      <WalletBalance />
      <DailyBonusButton />

      <div>
        <h2 className="mb-4 text-lg font-bold">Transações Recentes</h2>
        <TransactionHistory />
      </div>
    </div>
  );
}
