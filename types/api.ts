import type { BonusReward } from './game';

export interface SpinRequest {
  bet_amount: number;
  waifu_theme: string;
  nonce: number;
  is_bonus_resolution?: boolean;
  bonus_choice?: 0 | 1 | 2;
  bonus_spin_id?: string;
}

export interface SpinResponse {
  success: boolean;
  symbols: string[][];
  paylines_won: Array<{
    index: number;
    symbol: string;
    count: number;
    payout: number;
  }>;
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

export interface WalletResponse {
  virtual_coins: number;
  last_daily_bonus_at: string | null;
}

export interface DailyBonusResponse {
  success: boolean;
  bonus: number;
  new_balance: number;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}
