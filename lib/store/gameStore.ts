import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SymbolId } from '@/lib/slot/symbols';
import type { WonPayline, BonusReward, SpinState } from '@/types/game';
import { BET_STEPS } from '@/lib/utils/constants';

interface GameStore {
  spinState: SpinState;
  setSpinState: (s: SpinState) => void;

  symbols: SymbolId[][];
  setSymbols: (s: SymbolId[][]) => void;

  betAmount: number;
  setBetAmount: (amount: number) => void;
  increaseBet: () => void;
  decreaseBet: () => void;
  maxBet: () => void;

  selectedWaifu: string;
  setSelectedWaifu: (w: string) => void;

  lastPayout: number;
  lastMultiplier: number;
  paylinesWon: WonPayline[];
  setLastResult: (payout: number, mult: number, lines: WonPayline[]) => void;

  isBonusRound: boolean;
  setIsBonusRound: (v: boolean) => void;
  bonusReward: BonusReward | null;
  setBonusReward: (r: BonusReward | null) => void;

  isJackpotWon: boolean;
  jackpotAmount: number;
  setJackpotWon: (amount: number) => void;
  clearJackpot: () => void;

  autoSpinActive: boolean;
  autoSpinCount: number;
  autoSpinRemaining: number;
  isBonusSpin: boolean;
  startAutoSpin: (count: number) => void;
  startBonusFreeSpins: (count: number) => void;
  decrementAutoSpin: () => void;
  stopAutoSpin: () => void;

  nonce: number;
  incrementNonce: () => void;
}

export const useGameStore = create<GameStore>()(persist((set, get) => ({
  spinState: 'idle',
  setSpinState: (s) => set({ spinState: s }),

  symbols: Array.from({ length: 5 }, () => Array(3).fill('cherry' as SymbolId)),
  setSymbols: (s) => set({ symbols: s }),

  betAmount: 100,
  setBetAmount: (amount) => set({ betAmount: amount }),
  increaseBet: () => {
    const { betAmount } = get();
    const idx = BET_STEPS.indexOf(betAmount as (typeof BET_STEPS)[number]);
    if (idx < BET_STEPS.length - 1) set({ betAmount: BET_STEPS[idx + 1] });
  },
  decreaseBet: () => {
    const { betAmount } = get();
    const idx = BET_STEPS.indexOf(betAmount as (typeof BET_STEPS)[number]);
    if (idx > 0) set({ betAmount: BET_STEPS[idx - 1] });
  },
  maxBet: () => set({ betAmount: BET_STEPS[BET_STEPS.length - 1] }),

  selectedWaifu: 'sakura',
  setSelectedWaifu: (w) => set({ selectedWaifu: w }),

  lastPayout: 0,
  lastMultiplier: 0,
  paylinesWon: [],
  setLastResult: (payout, mult, lines) =>
    set({ lastPayout: payout, lastMultiplier: mult, paylinesWon: lines }),

  isBonusRound: false,
  setIsBonusRound: (v) => set({ isBonusRound: v }),
  bonusReward: null,
  setBonusReward: (r) => set({ bonusReward: r }),

  isJackpotWon: false,
  jackpotAmount: 0,
  setJackpotWon: (amount) => set({ isJackpotWon: true, jackpotAmount: amount }),
  clearJackpot: () => set({ isJackpotWon: false, jackpotAmount: 0 }),

  autoSpinActive: false,
  autoSpinCount: 0,
  autoSpinRemaining: 0,
  isBonusSpin: false,
  startAutoSpin: (count) =>
    set({ autoSpinActive: true, autoSpinCount: count, autoSpinRemaining: count, isBonusSpin: false }),
  startBonusFreeSpins: (count) =>
    set({ autoSpinActive: true, autoSpinCount: count, autoSpinRemaining: count, isBonusSpin: true }),
  decrementAutoSpin: () => {
    const { autoSpinRemaining } = get();
    if (autoSpinRemaining <= 1) {
      set({ autoSpinActive: false, autoSpinCount: 0, autoSpinRemaining: 0, isBonusSpin: false });
    } else {
      set({ autoSpinRemaining: autoSpinRemaining - 1 });
    }
  },
  stopAutoSpin: () => set({ autoSpinActive: false, autoSpinRemaining: 0, isBonusSpin: false }),

  nonce: Math.floor(Math.random() * 1000000),
  incrementNonce: () => set((s) => ({ nonce: s.nonce + 1 })),
}), {
  name: 'anislots-game',
  partialize: (state) => ({
    selectedWaifu: state.selectedWaifu,
    betAmount: state.betAmount,
  }),
}));
