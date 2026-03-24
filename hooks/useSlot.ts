'use client';

import { useCallback, useRef } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { useWalletStore } from '@/lib/store/walletStore';
import { useSound } from './useSound';
import type { SoundKey } from '@/lib/sounds/soundManager';

export function useSlot() {
  const {
    spinState,
    setSpinState,
    betAmount,
    selectedWaifu,
    setSymbols,
    setLastResult,
    setIsBonusRound,
    setJackpotWon,
    nonce,
    incrementNonce,
    autoSpinActive,
    decrementAutoSpin,
    stopAutoSpin,
  } = useGameStore();

  const { balance, setBalance } = useWalletStore();
  const { play } = useSound();
  const abortRef = useRef(false);

  const executeSpin = useCallback(async () => {
    if (spinState !== 'idle') return;
    if (balance < betAmount) {
      stopAutoSpin();
      return;
    }

    abortRef.current = false;
    setSpinState('spinning');
    play('spin_start');
    incrementNonce();

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bet_amount: betAmount,
          waifu_theme: selectedWaifu,
          nonce,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro no spin');
      }

      setSpinState('stopping');
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 300));
        play(`reel_stop_${i + 1}` as SoundKey);
      }

      setSymbols(data.symbols);
      setLastResult(data.payout, data.multiplier, data.paylines_won);
      setBalance(data.new_balance);

      if (data.is_jackpot) {
        setSpinState('jackpot');
        play('jackpot');
        setJackpotWon(data.jackpot_amount);
      } else if (data.is_bonus_round) {
        setSpinState('bonus');
        play('bonus_enter');
        setIsBonusRound(true);
      } else {
        if (data.payout > betAmount * 10) play('win_mega');
        else if (data.payout > 0) play(data.multiplier >= 3 ? 'win_big' : 'win_small');
        setSpinState('idle');
        if (autoSpinActive) decrementAutoSpin();
      }
    } catch (err) {
      console.error('[useSlot] spin error:', err);
      setSpinState('idle');
      stopAutoSpin();
    }
  }, [
    spinState,
    balance,
    betAmount,
    selectedWaifu,
    nonce,
    autoSpinActive,
    setSpinState,
    play,
    incrementNonce,
    setSymbols,
    setLastResult,
    setBalance,
    setJackpotWon,
    setIsBonusRound,
    decrementAutoSpin,
    stopAutoSpin,
  ]);

  return { executeSpin, canSpin: spinState === 'idle' && balance >= betAmount };
}
