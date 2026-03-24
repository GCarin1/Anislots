import { create } from 'zustand';

interface WalletStore {
  balance: number;
  setBalance: (balance: number) => void;
  lastDailyBonusAt: string | null;
  setLastDailyBonusAt: (date: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  lastDailyBonusAt: null,
  setLastDailyBonusAt: (date) => set({ lastDailyBonusAt: date }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
