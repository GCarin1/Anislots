'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency } from '@/lib/utils/format';
import { DAILY_BONUS_AMOUNT } from '@/lib/utils/constants';

export function DailyBonusButton() {
  const { lastDailyBonusAt, claimDailyBonus } = useWallet();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const canClaim =
    !lastDailyBonusAt ||
    Date.now() - new Date(lastDailyBonusAt).getTime() >= 24 * 60 * 60 * 1000;

  async function handleClaim() {
    setLoading(true);
    const result = await claimDailyBonus();
    setLoading(false);
    if (result.success) setClaimed(true);
  }

  return (
    <motion.button
      onClick={handleClaim}
      disabled={!canClaim || loading || claimed}
      whileHover={canClaim ? { scale: 1.02 } : {}}
      whileTap={canClaim ? { scale: 0.98 } : {}}
      className="glass w-full rounded-2xl p-4 text-center transition-all disabled:opacity-50"
      style={canClaim ? { borderColor: 'var(--waifu-primary)', borderWidth: '1px' } : {}}
    >
      <p className="text-2xl">{claimed ? '✅' : '🎁'}</p>
      <p className="mt-1 text-sm font-bold">
        {claimed ? 'Coletado!' : canClaim ? 'Coletar Bônus Diário' : 'Volte amanhã'}
      </p>
      {canClaim && !claimed && (
        <p className="text-xs" style={{ color: 'var(--waifu-primary)' }}>
          +{formatCurrency(DAILY_BONUS_AMOUNT)} moedas
        </p>
      )}
    </motion.button>
  );
}
