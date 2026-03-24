import type { SymbolId } from '@/lib/slot/symbols';
import type { Payline } from '@/lib/slot/paylines';

export type SpinState = 'idle' | 'spinning' | 'stopping' | 'bonus' | 'jackpot';

export interface WonPayline {
  index: number;
  payline: Payline;
  symbol: SymbolId;
  count: number;
  payout: number;
}

export interface BonusReward {
  type: 'multiplier' | 'freespins';
  value: number;
}

export interface SpinClientResult {
  success: boolean;
  symbols: SymbolId[][];
  paylines_won: WonPayline[];
  scatter_count: number;
  is_bonus_round: boolean;
  is_jackpot: boolean;
  jackpot_amount: number;
  payout: number;
  multiplier: number;
  bonus_reward: BonusReward | null;
  new_balance: number;
  spin_id: string;
}
