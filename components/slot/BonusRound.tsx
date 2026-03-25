'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useWalletStore } from '@/lib/store/walletStore';
import { formatCurrency } from '@/lib/utils/format';

const CHESTS = [
  { emoji: '🎁', label: 'Baú 1' },
  { emoji: '🎁', label: 'Baú 2' },
  { emoji: '🎁', label: 'Baú 3' },
];

export function BonusRound() {
  const isBonusRound = useGameStore((s) => s.isBonusRound);
  const setIsBonusRound = useGameStore((s) => s.setIsBonusRound);
  const setBonusReward = useGameStore((s) => s.setBonusReward);
  const setSpinState = useGameStore((s) => s.setSpinState);
  const startBonusFreeSpins = useGameStore((s) => s.startBonusFreeSpins);
  const betAmount = useGameStore((s) => s.betAmount);
  const selectedWaifu = useGameStore((s) => s.selectedWaifu);
  const nonce = useGameStore((s) => s.nonce);
  const { setBalance } = useWalletStore();

  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<{ type: string; value: number; payout: number } | null>(
    null,
  );

  async function handleChoose(choice: 0 | 1 | 2) {
    setSelected(choice);

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bet_amount: betAmount,
          waifu_theme: selectedWaifu,
          nonce,
          is_bonus_resolution: true,
          bonus_choice: choice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReward({
          type: data.bonus_reward?.type ?? 'multiplier',
          value: data.bonus_reward?.value ?? 0,
          payout: data.payout,
        });
        setBalance(data.new_balance);
        setBonusReward(data.bonus_reward);
      }
    } catch {
      // Ignore errors
    }

    setRevealed(true);
  }

  function handleClose() {
    const freeSpinsCount = reward?.type === 'free_spins' ? reward.value : 0;
    setIsBonusRound(false);
    setSpinState('idle');
    setSelected(null);
    setRevealed(false);
    setReward(null);

    if (freeSpinsCount > 0) {
      startBonusFreeSpins(freeSpinsCount);
    }
  }

  return (
    <AnimatePresence>
      {isBonusRound && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass mx-4 w-full max-w-lg rounded-3xl p-8 text-center"
          >
            <h2
              className="mb-2 text-3xl font-black text-glow-waifu"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
            >
              BONUS ROUND!
            </h2>
            <p className="mb-8" style={{ color: 'var(--app-text-muted)' }}>
              Escolha um baú para revelar seu prêmio
            </p>

            <div className="mb-8 flex justify-center gap-6">
              {CHESTS.map((chest, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => !revealed && handleChoose(idx as 0 | 1 | 2)}
                  disabled={revealed}
                  whileHover={!revealed ? { scale: 1.1, y: -5 } : {}}
                  whileTap={!revealed ? { scale: 0.95 } : {}}
                  className={`flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 text-4xl transition-all ${
                    selected === idx
                      ? 'border-[var(--waifu-primary)] glow-waifu'
                      : 'border-white/10'
                  } ${revealed && selected !== idx ? 'opacity-30' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {revealed && selected === idx ? (
                    <span className="text-3xl">
                      {reward?.type === 'multiplier' ? '💎' : '🎟️'}
                    </span>
                  ) : (
                    <span>{chest.emoji}</span>
                  )}
                </motion.button>
              ))}
            </div>

            {revealed && reward && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <p
                  className="text-2xl font-black"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
                >
                  {reward.type === 'multiplier'
                    ? `${reward.value}x Multiplicador!`
                    : `${reward.value} Free Spins!`}
                </p>
                {reward.payout > 0 && (
                  <p className="mt-1 text-lg font-bold text-green-400">
                    +{formatCurrency(reward.payout)} moedas
                  </p>
                )}
              </motion.div>
            )}

            {revealed && (
              <button
                onClick={handleClose}
                className="rounded-xl px-8 py-3 font-bold text-white"
                style={{ background: 'var(--waifu-primary)' }}
              >
                Continuar
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
