'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency } from '@/lib/utils/format';
import { canClaimDailyBonus } from '@/lib/wallet/dailyBonus';
import { DAILY_BONUS_AMOUNT } from '@/lib/utils/constants';

export function DailyBonusButton() {
  const { lastDailyBonusAt, claimDailyBonus } = useWallet();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState('');

  const check = canClaimDailyBonus(lastDailyBonusAt, Date.now());
  const canClaim = check.canClaim && !claimed && !loading;

  async function handleClaim() {
    if (!canClaim) return;

    setLoading(true);
    setError('');

    try {
      const result = await claimDailyBonus();
      if (result.success) {
        setClaimed(true);
      } else {
        setError(result.error ?? 'Erro ao coletar bônus');
      }
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      onClick={handleClaim}
      disabled={!canClaim}
      whileHover={canClaim ? { scale: 1.02 } : {}}
      whileTap={canClaim ? { scale: 0.98 } : {}}
      className="glass w-full rounded-2xl p-4 text-center transition-all disabled:opacity-50"
      style={canClaim ? { borderColor: 'var(--waifu-primary)', borderWidth: '1px' } : {}}
    >
      <p className="text-2xl">{claimed ? '✅' : '🎁'}</p>
      <p className="mt-1 text-sm font-bold">
        {claimed ? 'Coletado!' : check.canClaim ? 'Coletar Bônus Diário' : 'Volte amanhã'}
      </p>
      {canClaim && (
        <p className="text-xs" style={{ color: 'var(--waifu-primary)' }}>
          +{formatCurrency(DAILY_BONUS_AMOUNT)} moedas
        </p>
      )}
      {loading && (
        <p className="mt-1 text-xs" style={{ color: 'var(--app-text-muted)' }}>
          Processando...
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </motion.button>
  );
}
